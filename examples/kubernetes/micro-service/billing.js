const billing = {
  name: 'billing',
  description: 'Provides the /api/billing endpoints for frontend.',
  maintainer: 'damien@weave.works',
  namespace: 'billing',
  port: 80,
  image: 'quay.io/acmecorp/billing:master-fd986f62',
  ingress: {
    path: '/api/billing',
  },
  dashboards: [
    'service.RPS.HTTP',
  ],
  alerts: [
    'service.RPS.HTTP.HighErrorRate',
  ],
};

export default billing;