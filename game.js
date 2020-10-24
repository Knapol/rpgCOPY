let c;
let ctx;

window.onload = init;

const ground = new Image();
ground.src = "ground.png";

const playerImg = new Image();
playerImg.src = "player.png";

const enemyImg = new Image();
enemyImg.src = "enemy.png";

const dragonImg = new Image();
dragonImg.src = "dragon.png";

const smithImg = new Image();
smithImg.src = "smith.png";

const swordAttack = new Audio();
swordAttack.src = "swordAttack.mp3";

const boom = new Image();
boom.src = "boom.png";

const bulletImg = new Image();
bulletImg.src = "bullet.png";

const box = 32;
let currentlyLock;
let mouse;

let enemy1Count = 5;

let items = [];
let effects = [];
let enemy1 = [];
let bullets = [];

class effect{
	constructor(x, y){
		this.x = x;
		this.y = y;
	}
}

class bullet{
	constructor(x, y, delay, lastMove){
		this.x = x;
		this.y = y;
		this.delay = delay;
		this.lastMove = lastMove;
	}
	
	giveDamage(o){
		player.hp -= o.dmg;
	}
	
	move(o){
		o.y -= 32;
	}
}

class gracz{ 
	
	constructor(x, y, hp, dmg, delay, lastAttack, gold, potion, cooldown){
		this.x = x;
		this.y = y;
		this.hp = hp;
		this.dmg = dmg;
		this.delay = delay;
		this.lastAttack = lastAttack;
		this.gold = gold;
		this.potion = potion;
		this.cooldown = cooldown;		
	}
	
	death(){
	if(player.hp<=0){
		return false;
	}else
		return true;
	}
	
	attack(o,ok){
			window.onkeydown = function(event) {				
			if(event.keyCode==70&&ok==true){
				swordAttack.play();
				o.hp -= player.dmg;
				ok = false;
			}
		}
	}
	
	heal(e){
		if(e.keyCode==72&&player.potion>=1){
			player.hp += 20;
			player.potion--;
		}
	}
	
	specialAttack(e){
		mouse = {
			x : e.x,
			y : e.y
		}
		if(items.indexOf(wand)!=-1&&player.cooldown==true){
			player.cooldown = false;
			effects.push(new effect(mouse.x, mouse.y));
			for(let i=0; i<enemy1Count; i++){
				if(mouseCollision(mouse,enemy1[i])==true){
					enemy1[i].hp -= player.dmg;
				}
			}
		}
	}
}

class enemy{
	constructor(x, y, hp, dmg, delay, lastAttack, lastMove){
		this.x = x;
		this.y = y;
		this.hp = hp;
		this.dmg = dmg;
		this.delay = delay;
		this.lastAttack = lastAttack;
		this.lastMove = lastMove;
	}
	
	attack(o){
		player.hp -= o.dmg;
	}
	
	move(o){

		let wybor=0;
			wybor = Math.floor(Math.random()* 5+1);
			
			if(wybor==1 && o.x-box>0){
				o.x -= box;
			}else if(wybor==2 && o.x+box<736){
				o.x += box;
			}else if(wybor==3 && o.y-box>0){
				o.y -= box;
			}else if(wybor==4 && o.y+box<704){
				o.y += box;
			}
	}
}

class flyEnemy{
	constructor(x, y, hp, dmg, delay, lastAttack, lastMove, attackDelay){
		this.x = x;
		this.y = y;
		this.hp = hp;
		this.dmg = dmg;
		this.delay = delay;
		this.lastAttack = lastAttack;
		this.lastMove = lastMove;
		this.attackDelay = attackDelay;
	}
	
	attack(o){
		bullets.push(new bullet(o.x, o.y, 300, null));
	}
	
	move(o){
		let wybor=0;
		wybor = Math.floor(Math.random() * 9+1);
		if(wybor==1&&o.x-box>0){
			o.x -= box;
		}else if(wybor==2&&o.x-box>0&&o.y-box>0){
			o.x -= box;
			o.y -= box;
		}else if(wybor==3&&o.x-box>0&&o.y-box<704){
			o.x -= box;
			o.y += box;
		}else if(wybor==4&&o.x+box<736){
			o.x += box;
		}else if(wybor==5&&o.x+box<736&&o.y+box>0){
			o.x += box;
			o.y -= box;
		}else if(wybor==6&&o.x+box<736&&o.y+box<704){
			o.x += box;
			o.y += box;
		}else if(wybor==7&&o.y+box>0){
			o.y -= box;
		}else if(wybor==8&&o.y+box<704){
			o.y += box;
		}
	}
}

