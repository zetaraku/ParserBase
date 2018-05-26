import Viz from 'viz.js';
import { Module, render } from 'viz.js/full.render';

const viz = new Viz({ Module, render });

export function generateDotImageOfCFSM(cfsm) {
	let dotFileSrc = "";
	dotFileSrc += ("digraph CFSM { ");
	dotFileSrc += ("rankdir=\"LR\"; ");
	dotFileSrc += ("node [shape=rect]; ");
	dotFileSrc += ("start -> " + cfsm.startState.id + "; ");
	for(let state of cfsm.states) {
		dotFileSrc += (state.id + " [" +
			"label = \"" +
				"State " + state.id + "\\n" +
				state.subContentReprensentation() +
			"\"" +
		"]; ");
		for(let [symbol, nextState] of state.transitionMap) {
			dotFileSrc += (state.id + " -> " + nextState.id + " [" +
				"label = \"" + symbol.toRawString() + "\" " +
				"style = solid" +
			"]; ");
		}
	}
	dotFileSrc += ("}");

	return viz.renderString(dotFileSrc);
}
export function generateDotImageOfParseTrees(parseTrees) {
	let dotFileSrc = "";
	dotFileSrc += ("digraph ParseTree { ");
	dotFileSrc += ("rankdir=\"UD\"; ");
	dotFileSrc += ("node [shape=ellipse]; ");
		for(let parseTree of parseTrees)
			traverseNode(parseTree);
	dotFileSrc += ("}");

	return viz.renderString(dotFileSrc);

	function traverseNode(node) {
		dotFileSrc += (node.id + " [label = \"" + node.toRawString() + "\"]; ");
		if(node.childNodes !== undefined) {
			for(let childNode of node.childNodes)
				dotFileSrc += (node.id + " -> " + childNode.id + "; ");
			for(let childNode of node.childNodes)
				traverseNode(childNode);
		}
	}
}
