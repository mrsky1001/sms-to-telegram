import React from 'react'
import { Text, TextInput, TouchableOpacity, View } from 'react-native'

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { requestReadSMSPermission, startReadSMS, stopReadSMS } from '@maniac-tech/react-native-expo-read-sms'
import Task from '../../core/models/Task'
import Collapsible from 'react-native-collapsible'

export function TasksForm(props: { task: Task }) {
    console.log(props)

    const task = props.task

    const TaskForm = (task: Task) => {
        return (
            <View key={task.id} className={' pt-6'}>
                <View className={' pt-6'}>
                    <View className={'p-4'}>
                        <TouchableOpacity
                            activeOpacity={0.1}
                            // className={cssClassButton(!hasPermissionReadSms)}
                            onPress={() => {
                                // hasPermissionReadSms && deleteTask(task.id)
                            }}
                        >
                            <Text
                            // className={cssClassButtonText(!hasPermissionReadSms) + ' font-small'}
                            >
                                Удалить задачу
                            </Text>
                        </TouchableOpacity>
                    </View>
                    <Text className={'text-black text-[16px] font-light'}>ИД чата для отправки СМС:</Text>
                    <View className={'p-4'}>
                        <TextInput
                            editable
                            className={'text-black py-2 border-b-2 border-b-red-500'}
                            // onChangeText={(t) => changeChatId(task.id, t)}
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
                            // onChangeText={(t) => changeKeywords(task.id, t)}
                            multiline
                            value={task.keywords.join(' ')}
                            placeholder="Ключевые слова..."
                            keyboardType="default"
                        />
                        <View className={'pt-4 pt-8'}>
                            <TouchableOpacity
                                activeOpacity={0.1}
                                // className={cssClassButton(!hasPermissionReadSms)}
                                onPress={() => {
                                    // hasPermissionReadSms && onSave()
                                }}
                            >
                                <Text
                                // className={cssClassButtonText(!hasPermissionReadSms)}
                                >
                                    Сохранить
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </View>
        )
    }

    const [isCollapsed, setIsCollapsed] = React.useState(true)

    const toggleTask = () => setIsCollapsed(!isCollapsed)

    if (task) {
        return (
            <View>
                <Text onPress={toggleTask} className={'text-black text-[24px] font-medium'}>
                    Задача №{task.id}
                </Text>
                <Collapsible duration={0} collapsed={isCollapsed}>
                    <TaskForm id={task.id} chatId={task.chatId} keywords={task.keywords}></TaskForm>
                </Collapsible>
            </View>
        )
    } else {
        return null
    }
}
