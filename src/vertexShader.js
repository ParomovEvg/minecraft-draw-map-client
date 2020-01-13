export default `attribute vec2 vertexPosition;

void main(){
\tgl_Position = vec4(vertexPosition, 0, 1);
}`