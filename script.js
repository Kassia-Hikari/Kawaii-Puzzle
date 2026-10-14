let tamanhoAtual = 3; // Começa no 3x3
let estadoDoJogo = []; // Nosso "Nó" atual no Grafo
let indiceVazio = 0; // Onde está o buraco
let movimentos = 0;
let tempoSegundos = 0;
let intervaloTimer = null;
let imagemAtual = '';
let animando = false;

const listaImagens = ['imagem.jpg', 'imagemII.jpg', 'imagemIII.jpg', 'imagemIV.jpg'];

// Função responsável por atualizar a miniatura da imagem na tela
function atualizarPreview() {
    const imgPreview = document.getElementById('imagem-preview');
    // Verifica se o elemento HTML existe antes de tentar mudar a imagem
    if (imgPreview) {
        imgPreview.src = imagemAtual;
    }
}

function iniciarJogo(tamanho) {
    // Sorteia a imagem primeiro
    const indiceSorteado = Math.floor(Math.random() * listaImagens.length);
    imagemAtual = listaImagens[indiceSorteado]; // Sem o 'let', apenas atualiza a global

    atualizarPreview();
    
    tamanhoAtual = tamanho;
    estadoDoJogo = [];
    const totalPecas = tamanho * tamanho;
    
    // Cria o array ordenado [0, 1, 2, ..., (total-1)]
    for (let i = 0; i < totalPecas; i++) {
        estadoDoJogo.push(i);
    }
    
    // O último número representa o espaço vazio
    indiceVazio = totalPecas - 1;
    
    embaralhar();
    renderizarTabuleiro();
    resetarStatus(); // Essa função já cuida de zerar o tempo e os movimentos!
    salvarProgresso();
}

function renderizarTabuleiro() {
    const tabuleiro = document.getElementById('tabuleiro');
    tabuleiro.innerHTML = ''; // Limpa o tabuleiro anterior
    
    // Configura o CSS Grid dinamicamente
    tabuleiro.style.gridTemplateColumns = `repeat(${tamanhoAtual}, 1fr)`;
    tabuleiro.style.gridTemplateRows = `repeat(${tamanhoAtual}, 1fr)`;

    // O 'forEach' é o laço que cria o escopo para 'valorDaPeca' e 'indiceNoArray'
    estadoDoJogo.forEach((valorDaPeca, indiceNoArray) => {
        const pecaDiv = document.createElement('div');
        
        // Adiciona a etiqueta (ID) para o JavaScript achar a peça na hora de animar
        pecaDiv.id = `peca-${indiceNoArray}`; 
        
        // Verifica se é a peça vazia
        if (valorDaPeca === (tamanhoAtual * tamanhoAtual) - 1) {
            pecaDiv.classList.add('peca', 'vazio');
        } 
        // Se for uma peça normal de imagem
        else {
            pecaDiv.classList.add('peca');
            pecaDiv.style.backgroundImage = `url('${imagemAtual}')`;
            
            // LÓGICA DE RECORTE FLUIDO (Porcentagem):
            const linhaOriginal = Math.floor(valorDaPeca / tamanhoAtual);
            const colunaOriginal = valorDaPeca % tamanhoAtual;
            
            // A imagem inteira é (tamanhoAtual * 100) vezes maior que a pecinha
            pecaDiv.style.backgroundSize = `${tamanhoAtual * 100}% ${tamanhoAtual * 100}%`;
            
            // Regra de três para alinhar o fundo perfeitamente
            const posX = (colunaOriginal / (tamanhoAtual - 1)) * 100;
            const posY = (linhaOriginal / (tamanhoAtual - 1)) * 100;
            pecaDiv.style.backgroundPosition = `${posX}% ${posY}%`;
            
            // Adiciona o evento de clique
            pecaDiv.onclick = () => tentarMover(indiceNoArray);
        }
        
        tabuleiro.appendChild(pecaDiv);
    });
}

function tentarMover(indiceClicado) {
    // Se já estiver tocando uma animação, ignora o clique
    if (animando) return; 

    const linhaClique = Math.floor(indiceClicado / tamanhoAtual);
    const colClique = indiceClicado % tamanhoAtual;
    const linhaVazio = Math.floor(indiceVazio / tamanhoAtual);
    const colVazio = indiceVazio % tamanhoAtual;
    
    const mesmaLinha = linhaClique === linhaVazio && Math.abs(colClique - colVazio) === 1;
    const mesmaColuna = colClique === colVazio && Math.abs(linhaClique - linhaVazio) === 1;

    if (mesmaLinha || mesmaColuna) {
        animando = true; // Trava o jogo

        // 1. Pega a peça exata no HTML
        const pecaHTML = document.getElementById(`peca-${indiceClicado}`);
        
        // 2. Calcula a DIREÇÃO (-1, 0, ou 1)
        const dirX = colVazio - colClique; 
        const dirY = linhaVazio - linhaClique;
        
        // 3. Aplica o movimento visual: 100% do tamanho da peça + 2px do gap do grid
        const moverX = `calc(${dirX * 100}% + ${dirX * 2}px)`;
        const moverY = `calc(${dirY * 100}% + ${dirY * 2}px)`;

        pecaHTML.style.transform = `translate(${moverX}, ${moverY})`;
        pecaHTML.style.zIndex = "10";

        // 4. Espera 150ms (o tempo da animação) antes de atualizar os dados
        setTimeout(() => {
            // Troca no Array (Estado do Grafo)
            const valorTemporario = estadoDoJogo[indiceClicado];
            estadoDoJogo[indiceClicado] = estadoDoJogo[indiceVazio];
            estadoDoJogo[indiceVazio] = valorTemporario;
            indiceVazio = indiceClicado;
            
            // Atualiza contadores
            movimentos++;
            document.getElementById('contador').innerText = movimentos;
            
            // Redesenha e salva
            renderizarTabuleiro();
            salvarProgresso();
            
            animando = false; // Destrava o jogo para o próximo clique
            
            verificarVitoria();
        }, 150); // Deve ser o mesmo tempo do seu transition no CSS
    }
}

