import { GSymbol } from './ParserBase.classes';

export function processGrammarInput(inputText) {
	let terminals = new Set();
	let nonTerminals = new Set();
	let startSymbol = null;
	let productions = [];
	let extraResult = {};

	for(let line of inputText.split('\n')) {
		if(line.startsWith('#!')) {
			let group = line.match(/^#!(.+?):(.+)$/);
			if(group === null) {
				throw new Error("Wrong directive.");
			} else if(group[1] === 'start-symbol') {
				startSymbol = group[2].trim();
			} else if(group[1] === 'parse-example') {
				extraResult.parseExample = group[2].trim();
			}
			continue;
		}
		if(line.startsWith('#') || /^\s*$/.test(line)) {
			continue;
		}
		let [lhst, rhst] = line.split(/->|→/);
		if(rhst === undefined) {
			console.warn("Invalid line: " + line);
			continue;
		}
		let prod = [];
		let lhsv = lhst.trim();
		prod.push(lhsv);
		nonTerminals.add(lhsv);
		let rhsvs = rhst.trim().split(/\s+/).filter(s => s !== '');
		for(let rhsv of rhsvs) {
			if(rhsv === 'λ')
				continue;
			prod.push(rhsv);
			terminals.add(rhsv);
		}
		productions.push(prod);
	}
	for(let nt of nonTerminals) {
		terminals.delete(nt);
	}
	if(productions[0] === undefined)
		throw new Error("No production.");
	startSymbol = startSymbol || productions[0][0];
	if(!nonTerminals.has(startSymbol))
		throw new Error(`Invalid Start Symbol '${startSymbol}'.`);

	return {
		terminals: terminals,
		nonTerminals: nonTerminals,
		startSymbol: startSymbol,
		productions: productions,
		extraResult: extraResult,
	};
}
export function processParseInput(inputText, vocabularyNameMap) {
	return inputText.trim().split(/\s+/).filter(s => s !== '')
		.map(function(t) {
			return {terminalType: vocabularyNameMap.get(t) || GSymbol.UNKNOWN};
		});
}
