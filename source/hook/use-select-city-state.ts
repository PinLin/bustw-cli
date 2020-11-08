import { useReducer, useState } from 'react';

export enum SelectCityActionType {
    None,
    CheckingVersion,
    DownloadingData,
    SavingData,
    DeletingData,
}

export function useSelectCityState() {
    // 因為 useReducer 的 state 更新時畫面不會更新，所以建立一個無意義的
    // useState，在需要更新畫面時呼叫他的 setState 來強制更新畫面。
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
