// Contact form: client-side validation only (this static site has no backend).
(function () {
  const form = document.getElementById('contact-form');
  if (!form) return;
  const status = document.getElementById('form-status');
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!form.checkValidity()) {
      form.reportValidity();
      status.textContent = 'Please complete the highlighted fields.';
      return;
    }
    const name = form.elements.namedItem('name').value.trim();
    status.textContent = `Thank you, ${name}. A Contoso specialist will reply within two business days.`;
    form.reset();
  });
})();
