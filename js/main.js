
const System =
  new ClassTreeLoader(["System"],
    new ProcessLoader(
      JavaScript,
      new URILoader( "GET", "js", "", ".js" )
    )
  )
;

var sysout = new System.out();

System.out.println( sysout.getHello(), System.out.getWorld() );

System.out.println("It Works!");
