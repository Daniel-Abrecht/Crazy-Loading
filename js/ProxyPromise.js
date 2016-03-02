"use strict";

if( !ProxyPromise_NativePromise ){
  var ProxyPromise_NativePromise = Promise;
  var Promise = createProxyPromise();
}

function createProxyPromise( handler, overlayFactory ){

////////////////////////////////////////////////////////////////

  handler = handler || {};

////////////////////////////////////////////////////////////////

  var proxyHandler = {
    "construct": constructor,
    "get": getter,
    "set": setter,
    "deleteProperty": deleteProperty,
    "enumerate": enumerate,
    "ownKeys": ownKeys,
    "has": has,
    "defineProperty": defineProperty,
    "getOwnPropertyDescriptor": getOwnPropertyDescriptor
  };

////////////////////////////////////////////////////////////////

  (function(){

    this.proxify = proxify;

    for( var k of [
      "all",
      "resolve",
      "reject",
      "race"
    ]) this[k] = createDeproxyPromiseProxy( ProxyPromise_NativePromise, ProxyPromise_NativePromise[k] );

  }).call(ProxyPromise);

////////////////////////////////////////////////////////////////

  return ProxyPromise;

////////////////////////////////////////////////////////////////


  function ProxyPromise(){
    return proxify(
      new (ProxyPromise_NativePromise.bind.apply(ProxyPromise_NativePromise,
        [ProxyPromise_NativePromise].concat(Array.prototype.slice.apply(arguments))
      ))
    );
  };

  function proxify( promise ){
    let overlay = (overlayFactory||Object)(promise);
    let proxy = new Proxy( overlay, proxyHandler );
    Object.defineProperty(
      promise, "\0PromiseProxy\0", {
        value: proxy,
        enumerable: false,
        configurable: true,
        writable: true
      }
    );
    Object.defineProperty(
      overlay, "\0PromiseProxyPromise\0", {
        value: promise,
        enumerable: false,
        configurable: true,
        writable: true
      }
    );
    return proxy;
  }

  function proxifyIfPromise( o ){
    if( ( o instanceof ProxyPromise_NativePromise )
     || ( "\0PromiseProxyPromise\0" in Object(o) )
    ) return proxify(o);
    return o;
  }

  function constructor( t, args ){
    if(handler.constructor)
      return proxifyIfPromise( handler.constructor.call( this, t, args ) );
    return proxifyIfPromise( new (t.bind.apply(t,[t].concat(args))) );
  }

  function getter( t, key ){
    var promise = t["\0PromiseProxyPromise\0"];
    if( key == "\0PromiseProxyPromise\0" )
      return promise;
    if(key in promise){
      if( promise[key] instanceof Function ){
        return createDeproxyPromiseProxy( promise, promise[key] );
      }else{
        return promise[key];
      }
    }
    if( handler.get instanceof Function )
      return proxifyIfPromise( handler.get.call(this,t,key) );
    return t[key];
  }

  function setter( t, key, value ){
    if( handler.set instanceof Function )
      handler.set.call(this,t,key);
    else
      t[key] = value;
  }

  function deleteProperty( t, key ){
    if( handler.deleteProperty instanceof Function )
      return handler.deleteProperty.call( this, t, key );
    else
      return (delete t[key]);
  }

  function enumerate( t ){
    if( handler.enumerate instanceof Function ){
      return handler.enumerate.call( this, t );
    }else{
      var result = Object.keys(t);
      var promise = t["\0PromiseProxyPromise\0"];
      if( promise != t ){
        for( var key in promise )
          if(!( key in result ))
            result.push(key);
      }
      return result[Symbol.iterator]();
    }
  }

  function ownKeys( t ){
    if( handler.ownKeys instanceof Function ){
      return handler.ownKeys.call( this, t );
    }else{
      var result = Object.keys(t);
      var promise = t["\0PromiseProxyPromise\0"];
      if( promise != t ){
        for( var key in promise )
          if(!( key in result ))
            result.push(key);
      }
      return result;
    }
  }

  function has( t, key ){
    if( handler.has instanceof Function ){
      return handler.has.call( this, t );
    }else{
      return ( key in t ) || ( key in t["\0PromiseProxyPromise\0"] );
    }
  }

  function defineProperty( t, key, descriptor ){
    if( handler.defineProperty instanceof Function ){
      return proxifyIfPromise( handler.defineProperty.call( this, t ) );
    }else{
      return proxifyIfPromise( Object.defineProperty( t, key, descriptor ) );
    }
  }

  function getOwnPropertyDescriptor( t, key ){
    if( key in t )
      return Object.getOwnPropertyDescriptor( t, key );
    if( key in t["\0PromiseProxyPromise\0"] )
      return Object.getOwnPropertyDescriptor( t, key );
  }


////////////////////////////////////////////////////////////////

  function createDeproxyPromiseProxy( promise, method ){
    return function DeproxyPromiseProxyFunction(){
      function deproxyfy( o ){
        if( o instanceof Array )
          return o.map( deproxyfy );
        if( "\0PromiseProxyPromise\0" in Object(o) )
          return o["\0PromiseProxyPromise\0"];
        return o;
      }
      let a = Array.prototype.map.call( arguments, deproxyfy );
      let res = method.apply(promise,a);
      if( res instanceof ProxyPromise_NativePromise )
        res = proxify(res);
      return res;
    };
  }

}
