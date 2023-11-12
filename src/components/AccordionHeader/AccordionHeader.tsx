import React from 'react'
import { Image, Text, TouchableOpacity } from 'react-native'

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import downChevron from '../../resoruces/down-chevron.png'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import upChevron from '../../resoruces/up-chevron.png'

export default function AccordionHeader(props: { title: string; isCollapsed: boolean; toggle: () => void }) {
    const title = props.title
    const isCollapsed = props.isCollapsed
    const toggle = props.toggle

    return (
        <TouchableOpacity
            activeOpacity={0.8}
            onPress={toggle}
            className={'border-gray-300 w-full flex flex-row justify-between ' + (isCollapsed ? '' : ' border-b pb-4 ')}
        >
            <Text className={'text-gray-800 text-[20px] font-medium'}>{title}</Text>
            <Image className={'w-6 h-6'} source={isCollapsed ? downChevron : upChevron}></Image>
        </TouchableOpacity>
    )
}
