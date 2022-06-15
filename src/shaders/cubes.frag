#version 300 es

precision highp float;

out vec4 FragColor;
in vec2 uv;

uniform float u_time;
uniform vec2 u_mouse;
uniform float u_mouseScroll;
uniform float u_anim;

uniform sampler2D u_Sampler;
uniform samplerCube u_Sampler2;

#define PI  3.14159265358
#define TAU 6.28318530718
#define EXP 2.71828182846

#define ITER 3
#define MAX_ITERATIONS 256
#define SURF_DIST 0.005
#define MAX_DIST 10.0
#define DENSITY 5.0

#define R(p, a) p = cos(a) * p + sin(a) * vec2(p.y, -p.x)

float Noise31(vec3 p){
  p = fract(p * vec3(123.344314, 234.542341, 123.432423));
  p += dot(p, p + 23.4123);
  return fract(p.x * p.y * p.z);
}

float sdBox(vec3 p, vec3 b) {
  vec3 q = abs(p) - b;
  return length(max(q, 0.0)) + min(max(q.x, max(q.y, q.z)), 0.0);
}

float oneCube(vec3 p, vec3 id) {
  float distrib = smoothstep(8.0, 0.0, length(id));
  float n = 0.5 * Noise31(id + 1.435) + 0.2 * distrib * distrib;
  if (n > 0.5) {
    vec3 q = abs(p) - vec3(0.18);
    return length(max(q, 0.0)) + min(max(q.x, max(q.y, q.z)), 0.0) - 0.06;
  } else {
    vec3 q = abs(p) - vec3(0.26);
    return -min(max(q.x, max(q.y, q.z)), 0.0);
  }
}

vec3 srot(vec3 rayDirection, float angle) {
  vec3 angles = vec3(-PI / 4.0, PI / 4.0, angle);

  mat3 m, m1, m2;

  m[0] = vec3(1.0, 0.0, 0.0);
  m[1] = vec3(0.0, cos(angles.x), -sin(angles.x));
  m[2] = vec3(0.0, sin(angles.x), cos(angles.x));

  m1[0] = vec3(cos(angles.x), -sin(angles.x), 0.0);
  m1[1] = vec3(sin(angles.x), cos(angles.x), 0.0);
  m1[2] = vec3(0.0, 0.0, 1.0);

  m2[0] = vec3(cos(angles.z), 0.0, -sin(angles.z));
  m2[1] = vec3(0.0, 1.0, 0.0);
  m2[2] = vec3(sin(angles.z), 0.0, cos(angles.z));

  // mat3 m;
  // m[0] = vec3(
  //   cos(angles.y) * cos(angles.z),
  //   cos(angles.z) * sin(angles.x) * sin(angles.y) - cos(angles.x) * sin(angles.z),
  //   cos(angles.x) * cos(angles.z) * sin(angles.y) + sin(angles.x) * sin(angles.z)
  // );
  // m[1] = vec3(
  //   cos(angles.y) * sin(angles.z),
  //   cos(angles.x) * cos(angles.z) + sin(angles.x) * sin(angles.y) * sin(angles.z),
  //   cos(angles.x) * sin(angles.y) * sin(angles.z) - cos(angles.z) * sin(angles.x)
  // );
  // m[2] = vec3(
  //   -sin(angles.y),
  //   cos(angles.y) * sin(angles.x),
  //   cos(angles.x) * cos(angles.y)
  // );

  return rayDirection * m2 * m1 * m;
}

vec3 sceneDistance(vec3 p) {
  float rep = 0.5;
  p = srot(p, u_time * 0.1);
  vec3 id = round(p / rep);
  vec3 q = p - rep * id;
  float d = oneCube(q, id);
  float bigBox = sdBox(p, vec3(2.25));

  return vec3(max(d, bigBox), Noise31(id), 0.0);
}

vec4 sceneMat(vec3 point) {
  if (length(point) > MAX_DIST * 0.8) {
    return vec4(0.0, 0.0, 0.0, 0.0);
  }
  point = srot(point, u_time * 0.1);

  float rep = 0.5;
  vec3 roundP = round(point / rep);

  float id1 = Noise31(roundP);
  if (id1 > 0.6) {
    return vec4(0.01, 0.05, 0.1, 1.0);
  }

  float id = Noise31(roundP + vec3(1.4324, 2.5151, 3.142)) + u_time * 0.1;
  return texture(u_Sampler, vec2(id, 0.5)) * 2.0;
}

vec3 rayMarch(vec3 rayOrigin, vec3 rayDirection) {
  float dist = 0.0;

  for (int i = 0; i < MAX_ITERATIONS; i++) {
    vec3 point = rayOrigin + rayDirection * dist;
    vec3 tmp = sceneDistance(point);
    dist += abs(tmp.x);

    if (tmp.x < SURF_DIST || dist > MAX_DIST) {
      break;
    }
  }

  return vec3(dist, 0.0, 0.0);
}

