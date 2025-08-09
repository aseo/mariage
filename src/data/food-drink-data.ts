export interface FoodDrinkItem {
  name: string
  emoji: string
  description?: string
  category?: string
}

export const foodCategories: FoodDrinkItem[] = [
  // Korean BBQ
  { name: "삼겹살", emoji: "🥓", category: "Korean BBQ" },
  { name: "소갈비", emoji: "🥩", category: "Korean BBQ" },
  { name: "불고기", emoji: "🥩", category: "Korean BBQ" },
  { name: "닭갈비", emoji: "🐓", category: "Korean BBQ" },
  { name: "돼지갈비", emoji: "🥩", category: "Korean BBQ" },
  { name: "소고기", emoji: "🥩", category: "Korean BBQ" },
  { name: "스테이크", emoji: "🥩", category: "Korean BBQ" },
  { name: "항정살", emoji: "🥓", category: "Korean BBQ" },
  { name: "갈매기살", emoji: "🥓", category: "Korean BBQ" },
  
  // Stew/Soup
  { name: "김치찌개", emoji: "🍲", category: "Stew/Soup" },
  { name: "된장찌개", emoji: "🍲", category: "Stew/Soup" },
  { name: "순두부찌개", emoji: "🍲", category: "Stew/Soup" },
  { name: "감자탕", emoji: "🍲", category: "Stew/Soup" },
  { name: "곰탕", emoji: "🍲", category: "Stew/Soup" },
  { name: "설렁탕", emoji: "🍲", category: "Stew/Soup" },
  { name: "부대찌개", emoji: "🍲", category: "Stew/Soup" },
  { name: "갈비탕", emoji: "🍲", category: "Stew/Soup" },
  { name: "육개장", emoji: "🍲", category: "Stew/Soup" },
  { name: "추어탕", emoji: "🍲", category: "Stew/Soup" },
  
  // Rice Dishes
  { name: "비빔밥", emoji: "🍚", category: "Rice Dishes" },
  { name: "김치볶음밥", emoji: "🍚", category: "Rice Dishes" },
  { name: "제육덮밥", emoji: "🍚", category: "Rice Dishes" },
  { name: "오징어덮밥", emoji: "🍚", category: "Rice Dishes" },
  { name: "알밥", emoji: "🍚", category: "Rice Dishes" },
  { name: "육회비빔밥", emoji: "🍚", category: "Rice Dishes" },
  
  // Noodles
  { name: "비빔국수", emoji: "🍜", category: "Noodles" },
  { name: "냉면", emoji: "🍜", category: "Noodles" },
  { name: "칼국수", emoji: "🍜", category: "Noodles" },
  { name: "쫄면", emoji: "🍜", category: "Noodles" },
  { name: "라면", emoji: "🍜", category: "Noodles" },
  { name: "잔치국수", emoji: "🍜", category: "Noodles" },
  { name: "우동", emoji: "🍜", category: "Noodles" },
  { name: "짜장면", emoji: "🍜", category: "Chinese" },
  { name: "짬뽕", emoji: "🍜", category: "Chinese" },
  { name: "탕수육", emoji: "🍗", category: "Chinese" },
  { name: "깐풍기", emoji: "🍗", category: "Chinese" },
  { name: "마라탕", emoji: "🍲", category: "Chinese" },
  { name: "평양냉면", emoji: "🍜", category: "Noodles" },
  { name: "비빔냉면", emoji: "🍜", category: "Noodles" },
  
  // Street Food
  { name: "떡볶이", emoji: "🍢", category: "Street Food" },
  { name: "김밥", emoji: "🍙", category: "Street Food" },
  { name: "순대", emoji: "🍢", category: "Street Food" },
  { name: "튀김", emoji: "🍤", category: "Street Food" },
  { name: "오뎅", emoji: "🍢", category: "Street Food" },
  { name: "핫도그", emoji: "🌭", category: "Street Food" },
  
  // Anju (Drinking Food)
  { name: "골뱅이무침", emoji: "🍺", category: "Anju" },
  
  // Pancakes/Jeon
  { name: "김치전", emoji: "🥞", category: "Pancakes/Jeon" },
  { name: "파전", emoji: "🥞", category: "Pancakes/Jeon" },
  { name: "해물파전", emoji: "🥞", category: "Pancakes/Jeon" },
  { name: "동그랑땡", emoji: "🥞", category: "Pancakes/Jeon" },
  { name: "감자전", emoji: "🥞", category: "Pancakes/Jeon" },
  
  // Seafood
  { name: "회", emoji: "🍣", category: "Seafood" },
  { name: "초밥", emoji: "🍣", category: "Seafood" },
  { name: "문어숙회", emoji: "🐙", category: "Seafood" },
  { name: "낙지볶음", emoji: "🐙", category: "Seafood" },
  { name: "아귀찜", emoji: "🐟", category: "Seafood" },
  { name: "조개구이", emoji: "🦐", category: "Seafood" },
  
  // Skewers/Grill
  { name: "닭꼬치", emoji: "🍢", category: "Skewers/Grill" },
  { name: "곱창구이", emoji: "🥩", category: "Skewers/Grill" },
  { name: "막창구이", emoji: "🥩", category: "Skewers/Grill" },
  
  // Fried Food
  { name: "후라이드 치킨", emoji: "🍗", category: "Fried Food" },
  { name: "양념 치킨", emoji: "🍗", category: "Fried Food" },
  { name: "간장 치킨", emoji: "🍗", category: "Fried Food" },
  { name: "닭강정", emoji: "🍗", category: "Fried Food" },
  { name: "감자튀김", emoji: "🍟", category: "Fried Food" },
  
  // Boiled/Steamed
  { name: "족발", emoji: "🐖", category: "Boiled/Steamed" },
  { name: "보쌈", emoji: "🐖", category: "Boiled/Steamed" },
  { name: "편육", emoji: "🐖", category: "Boiled/Steamed" },
  
  // Raw/Cool
  { name: "육회", emoji: "🥩", category: "Raw/Cool" },
  
  // Fermented
  { name: "홍어삼합", emoji: "🐟", category: "Fermented" },
  
  // Western
  { name: "까르보나라", emoji: "🍝", category: "Western" },
  { name: "토마토 파스타", emoji: "🍝", category: "Western" },
  { name: "봉골레 파스타", emoji: "🍝", category: "Western" },
  { name: "마르게리타 피자", emoji: "🍕", category: "Western" },
  { name: "페페로니 피자", emoji: "🍕", category: "Western" },
  { name: "치즈버거", emoji: "🍔", category: "Western" },
  { name: "햄버거", emoji: "🍔", category: "Western" },
  
  // Misc
  { name: "유부초밥", emoji: "🍣", category: "Misc" },
  { name: "계란말이", emoji: "🍳", category: "Misc" },
  { name: "계란찜", emoji: "🍳", category: "Misc" },
  { name: "잡채", emoji: "🍽️", category: "Misc" },
  { name: "떡국", emoji: "🍲", category: "Misc" },
  { name: "만두", emoji: "🥟", category: "Misc" },
]

