import React, { FC, useState } from 'react';
import { Text, Box } from 'ink';
import useStdoutDimensions from 'ink-use-stdout-dimensions';
import { getRepository } from 'typeorm';
import { BusInfo } from './entity/bus-info';
import { SelectCity } from './page/select-city';
import { SearchRoute } from './page/search-route';
import { ShowStopsAndTime } from './page/show-stops-and-time';

enum AppState {
    None,
    SelectCity,
    SearchRoute,
    ShowStopsAndTime,
}

const App: FC<{ name?: string }> = ({ name = 'Stranger' }) => {
    const [columns, rows] = useStdoutDimensions();
    const [appState, setAppState] = useState(AppState.None);
    const [availableCities, setAvailableCities] = useState([] as string[]);
    const [selectedCity, setSelectedCity] = useState('');
    const [selectedRouteId, setSelectedRouteId] = useState('');

    let page = <Text />
    if (appState == AppState.None) {
        (async () => {
            setAvailableCities((await getRepository(BusInfo).find()).map(busInfo => busInfo.city));
            if (availableCities.length > 0) {
                setAppState(AppState.SearchRoute);
            } else {
                setAppState(AppState.SelectCity);
            }
        })()
    }
    if (appState == AppState.SelectCity) {
        page = <SelectCity availableCities={availableCities} onSuccess={(selectedCities) => {
            setAvailableCities(selectedCities);
            setAppState(AppState.SearchRoute);
        }} />
    }
    if (appState == AppState.SearchRoute) {
        page = <SearchRoute availableCities={availableCities} onSuccess={(city, routeId) => {
            setSelectedCity(city);
            setSelectedRouteId(routeId);
            setAppState(AppState.ShowStopsAndTime);
        }} />
    }
    if (appState == AppState.ShowStopsAndTime) {
        page = <ShowStopsAndTime city={selectedCity} routeId={selectedRouteId} />
    }

    return <Box width={columns} height={rows} flexDirection="column">
        {page}
    </Box>
};

module.exports = App;
export default App;
