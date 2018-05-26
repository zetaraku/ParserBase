export default class LR0FSM {
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
