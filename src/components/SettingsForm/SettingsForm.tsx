import React, { useEffect, useState } from 'react'
import { Image, Text, TextInput, TouchableOpacity, View } from 'react-native'

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { requestReadSMSPermission } from '@maniac-tech/react-native-expo-read-sms'
import Task from '../../core/models/Task'
import BackgroundService from 'react-native-background-actions'
import { checkPermissionsReadSMS } from '../../core/services/sms.services'
import { getAllItemsLS, setAllItemsLS, showNotifyMessage } from '../../core/services/app.services'
import { backgroundService } from '../../core/services/background.services'
import { cssClassButton, cssClassButtonText } from '../../core/lib/css.settings'
import { config } from '../../../config/config'
import AccordionHeader from '../AccordionHeader/AccordionHeader'

export default function SettingsForm(props: {
    tasks: Task[]
    setTasks: (tasks: Task[]) => void
    hasPermissionReadSms: boolean
    setHasPermissionReadSms: (is: boolean) => void
}) {
    const tasks = props.tasks
    const setTasks = props.setTasks
    const hasPermissionReadSms = props.hasPermissionReadSms
    const setHasPermissionReadSms = props.setHasPermissionReadSms

    const [bgIsRunning, setBGIsRunning] = useState(BackgroundService.isRunning())
    const [botApiKey, setBotApiKey] = React.useState(config.telegram.apiKey)

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
     */
    const startBGService = () => {
        BackgroundService.start(backgroundService, options())
            .then(() => {
                setBGIsRunning(true)
                showNotifyMessage('Служба успешно запущена!')
            })
            .catch((error) => {
                showNotifyMessage(`Ошибка! Служба не запущена! [${error}]`)
            })
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

    /**
     * Функция сохранения параметров в хранилище
     */
    const onSave = () => {
        const keysValues = [
            {
                name: 'botApiKey',
                value: botApiKey
            },
            {
                name: 'tasks',
                value: tasks
            }
        ]

        setAllItemsLS(keysValues).then(() => {
            showNotifyMessage('Данные сохранены, перезапускаю службу...')
        })

        restartBGService()
    }

    useEffect(() => {
        getAllItemsLS('botApiKey', 'tasks').then((keysValues: any[]) => {
            keysValues.forEach((obj) => {
                if (obj.botApiKey) {
                    setBotApiKey(obj.botApiKey)
                }

                console.log(obj)
                if (obj.tasks) {
                    const rawTasks = JSON.parse(obj.tasks)
                    const savedTasks = rawTasks.map((task: Task) => new Task(task.id, task.chatId, task.keywords))

                    setTasks(savedTasks)
                }
            })
        })

        requestReadSMSPermission().then(() => {
            checkPermission()
        })
    }, [])

    const [isCollapsed, setIsCollapsed] = React.useState(true)

    const toggleTask = () => setIsCollapsed(!isCollapsed)

    return (
        <View className={'block max-w p-6 bg-white border border-gray-200 rounded-lg shadow '}>
            <AccordionHeader title={'Параметры'} isCollapsed={isCollapsed} toggle={toggleTask} />
            <View className={isCollapsed ? 'hidden' : ''}>
                <View className={'p-4 pt-6'}>
                    <Text className={'text-black text-[16px] font-light'}>
                        1. Статус доступа к СМС:
                        <Text style={[{ color: hasPermissionReadSms ? 'green' : 'red' }]}>
                            {hasPermissionReadSms ? ' Разрешён' : ' Запрещён'}{' '}
                        </Text>
                    </Text>
                    <View className={'pt-4'}>
                        <TouchableOpacity
                            activeOpacity={0.8}
                            className={cssClassButton(hasPermissionReadSms)}
                            onPress={() => {
                                !hasPermissionReadSms &&
                                    requestReadSMSPermission().then(() => {
                                        setTimeout(() => {
                                            checkPermission()
                                        }, 1000)
                                    })
                            }}
                        >
                            <Text className={cssClassButtonText(hasPermissionReadSms)}>Разрешить доступ к СМС</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <View className={'p-4 pt-6'}>
                    <Text className={'text-black text-[16px] font-light'}>
                        2. Статус службы отслеживания:
                        <Text style={[{ color: bgIsRunning ? 'green' : 'red' }]}>{bgIsRunning ? ' Работает' : ' Остановлена'} </Text>
                    </Text>
                    <View className={'pt-4 rounded-2xl'}>
                        {bgIsRunning ? (
                            <TouchableOpacity
                                activeOpacity={0.8}
                                className={cssClassButton(false) + ' border-red-600'}
                                onPress={() => {
                                    bgIsRunning && stopBGService()
                                }}
                            >
                                <Text className={cssClassButtonText(false) + ' text-red-500'}>Остановить службу отслеживания</Text>
                            </TouchableOpacity>
                        ) : (
                            <TouchableOpacity
                                activeOpacity={0.8}
                                className={cssClassButton(!hasPermissionReadSms || bgIsRunning)}
                                onPress={() => {
                                    hasPermissionReadSms && !bgIsRunning && restartBGService()
                                }}
                            >
                                <Text className={cssClassButtonText(!hasPermissionReadSms || bgIsRunning)}>
                                    Запустить службу отслеживания
                                </Text>
                            </TouchableOpacity>
                        )}
                    </View>
                    <View className={' pt-6'}>
                        <Text className={'text-black text-[16px] font-light'}>3. API Key бота для отправки СМС:</Text>
                        <View className={'p-4'}>
                            <TextInput
                                editable
                                className={'text-black py-2 border-b-2 border-b-red-500'}
                                onChangeText={(t) => setBotApiKey(t)}
                                multiline
                                value={botApiKey}
                                placeholder="API Key бота для отправки СМС..."
                                keyboardType="default"
                            />
                        </View>
                    </View>
                </View>
            </View>
        </View>
    )
}
