import "./styles/style.scss";
import {Router} from "./router";

// формальная точка входа
class App {
    constructor() {
        new Router();
    }
}

(new App());