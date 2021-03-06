"use strict";

window.treeLoaderCache = window.treeLoaderCache || new WeakMap();

function ClassTreeLoader( path, loader ){

  let treeCache = treeLoaderCache.get( loader );
  if( !treeCache )
    treeLoaderCache.set(
      loader,
      treeCache = new Map()
    );

  let TLStuff = {
    $PATH: path
  };

  let base = path.slice();
  let method = base.pop();

  return new Proxy(
    path.length ? callMathod : {}, {
      "construct": create,
      "get": getter,
      "set": function(){},
      "deleteProperty": () => false,
      "defineProperty": (x) => x
    }
  );

  function callMathod(){
    let a = Array.prototype.slice.apply(arguments);
    a.push(loadContent(base));
    return MethodProxyPromise.all(a)
      .then(function(a){
        let cls = a.pop();
        return cls[method].apply(cls,a);
      });
  }

  function create( t, args ){
    let a = Array.prototype.slice.apply( args );
    a.push(loadContent(path));
    return MethodProxyPromise.all(a)
      .then(function(a){
        var c = a.pop();
        return new c(...a);
      });
  }

  function loadContent( path ){
    let promise = treeCache.get( path.join('\0'), loader );
    if( promise )
      return promise;
    promise = new Promise( function( resolve, reject ){
      loader.load(path)
        .then(resolve)
        .catch(function(){
          treeCache.delete( path.join('\0') );
          reject.apply(null,arguments);
        });
    });
    treeCache.set( path.join('\0'), promise );
    return promise;
  }

  function getter( t, k ){
    let res;
    if( res = t[k] )
      return res;
    if( res = TLStuff[k] )
      return res;
    if(!( Object(k) instanceof String ))
      return;
    return new ClassTreeLoader( path.concat(k), loader );
  }

}
