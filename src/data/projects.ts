export interface ProjectData {
  id: string;
  title: string;
  description: string;
  date: string;
  imageSrc: string;
  imageAlt: string;
  tags: string[];
  isPrototype?: boolean;
  stage?: string; // "прототип", "разработка", "идея", etc.
  status?: string; // "прототип", "MVP", "бета", etc.
  teamSize?: string; // "до 20 чел", "5-10 чел", etc.
}

export const projectsData: ProjectData[] = [
  {
    id: '1',
    title: 'дневник здоровья с AI-анализом',
    description:
      'Sed ut perspiciatis, unde omnis iste voluptatem perspiciatis omnis iste sed ut unde omnis sed ut',
    date: '12/03/2024',
    imageSrc: '/images/fon1.png',
    imageAlt: 'Дневник здоровья',
    tags: ['#рефлексия', '#игра', '#медицина', '#ИИ', '#здоровье'],
    stage: 'разработка',
    status: 'MVP',
    teamSize: '5-10 чел',
  },
  {
    id: '2',
    title: 'Мобильное приложение "Честно"',
    description:
      'Sed ut perspiciatis, unde omnis iste voluptatem perspiciatis omnis iste sed ut unde omnis sed ut',
    date: '12/03/2025',
    imageSrc: '/images/fon2.png',
    imageAlt: 'Приложение Честно',
    tags: ['#рефлексия', '#игра', '#друзья', '#знакомство', '#сближение'],
    isPrototype: true,
    stage: 'прототип',
    status: 'прототип',
    teamSize: 'до 20 чел',
  },
  {
    id: '3',
    title: 'EduMind – платформа с курсами',
    description:
      'Sed ut perspiciatis, unde omnis iste voluptatem perspiciatis omnis iste sed ut unde omnis sed ut',
    date: '11/04/2025',
    imageSrc: '/images/fon3.png',
    imageAlt: 'Платформа EduMind',
    tags: ['#курсы', '#обучение', '#ИИ', '#нейросети', '#анализ'],
    stage: 'идея',
    status: 'концепт',
    teamSize: '3-5 чел',
  },
  {
    id: '4',
    title: 'GreenScan – анализ',
    description:
      'Sed ut perspiciatis, unde omnis iste voluptatem perspiciatis omnis iste sed ut unde omnis sed ut',
    date: '09/01/2024',
    imageSrc: '/images/fon2.png',
    imageAlt: 'GreenScan анализ',
    tags: ['#анализ', '#углерод', '#неросети', '#знакомство', '#сближение'],
    stage: 'разработка',
    status: 'бета',
    teamSize: '5-10 чел',
  },
  {
    id: '5',
    title: 'Соцсеть поиска друзей "VibeMatch"',
    description:
      'Sed ut perspiciatis, unde omnis iste voluptatem perspiciatis omnis iste sed ut unde omnis sed ut',
    date: '08/03/2025',
    imageSrc: '/images/fon1.png',
    imageAlt: 'VibeMatch',
    tags: ['#друзья', '#соцсеть', '#сервис', '#знакомство', '#поиск'],
    isPrototype: true,
    stage: 'прототип',
    status: 'прототип',
    teamSize: 'до 20 чел',
  },
  {
    id: '6',
    title: 'Мобильное приложение "Честно"',
    description:
      'Sed ut perspiciatis, unde omnis iste voluptatem perspiciatis omnis iste sed ut unde omnis sed ut',
    date: '12/03/2025',
    imageSrc: '/images/fon3.png',
    imageAlt: 'Приложение Честно',
    tags: ['#рефлексия', '#игра', '#друзья', '#знакомство', '#сближение'],
    isPrototype: true,
    stage: 'прототип',
    status: 'прототип',
    teamSize: '5-10 чел',
  },
  {
    id: '7',
    title: 'Бронирование зарядок с "AutoCharge"',
    description:
      'Sed ut perspiciatis, unde omnis iste voluptatem perspiciatis omnis iste sed ut unde omnis sed ut',
    date: '22/05/2025',
    imageSrc: '/images/fon1.png',
    imageAlt: 'AutoCharge',
    tags: ['#бронирование', '#charge', '#mobile', '#стартап', '#application'],
    isPrototype: true,
    stage: 'прототип',
    status: 'MVP',
    teamSize: 'до 20 чел',
  },
  {
    id: '8',
    title: 'FaceLock – биометрический замок',
    description:
      'Sed ut perspiciatis, unde omnis iste voluptatem perspiciatis omnis iste sed ut unde omnis sed ut',
    date: '12/03/2025',
    imageSrc: '/images/fon2.png',
    imageAlt: 'FaceLock',
    tags: ['#биометрия', '#безопасность', '#facelock', '#security', '#защита'],
    stage: 'идея',
    status: 'концепт',
    teamSize: '3-5 чел',
  },
];

export const infoCardsData = [
  {
    title: 'Построй своё портфолио',
    description: 'и найди первых заказчиков',
  },
  {
    title: 'Участвуй в проектах',
    description: 'и учись на практике',
  },
  {
    title: 'Попади в команду с ментором',
  },
];
