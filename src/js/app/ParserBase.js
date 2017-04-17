'use strict';

import Viz from 'viz';

export const Lambda = {
	// the placeholder for lambda (nothing)
	toString: function() {
		return 'λ';
	},
	toRawString: function() {
		return 'λ';
	}
};
export class GSymbol {
	// Do NOT use 'Symbol', that will confilct with 'Symbol' type in ES6
	constructor(name) {
		this.id = GSymbol.serialNo++;
		this.name = name;
	}
	toString() {
		return this.name;
	}
	toRawString() {
		return this.name;
	}
} {
	// id = -2 for UNKNOWN, id = -1 for EOI ($), id = 0 for SYSTEM_GOAL
	GSymbol.serialNo = -2;
	// the placeholder for unknown terminal type
	GSymbol.UNKNOWN = new GSymbol('unknown');
}
export class Terminal extends GSymbol {
	constructor(name) {
		super(name);
	}
} {
	// the EndOfInput Terminal ($)
	GSymbol.EOI = new Terminal('$');
}
export class NonTerminal extends GSymbol {
	constructor(name) {
		super(name);
	}
} {
	// the augmenting NonTerminal
	GSymbol.SYSTEM_GOAL = new NonTerminal('system_goal');
}
export class ActionSymbol extends GSymbol {
	// currently unused
	constructor(name) {
		super(name);
	}
	toString() {
		return this.name;
	}
	toRawString() {
		return this.name;
	}
} {
	ActionSymbol.serialNo = 1;
}
export class Production {
	constructor(lhs, rhs) {
		this.id = Production.serialNo++;
		this.lhs = lhs;
		this.rhs = rhs;
	}
	toString() {
		return (this.lhs + ' ' + Production.ARROW + ' ' +
			(this.rhs.isNotEmpty() ? this.rhs.join(' ') : Lambda));
	}
	toStringReversed() {
		return (this.lhs + ' ' + Production.ARROW_R + ' ' +
			(this.rhs.isNotEmpty() ? this.rhs.join(' ') : Lambda));
	}
	toRawString() {
		return (this.lhs.toRawString() + ' ' + Production.ARROW.toRawString() + ' ' +
			(this.rhs.isNotEmpty() ? this.rhs.map(e => e.toRawString()).join(' ') : Lambda.toRawString()));
	}
} {
	Production.serialNo = 0;
	Production.ARROW = {
		toString: function() {
			return '→';
		},
		toRawString: function() {
			return '→';
		}
	};
	Production.ARROW_R = {
		toString: function() {
			return '←';
		},
		toRawString: function() {
			return '←';
		}
	};
}
export class Grammar {
	constructor(terminals, nonTerminals, startSymbol, productions, augmentingProduction) {
		this.terminals = terminals;
		this.nonTerminals = nonTerminals;
		this.startSymbol = startSymbol;
		this.productions = productions;
		this.productionsMap = productions.groupBy(e => e.lhs);
		this.augmentingProduction = augmentingProduction;
	}
} {
}
export class Configuration {
	constructor(production, dotPos) {
		this.id = Configuration.serialNo++;
		this.production = production;
		this.dotPos = dotPos;
	}
	getNextSymbol() {
		if(this.dotPos === this.production.rhs.length)
			return null;
		return this.production.rhs[this.dotPos];
	}
	toString() {
		let r = this.production.rhs.slice();
		r.splice(this.dotPos, 0, Configuration.DOT);
		return (this.production.lhs + ' ' + Production.ARROW + ' ' +
			r.join(' '));
	}
	toRawString() {
		let r = this.production.rhs.slice();
		r.splice(this.dotPos, 0, Configuration.DOT);
		return (this.production.lhs.toRawString() + ' ' + Production.ARROW.toRawString() + ' ' +
			r.map(e => e.toRawString()).join(' '));
	}
} {
	Configuration.serialNo = 1;
	Configuration.DOT = {
		toString: function() {
			return '●';
		},
		toRawString: function() {
			return '●';
		}
	};
}
export class LR1Configuration {
	constructor(baseConfiguration, lookahead) {
		this.id = LR1Configuration.serialNo++;
		this.baseConfiguration = baseConfiguration;
		this.lookahead = lookahead;
	}
} {
	LR1Configuration.serialNo = 1;
}
export class LR0FSM {
	constructor(startState) {
		this.startState = startState;
		this.states = new Set();
	}
} {
	LR0FSM.State = class {
		constructor(configurationSet) {
			this.id = LR0FSM.State.serialNo++;
			this.configurationSet = configurationSet;
			this.transitionMap = new Map();
		}
		linkTo(toState, symbol) {
			this.transitionMap.set(symbol, toState);
		}
		subContentReprensentation() {
			return this.configurationSet.toArray()
				.map(function(conf) {
					return conf.toRawString() + '\\l';
				}).join('');
		}
	};{
		LR0FSM.State.serialNo = 1;
	}
}
export class LR1FSM {
	constructor(startState) {
		this.startState = startState;
		this.states = new Set();
	}
} {
	LR1FSM.State = class {
		constructor(lr1configurationSet) {
			this.id = LR1FSM.State.serialNo++;
			this.lr1configurationSet = lr1configurationSet;
			this.transitionMap = new Map();
		}
		linkTo(toState, symbol) {
			this.transitionMap.set(symbol, toState);
		}
		subContentReprensentation() {
			return Array.from(this.lr1configurationSet.groupBy(e => e.baseConfiguration).entries())
				.map(function([conf, lr1confs]) {
					return conf.toRawString() + ' ' + '{' +
						lr1confs.toArray().map(e => (e.lookahead || Lambda).toRawString()).join(' ') +
					'}' + '\\l';
				}).join('');
		}
	};{
		LR1FSM.State.serialNo = 1;
	}
}
export class LL1Parse {
	constructor(grammar, ll1PredictTable, inputTokens) {
		LL1Parse.TreeNode.serialNo = 1;
		const rootNode = new LL1Parse.TreeNode(GSymbol.SYSTEM_GOAL);
		const parseStack = this.parseStack = [GSymbol.SYSTEM_GOAL];
		const parseTree = this.parseTree = rootNode;
		const rhsStack = this.rhsStack = [];
		inputTokens.push({terminalType: GSymbol.EOI});
		[this.currentRHS, this.currentRHSIndex] = [[rootNode], 0];
		const self = this;
		this.step = (function*() {
			while(parseStack.isNotEmpty() && inputTokens.isNotEmpty()) {
				let topSymbol = parseStack.last();
				let nextInput = inputTokens.first();
				let currentNode = self.currentRHS[self.currentRHSIndex];
				if(topSymbol instanceof NonTerminal) {
					let predictedProds = ll1PredictTable.get(topSymbol).get(nextInput.terminalType);
					if(predictedProds === undefined) {
						yield {
							type: LL1Parse.Action.error,
							errMsg: `Unable to predict ${topSymbol} with lookahead ${nextInput.terminalType} (syntax error)`
						};
						return;
					}
					if(predictedProds.length > 1) {
						yield {
							type: LL1Parse.Action.error,
							errMsg: `Unable to predict ${topSymbol} with lookahead ${nextInput.terminalType} (conflict)`
						};
						return;
					}

					let usingProd = predictedProds.first();

					// parse stack
					parseStack.pop();
					parseStack.push(...usingProd.rhs.slice().reverse());
					// parse tree
					currentNode.childNodes = usingProd.rhs.map(e => new LL1Parse.TreeNode(e));
					// semantic record
					rhsStack.push([self.currentRHS, self.currentRHSIndex]);
					[self.currentRHS, self.currentRHSIndex] = [currentNode.childNodes, 0];
					checkEOP();

					yield {
						type: LL1Parse.Action.predict,
						nonTerminal: topSymbol,
						usingProd: usingProd,
						lookahead: nextInput.terminalType
					};
				} else if(topSymbol instanceof Terminal) {
					if(nextInput.terminalType !== topSymbol) {
						yield {
							type: LL1Parse.Action.error,
							errMsg: `Unable to match ${nextInput.terminalType}`
						};
						return;
					}

					// parse stack
					parseStack.pop();
					inputTokens.shift();
					// parse tree
					/* do nothing */
					// semantic record
					self.currentRHSIndex++;
					checkEOP();

					yield {
						type: LL1Parse.Action.match,
						token: nextInput
					};
					if(topSymbol === GSymbol.EOI)
						return;
				} else {
					throw "Invalid Symbol: " + topSymbol;
				}
			}
			function checkEOP() {
				while(self.currentRHSIndex >= self.currentRHS.length && rhsStack.isNotEmpty()) {
					[self.currentRHS, self.currentRHSIndex] = rhsStack.pop();
					self.currentRHSIndex++;
				}
			}
		})();
	}
} {
	LL1Parse.TreeNode = class {
		constructor(symbol) {
			this.id = LL1Parse.TreeNode.serialNo++;
			this.symbol = symbol;
			this.childNodes = [];
		}
		toString() {
			return this.symbol.toString();
		}
		toRawString() {
			return this.symbol.toRawString();
		}
	};{
		LL1Parse.TreeNode.serialNo = 1;
	}
	LL1Parse.Action = (function(Action) {
		Action[Action["match"] = 0] = "match";
		Action[Action["predict"] = 1] = "predict";
		Action[Action["accept"] = 2] = "accept";
		Action[Action["error"] = 3] = "error";
		return Action;
	})({});
}
export class LR1Parse {
	constructor(grammar, lr1FSM, lr1GotoActionTable, inputTokens) {
		LR1Parse.TreeNode.serialNo = 1;
		const parseForest = this.parseForest = [];
		const parseStack = this.parseStack = [];
		const stateStack = this.stateStack = [lr1FSM.startState];
		inputTokens.push({terminalType: GSymbol.EOI});
		this.step = (function*() {
			while(inputTokens.isNotEmpty()) {
				let currentState = stateStack.last();
				let nextInput = inputTokens.first();
				let selectedActions = lr1GotoActionTable.get(currentState).get(nextInput.terminalType);
				if(selectedActions !== undefined) {
					if(selectedActions.length > 1) {
						yield {
							type: LR1Parse.Action.error,
							errMsg: `Unable to decide next action with lookahead ${nextInput.terminalType} (conflict)`
						};
						return;
					}
					let action = selectedActions.first();
					if(action.type === LR1Parse.Action.shift) {

						// parse stack
						parseStack.push(nextInput.terminalType);
						stateStack.push(action.nextState);
						// parse tree
						parseForest.push(new LR1Parse.TreeNode(nextInput.terminalType));

						inputTokens.shift();
						yield {
							type: LR1Parse.Action.shift
						};
					} else if(action.type === LR1Parse.Action.reduce) {

						let reducedNode = new LR1Parse.TreeNode(action.reducingProduction.lhs);
						reducedNode.childNodes = [];

						for(let rhsi of action.reducingProduction.rhs) {
							parseStack.pop();
							stateStack.pop();
							reducedNode.childNodes.unshift(parseForest.pop());
						}
						currentState = stateStack.last();

						let nonterminalShiftAction =
							lr1GotoActionTable.get(currentState).get(action.reducingProduction.lhs).first();

						// parse stack
						parseStack.push(action.reducingProduction.lhs);
						stateStack.push(nonterminalShiftAction.nextState);
						// parse tree
						parseForest.push(reducedNode);

						yield {
							type: LR1Parse.Action.reduce,
							reducingProduction: action.reducingProduction
						};
					} else if(action.type === LR1Parse.Action.accept) {

						// shift $
							// parse stack
							parseStack.push(inputTokens.shift().terminalType);
							stateStack.push(action.nextState);
							// parse tree
							parseForest.push(new LR1Parse.TreeNode(nextInput.terminalType));

						// reduce
							let reducedNode = new LR1Parse.TreeNode(action.reducingProduction.lhs);
							reducedNode.childNodes = [];

							for(let rhsi of action.reducingProduction.rhs) {
								parseStack.pop();
								stateStack.pop();
								reducedNode.childNodes.unshift(parseForest.pop());
							}
							currentState = stateStack.last();

							// parse stack
							parseStack.push(action.reducingProduction.lhs);
							stateStack.pop();
							// parse tree
							parseForest.push(reducedNode);

						yield {
							type: LR1Parse.Action.accept,
							reducingProduction: action.reducingProduction
						};
						return;
					}
				} else {
					yield {
						type: LR1Parse.Action.error,
						errMsg: `Unable to decide next action with lookahead ${nextInput.terminalType} (syntax error)`
					};
					return;
				}
			}
		})();
	}
} {
	LR1Parse.TreeNode = class {
		constructor(symbol) {
			this.id = LR1Parse.TreeNode.serialNo++;
			this.symbol = symbol;
		}
		toString() {
			return this.symbol.toString();
		}
		toRawString() {
			return this.symbol.toRawString();
		}
	};{
		LR1Parse.TreeNode.serialNo = 1;
	}
	LR1Parse.Action = (function(Action) {
		Action[Action["shift"] = 0] = "shift";
		Action[Action["reduce"] = 1] = "reduce";
		Action[Action["accept"] = 2] = "accept";
		Action[Action["error"] = 3] = "error";
		return Action;
	})({});
}

