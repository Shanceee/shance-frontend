'use client';

import { useState } from 'react';
import Image from 'next/image';

interface FAQItem {
  id: number;
  question: string;
  answer: string;
}

export function FAQSection() {
  const [openItems, setOpenItems] = useState<number[]>([]);

  const faqItems: FAQItem[] = [
    {
      id: 1,
      question: 'Кто стоит за проектом?',
      answer:
        'Мы команда профессионалов с опытом в IT и стартап-экосистеме. Наша миссия - соединить талантливых разработчиков с перспективными проектами.',
    },
    {
      id: 2,
      question: 'Почему мы делаем это?',
      answer:
        'Мы верим, что каждый талантливый разработчик заслуживает возможности работать над интересными проектами и расти профессионально.',
    },
    {
      id: 3,
      question: 'Безопасно ли здесь оставлять свои данные и идеи?',
      answer:
        'Да, мы используем современные технологии шифрования и защиты данных. Ваша конфиденциальность - наш приоритет.',
    },
    {
      id: 4,
      question: 'Как отбираются проекты и участники?',
      answer:
        'Проекты проходят тщательную проверку качества. Участники отбираются на основе навыков, опыта и соответствия требованиям проекта.',
    },
    {
      id: 5,
      question: 'Можно ли пригласить своих друзей или команду?',
      answer:
        'Конечно! Мы поддерживаем командную работу и приветствуем приглашения друзей и коллег.',
    },
    {
      id: 6,
      question: 'Что делать, если я только начинаю и у меня мало опыта?',
      answer:
        'Не переживайте! У нас есть проекты для разработчиков всех уровней. Мы поможем найти подходящий проект для вашего уровня.',
    },
    {
      id: 7,
      question: 'Как найти проект по своим интересам?',
      answer:
        'Наша система подбирает проекты на основе ваших навыков, интересов и предпочтений, указанных в профиле.',
    },
    {
      id: 8,
      question: 'Как подать заявку в команду?',
      answer:
        'Просто заполните анкету, выберите интересующий проект и нажмите "Подать заявку". Мы свяжемся с вами в течение 24 часов.',
    },
    {
      id: 9,
      question: 'Могут ли мои идеи быть украдены?',
      answer:
        'Нет, все идеи защищены соглашением о неразглашении. Мы серьезно относимся к интеллектуальной собственности.',
    },
    {
      id: 10,
      question: 'Сколько времени нужно уделять проекту?',
      answer:
        'Время участия зависит от проекта. Обычно это 10-20 часов в неделю, но может варьироваться.',
    },
    {
      id: 11,
      question: 'Могу ли я быть в нескольких проектах сразу?',
      answer:
        'Да, вы можете участвовать в нескольких проектах одновременно, если успеваете качественно выполнять задачи.',
    },
    {
      id: 12,
      question: 'Есть ли кураторы или менторы, которые могут помочь?',
      answer:
        'Да, у каждого проекта есть куратор, который поможет адаптироваться и ответит на все вопросы.',
    },
    {
      id: 13,
      question:
        'Что произойдёт, если проект закроется или я передумаю участвовать?',
      answer:
        'Вы можете в любой момент прекратить участие. Если проект закрывается, мы поможем найти новый.',
    },
  ];

  const toggleItem = (id: number) => {
    setOpenItems(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  return (
    <section className="py-20 px-5 relative">
      {/* Фоновые элементы */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-0 w-96 h-96 bg-green-500/20 rounded-full blur-[400px]"></div>
        <div className="absolute bottom-1/4 right-0 w-80 h-80 bg-blue-500/20 rounded-full blur-[400px]"></div>
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Заголовок секции */}
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-8 font-unbounded">
            Часто задаваемые вопросы
          </h2>
          <p className="text-xl text-white/80 max-w-3xl mx-auto font-montserrat">
            Ответы на самые популярные вопросы о нашей платформе
          </p>
        </div>

        {/* FAQ список */}
        <div className="space-y-6 mb-20">
          {faqItems.map(item => (
            <div
              key={item.id}
              className="bg-white/10 backdrop-blur-sm border border-white/30 rounded-[30px] overflow-hidden"
            >
              <button
                className="w-full px-8 py-8 text-left flex items-center justify-between hover:bg-white/5 transition-colors"
                onClick={() => toggleItem(item.id)}
              >
                <span className="text-xl font-bold text-white pr-8 font-unbounded">
                  {item.question}
                </span>
                <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center">
                  <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                    {openItems.includes(item.id) ? (
                      <svg
                        className="w-4 h-4 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M20 12H4"
                        />
                      </svg>
                    ) : (
                      <svg
                        className="w-4 h-4 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 4v16m8-8H4"
                        />
                      </svg>
                    )}
                  </div>
                </div>
              </button>

              {openItems.includes(item.id) && (
                <div className="px-8 pb-8">
                  <p className="text-white/80 text-lg leading-relaxed font-montserrat">
                    {item.answer}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Изображение */}
        <div className="text-center">
          <div className="relative w-full max-w-2xl mx-auto h-64 rounded-[40px] overflow-hidden">
            <Image
              src="/images/faq-image-b3a29d.png"
              alt="FAQ"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
