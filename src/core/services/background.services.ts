// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore

import { config } from '../../../config/config'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { startReadSMS, stopReadSMS } from '@maniac-tech/react-native-expo-read-sms'
import BackgroundService from 'react-native-background-actions'
import { checkPermissionsReadSMS, findPayment } from './sms.services'
import { showNotifyMessage } from './app.services'
import Task from '../models/Task'

// export const backgroundService = async (args?: { delay: number; keywords: string[] }) => {
//     const { delay, keywords } = args ?? { delay: 10000, keywords: config.keywords }
//
//     startReadSMS(() => findPayment(keywords))
//
//     const sleep = (time: number) => new Promise((resolve) => setTimeout(() => resolve({}), time))
//
//     await new Promise(async (resolve) => {
//         for (let i = 0; BackgroundService.isRunning(); i++) {
//             await sleep(delay)
//         }
//     })
// }

/**
 * Основная фоновая функция
 * @param args
 */
export async function backgroundService(args?: { delay: number; tasks: Task[]; apiKey: string }) {
    const { delay, tasks, apiKey } = args ?? {
        delay: 2000,
        apiKey: config.telegram.apiKey,
        tasks: []
    }

    let isRunning = false
    stopReadSMS()

    const sleep = (time: number) => new Promise((resolve) => setTimeout(() => resolve({}), time))

    await new Promise(async () => {
        for (let i = 0; BackgroundService.isRunning(); i++) {
            if (!isRunning && (await checkPermissionsReadSMS())) {
                isRunning = true

                startReadSMS(() => {
                    tasks.map((task) => {
                        if (String(apiKey).length && String(task.chatId).length && task.keywords.length) {
                            findPayment(task.keywords, task.chatId, apiKey)
                        }
                    })
                }).catch((error: string) => {
                    showNotifyMessage(`Ошибка при выполнении функции startReadSMS [${error}]`)
                })
            }

            await sleep(delay)
        }
    })
}
