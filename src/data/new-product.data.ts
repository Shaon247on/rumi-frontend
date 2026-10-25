import elaraPedestals from '@/assets/image/elara-pedestals.jpg'
import elaraFaceClose from '@/assets/image/elara-face-close.jpg'
import elaraPackaging from '@/assets/image/elara-packaging.jpg'
import elaraMirror from '@/assets/image/elara-mirror.jpg'

import elaraSerum from '@/assets/products/elara-serum.jpg'
import comingSoonImage from '@/assets/products/Box/Serum-Dropper-box.png'
import aurumCleanser from '@/assets/products/aurum-cleanser.jpg'
import satinLipOil from '@/assets/products/satin-lip-oil.png'
import platinumCream from '@/assets/products/platinum-cream.png'
import chronoBalm from '@/assets/products/chrono-balm.jpg'
import silkFluid from '@/assets/products/silk-fluid.jpg'

import { StaticImageData } from 'next/image'

export type Product = {
  id: string
  name: string
  shade: string
  price: number
  rating: number
  category: 'cleansers' | 'serums' | 'moisturizers' | 'lips' | 'face' | 'treatments' | 'sets'
  image: StaticImageData
  gallery: StaticImageData[]
  comingSoon?: boolean
}

export const products: Product[] = [
  {
    id: 'elara-recovery-serum',
    name: 'Elara Recovery Serum',
    shade: 'Signature',
    price: 345,
    rating: 5,
    category: 'serums',
    image: elaraSerum,
    gallery: [elaraSerum, elaraPackaging, elaraFaceClose, elaraMirror, elaraPedestals],
    comingSoon: false,
  },
  {
    id: 'aurum-cleanser',
    name: 'Aurum Botanical Cleansing Nectar',
    shade: '24K Gold-Infused',
    price: 295,
    rating: 5,
    category: 'cleansers',
    image: comingSoonImage,
    gallery: [comingSoonImage],
    comingSoon: true,
  },
  {
    id: 'satin-lip-oil',
    name: 'Satin Lip Infusion Oil',
    shade: 'Liquid Silk',
    price: 195,
    rating: 5,
    category: 'lips',
    image: comingSoonImage,
    gallery: [comingSoonImage],
    comingSoon: true,
  },
  {
    id: 'platinum-cream',
    name: 'Platinum Peptide Renewal Cream',
    shade: 'Cellular Repair',
    price: 420,
    rating: 5,
    category: 'moisturizers',
    image: comingSoonImage,
    gallery: [comingSoonImage],
    comingSoon: true,
  },
  {
    id: 'chrono-balm',
    name: 'Overnight Chrono-Active Balm',
    shade: 'Midnight Metamorphosis',
    price: 385,
    rating: 5,
    category: 'treatments',
    image: comingSoonImage,
    gallery: [comingSoonImage],
    comingSoon: true,
  },
  {
    id: 'silk-fluid',
    name: 'Solar Protective Silk Fluid',
    shade: 'Invisible SPF 50',
    price: 310,
    rating: 5,
    category: 'serums',
    image: comingSoonImage,
    gallery: [comingSoonImage],
    comingSoon: true,
  },
]

export const getProduct = (id: string) => products.find((p) => p.id === id)
