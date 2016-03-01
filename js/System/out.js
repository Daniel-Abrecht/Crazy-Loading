
static println(){
  document.body.appendChild(
    document.createTextNode(
      Array.prototype.join.call(
        arguments, ' '
      ) + "\n"
    )
  );
}

static getWorld(){
  return "World!";
}

getHello(){
  return "Hello";
}
