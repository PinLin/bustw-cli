import React, { FC, useState } from 'react';
import { Box } from 'ink';
import useStdoutDimensions from 'ink-use-stdout-dimensions';
import { getRepository } from 'typeorm';
import { BusInfo } from './entity/bus-info';
import { SelectAvailableCities } from './page/select-available-cities';
import { ShowStopsOfRoute } from './page/show-stops-of-route';
import { Loading } from './page/loading';
import { BusRoute } from './entity/bus-route';
import { Main } from './page/main';

enum AppState {
    Main,
    ShowStopsOfRoute,
    SelectAvailableCities,
}

const App: FC<{ name?: string }> = ({ name = 'Stranger' }) => {
    const [width, height] = useStdoutDimensions();
    const [appState, setAppState] = useState(AppState.Main);
    const [availableCities, setAvailableCities] = useState([] as string[]);
    const [targetCity, setTargetCity] = useState('');
    const [targetRouteId, setTargetRouteId] = useState('');
    const [targetRoute, setTargetRoute] = useState(null as BusRoute);

    const maxWidth = 80;

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
                    availableCities={availableCities} onSelect={(city, routeId) => {
                        setTargetCity(city);
                        setTargetRouteId(routeId);
                        setAppState(AppState.ShowStopsOfRoute);
                    }} />
            );
        }
    }
    if (appState == AppState.ShowStopsOfRoute) {
        if (!targetRoute) {
            (async () => {
                setTargetRoute(await getRepository(BusRoute).findOne(targetRouteId, {
                    relations: ['subRoutes'],
                }));
            })()
        } else {
            page = (
                <ShowStopsOfRoute width={width < maxWidth ? width : maxWidth} height={height}
                    route={targetRoute} onExit={() => {
                        setAppState(AppState.Main);
                        setTargetRoute(null);
                    }} />
            );
        }
    }
    if (appState == AppState.SelectAvailableCities) {
        page = (
            <SelectAvailableCities previousSelectedCities={availableCities} onSelect={(selectedCities) => {
                setAvailableCities(selectedCities);
                setAppState(AppState.Main);
            }} onExit={() => {
                setAppState(AppState.Main);
            }} />
        );
    }

    return (
        <Box width={width < maxWidth ? width : maxWidth} height={height} flexDirection="column">
            {page}
        </Box>
    );
};

module.exports = App;
export default App;
