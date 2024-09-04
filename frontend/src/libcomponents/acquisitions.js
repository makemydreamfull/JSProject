import "./chart.js"
import {IncomeDataUtils} from "../utils/income-data-utils";
import {ExpensesDataUtils} from "../utils/expenses-data-utils";
import {HttpUtils} from "../utils/http-utils";

export class Pie {
    static objFindIncomeCategory = []
    static objFindExpenseCategory = []



    constructor() {

        const DATA_COUNT = 5;
        const NUMBER_CFG = {count: DATA_COUNT, min: 0, max: 100};
        Chart.defaults.font.size = 11;
        const DATA_COUNT2 = 5;
        const NUMBER_CFG2 = {count: DATA_COUNT2, min: 0, max: 100};
        Chart.defaults.font.size = 11;
        this.sortedPostPieData()
    }

    async sortedPostPieData() {
        this.getIncomeData = await IncomeDataUtils.getIncome()
        this.getExpenseData = await ExpensesDataUtils.getExpenses()
        const sortIncomeData = this.getIncomeData.response.sort((a, b) => {
            return a.title - b.title
        })
        const sortExpenseData = this.getExpenseData.response.sort((a, b) => {
            return a.title - b.title
        })
        if (Pie.objectPieIncome.options.plugins.title.text === 'Доходы' && this.getIncomeData) {
            sortIncomeData.forEach((item) => {
                Pie.objectPieIncome.data.labels.push(item.title)
            })
        }
        if (Pie.objectPieExpense.options.plugins.title.text === 'Расходы' && this.getExpenseData) {
            sortExpenseData.forEach((item) => {
                Pie.objectPieExpense.data.labels.push(item.title)

            })
        }

    }

    static showTypes(obj, type) {
        const arrObj = obj.filter((item) => {
            return item.type === type;
        })
        const sortArr = arrObj.sort((a, b) => {
            return a.category - b.category
        })
        let arrEquipment = []
        sortArr.forEach((item) => {
            let obj = {}
            obj.amount = item.amount
            obj.category = item.category
            arrEquipment.push(obj)
        })
        const mergedValues = arrEquipment.reduce((acc, item) => {
            if (!acc[item.category]) {
                acc[item.category] = {...item, amount: 0}; //что обозначают ... ?
            }
            acc[item.category].amount += item.amount;
            return acc;
        }, {});
        return  Object.values(mergedValues)

        // if (type === 'income') {
        //     Pie.objFindIncomeCategory = Object.values(mergedValues)
        //     Pie.objFindIncomeCategory.forEach((item) => {
        //         Pie.objectPieIncome.data.datasets[0].data.push(item.amount)
        //     })
        // } else if (type === 'expense') {
        //     Pie.objFindExpenseCategory = Object.values(mergedValues)
        //     Pie.objFindExpenseCategory.forEach((item) => {
        //         Pie.objectPieExpense.data.datasets[0].data.push(item.amount)
        //     })
        // }

    }
}
