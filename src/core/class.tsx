import React from 'react';
import isfunction from 'lodash.isfunction';
import { QTipOptions } from './types';

interface ExtendedEvent extends Event {
  relatedTarget: EventTarget;
}

interface TriggerEvent extends Event {
  originalEvent: Event;
}

interface QTipProps {
  namespace: string;
  disabled: boolean;
  options: QTipOptions;
  target: React.RefObject<HTMLElement>;
}

class TriggerEvent extends Event {
  defaultPrevented: boolean = false;
  propagationStopped: boolean = false;
  immediatePropagationStopped: boolean = false;

  isDefaultPrevented: () => boolean = () => this.defaultPrevented ;
	isPropagationStopped: () => boolean = () => this.propagationStopped;
	isImmediatePropagationStopped: () => boolean = () => this.immediatePropagationStopped;

  preventDefault = () => {
		this.defaultPrevented = true;

		var e = this.originalEvent;
		if ( !e ) {
			return;
		}

		// if preventDefault exists run it on the original event
		if ( e.preventDefault ) {
			e.preventDefault();

		// otherwise set the returnValue property of the original event to false (IE)
		} else {
			e.returnValue = false;
		}
  }

  stopPropagation = () => {
		this.propagationStopped = true;

		var e = this.originalEvent;
		if ( !e ) {
			return;
		}
		// if stopPropagation exists run it on the original event
		if ( e.stopPropagation ) {
			e.stopPropagation();
		}
		// otherwise set the cancelBubble property of the original event to true (IE)
		e.cancelBubble = true;
  }

  stopImmediatePropagation = () => {
		this.immediatePropagationStopped = true;
		this.stopPropagation();
  }


}


interface QTipState {
  // SHOULD RENDER (i.e. in render method (if(render) show the rest otherwise hide im guessing))
  shouldRender: boolean;

  // don't know what this does
  isWaiting: boolean;

  // ???
  hiddenDuringWait: boolean;

  // rendered probably an antipattern
  hasRendered: boolean;

  isVisible: boolean;
}

class QTip extends React.Component<QTipProps, QTipState> {
  // id: string;
  // target: any;
  tooltip: React.RefObject<HTMLInputElement>;
  // elements: any;
  private _id: string;
  timers: any;
  plugins: any;
  cache: {
    event: any;
    target: any;
    disabled: boolean;
    attr: any;
    onTooltip: boolean;
    lastClass: string;
  };
  rendered: boolean | -1;
  destroyed: boolean;
  disabled: boolean;
  waiting: boolean;
  hiddenDuringWait: boolean;
  positioning: boolean;
  triggering: boolean | string;
  preshow: boolean;
  mouse: MouseEvent;

  constructor(props: QTipProps) {
    super(props);
    // const { target, options, attr } = props;
    const { options } = props;
    const { id } = options;
    // probably dont need target as the parent decides where to render
    // this.target = target;
    this.tooltip = React.createRef();
    this.timers = { img: {} };
    // this.elements = { target };
    this._id = `${this.props.namespace}-${id}`;

    this.cache = {
      event: {},
      target: {},
      disabled: false,
      attr: null,
      onTooltip: false,
      lastClass: '',
    };

    this.rendered = false;
    this.destroyed = false;
    this.disabled = false;
    this.waiting = false;
    this.hiddenDuringWait = false;
    this.positioning = false;
    this.triggering = false;
    this.preshow = false;
  }

  render() {
    if (!this.state.shouldRender) {
      return;
    }


    return <div></div>
  }


