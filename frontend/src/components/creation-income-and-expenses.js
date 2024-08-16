export class CreationIncomeAndExpenses {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute
        this.inputTypeElement = document.getElementById('type')
        this.inputFirstNameElement = document.getElementById('firstName')
        this.inputSumElement = document.getElementById('sum')
        this.inputDataElement = document.getElementById('data')
        this.inputCommentElement = document.getElementById('comment')
        this.clickBtnDelete = document.getElementById('delete')
        this.clickBtnCreate = document.getElementById('create')

        this.inputTypeElement.value = localStorage.getItem('categories')

        this.clickBtnCreate.addEventListener('click', this.postForm.bind(this))
    }



    validForm(e) {
        this.inputTypeElement.classList.add('is-valid')
        let hasError = false
        if (!this.inputFirstNameElement.value || !this.inputFirstNameElement.value.match(/^[А-Я]+$/i)) {
            this.inputFirstNameElement.classList.add('is-invalid')
            hasError = true
        } else {
            this.inputFirstNameElement.classList.remove('is-invalid')
            this.inputFirstNameElement.classList.add('is-valid')

        }
        if (!this.inputSumElement.value || !this.inputSumElement.value.match(/^\d+$/)) {
            this.inputSumElement.classList.add('is-invalid')
            hasError = true

        } else {
            this.inputSumElement.classList.remove('is-invalid')
            this.inputSumElement.classList.add('is-valid')

        }
        if (!this.inputDataElement.value || !this.inputDataElement.value.match(/[0-9]{2}\/[0-9]{2}\/[0-9]{4}/)) {
            this.inputDataElement.classList.add('is-invalid')
            hasError = true
        } else {
            this.inputDataElement.classList.remove('is-invalid')
            this.inputDataElement.classList.add('is-valid')

        }
        if (!this.inputCommentElement.value || !this.inputCommentElement.value.match(/^[А-Я]+$/i)) {
            this.inputCommentElement.classList.add('is-invalid')
            hasError = true
        } else {
            this.inputCommentElement.classList.remove('is-invalid')
            this.inputCommentElement.classList.add('is-valid')

        }
        return hasError


    }

    postForm(){
        if(!this.validForm()){
            console.log(11)
        }
    }

//     nameNewCategory(){
//         return this.inputFirstNameElement.value
// }

}
