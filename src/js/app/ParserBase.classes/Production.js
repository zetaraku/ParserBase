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
