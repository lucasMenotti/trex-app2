
var trex,trex_correndo,limite,solo,imagem_solo,soloInvisivel,ran,nuvem, imagem_nuvem, obstaculo;
var obstaculo1,obstaculo2,obstaculo3,obstaculo4,obstaculo5,obstaculo6,escolha_obstaculo;
var pontuacao = 0, grupo_obstaculos, grupo_nuvens,estadoJogo,JOGAR,ENCERRAR,trex_colide;
var restart, gameOver, botao_restart, botao_gameOver, som_morte,som_pulo,som_ponto, contador =0;
var highScore = 0;
JOGAR = 1;
ENCERRAR = 0;
estadoJogo = JOGAR;

function preload(){
  trex_correndo = loadAnimation("trex1.png","trex3.png","trex4.png");
  imagem_solo = loadImage("ground2.png");
  imagem_nuvem = loadImage("cloud.png");
  obstaculo1 = loadImage ("obstacle1.png");
  obstaculo2 = loadImage ("obstacle2.png");
  obstaculo3 = loadImage ("obstacle3.png");
  obstaculo4 = loadImage ("obstacle4.png");
  obstaculo5 = loadImage ("obstacle5.png");
  obstaculo6 = loadImage ("obstacle6.png");
  trex_colide = loadImage("trex_collided.png");
  restart = loadImage ("restart.png");
  gameOver = loadImage ("gameOver.png");
  som_morte = loadSound("die.mp3");
  som_pulo = loadSound("jump.mp3");
  som_ponto = loadSound("checkPoint.mp3");
  
}
function setup(){
  createCanvas(windowWidth,windowHeight);
  
  //criar um sprite do trex
  trex = createSprite(50,height-60,20,50);
  trex.addAnimation("running",trex_correndo);
  trex.addAnimation("collided",trex_colide);
  trex.scale = 0.5;
  
  //cria a variavel do solo
  solo = createSprite(200,height-70,400,20);
  solo.velocityX = -5;
  solo.addImage("ground",imagem_solo);
  solo.x = solo.width/2;
  soloInvisivel = createSprite(200,height-60,800,10);
  soloInvisivel.visible = false;
  
  grupo_obstaculos = new Group();
  grupo_nuvens = new Group();
  trex.setCollider("rectangle",-5,0,28,80,-0);
  //trex.setCollider("rectangle",-5,0,150,80,-0);
  //trex.debug = true;
  
  botao_restart = createSprite(width/2,height/2+40,10,10);
  botao_restart.visible = false;
  botao_restart.addImage(restart);
  botao_restart.scale = 0.7;
  
  botao_gameOver = createSprite(width/2,height/2,10,10);
  botao_gameOver.visible = false;
  botao_gameOver.addImage(gameOver);
  botao_gameOver.scale = 0.8;
  
}


