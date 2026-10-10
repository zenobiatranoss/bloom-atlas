import { blueprints } from './blueprints'
import { notes, forms } from './notes'

const partText = {
  stem: 'A tapered tube, contoured so the head can lean toward the light. Every other part is anchored to it, and its curve sets the whole posture of the flower.',
  petals: 'Each petal is a single surface: bent along its length, cupped across its width, rippled at the edge, then repeated in rings around the head. Count the rings and the petal tally and you have the flower\u2019s identity.',
  disc: 'Hundreds of seeds are packed along a golden-angle spiral, so no seed sits directly behind another. The same packing fills pine cones, pineapples and galaxies.',
  pod: 'A rounded pod held at the centre of the head. It stays shut while the petals stand, then opens to release the seed once the bloom has fallen.',
  cluster: 'Not one flower but hundreds: tiny four-petal florets gathered into a single dome. The colour is written by the soil, acidic to blue, alkaline to pink.',
  trumpet: 'A flared trumpet drawn from one sweeping curve. It holds the scent deep inside and steers the pollinator straight to the centre.',
  stamens: 'Fine filaments rise from the middle of the head, each one tipped with a bead of pollen. They are the flower reaching out to everything around it.',
  leaves: 'Long leaves open from the stalk and angle to catch the light, feeding the bloom and shading the ground beneath it while it lasts.',
  pads: 'Flat pads rest on the surface, steadying the flower above the water and shading what lives below. Air trapped in their ribs keeps them afloat.',
  companions: 'Smaller blooms gather at the base, the way the species spreads across a field. In the wild a specimen is rarely found alone.'
}

const petalTotal = (layers) => (layers || []).reduce((sum, l) => sum + l.count, 0)

export const structureOf = (flower) => {
  const bp = blueprints[flower.id]
  const parts = [
    { id: 'stem', label: 'Stem', detail: partText.stem, at: [bp.bend[0] * 0.5, bp.headY * 0.45, bp.bend[1] * 0.5] }
  ]

  if (bp.layers && bp.layers.length) {
    parts.push({
      id: 'petals',
      label: `Petals ${petalTotal(bp.layers)}`,
      detail: partText.petals,
      at: [0, bp.headY, 0]
    })
  }

  if (bp.core && bp.core.type !== 'none') {
    const kind = bp.core.type
    const label =
      kind === 'disc'
        ? 'Seed head'
        : kind === 'pod'
          ? 'Seed pod'
          : kind === 'cluster'
            ? `Florets ${bp.core.count}`
            : 'Trumpet'
    parts.push({ id: 'core', label, detail: partText[kind === 'trumpet' ? 'trumpet' : kind], at: [0, bp.headY + 0.12, 0] })
  }

  if (bp.stamens && bp.stamens.count) {
    parts.push({
      id: 'stamens',
      label: `Stamens ${bp.stamens.count}`,
      detail: partText.stamens,
      at: [0, bp.headY + 0.2, 0]
    })
  }

  if (bp.leaves && bp.leaves.length) {
    const l = bp.leaves[0]
    const az = l.az || 0
    parts.push({
      id: 'leaves',
      label: `Leaves ${bp.leaves.length}`,
      detail: partText.leaves,
      at: [Math.sin(az) * 0.55, bp.headY * 0.42, Math.cos(az) * 0.55]
    })
  }

  if (bp.pads && bp.pads.length) {
    parts.push({
      id: 'pads',
      label: `Lily pads ${bp.pads.length}`,
      detail: partText.pads,
      at: [bp.pads[0].offset[0], 0.06, bp.pads[0].offset[1]]
    })
  }

  if (bp.companions && bp.companions.length) {
    parts.push({
      id: 'companions',
      label: `Companions ${bp.companions.length}`,
      detail: partText.companions,
      at: [bp.companions[0].off[0], bp.headY * 0.55, bp.companions[0].off[1]]
    })
  }

  return parts
}

export const recordOf = (flower) => {
  const bp = blueprints[flower.id]
  const note = notes[flower.id]
  const layers = (bp.layers || []).map((l) => l.count)
  const structure = []

  if (layers.length) structure.push(`${layers.join(' + ')} petals`)
  if (bp.core && bp.core.type !== 'none') structure.push(bp.core.type === 'cluster' ? `${bp.core.count} florets` : `${bp.core.type} core`)
  if (bp.stamens && bp.stamens.count) structure.push(`${bp.stamens.count} stamens`)
  if (bp.pads && bp.pads.length) structure.push(`${bp.pads.length} pads`)
  if (bp.leaves && bp.leaves.length) structure.push(`${bp.leaves.length} leaves`)

  return {
    season: note.season,
    habitat: note.habitat,
    form: forms[flower.petalShape],
    origin: flower.origin,
    petals: flower.cluster ? `${flower.petals} per floret` : flower.petals,
    question: note.question,
    trait: note.trait,
    practice: note.practice,
    structure: structure.join(' · ')
  }
}
