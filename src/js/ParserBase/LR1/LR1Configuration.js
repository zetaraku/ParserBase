export default class LR1Configuration {
	constructor(baseLR0Configuration, lookahead) {
		this.id = LR1Configuration.serialNo++;
		this.baseLR0Configuration = baseLR0Configuration;
		this.lookahead = lookahead;
	}
} {
	LR1Configuration.serialNo = 1;
}
