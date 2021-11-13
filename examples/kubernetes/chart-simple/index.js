import { generateChart, param, write } from '../../deps.ts';

import resources from './resources.js';

const defaults = {
  name: 'helloworld',
  app: 'hello',
  image: {
    repository: 'weaveworks/helloworld',
    tag: 'v1',
  },
};

const chart = await generateChart(resources, defaults, param);
await write(chart, 'chart.yaml')