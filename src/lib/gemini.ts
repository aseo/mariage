// Gemini API configuration - Model fallback system
const MODELS = [
  'gemini-2.5-flash-lite',  // Primary: Fastest, best rate limits
  'gemini-2.0-flash-lite',  // Fallback 1: Very fast, most stable
  'gemini-2.5-flash',       // Fallback 2: Good performance
  'gemini-2.0-flash'        // Fallback 3: Reliable alternative
];

const API_KEY = process.env.GOOGLE_AI_API_KEY!;

// Simple in-memory cache for API responses
const cache = new Map<string, { data: unknown; timestamp: number }>();
const CACHE_DURATION = 12 * 60 * 60 * 1000; // 12 hours in milliseconds

if (!API_KEY) {
  console.error('GOOGLE_AI_API_KEY is not set in environment variables');
}

function getCacheKey(item: string): string {
  return item.toLowerCase().trim();
}

function getFromCache<T>(key: string): T | null {
  const cached = cache.get(key);
  if (!cached) return null;
  if (Date.now() - cached.timestamp > CACHE_DURATION) {
    cache.delete(key);
    return null;
  }
  return cached.data as T;
}

function setCache<T>(key: string, data: T): void {
  cache.set(key, { data, timestamp: Date.now() });
}

async function tryModel(modelName: string, prompt: string) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent`;
  const response = await fetch(url, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'x-goog-api-key': API_KEY
    },
    body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
  });
  return { response, modelName };
}

export interface DrinkRecommendation {
  rank: number;
  category: string;
  name: string;
  grade: string;
  emoji: string;
  explanation: string;
  imagePlaceholder: string;
}

export interface FoodRecommendation {
  rank: number;
  category: string;
  name: string;
  grade: string;
  emoji: string;
  explanation: string;
  imagePlaceholder: string;
}

// Change the return types to allow both success and error responses
export async function getDrinkRecommendations(foodItem: string): Promise<DrinkRecommendation[] | { error: true; message: string }> {
  const cacheKey = `drink:${foodItem.toLowerCase().trim()}`;
  const cached = getFromCache<DrinkRecommendation[]>(cacheKey);
  if (cached) return cached;

  const prompt = `시스템 지시:

출력은 반드시 JSON 배열만 허용됩니다. 배열 외의 텍스트, 코드블록, 주석, 설명 금지.
배열은 최소 1개 이상의 객체를 포함해야 합니다.
오류인 경우에도 배열 안에 하나의 에러 객체만 넣어 반환하세요.
당신은 한국인을 위한 요리에 어울리는 술 페어링 전문가입니다.

입력된 항목: ${foodItem}

음식 검증 규칙:
입력된 항목이 음식, 요리, 식재료가 맞는지 확인하세요.
컴퓨터, 사랑, 책, 자동차 등 음식이 아닌 항목이 입력되면 에러를 반환하세요.
오타나 비슷한 음식명은 허용하세요 (예: "삼겸살" → "삼겹살", "치키" → "치킨").

출력 규칙(중요):
출력은 항상 JSON 배열이어야 합니다.
정상 케이스: 배열에는 정확히 3개의 객체가 들어갑니다(각각 1~3위).
오류 케이스: 배열에는 정확히 1개의 에러 객체만 들어갑니다.
배열 외의 텍스트는 절대 포함하지 마세요.

정상 객체 스키마(각 1개 요소. 스키마 예시만, 내용 임의):
rank (number: 1|2|3)
category (string: 예 "맥주", "와인", "위스키" 등)
name (string: 예 "IPA", "소주", "핑크 모스카토")
grade (string: "A+" | "A" | "A-" | "B+" | "B")
emoji (string: 1개 이모지)
explanation (string: 2~3문장, 한국어, 친근하고 재밌는 톤, 맛의 조화 중심)
imagePlaceholder (string: 이모지 1개)

모든 객체는 위 키만 사용하세요. 불필요한 키 금지.

선정 규칙:
한국어로 작성.

아래 술 목록을 최우선 참고하되 가능하면 목록 안에서 추천(중복 남발 금지).
예: 소주/맥주(라거/IPA)/막걸리/사케/와인(레드/화이트/스파클링)/위스키/진/럼/보드카/사이더/과실주 등

5가지 후보 중 랜덤한 3가지를 등급 순서(A+ > A > A- > B+ > B)로 골라 rank 1→3에 배치.

동급이면 ‘와인’ 또는 ‘위스키’ 우선, 단 과장 금지.
카테고리는 다양하게.

최종 결과는 JSON 배열만 출력.

