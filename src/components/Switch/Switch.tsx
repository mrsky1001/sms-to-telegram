import React from 'react'
import { Switch } from 'react-native'

export default function SwitchManual(props: { className?: string; value: boolean; onTouch: () => void }) {
    const className = props.className ?? ''
    const value = props.value
    const onTouch = props.onTouch
    return (
        <Switch
            className={'h-6 ' + className}
            trackColor={{ false: '#e59b9b', true: '#aee1ff' }}
            thumbColor={value ? '#6fa1ff' : '#e16161'}
            onTouchStart={onTouch}
            value={value}
        />
    )
}
