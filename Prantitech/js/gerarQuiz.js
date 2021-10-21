const gerarQuiz = (perguntas) => {
    if(!Array.isArray(perguntas))
        console.warn(`${perguntas} deve ser uma array, mas o tipo é: ${typeof(perguntas)}`);

    const container = document.createElement('ol');
    const css = document.createElement('link');
    css.rel = 'stylesheet';
    css.href = '../css/quiz.css';
    container.appendChild(css);
    let questoesRespondidas = 0;
    const pontuacao = [];
    for(let i=0;i<perguntas.length;i++)
        pontuacao[i] = 0;

    for(let i=0;i<perguntas.length;i++) {
        const questao = perguntas[i];
        const questaoLi = document.createElement('li');
        questaoLi.classList.add('questao');
        questaoLi.innerHTML = `
            <p class="questao-enunciado">${questao.enunciado}</p>
            <span class="chutes-restantes" style="display: none"></span>
            <div class="questao-alternativas"></div>
        `;

        const chutesSpan = questaoLi.querySelector('.chutes-restantes');
        let chutesRestantes = questao.alternativasCorretas.length;
        if(chutesRestantes > 1) {
            chutesSpan.style.display = 'inline';
            chutesSpan.innerText = `(${chutesRestantes===0?'Nenhum':chutesRestantes} ${chutesRestantes>1?'alternativas restantes':'alternativa restante'})`;
        };

        const alternativasDiv = questaoLi.querySelector('.questao-alternativas');
        for(let j=0;j<questao.alternativas.length;j++) {
            const alternativa = questao.alternativas[j];

            const alternativaBtn = document.createElement('button');
            alternativaBtn.classList.add('questao-alternativa');
            alternativaBtn.style.display = 'block';
            alternativaBtn.innerText = alternativa;
            alternativaBtn.onclick = () => {
                if(chutesRestantes <= 0 || alternativaBtn.classList.contains('alternativa-correta') || alternativaBtn.classList.contains('alternativa-errada'))
                    return;
                let tipo;
                if(questao.alternativasCorretas.includes(j)) {
                    tipo = 'alternativa-correta';
                    chutesRestantes--;
                    pontuacao[i] += 1/questao.alternativasCorretas.length;

                    // Evita números decimais como 0.60000001, arredondando os para 3 casas decimais como 0.600
                    pontuacao[i] = Number(pontuacao[i].toFixed(3));
                    
                } else {
                    tipo = 'alternativa-errada';
                    chutesRestantes = 0;
                }
                if(chutesRestantes === 0) {
                    chutesSpan.style.display = 'none';
                    questaoLi.classList.add('questao-finalizada');
                    questoesRespondidas++;

                    if(questoesRespondidas === perguntas.length) {
                        const calcularPtn = document.createElement('button');
                        calcularPtn.innerText = 'Calcular Pontuação';
                        calcularPtn.classList.add('questao-calcular-pontuacao')
                        calcularPtn.addEventListener('click', () => {
                            const pontuacaoSpan = document.createElement('span');
                            pontuacaoSpan.classList.add('questao-pontuacao');
                            const qtdQuestoesCorretas = pontuacao.reduce((a, b) => { return a + b; }, 0);
                            pontuacaoSpan.innerText = `Você ${qtdQuestoesCorretas===0?'não':''} acertou ${qtdQuestoesCorretas===0?'nenhuma':qtdQuestoesCorretas} ${qtdQuestoesCorretas!==1&&qtdQuestoesCorretas!==0?'questões':'questão'}!`;
                            pontuacaoSpan.style.display = 'block';
                            container.appendChild(pontuacaoSpan);
                        });
                        container.appendChild(calcularPtn);
                    };
                };
                chutesSpan.innerText = `(${chutesRestantes===0?'Nenhum':chutesRestantes} ${chutesRestantes>1?'alternativas restantes':'alternativa restante'})`;
                alternativaBtn.classList.add(tipo);
            };
            alternativasDiv.appendChild(alternativaBtn);
        };
        container.appendChild(questaoLi);
    };
    return container;
};
