<!DOCTYPE html>
<html>
<head>
   <title>Simple HERE Map</title>
   <link rel="stylesheet" type="text/css" href="https://js.api.here.com/v3/3.1/mapsjs-ui.css" />
   <style>
      html, body { border: 0; margin: 0; padding: 0; }
      #map { height: 50vh; width: 50vw; }
   </style>
  <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js"></script>
  <script>
      
      </script>
</head>
<body>
<?php 
 echo $_GET['data']; // ALE TUTAJ I TAK JEJ NIE MA 
?>
<div id="pokaz"></div>
<div id="response"></div>
   <div id="map"></div>
   <script src="https://js.api.here.com/v3/3.1/mapsjs-core.js"></script>
   <script src="https://js.api.here.com/v3/3.1/mapsjs-service.js"></script>
   <script src="https://js.api.here.com/v3/3.1/mapsjs-ui.js"></script>
   <script src="https://js.api.here.com/v3/3.1/mapsjs-mapevents.js"></script>

             <script type="text/javascript">

            
            const platform = new H.service.Platform({ apikey: 'R-K26E5jaTJ7u0U6DKbIMJPKcb6DcKgQt4pAvwNcbIs' });
            const defaultLayers = platform.createDefaultLayers();

            const map = new H.Map(document.getElementById('map'),
         defaultLayers.vector.normal.map, {
         center: { lat: 52.5309, lng: 13.3847 },
         zoom: 5,
         pixelRatio: window.devicePixelRatio || 1
          });

                    window.addEventListener('resize', () => map.getViewPort().resize());
                    const behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(map));
                    const ui = H.ui.UI.createDefault(map, defaultLayers);

                    var loki1 =0;
                   // Get an instance of the geocoding service:
                        const searchText = 'Suwałki';
                        const geocoder = platform.getGeocodingService();

                        
                             geocoder.geocode({ searchText }).then(()=>result => {
                            const location = result.Response.View[0].Result[0].Location.DisplayPosition;
                            const { Latitude : lat, Longitude: lng } = location;
                            const marker = new H.map.Marker({ lat, lng });
                            loki1 = lat + "," + lng ;
                            console.log(loki1);
                         }); 

  
        console.log(loki1);                  
var routingParameters = {
  'routingMode': 'fast',
  'transportMode': 'car',
  // The start point of the route:
  'origin': '50.1120423728813,8.68340740740811',
  // The end point of the route:
  'destination': '52.5309916298853,13.3846220493377',
  // Include the route shape in the response
  'return': 'polyline'
};

// Define a callback function to process the routing response:
var onResult = function(result) {
  // ensure that at least one route was found
  if (result.routes.length) {
    result.routes[0].sections.forEach((section) => {
         // Create a linestring to use as a point source for the route line
        let linestring = H.geo.LineString.fromFlexiblePolyline(section.polyline);

        // Create a polyline to display the route:
        let routeLine = new H.map.Polyline(linestring, {
          style: { strokeColor: 'blue', lineWidth: 3 }
        });

        // Create a marker for the start point:
        let startMarker = new H.map.Marker(section.departure.place.location);

        // Create a marker for the end point:
        let endMarker = new H.map.Marker(section.arrival.place.location);

        // Add the route polyline and the two markers to the map:
        map.addObjects([routeLine, startMarker, endMarker]);

        // Set the map's viewport to make the whole route visible:
        map.getViewModel().setLookAtData({bounds: routeLine.getBoundingBox()});
    });
  }
};

// Get an instance of the routing service version 8:
var router = platform.getRoutingService(null, 8);

// Call calculateRoute() with the routing parameters,
// the callback and an error callback function (called if a
// communication error occurs):
router.calculateRoute(routingParameters, onResult,
  function(error) {
    alert(error.message);
  });
    
   </script>

 <?php 
 echo $_POST['loki1']; // ALE TUTAJ I TAK JEJ NIE MA 
?>

</body>
</html>

