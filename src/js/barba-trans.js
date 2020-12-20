import barba from '@barba/core';
import barbaPrefetch from '@barba/prefetch';
import {umass} from "./umass"
import {dropdowns} from "../gsap/dropdowns"
import {map} from "./map"
import {riskcalc} from "./riskcalc"
import {buildingNames} from "./buildingNames";
import {pageToRiskEnter, pageToRiskLeave} from "../gsap/transitions/animation-imports";
import {backButton} from "./backButton";

barba.use(barbaPrefetch);

barba.init({
    cacheIgnore: true,
    transitions: [
        //First time loading page call imports
        {
            name: "first-landing",
            namespace: "landing",
            once: import("./index")
        },
        {
            name: "first-umass",
            namespace: "umass",
            once: import('./umass'),
        },
        {
            name: "first-umass",
            namespace: "uiuc",
            once: import('./uiuc')
        },
        {
            name: "first-rpi",
            namespace: "rpi",
            once: import("./rpi")
        },
        {
          name: "first-riskcalc",
          namespace: "riskcalc",
          once: import("./riskcalc"),
            after(data) {

            }
        },
        {
            name: "first-map",
            namespace: "mapt",
            once: import("./map")
        },
        {
            name: "toRiskCalc",
            from: {
                namespace: [
                    "umass",
                    "uiuc",
                    "rpi"
                ]
            },
            to: {
                namespace: "riskcalc"
            },
            afterEnter(data) {
                let prevPage = data.current.container.getElementsByTagName('label')[0].textContent
                if (prevPage === 'UIUC') {
                    map.init(data.next.container, [-88.2272, 40.1020], true, true, 'uiuc')
                    riskcalc.submitButton(data.next.container, "uiuc")
                    riskcalc.init(data.next.container.querySelector("#myInput"),buildingNames.getNames('uiuc'))
                } else if (prevPage === 'UMass Amherst') {
                    map.init(data.next.container, [-72.5301, 42.3868], true, true, 'umass')
                    riskcalc.submitButton(data.next.container, "umass")
                    riskcalc.init(data.next.container.querySelector("#myInput"),buildingNames.getNames('umass'))
                } else {
                    map.init(data.next.container, [-73.6789, 42.7298], true, true, 'rpi')
                    riskcalc.submitButton(data.next.container, "rpi")
                    riskcalc.init(data.next.container.querySelector("#myInput"),buildingNames.getNames('rpi'))
                }
            },

        },
        {
            name: "general-transitions",
            leave: ({current}) => pageToRiskLeave(current.container),
            enter(data){
                pageToRiskEnter(data.next);
            },
        },
        {
            name: "toMap",
            from: {
                namespace: [
                    "umass",
                    "uiuc",
                    "rpi"
                ]
            },
            to: {
                namespace: "mapt"
            },

            afterEnter(data) {
                let prevPage = data.current.container.getElementsByTagName('label')[0].textContent
                if(prevPage === 'UIUC') {
                    map.init(data.next.container, [-88.2272, 40.1020], true, false, 'uiuc')
                } else if(prevPage === 'UMass Amherst') {
                    map.init(data.next.container, [-72.5301, 42.3868], true, false, 'umass')
                } else {
                    map.init(data.next.container, [-73.6789, 42.7298], true, false, 'rpi')
                }
            },
            leave: ({current}) => pageToRiskLeave(current.container),
            enter(data){
                pageToRiskEnter(data.next);
            },
        },

    ],
    views: [
        {
            namespace: "umass",
            afterEnter(data) {
                umass.init(data.next.container)
                backButton.goBack(data.next.container)
            }
        },
        {
            namespace: "landing",
            afterEnter(data) {
                umass.random(data.next.container)
                dropdowns.index(data.next.container)
            }
        },
        {
            namespace: "mapt",
            beforeEnter(data) {
                map.init(data.next.container, [-72.5301, 42.3868], true, false, 'umass')
                backButton.goBack(data.next.container)
            }
        },
        {
            namespace: "uiuc",
            afterEnter(data) {
                umass.init(data.next.container)
                backButton.goBack(data.next.container)
            }
        },
        {
            namespace: "rpi",
            afterEnter(data) {
                umass.init(data.next.container)
                backButton.goBack(data.next.container)
            }
        },
        {
            namespace: "riskcalc",
            afterEnter(data) {
                map.init(data.next.container, [-72.5301, 42.3868], true, true, 'umass')
                riskcalc.submitButton(data.next.container, 'umass')
                riskcalc.init(data.next.container.querySelector("#myInput"),buildingNames.getNames('umass'))
                backButton.goBack(data.next.container)
            }
        }

    ],


});