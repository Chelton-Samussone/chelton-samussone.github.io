// =========================================
// SIMPLE SCROLL REVEAL
// =========================================

const elements = document.querySelectorAll(
    '.area-card, .project, .exploration, .about-content'
);

const observer = new IntersectionObserver(
    (entries) => {

        entries.forEach((entry) => {

            if (entry.isIntersecting) {

                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';

                observer.unobserve(entry.target);
            }

        });

    },
    {
        threshold: 0.1
    }
);


elements.forEach((element) => {

    element.style.opacity = '0';
    element.style.transform = 'translateY(30px)';
    element.style.transition =
        'opacity 0.7s ease, transform 0.7s ease';

    observer.observe(element);

});