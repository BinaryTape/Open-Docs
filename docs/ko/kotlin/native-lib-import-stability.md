[//]: # (title: C, Objective-C, Swift 라이브러리 가져오기)

Kotlin/Native는 [C](native-c-interop.md) 및 [Objective-C](native-objc-interop.md) 라이브러리를 가져오는 기능을 제공합니다.
또한 순수 [Swift 라이브러리](#swift-library-import)를 Kotlin/Native 프로젝트로 가져오는 문제를 해결할 수 있습니다.

## C 및 Objective-C 라이브러리 가져오기의 안정성
<primary-label ref="beta"/>

C 및 Objective-C 라이브러리 가져오기 지원은 현재 [베타 상태](components-stability.md#kotlin-native)입니다.

베타 상태인 주된 이유 중 하나는 C 및 Objective-C 라이브러리를 사용하는 것이 Kotlin, 의존성(dependencies), Xcode의 다양한 버전과 코드의 호환성에 영향을 미칠 수 있다는 것입니다. 이 가이드에서는 실제 환경에서 자주 발생하는 호환성 문제, 일부 경우에만 발생하는 문제, 그리고 가상의 잠재적 문제들도 나열합니다.

단순화를 위해 여기서는 C 및 Objective-C 라이브러리, 즉 _네이티브 라이브러리(native libraries)_를 다음으로 나눕니다.

*   [플랫폼 라이브러리](#platform-libraries): 각 플랫폼에서 "시스템" 네이티브 라이브러리에 접근하기 위해 Kotlin이 기본적으로 제공하는 라이브러리입니다.
*   [서드파티(third-party) 라이브러리](#third-party-libraries): Kotlin에서 사용하기 위해 추가 구성이 필요한 모든 다른 네이티브 라이브러리입니다.

이 두 가지 종류의 네이티브 라이브러리는 서로 다른 호환성 특징을 가집니다.

### 플랫폼 라이브러리

[_플랫폼 라이브러리(Platform libraries)_](native-platform-libs.md)는 Kotlin/Native 컴파일러와 함께 제공됩니다.
따라서 프로젝트에서 다른 버전의 Kotlin을 사용하면 다른 버전의 플랫폼 라이브러리를 얻게 됩니다.
Apple 타겟(예: iOS)의 경우, 플랫폼 라이브러리는 특정 컴파일러 버전이 지원하는 Xcode 버전을 기반으로 생성됩니다.

Xcode SDK와 함께 제공되는 네이티브 라이브러리 API는 Xcode 버전마다 변경됩니다.
그러한 변경 사항이 네이티브 언어 내에서 소스 및 바이너리 호환성을 유지하더라도,
상호 운용성(interoperability) 구현으로 인해 Kotlin에서는 호환성이 깨질 수 있습니다.

결과적으로, 프로젝트에서 Kotlin 버전을 업데이트하면 플랫폼 라이브러리에 호환성이 깨지는 변경(breaking change)이 발생할 수 있습니다.
이는 두 가지 경우에 중요할 수 있습니다.

*   프로젝트의 소스 코드 컴파일에 영향을 미치는 플랫폼 라이브러리의 소스 코드 호환성이 깨지는 변경(source breaking change)이 있는 경우. 일반적으로 수정하기 쉽습니다.
*   일부 의존성(dependencies)에 영향을 미치는 플랫폼 라이브러리의 바이너리 호환성이 깨지는 변경(binary breaking change)이 있는 경우.
    일반적으로 쉬운 해결책(workaround)이 없으며, 라이브러리 개발자가 자신의 측에서 이 문제를 해결할 때까지 기다려야 합니다. 예를 들어, Kotlin 버전을 업데이트하여 해결해야 합니다.

    > 이러한 바이너리 비호환성(binary incompatibility)은 링크 경고 및 런타임 예외로 나타납니다.
    > 컴파일 시간에 이를 감지하려면 [`-Xpartial-linkage-loglevel=ERROR`](whatsnew19.md#library-linkage-in-kotlin-native) 컴파일러 옵션을 사용하여 경고를 오류로 승격시키십시오.
    >
    {style="note"}

JetBrains 팀이 플랫폼 라이브러리 생성에 사용되는 Xcode 버전을 업데이트할 때, 플랫폼 라이브러리의 호환성이 깨지는 변경을 피하기 위해 합리적인 노력을 기울입니다. 호환성이 깨지는 변경이 발생할 수 있는 경우, 팀은 영향 분석(impact analysis)을 수행하고, 특정 변경 사항을 무시하기로 결정하거나 (영향을 받는 API가 일반적으로 사용되지 않기 때문에) 임시 수정(ad hoc fix)을 적용합니다.

플랫폼 라이브러리에서 호환성이 깨지는 변경이 발생하는 또 다른 잠재적인 이유는 네이티브 API를 Kotlin으로 번역하는 알고리즘의 변경입니다. JetBrains 팀은 이러한 경우에도 호환성이 깨지는 변경을 피하기 위해 합리적인 노력을 기울입니다.

#### 플랫폼 라이브러리에서 새로운 Objective-C 클래스 사용하기

Kotlin 컴파일러는 배포 대상(deployment target)에서 사용할 수 없는 Objective-C 클래스를 사용하는 것을 막지 않습니다.

예를 들어, 배포 대상이 iOS 17.0이고, iOS 18.0에서만 나타난 클래스를 사용하는 경우, 컴파일러는 경고를 주지 않으며, iOS 17.0 기기에서 애플리케이션이 실행 중 충돌할 수 있습니다.
더욱이, 이러한 충돌은 해당 사용 지점에 실행이 도달하지 않는 경우에도 발생하므로, 버전 확인으로 보호하는 것만으로는 충분하지 않습니다.

자세한 내용은 [강력한 링크(Strong linking)](native-objc-interop.md#strong-linking)를 참조하십시오.

### 서드파티(third-party) 라이브러리

시스템 플랫폼 라이브러리 외에도, Kotlin/Native는 서드파티 네이티브 라이브러리 가져오기를 허용합니다.
예를 들어, [CocoaPods 통합(integration)](https://kotlinlang.org/docs/multiplatform/multiplatform-cocoapods-overview.html)을 사용하거나 [cinterops 구성(configuration)](https://kotlinlang.org/docs/multiplatform/multiplatform-dsl-reference.html#cinterops)을 설정할 수 있습니다.

#### Xcode 버전 불일치로 인한 라이브러리 가져오기

서드파티 네이티브 라이브러리를 가져오는 것은 다른 Xcode 버전과의 호환성 문제로 이어질 수 있습니다.

네이티브 라이브러리를 처리할 때, 컴파일러는 일반적으로 로컬에 설치된 Xcode의 헤더 파일을 사용합니다. 거의 모든 네이티브 라이브러리 헤더가 Xcode에서 제공되는 "표준" 헤더(예: `stdint.h`)를 가져오기 때문입니다.

이것이 Xcode 버전이 Kotlin으로 네이티브 라이브러리를 가져오는 데 영향을 미치는 이유입니다. 이것은 또한 서드파티 네이티브 라이브러리를 사용할 때 [비(非) Mac 호스트에서 Apple 타겟의 크로스 컴파일(cross-compilation)](https://kotlinlang.org/docs/multiplatform/multiplatform-publish-lib-setup.html#compilation-for-apple-targets)이 여전히 불가능한 이유 중 하나입니다.

모든 Kotlin 버전은 단일 Xcode 버전과 가장 호환됩니다. 이 버전이 권장 버전이며, 해당 Kotlin 버전에 대해 가장 많이 테스트되었습니다. [호환성 표](https://kotlinlang.org/docs/multiplatform/multiplatform-compatibility-guide.html#version-compatibility)에서 특정 Xcode 버전과의 호환성을 확인하십시오.

더 새로운 또는 더 오래된 Xcode 버전을 사용하는 것이 종종 가능하지만, 문제로 이어질 수 있습니다.
일반적으로 서드파티 네이티브 라이브러리 가져오기에 영향을 미칩니다.

##### 권장 Xcode 버전보다 최신 버전 사용 시

권장 Xcode 버전보다 최신 버전을 사용하는 것은 일부 Kotlin 기능을 손상시킬 수 있습니다. 서드파티 네이티브 라이브러리 가져오기가 이에 가장 큰 영향을 받습니다. 지원되지 않는 Xcode 버전에서는 전혀 작동하지 않는 경우가 많습니다.

##### 권장 Xcode 버전보다 이전 버전 사용 시

일반적으로 Kotlin은 이전 Xcode 버전과 잘 작동합니다. 하지만 다음과 같은 문제가 간혹 발생할 수 있습니다.

*   [KT-71694](https://youtrack.jetbrains.com/issue/KT-71694)에서와 같이 Kotlin API가 존재하지 않는 타입(type)을 참조하는 경우.
*   시스템 라이브러리의 타입이 네이티브 라이브러리의 Kotlin API에 포함되는 경우.
    이 경우 프로젝트는 성공적으로 컴파일되지만, 시스템 네이티브 타입이 네이티브 라이브러리 패키지에 추가됩니다.
    예를 들어, IDE 자동 완성에서 이 타입이 예기치 않게 나타날 수 있습니다.

Kotlin 라이브러리가 이전 Xcode 버전으로 성공적으로 컴파일되면, Kotlin 라이브러리 API에서 [서드파티 라이브러리의 타입(type)을 사용하지 않는 한](#using-native-types-in-library-api) 게시해도 안전합니다.

#### 전이적(transitive) 서드파티 네이티브 의존성 사용하기

프로젝트의 Kotlin 라이브러리가 서드파티 네이티브 라이브러리를 구현의 일부로 가져올 때,
프로젝트도 해당 네이티브 라이브러리에 접근할 수 있게 됩니다.
이는 Kotlin/Native가 `api`와 `implementation` 의존성(dependency) 타입을 구별하지 않기 때문에 발생합니다.
따라서 네이티브 라이브러리는 항상 `api` 의존성이 됩니다.

이러한 전이적 네이티브 의존성(transitive native dependency)을 사용하는 것은 더 많은 호환성 문제에 취약합니다.
예를 들어, Kotlin 라이브러리 개발자가 변경한 사항이 네이티브 라이브러리의 Kotlin 표현을 비호환적으로 만들 수 있으며,
Kotlin 라이브러리를 업데이트할 때 호환성 문제로 이어질 수 있습니다.

따라서 전이적 의존성에 의존하는 대신, 동일한 네이티브 라이브러리와의 상호 운용성(interoperability)을 직접 구성하십시오. 이를 위해, 호환성 문제를 방지하기 위해 [사용자 지정 패키지 이름 사용과](#use-custom-package-name) 유사하게 네이티브 라이브러리에 다른 패키지 이름을 사용하십시오.

#### 라이브러리 API에서 네이티브 타입 사용하기

Kotlin 라이브러리를 게시하는 경우, 라이브러리 API에 네이티브 타입(native type)을 사용하는 것에 주의하십시오. 이러한 사용 방식은 호환성 및 기타 문제를 해결하기 위해 향후 변경될 수 있으며, 이는 라이브러리 사용자에게 영향을 미칠 것입니다.

라이브러리 API에서 네이티브 타입을 사용하는 것이 필요한 경우가 있습니다. 라이브러리의 목적을 위해 필요하기 때문입니다. 예를 들어, Kotlin 라이브러리가 기본적으로 네이티브 라이브러리에 대한 확장(extension)을 제공하는 경우입니다.
해당 경우가 아니라면, 라이브러리 API에서 네이티브 타입 사용을 피하거나 제한하십시오.

이 권장 사항은 라이브러리 API에서 네이티브 타입의 사용에만 적용되며, 애플리케이션 코드와는 관련이 없습니다. 또한 라이브러리 구현에는 적용되지 않습니다. 예를 들어:

```kotlin
// Be extra careful! Native types are used in the library API:
public fun createUIView(): UIView
public fun handleThirdPartyNativeType(c: ThirdPartyNativeType)

// Be careful as usual; native types are not used in the library API:
internal fun createUIViewController(): UIViewController
public fun getDate(): String = NSDate().toString()
```

#### 서드파티 라이브러리를 사용하는 라이브러리 게시하기

서드파티 네이티브 라이브러리를 사용하는 Kotlin 라이브러리를 게시하는 경우, 호환성 문제를 피하기 위해 할 수 있는 몇 가지 사항이 있습니다.

##### 사용자 지정 패키지 이름 사용

서드파티 네이티브 라이브러리에 사용자 지정 패키지 이름을 사용하는 것은 호환성 문제를 방지하는 데 도움이 될 수 있습니다.

네이티브 라이브러리가 Kotlin으로 가져와지면, Kotlin 패키지 이름을 얻습니다. 고유하지 않은 경우, 라이브러리 사용자는 충돌을 겪을 수 있습니다. 예를 들어, 사용자 프로젝트의 다른 곳이나 다른 의존성(dependencies)에서 동일한 패키지 이름으로 네이티브 라이브러리가 가져와지는 경우, 이 두 가지 사용이 충돌하게 됩니다.

이러한 경우, 컴파일이 `Linking globals named '...': symbol multiply defined!` 오류와 함께 실패할 수 있습니다.
그러나 다른 오류가 발생하거나 심지어 성공적인 컴파일이 될 수도 있습니다.

서드파티 네이티브 라이브러리에 사용자 지정 이름을 사용하려면:

*   CocoaPods 통합(integration)을 통해 네이티브 라이브러리를 가져올 때, Gradle 빌드 스크립트의 `pod {}` 블록에서 `packageName` 속성을 사용하십시오.
*   `cinterops` 구성(configuration)으로 네이티브 라이브러리를 가져올 때, 구성 블록에서 `packageName` 속성을 사용하십시오.

##### 이전 Kotlin 버전과의 호환성 확인

Kotlin 라이브러리를 게시할 때, 서드파티 네이티브 라이브러리의 사용이 다른 Kotlin 버전과의 라이브러리 호환성(compatibility)에 영향을 미칠 수 있습니다. 특히:

*   Kotlin Multiplatform 라이브러리는 상위 호환성(forward compatibility)을 보장하지 않습니다 (이전 컴파일러가 더 새로운 컴파일러로 컴파일된 라이브러리를 사용할 수 있는 경우).

    실제로 일부 경우에 작동하지만, 네이티브 라이브러리를 사용하는 것은 상위 호환성을 더욱 제한할 수 있습니다.

*   Kotlin Multiplatform 라이브러리는 하위 호환성(backward compatibility)을 제공합니다 (더 새로운 컴파일러가 이전 버전으로 생성된 라이브러리를 사용할 수 있는 경우).

    Kotlin 라이브러리에서 네이티브 라이브러리를 사용하는 것은 일반적으로 하위 호환성에 영향을 미치지 않아야 합니다.
    그러나 이는 호환성에 영향을 미치는 더 많은 컴파일러 버그의 가능성을 열어줍니다.

##### 정적 라이브러리(static libraries) 포함 피하기

네이티브 라이브러리를 가져올 때, `-staticLibrary` 컴파일러 옵션 또는 `.def` 파일의 `staticLibraries` 속성을 사용하여 관련 [정적 라이브러리(static library)](native-definition-file.md#include-a-static-library) (`.a` 파일)를 포함할 수 있습니다.
이 경우, 라이브러리 사용자는 네이티브 의존성(dependencies) 및 링커 옵션을 처리할 필요가 없습니다.

그러나 포함된 정적 라이브러리의 사용을 어떤 방식으로든 구성하는 것은 불가능합니다. 제외하거나 교체(대체)할 수 없습니다. 따라서 사용자는 동일한 정적 라이브러리를 포함하는 다른 Kotlin 라이브러리와의 잠재적 충돌을 해결하거나 버전을 조정할 수 없을 것입니다.

### 네이티브 라이브러리 지원의 발전

현재 Kotlin 프로젝트에서 C 및 Objective-C를 사용하는 것은 호환성 문제로 이어질 수 있으며, 그중 일부는 이 가이드에 나열되어 있습니다.
이를 해결하려면 향후 일부 호환성이 깨지는 변경(breaking change)이 필요할 수 있으며, 이는 그 자체로 호환성 문제에 기여합니다.

## Swift 라이브러리 가져오기

Kotlin/Native는 순수 Swift 라이브러리의 직접 가져오기를 지원하지 않습니다. 그러나 이를 해결할 수 있는 몇 가지 옵션이 있습니다.

한 가지 방법은 수동 Objective-C 브리징(bridging)을 사용하는 것입니다. 이 접근 방식(approach)에서는 사용자 지정 Objective-C 래퍼(wrapper)와 `.def` 파일을 작성해야 하며, cinterop을 통해 해당 래퍼를 사용해야 합니다.

하지만 대부분의 경우, _역방향 가져오기(reverse import)_ 접근 방식을 사용하는 것을 권장합니다. Kotlin 측에서 예상되는 동작을 정의하고, Swift 측에서 실제 기능(functionality)을 구현한 다음, 이를 다시 Kotlin으로 전달하는 방식입니다.

예상되는 부분은 두 가지 방법 중 하나로 정의할 수 있습니다.

*   인터페이스를 생성합니다. 인터페이스 기반 접근 방식은 여러 함수와 테스트 용이성(testability)에 더 잘 확장됩니다.
*   Swift 클로저(closure)를 사용합니다. 빠른 프로토타입(prototype)에 적합하지만, 이 접근 방식에는 한계가 있습니다. 예를 들어, 상태(state)를 유지하지 않습니다.

Kotlin 프로젝트로 [CryptoKit](https://developer.apple.com/documentation/cryptokit/) Swift 라이브러리를 역방향 가져오기(reverse import)하는 다음 예시를 고려해 보십시오.

<tabs>
<tab title="인터페이스">

1.  Kotlin 측에서, Kotlin이 Swift로부터 기대하는 것을 설명하는 인터페이스를 생성합니다.

    ```kotlin
    // CryptoProvider.kt
    interface CryptoProvider {
        fun hashMD5(input: String): String
    }
    ```

2.  Swift 측에서, 순수 Swift 라이브러리인 CryptoKit을 사용하여 MD5 해싱 기능(functionality)을 구현합니다.

    ```swift
    // iosApp/ContentView.swift
    import CryptoKit
    
    class IosCryptoProvider: CryptoProvider {
        func hashMD5(input: String) -> String {
            guard let data = input.data(using: .utf8) else { return "failed" }
            return Insecure.MD5.hash(data: data).description
        }
    }
    ```

3.  Swift 구현을 Kotlin 컴포넌트(component)로 전달합니다.

    ```swift
    // iosApp/ContentView.swift
    struct ComposeView: UIViewControllerRepresentable {
        func makeUIViewController(context: Context) -> UIViewController {
            // Inject the Swift implementation into the Kotlin UI entry point
            MainViewControllerKt.MainViewController(cryptoProvider: IosCryptoProvider())
        }

        func updateUIViewController(_ uiViewController: UIViewController, context: Context) {}
    }
    ```

</tab>
<tab title="Swift 클로저">

1.  Kotlin 측에서, 함수 매개변수(parameter)를 선언하고 필요한 곳에서 사용합니다.

    ```kotlin
    // App.kt
    @Composable
    fun App(md5Hasher: (String) -> String) {
        // Example usage inside your UI
        val hashed = md5Hasher("Hello, world!")
        androidx.compose.material3.Text("Compose: $hashed")
    }
    ```

    ```kotlin
    // MainViewController.kt
    fun MainViewController(md5Hasher: (String) -> String) = ComposeUIViewController {
        App(md5Hasher)
    }
    ```

2.  Swift 측에서, CryptoKit 라이브러리로 MD5 해셔를 빌드하고 클로저(closure)로 전달합니다.

    ```swift
    // iosApp/ContentView.swift
    import CryptoKit
    import SwiftUI

    struct ComposeView: UIViewControllerRepresentable {
        func makeUIViewController(context: Context) -> UIViewController {
            MainViewControllerKt.MainViewController(md5Hasher: { input in
                guard let data = input.data(using: .utf8) else { return "failed" }
                return Insecure.MD5.hash(data: data).description
            })
        }

        func updateUIViewController(_ uiViewController: UIViewController, context: Context) {}
    }
    ```

</tab>
</tabs>

더 복잡한 프로젝트에서는 Swift 구현을 Kotlin으로 다시 전달하기 위해 의존성 주입(dependency injection)을 사용하는 것이 더 편리합니다.
자세한 내용은 [의존성 주입 프레임워크(Dependency injection framework)](https://kotlinlang.org/docs/multiplatform/multiplatform-connect-to-apis.html#dependency-injection-framework)를 참조하거나
[Koin 프레임워크](https://insert-koin.io/docs/reference/koin-mp/kmp/) 문서(documentation)를 확인하십시오.