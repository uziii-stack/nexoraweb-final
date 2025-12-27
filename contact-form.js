// 🔥 Inject CSS dynamically (animations + toast styles)
(function injectContactFormCSS() {
    if (document.getElementById("contact-form-css")) return;

    const style = document.createElement("style");
    style.id = "contact-form-css";
    style.innerHTML = `
    /* Form success animation */
    #contactForm.success {
      animation: successPop 0.4s ease-in-out;
    }
    @keyframes successPop {
      0% { transform: scale(1); }
      50% { transform: scale(1.03); }
      100% { transform: scale(1); }
    }

    /* Toast container */
    #contactFormToastContainer {
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 9999;
      display: flex;
      flex-direction: column;
      gap: 10px;
      max-width: 90%;
    }

    /* Toast notifications */
    .contactFormToast {
      padding: 15px 20px;
      border-radius: 8px;
      color: #fff;
      font-weight: 500;
      font-family: sans-serif;
      box-shadow: 0 4px 15px rgba(0,0,0,0.2);
      opacity: 0;
      transform: translateX(100%);
      transition: all 0.5s ease;
    }
    .contactFormToast.show {
      opacity: 1;
      transform: translateX(0);
    }
    .contactFormToast.success {
      background-color: #22c55e; /* green */
    }
    .contactFormToast.error {
      background-color: #ef4444; /* red */
    }

    /* Responsive fix */
    @media (max-width: 480px) {
      #contactFormToastContainer {
        top: 10px;
        right: 10px;
      }
      .contactFormToast {
        font-size: 14px;
      }
    }
  `;
    document.head.appendChild(style);
})();

// 🔥 Toast helper
function showContactFormToast(message, type = "success", duration = 3000) {
    let container = document.getElementById("contactFormToastContainer");
    if (!container) {
        container = document.createElement("div");
        container.id = "contactFormToastContainer";
        document.body.appendChild(container);
    }

    const toast = document.createElement("div");
    toast.className = `contactFormToast ${type}`;
    toast.innerText = message;
    container.appendChild(toast);

    setTimeout(() => toast.classList.add("show"), 50);

    setTimeout(() => {
        toast.classList.remove("show");
        setTimeout(() => toast.remove(), 500);
    }, duration);
}

// 🔥 Contact form logic
document.addEventListener("DOMContentLoaded", () => {
    // 🚨 NEW ACCOUNT PUBLIC KEY
    emailjs.init("7rkpnkxj9FdqjXuZx");

    const forms = document.querySelectorAll("form[id='contactForm']");

    forms.forEach((form) => {
        form.addEventListener("submit", (e) => {
            e.preventDefault();

            // Button fallback
            const btn = form.querySelector("button[type='submit']") || form.querySelector("button");
            if (!btn) return;

            const originalText = btn.innerHTML;
            btn.innerHTML = "Sending...";
            btn.disabled = true;

            const data = new FormData(form);

            // Normalize fields for EmailJS
            const templateParams = {
                user_name: data.get("user_name") || data.get("fullName") || data.get("name") || "Unknown",
                user_email: data.get("user_email") || data.get("email") || "Not provided",
                subject: data.get("subject") || "No Subject",
                message: data.get("message") || data.get("details") || "No message",
                page_url: window.location.href,
            };

            // Send email
            emailjs.send("service_d8txzcr", "template_1ne17a7", templateParams, "7rkpnkxj9FdqjXuZx")
                .then(() => {
                    btn.innerHTML = "Sent!";
                    form.reset();
                    form.classList.add("success");

                    showContactFormToast("Message sent successfully!", "success");

                    setTimeout(() => {
                        btn.innerHTML = originalText;
                        btn.disabled = false;
                        form.classList.remove("success");
                    }, 2000);
                })
                .catch(() => {
                    btn.innerHTML = "Failed to send";
                    showContactFormToast("Oops! Something went wrong. Please try again.", "error");

                    setTimeout(() => {
                        btn.innerHTML = originalText;
                        btn.disabled = false;
                    }, 2000);
                });
        });
    });
});
