Slide Puzzle - Jogo de Grafo 

Kawaii Puzzle <3

Um jogo clássico de Slide Puzzle desenvolvido do utilizando Vanilla JavaScript, HTML5 e CSS3.

Este projeto foi construído para aplicar conceitos de Teoria dos Grafos, onde cada configuração do tabuleiro representa um nó no grafo e os movimentos válidos representam as arestas.

Atividade proposta em classe por docente. 

I. Funcionalidades

Múltiplos Níveis de Dificuldade: Suporte dinâmico para grades de 3x3 (8 peças), 4x4 (15 peças) e 5x5 (24 peças).

Embaralhamento Seguro: Algoritmo que realiza centenas de movimentos válidos nos bastidores para garantir que o quebra-cabeça gerado seja sempre solucionável matematicamente.

Persistência de Estado (LocalStorage): O progresso do jogo (estado do tabuleiro, tempo e movimentos) é salvo automaticamente. Feche o navegador e continue de onde parou.

Design Fluido e Responsivo: A interface se adapta perfeitamente a dispositivos móveis usando CSS Grid, % e vw.

Animações Suaves: Transições CSS integradas com matemática em JavaScript (calc()) para deslizar as peças de forma orgânica.

Preview Dinâmico: Uma miniatura mostra o objetivo final, alterando automaticamente com base na imagem sorteada para a partida.

II. Tecnologias e Conceitos Aplicados

HTML5 & CSS3: CSS Grid, Flexbox, Aspect-Ratio, e variáveis fluidas.

JavaScript (ES6+):

Manipulação do DOM.

Gerenciamento de Estado (State Management).

Serialização/Desserialização de dados (JSON.stringify / JSON.parse).

Funções Assíncronas / Timers (setInterval, setTimeout).

Single Responsibility Principle (Princípio da Responsabilidade Única).

III. Como rodar o projeto localmente

Como o projeto utiliza recursos de armazenamento local (localStorage), é recomendado rodá-lo através de um servidor local para evitar bloqueios de segurança do navegador (CORS/File Protocol).

Clone este repositório:

git clone https://github.com/Kassia-Hikari/Kawaii-Puzzle.git


Abra a pasta do projeto no seu editor de código.

Utilize a extensão 'Live Server' para rodar (Go Live) o arquivo index.html.

O jogo abrirá automaticamente no seu navegador padrão.

IV. Como Jogar

Escolha o nível de dificuldade clicando nos botões (8, 15 ou 24 peças).

Clique nas peças adjacentes ao espaço vazio para movê-las.

Tente organizar todas as peças para formar a imagem mostrada na miniatura.

O cronômetro e o contador de movimentos registrarão o seu desempenho.

Ao final você terá o status do seu desempenho.
