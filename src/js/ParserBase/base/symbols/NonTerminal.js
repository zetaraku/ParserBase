import GSymbol from './GSymbol';

export default class NonTerminal extends GSymbol {
	constructor(name, displayName) {
		super(name, displayName);
	}
} {
	// the augmenting NonTerminal
	GSymbol.SYSTEM_GOAL = new NonTerminal(Symbol('system_goal'), 'system_goal');
}
