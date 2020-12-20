import {gsap} from "gsap"

export class dropdowns {
    static index(data){
        let defaultTextColor = '#e8e8e8';
        let selectedTextColor = '#23CE6B';
        let dropdown = data.querySelector("#dropdown")
        let dropdowncontent = data.querySelector(".dropdowncontent")

        dropdown.addEventListener('mouseover', () => {
            dropdowncontent.style.display = "block";
        })
        dropdown.addEventListener('mouseleave', () => {
            dropdowncontent.style.display = "none";
        })
    }

    static umass(data){
        let dropdown = data.querySelector(".collegedrophover")
        let dropdowncontent = data.querySelector("#dropdowncontent")

        dropdown.addEventListener('mouseover', () => {
            dropdowncontent.style.display = "block";

        })
        dropdown.addEventListener('mouseleave', () => {
            dropdowncontent.style.display = "none";
        })

    }


}