export const drinkCategories: FoodDrinkItem[] = [
  // Korean Traditional Drinks
  { name: "소주", emoji: "🥃", category: "Korean Traditional" },
  { name: "증류식 소주", emoji: "🥃", category: "Korean Traditional" },
  { name: "과일 소주", emoji: "🥃", category: "Korean Traditional" },
  { name: "막걸리", emoji: "🍶", category: "Korean Traditional" },
  { name: "청하", emoji: "🍶", category: "Korean Traditional" },
  
  // Korean Beer & Popular
  { name: "맥주", emoji: "🍺", category: "Korean Beer" },
  { name: "IPA", emoji: "🍺", category: "Korean Beer" },
  { name: "페일에일", emoji: "🍺", category: "Korean Beer" },
  { name: "스타우트", emoji: "🍺", category: "Korean Beer" },
  { name: "필스너", emoji: "🍺", category: "Korean Beer" },
  { name: "밀맥주", emoji: "🍺", category: "Korean Beer" },
  
  // Korean Cocktails & Mixed
  { name: "소맥", emoji: "🍺", category: "Korean Mixed" },
  
  // Popular in Korea (International)
  { name: "레드 와인", emoji: "🍷", category: "International" },
  { name: "카베르네 소비뇽", emoji: "🍷", category: "International" },
  { name: "피노 누아", emoji: "🍷", category: "International" },
  { name: "쉬라즈", emoji: "🍷", category: "International" },
  { name: "말벡", emoji: "🍷", category: "International" },
  { name: "진판델", emoji: "🍷", category: "International" },
  { name: "메를로", emoji: "🍷", category: "International" },
  { name: "로제 와인", emoji: "🍷", category: "International" },
  { name: "화이트 와인", emoji: "🥂", category: "International" },
  { name: "소비뇽블랑", emoji: "🥂", category: "International" },
  { name: "샤르도네", emoji: "🥂", category: "International" },
  { name: "리슬링", emoji: "🥂", category: "International" },
  { name: "피노그리", emoji: "🥂", category: "International" },
  { name: "까바", emoji: "🥂", category: "International" },
  { name: "모스카토", emoji: "🥂", category: "International" },
  { name: "샴페인", emoji: "🍾", category: "International" },
  { name: "위스키", emoji: "🥃", category: "International" },
  { name: "위스키(피트)", emoji: "🥃", category: "International" },
  { name: "위스키(셰리)", emoji: "🥃", category: "International" },
  { name: "위스키(버번)", emoji: "🥃", category: "International" },
  { name: "위스키 하이볼", emoji: "🍹", category: "International" },
  
]

// Helper functions for filtering and searching
export const searchFoods = (query: string): FoodDrinkItem[] => {
  return foodCategories.filter(food =>
    food.name.toLowerCase().includes(query.toLowerCase())
  ).slice(0, 8)
}

export const searchDrinks = (query: string): FoodDrinkItem[] => {
  return drinkCategories.filter(drink =>
    drink.name.toLowerCase().includes(query.toLowerCase())
  ).slice(0, 8)
}

// Get items by category
export const getFoodsByCategory = (category: string): FoodDrinkItem[] => {
  return foodCategories.filter(food => food.category === category)
}

export const getDrinksByCategory = (category: string): FoodDrinkItem[] => {
  return drinkCategories.filter(drink => drink.category === category)
}

// Get all unique categories
export const getFoodCategories = (): string[] => {
  return [...new Set(foodCategories.map(food => food.category).filter(Boolean))] as string[]
}

export const getDrinkCategories = (): string[] => {
  return [...new Set(drinkCategories.map(drink => drink.category).filter(Boolean))] as string[]
} 