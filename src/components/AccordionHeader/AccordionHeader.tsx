import React from 'react'
import { Image, Text, View } from 'react-native'

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
        <View className={'w-full flex flex-row justify-between'}>
            <Text onPress={toggle} className={' text-black text-[24px] font-medium'}>
                {title}
            </Text>
            <Image className={'w-6 h-6'} source={isCollapsed ? downChevron : upChevron}></Image>
        </View>
    )
}
