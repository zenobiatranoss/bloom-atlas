export const blueprints = {
  lotus: {
    position: [0, 0, 0],
    headY: 1.35,
    lookY: 1.15,
    camDist: 4.4,
    shift: 1.25,
    bend: [0.18, 0],
    stem: { radius: 0.045, color: '#5d8a58' },
    tilt: [0.28, 0],
    colors: { base: '#fff1f6', mid: '#f9bcd6', tip: '#e86fa3' },
    layers: [
      { count: 10, shape: 'pointed', length: 1.2, width: 0.3, bend: 0.55, cup: 0.45, closed: 0.18, open: 1.18, lift: 0 },
      { count: 8, shape: 'pointed', length: 1.05, width: 0.3, bend: 0.5, cup: 0.5, closed: 0.12, open: 0.86, lift: 0.02, offset: 0.06 },
      { count: 7, shape: 'pointed', length: 0.9, width: 0.28, bend: 0.45, cup: 0.5, closed: 0.1, open: 0.58, lift: 0.04 },
      { count: 5, shape: 'pointed', length: 0.7, width: 0.26, bend: 0.4, cup: 0.5, closed: 0.08, open: 0.34, lift: 0.06, offset: 0.1 }
    ],
    core: { type: 'pod', color: '#d9c94a', top: '#a9b53a' },
    stamens: { count: 46, length: 0.34, spread: 0.22, lift: 0.8, filament: '#ffe08a', tip: '#f2b705', tipRadius: 0.014, thick: 0.005 },
    pads: [
      { radius: 1.35, offset: [0.55, 0.7], color: '#2f5f3a', rim: '#79a85f' },
      { radius: 0.8, offset: [-1.15, 0.55], color: '#2f5f3a', rim: '#6f9f58' },
      { radius: 0.55, offset: [1.1, -1.2], color: '#2f5f3a', rim: '#7aa95f' }
    ],
    leaves: [],
    companions: [
      { off: [1.75, -0.35], scale: 0.62, rot: 0.4, open: 0 },
      { off: [-0.5, -1.35], scale: 0.5, rot: 2.1, open: 0.02 }
    ]
  },
  sakura: {
    position: [2.8, 0, -1.4],
    headY: 1.9,
    lookY: 1.6,
    camDist: 3.9,
    shift: 1.1,
    bend: [0.55, 0.15],
    stem: { radius: 0.05, color: '#5a3d33' },
    tilt: [0.95, 0],
    colors: { base: '#e7607a', mid: '#ffd0dc', tip: '#fff4f7' },
    layers: [
      { count: 5, shape: 'notched', length: 0.6, width: 0.3, bend: 0.5, cup: 0.22, closed: 0.3, open: 1.3, radius: 0.04 }
    ],
    core: { type: 'none' },
    stamens: { count: 28, length: 0.34, spread: 0.3, lift: 0.7, filament: '#ffd6e0', tip: '#c2185b', tipRadius: 0.013, thick: 0.004 },
    extras: [
      { t: 0.45, off: [0.45, 0.1, 0.2], scale: 0.62, tilt: [0.8, 0.6] },
      { t: 0.7, off: [-0.5, 0.2, 0.1], scale: 0.5, tilt: [0.9, -0.7] },
      { t: 0.25, off: [0.4, 0.05, 0.3], scale: 0.42, tilt: [0.5, 0.9] }
    ],
    leaves: []
  },
  narcissus: {
    position: [-2.7, 0, -1],
    headY: 1.7,
    lookY: 1.45,
    camDist: 3.9,
    shift: 1.1,
    bend: [-0.3, 0.1],
    stem: { radius: 0.04, color: '#6b9a54' },
    tilt: [1.2, 0.08],
    colors: { base: '#fff3b0', mid: '#fffbe6', tip: '#ffffff' },
    layers: [
      { count: 6, shape: 'round', length: 0.75, width: 0.34, bend: 0.18, cup: 0.15, closed: 0.5, open: 1.5, lift: 0 },
      { count: 6, shape: 'round', length: 0.7, width: 0.3, bend: 0.18, cup: 0.15, closed: 0.5, open: 1.45, lift: 0.01, offset: 0.5 }
    ],
    core: { type: 'trumpet', color: '#ff9f1c', rim: '#ffd166' },
    stamens: null,
    leaves: [
      { t: 0.02, az: 0.4, open: 0.28, length: 1.7, width: 0.11, bend: 0.9 },
      { t: 0.02, az: 2.2, open: 0.22, length: 1.5, width: 0.1, bend: 0.8 },
      { t: 0.02, az: 3.9, open: 0.3, length: 1.6, width: 0.11, bend: 0.95 },
      { t: 0.02, az: 5.4, open: 0.2, length: 1.35, width: 0.1, bend: 0.7 }
    ],
    companions: [
      { off: [0.55, 0.3], scale: 0.82, rot: 0.5, follow: true },
      { off: [-0.5, 0.45], scale: 0.74, rot: -0.4, follow: true },
      { off: [0.1, -0.55], scale: 0.9, rot: 0.2, follow: true }
    ]
  },
  higanbana: {
    position: [5.4, 0, -3],
    headY: 1.5,
    lookY: 1.9,
    camDist: 5.2,
    shift: 1.2,
    bend: [0.05, 0],
    stem: { radius: 0.035, color: '#7a9a55' },
    tilt: [0.12, 0],
    colors: { base: '#8d0801', mid: '#d90429', tip: '#ff4d6d' },
    layers: [
      { count: 6, shape: 'curled', length: 0.95, width: 0.11, bend: 2.1, cup: 0.1, wave: 2, closed: 0.5, open: 0.95, lift: 0 }
    ],
    core: { type: 'none' },
    stamens: { count: 9, length: 1.5, spread: 1.15, lift: 0.95, filament: '#ff2a4d', tip: '#7a0010', tipRadius: 0.02, thick: 0.008 },
    leaves: [],
    companions: [
      { off: [0.7, 0.35], scale: 0.86, rot: 0.8, follow: true },
      { off: [-0.65, 0.25], scale: 0.78, rot: 2.2, follow: true },
      { off: [0.25, -0.65], scale: 0.92, rot: 4, follow: true },
      { off: [-0.5, -0.6], scale: 0.7, rot: 5.2, follow: true }
    ]
  },
  sunflower: {
    position: [-5.4, 0, -2.6],
    headY: 2.3,
    lookY: 2.1,
    camDist: 6.4,
    shift: 1.7,
    bend: [0.25, 0],
    stem: { radius: 0.085, color: '#5d8a3f' },
    tilt: [1.1, 0],
    hit: [1.45, 1.35],
    colors: { base: '#e8a317', mid: '#ffbe0b', tip: '#ffd84a' },
    layers: [
      { count: 21, shape: 'pointed', length: 0.95, width: 0.15, bend: 0.35, cup: 0.12, closed: 0.5, open: 1.5, radius: 0.58 },
      { count: 21, shape: 'pointed', length: 0.85, width: 0.14, bend: 0.3, cup: 0.12, closed: 0.5, open: 1.4, radius: 0.56, lift: 0.02, offset: 0.5 }
    ],
    core: { type: 'disc', radius: 0.6, inner: '#2b1a0c', outer: '#6b4a1e', seed: '#9a7a2e' },
    stamens: null,
    leaves: [
      { t: 0.3, az: 0.6, open: 1.0, length: 1.2, width: 0.5, bend: 0.7 },
      { t: 0.5, az: 3.7, open: 1.1, length: 1.05, width: 0.45, bend: 0.8 },
      { t: 0.15, az: 2.2, open: 0.95, length: 1.3, width: 0.52, bend: 0.6 }
    ],
    companions: [
      { off: [1.5, -1.2], scale: 0.8, rot: -0.35, follow: true },
      { off: [-1.2, -1.5], scale: 0.72, rot: 0.4, follow: true },
      { off: [0.4, -2.2], scale: 0.9, rot: 0.1, follow: true }
    ]
  },
  lily: {
    position: [0, 0, -3.6],
    headY: 1.9,
    lookY: 2,
    camDist: 5,
    shift: 1.2,
    bend: [-0.2, 0],
    stem: { radius: 0.05, color: '#6f9a5c' },
    tilt: [0.6, 0],
    colors: { base: '#e8f5c8', mid: '#ffffff', tip: '#f4f1ee' },
    layers: [
      { count: 3, shape: 'pointed', length: 1.15, width: 0.32, bend: 1.3, cup: 0.3, closed: 0.3, open: 1, lift: 0 },
      { count: 3, shape: 'pointed', length: 1.1, width: 0.36, bend: 1.2, cup: 0.3, closed: 0.3, open: 0.95, lift: 0.01, offset: 0.5 }
    ],
    core: { type: 'none' },
    stamens: { count: 6, length: 0.9, spread: 0.45, lift: 0.85, filament: '#efe9cf', tip: '#a1460f', tipRadius: 0.045, thick: 0.01 },
    leaves: [
      { t: 0.25, az: 0.3, open: 0.9, length: 1.0, width: 0.1, bend: 0.3 },
      { t: 0.4, az: 2.6, open: 1.0, length: 0.95, width: 0.1, bend: 0.35 },
      { t: 0.55, az: 4.7, open: 0.95, length: 0.85, width: 0.09, bend: 0.3 }
    ],
    companions: [
      { off: [0.7, -0.3], scale: 0.6, rot: 0.5, open: 0 },
      { off: [-0.65, -0.45], scale: 0.52, rot: 3.1, open: 0 }
    ]
  },
  hydrangea: {
    position: [8.6, 0, -0.2],
    headY: 1.35,
    lookY: 1.6,
    camDist: 4.8,
    shift: 1.3,
    bend: [-0.15, 0.05],
    stem: { radius: 0.055, color: '#6a8c52' },
    tilt: [0.08, 0],
    hit: [1.6, 1.1],
    colors: { base: '#ffffff', mid: '#ffffff', tip: '#ffffff' },
    layers: [],
    core: {
      type: 'cluster',
      radius: 0.8,
      count: 190,
      arc: 2.1,
      lift: 0.5,
      size: 1,
      floret: { base: '#f5f7ff', mid: '#ffffff', tip: '#e9eeff' },
      mix: ['#6f8fe8', '#93a9f4', '#b79af0']
    },
    stamens: null,
    leaves: [
      { t: 0.22, az: 0.2, open: 1.15, length: 0.95, width: 0.5, bend: 0.8, shape: 'round', wave: 0.6 },
      { t: 0.22, az: 3.34, open: 1.15, length: 0.9, width: 0.48, bend: 0.8, shape: 'round', wave: 0.6 },
      { t: 0.42, az: 1.8, open: 1.05, length: 0.85, width: 0.46, bend: 0.75, shape: 'round', wave: 0.6 },
      { t: 0.42, az: 4.94, open: 1.05, length: 0.88, width: 0.47, bend: 0.75, shape: 'round', wave: 0.6 },
      { t: 0.6, az: 0.5, open: 0.95, length: 0.7, width: 0.4, bend: 0.7, shape: 'round', wave: 0.6 },
      { t: 0.6, az: 3.64, open: 0.95, length: 0.72, width: 0.4, bend: 0.7, shape: 'round', wave: 0.6 }
    ],
    companions: [
      { off: [0.95, -0.3], scale: 0.76, rot: 0.3, follow: true },
      { off: [-0.9, -0.55], scale: 0.64, rot: -0.2, follow: true }
    ]
  }
}
