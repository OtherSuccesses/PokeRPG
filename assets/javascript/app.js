 var map;
      function initMap() {
        map = new google.maps.Map(document.getElementById('map'), {
          center: {lat: 40.765981527712825, lng: -78.78111690000003},
          mapTypeId: 'satellite',
          zoom: 4
        });

          setMarkers(map);
      }
  


// Data for the markers consisting of a name, a LatLng and a zIndex for the
// order in which these markers should display on top of each other.

	var longArray = [];
	var latArray = [];
	//function ()
	var generateCoordinates = function () {

	 var numGen =  function(to, from, fixed) {
	    return (Math.random() * (to - from) + from).toFixed(fixed) * 1; 
	};
	var latitude = function(){
		for (i = 0; i<10; i++) {
		var lat = numGen(27, 48, 3);
		latArray.push(lat);
	}};
	var longitude = function(){
		for (i = 0; i<10; i++) {
		var long = numGen(-60, -125, 3);
		longArray.push(long);
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
	  var image = {
	    url: 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png',
	    // This marker is 20 pixels wide by 32 pixels high.
	    size: new google.maps.Size(20, 32),
	    // The origin for this image is (0, 0).
	    origin: new google.maps.Point(0, 0),
	    // The anchor for this image is the base of the flagpole at (0, 32).
	    anchor: new google.maps.Point(0, 32)
	  };
	  // Shapes define the clickable region of the icon. The type defines an HTML
	  // <area> element 'poly' which traces out a polygon as a series of X,Y points.
	  // The final coordinate closes the poly by connecting to the first coordinate.
	  var shape = {
	    coords: [1, 1, 1, 20, 18, 20, 18, 1],
	    type: 'poly'
	  };
	  for (var i = 0; i < latArray.length; i++) {
	    var marker = new google.maps.Marker({
	      position: {lat: latArray[i], lng: longArray[i]},
	      map: map,
	      icon: image,
	      shape: shape,

	    });
	  }
	}