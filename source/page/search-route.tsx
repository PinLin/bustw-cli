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
    onSuccess?: ((city: string, routeId: string) => void);
    availableCities: string[];
}

export const SearchRoute: FC<SearchRouteProps> = (props) => {
    const [, height] = useStdoutDimensions();
    const [query, setQuery] = useState('');
    const [routeItems, setRouteItems] = useState([] as { key: string, label: string, value: BusRoute }[]);

    const handleChangeQuery = async (label: string) => {
        const foundRoutes = await getRepository(BusRoute).find({
            where: {
                nameZhTw: Like(`%${label}%`),
                city: In(props.availableCities),
            },
        });

        setQuery(label);
        setRouteItems(foundRoutes.map(route => ({
            key: route.id,
            label: `[${getCityChineseName(route.city)}] ${route.nameZhTw}`,
            value: route,
        })));
    };
    const handleHighlight = (routeItem: { label: string, value: BusRoute }) => {
        setQuery(routeItem?.value.nameZhTw ?? '');
    };
    const handleSelect = (routeItem: { label: string, value: BusRoute }) => {
        if (props.onSuccess) {
            props.onSuccess(routeItem.value.city, routeItem.value.id);
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
                limit={height - 1}
            />
        }
    </>;
};