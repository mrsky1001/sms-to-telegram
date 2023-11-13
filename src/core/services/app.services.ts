import { Platform, ToastAndroid } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'

export function showNotifyMessage(msg: string) {
    if (Platform.OS === 'android') {
        ToastAndroid.show(msg, 10500)
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
    const keysValues: [string, string][] = objects.map((obj) => [obj.name, JSON.stringify(obj.value)])
    await AsyncStorage.multiSet(keysValues)
}
