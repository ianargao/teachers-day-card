const card = document.getElementById("card");

const btn = document.getElementById("toggleBtn");
const label = btn.querySelector("span");

const nextBtn = document.getElementById("nextBtn");
const backBtn = document.getElementById("backBtn");

const mPrev = document.getElementById("mPrev");
const mNext = document.getElementById("mNext");

const dots = document.querySelectorAll(".dots i");

const bgMusic = document.getElementById("bgMusic");

const mq = window.matchMedia("(max-width:800px)");

// Desktop: 2 spreads (0-1)
// Mobile: 4 single pages (0-3)
let step = 0;

const last = () => (mq.matches ? 3 : 1);


// ------------------------------------
// RENDER PAGE
// ------------------------------------

function render() {

  card.classList.toggle(
    "page2",
    mq.matches ? step >= 2 : step >= 1
  );

  card.dataset.step = step;

  mPrev.disabled = step === 0;
  mNext.disabled = step === last();

  dots.forEach((dot, index) => {
    dot.classList.toggle("on", index === step);
  });
}


// ------------------------------------
// CHANGE PAGE
// ------------------------------------

function go(n) {

  if (!card.classList.contains("open")) {
    return;
  }

  step = Math.min(
    Math.max(n, 0),
    last()
  );

  render();
}


// ------------------------------------
// START MUSIC
// ------------------------------------

function startMusic() {

  // Set background music volume to 35%
  bgMusic.volume = 0.35;

  const playPromise = bgMusic.play();

  if (playPromise !== undefined) {

    playPromise.catch(() => {
      // Browser blocked playback.
      // The next user interaction can try again.
    });

  }
}


// ------------------------------------
// STOP MUSIC
// ------------------------------------

function stopMusic() {

  bgMusic.pause();

  // Start from the beginning next time
  bgMusic.currentTime = 0;
}


// ------------------------------------
// OPEN / CLOSE CARD
// ------------------------------------

function toggle(open) {

  card.classList.toggle("open", open);

  if (!open) {

    // Return to first page
    step = 0;

    // Stop and reset music
    stopMusic();

  } else {

    // Start background music
    startMusic();

  }

  btn.setAttribute(
    "aria-expanded",
    open
  );

  label.textContent = open
    ? "Close Card"
    : "Open Card";

  render();
}


// ------------------------------------
// PAGE VISIBILITY
// ------------------------------------

document.addEventListener("visibilitychange", () => {

  if (document.hidden) {

    // Pause music when the page is hidden.
    // This happens when switching tabs,
    // switching apps, opening Messenger,
    // or locking the phone.

    bgMusic.pause();

  } else {

    // Resume music when returning to the page,
    // but only if the card is still open.

    if (card.classList.contains("open")) {

      bgMusic.play().catch(() => {
        // Browser may require another user interaction.
      });

    }

  }

});


// ------------------------------------
// PAGE HIDE / LEAVING WEBSITE
// ------------------------------------

window.addEventListener("pagehide", () => {

  // Stop and reset music when leaving
  // the actual webpage.

  bgMusic.pause();
  bgMusic.currentTime = 0;

});


// ------------------------------------
// OPEN / CLOSE BUTTON
// ------------------------------------

btn.addEventListener("click", () => {

  toggle(
    !card.classList.contains("open")
  );

});


// ------------------------------------
// DESKTOP PAGE BUTTONS
// ------------------------------------

nextBtn.addEventListener("click", () => {

  go(1);

});

backBtn.addEventListener("click", () => {

  go(0);

});


// ------------------------------------
// MOBILE PAGE BUTTONS
// ------------------------------------

mNext.addEventListener("click", () => {

  go(step + 1);

});

mPrev.addEventListener("click", () => {

  go(step - 1);

});


// ------------------------------------
// BACK TO MESSAGE BUTTONS
// ------------------------------------

document
  .querySelectorAll(".msg-btn")
  .forEach((button) => {

    button.addEventListener("click", () => {

      go(1);

    });

  });


// ------------------------------------
// SCREEN SIZE CHANGE
// ------------------------------------

mq.addEventListener("change", () => {

  step = 0;

  render();

});


// ------------------------------------
// KEYBOARD CONTROLS
// ------------------------------------

document.addEventListener("keydown", (e) => {

  // Escape = close card
  if (e.key === "Escape") {

    toggle(false);

  }

  // Right arrow = next page
  if (e.key === "ArrowRight") {

    go(step + 1);

  }

  // Left arrow = previous page
  if (e.key === "ArrowLeft") {

    go(step - 1);

  }

});


// ------------------------------------
// INITIAL PAGE
// ------------------------------------

render();