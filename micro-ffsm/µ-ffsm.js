
// See README.md

module.exports = function(spec) {
	return function(init) {
		var s = spec[0] ? spec[0](init) : 0;

		var i = function(opt) {
			return spec[1] ? spec[1](s, opt) : s;
		}

		Object.keys(spec).forEach(
			function(name){
				// skip `entry` and `exit` functions
				if(/^\d+$/.test(name))
					return;

				// transition 'name : (s, opt) -> s'
				i[name] = function(opt) {
					s = spec[name](s, opt);
					return i;
				};
			});

		return i;
	}
};

