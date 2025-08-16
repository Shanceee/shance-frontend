'use client';

export function ProjectsFooter() {
  return (
    <footer className="relative z-10 border-t border-white/30 mt-20">
      <div className="max-w-7xl mx-auto px-10 py-16">
        <div className="text-center">
          <h2 className="text-3xl font-unbounded font-normal text-transparent bg-gradient-to-t from-gray-600 to-gray-200 bg-clip-text mb-4">
            shance
          </h2>
          <p className="text-white font-montserrat text-sm mb-2">
            Напишите нам на почту
          </p>
          <p className="text-white font-unbounded text-base">
            shance@gmail.com
          </p>

          {/* Social Links */}
          <div className="flex justify-center gap-6 mt-8">
            <div className="w-6 h-4">
              <svg width="25" height="17" viewBox="0 0 25 17" fill="none">
                <path d="M12.5 0L25 8.5L12.5 17L0 8.5L12.5 0Z" fill="white" />
              </svg>
            </div>
            <div className="w-6 h-4">
              <svg width="25" height="17" viewBox="0 0 25 17" fill="none">
                <path d="M12.5 0L25 8.5L12.5 17L0 8.5L12.5 0Z" fill="white" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
