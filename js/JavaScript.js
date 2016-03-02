
class JavaScript {

  constructor( code, name, sourceURL ){
    name = (name||"").replace(/[^a-zA-Z0-9_]/g,'$');
    if(/^[0-9]/.test(name[0]))
      name = "$"+name;
    if( sourceURL )
      sourceURL = '//# sourceURL=' + sourceURL.replace(/\n/g,' ');
    else sourceURL = '';
    return eval( "(class " + name + " {\n" + code + "\n})\n" + sourceURL );
  }

}
