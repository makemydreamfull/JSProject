import "../styles/index.css";
import datepicker from "js-datepicker";
import {HttpUtils} from "../utils/http-utils";
import {IncomeAndExpenses} from "./income-and-expenses";
import {Pie} from "../libcomponents/acquisitions";
import {AuthUtils} from "../utils/auth-utils";
import {IncomeDataUtils} from "../utils/income-data-utils";
import {ExpensesDataUtils} from "../utils/expenses-data-utils";
import {DataSorting} from "../utils/show-sorted-types-utils";

export class Layout {
    static dataFromFilter = null;
    static dataToFilter = null;
    static objectPieIncome = {
        type: 'pie',
        data: {
            labels: [],
            datasets: [{
                label: 'Сумма',
                data: [],
                backgroundColor: [
                    '#DC3545',
                    '#20C997',
                    '#121eec',
                    '#8d38af',
                    '#c609cc',
                    '#0D6EFD',
                    '#FFC107',
                    '#edfd14',
                    '#3dd3e1',
                    '#0a9d00',
                ],
                hoverOffset: 4
            }],
        },
        options: {

            responsive: true,
            plugins: {
                legend: {
                    position: 'top',

                },
                title: {
                    display: true,
                    text: 'Доходы',
                    padding: {
                        bottom: 10,

                    },
                    font: {
                        size: '28px',
                        family: 'RobotoMedium',
                        color: '#290661',
                    },
                }
            }
        },
    }
    static objectPieExpense = {
        type: 'pie',
        data: {
            labels: [],
            datasets: [{
                label: 'Сумма',
                data: [],
                backgroundColor: [
                    '#DC3545',
                    '#20C997',
                    '#121eec',
                    '#8d38af',
                    '#c609cc',
                    '#0D6EFD',
                    '#FFC107',
                    '#edfd14',
                    '#3dd3e1',
                    '#0a9d00',
                ],
                hoverOffset: 4
            }],
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',

                },
                title: {
                    display: true,
                    text: 'Расходы',
                    padding: {
                        bottom: 10,

                    },
                    font: {
                        size: '28px',
                        family: 'RobotoMedium',
                        color: '#290661',
                    },
                }
            }
        },
    }

    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute
        if (!AuthUtils.getAuthInfo(AuthUtils.accessTokenKey)) {
            return this.openNewRoute('/login')
        }
        this.objectPieIncome = Layout.objectPieIncome
        this.objectPieExpense = Layout.objectPieExpense
        try {
            this.start = datepicker('.data-from', {
                formatter: (input, date, instance) => {
                    Layout.dataFromFilter = date.toISOString()
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
                    Layout.dataToFilter = date.toISOString()
                    const value = date.toLocaleDateString()
                    input.value = value // => '1/1/2099'
                },
                id: 1,
                showAllDates: true,
                customMonths: ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'],
                customDays: ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб']
            })
        } catch (e) {
            window.location.pathname = '/' // Может быть, у тебя получится сделать это без window. Но у меня не получилось из-за возникающей постоянно ошибки))
        }
        const DATA_COUNT = 5;
        const NUMBER_CFG = {count: DATA_COUNT, min: 0, max: 100};
        Chart.defaults.font.size = 11;
        const DATA_COUNT2 = 5;
        const NUMBER_CFG2 = {count: DATA_COUNT2, min: 0, max: 100};
        Chart.defaults.font.size = 11;
        this.init()
        this.allFilter()


    }

    init() {
        const date = new Date()
        const lastDay = new Date(date.getFullYear(), date.getMonth(), date.getDate())
        const lastWeek = new Date(date.getFullYear(), date.getMonth(), date.getDate() - 7)
        const lastMonth = new Date(date.getFullYear(), date.getMonth() - 1, date.getDate())
        const lastYear = new Date(date.getFullYear() - 1, date.getMonth(), date.getDate())
        let buttonsData = document.querySelectorAll('.data-link.btn');
        buttonsData[4].classList.add('active')
        buttonsData.forEach(item => {
            item.addEventListener('click', function () {

                buttonsData.forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');
                switch (item.id) {
                    case 'today':
                        Layout.dataFromFilter = lastDay.toISOString().split('T')[0]
                        break;
                    case  'week':
                        Layout.dataFromFilter = lastWeek.toISOString().split('T')[0]
                        break;
                    case 'month':
                        Layout.dataFromFilter = lastMonth.toISOString().split('T')[0]

                        break;
                    case  'year':
                        Layout.dataFromFilter = lastYear.toISOString().split('T')[0]

                        break;
                    case  'all':
                        break;
                    case  'interval':
                        if (document.getElementById('dataFrom').value && document.getElementById('dataTo').value) {
                            Layout.dataFromFilter = Layout.dataFromFilter.split('T')[0]
                            Layout.dataToFilter = Layout.dataToFilter.split('T')[0]
                        }
                        break;
                    default:
                        alert('Ошибка! Такого периода не существует.')
                }
            })
            item.addEventListener('click', this.clickFilter.bind(this))

        });
    }


    async allFilter() {
        this.getIncomeData = await IncomeDataUtils.getIncome()
        this.getExpenseData = await ExpensesDataUtils.getExpenses()
        const sortIncomeData = this.getIncomeData.response.sort((a, b) => {
            return a.title - b.title
        })
        const sortExpenseData = this.getExpenseData.response.sort((a, b) => {
            return a.title - b.title
        })
        this.incomeChart = document.getElementById('income-chart')
        this.expenseChart = document.getElementById('expense-chart')
        const result = await HttpUtils.request('/operations?period=all')
        if (result.error || result.redirect || !result.response || (result.response && (result.response.error || result.response.message))) {
            console.log(result.response.message)
            return alert('Произошла ошибка в просмотре категории расходов. Если вам необходимо посмотреть данную категорию, обратитесь в поддержку!')
        }
        const sortIncomeCommonData = DataSorting.showTypes(result.response, 'income')
        const sortExpenseCommonData = DataSorting.showTypes(result.response, 'expense')
        if (this.objectPieIncome.options.plugins.title.text === 'Доходы' && this.getIncomeData) {
            sortIncomeCommonData.forEach((item) => {
                this.objectPieIncome.data.labels.push(item.category)
                this.objectPieIncome.data.datasets[0].data.push(item.amount)

            })
        }
        if (this.objectPieExpense.options.plugins.title.text === 'Расходы' && this.getExpenseData) {
            sortExpenseCommonData.forEach((item) => {
                this.objectPieExpense.data.labels.push(item.category)
                this.objectPieExpense.data.datasets[0].data.push(item.amount)

            })
        }
        this.chart1 = new Chart(this.incomeChart, this.objectPieIncome);
        this.chart2 = new Chart(this.expenseChart, this.objectPieExpense);
    }

    allRequestResponse(obj) {
        //this.showChart()
        if (obj.error || obj.redirect || !obj.response || (obj.response && obj.response.error)) {
            console.log(obj.message)
            return alert('Произошла ошибка в удалении категории. Если вам необходимо удалить данную категорию, обратитесь в поддержку!')
        }
        if (obj.response) {
            const sortIncomeData = DataSorting.showTypes(obj.response, 'income')
            const sortExpenseData = DataSorting.showTypes(obj.response, 'expense')
            this.objectPieIncome.data.labels = []
            this.objectPieExpense.data.labels = []
            this.objectPieIncome.data.datasets[0].data = []
            this.objectPieExpense.data.datasets[0].data = []
            sortIncomeData.forEach((item) => {
                this.objectPieIncome.data.labels.push(item.category)
                this.objectPieIncome.data.datasets[0].data.push(item.amount)
            })
            sortExpenseData.forEach((item) => {
                this.objectPieExpense.data.labels.push(item.category)
                this.objectPieExpense.data.datasets[0].data.push(item.amount)
            })
            if(this.chart1){
                this.chart1.clear()
                this.chart1.destroy()
            }
            if(this.chart2){
                this.chart2.clear()
                this.chart2.destroy()
            }
            this.chart1 = new Chart(this.incomeChart, this.objectPieIncome);
            this.chart2 = new Chart(this.expenseChart, this.objectPieExpense);
        }
    }

    async clickFilter() {
        if (!Layout.dataFromFilter && !Layout.dataToFilter) {
            const result = await HttpUtils.request('/operations?period=all')
            this.allRequestResponse(result)

        } else if (Layout.dataFromFilter && !Layout.dataToFilter) {
            const result = await HttpUtils.request('/operations?period=interval&dateFrom=' + Layout.dataFromFilter + '&dateTo=' + new Date().toISOString().split('T')[0])
            this.allRequestResponse(result)

        } else if (Layout.dataFromFilter && Layout.dataToFilter) {
            const result = await HttpUtils.request('/operations?period=interval&dateFrom=' + Layout.dataFromFilter + '&dateTo=' + Layout.dataToFilter)
            this.allRequestResponse(result)
        }

    }
}