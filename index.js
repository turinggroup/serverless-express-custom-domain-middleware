module.exports = {
  customDomainReroute: setup({ logger: console.log });
  setup,
};

function setup(opts = {}) {
  return function routerMiddleware(req, res, next) {
    if (!!req.headers['x-apigateway-event']) {
      const event = JSON.parse(decodeURIComponent(req.headers['x-apigateway-event']));
      const params = event.pathParameters || {};

      const replace_params = (acc, k) => {
        if (k == 'proxy') {
          return acc.replace('{proxy+}', params[k])
        } else {
          return acc.replace('{' + k + '}', params[k])
        }
      }

      let interpolated_resource = Object.keys(params)
        .reduce(replace_params, event.resource);

      //covers trailing slash cornercase, since trailing slashes are not returned in event.resource .
      if (event.path.endsWith('/') && !interpolated_resource.endsWith('/')) {
        interpolated_resource = `${interpolated_resource}/`;
      }

      if ((!!event.path && !!interpolated_resource) && event.path != interpolated_resource) {
        req.url = req.originalUrl = interpolated_resource;
        if (opts.logger && typeof opts.logger === 'function') {
          opts.logger(`rerouted ${event.path} -> ${interpolated_resource}`);
        }
      }
    }
    next();
  }
}
