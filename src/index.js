// Some helper functions
function removeClass (el, cls) {
    if (el.classList) {
        el.classList.remove(cls)
        return
    }
    // IE 9 fallback
    var reg = new RegExp('(\\s|^)'+cls+'(\\s|$)')
    el.className = el.className.replace(reg, ' ')
}

 function addClass (el, cls) {
    if (el.classList) {
        el.classList.add(cls)
        return
    }
    // IE 9 fallback
    el.className += ' ' + cls
}

 function invoke (func, params) {
    if (func) {
        return func.apply(this, params)
    }
    return false
}

 function resolveEl (query) {
    if (typeof query == 'string') {
        return document.querySelector(query)
    }
    // Assum it's already a HTMLElement. Need to check this futher?
    return query;
}

 function resolveElements (query) {
    if (typeof query === 'string') {
        return document.querySelectorAll(query)
    }
    if (Array.isArray(query)) {
        return query
    }
    // else assume HtmlElement
    // return (
    //   typeof HTMLElement === "object" ? o instanceof HTMLElement : //DOM2
    //   o && typeof o === "object" && o !== null && o.nodeType === 1 && typeof o.nodeName==="string"
    return [query]
}

export default class Scroller {
    list = []
    // there are per default two triggers: top and bottom
    // Their main job is to trigger an action on (bottom) and off (top)
    topOffset = 0
    bottomOffset = 0

    constructor (options) {
        this.topOffset = options.topOffset || 0
        this.bottomOffset = options.bottomOffset || 0
    }

    // Trigger
    static relativeTrigger (begin, end) {
        return {
            begin: (el, rect) => rect.top + begin + window.scrollY,
            end: (el, rect) => rect.top + end + window.scrollY
        }
    }

    static absoluteTrigger (start, end) {
        return {
            begin: (el, rect) => start + window.scrollY,
            end: (el, rect) => end + window.scrollY
        }
    }

    static elementTrigger (start, end, offset) {
        return {
            begin: (el, rect) => resolveEl(start).top + window.scrollY,
            end: (el, rect) => resolveEl(end).top + window.scrollY
        }
    }

    // Actions
    static toggleClass (show, hide) {
        return {
            enter (el) {
                if (hide) {
                    removeClass(el, hide)
                }
                addClass(el, show)
            },
            leave (el) {
                removeClass(el, show)
                if (hide) {
                    addClass(el, hide)
                }
            }
        }
    }

    addScene (elements, trigger, action) {
        let els = resolveElements(elements)
        for (let i = 0; i < els.length; i++) {
            // action: action(enter, leave, progress)
            let el = els[i]
            let rect = els[i].getBoundingClientRect()
            this.list.push({
                el,
                rect,
                // trigger
                begin: trigger.begin(el, rect),
                end: trigger.end(el, rect),
                // data
                state: 0,
                // actions
                enter: action.enter,
                leave: action.leave,
                progress: action.progress
            })
        }
    }

    init () {
        // Register onSCroll and resize
        this.scrollEvent = this.scroll.bind(this)
        this.resizeEvent = this.resize.bind(this)
        window.addEventListener('scroll', this.scrollEvent)
        window.addEventListener('resize', this.resizeEvent)
        this.scroll()
    }

    destroy () {
        window.removeEventListener('scroll', this.scrollEvent)
        window.removeEventListener('resize', this.resizeEvent)
    }

    scroll () {
        let y = window.scrollY
        let h = window.innerHeight
        for (let item of this.list) {
            // item.begin && item.end is in absolute units (relative to viewport)
            let rs = item.begin - y
            let re = item.end - y
            let between = (rs + this.bottomOffset < h && rs + this.bottomOffset > 0) || (re - this.topOffset < h && re - this.topOffset > 0)
            // First invoke progress then leave, enter hooks
            if (item.state == 1) {
                invoke(item.progress, [item.el, item.rect, item.begin - y])
            }
            if (between && item.state == 0) {
                item.state = 1
                invoke(item.enter, [item.el])
            }
            if (!between && item.state == 1) {
                item.state = 0
                invoke(item.leave, [item.el])
            }
        }
    }

    resize () {
        this.scroll()
    }
}
