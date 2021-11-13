import { write } from 'https://deno.land/x/dxcfg@v0.0.3/mod.ts'
import { Dockerfile } from './docker.js';

const myService = {
    name: 'my-service',
    port: 80,
};

write(Dockerfile(myService), 'Dockerfile');

