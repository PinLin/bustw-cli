import React, { FC, useState } from 'react';
import Divider from 'ink-divider';
import { Tab, Tabs } from 'ink-tab';
import { SearchRoute } from './search-route';

export interface MainProps {
    onSelect?: ((city: string, routeId: string) => void);
    availableCities: string[];
    width: number;
    height: number;
}

export const Main: FC<MainProps> = (props) => {
    const [selectedTabName, setSelectedTabName] = useState('SearchRoute');

    return (
        <>
            <Divider width={props.width * 0.97} title={"Bus tracker for Taiwan 🇹🇼"} />
            <Tabs onChange={(name) => {
                setSelectedTabName(name);
            }}>
                <Tab name={'SearchRoute'}>{"路線搜尋"}</Tab>
                <Tab name={'Setting'}>{"設定"}</Tab>
            </Tabs>
            <Divider width={props.width * 0.97} title={''} />
            {
                selectedTabName == 'SearchRoute' &&
                <SearchRoute height={props.height - 3} availableCities={props.availableCities}
                    onSelect={props.onSelect}
                />
            }
        </>
    );
}
