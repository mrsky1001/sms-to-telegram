import React from 'react'
import { View } from 'react-native'

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import trashIcon from '../../resoruces/trash.png'

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { requestReadSMSPermission, startReadSMS, stopReadSMS } from '@maniac-tech/react-native-expo-read-sms'
import Task from '../../core/models/Task'
import AccordionHeader from '../AccordionHeader/AccordionHeader'
import TextInput from '../TextInput/TextInput'
import Button from '../Button/Button'

export function TaskForm(props: {
    task: Task
    changeKeywords: (taskId: number, keywords: string) => void
    changeChatId: (taskId: number, chatId: string) => void
    deleteTask: (taskId: number) => void
}) {
    const task = props.task
    const changeKeywords = (t: string) => props.changeKeywords(task.id, t)
    const changeChatId = (t: string) => props.changeChatId(task.id, t)
    const deleteTask = props.deleteTask

    const TaskForm = (task: Task) => {
        return (
            <View key={task.id} className={' pt-6'}>
                <View className={'py-4'}>
                    <TextInput
                        label={'ИД чата для отправки СМС'}
                        value={task.chatId}
                        placeholder="Введите ИД телеграм-чата..."
                        // selection={{ start: 0, end: task.chatId?.length }}
                        onChangeText={(t) => changeChatId(t)}
                    />
                </View>
                <View className={'py-4'}>
                    <TextInput
                        label={'Ключевые слова фильтра'}
                        placeholder="Введите ключевые слова..."
                        value={task.keywords.join(' ')}
                        // selection={{ start: 0, end: task.keywords?.join(' ').length }}
                        onChangeText={(t) => changeKeywords(t)}
                    />
                    <View className={'pt-4 flex flex-row justify-end'}>
                        <Button
                            label={'Удалить'}
                            icon={trashIcon}
                            onPress={() => {
                                deleteTask(task.id)
                            }}
                            disabled={false}
                        />
                    </View>
                </View>
            </View>
        )
    }

    const [isCollapsed, setIsCollapsed] = React.useState(true)

    const toggle = () => setIsCollapsed(!isCollapsed)

    if (task) {
        return (
            <View className={'block max-w mt-5 px-4 py-5 bg-white border border-gray-200 rounded-lg shadow '}>
                <AccordionHeader title={task.name ?? `Задача №${task.id}`} isCollapsed={isCollapsed} toggle={toggle} />
                <View className={isCollapsed ? 'hidden' : ''}>
                    <TaskForm id={task.id} chatId={task.chatId} keywords={task.keywords}></TaskForm>
                </View>
            </View>
        )
    } else {
        return null
    }
}
