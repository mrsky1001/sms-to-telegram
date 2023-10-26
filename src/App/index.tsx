import React, { useEffect, useState } from 'react'
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
import { showNotifyMessage } from '../core/services/app.services'
import AsyncStorage from '@react-native-async-storage/async-storage'

function App() {
    const [keywords, setKeywords] = React.useState(config.keywords.join(' '))
    const [botApiKey, setBotApiKey] = React.useState(config.telegram.apiKey)
    const [chatId, setChatId] = React.useState(config.telegram.chatId)
    const [isValidParams, setIsValidParams] = React.useState(false)

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
        AsyncStorage.getItem('botApiKey')
            .then((result) => {
                if (result !== null) {
                    setBotApiKey(result)
                }
            })
            .catch((error) => {
                showNotifyMessage(`Ошибка при выполнении функции AsyncStorage.getItem('botApiKey') [${error}]`)
            })

        AsyncStorage.getItem('keywords')
            .then((result) => {
                if (result !== null) {
                    setKeywords(result)
                }
            })
            .catch((error) => {
                showNotifyMessage(`Ошибка при выполнении функции AsyncStorage.getItem('keywords') [${error}]`)
            })

        AsyncStorage.getItem('chatId')
            .then((result) => {
                if (result !== null) {
                    setChatId(result)
                }
            })
            .catch((error) => {
                showNotifyMessage(`Ошибка при выполнении функции AsyncStorage.getItem('chatId') [${error}]`)
            })

        requestReadSMSPermission().then(() => {
            setTimeout(() => {
                checkPermission()
            }, 1000)
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
            keywords: keywords.split(' '),
            apiKey: botApiKey,
            chatId
        }
    })

    const backgroundService = async (args?: { delay: number; keywords: string[]; chatId: string; apiKey: string }) => {
        const { delay, keywords, chatId, apiKey } = args ?? {
            delay: 2000,
            keywords: config.keywords,
            chatId: config.telegram.chatId,
            apiKey: config.telegram.apiKey
        }

        let isRunning = false
        stopReadSMS()

        const sleep = (time: number) => new Promise((resolve) => setTimeout(() => resolve({}), time))

        await new Promise(async () => {
            for (let i = 0; BackgroundService.isRunning(); i++) {
                if (!isRunning && hasPermissionReadSms) {
                    isRunning = true
                    startReadSMS(() => findPayment(keywords, chatId, apiKey)).catch((error: string) => {
                        showNotifyMessage(`Ошибка при выполнении функции startReadSMS [${error}]`)
                    })
                }

                await sleep(delay)
            }
        })
    }

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

    const onSave = () => {
        showNotifyMessage('Данные сохранены, перезапускаю службу...')

        AsyncStorage.setItem('botApiKey', botApiKey)
        AsyncStorage.setItem('keywords', keywords)
        AsyncStorage.setItem('chatId', chatId)

        restartBGService()
    }

    const cssClassButtonText = (isDisabled: boolean) => {
        if (isDisabled) return ' text-gray-300  font-medium uppercase'
        else return ' text-green-600  font-medium uppercase'
    }

    const cssClassButton = (isDisabled: boolean) => {
        if (isDisabled) return 'h-14 border-2 border-gray-300 bg-white flex justify-around items-center rounded-xl'
        else return 'h-14 border-2 border-green-600 bg-white flex justify-around items-center rounded-xl'
    }

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
                    <View className={' pt-6'}>
                        <Text className={'text-black text-[16px] font-light'}>4. ИД чата для отправки СМС:</Text>
                        <View className={'p-4'}>
                            <TextInput
                                editable
                                className={'text-black py-2 border-b-2 border-b-red-500'}
                                onChangeText={(t) => setChatId(t)}
                                multiline
                                value={chatId}
                                placeholder="ИД чата для отправки СМС..."
                                keyboardType="numeric"
                            />
                        </View>
                    </View>
                    <View className={' pt-6'}>
                        <Text className={'text-black text-[16px] font-light'}>5. Ключевые слова фильтра:</Text>
                        <View className={'p-4'}>
                            <TextInput
                                editable
                                className={'text-black py-2 border-b-2 border-b-red-500'}
                                onChangeText={(t) => setKeywords(t)}
                                multiline
                                value={keywords}
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
                    <View className={'pt-4 pt-8 flex items-center justify-center'}>
                        <Text className={'text-gray-300 text-[10px]'}>Development by mrsky1001.work@gmail.com / @mrsky1001</Text>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

export default App
