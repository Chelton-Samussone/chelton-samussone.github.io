const pdfjsVersion = '4.10.38';
const pdfjsUrl = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsVersion}/pdf.min.mjs`;
const pdfjsWorkerUrl = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsVersion}/pdf.worker.min.mjs`;
const pdfUrl = 'Portifolio_2026_Chelton_Samussone_Guambe_%5BDesign%5D.pdf';

const translations = {
    pt: {
        pageDescription: 'Portfólio de design de Chelton Samussone.',
        back: 'Voltar ao portfólio principal',
        eyebrow: 'PORTFÓLIO · DESIGN',
        title: 'Portfólio de design.',
        description: 'Uma seleção de projetos de design gráfico, comunicação visual e identidade.',
        open: 'Abrir portfólio',
        hint: 'Percorre o portfólio fazendo scroll pela página.',
        loading: 'A preparar o portfólio…',
        loadError: 'Não foi possível abrir o portfólio. Verifica a ligação à internet e tenta novamente.',
        pageLabel: 'Página'
    },
    en: {
        pageDescription: 'Design portfolio by Chelton Samussone.',
        back: 'Back to main portfolio',
        eyebrow: 'PORTFOLIO · DESIGN',
        title: 'Design portfolio.',
        description: 'A selection of graphic design, visual communication and identity projects.',
        open: 'Open portfolio',
        hint: 'Scroll down the page to browse the portfolio.',
        loading: 'Preparing the portfolio…',
        loadError: 'Could not open the portfolio. Check your internet connection and try again.',
        pageLabel: 'Page'
    }
};

const browserLanguages = navigator.languages.length
    ? navigator.languages
    : [navigator.language];
const preferredLanguage = browserLanguages
    .map((language) => language.toLowerCase().split('-')[0])
    .find((language) => language === 'pt' || language === 'en');
let language = preferredLanguage || 'pt';
const pageStates = new Map();

function setLanguage(nextLanguage) {
    language = nextLanguage;
    const strings = translations[language];
    document.documentElement.lang = language === 'pt' ? 'pt-MZ' : 'en';

    document.querySelectorAll('[data-i18n]').forEach((element) => {
        const translation = strings[element.dataset.i18n];

        if (element instanceof HTMLMetaElement) {
            element.content = translation;
        } else {
            element.textContent = translation;
        }
    });

    const toggle = document.querySelector('.language-toggle');
    toggle.textContent = language === 'pt' ? 'EN' : 'PT';
    toggle.setAttribute(
        'aria-label',
        language === 'pt' ? 'Switch language to English' : 'Mudar idioma para português'
    );

    pageStates.forEach((state) => {
        const label = state.sheet.querySelector('.sheet-label');
        label.textContent = `${translations[language].pageLabel} ${state.pageNumber} / ${pdfDocument.numPages}`;
        state.sheet.setAttribute(
            'aria-label',
            `${translations[language].pageLabel} ${state.pageNumber}`
        );
        state.canvas.setAttribute(
            'aria-label',
            `${translations[language].pageLabel} ${state.pageNumber}`
        );
    });
}

setLanguage(language);

document.querySelector('.language-toggle').addEventListener('click', () => {
    setLanguage(language === 'pt' ? 'en' : 'pt');
});

const book = document.querySelector('.book');
const cover = document.querySelector('.book-cover');
const openButton = document.querySelector('.open-book');
const portfolioPages = document.querySelector('#portfolio-pages');
const errorMessage = document.querySelector('.reader-error');
let pdfDocument;
let pageObserver;
let isLoading = false;

function showPageError(error, state) {
    if (error.name === 'RenderingCancelledException') {
        return;
    }

    console.error(`Unable to render portfolio page ${state.pageNumber}:`, error);
    errorMessage.textContent = translations[language].loadError;
    errorMessage.hidden = false;
}

function releasePage(state) {
    state.generation += 1;
    if (state.renderTask) {
        state.renderTask.cancel();
        state.renderTask = null;
    }

    if (state.canvas.width || state.canvas.height) {
        state.canvas.width = 0;
        state.canvas.height = 0;
    }
    state.rendered = false;
    state.page?.cleanup();
}

