const machines = [
  {
    id: "cnc", number: "01", short: "Mecanizado CNC", name: "Centro de mecanizado CNC",
    reference: "CNC-01", type: "Corte y precisión", position: [-6, 0, -0.8],
    description: "Da forma a una pieza mediante una herramienta de corte. Explora tres incidencias de ejemplo.",
    icon: '<path d="M5 26V7h22v19ZM9 7V4h14v3M9 11h14v11H9ZM16 11v6m-3 0h6M9 26v3m14-3v3"/><path d="M25 11h2m-2 4h2"/>',
    faults: [
      { id: "spindle", title: "Vibración en el corte", hint: "Precisión de mecanizado", component: "Cabezal de corte", explanation: "En este ejemplo, una vibración del cabezal podría dejar marcas irregulares en la pieza mecanizada.", review: "Con la máquina detenida y siguiendo su procedimiento de seguridad, revisar la fijación y el estado de la herramienta." },
      { id: "coolant", title: "Refrigeración insuficiente", hint: "Circuito de refrigerante", component: "Bomba de refrigerante", explanation: "Un caudal de refrigerante insuficiente podría elevar la temperatura durante el corte. La bomba se ilumina como punto de revisión del ejemplo.", review: "Comprobar el nivel del depósito, la limpieza del filtro y las conexiones de la bomba, con el equipo aislado." },
      { id: "motor", title: "Temperatura de motor elevada", hint: "Accionamiento principal", component: "Motor principal", explanation: "En esta simulación, el motor presenta una temperatura elevada que podría estar asociada a sobrecarga o ventilación insuficiente.", review: "Consultar los límites del fabricante y revisar las entradas de ventilación y las condiciones de carga con personal cualificado." },
    ],
  },
  {
    id: "conveyor", number: "02", short: "Línea de transporte", name: "Cinta transportadora",
    reference: "TRN-02", type: "Movimiento y clasificación", position: [0, 0, 1],
    description: "Traslada las piezas de una estación a otra. Descubre qué componentes intervienen en su movimiento.",
    icon: '<path d="M4 13h24v9H4ZM7 22v6m18-6v6M10 13V6h12v7M14 6v4h4V6"/><circle cx="9" cy="18" r="2"/><circle cx="16" cy="18" r="2"/><circle cx="23" cy="18" r="2"/>',
    faults: [
      { id: "drive", title: "La cinta no avanza", hint: "Sistema de tracción", component: "Motor de arrastre", explanation: "La cinta permanece inmóvil en este supuesto. El motor de arrastre es uno de los componentes que podría intervenir, no la única causa posible.", review: "Aislar el equipo antes de comprobar la transmisión y las conexiones. No intentar liberar una cinta con el equipo en marcha." },
      { id: "sensor", title: "Pieza no detectada", hint: "Detección de paso", component: "Sensor fotoeléctrico", explanation: "Una caja atraviesa el punto de control sin ser registrada en este ejemplo. El sensor podría estar desalineado u obstruido.", review: "Revisar la limpieza y alineación de la óptica y verificar su funcionamiento según el manual del fabricante." },
      { id: "roller", title: "Desvío de la banda", hint: "Guiado de transporte", component: "Rodillo de retorno", explanation: "Una banda descentrada podría rozar el bastidor. Se destaca el rodillo de retorno como referencia de revisión de este supuesto.", review: "Con la cinta aislada, revisar alineación, desgaste y tensión. Los ajustes deben seguir el procedimiento del fabricante." },
    ],
  },
  {
    id: "robot", number: "03", short: "Brazo robótico", name: "Robot de manipulación",
    reference: "ROB-03", type: "Agarre y posicionamiento", position: [6, 0, -0.8],
    description: "Posiciona piezas con un brazo articulado. Explora el agarre, el movimiento y el control.",
    icon: '<path d="M8 28h16M11 28v-6h10v6M16 22v-6l7-6-5-6M23 10l4 4m-9-10-4 4m10 7 3 3 3-3"/><circle cx="16" cy="16" r="3"/><circle cx="23" cy="10" r="3"/>',
    faults: [
      { id: "servo", title: "Movimiento impreciso", hint: "Articulación del brazo", component: "Servomotor del hombro", explanation: "El brazo no alcanza la posición prevista en este caso ficticio. El accionamiento del hombro se resalta como componente de estudio.", review: "Consultar los registros del controlador y el procedimiento de calibración. No entrar en el área de trabajo sin bloquear el robot." },
      { id: "gripper", title: "Agarre inestable", hint: "Herramienta final", component: "Pinza de sujeción", explanation: "Una pieza podría deslizarse si la pinza no aplica un agarre adecuado. La herramienta final se ilumina para localizarla.", review: "Con la instalación en estado seguro, revisar las superficies de contacto, el ajuste y la alimentación del actuador." },
      { id: "controller", title: "Interrupción de control", hint: "Armario electrónico", component: "Controlador del robot", explanation: "En este ejemplo, una interrupción de comunicación detiene el ciclo. Se señala el armario de control, sin atribuir una causa real.", review: "Consultar las alarmas y documentación del fabricante. Las comprobaciones eléctricas corresponden a personal autorizado." },
    ],
  },
];

