import _ext from './_ext';
import {
	GSymbol,
	Production,
	LR0Configuration,
	LR0FSM,
	LR1FSM,
	LL1Parse,
	LR1Parse,
} from './ParserBase.classes';


function dotStringOf(self) {
	if(self instanceof GSymbol) {
		return self.displayName;
	} else if(self instanceof LL1Parse.TreeNode) {
		return dotStringOf(self.symbol);
	} else if(self instanceof LR1Parse.TreeNode) {
		return dotStringOf(self.symbol);
	} else if(self instanceof LR0Configuration) {
		let r = self.production.rhs.slice();
		r.splice(self.dotPos, 0, GSymbol.DOT);
		return dotStringOf(self.production.lhs) + ' -> ' + r.map(e => dotStringOf(e)).join(' ');
	} else if(self instanceof LR0FSM.State) {
		return Array.from(self.configurationSet)
			.map(function(lr0conf) {
				return dotStringOf(lr0conf) + '\\l';
			}).join('');
	} else if(self instanceof LR1FSM.State) {
		return Array.from(_ext.groupBy(self.configurationSet, e => e.baseLR0Configuration).entries())
			.map(function([lr0conf, lr1confs]) {
				return dotStringOf(lr0conf) + ' ' + '{' +
					Array.from(lr1confs).map(e => dotStringOf(e.lookahead)).join(' ') +
				'}' + '\\l';
			}).join('');
	} else if(self instanceof Production) {
		return (dotStringOf(self.lhs) + ' -> ' +
			(self.rhs.length !== 0 ? self.rhs.map(e => dotStringOf(e)).join(' ') : dotStringOf(GSymbol.LAMBDA)));
	} else {
		console.error(self);
	}
}

export function buildDotSourceOfCFSM(cfsm) {
	let dotFileSrc = `\
		digraph CFSM {
			rankdir = "LR";
			node [shape = rect];
			start -> ${cfsm.startState.id};\n`;
	for(let state of cfsm.states) {
		dotFileSrc += `\
			${state.id} [
				label = "State ${state.id}\\n${dotStringOf(state)}"
			];\n`;
		for(let [symbol, nextState] of state.transitionMap) {
			dotFileSrc += `\
				${state.id} -> ${nextState.id} [
					label = "${dotStringOf(symbol)}"
					style = solid
				];\n`;
		}
	}
	dotFileSrc += `\
		}\n`;

	return dotFileSrc;
}
export function buildDotSourceOfParseTrees(parseTrees) {
	let dotFileSrc = `\
		digraph ParseTree {
			rankdir = "UD";
			node [shape = ellipse]\n`;
	{
		for(let parseTree of parseTrees)
			traverseNode(parseTree);
	}
	dotFileSrc += `\
		}\n`;

	return dotFileSrc;

	function traverseNode(node) {
		dotFileSrc += `\
			${node.id} [label = "${dotStringOf(node)}"];\n`;

		if(node.childNodes === undefined)
			return;

		for(let childNode of node.childNodes)
			dotFileSrc += `\
				${node.id} -> ${childNode.id};\n`;
		for(let childNode of node.childNodes)
			traverseNode(childNode);
	}
}
