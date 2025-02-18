// Disable webview native context menu.
// Optional, injected when webview loaded.
pub const JS_INIT_SCRIPT: &'static str = r#"
  (function () {
    document.addEventListener(
      "contextmenu",
      (e) => {
        e.preventDefault();
        return false;
      },
      { capture: true }
    );
    document.addEventListener("DOMContentLoaded", function () {
      document.querySelectorAll("input").forEach(function (el) {
        el.setAttribute("spellcheck", "false");
        el.setAttribute("autocomplete", "off");
        el.setAttribute("autocorrect", "off");
      });
      document.querySelectorAll("textarea").forEach(function (el) {
        el.setAttribute("spellcheck", "false");
        el.setAttribute("autocomplete", "off");
        el.setAttribute("autocorrect", "off");
      });
    });
  })();
"#;
