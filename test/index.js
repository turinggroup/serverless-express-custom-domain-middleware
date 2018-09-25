const chai = require('chai');
const spies = require('chai-spies');
chai.use(spies);
const reqs = require('./helper');
const rerouter = require('../index');
const customDomainReroute = rerouter.setup();


describe('When not coming from API Gateway', function() {
  it('Does not alter req.url or req.originalUrl', function(done) {
    const req = reqs.noGateway();
    customDomainReroute(req, {}, function() {
      chai.expect(req.url).to.equal('/untouched_url');
      chai.expect(req.originalUrl).to.equal('/untouched_originalUrl');
      done();
    });
  });
});


describe('When no path parameters', function() {
  const req = reqs.noParam();

  it('remove custom path prefix', function(done) {
    customDomainReroute(req, {}, function() {
      chai.expect(req.url).to.equal('/some_path');
      chai.expect(req.originalUrl).to.equal('/some_path');
      done();
    });
  });
});


describe('When there are path parameters', function() {
  const req = reqs.withParam();

  it('remove custom path prefix', function(done) {
    customDomainReroute(req, {}, function() {
      chai.expect(req.url).to.equal('/id_01');
      chai.expect(req.originalUrl).to.equal('/id_01');
      done();
    });
  });
});

describe('Custom notifier', function() {
  const noop = () => null;
  it('does not thow error if onRouted is not a function', function() {
    const middleware = rerouter.setup({ onRouted: 'notafunction' });
    chai.expect(() => middleware(reqs.withParam(), {}, noop)).not.to.throw();
  });

  it('calls onRouted function', function() {
    const spy = chai.spy(() => null);
    const middleware = rerouter.setup({
      onRouted: spy,
    });
    middleware(reqs.withParam(), {}, noop);
    chai.expect(spy).to.have.been.called.once;
  });
});
