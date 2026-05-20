
function valideazaSiTrimite() {
    var valid = true;

    document.querySelectorAll('.error-msg').forEach(function(el) {
        el.style.display = 'none';
    });
    document.querySelectorAll('.form-group input, .form-group textarea, .form-group select').forEach(function(el) {
        el.style.borderColor = '#ccc';
    });

    var nume = document.getElementById('nume').value.trim();
    if (nume === '') {
        afisareEroare('err-nume', 'nume');
        valid = false;
    }

    var prenume = document.getElementById('prenume').value.trim();
    if (prenume === '') {
        afisareEroare('err-prenume', 'prenume');
        valid = false;
    }

    var email = document.getElementById('email').value.trim();
    var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        afisareEroare('err-email', 'email');
        valid = false;
    }

    var varstaVal = document.getElementById('varsta').value;
    if (varstaVal !== '') {
        var varsta = parseInt(varstaVal);
        if (isNaN(varsta) || varsta < 1 || varsta > 120) {
            afisareEroare('err-varsta', 'varsta');
            valid = false;
        }
    }

    var mesaj = document.getElementById('mesaj').value.trim();
    if (mesaj === '') {
        afisareEroare('err-mesaj', 'mesaj');
        valid = false;
    }

    if (valid) {
        document.getElementById('contactForm').submit();
    } else {

        var primaEroare = document.querySelector('.error-msg[style*="block"]');
        if (primaEroare) {
            primaEroare.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }
}

function afisareEroare(idEroare, idCamp) {
    var errEl = document.getElementById(idEroare);
    var campEl = document.getElementById(idCamp);
    if (errEl) errEl.style.display = 'block';
    if (campEl) campEl.style.borderColor = '#cc0000';
}

function reseteazaErori() {
    document.querySelectorAll('.error-msg').forEach(function(el) {
        el.style.display = 'none';
    });
    document.querySelectorAll('.form-group input, .form-group textarea, .form-group select').forEach(function(el) {
        el.style.borderColor = '#ccc';
    });
}

['nume', 'prenume', 'email', 'varsta', 'mesaj'].forEach(function(id) {
    var el = document.getElementById(id);
    if (!el) return;
    el.addEventListener('input', function() {
        el.style.borderColor = '#ccc';
        var errEl = document.getElementById('err-' + id);
        if (errEl) errEl.style.display = 'none';
    });
});
