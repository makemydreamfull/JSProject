import {HttpUtils} from "./http-utils.js";

export class IncomeDataUtils{
    static async getIncome(){
        const result = await HttpUtils.request('/categories/income')
        if (result.error || result.redirect || !result.response || (result.response && (result.response.error || result.response.message))) {
            console.log(result.response.message)
            return alert('Произошла ошибка в просмотре категории расходов. Если вам необходимо посмотреть данную категорию, обратитесь в поддержку!')
        }

        return result
    }
}