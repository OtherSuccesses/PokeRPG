// Global Variables
var map;
var hit = '';
var foeURL = '';
var heroHP = 120;
var heroModifier = heroHP / 3;
var foeHP = 120;
var foeModifier = '';
var animationSpeed = 4;
var speedModifier = 1;
var currentFoe = '';
var pokeArray = [];
var activePokemon = [];
var markerArray = [];
var pokeName = '';
var battleEnd = false;
var loopCount = 50;
//PlayerName variable
var playerName= [];
var winCount = 0;
var playerObj;
var lives = 10;
//Number of Pokemon caught
var numberPokemon = 0;
var startScore = 0;
var score = 0;
var playerExists = true;

var playSound = function (source) {
	var snd  = new Audio();
	var src  = document.createElement("source");
	src.type = "audio/mpeg";
	src.src  = "assets/audio/"+ source +".mp3";
	snd.appendChild(src);
	snd.play();
}

//Firebase Code
// Initialize Firebase

var config = {
    apiKey: "AIzaSyC8kW0gKpIoL8W_JizTdOyuq0J0QdY7Zq0",
    authDomain: "group-project-1-b61de.firebaseapp.com",
    databaseURL: "https://group-project-1-b61de.firebaseio.com",
    projectId: "group-project-1-b61de",
    storageBucket: "",
    messagingSenderId: "151973484935"
};

firebase.initializeApp(config);
var database = firebase.database();

// add firebase data to local array
database.ref().on("child_added", function(childSnapshot){
	pokeArray.push(childSnapshot.val());
});

//Pokemon API Code
var initializePokemonData = function(){
	for(i = 0; i<150; i++){
		var queryURL = "https://pokeapi.co/api/v2/pokemon/"+i;
		$.ajax({
			url:queryURL,
			method: "GET"
		}).done(function(pokemon){
			database.ref().push({
				id: pokemon.id,
				name: pokemon.name,
				sprite:pokemon.sprites.front_default
			});
			var sprite = $("<img>");
			sprite.attr("src", pokemon.sprites.front_default);
			pokeSprites = pokemon.sprites.front_default;
			sprite.appendTo($("#poke-image"));
		})
	}
}

	// setTimeout(function(){
	// 	randomizePokemon();
	// },3000);

//High scores JS
//	$(document).on("click", "#")

//Restart Button JS
$(document).on("click", "#restart-btn", function(event){
	location.reload();
});

//function that makes the letters "sway"
function letterSway(element, duration, increase) {
	var delay = 0;
	var title = $(element);
	var titleText = title.html();
	title.empty();
	for (var i = 0; i<titleText.length; i++) {
		
		var letter = titleText.charAt(i);
		if (letter===" "){
			var newLetter = $('<span class="space"> </span>');
		} else {
			var newLetter = $('<span class="letterAnimation '+i+'">'+letter+'</span>')
		}
		title.append(newLetter);
	}

	for (var i = 0; i<titleText.length; i++) {
		
		delay+=increase;
		$('.'+i).css({
			'animation-delay': ''+delay+'ms',
			'animation-duration': duration
		});
	}
}

//Player Name Entry Modal JS
$(window).on('load',function(){
	letterSway('#mainTitle','5s', 500);
	$("#winCount").text(winCount);
	$("#lossCount").text(lives);
	//added to stop user from clicking outside modal to bypass
	$('#playerNameEntryModal').modal({backdrop: 'static', keyboard: false})
    $('#playerNameEntryModal').modal('show');
    //hides error text div on load
    $('.validationTxt').hide();
    $( ".accordion" ).accordion({
		active: 0,
		// classes: {
		// 	"ui-accordion": "highlight"
		// },
		event: "click",
		heightStyle: "content",
	});

	if($(window).width() <= 600) {
		$('.space').html('<br><br>')
	}
});

$(window).on("resize = 'horizontal'", function () {
	if($(window).width() <= 600) {
		$('.space').html('<br><br>')
	}
	if ($(window).width() >= 992) {
		$('.space').html('');
	}
});

