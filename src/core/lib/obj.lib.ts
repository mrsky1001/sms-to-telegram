/**
 * Функция получения данных без приватных полей.
 * Необходима для сохранения данных в localStorage,
 * и последующей корректной инициализации при получении из localStorage.
 * @param data
 * @returns {any} - на выходе получим тот же тип, что и на входе
 */
export const createDataWithoutPrivateFields = (data: any): any => {
    /**
     * Создаем новый массив с проверкой содержимого
     * @param arr
     */
    const toValidArray = (arr: any[]) => {
        return arr.map((p) => {
            return createDataWithoutPrivateFields(p)
        })
    }

    /**
     * Создаем новый объект с проверкой содержимого
     * @param obj
     */
    const toValidObj = (obj: any) => {
        const newParentObj: any = {}

        Object.keys(obj).forEach((k) => {
            const field = obj[k]
            const newK = k.startsWith('_') ? k.slice(1) : k

            if (Array.isArray(field)) {
                newParentObj[newK] = toValidArray(field)
            } else if (typeof field === 'object') {
                newParentObj[newK] = toValidObj(field)
            } else {
                newParentObj[newK] = field
            }
        })

        return newParentObj
    }

    if (Array.isArray(data)) {
        return toValidArray(data)
    } else if (typeof data === 'object' && data !== null) {
        return toValidObj(data)
    } else {
        return data
    }
}
