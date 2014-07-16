# µ-ffsm: Micro fluent API helper

Tiny helper function to create fluent interfaces/APIs in a somewhat consistent way.

	> npm i mu-ffsm

## Quickstart

Use it

    var mkChained = require('mu-ffsm');

The idea is that you construct a fluent builder with some initial state
of type `S` by calling an entry function. Then each chained call
transitions the state to a new state.

The value you get from chaining a bunch of calls can be executed as a
function, which calls exit to construct a value from that state and any
options you pass in.

- entry : * ⟶ S
- transition : (S ⟶ *) ⟶ S
- exit : S ⟶ (* ⟶ *)

For example

```js
var API = mkChained({
  0:    function(opt)    {return ;/* create initial state */},
  then: function(s, opt) {return s; /* new state */},
  whut: function(s, opt) {return s; /* new state */},
  1:    function(s, opt) {return ;/* compute final value */}
});
```

So `0`, `1` are entry, exit functions. All other functions transition an internal state.
All functions can take arguments, eg. `opt`

We create an instance of our newly crafted API,

```
var call = API() // entry
   .whut()       // transition
   .then()       // transition
   .whut();      // transition
```

And call it

```
var result0 = call() // exit
  , result1 = call() // exit
```

## Concrete example

	
Import

	var FFSM = require('mu-ffsm');

Create language/machine.	

```js
// internal state is an Array
var Talker = FFSM({
	0:    function() { return []; }, // TODO allow const
	talk: function(say, what) { say.push(what); return say; },
	1:    function(say, sep) { return say.join(sep || ' '); }
});
```

Construct sentences/instances:

```js
var cowboyGreeting = Talker()
	.talk('howdy')
	.talk('cowboy');

// make dramatic
console.log(cowboyGreeting(', ...'));
```

## How the chaining works

What you define

```js
	var M = FFSM({
		0: function(i)    { return /* initial state */; } // entry function
		a: function(s, t) { return /* new state     */; } // transition 'a'
		b: function(s, t) { return /* new state     */; } // transition 'b'
		1: function(s, x) { return /* final value   */; } // exit function
	});
```

What gets called with which arguments

```js
	var i = M(entry)    // x : S ← M.0(entry)
		.a(trigger_0)   // y : S ← M.a(x, trigger_0)
		.b(trigger_1)   // z : S ← M.b(y, trigger_1)
		.a(trigger_2);  // i : S ← M.a(z, trigger_2)
```

Finally

```js
	var y = i(x);		// y ← M.1(i, x)
```

So we have

- First `M(entry)` creates a new machine instance of type M.
  It's initial state derived computed as `0(entry)`.

- Then `.a(trigger_0)` transitions the machine with transition `a` to a new
  state, using the previous state and the data from `trigger_0` to
  compute the new state.

- Similarly `.b(t_1)`, `.a(t_2)`.

- Finally, the `i(x)` call constructs an element out of
  the internal state and the argument using the exit function `1(i,x)`.
