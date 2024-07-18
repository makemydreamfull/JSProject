export class CreationExpensesAndIncome {
    constructor() {
        this.clickBtnUndo = document.querySelectorAll('.btn-danger')
        this.clickBtnCreate = document.querySelectorAll('.btn-success')
        this.inputElement = document.querySelectorAll('.form-control')
        this.clickBtn()
        this.validForm()
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
        this.inputElement.forEach((el,num) => {
            el.addEventListener('blur', () => {
                    // if(!el.value && el.value.match(/^[A-Z,.'-]+$/i)) {
                    //     el.classList.add('is-invalid')
                    //     hasError  = true
                    // }
                    // if(!el.value && el.value.match(/[0-9]{2}.[0-9]{2}.[0-9]{4}/)) {
                    //     el.classList.add('is-invalid')
                    //     hasError  = true
                    // }
                    // else{
                    //     el.classList.remove('is-invalid')
                    //     el.classList.add('is-valid')
                    //
                    // }
                })
            /* Проверка формы и загрузка на бэкенд*/

            })

    }
}