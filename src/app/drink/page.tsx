"use client"

import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { drinkCategories, searchDrinks } from "@/data/food-drink-data"

declare global {
  interface Window {
    gtag: (...args: unknown[]) => void
  }
}

export default function DrinkPage() {
  const [customDrink, setCustomDrink] = useState("")
  const [open, setOpen] = useState(false)
  const [displayedDrinks, setDisplayedDrinks] = useState(drinkCategories.slice(0, 20))
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const router = useRouter()

  const handleCustomSubmit = () => {
    if (customDrink.trim()) {
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', 'drink_search', {
          event_category: 'search',
          search_term: customDrink.trim(),
          value: 1
        })
      }
      router.push(`/results/drink?drink=${encodeURIComponent(customDrink.trim())}`)
    }
  }

  const handleSuggestionClick = (drinkName: string) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'suggestion_search', {
        event_category: 'search',
        search_term: drinkName,
        value: 1
      })
    }
    router.push(`/results/drink?drink=${encodeURIComponent(drinkName)}`)
  }

  // Check for error parameter and show toast
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const error = urlParams.get('error')
    const message = urlParams.get('message')
    if (error === 'invalid_drink') {
      setShowToast(true)
      setToastMessage(message || '술 이름을 다시 입력해주세요.')
      // Remove error and message parameters from URL
      const newUrl = window.location.pathname
      window.history.replaceState({}, '', newUrl)
      setTimeout(() => setShowToast(false), 3000)
    }
  }, [])

  // Randomize drink items after component mounts to avoid hydration mismatch
  useEffect(() => {
    const randomized = [...drinkCategories].sort(() => Math.random() - 0.5).slice(0, 20)
    setDisplayedDrinks(randomized)
  }, [])

  const handleDropdownClick = (drinkName: string) => {
    setCustomDrink(drinkName)
    setOpen(false)
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'dropdown_search', {
        event_category: 'search',
        search_term: drinkName,
        value: 1
      })
    }
    router.push(`/results/drink?drink=${encodeURIComponent(drinkName)}`)
  }

  const filteredDrinks = searchDrinks(customDrink)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Toast Notification */}
      {showToast && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 bg-slate-800/70 backdrop-blur-sm text-white px-3 py-1.5 rounded-md shadow-lg flex items-center gap-1.5 animate-in slide-in-from-top-2 duration-300 text-sm whitespace-nowrap">
          <span className="font-medium">{toastMessage}</span>
          <button 
            onClick={() => setShowToast(false)}
            className="ml-1.5 hover:bg-white/20 rounded-full w-3.5 h-3.5 flex items-center justify-center text-xs"
          >
            ×
          </button>
        </div>
      )}
      
      <div className="w-full max-w-md mx-auto px-4 py-5">
        {/* Header */}
        <div className="text-center mb-8 pt-8 sm:pt-10">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-3">
            🍻 오늘 마실 술은?
          </h1>
          <p className="text-base sm:text-lg text-slate-600">
            술을 선택하거나 직접 입력해보세요
          </p>
        </div>

        {/* Custom Drink Input */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="relative mx-4">
            <input
              type="text"
              placeholder="술 이름을 입력해보세요..."
              value={customDrink}
              onChange={(e) => {
                setCustomDrink(e.target.value)
                setOpen(e.target.value.length > 0)
              }}
              className="text-xl sm:text-2xl py-4 px-4 border-0 border-b-2 border-slate-300 focus:border-primary focus:ring-0 bg-transparent placeholder:text-slate-400 font-medium pr-16 w-full outline-none"
              onKeyPress={(e) => e.key === 'Enter' && handleCustomSubmit()}
            />
            <button 
              onClick={handleCustomSubmit}
              disabled={!customDrink.trim()}
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
                  onClick={() => handleDropdownClick(customDrink)}
                  className="w-full flex items-center gap-3 p-3 text-left hover:bg-slate-50 transition-colors duration-150 cursor-pointer border-b border-slate-100"
                >
                  <span className="text-xl">🍻</span>
                  <span className="text-base font-medium">&quot;{customDrink}&quot; 검색하기</span>
                </button>
                
                {/* Show filtered suggestions */}
                {filteredDrinks.length > 0 && (
                  <>
                    <div className="px-3 py-2 text-xs text-slate-500 bg-slate-50 border-b border-slate-100">
                      추천 술
                    </div>
                    {filteredDrinks.map((drink) => (
                      <button
                        key={drink.name}
                        onClick={() => handleSuggestionClick(drink.name)}
                        className="w-full flex items-center gap-3 p-3 text-left hover:bg-slate-50 transition-colors duration-150 cursor-pointer"
                      >
                        <span className="text-xl">{drink.emoji}</span>
                        <span className="text-base">{drink.name}</span>
                      </button>
                    ))}
                  </>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Drink Categories Grid */}
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-wrap gap-3 justify-center">
            {displayedDrinks.map((drink) => (
              <Button
                key={drink.name}
                variant="outline"
                onClick={() => handleSuggestionClick(drink.name)}
                className="rounded-full px-4 py-2 bg-white/80 backdrop-blur-sm border-slate-200 hover:bg-primary/10 hover:border-primary/30 hover:shadow-md transition-all duration-200 flex items-center gap-2 text-sm font-medium text-slate-700 h-auto"
              >
                <span className="text-lg">{drink.emoji}</span>
                <span>{drink.name}</span>
              </Button>
            ))}
          </div>
        </div>

        {/* Back Button */}
        <div className="text-center mt-12">
          <Link href="/">
            <Button 
              variant="ghost" 
              className="text-slate-600 hover:text-slate-800 px-3 py-2 text-sm font-medium"
            >
              ← 돌아가기
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

