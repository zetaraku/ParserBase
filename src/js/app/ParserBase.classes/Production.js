import { GSymbol } from './GSymbol';

export default class Production {
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
} {
	Production.serialNo = 0;
	Production.ARROW = {
		toString: function() {
			return '→';
		},
	};
	Production.ARROW_R = {
		toString: function() {
			return '←';
		},
	};
}
