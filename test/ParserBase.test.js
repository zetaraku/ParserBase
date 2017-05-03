'use strict';

var define, describe, it;
define(['node_modules/chai/chai', 'app/ParserBase', 'app/main_functions'], function(chai, module_ParserBase, module_main_functions) {
	let expect = chai.expect;
	let should = chai.should();
	let assert = chai.assert;

	let ParserBase = module_ParserBase.default;
	let result = {};

	describe('module ParserBase', function() {
		it('should exist', function() {
			expect(ParserBase).to.exist;
		});
		describe('grammar check', function() {
			it('should build grammar', function() {
				let $inputGrammarText = (
					"# this is a LL(1) grammar\n" +
					"# you can parse it with LL(1) or LR(1)\n" +
					"#!start-symbol: program\n" +
					"#!parse-example: begin ID := INTLIT ; read ( ID ) ; end\n" +
					"\n" +
					"program -> begin statement_list end\n" +
					"statement_list -> statement statement_tail\n" +
					"statement_tail -> statement statement_tail\n" +
					"statement_tail -> \n" +
					"statement -> ID := expression ;\n" +
					"statement -> read ( id_list ) ;\n" +
					"statement -> write ( expr_list ) ;\n" +
					"id_list -> ID id_tail\n" +
					"id_tail -> , ID id_tail\n" +
					"id_tail -> \n" +
					"expr_list -> expression expr_tail\n" +
					"expr_tail -> , expression expr_tail\n" +
					"expr_tail -> \n" +
					"expression -> primary primary_tail\n" +
					"primary_tail -> add_op primary primary_tail\n" +
					"primary_tail -> \n" +
					"primary -> ( expression )\n" +
					"primary -> ID\n" +
					"primary -> INTLIT\n" +
					"add_op -> +\n" +
					"add_op -> -\n" +
				"");
				let rawGrammar = module_main_functions.processGrammarInput($inputGrammarText);
				expect(
					result.grammar = ParserBase.buildGrammar(
						rawGrammar.terminals.toArray(),
						rawGrammar.nonTerminals.toArray(),
						rawGrammar.startSymbol,
						rawGrammar.productions
					)
				).to.exist;
			});
			it('should build vocabularyNameMap', function() {
				expect(
					result.vocabularyNameMap = new Map([...result.grammar.terminals, ...result.grammar.nonTerminals].map((s) => [s.name, s]))
				).to.exist;
			});
			it('should check unreachableSymbols', function() {
				expect(
					result.unreachableSymbols = ParserBase.computeUnreachableSymbols(result.grammar)
				).to.exist;
			});
			it('should check unreducibleSymbols', function() {
				expect(
					result.unreducibleSymbols = ParserBase.computeUnreducibleSymbols(result.grammar)
				).to.exist;
			});
		});
		describe('functionality', function() {
			it('should compute nullableSymbols', function() {
				expect(
					result.nullableSymbols = ParserBase.computeNullableSymbols(result.grammar)
				).to.exist;
			});
			it('should build firstSetTable', function() {
				expect(
					result.firstSetTable = ParserBase.buildFirstSetTable(result.grammar, result.nullableSymbols)
				).to.exist;
			});
			it('should build followSetTable', function() {
				expect(
					result.followSetTable = ParserBase.buildFollowSetTable(result.grammar, result.firstSetTable)
				).to.exist;
			});
			it('should build predictSetTable', function() {
				expect(
					result.predictSetTable = ParserBase.buildPredictSetTable(result.grammar, result.firstSetTable, result.followSetTable)
				).to.exist;
			});
			it('should build ll1PredictTable', function() {
				expect(
					result.ll1PredictTable = ParserBase.buildLL1PredictTable(result.grammar, result.predictSetTable)
				).to.exist;
			});
			it('should build lr0FSM', function() {
				expect(
					result.lr0FSM = ParserBase.buildLR0FSM(result.grammar)
				).to.exist;
			});
			it('should build lr1FSM', function() {
				expect(
					result.lr1FSM = ParserBase.buildLR1FSM(result.grammar, result.firstSetTable)
				).to.exist;
			});
			it('should build lr1GotoActionTable', function() {
				expect(
					result.lr1GotoActionTable = ParserBase.buildLR1GotoActionTable(result.grammar, result.lr1FSM)
				).to.exist;
			});
		});
		describe('visualization', function() {
			it('should build lr0FSM_Viz', function() {
				this.timeout(0);
				expect(
					result.lr0FSM_Viz = ParserBase.generateDotImageOfCFSM(result.lr0FSM)
				).to.exist;
			});
			it('should build lr1FSM_Viz', function() {
				this.timeout(0);
				expect(
					result.lr1FSM_Viz = ParserBase.generateDotImageOfCFSM(result.lr1FSM)
				).to.exist;
			});
		});
	});
});
