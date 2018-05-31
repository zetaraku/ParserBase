import { GSymbol } from './GSymbol';
import Production from './Production';
import _ext from '../_ext';

export default class LR1Parse {
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
					/* shift */ {
						// parse stack
						parseStack.push(nextInput.terminalType);
						stateStack.push(action.nextState);
						// parse tree
						parseForest.push(new LR1Parse.TreeNode(nextInput.terminalType));

						inputTokens.shift();
					}
					yield action;
				} else if(action instanceof LR1Parse.Action.Reduce) {
					/* reduce */ {
						let reducedNode = new LR1Parse.TreeNode(action.reducingProduction.lhs);
						reducedNode.childNodes = [];

						for(let rhsi of action.reducingProduction.rhs) {
							rhsi;	// prevent 'no-unused-vars' warning
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
					}
					yield action;
				} else if(action instanceof LR1Parse.Action.Accept) {
					/* shift $ */ {
						// parse stack
						parseStack.push(nextInput.terminalType);
						stateStack.push(action.nextState);
						// parse tree
						parseForest.push(new LR1Parse.TreeNode(nextInput.terminalType));

						inputTokens.shift();
					}
					/* reduce */ {
						let reducedNode = new LR1Parse.TreeNode(action.reducingProduction.lhs);
						reducedNode.childNodes = [];

						for(let rhsi of action.reducingProduction.rhs) {
							rhsi;	// prevent 'no-unused-vars' warning
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
					}
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
