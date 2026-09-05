#version 300 es

precision mediump float;

// ℹ️ nova varying: coordenada de textura
in vec2 v_texcoord;
// ℹ️ nova uniform: a textura
uniform sampler2D u_texture;

out vec4 outColor;

void main() {
  // ℹ️ agora pegamos a cor da textura
  outColor = texture(u_texture, v_texcoord);
}