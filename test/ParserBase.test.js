'use strict';
/*jshint -W030 */
var define, describe, it;
define(
	['node_modules/chai/chai', 'app/ParserBase', 'app/main_functions', 'app/_ext'],
	function(chai, module_ParserBase, module_main_functions, module__ext)
{

	let expect = chai.expect;
	// let should = chai.should();
	let assert = chai.assert;

	let ParserBase = module_ParserBase.default;
	let _ext = module__ext.default;
	let result = {};

	describe('module ParserBase', function() {
		it('should exist', function() {
			expect(ParserBase).to.exist;
		});
		describe('grammar check', function() {
			it('should build Grammar', function() {
				let $inputGrammarText = (`
# this is a LL(1) grammar
# you can parse it with LL(1) or LR(1)
#!start-symbol: program
#!parse-example: begin ID := INTLIT ; read ( ID ) ; end

program -> begin statement_list end
statement_list -> statement statement_tail
statement_tail -> statement statement_tail
statement_tail -> 
statement -> ID := expression ;
statement -> read ( id_list ) ;
statement -> write ( expr_list ) ;
id_list -> ID id_tail
id_tail -> , ID id_tail
id_tail -> 
expr_list -> expression expr_tail
expr_tail -> , expression expr_tail
expr_tail -> 
expression -> primary primary_tail
primary_tail -> add_op primary primary_tail
primary_tail -> 
primary -> ( expression )
primary -> ID
primary -> INTLIT
add_op -> +
add_op -> -
				`);
				let rawGrammar = module_main_functions.processGrammarInput($inputGrammarText);
				expect(
					result.grammar = ParserBase.buildGrammar(
						Array.from(rawGrammar.terminals),
						Array.from(rawGrammar.nonTerminals),
						rawGrammar.startSymbol,
						rawGrammar.productions
					)
				).to.exist;
			});
			it('should build NameMap of vocabularies', function() {
				expect(
					result.vocabularyNameMap = result.grammar.buildVocabularyNameMap()
				).to.exist;
			});
			it('should check Unreachable symbols', function() {
				expect(
					result.unreachableSymbols = ParserBase.computeUnreachableSymbols(result.grammar)
				).to.exist;
			});
			it('- correct (verified)', function() {
				assert(_ext.equals(result.unreachableSymbols, []));
			});
			it('should check Unreducible symbols', function() {
				expect(
					result.unreducibleSymbols = ParserBase.computeUnreducibleSymbols(result.grammar)
				).to.exist;
			});
			it('- correct (verified)', function() {
				assert(_ext.equals(result.unreducibleSymbols, []));
			});
		});
		describe('functionality', function() {
			it('should compute Nullable symbols', function() {
				expect(
					result.nullableSymbols = ParserBase.computeNullableSymbols(result.grammar)
				).to.exist;
			});
			it('- correct (verified)', function() {
				let expected = new Set([		// verified
					"statement_tail",
					"id_tail",
					"expr_tail",
					"primary_tail",
				].map(e => result.vocabularyNameMap.get(e)));
				assert(_ext.equals(result.nullableSymbols, expected));
			});
			it('should build FirstSet(1) Table', function() {
				expect(
					result.firstSetTable = ParserBase.buildFirstSetTable(result.grammar, result.nullableSymbols)
				).to.exist;
			});
			it('- correct (verified)', function() {
				let expected = new Map(			// verified
					[
						["program",			["begin"]],
						["statement_list",	["ID", "read", "write"]],
						["statement_tail",	["ID", "read", "write", ParserBase.GSymbol.LAMBDA.name]],
						["statement",		["ID", "read", "write"]],
						["id_list",			["ID"]],
						["id_tail",			[",", ParserBase.GSymbol.LAMBDA.name]],
						["expr_list",		["(", "ID", "INTLIT"]],
						["expr_tail",		[",", ParserBase.GSymbol.LAMBDA.name]],
						["expression",		["(", "ID", "INTLIT"]],
						["primary_tail",	["+", "-", ParserBase.GSymbol.LAMBDA.name]],
						["primary",			["(", "ID", "INTLIT"]],
						["add_op",			["+", "-"]],
						[ParserBase.GSymbol.SYSTEM_GOAL.name,		["begin"]],
					].concat(result.grammar.terminals.map(t => [t.name, [t.name]]))
					.map(([k, v]) => [
						result.vocabularyNameMap.get(k),
						new Set(v.map(e => result.vocabularyNameMap.get(e)))
					])
				);
				assert(_ext.equals(result.firstSetTable, expected));
			});
			it('should build FollowSet(1) Table', function() {
				expect(
					result.followSetTable = ParserBase.buildFollowSetTable(result.grammar, result.firstSetTable)
				).to.exist;
			});
			it('- correct (verified)', function() {
				let expected = new Map(			// verified
					[
						["program",			[ParserBase.GSymbol.EOI.name]],
						["statement_list",	["end"]],
						["statement_tail",	["end"]],
						["statement",		["ID", "read", "write", "end"]],
						["id_list",			[")"]],
						["id_tail",			[")"]],
						["expr_list",		[")"]],
						["expr_tail",		[")"]],
						["expression",		[";", ",", ")"]],
						["primary_tail",	[";", ",", ")"]],
						["primary",			["+", "-", ";", "," , ")"]],
						["add_op",			["(", "ID", "INTLIT"]],
						[ParserBase.GSymbol.SYSTEM_GOAL.name,		[ParserBase.GSymbol.LAMBDA.name]],
					].map(([k, v]) => [
						result.vocabularyNameMap.get(k),
						new Set(v.map(e => result.vocabularyNameMap.get(e)))
					])
				);
				assert(_ext.equals(result.followSetTable, expected));
			});
			it('should build PredictSet(1) Table', function() {
				expect(
					result.predictSetTable = ParserBase.buildPredictSetTable(result.grammar, result.firstSetTable, result.followSetTable)
				).to.exist;
			});
			it('- correct (verified)', function() {
				let expected = new Map(			// verified
					[
						["begin"],
						["begin"],
						["ID", "read", "write"],
						["ID", "read", "write"],
						["end"],
						["ID"],
						["read"],
						["write"],
						["ID"],
						[","],
						[")"],
						["(", "ID", "INTLIT"],
						[","],
						[")"],
						["(", "ID", "INTLIT"],
						["+", "-"],
						[";", ",", ")"],
						["("],
						["ID"],
						["INTLIT"],
						["+"],
						["-"],
					].map((tSetRaw,pNo) => [
						result.grammar.productions[pNo],
						new Set(tSetRaw.map(t => result.vocabularyNameMap.get(t)))
					])
				);
				assert(_ext.equals(result.predictSetTable, expected));
			});
			it('should build LL(1) Predict Table', function() {
				expect(
					result.ll1PredictTable = ParserBase.buildLL1PredictTable(result.grammar, result.predictSetTable)
				).to.exist;
			});
			it('- correct (verified)', function() {
				let expected = new Map(			// verified
					[
						[ParserBase.GSymbol.SYSTEM_GOAL.name, [
							["begin", [0]]
						]],
						["program", [
							["begin", [1]]
						]],
						["statement_list", [
							["ID", [2]],
							["read", [2]],
							["write", [2]]
						]],
						["statement_tail", [
							["ID", [3]],
							["read", [3]],
							["write", [3]],
							["end", [4]]
						]],
						["statement", [
							["ID", [5]],
							["read", [6]],
							["write", [7]]
						]],
						["id_list", [
							["ID", [8]]
						]],
						["id_tail", [
							[",", [9]],
							[")", [10]]
						]],
						["expr_list", [
							["(", [11]],
							["ID", [11]],
							["INTLIT", [11]]
						]],
						["expr_tail", [
							[",", [12]],
							[")", [13]]
						]],
						["expression", [
							["(", [14]],
							["ID", [14]],
							["INTLIT", [14]]
						]],
						["primary_tail", [
							["+", [15]],
							["-", [15]],
							[";", [16]],
							[",", [16]],
							[")", [16]]
						]],
						["primary", [
							["(", [17]],
							["ID", [18]],
							["INTLIT", [19]]
						]],
						["add_op", [
							["+", [20]],
							["-", [21]]
						]]
					].map(([ntName, tMapRaw]) => [
						result.vocabularyNameMap.get(ntName),
						new Map(
							tMapRaw.map(([tName, pSetRaw]) => [
								result.vocabularyNameMap.get(tName),
								pSetRaw.map(pNo => result.grammar.productions[pNo])
							])
						)
					])
				);
				assert(_ext.equals(result.ll1PredictTable, expected));
			});
			it('should build LR(0) FSM', function() {
				expect(
					result.lr0FSM = ParserBase.buildLR0FSM(result.grammar)
				).to.exist;
			});
			it.skip('should build LR(0) GotoAction Table', function() {
			});
			it.skip('- correct', function() {
			});
			it('should build LR(1) FSM', function() {
				expect(
					result.lr1FSM = ParserBase.buildLR1FSM(result.grammar, result.firstSetTable)
				).to.exist;
			});
			it('should build LR(1) GotoAction Table', function() {
				expect(
					result.lr1GotoActionTable = ParserBase.buildLR1GotoActionTable(result.grammar, result.lr1FSM)
				).to.exist;
			});
			it('- correct', function() {
				let sid2state = Array.from(result.lr1FSM.states);
				let expected = new Map(
					[
						[0, [
							["program", ["→1"]],
							["begin", ["S→2"]]
						]],
						[1, [
							[ParserBase.GSymbol.EOI.name, ["A"]]
						]],
						[2, [
							["statement_list", ["→4"]],
							["statement", ["→5"]],
							["ID", ["S→6"]],
							["read", ["S→7"]],
							["write", ["S→8"]]
						]],
						[3, [
						]],
						[4, [
							["end", ["S→9"]]
						]],
						[5, [
							["statement_tail", ["→10"]],
							["statement", ["→11"]],
							["ID", ["S→6"]],
							["read", ["S→7"]],
							["write", ["S→8"]],
							["end", ["R(4)"]]
						]],
						[6, [
							[":=", ["S→12"]]
						]],
						[7, [
							["(", ["S→13"]]
						]],
						[8, [
							["(", ["S→14"]]
						]],
						[9, [
							[ParserBase.GSymbol.EOI.name, ["R(1)"]]
						]],
						[10, [
							["end", ["R(2)"]]
						]],
						[11, [
							["statement_tail", ["→15"]],
							["statement", ["→11"]],
							["ID", ["S→6"]],
							["read", ["S→7"]],
							["write", ["S→8"]],
							["end", ["R(4)"]]
						]],
						[12, [
							["expression", ["→16"]],
							["primary", ["→17"]],
							["(", ["S→18"]],
							["ID", ["S→19"]],
							["INTLIT", ["S→20"]]
						]],
						[13, [
							["id_list", ["→21"]],
							["ID", ["S→22"]]
						]],
						[14, [
							["expr_list", ["→23"]],
							["expression", ["→24"]],
							["primary", ["→25"]],
							["(", ["S→26"]],
							["ID", ["S→27"]],
							["INTLIT", ["S→28"]]
						]],
						[15, [
							["end", ["R(3)"]]
						]],
						[16, [
							[";", ["S→29"]]
						]],
						[17, [
							["primary_tail", ["→30"]],
							["add_op", ["→31"]],
							["+", ["S→32"]],
							["-", ["S→33"]],
							[";", ["R(16)"]]
						]],
						[18, [
							["expression", ["→34"]],
							["primary", ["→35"]],
							["(", ["S→36"]],
							["ID", ["S→37"]],
							["INTLIT", ["S→38"]]
						]],
						[19, [
							["+", ["R(18)"]],
							["-", ["R(18)"]],
							[";", ["R(18)"]]
						]],
						[20, [
							["+", ["R(19)"]],
							["-", ["R(19)"]],
							[";", ["R(19)"]]
						]],
						[21, [
							[")", ["S→39"]]
						]],
						[22, [
							["id_tail", ["→40"]],
							[",", ["S→41"]],
							[")", ["R(10)"]]
						]],
						[23, [
							[")", ["S→42"]]
						]],
						[24, [
							["expr_tail", ["→43"]],
							[",", ["S→44"]],
							[")", ["R(13)"]]
						]],
						[25, [
							["primary_tail", ["→45"]],
							["add_op", ["→46"]],
							["+", ["S→32"]],
							["-", ["S→33"]],
							[",", ["R(16)"]],
							[")", ["R(16)"]]
						]],
						[26, [
							["expression", ["→47"]],
							["primary", ["→35"]],
							["(", ["S→36"]],
							["ID", ["S→37"]],
							["INTLIT", ["S→38"]]
						]],
						[27, [
							["+", ["R(18)"]],
							["-", ["R(18)"]],
							[",", ["R(18)"]],
							[")", ["R(18)"]]
						]],
						[28, [
							["+", ["R(19)"]],
							["-", ["R(19)"]],
							[",", ["R(19)"]],
							[")", ["R(19)"]]
						]],
						[29, [
							["ID", ["R(5)"]],
							["read", ["R(5)"]],
							["write", ["R(5)"]],
							["end", ["R(5)"]]
						]],
						[30, [
							[";", ["R(14)"]]
						]],
						[31, [
							["primary", ["→48"]],
							["(", ["S→18"]],
							["ID", ["S→19"]],
							["INTLIT", ["S→20"]]
						]],
						[32, [
							["(", ["R(20)"]],
							["ID", ["R(20)"]],
							["INTLIT", ["R(20)"]]
						]],
						[33, [
							["(", ["R(21)"]],
							["ID", ["R(21)"]],
							["INTLIT", ["R(21)"]]
						]],
						[34, [
							[")", ["S→49"]]
						]],
						[35, [
							["primary_tail", ["→50"]],
							["add_op", ["→51"]],
							["+", ["S→32"]],
							["-", ["S→33"]],
							[")", ["R(16)"]]
						]],
						[36, [
							["expression", ["→52"]],
							["primary", ["→35"]],
							["(", ["S→36"]],
							["ID", ["S→37"]],
							["INTLIT", ["S→38"]]
						]],
						[37, [
							["+", ["R(18)"]],
							["-", ["R(18)"]],
							[")", ["R(18)"]]
						]],
						[38, [
							["+", ["R(19)"]],
							["-", ["R(19)"]],
							[")", ["R(19)"]]
						]],
						[39, [
							[";", ["S→53"]]
						]],
						[40, [
							[")", ["R(8)"]]
						]],
						[41, [
							["ID", ["S→54"]]
						]],
						[42, [
							[";", ["S→55"]]
						]],
						[43, [
							[")", ["R(11)"]]
						]],
						[44, [
							["expression", ["→56"]],
							["primary", ["→25"]],
							["(", ["S→26"]],
							["ID", ["S→27"]],
							["INTLIT", ["S→28"]]
						]],
						[45, [
							[",", ["R(14)"]],
							[")", ["R(14)"]]
						]],
						[46, [
							["primary", ["→57"]],
							["(", ["S→26"]],
							["ID", ["S→27"]],
							["INTLIT", ["S→28"]]
						]],
						[47, [
							[")", ["S→58"]]
						]],
						[48, [
							["primary_tail", ["→59"]],
							["add_op", ["→31"]],
							["+", ["S→32"]],
							["-", ["S→33"]],
							[";", ["R(16)"]]
						]],
						[49, [
							["+", ["R(17)"]],
							["-", ["R(17)"]],
							[";", ["R(17)"]]
						]],
						[50, [
							[")", ["R(14)"]]
						]],
						[51, [
							["primary", ["→60"]],
							["(", ["S→36"]],
							["ID", ["S→37"]],
							["INTLIT", ["S→38"]]
						]],
						[52, [
							[")", ["S→61"]]
						]],
						[53, [
							["ID", ["R(6)"]],
							["read", ["R(6)"]],
							["write", ["R(6)"]],
							["end", ["R(6)"]]
						]],
						[54, [
							["id_tail", ["→62"]],
							[",", ["S→41"]],
							[")", ["R(10)"]]
						]],
						[55, [
							["ID", ["R(7)"]],
							["read", ["R(7)"]],
							["write", ["R(7)"]],
							["end", ["R(7)"]]
						]],
						[56, [
							["expr_tail", ["→63"]],
							[",", ["S→44"]],
							[")", ["R(13)"]]
						]],
						[57, [
							["primary_tail", ["→64"]],
							["add_op", ["→46"]],
							["+", ["S→32"]],
							["-", ["S→33"]],
							[",", ["R(16)"]],
							[")", ["R(16)"]]
						]],
						[58, [
							["+", ["R(17)"]],
							["-", ["R(17)"]],
							[",", ["R(17)"]],
							[")", ["R(17)"]]
						]],
						[59, [
							[";", ["R(15)"]]
						]],
						[60, [
							["primary_tail", ["→65"]],
							["add_op", ["→51"]],
							["+", ["S→32"]],
							["-", ["S→33"]],
							[")", ["R(16)"]]
						]],
						[61, [
							["+", ["R(17)"]],
							["-", ["R(17)"]],
							[")", ["R(17)"]]
						]],
						[62, [
							[")", ["R(9)"]]
						]],
						[63, [
							[")", ["R(12)"]]
						]],
						[64, [
							[",", ["R(15)"]],
							[")", ["R(15)"]]
						]],
						[65, [
							[")", ["R(15)"]]
						]]
					].map(([sId, gMapRaw]) => [
						sid2state[sId],
						new Map(gMapRaw.map(([gsymbol, actionsRaw]) => [
							result.vocabularyNameMap.get(gsymbol),
							actionsRaw.map(makeLR1GotoAction)
						]))
					])
				);
				assert(_ext.equals(result.lr1GotoActionTable, expected));

				function makeLR1GotoAction(actionRaw) {
					let group;
					if((group = actionRaw.match(/^S→(\d+)$/)) !== null) {
						return new ParserBase.LR1Parse.Action.Shift(sid2state[parseInt(group[1])]);
					} else if((group = actionRaw.match(/^→(\d+)$/)) !== null) {
						return new ParserBase.LR1Parse.Action.PseudoShift(sid2state[parseInt(group[1])]);
					} else if((group = actionRaw.match(/^R\((\d+)\)$/)) !== null) {
						return new ParserBase.LR1Parse.Action.Reduce(result.grammar.productions[group[1]]);
					} else if(actionRaw === 'A') {
						return new ParserBase.LR1Parse.Action.Accept(result.grammar.augmentingProduction);
					} else {
						throw new Error('Invalid state literal.');
					}
				}
			});
		});
		describe('parsing', function() {
			let $inputTokensText = `begin ID := INTLIT ; read ( ID ) ; end`;
			it('should finish LL(1) Parse without error', function() {
				let inputTokens = module_main_functions.processParseInput($inputTokensText, result.vocabularyNameMap);
				let currentParse = ParserBase.newLL1Parse(result.grammar, result.ll1PredictTable, inputTokens);
				let r;
				do {
					r = currentParse.step.next();
				} while(!r.done);
				expect(r.value).to.not.be.an.instanceof(Error);
			});
			it('should finish LR(1) Parse without error', function() {
				let inputTokens = module_main_functions.processParseInput($inputTokensText, result.vocabularyNameMap);
				let currentParse = ParserBase.newLR1Parse(result.grammar, result.lr1FSM, result.lr1GotoActionTable, inputTokens);
				let r;
				do {
					r = currentParse.step.next();
				} while(!r.done);
				expect(r.value).to.not.be.an.instanceof(Error);
			});
		});
		describe('visualization', function() {
			it('should visualize LR(0) FSM', function() {
				this.timeout(0);
				expect(
					result.lr0FSM_Viz = ParserBase.generateDotImageOfCFSM(result.lr0FSM)
				).to.exist;
			});
			it('should visualize LR(1) FSM', function() {
				this.timeout(0);
				expect(
					result.lr1FSM_Viz = ParserBase.generateDotImageOfCFSM(result.lr1FSM)
				).to.exist;
			});
		});
	});
});
