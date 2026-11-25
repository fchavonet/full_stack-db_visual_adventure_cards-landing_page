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

    const modalName = window.location.hash.slice(1);

    if (modalName === "privacy" || modalName === "support") {
        await openMarkdownModal(modalName);
    }
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

    updateAppStoreLogo();
}

languageToggle.addEventListener("change", () => {
    if (languageToggle.checked) {
        setLanguage("fr");
    } else {
        setLanguage("en");
    }
});

loadTranslations().catch(console.error);


/************************
* THEME TOGGLE BEHAVIOR *
************************/

function updateAppStoreLogo() {
    const appStoreLogo = document.getElementById("app-store-logo");
    const language = document.documentElement.lang;

    let theme = "light";

    if (document.getElementById("theme-toggle").checked) {
        theme = "dark";
    }

    appStoreLogo.src = "./assets/images/logo-app_store-" + language + "-" + theme + ".svg";

    if (language === "fr") {
        appStoreLogo.alt = "Télécharger dans l’App Store";
    } else {
        appStoreLogo.alt = "Download on the App Store";
    }
}

document.getElementById("theme-toggle").addEventListener("change", updateAppStoreLogo);


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

        content.querySelectorAll("a[href]").forEach(link => {
            if (link.protocol === "https:" || link.protocol === "http:") {
                link.target = "_blank";
                link.rel = "noopener noreferrer";
            }
        });
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
