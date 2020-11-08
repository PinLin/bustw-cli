#!/usr/bin/env node
import 'reflect-metadata';
import fs from 'fs';
import os from 'os';
import React from 'react';
import { render } from 'ink';
import meow from 'meow';
import App from './ui';
import { createConnection } from 'typeorm';
import { DataVersion } from './entity/data-version';

const cli = meow(`
    Usage
      $ bustw-cli

    Options
        --name  Your name

    Examples
      $ bustw-cli --name=Jane
      Hello, Jane
`, {
    flags: {
        name: {
            type: 'string'
        }
    }
});

(async function main() {
    if (!fs.existsSync(`${os.homedir()}/.bustw-cli`)) {
        fs.mkdirSync(`${os.homedir()}/.bustw-cli`);
    }

    try {
        await createConnection({
            type: 'sqlite',
            database: `${os.homedir()}/.bustw-cli/data.db`,
            entities: [DataVersion],
            logging: false,
            synchronize: true,
        });
    } catch (error) {
        console.log(error);
    }

    render(<App name={cli.flags.name} />);
})()
