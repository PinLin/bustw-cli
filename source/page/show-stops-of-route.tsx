import React, { FC, useState } from 'react';
import { Text, useInput } from 'ink';
import { Tab, Tabs } from 'ink-tab';
import Divider from 'ink-divider';
import { BusRoute } from '../entity/bus-route';
import { BusStop } from '../entity/bus-stop';
import { getCityChineseName } from '../util/city';

export interface ShowStopsOfRouteProps {
    onExit?: () => void;
    route: BusRoute;
    width: number;
    height: number;
}

export const ShowStopsOfRoute: FC<ShowStopsOfRouteProps> = (props) => {
    const [subRouteTabIndex, setSubRouteTabIndex] = useState(0);
    const [firstStopItemIndex, setFirstStopItemIndex] = useState(0);

    const nowStops = JSON.parse(props.route.subRoutes[subRouteTabIndex].stopsJson) as BusStop[];

    useInput((input, key) => {
        if (key.downArrow && firstStopItemIndex + (props.height - 3) < nowStops.length) {
            setFirstStopItemIndex(firstStopItemIndex + 1);
        }
        if (key.upArrow && firstStopItemIndex > 0) {
            setFirstStopItemIndex(firstStopItemIndex - 1);
        }
        if (key.escape || input == 'q') {
            if (props.onExit) {
                props.onExit();
            }
        }
    });

    return (
        <>
            <Divider width={props.width * 0.97} title={`[${getCityChineseName(props.route.city)}] ${props.route.nameZhTw}`} />
            <Tabs onChange={(name) => {
                setSubRouteTabIndex(Number(name));
                setFirstStopItemIndex(0);
            }} children={props.route.subRoutes.map((subRoute, index) => {
                const stops = JSON.parse(subRoute.stopsJson) as BusStop[];
                return (
                    <Tab name={index.toString()}>{`往${stops[stops.length - 1].nameZhTw}`}</Tab>
                );
            })} />
            <Divider width={props.width * 0.97} title={''} />
            {
                nowStops.map((stop) => {
                    return (
                        <Text>
                            <Text color="gray">［ 載入中 ］</Text>
                            <Text>{stop.nameZhTw}</Text>
                        </Text>
                    );
                }).slice(firstStopItemIndex, firstStopItemIndex + (props.height - 3))
            }
        </>
    );
}