// 4. Embaralhador Seguro
function embaralhar() {
    // Fazemos movimentos aleatórios válidos para garantir que tem solução
    for (let i = 0; i < 300; i++) {
        const vizinhosPossiveis = [];
        const lVazio = Math.floor(indiceVazio / tamanhoAtual);
        const cVazio = indiceVazio % tamanhoAtual;

        // Tenta achar vizinho de cima, baixo, esquerda, direita
        if (lVazio > 0) vizinhosPossiveis.push(indiceVazio - tamanhoAtual); // Cima
        if (lVazio < tamanhoAtual - 1) vizinhosPossiveis.push(indiceVazio + tamanhoAtual); // Baixo
        if (cVazio > 0) vizinhosPossiveis.push(indiceVazio - 1); // Esquerda
        if (cVazio < tamanhoAtual - 1) vizinhosPossiveis.push(indiceVazio + 1); // Direita

        // Escolhe um vizinho aleatório e faz a troca no Array
        const vizinhoEscolhido = vizinhosPossiveis[Math.floor(Math.random() * vizinhosPossiveis.length)];
        
        const temp = estadoDoJogo[vizinhoEscolhido];
        estadoDoJogo[vizinhoEscolhido] = estadoDoJogo[indiceVazio];
        estadoDoJogo[indiceVazio] = temp;
        indiceVazio = vizinhoEscolhido;
    }
}

// 5. Condição de Vitória
function verificarVitoria() {
    // Se o array voltar a estar perfeitamente ordenado [0, 1, 2...], o jogador venceu
    let venceu = true;
    for (let i = 0; i < estadoDoJogo.length; i++) {
        if (estadoDoJogo[i] !== i) {
            venceu = false;
            break;
        }
    }
    
    if (venceu) {
        clearInterval(intervaloTimer);
        localStorage.removeItem('meuSlidePuzzle');
        const texto = `Tempo: ${formatarTempo(tempoSegundos)} | Movimentos: ${movimentos}`;
        document.getElementById('texto-vitoria').innerText = texto;
        document.getElementById('modal-vitoria').className = 'modal-visivel';
    }
}
// Função engatilhada pelo botão dentro do modal
function fecharModal() {
    // Esconde o modal de novo
    document.getElementById('modal-vitoria').className = 'modal-oculto';
    
    // Inicia um novo jogo no mesmo nível automaticamente
    iniciarJogo(tamanhoAtual);
}

function formatarTempo(segundosTotais) {
    const minutos = Math.floor(segundosTotais / 60).toString().padStart(2, '0');
    const segundos = (segundosTotais % 60).toString().padStart(2, '0');
    return `${minutos}:${segundos}`;
}

function resetarStatus() {
    // Zera as variáveis
    movimentos = 0;
    tempoSegundos = 0;
    
    // Atualiza o HTML imediatamente
    document.getElementById('contador').innerText = movimentos;
    document.getElementById('cronometro').innerText = "00:00";
    
    // Limpa qualquer timer anterior para não duplicar a contagem
    if (intervaloTimer) clearInterval(intervaloTimer);
    
    // Inicia um novo ciclo que roda a cada 1000 milissegundos (1 segundo)
    intervaloTimer = setInterval(() => {
        tempoSegundos++;
        document.getElementById('cronometro').innerText = formatarTempo(tempoSegundos);
    }, 1000);
}

function salvarProgresso() {
    const pacoteDeDados = {
        tamanhoAtual: tamanhoAtual,
        estadoDoJogo: estadoDoJogo,
        indiceVazio: indiceVazio,
        movimentos: movimentos,
        tempoSegundos: tempoSegundos,
        imagemAtual: imagemAtual
    };
    
    // Converte o objeto em texto JSON e salva no navegador com a chave 'meuSlidePuzzle'
    localStorage.setItem('meuSlidePuzzle', JSON.stringify(pacoteDeDados));
}

function carregarProgresso() {
    const dadosSalvos = localStorage.getItem('meuSlidePuzzle');
    
    // Se existe algum jogo salvo
    if (dadosSalvos) {
        const pacoteDeDados = JSON.parse(dadosSalvos);
        
        // Restaura nossas variáveis globais
        tamanhoAtual = pacoteDeDados.tamanhoAtual;
        estadoDoJogo = pacoteDeDados.estadoDoJogo;
        indiceVazio = pacoteDeDados.indiceVazio;
        movimentos = pacoteDeDados.movimentos;
        tempoSegundos = pacoteDeDados.tempoSegundos;
        imagemAtual = pacoteDeDados.imagemAtual;

        atualizarPreview();
        
        // Atualiza os textos na tela
        document.getElementById('contador').innerText = movimentos;
        document.getElementById('cronometro').innerText = formatarTempo(tempoSegundos);
        
        // Religa o cronômetro para continuar de onde parou
        if (intervaloTimer) clearInterval(intervaloTimer);
        intervaloTimer = setInterval(() => {
            tempoSegundos++;
            document.getElementById('cronometro').innerText = formatarTempo(tempoSegundos);
            salvarProgresso(); // Salva a cada segundo para não perder o tempo
        }, 1000);
        
        renderizarTabuleiro();
        return true; // Avisa que conseguimos carregar
    }
    
    return false; // Avisa que não havia jogo salvo
}

// Tenta carregar. Se a função retornar falso (não tem save), inicia um jogo novo 3x3.
if (!carregarProgresso()) {
    iniciarJogo(3);
}