const byId = (id) => document.getElementById(id);
let selectedMachineId = "cnc";
let selectedFaultId = null;
let sceneApi = null;

function selectedMachine() {
  return machines.find((machine) => machine.id === selectedMachineId);
}

function renderPanel() {
  const machine = selectedMachine();
  byId("machine-list").innerHTML = machines.map((item) => `
    <button class="machine-card" type="button" data-machine="${item.id}" aria-pressed="${item.id === selectedMachineId}">
      <span class="machine-card-icon" aria-hidden="true"><svg viewBox="0 0 32 32">${item.icon}</svg></span>
      <span class="machine-card-copy"><strong>${item.short}</strong><small>${item.reference} · ${item.type}</small></span>
      <span class="machine-card-indicator" aria-hidden="true"></span>
    </button>`).join("");
  renderFaults(machine);
  byId("machine-description").textContent = machine.description;
  renderDetail(machine);
}

function renderFaults(machine) {
  byId("fault-list").innerHTML = machine.faults.map((fault) => `
    <button class="fault-card" type="button" data-fault="${fault.id}" aria-pressed="${fault.id === selectedFaultId}">
      <span class="fault-symbol" aria-hidden="true">!</span>
      <span class="fault-card-copy"><strong>${fault.title}</strong><small>${fault.hint}</small></span>
      <span class="fault-arrow" aria-hidden="true">›</span>
    </button>`).join("");
}

function renderDetail(machine) {
  const fault = machine.faults.find((item) => item.id === selectedFaultId);
  byId("detail-empty").hidden = Boolean(fault);
  byId("fault-detail").hidden = !fault;
  byId("selection-status").textContent = fault ? `${machine.reference} · ${fault.component}` : machine.name;
  if (fault) {
    byId("component-name").textContent = fault.component;
    byId("fault-explanation").textContent = fault.explanation;
    byId("fault-review").textContent = fault.review;
    byId("callout-name").textContent = fault.component;
  }
}

function selectMachine(id) {
  if (id === selectedMachineId) return;
  selectedMachineId = id;
  selectedFaultId = null;
  // Update in place: keyboard focus stays on the machine button.
  document.querySelectorAll(".machine-card").forEach((button) => {
    button.setAttribute("aria-pressed", String(button.dataset.machine === id));
  });
  const machine = selectedMachine();
  byId("machine-description").textContent = machine.description;
  renderFaults(machine);
  renderDetail(machine);
  sceneApi?.updateSelection();
  byId("announcement").textContent = `${machine.name} seleccionada. Elige un fallo de ejemplo.`;
}

function selectFault(id) {
  selectedFaultId = id;
  document.querySelectorAll(".fault-card").forEach((button) => {
    button.setAttribute("aria-pressed", String(button.dataset.fault === id));
  });
  const machine = selectedMachine();
  renderDetail(machine);
  sceneApi?.updateSelection();
  const fault = machine.faults.find((item) => item.id === id);
  byId("announcement").textContent = fault ? `${fault.title}. Componente resaltado: ${fault.component}. Ejemplo simulado.` : "Resaltado eliminado.";
}

byId("machine-list").addEventListener("click", (event) => {
  const button = event.target.closest("[data-machine]");
  if (button) selectMachine(button.dataset.machine);
});
byId("fault-list").addEventListener("click", (event) => {
  const button = event.target.closest("[data-fault]");
  if (button) selectFault(button.dataset.fault);
});
byId("clear-fault").addEventListener("click", () => {
  const previousFault = selectedFaultId;
  selectFault(null);
  byId("fault-list").querySelector(`[data-fault="${previousFault}"]`)?.focus();
});
byId("retry-button").addEventListener("click", () => window.location.reload());
byId("reset-camera").addEventListener("click", () => sceneApi?.resetCamera());
renderPanel();

