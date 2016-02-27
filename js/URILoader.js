
class URILoader {

  constructor( method, base, prefix, suffix ){
    this.method = method || 'GET';
    this.base   = base   || '';
    this.prefix = prefix || '';
    this.suffix = suffix || '';
  }

  load( path, payload ){
    let self = this;
    return new Promise(function( resolve, reject ){
      let escaped_path = path.map(
        (x) => (x+'').replace(/\//g,':')
      );
      let file = escaped_path.pop();
      let uri = (
         self.base + "/" + escaped_path.join('/') + '/'
       + self.prefix + file + self.suffix
      ).replace( /\/{2}/g, '/' );
      let xhr = new XMLHttpRequest();
      xhr.open( self.method, uri, true );
      xhr.onload = function(){
        if( this.status >= 200 && this.status < 300 ){
          resolve(this.response);
        }else{
          reject({
            status: this.status,
            message: this.statusText
          });
        }
      };
      xhr.onerror = function(){
        reject({
          status: this.status,
          message: this.statusText
        });
      };
      xhr.send(
        payload ? JSON.stringify(payload) : null
      );

    });
  }

}
