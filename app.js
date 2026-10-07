/* ==========================================================================
   PYTHON SYNTAX LAB - JAVASCRIPT
   Interactive Educational Logic & Progress System
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    
    // ==========================================
    // STATE MANAGEMENT & NAVIGATION
    // ==========================================
    let activeSection = 1;
    let completedSections = new Set();
    const TOTAL_SECTIONS = 13; // 1 to 13

    // ==========================================
    // THEME MANAGEMENT (DARK / LIGHT MODE)
    // ==========================================
    const themeToggleBtn = document.getElementById('theme-toggle-btn');
    let currentTheme = 'light';

    try {
        const savedTheme = localStorage.getItem('python_lab_theme');
        if (savedTheme) {
            currentTheme = savedTheme;
        } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            currentTheme = 'dark';
        }
    } catch(e) {}

    function applyTheme(theme) {
        currentTheme = theme;
        if (theme === 'dark') {
            document.documentElement.setAttribute('data-theme', 'dark');
            if (themeToggleBtn) themeToggleBtn.textContent = '☀️ Light Mode';
        } else {
            document.documentElement.removeAttribute('data-theme');
            if (themeToggleBtn) themeToggleBtn.textContent = '🌙 Dark Mode';
        }
        try {
            localStorage.setItem('python_lab_theme', theme);
        } catch(e) {}
    }

    applyTheme(currentTheme);

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            const newTheme = (currentTheme === 'dark') ? 'light' : 'dark';
            applyTheme(newTheme);
        });
    }

    // Load progress from localStorage if present
    try {
        const savedProgress = localStorage.getItem('python_lab_progress');
        if (savedProgress) {
            completedSections = new Set(JSON.parse(savedProgress));
        }
    } catch (e) {
        console.warn('LocalStorage not available');
    }

    function updateProgressUI() {
        const count = completedSections.size;
        const progressFill = document.getElementById('progress-fill');
        const progressText = document.getElementById('progress-text');
        
        const pct = Math.min(100, Math.round((count / TOTAL_SECTIONS) * 100));
        if (progressFill) progressFill.style.width = `${pct}%`;
        if (progressText) progressText.textContent = `${count} / ${TOTAL_SECTIONS} Sections`;

        // Save state
        try {
            localStorage.setItem('python_lab_progress', JSON.stringify(Array.from(completedSections)));
        } catch (e) {}
    }

    function markSectionComplete(sectionNum) {
        if (sectionNum >= 1 && sectionNum <= TOTAL_SECTIONS) {
            completedSections.add(sectionNum);
            updateProgressUI();
            
            // Highlight nav button
            const navBtn = document.querySelector(`.nav-btn[data-section="${sectionNum}"]`);
            if (navBtn) {
                navBtn.classList.add('done');
            }
        }
    }

    function showSection(sectionNum) {
        activeSection = sectionNum;
        
        // Hide all sections
        document.querySelectorAll('.lab-section').forEach(sec => {
            sec.classList.remove('active');
        });

        // Show target section
        const targetSec = document.getElementById(`section-${sectionNum}`);
        if (targetSec) {
            targetSec.classList.add('active');
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }

        // Update nav active button
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.classList.remove('active');
            if (parseInt(btn.getAttribute('data-section')) === sectionNum) {
                btn.classList.add('active');
            }
        });
    }

    // Attach click listener to Section Nav buttons
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const secNum = parseInt(btn.getAttribute('data-section'));
            showSection(secNum);
        });
    });

    // Attach click listener to Next Section buttons
    document.querySelectorAll('.next-section-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const nextNum = parseInt(btn.getAttribute('data-next'));
            markSectionComplete(nextNum - 1);
            showSection(nextNum);
        });
    });

    // Reset progress button
    const resetProgressBtn = document.getElementById('reset-progress-btn');
    if (resetProgressBtn) {
        resetProgressBtn.addEventListener('click', () => {
            if (confirm('Are you sure you want to reset your lab progress?')) {
                completedSections.clear();
                try { localStorage.removeItem('python_lab_progress'); } catch(e){}
                updateProgressUI();
                document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('done'));
                showSection(1);
            }
        });
    }

    const restartLabBtn = document.getElementById('restart-lab-btn');
    if (restartLabBtn) {
        restartLabBtn.addEventListener('click', () => {
            showSection(1);
        });
    }

    // ==========================================
    // SECTION 1: RECAP ("Wake Up Your Programmer Brain")
    // ==========================================
    const recapData = [
        { val: '"Manu"', type: 'STRING', explain: 'Values inside quotation marks are always STRINGS.' },
        { val: '42', type: 'INTEGER', explain: '42 is a whole number without quotes, so it is an INTEGER.' },
        { val: '3.14', type: 'FLOAT', explain: '3.14 has a decimal point, making it a FLOAT.' },
        { val: 'True', type: 'BOOLEAN', explain: 'True (without quotes) is a BOOLEAN value (True or False).' },
        { val: '"42"', type: 'STRING', explain: 'Notice the quotes! "42" is inside quotes, so Python sees it as a STRING, not a number!' },
        { val: 'False', type: 'BOOLEAN', explain: 'False is a BOOLEAN logic value.' },
        { val: '18', type: 'INTEGER', explain: '18 is a whole number (INTEGER).' },
        { val: '9.99', type: 'FLOAT', explain: '9.99 has a decimal point, so it is a FLOAT.' }
    ];

    let recapIndex = 0;

    function renderRecapQuestion() {
        const item = recapData[recapIndex];
        const counterEl = document.getElementById('recap-counter');
        const valEl = document.getElementById('recap-current-val');
        const feedbackEl = document.getElementById('recap-feedback');
        
        if (counterEl) counterEl.textContent = `Question ${recapIndex + 1} of ${recapData.length}`;
        if (valEl) valEl.textContent = item.val;
        if (feedbackEl) {
            feedbackEl.className = 'feedback-box hidden';
            feedbackEl.innerHTML = '';
        }

        // Highlight box for "42" vs 42
        const highlightBox = document.getElementById('recap-highlight-box');
        if (highlightBox) {
            if (item.val === '"42"' || item.val === '42') {
                highlightBox.classList.remove('hidden');
            }
        }
    }

    const recapOptions = document.getElementById('recap-options');
    if (recapOptions) {
        recapOptions.querySelectorAll('button').forEach(btn => {
            btn.addEventListener('click', () => {
                const selectedType = btn.getAttribute('data-type');
                const currentItem = recapData[recapIndex];
                const feedbackEl = document.getElementById('recap-feedback');

                if (selectedType === currentItem.type) {
                    feedbackEl.className = 'feedback-box correct';
                    feedbackEl.innerHTML = `✅ <strong>Correct!</strong> ${currentItem.explain}`;
                    
                    setTimeout(() => {
                        if (recapIndex < recapData.length - 1) {
                            recapIndex++;
                            renderRecapQuestion();
                        } else {
                            feedbackEl.className = 'feedback-box correct';
                            feedbackEl.innerHTML = `🎉 <strong>Recap Completed!</strong> You identified all 8 data types. Click Next to continue.`;
                            markSectionComplete(1);
                        }
                    }, 1400);

                } else {
                    feedbackEl.className = 'feedback-box wrong';
                    feedbackEl.innerHTML = `❌ <strong>Not quite!</strong> ${btn.textContent} is not correct for <code>${currentItem.val}</code>. Hint: Check if it has quotes, decimal points, or True/False.`;
                }
            });
        });
    }

    renderRecapQuestion();

    // ==========================================
    // SECTION 2: VARIABLE BUILDER
    // ==========================================
    const checkMatchingBtn = document.getElementById('check-matching-btn');
    if (checkMatchingBtn) {
        checkMatchingBtn.addEventListener('click', () => {
            const rowNameVal = document.querySelector('.matching-row[data-var="name"] .match-val').value;
            const rowNameType = document.querySelector('.matching-row[data-var="name"] .match-type').value;

            const rowAgeVal = document.querySelector('.matching-row[data-var="age"] .match-val').value;
            const rowAgeType = document.querySelector('.matching-row[data-var="age"] .match-type').value;

            const rowScoreVal = document.querySelector('.matching-row[data-var="score"] .match-val').value;
            const rowScoreType = document.querySelector('.matching-row[data-var="score"] .match-type').value;

            const feedbackEl = document.getElementById('matching-feedback');

            if (rowNameVal === '"Alex"' && rowNameType === 'string' &&
                rowAgeVal === '17' && rowAgeType === 'integer' &&
                rowScoreVal === '10' && rowScoreType === 'integer') {
                
                feedbackEl.className = 'feedback-box correct';
                feedbackEl.innerHTML = `✅ <strong>Spot on!</strong> <code>name</code> = "Alex" (string), <code>age</code> = 17 (integer), and <code>score</code> = 10 (integer).`;
                markSectionComplete(2);
            } else {
                feedbackEl.className = 'feedback-box wrong';
                feedbackEl.innerHTML = `❌ <strong>Check your matches again:</strong><br>
                - <code>name</code> should be <strong>"Alex"</strong> (string)<br>
                - <code>age</code> should be <strong>17</strong> (integer)<br>
                - <code>score</code> should be <strong>10</strong> (integer)`;
            }
        });
    }

    // Variable Rules Questions
    const varRuleQ1 = document.getElementById('var-rule-q1');
    if (varRuleQ1) {
        varRuleQ1.querySelectorAll('button').forEach(btn => {
            btn.addEventListener('click', () => {
                const ans = btn.getAttribute('data-answer');
                const fb = document.getElementById('var-rule-q1-feedback');
                if (ans === 'no') {
                    fb.className = 'feedback-box correct';
                    fb.innerHTML = `✅ <strong>Correct!</strong> Variable names CANNOT contain spaces. You should use an underscore: <code>student_name = "Alex"</code>.`;
                } else {
                    fb.className = 'feedback-box wrong';
                    fb.innerHTML = `❌ <strong>Incorrect.</strong> <code>student name</code> has a space between words, which causes a Python syntax error!`;
                }
            });
        });
    }

    const varRuleQ2 = document.getElementById('var-rule-q2');
    if (varRuleQ2) {
        varRuleQ2.querySelectorAll('button').forEach(btn => {
            btn.addEventListener('click', () => {
                const ans = btn.getAttribute('data-answer');
                const fb = document.getElementById('var-rule-q2-feedback');
                if (ans === 'B') {
                    fb.className = 'feedback-box correct';
                    fb.innerHTML = `✅ <strong>Correct!</strong> <code>student_age</code> clearly describes what the variable stores. Single letters like <code>x</code> make code confusing to read!`;
                    markSectionComplete(2);
                } else {
                    fb.className = 'feedback-box wrong';
                    fb.innerHTML = `❌ <strong>Think about readability:</strong> <code>x</code> doesn't explain what the value represents. <code>student_age</code> is much clearer!`;
                }
            });
        });
    }

    // ==========================================
    // SECTION 3: REORDER CODE (IPO FLOW)
    // ==========================================
    const ipoList = document.getElementById('ipo-draggable-list');
    let draggedItem = null;

    if (ipoList) {
        ipoList.addEventListener('dragstart', (e) => {
            if (e.target.classList.contains('drag-item')) {
                draggedItem = e.target;
                e.target.classList.add('dragging');
            }
        });

        ipoList.addEventListener('dragend', (e) => {
            if (e.target.classList.contains('drag-item')) {
                e.target.classList.remove('dragging');
                draggedItem = null;
            }
        });

        ipoList.addEventListener('dragover', (e) => {
            e.preventDefault();
            const afterElement = getDragAfterElement(ipoList, e.clientY);
            if (afterElement == null) {
                ipoList.appendChild(draggedItem);
            } else {
                ipoList.insertBefore(draggedItem, afterElement);
            }
        });
    }

    function getDragAfterElement(container, y) {
        const draggableElements = [...container.querySelectorAll('.drag-item:not(.dragging)')];
        return draggableElements.reduce((closest, child) => {
            const box = child.getBoundingClientRect();
            const offset = y - box.top - box.height / 2;
            if (offset < 0 && offset > closest.offset) {
                return { offset: offset, element: child };
            } else {
                return closest;
            }
        }, { offset: Number.NEGATIVE_INFINITY }).element;
    }

    // Check IPO Order
    const checkIpoBtn = document.getElementById('check-ipo-order');
    if (checkIpoBtn) {
        checkIpoBtn.addEventListener('click', () => {
            const currentItems = [...document.querySelectorAll('#ipo-draggable-list .drag-item')];
            const currentIds = currentItems.map(item => item.getAttribute('data-id'));
            const feedbackEl = document.getElementById('ipo-order-feedback');
            const explanationEl = document.getElementById('ipo-explanation');

            // Correct order: tickets & price (input data), then total (process), then print (output)
            const isCorrect = (
                (currentIds[0] === 'tickets' || currentIds[0] === 'price') &&
                (currentIds[1] === 'tickets' || currentIds[1] === 'price') &&
                currentIds[2] === 'total' &&
                currentIds[3] === 'print'
            );

            if (isCorrect) {
                feedbackEl.className = 'feedback-box correct';
                feedbackEl.innerHTML = `🎉 <strong>Perfect Sequence!</strong> The variables were defined first (Input), the calculation was performed next (Process), and the result was printed last (Output).`;
                explanationEl.classList.remove('hidden');
                markSectionComplete(3);
            } else {
                feedbackEl.className = 'feedback-box wrong';
                feedbackEl.innerHTML = `❌ <strong>Not quite right!</strong> Remember the Input → Process → Output rule:<br>
                1. Create the input variables (<code>tickets</code> and <code>price</code>)<br>
                2. Do the calculation (<code>total = tickets * price</code>)<br>
                3. Print the result (<code>print(total)</code>)`;
            }
        });
    }

    const resetIpoBtn = document.getElementById('reset-ipo-order');
    if (resetIpoBtn) {
        resetIpoBtn.addEventListener('click', () => {
            const list = document.getElementById('ipo-draggable-list');
            if (list) {
                list.innerHTML = `
                    <div class="drag-item" data-id="total" draggable="true"><span class="drag-handle">☰</span><code>total = tickets * price</code><span class="step-tag">PROCESS</span></div>
                    <div class="drag-item" data-id="tickets" draggable="true"><span class="drag-handle">☰</span><code>tickets = 3</code><span class="step-tag">INPUT DATA</span></div>
                    <div class="drag-item" data-id="print" draggable="true"><span class="drag-handle">☰</span><code>print(total)</code><span class="step-tag">OUTPUT</span></div>
                    <div class="drag-item" data-id="price" draggable="true"><span class="drag-handle">☰</span><code>price = 8.50</code><span class="step-tag">INPUT DATA</span></div>
                `;
            }
            document.getElementById('ipo-order-feedback').className = 'feedback-box hidden';
            document.getElementById('ipo-explanation').classList.add('hidden');
        });
    }

    // ==========================================
    // SECTION 4: INTERACTIVE INPUT & PREDICT
    // ==========================================
    const sec4SubmitBtn = document.getElementById('sec4-submit-btn');
    const sec4UserInput = document.getElementById('sec4-user-input');

    function runSec4Terminal() {
        const typedVal = sec4UserInput.value.trim() || 'Alex';
        const outputEl = document.getElementById('sec4-term-output');
        const breakdownEl = document.getElementById('sec4-breakdown');

        if (outputEl) {
            outputEl.innerHTML = `Hello ${typedVal}`;
            outputEl.classList.remove('hidden');
        }

        if (breakdownEl) {
            breakdownEl.classList.remove('hidden');
        }
    }

    if (sec4SubmitBtn && sec4UserInput) {
        sec4SubmitBtn.addEventListener('click', runSec4Terminal);
        sec4UserInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') runSec4Terminal();
        });
    }

    // Predict Output Options
    const sec4PredictOptions = document.getElementById('sec4-predict-options');
    if (sec4PredictOptions) {
        sec4PredictOptions.querySelectorAll('button').forEach(btn => {
            btn.addEventListener('click', () => {
                const opt = btn.getAttribute('data-option');
                const fb = document.getElementById('sec4-predict-feedback');

                if (opt === 'A') {
                    fb.className = 'feedback-box correct';
                    fb.innerHTML = `✅ <strong>Correct!</strong> The value stored in <code>food</code> changes depending on what the user types into <code>input()</code>!`;
                    markSectionComplete(4);
                } else {
                    fb.className = 'feedback-box wrong';
                    fb.innerHTML = `❌ <strong>Not quite!</strong> <code>input()</code> stores user responses into the variable <code>food</code>. Therefore, <code>food</code> changes!`;
                }
            });
        });
    }

    // ==========================================
    // SECTION 5: BUG HUNTER
    // ==========================================
    const bugTabs = document.querySelectorAll('.bug-tab');
    bugTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const bugNum = tab.getAttribute('data-bug');
            bugTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            document.querySelectorAll('.bug-challenge-panel').forEach(panel => {
                panel.classList.add('hidden');
            });
            const targetPanel = document.getElementById(`bug-panel-${bugNum}`);
            if (targetPanel) targetPanel.classList.remove('hidden');
        });
    });

    // Helper for Bug Hunter choices
    function bindBugQuiz(optionsId, feedbackId, correctCode) {
        const container = document.getElementById(optionsId);
        if (!container) return;

        container.querySelectorAll('button').forEach(btn => {
            btn.addEventListener('click', () => {
                const ans = btn.getAttribute('data-answer');
                const fb = document.getElementById(feedbackId);

                if (ans === 'correct') {
                    fb.className = 'feedback-box correct';
                    fb.innerHTML = `✅ <strong>Bug Fixed!</strong> ${correctCode}`;
                    markSectionComplete(5);
                } else {
                    fb.className = 'feedback-box wrong';
                    fb.innerHTML = `❌ <strong>Incorrect.</strong> Try looking at the line highlighted in red again!`;
                }
            });
        });
    }

    bindBugQuiz('bug1-options', 'bug1-feedback', 'Correct code: <code>name = input("What is your name?")</code>');
    bindBugQuiz('bug2-options', 'bug2-feedback', 'Correct code: <code>print("Hello", name)</code>');
    bindBugQuiz('bug3-options', 'bug3-feedback', 'Correct code: <code>student_name = input("Name: ")</code>');
    bindBugQuiz('bug4-options', 'bug4-feedback', 'Correct code: <code>print("Welcome")</code>');

    // ==========================================
    // SECTION 6: THE INPUT TRAP
    // ==========================================
    const trapButtons = document.getElementById('trap-buttons');
    if (trapButtons) {
        trapButtons.querySelectorAll('button').forEach(btn => {
            btn.addEventListener('click', () => {
                const choice = btn.getAttribute('data-choice');
                const fb = document.getElementById('trap-feedback');

                if (choice === 'NO') {
                    fb.className = 'feedback-box correct';
                    fb.innerHTML = `🎉 <strong>Correct!</strong> <code>input()</code> gives Python a STRING by default (e.g. <code>"17"</code>). Python cannot add a string and integer (<code>"17" + 1</code>) without <code>int()</code>!`;
                    markSectionComplete(6);
                } else if (choice === 'YES') {
                    fb.className = 'feedback-box wrong';
                    fb.innerHTML = `❌ <strong>It will fail!</strong> <code>input()</code> produces a STRING (<code>"17"</code>). Adding <code>"17" + 1</code> causes a TypeError!`;
                } else {
                    fb.className = 'feedback-box info';
                    fb.innerHTML = `💡 <strong>Hint:</strong> What data type does <code>input()</code> return? (String or Integer?)`;
                }
            });
        });
    }

    // ==========================================
    // SECTION 7: INT OR FLOAT
    // ==========================================
    const checkIntFloatBtn = document.getElementById('check-int-float-btn');
    if (checkIntFloatBtn) {
        // Toggle active selection on buttons
        document.querySelectorAll('#int-float-list .btn-choice').forEach(btn => {
            btn.addEventListener('click', () => {
                const parent = btn.closest('.btn-group');
                parent.querySelectorAll('.btn-choice').forEach(b => b.classList.remove('selected'));
                btn.classList.add('selected');
            });
        });

        checkIntFloatBtn.addEventListener('click', () => {
            const items = {
                age: 'int',
                tickets: 'int',
                price: 'float',
                height: 'float',
                students: 'int',
                temperature: 'float'
            };

            let allCorrect = true;
            let totalChecked = 0;

            for (const [key, expected] of Object.entries(items)) {
                const selectedBtn = document.querySelector(`.class-item[data-item="${key}"] .btn-choice.selected`);
                if (selectedBtn) {
                    totalChecked++;
                    const chosenType = selectedBtn.getAttribute('data-type');
                    if (chosenType !== expected) {
                        allCorrect = false;
                    }
                } else {
                    allCorrect = false;
                }
            }

            const fb = document.getElementById('int-float-feedback');

            if (totalChecked < 6) {
                fb.className = 'feedback-box wrong';
                fb.innerHTML = `⚠️ Please select int() or float() for all 6 items first!`;
            } else if (allCorrect) {
                fb.className = 'feedback-box correct';
                fb.innerHTML = `✅ <strong>100% Correct!</strong> Whole counts use <code>int()</code>, while measurements and prices use <code>float()</code>.`;
                markSectionComplete(7);
            } else {
                fb.className = 'feedback-box wrong';
                fb.innerHTML = `❌ <strong>Some choices need adjusting:</strong><br>
                - Age & Number of tickets/students = whole numbers (<strong>int</strong>)<br>
                - Price, Height, and Temperature = decimal numbers (<strong>float</strong>)`;
            }
        });
    }

    // ==========================================
    // SECTION 8: OPERATORS PREDICTION
    // ==========================================
    const opPredictBtn = document.getElementById('op-predict-btn');
    const opPredictInput = document.getElementById('op-predict-input');

    if (opPredictBtn && opPredictInput) {
        opPredictBtn.addEventListener('click', () => {
            const val = parseInt(opPredictInput.value.trim());
            const fb = document.getElementById('op-predict-feedback');

            if (val === 15) {
                fb.className = 'feedback-box correct';
                fb.innerHTML = `✅ <strong>Spot on!</strong> <code>5 * 3 = 15</code>. Python displays 15.`;
                markSectionComplete(8);
            } else {
                fb.className = 'feedback-box wrong';
                fb.innerHTML = `❌ <strong>Not quite!</strong> <code>price = 5</code> and <code>quantity = 3</code>. The <code>*</code> symbol multiplies: 5 × 3 = ?`;
            }
        });
    }

    // ==========================================
    // SECTION 9: TICKET MACHINE BUILDER
    // ==========================================
    const builderAnswers = { step1: null, step2: null, step3: null, step4: null, step5: null };
    let currentBuilderStep = 1;

    function bindBuilderStep(stepNum, qId) {
        const container = document.getElementById(qId);
        if (!container) return;

        container.querySelectorAll('button').forEach(btn => {
            btn.addEventListener('click', () => {
                const isCorrect = btn.getAttribute('data-correct') === 'true';
                const fb = document.getElementById('builder-step-feedback');

                if (isCorrect) {
                    builderAnswers[`step${stepNum}`] = true;
                    fb.className = 'feedback-box correct';
                    fb.innerHTML = `✅ <strong>Correct line selected!</strong> Moving to next step...`;

                    // Mark indicator step done
                    const ind = document.getElementById(`builder-step-${stepNum}-ind`);
                    if (ind) ind.classList.add('done');

                    setTimeout(() => {
                        fb.className = 'feedback-box hidden';
                        document.getElementById(`builder-panel-${stepNum}`).classList.add('hidden');

                        if (stepNum < 5) {
                            currentBuilderStep = stepNum + 1;
                            const nextPanel = document.getElementById(`builder-panel-${currentBuilderStep}`);
                            if (nextPanel) nextPanel.classList.remove('hidden');

                            const nextInd = document.getElementById(`builder-step-${currentBuilderStep}-ind`);
                            if (nextInd) nextInd.classList.add('active');
                        } else {
                            // Builder Complete!
                            const liveTerm = document.getElementById('builder-live-terminal-container');
                            if (liveTerm) liveTerm.classList.remove('hidden');
                            markSectionComplete(9);
                        }
                    }, 1000);
                } else {
                    fb.className = 'feedback-box wrong';
                    fb.innerHTML = `❌ <strong>Not quite!</strong> Remember your Python syntax rules (e.g. <code>input()</code> vs <code>print()</code>, <code>int()</code> for whole numbers).`;
                }
            });
        });
    }

    bindBuilderStep(1, 'builder-q1');
    bindBuilderStep(2, 'builder-q2');
    bindBuilderStep(3, 'builder-q3');
    bindBuilderStep(4, 'builder-q4');
    bindBuilderStep(5, 'builder-q5');

    // Live Ticket Machine Terminal Interaction
    const tmBtn1 = document.getElementById('tm-btn-1');
    const tmBtn2 = document.getElementById('tm-btn-2');
    const tmInputName = document.getElementById('tm-input-name');
    const tmInputTickets = document.getElementById('tm-input-tickets');
    let tmCustomerName = '';

    if (tmBtn1 && tmInputName) {
        tmBtn1.addEventListener('click', () => {
            tmCustomerName = tmInputName.value.trim() || 'Alex';
            document.getElementById('tm-step1').classList.add('hidden');
            document.getElementById('tm-step2').classList.remove('hidden');
        });
    }

    if (tmBtn2 && tmInputTickets) {
        tmBtn2.addEventListener('click', () => {
            const tickets = parseInt(tmInputTickets.value.trim()) || 2;
            const price = 8.50;
            const total = (tickets * price).toFixed(2);

            document.getElementById('tm-step2').classList.add('hidden');
            const receipt = document.getElementById('tm-receipt-output');
            if (receipt) {
                receipt.innerHTML = `
                    <div class="term-line">Customer: ${tmCustomerName}</div>
                    <div class="term-line">Tickets: ${tickets}</div>
                    <div class="term-line" style="color: #4ade80; font-weight: bold;">Total: £${total}</div>
                `;
                receipt.classList.remove('hidden');
            }
        });
    }

    const tmRestartBtn = document.getElementById('tm-restart-btn');
    if (tmRestartBtn) {
        tmRestartBtn.addEventListener('click', () => {
            document.getElementById('tm-step1').classList.remove('hidden');
            document.getElementById('tm-step2').classList.add('hidden');
            document.getElementById('tm-receipt-output').classList.add('hidden');
            tmInputName.value = '';
            tmInputTickets.value = '';
        });
    }

    // ==========================================
    // SECTION 10: PUZZLE CODE ORDER
    // ==========================================
    const puzzleList = document.getElementById('puzzle-draggable-list');
    if (puzzleList) {
        puzzleList.addEventListener('dragstart', (e) => {
            if (e.target.classList.contains('drag-item')) {
                draggedItem = e.target;
                e.target.classList.add('dragging');
            }
        });

        puzzleList.addEventListener('dragend', (e) => {
            if (e.target.classList.contains('drag-item')) {
                e.target.classList.remove('dragging');
                draggedItem = null;
            }
        });

        puzzleList.addEventListener('dragover', (e) => {
            e.preventDefault();
            const afterElement = getDragAfterElement(puzzleList, e.clientY);
            if (afterElement == null) {
                puzzleList.appendChild(draggedItem);
            } else {
                puzzleList.insertBefore(draggedItem, afterElement);
            }
        });
    }

    const checkPuzzleBtn = document.getElementById('check-puzzle-btn');
    if (checkPuzzleBtn) {
        checkPuzzleBtn.addEventListener('click', () => {
            const currentItems = [...document.querySelectorAll('#puzzle-draggable-list .drag-item')];
            const currentIds = currentItems.map(item => item.getAttribute('data-id'));
            const fb = document.getElementById('puzzle-feedback');
            const exp = document.getElementById('puzzle-explanation');

            // Correct order: input & price first, then calc, then print
            const isCorrect = (
                (currentIds[0] === 'p-input' || currentIds[0] === 'p-price') &&
                (currentIds[1] === 'p-input' || currentIds[1] === 'p-price') &&
                currentIds[2] === 'p-calc' &&
                currentIds[3] === 'p-print'
            );

            if (isCorrect) {
                fb.className = 'feedback-box correct';
                fb.innerHTML = `🎉 <strong>Correct Order!</strong> Variables were assigned before calculations took place.`;
                exp.classList.remove('hidden');
                markSectionComplete(10);
            } else {
                fb.className = 'feedback-box wrong';
                fb.innerHTML = `❌ <strong>Not quite!</strong> Remember: Python executes top-to-bottom. You must gather <code>quantity</code> and set <code>price</code> BEFORE calculating <code>total = quantity * price</code>!`;
            }
        });
    }

    const resetPuzzleBtn = document.getElementById('reset-puzzle-btn');
    if (resetPuzzleBtn) {
        resetPuzzleBtn.addEventListener('click', () => {
            const list = document.getElementById('puzzle-draggable-list');
            if (list) {
                list.innerHTML = `
                    <div class="drag-item" data-id="p-print" draggable="true"><span class="drag-handle">☰</span><code>print("Total: £", total)</code></div>
                    <div class="drag-item" data-id="p-input" draggable="true"><span class="drag-handle">☰</span><code>quantity = int(input("Quantity: "))</code></div>
                    <div class="drag-item" data-id="p-calc" draggable="true"><span class="drag-handle">☰</span><code>total = quantity * price</code></div>
                    <div class="drag-item" data-id="p-price" draggable="true"><span class="drag-handle">☰</span><code>price = 4.50</code></div>
                `;
            }
            document.getElementById('puzzle-feedback').className = 'feedback-box hidden';
            document.getElementById('puzzle-explanation').classList.add('hidden');
        });
    }

    // ==========================================
    // SECTION 11: SYNTAX LAB
    // ==========================================
    function bindSyntaxLab(qId, fId) {
        const container = document.getElementById(qId);
        if (!container) return;

        container.querySelectorAll('button').forEach(btn => {
            btn.addEventListener('click', () => {
                const isCorrect = btn.getAttribute('data-correct') === 'true';
                const fb = document.getElementById(fId);

                if (isCorrect) {
                    fb.className = 'feedback-box correct';
                    fb.innerHTML = `✅ <strong>Correct fix!</strong> Clean Python syntax.`;
                    markSectionComplete(11);
                } else {
                    fb.className = 'feedback-box wrong';
                    fb.innerHTML = `❌ <strong>Not quite!</strong> Look closely at brackets, quotes, or variable names.`;
                }
            });
        });
    }

    bindSyntaxLab('syntax-lab-q1', 'syntax-lab-f1');
    bindSyntaxLab('syntax-lab-q2', 'syntax-lab-f2');
    bindSyntaxLab('syntax-lab-q3', 'syntax-lab-f3');
    bindSyntaxLab('syntax-lab-q4', 'syntax-lab-f4');

    // ==========================================
    // SECTION 12: FINAL BOSS
    // ==========================================
    const bossHint1Btn = document.getElementById('boss-hint1-btn');
    const bossHint2Btn = document.getElementById('boss-hint2-btn');
    const bossHint3Btn = document.getElementById('boss-hint3-btn');

    if (bossHint1Btn) bossHint1Btn.addEventListener('click', () => document.getElementById('boss-hint1-text').classList.toggle('hidden'));
    if (bossHint2Btn) bossHint2Btn.addEventListener('click', () => document.getElementById('boss-hint2-text').classList.toggle('hidden'));
    if (bossHint3Btn) bossHint3Btn.addEventListener('click', () => document.getElementById('boss-hint3-text').classList.toggle('hidden'));

    const checkBossBtn = document.getElementById('check-boss-btn');
    if (checkBossBtn) {
        checkBossBtn.addEventListener('click', () => {
            const line5Val = document.getElementById('boss-line5-sel').value;
            const line9Val = document.getElementById('boss-line9-sel').value;
            const line11Val = document.getElementById('boss-line11-sel').value;
            const fb = document.getElementById('boss-feedback');
            const successCode = document.getElementById('boss-success-code');

            if (line5Val === 'correct' && line9Val === 'correct' && line11Val === 'correct') {
                fb.className = 'feedback-box correct';
                fb.innerHTML = `🏆 <strong>FINAL BOSS DEFEATED!</strong> All 3 syntax errors have been corrected successfully!`;
                successCode.classList.remove('hidden');
                markSectionComplete(12);
            } else {
                fb.className = 'feedback-box wrong';
                fb.innerHTML = `❌ <strong>Some bugs remain!</strong><br>
                - Check if <code>entries</code> is wrapped with <code>int()</code><br>
                - Check if line 9 has a comma separating the string and variable<br>
                - Check if line 11 closes its bracket <code>)</code>`;
            }
        });
    }

    // ==========================================
    // SECTION 13: CHECKLIST COUNTER
    // ==========================================
    const chkInputs = document.querySelectorAll('.checklist-container .chk-input');
    chkInputs.forEach(chk => {
        chk.addEventListener('change', () => {
            const checkedCount = document.querySelectorAll('.checklist-container .chk-input:checked').length;
            const counterText = document.getElementById('chk-counter-text');
            if (counterText) counterText.textContent = `${checkedCount} of 7 items checked`;
            if (checkedCount >= 5) markSectionComplete(13);
        });
    });

    // ==========================================
    // SECTION 14: FINAL KNOWLEDGE CHECK QUIZ
    // ==========================================
    const finalQuizQuestions = [
        {
            q: "1. What Python data type is: \"19\" ?",
            options: ["STRING", "INTEGER", "FLOAT", "BOOLEAN"],
            correct: 0,
            explain: "Because it is wrapped in quotation marks, Python treats it as a STRING."
        },
        {
            q: "2. Which code correctly asks the user for a whole number?",
            options: [
                'age = input("Age: ")',
                'age = int(input("Age: "))',
                'int = age("Age: ")'
            ],
            correct: 1,
            explain: 'int() converts the input string into a whole number integer.'
        },
        {
            q: "3. What calculation does total = price * quantity perform?",
            options: [
                "Adds price and quantity",
                "Divides price by quantity",
                "Multiplies price by quantity",
                "Subtracts quantity from price"
            ],
            correct: 2,
            explain: "* is the multiplication operator in Python."
        },
        {
            q: "4. What happens if you run: prnt(\"Hello\") ?",
            options: [
                "Python prints Hello",
                "NameError: name 'prnt' is not defined",
                "SyntaxError: invalid string",
                "Nothing happens"
            ],
            correct: 1,
            explain: "Python is case-sensitive and function names must be spelled accurately (print)."
        },
        {
            q: "5. Which variable name is valid in Python?",
            options: [
                "student name",
                "student_name",
                "1st_student"
            ],
            correct: 1,
            explain: "Variable names cannot contain spaces or start with digits."
        },
        {
            q: "6. What data type is the value 3.14 ?",
            options: ["INTEGER", "FLOAT", "STRING", "BOOLEAN"],
            correct: 1,
            explain: "Numbers with decimal points are float (floating point) data types."
        },
        {
            q: "7. What data type does input() return by default?",
            options: ["INTEGER", "STRING", "FLOAT", "BOOLEAN"],
            correct: 1,
            explain: "input() ALWAYS returns a string by default."
        },
        {
            q: "8. What will Python output for: x = 10; y = 2; print(x / y) ?",
            options: ["5.0", "5", "12", "8"],
            correct: 0,
            explain: "The division operator / in Python always returns a FLOAT (5.0)."
        }
    ];

    let currentQuizIndex = 0;
    let quizScore = 0;

    function renderFinalQuizQuestion() {
        const container = document.getElementById('quiz-question-container');
        if (!container) return;

        if (currentQuizIndex >= finalQuizQuestions.length) {
            // Quiz Complete
            container.innerHTML = `
                <div class="text-center">
                    <h2>🎯 Final Knowledge Check Completed!</h2>
                    <p class="lead mt-2">You scored ${quizScore} out of ${finalQuizQuestions.length}!</p>
                    <button class="btn btn-primary btn-lg mt-3" id="finish-quiz-btn">View Lab Certificate ➔</button>
                </div>
            `;

            document.getElementById('finish-quiz-btn').addEventListener('click', () => {
                showSection(15);
            });
            return;
        }

        const qData = finalQuizQuestions[currentQuizIndex];
        let optionsHTML = '';

        qData.options.forEach((opt, idx) => {
            optionsHTML += `<button class="btn btn-choice text-left quiz-opt-btn" data-idx="${idx}">${opt}</button>`;
        });

        container.innerHTML = `
            <div class="quiz-question-card">
                <span class="badge badge-warning">Question ${currentQuizIndex + 1} of ${finalQuizQuestions.length}</span>
                <h3 class="mt-2">${qData.q}</h3>
                <div class="quiz-options-list">
                    ${optionsHTML}
                </div>
                <div class="feedback-box hidden" id="final-quiz-feedback"></div>
            </div>
        `;

        container.querySelectorAll('.quiz-opt-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const selectedIdx = parseInt(btn.getAttribute('data-idx'));
                const fb = document.getElementById('final-quiz-feedback');

                if (selectedIdx === qData.correct) {
                    quizScore++;
                    fb.className = 'feedback-box correct';
                    fb.innerHTML = `✅ <strong>Correct!</strong> ${qData.explain}`;
                } else {
                    fb.className = 'feedback-box wrong';
                    fb.innerHTML = `❌ <strong>Not quite!</strong> ${qData.explain}`;
                }

                setTimeout(() => {
                    currentQuizIndex++;
                    renderFinalQuizQuestion();
                }, 1600);
            });
        });
    }

    renderFinalQuizQuestion();
});
