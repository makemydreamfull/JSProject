export class EditingCreationExpensesIncome {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute
        this.clickBtnUndo = document.getElementById('delete')
        this.clickBtnCreate = document.getElementById('create')
        this.clickBtn()

    }

    clickBtn() {
        this.clickBtnUndo.addEventListener('click', () => {
            history.back()
        })
        this.clickBtnCreate.addEventListener('click', () => {
            let valueType = document.querySelectorAll('.form-control')[0].value

            if (valueType && valueType.match(/^[А-Я]+$/i)) {
                document.querySelectorAll('.form-control')[0].classList.add('is-valid')
                sessionStorage.setItem('type', valueType)
                return this.openNewRoute('/creation-all')
            } else {
                document.querySelectorAll('.form-control')[0].classList.add('is-invalid')
            }

        })

    }



}