import React, { FC, useState } from 'react';
import { useInput } from 'ink';
import { Tab, Tabs } from 'ink-tab';
import Divider from 'ink-divider';
import { BusRoute } from '../entity/bus-route';
import { BusStop } from '../entity/bus-stop';
import { getCityChineseName } from '../util/city';
import { BusStopDetail } from '../entity/bus-stop-detail';
import { StopItem } from './components/stop-item';

export interface ShowStopsOfRouteProps {
    onExit?: () => void;
    route: BusRoute;
    stopDetails?: BusStopDetail[];
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
        if (key.escape || input == 'q' || input == 'Q') {
            if (props.onExit) {
                props.onExit();
            }
        }
    });

    const stopItems = Object.entries(stopsMap).sort(([sequenceA,], [sequenceB,]) => (Number(sequenceA) - Number(sequenceB)))
        .map(([sequence, stops]) => {
            const stopDetails = props.stopDetails?.filter(sd => stops.map(s => s.id).includes(sd.id))
                .filter(sd => sd.subRouteId == props.route.subRoutes[subRouteTabIndex].id);

            if (stopDetails?.map(sd => sd.status).includes(0)) {
                const estimateTimes = stopDetails.map(sd => sd.estimateTime).filter(t => t > 0).sort((a, b) => (b - a));
                if (estimateTimes.length == 0) {
                    return (
                        <StopItem
                            width={props.width} key={sequence}
                            color="black" backgroundColor="white"
                            estimateTimeText={"[ 未發車 ]"} name={stops[0].nameZhTw}
                        />
                    );
                } else {
                    const estimateTimeByMinutes = Math.floor(estimateTimes[0] / 60);
                    if (estimateTimeByMinutes > 2) {
                        return (
                            <StopItem
                                width={props.width} key={sequence}
                                backgroundColor="blue" name={stops[0].nameZhTw}
                                estimateTimeText={`[ ${estimateTimeByMinutes.toString().padStart(3, ' ')} 分 ]`}
                            />
                        );
                    } else {
                        return (
                            <StopItem
                                width={props.width} key={sequence}
                                backgroundColor="magenta" name={stops[0].nameZhTw}
                                estimateTimeText={`[ ${estimateTimeByMinutes.toString().padStart(3, ' ')} 分 ]`}
                            />
                        );
                    }
                }
            }
            if (stopDetails?.map(sd => sd.status).includes(1)) {
                return (
                    <StopItem
                        width={props.width} key={sequence}
                        color="black" backgroundColor="white"
                        estimateTimeText={"[ 未發車 ]"} name={stops[0].nameZhTw}
                    />
                );
            }
            if (stopDetails?.map(sd => sd.status).includes(2)) {
                return (
                    <StopItem
                        width={props.width} key={sequence}
                        color="black" backgroundColor="yellow"
                        estimateTimeText={"[交管不停]"} name={stops[0].nameZhTw}
                    />
                );
            }
            if (stopDetails?.map(sd => sd.status).includes(3)) {
                return (
                    <StopItem
                        width={props.width} key={sequence}
                        color="black" backgroundColor="white"
                        estimateTimeText={"[末班駛離]"} name={stops[0].nameZhTw}
                    />
                );
            }
            if (stopDetails?.map(sd => sd.status).includes(4)) {
                return (
                    <StopItem
                        width={props.width} key={sequence}
                        color="black" backgroundColor="white"
                        estimateTimeText={"[今日不開]"} name={stops[0].nameZhTw}
                    />
                );
            }
            return (
                <StopItem
                    width={props.width} key={sequence}
                    color="gray"
                    estimateTimeText={"[ 載入中 ]"} name={stops[0].nameZhTw}
                />
            );
        }).slice(firstStopItemIndex, firstStopItemIndex + (props.height - 5));

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
