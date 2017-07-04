'use strict';

import _ext from 'app/_ext';
import Viz from 'viz';

export class GSymbol {
	// Do NOT use 'Symbol', that will confilct with 'Symbol' type in ES6
	constructor(name, displayName) {
		this.name = name;
		this.displayName = displayName || name;
	}
	toString() {
		return this.displayName;
	}
	toRawString() {
		return this.displayName;
	}
} {
	// the placeholder for lambda (nothing)
	GSymbol.LAMBDA = new GSymbol(Symbol('λ'), 'λ');
	// the indicator for current position of Configuration
	GSymbol.DOT = new GSymbol(Symbol('●'), '●');
}
export class Terminal extends GSymbol {
	constructor(name, displayName) {
		super(name, displayName);
	}
} {
	// the EndOfInput Terminal ($)
	GSymbol.EOI = new Terminal(Symbol('$'), '$');
	// the placeholder for unknown terminal type
	GSymbol.UNKNOWN = new Terminal(Symbol('unknown'), 'unknown');
}
export class NonTerminal extends GSymbol {
	constructor(name, displayName) {
		super(name, displayName);
	}
} {
	// the augmenting NonTerminal
	GSymbol.SYSTEM_GOAL = new NonTerminal(Symbol('system_goal'), 'system_goal');
}
export class ActionSymbol extends NonTerminal {
	// currently unused
	constructor(name, displayName, action) {
		super(name, displayName);
		this.action = action;
	}
} {
}
export class Production {
	constructor(lhs, rhs) {
		this.id = Production.serialNo++;
		this.lhs = lhs;
		this.rhs = rhs;
	}
	toString() {
		return (this.lhs + ' ' + Production.ARROW + ' ' +
			(this.rhs.length !== 0 ? this.rhs.join(' ') : GSymbol.LAMBDA));
	}
	toStringReversed() {
		return (this.lhs + ' ' + Production.ARROW_R + ' ' +
			(this.rhs.length !== 0 ? this.rhs.join(' ') : GSymbol.LAMBDA));
	}
	toRawString() {
		return (this.lhs.toRawString() + ' ' + Production.ARROW.toRawString() + ' ' +
			(this.rhs.length !== 0 ? this.rhs.map(e => e.toRawString()).join(' ') : GSymbol.LAMBDA.toRawString()));
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
	constructor(terminals, nonTerminals, startSymbol, productions) {
		this.terminals = terminals;
		this.nonTerminals = nonTerminals;
		this.startSymbol = startSymbol;
		this.productions = productions;
		this.productionsMap = _ext.groupBy(productions, e => e.lhs);
		this.augmentingProduction = productions[0];
	}
	buildVocabularyNameMap() {
		return new Map([
			...this.terminals,
			...this.nonTerminals,
			GSymbol.LAMBDA
		].map((s) => [s.name, s]));
	}
} {
}
export class LR0Configuration {
	constructor(production, dotPos) {
		this.id = LR0Configuration.serialNo++;
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
		r.splice(this.dotPos, 0, GSymbol.DOT);
		return (this.production.lhs + ' ' + Production.ARROW + ' ' +
			r.join(' '));
	}
	toRawString() {
		let r = this.production.rhs.slice();
		r.splice(this.dotPos, 0, GSymbol.DOT);
		return (this.production.lhs.toRawString() + ' ' + Production.ARROW.toRawString() + ' ' +
			r.map(e => e.toRawString()).join(' '));
	}
} {
	LR0Configuration.serialNo = 1;
}
export class LR1Configuration {
	constructor(baseLR0Configuration, lookahead) {
		this.id = LR1Configuration.serialNo++;
		this.baseLR0Configuration = baseLR0Configuration;
		this.lookahead = lookahead;
	}
} {
	LR1Configuration.serialNo = 1;
}
export class LR0FSM {
	constructor(startState) {
		this.startState = startState;
		this.states = new Set([startState]);
	}
} {
	LR0FSM.State = class {
		constructor(lr0ConfigurationSet) {
			this.id = LR0FSM.State.serialNo++;
			this.configurationSet = lr0ConfigurationSet;
			this.transitionMap = new Map();
		}
		linkTo(toState, symbol) {
			this.transitionMap.set(symbol, toState);
		}
		subContentReprensentation() {
			return Array.from(this.configurationSet)
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
		this.states = new Set([startState]);
	}
} {
	LR1FSM.State = class {
		constructor(lr1ConfigurationSet) {
			this.id = LR1FSM.State.serialNo++;
			this.configurationSet = lr1ConfigurationSet;
			this.transitionMap = new Map();
		}
		linkTo(toState, symbol) {
			this.transitionMap.set(symbol, toState);
		}
		subContentReprensentation() {
			return Array.from(_ext.groupBy(this.configurationSet, e => e.baseLR0Configuration).entries())
				.map(function([lr0conf, lr1confs]) {
					return lr0conf.toRawString() + ' ' + '{' +
						Array.from(lr1confs).map(e => e.lookahead.toRawString()).join(' ') +
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
		const rootNode = this.parseTree = new LL1Parse.TreeNode(GSymbol.SYSTEM_GOAL);
		const parseStack = this.parseStack = [GSymbol.SYSTEM_GOAL];
		const rhsStack = this.rhsStack = [];
		inputTokens.push({terminalType: GSymbol.EOI});
		[this.currentRHS, this.currentRHSIndex] = [[rootNode], 0];
		const self = this;
		this.step = (function*() {
			while(parseStack.length !== 0 && inputTokens.length !== 0) {
				let topSymbol = parseStack.slice(-1)[0];
				let nextInput = inputTokens[0];
				let currentNode = self.currentRHS[self.currentRHSIndex];
				if(topSymbol instanceof NonTerminal) {
					let predictedProds = ll1PredictTable.get(topSymbol).get(nextInput.terminalType);
					if(predictedProds === undefined) {
						return new Error(`Unable to predict ${topSymbol} with lookahead ${nextInput.terminalType} (syntax error)`);
					}
					if(predictedProds.length > 1) {
						return new Error(`Unable to predict ${topSymbol} with lookahead ${nextInput.terminalType} (conflict)`);
					}

					let usingProd = predictedProds[0];

					// parse stack
					parseStack.pop();
					parseStack.push(...usingProd.rhs.slice().reverse());
					// parse tree
					currentNode.childNodes = usingProd.rhs.map(e => new LL1Parse.TreeNode(e));
					// semantic record
					rhsStack.push([self.currentRHS, self.currentRHSIndex]);
					[self.currentRHS, self.currentRHSIndex] = [currentNode.childNodes, 0];
					checkEOP();

					yield new LL1Parse.Action.Predict(usingProd);
				} else if(topSymbol instanceof Terminal) {
					if(nextInput.terminalType !== topSymbol) {
						return new Error(`Unable to match ${nextInput.terminalType}`);
					}

					// parse stack
					parseStack.pop();
					inputTokens.shift();
					// parse tree
					/* do nothing */
					// semantic record
					self.currentRHSIndex++;
					checkEOP();

					if(topSymbol !== GSymbol.EOI) {
						yield new LL1Parse.Action.Match(nextInput.terminalType);
					} else {
						yield new LL1Parse.Action.Accept(nextInput.terminalType);
						return;
					}
				} else {
					throw "Invalid Symbol: " + topSymbol;
				}
			}
			function checkEOP() {
				while(self.currentRHSIndex >= self.currentRHS.length && rhsStack.length !== 0) {
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
	LL1Parse.Action = class {
		constructor() {

		}
	};{
		LL1Parse.Action.Match = class extends LL1Parse.Action {
			constructor(terminalType) {
				super();
				this.terminalType = terminalType;
			}
		};
		LL1Parse.Action.Predict = class extends LL1Parse.Action {
			constructor(usingProd) {
				super();
				this.usingProd = usingProd;
			}
		};
		LL1Parse.Action.Accept = class extends LL1Parse.Action {
			constructor(terminalType) {
				super();
				this.terminalType = terminalType;
			}
		};
	}
}
export class LR1Parse {
	constructor(grammar, lr1FSM, lr1GotoActionTable, inputTokens) {
		LR1Parse.TreeNode.serialNo = 1;
		const parseForest = this.parseForest = [];
		const parseStack = this.parseStack = [];
		const stateStack = this.stateStack = [lr1FSM.startState];
		inputTokens.push({terminalType: GSymbol.EOI});
		this.step = (function*() {
			while(inputTokens.length !== 0) {
				let currentState = stateStack.slice(-1)[0];
				let nextInput = inputTokens[0];
				let selectedActions = lr1GotoActionTable.get(currentState).get(nextInput.terminalType);

				if(selectedActions === undefined) {
					return new Error(`Unable to decide next action with lookahead ${nextInput.terminalType} (syntax error)`);
				} else if(selectedActions.length > 1) {
					return new Error(`Unable to decide next action with lookahead ${nextInput.terminalType} (conflict)`);
				}

				let action = selectedActions[0];
				if(action instanceof LR1Parse.Action.Shift) {

					/* shift */

						// parse stack
						parseStack.push(nextInput.terminalType);
						stateStack.push(action.nextState);
						// parse tree
						parseForest.push(new LR1Parse.TreeNode(nextInput.terminalType));

						inputTokens.shift();

					yield action;
				} else if(action instanceof LR1Parse.Action.Reduce) {

					/* reduce */

						let reducedNode = new LR1Parse.TreeNode(action.reducingProduction.lhs);
						reducedNode.childNodes = [];

						for(let rhsi of action.reducingProduction.rhs) {
							parseStack.pop();
							stateStack.pop();
							reducedNode.childNodes.unshift(parseForest.pop());
						}
						currentState = stateStack.slice(-1)[0];

						let nonterminalShiftAction =
							lr1GotoActionTable.get(currentState).get(action.reducingProduction.lhs)[0];

						// parse stack
						parseStack.push(action.reducingProduction.lhs);
						stateStack.push(nonterminalShiftAction.nextState);
						// parse tree
						parseForest.push(reducedNode);

					yield action;
				} else if(action instanceof LR1Parse.Action.Accept) {

					/* shift $ */

						// parse stack
						parseStack.push(nextInput.terminalType);
						stateStack.push(action.nextState);
						// parse tree
						parseForest.push(new LR1Parse.TreeNode(nextInput.terminalType));

						inputTokens.shift();

					/* reduce */

						let reducedNode = new LR1Parse.TreeNode(action.reducingProduction.lhs);
						reducedNode.childNodes = [];

						for(let rhsi of action.reducingProduction.rhs) {
							parseStack.pop();
							stateStack.pop();
							reducedNode.childNodes.unshift(parseForest.pop());
						}
						currentState = stateStack.slice(-1)[0];

						// parse stack
						parseStack.push(action.reducingProduction.lhs);
						stateStack.pop();
						// parse tree
						parseForest.push(reducedNode);

					yield action;
					return;
				} else {
					throw new Error('Unknown action.');
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
	LR1Parse.Action = class {
		constructor() {

		}
	};{
		LR1Parse.Action.Shift = class extends LR1Parse.Action {
			constructor(nextState) {
				super();
				this.nextState = nextState;
			}
			[_ext.overrides.equals](that) {
				return that instanceof LR1Parse.Action.Shift
					&& _ext.equals(this.nextState, that.nextState);
			}
			toString() {
				return 'S' + Production.ARROW + this.nextState.id;
			}
		};
		LR1Parse.Action.PseudoShift = class extends LR1Parse.Action.Shift {
			constructor(nextState) {
				super(nextState);
			}
			[_ext.overrides.equals](that) {
				return that instanceof LR1Parse.Action.PseudoShift
					&& _ext.equals(this.nextState, that.nextState);
			}
			toString() {
				return Production.ARROW + this.nextState.id;
			}
		};
		LR1Parse.Action.Reduce = class extends LR1Parse.Action {
			constructor(reducingProduction) {
				super();
				this.reducingProduction = reducingProduction;
			}
			[_ext.overrides.equals](that) {
				return that instanceof LR1Parse.Action.Reduce
					&& _ext.equals(this.reducingProduction, that.reducingProduction);
			}
			toString() {
				return 'R(' + this.reducingProduction.id + ')';
			}
		};
		LR1Parse.Action.Accept = class extends LR1Parse.Action {
			constructor(reducingProduction) {
				super();
				this.reducingProduction = reducingProduction;
			}
			[_ext.overrides.equals](that) {
				return that instanceof LR1Parse.Action.Accept
					&& _ext.equals(this.reducingProduction, that.reducingProduction);
			}
			toString() {
				return 'A';
			}
		};
	}
}

export default {
	GSymbol: GSymbol,
	Terminal: Terminal,
	NonTerminal: NonTerminal,
	ActionSymbol: ActionSymbol,
	Production: Production,
	Grammar: Grammar,
	LR0Configuration: LR0Configuration,
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

	generateDotImageOfCFSM: generateDotImageOfCFSM,
	generateDotImageOfParseTrees: generateDotImageOfParseTrees,

	newLL1Parse: (grammar, ll1PredictTable, inputTokens) => (new LL1Parse(grammar, ll1PredictTable, inputTokens)),
	newLR1Parse: (grammar, lr1FSM, lr1GotoActionTable, inputTokens) => (new LR1Parse(grammar, lr1FSM, lr1GotoActionTable, inputTokens)),
};


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
export function generateDotImageOfCFSM(cfsm) {
	let dotFileSrc = "";
	dotFileSrc += ("digraph CFSM { ");
	dotFileSrc += ("rankdir=\"LR\"; ");
	dotFileSrc += ("node [shape=rect]; ");
	dotFileSrc += ("start -> " + cfsm.startState.id + "; ");
	for(let state of cfsm.states) {
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
export function generateDotImageOfParseTrees(parseTrees) {
	let dotFileSrc = "";
	dotFileSrc += ("digraph ParseTree { ");
	dotFileSrc += ("rankdir=\"UD\"; ");
	dotFileSrc += ("node [shape=ellipse]; ");
		for(let parseTree of parseTrees)
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
