import { useReducer, useState } from 'react';

export enum SelectCityActionType {
    None,
    CheckingVersion,
    DownloadingData,
    SavingData,
}

export function useSelectCityState() {
    const [, forceUpdate] = useState({});

    const reducer = (stateMap: Map<string, SelectCityActionType>, action: {
        city: string
        state: SelectCityActionType,
    }) => {
        const { city, state } = action;
        if (state == SelectCityActionType.None) {
            stateMap.delete(city);
        } else {
            stateMap.set(city, state);
        }

        forceUpdate({});
        return stateMap;
    }

    const [state, dispatch] = useReducer(reducer, new Map());
    const setState = (city: string, state: SelectCityActionType) => {
        dispatch({ city, state });
    };

    return [state, setState] as [Map<string, SelectCityActionType>, (city: string, state: SelectCityActionType) => void];
}
