import React, { FC, useState } from 'react';
import { Text, useInput } from 'ink';
import { Tab, Tabs } from 'ink-tab';
import Divider from 'ink-divider';
import { BusRoute } from '../entity/bus-route';
import { BusStop } from '../entity/bus-stop';
import { getCityChineseName } from '../util/city';
import { BusStopDetail } from '../entity/bus-stop-detail';

export interface ShowStopsOfRouteProps {
    onExit?: () => void;
    route: BusRoute;
    stopDetails: BusStopDetail[];
    width: number;
    height: number;
}

export const ShowStopsOfRoute: FC<ShowStopsOfRouteProps> = (props) => {
    const [subRouteTabIndex, setSubRouteTabIndex] = useState(0);
    const [firstStopItemIndex, setFirstStopItemIndex] = useState(0);

    const stopsMap = {} as { [sequence: number]: BusStop[] };
    JSON.parse(props.route.subRoutes[subRouteTabIndex].stopsJson).map((stop: BusStop) => {
        if (!stopsMap[stop.sequence]) {
            stopsMap[stop.sequence] = [];
        }
        stopsMap[stop.sequence].push(stop);
    });

    useInput((input, key) => {
        if (key.downArrow && firstStopItemIndex + (props.height - 5) < Object.keys(stopsMap).length) {
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

    const stopItems = Object.entries(stopsMap).sort(([sequenceA,], [sequenceB,]) => (Number(sequenceA) - Number(sequenceB)))
        .map(([_, stops]) => (
            <Text>
                <Text color="gray">［ 載入中 ］</Text>
                <Text>{stops[0].nameZhTw}</Text>
            </Text>
        )).slice(firstStopItemIndex, firstStopItemIndex + (props.height - 5));

    return (
        <>
            <Divider width={props.width * 0.97} title={`[${getCityChineseName(props.route.city)}] ${props.route.nameZhTw}`} />
            <Tabs
                onChange={(name) => {
                    setSubRouteTabIndex(Number(name));
                    setFirstStopItemIndex(0);
                }}
                children={props.route.subRoutes.map((subRoute, index) => {
                    const stops = JSON.parse(subRoute.stopsJson) as BusStop[];
                    if (subRoute.direction == 1) {
                        return (
                            <Tab name={index.toString()}>{`往${props.route.departureStopNameZhTw || stops[stops.length - 1].nameZhTw}`}</Tab>
                        );
                    } else {
                        return (
                            <Tab name={index.toString()}>{`往${props.route.destinationStopNameZhTw || stops[stops.length - 1].nameZhTw}`}</Tab>
                        );
                    }
                })}
            />
            <Divider width={props.width * 0.97} title={''} />
            {stopItems}
        </>
    );
}
