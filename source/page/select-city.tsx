import React, { FC, useState } from 'react';
import { Text } from 'ink';
import MultiSelect, { ListedItem } from 'ink-multi-select';
import Spinner from 'ink-spinner';
import useStdoutDimensions from 'ink-use-stdout-dimensions';
import { cities, getCityChineseName } from '../util/city';
import { getRepository } from 'typeorm';
import { BusInfo } from '../entity/bus-info';
import { getBusRoutes, getBusInfo } from '../service/api-service';
import { SelectCityState, useSelectCityState } from '../hook/use-select-city-state';
import { BusRoute } from '../entity/bus-route';
import { BusSubRoute } from '../entity/bus-sub-route';

export interface SelectCityProps {
    onSuccess?: (() => void);
}

export const SelectCity: FC<SelectCityProps> = (props) => {
    const [columns, rows] = useStdoutDimensions();
    const [submitted, setSubmitted] = useState(false);
    const [cityState, setCityState] = useSelectCityState();

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

            setCityState(city, SelectCityState.CheckingVersion);

            // 檢查該縣市的路線資料版本是否過時
            const oldVersion = (await getRepository(BusInfo).findOne(city))?.routesVersion ?? 0;
            const newVersion = (await getBusInfo(city)).routesVersion;
            if (newVersion <= oldVersion) {
                setCityState(city, SelectCityState.None);
                return;
            }

            setCityState(city, SelectCityState.DownloadingData);

            // 下載該縣市的路線資料
            const busRoutes = (await getBusRoutes(city)).routes;

            setCityState(city, SelectCityState.SavingData);

            // 移除該縣市的路線資料
            await getRepository(BusRoute).delete({ city });

            // 儲存該縣市的路線資料
            await Promise.all(busRoutes.map(async (busRoute) => {
                await getRepository(BusRoute).save(busRoute);
                busRoute.subRoutes.map(async (busSubRoute) => {
                    await getRepository(BusSubRoute).save({
                        ...busSubRoute,
                        stopsJson: JSON.stringify(busSubRoute.stops),
                    });
                });
            }));
            await getRepository(BusInfo).save({ city, routesVersion: newVersion });

            setCityState(city, SelectCityState.None);
        }));

        if (props.onSuccess) {
            props.onSuccess();
        }
    };

    if (submitted) {
        const components = [] as JSX.Element[];
        for (const [city, state] of cityState.entries()) {
            let text: string;
            if (state == SelectCityState.CheckingVersion) {
                text = ` 🔍 正在檢查${getCityChineseName(city)}的路線資料版本...`;
            }
            if (state == SelectCityState.DownloadingData) {
                text = ` ⬇️  正在下載${getCityChineseName(city)}的路線資料...`;
            }
            if (state == SelectCityState.SavingData) {
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
                <Text bold> 🏙  請選擇要檢索的城市</Text>
                <Text color="gray">（按下空白鍵來選擇，按下 Enter 來送出）</Text>
            </Text>
            <MultiSelect items={items} /* defaultSelected={items} */ onSubmit={handleSubmit} limit={rows - 1} />
        </>;
    }
};
