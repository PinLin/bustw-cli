import React, { FC } from 'react';
import { Introduction } from './page/introduction';

const App: FC<{ name?: string }> = ({ name = 'Stranger' }) => (
    <Introduction />
);

module.exports = App;
export default App;
