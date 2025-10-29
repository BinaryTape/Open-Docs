[//]: # (title: Kotlin Multiplatform이란?)
[//]: # (description: Kotlin Multiplatform는 JetBrains의 오픈 소스 기술로, Android, iOS, 데스크톱, 웹, 서버에서 코드를 공유할 수 있습니다.)

Kotlin Multiplatform (KMP)는 JetBrains의 오픈 소스 기술로, Android, iOS, 데스크톱, 웹, 서버에서 코드를 공유하는 동시에 네이티브 개발의 장점을 유지할 수 있도록 합니다.

Compose Multiplatform를 사용하면 여러 플랫폼에서 UI 코드도 공유하여 코드 재사용을 극대화할 수 있습니다.

## 기업이 KMP를 선택하는 이유

### 비용 효율성 및 더 빠른 출시

Kotlin Multiplatform는 기술 및 조직 프로세스 모두를 간소화하는 데 도움이 됩니다.

* 플랫폼 전반에 걸쳐 로직 및 UI 코드를 공유하여 중복 및 유지보수 비용을 줄일 수 있습니다. 이를 통해 여러 플랫폼에 기능을 동시에 출시할 수 있습니다.
* 공유 코드에서 통합된 로직에 접근할 수 있으므로 팀 협업이 더 쉬워지고, 팀원 간의 지식 전달이 용이해지며, 전담 플랫폼 팀 간의 노력 중복을 줄일 수 있습니다.

더 빠른 시장 출시 외에도, **55%**의 사용자들이 KMP 도입 후 협업이 개선되었다고 보고했으며, **65%**의 팀들이 성능과 품질이 향상되었다고 보고했습니다(KMP 설문조사 2024년 2분기).

KMP는 스타트업부터 글로벌 기업에 이르기까지 모든 규모의 조직에서 프로덕션 환경에 사용되고 있습니다. Google, Duolingo, Forbes, Philips, McDonald's, Bolt, H&M, Baidu, Kuaishou, Bilibili와 같은 기업들은 유연성, 네이티브 성능, 네이티브 사용자 경험 제공 능력, 비용 효율성, 그리고 점진적 도입 지원을 이유로 KMP를 채택했습니다. [KMP를 도입한 기업에 대해 더 알아보기](case-studies.topic).

### 코드 공유의 유연성

원하는 방식으로 코드를 공유할 수 있습니다. 네트워킹이나 스토리지와 같은 격리된 모듈을 공유하고, 시간이 지남에 따라 공유 코드를 점진적으로 확장할 수 있습니다.
또한 UI를 네이티브로 유지하면서 모든 비즈니스 로직을 공유하거나, Compose Multiplatform를 사용하여 UI를 점진적으로 마이그레이션할 수도 있습니다.

![점진적인 KMP 도입 그림: 로직의 일부를 공유하고 UI는 공유하지 않음, UI 없이 모든 로직을 공유함, 로직과 UI를 공유함](kmp-graphic.png){width="700"}

### iOS에서의 네이티브 느낌

SwiftUI 또는 UIKit을 사용하여 UI를 전적으로 구축하거나, Compose Multiplatform를 통해 Android 및 iOS에서 일관된 경험을 만들거나, 필요에 따라 네이티브 및 공유 UI 코드를 혼합하여 사용할 수 있습니다.

어떤 접근 방식을 사용하든, 각 플랫폼에서 네이티브처럼 느껴지는 앱을 만들 수 있습니다.

<video src="https://www.youtube.com/watch?v=LB5a2FRrT94" width="700"/>

### 네이티브 성능

Kotlin Multiplatform는 [Kotlin/Native](https://kotlinlang.org/docs/native-overview.html)를 활용하여 네이티브 바이너리를 생성하고, 예를 들어 iOS와 같이 가상 머신이 바람직하지 않거나 불가능한 경우 플랫폼 API에 직접 접근합니다.

이를 통해 플랫폼에 구애받지 않는 코드를 작성하면서도 거의 네이티브에 가까운 성능을 달성할 수 있습니다.

![iPhone 13 및 iPhone 16에서 iOS의 Compose Multiplatform와 SwiftUI의 유사한 성능을 보여주는 그래프](cmp-ios-performance.png){width="700"}

### 원활한 툴링

IntelliJ IDEA 및 Android Studio는 [Kotlin Multiplatform IDE 플러그인](https://plugins.jetbrains.com/plugin/14936-kotlin-multiplatform)과 함께 KMP에 대한 스마트 IDE 지원을 제공합니다. 여기에는 공통 UI 미리보기, [Compose Multiplatform용 핫 리로드](compose-hot-reload.md), 교차 언어 탐색, 리팩토링, 그리고 Kotlin 및 Swift 코드 전반에 걸친 디버깅이 포함됩니다.

<video src="https://youtu.be/ACmerPEQAWA" width="700"/>

### AI 기반 개발

JetBrains의 AI 코딩 에이전트인 [Junie](https://jetbrains.com/junie)에게 KMP 작업을 맡겨 팀이 더 빠르게 움직일 수 있도록 하세요.

## Kotlin Multiplatform 사용 사례 살펴보기

기업과 개발자들이 공유 Kotlin 코드의 이점을 어떻게 누리고 있는지 살펴보세요.

* [사례 연구 페이지](case-studies.topic)에서 기업들이 코드베이스에 KMP를 성공적으로 도입한 방법을 알아보세요.
* [엄선된 샘플 목록](multiplatform-samples.md)과 GitHub의 [kotlin-multiplatform-sample](https://github.com/topics/kotlin-multiplatform-sample) 토픽에서 다양한 샘플 앱을 확인해보세요.
* [klibs.io](https://klibs.io/)에 이미 존재하는 수천 개의 멀티플랫폼 라이브러리 중에서 특정 멀티플랫폼 라이브러리를 검색하세요.

## 기본 학습

KMP가 실제로 어떻게 작동하는지 빠르게 확인하려면 [빠른 시작](quickstart.md)을 시도해보세요.
환경을 설정하고 다양한 플랫폼에서 샘플 애플리케이션을 실행하게 됩니다.

사용 사례 선택
: * 플랫폼 간에 UI 및 비즈니스 로직 코드를 모두 공유하는 앱을 만들려면 [로직 및 UI 공유 튜토리얼](compose-multiplatform-create-first-app.md)을 따르세요.
  * Android 앱이 멀티플랫폼 앱으로 전환될 수 있는 방법을 보려면 [마이그레이션 튜토리얼](multiplatform-integrate-in-existing-app.md)을 확인해보세요.
  * UI 구현을 공유하지 않고 일부 코드를 공유하는 방법을 보려면 [로직 공유 튜토리얼](multiplatform-create-first-app.md)을 따르세요.

기술 세부 정보 알아보기
: * [기본 프로젝트 구조](multiplatform-discover-project.md)부터 시작하세요.
  * 사용 가능한 [코드 공유 메커니즘](multiplatform-share-on-platforms.md)에 대해 알아보세요.
  * KMP 프로젝트에서 [의존성이 작동하는 방식](multiplatform-add-dependencies.md)을 확인하세요.
  * 다양한 [iOS 통합 방법](multiplatform-ios-integration-overview.md)을 고려해보세요.
  * KMP가 다양한 타겟을 위해 [코드를 컴파일](multiplatform-configure-compilations.md)하고 [바이너리를 빌드](multiplatform-build-native-binaries.md)하는 방법을 알아보세요.
  * [멀티플랫폼 앱 게시](multiplatform-publish-apps.md) 또는 [멀티플랫폼 라이브러리 게시](multiplatform-publish-lib-setup.md)에 대해 읽어보세요.

## 대규모 Kotlin Multiplatform 도입

팀에 크로스 플랫폼 프레임워크를 도입하는 것은 어려울 수 있습니다.
이점과 잠재적 문제에 대한 해결책을 알아보려면 크로스 플랫폼 개발에 대한 높은 수준의 개요를 살펴보세요.

* [크로스 플랫폼 모바일 개발이란?](cross-platform-mobile-development.md): 크로스 플랫폼 애플리케이션의 다양한 접근 방식과 구현에 대한 개요를 제공합니다.
* [팀에 멀티플랫폼 모바일 개발을 소개하는 방법](multiplatform-introduce-your-team.md): 팀에 크로스 플랫폼 개발을 도입하기 위한 전략을 제공합니다.
* [Kotlin Multiplatform를 도입하고 프로젝트를 강화해야 하는 10가지 이유](multiplatform-reasons-to-try.md): 크로스 플랫폼 솔루션으로 Kotlin Multiplatform를 도입해야 하는 이유를 나열합니다.