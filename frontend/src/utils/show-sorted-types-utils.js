export class DataSorting {

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
        return Object.values(mergedValues) //Возвращает отсортированнный массив объектов с суммой одинаковых элементов
    }


}
