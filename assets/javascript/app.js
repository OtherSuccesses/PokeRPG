

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

// REPLACE THIS WITH FIREBASE INFO OF SPRITE NAME
var activePokemon = [];

//PlayerName variable
var playerName= [];
//Number of Pokemon to capture
var numberPokemon;

var url="https://maps.googleapis.com/maps/api/js?key=AIzaSyDpwnTjzyOwCRmPRQhpu0eREKplFV0TCDI"



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

// var randomizePokemon = function(){
// 	for(i = 0; i < 10; i++){
// 		var tempId = Math.floor(Math.random()*150);
// 		console.log(tempId);
// 		activePokemon[i] = pokeArray[tempId];
// 	}
// }
 // add firebase data to local array

 database.ref().on("child_added", function(childSnapshot){
	 pokeArray.push(childSnapshot.val());
	 });
 console.log(pokeArray);


//Pokemon API Code

	var initializePokemonData = function(){
		for(i = 0; i<150; i++){
			var queryURL = "https://pokeapi.co/api/v2/pokemon/"+i;
			$.ajax({
				url:queryURL,
				method: "GET"
			}).done(function(pokemon){
				//number.stringify();
//				activePoke[i] = Math.floor(Math.random()*150);
				// console.log(pokemon);
				// console.log(pokemon.sprites);
				// console.log(pokemon.sprites.front_default);
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

	//Pokemon initialize if Database fails to load
 	setTimeout(function(){
 	 	if (pokeArray.length<149){
 			initializePokemonData();
 		}
 	}, 5000);



var map;


  
/// Data for the markers consisting of a name, a LatLng and a zIndex for the
// order in which these markers should display on top of each other.
var markerArray = [];
var longArray = [];
var latArray = [];

function generateCoordinates() {
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
	latitude ();
	longitude();
	}

	function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 40.765981527712825, lng: -78.78111690000003},
        mapTypeId: 'satellite',
        zoom: 4
        });
        window.onload = setMarkers(map);
      }


	function setMarkers(map) {
	  // Adds markers to the map.
	generateCoordinates();
	for (var i = 1; i<50; i++){
		var icon = {
		    url: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/"+i+".png",
		    scaledSize: new google.maps.Size(50, 50)
		};

		var marker = new google.maps.Marker({
		    position: new google.maps.LatLng(markerArray[i].latitude, markerArray[i].longitude),
		    map: map,
		    icon: icon
		});
			// console.log(pokeArray);
		   marker.addListener('click', function(event) {
		   	$('.foeContainer').empty();
		   	$()
		   	heroHP = 120;
		   	foeHP = 120;
		   	$('.heroHP').text(heroHP);
		   	foeURL = this.icon.url;
		   	var index = foeURL.match(/[0-9]+/g);
		   	var result = $.grep(pokeArray, function(e){ return e.id == index; });
		   	console.log(result);
		   	$('.pokeName').text(result[0].name);
		   	console.log('index+1: ',parseInt(index)+1);
		   	var h4 = $('<h4>');
		   	h4.addClass('foeHP');
		   	h4.text(foeHP);
		   	var currentFoe = $('<img>');
		   	currentFoe.attr({
		   		'src': foeURL,
		   		'height': 200,
		   		'class': 'foe'
		   	});
		   	
		   	$('.foeContainer').append(h4,currentFoe);
	  		console.log(this.icon.url);
	  	  	$('#myModal').modal('show');
	
	  });
	}
	  // Marker sizes are expressed as a Size of X,Y where the origin of the image
	  // (0,0) is located in the top left of the image.
	  // Origins, anchor positions and coordinates of the marker increase in the X
	  // direction to the right and in the Y direction down.

	  // var image = new google.maps.MarkerImage(
	    // pokeSprites, null, null, null,

	    // This marker is 20 pixels wide by 32 pixels high.
	    //size: new google.maps.Size(15, 15)
	    // The origin for this image is (0, 0).
	    //origin: new google.maps.Point(0, 0),
	    // The anchor for this image is the base of the flagpole at (0, 32).
	    //anchor: new google.maps.Point(0, 32)
	    // new google.maps.Size(40,40)
	  // );
	  // Shapes define the clickable region of the icon. The type defines an HTML
	  // <area> element 'poly' which traces out a polygon as a series of X,Y points.
	  // The final coordinate closes the poly by connecting to the first coordinate.
	  // var shape = {
	  //   coords: [1, 1, 1, 20, 18, 20, 18, 1],
	  //   type: 'poly'
	  // };

	  // markerArray.forEach(function(markerArray){

	  //   var marker = new google.maps.Marker({
	  //     position: {lat: markerArray.latitude, lng: markerArray.longitude },
	  //     map: map,
	  //     title: markerArray.name,
	  //     icon: image,
	  //     shape: shape,
	  //   });


	  //   marker.addListener('click', function(event) {
	  // 	console.log(this);
	  // 	  	$('#myModal').modal('show');
	
	  // });
	  // });
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
				// $('.hero').effect('explode');
			} else if (foeHP<=0) {
				$('.results').html('You Captured a Pokemon! Drag him to your Pen');
				currentFoe.draggable();
			}
		}

		$(document).on('click','.modal' ,function () {
			var mover = $('.mover').position();
			console.log(mover.top, mover.right, mover.bottom, mover.left);



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

