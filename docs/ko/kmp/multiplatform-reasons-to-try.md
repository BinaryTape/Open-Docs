[//]: # (title: Kotlin Multiplatform를 채택하고 프로젝트에 활력을 불어넣어야 하는 10가지 이유)

<web-summary>프로젝트에 Kotlin Multiplatform을 사용해야 하는 10가지 이유를 알아보세요. 기업의 실제 사례를 확인하고 멀티플랫폼 개발에 이 기술을 사용하기 시작하세요.</web-summary>

오늘날 다양한 기술 환경에서 개발자들은 개발 시간을 최적화하고 사용자 생산성을 높이면서 여러 플랫폼에서 원활하게 작동하는 애플리케이션을 구축해야 하는 과제에 직면해 있습니다. Kotlin Multiplatform (KMP)은 네이티브 프로그래밍의 장점을 유지하면서 여러 플랫폼용 앱을 만들고 코드 재사용을 용이하게 하는 솔루션을 제공합니다.

이 문서에서는 개발자들이 기존 또는 새로운 프로젝트에서 Kotlin Multiplatform 사용을 고려해야 하는 10가지 이유와 KMP가 계속해서 큰 인기를 얻는 이유를 살펴보겠습니다.

## 프로젝트에서 Kotlin Multiplatform을 사용해 봐야 하는 이유

효율성 향상을 추구하든 새로운 기술을 탐구하고 싶든, 이 문서는 개발 노력 간소화 능력부터 광범위한 플랫폼 지원 및 강력한 툴링 생태계에 이르기까지 Kotlin Multiplatform이 제공하는 실제적인 이점과 실제 기업의 사례 연구를 함께 설명합니다.

* [Kotlin Multiplatform은 코드 중복을 방지합니다](#1-kotlin-multiplatform-allows-you-to-avoid-code-duplication)
* [Kotlin Multiplatform은 광범위한 플랫폼을 지원합니다](#2-kotlin-multiplatform-supports-an-extensive-list-of-platforms)
* [Kotlin은 간소화된 코드 공유 메커니즘을 제공합니다](#3-kotlin-provides-simplified-code-sharing-mechanisms)
* [Kotlin Multiplatform은 유연한 멀티플랫폼 개발을 가능하게 합니다](#4-kotlin-multiplatform-allows-for-flexible-multiplatform-development)
* [Kotlin Multiplatform 솔루션으로 UI 코드를 공유할 수 있습니다](#5-with-the-kotlin-multiplatform-solution-you-can-share-ui-code)
* [기존 및 새 프로젝트에서 Kotlin Multiplatform을 사용할 수 있습니다](#6-you-can-use-kotlin-multiplatform-in-existing-and-new-projects)
* [Kotlin Multiplatform으로 코드를 점진적으로 공유할 수 있습니다](#7-with-kotlin-multiplatform-you-can-start-sharing-your-code-gradually)
* [Kotlin Multiplatform은 이미 글로벌 기업에서 사용하고 있습니다](#8-kotlin-multiplatform-is-already-used-by-global-companies)
* [Kotlin Multiplatform은 강력한 툴링 지원을 제공합니다](#9-kotlin-multiplatform-provides-powerful-tooling-support)
* [Kotlin Multiplatform은 크고 지원적인 커뮤니티를 자랑합니다](#10-kotlin-multiplatform-boasts-a-large-and-supportive-community)

### 1. Kotlin Multiplatform은 코드 중복을 방지합니다

중국 최대 검색 엔진인 Baidu는 젊은 층을 대상으로 하는 애플리케이션인 _Wonder App_을 출시했습니다. 기존 앱 개발에서 그들이 직면했던 몇 가지 문제는 다음과 같습니다.

*   앱 경험의 불일치: Android 앱이 iOS 앱과 다르게 작동했습니다.
*   비즈니스 로직 검증 비용 증가: 동일한 비즈니스 로직을 사용하는 iOS 및 Android 개발자들의 작업이 개별적으로 확인되어야 했으므로 비용이 많이 들었습니다.
*   업그레이드 및 유지보수 비용 증가: 비즈니스 로직을 중복하는 것은 복잡하고 시간이 많이 걸렸으며, 이는 앱의 업그레이드 및 유지보수 비용을 증가시켰습니다.

Baidu 팀은 Kotlin Multiplatform을 실험하기로 결정했으며, 데이터 모델, RESTful API 요청, JSON 데이터 파싱, 캐싱 로직 등 데이터 계층을 통합하는 것부터 시작했습니다.

그 후, 그들은 Kotlin Multiplatform으로 인터페이스 로직을 통합할 수 있는 Model-View-Intent (MVI) 사용자 인터페이스 패턴을 채택하기로 결정했습니다. 그들은 또한 로우레벨 데이터, 처리 로직, UI 처리 로직을 공유했습니다.

이 실험은 매우 성공적이었으며 다음과 같은 결과를 가져왔습니다.

*   Android 및 iOS 앱 전반에 걸쳐 일관된 경험을 제공했습니다.
*   유지보수 및 테스트 비용을 절감했습니다.
*   팀 내 생산성이 크게 향상되었습니다.

[![실제 Kotlin Multiplatform 사용 사례 살펴보기](kmp-use-cases-1.svg){width="700"}](https://www.jetbrains.com/help/kotlin-multiplatform-dev/case-studies.html)

### 2. Kotlin Multiplatform은 광범위한 플랫폼을 지원합니다

Kotlin Multiplatform의 주요 장점 중 하나는 다양한 플랫폼에 대한 광범위한 지원으로, 개발자에게 다재다능한 선택지가 됩니다. 이러한 플랫폼에는 Android, iOS, 데스크톱, 웹 (JavaScript 및 WebAssembly), 그리고 서버 (Java Virtual Machine)가 포함됩니다.

퀴즈를 통해 학습 및 연습을 돕는 인기 있는 교육 플랫폼인 _Quizlet_은 Kotlin Multiplatform의 이점을 강조하는 또 다른 사례 연구입니다. 이 플랫폼은 월 약 5천만 명의 활성 사용자를 보유하고 있으며, 그 중 1천만 명이 Android 사용자입니다. 이 앱은 Apple App Store 교육 카테고리 상위 10위권 내에 랭크되어 있습니다.

Quizlet 팀은 JavaScript, React Native, C++, Rust, Go와 같은 기술을 실험했지만, 성능, 안정성, 플랫폼별 상이한 구현 등 다양한 문제에 직면했습니다. 최종적으로 그들은 Android, iOS, 웹용으로 Kotlin Multiplatform을 선택했습니다. 다음은 KMP 사용이 Quizlet 팀에 가져다준 이점입니다.

*   객체 마샬링 시 더욱 타입 안전한 API.
*   JavaScript 대비 iOS에서 25% 더 빠른 채점 알고리즘.
*   Android 앱 크기 18MB에서 10MB로 감소.
*   향상된 개발자 경험.
*   Android, iOS, 백엔드 및 웹 개발자를 포함한 팀원들의 공유 코드 작성에 대한 관심 증가.

> [Kotlin Multiplatform이 제공하는 모든 기능 살펴보기](https://www.jetbrains.com/kotlin-multiplatform/)
>
{style="tip"}

### 3. Kotlin은 간소화된 코드 공유 메커니즘을 제공합니다

프로그래밍 언어의 세계에서 Kotlin은 다음과 같은 기능을 우선시하는 실용적인 접근 방식으로 두각을 나타냅니다.

*   **간결함보다 가독성**. 간결한 코드가 매력적이긴 하지만, Kotlin은 명확성이 가장 중요하다는 것을 이해합니다. 목표는 단순히 코드를 줄이는 것이 아니라 불필요한 상용구 코드를 제거하여 가독성과 유지보수성을 향상시키는 것입니다.

*   **단순한 표현력보다 코드 재사용성**. 단지 많은 문제를 해결하는 것만이 아니라, 패턴을 식별하고 재사용 가능한 라이브러리를 만드는 것입니다. 기존 솔루션을 활용하고 공통점을 추출함으로써 Kotlin은 개발자가 코드의 효율성을 극대화할 수 있도록 합니다.

*   **독창성보다 상호운용성**. 바퀴를 재발명하기보다는 Kotlin은 Java와 같은 기존 언어와의 호환성을 수용합니다. 이러한 상호운용성은 방대한 Java 에코시스템과의 원활한 통합을 허용할 뿐만 아니라 검증된 관행 및 이전 경험에서 얻은 교훈 채택을 용이하게 합니다.

*   **건전성보다 안전성 및 툴링**. Kotlin은 개발자가 오류를 조기에 발견할 수 있도록 하여 프로그램이 유효하지 않은 상태에 빠지지 않도록 보장합니다. 컴파일 중 또는 IDE에서 코드 작성 중 문제를 감지함으로써 Kotlin은 소프트웨어 신뢰성을 향상시키고 런타임 오류의 위험을 최소화합니다.

우리는 사용자의 언어 경험에 대해 배우기 위해 연간 Kotlin 설문조사를 실시합니다. 올해 응답자의 92%가 긍정적인 경험을 했다고 보고했는데, 이는 1년 전의 86%보다 눈에 띄게 증가한 수치입니다.

![2023년 및 2024년 Kotlin 만족도](kotlin-satisfaction-rate.png){width=700}

핵심 요점은 Kotlin이 가독성, 재사용성, 상호운용성, 안전성에 중점을 두어 개발자에게 매력적인 선택이 되고 생산성을 향상시킨다는 것입니다.

### 4. Kotlin Multiplatform은 유연한 멀티플랫폼 개발을 가능하게 합니다

Kotlin Multiplatform을 사용하면 개발자는 더 이상 네이티브 개발과 크로스 플랫폼 개발 사이에서 결정할 필요가 없습니다. 무엇을 공유하고 무엇을 네이티브로 작성할지 선택할 수 있습니다.

Kotlin Multiplatform 이전에는 개발자들이 모든 것을 네이티브로 작성해야 했습니다.

![Kotlin Multiplatform 이전: 모든 코드를 네이티브로 작성](before-kotlin-multiplatform.svg){width="700"}

Kotlin Multiplatform은 [Compose Multiplatform](https://www.jetbrains.com/lp/compose-multiplatform/) 덕분에 개발자가 비즈니스 로직, 프레젠테이션 로직, 또는 UI 로직까지 공유할 수 있도록 합니다.

![Kotlin Multiplatform 및 Compose Multiplatform 사용 시: 개발자는 비즈니스 로직, 프레젠테이션 로직, 또는 UI 로직까지 공유할 수 있습니다.](with-compose-multiplatform.svg){width="700"}

이제 플랫폼별 코드를 제외하고 거의 모든 것을 공유할 수 있습니다.

### 5. Kotlin Multiplatform 솔루션으로 UI 코드를 공유할 수 있습니다

JetBrains는 Kotlin 및 Jetpack Compose를 기반으로 Android (Jetpack Compose를 통해), iOS, 데스크톱, 웹 (알파)을 포함한 여러 플랫폼에서 사용자 인터페이스를 공유하기 위한 선언형 프레임워크인 [Compose Multiplatform](https://www.jetbrains.com/lp/compose-multiplatform/)을 제공합니다.

전자상거래 기업을 위한 라스트 마일 물류 플랫폼인 _Instabee_는 기술이 아직 알파 단계였음에도 불구하고 Android 및 iOS 애플리케이션에서 Compose Multiplatform을 사용하여 UI 로직을 공유하기 시작했습니다.

Compose Multiplatform의 공식 샘플로 [ImageViewer 앱](https://github.com/JetBrains/compose-multiplatform/tree/master/examples/imageviewer)이 있으며, 이 앱은 Android, iOS, 데스크톱, 웹에서 실행되며 지도 및 카메라와 같은 네이티브 컴포넌트와 통합되어 있습니다. 또한 커뮤니티 샘플인 [New York Times 앱](https://github.com/xxfast/NYTimes-KMP) 클론도 있으며, 이는 시계용 Wear OS 스마트워치 운영체제에서도 실행됩니다. 더 많은 예시를 보려면 [Kotlin Multiplatform 및 Compose Multiplatform 샘플](multiplatform-samples.md) 목록을 확인하세요.

[![Compose Multiplatform 살펴보기](explore-compose.svg){width="700"}](https://www.jetbrains.com/compose-multiplatform/)

### 6. 기존 및 새 프로젝트에서 Kotlin Multiplatform을 사용할 수 있습니다

다음 두 가지 시나리오를 살펴보겠습니다.

*   **기존 프로젝트에서 KMP 사용**

    다시 한번, Baidu의 Wonder App 사례가 있습니다. 팀은 이미 Android 및 iOS 앱을 가지고 있었고, 로직을 통합하기만 했습니다. 그들은 점진적으로 더 많은 라이브러리와 로직을 통합하기 시작했고, 그 결과 플랫폼 간에 공유되는 통합 코드베이스를 달성했습니다.

*   **새 프로젝트에서 KMP 사용**

    온라인 플랫폼이자 소셜 미디어 웹사이트인 _9GAG_는 Flutter 및 React Native와 같은 다양한 기술을 시도했지만, 최종적으로 Kotlin Multiplatform을 선택했습니다. 이를 통해 두 플랫폼에서 앱의 동작을 일치시킬 수 있었습니다. 그들은 먼저 Android 앱을 만드는 것부터 시작했습니다. 그런 다음, iOS에서 Kotlin Multiplatform 프로젝트를 의존성으로 사용했습니다.

### 7. Kotlin Multiplatform으로 코드를 점진적으로 공유할 수 있습니다

상수와 같은 간단한 요소부터 시작하여 이메일 유효성 검사와 같은 공통 유틸리티를 점진적으로 마이그레이션할 수 있습니다. 또한 트랜잭션 처리 또는 사용자 인증과 같은 비즈니스 로직을 작성하거나 마이그레이션할 수도 있습니다.

JetBrains에서는 Kotlin Multiplatform 설문조사를 자주 실시하며 커뮤니티에 다양한 플랫폼 간에 어떤 코드 부분을 공유하는지 묻습니다. 이 설문조사에 따르면 데이터 모델, 데이터 직렬화, 네트워킹, 분석 및 내부 유틸리티가 이 기술이 큰 영향을 미치는 주요 영역 중 일부인 것으로 나타났습니다.

![Kotlin Multiplatform을 사용하여 사용자가 플랫폼 간에 공유할 수 있는 코드 부분: 설문조사 결과](parts-of-code-share.png){width=700}

### 8. Kotlin Multiplatform은 이미 글로벌 기업에서 사용하고 있습니다

KMP는 Forbes, Philips, Cash App, Meetup, Autodesk를 비롯한 전 세계의 많은 대기업에서 이미 사용되고 있습니다. 이들의 모든 이야기는 [사례 연구 페이지](case-studies.topic)에서 확인할 수 있습니다.

2023년 11월, JetBrains는 Kotlin Multiplatform이 이제 [Stable](https://blog.jetbrains.com/kotlin/2023/11/kotlin-multiplatform-stable/)하다고 발표하여 더 많은 기업과 팀의 기술에 대한 관심을 끌었습니다.

### 9. Kotlin Multiplatform은 강력한 툴링 지원을 제공합니다

Kotlin Multiplatform 프로젝트를 작업할 때 강력한 툴링을 손쉽게 사용할 수 있습니다.

*   **Android Studio**. 이 통합 개발 환경(IDE)은 IntelliJ Community Edition을 기반으로 하며, Android 개발의 산업 표준으로 널리 인정받고 있습니다. Android Studio는 코딩, 디버깅, 성능 모니터링을 위한 포괄적인 기능 모음을 제공합니다.
*   **Xcode**. Apple의 IDE는 Kotlin Multiplatform 앱의 iOS 부분을 생성하는 데 사용될 수 있습니다. Xcode는 iOS 앱 개발의 표준이며, 코딩, 디버깅, 구성을 위한 풍부한 도구를 제공합니다. 단, Xcode는 Mac 전용입니다.

### 10. Kotlin Multiplatform은 크고 지원적인 커뮤니티를 자랑합니다

Kotlin과 Kotlin Multiplatform은 매우 지원적인 커뮤니티를 가지고 있습니다. 궁금한 점이 있다면 다음에서 답변을 찾을 수 있습니다.

*   [Kotlinlang Slack 워크스페이스](https://slack-chats.kotlinlang.org/). 이 워크스페이스는 약 6만 명의 회원을 보유하고 있으며, 크로스 플랫폼 개발 전용 채널로 [#multiplatform](https://slack-chats.kotlinlang.org/c/multiplatform), [#compose](https://slack-chats.kotlinlang.org/c/compose), 그리고 [#compose-ios](https://slack-chats.kotlinlang.org/c/compose-ios) 등이 있습니다.
*   [Kotlin X](https://twitter.com/kotlin). 여기서는 빠른 전문가 통찰력과 최신 뉴스, 그리고 수많은 멀티플랫폼 팁을 찾을 수 있습니다.
*   [Kotlin YouTube](https://www.youtube.com/channel/UCP7uiEZIqci43m22KDl0sNw). 저희 YouTube 채널은 실용적인 튜토리얼, 전문가와의 라이브 스트림, 그리고 시각 학습자를 위한 훌륭한 교육 콘텐츠를 제공합니다.
*   [Kotlin Roundup](https://lp.jetbrains.com/subscribe-to-kotlin-news/). 역동적인 Kotlin 및 Kotlin Multiplatform 에코시스템의 최신 업데이트를 놓치지 않으려면 정기 뉴스레터를 구독하세요!

Kotlin Multiplatform 생태계는 번성하고 있습니다. 전 세계 수많은 Kotlin 개발자에 의해 열정적으로 육성되고 있습니다. 다음은 연간 생성된 Kotlin Multiplatform 라이브러리 수를 보여주는 다이어그램입니다.

![지난 몇 년간의 Kotlin Multiplatform 라이브러리 수.](kmp-libs-over-years.png){width=700}

보시다시피 2021년에 확실한 증가가 있었고, 그 이후로 라이브러리 수는 계속 성장하고 있습니다.

## 다른 크로스 플랫폼 기술보다 Kotlin Multiplatform을 선택하는 이유

[다양한 크로스 플랫폼 솔루션](cross-platform-frameworks.md) 중에서 선택할 때 장단점을 모두 고려하는 것이 중요합니다. 다음은 Kotlin Multiplatform이 당신에게 적합한 선택일 수 있는 주요 이유를 분석한 것입니다.

*   **훌륭한 툴링, 사용하기 쉬움**. Kotlin Multiplatform은 Kotlin을 활용하여 개발자에게 훌륭한 툴링과 사용 편의성을 제공합니다.
*   **네이티브 프로그래밍**. 네이티브로 작성하기 쉽습니다. [expected 및 actual 선언](multiplatform-expect-actual.md) 덕분에 멀티플랫폼 앱이 플랫폼별 API에 액세스할 수 있도록 지원할 수 있습니다.
*   **뛰어난 크로스 플랫폼 성능**. Kotlin으로 작성된 공유 코드는 다양한 타겟에 대해 다른 출력 형식으로 컴파일됩니다. Android용 Java 바이트코드 및 iOS용 네이티브 바이너리로 컴파일되어 모든 플랫폼에서 좋은 성능을 보장합니다.

Kotlin Multiplatform을 시도하기로 이미 결정했다면, 시작하는 데 도움이 될 몇 가지 팁이 있습니다.

*   **작게 시작**. 팀이 Kotlin Multiplatform의 워크플로우와 이점에 익숙해지도록 작은 공유 컴포넌트나 상수부터 시작하세요.
*   **계획 수립**. 예상 결과와 구현 및 분석 방법을 가설로 설정하여 명확한 실험 계획을 수립하세요. 공유 코드 기여 역할을 정의하고 변경 사항을 효과적으로 배포하기 위한 워크플로우를 구축하세요.
*   **평가 및 회고 진행**. 팀과 함께 회고 미팅을 진행하여 실험의 성공 여부를 평가하고 어려움이나 개선 영역을 식별하세요. 성공했다면 범위를 확장하고 더 많은 코드를 공유하는 것을 고려할 수 있습니다. 그렇지 않다면 이 실험이 성공하지 못한 이유를 이해해야 합니다.

[![Kotlin Multiplatform을 실제 사용해보세요! 지금 시작하세요](kmp-get-started-action.svg){width="700"}](https://www.jetbrains.com/help/kotlin-multiplatform-dev/get-started.html)

팀이 Kotlin Multiplatform을 시작하는 데 도움을 주고 싶은 분들을 위해 실용적인 팁이 담긴 [상세 가이드](multiplatform-introduce-your-team.md)를 준비했습니다.

보시다시피 Kotlin Multiplatform은 이미 많은 대기업에서 고성능 크로스 플랫폼 애플리케이션을 네이티브와 같은 UI로 구축하고, 코드 재사용을 효과적으로 수행하며, 네이티브 프로그래밍의 장점을 유지하는 데 성공적으로 사용되고 있습니다.