export default {
	Lambda: Lambda,
	GSymbol: GSymbol,
	Terminal: Terminal,
	NonTerminal: NonTerminal,
	ActionSymbol: ActionSymbol,
	Production: Production,
	Grammar: Grammar,
	Configuration: Configuration,
	LR1Configuration: LR1Configuration,
	LR0FSM: LR0FSM,
	LR1FSM: LR1FSM,
	LL1Parse: LL1Parse,
	LR1Parse: LR1Parse,

	buildGrammar: buildGrammar,
	computeUnreachableSymbols: computeUnreachableSymbols,
	computeUnreducibleSymbols: computeUnreducibleSymbols,
	computeNullableSymbols: computeNullableSymbols,
	buildFirstSetTable: buildFirstSetTable,
	buildFollowSetTable: buildFollowSetTable,
	buildPredictSetTable: buildPredictSetTable,
	buildLL1PredictTable: buildLL1PredictTable,
	buildLR0FSM: buildLR0FSM,
	buildLR1FSM: buildLR1FSM,
	buildLR1GotoActionTable: buildLR1GotoActionTable,

	generateDotImageOfLR0FSM: generateDotImageOfLR0FSM,
	generateDotImageOfLR1FSM: generateDotImageOfLR1FSM,
	generateDotImageOfLL1ParseTree: generateDotImageOfLL1ParseTree,
	generateDotImageOfLR1ParseForest: generateDotImageOfLR1ParseForest,

	newLL1Parse: (grammar, ll1PredictTable, inputTokens) => (new LL1Parse(grammar, ll1PredictTable, inputTokens)),
	newLR1Parse: (grammar, lr1FSM, lr1GotoActionTable, inputTokens) => (new LR1Parse(grammar, lr1FSM, lr1GotoActionTable, inputTokens)),
};


