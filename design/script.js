const pdfjsVersion = '4.10.38';
const pdfjsUrl = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsVersion}/pdf.min.mjs`;
const pdfWorkerUrl = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsVersion}/pdf.worker.min.mjs`;
const pdfUrl = 'Portifolio_2026_Chelton_Samussone_Guambe_%5BDesign%5D.pdf';

const translations = {
    pt: {
        pageDescription: 'Portfólio de design de Chelton Samussone.',
        back: 'Voltar ao portfólio principal',
        eyebrow: 'PORTFÓLIO · DESIGN',
        title: 'Portfólio de design.',
        description: 'Uma seleção de projetos de design gráfico, comunicação visual e identidade.',
        coverLabel: 'PORTFÓLIO · 2026',
        coverSubtitle: 'DESIGN GRÁFICO<br>IDENTIDADE VISUAL',
        open: 'Abrir portfólio',
        previous: '← Anterior',
        next: 'Seguinte →',
        previousLabel: 'Página anterior',
        nextLabel: 'Página seguinte',
        hint: 'Folheia com os botões ou as teclas ← →.',
        loading: 'A preparar o livro…',
        loadError: 'Não foi possível abrir o portfólio. Verifica a ligação à internet e tenta novamente.',
        pageLabel: 'Página'
    },
    en: {
        pageDescription: 'Design portfolio by Chelton Samussone.',
        back: 'Back to main portfolio',
        eyebrow: 'PORTFOLIO · DESIGN',
        title: 'Design portfolio.',
        description: 'A selection of graphic design, visual communication and identity projects.',
        coverLabel: 'PORTFOLIO · 2026',
        coverSubtitle: 'GRAPHIC DESIGN<br>VISUAL IDENTITY',
        open: 'Open portfolio',
        previous: '← Previous',
        next: 'Next →',
        previousLabel: 'Previous page',
        nextLabel: 'Next page',
        hint: 'Turn pages with the buttons or the ← → keys.',
        loading: 'Preparing the book…',
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

function setLanguage(nextLanguage) {
    language = nextLanguage;
    const strings = translations[language];
    document.documentElement.lang = language === 'pt' ? 'pt-MZ' : 'en';

    document.querySelectorAll('[data-i18n]').forEach((element) => {
        const translation = strings[element.dataset.i18n];

        if (element instanceof HTMLMetaElement) {
            element.content = translation;
        } else if (element.classList.contains('cover-subtitle')) {
            element.innerHTML = translation;
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
    document.querySelector('.previous-page').setAttribute(
        'aria-label',
        strings.previousLabel
    );
    document.querySelector('.next-page').setAttribute(
        'aria-label',
        strings.nextLabel
    );
}

setLanguage(language);

document.querySelector('.language-toggle').addEventListener('click', () => {
    setLanguage(language === 'pt' ? 'en' : 'pt');
    if (pdfDocument) {
        updatePageControls();
    }
});

const book = document.querySelector('.book');
const cover = document.querySelector('.book-cover');
const pages = document.querySelector('.book-pages');
const controls = document.querySelector('.reader-controls');
const openButton = document.querySelector('.open-book');
const previousButton = document.querySelector('.previous-page');
const nextButton = document.querySelector('.next-page');
const pageCount = document.querySelector('.page-count');
const progressBar = document.querySelector('.page-progress span');
const errorMessage = document.querySelector('.reader-error');
const leftCanvas = document.querySelector('.left-page canvas');
const rightCanvas = document.querySelector('.right-page canvas');

let pdfDocument;
let firstPage = 1;
let renderSequence = 0;
let isTurning = false;

function updatePageControls() {
    const isMobile = window.matchMedia('(max-width: 700px)').matches;
    const firstVisiblePage = firstPage;
    const lastVisiblePage = isMobile || firstPage === 1
        ? firstPage
        : Math.min(firstPage + 1, pdfDocument.numPages);

    pageCount.textContent = `${translations[language].pageLabel} ${firstVisiblePage}${lastVisiblePage !== firstVisiblePage ? `–${lastVisiblePage}` : ''} / ${pdfDocument.numPages}`;
    progressBar.style.width = `${(lastVisiblePage / pdfDocument.numPages) * 100}%`;
    previousButton.disabled = firstPage === 1;
    nextButton.disabled = lastVisiblePage >= pdfDocument.numPages;
}

async function renderPage(pageNumber, canvas) {
    const page = await pdfDocument.getPage(pageNumber);
    const context = canvas.getContext('2d', { alpha: false });
    const baseViewport = page.getViewport({ scale: 1 });
    const pageElement = canvas.parentElement;
    const isMobile = window.matchMedia('(max-width: 700px)').matches;
    const availableWidth = pageElement.clientWidth || book.clientWidth / (isMobile ? 1 : 2);
    const availableHeight = Math.min(window.innerHeight * 0.68, 900);
    const scale = Math.min(
        availableWidth / baseViewport.width,
        availableHeight / baseViewport.height,
        1.25
    );
    const viewport = page.getViewport({ scale });
    const outputScale = Math.min(window.devicePixelRatio || 1, 1.5);

    canvas.width = Math.floor(viewport.width * outputScale);
    canvas.height = Math.floor(viewport.height * outputScale);
    canvas.style.width = `${Math.floor(viewport.width)}px`;
    canvas.style.height = `${Math.floor(viewport.height)}px`;

    await page.render({
        canvasContext: context,
        viewport,
        transform: outputScale === 1 ? null : [outputScale, 0, 0, outputScale, 0, 0],
        background: '#fff'
    }).promise;
}

async function renderSpread() {
    const sequence = ++renderSequence;
    const totalPages = pdfDocument.numPages;
    const isCover = firstPage === 1;
    const isMobile = window.matchMedia('(max-width: 700px)').matches;
    const leftPageNumber = isCover || isMobile ? null : firstPage;
    const rightPageNumber = isMobile ? firstPage : (isCover ? 1 : firstPage + 1);
    const leftPageElement = document.querySelector('.left-page');
    const rightPageElement = document.querySelector('.right-page');

    pages.classList.toggle('is-cover', isCover);
    leftPageElement.hidden = isCover || isMobile;
    rightPageElement.hidden = false;
    book.classList.remove('is-turning');

    const visiblePages = [];
    if (leftPageNumber !== null && leftPageNumber <= totalPages) {
        visiblePages.push(renderPage(leftPageNumber, leftCanvas));
    }
    if (rightPageNumber <= totalPages) {
        visiblePages.push(renderPage(rightPageNumber, rightCanvas));
    }

    await Promise.all(visiblePages);
    if (sequence !== renderSequence) {
        return;
    }

    updatePageControls();
}

async function openBook() {
    openButton.disabled = true;
    openButton.textContent = translations[language].loading;
    errorMessage.hidden = true;

    try {
        const pdfjs = await import(pdfjsUrl);
        pdfjs.GlobalWorkerOptions.workerSrc = pdfWorkerUrl;

        const loadingTask = pdfjs.getDocument({
            url: pdfUrl,
            disableAutoFetch: true,
            disableStream: true,
            rangeChunkSize: 65536
        });
        pdfDocument = await loadingTask.promise;

        cover.hidden = true;
        pages.hidden = false;
        controls.hidden = false;
        await renderSpread();
        openButton.hidden = true;
    } catch (error) {
        console.error('Unable to open the design portfolio:', error);
        cover.hidden = false;
        pages.hidden = true;
        controls.hidden = true;
        openButton.hidden = false;
        errorMessage.textContent = translations[language].loadError;
        errorMessage.hidden = false;
        openButton.disabled = false;
        openButton.textContent = translations[language].open;
    }
}

async function turnPage(direction) {
    if (!pdfDocument || isTurning) {
        return;
    }

    const previousFirstPage = firstPage;
    const isMobile = window.matchMedia('(max-width: 700px)').matches;
    firstPage = isMobile
        ? firstPage + direction
        : (direction > 0
            ? (firstPage === 1 ? 2 : firstPage + 2)
            : (firstPage === 2 ? 1 : firstPage - 2));
    firstPage = Math.max(1, Math.min(firstPage, pdfDocument.numPages));

    if (firstPage === previousFirstPage) {
        return;
    }

    isTurning = true;
    previousButton.disabled = true;
    nextButton.disabled = true;
    book.style.setProperty('--turn-angle', direction > 0 ? '-12deg' : '12deg');
    book.classList.add('is-turning');

    await new Promise((resolve) => window.setTimeout(resolve, 180));
    try {
        await renderSpread();
    } catch (error) {
        firstPage = previousFirstPage;
        console.error('Unable to render portfolio pages:', error);
        errorMessage.textContent = translations[language].loadError;
        errorMessage.hidden = false;
    } finally {
        isTurning = false;
        updatePageControls();
    }
}

openButton.addEventListener('click', openBook);
previousButton.addEventListener('click', () => turnPage(-1));
nextButton.addEventListener('click', () => turnPage(1));

document.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowRight') {
        turnPage(1);
    } else if (event.key === 'ArrowLeft') {
        turnPage(-1);
    }
});

let touchStartX = null;
book.addEventListener('touchstart', (event) => {
    touchStartX = event.changedTouches[0].clientX;
}, { passive: true });

book.addEventListener('touchend', (event) => {
    if (touchStartX === null) {
        return;
    }

    const swipeDistance = event.changedTouches[0].clientX - touchStartX;
    if (Math.abs(swipeDistance) > 50) {
        turnPage(swipeDistance < 0 ? 1 : -1);
    }

    touchStartX = null;
}, { passive: true });

let resizeTimer;
window.addEventListener('resize', () => {
    if (!pdfDocument) {
        return;
    }

    window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(() => {
        renderSpread().catch((error) => {
            console.error('Unable to resize portfolio pages:', error);
        });
    }, 180);
});