$(document).on("click", "#playerNameButton",function(event){
	event.preventDefault();
	//added to prevent text from piling up
	$(".validationTxt").empty();
	var str = $('#playerNameEntry').val();
	if(/^[a-zA-Z- ]*$/.test(str) == false) {
		$(".validationTxt").append('<br>Your name cannot contain numbers or special characters!');
		$('.validationTxt').show();
	}
	else if(str==""){
		$(".validationTxt").append('<br>You must have a name! If you do not have one, please enter "Binky".');
		$('.validationTxt').show();
	}
	else {
		$('#thisPanel.panel').show('slow');
		playerName = $("#playerNameEntry").val();
    	database.ref("/Players/").once("value", function(snapshot){
    		console.log(snapshot.val());
    		console.log(snapshot.val().name);
    		var playerDataRef = database.ref("/Players/" + playerName +"/");
    		if (!snapshot.val()[playerName]){
    			playerExists = false;
    			console.log("valid name");
    			playerDataRef
		    	.set({
		    		name: playerName,
    				highScore: 0
		    	});
		    	playerDataRef.once("value", function(snapshot){
			    	playerObj=snapshot.val();
			    	console.log(playerObj);
		    	});
    		}
    		else {
    			playerExists = true;
			    playerDataRef.once("value", function(snapshot){
			    	playerObj=snapshot.val();
			    	console.log(playerObj);
			    	startScore = playerObj.highScore;
			    	$("#score").text(startScore);
		    	});
    		}
    	})
    	if (playerExists) {
			$('.trainerTitle').html('<p>Hello, ' + playerName + ', It\'s nice to see you again.</p>'+
				'<p>See if you can break your high score of '+startScore+' points!</p>');
		} else {
			$('.trainerTitle').html('<p>Hello, ' + playerName + ', It\'s nice to meet you.</p>'+
				'<p>See if you can set a high score!</p>');
		}
    	$("#name").text(playerName);
    	//delays closing modal and starting background music
    	setTimeout(function () {
    		$("#playerNameEntryModal").modal('toggle');
    		//plays background music
			var audio1 = document.getElementById('audio1')
			audio1.volume = 0.1;
			audio1.play();
			$('input[type=range]').on('input', function () {
			    audio1.volume = $(this).val();
			});
    	}, 1000*3);
	}
});

//Pokemon initialize if Database fails to load
setTimeout(function(){
 	if (pokeArray.length<149){
		initializePokemonData();
	}
}, 5000);

/// Data for the markers consisting of a name, a LatLng and a zIndex for the
// order in which these markers should display on top of each other.
var numGen =  function(to, from, fixed) {
		return (Math.random() * (to - from) + from).toFixed(fixed) * 1; 
};

// Function to generate coordinates for sprite markers
function generateCoordinates() {
	var latitude = function(){
		for (i = 0; i<=loopCount; i++) {
		var lat = numGen(80, -80, 3);
		markerArray[i] = {};
		markerArray[i].latitude = lat;
	}};
	var longitude = function(){
		for (i = 0; i<=loopCount; i++) {
		var long = numGen(-180, 180, 3);
		markerArray[i].longitude = long;
	}};
	// generate sprite coordinates
	latitude();
	longitude();
}

// initialize google maps api
function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 35.895252, lng: -78.91968650000001},
        mapTypeId: 'satellite',
        zoom: 3
        });
        window.onload = setMarkers(map);
};

// Adds markers to the map. 
function setMarkers(map) {

	generateCoordinates();

	for (var i = 1; i<=loopCount; i++){
		numberPokemon++;
		   $("#numberPokes").text(numberPokemon); 
		var icon = {
		    url: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/"+i+".png",
		    scaledSize: new google.maps.Size(75, 75)
		}
		var marker = new google.maps.Marker({
		    position: new google.maps.LatLng(markerArray[i].latitude, markerArray[i].longitude),
		    id: i,
		    map: map,
		    icon: icon
		});
			// add click listener to each marker
		marker.addListener('click', function(event) {
		   	playSound('fightStart');
		   	foeURL = this.icon.url;
		   	this.setMap(null);
		   	setTimeout(function (){
		   		$('.mover').css({
			   		'animation-duration': animationSpeed+'s',
			   		'-webkit-animation-duration': animationSpeed+'s',
			   		'-moz-animation-duration': animationSpeed+'s',
					'-o-animation-duration': animationSpeed+'s'
				});
			   	battleEnd = false;
			   	$('.foeContainer').empty();
			   	$('.results').empty();
			   	$('.results').text('Click when the green dot is in the middle to hit the pokemon.')
	   			$('.hero').animate({opacity:1}, 100);
			   	$('.slider').css({
			   		'opacity': 1
			   	});
			   	//randomizes hero and foe hp, and amount of damage they receive
			   	heroHP = numGen(100, 150, 0);
			   	heroModifier = Math.floor(foeHP / numGen(2,4,0));
			   	foeHP = numGen(80, 160, 0);
			   	foeModifier = Math.floor(foeHP / numGen(2,4,0));
	
			   	var index = foeURL.match(/[0-9]+/g);
			   	var result = $.grep(pokeArray, function(e){ return e.id == index; });
			   	pokeName = result[0].name;
			   	pokeName = pokeName.charAt(0).toUpperCase() + pokeName.slice(1)
			   	$('.pokeName').text(pokeName+'!');

			   	var h4 = $('<h4>');
			   	var miss = $('<h4>');
			   	h4.addClass('foeHP text-center HP');
			   	h4.text(foeHP);
			   	$('.heroHP').text(heroHP);
			   	var currentFoe = $('<img>');
			   	currentFoe.attr({
			   		'src': foeURL,
			   		'height': 200,
			   		'class': 'foe letterAnimation'
			   	});
			   	$('.foeContainer').prepend(h4,currentFoe);
		  		$('#myModal').modal({backdrop: 'static', keyboard: false})  
		  	  	$('#myModal').modal('show');
		   	},300);
		});
		   //converting numberPokemon to Number and adding 1 to display 50
			
	}
	
}

//////////////////////Javascript for fight mechanic//////////////////////

