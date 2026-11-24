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

    document.querySelectorAll("[data-i18n]").forEach(element => {
        const translation = text[element.dataset.i18n];

        if (translation !== undefined) {
            element.textContent = translation;
        }
    });

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


/**********************
* OPEN MODAL BEHAVIOR *
**********************/

async function openMarkdownModal(name) {
    const modal = document.getElementById(name + "-modal");
    const content = document.getElementById(name + "-content");
    const language = document.documentElement.lang;
    const errorMessage = "Failed to load " + name + " content.";

    content.textContent = "Loading...";
    modal.showModal();

    try {
        const response = await fetch("./docs/" + name + "-" + language + ".md");

        if (!response.ok) {
            throw new Error(errorMessage);
        }

        const markdown = await response.text();

        content.innerHTML = DOMPurify.sanitize(marked.parse(markdown));
    } catch (error) {
        content.textContent = errorMessage;
        console.error(error);
    }
}


/**************************
* YEAR COPYRIGHT BEHAVIOR *
**************************/

const year = document.getElementById("year");
year.textContent = new Date().getFullYear();
