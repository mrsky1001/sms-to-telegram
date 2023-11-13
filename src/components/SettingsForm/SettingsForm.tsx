import React, { useEffect, useState } from 'react'
import { Text, View } from 'react-native'

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { requestReadSMSPermission } from '@maniac-tech/react-native-expo-read-sms'
import Task from '../../core/models/Task'
import BackgroundService from 'react-native-background-actions'
import { checkPermissionsReadSMS } from '../../core/services/sms.services'
import { getAllItemsLS, setAllItemsLS, showNotifyMessage } from '../../core/services/app.services'
import { backgroundService } from '../../core/services/background.services'
import AccordionHeader from '../AccordionHeader/AccordionHeader'
import Switch from '../Switch/Switch'
import TextInput from '../TextInput/TextInput'

export default function SettingsForm(props: {
    tasks: Task[]
    setTasks: (tasks: Task[]) => void
    hasPermissionReadSms: boolean
    setHasPermissionReadSms: (is: boolean) => void
    setResetHandler: (a: { f: () => void }) => void
}) {
    const tasks = props.tasks
    const setResetHandler = (a: { f: () => void }) => props.setResetHandler(a)
    const hasPermissionReadSms = props.hasPermissionReadSms
    const setHasPermissionReadSms = (t: boolean) => props.setHasPermissionReadSms(t)

    const [bgIsRunning, setBGIsRunning] = useState(BackgroundService.isRunning())
    const [isExistChanges, setIsExistChanges] = useState(false)
    const [botApiKey, setBotApiKey] = React.useState('')

    const checkPermission = () => {
        checkPermissionsReadSMS()
            .then((isAllowed) => {
                setHasPermissionReadSms(isAllowed)
            })
            .catch((error) => {
                showNotifyMessage(`Ошибка при выполнении функции checkPermissionsReadSMS [${error}]`)
            })
    }

    const options = () => ({
        taskName: 'SMS to Telegram',
        taskTitle: 'SMS to Telegram',
        taskDesc: 'Статус: активен',
        taskIcon: {
            name: 'ic_launcher',
            type: 'mipmap'
        },
        color: '#ff00ff',
        linkingURI: 'yourSchemeHere://chat/jane',
        parameters: {
            delay: 10000,
            apiKey: botApiKey,
            tasks
        }
    })

    /**
     * Запуск фонового процесса
     * @param isShowMessage
     */
    const startBGService = (isShowMessage = false) => {
        if (
            botApiKey?.length > 5 &&
            tasks?.length &&
            tasks[0]?.chatId?.length > 5 &&
            tasks[0]?.keywords?.length > 0 &&
            tasks[0]?.keywords[0].length > 0
        ) {
            BackgroundService.start(backgroundService, options())
                .then(() => {
                    setBGIsRunning(true)
                    showNotifyMessage('Служба успешно запущена!')
                })
                .catch((error) => {
                    showNotifyMessage(`Ошибка! Служба не запущена! [${error}]`)
                })
        } else {
            isShowMessage && showNotifyMessage(`Не все поля заполнены для запуска службы!`)
        }
    }

    /**
     * Остановка фонового процесса
     */
    const stopBGService = () => {
        BackgroundService.stop()
            .then(() => {
                setBGIsRunning(false)
                showNotifyMessage('Служба успешно остановлена!')
            })
            .catch((error) => {
                showNotifyMessage(`Ошибка! Служба не остановлена! [${error}]`)
            })
    }

    /**
     * Перезапуск фонового процесса
     */
    const restartBGService = () => {
        if (hasPermissionReadSms && !BackgroundService.isRunning()) {
            /**
             * Запуск фонового процесса
             */
            startBGService()

            setTimeout(() => {
                stopBGService()

                setTimeout(() => {
                    startBGService()
                }, 500)
            }, 500)
        } else {
            setTimeout(() => {
                stopBGService()

                setTimeout(() => {
                    startBGService()
                }, 500)
            }, 500)
        }
    }

    const onChangeBotApi = (newBotAPi: string) => {
        setBotApiKey(newBotAPi)
        setIsExistChanges(true)
    }

    useEffect(() => {
        if (isExistChanges) {
            onSave()
        }
    }, [isExistChanges])

    /**
     * Функция сохранения параметров в хранилище
     */
    const onSave = () => {
        const keysValues = [
            {
                name: 'botApiKey',
                value: botApiKey
            }
        ]

        setAllItemsLS(keysValues).then(() => {
            setIsExistChanges(false)
            showNotifyMessage('Данные сохранены!')
        })
    }

    useEffect(() => {
        setResetHandler({ f: () => restartBGService() })

        getAllItemsLS('botApiKey').then((obj: any) => {
            if (obj.botApiKey?.length) {
                setBotApiKey(obj.botApiKey)
            }
        })

        requestReadSMSPermission().then(() => {
            checkPermission()
        })
    }, [])

    const [isCollapsed, setIsCollapsed] = React.useState(true)

    const toggle = () => setIsCollapsed(!isCollapsed)

    return (
        <View className={' block max-w px-4 pt-3 pb-5 bg-white border border-gray-200 rounded-lg shadow '}>
            <AccordionHeader title={'Параметры'} isCollapsed={isCollapsed} toggle={toggle} />
            <View className={isCollapsed ? 'hidden' : ''}>
                <View className={'pt-6 flex flex-row justify-between align-middle'}>
                    <Text className={' text-black text-[14px] font-light'}>Статус доступа к СМС</Text>
                    <Switch
                        onTouch={() => {
                            !hasPermissionReadSms &&
                                requestReadSMSPermission().then(() => {
                                    setTimeout(() => {
                                        checkPermission()
                                    }, 1000)
                                })
                        }}
                        value={hasPermissionReadSms}
                    />
                </View>
                <View className={'pt-6 flex flex-row justify-between align-middle'}>
                    <Text className={'text-black text-[14px] font-light'}>Статус службы отслеживания</Text>
                    <Switch
                        onTouch={() => {
                            if (bgIsRunning) {
                                stopBGService()
                            } else {
                                hasPermissionReadSms && !bgIsRunning && restartBGService()
                            }
                        }}
                        value={bgIsRunning}
                    />
                </View>
                <View className={' pt-6'}>
                    <TextInput
                        label={'API Key бота для отправки СМС'}
                        // selection={{ start: 0, end: botApiKey.length }}
                        value={botApiKey}
                        placeholder="Введите API Key телеграм-бота..."
                        onChangeText={(t) => onChangeBotApi(t)}
                    />
                </View>
            </View>
        </View>
    )
}
