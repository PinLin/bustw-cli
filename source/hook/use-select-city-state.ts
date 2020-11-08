import { useReducer, useState } from 'react';

export enum SelectCityActionType {
    None,
    CheckingVersion,
    DownloadingData,
}

export function useSelectCityState() {
    const [, forceUpdate] = useState({});

    const reducer = (stateMap: Map<string, SelectCityActionType>, action: { type: SelectCityActionType, value: string }) => {
        const city = action.value as string;
        const state = action.type;

        if (action.type == SelectCityActionType.None) {
            stateMap.delete(city);
        } else {
            stateMap.set(city, state);
        }

        forceUpdate({});
        return stateMap;
    }

    return useReducer(reducer, new Map());
}
