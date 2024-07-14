(function() {

	var
	createNode = function(type) {

		return document.createElement(type);

	},
	addClass = function(node, className) {

		node.classList.add(className);
		return node;

	},
	removeClass = function(node, className) {

		node.classList.remove(className);
		return node;

	},
	append = function(child, parent) {

		parent.appendChild(child);

	},
	setHtml = function(node, html) {

		node.innerHTML = html;
		return node;

	},
	padZero = function (int) {

		if (int <= 9) return "0"+int;
		else return int;

	},

	Clock = function( news ) {

		if ( news ) {
			var
			key;
			for ( key in news ) {
				this[key] = news[key];
			}
		}

		this.handHour = createNode("div");
		this.handMin	= createNode("div");
		this.handSec	= createNode("div");
		this.clock = createNode("div");

		if ( this.segments ) {

			var
			i = 0,
			segAngles = this.calcSegAngles( 12 );

			this.segments = [];

			for ( i; i < segAngles.length; i++ ) {
				var
				node = createNode("div");
				node.innerHTML = "<span></span>";
				node.classList.add("segment");
				if ( i == (segAngles.length / 4) || i == (segAngles.length / 4) * 2 || i == (segAngles.length / 4) * 3 || i == 0 ) {
					node.classList.add("major");
				}
				this.segments[i] = node;
				append( this.segments[i], this.clock );
				this.segments[i].style.transform = this.segments[i].style.webkitTransform = "rotate(" + segAngles[i] + ")";
			}

		}

		this.loops = {};
		this.loops.hour = 0;
		this.loops.minutes = 0;
		this.loops.seconds = 0;

		this.flags = {};
		this.flags.hours = 0;
		this.flags.minutes = 0;
		this.flags.seconds = 0;

		addClass(this.handHour, "hand");
		addClass(this.handHour, "hour");

		addClass(this.handMin, "hand");
		addClass(this.handMin, "min");

		addClass(this.handSec, "hand");
		addClass(this.handSec, "sec");

		addClass(this.clock, "clock-face");

		setHtml(this.handHour, "<span></span>");
		setHtml(this.handMin, "<span></span>");
		setHtml(this.handSec, "<span></span>");

		append(this.handHour, this.clock);
		append(this.handMin, this.clock);
		append(this.handSec, this.clock);

		this.start();

	};

	Clock.prototype.calcHandAngles = function() {

		var
		angles,
		date = new Date();

		if ( this.offset ) {
			date.setTime(date.getTime() + (this.offset*60*60*1000));
		}

		var
		hours = date.getHours(),
		minutes = date.getMinutes(),
		seconds = date.getSeconds(),
		time = padZero( hours )+":"+padZero( minutes )+":"+padZero( seconds );

		if ( hours > 18 || hours < 6 ) {
			addClass(this.clock, "night");
		} else {
			removeClass(this.clock, "night");
		};

		if ( hours > 12 ) {
			hours = (hours - 12);
		};

		if ( hours == 0 && this.flags.hours == 0 ) {
			this.loops.hour++;
			this.flags.hours = 1;
		} else if ( hours == 1 ) {
			this.flags.hours = 0;
		}
		if ( minutes == 0 && this.flags.minutes == 0 ) {
			this.loops.minutes++;
			this.flags.minutes = 1;
		} else if ( minutes == 1 ) {
			this.flags.minutes = 0;
		}
		if ( seconds == 0 ) this.loops.seconds++;

		console.log(( Math.floor(360 / 12) * hours ) + ( 360 * this.loops.hour ))

		angles = {
			"hour": ( Math.floor(360 / 12) * hours ) + ( 360 * this.loops.hour ),
			"min": ( Math.floor(360 / 59) * minutes ) + ( 360 * this.loops.minutes ),
			"sec": ( Math.floor(360 / 59) * seconds ) + ( 360 * this.loops.seconds )
		};

		return angles;

	};

	Clock.prototype.calcSegAngles = function ( segments ) {

		var
		i = 0,
		degrees = 360,
		segments = segments || 4,
		segangles = ( degrees / segments ),
		angles = [];

		for ( i; i < segments; i++ ) {
			angles.push( (segangles * i ) + "deg" );
		}

		return angles;

	};

	Clock.prototype.render = function() {

		var
		angles = this.calcHandAngles();

		this.handHour.style.transform = this.handHour.style.webkitTransform = "rotate(" + angles["hour"] + "deg)";
		this.handMin.style.transform = this.handMin.style.webkitTransform = "rotate(" + angles["min"] + "deg)";
		this.handSec.style.transform = this.handSec.style.webkitTransform = "rotate(" + angles["sec"] + "deg)";

	};

	Clock.prototype.start = function() {

		var
		clock = this;

		clock.render();

		setInterval(function() {

			clock.render();

		}, 1000);

	};

	clock = new Clock();
	append(clock.clock, document.body);

	/* this clock is 12 hours in the past... */
	melon = new Clock({
		"offset": -12,
		"segments": true
	});
	append(melon.clock, document.body);

	/* this clock is 5 hours ahead... */
	bob = new Clock({
		"offset": 5,
		"segments": true
	});
	append(bob.clock, document.body);

})();
