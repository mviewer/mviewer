const dsfrLoader = (function () {
  function addModuleScript(src) {
    const s = document.createElement("script");
    s.type = "module";
    s.src = src;
    document.head.appendChild(s);
  }

  function addNoModuleScript(src) {
    const s = document.createElement("script");
    s.type = "text/javascript";
    s.noModule = true; // équivalent à attribut nomodule
    s.src = src;
    document.head.appendChild(s);
  }

  return {
    init: function () {
      const base = "css/themes/theme-designfr/dsfr-v1.14.3/dist/";

      // Évite double chargement
      if (document.querySelector('script[src*="dsfr.module.min.js"]')) return;

      addModuleScript(base + "dsfr.module.min.js");
      addNoModuleScript(base + "dsfr.nomodule.min.js");
    },
  };
})();

new CustomComponent("dsfr-loader", dsfrLoader.init);