function showError(error) {
  console.error("No se pudo iniciar la fábrica 3D:", error);
  byId("loading-state").hidden = true;
  byId("scene-error").hidden = false;
  byId("scene-container").setAttribute("aria-busy", "false");
  byId("scene-error-message").textContent = "Comprueba tu conexión a Internet (Three.js se carga desde un CDN), abre la página con un servidor HTTP y utiliza un navegador actualizado con WebGL 2 y aceleración gráfica habilitados.";
}

async function start() {
  try {
    const [THREE, { OrbitControls }] = await Promise.all([
      import("three"),
      import("three/addons/controls/OrbitControls.js"),
    ]);
    sceneApi = createFactory(THREE, OrbitControls);
    byId("loading-state").hidden = true;
    byId("scene-container").setAttribute("aria-busy", "false");
    byId("reset-camera").disabled = false;
  } catch (error) {
    showError(error);
  }
}

function createFactory(THREE, OrbitControls) {
  const canvas = byId("factory-canvas");
  const container = byId("scene-container");
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.28;

  const scene = new THREE.Scene();
  scene.background = new THREE.Color("#101e29");
  scene.fog = new THREE.Fog("#101e29", 29, 65);
  const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 110);
  const controls = new OrbitControls(camera, canvas);
  controls.enableDamping = true;
  controls.dampingFactor = 0.075;
  controls.minDistance = 7;
  controls.maxDistance = 43;
  controls.maxPolarAngle = Math.PI / 2.08;
  controls.minPolarAngle = 0.16;
  controls.target.set(0, 1, 0);
  controls.screenSpacePanning = true;
  controls.zoomToCursor = true;
  controls.listenToKeyEvents(canvas);
  controls.keyPanSpeed = 12;

  scene.add(new THREE.HemisphereLight(0xc7e7ff, 0x35423b, 2.7));
  const sun = new THREE.DirectionalLight(0xffeed5, 4);
  sun.position.set(-8, 16, 11);
  sun.castShadow = true;
  sun.shadow.mapSize.set(2048, 2048);
  sun.shadow.camera.left = -18;
  sun.shadow.camera.right = 18;
  sun.shadow.camera.top = 16;
  sun.shadow.camera.bottom = -15;
  sun.shadow.camera.far = 55;
  sun.shadow.normalBias = 0.045;
  sun.shadow.bias = -0.0002;
  scene.add(sun);
  const rim = new THREE.DirectionalLight(0x72c9df, 2.2);
  rim.position.set(5, 7, -10);
  scene.add(rim);

  const mat = (color, metalness = 0.15, roughness = 0.65) => new THREE.MeshStandardMaterial({ color, metalness, roughness });
  const materials = {
    floor: mat("#24343f", 0.1, 0.9),
    platform: mat("#344955", 0.3),
    slate: mat("#516b78", 0.4),
    dark: mat("#1d2d36", 0.5),
    body: mat("#b5c9c9", 0.35),
    light: mat("#d8e1d7", 0.25),
    mint: mat("#6cbda9", 0.35),
    orange: mat("#e6a057", 0.3),
    yellow: mat("#c2a766", 0.2),
    metal: mat("#879eaa", 0.75, 0.35),
    rubber: mat("#26373c", 0.05, 0.92),
    box: mat("#bb9872", 0, 0.95),
    tape: mat("#e6c58f", 0, 0.9),
    screen: new THREE.MeshStandardMaterial({ color: "#79dfb9", emissive: "#4fae96", emissiveIntensity: 0.9, roughness: 0.4 }),
    red: new THREE.MeshStandardMaterial({ color: "#d66a50", emissive: "#722d1f", emissiveIntensity: 0.3 }),
  };
  const highlight = new THREE.MeshStandardMaterial({ color: "#ffc476", emissive: "#dc731e", emissiveIntensity: 0.55, metalness: 0.25, roughness: 0.35 });

  function mesh(parent, geometry, material, position = [0, 0, 0], rotation = [0, 0, 0]) {
    const object = new THREE.Mesh(geometry, material);
    object.position.set(...position);
    object.rotation.set(...rotation);
    object.castShadow = true;
    object.receiveShadow = true;
    object.userData.baseMaterial = material;
    parent.add(object);
    return object;
  }
  function box(parent, size, material, position, rotation) {
    return mesh(parent, new THREE.BoxGeometry(...size), material, position, rotation);
  }
  function cylinder(parent, radius, length, material, position, rotation = [0, 0, 0], bottomRadius = radius) {
    return mesh(parent, new THREE.CylinderGeometry(radius, bottomRadius, length, 24), material, position, rotation);
  }
  function beam(parent, from, to, radius, material) {
    const start = new THREE.Vector3(...from);
    const end = new THREE.Vector3(...to);
    const direction = end.clone().sub(start);
    const object = cylinder(parent, radius, direction.length(), material, start.clone().add(end).multiplyScalar(0.5).toArray());
    object.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction.normalize());
    return object;
  }
  function pipe(parent, points, radius, material) {
    const path = new THREE.CatmullRomCurve3(points.map((point) => new THREE.Vector3(...point)));
    return mesh(parent, new THREE.TubeGeometry(path, 32, radius, 8, false), material);
  }

  // Everything in the scene is procedural geometry; no textures or models are downloaded.
  const factory = new THREE.Group();
  scene.add(factory);
  box(factory, [27, 0.28, 19], materials.floor, [0, -0.2, 0]);
  const grid = new THREE.GridHelper(26, 26, 0x48606b, 0x30434f);
  grid.position.y = -0.045;
  scene.add(grid);

  // A low, open industrial backdrop keeps the entire factory visible from orbit.
  box(factory, [25, 0.42, 0.65], materials.slate, [0, 5.5, -6.9]);
  for (const x of [-11.7, -3.9, 3.9, 11.7]) {
    box(factory, [0.32, 5.5, 0.36], materials.slate, [x, 2.65, -6.9]);
    box(factory, [0.65, 0.2, 0.7], materials.dark, [x, 0.05, -6.9]);
    box(factory, [1.5, 0.12, 0.7], materials.dark, [x, 5.15, -6.9]);
    box(factory, [1.2, 0.04, 0.48], materials.screen, [x, 5.07, -6.9]);
  }
  beam(factory, [-11.7, 0.3, -6.9], [-3.9, 5.2, -6.9], 0.045, materials.slate);
  beam(factory, [3.9, 5.2, -6.9], [11.7, 0.3, -6.9], 0.045, materials.slate);
  beam(factory, [-12, 4.6, -6.5], [12, 4.6, -6.5], 0.09, materials.mint);
  beam(factory, [-12, 4.15, -6.5], [12, 4.15, -6.5], 0.065, materials.metal);
  for (let x = -11; x <= 11; x += 1.2) {
    box(factory, [0.65, 0.015, 0.08], materials.yellow, [x, -0.035, 5.6]);
  }
  box(factory, [24, 0.015, 0.06], materials.yellow, [0, -0.035, 6.2]);
  box(factory, [24, 0.015, 0.06], materials.yellow, [0, -0.035, 4.9]);
  // Pallet and crates add context without competing with the three selectable machines.
  for (let index = 0; index < 3; index++) {
    box(factory, [0.3, 0.12, 1.8], materials.box, [-9.7 + index * 0.65, 0.05, 3.8]);
  }
  for (let index = 0; index < 5; index++) {
    box(factory, [1.8, 0.1, 0.25], materials.box, [-9.05, 0.16, 3.1 + index * 0.35]);
  }
  box(factory, [1.3, 0.9, 1.15], materials.box, [-9.1, 0.65, 3.75]);
  box(factory, [0.16, 0.92, 1.17], materials.tape, [-9.1, 0.65, 3.75]);
  box(factory, [1.8, 1.2, 0.9], materials.slate, [10.6, 0.55, -4.8]);
  for (const x of [10.25, 10.95]) {
    box(factory, [0.5, 0.85, 0.025], materials.dark, [x, 0.7, -4.34]);
    box(factory, [0.035, 0.2, 0.04], materials.metal, [x + 0.15, 0.8, -4.3]);
  }

  const machineObjects = new Map();
  function setupMachine(machine) {
    const root = new THREE.Group();
    root.position.set(...machine.position);
    root.userData.machineId = machine.id;
    scene.add(root);
    box(root, [5.15, 0.2, 4.8], materials.platform, [0, 0.04, 0]);
    for (const x of [-2.35, 2.35]) {
      box(root, [0.05, 0.018, 4.35], materials.slate, [x, 0.15, 0]);
    }
    const outlinePoints = [
      [-2.55, 0.17, -2.37], [2.55, 0.17, -2.37], [2.55, 0.17, 2.37],
      [-2.55, 0.17, 2.37], [-2.55, 0.17, -2.37],
    ].map((point) => new THREE.Vector3(...point));
    const outline = new THREE.Line(new THREE.BufferGeometry().setFromPoints(outlinePoints), new THREE.LineBasicMaterial({ color: "#79e2c0" }));
    root.add(outline);
    const components = new Map();
    const marker = document.createElement("button");
    marker.type = "button";
    marker.className = "machine-marker";
    marker.innerHTML = `<span>${machine.number}</span>${machine.short}`;
    marker.setAttribute("aria-label", `Seleccionar ${machine.name}`);
    marker.addEventListener("click", () => selectMachine(machine.id));
    byId("machine-markers").append(marker);
    const entry = { root, outline, components, marker, markerPosition: new THREE.Vector3(machine.position[0], 0.3, machine.position[2] + 2.7) };
    machineObjects.set(machine.id, entry);
    return entry;
  }
  function component(entry, id, builder) {
    const group = new THREE.Group();
    group.userData.componentId = id;
    entry.root.add(group);
    builder(group);
    entry.components.set(id, group);
    return group;
  }

  const cnc = setupMachine(machines[0]);
  box(cnc.root, [3.5, 0.6, 2.85], materials.dark, [0, 0.5, 0]);
  box(cnc.root, [3.5, 3.1, 0.55], materials.body, [0, 2.25, -1.15]);
  box(cnc.root, [0.6, 3, 2.6], materials.body, [-1.45, 2.2, 0]);
  box(cnc.root, [0.6, 3, 2.6], materials.body, [1.45, 2.2, 0]);
  box(cnc.root, [3.5, 0.4, 2.85], materials.mint, [0, 3.95, 0]);
  box(cnc.root, [2.1, 0.22, 1.7], materials.metal, [0, 1.1, 0.1]);
  for (let x = -0.8; x <= 0.81; x += 0.4) {
    box(cnc.root, [0.045, 0.025, 1.5], materials.dark, [x, 1.225, 0.1]);
  }
  box(cnc.root, [0.7, 0.3, 0.65], materials.orange, [0, 1.38, 0.15]);
  box(cnc.root, [0.82, 1.4, 0.12], materials.slate, [2.03, 2.38, 0.55], [-0.15, -0.2, 0]);
  box(cnc.root, [0.59, 0.6, 0.055], materials.screen, [2.03, 2.6, 0.68], [-0.15, -0.2, 0]);
  for (const x of [1.85, 2.04, 2.23]) {
    cylinder(cnc.root, 0.055, 0.04, materials.dark, [x, 2.1, 0.7], [Math.PI / 2, 0, 0]);
  }
  cylinder(cnc.root, 0.1, 0.07, materials.red, [2.18, 1.94, 0.72], [Math.PI / 2, 0, 0]);
  component(cnc, "spindle", (group) => {
    box(group, [0.75, 1.15, 0.8], materials.mint, [0, 2.95, -0.12]);
    cylinder(group, 0.27, 0.35, materials.metal, [0, 2.25, -0.12]);
    cylinder(group, 0.075, 0.45, materials.metal, [0, 1.88, -0.12]);
  });
  component(cnc, "coolant", (group) => {
    box(group, [0.7, 0.4, 0.8], materials.slate, [-1.95, 0.4, 0.4]);
    cylinder(group, 0.2, 0.6, materials.mint, [-1.95, 0.88, 0.4]);
    cylinder(group, 0.24, 0.1, materials.dark, [-1.95, 1.2, 0.4]);
    pipe(group, [[-1.95, 0.9, 0.5], [-2.12, 1.8, 0.5], [-1.85, 2.3, 0.25], [-0.48, 2.15, 0.05]], 0.045, materials.mint);
  });
  component(cnc, "motor", (group) => {
    cylinder(group, 0.38, 0.7, materials.slate, [0.9, 4.4, -0.3], [0, 0, Math.PI / 2]);
    for (let x = 0.62; x < 1.25; x += 0.12) {
      cylinder(group, 0.4, 0.035, materials.metal, [x, 4.4, -0.3], [0, 0, Math.PI / 2]);
    }
    box(group, [0.4, 0.2, 0.4], materials.dark, [0.9, 4.04, -0.3]);
  });
  cylinder(cnc.root, 0.055, 0.4, materials.metal, [1.3, 4.34, 0.7]);
  cylinder(cnc.root, 0.11, 0.16, materials.screen, [1.3, 4.62, 0.7]);

  const conveyor = setupMachine(machines[1]);
  for (const x of [-1.65, 1.65]) {
    for (const z of [-0.65, 0.65]) {
      box(conveyor.root, [0.16, 1.35, 0.16], materials.body, [x, 0.86, z]);
      box(conveyor.root, [0.4, 0.08, 0.4], materials.dark, [x, 0.22, z]);
    }
    box(conveyor.root, [0.12, 0.14, 1.5], materials.metal, [x, 0.65, 0]);
  }
  box(conveyor.root, [4.55, 0.28, 1.6], materials.dark, [0, 1.6, 0]);
  box(conveyor.root, [3.92, 0.045, 1.4], materials.rubber, [0, 1.77, 0]);
  for (let x = -1.85; x < 1.95; x += 0.25) {
    box(conveyor.root, [0.025, 0.025, 1.39], materials.slate, [x, 1.805, 0]);
  }
  for (const z of [-0.84, 0.84]) {
    box(conveyor.root, [4.55, 0.24, 0.12], materials.mint, [0, 1.68, z]);
    box(conveyor.root, [4.1, 0.06, 0.05], materials.metal, [0, 2.05, z]);
    for (const x of [-1.65, 1.65]) {
      box(conveyor.root, [0.05, 0.4, 0.05], materials.metal, [x, 1.89, z]);
    }
  }
  for (const x of [-0.9, 0.7]) {
    box(conveyor.root, [0.8, 0.7, 0.8], materials.box, [x, 2.16, 0]);
    box(conveyor.root, [0.13, 0.71, 0.81], materials.tape, [x, 2.16, 0]);
  }
  cylinder(conveyor.root, 0.14, 1.36, materials.metal, [-2.13, 1.6, 0], [Math.PI / 2, 0, 0]);
  component(conveyor, "drive", (group) => {
    box(group, [0.6, 0.55, 0.45], materials.slate, [1.75, 1.3, 1.03]);
    cylinder(group, 0.27, 0.7, materials.mint, [1.45, 1.3, 1.08], [0, 0, Math.PI / 2]);
    for (let x = 1.2; x < 1.65; x += 0.1) {
      cylinder(group, 0.29, 0.025, materials.metal, [x, 1.3, 1.08], [0, 0, Math.PI / 2]);
    }
  });
  component(conveyor, "sensor", (group) => {
    box(group, [0.14, 1.05, 0.14], materials.metal, [-0.1, 2.15, -1.02]);
    box(group, [0.42, 0.35, 0.33], materials.orange, [-0.1, 2.62, -0.91]);
    cylinder(group, 0.09, 0.08, materials.red, [-0.1, 2.62, -0.7], [Math.PI / 2, 0, 0]);
  });
  component(conveyor, "roller", (group) => {
    cylinder(group, 0.22, 1.48, materials.metal, [2.12, 1.6, 0], [Math.PI / 2, 0, 0]);
    for (const z of [-0.93, 0.93]) {
      cylinder(group, 0.27, 0.12, materials.orange, [2.12, 1.6, z], [Math.PI / 2, 0, 0]);
    }
  });

  const robot = setupMachine(machines[2]);
  cylinder(robot.root, 0.86, 0.25, materials.dark, [-0.5, 0.33, 0]);
  cylinder(robot.root, 0.65, 0.7, materials.slate, [-0.5, 0.78, 0]);
  cylinder(robot.root, 0.7, 0.18, materials.orange, [-0.5, 1.17, 0]);
  box(robot.root, [0.65, 1.1, 0.7], materials.orange, [-0.5, 1.72, 0]);
  component(robot, "servo", (group) => {
    cylinder(group, 0.43, 0.92, materials.dark, [-0.5, 2.25, 0], [Math.PI / 2, 0, 0]);
    cylinder(group, 0.29, 0.09, materials.metal, [-0.5, 2.25, 0.51], [Math.PI / 2, 0, 0]);
    cylinder(group, 0.12, 0.11, materials.orange, [-0.5, 2.25, 0.58], [Math.PI / 2, 0, 0]);
  });
  beam(robot.root, [-0.5, 2.25, 0], [0.25, 3.65, 0], 0.27, materials.orange);
  cylinder(robot.root, 0.35, 0.68, materials.dark, [0.25, 3.65, 0], [Math.PI / 2, 0, 0]);
  cylinder(robot.root, 0.23, 0.08, materials.metal, [0.25, 3.65, 0.38], [Math.PI / 2, 0, 0]);
  beam(robot.root, [0.25, 3.65, 0], [1.45, 3.1, 0.65], 0.2, materials.orange);
  pipe(robot.root, [[-0.8, 1.6, -0.38], [-0.95, 2.8, -0.38], [0.15, 3.95, -0.38], [1.4, 3.35, 0.4]], 0.065, materials.dark);
  component(robot, "gripper", (group) => {
    cylinder(group, 0.24, 0.36, materials.metal, [1.45, 2.96, 0.65]);
    box(group, [0.65, 0.18, 0.45], materials.dark, [1.45, 2.7, 0.65]);
    for (const x of [1.2, 1.7]) {
      box(group, [0.12, 0.48, 0.18], materials.metal, [x, 2.42, 0.65]);
      box(group, [0.2, 0.09, 0.2], materials.dark, [x + (x < 1.45 ? 0.04 : -0.04), 2.22, 0.65]);
    }
  });
  box(robot.root, [1.1, 0.13, 1.1], materials.metal, [1.35, 1.3, 0.7]);
  box(robot.root, [0.2, 1.08, 0.2], materials.slate, [1.35, 0.73, 0.7]);
  box(robot.root, [0.75, 0.6, 0.75], materials.box, [1.35, 1.67, 0.7]);
  component(robot, "controller", (group) => {
    box(group, [1, 1.7, 0.8], materials.body, [-1.7, 1.05, -1.2]);
    box(group, [0.75, 1.4, 0.04], materials.slate, [-1.7, 1.07, -0.78]);
    box(group, [0.48, 0.34, 0.04], materials.screen, [-1.7, 1.45, -0.74]);
    box(group, [0.04, 0.3, 0.05], materials.metal, [-1.43, 1.02, -0.71]);
    for (let y = 0.55; y < 0.83; y += 0.07) {
      box(group, [0.45, 0.02, 0.02], materials.dark, [-1.75, y, -0.74]);
    }
  });

  const componentBox = new THREE.Box3();
  const boxHelper = new THREE.Box3Helper(componentBox, 0xffc279);
  boxHelper.material.depthTest = false;
  boxHelper.material.transparent = true;
  boxHelper.material.opacity = 0.7;
  boxHelper.renderOrder = 10;
  boxHelper.visible = false;
  scene.add(boxHelper);
  const calloutPosition = new THREE.Vector3();
  let activeComponent = null;

  function updateSelection() {
    machineObjects.forEach((entry, id) => {
      entry.outline.visible = id === selectedMachineId;
      entry.marker.setAttribute("aria-pressed", String(id === selectedMachineId));
      entry.root.traverse((object) => {
        if (object.isMesh) object.material = object.userData.baseMaterial;
      });
    });
    const entry = machineObjects.get(selectedMachineId);
    activeComponent = selectedFaultId ? entry.components.get(selectedFaultId) : null;
    boxHelper.visible = Boolean(activeComponent);
    byId("component-callout").hidden = !activeComponent;
    if (activeComponent) {
      activeComponent.traverse((object) => {
        if (object.isMesh) object.material = highlight;
      });
      activeComponent.updateWorldMatrix(true, true);
      componentBox.setFromObject(activeComponent).expandByScalar(0.12);
      componentBox.getCenter(calloutPosition);
      calloutPosition.y = componentBox.max.y + 0.12;
    }
  }

  // Distinguish deliberate clicks from OrbitControls drags and multitouch gestures.
  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();
  const activePointers = new Set();
  let clickStart = null;
  let moved = false;
  canvas.addEventListener("pointerdown", (event) => {
    activePointers.add(event.pointerId);
    if (activePointers.size > 1) {
      moved = true;
      return;
    }
    if (event.button !== 0) return;
    clickStart = { x: event.clientX, y: event.clientY, id: event.pointerId };
    moved = false;
  });
  canvas.addEventListener("pointermove", (event) => {
    if (clickStart && Math.hypot(event.clientX - clickStart.x, event.clientY - clickStart.y) > 6) moved = true;
  });
  canvas.addEventListener("pointerup", (event) => {
    activePointers.delete(event.pointerId);
    if (!clickStart || event.pointerId !== clickStart.id) return;
    const isClick = !moved && event.button === 0;
    clickStart = null;
    if (!isClick) return;
    const bounds = canvas.getBoundingClientRect();
    pointer.set(((event.clientX - bounds.left) / bounds.width) * 2 - 1, -((event.clientY - bounds.top) / bounds.height) * 2 + 1);
    raycaster.setFromCamera(pointer, camera);
    const roots = [...machineObjects.values()].map((entry) => entry.root);
    const hit = raycaster.intersectObjects(roots, true).find((intersection) => intersection.object.isMesh);
    if (!hit) return;
    let object = hit.object;
    while (object && !object.userData.machineId) object = object.parent;
    if (object) selectMachine(object.userData.machineId);
  });
  canvas.addEventListener("pointercancel", (event) => {
    activePointers.delete(event.pointerId);
    clickStart = null;
    moved = true;
  });
  canvas.addEventListener("lostpointercapture", (event) => activePointers.delete(event.pointerId));
  canvas.addEventListener("webglcontextlost", (event) => {
    event.preventDefault();
    showError(new Error("Se perdió el contexto WebGL. Recarga la página para recuperarlo."));
  });

  let width = 1;
  let height = 1;
  function resetCamera() {
    controls.target.set(0, 1, 0);
    // Fit a bounding sphere for all three machines and backdrop, including portrait viewports.
    const verticalHalfFov = THREE.MathUtils.degToRad(camera.fov / 2);
    const horizontalHalfFov = Math.atan(Math.tan(verticalHalfFov) * camera.aspect);
    const distance = Math.max(28, 14 / Math.sin(Math.min(verticalHalfFov, horizontalHalfFov)));
    const direction = new THREE.Vector3(0.78, 0.87, 1.22).normalize();
    controls.maxDistance = Math.max(43, distance * 1.35);
    camera.position.copy(controls.target).addScaledVector(direction, distance);
    controls.update();
  }
  let firstResize = true;
  function resize() {
    const oldAspect = camera.aspect;
    width = Math.max(container.clientWidth, 1);
    height = Math.max(container.clientHeight, 1);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height, false);
    if (firstResize || Math.abs(oldAspect - camera.aspect) > 0.5) resetCamera();
    firstResize = false;
  }
  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(container);
  resize();

  const projected = new THREE.Vector3();
  function projectLabel(position, element, callout = false) {
    projected.copy(position).project(camera);
    const x = (projected.x * 0.5 + 0.5) * width;
    const y = (-projected.y * 0.5 + 0.5) * height;
    const visible = projected.z >= -1 && projected.z <= 1 && x > 0 && x < width && y > 0 && y < height;
    element.style.visibility = visible ? "visible" : "hidden";
    const margin = callout ? Math.min(110, width / 2) : 65;
    element.style.left = `${Math.max(margin, Math.min(width - margin, x))}px`;
    element.style.top = `${Math.max(callout ? 90 : 25, Math.min(height - 115, y))}px`;
  }
  function animate() {
    if (document.hidden) return;
    controls.update();
    renderer.render(scene, camera);
    machineObjects.forEach((entry) => projectLabel(entry.markerPosition, entry.marker));
    if (activeComponent) projectLabel(calloutPosition, byId("component-callout"), true);
  }
  updateSelection();
  // Render the first frame immediately; initialization errors reach the loading fallback.
  animate();
  renderer.setAnimationLoop(animate);
  window.addEventListener("pagehide", () => {
    renderer.setAnimationLoop(null);
    resizeObserver.disconnect();
    controls.dispose();
    renderer.dispose();
  }, { once: true });
  // A back/forward-cache restore needs a fresh WebGL lifecycle.
  window.addEventListener("pageshow", (event) => {
    if (event.persisted) window.location.reload();
  });
  return { updateSelection, resetCamera };
}

start();
