function copy(obj) {
  return () => {
    // we can assume only valid JSON, so this works as a "deep copy"
    return JSON.parse(JSON.stringify(obj));
  }
}

const noGateway = {
  headers: {
    Authorization: 'some_key_here',
  },
  url: '/untouched_url',
  originalUrl: '/untouched_originalUrl',
};

const noParam = {
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

const withParam = {
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


module.exports = {
  noGateway: copy(noGateway),
  withParam: copy(withParam),
  noParam: copy(noParam),
}
