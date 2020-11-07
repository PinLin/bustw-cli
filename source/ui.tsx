import React, { FC } from 'react';
import { SelectCity } from './page/select-city';

const App: FC<{ name?: string }> = ({ name = 'Stranger' }) => (
    <SelectCity />
);

module.exports = App;
export default App;
