'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export function EnhancedFooter() {
  const [isVisible, setIsVisible] = useState(false);
  const [hoveredSocial, setHoveredSocial] = useState<string | null>(null);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const socialLinks = [
    {
      id: 'telegram',
      icon: '/images/social-icon-1.svg',
      label: 'Telegram',
      href: '#',
      color: 'hover:bg-blue-500/20',
    },
    {
      id: 'discord',
      icon: '/images/social-icon-2.svg',
      label: 'Discord',
      href: '#',
      color: 'hover:bg-purple-500/20',
    },
  ];

  return (
    <footer
      ref={sectionRef}
      className="bg-black/20 backdrop-blur-sm border-t border-white/10 py-16 px-5 relative overflow-hidden"
    >
      {/* Фоновые элементы */}
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-0 w-64 h-64 bg-green-500/10 rounded-full blur-[300px] animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-[400px] animate-pulse delay-1000"></div>
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        <div
          className={`grid grid-cols-1 md:grid-cols-3 gap-12 transition-all duration-1000 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'
          }`}
        >
          {/* Логотип и описание */}
          <div className="text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start space-x-3 mb-6 group">
              <div className="relative w-12 h-12 hover:scale-110 transition-transform duration-300">
                <Image
                  src="/images/logo.svg"
                  alt="Shance Logo"
                  fill
                  className="object-contain"
                />
              </div>
              <span className="text-white text-2xl font-bold group-hover:text-green-200 transition-colors font-unbounded">
                shance
              </span>
            </div>
            <p className="text-white/60 text-sm leading-relaxed hover:text-white/80 transition-colors font-montserrat">
              Твой путь в IT-стартапе — просто и быстро
            </p>
          </div>

          {/* Навигация */}
          <div className="text-center">
            <h3 className="text-white text-lg font-semibold mb-6 font-unbounded">
              Навигация
            </h3>
            <nav className="space-y-3">
              {[
                { href: '/projects', text: 'Проекты' },
                { href: '/about', text: 'О нас' },
                { href: '/faq', text: 'FAQ' },
              ].map((link, index) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`block text-white/60 hover:text-white transition-all duration-300 hover:translate-x-1 font-montserrat ${
                    isVisible
                      ? 'opacity-100 translate-x-0'
                      : 'opacity-0 translate-x-5'
                  }`}
                  style={{ transitionDelay: `${200 + index * 100}ms` }}
                >
                  {link.text}
                </Link>
              ))}
            </nav>
          </div>

          {/* Контакты */}
          <div className="text-center md:text-right">
            <h3 className="text-white text-lg font-semibold mb-6 font-unbounded">
              Контакты
            </h3>
            <div className="space-y-3">
              <p className="text-white/60 text-sm hover:text-white/80 transition-colors font-montserrat">
                Напишите нам на почту
              </p>
              <a
                href="mailto:shance@gmail.com"
                className="block text-white hover:text-green-400 transition-all duration-300 font-semibold hover:scale-105 font-montserrat"
              >
                shance@gmail.com
              </a>

              {/* Социальные сети */}
              <div className="flex justify-center md:justify-end space-x-4 mt-6">
                {socialLinks.map((social, index) => (
                  <a
                    key={social.id}
                    href={social.href}
                    className={`w-10 h-10 bg-white/10 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 ${social.color} ${
                      hoveredSocial === social.id ? 'ring-2 ring-white/30' : ''
                    }`}
                    aria-label={social.label}
                    onMouseEnter={() => setHoveredSocial(social.id)}
                    onMouseLeave={() => setHoveredSocial(null)}
                    style={{ transitionDelay: `${400 + index * 100}ms` }}
                  >
                    <div className="relative w-5 h-5">
                      <Image
                        src={social.icon}
                        alt={social.label}
                        fill
                        className="object-contain"
                      />
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Нижняя часть с анимацией */}
        <div
          className={`mt-12 pt-8 border-t border-white/10 text-center transition-all duration-1000 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
          style={{ transitionDelay: '600ms' }}
        >
          <p className="text-white/40 text-sm hover:text-white/60 transition-colors font-montserrat">
            © 2024 Shance. Все права защищены.
          </p>
        </div>
      </div>
    </footer>
  );
}
