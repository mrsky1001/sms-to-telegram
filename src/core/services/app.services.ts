import { Platform, ToastAndroid } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { config } from '../../../config/config'

export function showNotifyMessage(msg: string) {
    if (Platform.OS === 'android') {
        ToastAndroid.show(msg, 10500)
    }
}

export async function getAllItemsLS(...names: string[]): Promise<any[]> {
    return new Promise((resolve, reject) => {
        const keysValues: any[] = []

        names.forEach(async (name, idx) => {
            await AsyncStorage.getItem(`__${config.app.name}_${name}`)
                .then((result) => {
                    if (result !== null) {
                        keysValues.push({ [name]: result })
                    }

                    if (idx === names.length - 1) {
                        resolve(keysValues)
                    }
                })
                .catch((error) => {
                    showNotifyMessage(`Ошибка при выполнении функции AsyncStorage.getItem('botApiKey') [${error}]`)
                    reject(error)
                })
        })
    })
}

export async function setAllItemsLS(keysValues: { name: string; value: any }[]) {
    keysValues.forEach((obj) => {
        AsyncStorage.setItem(`__${config.app.name}_${obj.name}`, JSON.stringify(obj.value))
    })
}
