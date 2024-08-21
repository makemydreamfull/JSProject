import {HttpUtils} from "./http-utils.js";

export class ExpensesDataUtils{
    static async getExpenses(){
        const result = await HttpUtils.request('/categories/expense')
        if (result.error || result.redirect || !result.response || (result.response && (result.response.error || result.response.message))) {
            console.log(result.response.message)
            return alert('Произошла ошибка в просмотре категории расходов. Если вам необходимо посмотреть данную категорию, обратитесь в поддержку!')
        }
        return result
    }
}