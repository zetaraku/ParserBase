import { GSymbol } from './GSymbol';
import _ext from '../_ext';

export default class Grammar {
	constructor(terminals, nonTerminals, startSymbol, productions) {
		this.terminals = terminals;
		this.nonTerminals = nonTerminals;
		this.startSymbol = startSymbol;
		this.productions = productions;
		this.productionsMap = _ext.groupBy(productions, e => e.lhs);
		this.augmentingProduction = productions[0];
	}
	buildVocabularyNameMap() {
		return new Map([
			...this.terminals,
			...this.nonTerminals,
			GSymbol.LAMBDA
		].map((s) => [s.name, s]));
	}
} {
}
