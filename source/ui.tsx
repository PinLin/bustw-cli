import React, { FC, useState } from 'react';
import { Text, Box } from 'ink';
import useStdoutDimensions from 'ink-use-stdout-dimensions';
import { getRepository } from 'typeorm';
import { BusInfo } from './entity/bus-info';
import { SelectAvailableCities } from './page/select-available-cities';
import { SearchRoute } from './page/search-route';
import { ShowStopsOfRoute } from './page/show-stops-of-route';

enum AppState {
    None,
    SelectAvailableCities,
    SearchRoute,
    ShowStopsOfRoute,
}

const App: FC<{ name?: string }> = ({ name = 'Stranger' }) => {
    const [width, height] = useStdoutDimensions();
    const [appState, setAppState] = useState(AppState.None);
    const [availableCities, setAvailableCities] = useState([] as string[]);
    const [targetCity, setTargetCity] = useState('');
    const [targetRouteId, setTargetRouteId] = useState('');

    let page = <Text />
    if (appState == AppState.None) {
        (async () => {
            setAvailableCities((await getRepository(BusInfo).find()).map(busInfo => busInfo.city));
            if (availableCities.length > 0) {
                setAppState(AppState.SearchRoute);
            } else {
                setAppState(AppState.SelectAvailableCities);
            }
        })()
    }
    if (appState == AppState.SelectAvailableCities) {
        page = <SelectAvailableCities previousSelectedCities={availableCities} onSelected={(selectedCities) => {
            setAvailableCities(selectedCities);
            setAppState(AppState.SearchRoute);
        }} />
    }
    if (appState == AppState.SearchRoute) {
        page = <SearchRoute availableCities={availableCities} onSelected={(city, routeId) => {
            setTargetCity(city);
            setTargetRouteId(routeId);
            setAppState(AppState.ShowStopsOfRoute);
        }} />
    }
    if (appState == AppState.ShowStopsOfRoute) {
        page = <ShowStopsOfRoute city={targetCity} routeId={targetRouteId}
            onExit={() => {
                setAppState(AppState.SearchRoute);
            }} />
    }

    return <Box width={width} height={height} flexDirection="column">
        {page}
    </Box>
};

module.exports = App;
export default App;
