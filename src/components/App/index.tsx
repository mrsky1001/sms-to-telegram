import React, { useEffect, useState } from 'react'
import { Image, SafeAreaView, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native'

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import logo from '../../unnamed.jpg'
import { config } from '../../../config/config'
import Task from '../../core/models/Task'
import { TasksForm } from '../TasksForm/TasksForm'
import { cssClassButton, cssClassButtonText } from '../../core/lib/css.settings'
import SettingsForm from '../SettingsForm/SettingsForm'

export default function App() {
    const [tasks, setTasks] = React.useState([new Task(1, config.telegram.chatId, config.keywords)])

    const [hasPermissionReadSms, setHasPermissionReadSms] = useState(false)

    /**
     * Создание и добавление новой задачи
     */
    const addTask = () => {
        const newTask = new Task(tasks.length, config.telegram.chatId, config.keywords)
        setTasks([...tasks, newTask])
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
     * Удаление выбранной задачи
     * @param taskId
     */
    const deleteTask = (taskId: number) => {
        setTasks([...tasks.filter((task) => task.id !== taskId)])
    }

    const isCollapsed = false

    return (
        <SafeAreaView className={'px-4 bg-white h-full'}>
            <ScrollView>
                <View className={'flex flex-row items-center justify-start h-20 border-b-red-500  border-b-2 '}>
                    <Image className={'w-10 h-10'} source={logo}></Image>
                    <Text className={'pl-6 text-black text-2xl font-light'}>{'SMS to Telegram'}</Text>
                </View>
                <View className={'pt-5'}>
                    <SettingsForm
                        tasks={tasks}
                        setTasks={setTasks}
                        hasPermissionReadSms={hasPermissionReadSms}
                        setHasPermissionReadSms={setHasPermissionReadSms}
                    ></SettingsForm>
                    {tasks.map((task) => {
                        return <TasksForm task={task}></TasksForm>
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
