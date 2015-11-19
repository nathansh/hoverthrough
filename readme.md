# hoverThrough

A jQuery plugin that allows you to flip through a collection of images specified in a data attribute or passed in array by moving your mouse over an area. You can mouse over an element and change the `src` of a nest image, or mouse over an image and change its own source. The size of the image or hovering area is divided by the number of images provided, creating a trigger area. For example, three images will create three trigger areas a third the width of the hovering area. Mousing into a new trigger area changes the image.

## Basic use
Include jQuery and target your image `.hoverThrough()`.

### Images data attribute
Alternate images are specified as an array in a data attribute named `data-hoverthrough-images`. A different attribute or an array of images can be used with the `images` argument.

For example:

```html
data-hoverthrough-images='["http://placehold.it/135/175/3f3f3f", "http://www.placehold.it/135/175", "http://www.placehold.it/135/175/000000"]'
```

Note the use of single and double quotes. This is important.

### Instantiate the plugin

```html
<script src="path/to/jquery.min.js"></script>
<script src="path/to/jquery.hoverThrough.js"></script>
<script>
	$(document).ready(function(){
		$('.js-hover-images').hoverThrough();
	});
</script>
```

## Options and defaults

```javascript
$('js-hover-images').hoverThrough({
	imageSelector: 'this',
	images: 'data-hoverthrough-images'
});
```

### `imageSelector`

By default the plugin effects an image and changes its own source. If you'd rather hover a parent item and change a nested `img`, set `imageSelector` to a selector for nested images.

### `images`
By default alternate images should be set in an array as a data attribute named `data-hoverthrough-images`. Alternatively you can specify a different data attribute or provide an array of image urls.

## Methods

Methods are called as such:

```javascript
$('.js-hover-images').hoverThrough('kill');
```

### `kill`
Unbind `mousemove.ht`, making the plugin no longer do its thing.

### `refresh`
If you want to restart the effect after using the `kill` method, use the `refresh` method.

## Other features

### Multiple instances
You can have multiple instances of the plugin on a single page with their own individual settings. You can also independently `hoverThrough('kill')` or `hoverThrough('refresh')` a single instance.