  // START HERE.....
  public toggle = (shouldToggle: boolean, event: ExtendedEvent) => {
    let cache = this.cache;
    const options = this.props.options;
    let tooltip = this.tooltip;

    // Try to prevent flickering when tooltip overlaps show element
    if (event) {
      if (
        /over|enter/.test(event.type) &&
        cache.event &&
        /out|leave/.test(cache.event.type) &&
        options.show.target.add(event.target).length === options.show.target.length &&
        tooltip.current.has(event.relatedTarget).length
      ) {
        return;
      }

      // Cache event
      // cache.event = $.event.fix(event);
      cache.event = event;
    }

    // If we're currently waiting and we've just hidden... stop it
    if (this.state.isWaiting && !shouldToggle) {
      this.setState({
        hiddenDuringWait: true,
      });
    }

    // Render the tooltip if showing and it isn't already
    if (!this.state.hasRendered) {
      this.setState({
        shouldRender: true,
      });
      return;
    } else if (this.destroyed || this.props.disabled) {
      return;
    }

    const type = shouldToggle ? 'show' : 'hide';
    const opts = this.props.options[shouldToggle ? 'show' : 'hide'];
    // const otherOpts = this.options[!state ? 'show' : 'hide'];
    const posOptions = this.props.options.position;
    // const contentOptions = this.props.options.content; // derive this in render
    const width = this.tooltip.current.getBoundingClientRect().width;
    const visible = this.state.isVisible; // this.tooltip && this.tooltip.is(':visible') && this.tooltip.css('visibility') !== 'hidden';
    const animate = shouldToggle || opts.target.length === 1;
    const sameTarget = !event || opts.target.length < 2 || cache.target[0] === event.target;

    // Detect state if valid one isn't provided
    // TODO: We should probably deprecate this because type checking exists now
    if ((typeof shouldToggle).search('boolean|number')) {
      shouldToggle = !this.state.shouldRender;
    }

    // TODO
    // MOVE TO SHOULDCOMPONENTUPDATE
    // Check if the tooltip is in an identical state to the new would-be state
    let identicalState = !tooltip.is(':animated') && visible === shouldToggle && sameTarget;

    // Fire tooltip(show/hide) event and check if destroyed
    let allow = !identicalState ? !!this.trigger(type, [90]) : NULL;

    // Check to make sure the tooltip wasn't destroyed in the callback
    if (this.destroyed) {
      return;
    }

    // TODO
    // NEEDS TO GET MOVED TO COMPONENTDIDUPDATE
    // // If the user didn't stop the method prematurely and we're showing the tooltip, focus it
    // if (allow !== false && shouldToggle) {
    //   this.focus(event);
    // }

    // TODO
    // MOVE TO SHOULDCOMPONENTUPDATE
    // If the state hasn't changed or the user stopped it, return early
    if (!allow || identicalState) {
      return;
    }

    // TODO
    // DERIVE THIS INSTEAD IN RENDER FUNCTION
    // Set ARIA hidden attribute
    // $.attr(tooltip[0], 'aria-hidden', !!!state);

    this.preshow = false;

    // Execute state specific properties
    if (shouldToggle) {
      // Store show origin coordinates
      this.mouse && (cache.origin = $.event.fix(this.mouse as Event));
      this.mouse && (cache.origin = this.mouse);

      // MOVE TO RENDER FUNCTION AND DERIVE
      // Update tooltip content & title if it's a dynamic function
      // if (isfunction(contentOptions.text)) {
      //   this.updateContent(contentOptions.text, false);
      // }
      // if (isfunction(contentOptions.title)) {
      //   this.updateTitle(contentOptions.title, false);
      // }

      // 
      // Cache mousemove events for positioning purposes (if not already tracking)
      if (!trackingBound && posOptions.target === 'mouse' && posOptions.adjust.mouse) {
        $(document).on('mousemove.' + NAMESPACE, this._storeMouse);
        trackingBound = TRUE;
      }

      // Update the tooltip position (set width first to prevent viewport/max-width issues)
      if (!width) {
        tooltip.css('width', tooltip.outerWidth(FALSE));
      }
      this.reposition(event, arguments[2]);
      if (!width) {
        tooltip.css('width', '');
      }

      // Hide other tooltips if tooltip is solo
      if (!!opts.solo) {
        (typeof opts.solo === 'string' ? $(opts.solo) : $(SELECTOR, opts.solo))
          .not(tooltip)
          .not(opts.target)
          .qtip('hide', $.Event('tooltipsolo'));
      }
    } else {
      // Clear show timer if we're hiding
      clearShowTimeout.call(this, event);

      // Remove cached origin on hide
      delete cache.origin;

      // Remove mouse tracking event if not needed (all tracking qTips are hidden)
      if (
        trackingBound &&
        !$(SELECTOR + '[tracking="true"]:visible', opts.solo).not(tooltip).length
      ) {
        $(document).off('mousemove.' + NAMESPACE);
        trackingBound = FALSE;
      }

      // Blur the tooltip
      this.blur(event);
    }

    // Define post-animation, state specific properties
    const after = () => {
      if (shouldToggle) {
        // Prevent antialias from disappearing in IE by removing filter
        if (BROWSER.ie) {
          tooltip[0].style.removeAttribute('filter');
        }

        // Remove overflow setting to prevent tip bugs
        tooltip.css('overflow', '');

        // Autofocus elements if enabled
        if ('string' === typeof opts.autofocus) {
          $(this.options.show.autofocus, tooltip).focus();
        }

        // If set, hide tooltip when inactive for delay period
        this.options.show.target.trigger('qtip-' + this.id + '-inactive');
      } else {
        // Reset CSS states
        tooltip.css({
          display: '',
          visibility: '',
          opacity: '',
          left: '',
          top: '',
        });
      }

      // tooltipvisible/tooltiphidden events
      this.trigger(shouldToggle ? 'visible' : 'hidden');
    };

    // If no effect type is supplied, use a simple toggle
    if (opts.effect === FALSE || animate === FALSE) {
      tooltip[type]();
      after();
    }

    // Use custom function if provided
    else if (isfunction(opts.effect)) {
      tooltip.stop(1, 1);
      opts.effect.call(tooltip, this);
      tooltip.queue('fx', function(n) {
        after();
        n();
      });
    }

    // Use basic fade function by default
    else {
      tooltip.fadeTo(90, shouldToggle ? 1 : 0, after);
    }

    // If inactive hide method is set, active it
    if (shouldToggle) {
      opts.target.trigger('qtip-' + this.id + '-inactive');
    }

    return this;
  };


