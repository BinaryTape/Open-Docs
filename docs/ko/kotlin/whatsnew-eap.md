`[//]: # (title: Kotlin %kotlinEapVersion%의 새로운 기능)`

_[릴리스 날짜: %kotlinEapReleaseDate%](eap.md#build-details)_

> 이 문서는 얼리 액세스 프리뷰(EAP) 릴리스의 모든 기능을 다루지는 않지만,
> 몇 가지 주요 개선 사항을 강조합니다.
>
> 전체 변경 사항 목록은 [GitHub 변경 로그](https://github.com/JetBrains/kotlin/releases/tag/v%kotlinEapVersion%)를 참조하세요.
>
{style="note"}

Kotlin %kotlinEapVersion%이(가) 릴리스되었습니다!
이 EAP 릴리스의 세부 정보는 다음과 같습니다:

* Kotlin Multiplatform: [Swift 내보내기 기본 지원](#swift-export-available-by-default), [`js` 및 `wasmJs` 타겟을 위한 공유 소스셋](#shared-source-set-for-js-and-wasmjs-targets), [Kotlin 라이브러리를 위한 안정적인 크로스 플랫폼 컴파일](#stable-cross-platform-compilation-for-kotlin-libraries), 그리고 [공통 의존성 선언을 위한 새로운 접근 방식](#new-approach-for-declaring-common-dependencies).
* Language: [suspend 함수 타입의 오버로드에 람다를 전달할 때 개선된 오버로드 해결](#improved-overload-resolution-for-lambdas-with-suspend-function-types).
* Kotlin/Native: [바이너리에서 스택 카나리 지원](#support-for-stack-canaries-in-binaries) 및 [릴리스 바이너리를 위한 더 작은 바이너리 크기](#smaller-binary-size-for-release-binaries).
* Kotlin/Wasm: [Kotlin/Wasm 및 JavaScript 상호 운용성에서 개선된 예외 처리](#improved-exception-handling-in-kotlin-wasm-and-javascript-interop).
* Kotlin/JS: [`Long` 값이 JavaScript `BigInt`로 컴파일됨](#usage-of-bigint-type-to-represent-kotlin-s-long-type).

## IDE 지원

Kotlin %kotlinEapVersion%을(를) 지원하는 Kotlin 플러그인은 IntelliJ IDEA 및 Android Studio의 최신 버전에 번들로 제공됩니다.
IDE에서 Kotlin 플러그인을 업데이트할 필요가 없습니다.
빌드 스크립트에서 Kotlin 버전을 %kotlinEapVersion%(으)로 [변경하기만](configure-build-for-eap.md) 하면 됩니다.

자세한 내용은 [새 릴리스로 업데이트](releases.md#update-to-a-new-kotlin-version)를 참조하세요.

## 언어

Kotlin %kotlinEapVersion%에서 [suspend 함수 타입의 오버로드에 람다를 전달할 때 개선된 오버로드 해결](#improved-overload-resolution-for-lambdas-with-suspend-function-types)과 [명시적 반환 타입이 있는 표현식 본문에서 return 문 지원](#support-for-return-statements-in-expression-bodies-with-explicit-return-types)을 포함하여 Kotlin 2.3.0에 계획된 향후 언어 기능을 시도해 볼 수 있습니다.

### suspend 함수 타입의 람다에 대한 오버로드 해결 개선

이전에는 일반 함수 타입과 `suspend` 함수 타입 둘 다로 함수를 오버로드하면 람다를 전달할 때 모호성 오류가 발생했습니다. 이 오류는 명시적 타입 캐스트로 해결할 수 있었지만, 컴파일러는 `No cast needed` 경고를 잘못 보고했습니다:

```kotlin
// Defines two overloads
fun transform(block: () -> Int) {}
fun transform(block: suspend () -> Int) {}

fun test() {
    // Fails with overload resolution ambiguity
    transform({ 42 })

    // Uses an explicit cast, but compiler incorrectly reports a "No cast needed" warning
    transform({ 42 } as () -> Int)
}
```

이 변경 사항으로 일반 함수 타입 오버로드와 `suspend` 함수 타입 오버로드 둘 다를 정의할 때, 캐스트가 없는 람다는 일반 오버로드로 해결됩니다. `suspend` 키워드를 사용하여 suspend 오버로드로 명시적으로 해결할 수 있습니다:

```kotlin
// Resolves to transform(() -> Int)
transform({ 42 })

// Resolves to transform(suspend () -> Int)
transform(suspend { 42 })
```

이 동작은 Kotlin 2.3.0에서 기본적으로 활성화됩니다. 지금 테스트하려면 다음 컴파일러 옵션을 사용하여 언어 버전을 `2.3`으로 설정하세요:

```kotlin
-language-version 2.3
```

또는 `build.gradle(.kts)` 파일에서 구성하세요:

```kotlin
kotlin {
    compilerOptions {
        languageVersion.set(org.jetbrains.kotlin.gradle.dsl.KotlinVersion.KOTLIN_2_3)
    }
}
```

이슈 트래커인 [YouTrack](https://youtrack.jetbrains.com/issue/KT-23610)에 피드백을 주시면 감사하겠습니다.

### 명시적 반환 타입이 있는 표현식 본문에서 return 문 지원

이전에는 표현식 본문에서 `return`을 사용하면 함수의 반환 타입이 `Nothing`으로 추론될 수 있었기 때문에 컴파일러 오류가 발생했습니다.

```kotlin
fun example() = return 42
// Error: Returns are prohibited for functions with an expression body
```

이 변경 사항으로 반환 타입이 명시적으로 작성되어 있는 한, 이제 표현식 본문에서 `return`을 사용할 수 있습니다:

```kotlin
// Specifies the return type explicitly
fun getDisplayNameOrDefault(userId: String?): String = getDisplayName(userId ?: return "default")

// Fails because it doesn't specify the return type explicitly
fun getDisplayNameOrDefault(userId: String?) = getDisplayName(userId ?: return "default")
```

마찬가지로, 표현식 본문이 있는 함수의 람다 및 중첩된 표현식 내부의 `return` 문이 의도치 않게 컴파일되곤 했습니다. Kotlin은 이제 반환 타입이 명시적으로 지정된 경우에 이러한 케이스를 지원합니다. 명시적 반환 타입이 없는 경우는 Kotlin 2.3.0에서 더 이상 사용되지 않을 예정입니다:

```kotlin
// Return type isn't explicitly specified, and the return statement is inside a lambda
// which will be deprecated
fun returnInsideLambda() = run { return 42 }

// Return type isn't explicitly specified, and the return statement is inside the initializer
// of a local variable, which will be deprecated
fun returnInsideIf() = when {
    else -> {
        val result = if (someCondition()) return "" else "value"
        result
    }
}
```

이 동작은 Kotlin 2.3.0에서 기본적으로 활성화됩니다. 지금 테스트하려면 다음 컴파일러 옵션을 사용하여 언어 버전을 `2.3`으로 설정하세요:

```kotlin
-language-version 2.3
```

또는 `build.gradle(.kts)` 파일에서 구성하세요:

```kotlin
kotlin {
    compilerOptions {
        languageVersion.set(org.jetbrains.kotlin.gradle.dsl.KotlinVersion.KOTLIN_2_3)
    }
}
```

이슈 트래커인 [YouTrack](https://youtrack.jetbrains.com/issue/KT-76926)에 피드백을 주시면 감사하겠습니다.

## Kotlin/JVM: when 표현식에서 invokedynamic 지원
<primary-label ref="experimental-opt-in"/> 

Kotlin %kotlinEapVersion%에서 이제 `when` 표현식을 `invokedynamic`으로 컴파일할 수 있습니다.
이전에는 여러 타입 체크가 있는 `when` 표현식이 바이트코드에서 긴 `instanceof` 체크 체인으로 컴파일되었습니다.

이제 `when` 표현식과 함께 `invokedynamic`을 사용하여 Java `switch` 문으로 생성되는 바이트코드와 유사하게 더 작은 바이트코드를 생성할 수 있습니다. 다음 조건이 충족될 때 사용 가능합니다:

* `else`를 제외한 모든 조건은 `is` 또는 `null` 체크입니다.
* 표현식에 [가드 조건(`if`)](control-flow.md#guard-conditions-in-when-expressions)이 포함되어 있지 않습니다.
* 조건에 직접 타입 체크할 수 없는 타입(예: 변경 가능한 Kotlin 컬렉션(`MutableList`) 또는 함수 타입(`kotlin.Function1`, `kotlin.Function2` 등))이 포함되어 있지 않습니다.
* `else` 외에 최소 두 개의 조건이 있습니다.
* 모든 브랜치가 `when` 표현식의 동일한 주체를 체크합니다.

예시:

```kotlin
open class Example

class A : Example()
class B : Example()
class C : Example()

fun test(e: Example) = when (e) {
    // Uses invokedynamic with SwitchBootstraps.typeSwitch
    is A -> 1
    is B -> 2
    is C -> 3
    else -> 0
}
```

새 기능이 활성화되면 이 예시의 `when` 표현식은 여러 `instanceof` 체크 대신 단일 `invokedynamic` 타입 스위치로 컴파일됩니다.

이 기능을 활성화하려면 JVM 타겟 21 이상으로 Kotlin 코드를 컴파일하고 다음 컴파일러 옵션을 추가하세요:

```bash
-Xwhen-expressions=indy
```

또는 `build.gradle(.kts)` 파일의 `compilerOptions {}` 블록에 추가하세요:

```kotlin
kotlin {
    compilerOptions {
        freeCompilerArgs.add("-Xwhen-expressions=indy")
    }
}
```

이 기능은 [실험적](components-stability.md#stability-levels-explained)입니다. 피드백이나 질문이 있다면 [YouTrack](https://youtrack.jetbrains.com/issue/KT-65688)에 공유해 주세요.

## Kotlin Multiplatform

Kotlin %kotlinEapVersion%은 Kotlin Multiplatform에 중요한 변경 사항을 도입합니다: Swift 내보내기가 기본적으로 제공되며, 새로운 공유 소스셋이 있고, 공통 의존성을 관리하는 새로운 접근 방식을 시도할 수 있습니다.

### Swift 내보내기 기본 지원
<primary-label ref="experimental-general"/> 

Kotlin %kotlinEapVersion%은 Swift 내보내기에 대한 실험적 지원을 도입합니다. 이 기능을 통해 Kotlin 소스를 직접 내보내고 Swift에서 Kotlin 코드를 관용적으로 호출할 수 있어 Objective-C 헤더가 필요 없습니다.

이는 Apple 타겟을 위한 멀티플랫폼 개발을 크게 개선할 것입니다. 예를 들어, 최상위 함수가 있는 Kotlin 모듈이 있다면 Swift 내보내기를 통해 깔끔하고 모듈별로 명확한 임포트를 사용할 수 있으며, 혼란스러운 Objective-C 밑줄과 변형된 이름을 제거합니다.

주요 기능은 다음과 같습니다:

*   **다중 모듈 지원**. 각 Kotlin 모듈은 별도의 Swift 모듈로 내보내져 함수 호출을 간소화합니다.
*   **패키지 지원**. Kotlin 패키지는 내보내기 시 명시적으로 보존되어 생성된 Swift 코드의 이름 충돌을 방지합니다.
*   **타입 별칭**. Kotlin 타입 별칭은 Swift로 내보내지고 보존되어 가독성을 향상시킵니다.
*   **기본 타입에 대한 향상된 널 가능성**. 널 가능성을 보존하기 위해 `Int?`와 같은 타입을 `KotlinInt`와 같은 래퍼 클래스로 박싱해야 했던 Objective-C 상호 운용성과 달리, Swift 내보내기는 널 가능성 정보를 직접 변환합니다.
*   **오버로드**. Swift에서 Kotlin의 오버로드된 함수를 모호함 없이 호출할 수 있습니다.
*   **평탄화된 패키지 구조**. Kotlin 패키지를 Swift 열거형으로 변환하여 생성된 Swift 코드에서 패키지 접두사를 제거할 수 있습니다.
*   **모듈 이름 사용자 정의**. Kotlin 프로젝트의 Gradle 구성에서 결과 Swift 모듈 이름을 사용자 정의할 수 있습니다.

#### Swift 내보내기 활성화 방법

이 기능은 현재 [실험적](components-stability.md#stability-levels-explained)이며 iOS 프레임워크를 Xcode 프로젝트에 연결하기 위해 [직접 통합](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-direct-integration.html)을 사용하는 프로젝트에서만 작동합니다. 이는 IntelliJ IDEA의 Kotlin Multiplatform 플러그인 또는 [웹 위자드](https://kmp.jetbrains.com/)를 통해 생성된 Kotlin Multiplatform 프로젝트의 표준 구성입니다.

Swift 내보내기를 사용해 보려면 Xcode 프로젝트를 구성하세요:

1.  Xcode에서 프로젝트 설정을 엽니다.
2.  **Build Phases** 탭에서 `embedAndSignAppleFrameworkForXcode` 태스크가 있는 **Run Script** 단계를 찾습니다.
3.  실행 스크립트 단계에서 스크립트를 `embedSwiftExportForXcode` 태스크를 포함하도록 조정합니다:

    ```bash
    ./gradlew :<Shared module name>:embedSwiftExportForXcode
    ```

    ![Add the Swift export script](xcode-swift-export-run-script-phase.png){width=700}

4.  프로젝트를 빌드합니다. Swift 모듈은 빌드 출력 디렉토리에 생성됩니다.

이 기능은 기본적으로 제공됩니다. 이전 릴리스에서 이미 활성화했다면 이제 `gradle.properties` 파일에서 `kotlin.experimental.swift-export.enabled`를 제거할 수 있습니다.

> 시간을 절약하려면 Swift 내보내기가 이미 설정되어 있는 [공개 샘플](https://github.com/Kotlin/swift-export-sample)을 클론하세요.
>
{style="tip"}

Swift 내보내기에 대한 자세한 내용은 [README](https://github.com/JetBrains/kotlin/tree/master/docs/swift-export#readme)를 참조하세요.

#### 피드백 남기기

향후 Kotlin 릴리스에서 Swift 내보내기 지원을 확장하고 점진적으로 안정화할 계획입니다. Kotlin 2.2.20 이후에는 Kotlin과 Swift 간의 상호 운용성, 특히 코루틴 및 Flow 주변의 상호 운용성 개선에 집중할 것입니다.

Swift 내보내기 지원은 Kotlin Multiplatform에 중요한 변경 사항입니다. 귀하의 피드백에 감사드립니다:

*   Kotlin Slack에서 개발팀에 직접 문의하세요 – [초대 받기](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up?_gl=1*ju6cbn*_ga*MTA3MTk5NDkzMC4xNjQ2MDY3MDU4*_ga_9J976DJZ68*MTY1ODMzNzA3OS4xMDAuMS4xNjU4MzQwODEwLjYw) 및 [#swift-export](https://kotlinlang.slack.com/archives/C073GUW6WN9) 채널에 참여하세요.
*   Swift 내보내기 사용 중 발생한 모든 문제를 [YouTrack](https://kotl.in/issue)에 보고하세요.

### js 및 wasmJs 타겟을 위한 공유 소스셋

이전에는 Kotlin Multiplatform이 JavaScript (`js`) 및 WebAssembly (`wasmJs`) 웹 타겟을 위한 공유 소스셋을 기본적으로 포함하지 않았습니다.
`js`와 `wasmJs` 간에 코드를 공유하려면 사용자 지정 소스셋을 수동으로 구성하거나, `js`용 버전 하나와 `wasmJs`용 버전 하나, 이렇게 두 곳에 코드를 작성해야 했습니다. 예시:

```kotlin
// commonMain
expect suspend fun readCopiedText(): String

// jsMain
external interface Navigator { val clipboard: Clipboard }
// Different interop in JS and Wasm
external interface Clipboard { fun readText(): Promise<String> } 
external val navigator: Navigator

suspend fun readCopiedText(): String {
  // Different interop in JS and Wasm
    return navigator.clipboard.readText().await() 
}

// wasmJsMain
external interface Navigator { val clipboard: Clipboard }
external interface Clipboard { fun readText(): Promise<JsString> }
external val navigator: Navigator

suspend fun readCopiedText(): String {
    return navigator.clipboard.readText().await().toString() 
}
```

이번 릴리스부터 Kotlin Gradle 플러그인은 기본 계층 템플릿을 사용할 때 웹을 위한 새로운 공유 소스셋(`webMain` 및 `webTest`로 구성)을 추가합니다.

이 변경 사항으로 `web` 소스셋은 `js` 및 `wasmJs` 소스셋의 부모가 됩니다. 업데이트된 소스셋 계층은 다음과 같습니다:

![An example of using the default hierarchy template with web](default-hierarchy-example-with-web.svg)

새로운 소스셋을 통해 `js` 및 `wasmJs` 타겟 둘 다를 위해 하나의 코드 조각을 작성할 수 있습니다.
공유 코드를 `webMain`에 넣으면 두 타겟 모두에서 자동으로 작동합니다:

```kotlin
// commonMain
expect suspend fun readCopiedText(): String

// webMain
external interface Navigator { val clipboard: Clipboard }
external interface Clipboard { fun readText(): Promise<JsString> }
external val navigator: Navigator

suspend fun readCopiedText(): String {
    return navigator.clipboard.readText().await().toString()
}
```

이 업데이트는 `js` 및 `wasmJs` 타겟 간의 코드 공유를 간소화합니다. 특히 다음 두 가지 경우에 유용합니다:

*   코드 중복 없이 `js` 및 `wasmJs` 타겟을 모두 지원하려는 라이브러리 작성자에게 유용합니다.
*   웹을 타겟으로 하는 Compose Multiplatform 애플리케이션을 빌드하는 개발자에게 유용합니다. 더 넓은 브라우저 호환성을 위해 `js` 및 `wasmJs` 타겟으로 크로스 컴파일을 가능하게 합니다. 이러한 폴백 모드가 주어지면 웹사이트를 만들 때 모든 브라우저에서 바로 작동합니다: 최신 브라우저는 `wasmJs`를 사용하고, 이전 브라우저는 `js`를 사용합니다.

이 기능을 사용해 보려면 `build.gradle(.kts)` 파일의 `kotlin {}` 블록에서 [기본 계층 템플릿](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-hierarchy.html#default-hierarchy-template)을 사용하세요.

```kotlin
kotlin {
    js()
    wasmJs()

    // Enables the default source set hierarchy, including webMain and webTest
    applyDefaultHierarchyTemplate()
}
```

기본 계층을 사용하기 전에 사용자 지정 공유 소스셋이 있는 프로젝트가 있거나 `js("web")` 타겟의 이름을 변경했다면 잠재적인 충돌을 신중하게 고려하세요. 이러한 충돌을 해결하려면 충돌하는 소스셋 또는 타겟의 이름을 변경하거나 기본 계층을 사용하지 마세요.

### Kotlin 라이브러리를 위한 안정적인 크로스 플랫폼 컴파일

Kotlin %kotlinEapVersion%은 Kotlin 라이브러리를 위한 크로스 플랫폼 컴파일을 안정화하는 중요한 [로드맵 항목](https://youtrack.jetbrains.com/issue/KT-71290)을 완료합니다.

이제 어떤 호스트든 사용하여 Kotlin 라이브러리 게시를 위한 `.klib` 아티팩트를 생성할 수 있습니다. 이는 게시 프로세스를 크게 간소화하며, 특히 이전에는 Mac 머신이 필요했던 Apple 타겟의 경우 더욱 그렇습니다.

이 기능은 기본적으로 제공됩니다. `kotlin.native.enableKlibsCrossCompilation=true`를 사용하여 크로스 컴파일을 이미 활성화했다면, 이제 `gradle.properties` 파일에서 이를 제거할 수 있습니다.

안타깝게도 몇 가지 제한 사항이 여전히 존재합니다. 다음의 경우 여전히 Mac 머신을 사용해야 합니다:

*   라이브러리 또는 종속 모듈에 [cinterop 의존성](native-c-interop.md)이 있는 경우.
*   프로젝트에 [CocoaPods 통합](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-cocoapods-overview.html)이 설정되어 있는 경우.
*   Apple 타겟을 위한 [최종 바이너리](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-build-native-binaries.html)를 빌드하거나 테스트해야 하는 경우.

멀티플랫폼 라이브러리 게시에 대한 자세한 내용은 [문서](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-publish-lib-setup.html)를 참조하세요.

### 공통 의존성 선언을 위한 새로운 접근 방식
<primary-label ref="experimental-opt-in"/>

Gradle로 멀티플랫폼 프로젝트 설정을 간소화하기 위해, Kotlin %kotlinEapVersion%에서는 이제 최상위 `dependencies {}` 블록을 사용하여 `kotlin {}` 블록에 공통 의존성을 선언할 수 있습니다. 이 의존성들은 `commonMain` 소스셋에 선언된 것처럼 동작합니다. 이 기능은 Kotlin/JVM 및 Android 전용 프로젝트에 사용하는 dependencies 블록과 유사하게 작동하며, 이제 Kotlin Multiplatform에서 [실험적](components-stability.md#stability-levels-explained)입니다. 프로젝트 수준에서 공통 의존성을 선언하면 소스셋 전반에 걸친 반복적인 구성을 줄이고 빌드 설정을 간소화하는 데 도움이 됩니다. 필요에 따라 각 소스셋에 플랫폼별 의존성을 추가할 수도 있습니다.

이 기능을 사용해 보려면 최상위 `dependencies {}` 블록 앞에 `@OptIn(ExperimentalKotlinGradlePluginApi::class)` 애노테이션을 추가하여 옵트인(opt-in)하세요. 예시:

```kotlin
kotlin {
    @OptIn(ExperimentalKotlinGradlePluginApi::class)
    dependencies {
        implementation("org.jetbrains.kotlinx:kotlinx-coroutines-core:%coroutinesVersion%")
    }
}
```

이 기능에 대한 피드백을 [YouTrack](https://youtrack.jetbrains.com/issue/KT-76446)에 주시면 감사하겠습니다.

## Kotlin/Native

Kotlin %kotlinEapVersion%은 Kotlin/Native 바이너리 및 디버깅에 대한 개선 사항을 제공합니다.

### 바이너리에서 스택 카나리 지원

%kotlinEapVersion%부터 Kotlin은 결과 Kotlin/Native 바이너리에서 스택 카나리 지원을 추가합니다. 스택 보호의 일부로 이 보안 기능은 스택 스매싱으로부터 보호하여 일부 일반적인 애플리케이션 취약성을 완화합니다. Swift와 Objective-C에서 이미 사용 가능하며, 이제 Kotlin에서도 지원됩니다.

Kotlin/Native의 스택 보호 구현은 [Clang](https://clang.llvm.org/docs/ClangCommandLineReference.html#cmdoption-clang-fstack-protector)의 스택 보호기 동작을 따릅니다.

스택 카나리를 활성화하려면 `gradle.properties` 파일에 다음 [바이너리 옵션](native-binary-options.md)을 추가하세요:

```none
kotlin.native.binary.stackProtector=yes
```

이 속성은 스택 스매싱에 취약한 모든 Kotlin 함수에 대해 이 기능을 활성화합니다. 대체 모드는 다음과 같습니다:

*   `kotlin.native.binary.stackProtector=strong`은 스택 스매싱에 취약한 함수에 대해 더 강력한 휴리스틱을 사용합니다.
*   `kotlin.native.binary.stackProtector=all`은 모든 함수에 대해 스택 보호기를 활성화합니다.

일부 경우에 스택 보호는 성능 비용을 수반할 수 있습니다.

### 릴리스 바이너리를 위한 더 작은 바이너리 크기
<primary-label ref="experimental-opt-in"/> 

Kotlin %kotlinEapVersion%은 릴리스 바이너리(release binaries)의 바이너리 크기를 줄이는 데 도움이 되는 `smallBinary` 옵션을 도입합니다. 새 옵션은 LLVM 컴파일 단계에서 컴파일러의 기본 최적화 인수로 `-Oz`를 효과적으로 설정합니다.

`smallBinary` 옵션을 활성화하면 릴리스 바이너리를 더 작게 만들고 빌드 시간을 개선할 수 있습니다. 하지만 일부 경우에 런타임 성능에 영향을 미칠 수 있습니다.

새 기능은 현재 [실험적](components-stability.md#stability-levels-explained)입니다. 프로젝트에서 사용해 보려면 `gradle.properties` 파일에 다음 [바이너리 옵션](native-binary-options.md)을 추가하세요:

```none
kotlin.native.binary.smallBinary=true
```

특정 바이너리의 경우 `build.gradle(.kts)` 파일에서 `binaryOption("smallBinary", "true")`를 설정하세요. 예시:

```kotlin
kotlin {
    listOf(
        iosX64(),
        iosArm64(),
        iosSimulatorArm64(),
    ).forEach {
        it.binaries.framework {
            binaryOption("smallBinary", "true")
        }
    }
}
```

Kotlin 팀은 이 기능 구현에 도움을 주신 [Troels Lund](https://github.com/troelsbjerre)님께 감사드립니다.

### 디버거 객체 요약 개선

Kotlin/Native는 이제 LLDB 및 GDB와 같은 디버거 도구를 위한 더 명확한 객체 요약을 생성합니다. 이는 생성된 디버그 정보의 가독성을 향상시키고 디버깅 경험을 간소화합니다.

이전에는 다음과 같은 객체를 검사했을 때:

```kotlin
class Point(val x: Int, val y: Int)
val point = Point(1, 2)
```

메모리 주소에 대한 포인터를 포함하여 제한된 정보를 볼 수 있었습니다:

```none
(lldb) v point
(ObjHeader *) point = [x: ..., y: ...]
(lldb) v point->x
(int32_t *) x = 0x0000000100274048
```

Kotlin %kotlinEapVersion%을(를) 사용하면 디버거가 실제 값을 포함하여 더 풍부한 세부 정보를 보여줍니다:

```none
(lldb) v point
(ObjHeader *) point = Point(x=1, y=2)
(lldb) v point->x
(int32_t) point->x = 1
```

Kotlin 팀은 이 기능 구현에 도움을 주신 [Nikita Nazarov](https://github.com/nikita-nazarov)님께 감사드립니다.

Kotlin/Native에서의 디버깅에 대한 자세한 내용은 [문서](native-debugging.md)를 참조하세요.

## Kotlin/Wasm

Kotlin/Wasm은 분리된 npm 의존성 및 JavaScript 상호 운용성을 위한 개선된 예외 처리를 포함하여 일부 편의성 개선 사항을 받습니다.

### 분리된 npm 의존성

이전에는 Kotlin/Wasm 프로젝트에서 모든 [npm](https://www.npmjs.com/) 의존성이 프로젝트 폴더에 함께 설치되었습니다. 여기에는 사용자 자신의 의존성과 Kotlin 툴링 의존성이 모두 포함되었습니다. 이 의존성들은 프로젝트의 잠금 파일(`package-lock.json` 또는 `yarn.lock`)에도 함께 기록되었습니다.

결과적으로 Kotlin 툴링 의존성이 업데이트될 때마다 아무것도 추가하거나 변경하지 않았더라도 잠금 파일을 업데이트해야 했습니다.

Kotlin %kotlinEapVersion%부터 Kotlin 툴링 npm 의존성은 프로젝트 외부에 설치됩니다. 이제 툴링 및 사용자 의존성은 별도의 디렉토리를 가집니다:

*   **툴링 의존성 디렉토리:**

    `<kotlin-user-home>/kotlin-npm-tooling/<yarn|npm>/hash/node_modules`

*   **사용자 의존성 디렉토리:**

    `build/wasm/node_modules`

또한, 프로젝트 디렉토리 내부의 잠금 파일은 사용자 정의 의존성만 포함합니다.

이 개선 사항은 잠금 파일이 사용자 자신의 의존성에만 집중하도록 유지하여 더 깔끔한 프로젝트를 유지하고 파일의 불필요한 변경을 줄이는 데 도움이 됩니다.

이 변경 사항은 `wasm-js` 타겟에 대해 기본적으로 활성화됩니다. 이 변경 사항은 `js` 타겟에 아직 구현되지 않았습니다. 향후 릴리스에서 구현할 계획이 있지만, Kotlin %kotlinEapVersion%에서는 `js` 타겟의 npm 의존성 동작이 동일하게 유지됩니다.

### Kotlin/Wasm 및 JavaScript 상호 운용성에서 개선된 예외 처리

이전에는 Kotlin이 JavaScript(JS)에서 발생한 예외(오류)를 이해하고 Kotlin/Wasm 코드로 넘어가는 데 어려움이 있었습니다.

일부 경우에 문제는 역방향으로도 발생했습니다. 예외가 Wasm 코드를 통해 JS로 던져지거나 전달되어 아무런 세부 정보 없이 `WebAssembly.Exception`으로 래핑될 때였습니다. 이러한 Kotlin 예외 처리 문제는 디버깅을 어렵게 만들었습니다.

Kotlin %kotlinEapVersion%부터 예외 처리와 관련한 개발자 경험이 양방향으로 개선됩니다:

*   JavaScript에서 예외가 발생할 때: Kotlin 쪽에서 더 많은 정보를 볼 수 있습니다. 그러한 예외가 Kotlin을 통해 다시 JS로 전파될 때, 더 이상 WebAssembly로 래핑되지 않습니다.
*   Kotlin에서 예외가 발생할 때: 이제 JavaScript 쪽에서 JS 오류로 Catch할 수 있습니다.

새로운 예외 처리는 [`WebAssembly.JSTag`](https://webassembly.github.io/exception-handling/js-api/#dom-webassembly-jstag) 기능을 지원하는 최신 브라우저에서 자동으로 작동합니다:

*   Chrome 115+
*   Firefox 129+
*   Safari 18.4+

이전 브라우저에서는 예외 처리 동작이 변경되지 않습니다.

## Kotlin/JS

Kotlin %kotlinEapVersion%은 Kotlin의 `Long` 타입을 나타내기 위해 `BigInt` 타입을 사용하는 것을 지원하여, 내보낸 선언에서 `Long`을 활성화합니다. 또한, 이번 릴리스에서는 Node.js 인수를 정리하는 DSL 함수를 추가합니다.

### Kotlin의 Long 타입을 나타내기 위한 BigInt 타입 사용
<primary-label ref="experimental-opt-in"/>

ES2020 표준 이전에는 JavaScript(JS)가 53비트보다 큰 정밀 정수를 위한 기본 타입을 지원하지 않았습니다.

이러한 이유로 Kotlin/JS는 `Long` 값(64비트)을 두 개의 `number` 속성을 포함하는 JavaScript 객체로 표현했습니다. 이 사용자 지정 구현은 Kotlin과 JavaScript 간의 상호 운용성을 더 복잡하게 만들었습니다.

Kotlin %kotlinEapVersion%부터 Kotlin/JS는 이제 현대 JavaScript(ES2020)로 컴파일할 때 JavaScript의 내장 `BigInt` 타입을 사용하여 Kotlin의 `Long` 값을 나타냅니다.

이 변경 사항은 Kotlin %kotlinEapVersion%에서도 도입된 기능인 [JavaScript로 `Long` 타입을 내보내는 것](#usage-of-long-in-exported-declarations)을 가능하게 합니다. 결과적으로 이 변경 사항은 Kotlin과 JavaScript 간의 상호 운용성을 간소화합니다.

이를 활성화하려면 `build.gradle(.kts)` 파일에 다음 컴파일러 옵션을 추가하세요:

```kotlin
// build.gradle.kts
kotlin {
    js {
        ...
        compilerOptions {
            freeCompilerArgs.add("-Xes-long-as-bigint")
        }
    }
}
```

이 기능은 아직 [실험적](components-stability.md#stability-levels-explained)입니다. 문제가 발생하면 이슈 트래커인 [YouTrack](https://youtrack.jetbrains.com/issue/KT-57128)에 보고해 주세요.

#### 내보낸 선언에서 Long 사용

Kotlin/JS가 사용자 지정 `Long` 표현을 사용했기 때문에 JavaScript에서 Kotlin의 `Long`과 상호 작용하는 간단한 방법을 제공하기 어려웠습니다. 결과적으로 `Long` 타입을 사용하는 Kotlin 코드를 JavaScript로 내보낼 수 없었습니다. 이 문제는 함수 파라미터, 클래스 속성 또는 생성자와 같이 `Long`을 사용하는 모든 코드에 영향을 미쳤습니다.

이제 Kotlin의 `Long` 타입을 JavaScript의 `BigInt` 타입으로 컴파일할 수 있으므로, Kotlin/JS는 JavaScript로 `Long` 값을 내보내는 것을 지원하여 Kotlin 및 JavaScript 코드 간의 상호 운용성을 간소화합니다.

이 기능을 활성화하려면:

1.  Kotlin/JS에서 `Long` 내보내기를 허용합니다. `build.gradle(.kts)` 파일의 `freeCompilerArgs` 속성에 다음 컴파일러 인수를 추가하세요:

    ```kotlin
    // build.gradle.kts
    kotlin {
        js {
            ...
            compilerOptions {                   
                freeCompilerArgs.add("-XXLanguage:+JsAllowLongInExportedDeclarations")
            }
        }
    }
    ```

2.  `BigInt` 타입을 활성화합니다. [Kotlin의 `Long` 타입을 나타내기 위한 `BigInt` 타입 사용](#usage-of-bigint-type-to-represent-kotlin-s-long-type)에서 활성화 방법을 참조하세요.

### 더 깔끔한 인수를 위한 새로운 DSL 함수

Node.js로 Kotlin/JS 애플리케이션을 실행할 때, 프로그램에 전달되는 인수(`args`)에는 다음이 포함되었습니다:

*   실행 파일 `Node`의 경로.
*   스크립트의 경로.
*   제공한 실제 명령줄 인수.

하지만 `args`에 대한 예상 동작은 명령줄 인수만 포함하는 것이었습니다. 이를 달성하기 위해 `build.gradle(.kts)` 파일 내부 또는 Kotlin 코드에서 `drop()` 함수를 사용하여 처음 두 인수를 수동으로 건너뛰어야 했습니다:

```kotlin
fun main(args: Array<String>) {
    println(args.drop(2).joinToString(", "))
}
```

이 해결 방법은 반복적이고 오류 발생 가능성이 높았으며 플랫폼 간에 코드를 공유할 때 잘 작동하지 않았습니다.

이 문제를 해결하기 위해 Kotlin %kotlinEapVersion%은 `passCliArgumentsToMainFunction()`이라는 새로운 DSL 함수를 도입합니다.

이 함수를 사용하면 인수는 명령줄 인수만 포함하고 `Node` 및 스크립트 경로는 제외합니다:

```kotlin
fun main(args: Array<String>) {
    // No need for drop() and only your custom arguments are included 
    println(args.joinToString(", "))
}
```

이 변경 사항은 상용구 코드를 줄이고 수동으로 인수를 건너뛰어 발생하는 실수를 방지하며 크로스 플랫폼 호환성을 개선합니다.

이 기능을 활성화하려면 `build.gradle(.kts)` 파일 안에 다음 DSL 함수를 추가하세요:

```kotlin
kotlin {
    js {
        nodejs {
            passCliArgumentsToMainFunction()
        }
    }
}
```

## Gradle: Kotlin/Native 태스크의 빌드 리포트에 새로운 컴파일러 성능 지표

Kotlin 1.7.0에서 컴파일러 성능 추적에 도움이 되는 [빌드 리포트](gradle-compilation-and-caches.md#build-reports)를 도입했습니다. 그 이후로 이러한 리포트를 더욱 상세하고 성능 문제 조사에 유용하게 만들기 위해 더 많은 지표를 추가했습니다.

Kotlin %kotlinEapVersion%에서는 빌드 리포트에 Kotlin/Native 태스크에 대한 컴파일러 성능 지표가 포함됩니다.

빌드 리포트와 구성 방법에 대해 자세히 알아보려면 [빌드 리포트 활성화](gradle-compilation-and-caches.md#enabling-build-reports)를 참조하세요.

## Maven: kotlin-maven-plugin에서 Kotlin 데몬 지원

Kotlin 2.2.0의 [빌드 도구 API](whatsnew22.md#new-experimental-build-tools-api) 도입과 함께, Kotlin %kotlinEapVersion%은 `kotlin-maven-plugin`에서 Kotlin 데몬 지원을 추가하여 한 단계 더 나아갑니다. Kotlin 데몬을 사용할 때 Kotlin 컴파일러는 별도의 격리된 프로세스에서 실행되어 다른 Maven 플러그인이 시스템 속성을 재정의하는 것을 방지합니다. 이 [YouTrack 이슈](https://youtrack.jetbrains.com/issue/KT-43894/Maven-Windows-error-RuntimeException-Could-not-find-installation-home-path)에서 예시를 볼 수 있습니다.

Kotlin %kotlinEapVersion%부터 Kotlin 데몬은 기본적으로 사용됩니다. 이는 빌드 시간을 단축하는 데 도움이 되는 [증분 컴파일](maven.md#enable-incremental-compilation)이라는 추가적인 이점을 제공합니다. 이전 동작으로 되돌리려면 `pom.xml` 파일에서 다음 속성을 `false`로 설정하여 옵트아웃(opt out)하세요.

```xml
<properties>
    <kotlin.compiler.daemon>false</kotlin.compiler.daemon>
</properties>
```

Kotlin %kotlinEapVersion%은 또한 새로운 `jvmArgs` 속성을 도입하며, 이 속성을 사용하여 Kotlin 데몬의 기본 JVM 인수를 사용자 정의할 수 있습니다. 예를 들어, `-Xmx` 및 `-Xms` 옵션을 재정의하려면 `pom.xml` 파일에 다음을 추가하세요:

```xml
<properties>
    <kotlin.compiler.daemon.jvmArgs>Xmx1500m,Xms500m</kotlin.compiler.daemon.jvmArgs>
</properties>
```

## 표준 라이브러리: Kotlin/JS에서 리플렉션을 통한 인터페이스 타입 식별 지원
<primary-label ref="experimental-opt-in"/>

Kotlin %kotlinEapVersion%은 Kotlin/JS 표준 라이브러리에 실험적인 `KClass.isInterface` 속성을 추가합니다.

이 속성을 사용하면 이제 클래스 참조가 Kotlin 인터페이스를 나타내는지 확인할 수 있습니다. 이는 Kotlin/JVM과 Kotlin/JS의 동등성을 높여주며, Kotlin/JVM에서는 `KClass.java.isInterface`를 사용하여 클래스가 인터페이스를 나타내는지 확인할 수 있습니다.

옵트인(opt-in)하려면 `@OptIn(ExperimentalStdlibApi::class)` 애노테이션을 사용하세요:

```kotlin
@OptIn(ExperimentalStdlibApi::class)
fun inspect(klass: KClass<*>) {
    // Prints true for interfaces
    println(klass.isInterface)
}
```

이슈 트래커인 [YouTrack](https://youtrack.jetbrains.com/issue/KT-78581)에 피드백을 주시면 감사하겠습니다.