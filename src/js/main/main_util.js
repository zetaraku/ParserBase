import {
	GSymbol,
	Terminal,
	// NonTerminal,
	Production,
} from '../ParserBase';

// set display of parser components
GSymbol.prototype.toString = function() {
	let classArr = ['gsymbol'];
	if(this === GSymbol.LAMBDA)
		classArr.push('lambda');
	return '<span class="' + classArr.join(' ') + '">' + this.displayName + '</span>';
};
Terminal.prototype.toString = function() {
	let classArr = ['gsymbol','terminal'];
	if(this === GSymbol.UNKNOWN)
		classArr.push('unknown');
	if(this === GSymbol.EOI)
		classArr.push('end-symbol');
	return '<span class="' + classArr.join(' ') + '">' + this.displayName + '</span>';
};
Production.ARROW_R = '←';
Production.prototype.toStringReversed = function() {
	return (this.lhs + ' ' + Production.ARROW_R + ' ' +
		(this.rhs.length !== 0 ? this.rhs.join(' ') : GSymbol.LAMBDA));
};
