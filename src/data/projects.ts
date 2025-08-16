export interface ProjectData {
  id: string;
  title: string;
  description: string;
  date: string;
  imageSrc: string;
  imageAlt: string;
  tags: string[];
  isPrototype?: boolean;
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
