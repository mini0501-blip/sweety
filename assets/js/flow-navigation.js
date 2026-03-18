(function attachSweetyFlow(windowObject) {
  function runAfterNextPaint(callback) {
    windowObject.requestAnimationFrame(() => {
      windowObject.requestAnimationFrame(() => {
        callback();
      });
    });
  }

  function updateScale() {
    const baseWidth = 402;
    const baseHeight = 874;
    const viewportWidth = windowObject.innerWidth;
    const viewportHeight = windowObject.innerHeight;
    const scale = Math.min(viewportWidth / baseWidth, viewportHeight / baseHeight);
    const artboard = document.querySelector(".artboard");

    if (!artboard) {
      return;
    }

    artboard.style.transform = `translate(-50%, -50%) scale(${scale})`;
  }

  function runBackgroundFadeIn(bgSelector = ".bg-image") {
    const bgImage = document.querySelector(bgSelector);

    if (!bgImage) {
      return;
    }

    runAfterNextPaint(() => {
      bgImage.classList.add("is-visible");
    });
  }

  function setupAutoNavigation({
    nextUrl,
    bgSelector = ".bg-image",
    triggerSelector = ".content-area",
    autoDelay = 6000,
    fadeOutDelay = 200,
  }) {
    const bgImage = document.querySelector(bgSelector);
    const triggerArea = document.querySelector(triggerSelector);
    let hasNavigated = false;
    let autoNavigateTimeoutId = null;

    const navigateWithFadeOut = () => {
      if (hasNavigated) {
        return;
      }

      hasNavigated = true;

      if (autoNavigateTimeoutId) {
        windowObject.clearTimeout(autoNavigateTimeoutId);
        autoNavigateTimeoutId = null;
      }

      if (bgImage) {
        bgImage.classList.remove("is-visible");
      }

      windowObject.setTimeout(() => {
        windowObject.location.href = nextUrl;
      }, fadeOutDelay);
    };

    autoNavigateTimeoutId = windowObject.setTimeout(() => {
      navigateWithFadeOut();
    }, autoDelay);

    if (triggerArea) {
      triggerArea.addEventListener("click", navigateWithFadeOut);
      triggerArea.addEventListener("touchend", navigateWithFadeOut, { passive: true });
    }

    return navigateWithFadeOut;
  }

  windowObject.SweetyFlow = {
    runAfterNextPaint,
    updateScale,
    runBackgroundFadeIn,
    setupAutoNavigation,
  };
}(window));