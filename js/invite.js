(function () {
  var FRONTEND = "https://advault-frontend.onrender.com";

  function parseInviteCode(search) {
    try {
      var params = new URLSearchParams(search || "");
      var code = String(params.get("ref") || "").trim().toUpperCase();
      return /^TT[A-Z0-9]{4,16}$/.test(code) ? code : "";
    } catch (e) {
      return "";
    }
  }

  function isAndroidUa(ua) {
    return /Android/i.test(ua || "");
  }

  function isIosUa(ua) {
    if (isAndroidUa(ua)) return false;
    return /iPhone|iPod|iPad/i.test(ua || "");
  }

  function frontendInviteUrl(code) {
    return FRONTEND + "/?ref=" + encodeURIComponent(code);
  }

  var api = {
    parseInviteCode: parseInviteCode,
    isAndroidUa: isAndroidUa,
    isIosUa: isIosUa,
    frontendInviteUrl: frontendInviteUrl
  };

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }

  if (typeof window === "undefined" || typeof document === "undefined") return;

  function copyCode(code) {
    try { localStorage.setItem("advault_invite_ref", code); } catch (e) {}
    var ta = document.createElement("textarea");
    ta.value = code;
    ta.setAttribute("readonly", "");
    ta.style.cssText = "position:fixed;left:-9999px;top:0";
    document.body.appendChild(ta);
    ta.focus();
    ta.select();
    ta.setSelectionRange(0, code.length);
    try { document.execCommand("copy"); } catch (e) {}
    document.body.removeChild(ta);
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(code).catch(function () {});
    }
  }

  var code = parseInviteCode(window.location.search || "");
  var webBtn = document.querySelector("a.ios-web");
  if (webBtn && code) webBtn.href = frontendInviteUrl(code);
  if (!code) return;

  try { localStorage.setItem("advault_invite_ref", code); } catch (e) {}

  if (isIosUa(navigator.userAgent || "")) {
    window.location.replace(frontendInviteUrl(code));
    return;
  }

  document.querySelectorAll("a[href*='advault-tt.apk']").forEach(function (link) {
    link.addEventListener("click", function () {
      copyCode(code);
    });
  });

  var note = document.querySelector(".download .note");
  if (note) {
    note.textContent = "كود الدعوة " + code + " سيُثبَّت تلقائيًا بعد تثبيت التطبيق. لا يمكن تغييره.";
  }
})();
