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
        themeToggle.setAttribute("aria-label", "Changer de thème");
    } else {
        languageToggle.checked = false;
        languageToggle.setAttribute("aria-label", "Switch language");
        themeToggle.setAttribute("aria-label", "Switch theme");
    }

    updateImages();
}

languageToggle.addEventListener("change", () => {
    if (languageToggle.checked) {
        setLanguage("fr");
    } else {
        setLanguage("en");
    }
});

loadTranslations().catch(console.error);


/*************************
* IMAGES TOGGLE BEHAVIOR *
*************************/

const themeToggle = document.getElementById("theme-toggle");

function updateImages() {
    const iphoneBezel = document.getElementById("iphone-bezel");
    const iphoneScreenshot = document.getElementById("iphone-screenshot");
    const appStoreLogo = document.getElementById("app-store-logo");
    const language = document.documentElement.lang;

    let theme = "light";
    let bezelColor = "black";

    if (themeToggle.checked) {
        theme = "dark";
        bezelColor = "silver";
    }

    iphoneBezel.src = "./assets/images/bezel-iphone_18_pro-" + bezelColor + ".png";
    iphoneScreenshot.src = "./assets/images/screenshot-" + language + "-" + theme + ".webp";
    appStoreLogo.src = "./assets/images/logo-app_store-" + language + "-" + theme + ".svg";

    if (language === "fr") {
        iphoneScreenshot.alt = "Aperçu de l’application DBVAC";
        appStoreLogo.alt = "Télécharger dans l’App Store";
    } else {
        iphoneScreenshot.alt = "DBVAC app preview";
        appStoreLogo.alt = "Download on the App Store";
    }
}

themeToggle.addEventListener("change", updateImages);

updateImages();


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