  componentDidMount() {
    // this.setState({
    //   rendered: -1,
    //   positioning: true,
    // });
    // // remove below;
    // this.positioning = true;
    // this.rendered = -1;
    // // create title and button
    // this.rendered = true;

    // // Setup widget classes
    // this.setWidget();

    // // Initialize 'render' plugins
    // this.plugins.forEach(name => {
    //   // ???
    // });

    // // Unassign initial events and assign proper events
    // this.unassignEvents();
    // this.assignEvents();

    // if (this.destroyed) {
    //   // The tooltip was destroyed before the render was complete. Just drop further processing
    //   return;
    // }
    // // tooltiprender event
    // this.trigger('render');

    // // Reset flags
    // this.positioning = false;

    // // Show tooltip if not hidden during wait period
    // if (!this.hiddenDuringWait && (this.options.show.ready || show)) {
    //   this.toggle(true, cache.event, FALSE);
    // }
    // this.hiddenDuringWait = FALSE;

    // // Expose API
    // QTIP.api[this.id] = this;
  }

  // shouldComponentUpdate = (nextProps, nextState) => {
  //   return true;
  //   // FIGURE OUT WHERE THESE COME FROM???
  //   let { content } = this.props; //???
  //   let { element, reposition } = this.state; //????
  //   //

  //   // Make sure tooltip is rendered and content is defined. If not return
  //   if (!this.rendered || !content) {
  //     return false;
  //   }

  //   // Use function to parse content
  //   if (isfunction(content)) {
  //     content =
  //       content.call(this.elements.target, this.cache.event, this) || '';
  //   }

