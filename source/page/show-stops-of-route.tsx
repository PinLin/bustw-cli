import React, { FC, useState } from 'react';
import { Text, useInput } from 'ink';
import Spinner from 'ink-spinner';
import { Tab, Tabs } from 'ink-tab';
import Divider from 'ink-divider';
import { getRepository } from 'typeorm';
import { BusRoute } from '../entity/bus-route';
import { BusStop } from '../entity/bus-stop';
import { getCityChineseName } from '../util/city';

export interface ShowStopsOfRouteProps {
    onExit: () => void;
    city: string;
    routeId: string;
    width: number;
    height: number;
}

export const ShowStopsOfRoute: FC<ShowStopsOfRouteProps> = (props) => {
    const [busRoute, setBusRoute] = useState(null as BusRoute);
    const [subRouteTabIndex, setSubRouteTabIndex] = useState(0);
    const [firstStopItemIndex, setFirstStopItemIndex] = useState(0);

    useInput((input, key) => {
        if (busRoute) {
            const stops = JSON.parse(busRoute.subRoutes[subRouteTabIndex].stopsJson);
            if (key.downArrow && firstStopItemIndex + (props.height - 3) < stops.length) {
                setFirstStopItemIndex(firstStopItemIndex + 1);
            }
            if (key.upArrow && firstStopItemIndex > 0) {
                setFirstStopItemIndex(firstStopItemIndex - 1);
            }
            if (key.escape || input == 'q') {
                props.onExit();
            }
        }
    });

    if (busRoute) {
        return <>
            <Divider width={props.width * 0.97} title={`[${getCityChineseName(busRoute.city)}] ${busRoute.nameZhTw}`} />
            <Tabs onChange={(name) => {
                setSubRouteTabIndex(Number(name));
                setFirstStopItemIndex(0);
            }} children={busRoute.subRoutes.map((subRoute, index) => {
                const stops = JSON.parse(subRoute.stopsJson) as BusStop[];
                return <Tab name={index.toString()}>{`往${stops[stops.length - 1].nameZhTw}`}</Tab>
            })} />
            <Divider width={props.width * 0.97} title={''} />
            {
                JSON.parse(busRoute.subRoutes[subRouteTabIndex].stopsJson).map((stop) => {
                    return <Text>
                        <Text color="gray">［ 載入中 ］</Text>
                        <Text>{stop.nameZhTw}</Text>
                    </Text>
                }).slice(firstStopItemIndex, firstStopItemIndex + (props.height - 3))
            }
        </>;
    } else {
        (async () => {
            setBusRoute(await getRepository(BusRoute).findOne(props.routeId, {
                relations: ['subRoutes'],
            }));
        })()

        return <Text>
            <Text color="green">
                <Spinner type="dots" />
            </Text>
            {" Loading..."}
        </Text>
    }
}
