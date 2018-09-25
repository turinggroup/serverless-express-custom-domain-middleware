const chai = require('chai');
const customDomainReroute = require('../index').customDomainReroute;


describe('When not coming from API Gateway', function() {
  const req = {
    headers: {
      Authorization: 'some_key_here',
    },
    url: '/untouched_url',
    originalUrl: '/untouched_originalUrl',
  };

  it('Does not alter req.url or req.originalUrl', function(done) {
    customDomainReroute(req, {}, function() {
      chai.expect(req.url).to.equal('/untouched_url');
      chai.expect(req.originalUrl).to.equal('/untouched_originalUrl');
      done();
    });
  });
});


describe('When no path parameters', function() {
  const req = {
    headers: {
      'x-apigateway-event': encodeURIComponent(JSON.stringify({
        path: '/custom_map/some_path',
        pathParameters: null,
        resource: '/some_path',
      })),
    },
    url: '/custom_map/some_path',
    originalUrl: '/custom_map/some_path',
  };

  it('remove custom path prefix', function(done) {
    customDomainReroute(req, {}, function() {
      chai.expect(req.url).to.equal('/some_path');
      chai.expect(req.originalUrl).to.equal('/some_path');
      done();
    });
  });
});


describe('When there are path parameters', function() {
  const req = {
    headers: {
      'x-apigateway-event': encodeURIComponent(JSON.stringify({
        path: '/custom_map/id_01',
        pathParameters: { resource_id: 'id_01'},
        resource: '/{resource_id}',
      })),
    },
    url: '/custom_map/id_01',
    originalUrl: '/custom_map/id_01',
  };

  it('remove custom path prefix', function(done) {
    customDomainReroute(req, {}, function() {
      chai.expect(req.url).to.equal('/id_01');
      chai.expect(req.originalUrl).to.equal('/id_01');
      done();
    });
  });
});
