import React, { FC, useState } from 'react';
import useStdoutDimensions from 'ink-use-stdout-dimensions';
import { getRepository } from 'typeorm';
import { BusInfo } from './entity/bus-info';
import { SelectAvailableCities } from './page/select-available-cities';
import { ShowStopsOfRoute } from './page/show-stops-of-route';
import { Loading } from './page/loading';
import { BusRoute } from './entity/bus-route';
import { Main } from './page/main';
import { getBusStopsByRouteName } from './service/api-service';
import { BusStopDetail } from './entity/bus-stop-detail';

enum AppState {
    Main,
    ShowStopsOfRoute,
    SelectAvailableCities,
}

const App: FC<{}> = () => {
    const [width, height] = useStdoutDimensions();
    const [appState, setAppState] = useState(AppState.Main);
    const [availableCities, setAvailableCities] = useState([] as string[]);
    const [targetCity, setTargetCity] = useState('');
    const [targetRouteName, setTargetRouteName] = useState('');
    const [targetRouteId, setTargetRouteId] = useState('');
    const [targetRoute, setTargetRoute] = useState(undefined as BusRoute);
    const [targetStopDetails, setTargetStopDetails] = useState(undefined as BusStopDetail[])

    const maxWidth = appState == AppState.ShowStopsOfRoute ? 80 : 160;

    let page = (<Loading />);
    if (appState == AppState.Main) {
        if (availableCities.length == 0) {
            (async () => {
                const cities = (await getRepository(BusInfo).find()).map(busInfo => busInfo.city);
                if (cities.length == 0) {
                    setAppState(AppState.SelectAvailableCities);
                } else {
                    setAvailableCities(cities);
                }
            })()
        } else {
            page = (
                <Main width={width < maxWidth ? width : maxWidth} height={height}
                    availableCities={availableCities}
                    onSelect={(city, routeName, routeId) => {
                        setTargetCity(city);
                        setTargetRouteName(routeName);
                        setTargetRouteId(routeId);
                        setAppState(AppState.ShowStopsOfRoute);
                    }}
                    onGoToSelectAvailableCities={() => {
                        setAppState(AppState.SelectAvailableCities);
                    }}
                />
            );
        }
    }
    if (appState == AppState.ShowStopsOfRoute) {
        if (!targetRoute) {
            getRepository(BusRoute).findOne(targetRouteId, {
                relations: ['subRoutes'],
            }).then(route => setTargetRoute(route));
            getBusStopsByRouteName(targetCity, targetRouteName).then(data => setTargetStopDetails(data.stops));
        } else {
            page = (
                <ShowStopsOfRoute width={width < maxWidth ? width : maxWidth} height={height}
                    route={targetRoute} stopDetails={targetStopDetails}
                    onExit={() => {
                        setAppState(AppState.Main);
                        setTargetRoute(undefined);
                        setTargetStopDetails(undefined);
                    }}
                />
            );
        }
    }
    if (appState == AppState.SelectAvailableCities) {
        page = (
            <SelectAvailableCities previousSelectedCities={availableCities}
                onSelect={(selectedCities) => {
                    setAvailableCities(selectedCities);
                    setAppState(AppState.Main);
                }}
                onExit={() => {
                    setAppState(AppState.Main);
                }}
            />
        );
    }

    return (
        <>
            {page}
        </>
    );
};

module.exports = App;
export default App;
