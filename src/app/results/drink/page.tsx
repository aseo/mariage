"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { useEffect, useRef, useState } from "react"
import { FoodRecommendation } from "@/lib/gemini"

export default function DrinkResultsPage() {
  const [drinkItem, setDrinkItem] = useState('Your Drink')
  const [isLoading, setIsLoading] = useState(true)
  const [recommendations, setRecommendations] = useState<FoodRecommendation[]>([])
  const [error, setError] = useState<string | null>(null)
  const hasFetched = useRef(false)
  const [loadingEmojiIndex, setLoadingEmojiIndex] = useState(0)
  const [loadingStartTime, setLoadingStartTime] = useState<number | null>(null)
  const foodEmojis = ['🍖','🍲','🍔','🥟','🍣','🍜']

  // Rotate emojis during loading
  useEffect(() => {
    if (isLoading || loadingStartTime) {
      const interval = setInterval(() => {
        setLoadingEmojiIndex(prev => (prev + 1) % foodEmojis.length)
      }, 300)
      return () => clearInterval(interval)
    } else {
      setLoadingEmojiIndex(0)
    }
  }, [isLoading, loadingStartTime, foodEmojis.length])

  // Ensure minimum loading time (match food results behavior)
  useEffect(() => {
    if (isLoading && !loadingStartTime) {
      setLoadingStartTime(Date.now())
    }
    if (!isLoading && loadingStartTime) {
      const elapsed = Date.now() - loadingStartTime
      const minLoadingTime = 800 // match food results min duration
      if (elapsed < minLoadingTime) {
        const remaining = minLoadingTime - elapsed
        const t = setTimeout(() => setLoadingStartTime(null), remaining)
        return () => clearTimeout(t)
      }
      setLoadingStartTime(null)
    }
  }, [isLoading, loadingStartTime])

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const urlParams = new URLSearchParams(window.location.search)
        const drink = urlParams.get('drink') || 'Your Drink'
        setDrinkItem(drink)

        const response = await fetch(`/api/recommendations/foods?drink=${encodeURIComponent(drink)}`, {
          cache: 'default',
          headers: { 'Cache-Control': 'max-age=3600' }
        })

        if (!response.ok) {
          throw new Error('Failed to fetch recommendations')
        }

        const data = await response.json()
        setRecommendations(data.recommendations)
      } catch (err) {
        console.error('Error fetching recommendations:', err)
        setError('Failed to load recommendations. Please try again.')
      } finally {
        setIsLoading(false)
      }
    }

    if (!hasFetched.current) {
      hasFetched.current = true
      fetchRecommendations()
    }
  }, [])

  if (isLoading || loadingStartTime) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-6 transition-opacity duration-300 ease-in-out">{foodEmojis[loadingEmojiIndex]}</div>
          <div className="text-xl text-slate-600">천상의 조합 찾는 중...</div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="w-full max-w-md mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <Link href="/drink" className="inline-block mb-4">
              <Button variant="ghost" className="text-slate-600 hover:text-slate-800">
                ← Back to Drink Selection
              </Button>
            </Link>
            <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-3">😔 죄송합니다</h1>
            <p className="text-lg text-slate-600 mb-8">AI 추천 시스템에 일시적으로 연결할 수 없습니다.<br/>잠시 후 다시 시도해주세요.</p>
            <Button onClick={() => window.location.reload()} className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 text-lg">다시 시도</Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="w-full max-w-md mx-auto px-4 py-5">
        {/* Header */}
        <div className="text-center mb-8 pt-8 sm:pt-10">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-3">
            {drinkItem}에는 이거지💜
          </h1>
          <p className="text-base sm:text-lg text-slate-600">한 입 먹고 한 잔 딱!</p>
        </div>

        {/* Results */}
        <div className="max-w-4xl mx-auto space-y-6">
          {recommendations.map((food, index) => (
            <Card key={index} className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-200 gap-3 py-5">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="text-4xl sm:text-5xl">{index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}</div>
                    <div>
                      <CardTitle className="text-lg sm:text-xl text-slate-800">{food.name}</CardTitle>
                      <CardDescription className="text-sm sm:text-base text-slate-600">{food.category}</CardDescription>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-xl sm:text-2xl font-bold ${
                      food.grade === 'A+' ? 'text-emerald-500' :
                      (food.grade === 'A' || food.grade === 'A-') ? 'text-blue-500' :
                      'text-sky-500'
                    }`}>
                      {food.grade}
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex gap-6 items-start">
                  <div className="flex-shrink-0">
                    <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-slate-200 to-slate-300 rounded-lg flex items-center justify-center text-3xl sm:text-4xl shadow-md">
                      {food.emoji || '🍽️'}
                    </div>
                  </div>
                  <div className="flex-1">
                    <p className="text-slate-700 text-sm sm:text-base leading-relaxed">{food.explanation}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Back Button */}
        <div className="text-center mt-8">
          <Link href="/drink">
            <Button variant="ghost" className="text-slate-700 hover:text-slate-900 text-base font-medium">← 다른 술 알아보기</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

export const dynamic = 'force-static'

