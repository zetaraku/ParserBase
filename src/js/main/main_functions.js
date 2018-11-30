import {
	GSymbol,
	Terminal,
	NonTerminal,
	Production,
	Grammar,
} from '../ParserBase';

export function buildGrammar(terminalNames, nonTerminalNames, startSymbolName, rawProductions) {
	Production.serialNo = 0;

	let vocabularyNameMap = new Map();
	for(let name of terminalNames) {
		if(vocabularyNameMap.has(name))
			throw new Error(`Error: Vocabulary name '${name}' declared more than once!`);
		vocabularyNameMap.set(name, new Terminal(name));
	}
	for(let name of nonTerminalNames) {
		if(vocabularyNameMap.has(name))
			throw new Error(`Error: Vocabulary name '${name}' declared more than once!`);
		vocabularyNameMap.set(name, new NonTerminal(name));
	}

	let terminals = [...terminalNames.map(name => vocabularyNameMap.get(name)), GSymbol.EOI];
	let nonTerminals = [...nonTerminalNames.map(name => vocabularyNameMap.get(name)), GSymbol.SYSTEM_GOAL];

	let startSymbol = vocabularyNameMap.get(startSymbolName);
	if(!startSymbol)
		throw new Error(`start symbol '${startSymbolName}' no found`);

	let augmentingProduction = new Production(GSymbol.SYSTEM_GOAL, [startSymbol, GSymbol.EOI]);

	let productions = [augmentingProduction, ...rawProductions.map(function([lhsName, ...rhsNames]) {
		let lhs = vocabularyNameMap.get(lhsName);
		let rhs = rhsNames.map(name => vocabularyNameMap.get(name));
		return new Production(lhs, rhs);
	})];

	return new Grammar(terminals, nonTerminals, startSymbol, productions);
}
export function buildVocabularyNameMap(grammar) {
	return new Map([
		...grammar.terminals,
		...grammar.nonTerminals,
		GSymbol.LAMBDA
	].map((s) => [s.name, s]));
}
export function processGrammarInput(inputText) {
	let symbols = new Set();
	let terminals = undefined;
	let nonTerminals = new Set();
	let startSymbol = null;
	let productions = [];
	let extraResult = {};

	inputText.split('\n').forEach((line, i) => {
		if(line.startsWith('#!')) {
			processDirective(line, i);
		} else if(line.startsWith('#') || /^\s*$/.test(line)) {
			processBlankLine(line, i);
		} else {
			processProduction(line, i);
		}
	});

	terminals = new Set(Array.from(symbols.keys()).filter(e => !nonTerminals.has(e)));

	if(productions[0] === undefined)
		throw new Error('No production.');

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


	function processDirective(line, i) {
		let group = line.match(/^#!(.+?):(.+)$/);
		if(group === null) {
			throw new Error(`Invalid directive at line ${i+1}: ${line}`);
		} else if(group[1] === 'start-symbol') {
			startSymbol = group[2].trim();
		} else if(group[1] === 'parse-example') {
			extraResult.parseExample = group[2].trim();
		} else {
			throw new Error(`Invalid directive at line ${i+1}: ${line}`);
		}
	}

	function processBlankLine(/*line, i*/) {
		// do nothing
	}

	function processProduction(line, i) {
		let [lhsTmp, rhsTmp] = line.split(/->|→/);

		if(rhsTmp === undefined) {
			throw new Error(`Invalid input at line ${i+1}: ${line}`);
		}

		let prod = []; {

			let lhsVal = lhsTmp.trim();

			prod.push(lhsVal);

			// symbols.add(lhsVal);
			nonTerminals.add(lhsVal);

			let rhsVals = rhsTmp.trim().split(/\s+/).filter(s => s !== '');

			for(let rhsVal of rhsVals) {
				if(rhsVal === 'λ')
					continue;

				prod.push(rhsVal);

				symbols.add(rhsVal);
			}
		}

		productions.push(prod);
	}
}
export function processParseInput(inputText, vocabularyNameMap) {
	return inputText.trim().split(/\s+/)
		.filter(s => s !== '')
		.map(t => ({ terminalType: vocabularyNameMap.get(t) || GSymbol.UNKNOWN }));
}
