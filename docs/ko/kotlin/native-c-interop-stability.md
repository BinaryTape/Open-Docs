[//]: # (title: C 및 Objective-C 라이브러리 임포트의 안정성)
<primary-label ref="beta"/>

Kotlin/Native는 [C](native-c-interop.md) 및 [Objective-C](native-objc-interop.md) 라이브러리를 임포트하는 기능을 제공합니다.
이러한 라이브러리 지원은 현재 [베타](components-stability.md#kotlin-native) 상태입니다.

베타 상태의 주요 이유 중 하나는 C 및 Objective-C 라이브러리 사용이 Kotlin, 종속성, Xcode의 다른 버전과의 코드 호환성에 영향을 미칠 수 있기 때문입니다. 이 가이드에서는 실제 자주 발생하는 호환성 문제, 일부 경우에만 발생하는 문제, 그리고 가상의 잠재적 문제점들을 나열합니다.

이 가이드에서 C 및 Objective-C 라이브러리 또는 간단히 _네이티브 라이브러리_는 다음으로 나뉩니다:

* [플랫폼 라이브러리](#platform-libraries): Kotlin이 각 플랫폼의 "시스템" 네이티브 라이브러리에 접근하기 위해 기본적으로 제공하는 라이브러리.
* [타사 라이브러리](#third-party-libraries): Kotlin 사용을 위해 추가 구성이 필요한 다른 모든 네이티브 라이브러리.

이 두 종류의 네이티브 라이브러리는 호환성 특성이 다릅니다.

## 플랫폼 라이브러리

[_플랫폼 라이브러리_](native-platform-libs.md)는 Kotlin/Native 컴파일러와 함께 제공됩니다.
따라서 프로젝트에서 다른 버전의 Kotlin을 사용하면 다른 버전의 플랫폼 라이브러리가 제공됩니다.
Apple 타겟(예: iOS)의 경우, 플랫폼 라이브러리는 특정 컴파일러 버전이 지원하는 Xcode 버전을 기반으로 생성됩니다.

Xcode SDK와 함께 제공되는 네이티브 라이브러리 API는 Xcode 버전마다 변경됩니다.
이러한 변경 사항이 네이티브 언어 내에서 소스 및 바이너리 호환성을 유지하더라도, 상호 운용성 구현으로 인해 Kotlin에서는 호환성이 깨질 수 있습니다.

결과적으로, 프로젝트에서 Kotlin 버전을 업데이트하면 플랫폼 라이브러리에 호환성이 깨지는 변경(breaking change)이 발생할 수 있습니다.
이는 두 가지 경우에 중요할 수 있습니다:

* 프로젝트의 소스 코드 컴파일에 영향을 미치는 플랫폼 라이브러리의 소스 호환성 파괴 변경(source breaking change)이 있는 경우. 일반적으로 수정하기 쉽습니다.
* 일부 종속성에 영향을 미치는 플랫폼 라이브러리의 바이너리 호환성 파괴 변경(binary breaking change)이 있는 경우. 일반적으로 쉽게 해결할 방법이 없으며, 예를 들어 Kotlin 버전을 업데이트하여 라이브러리 개발자가 이 문제를 해결할 때까지 기다려야 합니다.

  > 이러한 바이너리 비호환성은 링크 경고(linkage warning) 및 런타임 예외로 나타납니다. 컴파일 시점에 이를 감지하려면 [`-Xpartial-linkage-loglevel=ERROR`](whatsnew19.md#library-linkage-in-kotlin-native) 컴파일러 옵션을 사용하여 경고를 오류로 승격시키세요.
  >
  {style="note"}

JetBrains 팀이 플랫폼 라이브러리를 생성하는 데 사용되는 Xcode 버전을 업데이트할 때, 플랫폼 라이브러리에서 호환성을 깨는 변경을 피하기 위해 합리적인 노력을 기울입니다. 호환성이 깨지는 변경이 발생할 수 있는 경우, 팀은 영향 분석을 수행하고 특정 변경을 무시하거나 (영향을 받는 API가 일반적으로 사용되지 않기 때문에) 임시 수정(ad hoc fix)을 적용하기로 결정합니다.

플랫폼 라이브러리에서 호환성을 깨는 변경이 발생하는 또 다른 잠재적 이유는 네이티브 API를 Kotlin으로 변환하는 알고리즘의 변경입니다. JetBrains 팀은 이러한 경우에도 호환성을 깨는 변경을 피하기 위해 합리적인 노력을 기울입니다.

### 플랫폼 라이브러리에서 새 Objective-C 클래스 사용하기

Kotlin 컴파일러는 배포 대상(deployment target)에서 사용할 수 없는 Objective-C 클래스를 사용하는 것을 막지 않습니다.

예를 들어, 배포 대상이 iOS 17.0이고 iOS 18.0에서만 나타난 클래스를 사용하는 경우, 컴파일러는 경고하지 않으며 iOS 17.0 장치에서 애플리케이션 실행 중 충돌이 발생할 수 있습니다.
더욱이, 이러한 충돌은 실행이 해당 사용에 도달하지 않는 경우에도 발생하므로, 버전 검사로 보호하는 것만으로는 충분하지 않습니다.

자세한 내용은 [강력 링크(Strong linking)](native-objc-interop.md#strong-linking)를 참조하세요.

## 타사 라이브러리

시스템 플랫폼 라이브러리 외에도 Kotlin/Native는 타사 네이티브 라이브러리 임포트를 허용합니다.
예를 들어, [CocoaPods 통합](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-cocoapods-overview.html)을 사용하거나 [cinterops 구성](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-dsl-reference.html#cinterops)을 설정할 수 있습니다.

### Xcode 버전 불일치 라이브러리 임포트

타사 네이티브 라이브러리를 임포트하면 다른 Xcode 버전과의 호환성 문제가 발생할 수 있습니다.

네이티브 라이브러리를 처리할 때 컴파일러는 일반적으로 로컬에 설치된 Xcode의 헤더 파일을 사용합니다. 거의 모든 네이티브 라이브러리 헤더가 Xcode에서 제공되는 "표준" 헤더(예: `stdint.h`)를 임포트하기 때문입니다.

이것이 Xcode 버전이 Kotlin으로 네이티브 라이브러리를 임포트하는 데 영향을 미치는 이유입니다.
이는 타사 네이티브 라이브러리를 사용할 때 [비 Mac 호스트에서 Apple 타겟 크로스 컴파일](whatsnew21.md#ability-to-publish-kotlin-libraries-from-any-host)이 여전히 불가능한 이유 중 하나이기도 합니다.

모든 Kotlin 버전은 단일 Xcode 버전과 가장 호환됩니다. 이 버전은 권장되는 버전이며, 해당 Kotlin 버전에 대해 가장 많이 테스트되었습니다. 특정 Xcode 버전과의 호환성은 [호환성 표](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-compatibility-guide.html#version-compatibility)에서 확인하세요.

더 새롭거나 오래된 Xcode 버전을 사용하는 것이 종종 가능하지만, 일반적으로 타사 네이티브 라이브러리 임포트에 영향을 미치는 문제로 이어질 수 있습니다.

#### 권장 버전보다 최신 Xcode 버전

권장 버전보다 최신 Xcode 버전을 사용하면 일부 Kotlin 기능이 손상될 수 있습니다. 타사 네이티브 라이브러리 임포트가 이에 가장 큰 영향을 받습니다. 지원되지 않는 Xcode 버전에서는 전혀 작동하지 않는 경우가 많습니다.

#### 권장 버전보다 오래된 Xcode 버전

일반적으로 Kotlin은 이전 Xcode 버전과 잘 작동합니다. 간헐적인 문제가 발생할 수 있으며, 대부분 다음을 초래합니다:

* [KT-71694](https://youtrack.jetbrains.com/issue/KT-71694)에서와 같이 존재하지 않는 타입을 참조하는 Kotlin API.
* 시스템 라이브러리의 타입이 네이티브 라이브러리의 Kotlin API에 포함되는 경우.
  이 경우 프로젝트는 성공적으로 컴파일되지만, 시스템 네이티브 타입이 네이티브 라이브러리 패키지에 추가됩니다.
  예를 들어, IDE 자동 완성에서 이 타입이 예기치 않게 나타날 수 있습니다.

Kotlin 라이브러리가 이전 Xcode 버전으로 성공적으로 컴파일된다면, [Kotlin 라이브러리 API에서 타사 라이브러리의 타입을 사용](#using-native-types-in-library-api)하지 않는 한 게시해도 안전합니다.

### 전이적 타사 네이티브 종속성 사용

프로젝트 내의 Kotlin 라이브러리가 구현의 일부로 타사 네이티브 라이브러리를 임포트하면, 프로젝트도 해당 네이티브 라이브러리에 접근할 수 있게 됩니다.
이는 Kotlin/Native가 `api`와 `implementation` 종속성 타입을 구분하지 않아 네이티브 라이브러리가 항상 `api` 종속성이 되기 때문에 발생합니다.

이러한 전이적 네이티브 종속성을 사용하는 것은 더 많은 호환성 문제에 취약합니다.
예를 들어, Kotlin 라이브러리 개발자가 변경한 내용으로 인해 네이티브 라이브러리의 Kotlin 표현이 호환되지 않게 되어, Kotlin 라이브러리를 업데이트할 때 호환성 문제가 발생할 수 있습니다.

따라서 전이적 종속성에 의존하는 대신, 동일한 네이티브 라이브러리와 직접 상호 운용성을 구성하세요. 그렇게 하려면 호환성 문제를 방지하기 위해 [사용자 정의 패키지 이름 사용](#use-custom-package-name)과 유사하게 네이티브 라이브러리에 다른 패키지 이름을 사용하세요.

### 라이브러리 API에서 네이티브 타입 사용

Kotlin 라이브러리를 게시하는 경우, 라이브러리 API의 네이티브 타입 사용에 주의하세요. 이러한 사용은 호환성 및 기타 문제를 해결하기 위해 향후 호환성이 깨질 것으로 예상되며, 이는 라이브러리 사용자에게 영향을 미칠 것입니다.

라이브러리의 목적상 필요하기 때문에 라이브러리 API에서 네이티브 타입을 사용하는 것이 필요한 경우도 있습니다. 예를 들어, Kotlin 라이브러리가 기본적으로 네이티브 라이브러리에 대한 확장을 제공하는 경우입니다.
해당하지 않는 경우, 라이브러리 API에서 네이티브 타입 사용을 피하거나 제한하세요.

이 권장 사항은 라이브러리 API에서 네이티브 타입을 사용하는 경우에만 적용되며 애플리케이션 코드와는 관련이 없습니다. 또한 라이브러리 구현에는 적용되지 않습니다. 예를 들면 다음과 같습니다:

```kotlin
// 각별히 주의하세요! 네이티브 타입이 라이브러리 API에 사용됩니다:
public fun createUIView(): UIView
public fun handleThirdPartyNativeType(c: ThirdPartyNativeType)

// 평소처럼 주의하세요. 네이티브 타입이 라이브러리 API에 사용되지 않습니다:
internal fun createUIViewController(): UIViewController
public fun getDate(): String = NSDate().toString()
```

### 타사 라이브러리를 사용하는 라이브러리 게시

타사 네이티브 라이브러리를 사용하는 Kotlin 라이브러리를 게시하는 경우, 호환성 문제를 피하기 위해 몇 가지 조치를 취할 수 있습니다.

#### 사용자 정의 패키지 이름 사용

타사 네이티브 라이브러리에 사용자 정의 패키지 이름을 사용하면 호환성 문제를 방지하는 데 도움이 될 수 있습니다.

네이티브 라이브러리가 Kotlin으로 임포트될 때, Kotlin 패키지 이름을 얻습니다. 이름이 고유하지 않으면 라이브러리 사용자에게 충돌이 발생할 수 있습니다. 예를 들어, 네이티브 라이브러리가 사용자의 프로젝트나 다른 종속성에서 동일한 패키지 이름으로 임포트되는 경우, 해당 두 사용이 충돌할 것입니다.

이러한 경우, 컴파일은 `Linking globals named '...': symbol multiply defined!` 오류와 함께 실패할 수 있습니다.
그러나 다른 오류가 발생하거나 심지어 성공적인 컴파일이 이루어질 수도 있습니다.

타사 네이티브 라이브러리에 사용자 정의 이름을 사용하려면:

* CocoaPods 통합을 통해 네이티브 라이브러리를 임포트할 때, Gradle 빌드 스크립트의 `pod {}` 블록에서 [`packageName`](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-cocoapods-dsl-reference.html#pod-function) 속성을 사용하세요.
* `cinterops` 구성을 통해 네이티브 라이브러리를 임포트할 때, 구성 블록에서 [`packageName`](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-dsl-reference.html#cinterops) 속성을 사용하세요.

#### 이전 Kotlin 버전과의 호환성 확인

Kotlin 라이브러리를 게시할 때, 타사 네이티브 라이브러리 사용은 다른 Kotlin 버전과의 라이브러리 호환성에 영향을 미칠 수 있습니다. 구체적으로 다음과 같습니다:

* Kotlin Multiplatform 라이브러리는 전방 호환성(이전 컴파일러가 최신 컴파일러로 컴파일된 라이브러리를 사용할 수 있는 경우)을 보장하지 않습니다.

  실제로 일부 경우에는 작동하지만, 네이티브 라이브러리 사용은 전방 호환성을 더욱 제한할 수 있습니다.

* Kotlin Multiplatform 라이브러리는 역방향 호환성(최신 컴파일러가 이전 버전으로 생성된 라이브러리를 사용할 수 있는 경우)을 제공합니다.

  Kotlin 라이브러리에서 네이티브 라이브러리를 사용하는 것은 일반적으로 역방향 호환성에 영향을 미치지 않아야 합니다.
  그러나 이는 호환성에 영향을 미치는 더 많은 컴파일러 버그의 가능성을 열어줍니다.

#### 정적 라이브러리 임베딩 피하기

네이티브 라이브러리를 임포트할 때, `-staticLibrary` 컴파일러 옵션 또는 `.def` 파일의 `staticLibraries` 속성을 사용하여 관련 [정적 라이브러리](native-definition-file.md#include-a-static-library)(`.a` 파일)를 포함할 수 있습니다.
이 경우, 라이브러리 사용자는 네이티브 종속성 및 링커 옵션을 다룰 필요가 없습니다.

하지만 포함된 정적 라이브러리의 사용을 어떤 식으로든 구성하는 것은 불가능합니다. 즉, 제외하거나 교체(대체)할 수 없습니다. 따라서 사용자는 동일한 정적 라이브러리를 포함하는 다른 Kotlin 라이브러리와의 잠재적 충돌을 해결하거나 해당 버전을 조정할 수 없을 것입니다.

## 네이티브 라이브러리 지원의 발전

현재 Kotlin 프로젝트에서 C 및 Objective-C를 사용하는 것은 호환성 문제로 이어질 수 있으며, 그중 일부는 이 가이드에 나열되어 있습니다.
이러한 문제를 해결하려면 향후 일부 호환성을 깨는 변경이 필요할 수 있으며, 이는 그 자체로 호환성 문제에 기여합니다.