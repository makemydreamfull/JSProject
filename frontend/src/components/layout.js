import "../styles/index.css";

export class Layout{
    constructor() {
        this.layoutElement = document.getElementById('layout')
        document.addEventListener('clikc',this.clickLayout.bind(this))
    }
    clickLayout(){
        sessionStorage.clear()

    }
}