vec4 innerMarch(vec3 rayOrigin, vec3 rayDirection) {
  float step = 0.01;
  float dist = 0.05;
  float trans = 1.0;
  float dens = DENSITY;
  vec3 point;

  for (int i = 0; i < MAX_ITERATIONS; i++) {
    point = rayOrigin + rayDirection * dist;
    vec3 tmp = sceneDistance(point);
    dist += step;
    if (tmp.x < 0.0) {
        trans *= (1.0 - dens * step);
    }

    if (tmp.x > 0.0 || dist > MAX_DIST) {
      break;
    }
  }

  vec4 col1 = sceneMat(point);

  vec3 tmp = rayMarch(point + rayDirection * SURF_DIST * 2.0, rayDirection);
  point += rayDirection * tmp.x;
  vec4 col2 = sceneMat(point);

  return vec4(mix(col1, col2, trans).rgb, 1.0 - trans);
}

vec3 GetNormal(vec3 p) {
  vec3 tmp = sceneDistance(p);
  float d = tmp.x;
  vec2 e = vec2(0.001, 0.0);
  vec3 n = d - vec3(
    sceneDistance(p - e.xyy).x,
    sceneDistance(p - e.yxy).x,
    sceneDistance(p - e.yyx).x
  );
  return normalize(n);
}

vec3 getBg(vec2 uv) {
  return vec3(0.2, 0.25, 0.35) * sin(uv.y * 762.0 / 4.0 * PI) * smoothstep(1.6, 0.2, length(uv * vec2(0.6, 1.2)));
}

void main() {
  float fov = 1.8;
  float mouse = 1.0 + 2.0 * smoothstep(0.6, 0.0, length(u_mouse - uv));
  // const float mouseFactor = 0.05;
  float xpos = -2.2 + sin(clamp(u_anim * 1.5, 0.0, 3.0 * PI / 5.0)) * 3.0;
  float ypos =  0.0 - clamp(u_anim / 3.0, 0.0, 1.5);
  float zoom = -6.5 + clamp(u_anim * 3.0, 0.0, 3.0);
  vec3 rayOrigin = vec3(xpos, ypos, zoom);
  vec3 rayDirection = normalize(vec3(uv.x / fov, uv.y / fov, 1.0));

  // vec2 rot = vec2(
  //   u_mouseY * mouseFactor * PI * 2.0,
  //   u_mouseX * mouseFactor * PI * 2.0
  // );

  // R(rayDirection.yz, -rot.x);
  // R(rayDirection.xz, rot.y);
  // R(rayOrigin.yz, -rot.x);
  // R(rayOrigin.xz, rot.y);

  R(rayDirection.xz, -u_anim);
  R(rayOrigin.xz, -u_anim);

  vec3 col = vec3(0.0);
  float diffuse;
  vec3 normal;
  vec3 point;
  float dist;

  // FragColor = vec4(vec3(length(u_mouse)), 1.0);
  // return;

// bounces
  for (int i = 0; i < ITER; i++) {
    float factor = float(i * 2) + 1.0;
    vec3 tmp = rayMarch(rayOrigin, rayDirection);
    dist = tmp.x;
    rayOrigin += rayDirection * dist;
    normal = GetNormal(rayOrigin);

    if (dist >= MAX_DIST) {
      if (i == 0) {
        col = getBg(uv);
        break;
      }

      vec4 samp = texture(u_Sampler2, rayDirection) * 0.4;
      col += samp.rgb / (factor);
      break;
    }

    vec3 shift = vec3(0.0);
    if (i == 0) {
      // go inside
      vec4 tmp2 = innerMarch(rayOrigin, rayDirection);
      shift = normal * tmp2.a * 0.01;
      vec3 samp = getBg(uv + shift.xz) * 0.3;
      col += samp * (1.0 - tmp2.a) + (tmp2.rgb * tmp2.a) / (factor) * mouse;
    } else {
      vec4 tmp2 = sceneMat(rayOrigin + rayDirection * SURF_DIST);
      col += tmp2.rgb * tmp2.a / (factor) * 0.5;
    }

    rayDirection = reflect(rayDirection, normal);

    diffuse = 0.1 + 0.3 * dot(normal, normalize(vec3(0.5, 1.0, 0.5)));
    col *= (1.0 + vec3(diffuse) / (factor)) + factor * 0.05;

    rayOrigin += rayDirection * SURF_DIST * 10.0 ;
  }

  FragColor = vec4(col, 1.0);
}
