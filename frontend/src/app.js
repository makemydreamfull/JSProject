import "./styles/index.css";
import {Router} from "./router.js";
class App{
    constructor() {
        window.addEventListener('DOMContentLoaded', this.handleRouting.bind(this));
        window.addEventListener('popstate', this.handleRouting.bind(this));
    }
    handleRouting(){
        new Router();

    }
}
(new App());