export function buildGrammar(terminalNames, nonTerminalNames, startSymbolName, rawProductions) {
	GSymbol.serialNo = 0;
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

	return new Grammar(terminals, nonTerminals, startSymbol, productions, augmentingProduction);
}
export function computeUnreachableSymbols(grammar) {
	let reachableVocabularies = new Set([GSymbol.SYSTEM_GOAL]);
	let processingQueue = [GSymbol.SYSTEM_GOAL];
	while(processingQueue.isNotEmpty()) {
		let processingNT = processingQueue.shift();
		for(let production of grammar.productionsMap.get(processingNT)) {
			let lhs = production.lhs, rhs = production.rhs;
			for(let v of rhs) {
				if(reachableVocabularies.has(v))
					continue;
				reachableVocabularies.add(v);
				if(v instanceof NonTerminal)
					processingQueue.push(v);
			}
		}
	}
	let unreachableSymbols = [];
	for(let s of [...grammar.terminals, ...grammar.nonTerminals]) {
		if(!reachableVocabularies.has(s)) {
			unreachableSymbols.push(s);
		}
	}
	return unreachableSymbols;
}
export function computeUnreducibleSymbols(grammar) {
	let reducibleVocabularies = new Set(grammar.terminals);
	let processingMap = new Map(grammar.productionsMap);
	let needUpdate = true;
	while(processingMap.isNotEmpty() && needUpdate) {
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
	for(let s of grammar.nonTerminals) {
		if(!reducibleVocabularies.has(s)) {
			unreducibleSymbols.push(s);
		}
	}
	return unreducibleSymbols;
}
export function computeNullableSymbols(grammar) {
	let nullableSymbols = new Set();
	let processingMap = new Map(grammar.productionsMap);
	let needUpdate = true;
	while(processingMap.isNotEmpty() && needUpdate) {
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
	while(lastUpdatedVocabularies.isNotEmpty()) {
		let newUpdatedVocabularies = new Set();
		for(let production of grammar.productions) {
			let [lhs, rhs] = [production.lhs, production.rhs];
			let firstSetOfLHS = firstSetTable.get(lhs);
			let lhsUpdated = false;
			for(let rhsi of rhs) {
				if(lastUpdatedVocabularies.has(rhsi)) {
					let firstSetOfRHSI = firstSetTable.get(rhsi);
					let added = firstSetOfLHS.addAll(firstSetOfRHSI);
					lhsUpdated = lhsUpdated || added.isNotEmpty();
				}
				if(!nullableSymbols.has(rhsi)) {
					break; // end of range, the non-nullable is the last
				}
			}
			if(lhsUpdated)
				newUpdatedVocabularies.add(lhs);
		}
		lastUpdatedVocabularies = newUpdatedVocabularies;
	}

	for(let nullableSymbol of nullableSymbols) {
		firstSetTable.get(nullableSymbol).add(Lambda);
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
		let [lhs, rhs] = [production.lhs, production.rhs];
		for(let i = 0; i < rhs.length; i++) {
			let rhsi = rhs[i];
			if(!(rhsi instanceof NonTerminal))
				continue;	// only consider NonTerminals
			let followSetOfRHSI = followSetTable.get(rhsi);

			let blocked = false;
			for(let j = i + 1; j < rhs.length; j++) {
				let rhsj = rhs[j];
				for(let t of firstSetTable.get(rhsj)) {
					if(t !== Lambda)
						followSetOfRHSI.add(t);
				}
				if(!firstSetTable.get(rhsj).has(Lambda)) {
					blocked = true;
					break; // end of range, the non-nullable is the last
				}
			}
			if(!blocked) {
				seeThroughTable.get(rhsi).add(lhs);		// rhsi can see through lhs
			}
		}
	}

	// state 2: iteratively adding FollowSet
	let lastUpdatedVocabularies = new Set(grammar.nonTerminals);
	while(lastUpdatedVocabularies.isNotEmpty()) {
		let newUpdatedVocabularies = new Set();
		for(let [nt, lhnts] of seeThroughTable) {
			let followSetOfNT = followSetTable.get(nt);
			let ntUpdated = false;
			for(let lhnt of lhnts) {
				if(lastUpdatedVocabularies.has(lhnt)) {
					let followSetOfLHNT = followSetTable.get(lhnt);
					let added = followSetOfNT.addAll(followSetOfLHNT);
					ntUpdated = ntUpdated || added.isNotEmpty();
				}
			}
			if(ntUpdated)
				newUpdatedVocabularies.add(nt);
		}
		lastUpdatedVocabularies = newUpdatedVocabularies;
	}

	followSetTable.get(GSymbol.SYSTEM_GOAL).add(Lambda);

	return followSetTable;
}
export function buildPredictSetTable(grammar, firstSetTable, followSetTable) {
	let predictSetTable = new Map();
	for(let production of grammar.productions) {
		let lhs = production.lhs, rhs = production.rhs;
		let predictSetOfProduction = new Set();
		let canSeeThrough = true;
		for(let rhsi of rhs) {
			for(let t of firstSetTable.get(rhsi))
				predictSetOfProduction.add(t);
			if(!firstSetTable.get(rhsi).has(Lambda)) {
				canSeeThrough = false;
				break; // end of range, the non-nullable is the last
			}
		}
		if(canSeeThrough) {
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
export function buildLR0FSM(grammar, firstSetTable) {
	Configuration.serialNo = 1;
	LR0FSM.State.serialNo = 0;

	let globalConfigurationMap = new Map();
	for(let production of grammar.productions) {
		let configurationsOfProd = [];
		for(let i = 0; i <= production.rhs.length; i++)
			configurationsOfProd.push(new Configuration(production, i));
		globalConfigurationMap.set(production, configurationsOfProd);
	} // immutated after created

	let state0 = new LR0FSM.State(
		closureOf(
			new Set([getConfiguration(grammar.augmentingProduction, 0)])
		)
	);
	let lr0FSM = new LR0FSM(state0);
	lr0FSM.states.add(state0);
	let processingQueue = [state0];
	while(processingQueue.isNotEmpty()) {
		let processingState = processingQueue.shift();
		let nextSymbolGroups = processingState.configurationSet.groupBy(e => e.getNextSymbol());
		for(let [symbol, confSet] of nextSymbolGroups) {
			if(symbol === null)
				continue;
			let newConfSet = closureOf(
				new Set(confSet.toArray().map(function(conf) {
					return getConfiguration(conf.production, conf.dotPos + 1);
				}))
			);
			let existedState = null;
			for(let s of lr0FSM.states) {
				if(s.configurationSet.equals(newConfSet)) {
					existedState = s;
					break;
				}
			}
			if(existedState === null) {
				let newState = new LR0FSM.State(newConfSet);
				lr0FSM.states.add(newState);
				processingState.linkTo(newState, symbol);
				processingQueue.push(newState);
			} else {
				processingState.linkTo(existedState, symbol);
			}
		}
	}
	return lr0FSM;

	function getConfiguration(prod, pos) {
		return globalConfigurationMap.get(prod)[pos];
	}
	function closureOf(configurationSet) {
		let newConfigurationSet = new Set(configurationSet);
		let processingQueue = configurationSet.toArray();
		while(processingQueue.isNotEmpty()) {
			let conf = processingQueue.shift();
			let expandingNonterminal = conf.getNextSymbol();
			let prod = conf.production;
			if(!(expandingNonterminal instanceof NonTerminal))
				continue;
			for(let p of grammar.productionsMap.get(expandingNonterminal)) {
				let newConf = getConfiguration(p, 0);
				if(!newConfigurationSet.has(newConf)) {
					newConfigurationSet.add(newConf);
					processingQueue.push(newConf);
				}
			}
		}
		return newConfigurationSet;
	}
}
export function buildLR1FSM(grammar, firstSetTable) {
	Configuration.serialNo = LR1Configuration.serialNo = 1;
	LR1FSM.State.serialNo = 0;

	let globalConfigurationMap = new Map();
	for(let production of grammar.productions) {
		let configurationsOfProd = [];
		for(let i = 0; i <= production.rhs.length; i++)
			configurationsOfProd.push(new Configuration(production, i));
		globalConfigurationMap.set(production, configurationsOfProd);
	} // immutated after created
	let globalLR1configurationSet = new Map();
	for(let production of grammar.productions) {
		let configurationsOfProd = [];
		for(let i = 0; i <= production.rhs.length; i++)
			configurationsOfProd.push(new Map());
		globalLR1configurationSet.set(production, configurationsOfProd);
	}
	let state0 = new LR1FSM.State(
		closureOf(
			new Set([getLR1Configuration(grammar.augmentingProduction, 0, null)])
		)
	);
	let lr1FSM = new LR1FSM(state0);
	lr1FSM.states.add(state0);
	let processingQueue = [state0];
	while(processingQueue.isNotEmpty()) {
		let processingState = processingQueue.shift();
		let nextSymbolGroups = processingState.lr1configurationSet
			.groupBy(e => e.baseConfiguration.getNextSymbol());
		for(let [symbol, confSet] of nextSymbolGroups) {
			if(symbol === null)
				continue;
			let newConfSet = closureOf(
				new Set(confSet.toArray().map(function(lr1conf) {
					return getLR1Configuration(
						lr1conf.baseConfiguration.production,
						lr1conf.baseConfiguration.dotPos + 1,
						lr1conf.lookahead
					);
				}))
			);
			let existedState = null;
			for(let s of lr1FSM.states) {
				if(s.lr1configurationSet.equals(newConfSet)) {
					existedState = s;
					break;
				}
			}
			if(existedState === null) {
				let newState = new LR1FSM.State(newConfSet);
				lr1FSM.states.add(newState);
				processingState.linkTo(newState, symbol);
				processingQueue.push(newState);
			} else {
				processingState.linkTo(existedState, symbol);
			}
		}
	}
	return lr1FSM;

	function getLR1Configuration(prod, pos, lookahead) {
		let targetAbbr = globalLR1configurationSet.get(prod)[pos];
		if(targetAbbr.has(lookahead)) {
			return targetAbbr.get(lookahead);
		} else {
			let newLR1Conf = new LR1Configuration(
				globalConfigurationMap.get(prod)[pos],
				lookahead
			);
			targetAbbr.set(lookahead, newLR1Conf);
			return newLR1Conf;
		}
	}
	function closureOf(lr1configurationSet) {
		let newConfigurationSet = new Set(lr1configurationSet);
		let processingQueue = lr1configurationSet.toArray();
		while(processingQueue.isNotEmpty()) {
			let lr1conf = processingQueue.shift();
			let conf = lr1conf.baseConfiguration;
			let expandingNonterminal = conf.getNextSymbol();
			let prod = conf.production;
			if(!(expandingNonterminal instanceof NonTerminal))
				continue;
			let lookaheadSet = new Set();
			let canSeeThrough = true;
			for(let j = conf.dotPos + 1; j < prod.rhs.length; j++) {
				let rhsi = prod.rhs[j];
				for(let t of firstSetTable.get(rhsi)) {
					if(t !== Lambda)
						lookaheadSet.add(t);
				}
				if(!firstSetTable.get(rhsi).has(Lambda)) {
					canSeeThrough = false;
					break; // end of range, the non-nullable is the last
				}
			}
			if(canSeeThrough) {
				lookaheadSet.add(lr1conf.lookahead);
			}
			for(let lookahead of lookaheadSet) {
				for(let p of grammar.productionsMap.get(expandingNonterminal)) {
					let newLR1conf = getLR1Configuration(p, 0, lookahead);
					if(!newConfigurationSet.has(newLR1conf)) {
						newConfigurationSet.add(newLR1conf);
						processingQueue.push(newLR1conf);
					}
				}
			}
		}
		return newConfigurationSet;
	}
}
export function buildLR1GotoActionTable(grammar, lr1fsm) {
	// let lr1ActionTable = new Map();
	let lr1GotoActionTable = new Map();
	let globalActionMap = {
		shift: new Map(lr1fsm.states.toArray().map((s) => [s, {
				type: LR1Parse.Action.shift,
				nextState: s
			}])),
		reduce: new Map(grammar.productions.map((p) => [p, {
				type: LR1Parse.Action.reduce,
				reducingProduction: p
			}])),
		accept: {
			type: LR1Parse.Action.accept,
			reducingProduction: grammar.augmentingProduction
		}
	};
	for(let state of lr1fsm.states) {
		let gotoActionsMap = new Map();
		// general shift & accept
		for(let [symbol, nextState] of state.transitionMap) {
			if(!gotoActionsMap.has(symbol))
				gotoActionsMap.set(symbol, []);
			if(symbol === GSymbol.EOI)
				gotoActionsMap.get(symbol).push(globalActionMap.accept);
			else
				gotoActionsMap.get(symbol).push(globalActionMap.shift.get(nextState));
		}
		// reduce
		for(let [lookahead, confs] of
			Array.from(state.lr1configurationSet.values())
				.filter(lr1conf => lr1conf.baseConfiguration.getNextSymbol() === null)
				.groupBy(lr1conf => lr1conf.lookahead)
		) {
			for(let lr1conf of confs) {
				if(!gotoActionsMap.has(lookahead))
					gotoActionsMap.set(lookahead, []);
				gotoActionsMap.get(lookahead).push(
					globalActionMap.reduce.get(lr1conf.baseConfiguration.production)
				);
			}
		}
		lr1GotoActionTable.set(state, gotoActionsMap);
	}
	return lr1GotoActionTable;
}
export function generateDotImageOfLR0FSM(lr0fsm) {
	let dotFileSrc = "";
	dotFileSrc += ("digraph LR0FSM { ");
	dotFileSrc += ("rankdir=\"LR\"; ");
	dotFileSrc += ("node [shape=rect]; ");
	dotFileSrc += ("start -> " + lr0fsm.startState.id + "; ");
	for(let state of lr0fsm.states) {
		dotFileSrc += (state.id + " [" +
			"label = \"" +
				"State " + state.id + "\\n" +
				state.subContentReprensentation() +
			"\"" +
		"]; ");
		for(let [symbol, nextState] of state.transitionMap) {
			dotFileSrc += (state.id + " -> " + nextState.id + " [" +
				"label = \"" + symbol.toRawString() + "\" " +
				"style = solid" +
			"]; ");
		}
	}
	dotFileSrc += ("}");

	return Viz(dotFileSrc);
}
export function generateDotImageOfLR1FSM(lr1fsm) {
	let dotFileSrc = "";
	dotFileSrc += ("digraph LR1FSM { ");
	dotFileSrc += ("rankdir=\"LR\"; ");
	dotFileSrc += ("node [shape=rect]; ");
	dotFileSrc += ("start -> " + lr1fsm.startState.id + "; ");
	for(let state of lr1fsm.states) {
		dotFileSrc += (state.id + " [" +
			"label = \"" +
				"State " + state.id + "\\n" +
				state.subContentReprensentation() +
			"\"" +
		"]; ");
		for(let [symbol, nextState] of state.transitionMap) {
			dotFileSrc += (state.id + " -> " + nextState.id + " [" +
				"label = \"" + symbol.toRawString() + "\" " +
				"style = solid" +
			"]; ");
		}
	}
	dotFileSrc += ("}");

	return Viz(dotFileSrc);
}
export function generateDotImageOfLL1ParseTree(parseTree) {
	let dotFileSrc = "";
	dotFileSrc += ("digraph LL1ParseTree { ");
	dotFileSrc += ("rankdir=\"UD\"; ");
	dotFileSrc += ("node [shape=ellipse]; ");
		traverseNode(parseTree);
	dotFileSrc += ("}");

	return Viz(dotFileSrc);

	function traverseNode(node) {
		dotFileSrc += (node.id + " [label = \"" + node.toRawString() + "\"]; ");
		if(node.childNodes !== undefined) {
			for(let childNode of node.childNodes)
				dotFileSrc += (node.id + " -> " + childNode.id + "; ");
			for(let childNode of node.childNodes)
				traverseNode(childNode);
		}
	}
}
export function generateDotImageOfLR1ParseForest(parseForest) {
	let dotFileSrc = "";
	dotFileSrc += ("digraph LR1ParseForest { ");
	dotFileSrc += ("rankdir=\"UD\"; ");
	dotFileSrc += ("node [shape=ellipse]; ");
		for(let parseTree of parseForest)
			traverseNode(parseTree);
	dotFileSrc += ("}");

	return Viz(dotFileSrc);

	function traverseNode(node) {
		dotFileSrc += (node.id + " [label = \"" + node.toRawString() + "\"]; ");
		if(node.childNodes !== undefined) {
			for(let childNode of node.childNodes)
				dotFileSrc += (node.id + " -> " + childNode.id + "; ");
			for(let childNode of node.childNodes)
				traverseNode(childNode);
		}
	}
}
