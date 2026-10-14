const translations = {
    en: {
        pageTitle: 'Chelton Samussone — Architecture · Space · City · Design',
        pageDescription: 'Chelton Samussone — Architecture, spatial analysis, urban planning and graphic design.',
        navWork: 'Work',
        navAbout: 'About',
        navExplorations: 'Explorations',
        navContact: 'Contact',
        heroLabel: 'ARCHITECTURE · SPACE · CITY · DESIGN',
        heroTitleFirst: 'Designing ways',
        heroTitleSecond: 'of understanding space.',
        heroDescription: 'Architecture as an axis of practice, combining spatial analysis, urban planning and visual communication.',
        areasTitle: 'Core areas',
        areaArchitectureTitle: 'Architecture',
        areaArchitectureDescription: 'Spatial design, architectural thinking and the relationship between people, buildings and place.',
        areaGisTitle: 'GIS / Spatial Analysis',
        areaGisDescription: 'Geographic information, territorial analysis, mapping and spatial systems.',
        areaPlanningTitle: 'Urban Planning',
        areaPlanningDescription: 'Understanding cities through territory, mobility, land use and urban systems.',
        areaDesignTitle: 'Graphic Design',
        areaDesignDescription: 'Visual identity, communication systems, editorial design and visual thinking.',
        aboutSectionTitle: 'About',
        aboutTitle: 'Architecture is the axis. Other disciplines are instruments.',
        aboutParagraphOne: 'My practice sits at the intersection of architecture, spatial analysis, urban planning and visual communication.',
        aboutParagraphTwo: 'I use different tools and disciplines to understand space from different perspectives — from the scale of the building to the scale of the city.',
        aboutParagraphThree: 'GIS helps me analyse territory. Planning helps me understand urban systems. Design helps me communicate ideas. Architecture brings these perspectives together.',
        workTitle: 'Selected work',
        imagePlaceholder: 'IMAGE',
        projectMobilityCategory: 'GIS · URBAN ANALYSIS',
        projectMobilityTitle: 'Mobility Analysis — Nampula',
        projectMobilityDescription: 'Spatial analysis of mobility patterns, routes and urban connections.',
        projectSpatialCategory: 'URBAN PLANNING',
        projectSpatialTitle: 'Urban Spatial Study',
        projectSpatialDescription: 'Territorial analysis combining land use, density and spatial relationships.',
        projectArchitectureCategory: 'ARCHITECTURE',
        projectArchitectureTitle: 'Architectural Project',
        projectArchitectureDescription: 'Architectural exploration focused on space, movement and human experience.',
        projectIdentityCategory: 'GRAPHIC DESIGN',
        projectIdentityTitle: 'Visual Identity',
        projectIdentityDescription: 'Graphic systems developed to communicate ideas through visual language.',
        explorationsTitle: 'Explorations',
        explorationsIntro: 'Projects outside the conventional boundaries of architecture, used as experiments to understand space, perception and systems.',
        explorationWorldCategory: 'GAME DEVELOPMENT · URBAN STUDIES',
        explorationStoryCategory: 'CINEMA · INTERIOR · ATMOSPHERE',
        explorationMotionCategory: 'MOTION DESIGN · ARCHITECTURE',
        contactTitle: 'Contact',
        contactHeading: "Let's build something meaningful.",
        footerTagline: 'Architecture · Space · City · Design'
    },
    pt: {
        pageTitle: 'Chelton Samussone — Arquitetura · Espaço · Cidade · Design',
        pageDescription: 'Chelton Samussone — Arquitetura, análise espacial, planeamento urbano e design gráfico.',
        navWork: 'Projetos',
        navAbout: 'Sobre',
        navExplorations: 'Explorações',
        navContact: 'Contacto',
        heroLabel: 'ARQUITETURA · ESPAÇO · CIDADE · DESIGN',
        heroTitleFirst: 'Desenhar formas',
        heroTitleSecond: 'de compreender o espaço.',
        heroDescription: 'A arquitetura como eixo de prática, reunindo análise espacial, planeamento urbano e comunicação visual.',
        areasTitle: 'Áreas principais',
        areaArchitectureTitle: 'Arquitetura',
        areaArchitectureDescription: 'Desenho do espaço, pensamento arquitetónico e a relação entre pessoas, edifícios e lugar.',
        areaGisTitle: 'SIG / Análise espacial',
        areaGisDescription: 'Informação geográfica, análise territorial, cartografia e sistemas espaciais.',
        areaPlanningTitle: 'Planeamento urbano',
        areaPlanningDescription: 'Compreender as cidades através do território, da mobilidade, do uso do solo e dos sistemas urbanos.',
        areaDesignTitle: 'Design gráfico',
        areaDesignDescription: 'Identidade visual, sistemas de comunicação, design editorial e pensamento visual.',
        aboutSectionTitle: 'Sobre',
        aboutTitle: 'A arquitetura é o eixo. As outras disciplinas são instrumentos.',
        aboutParagraphOne: 'A minha prática situa-se no cruzamento entre a arquitetura, a análise espacial, o planeamento urbano e a comunicação visual.',
        aboutParagraphTwo: 'Recorro a diferentes ferramentas e disciplinas para compreender o espaço de várias perspetivas — da escala do edifício à escala da cidade.',
        aboutParagraphThree: 'Os SIG ajudam-me a analisar o território. O planeamento ajuda-me a compreender os sistemas urbanos. O design ajuda-me a comunicar ideias. A arquitetura reúne estas perspetivas.',
        workTitle: 'Projetos selecionados',
        imagePlaceholder: 'IMAGEM',
        projectMobilityCategory: 'SIG · ANÁLISE URBANA',
        projectMobilityTitle: 'Análise da mobilidade — Nampula',
        projectMobilityDescription: 'Análise espacial dos padrões de mobilidade, percursos e ligações urbanas.',
        projectSpatialCategory: 'PLANEAMENTO URBANO',
        projectSpatialTitle: 'Estudo espacial urbano',
        projectSpatialDescription: 'Análise territorial que combina o uso do solo, a densidade e as relações espaciais.',
        projectArchitectureCategory: 'ARQUITETURA',
        projectArchitectureTitle: 'Projeto de arquitetura',
        projectArchitectureDescription: 'Exploração arquitetónica centrada no espaço, no movimento e na experiência humana.',
        projectIdentityCategory: 'DESIGN GRÁFICO',
        projectIdentityTitle: 'Identidade visual',
        projectIdentityDescription: 'Sistemas gráficos desenvolvidos para comunicar ideias através da linguagem visual.',
        explorationsTitle: 'Explorações',
        explorationsIntro: 'Projetos fora dos limites convencionais da arquitetura, usados como experiências para compreender o espaço, a perceção e os sistemas.',
        explorationWorldCategory: 'DESENVOLVIMENTO DE JOGOS · ESTUDOS URBANOS',
        explorationStoryCategory: 'CINEMA · INTERIOR · ATMOSFERA',
        explorationMotionCategory: 'DESIGN DE MOVIMENTO · ARQUITETURA',
        contactTitle: 'Contacto',
        contactHeading: 'Vamos criar algo com significado.',
        footerTagline: 'Arquitetura · Espaço · Cidade · Design'
    }
};

function setLanguage(language) {
    const pageTranslations = translations[language];

    document.documentElement.lang = language === 'pt' ? 'pt-MZ' : 'en';

    document.querySelectorAll('[data-i18n]').forEach((element) => {
        const translation = pageTranslations[element.dataset.i18n];

        if (element instanceof HTMLMetaElement) {
            element.content = translation;
        } else {
            element.textContent = translation;
        }
    });

    const languageToggle = document.querySelector('.language-toggle');
    const nextLanguage = language === 'pt' ? 'en' : 'pt';
    languageToggle.textContent = nextLanguage.toUpperCase();
    languageToggle.setAttribute(
        'aria-label',
        nextLanguage === 'pt' ? 'Mudar idioma para português' : 'Switch language to English'
    );
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

const elements = document.querySelectorAll(
    '.area-card, .project, .exploration, .about-content'
);

const observer = new IntersectionObserver(
    (entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    },
    {
        threshold: 0.1
    }
);

elements.forEach((element) => {
    element.classList.add('reveal');
    observer.observe(element);
});
