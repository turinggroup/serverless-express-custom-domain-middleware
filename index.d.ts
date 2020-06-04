declare module '@turinggroup/serverless-express-custom-domain-middleware' {
    import { NextHandleFunction } from 'connect';

    interface SetupOpts {
        onRouted: (orig: string, interpolated: string) => void;
    }

    export const customDomainReroute: NextHandleFunction;
    export const setup: ((opts?: SetupOpts) => NextHandleFunction)
}
