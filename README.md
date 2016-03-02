# Crazy-Loading
A ECMAScript 6 Library for lazy loading of classes using promises, lazy function calls using proxies and promises and such stuff

This works currently only in Firefox 45 and Edge 13

# Classes & Methods

## ProxyPromise

These classes are generated using the createProxyPromise function. The global Promise object is automatically replced
by a ProxyPromise class. ProxyPromise classes are wrapper classes which allow wrapping Objects into Proxies ant let them
behave like Promise objects. Any method availabal to Promise objects are also available on ProxyPromise objects. Any promise returned by such a method is of the same ProxyPromise object type.

### createProxyPromise( handler, overlayFactory )
* handler: behaves like the handler of a Proxy object, exept for default methods of Promises which maintain default behavour.
* overlayFactory: optional, a callback function which takes a Promise object and returns the target object for the Proxy.

## MethodProxyPromise

## ClassTreeLoader

## JavaScript

## ProcessLoader

## URILoader
