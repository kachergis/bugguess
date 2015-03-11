// Fisher-Yates shuffle algorithm.
// modified from http://sedition.com/perl/javascript-fy.html
function shuffle( arr, exceptions ) {
	var i;
	exceptions = exceptions || [];
	var shufflelocations = new Array();
	for (i=0; i<arr.length; i++) {
	    if (exceptions.indexOf(i)==-1) { shufflelocations.push(i); }
	}
	for (i=shufflelocations.length-1; i>=0; --i) {
		var loci = shufflelocations[i];
		var locj = shufflelocations[randrange(0, i+1)];
		var tempi = arr[loci];
		var tempj = arr[locj];
		arr[loci] = tempj;
		arr[locj] = tempi;
	}
	return arr;
}


function AssertException(message) { this.message = message; }
AssertException.prototype.toString = function () {
	return 'AssertException: ' + this.message;
};


function assert(exp, message) {
	if (!exp) {
		throw new AssertException(message);
	}
}

// Mean of booleans (true==1; false==0)
function boolpercent(arr) {
	var count = 0;
	for (var i=0; i<arr.length; i++) {
		if (arr[i]) { count++; }
	}
	return 100* count / arr.length;
}

Array.prototype.sample = function ( n ) {
    var arr = shuffle(this);
    return arr.slice(0,n);
};


// Flatten taken from
// http://tech.karbassi.com/2009/12/17/pure-javascript-flatten-array/
Array.prototype.flatten = function flatten(){
   var flat = [];
   for (var i = 0, l = this.length; i < l; i++){
       var type = Object.prototype.toString.call(this[i]).split(' ').pop().split(']').shift().toLowerCase();
       if (type) { flat = flat.concat(/^(array|collection|arguments|object)$/.test(type) ? flatten.call(this[i]) : this[i]); }
   }
   return flat;
};



Array.prototype.writeIndices = function( n ) {
    for( var i = 0; i < (n || this.length); ++i ) this[i] = i;
    return this;
};



function range(N) {
    return [].writeIndices(N);
}

function sample_range (N, r) {
    var arr = [].writeIndices(N);
    newarr = shuffle(arr);
    return newarr.slice(0,r);
};

function randrange ( lower, upperbound ) {
	// Finds a random integer from 'lower' to 'upperbound-1'
	return Math.floor( Math.random() * upperbound + lower );
}

function randarray (N) {
    var arr = [];
    for (var i=0; i<N; i++) {
        arr.push( Math.random() );
    };
    return arr;
}

function ascending (a,b) {
    return a-b;
};

function descending (a,b) {
    return b-a;
};


function output(arr) {
    console.log(arr);
};

/*
 *  normRand: returns normally distributed random numbers
 */
function normRand() {
    var x1, x2, rad;

    do {
        x1 = 2 * Math.random() - 1;
        x2 = 2 * Math.random() - 1;
        rad = x1 * x1 + x2 * x2;
    } while(rad >= 1 || rad == 0);

    var c = Math.sqrt(-2 * Math.log(rad) / rad);

    return x1 * c;
};



// by Sean McCullough (banksean@gmail.com)
// 25.December 2007

/**
 * Javascript implementation of the Box-Muller transform.
 * http://en.wikipedia.org/wiki/Box-Muller_transform
 * The zigurat algorithm is more efficient, but this is
 * easier to implement. This particular implementation is a
 * version of http://www.dreamincode.net/code/snippet1446.htm
 * @constructor
 * @param {Number} sigma The standard-deviation of the distribution
 * @param {Number} mu The center of the distribution
 */
function NormalDistribution(sigma, mu) {
	return new Object({
		sigma: sigma,
		mu: mu,
		sample: function() {
			var res;
			if (this.storedDeviate) {
				res = this.storedDeviate * this.sigma + this.mu;
				this.storedDeviate = null;
			} else {
				var dist = Math.sqrt(-1 * Math.log(Math.random()));
				var angle = 2 * Math.PI * Math.random();
				this.storedDeviate = dist*Math.cos(angle);
				res = dist*Math.sin(angle) * this.sigma + this.mu;
			}
			return res;
		},
		sampleInt : function() {
			return Math.round(this.sample());
		}
	});
}

// conveneience function, works on bounds instead of sigma, mu.
// also unemcumbered by maintaining a stored deviate.  This makes it
// much less effiecient than the NormalDistribution class, but maybe
// easier to use.
// WARNING: this probably doesn't work with negative numbers.

function generateNormallyDistributedRandomVar(min, max) {
	var mu = (max+min)/2;
	var sigma = mu/2;
	var res = min - 1;
	while (res > max || res < min) {
		var dist = Math.sqrt(-1 * Math.log(Math.random()));
		var angle = 2 * Math.PI * Math.random();
		res = dist*Math.sin(angle) * sigma + mu;
	}

	return res;
}

// convenience extension to Array so you can sample indexes on this distribution
Array.prototype.sampleIndex = function() {
	//if the array size has changed, we need to update the distribution object
	if (this.lastLength != this.length) {
		this.samplingDistribution = new NormalDistribution((this.length/6), (this.length/2)-1);
		this.lastLength = this.length;
	}
	return this.samplingDistribution.sampleInt();
}