function draw(){
  background("white");
  
   contador = contador + 1
  
  if (estadoJogo === JOGAR){
   
    //trex pula ao clicar em espaco
   if((touches.length>0|| keyDown("space"))&& trex.y>height-100) {
     som_pulo.play();
     trex.velocityY = -10;
     touches = [];
    }  
    //adiciona a gravidade
    trex.velocityY = trex.velocityY +0.700;  
    
   
    //repete o solo quando atinge a posicao 0
    if (solo.x<0){
    solo.x = solo.width/2;
    } 
    //faz q a cada 60 frames, apareca uma nuvem
    if (frameCount%60 === 00){
    gerarNuvens(); 
    } 
    pontuacao = contador;
    solo.velocityX = -5 -(pontuacao/500);
    grupo_obstaculos.setVelocityXEach(-6 -(pontuacao/550));
    //pontuacao = Math.round(pontuacao + (frameCount/60));
    gerarObstaculos();
    if (pontuacao %1000 === 0 && pontuacao > 0){
      som_ponto.play();
    }
    if(grupo_obstaculos.isTouching(trex)){
      //trex.velocityY = -10;
      som_morte.play();
      estadoJogo = ENCERRAR;
    }
    
  }else if (estadoJogo === ENCERRAR){
    
   solo.velocityX = 0;
   grupo_nuvens.setVelocityXEach(0);
   grupo_obstaculos.setVelocityXEach(0);
   grupo_obstaculos.setLifetimeEach(-1);
   grupo_nuvens.setLifetimeEach(-1);
   trex.velocityY = 0;
   //trex.y = 167;
   trex.changeAnimation("collided",trex_colide);
   botao_restart.visible = true;
   botao_gameOver.visible = true;
   if (pontuacao > highScore){
     highScore = pontuacao
   }
    if (mousePressedOver(botao_restart)){
    reiniciar();
  }
  }
  
  trex.collide(soloInvisivel);
  
  //imprime a posicao Y do trex
  //console.log(trex.y);
  
  
  drawSprites();
 
  text("pontuacao: "+ pontuacao,width-100,30);
  text("highScore: "+ highScore, 20,30);
}
 function reiniciar(){
  estadoJogo = JOGAR; 
  botao_restart.visible = false;
  botao_gameOver.visible = false;
  grupo_obstaculos.destroyEach();
  grupo_nuvens.destroyEach();
  trex.changeAnimation("running",trex_correndo);
  contador = 0;
 }
function gerarNuvens(){
  //faz as nuvens gerar em cordenadas aleatorias de 50 ate 150
  nuvem = createSprite(width,Math.round(random(height-150,height-300)),50,10);
  //velocidade da nuvem
  nuvem.velocityX = -3;
  //faz a nuvem desaparecer depois
  nuvem.lifetime = width/2;
  //adiciona a imagem da nuvem
  nuvem.addImage(imagem_nuvem);
  //faz ter um tamanho aleatorio das nuvens de 0.5 ate 0.8
  nuvem.scale = Math.round(random(0.5,0.8));
  //imprime as palavras ditas no console.log
  //console.log("oi"+" mundo "+ frameCount);
  //faz o trex ficar na frente das nuvens
  nuvem.depth = trex.depth;
  //trex.depth = trex.depth+1;
  grupo_nuvens.add(nuvem);
  //trex.depht = nuvem.depht;
  nuvem.depht = trex.depht -2;
  botao_restart.depht = trex.depht -1;
  botao_gameOver.depht = trex.depht -1;
  trex.depth = trex.depth + 3;
}

function gerarObstaculos(){
  if (frameCount%60 === 00){
  var altura,largura;
    altura = 70;
    largura =70;
  obstaculo = createSprite(width,height-90,10,40);
  obstaculo.velocityX = -6;
  escolha_obstaculo = Math.round(random(1,6));
  switch (escolha_obstaculo){
    case 1 : obstaculo.addImage(obstaculo1);
             obstaculo.y = obstaculo.y  +10
             obstaculo.setCollider("circle",0,0,30);
             break;
    case 2 : obstaculo.addImage(obstaculo2);
             obstaculo.y = obstaculo.y  +10
             obstaculo.setCollider("circle",0,0,40);
             break;
    case 3 : obstaculo.addImage(obstaculo3);
             obstaculo.y = obstaculo.y  +10
             obstaculo.setCollider("circle",0,0,50);
             break;
    case 4 : obstaculo.addImage(obstaculo4);
             obstaculo.y = obstaculo.y  +10
             obstaculo.setCollider("circle",0,0,40);
             break;
    case 5 : obstaculo.addImage(obstaculo5);
             obstaculo.y = obstaculo.y  +10
             obstaculo.setCollider("circle",0,0,50);
             break;  
    case 6 : obstaculo.addImage(obstaculo6);
             obstaculo.y = obstaculo.y  +10
             obstaculo.setCollider("circle",0,0,70);
             break;         
    default: break;         
  }
  obstaculo.scale = 0.5;  
  obstaculo.lifetime = width/2;
  grupo_obstaculos.add(obstaculo);
  
  //obstaculo.debug = true;
  
    
  }
}