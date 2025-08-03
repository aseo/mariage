"use client"

import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { foodCategories, searchFoods } from "@/data/food-drink-data"

declare global {
  interface Window {
    gtag: (...args: unknown[]) => void
  }
}

export default function FoodPage() {
  const [customFood, setCustomFood] = useState("")
  const [open, setOpen] = useState(false)
  const [displayedFoods, setDisplayedFoods] = useState(foodCategories.slice(0, 20))
  const [showToast, setShowToast] = useState(false)
  const router = useRouter()

  const handleCustomSubmit = () => {
    if (customFood.trim()) {
      // Track search event
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', 'search', {
          event_category: 'engagement',
          event_label: 'food_search',
          search_term: customFood.trim(),
          value: 1
        })
      }
      router.push(`/results/food?food=${encodeURIComponent(customFood.trim())}`)
    }
  }

  const handleCategoryClick = (categoryName: string) => {
    // Track category click as search
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'search', {
        event_category: 'engagement',
        event_label: 'food_category_click',
        search_term: categoryName,
        value: 1
      })
    }
    router.push(`/results/food?food=${encodeURIComponent(categoryName)}`)
  }

  // Check for error parameter and show toast
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const error = urlParams.get('error')
    if (error === 'invalid_food') {
      setShowToast(true)
      // Remove error parameter from URL
      const newUrl = window.location.pathname
      window.history.replaceState({}, '', newUrl)
      // Hide toast after 3 seconds
      setTimeout(() => setShowToast(false), 3000)
    }
  }, [])

  // Randomize food items after component mounts to avoid hydration mismatch
  useEffect(() => {
    const randomized = [...foodCategories].sort(() => Math.random() - 0.5).slice(0, 20)
    setDisplayedFoods(randomized)
  }, [])

  const handleSuggestionClick = (foodName: string) => {
    setCustomFood(foodName)
    setOpen(false)
    // Track suggestion click as search
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'search', {
        event_category: 'engagement',
        event_label: 'food_suggestion_click',
        search_term: foodName,
        value: 1
      })
    }
    router.push(`/results/food?food=${encodeURIComponent(foodName)}`)
  }

  const filteredFoods = searchFoods(customFood)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Toast Notification */}
      {showToast && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 animate-in slide-in-from-top-2 duration-300">
          <span>⚠️</span>
          <span className="font-medium">다른 키워드로 검색해주세요</span>
          <button 
            onClick={() => setShowToast(false)}
            className="ml-2 hover:bg-red-600 rounded-full w-5 h-5 flex items-center justify-center text-xs"
          >
            ×
          </button>
        </div>
      )}
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-3">
            🍽️ 오늘 내 메뉴는?
          </h1>
          <p className="text-lg text-slate-600">
            음식을 선택하거나 직접 입력해보세요
          </p>
        </div>

        {/* Custom Food Input */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="relative">
            <input
              type="text"
              placeholder="음식 이름을 입력해보세요..."
              value={customFood}
              onChange={(e) => {
                setCustomFood(e.target.value)
                setOpen(e.target.value.length > 0)
              }}
              className="text-2xl sm:text-3xl py-6 px-0 border-0 border-b-2 border-slate-300 focus:border-primary focus:ring-0 bg-transparent placeholder:text-slate-400 font-medium pr-16 w-full outline-none"
              onKeyPress={(e) => e.key === 'Enter' && handleCustomSubmit()}
            />
            <button 
              onClick={handleCustomSubmit}
              disabled={!customFood.trim()}
              className="absolute right-0 top-1/2 -translate-y-1/2 text-slate-400 hover:text-primary h-12 w-12 flex items-center justify-center transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
            
            {/* Dropdown Suggestions */}
            {open && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-lg border border-slate-200 z-50 max-h-64 overflow-y-auto">
                {/* Show user's input as first option */}
                <button
                  onClick={() => handleSuggestionClick(customFood)}
                  className="w-full flex items-center gap-3 p-3 text-left hover:bg-slate-50 transition-colors duration-150 cursor-pointer border-b border-slate-100"
                >
                  <span className="text-xl">🍽️</span>
                  <span className="text-base font-medium">&quot;{customFood}&quot; 검색하기</span>
                </button>
                
                {/* Show filtered suggestions */}
                {filteredFoods.length > 0 && (
                  <>
                    <div className="px-3 py-2 text-xs text-slate-500 bg-slate-50 border-b border-slate-100">
                      추천 음식
                    </div>
                    {filteredFoods.map((food) => (
                      <button
                        key={food.name}
                        onClick={() => handleSuggestionClick(food.name)}
                        className="w-full flex items-center gap-3 p-3 text-left hover:bg-slate-50 transition-colors duration-150 cursor-pointer"
                      >
                        <span className="text-xl">{food.emoji}</span>
                        <span className="text-base">{food.name}</span>
                      </button>
                    ))}
                  </>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Food Categories Grid */}
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-wrap gap-3 justify-center">
            {displayedFoods.map((food) => (
              <Button
                key={food.name}
                variant="outline"
                onClick={() => handleCategoryClick(food.name)}
                className="rounded-full px-4 py-2 bg-white/80 backdrop-blur-sm border-slate-200 hover:bg-primary/10 hover:border-primary/30 hover:shadow-md transition-all duration-200 flex items-center gap-2 text-sm font-medium text-slate-700 h-auto"
              >
                <span className="text-lg">{food.emoji}</span>
                <span>{food.name}</span>
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
} 