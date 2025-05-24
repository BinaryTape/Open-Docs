---
title: "플랫폼에서 코드 공유"
---
Kotlin Multiplatform을 사용하면 Kotlin이 제공하는 메커니즘을 통해 코드를 공유할 수 있습니다.

* [프로젝트에 사용된 모든 플랫폼 간에 코드 공유](#share-code-on-all-platforms). 모든 플랫폼에 적용되는 공통 비즈니스 로직을 공유하는 데 사용합니다.
* [프로젝트에 포함되었지만 일부 플랫폼 간에만 코드 공유](#share-code-on-similar-platforms). 계층 구조를 통해 유사한 플랫폼에서 코드를 재사용할 수 있습니다.

공유 코드에서 플랫폼별 API에 접근해야 하는 경우, Kotlin의 [expected 및 actual 선언](multiplatform-expect-actual) 메커니즘을 사용하세요.

## 모든 플랫폼에서 코드 공유

모든 플랫폼에 공통적인 비즈니스 로직이 있는 경우 각 플랫폼에 대해 동일한 코드를 작성할 필요 없이 공통 소스 세트에서 공유하면 됩니다.

<img src="/img/flat-structure.svg" alt="Code shared for all platforms" style={{verticalAlign: 'middle'}}/>

소스 세트에 대한 일부 종속성은 기본적으로 설정됩니다. `dependsOn` 관계를 수동으로 지정할 필요가 없습니다.
* `jvmMain`, `macosX64Main` 등과 같이 공통 소스 세트에 종속된 모든 플랫폼별 소스 세트의 경우.
* `androidMain` 및 `androidUnitTest`와 같이 특정 타겟의 `main` 및 `test` 소스 세트 간의 경우.

공유 코드에서 플랫폼별 API에 접근해야 하는 경우, Kotlin의 [expected 및 actual 선언](multiplatform-expect-actual) 메커니즘을 사용하세요.

## 유사한 플랫폼에서 코드 공유

일반적으로 많은 공통 로직과 타사 API를 잠재적으로 재사용할 수 있는 여러 네이티브 타겟을 만들어야 합니다.

예를 들어, iOS를 타겟팅하는 일반적인 멀티플랫폼 프로젝트에는 두 개의 iOS 관련 타겟이 있습니다. 하나는 iOS ARM64 장치용이고 다른 하나는 x64 시뮬레이터용입니다. 이들은 별도의 플랫폼별 소스 세트를 가지고 있지만 실제로는 장치와 시뮬레이터에 대해 서로 다른 코드가 필요한 경우는 드물며 종속성도 거의 동일합니다. 따라서 iOS 관련 코드는 이들 간에 공유될 수 있습니다.

분명히 이 설정에서는 두 개의 iOS 타겟에 대한 공유 소스 세트를 갖는 것이 바람직합니다. Kotlin/Native 코드는 iOS 장치와 시뮬레이터 모두에 공통적인 API를 직접 호출할 수 있습니다.

이 경우 [계층 구조](multiplatform-hierarchy)를 사용하여 프로젝트의 네이티브 타겟 간에 코드를 공유할 수 있습니다.
다음 방법 중 하나를 사용합니다.

* [기본 계층 구조 템플릿 사용](multiplatform-hierarchy#default-hierarchy-template)
* [계층 구조 수동 구성](multiplatform-hierarchy#manual-configuration)

[라이브러리에서 코드 공유](#share-code-in-libraries) 및 [플랫폼별 라이브러리 연결](#connect-platform-specific-libraries)에 대해 자세히 알아보세요.

## 라이브러리에서 코드 공유

계층적 프로젝트 구조 덕분에 라이브러리는 타겟 하위 집합에 대한 공통 API도 제공할 수 있습니다. [라이브러리가 게시될 때](multiplatform-publish-lib), 해당 중간 소스 세트의 API는 프로젝트 구조에 대한 정보와 함께 라이브러리 아티팩트에 내장됩니다. 이 라이브러리를 사용하면 프로젝트의 중간 소스 세트는 각 소스 세트의 타겟에서 사용할 수 있는 라이브러리의 API에만 접근합니다.

예를 들어 `kotlinx.coroutines` 리포지토리의 다음 소스 세트 계층 구조를 확인하세요.

<img src="/img/lib-hierarchical-structure.svg" alt="Library hierarchical structure" style={{verticalAlign: 'middle'}}/>

`concurrent` 소스 세트는 함수 runBlocking을 선언하고 JVM 및 네이티브 타겟에 대해 컴파일됩니다. `kotlinx.coroutines` 라이브러리가 업데이트되고 계층적 프로젝트 구조로 게시되면 JVM과 네이티브 타겟 간에 공유되는 소스 세트에서 `runBlocking`을 호출할 수 있습니다. 라이브러리의 `concurrent` 소스 세트의 "타겟 시그니처"와 일치하기 때문입니다.

## 플랫폼별 라이브러리 연결

플랫폼별 종속성에 의해 제한받지 않고 더 많은 네이티브 코드를 공유하려면 [플랫폼 라이브러리](native-platform-libs)(예: Foundation, UIKit 및 POSIX)를 사용하세요. 이러한 라이브러리는 Kotlin/Native와 함께 제공되며 기본적으로 공유 소스 세트에서 사용할 수 있습니다.

또한 프로젝트에서 [Kotlin CocoaPods Gradle](native-cocoapods) 플러그인을 사용하는 경우, [`cinterop` 메커니즘](native-c-interop)으로 사용되는 타사 네이티브 라이브러리를 사용할 수 있습니다.

## 다음 단계는 무엇입니까?

* [Kotlin의 expected 및 actual 선언 메커니즘에 대해 읽어보세요](multiplatform-expect-actual)
* [계층적 프로젝트 구조에 대해 자세히 알아보세요](multiplatform-hierarchy)
* [멀티플랫폼 라이브러리 게시를 설정하세요](multiplatform-publish-lib)
* [멀티플랫폼 프로젝트에서 소스 파일 이름 지정에 대한 권장 사항을 확인하세요](coding-conventions#source-file-names)