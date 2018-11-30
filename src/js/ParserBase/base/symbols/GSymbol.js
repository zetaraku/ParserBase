export default class GSymbol {
	// Do NOT use 'Symbol', that will conflict with 'Symbol' type in ES6
	constructor(name, displayName) {
		this.name = name;
		this.displayName = displayName || name;
	}
	toString() {
		return this.displayName;
	}
} {
	// the placeholder for lambda (nothing)
	GSymbol.LAMBDA = new GSymbol(Symbol('λ'), 'λ');
	// the indicator for current position of Configuration
	GSymbol.DOT = new GSymbol(Symbol('●'), '●');
}
