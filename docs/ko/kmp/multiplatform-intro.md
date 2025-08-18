[//]: # (title: Kotlin Multiplatform 소개)

Kotlin의 주요 이점 중 하나는 멀티플랫폼 프로그래밍을 지원한다는 것입니다. 이는 [다양한 플랫폼](multiplatform-dsl-reference.md#targets)을 위해 동일한 코드를 작성하고 유지 관리하는 데 드는 시간을 줄여주면서, 네이티브 프로그래밍의 유연성과 이점을 유지합니다.

![Kotlin Multiplatform](kotlin-multiplatform.svg){width=700}

## 주요 개념 익히기

Kotlin Multiplatform을 사용하면 모바일, 웹, 데스크톱 등 다양한 플랫폼에서 코드를 공유할 수 있습니다. 코드가 컴파일되는 플랫폼은 _타겟_ 목록으로 정의됩니다.

각 타겟에는 자체 종속성과 컴파일러 옵션을 가진 소스 파일 집합을 나타내는 *소스 세트*가 있습니다. 예를 들어 JVM용 `jvmMain`과 같은 플랫폼별 소스 세트는 플랫폼별 라이브러리와 API를 사용할 수 있습니다.

특정 타겟의 하위 집합 간에 코드를 공유하기 위해 중간 소스 세트가 사용됩니다. 예를 들어, `appleMain` 소스 세트는 모든 Apple 플랫폼 간에 공유되는 코드를 나타냅니다. 모든 플랫폼 간에 공유되고 선언된 모든 타겟으로 컴파일되는 코드에는 자체 소스 세트인 `commonMain`이 있습니다. 이는 플랫폼별 API를 사용할 수 없지만 멀티플랫폼 라이브러리의 이점을 활용할 수 있습니다.

특정 타겟을 위해 컴파일할 때 Kotlin은 공통 소스 세트, 관련 중간 소스 세트, 그리고 타겟별 소스 세트를 결합합니다.

이 주제에 대한 자세한 내용은 다음을 참조하세요:

* [Kotlin Multiplatform 프로젝트 구조의 기본](multiplatform-discover-project.md)
* [멀티플랫폼 프로젝트 구조의 고급 개념](multiplatform-advanced-project-structure.md)

## 코드 공유 메커니즘 사용하기

유사한 타겟의 하위 집합 간에 코드를 공유하는 것이 더 편리할 때도 있습니다. Kotlin Multiplatform은 *기본 계층 템플릿*을 사용하여 이러한 생성을 간소화하는 방법을 제공합니다. 이 템플릿에는 프로젝트에서 지정한 타겟을 기반으로 생성되는 미리 정의된 중간 소스 세트 목록이 포함되어 있습니다.

공유 코드에서 플랫폼별 API에 액세스하려면 또 다른 Kotlin 메커니즘인 *expect 및 actual 선언*을 사용할 수 있습니다. 이를 통해 공통 코드에서 플랫폼별 API를 `expect`한다고 선언할 수 있지만 각 타겟 플랫폼에 대해 별도의 `actual` 구현을 제공할 수 있습니다. 이 메커니즘은 함수, 클래스, 인터페이스를 포함한 다양한 Kotlin 개념과 함께 사용할 수 있습니다. 예를 들어, 공통 코드에서 함수를 정의하고 해당 구현은 해당 소스 세트의 플랫폼별 라이브러리를 사용하여 제공할 수 있습니다.

이 주제에 대한 자세한 내용은 다음을 참조하세요:

* [플랫폼 간 코드 공유](multiplatform-share-on-platforms.md)
* [Expect 및 actual 선언](multiplatform-expect-actual.md)
* [계층적 프로젝트 구조](multiplatform-hierarchy.md)

## 종속성 추가하기

Kotlin Multiplatform 프로젝트는 외부 라이브러리 및 다른 멀티플랫폼 프로젝트에 종속될 수 있습니다. 공통 코드의 경우, 공통 소스 세트에 멀티플랫폼 라이브러리에 대한 종속성을 추가할 수 있습니다. Kotlin은 적절한 플랫폼별 부분을 자동으로 해결하여 다른 소스 세트에 추가합니다. 플랫폼별 API만 필요한 경우 해당 소스 세트에 종속성을 추가하세요.

Kotlin Multiplatform 프로젝트에 Android별 종속성을 추가하는 것은 순수 Android 프로젝트에 추가하는 것과 유사합니다. iOS별 종속성을 사용할 때는 추가 구성 없이 Apple SDK 프레임워크를 원활하게 통합할 수 있습니다. 외부 라이브러리 및 프레임워크의 경우 Kotlin은 Objective-C 및 Swift와의 상호 운용성을 제공합니다.

이 주제에 대한 자세한 내용은 다음을 참조하세요:

* [멀티플랫폼 라이브러리 종속성 추가하기](multiplatform-add-dependencies.md)
* [Android 라이브러리 종속성 추가하기](multiplatform-android-dependencies.md)
* [iOS 라이브러리 종속성 추가하기](multiplatform-ios-dependencies.md)

## iOS 통합 설정하기

멀티플랫폼 프로젝트가 iOS를 타겟팅하는 경우, Kotlin Multiplatform 공유 모듈을 iOS 앱과 통합하도록 설정할 수 있습니다.

이를 위해 iOS 프레임워크를 생성한 다음, 이를 로컬 또는 원격 종속성으로 iOS 프로젝트에 추가합니다.

*   **로컬 통합**: 특별한 스크립트를 사용하여 멀티플랫폼 및 Xcode 프로젝트를 직접 연결하거나, 로컬 Pod 종속성을 포함하는 설정의 경우 CocoaPods 종속성 관리자를 사용할 수 있습니다.
*   **원격 통합**: XCFramework를 사용하여 SPM 종속성을 설정하거나, CocoaPods를 통해 공유 모듈을 배포할 수 있습니다.

이 주제에 대한 자세한 내용은 [iOS 통합 방법](multiplatform-ios-integration-overview.md)을 참조하세요.

## 컴파일 구성하기

모든 타겟은 다양한 목적을 위한 여러 컴파일을 가질 수 있습니다. 일반적으로는 프로덕션 또는 테스트를 위한 것이지만, 사용자 정의 컴파일을 정의할 수도 있습니다.

Kotlin Multiplatform을 사용하면 프로젝트의 모든 컴파일을 구성하고, 타겟 내에서 특정 컴파일을 설정하며, 개별 컴파일을 생성할 수도 있습니다. 컴파일을 구성할 때 컴파일러 옵션을 수정하고, 종속성을 관리하거나, 네이티브 언어와의 상호 운용성을 구성할 수 있습니다.

이 주제에 대한 자세한 내용은 [컴파일 구성하기](multiplatform-configure-compilations.md)를 참조하세요.

## 최종 바이너리 빌드하기

기본적으로 타겟은 `.klib` 아티팩트로 컴파일되며, 이는 Kotlin/Native 자체에서 종속성으로 사용될 수는 있지만, 실행되거나 네이티브 라이브러리로 사용될 수는 없습니다. 하지만 Kotlin Multiplatform은 최종 네이티브 바이너리를 빌드하기 위한 추가 메커니즘을 제공합니다.

실행 가능한 바이너리, 공유 및 정적 라이브러리, 또는 Objective-C 프레임워크를 생성할 수 있으며, 각 빌드 유형에 따라 구성할 수 있습니다. Kotlin은 또한 iOS 통합을 위한 유니버설(fat) 프레임워크 및 XCFramework를 빌드하는 방법도 제공합니다.

이 주제에 대한 자세한 내용은 [네이티브 바이너리 빌드하기](multiplatform-build-native-binaries.md)를 참조하세요.

## 멀티플랫폼 라이브러리 생성하기

공통 코드와 JVM, 웹, 네이티브 플랫폼을 위한 플랫폼별 구현이 포함된 멀티플랫폼 라이브러리를 생성할 수 있습니다.

Kotlin Multiplatform 라이브러리를 게시하려면 Gradle 빌드 스크립트에 특정 구성을 포함해야 합니다. Maven 저장소와 `maven-publish` 플러그인을 사용하여 게시할 수 있습니다. 게시된 멀티플랫폼 라이브러리는 다른 크로스 플랫폼 프로젝트에서 종속성으로 사용될 수 있습니다.

이 주제에 대한 자세한 내용은 [멀티플랫폼 라이브러리 게시하기](multiplatform-publish-lib-setup.md)를 참조하세요.

## 참조

*   [Kotlin Multiplatform Gradle 플러그인을 위한 DSL 참조](multiplatform-dsl-reference.md)
*   [Kotlin Multiplatform 호환성 가이드](multiplatform-compatibility-guide.md)