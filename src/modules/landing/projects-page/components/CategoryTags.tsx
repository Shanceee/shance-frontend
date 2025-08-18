'use client';

interface CategoryTagsProps {
  categories: string[];
  selectedCategory: string;
  onCategorySelect: (category: string) => void;
}

export function CategoryTags({
  categories,
  selectedCategory,
  onCategorySelect,
}: CategoryTagsProps) {
  return (
    <div className="flex flex-wrap gap-6 mb-12">
      {categories.map(category => (
        <button
          key={category}
          onClick={() => onCategorySelect(category)}
          className={`px-6 py-3 rounded-full font-miracode text-lg transition-all ${
            selectedCategory === category
              ? 'bg-white text-black'
              : 'bg-white/10 backdrop-blur-sm border border-white/30 text-white/60 hover:text-white'
          }`}
        >
          #{category}
        </button>
      ))}
    </div>
  );
}
