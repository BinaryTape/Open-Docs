[//]: # (title: Kotlin Multiplatform 소개)

멀티플랫폼 프로그래밍 지원은 Kotlin의 핵심 장점 중 하나입니다. 이는 [다양한 플랫폼](multiplatform-dsl-reference.md#targets)을 위해 동일한 코드를 작성하고 유지 관리하는 데 드는 시간을 줄여주면서도, 네이티브 프로그래밍의 유연성과 이점을 유지하게 해줍니다.

![Kotlin Multiplatform](kotlin-multiplatform.svg){width=700}

## 핵심 개념 알아보기

Kotlin Multiplatform를 사용하면 모바일, 웹, 데스크톱 등 다양한 플랫폼에서 코드를 공유할 수 있습니다. 코드가 컴파일되는 플랫폼은 _타겟_ 목록에 의해 정의됩니다.

각 타겟에는 자체 의존성 및 컴파일러 옵션을 가진 소스 파일 집합을 나타내는 해당 *소스 세트*가 있습니다. 예를 들어 JVM용 `jvmMain`과 같은 플랫폼별 소스 세트는 플랫폼별 라이브러리 및 API를 사용할 수 있습니다.

특정 타겟 하위 집합 간에 코드를 공유하기 위해 중간 소스 세트가 사용됩니다. 예를 들어 `appleMain` 소스 세트는 모든 Apple 플랫폼에서 공유되는 코드를 나타냅니다. 모든 플랫폼에서 공유되고 선언된 모든 타겟으로 컴파일되는 코드는 자체 소스 세트인 `commonMain`을 가집니다. 이는 플랫폼별 API를 사용할 수 없지만, 멀티플랫폼 라이브러리를 활용할 수 있습니다.

특정 타겟용으로 컴파일할 때, Kotlin은 공통 소스 세트, 관련 중간 소스 세트, 그리고 타겟별 소스 세트를 결합합니다.

이 주제에 대한 자세한 내용은 다음을 참조하세요:

*   [Kotlin Multiplatform 프로젝트 구조의 기본](multiplatform-discover-project.md)
*   [멀티플랫폼 프로젝트 구조의 고급 개념](multiplatform-advanced-project-structure.md)

## 코드 공유 메커니즘 사용

유사한 타겟의 하위 집합 간에 코드를 공유하는 것이 더 편리할 때가 있습니다. Kotlin Multiplatform는 *기본 계층 템플릿*을 통해 이들의 생성을 간소화하는 방법을 제공합니다. 이는 프로젝트에서 지정한 타겟을 기반으로 생성되는 미리 정의된 중간 소스 세트 목록을 포함합니다.

공유 코드에서 플랫폼별 API에 접근하려면, Kotlin의 또 다른 메커니즘인 *expect 및 actual 선언*을 사용할 수 있습니다. 이 방법으로, 공통 코드에서 플랫폼별 API를 `expect`한다고 선언하고 각 타겟 플랫폼에 대해 별도의 `actual` 구현을 제공할 수 있습니다. 이 메커니즘을 함수, 클래스, 인터페이스를 포함한 다양한 Kotlin 개념과 함께 사용할 수 있습니다. 예를 들어, 공통 코드에서 함수를 정의하고 해당 소스 세트에서 플랫폼별 라이브러리를 사용하여 해당 구현을 제공할 수 있습니다.

이 주제에 대한 자세한 내용은 다음을 참조하세요:

*   [플랫폼에서 코드 공유](multiplatform-share-on-platforms.md)
*   [Expect 및 actual 선언](multiplatform-expect-actual.md)
*   [계층형 프로젝트 구조](multiplatform-hierarchy.md)

## 의존성 추가

Kotlin Multiplatform 프로젝트는 외부 라이브러리 및 다른 멀티플랫폼 프로젝트에 의존할 수 있습니다. 공통 코드의 경우, common 소스 세트에 멀티플랫폼 라이브러리에 대한 의존성을 추가할 수 있습니다. Kotlin은 자동으로 적절한 플랫폼별 부분을 해결하여 다른 소스 세트에 추가합니다. 특정 플랫폼 API만 필요한 경우, 해당 소스 세트에 의존성을 추가합니다.

Kotlin Multiplatform 프로젝트에 Android별 의존성을 추가하는 것은 순수 Android 프로젝트에 추가하는 것과 유사합니다. iOS별 의존성으로 작업할 때, 추가 설정 없이 Apple SDK 프레임워크를 원활하게 통합할 수 있습니다. 외부 라이브러리 및 프레임워크의 경우, Kotlin은 Objective-C 및 Swift와의 상호 운용성을 제공합니다.

이 주제에 대한 자세한 내용은 다음을 참조하세요:

*   [멀티플랫폼 라이브러리 의존성 추가](multiplatform-add-dependencies.md)
*   [Android 라이브러리 의존성 추가](multiplatform-android-dependencies.md)
*   [iOS 라이브러리 의존성 추가](multiplatform-ios-dependencies.md)

## iOS와의 통합 설정

멀티플랫폼 프로젝트가 iOS를 타겟으로 한다면, Kotlin Multiplatform 공유 모듈을 iOS 앱과 통합하도록 설정할 수 있습니다.

이를 위해 iOS 프레임워크를 생성한 다음, 이를 로컬 또는 원격 의존성으로 iOS 프로젝트에 추가합니다.

*   **로컬 통합**: 특수 스크립트를 사용하여 멀티플랫폼 프로젝트와 Xcode 프로젝트를 직접 연결하거나, 로컬 Pod 의존성을 포함하는 설정의 경우 CocoaPods 의존성 관리자를 사용합니다.
*   **원격 통합**: XCFrameworks를 사용하여 SPM 의존성을 설정하거나 CocoaPods를 통해 공유 모듈을 배포합니다.

이 주제에 대한 자세한 내용은 [iOS 통합 방법](multiplatform-ios-integration-overview.md)을 참조하세요.

## 컴파일 설정

모든 타겟은 다양한 목적(일반적으로 프로덕션 또는 테스트용)으로 여러 개의 컴파일을 가질 수 있으며, 사용자 지정 컴파일을 정의할 수도 있습니다.

Kotlin Multiplatform를 사용하면 프로젝트의 모든 컴파일을 설정하고, 타겟 내에서 특정 컴파일을 설정하고, 개별 컴파일을 생성할 수도 있습니다. 컴파일을 설정할 때, 컴파일러 옵션을 수정하고, 의존성을 관리하거나, 네이티브 언어와의 상호 운용성을 구성할 수 있습니다.

이 주제에 대한 자세한 내용은 [컴파일 설정](multiplatform-configure-compilations.md)을 참조하세요.

## 최종 바이너리 빌드

기본적으로 타겟은 `.klib` 아티팩트로 컴파일되며, 이는 Kotlin/Native 자체에서 의존성으로 사용될 수 있지만, 실행되거나 네이티브 라이브러리로 사용될 수는 없습니다. 그러나 Kotlin Multiplatform는 최종 네이티브 바이너리를 빌드하기 위한 추가 메커니즘을 제공합니다.

실행 가능한 바이너리, 공유 및 정적 라이브러리, 또는 Objective-C 프레임워크를 생성할 수 있으며, 각각 다른 빌드 유형에 맞게 구성할 수 있습니다. Kotlin은 또한 iOS 통합을 위한 유니버설(fat) 프레임워크 및 XCFrameworks를 빌드하는 방법을 제공합니다.

이 주제에 대한 자세한 내용은 [네이티브 바이너리 빌드](multiplatform-build-native-binaries.md)를 참조하세요.

## 멀티플랫폼 라이브러리 생성

JVM, 웹, 네이티브 플랫폼을 위한 공통 코드와 플랫폼별 구현을 포함하는 멀티플랫폼 라이브러리를 생성할 수 있습니다.

Kotlin Multiplatform 라이브러리를 게시하려면 Gradle 빌드 스크립트에 특정 설정이 필요합니다. 게시를 위해 Maven 리포지토리와 `maven-publish` 플러그인을 사용할 수 있습니다. 일단 게시되면, 멀티플랫폼 라이브러리는 다른 크로스 플랫폼 프로젝트에서 의존성으로 사용될 수 있습니다.

이 주제에 대한 자세한 내용은 [멀티플랫폼 라이브러리 게시](multiplatform-publish-lib-setup.md)를 참조하세요.

## 참조

*   [Kotlin Multiplatform Gradle 플러그인용 DSL 참조](multiplatform-dsl-reference.md)
*   [Kotlin Multiplatform 호환성 가이드](multiplatform-compatibility-guide.md)