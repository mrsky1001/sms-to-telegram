import React from 'react'
import { Image, Text, View } from 'react-native'

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import logo from '../../resoruces/logo.jpg'

export default function Header() {
    return (
        <View className={'flex flex-row items-center justify-start h-20 border-b-gray-400  border-b '}>
            <Image className={'w-10 h-10'} source={logo}></Image>
            <Text className={'pl-6 text-black text-2xl font-light'}>{'SMS to Telegram'}</Text>
        </View>
    )
}
