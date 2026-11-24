/***************************
* LANGUAGE TOGGLE BEHAVIOR *
***************************/

let translations = {};

const languageToggle = document.getElementById("language-toggle");

languageToggle.disabled = true;

async function loadTranslations() {
    const response = await fetch("./assets/translations.json");

    if (!response.ok) {
        throw new Error("Failed to load translations.");
    }

    translations = await response.json();

    if (document.documentElement.lang === "fr") {
        setLanguage("fr");
    } else {
        setLanguage("en");
    }

    languageToggle.disabled = false;
}

function setLanguage(language) {
    const text = translations[language];

    if (!text) {
        return;
    }

    document.documentElement.lang = language;
    document.title = text.title;
    document.querySelector('meta[name="description"]').content = text.description;

    const heading2 = document.querySelector('[data-i18n="heading2"]');

    if (heading2) {
        heading2.textContent = text.heading2;
    }

    if (language === "fr") {
        languageToggle.checked = true;
        languageToggle.setAttribute("aria-label", "Changer de langue");
    } else {
        languageToggle.checked = false;
        languageToggle.setAttribute("aria-label", "Switch language");
    }
}

languageToggle.addEventListener("change", () => {
    if (languageToggle.checked) {
        setLanguage("fr");
    } else {
        setLanguage("en");
    }
});

loadTranslations().catch(console.error);
