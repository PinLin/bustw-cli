import React, { FC } from 'react';
import { Box, Text } from 'ink';
import { Props } from 'ink/build/components/Text';

export interface StopItemProps extends Props {
    estimateTimeText: string;
    name: string;
    key?: React.Key;
    width: number;
}

export const StopItem: FC<StopItemProps> = (props) => {
    return (
        <Box width={props.width} key={props.key}>
            <Text>  </Text>
            <Text
                color={props.color} backgroundColor={props.backgroundColor}
            >
                {props.estimateTimeText}
            </Text>
            <Text>  </Text>
            <Text>{props.name}</Text>
        </Box>
    );
}
