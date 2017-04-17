'use strict';

var define;
define(['node_modules/chai/chai', 'app/ParserBase'], function(chai, module_ParserBase) {
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
				let $startS = `program`;
				let $inputGrammarText =
					`program -> begin statement_list end
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
					add_op -> -`;
				let terminals = new Set();
				let nonTerminals = new Set();
				let startSymbol = $startS;
				let productions = [];
				for(let line of $inputGrammarText.split('\n')) {
					let [lhst, rhst] = line.split(/->|→/);
					if(rhst === undefined) {
						console.warn('invalid line: ' + line);
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
				for(var nt of nonTerminals) {
					terminals.delete(nt);
				}
				expect(
					result.grammar = ParserBase.buildGrammar(Array.from(terminals), Array.from(nonTerminals), startSymbol, productions)
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
					result.lr0FSM = ParserBase.buildLR0FSM(result.grammar, result.firstSetTable)
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
					result.lr0FSM_Viz = ParserBase.generateDotImageOfLR0FSM(result.lr0FSM)
				).to.exist;
			});
			it('should build lr1FSM_Viz', function() {
				this.timeout(0);
				expect(
					result.lr1FSM_Viz = ParserBase.generateDotImageOfLR1FSM(result.lr1FSM)
				).to.exist;
			});
		});
	});
});
