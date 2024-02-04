import {Dashboard} from "./components/dashboard";
import {Login} from "./components/login";
import {Signup} from "./components/signup";

export class Router {

    constructor() {
        this.titlePageElement = document.getElementById('title');
        this.contentPageElement = document.getElementById('content');
        this.adminStyleElement = document.getElementById('admin_style');

        this.initEvents();
        this.routes = [
            {
                route: '/',
                title: 'Дашборд',
                filePathTemplate: '/templates/dashboard.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    new Dashboard();
                },
            },
            {
                route: '/404',
                title: 'Страница не найдена',
                filePathTemplate: '/templates/404.html',
                useLayout: false,
            },
            {
                route: '/login',
                title: 'Авторизация',
                filePathTemplate: '/templates/login.html',
                useLayout: false,
                load: () => {
                    document.body.classList.add('login-page');
                    document.body.style.height = '100vh';
                    new Login();
                },
                styles: ['icheck-bootstrap.min.css']
            },
            {
                route: '/signup',
                title: 'Регистрация',
                filePathTemplate: '/templates/signup.html',
                useLayout: false,
                load: () => {
                    document.body.classList.add('register-page');
                    document.body.style.height = '100vh';
                    new Signup();
                },
                styles: ['icheck-bootstrap.min.css']
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
            if (newRout.styles && newRout.styles.length > 0) {
                newRout.styles.forEach(style => {
                    const link = document.createElement('link');
                    link.rel = 'stylesheet';
                    link.href = '/css/' + style;

                    document.head.insertBefore(link, this.adminStyleElement);
                });
            }
            if (newRout.title) {
                this.titlePageElement.innerText = newRout.title + ' | Freelance Studio';
            }
            if (newRout.filePathTemplate) {
                document.body.className = "";
                let contentBlock = this.contentPageElement;
                if (newRout.useLayout) {
                    this.contentPageElement.innerHTML = await fetch(newRout.useLayout).then(response => response.text());
                    contentBlock = document.getElementById('content-wrapper');
                    document.body.classList.add('sidebar-mini');
                    document.body.classList.add('layout-fixed');
                } else {
                    document.body.classList.remove('sidebar-mini');
                    document.body.classList.remove('layout-fixed');
                }
                contentBlock.innerHTML = await fetch(newRout.filePathTemplate).then(response => response.text());
            }
            if (newRout.load && typeof newRout.load === "function") {
                newRout.load();
            }
        } else {
            console.log('No route found');
            window.location = '/404';
        }
    }

}