  //   // Handle deferred content
  //   if (isfunction(content.then)) {
  //     this.cache.waiting = TRUE;
  //     return content.then(
  //       function(c) {
  //         this.cache.waiting = FALSE;
  //         return self._update(c, element);
  //       },
  //       NULL,
  //       function(e) {
  //         return self._update(e, element);
  //       }
  //     );
  //   }

  //   // If content is null... return false
  //   if (content === false || (!content && content !== '')) {
  //     return false;
  //   }

  //   // Append new content if its a DOM array and show it if hidden
  //   if (content.jquery && content.length > 0) {
  //     element
  //       .empty()
  //       .append(content.css({ display: 'block', visibility: 'visible' }));
  //   }

  //   // Content is a regular string, insert the new content
  //   else {
  //     element.html(content);
  //   }

  //   // Wait for content to be loaded, and reposition
  //   // return this._waitForContent(element).then(function(images) {
  //   if (this.rendered && this.tooltip[0].offsetWidth > 0) {
  //     this.reposition(cache.event, !images.length);
  //   }
  // };

  // render() {
  //   const props = {
  //     'aria-describedby': this._id,
  //   };
  //   this.cache.posClass = this.createPosClass(
  //     (this.position = { my: posOptions.my, at: posOptions.at }).my
  //   );

  //   const QTipDiv = 'div';

  //   // React.createElement("div", {
  //   // });

  //   // Create title...
  //   if (this.props.title) {
  //     this.createTitle();

  //     // Update title only if its not a callback (called in toggle if so)

  //     if (!isfunction(this.props.title)) {
  //       const promise = this.updateTitle(this.props.title, FALSE);
  //     }
  //   }

  //   // Create button
  //   if (button) {
  //     this._createButton();
  //   }

  //   // Set proper rendered flag and update content if not a callback function (called in toggle)
  //   if (!$.isFunction(text)) {
  //     deferreds.push(this._updateContent(text, FALSE));
  //   }
  //   this.rendered = TRUE;

  //   // Create tooltip element
  //   // THIS MIGHT NOT WORJ WITH THE STRING REF, DOUBLE CHECK

  //   let className = this.disabled ? 'CLASS_DISABLED' : '';
  //   const qtip = (
  //     <QTipDiv
  //       id={this._id}
  //       className={`${this.props.namespace} ${this.props.classDefault} ${
  //         this.options.style.classes
  //       } ${this.cache.posClass}`}
  //       data-width={this.options.style.width || ''}
  //       data-height={this.options.style.height || ''}
  //       data-tracking={posOptions.target === 'mouse' && posOptions.adjust.mouse}
  //       role="alert"
  //       aria-live="polite"
  //       aria-atomic={false}
  //       aria-describedby={`${this._id}-content`}
  //       aria-hidden={true}
  //     >
  //       <div
  //         className={this.props.namespace}
  //         id={`${this._id}-content`}
  //         aria-atomic={true}
  //       />
  //     </QTipDiv>
  //   );

  //   return qtip;
  // }

  // Widget class setter method
  setWidget = function() {
    // var on = this.options.style.widget,
    //   elements = this.elements,
    //   tooltip = elements.tooltip,
    //   disabled = tooltip.hasClass(CLASS_DISABLED);
    // tooltip.removeClass(CLASS_DISABLED);
    // CLASS_DISABLED = on ? 'ui-state-disabled' : 'qtip-disabled';
    // tooltip.toggleClass(CLASS_DISABLED, disabled);
    // tooltip
    //   .toggleClass('ui-helper-reset ' + createWidgetClass(), on)
    //   .toggleClass(CLASS_DEFAULT, this.options.style.def && !on);
    // if (elements.content) {
    //   elements.content.toggleClass(createWidgetClass('content'), on);
    // }
    // if (elements.titlebar) {
    //   elements.titlebar.toggleClass(createWidgetClass('header'), on);
    // }
    // if (elements.button) {
    //   elements.button.toggleClass(NAMESPACE + '-icon', !on);
    // }
  };

