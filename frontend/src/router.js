import {Dashboard} from "./components/dashboard";
import {Login} from "./components/auth/login";
import {Signup} from "./components/auth/signup";
import {Logout} from "./components/auth/logout";
import {FreelancersList} from "./components/freelancers/freelancers-list";
import {FreelancersView} from "./components/freelancers/freelancers-view";
import {FileUtils} from "./utils/file-utils";

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
                filePathTemplate: '/templates/pages/dashboard.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    new Dashboard();
                },
            },
            {
                route: '/404',
                title: 'Страница не найдена',
                filePathTemplate: '/templates/pages/404.html',
                useLayout: false,
            },
            {
                route: '/login',
                title: 'Авторизация',
                filePathTemplate: '/templates/pages/auth/login.html',
                useLayout: false,
                load: () => {
                    document.body.classList.add('login-page');
                    document.body.style.height = '100vh';
                    new Login(this.openNewRoute.bind(this));
                },
                unload: () => {
                    document.body.classList.remove('login-page')
                    document.body.style.height = 'auto';
                },
                styles: ['icheck-bootstrap.min.css']
            },
            {
                route: '/signup',
                title: 'Регистрация',
                filePathTemplate: '/templates/pages/auth/signup.html',
                useLayout: false,
                load: () => {
                    document.body.classList.add('register-page');
                    document.body.style.height = '100vh';
                    new Signup(this.openNewRoute.bind(this));
                },
                unload: () => {
                    document.body.classList.remove('register-page')
                    document.body.style.height = 'auto';
                },
                styles: ['icheck-bootstrap.min.css']
            },
            {
                route: '/logout',
                load: () => {
                    new Logout(this.openNewRoute.bind(this));
                }
            },
            {
                route: '/freelancers',
                title: 'Фрилансер',
                filePathTemplate: '/templates/pages/freelancers/list.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    new FreelancersList(this.openNewRoute.bind(this));
                },
                unload: () => {
                },
                styles: ['dataTables.bootstrap4.min.css'],
                scripts: ['jquery.dataTables.min.js',
                          'dataTables.bootstrap4.min.js']
            },
            {
                route: '/freelancers/view',
                title: 'Просмостр фрилансера',
                filePathTemplate: '/templates/pages/freelancers/view.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    new FreelancersView(this.openNewRoute.bind(this));
                },
            },
            {
                route: '/freelancers/create',
                title: 'Создание фрилансера',
                filePathTemplate: '/templates/pages/freelancers/create.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    new FreelancersView(this.openNewRoute.bind(this));
                },
            },
        ];
    }

    initEvents() {
        // отлов страницы загрузки (login, signup)
        window.addEventListener('DOMContentLoaded', this.activateRoute.bind(this));
        // переход на др.стр. (изменение URL)
        window.addEventListener('popstate', this.activateRoute.bind(this));

        // создаем функцию отслеживаничя любого клика по странице (fix bug перезагрузки приложения для каждой стр.)
        document.addEventListener('click', this.clickHandler.bind(this));
    }

    async clickHandler(e) {
        console.log(e.target);
        let element = null;
        if (e.target.nodeName === "A") {
            element = e.target;
        } else if (e.target.parentNode.nodeName === 'A') {
            element = e.target.parentNode;
        }

        if (element) {
            e.preventDefault();

            const curRoute = window.location.pathname;
            const url = element.href.replace(window.location.origin, '');
            if (!url ||(curRoute === url.replace('#','')) || url.startsWith('javascript:void(0)')) {
                return;
            }
            console.log(url);
            await this.openNewRoute(url);
        }
    }

    async openNewRoute(url) {
        const curRoute = window.location.pathname;
        history.pushState({}, '', url);
        await this.activateRoute(null, curRoute);
    }

    async activateRoute(e, oldRoute = null) {
        if (oldRoute) {
            const prevRoute = this.routes.find(item => item.route === oldRoute);
            if (prevRoute.styles && prevRoute.styles.length > 0) {
                prevRoute.styles.forEach(style => {
                    document.querySelector(`link[href='/css/${style}']`).remove();
                });
            }
            if (prevRoute.scripts && prevRoute.scripts.length > 0) {
                prevRoute.scripts.forEach(script => {
                    document.querySelector(`script[src='/js/${script}']`).remove();
                });
            }
            if (prevRoute.unload && typeof prevRoute.unload === "function") {
                prevRoute.unload();
            }
        }

        const urlRoute = window.location.pathname;
        const newRout = this.routes.find(item => item.route === urlRoute);
        if (newRout) {
            if (newRout.styles && newRout.styles.length > 0) {
                newRout.styles.forEach(style => {
                    FileUtils.loadPageStyle('/css/' + style, this.adminStyleElement);
                });
            }
            if (newRout.scripts && newRout.scripts.length > 0) {
                for (const script of newRout.scripts) {
                    await FileUtils.loadPageScript('/js/' + script);
                }
            }
            if (newRout.title) {
                this.titlePageElement.innerText = newRout.title + ' | Freelance Studio';
            }
            if (newRout.filePathTemplate) {
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
            history.pushState({}, '', '/404');
            await this.activateRoute();
        }
    }
}