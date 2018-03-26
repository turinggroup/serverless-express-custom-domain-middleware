

module.exports.customDomainReroute = (req,res,next) => {
    if (!! req.headers['x-apigateway-event']){
        const event = JSON.parse(decodeURIComponent(req.headers['x-apigateway-event']));
        const params = event.pathParameters || {};
   

        const replace_params = (acc, k) => {
            if (k =='proxy'){
                return acc.replace('{proxy+}', params[k])
            }
            else {
                return acc.replace('{'+k+'}', params[k])
            }
        }


        let interpolated_resource = Object.keys(params)
            .reduce(replace_params, event.resource)
        
        if ((!! event.path && !! interpolated_resource) && event.path != interpolated_resource){
            req.url = req.originalUrl = interpolated_resource;
            console.log(`rerouted ${event.path} -> ${interpolated_resource}`);
        }
    }
    next()
}