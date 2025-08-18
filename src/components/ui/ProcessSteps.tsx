'use client';

const processSteps = [
  {
    id: 1,
    title: 'Найди «свой» проект',
    description: 'Персональная подборка стартапов под твои навыки и интересы',
    imageSrc: '/images/path_1.png',
    imageAlt: 'Поиск проекта',
    blurLevel: 'backdrop-blur-[15px]',
    imageSize: 'w-[360px] h-[210px]',
  },
  {
    id: 2,
    title: 'Подайся одним кликом',
    description: 'Отправь анкету — пройди легкий отбор',
    imageSrc: '/images/path_2.png',
    imageAlt: 'Подача заявки',
    blurLevel: 'backdrop-blur-[15px]',
    imageSize: 'w-[360px] h-[210px]',
  },
  {
    id: 3,
    title: 'Работай → Расти → Создавай',
    description:
      'Получай опыт, кейсы в портфолио и помогай привлекать инвестиции',
    imageSrc: '/images/path_3.png',
    imageAlt: 'Работа и рост',
    blurLevel: 'backdrop-blur-[5px]',
    imageSize: 'w-[360px] h-[210px]',
  },
];

export function ProcessSteps() {
  return (
    <section className="relative py-20 px-5 overflow-hidden">
      {/* Заголовок */}
      <div className="text-center mb-20">
        <h2 className="text-4xl md:text-5xl font-unbounded font-normal leading-tight">
          <span className="bg-gradient-to-t from-gray-400/30 to-white bg-clip-text text-transparent">
            Твой путь в IT-стартапе
          </span>
          <br />
          <span className="bg-gradient-to-t from-gray-400/30 to-white bg-clip-text text-transparent">
            — просто и быстро
          </span>
        </h2>
      </div>

      {/* Контейнер для карточек */}
      <div className="max-w-7xl mx-auto relative">
        {/* Карточки процесса */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          {processSteps.map(step => (
            <div
              key={step.id}
              className={`relative ${step.blurLevel} backdrop-filter h-[527px] rounded-[40px] border-[3px] border-white/50 border-solid overflow-hidden`}
            >
              {/* Контент карточки */}
              <div className="relative z-10 h-full flex flex-col gap-6 pt-[30px] pb-5 px-10">
                {/* Номер и заголовок */}
                <div className="text-white text-left w-full">
                  <div className="text-2xl font-unbounded font-normal mb-2">
                    {step.id}.
                  </div>
                  <h3 className="text-xl font-unbounded font-normal leading-tight">
                    {step.title}
                  </h3>
                </div>

                {/* Описание */}
                <div className="text-white/46 font-montserrat text-lg leading-relaxed text-left w-full">
                  {step.description}
                </div>

                {/* Фоновое изображение внизу карточки */}
                <div className="flex-1 flex items-end justify-center">
                  <div
                    className="w-full max-w-[360px] h-[180px] md:h-[210px] opacity-80 mb-8"
                    style={{
                      backgroundImage: `url('${step.imageSrc}')`,
                      backgroundSize: 'contain',
                      backgroundPosition: 'center',
                      backgroundRepeat: 'no-repeat',
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
