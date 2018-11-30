import { GSymbol } from './symbols';

export default class Production {
	constructor(lhs, rhs) {
		this.id = Production.serialNo++;
		this.lhs = lhs;
		this.rhs = rhs;
	}
	toString() {
		let rhs = this.rhs.length !== 0 ? this.rhs.join(' ') : GSymbol.LAMBDA;
		return `${this.lhs} ${Production.ARROW} ${rhs}`;
	}
} {
	Production.serialNo = 0;
	Production.ARROW = '→';
}
