[//]: # (title: 가장 인기 있는 6가지 크로스 플랫폼 앱 개발 프레임워크)

[//]: # (description: 이 문서에서는 가장 인기 있는 6가지 크로스 플랫폼 앱 개발 프레임워크를 소개하고, 프로젝트를 위한 크로스 플랫폼 도구를 선택할 때 고려해야 할 주요 사항을 설명합니다.)

수년에 걸쳐 크로스 플랫폼(cross-platform) 앱 개발은 모바일 애플리케이션을 구축하는 가장 인기 있는 방법 중 하나가 되었습니다.
크로스 플랫폼 또는 멀티플랫폼(multiplatform) 접근 방식을 사용하면 개발자는 서로 다른 모바일 플랫폼에서 유사하게 실행되는 앱을 만들 수 있습니다.

다음 Google 트렌드 차트에서 볼 수 있듯이 2010년부터 현재까지 이 분야에 대한 관심은 꾸준히 증가해 왔습니다.

![크로스 플랫폼 앱 개발에 대한 관심을 보여주는 Google 트렌드 차트](google-trends-cross-platform.png){width=700}

빠르게 발전하는 [크로스 플랫폼 모바일 개발](cross-platform-mobile-development.md#kotlin-multiplatform) 기술의 인기가 높아짐에 따라 시장에는 많은 새로운 도구가 등장했습니다.
선택지가 많아지면서 귀하의 요구 사항에 가장 적합한 도구를 선택하는 것이 어려울 수 있습니다.
적합한 도구를 찾는 데 도움을 드리고자, 가장 뛰어난 6가지 크로스 플랫폼 앱 개발 프레임워크와 그 특징들을 정리했습니다.
이 문서의 마지막 부분에서는 비즈니스를 위한 멀티플랫폼 개발 프레임워크를 선택할 때 주의해야 할 몇 가지 핵심 사항도 확인할 수 있습니다.

## 크로스 플랫폼 앱 개발 프레임워크란 무엇인가요?

모바일 엔지니어는 크로스 플랫폼 모바일 개발 프레임워크를 사용하여 단일 코드베이스(single codebase)로 안드로이드(Android) 및 iOS와 같은 여러 플랫폼에서 네이티브와 유사한 애플리케이션을 빌드합니다. 공유 가능한 코드는 이 방식이 네이티브 앱 개발에 비해 갖는 주요 장점 중 하나입니다. 단일 코드베이스를 사용하면 모바일 엔지니어가 각 운영 체제별로 코드를 작성할 필요가 없어 시간을 절약하고 개발 프로세스를 가속화할 수 있습니다.

## 인기 있는 크로스 플랫폼 앱 개발 프레임워크

이 목록이 전부는 아니며 현재 시장에는 더 많은 옵션이 존재합니다. 중요한 것은 모든 상황에 이상적인 '만능 도구'는 없다는 점을 인식하는 것입니다.
프레임워크의 선택은 특정 프로젝트와 목표, 그리고 문서 끝부분에서 다룰 다른 세부 사항에 따라 크게 달라집니다.

그럼에도 불구하고, 결정의 시작점이 될 수 있도록 크로스 플랫폼 모바일 개발을 위한 최상의 프레임워크들을 선정해 보았습니다.

### Kotlin Multiplatform

[Kotlin Multiplatform (KMP)](https://kotlinlang.org/multiplatform/)은 JetBrains에서 개발한 오픈 소스 기술로, 네이티브 프로그래밍의 이점을 유지하면서 플랫폼 간에 코드를 공유할 수 있게 해줍니다. 개발자는 원하는 만큼 코드를 재사용하고, 필요한 경우 네이티브 코드를 작성하며, 공유된 Kotlin 코드를 모든 프로젝트에 원활하게 통합할 수 있습니다. 현대적인 선언형 크로스 플랫폼 UI 프레임워크인 [Compose Multiplatform](https://www.jetbrains.com/lp/compose-multiplatform/)과 함께 Kotlin을 사용하면 UI를 포함한 앱 코드의 최대 100%까지 공유할 수 있습니다.

**프로그래밍 언어:** Kotlin.

**모바일 앱 사례:** Duolingo, McDonald's, Netflix, Forbes, 9GAG, Cash App, Philips. [Kotlin Multiplatform 사례 연구 더 보기](https://kotlinlang.org/case-studies/?type=multiplatform).

**주요 특징:**

* 개발자는 네이티브 코드를 유지하면서 Android, iOS, 웹, 데스크톱 및 서버 측에서 코드를 재사용할 수 있습니다.
* Kotlin Multiplatform은 모든 프로젝트에 원활하게 통합될 수 있습니다. 개발자는 플랫폼 전용 API를 활용하면서 네이티브와 크로스 플랫폼 개발의 장점을 모두 누릴 수 있습니다.
* [Compose Multiplatform](https://www.jetbrains.com/lp/compose-multiplatform/) 덕분에 개발자는 완전한 코드 공유 유연성을 확보하고 로직과 UI를 모두 공유할 수 있습니다.
* Android용으로 이미 Kotlin을 사용하고 있다면 코드베이스에 새로운 언어를 도입할 필요가 없습니다. 기존의 Kotlin 코드와 전문 지식을 재사용할 수 있으므로, 다른 기술에 비해 Kotlin Multiplatform으로의 전환 리스크가 적습니다.

이 크로스 플랫폼 모바일 개발 프레임워크는 목록에서 가장 젊은 축에 속하지만, 성숙한 커뮤니티를 보유하고 있습니다. 2023년 11월, JetBrains는 이를 Stable(안정화) 상태로 격상했습니다. Google I/O 2024에서 Google은 [Android와 iOS 간의 비즈니스 로직 공유를 위해 Kotlin Multiplatform을 공식 지원한다](https://android-developers.googleblog.com/2024/05/android-support-for-kotlin-multiplatform-to-share-business-logic-across-mobile-web-server-desktop.html)고 발표했습니다. 정기적으로 업데이트되는 [문서](get-started.topic)와 커뮤니티 지원 덕분에 궁금한 점에 대한 답을 언제든 찾을 수 있습니다. 또한, 이미 많은 [글로벌 기업과 스타트업이 Kotlin Multiplatform을 사용](https://kotlinlang.org/case-studies/?type=multiplatform)하여 네이티브와 같은 사용자 경험을 제공하는 멀티플랫폼 앱을 개발하고 있습니다.

[![Kotlin Multiplatform 여정 시작하기](kmp-journey-start.svg){width="700"}](https://www.jetbrains.com/help/kotlin-multiplatform-dev/get-started.html)

### Flutter

2017년 Google에서 출시한 Flutter는 단일 코드베이스에서 모바일, 웹 및 데스크톱 앱을 구축하기 위한 인기 있는 프레임워크입니다.
Flutter로 애플리케이션을 빌드하려면 Google의 Dart라는 프로그래밍 언어를 사용해야 합니다.

**프로그래밍 언어:** Dart.

**모바일 앱 사례:** eBay Motors, Alibaba, Google Pay, ByteDance 앱들.

**주요 특징:**

* Flutter의 핫 리로드(hot reload) 기능을 사용하면 코드를 수정하는 즉시 재컴파일 없이 애플리케이션의 변경 사항을 확인할 수 있습니다.
* Flutter는 개발자가 디지털 경험을 구축하는 데 도움을 주는 디자인 시스템인 Google의 Material Design을 지원합니다.
  앱을 빌드할 때 여러 시각적 및 행동적 위젯(widget)을 사용할 수 있습니다.
* Flutter는 웹 브라우저 기술에 의존하지 않습니다. 대신 위젯을 그리기 위한 자체 렌더링 엔진을 가지고 있습니다.

Flutter는 전 세계적으로 비교적 활발한 사용자 커뮤니티를 보유하고 있으며 많은 개발자가 널리 사용하고 있습니다.
[Stack Overflow Trends](https://insights.stackoverflow.com/trends?tags=flutter%2Creact-native)에 따르면, 해당 태그의 사용량 증가를 바탕으로 Flutter의 사용량은 시간이 지남에 따라 상승 추세를 보이고 있습니다.

> [Kotlin Multiplatform과 Flutter](kotlin-multiplatform-flutter.md)를 자세히 살펴보고 각각의 강점을 이해하여 귀하의 크로스 플랫폼 개발에 가장 적합한 것을 선택해 보세요.
> 
{style="note"}

### React Native

오픈 소스 UI 소프트웨어 프레임워크인 React Native는 2015년(Flutter보다 약간 앞서) 당시 Facebook이었던 Meta Platforms에 의해 개발되었습니다. Facebook의 JavaScript 라이브러리인 React를 기반으로 하며 개발자가 네이티브로 렌더링되는 크로스 플랫폼 모바일 앱을 빌드할 수 있게 해줍니다.

**프로그래밍 언어:** JavaScript.

**모바일 앱 사례:** React Native는 Microsoft의 Office, Skype, Xbox Game Pass, Meta의 Facebook, 데스크톱 Messenger 및 Oculus에서 사용됩니다. [React Native 쇼케이스](https://reactnative.dev/showcase)에서 더 많은 사례를 확인해 보세요.

**주요 특징:**

* Fast Refresh 기능을 통해 React 컴포넌트의 변경 사항을 즉시 확인할 수 있습니다.
* React Native의 장점 중 하나는 UI에 집중한다는 점입니다. React 프리미티브(primitives)는 네이티브 플랫폼 UI 컴포넌트로 렌더링되어 맞춤화되고 반응이 빠른 사용자 인터페이스를 구축할 수 있게 해줍니다.
* 0.62 버전 이상에서는 React Native와 모바일 앱 디버거인 Flipper 간의 통합이 기본적으로 활성화되어 있습니다. Flipper는 Android, iOS 및 React Native 앱을 디버깅하는 데 사용되며 로그 뷰어, 대화형 레이아웃 인스펙터, 네트워크 인스펙터와 같은 도구를 제공합니다.

가장 인기 있는 크로스 플랫폼 앱 개발 프레임워크 중 하나인 React Native는 기술 지식을 공유하는 크고 강력한 개발자 커뮤니티를 보유하고 있습니다. 이 커뮤니티 덕분에 프레임워크로 모바일 앱을 빌드할 때 필요한 지원을 받을 수 있습니다.

### Ionic

Ionic은 2013년에 출시된 오픈 소스 모바일 UI 툴킷입니다. HTML, CSS, JavaScript와 같은 웹 기술을 사용하여 단일 코드베이스에서 크로스 플랫폼 모바일 애플리케이션을 빌드할 수 있도록 도우며, Angular, React, Vue 프레임워크와의 통합을 제공합니다.

**프로그래밍 언어:** JavaScript.

**모바일 앱 사례:** T-Mobile, BBC (Children's & Education 앱), EA Games.

**주요 특징:**

* Ionic은 모바일 OS를 위해 특별히 설계된 SaaS UI 프레임워크를 기반으로 하며 애플리케이션 구축을 위한 다양한 UI 컴포넌트를 제공합니다.
* Ionic 프레임워크는 Cordova 및 Capacitor 플러그인을 사용하여 카메라, 플래시, GPS, 오디오 녹음기 등 기기의 내장 기능에 대한 액세스를 제공합니다.
* Ionic은 자체 명령줄 인터페이스인 Ionic CLI를 보유하고 있으며, 이는 Ionic 애플리케이션을 빌드하기 위한 필수 도구 역할을 합니다.

Ionic 프레임워크 포럼에서는 커뮤니티 구성원들이 지식을 교환하고 개발 과정의 문제를 해결하도록 서로 돕는 활동이 지속적으로 이루어지고 있습니다.

### .NET MAUI

.NET Multi-platform App UI (.NET MAUI)는 2022년 5월에 출시된 Microsoft 소유의 크로스 플랫폼 프레임워크입니다. 개발자가 C#과 XAML로 네이티브 모바일 및 데스크톱 앱을 만들 수 있게 해줍니다. .NET MAUI는 Xamarin의 기능 중 하나인 Xamarin.Forms의 진화된 형태로, Xamarin에서 지원하는 플랫폼에 대해 네이티브 컨트롤을 제공합니다.

**프로그래밍 언어:** C#, XAML.

**모바일 앱 사례:** NBC Sports Next, Escola Agil, Irth Solutions.

**주요 특징:**

* .NET MAUI는 GPS, 가속도계, 배터리 및 네트워크 상태와 같은 네이티브 기기 기능에 액세스하기 위한 크로스 플랫폼 API를 제공합니다.
* 멀티 타겟팅(multi-targeting)을 사용하여 Android, iOS, macOS 및 Windows를 대상으로 하는 단일 프로젝트 시스템을 지원합니다.
* .NET 핫 리로드 지원을 통해 개발자는 앱이 실행되는 동안 관리형 소스 코드를 수정할 수 있습니다.

.NET MAUI는 여전히 비교적 새로운 프레임워크임에도 불구하고 이미 개발자들 사이에서 견인력을 얻었으며 Stack Overflow 및 Microsoft Q&A에서 활발한 커뮤니티를 보유하고 있습니다.

### NativeScript

이 오픈 소스 모바일 애플리케이션 개발 프레임워크는 2014년에 처음 출시되었습니다. NativeScript를 사용하면 JavaScript 또는 TypeScript와 같이 JavaScript로 컴파일되는 언어, 그리고 Angular 및 Vue.js와 같은 프레임워크를 사용하여 Android 및 iOS 모바일 앱을 빌드할 수 있습니다.

**프로그래밍 언어:** JavaScript, TypeScript.

**모바일 앱 사례:** Daily Nanny, Strudel, Breethe.

**주요 특징:**

* NativeScript를 사용하면 개발자가 네이티브 Android 및 iOS API에 쉽게 액세스할 수 있습니다.
* 프레임워크는 플랫폼 네이티브 UI를 렌더링합니다. NativeScript로 빌드된 앱은 웹 뷰(WebViews, Android 앱 내에서 웹 콘텐츠를 보여줄 수 있게 하는 시스템 구성 요소)에 의존하지 않고 네이티브 기기에서 직접 실행됩니다.
* NativeScript는 다양한 플러그인과 사전 빌드된 앱 템플릿을 제공하여 서드파티 솔루션의 필요성을 줄여줍니다.

NativeScript는 JavaScript 및 Angular와 같이 잘 알려진 웹 기술을 기반으로 하므로 많은 개발자가 이 프레임워크를 선택합니다. 그럼에도 불구하고 주로 소규모 기업과 스타트업에서 사용되는 경향이 있습니다.

## 프로젝트에 적합한 크로스 플랫폼 앱 개발 프레임워크를 어떻게 선택해야 할까요?

위에 언급된 것 외에도 다른 크로스 플랫폼 프레임워크가 있으며 새로운 도구들이 시장에 계속 등장할 것입니다. 방대한 옵션 중에서 다음 프로젝트에 적합한 도구를 어떻게 찾을 수 있을까요? 첫 번째 단계는 프로젝트의 요구 사항과 목표를 이해하고, 미래의 앱이 어떤 모습이길 원하는지 명확한 아이디어를 얻는 것입니다. 그런 다음 비즈니스에 가장 적합한 것을 결정할 수 있도록 다음과 같은 중요한 요소들을 고려해야 합니다.

#### 1. 팀의 전문성

서로 다른 크로스 플랫폼 모바일 개발 프레임워크는 서로 다른 프로그래밍 언어를 기반으로 합니다. 프레임워크를 채택하기 전에 어떤 기술이 필요한지 확인하고, 모바일 엔지니어 팀이 이를 다룰 수 있는 충분한 지식과 경험을 갖추고 있는지 확인하세요.

예를 들어, 팀이 숙련된 JavaScript 개발자들로 구성되어 있고 새로운 기술을 도입할 리소스가 충분하지 않다면 React Native와 같이 이 언어를 사용하는 프레임워크를 선택하는 것이 가치가 있을 수 있습니다.

#### 2. 벤더의 신뢰성 및 지원

프레임워크 유지 관리자가 장기적으로 이를 계속 지원할 것인지 확인하는 것이 중요합니다. 고려 중인 프레임워크를 개발하고 지원하는 회사에 대해 자세히 알아보고, 해당 프레임워크를 사용하여 빌드된 모바일 앱들을 살펴보세요.

#### 3. UI 커스터마이징

미래의 앱에서 사용자 인터페이스가 얼마나 중요한지에 따라 특정 프레임워크를 사용하여 UI를 얼마나 쉽게 커스터마이징할 수 있는지 알아야 할 수도 있습니다. 예를 들어, Kotlin Multiplatform은 JetBrains의 현대적인 선언형 크로스 플랫폼 UI 프레임워크인 [Compose Multiplatform](https://www.jetbrains.com/lp/compose-multiplatform/)을 통해 완전한 코드 공유 유연성을 제공합니다. 이를 통해 개발자는 Android, iOS, 웹 및 데스크톱(JVM 경유) 간에 UI를 공유할 수 있으며, Kotlin 및 Jetpack Compose를 기반으로 합니다.

[![Compose Multiplatform 살펴보기](explore-compose.svg){width="700"}](https://www.jetbrains.com/compose-multiplatform/)

#### 4. 프레임워크의 성숙도

잠재적인 프레임워크의 공개 API 및 툴링(tooling)이 얼마나 자주 변경되는지 확인하세요. 예를 들어, 네이티브 운영 체제 구성 요소의 일부 변경 사항은 내부 크로스 플랫폼 동작을 깨뜨릴 수 있습니다. 모바일 앱 개발 프레임워크로 작업할 때 직면할 수 있는 잠재적인 어려움을 미리 파악하는 것이 좋습니다. GitHub을 탐색하여 프레임워크에 얼마나 많은 버그가 있는지, 그리고 이러한 버그들이 어떻게 처리되고 있는지 확인할 수도 있습니다.

#### 5. 프레임워크 기능

각 프레임워크에는 고유한 기능과 제한 사항이 있습니다. 프레임워크가 어떤 기능과 도구를 제공하는지 아는 것은 최선의 솔루션을 식별하는 데 매우 중요합니다. 코드 분석기와 단위 테스트 프레임워크가 있나요? 앱을 얼마나 빠르고 쉽게 빌드, 디버그 및 테스트할 수 있나요?

#### 6. 보안

보안과 개인 정보 보호는 결제 시스템을 포함하는 뱅킹 및 이커머스 앱과 같은 비즈니스용 중요 모바일 앱을 구축할 때 특히 중요합니다. [OWASP Mobile Top 10](https://owasp.org/www-project-mobile-top-10/)에 따르면 모바일 애플리케이션의 가장 심각한 보안 위험 중 일부는 안전하지 않은 데이터 저장 및 인증/인가입니다.

선택한 멀티플랫폼 모바일 개발 프레임워크가 필요한 수준의 보안을 제공하는지 확인해야 합니다. 이를 수행하는 한 가지 방법은 프레임워크의 이슈 트래커가 공개되어 있다면 그곳에서 보안 관련 티켓들을 살펴보는 것입니다.

#### 7. 교육 자료

프레임워크에 대해 사용 가능한 학습 리소스의 양과 질은 해당 프레임워크로 작업할 때의 경험이 얼마나 매끄러울지 이해하는 데 도움이 될 수 있습니다. 포괄적인 공식 [문서](get-started.topic), 온/오프라인 컨퍼런스, 교육 코스 등은 필요할 때 제품에 대한 필수 정보를 충분히 찾을 수 있다는 좋은 신호입니다.

## 핵심 요약

이러한 요소들을 고려하지 않고는 특정 요구 사항을 가장 잘 충족할 크로스 플랫폼 모바일 개발 프레임워크를 선택하기 어렵습니다. 미래의 애플리케이션 요구 사항을 자세히 살펴보고 다양한 프레임워크의 역량과 비교해 보십시오. 그렇게 함으로써 고품질 앱을 제공하는 데 도움이 될 적합한 크로스 플랫폼 솔루션을 찾을 수 있을 것입니다.