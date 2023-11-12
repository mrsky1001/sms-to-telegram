import React, { useEffect, useState } from 'react'
import { Text, TextInput, View } from 'react-native'

export default function SwitchManual(props: {
    label: string
    className?: string
    placeholder: string
    value: string
    selection?: { start: number; end: number }
    onChangeText: (value: string) => void
}) {
    console.log(props.value)
    const [selfValue, setValue] = useState(props.value)

    useEffect(() => {
        console.log('effect props.value', props.value)
        console.log('effect value', selfValue)
        setValue(props.value)
    }, [props.value])
    const className = props.className ?? ''
    const selection = props.selection
    const label = props.label
    const placeholder = props.placeholder
    const onChangeText = (t: string) => {
        props.onChangeText(t)
    }

    return (
        <View>
            <Text className={'text-[14px] font-medium text-blue-900'}>{label}</Text>
            <TextInput
                editable
                className={'text-black py-2 border-b-2 border-b-blue-300 ' + className}
                onChangeText={(t) => setValue(t)}
                onEndEditing={() => onChangeText(selfValue)}
                multiline
                selection={selection}
                value={selfValue}
                placeholder={placeholder}
                placeholderTextColor={'lightgray'}
                keyboardType="default"
            />
        </View>
    )
}
