export const environment = {
  production: false,
  baseUrl: 'http://localhost:8081/api/v1',
  iamPath: '/authentication',
  tripsEndpointPath: '/trips',
  deliveryOrdersEndpointPath: '/delivery-orders',
  alertsEndpointPath: '/alerts',
  profileEndpointPath: '/profiles',
  googleMapsApiKey: 'AIzaSyDEpu21mrXEAewZHnvMxOfR3Nj3VLZLECk',
} as const;