function reduceHP(character) {
	if (character === 'hero') {
		return heroHP-=heroModifier;
	} else if ( character === 'foe') {
		return foeHP-=foeModifier;
	}
}

function writeHP() {
	if (hit) {
		foeHP = reduceHP('foe');
		$('.foeHP').html(foeHP);
	} else {
		heroHP = reduceHP('hero');
		$('.heroHP').html(heroHP);
	}
}

function checkScore() {
	if (score > startScore){
		playerObj.highScore = score;
		database.ref("/Players/" + playerName + "/").set({
			name: playerName,
			highScore: score	
		});
		$("#highScore").empty();
		$("#highScore").append("<br>You've achieved a new high score!");
	}
}

function endGame() {
	$("#lossModal").modal({backdrop: 'static', keyboard: false});
	$("#lossModal").modal('show');
	$("#name-loss").text(playerName);
	$("#poke-number-caught").text(winCount);
	$("#score-span").text(score);
}

function checkLives() {
	console.log('startScore: ', startScore);
	if (lives <= 0){
		score = (winCount * 100) + (lives * 1000);
		checkScore();
		endGame();
	}
	if (numberPokemon<= 0){
		score = (winCount * 100) + (lives * 1000);
		checkScore();
		endGame(); 
	}
}

function checkBattleWin() {
	if (heroHP<=0) {
		setTimeout(function () {playSound('loss');}, 600);
		numberPokemon--;
		battleEnd = true;
		heroHP = 0;
		$('.heroHP').text(heroHP)
		$('.results').html('You Lose!');
		$("#numberPokes").text(numberPokemon);
		$('.hero').animate({opacity:0}, 2000);
		lives--;
		$("#lossCount").text(lives);
		//delays modal close and explode hero effect by 3 seconds
		setTimeout(function () {
			$('#myModal').modal('hide');
			checkLives();
		}, 1000 * 3);
		
	} else if (foeHP<=0) {
		numberPokemon--;
		//ensures that foeHP never displays less than 0
		foeHP = 0;
		$('.foeHP').text(foeHP)
		battleEnd = true;
		//creates titles for poke's in pen on hover
		$('img.foe').removeClass('foe letterAnimation').addClass('caught').attr('title', pokeName);
		$("#numberPokes").text(numberPokemon);
		//delays writing the message by 500ms to allow animation to complete
		setTimeout(function() {
			$('.results').html('You Captured a Pokemon! Click it to add it to your Pen');
		},500);
		//mousedown event to trigger foe going to pen, collapsing the modal,  
		//adjusting height of image, and making it draggable
		$(document).on('click', 'img.caught', function () {
			playSound('capture');
			//controls height of foe in pen
			$('img.caught').appendTo('#pen').css({
				'height':'50px'
			}).addClass('zoom');
			$('img.caught').draggable({
				containment: "parent",
				//controls grid size for drag movement
				grid: [ 10, 10 ],
			});
			$('#myModal').modal('hide');
			checkLives();
		});//end of click event
		winCount++;
		$("#winCount").text(winCount);

		//controls increase of .slide animation
		animationSpeed = 4;
		speedModifier+=.07;
		animationSpeed = animationSpeed / speedModifier;

	}//end of else if conditional

	//removes slider at the end of battle
	if (battleEnd) {
		$('.slider').css({'opacity':0}, 1000)
	}
	
}//end of checkBattleWin

//function writes 'hit' or 'miss' to screen
function hitText(text,status) {
	if ($('#hitText')) {
		$('#hitText').remove();
	}
	var $hitText = $('<h4 id="hitText"></h4>');
	$hitText.text(text).addClass(status+' hitTextBox').appendTo('.results');

	setTimeout(function () {
		$('#hitText').fadeOut('slow');
	}, 1000);
}

//main click event for fight sequence
$(document).on('click','#myModal' ,function () {
	if (!battleEnd) {
	var mover = $('.mover').position();
	console.log(mover.left);
	//as long as hero and foe are alive, animation effects are added
	//when the modal is clicked. Timeout allows animation to finish.
		if (heroHP>0 && foeHP>0) {
			setTimeout(function () {
				$('.hero').addClass('animateRight');
				$( ".hero" ).effect( "bounce", "slow" );
			},100);

			setTimeout(function () {
				$('.hero').removeClass('animateRight');
			},700);
			//conditional checks if mover is within the hitbox.  If so, sets
			//hit flag to true and allows bounce animation.  Also writes 'hit' to screen
			if (mover.left > 85 && mover.left < 115) {
				var index = numGen(1,3,0);
				playSound('hit'+Number(index));
				hit = true;
				setTimeout(function () {
					$( ".foe" ).effect( "bounce", "slow" );
				},300);
				hitText('Hit!','hit');

			//if not in hit box, sets hit to false and writes 'miss' to screen
			} else {
				var index = numGen(1,4,0);
				playSound('miss'+Number(index));
				hit = false;
				hitText('Miss!', 'miss');
			}
			writeHP();
		}
	checkBattleWin();

	}//end of !battleEnd conditional
});//end of #myModal onclick event