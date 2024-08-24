import {HttpUtils} from "../utils/http-utils.js";

export class Category {
    constructor(openNewRoute, type, action) {
        this.openNewRoute = openNewRoute;
        this.type = type;
        this.action = action;
        this.categoriesRoute = '/categories/' + this.type;
        this.approveButton = document.getElementById('create');
        this.valueTypeElement = document.getElementById('type')
        const urlParams = new URLSearchParams(window.location.search);
        if (this.action === 'edit') {
            this.id = urlParams.get('id')
            if (!this.id) {
                return this.openNewRoute('/')
            }
        }
        this.approveButton.addEventListener('click', this.approveButtonClick.bind(this))
        this.init();
    }

    async init() {
        const titleElement = document.getElementById('title-container');
        titleElement.innerText = (this.action === 'add' ? 'Создание ' : 'Редактирование ') + 'категории ' + (this.type === 'income' ? 'доходов' : 'расходов');

        this.approveButton.innerText = this.action === 'add' ? 'Создать' : 'Сохранить';
        if (this.action === 'edit') {
            try {
                const result = await HttpUtils.request(this.categoriesRoute + '/' + this.id);
                if (result) {
                    if (result.error || result.redirect || !result.response || (result.response && result.response.error)) {
                        console.log(result.response.message)
                        return alert('Произошла ошибка в удалении категории доходов. Если вам необходимо удалить данную категорию, обратитесь в поддержку!')
                    }
                    this.valueTypeElement.value = result.response.title;
                }
            } catch (error) {
                console.log(error.message);
            }
        }
    }

    validForm() {
        this.hasError = false
        if (this.valueTypeElement && this.valueTypeElement.value.match(/[А-Я][а-я]*/)) {
            document.querySelectorAll('.form-control')[0].classList.add('is-valid')
        } else {
            document.querySelectorAll('.form-control')[0].classList.add('is-invalid')
            this.hasError = true
        }
    }

    async approveButtonClick() {
        if (!this.hasError) {
            const title = this.valueTypeElement.value;
            let url = null;
            let method = null;

            if (this.action === 'add') {
                [url, method] = [this.categoriesRoute, "POST"];
            } else if (this.action === 'edit') {
                if (this.id) {
                    [url, method] = [this.categoriesRoute + '/' + this.id, "PUT"];
                }
            }
            console.log(url)
            console.log(method)
            const result = await HttpUtils.request(url, method, true,{
                "title": title
            });
            console.log(result)
            if (result) {
                if (result.error || result.redirect || !result.response || (result.response && result.response.error)) {
                    console.log(result.response.message)
                    return alert('Произошла ошибка в удалении категории доходов. Если вам необходимо удалить данную категорию, обратитесь в поддержку!')
                }
                console.log(this.type)
                if (this.type === 'expense'){
                    this.type = 'expenses'
                }
                return this.openNewRoute('/' + this.type)
            }
        }
    }
}