
static println(){
  document.body.appendChild(
    document.createTextNode(
      Array.prototype.join.call(
        arguments, ' '
      )
    )
  );
}

static getWorld(){
  return "World!";
}
