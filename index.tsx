/// <reference types="nativewind/types" />

import { AppRegistry } from 'react-native'
import { RNAndroidNotificationListenerHeadlessJsName } from 'react-native-android-notification-listener'
import AsyncStorage from '@react-native-async-storage/async-storage'
import App from './src/components/App'

/**
 * Обратите внимание, что этот метод ДОЛЖЕН возвращать обещание.
 * Вот почему я использую здесь асинхронную функцию.
 */
const headlessNotificationListener = async ({ notification }: any) => {
    /**
     * Уведомление - это строка в формате JSON следующего вида:
     *  {
     *      "app": string,
     *      "title": string,
     *      "titleBig": string,
     *      "text": string,
     *      "subText": string,
     *      "summaryText": string,
     *      "bigText": string,
     *      "audioContentsURI": string,
     *      "imageBackgroundURI": string,
     *      "extraInfoText": string,
     *      "groupedMessages": Array<Object> [
     *          {
     *              "title": string,
     *              "text": string
     *          }
     *      ]
     *  }
     */

    if (notification) {
        await AsyncStorage.setItem('@prelastNotification', JSON.parse((await AsyncStorage.getItem('@lastNotification')) ?? ''))
        await AsyncStorage.setItem('@lastNotification', notification)
    }
}

/**
 * AppRegistry должна требоваться в начале последовательности require, чтобы убедиться,
 * что среда выполнения JS настроена до того, как потребуются другие модули.
 */
AppRegistry.registerHeadlessTask(RNAndroidNotificationListenerHeadlessJsName, () => headlessNotificationListener)

AppRegistry.registerComponent('sms-to-telegram', () => App)
