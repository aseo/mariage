import type { Metadata } from "next";
import localFont from "next/font/local";
import Script from "next/script";
import "./globals.css";

const pretendard = localFont({
  src: [
    {
      path: "../fonts/Pretendard-Regular.woff",
      weight: "400",
      style: "normal",
    },
    {
      path: "../fonts/Pretendard-Medium.woff",
      weight: "500",
      style: "normal",
    },
    {
      path: "../fonts/Pretendard-SemiBold.woff",
      weight: "600",
      style: "normal",
    },
    {
      path: "../fonts/Pretendard-Bold.woff",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-pretendard",
});

export const metadata: Metadata = {
  title: "오늘 안주엔 이 술 어때요? | AI 안주 궁합 추천",
  description: "어떤 술이 오늘 안주에 어울릴까? 고민 끝! AI가 딱 맞는 술을 추천해드립니다. 삼겹살, 치킨, 회 등 모든 안주에 어울리는 술을 찾아보세요.",
  keywords: [
    "안주 궁합", "술 추천", "음식 술 페어링", "삼겹살 술", "치킨 술", "회 술", 
    "맥주 안주", "소주 안주", "와인 안주", "위스키 안주", "AI 추천", "음식 궁합",
    "술안주", "안주추천", "술추천", "음식페어링", "한국술", "맥주추천", "소주추천"
  ],
  authors: [{ name: "AI 안주 궁합 추천" }],
  creator: "AI 안주 궁합 추천",
  publisher: "AI 안주 궁합 추천",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://anju-mate.vercel.app'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: "오늘 안주엔 이 술 어때요? | AI 안주 궁합 추천",
    description: "어떤 술이 오늘 안주에 어울릴까? 고민 끝! AI가 딱 맞는 술을 추천해드립니다.",
          url: 'https://anju-mate.vercel.app',
    siteName: 'AI 안주 궁합 추천',
    locale: 'ko_KR',
    type: 'website',
    images: [
      {
        url: 'https://anju-mate.vercel.app/food-drink-pairing.png',
        width: 1200,
        height: 630,
        alt: 'AI 안주 궁합 추천 - 삼겹살, 치킨, 회 등 모든 안주에 어울리는 술을 찾아보세요',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: "오늘 안주엔 이 술 어때요? | AI 안주 궁합 추천",
    description: "어떤 술이 오늘 안주에 어울릴까? 고민 끝! AI가 딱 맞는 술을 추천해드립니다.",
    images: ['https://anju-mate.vercel.app/food-drink-pairing.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code', // Replace with your Google Search Console verification code
    // naver: 'your-naver-verification-code', // Add if you have Naver Webmaster Tools
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "오늘 안주엔 이 술 어때요?",
  },
  other: {
    'naver-site-verification': 'your-naver-verification-code', // Replace with your Naver verification code
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#f8fafc",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        <meta name="theme-color" content="#f8fafc" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="오늘 안주엔 이 술 어때요?" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="application-name" content="AI 안주 궁합 추천" />
        <link rel="manifest" href="/manifest.json" />

        
        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-T28R4GGGXP"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-T28R4GGGXP');
          `}
        </Script>
      </head>
      <body
        className={`${pretendard.variable} font-sans antialiased`}
        suppressHydrationWarning={true}
      >
        {children}
      </body>
    </html>
  );
}
