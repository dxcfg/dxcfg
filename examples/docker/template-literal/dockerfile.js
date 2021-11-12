import { write } from 'https://deno.land/x/dxcfg/mod.ts'
import { Dockerfile } from './docker.js';

const myService = {
    name: 'my-service',
    port: 80,
};

write(Dockerfile(myService), 'Dockerfile');

