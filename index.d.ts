declare module '@turinggroup/serverless-express-custom-domain-middleware' {
    import { NextHandleFunction } from 'connect';

    export const customDomainReroute: NextHandleFunction;
}
