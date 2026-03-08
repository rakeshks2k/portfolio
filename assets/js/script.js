'use strict';



// element toggle function
const elementToggleFunc = function (elem) { elem.classList.toggle("active"); }



// sidebar variables
const sidebar = document.querySelector("[data-sidebar]");
const sidebarBtn = document.querySelector("[data-sidebar-btn]");

// sidebar toggle functionality for mobile
sidebarBtn.addEventListener("click", function () { elementToggleFunc(sidebar); });





// ===== Portfolio Filter =====

const portfolioSelect = document.querySelector("[data-portfolio-select]");
const portfolioSelectValue = document.querySelector("[data-portfolio-select-value]");
const portfolioFilterBtns = document.querySelectorAll("[data-portfolio-filter-btn]");
const portfolioItems = document.querySelectorAll("[data-portfolio-item]");

if (portfolioSelect) {
  portfolioSelect.addEventListener("click", function () { elementToggleFunc(this); });
}

portfolioFilterBtns.forEach(btn => {
  btn.addEventListener("click", function () {
    const selectedValue = this.innerText.toLowerCase();
    if (portfolioSelectValue) portfolioSelectValue.innerText = this.innerText;

    portfolioItems.forEach(item => {
      if (selectedValue === "all" || selectedValue === item.dataset.category) {
        item.classList.add("active");
      } else {
        item.classList.remove("active");
      }
    });

    portfolioFilterBtns.forEach(b => b.classList.remove("active"));
    this.classList.add("active");

    if (portfolioSelect) portfolioSelect.classList.remove("active");
  });
});


// ===== Certification Filter =====

const certSelect = document.querySelector("[data-cert-select]");
const certSelectValue = document.querySelector("[data-cert-select-value]");
const certFilterBtns = document.querySelectorAll("[data-cert-filter-btn]");
const certItems = document.querySelectorAll("[data-cert-item]");

if (certSelect) {
  certSelect.addEventListener("click", function () { elementToggleFunc(this); });
}

certFilterBtns.forEach(btn => {
  btn.addEventListener("click", function () {
    const selectedValue = this.innerText.toLowerCase();
    if (certSelectValue) certSelectValue.innerText = this.innerText;

    certItems.forEach(item => {
      if (selectedValue === "all" || selectedValue === item.dataset.category) {
        item.classList.add("active");
      } else {
        item.classList.remove("active");
      }
    });

    certFilterBtns.forEach(b => b.classList.remove("active"));
    this.classList.add("active");

    if (certSelect) certSelect.classList.remove("active");
  });
});


// contact form variables
const form = document.querySelector("[data-form]");
const formInputs = document.querySelectorAll("[data-form-input]");
const formBtn = document.querySelector("[data-form-btn]");

// add event to all form input field
formInputs.forEach(input => {
  input.addEventListener("input", function () {
    // check form validation
    if (form.checkValidity()) {
      formBtn.removeAttribute("disabled");
    } else {
      formBtn.setAttribute("disabled", "");
    }
  });
});

// email validation
const emailInput = document.querySelector("[name='email']");
const emailError = document.getElementById("email-error");

if (emailInput && emailError) {
  emailInput.addEventListener("blur", function () {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (emailInput.value.trim() !== "" && !emailPattern.test(emailInput.value.trim())) {
      emailError.innerText = "Oops! Please enter a valid email address.";
      emailError.style.display = "block";
    } else {
      emailError.style.display = "none";
    }
  });
}


// contact form submission
if (form) {
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
}



// page navigation variables
const navigationLinks = document.querySelectorAll("[data-nav-link]");
const pages = document.querySelectorAll("[data-page]");

// add event to all nav link
navigationLinks.forEach(link => {
  link.addEventListener("click", function () {
    const targetPage = this.textContent.toLowerCase().trim();

    pages.forEach(page => {
      if (targetPage === page.dataset.page) {
        page.classList.add("active");
        window.scrollTo(0, 0);
      } else {
        page.classList.remove("active");
      }
    });

    // Handle Nav Link Active State
    navigationLinks.forEach(link => link.classList.remove("active"));
    this.classList.add("active");
  });
});