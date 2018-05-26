import { GSymbol } from './GSymbol';
import Production from './Production';

export default class LR0Configuration {
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
