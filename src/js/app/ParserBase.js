import {
	GSymbol,
	Terminal,
	NonTerminal,
	ActionSymbol,
	Production,
	Grammar,
	LR0Configuration,
	LR1Configuration,
	LR0FSM,
	LR1FSM,
	LL1Parse,
	LR1Parse,
} from './ParserBase.classes';
import _ext from './_ext';

export function buildGrammar(terminalNames, nonTerminalNames, startSymbolName, rawProductions) {
	Production.serialNo = 0;

	let vocabularyNameMap = new Map();
	for(let name of terminalNames) {
		if(vocabularyNameMap.has(name))
			throw new Error(`Error: Vocabulary name '${name}' declared more than once!`);
		vocabularyNameMap.set(name, new Terminal(name));
	}
	for(let name of nonTerminalNames) {
		if(vocabularyNameMap.has(name))
			throw new Error(`Error: Vocabulary name '${name}' declared more than once!`);
		vocabularyNameMap.set(name, new NonTerminal(name));
	}

	let terminals = [...terminalNames.map(name => vocabularyNameMap.get(name)), GSymbol.EOI];
	let nonTerminals = [...nonTerminalNames.map(name => vocabularyNameMap.get(name)), GSymbol.SYSTEM_GOAL];

	let startSymbol = vocabularyNameMap.get(startSymbolName);
	if(!startSymbol)
		throw new Error(`start symbol '${startSymbolName}' no found`);

	let augmentingProduction = new Production(GSymbol.SYSTEM_GOAL, [startSymbol, GSymbol.EOI]);

	let productions = [augmentingProduction, ...rawProductions.map(function([lhsName, ...rhsNames]) {
		let lhs = vocabularyNameMap.get(lhsName);
		let rhs = rhsNames.map(name => vocabularyNameMap.get(name));
		return new Production(lhs, rhs);
	})];

	return new Grammar(terminals, nonTerminals, startSymbol, productions);
}
export function computeUnreachableSymbols(grammar) {
	let reachableVocabularies = new Set([GSymbol.SYSTEM_GOAL]);

	let processingQueue = [GSymbol.SYSTEM_GOAL];
	while(processingQueue.length !== 0) {
		let processingNT = processingQueue.shift();
		for(let production of grammar.productionsMap.get(processingNT)) {
			for(let v of production.rhs) {
				if(reachableVocabularies.has(v))
					continue;
				reachableVocabularies.add(v);
				if(v instanceof NonTerminal)
					processingQueue.push(v);
			}
		}
	}

	let unreachableSymbols = [
		...grammar.terminals,
		...grammar.nonTerminals
	].filter(symbol => !reachableVocabularies.has(symbol));

	return unreachableSymbols;
}
export function computeUnreducibleSymbols(grammar) {
	let reducibleVocabularies = new Set(grammar.terminals);
	let processingMap = new Map(grammar.productionsMap);
	let needUpdate = true;
	while(processingMap.size !== 0 && needUpdate) {
		needUpdate = false;
		for(let nt of processingMap.keys()) {
			let processingProdutions = processingMap.get(nt);
			for(let production of processingProdutions) {
				let { lhs, rhs } = production;
				let isReducible = true;
				for(let v of rhs) {
					if(!reducibleVocabularies.has(v)) {
						isReducible = false;
						break;
					}
				}
				if(isReducible) {
					reducibleVocabularies.add(lhs);
					processingMap.delete(lhs);
					needUpdate = true;
					break;
				}
			}
		}
	}

	let unreducibleSymbols = grammar.nonTerminals
		.filter(symbol => !reducibleVocabularies.has(symbol));

	return unreducibleSymbols;
}
export function computeNullableSymbols(grammar) {
	let nullableSymbols = new Set();
	let processingMap = new Map(grammar.productionsMap);
	let needUpdate = true;
	while(processingMap.size !== 0 && needUpdate) {
		needUpdate = false;
		for(let key of processingMap.keys()) {
			let processingProdutions = processingMap.get(key);
			for(let production of processingProdutions) {
				let { lhs, rhs } = production;
				let isNullable = true;
				for(let v of rhs) {
					if(!nullableSymbols.has(v)) {
						isNullable = false;
						break;
					}
				}
				if(isNullable) {
					nullableSymbols.add(lhs);
					processingMap.delete(lhs);
					needUpdate = true;
					break;
				}
			}
		}
	}

	return nullableSymbols;
}
export function buildFirstSetTable(grammar, nullableSymbols) {
	let firstSetTable = new Map();
	for(let t of grammar.terminals)
		firstSetTable.set(t, new Set([t]));
	for(let nt of grammar.nonTerminals)
		firstSetTable.set(nt, new Set([]));

	// iteratively adding FirstSet
	let lastUpdatedVocabularies = new Set(grammar.terminals);
	while(lastUpdatedVocabularies.size !== 0) {
		let newUpdatedVocabularies = new Set();
		for(let production of grammar.productions) {
			let { lhs, rhs } = production;
			let firstSetOfLHS = firstSetTable.get(lhs);
			let lhsUpdated = false;
			for(let rhsi of rhs) {
				if(lastUpdatedVocabularies.has(rhsi)) {
					let firstSetOfRHSI = firstSetTable.get(rhsi);
					let added = _ext.addAll(firstSetOfLHS, firstSetOfRHSI);
					lhsUpdated = lhsUpdated || added.size !== 0;
				}
				if(!nullableSymbols.has(rhsi))
					break;
			}
			if(lhsUpdated)
				newUpdatedVocabularies.add(lhs);
		}
		lastUpdatedVocabularies = newUpdatedVocabularies;
	}

	for(let nullableSymbol of nullableSymbols) {
		firstSetTable.get(nullableSymbol).add(GSymbol.LAMBDA);
	}

	return firstSetTable;
}
export function buildFollowSetTable(grammar, firstSetTable) {
	let followSetTable = new Map();
	let seeThroughTable = new Map();
	for(let nt of grammar.nonTerminals) {
		followSetTable.set(nt, new Set());
		seeThroughTable.set(nt, new Set());
	}

	// stage 1: adding terminals from first set (one pass)
	for(let production of grammar.productions) {
		let { lhs, rhs } = production;
		for(let i = 0; i < rhs.length; i++) {
			if(!(rhs[i] instanceof NonTerminal))
				continue;	// only consider NonTerminals

			let followSetOfRHSI = followSetTable.get(rhs[i]);
			let blocked = false;
			for(let j = i + 1; j < rhs.length; j++) {
				for(let t of firstSetTable.get(rhs[j])) {
					if(t !== GSymbol.LAMBDA)
						followSetOfRHSI.add(t);
				}
				if(!firstSetTable.get(rhs[j]).has(GSymbol.LAMBDA)) {
					blocked = true;
					break;
				}
			}
			if(!blocked) {
				seeThroughTable.get(rhs[i]).add(lhs);		// rhs[i] can see through lhs
			}
		}
	}

	// state 2: iteratively adding FollowSet
	let lastUpdatedVocabularies = new Set(grammar.nonTerminals);
	while(lastUpdatedVocabularies.size !== 0) {
		let newUpdatedVocabularies = new Set();
		for(let [nt, lhnts] of seeThroughTable) {
			let followSetOfNT = followSetTable.get(nt);
			let ntUpdated = false;
			for(let lhnt of lhnts) {
				if(lastUpdatedVocabularies.has(lhnt)) {
					let followSetOfLHNT = followSetTable.get(lhnt);
					let added = _ext.addAll(followSetOfNT, followSetOfLHNT);
					ntUpdated = ntUpdated || added.size !== 0;
				}
			}
			if(ntUpdated)
				newUpdatedVocabularies.add(nt);
		}
		lastUpdatedVocabularies = newUpdatedVocabularies;
	}
	followSetTable.get(GSymbol.SYSTEM_GOAL).add(GSymbol.LAMBDA);

	return followSetTable;
}
export function buildPredictSetTable(grammar, firstSetTable, followSetTable) {
	let predictSetTable = new Map();
	for(let production of grammar.productions) {
		let { lhs, rhs } = production;
		let predictSetOfProduction = new Set();
		let blocked = false;
		for(let i = 0; i < rhs.length; i++) {
			for(let t of firstSetTable.get(rhs[i]))
				predictSetOfProduction.add(t);
			if(!firstSetTable.get(rhs[i]).has(GSymbol.LAMBDA)) {
				blocked = true;
				break;
			}
		}
		if(!blocked) {
			for(let t of followSetTable.get(lhs))
				predictSetOfProduction.add(t);
		}

		predictSetTable.set(production, predictSetOfProduction);
	}

	return predictSetTable;
}
export function buildLL1PredictTable(grammar, predictSetTable) {
	let ll1PredictTable = new Map();
	for(let [nt, prods] of grammar.productionsMap) {
		let ntPredictSet = new Map();
		for(let prod of prods) {
			for(let t of predictSetTable.get(prod)) {
				if(!ntPredictSet.has(t))
					ntPredictSet.set(t, []);
				ntPredictSet.get(t).push(prod);
			}
		}
		ll1PredictTable.set(nt, ntPredictSet);
	}

	return ll1PredictTable;
}
export function buildLR1GotoActionTable(grammar, lr1fsm) {
	let lr1GotoActionTable = new Map();
	let globalActionMap = {
		shift: new Map(Array.from(lr1fsm.states).map((s) => [s, new LR1Parse.Action.Shift(s)])),
		pshift: new Map(Array.from(lr1fsm.states).map((s) => [s, new LR1Parse.Action.PseudoShift(s)])),
		reduce: new Map(grammar.productions.map((p) => [p, new LR1Parse.Action.Reduce(p)])),
		accept: new LR1Parse.Action.Accept(grammar.augmentingProduction)
	};
	for(let state of lr1fsm.states) {
		let gotoActionsMap = new Map();
		// general shift & accept
		for(let [symbol, nextState] of state.transitionMap) {
			if(!gotoActionsMap.has(symbol))
				gotoActionsMap.set(symbol, []);
			if(symbol === GSymbol.EOI)
				gotoActionsMap.get(symbol).push(globalActionMap.accept);
			else if(symbol instanceof Terminal)
				gotoActionsMap.get(symbol).push(globalActionMap.shift.get(nextState));
			else if(symbol instanceof NonTerminal)
				gotoActionsMap.get(symbol).push(globalActionMap.pshift.get(nextState));
			else
				throw new Error('something went wrong in transitionMap of state.');
		}
		// reduce
		for(let [lookahead, confs] of
			_ext.groupBy(
				Array.from(state.configurationSet.values())
					.filter(lr1conf => lr1conf.baseLR0Configuration.getNextSymbol() === null),
				lr1conf => lr1conf.lookahead
			)
		) {
			for(let lr1conf of confs) {
				if(lookahead === GSymbol.LAMBDA)
					continue;
				if(!gotoActionsMap.has(lookahead))
					gotoActionsMap.set(lookahead, []);
				gotoActionsMap.get(lookahead).push(
					globalActionMap.reduce.get(lr1conf.baseLR0Configuration.production)
				);
			}
		}
		lr1GotoActionTable.set(state, gotoActionsMap);
	}

	return lr1GotoActionTable;
}
export function newLL1Parse(grammar, ll1PredictTable, inputTokens) {
	return new LL1Parse(grammar, ll1PredictTable, inputTokens);
}
export function newLR1Parse(grammar, lr1FSM, lr1GotoActionTable, inputTokens) {
	return new LR1Parse(grammar, lr1FSM, lr1GotoActionTable, inputTokens);
}
