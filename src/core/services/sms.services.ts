import { addMinutesToDate } from '../lib/date.lib'
import { postTelegramBot } from './bot.services' // eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import SmsAndroid from 'react-native-get-sms-android'

import { PermissionsAndroid } from 'react-native'
import { showNotifyMessage } from './app.services'

type TSMS = {
    _id: number
    addr_body: string
    address: string
    body: string
    creator: string
    date: number
    date_sent: number
    error_code: number
    group_id: number
    is_secret: number
    locked: number
    mtype: number
    network_type: number
    person: number
    privacy_mode: number
    protocol: number
    read: number
    reply_path_present: number
    resent_im: number
    risk_url_body: string
    seen: number
    service_center: string
    status: number
    sub_id: number
    thread_id: number
    time_body: string
    type: number
}
type TSMSMetaData = {
    date: string
    address: string
    body: string
}

export const checkPermissionsReadSMS = async (): Promise<boolean> => {
    return new Promise<boolean>((resolve, reject) => {
        PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.RECEIVE_SMS)
            .then((isAllowedReceive) => {
                PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.READ_SMS)
                    .then((isAllowedRead) => {
                        resolve(isAllowedReceive && isAllowedRead)
                    })
                    .catch((error) => {
                        reject(error)
                    })
            })
            .catch((error) => {
                reject(error)
            })
    })
}

let lastMessage = ''

export const findPayment = (keywords: string[], chatId: string, apiKey: string) => {
    const filter = {
        maxCount: 10
    }

    const paymentHandler = (count: number, data: string): void => {
        const smsList: TSMS[] = JSON.parse(data)
        console.log(smsList)

        const paymentList = smsList.filter((sms) => {
            return !!keywords.find((t) => sms.body.toLowerCase().includes(t.toLowerCase()))
        })

        console.log(paymentList)
        if (paymentList.length) {
            const lastPayment = paymentList[0]

            const paymentDate = new Date(Number(lastPayment.date))
            const currentDate = new Date()
            const lastMinuteDate = addMinutesToDate(new Date(), -1)

            if (paymentDate < currentDate && paymentDate > lastMinuteDate) {
                const smsMetaData: TSMSMetaData = {
                    date: paymentDate.toLocaleString(),
                    address: lastPayment.address,
                    body: lastPayment.body
                }

                // console.log(smsMetaData)

                const text = `Источник: ${smsMetaData.address}. Содержание: ${smsMetaData.body}. Дата: ${smsMetaData.date}`

                if (text !== lastMessage) {
                    lastMessage = text

                    postTelegramBot(apiKey, chatId, text).catch((error) => {
                        showNotifyMessage(`Ошибка при выполнении функции postTelegramBot [${error}]`)
                    })
                }
            }
        } else {
            // setTimeout(()=>{
            //     showNotifyMessage(``)
            //
            // }, 2000)
        }
    }

    const errorHandler = (error: string) => {
        showNotifyMessage(`Ошибка при выполнении функции SmsAndroid.list [${error}]`)
    }

    SmsAndroid.list(JSON.stringify(filter), errorHandler, paymentHandler)
}
