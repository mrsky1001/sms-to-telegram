/**
 * Получение классов стилей для текста кнопки в зависимости от поля isDisabled
 * @param isDisabled
 */
export function cssClassButtonText(isDisabled: boolean) {
    if (isDisabled) return ' text-gray-300 text-[12px] font-medium uppercase'
    else return ' text-white text-[12px] font-medium uppercase'
}

/**
 * Получение классов стилей для кнопки в зависимости от поля isDisabled
 * @param isDisabled
 */
export function cssClassButton(isDisabled: boolean) {
    if (isDisabled) return 'min-w-[40%] h-10 bg-white flex justify-around items-center rounded-xl'
    else return 'min-w-[40%] h-10 bg-blue-500 flex justify-around items-center rounded-xl shadow'
}
