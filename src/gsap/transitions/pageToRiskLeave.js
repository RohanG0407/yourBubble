import {gsap} from "gsap"

const pageToRiskLeave = (container) => {
    return gsap.to(container, {
            opacity: 0,
            duration: 1
        },
    )
}
export default pageToRiskLeave;