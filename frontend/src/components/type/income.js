export class Income {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute
        this.clickBtnEdit = document.querySelectorAll('.edit')
        this.clickBtnDelete = document.querySelectorAll('.delete')
        this.pagesElement = document.getElementById('pages')
        this.plusElement = document.getElementById('plus')
        this.contentElement = document.getElementById('content')
        this.modalElement = document.getElementById('modal-content')
        this.clickBtnEditAndDelete()
        if(sessionStorage.getItem('type')){
            this.addCategoryBlock()
        }
    }

    clickBtnEditAndDelete() {
        let number = 0
        this.clickBtnDelete.forEach((el, num) => {
            el.addEventListener('click', () => {
                document.getElementById('content-title').innerText = 'Вы действительно хотите удалить категорию? Связанные доходы будут удалены навсегда.'
                this.pagesElement.style.display = 'none'
                this.modalElement.style.display = 'flex'
                number = num
            })
        })
        this.plusElement.addEventListener('click', () => {
            return this.openNewRoute('/creation-income')
        })
        this.clickBtnEdit.forEach((el, num) => {
            el.addEventListener('click', () => {
                return this.openNewRoute('/editing-income')
            })
        })
        document.getElementById('yes-delete').addEventListener('click', () => {
            document.querySelectorAll('.item')[number].style.display = 'none'
            this.pagesElement.style.display = 'flex'
            this.modalElement.style.display = 'none'
        })
        document.getElementById('no-delete').addEventListener('click', () => {
            this.pagesElement.style.display = 'flex'
            this.modalElement.style.display = 'none'
        })

    }

    addCategoryBlock() {

        const divPageElement = document.createElement('div');
        divPageElement.classList.add('item')

        const titlePageElement = document.createElement('h2')
        titlePageElement.classList.add('item-title')
        titlePageElement.innerText = sessionStorage.getItem('type')

        const divBlockButtonPageElement = document.createElement('div')
        divBlockButtonPageElement.className = 'block-button d-flex g-col-1'

        const firstButtonPageElement = document.createElement('button')
        firstButtonPageElement.className = 'edit btn btn-primary me-2'
        firstButtonPageElement.innerText = 'Редактировать'

        const secondButtonPageElement = document.createElement('button')
        secondButtonPageElement.className = 'delete btn btn-danger'
        secondButtonPageElement.innerText = 'Удалить'

        divBlockButtonPageElement.appendChild(firstButtonPageElement)
        divBlockButtonPageElement.appendChild(secondButtonPageElement)
        divPageElement.appendChild(titlePageElement)
        divPageElement.appendChild(divBlockButtonPageElement)

        // this.plusElement.parentNode.insertBefore(divPageElement, document.querySelectorAll('.item')[0])
        // document.querySelectorAll('.item')[0].insertAdjacentElement('beforebegin', divPageElement)
        this.contentElement += document.querySelectorAll('.item')[0].insertAdjacentElement('beforebegin', divPageElement)
    }
}