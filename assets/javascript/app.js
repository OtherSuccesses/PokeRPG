// Global Variables

var hit = '';
var foeURL = '';
var heroHP = 120;
var heroModifier = heroHP / 3;
var foeHP = 120;
var foeModifier = foeHP / 3;
var animationSpeed = 4;
var speedModifier = 1;
var currentFoe = '';
var pokeArray = [];
var activePokemon = [];

//PlayerName variable
var playerName= [];
var winCount = 0;
var lossCount = 0;
//Number of Pokemon to capture
var numberPokemon;

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
			else{
	    	playerName = $("#playerNameEntry").val();
	    	database.ref("/Players/" + playerName + "/").set({
	    		name: playerName
	    	});
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
var markerArray = [];
var longArray = [];
var latArray = [];

// Function to enerate coordinates for sprite markers
function generateCoordinates() {
	$("#winCount").text("Wins: " + winCount);
	$("#lossCount").text("Losses: " +lossCount);
var numGen =  function(to, from, fixed) {
	return (Math.random() * (to - from) + from).toFixed(fixed) * 1; 
	};
	var latitude = function(){
		for (i = 0; i<50; i++) {
		var lat = numGen(27, 48, 3);
		latArray.push(lat);
		markerArray[i] = {};
		markerArray[i].latitude = lat;
	}};
	var longitude = function(){
		for (i = 0; i<50; i++) {
		var long = numGen(-60, -125, 3);
		longArray.push(long);
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
        zoom: 4
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
		    scaledSize: new google.maps.Size(50, 50)
		}
		var marker = new google.maps.Marker({
		    position: new google.maps.LatLng(markerArray[i].latitude, markerArray[i].longitude),
		    id: i,
		    map: map,
		    icon: icon
		});
			// add click listener to each marker
		   marker.addListener('click', function(event) {
		   	$('.foeContainer').empty();
		   	$('.hero').show();
		   	heroHP = 120;
		   	foeHP = 120;
		   	$('.heroHP').text(heroHP);
		   	foeURL = this.icon.url;
		   	var index = foeURL.match(/[0-9]+/g);
		   	var result = $.grep(pokeArray, function(e){ return e.id == index; });
		   	$('.pokeName').text(result[0].name);
		   	var h4 = $('<h4>');
		   	h4.addClass('foeHP');
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

function checkWin() {
	if (heroHP<=0) {
		$('.results').html('You Lose!');
		setTimeout(function () {
			$('#myModal').modal('toggle');
			$('.hero').hide( "explode", {pieces: 16}, 3000 );
		}, 3000);
    

		lossCount++;
		$("#lossCount").text("Losses: " +lossCount);
		// $('.hero').effect('explode');

	} else if (foeHP<=0) {
		console.log(markers[clickedPoke].id);
		
		$('.results').html('You Captured a Pokemon! Drag him to your Pen');

		// $('img.foe').css({
		// 	'position':'relative'
		// });

		$(document).on('mousedown', 'img.foe', function () {
			$('img.foe').appendTo('#pen').css({
				'height':'50px'
			});
			$('img.foe').draggable({
				containment: "parent",
				grid: [ 10, 10 ],
			});
			$('img.foe').removeClass('foe');

			$('#myModal').modal('toggle');
		});

		winCount++;
		$("#winCount").text("Wins: " + winCount);
		currentFoe.draggable();
	}
}
$(document).on('click','.modal' ,function () {
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

		if (mover.left > 90 && mover.left < 110) {
			hit = true;
			
		} else {
			hit = false;
			
		}
		writeHit();
	}
	checkWin();

	$('.mover').css({
		'animation-duration': animationSpeed/speedModifier
	});
	speedModifier+=0.1;

});


