[//]: # (title: 프로덕션 환경의 코틀린과 컴포즈 멀티플랫폼: 실제 사용 사례)

<web-summary>코틀린 멀티플랫폼과 컴포즈 멀티플랫폼이 실제 프로젝트에서 어떻게 프로덕션 환경에 사용되는지 알아보세요. 
실제 사용 사례를 예시와 함께 탐색해 보세요.</web-summary>

> 전 세계의 크고 작은 기업들이 컴포즈 멀티플랫폼(Compose Multiplatform)과 함께 코틀린 멀티플랫폼(KMP)을 채택하면서, 
> 이 기술은 현대적인 크로스 플랫폼 애플리케이션을 구축하고 확장하는 데 신뢰할 수 있는 솔루션이 되었습니다.
> 
{style="note"}

기존 앱 통합 및 앱 로직 공유부터 새로운 크로스 플랫폼 애플리케이션 구축에 이르기까지, 
[코틀린 멀티플랫폼](https://www.jetbrains.com/kotlin-multiplatform/)은 많은 기업이 선택하는 기술이 되었습니다. 이 팀들은 KMP가 제공하는 
장점을 활용하여 제품 출시를 가속화하고 개발 비용을 절감하고 있습니다.

점점 더 많은 기업이 코틀린 멀티플랫폼과 Google의 젯팩 컴포즈(Jetpack Compose)를 기반으로 하는 선언형 UI 프레임워크인 
[컴포즈 멀티플랫폼](https://www.jetbrains.com/compose-multiplatform/)을 채택하고 있습니다. [iOS용 안정화 버전 출시](https://blog.jetbrains.com/kotlin/2025/05/compose-multiplatform-1-8-0-released-compose-multiplatform-for-ios-is-stable-and-production-ready/)로 
컴포즈 멀티플랫폼은 완전한 모습을 갖추어, KMP는 크로스 플랫폼 모바일 개발을 위한 완벽한 솔루션이 되었습니다.

채택이 증가함에 따라, 이 글에서는 코틀린 멀티플랫폼이 다양한 산업 및 팀 구조에서 프로덕션 환경에 어떻게 사용되는지 살펴봅니다.

## 비즈니스 및 팀 유형별 코틀린 멀티플랫폼 사용 사례

다음은 다양한 팀들이 코틀린 멀티플랫폼을 적용하여 다양한 프로젝트 요구사항을 충족하는 여러 방법입니다:

### 새로운 그린필드 프로젝트를 시작하는 스타트업

스타트업은 종종 제한된 자원과 촉박한 마감 기한으로 운영됩니다. 개발 효율성과 비용 효율성을 극대화하기 위해, 
특히 시장 출시 시간이 중요한 초기 단계 제품이나 MVP(Minimum Viable Product)의 경우, 
공유 코드베이스를 사용하여 여러 플랫폼을 대상으로 하는 것이 유리합니다.

로직과 UI를 모두 공유하려는 기업에게 코틀린 멀티플랫폼과 컴포즈 멀티플랫폼은 이상적인 솔루션을 제공합니다. 
공유 UI로 시작하여 빠른 프로토타이핑이 가능하며, 네이티브 UI와 공유 UI를 혼합하여 사용할 수도 있습니다. 
이러한 점은 KMP와 컴포즈 멀티플랫폼을 그린필드 프로젝트에 이상적인 선택으로 만들어주며, 
스타트업이 속도, 유연성, 고품질 네이티브 경험 사이의 균형을 맞추는 데 도움을 줍니다.

**사례 연구:**

* [Instabee](https://www.youtube.com/watch?v=YsQ-2lQYQ8M)는 안드로이드 애플리케이션 로직과 UI를 코틀린 멀티플랫폼과 컴포즈 멀티플랫폼으로 마이그레이션했습니다. 
  안드로이드 코드베이스를 효과적으로 활용하여 단기간에 iOS 애플리케이션을 출시할 수 있었습니다.
* [Respawn Pro](https://youtu.be/LB5a2FRrT94?si=vgcJI-XoCrWree3u)는 습관 추적 및 생산성 앱을 개발합니다. 이 회사의 iOS 앱은 컴포즈 멀티플랫폼으로 
  구축되었으며, 안드로이드와 96%의 코드를 공유합니다.

> [코틀린 멀티플랫폼과 플러터(Flutter)](https://www.jetbrains.com/help/kotlin-multiplatform-dev/kotlin-multiplatform-flutter.html) 중 선택을 고민 중이라면, 
> 두 기술에 대한 저희의 개요를 놓치지 마세요.
> 
{style="tip"}

### 중소기업

중소기업은 종종 소규모 팀을 운영하면서도 성숙하고 기능이 풍부한 제품을 유지합니다. 
코틀린 멀티플랫폼을 통해 핵심 로직을 공유하면서도 사용자가 기대하는 네이티브 디자인과 느낌을 유지할 수 있습니다. 
기존 코드베이스를 활용함으로써, 이러한 팀은 사용자 경험을 손상시키지 않고 개발을 가속화할 수 있습니다.

KMP는 또한 크로스 플랫폼 기능을 점진적으로 도입할 수 있는 유연한 접근 방식을 지원합니다. 이는 기존 앱을 발전시키거나 
새로운 기능을 출시하는 팀에게 특히 효과적이며, 개발 시간을 단축하고 오버헤드를 줄이며 필요에 따라 
플랫폼별 맞춤화를 유지하는 데 도움을 줍니다.

**사례 연구:**

* [Down Dog](https://kotlinlang.org/lp/multiplatform/case-studies/down-dog/?_gl=1*xdrptd*_gcl_au*ODIxNDk5NDA4LjE3MjEwNDg0OTY.*_ga*MTY1Nzk3NDc4MC4xNzA1NDc1NDcw*_ga_9J976DJZ68*MTcyNzg1MTIzNS4yMzcuMS4xNzI3ODUxNDM0LjU2LjAuMA..)는 모바일 기기에 스튜디오와 같은 요가 경험을 제공하는 애플리케이션에 "최대 공유 코틀린" 전략을 사용합니다. 
  이 회사는 클라이언트와 서버 간에 다양한 헬퍼를 공유하며, 대부분의 클라이언트 코드를 코틀린 멀티플랫폼으로 공유합니다. 
  팀은 네이티브 전용 뷰를 유지하면서 앱의 개발 속도를 크게 높일 수 있었습니다.
* [Doist](https://www.youtube.com/watch?v=z-o9MqN86eE)는 수상 경력에 빛나는 할 일 목록 앱인 Todoist에 코틀린 멀티플랫폼을 활용했습니다. 팀은 안드로이드와 
  iOS 간에 핵심 로직을 공유하여 일관된 동작을 보장하고 개발을 간소화했습니다. 내부 라이브러리부터 시작하여 KMP를 점진적으로 채택했습니다.

### 애플리케이션에서 장치 간 일관된 동작이 필요한 대기업

대규모 애플리케이션은 일반적으로 광범위한 코드베이스를 가지며, 새로운 기능이 끊임없이 추가되고, 
모든 플랫폼에서 동일하게 작동해야 하는 복잡한 비즈니스 로직을 포함합니다. 코틀린 멀티플랫폼은 점진적인 통합을 제공하여, 
팀이 점진적으로 채택할 수 있도록 합니다. 개발자는 기존 코틀린 기술을 재사용할 수 있으므로, 
KMP를 사용하면 새로운 기술 스택을 도입할 필요가 없습니다.

**사례 연구:** [Forbes](https://www.forbes.com/sites/forbes-engineering/2023/11/13/forbes-mobile-app-shifts-to-kotlin-multiplatform/), [McDonald’s](https://medium.com/mcdonalds-technical-blog/mobile-multiplatform-development-at-mcdonalds-3b72c8d44ebc), [Google Docs](https://www.youtube.com/watch?v=5lkZj4v4-ks), [Philips](https://www.youtube.com/watch?v=hZPL8QqiLi8), [VMware](https://medium.com/vmware-end-user-computing/adopting-a-cross-platform-strategy-for-mobile-apps-59495ffa23b0), [Cash App](https://kotlinlang.org/lp/multiplatform/case-studies/cash-app?_gl=1*1qc1ixl*_gcl_aw*R0NMLjE3NTEzNTcwMDguRUFJYUlRb2JDaE1JblBLRmc0cWJqZ01WZ0VnZENSM3pYQkVWRUFFWUFTQUFFZ0ltOVBEX0J3RQ..*_gcl_au*MTE5NzY3MzgyLjE3NDk3MDk0NjI.*FPAU*MTE5NzY3MzgyLjE3NDk3MDk0NjI.*_ga*MTM4NjAyOTM0NS4xNzM2ODUwMzA5*_ga_9J976DJZ68*czE3NTE1MjQ2MDUkbzcxJGcxJHQxNzUxNTI3Njc5JGozJGwwJGgw), 
[Wonder App by Baidu](https://kotlinlang.org/lp/multiplatform/case-studies/baidu)

[![KMP 성공 사례 알아보기](kmp-success-stories.svg){width="700"}{style="block"}](case-studies.topic)

### 에이전시

다양한 클라이언트와 협력하는 에이전시 및 컨설팅 회사는 광범위한 플랫폼 요구사항과 비즈니스 목표를 수용해야 합니다. 
코틀린 멀티플랫폼으로 코드를 재사용하는 능력은 촉박한 일정과 제한된 엔지니어링 팀으로 여러 프로젝트를 관리하는 팀에게 특히 유용합니다. 
KMP를 채택함으로써 에이전시는 납품을 가속화하고 플랫폼 전반에 걸쳐 일관된 앱 동작을 유지할 수 있습니다. 

**사례 연구:**

* [IceRock](https://icerockdev.com/)은 코틀린 멀티플랫폼을 사용하여 클라이언트 앱을 개발하는 아웃소싱 회사입니다. 
  이 회사의 앱 포트폴리오는 다양한 비즈니스 요구사항을 포괄하며, 코틀린 멀티플랫폼 개발 프로세스를 향상시키는 
  방대한 오픈소스 코틀린 멀티플랫폼 라이브러리 컬렉션으로 보완됩니다.
* [Mirego](https://kotlinlang.org/lp/multiplatform/case-studies/mirego/), 엔드-투-엔드 디지털 제품 팀인 Mirego는 코틀린 멀티플랫폼을 사용하여 동일한 비즈니스 로직을 웹, 
  iOS, tvOS, 안드로이드, 아마존 파이어 TV에서 실행합니다. KMP는 각 플랫폼을 최대한 활용하면서도 개발을 간소화할 수 있도록 합니다.  

### 새로운 시장으로 확장하는 기업

일부 기업은 이전에 대상으로 삼지 않았던 플랫폼에 앱을 출시하여 새로운 시장에 진출하기를 원합니다. 
예를 들어, iOS 전용 앱에서 안드로이드도 포함하거나 그 반대의 경우입니다.

KMP는 기존 iOS 코드와 개발 관행을 활용하면서도 안드로이드에서 네이티브 성능과 UI 유연성을 유지하는 데 도움을 줍니다. 
플랫폼별 사용자 경험을 유지하고 기존 지식과 코드를 활용하려는 경우, 
KMP는 이상적인 장기 솔루션이 될 수 있습니다.

**사례 연구:** [Instabee](https://www.youtube.com/watch?v=YsQ-2lQYQ8M)는 코틀린 멀티플랫폼과 컴포즈 멀티플랫폼을 사용하여 안드로이드 앱 로직과 UI를 마이그레이션했습니다. 
이를 통해 회사는 기존 안드로이드 코드베이스의 대부분을 재사용하여 iOS 시장에 빠르게 진출할 수 있었습니다.

### 소프트웨어 개발 키트(SDK)를 개발하는 팀

공유된 코틀린 코드는 플랫폼별 바이너리(안드로이드용 JVM, iOS용 네이티브)로 컴파일되며 어떤 프로젝트에도 원활하게 통합됩니다. 
플랫폼별 API를 제한 없이 사용할 수 있는 유연성을 제공하며, 네이티브 UI와 크로스 플랫폼 UI 중 선택할 수 있습니다. 
이러한 기능은 코틀린 멀티플랫폼을 모바일 SDK 개발을 위한 훌륭한 옵션으로 만듭니다. 
소비자 관점에서 볼 때, 코틀린 멀티플랫폼 SDK는 일반적인 플랫폼별 의존성처럼 동작하면서도 
공유 코드의 이점을 제공합니다.

**사례 연구:** [Philips](https://www.youtube.com/watch?v=hZPL8QqiLi8)는 HealthSuite Digital Platform 모바일 SDK에 코틀린 멀티플랫폼을 사용하여, 
새로운 기능 개발을 가속화하고 안드로이드 및 iOS 개발자 간의 협업을 강화합니다.

## 산업별 코틀린 멀티플랫폼 사용 사례

코틀린 멀티플랫폼의 다재다능함은 프로덕션 환경에서 사용되는 광범위한 산업에서 명확하게 드러납니다. 
핀테크부터 교육에 이르기까지, 컴포즈 멀티플랫폼과 함께 KMP는 다양한 유형의 애플리케이션에 채택되었습니다. 
다음은 몇 가지 산업별 예시입니다:

### 금융 기술

핀테크 애플리케이션은 종종 복잡한 비즈니스 로직, 안전한 워크플로, 엄격한 규정 준수 요구사항을 포함하며, 
이 모든 것은 플랫폼 전반에 걸쳐 일관되게 구현되어야 합니다. 코틀린 멀티플랫폼은 이 핵심 로직을 단일 코드베이스로 통합하여 
플랫폼별 불일치의 위험을 줄이는 데 도움을 줍니다. 이는 iOS와 안드로이드 간의 더 빠른 기능 동등성(feature parity)을 보장하며, 
이는 지갑 및 결제 앱에 매우 중요합니다.

**사례 연구:** [Cash App](https://kotlinlang.org/lp/multiplatform/case-studies/cash-app), [Bitkey by Block](https://engineering.block.xyz/blog/how-bitkey-uses-cross-platform-development), [Worldline](https://blog.worldline.tech/2022/01/26/kotlin_multiplatform.html)

### 미디어 및 출판

미디어 및 콘텐츠 중심 앱은 빠른 기능 출시, 일관된 사용자 경험, 그리고 각 플랫폼에 맞게 UI를 맞춤화할 수 있는 
유연성에 의존합니다. 코틀린 멀티플랫폼을 통해 팀은 콘텐츠 피드 및 검색 섹션의 핵심 로직을 공유하면서도 
네이티브 UI를 완벽하게 제어할 수 있습니다. 이는 개발을 가속화하고, 비용이 많이 드는 중복을 줄이며, 
플랫폼 전반에 걸쳐 동등성을 보장합니다.

**사례 연구:** [Forbes](https://www.forbes.com/sites/forbes-engineering/2023/11/13/forbes-mobile-app-shifts-to-kotlin-multiplatform/), [9GAG](https://raymondctc.medium.com/adopting-kotlin-multiplatform-mobile-kmm-on-9gag-app-dfe526d9ce04), [Kuaishou](https://medium.com/@xiang.j9501/case-studies-kuaiying-kotlin-multiplatform-mobile-268e325f8610)

### 프로젝트 관리 및 생산성

공유 캘린더부터 실시간 협업에 이르기까지, 생산성 앱은 모든 플랫폼에서 동일하게 작동해야 하는 풍부한 기능을 요구합니다. 
코틀린 멀티플랫폼은 팀이 이러한 복잡성을 단일 공유 코드베이스에 집중하도록 돕고, 
모든 장치에서 일관된 기능과 동작을 보장합니다. 이러한 유연성은 팀이 더 빠르게 업데이트를 배포하고 
플랫폼 전반에 걸쳐 통합된 사용자 경험을 유지할 수 있음을 의미합니다.

**사례 연구:** [Wrike](https://www.youtube.com/watch?v=jhBmom8z3Qg), [VMware](https://medium.com/vmware-end-user-computing/adopting-a-cross-platform-strategy-for-mobile-apps-59495ffa23b0)

### 운송 및 모빌리티

승차 호출, 배달, 모빌리티 플랫폼은 드라이버, 승객, 판매자 앱에서 공통 기능을 공유함으로써 코틀린 멀티플랫폼의 이점을 얻습니다. 
실시간 추적, 경로 최적화 또는 인앱 채팅과 같은 서비스의 핵심 로직은 한 번 작성하여 안드로이드와 iOS 모두에서 사용할 수 있으므로, 
모든 사용자에게 일관된 동작을 보장합니다.

**사례 연구:** [Bolt](https://medium.com/vmware-end-user-computing/adopting-a-cross-platform-strategy-for-mobile-apps-59495ffa23b0), 
[Feres](case-studies.topic#case-study-feres)

### 교육 기술

교육 앱은 특히 대규모 분산형 사용자를 지원할 때 모바일과 웹 모두에서 원활하고 일관된 학습 경험을 제공해야 합니다. 
코틀린 멀티플랫폼으로 학습 알고리즘, 퀴즈 및 기타 비즈니스 로직을 중앙 집중화함으로써, 
교육 앱은 모든 장치에서 통일된 학습 경험을 제공합니다. 
이러한 코드 공유는 성능과 일관성을 크게 향상시킬 수 있습니다. 예를 들어, Quizlet은 공유 코드를 
JavaScript에서 코틀린으로 마이그레이션하여 안드로이드 및 iOS 앱 모두에서 현저한 속도 향상을 경험했습니다.

**사례 연구:** [Duolingo](https://youtu.be/RJtiFt5pbfs?si=mFpiN9SNs8m-jpFL), [Quizlet](https://quizlet.com/blog/shared-code-kotlin-multiplatform), [Chalk](https://kotlinlang.org/lp/multiplatform/case-studies/chalk/?_gl=1*1wxmdrv*_gcl_au*MTE5NzY3MzgyLjE3NDk3MDk0NjI.*FPAU*MTE5NzY3MzgyLjE3NDk3MDk0NjI.*_ga*MTM4NjAyOTM0NS4xNzM2ODUwMzA5*_ga_9J976DJZ68*czE3NTEwMjI5ODAkbzYwJGcxJHQxNzUxMDIzMTU2JGo1OCRsMCRoMA..), [Memrise](https://engineering.memrise.com/kotlin-multiplatform-memrise-3764b3a4a0db), 
[Physics Wallah](case-studies.topic#case-study-physics-wallah)

### 전자상거래

크로스 플랫폼 쇼핑 경험을 구축하는 것은 공유된 비즈니스 로직과 결제, 카메라 접근, 지도와 같은 네이티브 기능 간의 균형을 맞추는 것을 의미합니다. 
코틀린 멀티플랫폼과 컴포즈 멀티플랫폼은 필요한 경우 플랫폼별 구성 요소를 사용하면서도 
팀이 플랫폼 전반에 걸쳐 비즈니스 로직과 UI를 모두 공유할 수 있도록 합니다. 
이러한 하이브리드 접근 방식은 더 빠른 개발, 일관된 사용자 경험, 그리고 중요한 네이티브 기능을 통합할 수 있는 유연성을 보장합니다.

**사례 연구:** [Balary Market](case-studies.topic#case-study-balary), [Markaz](case-studies.topic#case-study-markaz)

### 소셜 네트워킹 및 커뮤니티

소셜 플랫폼에서는 시의적절한 기능 제공과 일관된 상호작용이 커뮤니티를 장치 전반에 걸쳐 활성화하고 연결하는 데 필수적입니다. 
핵심 상호작용 로직에는 메시징, 알림 또는 스케줄링이 포함될 수 있습니다. 
예를 들어, 사용자가 지역 그룹, 이벤트 및 활동을 찾을 수 있도록 하는 Meetup은 KMP 덕분에 
새로운 기능을 동시에 출시할 수 있었습니다.

**사례 연구:** [Meetup](https://youtu.be/GtJBS7B3eyM?si=lNX3KMhSTCICFPxv)

### 건강 및 웰니스

요가 세션을 안내하거나 장치 간에 건강 데이터를 동기화하는 등, 웰니스 앱은 응답성과 
신뢰할 수 있는 크로스 플랫폼 동작에 의존합니다. 이러한 앱은 종종 운동 로직 및 데이터 처리와 같은 핵심 기능을 공유해야 하며, 
동시에 완전히 네이티브 UI와 센서, 알림 또는 건강 API와 같은 플랫폼별 통합을 유지해야 합니다.

**사례 연구:** [Respawn Pro](https://youtu.be/LB5a2FRrT94?si=vgcJI-XoCrWree3u), [Fast&amp;Fit](case-studies.topic#case-study-fast-and-fit), [Philips](https://www.youtube.com/watch?v=hZPL8QqiLi8), [Down Dog](https://kotlinlang.org/lp/multiplatform/case-studies/down-dog/?_gl=1*1ryf8m7*_gcl_au*MTE5NzY3MzgyLjE3NDk3MDk0NjI.*FPAU*MTE5NzY3MzgyLjE3NDk3MDk0NjI.*_ga*MTM4NjAyOTM0NS4xNzM2ODUwMzA5*_ga_9J976DJZ68*czE3NTEyNzEzNzckbzYyJGcxJHQxNzUxMjcxMzgzJGo1NCRsMCRoMA..)

### 우편 서비스

흔한 사용 사례는 아니지만, 코틀린 멀티플랫폼은 377년 역사의 국영 우편 서비스에 의해 채택되기도 했습니다. 
노르웨이의 Posten Bring은 KMP를 사용하여 수십 개의 프런트엔드 및 백엔드 시스템에서 복잡한 비즈니스 로직을 통합하여, 
워크플로를 간소화하고 새로운 서비스 출시 시간을 몇 달에서 며칠로 급격히 단축하는 데 도움을 받았습니다.

**사례 연구:** [Posten Bring](https://2024.javazone.no/program/a1d9aeac-ffc3-4b1d-ba08-a0568f415a02)

이러한 예시들은 코틀린 멀티플랫폼이 거의 모든 산업이나 앱 유형에 어떻게 사용될 수 있는지 보여줍니다. 
핀테크 앱, 모빌리티 솔루션, 교육 플랫폼 또는 그 외 어떤 것을 구축하든, 
코틀린 멀티플랫폼은 네이티브 경험을 희생하지 않으면서도 프로젝트에 적합한 만큼 코드를 유연하게 공유할 수 있도록 합니다. 
또한 기술을 프로덕션 환경에서 사용하는 많은 다른 기업들을 보여주는 [KMP 사례 연구](case-studies.topic)의 광범위한 목록을 확인할 수 있습니다.