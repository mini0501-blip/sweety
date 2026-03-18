function updateLayoutScale() {
  const baseWidth = 402;
  const baseHeight = 874;
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;
  const scale = Math.min(viewportWidth / baseWidth, viewportHeight / baseHeight);

  document.documentElement.style.setProperty("--scale", String(scale));
  document.documentElement.style.setProperty("--app-height", `${viewportHeight}px`);
}

function randomBetween(min, max) {
  return Math.random() * (max - min) + min;
}

let fadeTimeoutId;
let navigateTimeoutId;

function runLogoFillAnimation() {
  const logoFill = document.getElementById("logoFill");

  if (!logoFill) {
    return;
  }

  logoFill.replaceChildren();

  const bubbleCount = 5;
  const logoWidth = logoFill.clientWidth;
  const logoHeight = logoFill.clientHeight;
  const bubbles = [];

  for (let index = 0; index < bubbleCount; index += 1) {
    const bubble = document.createElement("span");
    const diameter = randomBetween(8, 24);
    const segmentCenter = ((index + 0.5) / bubbleCount) * logoWidth;
    const x = segmentCenter + randomBetween(-logoWidth * 0.06, logoWidth * 0.06);
    const y = randomBetween(logoHeight * 0.25, logoHeight * 0.75);
    const finalScale = randomBetween(3.8, 5.8);

    bubble.className = "logo-bubble";
    bubble.style.width = `${diameter}px`;
    bubble.style.height = `${diameter}px`;
    bubble.style.left = `${x}px`;
    bubble.style.top = `${y}px`;
    bubble.style.transition = "none";
    bubble.style.transform = "translate(-50%, -50%) scale(0)";

    logoFill.appendChild(bubble);
    bubbles.push({ element: bubble, finalScale });
  }

  void logoFill.offsetWidth;

  bubbles.forEach(({ element }) => {
    element.style.transition = "";
  });

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      bubbles.forEach(({ element, finalScale }) => {
        element.style.transform = `translate(-50%, -50%) scale(${finalScale})`;
      });
    });
  });
}

function navigateToHomeScreen() {
  navigateTimeoutId = window.setTimeout(() => {
    window.location.href = "./home-screen.html";
  }, 3500);
}

function runLogoFadeOut() {
  const logoWrap = document.querySelector(".logo-wrap");

  if (!logoWrap) {
    return;
  }

  fadeTimeoutId = window.setTimeout(() => {
    logoWrap.classList.add("is-fading");
  }, 3000);
}

function startSplashFlow() {
  const logoWrap = document.querySelector(".logo-wrap");

  if (fadeTimeoutId) {
    window.clearTimeout(fadeTimeoutId);
  }

  if (navigateTimeoutId) {
    window.clearTimeout(navigateTimeoutId);
  }

  if (logoWrap) {
    logoWrap.classList.remove("is-fading");
  }

  updateLayoutScale();
  runLogoFillAnimation();
  runLogoFadeOut();
  navigateToHomeScreen();
}

startSplashFlow();

window.addEventListener("pageshow", (event) => {
  if (!event.persisted) {
    return;
  }

  startSplashFlow();
});

window.addEventListener("resize", updateLayoutScale);
window.addEventListener("orientationchange", updateLayoutScale);
