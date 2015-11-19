/*!
* hoverThrough 1.0-beta1
* 
* Written by Nathan Shubert-Harbison for Carter Hales Design Lab (carterhales.com)
* Released under the WTFPL license - http://sam.zoy.org/wtfpl/
* 
*/

(function($) {
	'use strict';

	var ht = {

		defaults: {
			imageSelector: 'this',
			images: 'data-hoverthrough-images'
		},
		settings: {},
		settingsTemp: {},
		data: [],
		instances: [],	
		instanceCount: 0,

		init: function(that) {

			// Get settings
			var config = $(that).data('hoverThrough');

			// Alias instance
			var instance = config.instance;

			// Create object for the instance
			ht.createInstance(instance, config);

			// Loop through each item
			return $(that).each(function(index) {				

				// Create a data object for each
				ht.instances[instance].data[index] = {
					images: false,
					preloaded: false,
					showing: false
				};

				// Find the images
				ht.instances[instance].data[index].images = ht.findImages(instance, this);

				// Bind the hover
				if ( ht.instances[instance].data[index].images ) {
					ht.bindHover(instance, index, this);
				}

			}); // return each

		}, // init

		createInstance: function(instance, config) {

			// Create new object for instance
			ht.instances[instance] = {
				settings: config,
				data: []
			};

		}, // createInstance

		findImages: function(instance, that) {

			var images = false;

			// Find the images
			if ( $.isArray(ht.instances[instance].settings.images) ) {

				// This is the case where an array of images is passed in
				images = ht.instances[instance].settings.images;


			} else {

				// No array of images, so let's see what the data- gives us
				var dataName = $.camelCase(ht.instances[instance].settings.images.replace('data-', ''));
				var dataImages = $(that).data(dataName);

				// Hopefully we have an array of images
				if ( $.isArray(dataImages) ) {
					images = dataImages;
				} 

			} // else 

			return images;

		}, // findImages

		bindHover: function(instance, index, that) {

			// The main event!
			$(that).on('mousemove.ht', function(event) {

				// Pre-load images
				if ( !ht.instances[instance].data[index].preloaded ) {
					ht.preloadImages(instance, index);
				}

				ht.swapImage(instance, index, that, event);

			});

		}, // bindHover

		preloadImages: function(instance, index) {

			$(ht.instances[instance].data[index].images).each(function(){
				$('<img/>')[0].src = this;
			});

			// Set an indicator that we've pre-loaded the images
			ht.instances[instance].data[index].preloaded = true;

		}, // preloadImages

		swapImage: function(instance, index, that, event) {

			// Which image should we show?
			var toShow = ht.imageToShow(instance, index, that, event);

			// Set the src, but only if we have a good and new value
			if ( ht.shouldSwap(instance, index, toShow) ) {

				// Check if we're updating 'this' of finding a child
				if ( ht.instances[instance].settings.imageSelector === 'this' ) {

					// Update the src
					$(that).attr('src', ht.instances[instance].data[index].images[toShow]);

				} else {

					// Update the src
					$(that).find(ht.instances[instance].settings.imageSelector).attr('src', ht.instances[instance].data[index].images[toShow]);

				}

				// Track what's showing
				ht.instances[instance].data[index].showing = toShow;

			}

		}, // swapImage
		
		imageToShow: function(instance, index, that, event) {

			// Get position
			var x = event.pageX - $(that).offset().left,
				y = event.pageY - $(that).offset().top;

			// How big is a slice anyways?!
			var slice = $(that).width() / ( ht.instances[instance].data[index].images.length - 1 );

			// Return the magic number
			return Math.round( x / slice );

		}, // imageToShow

		shouldSwap: function(instance, index, show) {

			// It's defined
			if ( typeof(ht.instances[instance].data[index].images[index]) !== 'undefined' ) {

				// Make sure it's a new number too
				if ( show !== ht.instances[instance].data[index].showing ) {
					return true;
				}

			}

			return false;

		}, // shouldSwap

		methods: {

			kill: function(that) {

				// Unbind mousemove
				$(that).off('mousemove.ht');

			}, // kill
			
			refresh: function(that) {

				// Get data config
				var config = $(that).data('hoverThrough');

				// Redo the shebang
				ht.bindHover(config.instance, that.ht.elementIndex, $(that));

			} // refresh

		} // methods

	}; // ht

	$.fn.hoverThrough = function(options) {

		// Check if we're instantiating plugin with options or calling a method. Normal stuff first.
		if ( !ht.methods[options] ) { 

			// Merge settings
			ht.settings = $.extend({}, ht.defaults, options);

			// Add instance
			ht.settings.instance = ht.instanceCount;

			// Save settings in data
			this.data('hoverThrough', ht.settings);

			// Return main method
			var output = ht.init(this);
		
			ht.instanceCount++;

			return output;

		} else {
			return this.each(function(index) {
				this.ht = { elementIndex: index };
				ht.methods[options].apply(this, Array.prototype.slice.call($(this)));
			});
		}

	}; // hoverThrough

}(jQuery));