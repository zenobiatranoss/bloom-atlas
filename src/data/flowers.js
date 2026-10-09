export const flowers = [
  {
    id: 'hydrangea',
    name: 'Hydrangea',
    latin: 'Hydrangea macrophylla',
    meaning: 'Shaped by the Ground',
    philosophy: 'A hydrangea takes its color from the soil: blue in acid ground, pink where it is alkaline. Each cluster is hundreds of small florets leaning on one another, a reminder that we are made partly by where we stand, and that changing the ground can change the bloom.',
    quote: 'Change the soil and you change the color.',
    origin: 'Japan',
    petals: 4,
    petalShape: 'round',
    cluster: 37,
    colors: { primary: '#6f8fe8', secondary: '#c8d5ff', glow: '#8fb0ff', core: '#e5e0a0' }
  },
  {
    id: 'lotus',
    name: 'Lotus',
    latin: 'Nelumbo nucifera',
    meaning: 'Purity Rising From Darkness',
    philosophy: 'The lotus grows through mud and opens clean above the water. It teaches that suffering is the soil of awakening, and that origin does not decide who we become.',
    quote: 'Be untouched by the mud that made you.',
    origin: 'Asia',
    petals: 16,
    petalShape: 'pointed',
    colors: { primary: '#f4a6c8', secondary: '#fde2ee', glow: '#ff7eb6', core: '#ffd166' }
  },
  {
    id: 'sakura',
    name: 'Sakura',
    latin: 'Prunus serrulata',
    meaning: 'The Beauty of Impermanence',
    philosophy: 'Cherry blossoms bloom for days and fall in a storm of petals. Their brief life reflects mono no aware, the quiet sorrow and joy of things that do not last.',
    quote: 'Because it ends, it is precious.',
    origin: 'Japan',
    petals: 5,
    petalShape: 'notched',
    colors: { primary: '#ffc2d4', secondary: '#fff0f5', glow: '#ff9ebb', core: '#e85d75' }
  },
  {
    id: 'narcissus',
    name: 'Narcissus',
    latin: 'Narcissus poeticus',
    meaning: 'Self Reflection and Its Trap',
    philosophy: 'It bends toward the water as the myth bends toward its own image. The flower asks where self knowledge ends and self obsession begins.',
    quote: 'Look inward, but do not drown there.',
    origin: 'Mediterranean',
    petals: 6,
    petalShape: 'round',
    colors: { primary: '#fff7d6', secondary: '#ffffff', glow: '#ffe066', core: '#ff9f1c' }
  },
  {
    id: 'higanbana',
    name: 'Higanbana',
    latin: 'Lycoris radiata',
    meaning: 'Farewell and Longing',
    philosophy: 'The red spider lily blooms without leaves, for leaves and flowers never meet. It stands for separation, memory, and the threshold between the living and the dead.',
    quote: 'Some things bloom only where they cannot be touched.',
    origin: 'East Asia',
    petals: 6,
    petalShape: 'curled',
    colors: { primary: '#d90429', secondary: '#ff4d6d', glow: '#ff1744', core: '#8d0801' }
  },
  {
    id: 'sunflower',
    name: 'Sunflower',
    latin: 'Helianthus annuus',
    meaning: 'Devotion to the Light',
    philosophy: 'Young sunflowers follow the sun across the sky. They embody faith, orientation, and the discipline of turning toward what gives life.',
    quote: 'Face the light and the shadows fall behind you.',
    origin: 'Americas',
    petals: 21,
    petalShape: 'pointed',
    colors: { primary: '#ffbe0b', secondary: '#ffd60a', glow: '#ffc300', core: '#5c3d12' }
  },
  {
    id: 'lily',
    name: 'Lily',
    latin: 'Lilium candidum',
    meaning: 'Renewal of the Soul',
    philosophy: 'The lily has long stood for rebirth and the clarity that follows letting go. Its open throat is a symbol of honesty with nothing hidden.',
    quote: 'Return to the self that was never stained.',
    origin: 'Europe',
    petals: 6,
    petalShape: 'curled',
    colors: { primary: '#ffffff', secondary: '#f1f5f9', glow: '#bde0fe', core: '#f9c74f' }
  }
]

export const flowerById = Object.fromEntries(flowers.map((f) => [f.id, f]))
