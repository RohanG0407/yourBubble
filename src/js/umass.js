import "../styling/umass.scss"
import "./barba-trans"
import "mapbox-gl/dist/mapbox-gl.css"
import {gsap} from "gsap"
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";

export class umass {
    static init(data) {
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

// Get a reference to the database service
        var database = firebase.database()
        let mapicon = data.querySelector(".mapbutton")
        let riskicon = data.querySelector(".riskcalcbutton")
        let timerate = data.querySelector(".timedrophover")

        let college = ''
        if(document.title == "UMass Amherst") {
            college = 'umass'
        } else if(document.title == "UIUC") {
            college = 'uiuc'
        } else {
            college = 'rpi'
        }

        /*let starCountRef = firebase.database().ref('coviddata/' + college);
        starCountRef.on('value', (snapshot) =>{
            let numElement = data.querySelector('#rate')
            let snap = snapshot.val();
            console.log(snap)
            numElement.innerHTML = snap['7 Day Average']
        });
        timerate.innerHTML = "in the last 7 days"; */


        timerate.addEventListener('click', () => {
            let college = ''
            if(document.title == "UMass Amherst") {
                college = 'umass'
            } else if(document.title == "UIUC") {
                college = 'uiuc'
            } else {
                college = 'rpi'
            }
            if (firebase.apps.length === 0) {
                firebase.initializeApp(firebaseConfig);
            }
            if (timerate.innerHTML === "in the last 7 days") {
                let starCountRef = firebase.database().ref('coviddata/' + college);
                starCountRef.on('value', (snapshot) =>{
                    let numElement = data.querySelector('#rate')
                    let snap = snapshot.val();
                    console.log(snap)
                    numElement.innerHTML = snap['Cumulative Average']
                });
                timerate.innerHTML = "cumulatively";
            } else {
                let starCountRef = firebase.database().ref('coviddata/' + college);
                starCountRef.on('value', (snapshot) =>{
                    let numElement = data.querySelector('#rate')
                    let snap = snapshot.val();
                    console.log(snap)
                    numElement.innerHTML = snap['7 Day Average']
                });
                timerate.innerHTML = "in the last 7 days"
            }

        })


        mapicon.addEventListener('mouseover', () => {
            gsap.to(mapicon, {
                opacity: 1,
                duration: 1,
            })

        })

        mapicon.addEventListener('mouseleave', () => {
            gsap.to(mapicon, {
                opacity: .5,
                duration: 1,
            })

        })

        riskicon.addEventListener('mouseover', () => {
            gsap.to(riskicon, {
                opacity: 1,
                duration: 1,
            })

        })

        riskicon.addEventListener('mouseleave', () => {
            gsap.to(riskicon, {
                opacity: .5,
                duration: 1,
            })

        })


    }

    static random(data) {
        const circle_amount = 50;
        for(let i = 0; i < circle_amount; i++) {
            let circle = document.createElement("img")
            circle.className = "circle";
            circle.src = "./assets/bubble1.png"
            data.appendChild(circle);
        }

        console.clear();

        const squares = gsap.utils.toArray(".circle");
        //const links = document.querySelectorAll('a');
        const tl = gsap.timeline();

        const viewMax = {};
        const pad = 5;

        const coords = {
            mouseX: 0,
            mouseY: 0
        }

        const onResize = () => {
            viewMax.x = window.innerWidth - pad;
            viewMax.y = window.innerHeight - pad;
        }

        const updateMousePosition = (e) => {
            coords.mouseX = e.clientX;
            coords.mouseY = e.clientY;
        }

        const tweenProperty = (target, prop) => {

            gsap.to(target, {
                duration: "random(10, 15)",
                [prop]: `random(${pad}, ${viewMax[prop]})`,
                ease: "sine.inOut",
                onComplete: tweenProperty,
                onCompleteParams: [target, prop],
            });
        }

        const setSquares = () => {
            // const tl = gsap.timeline();
            squares.forEach((square) => {
                gsap.set(square, {
                    x: `random(${pad}, ${viewMax.x})`,
                    y: `random(${pad}, ${viewMax.y})`,
                    xPercent: -50,
                    yPercent: -50,
                    scale: 0
                });
                gsap.to(square, {
                    duration: 0.2,
                    scale: 1
                });

                tweenProperty(square, "x");
                tweenProperty(square, "y");
            })
        }

        const groupSquaresAtCursor = () => {

            // *** NOT WORKING ***
            gsap.killTweensOf(squares);
            squares.forEach(square => {
                console.log("ACTIVE", gsap.isTweening(square));
            });


            // *** MANUALLY KILL ***
            gsap.getTweensOf(squares).forEach(t => t.kill());

            const tl = gsap.timeline();
            tl.to(squares, {
                duration: 0.3,
                borderRadius: '50%'
            })
            tl.to(squares, {
                duration: 0.2,
                scale: 3
            })
            window.addEventListener("mousemove", squaresFollowCursor);
            squaresFollowCursor();
        }

        const squaresFollowCursor = () => {
            gsap.to(squares, {
                duration: 0.3,
                x: coords.mouseX,
                y: coords.mouseY
            })
        }

        const disperseSquares = () => {

            window.removeEventListener("mousemove", squaresFollowCursor);
            squares.forEach((square) => {
                gsap.to(square, {
                    duration: 0.2,
                    scale: 1,
                    borderRadius: '10px',

                    overwrite: true,

                    x: coords.mouseX,
                    y: coords.mouseY,

                    onComplete() {
                        tweenProperty(square, "x");
                        tweenProperty(square, "y");
                    }
                });
            })
        }

        const idleSquares = () => {
            // a repeating animation of squares moving around the screen...when not hovered
        }

        onResize();
        setSquares();

        window.addEventListener("resize", onResize);

        //links.forEach(link => link.addEventListener("mouseenter", groupSquaresAtCursor));
        //links.forEach(link => link.addEventListener("mouseout", disperseSquares));
        window.addEventListener("mousemove", updateMousePosition);
    }

}