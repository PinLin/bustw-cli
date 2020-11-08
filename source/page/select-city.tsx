import React, { FC, useState } from 'react';
import { Newline, Text } from 'ink';
import MultiSelect, { ListedItem } from 'ink-multi-select';
import Spinner from 'ink-spinner';
import { cities, getCityChineseName } from '../util/city';
import { getRepository } from 'typeorm';
import { DataVersion } from '../entity/data-version';
import { getDataVersion } from '../service/api-service';
import { SelectCityActionType, useSelectCityState } from '../hook/use-select-city-state';

export interface SelectCityProps {
    onSuccess?: (() => void);
}

export const SelectCity: FC<SelectCityProps> = (props) => {
    const [submitted, setSubmitted] = useState(false);
    const [cityState, setCityState] = useSelectCityState();

    const handleSubmit = async (items: ListedItem[]) => {
        setSubmitted(true);

        const cities = items.map((item) => (item.value.toString()));

        const repository = getRepository(DataVersion);

        await Promise.all(cities.map(async (city) => {
            setCityState(city, SelectCityActionType.CheckingVersion );

            const oldVersionId = (await repository.findOne(city))?.versionId ?? 0;
            const newVersionId = (await getDataVersion(city)).versionId;
            if (newVersionId > oldVersionId) {
                await repository.save({ city, versionId: newVersionId });

                setCityState(city, SelectCityActionType.DownloadingData );

                // TODO: 把下面這句改為更新路線資料
                await new Promise((res) => { setTimeout(() => { res() }, Math.random() * 3000 + 1000) });
            }

            setCityState(city, SelectCityActionType.None );
        }));

        if (props.onSuccess) {
            props.onSuccess()
        }
    };

    if (submitted) {
        const components = [] as JSX.Element[];
        for (const [city, state] of cityState.entries()) {
            if (state == SelectCityActionType.CheckingVersion) {
                components.push(
                    <Text key={city}>
                        <Text color="green">
                            <Spinner type="dots" />
                        </Text>
                        {` 🔍  正在檢查${getCityChineseName(city)}的路線資料版本...`}
                    </Text>
                );
            }
            if (state == SelectCityActionType.DownloadingData) {
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
