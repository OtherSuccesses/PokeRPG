// Global Variables

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
//PlayerName variable
var playerName= [];
var winCount = 0;
var playerObj;
var lives = 1;
//Number of Pokemon caught
var numberPokemon = 0;
var score = 0;


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
			console.log(pokemon);
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

//Player Name Entry Modal JS
	$(window).on('load',function(){
        $('#playerNameEntryModal').modal('show');
    });

    $(document).on("click", "#playerNameButton",function(event){
    	event.preventDefault();
    	var str = $('#playerNameEntry').val();
			if(/^[a-zA-Z- ]*$/.test(str) == false) {
    			$(".professor-container").append('<br>Your name cannot contain numbers or special characters!');
			}
			else if(str==""){
				$(".professor-container").append('<br>You must have a name! If you do not have one, please enter Binky.');
			}
			else{
				playerName = $("#playerNameEntry").val();
		    	database.ref("/Players/").once("value", function(snapshot){
		    		console.log(snapshot);
		    		console.log(snapshot.name);
		    		var playerDataRef = database.ref("/Players/" + playerName +"/");
		    		if (!snapshot.val()[playerName]){
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
		    		else{
					    playerDataRef.once("value", function(snapshot){
					    	playerObj=snapshot.val();
					    	console.log(playerObj);
				    	});
		    		}
		    	})
		    	$("#name").text("Name: " + playerName);
		    	$("#playerNameEntryModal").modal('toggle');
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
	$("#winCount").text("Wins: " + winCount);
	$("#lossCount").text("Lives: " +lives);
	
	var latitude = function(){
		for (i = 0; i<50; i++) {
		var lat = numGen(80, -80, 3);
		markerArray[i] = {};
		markerArray[i].latitude = lat;
	}};
	var longitude = function(){
		for (i = 0; i<50; i++) {
		var long = numGen(-180, 180, 3);
		markerArray[i].longitude = long;
	}};
	// generate sprite coordinates
	latitude ();
	longitude();
	}

// initialize google maps api
function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 40.765981527712825, lng: -78.78111690000003},
        mapTypeId: 'satellite',
        zoom: 3
        });
        window.onload = setMarkers(map);
      };

// initialize markers on map
var map; 
function setMarkers(map) {
	  // Adds markers to the map.
	generateCoordinates();
	for (var i = 1; i<50; i++){
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
		   	$('.mover').css({
				'-webkit-animation-duration': animationSpeed+'s'
			});
		   	battleEnd = false;
		   	$('.foeContainer').empty();
		   	$('.results').empty();
		   	$('.hero').show();
		   	$('.slider').show();
		   	heroHP = 120;
		   	//randomizes foeHP
		   	foeHP = numGen(80, 160, 0);
		   	//randomizes the amount of damage each hit does to foe
		   	foeModifier = Math.floor(foeHP / numGen(2,4,0));
		   	$('.heroHP').text(heroHP);
		   	foeURL = this.icon.url;
		   	var index = foeURL.match(/[0-9]+/g);
		   	var result = $.grep(pokeArray, function(e){ return e.id == index; });
		   	pokeName = result[0].name;
		   	pokeName = pokeName.charAt(0).toUpperCase() + pokeName.slice(1)
		   	$('.pokeName').text(pokeName);
		   	console.log('index+1: ',parseInt(index)+1);

		   	var h4 = $('<h4>');
		   	h4.addClass('foeHP text-center HP');
		   	h4.text(foeHP);
		   	var currentFoe = $('<img>');
		   	currentFoe.attr({
		   		'src': foeURL,
		   		'height': 200,
		   		'class': 'foe'
		   	});
		   	this.setMap(null);
		   	$('.foeContainer').append(h4,currentFoe);
	  		console.log(this.icon.url);
	  		$('#myModal').modal({backdrop: 'static', keyboard: false})  
	  	  	$('#myModal').modal('show');

		});
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
function writeHit() {
	if (hit) {
		foeHP = reduceHP('foe');
		$('.foeHP').html(foeHP);
	} else {
		heroHP = reduceHP('hero');
		$('.heroHP').html(heroHP);
	}
}

function checkLives() {
	if (lives <= 0){
		score = (winCount * 100) + (lives * 1000);
		$("#lossModal").modal('show');
		$("#name-loss").text(playerName);
		$("#poke-number-caught").text(winCount);
		$("#score-span").text(score);
		if (score > playerObj.highScore){
			playerObj.highScore = score;
			database.ref("/Players/" + playerName + "/").set({
				name: playerName,
				highScore: score	
			});
			$("#score-span").append("<br>You've achieved a new high score!");
		}
	}
}


function checkWin() {
	if (heroHP<=0) {

		battleEnd = true;
		$('.results').html('You Lose!');

		//delays modal close and explode hero effect by 3 seconds
		setTimeout(function () {
			$('#myModal').modal('hide');
			$('.hero').hide("explode", {pieces: 16}, 3000 );
		}, 1000 * 3);
    

		lives--;
		$("#lossCount").text("Lives: " +lives);
		checkLives();


	} else if (foeHP<=0) {
		//ensures that foeHP never displays less than 0
		foeHP = 0;
		$('.foeHP').text(foeHP)
		battleEnd = true;
		//creates titles for poke's in pen on hover
		$('img.foe').removeClass('foe').addClass('caught').attr('title', pokeName);

		//delays writing the message by 500ms to allow animation to complete
		setTimeout(function() {
			$('.results').html('You Captured a Pokemon! Click it to add it to your Pen');
		},500)
		//mousedown event to trigger foe going to pen
		$(document).on('mousedown', 'img.caught', function () {
			//controls height of foe in pen
			$('img.caught').appendTo('#pen').css({
				'height':'50px'
			});
			$('img.caught').draggable({
				containment: "parent",
				//controls grid size for drag movement
				grid: [ 10, 10 ],
			});
			

			$('#myModal').modal('hide');
		});
		winCount++;
		$("#winCount").text("Wins: " + winCount);

		//controls increase of .slide animation
		animationSpeed = 4;
		speedModifier+=.05;
		animationSpeed = animationSpeed / speedModifier;

	}//end of else if conditional
	if (battleEnd) {$('.slider').hide();}
}//end of checkwin


//main click event for fight sequence
$(document).on('click','.modal' ,function () {
	if (!battleEnd) {
	var mover = $('.mover').position();
	console.log(mover.left);

	if (heroHP>0 && foeHP>0) {

		$('.hero').addClass('animateRight');
		$('.foe').addClass('animateLeft');
		$( ".hero" ).effect( "bounce", "slow" );
		$( ".foe" ).effect( "bounce", "slow" );

		setTimeout(function () {
			$('.hero').removeClass('animateRight');
			$('.foe').removeClass('animateLeft');
		},600);

		if (mover.left > 85 && mover.left < 115) {
			hit = true;
			
		} else {
			hit = false;
		}
		writeHit();
	}
	checkWin();



	

	

	// mover.style.webkitAnimationDuration = animationSpeed;
	console.log('animationSpeed: ',animationSpeed);

	}

});




