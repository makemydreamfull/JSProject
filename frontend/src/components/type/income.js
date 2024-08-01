export class Income {
    constructor() {
        this.clickBtnEdit = document.querySelectorAll('.edit')
        this.clickBtnDelete = document.querySelectorAll('.delete')
        this.pagesElement = document.getElementById('pages')
        this.modalElement = document.getElementById('modal-content')
        this.clickBtnEditAndDelete()
        if(localStorage.getItem('category')){
            this.addCategoryBlock()
        }
    }

    clickBtnEditAndDelete() {
        let number=0
        this.clickBtnDelete.forEach((el, num) => {
            el.addEventListener('click', () => {
                document.getElementById('content-title').innerText = 'Вы действительно хотите удалить категорию? Связанные доходы будут удалены навсегда.'
                this.pagesElement.style.display = 'none'
                this.modalElement.style.display = 'flex'
                number=num
            })
        })
        document.getElementById('plus').addEventListener('click', () => {
            window.location.href = '/creation-income'
        })
        this.clickBtnEdit.forEach((el,num) => {
            el.addEventListener('click', () => {
                window.location.href = '/editing-income'
            })
        })
        document.getElementById('yes-delete').addEventListener('click',() => {
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
        titlePageElement.value = sessionStorage.getItem('type')

        const divBlockButtonPageElement = document.createElement('div')
        divBlockButtonPageElement.classList.add('block-button')
        divBlockButtonPageElement.classList.add('d-flex')
        divBlockButtonPageElement.classList.add('g-col-1')

        const firstButtonPageElement = document.createElement('button')
        firstButtonPageElement.classList.add('edit')
        firstButtonPageElement.classList.add('btn ')
        firstButtonPageElement.classList.add('btn-primary')
        firstButtonPageElement.classList.add('me-2')
        firstButtonPageElement.value = 'Редактировать'

        const secondButtonPageElement = document.createElement('button')
        secondButtonPageElement.classList.add('delete')
        secondButtonPageElement.classList.add('btn')
        secondButtonPageElement.classList.add('btn-danger')
        secondButtonPageElement.value = 'Удалить'

        divBlockButtonPageElement.appendChild(firstButtonPageElement)
        divBlockButtonPageElement.appendChild(secondButtonPageElement)
        divPageElement.appendChild(titlePageElement)
        divPageElement.appendChild(divBlockButtonPageElement)


    }
}