class npc{
	constructor(x, y){
		this.x = x;
		this.y = y;
	}
	
	sell(){
		window.onkeydown = function(event){
			if(event.keyCode==66){
				document.getElementById("shop").style.visibility = "visible";
				
				document.getElementById("sword").onclick = function(){
					if(player.gold>=2&&items.indexOf(sword)==-1){
						document.getElementById("sword").innerHTML = "kupione";
						player.gold-=2;
						player.dmg+=10;
						items.push(sword);
					}
				}
				
				document.getElementById("axe").onclick = function(){
					if(player.gold>=4&&items.indexOf(axe)==-1){
						document.getElementById("axe").innerHTML = "kupione";
						player.gold-=4;
						player.dmg+=20;
						items.push(axe);
					}
				}
				
				document.getElementById("wand").onclick = function(){
					
					if(player.gold>=6&&items.indexOf(wand)==-1){
						document.getElementById("wand").innerHTML = "kupione";
						player.gold-=6;
						player.dmg+=30;
						items.push(wand);
					}
				}
				
				document.getElementById("potion").onclick = function(){
					if(player.gold>=6){
						player.gold-=6;
						player.potion+=1;
					}
				}
			}
		}
	}
}

let player = new gracz(10*box, 10*box, 100, 10, 1000, null, 100, 1, true);

let smith = new npc(14 * box,14 * box);

let dragon = new flyEnemy(Math.floor(Math.random() * 22+1) * box, Math.floor(Math.random() * 22+1) * box, 20, 10, 500, null, null, 2000);

const cycleLoop = [0, 1, 2, 3, 4, 5, 6, 7];
let currentWidthIndex = 0;
let currentHeight = 0;
let frameCount = [];

const width = 128;
const height = 128;

function init(){ //wykonje się na początku 
	c = document.getElementById("game");
	ctx = c.getContext("2d");
	
	makeEnemy();
	window.addEventListener("keydown", player.heal, false);
	c.addEventListener("mousedown", player.specialAttack, false); //sprawdzanie czy gracz wykonał attak specjalny
	window.requestAnimationFrame(gameLoop);
}

function makeEnemy(){
	for(let i=0; i<enemy1Count; i++){
		enemy1[i] = new enemy(Math.floor(Math.random() * 22+1) * box, Math.floor(Math.random() * 22+1) * box, 20, 10, 1000, null, null);
	}
}

function drawFrame(frameX, frameY, mouseX, mouseY, canvasX, canvasY){ //funckja do tworzenia klatek animacji ataku magicznego
	ctx.drawImage(boom, frameX * width, frameY * height, width, height, mouseX-64, mouseY-64, width, height);
}

function draw(){
	ctx.clearRect(0,0,768,704);
	
	ctx.drawImage(ground,0,0);
	ctx.drawImage(playerImg,player.x,player.y);
	
	for(let i=0; i<enemy1Count; i++){ //rysowanie przeciwników
			ctx.drawImage(enemyImg,enemy1[i].x,enemy1[i].y);
			
			ctx.font = "30px Arial";
			ctx.fillText(enemy1[i].hp,enemy1[i].x,enemy1[i].y-10);
	}
	
	for(let i=0; i<effects.length; i++){ //rysowanie efektów
		frameCount++;
		drawFrame(cycleLoop[currentWidthIndex], currentHeight, effects[i].x, effects[i].y, 0, 0); //decyduje którą klatke narysowaćwazny jest cycle 

		if(frameCount>5){//wczytywanie pojedyńczej klatki co 5 klatek na sekunde
			frameCount = 0;
			currentWidthIndex++;
			
			if(currentWidthIndex >= cycleLoop.length) {
				currentWidthIndex = 0;
				currentHeight++;
			}
			if(currentHeight>=4){
				effects.splice(i, 1);
				currentWidthIndex = 0;
				currentHeight = 0;
				player.cooldown = true;
			}
		}
	}
	
	for(let i=0; i<bullets.length; i++){ //rysowanie pocisków
		ctx.drawImage(bulletImg,bullets[i].x,bullets[i].y);
	}
	
	ctx.drawImage(smithImg,smith.x,smith.y);
	
	ctx.drawImage(dragonImg,dragon.x,dragon.y);
	
	ctx.fillRect(680,0,88,88);
	ctx.font = "15px Arial";
	ctx.fillStyle = "white";
	ctx.strokeStyle = "white";
	ctx.strokeRect(680,0,88,88);
	ctx.fillText("HP: "+player.hp,685,20);
	ctx.fillText("DMG: "+player.dmg,685,40);
	ctx.fillText("GOLD: "+player.gold,685,60);
	ctx.fillText("POTION: "+player.potion,685,80);
	
	ctx.fillStyle = "black";
	ctx.font = "30px Arial";
	ctx.fillText(player.x+" "+player.y,10,50);
}	

