export class GSymbol {
	// Do NOT use 'Symbol', that will confilct with 'Symbol' type in ES6
	constructor(name, displayName) {
		this.name = name;
		this.displayName = displayName || name;
	}
	toString() {
		return this.displayName;
	}
	toRawString() {
		return this.displayName;
	}
} {
	// the placeholder for lambda (nothing)
	GSymbol.LAMBDA = new GSymbol(Symbol('λ'), 'λ');
	// the indicator for current position of Configuration
	GSymbol.DOT = new GSymbol(Symbol('●'), '●');
}

export class Terminal extends GSymbol {
	constructor(name, displayName) {
		super(name, displayName);
	}
};{
	// the EndOfInput Terminal ($)
	GSymbol.EOI = new Terminal(Symbol('$'), '$');
	// the placeholder for unknown terminal type
	GSymbol.UNKNOWN = new Terminal(Symbol('unknown'), 'unknown');
}

export class NonTerminal extends GSymbol {
	constructor(name, displayName) {
		super(name, displayName);
	}
};{
	// the augmenting NonTerminal
	GSymbol.SYSTEM_GOAL = new NonTerminal(Symbol('system_goal'), 'system_goal');
}

export class ActionSymbol extends NonTerminal {
	// currently unused
	constructor(name, displayName, action) {
		super(name, displayName);
		this.action = action;
	}
};{
}
