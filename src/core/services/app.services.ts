import { Platform, ToastAndroid } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { createDataWithoutPrivateFields } from '../lib/obj.lib'

export const logs: string[] = []

setAllItemsLS([{ name: 'logs', value: [] }])

export function showNotifyMessage(msg: string) {
    if (Platform.OS === 'android') {
        logs.push(`[${new Date().toLocaleString()}] ${msg}`)
        ToastAndroid.show(msg, 10500)

        setAllItemsLS([{ name: 'logs', value: logs }])
    }
}

export async function getAllItemsLS(...keys: string[]): Promise<any> {
    const results = await AsyncStorage.multiGet(keys)
    const obj: any = {}

    results.forEach((keyValue) => {
        if (keyValue[1] != null) {
            obj[keyValue[0]] = JSON.parse(keyValue[1])
        }
    })

    return obj
}

export async function setAllItemsLS(objects: { name: string; value: any }[]) {
    const keysValues: [string, string][] = objects.map((obj) => {
        const val = createDataWithoutPrivateFields(obj.value)
        return [obj.name, JSON.stringify(val)]
    })
    await AsyncStorage.multiSet(keysValues)
}
