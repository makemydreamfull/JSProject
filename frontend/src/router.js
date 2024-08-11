import {Layout} from "./components/layout.js";
import {Login} from "./components/auth/login.js";
import {SignUp} from "./components/auth/sign-up.js";
import {Expenses} from "./components/type/expenses.js";
import {Income} from "./components/type/income.js";
import {EditingCreationExpensesIncome} from "./components/editing-expenses-income.js";
import {All} from "./components/all.js";
import {Error} from "./components/404.js";
import {CreationEditingAll} from "./components/creation-edit-all.js"
import {Pie} from "./libcomponents/acquisitions.js"
import {Logout} from "./components/auth/logout.js";
import {AuthUtils} from "./utils/auth-utils.js";

export class Router {
    constructor() {
        this.contentPageElement = document.getElementById('content')
        this.titlePageElement = document.getElementById('title')
        this.categoriesPageElement = document.getElementById('categories')
        this.hiddenPageElement = document.getElementById('item-hidden')
        this.buttonPageElement = document.getElementsByClassName('item-button')
        this.arrowPageElement = document.getElementById('turn')
        this.exitPageElement = document.querySelector('.exit')
        this.layoutElement = document.getElementById('layout')
        this.initEvents();
        this.router = [
            {
                route: '/',
                title: 'Главная',
                filePathTemplate: '/templates/layout.html',
                load: () => {
                    new Layout();
                    new Pie();
                    new Logout(this.openNewRoute.bind(this));
                },
            },
            {
                route: '/creation-income',
                title: 'Получение дохода',
                filePathTemplate: '/templates/creation-and-editing-input.html',
                filePathTemplateTextTitle: 'Создание категории доходов',
                load: () => {
                    new EditingCreationExpensesIncome(this.openNewRoute.bind(this));
                },
            },
            {
                route: '/expenses',
                title: 'Расходы',
                filePathTemplate: '/templates/type/expenses.html',
                load: () => {
                    new Expenses(this.openNewRoute.bind(this));
                },
            },
            {
                route: '/income',
                title: 'Доходы',
                filePathTemplate: '/templates/type/income.html',
                load: () => {
                    new Income(this.openNewRoute.bind(this));
                },

            },
            {
                route: '/editing-income',
                title: 'Редактирование доходов',
                filePathTemplate: '/templates/creation-and-editing-input.html',
                filePathTemplateTextTitle: 'Редактирование категории доходов',
                load: () => {
                    new EditingCreationExpensesIncome(this.openNewRoute.bind(this));
                },
            },
            {
                route: '/editing-expenses',
                title: 'Редактирование расходов',
                filePathTemplate: '/templates/creation-and-editing-input.html',
                filePathTemplateTextTitle: 'Редактирование категории расходов',
                load: () => {
                    new EditingCreationExpensesIncome(this.openNewRoute.bind(this));
                },
            },
            {
                route: '/editing-all',
                title: 'Редактирование доходов и расходов',
                filePathTemplate: '/templates/editing-all.html',
                filePathTemplateTextTitle: '',
                load: () => {
                    new CreationEditingAll();
                },
            },
            {
                route: '/creation-expenses',
                title: 'Создание расходов',
                filePathTemplate: '/templates/creation-and-editing-input.html',
                filePathTemplateTextTitle: 'Создание категории расходов',
                load: () => {
                    new EditingCreationExpensesIncome(this.openNewRoute.bind(this));
                },
            },
            {
                route: '/creation-all',
                title: 'Создание доходов и расходов',
                filePathTemplate: '/templates/creation-all.html',
                filePathTemplateTextTitle: 'Создание дохода/расхода',
                load: () => {
                    new CreationEditingAll(this.openNewRoute.bind(this));
                },
            },
            {
                route: '/all',
                title: 'Доходы и расходы',
                filePathTemplate: '/templates/all.html',
                load: () => {
                    new All();
                },
            },
            {
                route: '/404',
                title: 'Ошибка',
                filePathTemplate: '/templates/404.html',
                load: () => {
                    new Error();
                },
            },
            {
                route: '/login',
                title: 'Регистрация',
                filePathTemplate: '/templates/auth/login.html',
                load: () => {
                    new Login(this.openNewRoute.bind(this));
                },
            },
            {
                route: '/sign-up',
                title: 'Авторизация',
                filePathTemplate: '/templates/auth/sign-up.html',
                load: () => {
                    new SignUp(this.openNewRoute.bind(this));
                },
            },
        ]
    }

    initEvents() {
        document.addEventListener('click', this.clickHandler.bind(this))
        this.categoriesPageElement.addEventListener('click', this.clickButtonCategoriesAndExit.bind(this));

    }