  // Event assignment method
  assignEvents = function() {
    var self = this,
      options = this.options,
      posOptions = options.position,
      tooltip = this.tooltip,
      showTarget = options.show.target,
      hideTarget = options.hide.target,
      containerTarget = posOptions.container,
      viewportTarget = posOptions.viewport,
      documentTarget = $(document),
      bodyTarget = $(document.body),
      windowTarget = $(window),
      showEvents = options.show.event ? ('' + options.show.event).trim().split(' ') : [],
      hideEvents = options.hide.event ? ('' + options.hide.event).trim().split(' ') : [];

    // I don't really understand what this does???
    // Assign passed event callbacks
    options.events.forEach((name, callback) => {
      this._bind(
        tooltip,
        name === 'toggle' ? ['tooltipshow', 'tooltiphide'] : ['tooltip' + name],
        callback,
        null,
        tooltip
      );
    });

    // Hide tooltips when leaving current window/frame (but not select/option elements)
    if (/mouse(out|leave)/i.test(options.hide.event) && options.hide.leave === 'window') {
      this._bind(documentTarget, ['mouseout', 'blur'], function(event) {
        if (!/select|option/.test(event.target.nodeName) && !event.relatedTarget) {
          this.hide(event);
        }
      });
    }

    // Enable hide.fixed by adding appropriate class
    if (options.hide.fixed) {
      hideTarget = hideTarget.add(tooltip.addClass(CLASS_FIXED));
    } else if (/mouse(over|enter)/i.test(options.show.event)) {
      /*
	 * Make sure hoverIntent functions properly by using mouseleave to clear show timer if
	 * mouseenter/mouseout is used for show.event, even if it isn't in the users options.
	 */
      this._bind(hideTarget, 'mouseleave', function(event) {
        this.clearShowTimeout(event);
      });
    }

    // Hide tooltip on document mousedown if unfocus events are enabled
    if (('' + options.hide.event).indexOf('unfocus') > -1) {
      this._bind(containerTarget.closest('html'), ['mousedown', 'touchstart'], function(event) {
        var elem = $(event.target),
          enabled =
            this.rendered &&
            !this.tooltip.hasClass(CLASS_DISABLED) &&
            this.tooltip[0].offsetWidth > 0,
          isAncestor = elem.parents(SELECTOR).filter(this.tooltip[0]).length > 0;

        if (
          elem[0] !== this.target[0] &&
          elem[0] !== this.tooltip[0] &&
          !isAncestor &&
          !this.target.has(elem[0]).length &&
          enabled
        ) {
          this.hide(event);
        }
      });
    }

    // Check if the tooltip hides when inactive
    if ('number' === typeof options.hide.inactive) {
      // Bind inactive method to show target(s) as a custom event
      this._bind(showTarget, 'qtip-' + this.id + '-inactive', inactiveMethod, 'inactive');

      // Define events which reset the 'inactive' event handler
      this._bind(hideTarget.add(tooltip), QTIP.inactiveEvents, inactiveMethod);
    }

    // Filter and bind events
    this._bindEvents(showEvents, hideEvents, showTarget, hideTarget, showMethod, hideMethod);

    // Mouse movement bindings
    this._bind(showTarget.add(tooltip), 'mousemove', function(event) {
      // Check if the tooltip hides when mouse is moved a certain distance
      if ('number' === typeof options.hide.distance) {
        var origin = this.cache.origin || {},
          limit = this.options.hide.distance,
          abs = Math.abs;

        // Check if the movement has gone beyond the limit, and hide it if so
        if (abs(event.pageX - origin.pageX) >= limit || abs(event.pageY - origin.pageY) >= limit) {
          this.hide(event);
        }
      }

      // Cache mousemove coords on show targets
      this._storeMouse(event);
    });

    // Mouse positioning events
    if (posOptions.target === 'mouse') {
      // If mouse adjustment is on...
      if (posOptions.adjust.mouse) {
        // Apply a mouseleave event so we don't get problems with overlapping
        if (options.hide.event) {
          // Track if we're on the target or not
          this._bind(showTarget, ['mouseenter', 'mouseleave'], function(event) {
            if (!this.cache) {
              return FALSE;
            }
            this.cache.onTarget = event.type === 'mouseenter';
          });
        }

        // Update tooltip position on mousemove
        this._bind(documentTarget, 'mousemove', function(event) {
          // Update the tooltip position only if the tooltip is visible and adjustment is enabled
          if (
            this.rendered &&
            this.cache.onTarget &&
            !this.tooltip.hasClass(CLASS_DISABLED) &&
            this.tooltip[0].offsetWidth > 0
          ) {
            this.reposition(event);
          }
        });
      }
    }

    // Adjust positions of the tooltip on window resize if enabled
    if (posOptions.adjust.resize || viewportTarget.length) {
      this._bind(
        $.event.special.resize ? viewportTarget : windowTarget,
        'resize',
        repositionMethod
      );
    }

    // Adjust tooltip position on scroll of the window or viewport element if present
    if (posOptions.adjust.scroll) {
      this._bind(windowTarget.add(posOptions.container), 'scroll', repositionMethod);
    }
  };

