import {
  SiHtml5,
  SiCss3,
  SiJavascript,
  SiTypescript,
  SiReact,
  SiNextdotjs,
  SiVuedotjs,
  SiNodedotjs,
  SiExpress,
  SiMongodb,
  SiMysql,
  SiPostgresql,
  SiGit,
  SiGithub,
  SiTailwindcss,
  SiPython,
  SiDocker,
  SiGraphql,
  SiRedux,
  SiSvelte,
  SiFigma,
  SiLinux,
} from 'react-icons/si';
import {
  FaHtml5,
  FaCss3Alt,
  FaJs,
  FaReact,
  FaNodeJs,
  FaDatabase,
  FaCode,
  FaServer,
} from 'react-icons/fa';
import { FiCode } from 'react-icons/fi';

const ICON_MAP = {
  // Simple Icons
  SiHtml5,
  SiCss3,
  SiJavascript,
  SiTypescript,
  SiReact,
  SiNextdotjs,
  SiVuedotjs,
  SiNodedotjs,
  SiExpress,
  SiMongodb,
  SiMysql,
  SiPostgresql,
  SiGit,
  SiGithub,
  SiTailwindcss,
  SiPython,
  SiDocker,
  SiGraphql,
  SiRedux,
  SiSvelte,
  SiFigma,
  SiLinux,

  // FontAwesome Icons
  FaHtml5,
  FaCss3Alt,
  FaJs,
  FaReact,
  FaNodeJs,
  FaDatabase,
  FaCode,
  FaServer,
};

const NAME_FALLBACK_MAP = {
  html: SiHtml5,
  css: SiCss3,
  javascript: SiJavascript,
  js: SiJavascript,
  typescript: SiTypescript,
  ts: SiTypescript,
  react: SiReact,
  'react.js': SiReact,
  next: SiNextdotjs,
  'next.js': SiNextdotjs,
  vue: SiVuedotjs,
  'vue.js': SiVuedotjs,
  node: SiNodedotjs,
  'node.js': SiNodedotjs,
  express: SiExpress,
  'express.js': SiExpress,
  mongodb: SiMongodb,
  mysql: SiMysql,
  postgres: SiPostgresql,
  postgresql: SiPostgresql,
  git: SiGit,
  github: SiGithub,
  tailwind: SiTailwindcss,
  'tailwind css': SiTailwindcss,
  python: SiPython,
  docker: SiDocker,
  graphql: SiGraphql,
  redux: SiRedux,
  svelte: SiSvelte,
  figma: SiFigma,
  linux: SiLinux,
};

export default function SkillIcon({ iconIdentifier, skillName, className = 'h-5 w-5' }) {
  // 1. Direct match on iconIdentifier
  if (iconIdentifier && ICON_MAP[iconIdentifier]) {
    const IconComponent = ICON_MAP[iconIdentifier];
    return <IconComponent className={className} />;
  }

  // 2. Fallback based on lowercase skillName
  if (skillName) {
    const normalized = skillName.trim().toLowerCase();
    if (NAME_FALLBACK_MAP[normalized]) {
      const IconComponent = NAME_FALLBACK_MAP[normalized];
      return <IconComponent className={className} />;
    }
  }

  // 3. Graceful fallback icon
  return <FiCode className={className} />;
}
