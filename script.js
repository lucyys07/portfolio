// Lucy Hwang — portfolio interactions (no dependencies)

const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const calm = matchMedia("(prefers-reduced-motion: reduce)").matches;

$("#year").textContent = new Date().getFullYear();

// Toast
const toastEl = $("#toast");
let toastTimer;
function toast(msg) {
  toastEl.textContent = msg;
  toastEl.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toastEl.classList.remove("show"), 1800);
}

// Dark mode (remembers choice)
const root = document.documentElement;
try { const t = localStorage.getItem("theme"); if (t) root.dataset.theme = t; } catch {}
$("#theme").addEventListener("click", () => {
  root.dataset.theme = root.dataset.theme === "dark" ? "light" : "dark";
  try { localStorage.setItem("theme", root.dataset.theme); } catch {}
});

// Count-up numbers when they scroll into view
const counter = new IntersectionObserver((entries) => entries.forEach((e) => {
  if (!e.isIntersecting) return;
  counter.unobserve(e.target);
  const el = e.target, end = +el.dataset.count;
  if (calm) return;
  const t0 = performance.now();
  const step = (t) => {
    const k = Math.min(1, (t - t0) / 1100);
    el.textContent = Math.round(end * (1 - Math.pow(1 - k, 3)));
    if (k < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}), { threshold: 0.6 });
$$("[data-count]").forEach((el) => counter.observe(el));

// Experience: expand / collapse
$$(".timeline .item").forEach((btn) =>
  btn.addEventListener("click", () => {
    const open = btn.getAttribute("aria-expanded") === "true";
    btn.setAttribute("aria-expanded", String(!open));
    btn.parentElement.classList.toggle("open", !open);
  })
);

// Filter counts
$$(".filter").forEach((f) => {
  const cat = f.dataset.filter;
  f.querySelector("em").textContent = $$("#timeline > li").filter((li) => cat === "all" || li.dataset.cat === cat).length;
});

// Service: bars grow + total counts up when in view
new IntersectionObserver(([e], obs) => {
  if (!e.isIntersecting) return;
  obs.disconnect();
  const items = $$("#serviceList > li");
  const max = Math.max(...items.map((li) => +li.dataset.hours));
  items.forEach((li, i) => {
    const bar = li.querySelector(".bar i");
    bar.style.transitionDelay = calm ? "" : `${i * 80}ms`;
    bar.style.width = `${(+li.dataset.hours / max) * 100}%`;
  });
}, { threshold: 0.2 }).observe($("#serviceList"));

// Experience: filters + "show all" (first 8 shown by default)
const LIMIT = 8;
const rows = $$("#timeline > li");
const moreBtn = $("#moreBtn");
let filter = "all", expanded = false;
function applyFilter() {
  const matches = rows.filter((li) => filter === "all" || li.dataset.cat === filter);
  rows.forEach((li) => li.classList.add("is-hidden"));
  matches.forEach((li, i) => li.classList.toggle("is-hidden", !expanded && i >= LIMIT));
  moreBtn.hidden = matches.length <= LIMIT;
  moreBtn.textContent = expanded ? "Show fewer" : `Show all ${matches.length}`;
}
$$(".filter").forEach((f) =>
  f.addEventListener("click", () => {
    $$(".filter").forEach((b) => {
      b.classList.toggle("is-active", b === f);
      b.setAttribute("aria-pressed", String(b === f));
    });
    filter = f.dataset.filter;
    expanded = false;
    applyFilter();
  })
);
moreBtn.addEventListener("click", () => {
  expanded = !expanded;
  applyFilter();
  if (!expanded) $("#experience").scrollIntoView({ behavior: calm ? "auto" : "smooth" });
});
applyFilter();

// Nav: border on scroll + active section underline
const nav = $("#nav");
const links = $$(".nav__links a");
const ink = $("#navInk");
function onScroll() {
  nav.classList.toggle("is-scrolled", scrollY > 8);
  let active = null;
  for (const a of links) {
    const sec = $(a.getAttribute("href"));
    if (sec && sec.getBoundingClientRect().top < innerHeight * 0.35) active = a;
  }
  if (innerHeight + scrollY >= document.documentElement.scrollHeight - 4) active = links[links.length - 1];
  links.forEach((a) => a.classList.toggle("is-active", a === active));
  if (active) {
    ink.style.opacity = 1;
    ink.style.left = active.offsetLeft + "px";
    ink.style.width = active.offsetWidth + "px";
  } else ink.style.opacity = 0;
}
addEventListener("scroll", onScroll, { passive: true });
addEventListener("resize", onScroll);
onScroll();

// Copy email
$("#copyEmail").addEventListener("click", async (e) => {
  const email = e.currentTarget.dataset.email;
  try { await navigator.clipboard.writeText(email); toast("Email copied"); }
  catch { location.href = "mailto:" + email; }
});

// Placeholder links
$$("[data-todo]").forEach((a) =>
  a.addEventListener("click", (e) => {
    if (a.getAttribute("href") === "#") { e.preventDefault(); toast("Coming soon"); }
  })
);

// Reveal on scroll
if (!calm) {
  const io = new IntersectionObserver((entries) => entries.forEach((e) => {
    if (!e.isIntersecting) return;
    const el = e.target;
    el.classList.add("in");
    io.unobserve(el);
    setTimeout(() => { el.classList.remove("reveal", "in"); el.style.transitionDelay = ""; }, 1100); // hand hover transitions back
  }), { threshold: 0.12 });
  $$(".section__head, .about, .fa, .hc, .filters, .timeline, .job, .service, .proj, .contact__row").forEach((el, i) => {
    el.classList.add("reveal");
    el.style.transitionDelay = el.matches(".fa, .hc, .job, .proj") ? `${(i % 5) * 60}ms` : "";
    io.observe(el);
  });
}
