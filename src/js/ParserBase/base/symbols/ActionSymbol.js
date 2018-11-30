import NonTerminal from './NonTerminal';

// TODO: currently unused
export default class ActionSymbol extends NonTerminal {
	constructor(name, displayName, action) {
		super(name, displayName);
		this.action = action;
	}
}
