// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { startReadSMS } from '@maniac-tech/react-native-expo-read-sms'
import BackgroundService from 'react-native-background-actions'
import { findPayment } from './sms.services'
import { config } from '../../../config/config'

export const backgroundService = async (args?: { delay: number; keywords: string[] }) => {
    const { delay, keywords } = args ?? { delay: 10000, keywords: config.keywords }

    startReadSMS(() => findPayment(keywords))

    const sleep = (time: number) => new Promise((resolve) => setTimeout(() => resolve({}), time))

    await new Promise(async (resolve) => {
        for (let i = 0; BackgroundService.isRunning(); i++) {
            await sleep(delay)
        }
    })
}
