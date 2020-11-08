import React, { FC, useReducer, useState } from 'react';
import { Newline, Text } from 'ink';
import MultiSelect, { ListedItem } from 'ink-multi-select';
import Spinner from 'ink-spinner';
import { cities, getCityChineseName } from '../util/city';
import { getRepository } from 'typeorm';
import { DataVersion } from '../entity/data-version';
import { getDataVersion } from '../service/api-service';

export interface SelectCityProps {
    onSuccess?: (() => void);
}

export const SelectCity: FC<SelectCityProps> = (props) => {
    const [, forceUpdate] = useState({});
    const [submitted, setSubmitted] = useState(false);
    const [cityState, setCityState] = useReducer((stateMap: Map<string, {
        checkingVersion: boolean,
        downloadingData: boolean,
    }>, action: { type: string, value: string | string[] }) => {
        switch (action.type) {
            case 'init':
                for (const city of action.value as string[]) {
                    stateMap.set(city, {
                        checkingVersion: true,
                        downloadingData: false,
                    });
                }
                return stateMap;
            case 'continue':
                stateMap.set(action.value as string, {
                    checkingVersion: false,
                    downloadingData: true,
                });
                return stateMap;
            case 'finish':
                stateMap.set(action.value as string, {
                    checkingVersion: true,
                    downloadingData: false,
                });
                return stateMap;
            default:
                throw new Error();
        }
    }, new Map());

    const handleSubmit = async (items: ListedItem[]) => {
        setSubmitted(true);

        const cities = items.map((item) => (item.value.toString()));
        setCityState({ type: 'init', value: cities });
        forceUpdate({});

        const repository = getRepository(DataVersion);

        await Promise.all(cities.map(async (city) => {
            const newDataVersion = await getDataVersion(city);
            await repository.save({ city, ...newDataVersion });

            setCityState({ type: 'continue', value: city });
            forceUpdate({});
        }));

        if (props.onSuccess) {
            props.onSuccess()
        }
    };

    if (submitted) {
        const components = [] as JSX.Element[];
        for (const [city, state] of cityState.entries()) {
            if (state.checkingVersion) {
                components.push(
                    <Text key={city}>
                        <Text color="green">
                            <Spinner type="dots" />
                        </Text>
                        {` 🔍  正在檢查${getCityChineseName(city)}的路線資料版本...`}
                    </Text>
                );
            }
            if (state.downloadingData) {
                components.push(
                    <Text key={city}>
                        <Text color="green">
                            <Spinner type="dots" />
                        </Text>
                        {` ⬇️  正在下載${getCityChineseName(city)}的路線資料...`}
                    </Text>
                );
            }
        }
        return <>{components}</>;
    } else {
        const items = cities.map((city) => ({
            label: getCityChineseName(city),
            value: city,
        }));

        return <>
            <Text>
                <Text>
                    <Text color="blue">?</Text>
                    <Text bold> 🏙  請選擇要檢索的城市</Text>
                </Text>
                <Text color="gray">（按下空白鍵來選擇，按下 Enter 來送出）</Text>
            </Text>
            <Newline />
            <MultiSelect items={items} /* defaultSelected={items} */ onSubmit={handleSubmit} />
        </>;
    }
};
