/*!
 * jQuery Text Overflow v0.52
 *
 * Licensed under the new BSD License.
 * Copyright 2009, Bram Stein
 * All rights reserved.
 */
/*global jQuery, document, setInterval*/
(function ($) {
$.fn.textNodes = function() {
  var ret = [];
  $.each(this[0].childNodes, function() {
      if (this.nodeType == 3) {
        ret.push(this);
    } else {
        $.each(this.childNodes, arguments.callee);
    }
  });
  return $(ret);
}

	$.extend($.fn, {
        textOverflow: function (str, autoUpdate, range) {
            var more = str || '…',
                useRange = document.implementation.hasFeature('Range', '2.0') && range,
                style = document.documentElement.style,
                textOverflow = ('textOverflow' in style || 'OTextOverflow' in style),
                substrHtml = function (element, start, end) {
                    var range = document.createRange(),
                        nodes = $(element).textNodes(),
                        i = 0, len = nodes.length, index = 0, node;
                    
                    if (end <= start) {
                        return element;
                    }

                    // TODO: perhaps add some check here if there is only 
                    // one text node and then use a normal substr.
                        
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
            
            if (!textOverflow) {
                return this.each(function () {
                    var element = $(this),
                        clone = element.clone(),
                        originalElement = element.clone(),
                        originalText = element.text(),
                        originalWidth = element.width(),
                        low = 0, mid = 0,
                        high = originalText.length,
                        reflow = function () {
                            if (originalWidth !== element.width()) {
                                element.text(originalText);
                                element.textOverflow(str, false);
								originalWidth = element.width();
                            }
                        };

                    element.after(clone.hide());
                
                    if (clone.width() > originalWidth) {
                        while (low < high) {
                            mid = Math.floor(low + ((high - low) / 2));
                            //clone.html(originalText.substr(0, mid) + more);
                            clone.empty().append(substrHtml(originalElement, 0, mid)).append(more);
                            if (clone.width() < originalWidth) {
                                low = mid + 1;
                            } else {
                                high = mid;
                            }
                        }
  
                        if (low < originalText.length) {
                            //element.html(originalText.substr(0, low - 1) + more); 
                            element.empty().append(substrHtml(originalElement, 0, low - 1)).append(more);
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
