import React, { FC } from 'react';
import { Box } from 'ink';
import useStdoutDimensions from 'ink-use-stdout-dimensions';
import { SelectCity } from './page/select-city';
import { SearchRoute } from './page/search-route';

const App: FC<{ name?: string }> = ({ name = 'Stranger' }) => {
    const [columns, rows] = useStdoutDimensions();

    return <Box width={columns} height={rows} flexDirection="column">
        {/* <SelectCity onSuccess={() => { console.log("好！") }} /> */}
        <SearchRoute onSuccess={(routeId) => { console.log(`要查看路線：${routeId}`) }} />
    </Box>
};

module.exports = App;
export default App;
