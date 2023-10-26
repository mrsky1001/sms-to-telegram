import { Platform, ToastAndroid } from 'react-native'

export function showNotifyMessage(msg: string) {
    if (Platform.OS === 'android') {
        ToastAndroid.show(msg, 10500)
    }
}
