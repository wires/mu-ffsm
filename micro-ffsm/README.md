# µ-ffsm: Micro fluent API helper

Very tiny helper function to construct fluent interfaces.

	> npm i µ-ffsm
	
Import

	var FFSM = require('µ-ffsm');

Create language/machine.	

	// internal state is an Array
	var Talker = FFSM({
		0:    function() { return []; }, // TODO allow const
		talk: function(say, what) { say.push(what); return say; },
		1:    function(say, sep) { return say.join(sep || ' '); }
	});
	
Construct sentences/instances:

	var cowboyGreeting = Talker()
		.talk('howdy')
		.talk('cowboy');
	
	// make dramatic
	console.log(cowboyGreeting(', ...'));
	

## Idea

We consider a special 'state machine' that maintains an internal
state of type `S`. We then consider three classes of
functions on it:

- entry : `* ⟶ S`
- transition : `* ⟶ S ⟶ S`
- exit : `* ⟶ S ⟶ *`

We write the entry function as `0`, the exit function as `1` and then
name all the transition functions however we like. 

Then

	var M = FFSM({
		0: function(i)    { return /* initial state */; } // entry function
		a: function(s, t) { return /* new state     */; } // transition 'a'
		b: function(s, t) { return /* new state     */; } // transition 'b'
		1: function(s, x) { return /* final value   */; } // exit function
	});

Now

	var i = M(entry)	// x : S <- 0(entry)
		.a(trigger_0)	// y : S <- a(x, trigger_0)
		.b(trigger_1)	// z : S <- b(y, trigger_1)
		.a(trigger_2);  // i : S <- a(z, trigger_2)

Finally

	var y = i(x);		// y <- 1(i, x)


So we have

- First `M(entry)` creates a new machine instance of type M.
  It's initial state derived from entry (`0(entry)`).

- Then `.a(trigger_0`) transitions the machine with transition `a` to a new
  state, using the previous state and the data from `trigger_0` to
  compute the new state.

- Similarly `.b(t_1)`, `.a(t_2)`.

- Finally, the `i(x)` call constructs an element out of
  the internal state and the argument using the exit function `1(i,x)`.
