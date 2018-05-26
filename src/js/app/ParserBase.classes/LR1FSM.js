import _ext from '../_ext';

export default class LR1FSM {
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
