import {HttpUtils} from "../utils/http-utils.js";
import datepicker from "js-datepicker";

export class IncomeAndExpenses {
    static dataFromFilter = null;
    static dataToFilter = null;

    constructor(openNewRoute) {

        this.openNewRoute = openNewRoute
        this.todayFilter = document.getElementById('today')
        this.weekFilter = document.getElementById('week')
        this.monthFilter = document.getElementById('month')
        this.yearFilter = document.getElementById('year')
        this.allFilter = document.getElementById('all')
        this.intervalFilter = document.getElementById('interval')
        this.dataFrom = null
        this.dataTo = null
        try {
            this.start = datepicker('.data-from', {
                formatter: (input, date, instance) => {
                    IncomeAndExpenses.dataFromFilter= date.toISOString()
                    const value = date.toLocaleDateString()
                    input.value = value // => '1/1/2099'
                },
                id: 1,
                showAllDates: true,
                customMonths: ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'],
                customDays: ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб']
            })

            this.end = datepicker('.data-to', {
                formatter: (input, date, instance) => {
                    IncomeAndExpenses.dataToFilter = date.toISOString()
                    const value = date.toLocaleDateString()
                    input.value = value // => '1/1/2099'
                },
                id: 1,
                showAllDates: true,
                customMonths: ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'],
                customDays: ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб']
            })
        } catch (e) {
            window.location.pathname = '/income-and-expenses' // Может быть, у тебя получится сделать это без window. Но у меня не получилось из-за возникающей постоянно ошибки))
        }

        this.clickAllFilter()
        this.init()

    }

    init() {

        const date = new Date()
        const lastDay = new Date(date.getFullYear(), date.getMonth(), date.getDate())
        const lastWeek = new Date(date.getFullYear(), date.getMonth(), date.getDate() - 7)
        const lastMonth = new Date(date.getFullYear(), date.getMonth() - 1, date.getDate())
        const lastYear = new Date(date.getFullYear() - 1, date.getMonth(), date.getDate())
        let buttonsData = document.querySelectorAll('.data-link.btn');
        buttonsData[4].classList.add('active')
        this.clickAllFilter.bind(this)
        buttonsData.forEach(item => {
            item.addEventListener('click', function () {

                buttonsData.forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');
                switch (item.id) {
                    case 'today':
                        IncomeAndExpenses.dataFromFilter = lastDay.toISOString().split('T')[0]
                        break;
                    case  'week':
                        IncomeAndExpenses.dataFromFilter = lastWeek.toISOString().split('T')[0]
                        break;
                    case 'month':
                        IncomeAndExpenses.dataFromFilter = lastMonth.toISOString().split('T')[0]

                        break;
                    case  'year':
                        IncomeAndExpenses.dataFromFilter = lastYear.toISOString().split('T')[0]

                        break;
                    case  'all':
                        break;
                    case  'interval':
                        if (document.getElementById('dataFrom').value && document.getElementById('dataTo').value) {
                            IncomeAndExpenses.dataFromFilter = IncomeAndExpenses.dataFromFilter.split('T')[0]
                            IncomeAndExpenses.dataToFilter = IncomeAndExpenses.dataToFilter.split('T')[0]
                        }
                        break;
                    default:
                        alert('Ошибка! Такого периода не существует.')
                }
            })
            item.addEventListener('click', this.clickFilter.bind(this))

        });

    }

    async clickAllFilter() {
        document.getElementById('tbody').remove()
        const tbodyElement = document.createElement('tbody')
        tbodyElement.id = 'tbody'
        document.getElementById('table').appendChild(tbodyElement)
        const result = await HttpUtils.request('/operations?period=all')
        if (result.error || result.redirect || !result.response || (result.response && (result.response.error || result.response.message))) {
            console.log(result.response.message)
            return alert('Произошла ошибка в просмотре категории расходов. Если вам необходимо посмотреть данную категорию, обратитесь в поддержку!')
        }
        this.showElements(result.response)
    }

