
module.exports.customDomainReroute = (req,res,next) => {
    if (!! req.headers['x-apigateway-event']){
        const event = JSON.parse(decodeURIComponent(req.headers['x-apigateway-event']));
        const params = event.pathParameters || {};
   
        let interpolated_resource = Object.keys(params)
            .reduce((acc, k) => acc.replace('{'+k+'}', params[k]), event.resource)
        
        if ((!! event.path && !! interpolated_resource) && event.path != interpolated_resource){
            req.url = req.originalUrl = interpolated_resource;
            console.log(`rerouted ${event.path} -> ${interpolated_resource}`);
        }
    }
    next()
}