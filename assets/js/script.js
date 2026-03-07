'use strict';



// element toggle function
const elementToggleFunc = function (elem) { elem.classList.toggle("active"); }



// sidebar variables
const sidebar = document.querySelector("[data-sidebar]");
const sidebarBtn = document.querySelector("[data-sidebar-btn]");

// sidebar toggle functionality for mobile
sidebarBtn.addEventListener("click", function () { elementToggleFunc(sidebar); });





// ===== Custom Select (Stable Mobile + Desktop Filter) =====

// Elements
const selects = document.querySelectorAll("[data-select]");
const selectItems = document.querySelectorAll("[data-select-item]");
const selectValues = document.querySelectorAll("[data-selecct-value]");
const filterBtns = document.querySelectorAll("[data-filter-btn]");
const filterItems = document.querySelectorAll("[data-filter-item]");


// Toggle dropdowns
selects.forEach(select => {
  select.addEventListener("click", () => {
    select.classList.toggle("active");
  });
});


// Filter function
function filterFunc(value) {

  filterItems.forEach(item => {

    if (value === "all" || value === item.dataset.category) {
      item.classList.add("active");
    } else {
      item.classList.remove("active");
    }

  });

}


// Dropdown selection
selectItems.forEach(item => {

  item.addEventListener("click", () => {

    const selectedValue = item.innerText.toLowerCase();

    selectValues.forEach(value => {
      value.innerText = item.innerText;
    });

    filterFunc(selectedValue);

    // close dropdowns (important for mobile)
    selects.forEach(select => {
      select.classList.remove("active");
    });

  });

});


// Desktop filter buttons (safe handling)
let lastClickedBtn = null;

filterBtns.forEach(btn => {

  btn.addEventListener("click", () => {

    const selectedValue = btn.innerText.toLowerCase();

    selectValues.forEach(value => {
      value.innerText = btn.innerText;
    });

    filterFunc(selectedValue);

    if (lastClickedBtn) {
      lastClickedBtn.classList.remove("active");
    }

    btn.classList.add("active");
    lastClickedBtn = btn;

  });

});


// contact form variables
const form = document.querySelector("[data-form]");
const formInputs = document.querySelectorAll("[data-form-input]");
const formBtn = document.querySelector("[data-form-btn]");

// add event to all form input field
for (let i = 0; i < formInputs.length; i++) {
  formInputs[i].addEventListener("input", function () {

    // check form validation
    if (form.checkValidity()) {
      formBtn.removeAttribute("disabled");
    } else {
      formBtn.setAttribute("disabled", "");
    }

  });
}



// page navigation variables
const navigationLinks = document.querySelectorAll("[data-nav-link]");
const pages = document.querySelectorAll("[data-page]");

// add event to all nav link
for (let i = 0; i < navigationLinks.length; i++) {
  navigationLinks[i].addEventListener("click", function () {

    for (let i = 0; i < pages.length; i++) {
      if (this.innerHTML.toLowerCase() === pages[i].dataset.page) {
        pages[i].classList.add("active");
        navigationLinks[i].classList.add("active");
        window.scrollTo(0, 0);
      } else {
        pages[i].classList.remove("active");
        navigationLinks[i].classList.remove("active");
      }
    }

  });
}