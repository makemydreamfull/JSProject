export class CreationEditingAll {
    constructor() {
        this.inputTypeElement = document.getElementById('type')
        this.clickBtnUndo = document.querySelectorAll('.btn-danger')
        this.clickBtnCreate = document.querySelectorAll('.btn-success')
        this.inputElement = document.querySelectorAll('.form-control')
        this.init()
    }
    init(){
        if(localStorage.getItem('type')){
            this.inputTypeElement.value = localStorage.getItem('type')
            this.clickBtn()
            this.validForm()
        } else{
            window.location.href = '/layout'
        }
    }
    clickBtn() {
        this.clickBtnUndo.forEach((el, num) => {
            el.addEventListener('click', () => {
                history.back()

            })
        })

    }

    validForm() {
        let hasError = false;
        this.inputElement[0].classList.add('is-valid')
        this.clickBtnCreate.forEach((el,num) => {
            el.addEventListener('click', () => {
                console.log(!this.inputElement[1].value.match(/^[А-Я]+$/i))
                if(!this.inputElement[1].value || !this.inputElement[1].value.match(/^[А-Я]+$/i)) {
                    this.inputElement[1].classList.add('is-invalid')
                    hasError  = true
                }else{
                    this.inputElement[1].classList.remove('is-invalid')
                    this.inputElement[1].classList.add('is-valid')

                }
                if(!this.inputElement[2].value || !this.inputElement[2].value.match(/^\d+$/)) {
                    this.inputElement[2].classList.add('is-invalid')
                    hasError  = true
                }else{
                    this.inputElement[2].classList.remove('is-invalid')
                    this.inputElement[2].classList.add('is-valid')

                }
                if(!this.inputElement[3].value && !this.inputElement[3].value.match(/[0-9]{2}.[0-9]{2}.[0-9]{4}/)) {
                    this.inputElement[3].classList.add('is-invalid')
                    hasError  = true
                }else{
                    this.inputElement[3].classList.remove('is-invalid')
                    this.inputElement[3].classList.add('is-valid')

                }
                if(!this.inputElement[4].value && !this.inputElement[4].value.match(/^[А-Я]+$/i)) {
                    this.inputElement[4].classList.add('is-invalid')
                    hasError  = true
                }else{
                    this.inputElement[4].classList.remove('is-invalid')
                    this.inputElement[4].classList.add('is-valid')

                }

            })
            /* Проверка формы и загрузка на бэкенд*/

        })

    }

}