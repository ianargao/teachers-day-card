const card = document.getElementById("card");
const btn = document.getElementById("toggleBtn");
const label = btn.querySelector("span");
const nextBtn = document.getElementById("nextBtn");
const backBtn = document.getElementById("backBtn");
const mPrev = document.getElementById("mPrev");
const mNext = document.getElementById("mNext");
const dots = document.querySelectorAll(".dots i");
const mq = window.matchMedia("(max-width:800px)");

// desktop: 2 spreads (0-1). phone: 4 single pages (0-3).
let step = 0;
const last = () => (mq.matches ? 3 : 1);

function render() {
  card.classList.toggle("page2", mq.matches ? step >= 2 : step >= 1);
  card.dataset.step = step;
  mPrev.disabled = step === 0;
  mNext.disabled = step === last();
  dots.forEach((d, i) => d.classList.toggle("on", i === step));
}
function go(n) {
  if (!card.classList.contains("open")) return;
  step = Math.min(Math.max(n, 0), last());
  render();
}
function toggle(open) {
  card.classList.toggle("open", open);
  if (!open) step = 0;
  btn.setAttribute("aria-expanded", open);
  label.textContent = open ? "Close Card" : "Open Card";
  render();
}

btn.addEventListener("click", () => toggle(!card.classList.contains("open")));
nextBtn.addEventListener("click", () => go(1));
backBtn.addEventListener("click", () => go(0));
mNext.addEventListener("click", () => go(step + 1));
mPrev.addEventListener("click", () => go(step - 1));
document.querySelectorAll(".msg-btn").forEach((b) => b.addEventListener("click", () => go(1)));
mq.addEventListener("change", () => { step = 0; render(); });
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") toggle(false);
  if (e.key === "ArrowRight") go(step + 1);
  if (e.key === "ArrowLeft") go(step - 1);
});
render();
