import React, { FC, useState } from 'react';
import { Text } from 'ink';
import TextInput from 'ink-text-input';
import SelectInput from 'ink-select-input';
import { getRepository, In, Like } from 'typeorm';
import { BusRoute } from '../entity/bus-route';
import { getCityChineseName } from '../util/city';

export interface SearchRouteProps {
    onSelect?: ((city: string, routeId: string) => void);
    availableCities: string[];
    height: number;
}

export const SearchRoute: FC<SearchRouteProps> = (props) => {
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
        setRouteItems(foundRoutes.map(route => {
            if (route.nameZhTw.match(/-[^0-9主副區]+/) ||
                ['→', '往'].map(c => route.nameZhTw.includes(c)).includes(true)) {
                return {
                    key: route.id,
                    label: `[${getCityChineseName(route.city)}] ${route.nameZhTw}`,
                    value: route,
                };
            } else {
                return {
                    key: route.id,
                    label: `[${getCityChineseName(route.city)}] ${route.nameZhTw} ${route.departureStopNameZhTw} -> ${route.destinationStopNameZhTw}`,
                    value: route,
                };
            }
        }));
    };
    const handleHighlight = (routeItem: { label: string, value: BusRoute }) => {
        setQuery(routeItem?.value.nameZhTw ?? '');
    };
    const handleSelect = (routeItem: { label: string, value: BusRoute }) => {
        try {
            if (props.onSelect) {
                props.onSelect(routeItem.value.city, routeItem.value.id);
            }
        } catch (e) {
        }
    };

    return (
        <>
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
                    limit={props.height - 3}
                />
            }
        </>
    );
};
