[//]: # (title: Kotlin Multiplatform 소개)

멀티플랫폼 프로그래밍 지원은 Kotlin의 핵심 장점 중 하나입니다. 이는 [다양한 플랫폼](multiplatform-dsl-reference.md#targets)을 위해 동일한 코드를 작성하고 유지 관리하는 데 드는 시간을 줄여주는 동시에, 네이티브 프로그래밍의 유연성과 이점을 그대로 유지합니다.

![Kotlin Multiplatform](kotlin-multiplatform.svg){width=700}

## 핵심 개념 학습

Kotlin Multiplatform은 모바일, 웹, 데스크톱 등 다양한 플랫폼 간에 코드를 공유할 수 있게 해줍니다. 코드가 컴파일되는 플랫폼은 *타겟(targets)* 목록에 의해 정의됩니다.

각 타겟에는 고유한 의존성과 컴파일러 옵션을 가진 소스 파일 집합인 *소스 세트(source set)*가 대응됩니다. 예를 들어 JVM을 위한 `jvmMain`과 같은 플랫폼별 소스 세트는 플랫폼 전용 라이브러리와 API를 사용할 수 있습니다.

타겟의 하위 집합 간에 코드를 공유하려면 중간(intermediate) 소스 세트를 사용합니다. 예를 들어, `appleMain` 소스 세트는 모든 Apple 플랫폼 간에 공유되는 코드를 나타냅니다. 모든 플랫폼에서 공유되고 선언된 모든 타겟으로 컴파일되는 코드는 자체 소스 세트인 `commonMain`을 가집니다. 이는 플랫폼 전용 API를 사용할 수는 없지만, 멀티플랫폼 라이브러리를 활용할 수 있습니다.

특정 타겟을 위해 컴파일할 때, Kotlin은 공통 소스 세트, 관련 중간 소스 세트, 그리고 타겟 전용 소스 세트를 결합합니다.

이 주제에 대한 자세한 내용은 다음을 참조하세요.

* [Kotlin Multiplatform 프로젝트 구조의 기본](multiplatform-discover-project.md)
* [멀티플랫폼 프로젝트 구조의 심화 개념](multiplatform-advanced-project-structure.md)

## 코드 공유 메커니즘 사용

때로는 유사한 타겟의 하위 집합 간에 코드를 공유하는 것이 더 편리할 때가 있습니다. Kotlin Multiplatform은 *기본 계층 구조 템플릿(default hierarchy template)*을 통해 이들의 생성을 간소화하는 방법을 제공합니다. 여기에는 프로젝트에 지정한 타겟을 기반으로 생성되는 미리 정의된 중간 소스 세트 목록이 포함됩니다.

공유 코드에서 플랫폼 전용 API에 접근하기 위해, 또 다른 Kotlin 메커니즘인 *기대 및 실제 선언(expected and actual declarations)*을 사용할 수 있습니다. 이 방식을 통해 공통 코드에서 플랫폼 전용 API를 `expect`로 선언하고, 각 타겟 플랫폼에 대해 별도의 `actual` 구현을 제공할 수 있습니다. 이 메커니즘은 함수, 클래스, 인터페이스를 포함한 다양한 Kotlin 개념에 사용할 수 있습니다. 예를 들어, 공통 코드에서 함수를 정의하고 해당 소스 세트에서 플랫폼 전용 라이브러리를 사용하여 구현을 제공할 수 있습니다.

이 주제에 대한 자세한 내용은 다음을 참조하세요.

* [플랫폼 간 코드 공유](multiplatform-share-on-platforms.md)
* [기대 및 실제 선언(Expected and actual declarations)](multiplatform-expect-actual.md)
* [계층적 프로젝트 구조](multiplatform-hierarchy.md)

## 의존성 추가

Kotlin Multiplatform 프로젝트는 외부 라이브러리와 다른 멀티플랫폼 프로젝트에 의존할 수 있습니다. 공통 코드의 경우, 공통 소스 세트에 멀티플랫폼 라이브러리에 대한 의존성을 추가할 수 있습니다. Kotlin은 다른 소스 세트에 적절한 플랫폼별 파트를 자동으로 확인하고 추가합니다. 플랫폼 전용 API만 필요한 경우에는 해당 소스 세트에 의존성을 추가하세요.

Kotlin Multiplatform 프로젝트에 Android 전용 의존성을 추가하는 것은 순수 Android 프로젝트에 추가하는 것과 비슷합니다. iOS 전용 의존성으로 작업할 때, 별도의 설정 없이 Apple SDK 프레임워크를 원활하게 통합할 수 있습니다. 외부 라이브러리와 프레임워크의 경우, Kotlin은 Objective-C 및 Swift와의 상호운용성(interoperability)을 제공합니다.

이 주제에 대한 자세한 내용은 다음을 참조하세요.

* [멀티플랫폼 라이브러리에 의존성 추가](multiplatform-add-dependencies.md)
* [Android 라이브러리에 의존성 추가](multiplatform-android-dependencies.md)
* [iOS 라이브러리에 의존성 추가](multiplatform-ios-dependencies.md)

## iOS 통합 설정

멀티플랫폼 프로젝트가 iOS를 타겟으로 하는 경우, Kotlin Multiplatform 공유 모듈과 iOS 앱의 통합을 설정할 수 있습니다.

이를 위해 iOS 프레임워크를 생성한 다음, 이를 iOS 프로젝트에 로컬 또는 원격 의존성으로 추가합니다.

* **로컬 통합**: 특별한 스크립트를 사용하여 멀티플랫폼 프로젝트와 Xcode 프로젝트를 직접 연결하거나, 로컬 Pod 의존성이 포함된 설정을 위해 CocoaPods 의존성 관리자를 사용합니다.
* **원격 통합**: XCFrameworks를 사용하여 SPM 의존성을 설정하거나 CocoaPods를 통해 공유 모듈을 배포합니다.

이 주제에 대한 자세한 내용은 [iOS 통합 방법](multiplatform-ios-integration-overview.md)을 참조하세요.

## 컴파일 구성

모든 타겟은 일반적으로 프로덕션 또는 테스트를 위한 다양한 목적의 여러 컴파일을 가질 수 있으며, 사용자 정의 컴파일을 정의할 수도 있습니다.

Kotlin Multiplatform을 사용하면 프로젝트의 모든 컴파일을 구성하고, 타겟 내에서 특정 컴파일을 설정하고, 개별 컴파일을 생성할 수도 있습니다. 컴파일을 구성할 때 컴파일러 옵션을 수정하거나, 의존성을 관리하거나, 네이티브 언어와의 상호운용성을 구성할 수 있습니다.

이 주제에 대한 자세한 내용은 [컴파일 구성](multiplatform-configure-compilations.md)을 참조하세요.

## 최종 바이너리 빌드

기본적으로 타겟은 `.klib` 아티팩트로 컴파일되며, 이는 Kotlin/Native 자체에서 의존성으로 사용할 수 있지만 실행하거나 네이티브 라이브러리로 사용할 수는 없습니다. 하지만 Kotlin Multiplatform은 최종 네이티브 바이너리를 빌드하기 위한 추가 메커니즘을 제공합니다.

실행 가능한 바이너리, 공유 및 정적 라이브러리, 또는 Objective-C 프레임워크를 생성할 수 있으며, 각각 다양한 빌드 유형에 맞게 구성할 수 있습니다. 또한 Kotlin은 iOS 통합을 위해 유니버설(fat) 프레임워크 및 XCFramework를 빌드하는 방법도 제공합니다.

이 주제에 대한 자세한 내용은 [네이티브 바이너리 빌드](multiplatform-build-native-binaries.md)를 참조하세요.

## 멀티플랫폼 라이브러리 만들기

공통 코드와 JVM, 웹, 네이티브 플랫폼을 위한 플랫폼별 구현이 포함된 멀티플랫폼 라이브러리를 만들 수 있습니다.

Kotlin Multiplatform 라이브러리를 배포하려면 Gradle 빌드 스크립트에서 특정 구성이 필요합니다. 배포를 위해 Maven 저장소와 `maven-publish` 플러그인을 사용할 수 있습니다. 배포된 멀티플랫폼 라이브러리는 다른 크로스 플랫폼 프로젝트에서 의존성으로 사용될 수 있습니다.

이 주제에 대한 자세한 내용은 [멀티플랫폼 라이브러리 배포](multiplatform-publish-lib-setup.md)를 참조하세요.

## 참고 자료

* [Kotlin Multiplatform Gradle 플러그인용 DSL 레퍼런스](multiplatform-dsl-reference.md)
* [Kotlin Multiplatform 호환성 가이드](multiplatform-compatibility-guide.md)