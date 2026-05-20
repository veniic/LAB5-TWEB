/**
 * ROMANIA INTERACTIVE - AJAX ENGINE (LAB 5)
 * Implementare avansată conform cerințelor academice
 */

const RomaniaApp = (() => {
    // Starea aplicației (State management)
    let state = {
        score: 0,
        currentQuestionIndex: 0,
        questions: [],
        difficulty: 'medium', // Poate fi 'easy', 'medium', 'hard'
        isLoaded: false
    };

    // Configurații
    const CONFIG = {
        endpoint: 'server_handler.php',
        dataSource: 'date_romania.json',
        selectors: {
            quizContainer: '#quiz-container',
            infoBox: '#dynamic-info-box',
            imageSection: '.image-gallery',
            timeline: '#chisinau-timeline'
        }
    };

    // --- METODE PRIVATE (UTILITARE) ---

    const _fetch = async (params) => {
        const url = new URL(window.location.href);
        const query = new URLSearchParams(params).toString();
        
        try {
            const response = await fetch(`${CONFIG.endpoint}?${query}`);
            if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
            return await response.json();
        } catch (err) {
            _logError(err);
            return null;
        }
    };

    const _logError = (error) => {
        console.error("%c [AJAX Error] ", "background: red; color: white;", error);
        _showNotification("Eroare la comunicarea cu serverul!", "error");
    };

    const _showNotification = (msg, type) => {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.innerText = msg;
        document.body.appendChild(toast);
        setTimeout(() => toast.classList.add('visible'), 100);
        setTimeout(() => {
            toast.classList.remove('visible');
            setTimeout(() => toast.remove(), 500);
        }, 3500);
    };

    // --- LOGICA PENTRU IMAGINI (Sarcina 8) ---

    const initImageTooltips = async () => {
        const data = await fetch(CONFIG.dataSource).then(r => r.json());
        const images = document.querySelectorAll('img[data-ajax="true"]');

        images.forEach(img => {
            img.addEventListener('mouseenter', function(e) {
                const info = data.imagini.find(i => i.fisier === this.dataset.file);
                if (info) {
                    _renderTooltip(e, info);
                }
            });

            img.addEventListener('mouseleave', () => {
                const tt = document.querySelector('.ajax-tooltip');
                if (tt) tt.remove();
            });
        });
    };

    const _renderTooltip = (e, info) => {
        const tt = document.createElement('div');
        tt.className = 'ajax-tooltip';
        tt.innerHTML = `<h4>${info.titlu}</h4><p>${info.descriere}</p>`;
        tt.style.top = (e.pageY + 10) + 'px';
        tt.style.left = (e.pageX + 10) + 'px';
        document.body.appendChild(tt);
    };

    // --- LOGICA PENTRU QUIZ ADAPTIV (Sarcina 7, 12, 22) ---

    const loadQuiz = async () => {
        const quizData = await _fetch({ action: 'get_quiz', diff: state.difficulty });
        if (quizData) {
            state.questions = quizData;
            _renderQuestion();
        }
    };

    const _renderQuestion = () => {
        const container = document.querySelector(CONFIG.selectors.quizContainer);
        if (state.currentQuestionIndex >= state.questions.length) {
            container.innerHTML = `<h3>Test Finalizat! Scor: ${state.score}</h3>`;
            return;
        }

        const q = state.questions[state.currentQuestionIndex];
        container.innerHTML = `
            <div class="quiz-card">
                <p class="difficulty-tag">Dificultate: ${state.difficulty}</p>
                <h3>${q.intrebare}</h3>
                <div class="options">
                    ${q.optiuni.map(opt => `<button class="opt-btn" onclick="RomaniaApp.submitAnswer('${opt}')">${opt}</button>`).join('')}
                </div>
                <div id="quiz-feedback"></div>
            </div>
        `;
    };

    const submitAnswer = async (answer) => {
        const feedback = document.getElementById('quiz-feedback');
        const currentQ = state.questions[state.currentQuestionIndex];

        const result = await _fetch({ 
            action: 'check_answer', 
            id: currentQ.id, 
            ans: answer 
        });

        if (result.correct) {
            state.score++;
            state.difficulty = 'hard'; // Creștem dificultatea (Sarcina 22)
            feedback.innerHTML = `<span class="text-success">Corect! ${result.explicatie}</span>`;
            feedback.className = 'feedback-visible correct';
        } else {
            state.difficulty = 'easy'; // Scădem dificultatea
            feedback.innerHTML = `<span class="text-danger">Greșit. Sfat: ${result.explicatie}</span>`;
            feedback.className = 'feedback-visible wrong';
        }

        setTimeout(() => {
            state.currentQuestionIndex++;
            loadQuiz(); // Reîncărcăm quiz-ul cu noua dificultate
        }, 2500);
    };

    // --- CRONOLOGIE DINAMICĂ (Sarcina 17) ---

    const initTimeline = () => {
        const years = [1436, 1812, 1918, 1940, 1991];
        const nav = document.querySelector(CONFIG.selectors.timeline + ' .years-nav');
        
        years.forEach(year => {
            const btn = document.createElement('button');
            btn.innerText = year;
            btn.onclick = () => _fetchYearInfo(year);
            nav.appendChild(btn);
        });
    };

    const _fetchYearInfo = async (year) => {
        const display = document.querySelector('#year-content');
        display.innerHTML = '<div class="loader"></div>';
        
        const data = await _fetch({ action: 'get_history', year: year });
        if (data) {
            display.innerHTML = `<h3>Chișinău în ${year}</h3><p>${data.text}</p>`;
        }
    };

    // --- INIȚIALIZARE PUBLICĂ ---
    const init = () => {
        console.log("Sistemul AJAX a fost pornit...");
        initImageTooltips();
        loadQuiz();
        initTimeline();
        state.isLoaded = true;
    };

    return {
        init,
        submitAnswer
    };
})();

// Pornire aplicație
document.addEventListener('DOMContentLoaded', RomaniaApp.init);