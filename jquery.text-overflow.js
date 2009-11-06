/*!
 * jQuery Text Overflow v0.62
 *
 * Licensed under the new BSD License.
 * Copyright 2009, Bram Stein
 * All rights reserved.
 */
/*global jQuery, document, setInterval*/
(function ($) {
	var style = document.documentElement.style,
        hasTextOverflow = ('textOverflow' in style || 'OTextOverflow' in style),
    
        hasRange = document.createRange !== undefined,

        getTextNodes = function (element) {
            var result = [];
            $.each(element[0].childNodes, function () {
                if (this.nodeType === 3) {
                    result.push(this);
                } else {
                    $.each(this.childNodes, arguments.callee);
                }
            });
            return $(result);
        },

		htmlSubstr = function (nodes, start, end) {
			var range = document.createRange(),
		        i = 0, len = nodes.length, index = 0, node;                   

		    if (end <= start) {
		        return $(nodes);
		    }
            
            if (len === 1 || !hasRange) {
                // If ranges are not supported, or there is 
                // only one text node we use the normal 
                // substr method as it is much faster.
                return $.map(nodes, function (e) {
                    return e.textContent;
                }).join('').substr(start, end);
            }
		        
		    for (; i < len; i += 1) {
		        node = nodes[i];
		       
		        // if node range includes start
		        if (start >= index && start <= index + node.length) {
		            range.setStart(node, start - index);
		        }
		        
		        // if node range includes end
		        if (index <= end && index + node.length >= end) {
		            range.setEnd(node, end - index);
		            break;
		        }
		        index += node.length;
		    }
		    return $(range.cloneContents());		
		};

	$.extend($.fn, {
        textOverflow: function (str, autoUpdate) {
            var more = str || '…';
            
            if (!hasTextOverflow) {
                return this.each(function () {
                    var element = $(this),

                        // the clone element we modify to measure the width 
                        clone = element.clone(),

                        // we safe a copy so we can restore it if necessary
                        originalElement = element.clone(),

                        originalText = element.text(),
                        originalWidth = element.width(),
                        textNodes = getTextNodes(originalElement),
                        low = 0, mid = 0,
                        high = originalText.length,
                        reflow = function () {
                            if (originalWidth !== element.width()) {
                                element.replaceWith(originalElement);
                                element = originalElement;
                                originalElement = element.clone();
                                element.textOverflow(str, false);
                                originalWidth = element.width();								
                            }
                        };

                    element.after(clone.hide());

                    if (clone.width() > originalWidth) {
                        while (low < high) {
                            mid = Math.floor(low + ((high - low) / 2));
                            clone.empty().append(htmlSubstr(textNodes, 0, mid)).append(more);
                            if (clone.width() < originalWidth) {
                                low = mid + 1;
                            } else {
                                high = mid;
                            }
                        }

                        if (low < originalText.length) {
                            element.empty().append(htmlSubstr(textNodes, 0, low - 1)).append(more);
                        }
                    }
                    clone.remove();
                    
                    if (autoUpdate) {    
                        setInterval(reflow, 200);
                    }
                });
            } else {
                return this;
            }
        }
	});
})(jQuery);
