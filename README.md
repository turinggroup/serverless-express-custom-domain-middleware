# Serverless Express Custom Domain Middleware

install
```
npm install @turinggroup/serverless-express-custom-domain-middleware
```
usage
```
const customDomainReroute = require('@turinggroup/serverless-express-custom-domain-middleware').customDomainReroute;

app.use(customDomainReroute);
```


to call custom function when path is rerouted
```
const customDomainReroute = require('@turinggroup/serverless-express-custom-domain-middleware');
const rerouter = customDomainReroute.setup({
  onRouted: (originalPath, routedPath) => {
    // do something here
  }
});

app.use(rerouter);
```
