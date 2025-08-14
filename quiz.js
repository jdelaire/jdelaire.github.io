(function(global) {
  'use strict';

  function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  function setupQuiz(config) {
    const elementsConfig = config.elements || {};
    const symbolEl = document.getElementById(elementsConfig.symbol);
    const optionsEl = document.getElementById(elementsConfig.options);
    const feedbackEl = document.getElementById(elementsConfig.feedback);
    const nextBtn = document.getElementById(elementsConfig.nextBtn);
    const statsEl = document.getElementById(elementsConfig.stats);

    if (!symbolEl || !optionsEl || !feedbackEl || !nextBtn || !statsEl) {
      return null;
    }

    const state = {
      currentAnswer: null,
      questionsAnswered: 0,
      correctAnswers: 0
    };

    function updateStats() {
      const accuracy = state.questionsAnswered > 0
        ? Math.round((state.correctAnswers / state.questionsAnswered) * 100)
        : 0;
      statsEl.textContent = `Questions: ${state.questionsAnswered} | Correct: ${state.correctAnswers} | Accuracy: ${accuracy}%`;
    }

    function pickQuestion() {
      feedbackEl.textContent = '';
      nextBtn.style.display = 'none';
      optionsEl.innerHTML = '';

      const round = (typeof config.pickRound === 'function') ? config.pickRound(state) : null;
      if (!round || !round.answer || !Array.isArray(round.choices)) {
        return;
      }

      const answer = round.answer;
      const choices = shuffle(round.choices.slice());
      state.currentAnswer = answer;

      if (typeof config.renderSymbol === 'function') {
        config.renderSymbol(answer, { symbolEl, optionsEl, feedbackEl, nextBtn, statsEl }, state);
      } else {
        // Fallback rendering if provided by round
        if (round.symbolText != null) {
          symbolEl.textContent = String(round.symbolText);
        }
        if (round.symbolAriaLabel) {
          symbolEl.setAttribute('aria-label', round.symbolAriaLabel);
        }
        if (round.symbolStyle && typeof round.symbolStyle === 'object') {
          Object.assign(symbolEl.style, round.symbolStyle);
        }
      }

      choices.forEach((choice) => {
        const btn = document.createElement('button');
        if (typeof config.renderButtonContent === 'function') {
          const content = config.renderButtonContent(choice, state);
          if (typeof content === 'string' && /<[^>]+>/.test(content)) {
            btn.innerHTML = content;
          } else {
            btn.textContent = (content == null) ? '' : String(content);
          }
        } else {
          btn.textContent = String(choice);
        }

        if (typeof config.ariaLabelForChoice === 'function') {
          const aria = config.ariaLabelForChoice(choice, state);
          if (aria) btn.setAttribute('aria-label', aria);
        }

        if (typeof config.decorateButton === 'function') {
          config.decorateButton(btn, choice, state);
        }

        btn.onclick = () => {
          state.questionsAnswered++;
          const isCorrect = (typeof config.isCorrect === 'function')
            ? !!config.isCorrect(choice, answer, state)
            : (choice === answer);

          if (isCorrect) {
            state.correctAnswers++;
            feedbackEl.textContent = '✅ Correct!';
            nextBtn.style.display = 'inline-block';
          } else {
            feedbackEl.textContent = '❌ Try again!';
          }

          updateStats();

          if (typeof config.onAnswered === 'function') {
            try { config.onAnswered({ correct: isCorrect, choice, answer, state }); } catch (_) {}
          }
        };

        optionsEl.appendChild(btn);
      });
    }

    if (config.enableKeyboard !== false) {
      document.addEventListener('keydown', (e) => {
        if (/^[1-9]$/.test(e.key)) {
          const buttons = optionsEl.querySelectorAll('button');
          const index = parseInt(e.key, 10) - 1;
          if (buttons[index]) {
            buttons[index].click();
          }
        } else if (e.key === 'Enter' && nextBtn.style.display !== 'none') {
          nextBtn.click();
        }
      });
    }

    nextBtn.onclick = pickQuestion;

    // Initialize
    pickQuestion();
    updateStats();

    return {
      pickQuestion,
      getState: () => ({
        currentAnswer: state.currentAnswer,
        questionsAnswered: state.questionsAnswered,
        correctAnswers: state.correctAnswers
      })
    };
  }

  global.ThaiQuiz = {
    setupQuiz,
    shuffle
  };
})(window);