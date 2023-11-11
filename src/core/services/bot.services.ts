import axios from 'axios'

import { config } from '../../../config/config'
import { showNotifyMessage } from './app.services'

type TTelegramUpdate = { message: { text: string; chat: { id: string } } }

/**
 * Получение списка обновлений бота, для обработки всех пользователей
 */
export async function getUpdatesTelegramBot(): Promise<TTelegramUpdate[]> {
    return new Promise((resolve, reject) => {
        axios
            .get(`https://api.telegram.org/bot${config.telegram.apiKey}/getUpdates`)
            .then((response) => resolve(response.data.result))
            .catch((err) => {
                // console.log('getUpdatesTelegramBot > [error]: ', err)
            })
    })
}

/**
 * Отправка сообщения в чат
 * @param chatId
 * @param text
 */
export async function postTelegramBot(apiKey: string, chatId: string, text: string) {
    return axios.post(`https://api.telegram.org/bot${apiKey}/sendMessage`, { chat_id: chatId, text }).catch((error) => {
        showNotifyMessage(`Ошибка при выполнении функции bot sendMessage [${error}]`)
    })
}
