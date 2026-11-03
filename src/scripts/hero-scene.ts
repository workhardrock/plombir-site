// 3D-сцена первого экрана: знак PLOMBIR из трёх граненых шаров с огнём внутри,
// лучи прожекторов в дыму и пятна света на полу. Подключается из Hero.astro.
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js';

const ORANGE = new THREE.Color('#ff5a24');
const BEAM = new THREE.Color('#bfe4ff');
const FLOOR_Y = -2.7;

export function mountHeroScene(host: HTMLElement, hero: HTMLElement, opts: { still: boolean }) {
  const small = Math.min(innerWidth, innerHeight) < 700;
  const renderer = new THREE.WebGLRenderer({ antialias: !small, alpha: false, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(devicePixelRatio, small ? 1.5 : 1.75));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.setClearColor('#02070a');
  host.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2('#02070a', 0.07);
  const pmrem = new THREE.PMREMGenerator(renderer);
  const env = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;

  const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 80);

  // --- Знак: music сверху, people слева, places справа (как в Mark.astro) ---
  const mark = new THREE.Group();
  const R = 0.63;
  const centers = [new THREE.Vector3(0, 1.16, 0), new THREE.Vector3(-1, -0.58, 0), new THREE.Vector3(1, -0.58, 0)];

  const shellGeo = (() => {
    const g = new THREE.IcosahedronGeometry(R, 1).toNonIndexed();
    const p = g.attributes.position as THREE.BufferAttribute;
    const colors = new Float32Array(p.count * 3);
    const a = new THREE.Vector3(), b = new THREE.Vector3(), c = new THREE.Vector3(), m = new THREE.Vector3();
    for (let i = 0; i < p.count; i += 3) {
      a.fromBufferAttribute(p, i); b.fromBufferAttribute(p, i + 1); c.fromBufferAttribute(p, i + 2);
      m.copy(a).add(b).add(c).divideScalar(3);
      // грани чуть сжаты к центру — в щелях виден огонь
      [a, b, c].forEach((v, k) => { v.lerp(m, 0.13); p.setXYZ(i + k, v.x, v.y, v.z); });
      const warm = Math.random() < 0.35;
      const l = 0.18 + Math.random() * 0.5;
      for (let k = 0; k < 3; k++) colors.set(warm ? [l * 1.6, l * 0.55, l * 0.28] : [l, l * 1.02, l * 1.08], (i + k) * 3);
    }
    g.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    g.computeVertexNormals();
    return g;
  })();
  const shellMat = new THREE.MeshStandardMaterial({ vertexColors: true, metalness: 1, roughness: 0.16, envMap: env, envMapIntensity: 0.75, side: THREE.DoubleSide, flatShading: true });
  const cores: THREE.MeshBasicMaterial[] = [];
  const coreGeo = new THREE.IcosahedronGeometry(R * 0.86, 2);

  centers.forEach((c) => {
    const g = new THREE.Group();
    g.position.copy(c);
    g.add(new THREE.Mesh(shellGeo, shellMat));
    const core = new THREE.MeshBasicMaterial({ color: ORANGE.clone().multiplyScalar(0), toneMapped: false });
    cores.push(core);
    g.add(new THREE.Mesh(coreGeo, core));
    const light = new THREE.PointLight(ORANGE, 0, 4, 2);
    g.add(light);
    g.userData.light = light;
    g.rotation.set(Math.random() * 3, Math.random() * 3, 0);
    mark.add(g);
  });
  const barMat = new THREE.MeshStandardMaterial({ color: '#2a2522', metalness: 1, roughness: 0.35, envMap: env, envMapIntensity: 0.6, emissive: ORANGE, emissiveIntensity: 0 });
  for (const [i, j] of [[0, 1], [1, 2], [2, 0]]) {
    const a = centers[i], b = centers[j];
    const len = a.distanceTo(b);
    const bar = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, len, 12), barMat);
    bar.position.copy(a).add(b).multiplyScalar(0.5);
    bar.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), b.clone().sub(a).normalize());
    mark.add(bar);
  }
  scene.add(mark);
  const front = new THREE.PointLight(ORANGE, 0, 12, 1.6);
  front.position.set(0, -1.2, 3);
  scene.add(front);
  scene.add(new THREE.AmbientLight('#1b3346', 0.3));

  // --- Задник: оранжевое свечение за сценой, как в зале ---
  const wall = new THREE.Mesh(
    new THREE.PlaneGeometry(40, 16),
    new THREE.ShaderMaterial({
      transparent: true, depthWrite: false, fog: false,
      uniforms: { uOn: { value: 0 } },
      vertexShader: 'varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.); }',
      fragmentShader: `varying vec2 vUv; uniform float uOn;
        void main(){
          vec2 p = (vUv - vec2(.5,.42)) * vec2(2.6, 1.);
          float g = exp(-dot(p,p) * 16.) + exp(-pow((vUv.y-.36)*30.,2.)) * smoothstep(.22,.0,abs(vUv.x-.5)) * .6;
          gl_FragColor = vec4(vec3(1.,.28,.08) * g * uOn * .32, 1.);
        }`,
    }),
  );
  wall.position.set(0, 0.5, -9);
  scene.add(wall);
  // отражение свечения на полу, чтобы горизонт не обрывался
  const glowFloor = new THREE.Mesh(
    new THREE.PlaneGeometry(26, 10),
    new THREE.ShaderMaterial({
      transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, fog: false,
      uniforms: { uOn: { value: 0 } },
      vertexShader: 'varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.); }',
      fragmentShader: 'varying vec2 vUv; uniform float uOn; void main(){ float x = (vUv.x-.5)*2.; float g = pow(vUv.y, 2.2) * exp(-x*x*3.); gl_FragColor = vec4(vec3(1.,.3,.09) * g * uOn * .3, 1.); }',
    }),
  );
  glowFloor.rotation.x = -Math.PI / 2;
  glowFloor.position.set(0, FLOOR_Y + 0.005, -4);
  scene.add(glowFloor);

  // --- Пол: тёмный глянец и пятна от лучей ---
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(60, 40), new THREE.MeshStandardMaterial({ color: '#0a1218', metalness: 0.7, roughness: 0.38, envMap: env, envMapIntensity: 0.1 }));
  floor.rotation.x = -Math.PI / 2;
  floor.position.y = FLOOR_Y;
  scene.add(floor);

  // --- Лучи прожекторов на двух фермах ---
  const beamGeo = new THREE.ConeGeometry(1, 1, 40, 1, true);
  beamGeo.translate(0, -0.5, 0);
  const beamVS = `varying float vT; varying vec3 vN; varying vec3 vV;
    void main(){ vT = -position.y; vec4 mv = modelViewMatrix * vec4(position,1.); vN = normalize(normalMatrix * normal); vV = normalize(-mv.xyz); gl_Position = projectionMatrix * mv; }`;
  const beamFS = `varying float vT; varying vec3 vN; varying vec3 vV; uniform vec3 uColor; uniform float uOn;
    void main(){ float edge = pow(abs(dot(vN, vV)), 3.); float fall = pow(1. - vT, 1.6) * smoothstep(0., .06, vT);
      gl_FragColor = vec4(uColor * edge * fall * uOn * .16, 1.); }`;
  const poolMatBase = new THREE.ShaderMaterial({
    transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
    uniforms: { uOn: { value: 0 }, uColor: { value: BEAM } },
    vertexShader: 'varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.); }',
    fragmentShader: 'varying vec2 vUv; uniform float uOn; uniform vec3 uColor; void main(){ float d = length(vUv-.5)*2.; float a = smoothstep(1.,.6,d)*.35 + smoothstep(.55,.0,d)*.15; gl_FragColor = vec4(uColor*a*uOn, 1.); }',
  });

  type Beam = { mesh: THREE.Mesh; pool: THREE.Mesh; head: THREE.Mesh; apex: THREE.Vector3; side: number; phase: number; delay: number; mat: THREE.ShaderMaterial; poolMat: THREE.ShaderMaterial };
  const beams: Beam[] = [];
  const headGeo = new THREE.SphereGeometry(0.09, 12, 8);
  const perRail = small ? 5 : 7;
  [-1, 1].forEach((side) => {
    for (let i = 0; i < perRail; i++) {
      const z = -0.5 - i * (8 / (perRail - 1));
      const apex = new THREE.Vector3(side * (2.4 + i * 0.12), 4.4 + i * 0.05, z);
      const mat = new THREE.ShaderMaterial({
        transparent: true, depthWrite: false, side: THREE.DoubleSide, blending: THREE.AdditiveBlending,
        uniforms: { uColor: { value: BEAM }, uOn: { value: 0 } }, vertexShader: beamVS, fragmentShader: beamFS,
      });
      const mesh = new THREE.Mesh(beamGeo, mat);
      mesh.position.copy(apex);
      const poolMat = poolMatBase.clone();
      const pool = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), poolMat);
      pool.rotation.x = -Math.PI / 2;
      pool.position.y = FLOOR_Y + 0.01;
      const head = new THREE.Mesh(headGeo, new THREE.MeshBasicMaterial({ color: new THREE.Color(0, 0, 0), toneMapped: false }));
      head.position.copy(apex);
      scene.add(mesh, pool, head);
      beams.push({ mesh, pool, head, apex, side, phase: i * 0.7 + (side > 0 ? 1.3 : 0), delay: 0.25 + i * 0.12 + (side > 0 ? 0.06 : 0), mat, poolMat });
    }
  });

  // --- Дым: медленно плывущие пылинки ---
  const N = small ? 380 : 900;
  const hazePos = new Float32Array(N * 3);
  const hazeSeed = new Float32Array(N);
  for (let i = 0; i < N; i++) {
    hazePos.set([(Math.random() - 0.5) * 16, FLOOR_Y + Math.random() * 7.5, -9 + Math.random() * 12], i * 3);
    hazeSeed[i] = Math.random();
  }
  const hazeGeo = new THREE.BufferGeometry();
  hazeGeo.setAttribute('position', new THREE.BufferAttribute(hazePos, 3));
  hazeGeo.setAttribute('seed', new THREE.BufferAttribute(hazeSeed, 1));
  const hazeMat = new THREE.ShaderMaterial({
    transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
    uniforms: { uTime: { value: 0 }, uOn: { value: 0 }, uScale: { value: renderer.getPixelRatio() } },
    vertexShader: `attribute float seed; uniform float uTime; uniform float uScale; varying float vA;
      void main(){ vec3 p = position; p.x += sin(uTime*.12 + seed*40.)*.6;
        p.y = ${FLOOR_Y.toFixed(2)} + mod(p.y - ${FLOOR_Y.toFixed(2)} + uTime*.06*(.4+seed), 7.5);
        vec4 mv = modelViewMatrix * vec4(p,1.); gl_Position = projectionMatrix * mv;
        gl_PointSize = (1.2 + seed*2.2) * uScale * (9. / -mv.z); vA = .25 + .75*fract(seed*13.); }`,
    fragmentShader: 'varying float vA; uniform float uOn; void main(){ float d = length(gl_PointCoord-.5); float a = smoothstep(.5,.0,d); gl_FragColor = vec4(vec3(.75,.88,1.)*a*vA*uOn*.35, 1.); }',
  });
  scene.add(new THREE.Points(hazeGeo, hazeMat));

  // --- Свечение (bloom) ---
  const composer = new EffectComposer(renderer);
  composer.addPass(new RenderPass(scene, camera));
  const bloom = new UnrealBloomPass(new THREE.Vector2(1, 1), 0.75, 0.5, 0.6);
  composer.addPass(bloom);
  composer.addPass(new OutputPass());

  // --- Размеры: знак занимает верхнюю часть кадра, над словом PLOMBIR ---
  let W = 1, H = 1, baseZ = 10;
  const resize = () => {
    W = host.clientWidth; H = host.clientHeight;
    const aspect = W / H;
    renderer.setSize(W, H, false);
    composer.setSize(W, H);
    bloom.resolution.set(W * (small ? 0.5 : 1), H * (small ? 0.5 : 1));
    camera.aspect = aspect;
    baseZ = Math.max(12.5, 6.4 / (0.69 * aspect));
    camera.setViewOffset(W, H, 0, H * (aspect < 0.8 ? 0.16 : 0.15), W, H);
    camera.updateProjectionMatrix();
  };
  resize();
  const ro = new ResizeObserver(() => { resize(); if (opts.still) frame(performance.now()); });
  ro.observe(host);

  // --- Взаимодействие: курсор и прокрутка ---
  const pointer = { x: 0, y: 0, tx: 0, ty: 0 };
  const onMove = (e: PointerEvent) => { pointer.tx = (e.clientX / innerWidth) * 2 - 1; pointer.ty = (e.clientY / innerHeight) * 2 - 1; };
  addEventListener('pointermove', onMove, { passive: true });
  let scrollP = 0;
  const onScroll = () => {
    scrollP = Math.min(1, Math.max(0, scrollY / Math.max(1, hero.offsetHeight)));
    hero.style.setProperty('--p', scrollP.toFixed(3));
  };
  addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // --- Кадр ---
  const start = performance.now();
  const dir = new THREE.Vector3(), down = new THREE.Vector3(0, -1, 0);
  const ease = (t: number) => 1 - Math.pow(1 - Math.min(1, Math.max(0, t)), 3);
  const frame = (now: number) => {
    const t = opts.still ? 60 : (now - start) / 1000;
    pointer.x += (pointer.tx - pointer.x) * 0.05;
    pointer.y += (pointer.ty - pointer.y) * 0.05;
    const beat = opts.still ? 0.5 : Math.pow(0.5 + 0.5 * Math.cos(t * Math.PI * 2 * (122 / 60)), 6);

    // знак: вращение, наклон к курсору, при прокрутке уходит вниз и вглубь
    mark.rotation.y = Math.sin(t * 0.22) * 0.45 + pointer.x * 0.45;
    mark.rotation.x = pointer.y * 0.18 + scrollP * 0.5;
    mark.position.y = 0.15 + Math.sin(t * 0.6) * 0.06 - scrollP * 1.2;
    mark.children.forEach((g, i) => { if (g.userData.light) { g.rotation.y += opts.still ? 0 : 0.0025 * (i + 1); } });
    cores.forEach((m, i) => {
      const on = ease((t - 0.9 - i * 0.28) / 0.7);
      m.color.copy(ORANGE).multiplyScalar(on * (3.2 + beat * 1.2));
      (mark.children[i].userData.light as THREE.PointLight).intensity = on * 6;
    });
    const markOn = ease((t - 0.9) / 1.4);
    barMat.emissiveIntensity = markOn * 0.12;
    front.intensity = markOn * 14;
    const wallOn = ease((t - 0.5) / 1.6) * (1 - scrollP * 0.6);
    (wall.material as THREE.ShaderMaterial).uniforms.uOn.value = wallOn;
    (glowFloor.material as THREE.ShaderMaterial).uniforms.uOn.value = wallOn;
    hazeMat.uniforms.uTime.value = t;
    hazeMat.uniforms.uOn.value = ease((t - 0.2) / 2);

    // лучи качаются, клонятся к курсору и включаются по очереди
    for (const b of beams) {
      const on = ease((t - b.delay) / 0.35) * (0.85 + 0.15 * Math.sin(t * 3 + b.phase));
      const sway = Math.sin(t * 0.45 + b.phase) * 0.32;
      dir.set(-b.side * (0.28 + sway * 0.6) + pointer.x * 0.35, -1, Math.sin(t * 0.3 + b.phase * 1.7) * 0.25).normalize();
      b.mesh.quaternion.setFromUnitVectors(down, dir);
      const L = (FLOOR_Y - b.apex.y) / dir.y;
      const r = L * 0.085;
      b.mesh.scale.set(r, L, r);
      b.mat.uniforms.uOn.value = on;
      b.pool.position.set(b.apex.x + dir.x * L, FLOOR_Y + 0.01, b.apex.z + dir.z * L);
      b.pool.scale.setScalar(r * 2.3);
      b.poolMat.uniforms.uOn.value = on * 0.55;
      (b.head.material as THREE.MeshBasicMaterial).color.setScalar(on * 3);
    }

    // камера: при прокрутке отъезжает и поднимается
    camera.position.set(pointer.x * 0.35, 0.35 + scrollP * 1.6 - pointer.y * 0.15, baseZ + scrollP * 4);
    camera.lookAt(0, 0.1 - scrollP * 0.6, 0);
    composer.render();
    (window as any).__heroFrames = ((window as any).__heroFrames || 0) + 1;
  };

  // крутим кадры только когда первый экран виден и вкладка активна
  let raf = 0, visible = true;
  const loop = (now: number) => { frame(now); raf = requestAnimationFrame(loop); };
  const play = () => { if (!raf && visible && !document.hidden && !opts.still) raf = requestAnimationFrame(loop); };
  const stop = () => { cancelAnimationFrame(raf); raf = 0; };
  new IntersectionObserver(([e]) => { visible = e.isIntersecting; visible ? play() : stop(); }).observe(hero);
  document.addEventListener('visibilitychange', () => (document.hidden ? stop() : play()));
  if (opts.still) frame(performance.now()); else play();
  return renderer.domElement;
}
