document.addEventListener("DOMContentLoaded", () => {
    const navLinks = document.querySelectorAll(".button-div");

    navLinks.forEach(link => {
        link.addEventListener("click", () => {
            const page = link.dataset.page;
            window.location.href = `${page}/${page}.html`;
        });
    });

    const toggleButton = document.getElementById("menu-toggle");
    const navMenu = document.getElementById("nav-links");

    toggleButton.addEventListener("click", () => {
        navMenu.classList.toggle("active");
    });
});