  bind = function(targets, events, method, suffix, context) {
    if (!targets || !method || !events.length) {
      return;
    }
    var ns = '.' + this._id + (suffix ? '-' + suffix : '');
    $(targets).on(
      (events.split ? events : events.join(ns + ' ')) + ns,
      $.proxy(method, context || this)
    );
    return this;
  };

  unassignEvents = function() {
    var options = this.options,
      showTargets = options.show.target,
      hideTargets = options.hide.target,
      targets = [
        this.elements.target[0],
        this.rendered && this.tooltip[0],
        options.position.container[0],
        options.position.viewport[0],
        options.position.container.closest('html')[0], // unfocus
        window,
        document,
      ].filter(i => typeof i === 'object');

    // Add show and hide targets if they're valid
    if (showTargets && showTargets.toArray) {
      targets = targets.concat(showTargets.toArray());
    }
    if (hideTargets && hideTargets.toArray) {
      targets = targets.concat(hideTargets.toArray());
    }

    // Unbind the events
    this._unbind(targets)
      ._unbind(targets, 'destroy')
      ._unbind(targets, 'inactive');
  };

  trigger = (type: string, args?: Array<any>, event?: Event) => {
    // var callback = $.Event('tooltip' + type);
    let callback = new Event(`tooltip${type}`) as TriggerEvent;
    callback.originalEvent = (event && { ...event }) || this.cache.event || null;

    this.triggering = type;
    // jquery thing (see how to replicate this (? Event Bus I guess))
    this.triggerCallOnEventBus(callback, [this, ...args]);
    // this.tooltip.trigger(callback, [this].concat(args || []));
    this.triggering = false;

    return !callback.isDefaultPrevented();
  };

  triggerCallOnEventBus = (e: Event, cbArgs: Array<any>) => {
    this.listeners.forEach(l => {
      l(e, cbArgs);
    });
  }

  updateTitle = (content, reposition) => {
    if (this._update(content, this.elements.title, reposition) === FALSE) {
      this._removeTitle(FALSE);
    }
  };

  clearShowTimeout = event => {
    var showCanceled = this.preshow === TRUE;
    clearTimeout(this.timers.show);
    this.preshow = FALSE;
    if (showCanceled) {
      this.trigger('preshowCanceled', null, event);
    }
  };