async function renderPage(state) {
    if (state.rendering || state.rendered || !state.active) {
        return;
    }

    state.rendering = true;
    const generation = ++state.generation;

    try {
        const page = await pdfDocument.getPage(state.pageNumber);
        if (!state.active || generation !== state.generation) {
            return;
        }

        state.page = page;
        const baseViewport = page.getViewport({ scale: 1 });
        state.content.style.aspectRatio = `${baseViewport.width} / ${baseViewport.height}`;

        const cssScale = state.content.clientWidth / baseViewport.width;
        const viewport = page.getViewport({ scale: cssScale });
        const maxCanvasPixels = 8_000_000;
        const deviceScale = window.devicePixelRatio || 1;
        const outputScale = Math.min(
            deviceScale,
            Math.sqrt(maxCanvasPixels / (viewport.width * viewport.height))
        );

        state.canvas.width = Math.ceil(viewport.width * outputScale);
        state.canvas.height = Math.ceil(viewport.height * outputScale);

        const context = state.canvas.getContext('2d', { alpha: false });
        if (!context) {
            throw new Error('Canvas rendering context is unavailable.');
        }

        state.renderTask = page.render({
            canvasContext: context,
            viewport,
            transform: [outputScale, 0, 0, outputScale, 0, 0],
            background: '#fff'
        });
        await state.renderTask.promise;

        if (state.active && generation === state.generation) {
            state.rendered = true;
            state.sheet.classList.add('is-rendered');
        }
    } catch (error) {
        showPageError(error, state);
    } finally {
        state.renderTask = null;
        state.rendering = false;
        if (state.active && !state.rendered && generation !== state.generation) {
            renderPage(state);
        }
    }
}

function createPage(pageNumber, totalPages) {
    const sheet = document.createElement('article');
    sheet.className = 'portfolio-sheet';
    sheet.dataset.pageNumber = String(pageNumber);
    sheet.setAttribute('aria-label', `${translations[language].pageLabel} ${pageNumber}`);

    const label = document.createElement('p');
    label.className = 'sheet-label';
    label.dataset.pageNumber = String(pageNumber);
    label.textContent = `${translations[language].pageLabel} ${pageNumber} / ${totalPages}`;

    const content = document.createElement('div');
    content.className = 'sheet-content';

    const canvas = document.createElement('canvas');
    canvas.setAttribute('aria-label', `${translations[language].pageLabel} ${pageNumber}`);

    content.append(canvas);
    sheet.append(label, content);

    const state = {
        pageNumber,
        sheet,
        content,
        canvas,
        active: false,
        rendered: false,
        rendering: false,
        renderTask: null,
        page: null,
        generation: 0
    };

    pageStates.set(pageNumber, state);
    portfolioPages.append(sheet);
}

async function openPortfolio() {
    if (isLoading || pdfDocument) {
        return;
    }

    isLoading = true;
    openButton.disabled = true;
    openButton.textContent = translations[language].loading;
    errorMessage.hidden = true;

    try {
        const pdfjs = await import(pdfjsUrl);
        pdfjs.GlobalWorkerOptions.workerSrc = pdfjsWorkerUrl;

        const loadingTask = pdfjs.getDocument({
            url: pdfUrl,
            disableAutoFetch: true,
            disableStream: true,
            rangeChunkSize: 262144
        });
        pdfDocument = await loadingTask.promise;

        pageObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                const state = pageStates.get(Number(entry.target.dataset.pageNumber));
                if (!state) {
                    return;
                }

                state.active = entry.isIntersecting;
                if (state.active) {
                    renderPage(state);
                } else if (state.rendered || state.rendering) {
                    releasePage(state);
                    state.sheet.classList.remove('is-rendered');
                }
            });
        }, {
            rootMargin: '300px 0px',
            threshold: 0
        });

        portfolioPages.replaceChildren();
        for (let pageNumber = 1; pageNumber <= pdfDocument.numPages; pageNumber += 1) {
            createPage(pageNumber, pdfDocument.numPages);
        }

        cover.hidden = true;
        portfolioPages.hidden = false;
        openButton.hidden = true;
        pageStates.forEach((state) => pageObserver.observe(state.sheet));
        portfolioPages.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } catch (error) {
        console.error('Unable to open the design portfolio:', error);
        pageObserver?.disconnect();
        pageStates.clear();
        portfolioPages.replaceChildren();
        portfolioPages.hidden = true;
        pdfDocument?.destroy();
        pdfDocument = undefined;
        errorMessage.textContent = translations[language].loadError;
        errorMessage.hidden = false;
        openButton.disabled = false;
        openButton.textContent = translations[language].open;
    } finally {
        isLoading = false;
    }
}

openButton.addEventListener('click', openPortfolio);

let resizeTimer;
window.addEventListener('resize', () => {
    window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(() => {
        pageStates.forEach((state) => {
            if (!state.active || !state.rendered) {
                return;
            }

            releasePage(state);
            state.sheet.classList.remove('is-rendered');
            renderPage(state);
        });
    }, 180);
});
