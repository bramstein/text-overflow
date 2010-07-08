## Introduction

This jQuery plugin implements a simplified version of the
[CSS3 text-overflow](https://developer.mozilla.org/en/CSS/text-overflow)
property. The `text-overflow` property allows stylesheet authors to
specify how and where text should be clipped. This is usually done
by adding an ellipsis character "`…`" or three dots at the point
the text should be cut off. Various browsers support this property,
such as Opera, Internet Explorer and Safari. Firefox unfortunately
does not. However, using this plugin you can simulate this
functionality (well, as close as you can get without a native
implementation.)

To use it you simply call the `textOverflow` method on elements you
want clipped. Clipping is only applied when the browser does not
support it natively. The following is an example of how to clip all
header elements on a page using the default plugin settings.

    $('h1').textOverflow();

The `textOverflow` method optionally supports an options object containing: the
string to use for clipping the text, and a boolean to determine
whether the plugin should automatically update the clipping when a
change in the document has been detected.

    textOverflow(options)

The options object can contain the following properties:
<dl>
	<dt>`str`</dt>
	<dd>The string to append to the content before it is clipped. Defaults to the ellipsis character "`…`". May also contain HTML, but the string itself is not subject to being clipped.</dd>
	<dt>`autoUpdate`</dt>
	<dd>Automatically update the clipped text when the available space for the text becomes smaller or larger. Defaults to false (because it incurs some extra costs.)</dd>
	<dt>`trim`</dt>
	<dd>True to remove trailing white-space at the point where content is clipped. False to leave the white-space. Defaults to true.</dd>
	<dt>`title`</dt>
	<dd>True to add the full text as a title attribute on the clipped element. Defaults to false.</dd>
	<dt>`className`</dt>
	<dd>Class name to add to the element whose content is clipped. Note that elements whose content fit in the container will not have this class name added.</dd>
</dl>

The following example shows how to replace the default ellipsis
character on all list elements with a three dot version, and turn
on automatic updating.

    $('li').textOverflow({
        str: '...',
        autoUpdate: true
    });

Please see the [examples page](text-overflow/examples/examples.html) for more examples on
how to use the plugin.

## Frequently asked questions

Q: Does this plugin support HTML elements inside the clipped content?

A: Yes.

Q: How do I use this in combination with browsers that support the
text-overflow property?

A: Simply use the CSS3 `text-overflow` property as you would normally,
e.g.

    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;

Then also call the `textOverflow` plugin method on the same
elements. When a browser has native support for the `text-overflow`
property, the text overflow plugin will let the browse handle it
natively, and otherwise it will apply its own text truncation code.
For more details, see the
[CSS and JavaScript text overflow example](text-overflow/examples/css-or-js.html), or the
[Quirkmode's article on the text-overflow property](http://www.quirksmode.org/css/textoverflow.html).

Q: How do I restore the original contents of the clipped elements?

A: It depends on what your use case is. If you want to show more or
less of the clipped element based on browser or element resize
events, simply turn the `autoUpdate` functionality on. If you want
to manually restore the original content, you'll have to store it
somewhere yourself before applying the text overflow plugin.

Q: Text overflow doesn't work when applied to hidden elements (using
`display: none`.)

A: This is caused by the browser taking the elements out of the page
flow. When an element is not in the page flow it has zero width and
height. The text overflow plugin uses the width and height to
calculate where to clip the text, so it can not do its work when an
element is hidden. There are two approaches to work around this
problem: the most simple solution is to only call the text overflow
plugin after you display the hidden elements. Alternatively you
could position the hidden elements offscreen and set its
`visibility` property to `hidden` and then measure it.

## Credits

-  
    [Devon Govett](http://devongovett.wordpress.com/2009/04/06/text-overflow-ellipsis-for-firefox-via-jquery/)
    ― Original plugin.

-  
    Andrew A. Kononykhin ― Bug fix for markup reset on cloned
    elements.

-  
    Micky Hulse ― Bug report on ellipsis character encoding & incorrect
    DOM tree truncation.

-
    Edward Shtern ― Suggestions className, title and wholeWord options.


### License

This plugin is licensed under the
[new BSD license](http://www.bramstein.com/licenses/BSD.txt). To summarize the license; the
plugin is completely free for commercial and non-commercial use and
you can do with it whatever you want, except claim it as your own
work.

