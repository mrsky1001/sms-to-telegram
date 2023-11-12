/**
 * Получение классов стилей для текста кнопки в зависимости от поля isDisabled
 * @param isDisabled
 */
export function cssClassButtonText(isDisabled: boolean) {
    if (isDisabled) return ' text-gray-300  font-medium uppercase'
    else return ' text-green-600  font-medium uppercase'
}

/**
 * Получение классов стилей для кнопки в зависимости от поля isDisabled
 * @param isDisabled
 */
export function cssClassButton(isDisabled: boolean) {
    if (isDisabled) return 'h-14 border-2 border-gray-300 bg-white flex justify-around items-center rounded-xl'
    else return 'h-14 border-2 border-green-600 bg-white flex justify-around items-center rounded-xl'
}
