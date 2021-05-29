import React, { FC } from 'react';
import { Text } from 'ink';
import Spinner from 'ink-spinner';

export const Loading: FC<{}> = () => {
    return (
        <>
            <Text>
                <Text color="green">
                    <Spinner type="dots" />
                </Text>
                {" Loading..."}
            </Text>
        </>
    );
}
