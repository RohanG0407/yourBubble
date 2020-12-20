
export class backButton {
    static goBack(data) {
        let backB = data.querySelector(".backbutton")
        backB.addEventListener("click", () => {
            window.history.back();
        })
    }
}