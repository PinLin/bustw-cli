import React, { FC, useState } from 'react';
import { Text } from 'ink';
import MultiSelect, { ListedItem } from 'ink-multi-select';
import Spinner from 'ink-spinner';
import useStdoutDimensions from 'ink-use-stdout-dimensions';
import { cities, getCityChineseName } from '../util/city';
import { getRepository } from 'typeorm';
import { BusInfo } from '../entity/bus-info';
import { getBusRoutes, getBusInfo } from '../service/api-service';
import { CityState, useCitiesState } from '../hook/use-cities-state';
import { BusRoute } from '../entity/bus-route';
import { BusSubRoute } from '../entity/bus-sub-route';

export interface SelectAvailableCitiesProps {
    onSelected?: ((selectedCities: string[]) => void);
    previousSelectedCities: string[];
}

export const SelectAvailableCities: FC<SelectAvailableCitiesProps> = (props) => {
    const [, height] = useStdoutDimensions();
    const [submitted, setSubmitted] = useState(false);
    const [citiesState, setCitiesState] = useCitiesState();

    const handleSubmit = async (items: ListedItem[]) => {
        setSubmitted(true);

        const selectedCities = items.map((item) => (item.value.toString()));

        await Promise.all(cities.map(async (city) => {
            // 如果沒有選擇該縣市
            if (!selectedCities.includes(city)) {
                // 移除該縣市的路線資料
                await getRepository(BusInfo).delete({ city });
                return;
            }

            setCitiesState(city, CityState.CheckingVersion);

            // 檢查該縣市的路線資料版本是否過時
            const oldVersion = (await getRepository(BusInfo).findOne(city))?.routesVersion ?? 0;
            const newVersion = (await getBusInfo(city)).routesVersion;
            if (newVersion <= oldVersion) {
                setCitiesState(city, CityState.None);
                return;
            }

            setCitiesState(city, CityState.DownloadingData);

            // 下載該縣市的路線資料
            const busRoutes = (await getBusRoutes(city)).routes;

            setCitiesState(city, CityState.SavingData);

            // 移除該縣市的路線資料
            await getRepository(BusRoute).delete({ city });

            // 儲存該縣市的路線資料
            await Promise.all(busRoutes.map(async (busRoute) => {
                await getRepository(BusRoute).save(busRoute);
                busRoute.subRoutes.map(async (busSubRoute) => {
                    await getRepository(BusSubRoute).save({
                        ...busSubRoute,
                        stopsJson: JSON.stringify(busSubRoute.stops),
                        route: busRoute,
                    });
                });
            }));
            await getRepository(BusInfo).save({ city, routesVersion: newVersion });

            setCitiesState(city, CityState.None);
        }));

        if (props.onSelected) {
            props.onSelected(selectedCities);
        }
    };

    if (submitted) {
        const components = [] as JSX.Element[];
        for (const [city, state] of citiesState.entries()) {
            let text: string;
            if (state == CityState.CheckingVersion) {
                text = ` 🔍 正在檢查${getCityChineseName(city)}的路線資料版本...`;
            }
            if (state == CityState.DownloadingData) {
                text = ` ⬇️  正在下載${getCityChineseName(city)}的路線資料...`;
            }
            if (state == CityState.SavingData) {
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
        return (
            <>{components}</>
        );
    } else {
        const items = cities.map((city) => ({
            label: getCityChineseName(city),
            value: city,
        }));
        let selectedItems = items.filter(item => props.previousSelectedCities.includes(item.value));
        if (selectedItems.length == 0) {
            selectedItems = items;
        }

        return (
            <>
                <Text>
                    <Text bold> 🏙  請選擇要檢索的城市</Text>
                    <Text color="gray">（按空白鍵選擇，按 Enter 送出）</Text>
                </Text>
                <MultiSelect items={items} defaultSelected={selectedItems} onSubmit={handleSubmit} limit={height - 1} />
            </>
        );
    }
};
