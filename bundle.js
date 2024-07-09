/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/index.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./node_modules/canvg-browser/index.js":
/*!*********************************************!*\
  !*** ./node_modules/canvg-browser/index.js ***!
  \*********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


 var RGBColor = __webpack_require__(/*! rgbcolor */ "./node_modules/rgbcolor/index.js");
 var stackblur = __webpack_require__(/*! stackblur */ "./node_modules/stackblur/index.js");
 var xmldom = __webpack_require__(/*! xmldom */ "./node_modules/xmldom/dom-parser.js");

/*
 * canvg.js - Javascript SVG parser and renderer on Canvas
 * MIT Licensed
 * Gabe Lerner (gabelerner@gmail.com)
 * http://code.google.com/p/canvg/
 *
 * Requires: rgbcolor.js - http://www.phpied.com/rgb-color-parser-in-javascript/
 */

/*
canvg(target, s)
  empty parameters: replace all 'svg' elements on page with 'canvas' elements
  target: canvas element or the id of a canvas element
  s: svg string, url to svg file, or xml document
  opts: optional hash of options
    ignoreMouse: true => ignore mouse events
    ignoreAnimation: true => ignore animations
    ignoreDimensions: true => does not try to resize canvas
    ignoreClear: true => does not clear canvas
    offsetX: int => draws at a x offset
    offsetY: int => draws at a y offset
    scaleWidth: int => scales horizontally to width
    scaleHeight: int => scales vertically to height
    renderCallback: function => will call the function after the first render is completed
    forceRedraw: function => will call the function on every frame, if it returns true, will redraw
*/
function canvg(target, s, opts) {

	// no parameters
	if (target == null && s == null && opts == null) {
		var svgTags = document.querySelectorAll('svg');
		for (var i=0; i<svgTags.length; i++) {
			var svgTag = svgTags[i];
			var c = document.createElement('canvas');
			c.width = svgTag.clientWidth;
			c.height = svgTag.clientHeight;
			svgTag.parentNode.insertBefore(c, svgTag);
			svgTag.parentNode.removeChild(svgTag);
			var div = document.createElement('div');
			div.appendChild(svgTag);
			canvg(c, div.innerHTML);
		}
		return;
	}

	if (typeof target == 'string') {
		target = document.getElementById(target);
	}

	// store class on canvas
	if (target.svg != null) target.svg.stop();
	var svg = build(opts || {});
	// on i.e. 8 for flash canvas, we can't assign the property so check for it
	if (!(target.childNodes.length == 1 && target.childNodes[0].nodeName == 'OBJECT')) target.svg = svg;

	var ctx = target.getContext('2d');
	if (typeof s.documentElement != 'undefined') {
		// load from xml doc
		svg.loadXmlDoc(ctx, s);
	}
	else if (s.substr(0,1) == '<') {
		// load from xml string
		svg.loadXml(ctx, s);
	}
	else {
		// load from url
		svg.load(ctx, s);
	}
}

function getMatchesSelector() {
  // see https://developer.mozilla.org/en-US/docs/Web/API/Element.matches
  var matchesSelector;
  if (typeof Element.prototype.matches != 'undefined') {
  	matchesSelector = function(node, selector) {
  		return node.matches(selector);
  	};
  } else if (typeof Element.prototype.webkitMatchesSelector != 'undefined') {
  	matchesSelector = function(node, selector) {
  		return node.webkitMatchesSelector(selector);
  	};
  } else if (typeof Element.prototype.mozMatchesSelector != 'undefined') {
  	matchesSelector = function(node, selector) {
  		return node.mozMatchesSelector(selector);
  	};
  } else if (typeof Element.prototype.msMatchesSelector != 'undefined') {
  	matchesSelector = function(node, selector) {
  		return node.msMatchesSelector(selector);
  	};
  } else if (typeof Element.prototype.oMatchesSelector != 'undefined') {
  	matchesSelector = function(node, selector) {
  		return node.oMatchesSelector(selector);
  	};
  } else {
  	// requires Sizzle: https://github.com/jquery/sizzle/wiki/Sizzle-Documentation
  	// or jQuery: http://jquery.com/download/
  	// or Zepto: http://zeptojs.com/#
  	// without it, this is a ReferenceError

  	if (typeof jQuery == 'function' || typeof Zepto == 'function') {
  		matchesSelector = function (node, selector) {
  			return $(node).is(selector);
  		};
  	}

  	if (typeof matchesSelector == 'undefined') {
  		matchesSelector = Sizzle.matchesSelector;
  	}
  }

  return matchesSelector;
}

function getSelectorSpecificity(selector) {
	var typeCount = [0, 0, 0];

  // slightly modified version of https://github.com/keeganstreet/specificity/blob/master/specificity.js
  var attributeRegex = /(\[[^\]]+\])/g;
  var idRegex = /(#[^\s\+>~\.\[:]+)/g;
  var classRegex = /(\.[^\s\+>~\.\[:]+)/g;
  var pseudoElementRegex = /(::[^\s\+>~\.\[:]+|:first-line|:first-letter|:before|:after)/gi;
  var pseudoClassWithBracketsRegex = /(:[\w-]+\([^\)]*\))/gi;
  var pseudoClassRegex = /(:[^\s\+>~\.\[:]+)/g;
  var elementRegex = /([^\s\+>~\.\[:]+)/g;

	var findMatch = function(regex, type) {
		var matches = selector.match(regex);
		if (matches == null) {
			return;
		}
		typeCount[type] += matches.length;
		selector = selector.replace(regex, ' ');
	};

	selector = selector.replace(/:not\(([^\)]*)\)/g, '     $1 ');
	selector = selector.replace(/{[^]*/gm, ' ');
	findMatch(attributeRegex, 1);
	findMatch(idRegex, 0);
	findMatch(classRegex, 1);
	findMatch(pseudoElementRegex, 2);
	findMatch(pseudoClassWithBracketsRegex, 1);
	findMatch(pseudoClassRegex, 1);
	selector = selector.replace(/[\*\s\+>~]/g, ' ');
	selector = selector.replace(/[#\.]/g, ' ');
	findMatch(elementRegex, 2);
	return typeCount.join('');
}

function build(opts) {
	var svg = { opts: opts };

  var matchesSelector = getMatchesSelector();

  if (typeof CanvasRenderingContext2D  != 'undefined') {
    CanvasRenderingContext2D.prototype.drawSvg = function(s, dx, dy, dw, dh, opts) {
      var cOpts = {
        ignoreMouse: true,
        ignoreAnimation: true,
        ignoreDimensions: true,
        ignoreClear: true,
        offsetX: dx,
        offsetY: dy,
        scaleWidth: dw,
        scaleHeight: dh
      };

      for(var prop in opts) {
        if(opts.hasOwnProperty(prop)){
          cOpts[prop] = opts[prop];
        }
      }
      canvg(this.canvas, s, cOpts);
    };
  }

	svg.FRAMERATE = 30;
	svg.MAX_VIRTUAL_PIXELS = 30000;

	svg.log = function(msg) {};
	if (svg.opts.log == true && typeof console != 'undefined') {
		svg.log = function(msg) { console.log(msg); };
	}

	// globals
	svg.init = function(ctx) {
		var uniqueId = 0;
		svg.UniqueId = function () { uniqueId++; return 'canvg' + uniqueId;	};
		svg.Definitions = {};
		svg.Styles = {};
		svg.StylesSpecificity = {};
		svg.Animations = [];
		svg.Images = [];
		svg.ctx = ctx;
		svg.ViewPort = new (function () {
			this.viewPorts = [];
			this.Clear = function() { this.viewPorts = []; };
			this.SetCurrent = function(width, height) { this.viewPorts.push({ width: width, height: height }); };
			this.RemoveCurrent = function() { this.viewPorts.pop(); };
			this.Current = function() { return this.viewPorts[this.viewPorts.length - 1]; };
			this.width = function() { return this.Current().width; };
			this.height = function() { return this.Current().height; };
			this.ComputeSize = function(d) {
				if (d != null && typeof d == 'number') return d;
				if (d == 'x') return this.width();
				if (d == 'y') return this.height();
				return Math.sqrt(Math.pow(this.width(), 2) + Math.pow(this.height(), 2)) / Math.sqrt(2);
			};
		});
	}
	svg.init();

	// images loaded
	svg.ImagesLoaded = function() {
		for (var i=0; i<svg.Images.length; i++) {
			if (!svg.Images[i].loaded) return false;
		}
		return true;
	}

	// trim
	svg.trim = function(s) { return s.replace(/^\s+|\s+$/g, ''); }

	// compress spaces
	svg.compressSpaces = function(s) { return s.replace(/[\s\r\t\n]+/gm,' '); }

	// ajax
	svg.ajax = function(url) {
		var AJAX;
		if(window.XMLHttpRequest){AJAX=new XMLHttpRequest();}
		else{AJAX=new ActiveXObject('Microsoft.XMLHTTP');}
		if(AJAX){
		   AJAX.open('GET',url,false);
		   AJAX.send(null);
		   return AJAX.responseText;
		}
		return null;
	}

	// parse xml
	svg.parseXml = function(xml) {
		if (typeof Windows != 'undefined' && typeof Windows.Data != 'undefined' && typeof Windows.Data.Xml != 'undefined') {
			var xmlDoc = new Windows.Data.Xml.Dom.XmlDocument();
			var settings = new Windows.Data.Xml.Dom.XmlLoadSettings();
			settings.prohibitDtd = false;
			xmlDoc.loadXml(xml, settings);
			return xmlDoc;
		}
		else if (window.DOMParser)
		{
			var parser = new DOMParser();
			return parser.parseFromString(xml, 'text/xml');
		}
		else
		{
			xml = xml.replace(/<!DOCTYPE svg[^>]*>/, '');
			var xmlDoc = new ActiveXObject('Microsoft.XMLDOM');
			xmlDoc.async = 'false';
			xmlDoc.loadXML(xml);
			return xmlDoc;
		}
	}

	svg.Property = function(name, value) {
		this.name = name;
		this.value = value;
	}
		svg.Property.prototype.getValue = function() {
			return this.value;
		}

		svg.Property.prototype.hasValue = function() {
			return (this.value != null && this.value != '');
		}

		// return the numerical value of the property
		svg.Property.prototype.numValue = function() {
			if (!this.hasValue()) return 0;

			var n = parseFloat(this.value);
			if ((this.value + '').match(/%$/)) {
				n = n / 100.0;
			}
			return n;
		}

		svg.Property.prototype.valueOrDefault = function(def) {
			if (this.hasValue()) return this.value;
			return def;
		}

		svg.Property.prototype.numValueOrDefault = function(def) {
			if (this.hasValue()) return this.numValue();
			return def;
		}

		// color extensions
			// augment the current color value with the opacity
			svg.Property.prototype.addOpacity = function(opacityProp) {
				var newValue = this.value;
				if (opacityProp.value != null && opacityProp.value != '' && typeof this.value == 'string') { // can only add opacity to colors, not patterns
					var color = new RGBColor(this.value);
					if (color.ok) {
						newValue = 'rgba(' + color.r + ', ' + color.g + ', ' + color.b + ', ' + opacityProp.numValue() + ')';
					}
				}
				return new svg.Property(this.name, newValue);
			}

		// definition extensions
			// get the definition from the definitions table
			svg.Property.prototype.getDefinition = function() {
				var name = this.value.match(/#([^\)'"]+)/);
				if (name) { name = name[1]; }
				if (!name) { name = this.value; }
				return svg.Definitions[name];
			}

			svg.Property.prototype.isUrlDefinition = function() {
				return this.value.indexOf('url(') == 0
			}

			svg.Property.prototype.getFillStyleDefinition = function(e, opacityProp) {
				var def = this.getDefinition();

				// gradient
				if (def != null && def.createGradient) {
					return def.createGradient(svg.ctx, e, opacityProp);
				}

				// pattern
				if (def != null && def.createPattern) {
					if (def.getHrefAttribute().hasValue()) {
						var pt = def.attribute('patternTransform');
						def = def.getHrefAttribute().getDefinition();
						if (pt.hasValue()) { def.attribute('patternTransform', true).value = pt.value; }
					}
					return def.createPattern(svg.ctx, e);
				}

				return null;
			}

		// length extensions
			svg.Property.prototype.getDPI = function(viewPort) {
				return 96.0; // TODO: compute?
			}

			svg.Property.prototype.getEM = function(viewPort) {
				var em = 12;

				var fontSize = new svg.Property('fontSize', svg.Font.Parse(svg.ctx.font).fontSize);
				if (fontSize.hasValue()) em = fontSize.toPixels(viewPort);

				return em;
			}

			svg.Property.prototype.getUnits = function() {
				var s = this.value+'';
				return s.replace(/[0-9\.\-]/g,'');
			}

			// get the length as pixels
			svg.Property.prototype.toPixels = function(viewPort, processPercent) {
				if (!this.hasValue()) return 0;
				var s = this.value+'';
				if (s.match(/em$/)) return this.numValue() * this.getEM(viewPort);
				if (s.match(/ex$/)) return this.numValue() * this.getEM(viewPort) / 2.0;
				if (s.match(/px$/)) return this.numValue();
				if (s.match(/pt$/)) return this.numValue() * this.getDPI(viewPort) * (1.0 / 72.0);
				if (s.match(/pc$/)) return this.numValue() * 15;
				if (s.match(/cm$/)) return this.numValue() * this.getDPI(viewPort) / 2.54;
				if (s.match(/mm$/)) return this.numValue() * this.getDPI(viewPort) / 25.4;
				if (s.match(/in$/)) return this.numValue() * this.getDPI(viewPort);
				if (s.match(/%$/)) return this.numValue() * svg.ViewPort.ComputeSize(viewPort);
				var n = this.numValue();
				if (processPercent && n < 1.0) return n * svg.ViewPort.ComputeSize(viewPort);
				return n;
			}

		// time extensions
			// get the time as milliseconds
			svg.Property.prototype.toMilliseconds = function() {
				if (!this.hasValue()) return 0;
				var s = this.value+'';
				if (s.match(/s$/)) return this.numValue() * 1000;
				if (s.match(/ms$/)) return this.numValue();
				return this.numValue();
			}

		// angle extensions
			// get the angle as radians
			svg.Property.prototype.toRadians = function() {
				if (!this.hasValue()) return 0;
				var s = this.value+'';
				if (s.match(/deg$/)) return this.numValue() * (Math.PI / 180.0);
				if (s.match(/grad$/)) return this.numValue() * (Math.PI / 200.0);
				if (s.match(/rad$/)) return this.numValue();
				return this.numValue() * (Math.PI / 180.0);
			}

		// text extensions
			// get the text baseline
			var textBaselineMapping = {
				'baseline': 'alphabetic',
				'before-edge': 'top',
				'text-before-edge': 'top',
				'middle': 'middle',
				'central': 'middle',
				'after-edge': 'bottom',
				'text-after-edge': 'bottom',
				'ideographic': 'ideographic',
				'alphabetic': 'alphabetic',
				'hanging': 'hanging',
				'mathematical': 'alphabetic'
			};
			svg.Property.prototype.toTextBaseline = function () {
				if (!this.hasValue()) return null;
				return textBaselineMapping[this.value];
			}

	// fonts
	svg.Font = new (function() {
		this.Styles = 'normal|italic|oblique|inherit';
		this.Variants = 'normal|small-caps|inherit';
		this.Weights = 'normal|bold|bolder|lighter|100|200|300|400|500|600|700|800|900|inherit';

		this.CreateFont = function(fontStyle, fontVariant, fontWeight, fontSize, fontFamily, inherit) {
			var f = inherit != null ? this.Parse(inherit) : this.CreateFont('', '', '', '', '', svg.ctx.font);
			return {
				fontFamily: fontFamily || f.fontFamily,
				fontSize: fontSize || f.fontSize,
				fontStyle: fontStyle || f.fontStyle,
				fontWeight: fontWeight || f.fontWeight,
				fontVariant: fontVariant || f.fontVariant,
				toString: function () { return [this.fontStyle, this.fontVariant, this.fontWeight, this.fontSize, this.fontFamily].join(' ') }
			}
		}

		var that = this;
		this.Parse = function(s) {
			var f = {};
			var d = svg.trim(svg.compressSpaces(s || '')).split(' ');
			var set = { fontSize: false, fontStyle: false, fontWeight: false, fontVariant: false }
			var ff = '';
			for (var i=0; i<d.length; i++) {
				if (!set.fontStyle && that.Styles.indexOf(d[i]) != -1) { if (d[i] != 'inherit') f.fontStyle = d[i]; set.fontStyle = true; }
				else if (!set.fontVariant && that.Variants.indexOf(d[i]) != -1) { if (d[i] != 'inherit') f.fontVariant = d[i]; set.fontStyle = set.fontVariant = true;	}
				else if (!set.fontWeight && that.Weights.indexOf(d[i]) != -1) {	if (d[i] != 'inherit') f.fontWeight = d[i]; set.fontStyle = set.fontVariant = set.fontWeight = true; }
				else if (!set.fontSize) { if (d[i] != 'inherit') f.fontSize = d[i].split('/')[0]; set.fontStyle = set.fontVariant = set.fontWeight = set.fontSize = true; }
				else { if (d[i] != 'inherit') ff += d[i]; }
			} if (ff != '') f.fontFamily = ff;
			return f;
		}
	});

	// points and paths
	svg.ToNumberArray = function(s) {
		var a = svg.trim(svg.compressSpaces((s || '').replace(/,/g, ' '))).split(' ');
		for (var i=0; i<a.length; i++) {
			a[i] = parseFloat(a[i]);
		}
		return a;
	}
	svg.Point = function(x, y) {
		this.x = x;
		this.y = y;
	}
		svg.Point.prototype.angleTo = function(p) {
			return Math.atan2(p.y - this.y, p.x - this.x);
		}

		svg.Point.prototype.applyTransform = function(v) {
			var xp = this.x * v[0] + this.y * v[2] + v[4];
			var yp = this.x * v[1] + this.y * v[3] + v[5];
			this.x = xp;
			this.y = yp;
		}

	svg.CreatePoint = function(s) {
		var a = svg.ToNumberArray(s);
		return new svg.Point(a[0], a[1]);
	}
	svg.CreatePath = function(s) {
		var a = svg.ToNumberArray(s);
		var path = [];
		for (var i=0; i<a.length; i+=2) {
			path.push(new svg.Point(a[i], a[i+1]));
		}
		return path;
	}

	// bounding box
	svg.BoundingBox = function(x1, y1, x2, y2) { // pass in initial points if you want
		this.x1 = Number.NaN;
		this.y1 = Number.NaN;
		this.x2 = Number.NaN;
		this.y2 = Number.NaN;

		this.x = function() { return this.x1; }
		this.y = function() { return this.y1; }
		this.width = function() { return this.x2 - this.x1; }
		this.height = function() { return this.y2 - this.y1; }

		this.addPoint = function(x, y) {
			if (x != null) {
				if (isNaN(this.x1) || isNaN(this.x2)) {
					this.x1 = x;
					this.x2 = x;
				}
				if (x < this.x1) this.x1 = x;
				if (x > this.x2) this.x2 = x;
			}

			if (y != null) {
				if (isNaN(this.y1) || isNaN(this.y2)) {
					this.y1 = y;
					this.y2 = y;
				}
				if (y < this.y1) this.y1 = y;
				if (y > this.y2) this.y2 = y;
			}
		}
		this.addX = function(x) { this.addPoint(x, null); }
		this.addY = function(y) { this.addPoint(null, y); }

		this.addBoundingBox = function(bb) {
			this.addPoint(bb.x1, bb.y1);
			this.addPoint(bb.x2, bb.y2);
		}

		this.addQuadraticCurve = function(p0x, p0y, p1x, p1y, p2x, p2y) {
			var cp1x = p0x + 2/3 * (p1x - p0x); // CP1 = QP0 + 2/3 *(QP1-QP0)
			var cp1y = p0y + 2/3 * (p1y - p0y); // CP1 = QP0 + 2/3 *(QP1-QP0)
			var cp2x = cp1x + 1/3 * (p2x - p0x); // CP2 = CP1 + 1/3 *(QP2-QP0)
			var cp2y = cp1y + 1/3 * (p2y - p0y); // CP2 = CP1 + 1/3 *(QP2-QP0)
			this.addBezierCurve(p0x, p0y, cp1x, cp2x, cp1y,	cp2y, p2x, p2y);
		}

		this.addBezierCurve = function(p0x, p0y, p1x, p1y, p2x, p2y, p3x, p3y) {
			// from http://blog.hackers-cafe.net/2009/06/how-to-calculate-bezier-curves-bounding.html
			var p0 = [p0x, p0y], p1 = [p1x, p1y], p2 = [p2x, p2y], p3 = [p3x, p3y];
			this.addPoint(p0[0], p0[1]);
			this.addPoint(p3[0], p3[1]);

			for (var i=0; i<=1; i++) {
				var f = function(t) {
					return Math.pow(1-t, 3) * p0[i]
					+ 3 * Math.pow(1-t, 2) * t * p1[i]
					+ 3 * (1-t) * Math.pow(t, 2) * p2[i]
					+ Math.pow(t, 3) * p3[i];
				}

				var b = 6 * p0[i] - 12 * p1[i] + 6 * p2[i];
				var a = -3 * p0[i] + 9 * p1[i] - 9 * p2[i] + 3 * p3[i];
				var c = 3 * p1[i] - 3 * p0[i];

				if (a == 0) {
					if (b == 0) continue;
					var t = -c / b;
					if (0 < t && t < 1) {
						if (i == 0) this.addX(f(t));
						if (i == 1) this.addY(f(t));
					}
					continue;
				}

				var b2ac = Math.pow(b, 2) - 4 * c * a;
				if (b2ac < 0) continue;
				var t1 = (-b + Math.sqrt(b2ac)) / (2 * a);
				if (0 < t1 && t1 < 1) {
					if (i == 0) this.addX(f(t1));
					if (i == 1) this.addY(f(t1));
				}
				var t2 = (-b - Math.sqrt(b2ac)) / (2 * a);
				if (0 < t2 && t2 < 1) {
					if (i == 0) this.addX(f(t2));
					if (i == 1) this.addY(f(t2));
				}
			}
		}

		this.isPointInBox = function(x, y) {
			return (this.x1 <= x && x <= this.x2 && this.y1 <= y && y <= this.y2);
		}

		this.addPoint(x1, y1);
		this.addPoint(x2, y2);
	}

	// transforms
	svg.Transform = function(v) {
		var that = this;
		this.Type = {}

		// translate
		this.Type.translate = function(s) {
			this.p = svg.CreatePoint(s);
			this.apply = function(ctx) {
				ctx.translate(this.p.x || 0.0, this.p.y || 0.0);
			}
			this.unapply = function(ctx) {
				ctx.translate(-1.0 * this.p.x || 0.0, -1.0 * this.p.y || 0.0);
			}
			this.applyToPoint = function(p) {
				p.applyTransform([1, 0, 0, 1, this.p.x || 0.0, this.p.y || 0.0]);
			}
		}

		// rotate
		this.Type.rotate = function(s) {
			var a = svg.ToNumberArray(s);
			this.angle = new svg.Property('angle', a[0]);
			this.cx = a[1] || 0;
			this.cy = a[2] || 0;
			this.apply = function(ctx) {
				ctx.translate(this.cx, this.cy);
				ctx.rotate(this.angle.toRadians());
				ctx.translate(-this.cx, -this.cy);
			}
			this.unapply = function(ctx) {
				ctx.translate(this.cx, this.cy);
				ctx.rotate(-1.0 * this.angle.toRadians());
				ctx.translate(-this.cx, -this.cy);
			}
			this.applyToPoint = function(p) {
				var a = this.angle.toRadians();
				p.applyTransform([1, 0, 0, 1, this.p.x || 0.0, this.p.y || 0.0]);
				p.applyTransform([Math.cos(a), Math.sin(a), -Math.sin(a), Math.cos(a), 0, 0]);
				p.applyTransform([1, 0, 0, 1, -this.p.x || 0.0, -this.p.y || 0.0]);
			}
		}

		this.Type.scale = function(s) {
			this.p = svg.CreatePoint(s);
			this.apply = function(ctx) {
				ctx.scale(this.p.x || 1.0, this.p.y || this.p.x || 1.0);
			}
			this.unapply = function(ctx) {
				ctx.scale(1.0 / this.p.x || 1.0, 1.0 / this.p.y || this.p.x || 1.0);
			}
			this.applyToPoint = function(p) {
				p.applyTransform([this.p.x || 0.0, 0, 0, this.p.y || 0.0, 0, 0]);
			}
		}

		this.Type.matrix = function(s) {
			this.m = svg.ToNumberArray(s);
			this.apply = function(ctx) {
				ctx.transform(this.m[0], this.m[1], this.m[2], this.m[3], this.m[4], this.m[5]);
			}
			this.unapply = function(ctx) {
				var a = this.m[0];
				var b = this.m[2];
				var c = this.m[4];
				var d = this.m[1];
				var e = this.m[3];
				var f = this.m[5];
				var g = 0.0;
				var h = 0.0;
				var i = 1.0;
				var det = 1 / (a*(e*i-f*h)-b*(d*i-f*g)+c*(d*h-e*g));
				ctx.transform(
					det*(e*i-f*h),
					det*(f*g-d*i),
					det*(c*h-b*i),
					det*(a*i-c*g),
					det*(b*f-c*e),
					det*(c*d-a*f)
				);
			}
			this.applyToPoint = function(p) {
				p.applyTransform(this.m);
			}
		}

		this.Type.SkewBase = function(s) {
			this.base = that.Type.matrix;
			this.base(s);
			this.angle = new svg.Property('angle', s);
		}
		this.Type.SkewBase.prototype = new this.Type.matrix;

		this.Type.skewX = function(s) {
			this.base = that.Type.SkewBase;
			this.base(s);
			this.m = [1, 0, Math.tan(this.angle.toRadians()), 1, 0, 0];
		}
		this.Type.skewX.prototype = new this.Type.SkewBase;

		this.Type.skewY = function(s) {
			this.base = that.Type.SkewBase;
			this.base(s);
			this.m = [1, Math.tan(this.angle.toRadians()), 0, 1, 0, 0];
		}
		this.Type.skewY.prototype = new this.Type.SkewBase;

		this.transforms = [];

		this.apply = function(ctx) {
			for (var i=0; i<this.transforms.length; i++) {
				this.transforms[i].apply(ctx);
			}
		}

		this.unapply = function(ctx) {
			for (var i=this.transforms.length-1; i>=0; i--) {
				this.transforms[i].unapply(ctx);
			}
		}

		this.applyToPoint = function(p) {
			for (var i=0; i<this.transforms.length; i++) {
				this.transforms[i].applyToPoint(p);
			}
		}

		var data = svg.trim(svg.compressSpaces(v)).replace(/\)([a-zA-Z])/g, ') $1').replace(/\)(\s?,\s?)/g,') ').split(/\s(?=[a-z])/);
		for (var i=0; i<data.length; i++) {
			var type = svg.trim(data[i].split('(')[0]);
			var s = data[i].split('(')[1].replace(')','');
			var transformType = this.Type[type];
			if (typeof transformType != 'undefined') {
				var transform = new transformType(s);
				transform.type = type;
				this.transforms.push(transform);
			}
		}
	}

	// aspect ratio
	svg.AspectRatio = function(ctx, aspectRatio, width, desiredWidth, height, desiredHeight, minX, minY, refX, refY) {
		// aspect ratio - http://www.w3.org/TR/SVG/coords.html#PreserveAspectRatioAttribute
		aspectRatio = svg.compressSpaces(aspectRatio);
		aspectRatio = aspectRatio.replace(/^defer\s/,''); // ignore defer
		var align = aspectRatio.split(' ')[0] || 'xMidYMid';
		var meetOrSlice = aspectRatio.split(' ')[1] || 'meet';

		// calculate scale
		var scaleX = width / desiredWidth;
		var scaleY = height / desiredHeight;
		var scaleMin = Math.min(scaleX, scaleY);
		var scaleMax = Math.max(scaleX, scaleY);
		if (meetOrSlice == 'meet') { desiredWidth *= scaleMin; desiredHeight *= scaleMin; }
		if (meetOrSlice == 'slice') { desiredWidth *= scaleMax; desiredHeight *= scaleMax; }

		refX = new svg.Property('refX', refX);
		refY = new svg.Property('refY', refY);
		if (refX.hasValue() && refY.hasValue()) {
			ctx.translate(-scaleMin * refX.toPixels('x'), -scaleMin * refY.toPixels('y'));
		}
		else {
			// align
			if (align.match(/^xMid/) && ((meetOrSlice == 'meet' && scaleMin == scaleY) || (meetOrSlice == 'slice' && scaleMax == scaleY))) ctx.translate(width / 2.0 - desiredWidth / 2.0, 0);
			if (align.match(/YMid$/) && ((meetOrSlice == 'meet' && scaleMin == scaleX) || (meetOrSlice == 'slice' && scaleMax == scaleX))) ctx.translate(0, height / 2.0 - desiredHeight / 2.0);
			if (align.match(/^xMax/) && ((meetOrSlice == 'meet' && scaleMin == scaleY) || (meetOrSlice == 'slice' && scaleMax == scaleY))) ctx.translate(width - desiredWidth, 0);
			if (align.match(/YMax$/) && ((meetOrSlice == 'meet' && scaleMin == scaleX) || (meetOrSlice == 'slice' && scaleMax == scaleX))) ctx.translate(0, height - desiredHeight);
		}

		// scale
		if (align == 'none') ctx.scale(scaleX, scaleY);
		else if (meetOrSlice == 'meet') ctx.scale(scaleMin, scaleMin);
		else if (meetOrSlice == 'slice') ctx.scale(scaleMax, scaleMax);

		// translate
		ctx.translate(minX == null ? 0 : -minX, minY == null ? 0 : -minY);
	}

	// elements
	svg.Element = {}

	svg.EmptyProperty = new svg.Property('EMPTY', '');

	svg.Element.ElementBase = function(node) {
		this.attributes = {};
		this.styles = {};
		this.stylesSpecificity = {};
		this.children = [];

		// get or create attribute
		this.attribute = function(name, createIfNotExists) {
			var a = this.attributes[name];
			if (a != null) return a;

			if (createIfNotExists == true) { a = new svg.Property(name, ''); this.attributes[name] = a; }
			return a || svg.EmptyProperty;
		}

		this.getHrefAttribute = function() {
			for (var a in this.attributes) {
				if (a == 'href' || a.match(/:href$/)) {
					return this.attributes[a];
				}
			}
			return svg.EmptyProperty;
		}

		// get or create style, crawls up node tree
		this.style = function(name, createIfNotExists, skipAncestors) {
			var s = this.styles[name];
			if (s != null) return s;

			var a = this.attribute(name);
			if (a != null && a.hasValue()) {
				this.styles[name] = a; // move up to me to cache
				return a;
			}

			if (skipAncestors != true) {
				var p = this.parent;
				if (p != null) {
					var ps = p.style(name);
					if (ps != null && ps.hasValue()) {
						return ps;
					}
				}
			}

			if (createIfNotExists == true) { s = new svg.Property(name, ''); this.styles[name] = s; }
			return s || svg.EmptyProperty;
		}

		// base render
		this.render = function(ctx) {
			// don't render display=none
			if (this.style('display').value == 'none') return;

			// don't render visibility=hidden
			if (this.style('visibility').value == 'hidden') return;

			ctx.save();
			if (this.style('mask').hasValue()) { // mask
				var mask = this.style('mask').getDefinition();
				if (mask != null) mask.apply(ctx, this);
			}
			else if (this.style('filter').hasValue()) { // filter
				var filter = this.style('filter').getDefinition();
				if (filter != null) filter.apply(ctx, this);
			}
			else {
				this.setContext(ctx);
				this.renderChildren(ctx);
				this.clearContext(ctx);
			}
			ctx.restore();
		}

		// base set context
		this.setContext = function(ctx) {
			// OVERRIDE ME!
		}

		// base clear context
		this.clearContext = function(ctx) {
			// OVERRIDE ME!
		}

		// base render children
		this.renderChildren = function(ctx) {
			for (var i=0; i<this.children.length; i++) {
				this.children[i].render(ctx);
			}
		}

		this.addChild = function(childNode, create) {
			var child = childNode;
			if (create) child = svg.CreateElement(childNode);
			child.parent = this;
			if (child.type != 'title') { this.children.push(child);	}
		}

		this.addStylesFromStyleDefinition = function () {
			// add styles
			for (var selector in svg.Styles) {
				if (selector[0] != '@' && matchesSelector(node, selector)) {
					var styles = svg.Styles[selector];
					var specificity = svg.StylesSpecificity[selector];
					if (styles != null) {
						for (var name in styles) {
							var existingSpecificity = this.stylesSpecificity[name];
							if (typeof existingSpecificity == 'undefined') {
								existingSpecificity = '000';
							}
							if (specificity > existingSpecificity) {
								this.styles[name] = styles[name];
								this.stylesSpecificity[name] = specificity;
							}
						}
					}
				}
			}
		};

		if (node != null && node.nodeType == 1) { //ELEMENT_NODE
			// add attributes
			for (var i=0; i<node.attributes.length; i++) {
				var attribute = node.attributes[i];
				this.attributes[attribute.nodeName] = new svg.Property(attribute.nodeName, attribute.value);
			}

			this.addStylesFromStyleDefinition();

			// add inline styles
			if (this.attribute('style').hasValue()) {
				var styles = this.attribute('style').value.split(';');
				for (var i=0; i<styles.length; i++) {
					if (svg.trim(styles[i]) != '') {
						var style = styles[i].split(':');
						var name = svg.trim(style[0]);
						var value = svg.trim(style[1]);
						this.styles[name] = new svg.Property(name, value);
					}
				}
			}

			// add id
			if (this.attribute('id').hasValue()) {
				if (svg.Definitions[this.attribute('id').value] == null) {
					svg.Definitions[this.attribute('id').value] = this;
				}
			}

			// add children
			for (var i=0; i<node.childNodes.length; i++) {
				var childNode = node.childNodes[i];
				if (childNode.nodeType == 1) this.addChild(childNode, true); //ELEMENT_NODE
				if (this.captureTextNodes && (childNode.nodeType == 3 || childNode.nodeType == 4)) {
					var text = childNode.value || childNode.text || childNode.textContent || '';
					if (svg.compressSpaces(text) != '') {
						this.addChild(new svg.Element.tspan(childNode), false); // TEXT_NODE
					}
				}
			}
		}
	}

	svg.Element.RenderedElementBase = function(node) {
		this.base = svg.Element.ElementBase;
		this.base(node);

		this.setContext = function(ctx) {
			// fill
			if (this.style('fill').isUrlDefinition()) {
				var fs = this.style('fill').getFillStyleDefinition(this, this.style('fill-opacity'));
				if (fs != null) ctx.fillStyle = fs;
			}
			else if (this.style('fill').hasValue()) {
				var fillStyle = this.style('fill');
				if (fillStyle.value == 'currentColor') fillStyle.value = this.style('color').value;
				if (fillStyle.value != 'inherit') ctx.fillStyle = (fillStyle.value == 'none' ? 'rgba(0,0,0,0)' : fillStyle.value);
			}
			if (this.style('fill-opacity').hasValue()) {
				var fillStyle = new svg.Property('fill', ctx.fillStyle);
				fillStyle = fillStyle.addOpacity(this.style('fill-opacity'));
				ctx.fillStyle = fillStyle.value;
			}

			// stroke
			if (this.style('stroke').isUrlDefinition()) {
				var fs = this.style('stroke').getFillStyleDefinition(this, this.style('stroke-opacity'));
				if (fs != null) ctx.strokeStyle = fs;
			}
			else if (this.style('stroke').hasValue()) {
				var strokeStyle = this.style('stroke');
				if (strokeStyle.value == 'currentColor') strokeStyle.value = this.style('color').value;
				if (strokeStyle.value != 'inherit') ctx.strokeStyle = (strokeStyle.value == 'none' ? 'rgba(0,0,0,0)' : strokeStyle.value);
			}
			if (this.style('stroke-opacity').hasValue()) {
				var strokeStyle = new svg.Property('stroke', ctx.strokeStyle);
				strokeStyle = strokeStyle.addOpacity(this.style('stroke-opacity'));
				ctx.strokeStyle = strokeStyle.value;
			}
			if (this.style('stroke-width').hasValue()) {
				var newLineWidth = this.style('stroke-width').toPixels();
				ctx.lineWidth = newLineWidth == 0 ? 0.001 : newLineWidth; // browsers don't respect 0
		    }
			if (this.style('stroke-linecap').hasValue()) ctx.lineCap = this.style('stroke-linecap').value;
			if (this.style('stroke-linejoin').hasValue()) ctx.lineJoin = this.style('stroke-linejoin').value;
			if (this.style('stroke-miterlimit').hasValue()) ctx.miterLimit = this.style('stroke-miterlimit').value;
			if (this.style('stroke-dasharray').hasValue() && this.style('stroke-dasharray').value != 'none') {
				var gaps = svg.ToNumberArray(this.style('stroke-dasharray').value);
				if (typeof ctx.setLineDash != 'undefined') { ctx.setLineDash(gaps); }
				else if (typeof ctx.webkitLineDash != 'undefined') { ctx.webkitLineDash = gaps; }
				else if (typeof ctx.mozDash != 'undefined' && !(gaps.length==1 && gaps[0]==0)) { ctx.mozDash = gaps; }

				var offset = this.style('stroke-dashoffset').numValueOrDefault(1);
				if (typeof ctx.lineDashOffset != 'undefined') { ctx.lineDashOffset = offset; }
				else if (typeof ctx.webkitLineDashOffset != 'undefined') { ctx.webkitLineDashOffset = offset; }
				else if (typeof ctx.mozDashOffset != 'undefined') { ctx.mozDashOffset = offset; }
			}

			// font
			if (typeof ctx.font != 'undefined') {
				ctx.font = svg.Font.CreateFont(
					this.style('font-style').value,
					this.style('font-variant').value,
					this.style('font-weight').value,
					this.style('font-size').hasValue() ? this.style('font-size').toPixels() + 'px' : '',
					this.style('font-family').value).toString();
			}

			// transform
			if (this.style('transform', false, true).hasValue()) {
				var transform = new svg.Transform(this.style('transform', false, true).value);
				transform.apply(ctx);
			}

			// clip
			if (this.style('clip-path', false, true).hasValue()) {
				var clip = this.style('clip-path', false, true).getDefinition();
				if (clip != null) clip.apply(ctx);
			}

			// opacity
			if (this.style('opacity').hasValue()) {
				ctx.globalAlpha = this.style('opacity').numValue();
			}
		}
	}
	svg.Element.RenderedElementBase.prototype = new svg.Element.ElementBase;

	svg.Element.PathElementBase = function(node) {
		this.base = svg.Element.RenderedElementBase;
		this.base(node);

		this.path = function(ctx) {
			if (ctx != null) ctx.beginPath();
			return new svg.BoundingBox();
		}

		this.renderChildren = function(ctx) {
			this.path(ctx);
			svg.Mouse.checkPath(this, ctx);
			if (ctx.fillStyle != '') {
				if (this.style('fill-rule').valueOrDefault('inherit') != 'inherit') { ctx.fill(this.style('fill-rule').value); }
				else { ctx.fill(); }
			}
			if (ctx.strokeStyle != '') ctx.stroke();

			var markers = this.getMarkers();
			if (markers != null) {
				if (this.style('marker-start').isUrlDefinition()) {
					var marker = this.style('marker-start').getDefinition();
					marker.render(ctx, markers[0][0], markers[0][1]);
				}
				if (this.style('marker-mid').isUrlDefinition()) {
					var marker = this.style('marker-mid').getDefinition();
					for (var i=1;i<markers.length-1;i++) {
						marker.render(ctx, markers[i][0], markers[i][1]);
					}
				}
				if (this.style('marker-end').isUrlDefinition()) {
					var marker = this.style('marker-end').getDefinition();
					marker.render(ctx, markers[markers.length-1][0], markers[markers.length-1][1]);
				}
			}
		}

		this.getBoundingBox = function() {
			return this.path();
		}

		this.getMarkers = function() {
			return null;
		}
	}
	svg.Element.PathElementBase.prototype = new svg.Element.RenderedElementBase;

	// svg element
	svg.Element.svg = function(node) {
		this.base = svg.Element.RenderedElementBase;
		this.base(node);

		this.baseClearContext = this.clearContext;
		this.clearContext = function(ctx) {
			this.baseClearContext(ctx);
			svg.ViewPort.RemoveCurrent();
		}

		this.baseSetContext = this.setContext;
		this.setContext = function(ctx) {
			// initial values and defaults
			ctx.strokeStyle = 'rgba(0,0,0,0)';
			ctx.lineCap = 'butt';
			ctx.lineJoin = 'miter';
			ctx.miterLimit = 4;
			if (typeof ctx.font != 'undefined' && typeof window.getComputedStyle != 'undefined') {
				ctx.font = window.getComputedStyle(ctx.canvas).getPropertyValue('font');
			}

			this.baseSetContext(ctx);

			// create new view port
			if (!this.attribute('x').hasValue()) this.attribute('x', true).value = 0;
			if (!this.attribute('y').hasValue()) this.attribute('y', true).value = 0;
			ctx.translate(this.attribute('x').toPixels('x'), this.attribute('y').toPixels('y'));

			var width = svg.ViewPort.width();
			var height = svg.ViewPort.height();

			if (!this.attribute('width').hasValue()) this.attribute('width', true).value = '100%';
			if (!this.attribute('height').hasValue()) this.attribute('height', true).value = '100%';
			if (typeof this.root == 'undefined') {
				width = this.attribute('width').toPixels('x');
				height = this.attribute('height').toPixels('y');

				var x = 0;
				var y = 0;
				if (this.attribute('refX').hasValue() && this.attribute('refY').hasValue()) {
					x = -this.attribute('refX').toPixels('x');
					y = -this.attribute('refY').toPixels('y');
				}

				if (this.attribute('overflow').valueOrDefault('hidden') != 'visible') {
					ctx.beginPath();
					ctx.moveTo(x, y);
					ctx.lineTo(width, y);
					ctx.lineTo(width, height);
					ctx.lineTo(x, height);
					ctx.closePath();
					ctx.clip();
				}
			}
			svg.ViewPort.SetCurrent(width, height);

			// viewbox
			if (this.attribute('viewBox').hasValue()) {
				var viewBox = svg.ToNumberArray(this.attribute('viewBox').value);
				var minX = viewBox[0];
				var minY = viewBox[1];
				width = viewBox[2];
				height = viewBox[3];

				svg.AspectRatio(ctx,
								this.attribute('preserveAspectRatio').value,
								svg.ViewPort.width(),
								width,
								svg.ViewPort.height(),
								height,
								minX,
								minY,
								this.attribute('refX').value,
								this.attribute('refY').value);

				svg.ViewPort.RemoveCurrent();
				svg.ViewPort.SetCurrent(viewBox[2], viewBox[3]);
			}
		}
	}
	svg.Element.svg.prototype = new svg.Element.RenderedElementBase;

	// rect element
	svg.Element.rect = function(node) {
		this.base = svg.Element.PathElementBase;
		this.base(node);

		this.path = function(ctx) {
			var x = this.attribute('x').toPixels('x');
			var y = this.attribute('y').toPixels('y');
			var width = this.attribute('width').toPixels('x');
			var height = this.attribute('height').toPixels('y');
			var rx = this.attribute('rx').toPixels('x');
			var ry = this.attribute('ry').toPixels('y');
			if (this.attribute('rx').hasValue() && !this.attribute('ry').hasValue()) ry = rx;
			if (this.attribute('ry').hasValue() && !this.attribute('rx').hasValue()) rx = ry;
			rx = Math.min(rx, width / 2.0);
			ry = Math.min(ry, height / 2.0);
			if (ctx != null) {
				ctx.beginPath();
				ctx.moveTo(x + rx, y);
				ctx.lineTo(x + width - rx, y);
				ctx.quadraticCurveTo(x + width, y, x + width, y + ry)
				ctx.lineTo(x + width, y + height - ry);
				ctx.quadraticCurveTo(x + width, y + height, x + width - rx, y + height)
				ctx.lineTo(x + rx, y + height);
				ctx.quadraticCurveTo(x, y + height, x, y + height - ry)
				ctx.lineTo(x, y + ry);
				ctx.quadraticCurveTo(x, y, x + rx, y)
				ctx.closePath();
			}

			return new svg.BoundingBox(x, y, x + width, y + height);
		}
	}
	svg.Element.rect.prototype = new svg.Element.PathElementBase;

	// circle element
	svg.Element.circle = function(node) {
		this.base = svg.Element.PathElementBase;
		this.base(node);

		this.path = function(ctx) {
			var cx = this.attribute('cx').toPixels('x');
			var cy = this.attribute('cy').toPixels('y');
			var r = this.attribute('r').toPixels();

			if (ctx != null) {
				ctx.beginPath();
				ctx.arc(cx, cy, r, 0, Math.PI * 2, true);
				ctx.closePath();
			}

			return new svg.BoundingBox(cx - r, cy - r, cx + r, cy + r);
		}
	}
	svg.Element.circle.prototype = new svg.Element.PathElementBase;

	// ellipse element
	svg.Element.ellipse = function(node) {
		this.base = svg.Element.PathElementBase;
		this.base(node);

		this.path = function(ctx) {
			var KAPPA = 4 * ((Math.sqrt(2) - 1) / 3);
			var rx = this.attribute('rx').toPixels('x');
			var ry = this.attribute('ry').toPixels('y');
			var cx = this.attribute('cx').toPixels('x');
			var cy = this.attribute('cy').toPixels('y');

			if (ctx != null) {
				ctx.beginPath();
				ctx.moveTo(cx, cy - ry);
				ctx.bezierCurveTo(cx + (KAPPA * rx), cy - ry,  cx + rx, cy - (KAPPA * ry), cx + rx, cy);
				ctx.bezierCurveTo(cx + rx, cy + (KAPPA * ry), cx + (KAPPA * rx), cy + ry, cx, cy + ry);
				ctx.bezierCurveTo(cx - (KAPPA * rx), cy + ry, cx - rx, cy + (KAPPA * ry), cx - rx, cy);
				ctx.bezierCurveTo(cx - rx, cy - (KAPPA * ry), cx - (KAPPA * rx), cy - ry, cx, cy - ry);
				ctx.closePath();
			}

			return new svg.BoundingBox(cx - rx, cy - ry, cx + rx, cy + ry);
		}
	}
	svg.Element.ellipse.prototype = new svg.Element.PathElementBase;

	// line element
	svg.Element.line = function(node) {
		this.base = svg.Element.PathElementBase;
		this.base(node);

		this.getPoints = function() {
			return [
				new svg.Point(this.attribute('x1').toPixels('x'), this.attribute('y1').toPixels('y')),
				new svg.Point(this.attribute('x2').toPixels('x'), this.attribute('y2').toPixels('y'))];
		}

		this.path = function(ctx) {
			var points = this.getPoints();

			if (ctx != null) {
				ctx.beginPath();
				ctx.moveTo(points[0].x, points[0].y);
				ctx.lineTo(points[1].x, points[1].y);
			}

			return new svg.BoundingBox(points[0].x, points[0].y, points[1].x, points[1].y);
		}

		this.getMarkers = function() {
			var points = this.getPoints();
			var a = points[0].angleTo(points[1]);
			return [[points[0], a], [points[1], a]];
		}
	}
	svg.Element.line.prototype = new svg.Element.PathElementBase;

	// polyline element
	svg.Element.polyline = function(node) {
		this.base = svg.Element.PathElementBase;
		this.base(node);

		this.points = svg.CreatePath(this.attribute('points').value);
		this.path = function(ctx) {
			var bb = new svg.BoundingBox(this.points[0].x, this.points[0].y);
			if (ctx != null) {
				ctx.beginPath();
				ctx.moveTo(this.points[0].x, this.points[0].y);
			}
			for (var i=1; i<this.points.length; i++) {
				bb.addPoint(this.points[i].x, this.points[i].y);
				if (ctx != null) ctx.lineTo(this.points[i].x, this.points[i].y);
			}
			return bb;
		}

		this.getMarkers = function() {
			var markers = [];
			for (var i=0; i<this.points.length - 1; i++) {
				markers.push([this.points[i], this.points[i].angleTo(this.points[i+1])]);
			}
			if (markers.length > 0) {
				markers.push([this.points[this.points.length-1], markers[markers.length-1][1]]);
			}
			return markers;
		}
	}
	svg.Element.polyline.prototype = new svg.Element.PathElementBase;

	// polygon element
	svg.Element.polygon = function(node) {
		this.base = svg.Element.polyline;
		this.base(node);

		this.basePath = this.path;
		this.path = function(ctx) {
			var bb = this.basePath(ctx);
			if (ctx != null) {
				ctx.lineTo(this.points[0].x, this.points[0].y);
				ctx.closePath();
			}
			return bb;
		}
	}
	svg.Element.polygon.prototype = new svg.Element.polyline;

	// path element
	svg.Element.path = function(node) {
		this.base = svg.Element.PathElementBase;
		this.base(node);

		var d = this.attribute('d').value;
		// TODO: convert to real lexer based on http://www.w3.org/TR/SVG11/paths.html#PathDataBNF
		d = d.replace(/,/gm,' '); // get rid of all commas
		// As the end of a match can also be the start of the next match, we need to run this replace twice.
		for(var i=0; i<2; i++)
			d = d.replace(/([MmZzLlHhVvCcSsQqTtAa])([^\s])/gm,'$1 $2'); // suffix commands with spaces
		d = d.replace(/([^\s])([MmZzLlHhVvCcSsQqTtAa])/gm,'$1 $2'); // prefix commands with spaces
		d = d.replace(/([0-9])([+\-])/gm,'$1 $2'); // separate digits on +- signs
		// Again, we need to run this twice to find all occurances
		for(var i=0; i<2; i++)
			d = d.replace(/(\.[0-9]*)(\.)/gm,'$1 $2'); // separate digits when they start with a comma
		d = d.replace(/([Aa](\s+[0-9]+){3})\s+([01])\s*([01])/gm,'$1 $3 $4 '); // shorthand elliptical arc path syntax
		d = svg.compressSpaces(d); // compress multiple spaces
		d = svg.trim(d);
		this.PathParser = new (function(d) {
			this.tokens = d.split(' ');

			this.reset = function() {
				this.i = -1;
				this.command = '';
				this.previousCommand = '';
				this.start = new svg.Point(0, 0);
				this.control = new svg.Point(0, 0);
				this.current = new svg.Point(0, 0);
				this.points = [];
				this.angles = [];
			}

			this.isEnd = function() {
				return this.i >= this.tokens.length - 1;
			}

			this.isCommandOrEnd = function() {
				if (this.isEnd()) return true;
				return this.tokens[this.i + 1].match(/^[A-Za-z]$/) != null;
			}

			this.isRelativeCommand = function() {
				switch(this.command)
				{
					case 'm':
					case 'l':
					case 'h':
					case 'v':
					case 'c':
					case 's':
					case 'q':
					case 't':
					case 'a':
					case 'z':
						return true;
						break;
				}
				return false;
			}

			this.getToken = function() {
				this.i++;
				return this.tokens[this.i];
			}

			this.getScalar = function() {
				return parseFloat(this.getToken());
			}

			this.nextCommand = function() {
				this.previousCommand = this.command;
				this.command = this.getToken();
			}

			this.getPoint = function() {
				var p = new svg.Point(this.getScalar(), this.getScalar());
				return this.makeAbsolute(p);
			}

			this.getAsControlPoint = function() {
				var p = this.getPoint();
				this.control = p;
				return p;
			}

			this.getAsCurrentPoint = function() {
				var p = this.getPoint();
				this.current = p;
				return p;
			}

			this.getReflectedControlPoint = function() {
				if (this.previousCommand.toLowerCase() != 'c' &&
				    this.previousCommand.toLowerCase() != 's' &&
					this.previousCommand.toLowerCase() != 'q' &&
					this.previousCommand.toLowerCase() != 't' ){
					return this.current;
				}

				// reflect point
				var p = new svg.Point(2 * this.current.x - this.control.x, 2 * this.current.y - this.control.y);
				return p;
			}

			this.makeAbsolute = function(p) {
				if (this.isRelativeCommand()) {
					p.x += this.current.x;
					p.y += this.current.y;
				}
				return p;
			}

			this.addMarker = function(p, from, priorTo) {
				// if the last angle isn't filled in because we didn't have this point yet ...
				if (priorTo != null && this.angles.length > 0 && this.angles[this.angles.length-1] == null) {
					this.angles[this.angles.length-1] = this.points[this.points.length-1].angleTo(priorTo);
				}
				this.addMarkerAngle(p, from == null ? null : from.angleTo(p));
			}

			this.addMarkerAngle = function(p, a) {
				this.points.push(p);
				this.angles.push(a);
			}

			this.getMarkerPoints = function() { return this.points; }
			this.getMarkerAngles = function() {
				for (var i=0; i<this.angles.length; i++) {
					if (this.angles[i] == null) {
						for (var j=i+1; j<this.angles.length; j++) {
							if (this.angles[j] != null) {
								this.angles[i] = this.angles[j];
								break;
							}
						}
					}
				}
				return this.angles;
			}
		})(d);

		this.path = function(ctx) {
			var pp = this.PathParser;
			pp.reset();

			var bb = new svg.BoundingBox();
			if (ctx != null) ctx.beginPath();
			while (!pp.isEnd()) {
				pp.nextCommand();
				switch (pp.command) {
				case 'M':
				case 'm':
					var p = pp.getAsCurrentPoint();
					pp.addMarker(p);
					bb.addPoint(p.x, p.y);
					if (ctx != null) ctx.moveTo(p.x, p.y);
					pp.start = pp.current;
					while (!pp.isCommandOrEnd()) {
						var p = pp.getAsCurrentPoint();
						pp.addMarker(p, pp.start);
						bb.addPoint(p.x, p.y);
						if (ctx != null) ctx.lineTo(p.x, p.y);
					}
					break;
				case 'L':
				case 'l':
					while (!pp.isCommandOrEnd()) {
						var c = pp.current;
						var p = pp.getAsCurrentPoint();
						pp.addMarker(p, c);
						bb.addPoint(p.x, p.y);
						if (ctx != null) ctx.lineTo(p.x, p.y);
					}
					break;
				case 'H':
				case 'h':
					while (!pp.isCommandOrEnd()) {
						var newP = new svg.Point((pp.isRelativeCommand() ? pp.current.x : 0) + pp.getScalar(), pp.current.y);
						pp.addMarker(newP, pp.current);
						pp.current = newP;
						bb.addPoint(pp.current.x, pp.current.y);
						if (ctx != null) ctx.lineTo(pp.current.x, pp.current.y);
					}
					break;
				case 'V':
				case 'v':
					while (!pp.isCommandOrEnd()) {
						var newP = new svg.Point(pp.current.x, (pp.isRelativeCommand() ? pp.current.y : 0) + pp.getScalar());
						pp.addMarker(newP, pp.current);
						pp.current = newP;
						bb.addPoint(pp.current.x, pp.current.y);
						if (ctx != null) ctx.lineTo(pp.current.x, pp.current.y);
					}
					break;
				case 'C':
				case 'c':
					while (!pp.isCommandOrEnd()) {
						var curr = pp.current;
						var p1 = pp.getPoint();
						var cntrl = pp.getAsControlPoint();
						var cp = pp.getAsCurrentPoint();
						pp.addMarker(cp, cntrl, p1);
						bb.addBezierCurve(curr.x, curr.y, p1.x, p1.y, cntrl.x, cntrl.y, cp.x, cp.y);
						if (ctx != null) ctx.bezierCurveTo(p1.x, p1.y, cntrl.x, cntrl.y, cp.x, cp.y);
					}
					break;
				case 'S':
				case 's':
					while (!pp.isCommandOrEnd()) {
						var curr = pp.current;
						var p1 = pp.getReflectedControlPoint();
						var cntrl = pp.getAsControlPoint();
						var cp = pp.getAsCurrentPoint();
						pp.addMarker(cp, cntrl, p1);
						bb.addBezierCurve(curr.x, curr.y, p1.x, p1.y, cntrl.x, cntrl.y, cp.x, cp.y);
						if (ctx != null) ctx.bezierCurveTo(p1.x, p1.y, cntrl.x, cntrl.y, cp.x, cp.y);
					}
					break;
				case 'Q':
				case 'q':
					while (!pp.isCommandOrEnd()) {
						var curr = pp.current;
						var cntrl = pp.getAsControlPoint();
						var cp = pp.getAsCurrentPoint();
						pp.addMarker(cp, cntrl, cntrl);
						bb.addQuadraticCurve(curr.x, curr.y, cntrl.x, cntrl.y, cp.x, cp.y);
						if (ctx != null) ctx.quadraticCurveTo(cntrl.x, cntrl.y, cp.x, cp.y);
					}
					break;
				case 'T':
				case 't':
					while (!pp.isCommandOrEnd()) {
						var curr = pp.current;
						var cntrl = pp.getReflectedControlPoint();
						pp.control = cntrl;
						var cp = pp.getAsCurrentPoint();
						pp.addMarker(cp, cntrl, cntrl);
						bb.addQuadraticCurve(curr.x, curr.y, cntrl.x, cntrl.y, cp.x, cp.y);
						if (ctx != null) ctx.quadraticCurveTo(cntrl.x, cntrl.y, cp.x, cp.y);
					}
					break;
				case 'A':
				case 'a':
					while (!pp.isCommandOrEnd()) {
					    var curr = pp.current;
						var rx = pp.getScalar();
						var ry = pp.getScalar();
						var xAxisRotation = pp.getScalar() * (Math.PI / 180.0);
						var largeArcFlag = pp.getScalar();
						var sweepFlag = pp.getScalar();
						var cp = pp.getAsCurrentPoint();

						// Conversion from endpoint to center parameterization
						// http://www.w3.org/TR/SVG11/implnote.html#ArcImplementationNotes
						// x1', y1'
						var currp = new svg.Point(
							Math.cos(xAxisRotation) * (curr.x - cp.x) / 2.0 + Math.sin(xAxisRotation) * (curr.y - cp.y) / 2.0,
							-Math.sin(xAxisRotation) * (curr.x - cp.x) / 2.0 + Math.cos(xAxisRotation) * (curr.y - cp.y) / 2.0
						);
						// adjust radii
						var l = Math.pow(currp.x,2)/Math.pow(rx,2)+Math.pow(currp.y,2)/Math.pow(ry,2);
						if (l > 1) {
							rx *= Math.sqrt(l);
							ry *= Math.sqrt(l);
						}
						// cx', cy'
						var s = (largeArcFlag == sweepFlag ? -1 : 1) * Math.sqrt(
							((Math.pow(rx,2)*Math.pow(ry,2))-(Math.pow(rx,2)*Math.pow(currp.y,2))-(Math.pow(ry,2)*Math.pow(currp.x,2))) /
							(Math.pow(rx,2)*Math.pow(currp.y,2)+Math.pow(ry,2)*Math.pow(currp.x,2))
						);
						if (isNaN(s)) s = 0;
						var cpp = new svg.Point(s * rx * currp.y / ry, s * -ry * currp.x / rx);
						// cx, cy
						var centp = new svg.Point(
							(curr.x + cp.x) / 2.0 + Math.cos(xAxisRotation) * cpp.x - Math.sin(xAxisRotation) * cpp.y,
							(curr.y + cp.y) / 2.0 + Math.sin(xAxisRotation) * cpp.x + Math.cos(xAxisRotation) * cpp.y
						);
						// vector magnitude
						var m = function(v) { return Math.sqrt(Math.pow(v[0],2) + Math.pow(v[1],2)); }
						// ratio between two vectors
						var r = function(u, v) { return (u[0]*v[0]+u[1]*v[1]) / (m(u)*m(v)) }
						// angle between two vectors
						var a = function(u, v) { return (u[0]*v[1] < u[1]*v[0] ? -1 : 1) * Math.acos(r(u,v)); }
						// initial angle
						var a1 = a([1,0], [(currp.x-cpp.x)/rx,(currp.y-cpp.y)/ry]);
						// angle delta
						var u = [(currp.x-cpp.x)/rx,(currp.y-cpp.y)/ry];
						var v = [(-currp.x-cpp.x)/rx,(-currp.y-cpp.y)/ry];
						var ad = a(u, v);
						if (r(u,v) <= -1) ad = Math.PI;
						if (r(u,v) >= 1) ad = 0;

						// for markers
						var dir = 1 - sweepFlag ? 1.0 : -1.0;
						var ah = a1 + dir * (ad / 2.0);
						var halfWay = new svg.Point(
							centp.x + rx * Math.cos(ah),
							centp.y + ry * Math.sin(ah)
						);
						pp.addMarkerAngle(halfWay, ah - dir * Math.PI / 2);
						pp.addMarkerAngle(cp, ah - dir * Math.PI);

						bb.addPoint(cp.x, cp.y); // TODO: this is too naive, make it better
						if (ctx != null) {
							var r = rx > ry ? rx : ry;
							var sx = rx > ry ? 1 : rx / ry;
							var sy = rx > ry ? ry / rx : 1;

							ctx.translate(centp.x, centp.y);
							ctx.rotate(xAxisRotation);
							ctx.scale(sx, sy);
							ctx.arc(0, 0, r, a1, a1 + ad, 1 - sweepFlag);
							ctx.scale(1/sx, 1/sy);
							ctx.rotate(-xAxisRotation);
							ctx.translate(-centp.x, -centp.y);
						}
					}
					break;
				case 'Z':
				case 'z':
					if (ctx != null) ctx.closePath();
					pp.current = pp.start;
				}
			}

			return bb;
		}

		this.getMarkers = function() {
			var points = this.PathParser.getMarkerPoints();
			var angles = this.PathParser.getMarkerAngles();

			var markers = [];
			for (var i=0; i<points.length; i++) {
				markers.push([points[i], angles[i]]);
			}
			return markers;
		}
	}
	svg.Element.path.prototype = new svg.Element.PathElementBase;

	// pattern element
	svg.Element.pattern = function(node) {
		this.base = svg.Element.ElementBase;
		this.base(node);

		this.createPattern = function(ctx, element) {
			var width = this.attribute('width').toPixels('x', true);
			var height = this.attribute('height').toPixels('y', true);

			// render me using a temporary svg element
			var tempSvg = new svg.Element.svg();
			tempSvg.attributes['viewBox'] = new svg.Property('viewBox', this.attribute('viewBox').value);
			tempSvg.attributes['width'] = new svg.Property('width', width + 'px');
			tempSvg.attributes['height'] = new svg.Property('height', height + 'px');
			tempSvg.attributes['transform'] = new svg.Property('transform', this.attribute('patternTransform').value);
			tempSvg.children = this.children;

			var c = document.createElement('canvas');
			c.width = width;
			c.height = height;
			var cctx = c.getContext('2d');
			if (this.attribute('x').hasValue() && this.attribute('y').hasValue()) {
				cctx.translate(this.attribute('x').toPixels('x', true), this.attribute('y').toPixels('y', true));
			}
			// render 3x3 grid so when we transform there's no white space on edges
			for (var x=-1; x<=1; x++) {
				for (var y=-1; y<=1; y++) {
					cctx.save();
					tempSvg.attributes['x'] = new svg.Property('x', x * c.width);
					tempSvg.attributes['y'] = new svg.Property('y', y * c.height);
					tempSvg.render(cctx);
					cctx.restore();
				}
			}
			var pattern = ctx.createPattern(c, 'repeat');
			return pattern;
		}
	}
	svg.Element.pattern.prototype = new svg.Element.ElementBase;

	// marker element
	svg.Element.marker = function(node) {
		this.base = svg.Element.ElementBase;
		this.base(node);

		this.baseRender = this.render;
		this.render = function(ctx, point, angle) {
			ctx.translate(point.x, point.y);
			if (this.attribute('orient').valueOrDefault('auto') == 'auto') ctx.rotate(angle);
			if (this.attribute('markerUnits').valueOrDefault('strokeWidth') == 'strokeWidth') ctx.scale(ctx.lineWidth, ctx.lineWidth);
			ctx.save();

			// render me using a temporary svg element
			var tempSvg = new svg.Element.svg();
			tempSvg.attributes['viewBox'] = new svg.Property('viewBox', this.attribute('viewBox').value);
			tempSvg.attributes['refX'] = new svg.Property('refX', this.attribute('refX').value);
			tempSvg.attributes['refY'] = new svg.Property('refY', this.attribute('refY').value);
			tempSvg.attributes['width'] = new svg.Property('width', this.attribute('markerWidth').value);
			tempSvg.attributes['height'] = new svg.Property('height', this.attribute('markerHeight').value);
			tempSvg.attributes['fill'] = new svg.Property('fill', this.attribute('fill').valueOrDefault('black'));
			tempSvg.attributes['stroke'] = new svg.Property('stroke', this.attribute('stroke').valueOrDefault('none'));
			tempSvg.children = this.children;
			tempSvg.render(ctx);

			ctx.restore();
			if (this.attribute('markerUnits').valueOrDefault('strokeWidth') == 'strokeWidth') ctx.scale(1/ctx.lineWidth, 1/ctx.lineWidth);
			if (this.attribute('orient').valueOrDefault('auto') == 'auto') ctx.rotate(-angle);
			ctx.translate(-point.x, -point.y);
		}
	}
	svg.Element.marker.prototype = new svg.Element.ElementBase;

	// definitions element
	svg.Element.defs = function(node) {
		this.base = svg.Element.ElementBase;
		this.base(node);

		this.render = function(ctx) {
			// NOOP
		}
	}
	svg.Element.defs.prototype = new svg.Element.ElementBase;

	// base for gradients
	svg.Element.GradientBase = function(node) {
		this.base = svg.Element.ElementBase;
		this.base(node);

		this.stops = [];
		for (var i=0; i<this.children.length; i++) {
			var child = this.children[i];
			if (child.type == 'stop') this.stops.push(child);
		}

		this.getGradient = function() {
			// OVERRIDE ME!
		}

		this.gradientUnits = function () {
			return this.attribute('gradientUnits').valueOrDefault('objectBoundingBox');
		}

		this.attributesToInherit = ['gradientUnits'];

		this.inheritStopContainer = function (stopsContainer) {
			for (var i=0; i<this.attributesToInherit.length; i++) {
				var attributeToInherit = this.attributesToInherit[i];
				if (!this.attribute(attributeToInherit).hasValue() && stopsContainer.attribute(attributeToInherit).hasValue()) {
					this.attribute(attributeToInherit, true).value = stopsContainer.attribute(attributeToInherit).value;
				}
			}
		}

		this.createGradient = function(ctx, element, parentOpacityProp) {
			var stopsContainer = this;
			if (this.getHrefAttribute().hasValue()) {
				stopsContainer = this.getHrefAttribute().getDefinition();
				this.inheritStopContainer(stopsContainer);
			}

			var addParentOpacity = function (color) {
				if (parentOpacityProp.hasValue()) {
					var p = new svg.Property('color', color);
					return p.addOpacity(parentOpacityProp).value;
				}
				return color;
			};

			var g = this.getGradient(ctx, element);
			if (g == null) return addParentOpacity(stopsContainer.stops[stopsContainer.stops.length - 1].color);
			for (var i=0; i<stopsContainer.stops.length; i++) {
				g.addColorStop(stopsContainer.stops[i].offset, addParentOpacity(stopsContainer.stops[i].color));
			}

			if (this.attribute('gradientTransform').hasValue()) {
				// render as transformed pattern on temporary canvas
				var rootView = svg.ViewPort.viewPorts[0];

				var rect = new svg.Element.rect();
				rect.attributes['x'] = new svg.Property('x', -svg.MAX_VIRTUAL_PIXELS/3.0);
				rect.attributes['y'] = new svg.Property('y', -svg.MAX_VIRTUAL_PIXELS/3.0);
				rect.attributes['width'] = new svg.Property('width', svg.MAX_VIRTUAL_PIXELS);
				rect.attributes['height'] = new svg.Property('height', svg.MAX_VIRTUAL_PIXELS);

				var group = new svg.Element.g();
				group.attributes['transform'] = new svg.Property('transform', this.attribute('gradientTransform').value);
				group.children = [ rect ];

				var tempSvg = new svg.Element.svg();
				tempSvg.attributes['x'] = new svg.Property('x', 0);
				tempSvg.attributes['y'] = new svg.Property('y', 0);
				tempSvg.attributes['width'] = new svg.Property('width', rootView.width);
				tempSvg.attributes['height'] = new svg.Property('height', rootView.height);
				tempSvg.children = [ group ];

				var c = document.createElement('canvas');
				c.width = rootView.width;
				c.height = rootView.height;
				var tempCtx = c.getContext('2d');
				tempCtx.fillStyle = g;
				tempSvg.render(tempCtx);
				return tempCtx.createPattern(c, 'no-repeat');
			}

			return g;
		}
	}
	svg.Element.GradientBase.prototype = new svg.Element.ElementBase;

	// linear gradient element
	svg.Element.linearGradient = function(node) {
		this.base = svg.Element.GradientBase;
		this.base(node);

		this.attributesToInherit.push('x1');
		this.attributesToInherit.push('y1');
		this.attributesToInherit.push('x2');
		this.attributesToInherit.push('y2');

		this.getGradient = function(ctx, element) {
			var bb = this.gradientUnits() == 'objectBoundingBox' ? element.getBoundingBox() : null;

			if (!this.attribute('x1').hasValue()
			 && !this.attribute('y1').hasValue()
			 && !this.attribute('x2').hasValue()
			 && !this.attribute('y2').hasValue()) {
				this.attribute('x1', true).value = 0;
				this.attribute('y1', true).value = 0;
				this.attribute('x2', true).value = 1;
				this.attribute('y2', true).value = 0;
			 }

			var x1 = (this.gradientUnits() == 'objectBoundingBox'
				? bb.x() + bb.width() * this.attribute('x1').numValue()
				: this.attribute('x1').toPixels('x'));
			var y1 = (this.gradientUnits() == 'objectBoundingBox'
				? bb.y() + bb.height() * this.attribute('y1').numValue()
				: this.attribute('y1').toPixels('y'));
			var x2 = (this.gradientUnits() == 'objectBoundingBox'
				? bb.x() + bb.width() * this.attribute('x2').numValue()
				: this.attribute('x2').toPixels('x'));
			var y2 = (this.gradientUnits() == 'objectBoundingBox'
				? bb.y() + bb.height() * this.attribute('y2').numValue()
				: this.attribute('y2').toPixels('y'));

			if (x1 == x2 && y1 == y2) return null;
			return ctx.createLinearGradient(x1, y1, x2, y2);
		}
	}
	svg.Element.linearGradient.prototype = new svg.Element.GradientBase;

	// radial gradient element
	svg.Element.radialGradient = function(node) {
		this.base = svg.Element.GradientBase;
		this.base(node);

		this.attributesToInherit.push('cx');
		this.attributesToInherit.push('cy');
		this.attributesToInherit.push('r');
		this.attributesToInherit.push('fx');
		this.attributesToInherit.push('fy');

		this.getGradient = function(ctx, element) {
			var bb = element.getBoundingBox();

			if (!this.attribute('cx').hasValue()) this.attribute('cx', true).value = '50%';
			if (!this.attribute('cy').hasValue()) this.attribute('cy', true).value = '50%';
			if (!this.attribute('r').hasValue()) this.attribute('r', true).value = '50%';

			var cx = (this.gradientUnits() == 'objectBoundingBox'
				? bb.x() + bb.width() * this.attribute('cx').numValue()
				: this.attribute('cx').toPixels('x'));
			var cy = (this.gradientUnits() == 'objectBoundingBox'
				? bb.y() + bb.height() * this.attribute('cy').numValue()
				: this.attribute('cy').toPixels('y'));

			var fx = cx;
			var fy = cy;
			if (this.attribute('fx').hasValue()) {
				fx = (this.gradientUnits() == 'objectBoundingBox'
				? bb.x() + bb.width() * this.attribute('fx').numValue()
				: this.attribute('fx').toPixels('x'));
			}
			if (this.attribute('fy').hasValue()) {
				fy = (this.gradientUnits() == 'objectBoundingBox'
				? bb.y() + bb.height() * this.attribute('fy').numValue()
				: this.attribute('fy').toPixels('y'));
			}

			var r = (this.gradientUnits() == 'objectBoundingBox'
				? (bb.width() + bb.height()) / 2.0 * this.attribute('r').numValue()
				: this.attribute('r').toPixels());

			return ctx.createRadialGradient(fx, fy, 0, cx, cy, r);
		}
	}
	svg.Element.radialGradient.prototype = new svg.Element.GradientBase;

	// gradient stop element
	svg.Element.stop = function(node) {
		this.base = svg.Element.ElementBase;
		this.base(node);

		this.offset = this.attribute('offset').numValue();
		if (this.offset < 0) this.offset = 0;
		if (this.offset > 1) this.offset = 1;

		var stopColor = this.style('stop-color', true);
		if (stopColor.value == '') stopColor.value = '#000';
		if (this.style('stop-opacity').hasValue()) stopColor = stopColor.addOpacity(this.style('stop-opacity'));
		this.color = stopColor.value;
	}
	svg.Element.stop.prototype = new svg.Element.ElementBase;

	// animation base element
	svg.Element.AnimateBase = function(node) {
		this.base = svg.Element.ElementBase;
		this.base(node);

		svg.Animations.push(this);

		this.duration = 0.0;
		this.begin = this.attribute('begin').toMilliseconds();
		this.maxDuration = this.begin + this.attribute('dur').toMilliseconds();

		this.getProperty = function() {
			var attributeType = this.attribute('attributeType').value;
			var attributeName = this.attribute('attributeName').value;

			if (attributeType == 'CSS') {
				return this.parent.style(attributeName, true);
			}
			return this.parent.attribute(attributeName, true);
		};

		this.initialValue = null;
		this.initialUnits = '';
		this.removed = false;

		this.calcValue = function() {
			// OVERRIDE ME!
			return '';
		}

		this.update = function(delta) {
			// set initial value
			if (this.initialValue == null) {
				this.initialValue = this.getProperty().value;
				this.initialUnits = this.getProperty().getUnits();
			}

			// if we're past the end time
			if (this.duration > this.maxDuration) {
				// loop for indefinitely repeating animations
				if (this.attribute('repeatCount').value == 'indefinite'
				 || this.attribute('repeatDur').value == 'indefinite') {
					this.duration = 0.0
				}
				else if (this.attribute('fill').valueOrDefault('remove') == 'freeze' && !this.frozen) {
					this.frozen = true;
					this.parent.animationFrozen = true;
					this.parent.animationFrozenValue = this.getProperty().value;
				}
				else if (this.attribute('fill').valueOrDefault('remove') == 'remove' && !this.removed) {
					this.removed = true;
					this.getProperty().value = this.parent.animationFrozen ? this.parent.animationFrozenValue : this.initialValue;
					return true;
				}
				return false;
			}
			this.duration = this.duration + delta;

			// if we're past the begin time
			var updated = false;
			if (this.begin < this.duration) {
				var newValue = this.calcValue(); // tween

				if (this.attribute('type').hasValue()) {
					// for transform, etc.
					var type = this.attribute('type').value;
					newValue = type + '(' + newValue + ')';
				}

				this.getProperty().value = newValue;
				updated = true;
			}

			return updated;
		}

		this.from = this.attribute('from');
		this.to = this.attribute('to');
		this.values = this.attribute('values');
		if (this.values.hasValue()) this.values.value = this.values.value.split(';');

		// fraction of duration we've covered
		this.progress = function() {
			var ret = { progress: (this.duration - this.begin) / (this.maxDuration - this.begin) };
			if (this.values.hasValue()) {
				var p = ret.progress * (this.values.value.length - 1);
				var lb = Math.floor(p), ub = Math.ceil(p);
				ret.from = new svg.Property('from', parseFloat(this.values.value[lb]));
				ret.to = new svg.Property('to', parseFloat(this.values.value[ub]));
				ret.progress = (p - lb) / (ub - lb);
			}
			else {
				ret.from = this.from;
				ret.to = this.to;
			}
			return ret;
		}
	}
	svg.Element.AnimateBase.prototype = new svg.Element.ElementBase;

	// animate element
	svg.Element.animate = function(node) {
		this.base = svg.Element.AnimateBase;
		this.base(node);

		this.calcValue = function() {
			var p = this.progress();

			// tween value linearly
			var newValue = p.from.numValue() + (p.to.numValue() - p.from.numValue()) * p.progress;
			return newValue + this.initialUnits;
		};
	}
	svg.Element.animate.prototype = new svg.Element.AnimateBase;

	// animate color element
	svg.Element.animateColor = function(node) {
		this.base = svg.Element.AnimateBase;
		this.base(node);

		this.calcValue = function() {
			var p = this.progress();
			var from = new RGBColor(p.from.value);
			var to = new RGBColor(p.to.value);

			if (from.ok && to.ok) {
				// tween color linearly
				var r = from.r + (to.r - from.r) * p.progress;
				var g = from.g + (to.g - from.g) * p.progress;
				var b = from.b + (to.b - from.b) * p.progress;
				return 'rgb('+parseInt(r,10)+','+parseInt(g,10)+','+parseInt(b,10)+')';
			}
			return this.attribute('from').value;
		};
	}
	svg.Element.animateColor.prototype = new svg.Element.AnimateBase;

	// animate transform element
	svg.Element.animateTransform = function(node) {
		this.base = svg.Element.AnimateBase;
		this.base(node);

		this.calcValue = function() {
			var p = this.progress();

			// tween value linearly
			var from = svg.ToNumberArray(p.from.value);
			var to = svg.ToNumberArray(p.to.value);
			var newValue = '';
			for (var i=0; i<from.length; i++) {
				newValue += from[i] + (to[i] - from[i]) * p.progress + ' ';
			}
			return newValue;
		};
	}
	svg.Element.animateTransform.prototype = new svg.Element.animate;

	// font element
	svg.Element.font = function(node) {
		this.base = svg.Element.ElementBase;
		this.base(node);

		this.horizAdvX = this.attribute('horiz-adv-x').numValue();

		this.isRTL = false;
		this.isArabic = false;
		this.fontFace = null;
		this.missingGlyph = null;
		this.glyphs = [];
		for (var i=0; i<this.children.length; i++) {
			var child = this.children[i];
			if (child.type == 'font-face') {
				this.fontFace = child;
				if (child.style('font-family').hasValue()) {
					svg.Definitions[child.style('font-family').value] = this;
				}
			}
			else if (child.type == 'missing-glyph') this.missingGlyph = child;
			else if (child.type == 'glyph') {
				if (child.arabicForm != '') {
					this.isRTL = true;
					this.isArabic = true;
					if (typeof this.glyphs[child.unicode] == 'undefined') this.glyphs[child.unicode] = [];
					this.glyphs[child.unicode][child.arabicForm] = child;
				}
				else {
					this.glyphs[child.unicode] = child;
				}
			}
		}
	}
	svg.Element.font.prototype = new svg.Element.ElementBase;

	// font-face element
	svg.Element.fontface = function(node) {
		this.base = svg.Element.ElementBase;
		this.base(node);

		this.ascent = this.attribute('ascent').value;
		this.descent = this.attribute('descent').value;
		this.unitsPerEm = this.attribute('units-per-em').numValue();
	}
	svg.Element.fontface.prototype = new svg.Element.ElementBase;

	// missing-glyph element
	svg.Element.missingglyph = function(node) {
		this.base = svg.Element.path;
		this.base(node);

		this.horizAdvX = 0;
	}
	svg.Element.missingglyph.prototype = new svg.Element.path;

	// glyph element
	svg.Element.glyph = function(node) {
		this.base = svg.Element.path;
		this.base(node);

		this.horizAdvX = this.attribute('horiz-adv-x').numValue();
		this.unicode = this.attribute('unicode').value;
		this.arabicForm = this.attribute('arabic-form').value;
	}
	svg.Element.glyph.prototype = new svg.Element.path;

	// text element
	svg.Element.text = function(node) {
		this.captureTextNodes = true;
		this.base = svg.Element.RenderedElementBase;
		this.base(node);

		this.baseSetContext = this.setContext;
		this.setContext = function(ctx) {
			this.baseSetContext(ctx);

			var textBaseline = this.style('dominant-baseline').toTextBaseline();
			if (textBaseline == null) textBaseline = this.style('alignment-baseline').toTextBaseline();
			if (textBaseline != null) ctx.textBaseline = textBaseline;
		}

		this.getBoundingBox = function () {
			var x = this.attribute('x').toPixels('x');
			var y = this.attribute('y').toPixels('y');
			var fontSize = this.parent.style('font-size').numValueOrDefault(svg.Font.Parse(svg.ctx.font).fontSize);
			return new svg.BoundingBox(x, y - fontSize, x + Math.floor(fontSize * 2.0 / 3.0) * this.children[0].getText().length, y);
		}

		this.renderChildren = function(ctx) {
			this.x = this.attribute('x').toPixels('x');
			this.y = this.attribute('y').toPixels('y');
			if (this.attribute('dx').hasValue()) this.x += this.attribute('dx').toPixels('x');
			if (this.attribute('dy').hasValue()) this.y += this.attribute('dy').toPixels('y');
			this.x += this.getAnchorDelta(ctx, this, 0);
			for (var i=0; i<this.children.length; i++) {
				this.renderChild(ctx, this, this, i);
			}
		}

		this.getAnchorDelta = function (ctx, parent, startI) {
			var textAnchor = this.style('text-anchor').valueOrDefault('start');
			if (textAnchor != 'start') {
				var width = 0;
				for (var i=startI; i<parent.children.length; i++) {
					var child = parent.children[i];
					if (i > startI && child.attribute('x').hasValue()) break; // new group
					width += child.measureTextRecursive(ctx);
				}
				return -1 * (textAnchor == 'end' ? width : width / 2.0);
			}
			return 0;
		}

		this.renderChild = function(ctx, textParent, parent, i) {
			var child = parent.children[i];
			if (child.attribute('x').hasValue()) {
				child.x = child.attribute('x').toPixels('x') + textParent.getAnchorDelta(ctx, parent, i);
				if (child.attribute('dx').hasValue()) child.x += child.attribute('dx').toPixels('x');
			}
			else {
				if (child.attribute('dx').hasValue()) textParent.x += child.attribute('dx').toPixels('x');
				child.x = textParent.x;
			}
			textParent.x = child.x + child.measureText(ctx);

			if (child.attribute('y').hasValue()) {
				child.y = child.attribute('y').toPixels('y');
				if (child.attribute('dy').hasValue()) child.y += child.attribute('dy').toPixels('y');
			}
			else {
				if (child.attribute('dy').hasValue()) textParent.y += child.attribute('dy').toPixels('y');
				child.y = textParent.y;
			}
			textParent.y = child.y;

			child.render(ctx);

			for (var i=0; i<child.children.length; i++) {
				textParent.renderChild(ctx, textParent, child, i);
			}
		}
	}
	svg.Element.text.prototype = new svg.Element.RenderedElementBase;

	// text base
	svg.Element.TextElementBase = function(node) {
		this.base = svg.Element.RenderedElementBase;
		this.base(node);

		this.getGlyph = function(font, text, i) {
			var c = text[i];
			var glyph = null;
			if (font.isArabic) {
				var arabicForm = 'isolated';
				if ((i==0 || text[i-1]==' ') && i<text.length-2 && text[i+1]!=' ') arabicForm = 'terminal';
				if (i>0 && text[i-1]!=' ' && i<text.length-2 && text[i+1]!=' ') arabicForm = 'medial';
				if (i>0 && text[i-1]!=' ' && (i == text.length-1 || text[i+1]==' ')) arabicForm = 'initial';
				if (typeof font.glyphs[c] != 'undefined') {
					glyph = font.glyphs[c][arabicForm];
					if (glyph == null && font.glyphs[c].type == 'glyph') glyph = font.glyphs[c];
				}
			}
			else {
				glyph = font.glyphs[c];
			}
			if (glyph == null) glyph = font.missingGlyph;
			return glyph;
		}

		this.renderChildren = function(ctx) {
			var customFont = this.parent.style('font-family').getDefinition();
			if (customFont != null) {
				var fontSize = this.parent.style('font-size').numValueOrDefault(svg.Font.Parse(svg.ctx.font).fontSize);
				var fontStyle = this.parent.style('font-style').valueOrDefault(svg.Font.Parse(svg.ctx.font).fontStyle);
				var text = this.getText();
				if (customFont.isRTL) text = text.split("").reverse().join("");

				var dx = svg.ToNumberArray(this.parent.attribute('dx').value);
				for (var i=0; i<text.length; i++) {
					var glyph = this.getGlyph(customFont, text, i);
					var scale = fontSize / customFont.fontFace.unitsPerEm;
					ctx.translate(this.x, this.y);
					ctx.scale(scale, -scale);
					var lw = ctx.lineWidth;
					ctx.lineWidth = ctx.lineWidth * customFont.fontFace.unitsPerEm / fontSize;
					if (fontStyle == 'italic') ctx.transform(1, 0, .4, 1, 0, 0);
					glyph.render(ctx);
					if (fontStyle == 'italic') ctx.transform(1, 0, -.4, 1, 0, 0);
					ctx.lineWidth = lw;
					ctx.scale(1/scale, -1/scale);
					ctx.translate(-this.x, -this.y);

					this.x += fontSize * (glyph.horizAdvX || customFont.horizAdvX) / customFont.fontFace.unitsPerEm;
					if (typeof dx[i] != 'undefined' && !isNaN(dx[i])) {
						this.x += dx[i];
					}
				}
				return;
			}

			if (ctx.fillStyle != '') ctx.fillText(svg.compressSpaces(this.getText()), this.x, this.y);
			if (ctx.strokeStyle != '') ctx.strokeText(svg.compressSpaces(this.getText()), this.x, this.y);
		}

		this.getText = function() {
			// OVERRIDE ME
		}

		this.measureTextRecursive = function(ctx) {
			var width = this.measureText(ctx);
			for (var i=0; i<this.children.length; i++) {
				width += this.children[i].measureTextRecursive(ctx);
			}
			return width;
		}

		this.measureText = function(ctx) {
			var customFont = this.parent.style('font-family').getDefinition();
			if (customFont != null) {
				var fontSize = this.parent.style('font-size').numValueOrDefault(svg.Font.Parse(svg.ctx.font).fontSize);
				var measure = 0;
				var text = this.getText();
				if (customFont.isRTL) text = text.split("").reverse().join("");
				var dx = svg.ToNumberArray(this.parent.attribute('dx').value);
				for (var i=0; i<text.length; i++) {
					var glyph = this.getGlyph(customFont, text, i);
					measure += (glyph.horizAdvX || customFont.horizAdvX) * fontSize / customFont.fontFace.unitsPerEm;
					if (typeof dx[i] != 'undefined' && !isNaN(dx[i])) {
						measure += dx[i];
					}
				}
				return measure;
			}

			var textToMeasure = svg.compressSpaces(this.getText());
			if (!ctx.measureText) return textToMeasure.length * 10;

			ctx.save();
			this.setContext(ctx);
			var width = ctx.measureText(textToMeasure).width;
			ctx.restore();
			return width;
		}
	}
	svg.Element.TextElementBase.prototype = new svg.Element.RenderedElementBase;

	// tspan
	svg.Element.tspan = function(node) {
		this.captureTextNodes = true;
		this.base = svg.Element.TextElementBase;
		this.base(node);

		this.text = svg.compressSpaces(node.value || node.text || node.textContent || '');
		this.getText = function() {
			// if this node has children, then they own the text
			if (this.children.length > 0) { return ''; }
			return this.text;
		}
	}
	svg.Element.tspan.prototype = new svg.Element.TextElementBase;

	// tref
	svg.Element.tref = function(node) {
		this.base = svg.Element.TextElementBase;
		this.base(node);

		this.getText = function() {
			var element = this.getHrefAttribute().getDefinition();
			if (element != null) return element.children[0].getText();
		}
	}
	svg.Element.tref.prototype = new svg.Element.TextElementBase;

	// a element
	svg.Element.a = function(node) {
		this.base = svg.Element.TextElementBase;
		this.base(node);

		this.hasText = node.childNodes.length > 0;
		for (var i=0; i<node.childNodes.length; i++) {
			if (node.childNodes[i].nodeType != 3) this.hasText = false;
		}

		// this might contain text
		this.text = this.hasText ? node.childNodes[0].value : '';
		this.getText = function() {
			return this.text;
		}

		this.baseRenderChildren = this.renderChildren;
		this.renderChildren = function(ctx) {
			if (this.hasText) {
				// render as text element
				this.baseRenderChildren(ctx);
				var fontSize = new svg.Property('fontSize', svg.Font.Parse(svg.ctx.font).fontSize);
				svg.Mouse.checkBoundingBox(this, new svg.BoundingBox(this.x, this.y - fontSize.toPixels('y'), this.x + this.measureText(ctx), this.y));
			}
			else if (this.children.length > 0) {
				// render as temporary group
				var g = new svg.Element.g();
				g.children = this.children;
				g.parent = this;
				g.render(ctx);
			}
		}

		this.onclick = function() {
			window.open(this.getHrefAttribute().value);
		}

		this.onmousemove = function() {
			svg.ctx.canvas.style.cursor = 'pointer';
		}
	}
	svg.Element.a.prototype = new svg.Element.TextElementBase;

	// image element
	svg.Element.image = function(node) {
		this.base = svg.Element.RenderedElementBase;
		this.base(node);

		var href = this.getHrefAttribute().value;
		if (href == '') { return; }
		var isSvg = href.match(/\.svg$/)

		svg.Images.push(this);
		this.loaded = false;
		if (!isSvg) {
			this.img = document.createElement('img');
			if (svg.opts['useCORS'] == true) { this.img.crossOrigin = 'Anonymous'; }
			var self = this;
			this.img.onload = function() { self.loaded = true; }
			this.img.onerror = function() { svg.log('ERROR: image "' + href + '" not found'); self.loaded = true; }
			this.img.src = href;
		}
		else {
			this.img = svg.ajax(href);
			this.loaded = true;
		}

		this.renderChildren = function(ctx) {
			var x = this.attribute('x').toPixels('x');
			var y = this.attribute('y').toPixels('y');

			var width = this.attribute('width').toPixels('x');
			var height = this.attribute('height').toPixels('y');
			if (width == 0 || height == 0) return;

			ctx.save();
			if (isSvg) {
				ctx.drawSvg(this.img, x, y, width, height);
			}
			else {
				ctx.translate(x, y);
				svg.AspectRatio(ctx,
								this.attribute('preserveAspectRatio').value,
								width,
								this.img.width,
								height,
								this.img.height,
								0,
								0);
				ctx.drawImage(this.img, 0, 0);
			}
			ctx.restore();
		}

		this.getBoundingBox = function() {
			var x = this.attribute('x').toPixels('x');
			var y = this.attribute('y').toPixels('y');
			var width = this.attribute('width').toPixels('x');
			var height = this.attribute('height').toPixels('y');
			return new svg.BoundingBox(x, y, x + width, y + height);
		}
	}
	svg.Element.image.prototype = new svg.Element.RenderedElementBase;

	// group element
	svg.Element.g = function(node) {
		this.base = svg.Element.RenderedElementBase;
		this.base(node);

		this.getBoundingBox = function() {
			var bb = new svg.BoundingBox();
			for (var i=0; i<this.children.length; i++) {
				bb.addBoundingBox(this.children[i].getBoundingBox());
			}
			return bb;
		};
	}
	svg.Element.g.prototype = new svg.Element.RenderedElementBase;

	// symbol element
	svg.Element.symbol = function(node) {
		this.base = svg.Element.RenderedElementBase;
		this.base(node);

		this.render = function(ctx) {
			// NO RENDER
		};
	}
	svg.Element.symbol.prototype = new svg.Element.RenderedElementBase;

	// style element
	svg.Element.style = function(node) {
		this.base = svg.Element.ElementBase;
		this.base(node);

		// text, or spaces then CDATA
		var css = ''
		for (var i=0; i<node.childNodes.length; i++) {
		  css += node.childNodes[i].data;
		}
		css = css.replace(/(\/\*([^*]|[\r\n]|(\*+([^*\/]|[\r\n])))*\*+\/)|(^[\s]*\/\/.*)/gm, ''); // remove comments
		css = svg.compressSpaces(css); // replace whitespace
		var cssDefs = css.split('}');
		for (var i=0; i<cssDefs.length; i++) {
			if (svg.trim(cssDefs[i]) != '') {
				var cssDef = cssDefs[i].split('{');
				var cssClasses = cssDef[0].split(',');
				var cssProps = cssDef[1].split(';');
				for (var j=0; j<cssClasses.length; j++) {
					var cssClass = svg.trim(cssClasses[j]);
					if (cssClass != '') {
						var props = svg.Styles[cssClass] || {};
						for (var k=0; k<cssProps.length; k++) {
							var prop = cssProps[k].indexOf(':');
							var name = cssProps[k].substr(0, prop);
							var value = cssProps[k].substr(prop + 1, cssProps[k].length - prop);
							if (name != null && value != null) {
								props[svg.trim(name)] = new svg.Property(svg.trim(name), svg.trim(value));
							}
						}
						svg.Styles[cssClass] = props;
						svg.StylesSpecificity[cssClass] = getSelectorSpecificity(cssClass);
						if (cssClass == '@font-face') {
							var fontFamily = props['font-family'].value.replace(/"/g,'');
							var srcs = props['src'].value.split(',');
							for (var s=0; s<srcs.length; s++) {
								if (srcs[s].indexOf('format("svg")') > 0) {
									var urlStart = srcs[s].indexOf('url');
									var urlEnd = srcs[s].indexOf(')', urlStart);
									var url = srcs[s].substr(urlStart + 5, urlEnd - urlStart - 6);
									var doc = svg.parseXml(svg.ajax(url));
									var fonts = doc.getElementsByTagName('font');
									for (var f=0; f<fonts.length; f++) {
										var font = svg.CreateElement(fonts[f]);
										svg.Definitions[fontFamily] = font;
									}
								}
							}
						}
					}
				}
			}
		}
	}
	svg.Element.style.prototype = new svg.Element.ElementBase;

	// use element
	svg.Element.use = function(node) {
		this.base = svg.Element.RenderedElementBase;
		this.base(node);

		this.baseSetContext = this.setContext;
		this.setContext = function(ctx) {
			this.baseSetContext(ctx);
			if (this.attribute('x').hasValue()) ctx.translate(this.attribute('x').toPixels('x'), 0);
			if (this.attribute('y').hasValue()) ctx.translate(0, this.attribute('y').toPixels('y'));
		}

		var element = this.getHrefAttribute().getDefinition();

		this.path = function(ctx) {
			if (element != null) element.path(ctx);
		}

		this.getBoundingBox = function() {
			if (element != null) return element.getBoundingBox();
		}

		this.renderChildren = function(ctx) {
			if (element != null) {
				var tempSvg = element;
				if (element.type == 'symbol') {
					// render me using a temporary svg element in symbol cases (http://www.w3.org/TR/SVG/struct.html#UseElement)
					tempSvg = new svg.Element.svg();
					tempSvg.type = 'svg';
					tempSvg.attributes['viewBox'] = new svg.Property('viewBox', element.attribute('viewBox').value);
					tempSvg.attributes['preserveAspectRatio'] = new svg.Property('preserveAspectRatio', element.attribute('preserveAspectRatio').value);
					tempSvg.attributes['overflow'] = new svg.Property('overflow', element.attribute('overflow').value);
					tempSvg.children = element.children;
				}
				if (tempSvg.type == 'svg') {
					// if symbol or svg, inherit width/height from me
					if (this.attribute('width').hasValue()) tempSvg.attributes['width'] = new svg.Property('width', this.attribute('width').value);
					if (this.attribute('height').hasValue()) tempSvg.attributes['height'] = new svg.Property('height', this.attribute('height').value);
				}
				var oldParent = tempSvg.parent;
				tempSvg.parent = null;
				tempSvg.render(ctx);
				tempSvg.parent = oldParent;
			}
		}
	}
	svg.Element.use.prototype = new svg.Element.RenderedElementBase;

	// mask element
	svg.Element.mask = function(node) {
		this.base = svg.Element.ElementBase;
		this.base(node);

		this.apply = function(ctx, element) {
			// render as temp svg
			var x = this.attribute('x').toPixels('x');
			var y = this.attribute('y').toPixels('y');
			var width = this.attribute('width').toPixels('x');
			var height = this.attribute('height').toPixels('y');

			if (width == 0 && height == 0) {
				var bb = new svg.BoundingBox();
				for (var i=0; i<this.children.length; i++) {
					bb.addBoundingBox(this.children[i].getBoundingBox());
				}
				var x = Math.floor(bb.x1);
				var y = Math.floor(bb.y1);
				var width = Math.floor(bb.width());
				var	height = Math.floor(bb.height());
			}

			// temporarily remove mask to avoid recursion
			var mask = element.attribute('mask').value;
			element.attribute('mask').value = '';

				var cMask = document.createElement('canvas');
				cMask.width = x + width;
				cMask.height = y + height;
				var maskCtx = cMask.getContext('2d');
				this.renderChildren(maskCtx);

				var c = document.createElement('canvas');
				c.width = x + width;
				c.height = y + height;
				var tempCtx = c.getContext('2d');
				element.render(tempCtx);
				tempCtx.globalCompositeOperation = 'destination-in';
				tempCtx.fillStyle = maskCtx.createPattern(cMask, 'no-repeat');
				tempCtx.fillRect(0, 0, x + width, y + height);

				ctx.fillStyle = tempCtx.createPattern(c, 'no-repeat');
				ctx.fillRect(0, 0, x + width, y + height);

			// reassign mask
			element.attribute('mask').value = mask;
		}

		this.render = function(ctx) {
			// NO RENDER
		}
	}
	svg.Element.mask.prototype = new svg.Element.ElementBase;

	// clip element
	svg.Element.clipPath = function(node) {
		this.base = svg.Element.ElementBase;
		this.base(node);

		this.apply = function(ctx) {
			var oldBeginPath = CanvasRenderingContext2D.prototype.beginPath;
			CanvasRenderingContext2D.prototype.beginPath = function () { };

			var oldClosePath = CanvasRenderingContext2D.prototype.closePath;
			CanvasRenderingContext2D.prototype.closePath = function () { };

			oldBeginPath.call(ctx);
			for (var i=0; i<this.children.length; i++) {
				var child = this.children[i];
				if (typeof child.path != 'undefined') {
					var transform = null;
					if (child.style('transform', false, true).hasValue()) {
						transform = new svg.Transform(child.style('transform', false, true).value);
						transform.apply(ctx);
					}
					child.path(ctx);
					CanvasRenderingContext2D.prototype.closePath = oldClosePath;
					if (transform) { transform.unapply(ctx); }
				}
			}
			oldClosePath.call(ctx);
			ctx.clip();

			CanvasRenderingContext2D.prototype.beginPath = oldBeginPath;
			CanvasRenderingContext2D.prototype.closePath = oldClosePath;
		}

		this.render = function(ctx) {
			// NO RENDER
		}
	}
	svg.Element.clipPath.prototype = new svg.Element.ElementBase;

	// filters
	svg.Element.filter = function(node) {
		this.base = svg.Element.ElementBase;
		this.base(node);

		this.apply = function(ctx, element) {
			// render as temp svg
			var bb = element.getBoundingBox();
			var x = Math.floor(bb.x1);
			var y = Math.floor(bb.y1);
			var width = Math.floor(bb.width());
			var	height = Math.floor(bb.height());

			// temporarily remove filter to avoid recursion
			var filter = element.style('filter').value;
			element.style('filter').value = '';

			var px = 0, py = 0;
			for (var i=0; i<this.children.length; i++) {
				var efd = this.children[i].extraFilterDistance || 0;
				px = Math.max(px, efd);
				py = Math.max(py, efd);
			}

			var c = document.createElement('canvas');
			c.width = width + 2*px;
			c.height = height + 2*py;
			var tempCtx = c.getContext('2d');
			tempCtx.translate(-x + px, -y + py);
			element.render(tempCtx);

			// apply filters
			for (var i=0; i<this.children.length; i++) {
				if (typeof this.children[i].apply == 'function') {
					this.children[i].apply(tempCtx, 0, 0, width + 2*px, height + 2*py);
				}
			}

			// render on me
			ctx.drawImage(c, 0, 0, width + 2*px, height + 2*py, x - px, y - py, width + 2*px, height + 2*py);

			// reassign filter
			element.style('filter', true).value = filter;
		}

		this.render = function(ctx) {
			// NO RENDER
		}
	}
	svg.Element.filter.prototype = new svg.Element.ElementBase;

	svg.Element.feMorphology = function(node) {
		this.base = svg.Element.ElementBase;
		this.base(node);

		this.apply = function(ctx, x, y, width, height) {
			// TODO: implement
		}
	}
	svg.Element.feMorphology.prototype = new svg.Element.ElementBase;

	svg.Element.feComposite = function(node) {
		this.base = svg.Element.ElementBase;
		this.base(node);

		this.apply = function(ctx, x, y, width, height) {
			// TODO: implement
		}
	}
	svg.Element.feComposite.prototype = new svg.Element.ElementBase;

	svg.Element.feColorMatrix = function(node) {
		this.base = svg.Element.ElementBase;
		this.base(node);

		var matrix = svg.ToNumberArray(this.attribute('values').value);
		switch (this.attribute('type').valueOrDefault('matrix')) { // http://www.w3.org/TR/SVG/filters.html#feColorMatrixElement
			case 'saturate':
				var s = matrix[0];
				matrix = [0.213+0.787*s,0.715-0.715*s,0.072-0.072*s,0,0,
						  0.213-0.213*s,0.715+0.285*s,0.072-0.072*s,0,0,
						  0.213-0.213*s,0.715-0.715*s,0.072+0.928*s,0,0,
						  0,0,0,1,0,
						  0,0,0,0,1];
				break;
			case 'hueRotate':
				var a = matrix[0] * Math.PI / 180.0;
				var c = function (m1,m2,m3) { return m1 + Math.cos(a)*m2 + Math.sin(a)*m3; };
				matrix = [c(0.213,0.787,-0.213),c(0.715,-0.715,-0.715),c(0.072,-0.072,0.928),0,0,
						  c(0.213,-0.213,0.143),c(0.715,0.285,0.140),c(0.072,-0.072,-0.283),0,0,
						  c(0.213,-0.213,-0.787),c(0.715,-0.715,0.715),c(0.072,0.928,0.072),0,0,
						  0,0,0,1,0,
						  0,0,0,0,1];
				break;
			case 'luminanceToAlpha':
				matrix = [0,0,0,0,0,
						  0,0,0,0,0,
						  0,0,0,0,0,
						  0.2125,0.7154,0.0721,0,0,
						  0,0,0,0,1];
				break;
		}

		function imGet(img, x, y, width, height, rgba) {
			return img[y*width*4 + x*4 + rgba];
		}

		function imSet(img, x, y, width, height, rgba, val) {
			img[y*width*4 + x*4 + rgba] = val;
		}

		function m(i, v) {
			var mi = matrix[i];
			return mi * (mi < 0 ? v - 255 : v);
		}

		this.apply = function(ctx, x, y, width, height) {
			// assuming x==0 && y==0 for now
			var srcData = ctx.getImageData(0, 0, width, height);
			for (var y = 0; y < height; y++) {
				for (var x = 0; x < width; x++) {
					var r = imGet(srcData.data, x, y, width, height, 0);
					var g = imGet(srcData.data, x, y, width, height, 1);
					var b = imGet(srcData.data, x, y, width, height, 2);
					var a = imGet(srcData.data, x, y, width, height, 3);
					imSet(srcData.data, x, y, width, height, 0, m(0,r)+m(1,g)+m(2,b)+m(3,a)+m(4,1));
					imSet(srcData.data, x, y, width, height, 1, m(5,r)+m(6,g)+m(7,b)+m(8,a)+m(9,1));
					imSet(srcData.data, x, y, width, height, 2, m(10,r)+m(11,g)+m(12,b)+m(13,a)+m(14,1));
					imSet(srcData.data, x, y, width, height, 3, m(15,r)+m(16,g)+m(17,b)+m(18,a)+m(19,1));
				}
			}
			ctx.clearRect(0, 0, width, height);
			ctx.putImageData(srcData, 0, 0);
		}
	}
	svg.Element.feColorMatrix.prototype = new svg.Element.ElementBase;

	svg.Element.feGaussianBlur = function(node) {
		this.base = svg.Element.ElementBase;
		this.base(node);

		this.blurRadius = Math.floor(this.attribute('stdDeviation').numValue());
		this.extraFilterDistance = this.blurRadius;

		this.apply = function(ctx, x, y, width, height) {
			if (typeof stackblur.canvasRGBA == 'undefined') {
				svg.log('ERROR: StackBlur.js must be included for blur to work');
				return;
			}

			// StackBlur requires canvas be on document
			ctx.canvas.id = svg.UniqueId();
			ctx.canvas.style.display = 'none';
			document.body.appendChild(ctx.canvas);
			stackblur.canvasRGBA(ctx.canvas.id, x, y, width, height, this.blurRadius);
			document.body.removeChild(ctx.canvas);
		}
	}
	svg.Element.feGaussianBlur.prototype = new svg.Element.ElementBase;

	// title element, do nothing
	svg.Element.title = function(node) {
	}
	svg.Element.title.prototype = new svg.Element.ElementBase;

	// desc element, do nothing
	svg.Element.desc = function(node) {
	}
	svg.Element.desc.prototype = new svg.Element.ElementBase;

	svg.Element.MISSING = function(node) {
		svg.log('ERROR: Element \'' + node.nodeName + '\' not yet implemented.');
	}
	svg.Element.MISSING.prototype = new svg.Element.ElementBase;

	// element factory
	svg.CreateElement = function(node) {
		var className = node.nodeName.replace(/^[^:]+:/,''); // remove namespace
		className = className.replace(/\-/g,''); // remove dashes
		var e = null;
		if (typeof svg.Element[className] != 'undefined') {
			e = new svg.Element[className](node);
		}
		else {
			e = new svg.Element.MISSING(node);
		}

		e.type = node.nodeName;
		return e;
	}

	// load from url
	svg.load = function(ctx, url) {
		svg.loadXml(ctx, svg.ajax(url));
	}

	// load from xml
	svg.loadXml = function(ctx, xml) {
		svg.loadXmlDoc(ctx, svg.parseXml(xml));
	}

	svg.loadXmlDoc = function(ctx, dom) {
		svg.init(ctx);

		var mapXY = function(p) {
			var e = ctx.canvas;
			while (e) {
				p.x -= e.offsetLeft;
				p.y -= e.offsetTop;
				e = e.offsetParent;
			}
			if (window.scrollX) p.x += window.scrollX;
			if (window.scrollY) p.y += window.scrollY;
			return p;
		}

		// bind mouse
		if (svg.opts['ignoreMouse'] != true) {
			ctx.canvas.onclick = function(e) {
				var p = mapXY(new svg.Point(e != null ? e.clientX : event.clientX, e != null ? e.clientY : event.clientY));
				svg.Mouse.onclick(p.x, p.y);
			};
			ctx.canvas.onmousemove = function(e) {
				var p = mapXY(new svg.Point(e != null ? e.clientX : event.clientX, e != null ? e.clientY : event.clientY));
				svg.Mouse.onmousemove(p.x, p.y);
			};
		}

		var e = svg.CreateElement(dom.documentElement);
		e.root = true;
		e.addStylesFromStyleDefinition();

		// render loop
		var isFirstRender = true;
		var draw = function() {
			svg.ViewPort.Clear();
			if (ctx.canvas.parentNode) svg.ViewPort.SetCurrent(ctx.canvas.parentNode.clientWidth, ctx.canvas.parentNode.clientHeight);

			if (svg.opts['ignoreDimensions'] != true) {
				// set canvas size
				if (e.style('width').hasValue()) {
					ctx.canvas.width = e.style('width').toPixels('x');
					ctx.canvas.style.width = ctx.canvas.width + 'px';
				}
				if (e.style('height').hasValue()) {
					ctx.canvas.height = e.style('height').toPixels('y');
					ctx.canvas.style.height = ctx.canvas.height + 'px';
				}
			}
			var cWidth = ctx.canvas.clientWidth || ctx.canvas.width;
			var cHeight = ctx.canvas.clientHeight || ctx.canvas.height;
			if (svg.opts['ignoreDimensions'] == true && e.style('width').hasValue() && e.style('height').hasValue()) {
				cWidth = e.style('width').toPixels('x');
				cHeight = e.style('height').toPixels('y');
			}
			svg.ViewPort.SetCurrent(cWidth, cHeight);

			if (svg.opts['offsetX'] != null) e.attribute('x', true).value = svg.opts['offsetX'];
			if (svg.opts['offsetY'] != null) e.attribute('y', true).value = svg.opts['offsetY'];
			if (svg.opts['scaleWidth'] != null || svg.opts['scaleHeight'] != null) {
				var xRatio = null, yRatio = null, viewBox = svg.ToNumberArray(e.attribute('viewBox').value);

				if (svg.opts['scaleWidth'] != null) {
					if (e.attribute('width').hasValue()) xRatio = e.attribute('width').toPixels('x') / svg.opts['scaleWidth'];
					else if (!isNaN(viewBox[2])) xRatio = viewBox[2] / svg.opts['scaleWidth'];
				}

				if (svg.opts['scaleHeight'] != null) {
					if (e.attribute('height').hasValue()) yRatio = e.attribute('height').toPixels('y') / svg.opts['scaleHeight'];
					else if (!isNaN(viewBox[3])) yRatio = viewBox[3] / svg.opts['scaleHeight'];
				}

				if (xRatio == null) { xRatio = yRatio; }
				if (yRatio == null) { yRatio = xRatio; }

				e.attribute('width', true).value = svg.opts['scaleWidth'];
				e.attribute('height', true).value = svg.opts['scaleHeight'];
				e.style('transform', true, true).value += ' scale('+(1.0/xRatio)+','+(1.0/yRatio)+')';
			}

			// clear and render
			if (svg.opts['ignoreClear'] != true) {
				ctx.clearRect(0, 0, cWidth, cHeight);
			}
			e.render(ctx);
			if (isFirstRender) {
				isFirstRender = false;
				if (typeof svg.opts['renderCallback'] == 'function') svg.opts['renderCallback'](dom);
			}
		}

		var waitingForImages = true;
		if (svg.ImagesLoaded()) {
			waitingForImages = false;
			draw();
		}
		svg.intervalID = setInterval(function() {
			var needUpdate = false;

			if (waitingForImages && svg.ImagesLoaded()) {
				waitingForImages = false;
				needUpdate = true;
			}

			// need update from mouse events?
			if (svg.opts['ignoreMouse'] != true) {
				needUpdate = needUpdate | svg.Mouse.hasEvents();
			}

			// need update from animations?
			if (svg.opts['ignoreAnimation'] != true) {
				for (var i=0; i<svg.Animations.length; i++) {
					needUpdate = needUpdate | svg.Animations[i].update(1000 / svg.FRAMERATE);
				}
			}

			// need update from redraw?
			if (typeof svg.opts['forceRedraw'] == 'function') {
				if (svg.opts['forceRedraw']() == true) needUpdate = true;
			}

			// render if needed
			if (needUpdate) {
				draw();
				svg.Mouse.runEvents(); // run and clear our events
			}
		}, 1000 / svg.FRAMERATE);
	}

	svg.stop = function() {
		if (svg.intervalID) {
			clearInterval(svg.intervalID);
		}
	}

	svg.Mouse = new (function() {
		this.events = [];
		this.hasEvents = function() { return this.events.length != 0; }

		this.onclick = function(x, y) {
			this.events.push({ type: 'onclick', x: x, y: y,
				run: function(e) { if (e.onclick) e.onclick(); }
			});
		}

		this.onmousemove = function(x, y) {
			this.events.push({ type: 'onmousemove', x: x, y: y,
				run: function(e) { if (e.onmousemove) e.onmousemove(); }
			});
		}

		this.eventElements = [];

		this.checkPath = function(element, ctx) {
			for (var i=0; i<this.events.length; i++) {
				var e = this.events[i];
				if (ctx.isPointInPath && ctx.isPointInPath(e.x, e.y)) this.eventElements[i] = element;
			}
		}

		this.checkBoundingBox = function(element, bb) {
			for (var i=0; i<this.events.length; i++) {
				var e = this.events[i];
				if (bb.isPointInBox(e.x, e.y)) this.eventElements[i] = element;
			}
		}

		this.runEvents = function() {
			svg.ctx.canvas.style.cursor = '';

			for (var i=0; i<this.events.length; i++) {
				var e = this.events[i];
				var element = this.eventElements[i];
				while (element) {
					e.run(element);
					element = element.parent;
				}
			}

			// done running, clear
			this.events = [];
			this.eventElements = [];
		}
	});

	return svg;
};

module.exports = canvg;


/***/ }),

/***/ "./node_modules/css-loader/dist/cjs.js?!./node_modules/sass-loader/dist/cjs.js?!./src/scss/style.scss":
/*!******************************************************************************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js??ref--5-1!./node_modules/sass-loader/dist/cjs.js??ref--5-2!./src/scss/style.scss ***!
  \******************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(/*! ../../node_modules/css-loader/dist/runtime/api.js */ "./node_modules/css-loader/dist/runtime/api.js")(true);
// Module
exports.push([module.i, "* {\n  box-sizing: border-box; /* final rescue */\n}\n\ncode {\n  font-family: consolas;\n}\n\n.big {\n  font-size: 32px;\n}\n\n.lambda {\n  color: gray;\n  font-style: italic;\n}\n\n.highlighted {\n  background-color: yellow;\n}\n\nspan.gsymbol {\n  font-weight: bold;\n}\nspan.gsymbol.lambda {\n  color: gray;\n  font-style: italic;\n}\nspan.gsymbol.terminal.end-symbol {\n  color: red;\n}\nspan.gsymbol.terminal.unknown {\n  font-weight: normal;\n  font-style: italic;\n  color: gray;\n}\nspan.gsymbol.non-terminal {\n  color: blue;\n}\nspan.gsymbol.non-terminal.augmenting-symbol {\n  color: orange;\n}\nspan.gsymbol.non-terminal.start-symbol {\n  color: skyblue;\n}\nspan.gsymbol.non-terminal.nullable {\n  font-style: italic;\n}\nspan.comma {\n  color: gray;\n  font-style: italic;\n}\n\ntable {\n  border: 1px solid black;\n  border-collapse: collapse;\n  overflow: hidden;\n}\ntable.compact-table th, table.compact-table td {\n  padding: 2px 6px;\n  text-align: left;\n}\ntable.hoverable tr:hover {\n  background-color: lightgray;\n}\ntable th {\n  border: 1px solid black;\n  padding: 10px 10px;\n  text-align: left;\n  background-color: #4CAF50;\n  color: white;\n}\ntable td {\n  border: 1px solid black;\n  padding: 10px 10px;\n  text-align: left;\n}\ntable td.b {\n  background-color: blue;\n  color: white;\n}\ntable td.b *, table td.b .non-terminal {\n  color: white;\n}\ntable td.conflict {\n  background-color: orange;\n}\ntable td.diagonalFalling {\n  background-image: linear-gradient(to right top, blue calc(50% - 1px), black, #4CAF50 calc(50% + 1px));\n}\ntable td.unfinished {\n  background-image: linear-gradient(to right bottom, white calc(50% - 1px), black, white calc(50% + 1px));\n}\n\n/* Style the list */\nul.tab {\n  list-style-type: none;\n  margin: 0;\n  padding: 0;\n  overflow: auto;\n  border: 1px solid #ccc;\n  background-color: #f1f1f1;\n  /* Float the list items side by side */\n}\nul.tab li {\n  float: left;\n  /* Style the links inside the list items */\n}\nul.tab li a {\n  display: inline-block;\n  color: black;\n  text-align: center;\n  padding: 14px 16px;\n  text-decoration: none;\n  transition: 0.3s;\n  font-size: 17px;\n  /* Change background color of links on hover */\n  /* Create an active/current tablink class */\n}\nul.tab li a:hover {\n  background-color: #ddd;\n}\nul.tab li a:focus, ul.tab li a.active {\n  background-color: #ccc;\n}\n\n/* Style the tab content */\ndiv.tabcontent {\n  width: 100%;\n  /*overflow: scroll;*/\n  display: none;\n  padding: 12px 12px;\n  border: 1px solid #ccc;\n  border-top: none;\n}", "",{"version":3,"sources":["/home/travis/build/zetaraku/ParserBase/src/scss/style.scss","style.scss"],"names":[],"mappings":"AAAA;EACC,sBAAA,EAAA,iBAAA;ACCD;;ADEA;EACC,qBAAA;ACCD;;ADEA;EACC,eAAA;ACCD;;ADCA;EACC,WAAA;EACA,kBAAA;ACED;;ADAA;EACC,wBAAA;ACGD;;ADCC;EACC,iBAAA;ACEF;ADDE;EACC,WAAA;EACA,kBAAA;ACGH;ADAG;EACC,UAAA;ACEJ;ADAG;EACC,mBAAA;EACA,kBAAA;EACA,WAAA;ACEJ;ADCE;EACC,WAAA;ACCH;ADAG;EACC,aAAA;ACEJ;ADAG;EACC,cAAA;ACEJ;ADAG;EACC,kBAAA;ACEJ;ADEC;EACC,WAAA;EACA,kBAAA;ACAF;;ADIA;EACC,uBAAA;EACA,yBAAA;EACA,gBAAA;ACDD;ADGE;EACC,gBAAA;EACA,gBAAA;ACDH;ADKE;EACC,2BAAA;ACHH;ADMC;EACC,uBAAA;EACA,kBAAA;EACA,gBAAA;EACA,yBAAA;EACA,YAAA;ACJF;ADMC;EACC,uBAAA;EACA,kBAAA;EACA,gBAAA;ACJF;ADKE;EACC,sBAAA;EACA,YAAA;ACHH;ADIG;EACC,YAAA;ACFJ;ADKE;EACC,wBAAA;ACHH;ADKE;EACC,qGAAA;ACHH;ADUE;EACC,uGAAA;ACRH;;ADkBA,mBAAA;AACA;EACC,qBAAA;EACA,SAAA;EACA,UAAA;EACA,cAAA;EACA,sBAAA;EACA,yBAAA;EACA,sCAAA;ACfD;ADgBC;EACC,WAAA;EACA,0CAAA;ACdF;ADeE;EACC,qBAAA;EACA,YAAA;EACA,kBAAA;EACA,kBAAA;EACA,qBAAA;EACA,gBAAA;EACA,eAAA;EACA,8CAAA;EAIA,2CAAA;AChBH;ADaG;EACC,sBAAA;ACXJ;ADcG;EACC,sBAAA;ACZJ;;ADiBA,0BAAA;AACA;EACC,WAAA;EACA,oBAAA;EACA,aAAA;EACA,kBAAA;EACA,sBAAA;EACA,gBAAA;ACdD","file":"style.scss","sourcesContent":["* {\n\tbox-sizing: border-box; /* final rescue */\n}\n\ncode {\n\tfont-family: consolas;\n}\n\n.big {\n\tfont-size: 32px;\n}\n.lambda {\n\tcolor: gray;\n\tfont-style: italic;\n}\n.highlighted {\n\tbackground-color: yellow;\n}\n\nspan {\n\t&.gsymbol {\n\t\tfont-weight: bold;\n\t\t&.lambda {\n\t\t\tcolor: gray;\n\t\t\tfont-style: italic;\n\t\t}\n\t\t&.terminal {\n\t\t\t&.end-symbol {\n\t\t\t\tcolor: red;\n\t\t\t}\n\t\t\t&.unknown {\n\t\t\t\tfont-weight: normal;\n\t\t\t\tfont-style: italic;\n\t\t\t\tcolor: gray;\n\t\t\t}\n\t\t}\n\t\t&.non-terminal {\n\t\t\tcolor: blue;\n\t\t\t&.augmenting-symbol {\n\t\t\t\tcolor: orange;\n\t\t\t}\n\t\t\t&.start-symbol {\n\t\t\t\tcolor: skyblue;\n\t\t\t}\n\t\t\t&.nullable {\n\t\t\t\tfont-style: italic;\n\t\t\t}\n\t\t}\n\t}\n\t&.comma {\n\t\tcolor: gray;\n\t\tfont-style: italic;\n\t}\n}\n\ntable {\n\tborder: 1px solid black;\n\tborder-collapse: collapse;\n\toverflow: hidden;\n\t&.compact-table {\n\t\tth, td {\n\t\t\tpadding: 2px 6px;\n\t\t\ttext-align: left;\n\t\t}\n\t}\n\t&.hoverable {\n\t\ttr:hover {\n\t\t\tbackground-color: lightgray;\n\t\t}\n\t}\n\tth {\n\t\tborder: 1px solid black;\n\t\tpadding: 10px 10px;\n\t\ttext-align: left;\n\t\tbackground-color: #4CAF50;\n\t\tcolor: white;\n\t}\n\ttd {\n\t\tborder: 1px solid black;\n\t\tpadding: 10px 10px;\n\t\ttext-align: left;\n\t\t&.b {\n\t\t\tbackground-color: blue;\n\t\t\tcolor: white;\n\t\t\t*, .non-terminal {\n\t\t\t\tcolor: white;\n\t\t\t}\n\t\t}\n\t\t&.conflict {\n\t\t\tbackground-color: orange;\n\t\t}\n\t\t&.diagonalFalling {\n\t\t\tbackground-image: linear-gradient(\n\t\t\t\tto right top,\n\t\t\t\tblue calc(50% - 1px),\n\t\t\t\tblack,\n\t\t\t\t#4CAF50 calc(50% + 1px)\n\t\t\t);\n\t\t}\n\t\t&.unfinished {\n\t\t\tbackground-image: linear-gradient(\n\t\t\t\tto right bottom,\n\t\t\t\twhite calc(50% - 1px),\n\t\t\t\tblack,\n\t\t\t\twhite calc(50% + 1px)\n\t\t\t);\n\t\t}\n\t}\n}\n\n/* Style the list */\nul.tab {\n\tlist-style-type: none;\n\tmargin: 0;\n\tpadding: 0;\n\toverflow: auto;\n\tborder: 1px solid #ccc;\n\tbackground-color: #f1f1f1;\n\t/* Float the list items side by side */\n\tli {\n\t\tfloat: left;\n\t\t/* Style the links inside the list items */\n\t\ta {\n\t\t\tdisplay: inline-block;\n\t\t\tcolor: black;\n\t\t\ttext-align: center;\n\t\t\tpadding: 14px 16px;\n\t\t\ttext-decoration: none;\n\t\t\ttransition: 0.3s;\n\t\t\tfont-size: 17px;\n\t\t\t/* Change background color of links on hover */\n\t\t\t&:hover {\n\t\t\t\tbackground-color: #ddd;\n\t\t\t}\n\t\t\t/* Create an active/current tablink class */\n\t\t\t&:focus, &.active {\n\t\t\t\tbackground-color: #ccc;\n\t\t\t}\n\t\t}\n\t}\n}\n/* Style the tab content */\ndiv.tabcontent {\n\twidth: 100%;\n\t/*overflow: scroll;*/\n\tdisplay: none;\n\tpadding: 12px 12px;\n\tborder: 1px solid #ccc;\n\tborder-top: none;\n}\n","* {\n  box-sizing: border-box; /* final rescue */\n}\n\ncode {\n  font-family: consolas;\n}\n\n.big {\n  font-size: 32px;\n}\n\n.lambda {\n  color: gray;\n  font-style: italic;\n}\n\n.highlighted {\n  background-color: yellow;\n}\n\nspan.gsymbol {\n  font-weight: bold;\n}\nspan.gsymbol.lambda {\n  color: gray;\n  font-style: italic;\n}\nspan.gsymbol.terminal.end-symbol {\n  color: red;\n}\nspan.gsymbol.terminal.unknown {\n  font-weight: normal;\n  font-style: italic;\n  color: gray;\n}\nspan.gsymbol.non-terminal {\n  color: blue;\n}\nspan.gsymbol.non-terminal.augmenting-symbol {\n  color: orange;\n}\nspan.gsymbol.non-terminal.start-symbol {\n  color: skyblue;\n}\nspan.gsymbol.non-terminal.nullable {\n  font-style: italic;\n}\nspan.comma {\n  color: gray;\n  font-style: italic;\n}\n\ntable {\n  border: 1px solid black;\n  border-collapse: collapse;\n  overflow: hidden;\n}\ntable.compact-table th, table.compact-table td {\n  padding: 2px 6px;\n  text-align: left;\n}\ntable.hoverable tr:hover {\n  background-color: lightgray;\n}\ntable th {\n  border: 1px solid black;\n  padding: 10px 10px;\n  text-align: left;\n  background-color: #4CAF50;\n  color: white;\n}\ntable td {\n  border: 1px solid black;\n  padding: 10px 10px;\n  text-align: left;\n}\ntable td.b {\n  background-color: blue;\n  color: white;\n}\ntable td.b *, table td.b .non-terminal {\n  color: white;\n}\ntable td.conflict {\n  background-color: orange;\n}\ntable td.diagonalFalling {\n  background-image: linear-gradient(to right top, blue calc(50% - 1px), black, #4CAF50 calc(50% + 1px));\n}\ntable td.unfinished {\n  background-image: linear-gradient(to right bottom, white calc(50% - 1px), black, white calc(50% + 1px));\n}\n\n/* Style the list */\nul.tab {\n  list-style-type: none;\n  margin: 0;\n  padding: 0;\n  overflow: auto;\n  border: 1px solid #ccc;\n  background-color: #f1f1f1;\n  /* Float the list items side by side */\n}\nul.tab li {\n  float: left;\n  /* Style the links inside the list items */\n}\nul.tab li a {\n  display: inline-block;\n  color: black;\n  text-align: center;\n  padding: 14px 16px;\n  text-decoration: none;\n  transition: 0.3s;\n  font-size: 17px;\n  /* Change background color of links on hover */\n  /* Create an active/current tablink class */\n}\nul.tab li a:hover {\n  background-color: #ddd;\n}\nul.tab li a:focus, ul.tab li a.active {\n  background-color: #ccc;\n}\n\n/* Style the tab content */\ndiv.tabcontent {\n  width: 100%;\n  /*overflow: scroll;*/\n  display: none;\n  padding: 12px 12px;\n  border: 1px solid #ccc;\n  border-top: none;\n}"]}]);



/***/ }),

/***/ "./node_modules/css-loader/dist/runtime/api.js":
/*!*****************************************************!*\
  !*** ./node_modules/css-loader/dist/runtime/api.js ***!
  \*****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/*
  MIT License http://www.opensource.org/licenses/mit-license.php
  Author Tobias Koppers @sokra
*/
// css base code, injected by the css-loader
module.exports = function (useSourceMap) {
  var list = []; // return the list of modules as css string

  list.toString = function toString() {
    return this.map(function (item) {
      var content = cssWithMappingToString(item, useSourceMap);

      if (item[2]) {
        return '@media ' + item[2] + '{' + content + '}';
      } else {
        return content;
      }
    }).join('');
  }; // import a list of modules into the list


  list.i = function (modules, mediaQuery) {
    if (typeof modules === 'string') {
      modules = [[null, modules, '']];
    }

    var alreadyImportedModules = {};

    for (var i = 0; i < this.length; i++) {
      var id = this[i][0];

      if (id != null) {
        alreadyImportedModules[id] = true;
      }
    }

    for (i = 0; i < modules.length; i++) {
      var item = modules[i]; // skip already imported module
      // this implementation is not 100% perfect for weird media query combinations
      // when a module is imported multiple times with different media queries.
      // I hope this will never occur (Hey this way we have smaller bundles)

      if (item[0] == null || !alreadyImportedModules[item[0]]) {
        if (mediaQuery && !item[2]) {
          item[2] = mediaQuery;
        } else if (mediaQuery) {
          item[2] = '(' + item[2] + ') and (' + mediaQuery + ')';
        }

        list.push(item);
      }
    }
  };

  return list;
};

function cssWithMappingToString(item, useSourceMap) {
  var content = item[1] || '';
  var cssMapping = item[3];

  if (!cssMapping) {
    return content;
  }

  if (useSourceMap && typeof btoa === 'function') {
    var sourceMapping = toComment(cssMapping);
    var sourceURLs = cssMapping.sources.map(function (source) {
      return '/*# sourceURL=' + cssMapping.sourceRoot + source + ' */';
    });
    return [content].concat(sourceURLs).concat([sourceMapping]).join('\n');
  }

  return [content].join('\n');
} // Adapted from convert-source-map (MIT)


function toComment(sourceMap) {
  // eslint-disable-next-line no-undef
  var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap))));
  var data = 'sourceMappingURL=data:application/json;charset=utf-8;base64,' + base64;
  return '/*# ' + data + ' */';
}

/***/ }),

/***/ "./node_modules/file-loader/dist/cjs.js!./node_modules/viz.js/full.render.js":
/*!***********************************************************************************!*\
  !*** ./node_modules/file-loader/dist/cjs.js!./node_modules/viz.js/full.render.js ***!
  \***********************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "8f1068bacff9731fe54c62ea63dbf625.js";

/***/ }),

/***/ "./node_modules/jquery/dist/jquery.js":
/*!********************************************!*\
  !*** ./node_modules/jquery/dist/jquery.js ***!
  \********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/*!
 * jQuery JavaScript Library v3.7.1
 * https://jquery.com/
 *
 * Copyright OpenJS Foundation and other contributors
 * Released under the MIT license
 * https://jquery.org/license
 *
 * Date: 2023-08-28T13:37Z
 */
( function( global, factory ) {

	"use strict";

	if (  true && typeof module.exports === "object" ) {

		// For CommonJS and CommonJS-like environments where a proper `window`
		// is present, execute the factory and get jQuery.
		// For environments that do not have a `window` with a `document`
		// (such as Node.js), expose a factory as module.exports.
		// This accentuates the need for the creation of a real `window`.
		// e.g. var jQuery = require("jquery")(window);
		// See ticket trac-14549 for more info.
		module.exports = global.document ?
			factory( global, true ) :
			function( w ) {
				if ( !w.document ) {
					throw new Error( "jQuery requires a window with a document" );
				}
				return factory( w );
			};
	} else {
		factory( global );
	}

// Pass this if window is not defined yet
} )( typeof window !== "undefined" ? window : this, function( window, noGlobal ) {

// Edge <= 12 - 13+, Firefox <=18 - 45+, IE 10 - 11, Safari 5.1 - 9+, iOS 6 - 9.1
// throw exceptions when non-strict code (e.g., ASP.NET 4.5) accesses strict mode
// arguments.callee.caller (trac-13335). But as of jQuery 3.0 (2016), strict mode should be common
// enough that all such attempts are guarded in a try block.
"use strict";

var arr = [];

var getProto = Object.getPrototypeOf;

var slice = arr.slice;

var flat = arr.flat ? function( array ) {
	return arr.flat.call( array );
} : function( array ) {
	return arr.concat.apply( [], array );
};


var push = arr.push;

var indexOf = arr.indexOf;

var class2type = {};

var toString = class2type.toString;

var hasOwn = class2type.hasOwnProperty;

var fnToString = hasOwn.toString;

var ObjectFunctionString = fnToString.call( Object );

var support = {};

var isFunction = function isFunction( obj ) {

		// Support: Chrome <=57, Firefox <=52
		// In some browsers, typeof returns "function" for HTML <object> elements
		// (i.e., `typeof document.createElement( "object" ) === "function"`).
		// We don't want to classify *any* DOM node as a function.
		// Support: QtWeb <=3.8.5, WebKit <=534.34, wkhtmltopdf tool <=0.12.5
		// Plus for old WebKit, typeof returns "function" for HTML collections
		// (e.g., `typeof document.getElementsByTagName("div") === "function"`). (gh-4756)
		return typeof obj === "function" && typeof obj.nodeType !== "number" &&
			typeof obj.item !== "function";
	};


var isWindow = function isWindow( obj ) {
		return obj != null && obj === obj.window;
	};


var document = window.document;



	var preservedScriptAttributes = {
		type: true,
		src: true,
		nonce: true,
		noModule: true
	};

	function DOMEval( code, node, doc ) {
		doc = doc || document;

		var i, val,
			script = doc.createElement( "script" );

		script.text = code;
		if ( node ) {
			for ( i in preservedScriptAttributes ) {

				// Support: Firefox 64+, Edge 18+
				// Some browsers don't support the "nonce" property on scripts.
				// On the other hand, just using `getAttribute` is not enough as
				// the `nonce` attribute is reset to an empty string whenever it
				// becomes browsing-context connected.
				// See https://github.com/whatwg/html/issues/2369
				// See https://html.spec.whatwg.org/#nonce-attributes
				// The `node.getAttribute` check was added for the sake of
				// `jQuery.globalEval` so that it can fake a nonce-containing node
				// via an object.
				val = node[ i ] || node.getAttribute && node.getAttribute( i );
				if ( val ) {
					script.setAttribute( i, val );
				}
			}
		}
		doc.head.appendChild( script ).parentNode.removeChild( script );
	}


function toType( obj ) {
	if ( obj == null ) {
		return obj + "";
	}

	// Support: Android <=2.3 only (functionish RegExp)
	return typeof obj === "object" || typeof obj === "function" ?
		class2type[ toString.call( obj ) ] || "object" :
		typeof obj;
}
/* global Symbol */
// Defining this global in .eslintrc.json would create a danger of using the global
// unguarded in another place, it seems safer to define global only for this module



var version = "3.7.1",

	rhtmlSuffix = /HTML$/i,

	// Define a local copy of jQuery
	jQuery = function( selector, context ) {

		// The jQuery object is actually just the init constructor 'enhanced'
		// Need init if jQuery is called (just allow error to be thrown if not included)
		return new jQuery.fn.init( selector, context );
	};

jQuery.fn = jQuery.prototype = {

	// The current version of jQuery being used
	jquery: version,

	constructor: jQuery,

	// The default length of a jQuery object is 0
	length: 0,

	toArray: function() {
		return slice.call( this );
	},

	// Get the Nth element in the matched element set OR
	// Get the whole matched element set as a clean array
	get: function( num ) {

		// Return all the elements in a clean array
		if ( num == null ) {
			return slice.call( this );
		}

		// Return just the one element from the set
		return num < 0 ? this[ num + this.length ] : this[ num ];
	},

	// Take an array of elements and push it onto the stack
	// (returning the new matched element set)
	pushStack: function( elems ) {

		// Build a new jQuery matched element set
		var ret = jQuery.merge( this.constructor(), elems );

		// Add the old object onto the stack (as a reference)
		ret.prevObject = this;

		// Return the newly-formed element set
		return ret;
	},

	// Execute a callback for every element in the matched set.
	each: function( callback ) {
		return jQuery.each( this, callback );
	},

	map: function( callback ) {
		return this.pushStack( jQuery.map( this, function( elem, i ) {
			return callback.call( elem, i, elem );
		} ) );
	},

	slice: function() {
		return this.pushStack( slice.apply( this, arguments ) );
	},

	first: function() {
		return this.eq( 0 );
	},

	last: function() {
		return this.eq( -1 );
	},

	even: function() {
		return this.pushStack( jQuery.grep( this, function( _elem, i ) {
			return ( i + 1 ) % 2;
		} ) );
	},

	odd: function() {
		return this.pushStack( jQuery.grep( this, function( _elem, i ) {
			return i % 2;
		} ) );
	},

	eq: function( i ) {
		var len = this.length,
			j = +i + ( i < 0 ? len : 0 );
		return this.pushStack( j >= 0 && j < len ? [ this[ j ] ] : [] );
	},

	end: function() {
		return this.prevObject || this.constructor();
	},

	// For internal use only.
	// Behaves like an Array's method, not like a jQuery method.
	push: push,
	sort: arr.sort,
	splice: arr.splice
};

jQuery.extend = jQuery.fn.extend = function() {
	var options, name, src, copy, copyIsArray, clone,
		target = arguments[ 0 ] || {},
		i = 1,
		length = arguments.length,
		deep = false;

	// Handle a deep copy situation
	if ( typeof target === "boolean" ) {
		deep = target;

		// Skip the boolean and the target
		target = arguments[ i ] || {};
		i++;
	}

	// Handle case when target is a string or something (possible in deep copy)
	if ( typeof target !== "object" && !isFunction( target ) ) {
		target = {};
	}

	// Extend jQuery itself if only one argument is passed
	if ( i === length ) {
		target = this;
		i--;
	}

	for ( ; i < length; i++ ) {

		// Only deal with non-null/undefined values
		if ( ( options = arguments[ i ] ) != null ) {

			// Extend the base object
			for ( name in options ) {
				copy = options[ name ];

				// Prevent Object.prototype pollution
				// Prevent never-ending loop
				if ( name === "__proto__" || target === copy ) {
					continue;
				}

				// Recurse if we're merging plain objects or arrays
				if ( deep && copy && ( jQuery.isPlainObject( copy ) ||
					( copyIsArray = Array.isArray( copy ) ) ) ) {
					src = target[ name ];

					// Ensure proper type for the source value
					if ( copyIsArray && !Array.isArray( src ) ) {
						clone = [];
					} else if ( !copyIsArray && !jQuery.isPlainObject( src ) ) {
						clone = {};
					} else {
						clone = src;
					}
					copyIsArray = false;

					// Never move original objects, clone them
					target[ name ] = jQuery.extend( deep, clone, copy );

				// Don't bring in undefined values
				} else if ( copy !== undefined ) {
					target[ name ] = copy;
				}
			}
		}
	}

	// Return the modified object
	return target;
};

jQuery.extend( {

	// Unique for each copy of jQuery on the page
	expando: "jQuery" + ( version + Math.random() ).replace( /\D/g, "" ),

	// Assume jQuery is ready without the ready module
	isReady: true,

	error: function( msg ) {
		throw new Error( msg );
	},

	noop: function() {},

	isPlainObject: function( obj ) {
		var proto, Ctor;

		// Detect obvious negatives
		// Use toString instead of jQuery.type to catch host objects
		if ( !obj || toString.call( obj ) !== "[object Object]" ) {
			return false;
		}

		proto = getProto( obj );

		// Objects with no prototype (e.g., `Object.create( null )`) are plain
		if ( !proto ) {
			return true;
		}

		// Objects with prototype are plain iff they were constructed by a global Object function
		Ctor = hasOwn.call( proto, "constructor" ) && proto.constructor;
		return typeof Ctor === "function" && fnToString.call( Ctor ) === ObjectFunctionString;
	},

	isEmptyObject: function( obj ) {
		var name;

		for ( name in obj ) {
			return false;
		}
		return true;
	},

	// Evaluates a script in a provided context; falls back to the global one
	// if not specified.
	globalEval: function( code, options, doc ) {
		DOMEval( code, { nonce: options && options.nonce }, doc );
	},

	each: function( obj, callback ) {
		var length, i = 0;

		if ( isArrayLike( obj ) ) {
			length = obj.length;
			for ( ; i < length; i++ ) {
				if ( callback.call( obj[ i ], i, obj[ i ] ) === false ) {
					break;
				}
			}
		} else {
			for ( i in obj ) {
				if ( callback.call( obj[ i ], i, obj[ i ] ) === false ) {
					break;
				}
			}
		}

		return obj;
	},


	// Retrieve the text value of an array of DOM nodes
	text: function( elem ) {
		var node,
			ret = "",
			i = 0,
			nodeType = elem.nodeType;

		if ( !nodeType ) {

			// If no nodeType, this is expected to be an array
			while ( ( node = elem[ i++ ] ) ) {

				// Do not traverse comment nodes
				ret += jQuery.text( node );
			}
		}
		if ( nodeType === 1 || nodeType === 11 ) {
			return elem.textContent;
		}
		if ( nodeType === 9 ) {
			return elem.documentElement.textContent;
		}
		if ( nodeType === 3 || nodeType === 4 ) {
			return elem.nodeValue;
		}

		// Do not include comment or processing instruction nodes

		return ret;
	},

	// results is for internal usage only
	makeArray: function( arr, results ) {
		var ret = results || [];

		if ( arr != null ) {
			if ( isArrayLike( Object( arr ) ) ) {
				jQuery.merge( ret,
					typeof arr === "string" ?
						[ arr ] : arr
				);
			} else {
				push.call( ret, arr );
			}
		}

		return ret;
	},

	inArray: function( elem, arr, i ) {
		return arr == null ? -1 : indexOf.call( arr, elem, i );
	},

	isXMLDoc: function( elem ) {
		var namespace = elem && elem.namespaceURI,
			docElem = elem && ( elem.ownerDocument || elem ).documentElement;

		// Assume HTML when documentElement doesn't yet exist, such as inside
		// document fragments.
		return !rhtmlSuffix.test( namespace || docElem && docElem.nodeName || "HTML" );
	},

	// Support: Android <=4.0 only, PhantomJS 1 only
	// push.apply(_, arraylike) throws on ancient WebKit
	merge: function( first, second ) {
		var len = +second.length,
			j = 0,
			i = first.length;

		for ( ; j < len; j++ ) {
			first[ i++ ] = second[ j ];
		}

		first.length = i;

		return first;
	},

	grep: function( elems, callback, invert ) {
		var callbackInverse,
			matches = [],
			i = 0,
			length = elems.length,
			callbackExpect = !invert;

		// Go through the array, only saving the items
		// that pass the validator function
		for ( ; i < length; i++ ) {
			callbackInverse = !callback( elems[ i ], i );
			if ( callbackInverse !== callbackExpect ) {
				matches.push( elems[ i ] );
			}
		}

		return matches;
	},

	// arg is for internal usage only
	map: function( elems, callback, arg ) {
		var length, value,
			i = 0,
			ret = [];

		// Go through the array, translating each of the items to their new values
		if ( isArrayLike( elems ) ) {
			length = elems.length;
			for ( ; i < length; i++ ) {
				value = callback( elems[ i ], i, arg );

				if ( value != null ) {
					ret.push( value );
				}
			}

		// Go through every key on the object,
		} else {
			for ( i in elems ) {
				value = callback( elems[ i ], i, arg );

				if ( value != null ) {
					ret.push( value );
				}
			}
		}

		// Flatten any nested arrays
		return flat( ret );
	},

	// A global GUID counter for objects
	guid: 1,

	// jQuery.support is not used in Core but other projects attach their
	// properties to it so it needs to exist.
	support: support
} );

if ( typeof Symbol === "function" ) {
	jQuery.fn[ Symbol.iterator ] = arr[ Symbol.iterator ];
}

// Populate the class2type map
jQuery.each( "Boolean Number String Function Array Date RegExp Object Error Symbol".split( " " ),
	function( _i, name ) {
		class2type[ "[object " + name + "]" ] = name.toLowerCase();
	} );

function isArrayLike( obj ) {

	// Support: real iOS 8.2 only (not reproducible in simulator)
	// `in` check used to prevent JIT error (gh-2145)
	// hasOwn isn't used here due to false negatives
	// regarding Nodelist length in IE
	var length = !!obj && "length" in obj && obj.length,
		type = toType( obj );

	if ( isFunction( obj ) || isWindow( obj ) ) {
		return false;
	}

	return type === "array" || length === 0 ||
		typeof length === "number" && length > 0 && ( length - 1 ) in obj;
}


function nodeName( elem, name ) {

	return elem.nodeName && elem.nodeName.toLowerCase() === name.toLowerCase();

}
var pop = arr.pop;


var sort = arr.sort;


var splice = arr.splice;


var whitespace = "[\\x20\\t\\r\\n\\f]";


var rtrimCSS = new RegExp(
	"^" + whitespace + "+|((?:^|[^\\\\])(?:\\\\.)*)" + whitespace + "+$",
	"g"
);




// Note: an element does not contain itself
jQuery.contains = function( a, b ) {
	var bup = b && b.parentNode;

	return a === bup || !!( bup && bup.nodeType === 1 && (

		// Support: IE 9 - 11+
		// IE doesn't have `contains` on SVG.
		a.contains ?
			a.contains( bup ) :
			a.compareDocumentPosition && a.compareDocumentPosition( bup ) & 16
	) );
};




// CSS string/identifier serialization
// https://drafts.csswg.org/cssom/#common-serializing-idioms
var rcssescape = /([\0-\x1f\x7f]|^-?\d)|^-$|[^\x80-\uFFFF\w-]/g;

function fcssescape( ch, asCodePoint ) {
	if ( asCodePoint ) {

		// U+0000 NULL becomes U+FFFD REPLACEMENT CHARACTER
		if ( ch === "\0" ) {
			return "\uFFFD";
		}

		// Control characters and (dependent upon position) numbers get escaped as code points
		return ch.slice( 0, -1 ) + "\\" + ch.charCodeAt( ch.length - 1 ).toString( 16 ) + " ";
	}

	// Other potentially-special ASCII characters get backslash-escaped
	return "\\" + ch;
}

jQuery.escapeSelector = function( sel ) {
	return ( sel + "" ).replace( rcssescape, fcssescape );
};




var preferredDoc = document,
	pushNative = push;

( function() {

var i,
	Expr,
	outermostContext,
	sortInput,
	hasDuplicate,
	push = pushNative,

	// Local document vars
	document,
	documentElement,
	documentIsHTML,
	rbuggyQSA,
	matches,

	// Instance-specific data
	expando = jQuery.expando,
	dirruns = 0,
	done = 0,
	classCache = createCache(),
	tokenCache = createCache(),
	compilerCache = createCache(),
	nonnativeSelectorCache = createCache(),
	sortOrder = function( a, b ) {
		if ( a === b ) {
			hasDuplicate = true;
		}
		return 0;
	},

	booleans = "checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|" +
		"loop|multiple|open|readonly|required|scoped",

	// Regular expressions

	// https://www.w3.org/TR/css-syntax-3/#ident-token-diagram
	identifier = "(?:\\\\[\\da-fA-F]{1,6}" + whitespace +
		"?|\\\\[^\\r\\n\\f]|[\\w-]|[^\0-\\x7f])+",

	// Attribute selectors: https://www.w3.org/TR/selectors/#attribute-selectors
	attributes = "\\[" + whitespace + "*(" + identifier + ")(?:" + whitespace +

		// Operator (capture 2)
		"*([*^$|!~]?=)" + whitespace +

		// "Attribute values must be CSS identifiers [capture 5] or strings [capture 3 or capture 4]"
		"*(?:'((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\"|(" + identifier + "))|)" +
		whitespace + "*\\]",

	pseudos = ":(" + identifier + ")(?:\\((" +

		// To reduce the number of selectors needing tokenize in the preFilter, prefer arguments:
		// 1. quoted (capture 3; capture 4 or capture 5)
		"('((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\")|" +

		// 2. simple (capture 6)
		"((?:\\\\.|[^\\\\()[\\]]|" + attributes + ")*)|" +

		// 3. anything else (capture 2)
		".*" +
		")\\)|)",

	// Leading and non-escaped trailing whitespace, capturing some non-whitespace characters preceding the latter
	rwhitespace = new RegExp( whitespace + "+", "g" ),

	rcomma = new RegExp( "^" + whitespace + "*," + whitespace + "*" ),
	rleadingCombinator = new RegExp( "^" + whitespace + "*([>+~]|" + whitespace + ")" +
		whitespace + "*" ),
	rdescend = new RegExp( whitespace + "|>" ),

	rpseudo = new RegExp( pseudos ),
	ridentifier = new RegExp( "^" + identifier + "$" ),

	matchExpr = {
		ID: new RegExp( "^#(" + identifier + ")" ),
		CLASS: new RegExp( "^\\.(" + identifier + ")" ),
		TAG: new RegExp( "^(" + identifier + "|[*])" ),
		ATTR: new RegExp( "^" + attributes ),
		PSEUDO: new RegExp( "^" + pseudos ),
		CHILD: new RegExp(
			"^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" +
				whitespace + "*(even|odd|(([+-]|)(\\d*)n|)" + whitespace + "*(?:([+-]|)" +
				whitespace + "*(\\d+)|))" + whitespace + "*\\)|)", "i" ),
		bool: new RegExp( "^(?:" + booleans + ")$", "i" ),

		// For use in libraries implementing .is()
		// We use this for POS matching in `select`
		needsContext: new RegExp( "^" + whitespace +
			"*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" + whitespace +
			"*((?:-\\d)?\\d*)" + whitespace + "*\\)|)(?=[^-]|$)", "i" )
	},

	rinputs = /^(?:input|select|textarea|button)$/i,
	rheader = /^h\d$/i,

	// Easily-parseable/retrievable ID or TAG or CLASS selectors
	rquickExpr = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,

	rsibling = /[+~]/,

	// CSS escapes
	// https://www.w3.org/TR/CSS21/syndata.html#escaped-characters
	runescape = new RegExp( "\\\\[\\da-fA-F]{1,6}" + whitespace +
		"?|\\\\([^\\r\\n\\f])", "g" ),
	funescape = function( escape, nonHex ) {
		var high = "0x" + escape.slice( 1 ) - 0x10000;

		if ( nonHex ) {

			// Strip the backslash prefix from a non-hex escape sequence
			return nonHex;
		}

		// Replace a hexadecimal escape sequence with the encoded Unicode code point
		// Support: IE <=11+
		// For values outside the Basic Multilingual Plane (BMP), manually construct a
		// surrogate pair
		return high < 0 ?
			String.fromCharCode( high + 0x10000 ) :
			String.fromCharCode( high >> 10 | 0xD800, high & 0x3FF | 0xDC00 );
	},

	// Used for iframes; see `setDocument`.
	// Support: IE 9 - 11+, Edge 12 - 18+
	// Removing the function wrapper causes a "Permission Denied"
	// error in IE/Edge.
	unloadHandler = function() {
		setDocument();
	},

	inDisabledFieldset = addCombinator(
		function( elem ) {
			return elem.disabled === true && nodeName( elem, "fieldset" );
		},
		{ dir: "parentNode", next: "legend" }
	);

// Support: IE <=9 only
// Accessing document.activeElement can throw unexpectedly
// https://bugs.jquery.com/ticket/13393
function safeActiveElement() {
	try {
		return document.activeElement;
	} catch ( err ) { }
}

// Optimize for push.apply( _, NodeList )
try {
	push.apply(
		( arr = slice.call( preferredDoc.childNodes ) ),
		preferredDoc.childNodes
	);

	// Support: Android <=4.0
	// Detect silently failing push.apply
	// eslint-disable-next-line no-unused-expressions
	arr[ preferredDoc.childNodes.length ].nodeType;
} catch ( e ) {
	push = {
		apply: function( target, els ) {
			pushNative.apply( target, slice.call( els ) );
		},
		call: function( target ) {
			pushNative.apply( target, slice.call( arguments, 1 ) );
		}
	};
}

function find( selector, context, results, seed ) {
	var m, i, elem, nid, match, groups, newSelector,
		newContext = context && context.ownerDocument,

		// nodeType defaults to 9, since context defaults to document
		nodeType = context ? context.nodeType : 9;

	results = results || [];

	// Return early from calls with invalid selector or context
	if ( typeof selector !== "string" || !selector ||
		nodeType !== 1 && nodeType !== 9 && nodeType !== 11 ) {

		return results;
	}

	// Try to shortcut find operations (as opposed to filters) in HTML documents
	if ( !seed ) {
		setDocument( context );
		context = context || document;

		if ( documentIsHTML ) {

			// If the selector is sufficiently simple, try using a "get*By*" DOM method
			// (excepting DocumentFragment context, where the methods don't exist)
			if ( nodeType !== 11 && ( match = rquickExpr.exec( selector ) ) ) {

				// ID selector
				if ( ( m = match[ 1 ] ) ) {

					// Document context
					if ( nodeType === 9 ) {
						if ( ( elem = context.getElementById( m ) ) ) {

							// Support: IE 9 only
							// getElementById can match elements by name instead of ID
							if ( elem.id === m ) {
								push.call( results, elem );
								return results;
							}
						} else {
							return results;
						}

					// Element context
					} else {

						// Support: IE 9 only
						// getElementById can match elements by name instead of ID
						if ( newContext && ( elem = newContext.getElementById( m ) ) &&
							find.contains( context, elem ) &&
							elem.id === m ) {

							push.call( results, elem );
							return results;
						}
					}

				// Type selector
				} else if ( match[ 2 ] ) {
					push.apply( results, context.getElementsByTagName( selector ) );
					return results;

				// Class selector
				} else if ( ( m = match[ 3 ] ) && context.getElementsByClassName ) {
					push.apply( results, context.getElementsByClassName( m ) );
					return results;
				}
			}

			// Take advantage of querySelectorAll
			if ( !nonnativeSelectorCache[ selector + " " ] &&
				( !rbuggyQSA || !rbuggyQSA.test( selector ) ) ) {

				newSelector = selector;
				newContext = context;

				// qSA considers elements outside a scoping root when evaluating child or
				// descendant combinators, which is not what we want.
				// In such cases, we work around the behavior by prefixing every selector in the
				// list with an ID selector referencing the scope context.
				// The technique has to be used as well when a leading combinator is used
				// as such selectors are not recognized by querySelectorAll.
				// Thanks to Andrew Dupont for this technique.
				if ( nodeType === 1 &&
					( rdescend.test( selector ) || rleadingCombinator.test( selector ) ) ) {

					// Expand context for sibling selectors
					newContext = rsibling.test( selector ) && testContext( context.parentNode ) ||
						context;

					// We can use :scope instead of the ID hack if the browser
					// supports it & if we're not changing the context.
					// Support: IE 11+, Edge 17 - 18+
					// IE/Edge sometimes throw a "Permission denied" error when
					// strict-comparing two documents; shallow comparisons work.
					// eslint-disable-next-line eqeqeq
					if ( newContext != context || !support.scope ) {

						// Capture the context ID, setting it first if necessary
						if ( ( nid = context.getAttribute( "id" ) ) ) {
							nid = jQuery.escapeSelector( nid );
						} else {
							context.setAttribute( "id", ( nid = expando ) );
						}
					}

					// Prefix every selector in the list
					groups = tokenize( selector );
					i = groups.length;
					while ( i-- ) {
						groups[ i ] = ( nid ? "#" + nid : ":scope" ) + " " +
							toSelector( groups[ i ] );
					}
					newSelector = groups.join( "," );
				}

				try {
					push.apply( results,
						newContext.querySelectorAll( newSelector )
					);
					return results;
				} catch ( qsaError ) {
					nonnativeSelectorCache( selector, true );
				} finally {
					if ( nid === expando ) {
						context.removeAttribute( "id" );
					}
				}
			}
		}
	}

	// All others
	return select( selector.replace( rtrimCSS, "$1" ), context, results, seed );
}

/**
 * Create key-value caches of limited size
 * @returns {function(string, object)} Returns the Object data after storing it on itself with
 *	property name the (space-suffixed) string and (if the cache is larger than Expr.cacheLength)
 *	deleting the oldest entry
 */
function createCache() {
	var keys = [];

	function cache( key, value ) {

		// Use (key + " ") to avoid collision with native prototype properties
		// (see https://github.com/jquery/sizzle/issues/157)
		if ( keys.push( key + " " ) > Expr.cacheLength ) {

			// Only keep the most recent entries
			delete cache[ keys.shift() ];
		}
		return ( cache[ key + " " ] = value );
	}
	return cache;
}

/**
 * Mark a function for special use by jQuery selector module
 * @param {Function} fn The function to mark
 */
function markFunction( fn ) {
	fn[ expando ] = true;
	return fn;
}

/**
 * Support testing using an element
 * @param {Function} fn Passed the created element and returns a boolean result
 */
function assert( fn ) {
	var el = document.createElement( "fieldset" );

	try {
		return !!fn( el );
	} catch ( e ) {
		return false;
	} finally {

		// Remove from its parent by default
		if ( el.parentNode ) {
			el.parentNode.removeChild( el );
		}

		// release memory in IE
		el = null;
	}
}

/**
 * Returns a function to use in pseudos for input types
 * @param {String} type
 */
function createInputPseudo( type ) {
	return function( elem ) {
		return nodeName( elem, "input" ) && elem.type === type;
	};
}

/**
 * Returns a function to use in pseudos for buttons
 * @param {String} type
 */
function createButtonPseudo( type ) {
	return function( elem ) {
		return ( nodeName( elem, "input" ) || nodeName( elem, "button" ) ) &&
			elem.type === type;
	};
}

/**
 * Returns a function to use in pseudos for :enabled/:disabled
 * @param {Boolean} disabled true for :disabled; false for :enabled
 */
function createDisabledPseudo( disabled ) {

	// Known :disabled false positives: fieldset[disabled] > legend:nth-of-type(n+2) :can-disable
	return function( elem ) {

		// Only certain elements can match :enabled or :disabled
		// https://html.spec.whatwg.org/multipage/scripting.html#selector-enabled
		// https://html.spec.whatwg.org/multipage/scripting.html#selector-disabled
		if ( "form" in elem ) {

			// Check for inherited disabledness on relevant non-disabled elements:
			// * listed form-associated elements in a disabled fieldset
			//   https://html.spec.whatwg.org/multipage/forms.html#category-listed
			//   https://html.spec.whatwg.org/multipage/forms.html#concept-fe-disabled
			// * option elements in a disabled optgroup
			//   https://html.spec.whatwg.org/multipage/forms.html#concept-option-disabled
			// All such elements have a "form" property.
			if ( elem.parentNode && elem.disabled === false ) {

				// Option elements defer to a parent optgroup if present
				if ( "label" in elem ) {
					if ( "label" in elem.parentNode ) {
						return elem.parentNode.disabled === disabled;
					} else {
						return elem.disabled === disabled;
					}
				}

				// Support: IE 6 - 11+
				// Use the isDisabled shortcut property to check for disabled fieldset ancestors
				return elem.isDisabled === disabled ||

					// Where there is no isDisabled, check manually
					elem.isDisabled !== !disabled &&
						inDisabledFieldset( elem ) === disabled;
			}

			return elem.disabled === disabled;

		// Try to winnow out elements that can't be disabled before trusting the disabled property.
		// Some victims get caught in our net (label, legend, menu, track), but it shouldn't
		// even exist on them, let alone have a boolean value.
		} else if ( "label" in elem ) {
			return elem.disabled === disabled;
		}

		// Remaining elements are neither :enabled nor :disabled
		return false;
	};
}

/**
 * Returns a function to use in pseudos for positionals
 * @param {Function} fn
 */
function createPositionalPseudo( fn ) {
	return markFunction( function( argument ) {
		argument = +argument;
		return markFunction( function( seed, matches ) {
			var j,
				matchIndexes = fn( [], seed.length, argument ),
				i = matchIndexes.length;

			// Match elements found at the specified indexes
			while ( i-- ) {
				if ( seed[ ( j = matchIndexes[ i ] ) ] ) {
					seed[ j ] = !( matches[ j ] = seed[ j ] );
				}
			}
		} );
	} );
}

/**
 * Checks a node for validity as a jQuery selector context
 * @param {Element|Object=} context
 * @returns {Element|Object|Boolean} The input node if acceptable, otherwise a falsy value
 */
function testContext( context ) {
	return context && typeof context.getElementsByTagName !== "undefined" && context;
}

/**
 * Sets document-related variables once based on the current document
 * @param {Element|Object} [node] An element or document object to use to set the document
 * @returns {Object} Returns the current document
 */
function setDocument( node ) {
	var subWindow,
		doc = node ? node.ownerDocument || node : preferredDoc;

	// Return early if doc is invalid or already selected
	// Support: IE 11+, Edge 17 - 18+
	// IE/Edge sometimes throw a "Permission denied" error when strict-comparing
	// two documents; shallow comparisons work.
	// eslint-disable-next-line eqeqeq
	if ( doc == document || doc.nodeType !== 9 || !doc.documentElement ) {
		return document;
	}

	// Update global variables
	document = doc;
	documentElement = document.documentElement;
	documentIsHTML = !jQuery.isXMLDoc( document );

	// Support: iOS 7 only, IE 9 - 11+
	// Older browsers didn't support unprefixed `matches`.
	matches = documentElement.matches ||
		documentElement.webkitMatchesSelector ||
		documentElement.msMatchesSelector;

	// Support: IE 9 - 11+, Edge 12 - 18+
	// Accessing iframe documents after unload throws "permission denied" errors
	// (see trac-13936).
	// Limit the fix to IE & Edge Legacy; despite Edge 15+ implementing `matches`,
	// all IE 9+ and Edge Legacy versions implement `msMatchesSelector` as well.
	if ( documentElement.msMatchesSelector &&

		// Support: IE 11+, Edge 17 - 18+
		// IE/Edge sometimes throw a "Permission denied" error when strict-comparing
		// two documents; shallow comparisons work.
		// eslint-disable-next-line eqeqeq
		preferredDoc != document &&
		( subWindow = document.defaultView ) && subWindow.top !== subWindow ) {

		// Support: IE 9 - 11+, Edge 12 - 18+
		subWindow.addEventListener( "unload", unloadHandler );
	}

	// Support: IE <10
	// Check if getElementById returns elements by name
	// The broken getElementById methods don't pick up programmatically-set names,
	// so use a roundabout getElementsByName test
	support.getById = assert( function( el ) {
		documentElement.appendChild( el ).id = jQuery.expando;
		return !document.getElementsByName ||
			!document.getElementsByName( jQuery.expando ).length;
	} );

	// Support: IE 9 only
	// Check to see if it's possible to do matchesSelector
	// on a disconnected node.
	support.disconnectedMatch = assert( function( el ) {
		return matches.call( el, "*" );
	} );

	// Support: IE 9 - 11+, Edge 12 - 18+
	// IE/Edge don't support the :scope pseudo-class.
	support.scope = assert( function() {
		return document.querySelectorAll( ":scope" );
	} );

	// Support: Chrome 105 - 111 only, Safari 15.4 - 16.3 only
	// Make sure the `:has()` argument is parsed unforgivingly.
	// We include `*` in the test to detect buggy implementations that are
	// _selectively_ forgiving (specifically when the list includes at least
	// one valid selector).
	// Note that we treat complete lack of support for `:has()` as if it were
	// spec-compliant support, which is fine because use of `:has()` in such
	// environments will fail in the qSA path and fall back to jQuery traversal
	// anyway.
	support.cssHas = assert( function() {
		try {
			document.querySelector( ":has(*,:jqfake)" );
			return false;
		} catch ( e ) {
			return true;
		}
	} );

	// ID filter and find
	if ( support.getById ) {
		Expr.filter.ID = function( id ) {
			var attrId = id.replace( runescape, funescape );
			return function( elem ) {
				return elem.getAttribute( "id" ) === attrId;
			};
		};
		Expr.find.ID = function( id, context ) {
			if ( typeof context.getElementById !== "undefined" && documentIsHTML ) {
				var elem = context.getElementById( id );
				return elem ? [ elem ] : [];
			}
		};
	} else {
		Expr.filter.ID =  function( id ) {
			var attrId = id.replace( runescape, funescape );
			return function( elem ) {
				var node = typeof elem.getAttributeNode !== "undefined" &&
					elem.getAttributeNode( "id" );
				return node && node.value === attrId;
			};
		};

		// Support: IE 6 - 7 only
		// getElementById is not reliable as a find shortcut
		Expr.find.ID = function( id, context ) {
			if ( typeof context.getElementById !== "undefined" && documentIsHTML ) {
				var node, i, elems,
					elem = context.getElementById( id );

				if ( elem ) {

					// Verify the id attribute
					node = elem.getAttributeNode( "id" );
					if ( node && node.value === id ) {
						return [ elem ];
					}

					// Fall back on getElementsByName
					elems = context.getElementsByName( id );
					i = 0;
					while ( ( elem = elems[ i++ ] ) ) {
						node = elem.getAttributeNode( "id" );
						if ( node && node.value === id ) {
							return [ elem ];
						}
					}
				}

				return [];
			}
		};
	}

	// Tag
	Expr.find.TAG = function( tag, context ) {
		if ( typeof context.getElementsByTagName !== "undefined" ) {
			return context.getElementsByTagName( tag );

		// DocumentFragment nodes don't have gEBTN
		} else {
			return context.querySelectorAll( tag );
		}
	};

	// Class
	Expr.find.CLASS = function( className, context ) {
		if ( typeof context.getElementsByClassName !== "undefined" && documentIsHTML ) {
			return context.getElementsByClassName( className );
		}
	};

	/* QSA/matchesSelector
	---------------------------------------------------------------------- */

	// QSA and matchesSelector support

	rbuggyQSA = [];

	// Build QSA regex
	// Regex strategy adopted from Diego Perini
	assert( function( el ) {

		var input;

		documentElement.appendChild( el ).innerHTML =
			"<a id='" + expando + "' href='' disabled='disabled'></a>" +
			"<select id='" + expando + "-\r\\' disabled='disabled'>" +
			"<option selected=''></option></select>";

		// Support: iOS <=7 - 8 only
		// Boolean attributes and "value" are not treated correctly in some XML documents
		if ( !el.querySelectorAll( "[selected]" ).length ) {
			rbuggyQSA.push( "\\[" + whitespace + "*(?:value|" + booleans + ")" );
		}

		// Support: iOS <=7 - 8 only
		if ( !el.querySelectorAll( "[id~=" + expando + "-]" ).length ) {
			rbuggyQSA.push( "~=" );
		}

		// Support: iOS 8 only
		// https://bugs.webkit.org/show_bug.cgi?id=136851
		// In-page `selector#id sibling-combinator selector` fails
		if ( !el.querySelectorAll( "a#" + expando + "+*" ).length ) {
			rbuggyQSA.push( ".#.+[+~]" );
		}

		// Support: Chrome <=105+, Firefox <=104+, Safari <=15.4+
		// In some of the document kinds, these selectors wouldn't work natively.
		// This is probably OK but for backwards compatibility we want to maintain
		// handling them through jQuery traversal in jQuery 3.x.
		if ( !el.querySelectorAll( ":checked" ).length ) {
			rbuggyQSA.push( ":checked" );
		}

		// Support: Windows 8 Native Apps
		// The type and name attributes are restricted during .innerHTML assignment
		input = document.createElement( "input" );
		input.setAttribute( "type", "hidden" );
		el.appendChild( input ).setAttribute( "name", "D" );

		// Support: IE 9 - 11+
		// IE's :disabled selector does not pick up the children of disabled fieldsets
		// Support: Chrome <=105+, Firefox <=104+, Safari <=15.4+
		// In some of the document kinds, these selectors wouldn't work natively.
		// This is probably OK but for backwards compatibility we want to maintain
		// handling them through jQuery traversal in jQuery 3.x.
		documentElement.appendChild( el ).disabled = true;
		if ( el.querySelectorAll( ":disabled" ).length !== 2 ) {
			rbuggyQSA.push( ":enabled", ":disabled" );
		}

		// Support: IE 11+, Edge 15 - 18+
		// IE 11/Edge don't find elements on a `[name='']` query in some cases.
		// Adding a temporary attribute to the document before the selection works
		// around the issue.
		// Interestingly, IE 10 & older don't seem to have the issue.
		input = document.createElement( "input" );
		input.setAttribute( "name", "" );
		el.appendChild( input );
		if ( !el.querySelectorAll( "[name='']" ).length ) {
			rbuggyQSA.push( "\\[" + whitespace + "*name" + whitespace + "*=" +
				whitespace + "*(?:''|\"\")" );
		}
	} );

	if ( !support.cssHas ) {

		// Support: Chrome 105 - 110+, Safari 15.4 - 16.3+
		// Our regular `try-catch` mechanism fails to detect natively-unsupported
		// pseudo-classes inside `:has()` (such as `:has(:contains("Foo"))`)
		// in browsers that parse the `:has()` argument as a forgiving selector list.
		// https://drafts.csswg.org/selectors/#relational now requires the argument
		// to be parsed unforgivingly, but browsers have not yet fully adjusted.
		rbuggyQSA.push( ":has" );
	}

	rbuggyQSA = rbuggyQSA.length && new RegExp( rbuggyQSA.join( "|" ) );

	/* Sorting
	---------------------------------------------------------------------- */

	// Document order sorting
	sortOrder = function( a, b ) {

		// Flag for duplicate removal
		if ( a === b ) {
			hasDuplicate = true;
			return 0;
		}

		// Sort on method existence if only one input has compareDocumentPosition
		var compare = !a.compareDocumentPosition - !b.compareDocumentPosition;
		if ( compare ) {
			return compare;
		}

		// Calculate position if both inputs belong to the same document
		// Support: IE 11+, Edge 17 - 18+
		// IE/Edge sometimes throw a "Permission denied" error when strict-comparing
		// two documents; shallow comparisons work.
		// eslint-disable-next-line eqeqeq
		compare = ( a.ownerDocument || a ) == ( b.ownerDocument || b ) ?
			a.compareDocumentPosition( b ) :

			// Otherwise we know they are disconnected
			1;

		// Disconnected nodes
		if ( compare & 1 ||
			( !support.sortDetached && b.compareDocumentPosition( a ) === compare ) ) {

			// Choose the first element that is related to our preferred document
			// Support: IE 11+, Edge 17 - 18+
			// IE/Edge sometimes throw a "Permission denied" error when strict-comparing
			// two documents; shallow comparisons work.
			// eslint-disable-next-line eqeqeq
			if ( a === document || a.ownerDocument == preferredDoc &&
				find.contains( preferredDoc, a ) ) {
				return -1;
			}

			// Support: IE 11+, Edge 17 - 18+
			// IE/Edge sometimes throw a "Permission denied" error when strict-comparing
			// two documents; shallow comparisons work.
			// eslint-disable-next-line eqeqeq
			if ( b === document || b.ownerDocument == preferredDoc &&
				find.contains( preferredDoc, b ) ) {
				return 1;
			}

			// Maintain original order
			return sortInput ?
				( indexOf.call( sortInput, a ) - indexOf.call( sortInput, b ) ) :
				0;
		}

		return compare & 4 ? -1 : 1;
	};

	return document;
}

find.matches = function( expr, elements ) {
	return find( expr, null, null, elements );
};

find.matchesSelector = function( elem, expr ) {
	setDocument( elem );

	if ( documentIsHTML &&
		!nonnativeSelectorCache[ expr + " " ] &&
		( !rbuggyQSA || !rbuggyQSA.test( expr ) ) ) {

		try {
			var ret = matches.call( elem, expr );

			// IE 9's matchesSelector returns false on disconnected nodes
			if ( ret || support.disconnectedMatch ||

					// As well, disconnected nodes are said to be in a document
					// fragment in IE 9
					elem.document && elem.document.nodeType !== 11 ) {
				return ret;
			}
		} catch ( e ) {
			nonnativeSelectorCache( expr, true );
		}
	}

	return find( expr, document, null, [ elem ] ).length > 0;
};

find.contains = function( context, elem ) {

	// Set document vars if needed
	// Support: IE 11+, Edge 17 - 18+
	// IE/Edge sometimes throw a "Permission denied" error when strict-comparing
	// two documents; shallow comparisons work.
	// eslint-disable-next-line eqeqeq
	if ( ( context.ownerDocument || context ) != document ) {
		setDocument( context );
	}
	return jQuery.contains( context, elem );
};


find.attr = function( elem, name ) {

	// Set document vars if needed
	// Support: IE 11+, Edge 17 - 18+
	// IE/Edge sometimes throw a "Permission denied" error when strict-comparing
	// two documents; shallow comparisons work.
	// eslint-disable-next-line eqeqeq
	if ( ( elem.ownerDocument || elem ) != document ) {
		setDocument( elem );
	}

	var fn = Expr.attrHandle[ name.toLowerCase() ],

		// Don't get fooled by Object.prototype properties (see trac-13807)
		val = fn && hasOwn.call( Expr.attrHandle, name.toLowerCase() ) ?
			fn( elem, name, !documentIsHTML ) :
			undefined;

	if ( val !== undefined ) {
		return val;
	}

	return elem.getAttribute( name );
};

find.error = function( msg ) {
	throw new Error( "Syntax error, unrecognized expression: " + msg );
};

/**
 * Document sorting and removing duplicates
 * @param {ArrayLike} results
 */
jQuery.uniqueSort = function( results ) {
	var elem,
		duplicates = [],
		j = 0,
		i = 0;

	// Unless we *know* we can detect duplicates, assume their presence
	//
	// Support: Android <=4.0+
	// Testing for detecting duplicates is unpredictable so instead assume we can't
	// depend on duplicate detection in all browsers without a stable sort.
	hasDuplicate = !support.sortStable;
	sortInput = !support.sortStable && slice.call( results, 0 );
	sort.call( results, sortOrder );

	if ( hasDuplicate ) {
		while ( ( elem = results[ i++ ] ) ) {
			if ( elem === results[ i ] ) {
				j = duplicates.push( i );
			}
		}
		while ( j-- ) {
			splice.call( results, duplicates[ j ], 1 );
		}
	}

	// Clear input after sorting to release objects
	// See https://github.com/jquery/sizzle/pull/225
	sortInput = null;

	return results;
};

jQuery.fn.uniqueSort = function() {
	return this.pushStack( jQuery.uniqueSort( slice.apply( this ) ) );
};

Expr = jQuery.expr = {

	// Can be adjusted by the user
	cacheLength: 50,

	createPseudo: markFunction,

	match: matchExpr,

	attrHandle: {},

	find: {},

	relative: {
		">": { dir: "parentNode", first: true },
		" ": { dir: "parentNode" },
		"+": { dir: "previousSibling", first: true },
		"~": { dir: "previousSibling" }
	},

	preFilter: {
		ATTR: function( match ) {
			match[ 1 ] = match[ 1 ].replace( runescape, funescape );

			// Move the given value to match[3] whether quoted or unquoted
			match[ 3 ] = ( match[ 3 ] || match[ 4 ] || match[ 5 ] || "" )
				.replace( runescape, funescape );

			if ( match[ 2 ] === "~=" ) {
				match[ 3 ] = " " + match[ 3 ] + " ";
			}

			return match.slice( 0, 4 );
		},

		CHILD: function( match ) {

			/* matches from matchExpr["CHILD"]
				1 type (only|nth|...)
				2 what (child|of-type)
				3 argument (even|odd|\d*|\d*n([+-]\d+)?|...)
				4 xn-component of xn+y argument ([+-]?\d*n|)
				5 sign of xn-component
				6 x of xn-component
				7 sign of y-component
				8 y of y-component
			*/
			match[ 1 ] = match[ 1 ].toLowerCase();

			if ( match[ 1 ].slice( 0, 3 ) === "nth" ) {

				// nth-* requires argument
				if ( !match[ 3 ] ) {
					find.error( match[ 0 ] );
				}

				// numeric x and y parameters for Expr.filter.CHILD
				// remember that false/true cast respectively to 0/1
				match[ 4 ] = +( match[ 4 ] ?
					match[ 5 ] + ( match[ 6 ] || 1 ) :
					2 * ( match[ 3 ] === "even" || match[ 3 ] === "odd" )
				);
				match[ 5 ] = +( ( match[ 7 ] + match[ 8 ] ) || match[ 3 ] === "odd" );

			// other types prohibit arguments
			} else if ( match[ 3 ] ) {
				find.error( match[ 0 ] );
			}

			return match;
		},

		PSEUDO: function( match ) {
			var excess,
				unquoted = !match[ 6 ] && match[ 2 ];

			if ( matchExpr.CHILD.test( match[ 0 ] ) ) {
				return null;
			}

			// Accept quoted arguments as-is
			if ( match[ 3 ] ) {
				match[ 2 ] = match[ 4 ] || match[ 5 ] || "";

			// Strip excess characters from unquoted arguments
			} else if ( unquoted && rpseudo.test( unquoted ) &&

				// Get excess from tokenize (recursively)
				( excess = tokenize( unquoted, true ) ) &&

				// advance to the next closing parenthesis
				( excess = unquoted.indexOf( ")", unquoted.length - excess ) - unquoted.length ) ) {

				// excess is a negative index
				match[ 0 ] = match[ 0 ].slice( 0, excess );
				match[ 2 ] = unquoted.slice( 0, excess );
			}

			// Return only captures needed by the pseudo filter method (type and argument)
			return match.slice( 0, 3 );
		}
	},

	filter: {

		TAG: function( nodeNameSelector ) {
			var expectedNodeName = nodeNameSelector.replace( runescape, funescape ).toLowerCase();
			return nodeNameSelector === "*" ?
				function() {
					return true;
				} :
				function( elem ) {
					return nodeName( elem, expectedNodeName );
				};
		},

		CLASS: function( className ) {
			var pattern = classCache[ className + " " ];

			return pattern ||
				( pattern = new RegExp( "(^|" + whitespace + ")" + className +
					"(" + whitespace + "|$)" ) ) &&
				classCache( className, function( elem ) {
					return pattern.test(
						typeof elem.className === "string" && elem.className ||
							typeof elem.getAttribute !== "undefined" &&
								elem.getAttribute( "class" ) ||
							""
					);
				} );
		},

		ATTR: function( name, operator, check ) {
			return function( elem ) {
				var result = find.attr( elem, name );

				if ( result == null ) {
					return operator === "!=";
				}
				if ( !operator ) {
					return true;
				}

				result += "";

				if ( operator === "=" ) {
					return result === check;
				}
				if ( operator === "!=" ) {
					return result !== check;
				}
				if ( operator === "^=" ) {
					return check && result.indexOf( check ) === 0;
				}
				if ( operator === "*=" ) {
					return check && result.indexOf( check ) > -1;
				}
				if ( operator === "$=" ) {
					return check && result.slice( -check.length ) === check;
				}
				if ( operator === "~=" ) {
					return ( " " + result.replace( rwhitespace, " " ) + " " )
						.indexOf( check ) > -1;
				}
				if ( operator === "|=" ) {
					return result === check || result.slice( 0, check.length + 1 ) === check + "-";
				}

				return false;
			};
		},

		CHILD: function( type, what, _argument, first, last ) {
			var simple = type.slice( 0, 3 ) !== "nth",
				forward = type.slice( -4 ) !== "last",
				ofType = what === "of-type";

			return first === 1 && last === 0 ?

				// Shortcut for :nth-*(n)
				function( elem ) {
					return !!elem.parentNode;
				} :

				function( elem, _context, xml ) {
					var cache, outerCache, node, nodeIndex, start,
						dir = simple !== forward ? "nextSibling" : "previousSibling",
						parent = elem.parentNode,
						name = ofType && elem.nodeName.toLowerCase(),
						useCache = !xml && !ofType,
						diff = false;

					if ( parent ) {

						// :(first|last|only)-(child|of-type)
						if ( simple ) {
							while ( dir ) {
								node = elem;
								while ( ( node = node[ dir ] ) ) {
									if ( ofType ?
										nodeName( node, name ) :
										node.nodeType === 1 ) {

										return false;
									}
								}

								// Reverse direction for :only-* (if we haven't yet done so)
								start = dir = type === "only" && !start && "nextSibling";
							}
							return true;
						}

						start = [ forward ? parent.firstChild : parent.lastChild ];

						// non-xml :nth-child(...) stores cache data on `parent`
						if ( forward && useCache ) {

							// Seek `elem` from a previously-cached index
							outerCache = parent[ expando ] || ( parent[ expando ] = {} );
							cache = outerCache[ type ] || [];
							nodeIndex = cache[ 0 ] === dirruns && cache[ 1 ];
							diff = nodeIndex && cache[ 2 ];
							node = nodeIndex && parent.childNodes[ nodeIndex ];

							while ( ( node = ++nodeIndex && node && node[ dir ] ||

								// Fallback to seeking `elem` from the start
								( diff = nodeIndex = 0 ) || start.pop() ) ) {

								// When found, cache indexes on `parent` and break
								if ( node.nodeType === 1 && ++diff && node === elem ) {
									outerCache[ type ] = [ dirruns, nodeIndex, diff ];
									break;
								}
							}

						} else {

							// Use previously-cached element index if available
							if ( useCache ) {
								outerCache = elem[ expando ] || ( elem[ expando ] = {} );
								cache = outerCache[ type ] || [];
								nodeIndex = cache[ 0 ] === dirruns && cache[ 1 ];
								diff = nodeIndex;
							}

							// xml :nth-child(...)
							// or :nth-last-child(...) or :nth(-last)?-of-type(...)
							if ( diff === false ) {

								// Use the same loop as above to seek `elem` from the start
								while ( ( node = ++nodeIndex && node && node[ dir ] ||
									( diff = nodeIndex = 0 ) || start.pop() ) ) {

									if ( ( ofType ?
										nodeName( node, name ) :
										node.nodeType === 1 ) &&
										++diff ) {

										// Cache the index of each encountered element
										if ( useCache ) {
											outerCache = node[ expando ] ||
												( node[ expando ] = {} );
											outerCache[ type ] = [ dirruns, diff ];
										}

										if ( node === elem ) {
											break;
										}
									}
								}
							}
						}

						// Incorporate the offset, then check against cycle size
						diff -= last;
						return diff === first || ( diff % first === 0 && diff / first >= 0 );
					}
				};
		},

		PSEUDO: function( pseudo, argument ) {

			// pseudo-class names are case-insensitive
			// https://www.w3.org/TR/selectors/#pseudo-classes
			// Prioritize by case sensitivity in case custom pseudos are added with uppercase letters
			// Remember that setFilters inherits from pseudos
			var args,
				fn = Expr.pseudos[ pseudo ] || Expr.setFilters[ pseudo.toLowerCase() ] ||
					find.error( "unsupported pseudo: " + pseudo );

			// The user may use createPseudo to indicate that
			// arguments are needed to create the filter function
			// just as jQuery does
			if ( fn[ expando ] ) {
				return fn( argument );
			}

			// But maintain support for old signatures
			if ( fn.length > 1 ) {
				args = [ pseudo, pseudo, "", argument ];
				return Expr.setFilters.hasOwnProperty( pseudo.toLowerCase() ) ?
					markFunction( function( seed, matches ) {
						var idx,
							matched = fn( seed, argument ),
							i = matched.length;
						while ( i-- ) {
							idx = indexOf.call( seed, matched[ i ] );
							seed[ idx ] = !( matches[ idx ] = matched[ i ] );
						}
					} ) :
					function( elem ) {
						return fn( elem, 0, args );
					};
			}

			return fn;
		}
	},

	pseudos: {

		// Potentially complex pseudos
		not: markFunction( function( selector ) {

			// Trim the selector passed to compile
			// to avoid treating leading and trailing
			// spaces as combinators
			var input = [],
				results = [],
				matcher = compile( selector.replace( rtrimCSS, "$1" ) );

			return matcher[ expando ] ?
				markFunction( function( seed, matches, _context, xml ) {
					var elem,
						unmatched = matcher( seed, null, xml, [] ),
						i = seed.length;

					// Match elements unmatched by `matcher`
					while ( i-- ) {
						if ( ( elem = unmatched[ i ] ) ) {
							seed[ i ] = !( matches[ i ] = elem );
						}
					}
				} ) :
				function( elem, _context, xml ) {
					input[ 0 ] = elem;
					matcher( input, null, xml, results );

					// Don't keep the element
					// (see https://github.com/jquery/sizzle/issues/299)
					input[ 0 ] = null;
					return !results.pop();
				};
		} ),

		has: markFunction( function( selector ) {
			return function( elem ) {
				return find( selector, elem ).length > 0;
			};
		} ),

		contains: markFunction( function( text ) {
			text = text.replace( runescape, funescape );
			return function( elem ) {
				return ( elem.textContent || jQuery.text( elem ) ).indexOf( text ) > -1;
			};
		} ),

		// "Whether an element is represented by a :lang() selector
		// is based solely on the element's language value
		// being equal to the identifier C,
		// or beginning with the identifier C immediately followed by "-".
		// The matching of C against the element's language value is performed case-insensitively.
		// The identifier C does not have to be a valid language name."
		// https://www.w3.org/TR/selectors/#lang-pseudo
		lang: markFunction( function( lang ) {

			// lang value must be a valid identifier
			if ( !ridentifier.test( lang || "" ) ) {
				find.error( "unsupported lang: " + lang );
			}
			lang = lang.replace( runescape, funescape ).toLowerCase();
			return function( elem ) {
				var elemLang;
				do {
					if ( ( elemLang = documentIsHTML ?
						elem.lang :
						elem.getAttribute( "xml:lang" ) || elem.getAttribute( "lang" ) ) ) {

						elemLang = elemLang.toLowerCase();
						return elemLang === lang || elemLang.indexOf( lang + "-" ) === 0;
					}
				} while ( ( elem = elem.parentNode ) && elem.nodeType === 1 );
				return false;
			};
		} ),

		// Miscellaneous
		target: function( elem ) {
			var hash = window.location && window.location.hash;
			return hash && hash.slice( 1 ) === elem.id;
		},

		root: function( elem ) {
			return elem === documentElement;
		},

		focus: function( elem ) {
			return elem === safeActiveElement() &&
				document.hasFocus() &&
				!!( elem.type || elem.href || ~elem.tabIndex );
		},

		// Boolean properties
		enabled: createDisabledPseudo( false ),
		disabled: createDisabledPseudo( true ),

		checked: function( elem ) {

			// In CSS3, :checked should return both checked and selected elements
			// https://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
			return ( nodeName( elem, "input" ) && !!elem.checked ) ||
				( nodeName( elem, "option" ) && !!elem.selected );
		},

		selected: function( elem ) {

			// Support: IE <=11+
			// Accessing the selectedIndex property
			// forces the browser to treat the default option as
			// selected when in an optgroup.
			if ( elem.parentNode ) {
				// eslint-disable-next-line no-unused-expressions
				elem.parentNode.selectedIndex;
			}

			return elem.selected === true;
		},

		// Contents
		empty: function( elem ) {

			// https://www.w3.org/TR/selectors/#empty-pseudo
			// :empty is negated by element (1) or content nodes (text: 3; cdata: 4; entity ref: 5),
			//   but not by others (comment: 8; processing instruction: 7; etc.)
			// nodeType < 6 works because attributes (2) do not appear as children
			for ( elem = elem.firstChild; elem; elem = elem.nextSibling ) {
				if ( elem.nodeType < 6 ) {
					return false;
				}
			}
			return true;
		},

		parent: function( elem ) {
			return !Expr.pseudos.empty( elem );
		},

		// Element/input types
		header: function( elem ) {
			return rheader.test( elem.nodeName );
		},

		input: function( elem ) {
			return rinputs.test( elem.nodeName );
		},

		button: function( elem ) {
			return nodeName( elem, "input" ) && elem.type === "button" ||
				nodeName( elem, "button" );
		},

		text: function( elem ) {
			var attr;
			return nodeName( elem, "input" ) && elem.type === "text" &&

				// Support: IE <10 only
				// New HTML5 attribute values (e.g., "search") appear
				// with elem.type === "text"
				( ( attr = elem.getAttribute( "type" ) ) == null ||
					attr.toLowerCase() === "text" );
		},

		// Position-in-collection
		first: createPositionalPseudo( function() {
			return [ 0 ];
		} ),

		last: createPositionalPseudo( function( _matchIndexes, length ) {
			return [ length - 1 ];
		} ),

		eq: createPositionalPseudo( function( _matchIndexes, length, argument ) {
			return [ argument < 0 ? argument + length : argument ];
		} ),

		even: createPositionalPseudo( function( matchIndexes, length ) {
			var i = 0;
			for ( ; i < length; i += 2 ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		} ),

		odd: createPositionalPseudo( function( matchIndexes, length ) {
			var i = 1;
			for ( ; i < length; i += 2 ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		} ),

		lt: createPositionalPseudo( function( matchIndexes, length, argument ) {
			var i;

			if ( argument < 0 ) {
				i = argument + length;
			} else if ( argument > length ) {
				i = length;
			} else {
				i = argument;
			}

			for ( ; --i >= 0; ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		} ),

		gt: createPositionalPseudo( function( matchIndexes, length, argument ) {
			var i = argument < 0 ? argument + length : argument;
			for ( ; ++i < length; ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		} )
	}
};

Expr.pseudos.nth = Expr.pseudos.eq;

// Add button/input type pseudos
for ( i in { radio: true, checkbox: true, file: true, password: true, image: true } ) {
	Expr.pseudos[ i ] = createInputPseudo( i );
}
for ( i in { submit: true, reset: true } ) {
	Expr.pseudos[ i ] = createButtonPseudo( i );
}

// Easy API for creating new setFilters
function setFilters() {}
setFilters.prototype = Expr.filters = Expr.pseudos;
Expr.setFilters = new setFilters();

function tokenize( selector, parseOnly ) {
	var matched, match, tokens, type,
		soFar, groups, preFilters,
		cached = tokenCache[ selector + " " ];

	if ( cached ) {
		return parseOnly ? 0 : cached.slice( 0 );
	}

	soFar = selector;
	groups = [];
	preFilters = Expr.preFilter;

	while ( soFar ) {

		// Comma and first run
		if ( !matched || ( match = rcomma.exec( soFar ) ) ) {
			if ( match ) {

				// Don't consume trailing commas as valid
				soFar = soFar.slice( match[ 0 ].length ) || soFar;
			}
			groups.push( ( tokens = [] ) );
		}

		matched = false;

		// Combinators
		if ( ( match = rleadingCombinator.exec( soFar ) ) ) {
			matched = match.shift();
			tokens.push( {
				value: matched,

				// Cast descendant combinators to space
				type: match[ 0 ].replace( rtrimCSS, " " )
			} );
			soFar = soFar.slice( matched.length );
		}

		// Filters
		for ( type in Expr.filter ) {
			if ( ( match = matchExpr[ type ].exec( soFar ) ) && ( !preFilters[ type ] ||
				( match = preFilters[ type ]( match ) ) ) ) {
				matched = match.shift();
				tokens.push( {
					value: matched,
					type: type,
					matches: match
				} );
				soFar = soFar.slice( matched.length );
			}
		}

		if ( !matched ) {
			break;
		}
	}

	// Return the length of the invalid excess
	// if we're just parsing
	// Otherwise, throw an error or return tokens
	if ( parseOnly ) {
		return soFar.length;
	}

	return soFar ?
		find.error( selector ) :

		// Cache the tokens
		tokenCache( selector, groups ).slice( 0 );
}

function toSelector( tokens ) {
	var i = 0,
		len = tokens.length,
		selector = "";
	for ( ; i < len; i++ ) {
		selector += tokens[ i ].value;
	}
	return selector;
}

function addCombinator( matcher, combinator, base ) {
	var dir = combinator.dir,
		skip = combinator.next,
		key = skip || dir,
		checkNonElements = base && key === "parentNode",
		doneName = done++;

	return combinator.first ?

		// Check against closest ancestor/preceding element
		function( elem, context, xml ) {
			while ( ( elem = elem[ dir ] ) ) {
				if ( elem.nodeType === 1 || checkNonElements ) {
					return matcher( elem, context, xml );
				}
			}
			return false;
		} :

		// Check against all ancestor/preceding elements
		function( elem, context, xml ) {
			var oldCache, outerCache,
				newCache = [ dirruns, doneName ];

			// We can't set arbitrary data on XML nodes, so they don't benefit from combinator caching
			if ( xml ) {
				while ( ( elem = elem[ dir ] ) ) {
					if ( elem.nodeType === 1 || checkNonElements ) {
						if ( matcher( elem, context, xml ) ) {
							return true;
						}
					}
				}
			} else {
				while ( ( elem = elem[ dir ] ) ) {
					if ( elem.nodeType === 1 || checkNonElements ) {
						outerCache = elem[ expando ] || ( elem[ expando ] = {} );

						if ( skip && nodeName( elem, skip ) ) {
							elem = elem[ dir ] || elem;
						} else if ( ( oldCache = outerCache[ key ] ) &&
							oldCache[ 0 ] === dirruns && oldCache[ 1 ] === doneName ) {

							// Assign to newCache so results back-propagate to previous elements
							return ( newCache[ 2 ] = oldCache[ 2 ] );
						} else {

							// Reuse newcache so results back-propagate to previous elements
							outerCache[ key ] = newCache;

							// A match means we're done; a fail means we have to keep checking
							if ( ( newCache[ 2 ] = matcher( elem, context, xml ) ) ) {
								return true;
							}
						}
					}
				}
			}
			return false;
		};
}

function elementMatcher( matchers ) {
	return matchers.length > 1 ?
		function( elem, context, xml ) {
			var i = matchers.length;
			while ( i-- ) {
				if ( !matchers[ i ]( elem, context, xml ) ) {
					return false;
				}
			}
			return true;
		} :
		matchers[ 0 ];
}

function multipleContexts( selector, contexts, results ) {
	var i = 0,
		len = contexts.length;
	for ( ; i < len; i++ ) {
		find( selector, contexts[ i ], results );
	}
	return results;
}

function condense( unmatched, map, filter, context, xml ) {
	var elem,
		newUnmatched = [],
		i = 0,
		len = unmatched.length,
		mapped = map != null;

	for ( ; i < len; i++ ) {
		if ( ( elem = unmatched[ i ] ) ) {
			if ( !filter || filter( elem, context, xml ) ) {
				newUnmatched.push( elem );
				if ( mapped ) {
					map.push( i );
				}
			}
		}
	}

	return newUnmatched;
}

function setMatcher( preFilter, selector, matcher, postFilter, postFinder, postSelector ) {
	if ( postFilter && !postFilter[ expando ] ) {
		postFilter = setMatcher( postFilter );
	}
	if ( postFinder && !postFinder[ expando ] ) {
		postFinder = setMatcher( postFinder, postSelector );
	}
	return markFunction( function( seed, results, context, xml ) {
		var temp, i, elem, matcherOut,
			preMap = [],
			postMap = [],
			preexisting = results.length,

			// Get initial elements from seed or context
			elems = seed ||
				multipleContexts( selector || "*",
					context.nodeType ? [ context ] : context, [] ),

			// Prefilter to get matcher input, preserving a map for seed-results synchronization
			matcherIn = preFilter && ( seed || !selector ) ?
				condense( elems, preMap, preFilter, context, xml ) :
				elems;

		if ( matcher ) {

			// If we have a postFinder, or filtered seed, or non-seed postFilter
			// or preexisting results,
			matcherOut = postFinder || ( seed ? preFilter : preexisting || postFilter ) ?

				// ...intermediate processing is necessary
				[] :

				// ...otherwise use results directly
				results;

			// Find primary matches
			matcher( matcherIn, matcherOut, context, xml );
		} else {
			matcherOut = matcherIn;
		}

		// Apply postFilter
		if ( postFilter ) {
			temp = condense( matcherOut, postMap );
			postFilter( temp, [], context, xml );

			// Un-match failing elements by moving them back to matcherIn
			i = temp.length;
			while ( i-- ) {
				if ( ( elem = temp[ i ] ) ) {
					matcherOut[ postMap[ i ] ] = !( matcherIn[ postMap[ i ] ] = elem );
				}
			}
		}

		if ( seed ) {
			if ( postFinder || preFilter ) {
				if ( postFinder ) {

					// Get the final matcherOut by condensing this intermediate into postFinder contexts
					temp = [];
					i = matcherOut.length;
					while ( i-- ) {
						if ( ( elem = matcherOut[ i ] ) ) {

							// Restore matcherIn since elem is not yet a final match
							temp.push( ( matcherIn[ i ] = elem ) );
						}
					}
					postFinder( null, ( matcherOut = [] ), temp, xml );
				}

				// Move matched elements from seed to results to keep them synchronized
				i = matcherOut.length;
				while ( i-- ) {
					if ( ( elem = matcherOut[ i ] ) &&
						( temp = postFinder ? indexOf.call( seed, elem ) : preMap[ i ] ) > -1 ) {

						seed[ temp ] = !( results[ temp ] = elem );
					}
				}
			}

		// Add elements to results, through postFinder if defined
		} else {
			matcherOut = condense(
				matcherOut === results ?
					matcherOut.splice( preexisting, matcherOut.length ) :
					matcherOut
			);
			if ( postFinder ) {
				postFinder( null, results, matcherOut, xml );
			} else {
				push.apply( results, matcherOut );
			}
		}
	} );
}

function matcherFromTokens( tokens ) {
	var checkContext, matcher, j,
		len = tokens.length,
		leadingRelative = Expr.relative[ tokens[ 0 ].type ],
		implicitRelative = leadingRelative || Expr.relative[ " " ],
		i = leadingRelative ? 1 : 0,

		// The foundational matcher ensures that elements are reachable from top-level context(s)
		matchContext = addCombinator( function( elem ) {
			return elem === checkContext;
		}, implicitRelative, true ),
		matchAnyContext = addCombinator( function( elem ) {
			return indexOf.call( checkContext, elem ) > -1;
		}, implicitRelative, true ),
		matchers = [ function( elem, context, xml ) {

			// Support: IE 11+, Edge 17 - 18+
			// IE/Edge sometimes throw a "Permission denied" error when strict-comparing
			// two documents; shallow comparisons work.
			// eslint-disable-next-line eqeqeq
			var ret = ( !leadingRelative && ( xml || context != outermostContext ) ) || (
				( checkContext = context ).nodeType ?
					matchContext( elem, context, xml ) :
					matchAnyContext( elem, context, xml ) );

			// Avoid hanging onto element
			// (see https://github.com/jquery/sizzle/issues/299)
			checkContext = null;
			return ret;
		} ];

	for ( ; i < len; i++ ) {
		if ( ( matcher = Expr.relative[ tokens[ i ].type ] ) ) {
			matchers = [ addCombinator( elementMatcher( matchers ), matcher ) ];
		} else {
			matcher = Expr.filter[ tokens[ i ].type ].apply( null, tokens[ i ].matches );

			// Return special upon seeing a positional matcher
			if ( matcher[ expando ] ) {

				// Find the next relative operator (if any) for proper handling
				j = ++i;
				for ( ; j < len; j++ ) {
					if ( Expr.relative[ tokens[ j ].type ] ) {
						break;
					}
				}
				return setMatcher(
					i > 1 && elementMatcher( matchers ),
					i > 1 && toSelector(

						// If the preceding token was a descendant combinator, insert an implicit any-element `*`
						tokens.slice( 0, i - 1 )
							.concat( { value: tokens[ i - 2 ].type === " " ? "*" : "" } )
					).replace( rtrimCSS, "$1" ),
					matcher,
					i < j && matcherFromTokens( tokens.slice( i, j ) ),
					j < len && matcherFromTokens( ( tokens = tokens.slice( j ) ) ),
					j < len && toSelector( tokens )
				);
			}
			matchers.push( matcher );
		}
	}

	return elementMatcher( matchers );
}

function matcherFromGroupMatchers( elementMatchers, setMatchers ) {
	var bySet = setMatchers.length > 0,
		byElement = elementMatchers.length > 0,
		superMatcher = function( seed, context, xml, results, outermost ) {
			var elem, j, matcher,
				matchedCount = 0,
				i = "0",
				unmatched = seed && [],
				setMatched = [],
				contextBackup = outermostContext,

				// We must always have either seed elements or outermost context
				elems = seed || byElement && Expr.find.TAG( "*", outermost ),

				// Use integer dirruns iff this is the outermost matcher
				dirrunsUnique = ( dirruns += contextBackup == null ? 1 : Math.random() || 0.1 ),
				len = elems.length;

			if ( outermost ) {

				// Support: IE 11+, Edge 17 - 18+
				// IE/Edge sometimes throw a "Permission denied" error when strict-comparing
				// two documents; shallow comparisons work.
				// eslint-disable-next-line eqeqeq
				outermostContext = context == document || context || outermost;
			}

			// Add elements passing elementMatchers directly to results
			// Support: iOS <=7 - 9 only
			// Tolerate NodeList properties (IE: "length"; Safari: <number>) matching
			// elements by id. (see trac-14142)
			for ( ; i !== len && ( elem = elems[ i ] ) != null; i++ ) {
				if ( byElement && elem ) {
					j = 0;

					// Support: IE 11+, Edge 17 - 18+
					// IE/Edge sometimes throw a "Permission denied" error when strict-comparing
					// two documents; shallow comparisons work.
					// eslint-disable-next-line eqeqeq
					if ( !context && elem.ownerDocument != document ) {
						setDocument( elem );
						xml = !documentIsHTML;
					}
					while ( ( matcher = elementMatchers[ j++ ] ) ) {
						if ( matcher( elem, context || document, xml ) ) {
							push.call( results, elem );
							break;
						}
					}
					if ( outermost ) {
						dirruns = dirrunsUnique;
					}
				}

				// Track unmatched elements for set filters
				if ( bySet ) {

					// They will have gone through all possible matchers
					if ( ( elem = !matcher && elem ) ) {
						matchedCount--;
					}

					// Lengthen the array for every element, matched or not
					if ( seed ) {
						unmatched.push( elem );
					}
				}
			}

			// `i` is now the count of elements visited above, and adding it to `matchedCount`
			// makes the latter nonnegative.
			matchedCount += i;

			// Apply set filters to unmatched elements
			// NOTE: This can be skipped if there are no unmatched elements (i.e., `matchedCount`
			// equals `i`), unless we didn't visit _any_ elements in the above loop because we have
			// no element matchers and no seed.
			// Incrementing an initially-string "0" `i` allows `i` to remain a string only in that
			// case, which will result in a "00" `matchedCount` that differs from `i` but is also
			// numerically zero.
			if ( bySet && i !== matchedCount ) {
				j = 0;
				while ( ( matcher = setMatchers[ j++ ] ) ) {
					matcher( unmatched, setMatched, context, xml );
				}

				if ( seed ) {

					// Reintegrate element matches to eliminate the need for sorting
					if ( matchedCount > 0 ) {
						while ( i-- ) {
							if ( !( unmatched[ i ] || setMatched[ i ] ) ) {
								setMatched[ i ] = pop.call( results );
							}
						}
					}

					// Discard index placeholder values to get only actual matches
					setMatched = condense( setMatched );
				}

				// Add matches to results
				push.apply( results, setMatched );

				// Seedless set matches succeeding multiple successful matchers stipulate sorting
				if ( outermost && !seed && setMatched.length > 0 &&
					( matchedCount + setMatchers.length ) > 1 ) {

					jQuery.uniqueSort( results );
				}
			}

			// Override manipulation of globals by nested matchers
			if ( outermost ) {
				dirruns = dirrunsUnique;
				outermostContext = contextBackup;
			}

			return unmatched;
		};

	return bySet ?
		markFunction( superMatcher ) :
		superMatcher;
}

function compile( selector, match /* Internal Use Only */ ) {
	var i,
		setMatchers = [],
		elementMatchers = [],
		cached = compilerCache[ selector + " " ];

	if ( !cached ) {

		// Generate a function of recursive functions that can be used to check each element
		if ( !match ) {
			match = tokenize( selector );
		}
		i = match.length;
		while ( i-- ) {
			cached = matcherFromTokens( match[ i ] );
			if ( cached[ expando ] ) {
				setMatchers.push( cached );
			} else {
				elementMatchers.push( cached );
			}
		}

		// Cache the compiled function
		cached = compilerCache( selector,
			matcherFromGroupMatchers( elementMatchers, setMatchers ) );

		// Save selector and tokenization
		cached.selector = selector;
	}
	return cached;
}

/**
 * A low-level selection function that works with jQuery's compiled
 *  selector functions
 * @param {String|Function} selector A selector or a pre-compiled
 *  selector function built with jQuery selector compile
 * @param {Element} context
 * @param {Array} [results]
 * @param {Array} [seed] A set of elements to match against
 */
function select( selector, context, results, seed ) {
	var i, tokens, token, type, find,
		compiled = typeof selector === "function" && selector,
		match = !seed && tokenize( ( selector = compiled.selector || selector ) );

	results = results || [];

	// Try to minimize operations if there is only one selector in the list and no seed
	// (the latter of which guarantees us context)
	if ( match.length === 1 ) {

		// Reduce context if the leading compound selector is an ID
		tokens = match[ 0 ] = match[ 0 ].slice( 0 );
		if ( tokens.length > 2 && ( token = tokens[ 0 ] ).type === "ID" &&
				context.nodeType === 9 && documentIsHTML && Expr.relative[ tokens[ 1 ].type ] ) {

			context = ( Expr.find.ID(
				token.matches[ 0 ].replace( runescape, funescape ),
				context
			) || [] )[ 0 ];
			if ( !context ) {
				return results;

			// Precompiled matchers will still verify ancestry, so step up a level
			} else if ( compiled ) {
				context = context.parentNode;
			}

			selector = selector.slice( tokens.shift().value.length );
		}

		// Fetch a seed set for right-to-left matching
		i = matchExpr.needsContext.test( selector ) ? 0 : tokens.length;
		while ( i-- ) {
			token = tokens[ i ];

			// Abort if we hit a combinator
			if ( Expr.relative[ ( type = token.type ) ] ) {
				break;
			}
			if ( ( find = Expr.find[ type ] ) ) {

				// Search, expanding context for leading sibling combinators
				if ( ( seed = find(
					token.matches[ 0 ].replace( runescape, funescape ),
					rsibling.test( tokens[ 0 ].type ) &&
						testContext( context.parentNode ) || context
				) ) ) {

					// If seed is empty or no tokens remain, we can return early
					tokens.splice( i, 1 );
					selector = seed.length && toSelector( tokens );
					if ( !selector ) {
						push.apply( results, seed );
						return results;
					}

					break;
				}
			}
		}
	}

	// Compile and execute a filtering function if one is not provided
	// Provide `match` to avoid retokenization if we modified the selector above
	( compiled || compile( selector, match ) )(
		seed,
		context,
		!documentIsHTML,
		results,
		!context || rsibling.test( selector ) && testContext( context.parentNode ) || context
	);
	return results;
}

// One-time assignments

// Support: Android <=4.0 - 4.1+
// Sort stability
support.sortStable = expando.split( "" ).sort( sortOrder ).join( "" ) === expando;

// Initialize against the default document
setDocument();

// Support: Android <=4.0 - 4.1+
// Detached nodes confoundingly follow *each other*
support.sortDetached = assert( function( el ) {

	// Should return 1, but returns 4 (following)
	return el.compareDocumentPosition( document.createElement( "fieldset" ) ) & 1;
} );

jQuery.find = find;

// Deprecated
jQuery.expr[ ":" ] = jQuery.expr.pseudos;
jQuery.unique = jQuery.uniqueSort;

// These have always been private, but they used to be documented as part of
// Sizzle so let's maintain them for now for backwards compatibility purposes.
find.compile = compile;
find.select = select;
find.setDocument = setDocument;
find.tokenize = tokenize;

find.escape = jQuery.escapeSelector;
find.getText = jQuery.text;
find.isXML = jQuery.isXMLDoc;
find.selectors = jQuery.expr;
find.support = jQuery.support;
find.uniqueSort = jQuery.uniqueSort;

	/* eslint-enable */

} )();


var dir = function( elem, dir, until ) {
	var matched = [],
		truncate = until !== undefined;

	while ( ( elem = elem[ dir ] ) && elem.nodeType !== 9 ) {
		if ( elem.nodeType === 1 ) {
			if ( truncate && jQuery( elem ).is( until ) ) {
				break;
			}
			matched.push( elem );
		}
	}
	return matched;
};


var siblings = function( n, elem ) {
	var matched = [];

	for ( ; n; n = n.nextSibling ) {
		if ( n.nodeType === 1 && n !== elem ) {
			matched.push( n );
		}
	}

	return matched;
};


var rneedsContext = jQuery.expr.match.needsContext;

var rsingleTag = ( /^<([a-z][^\/\0>:\x20\t\r\n\f]*)[\x20\t\r\n\f]*\/?>(?:<\/\1>|)$/i );



// Implement the identical functionality for filter and not
function winnow( elements, qualifier, not ) {
	if ( isFunction( qualifier ) ) {
		return jQuery.grep( elements, function( elem, i ) {
			return !!qualifier.call( elem, i, elem ) !== not;
		} );
	}

	// Single element
	if ( qualifier.nodeType ) {
		return jQuery.grep( elements, function( elem ) {
			return ( elem === qualifier ) !== not;
		} );
	}

	// Arraylike of elements (jQuery, arguments, Array)
	if ( typeof qualifier !== "string" ) {
		return jQuery.grep( elements, function( elem ) {
			return ( indexOf.call( qualifier, elem ) > -1 ) !== not;
		} );
	}

	// Filtered directly for both simple and complex selectors
	return jQuery.filter( qualifier, elements, not );
}

jQuery.filter = function( expr, elems, not ) {
	var elem = elems[ 0 ];

	if ( not ) {
		expr = ":not(" + expr + ")";
	}

	if ( elems.length === 1 && elem.nodeType === 1 ) {
		return jQuery.find.matchesSelector( elem, expr ) ? [ elem ] : [];
	}

	return jQuery.find.matches( expr, jQuery.grep( elems, function( elem ) {
		return elem.nodeType === 1;
	} ) );
};

jQuery.fn.extend( {
	find: function( selector ) {
		var i, ret,
			len = this.length,
			self = this;

		if ( typeof selector !== "string" ) {
			return this.pushStack( jQuery( selector ).filter( function() {
				for ( i = 0; i < len; i++ ) {
					if ( jQuery.contains( self[ i ], this ) ) {
						return true;
					}
				}
			} ) );
		}

		ret = this.pushStack( [] );

		for ( i = 0; i < len; i++ ) {
			jQuery.find( selector, self[ i ], ret );
		}

		return len > 1 ? jQuery.uniqueSort( ret ) : ret;
	},
	filter: function( selector ) {
		return this.pushStack( winnow( this, selector || [], false ) );
	},
	not: function( selector ) {
		return this.pushStack( winnow( this, selector || [], true ) );
	},
	is: function( selector ) {
		return !!winnow(
			this,

			// If this is a positional/relative selector, check membership in the returned set
			// so $("p:first").is("p:last") won't return true for a doc with two "p".
			typeof selector === "string" && rneedsContext.test( selector ) ?
				jQuery( selector ) :
				selector || [],
			false
		).length;
	}
} );


// Initialize a jQuery object


// A central reference to the root jQuery(document)
var rootjQuery,

	// A simple way to check for HTML strings
	// Prioritize #id over <tag> to avoid XSS via location.hash (trac-9521)
	// Strict HTML recognition (trac-11290: must start with <)
	// Shortcut simple #id case for speed
	rquickExpr = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]+))$/,

	init = jQuery.fn.init = function( selector, context, root ) {
		var match, elem;

		// HANDLE: $(""), $(null), $(undefined), $(false)
		if ( !selector ) {
			return this;
		}

		// Method init() accepts an alternate rootjQuery
		// so migrate can support jQuery.sub (gh-2101)
		root = root || rootjQuery;

		// Handle HTML strings
		if ( typeof selector === "string" ) {
			if ( selector[ 0 ] === "<" &&
				selector[ selector.length - 1 ] === ">" &&
				selector.length >= 3 ) {

				// Assume that strings that start and end with <> are HTML and skip the regex check
				match = [ null, selector, null ];

			} else {
				match = rquickExpr.exec( selector );
			}

			// Match html or make sure no context is specified for #id
			if ( match && ( match[ 1 ] || !context ) ) {

				// HANDLE: $(html) -> $(array)
				if ( match[ 1 ] ) {
					context = context instanceof jQuery ? context[ 0 ] : context;

					// Option to run scripts is true for back-compat
					// Intentionally let the error be thrown if parseHTML is not present
					jQuery.merge( this, jQuery.parseHTML(
						match[ 1 ],
						context && context.nodeType ? context.ownerDocument || context : document,
						true
					) );

					// HANDLE: $(html, props)
					if ( rsingleTag.test( match[ 1 ] ) && jQuery.isPlainObject( context ) ) {
						for ( match in context ) {

							// Properties of context are called as methods if possible
							if ( isFunction( this[ match ] ) ) {
								this[ match ]( context[ match ] );

							// ...and otherwise set as attributes
							} else {
								this.attr( match, context[ match ] );
							}
						}
					}

					return this;

				// HANDLE: $(#id)
				} else {
					elem = document.getElementById( match[ 2 ] );

					if ( elem ) {

						// Inject the element directly into the jQuery object
						this[ 0 ] = elem;
						this.length = 1;
					}
					return this;
				}

			// HANDLE: $(expr, $(...))
			} else if ( !context || context.jquery ) {
				return ( context || root ).find( selector );

			// HANDLE: $(expr, context)
			// (which is just equivalent to: $(context).find(expr)
			} else {
				return this.constructor( context ).find( selector );
			}

		// HANDLE: $(DOMElement)
		} else if ( selector.nodeType ) {
			this[ 0 ] = selector;
			this.length = 1;
			return this;

		// HANDLE: $(function)
		// Shortcut for document ready
		} else if ( isFunction( selector ) ) {
			return root.ready !== undefined ?
				root.ready( selector ) :

				// Execute immediately if ready is not present
				selector( jQuery );
		}

		return jQuery.makeArray( selector, this );
	};

// Give the init function the jQuery prototype for later instantiation
init.prototype = jQuery.fn;

// Initialize central reference
rootjQuery = jQuery( document );


var rparentsprev = /^(?:parents|prev(?:Until|All))/,

	// Methods guaranteed to produce a unique set when starting from a unique set
	guaranteedUnique = {
		children: true,
		contents: true,
		next: true,
		prev: true
	};

jQuery.fn.extend( {
	has: function( target ) {
		var targets = jQuery( target, this ),
			l = targets.length;

		return this.filter( function() {
			var i = 0;
			for ( ; i < l; i++ ) {
				if ( jQuery.contains( this, targets[ i ] ) ) {
					return true;
				}
			}
		} );
	},

	closest: function( selectors, context ) {
		var cur,
			i = 0,
			l = this.length,
			matched = [],
			targets = typeof selectors !== "string" && jQuery( selectors );

		// Positional selectors never match, since there's no _selection_ context
		if ( !rneedsContext.test( selectors ) ) {
			for ( ; i < l; i++ ) {
				for ( cur = this[ i ]; cur && cur !== context; cur = cur.parentNode ) {

					// Always skip document fragments
					if ( cur.nodeType < 11 && ( targets ?
						targets.index( cur ) > -1 :

						// Don't pass non-elements to jQuery#find
						cur.nodeType === 1 &&
							jQuery.find.matchesSelector( cur, selectors ) ) ) {

						matched.push( cur );
						break;
					}
				}
			}
		}

		return this.pushStack( matched.length > 1 ? jQuery.uniqueSort( matched ) : matched );
	},

	// Determine the position of an element within the set
	index: function( elem ) {

		// No argument, return index in parent
		if ( !elem ) {
			return ( this[ 0 ] && this[ 0 ].parentNode ) ? this.first().prevAll().length : -1;
		}

		// Index in selector
		if ( typeof elem === "string" ) {
			return indexOf.call( jQuery( elem ), this[ 0 ] );
		}

		// Locate the position of the desired element
		return indexOf.call( this,

			// If it receives a jQuery object, the first element is used
			elem.jquery ? elem[ 0 ] : elem
		);
	},

	add: function( selector, context ) {
		return this.pushStack(
			jQuery.uniqueSort(
				jQuery.merge( this.get(), jQuery( selector, context ) )
			)
		);
	},

	addBack: function( selector ) {
		return this.add( selector == null ?
			this.prevObject : this.prevObject.filter( selector )
		);
	}
} );

function sibling( cur, dir ) {
	while ( ( cur = cur[ dir ] ) && cur.nodeType !== 1 ) {}
	return cur;
}

jQuery.each( {
	parent: function( elem ) {
		var parent = elem.parentNode;
		return parent && parent.nodeType !== 11 ? parent : null;
	},
	parents: function( elem ) {
		return dir( elem, "parentNode" );
	},
	parentsUntil: function( elem, _i, until ) {
		return dir( elem, "parentNode", until );
	},
	next: function( elem ) {
		return sibling( elem, "nextSibling" );
	},
	prev: function( elem ) {
		return sibling( elem, "previousSibling" );
	},
	nextAll: function( elem ) {
		return dir( elem, "nextSibling" );
	},
	prevAll: function( elem ) {
		return dir( elem, "previousSibling" );
	},
	nextUntil: function( elem, _i, until ) {
		return dir( elem, "nextSibling", until );
	},
	prevUntil: function( elem, _i, until ) {
		return dir( elem, "previousSibling", until );
	},
	siblings: function( elem ) {
		return siblings( ( elem.parentNode || {} ).firstChild, elem );
	},
	children: function( elem ) {
		return siblings( elem.firstChild );
	},
	contents: function( elem ) {
		if ( elem.contentDocument != null &&

			// Support: IE 11+
			// <object> elements with no `data` attribute has an object
			// `contentDocument` with a `null` prototype.
			getProto( elem.contentDocument ) ) {

			return elem.contentDocument;
		}

		// Support: IE 9 - 11 only, iOS 7 only, Android Browser <=4.3 only
		// Treat the template element as a regular one in browsers that
		// don't support it.
		if ( nodeName( elem, "template" ) ) {
			elem = elem.content || elem;
		}

		return jQuery.merge( [], elem.childNodes );
	}
}, function( name, fn ) {
	jQuery.fn[ name ] = function( until, selector ) {
		var matched = jQuery.map( this, fn, until );

		if ( name.slice( -5 ) !== "Until" ) {
			selector = until;
		}

		if ( selector && typeof selector === "string" ) {
			matched = jQuery.filter( selector, matched );
		}

		if ( this.length > 1 ) {

			// Remove duplicates
			if ( !guaranteedUnique[ name ] ) {
				jQuery.uniqueSort( matched );
			}

			// Reverse order for parents* and prev-derivatives
			if ( rparentsprev.test( name ) ) {
				matched.reverse();
			}
		}

		return this.pushStack( matched );
	};
} );
var rnothtmlwhite = ( /[^\x20\t\r\n\f]+/g );



// Convert String-formatted options into Object-formatted ones
function createOptions( options ) {
	var object = {};
	jQuery.each( options.match( rnothtmlwhite ) || [], function( _, flag ) {
		object[ flag ] = true;
	} );
	return object;
}

/*
 * Create a callback list using the following parameters:
 *
 *	options: an optional list of space-separated options that will change how
 *			the callback list behaves or a more traditional option object
 *
 * By default a callback list will act like an event callback list and can be
 * "fired" multiple times.
 *
 * Possible options:
 *
 *	once:			will ensure the callback list can only be fired once (like a Deferred)
 *
 *	memory:			will keep track of previous values and will call any callback added
 *					after the list has been fired right away with the latest "memorized"
 *					values (like a Deferred)
 *
 *	unique:			will ensure a callback can only be added once (no duplicate in the list)
 *
 *	stopOnFalse:	interrupt callings when a callback returns false
 *
 */
jQuery.Callbacks = function( options ) {

	// Convert options from String-formatted to Object-formatted if needed
	// (we check in cache first)
	options = typeof options === "string" ?
		createOptions( options ) :
		jQuery.extend( {}, options );

	var // Flag to know if list is currently firing
		firing,

		// Last fire value for non-forgettable lists
		memory,

		// Flag to know if list was already fired
		fired,

		// Flag to prevent firing
		locked,

		// Actual callback list
		list = [],

		// Queue of execution data for repeatable lists
		queue = [],

		// Index of currently firing callback (modified by add/remove as needed)
		firingIndex = -1,

		// Fire callbacks
		fire = function() {

			// Enforce single-firing
			locked = locked || options.once;

			// Execute callbacks for all pending executions,
			// respecting firingIndex overrides and runtime changes
			fired = firing = true;
			for ( ; queue.length; firingIndex = -1 ) {
				memory = queue.shift();
				while ( ++firingIndex < list.length ) {

					// Run callback and check for early termination
					if ( list[ firingIndex ].apply( memory[ 0 ], memory[ 1 ] ) === false &&
						options.stopOnFalse ) {

						// Jump to end and forget the data so .add doesn't re-fire
						firingIndex = list.length;
						memory = false;
					}
				}
			}

			// Forget the data if we're done with it
			if ( !options.memory ) {
				memory = false;
			}

			firing = false;

			// Clean up if we're done firing for good
			if ( locked ) {

				// Keep an empty list if we have data for future add calls
				if ( memory ) {
					list = [];

				// Otherwise, this object is spent
				} else {
					list = "";
				}
			}
		},

		// Actual Callbacks object
		self = {

			// Add a callback or a collection of callbacks to the list
			add: function() {
				if ( list ) {

					// If we have memory from a past run, we should fire after adding
					if ( memory && !firing ) {
						firingIndex = list.length - 1;
						queue.push( memory );
					}

					( function add( args ) {
						jQuery.each( args, function( _, arg ) {
							if ( isFunction( arg ) ) {
								if ( !options.unique || !self.has( arg ) ) {
									list.push( arg );
								}
							} else if ( arg && arg.length && toType( arg ) !== "string" ) {

								// Inspect recursively
								add( arg );
							}
						} );
					} )( arguments );

					if ( memory && !firing ) {
						fire();
					}
				}
				return this;
			},

			// Remove a callback from the list
			remove: function() {
				jQuery.each( arguments, function( _, arg ) {
					var index;
					while ( ( index = jQuery.inArray( arg, list, index ) ) > -1 ) {
						list.splice( index, 1 );

						// Handle firing indexes
						if ( index <= firingIndex ) {
							firingIndex--;
						}
					}
				} );
				return this;
			},

			// Check if a given callback is in the list.
			// If no argument is given, return whether or not list has callbacks attached.
			has: function( fn ) {
				return fn ?
					jQuery.inArray( fn, list ) > -1 :
					list.length > 0;
			},

			// Remove all callbacks from the list
			empty: function() {
				if ( list ) {
					list = [];
				}
				return this;
			},

			// Disable .fire and .add
			// Abort any current/pending executions
			// Clear all callbacks and values
			disable: function() {
				locked = queue = [];
				list = memory = "";
				return this;
			},
			disabled: function() {
				return !list;
			},

			// Disable .fire
			// Also disable .add unless we have memory (since it would have no effect)
			// Abort any pending executions
			lock: function() {
				locked = queue = [];
				if ( !memory && !firing ) {
					list = memory = "";
				}
				return this;
			},
			locked: function() {
				return !!locked;
			},

			// Call all callbacks with the given context and arguments
			fireWith: function( context, args ) {
				if ( !locked ) {
					args = args || [];
					args = [ context, args.slice ? args.slice() : args ];
					queue.push( args );
					if ( !firing ) {
						fire();
					}
				}
				return this;
			},

			// Call all the callbacks with the given arguments
			fire: function() {
				self.fireWith( this, arguments );
				return this;
			},

			// To know if the callbacks have already been called at least once
			fired: function() {
				return !!fired;
			}
		};

	return self;
};


function Identity( v ) {
	return v;
}
function Thrower( ex ) {
	throw ex;
}

function adoptValue( value, resolve, reject, noValue ) {
	var method;

	try {

		// Check for promise aspect first to privilege synchronous behavior
		if ( value && isFunction( ( method = value.promise ) ) ) {
			method.call( value ).done( resolve ).fail( reject );

		// Other thenables
		} else if ( value && isFunction( ( method = value.then ) ) ) {
			method.call( value, resolve, reject );

		// Other non-thenables
		} else {

			// Control `resolve` arguments by letting Array#slice cast boolean `noValue` to integer:
			// * false: [ value ].slice( 0 ) => resolve( value )
			// * true: [ value ].slice( 1 ) => resolve()
			resolve.apply( undefined, [ value ].slice( noValue ) );
		}

	// For Promises/A+, convert exceptions into rejections
	// Since jQuery.when doesn't unwrap thenables, we can skip the extra checks appearing in
	// Deferred#then to conditionally suppress rejection.
	} catch ( value ) {

		// Support: Android 4.0 only
		// Strict mode functions invoked without .call/.apply get global-object context
		reject.apply( undefined, [ value ] );
	}
}

jQuery.extend( {

	Deferred: function( func ) {
		var tuples = [

				// action, add listener, callbacks,
				// ... .then handlers, argument index, [final state]
				[ "notify", "progress", jQuery.Callbacks( "memory" ),
					jQuery.Callbacks( "memory" ), 2 ],
				[ "resolve", "done", jQuery.Callbacks( "once memory" ),
					jQuery.Callbacks( "once memory" ), 0, "resolved" ],
				[ "reject", "fail", jQuery.Callbacks( "once memory" ),
					jQuery.Callbacks( "once memory" ), 1, "rejected" ]
			],
			state = "pending",
			promise = {
				state: function() {
					return state;
				},
				always: function() {
					deferred.done( arguments ).fail( arguments );
					return this;
				},
				"catch": function( fn ) {
					return promise.then( null, fn );
				},

				// Keep pipe for back-compat
				pipe: function( /* fnDone, fnFail, fnProgress */ ) {
					var fns = arguments;

					return jQuery.Deferred( function( newDefer ) {
						jQuery.each( tuples, function( _i, tuple ) {

							// Map tuples (progress, done, fail) to arguments (done, fail, progress)
							var fn = isFunction( fns[ tuple[ 4 ] ] ) && fns[ tuple[ 4 ] ];

							// deferred.progress(function() { bind to newDefer or newDefer.notify })
							// deferred.done(function() { bind to newDefer or newDefer.resolve })
							// deferred.fail(function() { bind to newDefer or newDefer.reject })
							deferred[ tuple[ 1 ] ]( function() {
								var returned = fn && fn.apply( this, arguments );
								if ( returned && isFunction( returned.promise ) ) {
									returned.promise()
										.progress( newDefer.notify )
										.done( newDefer.resolve )
										.fail( newDefer.reject );
								} else {
									newDefer[ tuple[ 0 ] + "With" ](
										this,
										fn ? [ returned ] : arguments
									);
								}
							} );
						} );
						fns = null;
					} ).promise();
				},
				then: function( onFulfilled, onRejected, onProgress ) {
					var maxDepth = 0;
					function resolve( depth, deferred, handler, special ) {
						return function() {
							var that = this,
								args = arguments,
								mightThrow = function() {
									var returned, then;

									// Support: Promises/A+ section 2.3.3.3.3
									// https://promisesaplus.com/#point-59
									// Ignore double-resolution attempts
									if ( depth < maxDepth ) {
										return;
									}

									returned = handler.apply( that, args );

									// Support: Promises/A+ section 2.3.1
									// https://promisesaplus.com/#point-48
									if ( returned === deferred.promise() ) {
										throw new TypeError( "Thenable self-resolution" );
									}

									// Support: Promises/A+ sections 2.3.3.1, 3.5
									// https://promisesaplus.com/#point-54
									// https://promisesaplus.com/#point-75
									// Retrieve `then` only once
									then = returned &&

										// Support: Promises/A+ section 2.3.4
										// https://promisesaplus.com/#point-64
										// Only check objects and functions for thenability
										( typeof returned === "object" ||
											typeof returned === "function" ) &&
										returned.then;

									// Handle a returned thenable
									if ( isFunction( then ) ) {

										// Special processors (notify) just wait for resolution
										if ( special ) {
											then.call(
												returned,
												resolve( maxDepth, deferred, Identity, special ),
												resolve( maxDepth, deferred, Thrower, special )
											);

										// Normal processors (resolve) also hook into progress
										} else {

											// ...and disregard older resolution values
											maxDepth++;

											then.call(
												returned,
												resolve( maxDepth, deferred, Identity, special ),
												resolve( maxDepth, deferred, Thrower, special ),
												resolve( maxDepth, deferred, Identity,
													deferred.notifyWith )
											);
										}

									// Handle all other returned values
									} else {

										// Only substitute handlers pass on context
										// and multiple values (non-spec behavior)
										if ( handler !== Identity ) {
											that = undefined;
											args = [ returned ];
										}

										// Process the value(s)
										// Default process is resolve
										( special || deferred.resolveWith )( that, args );
									}
								},

								// Only normal processors (resolve) catch and reject exceptions
								process = special ?
									mightThrow :
									function() {
										try {
											mightThrow();
										} catch ( e ) {

											if ( jQuery.Deferred.exceptionHook ) {
												jQuery.Deferred.exceptionHook( e,
													process.error );
											}

											// Support: Promises/A+ section 2.3.3.3.4.1
											// https://promisesaplus.com/#point-61
											// Ignore post-resolution exceptions
											if ( depth + 1 >= maxDepth ) {

												// Only substitute handlers pass on context
												// and multiple values (non-spec behavior)
												if ( handler !== Thrower ) {
													that = undefined;
													args = [ e ];
												}

												deferred.rejectWith( that, args );
											}
										}
									};

							// Support: Promises/A+ section 2.3.3.3.1
							// https://promisesaplus.com/#point-57
							// Re-resolve promises immediately to dodge false rejection from
							// subsequent errors
							if ( depth ) {
								process();
							} else {

								// Call an optional hook to record the error, in case of exception
								// since it's otherwise lost when execution goes async
								if ( jQuery.Deferred.getErrorHook ) {
									process.error = jQuery.Deferred.getErrorHook();

								// The deprecated alias of the above. While the name suggests
								// returning the stack, not an error instance, jQuery just passes
								// it directly to `console.warn` so both will work; an instance
								// just better cooperates with source maps.
								} else if ( jQuery.Deferred.getStackHook ) {
									process.error = jQuery.Deferred.getStackHook();
								}
								window.setTimeout( process );
							}
						};
					}

					return jQuery.Deferred( function( newDefer ) {

						// progress_handlers.add( ... )
						tuples[ 0 ][ 3 ].add(
							resolve(
								0,
								newDefer,
								isFunction( onProgress ) ?
									onProgress :
									Identity,
								newDefer.notifyWith
							)
						);

						// fulfilled_handlers.add( ... )
						tuples[ 1 ][ 3 ].add(
							resolve(
								0,
								newDefer,
								isFunction( onFulfilled ) ?
									onFulfilled :
									Identity
							)
						);

						// rejected_handlers.add( ... )
						tuples[ 2 ][ 3 ].add(
							resolve(
								0,
								newDefer,
								isFunction( onRejected ) ?
									onRejected :
									Thrower
							)
						);
					} ).promise();
				},

				// Get a promise for this deferred
				// If obj is provided, the promise aspect is added to the object
				promise: function( obj ) {
					return obj != null ? jQuery.extend( obj, promise ) : promise;
				}
			},
			deferred = {};

		// Add list-specific methods
		jQuery.each( tuples, function( i, tuple ) {
			var list = tuple[ 2 ],
				stateString = tuple[ 5 ];

			// promise.progress = list.add
			// promise.done = list.add
			// promise.fail = list.add
			promise[ tuple[ 1 ] ] = list.add;

			// Handle state
			if ( stateString ) {
				list.add(
					function() {

						// state = "resolved" (i.e., fulfilled)
						// state = "rejected"
						state = stateString;
					},

					// rejected_callbacks.disable
					// fulfilled_callbacks.disable
					tuples[ 3 - i ][ 2 ].disable,

					// rejected_handlers.disable
					// fulfilled_handlers.disable
					tuples[ 3 - i ][ 3 ].disable,

					// progress_callbacks.lock
					tuples[ 0 ][ 2 ].lock,

					// progress_handlers.lock
					tuples[ 0 ][ 3 ].lock
				);
			}

			// progress_handlers.fire
			// fulfilled_handlers.fire
			// rejected_handlers.fire
			list.add( tuple[ 3 ].fire );

			// deferred.notify = function() { deferred.notifyWith(...) }
			// deferred.resolve = function() { deferred.resolveWith(...) }
			// deferred.reject = function() { deferred.rejectWith(...) }
			deferred[ tuple[ 0 ] ] = function() {
				deferred[ tuple[ 0 ] + "With" ]( this === deferred ? undefined : this, arguments );
				return this;
			};

			// deferred.notifyWith = list.fireWith
			// deferred.resolveWith = list.fireWith
			// deferred.rejectWith = list.fireWith
			deferred[ tuple[ 0 ] + "With" ] = list.fireWith;
		} );

		// Make the deferred a promise
		promise.promise( deferred );

		// Call given func if any
		if ( func ) {
			func.call( deferred, deferred );
		}

		// All done!
		return deferred;
	},

	// Deferred helper
	when: function( singleValue ) {
		var

			// count of uncompleted subordinates
			remaining = arguments.length,

			// count of unprocessed arguments
			i = remaining,

			// subordinate fulfillment data
			resolveContexts = Array( i ),
			resolveValues = slice.call( arguments ),

			// the primary Deferred
			primary = jQuery.Deferred(),

			// subordinate callback factory
			updateFunc = function( i ) {
				return function( value ) {
					resolveContexts[ i ] = this;
					resolveValues[ i ] = arguments.length > 1 ? slice.call( arguments ) : value;
					if ( !( --remaining ) ) {
						primary.resolveWith( resolveContexts, resolveValues );
					}
				};
			};

		// Single- and empty arguments are adopted like Promise.resolve
		if ( remaining <= 1 ) {
			adoptValue( singleValue, primary.done( updateFunc( i ) ).resolve, primary.reject,
				!remaining );

			// Use .then() to unwrap secondary thenables (cf. gh-3000)
			if ( primary.state() === "pending" ||
				isFunction( resolveValues[ i ] && resolveValues[ i ].then ) ) {

				return primary.then();
			}
		}

		// Multiple arguments are aggregated like Promise.all array elements
		while ( i-- ) {
			adoptValue( resolveValues[ i ], updateFunc( i ), primary.reject );
		}

		return primary.promise();
	}
} );


// These usually indicate a programmer mistake during development,
// warn about them ASAP rather than swallowing them by default.
var rerrorNames = /^(Eval|Internal|Range|Reference|Syntax|Type|URI)Error$/;

// If `jQuery.Deferred.getErrorHook` is defined, `asyncError` is an error
// captured before the async barrier to get the original error cause
// which may otherwise be hidden.
jQuery.Deferred.exceptionHook = function( error, asyncError ) {

	// Support: IE 8 - 9 only
	// Console exists when dev tools are open, which can happen at any time
	if ( window.console && window.console.warn && error && rerrorNames.test( error.name ) ) {
		window.console.warn( "jQuery.Deferred exception: " + error.message,
			error.stack, asyncError );
	}
};




jQuery.readyException = function( error ) {
	window.setTimeout( function() {
		throw error;
	} );
};




// The deferred used on DOM ready
var readyList = jQuery.Deferred();

jQuery.fn.ready = function( fn ) {

	readyList
		.then( fn )

		// Wrap jQuery.readyException in a function so that the lookup
		// happens at the time of error handling instead of callback
		// registration.
		.catch( function( error ) {
			jQuery.readyException( error );
		} );

	return this;
};

jQuery.extend( {

	// Is the DOM ready to be used? Set to true once it occurs.
	isReady: false,

	// A counter to track how many items to wait for before
	// the ready event fires. See trac-6781
	readyWait: 1,

	// Handle when the DOM is ready
	ready: function( wait ) {

		// Abort if there are pending holds or we're already ready
		if ( wait === true ? --jQuery.readyWait : jQuery.isReady ) {
			return;
		}

		// Remember that the DOM is ready
		jQuery.isReady = true;

		// If a normal DOM Ready event fired, decrement, and wait if need be
		if ( wait !== true && --jQuery.readyWait > 0 ) {
			return;
		}

		// If there are functions bound, to execute
		readyList.resolveWith( document, [ jQuery ] );
	}
} );

jQuery.ready.then = readyList.then;

// The ready event handler and self cleanup method
function completed() {
	document.removeEventListener( "DOMContentLoaded", completed );
	window.removeEventListener( "load", completed );
	jQuery.ready();
}

// Catch cases where $(document).ready() is called
// after the browser event has already occurred.
// Support: IE <=9 - 10 only
// Older IE sometimes signals "interactive" too soon
if ( document.readyState === "complete" ||
	( document.readyState !== "loading" && !document.documentElement.doScroll ) ) {

	// Handle it asynchronously to allow scripts the opportunity to delay ready
	window.setTimeout( jQuery.ready );

} else {

	// Use the handy event callback
	document.addEventListener( "DOMContentLoaded", completed );

	// A fallback to window.onload, that will always work
	window.addEventListener( "load", completed );
}




// Multifunctional method to get and set values of a collection
// The value/s can optionally be executed if it's a function
var access = function( elems, fn, key, value, chainable, emptyGet, raw ) {
	var i = 0,
		len = elems.length,
		bulk = key == null;

	// Sets many values
	if ( toType( key ) === "object" ) {
		chainable = true;
		for ( i in key ) {
			access( elems, fn, i, key[ i ], true, emptyGet, raw );
		}

	// Sets one value
	} else if ( value !== undefined ) {
		chainable = true;

		if ( !isFunction( value ) ) {
			raw = true;
		}

		if ( bulk ) {

			// Bulk operations run against the entire set
			if ( raw ) {
				fn.call( elems, value );
				fn = null;

			// ...except when executing function values
			} else {
				bulk = fn;
				fn = function( elem, _key, value ) {
					return bulk.call( jQuery( elem ), value );
				};
			}
		}

		if ( fn ) {
			for ( ; i < len; i++ ) {
				fn(
					elems[ i ], key, raw ?
						value :
						value.call( elems[ i ], i, fn( elems[ i ], key ) )
				);
			}
		}
	}

	if ( chainable ) {
		return elems;
	}

	// Gets
	if ( bulk ) {
		return fn.call( elems );
	}

	return len ? fn( elems[ 0 ], key ) : emptyGet;
};


// Matches dashed string for camelizing
var rmsPrefix = /^-ms-/,
	rdashAlpha = /-([a-z])/g;

// Used by camelCase as callback to replace()
function fcamelCase( _all, letter ) {
	return letter.toUpperCase();
}

// Convert dashed to camelCase; used by the css and data modules
// Support: IE <=9 - 11, Edge 12 - 15
// Microsoft forgot to hump their vendor prefix (trac-9572)
function camelCase( string ) {
	return string.replace( rmsPrefix, "ms-" ).replace( rdashAlpha, fcamelCase );
}
var acceptData = function( owner ) {

	// Accepts only:
	//  - Node
	//    - Node.ELEMENT_NODE
	//    - Node.DOCUMENT_NODE
	//  - Object
	//    - Any
	return owner.nodeType === 1 || owner.nodeType === 9 || !( +owner.nodeType );
};




function Data() {
	this.expando = jQuery.expando + Data.uid++;
}

Data.uid = 1;

Data.prototype = {

	cache: function( owner ) {

		// Check if the owner object already has a cache
		var value = owner[ this.expando ];

		// If not, create one
		if ( !value ) {
			value = {};

			// We can accept data for non-element nodes in modern browsers,
			// but we should not, see trac-8335.
			// Always return an empty object.
			if ( acceptData( owner ) ) {

				// If it is a node unlikely to be stringify-ed or looped over
				// use plain assignment
				if ( owner.nodeType ) {
					owner[ this.expando ] = value;

				// Otherwise secure it in a non-enumerable property
				// configurable must be true to allow the property to be
				// deleted when data is removed
				} else {
					Object.defineProperty( owner, this.expando, {
						value: value,
						configurable: true
					} );
				}
			}
		}

		return value;
	},
	set: function( owner, data, value ) {
		var prop,
			cache = this.cache( owner );

		// Handle: [ owner, key, value ] args
		// Always use camelCase key (gh-2257)
		if ( typeof data === "string" ) {
			cache[ camelCase( data ) ] = value;

		// Handle: [ owner, { properties } ] args
		} else {

			// Copy the properties one-by-one to the cache object
			for ( prop in data ) {
				cache[ camelCase( prop ) ] = data[ prop ];
			}
		}
		return cache;
	},
	get: function( owner, key ) {
		return key === undefined ?
			this.cache( owner ) :

			// Always use camelCase key (gh-2257)
			owner[ this.expando ] && owner[ this.expando ][ camelCase( key ) ];
	},
	access: function( owner, key, value ) {

		// In cases where either:
		//
		//   1. No key was specified
		//   2. A string key was specified, but no value provided
		//
		// Take the "read" path and allow the get method to determine
		// which value to return, respectively either:
		//
		//   1. The entire cache object
		//   2. The data stored at the key
		//
		if ( key === undefined ||
				( ( key && typeof key === "string" ) && value === undefined ) ) {

			return this.get( owner, key );
		}

		// When the key is not a string, or both a key and value
		// are specified, set or extend (existing objects) with either:
		//
		//   1. An object of properties
		//   2. A key and value
		//
		this.set( owner, key, value );

		// Since the "set" path can have two possible entry points
		// return the expected data based on which path was taken[*]
		return value !== undefined ? value : key;
	},
	remove: function( owner, key ) {
		var i,
			cache = owner[ this.expando ];

		if ( cache === undefined ) {
			return;
		}

		if ( key !== undefined ) {

			// Support array or space separated string of keys
			if ( Array.isArray( key ) ) {

				// If key is an array of keys...
				// We always set camelCase keys, so remove that.
				key = key.map( camelCase );
			} else {
				key = camelCase( key );

				// If a key with the spaces exists, use it.
				// Otherwise, create an array by matching non-whitespace
				key = key in cache ?
					[ key ] :
					( key.match( rnothtmlwhite ) || [] );
			}

			i = key.length;

			while ( i-- ) {
				delete cache[ key[ i ] ];
			}
		}

		// Remove the expando if there's no more data
		if ( key === undefined || jQuery.isEmptyObject( cache ) ) {

			// Support: Chrome <=35 - 45
			// Webkit & Blink performance suffers when deleting properties
			// from DOM nodes, so set to undefined instead
			// https://bugs.chromium.org/p/chromium/issues/detail?id=378607 (bug restricted)
			if ( owner.nodeType ) {
				owner[ this.expando ] = undefined;
			} else {
				delete owner[ this.expando ];
			}
		}
	},
	hasData: function( owner ) {
		var cache = owner[ this.expando ];
		return cache !== undefined && !jQuery.isEmptyObject( cache );
	}
};
var dataPriv = new Data();

var dataUser = new Data();



//	Implementation Summary
//
//	1. Enforce API surface and semantic compatibility with 1.9.x branch
//	2. Improve the module's maintainability by reducing the storage
//		paths to a single mechanism.
//	3. Use the same single mechanism to support "private" and "user" data.
//	4. _Never_ expose "private" data to user code (TODO: Drop _data, _removeData)
//	5. Avoid exposing implementation details on user objects (eg. expando properties)
//	6. Provide a clear path for implementation upgrade to WeakMap in 2014

var rbrace = /^(?:\{[\w\W]*\}|\[[\w\W]*\])$/,
	rmultiDash = /[A-Z]/g;

function getData( data ) {
	if ( data === "true" ) {
		return true;
	}

	if ( data === "false" ) {
		return false;
	}

	if ( data === "null" ) {
		return null;
	}

	// Only convert to a number if it doesn't change the string
	if ( data === +data + "" ) {
		return +data;
	}

	if ( rbrace.test( data ) ) {
		return JSON.parse( data );
	}

	return data;
}

function dataAttr( elem, key, data ) {
	var name;

	// If nothing was found internally, try to fetch any
	// data from the HTML5 data-* attribute
	if ( data === undefined && elem.nodeType === 1 ) {
		name = "data-" + key.replace( rmultiDash, "-$&" ).toLowerCase();
		data = elem.getAttribute( name );

		if ( typeof data === "string" ) {
			try {
				data = getData( data );
			} catch ( e ) {}

			// Make sure we set the data so it isn't changed later
			dataUser.set( elem, key, data );
		} else {
			data = undefined;
		}
	}
	return data;
}

jQuery.extend( {
	hasData: function( elem ) {
		return dataUser.hasData( elem ) || dataPriv.hasData( elem );
	},

	data: function( elem, name, data ) {
		return dataUser.access( elem, name, data );
	},

	removeData: function( elem, name ) {
		dataUser.remove( elem, name );
	},

	// TODO: Now that all calls to _data and _removeData have been replaced
	// with direct calls to dataPriv methods, these can be deprecated.
	_data: function( elem, name, data ) {
		return dataPriv.access( elem, name, data );
	},

	_removeData: function( elem, name ) {
		dataPriv.remove( elem, name );
	}
} );

jQuery.fn.extend( {
	data: function( key, value ) {
		var i, name, data,
			elem = this[ 0 ],
			attrs = elem && elem.attributes;

		// Gets all values
		if ( key === undefined ) {
			if ( this.length ) {
				data = dataUser.get( elem );

				if ( elem.nodeType === 1 && !dataPriv.get( elem, "hasDataAttrs" ) ) {
					i = attrs.length;
					while ( i-- ) {

						// Support: IE 11 only
						// The attrs elements can be null (trac-14894)
						if ( attrs[ i ] ) {
							name = attrs[ i ].name;
							if ( name.indexOf( "data-" ) === 0 ) {
								name = camelCase( name.slice( 5 ) );
								dataAttr( elem, name, data[ name ] );
							}
						}
					}
					dataPriv.set( elem, "hasDataAttrs", true );
				}
			}

			return data;
		}

		// Sets multiple values
		if ( typeof key === "object" ) {
			return this.each( function() {
				dataUser.set( this, key );
			} );
		}

		return access( this, function( value ) {
			var data;

			// The calling jQuery object (element matches) is not empty
			// (and therefore has an element appears at this[ 0 ]) and the
			// `value` parameter was not undefined. An empty jQuery object
			// will result in `undefined` for elem = this[ 0 ] which will
			// throw an exception if an attempt to read a data cache is made.
			if ( elem && value === undefined ) {

				// Attempt to get data from the cache
				// The key will always be camelCased in Data
				data = dataUser.get( elem, key );
				if ( data !== undefined ) {
					return data;
				}

				// Attempt to "discover" the data in
				// HTML5 custom data-* attrs
				data = dataAttr( elem, key );
				if ( data !== undefined ) {
					return data;
				}

				// We tried really hard, but the data doesn't exist.
				return;
			}

			// Set the data...
			this.each( function() {

				// We always store the camelCased key
				dataUser.set( this, key, value );
			} );
		}, null, value, arguments.length > 1, null, true );
	},

	removeData: function( key ) {
		return this.each( function() {
			dataUser.remove( this, key );
		} );
	}
} );


jQuery.extend( {
	queue: function( elem, type, data ) {
		var queue;

		if ( elem ) {
			type = ( type || "fx" ) + "queue";
			queue = dataPriv.get( elem, type );

			// Speed up dequeue by getting out quickly if this is just a lookup
			if ( data ) {
				if ( !queue || Array.isArray( data ) ) {
					queue = dataPriv.access( elem, type, jQuery.makeArray( data ) );
				} else {
					queue.push( data );
				}
			}
			return queue || [];
		}
	},

	dequeue: function( elem, type ) {
		type = type || "fx";

		var queue = jQuery.queue( elem, type ),
			startLength = queue.length,
			fn = queue.shift(),
			hooks = jQuery._queueHooks( elem, type ),
			next = function() {
				jQuery.dequeue( elem, type );
			};

		// If the fx queue is dequeued, always remove the progress sentinel
		if ( fn === "inprogress" ) {
			fn = queue.shift();
			startLength--;
		}

		if ( fn ) {

			// Add a progress sentinel to prevent the fx queue from being
			// automatically dequeued
			if ( type === "fx" ) {
				queue.unshift( "inprogress" );
			}

			// Clear up the last queue stop function
			delete hooks.stop;
			fn.call( elem, next, hooks );
		}

		if ( !startLength && hooks ) {
			hooks.empty.fire();
		}
	},

	// Not public - generate a queueHooks object, or return the current one
	_queueHooks: function( elem, type ) {
		var key = type + "queueHooks";
		return dataPriv.get( elem, key ) || dataPriv.access( elem, key, {
			empty: jQuery.Callbacks( "once memory" ).add( function() {
				dataPriv.remove( elem, [ type + "queue", key ] );
			} )
		} );
	}
} );

jQuery.fn.extend( {
	queue: function( type, data ) {
		var setter = 2;

		if ( typeof type !== "string" ) {
			data = type;
			type = "fx";
			setter--;
		}

		if ( arguments.length < setter ) {
			return jQuery.queue( this[ 0 ], type );
		}

		return data === undefined ?
			this :
			this.each( function() {
				var queue = jQuery.queue( this, type, data );

				// Ensure a hooks for this queue
				jQuery._queueHooks( this, type );

				if ( type === "fx" && queue[ 0 ] !== "inprogress" ) {
					jQuery.dequeue( this, type );
				}
			} );
	},
	dequeue: function( type ) {
		return this.each( function() {
			jQuery.dequeue( this, type );
		} );
	},
	clearQueue: function( type ) {
		return this.queue( type || "fx", [] );
	},

	// Get a promise resolved when queues of a certain type
	// are emptied (fx is the type by default)
	promise: function( type, obj ) {
		var tmp,
			count = 1,
			defer = jQuery.Deferred(),
			elements = this,
			i = this.length,
			resolve = function() {
				if ( !( --count ) ) {
					defer.resolveWith( elements, [ elements ] );
				}
			};

		if ( typeof type !== "string" ) {
			obj = type;
			type = undefined;
		}
		type = type || "fx";

		while ( i-- ) {
			tmp = dataPriv.get( elements[ i ], type + "queueHooks" );
			if ( tmp && tmp.empty ) {
				count++;
				tmp.empty.add( resolve );
			}
		}
		resolve();
		return defer.promise( obj );
	}
} );
var pnum = ( /[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/ ).source;

var rcssNum = new RegExp( "^(?:([+-])=|)(" + pnum + ")([a-z%]*)$", "i" );


var cssExpand = [ "Top", "Right", "Bottom", "Left" ];

var documentElement = document.documentElement;



	var isAttached = function( elem ) {
			return jQuery.contains( elem.ownerDocument, elem );
		},
		composed = { composed: true };

	// Support: IE 9 - 11+, Edge 12 - 18+, iOS 10.0 - 10.2 only
	// Check attachment across shadow DOM boundaries when possible (gh-3504)
	// Support: iOS 10.0-10.2 only
	// Early iOS 10 versions support `attachShadow` but not `getRootNode`,
	// leading to errors. We need to check for `getRootNode`.
	if ( documentElement.getRootNode ) {
		isAttached = function( elem ) {
			return jQuery.contains( elem.ownerDocument, elem ) ||
				elem.getRootNode( composed ) === elem.ownerDocument;
		};
	}
var isHiddenWithinTree = function( elem, el ) {

		// isHiddenWithinTree might be called from jQuery#filter function;
		// in that case, element will be second argument
		elem = el || elem;

		// Inline style trumps all
		return elem.style.display === "none" ||
			elem.style.display === "" &&

			// Otherwise, check computed style
			// Support: Firefox <=43 - 45
			// Disconnected elements can have computed display: none, so first confirm that elem is
			// in the document.
			isAttached( elem ) &&

			jQuery.css( elem, "display" ) === "none";
	};



function adjustCSS( elem, prop, valueParts, tween ) {
	var adjusted, scale,
		maxIterations = 20,
		currentValue = tween ?
			function() {
				return tween.cur();
			} :
			function() {
				return jQuery.css( elem, prop, "" );
			},
		initial = currentValue(),
		unit = valueParts && valueParts[ 3 ] || ( jQuery.cssNumber[ prop ] ? "" : "px" ),

		// Starting value computation is required for potential unit mismatches
		initialInUnit = elem.nodeType &&
			( jQuery.cssNumber[ prop ] || unit !== "px" && +initial ) &&
			rcssNum.exec( jQuery.css( elem, prop ) );

	if ( initialInUnit && initialInUnit[ 3 ] !== unit ) {

		// Support: Firefox <=54
		// Halve the iteration target value to prevent interference from CSS upper bounds (gh-2144)
		initial = initial / 2;

		// Trust units reported by jQuery.css
		unit = unit || initialInUnit[ 3 ];

		// Iteratively approximate from a nonzero starting point
		initialInUnit = +initial || 1;

		while ( maxIterations-- ) {

			// Evaluate and update our best guess (doubling guesses that zero out).
			// Finish if the scale equals or crosses 1 (making the old*new product non-positive).
			jQuery.style( elem, prop, initialInUnit + unit );
			if ( ( 1 - scale ) * ( 1 - ( scale = currentValue() / initial || 0.5 ) ) <= 0 ) {
				maxIterations = 0;
			}
			initialInUnit = initialInUnit / scale;

		}

		initialInUnit = initialInUnit * 2;
		jQuery.style( elem, prop, initialInUnit + unit );

		// Make sure we update the tween properties later on
		valueParts = valueParts || [];
	}

	if ( valueParts ) {
		initialInUnit = +initialInUnit || +initial || 0;

		// Apply relative offset (+=/-=) if specified
		adjusted = valueParts[ 1 ] ?
			initialInUnit + ( valueParts[ 1 ] + 1 ) * valueParts[ 2 ] :
			+valueParts[ 2 ];
		if ( tween ) {
			tween.unit = unit;
			tween.start = initialInUnit;
			tween.end = adjusted;
		}
	}
	return adjusted;
}


var defaultDisplayMap = {};

function getDefaultDisplay( elem ) {
	var temp,
		doc = elem.ownerDocument,
		nodeName = elem.nodeName,
		display = defaultDisplayMap[ nodeName ];

	if ( display ) {
		return display;
	}

	temp = doc.body.appendChild( doc.createElement( nodeName ) );
	display = jQuery.css( temp, "display" );

	temp.parentNode.removeChild( temp );

	if ( display === "none" ) {
		display = "block";
	}
	defaultDisplayMap[ nodeName ] = display;

	return display;
}

function showHide( elements, show ) {
	var display, elem,
		values = [],
		index = 0,
		length = elements.length;

	// Determine new display value for elements that need to change
	for ( ; index < length; index++ ) {
		elem = elements[ index ];
		if ( !elem.style ) {
			continue;
		}

		display = elem.style.display;
		if ( show ) {

			// Since we force visibility upon cascade-hidden elements, an immediate (and slow)
			// check is required in this first loop unless we have a nonempty display value (either
			// inline or about-to-be-restored)
			if ( display === "none" ) {
				values[ index ] = dataPriv.get( elem, "display" ) || null;
				if ( !values[ index ] ) {
					elem.style.display = "";
				}
			}
			if ( elem.style.display === "" && isHiddenWithinTree( elem ) ) {
				values[ index ] = getDefaultDisplay( elem );
			}
		} else {
			if ( display !== "none" ) {
				values[ index ] = "none";

				// Remember what we're overwriting
				dataPriv.set( elem, "display", display );
			}
		}
	}

	// Set the display of the elements in a second loop to avoid constant reflow
	for ( index = 0; index < length; index++ ) {
		if ( values[ index ] != null ) {
			elements[ index ].style.display = values[ index ];
		}
	}

	return elements;
}

jQuery.fn.extend( {
	show: function() {
		return showHide( this, true );
	},
	hide: function() {
		return showHide( this );
	},
	toggle: function( state ) {
		if ( typeof state === "boolean" ) {
			return state ? this.show() : this.hide();
		}

		return this.each( function() {
			if ( isHiddenWithinTree( this ) ) {
				jQuery( this ).show();
			} else {
				jQuery( this ).hide();
			}
		} );
	}
} );
var rcheckableType = ( /^(?:checkbox|radio)$/i );

var rtagName = ( /<([a-z][^\/\0>\x20\t\r\n\f]*)/i );

var rscriptType = ( /^$|^module$|\/(?:java|ecma)script/i );



( function() {
	var fragment = document.createDocumentFragment(),
		div = fragment.appendChild( document.createElement( "div" ) ),
		input = document.createElement( "input" );

	// Support: Android 4.0 - 4.3 only
	// Check state lost if the name is set (trac-11217)
	// Support: Windows Web Apps (WWA)
	// `name` and `type` must use .setAttribute for WWA (trac-14901)
	input.setAttribute( "type", "radio" );
	input.setAttribute( "checked", "checked" );
	input.setAttribute( "name", "t" );

	div.appendChild( input );

	// Support: Android <=4.1 only
	// Older WebKit doesn't clone checked state correctly in fragments
	support.checkClone = div.cloneNode( true ).cloneNode( true ).lastChild.checked;

	// Support: IE <=11 only
	// Make sure textarea (and checkbox) defaultValue is properly cloned
	div.innerHTML = "<textarea>x</textarea>";
	support.noCloneChecked = !!div.cloneNode( true ).lastChild.defaultValue;

	// Support: IE <=9 only
	// IE <=9 replaces <option> tags with their contents when inserted outside of
	// the select element.
	div.innerHTML = "<option></option>";
	support.option = !!div.lastChild;
} )();


// We have to close these tags to support XHTML (trac-13200)
var wrapMap = {

	// XHTML parsers do not magically insert elements in the
	// same way that tag soup parsers do. So we cannot shorten
	// this by omitting <tbody> or other required elements.
	thead: [ 1, "<table>", "</table>" ],
	col: [ 2, "<table><colgroup>", "</colgroup></table>" ],
	tr: [ 2, "<table><tbody>", "</tbody></table>" ],
	td: [ 3, "<table><tbody><tr>", "</tr></tbody></table>" ],

	_default: [ 0, "", "" ]
};

wrapMap.tbody = wrapMap.tfoot = wrapMap.colgroup = wrapMap.caption = wrapMap.thead;
wrapMap.th = wrapMap.td;

// Support: IE <=9 only
if ( !support.option ) {
	wrapMap.optgroup = wrapMap.option = [ 1, "<select multiple='multiple'>", "</select>" ];
}


function getAll( context, tag ) {

	// Support: IE <=9 - 11 only
	// Use typeof to avoid zero-argument method invocation on host objects (trac-15151)
	var ret;

	if ( typeof context.getElementsByTagName !== "undefined" ) {
		ret = context.getElementsByTagName( tag || "*" );

	} else if ( typeof context.querySelectorAll !== "undefined" ) {
		ret = context.querySelectorAll( tag || "*" );

	} else {
		ret = [];
	}

	if ( tag === undefined || tag && nodeName( context, tag ) ) {
		return jQuery.merge( [ context ], ret );
	}

	return ret;
}


// Mark scripts as having already been evaluated
function setGlobalEval( elems, refElements ) {
	var i = 0,
		l = elems.length;

	for ( ; i < l; i++ ) {
		dataPriv.set(
			elems[ i ],
			"globalEval",
			!refElements || dataPriv.get( refElements[ i ], "globalEval" )
		);
	}
}


var rhtml = /<|&#?\w+;/;

function buildFragment( elems, context, scripts, selection, ignored ) {
	var elem, tmp, tag, wrap, attached, j,
		fragment = context.createDocumentFragment(),
		nodes = [],
		i = 0,
		l = elems.length;

	for ( ; i < l; i++ ) {
		elem = elems[ i ];

		if ( elem || elem === 0 ) {

			// Add nodes directly
			if ( toType( elem ) === "object" ) {

				// Support: Android <=4.0 only, PhantomJS 1 only
				// push.apply(_, arraylike) throws on ancient WebKit
				jQuery.merge( nodes, elem.nodeType ? [ elem ] : elem );

			// Convert non-html into a text node
			} else if ( !rhtml.test( elem ) ) {
				nodes.push( context.createTextNode( elem ) );

			// Convert html into DOM nodes
			} else {
				tmp = tmp || fragment.appendChild( context.createElement( "div" ) );

				// Deserialize a standard representation
				tag = ( rtagName.exec( elem ) || [ "", "" ] )[ 1 ].toLowerCase();
				wrap = wrapMap[ tag ] || wrapMap._default;
				tmp.innerHTML = wrap[ 1 ] + jQuery.htmlPrefilter( elem ) + wrap[ 2 ];

				// Descend through wrappers to the right content
				j = wrap[ 0 ];
				while ( j-- ) {
					tmp = tmp.lastChild;
				}

				// Support: Android <=4.0 only, PhantomJS 1 only
				// push.apply(_, arraylike) throws on ancient WebKit
				jQuery.merge( nodes, tmp.childNodes );

				// Remember the top-level container
				tmp = fragment.firstChild;

				// Ensure the created nodes are orphaned (trac-12392)
				tmp.textContent = "";
			}
		}
	}

	// Remove wrapper from fragment
	fragment.textContent = "";

	i = 0;
	while ( ( elem = nodes[ i++ ] ) ) {

		// Skip elements already in the context collection (trac-4087)
		if ( selection && jQuery.inArray( elem, selection ) > -1 ) {
			if ( ignored ) {
				ignored.push( elem );
			}
			continue;
		}

		attached = isAttached( elem );

		// Append to fragment
		tmp = getAll( fragment.appendChild( elem ), "script" );

		// Preserve script evaluation history
		if ( attached ) {
			setGlobalEval( tmp );
		}

		// Capture executables
		if ( scripts ) {
			j = 0;
			while ( ( elem = tmp[ j++ ] ) ) {
				if ( rscriptType.test( elem.type || "" ) ) {
					scripts.push( elem );
				}
			}
		}
	}

	return fragment;
}


var rtypenamespace = /^([^.]*)(?:\.(.+)|)/;

function returnTrue() {
	return true;
}

function returnFalse() {
	return false;
}

function on( elem, types, selector, data, fn, one ) {
	var origFn, type;

	// Types can be a map of types/handlers
	if ( typeof types === "object" ) {

		// ( types-Object, selector, data )
		if ( typeof selector !== "string" ) {

			// ( types-Object, data )
			data = data || selector;
			selector = undefined;
		}
		for ( type in types ) {
			on( elem, type, selector, data, types[ type ], one );
		}
		return elem;
	}

	if ( data == null && fn == null ) {

		// ( types, fn )
		fn = selector;
		data = selector = undefined;
	} else if ( fn == null ) {
		if ( typeof selector === "string" ) {

			// ( types, selector, fn )
			fn = data;
			data = undefined;
		} else {

			// ( types, data, fn )
			fn = data;
			data = selector;
			selector = undefined;
		}
	}
	if ( fn === false ) {
		fn = returnFalse;
	} else if ( !fn ) {
		return elem;
	}

	if ( one === 1 ) {
		origFn = fn;
		fn = function( event ) {

			// Can use an empty set, since event contains the info
			jQuery().off( event );
			return origFn.apply( this, arguments );
		};

		// Use same guid so caller can remove using origFn
		fn.guid = origFn.guid || ( origFn.guid = jQuery.guid++ );
	}
	return elem.each( function() {
		jQuery.event.add( this, types, fn, data, selector );
	} );
}

/*
 * Helper functions for managing events -- not part of the public interface.
 * Props to Dean Edwards' addEvent library for many of the ideas.
 */
jQuery.event = {

	global: {},

	add: function( elem, types, handler, data, selector ) {

		var handleObjIn, eventHandle, tmp,
			events, t, handleObj,
			special, handlers, type, namespaces, origType,
			elemData = dataPriv.get( elem );

		// Only attach events to objects that accept data
		if ( !acceptData( elem ) ) {
			return;
		}

		// Caller can pass in an object of custom data in lieu of the handler
		if ( handler.handler ) {
			handleObjIn = handler;
			handler = handleObjIn.handler;
			selector = handleObjIn.selector;
		}

		// Ensure that invalid selectors throw exceptions at attach time
		// Evaluate against documentElement in case elem is a non-element node (e.g., document)
		if ( selector ) {
			jQuery.find.matchesSelector( documentElement, selector );
		}

		// Make sure that the handler has a unique ID, used to find/remove it later
		if ( !handler.guid ) {
			handler.guid = jQuery.guid++;
		}

		// Init the element's event structure and main handler, if this is the first
		if ( !( events = elemData.events ) ) {
			events = elemData.events = Object.create( null );
		}
		if ( !( eventHandle = elemData.handle ) ) {
			eventHandle = elemData.handle = function( e ) {

				// Discard the second event of a jQuery.event.trigger() and
				// when an event is called after a page has unloaded
				return typeof jQuery !== "undefined" && jQuery.event.triggered !== e.type ?
					jQuery.event.dispatch.apply( elem, arguments ) : undefined;
			};
		}

		// Handle multiple events separated by a space
		types = ( types || "" ).match( rnothtmlwhite ) || [ "" ];
		t = types.length;
		while ( t-- ) {
			tmp = rtypenamespace.exec( types[ t ] ) || [];
			type = origType = tmp[ 1 ];
			namespaces = ( tmp[ 2 ] || "" ).split( "." ).sort();

			// There *must* be a type, no attaching namespace-only handlers
			if ( !type ) {
				continue;
			}

			// If event changes its type, use the special event handlers for the changed type
			special = jQuery.event.special[ type ] || {};

			// If selector defined, determine special event api type, otherwise given type
			type = ( selector ? special.delegateType : special.bindType ) || type;

			// Update special based on newly reset type
			special = jQuery.event.special[ type ] || {};

			// handleObj is passed to all event handlers
			handleObj = jQuery.extend( {
				type: type,
				origType: origType,
				data: data,
				handler: handler,
				guid: handler.guid,
				selector: selector,
				needsContext: selector && jQuery.expr.match.needsContext.test( selector ),
				namespace: namespaces.join( "." )
			}, handleObjIn );

			// Init the event handler queue if we're the first
			if ( !( handlers = events[ type ] ) ) {
				handlers = events[ type ] = [];
				handlers.delegateCount = 0;

				// Only use addEventListener if the special events handler returns false
				if ( !special.setup ||
					special.setup.call( elem, data, namespaces, eventHandle ) === false ) {

					if ( elem.addEventListener ) {
						elem.addEventListener( type, eventHandle );
					}
				}
			}

			if ( special.add ) {
				special.add.call( elem, handleObj );

				if ( !handleObj.handler.guid ) {
					handleObj.handler.guid = handler.guid;
				}
			}

			// Add to the element's handler list, delegates in front
			if ( selector ) {
				handlers.splice( handlers.delegateCount++, 0, handleObj );
			} else {
				handlers.push( handleObj );
			}

			// Keep track of which events have ever been used, for event optimization
			jQuery.event.global[ type ] = true;
		}

	},

	// Detach an event or set of events from an element
	remove: function( elem, types, handler, selector, mappedTypes ) {

		var j, origCount, tmp,
			events, t, handleObj,
			special, handlers, type, namespaces, origType,
			elemData = dataPriv.hasData( elem ) && dataPriv.get( elem );

		if ( !elemData || !( events = elemData.events ) ) {
			return;
		}

		// Once for each type.namespace in types; type may be omitted
		types = ( types || "" ).match( rnothtmlwhite ) || [ "" ];
		t = types.length;
		while ( t-- ) {
			tmp = rtypenamespace.exec( types[ t ] ) || [];
			type = origType = tmp[ 1 ];
			namespaces = ( tmp[ 2 ] || "" ).split( "." ).sort();

			// Unbind all events (on this namespace, if provided) for the element
			if ( !type ) {
				for ( type in events ) {
					jQuery.event.remove( elem, type + types[ t ], handler, selector, true );
				}
				continue;
			}

			special = jQuery.event.special[ type ] || {};
			type = ( selector ? special.delegateType : special.bindType ) || type;
			handlers = events[ type ] || [];
			tmp = tmp[ 2 ] &&
				new RegExp( "(^|\\.)" + namespaces.join( "\\.(?:.*\\.|)" ) + "(\\.|$)" );

			// Remove matching events
			origCount = j = handlers.length;
			while ( j-- ) {
				handleObj = handlers[ j ];

				if ( ( mappedTypes || origType === handleObj.origType ) &&
					( !handler || handler.guid === handleObj.guid ) &&
					( !tmp || tmp.test( handleObj.namespace ) ) &&
					( !selector || selector === handleObj.selector ||
						selector === "**" && handleObj.selector ) ) {
					handlers.splice( j, 1 );

					if ( handleObj.selector ) {
						handlers.delegateCount--;
					}
					if ( special.remove ) {
						special.remove.call( elem, handleObj );
					}
				}
			}

			// Remove generic event handler if we removed something and no more handlers exist
			// (avoids potential for endless recursion during removal of special event handlers)
			if ( origCount && !handlers.length ) {
				if ( !special.teardown ||
					special.teardown.call( elem, namespaces, elemData.handle ) === false ) {

					jQuery.removeEvent( elem, type, elemData.handle );
				}

				delete events[ type ];
			}
		}

		// Remove data and the expando if it's no longer used
		if ( jQuery.isEmptyObject( events ) ) {
			dataPriv.remove( elem, "handle events" );
		}
	},

	dispatch: function( nativeEvent ) {

		var i, j, ret, matched, handleObj, handlerQueue,
			args = new Array( arguments.length ),

			// Make a writable jQuery.Event from the native event object
			event = jQuery.event.fix( nativeEvent ),

			handlers = (
				dataPriv.get( this, "events" ) || Object.create( null )
			)[ event.type ] || [],
			special = jQuery.event.special[ event.type ] || {};

		// Use the fix-ed jQuery.Event rather than the (read-only) native event
		args[ 0 ] = event;

		for ( i = 1; i < arguments.length; i++ ) {
			args[ i ] = arguments[ i ];
		}

		event.delegateTarget = this;

		// Call the preDispatch hook for the mapped type, and let it bail if desired
		if ( special.preDispatch && special.preDispatch.call( this, event ) === false ) {
			return;
		}

		// Determine handlers
		handlerQueue = jQuery.event.handlers.call( this, event, handlers );

		// Run delegates first; they may want to stop propagation beneath us
		i = 0;
		while ( ( matched = handlerQueue[ i++ ] ) && !event.isPropagationStopped() ) {
			event.currentTarget = matched.elem;

			j = 0;
			while ( ( handleObj = matched.handlers[ j++ ] ) &&
				!event.isImmediatePropagationStopped() ) {

				// If the event is namespaced, then each handler is only invoked if it is
				// specially universal or its namespaces are a superset of the event's.
				if ( !event.rnamespace || handleObj.namespace === false ||
					event.rnamespace.test( handleObj.namespace ) ) {

					event.handleObj = handleObj;
					event.data = handleObj.data;

					ret = ( ( jQuery.event.special[ handleObj.origType ] || {} ).handle ||
						handleObj.handler ).apply( matched.elem, args );

					if ( ret !== undefined ) {
						if ( ( event.result = ret ) === false ) {
							event.preventDefault();
							event.stopPropagation();
						}
					}
				}
			}
		}

		// Call the postDispatch hook for the mapped type
		if ( special.postDispatch ) {
			special.postDispatch.call( this, event );
		}

		return event.result;
	},

	handlers: function( event, handlers ) {
		var i, handleObj, sel, matchedHandlers, matchedSelectors,
			handlerQueue = [],
			delegateCount = handlers.delegateCount,
			cur = event.target;

		// Find delegate handlers
		if ( delegateCount &&

			// Support: IE <=9
			// Black-hole SVG <use> instance trees (trac-13180)
			cur.nodeType &&

			// Support: Firefox <=42
			// Suppress spec-violating clicks indicating a non-primary pointer button (trac-3861)
			// https://www.w3.org/TR/DOM-Level-3-Events/#event-type-click
			// Support: IE 11 only
			// ...but not arrow key "clicks" of radio inputs, which can have `button` -1 (gh-2343)
			!( event.type === "click" && event.button >= 1 ) ) {

			for ( ; cur !== this; cur = cur.parentNode || this ) {

				// Don't check non-elements (trac-13208)
				// Don't process clicks on disabled elements (trac-6911, trac-8165, trac-11382, trac-11764)
				if ( cur.nodeType === 1 && !( event.type === "click" && cur.disabled === true ) ) {
					matchedHandlers = [];
					matchedSelectors = {};
					for ( i = 0; i < delegateCount; i++ ) {
						handleObj = handlers[ i ];

						// Don't conflict with Object.prototype properties (trac-13203)
						sel = handleObj.selector + " ";

						if ( matchedSelectors[ sel ] === undefined ) {
							matchedSelectors[ sel ] = handleObj.needsContext ?
								jQuery( sel, this ).index( cur ) > -1 :
								jQuery.find( sel, this, null, [ cur ] ).length;
						}
						if ( matchedSelectors[ sel ] ) {
							matchedHandlers.push( handleObj );
						}
					}
					if ( matchedHandlers.length ) {
						handlerQueue.push( { elem: cur, handlers: matchedHandlers } );
					}
				}
			}
		}

		// Add the remaining (directly-bound) handlers
		cur = this;
		if ( delegateCount < handlers.length ) {
			handlerQueue.push( { elem: cur, handlers: handlers.slice( delegateCount ) } );
		}

		return handlerQueue;
	},

	addProp: function( name, hook ) {
		Object.defineProperty( jQuery.Event.prototype, name, {
			enumerable: true,
			configurable: true,

			get: isFunction( hook ) ?
				function() {
					if ( this.originalEvent ) {
						return hook( this.originalEvent );
					}
				} :
				function() {
					if ( this.originalEvent ) {
						return this.originalEvent[ name ];
					}
				},

			set: function( value ) {
				Object.defineProperty( this, name, {
					enumerable: true,
					configurable: true,
					writable: true,
					value: value
				} );
			}
		} );
	},

	fix: function( originalEvent ) {
		return originalEvent[ jQuery.expando ] ?
			originalEvent :
			new jQuery.Event( originalEvent );
	},

	special: {
		load: {

			// Prevent triggered image.load events from bubbling to window.load
			noBubble: true
		},
		click: {

			// Utilize native event to ensure correct state for checkable inputs
			setup: function( data ) {

				// For mutual compressibility with _default, replace `this` access with a local var.
				// `|| data` is dead code meant only to preserve the variable through minification.
				var el = this || data;

				// Claim the first handler
				if ( rcheckableType.test( el.type ) &&
					el.click && nodeName( el, "input" ) ) {

					// dataPriv.set( el, "click", ... )
					leverageNative( el, "click", true );
				}

				// Return false to allow normal processing in the caller
				return false;
			},
			trigger: function( data ) {

				// For mutual compressibility with _default, replace `this` access with a local var.
				// `|| data` is dead code meant only to preserve the variable through minification.
				var el = this || data;

				// Force setup before triggering a click
				if ( rcheckableType.test( el.type ) &&
					el.click && nodeName( el, "input" ) ) {

					leverageNative( el, "click" );
				}

				// Return non-false to allow normal event-path propagation
				return true;
			},

			// For cross-browser consistency, suppress native .click() on links
			// Also prevent it if we're currently inside a leveraged native-event stack
			_default: function( event ) {
				var target = event.target;
				return rcheckableType.test( target.type ) &&
					target.click && nodeName( target, "input" ) &&
					dataPriv.get( target, "click" ) ||
					nodeName( target, "a" );
			}
		},

		beforeunload: {
			postDispatch: function( event ) {

				// Support: Firefox 20+
				// Firefox doesn't alert if the returnValue field is not set.
				if ( event.result !== undefined && event.originalEvent ) {
					event.originalEvent.returnValue = event.result;
				}
			}
		}
	}
};

// Ensure the presence of an event listener that handles manually-triggered
// synthetic events by interrupting progress until reinvoked in response to
// *native* events that it fires directly, ensuring that state changes have
// already occurred before other listeners are invoked.
function leverageNative( el, type, isSetup ) {

	// Missing `isSetup` indicates a trigger call, which must force setup through jQuery.event.add
	if ( !isSetup ) {
		if ( dataPriv.get( el, type ) === undefined ) {
			jQuery.event.add( el, type, returnTrue );
		}
		return;
	}

	// Register the controller as a special universal handler for all event namespaces
	dataPriv.set( el, type, false );
	jQuery.event.add( el, type, {
		namespace: false,
		handler: function( event ) {
			var result,
				saved = dataPriv.get( this, type );

			if ( ( event.isTrigger & 1 ) && this[ type ] ) {

				// Interrupt processing of the outer synthetic .trigger()ed event
				if ( !saved ) {

					// Store arguments for use when handling the inner native event
					// There will always be at least one argument (an event object), so this array
					// will not be confused with a leftover capture object.
					saved = slice.call( arguments );
					dataPriv.set( this, type, saved );

					// Trigger the native event and capture its result
					this[ type ]();
					result = dataPriv.get( this, type );
					dataPriv.set( this, type, false );

					if ( saved !== result ) {

						// Cancel the outer synthetic event
						event.stopImmediatePropagation();
						event.preventDefault();

						return result;
					}

				// If this is an inner synthetic event for an event with a bubbling surrogate
				// (focus or blur), assume that the surrogate already propagated from triggering
				// the native event and prevent that from happening again here.
				// This technically gets the ordering wrong w.r.t. to `.trigger()` (in which the
				// bubbling surrogate propagates *after* the non-bubbling base), but that seems
				// less bad than duplication.
				} else if ( ( jQuery.event.special[ type ] || {} ).delegateType ) {
					event.stopPropagation();
				}

			// If this is a native event triggered above, everything is now in order
			// Fire an inner synthetic event with the original arguments
			} else if ( saved ) {

				// ...and capture the result
				dataPriv.set( this, type, jQuery.event.trigger(
					saved[ 0 ],
					saved.slice( 1 ),
					this
				) );

				// Abort handling of the native event by all jQuery handlers while allowing
				// native handlers on the same element to run. On target, this is achieved
				// by stopping immediate propagation just on the jQuery event. However,
				// the native event is re-wrapped by a jQuery one on each level of the
				// propagation so the only way to stop it for jQuery is to stop it for
				// everyone via native `stopPropagation()`. This is not a problem for
				// focus/blur which don't bubble, but it does also stop click on checkboxes
				// and radios. We accept this limitation.
				event.stopPropagation();
				event.isImmediatePropagationStopped = returnTrue;
			}
		}
	} );
}

jQuery.removeEvent = function( elem, type, handle ) {

	// This "if" is needed for plain objects
	if ( elem.removeEventListener ) {
		elem.removeEventListener( type, handle );
	}
};

jQuery.Event = function( src, props ) {

	// Allow instantiation without the 'new' keyword
	if ( !( this instanceof jQuery.Event ) ) {
		return new jQuery.Event( src, props );
	}

	// Event object
	if ( src && src.type ) {
		this.originalEvent = src;
		this.type = src.type;

		// Events bubbling up the document may have been marked as prevented
		// by a handler lower down the tree; reflect the correct value.
		this.isDefaultPrevented = src.defaultPrevented ||
				src.defaultPrevented === undefined &&

				// Support: Android <=2.3 only
				src.returnValue === false ?
			returnTrue :
			returnFalse;

		// Create target properties
		// Support: Safari <=6 - 7 only
		// Target should not be a text node (trac-504, trac-13143)
		this.target = ( src.target && src.target.nodeType === 3 ) ?
			src.target.parentNode :
			src.target;

		this.currentTarget = src.currentTarget;
		this.relatedTarget = src.relatedTarget;

	// Event type
	} else {
		this.type = src;
	}

	// Put explicitly provided properties onto the event object
	if ( props ) {
		jQuery.extend( this, props );
	}

	// Create a timestamp if incoming event doesn't have one
	this.timeStamp = src && src.timeStamp || Date.now();

	// Mark it as fixed
	this[ jQuery.expando ] = true;
};

// jQuery.Event is based on DOM3 Events as specified by the ECMAScript Language Binding
// https://www.w3.org/TR/2003/WD-DOM-Level-3-Events-20030331/ecma-script-binding.html
jQuery.Event.prototype = {
	constructor: jQuery.Event,
	isDefaultPrevented: returnFalse,
	isPropagationStopped: returnFalse,
	isImmediatePropagationStopped: returnFalse,
	isSimulated: false,

	preventDefault: function() {
		var e = this.originalEvent;

		this.isDefaultPrevented = returnTrue;

		if ( e && !this.isSimulated ) {
			e.preventDefault();
		}
	},
	stopPropagation: function() {
		var e = this.originalEvent;

		this.isPropagationStopped = returnTrue;

		if ( e && !this.isSimulated ) {
			e.stopPropagation();
		}
	},
	stopImmediatePropagation: function() {
		var e = this.originalEvent;

		this.isImmediatePropagationStopped = returnTrue;

		if ( e && !this.isSimulated ) {
			e.stopImmediatePropagation();
		}

		this.stopPropagation();
	}
};

// Includes all common event props including KeyEvent and MouseEvent specific props
jQuery.each( {
	altKey: true,
	bubbles: true,
	cancelable: true,
	changedTouches: true,
	ctrlKey: true,
	detail: true,
	eventPhase: true,
	metaKey: true,
	pageX: true,
	pageY: true,
	shiftKey: true,
	view: true,
	"char": true,
	code: true,
	charCode: true,
	key: true,
	keyCode: true,
	button: true,
	buttons: true,
	clientX: true,
	clientY: true,
	offsetX: true,
	offsetY: true,
	pointerId: true,
	pointerType: true,
	screenX: true,
	screenY: true,
	targetTouches: true,
	toElement: true,
	touches: true,
	which: true
}, jQuery.event.addProp );

jQuery.each( { focus: "focusin", blur: "focusout" }, function( type, delegateType ) {

	function focusMappedHandler( nativeEvent ) {
		if ( document.documentMode ) {

			// Support: IE 11+
			// Attach a single focusin/focusout handler on the document while someone wants
			// focus/blur. This is because the former are synchronous in IE while the latter
			// are async. In other browsers, all those handlers are invoked synchronously.

			// `handle` from private data would already wrap the event, but we need
			// to change the `type` here.
			var handle = dataPriv.get( this, "handle" ),
				event = jQuery.event.fix( nativeEvent );
			event.type = nativeEvent.type === "focusin" ? "focus" : "blur";
			event.isSimulated = true;

			// First, handle focusin/focusout
			handle( nativeEvent );

			// ...then, handle focus/blur
			//
			// focus/blur don't bubble while focusin/focusout do; simulate the former by only
			// invoking the handler at the lower level.
			if ( event.target === event.currentTarget ) {

				// The setup part calls `leverageNative`, which, in turn, calls
				// `jQuery.event.add`, so event handle will already have been set
				// by this point.
				handle( event );
			}
		} else {

			// For non-IE browsers, attach a single capturing handler on the document
			// while someone wants focusin/focusout.
			jQuery.event.simulate( delegateType, nativeEvent.target,
				jQuery.event.fix( nativeEvent ) );
		}
	}

	jQuery.event.special[ type ] = {

		// Utilize native event if possible so blur/focus sequence is correct
		setup: function() {

			var attaches;

			// Claim the first handler
			// dataPriv.set( this, "focus", ... )
			// dataPriv.set( this, "blur", ... )
			leverageNative( this, type, true );

			if ( document.documentMode ) {

				// Support: IE 9 - 11+
				// We use the same native handler for focusin & focus (and focusout & blur)
				// so we need to coordinate setup & teardown parts between those events.
				// Use `delegateType` as the key as `type` is already used by `leverageNative`.
				attaches = dataPriv.get( this, delegateType );
				if ( !attaches ) {
					this.addEventListener( delegateType, focusMappedHandler );
				}
				dataPriv.set( this, delegateType, ( attaches || 0 ) + 1 );
			} else {

				// Return false to allow normal processing in the caller
				return false;
			}
		},
		trigger: function() {

			// Force setup before trigger
			leverageNative( this, type );

			// Return non-false to allow normal event-path propagation
			return true;
		},

		teardown: function() {
			var attaches;

			if ( document.documentMode ) {
				attaches = dataPriv.get( this, delegateType ) - 1;
				if ( !attaches ) {
					this.removeEventListener( delegateType, focusMappedHandler );
					dataPriv.remove( this, delegateType );
				} else {
					dataPriv.set( this, delegateType, attaches );
				}
			} else {

				// Return false to indicate standard teardown should be applied
				return false;
			}
		},

		// Suppress native focus or blur if we're currently inside
		// a leveraged native-event stack
		_default: function( event ) {
			return dataPriv.get( event.target, type );
		},

		delegateType: delegateType
	};

	// Support: Firefox <=44
	// Firefox doesn't have focus(in | out) events
	// Related ticket - https://bugzilla.mozilla.org/show_bug.cgi?id=687787
	//
	// Support: Chrome <=48 - 49, Safari <=9.0 - 9.1
	// focus(in | out) events fire after focus & blur events,
	// which is spec violation - http://www.w3.org/TR/DOM-Level-3-Events/#events-focusevent-event-order
	// Related ticket - https://bugs.chromium.org/p/chromium/issues/detail?id=449857
	//
	// Support: IE 9 - 11+
	// To preserve relative focusin/focus & focusout/blur event order guaranteed on the 3.x branch,
	// attach a single handler for both events in IE.
	jQuery.event.special[ delegateType ] = {
		setup: function() {

			// Handle: regular nodes (via `this.ownerDocument`), window
			// (via `this.document`) & document (via `this`).
			var doc = this.ownerDocument || this.document || this,
				dataHolder = document.documentMode ? this : doc,
				attaches = dataPriv.get( dataHolder, delegateType );

			// Support: IE 9 - 11+
			// We use the same native handler for focusin & focus (and focusout & blur)
			// so we need to coordinate setup & teardown parts between those events.
			// Use `delegateType` as the key as `type` is already used by `leverageNative`.
			if ( !attaches ) {
				if ( document.documentMode ) {
					this.addEventListener( delegateType, focusMappedHandler );
				} else {
					doc.addEventListener( type, focusMappedHandler, true );
				}
			}
			dataPriv.set( dataHolder, delegateType, ( attaches || 0 ) + 1 );
		},
		teardown: function() {
			var doc = this.ownerDocument || this.document || this,
				dataHolder = document.documentMode ? this : doc,
				attaches = dataPriv.get( dataHolder, delegateType ) - 1;

			if ( !attaches ) {
				if ( document.documentMode ) {
					this.removeEventListener( delegateType, focusMappedHandler );
				} else {
					doc.removeEventListener( type, focusMappedHandler, true );
				}
				dataPriv.remove( dataHolder, delegateType );
			} else {
				dataPriv.set( dataHolder, delegateType, attaches );
			}
		}
	};
} );

// Create mouseenter/leave events using mouseover/out and event-time checks
// so that event delegation works in jQuery.
// Do the same for pointerenter/pointerleave and pointerover/pointerout
//
// Support: Safari 7 only
// Safari sends mouseenter too often; see:
// https://bugs.chromium.org/p/chromium/issues/detail?id=470258
// for the description of the bug (it existed in older Chrome versions as well).
jQuery.each( {
	mouseenter: "mouseover",
	mouseleave: "mouseout",
	pointerenter: "pointerover",
	pointerleave: "pointerout"
}, function( orig, fix ) {
	jQuery.event.special[ orig ] = {
		delegateType: fix,
		bindType: fix,

		handle: function( event ) {
			var ret,
				target = this,
				related = event.relatedTarget,
				handleObj = event.handleObj;

			// For mouseenter/leave call the handler if related is outside the target.
			// NB: No relatedTarget if the mouse left/entered the browser window
			if ( !related || ( related !== target && !jQuery.contains( target, related ) ) ) {
				event.type = handleObj.origType;
				ret = handleObj.handler.apply( this, arguments );
				event.type = fix;
			}
			return ret;
		}
	};
} );

jQuery.fn.extend( {

	on: function( types, selector, data, fn ) {
		return on( this, types, selector, data, fn );
	},
	one: function( types, selector, data, fn ) {
		return on( this, types, selector, data, fn, 1 );
	},
	off: function( types, selector, fn ) {
		var handleObj, type;
		if ( types && types.preventDefault && types.handleObj ) {

			// ( event )  dispatched jQuery.Event
			handleObj = types.handleObj;
			jQuery( types.delegateTarget ).off(
				handleObj.namespace ?
					handleObj.origType + "." + handleObj.namespace :
					handleObj.origType,
				handleObj.selector,
				handleObj.handler
			);
			return this;
		}
		if ( typeof types === "object" ) {

			// ( types-object [, selector] )
			for ( type in types ) {
				this.off( type, selector, types[ type ] );
			}
			return this;
		}
		if ( selector === false || typeof selector === "function" ) {

			// ( types [, fn] )
			fn = selector;
			selector = undefined;
		}
		if ( fn === false ) {
			fn = returnFalse;
		}
		return this.each( function() {
			jQuery.event.remove( this, types, fn, selector );
		} );
	}
} );


var

	// Support: IE <=10 - 11, Edge 12 - 13 only
	// In IE/Edge using regex groups here causes severe slowdowns.
	// See https://connect.microsoft.com/IE/feedback/details/1736512/
	rnoInnerhtml = /<script|<style|<link/i,

	// checked="checked" or checked
	rchecked = /checked\s*(?:[^=]|=\s*.checked.)/i,

	rcleanScript = /^\s*<!\[CDATA\[|\]\]>\s*$/g;

// Prefer a tbody over its parent table for containing new rows
function manipulationTarget( elem, content ) {
	if ( nodeName( elem, "table" ) &&
		nodeName( content.nodeType !== 11 ? content : content.firstChild, "tr" ) ) {

		return jQuery( elem ).children( "tbody" )[ 0 ] || elem;
	}

	return elem;
}

// Replace/restore the type attribute of script elements for safe DOM manipulation
function disableScript( elem ) {
	elem.type = ( elem.getAttribute( "type" ) !== null ) + "/" + elem.type;
	return elem;
}
function restoreScript( elem ) {
	if ( ( elem.type || "" ).slice( 0, 5 ) === "true/" ) {
		elem.type = elem.type.slice( 5 );
	} else {
		elem.removeAttribute( "type" );
	}

	return elem;
}

function cloneCopyEvent( src, dest ) {
	var i, l, type, pdataOld, udataOld, udataCur, events;

	if ( dest.nodeType !== 1 ) {
		return;
	}

	// 1. Copy private data: events, handlers, etc.
	if ( dataPriv.hasData( src ) ) {
		pdataOld = dataPriv.get( src );
		events = pdataOld.events;

		if ( events ) {
			dataPriv.remove( dest, "handle events" );

			for ( type in events ) {
				for ( i = 0, l = events[ type ].length; i < l; i++ ) {
					jQuery.event.add( dest, type, events[ type ][ i ] );
				}
			}
		}
	}

	// 2. Copy user data
	if ( dataUser.hasData( src ) ) {
		udataOld = dataUser.access( src );
		udataCur = jQuery.extend( {}, udataOld );

		dataUser.set( dest, udataCur );
	}
}

// Fix IE bugs, see support tests
function fixInput( src, dest ) {
	var nodeName = dest.nodeName.toLowerCase();

	// Fails to persist the checked state of a cloned checkbox or radio button.
	if ( nodeName === "input" && rcheckableType.test( src.type ) ) {
		dest.checked = src.checked;

	// Fails to return the selected option to the default selected state when cloning options
	} else if ( nodeName === "input" || nodeName === "textarea" ) {
		dest.defaultValue = src.defaultValue;
	}
}

function domManip( collection, args, callback, ignored ) {

	// Flatten any nested arrays
	args = flat( args );

	var fragment, first, scripts, hasScripts, node, doc,
		i = 0,
		l = collection.length,
		iNoClone = l - 1,
		value = args[ 0 ],
		valueIsFunction = isFunction( value );

	// We can't cloneNode fragments that contain checked, in WebKit
	if ( valueIsFunction ||
			( l > 1 && typeof value === "string" &&
				!support.checkClone && rchecked.test( value ) ) ) {
		return collection.each( function( index ) {
			var self = collection.eq( index );
			if ( valueIsFunction ) {
				args[ 0 ] = value.call( this, index, self.html() );
			}
			domManip( self, args, callback, ignored );
		} );
	}

	if ( l ) {
		fragment = buildFragment( args, collection[ 0 ].ownerDocument, false, collection, ignored );
		first = fragment.firstChild;

		if ( fragment.childNodes.length === 1 ) {
			fragment = first;
		}

		// Require either new content or an interest in ignored elements to invoke the callback
		if ( first || ignored ) {
			scripts = jQuery.map( getAll( fragment, "script" ), disableScript );
			hasScripts = scripts.length;

			// Use the original fragment for the last item
			// instead of the first because it can end up
			// being emptied incorrectly in certain situations (trac-8070).
			for ( ; i < l; i++ ) {
				node = fragment;

				if ( i !== iNoClone ) {
					node = jQuery.clone( node, true, true );

					// Keep references to cloned scripts for later restoration
					if ( hasScripts ) {

						// Support: Android <=4.0 only, PhantomJS 1 only
						// push.apply(_, arraylike) throws on ancient WebKit
						jQuery.merge( scripts, getAll( node, "script" ) );
					}
				}

				callback.call( collection[ i ], node, i );
			}

			if ( hasScripts ) {
				doc = scripts[ scripts.length - 1 ].ownerDocument;

				// Re-enable scripts
				jQuery.map( scripts, restoreScript );

				// Evaluate executable scripts on first document insertion
				for ( i = 0; i < hasScripts; i++ ) {
					node = scripts[ i ];
					if ( rscriptType.test( node.type || "" ) &&
						!dataPriv.access( node, "globalEval" ) &&
						jQuery.contains( doc, node ) ) {

						if ( node.src && ( node.type || "" ).toLowerCase()  !== "module" ) {

							// Optional AJAX dependency, but won't run scripts if not present
							if ( jQuery._evalUrl && !node.noModule ) {
								jQuery._evalUrl( node.src, {
									nonce: node.nonce || node.getAttribute( "nonce" )
								}, doc );
							}
						} else {

							// Unwrap a CDATA section containing script contents. This shouldn't be
							// needed as in XML documents they're already not visible when
							// inspecting element contents and in HTML documents they have no
							// meaning but we're preserving that logic for backwards compatibility.
							// This will be removed completely in 4.0. See gh-4904.
							DOMEval( node.textContent.replace( rcleanScript, "" ), node, doc );
						}
					}
				}
			}
		}
	}

	return collection;
}

function remove( elem, selector, keepData ) {
	var node,
		nodes = selector ? jQuery.filter( selector, elem ) : elem,
		i = 0;

	for ( ; ( node = nodes[ i ] ) != null; i++ ) {
		if ( !keepData && node.nodeType === 1 ) {
			jQuery.cleanData( getAll( node ) );
		}

		if ( node.parentNode ) {
			if ( keepData && isAttached( node ) ) {
				setGlobalEval( getAll( node, "script" ) );
			}
			node.parentNode.removeChild( node );
		}
	}

	return elem;
}

jQuery.extend( {
	htmlPrefilter: function( html ) {
		return html;
	},

	clone: function( elem, dataAndEvents, deepDataAndEvents ) {
		var i, l, srcElements, destElements,
			clone = elem.cloneNode( true ),
			inPage = isAttached( elem );

		// Fix IE cloning issues
		if ( !support.noCloneChecked && ( elem.nodeType === 1 || elem.nodeType === 11 ) &&
				!jQuery.isXMLDoc( elem ) ) {

			// We eschew jQuery#find here for performance reasons:
			// https://jsperf.com/getall-vs-sizzle/2
			destElements = getAll( clone );
			srcElements = getAll( elem );

			for ( i = 0, l = srcElements.length; i < l; i++ ) {
				fixInput( srcElements[ i ], destElements[ i ] );
			}
		}

		// Copy the events from the original to the clone
		if ( dataAndEvents ) {
			if ( deepDataAndEvents ) {
				srcElements = srcElements || getAll( elem );
				destElements = destElements || getAll( clone );

				for ( i = 0, l = srcElements.length; i < l; i++ ) {
					cloneCopyEvent( srcElements[ i ], destElements[ i ] );
				}
			} else {
				cloneCopyEvent( elem, clone );
			}
		}

		// Preserve script evaluation history
		destElements = getAll( clone, "script" );
		if ( destElements.length > 0 ) {
			setGlobalEval( destElements, !inPage && getAll( elem, "script" ) );
		}

		// Return the cloned set
		return clone;
	},

	cleanData: function( elems ) {
		var data, elem, type,
			special = jQuery.event.special,
			i = 0;

		for ( ; ( elem = elems[ i ] ) !== undefined; i++ ) {
			if ( acceptData( elem ) ) {
				if ( ( data = elem[ dataPriv.expando ] ) ) {
					if ( data.events ) {
						for ( type in data.events ) {
							if ( special[ type ] ) {
								jQuery.event.remove( elem, type );

							// This is a shortcut to avoid jQuery.event.remove's overhead
							} else {
								jQuery.removeEvent( elem, type, data.handle );
							}
						}
					}

					// Support: Chrome <=35 - 45+
					// Assign undefined instead of using delete, see Data#remove
					elem[ dataPriv.expando ] = undefined;
				}
				if ( elem[ dataUser.expando ] ) {

					// Support: Chrome <=35 - 45+
					// Assign undefined instead of using delete, see Data#remove
					elem[ dataUser.expando ] = undefined;
				}
			}
		}
	}
} );

jQuery.fn.extend( {
	detach: function( selector ) {
		return remove( this, selector, true );
	},

	remove: function( selector ) {
		return remove( this, selector );
	},

	text: function( value ) {
		return access( this, function( value ) {
			return value === undefined ?
				jQuery.text( this ) :
				this.empty().each( function() {
					if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
						this.textContent = value;
					}
				} );
		}, null, value, arguments.length );
	},

	append: function() {
		return domManip( this, arguments, function( elem ) {
			if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
				var target = manipulationTarget( this, elem );
				target.appendChild( elem );
			}
		} );
	},

	prepend: function() {
		return domManip( this, arguments, function( elem ) {
			if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
				var target = manipulationTarget( this, elem );
				target.insertBefore( elem, target.firstChild );
			}
		} );
	},

	before: function() {
		return domManip( this, arguments, function( elem ) {
			if ( this.parentNode ) {
				this.parentNode.insertBefore( elem, this );
			}
		} );
	},

	after: function() {
		return domManip( this, arguments, function( elem ) {
			if ( this.parentNode ) {
				this.parentNode.insertBefore( elem, this.nextSibling );
			}
		} );
	},

	empty: function() {
		var elem,
			i = 0;

		for ( ; ( elem = this[ i ] ) != null; i++ ) {
			if ( elem.nodeType === 1 ) {

				// Prevent memory leaks
				jQuery.cleanData( getAll( elem, false ) );

				// Remove any remaining nodes
				elem.textContent = "";
			}
		}

		return this;
	},

	clone: function( dataAndEvents, deepDataAndEvents ) {
		dataAndEvents = dataAndEvents == null ? false : dataAndEvents;
		deepDataAndEvents = deepDataAndEvents == null ? dataAndEvents : deepDataAndEvents;

		return this.map( function() {
			return jQuery.clone( this, dataAndEvents, deepDataAndEvents );
		} );
	},

	html: function( value ) {
		return access( this, function( value ) {
			var elem = this[ 0 ] || {},
				i = 0,
				l = this.length;

			if ( value === undefined && elem.nodeType === 1 ) {
				return elem.innerHTML;
			}

			// See if we can take a shortcut and just use innerHTML
			if ( typeof value === "string" && !rnoInnerhtml.test( value ) &&
				!wrapMap[ ( rtagName.exec( value ) || [ "", "" ] )[ 1 ].toLowerCase() ] ) {

				value = jQuery.htmlPrefilter( value );

				try {
					for ( ; i < l; i++ ) {
						elem = this[ i ] || {};

						// Remove element nodes and prevent memory leaks
						if ( elem.nodeType === 1 ) {
							jQuery.cleanData( getAll( elem, false ) );
							elem.innerHTML = value;
						}
					}

					elem = 0;

				// If using innerHTML throws an exception, use the fallback method
				} catch ( e ) {}
			}

			if ( elem ) {
				this.empty().append( value );
			}
		}, null, value, arguments.length );
	},

	replaceWith: function() {
		var ignored = [];

		// Make the changes, replacing each non-ignored context element with the new content
		return domManip( this, arguments, function( elem ) {
			var parent = this.parentNode;

			if ( jQuery.inArray( this, ignored ) < 0 ) {
				jQuery.cleanData( getAll( this ) );
				if ( parent ) {
					parent.replaceChild( elem, this );
				}
			}

		// Force callback invocation
		}, ignored );
	}
} );

jQuery.each( {
	appendTo: "append",
	prependTo: "prepend",
	insertBefore: "before",
	insertAfter: "after",
	replaceAll: "replaceWith"
}, function( name, original ) {
	jQuery.fn[ name ] = function( selector ) {
		var elems,
			ret = [],
			insert = jQuery( selector ),
			last = insert.length - 1,
			i = 0;

		for ( ; i <= last; i++ ) {
			elems = i === last ? this : this.clone( true );
			jQuery( insert[ i ] )[ original ]( elems );

			// Support: Android <=4.0 only, PhantomJS 1 only
			// .get() because push.apply(_, arraylike) throws on ancient WebKit
			push.apply( ret, elems.get() );
		}

		return this.pushStack( ret );
	};
} );
var rnumnonpx = new RegExp( "^(" + pnum + ")(?!px)[a-z%]+$", "i" );

var rcustomProp = /^--/;


var getStyles = function( elem ) {

		// Support: IE <=11 only, Firefox <=30 (trac-15098, trac-14150)
		// IE throws on elements created in popups
		// FF meanwhile throws on frame elements through "defaultView.getComputedStyle"
		var view = elem.ownerDocument.defaultView;

		if ( !view || !view.opener ) {
			view = window;
		}

		return view.getComputedStyle( elem );
	};

var swap = function( elem, options, callback ) {
	var ret, name,
		old = {};

	// Remember the old values, and insert the new ones
	for ( name in options ) {
		old[ name ] = elem.style[ name ];
		elem.style[ name ] = options[ name ];
	}

	ret = callback.call( elem );

	// Revert the old values
	for ( name in options ) {
		elem.style[ name ] = old[ name ];
	}

	return ret;
};


var rboxStyle = new RegExp( cssExpand.join( "|" ), "i" );



( function() {

	// Executing both pixelPosition & boxSizingReliable tests require only one layout
	// so they're executed at the same time to save the second computation.
	function computeStyleTests() {

		// This is a singleton, we need to execute it only once
		if ( !div ) {
			return;
		}

		container.style.cssText = "position:absolute;left:-11111px;width:60px;" +
			"margin-top:1px;padding:0;border:0";
		div.style.cssText =
			"position:relative;display:block;box-sizing:border-box;overflow:scroll;" +
			"margin:auto;border:1px;padding:1px;" +
			"width:60%;top:1%";
		documentElement.appendChild( container ).appendChild( div );

		var divStyle = window.getComputedStyle( div );
		pixelPositionVal = divStyle.top !== "1%";

		// Support: Android 4.0 - 4.3 only, Firefox <=3 - 44
		reliableMarginLeftVal = roundPixelMeasures( divStyle.marginLeft ) === 12;

		// Support: Android 4.0 - 4.3 only, Safari <=9.1 - 10.1, iOS <=7.0 - 9.3
		// Some styles come back with percentage values, even though they shouldn't
		div.style.right = "60%";
		pixelBoxStylesVal = roundPixelMeasures( divStyle.right ) === 36;

		// Support: IE 9 - 11 only
		// Detect misreporting of content dimensions for box-sizing:border-box elements
		boxSizingReliableVal = roundPixelMeasures( divStyle.width ) === 36;

		// Support: IE 9 only
		// Detect overflow:scroll screwiness (gh-3699)
		// Support: Chrome <=64
		// Don't get tricked when zoom affects offsetWidth (gh-4029)
		div.style.position = "absolute";
		scrollboxSizeVal = roundPixelMeasures( div.offsetWidth / 3 ) === 12;

		documentElement.removeChild( container );

		// Nullify the div so it wouldn't be stored in the memory and
		// it will also be a sign that checks already performed
		div = null;
	}

	function roundPixelMeasures( measure ) {
		return Math.round( parseFloat( measure ) );
	}

	var pixelPositionVal, boxSizingReliableVal, scrollboxSizeVal, pixelBoxStylesVal,
		reliableTrDimensionsVal, reliableMarginLeftVal,
		container = document.createElement( "div" ),
		div = document.createElement( "div" );

	// Finish early in limited (non-browser) environments
	if ( !div.style ) {
		return;
	}

	// Support: IE <=9 - 11 only
	// Style of cloned element affects source element cloned (trac-8908)
	div.style.backgroundClip = "content-box";
	div.cloneNode( true ).style.backgroundClip = "";
	support.clearCloneStyle = div.style.backgroundClip === "content-box";

	jQuery.extend( support, {
		boxSizingReliable: function() {
			computeStyleTests();
			return boxSizingReliableVal;
		},
		pixelBoxStyles: function() {
			computeStyleTests();
			return pixelBoxStylesVal;
		},
		pixelPosition: function() {
			computeStyleTests();
			return pixelPositionVal;
		},
		reliableMarginLeft: function() {
			computeStyleTests();
			return reliableMarginLeftVal;
		},
		scrollboxSize: function() {
			computeStyleTests();
			return scrollboxSizeVal;
		},

		// Support: IE 9 - 11+, Edge 15 - 18+
		// IE/Edge misreport `getComputedStyle` of table rows with width/height
		// set in CSS while `offset*` properties report correct values.
		// Behavior in IE 9 is more subtle than in newer versions & it passes
		// some versions of this test; make sure not to make it pass there!
		//
		// Support: Firefox 70+
		// Only Firefox includes border widths
		// in computed dimensions. (gh-4529)
		reliableTrDimensions: function() {
			var table, tr, trChild, trStyle;
			if ( reliableTrDimensionsVal == null ) {
				table = document.createElement( "table" );
				tr = document.createElement( "tr" );
				trChild = document.createElement( "div" );

				table.style.cssText = "position:absolute;left:-11111px;border-collapse:separate";
				tr.style.cssText = "box-sizing:content-box;border:1px solid";

				// Support: Chrome 86+
				// Height set through cssText does not get applied.
				// Computed height then comes back as 0.
				tr.style.height = "1px";
				trChild.style.height = "9px";

				// Support: Android 8 Chrome 86+
				// In our bodyBackground.html iframe,
				// display for all div elements is set to "inline",
				// which causes a problem only in Android 8 Chrome 86.
				// Ensuring the div is `display: block`
				// gets around this issue.
				trChild.style.display = "block";

				documentElement
					.appendChild( table )
					.appendChild( tr )
					.appendChild( trChild );

				trStyle = window.getComputedStyle( tr );
				reliableTrDimensionsVal = ( parseInt( trStyle.height, 10 ) +
					parseInt( trStyle.borderTopWidth, 10 ) +
					parseInt( trStyle.borderBottomWidth, 10 ) ) === tr.offsetHeight;

				documentElement.removeChild( table );
			}
			return reliableTrDimensionsVal;
		}
	} );
} )();


function curCSS( elem, name, computed ) {
	var width, minWidth, maxWidth, ret,
		isCustomProp = rcustomProp.test( name ),

		// Support: Firefox 51+
		// Retrieving style before computed somehow
		// fixes an issue with getting wrong values
		// on detached elements
		style = elem.style;

	computed = computed || getStyles( elem );

	// getPropertyValue is needed for:
	//   .css('filter') (IE 9 only, trac-12537)
	//   .css('--customProperty) (gh-3144)
	if ( computed ) {

		// Support: IE <=9 - 11+
		// IE only supports `"float"` in `getPropertyValue`; in computed styles
		// it's only available as `"cssFloat"`. We no longer modify properties
		// sent to `.css()` apart from camelCasing, so we need to check both.
		// Normally, this would create difference in behavior: if
		// `getPropertyValue` returns an empty string, the value returned
		// by `.css()` would be `undefined`. This is usually the case for
		// disconnected elements. However, in IE even disconnected elements
		// with no styles return `"none"` for `getPropertyValue( "float" )`
		ret = computed.getPropertyValue( name ) || computed[ name ];

		if ( isCustomProp && ret ) {

			// Support: Firefox 105+, Chrome <=105+
			// Spec requires trimming whitespace for custom properties (gh-4926).
			// Firefox only trims leading whitespace. Chrome just collapses
			// both leading & trailing whitespace to a single space.
			//
			// Fall back to `undefined` if empty string returned.
			// This collapses a missing definition with property defined
			// and set to an empty string but there's no standard API
			// allowing us to differentiate them without a performance penalty
			// and returning `undefined` aligns with older jQuery.
			//
			// rtrimCSS treats U+000D CARRIAGE RETURN and U+000C FORM FEED
			// as whitespace while CSS does not, but this is not a problem
			// because CSS preprocessing replaces them with U+000A LINE FEED
			// (which *is* CSS whitespace)
			// https://www.w3.org/TR/css-syntax-3/#input-preprocessing
			ret = ret.replace( rtrimCSS, "$1" ) || undefined;
		}

		if ( ret === "" && !isAttached( elem ) ) {
			ret = jQuery.style( elem, name );
		}

		// A tribute to the "awesome hack by Dean Edwards"
		// Android Browser returns percentage for some values,
		// but width seems to be reliably pixels.
		// This is against the CSSOM draft spec:
		// https://drafts.csswg.org/cssom/#resolved-values
		if ( !support.pixelBoxStyles() && rnumnonpx.test( ret ) && rboxStyle.test( name ) ) {

			// Remember the original values
			width = style.width;
			minWidth = style.minWidth;
			maxWidth = style.maxWidth;

			// Put in the new values to get a computed value out
			style.minWidth = style.maxWidth = style.width = ret;
			ret = computed.width;

			// Revert the changed values
			style.width = width;
			style.minWidth = minWidth;
			style.maxWidth = maxWidth;
		}
	}

	return ret !== undefined ?

		// Support: IE <=9 - 11 only
		// IE returns zIndex value as an integer.
		ret + "" :
		ret;
}


function addGetHookIf( conditionFn, hookFn ) {

	// Define the hook, we'll check on the first run if it's really needed.
	return {
		get: function() {
			if ( conditionFn() ) {

				// Hook not needed (or it's not possible to use it due
				// to missing dependency), remove it.
				delete this.get;
				return;
			}

			// Hook needed; redefine it so that the support test is not executed again.
			return ( this.get = hookFn ).apply( this, arguments );
		}
	};
}


var cssPrefixes = [ "Webkit", "Moz", "ms" ],
	emptyStyle = document.createElement( "div" ).style,
	vendorProps = {};

// Return a vendor-prefixed property or undefined
function vendorPropName( name ) {

	// Check for vendor prefixed names
	var capName = name[ 0 ].toUpperCase() + name.slice( 1 ),
		i = cssPrefixes.length;

	while ( i-- ) {
		name = cssPrefixes[ i ] + capName;
		if ( name in emptyStyle ) {
			return name;
		}
	}
}

// Return a potentially-mapped jQuery.cssProps or vendor prefixed property
function finalPropName( name ) {
	var final = jQuery.cssProps[ name ] || vendorProps[ name ];

	if ( final ) {
		return final;
	}
	if ( name in emptyStyle ) {
		return name;
	}
	return vendorProps[ name ] = vendorPropName( name ) || name;
}


var

	// Swappable if display is none or starts with table
	// except "table", "table-cell", or "table-caption"
	// See here for display values: https://developer.mozilla.org/en-US/docs/CSS/display
	rdisplayswap = /^(none|table(?!-c[ea]).+)/,
	cssShow = { position: "absolute", visibility: "hidden", display: "block" },
	cssNormalTransform = {
		letterSpacing: "0",
		fontWeight: "400"
	};

function setPositiveNumber( _elem, value, subtract ) {

	// Any relative (+/-) values have already been
	// normalized at this point
	var matches = rcssNum.exec( value );
	return matches ?

		// Guard against undefined "subtract", e.g., when used as in cssHooks
		Math.max( 0, matches[ 2 ] - ( subtract || 0 ) ) + ( matches[ 3 ] || "px" ) :
		value;
}

function boxModelAdjustment( elem, dimension, box, isBorderBox, styles, computedVal ) {
	var i = dimension === "width" ? 1 : 0,
		extra = 0,
		delta = 0,
		marginDelta = 0;

	// Adjustment may not be necessary
	if ( box === ( isBorderBox ? "border" : "content" ) ) {
		return 0;
	}

	for ( ; i < 4; i += 2 ) {

		// Both box models exclude margin
		// Count margin delta separately to only add it after scroll gutter adjustment.
		// This is needed to make negative margins work with `outerHeight( true )` (gh-3982).
		if ( box === "margin" ) {
			marginDelta += jQuery.css( elem, box + cssExpand[ i ], true, styles );
		}

		// If we get here with a content-box, we're seeking "padding" or "border" or "margin"
		if ( !isBorderBox ) {

			// Add padding
			delta += jQuery.css( elem, "padding" + cssExpand[ i ], true, styles );

			// For "border" or "margin", add border
			if ( box !== "padding" ) {
				delta += jQuery.css( elem, "border" + cssExpand[ i ] + "Width", true, styles );

			// But still keep track of it otherwise
			} else {
				extra += jQuery.css( elem, "border" + cssExpand[ i ] + "Width", true, styles );
			}

		// If we get here with a border-box (content + padding + border), we're seeking "content" or
		// "padding" or "margin"
		} else {

			// For "content", subtract padding
			if ( box === "content" ) {
				delta -= jQuery.css( elem, "padding" + cssExpand[ i ], true, styles );
			}

			// For "content" or "padding", subtract border
			if ( box !== "margin" ) {
				delta -= jQuery.css( elem, "border" + cssExpand[ i ] + "Width", true, styles );
			}
		}
	}

	// Account for positive content-box scroll gutter when requested by providing computedVal
	if ( !isBorderBox && computedVal >= 0 ) {

		// offsetWidth/offsetHeight is a rounded sum of content, padding, scroll gutter, and border
		// Assuming integer scroll gutter, subtract the rest and round down
		delta += Math.max( 0, Math.ceil(
			elem[ "offset" + dimension[ 0 ].toUpperCase() + dimension.slice( 1 ) ] -
			computedVal -
			delta -
			extra -
			0.5

		// If offsetWidth/offsetHeight is unknown, then we can't determine content-box scroll gutter
		// Use an explicit zero to avoid NaN (gh-3964)
		) ) || 0;
	}

	return delta + marginDelta;
}

function getWidthOrHeight( elem, dimension, extra ) {

	// Start with computed style
	var styles = getStyles( elem ),

		// To avoid forcing a reflow, only fetch boxSizing if we need it (gh-4322).
		// Fake content-box until we know it's needed to know the true value.
		boxSizingNeeded = !support.boxSizingReliable() || extra,
		isBorderBox = boxSizingNeeded &&
			jQuery.css( elem, "boxSizing", false, styles ) === "border-box",
		valueIsBorderBox = isBorderBox,

		val = curCSS( elem, dimension, styles ),
		offsetProp = "offset" + dimension[ 0 ].toUpperCase() + dimension.slice( 1 );

	// Support: Firefox <=54
	// Return a confounding non-pixel value or feign ignorance, as appropriate.
	if ( rnumnonpx.test( val ) ) {
		if ( !extra ) {
			return val;
		}
		val = "auto";
	}


	// Support: IE 9 - 11 only
	// Use offsetWidth/offsetHeight for when box sizing is unreliable.
	// In those cases, the computed value can be trusted to be border-box.
	if ( ( !support.boxSizingReliable() && isBorderBox ||

		// Support: IE 10 - 11+, Edge 15 - 18+
		// IE/Edge misreport `getComputedStyle` of table rows with width/height
		// set in CSS while `offset*` properties report correct values.
		// Interestingly, in some cases IE 9 doesn't suffer from this issue.
		!support.reliableTrDimensions() && nodeName( elem, "tr" ) ||

		// Fall back to offsetWidth/offsetHeight when value is "auto"
		// This happens for inline elements with no explicit setting (gh-3571)
		val === "auto" ||

		// Support: Android <=4.1 - 4.3 only
		// Also use offsetWidth/offsetHeight for misreported inline dimensions (gh-3602)
		!parseFloat( val ) && jQuery.css( elem, "display", false, styles ) === "inline" ) &&

		// Make sure the element is visible & connected
		elem.getClientRects().length ) {

		isBorderBox = jQuery.css( elem, "boxSizing", false, styles ) === "border-box";

		// Where available, offsetWidth/offsetHeight approximate border box dimensions.
		// Where not available (e.g., SVG), assume unreliable box-sizing and interpret the
		// retrieved value as a content box dimension.
		valueIsBorderBox = offsetProp in elem;
		if ( valueIsBorderBox ) {
			val = elem[ offsetProp ];
		}
	}

	// Normalize "" and auto
	val = parseFloat( val ) || 0;

	// Adjust for the element's box model
	return ( val +
		boxModelAdjustment(
			elem,
			dimension,
			extra || ( isBorderBox ? "border" : "content" ),
			valueIsBorderBox,
			styles,

			// Provide the current computed size to request scroll gutter calculation (gh-3589)
			val
		)
	) + "px";
}

jQuery.extend( {

	// Add in style property hooks for overriding the default
	// behavior of getting and setting a style property
	cssHooks: {
		opacity: {
			get: function( elem, computed ) {
				if ( computed ) {

					// We should always get a number back from opacity
					var ret = curCSS( elem, "opacity" );
					return ret === "" ? "1" : ret;
				}
			}
		}
	},

	// Don't automatically add "px" to these possibly-unitless properties
	cssNumber: {
		animationIterationCount: true,
		aspectRatio: true,
		borderImageSlice: true,
		columnCount: true,
		flexGrow: true,
		flexShrink: true,
		fontWeight: true,
		gridArea: true,
		gridColumn: true,
		gridColumnEnd: true,
		gridColumnStart: true,
		gridRow: true,
		gridRowEnd: true,
		gridRowStart: true,
		lineHeight: true,
		opacity: true,
		order: true,
		orphans: true,
		scale: true,
		widows: true,
		zIndex: true,
		zoom: true,

		// SVG-related
		fillOpacity: true,
		floodOpacity: true,
		stopOpacity: true,
		strokeMiterlimit: true,
		strokeOpacity: true
	},

	// Add in properties whose names you wish to fix before
	// setting or getting the value
	cssProps: {},

	// Get and set the style property on a DOM Node
	style: function( elem, name, value, extra ) {

		// Don't set styles on text and comment nodes
		if ( !elem || elem.nodeType === 3 || elem.nodeType === 8 || !elem.style ) {
			return;
		}

		// Make sure that we're working with the right name
		var ret, type, hooks,
			origName = camelCase( name ),
			isCustomProp = rcustomProp.test( name ),
			style = elem.style;

		// Make sure that we're working with the right name. We don't
		// want to query the value if it is a CSS custom property
		// since they are user-defined.
		if ( !isCustomProp ) {
			name = finalPropName( origName );
		}

		// Gets hook for the prefixed version, then unprefixed version
		hooks = jQuery.cssHooks[ name ] || jQuery.cssHooks[ origName ];

		// Check if we're setting a value
		if ( value !== undefined ) {
			type = typeof value;

			// Convert "+=" or "-=" to relative numbers (trac-7345)
			if ( type === "string" && ( ret = rcssNum.exec( value ) ) && ret[ 1 ] ) {
				value = adjustCSS( elem, name, ret );

				// Fixes bug trac-9237
				type = "number";
			}

			// Make sure that null and NaN values aren't set (trac-7116)
			if ( value == null || value !== value ) {
				return;
			}

			// If a number was passed in, add the unit (except for certain CSS properties)
			// The isCustomProp check can be removed in jQuery 4.0 when we only auto-append
			// "px" to a few hardcoded values.
			if ( type === "number" && !isCustomProp ) {
				value += ret && ret[ 3 ] || ( jQuery.cssNumber[ origName ] ? "" : "px" );
			}

			// background-* props affect original clone's values
			if ( !support.clearCloneStyle && value === "" && name.indexOf( "background" ) === 0 ) {
				style[ name ] = "inherit";
			}

			// If a hook was provided, use that value, otherwise just set the specified value
			if ( !hooks || !( "set" in hooks ) ||
				( value = hooks.set( elem, value, extra ) ) !== undefined ) {

				if ( isCustomProp ) {
					style.setProperty( name, value );
				} else {
					style[ name ] = value;
				}
			}

		} else {

			// If a hook was provided get the non-computed value from there
			if ( hooks && "get" in hooks &&
				( ret = hooks.get( elem, false, extra ) ) !== undefined ) {

				return ret;
			}

			// Otherwise just get the value from the style object
			return style[ name ];
		}
	},

	css: function( elem, name, extra, styles ) {
		var val, num, hooks,
			origName = camelCase( name ),
			isCustomProp = rcustomProp.test( name );

		// Make sure that we're working with the right name. We don't
		// want to modify the value if it is a CSS custom property
		// since they are user-defined.
		if ( !isCustomProp ) {
			name = finalPropName( origName );
		}

		// Try prefixed name followed by the unprefixed name
		hooks = jQuery.cssHooks[ name ] || jQuery.cssHooks[ origName ];

		// If a hook was provided get the computed value from there
		if ( hooks && "get" in hooks ) {
			val = hooks.get( elem, true, extra );
		}

		// Otherwise, if a way to get the computed value exists, use that
		if ( val === undefined ) {
			val = curCSS( elem, name, styles );
		}

		// Convert "normal" to computed value
		if ( val === "normal" && name in cssNormalTransform ) {
			val = cssNormalTransform[ name ];
		}

		// Make numeric if forced or a qualifier was provided and val looks numeric
		if ( extra === "" || extra ) {
			num = parseFloat( val );
			return extra === true || isFinite( num ) ? num || 0 : val;
		}

		return val;
	}
} );

jQuery.each( [ "height", "width" ], function( _i, dimension ) {
	jQuery.cssHooks[ dimension ] = {
		get: function( elem, computed, extra ) {
			if ( computed ) {

				// Certain elements can have dimension info if we invisibly show them
				// but it must have a current display style that would benefit
				return rdisplayswap.test( jQuery.css( elem, "display" ) ) &&

					// Support: Safari 8+
					// Table columns in Safari have non-zero offsetWidth & zero
					// getBoundingClientRect().width unless display is changed.
					// Support: IE <=11 only
					// Running getBoundingClientRect on a disconnected node
					// in IE throws an error.
					( !elem.getClientRects().length || !elem.getBoundingClientRect().width ) ?
					swap( elem, cssShow, function() {
						return getWidthOrHeight( elem, dimension, extra );
					} ) :
					getWidthOrHeight( elem, dimension, extra );
			}
		},

		set: function( elem, value, extra ) {
			var matches,
				styles = getStyles( elem ),

				// Only read styles.position if the test has a chance to fail
				// to avoid forcing a reflow.
				scrollboxSizeBuggy = !support.scrollboxSize() &&
					styles.position === "absolute",

				// To avoid forcing a reflow, only fetch boxSizing if we need it (gh-3991)
				boxSizingNeeded = scrollboxSizeBuggy || extra,
				isBorderBox = boxSizingNeeded &&
					jQuery.css( elem, "boxSizing", false, styles ) === "border-box",
				subtract = extra ?
					boxModelAdjustment(
						elem,
						dimension,
						extra,
						isBorderBox,
						styles
					) :
					0;

			// Account for unreliable border-box dimensions by comparing offset* to computed and
			// faking a content-box to get border and padding (gh-3699)
			if ( isBorderBox && scrollboxSizeBuggy ) {
				subtract -= Math.ceil(
					elem[ "offset" + dimension[ 0 ].toUpperCase() + dimension.slice( 1 ) ] -
					parseFloat( styles[ dimension ] ) -
					boxModelAdjustment( elem, dimension, "border", false, styles ) -
					0.5
				);
			}

			// Convert to pixels if value adjustment is needed
			if ( subtract && ( matches = rcssNum.exec( value ) ) &&
				( matches[ 3 ] || "px" ) !== "px" ) {

				elem.style[ dimension ] = value;
				value = jQuery.css( elem, dimension );
			}

			return setPositiveNumber( elem, value, subtract );
		}
	};
} );

jQuery.cssHooks.marginLeft = addGetHookIf( support.reliableMarginLeft,
	function( elem, computed ) {
		if ( computed ) {
			return ( parseFloat( curCSS( elem, "marginLeft" ) ) ||
				elem.getBoundingClientRect().left -
					swap( elem, { marginLeft: 0 }, function() {
						return elem.getBoundingClientRect().left;
					} )
			) + "px";
		}
	}
);

// These hooks are used by animate to expand properties
jQuery.each( {
	margin: "",
	padding: "",
	border: "Width"
}, function( prefix, suffix ) {
	jQuery.cssHooks[ prefix + suffix ] = {
		expand: function( value ) {
			var i = 0,
				expanded = {},

				// Assumes a single number if not a string
				parts = typeof value === "string" ? value.split( " " ) : [ value ];

			for ( ; i < 4; i++ ) {
				expanded[ prefix + cssExpand[ i ] + suffix ] =
					parts[ i ] || parts[ i - 2 ] || parts[ 0 ];
			}

			return expanded;
		}
	};

	if ( prefix !== "margin" ) {
		jQuery.cssHooks[ prefix + suffix ].set = setPositiveNumber;
	}
} );

jQuery.fn.extend( {
	css: function( name, value ) {
		return access( this, function( elem, name, value ) {
			var styles, len,
				map = {},
				i = 0;

			if ( Array.isArray( name ) ) {
				styles = getStyles( elem );
				len = name.length;

				for ( ; i < len; i++ ) {
					map[ name[ i ] ] = jQuery.css( elem, name[ i ], false, styles );
				}

				return map;
			}

			return value !== undefined ?
				jQuery.style( elem, name, value ) :
				jQuery.css( elem, name );
		}, name, value, arguments.length > 1 );
	}
} );


function Tween( elem, options, prop, end, easing ) {
	return new Tween.prototype.init( elem, options, prop, end, easing );
}
jQuery.Tween = Tween;

Tween.prototype = {
	constructor: Tween,
	init: function( elem, options, prop, end, easing, unit ) {
		this.elem = elem;
		this.prop = prop;
		this.easing = easing || jQuery.easing._default;
		this.options = options;
		this.start = this.now = this.cur();
		this.end = end;
		this.unit = unit || ( jQuery.cssNumber[ prop ] ? "" : "px" );
	},
	cur: function() {
		var hooks = Tween.propHooks[ this.prop ];

		return hooks && hooks.get ?
			hooks.get( this ) :
			Tween.propHooks._default.get( this );
	},
	run: function( percent ) {
		var eased,
			hooks = Tween.propHooks[ this.prop ];

		if ( this.options.duration ) {
			this.pos = eased = jQuery.easing[ this.easing ](
				percent, this.options.duration * percent, 0, 1, this.options.duration
			);
		} else {
			this.pos = eased = percent;
		}
		this.now = ( this.end - this.start ) * eased + this.start;

		if ( this.options.step ) {
			this.options.step.call( this.elem, this.now, this );
		}

		if ( hooks && hooks.set ) {
			hooks.set( this );
		} else {
			Tween.propHooks._default.set( this );
		}
		return this;
	}
};

Tween.prototype.init.prototype = Tween.prototype;

Tween.propHooks = {
	_default: {
		get: function( tween ) {
			var result;

			// Use a property on the element directly when it is not a DOM element,
			// or when there is no matching style property that exists.
			if ( tween.elem.nodeType !== 1 ||
				tween.elem[ tween.prop ] != null && tween.elem.style[ tween.prop ] == null ) {
				return tween.elem[ tween.prop ];
			}

			// Passing an empty string as a 3rd parameter to .css will automatically
			// attempt a parseFloat and fallback to a string if the parse fails.
			// Simple values such as "10px" are parsed to Float;
			// complex values such as "rotate(1rad)" are returned as-is.
			result = jQuery.css( tween.elem, tween.prop, "" );

			// Empty strings, null, undefined and "auto" are converted to 0.
			return !result || result === "auto" ? 0 : result;
		},
		set: function( tween ) {

			// Use step hook for back compat.
			// Use cssHook if its there.
			// Use .style if available and use plain properties where available.
			if ( jQuery.fx.step[ tween.prop ] ) {
				jQuery.fx.step[ tween.prop ]( tween );
			} else if ( tween.elem.nodeType === 1 && (
				jQuery.cssHooks[ tween.prop ] ||
					tween.elem.style[ finalPropName( tween.prop ) ] != null ) ) {
				jQuery.style( tween.elem, tween.prop, tween.now + tween.unit );
			} else {
				tween.elem[ tween.prop ] = tween.now;
			}
		}
	}
};

// Support: IE <=9 only
// Panic based approach to setting things on disconnected nodes
Tween.propHooks.scrollTop = Tween.propHooks.scrollLeft = {
	set: function( tween ) {
		if ( tween.elem.nodeType && tween.elem.parentNode ) {
			tween.elem[ tween.prop ] = tween.now;
		}
	}
};

jQuery.easing = {
	linear: function( p ) {
		return p;
	},
	swing: function( p ) {
		return 0.5 - Math.cos( p * Math.PI ) / 2;
	},
	_default: "swing"
};

jQuery.fx = Tween.prototype.init;

// Back compat <1.8 extension point
jQuery.fx.step = {};




var
	fxNow, inProgress,
	rfxtypes = /^(?:toggle|show|hide)$/,
	rrun = /queueHooks$/;

function schedule() {
	if ( inProgress ) {
		if ( document.hidden === false && window.requestAnimationFrame ) {
			window.requestAnimationFrame( schedule );
		} else {
			window.setTimeout( schedule, jQuery.fx.interval );
		}

		jQuery.fx.tick();
	}
}

// Animations created synchronously will run synchronously
function createFxNow() {
	window.setTimeout( function() {
		fxNow = undefined;
	} );
	return ( fxNow = Date.now() );
}

// Generate parameters to create a standard animation
function genFx( type, includeWidth ) {
	var which,
		i = 0,
		attrs = { height: type };

	// If we include width, step value is 1 to do all cssExpand values,
	// otherwise step value is 2 to skip over Left and Right
	includeWidth = includeWidth ? 1 : 0;
	for ( ; i < 4; i += 2 - includeWidth ) {
		which = cssExpand[ i ];
		attrs[ "margin" + which ] = attrs[ "padding" + which ] = type;
	}

	if ( includeWidth ) {
		attrs.opacity = attrs.width = type;
	}

	return attrs;
}

function createTween( value, prop, animation ) {
	var tween,
		collection = ( Animation.tweeners[ prop ] || [] ).concat( Animation.tweeners[ "*" ] ),
		index = 0,
		length = collection.length;
	for ( ; index < length; index++ ) {
		if ( ( tween = collection[ index ].call( animation, prop, value ) ) ) {

			// We're done with this property
			return tween;
		}
	}
}

function defaultPrefilter( elem, props, opts ) {
	var prop, value, toggle, hooks, oldfire, propTween, restoreDisplay, display,
		isBox = "width" in props || "height" in props,
		anim = this,
		orig = {},
		style = elem.style,
		hidden = elem.nodeType && isHiddenWithinTree( elem ),
		dataShow = dataPriv.get( elem, "fxshow" );

	// Queue-skipping animations hijack the fx hooks
	if ( !opts.queue ) {
		hooks = jQuery._queueHooks( elem, "fx" );
		if ( hooks.unqueued == null ) {
			hooks.unqueued = 0;
			oldfire = hooks.empty.fire;
			hooks.empty.fire = function() {
				if ( !hooks.unqueued ) {
					oldfire();
				}
			};
		}
		hooks.unqueued++;

		anim.always( function() {

			// Ensure the complete handler is called before this completes
			anim.always( function() {
				hooks.unqueued--;
				if ( !jQuery.queue( elem, "fx" ).length ) {
					hooks.empty.fire();
				}
			} );
		} );
	}

	// Detect show/hide animations
	for ( prop in props ) {
		value = props[ prop ];
		if ( rfxtypes.test( value ) ) {
			delete props[ prop ];
			toggle = toggle || value === "toggle";
			if ( value === ( hidden ? "hide" : "show" ) ) {

				// Pretend to be hidden if this is a "show" and
				// there is still data from a stopped show/hide
				if ( value === "show" && dataShow && dataShow[ prop ] !== undefined ) {
					hidden = true;

				// Ignore all other no-op show/hide data
				} else {
					continue;
				}
			}
			orig[ prop ] = dataShow && dataShow[ prop ] || jQuery.style( elem, prop );
		}
	}

	// Bail out if this is a no-op like .hide().hide()
	propTween = !jQuery.isEmptyObject( props );
	if ( !propTween && jQuery.isEmptyObject( orig ) ) {
		return;
	}

	// Restrict "overflow" and "display" styles during box animations
	if ( isBox && elem.nodeType === 1 ) {

		// Support: IE <=9 - 11, Edge 12 - 15
		// Record all 3 overflow attributes because IE does not infer the shorthand
		// from identically-valued overflowX and overflowY and Edge just mirrors
		// the overflowX value there.
		opts.overflow = [ style.overflow, style.overflowX, style.overflowY ];

		// Identify a display type, preferring old show/hide data over the CSS cascade
		restoreDisplay = dataShow && dataShow.display;
		if ( restoreDisplay == null ) {
			restoreDisplay = dataPriv.get( elem, "display" );
		}
		display = jQuery.css( elem, "display" );
		if ( display === "none" ) {
			if ( restoreDisplay ) {
				display = restoreDisplay;
			} else {

				// Get nonempty value(s) by temporarily forcing visibility
				showHide( [ elem ], true );
				restoreDisplay = elem.style.display || restoreDisplay;
				display = jQuery.css( elem, "display" );
				showHide( [ elem ] );
			}
		}

		// Animate inline elements as inline-block
		if ( display === "inline" || display === "inline-block" && restoreDisplay != null ) {
			if ( jQuery.css( elem, "float" ) === "none" ) {

				// Restore the original display value at the end of pure show/hide animations
				if ( !propTween ) {
					anim.done( function() {
						style.display = restoreDisplay;
					} );
					if ( restoreDisplay == null ) {
						display = style.display;
						restoreDisplay = display === "none" ? "" : display;
					}
				}
				style.display = "inline-block";
			}
		}
	}

	if ( opts.overflow ) {
		style.overflow = "hidden";
		anim.always( function() {
			style.overflow = opts.overflow[ 0 ];
			style.overflowX = opts.overflow[ 1 ];
			style.overflowY = opts.overflow[ 2 ];
		} );
	}

	// Implement show/hide animations
	propTween = false;
	for ( prop in orig ) {

		// General show/hide setup for this element animation
		if ( !propTween ) {
			if ( dataShow ) {
				if ( "hidden" in dataShow ) {
					hidden = dataShow.hidden;
				}
			} else {
				dataShow = dataPriv.access( elem, "fxshow", { display: restoreDisplay } );
			}

			// Store hidden/visible for toggle so `.stop().toggle()` "reverses"
			if ( toggle ) {
				dataShow.hidden = !hidden;
			}

			// Show elements before animating them
			if ( hidden ) {
				showHide( [ elem ], true );
			}

			/* eslint-disable no-loop-func */

			anim.done( function() {

				/* eslint-enable no-loop-func */

				// The final step of a "hide" animation is actually hiding the element
				if ( !hidden ) {
					showHide( [ elem ] );
				}
				dataPriv.remove( elem, "fxshow" );
				for ( prop in orig ) {
					jQuery.style( elem, prop, orig[ prop ] );
				}
			} );
		}

		// Per-property setup
		propTween = createTween( hidden ? dataShow[ prop ] : 0, prop, anim );
		if ( !( prop in dataShow ) ) {
			dataShow[ prop ] = propTween.start;
			if ( hidden ) {
				propTween.end = propTween.start;
				propTween.start = 0;
			}
		}
	}
}

function propFilter( props, specialEasing ) {
	var index, name, easing, value, hooks;

	// camelCase, specialEasing and expand cssHook pass
	for ( index in props ) {
		name = camelCase( index );
		easing = specialEasing[ name ];
		value = props[ index ];
		if ( Array.isArray( value ) ) {
			easing = value[ 1 ];
			value = props[ index ] = value[ 0 ];
		}

		if ( index !== name ) {
			props[ name ] = value;
			delete props[ index ];
		}

		hooks = jQuery.cssHooks[ name ];
		if ( hooks && "expand" in hooks ) {
			value = hooks.expand( value );
			delete props[ name ];

			// Not quite $.extend, this won't overwrite existing keys.
			// Reusing 'index' because we have the correct "name"
			for ( index in value ) {
				if ( !( index in props ) ) {
					props[ index ] = value[ index ];
					specialEasing[ index ] = easing;
				}
			}
		} else {
			specialEasing[ name ] = easing;
		}
	}
}

function Animation( elem, properties, options ) {
	var result,
		stopped,
		index = 0,
		length = Animation.prefilters.length,
		deferred = jQuery.Deferred().always( function() {

			// Don't match elem in the :animated selector
			delete tick.elem;
		} ),
		tick = function() {
			if ( stopped ) {
				return false;
			}
			var currentTime = fxNow || createFxNow(),
				remaining = Math.max( 0, animation.startTime + animation.duration - currentTime ),

				// Support: Android 2.3 only
				// Archaic crash bug won't allow us to use `1 - ( 0.5 || 0 )` (trac-12497)
				temp = remaining / animation.duration || 0,
				percent = 1 - temp,
				index = 0,
				length = animation.tweens.length;

			for ( ; index < length; index++ ) {
				animation.tweens[ index ].run( percent );
			}

			deferred.notifyWith( elem, [ animation, percent, remaining ] );

			// If there's more to do, yield
			if ( percent < 1 && length ) {
				return remaining;
			}

			// If this was an empty animation, synthesize a final progress notification
			if ( !length ) {
				deferred.notifyWith( elem, [ animation, 1, 0 ] );
			}

			// Resolve the animation and report its conclusion
			deferred.resolveWith( elem, [ animation ] );
			return false;
		},
		animation = deferred.promise( {
			elem: elem,
			props: jQuery.extend( {}, properties ),
			opts: jQuery.extend( true, {
				specialEasing: {},
				easing: jQuery.easing._default
			}, options ),
			originalProperties: properties,
			originalOptions: options,
			startTime: fxNow || createFxNow(),
			duration: options.duration,
			tweens: [],
			createTween: function( prop, end ) {
				var tween = jQuery.Tween( elem, animation.opts, prop, end,
					animation.opts.specialEasing[ prop ] || animation.opts.easing );
				animation.tweens.push( tween );
				return tween;
			},
			stop: function( gotoEnd ) {
				var index = 0,

					// If we are going to the end, we want to run all the tweens
					// otherwise we skip this part
					length = gotoEnd ? animation.tweens.length : 0;
				if ( stopped ) {
					return this;
				}
				stopped = true;
				for ( ; index < length; index++ ) {
					animation.tweens[ index ].run( 1 );
				}

				// Resolve when we played the last frame; otherwise, reject
				if ( gotoEnd ) {
					deferred.notifyWith( elem, [ animation, 1, 0 ] );
					deferred.resolveWith( elem, [ animation, gotoEnd ] );
				} else {
					deferred.rejectWith( elem, [ animation, gotoEnd ] );
				}
				return this;
			}
		} ),
		props = animation.props;

	propFilter( props, animation.opts.specialEasing );

	for ( ; index < length; index++ ) {
		result = Animation.prefilters[ index ].call( animation, elem, props, animation.opts );
		if ( result ) {
			if ( isFunction( result.stop ) ) {
				jQuery._queueHooks( animation.elem, animation.opts.queue ).stop =
					result.stop.bind( result );
			}
			return result;
		}
	}

	jQuery.map( props, createTween, animation );

	if ( isFunction( animation.opts.start ) ) {
		animation.opts.start.call( elem, animation );
	}

	// Attach callbacks from options
	animation
		.progress( animation.opts.progress )
		.done( animation.opts.done, animation.opts.complete )
		.fail( animation.opts.fail )
		.always( animation.opts.always );

	jQuery.fx.timer(
		jQuery.extend( tick, {
			elem: elem,
			anim: animation,
			queue: animation.opts.queue
		} )
	);

	return animation;
}

jQuery.Animation = jQuery.extend( Animation, {

	tweeners: {
		"*": [ function( prop, value ) {
			var tween = this.createTween( prop, value );
			adjustCSS( tween.elem, prop, rcssNum.exec( value ), tween );
			return tween;
		} ]
	},

	tweener: function( props, callback ) {
		if ( isFunction( props ) ) {
			callback = props;
			props = [ "*" ];
		} else {
			props = props.match( rnothtmlwhite );
		}

		var prop,
			index = 0,
			length = props.length;

		for ( ; index < length; index++ ) {
			prop = props[ index ];
			Animation.tweeners[ prop ] = Animation.tweeners[ prop ] || [];
			Animation.tweeners[ prop ].unshift( callback );
		}
	},

	prefilters: [ defaultPrefilter ],

	prefilter: function( callback, prepend ) {
		if ( prepend ) {
			Animation.prefilters.unshift( callback );
		} else {
			Animation.prefilters.push( callback );
		}
	}
} );

jQuery.speed = function( speed, easing, fn ) {
	var opt = speed && typeof speed === "object" ? jQuery.extend( {}, speed ) : {
		complete: fn || !fn && easing ||
			isFunction( speed ) && speed,
		duration: speed,
		easing: fn && easing || easing && !isFunction( easing ) && easing
	};

	// Go to the end state if fx are off
	if ( jQuery.fx.off ) {
		opt.duration = 0;

	} else {
		if ( typeof opt.duration !== "number" ) {
			if ( opt.duration in jQuery.fx.speeds ) {
				opt.duration = jQuery.fx.speeds[ opt.duration ];

			} else {
				opt.duration = jQuery.fx.speeds._default;
			}
		}
	}

	// Normalize opt.queue - true/undefined/null -> "fx"
	if ( opt.queue == null || opt.queue === true ) {
		opt.queue = "fx";
	}

	// Queueing
	opt.old = opt.complete;

	opt.complete = function() {
		if ( isFunction( opt.old ) ) {
			opt.old.call( this );
		}

		if ( opt.queue ) {
			jQuery.dequeue( this, opt.queue );
		}
	};

	return opt;
};

jQuery.fn.extend( {
	fadeTo: function( speed, to, easing, callback ) {

		// Show any hidden elements after setting opacity to 0
		return this.filter( isHiddenWithinTree ).css( "opacity", 0 ).show()

			// Animate to the value specified
			.end().animate( { opacity: to }, speed, easing, callback );
	},
	animate: function( prop, speed, easing, callback ) {
		var empty = jQuery.isEmptyObject( prop ),
			optall = jQuery.speed( speed, easing, callback ),
			doAnimation = function() {

				// Operate on a copy of prop so per-property easing won't be lost
				var anim = Animation( this, jQuery.extend( {}, prop ), optall );

				// Empty animations, or finishing resolves immediately
				if ( empty || dataPriv.get( this, "finish" ) ) {
					anim.stop( true );
				}
			};

		doAnimation.finish = doAnimation;

		return empty || optall.queue === false ?
			this.each( doAnimation ) :
			this.queue( optall.queue, doAnimation );
	},
	stop: function( type, clearQueue, gotoEnd ) {
		var stopQueue = function( hooks ) {
			var stop = hooks.stop;
			delete hooks.stop;
			stop( gotoEnd );
		};

		if ( typeof type !== "string" ) {
			gotoEnd = clearQueue;
			clearQueue = type;
			type = undefined;
		}
		if ( clearQueue ) {
			this.queue( type || "fx", [] );
		}

		return this.each( function() {
			var dequeue = true,
				index = type != null && type + "queueHooks",
				timers = jQuery.timers,
				data = dataPriv.get( this );

			if ( index ) {
				if ( data[ index ] && data[ index ].stop ) {
					stopQueue( data[ index ] );
				}
			} else {
				for ( index in data ) {
					if ( data[ index ] && data[ index ].stop && rrun.test( index ) ) {
						stopQueue( data[ index ] );
					}
				}
			}

			for ( index = timers.length; index--; ) {
				if ( timers[ index ].elem === this &&
					( type == null || timers[ index ].queue === type ) ) {

					timers[ index ].anim.stop( gotoEnd );
					dequeue = false;
					timers.splice( index, 1 );
				}
			}

			// Start the next in the queue if the last step wasn't forced.
			// Timers currently will call their complete callbacks, which
			// will dequeue but only if they were gotoEnd.
			if ( dequeue || !gotoEnd ) {
				jQuery.dequeue( this, type );
			}
		} );
	},
	finish: function( type ) {
		if ( type !== false ) {
			type = type || "fx";
		}
		return this.each( function() {
			var index,
				data = dataPriv.get( this ),
				queue = data[ type + "queue" ],
				hooks = data[ type + "queueHooks" ],
				timers = jQuery.timers,
				length = queue ? queue.length : 0;

			// Enable finishing flag on private data
			data.finish = true;

			// Empty the queue first
			jQuery.queue( this, type, [] );

			if ( hooks && hooks.stop ) {
				hooks.stop.call( this, true );
			}

			// Look for any active animations, and finish them
			for ( index = timers.length; index--; ) {
				if ( timers[ index ].elem === this && timers[ index ].queue === type ) {
					timers[ index ].anim.stop( true );
					timers.splice( index, 1 );
				}
			}

			// Look for any animations in the old queue and finish them
			for ( index = 0; index < length; index++ ) {
				if ( queue[ index ] && queue[ index ].finish ) {
					queue[ index ].finish.call( this );
				}
			}

			// Turn off finishing flag
			delete data.finish;
		} );
	}
} );

jQuery.each( [ "toggle", "show", "hide" ], function( _i, name ) {
	var cssFn = jQuery.fn[ name ];
	jQuery.fn[ name ] = function( speed, easing, callback ) {
		return speed == null || typeof speed === "boolean" ?
			cssFn.apply( this, arguments ) :
			this.animate( genFx( name, true ), speed, easing, callback );
	};
} );

// Generate shortcuts for custom animations
jQuery.each( {
	slideDown: genFx( "show" ),
	slideUp: genFx( "hide" ),
	slideToggle: genFx( "toggle" ),
	fadeIn: { opacity: "show" },
	fadeOut: { opacity: "hide" },
	fadeToggle: { opacity: "toggle" }
}, function( name, props ) {
	jQuery.fn[ name ] = function( speed, easing, callback ) {
		return this.animate( props, speed, easing, callback );
	};
} );

jQuery.timers = [];
jQuery.fx.tick = function() {
	var timer,
		i = 0,
		timers = jQuery.timers;

	fxNow = Date.now();

	for ( ; i < timers.length; i++ ) {
		timer = timers[ i ];

		// Run the timer and safely remove it when done (allowing for external removal)
		if ( !timer() && timers[ i ] === timer ) {
			timers.splice( i--, 1 );
		}
	}

	if ( !timers.length ) {
		jQuery.fx.stop();
	}
	fxNow = undefined;
};

jQuery.fx.timer = function( timer ) {
	jQuery.timers.push( timer );
	jQuery.fx.start();
};

jQuery.fx.interval = 13;
jQuery.fx.start = function() {
	if ( inProgress ) {
		return;
	}

	inProgress = true;
	schedule();
};

jQuery.fx.stop = function() {
	inProgress = null;
};

jQuery.fx.speeds = {
	slow: 600,
	fast: 200,

	// Default speed
	_default: 400
};


// Based off of the plugin by Clint Helfers, with permission.
jQuery.fn.delay = function( time, type ) {
	time = jQuery.fx ? jQuery.fx.speeds[ time ] || time : time;
	type = type || "fx";

	return this.queue( type, function( next, hooks ) {
		var timeout = window.setTimeout( next, time );
		hooks.stop = function() {
			window.clearTimeout( timeout );
		};
	} );
};


( function() {
	var input = document.createElement( "input" ),
		select = document.createElement( "select" ),
		opt = select.appendChild( document.createElement( "option" ) );

	input.type = "checkbox";

	// Support: Android <=4.3 only
	// Default value for a checkbox should be "on"
	support.checkOn = input.value !== "";

	// Support: IE <=11 only
	// Must access selectedIndex to make default options select
	support.optSelected = opt.selected;

	// Support: IE <=11 only
	// An input loses its value after becoming a radio
	input = document.createElement( "input" );
	input.value = "t";
	input.type = "radio";
	support.radioValue = input.value === "t";
} )();


var boolHook,
	attrHandle = jQuery.expr.attrHandle;

jQuery.fn.extend( {
	attr: function( name, value ) {
		return access( this, jQuery.attr, name, value, arguments.length > 1 );
	},

	removeAttr: function( name ) {
		return this.each( function() {
			jQuery.removeAttr( this, name );
		} );
	}
} );

jQuery.extend( {
	attr: function( elem, name, value ) {
		var ret, hooks,
			nType = elem.nodeType;

		// Don't get/set attributes on text, comment and attribute nodes
		if ( nType === 3 || nType === 8 || nType === 2 ) {
			return;
		}

		// Fallback to prop when attributes are not supported
		if ( typeof elem.getAttribute === "undefined" ) {
			return jQuery.prop( elem, name, value );
		}

		// Attribute hooks are determined by the lowercase version
		// Grab necessary hook if one is defined
		if ( nType !== 1 || !jQuery.isXMLDoc( elem ) ) {
			hooks = jQuery.attrHooks[ name.toLowerCase() ] ||
				( jQuery.expr.match.bool.test( name ) ? boolHook : undefined );
		}

		if ( value !== undefined ) {
			if ( value === null ) {
				jQuery.removeAttr( elem, name );
				return;
			}

			if ( hooks && "set" in hooks &&
				( ret = hooks.set( elem, value, name ) ) !== undefined ) {
				return ret;
			}

			elem.setAttribute( name, value + "" );
			return value;
		}

		if ( hooks && "get" in hooks && ( ret = hooks.get( elem, name ) ) !== null ) {
			return ret;
		}

		ret = jQuery.find.attr( elem, name );

		// Non-existent attributes return null, we normalize to undefined
		return ret == null ? undefined : ret;
	},

	attrHooks: {
		type: {
			set: function( elem, value ) {
				if ( !support.radioValue && value === "radio" &&
					nodeName( elem, "input" ) ) {
					var val = elem.value;
					elem.setAttribute( "type", value );
					if ( val ) {
						elem.value = val;
					}
					return value;
				}
			}
		}
	},

	removeAttr: function( elem, value ) {
		var name,
			i = 0,

			// Attribute names can contain non-HTML whitespace characters
			// https://html.spec.whatwg.org/multipage/syntax.html#attributes-2
			attrNames = value && value.match( rnothtmlwhite );

		if ( attrNames && elem.nodeType === 1 ) {
			while ( ( name = attrNames[ i++ ] ) ) {
				elem.removeAttribute( name );
			}
		}
	}
} );

// Hooks for boolean attributes
boolHook = {
	set: function( elem, value, name ) {
		if ( value === false ) {

			// Remove boolean attributes when set to false
			jQuery.removeAttr( elem, name );
		} else {
			elem.setAttribute( name, name );
		}
		return name;
	}
};

jQuery.each( jQuery.expr.match.bool.source.match( /\w+/g ), function( _i, name ) {
	var getter = attrHandle[ name ] || jQuery.find.attr;

	attrHandle[ name ] = function( elem, name, isXML ) {
		var ret, handle,
			lowercaseName = name.toLowerCase();

		if ( !isXML ) {

			// Avoid an infinite loop by temporarily removing this function from the getter
			handle = attrHandle[ lowercaseName ];
			attrHandle[ lowercaseName ] = ret;
			ret = getter( elem, name, isXML ) != null ?
				lowercaseName :
				null;
			attrHandle[ lowercaseName ] = handle;
		}
		return ret;
	};
} );




var rfocusable = /^(?:input|select|textarea|button)$/i,
	rclickable = /^(?:a|area)$/i;

jQuery.fn.extend( {
	prop: function( name, value ) {
		return access( this, jQuery.prop, name, value, arguments.length > 1 );
	},

	removeProp: function( name ) {
		return this.each( function() {
			delete this[ jQuery.propFix[ name ] || name ];
		} );
	}
} );

jQuery.extend( {
	prop: function( elem, name, value ) {
		var ret, hooks,
			nType = elem.nodeType;

		// Don't get/set properties on text, comment and attribute nodes
		if ( nType === 3 || nType === 8 || nType === 2 ) {
			return;
		}

		if ( nType !== 1 || !jQuery.isXMLDoc( elem ) ) {

			// Fix name and attach hooks
			name = jQuery.propFix[ name ] || name;
			hooks = jQuery.propHooks[ name ];
		}

		if ( value !== undefined ) {
			if ( hooks && "set" in hooks &&
				( ret = hooks.set( elem, value, name ) ) !== undefined ) {
				return ret;
			}

			return ( elem[ name ] = value );
		}

		if ( hooks && "get" in hooks && ( ret = hooks.get( elem, name ) ) !== null ) {
			return ret;
		}

		return elem[ name ];
	},

	propHooks: {
		tabIndex: {
			get: function( elem ) {

				// Support: IE <=9 - 11 only
				// elem.tabIndex doesn't always return the
				// correct value when it hasn't been explicitly set
				// Use proper attribute retrieval (trac-12072)
				var tabindex = jQuery.find.attr( elem, "tabindex" );

				if ( tabindex ) {
					return parseInt( tabindex, 10 );
				}

				if (
					rfocusable.test( elem.nodeName ) ||
					rclickable.test( elem.nodeName ) &&
					elem.href
				) {
					return 0;
				}

				return -1;
			}
		}
	},

	propFix: {
		"for": "htmlFor",
		"class": "className"
	}
} );

// Support: IE <=11 only
// Accessing the selectedIndex property
// forces the browser to respect setting selected
// on the option
// The getter ensures a default option is selected
// when in an optgroup
// eslint rule "no-unused-expressions" is disabled for this code
// since it considers such accessions noop
if ( !support.optSelected ) {
	jQuery.propHooks.selected = {
		get: function( elem ) {

			/* eslint no-unused-expressions: "off" */

			var parent = elem.parentNode;
			if ( parent && parent.parentNode ) {
				parent.parentNode.selectedIndex;
			}
			return null;
		},
		set: function( elem ) {

			/* eslint no-unused-expressions: "off" */

			var parent = elem.parentNode;
			if ( parent ) {
				parent.selectedIndex;

				if ( parent.parentNode ) {
					parent.parentNode.selectedIndex;
				}
			}
		}
	};
}

jQuery.each( [
	"tabIndex",
	"readOnly",
	"maxLength",
	"cellSpacing",
	"cellPadding",
	"rowSpan",
	"colSpan",
	"useMap",
	"frameBorder",
	"contentEditable"
], function() {
	jQuery.propFix[ this.toLowerCase() ] = this;
} );




	// Strip and collapse whitespace according to HTML spec
	// https://infra.spec.whatwg.org/#strip-and-collapse-ascii-whitespace
	function stripAndCollapse( value ) {
		var tokens = value.match( rnothtmlwhite ) || [];
		return tokens.join( " " );
	}


function getClass( elem ) {
	return elem.getAttribute && elem.getAttribute( "class" ) || "";
}

function classesToArray( value ) {
	if ( Array.isArray( value ) ) {
		return value;
	}
	if ( typeof value === "string" ) {
		return value.match( rnothtmlwhite ) || [];
	}
	return [];
}

jQuery.fn.extend( {
	addClass: function( value ) {
		var classNames, cur, curValue, className, i, finalValue;

		if ( isFunction( value ) ) {
			return this.each( function( j ) {
				jQuery( this ).addClass( value.call( this, j, getClass( this ) ) );
			} );
		}

		classNames = classesToArray( value );

		if ( classNames.length ) {
			return this.each( function() {
				curValue = getClass( this );
				cur = this.nodeType === 1 && ( " " + stripAndCollapse( curValue ) + " " );

				if ( cur ) {
					for ( i = 0; i < classNames.length; i++ ) {
						className = classNames[ i ];
						if ( cur.indexOf( " " + className + " " ) < 0 ) {
							cur += className + " ";
						}
					}

					// Only assign if different to avoid unneeded rendering.
					finalValue = stripAndCollapse( cur );
					if ( curValue !== finalValue ) {
						this.setAttribute( "class", finalValue );
					}
				}
			} );
		}

		return this;
	},

	removeClass: function( value ) {
		var classNames, cur, curValue, className, i, finalValue;

		if ( isFunction( value ) ) {
			return this.each( function( j ) {
				jQuery( this ).removeClass( value.call( this, j, getClass( this ) ) );
			} );
		}

		if ( !arguments.length ) {
			return this.attr( "class", "" );
		}

		classNames = classesToArray( value );

		if ( classNames.length ) {
			return this.each( function() {
				curValue = getClass( this );

				// This expression is here for better compressibility (see addClass)
				cur = this.nodeType === 1 && ( " " + stripAndCollapse( curValue ) + " " );

				if ( cur ) {
					for ( i = 0; i < classNames.length; i++ ) {
						className = classNames[ i ];

						// Remove *all* instances
						while ( cur.indexOf( " " + className + " " ) > -1 ) {
							cur = cur.replace( " " + className + " ", " " );
						}
					}

					// Only assign if different to avoid unneeded rendering.
					finalValue = stripAndCollapse( cur );
					if ( curValue !== finalValue ) {
						this.setAttribute( "class", finalValue );
					}
				}
			} );
		}

		return this;
	},

	toggleClass: function( value, stateVal ) {
		var classNames, className, i, self,
			type = typeof value,
			isValidValue = type === "string" || Array.isArray( value );

		if ( isFunction( value ) ) {
			return this.each( function( i ) {
				jQuery( this ).toggleClass(
					value.call( this, i, getClass( this ), stateVal ),
					stateVal
				);
			} );
		}

		if ( typeof stateVal === "boolean" && isValidValue ) {
			return stateVal ? this.addClass( value ) : this.removeClass( value );
		}

		classNames = classesToArray( value );

		return this.each( function() {
			if ( isValidValue ) {

				// Toggle individual class names
				self = jQuery( this );

				for ( i = 0; i < classNames.length; i++ ) {
					className = classNames[ i ];

					// Check each className given, space separated list
					if ( self.hasClass( className ) ) {
						self.removeClass( className );
					} else {
						self.addClass( className );
					}
				}

			// Toggle whole class name
			} else if ( value === undefined || type === "boolean" ) {
				className = getClass( this );
				if ( className ) {

					// Store className if set
					dataPriv.set( this, "__className__", className );
				}

				// If the element has a class name or if we're passed `false`,
				// then remove the whole classname (if there was one, the above saved it).
				// Otherwise bring back whatever was previously saved (if anything),
				// falling back to the empty string if nothing was stored.
				if ( this.setAttribute ) {
					this.setAttribute( "class",
						className || value === false ?
							"" :
							dataPriv.get( this, "__className__" ) || ""
					);
				}
			}
		} );
	},

	hasClass: function( selector ) {
		var className, elem,
			i = 0;

		className = " " + selector + " ";
		while ( ( elem = this[ i++ ] ) ) {
			if ( elem.nodeType === 1 &&
				( " " + stripAndCollapse( getClass( elem ) ) + " " ).indexOf( className ) > -1 ) {
				return true;
			}
		}

		return false;
	}
} );




var rreturn = /\r/g;

jQuery.fn.extend( {
	val: function( value ) {
		var hooks, ret, valueIsFunction,
			elem = this[ 0 ];

		if ( !arguments.length ) {
			if ( elem ) {
				hooks = jQuery.valHooks[ elem.type ] ||
					jQuery.valHooks[ elem.nodeName.toLowerCase() ];

				if ( hooks &&
					"get" in hooks &&
					( ret = hooks.get( elem, "value" ) ) !== undefined
				) {
					return ret;
				}

				ret = elem.value;

				// Handle most common string cases
				if ( typeof ret === "string" ) {
					return ret.replace( rreturn, "" );
				}

				// Handle cases where value is null/undef or number
				return ret == null ? "" : ret;
			}

			return;
		}

		valueIsFunction = isFunction( value );

		return this.each( function( i ) {
			var val;

			if ( this.nodeType !== 1 ) {
				return;
			}

			if ( valueIsFunction ) {
				val = value.call( this, i, jQuery( this ).val() );
			} else {
				val = value;
			}

			// Treat null/undefined as ""; convert numbers to string
			if ( val == null ) {
				val = "";

			} else if ( typeof val === "number" ) {
				val += "";

			} else if ( Array.isArray( val ) ) {
				val = jQuery.map( val, function( value ) {
					return value == null ? "" : value + "";
				} );
			}

			hooks = jQuery.valHooks[ this.type ] || jQuery.valHooks[ this.nodeName.toLowerCase() ];

			// If set returns undefined, fall back to normal setting
			if ( !hooks || !( "set" in hooks ) || hooks.set( this, val, "value" ) === undefined ) {
				this.value = val;
			}
		} );
	}
} );

jQuery.extend( {
	valHooks: {
		option: {
			get: function( elem ) {

				var val = jQuery.find.attr( elem, "value" );
				return val != null ?
					val :

					// Support: IE <=10 - 11 only
					// option.text throws exceptions (trac-14686, trac-14858)
					// Strip and collapse whitespace
					// https://html.spec.whatwg.org/#strip-and-collapse-whitespace
					stripAndCollapse( jQuery.text( elem ) );
			}
		},
		select: {
			get: function( elem ) {
				var value, option, i,
					options = elem.options,
					index = elem.selectedIndex,
					one = elem.type === "select-one",
					values = one ? null : [],
					max = one ? index + 1 : options.length;

				if ( index < 0 ) {
					i = max;

				} else {
					i = one ? index : 0;
				}

				// Loop through all the selected options
				for ( ; i < max; i++ ) {
					option = options[ i ];

					// Support: IE <=9 only
					// IE8-9 doesn't update selected after form reset (trac-2551)
					if ( ( option.selected || i === index ) &&

							// Don't return options that are disabled or in a disabled optgroup
							!option.disabled &&
							( !option.parentNode.disabled ||
								!nodeName( option.parentNode, "optgroup" ) ) ) {

						// Get the specific value for the option
						value = jQuery( option ).val();

						// We don't need an array for one selects
						if ( one ) {
							return value;
						}

						// Multi-Selects return an array
						values.push( value );
					}
				}

				return values;
			},

			set: function( elem, value ) {
				var optionSet, option,
					options = elem.options,
					values = jQuery.makeArray( value ),
					i = options.length;

				while ( i-- ) {
					option = options[ i ];

					/* eslint-disable no-cond-assign */

					if ( option.selected =
						jQuery.inArray( jQuery.valHooks.option.get( option ), values ) > -1
					) {
						optionSet = true;
					}

					/* eslint-enable no-cond-assign */
				}

				// Force browsers to behave consistently when non-matching value is set
				if ( !optionSet ) {
					elem.selectedIndex = -1;
				}
				return values;
			}
		}
	}
} );

// Radios and checkboxes getter/setter
jQuery.each( [ "radio", "checkbox" ], function() {
	jQuery.valHooks[ this ] = {
		set: function( elem, value ) {
			if ( Array.isArray( value ) ) {
				return ( elem.checked = jQuery.inArray( jQuery( elem ).val(), value ) > -1 );
			}
		}
	};
	if ( !support.checkOn ) {
		jQuery.valHooks[ this ].get = function( elem ) {
			return elem.getAttribute( "value" ) === null ? "on" : elem.value;
		};
	}
} );




// Return jQuery for attributes-only inclusion
var location = window.location;

var nonce = { guid: Date.now() };

var rquery = ( /\?/ );



// Cross-browser xml parsing
jQuery.parseXML = function( data ) {
	var xml, parserErrorElem;
	if ( !data || typeof data !== "string" ) {
		return null;
	}

	// Support: IE 9 - 11 only
	// IE throws on parseFromString with invalid input.
	try {
		xml = ( new window.DOMParser() ).parseFromString( data, "text/xml" );
	} catch ( e ) {}

	parserErrorElem = xml && xml.getElementsByTagName( "parsererror" )[ 0 ];
	if ( !xml || parserErrorElem ) {
		jQuery.error( "Invalid XML: " + (
			parserErrorElem ?
				jQuery.map( parserErrorElem.childNodes, function( el ) {
					return el.textContent;
				} ).join( "\n" ) :
				data
		) );
	}
	return xml;
};


var rfocusMorph = /^(?:focusinfocus|focusoutblur)$/,
	stopPropagationCallback = function( e ) {
		e.stopPropagation();
	};

jQuery.extend( jQuery.event, {

	trigger: function( event, data, elem, onlyHandlers ) {

		var i, cur, tmp, bubbleType, ontype, handle, special, lastElement,
			eventPath = [ elem || document ],
			type = hasOwn.call( event, "type" ) ? event.type : event,
			namespaces = hasOwn.call( event, "namespace" ) ? event.namespace.split( "." ) : [];

		cur = lastElement = tmp = elem = elem || document;

		// Don't do events on text and comment nodes
		if ( elem.nodeType === 3 || elem.nodeType === 8 ) {
			return;
		}

		// focus/blur morphs to focusin/out; ensure we're not firing them right now
		if ( rfocusMorph.test( type + jQuery.event.triggered ) ) {
			return;
		}

		if ( type.indexOf( "." ) > -1 ) {

			// Namespaced trigger; create a regexp to match event type in handle()
			namespaces = type.split( "." );
			type = namespaces.shift();
			namespaces.sort();
		}
		ontype = type.indexOf( ":" ) < 0 && "on" + type;

		// Caller can pass in a jQuery.Event object, Object, or just an event type string
		event = event[ jQuery.expando ] ?
			event :
			new jQuery.Event( type, typeof event === "object" && event );

		// Trigger bitmask: & 1 for native handlers; & 2 for jQuery (always true)
		event.isTrigger = onlyHandlers ? 2 : 3;
		event.namespace = namespaces.join( "." );
		event.rnamespace = event.namespace ?
			new RegExp( "(^|\\.)" + namespaces.join( "\\.(?:.*\\.|)" ) + "(\\.|$)" ) :
			null;

		// Clean up the event in case it is being reused
		event.result = undefined;
		if ( !event.target ) {
			event.target = elem;
		}

		// Clone any incoming data and prepend the event, creating the handler arg list
		data = data == null ?
			[ event ] :
			jQuery.makeArray( data, [ event ] );

		// Allow special events to draw outside the lines
		special = jQuery.event.special[ type ] || {};
		if ( !onlyHandlers && special.trigger && special.trigger.apply( elem, data ) === false ) {
			return;
		}

		// Determine event propagation path in advance, per W3C events spec (trac-9951)
		// Bubble up to document, then to window; watch for a global ownerDocument var (trac-9724)
		if ( !onlyHandlers && !special.noBubble && !isWindow( elem ) ) {

			bubbleType = special.delegateType || type;
			if ( !rfocusMorph.test( bubbleType + type ) ) {
				cur = cur.parentNode;
			}
			for ( ; cur; cur = cur.parentNode ) {
				eventPath.push( cur );
				tmp = cur;
			}

			// Only add window if we got to document (e.g., not plain obj or detached DOM)
			if ( tmp === ( elem.ownerDocument || document ) ) {
				eventPath.push( tmp.defaultView || tmp.parentWindow || window );
			}
		}

		// Fire handlers on the event path
		i = 0;
		while ( ( cur = eventPath[ i++ ] ) && !event.isPropagationStopped() ) {
			lastElement = cur;
			event.type = i > 1 ?
				bubbleType :
				special.bindType || type;

			// jQuery handler
			handle = ( dataPriv.get( cur, "events" ) || Object.create( null ) )[ event.type ] &&
				dataPriv.get( cur, "handle" );
			if ( handle ) {
				handle.apply( cur, data );
			}

			// Native handler
			handle = ontype && cur[ ontype ];
			if ( handle && handle.apply && acceptData( cur ) ) {
				event.result = handle.apply( cur, data );
				if ( event.result === false ) {
					event.preventDefault();
				}
			}
		}
		event.type = type;

		// If nobody prevented the default action, do it now
		if ( !onlyHandlers && !event.isDefaultPrevented() ) {

			if ( ( !special._default ||
				special._default.apply( eventPath.pop(), data ) === false ) &&
				acceptData( elem ) ) {

				// Call a native DOM method on the target with the same name as the event.
				// Don't do default actions on window, that's where global variables be (trac-6170)
				if ( ontype && isFunction( elem[ type ] ) && !isWindow( elem ) ) {

					// Don't re-trigger an onFOO event when we call its FOO() method
					tmp = elem[ ontype ];

					if ( tmp ) {
						elem[ ontype ] = null;
					}

					// Prevent re-triggering of the same event, since we already bubbled it above
					jQuery.event.triggered = type;

					if ( event.isPropagationStopped() ) {
						lastElement.addEventListener( type, stopPropagationCallback );
					}

					elem[ type ]();

					if ( event.isPropagationStopped() ) {
						lastElement.removeEventListener( type, stopPropagationCallback );
					}

					jQuery.event.triggered = undefined;

					if ( tmp ) {
						elem[ ontype ] = tmp;
					}
				}
			}
		}

		return event.result;
	},

	// Piggyback on a donor event to simulate a different one
	// Used only for `focus(in | out)` events
	simulate: function( type, elem, event ) {
		var e = jQuery.extend(
			new jQuery.Event(),
			event,
			{
				type: type,
				isSimulated: true
			}
		);

		jQuery.event.trigger( e, null, elem );
	}

} );

jQuery.fn.extend( {

	trigger: function( type, data ) {
		return this.each( function() {
			jQuery.event.trigger( type, data, this );
		} );
	},
	triggerHandler: function( type, data ) {
		var elem = this[ 0 ];
		if ( elem ) {
			return jQuery.event.trigger( type, data, elem, true );
		}
	}
} );


var
	rbracket = /\[\]$/,
	rCRLF = /\r?\n/g,
	rsubmitterTypes = /^(?:submit|button|image|reset|file)$/i,
	rsubmittable = /^(?:input|select|textarea|keygen)/i;

function buildParams( prefix, obj, traditional, add ) {
	var name;

	if ( Array.isArray( obj ) ) {

		// Serialize array item.
		jQuery.each( obj, function( i, v ) {
			if ( traditional || rbracket.test( prefix ) ) {

				// Treat each array item as a scalar.
				add( prefix, v );

			} else {

				// Item is non-scalar (array or object), encode its numeric index.
				buildParams(
					prefix + "[" + ( typeof v === "object" && v != null ? i : "" ) + "]",
					v,
					traditional,
					add
				);
			}
		} );

	} else if ( !traditional && toType( obj ) === "object" ) {

		// Serialize object item.
		for ( name in obj ) {
			buildParams( prefix + "[" + name + "]", obj[ name ], traditional, add );
		}

	} else {

		// Serialize scalar item.
		add( prefix, obj );
	}
}

// Serialize an array of form elements or a set of
// key/values into a query string
jQuery.param = function( a, traditional ) {
	var prefix,
		s = [],
		add = function( key, valueOrFunction ) {

			// If value is a function, invoke it and use its return value
			var value = isFunction( valueOrFunction ) ?
				valueOrFunction() :
				valueOrFunction;

			s[ s.length ] = encodeURIComponent( key ) + "=" +
				encodeURIComponent( value == null ? "" : value );
		};

	if ( a == null ) {
		return "";
	}

	// If an array was passed in, assume that it is an array of form elements.
	if ( Array.isArray( a ) || ( a.jquery && !jQuery.isPlainObject( a ) ) ) {

		// Serialize the form elements
		jQuery.each( a, function() {
			add( this.name, this.value );
		} );

	} else {

		// If traditional, encode the "old" way (the way 1.3.2 or older
		// did it), otherwise encode params recursively.
		for ( prefix in a ) {
			buildParams( prefix, a[ prefix ], traditional, add );
		}
	}

	// Return the resulting serialization
	return s.join( "&" );
};

jQuery.fn.extend( {
	serialize: function() {
		return jQuery.param( this.serializeArray() );
	},
	serializeArray: function() {
		return this.map( function() {

			// Can add propHook for "elements" to filter or add form elements
			var elements = jQuery.prop( this, "elements" );
			return elements ? jQuery.makeArray( elements ) : this;
		} ).filter( function() {
			var type = this.type;

			// Use .is( ":disabled" ) so that fieldset[disabled] works
			return this.name && !jQuery( this ).is( ":disabled" ) &&
				rsubmittable.test( this.nodeName ) && !rsubmitterTypes.test( type ) &&
				( this.checked || !rcheckableType.test( type ) );
		} ).map( function( _i, elem ) {
			var val = jQuery( this ).val();

			if ( val == null ) {
				return null;
			}

			if ( Array.isArray( val ) ) {
				return jQuery.map( val, function( val ) {
					return { name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
				} );
			}

			return { name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
		} ).get();
	}
} );


var
	r20 = /%20/g,
	rhash = /#.*$/,
	rantiCache = /([?&])_=[^&]*/,
	rheaders = /^(.*?):[ \t]*([^\r\n]*)$/mg,

	// trac-7653, trac-8125, trac-8152: local protocol detection
	rlocalProtocol = /^(?:about|app|app-storage|.+-extension|file|res|widget):$/,
	rnoContent = /^(?:GET|HEAD)$/,
	rprotocol = /^\/\//,

	/* Prefilters
	 * 1) They are useful to introduce custom dataTypes (see ajax/jsonp.js for an example)
	 * 2) These are called:
	 *    - BEFORE asking for a transport
	 *    - AFTER param serialization (s.data is a string if s.processData is true)
	 * 3) key is the dataType
	 * 4) the catchall symbol "*" can be used
	 * 5) execution will start with transport dataType and THEN continue down to "*" if needed
	 */
	prefilters = {},

	/* Transports bindings
	 * 1) key is the dataType
	 * 2) the catchall symbol "*" can be used
	 * 3) selection will start with transport dataType and THEN go to "*" if needed
	 */
	transports = {},

	// Avoid comment-prolog char sequence (trac-10098); must appease lint and evade compression
	allTypes = "*/".concat( "*" ),

	// Anchor tag for parsing the document origin
	originAnchor = document.createElement( "a" );

originAnchor.href = location.href;

// Base "constructor" for jQuery.ajaxPrefilter and jQuery.ajaxTransport
function addToPrefiltersOrTransports( structure ) {

	// dataTypeExpression is optional and defaults to "*"
	return function( dataTypeExpression, func ) {

		if ( typeof dataTypeExpression !== "string" ) {
			func = dataTypeExpression;
			dataTypeExpression = "*";
		}

		var dataType,
			i = 0,
			dataTypes = dataTypeExpression.toLowerCase().match( rnothtmlwhite ) || [];

		if ( isFunction( func ) ) {

			// For each dataType in the dataTypeExpression
			while ( ( dataType = dataTypes[ i++ ] ) ) {

				// Prepend if requested
				if ( dataType[ 0 ] === "+" ) {
					dataType = dataType.slice( 1 ) || "*";
					( structure[ dataType ] = structure[ dataType ] || [] ).unshift( func );

				// Otherwise append
				} else {
					( structure[ dataType ] = structure[ dataType ] || [] ).push( func );
				}
			}
		}
	};
}

// Base inspection function for prefilters and transports
function inspectPrefiltersOrTransports( structure, options, originalOptions, jqXHR ) {

	var inspected = {},
		seekingTransport = ( structure === transports );

	function inspect( dataType ) {
		var selected;
		inspected[ dataType ] = true;
		jQuery.each( structure[ dataType ] || [], function( _, prefilterOrFactory ) {
			var dataTypeOrTransport = prefilterOrFactory( options, originalOptions, jqXHR );
			if ( typeof dataTypeOrTransport === "string" &&
				!seekingTransport && !inspected[ dataTypeOrTransport ] ) {

				options.dataTypes.unshift( dataTypeOrTransport );
				inspect( dataTypeOrTransport );
				return false;
			} else if ( seekingTransport ) {
				return !( selected = dataTypeOrTransport );
			}
		} );
		return selected;
	}

	return inspect( options.dataTypes[ 0 ] ) || !inspected[ "*" ] && inspect( "*" );
}

// A special extend for ajax options
// that takes "flat" options (not to be deep extended)
// Fixes trac-9887
function ajaxExtend( target, src ) {
	var key, deep,
		flatOptions = jQuery.ajaxSettings.flatOptions || {};

	for ( key in src ) {
		if ( src[ key ] !== undefined ) {
			( flatOptions[ key ] ? target : ( deep || ( deep = {} ) ) )[ key ] = src[ key ];
		}
	}
	if ( deep ) {
		jQuery.extend( true, target, deep );
	}

	return target;
}

/* Handles responses to an ajax request:
 * - finds the right dataType (mediates between content-type and expected dataType)
 * - returns the corresponding response
 */
function ajaxHandleResponses( s, jqXHR, responses ) {

	var ct, type, finalDataType, firstDataType,
		contents = s.contents,
		dataTypes = s.dataTypes;

	// Remove auto dataType and get content-type in the process
	while ( dataTypes[ 0 ] === "*" ) {
		dataTypes.shift();
		if ( ct === undefined ) {
			ct = s.mimeType || jqXHR.getResponseHeader( "Content-Type" );
		}
	}

	// Check if we're dealing with a known content-type
	if ( ct ) {
		for ( type in contents ) {
			if ( contents[ type ] && contents[ type ].test( ct ) ) {
				dataTypes.unshift( type );
				break;
			}
		}
	}

	// Check to see if we have a response for the expected dataType
	if ( dataTypes[ 0 ] in responses ) {
		finalDataType = dataTypes[ 0 ];
	} else {

		// Try convertible dataTypes
		for ( type in responses ) {
			if ( !dataTypes[ 0 ] || s.converters[ type + " " + dataTypes[ 0 ] ] ) {
				finalDataType = type;
				break;
			}
			if ( !firstDataType ) {
				firstDataType = type;
			}
		}

		// Or just use first one
		finalDataType = finalDataType || firstDataType;
	}

	// If we found a dataType
	// We add the dataType to the list if needed
	// and return the corresponding response
	if ( finalDataType ) {
		if ( finalDataType !== dataTypes[ 0 ] ) {
			dataTypes.unshift( finalDataType );
		}
		return responses[ finalDataType ];
	}
}

/* Chain conversions given the request and the original response
 * Also sets the responseXXX fields on the jqXHR instance
 */
function ajaxConvert( s, response, jqXHR, isSuccess ) {
	var conv2, current, conv, tmp, prev,
		converters = {},

		// Work with a copy of dataTypes in case we need to modify it for conversion
		dataTypes = s.dataTypes.slice();

	// Create converters map with lowercased keys
	if ( dataTypes[ 1 ] ) {
		for ( conv in s.converters ) {
			converters[ conv.toLowerCase() ] = s.converters[ conv ];
		}
	}

	current = dataTypes.shift();

	// Convert to each sequential dataType
	while ( current ) {

		if ( s.responseFields[ current ] ) {
			jqXHR[ s.responseFields[ current ] ] = response;
		}

		// Apply the dataFilter if provided
		if ( !prev && isSuccess && s.dataFilter ) {
			response = s.dataFilter( response, s.dataType );
		}

		prev = current;
		current = dataTypes.shift();

		if ( current ) {

			// There's only work to do if current dataType is non-auto
			if ( current === "*" ) {

				current = prev;

			// Convert response if prev dataType is non-auto and differs from current
			} else if ( prev !== "*" && prev !== current ) {

				// Seek a direct converter
				conv = converters[ prev + " " + current ] || converters[ "* " + current ];

				// If none found, seek a pair
				if ( !conv ) {
					for ( conv2 in converters ) {

						// If conv2 outputs current
						tmp = conv2.split( " " );
						if ( tmp[ 1 ] === current ) {

							// If prev can be converted to accepted input
							conv = converters[ prev + " " + tmp[ 0 ] ] ||
								converters[ "* " + tmp[ 0 ] ];
							if ( conv ) {

								// Condense equivalence converters
								if ( conv === true ) {
									conv = converters[ conv2 ];

								// Otherwise, insert the intermediate dataType
								} else if ( converters[ conv2 ] !== true ) {
									current = tmp[ 0 ];
									dataTypes.unshift( tmp[ 1 ] );
								}
								break;
							}
						}
					}
				}

				// Apply converter (if not an equivalence)
				if ( conv !== true ) {

					// Unless errors are allowed to bubble, catch and return them
					if ( conv && s.throws ) {
						response = conv( response );
					} else {
						try {
							response = conv( response );
						} catch ( e ) {
							return {
								state: "parsererror",
								error: conv ? e : "No conversion from " + prev + " to " + current
							};
						}
					}
				}
			}
		}
	}

	return { state: "success", data: response };
}

jQuery.extend( {

	// Counter for holding the number of active queries
	active: 0,

	// Last-Modified header cache for next request
	lastModified: {},
	etag: {},

	ajaxSettings: {
		url: location.href,
		type: "GET",
		isLocal: rlocalProtocol.test( location.protocol ),
		global: true,
		processData: true,
		async: true,
		contentType: "application/x-www-form-urlencoded; charset=UTF-8",

		/*
		timeout: 0,
		data: null,
		dataType: null,
		username: null,
		password: null,
		cache: null,
		throws: false,
		traditional: false,
		headers: {},
		*/

		accepts: {
			"*": allTypes,
			text: "text/plain",
			html: "text/html",
			xml: "application/xml, text/xml",
			json: "application/json, text/javascript"
		},

		contents: {
			xml: /\bxml\b/,
			html: /\bhtml/,
			json: /\bjson\b/
		},

		responseFields: {
			xml: "responseXML",
			text: "responseText",
			json: "responseJSON"
		},

		// Data converters
		// Keys separate source (or catchall "*") and destination types with a single space
		converters: {

			// Convert anything to text
			"* text": String,

			// Text to html (true = no transformation)
			"text html": true,

			// Evaluate text as a json expression
			"text json": JSON.parse,

			// Parse text as xml
			"text xml": jQuery.parseXML
		},

		// For options that shouldn't be deep extended:
		// you can add your own custom options here if
		// and when you create one that shouldn't be
		// deep extended (see ajaxExtend)
		flatOptions: {
			url: true,
			context: true
		}
	},

	// Creates a full fledged settings object into target
	// with both ajaxSettings and settings fields.
	// If target is omitted, writes into ajaxSettings.
	ajaxSetup: function( target, settings ) {
		return settings ?

			// Building a settings object
			ajaxExtend( ajaxExtend( target, jQuery.ajaxSettings ), settings ) :

			// Extending ajaxSettings
			ajaxExtend( jQuery.ajaxSettings, target );
	},

	ajaxPrefilter: addToPrefiltersOrTransports( prefilters ),
	ajaxTransport: addToPrefiltersOrTransports( transports ),

	// Main method
	ajax: function( url, options ) {

		// If url is an object, simulate pre-1.5 signature
		if ( typeof url === "object" ) {
			options = url;
			url = undefined;
		}

		// Force options to be an object
		options = options || {};

		var transport,

			// URL without anti-cache param
			cacheURL,

			// Response headers
			responseHeadersString,
			responseHeaders,

			// timeout handle
			timeoutTimer,

			// Url cleanup var
			urlAnchor,

			// Request state (becomes false upon send and true upon completion)
			completed,

			// To know if global events are to be dispatched
			fireGlobals,

			// Loop variable
			i,

			// uncached part of the url
			uncached,

			// Create the final options object
			s = jQuery.ajaxSetup( {}, options ),

			// Callbacks context
			callbackContext = s.context || s,

			// Context for global events is callbackContext if it is a DOM node or jQuery collection
			globalEventContext = s.context &&
				( callbackContext.nodeType || callbackContext.jquery ) ?
				jQuery( callbackContext ) :
				jQuery.event,

			// Deferreds
			deferred = jQuery.Deferred(),
			completeDeferred = jQuery.Callbacks( "once memory" ),

			// Status-dependent callbacks
			statusCode = s.statusCode || {},

			// Headers (they are sent all at once)
			requestHeaders = {},
			requestHeadersNames = {},

			// Default abort message
			strAbort = "canceled",

			// Fake xhr
			jqXHR = {
				readyState: 0,

				// Builds headers hashtable if needed
				getResponseHeader: function( key ) {
					var match;
					if ( completed ) {
						if ( !responseHeaders ) {
							responseHeaders = {};
							while ( ( match = rheaders.exec( responseHeadersString ) ) ) {
								responseHeaders[ match[ 1 ].toLowerCase() + " " ] =
									( responseHeaders[ match[ 1 ].toLowerCase() + " " ] || [] )
										.concat( match[ 2 ] );
							}
						}
						match = responseHeaders[ key.toLowerCase() + " " ];
					}
					return match == null ? null : match.join( ", " );
				},

				// Raw string
				getAllResponseHeaders: function() {
					return completed ? responseHeadersString : null;
				},

				// Caches the header
				setRequestHeader: function( name, value ) {
					if ( completed == null ) {
						name = requestHeadersNames[ name.toLowerCase() ] =
							requestHeadersNames[ name.toLowerCase() ] || name;
						requestHeaders[ name ] = value;
					}
					return this;
				},

				// Overrides response content-type header
				overrideMimeType: function( type ) {
					if ( completed == null ) {
						s.mimeType = type;
					}
					return this;
				},

				// Status-dependent callbacks
				statusCode: function( map ) {
					var code;
					if ( map ) {
						if ( completed ) {

							// Execute the appropriate callbacks
							jqXHR.always( map[ jqXHR.status ] );
						} else {

							// Lazy-add the new callbacks in a way that preserves old ones
							for ( code in map ) {
								statusCode[ code ] = [ statusCode[ code ], map[ code ] ];
							}
						}
					}
					return this;
				},

				// Cancel the request
				abort: function( statusText ) {
					var finalText = statusText || strAbort;
					if ( transport ) {
						transport.abort( finalText );
					}
					done( 0, finalText );
					return this;
				}
			};

		// Attach deferreds
		deferred.promise( jqXHR );

		// Add protocol if not provided (prefilters might expect it)
		// Handle falsy url in the settings object (trac-10093: consistency with old signature)
		// We also use the url parameter if available
		s.url = ( ( url || s.url || location.href ) + "" )
			.replace( rprotocol, location.protocol + "//" );

		// Alias method option to type as per ticket trac-12004
		s.type = options.method || options.type || s.method || s.type;

		// Extract dataTypes list
		s.dataTypes = ( s.dataType || "*" ).toLowerCase().match( rnothtmlwhite ) || [ "" ];

		// A cross-domain request is in order when the origin doesn't match the current origin.
		if ( s.crossDomain == null ) {
			urlAnchor = document.createElement( "a" );

			// Support: IE <=8 - 11, Edge 12 - 15
			// IE throws exception on accessing the href property if url is malformed,
			// e.g. http://example.com:80x/
			try {
				urlAnchor.href = s.url;

				// Support: IE <=8 - 11 only
				// Anchor's host property isn't correctly set when s.url is relative
				urlAnchor.href = urlAnchor.href;
				s.crossDomain = originAnchor.protocol + "//" + originAnchor.host !==
					urlAnchor.protocol + "//" + urlAnchor.host;
			} catch ( e ) {

				// If there is an error parsing the URL, assume it is crossDomain,
				// it can be rejected by the transport if it is invalid
				s.crossDomain = true;
			}
		}

		// Convert data if not already a string
		if ( s.data && s.processData && typeof s.data !== "string" ) {
			s.data = jQuery.param( s.data, s.traditional );
		}

		// Apply prefilters
		inspectPrefiltersOrTransports( prefilters, s, options, jqXHR );

		// If request was aborted inside a prefilter, stop there
		if ( completed ) {
			return jqXHR;
		}

		// We can fire global events as of now if asked to
		// Don't fire events if jQuery.event is undefined in an AMD-usage scenario (trac-15118)
		fireGlobals = jQuery.event && s.global;

		// Watch for a new set of requests
		if ( fireGlobals && jQuery.active++ === 0 ) {
			jQuery.event.trigger( "ajaxStart" );
		}

		// Uppercase the type
		s.type = s.type.toUpperCase();

		// Determine if request has content
		s.hasContent = !rnoContent.test( s.type );

		// Save the URL in case we're toying with the If-Modified-Since
		// and/or If-None-Match header later on
		// Remove hash to simplify url manipulation
		cacheURL = s.url.replace( rhash, "" );

		// More options handling for requests with no content
		if ( !s.hasContent ) {

			// Remember the hash so we can put it back
			uncached = s.url.slice( cacheURL.length );

			// If data is available and should be processed, append data to url
			if ( s.data && ( s.processData || typeof s.data === "string" ) ) {
				cacheURL += ( rquery.test( cacheURL ) ? "&" : "?" ) + s.data;

				// trac-9682: remove data so that it's not used in an eventual retry
				delete s.data;
			}

			// Add or update anti-cache param if needed
			if ( s.cache === false ) {
				cacheURL = cacheURL.replace( rantiCache, "$1" );
				uncached = ( rquery.test( cacheURL ) ? "&" : "?" ) + "_=" + ( nonce.guid++ ) +
					uncached;
			}

			// Put hash and anti-cache on the URL that will be requested (gh-1732)
			s.url = cacheURL + uncached;

		// Change '%20' to '+' if this is encoded form body content (gh-2658)
		} else if ( s.data && s.processData &&
			( s.contentType || "" ).indexOf( "application/x-www-form-urlencoded" ) === 0 ) {
			s.data = s.data.replace( r20, "+" );
		}

		// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
		if ( s.ifModified ) {
			if ( jQuery.lastModified[ cacheURL ] ) {
				jqXHR.setRequestHeader( "If-Modified-Since", jQuery.lastModified[ cacheURL ] );
			}
			if ( jQuery.etag[ cacheURL ] ) {
				jqXHR.setRequestHeader( "If-None-Match", jQuery.etag[ cacheURL ] );
			}
		}

		// Set the correct header, if data is being sent
		if ( s.data && s.hasContent && s.contentType !== false || options.contentType ) {
			jqXHR.setRequestHeader( "Content-Type", s.contentType );
		}

		// Set the Accepts header for the server, depending on the dataType
		jqXHR.setRequestHeader(
			"Accept",
			s.dataTypes[ 0 ] && s.accepts[ s.dataTypes[ 0 ] ] ?
				s.accepts[ s.dataTypes[ 0 ] ] +
					( s.dataTypes[ 0 ] !== "*" ? ", " + allTypes + "; q=0.01" : "" ) :
				s.accepts[ "*" ]
		);

		// Check for headers option
		for ( i in s.headers ) {
			jqXHR.setRequestHeader( i, s.headers[ i ] );
		}

		// Allow custom headers/mimetypes and early abort
		if ( s.beforeSend &&
			( s.beforeSend.call( callbackContext, jqXHR, s ) === false || completed ) ) {

			// Abort if not done already and return
			return jqXHR.abort();
		}

		// Aborting is no longer a cancellation
		strAbort = "abort";

		// Install callbacks on deferreds
		completeDeferred.add( s.complete );
		jqXHR.done( s.success );
		jqXHR.fail( s.error );

		// Get transport
		transport = inspectPrefiltersOrTransports( transports, s, options, jqXHR );

		// If no transport, we auto-abort
		if ( !transport ) {
			done( -1, "No Transport" );
		} else {
			jqXHR.readyState = 1;

			// Send global event
			if ( fireGlobals ) {
				globalEventContext.trigger( "ajaxSend", [ jqXHR, s ] );
			}

			// If request was aborted inside ajaxSend, stop there
			if ( completed ) {
				return jqXHR;
			}

			// Timeout
			if ( s.async && s.timeout > 0 ) {
				timeoutTimer = window.setTimeout( function() {
					jqXHR.abort( "timeout" );
				}, s.timeout );
			}

			try {
				completed = false;
				transport.send( requestHeaders, done );
			} catch ( e ) {

				// Rethrow post-completion exceptions
				if ( completed ) {
					throw e;
				}

				// Propagate others as results
				done( -1, e );
			}
		}

		// Callback for when everything is done
		function done( status, nativeStatusText, responses, headers ) {
			var isSuccess, success, error, response, modified,
				statusText = nativeStatusText;

			// Ignore repeat invocations
			if ( completed ) {
				return;
			}

			completed = true;

			// Clear timeout if it exists
			if ( timeoutTimer ) {
				window.clearTimeout( timeoutTimer );
			}

			// Dereference transport for early garbage collection
			// (no matter how long the jqXHR object will be used)
			transport = undefined;

			// Cache response headers
			responseHeadersString = headers || "";

			// Set readyState
			jqXHR.readyState = status > 0 ? 4 : 0;

			// Determine if successful
			isSuccess = status >= 200 && status < 300 || status === 304;

			// Get response data
			if ( responses ) {
				response = ajaxHandleResponses( s, jqXHR, responses );
			}

			// Use a noop converter for missing script but not if jsonp
			if ( !isSuccess &&
				jQuery.inArray( "script", s.dataTypes ) > -1 &&
				jQuery.inArray( "json", s.dataTypes ) < 0 ) {
				s.converters[ "text script" ] = function() {};
			}

			// Convert no matter what (that way responseXXX fields are always set)
			response = ajaxConvert( s, response, jqXHR, isSuccess );

			// If successful, handle type chaining
			if ( isSuccess ) {

				// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
				if ( s.ifModified ) {
					modified = jqXHR.getResponseHeader( "Last-Modified" );
					if ( modified ) {
						jQuery.lastModified[ cacheURL ] = modified;
					}
					modified = jqXHR.getResponseHeader( "etag" );
					if ( modified ) {
						jQuery.etag[ cacheURL ] = modified;
					}
				}

				// if no content
				if ( status === 204 || s.type === "HEAD" ) {
					statusText = "nocontent";

				// if not modified
				} else if ( status === 304 ) {
					statusText = "notmodified";

				// If we have data, let's convert it
				} else {
					statusText = response.state;
					success = response.data;
					error = response.error;
					isSuccess = !error;
				}
			} else {

				// Extract error from statusText and normalize for non-aborts
				error = statusText;
				if ( status || !statusText ) {
					statusText = "error";
					if ( status < 0 ) {
						status = 0;
					}
				}
			}

			// Set data for the fake xhr object
			jqXHR.status = status;
			jqXHR.statusText = ( nativeStatusText || statusText ) + "";

			// Success/Error
			if ( isSuccess ) {
				deferred.resolveWith( callbackContext, [ success, statusText, jqXHR ] );
			} else {
				deferred.rejectWith( callbackContext, [ jqXHR, statusText, error ] );
			}

			// Status-dependent callbacks
			jqXHR.statusCode( statusCode );
			statusCode = undefined;

			if ( fireGlobals ) {
				globalEventContext.trigger( isSuccess ? "ajaxSuccess" : "ajaxError",
					[ jqXHR, s, isSuccess ? success : error ] );
			}

			// Complete
			completeDeferred.fireWith( callbackContext, [ jqXHR, statusText ] );

			if ( fireGlobals ) {
				globalEventContext.trigger( "ajaxComplete", [ jqXHR, s ] );

				// Handle the global AJAX counter
				if ( !( --jQuery.active ) ) {
					jQuery.event.trigger( "ajaxStop" );
				}
			}
		}

		return jqXHR;
	},

	getJSON: function( url, data, callback ) {
		return jQuery.get( url, data, callback, "json" );
	},

	getScript: function( url, callback ) {
		return jQuery.get( url, undefined, callback, "script" );
	}
} );

jQuery.each( [ "get", "post" ], function( _i, method ) {
	jQuery[ method ] = function( url, data, callback, type ) {

		// Shift arguments if data argument was omitted
		if ( isFunction( data ) ) {
			type = type || callback;
			callback = data;
			data = undefined;
		}

		// The url can be an options object (which then must have .url)
		return jQuery.ajax( jQuery.extend( {
			url: url,
			type: method,
			dataType: type,
			data: data,
			success: callback
		}, jQuery.isPlainObject( url ) && url ) );
	};
} );

jQuery.ajaxPrefilter( function( s ) {
	var i;
	for ( i in s.headers ) {
		if ( i.toLowerCase() === "content-type" ) {
			s.contentType = s.headers[ i ] || "";
		}
	}
} );


jQuery._evalUrl = function( url, options, doc ) {
	return jQuery.ajax( {
		url: url,

		// Make this explicit, since user can override this through ajaxSetup (trac-11264)
		type: "GET",
		dataType: "script",
		cache: true,
		async: false,
		global: false,

		// Only evaluate the response if it is successful (gh-4126)
		// dataFilter is not invoked for failure responses, so using it instead
		// of the default converter is kludgy but it works.
		converters: {
			"text script": function() {}
		},
		dataFilter: function( response ) {
			jQuery.globalEval( response, options, doc );
		}
	} );
};


jQuery.fn.extend( {
	wrapAll: function( html ) {
		var wrap;

		if ( this[ 0 ] ) {
			if ( isFunction( html ) ) {
				html = html.call( this[ 0 ] );
			}

			// The elements to wrap the target around
			wrap = jQuery( html, this[ 0 ].ownerDocument ).eq( 0 ).clone( true );

			if ( this[ 0 ].parentNode ) {
				wrap.insertBefore( this[ 0 ] );
			}

			wrap.map( function() {
				var elem = this;

				while ( elem.firstElementChild ) {
					elem = elem.firstElementChild;
				}

				return elem;
			} ).append( this );
		}

		return this;
	},

	wrapInner: function( html ) {
		if ( isFunction( html ) ) {
			return this.each( function( i ) {
				jQuery( this ).wrapInner( html.call( this, i ) );
			} );
		}

		return this.each( function() {
			var self = jQuery( this ),
				contents = self.contents();

			if ( contents.length ) {
				contents.wrapAll( html );

			} else {
				self.append( html );
			}
		} );
	},

	wrap: function( html ) {
		var htmlIsFunction = isFunction( html );

		return this.each( function( i ) {
			jQuery( this ).wrapAll( htmlIsFunction ? html.call( this, i ) : html );
		} );
	},

	unwrap: function( selector ) {
		this.parent( selector ).not( "body" ).each( function() {
			jQuery( this ).replaceWith( this.childNodes );
		} );
		return this;
	}
} );


jQuery.expr.pseudos.hidden = function( elem ) {
	return !jQuery.expr.pseudos.visible( elem );
};
jQuery.expr.pseudos.visible = function( elem ) {
	return !!( elem.offsetWidth || elem.offsetHeight || elem.getClientRects().length );
};




jQuery.ajaxSettings.xhr = function() {
	try {
		return new window.XMLHttpRequest();
	} catch ( e ) {}
};

var xhrSuccessStatus = {

		// File protocol always yields status code 0, assume 200
		0: 200,

		// Support: IE <=9 only
		// trac-1450: sometimes IE returns 1223 when it should be 204
		1223: 204
	},
	xhrSupported = jQuery.ajaxSettings.xhr();

support.cors = !!xhrSupported && ( "withCredentials" in xhrSupported );
support.ajax = xhrSupported = !!xhrSupported;

jQuery.ajaxTransport( function( options ) {
	var callback, errorCallback;

	// Cross domain only allowed if supported through XMLHttpRequest
	if ( support.cors || xhrSupported && !options.crossDomain ) {
		return {
			send: function( headers, complete ) {
				var i,
					xhr = options.xhr();

				xhr.open(
					options.type,
					options.url,
					options.async,
					options.username,
					options.password
				);

				// Apply custom fields if provided
				if ( options.xhrFields ) {
					for ( i in options.xhrFields ) {
						xhr[ i ] = options.xhrFields[ i ];
					}
				}

				// Override mime type if needed
				if ( options.mimeType && xhr.overrideMimeType ) {
					xhr.overrideMimeType( options.mimeType );
				}

				// X-Requested-With header
				// For cross-domain requests, seeing as conditions for a preflight are
				// akin to a jigsaw puzzle, we simply never set it to be sure.
				// (it can always be set on a per-request basis or even using ajaxSetup)
				// For same-domain requests, won't change header if already provided.
				if ( !options.crossDomain && !headers[ "X-Requested-With" ] ) {
					headers[ "X-Requested-With" ] = "XMLHttpRequest";
				}

				// Set headers
				for ( i in headers ) {
					xhr.setRequestHeader( i, headers[ i ] );
				}

				// Callback
				callback = function( type ) {
					return function() {
						if ( callback ) {
							callback = errorCallback = xhr.onload =
								xhr.onerror = xhr.onabort = xhr.ontimeout =
									xhr.onreadystatechange = null;

							if ( type === "abort" ) {
								xhr.abort();
							} else if ( type === "error" ) {

								// Support: IE <=9 only
								// On a manual native abort, IE9 throws
								// errors on any property access that is not readyState
								if ( typeof xhr.status !== "number" ) {
									complete( 0, "error" );
								} else {
									complete(

										// File: protocol always yields status 0; see trac-8605, trac-14207
										xhr.status,
										xhr.statusText
									);
								}
							} else {
								complete(
									xhrSuccessStatus[ xhr.status ] || xhr.status,
									xhr.statusText,

									// Support: IE <=9 only
									// IE9 has no XHR2 but throws on binary (trac-11426)
									// For XHR2 non-text, let the caller handle it (gh-2498)
									( xhr.responseType || "text" ) !== "text"  ||
									typeof xhr.responseText !== "string" ?
										{ binary: xhr.response } :
										{ text: xhr.responseText },
									xhr.getAllResponseHeaders()
								);
							}
						}
					};
				};

				// Listen to events
				xhr.onload = callback();
				errorCallback = xhr.onerror = xhr.ontimeout = callback( "error" );

				// Support: IE 9 only
				// Use onreadystatechange to replace onabort
				// to handle uncaught aborts
				if ( xhr.onabort !== undefined ) {
					xhr.onabort = errorCallback;
				} else {
					xhr.onreadystatechange = function() {

						// Check readyState before timeout as it changes
						if ( xhr.readyState === 4 ) {

							// Allow onerror to be called first,
							// but that will not handle a native abort
							// Also, save errorCallback to a variable
							// as xhr.onerror cannot be accessed
							window.setTimeout( function() {
								if ( callback ) {
									errorCallback();
								}
							} );
						}
					};
				}

				// Create the abort callback
				callback = callback( "abort" );

				try {

					// Do send the request (this may raise an exception)
					xhr.send( options.hasContent && options.data || null );
				} catch ( e ) {

					// trac-14683: Only rethrow if this hasn't been notified as an error yet
					if ( callback ) {
						throw e;
					}
				}
			},

			abort: function() {
				if ( callback ) {
					callback();
				}
			}
		};
	}
} );




// Prevent auto-execution of scripts when no explicit dataType was provided (See gh-2432)
jQuery.ajaxPrefilter( function( s ) {
	if ( s.crossDomain ) {
		s.contents.script = false;
	}
} );

// Install script dataType
jQuery.ajaxSetup( {
	accepts: {
		script: "text/javascript, application/javascript, " +
			"application/ecmascript, application/x-ecmascript"
	},
	contents: {
		script: /\b(?:java|ecma)script\b/
	},
	converters: {
		"text script": function( text ) {
			jQuery.globalEval( text );
			return text;
		}
	}
} );

// Handle cache's special case and crossDomain
jQuery.ajaxPrefilter( "script", function( s ) {
	if ( s.cache === undefined ) {
		s.cache = false;
	}
	if ( s.crossDomain ) {
		s.type = "GET";
	}
} );

// Bind script tag hack transport
jQuery.ajaxTransport( "script", function( s ) {

	// This transport only deals with cross domain or forced-by-attrs requests
	if ( s.crossDomain || s.scriptAttrs ) {
		var script, callback;
		return {
			send: function( _, complete ) {
				script = jQuery( "<script>" )
					.attr( s.scriptAttrs || {} )
					.prop( { charset: s.scriptCharset, src: s.url } )
					.on( "load error", callback = function( evt ) {
						script.remove();
						callback = null;
						if ( evt ) {
							complete( evt.type === "error" ? 404 : 200, evt.type );
						}
					} );

				// Use native DOM manipulation to avoid our domManip AJAX trickery
				document.head.appendChild( script[ 0 ] );
			},
			abort: function() {
				if ( callback ) {
					callback();
				}
			}
		};
	}
} );




var oldCallbacks = [],
	rjsonp = /(=)\?(?=&|$)|\?\?/;

// Default jsonp settings
jQuery.ajaxSetup( {
	jsonp: "callback",
	jsonpCallback: function() {
		var callback = oldCallbacks.pop() || ( jQuery.expando + "_" + ( nonce.guid++ ) );
		this[ callback ] = true;
		return callback;
	}
} );

// Detect, normalize options and install callbacks for jsonp requests
jQuery.ajaxPrefilter( "json jsonp", function( s, originalSettings, jqXHR ) {

	var callbackName, overwritten, responseContainer,
		jsonProp = s.jsonp !== false && ( rjsonp.test( s.url ) ?
			"url" :
			typeof s.data === "string" &&
				( s.contentType || "" )
					.indexOf( "application/x-www-form-urlencoded" ) === 0 &&
				rjsonp.test( s.data ) && "data"
		);

	// Handle iff the expected data type is "jsonp" or we have a parameter to set
	if ( jsonProp || s.dataTypes[ 0 ] === "jsonp" ) {

		// Get callback name, remembering preexisting value associated with it
		callbackName = s.jsonpCallback = isFunction( s.jsonpCallback ) ?
			s.jsonpCallback() :
			s.jsonpCallback;

		// Insert callback into url or form data
		if ( jsonProp ) {
			s[ jsonProp ] = s[ jsonProp ].replace( rjsonp, "$1" + callbackName );
		} else if ( s.jsonp !== false ) {
			s.url += ( rquery.test( s.url ) ? "&" : "?" ) + s.jsonp + "=" + callbackName;
		}

		// Use data converter to retrieve json after script execution
		s.converters[ "script json" ] = function() {
			if ( !responseContainer ) {
				jQuery.error( callbackName + " was not called" );
			}
			return responseContainer[ 0 ];
		};

		// Force json dataType
		s.dataTypes[ 0 ] = "json";

		// Install callback
		overwritten = window[ callbackName ];
		window[ callbackName ] = function() {
			responseContainer = arguments;
		};

		// Clean-up function (fires after converters)
		jqXHR.always( function() {

			// If previous value didn't exist - remove it
			if ( overwritten === undefined ) {
				jQuery( window ).removeProp( callbackName );

			// Otherwise restore preexisting value
			} else {
				window[ callbackName ] = overwritten;
			}

			// Save back as free
			if ( s[ callbackName ] ) {

				// Make sure that re-using the options doesn't screw things around
				s.jsonpCallback = originalSettings.jsonpCallback;

				// Save the callback name for future use
				oldCallbacks.push( callbackName );
			}

			// Call if it was a function and we have a response
			if ( responseContainer && isFunction( overwritten ) ) {
				overwritten( responseContainer[ 0 ] );
			}

			responseContainer = overwritten = undefined;
		} );

		// Delegate to script
		return "script";
	}
} );




// Support: Safari 8 only
// In Safari 8 documents created via document.implementation.createHTMLDocument
// collapse sibling forms: the second one becomes a child of the first one.
// Because of that, this security measure has to be disabled in Safari 8.
// https://bugs.webkit.org/show_bug.cgi?id=137337
support.createHTMLDocument = ( function() {
	var body = document.implementation.createHTMLDocument( "" ).body;
	body.innerHTML = "<form></form><form></form>";
	return body.childNodes.length === 2;
} )();


// Argument "data" should be string of html
// context (optional): If specified, the fragment will be created in this context,
// defaults to document
// keepScripts (optional): If true, will include scripts passed in the html string
jQuery.parseHTML = function( data, context, keepScripts ) {
	if ( typeof data !== "string" ) {
		return [];
	}
	if ( typeof context === "boolean" ) {
		keepScripts = context;
		context = false;
	}

	var base, parsed, scripts;

	if ( !context ) {

		// Stop scripts or inline event handlers from being executed immediately
		// by using document.implementation
		if ( support.createHTMLDocument ) {
			context = document.implementation.createHTMLDocument( "" );

			// Set the base href for the created document
			// so any parsed elements with URLs
			// are based on the document's URL (gh-2965)
			base = context.createElement( "base" );
			base.href = document.location.href;
			context.head.appendChild( base );
		} else {
			context = document;
		}
	}

	parsed = rsingleTag.exec( data );
	scripts = !keepScripts && [];

	// Single tag
	if ( parsed ) {
		return [ context.createElement( parsed[ 1 ] ) ];
	}

	parsed = buildFragment( [ data ], context, scripts );

	if ( scripts && scripts.length ) {
		jQuery( scripts ).remove();
	}

	return jQuery.merge( [], parsed.childNodes );
};


/**
 * Load a url into a page
 */
jQuery.fn.load = function( url, params, callback ) {
	var selector, type, response,
		self = this,
		off = url.indexOf( " " );

	if ( off > -1 ) {
		selector = stripAndCollapse( url.slice( off ) );
		url = url.slice( 0, off );
	}

	// If it's a function
	if ( isFunction( params ) ) {

		// We assume that it's the callback
		callback = params;
		params = undefined;

	// Otherwise, build a param string
	} else if ( params && typeof params === "object" ) {
		type = "POST";
	}

	// If we have elements to modify, make the request
	if ( self.length > 0 ) {
		jQuery.ajax( {
			url: url,

			// If "type" variable is undefined, then "GET" method will be used.
			// Make value of this field explicit since
			// user can override it through ajaxSetup method
			type: type || "GET",
			dataType: "html",
			data: params
		} ).done( function( responseText ) {

			// Save response for use in complete callback
			response = arguments;

			self.html( selector ?

				// If a selector was specified, locate the right elements in a dummy div
				// Exclude scripts to avoid IE 'Permission Denied' errors
				jQuery( "<div>" ).append( jQuery.parseHTML( responseText ) ).find( selector ) :

				// Otherwise use the full result
				responseText );

		// If the request succeeds, this function gets "data", "status", "jqXHR"
		// but they are ignored because response was set above.
		// If it fails, this function gets "jqXHR", "status", "error"
		} ).always( callback && function( jqXHR, status ) {
			self.each( function() {
				callback.apply( this, response || [ jqXHR.responseText, status, jqXHR ] );
			} );
		} );
	}

	return this;
};




jQuery.expr.pseudos.animated = function( elem ) {
	return jQuery.grep( jQuery.timers, function( fn ) {
		return elem === fn.elem;
	} ).length;
};




jQuery.offset = {
	setOffset: function( elem, options, i ) {
		var curPosition, curLeft, curCSSTop, curTop, curOffset, curCSSLeft, calculatePosition,
			position = jQuery.css( elem, "position" ),
			curElem = jQuery( elem ),
			props = {};

		// Set position first, in-case top/left are set even on static elem
		if ( position === "static" ) {
			elem.style.position = "relative";
		}

		curOffset = curElem.offset();
		curCSSTop = jQuery.css( elem, "top" );
		curCSSLeft = jQuery.css( elem, "left" );
		calculatePosition = ( position === "absolute" || position === "fixed" ) &&
			( curCSSTop + curCSSLeft ).indexOf( "auto" ) > -1;

		// Need to be able to calculate position if either
		// top or left is auto and position is either absolute or fixed
		if ( calculatePosition ) {
			curPosition = curElem.position();
			curTop = curPosition.top;
			curLeft = curPosition.left;

		} else {
			curTop = parseFloat( curCSSTop ) || 0;
			curLeft = parseFloat( curCSSLeft ) || 0;
		}

		if ( isFunction( options ) ) {

			// Use jQuery.extend here to allow modification of coordinates argument (gh-1848)
			options = options.call( elem, i, jQuery.extend( {}, curOffset ) );
		}

		if ( options.top != null ) {
			props.top = ( options.top - curOffset.top ) + curTop;
		}
		if ( options.left != null ) {
			props.left = ( options.left - curOffset.left ) + curLeft;
		}

		if ( "using" in options ) {
			options.using.call( elem, props );

		} else {
			curElem.css( props );
		}
	}
};

jQuery.fn.extend( {

	// offset() relates an element's border box to the document origin
	offset: function( options ) {

		// Preserve chaining for setter
		if ( arguments.length ) {
			return options === undefined ?
				this :
				this.each( function( i ) {
					jQuery.offset.setOffset( this, options, i );
				} );
		}

		var rect, win,
			elem = this[ 0 ];

		if ( !elem ) {
			return;
		}

		// Return zeros for disconnected and hidden (display: none) elements (gh-2310)
		// Support: IE <=11 only
		// Running getBoundingClientRect on a
		// disconnected node in IE throws an error
		if ( !elem.getClientRects().length ) {
			return { top: 0, left: 0 };
		}

		// Get document-relative position by adding viewport scroll to viewport-relative gBCR
		rect = elem.getBoundingClientRect();
		win = elem.ownerDocument.defaultView;
		return {
			top: rect.top + win.pageYOffset,
			left: rect.left + win.pageXOffset
		};
	},

	// position() relates an element's margin box to its offset parent's padding box
	// This corresponds to the behavior of CSS absolute positioning
	position: function() {
		if ( !this[ 0 ] ) {
			return;
		}

		var offsetParent, offset, doc,
			elem = this[ 0 ],
			parentOffset = { top: 0, left: 0 };

		// position:fixed elements are offset from the viewport, which itself always has zero offset
		if ( jQuery.css( elem, "position" ) === "fixed" ) {

			// Assume position:fixed implies availability of getBoundingClientRect
			offset = elem.getBoundingClientRect();

		} else {
			offset = this.offset();

			// Account for the *real* offset parent, which can be the document or its root element
			// when a statically positioned element is identified
			doc = elem.ownerDocument;
			offsetParent = elem.offsetParent || doc.documentElement;
			while ( offsetParent &&
				( offsetParent === doc.body || offsetParent === doc.documentElement ) &&
				jQuery.css( offsetParent, "position" ) === "static" ) {

				offsetParent = offsetParent.parentNode;
			}
			if ( offsetParent && offsetParent !== elem && offsetParent.nodeType === 1 ) {

				// Incorporate borders into its offset, since they are outside its content origin
				parentOffset = jQuery( offsetParent ).offset();
				parentOffset.top += jQuery.css( offsetParent, "borderTopWidth", true );
				parentOffset.left += jQuery.css( offsetParent, "borderLeftWidth", true );
			}
		}

		// Subtract parent offsets and element margins
		return {
			top: offset.top - parentOffset.top - jQuery.css( elem, "marginTop", true ),
			left: offset.left - parentOffset.left - jQuery.css( elem, "marginLeft", true )
		};
	},

	// This method will return documentElement in the following cases:
	// 1) For the element inside the iframe without offsetParent, this method will return
	//    documentElement of the parent window
	// 2) For the hidden or detached element
	// 3) For body or html element, i.e. in case of the html node - it will return itself
	//
	// but those exceptions were never presented as a real life use-cases
	// and might be considered as more preferable results.
	//
	// This logic, however, is not guaranteed and can change at any point in the future
	offsetParent: function() {
		return this.map( function() {
			var offsetParent = this.offsetParent;

			while ( offsetParent && jQuery.css( offsetParent, "position" ) === "static" ) {
				offsetParent = offsetParent.offsetParent;
			}

			return offsetParent || documentElement;
		} );
	}
} );

// Create scrollLeft and scrollTop methods
jQuery.each( { scrollLeft: "pageXOffset", scrollTop: "pageYOffset" }, function( method, prop ) {
	var top = "pageYOffset" === prop;

	jQuery.fn[ method ] = function( val ) {
		return access( this, function( elem, method, val ) {

			// Coalesce documents and windows
			var win;
			if ( isWindow( elem ) ) {
				win = elem;
			} else if ( elem.nodeType === 9 ) {
				win = elem.defaultView;
			}

			if ( val === undefined ) {
				return win ? win[ prop ] : elem[ method ];
			}

			if ( win ) {
				win.scrollTo(
					!top ? val : win.pageXOffset,
					top ? val : win.pageYOffset
				);

			} else {
				elem[ method ] = val;
			}
		}, method, val, arguments.length );
	};
} );

// Support: Safari <=7 - 9.1, Chrome <=37 - 49
// Add the top/left cssHooks using jQuery.fn.position
// Webkit bug: https://bugs.webkit.org/show_bug.cgi?id=29084
// Blink bug: https://bugs.chromium.org/p/chromium/issues/detail?id=589347
// getComputedStyle returns percent when specified for top/left/bottom/right;
// rather than make the css module depend on the offset module, just check for it here
jQuery.each( [ "top", "left" ], function( _i, prop ) {
	jQuery.cssHooks[ prop ] = addGetHookIf( support.pixelPosition,
		function( elem, computed ) {
			if ( computed ) {
				computed = curCSS( elem, prop );

				// If curCSS returns percentage, fallback to offset
				return rnumnonpx.test( computed ) ?
					jQuery( elem ).position()[ prop ] + "px" :
					computed;
			}
		}
	);
} );


// Create innerHeight, innerWidth, height, width, outerHeight and outerWidth methods
jQuery.each( { Height: "height", Width: "width" }, function( name, type ) {
	jQuery.each( {
		padding: "inner" + name,
		content: type,
		"": "outer" + name
	}, function( defaultExtra, funcName ) {

		// Margin is only for outerHeight, outerWidth
		jQuery.fn[ funcName ] = function( margin, value ) {
			var chainable = arguments.length && ( defaultExtra || typeof margin !== "boolean" ),
				extra = defaultExtra || ( margin === true || value === true ? "margin" : "border" );

			return access( this, function( elem, type, value ) {
				var doc;

				if ( isWindow( elem ) ) {

					// $( window ).outerWidth/Height return w/h including scrollbars (gh-1729)
					return funcName.indexOf( "outer" ) === 0 ?
						elem[ "inner" + name ] :
						elem.document.documentElement[ "client" + name ];
				}

				// Get document width or height
				if ( elem.nodeType === 9 ) {
					doc = elem.documentElement;

					// Either scroll[Width/Height] or offset[Width/Height] or client[Width/Height],
					// whichever is greatest
					return Math.max(
						elem.body[ "scroll" + name ], doc[ "scroll" + name ],
						elem.body[ "offset" + name ], doc[ "offset" + name ],
						doc[ "client" + name ]
					);
				}

				return value === undefined ?

					// Get width or height on the element, requesting but not forcing parseFloat
					jQuery.css( elem, type, extra ) :

					// Set width or height on the element
					jQuery.style( elem, type, value, extra );
			}, type, chainable ? margin : undefined, chainable );
		};
	} );
} );


jQuery.each( [
	"ajaxStart",
	"ajaxStop",
	"ajaxComplete",
	"ajaxError",
	"ajaxSuccess",
	"ajaxSend"
], function( _i, type ) {
	jQuery.fn[ type ] = function( fn ) {
		return this.on( type, fn );
	};
} );




jQuery.fn.extend( {

	bind: function( types, data, fn ) {
		return this.on( types, null, data, fn );
	},
	unbind: function( types, fn ) {
		return this.off( types, null, fn );
	},

	delegate: function( selector, types, data, fn ) {
		return this.on( types, selector, data, fn );
	},
	undelegate: function( selector, types, fn ) {

		// ( namespace ) or ( selector, types [, fn] )
		return arguments.length === 1 ?
			this.off( selector, "**" ) :
			this.off( types, selector || "**", fn );
	},

	hover: function( fnOver, fnOut ) {
		return this
			.on( "mouseenter", fnOver )
			.on( "mouseleave", fnOut || fnOver );
	}
} );

jQuery.each(
	( "blur focus focusin focusout resize scroll click dblclick " +
	"mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave " +
	"change select submit keydown keypress keyup contextmenu" ).split( " " ),
	function( _i, name ) {

		// Handle event binding
		jQuery.fn[ name ] = function( data, fn ) {
			return arguments.length > 0 ?
				this.on( name, null, data, fn ) :
				this.trigger( name );
		};
	}
);




// Support: Android <=4.0 only
// Make sure we trim BOM and NBSP
// Require that the "whitespace run" starts from a non-whitespace
// to avoid O(N^2) behavior when the engine would try matching "\s+$" at each space position.
var rtrim = /^[\s\uFEFF\xA0]+|([^\s\uFEFF\xA0])[\s\uFEFF\xA0]+$/g;

// Bind a function to a context, optionally partially applying any
// arguments.
// jQuery.proxy is deprecated to promote standards (specifically Function#bind)
// However, it is not slated for removal any time soon
jQuery.proxy = function( fn, context ) {
	var tmp, args, proxy;

	if ( typeof context === "string" ) {
		tmp = fn[ context ];
		context = fn;
		fn = tmp;
	}

	// Quick check to determine if target is callable, in the spec
	// this throws a TypeError, but we will just return undefined.
	if ( !isFunction( fn ) ) {
		return undefined;
	}

	// Simulated bind
	args = slice.call( arguments, 2 );
	proxy = function() {
		return fn.apply( context || this, args.concat( slice.call( arguments ) ) );
	};

	// Set the guid of unique handler to the same of original handler, so it can be removed
	proxy.guid = fn.guid = fn.guid || jQuery.guid++;

	return proxy;
};

jQuery.holdReady = function( hold ) {
	if ( hold ) {
		jQuery.readyWait++;
	} else {
		jQuery.ready( true );
	}
};
jQuery.isArray = Array.isArray;
jQuery.parseJSON = JSON.parse;
jQuery.nodeName = nodeName;
jQuery.isFunction = isFunction;
jQuery.isWindow = isWindow;
jQuery.camelCase = camelCase;
jQuery.type = toType;

jQuery.now = Date.now;

jQuery.isNumeric = function( obj ) {

	// As of jQuery 3.0, isNumeric is limited to
	// strings and numbers (primitives or objects)
	// that can be coerced to finite numbers (gh-2662)
	var type = jQuery.type( obj );
	return ( type === "number" || type === "string" ) &&

		// parseFloat NaNs numeric-cast false positives ("")
		// ...but misinterprets leading-number strings, particularly hex literals ("0x...")
		// subtraction forces infinities to NaN
		!isNaN( obj - parseFloat( obj ) );
};

jQuery.trim = function( text ) {
	return text == null ?
		"" :
		( text + "" ).replace( rtrim, "$1" );
};



// Register as a named AMD module, since jQuery can be concatenated with other
// files that may use define, but not via a proper concatenation script that
// understands anonymous AMD modules. A named AMD is safest and most robust
// way to register. Lowercase jquery is used because AMD module names are
// derived from file names, and jQuery is normally delivered in a lowercase
// file name. Do this after creating the global so that if an AMD module wants
// to call noConflict to hide this version of jQuery, it will work.

// Note that for maximum portability, libraries that are not jQuery should
// declare themselves as anonymous modules, and avoid setting a global if an
// AMD loader is present. jQuery is a special case. For more information, see
// https://github.com/jrburke/requirejs/wiki/Updating-existing-libraries#wiki-anon

if ( true ) {
	!(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_RESULT__ = (function() {
		return jQuery;
	}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
}




var

	// Map over jQuery in case of overwrite
	_jQuery = window.jQuery,

	// Map over the $ in case of overwrite
	_$ = window.$;

jQuery.noConflict = function( deep ) {
	if ( window.$ === jQuery ) {
		window.$ = _$;
	}

	if ( deep && window.jQuery === jQuery ) {
		window.jQuery = _jQuery;
	}

	return jQuery;
};

// Expose jQuery and $ identifiers, even in AMD
// (trac-7102#comment:10, https://github.com/jquery/jquery/pull/557)
// and CommonJS for browser emulators (trac-13566)
if ( typeof noGlobal === "undefined" ) {
	window.jQuery = window.$ = jQuery;
}




return jQuery;
} );


/***/ }),

/***/ "./node_modules/raw-loader/dist/cjs.js!./example-cfgs/Micro.txt":
/*!**********************************************************************!*\
  !*** ./node_modules/raw-loader/dist/cjs.js!./example-cfgs/Micro.txt ***!
  \**********************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ("# this is a LL(1) grammar\n# you can parse it with LL(1) or LR(1)\n#!start-symbol: program\n#!parse-example: begin ID := INTLIT ; read ( ID ) ; end\n\nprogram -> begin statement_list end\nstatement_list -> statement statement_tail\nstatement_tail -> statement statement_tail\nstatement_tail -> \nstatement -> ID := expression ;\nstatement -> read ( id_list ) ;\nstatement -> write ( expr_list ) ;\nid_list -> ID id_tail\nid_tail -> , ID id_tail\nid_tail -> \nexpr_list -> expression expr_tail\nexpr_tail -> , expression expr_tail\nexpr_tail -> \nexpression -> primary primary_tail\nprimary_tail -> add_op primary primary_tail\nprimary_tail -> \nprimary -> ( expression )\nprimary -> ID\nprimary -> INTLIT\nadd_op -> +\nadd_op -> -\n");

/***/ }),

/***/ "./node_modules/rgbcolor/index.js":
/*!****************************************!*\
  !*** ./node_modules/rgbcolor/index.js ***!
  \****************************************/
/*! no static exports found */
/***/ (function(module, exports) {

/*
	Based on rgbcolor.js by Stoyan Stefanov <sstoo@gmail.com>
	http://www.phpied.com/rgb-color-parser-in-javascript/
*/

module.exports = function(color_string) {
    this.ok = false;
    this.alpha = 1.0;

    // strip any leading #
    if (color_string.charAt(0) == '#') { // remove # if any
        color_string = color_string.substr(1,6);
    }

    color_string = color_string.replace(/ /g,'');
    color_string = color_string.toLowerCase();

    // before getting into regexps, try simple matches
    // and overwrite the input
    var simple_colors = {
        aliceblue: 'f0f8ff',
        antiquewhite: 'faebd7',
        aqua: '00ffff',
        aquamarine: '7fffd4',
        azure: 'f0ffff',
        beige: 'f5f5dc',
        bisque: 'ffe4c4',
        black: '000000',
        blanchedalmond: 'ffebcd',
        blue: '0000ff',
        blueviolet: '8a2be2',
        brown: 'a52a2a',
        burlywood: 'deb887',
        cadetblue: '5f9ea0',
        chartreuse: '7fff00',
        chocolate: 'd2691e',
        coral: 'ff7f50',
        cornflowerblue: '6495ed',
        cornsilk: 'fff8dc',
        crimson: 'dc143c',
        cyan: '00ffff',
        darkblue: '00008b',
        darkcyan: '008b8b',
        darkgoldenrod: 'b8860b',
        darkgray: 'a9a9a9',
        darkgreen: '006400',
        darkkhaki: 'bdb76b',
        darkmagenta: '8b008b',
        darkolivegreen: '556b2f',
        darkorange: 'ff8c00',
        darkorchid: '9932cc',
        darkred: '8b0000',
        darksalmon: 'e9967a',
        darkseagreen: '8fbc8f',
        darkslateblue: '483d8b',
        darkslategray: '2f4f4f',
        darkturquoise: '00ced1',
        darkviolet: '9400d3',
        deeppink: 'ff1493',
        deepskyblue: '00bfff',
        dimgray: '696969',
        dodgerblue: '1e90ff',
        feldspar: 'd19275',
        firebrick: 'b22222',
        floralwhite: 'fffaf0',
        forestgreen: '228b22',
        fuchsia: 'ff00ff',
        gainsboro: 'dcdcdc',
        ghostwhite: 'f8f8ff',
        gold: 'ffd700',
        goldenrod: 'daa520',
        gray: '808080',
        green: '008000',
        greenyellow: 'adff2f',
        honeydew: 'f0fff0',
        hotpink: 'ff69b4',
        indianred : 'cd5c5c',
        indigo : '4b0082',
        ivory: 'fffff0',
        khaki: 'f0e68c',
        lavender: 'e6e6fa',
        lavenderblush: 'fff0f5',
        lawngreen: '7cfc00',
        lemonchiffon: 'fffacd',
        lightblue: 'add8e6',
        lightcoral: 'f08080',
        lightcyan: 'e0ffff',
        lightgoldenrodyellow: 'fafad2',
        lightgrey: 'd3d3d3',
        lightgreen: '90ee90',
        lightpink: 'ffb6c1',
        lightsalmon: 'ffa07a',
        lightseagreen: '20b2aa',
        lightskyblue: '87cefa',
        lightslateblue: '8470ff',
        lightslategray: '778899',
        lightsteelblue: 'b0c4de',
        lightyellow: 'ffffe0',
        lime: '00ff00',
        limegreen: '32cd32',
        linen: 'faf0e6',
        magenta: 'ff00ff',
        maroon: '800000',
        mediumaquamarine: '66cdaa',
        mediumblue: '0000cd',
        mediumorchid: 'ba55d3',
        mediumpurple: '9370d8',
        mediumseagreen: '3cb371',
        mediumslateblue: '7b68ee',
        mediumspringgreen: '00fa9a',
        mediumturquoise: '48d1cc',
        mediumvioletred: 'c71585',
        midnightblue: '191970',
        mintcream: 'f5fffa',
        mistyrose: 'ffe4e1',
        moccasin: 'ffe4b5',
        navajowhite: 'ffdead',
        navy: '000080',
        oldlace: 'fdf5e6',
        olive: '808000',
        olivedrab: '6b8e23',
        orange: 'ffa500',
        orangered: 'ff4500',
        orchid: 'da70d6',
        palegoldenrod: 'eee8aa',
        palegreen: '98fb98',
        paleturquoise: 'afeeee',
        palevioletred: 'd87093',
        papayawhip: 'ffefd5',
        peachpuff: 'ffdab9',
        peru: 'cd853f',
        pink: 'ffc0cb',
        plum: 'dda0dd',
        powderblue: 'b0e0e6',
        purple: '800080',
        red: 'ff0000',
        rosybrown: 'bc8f8f',
        royalblue: '4169e1',
        saddlebrown: '8b4513',
        salmon: 'fa8072',
        sandybrown: 'f4a460',
        seagreen: '2e8b57',
        seashell: 'fff5ee',
        sienna: 'a0522d',
        silver: 'c0c0c0',
        skyblue: '87ceeb',
        slateblue: '6a5acd',
        slategray: '708090',
        snow: 'fffafa',
        springgreen: '00ff7f',
        steelblue: '4682b4',
        tan: 'd2b48c',
        teal: '008080',
        thistle: 'd8bfd8',
        tomato: 'ff6347',
        turquoise: '40e0d0',
        violet: 'ee82ee',
        violetred: 'd02090',
        wheat: 'f5deb3',
        white: 'ffffff',
        whitesmoke: 'f5f5f5',
        yellow: 'ffff00',
        yellowgreen: '9acd32'
    };
    color_string = simple_colors[color_string] || color_string;
    // emd of simple type-in colors

    // array of color definition objects
    var color_defs = [
        {
            re: /^rgba\((\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3}),\s*((?:\d?\.)?\d)\)$/,
            example: ['rgba(123, 234, 45, 0.8)', 'rgba(255,234,245,1.0)'],
            process: function (bits){
                return [
                    parseInt(bits[1]),
                    parseInt(bits[2]),
                    parseInt(bits[3]),
                    parseFloat(bits[4])
                ];
            }
        },
        {
            re: /^rgb\((\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3})\)$/,
            example: ['rgb(123, 234, 45)', 'rgb(255,234,245)'],
            process: function (bits){
                return [
                    parseInt(bits[1]),
                    parseInt(bits[2]),
                    parseInt(bits[3])
                ];
            }
        },
        {
            re: /^(\w{2})(\w{2})(\w{2})$/,
            example: ['#00ff00', '336699'],
            process: function (bits){
                return [
                    parseInt(bits[1], 16),
                    parseInt(bits[2], 16),
                    parseInt(bits[3], 16)
                ];
            }
        },
        {
            re: /^(\w{1})(\w{1})(\w{1})$/,
            example: ['#fb0', 'f0f'],
            process: function (bits){
                return [
                    parseInt(bits[1] + bits[1], 16),
                    parseInt(bits[2] + bits[2], 16),
                    parseInt(bits[3] + bits[3], 16)
                ];
            }
        }
    ];

    // search through the definitions to find a match
    for (var i = 0; i < color_defs.length; i++) {
        var re = color_defs[i].re;
        var processor = color_defs[i].process;
        var bits = re.exec(color_string);
        if (bits) {
            var channels = processor(bits);
            this.r = channels[0];
            this.g = channels[1];
            this.b = channels[2];
            if (channels.length > 3) {
                this.alpha = channels[3];
            }
            this.ok = true;
        }

    }

    // validate/cleanup values
    this.r = (this.r < 0 || isNaN(this.r)) ? 0 : ((this.r > 255) ? 255 : this.r);
    this.g = (this.g < 0 || isNaN(this.g)) ? 0 : ((this.g > 255) ? 255 : this.g);
    this.b = (this.b < 0 || isNaN(this.b)) ? 0 : ((this.b > 255) ? 255 : this.b);
    this.alpha = (this.alpha < 0) ? 0 : ((this.alpha > 1.0 || isNaN(this.alpha)) ? 1.0 : this.alpha);

    // some getters
    this.toRGB = function () {
        return 'rgb(' + this.r + ', ' + this.g + ', ' + this.b + ')';
    }
    this.toRGBA = function () {
        return 'rgba(' + this.r + ', ' + this.g + ', ' + this.b + ', ' + this.alpha + ')';
    }
    this.toHex = function () {
        var r = this.r.toString(16);
        var g = this.g.toString(16);
        var b = this.b.toString(16);
        if (r.length == 1) r = '0' + r;
        if (g.length == 1) g = '0' + g;
        if (b.length == 1) b = '0' + b;
        return '#' + r + g + b;
    }

    // help
    this.getHelpXML = function () {

        var examples = new Array();
        // add regexps
        for (var i = 0; i < color_defs.length; i++) {
            var example = color_defs[i].example;
            for (var j = 0; j < example.length; j++) {
                examples[examples.length] = example[j];
            }
        }
        // add type-in colors
        for (var sc in simple_colors) {
            examples[examples.length] = sc;
        }

        var xml = document.createElement('ul');
        xml.setAttribute('id', 'rgbcolor-examples');
        for (var i = 0; i < examples.length; i++) {
            try {
                var list_item = document.createElement('li');
                var list_color = new RGBColor(examples[i]);
                var example_div = document.createElement('div');
                example_div.style.cssText =
                        'margin: 3px; '
                        + 'border: 1px solid black; '
                        + 'background:' + list_color.toHex() + '; '
                        + 'color:' + list_color.toHex()
                ;
                example_div.appendChild(document.createTextNode('test'));
                var list_item_value = document.createTextNode(
                    ' ' + examples[i] + ' -> ' + list_color.toRGB() + ' -> ' + list_color.toHex()
                );
                list_item.appendChild(example_div);
                list_item.appendChild(list_item_value);
                xml.appendChild(list_item);

            } catch(e){}
        }
        return xml;

    }

}


/***/ }),

/***/ "./node_modules/stackblur/index.js":
/*!*****************************************!*\
  !*** ./node_modules/stackblur/index.js ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports) {

/*

StackBlur - a fast almost Gaussian Blur For Canvas

Version: 	0.5
Author:		Mario Klingemann
Contact: 	mario@quasimondo.com
Website:	http://www.quasimondo.com/StackBlurForCanvas
Twitter:	@quasimondo

In case you find this class useful - especially in commercial projects -
I am not totally unhappy for a small donation to my PayPal account
mario@quasimondo.de

Or support me on flattr: 
https://flattr.com/thing/72791/StackBlur-a-fast-almost-Gaussian-Blur-Effect-for-CanvasJavascript

Copyright (c) 2010 Mario Klingemann

Permission is hereby granted, free of charge, to any person
obtaining a copy of this software and associated documentation
files (the "Software"), to deal in the Software without
restriction, including without limitation the rights to use,
copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the
Software is furnished to do so, subject to the following
conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
OTHER DEALINGS IN THE SOFTWARE.
*/

var mul_table = [
        512,512,456,512,328,456,335,512,405,328,271,456,388,335,292,512,
        454,405,364,328,298,271,496,456,420,388,360,335,312,292,273,512,
        482,454,428,405,383,364,345,328,312,298,284,271,259,496,475,456,
        437,420,404,388,374,360,347,335,323,312,302,292,282,273,265,512,
        497,482,468,454,441,428,417,405,394,383,373,364,354,345,337,328,
        320,312,305,298,291,284,278,271,265,259,507,496,485,475,465,456,
        446,437,428,420,412,404,396,388,381,374,367,360,354,347,341,335,
        329,323,318,312,307,302,297,292,287,282,278,273,269,265,261,512,
        505,497,489,482,475,468,461,454,447,441,435,428,422,417,411,405,
        399,394,389,383,378,373,368,364,359,354,350,345,341,337,332,328,
        324,320,316,312,309,305,301,298,294,291,287,284,281,278,274,271,
        268,265,262,259,257,507,501,496,491,485,480,475,470,465,460,456,
        451,446,442,437,433,428,424,420,416,412,408,404,400,396,392,388,
        385,381,377,374,370,367,363,360,357,354,350,347,344,341,338,335,
        332,329,326,323,320,318,315,312,310,307,304,302,299,297,294,292,
        289,287,285,282,280,278,275,273,271,269,267,265,263,261,259];
        
   
var shg_table = [
	     9, 11, 12, 13, 13, 14, 14, 15, 15, 15, 15, 16, 16, 16, 16, 17, 
		17, 17, 17, 17, 17, 17, 18, 18, 18, 18, 18, 18, 18, 18, 18, 19, 
		19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 20, 20, 20,
		20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 21,
		21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21,
		21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 22, 22, 22, 22, 22, 22, 
		22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22,
		22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 23, 
		23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23,
		23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23,
		23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 
		23, 23, 23, 23, 23, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 
		24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24,
		24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24,
		24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24,
		24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24 ];

function blur( pixels, width, height, radius )
{
	if ( isNaN(radius) || radius < 1 ) return;
	radius |= 0;

	var x, y, i, p, yp, yi, yw, r_sum, g_sum, b_sum, a_sum, 
	r_out_sum, g_out_sum, b_out_sum, a_out_sum,
	r_in_sum, g_in_sum, b_in_sum, a_in_sum, 
	pr, pg, pb, pa, rbs;
			
	var div = radius + radius + 1;
	var w4 = width << 2;
	var widthMinus1  = width - 1;
	var heightMinus1 = height - 1;
	var radiusPlus1  = radius + 1;
	var sumFactor = radiusPlus1 * ( radiusPlus1 + 1 ) / 2;
	
	var stackStart = new BlurStack();
	var stack = stackStart;
	for ( i = 1; i < div; i++ )
	{
		stack = stack.next = new BlurStack();
		if ( i == radiusPlus1 ) var stackEnd = stack;
	}
	stack.next = stackStart;
	var stackIn = null;
	var stackOut = null;
	
	yw = yi = 0;
	
	var mul_sum = mul_table[radius];
	var shg_sum = shg_table[radius];
	
	for ( y = 0; y < height; y++ )
	{
		r_in_sum = g_in_sum = b_in_sum = a_in_sum = r_sum = g_sum = b_sum = a_sum = 0;
		
		r_out_sum = radiusPlus1 * ( pr = pixels[yi] );
		g_out_sum = radiusPlus1 * ( pg = pixels[yi+1] );
		b_out_sum = radiusPlus1 * ( pb = pixels[yi+2] );
		a_out_sum = radiusPlus1 * ( pa = pixels[yi+3] );
		
		r_sum += sumFactor * pr;
		g_sum += sumFactor * pg;
		b_sum += sumFactor * pb;
		a_sum += sumFactor * pa;
		
		stack = stackStart;
		
		for( i = 0; i < radiusPlus1; i++ )
		{
			stack.r = pr;
			stack.g = pg;
			stack.b = pb;
			stack.a = pa;
			stack = stack.next;
		}
		
		for( i = 1; i < radiusPlus1; i++ )
		{
			p = yi + (( widthMinus1 < i ? widthMinus1 : i ) << 2 );
			r_sum += ( stack.r = ( pr = pixels[p])) * ( rbs = radiusPlus1 - i );
			g_sum += ( stack.g = ( pg = pixels[p+1])) * rbs;
			b_sum += ( stack.b = ( pb = pixels[p+2])) * rbs;
			a_sum += ( stack.a = ( pa = pixels[p+3])) * rbs;
			
			r_in_sum += pr;
			g_in_sum += pg;
			b_in_sum += pb;
			a_in_sum += pa;
			
			stack = stack.next;
		}
		
		
		stackIn = stackStart;
		stackOut = stackEnd;
		for ( x = 0; x < width; x++ )
		{
			pixels[yi+3] = pa = (a_sum * mul_sum) >> shg_sum;
			if ( pa != 0 )
			{
				pa = 255 / pa;
				pixels[yi]   = ((r_sum * mul_sum) >> shg_sum) * pa;
				pixels[yi+1] = ((g_sum * mul_sum) >> shg_sum) * pa;
				pixels[yi+2] = ((b_sum * mul_sum) >> shg_sum) * pa;
			} else {
				pixels[yi] = pixels[yi+1] = pixels[yi+2] = 0;
			}
			
			r_sum -= r_out_sum;
			g_sum -= g_out_sum;
			b_sum -= b_out_sum;
			a_sum -= a_out_sum;
			
			r_out_sum -= stackIn.r;
			g_out_sum -= stackIn.g;
			b_out_sum -= stackIn.b;
			a_out_sum -= stackIn.a;
			
			p =  ( yw + ( ( p = x + radius + 1 ) < widthMinus1 ? p : widthMinus1 ) ) << 2;
			
			r_in_sum += ( stackIn.r = pixels[p]);
			g_in_sum += ( stackIn.g = pixels[p+1]);
			b_in_sum += ( stackIn.b = pixels[p+2]);
			a_in_sum += ( stackIn.a = pixels[p+3]);
			
			r_sum += r_in_sum;
			g_sum += g_in_sum;
			b_sum += b_in_sum;
			a_sum += a_in_sum;
			
			stackIn = stackIn.next;
			
			r_out_sum += ( pr = stackOut.r );
			g_out_sum += ( pg = stackOut.g );
			b_out_sum += ( pb = stackOut.b );
			a_out_sum += ( pa = stackOut.a );
			
			r_in_sum -= pr;
			g_in_sum -= pg;
			b_in_sum -= pb;
			a_in_sum -= pa;
			
			stackOut = stackOut.next;

			yi += 4;
		}
		yw += width;
	}

	
	for ( x = 0; x < width; x++ )
	{
		g_in_sum = b_in_sum = a_in_sum = r_in_sum = g_sum = b_sum = a_sum = r_sum = 0;
		
		yi = x << 2;
		r_out_sum = radiusPlus1 * ( pr = pixels[yi]);
		g_out_sum = radiusPlus1 * ( pg = pixels[yi+1]);
		b_out_sum = radiusPlus1 * ( pb = pixels[yi+2]);
		a_out_sum = radiusPlus1 * ( pa = pixels[yi+3]);
		
		r_sum += sumFactor * pr;
		g_sum += sumFactor * pg;
		b_sum += sumFactor * pb;
		a_sum += sumFactor * pa;
		
		stack = stackStart;
		
		for( i = 0; i < radiusPlus1; i++ )
		{
			stack.r = pr;
			stack.g = pg;
			stack.b = pb;
			stack.a = pa;
			stack = stack.next;
		}
		
		yp = width;
		
		for( i = 1; i <= radius; i++ )
		{
			yi = ( yp + x ) << 2;
			
			r_sum += ( stack.r = ( pr = pixels[yi])) * ( rbs = radiusPlus1 - i );
			g_sum += ( stack.g = ( pg = pixels[yi+1])) * rbs;
			b_sum += ( stack.b = ( pb = pixels[yi+2])) * rbs;
			a_sum += ( stack.a = ( pa = pixels[yi+3])) * rbs;
		   
			r_in_sum += pr;
			g_in_sum += pg;
			b_in_sum += pb;
			a_in_sum += pa;
			
			stack = stack.next;
		
			if( i < heightMinus1 )
			{
				yp += width;
			}
		}
		
		yi = x;
		stackIn = stackStart;
		stackOut = stackEnd;
		for ( y = 0; y < height; y++ )
		{
			p = yi << 2;
			pixels[p+3] = pa = (a_sum * mul_sum) >> shg_sum;
			if ( pa > 0 )
			{
				pa = 255 / pa;
				pixels[p]   = ((r_sum * mul_sum) >> shg_sum ) * pa;
				pixels[p+1] = ((g_sum * mul_sum) >> shg_sum ) * pa;
				pixels[p+2] = ((b_sum * mul_sum) >> shg_sum ) * pa;
			} else {
				pixels[p] = pixels[p+1] = pixels[p+2] = 0;
			}
			
			r_sum -= r_out_sum;
			g_sum -= g_out_sum;
			b_sum -= b_out_sum;
			a_sum -= a_out_sum;
		   
			r_out_sum -= stackIn.r;
			g_out_sum -= stackIn.g;
			b_out_sum -= stackIn.b;
			a_out_sum -= stackIn.a;
			
			p = ( x + (( ( p = y + radiusPlus1) < heightMinus1 ? p : heightMinus1 ) * width )) << 2;
			
			r_sum += ( r_in_sum += ( stackIn.r = pixels[p]));
			g_sum += ( g_in_sum += ( stackIn.g = pixels[p+1]));
			b_sum += ( b_in_sum += ( stackIn.b = pixels[p+2]));
			a_sum += ( a_in_sum += ( stackIn.a = pixels[p+3]));
		   
			stackIn = stackIn.next;
			
			r_out_sum += ( pr = stackOut.r );
			g_out_sum += ( pg = stackOut.g );
			b_out_sum += ( pb = stackOut.b );
			a_out_sum += ( pa = stackOut.a );
			
			r_in_sum -= pr;
			g_in_sum -= pg;
			b_in_sum -= pb;
			a_in_sum -= pa;
			
			stackOut = stackOut.next;
			
			yi += width;
		}
	}
}

function BlurStack()
{
	this.r = 0;
	this.g = 0;
	this.b = 0;
	this.a = 0;
	this.next = null;
}

module.exports = blur;

/***/ }),

/***/ "./node_modules/style-loader/lib/addStyles.js":
/*!****************************************************!*\
  !*** ./node_modules/style-loader/lib/addStyles.js ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/

var stylesInDom = {};

var	memoize = function (fn) {
	var memo;

	return function () {
		if (typeof memo === "undefined") memo = fn.apply(this, arguments);
		return memo;
	};
};

var isOldIE = memoize(function () {
	// Test for IE <= 9 as proposed by Browserhacks
	// @see http://browserhacks.com/#hack-e71d8692f65334173fee715c222cb805
	// Tests for existence of standard globals is to allow style-loader
	// to operate correctly into non-standard environments
	// @see https://github.com/webpack-contrib/style-loader/issues/177
	return window && document && document.all && !window.atob;
});

var getTarget = function (target, parent) {
  if (parent){
    return parent.querySelector(target);
  }
  return document.querySelector(target);
};

var getElement = (function (fn) {
	var memo = {};

	return function(target, parent) {
                // If passing function in options, then use it for resolve "head" element.
                // Useful for Shadow Root style i.e
                // {
                //   insertInto: function () { return document.querySelector("#foo").shadowRoot }
                // }
                if (typeof target === 'function') {
                        return target();
                }
                if (typeof memo[target] === "undefined") {
			var styleTarget = getTarget.call(this, target, parent);
			// Special case to return head of iframe instead of iframe itself
			if (window.HTMLIFrameElement && styleTarget instanceof window.HTMLIFrameElement) {
				try {
					// This will throw an exception if access to iframe is blocked
					// due to cross-origin restrictions
					styleTarget = styleTarget.contentDocument.head;
				} catch(e) {
					styleTarget = null;
				}
			}
			memo[target] = styleTarget;
		}
		return memo[target]
	};
})();

var singleton = null;
var	singletonCounter = 0;
var	stylesInsertedAtTop = [];

var	fixUrls = __webpack_require__(/*! ./urls */ "./node_modules/style-loader/lib/urls.js");

module.exports = function(list, options) {
	if (typeof DEBUG !== "undefined" && DEBUG) {
		if (typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
	}

	options = options || {};

	options.attrs = typeof options.attrs === "object" ? options.attrs : {};

	// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
	// tags it will allow on a page
	if (!options.singleton && typeof options.singleton !== "boolean") options.singleton = isOldIE();

	// By default, add <style> tags to the <head> element
        if (!options.insertInto) options.insertInto = "head";

	// By default, add <style> tags to the bottom of the target
	if (!options.insertAt) options.insertAt = "bottom";

	var styles = listToStyles(list, options);

	addStylesToDom(styles, options);

	return function update (newList) {
		var mayRemove = [];

		for (var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];

			domStyle.refs--;
			mayRemove.push(domStyle);
		}

		if(newList) {
			var newStyles = listToStyles(newList, options);
			addStylesToDom(newStyles, options);
		}

		for (var i = 0; i < mayRemove.length; i++) {
			var domStyle = mayRemove[i];

			if(domStyle.refs === 0) {
				for (var j = 0; j < domStyle.parts.length; j++) domStyle.parts[j]();

				delete stylesInDom[domStyle.id];
			}
		}
	};
};

function addStylesToDom (styles, options) {
	for (var i = 0; i < styles.length; i++) {
		var item = styles[i];
		var domStyle = stylesInDom[item.id];

		if(domStyle) {
			domStyle.refs++;

			for(var j = 0; j < domStyle.parts.length; j++) {
				domStyle.parts[j](item.parts[j]);
			}

			for(; j < item.parts.length; j++) {
				domStyle.parts.push(addStyle(item.parts[j], options));
			}
		} else {
			var parts = [];

			for(var j = 0; j < item.parts.length; j++) {
				parts.push(addStyle(item.parts[j], options));
			}

			stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
		}
	}
}

function listToStyles (list, options) {
	var styles = [];
	var newStyles = {};

	for (var i = 0; i < list.length; i++) {
		var item = list[i];
		var id = options.base ? item[0] + options.base : item[0];
		var css = item[1];
		var media = item[2];
		var sourceMap = item[3];
		var part = {css: css, media: media, sourceMap: sourceMap};

		if(!newStyles[id]) styles.push(newStyles[id] = {id: id, parts: [part]});
		else newStyles[id].parts.push(part);
	}

	return styles;
}

function insertStyleElement (options, style) {
	var target = getElement(options.insertInto)

	if (!target) {
		throw new Error("Couldn't find a style target. This probably means that the value for the 'insertInto' parameter is invalid.");
	}

	var lastStyleElementInsertedAtTop = stylesInsertedAtTop[stylesInsertedAtTop.length - 1];

	if (options.insertAt === "top") {
		if (!lastStyleElementInsertedAtTop) {
			target.insertBefore(style, target.firstChild);
		} else if (lastStyleElementInsertedAtTop.nextSibling) {
			target.insertBefore(style, lastStyleElementInsertedAtTop.nextSibling);
		} else {
			target.appendChild(style);
		}
		stylesInsertedAtTop.push(style);
	} else if (options.insertAt === "bottom") {
		target.appendChild(style);
	} else if (typeof options.insertAt === "object" && options.insertAt.before) {
		var nextSibling = getElement(options.insertAt.before, target);
		target.insertBefore(style, nextSibling);
	} else {
		throw new Error("[Style Loader]\n\n Invalid value for parameter 'insertAt' ('options.insertAt') found.\n Must be 'top', 'bottom', or Object.\n (https://github.com/webpack-contrib/style-loader#insertat)\n");
	}
}

function removeStyleElement (style) {
	if (style.parentNode === null) return false;
	style.parentNode.removeChild(style);

	var idx = stylesInsertedAtTop.indexOf(style);
	if(idx >= 0) {
		stylesInsertedAtTop.splice(idx, 1);
	}
}

function createStyleElement (options) {
	var style = document.createElement("style");

	if(options.attrs.type === undefined) {
		options.attrs.type = "text/css";
	}

	if(options.attrs.nonce === undefined) {
		var nonce = getNonce();
		if (nonce) {
			options.attrs.nonce = nonce;
		}
	}

	addAttrs(style, options.attrs);
	insertStyleElement(options, style);

	return style;
}

function createLinkElement (options) {
	var link = document.createElement("link");

	if(options.attrs.type === undefined) {
		options.attrs.type = "text/css";
	}
	options.attrs.rel = "stylesheet";

	addAttrs(link, options.attrs);
	insertStyleElement(options, link);

	return link;
}

function addAttrs (el, attrs) {
	Object.keys(attrs).forEach(function (key) {
		el.setAttribute(key, attrs[key]);
	});
}

function getNonce() {
	if (false) {}

	return __webpack_require__.nc;
}

function addStyle (obj, options) {
	var style, update, remove, result;

	// If a transform function was defined, run it on the css
	if (options.transform && obj.css) {
	    result = typeof options.transform === 'function'
		 ? options.transform(obj.css) 
		 : options.transform.default(obj.css);

	    if (result) {
	    	// If transform returns a value, use that instead of the original css.
	    	// This allows running runtime transformations on the css.
	    	obj.css = result;
	    } else {
	    	// If the transform function returns a falsy value, don't add this css.
	    	// This allows conditional loading of css
	    	return function() {
	    		// noop
	    	};
	    }
	}

	if (options.singleton) {
		var styleIndex = singletonCounter++;

		style = singleton || (singleton = createStyleElement(options));

		update = applyToSingletonTag.bind(null, style, styleIndex, false);
		remove = applyToSingletonTag.bind(null, style, styleIndex, true);

	} else if (
		obj.sourceMap &&
		typeof URL === "function" &&
		typeof URL.createObjectURL === "function" &&
		typeof URL.revokeObjectURL === "function" &&
		typeof Blob === "function" &&
		typeof btoa === "function"
	) {
		style = createLinkElement(options);
		update = updateLink.bind(null, style, options);
		remove = function () {
			removeStyleElement(style);

			if(style.href) URL.revokeObjectURL(style.href);
		};
	} else {
		style = createStyleElement(options);
		update = applyToTag.bind(null, style);
		remove = function () {
			removeStyleElement(style);
		};
	}

	update(obj);

	return function updateStyle (newObj) {
		if (newObj) {
			if (
				newObj.css === obj.css &&
				newObj.media === obj.media &&
				newObj.sourceMap === obj.sourceMap
			) {
				return;
			}

			update(obj = newObj);
		} else {
			remove();
		}
	};
}

var replaceText = (function () {
	var textStore = [];

	return function (index, replacement) {
		textStore[index] = replacement;

		return textStore.filter(Boolean).join('\n');
	};
})();

function applyToSingletonTag (style, index, remove, obj) {
	var css = remove ? "" : obj.css;

	if (style.styleSheet) {
		style.styleSheet.cssText = replaceText(index, css);
	} else {
		var cssNode = document.createTextNode(css);
		var childNodes = style.childNodes;

		if (childNodes[index]) style.removeChild(childNodes[index]);

		if (childNodes.length) {
			style.insertBefore(cssNode, childNodes[index]);
		} else {
			style.appendChild(cssNode);
		}
	}
}

function applyToTag (style, obj) {
	var css = obj.css;
	var media = obj.media;

	if(media) {
		style.setAttribute("media", media)
	}

	if(style.styleSheet) {
		style.styleSheet.cssText = css;
	} else {
		while(style.firstChild) {
			style.removeChild(style.firstChild);
		}

		style.appendChild(document.createTextNode(css));
	}
}

function updateLink (link, options, obj) {
	var css = obj.css;
	var sourceMap = obj.sourceMap;

	/*
		If convertToAbsoluteUrls isn't defined, but sourcemaps are enabled
		and there is no publicPath defined then lets turn convertToAbsoluteUrls
		on by default.  Otherwise default to the convertToAbsoluteUrls option
		directly
	*/
	var autoFixUrls = options.convertToAbsoluteUrls === undefined && sourceMap;

	if (options.convertToAbsoluteUrls || autoFixUrls) {
		css = fixUrls(css);
	}

	if (sourceMap) {
		// http://stackoverflow.com/a/26603875
		css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
	}

	var blob = new Blob([css], { type: "text/css" });

	var oldSrc = link.href;

	link.href = URL.createObjectURL(blob);

	if(oldSrc) URL.revokeObjectURL(oldSrc);
}


/***/ }),

/***/ "./node_modules/style-loader/lib/urls.js":
/*!***********************************************!*\
  !*** ./node_modules/style-loader/lib/urls.js ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports) {


/**
 * When source maps are enabled, `style-loader` uses a link element with a data-uri to
 * embed the css on the page. This breaks all relative urls because now they are relative to a
 * bundle instead of the current page.
 *
 * One solution is to only use full urls, but that may be impossible.
 *
 * Instead, this function "fixes" the relative urls to be absolute according to the current page location.
 *
 * A rudimentary test suite is located at `test/fixUrls.js` and can be run via the `npm test` command.
 *
 */

module.exports = function (css) {
  // get current location
  var location = typeof window !== "undefined" && window.location;

  if (!location) {
    throw new Error("fixUrls requires window.location");
  }

	// blank or null?
	if (!css || typeof css !== "string") {
	  return css;
  }

  var baseUrl = location.protocol + "//" + location.host;
  var currentDir = baseUrl + location.pathname.replace(/\/[^\/]*$/, "/");

	// convert each url(...)
	/*
	This regular expression is just a way to recursively match brackets within
	a string.

	 /url\s*\(  = Match on the word "url" with any whitespace after it and then a parens
	   (  = Start a capturing group
	     (?:  = Start a non-capturing group
	         [^)(]  = Match anything that isn't a parentheses
	         |  = OR
	         \(  = Match a start parentheses
	             (?:  = Start another non-capturing groups
	                 [^)(]+  = Match anything that isn't a parentheses
	                 |  = OR
	                 \(  = Match a start parentheses
	                     [^)(]*  = Match anything that isn't a parentheses
	                 \)  = Match a end parentheses
	             )  = End Group
              *\) = Match anything and then a close parens
          )  = Close non-capturing group
          *  = Match anything
       )  = Close capturing group
	 \)  = Match a close parens

	 /gi  = Get all matches, not the first.  Be case insensitive.
	 */
	var fixedCss = css.replace(/url\s*\(((?:[^)(]|\((?:[^)(]+|\([^)(]*\))*\))*)\)/gi, function(fullMatch, origUrl) {
		// strip quotes (if they exist)
		var unquotedOrigUrl = origUrl
			.trim()
			.replace(/^"(.*)"$/, function(o, $1){ return $1; })
			.replace(/^'(.*)'$/, function(o, $1){ return $1; });

		// already a full url? no change
		if (/^(#|data:|http:\/\/|https:\/\/|file:\/\/\/|\s*$)/i.test(unquotedOrigUrl)) {
		  return fullMatch;
		}

		// convert the url to a full url
		var newUrl;

		if (unquotedOrigUrl.indexOf("//") === 0) {
		  	//TODO: should we add protocol?
			newUrl = unquotedOrigUrl;
		} else if (unquotedOrigUrl.indexOf("/") === 0) {
			// path should be relative to the base url
			newUrl = baseUrl + unquotedOrigUrl; // already starts with '/'
		} else {
			// path should be relative to current directory
			newUrl = currentDir + unquotedOrigUrl.replace(/^\.\//, ""); // Strip leading './'
		}

		// send back the fixed url(...)
		return "url(" + JSON.stringify(newUrl) + ")";
	});

	// send back the fixed css
	return fixedCss;
};


/***/ }),

/***/ "./node_modules/viz.js/viz.es.js":
/*!***************************************!*\
  !*** ./node_modules/viz.js/viz.es.js ***!
  \***************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/*
Viz.js 2.1.2 (Graphviz 2.40.1, Expat 2.2.5, Emscripten 1.37.36)
Copyright (c) 2014-2018 Michael Daines
Licensed under MIT license

This distribution contains other software in object code form:

Graphviz
Licensed under Eclipse Public License - v 1.0
http://www.graphviz.org

Expat
Copyright (c) 1998, 1999, 2000 Thai Open Source Software Center Ltd and Clark Cooper
Copyright (c) 2001, 2002, 2003, 2004, 2005, 2006 Expat maintainers.
Licensed under MIT license
http://www.libexpat.org

zlib
Copyright (C) 1995-2013 Jean-loup Gailly and Mark Adler
http://www.zlib.net/zlib_license.html
*/
var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
  return typeof obj;
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
};

var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();

var _extends = Object.assign || function (target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];

    for (var key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        target[key] = source[key];
      }
    }
  }

  return target;
};

var WorkerWrapper = function () {
  function WorkerWrapper(worker) {
    var _this = this;

    classCallCheck(this, WorkerWrapper);

    this.worker = worker;
    this.listeners = [];
    this.nextId = 0;

    this.worker.addEventListener('message', function (event) {
      var id = event.data.id;
      var error = event.data.error;
      var result = event.data.result;

      _this.listeners[id](error, result);
      delete _this.listeners[id];
    });
  }

  createClass(WorkerWrapper, [{
    key: 'render',
    value: function render(src, options) {
      var _this2 = this;

      return new Promise(function (resolve, reject) {
        var id = _this2.nextId++;

        _this2.listeners[id] = function (error, result) {
          if (error) {
            reject(new Error(error.message, error.fileName, error.lineNumber));
            return;
          }
          resolve(result);
        };

        _this2.worker.postMessage({ id: id, src: src, options: options });
      });
    }
  }]);
  return WorkerWrapper;
}();

var ModuleWrapper = function ModuleWrapper(module, render) {
  classCallCheck(this, ModuleWrapper);

  var instance = module();
  this.render = function (src, options) {
    return new Promise(function (resolve, reject) {
      try {
        resolve(render(instance, src, options));
      } catch (error) {
        reject(error);
      }
    });
  };
};

// https://developer.mozilla.org/en-US/docs/Web/API/WindowBase64/Base64_encoding_and_decoding


function b64EncodeUnicode(str) {
  return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, function (match, p1) {
    return String.fromCharCode('0x' + p1);
  }));
}

function defaultScale() {
  if ('devicePixelRatio' in window && window.devicePixelRatio > 1) {
    return window.devicePixelRatio;
  } else {
    return 1;
  }
}

function svgXmlToImageElement(svgXml) {
  var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
      _ref$scale = _ref.scale,
      scale = _ref$scale === undefined ? defaultScale() : _ref$scale,
      _ref$mimeType = _ref.mimeType,
      mimeType = _ref$mimeType === undefined ? "image/png" : _ref$mimeType,
      _ref$quality = _ref.quality,
      quality = _ref$quality === undefined ? 1 : _ref$quality;

  return new Promise(function (resolve, reject) {
    var svgImage = new Image();

    svgImage.onload = function () {
      var canvas = document.createElement('canvas');
      canvas.width = svgImage.width * scale;
      canvas.height = svgImage.height * scale;

      var context = canvas.getContext("2d");
      context.drawImage(svgImage, 0, 0, canvas.width, canvas.height);

      canvas.toBlob(function (blob) {
        var image = new Image();
        image.src = URL.createObjectURL(blob);
        image.width = svgImage.width;
        image.height = svgImage.height;

        resolve(image);
      }, mimeType, quality);
    };

    svgImage.onerror = function (e) {
      var error;

      if ('error' in e) {
        error = e.error;
      } else {
        error = new Error('Error loading SVG');
      }

      reject(error);
    };

    svgImage.src = 'data:image/svg+xml;base64,' + b64EncodeUnicode(svgXml);
  });
}

function svgXmlToImageElementFabric(svgXml) {
  var _ref2 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
      _ref2$scale = _ref2.scale,
      scale = _ref2$scale === undefined ? defaultScale() : _ref2$scale,
      _ref2$mimeType = _ref2.mimeType,
      mimeType = _ref2$mimeType === undefined ? 'image/png' : _ref2$mimeType,
      _ref2$quality = _ref2.quality,
      quality = _ref2$quality === undefined ? 1 : _ref2$quality;

  var multiplier = scale;

  var format = void 0;
  if (mimeType == 'image/jpeg') {
    format = 'jpeg';
  } else if (mimeType == 'image/png') {
    format = 'png';
  }

  return new Promise(function (resolve, reject) {
    fabric.loadSVGFromString(svgXml, function (objects, options) {
      // If there's something wrong with the SVG, Fabric may return an empty array of objects. Graphviz appears to give us at least one <g> element back even given an empty graph, so we will assume an error in this case.
      if (objects.length == 0) {
        reject(new Error('Error loading SVG with Fabric'));
      }

      var element = document.createElement("canvas");
      element.width = options.width;
      element.height = options.height;

      var canvas = new fabric.Canvas(element, { enableRetinaScaling: false });
      var obj = fabric.util.groupSVGElements(objects, options);
      canvas.add(obj).renderAll();

      var image = new Image();
      image.src = canvas.toDataURL({ format: format, multiplier: multiplier, quality: quality });
      image.width = options.width;
      image.height = options.height;

      resolve(image);
    });
  });
}

var Viz = function () {
  function Viz() {
    var _ref3 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
        workerURL = _ref3.workerURL,
        worker = _ref3.worker,
        Module = _ref3.Module,
        render = _ref3.render;

    classCallCheck(this, Viz);

    if (typeof workerURL !== 'undefined') {
      this.wrapper = new WorkerWrapper(new Worker(workerURL));
    } else if (typeof worker !== 'undefined') {
      this.wrapper = new WorkerWrapper(worker);
    } else if (typeof Module !== 'undefined' && typeof render !== 'undefined') {
      this.wrapper = new ModuleWrapper(Module, render);
    } else if (typeof Viz.Module !== 'undefined' && typeof Viz.render !== 'undefined') {
      this.wrapper = new ModuleWrapper(Viz.Module, Viz.render);
    } else {
      throw new Error('Must specify workerURL or worker option, Module and render options, or include one of full.render.js or lite.render.js after viz.js.');
    }
  }

  createClass(Viz, [{
    key: 'renderString',
    value: function renderString(src) {
      var _ref4 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
          _ref4$format = _ref4.format,
          format = _ref4$format === undefined ? 'svg' : _ref4$format,
          _ref4$engine = _ref4.engine,
          engine = _ref4$engine === undefined ? 'dot' : _ref4$engine,
          _ref4$files = _ref4.files,
          files = _ref4$files === undefined ? [] : _ref4$files,
          _ref4$images = _ref4.images,
          images = _ref4$images === undefined ? [] : _ref4$images,
          _ref4$yInvert = _ref4.yInvert,
          yInvert = _ref4$yInvert === undefined ? false : _ref4$yInvert,
          _ref4$nop = _ref4.nop,
          nop = _ref4$nop === undefined ? 0 : _ref4$nop;

      for (var i = 0; i < images.length; i++) {
        files.push({
          path: images[i].path,
          data: '<?xml version="1.0" encoding="UTF-8" standalone="no"?>\n<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">\n<svg width="' + images[i].width + '" height="' + images[i].height + '"></svg>'
        });
      }

      return this.wrapper.render(src, { format: format, engine: engine, files: files, images: images, yInvert: yInvert, nop: nop });
    }
  }, {
    key: 'renderSVGElement',
    value: function renderSVGElement(src) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      return this.renderString(src, _extends({}, options, { format: 'svg' })).then(function (str) {
        var parser = new DOMParser();
        return parser.parseFromString(str, 'image/svg+xml').documentElement;
      });
    }
  }, {
    key: 'renderImageElement',
    value: function renderImageElement(src) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var scale = options.scale,
          mimeType = options.mimeType,
          quality = options.quality;


      return this.renderString(src, _extends({}, options, { format: 'svg' })).then(function (str) {
        if ((typeof fabric === 'undefined' ? 'undefined' : _typeof(fabric)) === "object" && fabric.loadSVGFromString) {
          return svgXmlToImageElementFabric(str, { scale: scale, mimeType: mimeType, quality: quality });
        } else {
          return svgXmlToImageElement(str, { scale: scale, mimeType: mimeType, quality: quality });
        }
      });
    }
  }, {
    key: 'renderJSONObject',
    value: function renderJSONObject(src) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var format = options.format;


      if (format !== 'json' || format !== 'json0') {
        format = 'json';
      }

      return this.renderString(src, _extends({}, options, { format: format })).then(function (str) {
        return JSON.parse(str);
      });
    }
  }]);
  return Viz;
}();

/* harmony default export */ __webpack_exports__["default"] = (Viz);


/***/ }),

/***/ "./node_modules/xmldom/dom-parser.js":
/*!*******************************************!*\
  !*** ./node_modules/xmldom/dom-parser.js ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

function DOMParser(options){
	this.options = options ||{locator:{}};
	
}
DOMParser.prototype.parseFromString = function(source,mimeType){
	var options = this.options;
	var sax =  new XMLReader();
	var domBuilder = options.domBuilder || new DOMHandler();//contentHandler and LexicalHandler
	var errorHandler = options.errorHandler;
	var locator = options.locator;
	var defaultNSMap = options.xmlns||{};
	var entityMap = {'lt':'<','gt':'>','amp':'&','quot':'"','apos':"'"}
	if(locator){
		domBuilder.setDocumentLocator(locator)
	}
	
	sax.errorHandler = buildErrorHandler(errorHandler,domBuilder,locator);
	sax.domBuilder = options.domBuilder || domBuilder;
	if(/\/x?html?$/.test(mimeType)){
		entityMap.nbsp = '\xa0';
		entityMap.copy = '\xa9';
		defaultNSMap['']= 'http://www.w3.org/1999/xhtml';
	}
	defaultNSMap.xml = defaultNSMap.xml || 'http://www.w3.org/XML/1998/namespace';
	if(source){
		sax.parse(source,defaultNSMap,entityMap);
	}else{
		sax.errorHandler.error("invalid doc source");
	}
	return domBuilder.doc;
}
function buildErrorHandler(errorImpl,domBuilder,locator){
	if(!errorImpl){
		if(domBuilder instanceof DOMHandler){
			return domBuilder;
		}
		errorImpl = domBuilder ;
	}
	var errorHandler = {}
	var isCallback = errorImpl instanceof Function;
	locator = locator||{}
	function build(key){
		var fn = errorImpl[key];
		if(!fn && isCallback){
			fn = errorImpl.length == 2?function(msg){errorImpl(key,msg)}:errorImpl;
		}
		errorHandler[key] = fn && function(msg){
			fn('[xmldom '+key+']\t'+msg+_locator(locator));
		}||function(){};
	}
	build('warning');
	build('error');
	build('fatalError');
	return errorHandler;
}

//console.log('#\n\n\n\n\n\n\n####')
/**
 * +ContentHandler+ErrorHandler
 * +LexicalHandler+EntityResolver2
 * -DeclHandler-DTDHandler 
 * 
 * DefaultHandler:EntityResolver, DTDHandler, ContentHandler, ErrorHandler
 * DefaultHandler2:DefaultHandler,LexicalHandler, DeclHandler, EntityResolver2
 * @link http://www.saxproject.org/apidoc/org/xml/sax/helpers/DefaultHandler.html
 */
function DOMHandler() {
    this.cdata = false;
}
function position(locator,node){
	node.lineNumber = locator.lineNumber;
	node.columnNumber = locator.columnNumber;
}
/**
 * @see org.xml.sax.ContentHandler#startDocument
 * @link http://www.saxproject.org/apidoc/org/xml/sax/ContentHandler.html
 */ 
DOMHandler.prototype = {
	startDocument : function() {
    	this.doc = new DOMImplementation().createDocument(null, null, null);
    	if (this.locator) {
        	this.doc.documentURI = this.locator.systemId;
    	}
	},
	startElement:function(namespaceURI, localName, qName, attrs) {
		var doc = this.doc;
	    var el = doc.createElementNS(namespaceURI, qName||localName);
	    var len = attrs.length;
	    appendElement(this, el);
	    this.currentElement = el;
	    
		this.locator && position(this.locator,el)
	    for (var i = 0 ; i < len; i++) {
	        var namespaceURI = attrs.getURI(i);
	        var value = attrs.getValue(i);
	        var qName = attrs.getQName(i);
			var attr = doc.createAttributeNS(namespaceURI, qName);
			this.locator &&position(attrs.getLocator(i),attr);
			attr.value = attr.nodeValue = value;
			el.setAttributeNode(attr)
	    }
	},
	endElement:function(namespaceURI, localName, qName) {
		var current = this.currentElement
		var tagName = current.tagName;
		this.currentElement = current.parentNode;
	},
	startPrefixMapping:function(prefix, uri) {
	},
	endPrefixMapping:function(prefix) {
	},
	processingInstruction:function(target, data) {
	    var ins = this.doc.createProcessingInstruction(target, data);
	    this.locator && position(this.locator,ins)
	    appendElement(this, ins);
	},
	ignorableWhitespace:function(ch, start, length) {
	},
	characters:function(chars, start, length) {
		chars = _toString.apply(this,arguments)
		//console.log(chars)
		if(chars){
			if (this.cdata) {
				var charNode = this.doc.createCDATASection(chars);
			} else {
				var charNode = this.doc.createTextNode(chars);
			}
			if(this.currentElement){
				this.currentElement.appendChild(charNode);
			}else if(/^\s*$/.test(chars)){
				this.doc.appendChild(charNode);
				//process xml
			}
			this.locator && position(this.locator,charNode)
		}
	},
	skippedEntity:function(name) {
	},
	endDocument:function() {
		this.doc.normalize();
	},
	setDocumentLocator:function (locator) {
	    if(this.locator = locator){// && !('lineNumber' in locator)){
	    	locator.lineNumber = 0;
	    }
	},
	//LexicalHandler
	comment:function(chars, start, length) {
		chars = _toString.apply(this,arguments)
	    var comm = this.doc.createComment(chars);
	    this.locator && position(this.locator,comm)
	    appendElement(this, comm);
	},
	
	startCDATA:function() {
	    //used in characters() methods
	    this.cdata = true;
	},
	endCDATA:function() {
	    this.cdata = false;
	},
	
	startDTD:function(name, publicId, systemId) {
		var impl = this.doc.implementation;
	    if (impl && impl.createDocumentType) {
	        var dt = impl.createDocumentType(name, publicId, systemId);
	        this.locator && position(this.locator,dt)
	        appendElement(this, dt);
	    }
	},
	/**
	 * @see org.xml.sax.ErrorHandler
	 * @link http://www.saxproject.org/apidoc/org/xml/sax/ErrorHandler.html
	 */
	warning:function(error) {
		console.warn('[xmldom warning]\t'+error,_locator(this.locator));
	},
	error:function(error) {
		console.error('[xmldom error]\t'+error,_locator(this.locator));
	},
	fatalError:function(error) {
		console.error('[xmldom fatalError]\t'+error,_locator(this.locator));
	    throw error;
	}
}
function _locator(l){
	if(l){
		return '\n@'+(l.systemId ||'')+'#[line:'+l.lineNumber+',col:'+l.columnNumber+']'
	}
}
function _toString(chars,start,length){
	if(typeof chars == 'string'){
		return chars.substr(start,length)
	}else{//java sax connect width xmldom on rhino(what about: "? && !(chars instanceof String)")
		if(chars.length >= start+length || start){
			return new java.lang.String(chars,start,length)+'';
		}
		return chars;
	}
}

/*
 * @link http://www.saxproject.org/apidoc/org/xml/sax/ext/LexicalHandler.html
 * used method of org.xml.sax.ext.LexicalHandler:
 *  #comment(chars, start, length)
 *  #startCDATA()
 *  #endCDATA()
 *  #startDTD(name, publicId, systemId)
 *
 *
 * IGNORED method of org.xml.sax.ext.LexicalHandler:
 *  #endDTD()
 *  #startEntity(name)
 *  #endEntity(name)
 *
 *
 * @link http://www.saxproject.org/apidoc/org/xml/sax/ext/DeclHandler.html
 * IGNORED method of org.xml.sax.ext.DeclHandler
 * 	#attributeDecl(eName, aName, type, mode, value)
 *  #elementDecl(name, model)
 *  #externalEntityDecl(name, publicId, systemId)
 *  #internalEntityDecl(name, value)
 * @link http://www.saxproject.org/apidoc/org/xml/sax/ext/EntityResolver2.html
 * IGNORED method of org.xml.sax.EntityResolver2
 *  #resolveEntity(String name,String publicId,String baseURI,String systemId)
 *  #resolveEntity(publicId, systemId)
 *  #getExternalSubset(name, baseURI)
 * @link http://www.saxproject.org/apidoc/org/xml/sax/DTDHandler.html
 * IGNORED method of org.xml.sax.DTDHandler
 *  #notationDecl(name, publicId, systemId) {};
 *  #unparsedEntityDecl(name, publicId, systemId, notationName) {};
 */
"endDTD,startEntity,endEntity,attributeDecl,elementDecl,externalEntityDecl,internalEntityDecl,resolveEntity,getExternalSubset,notationDecl,unparsedEntityDecl".replace(/\w+/g,function(key){
	DOMHandler.prototype[key] = function(){return null}
})

/* Private static helpers treated below as private instance methods, so don't need to add these to the public API; we might use a Relator to also get rid of non-standard public properties */
function appendElement (hander,node) {
    if (!hander.currentElement) {
        hander.doc.appendChild(node);
    } else {
        hander.currentElement.appendChild(node);
    }
}//appendChild and setAttributeNS are preformance key

//if(typeof require == 'function'){
	var XMLReader = __webpack_require__(/*! ./sax */ "./node_modules/xmldom/sax.js").XMLReader;
	var DOMImplementation = exports.DOMImplementation = __webpack_require__(/*! ./dom */ "./node_modules/xmldom/dom.js").DOMImplementation;
	exports.XMLSerializer = __webpack_require__(/*! ./dom */ "./node_modules/xmldom/dom.js").XMLSerializer ;
	exports.DOMParser = DOMParser;
//}


/***/ }),

/***/ "./node_modules/xmldom/dom.js":
/*!************************************!*\
  !*** ./node_modules/xmldom/dom.js ***!
  \************************************/
/*! no static exports found */
/***/ (function(module, exports) {

/*
 * DOM Level 2
 * Object DOMException
 * @see http://www.w3.org/TR/REC-DOM-Level-1/ecma-script-language-binding.html
 * @see http://www.w3.org/TR/2000/REC-DOM-Level-2-Core-20001113/ecma-script-binding.html
 */

function copy(src,dest){
	for(var p in src){
		dest[p] = src[p];
	}
}
/**
^\w+\.prototype\.([_\w]+)\s*=\s*((?:.*\{\s*?[\r\n][\s\S]*?^})|\S.*?(?=[;\r\n]));?
^\w+\.prototype\.([_\w]+)\s*=\s*(\S.*?(?=[;\r\n]));?
 */
function _extends(Class,Super){
	var pt = Class.prototype;
	if(Object.create){
		var ppt = Object.create(Super.prototype)
		pt.__proto__ = ppt;
	}
	if(!(pt instanceof Super)){
		function t(){};
		t.prototype = Super.prototype;
		t = new t();
		copy(pt,t);
		Class.prototype = pt = t;
	}
	if(pt.constructor != Class){
		if(typeof Class != 'function'){
			console.error("unknow Class:"+Class)
		}
		pt.constructor = Class
	}
}
var htmlns = 'http://www.w3.org/1999/xhtml' ;
// Node Types
var NodeType = {}
var ELEMENT_NODE                = NodeType.ELEMENT_NODE                = 1;
var ATTRIBUTE_NODE              = NodeType.ATTRIBUTE_NODE              = 2;
var TEXT_NODE                   = NodeType.TEXT_NODE                   = 3;
var CDATA_SECTION_NODE          = NodeType.CDATA_SECTION_NODE          = 4;
var ENTITY_REFERENCE_NODE       = NodeType.ENTITY_REFERENCE_NODE       = 5;
var ENTITY_NODE                 = NodeType.ENTITY_NODE                 = 6;
var PROCESSING_INSTRUCTION_NODE = NodeType.PROCESSING_INSTRUCTION_NODE = 7;
var COMMENT_NODE                = NodeType.COMMENT_NODE                = 8;
var DOCUMENT_NODE               = NodeType.DOCUMENT_NODE               = 9;
var DOCUMENT_TYPE_NODE          = NodeType.DOCUMENT_TYPE_NODE          = 10;
var DOCUMENT_FRAGMENT_NODE      = NodeType.DOCUMENT_FRAGMENT_NODE      = 11;
var NOTATION_NODE               = NodeType.NOTATION_NODE               = 12;

// ExceptionCode
var ExceptionCode = {}
var ExceptionMessage = {};
var INDEX_SIZE_ERR              = ExceptionCode.INDEX_SIZE_ERR              = ((ExceptionMessage[1]="Index size error"),1);
var DOMSTRING_SIZE_ERR          = ExceptionCode.DOMSTRING_SIZE_ERR          = ((ExceptionMessage[2]="DOMString size error"),2);
var HIERARCHY_REQUEST_ERR       = ExceptionCode.HIERARCHY_REQUEST_ERR       = ((ExceptionMessage[3]="Hierarchy request error"),3);
var WRONG_DOCUMENT_ERR          = ExceptionCode.WRONG_DOCUMENT_ERR          = ((ExceptionMessage[4]="Wrong document"),4);
var INVALID_CHARACTER_ERR       = ExceptionCode.INVALID_CHARACTER_ERR       = ((ExceptionMessage[5]="Invalid character"),5);
var NO_DATA_ALLOWED_ERR         = ExceptionCode.NO_DATA_ALLOWED_ERR         = ((ExceptionMessage[6]="No data allowed"),6);
var NO_MODIFICATION_ALLOWED_ERR = ExceptionCode.NO_MODIFICATION_ALLOWED_ERR = ((ExceptionMessage[7]="No modification allowed"),7);
var NOT_FOUND_ERR               = ExceptionCode.NOT_FOUND_ERR               = ((ExceptionMessage[8]="Not found"),8);
var NOT_SUPPORTED_ERR           = ExceptionCode.NOT_SUPPORTED_ERR           = ((ExceptionMessage[9]="Not supported"),9);
var INUSE_ATTRIBUTE_ERR         = ExceptionCode.INUSE_ATTRIBUTE_ERR         = ((ExceptionMessage[10]="Attribute in use"),10);
//level2
var INVALID_STATE_ERR        	= ExceptionCode.INVALID_STATE_ERR        	= ((ExceptionMessage[11]="Invalid state"),11);
var SYNTAX_ERR               	= ExceptionCode.SYNTAX_ERR               	= ((ExceptionMessage[12]="Syntax error"),12);
var INVALID_MODIFICATION_ERR 	= ExceptionCode.INVALID_MODIFICATION_ERR 	= ((ExceptionMessage[13]="Invalid modification"),13);
var NAMESPACE_ERR            	= ExceptionCode.NAMESPACE_ERR           	= ((ExceptionMessage[14]="Invalid namespace"),14);
var INVALID_ACCESS_ERR       	= ExceptionCode.INVALID_ACCESS_ERR      	= ((ExceptionMessage[15]="Invalid access"),15);


function DOMException(code, message) {
	if(message instanceof Error){
		var error = message;
	}else{
		error = this;
		Error.call(this, ExceptionMessage[code]);
		this.message = ExceptionMessage[code];
		if(Error.captureStackTrace) Error.captureStackTrace(this, DOMException);
	}
	error.code = code;
	if(message) this.message = this.message + ": " + message;
	return error;
};
DOMException.prototype = Error.prototype;
copy(ExceptionCode,DOMException)
/**
 * @see http://www.w3.org/TR/2000/REC-DOM-Level-2-Core-20001113/core.html#ID-536297177
 * The NodeList interface provides the abstraction of an ordered collection of nodes, without defining or constraining how this collection is implemented. NodeList objects in the DOM are live.
 * The items in the NodeList are accessible via an integral index, starting from 0.
 */
function NodeList() {
};
NodeList.prototype = {
	/**
	 * The number of nodes in the list. The range of valid child node indices is 0 to length-1 inclusive.
	 * @standard level1
	 */
	length:0, 
	/**
	 * Returns the indexth item in the collection. If index is greater than or equal to the number of nodes in the list, this returns null.
	 * @standard level1
	 * @param index  unsigned long 
	 *   Index into the collection.
	 * @return Node
	 * 	The node at the indexth position in the NodeList, or null if that is not a valid index. 
	 */
	item: function(index) {
		return this[index] || null;
	},
	toString:function(isHTML,nodeFilter){
		for(var buf = [], i = 0;i<this.length;i++){
			serializeToString(this[i],buf,isHTML,nodeFilter);
		}
		return buf.join('');
	}
};
function LiveNodeList(node,refresh){
	this._node = node;
	this._refresh = refresh
	_updateLiveList(this);
}
function _updateLiveList(list){
	var inc = list._node._inc || list._node.ownerDocument._inc;
	if(list._inc != inc){
		var ls = list._refresh(list._node);
		//console.log(ls.length)
		__set__(list,'length',ls.length);
		copy(ls,list);
		list._inc = inc;
	}
}
LiveNodeList.prototype.item = function(i){
	_updateLiveList(this);
	return this[i];
}

_extends(LiveNodeList,NodeList);
/**
 * 
 * Objects implementing the NamedNodeMap interface are used to represent collections of nodes that can be accessed by name. Note that NamedNodeMap does not inherit from NodeList; NamedNodeMaps are not maintained in any particular order. Objects contained in an object implementing NamedNodeMap may also be accessed by an ordinal index, but this is simply to allow convenient enumeration of the contents of a NamedNodeMap, and does not imply that the DOM specifies an order to these Nodes.
 * NamedNodeMap objects in the DOM are live.
 * used for attributes or DocumentType entities 
 */
function NamedNodeMap() {
};

function _findNodeIndex(list,node){
	var i = list.length;
	while(i--){
		if(list[i] === node){return i}
	}
}

function _addNamedNode(el,list,newAttr,oldAttr){
	if(oldAttr){
		list[_findNodeIndex(list,oldAttr)] = newAttr;
	}else{
		list[list.length++] = newAttr;
	}
	if(el){
		newAttr.ownerElement = el;
		var doc = el.ownerDocument;
		if(doc){
			oldAttr && _onRemoveAttribute(doc,el,oldAttr);
			_onAddAttribute(doc,el,newAttr);
		}
	}
}
function _removeNamedNode(el,list,attr){
	//console.log('remove attr:'+attr)
	var i = _findNodeIndex(list,attr);
	if(i>=0){
		var lastIndex = list.length-1
		while(i<lastIndex){
			list[i] = list[++i]
		}
		list.length = lastIndex;
		if(el){
			var doc = el.ownerDocument;
			if(doc){
				_onRemoveAttribute(doc,el,attr);
				attr.ownerElement = null;
			}
		}
	}else{
		throw DOMException(NOT_FOUND_ERR,new Error(el.tagName+'@'+attr))
	}
}
NamedNodeMap.prototype = {
	length:0,
	item:NodeList.prototype.item,
	getNamedItem: function(key) {
//		if(key.indexOf(':')>0 || key == 'xmlns'){
//			return null;
//		}
		//console.log()
		var i = this.length;
		while(i--){
			var attr = this[i];
			//console.log(attr.nodeName,key)
			if(attr.nodeName == key){
				return attr;
			}
		}
	},
	setNamedItem: function(attr) {
		var el = attr.ownerElement;
		if(el && el!=this._ownerElement){
			throw new DOMException(INUSE_ATTRIBUTE_ERR);
		}
		var oldAttr = this.getNamedItem(attr.nodeName);
		_addNamedNode(this._ownerElement,this,attr,oldAttr);
		return oldAttr;
	},
	/* returns Node */
	setNamedItemNS: function(attr) {// raises: WRONG_DOCUMENT_ERR,NO_MODIFICATION_ALLOWED_ERR,INUSE_ATTRIBUTE_ERR
		var el = attr.ownerElement, oldAttr;
		if(el && el!=this._ownerElement){
			throw new DOMException(INUSE_ATTRIBUTE_ERR);
		}
		oldAttr = this.getNamedItemNS(attr.namespaceURI,attr.localName);
		_addNamedNode(this._ownerElement,this,attr,oldAttr);
		return oldAttr;
	},

	/* returns Node */
	removeNamedItem: function(key) {
		var attr = this.getNamedItem(key);
		_removeNamedNode(this._ownerElement,this,attr);
		return attr;
		
		
	},// raises: NOT_FOUND_ERR,NO_MODIFICATION_ALLOWED_ERR
	
	//for level2
	removeNamedItemNS:function(namespaceURI,localName){
		var attr = this.getNamedItemNS(namespaceURI,localName);
		_removeNamedNode(this._ownerElement,this,attr);
		return attr;
	},
	getNamedItemNS: function(namespaceURI, localName) {
		var i = this.length;
		while(i--){
			var node = this[i];
			if(node.localName == localName && node.namespaceURI == namespaceURI){
				return node;
			}
		}
		return null;
	}
};
/**
 * @see http://www.w3.org/TR/REC-DOM-Level-1/level-one-core.html#ID-102161490
 */
function DOMImplementation(/* Object */ features) {
	this._features = {};
	if (features) {
		for (var feature in features) {
			 this._features = features[feature];
		}
	}
};

DOMImplementation.prototype = {
	hasFeature: function(/* string */ feature, /* string */ version) {
		var versions = this._features[feature.toLowerCase()];
		if (versions && (!version || version in versions)) {
			return true;
		} else {
			return false;
		}
	},
	// Introduced in DOM Level 2:
	createDocument:function(namespaceURI,  qualifiedName, doctype){// raises:INVALID_CHARACTER_ERR,NAMESPACE_ERR,WRONG_DOCUMENT_ERR
		var doc = new Document();
		doc.implementation = this;
		doc.childNodes = new NodeList();
		doc.doctype = doctype;
		if(doctype){
			doc.appendChild(doctype);
		}
		if(qualifiedName){
			var root = doc.createElementNS(namespaceURI,qualifiedName);
			doc.appendChild(root);
		}
		return doc;
	},
	// Introduced in DOM Level 2:
	createDocumentType:function(qualifiedName, publicId, systemId){// raises:INVALID_CHARACTER_ERR,NAMESPACE_ERR
		var node = new DocumentType();
		node.name = qualifiedName;
		node.nodeName = qualifiedName;
		node.publicId = publicId;
		node.systemId = systemId;
		// Introduced in DOM Level 2:
		//readonly attribute DOMString        internalSubset;
		
		//TODO:..
		//  readonly attribute NamedNodeMap     entities;
		//  readonly attribute NamedNodeMap     notations;
		return node;
	}
};


/**
 * @see http://www.w3.org/TR/2000/REC-DOM-Level-2-Core-20001113/core.html#ID-1950641247
 */

function Node() {
};

Node.prototype = {
	firstChild : null,
	lastChild : null,
	previousSibling : null,
	nextSibling : null,
	attributes : null,
	parentNode : null,
	childNodes : null,
	ownerDocument : null,
	nodeValue : null,
	namespaceURI : null,
	prefix : null,
	localName : null,
	// Modified in DOM Level 2:
	insertBefore:function(newChild, refChild){//raises 
		return _insertBefore(this,newChild,refChild);
	},
	replaceChild:function(newChild, oldChild){//raises 
		this.insertBefore(newChild,oldChild);
		if(oldChild){
			this.removeChild(oldChild);
		}
	},
	removeChild:function(oldChild){
		return _removeChild(this,oldChild);
	},
	appendChild:function(newChild){
		return this.insertBefore(newChild,null);
	},
	hasChildNodes:function(){
		return this.firstChild != null;
	},
	cloneNode:function(deep){
		return cloneNode(this.ownerDocument||this,this,deep);
	},
	// Modified in DOM Level 2:
	normalize:function(){
		var child = this.firstChild;
		while(child){
			var next = child.nextSibling;
			if(next && next.nodeType == TEXT_NODE && child.nodeType == TEXT_NODE){
				this.removeChild(next);
				child.appendData(next.data);
			}else{
				child.normalize();
				child = next;
			}
		}
	},
  	// Introduced in DOM Level 2:
	isSupported:function(feature, version){
		return this.ownerDocument.implementation.hasFeature(feature,version);
	},
    // Introduced in DOM Level 2:
    hasAttributes:function(){
    	return this.attributes.length>0;
    },
    lookupPrefix:function(namespaceURI){
    	var el = this;
    	while(el){
    		var map = el._nsMap;
    		//console.dir(map)
    		if(map){
    			for(var n in map){
    				if(map[n] == namespaceURI){
    					return n;
    				}
    			}
    		}
    		el = el.nodeType == ATTRIBUTE_NODE?el.ownerDocument : el.parentNode;
    	}
    	return null;
    },
    // Introduced in DOM Level 3:
    lookupNamespaceURI:function(prefix){
    	var el = this;
    	while(el){
    		var map = el._nsMap;
    		//console.dir(map)
    		if(map){
    			if(prefix in map){
    				return map[prefix] ;
    			}
    		}
    		el = el.nodeType == ATTRIBUTE_NODE?el.ownerDocument : el.parentNode;
    	}
    	return null;
    },
    // Introduced in DOM Level 3:
    isDefaultNamespace:function(namespaceURI){
    	var prefix = this.lookupPrefix(namespaceURI);
    	return prefix == null;
    }
};


function _xmlEncoder(c){
	return c == '<' && '&lt;' ||
         c == '>' && '&gt;' ||
         c == '&' && '&amp;' ||
         c == '"' && '&quot;' ||
         '&#'+c.charCodeAt()+';'
}


copy(NodeType,Node);
copy(NodeType,Node.prototype);

/**
 * @param callback return true for continue,false for break
 * @return boolean true: break visit;
 */
function _visitNode(node,callback){
	if(callback(node)){
		return true;
	}
	if(node = node.firstChild){
		do{
			if(_visitNode(node,callback)){return true}
        }while(node=node.nextSibling)
    }
}



function Document(){
}
function _onAddAttribute(doc,el,newAttr){
	doc && doc._inc++;
	var ns = newAttr.namespaceURI ;
	if(ns == 'http://www.w3.org/2000/xmlns/'){
		//update namespace
		el._nsMap[newAttr.prefix?newAttr.localName:''] = newAttr.value
	}
}
function _onRemoveAttribute(doc,el,newAttr,remove){
	doc && doc._inc++;
	var ns = newAttr.namespaceURI ;
	if(ns == 'http://www.w3.org/2000/xmlns/'){
		//update namespace
		delete el._nsMap[newAttr.prefix?newAttr.localName:'']
	}
}
function _onUpdateChild(doc,el,newChild){
	if(doc && doc._inc){
		doc._inc++;
		//update childNodes
		var cs = el.childNodes;
		if(newChild){
			cs[cs.length++] = newChild;
		}else{
			//console.log(1)
			var child = el.firstChild;
			var i = 0;
			while(child){
				cs[i++] = child;
				child =child.nextSibling;
			}
			cs.length = i;
		}
	}
}

/**
 * attributes;
 * children;
 * 
 * writeable properties:
 * nodeValue,Attr:value,CharacterData:data
 * prefix
 */
function _removeChild(parentNode,child){
	var previous = child.previousSibling;
	var next = child.nextSibling;
	if(previous){
		previous.nextSibling = next;
	}else{
		parentNode.firstChild = next
	}
	if(next){
		next.previousSibling = previous;
	}else{
		parentNode.lastChild = previous;
	}
	_onUpdateChild(parentNode.ownerDocument,parentNode);
	return child;
}
/**
 * preformance key(refChild == null)
 */
function _insertBefore(parentNode,newChild,nextChild){
	var cp = newChild.parentNode;
	if(cp){
		cp.removeChild(newChild);//remove and update
	}
	if(newChild.nodeType === DOCUMENT_FRAGMENT_NODE){
		var newFirst = newChild.firstChild;
		if (newFirst == null) {
			return newChild;
		}
		var newLast = newChild.lastChild;
	}else{
		newFirst = newLast = newChild;
	}
	var pre = nextChild ? nextChild.previousSibling : parentNode.lastChild;

	newFirst.previousSibling = pre;
	newLast.nextSibling = nextChild;
	
	
	if(pre){
		pre.nextSibling = newFirst;
	}else{
		parentNode.firstChild = newFirst;
	}
	if(nextChild == null){
		parentNode.lastChild = newLast;
	}else{
		nextChild.previousSibling = newLast;
	}
	do{
		newFirst.parentNode = parentNode;
	}while(newFirst !== newLast && (newFirst= newFirst.nextSibling))
	_onUpdateChild(parentNode.ownerDocument||parentNode,parentNode);
	//console.log(parentNode.lastChild.nextSibling == null)
	if (newChild.nodeType == DOCUMENT_FRAGMENT_NODE) {
		newChild.firstChild = newChild.lastChild = null;
	}
	return newChild;
}
function _appendSingleChild(parentNode,newChild){
	var cp = newChild.parentNode;
	if(cp){
		var pre = parentNode.lastChild;
		cp.removeChild(newChild);//remove and update
		var pre = parentNode.lastChild;
	}
	var pre = parentNode.lastChild;
	newChild.parentNode = parentNode;
	newChild.previousSibling = pre;
	newChild.nextSibling = null;
	if(pre){
		pre.nextSibling = newChild;
	}else{
		parentNode.firstChild = newChild;
	}
	parentNode.lastChild = newChild;
	_onUpdateChild(parentNode.ownerDocument,parentNode,newChild);
	return newChild;
	//console.log("__aa",parentNode.lastChild.nextSibling == null)
}
Document.prototype = {
	//implementation : null,
	nodeName :  '#document',
	nodeType :  DOCUMENT_NODE,
	doctype :  null,
	documentElement :  null,
	_inc : 1,
	
	insertBefore :  function(newChild, refChild){//raises 
		if(newChild.nodeType == DOCUMENT_FRAGMENT_NODE){
			var child = newChild.firstChild;
			while(child){
				var next = child.nextSibling;
				this.insertBefore(child,refChild);
				child = next;
			}
			return newChild;
		}
		if(this.documentElement == null && newChild.nodeType == ELEMENT_NODE){
			this.documentElement = newChild;
		}
		
		return _insertBefore(this,newChild,refChild),(newChild.ownerDocument = this),newChild;
	},
	removeChild :  function(oldChild){
		if(this.documentElement == oldChild){
			this.documentElement = null;
		}
		return _removeChild(this,oldChild);
	},
	// Introduced in DOM Level 2:
	importNode : function(importedNode,deep){
		return importNode(this,importedNode,deep);
	},
	// Introduced in DOM Level 2:
	getElementById :	function(id){
		var rtv = null;
		_visitNode(this.documentElement,function(node){
			if(node.nodeType == ELEMENT_NODE){
				if(node.getAttribute('id') == id){
					rtv = node;
					return true;
				}
			}
		})
		return rtv;
	},
	
	//document factory method:
	createElement :	function(tagName){
		var node = new Element();
		node.ownerDocument = this;
		node.nodeName = tagName;
		node.tagName = tagName;
		node.childNodes = new NodeList();
		var attrs	= node.attributes = new NamedNodeMap();
		attrs._ownerElement = node;
		return node;
	},
	createDocumentFragment :	function(){
		var node = new DocumentFragment();
		node.ownerDocument = this;
		node.childNodes = new NodeList();
		return node;
	},
	createTextNode :	function(data){
		var node = new Text();
		node.ownerDocument = this;
		node.appendData(data)
		return node;
	},
	createComment :	function(data){
		var node = new Comment();
		node.ownerDocument = this;
		node.appendData(data)
		return node;
	},
	createCDATASection :	function(data){
		var node = new CDATASection();
		node.ownerDocument = this;
		node.appendData(data)
		return node;
	},
	createProcessingInstruction :	function(target,data){
		var node = new ProcessingInstruction();
		node.ownerDocument = this;
		node.tagName = node.target = target;
		node.nodeValue= node.data = data;
		return node;
	},
	createAttribute :	function(name){
		var node = new Attr();
		node.ownerDocument	= this;
		node.name = name;
		node.nodeName	= name;
		node.localName = name;
		node.specified = true;
		return node;
	},
	createEntityReference :	function(name){
		var node = new EntityReference();
		node.ownerDocument	= this;
		node.nodeName	= name;
		return node;
	},
	// Introduced in DOM Level 2:
	createElementNS :	function(namespaceURI,qualifiedName){
		var node = new Element();
		var pl = qualifiedName.split(':');
		var attrs	= node.attributes = new NamedNodeMap();
		node.childNodes = new NodeList();
		node.ownerDocument = this;
		node.nodeName = qualifiedName;
		node.tagName = qualifiedName;
		node.namespaceURI = namespaceURI;
		if(pl.length == 2){
			node.prefix = pl[0];
			node.localName = pl[1];
		}else{
			//el.prefix = null;
			node.localName = qualifiedName;
		}
		attrs._ownerElement = node;
		return node;
	},
	// Introduced in DOM Level 2:
	createAttributeNS :	function(namespaceURI,qualifiedName){
		var node = new Attr();
		var pl = qualifiedName.split(':');
		node.ownerDocument = this;
		node.nodeName = qualifiedName;
		node.name = qualifiedName;
		node.namespaceURI = namespaceURI;
		node.specified = true;
		if(pl.length == 2){
			node.prefix = pl[0];
			node.localName = pl[1];
		}else{
			//el.prefix = null;
			node.localName = qualifiedName;
		}
		return node;
	}
};
_extends(Document,Node);


function Element() {
	this._nsMap = {};
};
Element.prototype = {
	nodeType : ELEMENT_NODE,
	hasAttribute : function(name){
		return this.getAttributeNode(name)!=null;
	},
	getAttribute : function(name){
		var attr = this.getAttributeNode(name);
		return attr && attr.value || '';
	},
	getAttributeNode : function(name){
		return this.attributes.getNamedItem(name);
	},
	setAttribute : function(name, value){
		var attr = this.ownerDocument.createAttribute(name);
		attr.value = attr.nodeValue = "" + value;
		this.setAttributeNode(attr)
	},
	removeAttribute : function(name){
		var attr = this.getAttributeNode(name)
		attr && this.removeAttributeNode(attr);
	},
	
	//four real opeartion method
	appendChild:function(newChild){
		if(newChild.nodeType === DOCUMENT_FRAGMENT_NODE){
			return this.insertBefore(newChild,null);
		}else{
			return _appendSingleChild(this,newChild);
		}
	},
	setAttributeNode : function(newAttr){
		return this.attributes.setNamedItem(newAttr);
	},
	setAttributeNodeNS : function(newAttr){
		return this.attributes.setNamedItemNS(newAttr);
	},
	removeAttributeNode : function(oldAttr){
		//console.log(this == oldAttr.ownerElement)
		return this.attributes.removeNamedItem(oldAttr.nodeName);
	},
	//get real attribute name,and remove it by removeAttributeNode
	removeAttributeNS : function(namespaceURI, localName){
		var old = this.getAttributeNodeNS(namespaceURI, localName);
		old && this.removeAttributeNode(old);
	},
	
	hasAttributeNS : function(namespaceURI, localName){
		return this.getAttributeNodeNS(namespaceURI, localName)!=null;
	},
	getAttributeNS : function(namespaceURI, localName){
		var attr = this.getAttributeNodeNS(namespaceURI, localName);
		return attr && attr.value || '';
	},
	setAttributeNS : function(namespaceURI, qualifiedName, value){
		var attr = this.ownerDocument.createAttributeNS(namespaceURI, qualifiedName);
		attr.value = attr.nodeValue = "" + value;
		this.setAttributeNode(attr)
	},
	getAttributeNodeNS : function(namespaceURI, localName){
		return this.attributes.getNamedItemNS(namespaceURI, localName);
	},
	
	getElementsByTagName : function(tagName){
		return new LiveNodeList(this,function(base){
			var ls = [];
			_visitNode(base,function(node){
				if(node !== base && node.nodeType == ELEMENT_NODE && (tagName === '*' || node.tagName == tagName)){
					ls.push(node);
				}
			});
			return ls;
		});
	},
	getElementsByTagNameNS : function(namespaceURI, localName){
		return new LiveNodeList(this,function(base){
			var ls = [];
			_visitNode(base,function(node){
				if(node !== base && node.nodeType === ELEMENT_NODE && (namespaceURI === '*' || node.namespaceURI === namespaceURI) && (localName === '*' || node.localName == localName)){
					ls.push(node);
				}
			});
			return ls;
			
		});
	}
};
Document.prototype.getElementsByTagName = Element.prototype.getElementsByTagName;
Document.prototype.getElementsByTagNameNS = Element.prototype.getElementsByTagNameNS;


_extends(Element,Node);
function Attr() {
};
Attr.prototype.nodeType = ATTRIBUTE_NODE;
_extends(Attr,Node);


function CharacterData() {
};
CharacterData.prototype = {
	data : '',
	substringData : function(offset, count) {
		return this.data.substring(offset, offset+count);
	},
	appendData: function(text) {
		text = this.data+text;
		this.nodeValue = this.data = text;
		this.length = text.length;
	},
	insertData: function(offset,text) {
		this.replaceData(offset,0,text);
	
	},
	appendChild:function(newChild){
		throw new Error(ExceptionMessage[HIERARCHY_REQUEST_ERR])
	},
	deleteData: function(offset, count) {
		this.replaceData(offset,count,"");
	},
	replaceData: function(offset, count, text) {
		var start = this.data.substring(0,offset);
		var end = this.data.substring(offset+count);
		text = start + text + end;
		this.nodeValue = this.data = text;
		this.length = text.length;
	}
}
_extends(CharacterData,Node);
function Text() {
};
Text.prototype = {
	nodeName : "#text",
	nodeType : TEXT_NODE,
	splitText : function(offset) {
		var text = this.data;
		var newText = text.substring(offset);
		text = text.substring(0, offset);
		this.data = this.nodeValue = text;
		this.length = text.length;
		var newNode = this.ownerDocument.createTextNode(newText);
		if(this.parentNode){
			this.parentNode.insertBefore(newNode, this.nextSibling);
		}
		return newNode;
	}
}
_extends(Text,CharacterData);
function Comment() {
};
Comment.prototype = {
	nodeName : "#comment",
	nodeType : COMMENT_NODE
}
_extends(Comment,CharacterData);

function CDATASection() {
};
CDATASection.prototype = {
	nodeName : "#cdata-section",
	nodeType : CDATA_SECTION_NODE
}
_extends(CDATASection,CharacterData);


function DocumentType() {
};
DocumentType.prototype.nodeType = DOCUMENT_TYPE_NODE;
_extends(DocumentType,Node);

function Notation() {
};
Notation.prototype.nodeType = NOTATION_NODE;
_extends(Notation,Node);

function Entity() {
};
Entity.prototype.nodeType = ENTITY_NODE;
_extends(Entity,Node);

function EntityReference() {
};
EntityReference.prototype.nodeType = ENTITY_REFERENCE_NODE;
_extends(EntityReference,Node);

function DocumentFragment() {
};
DocumentFragment.prototype.nodeName =	"#document-fragment";
DocumentFragment.prototype.nodeType =	DOCUMENT_FRAGMENT_NODE;
_extends(DocumentFragment,Node);


function ProcessingInstruction() {
}
ProcessingInstruction.prototype.nodeType = PROCESSING_INSTRUCTION_NODE;
_extends(ProcessingInstruction,Node);
function XMLSerializer(){}
XMLSerializer.prototype.serializeToString = function(node,isHtml,nodeFilter){
	return nodeSerializeToString.call(node,isHtml,nodeFilter);
}
Node.prototype.toString = nodeSerializeToString;
function nodeSerializeToString(isHtml,nodeFilter){
	var buf = [];
	var refNode = this.nodeType == 9?this.documentElement:this;
	var prefix = refNode.prefix;
	var uri = refNode.namespaceURI;
	
	if(uri && prefix == null){
		//console.log(prefix)
		var prefix = refNode.lookupPrefix(uri);
		if(prefix == null){
			//isHTML = true;
			var visibleNamespaces=[
			{namespace:uri,prefix:null}
			//{namespace:uri,prefix:''}
			]
		}
	}
	serializeToString(this,buf,isHtml,nodeFilter,visibleNamespaces);
	//console.log('###',this.nodeType,uri,prefix,buf.join(''))
	return buf.join('');
}
function needNamespaceDefine(node,isHTML, visibleNamespaces) {
	var prefix = node.prefix||'';
	var uri = node.namespaceURI;
	if (!prefix && !uri){
		return false;
	}
	if (prefix === "xml" && uri === "http://www.w3.org/XML/1998/namespace" 
		|| uri == 'http://www.w3.org/2000/xmlns/'){
		return false;
	}
	
	var i = visibleNamespaces.length 
	//console.log('@@@@',node.tagName,prefix,uri,visibleNamespaces)
	while (i--) {
		var ns = visibleNamespaces[i];
		// get namespace prefix
		//console.log(node.nodeType,node.tagName,ns.prefix,prefix)
		if (ns.prefix == prefix){
			return ns.namespace != uri;
		}
	}
	//console.log(isHTML,uri,prefix=='')
	//if(isHTML && prefix ==null && uri == 'http://www.w3.org/1999/xhtml'){
	//	return false;
	//}
	//node.flag = '11111'
	//console.error(3,true,node.flag,node.prefix,node.namespaceURI)
	return true;
}
function serializeToString(node,buf,isHTML,nodeFilter,visibleNamespaces){
	if(nodeFilter){
		node = nodeFilter(node);
		if(node){
			if(typeof node == 'string'){
				buf.push(node);
				return;
			}
		}else{
			return;
		}
		//buf.sort.apply(attrs, attributeSorter);
	}
	switch(node.nodeType){
	case ELEMENT_NODE:
		if (!visibleNamespaces) visibleNamespaces = [];
		var startVisibleNamespaces = visibleNamespaces.length;
		var attrs = node.attributes;
		var len = attrs.length;
		var child = node.firstChild;
		var nodeName = node.tagName;
		
		isHTML =  (htmlns === node.namespaceURI) ||isHTML 
		buf.push('<',nodeName);
		
		
		
		for(var i=0;i<len;i++){
			// add namespaces for attributes
			var attr = attrs.item(i);
			if (attr.prefix == 'xmlns') {
				visibleNamespaces.push({ prefix: attr.localName, namespace: attr.value });
			}else if(attr.nodeName == 'xmlns'){
				visibleNamespaces.push({ prefix: '', namespace: attr.value });
			}
		}
		for(var i=0;i<len;i++){
			var attr = attrs.item(i);
			if (needNamespaceDefine(attr,isHTML, visibleNamespaces)) {
				var prefix = attr.prefix||'';
				var uri = attr.namespaceURI;
				var ns = prefix ? ' xmlns:' + prefix : " xmlns";
				buf.push(ns, '="' , uri , '"');
				visibleNamespaces.push({ prefix: prefix, namespace:uri });
			}
			serializeToString(attr,buf,isHTML,nodeFilter,visibleNamespaces);
		}
		// add namespace for current node		
		if (needNamespaceDefine(node,isHTML, visibleNamespaces)) {
			var prefix = node.prefix||'';
			var uri = node.namespaceURI;
			var ns = prefix ? ' xmlns:' + prefix : " xmlns";
			buf.push(ns, '="' , uri , '"');
			visibleNamespaces.push({ prefix: prefix, namespace:uri });
		}
		
		if(child || isHTML && !/^(?:meta|link|img|br|hr|input)$/i.test(nodeName)){
			buf.push('>');
			//if is cdata child node
			if(isHTML && /^script$/i.test(nodeName)){
				while(child){
					if(child.data){
						buf.push(child.data);
					}else{
						serializeToString(child,buf,isHTML,nodeFilter,visibleNamespaces);
					}
					child = child.nextSibling;
				}
			}else
			{
				while(child){
					serializeToString(child,buf,isHTML,nodeFilter,visibleNamespaces);
					child = child.nextSibling;
				}
			}
			buf.push('</',nodeName,'>');
		}else{
			buf.push('/>');
		}
		// remove added visible namespaces
		//visibleNamespaces.length = startVisibleNamespaces;
		return;
	case DOCUMENT_NODE:
	case DOCUMENT_FRAGMENT_NODE:
		var child = node.firstChild;
		while(child){
			serializeToString(child,buf,isHTML,nodeFilter,visibleNamespaces);
			child = child.nextSibling;
		}
		return;
	case ATTRIBUTE_NODE:
		return buf.push(' ',node.name,'="',node.value.replace(/[<&"]/g,_xmlEncoder),'"');
	case TEXT_NODE:
		return buf.push(node.data.replace(/[<&]/g,_xmlEncoder));
	case CDATA_SECTION_NODE:
		return buf.push( '<![CDATA[',node.data,']]>');
	case COMMENT_NODE:
		return buf.push( "<!--",node.data,"-->");
	case DOCUMENT_TYPE_NODE:
		var pubid = node.publicId;
		var sysid = node.systemId;
		buf.push('<!DOCTYPE ',node.name);
		if(pubid){
			buf.push(' PUBLIC "',pubid);
			if (sysid && sysid!='.') {
				buf.push( '" "',sysid);
			}
			buf.push('">');
		}else if(sysid && sysid!='.'){
			buf.push(' SYSTEM "',sysid,'">');
		}else{
			var sub = node.internalSubset;
			if(sub){
				buf.push(" [",sub,"]");
			}
			buf.push(">");
		}
		return;
	case PROCESSING_INSTRUCTION_NODE:
		return buf.push( "<?",node.target," ",node.data,"?>");
	case ENTITY_REFERENCE_NODE:
		return buf.push( '&',node.nodeName,';');
	//case ENTITY_NODE:
	//case NOTATION_NODE:
	default:
		buf.push('??',node.nodeName);
	}
}
function importNode(doc,node,deep){
	var node2;
	switch (node.nodeType) {
	case ELEMENT_NODE:
		node2 = node.cloneNode(false);
		node2.ownerDocument = doc;
		//var attrs = node2.attributes;
		//var len = attrs.length;
		//for(var i=0;i<len;i++){
			//node2.setAttributeNodeNS(importNode(doc,attrs.item(i),deep));
		//}
	case DOCUMENT_FRAGMENT_NODE:
		break;
	case ATTRIBUTE_NODE:
		deep = true;
		break;
	//case ENTITY_REFERENCE_NODE:
	//case PROCESSING_INSTRUCTION_NODE:
	////case TEXT_NODE:
	//case CDATA_SECTION_NODE:
	//case COMMENT_NODE:
	//	deep = false;
	//	break;
	//case DOCUMENT_NODE:
	//case DOCUMENT_TYPE_NODE:
	//cannot be imported.
	//case ENTITY_NODE:
	//case NOTATION_NODE：
	//can not hit in level3
	//default:throw e;
	}
	if(!node2){
		node2 = node.cloneNode(false);//false
	}
	node2.ownerDocument = doc;
	node2.parentNode = null;
	if(deep){
		var child = node.firstChild;
		while(child){
			node2.appendChild(importNode(doc,child,deep));
			child = child.nextSibling;
		}
	}
	return node2;
}
//
//var _relationMap = {firstChild:1,lastChild:1,previousSibling:1,nextSibling:1,
//					attributes:1,childNodes:1,parentNode:1,documentElement:1,doctype,};
function cloneNode(doc,node,deep){
	var node2 = new node.constructor();
	for(var n in node){
		var v = node[n];
		if(typeof v != 'object' ){
			if(v != node2[n]){
				node2[n] = v;
			}
		}
	}
	if(node.childNodes){
		node2.childNodes = new NodeList();
	}
	node2.ownerDocument = doc;
	switch (node2.nodeType) {
	case ELEMENT_NODE:
		var attrs	= node.attributes;
		var attrs2	= node2.attributes = new NamedNodeMap();
		var len = attrs.length
		attrs2._ownerElement = node2;
		for(var i=0;i<len;i++){
			node2.setAttributeNode(cloneNode(doc,attrs.item(i),true));
		}
		break;;
	case ATTRIBUTE_NODE:
		deep = true;
	}
	if(deep){
		var child = node.firstChild;
		while(child){
			node2.appendChild(cloneNode(doc,child,deep));
			child = child.nextSibling;
		}
	}
	return node2;
}

function __set__(object,key,value){
	object[key] = value
}
//do dynamic
try{
	if(Object.defineProperty){
		Object.defineProperty(LiveNodeList.prototype,'length',{
			get:function(){
				_updateLiveList(this);
				return this.$$length;
			}
		});
		Object.defineProperty(Node.prototype,'textContent',{
			get:function(){
				return getTextContent(this);
			},
			set:function(data){
				switch(this.nodeType){
				case ELEMENT_NODE:
				case DOCUMENT_FRAGMENT_NODE:
					while(this.firstChild){
						this.removeChild(this.firstChild);
					}
					if(data || String(data)){
						this.appendChild(this.ownerDocument.createTextNode(data));
					}
					break;
				default:
					//TODO:
					this.data = data;
					this.value = data;
					this.nodeValue = data;
				}
			}
		})
		
		function getTextContent(node){
			switch(node.nodeType){
			case ELEMENT_NODE:
			case DOCUMENT_FRAGMENT_NODE:
				var buf = [];
				node = node.firstChild;
				while(node){
					if(node.nodeType!==7 && node.nodeType !==8){
						buf.push(getTextContent(node));
					}
					node = node.nextSibling;
				}
				return buf.join('');
			default:
				return node.nodeValue;
			}
		}
		__set__ = function(object,key,value){
			//console.log(value)
			object['$$'+key] = value
		}
	}
}catch(e){//ie8
}

//if(typeof require == 'function'){
	exports.DOMImplementation = DOMImplementation;
	exports.XMLSerializer = XMLSerializer;
//}


/***/ }),

/***/ "./node_modules/xmldom/sax.js":
/*!************************************!*\
  !*** ./node_modules/xmldom/sax.js ***!
  \************************************/
/*! no static exports found */
/***/ (function(module, exports) {

//[4]   	NameStartChar	   ::=   	":" | [A-Z] | "_" | [a-z] | [#xC0-#xD6] | [#xD8-#xF6] | [#xF8-#x2FF] | [#x370-#x37D] | [#x37F-#x1FFF] | [#x200C-#x200D] | [#x2070-#x218F] | [#x2C00-#x2FEF] | [#x3001-#xD7FF] | [#xF900-#xFDCF] | [#xFDF0-#xFFFD] | [#x10000-#xEFFFF]
//[4a]   	NameChar	   ::=   	NameStartChar | "-" | "." | [0-9] | #xB7 | [#x0300-#x036F] | [#x203F-#x2040]
//[5]   	Name	   ::=   	NameStartChar (NameChar)*
var nameStartChar = /[A-Z_a-z\xC0-\xD6\xD8-\xF6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD]///\u10000-\uEFFFF
var nameChar = new RegExp("[\\-\\.0-9"+nameStartChar.source.slice(1,-1)+"\\u00B7\\u0300-\\u036F\\u203F-\\u2040]");
var tagNamePattern = new RegExp('^'+nameStartChar.source+nameChar.source+'*(?:\:'+nameStartChar.source+nameChar.source+'*)?$');
//var tagNamePattern = /^[a-zA-Z_][\w\-\.]*(?:\:[a-zA-Z_][\w\-\.]*)?$/
//var handlers = 'resolveEntity,getExternalSubset,characters,endDocument,endElement,endPrefixMapping,ignorableWhitespace,processingInstruction,setDocumentLocator,skippedEntity,startDocument,startElement,startPrefixMapping,notationDecl,unparsedEntityDecl,error,fatalError,warning,attributeDecl,elementDecl,externalEntityDecl,internalEntityDecl,comment,endCDATA,endDTD,endEntity,startCDATA,startDTD,startEntity'.split(',')

//S_TAG,	S_ATTR,	S_EQ,	S_ATTR_NOQUOT_VALUE
//S_ATTR_SPACE,	S_ATTR_END,	S_TAG_SPACE, S_TAG_CLOSE
var S_TAG = 0;//tag name offerring
var S_ATTR = 1;//attr name offerring 
var S_ATTR_SPACE=2;//attr name end and space offer
var S_EQ = 3;//=space?
var S_ATTR_NOQUOT_VALUE = 4;//attr value(no quot value only)
var S_ATTR_END = 5;//attr value end and no space(quot end)
var S_TAG_SPACE = 6;//(attr value end || tag end ) && (space offer)
var S_TAG_CLOSE = 7;//closed el<el />

function XMLReader(){
	
}

XMLReader.prototype = {
	parse:function(source,defaultNSMap,entityMap){
		var domBuilder = this.domBuilder;
		domBuilder.startDocument();
		_copy(defaultNSMap ,defaultNSMap = {})
		parse(source,defaultNSMap,entityMap,
				domBuilder,this.errorHandler);
		domBuilder.endDocument();
	}
}
function parse(source,defaultNSMapCopy,entityMap,domBuilder,errorHandler){
	function fixedFromCharCode(code) {
		// String.prototype.fromCharCode does not supports
		// > 2 bytes unicode chars directly
		if (code > 0xffff) {
			code -= 0x10000;
			var surrogate1 = 0xd800 + (code >> 10)
				, surrogate2 = 0xdc00 + (code & 0x3ff);

			return String.fromCharCode(surrogate1, surrogate2);
		} else {
			return String.fromCharCode(code);
		}
	}
	function entityReplacer(a){
		var k = a.slice(1,-1);
		if(k in entityMap){
			return entityMap[k]; 
		}else if(k.charAt(0) === '#'){
			return fixedFromCharCode(parseInt(k.substr(1).replace('x','0x')))
		}else{
			errorHandler.error('entity not found:'+a);
			return a;
		}
	}
	function appendText(end){//has some bugs
		if(end>start){
			var xt = source.substring(start,end).replace(/&#?\w+;/g,entityReplacer);
			locator&&position(start);
			domBuilder.characters(xt,0,end-start);
			start = end
		}
	}
	function position(p,m){
		while(p>=lineEnd && (m = linePattern.exec(source))){
			lineStart = m.index;
			lineEnd = lineStart + m[0].length;
			locator.lineNumber++;
			//console.log('line++:',locator,startPos,endPos)
		}
		locator.columnNumber = p-lineStart+1;
	}
	var lineStart = 0;
	var lineEnd = 0;
	var linePattern = /.*(?:\r\n?|\n)|.*$/g
	var locator = domBuilder.locator;
	
	var parseStack = [{currentNSMap:defaultNSMapCopy}]
	var closeMap = {};
	var start = 0;
	while(true){
		try{
			var tagStart = source.indexOf('<',start);
			if(tagStart<0){
				if(!source.substr(start).match(/^\s*$/)){
					var doc = domBuilder.doc;
	    			var text = doc.createTextNode(source.substr(start));
	    			doc.appendChild(text);
	    			domBuilder.currentElement = text;
				}
				return;
			}
			if(tagStart>start){
				appendText(tagStart);
			}
			switch(source.charAt(tagStart+1)){
			case '/':
				var end = source.indexOf('>',tagStart+3);
				var tagName = source.substring(tagStart+2,end);
				var config = parseStack.pop();
				if(end<0){
					
	        		tagName = source.substring(tagStart+2).replace(/[\s<].*/,'');
	        		//console.error('#@@@@@@'+tagName)
	        		errorHandler.error("end tag name: "+tagName+' is not complete:'+config.tagName);
	        		end = tagStart+1+tagName.length;
	        	}else if(tagName.match(/\s</)){
	        		tagName = tagName.replace(/[\s<].*/,'');
	        		errorHandler.error("end tag name: "+tagName+' maybe not complete');
	        		end = tagStart+1+tagName.length;
				}
				//console.error(parseStack.length,parseStack)
				//console.error(config);
				var localNSMap = config.localNSMap;
				var endMatch = config.tagName == tagName;
				var endIgnoreCaseMach = endMatch || config.tagName&&config.tagName.toLowerCase() == tagName.toLowerCase()
		        if(endIgnoreCaseMach){
		        	domBuilder.endElement(config.uri,config.localName,tagName);
					if(localNSMap){
						for(var prefix in localNSMap){
							domBuilder.endPrefixMapping(prefix) ;
						}
					}
					if(!endMatch){
		            	errorHandler.fatalError("end tag name: "+tagName+' is not match the current start tagName:'+config.tagName );
					}
		        }else{
		        	parseStack.push(config)
		        }
				
				end++;
				break;
				// end elment
			case '?':// <?...?>
				locator&&position(tagStart);
				end = parseInstruction(source,tagStart,domBuilder);
				break;
			case '!':// <!doctype,<![CDATA,<!--
				locator&&position(tagStart);
				end = parseDCC(source,tagStart,domBuilder,errorHandler);
				break;
			default:
				locator&&position(tagStart);
				var el = new ElementAttributes();
				var currentNSMap = parseStack[parseStack.length-1].currentNSMap;
				//elStartEnd
				var end = parseElementStartPart(source,tagStart,el,currentNSMap,entityReplacer,errorHandler);
				var len = el.length;
				
				
				if(!el.closed && fixSelfClosed(source,end,el.tagName,closeMap)){
					el.closed = true;
					if(!entityMap.nbsp){
						errorHandler.warning('unclosed xml attribute');
					}
				}
				if(locator && len){
					var locator2 = copyLocator(locator,{});
					//try{//attribute position fixed
					for(var i = 0;i<len;i++){
						var a = el[i];
						position(a.offset);
						a.locator = copyLocator(locator,{});
					}
					//}catch(e){console.error('@@@@@'+e)}
					domBuilder.locator = locator2
					if(appendElement(el,domBuilder,currentNSMap)){
						parseStack.push(el)
					}
					domBuilder.locator = locator;
				}else{
					if(appendElement(el,domBuilder,currentNSMap)){
						parseStack.push(el)
					}
				}
				
				
				
				if(el.uri === 'http://www.w3.org/1999/xhtml' && !el.closed){
					end = parseHtmlSpecialContent(source,end,el.tagName,entityReplacer,domBuilder)
				}else{
					end++;
				}
			}
		}catch(e){
			errorHandler.error('element parse error: '+e)
			//errorHandler.error('element parse error: '+e);
			end = -1;
			//throw e;
		}
		if(end>start){
			start = end;
		}else{
			//TODO: 这里有可能sax回退，有位置错误风险
			appendText(Math.max(tagStart,start)+1);
		}
	}
}
function copyLocator(f,t){
	t.lineNumber = f.lineNumber;
	t.columnNumber = f.columnNumber;
	return t;
}

/**
 * @see #appendElement(source,elStartEnd,el,selfClosed,entityReplacer,domBuilder,parseStack);
 * @return end of the elementStartPart(end of elementEndPart for selfClosed el)
 */
function parseElementStartPart(source,start,el,currentNSMap,entityReplacer,errorHandler){
	var attrName;
	var value;
	var p = ++start;
	var s = S_TAG;//status
	while(true){
		var c = source.charAt(p);
		switch(c){
		case '=':
			if(s === S_ATTR){//attrName
				attrName = source.slice(start,p);
				s = S_EQ;
			}else if(s === S_ATTR_SPACE){
				s = S_EQ;
			}else{
				//fatalError: equal must after attrName or space after attrName
				throw new Error('attribute equal must after attrName');
			}
			break;
		case '\'':
		case '"':
			if(s === S_EQ || s === S_ATTR //|| s == S_ATTR_SPACE
				){//equal
				if(s === S_ATTR){
					errorHandler.warning('attribute value must after "="')
					attrName = source.slice(start,p)
				}
				start = p+1;
				p = source.indexOf(c,start)
				if(p>0){
					value = source.slice(start,p).replace(/&#?\w+;/g,entityReplacer);
					el.add(attrName,value,start-1);
					s = S_ATTR_END;
				}else{
					//fatalError: no end quot match
					throw new Error('attribute value no end \''+c+'\' match');
				}
			}else if(s == S_ATTR_NOQUOT_VALUE){
				value = source.slice(start,p).replace(/&#?\w+;/g,entityReplacer);
				//console.log(attrName,value,start,p)
				el.add(attrName,value,start);
				//console.dir(el)
				errorHandler.warning('attribute "'+attrName+'" missed start quot('+c+')!!');
				start = p+1;
				s = S_ATTR_END
			}else{
				//fatalError: no equal before
				throw new Error('attribute value must after "="');
			}
			break;
		case '/':
			switch(s){
			case S_TAG:
				el.setTagName(source.slice(start,p));
			case S_ATTR_END:
			case S_TAG_SPACE:
			case S_TAG_CLOSE:
				s =S_TAG_CLOSE;
				el.closed = true;
			case S_ATTR_NOQUOT_VALUE:
			case S_ATTR:
			case S_ATTR_SPACE:
				break;
			//case S_EQ:
			default:
				throw new Error("attribute invalid close char('/')")
			}
			break;
		case ''://end document
			//throw new Error('unexpected end of input')
			errorHandler.error('unexpected end of input');
			if(s == S_TAG){
				el.setTagName(source.slice(start,p));
			}
			return p;
		case '>':
			switch(s){
			case S_TAG:
				el.setTagName(source.slice(start,p));
			case S_ATTR_END:
			case S_TAG_SPACE:
			case S_TAG_CLOSE:
				break;//normal
			case S_ATTR_NOQUOT_VALUE://Compatible state
			case S_ATTR:
				value = source.slice(start,p);
				if(value.slice(-1) === '/'){
					el.closed  = true;
					value = value.slice(0,-1)
				}
			case S_ATTR_SPACE:
				if(s === S_ATTR_SPACE){
					value = attrName;
				}
				if(s == S_ATTR_NOQUOT_VALUE){
					errorHandler.warning('attribute "'+value+'" missed quot(")!!');
					el.add(attrName,value.replace(/&#?\w+;/g,entityReplacer),start)
				}else{
					if(currentNSMap[''] !== 'http://www.w3.org/1999/xhtml' || !value.match(/^(?:disabled|checked|selected)$/i)){
						errorHandler.warning('attribute "'+value+'" missed value!! "'+value+'" instead!!')
					}
					el.add(value,value,start)
				}
				break;
			case S_EQ:
				throw new Error('attribute value missed!!');
			}
//			console.log(tagName,tagNamePattern,tagNamePattern.test(tagName))
			return p;
		/*xml space '\x20' | #x9 | #xD | #xA; */
		case '\u0080':
			c = ' ';
		default:
			if(c<= ' '){//space
				switch(s){
				case S_TAG:
					el.setTagName(source.slice(start,p));//tagName
					s = S_TAG_SPACE;
					break;
				case S_ATTR:
					attrName = source.slice(start,p)
					s = S_ATTR_SPACE;
					break;
				case S_ATTR_NOQUOT_VALUE:
					var value = source.slice(start,p).replace(/&#?\w+;/g,entityReplacer);
					errorHandler.warning('attribute "'+value+'" missed quot(")!!');
					el.add(attrName,value,start)
				case S_ATTR_END:
					s = S_TAG_SPACE;
					break;
				//case S_TAG_SPACE:
				//case S_EQ:
				//case S_ATTR_SPACE:
				//	void();break;
				//case S_TAG_CLOSE:
					//ignore warning
				}
			}else{//not space
//S_TAG,	S_ATTR,	S_EQ,	S_ATTR_NOQUOT_VALUE
//S_ATTR_SPACE,	S_ATTR_END,	S_TAG_SPACE, S_TAG_CLOSE
				switch(s){
				//case S_TAG:void();break;
				//case S_ATTR:void();break;
				//case S_ATTR_NOQUOT_VALUE:void();break;
				case S_ATTR_SPACE:
					var tagName =  el.tagName;
					if(currentNSMap[''] !== 'http://www.w3.org/1999/xhtml' || !attrName.match(/^(?:disabled|checked|selected)$/i)){
						errorHandler.warning('attribute "'+attrName+'" missed value!! "'+attrName+'" instead2!!')
					}
					el.add(attrName,attrName,start);
					start = p;
					s = S_ATTR;
					break;
				case S_ATTR_END:
					errorHandler.warning('attribute space is required"'+attrName+'"!!')
				case S_TAG_SPACE:
					s = S_ATTR;
					start = p;
					break;
				case S_EQ:
					s = S_ATTR_NOQUOT_VALUE;
					start = p;
					break;
				case S_TAG_CLOSE:
					throw new Error("elements closed character '/' and '>' must be connected to");
				}
			}
		}//end outer switch
		//console.log('p++',p)
		p++;
	}
}
/**
 * @return true if has new namespace define
 */
function appendElement(el,domBuilder,currentNSMap){
	var tagName = el.tagName;
	var localNSMap = null;
	//var currentNSMap = parseStack[parseStack.length-1].currentNSMap;
	var i = el.length;
	while(i--){
		var a = el[i];
		var qName = a.qName;
		var value = a.value;
		var nsp = qName.indexOf(':');
		if(nsp>0){
			var prefix = a.prefix = qName.slice(0,nsp);
			var localName = qName.slice(nsp+1);
			var nsPrefix = prefix === 'xmlns' && localName
		}else{
			localName = qName;
			prefix = null
			nsPrefix = qName === 'xmlns' && ''
		}
		//can not set prefix,because prefix !== ''
		a.localName = localName ;
		//prefix == null for no ns prefix attribute 
		if(nsPrefix !== false){//hack!!
			if(localNSMap == null){
				localNSMap = {}
				//console.log(currentNSMap,0)
				_copy(currentNSMap,currentNSMap={})
				//console.log(currentNSMap,1)
			}
			currentNSMap[nsPrefix] = localNSMap[nsPrefix] = value;
			a.uri = 'http://www.w3.org/2000/xmlns/'
			domBuilder.startPrefixMapping(nsPrefix, value) 
		}
	}
	var i = el.length;
	while(i--){
		a = el[i];
		var prefix = a.prefix;
		if(prefix){//no prefix attribute has no namespace
			if(prefix === 'xml'){
				a.uri = 'http://www.w3.org/XML/1998/namespace';
			}if(prefix !== 'xmlns'){
				a.uri = currentNSMap[prefix || '']
				
				//{console.log('###'+a.qName,domBuilder.locator.systemId+'',currentNSMap,a.uri)}
			}
		}
	}
	var nsp = tagName.indexOf(':');
	if(nsp>0){
		prefix = el.prefix = tagName.slice(0,nsp);
		localName = el.localName = tagName.slice(nsp+1);
	}else{
		prefix = null;//important!!
		localName = el.localName = tagName;
	}
	//no prefix element has default namespace
	var ns = el.uri = currentNSMap[prefix || ''];
	domBuilder.startElement(ns,localName,tagName,el);
	//endPrefixMapping and startPrefixMapping have not any help for dom builder
	//localNSMap = null
	if(el.closed){
		domBuilder.endElement(ns,localName,tagName);
		if(localNSMap){
			for(prefix in localNSMap){
				domBuilder.endPrefixMapping(prefix) 
			}
		}
	}else{
		el.currentNSMap = currentNSMap;
		el.localNSMap = localNSMap;
		//parseStack.push(el);
		return true;
	}
}
function parseHtmlSpecialContent(source,elStartEnd,tagName,entityReplacer,domBuilder){
	if(/^(?:script|textarea)$/i.test(tagName)){
		var elEndStart =  source.indexOf('</'+tagName+'>',elStartEnd);
		var text = source.substring(elStartEnd+1,elEndStart);
		if(/[&<]/.test(text)){
			if(/^script$/i.test(tagName)){
				//if(!/\]\]>/.test(text)){
					//lexHandler.startCDATA();
					domBuilder.characters(text,0,text.length);
					//lexHandler.endCDATA();
					return elEndStart;
				//}
			}//}else{//text area
				text = text.replace(/&#?\w+;/g,entityReplacer);
				domBuilder.characters(text,0,text.length);
				return elEndStart;
			//}
			
		}
	}
	return elStartEnd+1;
}
function fixSelfClosed(source,elStartEnd,tagName,closeMap){
	//if(tagName in closeMap){
	var pos = closeMap[tagName];
	if(pos == null){
		//console.log(tagName)
		pos =  source.lastIndexOf('</'+tagName+'>')
		if(pos<elStartEnd){//忘记闭合
			pos = source.lastIndexOf('</'+tagName)
		}
		closeMap[tagName] =pos
	}
	return pos<elStartEnd;
	//} 
}
function _copy(source,target){
	for(var n in source){target[n] = source[n]}
}
function parseDCC(source,start,domBuilder,errorHandler){//sure start with '<!'
	var next= source.charAt(start+2)
	switch(next){
	case '-':
		if(source.charAt(start + 3) === '-'){
			var end = source.indexOf('-->',start+4);
			//append comment source.substring(4,end)//<!--
			if(end>start){
				domBuilder.comment(source,start+4,end-start-4);
				return end+3;
			}else{
				errorHandler.error("Unclosed comment");
				return -1;
			}
		}else{
			//error
			return -1;
		}
	default:
		if(source.substr(start+3,6) == 'CDATA['){
			var end = source.indexOf(']]>',start+9);
			domBuilder.startCDATA();
			domBuilder.characters(source,start+9,end-start-9);
			domBuilder.endCDATA() 
			return end+3;
		}
		//<!DOCTYPE
		//startDTD(java.lang.String name, java.lang.String publicId, java.lang.String systemId) 
		var matchs = split(source,start);
		var len = matchs.length;
		if(len>1 && /!doctype/i.test(matchs[0][0])){
			var name = matchs[1][0];
			var pubid = len>3 && /^public$/i.test(matchs[2][0]) && matchs[3][0]
			var sysid = len>4 && matchs[4][0];
			var lastMatch = matchs[len-1]
			domBuilder.startDTD(name,pubid && pubid.replace(/^(['"])(.*?)\1$/,'$2'),
					sysid && sysid.replace(/^(['"])(.*?)\1$/,'$2'));
			domBuilder.endDTD();
			
			return lastMatch.index+lastMatch[0].length
		}
	}
	return -1;
}



function parseInstruction(source,start,domBuilder){
	var end = source.indexOf('?>',start);
	if(end){
		var match = source.substring(start,end).match(/^<\?(\S*)\s*([\s\S]*?)\s*$/);
		if(match){
			var len = match[0].length;
			domBuilder.processingInstruction(match[1], match[2]) ;
			return end+2;
		}else{//error
			return -1;
		}
	}
	return -1;
}

/**
 * @param source
 */
function ElementAttributes(source){
	
}
ElementAttributes.prototype = {
	setTagName:function(tagName){
		if(!tagNamePattern.test(tagName)){
			throw new Error('invalid tagName:'+tagName)
		}
		this.tagName = tagName
	},
	add:function(qName,value,offset){
		if(!tagNamePattern.test(qName)){
			throw new Error('invalid attribute:'+qName)
		}
		this[this.length++] = {qName:qName,value:value,offset:offset}
	},
	length:0,
	getLocalName:function(i){return this[i].localName},
	getLocator:function(i){return this[i].locator},
	getQName:function(i){return this[i].qName},
	getURI:function(i){return this[i].uri},
	getValue:function(i){return this[i].value}
//	,getIndex:function(uri, localName)){
//		if(localName){
//			
//		}else{
//			var qName = uri
//		}
//	},
//	getValue:function(){return this.getValue(this.getIndex.apply(this,arguments))},
//	getType:function(uri,localName){}
//	getType:function(i){},
}




function _set_proto_(thiz,parent){
	thiz.__proto__ = parent;
	return thiz;
}
if(!(_set_proto_({},_set_proto_.prototype) instanceof _set_proto_)){
	_set_proto_ = function(thiz,parent){
		function p(){};
		p.prototype = parent;
		p = new p();
		for(parent in thiz){
			p[parent] = thiz[parent];
		}
		return p;
	}
}

function split(source,start){
	var match;
	var buf = [];
	var reg = /'[^']+'|"[^"]+"|[^\s<>\/=]+=?|(\/?\s*>|<)/g;
	reg.lastIndex = start;
	reg.exec(source);//skip <
	while(match = reg.exec(source)){
		buf.push(match);
		if(match[1])return buf;
	}
}

exports.XMLReader = XMLReader;



/***/ }),

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _js_main__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./js/main */ "./src/js/main/index.js");
/* harmony import */ var _scss_style_scss__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./scss/style.scss */ "./src/scss/style.scss");
/* harmony import */ var _scss_style_scss__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_scss_style_scss__WEBPACK_IMPORTED_MODULE_1__);




/***/ }),

/***/ "./src/js/ParserBase/LL1/LL1Parse.js":
/*!*******************************************!*\
  !*** ./src/js/ParserBase/LL1/LL1Parse.js ***!
  \*******************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return LL1Parse; });
/* harmony import */ var _base_symbols__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../base/symbols */ "./src/js/ParserBase/base/symbols/index.js");


class LL1Parse {
	constructor(grammar, ll1PredictTable, inputTokens) {
		LL1Parse.TreeNode.serialNo = 1;

		const rootNode = this.parseTree = new LL1Parse.TreeNode(_base_symbols__WEBPACK_IMPORTED_MODULE_0__["GSymbol"].SYSTEM_GOAL);
		const parseStack = this.parseStack = [_base_symbols__WEBPACK_IMPORTED_MODULE_0__["GSymbol"].SYSTEM_GOAL];
		const rhsStack = this.rhsStack = [];

		// add the EndOfInput marker
		inputTokens.push({ terminalType: _base_symbols__WEBPACK_IMPORTED_MODULE_0__["GSymbol"].EOI });

		[this.currentRHS, this.currentRHSIndex] = [[rootNode], 0];

		const self = this;

		this.step = (function*() {
			while(parseStack.length !== 0 && inputTokens.length !== 0) {
				let topSymbol = parseStack.slice(-1)[0];
				let nextInput = inputTokens[0];
				let currentNode = self.currentRHS[self.currentRHSIndex];

				if(topSymbol instanceof _base_symbols__WEBPACK_IMPORTED_MODULE_0__["NonTerminal"]) {
					let predictedProds = ll1PredictTable.get(topSymbol).get(nextInput.terminalType);

					if(predictedProds === undefined) {
						return new Error(`Unable to predict ${topSymbol} with lookahead ${nextInput.terminalType} (syntax error)`);
					} else if(predictedProds.length > 1) {
						return new Error(`Unable to predict ${topSymbol} with lookahead ${nextInput.terminalType} (conflict)`);
					}

					let usingProd = predictedProds[0];

					// parse stack
					parseStack.pop();
					parseStack.push(...usingProd.rhs.slice().reverse());

					// parse tree
					currentNode.childNodes = usingProd.rhs.map(e => new LL1Parse.TreeNode(e));

					// semantic record
					rhsStack.push([self.currentRHS, self.currentRHSIndex]);
					[self.currentRHS, self.currentRHSIndex] = [currentNode.childNodes, 0];
					checkEOP();

					yield new LL1Parse.Action.Predict(usingProd);
				} else if(topSymbol instanceof _base_symbols__WEBPACK_IMPORTED_MODULE_0__["Terminal"]) {
					if(nextInput.terminalType !== topSymbol) {
						return new Error(`Unable to match ${nextInput.terminalType}`);
					}

					// parse stack
					parseStack.pop();
					inputTokens.shift();

					// parse tree
					/* do nothing */

					// semantic record
					self.currentRHSIndex++;
					checkEOP();

					if(topSymbol !== _base_symbols__WEBPACK_IMPORTED_MODULE_0__["GSymbol"].EOI) {
						yield new LL1Parse.Action.Match(nextInput.terminalType);
					} else {
						yield new LL1Parse.Action.Accept(nextInput.terminalType);
						return;
					}
				} else {
					throw new Error('Invalid Symbol: ' + topSymbol);
				}
			}

			function checkEOP() {
				while(self.currentRHSIndex >= self.currentRHS.length && rhsStack.length !== 0) {
					[self.currentRHS, self.currentRHSIndex] = rhsStack.pop();
					self.currentRHSIndex++;
				}
			}
		})();
	}
} {
	LL1Parse.TreeNode = class {
		constructor(symbol) {
			this.id = LL1Parse.TreeNode.serialNo++;
			this.symbol = symbol;
			this.childNodes = [];
		}
		toString() {
			return this.symbol.toString();
		}
	};{
		LL1Parse.TreeNode.serialNo = 1;
	}

	LL1Parse.Action = class {
		constructor() {

		}
	};{
		LL1Parse.Action.Match = class extends LL1Parse.Action {
			constructor(terminalType) {
				super();
				this.terminalType = terminalType;
			}
		};
		LL1Parse.Action.Predict = class extends LL1Parse.Action {
			constructor(usingProd) {
				super();
				this.usingProd = usingProd;
			}
		};
		LL1Parse.Action.Accept = class extends LL1Parse.Action {
			constructor(terminalType) {
				super();
				this.terminalType = terminalType;
			}
		};
	}
}


/***/ }),

/***/ "./src/js/ParserBase/LR0/LR0Configuration.js":
/*!***************************************************!*\
  !*** ./src/js/ParserBase/LR0/LR0Configuration.js ***!
  \***************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return LR0Configuration; });
/* harmony import */ var _base_symbols__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../base/symbols */ "./src/js/ParserBase/base/symbols/index.js");
/* harmony import */ var _base_Production__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../base/Production */ "./src/js/ParserBase/base/Production.js");



class LR0Configuration {
	constructor(production, dotPos) {
		this.id = LR0Configuration.serialNo++;
		this.production = production;
		this.dotPos = dotPos;
	}
	getNextSymbol() {
		if(this.dotPos === this.production.rhs.length)
			return null;
		return this.production.rhs[this.dotPos];
	}
	toString() {
		let r = this.production.rhs.slice();
		r.splice(this.dotPos, 0, _base_symbols__WEBPACK_IMPORTED_MODULE_0__["GSymbol"].DOT);
		return (this.production.lhs + ' ' + _base_Production__WEBPACK_IMPORTED_MODULE_1__["default"].ARROW + ' ' +
			r.join(' '));
	}
} {
	LR0Configuration.serialNo = 1;
}


/***/ }),

/***/ "./src/js/ParserBase/LR0/LR0FSM.js":
/*!*****************************************!*\
  !*** ./src/js/ParserBase/LR0/LR0FSM.js ***!
  \*****************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return LR0FSM; });
/* harmony import */ var _base_symbols__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../base/symbols */ "./src/js/ParserBase/base/symbols/index.js");
/* harmony import */ var _LR0Configuration__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./LR0Configuration */ "./src/js/ParserBase/LR0/LR0Configuration.js");
/* harmony import */ var _ext__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../_ext */ "./src/js/_ext.js");




class LR0FSM {
	constructor(startState) {
		this.startState = startState;
		this.states = new Set([startState]);
	}
	static from(grammar) {
		_LR0Configuration__WEBPACK_IMPORTED_MODULE_1__["default"].serialNo = 1;
		LR0FSM.State.serialNo = 0;

		let getLR0Configuration = getLR0ConfigurationHelper();

		let state0 = new LR0FSM.State(
			closure0Of(
				new Set([getLR0Configuration(grammar.augmentingProduction, 0)])
			)
		);
		let lr0FSM = new LR0FSM(state0);

		let processingQueue = [state0];
		while(processingQueue.length !== 0) {
			let processingState = processingQueue.shift();
			let nextSymbolGroups = _ext__WEBPACK_IMPORTED_MODULE_2__["default"].groupBy(processingState.configurationSet, e => e.getNextSymbol());
			for(let [symbol, lr0ConfSet] of nextSymbolGroups) {
				if(symbol === null)
					continue;
				let newLR0ConfSet = closure0Of(
					new Set(Array.from(lr0ConfSet).map(function(lr0conf) {
						return getLR0Configuration(lr0conf.production, lr0conf.dotPos + 1);
					}))
				);
				let existedState = null;
				for(let state of lr0FSM.states) {
					if(_ext__WEBPACK_IMPORTED_MODULE_2__["default"].equals(state.configurationSet, newLR0ConfSet)) {
						existedState = state;
						break;
					}
				}
				if(existedState === null) {
					let newState = new LR0FSM.State(newLR0ConfSet);
					lr0FSM.states.add(newState);
					processingState.linkTo(newState, symbol);
					processingQueue.push(newState);
				} else {
					processingState.linkTo(existedState, symbol);
				}
			}
		}

		return lr0FSM;

		function getLR0ConfigurationHelper() {
			let globalLR0ConfMap = new Map(); {
				for(let production of grammar.productions) {
					let lr0ConfsOfProd = [];
					for(let i = 0; i <= production.rhs.length; i++)
						lr0ConfsOfProd.push(new _LR0Configuration__WEBPACK_IMPORTED_MODULE_1__["default"](production, i));
					globalLR0ConfMap.set(production, lr0ConfsOfProd);
				}
			}

			return function(prod, pos) {
				return globalLR0ConfMap.get(prod)[pos];
			};
		}
		function closure0Of(lr0ConfSet) {
			let newLR0ConfSet = new Set(lr0ConfSet);

			let processingQueue = Array.from(lr0ConfSet);
			while(processingQueue.length !== 0) {
				let lr0conf = processingQueue.shift();

				let expandingNonTerminal = lr0conf.getNextSymbol();
				if(!(expandingNonTerminal instanceof _base_symbols__WEBPACK_IMPORTED_MODULE_0__["NonTerminal"]))
					continue;

				for(let prod of grammar.productionsMap.get(expandingNonTerminal)) {
					let newLR0Conf = getLR0Configuration(prod, 0);
					if(!newLR0ConfSet.has(newLR0Conf)) {
						newLR0ConfSet.add(newLR0Conf);
						processingQueue.push(newLR0Conf);
					}
				}
			}

			return newLR0ConfSet;
		}
	}
} {
	LR0FSM.State = class {
		constructor(lr0ConfigurationSet) {
			this.id = LR0FSM.State.serialNo++;
			this.configurationSet = lr0ConfigurationSet;
			this.transitionMap = new Map();
		}
		linkTo(toState, symbol) {
			this.transitionMap.set(symbol, toState);
		}
	};{
		LR0FSM.State.serialNo = 1;
	}
}


/***/ }),

/***/ "./src/js/ParserBase/LR1/LR1Configuration.js":
/*!***************************************************!*\
  !*** ./src/js/ParserBase/LR1/LR1Configuration.js ***!
  \***************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return LR1Configuration; });
class LR1Configuration {
	constructor(baseLR0Configuration, lookahead) {
		this.id = LR1Configuration.serialNo++;
		this.baseLR0Configuration = baseLR0Configuration;
		this.lookahead = lookahead;
	}
} {
	LR1Configuration.serialNo = 1;
}


/***/ }),

/***/ "./src/js/ParserBase/LR1/LR1FSM.js":
/*!*****************************************!*\
  !*** ./src/js/ParserBase/LR1/LR1FSM.js ***!
  \*****************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return LR1FSM; });
/* harmony import */ var _base_symbols__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../base/symbols */ "./src/js/ParserBase/base/symbols/index.js");
/* harmony import */ var _LR0_LR0Configuration__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../LR0/LR0Configuration */ "./src/js/ParserBase/LR0/LR0Configuration.js");
/* harmony import */ var _LR1Configuration__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./LR1Configuration */ "./src/js/ParserBase/LR1/LR1Configuration.js");
/* harmony import */ var _ext__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../_ext */ "./src/js/_ext.js");





class LR1FSM {
	constructor(startState) {
		this.startState = startState;
		this.states = new Set([startState]);
	}
	static from(grammar, firstSetTable) {
		_LR0_LR0Configuration__WEBPACK_IMPORTED_MODULE_1__["default"].serialNo = _LR1Configuration__WEBPACK_IMPORTED_MODULE_2__["default"].serialNo = 1;
		LR1FSM.State.serialNo = 0;

		let getLR1Configuration = getLR1ConfigurationHelper();

		let state0 = new LR1FSM.State(
			closure1Of(
				new Set([getLR1Configuration(grammar.augmentingProduction, 0, _base_symbols__WEBPACK_IMPORTED_MODULE_0__["GSymbol"].LAMBDA)])
			)
		);
		let lr1FSM = new LR1FSM(state0);

		let processingQueue = [state0];
		while(processingQueue.length !== 0) {
			let processingState = processingQueue.shift();
			let nextSymbolGroups = _ext__WEBPACK_IMPORTED_MODULE_3__["default"].groupBy(
				processingState.configurationSet,
				e => e.baseLR0Configuration.getNextSymbol()
			);
			for(let [symbol, lr1ConfSet] of nextSymbolGroups) {
				if(symbol === null)
					continue;
				let newLR1ConfSet = closure1Of(
					new Set(Array.from(lr1ConfSet).map(function(lr1conf) {
						return getLR1Configuration(
							lr1conf.baseLR0Configuration.production,
							lr1conf.baseLR0Configuration.dotPos + 1,
							lr1conf.lookahead
						);
					}))
				);
				let existedState = null;
				for(let state of lr1FSM.states) {
					if(_ext__WEBPACK_IMPORTED_MODULE_3__["default"].equals(state.configurationSet, newLR1ConfSet)) {
						existedState = state;
						break;
					}
				}
				if(existedState === null) {
					let newState = new LR1FSM.State(newLR1ConfSet);
					lr1FSM.states.add(newState);
					processingState.linkTo(newState, symbol);
					processingQueue.push(newState);
				} else {
					processingState.linkTo(existedState, symbol);
				}
			}
		}

		return lr1FSM;

		function getLR1ConfigurationHelper() {
			let globalLR0ConfMap = new Map(); {	// Map<Production,LR0Configuration[]>
				for(let production of grammar.productions) {
					let lr0ConfsOfProd = [];
					for(let i = 0; i <= production.rhs.length; i++)
						lr0ConfsOfProd.push(new _LR0_LR0Configuration__WEBPACK_IMPORTED_MODULE_1__["default"](production, i));
					globalLR0ConfMap.set(production, lr0ConfsOfProd);
				}
			}
			let globalLR1ConfSet = new Map(); {	// Map<Production,Map<Terminal,LR1Configuration>[]>
				for(let production of grammar.productions) {
					let lr1ConfsOfProd = [];
					for(let i = 0; i <= production.rhs.length; i++)
						lr1ConfsOfProd.push(new Map());
					globalLR1ConfSet.set(production, lr1ConfsOfProd);
				}
			}

			return function(prod, pos, lookahead) {
				let targetAbbr = globalLR1ConfSet.get(prod)[pos];
				if(targetAbbr.has(lookahead)) {
					return targetAbbr.get(lookahead);
				} else {
					let newLR1Conf = new _LR1Configuration__WEBPACK_IMPORTED_MODULE_2__["default"](
						globalLR0ConfMap.get(prod)[pos],
						lookahead
					);
					targetAbbr.set(lookahead, newLR1Conf);
					return newLR1Conf;
				}
			};
		}
		function closure1Of(lr1ConfSet) {
			let newLR1ConfSet = new Set(lr1ConfSet);

			let processingQueue = Array.from(lr1ConfSet);
			while(processingQueue.length !== 0) {
				let lr1conf = processingQueue.shift();
				let lr0conf = lr1conf.baseLR0Configuration;

				let expandingNonTerminal = lr0conf.getNextSymbol();
				if(!(expandingNonTerminal instanceof _base_symbols__WEBPACK_IMPORTED_MODULE_0__["NonTerminal"]))
					continue;

				let lookaheadSet = new Set();
				let rhs = lr0conf.production.rhs;
				let blocked = false;
				for(let i = lr0conf.dotPos + 1; i < rhs.length; i++) {
					for(let t of firstSetTable.get(rhs[i])) {
						if(t !== _base_symbols__WEBPACK_IMPORTED_MODULE_0__["GSymbol"].LAMBDA)
							lookaheadSet.add(t);
					}
					if(!firstSetTable.get(rhs[i]).has(_base_symbols__WEBPACK_IMPORTED_MODULE_0__["GSymbol"].LAMBDA)) {
						blocked = true;
						break;
					}
				}
				if(!blocked) {
					lookaheadSet.add(lr1conf.lookahead);
				}

				for(let lookahead of lookaheadSet) {
					for(let prod of grammar.productionsMap.get(expandingNonTerminal)) {
						let newLR1Conf = getLR1Configuration(prod, 0, lookahead);
						if(!newLR1ConfSet.has(newLR1Conf)) {
							newLR1ConfSet.add(newLR1Conf);
							processingQueue.push(newLR1Conf);
						}
					}
				}
			}

			return newLR1ConfSet;
		}
	}
} {
	LR1FSM.State = class {
		constructor(lr1ConfigurationSet) {
			this.id = LR1FSM.State.serialNo++;
			this.configurationSet = lr1ConfigurationSet;
			this.transitionMap = new Map();
		}
		linkTo(toState, symbol) {
			this.transitionMap.set(symbol, toState);
		}
	};{
		LR1FSM.State.serialNo = 1;
	}
}


/***/ }),

/***/ "./src/js/ParserBase/LR1/LR1Parse.js":
/*!*******************************************!*\
  !*** ./src/js/ParserBase/LR1/LR1Parse.js ***!
  \*******************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return LR1Parse; });
/* harmony import */ var _base_symbols__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../base/symbols */ "./src/js/ParserBase/base/symbols/index.js");
/* harmony import */ var _base_Production__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../base/Production */ "./src/js/ParserBase/base/Production.js");
/* harmony import */ var _ext__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../_ext */ "./src/js/_ext.js");




class LR1Parse {
	constructor(grammar, lr1FSM, lr1GotoActionTable, inputTokens) {
		LR1Parse.TreeNode.serialNo = 1;

		const parseForest = this.parseForest = [];
		const parseStack = this.parseStack = [];
		const stateStack = this.stateStack = [lr1FSM.startState];

		inputTokens.push({terminalType: _base_symbols__WEBPACK_IMPORTED_MODULE_0__["GSymbol"].EOI});

		this.step = (function*() {
			while(inputTokens.length !== 0) {
				let currentState = stateStack.slice(-1)[0];
				let nextInput = inputTokens[0];
				let selectedActions = lr1GotoActionTable.get(currentState).get(nextInput.terminalType);

				if(selectedActions === undefined) {
					return new Error(`Unable to decide next action with lookahead ${nextInput.terminalType} (syntax error)`);
				} else if(selectedActions.length > 1) {
					return new Error(`Unable to decide next action with lookahead ${nextInput.terminalType} (conflict)`);
				}

				let action = selectedActions[0];

				if(action instanceof LR1Parse.Action.Shift) {
					/* shift */ {
						// parse stack
						parseStack.push(nextInput.terminalType);
						stateStack.push(action.nextState);
						// parse tree
						parseForest.push(new LR1Parse.TreeNode(nextInput.terminalType));

						inputTokens.shift();
					}
					yield action;
				} else if(action instanceof LR1Parse.Action.Reduce) {
					/* reduce */ {
						let reducedNode = new LR1Parse.TreeNode(action.reducingProduction.lhs);
						reducedNode.childNodes = [];

						for(let rhsi of action.reducingProduction.rhs) {
							rhsi;	// prevent 'no-unused-vars' warning
							parseStack.pop();
							stateStack.pop();
							reducedNode.childNodes.unshift(parseForest.pop());
						}
						currentState = stateStack.slice(-1)[0];

						let nonterminalShiftAction =
							lr1GotoActionTable.get(currentState).get(action.reducingProduction.lhs)[0];

						// parse stack
						parseStack.push(action.reducingProduction.lhs);
						stateStack.push(nonterminalShiftAction.nextState);

						// parse tree
						parseForest.push(reducedNode);
					}
					yield action;
				} else if(action instanceof LR1Parse.Action.Accept) {
					/* shift $ */ {
						// parse stack
						parseStack.push(nextInput.terminalType);
						stateStack.push(action.nextState);

						// parse tree
						parseForest.push(new LR1Parse.TreeNode(nextInput.terminalType));

						inputTokens.shift();
					}
					/* reduce */ {
						let reducedNode = new LR1Parse.TreeNode(action.reducingProduction.lhs);
						reducedNode.childNodes = [];

						for(let rhsi of action.reducingProduction.rhs) {
							rhsi;	// prevent 'no-unused-vars' warning
							parseStack.pop();
							stateStack.pop();
							reducedNode.childNodes.unshift(parseForest.pop());
						}
						currentState = stateStack.slice(-1)[0];

						// parse stack
						parseStack.push(action.reducingProduction.lhs);
						stateStack.pop();

						// parse tree
						parseForest.push(reducedNode);
					}
					yield action;
					return;
				} else {
					throw new Error('Unknown action.');
				}
			}
		})();
	}
} {
	LR1Parse.TreeNode = class {
		constructor(symbol) {
			this.id = LR1Parse.TreeNode.serialNo++;
			this.symbol = symbol;
		}
		toString() {
			return this.symbol.toString();
		}
	};{
		LR1Parse.TreeNode.serialNo = 1;
	}
	LR1Parse.Action = class {
		constructor() {

		}
	};{
		LR1Parse.Action.Shift = class extends LR1Parse.Action {
			constructor(nextState) {
				super();
				this.nextState = nextState;
			}
			[_ext__WEBPACK_IMPORTED_MODULE_2__["default"].overrides.equals](that) {
				return that instanceof LR1Parse.Action.Shift
					&& _ext__WEBPACK_IMPORTED_MODULE_2__["default"].equals(this.nextState, that.nextState);
			}
			toString() {
				return 'S' + _base_Production__WEBPACK_IMPORTED_MODULE_1__["default"].ARROW + this.nextState.id;
			}
		};
		LR1Parse.Action.PseudoShift = class extends LR1Parse.Action.Shift {
			constructor(nextState) {
				super(nextState);
			}
			[_ext__WEBPACK_IMPORTED_MODULE_2__["default"].overrides.equals](that) {
				return that instanceof LR1Parse.Action.PseudoShift
					&& _ext__WEBPACK_IMPORTED_MODULE_2__["default"].equals(this.nextState, that.nextState);
			}
			toString() {
				return _base_Production__WEBPACK_IMPORTED_MODULE_1__["default"].ARROW + this.nextState.id;
			}
		};
		LR1Parse.Action.Reduce = class extends LR1Parse.Action {
			constructor(reducingProduction) {
				super();
				this.reducingProduction = reducingProduction;
			}
			[_ext__WEBPACK_IMPORTED_MODULE_2__["default"].overrides.equals](that) {
				return that instanceof LR1Parse.Action.Reduce
					&& _ext__WEBPACK_IMPORTED_MODULE_2__["default"].equals(this.reducingProduction, that.reducingProduction);
			}
			toString() {
				return 'R(' + this.reducingProduction.id + ')';
			}
		};
		LR1Parse.Action.Accept = class extends LR1Parse.Action {
			constructor(reducingProduction) {
				super();
				this.reducingProduction = reducingProduction;
			}
			[_ext__WEBPACK_IMPORTED_MODULE_2__["default"].overrides.equals](that) {
				return that instanceof LR1Parse.Action.Accept
					&& _ext__WEBPACK_IMPORTED_MODULE_2__["default"].equals(this.reducingProduction, that.reducingProduction);
			}
			toString() {
				return 'A';
			}
		};
	}
}


/***/ }),

/***/ "./src/js/ParserBase/_classes.js":
/*!***************************************!*\
  !*** ./src/js/ParserBase/_classes.js ***!
  \***************************************/
/*! exports provided: GSymbol, Terminal, NonTerminal, ActionSymbol, Grammar, Production, LL1Parse, LR0Configuration, LR0FSM, LR1Configuration, LR1FSM, LR1Parse */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _base_symbols__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./base/symbols */ "./src/js/ParserBase/base/symbols/index.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "GSymbol", function() { return _base_symbols__WEBPACK_IMPORTED_MODULE_0__["GSymbol"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "Terminal", function() { return _base_symbols__WEBPACK_IMPORTED_MODULE_0__["Terminal"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "NonTerminal", function() { return _base_symbols__WEBPACK_IMPORTED_MODULE_0__["NonTerminal"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "ActionSymbol", function() { return _base_symbols__WEBPACK_IMPORTED_MODULE_0__["ActionSymbol"]; });

/* harmony import */ var _base_Grammar__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./base/Grammar */ "./src/js/ParserBase/base/Grammar.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "Grammar", function() { return _base_Grammar__WEBPACK_IMPORTED_MODULE_1__["default"]; });

/* harmony import */ var _base_Production__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./base/Production */ "./src/js/ParserBase/base/Production.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "Production", function() { return _base_Production__WEBPACK_IMPORTED_MODULE_2__["default"]; });

/* harmony import */ var _LL1_LL1Parse__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./LL1/LL1Parse */ "./src/js/ParserBase/LL1/LL1Parse.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "LL1Parse", function() { return _LL1_LL1Parse__WEBPACK_IMPORTED_MODULE_3__["default"]; });

/* harmony import */ var _LR0_LR0Configuration__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./LR0/LR0Configuration */ "./src/js/ParserBase/LR0/LR0Configuration.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "LR0Configuration", function() { return _LR0_LR0Configuration__WEBPACK_IMPORTED_MODULE_4__["default"]; });

/* harmony import */ var _LR0_LR0FSM__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./LR0/LR0FSM */ "./src/js/ParserBase/LR0/LR0FSM.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "LR0FSM", function() { return _LR0_LR0FSM__WEBPACK_IMPORTED_MODULE_5__["default"]; });

/* harmony import */ var _LR1_LR1Configuration__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./LR1/LR1Configuration */ "./src/js/ParserBase/LR1/LR1Configuration.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "LR1Configuration", function() { return _LR1_LR1Configuration__WEBPACK_IMPORTED_MODULE_6__["default"]; });

/* harmony import */ var _LR1_LR1FSM__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./LR1/LR1FSM */ "./src/js/ParserBase/LR1/LR1FSM.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "LR1FSM", function() { return _LR1_LR1FSM__WEBPACK_IMPORTED_MODULE_7__["default"]; });

/* harmony import */ var _LR1_LR1Parse__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./LR1/LR1Parse */ "./src/js/ParserBase/LR1/LR1Parse.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "LR1Parse", function() { return _LR1_LR1Parse__WEBPACK_IMPORTED_MODULE_8__["default"]; });










// export { default as LR0Parse } from './LR0/LR0Parse';






/***/ }),

/***/ "./src/js/ParserBase/base/Grammar.js":
/*!*******************************************!*\
  !*** ./src/js/ParserBase/base/Grammar.js ***!
  \*******************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return Grammar; });
/* harmony import */ var _ext__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../_ext */ "./src/js/_ext.js");


class Grammar {
	constructor(terminals, nonTerminals, startSymbol, productions) {
		this.terminals = terminals;
		this.nonTerminals = nonTerminals;
		this.startSymbol = startSymbol;
		this.productions = productions;
		this.productionsMap = _ext__WEBPACK_IMPORTED_MODULE_0__["default"].groupBy(productions, e => e.lhs);
		this.augmentingProduction = productions[0];
	}
}


/***/ }),

/***/ "./src/js/ParserBase/base/Production.js":
/*!**********************************************!*\
  !*** ./src/js/ParserBase/base/Production.js ***!
  \**********************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return Production; });
/* harmony import */ var _symbols__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./symbols */ "./src/js/ParserBase/base/symbols/index.js");


class Production {
	constructor(lhs, rhs) {
		this.id = Production.serialNo++;
		this.lhs = lhs;
		this.rhs = rhs;
	}
	toString() {
		let rhs = this.rhs.length !== 0 ? this.rhs.join(' ') : _symbols__WEBPACK_IMPORTED_MODULE_0__["GSymbol"].LAMBDA;
		return `${this.lhs} ${Production.ARROW} ${rhs}`;
	}
} {
	Production.serialNo = 0;
	Production.ARROW = '→';
}


/***/ }),

/***/ "./src/js/ParserBase/base/symbols/ActionSymbol.js":
/*!********************************************************!*\
  !*** ./src/js/ParserBase/base/symbols/ActionSymbol.js ***!
  \********************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return ActionSymbol; });
/* harmony import */ var _NonTerminal__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./NonTerminal */ "./src/js/ParserBase/base/symbols/NonTerminal.js");


// TODO: currently unused
class ActionSymbol extends _NonTerminal__WEBPACK_IMPORTED_MODULE_0__["default"] {
	constructor(name, displayName, action) {
		super(name, displayName);
		this.action = action;
	}
}


/***/ }),

/***/ "./src/js/ParserBase/base/symbols/GSymbol.js":
/*!***************************************************!*\
  !*** ./src/js/ParserBase/base/symbols/GSymbol.js ***!
  \***************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return GSymbol; });
class GSymbol {
	// Do NOT use 'Symbol', that will conflict with 'Symbol' type in ES6
	constructor(name, displayName) {
		this.name = name;
		this.displayName = displayName || name;
	}
	toString() {
		return this.displayName;
	}
} {
	// the placeholder for lambda (nothing)
	GSymbol.LAMBDA = new GSymbol(Symbol('λ'), 'λ');
	// the indicator for current position of Configuration
	GSymbol.DOT = new GSymbol(Symbol('●'), '●');
}


/***/ }),

/***/ "./src/js/ParserBase/base/symbols/NonTerminal.js":
/*!*******************************************************!*\
  !*** ./src/js/ParserBase/base/symbols/NonTerminal.js ***!
  \*******************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return NonTerminal; });
/* harmony import */ var _GSymbol__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./GSymbol */ "./src/js/ParserBase/base/symbols/GSymbol.js");


class NonTerminal extends _GSymbol__WEBPACK_IMPORTED_MODULE_0__["default"] {
	constructor(name, displayName) {
		super(name, displayName);
	}
} {
	// the augmenting NonTerminal
	_GSymbol__WEBPACK_IMPORTED_MODULE_0__["default"].SYSTEM_GOAL = new NonTerminal(Symbol('system_goal'), 'system_goal');
}


/***/ }),

/***/ "./src/js/ParserBase/base/symbols/Terminal.js":
/*!****************************************************!*\
  !*** ./src/js/ParserBase/base/symbols/Terminal.js ***!
  \****************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return Terminal; });
/* harmony import */ var _GSymbol__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./GSymbol */ "./src/js/ParserBase/base/symbols/GSymbol.js");


class Terminal extends _GSymbol__WEBPACK_IMPORTED_MODULE_0__["default"] {
	constructor(name, displayName) {
		super(name, displayName);
	}
} {
	// the EndOfInput Terminal ($)
	_GSymbol__WEBPACK_IMPORTED_MODULE_0__["default"].EOI = new Terminal(Symbol('$'), '$');
	// the placeholder for unknown terminal type
	_GSymbol__WEBPACK_IMPORTED_MODULE_0__["default"].UNKNOWN = new Terminal(Symbol('unknown'), 'unknown');
}


/***/ }),

/***/ "./src/js/ParserBase/base/symbols/index.js":
/*!*************************************************!*\
  !*** ./src/js/ParserBase/base/symbols/index.js ***!
  \*************************************************/
/*! exports provided: GSymbol, Terminal, NonTerminal, ActionSymbol */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _GSymbol__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./GSymbol */ "./src/js/ParserBase/base/symbols/GSymbol.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "GSymbol", function() { return _GSymbol__WEBPACK_IMPORTED_MODULE_0__["default"]; });

/* harmony import */ var _Terminal__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Terminal */ "./src/js/ParserBase/base/symbols/Terminal.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "Terminal", function() { return _Terminal__WEBPACK_IMPORTED_MODULE_1__["default"]; });

/* harmony import */ var _NonTerminal__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./NonTerminal */ "./src/js/ParserBase/base/symbols/NonTerminal.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "NonTerminal", function() { return _NonTerminal__WEBPACK_IMPORTED_MODULE_2__["default"]; });

/* harmony import */ var _ActionSymbol__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./ActionSymbol */ "./src/js/ParserBase/base/symbols/ActionSymbol.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "ActionSymbol", function() { return _ActionSymbol__WEBPACK_IMPORTED_MODULE_3__["default"]; });







/***/ }),

/***/ "./src/js/ParserBase/index.js":
/*!************************************!*\
  !*** ./src/js/ParserBase/index.js ***!
  \************************************/
/*! exports provided: GSymbol, Terminal, NonTerminal, ActionSymbol, Production, Grammar, LR0Configuration, LR1Configuration, LR0FSM, LR1FSM, LL1Parse, LR1Parse, computeUnreachableSymbols, computeUnreducibleSymbols, computeNullableSymbols, buildFirstSetTable, buildFollowSetTable, buildPredictSetTable, buildLL1PredictTable, buildLR1GotoActionTable, newLL1Parse, newLR1Parse */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "computeUnreachableSymbols", function() { return computeUnreachableSymbols; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "computeUnreducibleSymbols", function() { return computeUnreducibleSymbols; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "computeNullableSymbols", function() { return computeNullableSymbols; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "buildFirstSetTable", function() { return buildFirstSetTable; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "buildFollowSetTable", function() { return buildFollowSetTable; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "buildPredictSetTable", function() { return buildPredictSetTable; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "buildLL1PredictTable", function() { return buildLL1PredictTable; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "buildLR1GotoActionTable", function() { return buildLR1GotoActionTable; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "newLL1Parse", function() { return newLL1Parse; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "newLR1Parse", function() { return newLR1Parse; });
/* harmony import */ var _classes__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_classes */ "./src/js/ParserBase/_classes.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "GSymbol", function() { return _classes__WEBPACK_IMPORTED_MODULE_0__["GSymbol"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "Terminal", function() { return _classes__WEBPACK_IMPORTED_MODULE_0__["Terminal"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "NonTerminal", function() { return _classes__WEBPACK_IMPORTED_MODULE_0__["NonTerminal"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "ActionSymbol", function() { return _classes__WEBPACK_IMPORTED_MODULE_0__["ActionSymbol"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "Production", function() { return _classes__WEBPACK_IMPORTED_MODULE_0__["Production"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "Grammar", function() { return _classes__WEBPACK_IMPORTED_MODULE_0__["Grammar"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "LR0Configuration", function() { return _classes__WEBPACK_IMPORTED_MODULE_0__["LR0Configuration"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "LR1Configuration", function() { return _classes__WEBPACK_IMPORTED_MODULE_0__["LR1Configuration"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "LR0FSM", function() { return _classes__WEBPACK_IMPORTED_MODULE_0__["LR0FSM"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "LR1FSM", function() { return _classes__WEBPACK_IMPORTED_MODULE_0__["LR1FSM"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "LL1Parse", function() { return _classes__WEBPACK_IMPORTED_MODULE_0__["LL1Parse"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "LR1Parse", function() { return _classes__WEBPACK_IMPORTED_MODULE_0__["LR1Parse"]; });

/* harmony import */ var _ext__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../_ext */ "./src/js/_ext.js");



function computeUnreachableSymbols(grammar) {
	let reachableVocabularies = new Set([_classes__WEBPACK_IMPORTED_MODULE_0__["GSymbol"].SYSTEM_GOAL]);

	let processingQueue = [_classes__WEBPACK_IMPORTED_MODULE_0__["GSymbol"].SYSTEM_GOAL];
	while(processingQueue.length !== 0) {
		let processingNT = processingQueue.shift();
		for(let production of grammar.productionsMap.get(processingNT)) {
			for(let v of production.rhs) {
				if(reachableVocabularies.has(v))
					continue;
				reachableVocabularies.add(v);
				if(v instanceof _classes__WEBPACK_IMPORTED_MODULE_0__["NonTerminal"])
					processingQueue.push(v);
			}
		}
	}

	let unreachableSymbols = [
		...grammar.terminals,
		...grammar.nonTerminals
	].filter(symbol => !reachableVocabularies.has(symbol));

	return unreachableSymbols;
}
function computeUnreducibleSymbols(grammar) {
	let reducibleVocabularies = new Set(grammar.terminals);
	let processingMap = new Map(grammar.productionsMap);
	let needUpdate = true;
	while(processingMap.size !== 0 && needUpdate) {
		needUpdate = false;
		for(let nt of processingMap.keys()) {
			let processingProductions = processingMap.get(nt);
			for(let production of processingProductions) {
				let { lhs, rhs } = production;
				let isReducible = true;
				for(let v of rhs) {
					if(!reducibleVocabularies.has(v)) {
						isReducible = false;
						break;
					}
				}
				if(isReducible) {
					reducibleVocabularies.add(lhs);
					processingMap.delete(lhs);
					needUpdate = true;
					break;
				}
			}
		}
	}

	let unreducibleSymbols = grammar.nonTerminals
		.filter(symbol => !reducibleVocabularies.has(symbol));

	return unreducibleSymbols;
}
function computeNullableSymbols(grammar) {
	let nullableSymbols = new Set();
	let processingMap = new Map(grammar.productionsMap);
	let needUpdate = true;
	while(processingMap.size !== 0 && needUpdate) {
		needUpdate = false;
		for(let key of processingMap.keys()) {
			let processingProductions = processingMap.get(key);
			for(let production of processingProductions) {
				let { lhs, rhs } = production;
				let isNullable = true;
				for(let v of rhs) {
					if(!nullableSymbols.has(v)) {
						isNullable = false;
						break;
					}
				}
				if(isNullable) {
					nullableSymbols.add(lhs);
					processingMap.delete(lhs);
					needUpdate = true;
					break;
				}
			}
		}
	}

	return nullableSymbols;
}
function buildFirstSetTable(grammar, nullableSymbols) {
	let firstSetTable = new Map();
	for(let t of grammar.terminals)
		firstSetTable.set(t, new Set([t]));
	for(let nt of grammar.nonTerminals)
		firstSetTable.set(nt, new Set([]));

	// iteratively adding FirstSet
	let lastUpdatedVocabularies = new Set(grammar.terminals);
	while(lastUpdatedVocabularies.size !== 0) {
		let newUpdatedVocabularies = new Set();
		for(let production of grammar.productions) {
			let { lhs, rhs } = production;
			let firstSetOfLHS = firstSetTable.get(lhs);
			let lhsUpdated = false;
			for(let rhsi of rhs) {
				if(lastUpdatedVocabularies.has(rhsi)) {
					let firstSetOfRHSI = firstSetTable.get(rhsi);
					let added = _ext__WEBPACK_IMPORTED_MODULE_1__["default"].addAll(firstSetOfLHS, firstSetOfRHSI);
					lhsUpdated = lhsUpdated || added.size !== 0;
				}
				if(!nullableSymbols.has(rhsi))
					break;
			}
			if(lhsUpdated)
				newUpdatedVocabularies.add(lhs);
		}
		lastUpdatedVocabularies = newUpdatedVocabularies;
	}

	for(let nullableSymbol of nullableSymbols) {
		firstSetTable.get(nullableSymbol).add(_classes__WEBPACK_IMPORTED_MODULE_0__["GSymbol"].LAMBDA);
	}

	return firstSetTable;
}
function buildFollowSetTable(grammar, firstSetTable) {
	let followSetTable = new Map();
	let seeThroughTable = new Map();
	for(let nt of grammar.nonTerminals) {
		followSetTable.set(nt, new Set());
		seeThroughTable.set(nt, new Set());
	}

	// stage 1: adding terminals from first set (one pass)
	for(let production of grammar.productions) {
		let { lhs, rhs } = production;
		for(let i = 0; i < rhs.length; i++) {
			if(!(rhs[i] instanceof _classes__WEBPACK_IMPORTED_MODULE_0__["NonTerminal"]))
				continue;	// only consider NonTerminals

			let followSetOfRHSI = followSetTable.get(rhs[i]);
			let blocked = false;
			for(let j = i + 1; j < rhs.length; j++) {
				for(let t of firstSetTable.get(rhs[j])) {
					if(t !== _classes__WEBPACK_IMPORTED_MODULE_0__["GSymbol"].LAMBDA)
						followSetOfRHSI.add(t);
				}
				if(!firstSetTable.get(rhs[j]).has(_classes__WEBPACK_IMPORTED_MODULE_0__["GSymbol"].LAMBDA)) {
					blocked = true;
					break;
				}
			}
			if(!blocked) {
				seeThroughTable.get(rhs[i]).add(lhs);		// rhs[i] can see through lhs
			}
		}
	}

	// state 2: iteratively adding FollowSet
	let lastUpdatedVocabularies = new Set(grammar.nonTerminals);
	while(lastUpdatedVocabularies.size !== 0) {
		let newUpdatedVocabularies = new Set();
		for(let [nt, lhnts] of seeThroughTable) {
			let followSetOfNT = followSetTable.get(nt);
			let ntUpdated = false;
			for(let lhnt of lhnts) {
				if(lastUpdatedVocabularies.has(lhnt)) {
					let followSetOfLHNT = followSetTable.get(lhnt);
					let added = _ext__WEBPACK_IMPORTED_MODULE_1__["default"].addAll(followSetOfNT, followSetOfLHNT);
					ntUpdated = ntUpdated || added.size !== 0;
				}
			}
			if(ntUpdated)
				newUpdatedVocabularies.add(nt);
		}
		lastUpdatedVocabularies = newUpdatedVocabularies;
	}
	followSetTable.get(_classes__WEBPACK_IMPORTED_MODULE_0__["GSymbol"].SYSTEM_GOAL).add(_classes__WEBPACK_IMPORTED_MODULE_0__["GSymbol"].LAMBDA);

	return followSetTable;
}
function buildPredictSetTable(grammar, firstSetTable, followSetTable) {
	let predictSetTable = new Map();
	for(let production of grammar.productions) {
		let { lhs, rhs } = production;
		let predictSetOfProduction = new Set();
		let blocked = false;
		for(let i = 0; i < rhs.length; i++) {
			for(let t of firstSetTable.get(rhs[i]))
				predictSetOfProduction.add(t);
			if(!firstSetTable.get(rhs[i]).has(_classes__WEBPACK_IMPORTED_MODULE_0__["GSymbol"].LAMBDA)) {
				blocked = true;
				break;
			}
		}
		if(!blocked) {
			for(let t of followSetTable.get(lhs))
				predictSetOfProduction.add(t);
		}

		predictSetTable.set(production, predictSetOfProduction);
	}

	return predictSetTable;
}
function buildLL1PredictTable(grammar, predictSetTable) {
	let ll1PredictTable = new Map();
	for(let [nt, prods] of grammar.productionsMap) {
		let ntPredictSet = new Map();
		for(let prod of prods) {
			for(let t of predictSetTable.get(prod)) {
				if(!ntPredictSet.has(t))
					ntPredictSet.set(t, []);
				ntPredictSet.get(t).push(prod);
			}
		}
		ll1PredictTable.set(nt, ntPredictSet);
	}

	return ll1PredictTable;
}
function buildLR1GotoActionTable(grammar, lr1fsm) {
	let lr1GotoActionTable = new Map();
	let globalActionMap = {
		shift: new Map(Array.from(lr1fsm.states).map((s) => [s, new _classes__WEBPACK_IMPORTED_MODULE_0__["LR1Parse"].Action.Shift(s)])),
		pshift: new Map(Array.from(lr1fsm.states).map((s) => [s, new _classes__WEBPACK_IMPORTED_MODULE_0__["LR1Parse"].Action.PseudoShift(s)])),
		reduce: new Map(grammar.productions.map((p) => [p, new _classes__WEBPACK_IMPORTED_MODULE_0__["LR1Parse"].Action.Reduce(p)])),
		accept: new _classes__WEBPACK_IMPORTED_MODULE_0__["LR1Parse"].Action.Accept(grammar.augmentingProduction)
	};
	for(let state of lr1fsm.states) {
		let gotoActionsMap = new Map();
		// general shift & accept
		for(let [symbol, nextState] of state.transitionMap) {
			if(!gotoActionsMap.has(symbol))
				gotoActionsMap.set(symbol, []);
			if(symbol === _classes__WEBPACK_IMPORTED_MODULE_0__["GSymbol"].EOI)
				gotoActionsMap.get(symbol).push(globalActionMap.accept);
			else if(symbol instanceof _classes__WEBPACK_IMPORTED_MODULE_0__["Terminal"])
				gotoActionsMap.get(symbol).push(globalActionMap.shift.get(nextState));
			else if(symbol instanceof _classes__WEBPACK_IMPORTED_MODULE_0__["NonTerminal"])
				gotoActionsMap.get(symbol).push(globalActionMap.pshift.get(nextState));
			else
				throw new Error('something went wrong in transitionMap of state.');
		}
		// reduce
		for(let [lookahead, confs] of
			_ext__WEBPACK_IMPORTED_MODULE_1__["default"].groupBy(
				Array.from(state.configurationSet.values())
					.filter(lr1conf => lr1conf.baseLR0Configuration.getNextSymbol() === null),
				lr1conf => lr1conf.lookahead
			)
		) {
			for(let lr1conf of confs) {
				if(lookahead === _classes__WEBPACK_IMPORTED_MODULE_0__["GSymbol"].LAMBDA)
					continue;
				if(!gotoActionsMap.has(lookahead))
					gotoActionsMap.set(lookahead, []);
				gotoActionsMap.get(lookahead).push(
					globalActionMap.reduce.get(lr1conf.baseLR0Configuration.production)
				);
			}
		}
		lr1GotoActionTable.set(state, gotoActionsMap);
	}

	return lr1GotoActionTable;
}
function newLL1Parse(grammar, ll1PredictTable, inputTokens) {
	return new _classes__WEBPACK_IMPORTED_MODULE_0__["LL1Parse"](grammar, ll1PredictTable, inputTokens);
}
function newLR1Parse(grammar, lr1FSM, lr1GotoActionTable, inputTokens) {
	return new _classes__WEBPACK_IMPORTED_MODULE_0__["LR1Parse"](grammar, lr1FSM, lr1GotoActionTable, inputTokens);
}




/***/ }),

/***/ "./src/js/_ext.js":
/*!************************!*\
  !*** ./src/js/_ext.js ***!
  \************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
let overrides = {
	equals: Symbol('equals')
};

function equals(_this, _that) {
	if(typeof _this[overrides.equals] === 'function') {
		return _this[overrides.equals](_that);
	} else if(_this instanceof Map) {
		if(_this === _that)
			return true;
		if(!(_that instanceof Map) || _this.size !== _that.size)
			return false;
		for(let k of _this.keys()) {
			if(!_that.has(k))
				return false;
			let vThis = _this.get(k), vThat = _that.get(k);
			if(!equals(vThis, vThat))
				return false;
		}
		return true;
	} else if(_this instanceof Set) {
		if(_this === _that)
			return true;
		if(!(_that instanceof Set) || _this.size !== _that.size)
			return false;
		for(let e of _this)
			if(!_that.has(e))
				return false;
		return true;
	} else if(_this instanceof Array) {
		if(_this === _that)
			return true;
		if(!(_that instanceof Array) || _this.length !== _that.length)
			return false;
		for(let i=0; i<_this.length; i++) {
			let vThis = _this[i], vThat = _that[i];
			if(!equals(vThis, vThat))
				return false;
		}
		return true;
	} else {
		return _this === _that;
	}
}
function groupBy(_this, mapf) {
	if(_this instanceof Set) {
		let groups = new Map();
		for(let e of _this) {
			let group = mapf(e);
			if(!groups.has(group))
				groups.set(group, new Set());
			groups.get(group).add(e);
		}
		return groups;
	} else if(_this instanceof Array) {
		let groups = new Map();
		for(let e of _this) {
			let group = mapf(e);
			if(!groups.has(group))
				groups.set(group, []);
			groups.get(group).push(e);
		}
		return groups;
	} else {
		throw new Error("'groupBy' is not supported by this class.");
	}
}
function addAll(_this, _that) {
	if(_this instanceof Set) {
		let added = new Set();
		for(let e of _that) {
			if(!_this.has(e)) {
				_this.add(e);
				added.add(e);
			}
		}
		return added;
	} else {
		throw new Error("'addAll' is not supported by this class.");
	}
}

/* harmony default export */ __webpack_exports__["default"] = ({
	overrides,
	equals,
	groupBy,
	addAll,
});


/***/ }),

/***/ "./src/js/main/graphviz_functions.js":
/*!*******************************************!*\
  !*** ./src/js/main/graphviz_functions.js ***!
  \*******************************************/
/*! exports provided: buildDotSourceOfCFSM, buildDotSourceOfParseTrees */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "buildDotSourceOfCFSM", function() { return buildDotSourceOfCFSM; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "buildDotSourceOfParseTrees", function() { return buildDotSourceOfParseTrees; });
/* harmony import */ var _ext__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../_ext */ "./src/js/_ext.js");
/* harmony import */ var _ParserBase__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../ParserBase */ "./src/js/ParserBase/index.js");




function dotStringOf(self) {
	if(self instanceof _ParserBase__WEBPACK_IMPORTED_MODULE_1__["GSymbol"]) {
		return self.displayName;
	} else if(self instanceof _ParserBase__WEBPACK_IMPORTED_MODULE_1__["LL1Parse"].TreeNode) {
		return dotStringOf(self.symbol);
	} else if(self instanceof _ParserBase__WEBPACK_IMPORTED_MODULE_1__["LR1Parse"].TreeNode) {
		return dotStringOf(self.symbol);
	} else if(self instanceof _ParserBase__WEBPACK_IMPORTED_MODULE_1__["LR0Configuration"]) {
		let r = self.production.rhs.slice();
		r.splice(self.dotPos, 0, _ParserBase__WEBPACK_IMPORTED_MODULE_1__["GSymbol"].DOT);
		return dotStringOf(self.production.lhs) + ' → ' + r.map(e => dotStringOf(e)).join(' ');
	} else if(self instanceof _ParserBase__WEBPACK_IMPORTED_MODULE_1__["LR0FSM"].State) {
		return Array.from(self.configurationSet)
			.map(function(lr0conf) {
				return dotStringOf(lr0conf) + '\\l';
			}).join('');
	} else if(self instanceof _ParserBase__WEBPACK_IMPORTED_MODULE_1__["LR1FSM"].State) {
		return Array.from(_ext__WEBPACK_IMPORTED_MODULE_0__["default"].groupBy(self.configurationSet, e => e.baseLR0Configuration).entries())
			.map(function([lr0conf, lr1confs]) {
				return dotStringOf(lr0conf) + ' ' + '{ ' +
					Array.from(lr1confs).map(e => dotStringOf(e.lookahead)).join(' ') +
				' }' + '\\l';
			}).join('');
	} else if(self instanceof _ParserBase__WEBPACK_IMPORTED_MODULE_1__["Production"]) {
		return (dotStringOf(self.lhs) + ' → ' +
			(self.rhs.length !== 0 ? self.rhs.map(e => dotStringOf(e)).join(' ') : dotStringOf(_ParserBase__WEBPACK_IMPORTED_MODULE_1__["GSymbol"].LAMBDA)));
	} else {
		throw new Error(`${self} has no dotString representation.`);
	}
}

function buildDotSourceOfCFSM(cfsm) {
	let dotFileSrc = `\
		digraph CFSM {
			rankdir = "LR";
			node [shape = rect];
			start -> ${cfsm.startState.id};
		`;
	for(let state of cfsm.states) {
		dotFileSrc += `\
			${state.id} [
				label = "State ${state.id}\\n${dotStringOf(state)}"
			];
		`;
		for(let [symbol, nextState] of state.transitionMap) {
			dotFileSrc += `\
				${state.id} -> ${nextState.id} [
					label = "${dotStringOf(symbol)}"
					style = solid
				];
			`;
		}
	}
	dotFileSrc += `\
		}
	`;

	return dotFileSrc;
}
function buildDotSourceOfParseTrees(parseTrees) {
	let dotFileSrc = `\
		digraph ParseTree {
			rankdir = "UD";
			node [shape = ellipse]\n`;

	for(let parseTree of parseTrees)
		traverseNode(parseTree);

	dotFileSrc += `\
		}
	`;

	return dotFileSrc;

	function traverseNode(node) {
		dotFileSrc += `\
			${node.id} [label = "${dotStringOf(node)}"];
		`;

		if(node.childNodes === undefined)
			return;

		for(let childNode of node.childNodes)
			dotFileSrc += `\
				${node.id} -> ${childNode.id};
			`;
		for(let childNode of node.childNodes)
			traverseNode(childNode);
	}
}


/***/ }),

/***/ "./src/js/main/index.js":
/*!******************************!*\
  !*** ./src/js/main/index.js ***!
  \******************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var jquery__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! jquery */ "./node_modules/jquery/dist/jquery.js");
/* harmony import */ var jquery__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(jquery__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _ParserBase__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../ParserBase */ "./src/js/ParserBase/index.js");
/* harmony import */ var viz_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! viz.js */ "./node_modules/viz.js/viz.es.js");
/* harmony import */ var file_loader_viz_js_full_render_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! file-loader!viz.js/full.render.js */ "./node_modules/file-loader/dist/cjs.js!./node_modules/viz.js/full.render.js");
/* harmony import */ var file_loader_viz_js_full_render_js__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(file_loader_viz_js_full_render_js__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var canvg_browser__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! canvg-browser */ "./node_modules/canvg-browser/index.js");
/* harmony import */ var canvg_browser__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(canvg_browser__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _main_functions__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./main_functions */ "./src/js/main/main_functions.js");
/* harmony import */ var _graphviz_functions__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./graphviz_functions */ "./src/js/main/graphviz_functions.js");
/* harmony import */ var _main_util__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./main_util */ "./src/js/main/main_util.js");













const viz = new viz_js__WEBPACK_IMPORTED_MODULE_2__["default"]({ workerURL: file_loader_viz_js_full_render_js__WEBPACK_IMPORTED_MODULE_3___default.a });

let COMMA_SEPARATOR = '<span class="comma"> , </span>';

window.onerror = function(message, file, lineNumber) {
	window.alert(`${message}\n\nat ${file}:${lineNumber}`);
	return false;
};

jquery__WEBPACK_IMPORTED_MODULE_0___default()(document).ready(function() {

	let editMode = true;

	let tmpCanvas = document.getElementById('tmpCanvas');
	initTabs();

	// insert sample input
	jquery__WEBPACK_IMPORTED_MODULE_0___default()('#grammar_input').text(__webpack_require__(/*! raw-loader!~/example-cfgs/Micro.txt */ "./node_modules/raw-loader/dist/cjs.js!./example-cfgs/Micro.txt").default);

	// handle setup of grammar input
	jquery__WEBPACK_IMPORTED_MODULE_0___default()('#grammar_form').on('submit', function() {
		if(!editMode) {
			jquery__WEBPACK_IMPORTED_MODULE_0___default()('#info').slideUp(function() {
				editMode = true;
				jquery__WEBPACK_IMPORTED_MODULE_0___default()('#generate').val('Generate');
				jquery__WEBPACK_IMPORTED_MODULE_0___default()('#editor').slideDown();
			});
			return false;
		}

		let rawGrammar = Object(_main_functions__WEBPACK_IMPORTED_MODULE_5__["processGrammarInput"])(jquery__WEBPACK_IMPORTED_MODULE_0___default()('#grammar_input').val());

		if(rawGrammar.extraResult.parseExample !== undefined) {
			jquery__WEBPACK_IMPORTED_MODULE_0___default()('.source_input').val(rawGrammar.extraResult.parseExample);
		}

		let grammar = Object(_main_functions__WEBPACK_IMPORTED_MODULE_5__["buildGrammar"])(Array.from(rawGrammar.terminals), Array.from(rawGrammar.nonTerminals), rawGrammar.startSymbol, rawGrammar.productions);
		let vocabularyNameMap = Object(_main_functions__WEBPACK_IMPORTED_MODULE_5__["buildVocabularyNameMap"])(grammar);
		let unreachableSymbols = Object(_ParserBase__WEBPACK_IMPORTED_MODULE_1__["computeUnreachableSymbols"])(grammar);
		let unreducibleSymbols = Object(_ParserBase__WEBPACK_IMPORTED_MODULE_1__["computeUnreducibleSymbols"])(grammar);
		let nullableSymbols = Object(_ParserBase__WEBPACK_IMPORTED_MODULE_1__["computeNullableSymbols"])(grammar);
		let firstSetTable = Object(_ParserBase__WEBPACK_IMPORTED_MODULE_1__["buildFirstSetTable"])(grammar, nullableSymbols);
		let followSetTable = Object(_ParserBase__WEBPACK_IMPORTED_MODULE_1__["buildFollowSetTable"])(grammar, firstSetTable);
		let predictSetTable = Object(_ParserBase__WEBPACK_IMPORTED_MODULE_1__["buildPredictSetTable"])(grammar, firstSetTable, followSetTable);
		let ll1PredictTable = Object(_ParserBase__WEBPACK_IMPORTED_MODULE_1__["buildLL1PredictTable"])(grammar, predictSetTable);
		let lr0FSM = _ParserBase__WEBPACK_IMPORTED_MODULE_1__["LR0FSM"].from(grammar);
		let lr1FSM = _ParserBase__WEBPACK_IMPORTED_MODULE_1__["LR1FSM"].from(grammar, firstSetTable);
		let lr1GotoActionTable = Object(_ParserBase__WEBPACK_IMPORTED_MODULE_1__["buildLR1GotoActionTable"])(grammar, lr1FSM);

		let terminalsList = Array.from(grammar.terminals);
		let nonTerminalsList = Array.from(grammar.nonTerminals);
		let symbolsList = [...terminalsList, ...nonTerminalsList];

		_ParserBase__WEBPACK_IMPORTED_MODULE_1__["NonTerminal"].prototype.toString = function() {
			let classArr = ['gsymbol','non-terminal'];
			if(this === _ParserBase__WEBPACK_IMPORTED_MODULE_1__["GSymbol"].SYSTEM_GOAL)
				classArr.push('augmenting-symbol');
			if(this === grammar.startSymbol)
				classArr.push('start-symbol');
			if(nullableSymbols.has(this))		// need nullableSymbols
				classArr.push('nullable');
			return '<span class="' + classArr.join(' ') + '">' + this.displayName + '</span>';
		};

		// display
		jquery__WEBPACK_IMPORTED_MODULE_0___default()('#editor').slideUp(function() {
			// Grammar tab
			jquery__WEBPACK_IMPORTED_MODULE_0___default()('#grammar').html('<table style="width: 100%;"><tr>' +

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
			jquery__WEBPACK_IMPORTED_MODULE_0___default()('#lambda').html('<table class="compact-table hoverable">' +
				'<tr><th>NonTerminal</th></tr>' +
				(nullableSymbols.size > 0 ?
					Array.from(nullableSymbols).map(e => '<tr><td>' + e + '</td></tr>').join('')
					: '<tr><td class="lambda">(none)</td></tr>'
				) +
			'</table>');

			// FirstSet(1) tab
			jquery__WEBPACK_IMPORTED_MODULE_0___default()('#first').html('<table class="compact-table hoverable">' +
				'<tr><th>NonTerminal</th><th>FirstSet</th></tr>' +
				Array.from(firstSetTable.entries())
					.filter(function([symbol, /*_firstSet*/]) {
						return (symbol instanceof _ParserBase__WEBPACK_IMPORTED_MODULE_1__["NonTerminal"]);
					}).map(function([symbol, firstSet]) {
						return {
							symbol: symbol,
							firstSet: Array.from(firstSet)
						};
					}).map(function({symbol, firstSet}) {
						return ('<tr>' +
							'<td>' + symbol + '</td>' +
							'<td>' + firstSet.join(COMMA_SEPARATOR) + '</td>' +
						'</tr>');
					}).join('') +
			'</table>');

			// FollowSet(1) tab
			jquery__WEBPACK_IMPORTED_MODULE_0___default()('#follow').html('<table class="compact-table hoverable">' +
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
							'<td>' + followSet.join(COMMA_SEPARATOR) + '</td>' +
						'</tr>');
					}).join('') +
			'</table>');

			// PredictSet(1) tab
			jquery__WEBPACK_IMPORTED_MODULE_0___default()('#predict').html('<table class="compact-table hoverable">' +
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
								(production.rhs.length !== 0 ? production.rhs.join(' ') : _ParserBase__WEBPACK_IMPORTED_MODULE_1__["GSymbol"].LAMBDA),
								predictSet.join(COMMA_SEPARATOR)
							], 'td') +
						'</tr>');
					}).join('') +
			'</table>');

			// LL(1) Table tab
			jquery__WEBPACK_IMPORTED_MODULE_0___default()('#ll1table').html('<table class="compact-table hoverable">' +
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
			jquery__WEBPACK_IMPORTED_MODULE_0___default()('#lr1table').html('<table class="compact-table hoverable">' +
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
			jquery__WEBPACK_IMPORTED_MODULE_0___default()('#lr0fsm').html('Please click on the button above to generate the FSM diagram.');
			jquery__WEBPACK_IMPORTED_MODULE_0___default()('#lr0fsm_gen').on('click', async function() {
				let lr0FSM_Viz = await viz.renderString(Object(_graphviz_functions__WEBPACK_IMPORTED_MODULE_6__["buildDotSourceOfCFSM"])(lr0FSM));
				jquery__WEBPACK_IMPORTED_MODULE_0___default()('#lr0fsm').html(lr0FSM_Viz);
				jquery__WEBPACK_IMPORTED_MODULE_0___default()('#lr0fsm_tab a.downloadLink').show().on('click', function(event) {
					canvg_browser__WEBPACK_IMPORTED_MODULE_4___default()(tmpCanvas, lr0FSM_Viz);
					event.target.href = tmpCanvas.toDataURL('image/png');
				});
			});

			// LR(1) FSM tab
			jquery__WEBPACK_IMPORTED_MODULE_0___default()('#lr1fsm').html('Please click on the button above to generate the FSM diagram.');
			jquery__WEBPACK_IMPORTED_MODULE_0___default()('#lr1fsm_gen').on('click', async function() {
				let lr1FSM_Viz = await viz.renderString(Object(_graphviz_functions__WEBPACK_IMPORTED_MODULE_6__["buildDotSourceOfCFSM"])(lr1FSM));
				jquery__WEBPACK_IMPORTED_MODULE_0___default()('#lr1fsm').html(lr1FSM_Viz);
				jquery__WEBPACK_IMPORTED_MODULE_0___default()('#lr1fsm_tab a.downloadLink').show().on('click', function(event) {
					canvg_browser__WEBPACK_IMPORTED_MODULE_4___default()(tmpCanvas, lr1FSM_Viz);
					event.target.href = tmpCanvas.toDataURL('image/png');
				});
			});

			// LL(1) Parse tab
			jquery__WEBPACK_IMPORTED_MODULE_0___default()('#ll1parse .start_parse').off('click');
			jquery__WEBPACK_IMPORTED_MODULE_0___default()('#ll1parse .parse_next_btn').off('click');
			jquery__WEBPACK_IMPORTED_MODULE_0___default()('#ll1parse .view_parse_tree').off('click');
			jquery__WEBPACK_IMPORTED_MODULE_0___default()('#ll1parse .start_parse').on('click', function() {
				let inputTokens = Object(_main_functions__WEBPACK_IMPORTED_MODULE_5__["processParseInput"])(jquery__WEBPACK_IMPORTED_MODULE_0___default()('#ll1parse .source_input').val(), vocabularyNameMap);
				let currentParse = Object(_ParserBase__WEBPACK_IMPORTED_MODULE_1__["newLL1Parse"])(grammar, ll1PredictTable, inputTokens);
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
						if(stepInfo instanceof _ParserBase__WEBPACK_IMPORTED_MODULE_1__["LL1Parse"].Action.Match) {
							updateMsg(`Match ${stepInfo.terminalType}`);
							jquery__WEBPACK_IMPORTED_MODULE_0___default()('#ll1parse .parse_stack td').first().addClass('highlighted');
							jquery__WEBPACK_IMPORTED_MODULE_0___default()('#ll1parse .itoken_stream td').first().addClass('highlighted');
							yield;
							updateData();
							yield;
						} else if(stepInfo instanceof _ParserBase__WEBPACK_IMPORTED_MODULE_1__["LL1Parse"].Action.Predict) {
							updateMsg(`Predict ${stepInfo.usingProd}`);
							jquery__WEBPACK_IMPORTED_MODULE_0___default()('#ll1parse .parse_stack td').first().addClass('highlighted');
							yield;
							updateData();
							jquery__WEBPACK_IMPORTED_MODULE_0___default()('#ll1parse .parse_stack td').slice(0,stepInfo.usingProd.rhs.length).addClass('highlighted');
							yield;
						} else if(stepInfo instanceof _ParserBase__WEBPACK_IMPORTED_MODULE_1__["LL1Parse"].Action.Accept) {
							updateMsg(`Match ${stepInfo.terminalType} & Accept`);
							jquery__WEBPACK_IMPORTED_MODULE_0___default()('#ll1parse .parse_stack td').first().addClass('highlighted');
							jquery__WEBPACK_IMPORTED_MODULE_0___default()('#ll1parse .itoken_stream td').first().addClass('highlighted');
							yield;
							updateData();
							yield;
						}
						clearHighlight();
					}
				})();

				f = f.next.bind(f);
				jquery__WEBPACK_IMPORTED_MODULE_0___default()('#ll1parse .parse_next_btn').off('click').on('click', f);
				jquery__WEBPACK_IMPORTED_MODULE_0___default()('#ll1parse .skip_all_btn').off('click').on('click', function() {
					while(f && !f().done);
				});
				jquery__WEBPACK_IMPORTED_MODULE_0___default()('#ll1parse .view_parse_tree').off('click').on('click', displayParseTree);

				function updateMsg(msg) {
					jquery__WEBPACK_IMPORTED_MODULE_0___default()('#ll1parse .parse_step_info').html(msg);
				}
				function clearHighlight() {
					jquery__WEBPACK_IMPORTED_MODULE_0___default()('#ll1parse .parse_stack td').removeClass('highlighted');
					jquery__WEBPACK_IMPORTED_MODULE_0___default()('#ll1parse .itoken_stream td').removeClass('highlighted');
				}
				function updateData() {
					// update stacks
					jquery__WEBPACK_IMPORTED_MODULE_0___default()('#ll1parse .parse_stack').html(tagList(parseStack.slice().reverse(), 'td'));
					jquery__WEBPACK_IMPORTED_MODULE_0___default()('#ll1parse .itoken_stream').html(tagList(inputTokens.map(e => e.terminalType), 'td'));
					jquery__WEBPACK_IMPORTED_MODULE_0___default()('#ll1parse .semantic_stack').html(
						[...rhsStack, [currentParse.currentRHS, currentParse.currentRHSIndex]]
							.map(([currentRHS, currentRHSIndex]) => {
								return '<table><tr>' + currentRHS.map((ee, ii) => {
									if(ii === currentRHSIndex)
										return '<td class="highlighted">' + ee + '</td>';
									else
										return '<td>' + ee + '</td>';
								}).join('') + '</tr></table>';
							}).join(''));
					jquery__WEBPACK_IMPORTED_MODULE_0___default()('#ll1parse .parse_step_info').html('');
				}
				async function displayParseTree() {
					let ll1parsetree_Viz = await viz.renderString(Object(_graphviz_functions__WEBPACK_IMPORTED_MODULE_6__["buildDotSourceOfParseTrees"])([parseTree]));
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
							canvg_browser__WEBPACK_IMPORTED_MODULE_4___default()(tmpCanvas, ll1parsetree_Viz);
							event.target.href = tmpCanvas.toDataURL('image/png');
						};
					} myWindow.document.close();
				}
			});

			// LR(1) Parse tab
			jquery__WEBPACK_IMPORTED_MODULE_0___default()('#lr1parse .start_parse').off('click');
			jquery__WEBPACK_IMPORTED_MODULE_0___default()('#lr1parse .parse_next_btn').off('click');
			jquery__WEBPACK_IMPORTED_MODULE_0___default()('#lr1parse .view_parse_tree').off('click');
			jquery__WEBPACK_IMPORTED_MODULE_0___default()('#lr1parse .start_parse').on('click', function() {
				let inputTokens = Object(_main_functions__WEBPACK_IMPORTED_MODULE_5__["processParseInput"])(jquery__WEBPACK_IMPORTED_MODULE_0___default()('#lr1parse .source_input').val(), vocabularyNameMap);
				let currentParse = Object(_ParserBase__WEBPACK_IMPORTED_MODULE_1__["newLR1Parse"])(grammar, lr1FSM, lr1GotoActionTable, inputTokens);
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
						if(stepInfo instanceof _ParserBase__WEBPACK_IMPORTED_MODULE_1__["LR1Parse"].Action.Shift) {
							updateMsg('Shift');
							jquery__WEBPACK_IMPORTED_MODULE_0___default()('#lr1parse .itoken_stream td').first().addClass('highlighted');
							yield;
							updateData();
							jquery__WEBPACK_IMPORTED_MODULE_0___default()('#lr1parse .parse_stack td').last().addClass('highlighted');
							yield;
						} else if(stepInfo instanceof _ParserBase__WEBPACK_IMPORTED_MODULE_1__["LR1Parse"].Action.Reduce) {
							updateMsg('Reduce ' + stepInfo.reducingProduction.toStringReversed());
							if(stepInfo.reducingProduction.rhs.length>0)
								jquery__WEBPACK_IMPORTED_MODULE_0___default()('#lr1parse .parse_stack td').slice(-stepInfo.reducingProduction.rhs.length).addClass('highlighted');
							yield;
							updateData();
							jquery__WEBPACK_IMPORTED_MODULE_0___default()('#lr1parse .parse_stack td').last().addClass('highlighted');
							yield;
						} else if(stepInfo instanceof _ParserBase__WEBPACK_IMPORTED_MODULE_1__["LR1Parse"].Action.Accept) {
							updateMsg('Shift & Reduce ' + stepInfo.reducingProduction.toStringReversed() + ' & Accept');
							jquery__WEBPACK_IMPORTED_MODULE_0___default()('#lr1parse .itoken_stream td').first().addClass('highlighted');
							jquery__WEBPACK_IMPORTED_MODULE_0___default()('#lr1parse .parse_stack td').addClass('highlighted');
							yield;
							updateData();
							jquery__WEBPACK_IMPORTED_MODULE_0___default()('#lr1parse .parse_stack td').last().addClass('highlighted');
							yield;
						}
						clearHighlight();
					}
				})();
				f = f.next.bind(f);

				jquery__WEBPACK_IMPORTED_MODULE_0___default()('#lr1parse .parse_next_btn').off('click').on('click', f);
				jquery__WEBPACK_IMPORTED_MODULE_0___default()('#lr1parse .skip_all_btn').off('click').on('click', function() {
					while(f && !f().done);
				});
				jquery__WEBPACK_IMPORTED_MODULE_0___default()('#lr1parse .view_parse_tree').off('click').on('click', displayParseTree);

				function updateMsg(msg) {
					jquery__WEBPACK_IMPORTED_MODULE_0___default()('#lr1parse .parse_step_info').html(msg);
				}
				function clearHighlight() {
					jquery__WEBPACK_IMPORTED_MODULE_0___default()('#lr1parse .parse_stack td').removeClass('highlighted');
					jquery__WEBPACK_IMPORTED_MODULE_0___default()('#lr1parse .itoken_stream td').removeClass('highlighted');
				}
				function updateData() {
					jquery__WEBPACK_IMPORTED_MODULE_0___default()('#lr1parse .parse_stack').html(tagList(parseStack, 'td'));
					jquery__WEBPACK_IMPORTED_MODULE_0___default()('#lr1parse .itoken_stream').html(tagList(inputTokens.map(e => e.terminalType), 'td'));
					jquery__WEBPACK_IMPORTED_MODULE_0___default()('#lr1parse .state_stack').html(tagList(stateStack.map(e => e.id), 'td'));
					jquery__WEBPACK_IMPORTED_MODULE_0___default()('#lr1parse .parse_step_info').html('');
				}
				async function displayParseTree() {
					let lr1parsetree_Viz = await viz.renderString(Object(_graphviz_functions__WEBPACK_IMPORTED_MODULE_6__["buildDotSourceOfParseTrees"])(parseForest));
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
							canvg_browser__WEBPACK_IMPORTED_MODULE_4___default()(tmpCanvas, lr1parsetree_Viz);
							event.target.href = tmpCanvas.toDataURL('image/png');
						};
					} myWindow.document.close();
				}
			});

			jquery__WEBPACK_IMPORTED_MODULE_0___default()('#generate').val('Edit');
			editMode = false;
			jquery__WEBPACK_IMPORTED_MODULE_0___default()('#info').slideDown();
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
	for(let tabName in tablis) {
		jquery__WEBPACK_IMPORTED_MODULE_0___default()('#tab_ul').append(
			jquery__WEBPACK_IMPORTED_MODULE_0___default()(`<li><a name="${tabName}" href="javascript:void(0);" class="tablinks">${tablis[tabName]}</a></li>`)
				.on('click', () => openTab(tabName))
		);
	}
	document.getElementsByClassName('tablinks')[0].click();
}

function tagList(eArr, tagName) {
	return eArr.map(e => `<${tagName}>${e}</${tagName}>`).join('');
}

function openTab(tabName) {
	jquery__WEBPACK_IMPORTED_MODULE_0___default()('.tabcontent').css('display', 'none');
	jquery__WEBPACK_IMPORTED_MODULE_0___default()('.tablinks').removeClass('active');
	jquery__WEBPACK_IMPORTED_MODULE_0___default()('#'+tabName).css('display', 'block');
	jquery__WEBPACK_IMPORTED_MODULE_0___default()('#tab_ul').find('[name='+tabName+']').addClass('active');
}


/***/ }),

/***/ "./src/js/main/main_functions.js":
/*!***************************************!*\
  !*** ./src/js/main/main_functions.js ***!
  \***************************************/
/*! exports provided: buildGrammar, buildVocabularyNameMap, processGrammarInput, processParseInput */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "buildGrammar", function() { return buildGrammar; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "buildVocabularyNameMap", function() { return buildVocabularyNameMap; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "processGrammarInput", function() { return processGrammarInput; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "processParseInput", function() { return processParseInput; });
/* harmony import */ var _ParserBase__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../ParserBase */ "./src/js/ParserBase/index.js");


function buildGrammar(terminalNames, nonTerminalNames, startSymbolName, rawProductions) {
	_ParserBase__WEBPACK_IMPORTED_MODULE_0__["Production"].serialNo = 0;

	let vocabularyNameMap = new Map();
	for(let name of terminalNames) {
		if(vocabularyNameMap.has(name))
			throw new Error(`Error: Vocabulary name '${name}' declared more than once!`);
		vocabularyNameMap.set(name, new _ParserBase__WEBPACK_IMPORTED_MODULE_0__["Terminal"](name));
	}
	for(let name of nonTerminalNames) {
		if(vocabularyNameMap.has(name))
			throw new Error(`Error: Vocabulary name '${name}' declared more than once!`);
		vocabularyNameMap.set(name, new _ParserBase__WEBPACK_IMPORTED_MODULE_0__["NonTerminal"](name));
	}

	let terminals = [...terminalNames.map(name => vocabularyNameMap.get(name)), _ParserBase__WEBPACK_IMPORTED_MODULE_0__["GSymbol"].EOI];
	let nonTerminals = [...nonTerminalNames.map(name => vocabularyNameMap.get(name)), _ParserBase__WEBPACK_IMPORTED_MODULE_0__["GSymbol"].SYSTEM_GOAL];

	let startSymbol = vocabularyNameMap.get(startSymbolName);
	if(!startSymbol)
		throw new Error(`start symbol '${startSymbolName}' no found`);

	let augmentingProduction = new _ParserBase__WEBPACK_IMPORTED_MODULE_0__["Production"](_ParserBase__WEBPACK_IMPORTED_MODULE_0__["GSymbol"].SYSTEM_GOAL, [startSymbol, _ParserBase__WEBPACK_IMPORTED_MODULE_0__["GSymbol"].EOI]);

	let productions = [augmentingProduction, ...rawProductions.map(function([lhsName, ...rhsNames]) {
		let lhs = vocabularyNameMap.get(lhsName);
		let rhs = rhsNames.map(name => vocabularyNameMap.get(name));
		return new _ParserBase__WEBPACK_IMPORTED_MODULE_0__["Production"](lhs, rhs);
	})];

	return new _ParserBase__WEBPACK_IMPORTED_MODULE_0__["Grammar"](terminals, nonTerminals, startSymbol, productions);
}
function buildVocabularyNameMap(grammar) {
	return new Map([
		...grammar.terminals,
		...grammar.nonTerminals,
		_ParserBase__WEBPACK_IMPORTED_MODULE_0__["GSymbol"].LAMBDA
	].map((s) => [s.name, s]));
}
function processGrammarInput(inputText) {
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
function processParseInput(inputText, vocabularyNameMap) {
	return inputText.trim().split(/\s+/)
		.filter(s => s !== '')
		.map(t => ({ terminalType: vocabularyNameMap.get(t) || _ParserBase__WEBPACK_IMPORTED_MODULE_0__["GSymbol"].UNKNOWN }));
}


/***/ }),

/***/ "./src/js/main/main_util.js":
/*!**********************************!*\
  !*** ./src/js/main/main_util.js ***!
  \**********************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _ParserBase__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../ParserBase */ "./src/js/ParserBase/index.js");


// set display of parser components
_ParserBase__WEBPACK_IMPORTED_MODULE_0__["GSymbol"].prototype.toString = function() {
	let classArr = ['gsymbol'];
	if(this === _ParserBase__WEBPACK_IMPORTED_MODULE_0__["GSymbol"].LAMBDA)
		classArr.push('lambda');
	return '<span class="' + classArr.join(' ') + '">' + this.displayName + '</span>';
};
_ParserBase__WEBPACK_IMPORTED_MODULE_0__["Terminal"].prototype.toString = function() {
	let classArr = ['gsymbol','terminal'];
	if(this === _ParserBase__WEBPACK_IMPORTED_MODULE_0__["GSymbol"].UNKNOWN)
		classArr.push('unknown');
	if(this === _ParserBase__WEBPACK_IMPORTED_MODULE_0__["GSymbol"].EOI)
		classArr.push('end-symbol');
	return '<span class="' + classArr.join(' ') + '">' + this.displayName + '</span>';
};
_ParserBase__WEBPACK_IMPORTED_MODULE_0__["Production"].ARROW_R = '←';
_ParserBase__WEBPACK_IMPORTED_MODULE_0__["Production"].prototype.toStringReversed = function() {
	return (this.lhs + ' ' + _ParserBase__WEBPACK_IMPORTED_MODULE_0__["Production"].ARROW_R + ' ' +
		(this.rhs.length !== 0 ? this.rhs.join(' ') : _ParserBase__WEBPACK_IMPORTED_MODULE_0__["GSymbol"].LAMBDA));
};


/***/ }),

/***/ "./src/scss/style.scss":
/*!*****************************!*\
  !*** ./src/scss/style.scss ***!
  \*****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {


var content = __webpack_require__(/*! !../../node_modules/css-loader/dist/cjs.js??ref--5-1!../../node_modules/sass-loader/dist/cjs.js??ref--5-2!./style.scss */ "./node_modules/css-loader/dist/cjs.js?!./node_modules/sass-loader/dist/cjs.js?!./src/scss/style.scss");

if(typeof content === 'string') content = [[module.i, content, '']];

var transform;
var insertInto;



var options = {"hmr":true}

options.transform = transform
options.insertInto = undefined;

var update = __webpack_require__(/*! ../../node_modules/style-loader/lib/addStyles.js */ "./node_modules/style-loader/lib/addStyles.js")(content, options);

if(content.locals) module.exports = content.locals;

if(false) {}

/***/ })

/******/ });
//# sourceMappingURL=bundle.js.map