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
  describe('Where there is invalid input', function() {
    it('does not thow an error if onRouted is not a function', function() {
      const middleware = rerouter.setup({ onRouted: 'notafunction' });
      chai.expect(() => middleware(reqs.withParam(), {}, noop)).not.to.throw();
    });

    it('does not throw an error if nothing is passed in', function() {
      const middleware = rerouter.setup({});
      chai.expect(() => middleware(reqs.withParam(), {}, noop)).not.to.throw();
    });
  });

  describe('With a function passed in', function() {
    let middleware;
    let config;
    beforeEach(() => {
      config = { onRouted: () => null };
      middleware = rerouter.setup(config);
      chai.spy.on(config, 'onRouted');
    });

    it('calls onRouted with original and new paths', function() {
      middleware(reqs.withParam(), {}, noop);
      chai.expect(config.onRouted).to.have.been.called.with.exactly('/custom_map/id_01', '/id_01');
    });

    it('calls onRouted function only once', function() {
      middleware(reqs.withParam(), {}, noop);
      chai.expect(config.onRouted).to.have.been.called.once;
    });
  });
});
