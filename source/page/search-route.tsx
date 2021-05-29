import React, { FC, useState } from 'react';
import { Text } from 'ink';
import TextInput from 'ink-text-input';
import SelectInput from 'ink-select-input';
import useStdoutDimensions from 'ink-use-stdout-dimensions';
import { getRepository, In, Like } from 'typeorm';
import { BusInfo } from '../entity/bus-info';
import { BusRoute } from '../entity/bus-route';
import { getCityChineseName } from '../util/city';

export interface SearchRouteProps {
    onSuccess?: ((routeId: string) => void);
}

export const SearchRoute: FC<SearchRouteProps> = (props) => {
    const [columns, rows] = useStdoutDimensions();
    const [query, setQuery] = useState('');
    const [routeItems, setRouteItems] = useState([] as { label: string, value: string }[]);

    const handleChangeQuery = async (label: string) => {
        const availableCities = (await getRepository(BusInfo).find()).map(busInfo => busInfo.city);
        const foundRoutes = await getRepository(BusRoute).find({
            where: {
                nameZhTw: Like(`%${label}%`),
                city: In(availableCities),
            },
        });

        setQuery(label);
        setRouteItems(foundRoutes.map(route => ({
            label: `[${getCityChineseName(route.city)}] ${route.nameZhTw}`,
            value: route.id,
        })));
    };
    const handleHighlight = (routeItem: { label: string, value: string }) => {
        setQuery(routeItem.label.split('] ')[1]);
    };
    const handleSelect = (routeItem: { label: string, value: string }) => {
        if (props.onSuccess) {
            props.onSuccess(routeItem.value);
        }
    };

    return <>
        <Text>
            <Text bold>🚌 請輸入要查詢的公車路線：</Text>
            <TextInput value={query} onChange={handleChangeQuery} onSubmit={() => { }} />
        </Text>
        {
            query != '' &&
            <SelectInput
                items={routeItems}
                onHighlight={handleHighlight}
                onSelect={handleSelect}
                limit={rows - 1}
            />
        }
    </>;
};
