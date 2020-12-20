import {gsap} from "gsap";

const pageToRiskEnter = (next) => {
    return gsap.from(next.container, {
        opacity: 0,
        duration: 1
    });
}

export default pageToRiskEnter;
