import React, { FC, useState } from 'react';
import { Text } from 'ink';
import TextInput from 'ink-text-input';
import SelectInput from 'ink-select-input';
import { getRepository } from 'typeorm';
import { BusRoute } from '../../entity/bus-route';
import { getCityChineseName } from '../../util/city';
import { truncateMiddle } from '../../util/truncate';

export interface SearchRouteProps {
    onSelect?: ((city: string, routeName: string, routeId: string) => void);
    availableCities: string[];
    width: number;
    height: number;
}

export const SearchRoute: FC<SearchRouteProps> = (props) => {
    const [query, setQuery] = useState('');
    const [routeItems, setRouteItems] = useState([] as { key: string, label: string, value: BusRoute }[]);

    const handleChangeQuery = async (label: string) => {
        const foundRoutes = await getRepository(BusRoute).createQueryBuilder('route')
            .andWhere('route.nameZhTw like :name', { name: `%${label.trim()}%` })
            .andWhere('route.city IN (:...cities)', { cities: props.availableCities })
            .leftJoin('route.subRoutes', 'busSubRoute', 'busSubRoute.routeId = route.id')
            .addSelect('busSubRoute.headsignZhTw')
            .getMany();

        setQuery(label);
        setRouteItems(foundRoutes.map(route => {
            if (route.nameZhTw.match(/-[^0-9主副區]+/) ||
                ['往'].map(c => route.nameZhTw.includes(c)).includes(true)) {
                return {
                    key: route.id,
                    label: `[${getCityChineseName(route.city)}] ${route.nameZhTw}`,
                    value: route,
                };
            } else if (route?.subRoutes[0]?.headsignZhTw) {
                const headsign = truncateMiddle(route.subRoutes[0].headsignZhTw,
                    props.width - 14 - route.nameZhTw.length - route.subRoutes[0].headsignZhTw.length);
                return {
                    key: route.id,
                    label: `[${getCityChineseName(route.city)}] ${route.nameZhTw} ${headsign}`,
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
    const handleSelect = (routeItem: { label: string, value: BusRoute }) => {
        try {
            if (props.onSelect) {
                props.onSelect(routeItem.value.city, routeItem.value.ptxName, routeItem.value.id);
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
                query.trim() != '' &&
                <SelectInput
                    items={routeItems}
                    onSelect={handleSelect}
                    limit={props.height - 3}
                />
            }
        </>
    );
};
