let tamanhoAtual = 3; 
let estadoDoJogo = []; 
let indiceVazio = 0; 
let movimentos = 0;
let tempoSegundos = 0;
let intervaloTimer = null;
let imagemAtual = '';
let animando = false;

const listaImagens = ['imagem.jpg', 'imagemII.jpg', 'imagemIII.jpg', 'imagemIV.jpg'];

function atualizarPreview() {
    const imgPreview = document.getElementById('imagem-preview');
    if (imgPreview) {
        imgPreview.src = imagemAtual;
    }
}

function iniciarJogo(tamanho) {
    const indiceSorteado = Math.floor(Math.random() * listaImagens.length);
    imagemAtual = listaImagens[indiceSorteado]; 

    atualizarPreview();

    tamanhoAtual = tamanho;
    estadoDoJogo = [];
    const totalPecas = tamanho * tamanho;
    for (let i = 0; i < totalPecas; i++) {
        estadoDoJogo.push(i);
    }
    indiceVazio = totalPecas - 1;
    
    embaralhar();
    renderizarTabuleiro();
    resetarStatus(); 
    salvarProgresso();
}

function renderizarTabuleiro() {
    const tabuleiro = document.getElementById('tabuleiro');
    tabuleiro.innerHTML = ''; 
    tabuleiro.style.gridTemplateColumns = `repeat(${tamanhoAtual}, 1fr)`;
    tabuleiro.style.gridTemplateRows = `repeat(${tamanhoAtual}, 1fr)`;

    estadoDoJogo.forEach((valorDaPeca, indiceNoArray) => {
        const pecaDiv = document.createElement('div');
        pecaDiv.id = `peca-${indiceNoArray}`; 
        
        if (valorDaPeca === (tamanhoAtual * tamanhoAtual) - 1) {
            pecaDiv.classList.add('peca', 'vazio');
        } 
        else {
            pecaDiv.classList.add('peca');
            pecaDiv.style.backgroundImage = `url('${imagemAtual}')`;
            const linhaOriginal = Math.floor(valorDaPeca / tamanhoAtual);
            const colunaOriginal = valorDaPeca % tamanhoAtual;
            pecaDiv.style.backgroundSize = `${tamanhoAtual * 100}% ${tamanhoAtual * 100}%`;
            const posX = (colunaOriginal / (tamanhoAtual - 1)) * 100;
            const posY = (linhaOriginal / (tamanhoAtual - 1)) * 100;
            pecaDiv.style.backgroundPosition = `${posX}% ${posY}%`;
            pecaDiv.onclick = () => tentarMover(indiceNoArray);
        }
        
        tabuleiro.appendChild(pecaDiv);
    });
}

function tentarMover(indiceClicado) {
    if (animando) return; 

    const linhaClique = Math.floor(indiceClicado / tamanhoAtual);
    const colClique = indiceClicado % tamanhoAtual;
    const linhaVazio = Math.floor(indiceVazio / tamanhoAtual);
    const colVazio = indiceVazio % tamanhoAtual;
    
    const mesmaLinha = linhaClique === linhaVazio && Math.abs(colClique - colVazio) === 1;
    const mesmaColuna = colClique === colVazio && Math.abs(linhaClique - linhaVazio) === 1;

    if (mesmaLinha || mesmaColuna) {
        animando = true;
        const pecaHTML = document.getElementById(`peca-${indiceClicado}`);
        const dirX = colVazio - colClique; 
        const dirY = linhaVazio - linhaClique;
        const moverX = `calc(${dirX * 100}% + ${dirX * 2}px)`;
        const moverY = `calc(${dirY * 100}% + ${dirY * 2}px)`;

        pecaHTML.style.transform = `translate(${moverX}, ${moverY})`;
        pecaHTML.style.zIndex = "10";

        setTimeout(() => {
            const valorTemporario = estadoDoJogo[indiceClicado];
            estadoDoJogo[indiceClicado] = estadoDoJogo[indiceVazio];
            estadoDoJogo[indiceVazio] = valorTemporario;
            indiceVazio = indiceClicado;
            movimentos++;
            document.getElementById('contador').innerText = movimentos;
            renderizarTabuleiro();
            salvarProgresso();
            
            animando = false; 
            
            verificarVitoria();
        }, 150); 
    }
}

function embaralhar() {
    for (let i = 0; i < 300; i++) {
        const vizinhosPossiveis = [];
        const lVazio = Math.floor(indiceVazio / tamanhoAtual);
        const cVazio = indiceVazio % tamanhoAtual;

        if (lVazio > 0) vizinhosPossiveis.push(indiceVazio - tamanhoAtual);
        if (lVazio < tamanhoAtual - 1) vizinhosPossiveis.push(indiceVazio + tamanhoAtual); 
        if (cVazio > 0) vizinhosPossiveis.push(indiceVazio - 1);
        if (cVazio < tamanhoAtual - 1) vizinhosPossiveis.push(indiceVazio + 1); 

        const vizinhoEscolhido = vizinhosPossiveis[Math.floor(Math.random() * vizinhosPossiveis.length)];
        const temp = estadoDoJogo[vizinhoEscolhido];
        estadoDoJogo[vizinhoEscolhido] = estadoDoJogo[indiceVazio];
        estadoDoJogo[indiceVazio] = temp;
        indiceVazio = vizinhoEscolhido;
    }
}

function verificarVitoria() {
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

function fecharModal() {
    document.getElementById('modal-vitoria').className = 'modal-oculto';
    iniciarJogo(tamanhoAtual);
}

function formatarTempo(segundosTotais) {
    const minutos = Math.floor(segundosTotais / 60).toString().padStart(2, '0');
    const segundos = (segundosTotais % 60).toString().padStart(2, '0');
    return `${minutos}:${segundos}`;
}

function resetarStatus() {
    movimentos = 0;
    tempoSegundos = 0;
    document.getElementById('contador').innerText = movimentos;
    document.getElementById('cronometro').innerText = "00:00";

    if (intervaloTimer) clearInterval(intervaloTimer);
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
    localStorage.setItem('meuSlidePuzzle', JSON.stringify(pacoteDeDados));
}

function carregarProgresso() {
    const dadosSalvos = localStorage.getItem('meuSlidePuzzle');
    if (dadosSalvos) {
        const pacoteDeDados = JSON.parse(dadosSalvos);
        tamanhoAtual = pacoteDeDados.tamanhoAtual;
        estadoDoJogo = pacoteDeDados.estadoDoJogo;
        indiceVazio = pacoteDeDados.indiceVazio;
        movimentos = pacoteDeDados.movimentos;
        tempoSegundos = pacoteDeDados.tempoSegundos;
        imagemAtual = pacoteDeDados.imagemAtual;

        atualizarPreview();
        
        document.getElementById('contador').innerText = movimentos;
        document.getElementById('cronometro').innerText = formatarTempo(tempoSegundos);
        
        if (intervaloTimer) clearInterval(intervaloTimer);
        intervaloTimer = setInterval(() => {
            tempoSegundos++;
            document.getElementById('cronometro').innerText = formatarTempo(tempoSegundos);
            salvarProgresso(); 
        }, 1000);
        
        renderizarTabuleiro();
        return true; 
    }
    
    return false; 
}

if (!carregarProgresso()) {
    iniciarJogo(3);
}