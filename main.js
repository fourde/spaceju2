var canvas = document.querySelector("canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
var ctx = canvas.getContext("2d");

var img_space_ship = new Image();

var img_monster = new Image();

var img_weapon = new Image();

var img_monster_2 = new Image();


var frameRateMonster = 800;
var frameRateWeapon = 100;
var ammo_delay =3000;
var ammo_amount = 2 ;


var touch = new Audio("touch.mp3");

var gameElement = document.getElementById("game_area");
var state_btn = document.getElementById("state_btn");
var scoreElement = document.getElementById("score_display");
var ammoElement = document.getElementById("ammo_display");


// Interval variables
var weapon_ID;
var monster_weapon_ID;
var monster_move_ID;
var new_ammo_ID;
//OBJECT SPACESHIP


var spaceShip  = {
    vie: 3,
    game: 1,
    x: canvas.width*0.5,
    y: canvas.height*0.8,
    direction: 1,
    draw: function () {
        var xb = this.x;
        var yb = this.y;
        img_space_ship.onload = function() {
            ctx.drawImage(img_space_ship, 0, 60, 293, 272, xb, yb, 65, 40);
        };
        img_space_ship.src = "space-invader.png";
    },
};
spaceShip.draw();


//OBJECT MONSTER


var monster  = {
    number: 30,
    x: canvas.width*0.2,
    y: canvas.height*0.07,
    direction: 1,
    tabMonster:[],
    draw: function () {
        var tabLength = this.tabMonster.length;
        var tabTest = this.tabMonster;
        img_monster.onload = function() {
            for (var i=0; i<tabLength;i++){
                ctx.drawImage(img_monster, 0, 60, 1600, 950, tabTest[i].x, tabTest[i].y, 65, 40);
                
                if( tabTest[i].vie == 2 ) {
                    ctx.drawImage(img_monster_2, 0, 60, 1600, 950, tabTest[i].x, tabTest[i].y, 65, 40);
                }
            }
        };
        img_monster.src = "mechant1.png";
        img_monster_2.src = "mechant2.png";
    },
};


//INITIALSIATION LIST MONSTER

for(var j=0; j<2; j++){
    for (var i=0; i<10;i++){
        monster.tabMonster.push({x: monster.x+i*canvas.width*0.06, y:monster.y+j*canvas.height*0.08,
                vie:1});
        if (j==0) {
            monster.tabMonster[i].vie=2;
        }
    }
}
console.log(monster.tabMonster);
monster.draw();


//OBJET MISSILE


var weapon ={
    number:1000,
    x:spaceShip.x,
    y:spaceShip.y-canvas.height*0.05,
    tabWeapon: [],
  /*  draw: function () {
        var xb = this.x;
        var yb = this.y;
        img_weapon.onload = function() {
            ctx.drawImage(img_weapon, 90, 0, 220, 383, xb, yb, 10, 40);
        };
        img_weapon.src = "SpaceInvadersLaser.png";
    } */
    
    /*drawMonsterWeapon: function () {
        var xb = this.x;
        var yb = this.y;
        img.onload = function() {
            ctx.drawImage(img, 90, 0, 220, 383, xb, yb, 10, 40);
        };
        img.src = "SpaceInvadersLaser.png";
    }*/
    
}
//LOOP MONSTRE


function updateMonster() {
    
        for (var i=0; i<monster.tabMonster.length;i++){
            ctx.clearRect(monster.tabMonster[i].x, monster.tabMonster[i].y, 65, 40);
        }
    
    if(monster.direction==1){
        
        if(monster.tabMonster[0].x<canvas.width*0.35){
            
            for(var j=0; j<monster.tabMonster.length; j++){
                monster.tabMonster[j].x+=canvas.width*0.03;
            }
            
        } else{
            
            monster.direction=-1;
            for(var j=0; j<monster.tabMonster.length; j++){
                monster.tabMonster[j].y+=canvas.height*0.05;
            }
        }
    }
    
    else if(monster.direction==-1){
        
        if(monster.tabMonster[0].x>canvas.width*0.07){
            
            for(var j=0; j<monster.tabMonster.length; j++){
                monster.tabMonster[j].x-=canvas.width*0.03;
            }
            
        } else{
            
            monster.direction=1;
            for(var j=0; j<monster.tabMonster.length; j++){
                monster.tabMonster[j].y+=canvas.height*0.05;
            }
        }
    }
    monster.draw();
    monster_move_ID = setTimeout(updateMonster, frameRateMonster);
    /*if (spaceShip.game==0){
        clearTimeout(ID);
    }*/
}



//CHECK IF WEAPON IS UNDER EDGE

function checkEdge(number){
    if(weapon.tabWeapon[number].y<0){
        ctx.clearRect(weapon.tabWeapon[number].x, weapon.tabWeapon[number].y, 10, 40);
        weapon.tabWeapon.splice(number,1);
    }
}

//FUNCTION LOOP COLLAPSE MONSTRE WITH WEAPON


function checkCollapse(number){
    for(var i=0; i<monster.tabMonster.length; i++){
        if(weapon.tabWeapon[number].y<=monster.tabMonster[i].y){
            if(((weapon.tabWeapon[number].x)<=(monster.tabMonster[i].x+canvas.width*0.05))&&((weapon.tabWeapon[number].x)>=(monster.tabMonster[i].x))){
                touch.play();
                ctx.clearRect(weapon.tabWeapon[number].x, weapon.tabWeapon[number].y, 10, 40);
                weapon.tabWeapon.splice(number,1);
                monster.tabMonster[i].vie--;
                game.increase_score(5);
                //ctx.clearRect(weapon.tabWeapon[number].x, weapon.tabWeapon[number].y, 10, 40);
                //ctx.clearRect(monster.tabMonster[i].x, monster.tabMonster[i].y, 65, 40);
                if(monster.tabMonster[i].vie==0){
                    ctx.clearRect(monster.tabMonster[i].x, monster.tabMonster[i].y, 65, 40);
                    monster.tabMonster.splice(i,1);
                    game.increase_score(10);
                }
            }
        }
    }
}

//FUNCTION LOOP WEAPON

function updateWeapon() {
    img_weapon.onload = function() {
        for(var a=0; a<weapon.tabWeapon.length; a++){
            ctx.clearRect(weapon.tabWeapon[a].x, weapon.tabWeapon[a].y, 10, 40);
            weapon.tabWeapon[a].y-=canvas.height*0.05;
            ctx.drawImage(img_weapon, 90, 0, 220, 383, weapon.tabWeapon[a].x, weapon.tabWeapon[a].y, 10, 40);
            checkCollapse(a);
            checkEdge(a);
        }
    };
    img_weapon.src = "SpaceInvadersLaser.png";
     weapon_ID = setTimeout(updateWeapon, frameRateWeapon); // set the framerate of the user weapon
}
 

function new_ammo () {
    
    game.ammo =game.ammo +ammo_amount;
    ammoElement.innerHTML = "Ammo : "+game.ammo;
    new_ammo_ID = setTimeout(new_ammo,ammo_delay);
}

//FUNCTION LOOP WEAPON MONSTER


 function updateWeaponMonster() {
    img.onload = function() {
        for(var a=0; a<weapon.tabWeapon.length; a++){
            ctx.clearRect(weapon.tabWeapon[a].x, weapon.tabWeapon[a].y, 10, 40);
            weapon.tabWeapon[a].y-=canvas.height*0.05;
            ctx.drawImage(img, 90, 0, 220, 383, weapon.tabWeapon[a].x, weapon.tabWeapon[a].y, 10, 40);
            //checkCollapse(a);
            //checkEdge(a);
        }
    };
    img.src = "SpaceInvadersLaser.png";
     monster_weapon_ID = setTimeout(updateWeaponMonster, frameRateWeapon);
} 

function fire() {
    
    if ( game.running != false) {
        
        if (game.ammo > 0) {
            weapon.y=(spaceShip.y-canvas.height*0.05);
            weapon.x=spaceShip.x;
            weapon.tabWeapon.push({x:weapon.x, y:weapon.y}); 
            game.ammo--;
            console.log(game.ammo);
            ammoElement.innerHTML = " Ammo : "+game.ammo;
            
        }

    }
}





var game = {
    
     high_score_list : ["Kevin CHieze", "Kevin chieze", "celine ponton", "Guillaume Valette","Adele Bert","Jean-Yves"],
    
    
    
    running : false ,
    HS_onscreeen : false,
    login_set : false,
    score :0,
    ammo : 10,
    
    load_high_score : function  () {
    
    this.high_score_list = localStorage.saved_high_score && JSON.parse(localStorage.saved_high_score);
},
    
    save_high_score : function () {
        
        localStorage.setItem("saved_high_score",JSON.stringify(this.high_score_list));
        
        
    },
    // Show the high score on the screen
    show_high_score : function () {
        

           
        // if the screen is not actully displayed
        if (this.HS_onscreeen==false) {
            
            
            this.HS_onscreeen = true; // flag set if actually display
            this.pause(); // pause the game
            
            // create the highscore area div
            var highscore_area = document.createElement("div");
            gameElement.appendChild(highscore_area); // put it as child of the game area
            highscore_area.setAttribute("class","highscore_class"); // set his atributes
            highscore_area.setAttribute("id","highscore_area");
            highscore_area.setAttribute("name","highscore_area");

        
            // title
            highscore_area.innerHTML = "<h2> HighScore <br> Pseudo / Score </h2>";
        
            
            for(var i=0;i<this.high_score_list.length;i++) 
            {
                highscore_area.innerHTML += this.high_score_list[i];
                highscore_area.innerHTML += "<br> <br>";
            }
        }
        else {  
                var highscore_area = document.getElementById("highscore_area");
                gameElement.removeChild(highscore_area);
            this.HS_onscreeen= false;
            
            
            document.getElementById("pseudo_display").innerHTML = " Player : " + login.pseudo;
            this.change_state();
            
        }
    },
    
    
   /* win : function () {
        
        this.pause();
        var winElement = document.createElement("div");
        gameElement.appendchild(winElement);
        winElement.setAttribute("class","winning_class");
        
        
    }, */
    
    
    increase_score : function (point) 
    {
        this.score += point ;
        scoreElement.innerHTML = " Score :"+ this.score;
        
    },
    
    pause : function () {
    
    clearTimeout(weapon_ID);
    clearTimeout(monster_weapon_ID );
    clearTimeout(monster_move_ID );
    clearTimeout(new_ammo_ID);
    
        
        window.addEventListener("deviceorientation", function () 
    {
        processGyro(event.alpha, event.beta, event.gamma); 
        
    }, false);
        
  state_btn.style.backgroundColor = "#ffcc00"; 
        
    state_btn.innerHTML="Resume Game";
        this.running = false;
},
    
    resume : function () {
        
        weapon_ID = setTimeout(updateWeapon, frameRateWeapon); // set the framerate of the user weapon
        monster_weapon_ID = setTimeout(updateWeaponMonster, frameRateWeapon);
        monster_move_ID = setTimeout(updateMonster, frameRateMonster);
        new_ammo_ID = setTimeout(new_ammo,ammo_delay);
    
        
    window.addEventListener("deviceorientation", function () 
    {
        processGyro(event.alpha, event.beta, event.gamma); 
        
    }, true);
        
        state_btn.style.backgroundColor = "#00F020"; 
        state_btn.innerHTML = "Pause Game";
        
        
        
        
        this.running=true;
    
    },
        
    // Changing the state of the game
    change_state : function () {
    
            //Don't work if the player didn't put his login or if the game display the high_score
        if ((this.login_set == false) || (this.HS_onscreeen==true)){
        } else {
        
                // if the game is actually in pause, resume it 
            if ( this.running == false) 
            {
        
                game.resume();
            }
            else if  ( this.running == true) // if the game run, put it in pause
            {
                game.pause();
            }
        }
},
    
}





var Starfield =  {
	fps : 50,
	canvas : null,
    width :0,
    heigth : 0,
	minVelocity : 10,
	maxVelocity : 300,
	nb_stars : 20,
    star_size : 3,
    stars : 0,
	intervalId : 0,
    
    
    //init the starfield
                            /// a finir de modifier ////
    
    initialise : function (div) {
	var self = this;

	//	Store the div.
	this.containerDiv = div;
	self.width = window.innerWidth;
	self.height = window.innerHeight;

	window.onresize = function(event) {
		self.width = window.innerWidth;
		self.height = window.innerHeight;
		self.canvas.width = self.width;
		self.canvas.height = self.height;
		self.draw();
    }

	//	Create the canvas.
	var canvas = document.createElement('canvas');
	div.appendChild(canvas);
	this.canvas = canvas;
	this.canvas.width = this.width;
	this.canvas.height = this.height;
},


    // Start the skyfall
  
    start  : function  () {

	//	Create the stars.
	var buff_stars = [];
     
     //Create the define number of star
	for(var i=0; i<this.nb_stars; i++) {
		buff_stars[i] = new Star(Math.random()*this.width, Math.random()*this.height, Math.random()*this.star_size+1,
		 (Math.random()*(this.maxVelocity - this.minVelocity))+this.minVelocity);
	}
        //put the buffer on the object
	this.stars = buff_stars;

	var self = this;
	//	Start the timer.
	this.intervalId = setInterval(function() {
		self.update();
		self.draw();	
	}, 1000 / this.fps); 
},
    
    update : function() {
        
        
	var dt = 1 / this.fps;

	for(var i=0; i<this.stars.length; i++) {
		var star = this.stars[i];
		star.y += dt * star.velocity;
		//	If the star has moved from the bottom of the screen, spawn it at the top.
		if(star.y > this.height) {
			this.stars[i] = new Star(Math.random()*this.width, 0, Math.random()*3+1, 
            (Math.random()*(this.maxVelocity - this.minVelocity))+this.minVelocity);
		}
	}
},

    
    draw : function() {

	//	Get the drawing context.
	var ctx = this.canvas.getContext("2d");

	//	Draw the background.
    ctx.fillStyle = '#000000';
	ctx.fillRect(0, 0, this.width, this.height);

	//	Draw stars.
	ctx.fillStyle = '#ffffff';
	for(var i=0; i<this.stars.length;i++) {
		var star = this.stars[i];
		ctx.fillRect(star.x, star.y, star.size, star.size);
	}
}
    

}


function Star(x, y, size, velocity) {
	this.x = x;
	this.y = y; 
	this.velocity = velocity;
	this.size = size;
}

// login object

var login = {
    
    
    pseudo : "hey",
    
    // first fonciton call by the game
    display : function () {
        
        // Be shure that the game did not work when the user put his pseudo
       game.pause();
        // Create the form for the pseudo of the player
     var login_form = document.createElement("form");
        login_form.setAttribute("class","login_class");
        login_form.setAttribute("name","form_name");
        console.log(login_form);
        
        // Add a label to the form
    var login_label = document.createElement("label");
        login_form.appendChild(login_label);
        login_label.innerHTML = "Enter your Pseudo : ";
        
        
        
        // be shure that we don't reset the web page when we submit the form
        login_form.addEventListener('submit', function(event){event.preventDefault();});
        
        // Create the input for the pseudo of the player
    var login_input = document.createElement("input");
        login_input.setAttribute("name","login_value");
        login_input.setAttribute("type", "text");
        login_input.setAttribute("color","#3CBC8D");
        login_input.setAttribute("class","login_value");
        login_form.appendChild(login_input);
        
        
        // Create the submit buttun
    var login_btn = document.createElement("button");
        login_btn.setAttribute("class","login_btn_class");
        login_btn.innerHTML = "Confirm Pseudo";
        login_btn.setAttribute("onclick","login.setlogin()");
        login_form.appendChild(login_btn);
        
        // add the form to the game area
        gameElement.appendChild(login_form);

        // Draw the spacesip and the monster in the back of the login area
        spaceShip.draw();
        
},
    
        // take the value write on the form 
       setlogin : function () {
        
        this.pseudo = document.form_name.login_value.value;
           
        // remove the child for stop showing the form
        gameElement.removeChild(gameElement.lastChild);
        
       
           // Write the pseudo on the top of the sreen
         document.getElementById("pseudo_display").innerHTML = " Player : " + this.pseudo;
           
           // remember that the pseudo is set
           game.login_set=true;
           // Launch the game
           game.resume ();
           

        
           
        
    } 
}


// Moving function 


document.addEventListener("keydown", function (event) {
    if (event.key === "ArrowLeft") {
        ctx.clearRect(spaceShip.x, spaceShip.y, 293, 272);
        spaceShip.x-=canvas.width*0.03 ;
        spaceShip.draw();
        //weapon.draw();
    } 
    else if (event.key === "ArrowRight"){
        
        
        if (spaceShip.x + canvas.width*0.03 < canvas.width ) {
                
              ctx.clearRect(spaceShip.x, spaceShip.y, 293, 272);
        spaceShip.x+= canvas.width*0.03;
        spaceShip.draw();
            console.log(spaceShip.x);
            }
        
        
       /* ctx.clearRect(spaceShip.x, spaceShip.y, 293, 272);
        spaceShip.x+= canvas.width*0.03;
        spaceShip.draw(); */
        //weapon.draw();
    }
    else if (event.key === "ArrowDown"){
        
        fire();
    }
    
    
    if(keycode == 37 || keycode == 39 || keycode == 32) {
    	e.preventDefault();
    }
});





if (window.DeviceOrientationEvent) 
{
    window.addEventListener("deviceorientation", function () 
    {
        processGyro(event.alpha, event.beta, event.gamma); 
        
    }, true);
} 


function processGyro(alpha,beta,gamma)
{
	
   
        if (beta > 1.5) {
  
            
            
            if (spaceShip.x - canvas.width*((beta / 1000)) > 0 ) {
                
              ctx.clearRect(spaceShip.x, spaceShip.y, 293, 272);
       spaceShip.x-=canvas.width*((beta / 1000)) ;
        spaceShip.draw(); 
            }
     
            
        //weapon.draw();
    } 
    else if (beta < -1.5){
        
         if (spaceShip.x + canvas.width*(( Math.abs(beta) / 1000)) < ((canvas.width *0.92) )) {
        
        ctx.clearRect(spaceShip.x, spaceShip.y, 293, 272);
        spaceShip.x+= canvas.width*((Math.abs(beta) / 1000));
        spaceShip.draw();
             
         }
    
        //weapon.draw();
    }
    
}

