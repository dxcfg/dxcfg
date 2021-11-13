import { write, param } from '../../deps.ts'

// input is the the 'service' input parameter.
const input = await param.object('service');

// Our docker images are based on alpine
const baseImage = 'alpine:3.8';

// Dockerfile is a function generating a Dockerfile from a service object.
const Dockerfile = service => `FROM ${baseImage}

EXPOSE ${service.port}

COPY ${service.name} /
ENTRYPOINT /${service.name}
`;

await write(Dockerfile(input), 'Dockerfile');