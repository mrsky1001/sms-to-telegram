import React, { Component, useEffect, useState } from 'react'
import { Image, SafeAreaView, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native'

import BackgroundService from 'react-native-background-actions'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import logo from '../unnamed.jpg'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { requestReadSMSPermission, startReadSMS, stopReadSMS } from '@maniac-tech/react-native-expo-read-sms'
import { checkPermissionsReadSMS, findPayment } from '../core/services/sms.services'
import { config } from '../../config/config'
import { getAllItemsLS, setAllItemsLS, showNotifyMessage } from '../core/services/app.services'
// import AsyncStorage from '@react-native-async-storage/async-storage'
import Task from '../core/models/Task'
import { backgroundService } from '../core/services/background.services'
import AsyncStorage from '@react-native-async-storage/async-storage'
import Collapsible from 'react-native-collapsible'
import Accordion from 'react-native-collapsible/Accordion'

function App() {
    const [botApiKey, setBotApiKey] = React.useState(config.telegram.apiKey)
    const [tasks, setTasks] = React.useState([new Task(1, config.telegram.chatId, config.keywords)])

    const [hasPermissionReadSms, setHasPermissionReadSms] = useState(false)
    const [bgIsRunning, setBGIsRunning] = useState(BackgroundService.isRunning())

    const checkPermission = () => {
        checkPermissionsReadSMS()
            .then((isAllowed) => {
                setHasPermissionReadSms(isAllowed)
            })
            .catch((error) => {
                showNotifyMessage(`Ошибка при выполнении функции checkPermissionsReadSMS [${error}]`)
            })
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

    /**
     * Изменение поля chatId для выбранной задачи
     * @param taskId
     * @param chatId
     */
    const changeChatId = (taskId: number, chatId: string) => {
        const task = tasks.find((d) => d.id === taskId)

        if (task) {
            task.chatId = chatId

            setTasks([...tasks])
        }
    }

    /**
     * Изменение поля keywords для выбранной задачи
     * @param taskId
     * @param keywords
     */
    const changeKeywords = (taskId: number, keywords: string) => {
        const task = tasks.find((d) => d.id === taskId)

        if (task) {
            task.keywords = keywords.split(' ')

            setTasks([...tasks])
        }
    }

    /**
     * Создание и добавление новой задачи
     */
    const addTask = () => {
        const newTask = new Task(tasks.length, config.telegram.chatId, config.keywords)
        setTasks([...tasks, newTask])
    }

    /**
     * Удаление выбранной задачи
     * @param taskId
     */
    const deleteTask = (taskId: number) => {
        setTasks([...tasks.filter((task) => task.id !== taskId)])
    }

    /**
     * Получение классов стилей для текста кнопки в зависимости от поля isDisabled
     * @param isDisabled
     */
    const cssClassButtonText = (isDisabled: boolean) => {
        if (isDisabled) return ' text-gray-300  font-medium uppercase'
        else return ' text-green-600  font-medium uppercase'
    }

    /**
     * Получение классов стилей для кнопки в зависимости от поля isDisabled
     * @param isDisabled
     */
    const cssClassButton = (isDisabled: boolean) => {
        if (isDisabled) return 'h-14 border-2 border-gray-300 bg-white flex justify-around items-center rounded-xl'
        else return 'h-14 border-2 border-green-600 bg-white flex justify-around items-center rounded-xl'
    }

    /**
     * Компонент задачи
     * @param task
     * @constructor
     */
    const TaskForm = (task: Task) => {
        return (
            <View key={task.id} className={' pt-6'}>
                <View className={' pt-6'}>
                    <Text className={'text-black text-[24px] font-medium'}>Задача №{task.id}</Text>
                    <View className={'p-4'}>
                        <TouchableOpacity
                            activeOpacity={0.1}
                            className={cssClassButton(!hasPermissionReadSms)}
                            onPress={() => {
                                hasPermissionReadSms && deleteTask(task.id)
                            }}
                        >
                            <Text className={cssClassButtonText(!hasPermissionReadSms) + ' font-small'}>Удалить задачу</Text>
                        </TouchableOpacity>
                    </View>
                    <Text className={'text-black text-[16px] font-light'}>ИД чата для отправки СМС:</Text>
                    <View className={'p-4'}>
                        <TextInput
                            editable
                            className={'text-black py-2 border-b-2 border-b-red-500'}
                            onChangeText={(t) => changeChatId(task.id, t)}
                            multiline
                            value={task.chatId}
                            placeholder="ИД чата для отправки СМС..."
                            keyboardType="numeric"
                        />
                    </View>
                </View>
                <View className={' pt-6'}>
                    <Text className={'text-black text-[16px] font-light'}>Ключевые слова фильтра:</Text>
                    <View className={'p-4'}>
                        <TextInput
                            editable
                            className={'text-black py-2 border-b-2 border-b-red-500'}
                            onChangeText={(t) => changeKeywords(task.id, t)}
                            multiline
                            value={task.keywords.join(' ')}
                            placeholder="Ключевые слова..."
                            keyboardType="default"
                        />
                        <View className={'pt-4 pt-8'}>
                            <TouchableOpacity
                                activeOpacity={0.1}
                                className={cssClassButton(!hasPermissionReadSms)}
                                onPress={() => {
                                    hasPermissionReadSms && onSave()
                                }}
                            >
                                <Text className={cssClassButtonText(!hasPermissionReadSms)}>Сохранить</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </View>
        )
    }

    const isCollapsed = false

    return (
        <SafeAreaView className={'px-4 bg-white h-full'}>
            <ScrollView>
                <View className={'flex flex-row items-center justify-start h-20 border-b-red-500  border-b-2 '}>
                    <Image className={'w-10 h-10'} source={logo}></Image>
                    <Text className={'pl-6 text-black text-2xl font-light'}>{'SMS to Telegram'}</Text>
                </View>

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
                    {/*<Accordion*/}
                    {/*    sections={SECTIONS}*/}
                    {/*    activeSections={activeSections}*/}
                    {/*    renderSectionTitle={_renderSectionTitle}*/}
                    {/*    renderHeader={_renderHeader}*/}
                    {/*    renderContent={_renderContent}*/}
                    {/*    onChange={_updateSections}*/}
                    {/*/>*/}

                    {tasks.map((task) => {
                        return (
                            <Collapsible collapsed={isCollapsed}>
                                <TaskForm id={task.id} chatId={task.chatId} keywords={task.keywords}></TaskForm>
                            </Collapsible>
                        )
                    })}
                    <View className={'p-4'}>
                        <View className={'pt-4 pt-8'}>
                            <TouchableOpacity
                                activeOpacity={0.1}
                                className={cssClassButton(!hasPermissionReadSms)}
                                onPress={() => {
                                    hasPermissionReadSms && addTask()
                                }}
                            >
                                <Text className={cssClassButtonText(!hasPermissionReadSms)}>Добавить задачу</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View className={'pt-4 pt-8 flex items-center justify-center'}>
                        <Text className={'text-gray-300 text-[10px]'}>Development by mrsky1001.work@gmail.com / @mrsky1001</Text>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

export default App
