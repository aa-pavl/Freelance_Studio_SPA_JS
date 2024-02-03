import {Router} from "./router.js";


// формальная точка входа
class App {
    constructor() {
        new Router();
    }
}

(new App());