import React, { useEffect } from "react";

const GoogleTranslate = () => {
  useEffect(() => {
    const addScript = document.createElement("script");
    addScript.src =
      "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
    addScript.async = true;

    // Only append the script if it's not already added
    if (!document.querySelector('script[src*="translate_a/element.js"]')) {
      document.body.appendChild(addScript);
    }

    window.googleTranslateElementInit = () => {
      new window.google.translate.TranslateElement(
        {
          pageLanguage: "en",
          includedLanguages: "hi,ur,kn,ta,te,ml,or,pa,gu,bn,as,mr",
        },
        "google_translate_element"
      );
    };

    return () => {
      const translateElement = document.getElementById(
        "google_translate_element"
      );
      if (translateElement) {
        translateElement.innerHTML = ""; // Clear the content
      }
      // Clean up the script if it was dynamically added
      const scriptTag = document.querySelector(
        'script[src*="translate_a/element.js"]'
      );
      if (scriptTag) {
        scriptTag.parentNode.removeChild(scriptTag);
      }
    };
  }, []);

  return <div id="google_translate_element"></div>;
};

export default GoogleTranslate;