function enemyDeath(){
	for(let i=0; i<enemy1Count; i++){
		if(enemy1[i].hp<=0){
			enemy1.splice(i, 1);
			enemy1Count-=1;
			player.gold++;
		}
	}
}

function mouseCollision(a,b){
	if(
		a.x>(b.x-box) && a.x<(b.x+2*box) && a.y>(b.y-box) && a.y<(b.y+2*box)
	){
		return true;
	}
		return false;
}

function checkCollision(a,b){
	if(
		(a.x==(b.x+box)&&a.y==(b.y-box))||
		(a.x==(b.x+box)&&a.y==b.y)||
		(a.x==(b.x+box)&&a.y==(b.y+box))||
		
		(a.x==(b.x-box)&&a.y==(b.y-box))||
		(a.x==(b.x-box)&&a.y==b.y)||
		(a.x==(b.x-box)&&a.y==(b.y+box))||
		
		(a.x==b.x&&a.y==(b.y+box))||
		(a.x==b.x&&a.y==(b.y-box))||
		(a.x==b.x&&a.y==(b.y))
	){
		return true;
	}
		return false;
}

function checkMovementCollision(a,b){
	if(a.x==(b.x+box)&&a.y==b.y){
		currentlyLock="left";
		return true;
	}else if(a.x==(b.x-box)&&a.y==b.y){
		currentlyLock="right";
		return true;
	}else if(a.x==b.x&&a.y==(b.y+box)){
		currentlyLock="up";
		return true;
	}else if(a.x==b.x&&a.y==(b.y-box)){
		currentlyLock="down";
		return true;
	}
	currentlyLock=null;
	return false;
}

function gameManager(){
	
	let now = new Date(); 
	let allowAttack = false;
	
	enemyDeath();
	
	for(let j=0; j<enemy1Count; j++){ //enemy1

		if(checkCollision(player, enemy1[j])==true){
			
			if(!player.lastAttack || now - player.lastAttack > player.delay){
				allowAttack = true;
				player.attack(enemy1[j],allowAttack);
				player.lastAttack = now;
			}
			
			if(!enemy1[j].lastAttack || now - enemy1[j].lastAttack > enemy1[j].delay){
				enemy1[j].attack(enemy1[j]);
				enemy1[j].lastAttack = now;
			}
		}else{
			if(!enemy1[j].lastMove || now - enemy1[j].lastMove > enemy1[j].delay){
				enemy1[j].move(enemy1[j]);
				enemy1[j].lastMove = now;
			}
		}
	}
	
	for(let j=0; j<1; j++){	//npc
		if(checkCollision(player, smith)==true){
			//kod co się robi ->funckja z klasy<-
			smith.sell();
			
			if(checkMovementCollision(player, smith)==true)
				checkMovementCollision(player, smith);
			else
				currentlyLock=null;
		}else{
			document.getElementById("shop").style.visibility = "hidden";
			currentlyLock=null;
		}
	}
	
	if(!dragon.lastMove || now - dragon.lastMove > dragon.delay){
				dragon.move(dragon);
				dragon.lastMove = now;
	}

	if(!dragon.lastAttack || now - dragon.lastAttack > dragon.attackDelay){
				dragon.attack(dragon);
				dragon.lastAttack = now;
	}
	
	for(let i=0; i<bullets.length; i++){
		if(!bullets[i].lastMove || now - bullets[i].lastMove > bullets[i].delay){
				bullets[i].move(bullets[i]);
				bullets[i].lastMove = now;
		}
	}
}

window.addEventListener('keydown', playerMove);//sprawdza czy gracz wykonał ruch
function playerMove(e){
	if(e.keyCode==87&&currentlyLock!="up"&&player.y-box>0){
		player.y -= box;
	} else if(e.keyCode==83&&currentlyLock!="down"&&player.y+box<704){
		player.y += box;
	}
	
	if(e.keyCode==65&&currentlyLock!="left"&&player.x-box>0){
		player.x -= box;
	} else if(e.keyCode==68&&currentlyLock!="right"&&player.x+box<736){
		player.x += box;
	}
}

function gameLoop(){//pętla gry
	gameManager();
	draw();
	if(player.death()==true){
    window.requestAnimationFrame(gameLoop);
	}
}