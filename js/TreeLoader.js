"use strict";

window.treeLoaderCache = window.treeLoaderCache || new WeakMap();

function TreeLoader( path, loader ){

  var treeCache = treeLoaderCache.get( loader );
  if( !treeCache )
    treeLoaderCache.set(
      loader,
      treeCache = new Map()
    );

  var TLStuff = {
    $PATH: path
  };

  return new Proxy(
    promiseGetter, {
      "get": getter,
      "set": function(){},
      "deleteProperty": () => false,
      "defineProperty": (x) => x
    }
  );

  function promiseGetter( resolve, reject ){
    var promise = treeCache.get( path.join('\0'), loader );
    if( !promise ){
      promise = new Promise( loadContent );
      treeCache.set( path.join('\0'), promise );
    }
    if( arguments.length )
      return promise.then( resolve, reject );
    return promise;
  }

  function loadContent( resolve, reject ){
    loader.load( path )
      .then( resolve )
      .catch(function(){
        treeCache.delete( path.join('\0') );
        reject.apply(null,arguments);
      });
  }

  function getter( t, k ){
    var res;
    if( res = t[k] )
      return res;
    if( res = TLStuff[k] )
      return res;
    if(!( Object(k) instanceof String ))
      return;
    return TreeLoader( path.concat(k), loader );
  }

}
