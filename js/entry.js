//Entry point for app


G.loader.addLoad()

G.shaders.load('vs-text', 'text', 'vertex');
G.shaders.load('fs-text', 'text', 'fragment');

G.shaders.load('vs-sky', 'sky', 'vertex');
G.shaders.load('fs-sky', 'sky', 'fragment');

G.shaders.load('vs-strand', 'strand', 'vertex');
G.shaders.load('fs-strand', 'strand', 'fragment');

G.loadTextures()

G.shaders.shaderSetLoaded = function(){
  G.loader.onLoad();
}