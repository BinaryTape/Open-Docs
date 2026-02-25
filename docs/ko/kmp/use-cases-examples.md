[//]: # (title: 프로덕션 환경의 Kotlin 및 Compose Multiplatform: 실제 활용 사례)

<web-summary>실제 프로젝트의 프로덕션 환경에서 Compose Multiplatform과 함께 Kotlin Multiplatform이 어떻게 사용되는지 알아보세요. 예시와 함께 실질적인 활용 사례를 살펴봅니다.</web-summary>

> 전 세계의 크고 작은 기업들이 Compose Multiplatform과 함께 Kotlin Multiplatform(KMP)을 도입함에 따라, 이 기술은 현대적인 크로스 플랫폼 애플리케이션을 구축하고 확장하기 위한 신뢰할 수 있는 솔루션으로 자리 잡았습니다.
> 
{style="note"}

기존 앱에 통합하고 앱 로직을 공유하는 것부터 새로운 크로스 플랫폼 애플리케이션을 구축하는 것까지, [Kotlin Multiplatform](https://www.jetbrains.com/kotlin-multiplatform/)은 많은 기업이 선택하는 기술이 되었습니다. 이러한 팀들은 KMP가 제공하는 이점을 활용하여 제품을 더 빠르게 출시하고 개발 비용을 절감하고 있습니다.

점점 더 많은 기업이 Kotlin Multiplatform과 Google의 Jetpack Compose를 기반으로 하는 선언형 UI 프레임워크인 [Compose Multiplatform](https://www.jetbrains.com/compose-multiplatform/)을 도입하고 있습니다. [iOS용 스테이블(Stable) 버전 출시](https://blog.jetbrains.com/kotlin/2025/05/compose-multiplatform-1-8-0-released-compose-multiplatform-for-ios-is-stable-and-production-ready/)와 함께 Compose Multiplatform이 완성되면서, KMP는 크로스 플랫폼 모바일 개발을 위한 완벽한 솔루션이 되었습니다.

도입 사례가 늘어남에 따라, 이 문서에서는 다양한 산업 분야와 팀 구조에서 Kotlin Multiplatform이 프로덕션 환경에 어떻게 사용되고 있는지 살펴봅니다.

## 비즈니스 및 팀 유형별 Kotlin Multiplatform 활용 사례

다양한 팀들이 프로젝트의 요구 사항을 충족하기 위해 Kotlin Multiplatform을 적용하는 몇 가지 방식은 다음과 같습니다.

### 새로운 그린필드(Greenfield) 프로젝트를 시작하는 스타트업

스타트업은 흔히 제한된 리소스와 촉박한 마감 기한 내에서 운영됩니다. 개발 효율성과 비용 효율성을 극대화하기 위해, 이들은 공유 코드베이스를 사용하여 여러 플랫폼을 타겟팅함으로써 이득을 얻습니다. 특히 시장 출시 속도(Time-to-market)가 중요한 초기 단계 제품이나 MVP에서 더욱 그렇습니다.

로직과 UI를 모두 공유하고자 하는 기업에 Kotlin Multiplatform과 Compose Multiplatform은 이상적인 솔루션을 제공합니다. 공유 UI로 시작하여 신속하게 프로토타입을 제작할 수 있으며, 네이티브 UI와 공유 UI를 혼합하여 사용할 수도 있습니다. 덕분에 KMP와 Compose Multiplatform은 그린필드 프로젝트에 이상적인 선택이 되며, 스타트업이 속도, 유연성, 고품질 네이티브 경험 사이의 균형을 잡을 수 있도록 돕습니다.

**사례 연구:**

* [Instabee](https://www.youtube.com/watch?v=YsQ-2lQYQ8M)는 안드로이드 애플리케이션 로직과 UI를 Compose Multiplatform이 포함된 Kotlin Multiplatform으로 마이그레이션했습니다. 안드로이드 코드베이스를 효과적으로 활용함으로써 짧은 기간 내에 iOS 애플리케이션을 출시할 수 있었습니다.
* [Respawn Pro](https://youtu.be/LB5a2FRrT94?si=vgcJI-XoCrWree3u)는 습관 추적 및 생산성 앱을 개발합니다. 이들의 iOS 앱은 Compose Multiplatform으로 구축되었으며, 안드로이드와 코드의 96%를 공유합니다.

> [Kotlin Multiplatform과 Flutter](https://www.jetbrains.com/help/kotlin-multiplatform-dev/kotlin-multiplatform-flutter.html) 중 고민 중이라면 두 기술에 대한 비교 개요를 확인해 보세요.
> 
{style="tip"}

### 중소기업

중소기업은 종종 소규모 팀으로 운영되면서도 완성도 높고 기능이 풍부한 제품을 유지해야 합니다. Kotlin Multiplatform을 사용하면 사용자가 기대하는 네이티브의 느낌(Look-and-feel)을 유지하면서도 핵심 로직을 공유할 수 있습니다. 이러한 팀들은 기존 코드베이스에 의존함으로써 사용자 경험을 저해하지 않으면서도 개발 속도를 높일 수 있습니다.

또한 KMP는 크로스 플랫폼 기능을 점진적으로 도입할 수 있는 유연한 방식을 지원합니다. 이는 기존 앱을 발전시키거나 새로운 기능을 출시하는 팀에 특히 효과적이며, 개발 시간을 단축하고 운영 비용을 낮추며 필요한 경우 플랫폼별 커스터마이징을 유지하는 데 도움이 됩니다.

**사례 연구:**

* [Down Dog](https://kotlinlang.org/lp/multiplatform/case-studies/down-dog/?_gl=1*xdrptd*_gcl_au*ODIxNDk5NDA4LjE3MjEwNDg0OTY.*_ga*MTY1Nzk3NDc4MC4xNzA1NDc1NDcw*_ga_9J976DJZ68*MTcyNzg1MTIzNS4yMzcuMS4xNzI3ODUxNDM0LjU2LjAuMA..)은 모바일 기기에 스튜디오와 같은 요가 경험을 제공하는 앱에 "최대한의 Kotlin 공유(maximum shared Kotlin)" 전략을 사용합니다. 이 기업은 클라이언트와 서버 간에 다양한 헬퍼(helper)를 공유하며, 클라이언트 코드의 대부분을 Kotlin Multiplatform으로 구현했습니다. 이 팀은 네이티브 전용 뷰를 유지하면서도 앱의 개발 속도를 크게 높일 수 있었습니다.
* [Doist](https://www.youtube.com/watch?v=z-o9MqN86eE)는 수상 경력에 빛나는 할 일 관리 앱인 Todoist에 Kotlin Multiplatform을 활용했습니다. 팀은 일관된 동작을 보장하고 개발을 간소화하기 위해 안드로이드와 iOS 간에 핵심 로직을 공유했습니다. 이들은 내부 라이브러리부터 시작하여 KMP를 점진적으로 도입했습니다.

### 애플리케이션 전반에서 기기 간 일관된 동작이 필요한 엔터프라이즈 기업

규모가 큰 애플리케이션은 대개 방대한 코드베이스를 보유하고 있으며, 새로운 기능이 지속적으로 추가되고 모든 플랫폼에서 동일하게 작동해야 하는 복잡한 비즈니스 로직을 가지고 있습니다. Kotlin Multiplatform은 점진적인 통합을 지원하여 팀이 단계를 나누어 도입할 수 있게 해줍니다. 또한 개발자가 기존의 Kotlin 기술을 재사용할 수 있으므로, KMP를 사용하면 새로운 기술 스택을 도입해야 하는 부담도 덜 수 있습니다.

**사례 연구:** [Forbes](https://www.forbes.com/sites/forbes-engineering/2023/11/13/forbes-mobile-app-shifts-to-kotlin-multiplatform/), [McDonald’s](https://medium.com/mcdonalds-technical-blog/mobile-multiplatform-development-at-mcdonalds-3b72c8d44ebc), [Google Docs](https://www.youtube.com/watch?v=5lkZj4v4-ks), [Philips](https://www.youtube.com/watch?v=hZPL8QqiLi8), [VMware](https://medium.com/vmware-end-user-computing/adopting-a-cross-platform-strategy-for-mobile-apps-59495ffa23b0), [Cash App](https://kotlinlang.org/lp/multiplatform/case-studies/cash-app?_gl=1*1qc1ixl*_gcl_aw*R0NMLjE3NTEzNTcwMDguRUFJYUlRb2JDaE1JblBLRmc0cWJqZ01WZ0VnZENSM3pYQkVWRUFFWUFTQUFFZ0ltOVBEX0J3RQ..*_gcl_au*MTE5NzY3MzgyLjE3NDk3MDk0NjI.*FPAU*MTE5NzY3MzgyLjE3NDk3MDk0NjI.*_ga*MTM4NjAyOTM0NS4xNzM2ODUwMzA5*_ga_9J976DJZ68*czE3NTE1MjQ2MDUkbzcxJGcxJHQxNzUxNTI3Njc5JGozJGwwJGgw), 
[Wonder App by Baidu](https://kotlinlang.org/lp/multiplatform/case-studies/baidu)

[![KMP 성공 사례에서 배우기](kmp-success-stories.svg){width="700"}{style="block"}](https://kotlinlang.org/case-studies/?type=multiplatform)

### 에이전시

다양한 클라이언트와 협력하는 에이전시 및 컨설팅 회사는 폭넓은 플랫폼 요구 사항과 비즈니스 목표를 수용해야 합니다. Kotlin Multiplatform을 통한 코드 재사용 능력은 촉박한 일정과 제한된 엔지니어링 팀으로 여러 프로젝트를 관리하는 팀에게 특히 가치가 있습니다. KMP를 도입함으로써 에이전시는 제품 인도를 가속화하고 플랫폼 전반에 걸쳐 일관된 앱 동작을 유지할 수 있습니다.

**사례 연구:**

* [Touchlab](https://touchlab.co/)은 Kotlin Multiplatform을 활용한 크로스 플랫폼 개발 및 자문 업무를 전문으로 합니다. Touchlab은 또한 Kotlin에서 게시된 Swift API를 개선하는 [SKIE](https://github.com/touchlab/SKIE)와 [Xcode용 Kotlin 플러그인](https://github.com/touchlab/xcode-kotlin) 등 iOS 개발 경험을 향상시키는 도구들을 제작합니다.
* [IceRock](https://icerockdev.com/)은 Kotlin Multiplatform을 사용하여 클라이언트를 위한 앱을 개발하는 아웃소싱 회사입니다. 이들의 앱 포트폴리오는 다양한 비즈니스 요구 사항을 아우르며, Kotlin Multiplatform 개발 프로세스를 향상시키는 방대한 오픈 소스 라이브러리 컬렉션을 보유하고 있습니다.
* 엔드 투 엔드 디지털 제품 팀인 [Mirego](https://kotlinlang.org/lp/multiplatform/case-studies/mirego/)는 Kotlin Multiplatform을 사용하여 웹, iOS, tvOS, 안드로이드, Amazon Fire TV에서 동일한 비즈니스 로직을 실행합니다. KMP를 통해 개발 과정을 간소화하면서도 각 플랫폼의 장점을 최대한 활용하고 있습니다.

### 새로운 시장으로 확장하려는 기업

일부 기업은 이전에는 타겟팅하지 않았던 플랫폼(예: iOS 전용에서 안드로이드 포함으로, 또는 그 반대)에 앱을 출시하여 새로운 시장에 진입하고자 합니다.

KMP는 안드로이드에서 네이티브 성능과 UI 유연성을 유지하면서 기존의 iOS 코드 및 개발 관행을 활용할 수 있도록 도와줍니다. 플랫폼별 사용자 경험을 유지하면서 기존 지식과 코드를 활용하고 싶다면, KMP가 이상적인 장기적 솔루션이 될 수 있습니다.

**사례 연구:** [Instabee](https://www.youtube.com/watch?v=YsQ-2lQYQ8M)는 안드로이드 앱 로직과 UI를 마이그레이션하기 위해 Compose Multiplatform과 함께 Kotlin Multiplatform을 사용했습니다. 이를 통해 기존 안드로이드 코드베이스를 상당 부분 재사용하여 iOS 시장에 빠르게 진입할 수 있었습니다.

### 소프트웨어 개발 키트(SDK)를 개발하는 팀

공유된 Kotlin 코드는 플랫폼별 바이너리(안드로이드용 JVM, iOS용 네이티브)로 컴파일되며 모든 프로젝트에 원활하게 통합됩니다. 플랫폼별 API를 제한 없이 사용할 수 있는 유연성을 제공하며, 네이티브 UI와 크로스 플랫폼 UI 중 하나를 선택할 수도 있습니다. 이러한 기능 덕분에 Kotlin Multiplatform은 모바일 SDK 개발을 위한 탁월한 선택이 됩니다. 사용자의 관점에서 볼 때, 여러분의 Kotlin Multiplatform SDK는 코드 공유의 이점을 제공하면서도 일반적인 플랫폼 전용 의존성처럼 작동할 것입니다.

**사례 연구:** [Philips](https://www.youtube.com/watch?v=hZPL8QqiLi8)는 HealthSuite Digital Platform 모바일 SDK에 Kotlin Multiplatform을 사용하여 새로운 기능의 개발 속도를 높이고 안드로이드와 iOS 개발자 간의 협업을 강화하고 있습니다.

## 산업별 Kotlin Multiplatform 활용 사례

Kotlin Multiplatform의 다재다능함은 프로덕션 환경에서 사용되는 광범위한 산업 분야를 통해 입증되었습니다. 핀테크에서 교육에 이르기까지, Compose Multiplatform을 포함한 KMP는 다양한 유형의 애플리케이션에 도입되었습니다. 다음은 산업별 몇 가지 예시입니다.

### 금융 기술 (핀테크)

핀테크 애플리케이션은 종종 복잡한 비즈니스 로직, 보안 워크플로, 엄격한 규정 준수 요구 사항을 수반하며, 이 모든 것들이 플랫폼 전반에서 일관되게 구현되어야 합니다. Kotlin Multiplatform은 이러한 핵심 로직을 하나의 코드베이스로 통합하여 플랫폼 간 불일치 위험을 줄여줍니다. 또한 지갑이나 결제와 같은 앱에 필수적인 iOS와 안드로이드 간의 빠른 기능 동등성(Feature parity)을 보장합니다.

**사례 연구:** [Cash App](https://kotlinlang.org/lp/multiplatform/case-studies/cash-app), [Bitkey by Block](https://engineering.block.xyz/blog/how-bitkey-uses-cross-platform-development), [Worldline](https://blog.worldline.tech/2022/01/26/kotlin_multiplatform.html)

### 미디어 및 출판

미디어 및 콘텐츠 중심 앱은 빠른 기능 출시, 일관된 사용자 경험, 플랫폼별 UI 커스텀 유연성에 의존합니다. Kotlin Multiplatform을 사용하면 팀이 콘텐츠 피드 및 탐색 섹션에 대한 핵심 로직을 공유하면서도 네이티브 UI에 대한 완전한 제어권을 유지할 수 있습니다. 이는 개발을 가속화하고, 비용이 많이 드는 중복 작업을 줄이며, 플랫폼 간의 기능 일치를 보장합니다.

**사례 연구:** [Forbes](https://www.forbes.com/sites/forbes-engineering/2023/11/13/forbes-mobile-app-shifts-to-kotlin-multiplatform/), [9GAG](https://raymondctc.medium.com/adopting-kotlin-multiplatform-mobile-kmm-on-9gag-app-dfe526d9ce04), [Kuaishou](https://medium.com/@xiang.j9501/case-studies-kuaiying-kotlin-multiplatform-mobile-268e325f8610)

### 프로젝트 관리 및 생산성

공유 캘린더부터 실시간 협업에 이르기까지, 생산성 앱은 모든 플랫폼에서 동일하게 작동해야 하는 풍부한 기능을 요구합니다. Kotlin Multiplatform은 팀이 이러한 복잡성을 하나의 공유 코드베이스로 집중시킬 수 있도록 도와 모든 기기에서 일관된 기능과 동작을 보장합니다. 이러한 유연성은 팀이 업데이트를 더 빠르게 출시하고 플랫폼 전반에서 통합된 사용자 경험을 유지할 수 있음을 의미합니다.

**사례 연구:** [Wrike](https://www.youtube.com/watch?v=jhBmom8z3Qg), [VMware](https://medium.com/vmware-end-user-computing/adopting-a-cross-platform-strategy-for-mobile-apps-59495ffa23b0)

### 교통 및 모빌리티

차량 호출, 배달, 모빌리티 플랫폼은 드라이버, 라이더, 가맹점 앱 간에 공통 기능을 공유함으로써 Kotlin Multiplatform의 이점을 누립니다. 실시간 추적, 경로 최적화 또는 앱 내 채팅과 같은 서비스의 핵심 로직을 한 번 작성하여 안드로이드와 iOS 모두에서 사용할 수 있으므로 모든 사용자에게 일관된 동작을 보장합니다.

**사례 연구:** [Bolt](https://medium.com/vmware-end-user-computing/adopting-a-cross-platform-strategy-for-mobile-apps-59495ffa23b0), 
[Feres](https://kotlinlang.org/case-studies/#case-study-feres)

### 교육 기술 (에듀테크)

교육 앱은 특히 대규모의 분산된 사용자 층을 지원할 때 모바일과 웹 모두에서 원활하고 일관된 학습 경험을 제공해야 합니다. 학습 알고리즘, 퀴즈 및 기타 비즈니스 로직을 Kotlin Multiplatform으로 중앙 집중화함으로써, 교육 앱은 모든 기기에서 균일한 학습 경험을 제공합니다. 이러한 코드 공유는 성능과 일관성을 크게 향상시킬 수 있습니다. 예를 들어 Quizlet은 공유 코드를 JavaScript에서 Kotlin으로 마이그레이션한 후 안드로이드와 iOS 앱 모두에서 눈에 띄는 속도 향상을 경험했습니다.

**사례 연구:** [Duolingo](https://youtu.be/RJtiFt5pbfs?si=mFpiN9SNs8m-jpFL), [Quizlet](https://quizlet.com/blog/shared-code-kotlin-multiplatform), [Chalk](https://kotlinlang.org/lp/multiplatform/case-studies/chalk/?_gl=1*1wxmdrv*_gcl_au*MTE5NzY3MzgyLjE3NDk3MDk0NjI.*FPAU*MTE5NzY3MzgyLjE3NDk3MDk0NjI.*_ga*MTM4NjAyOTM0NS4xNzM2ODUwMzA5*_ga_9J976DJZ68*czE3NTEwMjI5ODAkbzYwJGcxJHQxNzUxMDIzMTU2JGo1OCRsMCRoMA..), [Memrise](https://engineering.memrise.com/kotlin-multiplatform-memrise-3764b5a4a0db), 
[Physics Wallah](https://kotlinlang.org/case-studies/#case-study-physics-wallah)

### 이커머스

크로스 플랫폼 쇼핑 경험을 구축한다는 것은 공유 비즈니스 로직과 결제, 카메라 접근, 지도와 같은 네이티브 기능 간의 균형을 맞추는 것을 의미합니다. Compose Multiplatform과 함께 Kotlin Multiplatform을 사용하면 팀이 비즈니스 로직과 UI를 플랫폼 전반에서 공유하는 동시에 필요한 곳에서는 플랫폼별 컴포넌트를 계속 사용할 수 있습니다. 이러한 하이브리드 접근 방식은 더 빠른 개발, 일관된 사용자 경험, 그리고 중요한 네이티브 기능을 통합할 수 있는 유연성을 보장합니다.

**사례 연구:** [Balary Market](https://kotlinlang.org/case-studies/#case-study-balary), [Markaz](https://kotlinlang.org/case-studies/#case-study-markaz)

### 소셜 네트워킹 및 커뮤니티

소셜 플랫폼에서는 커뮤니티를 활성화하고 기기 간 연결을 유지하기 위해 시기적절한 기능 제공과 일관된 상호작용이 필수적입니다. 주요 상호작용 로직에는 메시징, 알림 또는 일정 관리가 포함될 수 있습니다. 예를 들어 사용자가 지역 그룹, 이벤트 및 활동을 찾을 수 있도록 돕는 Meetup은 KMP 덕분에 새로운 기능을 동시에 출시할 수 있었습니다.

**사례 연구:** [Meetup](https://youtu.be/GtJBS7B3eyM?si=lNX3KMhSTCICFPxv)

### 건강 및 웰니스

요가 세션을 안내하든 기기 간에 건강 데이터를 동기화하든, 웰니스 앱은 응답성과 신뢰할 수 있는 크로스 플랫폼 동작에 의존합니다. 이러한 앱은 운동 로직 및 데이터 처리와 같은 핵심 기능을 공유해야 하는 경우가 많으며, 동시에 완전한 네이티브 UI와 센서, 알림 또는 건강 API와 같은 플랫폼별 통합을 유지해야 합니다.

**사례 연구:** [Respawn Pro](https://youtu.be/LB5a2FRrT94?si=vgcJI-XoCrWree3u), [Fast&amp;Fit](https://kotlinlang.org/case-studies/#case-study-fast-and-fit), [Philips](https://www.youtube.com/watch?v=hZPL8QqiLi8), [Down Dog](https://kotlinlang.org/lp/multiplatform/case-studies/down-dog)

### 우편 서비스

일반적인 사례는 아니지만, Kotlin Multiplatform은 377년 전통의 국가 우편 서비스에서도 채택되었습니다. 노르웨이의 Posten Bring은 수십 개의 프론트엔드 및 백엔드 시스템에서 복잡한 비즈니스 로직을 통합하기 위해 KMP를 사용하며, 이를 통해 워크플로를 간소화하고 새로운 서비스를 출시하는 데 걸리는 시간을 몇 달에서 몇 일로 획기적으로 단축했습니다.

**사례 연구:** [Posten Bring](https://2024.javazone.no/program/a1d9aeac-ffc3-4b1d-ba08-a0568f415a02)

이러한 예시들은 Kotlin Multiplatform이 사실상 모든 산업이나 앱 유형에서 어떻게 사용될 수 있는지를 잘 보여줍니다. 핀테크 앱, 모빌리티 솔루션, 교육 플랫폼 중 무엇을 구축하든 관계없이, Kotlin Multiplatform은 네이티브 경험을 희생하지 않으면서 프로젝트에 타당한 만큼 코드를 공유할 수 있는 유연성을 제공합니다. 또한 프로덕션 환경에서 이 기술을 사용하는 더 많은 기업을 보여주는 광범위한 [KMP 사례 연구 목록](https://kotlinlang.org/case-studies/?type=multiplatform)을 확인할 수 있습니다.