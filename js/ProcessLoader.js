
class ProcessLoader {

  constructor( processor, loader ){
    this.processor = processor;
    this.loader = loader;
  }

  load( path ){
    let self = this;
    return self.loader.load.apply( self.loader, arguments )
      .then(function( content ){
        return new self.processor( content, path[path.length-1], path.join('.') );
      });
  }

}

