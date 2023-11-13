import React, { useEffect, useState } from 'react'
import { Text, View } from 'react-native'

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { requestReadSMSPermission, startReadSMS, stopReadSMS } from '@maniac-tech/react-native-expo-read-sms'
import AccordionHeader from '../AccordionHeader/AccordionHeader'
import { getAllItemsLS, logs, setAllItemsLS } from '../../core/services/app.services'
import Switch from '../Switch/Switch'

export function LogForm() {
    const [isCollapsed, setIsCollapsed] = React.useState(true)
    const [isOn, setIsOn] = React.useState(true)
    const [logs, setLogs] = useState([])
    const toggle = () => setIsCollapsed(!isCollapsed)

    useEffect(() => {
        setInterval(() => {
            getAllItemsLS('logs').then((r) => {
                if (r?.logs && r.logs?.length !== logs.length) {
                    setLogs(r.logs)
                }
            })
        }, 5000)
    }, [])
    return (
        <View className={'mt-16 pt-4 border-t border-t-gray-300'}>
            <View className={'flex flex-row justify-between'}>
                <Text className={' text-black text-[14px] font-light'}>Включить журналирование</Text>
                <Switch
                    onTouch={() => {
                        setIsOn(isOn)
                    }}
                    value={isOn}
                />
            </View>
            <View className={'block max-w mt-5 px-4 py-5 bg-white border border-gray-200 rounded-lg shadow '}>
                <AccordionHeader title={'Журнал'} isCollapsed={isCollapsed} toggle={toggle} />
                <View className={isCollapsed ? 'hidden' : '' + ' pt-2'}>
                    <Text className={'leading-5 '}>{logs.join('\n')}</Text>
                </View>
            </View>
        </View>
    )
}
