export class Income {
    constructor() {
        this.clickBtnEdit = document.querySelectorAll('.edit')
        this.clickBtnDelete = document.querySelectorAll('.delete')
        this.pagesElement = document.getElementById('pages')
        this.modalElement = document.getElementById('modal-content')
        this.clickBtnEditAndDelete()
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
}