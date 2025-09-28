[//]: # (title: Kotlin 2.2.20의 새로운 기능)

_[릴리스: 2025년 9월 10일](releases.md#release-details)_

> Kotlin에 대한 여러분의 의견을 듣고 싶습니다!
>
> [Kotlin 개발자 설문조사에 참여해 주세요.](https://surveys.jetbrains.com/s3/7e238a7b85e5) 약 10분 정도 소요되며, 여러분의 피드백은 언어, 도구 및 생태계를 개선하는 데 도움이 될 것입니다.
>
{style="note"}

Kotlin 2.2.20 릴리스가 출시되어 웹 개발을 위한 중요한 변경 사항을 제공합니다. [Kotlin/Wasm은 이제 베타 버전](#kotlin-wasm)이며, [JavaScript 상호 운용성에서 예외 처리 개선](#improved-exception-handling-in-kotlin-wasm-and-javascript-interop), [npm 의존성 관리](#separated-npm-dependencies), [내장 브라우저 디버깅 지원](#support-for-debugging-in-browsers-without-configuration), 그리고 `js` 및 `wasmJs` 타겟을 위한 새로운 [공유 소스 세트](#shared-source-set-for-js-and-wasmjs-targets)를 포함한 개선 사항이 있습니다.

또한, 주요 내용은 다음과 같습니다:

*   **Kotlin Multiplatform**: [Swift export가 기본적으로 제공](#swift-export-available-by-default)되며, [Kotlin 라이브러리를 위한 안정적인 크로스 플랫폼 컴파일](#stable-cross-platform-compilation-for-kotlin-libraries), 그리고 [공통 의존성을 선언하는 새로운 접근 방식](#new-approach-for-declaring-common-dependencies)이 도입되었습니다.
*   **언어**: [람다를 `suspend` 함수 타입의 오버로드에 전달할 때 오버로드 결정 개선](#improved-overload-resolution-for-lambdas-with-suspend-function-types)이 이루어졌습니다.
*   **Kotlin/Native**: [바이너리에서 스택 카나리(stack canaries) 지원](#support-for-stack-canaries-in-binaries) 및 [릴리스 바이너리의 바이너리 크기 축소](#smaller-binary-size-for-release-binaries)가 추가되었습니다.
*   **Kotlin/JS**: [`Long` 값이 JavaScript `BigInt`로 컴파일](#usage-of-the-bigint-type-to-represent-kotlin-s-long-type)됩니다.

> 웹용 Compose Multiplatform이 이제 베타 버전입니다. 자세한 내용은 [블로그 게시물](https://blog.jetbrains.com/kotlin/2025/09/compose-multiplatform-1-9-0-compose-for-web-beta/)에서 알아보세요.
>
{style="note"}

## IDE 지원

Kotlin 2.2.20을 지원하는 Kotlin 플러그인은 최신 버전의 IntelliJ IDEA 및 Android Studio에 번들로 포함되어 있습니다. 업데이트하려면 빌드 스크립트에서 Kotlin 버전을 2.2.20으로 변경하기만 하면 됩니다.

자세한 내용은 [새 릴리스로 업데이트](releases.md#update-to-a-new-kotlin-version)를 참조하세요.

## 언어

Kotlin 2.2.20에서는 Kotlin 2.3.0에 예정된 다음 언어 기능을 시험해 볼 수 있습니다. [람다를 `suspend` 함수 타입의 오버로드에 전달할 때 오버로드 결정 개선](#improved-overload-resolution-for-lambdas-with-suspend-function-types)과 [명시적 반환 타입이 있는 표현식 본문에서 `return` 문 지원](#support-for-return-statements-in-expression-bodies-with-explicit-return-types)이 포함됩니다. 또한 이번 릴리스에는 [`when` 표현식에 대한 완전성 검사 개선](#data-flow-based-exhaustiveness-checks-for-when-expressions), [재실체화된(reified) `Throwable` 캐치](#support-for-reified-types-in-catch-clauses), 그리고 [Kotlin 계약(contracts) 개선](#improved-kotlin-contracts)도 포함되어 있습니다.

### `suspend` 함수 타입을 사용하는 람다에 대한 오버로드 결정 개선

이전에는 일반 함수 타입과 `suspend` 함수 타입 모두를 사용하여 함수를 오버로드하면 람다를 전달할 때 모호성(ambiguity) 오류가 발생했습니다. 명시적 타입 캐스트를 사용하여 이 오류를 해결할 수 있었지만, 컴파일러는 `No cast needed` 경고를 잘못 보고했습니다:

```kotlin
// Defines two overloads
fun transform(block: () -> Int) {}
fun transform(block: suspend () -> Int) {}

fun test() {
    // Fails with overload resolution ambiguity
    transform({ 42 })

    // Uses an explicit cast, but the compiler incorrectly reports
    // a "No cast needed" warning
    transform({ 42 } as () -> Int)
}
```

이 변경으로, 일반 함수 타입과 `suspend` 함수 타입 오버로드 모두를 정의할 때, 캐스트 없는 람다는 일반 오버로드로 결정됩니다. `suspend` 키워드를 사용하여 suspend 오버로드로 명시적으로 결정하세요:

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

### 명시적 반환 타입이 있는 표현식 본문에서 `return` 문 지원

이전에는 표현식 본문에서 `return`을 사용하면 함수의 반환 타입이 `Nothing`으로 추론될 수 있었기 때문에 컴파일러 오류가 발생했습니다.

```kotlin
fun example() = return 42
// Error: Returns are prohibited for functions with an expression body
```

이 변경으로, 반환 타입이 명시적으로 작성된 경우 표현식 본문에서 `return`을 사용할 수 있게 되었습니다:

```kotlin
// Specifies the return type explicitly
fun getDisplayNameOrDefault(userId: String?): String = getDisplayName(userId ?: return "default")

// Fails because it doesn't specify the return type explicitly
fun getDisplayNameOrDefault(userId: String?) = getDisplayName(userId ?: return "default")
```

마찬가지로, 표현식 본문이 있는 함수에서 람다 및 중첩 표현식 내의 `return` 문은 의도치 않게 컴파일되곤 했습니다. Kotlin은 이제 반환 타입이 명시적으로 지정된 경우 이러한 사례를 지원합니다. 명시적 반환 타입이 없는 사례는 Kotlin 2.3.0에서 사용 중단됩니다:

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

### `when` 표현식을 위한 데이터 흐름 기반 완전성 검사
<primary-label ref="experimental-opt-in"/>

Kotlin 2.2.20은 `when` 표현식을 위한 **데이터 흐름 기반** 완전성 검사를 도입합니다.
이전에는 컴파일러의 검사가 `when` 표현식 자체에 국한되어,
종종 중복된 `else` 브랜치를 추가해야 했습니다.
이번 업데이트를 통해 컴파일러는 이제 이전 조건 검사와 조기 반환을 추적하여,
중복된 `else` 브랜치를 제거할 수 있게 되었습니다.

예를 들어, 컴파일러는 이제 `if` 조건이 충족될 때 함수가 반환된다는 것을 인식하므로,
`when` 표현식은 나머지 경우만 처리하면 됩니다:

```kotlin
enum class UserRole { ADMIN, MEMBER, GUEST }

fun getPermissionLevel(role: UserRole): Int {
    // Covers the Admin case outside of the when expression
    if (role == UserRole.ADMIN) return 99

    return when (role) {
        UserRole.MEMBER -> 10
        UserRole.GUEST -> 1
        // You no longer have to include this else branch
        // else -> throw IllegalStateException()
    }
}
```

이 기능은 [실험적](components-stability.md#stability-levels-explained)입니다.
이를 활성화하려면 `build.gradle(.kts)` 파일에 다음 컴파일러 옵션을 추가하세요:

```kotlin
kotlin {
    compilerOptions {
        freeCompilerArgs.add("-Xdata-flow-based-exhaustiveness")
    }
}
```

### `catch` 절에서 재실체화된(reified) 타입 지원
<primary-label ref="experimental-opt-in"/>

Kotlin 2.2.20에서는 컴파일러가 `inline` 함수의 `catch` 절에서 [재실체화된 제네릭 타입 매개변수](inline-functions.md#reified-type-parameters)를 사용하는 것을 허용합니다.

다음은 예시입니다:

```kotlin
inline fun <reified ExceptionType : Throwable> handleException(block: () -> Unit) {
    try {
        block()
        // This is now allowed after the change
    } catch (e: ExceptionType) {
        println("Caught specific exception: ${e::class.simpleName}")
    }
}

fun main() {
    // Tries to perform an action that might throw an IOException
    handleException<java.io.IOException> {
        throw java.io.IOException("File not found")
    }
    // Caught specific exception: IOException
}
```

이전에는 `inline` 함수에서 재실체화된 `Throwable` 타입을 캐치하려고 시도하면 오류가 발생했습니다.

이 동작은 Kotlin 2.4.0에서 기본적으로 활성화됩니다.
지금 사용하려면 `build.gradle(.kts)` 파일에 다음 컴파일러 옵션을 추가하세요:

```kotlin
kotlin {
    compilerOptions {
        freeCompilerArgs.add("-Xallow-reified-type-in-catch")
    }
}
```

Kotlin 팀은 외부 기여자 [Iven Krall](https://github.com/kralliv)의 기여에 감사드립니다.

### Kotlin 계약(contracts) 개선
<primary-label ref="experimental-opt-in"/>

Kotlin 2.2.20은 [Kotlin 계약(contracts)](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.contracts/contract.html)에 몇 가지 개선 사항을 도입합니다:

*   [계약 타입 어설션에서 제네릭 지원](#support-for-generics-in-contract-type-assertions).
*   [프로퍼티 접근자 및 특정 연산자 함수 내부에서 계약 지원](#support-for-contracts-inside-property-accessors-and-specific-operator-functions).
*   조건이 충족될 때 null이 아닌 반환 값을 보장하는 방법으로 [계약에서 `returnsNotNull()` 함수 지원](#support-for-the-returnsnotnull-function-in-contracts).
*   [새로운 `holdsIn` 키워드](#new-holdsin-keyword), 람다 내부로 전달될 때 조건이 참이라고 가정할 수 있습니다.

이러한 개선 사항은 [실험적](components-stability.md#stability-levels-explained)입니다. 옵트인하려면 여전히 계약을 선언할 때 `@OptIn(ExperimentalContracts::class)` 주석을 사용해야 합니다. `holdsIn` 키워드와 `returnsNotNull()` 함수에도 `@OptIn(ExperimentalExtendedContracts::class)` 주석이 필요합니다.

이러한 개선 사항을 사용하려면 아래 각 섹션에 설명된 컴파일러 옵션도 추가해야 합니다.

[이슈 트래커](https://kotl.in/issue)에 피드백을 주시면 감사하겠습니다.

#### 계약 타입 어설션에서 제네릭 지원

이제 제네릭 타입에 대한 타입 어설션을 수행하는 계약을 작성할 수 있습니다:

```kotlin
import kotlin.contracts.*

sealed class Failure {
    class HttpError(val code: Int) : Failure()
    // Insert other failure types here
}

sealed class Result<out T, out F : Failure> {
    class Success<T>(val data: T) : Result<T, Nothing>()
    class Failed<F : Failure>(val failure: F) : Result<Nothing, F>()
}

@OptIn(ExperimentalContracts::class)
// Uses a contract to assert a generic type
fun <T, F : Failure> Result<T, F>.isHttpError(): Boolean {
    contract {
        returns(true) implies (this@isHttpError is Result.Failed<Failure.HttpError>)
    }
    return this is Result.Failed && this.failure is Failure.HttpError
}
```

이 예에서, 계약은 `Result` 객체에 대한 타입 어설션을 수행하여 컴파일러가 이를 어설션된 제네릭 타입으로 안전하게 [스마트 캐스트](typecasts.md#smart-casts)할 수 있도록 합니다.

이 기능은 [실험적](components-stability.md#stability-levels-explained)입니다. 옵트인하려면 `build.gradle(.kts)` 파일에 다음 컴파일러
옵션을 추가하세요:

```kotlin
kotlin {
    compilerOptions {
        freeCompilerArgs.add("-Xallow-contracts-on-more-functions")
    }
}
```

#### 프로퍼티 접근자 및 특정 연산자 함수 내부에서 계약 지원

이제 프로퍼티 접근자 및 특정 연산자 함수 내부에서 계약을 정의할 수 있습니다.
이를 통해 더 많은 종류의 선언에서 계약을 사용할 수 있어 유연성이 향상됩니다.

예를 들어, getter 내에서 계약을 사용하여 리시버 객체에 대한 스마트 캐스팅을 활성화할 수 있습니다:

```kotlin
import kotlin.contracts.*

val Any.isHelloString: Boolean
    get() {
        @OptIn(ExperimentalContracts::class)
        // Enables smart casting the receiver to String when the getter returns true
        contract { returns(true) implies (this@isHelloString is String) }
        return "hello" == this
    }

fun printIfHelloString(x: Any) {
    if (x.isHelloString) {
        // Prints the length after the smart cast of the receiver to String
        println(x.length)
        // 5
    }
}
```

또한, 다음 연산자 함수에서 계약을 사용할 수 있습니다:

*   `invoke`
*   `contains`
*   `rangeTo`, `rangeUntil`
*   `componentN`
*   `iterator`
*   `unaryPlus`, `unaryMinus`, `not`
*   `inc`, `dec`

다음은 연산자 함수에서 계약을 사용하여 람다 내부에서 변수의 초기화를 보장하는 예시입니다:

```kotlin
import kotlin.contracts.*

class Runner {
    @OptIn(ExperimentalContracts::class)
    // Enables initialization of variables assigned inside the lambda
    operator fun invoke(block: () -> Unit) {
        contract {
            callsInPlace(block, InvocationKind.EXACTLY_ONCE)
        }
        block()
    }
}

fun testOperator(runner: Runner) {
    val number: Int
    runner {
        number = 1
    }
    // Prints the value after definite initialization guaranteed by the contract
    println(number)
    // 1
}
```

이 기능은 [실험적](components-stability.md#stability-levels-explained)입니다. 옵트인하려면 `build.gradle(.kts)` 파일에 다음 컴파일러
옵션을 추가하세요:

```kotlin
kotlin {
    compilerOptions {
        freeCompilerArgs.add("-Xallow-contracts-on-more-functions")
    }
}
```

#### 계약에서 `returnsNotNull()` 함수 지원

Kotlin 2.2.20은 계약을 위한 [`returnsNotNull()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.contracts/-contract-builder/returns-not-null.html) 함수를 도입합니다.
이 함수를 사용하여 특정 조건이 충족될 때 함수가 null이 아닌 값을 반환하도록 보장할 수 있습니다.
이는 별도의 nullable 및 non-nullable 함수 오버로드를 단일하고 간결한 함수로 대체하여 코드를 단순화합니다:

```kotlin
import kotlin.contracts.*

@OptIn(ExperimentalContracts::class, ExperimentalExtendedContracts::class)
fun decode(encoded: String?): String? {
    contract {
        // Guarantees a non-null return value when the input is non-null
        (encoded != null) implies (returnsNotNull())
    }
    if (encoded == null) return null
    return java.net.URLDecoder.decode(encoded, "UTF-8")
}

fun useDecodedValue(s: String?) {
    // Uses a safe call since the return value may be null
    decode(s)?.length
    if (s != null) {
        // Treats the return value as non-null after the smart cast
        decode(s).length
    }
}
```

이 예에서 `decode()` 함수 내의 계약은 입력이 null이 아닐 때 컴파일러가 반환 값을 스마트 캐스트하도록 허용하여,
추가적인 null 검사나 여러 오버로드의 필요성을 제거합니다.

이 기능은 [실험적](components-stability.md#stability-levels-explained)입니다. 옵트인하려면 `build.gradle(.kts)` 파일에 다음 컴파일러
옵션을 추가하세요:

```kotlin
kotlin {
    compilerOptions {
        freeCompilerArgs.add("-Xallow-condition-implies-returns-contracts")
    }
}
```

#### 새로운 `holdsIn` 키워드

Kotlin 2.2.20은 계약을 위한 새로운 [`holdsIn`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.contracts/-contract-builder/holds-in.html) 키워드를 도입합니다.
이를 사용하여 특정 람다 내부에서 부울 조건이 `true`라고 가정할 수 있도록 보장합니다. 이를 통해 계약을 사용하여 조건부 스마트 캐스트가 있는 DSL을 구축할 수 있습니다.

다음은 예시입니다:

```kotlin
import kotlin.contracts.*

@OptIn(ExperimentalContracts::class, ExperimentalExtendedContracts::class)
fun <T> T.alsoIf(condition: Boolean, block: (T) -> Unit): T {
    contract {
        // Declares that the lambda runs at most once
        callsInPlace(block, InvocationKind.AT_MOST_ONCE)
        // Declares that the condition is assumed to be true inside the lambda
        condition holdsIn block
    }
    if (condition) block(this)
    return this
}

fun useApplyIf(input: Any) {
    val result = listOf(1, 2, 3)
        .first()
        .alsoIf(input is Int) {
            // The input parameter is smart cast to Int inside the lambda
            // Prints the sum of input and first list element
            println(input + it)
            // 2
        }
        .toString()
}
```

이 기능은 [실험적](components-stability.md#stability-levels-explained)입니다. 옵트인하려면 `build.gradle(.kts)` 파일에 다음 컴파일러
옵션을 추가하세요:

```kotlin
kotlin {
    compilerOptions {
        freeCompilerArgs.add("-Xallow-holdsin-contract")
    }
}
```

## Kotlin/JVM: `when` 표현식에서 `invokedynamic` 지원
<primary-label ref="experimental-opt-in"/>

Kotlin 2.2.20에서는 이제 `invokedynamic`를 사용하여 `when` 표현식을 컴파일할 수 있습니다. 이전에는 여러 타입 검사가 있는 `when` 표현식이 바이트코드에서 긴 `instanceof` 검사 체인으로 컴파일되었습니다.

이제 `when` 표현식에서 `invokedynamic`를 사용하여 Java `switch` 문에서 생성되는 바이트코드와 유사하게 더 작은 바이트코드를 생성할 수 있습니다. 다음 조건이 충족될 때:

*   `else`를 제외한 모든 조건은 `is` 또는 `null` 검사입니다.
*   표현식에 [가드 조건(`if`)](control-flow.md#guard-conditions-in-when-expressions)이 포함되어 있지 않습니다.
*   조건에 직접 타입 검사가 불가능한 타입(예: 변경 가능한 Kotlin 컬렉션(`MutableList`) 또는 함수 타입(`kotlin.Function1`, `kotlin.Function2` 등))이 포함되어 있지 않습니다.
*   `else` 외에 최소 두 개의 조건이 있습니다.
*   모든 브랜치가 `when` 표현식의 동일한 주체를 검사합니다.

예를 들어:

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

새 기능이 활성화되면 이 예시의 `when` 표현식은 여러 `instanceof` 검사 대신 단일 `invokedynamic` 타입 스위치로 컴파일됩니다.

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

이 기능은 [실험적](components-stability.md#stability-levels-explained)입니다. 이슈 트래커인 [YouTrack](https://youtrack.jetbrains.com/issue/KT-65688)에 피드백을 주시면 감사하겠습니다.

## Kotlin Multiplatform

Kotlin 2.2.20은 Kotlin Multiplatform에 중요한 변화를 도입합니다: Swift export가 기본적으로 제공되며,
새로운 공유 소스 세트가 있고, 공통 의존성을 관리하는 새로운 접근 방식을 시도할 수 있습니다.

### Swift export가 기본적으로 제공
<primary-label ref="experimental-general"/>

Kotlin 2.2.20은 Swift export에 대한 실험적 지원을 도입합니다. 이를 통해 Kotlin 소스를 직접 내보내고
Swift에서 Kotlin 코드를 관용적으로 호출할 수 있어 Objective-C 헤더의 필요성이 사라집니다.

이는 Apple 타겟을 위한 멀티플랫폼 개발을 크게 개선해야 합니다. 예를 들어, 최상위 함수가 있는 Kotlin 모듈이 있는 경우, Swift export는 혼란스러운 Objective-C 밑줄과 망글링된 이름을 제거하여 깔끔한 모듈별 임포트를 가능하게 합니다.

주요 기능은 다음과 같습니다:

*   **다중 모듈 지원**. 각 Kotlin 모듈은 별도의 Swift 모듈로 내보내져 함수 호출을 단순화합니다.
*   **패키지 지원**. Kotlin 패키지는 내보내기 동안 명시적으로 보존되어 생성된 Swift 코드에서 이름 충돌을 방지합니다.
*   **타입 별칭**. Kotlin 타입 별칭은 내보내지고 Swift에서 보존되어 가독성을 향상시킵니다.
*   **기본 타입에 대한 향상된 널 허용성**. `Int?`와 같은 타입을 `KotlinInt`와 같은 래퍼 클래스에 박싱하여 널 허용성을 보존해야 했던 Objective-C 상호 운용성과 달리, Swift export는 널 허용성 정보를 직접 변환합니다.
*   **오버로드**. Swift에서 Kotlin의 오버로드된 함수를 모호성 없이 호출할 수 있습니다.
*   **평탄화된 패키지 구조**. Kotlin 패키지를 Swift 열거형으로 변환하여 생성된 Swift 코드에서 패키지 접두사를 제거할 수 있습니다.
*   **모듈 이름 사용자 정의**. Kotlin 프로젝트의 Gradle 구성에서 결과 Swift 모듈 이름을 사용자 정의할 수 있습니다.

#### Swift export를 활성화하는 방법

이 기능은 현재 [실험적](components-stability.md#stability-levels-explained)이며 [직접 통합](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-direct-integration.html)을 사용하는 프로젝트에서만 작동합니다.
이는 iOS 프레임워크를 Xcode 프로젝트에 연결하는 표준 구성입니다. 이는 IntelliJ IDEA의 Kotlin Multiplatform 플러그인 또는 [웹 마법사](https://kmp.jetbrains.com/)를 통해 생성된 멀티플랫폼 프로젝트의 표준 구성입니다.

Swift export를 사용해 보려면 Xcode 프로젝트를 다음과 같이 구성하세요:

1.  Xcode에서 프로젝트 설정을 엽니다.
2.  **Build Phases** 탭에서 `embedAndSignAppleFrameworkForXcode` 태스크가 있는 **Run Script** 단계를 찾습니다.
3.  스크립트를 조정하여 run script 단계에서 `embedSwiftExportForXcode` 태스크를 사용하도록 합니다:

   ```bash
   ./gradlew :<Shared module name>:embedSwiftExportForXcode
   ```

   ![Swift export 스크립트 추가](xcode-swift-export-run-script-phase.png){width=700}

4.  프로젝트를 빌드합니다. Swift 모듈은 빌드 출력 디렉토리에 생성됩니다.

이 기능은 기본적으로 제공됩니다. 이전 릴리스에서 이미 이 기능을 활성화했다면, 이제 `gradle.properties` 파일에서 `kotlin.experimental.swift-export.enabled`를 제거할 수 있습니다.

> 시간을 절약하려면 Swift export가 이미 설정된 [공개 샘플](https://github.com/Kotlin/swift-export-sample)을 복제하세요.
>
{style="tip"}

Swift export에 대한 자세한 내용은 [문서](native-swift-export.md)를 참조하세요.

#### 피드백 남기기

향후 Kotlin 릴리스에서 Swift export 지원을 확장하고 점진적으로 안정화할 계획입니다.
Kotlin 2.2.20 이후에는 특히 코루틴(coroutines)과 플로우(flows) 주변의 Kotlin과 Swift 간 상호 운용성을 개선하는 데 중점을 둘 것입니다.

Swift export 지원은 Kotlin Multiplatform에 상당한 변화입니다. 여러분의 피드백을 주시면 감사하겠습니다:

*   Kotlin Slack에서 개발팀에 직접 문의하세요 – [초대 받기](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up?_gl=1*ju6cbn*_ga*MTA3MTk5NDkzMC4xNjQ2MDY3MDU4*_ga_9J976DJZ68*MTY1ODMzNzA3OS4xMDAuMS4xNjU4MzQwODEwLjYw) 및 [#swift-export](https://kotlinlang.slack.com/archives/C073GUW6WN9) 채널에 참여하세요.
*   Swift export와 관련하여 발생하는 모든 문제점은 [YouTrack](https://kotl.in/issue)에 보고해 주세요.

### `js` 및 `wasmJs` 타겟을 위한 공유 소스 세트

이전에는 Kotlin Multiplatform이 JavaScript (`js`) 및 WebAssembly (`wasmJs`) 웹 타겟을 위한 공유 소스 세트를 기본적으로 포함하지 않았습니다.
`js`와 `wasmJs` 간에 코드를 공유하려면 수동으로 사용자 지정 소스 세트를 구성하거나 두 곳에 코드를 작성해야 했습니다.
하나는 `js`용, 다른 하나는 `wasmJs`용으로 말입니다. 예를 들어:

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

이번 릴리스부터 Kotlin Gradle 플러그인은 [기본 계층 템플릿](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-hierarchy.html#default-hierarchy-template)을 사용할 때 웹을 위한 새로운 공유 소스 세트(`webMain` 및 `webTest`로 구성)를 추가합니다.

이 변경으로 `web` 소스 세트는 `js` 및 `wasmJs` 소스 세트 모두의 부모가 됩니다. 업데이트된 소스 세트
계층 구조는 다음과 같습니다:

![웹과 함께 기본 계층 템플릿을 사용하는 예시](default-hierarchy-example-with-web.svg)

새로운 소스 세트는 `js` 및 `wasmJs` 타겟 모두를 위해 하나의 코드를 작성할 수 있도록 합니다.
공유 코드를 `webMain`에 넣어두면 자동으로 두 타겟 모두에서 작동합니다:

```kotlin
// commonMain
expect suspend fun readCopiedText(): String

// webMain
external interface Navigator { val clipboard: Clipboard }
external interface Clipboard { fun readText(): Promise<JsString> }
external val navigator: Navigator

actual suspend fun readCopiedText(): String {
    return navigator.clipboard.readText().await().toString()
}
```

이 업데이트는 `js` 및 `wasmJs` 타겟 간의 코드 공유를 단순화합니다. 특히 다음 두 가지 경우에 유용합니다:

*   라이브러리 작성자이고, 코드 중복 없이 `js` 및 `wasmJs` 타겟을 모두 지원하려는 경우.
*   웹을 타겟으로 하는 Compose Multiplatform 애플리케이션을 개발하고 있으며, 더 넓은 브라우저 호환성을 위해 `js` 및 `wasmJs` 타겟 모두에 대해 크로스 컴파일을 활성화하는 경우. 이 폴백(fallback) 모드를 통해 웹 사이트를 만들 때 최신 브라우저는 `wasmJs`를 사용하고 이전 브라우저는 `js`를 사용하므로 모든 브라우저에서 즉시 작동합니다.

이 기능을 사용하려면 `build.gradle(.kts)` 파일의 `kotlin {}` 블록에서 [기본 계층 템플릿](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-hierarchy.html#default-hierarchy-template)을 사용하세요:

```kotlin
kotlin {
    js()
    wasmJs()

    // Enables the default source set hierarchy, including webMain and webTest
    applyDefaultHierarchyTemplate()
}
```

기본 계층 구조를 사용하기 전에, 사용자 정의 공유 소스 세트가 있거나 `js("web")` 타겟 이름을 변경한 프로젝트가 있는 경우 발생할 수 있는 잠재적 충돌을 신중하게 고려하세요. 이러한 충돌을 해결하려면 충돌하는 소스 세트 또는 타겟 이름을 변경하거나 기본 계층 구조를 사용하지 마세요.

### Kotlin 라이브러리를 위한 안정적인 크로스 플랫폼 컴파일

Kotlin 2.2.20은 중요한 [로드맵 항목](https://youtrack.jetbrains.com/issue/KT-71290)을 완료하여
Kotlin 라이브러리를 위한 크로스 플랫폼 컴파일을 안정화합니다.

이제 어떤 호스트를 사용해서든 Kotlin 라이브러리 게시를 위한 `.klib` 아티팩트를 생성할 수 있습니다. 이는 특히 이전에 Mac 머신이 필요했던 Apple 타겟의 게시 프로세스를 크게 간소화합니다.

이 기능은 기본적으로 제공됩니다. `kotlin.native.enableKlibsCrossCompilation=true`로 크로스 컴파일을 이미 활성화했다면,
이제 `gradle.properties` 파일에서 제거할 수 있습니다.

안타깝게도, 몇 가지 제한 사항이 여전히 존재합니다. 다음 경우에는 여전히 Mac 머신을 사용해야 합니다:

*   라이브러리 또는 종속 모듈에 [cinterop 종속성](native-c-interop.md)이 있는 경우.
*   프로젝트에 [CocoaPods 통합](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-cocoapods-overview.html)이 설정되어 있는 경우.
*   Apple 타겟을 위한 [최종 바이너리](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-build-native-binaries.html)를 빌드하거나 테스트해야 하는 경우.

멀티플랫폼 라이브러리 게시와 관련한 자세한 내용은 [문서](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-publish-lib-setup.html)를 참조하세요.

### 공통 의존성을 선언하는 새로운 접근 방식
<primary-label ref="experimental-opt-in"/>

Gradle을 사용하여 멀티플랫폼 프로젝트 설정을 단순화하기 위해, Kotlin 2.2.20은 이제 Gradle 8.8 이상을 사용할 때 최상위 `dependencies {}` 블록을 사용하여 `kotlin {}` 블록에서 공통 의존성을 선언할 수 있도록 합니다.
이러한 의존성은 `commonMain` 소스 세트에서 선언된 것처럼 작동합니다. 이 기능은 Kotlin/JVM 및 Android 전용 프로젝트에 사용하는 `dependencies` 블록과 유사하게 작동하며, 이제 Kotlin Multiplatform에서 [실험적](components-stability.md#stability-levels-explained)입니다.

프로젝트 수준에서 공통 의존성을 선언하면 소스 세트 전반의 반복적인 구성을 줄이고 빌드 설정을 간소화하는 데 도움이 됩니다. 필요에 따라 각 소스 세트에 플랫폼별 의존성을 계속 추가할 수 있습니다.

이 기능을 사용하려면 최상위 `dependencies {}` 블록 앞에 `@OptIn(ExperimentalKotlinGradlePluginApi::class)` 주석을 추가하여 옵트인해야 합니다. 예를 들어:

```kotlin
kotlin {
    @OptIn(ExperimentalKotlinGradlePluginApi::class)
    dependencies {
        implementation("org.jetbrains.kotlinx:kotlinx-coroutines-core:%coroutinesVersion%")
    }
}
```

이 기능에 대한 여러분의 피드백을 [YouTrack](https://youtrack.jetbrains.com/issue/KT-76446)에 주시면 감사하겠습니다.

### 의존성의 타겟 지원에 대한 새로운 진단 기능

Kotlin 2.2.20 이전에는 빌드 스크립트의 의존성이 소스 세트에서 요구하는 모든 타겟을 지원하지 않으면,
Gradle에서 생성되는 오류 메시지로 인해 문제를 파악하기 어려웠습니다.

Kotlin 2.2.20은 각 의존성이 어떤 타겟을 지원하고 어떤 타겟을 지원하지 않는지 명확하게 보여주는 새로운 진단 기능을 도입합니다.

이 진단 기능은 기본적으로 활성화되어 있습니다. 어떤 이유로든 이 기능을 비활성화해야 하는 경우, [YouTrack 이슈](https://kotl.in/kmp-dependencies-diagnostic-issue)에 의견을 남겨 알려주세요.
`gradle.properties` 파일에서 다음 Gradle 속성을 사용하여 진단 기능을 비활성화할 수 있습니다:

| 속성                                                     | 설명                                                           |
|:---------------------------------------------------------|:---------------------------------------------------------------|
| `kotlin.kmp.eagerUnresolvedDependenciesDiagnostic=false` | 메타데이터 컴파일 및 임포트에 대해서만 진단 실행                 |
| `kotlin.kmp.unresolvedDependenciesDiagnostic=false`      | 진단을 완전히 비활성화                                           |

## Kotlin/Native

Kotlin 2.2.20은 Objective-C/Swift와의 상호 운용성, 디버깅, 그리고 새로운 바이너리 옵션에 대한 개선 사항을 제공합니다.

### 바이너리에서 스택 카나리(stack canaries) 지원

Kotlin 2.2.20부터 Kotlin은 결과 Kotlin/Native 바이너리에서 스택 카나리(stack canaries) 지원을 추가합니다. 스택 보호의 일환으로, 이 보안 기능은 스택 스매싱(stack smashing)을 방지하여 일부 일반적인 애플리케이션 취약점을 완화합니다.
이미 Swift 및 Objective-C에서 사용할 수 있었던 이 기능은 이제 Kotlin에서도 지원됩니다.

Kotlin/Native에서 스택 보호 구현은 [Clang](https://clang.llvm.org/docs/ClangCommandLineReference.html#cmdoption-clang-fstack-protector)의 스택 보호기(stack protector) 동작을 따릅니다.

스택 카나리를 활성화하려면 `gradle.properties` 파일에 다음 [바이너리 옵션](native-binary-options.md)을 추가하세요:

```none
kotlin.native.binary.stackProtector=yes
```

이 속성은 스택 스매싱에 취약한 모든 Kotlin 함수에 대해 이 기능을 활성화합니다. 대체 모드는 다음과 같습니다:

*   `kotlin.native.binary.stackProtector=strong`: 스택 스매싱에 취약한 함수에 대해 더 강력한 휴리스틱(heuristic)을 사용합니다.
*   `kotlin.native.binary.stackProtector=all`: 모든 함수에 대해 스택 보호기를 활성화합니다.

일부 경우 스택 보호 기능이 성능 비용을 수반할 수 있다는 점에 유의하세요.

### 릴리스 바이너리의 바이너리 크기 축소
<primary-label ref="experimental-opt-in"/>

Kotlin 2.2.20은 릴리스 바이너리의 크기를 줄이는 데 도움이 되는 `smallBinary` 옵션을 도입합니다.
새로운 옵션은 LLVM 컴파일 단계에서 컴파일러의 기본 최적화 인수로 효과적으로 `-Oz`를 설정합니다.

`smallBinary` 옵션을 활성화하면 릴리스 바이너리를 더 작게 만들고 빌드 시간을 개선할 수 있습니다. 그러나 일부 경우 런타임 성능에 영향을 미칠 수 있습니다.

새 기능은 현재 [실험적](components-stability.md#stability-levels-explained)입니다. 프로젝트에서 사용해 보려면
`gradle.properties` 파일에 다음 [바이너리 옵션](native-binary-options.md)을 추가하세요:

```none
kotlin.native.binary.smallBinary=true
```

Kotlin 팀은 이 기능 구현에 도움을 준 [Troels Lund](https://github.com/troelsbjerre)에게 감사드립니다.

### 디버거 객체 요약 개선

Kotlin/Native는 이제 LLDB 및 GDB와 같은 디버거 도구를 위해 더 명확한 객체 요약을 생성합니다. 이는 생성된 디버그 정보의 가독성을 향상시키고 디버깅 경험을 간소화합니다.

예를 들어 다음 객체를 고려해 보세요:

```kotlin
class Point(val x: Int, val y: Int)
val point = Point(1, 2)
```

이전에는 검사 시 객체의 메모리 주소에 대한 포인터를 포함하여 제한된 정보만 표시되었습니다:

```none
(lldb) v point
(ObjHeader *) point = [x: ..., y: ...]
(lldb) v point->x
(int32_t *) x = 0x0000000100274048
```

Kotlin 2.2.20부터는 디버거가 실제 값을 포함하여 더 풍부한 세부 정보를 표시합니다:

```none
(lldb) v point
(ObjHeader *) point = Point(x=1, y=2)
(lldb) v point->x
(int32_t) point->x = 1
```

Kotlin 팀은 이 기능 구현에 도움을 준 [Nikita Nazarov](https://github.com/nikita-nazarov)에게 감사드립니다.

Kotlin/Native 디버깅에 대한 자세한 내용은 [문서](native-debugging.md)를 참조하세요.

### Objective-C 헤더의 블록 타입에 명시적 이름 지정

Kotlin 2.2.20은 Kotlin/Native 프로젝트에서 내보낸 Objective-C 헤더의 Kotlin 함수 타입에 명시적 매개변수 이름을 추가하는 옵션을 도입합니다. 매개변수 이름은 Xcode에서 자동 완성 제안을 개선하고 Clang 경고를 방지하는 데 도움이 됩니다.

이전에는 생성된 Objective-C 헤더에서 블록 타입의 매개변수 이름이 생략되었습니다. 이러한 경우 Xcode의 자동 완성 기능은 Objective-C 블록에서 매개변수 이름 없이 해당 함수를 호출하도록 제안했습니다. 생성된 블록은 Clang 경고를 트리거했습니다.

예를 들어, 다음 Kotlin 코드의 경우:

```kotlin
// Kotlin:
fun greetUser(block: (name: String) -> Unit) = block("John")
```

생성된 Objective-C 헤더에는 매개변수 이름이 없었습니다:

```objc
// Objective-C:
+ (void)greetUserBlock:(void (^)(NSString *))block __attribute__((swift_name("greetUser(block:)")));
```

따라서 Xcode에서 Objective-C의 `greetUserBlock()` 함수를 호출할 때 IDE는 다음과 같이 제안했습니다:

```objc
// Objective-C:
greetUserBlock:^(NSString *) {
    // ...
};
```

제안에서 매개변수 이름 `(NSString *)`이 누락되어 Clang 경고가 발생했습니다.

새로운 옵션을 사용하면 Kotlin은 Kotlin 함수 타입의 매개변수 이름을 Objective-C 블록 타입으로 전달하므로 Xcode는 이를 제안에 사용합니다:

```objc
// Objective-C:
greetUserBlock:^(NSString *name) {
    // ...
};
```

명시적 매개변수 이름을 활성화하려면 `gradle.properties` 파일에 다음 [바이너리 옵션](native-binary-options.md)을 추가하세요:

```none
kotlin.native.binary.objcExportBlockExplicitParameterNames=true
```

Kotlin 팀은 이 기능 구현에 도움을 준 [Yijie Jiang](https://github.com/edisongz)에게 감사드립니다.

### Kotlin/Native 배포판 크기 축소

Kotlin/Native 배포판에는 이전에 컴파일러 코드와 함께 두 개의 JAR 파일이 포함되어 있었습니다:

*   `konan/lib/kotlin-native.jar`
*   `konan/lib/kotlin-native-compiler-embeddable.jar`.

Kotlin 2.2.20부터 `kotlin-native.jar`는 더 이상 게시되지 않습니다.

제거된 JAR 파일은 더 이상 필요 없는 임베더블 컴파일러의 레거시 버전입니다. 이 변경으로 배포판 크기가 크게 줄어듭니다.

결과적으로 다음 옵션은 이제 사용 중단 및 제거되었습니다:

*   `kotlin.native.useEmbeddableCompilerJar=false` Gradle 속성. 대신, 임베더블 컴파일러 JAR 파일은 Kotlin/Native 프로젝트에 항상 사용됩니다.
*   `KotlinCompilerPluginSupportPlugin.getPluginArtifactForNative()` 함수. 대신, [`getPluginArtifact()`](https://kotlinlang.org/api/kotlin-gradle-plugin/kotlin-gradle-plugin-api/org.jetbrains.kotlin.gradle.plugin/-kotlin-compiler-plugin-support-plugin/get-plugin-artifact.html) 함수가 항상 사용됩니다.

자세한 내용은 [YouTrack 이슈](https://kotl.in/KT-51301)를 참조하세요.

### KDoc을 Objective-C 헤더로 기본 내보내기

이제 Kotlin/Native 최종 바이너리 컴파일 시 Objective-C 헤더를 생성할 때 [KDoc](kotlin-doc.md) 주석이 기본적으로 내보내집니다.

이전에는 빌드 파일에 `-Xexport-kdoc` 옵션을 수동으로 추가해야 했습니다. 이제는 컴파일 태스크에 자동으로 전달됩니다.

이 옵션은 KDoc 주석을 klibs에 포함하고 Apple 프레임워크를 생성할 때 klibs에서 주석을 추출합니다. 결과적으로,
클래스 및 메서드에 대한 주석이 Xcode와 같은 자동 완성 시 나타납니다.

`binaries {}` 블록에서 생성된 Apple 프레임워크로 KDoc 주석을 내보내는 것을 비활성화할 수 있습니다.
`build.gradle(.kts)` 파일:

```kotlin
import org.jetbrains.kotlin.gradle.ExperimentalKotlinGradlePluginApi

kotlin {
    iosArm64 {
        binaries {
            framework {
                baseName = "sdk"
                @OptIn(ExperimentalKotlinGradlePluginApi::class)
                exportKdoc.set(false)
            }
        }
    }
}
```

자세한 내용은 [문서](native-objc-interop.md#provide-documentation-with-kdoc-comments)를 참조하세요.

### `x86_64` Apple 타겟 사용 중단

Apple은 몇 년 전부터 Intel 칩이 장착된 장치 생산을 중단했으며 [최근에](https://www.youtube.com/live/51iONeETSng?t=3288s)
macOS Tahoe 26이 Intel 기반 아키텍처를 지원하는 마지막 OS 버전이 될 것이라고 발표했습니다.

이로 인해 빌드 에이전트에서 이러한 타겟을 제대로 테스트하기가 점점 더 어려워지고 있으며, 특히 macOS 26과 함께 제공되는 지원 Xcode 버전을 업데이트할 향후 Kotlin 릴리스에서는 더욱 그렇습니다.

Kotlin 2.2.20부터 `macosX64` 및 `iosX64` 타겟은 지원 계층 2로 강등됩니다. 즉, 타겟이 컴파일되는지 확인하기 위해 CI에서 정기적으로 테스트되지만, 실행되는지 확인하기 위해 자동으로 테스트되지 않을 수 있습니다.

Kotlin 2.2.20-2.4.0 릴리스 주기 동안 모든 `x86_64` Apple 타겟을 점진적으로 사용 중단하고 궁극적으로 지원을 제거할 계획입니다. 여기에는 다음 타겟이 포함됩니다:

*   `macosX64`
*   `iosX64`
*   `tvosX64`
*   `watchosX64`

지원 계층에 대한 자세한 내용은 [Kotlin/Native 타겟 지원](native-target-support.md)을 참조하세요.

## Kotlin/Wasm

Kotlin/Wasm은 이제 베타 버전으로, 분리된 npm 의존성,
[JavaScript 상호 운용성을 위한 정교한 예외 처리](#improved-exception-handling-in-kotlin-wasm-and-javascript-interop),
[내장 브라우저 디버깅 지원](#support-for-debugging-in-browsers-without-configuration) 등과 같은 개선 사항과 함께 더 큰 안정성을 제공합니다.

### 분리된 npm 의존성

이전에는 Kotlin/Wasm 프로젝트에서 모든 [npm](https://www.npmjs.com/) 의존성이 프로젝트 폴더에 함께 설치되었습니다.
여기에는 Kotlin 툴링 의존성과 여러분 자신의 의존성이 모두 포함되었습니다. 또한 프로젝트의 잠금 파일
(`package-lock.json` 또는 `yarn.lock`)에도 함께 기록되었습니다.

그 결과, Kotlin 툴링 의존성이 업데이트될 때마다 새로운 것을 추가하거나 변경하지 않았더라도 잠금 파일을 업데이트해야 했습니다.

Kotlin 2.2.20부터 Kotlin 툴링 npm 의존성은 프로젝트 외부에서 설치됩니다. 이제
툴링과 사용자(user) 의존성은 별도의 디렉토리를 가집니다:

*   **툴링 의존성 디렉토리:**

    `<kotlin-user-home>/kotlin-npm-tooling/<yarn|npm>/hash/node_modules`

*   **사용자 의존성 디렉토리:**

    `build/wasm/node_modules`

또한 프로젝트 디렉토리 내부의 잠금 파일에는 사용자 정의 의존성만 포함됩니다.

이 개선 사항은 잠금 파일이 사용자 자신의 의존성에만 집중하도록 하고, 더 깔끔한 프로젝트를 유지하며,
파일에 불필요한 변경을 줄이는 데 도움이 됩니다.

이 변경 사항은 `wasm-js` 타겟에 대해 기본적으로 활성화됩니다. `js` 타겟에 대해서는 아직 구현되지 않았습니다.
향후 릴리스에서 구현될 예정이지만, Kotlin 2.2.20에서는 `js` 타겟의 npm 의존성 동작이 이전과 동일하게 유지됩니다.

### Kotlin/Wasm 및 JavaScript 상호 운용성에서 예외 처리 개선

이전에는 Kotlin이 JavaScript(JS)에서 발생하여 Kotlin/Wasm 코드로 넘어오는 예외(오류)를 이해하는 데 어려움이 있었습니다.

어떤 경우에는 예외가 Wasm 코드를 통해 JS로 전달되거나 발생하여 아무런 세부 정보 없이 `WebAssembly.Exception`으로 래핑되는 경우도 있었습니다. 이러한 Kotlin 예외 처리 문제는 디버깅을 어렵게 만들었습니다.

Kotlin 2.2.20부터는 예외에 대한 개발자 경험이 양방향으로 개선됩니다:

*   JS에서 예외가 발생할 때 Kotlin 측에서 더 많은 정보를 볼 수 있습니다.
    이러한 예외가 Kotlin을 통해 다시 JS로 전파될 때 더 이상 WebAssembly로 래핑되지 않습니다.
*   Kotlin에서 예외가 발생할 때 이제 JS 측에서 JS 오류로 잡을 수 있습니다.

새로운 예외 처리는 [`WebAssembly.JSTag`](https://webassembly.github.io/exception-handling/js-api/#dom-webassembly-jstag)
기능을 지원하는 최신 브라우저에서 자동으로 작동합니다:

*   Chrome 115+
*   Firefox 129+
*   Safari 18.4+

이전 브라우저에서는 예외 처리 동작이 변경되지 않습니다.

### 구성 없이 브라우저에서 디버깅 지원

이전에는 브라우저가 디버깅에 필요한 Kotlin/Wasm 프로젝트 소스에 자동으로 액세스할 수 없었습니다.
브라우저에서 Kotlin/Wasm 애플리케이션을 디버깅하려면 `build.gradle(.kts)` 파일에 다음 스니펫을 추가하여 이러한 소스를 제공하도록 빌드를 수동으로 구성해야 했습니다:

```kotlin
devServer = (devServer ?: KotlinWebpackConfig.DevServer()).apply {
    static = (static ?: mutableListOf()).apply {
        add(project.rootDir.path)
    }
}
```

Kotlin 2.2.20부터는 [최신 브라우저](wasm-configuration.md#browser-versions)에서 애플리케이션을 디버깅하는 것이 바로 가능합니다.
Gradle 개발 태스크(`*DevRun`)를 실행하면 Kotlin이 자동으로 소스 파일을 브라우저에 제공하므로, 추가 설정 없이 중단점을 설정하고 변수를 검사하며 Kotlin 코드를 단계별로 실행할 수 있습니다.

이 변경은 수동 구성의 필요성을 제거하여 디버깅을 단순화합니다. 필요한 구성은 이제 Kotlin Gradle 플러그인에 포함됩니다. 이전에 `build.gradle(.kts)` 파일에 이 구성을 추가했다면, 충돌을 피하기 위해 제거해야 합니다.

브라우저 디버깅은 모든 Gradle `*DevRun` 태스크에 대해 기본적으로 활성화되어 있습니다. 이러한 태스크는 애플리케이션뿐만 아니라 해당 소스 파일도 제공하므로, 로컬 개발에만 사용하고 소스가 공개적으로 노출될 수 있는 클라우드 또는 프로덕션 환경에서는 실행하지 마세요.

#### 디버깅 중 반복적인 새로고침 처리

기본적으로 소스를 제공하면 [Kotlin 컴파일 및 번들링이 완료되기 전에 브라우저에서 애플리케이션이 반복적으로 새로고침될 수 있습니다](https://youtrack.jetbrains.com/issue/KT-80582/Multiple-reloads-when-using-webpack-dev-server-after-2.2.20-Beta2#focus=Comments-27-12596427.0-0).
임시 해결책으로, webpack 구성을 조정하여 Kotlin 소스 파일을 무시하고 제공되는 정적 파일에 대한 감시를 비활성화하세요.
프로젝트 루트의 `webpack.config.d` 디렉토리에 다음 내용이 포함된 `.js` 파일을 추가합니다:

```kotlin
config.watchOptions = config.watchOptions || {
    ignored: ["**/*.kt", "**/node_modules"]
}

if (config.devServer) {
    config.devServer.static = config.devServer.static.map(file => {
        if (typeof file === "string") {
        return { directory: file,
                 watch: false,
        }
    } else {
        return file
    }
    })
}
```

### 빈 `yarn.lock` 파일 제거

이전에는 Kotlin Gradle 플러그인(KGP)이 Kotlin 툴체인에 필요한 npm 패키지 정보와 프로젝트 또는 사용된 라이브러리에서 가져온 기존 [npm](https://www.npmjs.com/) 의존성을 포함하는 `yarn.lock` 파일을 자동으로 생성했습니다.

이제 KGP는 툴체인 의존성을 별도로 관리하며, 프로젝트에 npm 의존성이 없는 한 프로젝트 수준의 `yarn.lock` 파일은 더 이상 생성되지 않습니다.

KGP는 npm 의존성이 추가될 때 `yarn.lock` 파일을 자동으로 생성하고, npm 의존성이 제거될 때 `yarn.lock` 파일을 삭제합니다.

이 변경은 프로젝트 구조를 정리하고 실제 npm 의존성이 언제 도입되는지 추적하기 쉽게 만듭니다.

이 동작을 구성하기 위한 추가 단계는 필요 없습니다. Kotlin 2.2.20부터 Kotlin/Wasm 프로젝트에 기본적으로 적용됩니다.

### 완전 정규화된 클래스 이름에서 새 컴파일러 오류

Kotlin/Wasm에서는 컴파일러가 기본적으로 생성된 바이너리에 클래스의 완전 정규화된 이름(FQN)을 저장하지 않습니다.
이 접근 방식은 애플리케이션 크기가 증가하는 것을 방지합니다.

그 결과, 이전 Kotlin 릴리스에서는 `KClass::qualifiedName` 속성을 호출하면 클래스의 완전 정규화된 이름 대신 빈 문자열이 반환되었습니다.

Kotlin 2.2.20부터는 완전 정규화된 이름 기능을 명시적으로 활성화하지 않는 한, Kotlin/Wasm 프로젝트에서 `KClass::qualifiedName` 속성을 사용할 때 컴파일러가 오류를 보고합니다.

이 변경은 `qualifiedName` 속성을 호출할 때 예상치 못한 빈 문자열을 방지하고 컴파일 시 문제를 잡아냄으로써 개발자 경험을 향상시킵니다.

진단 기능은 기본적으로 활성화되어 있으며 오류가 자동으로 보고됩니다. 진단 기능을 비활성화하고 Kotlin/Wasm에서 FQN 저장을 허용하려면, `build.gradle(.kts)` 파일에 다음 옵션을 추가하여 모든 클래스에 대한 완전 정규화된 이름을 저장하도록 컴파일러에 지시하세요:

```kotlin
kotlin {
    wasmJs {
        ...
        compilerOptions {
            freeCompilerArgs.add("-Xwasm-kclass-fqn")
        }
    }
}
```

> 이 옵션을 활성화하면 애플리케이션 크기가 증가한다는 점에 유의하세요.
>
{style="note"}

## Kotlin/JS

Kotlin 2.2.20은 Kotlin의 `Long` 타입을 나타내기 위해 `BigInt` 타입 사용을 지원하여 내보내진 선언에서 `Long`을 사용할 수 있도록 합니다. 또한, 이번 릴리스에서는 Node.js 인수를 정리하기 위한 DSL 함수를 추가합니다.

### Kotlin의 `Long` 타입을 나타내기 위해 `BigInt` 타입 사용
<primary-label ref="experimental-opt-in"/>

ES2020 표준 이전에는 JavaScript(JS)가 53비트보다 큰 정밀 정수를 위한
기본 타입을 지원하지 않았습니다.

이러한 이유로 Kotlin/JS는 `Long` 값(64비트 너비)을 두 개의 `number` 속성을 포함하는 JavaScript 객체로
나타냈습니다. 이 사용자 정의 구현은 Kotlin과 JavaScript 간의 상호 운용성을 더 복잡하게 만들었습니다.

Kotlin 2.2.20부터 Kotlin/JS는 이제 현대 JavaScript(ES2020)로 컴파일할 때 Kotlin의 `Long` 값을 나타내기 위해
JavaScript의 내장 `BigInt` 타입을 사용합니다.

이 변경으로 [내보내진 선언에서 `Long` 타입 내보내기](#usage-of-long-in-exported-declarations)가 가능해졌으며, 이는 Kotlin 2.2.20에서 도입된 기능입니다.
그 결과, 이 변경은 Kotlin과 JavaScript 간의 상호 운용성을 단순화합니다.

이를 활성화하려면 `build.gradle(.kts)` 파일에 다음 컴파일러 옵션을 추가해야 합니다:

```kotlin
kotlin {
    js {
        ...
        compilerOptions {
            freeCompilerArgs.add("-Xes-long-as-bigint")
        }
    }
}
```

이 기능은 [실험적](components-stability.md#stability-levels-explained)입니다. 이슈 트래커인 [YouTrack](https://youtrack.jetbrains.com/issue/KT-57128)에 피드백을 주시면 감사하겠습니다.

#### 내보내진 선언에서 `Long` 사용

Kotlin/JS는 사용자 정의 `Long` 표현을 사용했기 때문에 JavaScript에서 Kotlin의 `Long`과 상호 작용하는 간단한 방법을 제공하기 어려웠습니다.
결과적으로 `Long` 타입을 사용하는 Kotlin 코드를 JavaScript로 내보낼 수 없었습니다. 이 문제는 함수 매개변수, 클래스 프로퍼티 또는 생성자와 같이 `Long`을 사용하는 모든 코드에 영향을 미쳤습니다.

이제 Kotlin의 `Long` 타입이 JavaScript의 `BigInt` 타입으로 컴파일될 수 있으므로, Kotlin/JS는 `Long` 값을 JavaScript로 내보내는 것을 지원하여 Kotlin과 JavaScript 코드 간의 상호 운용성을 단순화합니다.

이 기능을 활성화하려면:

1.  `build.gradle(.kts)` 파일의 `freeCompilerArgs` 속성에 다음 컴파일러 옵션을 추가하여 Kotlin/JS에서 `Long` 내보내기를 허용하세요:

    ```kotlin
    kotlin {
        js {
            ...
            compilerOptions {
                freeCompilerArgs.add("-XXLanguage:+JsAllowLongInExportedDeclarations")
            }
        }
    }
    ```

2.  `BigInt` 타입을 활성화하세요. [Kotlin의 `Long` 타입을 나타내기 위해 `BigInt` 타입 사용](#usage-of-the-bigint-type-to-represent-kotlin-s-long-type)에서 활성화 방법을 참조하세요.

### 더 깔끔한 인수를 위한 새로운 DSL 함수

Node.js로 Kotlin/JS 애플리케이션을 실행할 때, 프로그램에 전달되는 인수(`args`)에는 다음이 포함되었습니다:

*   실행 파일 `Node`의 경로.
*   스크립트의 경로.
*   제공한 실제 명령줄 인수.

그러나 `args`에 대해 예상되는 동작은 명령줄 인수만 포함하는 것이었습니다. 이를 달성하려면 `build.gradle(.kts)` 파일 또는 Kotlin 코드에서 `drop()` 함수를 사용하여 처음 두 인수를 수동으로 건너뛰어야 했습니다:

```kotlin
fun main(args: Array<String>) {
    println(args.drop(2).joinToString(", "))
}
```

이 해결 방법은 반복적이고 오류가 발생하기 쉬웠으며 플랫폼 간 코드 공유에 잘 작동하지 않았습니다.

이 문제를 해결하기 위해 Kotlin 2.2.20은 `passCliArgumentsToMainFunction()`이라는 새로운 DSL 함수를 도입합니다.

이 함수를 사용하면 `Node` 및 스크립트 경로는 제외되고 명령줄 인수만 포함됩니다:

```kotlin
fun main(args: Array<String>) {
    // No need for drop() and only your custom arguments are included
    println(args.joinToString(", "))
}
```

이 변경은 상용구 코드를 줄이고, 인수를 수동으로 삭제하여 발생하는 실수를 방지하며, 플랫폼 간 호환성을 개선합니다.

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

## Gradle

Kotlin 2.2.20은 Gradle 빌드 보고서의 Kotlin/Native 태스크에 대한 새로운 컴파일러 성능 메트릭을 추가하고 증분 컴파일의 사용 편의성을 개선합니다.

### Kotlin/Native 태스크에 대한 빌드 보고서의 새로운 컴파일러 성능 메트릭

Kotlin 1.7.0에서는 컴파일러 성능 추적에 도움이 되는 [빌드 보고서](gradle-compilation-and-caches.md#build-reports)를 도입했습니다. 그 이후로 이러한 보고서를 더욱 상세하고 성능 문제 조사에 유용하게 만들기 위해 더 많은 메트릭을 추가했습니다.

Kotlin 2.2.20에서는 빌드 보고서에 이제 Kotlin/Native 태스크에 대한 컴파일러 성능 메트릭이 포함됩니다.

빌드 보고서 및 구성 방법에 대한 자세한 내용은 [빌드 보고서 활성화](gradle-compilation-and-caches.md#enabling-build-reports)를 참조하세요.

### Kotlin/JVM을 위한 개선된 증분 컴파일 미리보기
<primary-label ref="experimental-general"/>

Kotlin 2.0.0은 최적화된 프론트엔드를 갖춘 새로운 K2 컴파일러를 도입했습니다. Kotlin 2.2.20은 이 기반 위에 새로운 프론트엔드를 사용하여 Kotlin/JVM의 특정 복잡한 증분 컴파일 시나리오에서 성능을 개선합니다.

이러한 개선 사항은 동작 안정화 작업 중이므로 기본적으로 비활성화되어 있습니다. 이를 활성화하려면 `gradle.properties` 파일에 다음 속성을 추가하세요:

```none
kotlin.incremental.jvm.fir=true
```

현재 [`kapt` 컴파일러 플러그인](kapt.md)은 이 새로운 동작과 호환되지 않습니다. 향후 Kotlin 릴리스에서 지원을 추가하기 위해 노력하고 있습니다.

이 기능에 대한 여러분의 피드백을 [YouTrack](https://youtrack.jetbrains.com/issue/KT-72822)에 주시면 감사하겠습니다.

### 인라인 함수의 람다 변경 사항을 감지하는 증분 컴파일

Kotlin 2.2.20 이전에는 증분 컴파일을 활성화하고 인라인 함수의 람다 내부 로직을 변경해도 컴파일러가 다른 모듈의 해당 인라인 함수의 호출 지점을 재컴파일하지 않았습니다. 결과적으로 해당 호출 지점은 이전 버전의 람다를 사용하여 예상치 못한 동작을 일으킬 수 있었습니다.

Kotlin 2.2.20에서는 이제 컴파일러가 인라인 함수의 람다 변경 사항을 감지하고 해당 호출 지점을 자동으로 재컴파일합니다.

## Maven: `kotlin-maven-plugin`의 Kotlin 데몬 지원

Kotlin 2.2.20은 [Kotlin 2.2.0에서 도입된 새로운 실험적 빌드 도구 API](whatsnew22.md#new-experimental-build-tools-api)를 한 단계 더 발전시켜
`kotlin-maven-plugin`에서 [Kotlin 데몬](kotlin-daemon.md) 지원을 추가합니다. Kotlin 데몬을 사용하면 Kotlin
컴파일러가 별도의 격리된 프로세스에서 실행되므로 다른 Maven 플러그가 시스템 속성을 재정의하는 것을 방지할 수 있습니다. 예를 들어, 이 [YouTrack 이슈](https://youtrack.jetbrains.com/issue/KT-43894/Maven-Windows-error-RuntimeException-Could-not-find-installation-home-path)에서 확인할 수 있습니다.

Kotlin 2.2.20부터 Kotlin 데몬이 기본적으로 사용됩니다. 이전 동작으로 되돌리려면
`pom.xml` 파일에서 다음 속성을 `false`로 설정하여 옵트아웃하세요:

```xml
<properties>
    <kotlin.compiler.daemon>false</kotlin.compiler.daemon>
</properties>
```

Kotlin 2.2.20은 또한 새로운 `jvmArgs` 속성을 도입합니다. 이 속성을 사용하여 Kotlin 데몬의 기본 JVM 인수를 사용자 지정할 수 있습니다. 예를 들어, `-Xmx` 및 `-Xms` 옵션을 재정의하려면 `pom.xml` 파일에 다음을 추가하세요:

```xml
<properties>
    <kotlin.compiler.daemon.jvmArgs>Xmx1500m,Xms500m</kotlin.compiler.daemon.jvmArgs>
</properties>
```

## Kotlin 컴파일러 옵션을 위한 새로운 공통 스키마

Kotlin 2.2.20은 [`org.jetbrains.kotlin:kotlin-compiler-arguments-description`](https://central.sonatype.com/artifact/org.jetbrains.kotlin/kotlin-compiler-arguments-description)에 게시된 모든 컴파일러 옵션에 대한 공통 스키마를 도입합니다.
이 아티팩트에는 모든 컴파일러 옵션, 설명 및 각 옵션이 도입되거나 안정화된 버전과 같은 메타데이터의 코드 표현과 JSON 등가물(JVM이 아닌 소비자용)이 모두 포함됩니다.
이 스키마를 사용하여 옵션의 사용자 정의 뷰를 생성하거나 필요에 따라 분석할 수 있습니다.

## Kotlin 표준 라이브러리

이번 릴리스에서는 표준 라이브러리에 새로운 실험적 기능이 도입됩니다: Kotlin/JS에서 리플렉션을 통해 인터페이스 타입을 식별하는 지원, 공통 원자적(atomic) 타입을 위한 업데이트 함수, 그리고 배열 크기 조정을 위한 `copyOf()` 오버로드입니다.

### Kotlin/JS에서 리플렉션을 통해 인터페이스 타입을 식별하는 지원
<primary-label ref="experimental-opt-in"/>

Kotlin 2.2.20은 Kotlin/JS 표준 라이브러리에 [실험적](components-stability.md#stability-levels-explained) [`KClass.isInterface`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.reflect/-k-class/is-interface.html) 속성을 추가합니다.

이 속성을 사용하면 이제 클래스 참조가 Kotlin 인터페이스를 나타내는지 확인할 수 있습니다. 이는 클래스가 인터페이스를 나타내는지 확인하기 위해 `KClass.java.isInterface`를 사용할 수 있는 Kotlin/JVM과 Kotlin/JS의 동등성을 높입니다.

옵트인하려면 `@OptIn(ExperimentalStdlibApi::class)` 주석을 사용하세요:

```kotlin
@OptIn(ExperimentalStdlibApi::class)
fun inspect(klass: KClass<*>) {
    // Prints true for interfaces
    println(klass.isInterface)
}
```

이슈 트래커인 [YouTrack](https://youtrack.jetbrains.com/issue/KT-78581)에 피드백을 주시면 감사하겠습니다.

### 공통 원자적(atomic) 타입을 위한 새로운 업데이트 함수
<primary-label ref="experimental-opt-in"/>

Kotlin 2.2.20은 공통 원자적 타입과 해당 배열 counterpart의 요소를 업데이트하기 위한 새로운 실험적 함수를 도입합니다.
각 함수는 이러한 업데이트 함수 중 하나를 사용하여 새로운 값을 원자적으로 계산하고 현재 값을 교체하며, 반환 값은 사용하는 함수에 따라 다릅니다:

*   [`update()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.concurrent.atomics/update.html) 및 [`updateAt()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.concurrent.atomics/update-at.html)는 결과를 반환하지 않고 새 값을 설정합니다.
*   [`fetchAndUpdate()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.concurrent.atomics/fetch-and-update.html) 및 [`fetchAndUpdateAt()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.concurrent.atomics/fetch-and-update-at.html)는 새 값을 설정하고 변경 전의 이전 값을 반환합니다.
*   [`updateAndFetch()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.concurrent.atomics/update-and-fetch.html) 및 [`updateAndFetchAt()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.concurrent.atomics/update-and-fetch-at.html)는 새 값을 설정하고 변경 후의 업데이트된 값을 반환합니다.

이러한 함수를 사용하여 곱셈 또는 비트 연산과 같이 기본적으로 지원되지 않는 원자적 변환을 구현할 수 있습니다.
이전에는 공통 원자적 타입을 증분하고 이전 값을 읽으려면 [`compareAndSet()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.concurrent/-atomic-int/compare-and-set.html) 함수를 사용하는 루프가 필요했습니다.

모든 공통 원자적 타입용 API와 마찬가지로, 이 함수들은 [실험적](components-stability.md#stability-levels-explained)입니다.
옵트인하려면 `@OptIn(ExperimentalAtomicApi::class)` 주석을 사용하세요.

다음은 다양한 종류의 업데이트를 수행하고 이전 값 또는 업데이트된 값을 반환하는 코드 예시입니다:

```kotlin
import kotlin.concurrent.atomics.*
import kotlin.random.Random

@OptIn(ExperimentalAtomicApi::class)
fun main() {
    val counter = AtomicLong(Random.nextLong())
    val minSetBitsThreshold = 20

    // Sets a new value without using the result
    counter.update { if (it < 0xDECAF) 0xCACA0 else 0xC0FFEE }

    // Retrieves the current value, then updates it
    val previousValue = counter.fetchAndUpdate { 0x1CEDL.shl(Long.SIZE_BITS - it.countLeadingZeroBits()) or it }

    // Updates the value, then retrieves the result
    val current = counter.updateAndFetch {
        if (it.countOneBits() < minSetBitsThreshold) it.shl(20) or 0x15BADL else it
    }

    val hexFormat = HexFormat {
        upperCase = true
        number {
            removeLeadingZeros = true
        }
    }
    println("Previous value: ${previousValue.toHexString(hexFormat)}")
    println("Current value: ${current.toHexString(hexFormat)}")
    println("Expected status flag set: ${current and 0xBAD != 0xBADL}")
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="2.2.20"}

이슈 트래커인 [YouTrack](https://youtrack.jetbrains.com/issue/KT-76389)에 피드백을 주시면 감사하겠습니다.

### 배열을 위한 `copyOf()` 오버로드 지원
<primary-label ref="experimental-opt-in"/>

Kotlin 2.2.20은 [`copyOf()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.collections/copy-of.html) 함수에 대한 실험적 오버로드를 도입합니다.
이는 제네릭 타입 `Array<T>`의 배열 및 모든 기본 배열 타입에 사용할 수 있습니다.

이 함수를 사용하여 배열을 더 크게 만들고 이니셜라이저 람다의 값을 사용하여 새 요소를 채울 수 있습니다.
이는 사용자 정의 상용구 코드를 줄이는 데 도움이 되며, 제네릭 `Array<T>`의 크기를 조정할 때 null 허용 결과(`Array<T?>`)가 생성되는 일반적인 문제점을 해결합니다.

다음은 예시입니다:

```kotlin
@OptIn(ExperimentalStdlibApi::class)
fun main() {
    val row1: Array<String> = arrayOf("one", "two")
    // Resizes the array and populates the new elements using the lambda
    val row2: Array<String> = row1.copyOf(4) { "default" }
    println(row2.contentToString())
    // [one, two, default, default]
}
```

이 API는 [실험적](components-stability.md#stability-levels-explained)입니다. 옵트인하려면 `@OptIn(ExperimentalStdlibApi::class)` 주석을 사용하세요.

[이슈 트래커](https://youtrack.jetbrains.com/issue/KT-70984)에 피드백을 주시면 감사하겠습니다.

## Compose 컴파일러

이번 릴리스에서 Compose 컴파일러는 새로운 경고를 추가하고 빌드 메트릭 출력을 개선하여 읽기 쉽게 만들어서 사용 편의성을 향상시킵니다.

### 기본 매개변수에 대한 언어 버전 제한

이번 릴리스에서는 컴파일에 지정된 언어 버전이 추상(abstract) 또는 오픈(open) 가능한 컴포저블(composable) 함수의 기본 매개변수를 지원하는 데 필요한 버전보다 낮은 경우 Compose 컴파일러가 오류를 보고합니다.

기본 매개변수는 추상 함수는 Kotlin 2.1.0부터, 오픈 함수는 Kotlin 2.2.0부터 Compose 컴파일러에서 지원됩니다. 이전 Kotlin 언어 버전을 타겟팅하면서 최신 버전의 Compose 컴파일러를 사용할 때, 라이브러리 개발자는 언어 버전이 기본 매개변수를 지원하지 않더라도 추상 또는 오픈 함수에 기본 매개변수가 여전히 공개 API에 나타날 수 있음을 인지해야 합니다.

### K2 컴파일러에 대한 Composable 타겟 경고

이번 릴리스에서는 K2 컴파일러 사용 시 [`@ComposableTarget`](https://developer.android.com/reference/kotlin/androidx/compose/runtime/ComposableTarget) 불일치에 대한 경고를 추가합니다.

예를 들어:

```text
@Composable fun App() {
  Box { // <-- `Box` is a `@UiComposable`
    Path(...) // <-- `Path` is a `@VectorComposable`
    ^^^^^^^^^
    warning: Calling a Vector composable function where a UI composable was expected
  }
}
```
### 빌드 메트릭의 완전 정규화 이름

빌드 메트릭에 보고되는 클래스 및 함수 이름은 이제 완전 정규화되어, 다른 패키지에 있는 동일한 이름의 선언을 더 쉽게 구별할 수 있습니다.

또한, 빌드 메트릭에는 더 이상 기본 매개변수에서 복잡한 표현식의 덤프가 포함되지 않아 읽기 쉬워집니다.

## 호환성이 깨지는 변경 사항 및 사용 중단

이 섹션에서는 주목해야 할 중요한 호환성이 깨지는 변경 사항과 사용 중단 사항을 강조합니다:

*   [`kapt` 컴파일러 플러그인](kapt.md)은 이제 기본적으로 K2 컴파일러를 사용합니다. 결과적으로 플러그인이 K2 컴파일러를 사용할지 여부를 제어하는 `kapt.use.k2` 속성은 사용 중단되었습니다. 이 속성을 `false`로 설정하여 K2 컴파일러 사용을 옵트아웃하면 Gradle에서 경고를 표시합니다.

## 문서 업데이트

Kotlin 문서는 몇 가지 주목할 만한 변경 사항을 받았습니다:

*   [Kotlin 로드맵](roadmap.md) – 언어 및 생태계 발전에 대한 Kotlin의 우선순위 업데이트 목록을 참조하세요.
*   [속성(Properties)](properties.md) – Kotlin에서 속성을 사용하는 다양한 방법을 알아보세요.
*   [조건 및 루프](control-flow.md) – Kotlin에서 조건 및 루프가 작동하는 방식을 알아보세요.
*   [Kotlin/JavaScript](js-overview.md) – Kotlin/JS의 사용 사례를 살펴보세요.
*   [웹 타겟팅](gradle-configure-project.md#targeting-the-web) – 웹 개발을 위해 Gradle이 제공하는 다양한 타겟에 대해 알아보세요.
*   [Kotlin 데몬](kotlin-daemon.md) – Kotlin 데몬과 빌드 시스템 및 Kotlin 컴파일러와의 작동 방식에 대해 알아보세요.
*   [코루틴 개요 페이지](coroutines-overview.md) – 코루틴 개념에 대해 배우고 학습 여정을 시작하세요.
*   [Kotlin/Native 바이너리 옵션](native-binary-options.md) – Kotlin/Native의 바이너리 옵션 및 구성 방법에 대해 알아보세요.
*   [Kotlin/Native 디버깅](native-debugging.md) – Kotlin/Native로 디버깅하는 다양한 방법을 살펴보세요.
*   [LLVM 백엔드 사용자 정의 팁](native-llvm-passes.md) – Kotlin/Native가 LLVM을 사용하는 방법과 최적화 패스 조정 방법을 알아보세요.
*   [Exposed의 DAO API 시작하기](https://www.jetbrains.com/help/exposed/get-started-with-exposed-dao.html) – Exposed의 DAO(Data Access Object) API를 사용하여 관계형 데이터베이스에 데이터를 저장하고 검색하는 방법을 알아보세요.
*   R2DBC에 대한 Exposed 문서의 새 페이지:
    *   [데이터베이스 작업](https://www.jetbrains.com/help/exposed/working-with-database.html)
    *   [ConnectionFactory 작업](https://www.jetbrains.com/help/exposed/working-with-connectionfactory.html)
    *   [사용자 지정 타입 매핑](https://www.jetbrains.com/help/exposed/custom-type-mapping.html)
*   [HTMX 통합](https://ktor.io/docs/htmx-integration.html) – Ktor가 HTMX에 대한 실험적, 일급 지원을 제공하는 방법을 알아보세요.

## Kotlin 2.2.20으로 업데이트하는 방법

Kotlin 플러그인은 IntelliJ IDEA 및 Android Studio에 번들 플러그인으로 배포됩니다.

새로운 Kotlin 버전으로 업데이트하려면 빌드 스크립트에서 [Kotlin 버전을 2.2.20으로 변경](releases.md#update-to-a-new-kotlin-version)하세요.