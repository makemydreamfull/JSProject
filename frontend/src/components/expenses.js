export class Expenses{
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
                this.pagesElement.style.display = 'none'
                this.modalElement.style.display = 'flex'
                number=num
            })
        })
        this.clickBtnEdit.forEach((el,num) => {
            el.addEventListener('click', () => {
                window.location.href = '/editing-expenses'
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