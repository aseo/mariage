export interface FoodDrinkItem {
  name: string
  emoji: string
  description?: string
  category?: string
}

export const foodCategories: FoodDrinkItem[] = [
  // Korean BBQ
  { name: "삼겹살", emoji: "🥩", category: "Korean BBQ" },
  { name: "갈비", emoji: "🥩", category: "Korean BBQ" },
  { name: "불고기", emoji: "🥩", category: "Korean BBQ" },
  { name: "닭갈비", emoji: "🥩", category: "Korean BBQ" },
  { name: "돼지갈비", emoji: "🥩", category: "Korean BBQ" },
  { name: "소고기", emoji: "🥩", category: "Korean BBQ" },
  { name: "항정살", emoji: "🥩", category: "Korean BBQ" },
  { name: "갈매기살", emoji: "🥩", category: "Korean BBQ" },
  
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
  { name: "동태찌개", emoji: "🍲", category: "Stew/Soup" },
  { name: "추어탕", emoji: "🍲", category: "Stew/Soup" },
  
  // Rice Dishes
  { name: "비빔밥", emoji: "🍚", category: "Rice Dishes" },
  { name: "김치볶음밥", emoji: "🍚", category: "Rice Dishes" },
  { name: "제육덮밥", emoji: "🍚", category: "Rice Dishes" },
  { name: "오징어덮밥", emoji: "🍚", category: "Rice Dishes" },
  { name: "알밥", emoji: "🍚", category: "Rice Dishes" },
  { name: "곱창덮밥", emoji: "🍚", category: "Rice Dishes" },
  { name: "육회비빔밥", emoji: "🍚", category: "Rice Dishes" },
  { name: "잔치비빔밥", emoji: "🍚", category: "Rice Dishes" },
  
  // Noodles
  { name: "비빔국수", emoji: "🍜", category: "Noodles" },
  { name: "냉면", emoji: "🍜", category: "Noodles" },
  { name: "칼국수", emoji: "🍜", category: "Noodles" },
  { name: "쫄면", emoji: "🍜", category: "Noodles" },
  { name: "라면", emoji: "🍜", category: "Noodles" },
  { name: "잔치국수", emoji: "🍜", category: "Noodles" },
  { name: "우동", emoji: "🍜", category: "Noodles" },
  
  // Street Food
  { name: "떡볶이", emoji: "🍢", category: "Street Food" },
  { name: "순대", emoji: "🍢", category: "Street Food" },
  { name: "튀김", emoji: "🍢", category: "Street Food" },
  { name: "오뎅", emoji: "🍢", category: "Street Food" },
  { name: "핫도그", emoji: "🍢", category: "Street Food" },
  { name: "쥐포", emoji: "🍢", category: "Street Food" },
  
  // Anju (Drinking Food)
  { name: "노가리", emoji: "🍺", category: "Anju" },
  { name: "먹태", emoji: "🍺", category: "Anju" },
  { name: "골뱅이무침", emoji: "🍺", category: "Anju" },
  { name: "황도", emoji: "🍺", category: "Anju" },
  
  // Pancakes/Jeon
  { name: "김치전", emoji: "🥞", category: "Pancakes/Jeon" },
  { name: "파전", emoji: "🥞", category: "Pancakes/Jeon" },
  { name: "해물파전", emoji: "🥞", category: "Pancakes/Jeon" },
  { name: "동그랑땡", emoji: "🥞", category: "Pancakes/Jeon" },
  { name: "감자전", emoji: "🥞", category: "Pancakes/Jeon" },
  
  // Seafood
  { name: "회", emoji: "🦐", category: "Seafood" },
  { name: "초밥", emoji: "🦐", category: "Seafood" },
  { name: "문어숙회", emoji: "🦐", category: "Seafood" },
  { name: "낙지볶음", emoji: "🦐", category: "Seafood" },
  { name: "아귀찜", emoji: "🦐", category: "Seafood" },
  { name: "조개구이", emoji: "🦐", category: "Seafood" },
  
  // Skewers/Grill
  { name: "닭꼬치", emoji: "🍢", category: "Skewers/Grill" },
  { name: "소고기꼬치", emoji: "🍢", category: "Skewers/Grill" },
  { name: "곱창구이", emoji: "🍢", category: "Skewers/Grill" },
  { name: "막창구이", emoji: "🍢", category: "Skewers/Grill" },
  { name: "염통꼬치", emoji: "🍢", category: "Skewers/Grill" },
  
  // Fried Food
  { name: "후라이드 치킨", emoji: "🍗", category: "Fried Food" },
  { name: "양념 치킨", emoji: "🍗", category: "Fried Food" },
  { name: "간장 치킨", emoji: "🍗", category: "Fried Food" },
  { name: "닭강정", emoji: "🍗", category: "Fried Food" },
  { name: "감자튀김", emoji: "🍗", category: "Fried Food" },
  
  // Boiled/Steamed
  { name: "족발", emoji: "🥓", category: "Boiled/Steamed" },
  { name: "보쌈", emoji: "🥓", category: "Boiled/Steamed" },
  { name: "편육", emoji: "🥓", category: "Boiled/Steamed" },
  
  // Raw/Cool
  { name: "육회", emoji: "🥩", category: "Raw/Cool" },
  
  // Fermented
  { name: "홍어삼합", emoji: "🧄", category: "Fermented" },
  
  // Western
  { name: "까르보나라", emoji: "🍝", category: "Western" },
  { name: "토마토 파스타", emoji: "🍝", category: "Western" },
  { name: "봉골레 파스타", emoji: "🍝", category: "Western" },
  { name: "마르게리타 피자", emoji: "🍝", category: "Western" },
  { name: "페페로니 피자", emoji: "🍝", category: "Western" },
  { name: "치즈버거", emoji: "🍝", category: "Western" },
  
  // Misc
  { name: "유부초밥", emoji: "🍽️", category: "Misc" },
  { name: "계란말이", emoji: "🍽️", category: "Misc" },
  { name: "계란찜", emoji: "🍽️", category: "Misc" },
  { name: "잡채", emoji: "🍽️", category: "Misc" },
  { name: "떡국", emoji: "🍽️", category: "Misc" },
  { name: "만두", emoji: "🍽️", category: "Misc" },
  { name: "김치", emoji: "🍽️", category: "Misc" },
  
  // Dessert
  { name: "빙수", emoji: "🍰", category: "Dessert" },
  { name: "약과", emoji: "🍰", category: "Dessert" },
  { name: "인절미", emoji: "🍰", category: "Dessert" },
  { name: "꿀떡", emoji: "🍰", category: "Dessert" },
  { name: "호떡", emoji: "🍰", category: "Dessert" },
  { name: "붕어빵", emoji: "🍰", category: "Dessert" },
  { name: "식혜", emoji: "🍰", category: "Dessert" },
  { name: "수정과", emoji: "🍰", category: "Dessert" },
]

