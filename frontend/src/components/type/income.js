import {AuthUtils} from "../../utils/auth-utils.js";
import {HttpUtils} from "../../utils/http-utils.js";
import {IncomeDataUtils} from "../../utils/income-data-utils.js";

export class Income {
    static objEditIncome = {}
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute
        if (!AuthUtils.getAuthInfo(AuthUtils.accessTokenKey)) {
            return this.openNewRoute('/login')
        }
        this.pagesElement = document.getElementById('pages')
        this.plusElement = document.getElementById('plus')
        this.modalElement = document.getElementById('modal-content')
        this.typeElement = document.getElementById('type')
        this.plusElement.addEventListener('click', this.clickPlusElement.bind(this))
        this.showElementsIncome()
    }

    async showElementsIncome() {
        const result = await IncomeDataUtils.getIncome()
        if (result.redirect) {
            return this.openNewRoute(result.redirect)
        }
        result.response.forEach((item) => {
            const divPageElement = document.createElement('div');
            divPageElement.classList.add('item-category')

            const titlePageElement = document.createElement('h2')
            titlePageElement.classList.add('item-title')
            titlePageElement.innerText = item.title

            console.log(titlePageElement.value)
            const divBlockButtonPageElement = document.createElement('div')
            divBlockButtonPageElement.classList.add('block-button', 'd-flex', 'g-col-1')



            const firstButtonPageElement = document.createElement('button')
            firstButtonPageElement.classList.add('edit', 'btn', 'btn-primary', 'me-2')
            firstButtonPageElement.innerText = 'Редактировать'

            const linkPageElement = document.createElement('a')
            linkPageElement.href = '/editing-income?id=' + item.id

            linkPageElement.appendChild(firstButtonPageElement)

            const secondButtonPageElement = document.createElement('button')
            secondButtonPageElement.classList.add('delete', 'btn', 'btn-danger')
            secondButtonPageElement.innerText = 'Удалить'
            secondButtonPageElement.id = 'delete-' + item.id

            divBlockButtonPageElement.appendChild(linkPageElement)
            divBlockButtonPageElement.appendChild(secondButtonPageElement)
            divPageElement.appendChild(titlePageElement)
            divPageElement.appendChild(divBlockButtonPageElement)
            document.getElementById('plus').parentNode.insertBefore(divPageElement, document.getElementById('plus'))
        })
        this.clickBtnDelete = document.querySelectorAll('.delete')
        this.clickBtnEdit = document.querySelectorAll('.edit')
        for (let i = 0; i < this.clickBtnEdit.length; i++) {
            this.clickBtnDelete[i].addEventListener('click', this.clickBtnDeleteElement.bind(this, result, i))
        }

    }

    clickBtnDeleteElement(objectResult, i) {
        console.log(objectResult)
        console.log(this.clickBtnDelete[i])
        this.pagesElement.style.display = 'none'
        this.modalElement.style.display = 'flex'
        let that = this
        const currentElementClick = objectResult.response.find((item) => {
            return item.id === Number(this.clickBtnDelete[i].id.replace('delete-', ''))
        })
        console.log(currentElementClick)
        if (currentElementClick) {

            document.getElementById('yes-delete').addEventListener('click', async function (e, index) {
                const result = await HttpUtils.request('/categories/income/' + currentElementClick.id, 'DELETE')
                if (result.error || result.redirect || !result.response || (result.response && result.response.error)) {
                    console.log(result.response.message)
                    return alert('Произошла ошибка в удалении категории доходов. Если вам необходимо удалить данную категорию, обратитесь в поддержку!')
                }

                that.clickBtnDelete[i].parentElement.parentElement.remove()
                that.pagesElement.style.display = 'flex'
                that.modalElement.style.display = 'none'

            })
        } else {
            return alert('Произошла ошибка в удалении категории доходов')
        }

        document.getElementById('no-delete').addEventListener('click', function () {
            that.pagesElement.style.display = 'flex'
            that.modalElement.style.display = 'none'
        })

        return currentElementClick

    }

    clickPlusElement() {
        return this.openNewRoute('/creation-income')

    }

}