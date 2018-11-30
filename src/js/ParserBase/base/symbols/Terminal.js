import GSymbol from './GSymbol';

export default class Terminal extends GSymbol {
	constructor(name, displayName) {
		super(name, displayName);
	}
} {
	// the EndOfInput Terminal ($)
	GSymbol.EOI = new Terminal(Symbol('$'), '$');
	// the placeholder for unknown terminal type
	GSymbol.UNKNOWN = new Terminal(Symbol('unknown'), 'unknown');
}
