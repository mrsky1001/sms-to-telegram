import React from 'react'
import { Image, ImageSourcePropType, Text, TouchableOpacity, View } from 'react-native'
import { cssClassButton, cssClassButtonText } from '../../core/lib/css.settings'

export default function SwitchManual(props: {
    icon?: ImageSourcePropType
    label: string
    className?: string
    disabled: boolean
    onPress: () => void
}) {
    let className = props.className ?? ''
    const disabled = props.disabled
    const label = props.label
    const icon = props.icon
    const onPress = props.onPress

    if (icon) {
        className += ' flex flex-row justify-center px-4'
    }

    return (
        <View>
            <TouchableOpacity
                activeOpacity={0.1}
                className={cssClassButton(disabled) + ' ' + className}
                onPress={() => {
                    !disabled && onPress()
                }}
            >
                {icon ? <Image className={'w-5 h-5'} source={icon} /> : ''}
                <Text className={cssClassButtonText(disabled) + '  pl-1'}>{label}</Text>
            </TouchableOpacity>
        </View>
    )
}
