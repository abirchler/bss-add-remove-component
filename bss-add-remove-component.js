class BSSAddRemove extends HTMLElement {

	constructor() {
		super()
		this.init()
	}

	init() {

    this.recursiveDepth = 0
		this.container = this.querySelector(this.dataset.container)
		this._setupTemplate()
		this._setupEvents()
    this.initRowValue()
	}

  initRowValue(){

    const values = [0]

    const stuff = this.querySelectorAll('input[type="hidden"]')

    stuff.forEach(item => {
      let n = this.extractNameIndex(item.name)
      values.push(n)
    });

    this._incrementValue = Math.max.apply(this, values)
  }

  extractNameIndex(name){
    const re = new RegExp(`^[^\\[]+(\\[\\d+\\]){${this.recursiveDepth}}\\[(\\d+)\\].*`)
    let n = name.replace(re, '$2')
    n = Number(n)
    return n
  }

	_setupTemplate() {

		let selector = this.dataset.template
    let row
    if ( ! selector ) {
      const children = this.container.children
      const n = children.length
      if (n){
        row = children[n-1]
      }
    }
    else {
      row = this.querySelector(selector)
      if ('TEMPLATE' == row.tagName){
        row = row.content.children[0]
      }
    }

		this.template = row.cloneNode(true)

    const _this = this
    const rows = this.container.children
    for(let i=0, n=rows.length; i<n; i++){
      this.initRow(rows[i])
    }
	}

	_setupEvents() {

		const addSelector = this.dataset.add
		const _this = this

    this.addButtons = this.querySelectorAll(addSelector)

		this.addButtons.forEach(
			item => {
				item.addEventListener('click', e => {
					_this.add();
				})
			}
		)
	}
	
	newRow() {

		const row = this.template.cloneNode(true)

		return row
	}

  adjustIndex(row){

    const inc = this.incrementValue()
    this.adjustIds(row, inc);
    this.adjustNames(row, inc);
  }

  adjustIds(row, inc){

    const re = new RegExp(`^(.*)(-(\\d+)){${this.recursiveDepth}}(-\\d+)(.*)`)

    row.querySelectorAll('[id]').forEach(el => {
      let id = el.id
      id = id.replace(re, `$1-${inc}$5`)
      el.id = id
    })
  }

  adjustNames(row, inc){

    const re = new RegExp(`^([^\\[]+(\\[\\d+\\]){${this.recursiveDepth}}\\[)(\\d+)(\\].*)`)

    row.querySelectorAll('[name]').forEach(el => {
      let name = el.getAttribute('name')
      name = name.replace(re, `$1${inc}$4`)
      el.setAttribute("name", name)
    })
  }

	initRow(r){

		let removeSelector = this.dataset.remove

		let _this = this
    r.removeButtons = r.querySelectorAll(removeSelector)

		r.removeButtons.forEach(x => x.addEventListener('click', e => {
			_this.remove(r)
		}))
	}

	shouldAdd() {
		if ( this.dataset.max ) {
			if ( this.dataset.max <= this.container.children.length)
				return false
		}

		return true
	}

	shouldRemove() {
		if ( this.dataset.min ) {
			if ( this.dataset.min >= this.container.children.length)
				return false
		}

		return true
	}

	add() {

		if ( this.shouldAdd() ) {

			const addEvent = new Event(
				'row-added',
				{
					cancelable: true
				}
			)

			if ( this.dispatchEvent(addEvent) ) {
        const r = this.newRow()
        this.appendChild(r)
			}
		}
	}

  appendChild(row){

		this.initRow(row)

    this.adjustIndex(row);

    const result = HTMLElement.prototype.appendChild.call(this.container, row)

    this.added(row)

    return result
  }

	added(r){

		let t = this.container.appendChild(r)

		const addedEvent = new Event('row-added')

		r.dispatchEvent(addedEvent)
    this.modified()
	}

  modified(){
    this.updateUi()
    this.dispatchEvent(new Event('modified'));
  }

	remove(r) {

		if ( this.shouldRemove() ) {

			const e = new Event(
				'row-removed',
				{
					cancelable: true
				}
			)

			if (this.dispatchEvent(e)) {
				r.parentElement.removeChild(r)
			}

      this.modified()
		}
	}

  updateUi(){
    if ( ! this.shouldAdd() ) {
      this.disableAdd()
    }
    else{
      this.enableAdd()
    }
    if ( ! this.shouldRemove() ) {
      this.disableRemove()
    }
    else {
      this.enableRemove()
    }
  }

  disableAdd() {
    this.addButtons.forEach(button => {
      button.setAttribute('disabled', 'disabled')
    })
  }

  enableAdd() {
    this.addButtons.forEach(button => {
      button.removeAttribute('disabled')
    })
  }

  disableRemove() {
    for(let i=0, n=this.container.children.length; i<n; i++){
      const b = this.container.children[i]
      this.disableRowRemove(b)
    }
  }

  enableRemove() {
    for(let i=0, n=this.container.children.length; i<n; i++){
      const b = this.container.children[i]
      this.enableRowRemove(b)
    }
  }

  disableRowRemove(row){
    row.removeButtons.forEach(button => {
      button.setAttribute('disabled', 'disabled')
    })
  }

  enableRowRemove(row){
    row.removeButtons.forEach(button => {
      button.removeAttribute('disabled')
    })
  }

  incrementValue(){
    this._incrementValue++;
    return this._incrementValue;
  }

}

customElements.define('bss-add-remove', BSSAddRemove);
