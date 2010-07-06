/*
---
script: Tab.Extra.js
license: MIT-style license.
description: Extends Tab with automatic slide.
copyright: Copyright (c) 2008 Thierry Bela
authors: [Thierry Bela]

requires: 
  tab:0.1.4: 
  - Tab
provides: [Tab.Extra]
...
*/

	Tab.Extra = new Class({ 
		
		/*
		
			options: {
			
				interval: 10, //interval between 2 executions in seconds
				delay: 10, //delay between the moment a tab is clicked and the auto slide is restarted
				reverse: true //move backward
			},
			reverse: false, //move direction
		*/
			Extends: Tab,
			Binds: ['update', 'start', 'stop'],
			initialize: function(options) {

				this.parent($merge({interval: 10, delay: 10}, options));

				//handle click on tab. wait 10 seconds before we go
				this.tabs.each(function (el) {
				
					el.addEvent('click', function () {
					
						if(this.running) this.stop().start.delay(this.options.interval + this.options.delay)
						
					}.bind(this))
				}, this);
				
				this.reverse = !!this.options.reverse;
				this.running = false;
				this.timer = new PeriodicalExecuter(this.update, this.options.interval);
				
				return this
			},
			
			update: function () { return this[this.reverse ? 'previous' : 'next']() },
			
			start: function () {
			
				this.timer.registerCallback();
				this.running = true;
				return this
			},
			
			stop: function() { 
			
				this.timer.stop();
				this.running = false;
				return this
			}
		});