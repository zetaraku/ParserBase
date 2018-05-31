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
		if(!startSymbol) throw new Error(`start symbol '${startSymbolName}' no found`);
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
	let unreachableSymbols = [];
	for(let symbol of [...grammar.terminals, ...grammar.nonTerminals]) {
		if(!reachableVocabularies.has(symbol)) {
			unreachableSymbols.push(symbol);
		}
	}

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
				let lhs = production.lhs, rhs = production.rhs;
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
	let unreducibleSymbols = [];
	for(let symbol of grammar.nonTerminals) {
		if(!reducibleVocabularies.has(symbol)) {
			unreducibleSymbols.push(symbol);
		}
	}

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
				let lhs = production.lhs, rhs = production.rhs;
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
			let lhs = production.lhs, rhs = production.rhs;
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
		let lhs = production.lhs, rhs = production.rhs;
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
		let lhs = production.lhs, rhs = production.rhs;
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
export function buildLR0FSM(grammar) {
	LR0Configuration.serialNo = 1;
	LR0FSM.State.serialNo = 0;

	let getLR0Configuration = getLR0ConfigurationHelper();

	let state0 = new LR0FSM.State(
		closure0Of(
			new Set([getLR0Configuration(grammar.augmentingProduction, 0)])
		)
	);
	let lr0FSM = new LR0FSM(state0);

	let processingQueue = [state0];
	while(processingQueue.length !== 0) {
		let processingState = processingQueue.shift();
		let nextSymbolGroups = _ext.groupBy(processingState.configurationSet, e => e.getNextSymbol());
		for(let [symbol, lr0ConfSet] of nextSymbolGroups) {
			if(symbol === null)
				continue;
			let newLR0ConfSet = closure0Of(
				new Set(Array.from(lr0ConfSet).map(function(lr0conf) {
					return getLR0Configuration(lr0conf.production, lr0conf.dotPos + 1);
				}))
			);
			let existedState = null;
			for(let state of lr0FSM.states) {
				if(_ext.equals(state.configurationSet, newLR0ConfSet)) {
					existedState = state;
					break;
				}
			}
			if(existedState === null) {
				let newState = new LR0FSM.State(newLR0ConfSet);
				lr0FSM.states.add(newState);
				processingState.linkTo(newState, symbol);
				processingQueue.push(newState);
			} else {
				processingState.linkTo(existedState, symbol);
			}
		}
	}

	return lr0FSM;

	function getLR0ConfigurationHelper() {
		let globalLR0ConfMap = new Map(); {
			for(let production of grammar.productions) {
				let lr0ConfsOfProd = [];
				for(let i = 0; i <= production.rhs.length; i++)
					lr0ConfsOfProd.push(new LR0Configuration(production, i));
				globalLR0ConfMap.set(production, lr0ConfsOfProd);
			}
		}

		return function(prod, pos) {
			return globalLR0ConfMap.get(prod)[pos];
		};
	}
	function closure0Of(lr0ConfSet) {
		let newLR0ConfSet = new Set(lr0ConfSet);

		let processingQueue = Array.from(lr0ConfSet);
		while(processingQueue.length !== 0) {
			let lr0conf = processingQueue.shift();

			let expandingNonterminal = lr0conf.getNextSymbol();
			if(!(expandingNonterminal instanceof NonTerminal))
				continue;

			for(let prod of grammar.productionsMap.get(expandingNonterminal)) {
				let newLR0Conf = getLR0Configuration(prod, 0);
				if(!newLR0ConfSet.has(newLR0Conf)) {
					newLR0ConfSet.add(newLR0Conf);
					processingQueue.push(newLR0Conf);
				}
			}
		}

		return newLR0ConfSet;
	}
}
export function buildLR1FSM(grammar, firstSetTable) {
	LR0Configuration.serialNo = LR1Configuration.serialNo = 1;
	LR1FSM.State.serialNo = 0;

	let getLR1Configuration = getLR1ConfigurationHelper();

	let state0 = new LR1FSM.State(
		closure1Of(
			new Set([getLR1Configuration(grammar.augmentingProduction, 0, GSymbol.LAMBDA)])
		)
	);
	let lr1FSM = new LR1FSM(state0);

	let processingQueue = [state0];
	while(processingQueue.length !== 0) {
		let processingState = processingQueue.shift();
		let nextSymbolGroups = _ext.groupBy(
			processingState.configurationSet,
			e => e.baseLR0Configuration.getNextSymbol()
		);
		for(let [symbol, lr1ConfSet] of nextSymbolGroups) {
			if(symbol === null)
				continue;
			let newLR1ConfSet = closure1Of(
				new Set(Array.from(lr1ConfSet).map(function(lr1conf) {
					return getLR1Configuration(
						lr1conf.baseLR0Configuration.production,
						lr1conf.baseLR0Configuration.dotPos + 1,
						lr1conf.lookahead
					);
				}))
			);
			let existedState = null;
			for(let state of lr1FSM.states) {
				if(_ext.equals(state.configurationSet, newLR1ConfSet)) {
					existedState = state;
					break;
				}
			}
			if(existedState === null) {
				let newState = new LR1FSM.State(newLR1ConfSet);
				lr1FSM.states.add(newState);
				processingState.linkTo(newState, symbol);
				processingQueue.push(newState);
			} else {
				processingState.linkTo(existedState, symbol);
			}
		}
	}

	return lr1FSM;

	function getLR1ConfigurationHelper() {
		let globalLR0ConfMap = new Map(); {	// Map<Production,LR0Configuration[]>
			for(let production of grammar.productions) {
				let lr0ConfsOfProd = [];
				for(let i = 0; i <= production.rhs.length; i++)
					lr0ConfsOfProd.push(new LR0Configuration(production, i));
				globalLR0ConfMap.set(production, lr0ConfsOfProd);
			}
		}
		let globalLR1ConfSet = new Map(); {	// Map<Production,Map<Terminal,LR1Configuration>[]>
			for(let production of grammar.productions) {
				let lr1ConfsOfProd = [];
				for(let i = 0; i <= production.rhs.length; i++)
					lr1ConfsOfProd.push(new Map());
				globalLR1ConfSet.set(production, lr1ConfsOfProd);
			}
		}

		return function(prod, pos, lookahead) {
			let targetAbbr = globalLR1ConfSet.get(prod)[pos];
			if(targetAbbr.has(lookahead)) {
				return targetAbbr.get(lookahead);
			} else {
				let newLR1Conf = new LR1Configuration(
					globalLR0ConfMap.get(prod)[pos],
					lookahead
				);
				targetAbbr.set(lookahead, newLR1Conf);
				return newLR1Conf;
			}
		};
	}
	function closure1Of(lr1ConfSet) {
		let newLR1ConfSet = new Set(lr1ConfSet);

		let processingQueue = Array.from(lr1ConfSet);
		while(processingQueue.length !== 0) {
			let lr1conf = processingQueue.shift();
			let lr0conf = lr1conf.baseLR0Configuration;

			let expandingNonterminal = lr0conf.getNextSymbol();
			if(!(expandingNonterminal instanceof NonTerminal))
				continue;

			let lookaheadSet = new Set();
			let rhs = lr0conf.production.rhs;
			let blocked = false;
			for(let i = lr0conf.dotPos + 1; i < rhs.length; i++) {
				for(let t of firstSetTable.get(rhs[i])) {
					if(t !== GSymbol.LAMBDA)
						lookaheadSet.add(t);
				}
				if(!firstSetTable.get(rhs[i]).has(GSymbol.LAMBDA)) {
					blocked = true;
					break;
				}
			}
			if(!blocked) {
				lookaheadSet.add(lr1conf.lookahead);
			}

			for(let lookahead of lookaheadSet) {
				for(let prod of grammar.productionsMap.get(expandingNonterminal)) {
					let newLR1Conf = getLR1Configuration(prod, 0, lookahead);
					if(!newLR1ConfSet.has(newLR1Conf)) {
						newLR1ConfSet.add(newLR1Conf);
						processingQueue.push(newLR1Conf);
					}
				}
			}
		}

		return newLR1ConfSet;
	}
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
