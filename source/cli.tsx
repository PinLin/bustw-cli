#!/usr/bin/env node
import 'reflect-metadata';
import fs from 'fs';
import os from 'os';
import React from 'react';
import { render } from 'ink';
import meow from 'meow';
import App from './ui';
import { createConnection } from 'typeorm';
import { BusInfo } from './entity/bus-info';
import { BusRoute } from './entity/bus-route';
import { BusSubRoute } from './entity/bus-sub-route';

const cli = meow(`
    Usage
      $ bustw
`);

(async function main() {
    if (!fs.existsSync(`${os.homedir()}/.bustw-cli`)) {
        fs.mkdirSync(`${os.homedir()}/.bustw-cli`);
    }

    try {
        await createConnection({
            type: 'sqlite',
            database: `${os.homedir()}/.bustw-cli/data.db`,
            entities: [
                BusInfo, BusRoute, BusSubRoute,
            ],
            logging: false,
            synchronize: true,
        });
    } catch (error) {
        console.log(error);
    }

    render(<App />);
})()
