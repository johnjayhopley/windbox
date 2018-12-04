/**
 * WindBox
 * @version 2.0.1
 * @author John Hopley <jhopley@readingroom.com>
 */

export default class WindBox {

  /**
   * WindBox#constructor() - instantiates module and
   * @constructor
   * @param {String} selector
   * @param {Boolean} customTransitions
   * @returns void
   */
  constructor(selector = null, customTransitions = false) {
    if(selector === null) {
      throw 'WindBox: no selector';
    }
    if(customTransitions && typeof customTransitions !== 'boolean'){
      throw 'WindBox: customTransitions must be a boolean.';
    }

    this.selector = selector;
    this.elements = document.querySelectorAll(selector);
    this.customTransitions = customTransitions;
    this.index = 0;

    this.elements.forEach((element) => {
      this.index = this.index + 1;
      this.container = element;
      this.items = this.container.children;

      WindBox.attrs(this.container, {
        id: WindBox.uuid(),
      });

      this.headers = [];

      this.indexItems();
    });
  }

  /**
   * WindBox#indexItems() - index's headers 
   * and content areas
   * @protected
   * @returns void
   */
  indexItems() {
    [].forEach.call(this.items, (value, index) => {
      let content = value.querySelector('div');
      let head = value.querySelector('button');
      let selectorName = this.selector.replace('.', '');
      let id = `${selectorName}-item-${(this.index)}-${(index+1)}`;

      head.classList.add('windbox-header');
      content.classList.add('windbox-content');

      WindBox.attrs(head, {
        'target': id,
        'role': 'heading',
        'aria-expanded': false,
        'aria-controls': id
      });

      WindBox.attrs(content, {
        'id': id,
        'aria-hidden': true,
        'disabled': true,
        'role': 'region'
      });

      this.headers.push(head);
    }); 

    this.dispatchEvents(); 
    this.closeAll();
  }

  /**
   * WindBox#closeAll() - Closes and defaults all 
   * headers and content areas
   * @protected
   * @returns void
   */ 
  closeAll(target = null) {
    let content = '.windbox-content';
    let headers = '.windbox-header';

    if (target != null) {
      content = `#${target.parentNode.parentNode.id} .windbox-content`;
      headers = `#${target.parentNode.parentNode.id} .windbox-header`;
    }

    let contentAreas = document.querySelectorAll(content);
    let headersAreas = document.querySelectorAll(headers);
    
    if(contentAreas !== null) {
      [].forEach.call(contentAreas, (contentArea, index) => {
        if (this.customTransitions){
          contentArea.style.display = 'block';
          contentArea.classList.remove('open');
        } else {
          contentArea.style.display = 'none';
        }
        WindBox.attrs(contentArea, {
          'aria-hidden': true,
          'disabled': false,
        });
      })
    }

    if(headersAreas !== null) {
      [].forEach.call(headersAreas, (header) => {
        WindBox.attrs(header, {
          'aria-expanded': false,
        });
      })
    }
  }

  /**
   * WindBox#setState() - Sets state of selected 
   * and deselects all others
   * @param {Node} head
   * @param {Node} content
   * @param {Boolean} open 
   * @protected
   * @returns void
   */ 
  setState(head, content, open) {
    this.closeAll(head);

    if(open) {
      content.classList.remove('open');
    } else {
      content.classList.add('open');
    }

    WindBox.attrs(content, {
      'aria-hidden': (open) ? true : false,
      'disabled': (open) ? true : false,
    });

    WindBox.attrs(head, {
      'aria-expanded': (open) ? false : true,
    });

    if(!this.customTransitions){
      content.style.display = (open) ? 'none' : 'block';
    }
  }

  /**
   * WindBox#dispatchEvents() - create event listeners
   * @protected
   * @returns void
   */ 
  dispatchEvents() {
    this.headers.forEach((item, index) => {
      item.addEventListener('click', (event) => {
        var target = document.querySelector(
          '#'+event.currentTarget.attributes.target.value
        );

        this.setState(
          event.currentTarget,
          target,
          this.customTransitions ?
          (target.classList.contains('open')) ? true : false :
          (target.style.display === 'block') ? true : false
        );
      })
    })
  }

  /**
   * WindBox#attrs() - set multiple 
   * attributes on the passed node
   * @static
   * @returns void
   */ 
  static attrs(element, attrs) {
    if(element.setAttribute) {
      Object.keys(attrs).forEach((prop) => {
        element.setAttribute(prop, attrs[prop]);
      });       
    }
  }

  /**
   * WindBox#uuid() 
   * creates a unique ID
   * @static
   * @returns string
   */ 
  static uuid() {
    return `windbox-${(
      Math.random().toString(36).substring(2) + 
      (new Date()).getTime().toString(36)
    )}`;
  }
}