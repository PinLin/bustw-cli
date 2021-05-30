import React, { FC, useState } from 'react';
import { Text, useInput } from 'ink';
import Spinner from 'ink-spinner';
import { Tab, Tabs } from 'ink-tab';
import useStdoutDimensions from 'ink-use-stdout-dimensions';
import { getRepository } from 'typeorm';
import { BusRoute } from '../entity/bus-route';
import { BusStop } from '../entity/bus-stop';
import { getCityChineseName } from '../util/city';

export interface ShowStopsAndTimeProps {
    city: string;
    routeId: string;
}

export const ShowStopsAndTime: FC<ShowStopsAndTimeProps> = (props) => {
    const [, height] = useStdoutDimensions();
    const [busRoute, setBusRoute] = useState(null as BusRoute);
    const [subRouteTabIndex, setSubRouteTabIndex] = useState(0);
    const [firstStopItemIndex, setFirstStopItemIndex] = useState(0);
    useInput((input, key) => {
        if (busRoute) {
            const stops = JSON.parse(busRoute.subRoutes[subRouteTabIndex].stopsJson);
            if (key.downArrow && firstStopItemIndex + (height - 2) < stops.length) {
                setFirstStopItemIndex(firstStopItemIndex + 1);
            }
            if (key.upArrow && firstStopItemIndex > 0) {
                setFirstStopItemIndex(firstStopItemIndex - 1);
            }
        }
    });

    if (busRoute) {
        return <>
            <Text bold>{`[${getCityChineseName(busRoute.city)}] ${busRoute.nameZhTw}`}</Text>
            <Tabs onChange={(name) => {
                setSubRouteTabIndex(Number(name));
                setFirstStopItemIndex(0);
            }} children={busRoute.subRoutes.map((subRoute, index) => {
                const stops = JSON.parse(subRoute.stopsJson) as BusStop[];
                return <Tab name={index.toString()}>{`往${stops[stops.length - 1].nameZhTw}`}</Tab>
            })} />
            {
                JSON.parse(busRoute.subRoutes[subRouteTabIndex].stopsJson).map((stop) => {
                    return <Text>
                        <Text color="gray">［ 載入中 ］</Text>
                        <Text>{stop.nameZhTw}</Text>
                    </Text>
                }).slice(firstStopItemIndex, firstStopItemIndex + (height - 2))
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
