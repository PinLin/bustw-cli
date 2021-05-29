import React, { FC, useState } from 'react';
import { Box } from 'ink';
import useStdoutDimensions from 'ink-use-stdout-dimensions';
import { getRepository } from 'typeorm';
import { SelectCity } from './page/select-city';
import { SearchRoute } from './page/search-route';
import { Loading } from './page/loading';
import { BusInfo } from './entity/bus-info';

enum AppState {
    None,
    SelectCity,
    SearchRoute,
}

const App: FC<{ name?: string }> = ({ name = 'Stranger' }) => {
    const [columns, rows] = useStdoutDimensions();
    const [appState, setAppState] = useState(AppState.None);
    const [availableCities, setAvailableCities] = useState([] as string[]);

    let page = <Loading />
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
            console.log(`${city} ${routeId}`)
        }} />
    }

    return <Box width={columns} height={rows} flexDirection="column">
        {page}
    </Box>
};

module.exports = App;
export default App;
