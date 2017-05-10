define(['jquery', 'app/ParserBase', 'app/main_functions', 'canvg'], function (_jquery, _ParserBase, _main_functions, _canvg) {
	'use strict';

	var _jquery2 = _interopRequireDefault(_jquery);

	var _ParserBase2 = _interopRequireDefault(_ParserBase);

	var _canvg2 = _interopRequireDefault(_canvg);

	function _interopRequireDefault(obj) {
		return obj && obj.__esModule ? obj : {
			default: obj
		};
	}

	let original = {
		toString: {
			GSymbol: _ParserBase2.default.GSymbol.prototype.toString,
			Terminal: _ParserBase2.default.Terminal.prototype.toString,
			NonTerminal: _ParserBase2.default.NonTerminal.prototype.toString
		}
	};
	let COMMA_SEPERATOR = '<span class="comma"> , </span>';

	window.onerror = function (message, file, lineNumber) {
		window.alert(`${message}\n\nat ${file}:${lineNumber}`);
		return false;
	};

	(0, _jquery2.default)(document).ready(function () {

		let editMode = true;

		let tmpCanvas = document.getElementById('tmpCanvas');
		initTabs();

		// handle setup of grammar input
		(0, _jquery2.default)('#grammar_form').on('submit', function () {
			if (!editMode) {
				(0, _jquery2.default)('#info').slideUp(function () {
					editMode = true;
					(0, _jquery2.default)('#generate').val('Generate');
					(0, _jquery2.default)('#editor').slideDown();
				});
				return false;
			}

			let rawGrammar = (0, _main_functions.processGrammarInput)((0, _jquery2.default)('#grammar_input').val());

			if (rawGrammar.extraResult.parseExample !== undefined) {
				(0, _jquery2.default)('.source_input').val(rawGrammar.extraResult.parseExample);
			}

			let grammar = _ParserBase2.default.buildGrammar(Array.from(rawGrammar.terminals), Array.from(rawGrammar.nonTerminals), rawGrammar.startSymbol, rawGrammar.productions);
			let vocabularyNameMap = grammar.buildVocabularyNameMap();
			let unreachableSymbols = _ParserBase2.default.computeUnreachableSymbols(grammar);
			let unreducibleSymbols = _ParserBase2.default.computeUnreducibleSymbols(grammar);
			let nullableSymbols = _ParserBase2.default.computeNullableSymbols(grammar);
			let firstSetTable = _ParserBase2.default.buildFirstSetTable(grammar, nullableSymbols);
			let followSetTable = _ParserBase2.default.buildFollowSetTable(grammar, firstSetTable);
			let predictSetTable = _ParserBase2.default.buildPredictSetTable(grammar, firstSetTable, followSetTable);
			let ll1PredictTable = _ParserBase2.default.buildLL1PredictTable(grammar, predictSetTable);
			let lr0FSM = _ParserBase2.default.buildLR0FSM(grammar);
			let lr1FSM = _ParserBase2.default.buildLR1FSM(grammar, firstSetTable);
			// let lr0FSM_Viz = ParserBase.generateDotImageOfCFSM(lr0FSM);
			// let lr1FSM_Viz = ParserBase.generateDotImageOfCFSM(lr1FSM);
			let lr1GotoActionTable = _ParserBase2.default.buildLR1GotoActionTable(grammar, lr1FSM);

			let terminalsList = Array.from(grammar.terminals);
			let nonTerminalsList = Array.from(grammar.nonTerminals);
			let symbolsList = [...terminalsList, ...nonTerminalsList];

			// set display of parser components
			_ParserBase2.default.GSymbol.prototype.toString = function () {
				let classArr = ['gsymbol'];
				if (this === _ParserBase2.default.GSymbol.UNKNOWN) classArr.push('unknown');
				if (this === _ParserBase2.default.GSymbol.LAMBDA) classArr.push('lambda');
				return '<span class="' + classArr.join(' ') + '">' + original.toString.GSymbol.call(this) + '</span>';
			};
			_ParserBase2.default.Terminal.prototype.toString = function () {
				let classArr = ['gsymbol', 'terminal'];
				if (this === _ParserBase2.default.GSymbol.EOI) classArr.push('end-symbol');
				return '<span class="' + classArr.join(' ') + '">' + original.toString.Terminal.call(this) + '</span>';
			};
			_ParserBase2.default.NonTerminal.prototype.toString = function () {
				let classArr = ['gsymbol', 'non-terminal'];
				if (this === _ParserBase2.default.GSymbol.SYSTEM_GOAL) classArr.push('augmenting-symbol');
				if (this === grammar.startSymbol) classArr.push('start-symbol');
				if (nullableSymbols.has(this)) classArr.push('nullable');
				return '<span class="' + classArr.join(' ') + '">' + original.toString.NonTerminal.call(this) + '</span>';
			};

			// display
			(0, _jquery2.default)('#editor').slideUp(function () {
				// Grammar tab
				(0, _jquery2.default)('#grammar').html('<table style="width: 100%;"><tr>' + '<td style="width: 20%; vertical-align: top;">Terminals: <ul>' + Array.from(grammar.terminals).map(e => '<li>' + e + '</li>').join(' ') + '</ul></td>' + '<td style="width: 25%; vertical-align: top;">NonTerminals: <ul>' + Array.from(grammar.nonTerminals).map(e => '<li>' + e + '</li>').join(' ') + '</ul>' + 'Start Symbol: <ul>' + '<li>' + grammar.startSymbol + '</li>' + '</ul>' + 'Unreachable Symbols: <ul>' + (unreachableSymbols.length > 0 ? unreachableSymbols.map(e => '<li>' + e + '</li>').join('') : '<li class="lambda">(none)</li>') + '</ul>' + 'Unreducible Symbols: <ul>' + (unreducibleSymbols.length > 0 ? unreducibleSymbols.map(e => '<li>' + e + '</li>').join('') : '<li class="lambda">(none)</li>') + '</ul></td>' + '<td style="width: 50%; vertical-align: top;">Productions: <ul>' + grammar.productions.map(e => '<li>' + e + '</li>').join(' ') + '</ul></td>' + '</tr></table>');

				// Nullables tab
				(0, _jquery2.default)('#lambda').html('<table class="compact-table hoverable">' + '<tr><th>NonTerminal</th></tr>' + (nullableSymbols.size > 0 ? Array.from(nullableSymbols).map(e => '<tr><td>' + e + '</td></tr>').join('') : '<tr><td class="lambda">(none)</td></tr>') + '</table>');

				// FirstSet(1) tab
				(0, _jquery2.default)('#first').html('<table class="compact-table hoverable">' + '<tr><th>NonTerminal</th><th>FirstSet</th></tr>' + Array.from(firstSetTable.entries()).filter(function ([symbol, firstSet]) {
					return symbol instanceof _ParserBase2.default.NonTerminal;
				}).map(function ([symbol, firstSet]) {
					return {
						symbol: symbol,
						firstSet: Array.from(firstSet)
					};
				}).map(function (e) {
					return '<tr>' + '<td>' + e.symbol + '</td>' + '<td>' + e.firstSet.join(COMMA_SEPERATOR) + '</td>' + '</tr>';
				}).join('') + '</table>');

				// FollowSet(1) tab
				(0, _jquery2.default)('#follow').html('<table class="compact-table hoverable">' + '<tr><th>NonTerminal</th><th>FollowSet</th></tr>' + Array.from(followSetTable.entries()).map(function ([symbol, followSet]) {
					return {
						symbol: symbol,
						followSet: Array.from(followSet)
					};
				}).map(function (e) {
					return '<tr>' + '<td>' + e.symbol + '</td>' + '<td>' + e.followSet.join(COMMA_SEPERATOR) + '</td>' + '</tr>';
				}).join('') + '</table>');

				// PredictSet(1) tab
				(0, _jquery2.default)('#predict').html('<table class="compact-table hoverable">' + '<tr><th colspan="4">Production</th><th>PredictSet</th></tr>' + Array.from(predictSetTable.entries()).map(function ([production, predictSet]) {
					return {
						production: production,
						predictSet: Array.from(predictSet)
					};
				}).map(function (e) {
					return '<tr>' + [e.production.id, e.production.lhs, ' → ', e.production.rhs.length !== 0 ? e.production.rhs.join(' ') : _ParserBase2.default.GSymbol.LAMBDA, e.predictSet.join(COMMA_SEPERATOR)].map(e => '<td>' + e + '</td>').join('') + '</tr>';
				}).join('') + '</table>');

				// LL(1) Table tab
				(0, _jquery2.default)('#ll1table').html('<table class="compact-table hoverable">' + '<th class="diagonalFalling">NonTerminal\\Terminal</th>' + terminalsList.map(t => '<th>' + t + '</th>').join('') + nonTerminalsList.map(function (nt) {
					let ntPredictSet = ll1PredictTable.get(nt);
					return '<tr><td class="b">' + nt + '</td>' + terminalsList.map(function (t) {
						if (ntPredictSet.has(t)) {
							let ntPredictSetAtT = ntPredictSet.get(t);
							return '<td class="' + (ntPredictSetAtT.length > 1 ? 'conflict' : '') + '">' + ntPredictSetAtT.map(p => 'P(' + p.id + ')').join('<br>') + '</td>';
						} else {
							return '<td>' + '</td>';
						}
					}).join('') + '</tr>';
				}).join('') + '</table>');

				// LR(1) Table tab
				(0, _jquery2.default)("#lr1table").html('<table class="compact-table hoverable">' + '<th class="diagonalFalling">State\\Symbol</th>' + symbolsList.map(s => '<th>' + s + '</th>').join('') + Array.from(lr1FSM.states).map(function (st) {
					let stActionSet = lr1GotoActionTable.get(st);
					return '<tr><td class="b">' + st.id + '</td>' + symbolsList.map(function (s) {
						if (stActionSet.has(s)) {
							let stActionSetAtT = stActionSet.get(s);
							return '<td class="' + (stActionSetAtT.length > 1 ? 'conflict' : '') + '">' + stActionSetAtT.map(e => e.toString()).join('<br>') + '</td>';
						} else {
							return '<td>' + '</td>';
						}
					}).join('') + '</tr>';
				}).join('') + '</table>');

				// LR(0) FSM tab
				(0, _jquery2.default)('#lr0fsm').html("Please click on the button above to generate the FSM diagram.");
				(0, _jquery2.default)('#lr0fsm_gen').on('click', function () {
					let lr0FSM_Viz = _ParserBase2.default.generateDotImageOfCFSM(lr0FSM);
					(0, _jquery2.default)('#lr0fsm').html(lr0FSM_Viz);
					(0, _jquery2.default)('#lr0fsm_tab a.downloadLink').show().on('click', function (event) {
						(0, _canvg2.default)(tmpCanvas, lr0FSM_Viz);
						event.target.href = tmpCanvas.toDataURL("image/png");
					});
				});

				// LR(1) FSM tab
				(0, _jquery2.default)('#lr1fsm').html("Please click on the button above to generate the FSM diagram.");
				(0, _jquery2.default)('#lr1fsm_gen').on('click', function () {
					let lr1FSM_Viz = _ParserBase2.default.generateDotImageOfCFSM(lr1FSM);
					(0, _jquery2.default)('#lr1fsm').html(lr1FSM_Viz);
					(0, _jquery2.default)('#lr1fsm_tab a.downloadLink').show().on('click', function (event) {
						(0, _canvg2.default)(tmpCanvas, lr1FSM_Viz);
						event.target.href = tmpCanvas.toDataURL("image/png");
					});
				});

				// LL(1) Parse tab
				(0, _jquery2.default)('#ll1parse .start_parse').off('click');
				(0, _jquery2.default)('#ll1parse .parse_next_btn').off('click');
				(0, _jquery2.default)('#ll1parse .view_parse_tree').off('click');
				(0, _jquery2.default)('#ll1parse .start_parse').on('click', function () {
					let inputTokens = (0, _main_functions.processParseInput)((0, _jquery2.default)('#ll1parse .source_input').val(), vocabularyNameMap);
					let currentParse = _ParserBase2.default.newLL1Parse(grammar, ll1PredictTable, inputTokens);
					let parseStack = currentParse.parseStack;
					let parseTree = currentParse.parseTree;
					let rhsStack = currentParse.rhsStack;

					updateMsg("Parse started");
					updateData();

					let f = function* () {
						while (true) {
							let r = currentParse.step.next();
							if (r.done) {
								if (!(r.value instanceof Error)) return updateMsg("Parse finished");else return updateMsg('Error: ' + r.value.message);
							}
							let stepInfo = r.value;
							if (stepInfo instanceof _ParserBase2.default.LL1Parse.Action.Match) {
								updateMsg("Match " + stepInfo.terminalType);
								(0, _jquery2.default)('#ll1parse .parse_stack td').first().addClass('highlighted');
								(0, _jquery2.default)('#ll1parse .itoken_stream td').first().addClass('highlighted');
								yield;
								updateData();
								yield;
							} else if (stepInfo instanceof _ParserBase2.default.LL1Parse.Action.Predict) {
								updateMsg("Predict " + stepInfo.usingProd);
								(0, _jquery2.default)('#ll1parse .parse_stack td').first().addClass('highlighted');
								yield;
								updateData();
								(0, _jquery2.default)('#ll1parse .parse_stack td').slice(0, stepInfo.usingProd.rhs.length).addClass('highlighted');
								yield;
							} else if (stepInfo instanceof _ParserBase2.default.LL1Parse.Action.Accept) {
								updateMsg("Match " + stepInfo.terminalType + ' & Accept');
								(0, _jquery2.default)('#ll1parse .parse_stack td').first().addClass('highlighted');
								(0, _jquery2.default)('#ll1parse .itoken_stream td').first().addClass('highlighted');
								yield;
								updateData();
								yield;
							}
							clearHighlight();
						}
					}();

					f = f.next.bind(f);
					(0, _jquery2.default)('#ll1parse .parse_next_btn').off('click').on('click', f);
					(0, _jquery2.default)('#ll1parse .skip_all_btn').off('click').on('click', function () {
						while (f && !f().done);
					});
					(0, _jquery2.default)('#ll1parse .view_parse_tree').off('click').on('click', displayParseTree);

					function updateMsg(msg) {
						(0, _jquery2.default)('#ll1parse .parse_step_info').html(msg);
					}
					function clearHighlight() {
						(0, _jquery2.default)('#ll1parse .parse_stack td').removeClass('highlighted');
						(0, _jquery2.default)('#ll1parse .itoken_stream td').removeClass('highlighted');
					}
					function updateData() {
						// update stacks
						(0, _jquery2.default)('#ll1parse .parse_stack').html(TDs(parseStack.slice().reverse()));
						(0, _jquery2.default)('#ll1parse .itoken_stream').html(TDs(inputTokens.map(e => e.terminalType)));
						(0, _jquery2.default)('#ll1parse .semantic_stack').html([...rhsStack, [currentParse.currentRHS, currentParse.currentRHSIndex]].map(([currentRHS, currentRHSIndex]) => '<table><tr>' + currentRHS.map((ee, ii, aa) => {
							if (ii === currentRHSIndex) return '<td class="highlighted">' + ee + '</td>';else return '<td>' + ee + '</td>';
						}).join('') + '</tr></table>').join(''));
						(0, _jquery2.default)('#ll1parse .parse_step_info').html('');
					}
					function displayParseTree() {
						let ll1parsetree_Viz = _ParserBase2.default.generateDotImageOfParseTrees([parseTree]);
						var myWindow = window.open();
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
						myWindow.document.getElementById('downloadLink').onclick = function (event) {
							(0, _canvg2.default)(tmpCanvas, ll1parsetree_Viz);
							event.target.href = tmpCanvas.toDataURL("image/png");
						};
						myWindow.document.close();
					}
				});

				// LR(1) Parse tab
				(0, _jquery2.default)('#lr1parse .start_parse').off('click');
				(0, _jquery2.default)('#lr1parse .parse_next_btn').off('click');
				(0, _jquery2.default)('#lr1parse .view_parse_tree').off('click');
				(0, _jquery2.default)('#lr1parse .start_parse').on('click', function () {
					let inputTokens = (0, _main_functions.processParseInput)((0, _jquery2.default)('#lr1parse .source_input').val(), vocabularyNameMap);
					let currentParse = _ParserBase2.default.newLR1Parse(grammar, lr1FSM, lr1GotoActionTable, inputTokens);
					let parseStack = currentParse.parseStack;
					let parseForest = currentParse.parseForest;
					let stateStack = currentParse.stateStack;

					updateMsg("Parse started");
					updateData();

					let f = function* () {
						while (true) {
							let r = currentParse.step.next();
							if (r.done) {
								if (!(r.value instanceof Error)) return updateMsg("Parse finished");else return updateMsg('Error: ' + r.value.message);
							}
							let stepInfo = r.value;
							if (stepInfo instanceof _ParserBase2.default.LR1Parse.Action.Shift) {
								updateMsg('Shift');
								(0, _jquery2.default)('#lr1parse .itoken_stream td').first().addClass('highlighted');
								yield;
								updateData();
								(0, _jquery2.default)('#lr1parse .parse_stack td').last().addClass('highlighted');
								yield;
							} else if (stepInfo instanceof _ParserBase2.default.LR1Parse.Action.Reduce) {
								updateMsg('Reduce ' + stepInfo.reducingProduction.toStringReversed());
								if (stepInfo.reducingProduction.rhs.length > 0) (0, _jquery2.default)('#lr1parse .parse_stack td').slice(-stepInfo.reducingProduction.rhs.length).addClass('highlighted');
								yield;
								updateData();
								(0, _jquery2.default)('#lr1parse .parse_stack td').last().addClass('highlighted');
								yield;
							} else if (stepInfo instanceof _ParserBase2.default.LR1Parse.Action.Accept) {
								updateMsg('Shift & Reduce ' + stepInfo.reducingProduction.toStringReversed() + ' & Accept');
								(0, _jquery2.default)('#lr1parse .itoken_stream td').first().addClass('highlighted');
								(0, _jquery2.default)('#lr1parse .parse_stack td').addClass('highlighted');
								yield;
								updateData();
								(0, _jquery2.default)('#lr1parse .parse_stack td').last().addClass('highlighted');
								yield;
							}
							clearHighlight();
						}
					}();
					f = f.next.bind(f);

					(0, _jquery2.default)('#lr1parse .parse_next_btn').off('click').on('click', f);
					(0, _jquery2.default)('#lr1parse .skip_all_btn').off('click').on('click', function () {
						while (f && !f().done);
					});
					(0, _jquery2.default)('#lr1parse .view_parse_tree').off('click').on('click', displayParseTree);

					function updateMsg(msg) {
						(0, _jquery2.default)('#lr1parse .parse_step_info').html(msg);
					}
					function clearHighlight() {
						(0, _jquery2.default)('#lr1parse .parse_stack td').removeClass('highlighted');
						(0, _jquery2.default)('#lr1parse .itoken_stream td').removeClass('highlighted');
					}
					function updateData() {
						(0, _jquery2.default)('#lr1parse .parse_stack').html(TDs(parseStack));
						(0, _jquery2.default)('#lr1parse .itoken_stream').html(TDs(inputTokens.map(e => e.terminalType)));
						(0, _jquery2.default)('#lr1parse .state_stack').html(TDs(stateStack.map(e => e.id)));
						(0, _jquery2.default)('#lr1parse .parse_step_info').html('');
					}
					function displayParseTree() {
						let lr1parsetree_Viz = _ParserBase2.default.generateDotImageOfParseTrees(parseForest);
						var myWindow = window.open();
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
						myWindow.document.getElementById('downloadLink').onclick = function (event) {
							(0, _canvg2.default)(tmpCanvas, lr1parsetree_Viz);
							event.target.href = tmpCanvas.toDataURL("image/png");
						};
						myWindow.document.close();
					}
				});

				(0, _jquery2.default)("#generate").val('Edit');
				editMode = false;
				(0, _jquery2.default)("#info").slideDown();
			});

			return false;
		});
	});

	function initTabs() {
		const tablis = {
			grammar_tab: "Grammar",
			lambda_tab: "Nullables",
			first_tab: "First Set (1)",
			follow_tab: "Follow Set (1)",
			predict_tab: "Predict Set (1)",
			ll1table_tab: "LL(1) Table",
			ll1parse_tab: "LL(1) Parse",
			lr0fsm_tab: "LR(0) FSM",
			lr1fsm_tab: "LR(1) FSM",
			lr1table_tab: "LR(1) Table",
			lr1parse_tab: "LR(1) Parse"
		};
		for (let tabname in tablis) {
			(0, _jquery2.default)("#tab_ul").append(`<li><a name="${tabname}" href="javascript:void(0);" class="tablinks" ` + `onclick="openTab('${tabname}');">${tablis[tabname]}</a></li>`);
		}
		document.getElementsByClassName("tablinks")[0].click();
	}

	function TD(e) {
		return '<td>' + e + '</td>';
	}

	function TDs(eArr) {
		return eArr.map(TD).join('');
	}
});