정상 출력 예(구조 예시만, 내용 임의):
[
{
"rank": 1,
"category": "맥주",
"name": "IPA",
"grade": "A+",
"emoji": "🍺",
"explanation": "매콤달콤 양념의 기름기를 홉의 쌉싸름함이 싹 잡아요. 톡 쏘는 탄산 덕에 끝맛이 깔끔해요.",
"imagePlaceholder": "🍺"
},
{
"rank": 2,
"category": "와인",
"name": "소비뇽 블랑",
"grade": "A",
"emoji": "🍷",
"explanation": "상큼한 산도가 느끼함을 정리해줘요. 허브향이 향신 맛과 어울리며 입맛을 돋워요.",
"imagePlaceholder": "🍷"
},
{
"rank": 3,
"category": "사케",
"name": "준마이",
"grade": "A-",
"emoji": "🍶",
"explanation": "담백한 쌀향과 은은한 감칠맛이 깔끔한 조화를 만들어요. 따뜻하게 마시면 풍미가 살아나요.",
"imagePlaceholder": "🍶"
}
]

오류 출력 예(항상 배열로, 객체 1개만):
[
{
"error": true,
"message": "다른 메뉴로 검색해 주세요."
}
]

참고 술 목록 (카테고리 | 이름):

레드 와인 | 피노 누아
레드 와인 | 쉬라즈
레드 와인 | 카베르네 소비뇽
레드 와인 | 메를로
레드 와인 | 진판델
레드 와인 | 말벡
화이트 와인 | 소비뇽 블랑
화이트 와인 | 샤르도네
화이트 와인 | 리슬링
화이트 와인 | 피노 그리
로제 와인 | 드라이 로제
로제 와인 | 스파클링 로제
스파클링 와인 | 프로세코
스파클링 와인 | 샴페인
스파클링 와인 | 까바
스파클링 와인 | 모스카토 다스티
막걸리 | 탄산감 있는 막걸리
막걸리 | 전통 생막걸리
막걸리 | 달콤한 막걸리
소주 | 소주
소주 | 과일 소주
소주 | 증류식 소주
맥주 | IPA
맥주 | 라거
맥주 | 필스너
맥주 | 스타우트
맥주 | 페일 에일
맥주 | 바이젠 (밀맥주)
맥주 | 흑맥주
사케 | 달콤한 사케
사케 | 드라이한 사케
사케 | 감칠맛 사케
위스키 | 버번 위스키
위스키 | 쉐리 위스키
위스키 | 피트 위스키
기타 | 하이볼
기타 | 고량주
기타 | 매실주


**이제 JSON으로만 응답해주세요. 추가 설명 없이 JSON만 출력해주세요.**`;

  for (const modelName of MODELS) {
    try {
      const { response } = await tryModel(modelName, prompt);
      if (!response.ok) {
        const errorText = await response.text();
        console.error('[Gemini API Error - getDrinkRecommendations]', {
          model: modelName,
          status: response.status,
          errorText,
          input: foodItem
        });
        if (response.status === 429) continue;
        throw new Error(`API request failed: ${response.status} - ${errorText}`);
      }
      const data = await response.json();
      const text = data.candidates[0].content.parts[0].text as string;
      // Add this log to always see raw response, even if status is 200
      console.log('[Gemini API Raw Response - getDrinkRecommendations]', {
        model: modelName,
        status: response.status,
        text,
        input: foodItem
      });
      const jsonMatch = text.match(/\[[\s\S]*\]/);
      if (!jsonMatch) {
        console.error('[Gemini API Error - getDrinkRecommendations]', {
          model: modelName,
          status: response.status,
          text,
          input: foodItem
        });
        throw new Error('Invalid response format');
      }
      const recommendations = JSON.parse(jsonMatch[0]) as DrinkRecommendation[];
      setCache(cacheKey, recommendations);
      return recommendations;
    } catch (err) {
      if (modelName === MODELS[MODELS.length - 1]) throw err;
      continue;
    }
  }
  throw new Error('문제가 발생했습니다. 잠시 후 다시 시도해주세요.');
}

export async function getFoodRecommendations(drinkItem: string): Promise<FoodRecommendation[] | { error: true; message: string }> {
  const cacheKey = `food-for-drink:${drinkItem.toLowerCase().trim()}`;
  const cached = getFromCache<FoodRecommendation[]>(cacheKey);
  if (cached) return cached;

  const prompt = `시스템 지시:

출력은 반드시 JSON 배열만 허용됩니다. 배열 외의 텍스트, 코드블록, 주석, 설명 금지.
배열은 최소 1개 이상의 객체를 포함해야 합니다.
오류인 경우에도 배열 안에 하나의 에러 객체만 넣어 반환하세요.
  
당신은 한국인의 입맛과 문화를 잘 이해하는 '술 페어링 전문가'입니다.
사용자가 입력한 술(예: IPA, 피노 누아, 버번 위스키 등)에 어울리는 요리 3가지를 추천해주세요.

중요: 먼저 입력값이 술인지 확인하세요.

입력된 항목: ${drinkItem}

술 검증 규칙:
맥주, 와인, 위스키, 소주, 막걸리, 사케, 전통주 등 알코올 음료만 허용
음식, 물, 주스, 커피, 차 등은 에러 반환
오타나 비슷한 표기는 허용 (예: '쉐리' → '셰리', '피노 누와' → '피노 누아')

