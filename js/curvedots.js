G.CurveDots = function(){
  G.Primitive.call(this);
}

G.CurveDots.prototype.spawn = function(){
  console.log('het')
}

G.CurveDots.prototype = Object.create(G.Primitive.prototype);