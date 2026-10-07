/* Walking Whale — optional behavior. Pages work without it; this adds motion and small interactions.
   Hooks are data attributes, so markup stays valid under the output validator (DR-016).

   .ww-rise .ww-reveal .ww-stagger     entrance plays once when the element first enters the viewport
   [data-ww-open="dialog-id"]         opens a <dialog> (Drawer); [data-ww-close] inside closes it;
                                      an in-page link inside closes it and focuses the target section
   [data-ww-toggle]                   toggles aria-pressed; inside [data-ww-single] only one stays pressed
   .ww-layers[data-ww-progress="id"]  fills layers with the reading progress of element #id
   [data-ww-toast="toast-id"]         shows a .ww-toast for 4 seconds
*/
(function () {
  var doc = document, root = doc.documentElement;
  root.classList.add("ww-js");
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function all(sel, el) { return Array.prototype.slice.call((el || doc).querySelectorAll(sel)); }

  // Entrances play once: rise, reveal, stagger
  var reveals = all(".ww-reveal, .ww-rise, .ww-stagger");
  if (reduce || !("IntersectionObserver" in window)) {
    reveals.forEach(function (el) { el.classList.add("is-revealed"); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("is-revealed"); io.unobserve(e.target); }
      });
    }, { threshold: 0.35 });
    reveals.forEach(function (el) { io.observe(el); });
  }

  // Drawer
  doc.addEventListener("click", function (ev) {
    var open = ev.target.closest("[data-ww-open]");
    if (open) {
      var d = doc.getElementById(open.getAttribute("data-ww-open"));
      if (d && d.showModal) { d.showModal(); open.setAttribute("aria-expanded", "true"); d._wwOpener = open; }
      return;
    }
    var close = ev.target.closest("[data-ww-close]");
    var dlg = ev.target.closest("dialog");
    if (close && dlg) { dlg.close(); return; }
    var anchor = ev.target.closest('a[href^="#"]');
    if (anchor && dlg && anchor.getAttribute("href").length > 1) {
      // In-page link inside the drawer: close it and hand focus to the section, not back to the menu button.
      var target = doc.getElementById(decodeURIComponent(anchor.getAttribute("href").slice(1)));
      if (target) { dlg._wwFocusTarget = target; dlg.close(); }
      return;
    }
    if (ev.target.tagName === "DIALOG") ev.target.close(); // click on the backdrop
  });
  all("dialog").forEach(function (d) {
    d.addEventListener("close", function () {
      if (d._wwOpener) d._wwOpener.setAttribute("aria-expanded", "false");
      var t = d._wwFocusTarget; d._wwFocusTarget = null;
      if (t) {
        if (!t.hasAttribute("tabindex")) t.setAttribute("tabindex", "-1");
        t.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
        t.focus({ preventScroll: true });
      } else if (d._wwOpener) d._wwOpener.focus();
    });
  });

  // Toggles (filter chips)
  doc.addEventListener("click", function (ev) {
    var t = ev.target.closest("[data-ww-toggle]");
    if (!t) return;
    var on = t.getAttribute("aria-pressed") !== "true";
    var group = t.closest("[data-ww-single]");
    if (group) all("[data-ww-toggle]", group).forEach(function (b) { b.setAttribute("aria-pressed", "false"); });
    t.setAttribute("aria-pressed", String(group ? true : on));
  });

  // Reading progress on growth layers
  var bars = all(".ww-layers[data-ww-progress]");
  function progress() {
    bars.forEach(function (bar) {
      var target = doc.getElementById(bar.getAttribute("data-ww-progress"));
      if (!target) return;
      var r = target.getBoundingClientRect(), vh = window.innerHeight;
      var total = r.height - vh, p = total > 0 ? Math.min(1, Math.max(0, -r.top / total)) : (r.top < vh ? 1 : 0);
      var layers = bar.children, k = Math.round(p * layers.length);
      for (var i = 0; i < layers.length; i++) layers[i].className = i < k ? "is-done" : "";
      var label = bar.getAttribute("data-ww-progress-label");
      if (label && doc.getElementById(label)) doc.getElementById(label).textContent = Math.round(p * 100) + "%";
    });
  }
  if (bars.length) { window.addEventListener("scroll", progress, { passive: true }); window.addEventListener("resize", progress); progress(); }

  // Toast
  doc.addEventListener("click", function (ev) {
    var t = ev.target.closest("[data-ww-toast]");
    if (!t) return;
    var toast = doc.getElementById(t.getAttribute("data-ww-toast"));
    if (!toast) return;
    toast.hidden = false;
    clearTimeout(toast._wwTimer);
    toast._wwTimer = setTimeout(function () { toast.hidden = true; }, 4000);
  });
})();

