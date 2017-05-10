define([], function () {
	'use strict';

	Object.defineProperties(Object.prototype, {
		'equals': {
			value: function (that) {
				return this === that;
			},
			writable: true
		}
	});
	Object.defineProperties(Map.prototype, {
		'equals': {
			value: function (that) {
				if (this === that) return true;
				if (!(that instanceof Map) || this.size !== that.size) return false;
				for (let k of this.keys()) {
					if (!that.has(k)) return false;
					let vThis = this.get(k),
					    vThat = that.get(k);
					if (typeof vThis.equals === 'function' ? !vThis.equals(vThat) : vThis !== vThat) {
						return false;
					}
				}
				return true;
			}
		},
		'isEmpty': {
			value: function () {
				return this.size === 0;
			}
		},
		'isNotEmpty': {
			value: function () {
				return this.size !== 0;
			}
		}
	});
	Object.defineProperties(Set.prototype, {
		'equals': {
			value: function (that) {
				if (this === that) return true;
				if (!(that instanceof Set) || this.size !== that.size) return false;
				for (let e of this) if (!that.has(e)) return false;
				return true;
			}
		},
		'groupBy': {
			value: function (mapf) {
				let groups = new Map();
				for (let e of this) {
					let group = mapf(e);
					if (!groups.has(group)) groups.set(group, new Set());
					groups.get(group).add(e);
				}
				return groups;
			}
		},
		'addAll': {
			value: function (that) {
				let added = new Set();
				for (let e of that) {
					if (!this.has(e)) {
						this.add(e);
						added.add(e);
					}
				}
				return added;
			}
		},
		'toArray': {
			value: function () {
				return Array.from(this);
			}
		},
		'isEmpty': {
			value: function () {
				return this.size === 0;
			}
		},
		'isNotEmpty': {
			value: function () {
				return this.size !== 0;
			}
		}
	});
	Object.defineProperties(Array.prototype, {
		'equals': {
			value: function (that) {
				if (this === that) return true;
				if (!(that instanceof Array) || this.length !== that.length) return false;
				for (let i = 0; i < this.length; i++) {
					let vThis = this[i],
					    vThat = that[i];
					if (typeof vThis.equals === 'function' ? !vThis.equals(vThat) : vThis !== vThat) {
						return false;
					}
				}
				return true;
			}
		},
		'groupBy': {
			value: function (mapf) {
				let groups = new Map();
				for (let e of this) {
					let group = mapf(e);
					if (!groups.has(group)) groups.set(group, []);
					groups.get(group).push(e);
				}
				return groups;
			}
		},
		'isEmpty': {
			value: function () {
				return this.length === 0;
			}
		},
		'isNotEmpty': {
			value: function () {
				return this.length !== 0;
			}
		},
		'first': {
			value: function () {
				return this[0];
			}
		},
		'last': {
			value: function () {
				return this[this.length - 1];
			}
		}
	});
});