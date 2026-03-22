[//]: # (title: 플랫폼 간 코드 공유)

Kotlin Multiplatform을 사용하면 Kotlin이 제공하는 메커니즘을 통해 코드를 공유할 수 있습니다.

* [프로젝트에서 사용하는 모든 플랫폼 간 코드 공유](#share-code-on-all-platforms). 모든 플랫폼에 적용되는 공통 비즈니스 로직을 공유할 때 사용합니다.
* 프로젝트에 포함된 플랫폼 중 [일부 플랫폼 간 코드 공유](#share-code-on-similar-platforms). 계층 구조(hierarchical structure)의 도움을 받아 유사한 플랫폼에서 코드를 재사용할 수 있습니다.

공유 코드에서 플랫폼별 API에 액세스해야 하는 경우, Kotlin의 [expected 및 actual 선언](multiplatform-expect-actual.md) 메커니즘을 사용하세요.

## 모든 플랫폼에서 코드 공유

모든 플랫폼에서 공통으로 사용되는 비즈니스 로직이 있다면, 각 플랫폼마다 동일한 코드를 작성할 필요가 없습니다. 공통 소스 세트(common source set)에서 공유하면 됩니다.

![모든 플랫폼에서 공유되는 코드](flat-structure.svg)

소스 세트에 대한 일부 종속성은 기본적으로 설정됩니다. 다음과 같은 경우 `dependsOn` 관계를 수동으로 명시할 필요가 없습니다:
* `jvmMain`, `macosArm64Main` 등 공통 소스 세트에 의존하는 모든 플랫폼별 소스 세트.
* `androidMain` 및 `androidUnitTest`와 같이 특정 타겟의 `main` 및 `test` 소스 세트 사이.

공유 코드에서 플랫폼별 API에 액세스해야 하는 경우, Kotlin의 [expected 및 actual 선언](multiplatform-expect-actual.md) 메커니즘을 사용하세요.

## 유사한 플랫폼 간 코드 공유

종종 공통 로직과 서드파티 API를 많이 재사용할 수 있는 여러 네이티브 타겟을 생성해야 할 때가 있습니다.

예를 들어, iOS를 타겟으로 하는 일반적인 멀티플랫폼 프로젝트에는 두 가지 iOS 관련 타겟이 있습니다. 하나는 iOS ARM64 기기용이고, 다른 하나는 x64 시뮬레이터용입니다. 이들은 각각 별도의 플랫폼별 소스 세트를 가지지만, 실제로는 기기와 시뮬레이터에 대해 서로 다른 코드가 필요한 경우가 거의 없으며 종속성도 거의 동일합니다. 따라서 iOS 전용 코드를 이들 간에 공유할 수 있습니다.

분명히 이러한 설정에서는 두 iOS 타겟을 위한 공유 소스 세트를 두고, iOS 기기와 시뮬레이터 모두에 공통적인 API를 직접 호출할 수 있는 Kotlin/Native 코드를 작성하는 것이 바람직할 것입니다.

이 경우, 다음 방법 중 하나를 사용하여 프로젝트의 [계층 구조(hierarchical structure)](multiplatform-hierarchy.md)를 통해 네이티브 타겟 간에 코드를 공유할 수 있습니다.

* [기본 계층 구조 템플릿 사용](multiplatform-hierarchy.md#default-hierarchy-template)
* [수동으로 계층 구조 구성](multiplatform-hierarchy.md#manual-configuration)

[라이브러리에서 코드 공유](#share-code-in-libraries) 및 [플랫폼별 라이브러리 연결](#connect-platform-specific-libraries)에 대해 자세히 알아보세요.

## 라이브러리에서 코드 공유

계층적 프로젝트 구조 덕분에 라이브러리는 타겟의 하위 집합에 대해서도 공통 API를 제공할 수 있습니다. [라이브러리가 배포(publish)](multiplatform-publish-lib-setup.md)될 때, 중간 소스 세트(intermediate source set)의 API는 프로젝트 구조에 대한 정보와 함께 라이브러리 아티팩트에 포함됩니다. 이 라이브러리를 사용할 때, 프로젝트의 중간 소스 세트는 각 소스 세트의 타겟이 사용할 수 있는 라이브러리의 API에만 액세스합니다.

예를 들어, `kotlinx.coroutines` 저장소의 다음 소스 세트 계층 구조를 확인해 보세요.

![라이브러리 계층 구조](lib-hierarchical-structure.svg)

`concurrent` 소스 세트는 `runBlocking` 함수를 선언하며 JVM 및 네이티브 타겟용으로 컴파일됩니다. `kotlinx.coroutines` 라이브러리가 계층적 프로젝트 구조로 업데이트되어 배포되면, 라이브러리의 `concurrent` 소스 세트의 "타겟 시그니처(targets signature)"와 일치하므로 JVM과 네이티브 타겟 간에 공유되는 소스 세트에서 이 라이브러리에 의존하고 `runBlocking`을 호출할 수 있습니다.

## 플랫폼별 라이브러리 연결

플랫폼별 종속성에 제한받지 않고 더 많은 네이티브 코드를 공유하려면 Foundation, UIKit, POSIX와 같은 [플랫폼 라이브러리](https://kotlinlang.org/docs/native-platform-libs.html)를 사용하세요. 이러한 라이브러리는 Kotlin/Native와 함께 제공되며 기본적으로 공유 소스 세트에서 사용할 수 있습니다.

또한 프로젝트에서 [Kotlin CocoaPods Gradle](multiplatform-cocoapods-overview.md) 플러그인을 사용하는 경우, [`cinterop` 메커니즘](https://kotlinlang.org/docs/native-c-interop.html)을 통해 사용되는 서드파티 네이티브 라이브러리를 활용할 수 있습니다.

## 다음 단계

* [Kotlin의 expected 및 actual 선언 메커니즘에 대해 읽어보기](multiplatform-expect-actual.md)
* [계층적 프로젝트 구조에 대해 자세히 알아보기](multiplatform-hierarchy.md)
* [멀티플랫폼 라이브러리 배포 설정하기](multiplatform-publish-lib-setup.md)
* [멀티플랫폼 프로젝트의 소스 파일 명명 규칙에 대한 권장 사항 보기](https://kotlinlang.org/docs/coding-conventions.html#source-file-names)