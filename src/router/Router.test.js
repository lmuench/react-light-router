import React from 'react';
import ReactDOM from 'react-dom';
import Router from './Router.js';
import utils from './RouterUtils';
import should from 'should';

describe('getRouteForPath()', () => {
  const routes = [
    {
      path: '/hello/:first/:last',
      component: {},
      propsFromPath: [
        { prop: 'first', segment: ':first' },
        { prop: 'last', segment: ':last' }
      ]
    },
    {
      path: '/ticker/<symbol>/price',
      component: {},
      propsFromPath: [
        { prop: 'symbol', segment: '<symbol>' }
      ]
    }
  ]

  const defaultRoute = {
    component: {}
  }

  const correctBrowserPathsA = [
    '#/hello/peter/piper',
    '#/hello/peter/piper/foo',
    '#/hello/peter/piper?foo=bar',
    '#/hello/peter/piper?foo=bar&bar=foo',
    '#/hello/peter/piper/?foo=bar&bar=foo'
  ].map(path => utils.extractSegments(path));

  const correctBrowserPathsB = [
    '#/ticker/BTCUSDT/price',
    '#/ticker/BTCUSDT/price/',
    '#/ticker/BTCUSDT/price//',
    '#/ticker/BTCUSDT/price/change'
  ].map(path => utils.extractSegments(path));

  const incorrectBrowserPathsA = [
    '#/hello/peter//piper',
    '#/hello/peter/',
    '#/hello/peter',
    '#/hello/',
    '#/',
    '#hello/peter/piper/foo',
  ].map(path => utils.extractSegments(path));

  const incorrectBrowserPathsB = [
    '#/ticker/v2/BTCUSDT/price',
    '#/ticker/BTCUSDT/v2/price',
    '#/ticker/BTCUSDT/volume',
    '#/ticker/price/BTCUSDT',
    '#/ticker/price'
  ].map(path => utils.extractSegments(path));


  it('should get the route for a given path', () => {
    const router = new Router();

    correctBrowserPathsA.forEach(browserPath => {
      const route = router.getRouteForPath(routes, browserPath);
      route.should.deepEqual(routes[0]);
    });
    
    correctBrowserPathsB.forEach(browserPath => {
      const route = router.getRouteForPath(routes, browserPath);
      route.should.deepEqual(routes[1]);
    });
  });

  it('should not return any route for an incorrect path', () => {
    const router = new Router();

    incorrectBrowserPathsA.forEach(browserPath => {
      const route = router.getRouteForPath(routes, browserPath);
      should.equal(route, null);
    });

    incorrectBrowserPathsB.forEach(browserPath => {
      const route = router.getRouteForPath(routes, browserPath);
      should.equal(route, null);
    });
  });
});