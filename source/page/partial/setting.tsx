import React, { FC } from 'react';
import { Text } from 'ink';
import SelectInput from 'ink-select-input';

export interface SettingProps {
    onGoToSelectAvailableCities?: () => void;
}

export const Setting: FC<SettingProps> = (props) => {
    const items = [
        {
            key: 'SelectAvailableCities',
            value: 'SelectAvailableCities',
            label: "被檢索的城市",
        },
    ]
    const handleSelect = (routeItem: { label: string, value: string }) => {
        if (routeItem.value == 'SelectAvailableCities') {
            if (props.onGoToSelectAvailableCities) {
                props.onGoToSelectAvailableCities();
            }
        }
    };

    return (
        <>
            <Text bold>🛠  請選擇要調整的設定</Text>
            <SelectInput items={items} onSelect={handleSelect} />
        </>
    );
}