출력 규칙(중요):
출력은 항상 JSON 배열이어야 합니다.
정상 케이스: 배열에는 정확히 3개의 객체가 들어갑니다(각각 1~3위).
오류 케이스: 배열에는 정확히 1개의 에러 객체만 들어갑니다.
배열 외의 텍스트는 절대 포함하지 마세요.

정상 객체 스키마(각 1개 요소. 스키마 예시만, 내용 임의):
rank (number: 1|2|3)
category (string: 예 "구이", "탕/찌개", "면", "전" 등)
name (string: 음식명)
grade (string: "A+" | "A" | "A-" | "B+" | "B")
emoji (string: 1개 이모지)
explanation (string: 2~3문장, 한국어, 친근하고 재밌는 톤, 맛의 조화 중심)
imagePlaceholder (string: 이모지 1개)

모든 객체는 위 키만 사용하세요. 불필요한 키 금지.

선정 규칙:
모든 결과는 한국어로 작성
다양한 종류의 요리를 추천 (비슷한 카테고리 반복 금지). 메인 요리 위주로 추천 (사이드, 반찬 제외)
한식, 양식, 일식, 중식, 동남아 등 한국인이 즐겨 먹는 다양한 요리들 위주로 추천
추천하는 음식 5가지 중 랜덤한 3가지를 선택. 등급 높은 순으로 나열
3가지 모두가 한 나라의 음식이 되지 않도록 다양성 유지
등급은 A+, A, A-, B+, B 중 하나 선택
동급 점수(궁합이 비슷)일 때는 뻔한 조합보다 의외로 잘 어울리는 음식을 우선 선택, 단 과장 금지.

explanation 규칙:
사용자가 포괄적인 '와인' / '레드 와인' / '화이트 와인'을 입력했다면, 와인 품종(예: 카베르네 소비뇽, 피노 누아, 샤르도네, 소비뇽 블랑 등)을 언급하고, 품종 기준으로 페어링 및 코멘트
사용자가 포괄적인 '위스키'를 입력했다면, 위스키 스타일(예: 피트, 셰리, 버번 등)을 언급하고, 스타일 기준으로 페어링 및 코멘트
사용자가 포괄적인 '맥주'를 입력했다면, 맥주 스타일(예: IPA, 라거, 페일 에일, 스타우트 등)을 언급하고, 스타일 기준으로 페어링 및 코멘트


최종 결과는 JSON만 배열만 출력.


정상 출력 예(구조 예시만, 내용 임의):
[
{
"rank": 1,
"category": "구이",
"name": "불고기",
"grade": "A+",
"emoji": "🥩",
"explanation": "피노 누아의 산도와 붉은 과실 향이 불고기의 달콤짭짤한 맛을 산뜻하게 받쳐줘요. 가벼운 탄닌이라 육즙을 해치지 않고 더 부드럽게 느껴집니다.",
"imagePlaceholder": "🥩"
},
{
"rank": 2,
"category": "면",
"name": "비빔국수",
"grade": "A",
"emoji": "🍜",
"explanation": "상큼한 산미의 소비뇽 블랑은 매콤새콤 양념과 잘 맞아요. 허브 느낌이 퍼지면서 뒷맛이 깔끔해집니다.",
"imagePlaceholder": "🍜"
},
{
"rank": 3,
"category": "튀김",
"name": "치킨",
"grade": "A-",
"emoji": "🍗",
"explanation": "IPA의 홉 향과 은근한 쌉싸름함이 튀김의 기름기를 정리해줘요. 탄산감 덕분에 한 입 더 당깁니다.",
"imagePlaceholder": "🍗"
}
]

오류 출력 예:
[
{
"error": true,
"message": "다른 술로 검색해 주세요."
}
]

지금 위 형식으로만 JSON 객체를 출력하세요.`;

  for (const modelName of MODELS) {
    try {
      const { response } = await tryModel(modelName, prompt);
      if (!response.ok) {
        const errorText = await response.text();
        console.error('[Gemini API Error - getFoodRecommendations]', {
          model: modelName,
          status: response.status,
          errorText,
          input: drinkItem
        });
        if (response.status === 429) continue;
        throw new Error(`API request failed: ${response.status} - ${errorText}`);
      }
      const data = await response.json();
      const text = data.candidates[0].content.parts[0].text as string;
      // Add this log to always see raw response, even if status is 200
      console.log('[Gemini API Raw Response - getFoodRecommendations]', {
        model: modelName,
        status: response.status,
        text,
        input: drinkItem
      });
      const jsonMatch = text.match(/\[[\s\S]*\]/);
      if (!jsonMatch) {
        console.error('[Gemini API Error - getFoodRecommendations]', {
          model: modelName,
          status: response.status,
          text,
          input: drinkItem
        });
        throw new Error('Invalid response format');
      }
      const recommendations = JSON.parse(jsonMatch[0]) as FoodRecommendation[];
      setCache(cacheKey, recommendations);
      return recommendations;
    } catch (err) {
      if (modelName === MODELS[MODELS.length - 1]) throw err;
      continue;
    }
  }
  throw new Error('문제가 발생했습니다. 잠시 후 다시 시도해주세요.');
}

