	$(document).ready(function(){
		
	document.body.onmousedown = function() { return false; } //so page is unselectable

		//Canvas stuff
		var canvas = $("#canvas")[0];
		var ctx = canvas.getContext("2d");
		var w = $("#canvas").width();
		var h = $("#canvas").height();
		var mx, my;
		
		
		
		//Audio
		
		var menuMusic = new Audio();
		menuMusic.src = "Audio/IntroMusic.mp3";
		menuMusic.loop = true;
		menuMusic.play();
		////////////////////////////////////////////////////////////////
		///////Picture Code////////////////////////////////////////////
		////// Mr.Guzy's Code  (I must give credits where it is due)//
		/////////////////////////////////////////////////////////////
		var numObjects = 0;
		var numObjectsLoaded =0;
		function loadObjects(){
			numObjectsLoaded++;
		}
		
		function makePicture(path){			//a function to make source all the images
			var newPic = new Image();
			newPic.src= path;
			newPic.onload = loadObjects;
			
			numObjects++;
			
			return newPic;
		}
		
		//////////////////////////////////////////////////////////////////	
		///// Mr.Guzy's Code  (I must give credits where it is due)////
		/////////////////////////////////////////////////////////////
		var stonetile=[];
		stonetile[1] = makePicture("Picture/MapStoneTile.png");			//to source one type of stone
		stonetile[2] = makePicture("Picture/MapStoneTile1.png");		//to source one type of stone
		stonetile[3] = makePicture("Picture/MapStoneTile2.png");		//to source one type of stone
		stonetile[4] = makePicture("Picture/MapStoneTile3.png");		//to source one type of stone

		
		///////////////////////////////////////////////////////	
		var MainLogo = makePicture("Picture/MainLogo.png");					//to source the main logo
		var MainlogoButton  = 	makePicture("Picture/MainMenu-buttons.png");//to source the start button
		var WoodenChest =makePicture("Picture/WoodenChest.png");	//to source the chest
		var DeathMenuButton = makePicture("Picture/DeathMenu-Buttons.png"); //to source the death screen images
		var healthpotion = makePicture("Picture/health-potion.png"); //to source the health potion
		var XPpotion = makePicture("Picture/XP_Potion.png"); //to source the xp potion

		 
		 var VolumeOff = makePicture("Picture/VolumeOff.png");//volume off button
		 var VolumeOn = makePicture("Picture/VolumeOn.png");//volume on button
		 
		/////////////////////////////////////////////////////
			
		var Playermove = makePicture("Picture/WalkingSet.png"); //player move all four direction	
		var EnemyMove =  makePicture("Picture/EnemyWalkingSet.png");	//the goblin image sourced
		
		///////////////////////////////////////////////////////
		var stopleft =false;		//to stop the player to enter wall in the left direction
		var stopup =false;			//to stop the player to enter wall in the up direction
		var stopdown =false;		//to stop the player to enter wall in the down direction
		var stopright =false;		//to stop the player to enter wall in the right direction
		//////////////////////////////
		//// Other///////////////////
		var screen= 0; // different screen for different menus 0-main menn , 1-game screen.2-death screen/restart, 3 - option
		var dungeonLevel=1;		//starting dungeon level, also to increase dungeon level
		var chest = [];		// to create multiple chest	
		var NumOFChest = 5;		//the maximum number of chest
		////////////////////////////////
		////////Death Screen variables//
		var enemiesKilled = 0;		//to keep tracked of total enemies killed
		var EXPCollected = 0;		//to keep track of total of xp collected
		
		///////////////////////////////
		///// 2D array for map tiles///
		var scaleMapSize =1;	//scale x and y of map
		var scale =1;			//scale width and height of tile
		var mapW = (30)*scale;		//the width of one block
		var mapH = (30)*scale;		//the height of one block
		var mapX = (20)*scaleMapSize;		//4 to -
		var mapY = (20)*scaleMapSize;		//- 3 ratio (x /Y)
		var GapTiles = 0 ;				// the distance between one block to another - in the game it will be zero


		var controlLight = 1;		//controls how dark the game screen gets. 1=black, 0.3= visible 
		
		var map = [];					// the 2d array to draw the entire game
		var RandomRoom =1+Math.floor(Math.random()*2);		// to create virtual rooms, with random code
		var blackness = [];						// to create a black wall, and make it disappear until player walks through it
		var item = []; // to store all the items, such as health potion, XP potions, etc
		//////////////////////////////////////////
		////////////Player Setting////////////////
		var counterX = 0;					//to simulate player walking
		var moveX = 30;					//to move the player on the x-plane
		var moveY = 30;					//to move the player on the y-plane
		var Xplane = 2;		//set original x position of player
		var Yplane = 2;		//set original y position of player	
		
		////////////////////////////////////
		///////Enemy setting///////////////
		var NumOFEnemy =9;			// the total number of emeny per level
		var startEnemyLv = 1;		//starting enemy level
		var IncreaseEnemyLvl = 0; //to increase enemy lvl as increase in level of dungeon
		var basicEnemy = [];			//to keep track of all the enemies

		//////////////////////////////////////////
		////// Make the tiles, and black screen//
		///////////////////////////////////////
			for(var i  = 0; i  < mapX; i++){	
				map[i]=[];		
				blackness[i]=[];	
				for(var j  = 0; j  < mapY; j++){
					map[i][j]=makeTile(i,j,"blue");
					blackness[i][j] = makeBlackness(i,j);
				}
			}
			
		/////////////////////////////
		//// Load and Save variables
		/////////////////
		var heath = 0;		// to load and save health
		var attack = 0;		// to load and save attack
		var defence = 0;	// to load and save defence
		var level = 0; 		// to load and save level
		
	
		//////////////////////////////////////////
		//////////Tile objects////////////////
		//////////////////////////////////
		function makeTile(a,b,RGB){
			var result = {
				x:(a*(mapW+GapTiles)),
				y:(b*(mapH+GapTiles)),
				width:mapW,	
				height:mapH,
				colour:RGB,
				RandomDoor : 1+Math.floor(Math.random()*2 ),			//randomness of wall to appear 
				RandomStone: 1+Math.floor(Math.random()*4),
				RandomChest:1+Math.floor(Math.random()*8),
				draw:function(){
					ctx.fillStyle = this.colour;
					ctx.fillRect(this.x,this.y,this.width,this.height); 				
						for(var i = 0; i < mapY; i++){
							map[0][i].colour = "black";
							map[mapX-1][i].colour = "black";
							map[i][0].colour = "black";
							map[i][mapY-1].colour = "black";
						}
					for(var k=0 ; k < mapX-1; k++){
						map[k][3+RandomRoom ].colour = "black";
						map[k][7+RandomRoom].colour = "black";
						map[k][13+RandomRoom].colour = "black";
						map[3+RandomRoom][k].colour = "black";
						map[7+RandomRoom][k].colour = "black";
						map[13+RandomRoom][k].colour = "black";
					}
			
				for(var c =1; c < mapX-2; c++)for(var v = 1; v < mapY-2;v++){
						if(map[c][v].RandomDoor==1)map[c][v].colour="blue";
					}		
				}
			}
			return result
		}
		////////////////////////////
		/////Player Object//////////
		function makePlayer(Lv){
			var result = {
				x:(mapW)*(Xplane),
				y:(mapH)*(Yplane),
				width:mapW,
				height:mapH,
				sx:64*counterX,
				sy:128,
				swidth:64,
				sheight:55,
				TopLeftExit:{x:map[2][2].x,y:map[2][2].y,action:false},
				BottomRightExit:{x:map[17][17].x,y:map[17][17].y,action:true},
				colour:"black",
				stats:{attack:Lv+8,defence:Lv+7,health:Lv*50,level:Lv,XP:Lv*50,NeedToLevel:0},
				draw: function(){
					ctx.drawImage(Playermove,this.sx,this.sy,this.swidth,this.sheight,this.x,this.y,this.width,this.height);
					ctx.fillStyle='green';
					if(counterX > 576)this.sx = 64;	 
				},
				LevelUp:function(){
					if(this.stats.NeedToLevel == this.stats.XP){
							this.stats.level= this.stats.level+1;
							this.stats.health =  this.stats.level*50;
							this.stats.attack = this.stats.level +8;
							this.stats.defence = this.stats.level+7;
							this.stats.XP = this.stats.level*50;
							this.stats.NeedToLevel = 0;
					}
				},
				nextLevel:function(){
					ctx.fillStyle='gold';
					ctx.fillRect(this.TopLeftExit.x,this.TopLeftExit.y,30,30);
					ctx.fillRect(this.BottomRightExit.x,this.BottomRightExit.y,30,30);
					if(this.x == this.TopLeftExit.x && this.y == this.TopLeftExit.y){
						if(this.TopLeftExit.action == true){
							dungeonLevel+=1;
							IncreaseEnemyLvl+=1;
							init(IncreaseEnemyLvl);
						}
						this.TopLeftExit.action = false;
						this.BottomRightExit.action = true;
					}
					if(this.x == this.BottomRightExit.x && this.y == this.BottomRightExit.y){
						if(this.BottomRightExit.action == true){
							dungeonLevel+=1;
								IncreaseEnemyLvl+=1;
								init(IncreaseEnemyLvl);
						}
						this.BottomRightExit.action = false;
						this.TopLeftExit.action = true;
					}
				},
				KillHero:function(){
					if(this.stats.health < 1)screen = 2;		//when health reaches zero, it displays the death screen
					
				} 
			}
			return result
		}
		var Hero = makePlayer(1);		//makes new player with starting level of one
		////////////////////////
		//// To make enemies 
		////////////////////////
		function makeEnemy(xPosition,yPosition,Lv){
			var result = {
				x:xPosition,
				y:yPosition,
				width:30,
				height:30,
				sx:64*0,
				sy:64*2,
				swidth:64,
				sheight:55,
				direction:1+Math.floor(Math.random()*1),
				colour:"red",
				stats:{attack:Lv+6,defence:Lv+3,health:Lv*20,level:Lv},
				GiveXp:true,
				draw:function(){
					ctx.drawImage(EnemyMove,this.sx,this.sy,this.swidth,this.sheight,this.x,this.y,this.width,this.height);
					ctx.fillStyle='white';
					ctx.fillText("L:"+this.stats.level,this.x-1,this.y-4);
					ctx.fillText("H: "+Math.floor(this.stats.health),this.x+17,this.y+7);
					ctx.fillText("A: "+this.stats.attack,this.x+17,this.y+17);
					ctx.fillText("D: "+this.stats.defence,this.x+17,this.y+27);
				},
				DamageHero:function(){
					if(this.x-30 == Hero.x || this.x == Hero.x || this.x+30 == Hero.x ){
						if(this.y-30 == Hero.y || this.y == Hero.y|| this.y+30 == Hero.y){
							if(this.stats.attack-Hero.stats.defence > 0 ){
								Hero.stats.health-= 0.02*(this.stats.attack);
							}
							if(this.stats.attack-Hero.stats.defence < 0 || this.stats.attack-Hero.stats.defence  ==  0){
								Hero.stats.health-= 0.01*(this.stats.attack);
							}
							if(this.stats.attack == Hero.stats.defence){
								Hero.stats.health-= 0.01*(this.stats.attack);
							}
						}
					}	
				},
				mouseOver:function(a,b){
					return a > this.x && a < this.x+this.width && b > this.y && b < this.y+this.height
				}
			}
			return result
		}
		//////////////////////////
		//////// Make Chest
		////////////////////////
			function makeChest(xPosition,yPosition){
				var result = {
					x:xPosition,
					y:yPosition,
					width:30,
					height:30,
					sx:0,
					sy:0,		// 0 is close chest.. 34 is open chest
					swidth:34,
					sheight:31, 
					Source:WoodenChest,
					item:1+Math.floor(Math.random()*2),
					draw:function(){
						ctx.drawImage(this.Source,this.sx,this.sy,this.swidth,this.sheight,this.x,this.y,this.width,this.height);	
					},
					onClick:function(a,b){
						return a > this.x && a < this.x+this.width && b > this.y && b < this.y+this.height
					},
					mouseOver:function(a,b){
						return a > this.x && a < this.x+this.width && b > this.y && b < this.y+this.height
					}

				}
				return result
			}	
		//////////////////////////
		// menu screen
		////////////////////////
		function makeMenu(xPosition,yPosition,widthBlock,heightBlock,colourBlock,colourText,textFont){
			var result = {
				x:xPosition,
				y:yPosition,
				width:widthBlock,
				height:heightBlock,
				colour:colourBlock,
				colourtext:colourText,
				textfont:textFont,
				MainLogoSource:MainlogoButton,
				MainLogoSourceX:w/2-(181/2),
				MainLogoSourceY:h/2,
				DSButtonSource:DeathMenuButton,
				drawInGame:function(){
					ctx.save();
						ctx.fillStyle= this.colour;
						ctx.fillRect(this.x,this.y,this.width,this.height);
						ctx.fillStyle= this.colourtext;
						ctx.font =this.textfont;
						ctx.fillText(" Level:"+Hero.stats.level,w/2-150,622);
						ctx.fillText(" XP:  " + Hero.stats.NeedToLevel +" / " +Hero.stats.XP,w/2,622);
						ctx.fillText(" Health:"+Math.floor(Hero.stats.health),w/2-70,682);
						ctx.fillText(" Attack:"+Hero.stats.attack,w/2-150,652);
						ctx.fillText(" Defence:"+Hero.stats.defence,w/2,652);
						ctx.font = "20px Verdana";
						ctx.fillText("Dungeon Level: "+dungeonLevel,400,h-10);	
					ctx.restore();
				},
				drawMainMenu:function(){
					ctx.save();				
						ctx.fillStyle=this.colour;
						ctx.fillRect(this.x,this.y,this.width,this.height);
						ctx.fillStyle= this.colourtext;
						ctx.font =this.textfont;
						ctx.drawImage(MainLogo,0,30);	
						ctx.drawImage(this.MainLogoSource,this.MainLogoSourceX,this.MainLogoSourceY);
					ctx.restore();
				},
				drawDeathMenu:function(){
					ctx.save();
						ctx.globalAlpha=0.22;
						ctx.fillStyle=this.colour;
						ctx.fillRect(this.x,this.y,this.width,this.height);
					ctx.restore();	
					ctx.save();	
						ctx.drawImage(this.DSButtonSource,this.MainLogoSourceX,this.MainLogoSourceY);
						ctx.fillStyle='black';
						ctx.fillRect(this.x,600,this.width,100);
						ctx.fillStyle= this.colourtext;
						ctx.font =this.textfont;
						ctx.fillText("You are Dead",170,120);
						ctx.font ="16px Verdana"
						ctx.fillText("Dungeon Level Reached:  " + dungeonLevel,170,230);
						ctx.fillText("Enemies Killed:  " + enemiesKilled,170,280);
						ctx.fillText("Player Level Reached:  " + Hero.stats.level,170,330);
						ctx.fillText("EXP Collected:  " + EXPCollected,170,380);
						ctx.fillText("Total Score:  " + (dungeonLevel + enemiesKilled + Hero.stats.level+EXPCollected),170,430);
					ctx.restore();	
				
				},
				drawOptionMenu:function(){
					ctx.save();
						ctx.fillStyle=this.colour;
						ctx.fillRect(this.x,this.y,this.width,this.height);
						ctx.fillStyle= this.colourtext;
						ctx.font =this.textfont;
						ctx.fillText("Load/Save Screen",w/2-150,h/2-250);
					ctx.restore();
				}
			}
			return result
		}
		var inGameMenu = makeMenu(0,600,600,100,"black","orange", "20px Verdana");
		var MainMenu = makeMenu(0,0,600,700,"black","black", "16px Verdana");
		var DeathMenu = makeMenu(0,0,600,700,"gold","white","40px Verdana");
		var optionMenu = makeMenu(0,0,600,700,"black","white","40px Verdana");
		//////////////////////////////
		////// To Make Button ///////
		////////////////////////////
			function makeButton(Xposition,Yposition,ButtonBlockW,ButtonBlockH,Colour){
				var result = {
					x:Xposition,
					y:Yposition,
					width:ButtonBlockW,
					height:ButtonBlockH,
					colour:Colour,
					drawMainMenuButton:function(){
						ctx.save();
							ctx.globalAlpha=0;
							ctx.fillStyle =this.colour;
							ctx.fillRect(this.x,this.y,this.width,this.height);
						ctx.restore();	
					},
					drawDeathMenuButtons:function(){
						ctx.save();
							ctx.globalAlpha=0;
							ctx.fillStyle =this.colour;
							ctx.fillRect(this.x,this.y,this.width,this.height);
						ctx.restore();	
					},
					draw:function(){
						ctx.save();
							ctx.globalAlpha = 1;
							ctx.fillStyle = this.colour;
							ctx.fillRect(this.x,this.y,this.width,this.height);
							ctx.drawImage(VolumeOn,this.x,this.y,this.width,this.height);
						ctx.restore();
					},
					drawLoadSaveButton:function(){
						ctx.save();
							ctx.globalAlpha = 1;
							ctx.fillStyle = this.colour;
							ctx.fillRect(this.x,this.y,this.width,this.height);
						ctx.restore();
					},
					onClick:function(a,b){	
						return a > this.x && a < this.x+this.width && b > this.y && b < this.y+this.height
					}
				}
				return result
			}
		var newbutton = makeButton(MainMenu.MainLogoSourceX,MainMenu.MainLogoSourceY,181,52.5,"red");
		var loadbutton = makeButton(MainMenu.MainLogoSourceX,MainMenu.MainLogoSourceY+52.5,181,52.5,"blue");
		var optionbutton = makeButton(MainMenu.MainLogoSourceX,MainMenu.MainLogoSourceY+105,181,52.5,"brown");
		var exitbuttonMM = makeButton(MainMenu.MainLogoSourceX,MainMenu.MainLogoSourceY+157.5,181,52.5,"purple");
		
		var exitbuttonDS = makeButton(MainMenu.MainLogoSourceX,MainMenu.MainLogoSourceY+52.5,181,52.5,"red");
		var newbuttonDS = makeButton(MainMenu.MainLogoSourceX,MainMenu.MainLogoSourceY,181,52.5,"green");
		
		var volumeButton = makeButton(0,0,35,35,"black");
		
		var saveButton = makeButton(0,110,w,h/2-100,"white");
		var loadButtonLoader = makeButton(0,400,w,h/2-100,"green")
		//////////////////////////
		/////// to create black light
		///////////////////////
		function makeBlackness(a,b){
			
			var result = {
				x:(a*(mapW+GapTiles)),
				y:(b*(mapH+GapTiles)),
				width:mapW,
				height:mapH,
				colour:'black',
				PercentOFBlack:controlLight,
				draw:function(){
					ctx.save();
					ctx.globalAlpha=this.PercentOFBlack;
					ctx.fillStyle=this.colour;
					ctx.fillRect(this.x,this.y,this.width,this.height);
					ctx.restore();
				},
				ChangeBlackness:function(){
					////////////////////
						for(var i = 1; i < mapX-1; i++){
							for(var j = 1; j < mapY-1; j++){	
								if(Hero.x == map[i][j].x && Hero.y == map[i][j].y){
									for(var k = i-1; k < i+2; k++){
										for(var l = j-1; l < j+2; l++){		
											blackness[k][l].PercentOFBlack=0.3;
										}
									}
									
								}
							}
						}
					////////////////////
				}
			}
			
			return result
		}
		
		
		
		//////////////////////////////////////////////////////
		///////////////// Functions//////////////////////////
		///////////////////////////////////////////////////
		
		
		//////////////////////////////////////
		///////Map
		function drawMap(){
			for(var i  = 0; i  < mapX; i++){
				for(var j  = 0; j  < mapY; j++){
					map[i][j].draw();
				}
			}
			for(var i = 1; i < mapX-1; i++)for(var j = 1; j < mapY-1; j++){
				if(map[i][j].colour !== "black" && map[i][j].RandomStone ==1)ctx.drawImage(stonetile[1],map[i][j].x,map[i][j].y,30,30);
				if(map[i][j].colour !== "black" && map[i][j].RandomStone ==2)ctx.drawImage(stonetile[2],map[i][j].x,map[i][j].y,30,30);
				if(map[i][j].colour !== "black" && map[i][j].RandomStone ==3)ctx.drawImage(stonetile[3],map[i][j].x,map[i][j].y,30,30);
				if(map[i][j].colour !== "black" && map[i][j].RandomStone ==4)ctx.drawImage(stonetile[4],map[i][j].x,map[i][j].y,30,30);				
			}			
		}
	function CheckPlayerArea(){
		for(var i = 0; i < mapX; i++){
			for(var j = 0; j < mapY; j++){	
			//////////////////////////////
				if(Hero.y - mapH == map[i][j].y){
					if(Hero.x == map[i][j].x){
						if(Hero.colour == map[i][j].colour||Hero.y-30 == basicEnemy[0].y && basicEnemy[0].x == Hero.x)stopup = true;
							else stopup = false;
					}
				} 
			////////////////////////////////
				if(Hero.x - mapW == map[i][j].x){
					if(Hero.y == map[i][j].y){
						if(Hero.colour == map[i][j].colour || Hero.x-30 == basicEnemy[0].x && basicEnemy[0].y == Hero.y)stopleft = true;
							else stopleft = false;
					}
				} 
			///////////////////////////////
				if(Hero.y + mapH == map[i][j].y){
					if(Hero.x == map[i][j].x){
						if(Hero.colour == map[i][j].colour||Hero.y+30 == basicEnemy[0].y && basicEnemy[0].x == Hero.x)stopdown = true;
							else stopdown = false;
					}
				} 
			///////////////////////////////
				if(Hero.x + mapW == map[i][j].x){
					if(Hero.y == map[i][j].y){
						if(Hero.colour == map[i][j].colour|| Hero.x+30 == basicEnemy[0].x && basicEnemy[0].y == Hero.y)stopright = true;
							else stopright = false;
					}
				} 
			///////////////////////////////
			}
		}
	}

	function drawChest(){	
		for(var i =0; i < NumOFChest; i++){
			chest[i].draw();
		}
		
	}

	function drawEnemy(){
		
		for(var i =0; i < NumOFEnemy; i++){
			basicEnemy[i].draw();
			basicEnemy[i].DamageHero();	//deal damage to hero
			
		
			
		}
		
	}
	function AddXp(a){
		if(basicEnemy[a].GiveXp == true){
			enemiesKilled=enemiesKilled+1;
			Hero.stats.NeedToLevel+=10;
			EXPCollected=EXPCollected+10;
		}
	}
	function CheckEnemyStats(){
		for(var i =0; i < NumOFEnemy; i++){
			if(basicEnemy[i].stats.health < 1){
				
				AddXp(i);
				basicEnemy[i].GiveXp = false;
				basicEnemy[i].x = 1000;
				
			}
		}
		
	}
	function stopVision(){
			for(var i  = 0; i  < mapX; i++){
				for(var j  = 0; j  < mapY; j++){
					
					blackness[i][j].draw();
					blackness[i][j].ChangeBlackness();
					//ctx.fillStyle = "blue";
					//ctx.fillRect(i*(mapW+GapTiles),j*(mapH+GapTiles),mapW,mapH); // background tile to check code	
				}
			}
	}
	function openChest(){
		for(var i  =0; i < NumOFChest; i++){
			if(Hero.x-30 == chest[i].x || Hero.x == chest[i].x || Hero.x+30 == chest[i].x ){
				if(Hero.y-30 == chest[i].y || Hero.y == chest[i].y|| Hero.y+30 == chest[i].y){
					if(chest[i].mouseOver(mx,my)){
						canvas.style.cursor = "url('Chesticon.png'), auto";			//chest icon
						chest[i].sy = 34;
					}
					else chest[i].sy=0;
				}
			}
		}
	}	
	function sortItem(){
		var temp;
		for(var i = 0 ; i < item.length; i++){
			for(var i = 0 ; i < item.length-1; i++){
				if(item[i] > item[i+1]){
					temp = item[i+1];
					item[i+1] = item[i];
					item[i] = temp;
				}
			}
		}
		//console.log(item);
	}	
	function drawItem(){
		
		for(var i = 0; i < item.length; i++){
			if(item[i]== 1)ctx.drawImage(healthpotion,160+(209/14*i),654,209/7,306/7);
			if(item[i]== 2)ctx.drawImage(XPpotion,160+(209/14*i),654,103/3,140/3);
		}
	}
	function ChangeCursorOnEnemy(){
		for(var i  =0; i < NumOFEnemy; i++){
			if(Hero.x-30 == basicEnemy[i].x || Hero.x == basicEnemy[i].x || Hero.x+30 == basicEnemy[i].x ){
				if(Hero.y-30 == basicEnemy[i].y || Hero.y == basicEnemy[i].y|| Hero.y+30 == basicEnemy[i].y){
					if(basicEnemy[i].mouseOver(mx,my)){
						canvas.style.cursor = "url('sword.png'), auto";	// to display sword icon
					}
				}
			}
		}
		
	}
	
	function saveEntireGame(){
		localStorage.health = Hero.stats.health;
		localStorage.defence = Hero.stats.defence;
		localStorage.attack = Hero.stats.attack;
		localStorage.level = Hero.stats.level;
		
		
	}

	function loadEntireGame(){
	
		console.log(Number(localStorage.screen));
		
		
		Hero.stats.defence = Number(localStorage.defence);
		Hero.stats.attack  =Number(localStorage.attack);
		Hero.stats.level = Number(localStorage.level);
		screen = 1;
		Hero.stats.health = Number(localStorage.health);
	}	
		/////////////////////////////////
		////////////////////////////////
		////////	GAME INIT
		///////	Runs this code right away, as soon as the page loads.
		//////	Use this code to get everything in order before your game starts 
		//////////////////////////////
		/////////////////////////////
		function init(IncreaseEnemyLvl)
		{
		
		if(screen == 1)alert("Entering Dungeon Level...  " +dungeonLevel); // to display dungeon level on screen
		
		function GenRandomCoor(){
			return 30*(4+Math.floor(Math.random()*15));
		}
		for(var g =0; g < NumOFEnemy; g++){
			basicEnemy[g]=makeEnemy(GenRandomCoor(),GenRandomCoor(),startEnemyLv+IncreaseEnemyLvl);
		}
		for(var i =0; i < NumOFChest; i++){
			chest[i] = makeChest(30*(4+Math.floor(Math.random()*15)),30*(4+Math.floor(Math.random()*15)));
		}
		for(var i =1; i < mapX-1; i++){
			for(var j =1; j < mapX-1; j++){
				map[i][j].RandomDoor = 1+Math.floor(Math.random()*2);
			}
		}
		for(var i = 1; i <  mapX-1; i++){
			for(var j = 1; j < mapY-1; j++){
				blackness[i][j].PercentOFBlack = controlLight;	
			}
		}	




		//////////////////////
		///GAME ENGINE START
		//	This starts your game/program
		//	"paint is the piece of code that runs over and over again, so put all the stuff you want to draw in here
		//	"60" sets how fast things should go
		//	Once you choose a good speed for your program, you will never need to update this file ever again.

		if(typeof game_loop != "undefined") clearInterval(game_loop);
			game_loop = setInterval(paint, 20);
		}

		init(0);	
		///////////////////////////////////////////////////////
		//////////////////////////////////////////////////////
		////////	Main Game Engine
		////////////////////////////////////////////////////
		///////////////////////////////////////////////////
		function paint()
		{
		canvas.style.cursor = "url('Cursor.png'), auto";		//to display hand cursor - main cursor
		
			ctx.fillStyle = 'red';	//main debug colour
			ctx.fillRect(0,0, w, h);	//main debug screen	

			
			if(screen == 0){	//main menu screen
					MainMenu.drawMainMenu();
					newbutton.drawMainMenuButton();
					loadbutton.drawMainMenuButton();
					exitbuttonMM.drawMainMenuButton();
			}	
			if(screen == 1){			//main game screen
					drawMap(); // draws map tiles	
					Hero.LevelUp();		//allows hero to level up
					Hero.nextLevel();	//waits until player reaches certain position to move on to next level
					Hero.draw();	//draw player
					Hero.KillHero();	//the player is able to die
					CheckPlayerArea();//checks to stop player for going to walls
					drawChest();		//draw chest
					drawEnemy();	//draw enemy
					ChangeCursorOnEnemy();
					openChest();	// to open the chest image appear
					CheckEnemyStats();		//kill enemy when health reaches zero
					stopVision();			//makes screen black until player walks through it
					inGameMenu.drawInGame();	//draw in-game menu
					drawItem();		// draw various items on screen		
					
			}		
			if(screen == 2){			//death screen
				drawMap(); // draws map tiles	
				DeathMenu.drawDeathMenu();
				exitbuttonDS.drawDeathMenuButtons();
				newbuttonDS.drawDeathMenuButtons();
			}
			if(screen ==3){		//option menu
				optionMenu.drawOptionMenu();
				saveButton.drawLoadSaveButton();
				loadButtonLoader.drawLoadSaveButton();
			}
				
	if(screen !== 0){
			
					ctx.fillStyle = 'white';
					ctx.fillText("Press 'e' to access save and load menu",110,20);
					ctx.fillText("To go to main menu, just hit F5",410,20);
	}
			volumeButton.draw(); // draw volume buttons
			
			
		}////////////////////////////////////////////////////////////////////////////////END PAINT/ GAME ENGINE
		
		////////////////////////////////////////////////////////
		///////////////////////////////////////////////////////
		/////	MOUSE LISTENER 
		//////////////////////////////////////////////////////
		/////////////////////////////////////////////////////

		
		/////////////////
		// Mouse Click
		///////////////
		canvas.addEventListener('click', function (evt){
			

			
			if(screen == 0){	//menu screen
				if(newbutton.onClick(mx,my)){
					screen =1;
					//stats:{attack:Lv+8,defence:Lv+7,health:Lv*50,level:Lv,XP:Lv*50,NeedToLevel:0},
					localStorage.health = 52;
					localStorage.attack = 8;
					localStorage.defence = 7;
					localStorage.level = 1;
					//saveEntireGame();
					
				}
				if(loadbutton.onClick(mx,my))screen = 3;
				if(exitbuttonMM.onClick(mx,my)){
					
					window.close(); // close game
				}
			
			}
			
			if(screen == 1){		//game screen
				
				for(var i =0; i < NumOFEnemy; i++){
						if(Hero.x-30 == basicEnemy[i].x || Hero.x == basicEnemy[i].x || Hero.x+30 == basicEnemy[i].x ){
							if(Hero.y-30 == basicEnemy[i].y || Hero.y == basicEnemy[i].y|| Hero.y+30 == basicEnemy[i].y){
								if(Hero.stats.attack > basicEnemy[i].stats.defence){
									basicEnemy[i].stats.health-= 0.6*(Hero.stats.attack-basicEnemy[i].stats.defence); 
								}
							}
						}
					}
					
				for(var i =0; i < NumOFChest; i++){
					if(Hero.x-30 == chest[i].x || Hero.x == chest[i].x || Hero.x+30 == chest[i].x ){
							if(Hero.y-30 == chest[i].y || Hero.y == chest[i].y|| Hero.y+30 == chest[i].y){
								if(chest[i].onClick && chest[i].mouseOver(mx,my)){
									chest[i].x = 1000;
									item.push(chest[i].item);
									//console.log("before "+ item);
									for(var k =0; k < item.length-1;k++){
										sortItem();			//to sort through all the different items
									}
									
								}
						  }
						}
				}
				
			}
			
		
			if(screen == 2){		//death screen
				if(newbuttonDS.onClick(mx,my)){
							IncreaseEnemyLvl = 0;	//enemy starting at level 1
							init(IncreaseEnemyLvl);	//spawn game
							Hero.stats.health=50;	//reset health to starting health
							item.splice(0,item.length);	//wipe all items in the array
							//console.log("after"+item)
							Hero.TopLeftExit.action = false;		
							Hero.x =60;		
							Hero.y=60;
							Hero.BottomRightExit.action = true;
							dungeonLevel=1;
							Hero.stats.level= 1;
							Hero.stats.health =  Hero.stats.level*50;
							Hero.stats.attack = Hero.stats.level +8;
							Hero.stats.defence = Hero.stats.level+7;
							Hero.stats.XP = Hero.stats.level*50;
							Hero.stats.NeedToLevel = 0;		 
							 totalScore = 0;
							 enemiesKilled = 0;
							 EXPCollected = 0;	
							 LevelOFHero = 0;
											 
							screen=1;
				}
				if(exitbuttonDS.onClick(mx,my))window.close();
			
			}
			
			if(screen == 3){
				if(saveButton.onClick(mx,my)){
				alert("Save Game...")
					saveEntireGame();
				}
				if(loadButtonLoader.onClick(mx,my)){
					alert("Loading Game...")
					loadEntireGame();
				}
			}
			
			
			if(volumeButton.onClick(mx,my)){
				//alert("volume"); //to control volume buttons
				if(menuMusic.volume == 1){
					volumeButton.draw = function(){
						ctx.drawImage(VolumeOff,this.x,this.y,this.width,this.height);	//volume off picture appears
					}
					menuMusic.volume = 0;		//turn music off
				} else {
					volumeButton.draw = function(){
						ctx.drawImage(VolumeOn,this.x,this.y,this.width,this.height); //volume on picture appears
					}
					menuMusic.volume = 1;		//turn music on
				}	
				
			}
			
			
		}, false);

		
		

		canvas.addEventListener ('mouseout', function(){pause = true;}, false);
		canvas.addEventListener ('mouseover', function(){pause = false;}, false);

			canvas.addEventListener('mousemove', function(evt) {
				var mousePos = getMousePos(canvas, evt);

			mx = mousePos.x;
			my = mousePos.y;

			}, false);


		function getMousePos(canvas, evt) 
		{
				var rect = canvas.getBoundingClientRect();
				return {
					x: evt.clientX - rect.left,
					y: evt.clientY - rect.top
					};
			}
		  

		///////////////////////////////////
		//////////////////////////////////
		////////	KEY BOARD INPUT
		////////////////////////////////


		

		window.addEventListener('keydown', function(evt){
			var key = evt.keyCode;
			
		//p 80
		//r 82
		//1 49
		//2 50
		//3 51
		//w 87
		//a 65
		//s 83 
		//d 68
		//e 69
		
	//debugging 	
	
	if(key == 69){
		if(screen == 3)screen = 1;
		else screen  = 3;
	}
		if(key == 80){
			
			console.log(localStorage.health);
			console.log(localStorage.attack);
			console.log(localStorage.defence);
			console.log(localStorage.level);
			
		}
//////////////////////////////////////////////////


	if(screen == 1){	//game screen
	///////////////////////
		
		if(stopup == false){
			if(key == 87 ){
				Hero.sx = Hero.sx+64;
				counterX =  Hero.sx+64;
				Hero.y = Hero.y - moveY;
				Hero.sy =  0;
			}
		}		
		if(stopleft == false){
			if(key == 65 ){
				Hero.sx = Hero.sx+64;
				counterX =  Hero.sx+64;
				Hero.x = Hero.x - moveX;
				Hero.sy =  64;
			}
		}
		if(stopdown == false){			
			if(key == 83 ){
				Hero.sx = Hero.sx+64;
				counterX =  Hero.sx+64;
				Hero.y = Hero.y + moveY;
				Hero.sy =  128;
			}
		}
		if(stopright == false){
			if(key == 68 ){
				Hero.sx = Hero.sx+64;
				counterX =  Hero.sx+64;
				Hero.x = Hero.x + moveX;
				Hero.sy =  192;
			}
		}
	if(key == 69){			//e
		var repeatorHealth = true;	//to ensure only one potion is used at a time
		
			for(var i =0; i < item.length;i++){
				if(repeatorHealth == true)if(item[i] == 1){
					item.splice(i,1);
					Hero.stats.health+=4;
				}
					repeatorHealth = false;	//to ensure only one potion is used at a time
			}
		}
		var repeatorXP = true; //to ensure only one potion is used at a time
		if(key == 82){		//r
			for(var i =0; i < item.length;i++){
			if(repeatorXP == true)if(item[i] == 2){
					item.splice(i,1);
					Hero.stats.NeedToLevel+=3;
				}
					repeatorXP = false;	//to ensure only one potion is used at a time
			}
		}
		
		
		
		
		
	////////////////////	
	}
		
				
		}, false);




	})