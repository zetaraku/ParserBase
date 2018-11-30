import { NonTerminal } from '../base/symbols';
import LR0Configuration from './LR0Configuration';
import _ext from '../../_ext';

export default class LR0FSM {
	constructor(startState) {
		this.startState = startState;
		this.states = new Set([startState]);
	}
	static from(grammar) {
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

				let expandingNonTerminal = lr0conf.getNextSymbol();
				if(!(expandingNonTerminal instanceof NonTerminal))
					continue;

				for(let prod of grammar.productionsMap.get(expandingNonTerminal)) {
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
	};{
		LR0FSM.State.serialNo = 1;
	}
}
