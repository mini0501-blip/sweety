const flow = window.SweetyFlow;

if (flow) {
  flow.updateScale();
  flow.runBackgroundFadeIn(".bg-image");
  flow.setupAutoNavigation({ nextUrl: "./home-promo.html" });
  window.addEventListener("resize", flow.updateScale);
  window.addEventListener("orientationchange", flow.updateScale);
}
