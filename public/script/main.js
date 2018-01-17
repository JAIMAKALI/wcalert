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
  console.log(position);
  // to automatic field the input after click to panic
   lat.value=latitude;
   lon.value=longitude;
   accuracy.value=acc;

   var coords=new google.maps.LatLng(latitude,longitude);

  set_map(coords);
  set_address(coords);
  set_nearAddress(coords);
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

			var info=new google.maps.InfoWindow({content:results[0].formatted_address,map:map});
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
	radius:5000,
	type:['police']

	},callback);
	}

	function callback(results,status)
	{
	if(status=='OK')
	{
     console.log(results);
     mobileno=results[0].place_id;

 var Nearest=new google.maps.places.PlacesService(map);

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
  else{console.log('wtf');}
	}

  function create_marker(place)
  	{

      var icon = {
          url: "https://maps.gstatic.com/mapfiles/place_api/icons/police-71.png", // url
          scaledSize: new google.maps.Size(50, 50), // scaled size
          origin: new google.maps.Point(0,0), // origin
          anchor: new google.maps.Point(0, 0) // anchor
      };

  	 var marker2=new google.maps.Marker({position:place.geometry.location,
         icon:icon,
       map:map,
       title:place.name
     });
  	// var info2=new google.maps.InfoWindow({content:place.name,map:map});
  	// marker2.addListener('click',function()
  	// {
  	// info2.open(map,marker2);
  	// });

  	}
