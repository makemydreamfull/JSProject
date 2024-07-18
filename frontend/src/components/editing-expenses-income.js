export class EditingExpensesIncome {
    constructor() {
        this.clickBtnUndo = document.querySelectorAll('.btn-danger')
        this.clickBtnCreate = document.querySelectorAll('.btn-success')
        this.clickBtn()
    }
    clickBtn(){
        this.clickBtnUndo.forEach((el, num) => {
            el.addEventListener('click', () => {
                history.back()

            })
        })
        this.clickBtnCreate.forEach((el) => {
            el.addEventListener('click', () => {
                let valueType = document.querySelectorAll('.form-control')[0].value

                if(valueType && valueType.match(/^[A-Z]+$/i)){
                    document.querySelectorAll('.form-control')[0].classList.add('is-valid')
                    localStorage.setItem('type', valueType)
                    window.location.href = '/creation-all'
                }
                else{
                    document.querySelectorAll('.form-control')[0].classList.add('is-invalid')
                }

            })
        })
    }

}