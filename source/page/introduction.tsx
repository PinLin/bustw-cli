import React, { FC } from 'react';
import { Newline, Text } from 'ink';

export const Introduction: FC<{}> = () => {
    return (
        <>
            <Text bold>Bus tracker for Taiwan 🇹🇼</Text>
            <Newline />
        </>
    );
}
