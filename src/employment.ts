import type { ImageProps } from 'next/image'

export interface Role {
  company: string
  title: string
  url: string
  logo: ImageProps['src']
  between: [string, string]
}

export const employment: Array<Role> = [
  {
    company: 'BPP Education Group',
    title: 'Principal Software Engineer',
    url: 'https://www.bpp.com',
    logo: '/logos/bpp.jpeg',
    between: ['2023', 'Present'],
  },
  {
    company: 'Tech City Ventures',
    title: 'Head of Technology',
    url: '/employment/techcityventures',
    logo: '/logos/techcityventures.jpg',
    between: ['2022', '2023'],
  },
  {
    company: 'Real Links',
    title: 'CTO / Lead Engineer',
    url: '/employment/real-links',
    logo: '/logos/real-links.jpeg',
    between: ['2019', '2022'],
  },
  {
    company: 'muzmatch',
    title: 'Senior Backend Engineer',
    url: '/employment/muzmatch',
    logo: '/logos/muzmatch.jpg',
    between: ['2017', '2018'],
  },
  {
    company: 'Car Throttle',
    title: 'Senior Engineer',
    url: '/employment/car-throttle',
    logo: '/logos/car-throttle.jpg',
    between: ['2015', '2017'],
  },
  {
    company: 'Mindwork Labs',
    title: 'Junior Developer / Senior Developer',
    url: '/employment/mindwork-labs',
    logo: '/logos/mindworklabs.png',
    between: ['2012', '2014'],
  },
]
