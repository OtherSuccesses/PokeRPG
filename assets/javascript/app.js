// Global Variables
var pokeArray = [];
// REPLACE THIS WITH FIREBASE INFO OF SPRITE NAME
var nameArray = [];

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
// var pokeIDs = [];
// 	var idPush = function(){
// 		for (i= 1; i<151; i++){
// 			pokeIDs.push(i);
// //			console.log(pokeIDs[i-1]);
// 		}
// 	}

// 	var Pokemon = [];
// 	var pokeSprites = database.ref("150")
// 	var randomizePokemon = function(){
// 		for(i = 0; i<150; i++){
// 			var queryURL = "https://pokeapi.co/api/v2/pokemon/"+i;
// 			$.ajax({
// 				url:queryURL,
// 				method: "GET"
// 			}).done(function(pokemon){
// 				//number.stringify();
// //				activePoke[i] = Math.floor(Math.random()*150);
// 				// console.log(pokemon);
// 				// console.log(pokemon.sprites);
// 				// console.log(pokemon.sprites.front_default);
// 				database.ref().push({
// 					id: pokemon.id,
// 					name: pokemon.name,
// 					sprite:pokemon.sprites.front_default
// 				});
// 				console.log(pokemon);
// 				var sprite = $("<img>");
// 				sprite.attr("src", pokemon.sprites.front_default);
// 				pokeSprites = pokemon.sprites.front_default;
// 				sprite.appendTo($("#poke-image"));
// 			})
// 		}
// 	}
// 	idPush();
// 	randomizePokemon();
// 	database.ref("150").on("child_added", function(snapshot){
// 		console.log(snapshot.val());
// 	})

var map;
function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 40.765981527712825, lng: -78.78111690000003},
        mapTypeId: 'satellite',
        zoom: 4
        });
        window.onload = setMarkers(map);
      }
  


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
		for (i = 0; i<10; i++) {
		var lat = numGen(27, 48, 3);
		latArray.push(lat);
		markerArray[i] = {};
		markerArray[i].latitude = lat;
		markerArray[i].name = pokeArray[i].name;
		markerArray[i].url = pokeArray[i].sprite;
	}};
	var longitude = function(){
		for (i = 0; i<10; i++) {
		var long = numGen(-60, -125, 3);
		longArray.push(long);
		markerArray[i].longitude = long;
		// REPLACE THIS WITH FIREBASE INFO OF SPRITE NAME
		
		// markerArray[i].id = pokeArray[i].id;
		// makerArray[i].sprite = pokeArray[i].sprite;
	}};
	latitude ();
	longitude();
	}


	

	function setMarkers(map) {
	  // Adds markers to the map.
	generateCoordinates();
	  // Marker sizes are expressed as a Size of X,Y where the origin of the image
	  // (0,0) is located in the top left of the image.
	  // Origins, anchor positions and coordinates of the marker increase in the X
	  // direction to the right and in the Y direction down.
	  var image = new google.maps.MarkerImage(
	    // pokeSprites, null, null, null,
	    // This marker is 20 pixels wide by 32 pixels high.
	    //size: new google.maps.Size(15, 15)
	    // The origin for this image is (0, 0).
	    //origin: new google.maps.Point(0, 0),
	    // The anchor for this image is the base of the flagpole at (0, 32).
	    //anchor: new google.maps.Point(0, 32)
	    new google.maps.Size(40,40)
	  );
	  // Shapes define the clickable region of the icon. The type defines an HTML
	  // <area> element 'poly' which traces out a polygon as a series of X,Y points.
	  // The final coordinate closes the poly by connecting to the first coordinate.
	  var shape = {
	    coords: [1, 1, 1, 20, 18, 20, 18, 1],
	    type: 'poly'
	  };

	  markerArray.forEach(function(markerArray){

	    var marker = new google.maps.Marker({
	      position: {lat: markerArray.latitude, lng: markerArray.longitude },
	      map: map,
	      title: markerArray.name,
	      icon: image,
	      shape: shape,
	    });
	    marker.addListener('click', function(event) {
	  	console.log(this);
	  });
	  });
	}



