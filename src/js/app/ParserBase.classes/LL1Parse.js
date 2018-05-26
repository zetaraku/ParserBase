import { GSymbol, Terminal, NonTerminal } from './GSymbol';

export default class LL1Parse {
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
					throw new Error('Invalid Symbol: ' + topSymbol);
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
