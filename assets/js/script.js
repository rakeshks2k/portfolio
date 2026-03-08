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


filterBtns.forEach(btn => {

  btn.addEventListener("click", () => {

    const selectedValue = btn.innerText.toLowerCase();

    selectValues.forEach(value => {
      value.innerText = btn.innerText;
    });

    filterFunc(selectedValue);

    // Remove active class from all filter buttons in the current section
    const parentSection = btn.closest("article");
    if (parentSection) {
      const sectionBtns = parentSection.querySelectorAll("[data-filter-btn]");
      sectionBtns.forEach(b => b.classList.remove("active"));
    }

    btn.classList.add("active");

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

// email validation
const emailInput = document.querySelector("[name='email']");
const emailError = document.getElementById("email-error");

if (emailInput && emailError) {
  emailInput.addEventListener("blur", function () {
    if (emailInput.value.trim() !== "" && !emailInput.validity.valid) {
      emailError.innerText = "Oops! Please enter a valid email address.";
      emailError.style.display = "block";
    } else {
      emailError.style.display = "none";
    }
  });
}


// contact form submission
form.addEventListener("submit", function (e) {
  e.preventDefault();
  const formData = new FormData(form);

  fetch(form.action, {
    method: form.method,
    body: formData,
    headers: {
      'Accept': 'application/json'
    }
  }).then(response => {
    if (response.ok) {
      form.reset();
      formBtn.setAttribute("disabled", "");
      formBtn.classList.add("success");

      const icon = formBtn.querySelector("ion-icon");
      if (icon) icon.style.display = "none";

      const btnText = formBtn.querySelector("span");
      if (btnText) btnText.innerText = "Sent \u2713";
    } else {
      alert("There was a problem submitting your form.");
    }
  }).catch(error => {
    alert("There was a problem submitting your form.");
  });
});



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