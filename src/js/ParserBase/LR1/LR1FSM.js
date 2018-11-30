import { GSymbol, NonTerminal } from '../base/symbols';
import LR0Configuration from '../LR0/LR0Configuration';
import LR1Configuration from './LR1Configuration';
import _ext from '../../_ext';

export default class LR1FSM {
	constructor(startState) {
		this.startState = startState;
		this.states = new Set([startState]);
	}
	static from(grammar, firstSetTable) {
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

				let expandingNonTerminal = lr0conf.getNextSymbol();
				if(!(expandingNonTerminal instanceof NonTerminal))
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
					for(let prod of grammar.productionsMap.get(expandingNonTerminal)) {
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
	};{
		LR1FSM.State.serialNo = 1;
	}
}
