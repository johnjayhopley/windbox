/**
 * WindBox
 * @version 1.0
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
  constructor(selector = null, customTransitions) {
    if(selector === null) {
      throw 'WindBox: no selector';
    }
    if(customTransitions && typeof customTransitions !== 'boolean'){
      throw 'WindBox: customTransitions must be a boolean.';
    }

    this.container = document.querySelector(selector);
    this.customTransitions = customTransitions;
    this.items = this.container.children;
    this.headers = [];
    this.indexItems();
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
      let id = 'item-'+(index+1);

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
  }

  /**
   * WindBox#closeAll() - Closes and defaults all 
   * headers and content areas
   * @protected
   * @returns void
   */ 
  closeAll() {
    let contentAreas = document.querySelectorAll('.windbox-content');
    let headers = document.querySelectorAll('.windbox-header');

    if(contentAreas !== null) {
      [].forEach.call(contentAreas, (contentArea) => {
        if(this.customTransitions){
          contentArea.style.display = 'block';
          contentArea.classList.remove('open');
        }else{
          contentArea.style.display = 'none';
        }
        WindBox.attrs(contentArea, {
          'aria-hidden': true,
          'disabled': false,
        });
      })
    }

    if(headers !== null) {
      [].forEach.call(headers, (header) => {
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
    this.closeAll();

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
}
