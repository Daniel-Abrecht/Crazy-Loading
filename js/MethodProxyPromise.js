
const MethodProxyPromise = createProxyPromise({

  get( t, k ){
    return t["\0PromiseProxyPromise\0"].then( (o) => o[k] );
  },

  set( t, k, v ){
    t["\0PromiseProxyPromise\0"].then(function(o){
      o[k] = v;
    });
  }

  }, function MethodProxyPromiseMethodFactory( promise ){
    return function MethodProxyPromiseMethod(){
      let t = this;
      let a = Array.prototype.slice.call(arguments);
      a.push(this);
      a.push(promise);
      return MethodProxyPromise.all(a)
               .then(function( args ){
                 var a = Array.prototype.slice.apply(args);
                 var c = a.pop();
                 var t = a.pop();
                 return c.apply(t,a);
               });
    };
  }

);