    showElements(obj) {

        for (let i = 0; i < obj.length; i++) {
            const trElement = document.createElement('tr')

            const numberOperationTdElements = trElement.insertCell()
            numberOperationTdElements.innerText = i + 1
            numberOperationTdElements.classList.add('fw-bold')

            const typeElement = trElement.insertCell()
            if (obj[i].type === 'income') {
                typeElement.innerText = 'доход'
                typeElement.classList.add('text-success')
            } else if (obj[i].type === 'expense') {
                typeElement.innerText = 'расход'
                typeElement.classList.add('text-danger')
            }
            trElement.insertCell().innerText = obj[i].category


            trElement.insertCell().innerText = obj[i].amount + '$'
            trElement.insertCell().innerText = obj[i].date
            trElement.insertCell().innerText = obj[i].comment
            const svgTdElements = trElement.insertCell()
            svgTdElements.innerHTML = `<svg width="14" height="15" viewBox="0 0 14 15" fill="none" xmlns="http://www.w3.org/2000/svg" class="trash" id="trash-` + obj[i].id + `">
                    <path d="M4.5 5.5C4.77614 5.5 5 5.72386 5 6V12C5 12.2761 4.77614 12.5 4.5 12.5C4.22386 12.5 4 12.2761 4 12V6C4 5.72386 4.22386 5.5 4.5 5.5Z"
                          fill="black"/>
                    <path d="M7 5.5C7.27614 5.5 7.5 5.72386 7.5 6V12C7.5 12.2761 7.27614 12.5 7 12.5C6.72386 12.5 6.5 12.2761 6.5 12V6C6.5 5.72386 6.72386 5.5 7 5.5Z"
                          fill="black"/>
                    <path d="M10 6C10 5.72386 9.77614 5.5 9.5 5.5C9.22386 5.5 9 5.72386 9 6V12C9 12.2761 9.22386 12.5 9.5 12.5C9.77614 12.5 10 12.2761 10 12V6Z"
                          fill="black"/>
                    <path fill-rule="evenodd" clip-rule="evenodd"
                          d="M13.5 3C13.5 3.55228 13.0523 4 12.5 4H12V13C12 14.1046 11.1046 15 10 15H4C2.89543 15 2 14.1046 2 13V4H1.5C0.947715 4 0.5 3.55228 0.5 3V2C0.5 1.44772 0.947715 1 1.5 1H5C5 0.447715 5.44772 0 6 0H8C8.55229 0 9 0.447715 9 1H12.5C13.0523 1 13.5 1.44772 13.5 2V3ZM3.11803 4L3 4.05902V13C3 13.5523 3.44772 14 4 14H10C10.5523 14 11 13.5523 11 13V4.05902L10.882 4H3.11803ZM1.5 3V2H12.5V3H1.5Z"
                          fill="black"/>
                </svg>
                
               <a href="/editing-income-and-expenses?id=` + obj[i].id + `&type=` + obj[i].type + `&categories=` + obj[i].category + `"><svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" class="edit  ms-2" id="edit-` + obj[i].id + `">
                    <path d="M12.1465 0.146447C12.3417 -0.0488155 12.6583 -0.0488155 12.8536 0.146447L15.8536 3.14645C16.0488 3.34171 16.0488 3.65829 15.8536 3.85355L5.85357 13.8536C5.80569 13.9014 5.74858 13.9391 5.68571 13.9642L0.68571 15.9642C0.500001 16.0385 0.287892 15.995 0.146461 15.8536C0.00502989 15.7121 -0.0385071 15.5 0.0357762 15.3143L2.03578 10.3143C2.06092 10.2514 2.09858 10.1943 2.14646 10.1464L12.1465 0.146447ZM11.2071 2.5L13.5 4.79289L14.7929 3.5L12.5 1.20711L11.2071 2.5ZM12.7929 5.5L10.5 3.20711L4.00001 9.70711V10H4.50001C4.77616 10 5.00001 10.2239 5.00001 10.5V11H5.50001C5.77616 11 6.00001 11.2239 6.00001 11.5V12H6.29291L12.7929 5.5ZM3.03167 10.6755L2.92614 10.781L1.39754 14.6025L5.21903 13.0739L5.32456 12.9683C5.13496 12.8973 5.00001 12.7144 5.00001 12.5V12H4.50001C4.22387 12 4.00001 11.7761 4.00001 11.5V11H3.50001C3.28561 11 3.10272 10.865 3.03167 10.6755Z"
                          fill="black"/>
                </svg>
                </a> `
            if(document.getElementById('tbody')){
                document.getElementById('tbody').appendChild(trElement)
            }

        }
        document.querySelectorAll('.trash').forEach((el) => {
            el.addEventListener('click', this.deleteElements.bind(this))
        })
    }

    async deleteElements(event) {
        const element = event.target
        console.log(element.nodeName)
        if (element.nodeName === 'svg') {
            const idElement = element.id.replace('trash-', '')
            const result = await HttpUtils.request('/operations/' + idElement, 'DELETE')
            console.log(result)
            if (result.error || result.redirect || !result.response || (result.response && result.response.error)) {
                console.log(result.message)
                return alert('Произошла ошибка в удалении категории. Если вам необходимо удалить данную категорию, обратитесь в поддержку!')
            }
            element.parentElement.parentElement.remove()
        }
    }

    allRequestResponse(obj) {
        if (obj.error || obj.redirect || !obj.response || (obj.response && obj.response.error)) {
            console.log(obj.message)
            return alert('Произошла ошибка в удалении категории. Если вам необходимо удалить данную категорию, обратитесь в поддержку!')
        }
        document.getElementById('tbody').remove()
        if (obj.response) {
            const tbodyElement = document.createElement('tbody')
            tbodyElement.id = 'tbody'
            document.getElementById('table').appendChild(tbodyElement)
            this.showElements(obj.response)
        }
    }

    async clickFilter() {
        if (!IncomeAndExpenses.dataFromFilter && !IncomeAndExpenses.dataToFilter) {
            const result = await HttpUtils.request('/operations?period=all')
            this.allRequestResponse(result)

        } else if (IncomeAndExpenses.dataFromFilter && !IncomeAndExpenses.dataToFilter) {
            const result = await HttpUtils.request('/operations?period=interval&dateFrom=' + IncomeAndExpenses.dataFromFilter + '&dateTo=' + new Date().toISOString().split('T')[0])
            this.allRequestResponse(result)

        } else if (IncomeAndExpenses.dataFromFilter && IncomeAndExpenses.dataToFilter) {
            const result = await HttpUtils.request('/operations?period=interval&dateFrom=' + IncomeAndExpenses.dataFromFilter + '&dateTo=' + IncomeAndExpenses.dataToFilter)
            this.allRequestResponse(result)
        }

    }
}