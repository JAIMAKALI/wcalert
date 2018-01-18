var output = document.getElementById("out");
var lat=document.getElementById('persons_lat');
var lon=document.getElementById('persons_lon');
var accuracy=document.getElementById('location_accuracy');
var locations=document.getElementById('location_address');
var police_address=document.getElementById('police_address');
var map;
var marker;
var phoneno=document.getElementById('phone_no');

var mobileno;

var police_coords=[];    // for pushing nearest location of police
function geoFindMe() {
  if (!navigator.geolocation){
    output.innerHTML = "<p>Geolocation is not supported by your browser</p>";
    return;
  }
  //output.innerHTML = "<p>Locating…</p>";
    navigator.geolocation.getCurrentPosition(success, error);
}


function success(position) {
  var latitude  = position.coords.latitude;
  var longitude = position.coords.longitude;
  var acc = position.coords.accuracy;
  //console.log(position);
  // to automatic field the input after click to panic
   lat.value=latitude;
   lon.value=longitude;
   accuracy.value=acc;

   var coords=new google.maps.LatLng(latitude,longitude);
  //console.log(coords);
   police_coords.push(coords);

  set_map(coords);
  set_address(coords);
  set_nearAddress(coords);
  route(police_coords);




  console.log(police_coords.length);
//  set_phone(coords);
}

function error() {
  output.innerHTML = "Unable to retrieve your location";
}

function set_map(coords)
{
 var mapOptions = {
      zoom: 15,
      center: coords,
      mapTypeControl: true,
      navigationControlOptions: {
          style: google.maps.NavigationControlStyle.SMALL
      },
      mapTypeId: google.maps.MapTypeId.STATELITE
      };


     map = new google.maps.Map(
          output, mapOptions
          );

}


  function create_marker(place)
  	{

  	 var marker2=new google.maps.Marker({position:place.geometry.location,

       map:map,
       title:place.name
     });
  	var info2=new google.maps.InfoWindow({content:place.name,position:place.geometry.location});
  	marker2.addListener('click',function()
  	{
  	info2.open(map,marker2);
  	});

  	}

function route(police_coords)
{


}


function set_address(coords)
	{
	var geocoder=new google.maps.Geocoder;
	 marker = new google.maps.Marker({
                position: coords,
                map: map,
                title: "ok",
				animation:google.maps.Animation.BOUNCE
        });

			geocoder.geocode({location:coords},function(results,status){
			if(status=='OK')
			{
			if(results[0])
			{
			map.setZoom(15);

			var info=new google.maps.InfoWindow({content:results[0].formatted_address,position:coords});
			var address=results[0].formatted_address;

      locations.value=address;
			//document.getElementById('address').innerHTML="address=="+address;
			marker.addListener('click',function(){
			info.open(map,marker);
			});
			}
			}
			});
	}


  function set_nearAddress(coords)
	{
	var nearBy=new google.maps.places.PlacesService(map);
	nearBy.nearbySearch({location:coords,
	rankBy:google.maps.places.RankBy.DISTANCE,
	types:['police']},
	function (results,status)
	{
	if(status=='OK')
	{
     console.log('hii',results);
     mobileno=results[0].place_id;
     police_coords.push(results[0].geometry.location);
 var Nearest=new google.maps.places.PlacesService(map);

 var directionsDisplay = new google.maps.DirectionsRenderer;
     var directionsService = new google.maps.DirectionsService;

     directionsDisplay.setMap(map);
     var o=police_coords[0];
     var d=police_coords[1];
     console.log(d.lat());

     directionsService.route({

         origin: new google.maps.LatLng(o.lat(),o.lng()),  // Haight.
         destination:new google.maps.LatLng(d.lat(),d.lng()),  // Ocean Beach.
         // Note that Javascript allows us to access the constant
         // using square brackets and a string value as its
         // "property."
         travelMode: google.maps.TravelMode['WALKING']
       }, function(response, status) {
         if (status == 'OK') {
           directionsDisplay.setDirections(response);
         } else {
           window.alert('Directions request failed due to ' + status);
         }
       });

 Nearest.getDetails({placeId:mobileno},function(result,sts){
   if(sts=='OK'){
     console.log(result);
     phoneno.value=result.international_phone_number;
     police_address.value=result.name;

 }

 })

	for(var i=0;i<results.length;i++)
	{
	create_marker(results[i]);
	}

 }

});
  //pushing the nearest polic station coords in police_coords array
// console.log(police_coords[1].lat());
return police_coords;
}
