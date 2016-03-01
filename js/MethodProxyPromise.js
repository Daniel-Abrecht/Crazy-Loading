
const MethodProxyPromise = createProxyPromise({

  get( t, k ){
    return t["\0PromiseProxyPromise\0"].then( (o) => o[k] );
  },

  set( t, k, v ){
    t["\0PromiseProxyPromise\0"].then(function(o){
      o[k] = v;
    });
  }

  }, function( promise ){
    return function(){
      let t = this;
      let a = arguments;
      return promise.then( (c) => c.apply(t,a) );
    };
  }

);
