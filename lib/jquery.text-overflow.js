/**
 * @preserve jQuery Text Overflow v0.7.4
 *
 * Licensed under the new BSD License.
 * Copyright 2009-2011, Bram Stein
 * All rights reserved.
 */
/*global jQuery, document, setInterval*/
(function ($) {
	var style = document.documentElement.style,
        hasTextOverflow = ('textOverflow' in style || 'OTextOverflow' in style),

		rtrim = function (str) {
			return str.replace(/\s+$/g, '');
		},
		
		propertyName = document.createTextNode('').textContent ? 'textContent' : 'data',

		domSplit = function (root, maxIndex, options) {
			var index = 0, result = [],
				domSplitAux = function (nodes) {
					var i = 0, tmp, clipIndex = 0;

					if (index > maxIndex) {
						return;
					}

					for (i = 0; i < nodes.length; i += 1) {
						if (nodes[i].nodeType === 1) {
							tmp = nodes[i].cloneNode(false);
							result[result.length - 1].appendChild(tmp);
							result.push(tmp);
							domSplitAux(nodes[i].childNodes);
							result.pop();
						} else if (nodes[i].nodeType === 3) {
							if (index + nodes[i].length < maxIndex) {
								result[result.length - 1].appendChild(nodes[i].cloneNode(false));
							} else {
								tmp = nodes[i].cloneNode(false);
								clipIndex = maxIndex - index;
								if (options.wholeWord) {
									clipIndex = Math.min(maxIndex - index, tmp.textContent.substring(0, maxIndex - index).lastIndexOf(' '));
								}
								tmp[propertyName] = options.trim ? rtrim(tmp[propertyName].substring(0, clipIndex)) : tmp[propertyName].substring(0, clipIndex);
								result[result.length - 1].appendChild(tmp);	
							}
							index += nodes[i].length;
						} else {
							result.appendChild(nodes[i].cloneNode(false));
						}
					}
				};
			result.push(root.cloneNode(false));
			domSplitAux(root.childNodes);
			return $(result.pop().childNodes);
		};

	$.extend($.fn, {
        textOverflow: function (options) {
            var o = $.extend({
						str: '&#x2026;',
						autoUpdate: false,
						trim: true,
						title: false,
						className: undefined,
						wholeWord: false
					}, options);
            
            if (!hasTextOverflow) {
                return this.each(function () {
                    var element = $(this),

                        // the clone element we modify to measure the width 
                        clone = element.clone(),

                        // we save a copy so we can restore it if necessary
                        originalElement = element.clone(),
                        originalText = element.text(),
                        originalWidth = element.width(),
                        low = 0, mid = 0,
                        high = originalText.length,
                        reflow = function () {
                            if (originalWidth !== element.width()) {
                                element.replaceWith(originalElement);
                                element = originalElement;
                                originalElement = element.clone();
                                element.textOverflow($.extend({}, o, { autoUpdate: false}));
                                originalWidth = element.width();								
                            }
                        };

                    element.after(clone.hide().css({
						'position': 'absolute',
						'width': 'auto',
						'overflow': 'visible',
						'max-width': 'inherit',
						'min-width': 'inherit'
					}));	

                    if (clone.width() > originalWidth) {
                        while (low < high) {
                            mid = Math.floor(low + ((high - low) / 2));
							clone.empty().append(domSplit(originalElement.get(0), mid, o)).append(o.str);
                            if (clone.width() < originalWidth) {
                                low = mid + 1;
                            } else {
                                high = mid;
                            }
                        }

                        if (low < originalText.length) {
							element.empty().append(domSplit(originalElement.get(0), low - 1, o)).append(o.str);
							if (o.title) {
								element.attr('title', originalText);
							}
							if (o.className) {
								element.addClass(o.className);
							}
                        }
                    }
                    clone.remove();
                    
                    if (o.autoUpdate) {
                        setInterval(reflow, 200);
                    }
                });
            } else {
                return this;
            }
        }
	});
}(jQuery));
