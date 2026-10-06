/* Walking Whale — optional behavior. Pages work without it; this adds motion and small interactions.
   Hooks are data attributes, so markup stays valid under the output validator (DR-016).

   .ww-reveal                         reveals once when it first enters the viewport (DR-014)
   [data-ww-open="dialog-id"]         opens a <dialog> (Drawer); [data-ww-close] inside closes it
   [data-ww-toggle]                   toggles aria-pressed; inside [data-ww-single] only one stays pressed
   .ww-layers[data-ww-progress="id"]  fills layers with the reading progress of element #id
   [data-ww-toast="toast-id"]         shows a .ww-toast for 4 seconds
*/
(function () {
  var doc = document, root = doc.documentElement;
  root.classList.add("ww-js");
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function all(sel, el) { return Array.prototype.slice.call((el || doc).querySelectorAll(sel)); }

  // Reveal once
  var reveals = all(".ww-reveal");
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
    if (ev.target.tagName === "DIALOG") ev.target.close(); // click on the backdrop
  });
  all("dialog").forEach(function (d) {
    d.addEventListener("close", function () { if (d._wwOpener) { d._wwOpener.setAttribute("aria-expanded", "false"); d._wwOpener.focus(); } });
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
