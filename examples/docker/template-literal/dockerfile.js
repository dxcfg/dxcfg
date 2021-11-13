import { write } from 'https://deno.land/x/dxcfg@v0.0.4/mod.ts'
import { Dockerfile } from './docker.js';

const myService = {
    name: 'my-service',
    port: 80,
};

await write(Dockerfile(myService), 'Dockerfile');

