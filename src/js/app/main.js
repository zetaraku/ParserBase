import $ from 'jquery';
import * as ParserBase from './ParserBase';
import {
	GSymbol,
	// Terminal,
	NonTerminal,
	// ActionSymbol,
	// Production,
	// Grammar,
	// LR0Configuration,
	// LR1Configuration,
	// LR0FSM,
	// LR1FSM,
	LL1Parse,
	LR1Parse,
} from './ParserBase.classes';
import {
	processGrammarInput,
	processParseInput,
} from './main_functions';
import {
	buildDotSourceOfCFSM,
	buildDotSourceOfParseTrees,
} from './graphviz_functions';
import Viz from 'viz.js';
import { Module, render } from 'viz.js/full.render';
import canvg from 'canvg-browser';
import './main_util';

const viz = new Viz({ Module, render });

let COMMA_SEPERATOR = '<span class="comma"> , </span>';

window.onerror = function(message, file, lineNumber) {
	window.alert(`${message}\n\nat ${file}:${lineNumber}`);
	return false;
};

$(document).ready(function() {

	let editMode = true;

	let tmpCanvas = document.getElementById('tmpCanvas');
	initTabs();

	// handle setup of grammar input
	$('#grammar_form').on('submit', function() {
		if(!editMode) {
			$('#info').slideUp(function() {
				editMode = true;
				$('#generate').val('Generate');
				$('#editor').slideDown();
			});
			return false;
		}

		let rawGrammar = processGrammarInput($('#grammar_input').val());

		if(rawGrammar.extraResult.parseExample !== undefined) {
			$('.source_input').val(rawGrammar.extraResult.parseExample);
		}

		let grammar = ParserBase.buildGrammar(Array.from(rawGrammar.terminals), Array.from(rawGrammar.nonTerminals), rawGrammar.startSymbol, rawGrammar.productions);
		let vocabularyNameMap = grammar.buildVocabularyNameMap();
		let unreachableSymbols = ParserBase.computeUnreachableSymbols(grammar);
		let unreducibleSymbols = ParserBase.computeUnreducibleSymbols(grammar);
		let nullableSymbols = ParserBase.computeNullableSymbols(grammar);
		let firstSetTable = ParserBase.buildFirstSetTable(grammar, nullableSymbols);
		let followSetTable = ParserBase.buildFollowSetTable(grammar, firstSetTable);
		let predictSetTable = ParserBase.buildPredictSetTable(grammar, firstSetTable, followSetTable);
		let ll1PredictTable = ParserBase.buildLL1PredictTable(grammar, predictSetTable);
		let lr0FSM = ParserBase.buildLR0FSM(grammar);
		let lr1FSM = ParserBase.buildLR1FSM(grammar, firstSetTable);
		// let lr0FSM_Viz = await viz.renderString(buildDotSourceOfCFSM(lr0FSM));
		// let lr1FSM_Viz = await viz.renderString(buildDotSourceOfCFSM(lr1FSM));
		let lr1GotoActionTable = ParserBase.buildLR1GotoActionTable(grammar, lr1FSM);

		let terminalsList = Array.from(grammar.terminals);
		let nonTerminalsList = Array.from(grammar.nonTerminals);
		let symbolsList = [...terminalsList, ...nonTerminalsList];

		NonTerminal.prototype.toString = function() {
			let classArr = ['gsymbol','non-terminal'];
			if(this === GSymbol.SYSTEM_GOAL)
				classArr.push('augmenting-symbol');
			if(this === grammar.startSymbol)
				classArr.push('start-symbol');
			if(nullableSymbols.has(this))		// need nullableSymbols
				classArr.push('nullable');
			return '<span class="' + classArr.join(' ') + '">' + this.displayName + '</span>';
		};

		// display
		$('#editor').slideUp(function() {
			// Grammar tab
			$('#grammar').html('<table style="width: 100%;"><tr>' +

				'<td style="width: 20%; vertical-align: top;">' +

					'Terminals: <ul>' +
						tagList(Array.from(grammar.terminals), 'li') +
					'</ul></td>' +

				'<td style="width: 25%; vertical-align: top;">' +

					'NonTerminals: <ul>' +
						tagList(Array.from(grammar.nonTerminals), 'li') +
					'</ul>' +

					'Start Symbol: <ul>' +
						tagList([grammar.startSymbol], 'li') +
					'</ul>' +

					'Unreachable Symbols: <ul>' +
						(unreachableSymbols.length > 0 ?
							tagList(unreachableSymbols, 'li')
							: '<li class="lambda">(none)</li>'
						) +
					'</ul>' +

					'Unreducible Symbols: <ul>' +
						(unreducibleSymbols.length > 0 ?
							tagList(unreducibleSymbols, 'li')
							: '<li class="lambda">(none)</li>'
						) +
					'</ul></td>' +

				'<td style="width: 50%; vertical-align: top;">' +

					'Productions: <ul>' +
						tagList(grammar.productions, 'li') +
					'</ul></td>' +

			'</tr></table>');

			// Nullables tab
			$('#lambda').html('<table class="compact-table hoverable">' +
				'<tr><th>NonTerminal</th></tr>' +
				(nullableSymbols.size > 0 ?
					Array.from(nullableSymbols).map(e => '<tr><td>' + e + '</td></tr>').join('')
					: '<tr><td class="lambda">(none)</td></tr>'
				) +
			'</table>');

			// FirstSet(1) tab
			$('#first').html('<table class="compact-table hoverable">' +
				'<tr><th>NonTerminal</th><th>FirstSet</th></tr>' +
				Array.from(firstSetTable.entries())
					.filter(function([symbol, firstSet]) {
						return (symbol instanceof NonTerminal);
					}).map(function([symbol, firstSet]) {
						return {
							symbol: symbol,
							firstSet: Array.from(firstSet)
						};
					}).map(function({symbol, firstSet}) {
						return ('<tr>' +
							'<td>' + symbol + '</td>' +
							'<td>' + firstSet.join(COMMA_SEPERATOR) + '</td>' +
						'</tr>');
					}).join('') +
			'</table>');

			// FollowSet(1) tab
			$('#follow').html('<table class="compact-table hoverable">' +
				'<tr><th>NonTerminal</th><th>FollowSet</th></tr>' +
				Array.from(followSetTable.entries())
					.map(function([symbol, followSet]) {
						return {
							symbol: symbol,
							followSet: Array.from(followSet)
						};
					}).map(function({symbol, followSet}) {
						return ('<tr>' +
							'<td>' + symbol + '</td>' +
							'<td>' + followSet.join(COMMA_SEPERATOR) + '</td>' +
						'</tr>');
					}).join('') +
			'</table>');

			// PredictSet(1) tab
			$('#predict').html('<table class="compact-table hoverable">' +
				'<tr><th colspan="4">Production</th><th>PredictSet</th></tr>' +
				Array.from(predictSetTable.entries())
					.map(function([production, predictSet]) {
						return {
							production: production,
							predictSet: Array.from(predictSet)
						};
					}).map(function({production, predictSet}) {
						return ('<tr>' +
							tagList([
								production.id,
								production.lhs,
								' → ',
								(production.rhs.length !== 0 ? production.rhs.join(' ') : GSymbol.LAMBDA),
								predictSet.join(COMMA_SEPERATOR)
							], 'td') +
						'</tr>');
					}).join('') +
			'</table>');

			// LL(1) Table tab
			$('#ll1table').html('<table class="compact-table hoverable">' +
				'<th class="diagonalFalling">NonTerminal\\Terminal</th>' + terminalsList.map((t) => '<th>' + t + '</th>').join('') +
				nonTerminalsList.map(function(nt) {
					let ntPredictSet = ll1PredictTable.get(nt);
					return '<tr><td class="b">' + nt + '</td>' +
						terminalsList.map(function(t) {
							if(ntPredictSet.has(t)) {
								let ntPredictSetAtT = ntPredictSet.get(t);
								return '<td class="' + (ntPredictSetAtT.length > 1 ? 'conflict' : '') + '">' +
									ntPredictSetAtT.map((p) => 'P(' + p.id + ')').join('<br>') +
								'</td>';
							} else {
								return '<td>' + '</td>';
							}
						}).join('') +
						'</tr>';
				}).join('') +
			'</table>');

			// LR(1) Table tab
			$('#lr1table').html('<table class="compact-table hoverable">' +
				'<th class="diagonalFalling">State\\Symbol</th>' +
				tagList(symbolsList, 'th') +
				Array.from(lr1FSM.states).map(function(st) {
					let stActionSet = lr1GotoActionTable.get(st);
					return '<tr><td class="b">' + st.id + '</td>' +
						symbolsList.map(function(s) {
							if(stActionSet.has(s)) {
								let stActionSetAtT = stActionSet.get(s);
								return '<td class="' + (stActionSetAtT.length > 1 ? 'conflict' : '') + '">' +
									stActionSetAtT.map(e => e.toString()).join('<br>') +
								'</td>';
							} else {
								return '<td>' + '</td>';
							}
						}).join('') +
						'</tr>';
				}).join('') +
			'</table>');

			// LR(0) FSM tab
			$('#lr0fsm').html('Please click on the button above to generate the FSM diagram.');
			$('#lr0fsm_gen').on('click', async function() {
				let lr0FSM_Viz = await viz.renderString(buildDotSourceOfCFSM(lr0FSM));
				$('#lr0fsm').html(lr0FSM_Viz);
				$('#lr0fsm_tab a.downloadLink').show().on('click', function(event) {
					canvg(tmpCanvas, lr0FSM_Viz);
					event.target.href = tmpCanvas.toDataURL('image/png');
				});
			});

			// LR(1) FSM tab
			$('#lr1fsm').html('Please click on the button above to generate the FSM diagram.');
			$('#lr1fsm_gen').on('click', async function() {
				let lr1FSM_Viz = await viz.renderString(buildDotSourceOfCFSM(lr1FSM));
				$('#lr1fsm').html(lr1FSM_Viz);
				$('#lr1fsm_tab a.downloadLink').show().on('click', function(event) {
					canvg(tmpCanvas, lr1FSM_Viz);
					event.target.href = tmpCanvas.toDataURL('image/png');
				});
			});

			// LL(1) Parse tab
			$('#ll1parse .start_parse').off('click');
			$('#ll1parse .parse_next_btn').off('click');
			$('#ll1parse .view_parse_tree').off('click');
			$('#ll1parse .start_parse').on('click', function() {
				let inputTokens = processParseInput($('#ll1parse .source_input').val(), vocabularyNameMap);
				let currentParse = ParserBase.newLL1Parse(grammar, ll1PredictTable, inputTokens);
				let parseStack = currentParse.parseStack;
				let parseTree = currentParse.parseTree;
				let rhsStack = currentParse.rhsStack;

				updateMsg('Parse started');
				updateData();

				let f = (function*() {
					while(true) {
						let r = currentParse.step.next();
						if(r.done) {
							if(!(r.value instanceof Error))
								return updateMsg('Parse finished');
							else
								return updateMsg('Error: ' + r.value.message);
						}
						let stepInfo = r.value;
						if(stepInfo instanceof LL1Parse.Action.Match) {
							updateMsg(`Match ${stepInfo.terminalType}`);
							$('#ll1parse .parse_stack td').first().addClass('highlighted');
							$('#ll1parse .itoken_stream td').first().addClass('highlighted');
							yield;
							updateData();
							yield;
						} else if(stepInfo instanceof LL1Parse.Action.Predict) {
							updateMsg(`Predict ${stepInfo.usingProd}`);
							$('#ll1parse .parse_stack td').first().addClass('highlighted');
							yield;
							updateData();
							$('#ll1parse .parse_stack td').slice(0,stepInfo.usingProd.rhs.length).addClass('highlighted');
							yield;
						} else if(stepInfo instanceof LL1Parse.Action.Accept) {
							updateMsg(`Match ${stepInfo.terminalType} & Accept`);
							$('#ll1parse .parse_stack td').first().addClass('highlighted');
							$('#ll1parse .itoken_stream td').first().addClass('highlighted');
							yield;
							updateData();
							yield;
						}
						clearHighlight();
					}
				})();

				f = f.next.bind(f);
				$('#ll1parse .parse_next_btn').off('click').on('click', f);
				$('#ll1parse .skip_all_btn').off('click').on('click', function() {
					while(f && !f().done);
				});
				$('#ll1parse .view_parse_tree').off('click').on('click', displayParseTree);

				function updateMsg(msg) {
					$('#ll1parse .parse_step_info').html(msg);
				}
				function clearHighlight() {
					$('#ll1parse .parse_stack td').removeClass('highlighted');
					$('#ll1parse .itoken_stream td').removeClass('highlighted');
				}
				function updateData() {
					// update stacks
					$('#ll1parse .parse_stack').html(tagList(parseStack.slice().reverse(), 'td'));
					$('#ll1parse .itoken_stream').html(tagList(inputTokens.map(e => e.terminalType), 'td'));
					$('#ll1parse .semantic_stack').html(
						[...rhsStack, [currentParse.currentRHS, currentParse.currentRHSIndex]]
							.map(([currentRHS, currentRHSIndex]) => {
								return '<table><tr>' + currentRHS.map((ee, ii) => {
									if(ii === currentRHSIndex)
										return '<td class="highlighted">' + ee + '</td>';
									else
										return '<td>' + ee + '</td>';
								}).join('') + '</tr></table>';
							}).join(''));
					$('#ll1parse .parse_step_info').html('');
				}
				async function displayParseTree() {
					let ll1parsetree_Viz = await viz.renderString(buildDotSourceOfParseTrees([parseTree]));
					let myWindow = window.open(); {
						myWindow.document.write(`
							<html>
								<head>
									<title>ParseTree</title>
								</head>
								<body>
									<div id="parsetree"></div>
									<a id="downloadLink" href="javascript:void(0);" download="parsetree.png">Click to download</a>
								</body>
							</html>
						`);
						myWindow.document.getElementById('parsetree').innerHTML = ll1parsetree_Viz;
						myWindow.document.getElementById('downloadLink').onclick = function(event) {
							canvg(tmpCanvas, ll1parsetree_Viz);
							event.target.href = tmpCanvas.toDataURL('image/png');
						};
					} myWindow.document.close();
				}
			});

			// LR(1) Parse tab
			$('#lr1parse .start_parse').off('click');
			$('#lr1parse .parse_next_btn').off('click');
			$('#lr1parse .view_parse_tree').off('click');
			$('#lr1parse .start_parse').on('click', function() {
				let inputTokens = processParseInput($('#lr1parse .source_input').val(), vocabularyNameMap);
				let currentParse = ParserBase.newLR1Parse(grammar, lr1FSM, lr1GotoActionTable, inputTokens);
				let parseStack = currentParse.parseStack;
				let parseForest = currentParse.parseForest;
				let stateStack = currentParse.stateStack;

				updateMsg('Parse started');
				updateData();

				let f = (function*() {
					while(true) {
						let r = currentParse.step.next();
						if(r.done) {
							if(!(r.value instanceof Error))
								return updateMsg('Parse finished');
							else
								return updateMsg('Error: ' + r.value.message);
						}
						let stepInfo = r.value;
						if(stepInfo instanceof LR1Parse.Action.Shift) {
							updateMsg('Shift');
							$('#lr1parse .itoken_stream td').first().addClass('highlighted');
							yield;
							updateData();
							$('#lr1parse .parse_stack td').last().addClass('highlighted');
							yield;
						} else if(stepInfo instanceof LR1Parse.Action.Reduce) {
							updateMsg('Reduce ' + stepInfo.reducingProduction.toStringReversed());
							if(stepInfo.reducingProduction.rhs.length>0)
								$('#lr1parse .parse_stack td').slice(-stepInfo.reducingProduction.rhs.length).addClass('highlighted');
							yield;
							updateData();
							$('#lr1parse .parse_stack td').last().addClass('highlighted');
							yield;
						} else if(stepInfo instanceof LR1Parse.Action.Accept) {
							updateMsg('Shift & Reduce ' + stepInfo.reducingProduction.toStringReversed() + ' & Accept');
							$('#lr1parse .itoken_stream td').first().addClass('highlighted');
							$('#lr1parse .parse_stack td').addClass('highlighted');
							yield;
							updateData();
							$('#lr1parse .parse_stack td').last().addClass('highlighted');
							yield;
						}
						clearHighlight();
					}
				})();
				f = f.next.bind(f);

				$('#lr1parse .parse_next_btn').off('click').on('click', f);
				$('#lr1parse .skip_all_btn').off('click').on('click', function() {
					while(f && !f().done);
				});
				$('#lr1parse .view_parse_tree').off('click').on('click', displayParseTree);

				function updateMsg(msg) {
					$('#lr1parse .parse_step_info').html(msg);
				}
				function clearHighlight() {
					$('#lr1parse .parse_stack td').removeClass('highlighted');
					$('#lr1parse .itoken_stream td').removeClass('highlighted');
				}
				function updateData() {
					$('#lr1parse .parse_stack').html(tagList(parseStack, 'td'));
					$('#lr1parse .itoken_stream').html(tagList(inputTokens.map(e => e.terminalType), 'td'));
					$('#lr1parse .state_stack').html(tagList(stateStack.map(e => e.id), 'td'));
					$('#lr1parse .parse_step_info').html('');
				}
				async function displayParseTree() {
					let lr1parsetree_Viz = await viz.renderString(buildDotSourceOfParseTrees(parseForest));
					let myWindow = window.open(); {
						myWindow.document.write(`
							<html>
								<head>
									<title>ParseTree</title>
								</head>
								<body>
									<div id="parsetree"></div>
									<a id="downloadLink" href="javascript:void(0);" download="parsetree.png">Click to download</a>
								</body>
							</html>
						`);
						myWindow.document.getElementById('parsetree').innerHTML = lr1parsetree_Viz;
						myWindow.document.getElementById('downloadLink').onclick = function(event) {
							canvg(tmpCanvas, lr1parsetree_Viz);
							event.target.href = tmpCanvas.toDataURL('image/png');
						};
					} myWindow.document.close();
				}
			});

			$('#generate').val('Edit');
			editMode = false;
			$('#info').slideDown();
		});

		return false;
	});
});

function initTabs() {
	const tablis = {
		grammar_tab: 'Grammar',
		lambda_tab: 'Nullables',
		first_tab: 'First Set (1)',
		follow_tab: 'Follow Set (1)',
		predict_tab: 'Predict Set (1)',
		ll1table_tab: 'LL(1) Table',
		ll1parse_tab: 'LL(1) Parse',
		lr0fsm_tab: 'LR(0) FSM',
		lr1fsm_tab: 'LR(1) FSM',
		lr1table_tab: 'LR(1) Table',
		lr1parse_tab: 'LR(1) Parse',
	};
	for(let tabname in tablis) {
		$('#tab_ul').append(
			$(`<li><a name="${tabname}" href="javascript:void(0);" class="tablinks">${tablis[tabname]}</a></li>`)
				.on('click', () => openTab(tabname))
		);
	}
	document.getElementsByClassName('tablinks')[0].click();
}

function tagList(eArr, tagName) {
	return eArr.map(e => `<${tagName}>${e}</${tagName}>`).join('');
}

function openTab(tabname) {
	$('.tabcontent').css('display', 'none');
	$('.tablinks').removeClass('active');
	$('#'+tabname).css('display', 'block');
	$('#tab_ul').find('[name='+tabname+']').addClass('active');
}
