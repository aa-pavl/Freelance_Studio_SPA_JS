import {Dashboard} from "./components/dashboard.js";

export class Router {

    constructor() {
        this.titlePageElement = document.getElementById('title');
        this.contentPageElement = document.getElementById('content');

        this.initEvents();
        this.routes = [
            {
                route: '/',
                title: 'Дашборд',
                filePathTemplate: '/templates/dashboard.html',
                load: () => {
                    new Dashboard();
                },
            },
            {
                route: '/404',
                title: 'Страница не найдена',
                filePathTemplate: '/templates/404.html',
            },
            {
                route: '/login',
                title: 'Авторизация',
                filePathTemplate: '/templates/login.html',
                load: () => {
                    new Dashboard();
                },
            },
            {
                route: '/signup',
                title: 'Регистрация',
                filePathTemplate: '/templates/signup.html',
                load: () => {
                    new Dashboard();
                },
            },
        ];
    }

    initEvents() {
        // отлов страницы загрузки (login, signup)
        window.addEventListener('DOMContentLoaded', this.activateRoute.bind(this));
        // переход на др.стр. (изменение URL)
        window.addEventListener('popstate', this.activateRoute.bind(this));
    }

    async activateRoute() {
        const urlRoute = window.location.pathname;
        const newRout = this.routes.find(item => item.route === urlRoute);

        if (newRout) {
            if (newRout.title) {
                this.titlePageElement.innerText = newRout.title + ' | Freelance Studio';
            }
            if (newRout.filePathTemplate) {
                this.contentPageElement.innerHTML = await fetch(newRout.filePathTemplate).then(response => response.text());
            }
        } else {
            console.log('No route found');
            window.location = '/404';
        }
    }

}