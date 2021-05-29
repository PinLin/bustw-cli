import { useReducer, useState } from 'react';

export enum SelectCityState {
    None,
    CheckingVersion,
    DownloadingData,
    SavingData,
}

export function useSelectCityState() {
    // 因為 useReducer 的 state 更新時畫面不會更新，所以建立一個無意義的
    // useState，在需要更新畫面時呼叫他的 setState 來強制更新畫面。
    const [, forceUpdate] = useState({});

    const reducer = (stateMap: Map<string, SelectCityState>, action: {
        city: string
        state: SelectCityState,
    }) => {
        const { city, state } = action;
        if (state == SelectCityState.None) {
            stateMap.delete(city);
        } else {
            stateMap.set(city, state);
        }

        forceUpdate({});
        return stateMap;
    }
    const [state, dispatch] = useReducer(reducer, new Map());
    const setState = (city: string, state: SelectCityState) => {
        dispatch({ city, state });
    };

    return [state, setState] as [Map<string, SelectCityState>, (city: string, state: SelectCityState) => void];
}
