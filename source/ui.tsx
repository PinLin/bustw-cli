import React, { FC } from 'react';
import { SelectCity } from './page/select-city';

const App: FC<{ name?: string }> = ({ name = 'Stranger' }) => (
    <SelectCity onSuccess={() => { console.log("好！") }} />
);

module.exports = App;
export default App;