/* Walking Whale deck runtime (DR-019). Pairs with dist/ww-deck.css. No dependencies, no network.

   Markup: <main class="ww-deck" data-ww-use="talk|send"> holding <section class="ww-slide"> elements.
     data-ww-section="名稱"   on the first slide of a section
     data-ww-chrome="off"     no wordmark and page index on this slide (covers, full-bleed images)
     data-ww-step[="n"]       appears on the next key press; same n appears together
     data-ww-views="steps"    on a views block: each tab after the first is a build step
     data-ww-var / data-ww-calc   dials: a range input drives numbers and SVG sizes
     <aside class="ww-slide__notes">  notes; read mode shows them beside each slide

   Keys
     → ↓ Space PageDown     next build, then next slide      ← ↑ PageUp   back
     Home End               first, last slide                O            overview
     R                      read mode: slides with notes     F            full screen
     B .                    blank screen                     ?            the keys
     Esc                    back to the stage

   #<slide id> in the address opens that slide. */
(function () {
  "use strict";
  var deck = document.querySelector(".ww-deck");
  if (!deck || deck.hasAttribute("data-ww-ready")) return;
  deck.setAttribute("data-ww-ready", "");

  var W = 1500, H = 1000;
  var lang = (document.documentElement.lang || "en").toLowerCase();
  var ZH = lang.indexOf("zh") === 0;
  var L = ZH ? {
    prev: "上一步", next: "下一步", overview: "總覽", read: "閱讀模式", full: "全螢幕", help: "鍵盤操作",
    page: function (n, t, title) { return "第 " + n + " 頁，共 " + t + " 頁：" + title; },
    open: function (n, title) { return "開啟第 " + n + " 頁：" + title; },
    keys: [["→ 空白鍵", "下一步，做完換下一頁"], ["←", "上一步"], ["Home End", "第一頁、最後一頁"], ["O", "總覽"], ["R", "閱讀模式：每一頁加上講稿"], ["F", "全螢幕"], ["B", "黑畫面"], ["Esc", "回到簡報"], ["?", "這張說明"]]
  } : {
    prev: "Back", next: "Next", overview: "Overview", read: "Read mode", full: "Full screen", help: "Keys",
    page: function (n, t, title) { return "Slide " + n + " of " + t + ": " + title; },
    open: function (n, title) { return "Open slide " + n + ": " + title; },
    keys: [["→ Space", "Next build, then next slide"], ["←", "Back"], ["Home End", "First and last slide"], ["O", "Overview"], ["R", "Read mode: every slide with its notes"], ["F", "Full screen"], ["B", "Blank screen"], ["Esc", "Back to the stage"], ["?", "These keys"]]
  };

  function mk(tag, cls, html) { var e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function pad(n) { return (n < 10 ? "0" : "") + n; }
  function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }
  function titleOf(s) {
    var t = s.querySelector(".ww-slide__title, .ww-slide__display");
    return t ? t.textContent.replace(/\s+/g, " ").trim() : (s.getAttribute("aria-label") || s.id);
  }
  function icon(paths) { return '<svg class="ww-icon" viewBox="0 0 24 24" aria-hidden="true">' + paths + "</svg>"; }
  var I = {
    prev: icon('<path d="m15 18-6-6 6-6"/>'),
    next: icon('<path d="m9 18 6-6-6-6"/>'),
    overview: icon('<rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/>'),
    read: icon('<path d="M12 7v14"/><path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z"/>'),
    full: icon('<path d="M8 3H5a2 2 0 0 0-2 2v3"/><path d="M21 8V5a2 2 0 0 0-2-2h-3"/><path d="M3 16v3a2 2 0 0 0 2 2h3"/><path d="M16 21h3a2 2 0 0 0 2-2v-3"/>'),
    help: icon('<circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/>')
  };

  // ------------------------------------------------------------ structure
  var slides = Array.prototype.filter.call(deck.children, function (n) { return n.classList && n.classList.contains("ww-slide"); });
  if (!slides.length) return;
  var track = mk("div", "ww-deck__track");
  var groups = [], info = [], g = null;
  slides.forEach(function (s, i) {
    if (!s.id) s.id = "s" + pad(i + 1);
    if (!g || s.hasAttribute("data-ww-section")) {
      var name = s.getAttribute("data-ww-section") || (g ? g.name : "");
      g = { name: name, no: groups.length + 1, el: mk("div", "ww-deck__group"), list: mk("div", "ww-deck__sheets") };
      g.el.appendChild(mk("p", "ww-deck__group-label", '<span class="ww-deck__group-no">No. ' + pad(g.no) + "</span>" + (name ? "<span>" + esc(name) + "</span>" : "")));
      g.el.appendChild(g.list);
      groups.push(g);
      track.appendChild(g.el);
    }
    var sheet = mk("div", "ww-deck__sheet"), frame = mk("div", "ww-deck__frame");
    frame.appendChild(s);
    sheet.appendChild(frame);
    var notes = s.querySelector(".ww-slide__notes");
    sheet.appendChild(mk("div", "ww-deck__notes", '<span class="ww-deck__notes-no">' + pad(i + 1) + " · " + esc(titleOf(s)) + "</span>" + (notes ? notes.innerHTML : "")));
    g.list.appendChild(sheet);
    info.push({ slide: s, sheet: sheet, frame: frame, group: g, notes: notes, steps: collect(s) });
  });
  deck.appendChild(track);

  // Steps: [data-ww-step] in number order, then page order. Views with data-ww-views="steps" add their tabs.
  function collect(s) {
    var items = [], auto = 0;
    Array.prototype.forEach.call(s.querySelectorAll("[data-ww-step], [data-ww-views='steps'] [role='tab']"), function (el) {
      var isTab = !el.hasAttribute("data-ww-step");
      if (isTab && el.closest("[data-ww-views]").querySelector("[role='tab']") === el) return; // the first tab is the starting view
      var v = isTab ? "" : el.getAttribute("data-ww-step");
      var n = v === "" || isNaN(+v) ? ++auto : +v;
      if (n > auto) auto = n;
      items.push({ el: el, n: n, tab: isTab });
    });
    var order = [];
    items.forEach(function (x) { if (order.indexOf(x.n) < 0) order.push(x.n); });
    order.sort(function (a, b) { return a - b; });
    return { items: items, order: order };
  }

  // Chrome: wordmark and page index on every slide, so printed pages carry their numbers too.
  var mark = deck.querySelector(".ww-deck__defs symbol[id]");
  var by = info.length <= 24 ? "slide" : groups.length <= 24 ? "section" : "";
  info.forEach(function (x, i) {
    if (x.slide.getAttribute("data-ww-chrome") === "off") return;
    var bands = "";
    if (by) {
      var n = by === "slide" ? info.length : groups.length, at = by === "slide" ? i : x.group.no - 1;
      for (var j = 0; j < n; j++) bands += "<i" + (j < at ? ' class="is-done"' : j === at ? ' class="is-current"' : "") + "></i>";
      bands = '<span class="ww-layers ww-layers--sm" aria-hidden="true">' + bands + "</span>";
    }
    var brand = mark ? '<svg class="ww-slide__brand" viewBox="' + esc(mark.getAttribute("viewBox") || "0 0 100 20") + '" aria-hidden="true"><use href="#' + esc(mark.id) + '"></use></svg>' : "<span></span>";
    var label = x.group.name ? '<span class="ww-index__label">' + esc(x.group.name) + "</span>" : "";
    var c = mk("footer", "ww-slide__chrome", brand + '<p class="ww-index">' + bands + '<span class="ww-index__text"><span class="ww-index__count">' + pad(i + 1) + " / " + pad(info.length) + "</span>" + label + "</span></p>");
    c.setAttribute("aria-hidden", "true");
    x.slide.appendChild(c);
  });

  // <svg><use href="#ww-deck-wordmark"></use></svg> without a viewBox borrows the symbol's.
  Array.prototype.forEach.call(deck.querySelectorAll("svg > use"), function (u) {
    var svg = u.parentNode, id = (u.getAttribute("href") || "").replace(/^#/, ""), sym = id && document.getElementById(id);
    if (!svg.hasAttribute("viewBox") && sym && sym.getAttribute("viewBox")) svg.setAttribute("viewBox", sym.getAttribute("viewBox"));
  });

  // Controls and help.
  function btn(name, label) { return '<button type="button" class="ww-deck__btn" data-ww-do="' + name + '" aria-label="' + esc(label) + '">' + I[name] + "</button>"; }
  var ui = mk("nav", "ww-deck__ui",
    btn("prev", L.prev) + '<span class="ww-deck__ui-count"></span>' + btn("next", L.next) +
    btn("overview", L.overview) + btn("read", L.read) + btn("full", L.full) + btn("help", L.help));
  ui.setAttribute("aria-label", ZH ? "簡報操作" : "Deck controls");
  ui.querySelector("[data-ww-do='help']").setAttribute("aria-expanded", "false");
  var status = mk("p", "ww-deck__status");
  status.setAttribute("aria-live", "polite");
  var help = mk("div", "ww-deck__help", '<div class="ww-deck__help-card"><p class="ww-deck__help-title">' + esc(L.help) + '</p><dl class="ww-deck__keys">' +
    L.keys.map(function (k) { return "<dt>" + esc(k[0]) + "</dt><dd>" + esc(k[1]) + "</dd>"; }).join("") + "</dl></div>");
  help.setAttribute("role", "dialog");
  help.setAttribute("aria-modal", "true");
  help.setAttribute("aria-label", L.help);
  help.setAttribute("tabindex", "-1");
  help.hidden = true;
  deck.appendChild(ui);
  deck.appendChild(status);
  deck.appendChild(help);

  // ------------------------------------------------------------ state
  var cur = -1, step = 0, mode = "";
  var root = document.documentElement;

  function set(name, v) { deck.style.setProperty(name, String(v)); }

  function fit() {
    var vw = root.clientWidth, vh = window.innerHeight, dw = deck.clientWidth || vw;
    var narrow = vw < 860;
    deck.classList.toggle("is-narrow", narrow);
    if (mode === "stage") set("--deck-k", Math.min(vw / W, vh / H));
    if (mode === "overview") {
      var avail = narrow ? dw - 32 : dw - 96 - 220 - 22;
      var cols = narrow ? 2 : clamp(Math.floor(avail / 260), 3, 6);
      set("--deck-k-thumb", Math.max(0.08, (avail - (cols - 1) * 16) / cols / W));
    }
    if (mode === "read") {
      var w = Math.min(deck.clientWidth - (narrow ? 32 : 56), 1440);
      set("--deck-k-read", narrow ? w / W : Math.min(0.62, (w * 0.6) / W));
    }
  }

  function paint(i, n) {
    var st = info[i].steps;
    var lim = n > 0 ? st.order[n - 1] : -Infinity;
    var tabs = new Map();
    st.items.forEach(function (x) {
      if (x.tab) {
        var v = x.el.closest("[data-ww-views]");
        if (!tabs.has(v)) tabs.set(v, null);
        if (x.n <= lim) tabs.set(v, x.el);
        return;
      }
      x.el.classList.toggle("is-shown", x.n <= lim);
      x.el.classList.toggle("is-current", x.n === lim);
      x.el.classList.toggle("is-past", x.n < lim);
    });
    tabs.forEach(function (tab, v) { selectView(v, tab || v.querySelector("[role='tab']"), false); });
  }

  function go(i, n, opt) {
    opt = opt || {};
    i = clamp(i, 0, info.length - 1);
    var total = info[i].steps.order.length;
    if (n === "end") n = total;
    n = clamp(n || 0, 0, total);
    if (i !== cur) {
      if (cur >= 0) info[cur].sheet.removeAttribute("data-active");
      info[i].sheet.setAttribute("data-active", "");
      cur = i;
      if (history.replaceState) history.replaceState(null, "", "#" + encodeURIComponent(info[i].slide.id));
      checkFit(info[i].slide);
      status.textContent = L.page(i + 1, info.length, titleOf(info[i].slide));
    }
    step = n;
    paint(i, n);
    counter();
  }
  function next() {
    if (step < info[cur].steps.order.length) go(cur, step + 1);
    else if (cur < info.length - 1) go(cur + 1, 0);
  }
  function back() {
    if (step > 0) go(cur, step - 1);
    else if (cur > 0) go(cur - 1, "end");
  }
  function counter() {
    ui.querySelector(".ww-deck__ui-count").textContent = pad(cur + 1) + " / " + pad(info.length);
    Array.prototype.forEach.call(ui.querySelectorAll("[data-ww-do='overview'],[data-ww-do='read']"), function (b) {
      b.setAttribute("aria-pressed", String(b.getAttribute("data-ww-do") === mode));
    });
  }

  function setMode(m, toggle) {
    if (toggle && m === mode) m = "stage";
    mode = m;
    deck.setAttribute("data-ww-mode", m);
    deck.classList.toggle("is-live", m === "stage");
    info.forEach(function (x, i) {
      if (m === "overview") {
        x.sheet.tabIndex = 0;
        x.sheet.setAttribute("role", "button");
        x.sheet.setAttribute("aria-label", L.open(i + 1, titleOf(x.slide)));
        x.slide.setAttribute("inert", "");
      } else {
        x.sheet.removeAttribute("tabindex");
        x.sheet.removeAttribute("role");
        x.sheet.removeAttribute("aria-label");
        x.slide.removeAttribute("inert");
      }
    });
    fit();
    if (cur >= 0) paint(cur, step);
    if (m === "overview" && cur >= 0) { info[cur].sheet.focus({ preventScroll: true }); info[cur].sheet.scrollIntoView({ block: "center" }); }
    if (m === "read") {
      if (cur >= 0) info[cur].sheet.scrollIntoView({ block: "start" });
      requestAnimationFrame(function () { info.forEach(function (x) { checkFit(x.slide); }); });
    } else window.scrollTo(0, 0);
    counter();
  }

  // ------------------------------------------------------------ fit check: slides never scroll
  function checkFit(s) {
    if (!s.offsetHeight) return;
    // Head and foot take the height they need; the body gets the rest, so the body and the slide
    // are where overflow shows. A few pixels of glyph ink above the line box do not count.
    var over = function (e) { return e.scrollHeight > e.clientHeight + 4 || e.scrollWidth > e.clientWidth + 4; };
    var bad = over(s) || Array.prototype.some.call(s.children, function (c) {
      return c.classList && c.classList.contains("ww-slide__body") && over(c);
    });
    s.classList.toggle("is-overflowing", bad);
    if (bad && window.console) console.warn("[ww-deck] #" + s.id + " does not fit the 1500 × 1000 stage. Cut words or split the slide.");
  }

  // ------------------------------------------------------------ views (tabs inside a slide)
  function selectView(v, tab, focus) {
    if (!v || !tab) return;
    Array.prototype.forEach.call(v.querySelectorAll("[role='tab']"), function (t) {
      var on = t === tab;
      t.setAttribute("aria-selected", String(on));
      t.tabIndex = on ? 0 : -1;
      var p = document.getElementById(t.getAttribute("aria-controls"));
      if (p) p.hidden = !on;
    });
    if (focus) tab.focus();
  }
  Array.prototype.forEach.call(deck.querySelectorAll("[data-ww-views]"), function (v) {
    var tabs = Array.prototype.slice.call(v.querySelectorAll("[role='tab']"));
    var stepped = v.getAttribute("data-ww-views") === "steps";
    function syncStep(t) {
      var x = info[cur], idx = x && x.steps.items.filter(function (it) { return it.tab && it.el.closest("[data-ww-views]") === v; });
      if (!stepped || !x || !idx.length || !x.slide.contains(v)) return false;
      var hit = idx.filter(function (it) { return it.el === t; })[0];
      // The first tab is the state just before this view's first step.
      go(cur, hit ? x.steps.order.indexOf(hit.n) + 1 : x.steps.order.indexOf(idx[0].n));
      return true;
    }
    tabs.forEach(function (t, i) {
      t.addEventListener("click", function (e) {
        if (!syncStep(t)) selectView(v, t, false);
        if (e.detail) t.blur(); // after a mouse click, the arrow keys go back to the slides
      });
      t.addEventListener("keydown", function (e) {
        if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
        e.preventDefault();
        e.stopPropagation();
        var to = tabs[(i + (e.key === "ArrowRight" ? 1 : tabs.length - 1)) % tabs.length];
        if (!syncStep(to)) selectView(v, to, false);
        to.focus();
      });
    });
    selectView(v, tabs.filter(function (t) { return t.getAttribute("aria-selected") === "true"; })[0] || tabs[0], false);
  });

  // ------------------------------------------------------------ dials: sliders that drive numbers
  // <input type="range" data-ww-var="hours"> and <output data-ww-calc="hours * 52 * 0.6" data-ww-round="0">.
  // data-ww-calc-attr="width" writes an SVG attribute instead of text. Arithmetic only: + - * / ( ),
  // min max round floor ceil abs. Never eval.
  var FN = { min: Math.min, max: Math.max, round: Math.round, floor: Math.floor, ceil: Math.ceil, abs: Math.abs };
  function calc(src, vars) {
    var tk = [], re = /\s*(\d+(?:\.\d+)?|\.\d+|[A-Za-z_]\w*|[-+*/(),])/y, m, at = 0, text = String(src);
    while (at < text.length && (m = re.exec(text))) { tk.push(m[1]); at = re.lastIndex; }
    if (text.slice(at).trim()) throw new Error("unexpected \"" + text.slice(at).trim().charAt(0) + "\"");
    var p = 0;
    var own = function (o, key) { return Object.prototype.hasOwnProperty.call(o, key); };
    function expr() { var v = term(); while (tk[p] === "+" || tk[p] === "-") { var o = tk[p++], r = term(); v = o === "+" ? v + r : v - r; } return v; }
    function term() { var v = unary(); while (tk[p] === "*" || tk[p] === "/") { var o = tk[p++], r = unary(); v = o === "*" ? v * r : v / r; } return v; }
    function unary() { if (tk[p] === "-") { p++; return -unary(); } return atom(); }
    function atom() {
      var t = tk[p++];
      if (t === "(") { var v = expr(); if (tk[p++] !== ")") throw new Error("bracket"); return v; }
      if (/^[\d.]/.test(t || "")) return +t;
      if (own(FN, t) && tk[p] === "(") {
        p++;
        var a = [expr()];
        while (tk[p] === ",") { p++; a.push(expr()); }
        if (tk[p++] !== ")") throw new Error("bracket");
        return FN[t].apply(null, a);
      }
      if (own(vars, t)) return vars[t];
      throw new Error("unknown " + t);
    }
    var v = expr();
    if (p !== tk.length) throw new Error("trailing");
    return v;
  }
  info.forEach(function (x) {
    var inputs = Array.prototype.slice.call(x.slide.querySelectorAll("input[data-ww-var]"));
    if (!inputs.length) return;
    var outs = Array.prototype.slice.call(x.slide.querySelectorAll("[data-ww-calc]"));
    var run = function () {
      var vars = {};
      inputs.forEach(function (i) { vars[i.getAttribute("data-ww-var")] = +i.value; });
      outs.forEach(function (o) {
        var v;
        try { v = calc(o.getAttribute("data-ww-calc"), vars); } catch (e) { if (window.console) console.warn("[ww-deck] data-ww-calc: " + e.message); return; }
        if (!isFinite(v)) return;
        var attr = o.getAttribute("data-ww-calc-attr");
        if (attr) { o.setAttribute(attr, String(Math.max(0, Math.round(v * 100) / 100))); return; }
        var d = clamp(Math.round(+(o.getAttribute("data-ww-round") || 0)) || 0, 0, 20);
        try { o.textContent = v.toLocaleString(lang, { minimumFractionDigits: d, maximumFractionDigits: d }); }
        catch (e) { o.textContent = v.toFixed(d); }
      });
    };
    inputs.forEach(function (i) { i.addEventListener("input", run); });
    run();
  });

  // ------------------------------------------------------------ input
  var opener = null;
  function toggleHelp(show) {
    if (show === !help.hidden) return;
    help.hidden = !show;
    var hb = ui.querySelector("[data-ww-do='help']");
    hb.setAttribute("aria-expanded", String(show));
    if (show) { opener = document.activeElement; help.focus(); }
    else if (opener && opener.focus) { opener.focus(); opener = null; }
  }
  function full() {
    if (document.fullscreenElement) document.exitFullscreen();
    else if (root.requestFullscreen) root.requestFullscreen().catch(function () {});
  }
  function act(name) {
    if (name === "prev") back();
    else if (name === "next") next();
    else if (name === "full") full();
    else if (name === "help") toggleHelp(help.hidden);
    else setMode(name, true);
  }
  ui.addEventListener("click", function (e) {
    var b = e.target.closest("[data-ww-do]");
    if (b) act(b.getAttribute("data-ww-do"));
  });
  help.addEventListener("click", function () { toggleHelp(false); });

  track.addEventListener("click", function (e) {
    if (mode !== "overview") return;
    var sh = e.target.closest(".ww-deck__sheet");
    if (!sh) return;
    var i = info.findIndex(function (x) { return x.sheet === sh; });
    setMode("stage");
    go(i, 0);
  });

  document.addEventListener("keydown", function (e) {
    if (e.defaultPrevented || e.altKey || e.ctrlKey || e.metaKey) return;
    var key = e.key, t = e.target;
    if (!help.hidden) {
      if (key === "Escape" || key === "?") { e.preventDefault(); toggleHelp(false); }
      else if (key === "Tab") { e.preventDefault(); help.focus(); }
      return;
    }
    var control = t.closest && t.closest("input, textarea, select, [contenteditable], [role='tab'], [role='slider']");
    var pressable = t.closest && t.closest("button, a[href], summary");
    if (control && key !== "Escape") return;
    if (pressable && (key === " " || key === "Enter")) return;
    if (mode === "overview") {
      var focused = t.closest && t.closest(".ww-deck__sheet");
      var from = focused ? info.findIndex(function (x) { return x.sheet === focused; }) : cur;
      if (from < 0) from = cur;
      var i = from;
      if (key === "ArrowRight") i++;
      else if (key === "ArrowLeft") i--;
      else if (key === "ArrowDown" || key === "ArrowUp") i = vertical(from, key === "ArrowDown" ? 1 : -1);
      else if (key === "Enter" || key === " ") { e.preventDefault(); setMode("stage"); go(from, 0); return; }
      i = clamp(i, 0, info.length - 1);
      if (/^Arrow/.test(key)) { e.preventDefault(); go(i, 0, { quiet: true }); info[i].sheet.focus(); return; }
    }
    if (mode === "read" && /^(Arrow|PageUp|PageDown| |Home|End)/.test(key)) return; // the page scrolls
    var lower = key.length === 1 ? key.toLowerCase() : key;
    var map = {
      ArrowRight: next, ArrowDown: next, PageDown: next, " ": next, Enter: next,
      ArrowLeft: back, ArrowUp: back, PageUp: back, Backspace: back,
      Home: function () { go(0, 0); }, End: function () { go(info.length - 1, "end"); },
      o: function () { setMode("overview", true); }, r: function () { setMode("read", true); },
      f: full, b: function () { deck.classList.toggle("is-blank"); }, ".": function () { deck.classList.toggle("is-blank"); },
      "?": function () { toggleHelp(true); },
      Escape: function () { if (mode !== "stage") setMode("stage"); else deck.classList.remove("is-blank"); }
    };
    if (map[lower]) {
      e.preventDefault();
      if (control) { t.blur(); return; }
      if (mode === "read" && (lower === "Escape" || lower === "r")) { setMode("stage"); return; }
      map[lower]();
    }
  });

  // The thumbnail in the next row up or down that sits closest to the current one.
  function vertical(from, dir) {
    var r = info[from].sheet.getBoundingClientRect(), best = from, score = Infinity;
    info.forEach(function (x, j) {
      var q = x.sheet.getBoundingClientRect();
      var dy = dir > 0 ? q.top - r.bottom : r.top - q.bottom;
      if (dy < -1) return;
      var s2 = dy * 4 + Math.abs(q.left + q.width / 2 - (r.left + r.width / 2));
      if (s2 < score) { score = s2; best = j; }
    });
    return best;
  }

  // Swipe on touch screens.
  var sx = null, sy = null;
  deck.addEventListener("touchstart", function (e) {
    var onControl = e.target.closest && e.target.closest("input, select, textarea, button, a[href], [role='tab'], [role='slider']");
    if (e.touches.length === 1 && !onControl) { sx = e.touches[0].clientX; sy = e.touches[0].clientY; } else sx = null;
  }, { passive: true });
  deck.addEventListener("touchend", function (e) {
    if (sx === null || mode !== "stage") return;
    var dx = e.changedTouches[0].clientX - sx, dy = e.changedTouches[0].clientY - sy;
    sx = null;
    if (Math.abs(dx) > 48 && Math.abs(dx) > Math.abs(dy) * 1.5) { if (dx < 0) next(); else back(); }
  }, { passive: true });

  // The control bar rests out of sight until the pointer moves.
  var idle = 0;
  function wake() { deck.classList.remove("is-idle"); clearTimeout(idle); idle = setTimeout(function () { if (mode === "stage" || mode === "read") deck.classList.add("is-idle"); }, 2600); }
  ["mousemove", "touchstart", "focusin"].forEach(function (ev) { document.addEventListener(ev, wake, { passive: true }); });

  // Read mode follows the slide in the middle of the window.
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (es) {
      if (mode !== "read") return;
      es.forEach(function (en) {
        if (!en.isIntersecting) return;
        var i = info.findIndex(function (x) { return x.sheet === en.target; });
        if (i >= 0 && i !== cur) go(i, "end", { quiet: true });
      });
    }, { rootMargin: "-45% 0px -45% 0px" });
    info.forEach(function (x) { io.observe(x.sheet); });
  }

  window.addEventListener("beforeprint", function () {
    Array.prototype.forEach.call(deck.querySelectorAll("[data-ww-views]"), function (v) { selectView(v, v.querySelector("[role='tab']"), false); });
  });
  window.addEventListener("afterprint", function () { if (cur >= 0) paint(cur, step); });
  window.addEventListener("resize", fit);
  window.addEventListener("hashchange", function () { var i = indexOf(location.hash); if (i >= 0 && i !== cur) go(i, 0); });
  function indexOf(hash) {
    var id = (hash || "").replace(/^#\/?/, "");
    try { id = decodeURIComponent(id); } catch (e) { return -1; }
    if (!id) return -1;
    var i = info.findIndex(function (x) { return x.slide.id === id; });
    if (i < 0 && /^\d+$/.test(id)) i = clamp(+id - 1, 0, info.length - 1);
    return i;
  }

  // ------------------------------------------------------------ start
  var portraitPhone = window.matchMedia && window.matchMedia("(max-width: 700px) and (orientation: portrait)").matches;
  setMode(portraitPhone ? "read" : "stage");
  go(Math.max(0, indexOf(location.hash)), 0, { quiet: true });
  wake();
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { fit(); checkFit(info[cur].slide); if (mode === "read") info.forEach(function (x) { checkFit(x.slide); }); });

  window.wwDeck = { go: go, next: next, back: back, mode: setMode, check: function () {
    var was = mode, y = window.scrollY;
    if (was !== "read") setMode("read");
    var bad = info.filter(function (x) { checkFit(x.slide); return x.slide.classList.contains("is-overflowing"); }).map(function (x) { return x.slide.id; });
    if (was !== "read") { setMode(was); window.scrollTo(0, y); }
    return bad;
  } };
})();
