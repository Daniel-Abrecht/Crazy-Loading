
var System =
  ClassTreeLoader(["System"],
    new ProcessLoader(
      JavaScript,
      new URILoader( "GET", "js", "", ".js" )
    )
  )
;

System.out.println( "Hello", System.out.getWorld() );
