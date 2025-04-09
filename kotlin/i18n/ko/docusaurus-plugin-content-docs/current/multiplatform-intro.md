---
title: "Kotlin Multiplatform 소개"
---
멀티 플랫폼 프로그래밍 지원은 Kotlin의 주요 이점 중 하나입니다. 네이티브 프로그래밍의 유연성과 이점을 유지하면서 [다양한 플랫폼](multiplatform-dsl-reference#targets)에 대해 동일한 코드를 작성하고 유지 관리하는 데 소요되는 시간을 줄여줍니다.

<img src="/img/kotlin-multiplatform.svg" alt="Kotlin Multiplatform" width="700" style={{verticalAlign: 'middle'}}/>

## 주요 개념 알아보기

Kotlin Multiplatform을 사용하면 모바일, 웹 또는 데스크톱 등 다양한 플랫폼에서 코드를 공유할 수 있습니다. 코드가 컴파일되는 플랫폼은 _targets_ 목록으로 정의됩니다.

각 target에는 자체 종속성 및 컴파일러 옵션이 있는 소스 파일 집합을 나타내는 해당 *source set*이 있습니다. 예를 들어 JVM용 `jvmMain`과 같은 플랫폼별 source set은 플랫폼별 라이브러리 및 API를 사용할 수 있습니다.

target 하위 집합 간에 코드를 공유하기 위해 중간 source set이 사용됩니다. 예를 들어 `appleMain` source set은 모든 Apple 플랫폼 간에 공유되는 코드를 나타냅니다. 모든 플랫폼 간에 공유되고 선언된 모든 target으로 컴파일되는 코드에는 자체 source set인 `commonMain`이 있습니다. 플랫폼별 API를 사용할 수는 없지만 멀티 플랫폼 라이브러리를 활용할 수 있습니다.

특정 target에 대해 컴파일할 때 Kotlin은 공통 source set, 관련 중간 source set 및 target별 source set을 결합합니다.

이 주제에 대한 자세한 내용은 다음을 참조하세요.

* [Kotlin Multiplatform 프로젝트 구조의 기본 사항](multiplatform-discover-project)
* [멀티 플랫폼 프로젝트 구조의 고급 개념](multiplatform-advanced-project-structure)

## 코드 공유 메커니즘 사용

유사한 target 하위 집합 간에 코드를 공유하는 것이 더 편리한 경우가 있습니다. Kotlin Multiplatform은 *default hierarchy template*을 사용하여 생성을 단순화하는 방법을 제공합니다. 여기에는 프로젝트에서 지정한 target을 기반으로 생성되는 미리 정의된 중간 source set 목록이 포함되어 있습니다.

공유 코드에서 플랫폼별 API에 액세스하려면 Kotlin의 또 다른 메커니즘인 *expected and actual declarations*를 사용할 수 있습니다. 이렇게 하면 공통 코드에서 플랫폼별 API를 `expect`한다고 선언하되 각 target 플랫폼에 대해 별도의 `actual` 구현을 제공할 수 있습니다. 함수, 클래스 및 인터페이스를 포함하여 다양한 Kotlin 개념과 함께 이 메커니즘을 사용할 수 있습니다. 예를 들어 공통 코드에서 함수를 정의할 수 있지만 해당 source set에서 플랫폼별 라이브러리를 사용하여 해당 구현을 제공할 수 있습니다.

이 주제에 대한 자세한 내용은 다음을 참조하세요.

* [플랫폼에서 코드 공유](multiplatform-share-on-platforms)
* [Expected and actual declarations](multiplatform-expect-actual)
* [계층적 프로젝트 구조](multiplatform-hierarchy)

## 종속성 추가

Kotlin Multiplatform 프로젝트는 외부 라이브러리 및 기타 멀티 플랫폼 프로젝트에 의존할 수 있습니다. 공통 코드의 경우 공통 source set에 멀티 플랫폼 라이브러리에 대한 종속성을 추가할 수 있습니다. Kotlin은 자동으로 적절한 플랫폼별 부분을 확인하고 다른 source set에 추가합니다. 플랫폼별 API만 필요한 경우 해당 source set에 종속성을 추가합니다.

Kotlin Multiplatform 프로젝트에 Android별 종속성을 추가하는 것은 순수 Android 프로젝트에 추가하는 것과 유사합니다. iOS별 종속성을 사용하는 경우 추가 구성 없이 Apple SDK 프레임워크를 원활하게 통합할 수 있습니다. 외부 라이브러리 및 프레임워크의 경우 Kotlin은 Objective-C 및 Swift와의 상호 운용성을 제공합니다.

이 주제에 대한 자세한 내용은 다음을 참조하세요.

* [멀티 플랫폼 라이브러리에 대한 종속성 추가](multiplatform-add-dependencies)
* [Android 라이브러리에 대한 종속성 추가](multiplatform-android-dependencies)
* [iOS 라이브러리에 대한 종속성 추가](multiplatform-ios-dependencies)

## iOS와 통합 설정

멀티 플랫폼 프로젝트가 iOS를 대상으로 하는 경우 Kotlin Multiplatform 공유 모듈과 iOS 앱의 통합을 설정할 수 있습니다.

이를 위해 iOS 프레임워크를 생성한 다음 iOS 프로젝트에 로컬 또는 원격 종속성으로 추가합니다.

* **로컬 통합**: 특수 스크립트를 사용하여 멀티 플랫폼 및 Xcode 프로젝트를 직접 연결하거나 로컬 Pod 종속성과 관련된 설정에 CocoaPods 종속성 관리자를 사용합니다.
* **원격 통합**: XCFrameworks를 사용하여 SPM 종속성을 설정하거나 CocoaPods를 통해 공유 모듈을 배포합니다.

이 주제에 대한 자세한 내용은 [iOS 통합 방법](multiplatform-ios-integration-overview)을 참조하세요.

## 컴파일 구성

모든 target은 일반적으로 프로덕션 또는 테스팅과 같은 다양한 목적을 위해 여러 컴파일을 가질 수 있지만 사용자 정의 컴파일을 정의할 수도 있습니다.

Kotlin Multiplatform을 사용하면 프로젝트의 모든 컴파일을 구성하고, target 내에서 특정 컴파일을 설정하고, 개별 컴파일을 만들 수도 있습니다. 컴파일을 구성할 때 컴파일러 옵션을 수정하고, 종속성을 관리하거나, 네이티브 언어와의 상호 운용성을 구성할 수 있습니다.

이 주제에 대한 자세한 내용은 [컴파일 구성](multiplatform-configure-compilations)을 참조하세요.

## 최종 바이너리 빌드

기본적으로 target은 `.klib` 아티팩트로 컴파일되며, 이는 Kotlin/Native 자체에서 종속성으로 사용할 수 있지만 실행하거나 네이티브 라이브러리로 사용할 수는 없습니다. 그러나 Kotlin Multiplatform은 최종 네이티브 바이너리를 빌드하기 위한 추가 메커니즘을 제공합니다.

실행 가능한 바이너리, 공유 및 정적 라이브러리 또는 Objective-C 프레임워크를 만들 수 있으며, 각기 다른 빌드 유형에 대해 구성할 수 있습니다. Kotlin은 또한 iOS 통합을 위해 유니버설(팻) 프레임워크 및 XCFramework를 빌드하는 방법을 제공합니다.

이 주제에 대한 자세한 내용은 [네이티브 바이너리 빌드](multiplatform-build-native-binaries)를 참조하세요.

## 멀티 플랫폼 라이브러리 만들기

공통 코드와 JVM, 웹 및 네이티브 플랫폼에 대한 플랫폼별 구현으로 멀티 플랫폼 라이브러리를 만들 수 있습니다.

Kotlin Multiplatform 라이브러리를 게시하려면 Gradle 빌드 스크립트에서 특정 구성을 수행해야 합니다. Maven 리포지토리와 `maven-publish` 플러그인을 사용하여 게시할 수 있습니다. 게시되면 멀티 플랫폼 라이브러리를 다른 플랫폼 간 프로젝트에서 종속성으로 사용할 수 있습니다.

이 주제에 대한 자세한 내용은 [멀티 플랫폼 라이브러리 게시](multiplatform-publish-lib)를 참조하세요.

## 참고 자료

* [Kotlin Multiplatform Gradle 플러그인용 DSL 참조](multiplatform-dsl-reference)
* [Kotlin Multiplatform용 호환성 가이드](multiplatform-compatibility-guide)