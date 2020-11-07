import React, { FC } from 'react';
import { Newline, Text } from 'ink';
import MultiSelect from 'ink-multi-select';
import { cities, getCityChineseName } from '../util/city';

export const SelectCity: FC<{}> = () => {
    const handleSubmit = (items: any) => {
        console.log(items);
    };

    const items = cities.map((city) => ({
        label: getCityChineseName(city),
        value: city,
    }));

    return (
        <>
            <Text>
                <Text>🏙  請選擇要檢索的城市</Text>
                <Text color="gray">（按下空白鍵來選擇，按下 Enter 來送出）</Text>
            </Text>
            <Newline />
            <MultiSelect items={items} onSubmit={handleSubmit} />
        </>
    );
};
