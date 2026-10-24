import { slugify } from '../models/portfolioModels.js';

const img1 = new URL('../assets/Screenshot from 2026-04-24 11-36-31.png', import.meta.url).href;
const img2 = new URL('../assets/Screenshot from 2026-04-24 09-59-39.png', import.meta.url).href;
const profilePhoto = new URL('../assets/profile-photo.png', import.meta.url).href;

/**
 * Initial Seed Projects extracted from existing portfolio components
 */
export const SEED_PROJECTS = [
  {
    id: 'proj_ecommerce_bookstore',
    title: 'Book Store E-Commerce Website',
    slug: slugify('Book Store E-Commerce Website'),
    shortDescription:
      'A fully responsive e-commerce bookstore with product listing, category filtering, and shopping cart system.',
    fullDescription:
      'Developed a fully responsive e-commerce bookstore using React.js and Tailwind CSS. Implemented product listing, category filtering, and a shopping cart system with API integration. Focused on clean UI, reusable components, and smooth user experience.',
    category: 'Frontend',
    technologies: ['React', 'Tailwind'],
    imageUrl: img1,
    additionalImages: [],
    githubUrl: 'https://github.com/tareqthrwat/Ecommercelibrary',
    liveUrl: 'https://ecommercelibrary-9kid5tlyq-tareks-projects-343b86d1.vercel.app/',
    featured: true,
    visibility: 'public',
    order: 1,
    createdAt: '2026-04-24T10:00:00.000Z',
  },
  {
    id: 'proj_synapse_analytics',
    title: 'Synapse Analytics',
    slug: slugify('Synapse Analytics'),
    shortDescription:
      'An AI dashboard concept that turns product and performance metrics into a cinematic command center experience.',
    fullDescription:
      'An AI dashboard concept that turns product and performance metrics into a cinematic command center experience with live telemetry and modular data components.',
    category: 'Frontend',
    technologies: ['React', 'Analytics', 'Tailwind'],
    imageUrl: img2,
    additionalImages: [],
    githubUrl: 'https://github.com/tareqthrwat/E-Comares',
    liveUrl: 'https://e-comares-9sn4ivvka-tareks-projects-343b86d1.vercel.app',
    featured: true,
    visibility: 'public',
    order: 2,
    createdAt: '2026-04-24T11:00:00.000Z',
  },
  {
    id: 'proj_orbital_studio',
    title: 'Orbital Studio',
    slug: slugify('Orbital Studio'),
    shortDescription:
      'A bold creative portfolio for launching brands with motion-led narratives and responsive visual identity systems.',
    fullDescription:
      'A bold creative portfolio for launching brands with motion-led narratives and responsive visual identity systems, combining dynamic layouts with interactive micro-animations.',
    category: 'Full Stack',
    technologies: ['React', 'UI Engineering', 'Responsive UX'],
    imageUrl: 'STUDIO//LAB',
    additionalImages: [],
    githubUrl: 'https://github.com/',
    liveUrl: 'https://example.com',
    featured: false,
    visibility: 'public',
    order: 3,
    createdAt: '2026-04-24T12:00:00.000Z',
  },
];

/**
 * Initial Seed Skills extracted from existing portfolio components
 */
export const SEED_SKILLS = [
  {
    id: 'skill_html',
    name: 'HTML',
    category: 'Frontend',
    iconIdentifier: 'FaHtml5',
    proficiency: 96,
    displayOrder: 1,
    visibility: 'public',
  },
  {
    id: 'skill_css',
    name: 'CSS',
    category: 'Frontend',
    iconIdentifier: 'FaCss3Alt',
    proficiency: 93,
    displayOrder: 2,
    visibility: 'public',
  },
  {
    id: 'skill_javascript',
    name: 'JavaScript',
    category: 'Frontend',
    iconIdentifier: 'FaJs',
    proficiency: 90,
    displayOrder: 3,
    visibility: 'public',
  },
  {
    id: 'skill_react',
    name: 'React',
    category: 'Frontend',
    iconIdentifier: 'FaReact',
    proficiency: 92,
    displayOrder: 4,
    visibility: 'public',
  },
  {
    id: 'skill_tailwind',
    name: 'Tailwind CSS',
    category: 'Frontend',
    iconIdentifier: 'SiTailwindcss',
    proficiency: 95,
    displayOrder: 5,
    visibility: 'public',
  },
];

/**
 * Initial Portfolio Settings extracted from Hero and existing bio
 */
export const SEED_SETTINGS = {
  developerName: 'Tarek',
  professionalTitle: 'Frontend Developer | React Specialist',
  aboutMe:
    'Still learning, still building, and focusing on what actually matters. Future-ready frontend systems with component-driven architecture, cinematic motion, and scalable UI systems.',
  email: '',
  githubUrl: 'https://github.com/tareqthrwat',
  linkedinUrl: 'https://linkedin.com',
  resumeUrl: '',
  profileImageUrl: profilePhoto,
};
