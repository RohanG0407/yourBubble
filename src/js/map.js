import "./barba-trans"
import "../styling/map.scss"
import "mapbox-gl/dist/mapbox-gl.css"
import mapboxgl from "mapbox-gl";
import {writeUserData, readData} from "./firebase-database";
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";

var firebaseConfig = {
    apiKey: "AIzaSyAbOR9H_82urCsl6tSBP656BH_7Qrndfa8",
    authDomain: "yourbubble-69f44.firebaseapp.com",
    databaseURL: "https://yourbubble-69f44-default-rtdb.firebaseio.com/",
    projectId: "yourbubble-69f44",
    storageBucket: "yourbubble-69f44.appspot.com",
    messagingSenderId: "21338274072",
    appId: "1:21338274072:web:11a488a3846fd5713c066d",
    measurementId: "G-KSR6M7XC12"
};

firebase.initializeApp(firebaseConfig);

// Get a reference to the database service
var database = firebase.database()


export class map {
    static init(data, center, interactive, small, college) {
        var json = require('../assets/data/' + college + '.json')
        var starCountRef = firebase.database().ref('buildings/' + college);
        starCountRef.on('value', (snapshot) =>{
            let data = snapshot.val();
            let keys = Object.keys(data)
            //console.log(keys)
            for(let i = 0; i < keys.length; i++) {
                //console.log(json.features[i].properties)
                let name = json.features[i].properties.name
                //console.log(data["Ikenberry Dining Center"])
                json.features[i].properties.covidIndex = data[name]
                //onsole.log(json.features[i].properties)
                //map.fire("load")

            }
        });


        //var covidData = readData('buildings/' + college)
        let mapdiv = ""
        let submitButton = ""
        if(small){
            mapdiv = data.querySelector("#mapsmall")
            submitButton = data.querySelector("#buildingForm")
            submitButton.addEventListener('submit', (e) => {
                e.preventDefault();
                let text = data.querySelector('#myInput').value
                for(let i = 0; i < json.features.length; i++) {
                    let name = json.features[i].properties.name
                    if(name === text) {
                        let center = json.features[i].geometry.coordinates
                        map.flyTo({
                            center: center,
                            essential: true // this animation is considered essential with respect to prefers-reduced-motion
                        });
                    }
                }


            })
        } else {
            mapdiv = data.querySelector("#mapbig")
        }
        // HTML element of the map in umass.html
        console.log(document.body.querySelector("#unique-contents"))

        mapboxgl.accessToken = 'pk.eyJ1Ijoic2FhdGh2aWstbmFycmEiLCJhIjoiY2s4OWtrZmZ5MDgyeDNucDRlcGphYWYwMSJ9.z2qVVaEB7nU-QIy2GNGArg';
        const map = new mapboxgl.Map({
            container: mapdiv,
            style: 'mapbox://styles/saathvik-narra/ckiwtcgpm0dgm19s5viifhhz1', // stylesheet location
            center: center, // starting position [lng, lat]
            zoom: 15,// starting zoom,
            interactive: interactive,
            maxZoom: 18,
        });
        map.on('load', function () {
            console.log("loaded")
                    map.addSource('points', {
                        'type': 'geojson',
                        'data': json
                    });

            var popup = new mapboxgl.Popup({
                closeButton: false,
                closeOnClick: false,
                className: 'popup'
            });


// Add a symbol layer
                    map.addLayer({
                        'interactive': true,
                        'id': 'points',
                        'type': 'circle',
                        'source': 'points',
                        'paint': {
                            'circle-radius': {
                                'base': 30,
                                'stops': [
                                    [15, 30],
                                    [18, 250]
                                ],
                            },
                            'circle-color': [
                                'match',
                                ['get', 'covidIndex'],
                                '0',
                                'green',
                                '1',
                                'green',
                                '2',
                                'green',
                                '3',
                                'green',
                                '4',
                                'yellow',
                                '5',
                                'yellow',
                                '6',
                                'orange',
                                '7',
                                'orange',
                                'red'
                            ],
                            'circle-opacity': .5,
                        },

                    });

            map.addLayer({
                'id': 'numbers',
                'type': 'symbol',
                'source': 'points',
                'layout': {
                    'text-field': ['get', 'covidIndex'],
                    'text-font': [
                        'Open Sans Bold',
                        'Arial Unicode MS Bold'
                    ],
                    'text-size': 20
                },
                'paint': {
                    'text-color': 'rgba(0,0,0,0.5)'
                }
            });

            map.on('mouseenter', 'points', function (e) {
// Change the cursor style as a UI indicator.
                map.getCanvas().style.cursor = 'pointer';

                var coordinates = e.features[0].geometry.coordinates.slice();
                var name = e.features[0].properties.name;
                var category = e.features[0].properties.category;
                var desc = "<p class='name'>" + name + "</p>" + "<p class='category'>" + "Building Type: " + category + "</p>";

// Ensure that if the map is zoomed out such that multiple
// copies of the feature are visible, the popup appears
// over the copy being pointed to.
                while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
                    coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
                }

// Populate the popup and set its coordinates
// based on the feature found.
                popup.setLngLat(coordinates).setHTML(desc).addTo(map);
            });

            map.on('mouseleave', 'points', function () {
                map.getCanvas().style.cursor = '';
                popup.remove();
            });


        });


    }
}