    async openNewRoute(url){

        const currentRoute = window.location.pathname
        history.pushState({},'',url)
        await this.activateRoute(null, currentRoute)
    }
    async clickHandler(e){
        let element = null;
        if(e.target.parentElement.nodeName === 'A'){
            element = e.target.parentElement
        }
        if(e.target.nodeName === 'A'){
            element = e.target
        }
        if(e.target.parentElement.parentElement.nodeName === 'A'){
            element = e.target.parentElement.parentElement
        }

        if(element){

            e.preventDefault()
            const currentRoute = window.location.pathname
            const url = element.href.replace(window.location.origin, '')
            if(!url || url === '/#' || url.startsWith('javascript:void(0)')){
                return
            }
            console.log(!AuthUtils.getAuthInfo(AuthUtils.accessTokenKey) && !(url === '/signup'))
            if(!AuthUtils.getAuthInfo(AuthUtils.accessTokenKey) && url !== '/sign-up') {
                return this.openNewRoute('/login')
            }
            await this.openNewRoute(url)
        }
    }
    async activateRoute(e,oldRoute = null) {
        this.activeUser()
        const urlRoute = window.location.pathname
        console.log(urlRoute)
        const newRoute = this.router.find(item => item.route === urlRoute)
        if (newRoute) {

            if (newRoute.title) {
                this.titlePageElement.innerText = newRoute.title
            }
            if (newRoute.filePathTemplate) {
                this.contentPageElement.innerHTML = await fetch(newRoute.filePathTemplate).then(response => response.text())
            }
            if (newRoute.load && typeof newRoute.load === 'function') {
                newRoute.load()
            }
            try {
                if (newRoute.filePathTemplateTextTitle) {
                    document.getElementById('title-container').innerText = newRoute.filePathTemplateTextTitle
                }
            } catch (e) {
                return;
            }


        } else {
            console.log('Error! Not found.')
            history.pushState({},'', '/404')
            await this.activateRoute()
        }


    }

    clickButtonCategoriesAndExit() {
        document.querySelectorAll('.link-btn').forEach(el => {
            el.addEventListener('click', (item) => {
                el.style.backgroundColor = '#0D6EFD'
            })
        })
        this.categoriesPageElement.style.border = '0'
        this.arrowPageElement.style.transform = 'rotate(90deg)'
        this.buttonPageElement[2].style.backgroundColor = '#0D6EFD'
        this.buttonPageElement[2].style.color = '#FFFFFF'
        this.buttonPageElement[2].childNodes[1].style.fill = '#FFFFFF'
        if (this.hiddenPageElement.classList.contains('open')) {
            this.buttonPageElement[2].style.backgroundColor = '#FFFFFFFF'
            this.buttonPageElement[2].style.color = '#000000'
            this.buttonPageElement[2].childNodes[1].style.fill = '#000000'
            this.arrowPageElement.style.transform = 'rotate(0deg)'
            this.hiddenPageElement.classList.remove('open')
        } else {
            this.buttonPageElement[2].style.backgroundColor = '#0D6EFD'
            this.buttonPageElement[2].style.color = '#FFFFFFFF'
            this.hiddenPageElement.classList.add('open')

        }


    }
    activeUser(){
        const objUser = JSON.parse(AuthUtils.getAuthInfo(AuthUtils.userInfoTokenKey))
        if(AuthUtils.getAuthInfo(AuthUtils.userInfoTokenKey) && (AuthUtils.getAuthInfo(AuthUtils.accessTokenKey) && AuthUtils.getAuthInfo(AuthUtils.accessTokenKey))){
            document.getElementById('user').innerHTML = `<a href="/login" class="d-flex">
                        <svg width="36" height="36" viewBox="0 0 36 36" fill="none"
                             xmlns="http://www.w3.org/2000/svg"
                             class="m-3">
                            <circle cx="18" cy="18" r="18" fill="#D9D9D9"/>
                            <path d="M18 18C19.0609 18 20.0783 17.5786 20.8284 16.8284C21.5786 16.0783 22 15.0609 22 14C22 12.9391 21.5786 11.9217 20.8284 11.1716C20.0783 10.4214 19.0609 10 18 10C16.9391 10 15.9217 10.4214 15.1716 11.1716C14.4214 11.9217 14 12.9391 14 14C14 15.0609 14.4214 16.0783 15.1716 16.8284C15.9217 17.5786 16.9391 18 18 18ZM20.6667 14C20.6667 14.7072 20.3857 15.3855 19.8856 15.8856C19.3855 16.3857 18.7072 16.6667 18 16.6667C17.2928 16.6667 16.6145 16.3857 16.1144 15.8856C15.6143 15.3855 15.3333 14.7072 15.3333 14C15.3333 13.2928 15.6143 12.6145 16.1144 12.1144C16.6145 11.6143 17.2928 11.3333 18 11.3333C18.7072 11.3333 19.3855 11.6143 19.8856 12.1144C20.3857 12.6145 20.6667 13.2928 20.6667 14ZM26 24.6667C26 26 24.6667 26 24.6667 26H11.3333C11.3333 26 10 26 10 24.6667C10 23.3333 11.3333 19.3333 18 19.3333C24.6667 19.3333 26 23.3333 26 24.6667ZM24.6667 24.6613C24.6653 24.3333 24.4613 23.3467 23.5573 22.4427C22.688 21.5733 21.052 20.6667 18 20.6667C14.9467 20.6667 13.312 21.5733 12.4427 22.4427C11.5387 23.3467 11.336 24.3333 11.3333 24.6613H24.6667Z"
                                  fill="#6C757D"/>
                        </svg>
                        <span id="user-name" class="d-flex align-items-center ">${objUser.name} ${objUser.lastName}</span>
                    </a>`
            this.exitPageElement.setAttribute( 'style','display: flex !important')
        }
    }
}

