#version 300 es

in vec3 a_position;
// ℹ️ novo atributo: coordenada de textura
in vec2 a_texcoord;
// ℹ️ nova varying: coord. text. interpolada
out vec2 v_texcoord;

void main() {
  gl_Position = vec4(a_position,0.0, 1.0);

  // ℹ️ repassa as coordenadas de textura 
  // para o fragment shader. Será interpolada
  // para cada fragmento (pixel) do polígono
  v_texcoord = a_texcoord;
}