/*
---
script: Tabs.Plugins.Move.js
license: MIT-style license.
description: Move - swap tab horizontally or vertically.
copyright: Copyright (c) 2008 Thierry Bela
authors: [Thierry Bela]

requires: 
tab: 
- Tab
provides: [Tab.plugins.Move]
...
*/

!function (context, undefined) {

"use strict";

	context.Tab.prototype.plugins.Move = new Class({
		options: {
			/*
				circular: false,
				useOpacity: false,
				opacity: .7,
			*/
			
				mode: 'horizontal'
			},
		fx: {
		
			link: 'chain',
			duration: 1000
		},
		Implements: [Options, Events],
		initialize: function(panels, options, fx) {
		
			this.setOptions(options);
			
			this.panels = panels;
			this.horizontal = this.options.mode == 'horizontal',
			this.side = this.horizontal ? 'offsetLeft' : 'offsetTop';
			this.property = this.horizontal ? 'offsetWidth' : 'offsetHeight';
			this.selected = this.panels[0];
			this.direction = 1;
			this._fx = Object.merge(this.fx, fx);
			
			panels.each(function (el) { el.setStyle('display', 'block').setStyles({position: 'absolute', width: el.getStyle('width'), height: el.getStyle('height')}) });
			this.container = options.container.setStyles({overflow: 'hidden', position: 'relative'});
			if(panels[0]) this.container.setStyles({width: panels[0].offsetWidth, height: panels[0].offsetHeight});
			this.reset()
		},
		
		reset: function () {
		
			//
			this.fx = new Fx.Elements(this.panels, this._fx).addEvent('complete', function () { this.fireEvent('complete') }.bind(this));			
			this.reorder(this.panels.indexOf(this.selected), this.direction);
			
			return this
		},
		
		add: function (el) { 
		
			if(el) el.setStyles({display: 'block', position: 'static'}).setStyles({position: 'absolute', width: el.getStyle('width'), height: el.getStyle('height')}); 
			return this.reset()
		},
		
		remove: function () { 
		
			return this.reset()
		},
		
		reorder: function (offset, direction) {
		
			var pos = 0,
				index,
				panel,
				panels = this.panels,
				length = panels.length,
				i = length;
				
			//rtl
			if(direction == -1) {
			
				while(i--) {
			
					index = (i + offset + length) % length;
					panel = panels[index];
					
					if(this.horizontal) panel.setStyle('left', pos);
					else panel.setStyles({left: 0, top: pos});
					pos -= panel[this.property];
				}
				
				//ltr
			} else if(direction == 1) for(i = 0; i < length; i++) {
			
				index = (i + offset + length) % length;
				panel = panels[index];				
				
				if(this.horizontal) panel.setStyle('left', pos);
				else panel.setStyles({left: 0, top: pos});
				pos += panel[this.property];
			}
			
			return this
		},
		
		cancel: function () {
		
			this.fx.cancel();
			return this
		},
		
		move: function (newTab, curTab, newIndex, oldIndex, direction) {
			
			this.cancel();
			
			var obj = {}, 
				options = this.options,
				horizontal = options.mode == 'horizontal',
				side = this.side,
				offset = newTab[this.side],
				opacity = options.opacity || .7,
				offset;
				
			if(oldIndex != undefined && options.circular) this.reorder(oldIndex, direction);
			
			offset = newTab[side];
			
			
			this.direction = direction;
			this.selected = newTab;

			this.panels.each(function(panel, index) {
							
				obj[index] = horizontal ? {opacity: opacity, left:[panel[side], panel[side] - offset]} : {opacity: opacity, top:[panel[side], panel[side] - offset]}
			});
			
			if(!options.useOpacity) Object.each(obj, function (k) { delete k.opacity });
			
			this.fx.start(obj).chain(function () { newTab.tween('opacity', 1) });
			this.fireEvent('change', Array.slice(arguments)).fireEvent('resize', newTab)
		}
	})
}(this);

