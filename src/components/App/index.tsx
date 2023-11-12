import React, { useState } from 'react'
import { SafeAreaView, ScrollView, Text, View } from 'react-native'

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import addIcon from '../../resoruces/add.png'

import Task from '../../core/models/Task'
import { TaskForm } from '../TaskForm/TaskForm'
import SettingsForm from '../SettingsForm/SettingsForm'
import Header from '../Header/Header'
import Button from '../Button/Button'
import { getAllItemsLS, setAllItemsLS, showNotifyMessage } from '../../core/services/app.services'

export default function App() {
    const [tasks, setTasks] = React.useState([new Task(1, '', [])])

    const [hasPermissionReadSms, setHasPermissionReadSms] = useState(false)

    /**
     * Функция сохранения параметров в хранилище
     */
    const onSave = () => {
        console.log('onSave')
        console.log('tasks', tasks)
        const keysValues = [
            {
                name: 'tasks',
                value: tasks
            }
        ]

        // todo сохранять все параметры иначе затирает
        setAllItemsLS(keysValues).then(() => {
            showNotifyMessage('Данные сохранены!')
        })

        getAllItemsLS('botApiKey', 'tasks').then((keysValues: any[]) => {
            keysValues.forEach((obj) => {
                console.log('useEffect')
                console.log(obj)
            })
        })
    }

    /**
     * Создание и добавление новой задачи
     */
    const addTask = () => {
        const newTask = new Task(tasks.length + 1, '', [])
        setTasks([...tasks, newTask])

        onSave()
    }

    /**
     * Изменение поля chatId для выбранной задачи
     * @param taskId
     * @param chatId
     */
    const changeChatId = (taskId: number, chatId: string) => {
        console.log('changeChatId')
        const task = tasks.find((d) => d.id === taskId)

        if (task) {
            task.chatId = chatId

            onSave()
            // setTasks([...tasks])
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
            onSave()
        }
    }

    /**
     * Удаление выбранной задачи
     * @param taskId
     */
    const deleteTask = (taskId: number) => {
        setTasks([...tasks.filter((task) => task.id !== taskId)])
        onSave()
    }

    return (
        <SafeAreaView className={'px-4 bg-white h-full'}>
            <ScrollView>
                <Header></Header>
                <View className={'pt-5'}>
                    <View className={' border-b border-b-gray-300'}>
                        <SettingsForm
                            tasks={tasks}
                            setTasks={setTasks}
                            hasPermissionReadSms={hasPermissionReadSms}
                            setHasPermissionReadSms={setHasPermissionReadSms}
                        ></SettingsForm>
                        <View className={'flex flex-row justify-between'}>
                            <Text className={'pt-5 pb-3 text-gray-400'}>Задачи</Text>
                        </View>
                    </View>
                    {tasks.map((task) => {
                        return (
                            <TaskForm
                                key={task.id}
                                task={task}
                                changeChatId={changeChatId}
                                changeKeywords={changeKeywords}
                                deleteTask={deleteTask}
                            ></TaskForm>
                        )
                    })}
                    <View className={'p-4'}>
                        <Button label={'Создать задачу'} icon={addIcon} onPress={addTask} disabled={!hasPermissionReadSms} />
                    </View>
                    <View className={'py-8 flex items-center justify-center'}>
                        <Text className={'text-gray-300 text-[10px]'}>Development by mrsky1001.work@gmail.com / @mrsky1001</Text>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}
