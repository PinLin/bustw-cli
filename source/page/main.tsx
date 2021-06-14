import React, { FC, useState } from 'react';
import { Text } from 'ink';
import Divider from 'ink-divider';
import { Tab, Tabs } from 'ink-tab';
import { SearchRoute } from './search-route';
import { Setting } from './setting';

export interface MainProps {
    onGoToSelectAvailableCities?: () => void;
    onSelect?: ((city: string, routeName: string, routeId: string) => void);
    availableCities: string[];
    width: number;
    height: number;
}

export const Main: FC<MainProps> = (props) => {
    const [selectedTabName, setSelectedTabName] = useState('SearchRoute');

    return (
        <>
            <Divider width={props.width * 0.98} title={"Bus tracker for Taiwan 🇹🇼"} />
            <Tabs keyMap={{ previous: [], next: [] }}
                onChange={(name) => { setSelectedTabName(name); }}
            >
                <Tab name={'SearchRoute'}>路線搜尋</Tab>
                <Tab name={'Setting'}>
                    <Text>
                        <Text>設定</Text>
                        <Text color="gray">（按 Tab 切換）</Text>
                    </Text>
                </Tab>
            </Tabs>
            <Divider width={props.width * 0.97} title={''} />
            {
                selectedTabName == 'SearchRoute' &&
                <SearchRoute height={props.height - 3} availableCities={props.availableCities}
                    onSelect={props.onSelect}
                />
            }
            {
                selectedTabName == 'Setting' &&
                <Setting onGoToSelectAvailableCities={props.onGoToSelectAvailableCities} />
            }
        </>
    );
}
