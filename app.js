document.addEventListener('DOMContentLoaded', () => {

    // ── 1. Sticky Header scroll behavior ─────────────────────────────────────
    const header = document.querySelector('.header');
    
    function handleScroll() {
        if (header) {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        }
    }
    
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check


    // ── 2. Mobile Nav Drawer Toggle ──────────────────────────────────────────
    const menuToggle = document.getElementById('menuToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('open');
            navMenu.classList.toggle('open');
        });

        // Close menu when clicking links
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                menuToggle.classList.remove('open');
                navMenu.classList.remove('open');
            });
        });
    }


    // ── 3. Scroll Reveal Animations (Intersection Observer) ─────────────────
    if ('IntersectionObserver' in window) {
        const revealElements = document.querySelectorAll('.feature-card, .sandbox-card, .tech-card, .section-header, .cta-card');
        
        revealElements.forEach(el => el.classList.add('reveal'));

        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    observer.unobserve(entry.target); // Reveal only once
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -40px 0px'
        });

        revealElements.forEach(el => revealObserver.observe(el));
    }


    // ── 4. Interactive Live Pomodoro Timer Playground ───────────────────────
    const timerDisplay = document.getElementById('timerDisplay');
    const timerStartBtn = document.getElementById('timerStartBtn');
    const timerResetBtn = document.getElementById('timerResetBtn');
    const modeButtons = document.querySelectorAll('.timer-mode-btn');

    let timerInterval = null;
    let timerRunning = false;
    let currentMode = 'focus'; // focus, shortBreak, longBreak
    let timeLeft = 25 * 60; // 25 minutes default

    const modeTimes = {
        focus: 25 * 60,
        shortBreak: 5 * 60,
        longBreak: 15 * 60
    };

    const modeColors = {
        focus: 'var(--color-timer-focus)',
        shortBreak: 'var(--color-timer-short)',
        longBreak: 'var(--color-timer-long)'
    };

    function updateTimerDisplay() {
        if (!timerDisplay) return;
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }

    function switchTimerMode(mode) {
        currentMode = mode;
        timeLeft = modeTimes[mode];
        
        modeButtons.forEach(btn => {
            if (btn.dataset.mode === mode) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });

        if (timerDisplay) {
            timerDisplay.style.color = modeColors[mode];
            updateTimerDisplay();
        }

        if (timerRunning) {
            pauseTimer();
        }
    }

    function startTimer() {
        if (timerRunning || !timerStartBtn) return;
        
        timerRunning = true;
        timerStartBtn.textContent = 'Pause';
        timerStartBtn.style.backgroundColor = '#64748b';
        
        timerInterval = setInterval(() => {
            if (timeLeft > 0) {
                timeLeft--;
                updateTimerDisplay();
            } else {
                clearInterval(timerInterval);
                timerRunning = false;
                timerStartBtn.textContent = 'Start';
                timerStartBtn.style.backgroundColor = 'var(--color-primary)';
                alert(currentMode === 'focus' ? 'Focus time completed! Take a break.' : 'Break finished! Back to work.');
                resetTimer();
            }
        }, 1000);
    }

    function pauseTimer() {
        if (!timerRunning || !timerStartBtn) return;
        clearInterval(timerInterval);
        timerRunning = false;
        timerStartBtn.textContent = 'Start';
        timerStartBtn.style.backgroundColor = 'var(--color-primary)';
    }

    function resetTimer() {
        pauseTimer();
        timeLeft = modeTimes[currentMode];
        updateTimerDisplay();
    }

    if (timerStartBtn && timerResetBtn) {
        modeButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                switchTimerMode(btn.dataset.mode);
            });
        });

        timerStartBtn.addEventListener('click', () => {
            if (timerRunning) {
                pauseTimer();
            } else {
                startTimer();
            }
        });

        timerResetBtn.addEventListener('click', resetTimer);
        switchTimerMode('focus');
    }


    // ── 5. Interactive Live Module Organizer Playground ──────────────────────
    const sandboxModuleInput = document.getElementById('sandboxModuleInput');
    const sandboxModuleAddBtn = document.getElementById('sandboxModuleAddBtn');
    const sandboxModuleList = document.getElementById('sandboxModuleList');

    let mockModules = [
        { id: 1, name: 'Computer Architecture', notes: 14, papers: 8 },
        { id: 2, name: 'Discrete Math', notes: 9, papers: 5 }
    ];

    function renderModules() {
        if (!sandboxModuleList) return;
        
        sandboxModuleList.innerHTML = '';
        
        if (mockModules.length === 0) {
            sandboxModuleList.innerHTML = `<li class="todo-item" style="justify-content: center; color: var(--color-text-light); font-style: italic;">No modules. Create your first folder above.</li>`;
            return;
        }

        mockModules.forEach(mod => {
            const li = document.createElement('li');
            li.className = 'todo-item'; // reuse items styling
            li.style.borderLeft = '3px solid var(--color-primary)';
            
            li.innerHTML = `
                <div style="display: flex; align-items: center; gap: 10px; flex-grow: 1;">
                    <svg style="width: 16px; height: 16px; color: var(--color-primary);" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"></path></svg>
                    <span style="font-weight: 700; color: var(--color-text-dark);">${mod.name}</span>
                </div>
                <div style="display: flex; align-items: center; gap: 8px;">
                    <span style="font-size: 11px; background-color: rgba(59,130,246,0.06); color: var(--color-primary); padding: 2px 6px; border-radius: 4px; font-weight: 600;">Notes: ${mod.notes}</span>
                    <button class="todo-delete-btn delete-module-btn" data-id="${mod.id}" style="font-weight: bold; font-size: 12px; margin-left: 4px;" aria-label="Delete module">✕</button>
                </div>
            `;
            sandboxModuleList.appendChild(li);
        });
    }

    function addModule() {
        if (!sandboxModuleInput) return;
        const name = sandboxModuleInput.value.trim();
        if (name) {
            const newModule = {
                id: Date.now(),
                name: name,
                notes: 0,
                papers: 0
            };
            mockModules.push(newModule);
            sandboxModuleInput.value = '';
            renderModules();
        }
    }

    function deleteModule(id) {
        mockModules = mockModules.filter(m => m.id !== id);
        renderModules();
    }

    if (sandboxModuleAddBtn && sandboxModuleInput) {
        sandboxModuleAddBtn.addEventListener('click', addModule);
        
        sandboxModuleInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                addModule();
            }
        });

        sandboxModuleList.addEventListener('click', (e) => {
            if (e.target.classList.contains('delete-module-btn')) {
                const moduleId = parseInt(e.target.dataset.id);
                deleteModule(moduleId);
            }
        });

        renderModules();
    }


    // ── 5.5 Interactive Live Task Checklist Playground ──────────────────────
    const sandboxTaskInput = document.getElementById('sandboxTaskInput');
    const sandboxTaskAddBtn = document.getElementById('sandboxTaskAddBtn');
    const sandboxTaskList = document.getElementById('sandboxTaskList');

    let mockTasks = [
        { id: 1, text: 'Complete Web Dev lab sheet', completed: true },
        { id: 2, text: 'Read Chapter 4 of Architecture textbook', completed: false }
    ];

    function renderTasks() {
        if (!sandboxTaskList) return;
        
        sandboxTaskList.innerHTML = '';
        
        if (mockTasks.length === 0) {
            sandboxTaskList.innerHTML = `<li class="todo-item" style="justify-content: center; color: var(--color-text-light); font-style: italic;">No tasks. Create a study task above!</li>`;
            return;
        }

        mockTasks.forEach(task => {
            const li = document.createElement('li');
            li.className = 'todo-item';
            
            li.innerHTML = `
                <label class="todo-item-label">
                    <input type="checkbox" class="task-checkbox" data-id="${task.id}" ${task.completed ? 'checked' : ''}>
                    <span class="todo-text ${task.completed ? 'completed' : ''}">${task.text}</span>
                </label>
                <button class="todo-delete-btn delete-task-btn" data-id="${task.id}" aria-label="Delete task">✕</button>
            `;
            sandboxTaskList.appendChild(li);
        });
    }

    function addTask() {
        if (!sandboxTaskInput) return;
        const text = sandboxTaskInput.value.trim();
        if (text) {
            const newTask = {
                id: Date.now(),
                text: text,
                completed: false
            };
            mockTasks.push(newTask);
            sandboxTaskInput.value = '';
            renderTasks();
        }
    }

    function toggleTask(id) {
        mockTasks = mockTasks.map(t => {
            if (t.id === id) {
                return { ...t, completed: !t.completed };
            }
            return t;
        });
        renderTasks();
    }

    function deleteTask(id) {
        mockTasks = mockTasks.filter(t => t.id !== id);
        renderTasks();
    }

    if (sandboxTaskAddBtn && sandboxTaskInput) {
        sandboxTaskAddBtn.addEventListener('click', addTask);
        
        sandboxTaskInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                addTask();
            }
        });

        sandboxTaskList.addEventListener('change', (e) => {
            if (e.target.classList.contains('task-checkbox')) {
                const taskId = parseInt(e.target.dataset.id);
                toggleTask(taskId);
            }
        });

        sandboxTaskList.addEventListener('click', (e) => {
            if (e.target.classList.contains('delete-task-btn')) {
                const taskId = parseInt(e.target.dataset.id);
                deleteTask(taskId);
            }
        });

        renderTasks();
    }


    // ── 6. Interactive Live AI Tutor Chat Simulator ──────────────────────────
    const sandboxChatMessages = document.getElementById('sandboxChatMessages');
    const sandboxChatInput = document.getElementById('sandboxChatInput');
    const sandboxChatSendBtn = document.getElementById('sandboxChatSendBtn');
    const sandboxChips = document.querySelectorAll('.sandbox-chip');

    let chatHistory = [
        { role: 'ai', text: 'Hello! I am your AI Study Assistant. Select a document from your modules or click a quick suggestion below to try a demo query.' }
    ];

    function renderChat() {
        if (!sandboxChatMessages) return;
        sandboxChatMessages.innerHTML = '';

        chatHistory.forEach(msg => {
            const div = document.createElement('div');
            div.className = `sandbox-msg ${msg.role}`;
            div.innerHTML = msg.text;
            sandboxChatMessages.appendChild(div);
        });

        // Auto scroll to bottom
        sandboxChatMessages.scrollTop = sandboxChatMessages.scrollHeight;
    }

    function triggerMockResponse(query) {
        let text = query.toLowerCase();
        let aiResponseText = '';

        if (text.includes('quiz') || text.includes('mcq')) {
            aiResponseText = `Here is a practice MCQ based on your Discrete Math notes:<br/><br/>` +
                             `<strong>Q1. If A = {1, 2} and B = {2, 3}, what is A ∩ B?</strong><br/>` +
                             `A. {1, 2, 3}<br/>` +
                             `B. {2}<br/>` +
                             `C. {1, 3}<br/><br/>` +
                             `<em>NoteBase auto-calculates correct scores instantly in the real app!</em>`;
        } else if (text.includes('summarize') || text.includes('summary')) {
            aiResponseText = `Here is a quick summary of key concepts in Web Development:<br/><br/>` +
                             `• <strong>Semantic HTML</strong>: Structuring web documents using meaningful tags (article, section, header).<br/>` +
                             `• <strong>CSS Variables</strong>: Storing theme tokens globally to avoid code repetition.<br/>` +
                             `• <strong>DOM Manipulation</strong>: Direct access and editing of visual elements using vanilla Javascript.`;
        } else {
            aiResponseText = `That is a great study question! In NoteBase, the AI Study Tutor reads your uploaded PDFs and typed notes to deliver precise, context-driven answers. Sign up to experience the full features!`;
        }

        // Show typing indicator
        const loadingDiv = document.createElement('div');
        loadingDiv.className = 'sandbox-msg loading';
        loadingDiv.textContent = 'AI is writing...';
        sandboxChatMessages.appendChild(loadingDiv);
        sandboxChatMessages.scrollTop = sandboxChatMessages.scrollHeight;

        setTimeout(() => {
            // Remove typing indicator
            if (loadingDiv.parentNode) {
                loadingDiv.parentNode.removeChild(loadingDiv);
            }
            
            chatHistory.push({ role: 'ai', text: aiResponseText });
            renderChat();
        }, 1200);
    }

    function sendChatMessage() {
        if (!sandboxChatInput) return;
        const query = sandboxChatInput.value.trim();
        if (query) {
            chatHistory.push({ role: 'user', text: query });
            renderChat();
            sandboxChatInput.value = '';
            triggerMockResponse(query);
        }
    }

    if (sandboxChatSendBtn && sandboxChatInput) {
        sandboxChatSendBtn.addEventListener('click', sendChatMessage);

        sandboxChatInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                sendChatMessage();
            }
        });

        sandboxChips.forEach(chip => {
            chip.addEventListener('click', () => {
                const prompt = chip.dataset.prompt;
                chatHistory.push({ role: 'user', text: prompt });
                renderChat();
                triggerMockResponse(prompt);
            });
        });

        renderChat();
    }

});
