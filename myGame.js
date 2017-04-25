var highScore = 0;
var x=75, y=1;
var count=0;
var obs = [];
var speed = 0;
var obFreq = 0;
var score = 0;
var state=false;
var platx = 0;

var c = document.getElementById('canvas');
var ctx = c.getContext('2d');

function drawRun(){
	
	//difficulty handling
	if(count%500 == 249 && obFreq<5){
		obFreq++;
	}
	else if(count%500 == 499 && speed<5){
		speed++;
	}



	if(count%(30-(5*obFreq))==0){
		obs[obs.length] = {
			posx: c.width,
			posy: Math.floor(Math.random()*3)
		};
	}

	ctx.save();

	//background
	var backgrd = new Image();
	backgrd.src = "images/lava-bkgrnd.jpg";
	backgrd.onload = function(){
		ctx.drawImage(backgrd, 0, 0, c.width, c.height);

		ctx.font = "30px Arial";
		ctx.fillStyle = "#FFFFFF";
		ctx.fillText("Score: "+ score, 10, 30);
		ctx.fillText("High score: "+highScore, 550, 30);
		
		ctx.font = "15px Arial";
		if(speed==5){
			ctx.fillText("Spike Speed: MAX", 200, 30);
		}
		else{
			ctx.fillText("Spike Speed: "+(speed+1), 200, 30);
		}

		if(obFreq==5){
			ctx.fillText("Spike Frequency: MAX", 350, 30);
		}
		else{
			ctx.fillText("Spike Frequency: "+(obFreq+1), 350, 30);
		}

		//obstacles
		ctx.fillStyle = "#6666FF";
		for (var i = 0; i <= obs.length; i++) {
			if(obs[i].posx>x && obs[i].posx<x+40 && obs[i].posy==y) {
				state=false;
			}
			else if(obs[i].posx>-15){
				ctx.beginPath();
				ctx.moveTo(obs[i].posx , 95 + (150*obs[i].posy));
				ctx.lineTo(obs[i].posx-10, 125 + (150*obs[i].posy));
				ctx.lineTo(obs[i].posx+10, 125 + (150*obs[i].posy));
				ctx.fill();

				obs[i].posx-=(5+(3*speed));
			}
			else if(obs[i].posx<=-15){
				score+=25;
				obs.splice(i,1);

				ctx.beginPath();
				ctx.moveTo(obs[i].posx , 95 + (150*obs[i].posy));
				ctx.lineTo(obs[i].posx-10, 125 + (150*obs[i].posy));
				ctx.lineTo(obs[i].posx+10, 125 + (150*obs[i].posy));
				ctx.fill();
				obs[i].posx-=(5+(3*speed));				//not sure why but without this the i+1 obstacle moves back a bit when the ith obs is removed
			}
		}
	}

	//platforms
	var plats = new Image();
	plats.src = "images/platform.png";
	plats.onload = function(){
		for(var i = 0; i<5; i++){
			ctx.drawImage(plats, (platx%200)+200*i, 425, 200, 25);
			ctx.drawImage(plats, (platx%200)+200*i, 275, 200, 25);
			ctx.drawImage(plats, (platx%200)+200*i, 125, 200, 25);
		}
		platx-=(5+(3*speed));
	}


	//our character
	var guy = new Image();
	var p = Math.floor((count%8)/2)+1;
	guy.src = "images/guy"+p+".png";
	guy.onload = function(){
		ctx.drawImage(guy, x, 75+150*y);
	}

	count++;

	ctx.restore();
	if(state==true){
		window.setTimeout("drawRun()", 1000/35);
	}
	else{
		obs=[];
		y=1;
		window.setTimeout("drawEnd()", 1000/50);
	}

}

function drawStart(){
	highScore = localStorage.getItem("HighScore");
	if(highScore==null){
		highScore=0;
	}

	var backgrd = new Image();
	backgrd.src = "images/title-screen.jpg";
	backgrd.onload = function(){
		ctx.drawImage(backgrd, 0, 0, c.width, c.height);	
		ctx.fillStyle = "#FFFFFF";
		ctx.font = "30px Arial";
		ctx.fillText("Use Up/Down arrows to switch platforms", canvas.width/2 - 275, canvas.height/2 + 125);
		ctx.fillText("Press Spacebar to begin!", canvas.width/2 - 175, canvas.height/2 + 175);

		var title = new Image();
		title.src = "images/title.png";
		title.onload = function(){
			ctx.drawImage(title, 200, 100, 400, 100);
		}
	}
}

function drawEnd(){
	var endImg = new Image();
	endImg.src = "images/game-over.png";


	ctx.fillStyle = "#000000";
	ctx.fillRect(0, 0, 800, 450);
	ctx.fillStyle = "#FFFFFF";
	ctx.font = "50px Arial";
	ctx.fillText("Press Spacebar to Retry", canvas.width/2 - 260, canvas.height/2 + 125);

	endImg.onload = function(){
		ctx.drawImage(endImg, 200, 100, 400, 100);
	}

	if(score>highScore){
		highScore = score;
		localStorage.setItem("HighScore", score);
		
		ctx.font = "italic 30px serif";
		ctx.fillText("*NEW HIGHSCORE!*", canvas.width/2 - 135, canvas.height/2 + 50);		

	}


	ctx.font = "30px Arial";
	ctx.fillText("High score: "+highScore, 550, 30);
	ctx.fillText("Score: "+ score, 10, 30);
}

function check(e){
	if(e.keyCode==32 && state==false){
		score=0;
		speed=0;
		obFreq=0;
		state=true;
		drawRun();
	}

	else if(e.keyCode==38 && state==true){
		if(y>0){
			y--;
		}
	}
	else if(e.keyCode==40 && state==true){
		if(y<2){
			y++;
		}
	}
}