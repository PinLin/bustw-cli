import { useReducer, useState } from 'react';

export enum SelectCityActionType {
    Initialize,
    CheckingVersion,
    DownloadingData,
    Finish,
}

export function useSelectCityState() {
    const [, forceUpdate] = useState({});

    const reducer = (stateMap: Map<string, {
        checkingVersion: boolean,
        downloadingData: boolean,
    }>, action: { type: SelectCityActionType, value: string | string[] }) => {
        if (action.type == SelectCityActionType.Initialize) {
            for (const city of action.value as string[]) {
                stateMap.set(city, {
                    checkingVersion: false,
                    downloadingData: false,
                });
            }
        } else {
            const city = action.value as string;
            stateMap.set(city, {
                checkingVersion: action.type == SelectCityActionType.CheckingVersion,
                downloadingData: action.type == SelectCityActionType.DownloadingData,
            });
        }
        forceUpdate({});
        return stateMap;
    }

    return useReducer(reducer, new Map());
}
