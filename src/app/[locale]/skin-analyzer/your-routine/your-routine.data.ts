export type Product = {
  step: number
  name: string
  brand: string
  type: string
  instruction: string
  price: string
  image: string
}

export const morningProducts: Product[] = [
  {
    step: 1,
    name: 'Gentle Cleansing Gel',
    brand: 'PureGlow',
    type: 'Cleanser',
    instruction: 'Massage gently onto damp skin for 30 seconds, then rinse with lukewarm water.',
    price: '$24.00',
    image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=200&h=200&fit=crop',
  },
  {
    step: 2,
    name: 'Hydrating Essence Serum',
    brand: 'GlowLab',
    type: 'Serum',
    instruction: 'Apply 2-3 drops to clean, damp skin. Pat gently until absorbed.',
    price: '$42.00',
    image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=200&h=200&fit=crop',
  },
]

export const eveningProducts: Product[] = [
  {
    step: 1,
    name: 'Gentle Cleansing Gel',
    brand: 'PureGlow',
    type: 'Cleanser',
    instruction: 'Massage gently onto damp skin for 30 seconds, then rinse with lukewarm water.',
    price: '$24.00',
    image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=200&h=200&fit=crop',
  },
  {
    step: 2,
    name: 'Hydrating Essence Serum',
    brand: 'GlowLab',
    type: 'Serum',
    instruction: 'Apply 2-3 drops to clean, damp skin. Pat gently until absorbed.',
    price: '$42.00',
    image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=200&h=200&fit=crop',
  },
]
