'use client';
import { useState, useEffect } from 'react';

const FILTER_OPTIONS = {
  price: [
    { label: 'Under $100', value: '0-100' },
    { label: '$100 - $500', value: '100-500' },
    { label: '$500 - $1000', value: '500-1000' },
    { label: '$1000+', value: '1000+' }
  ],
  brand: [
    { label: 'The Warehouse', value: 'the-warehouse' },
    { label: 'Warehouse Stationery', value: 'warehouse-stationery' },
    { label: 'Noel Leeming', value: 'noel-leeming' },
    { label: 'Apple', value: 'apple' },
    { label: 'Samsung', value: 'samsung' },
    { label: 'Lenovo', value: 'lenovo' }
  ],
  category: [
    { label: 'Electronics', value: 'electronics' },
    { label: 'Computers', value: 'computers' },
    { label: 'Home & Garden', value: 'home-garden' },
    { label: 'Office', value: 'office' },
    { label: 'Kitchen', value: 'kitchen' }
  ],
  delivery: [
    { label: 'Pickup Available', value: 'pickup' },
    { label: 'Free Delivery', value: 'free-delivery' },
    { label: 'Same Day', value: 'same-day' }
  ]
};

export default function FiltersBar({ onFiltersChange, initialFilters = {} }) {
  const [filters, setFilters] = useState(initialFilters);
  const [isSticky, setIsSticky] = useState(false);

  // Handle sticky behavior
  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Update filters and notify parent
  const updateFilters = (category, value) => {
    const newFilters = { ...filters };
    
    if (newFilters[category] === value) {
      // Remove filter if already selected
      delete newFilters[category];
    } else {
      // Add/update filter
      newFilters[category] = value;
    }
    
    setFilters(newFilters);
    onFiltersChange?.(newFilters);
  };

  // Clear all filters
  const clearFilters = () => {
    setFilters({});
    onFiltersChange?.({});
  };

  const hasActiveFilters = Object.keys(filters).length > 0;

  return (
    <div 
      className={`sticky top-12 z-30 transition-all duration-200 ${
        isSticky 
          ? 'bg-bg/95 backdrop-blur-sm border-b border-border shadow-sm' 
          : 'bg-transparent'
      }`}
    >
      <div className="mx-auto max-w-[1200px] px-6 py-3">
        {/* Filter Categories */}
        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
          {/* Price Filters */}
          <div className="flex gap-2 flex-shrink-0">
            <span className="text-sm font-medium text-ink-muted self-center">Price:</span>
            {FILTER_OPTIONS.price.map((option) => (
              <button
                key={option.value}
                onClick={() => updateFilters('price', option.value)}
                className={`px-3 py-1 text-sm rounded-pill border transition-all focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-2 ${
                  filters.price === option.value
                    ? 'bg-brand-primary text-white border-brand-primary'
                    : 'bg-bg border-border text-ink hover:bg-bg-alt'
                }`}
                aria-pressed={filters.price === option.value}
              >
                {option.label}
              </button>
            ))}
          </div>

          {/* Brand Filters */}
          <div className="flex gap-2 flex-shrink-0">
            <span className="text-sm font-medium text-ink-muted self-center">Brand:</span>
            {FILTER_OPTIONS.brand.map((option) => (
              <button
                key={option.value}
                onClick={() => updateFilters('brand', option.value)}
                className={`px-3 py-1 text-sm rounded-pill border transition-all focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-2 ${
                  filters.brand === option.value
                    ? 'bg-brand-primary text-white border-brand-primary'
                    : 'bg-bg border-border text-ink hover:bg-bg-alt'
                }`}
                aria-pressed={filters.brand === option.value}
              >
                {option.label}
              </button>
            ))}
          </div>

          {/* Category Filters */}
          <div className="flex gap-2 flex-shrink-0">
            <span className="text-sm font-medium text-ink-muted self-center">Category:</span>
            {FILTER_OPTIONS.category.map((option) => (
              <button
                key={option.value}
                onClick={() => updateFilters('category', option.value)}
                className={`px-3 py-1 text-sm rounded-pill border transition-all focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-2 ${
                  filters.category === option.value
                    ? 'bg-brand-primary text-white border-brand-primary'
                    : 'bg-bg border-border text-ink hover:bg-bg-alt'
                }`}
                aria-pressed={filters.category === option.value}
              >
                {option.label}
              </button>
            ))}
          </div>

          {/* Delivery Filters */}
          <div className="flex gap-2 flex-shrink-0">
            <span className="text-sm font-medium text-ink-muted self-center">Delivery:</span>
            {FILTER_OPTIONS.delivery.map((option) => (
              <button
                key={option.value}
                onClick={() => updateFilters('delivery', option.value)}
                className={`px-3 py-1 text-sm rounded-pill border transition-all focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-2 ${
                  filters.delivery === option.value
                    ? 'bg-brand-primary text-white border-brand-primary'
                    : 'bg-bg border-border text-ink hover:bg-bg-alt'
                }`}
                aria-pressed={filters.delivery === option.value}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Clear Filters Button */}
        {hasActiveFilters && (
          <div className="flex justify-end mt-2">
            <button
              onClick={clearFilters}
              className="text-sm text-ink-muted hover:text-brand-primary transition-colors focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-2 rounded"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
