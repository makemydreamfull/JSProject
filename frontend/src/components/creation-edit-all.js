import {Income} from "./type/income.js";

export class CreationEditingAll {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute

        this.inputTypeElement = document.getElementById('type')
        this.inputFirstNameElement = document.getElementById('firstName')
        this.inputSumElement = document.getElementById('sum')
        this.inputDataElement = document.getElementById('data')
        this.inputCommentElement = document.getElementById('comment')
        this.clickBtnUndo = document.querySelectorAll('.btn-danger')
        this.clickBtnCreate = document.getElementById('create')
        this.init()
    }
    init(){
        if(sessionStorage.getItem('type')){
            this.inputTypeElement.value = sessionStorage.getItem('type')
            this.clickBtn()
            this.validForm()
        } else{
            this.openNewRoute('/layout')
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
        this.inputTypeElement.classList.add('is-valid')
        this.clickBtnCreate.addEventListener('click', () => {
            let hasError=false
                if(!this.inputFirstNameElement.value || !this.inputFirstNameElement.value.match(/^[А-Я]+$/i)) {
                    this.inputFirstNameElement.classList.add('is-invalid')
                    hasError  = true
                }else{
                    this.inputFirstNameElement.classList.remove('is-invalid')
                    this.inputFirstNameElement.classList.add('is-valid')

                }
                if(!this.inputSumElement.value || !this.inputSumElement.value.match(/^\d+$/)) {
                    this.inputSumElement.classList.add('is-invalid')
                    hasError  = true

                }else{
                    this.inputSumElement.classList.remove('is-invalid')
                    this.inputSumElement.classList.add('is-valid')

                }
                if(!this.inputDataElement.value || !this.inputDataElement.value.match(/[0-9]{2}\/[0-9]{2}\/[0-9]{4}/)) {
                    this.inputDataElement.classList.add('is-invalid')
                    hasError  = true
                }else{
                    this.inputDataElement.classList.remove('is-invalid')
                    this.inputDataElement.classList.add('is-valid')

                }
                if(!this.inputCommentElement.value || !this.inputCommentElement.value.match(/^[А-Я]+$/i)) {
                    this.inputCommentElement.classList.add('is-invalid')
                    hasError  = true
                }else{
                    this.inputCommentElement.classList.remove('is-invalid')
                    this.inputCommentElement.classList.add('is-valid')

                }

            if (!hasError) {
                // this.nameNewCategory() Почему не работает?
                this.openNewRoute('/income')

            }
        })

    }
//     nameNewCategory(){
//         return this.inputFirstNameElement.value
// }

}
