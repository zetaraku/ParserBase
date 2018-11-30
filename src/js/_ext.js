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

export default {
	overrides,
	equals,
	groupBy,
	addAll,
};