  destroy(immediate) {
    if (this.destroyed) {
      // Set flag the signify destroy is taking place to plugins
      // and ensure it only gets destroyed once!
      return this;
    }

    const process = () => {
      if (this.destroyed) {
        return;
      }

      let title = this.target.attr(oldtitle);

      if (this.rendered) {
        this.setState({
          shouldRender: false,
        });
        // this.tooltip
        //   .stop(1, 0)
        //   .find('*')
        //   .remove()
        //   .end()
        //   .remove();
      }
      // Destroy all plugins
      this.plugins.foreach(p => p.destroy && p.destroy());

      // Clear timers
      this.timers.forEach(t => clearTimeout(this.timers[t]));

      // ????
      // Remove api object and ARIA attributes
      // target.removeData(NAMESPACE)
      // .removeAttr(ATTR_ID)
      // .removeAttr(ATTR_HAS)
      // .removeAttr('aria-describedby');

      // Reset old title attribute if removed
      if (this.props.options.suppress && title) {
        target.attr('title', title).removeAttr(oldtitle);
      }

      // Remove qTip events associated with this API
      this._unassignEvents();

      // Remove ID from used id objects, and delete object references
      // for better garbage collection and leak protection
      this.options = this.elements = this.cache = this.timers = this.plugins = this.mouse = NULL;

      // Delete epoxsed API object
      delete QTIP.api[this.id];
    };

    if (immediate !== true || (this.triggering === 'hide' && this.rendered)) {
      this.tooltip.one('tooltiphidden', $.proxy(process, this));
      !this.triggering && this.hide();
    } else {
      process();
    }
    return;
  }
}

// Munge the primitives - Paul Irish tip
var TRUE = true,
  FALSE = false,
  NULL = null,
  // Common variables
  X = 'x',
  Y = 'y',
  WIDTH = 'width',
  HEIGHT = 'height',
  // Positioning sides
  TOP = 'top',
  LEFT = 'left',
  BOTTOM = 'bottom',
  RIGHT = 'right',
  CENTER = 'center',
  // Position adjustment types
  FLIP = 'flip',
  FLIPINVERT = 'flipinvert',
  SHIFT = 'shift',
  // Shortcut vars
  QTIP,
  PROTOTYPE,
  CORNER,
  CHECKS,
  PLUGINS = {},
  NAMESPACE = 'qtip',
  ATTR_HAS = 'data-hasqtip',
  ATTR_ID = 'data-qtip-id',
  WIDGET = ['ui-widget', 'ui-tooltip'],
  SELECTOR = '.' + NAMESPACE,
  INACTIVE_EVENTS = 'click dblclick mousedown mouseup mousemove mouseleave mouseenter'.split(' '),
  CLASS_FIXED = NAMESPACE + '-fixed',
  CLASS_DEFAULT = NAMESPACE + '-default',
  CLASS_FOCUS = NAMESPACE + '-focus',
  CLASS_HOVER = NAMESPACE + '-hover',
  CLASS_DISABLED = NAMESPACE + '-disabled',
  replaceSuffix = '_replacedByqTip',
  oldtitle = 'oldtitle',
  trackingBound,
  // Browser detection
  BROWSER = {
    /*
	 * IE version detection
	 *
	 * Adapted from: http://ajaxian.com/archives/attack-of-the-ie-conditional-comment
	 * Credit to James Padolsey for the original implemntation!
	 */
    ie: (function() {
      for (
        var v = 4, i = document.createElement('div');
        (i.innerHTML = '<!--[if gt IE ' + v + ']><i></i><![endif]-->') &&
        i.getElementsByTagName('i')[0];
        v += 1
      ) {}
      return v > 4 ? v : NaN;
    })(),

    /*
	 * iOS version detection
	 */
    iOS:
      parseFloat(
        (
          '' +
          (/CPU.*OS ([0-9_]{1,5})|(CPU like).*AppleWebKit.*Mobile/i.exec(navigator.userAgent) || [
            0,
            '',
          ])[1]
        )
          .replace('undefined', '3_2')
          .replace('_', '.')
          .replace('_', '')
      ) || FALSE,
  };
