[//]: # (title: Compose Multiplatform과 Jetpack Compose의 관계)

<web-summary>이 문서는 Compose Multiplatform과 Jetpack Compose의 관계를 설명합니다. 두 툴킷과 이들이 어떻게 연계되는지에 대해 자세히 알아봅니다.</web-summary>

![JetBrains가 만든 Compose Multiplatform, Google이 만든 Jetpack Compose](compose-multiplatform-and-jetpack-compose.png){width=730}

<tldr>
이 문서는 Compose Multiplatform과 Jetpack Compose의 관계를 설명합니다.
두 툴킷이 어떻게 연계되는지, 여러 대상 플랫폼에서 라이브러리가 어떻게 처리되는지, 
그리고 멀티플랫폼 프로젝트를 위해 자신만의 UI 라이브러리를 만들거나 조정하는 방법을 알아봅니다.
</tldr>

Compose Multiplatform은 JetBrains에서 개발한 크로스 플랫폼 UI 툴킷입니다. 
이것은 추가적인 대상 플랫폼을 지원함으로써 Google의 Android용 [Jetpack Compose](https://developer.android.com/jetpack/compose) 툴킷을 확장합니다.

Compose Multiplatform은 [공통 Kotlin 코드](multiplatform-discover-project.md#common-code)에서 Compose API를 사용할 수 있게 하여, Android, iOS, 데스크톱 및 웹에서 실행할 수 있는 공유 Compose UI 코드를 작성할 수 있도록 해줍니다.

|                  | **Compose Multiplatform**  | **Jetpack Compose** |
|------------------|----------------------------|---------------------|
| **플랫폼**    | Android, iOS, 데스크톱, 웹 | Android             |
| **지원 주체** | JetBrains                  | Google              |

## Jetpack Compose와 컴포저블

Jetpack Compose는 네이티브 Android 인터페이스를 구축하기 위한 선언형 UI 툴킷입니다. 
그 기초는 `@Composable` 어노테이션이 지정된 _컴포저블(composable)_ 함수입니다. 
이 함수들은 UI의 일부를 정의하며, 기본 데이터가 변경될 때 자동으로 업데이트됩니다. 
컴포저블을 결합하여 레이아웃을 구성하고, 사용자 입력을 처리하며, 상태를 관리하고, 애니메이션을 적용할 수 있습니다. 
Jetpack Compose에는 `Text`, `Button`, `Row`, `Column`과 같은 일반적인 UI 컴포넌트가 포함되어 있으며, 수정자(modifier)를 사용하여 이를 커스텀할 수 있습니다.

Compose Multiplatform도 동일한 원칙을 기반으로 구축되었습니다. 
Jetpack Compose와 Compose 컴파일러 및 런타임을 공유하며, `@Composable` 함수, `remember`와 같은 상태 관리 도구, 레이아웃 컴포넌트, 수정자, 애니메이션 지원 등 동일한 API를 사용합니다. 
즉, Jetpack Compose에 대한 지식을 Compose Multiplatform에 그대로 활용하여 Android, iOS, 데스크톱 및 웹을 위한 크로스 플랫폼 UI를 구축할 수 있습니다.

## Compose Multiplatform 및 Jetpack Compose 기능

> [Google의 공식 문서](https://developer.android.com/jetpack/compose/documentation)를 포함하여 거의 모든 Jetpack Compose 자료를 통해 두 UI 프레임워크의 기초를 배울 수 있습니다.
> 
{style="tip"}

당연하게도, Compose Multiplatform에는 플랫폼별 기능과 고려 사항이 있습니다:

* [Android 전용 컴포넌트](compose-android-only-components.md) 페이지에는 Android 플랫폼과 밀접하게 연관되어 있어 공통 Compose Multiplatform 코드에서 사용할 수 없는 API들이 나열되어 있습니다.
* 데스크톱용 창 관리 API나 iOS용 UIKit 호환성 API와 같은 일부 플랫폼 전용 API는 해당 플랫폼에서만 사용할 수 있습니다.

다음은 주요 컴포넌트 및 API의 가용성 개요입니다:

|                                                                                                                     | **Compose Multiplatform**                                                                                 | **Jetpack Compose**                                                                                    |
|---------------------------------------------------------------------------------------------------------------------|-----------------------------------------------------------------------------------------------------------|--------------------------------------------------------------------------------------------------------|
| [Compose Animation](https://developer.android.com/jetpack/androidx/releases/compose-animation)                      | 예                                                                                                       | 예                                                                                                    |
| [Compose Compiler](https://developer.android.com/jetpack/androidx/releases/compose-compiler)                        | 예                                                                                                       | 예                                                                                                    |
| [Compose Foundation](https://developer.android.com/jetpack/androidx/releases/compose-foundation)                    | 예                                                                                                       | 예                                                                                                    |
| [Compose Material](https://developer.android.com/jetpack/androidx/releases/compose-material)                        | 예                                                                                                       | 예                                                                                                    |
| [Compose Material 3](https://developer.android.com/jetpack/androidx/releases/compose-material30)                    | 예                                                                                                       | 예                                                                                                    |
| [Compose Runtime](https://developer.android.com/jetpack/androidx/releases/compose-runtime)                          | 예 (`androidx.compose.runtime.rxjava2` 및 `androidx.compose.runtime.rxjava3` 제외)                 | 예                                                                                                    |
| [Compose UI](https://developer.android.com/jetpack/androidx/releases/compose-ui)                                    | 예                                                                                                       | 예                                                                                                    |
| [Jetpack Lifecycle](https://developer.android.com/jetpack/androidx/releases/lifecycle)                              | [예](compose-lifecycle.md)                                                                               | 예                                                                                                    |
| [Jetpack ViewModel](https://developer.android.com/topic/libraries/architecture/viewmodel)                           | [예](compose-viewmodel.md)                                                                               | 예                                                                                                    |
| [Jetpack Navigation Compose](https://developer.android.com/jetpack/androidx/releases/navigation)                    | [예](compose-navigation-routing.md)                                                                      | 예                                                                                                    |
| 리소스(Resources)                                                                                                           | `Res` 클래스를 사용하는 [Compose Multiplatform 리소스 라이브러리](compose-multiplatform-resources.md)       | `R` 클래스를 사용하는 [Android 리소스 시스템](https://developer.android.com/jetpack/compose/resources) |
| [Maps Compose](https://developers.google.com/maps/documentation/android-sdk/maps-compose)                           | 아니요                                                                                                        | 예                                                                                                    |
| UI 컴포넌트, 내비게이션, 아키텍처 등을 위한 [서드파티 라이브러리](#libraries-for-compose-multiplatform) | [Compose Multiplatform 라이브러리](https://github.com/terrakok/kmp-awesome?tab=readme-ov-file#-compose-ui) | Jetpack Compose 및 Compose Multiplatform 라이브러리                                                    |

## 기술적 세부 사항

Compose Multiplatform은 Google에서 게시한 코드와 릴리스를 기반으로 구축됩니다. 
Google의 주된 관심사는 Android용 Jetpack Compose이지만, Compose Multiplatform을 가능하게 하기 위해 Google과 JetBrains 간의 긴밀한 협력이 이루어지고 있습니다.

Jetpack에는 Google이 Android용으로 게시하는 Foundation 및 Material과 같은 퍼스트 파티 라이브러리가 포함되어 있습니다. 
[이러한 라이브러리](https://github.com/JetBrains/compose-multiplatform-core)에서 제공하는 API를 공통 코드에서 사용할 수 있도록 하기 위해, JetBrains는 Android 이외의 대상 플랫폼용으로 게시되는 이 라이브러리들의 멀티플랫폼 버전을 유지 관리합니다.

> 릴리스 주기에 대한 자세한 내용은 [호환성 및 버전](compose-compatibility-and-versioning.md#jetpack-compose-and-compose-multiplatform-release-cycles) 페이지에서 확인할 수 있습니다.
> 
{style="tip"}

Android용 Compose Multiplatform 애플리케이션을 빌드할 때는 Google에서 게시한 Jetpack Compose 아티팩트(artifact)를 사용합니다. 
예를 들어, 종속성에 `compose.material3`를 추가하면 프로젝트는 Android 대상 플랫폼에서는 `androidx.compose.material3:material3`를 사용하고, 다른 대상 플랫폼에서는 `org.jetbrains.compose.material3:material3`를 사용하게 됩니다. 
이는 멀티플랫폼 아티팩트의 Gradle 모듈 메타데이터(Gradle Module Metadata)를 기반으로 자동으로 수행됩니다.

## Compose Multiplatform용 라이브러리

Compose Multiplatform을 사용하면 Compose API를 사용하는 라이브러리를 [Kotlin Multiplatform 라이브러리](multiplatform-publish-lib-setup.md)로 배포할 수 있습니다. 
이렇게 하면 여러 플랫폼을 대상으로 하는 공통 Kotlin 코드에서 해당 라이브러리를 사용할 수 있게 됩니다.

따라서 Compose API를 사용하여 새로운 라이브러리를 빌드한다면, 이를 Compose Multiplatform을 사용하는 멀티플랫폼 라이브러리로 구축하는 것을 고려해 보세요. 
이미 Android용 Jetpack Compose 라이브러리를 빌드했다면, 해당 라이브러리를 멀티플랫폼으로 만드는 것을 고려해 보세요. 
생태계에는 이미 [많은 Compose Multiplatform 라이브러리](https://github.com/terrakok/kmp-awesome#-compose-ui)가 존재합니다.

라이브러리가 Compose Multiplatform으로 배포되면, Jetpack Compose만 사용하는 앱에서도 문제없이 이를 사용할 수 있습니다. 해당 앱들은 단순히 라이브러리의 Android 아티팩트를 사용하게 됩니다.

## 다음 단계

다음 컴포넌트들에 대한 Compose Multiplatform 구현에 대해 더 자세히 읽어보세요:
  * [수명 주기(Lifecycle)](compose-lifecycle.md)
  * [리소스(Resources)](compose-multiplatform-resources.md)
  * [공통 ViewModel](compose-viewmodel.md)
  * [내비게이션 및 라우팅](compose-navigation-routing.md)