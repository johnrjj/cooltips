import React from 'react';

export interface ButtonProps {
  options: any;
  tooltip: any;
  button: any;
  namespace: string;
}

class Button extends React.Component<ButtonProps, {}> {
  constructor(props) {
    super(props);
  }

  render() {
    let className = 'qtip-close ';
    if (this.props.options.style.widget) {
      className += `${this.props.namespace}-icon`;
    }
    return <a title="close" aria-label="close" className={className} />;
  }
}

export { Button };

// PROTOTYPE._createButton = function()
// {
// 	var self = this,
// 		elements = this.elements,
// 		tooltip = elements.tooltip,
// 		button = this.options.content.button,
// 		isString = typeof button === 'string',
// 		close = isString ? button : 'Close tooltip';

// 	if(elements.button) { elements.button.remove(); }

// 	// Use custom button if one was supplied by user, else use default
// 	if(button.jquery) {
// 		elements.button = button;
// 	}
// 	else {
// 		elements.button = $('<a />', {
// 			'class': 'qtip-close ' + (this.options.style.widget ? '' : NAMESPACE+'-icon'),
// 			'title': close,
// 			'aria-label': close
// 		})
// 		.prepend(
// 			$('<span />', {
// 				'class': 'ui-icon ui-icon icon-close',
// 				'html': '&times;'
// 			})
// 		);
// 	}

// 	// Create button and setup attributes
// 	elements.button.appendTo(elements.titlebar || tooltip)
// 		.attr('role', 'button')
// 		.click(function(event) {
// 			if(!tooltip.hasClass(CLASS_DISABLED)) { self.hide(event); }
// 			return FALSE;
// 		});
// };

// PROTOTYPE._updateButton = function(button)
// {
// 	// Make sure tooltip is rendered and if not, return
// 	if(!this.rendered) { return FALSE; }

// 	var elem = this.elements.button;
// 	if(button) { this._createButton(); }
// 	else { elem.remove(); }
// };
