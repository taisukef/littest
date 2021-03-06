const t2 = window.ShadowRoot && (void 0 === window.ShadyCSS || window.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, i1 = Symbol(), s = new Map;
class e {
    constructor(t1, s1){
        if (this._$cssResult$ = !0, s1 !== i1) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
        this.cssText = t1;
    }
    get styleSheet() {
        let i = s.get(this.cssText);
        return t2 && void 0 === i && (s.set(this.cssText, i = new CSSStyleSheet), i.replaceSync(this.cssText)), i;
    }
    toString() {
        return this.cssText;
    }
}
const o = (t, ...s)=>{
    const o = 1 === t.length ? t[0] : s.reduce((i, s, e)=>i + ((t)=>{
            if (!0 === t._$cssResult$) return t.cssText;
            if ("number" == typeof t) return t;
            throw Error("Value passed to 'css' function must be a 'css' function result: " + t + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
        })(s) + t[e + 1]
    , t[0]);
    return new e(o, i1);
}, n = t2 ? (t)=>t
 : (t)=>t instanceof CSSStyleSheet ? ((t)=>{
        let s = "";
        for (const i of t.cssRules)s += i.cssText;
        return ((t)=>new e("string" == typeof t ? t : t + "", i1)
        )(s);
    })(t) : t
;
var h, l;
const r = {
    toAttribute (t, i) {
        switch(i){
            case Boolean:
                t = t ? "" : null;
                break;
            case Object:
            case Array:
                t = null == t ? t : JSON.stringify(t);
        }
        return t;
    },
    fromAttribute (t, i) {
        let s = t;
        switch(i){
            case Boolean:
                s = null !== t;
                break;
            case Number:
                s = null === t ? null : Number(t);
                break;
            case Object:
            case Array:
                try {
                    s = JSON.parse(t);
                } catch (t3) {
                    s = null;
                }
        }
        return s;
    }
}, u = (t, i)=>i !== t && (i == i || t == t)
, a = {
    attribute: !0,
    type: String,
    converter: r,
    reflect: !1,
    hasChanged: u
};
class d extends HTMLElement {
    constructor(){
        super(), this._$Et = new Map, this.isUpdatePending = !1, this.hasUpdated = !1, this._$Ei = null, this.o();
    }
    static addInitializer(t) {
        var i;
        null !== (i = this.l) && void 0 !== i || (this.l = []), this.l.push(t);
    }
    static get observedAttributes() {
        this.finalize();
        const t = [];
        return this.elementProperties.forEach((i, s)=>{
            const e = this._$Eh(s, i);
            void 0 !== e && (this._$Eu.set(e, s), t.push(e));
        }), t;
    }
    static createProperty(t, i = a) {
        if (i.state && (i.attribute = !1), this.finalize(), this.elementProperties.set(t, i), !i.noAccessor && !this.prototype.hasOwnProperty(t)) {
            const s = "symbol" == typeof t ? Symbol() : "__" + t, e = this.getPropertyDescriptor(t, s, i);
            void 0 !== e && Object.defineProperty(this.prototype, t, e);
        }
    }
    static getPropertyDescriptor(t, i, s) {
        return {
            get () {
                return this[i];
            },
            set (e) {
                const o = this[t];
                this[i] = e, this.requestUpdate(t, o, s);
            },
            configurable: !0,
            enumerable: !0
        };
    }
    static getPropertyOptions(t) {
        return this.elementProperties.get(t) || a;
    }
    static finalize() {
        if (this.hasOwnProperty("finalized")) return !1;
        this.finalized = !0;
        const t = Object.getPrototypeOf(this);
        if (t.finalize(), this.elementProperties = new Map(t.elementProperties), this._$Eu = new Map, this.hasOwnProperty("properties")) {
            const t = this.properties, i = [
                ...Object.getOwnPropertyNames(t),
                ...Object.getOwnPropertySymbols(t)
            ];
            for (const s of i)this.createProperty(s, t[s]);
        }
        return this.elementStyles = this.finalizeStyles(this.styles), !0;
    }
    static finalizeStyles(t) {
        const i = [];
        if (Array.isArray(t)) {
            const s = new Set(t.flat(1 / 0).reverse());
            for (const t3 of s)i.unshift(n(t3));
        } else void 0 !== t && i.push(n(t));
        return i;
    }
    static _$Eh(t, i) {
        const s = i.attribute;
        return !1 === s ? void 0 : "string" == typeof s ? s : "string" == typeof t ? t.toLowerCase() : void 0;
    }
    o() {
        var t;
        this._$Ep = new Promise((t)=>this.enableUpdating = t
        ), this._$AL = new Map, this._$Ev(), this.requestUpdate(), null === (t = this.constructor.l) || void 0 === t || t.forEach((t)=>t(this)
        );
    }
    addController(t) {
        var i, s;
        (null !== (i = this._$Em) && void 0 !== i ? i : this._$Em = []).push(t), void 0 !== this.renderRoot && this.isConnected && (null === (s = t.hostConnected) || void 0 === s || s.call(t));
    }
    removeController(t) {
        var i;
        null === (i = this._$Em) || void 0 === i || i.splice(this._$Em.indexOf(t) >>> 0, 1);
    }
    _$Ev() {
        this.constructor.elementProperties.forEach((t, i)=>{
            this.hasOwnProperty(i) && (this._$Et.set(i, this[i]), delete this[i]);
        });
    }
    createRenderRoot() {
        var i;
        const s = null !== (i = this.shadowRoot) && void 0 !== i ? i : this.attachShadow(this.constructor.shadowRootOptions);
        return ((i, s)=>{
            t2 ? i.adoptedStyleSheets = s.map((t)=>t instanceof CSSStyleSheet ? t : t.styleSheet
            ) : s.forEach((t)=>{
                const s = document.createElement("style");
                s.textContent = t.cssText, i.appendChild(s);
            });
        })(s, this.constructor.elementStyles), s;
    }
    connectedCallback() {
        var t;
        void 0 === this.renderRoot && (this.renderRoot = this.createRenderRoot()), this.enableUpdating(!0), null === (t = this._$Em) || void 0 === t || t.forEach((t)=>{
            var i;
            return null === (i = t.hostConnected) || void 0 === i ? void 0 : i.call(t);
        });
    }
    enableUpdating(t) {
    }
    disconnectedCallback() {
        var t;
        null === (t = this._$Em) || void 0 === t || t.forEach((t)=>{
            var i;
            return null === (i = t.hostDisconnected) || void 0 === i ? void 0 : i.call(t);
        });
    }
    attributeChangedCallback(t, i, s) {
        this._$AK(t, s);
    }
    _$Eg(t, i, s = a) {
        var e, o;
        const n = this.constructor._$Eh(t, s);
        if (void 0 !== n && !0 === s.reflect) {
            const h = (null !== (o = null === (e = s.converter) || void 0 === e ? void 0 : e.toAttribute) && void 0 !== o ? o : r.toAttribute)(i, s.type);
            this._$Ei = t, null == h ? this.removeAttribute(n) : this.setAttribute(n, h), this._$Ei = null;
        }
    }
    _$AK(t, i) {
        var s, e, o;
        const n = this.constructor, h = n._$Eu.get(t);
        if (void 0 !== h && this._$Ei !== h) {
            const t = n.getPropertyOptions(h), l = t.converter, u = null !== (o = null !== (e = null === (s = l) || void 0 === s ? void 0 : s.fromAttribute) && void 0 !== e ? e : "function" == typeof l ? l : null) && void 0 !== o ? o : r.fromAttribute;
            this._$Ei = h, this[h] = u(i, t.type), this._$Ei = null;
        }
    }
    requestUpdate(t, i, s) {
        let e = !0;
        void 0 !== t && (((s = s || this.constructor.getPropertyOptions(t)).hasChanged || u)(this[t], i) ? (this._$AL.has(t) || this._$AL.set(t, i), !0 === s.reflect && this._$Ei !== t && (void 0 === this._$ES && (this._$ES = new Map), this._$ES.set(t, s))) : e = !1), !this.isUpdatePending && e && (this._$Ep = this._$EC());
    }
    async _$EC() {
        this.isUpdatePending = !0;
        try {
            await this._$Ep;
        } catch (t) {
            Promise.reject(t);
        }
        const t3 = this.scheduleUpdate();
        return null != t3 && await t3, !this.isUpdatePending;
    }
    scheduleUpdate() {
        return this.performUpdate();
    }
    performUpdate() {
        var t;
        if (!this.isUpdatePending) return;
        this.hasUpdated, this._$Et && (this._$Et.forEach((t, i)=>this[i] = t
        ), this._$Et = void 0);
        let i = !1;
        const s = this._$AL;
        try {
            i = this.shouldUpdate(s), i ? (this.willUpdate(s), null === (t = this._$Em) || void 0 === t || t.forEach((t)=>{
                var i;
                return null === (i = t.hostUpdate) || void 0 === i ? void 0 : i.call(t);
            }), this.update(s)) : this._$ET();
        } catch (t3) {
            throw i = !1, this._$ET(), t3;
        }
        i && this._$AE(s);
    }
    willUpdate(t) {
    }
    _$AE(t) {
        var i;
        null === (i = this._$Em) || void 0 === i || i.forEach((t)=>{
            var i;
            return null === (i = t.hostUpdated) || void 0 === i ? void 0 : i.call(t);
        }), this.hasUpdated || (this.hasUpdated = !0, this.firstUpdated(t)), this.updated(t);
    }
    _$ET() {
        this._$AL = new Map, this.isUpdatePending = !1;
    }
    get updateComplete() {
        return this.getUpdateComplete();
    }
    getUpdateComplete() {
        return this._$Ep;
    }
    shouldUpdate(t) {
        return !0;
    }
    update(t) {
        void 0 !== this._$ES && (this._$ES.forEach((t, i)=>this._$Eg(i, this[i], t)
        ), this._$ES = void 0), this._$ET();
    }
    updated(t) {
    }
    firstUpdated(t) {
    }
}
var c, v;
d.finalized = !0, d.elementProperties = new Map, d.elementStyles = [], d.shadowRootOptions = {
    mode: "open"
}, null === (h = globalThis.reactiveElementPlatformSupport) || void 0 === h || h.call(globalThis, {
    ReactiveElement: d
}), (null !== (l = globalThis.reactiveElementVersions) && void 0 !== l ? l : globalThis.reactiveElementVersions = []).push("1.0.0-rc.3");
const p = globalThis.trustedTypes, f = p ? p.createPolicy("lit-html", {
    createHTML: (t)=>t
}) : void 0, g = `lit$${(Math.random() + "").slice(9)}$`, b = "?" + g, y = `<${b}>`, $ = document, w = (t = "")=>$.createComment(t)
, m = (t)=>null === t || "object" != typeof t && "function" != typeof t
, S = Array.isArray, C = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, A = /-->/g, _ = />/g, T = />|[ 	\n\r](?:([^\s"'>=/]+)([ 	\n\r]*=[ 	\n\r]*(?:[^ 	\n\r"'`<>=]|("|')|))|$)/g, x = /'/g, k = /"/g, E = /^(?:script|style|textarea)$/i, U = ((t)=>(i, ...s)=>({
            _$litType$: t,
            strings: i,
            values: s
        })
)(1), M = Symbol.for("lit-noChange"), N = Symbol.for("lit-nothing"), O = new WeakMap, R = $.createTreeWalker($, 129, null, !1), j = (t, i)=>{
    const s = t.length - 1, e = [];
    let o, n = 2 === i ? "<svg>" : "", h = C;
    for(let i2 = 0; i2 < s; i2++){
        const s = t[i2];
        let l, r, u = -1, a = 0;
        for(; a < s.length && (h.lastIndex = a, r = h.exec(s), null !== r);)a = h.lastIndex, h === C ? "!--" === r[1] ? h = A : void 0 !== r[1] ? h = _ : void 0 !== r[2] ? (E.test(r[2]) && (o = RegExp("</" + r[2], "g")), h = T) : void 0 !== r[3] && (h = T) : h === T ? ">" === r[0] ? (h = null != o ? o : C, u = -1) : void 0 === r[1] ? u = -2 : (u = h.lastIndex - r[2].length, l = r[1], h = void 0 === r[3] ? T : '"' === r[3] ? k : x) : h === k || h === x ? h = T : h === A || h === _ ? h = C : (h = T, o = void 0);
        const d = h === T && t[i2 + 1].startsWith("/>") ? " " : "";
        n += h === C ? s + y : u >= 0 ? (e.push(l), s.slice(0, u) + "$lit$" + s.slice(u) + g + d) : s + g + (-2 === u ? (e.push(void 0), i2) : d);
    }
    const l = n + (t[s] || "<?>") + (2 === i ? "</svg>" : "");
    return [
        void 0 !== f ? f.createHTML(l) : l,
        e
    ];
};
class z {
    constructor({ strings: t3 , _$litType$: i2  }, s2){
        let e1;
        this.parts = [];
        let o1 = 0, n1 = 0;
        const h1 = t3.length - 1, l1 = this.parts, [r1, u1] = j(t3, i2);
        if (this.el = z.createElement(r1, s2), R.currentNode = this.el.content, 2 === i2) {
            const t = this.el.content, i = t.firstChild;
            i.remove(), t.append(...i.childNodes);
        }
        for(; null !== (e1 = R.nextNode()) && l1.length < h1;){
            if (1 === e1.nodeType) {
                if (e1.hasAttributes()) {
                    const t = [];
                    for (const i of e1.getAttributeNames())if (i.endsWith("$lit$") || i.startsWith(g)) {
                        const s = u1[n1++];
                        if (t.push(i), void 0 !== s) {
                            const t = e1.getAttribute(s.toLowerCase() + "$lit$").split(g), i = /([.?@])?(.*)/.exec(s);
                            l1.push({
                                type: 1,
                                index: o1,
                                name: i[2],
                                strings: t,
                                ctor: "." === i[1] ? B : "?" === i[1] ? D : "@" === i[1] ? J : L
                            });
                        } else l1.push({
                            type: 6,
                            index: o1
                        });
                    }
                    for (const i3 of t)e1.removeAttribute(i3);
                }
                if (E.test(e1.tagName)) {
                    const t = e1.textContent.split(g), i = t.length - 1;
                    if (i > 0) {
                        e1.textContent = p ? p.emptyScript : "";
                        for(let s = 0; s < i; s++)e1.append(t[s], w()), R.nextNode(), l1.push({
                            type: 2,
                            index: ++o1
                        });
                        e1.append(t[i], w());
                    }
                }
            } else if (8 === e1.nodeType) if (e1.data === b) l1.push({
                type: 2,
                index: o1
            });
            else {
                let t = -1;
                for(; -1 !== (t = e1.data.indexOf(g, t + 1));)l1.push({
                    type: 7,
                    index: o1
                }), t += g.length - 1;
            }
            o1++;
        }
    }
    static createElement(t, i) {
        const s = $.createElement("template");
        return s.innerHTML = t, s;
    }
}
function I(t, i, s = t, e) {
    var o, n, h, l;
    if (i === M) return i;
    let r = void 0 !== e ? null === (o = s._$Cl) || void 0 === o ? void 0 : o[e] : s._$Cu;
    const u = m(i) ? void 0 : i._$litDirective$;
    return (null == r ? void 0 : r.constructor) !== u && (null === (n = null == r ? void 0 : r._$AO) || void 0 === n || n.call(r, !1), void 0 === u ? r = void 0 : (r = new u(t), r._$AT(t, s, e)), void 0 !== e ? (null !== (h = (l = s)._$Cl) && void 0 !== h ? h : l._$Cl = [])[e] = r : s._$Cu = r), void 0 !== r && (i = I(t, r._$AS(t, i.values), r, e)), i;
}
class P {
    constructor(t4, i3){
        this.v = [], this._$AN = void 0, this._$AD = t4, this._$AM = i3;
    }
    get parentNode() {
        return this._$AM.parentNode;
    }
    get _$AU() {
        return this._$AM._$AU;
    }
    p(t) {
        var i;
        const { el: { content: s  } , parts: e  } = this._$AD, o = (null !== (i = null == t ? void 0 : t.creationScope) && void 0 !== i ? i : $).importNode(s, !0);
        R.currentNode = o;
        let n = R.nextNode(), h = 0, l = 0, r = e[0];
        for(; void 0 !== r;){
            if (h === r.index) {
                let i;
                2 === r.type ? i = new H(n, n.nextSibling, this, t) : 1 === r.type ? i = new r.ctor(n, r.name, r.strings, this, t) : 6 === r.type && (i = new W(n, this, t)), this.v.push(i), r = e[++l];
            }
            h !== (null == r ? void 0 : r.index) && (n = R.nextNode(), h++);
        }
        return o;
    }
    m(t) {
        let i = 0;
        for (const s of this.v)void 0 !== s && (void 0 !== s.strings ? (s._$AI(t, s, i), i += s.strings.length - 2) : s._$AI(t[i])), i++;
    }
}
class H {
    constructor(t5, i4, s3, e2){
        var o2;
        this.type = 2, this._$AH = N, this._$AN = void 0, this._$AA = t5, this._$AB = i4, this._$AM = s3, this.options = e2, this._$Cg = null === (o2 = null == e2 ? void 0 : e2.isConnected) || void 0 === o2 || o2;
    }
    get _$AU() {
        var t, i;
        return null !== (i = null === (t = this._$AM) || void 0 === t ? void 0 : t._$AU) && void 0 !== i ? i : this._$Cg;
    }
    get parentNode() {
        let t = this._$AA.parentNode;
        const i = this._$AM;
        return void 0 !== i && 11 === t.nodeType && (t = i.parentNode), t;
    }
    get startNode() {
        return this._$AA;
    }
    get endNode() {
        return this._$AB;
    }
    _$AI(t, i = this) {
        t = I(this, t, i), m(t) ? t === N || null == t || "" === t ? (this._$AH !== N && this._$AR(), this._$AH = N) : t !== this._$AH && t !== M && this.$(t) : void 0 !== t._$litType$ ? this.T(t) : void 0 !== t.nodeType ? this.M(t) : ((t)=>{
            var i;
            return S(t) || "function" == typeof (null === (i = t) || void 0 === i ? void 0 : i[Symbol.iterator]);
        })(t) ? this.S(t) : this.$(t);
    }
    A(t, i = this._$AB) {
        return this._$AA.parentNode.insertBefore(t, i);
    }
    M(t) {
        this._$AH !== t && (this._$AR(), this._$AH = this.A(t));
    }
    $(t) {
        this._$AH !== N && m(this._$AH) ? this._$AA.nextSibling.data = t : this.M($.createTextNode(t)), this._$AH = t;
    }
    T(t) {
        var i;
        const { values: s , _$litType$: e  } = t, o = "number" == typeof e ? this._$AC(t) : (void 0 === e.el && (e.el = z.createElement(e.h, this.options)), e);
        if ((null === (i = this._$AH) || void 0 === i ? void 0 : i._$AD) === o) this._$AH.m(s);
        else {
            const t = new P(o, this), i = t.p(this.options);
            t.m(s), this.M(i), this._$AH = t;
        }
    }
    _$AC(t) {
        let i = O.get(t.strings);
        return void 0 === i && O.set(t.strings, i = new z(t)), i;
    }
    S(t) {
        S(this._$AH) || (this._$AH = [], this._$AR());
        const i = this._$AH;
        let s, e = 0;
        for (const o of t)e === i.length ? i.push(s = new H(this.A(w()), this.A(w()), this, this.options)) : s = i[e], s._$AI(o), e++;
        e < i.length && (this._$AR(s && s._$AB.nextSibling, e), i.length = e);
    }
    _$AR(t = this._$AA.nextSibling, i) {
        var s;
        for(null === (s = this._$AP) || void 0 === s || s.call(this, !1, !0, i); t && t !== this._$AB;){
            const i = t.nextSibling;
            t.remove(), t = i;
        }
    }
    setConnected(t) {
        var i;
        void 0 === this._$AM && (this._$Cg = t, null === (i = this._$AP) || void 0 === i || i.call(this, t));
    }
}
class L {
    constructor(t6, i5, s4, e3, o3){
        this.type = 1, this._$AH = N, this._$AN = void 0, this.element = t6, this.name = i5, this._$AM = e3, this.options = o3, s4.length > 2 || "" !== s4[0] || "" !== s4[1] ? (this._$AH = Array(s4.length - 1).fill(N), this.strings = s4) : this._$AH = N;
    }
    get tagName() {
        return this.element.tagName;
    }
    get _$AU() {
        return this._$AM._$AU;
    }
    _$AI(t, i = this, s, e) {
        const o = this.strings;
        let n = !1;
        if (void 0 === o) t = I(this, t, i, 0), n = !m(t) || t !== this._$AH && t !== M, n && (this._$AH = t);
        else {
            const e = t;
            let h, l;
            for(t = o[0], h = 0; h < o.length - 1; h++)l = I(this, e[s + h], i, h), l === M && (l = this._$AH[h]), n || (n = !m(l) || l !== this._$AH[h]), l === N ? t = N : t !== N && (t += (null != l ? l : "") + o[h + 1]), this._$AH[h] = l;
        }
        n && !e && this.k(t);
    }
    k(t) {
        t === N ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, null != t ? t : "");
    }
}
class B extends L {
    constructor(){
        super(...arguments), this.type = 3;
    }
    k(t) {
        this.element[this.name] = t === N ? void 0 : t;
    }
}
class D extends L {
    constructor(){
        super(...arguments), this.type = 4;
    }
    k(t) {
        t && t !== N ? this.element.setAttribute(this.name, "") : this.element.removeAttribute(this.name);
    }
}
class J extends L {
    constructor(t7, i6, s5, e4, o4){
        super(t7, i6, s5, e4, o4), this.type = 5;
    }
    _$AI(t, i = this) {
        var s;
        if ((t = null !== (s = I(this, t, i, 0)) && void 0 !== s ? s : N) === M) return;
        const e = this._$AH, o = t === N && e !== N || t.capture !== e.capture || t.once !== e.once || t.passive !== e.passive, n = t !== N && (e === N || o);
        o && this.element.removeEventListener(this.name, this, e), n && this.element.addEventListener(this.name, this, t), this._$AH = t;
    }
    handleEvent(t) {
        var i, s;
        "function" == typeof this._$AH ? this._$AH.call(null !== (s = null === (i = this.options) || void 0 === i ? void 0 : i.host) && void 0 !== s ? s : this.element, t) : this._$AH.handleEvent(t);
    }
}
class W {
    constructor(t8, i7, s6){
        this.element = t8, this.type = 6, this._$AN = void 0, this._$AM = i7, this.options = s6;
    }
    get _$AU() {
        return this._$AM._$AU;
    }
    _$AI(t) {
        I(this, t);
    }
}
var Z, q, K;
null === (c = globalThis.litHtmlPlatformSupport) || void 0 === c || c.call(globalThis, z, H), (null !== (v = globalThis.litHtmlVersions) && void 0 !== v ? v : globalThis.litHtmlVersions = []).push("2.0.0-rc.4");
class V extends d {
    constructor(){
        super(...arguments), this.renderOptions = {
            host: this
        }, this._$Dt = void 0;
    }
    createRenderRoot() {
        var t, i;
        const s = super.createRenderRoot();
        return null !== (t = (i = this.renderOptions).renderBefore) && void 0 !== t || (i.renderBefore = s.firstChild), s;
    }
    update(t) {
        const i = this.render();
        this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(t), this._$Dt = ((t, i, s)=>{
            var e, o;
            const n = null !== (e = null == s ? void 0 : s.renderBefore) && void 0 !== e ? e : i;
            let h = n._$litPart$;
            if (void 0 === h) {
                const t = null !== (o = null == s ? void 0 : s.renderBefore) && void 0 !== o ? o : null;
                n._$litPart$ = h = new H(i.insertBefore(w(), t), t, void 0, null != s ? s : {
                });
            }
            return h._$AI(t), h;
        })(i, this.renderRoot, this.renderOptions);
    }
    connectedCallback() {
        var t;
        super.connectedCallback(), null === (t = this._$Dt) || void 0 === t || t.setConnected(!0);
    }
    disconnectedCallback() {
        var t;
        super.disconnectedCallback(), null === (t = this._$Dt) || void 0 === t || t.setConnected(!1);
    }
    render() {
        return M;
    }
}
V.finalized = !0, V._$litElement$ = !0, null === (Z = globalThis.litElementHydrateSupport) || void 0 === Z || Z.call(globalThis, {
    LitElement: V
}), null === (q = globalThis.litElementPlatformSupport) || void 0 === q || q.call(globalThis, {
    LitElement: V
}), (null !== (K = globalThis.litElementVersions) && void 0 !== K ? K : globalThis.litElementVersions = []).push("3.0.0-rc.3");
class F extends V {
    static get styles() {
        return o`
      :host {
        display: block;
        border: solid 1px gray;
        padding: 16px;
        max-width: 800px;
      }
    `;
    }
    static get properties() {
        return {
            name: {
                type: String
            },
            count: {
                type: Number
            }
        };
    }
    constructor(){
        super(), this.name = "World", this.count = 0;
    }
    render() {
        return U`
      <h1>${this.sayHello(this.name)}!</h1>
      <button @click=${this._onClick} part="button">
        Click Count: ${this.count}
      </button>
      <slot></slot>
    `;
    }
    _onClick() {
        this.count++, this.dispatchEvent(new CustomEvent("count-changed"));
    }
    sayHello(t) {
        return `Hello, ${t}`;
    }
}
window.customElements.define("my-element", F);
export { F as MyElement };
