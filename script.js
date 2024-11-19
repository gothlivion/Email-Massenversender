// Anleitung Modal anzeigen
const guideBtn = document.getElementById('guideBtn');
const guideModal = document.getElementById('guideModal');
const closeModal = document.querySelector('.close');

guideBtn.onclick = function() {
    guideModal.style.display = "block";
}

closeModal.onclick = function() {
    guideModal.style.display = "none";
}

window.onclick = function(event) {
    if (event.target == guideModal) {
        guideModal.style.display = "none";
    }
}

// Formular absenden und E-Mail versenden (AJAX-Request an den Server)
document.getElementById('emailForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const recipients = document.getElementById('recipients').value.split(',').map(item => item.trim());
    const subject = document.getElementById('subject').value;
    const message = document.getElementById('message').value;

    const attachments = document.getElementById('attachments').files;

    const formData = new FormData();
    formData.append('email', email);
    formData.append('password', password);
    formData.append('recipients', JSON.stringify(recipients));
    formData.append('subject', subject);
    formData.append('message', message);

    for (let i = 0; i < attachments.length; i++) {
        formData.append('attachments', attachments[i]);
    }

    fetch('/send-email', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        alert('E-Mails wurden erfolgreich gesendet!');
    })
    .catch(error => {
        alert('Fehler beim Senden der E-Mails.');
    });
});
