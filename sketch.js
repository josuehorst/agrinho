// Variáveis de controle de tela e jogo
let tela = 0;
let player;
let itens = [];
let pontos = 0;
let botaoComecar;

function setup() {
  createCanvas(400, 300);          // Canvas menor
  player = new Player();
  botaoComecar = createButton('Começar');
  botaoComecar.position(width/2 - 30, height/2 + 10);
  botaoComecar.mousePressed(() => tela = 1);
  botaoComecar.hide();
}

function draw() {
  background(200, 240, 255);
  
  if (tela === 0) {
    textAlign(CENTER);
    textSize(24);
    fill(50, 100, 200);
    text('Conexão\nCampo e Cidade', width/2, height/2 - 30);
    textSize(14);
    fill(0);
    text('Capture itens que caem!', width/2, height/2);
    botaoComecar.show();
    
  } else if (tela === 1) {
    botaoComecar.hide();
    textAlign(LEFT);
    textSize(16);
    fill(0);
    text('Instruções:', 10, 30);
    textSize(12);
    text('- ← / → para mover', 10, 60);
    text('- Campo: +10 pts', 10, 85);
    text('- Cidade: +15 pts', 10, 110);
    text('- ENTER para jogar', 10, 135);
    
  } else if (tela === 2) {
    if (frameCount % 60 === 0) {
      itens.push(new Item());
    }
    for (let i = itens.length - 1; i >= 0; i--) {
      itens[i].update();
      itens[i].draw();
      if (itens[i].capturado(player)) {
        pontos += itens[i].pontos;
        itens.splice(i, 1);
      } else if (itens[i].y > height) {
        itens.splice(i, 1);
      }
    }
    player.update();
    player.draw();
    fill(0);
    textSize(14);
    text('Pontos: ' + pontos, 10, 20);
    if (frameCount > 60 * 30) {  // jogo de 30 segundos
      tela = 3;
    }
    
  } else if (tela === 3) {
    textAlign(CENTER);
    textSize(24);
    fill(0);
    text('Fim de Jogo!', width/2, height/2 - 10);
    textSize(18);
    text('Pontuação: ' + pontos, width/2, height/2 + 20);
  }
}

function keyPressed() {
  if (tela === 1 && keyCode === ENTER) {
    tela = 2;
    frameCount = 0;  // reseta o contador
  }
}

// Classe do jogador (cesta/carrinho)
class Player {
  constructor() {
    this.x = width / 2;
    this.y = height - 20;
    this.w = 60;    // largura menor
    this.h = 15;    // altura menor
    this.vel = 4;
  }
  update() {
    if (keyIsDown(LEFT_ARROW))  this.x -= this.vel;
    if (keyIsDown(RIGHT_ARROW)) this.x += this.vel;
    this.x = constrain(this.x, this.w/2, width - this.w/2);
  }
  draw() {
    fill(150, 75, 0);
    rectMode(CENTER);
    rect(this.x, this.y, this.w, this.h);
  }
}

// Classe dos itens que caem
class Item {
  constructor() {
    this.x = random(15, width - 15);
    this.y = -15;
    this.size = 20;          // item menor
    this.tipo = random() < 0.5 ? 0 : 1;
    this.vel = random(2, 4);
    this.pontos = this.tipo === 0 ? 10 : 15;
  }
  update() {
    this.y += this.vel;
  }
  draw() {
    rectMode(CENTER);
    if (this.tipo === 0) {
      fill(0, 200, 0);
      ellipse(this.x, this.y, this.size);
    } else {
      fill(255, 200, 0);
      rect(this.x, this.y, this.size, this.size * 0.6);
    }
  }
  capturado(player) {
    let d = dist(this.x, this.y, player.x, player.y);
    return d < (this.size/2 + player.h/2);
  }
}
