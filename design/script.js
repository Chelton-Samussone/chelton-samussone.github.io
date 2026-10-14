const translations = {
    pt: {
        pageDescription: 'Portfólio de design de Chelton Samussone.',
        back: 'Voltar ao portfólio principal',
        eyebrow: 'PORTFÓLIO · DESIGN',
        title: 'Design gráfico e identidade visual.',
        description: 'Uma seleção de projetos de design gráfico, comunicação visual e identidade.',
        fileSize: 'O PDF tem 20,5 MB e só será carregado quando escolheres abrir o portfólio.',
        open: 'Ver portfólio PDF · 20,5 MB',
        newTab: 'Abrir PDF num novo separador',
        viewerTitle: 'Portfólio de design em PDF',
        switchLanguage: 'Switch language to English'
    },
    en: {
        pageDescription: 'Design portfolio by Chelton Samussone.',
        back: 'Back to main portfolio',
        eyebrow: 'PORTFOLIO · DESIGN',
        title: 'Graphic design and visual identity.',
        description: 'A selection of graphic design, visual communication and identity projects.',
        fileSize: 'The PDF is 20.5 MB and only loads when you choose to open the portfolio.',
        open: 'View PDF portfolio · 20.5 MB',
        newTab: 'Open PDF in a new tab',
        viewerTitle: 'Design portfolio PDF',
        switchLanguage: 'Mudar idioma para português'
    }
};

function setLanguage(language) {
    document.documentElement.lang = language === 'pt' ? 'pt-MZ' : 'en';

    document.querySelectorAll('[data-i18n]').forEach((element) => {
        const translation = translations[language][element.dataset.i18n];

        if (element instanceof HTMLMetaElement) {
            element.content = translation;
        } else {
            element.textContent = translation;
        }
    });

    const toggle = document.querySelector('.language-toggle');
    toggle.textContent = language === 'pt' ? 'EN' : 'PT';
    toggle.setAttribute('aria-label', translations[language].switchLanguage);
    document.querySelector('#portfolio-viewer').title = translations[language].viewerTitle;
}

const browserLanguages = navigator.languages.length
    ? navigator.languages
    : [navigator.language];
const preferredLanguage = browserLanguages
    .map((language) => language.toLowerCase().split('-')[0])
    .find((language) => language === 'pt' || language === 'en');

setLanguage(preferredLanguage || 'pt');

document.querySelector('.language-toggle').addEventListener('click', () => {
    const currentLanguage = document.documentElement.lang.startsWith('pt') ? 'pt' : 'en';
    setLanguage(currentLanguage === 'pt' ? 'en' : 'pt');
});

const viewer = document.querySelector('#portfolio-viewer');
const openViewer = document.querySelector('.open-viewer');

openViewer.addEventListener('click', () => {
    if (!viewer.src) {
        viewer.src = 'Portifolio_2026_Chelton_Samussone_Guambe_%5BDesign%5D.pdf#view=FitH';
    }

    viewer.hidden = false;
    openViewer.setAttribute('aria-expanded', 'true');
    viewer.scrollIntoView({ behavior: 'smooth', block: 'start' });
});
