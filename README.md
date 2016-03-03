# Crazy-Loading
A ECMAScript 6 Library for lazy loading of classes using promises, lazy function calls using proxies and promises and such stuff

This works currently only in Firefox 45 and Edge 13

# Classes & Methods

## ProxyPromise( executor )
These classes are generated using the createProxyPromise function. The global Promise object is automatically replaced
by a ProxyPromise class. ProxyPromise classes are wrapper classes which allow wrapping Objects into Proxies and let them
behave like Promise objects. Any method available to Promise objects are also available on ProxyPromise objects. Any promise returned by such a method is of the same ProxyPromise object type.

### Globals

#### createProxyPromise( handler, overlayFactory )
Creates a ProxyPromise object
* handler: behaves like the handler of a Proxy object, except for default methods of Promises which maintain default behaviour.
* overlayFactory: optional, a callback function which takes a Promise object and returns the target object for the Proxy.

### Static Methods

#### proxify( promise )
Wraps a Promise object into a ProxyPromise object.


## MethodProxyPromise( executor )
A ProxyPromise class which returns a MethodProxyPromise whenever you try to get a property which isn't defined on a Promise object. The returned Promise resolves the property value when the containing MethodProxyPromise is resolved. A MethodProxyPromise is a function too. When used as a Function, a new Promise is returned and once the MethodProxyPromise and all Promises passed as Arguments are resolved, the object resolved by the MethodProxyPromise will be treated as a function and all resolved arguments are passed to that function. The returned MethodProxyPromise is resolved using the returned object of that function.

## ClassTreeLoader( path, loader )
This class is a Function wrapped in a Proxy object. Each property returned by a ClassTreeLoader which isn't defined by the wrapped Function object is a ClassTreeLoader object. The path of the returned ClassTreeLoader is the path of the parent ClassTreeLoader with the name of the property requested added at the end of said path array. If a ClassTreeLoader object is invoked as a function, it assumes to be a static method of a class and returns a Promise. It handles its arguments like a MethodProxyPromise object. The target class of the method call is specified by the path without the last entry and the loader, which will load the class. If the method is invoked using "new", the whole path specifies the class to be loaded and instantiated and results in a MethodProxyPromise object.

* path: An array describing the path where the loader finds the class object.
* loader: The loader which loads the classes.

### Properties
* $PATH: the path of the class represented by the ClassTreeLoader.


## URILoader( method, base, prefix, suffix )
A class which loads files at _base_ using _method_ and adds the _prefix_ and _suffix_ to the file name before loading it.

* method: The HTTP Method
* base: The base URL where the files are located
* prefix: Something to be added in front of the file name before loading the file
* suffix: Something to be added at the end of the file name before loading the file

### Methods

#### load( path, payload )
Loads a file located at _base_ + _path_ and adds _payload_ to the request. Returns a Promise which will resolve to the Content of the file as String. This may change later, because this doesn't work with binary files.
* path: An Array which contains the names of the entities of the path to the file to be loaded.
* payload: datas to include into the request 

## ProcessLoader( processor, loader )
Wrapper for a loader object. Instantiates the _processor_ with the datas loaded by the _loader_ and returns the instantiated _processor_.

### Methods
#### load( ... )
see above


## JavaScript( code, name, sourceURL )
Evaluates _code_ as a class body and returns the class.
* code: The code for a JavaScript class body
* name: the name of the class
* sourceURL: Extra information for easier debugging.

