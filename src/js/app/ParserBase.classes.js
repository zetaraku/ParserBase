const _ext = require('./_ext');

class GSymbol {
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
class Terminal extends GSymbol {
	constructor(name, displayName) {
		super(name, displayName);
	}
} {
	// the EndOfInput Terminal ($)
	GSymbol.EOI = new Terminal(Symbol('$'), '$');
	// the placeholder for unknown terminal type
	GSymbol.UNKNOWN = new Terminal(Symbol('unknown'), 'unknown');
}
class NonTerminal extends GSymbol {
	constructor(name, displayName) {
		super(name, displayName);
	}
} {
	// the augmenting NonTerminal
	GSymbol.SYSTEM_GOAL = new NonTerminal(Symbol('system_goal'), 'system_goal');
}
class ActionSymbol extends NonTerminal {
	// currently unused
	constructor(name, displayName, action) {
		super(name, displayName);
		this.action = action;
	}
} {
}
class Production {
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
class Grammar {
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
class LR0Configuration {
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
class LR1Configuration {
	constructor(baseLR0Configuration, lookahead) {
		this.id = LR1Configuration.serialNo++;
		this.baseLR0Configuration = baseLR0Configuration;
		this.lookahead = lookahead;
	}
} {
	LR1Configuration.serialNo = 1;
}
class LR0FSM {
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
class LR1FSM {
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
class LL1Parse {
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
class LR1Parse {
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

module.exports = {
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
};