export const drinkCategories: FoodDrinkItem[] = [
  // Korean Traditional Drinks
  { name: "소주", emoji: "🥃", category: "Korean Traditional" },
  { name: "막걸리", emoji: "🍶", category: "Korean Traditional" },
  { name: "동동주", emoji: "🍶", category: "Korean Traditional" },
  { name: "청주", emoji: "🍶", category: "Korean Traditional" },
  { name: "백세주", emoji: "🍶", category: "Korean Traditional" },
  { name: "산사춘", emoji: "🍶", category: "Korean Traditional" },
  
  // Korean Beer & Popular
  { name: "맥주", emoji: "🍺", category: "Korean Beer" },
  { name: "카스", emoji: "🍺", category: "Korean Beer" },
  { name: "하이트", emoji: "🍺", category: "Korean Beer" },
  { name: "클라우드", emoji: "🍺", category: "Korean Beer" },
  { name: "테라", emoji: "🍺", category: "Korean Beer" },
  { name: "크래프트비어", emoji: "🍺", category: "Korean Beer" },
  
  // Korean Coffee Culture
  { name: "아메리카노", emoji: "☕", category: "Korean Coffee" },
  { name: "카페라떼", emoji: "☕", category: "Korean Coffee" },
  { name: "카푸치노", emoji: "☕", category: "Korean Coffee" },
  { name: "에스프레소", emoji: "☕", category: "Korean Coffee" },
  { name: "카페모카", emoji: "☕", category: "Korean Coffee" },
  { name: "바닐라라떼", emoji: "☕", category: "Korean Coffee" },
  { name: "카라멜마끼아또", emoji: "☕", category: "Korean Coffee" },
  
  // Korean Tea & Traditional
  { name: "녹차", emoji: "🫖", category: "Korean Tea" },
  { name: "보리차", emoji: "🫖", category: "Korean Tea" },
  { name: "옥수수차", emoji: "🫖", category: "Korean Tea" },
  { name: "생강차", emoji: "🫖", category: "Korean Tea" },
  { name: "유자차", emoji: "🫖", category: "Korean Tea" },
  { name: "대추차", emoji: "🫖", category: "Korean Tea" },
  { name: "인삼차", emoji: "🫖", category: "Korean Tea" },
  
  // Korean Cocktails & Mixed
  { name: "소맥", emoji: "🍺", category: "Korean Mixed" },
  { name: "폭탄주", emoji: "🥃", category: "Korean Mixed" },
  { name: "깔루아밀크", emoji: "🥛", category: "Korean Mixed" },
  { name: "코코팜", emoji: "🍹", category: "Korean Mixed" },
  { name: "마이타이", emoji: "🍹", category: "Korean Mixed" },
  { name: "피나콜라다", emoji: "🍹", category: "Korean Mixed" },
  
  // Popular in Korea (International)
  { name: "와인", emoji: "🍷", category: "International" },
  { name: "레드와인", emoji: "🍷", category: "International" },
  { name: "화이트와인", emoji: "🥂", category: "International" },
  { name: "샴페인", emoji: "🍾", category: "International" },
  { name: "위스키", emoji: "🥃", category: "International" },
  { name: "보드카", emoji: "🥃", category: "International" },
  { name: "진", emoji: "🍸", category: "International" },
  { name: "럼", emoji: "🥃", category: "International" },
  { name: "테킬라", emoji: "🍹", category: "International" },
  
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