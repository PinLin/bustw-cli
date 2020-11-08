import React, { FC, useState } from 'react';
import { Newline, Text } from 'ink';
import MultiSelect, { ListedItem } from 'ink-multi-select';
import Spinner from 'ink-spinner';
import { cities, getCityChineseName } from '../util/city';
import { getRepository } from 'typeorm';
import { DataVersion } from '../entity/data-version';
import { getBusRoutes, getDataVersion } from '../service/api-service';
import { SelectCityActionType, useSelectCityState } from '../hook/use-select-city-state';
import { BusRoute } from '../entity/bus-route';
import { BusSubRoute } from '../entity/bus-sub-route';

export interface SelectCityProps {
    onSuccess?: (() => void);
}

export const SelectCity: FC<SelectCityProps> = (props) => {
    const [submitted, setSubmitted] = useState(false);
    const [cityState, setCityState] = useSelectCityState();

    const handleSubmit = async (items: ListedItem[]) => {
        setSubmitted(true);

        const cities = items.map((item) => (item.value.toString()));

        await Promise.all(cities.map(async (city) => {
            setCityState(city, SelectCityActionType.CheckingVersion);

            const oldVersionId = (await getRepository(DataVersion).findOne(city))?.versionId ?? 0;
            const newVersionId = (await getDataVersion(city)).versionId;
            if (newVersionId <= oldVersionId) {
                setCityState(city, SelectCityActionType.None);
                return;
            }

            setCityState(city, SelectCityActionType.DownloadingData);

            const busRoutes = (await getBusRoutes(city)).routes;

            setCityState(city, SelectCityActionType.SavingData);

            await Promise.all(busRoutes.map(async (busRoute) => {
                await getRepository(BusRoute).save(busRoute);
                busRoute.subRoutes.map(async (busSubRoute) => {
                    await getRepository(BusSubRoute).save({
                        ...busSubRoute,
                        stopsJson: JSON.stringify(busSubRoute.stops),
                    });
                });
            }));

            await getRepository(DataVersion).save({ city, versionId: newVersionId });

            setCityState(city, SelectCityActionType.None);
        }));

        if (props.onSuccess) {
            props.onSuccess()
        }
    };

    if (submitted) {
        const components = [] as JSX.Element[];
        for (const [city, state] of cityState.entries()) {
            let text: string;
            if (state == SelectCityActionType.CheckingVersion) {
                text = ` 🔍  正在檢查${getCityChineseName(city)}的路線資料版本...`;
            }
            if (state == SelectCityActionType.DownloadingData) {
                text = ` ⬇️  正在下載${getCityChineseName(city)}的路線資料...`;
            }
            if (state == SelectCityActionType.SavingData) {
                text = ` 💾 正在儲存${getCityChineseName(city)}的路線資料...`;
            }
            components.push(
                <Text key={city}>
                    <Text color="green">
                        <Spinner type="dots" />
                    </Text>
                    {text}
                </Text>
            );
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
