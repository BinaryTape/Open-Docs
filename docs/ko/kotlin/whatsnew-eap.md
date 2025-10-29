`[//]: # (title: Kotlin %kotlinEapVersion%의 새로운 기능)`

_[릴리스 날짜: %kotlinEapReleaseDate%](eap.md#build-details)_

> 이 문서는 얼리 액세스 프리뷰(EAP) 릴리스의 모든 기능을 다루지는 않지만,
> 몇 가지 주요 개선 사항을 강조합니다.
>
> 전체 변경 사항 목록은 [GitHub 변경 로그](https://github.com/JetBrains/kotlin/releases/tag/v%kotlinEapVersion%)를 참조하세요.
>
{style="note"}

Kotlin %kotlinEapVersion% 릴리스가 출시되었습니다! 다음은 이 EAP 릴리스의 세부 정보입니다:

*   **언어**: [더 안정적이고 기본적으로 활성화된 기능, 사용되지 않는 반환 값을 위한 새로운 검사기, 컨텍스트에 민감한 해결 변경 사항](#language).
*   **Kotlin/JVM**: [Java 25 지원](#kotlin-jvm-support-for-java-25).
*   **Kotlin/Native**: [Swift 내보내기를 통한 상호 운용성 개선 및 제네릭 타입 경계에 대한 타입 검사가 기본적으로 활성화됨](#kotlin-native).
*   **Kotlin/Wasm**: [완전 한정 이름 및 새로운 예외 처리 제안이 기본적으로 활성화됨](#kotlin-wasm).
*   **Kotlin/JS**: [새로운 실험적 중단 함수 내보내기 및 `LongArray` 표현](#kotlin-js).
*   **Gradle**: [Gradle 9.0 호환성 및 생성된 소스 등록을 위한 새로운 API](#gradle).
*   **표준 라이브러리**: [안정적인 시간 추적 기능](#standard-library).

## IDE 지원

Kotlin %kotlinEapVersion%을(를) 지원하는 Kotlin 플러그인은 IntelliJ IDEA 및 Android Studio의 최신 버전에 번들로 제공됩니다.
IDE에서 Kotlin 플러그인을 업데이트할 필요가 없습니다.
빌드 스크립트에서 Kotlin 버전을 %kotlinEapVersion%(으)로 [변경하기만](configure-build-for-eap.md) 하면 됩니다.

자세한 내용은 [새 릴리스로 업데이트](releases.md#update-to-a-new-kotlin-version)를 참조하세요.

## 언어

Kotlin %kotlinEapVersion%은 기능 안정화에 중점을 두며, 사용되지 않는 반환 값을 위한 새로운 검사 메커니즘을 도입하고
컨텍스트에 민감한 해결을 개선합니다.

### 안정적인 기능

이전 Kotlin 릴리스에서는 몇 가지 새로운 언어 기능이 실험적(Experimental) 및 베타(Beta)로 도입되었습니다.
이번 릴리스에서는 다음 기능이 [안정적(Stable)](components-stability.md#stability-levels-explained) 상태가 되었음을 발표하게 되어 기쁩니다:

*   [중첩 타입 별칭 지원](whatsnew22.md#support-for-nested-type-aliases)
*   [`when` 표현식을 위한 데이터 흐름 기반의 완전성 검사](whatsnew2220.md#data-flow-based-exhaustiveness-checks-for-when-expressions)

### 기본적으로 활성화된 기능

Kotlin %kotlinEapVersion%에서는 다음 언어 기능이 이제 기본적으로 활성화됩니다:

*   [중단 함수 타입을 가진 람다에 대한 오버로드 해결 개선](whatsnew2220.md#improved-overload-resolution-for-lambdas-with-suspend-function-types)
*   [명시적 반환 타입이 있는 표현식 본문에서 `return` 문 지원](whatsnew2220.md#support-for-return-statements-in-expression-bodies-with-explicit-return-types)

[Kotlin 언어 디자인 기능 및 제안의 전체 목록](kotlin-language-features-and-proposals.md)을 참조하세요.

### 사용되지 않는 반환 값 검사기
<primary-label ref="experimental-general"/>

Kotlin %kotlinEapVersion%은 사용되지 않는 반환 값 검사기라는 새로운 기능을 도입합니다.
이 기능은 표현식이 `Unit` 또는 `Nothing` 이외의 값을 반환하고 해당 값이 함수에 전달되지 않거나,
조건에서 확인되지 않거나, 다른 방식으로 사용되지 않을 때 경고를 표시합니다.

이 기능을 사용하여 함수 호출이 의미 있는 결과를 생성하지만 그 결과가 소리 없이 삭제되어
예상치 못한 동작이나 추적하기 어려운 문제로 이어질 수 있는 버그를 포착하는 데 사용할 수 있습니다.

> 이 검사기는 `++` 및 `--`와 같은 증가 연산에서 반환되는 값을 무시합니다.
>
{style="note"}

다음 예시를 고려해 보세요:

```kotlin
fun formatGreeting(name: String): String {
    if (name.isBlank()) return "Hello, anonymous user!"
    if (!name.contains(' ')) {
        // 검사기는 이 결과가 무시된다는 경고를 보고합니다.
        "Hello, " + name.replaceFirstChar(Char::titlecase) + "!"
    }
    val (first, last) = name.split(' ')
    return "Hello, $first! Or should I call you Dr. $last?"
}
```

이 예시에서는 문자열이 생성되었지만 전혀 사용되지 않으므로, 검사기는 이를 무시된 결과로 보고합니다.

이 기능은 [실험적](components-stability.md#stability-levels-explained)입니다.
옵트인(opt-in)하려면 `build.gradle.kts` 파일에 다음 컴파일러 옵션을 추가하세요:

```kotlin
kotlin {
    compilerOptions {
        freeCompilerArgs.add("-Xreturn-value-checker=check")
    }
}
```

이 옵션을 사용하면 검사기는 Kotlin 표준 라이브러리의 대부분의 함수처럼 표시된 표현식에서만 무시된 결과를 보고합니다.

함수를 표시하려면 `@MustUseReturnValues` 애노테이션을 사용하여 검사기가 무시된 반환 값을 보고하도록 하려는 범위를 표시하세요.

예를 들어, 전체 파일을 표시할 수 있습니다:

```kotlin
// 이 파일의 모든 함수와 클래스를 표시하여 검사기가 사용되지 않는 반환 값을 보고합니다.
@file:MustUseReturnValues

package my.project

fun someFunction(): String
```

또는 특정 클래스를 표시할 수 있습니다:

```kotlin
// 이 클래스의 모든 함수를 표시하여 검사기가 사용되지 않는 반환 값을 보고합니다.
@MustUseReturnValues
class Greeter {
    fun greet(name: String): String = "Hello, $name"
}

fun someFunction(): Int = ...
```
{validate="false"}

`full` 모드를 사용하여 전체 프로젝트를 표시할 수도 있습니다.
이렇게 하려면 `build.gradle.kts` 파일에 다음 컴파일러 옵션을 추가하세요:

```kotlin
kotlin {
    compilerOptions {
        freeCompilerArgs.add("-Xreturn-value-checker=full")
    }
}
```

이 모드에서 Kotlin은 컴파일된 파일에 `@MustUseReturnValues` 애노테이션이 적용된 것처럼 자동 처리하므로,
검사기는 프로젝트 함수의 모든 반환 값에 적용됩니다.

`@IgnorableReturnValue` 애노테이션으로 특정 함수에 경고를 억제할 수 있습니다.
`MutableList.add`와 같이 결과 무시가 일반적이고 예상되는 함수에 애노테이션을 적용하세요:

```kotlin
@IgnorableReturnValue
fun <T> MutableList<T>.addAndIgnoreResult(element: T): Boolean {
    return add(element)
}
```

함수 자체를 무시할 수 있다고 표시하지 않고도 경고를 억제할 수 있습니다.
이렇게 하려면 밑줄 구문(`_`)을 사용하는 특별한 이름 없는 변수에 결과를 할당하세요:

```kotlin
// 무시할 수 없는 함수
fun computeValue(): Int = 42

fun main() {

    // 경고를 보고합니다: 결과가 무시됩니다.
    computeValue()

    // 특별한 사용되지 않는 변수로 이 호출 위치에서만 경고를 억제합니다.
    val _ = computeValue()
}
```

[YouTrack](https://youtrack.jetbrains.com/issue/KT-12719)에 피드백을 주시면 감사하겠습니다. 자세한 내용은 이 기능의 [KEEP](https://github.com/Kotlin/KEEP/blob/main/proposals/KEEP-0412-unused-return-value-checker.md)을 참조하세요.

### 컨텍스트에 민감한 해결 변경 사항
<primary-label ref="experimental-general"/>

> 이 기능의 코드 분석, 코드 완성, IntelliJ IDEA에서의 하이라이팅 지원은 현재
> [2025.3 EAP 빌드](https://www.jetbrains.com/idea/nextversion/)에서만 사용 가능합니다.
>
{style = "note"}

컨텍스트에 민감한 해결은 여전히 [실험적](components-stability.md#stability-levels-explained)이지만,
사용자 피드백을 기반으로 기능을 계속 개선하고 있습니다:

*   현재 타입의 봉인된(sealed) 및 둘러싸는 상위 타입이 이제 검색의 컨텍스트 범위의 일부로 간주됩니다.
    다른 상위 타입 범위는 고려되지 않습니다.
*   타입 연산자 및 등가성(equalities)을 사용하는 경우, 컴파일러는 컨텍스트에 민감한 해결을 사용하면
    해결 모호성이 발생할 때 경고를 보고합니다. 이는 예를 들어, 클래스의 충돌하는 선언이 임포트될 때 발생할 수 있습니다.

자세한 내용은 [KEEP](https://github.com/Kotlin/KEEP/blob/main/proposals/KEEP-0379-context-sensitive-resolution.md)에서 현재 제안의 전체 텍스트를 참조하세요.

## Kotlin/JVM: Java 25 지원

Kotlin %kotlinEapVersion%부터 컴파일러는 Java 25 바이트코드를 포함하는 클래스를 생성할 수 있습니다.

## Kotlin/Native

### Swift 내보내기를 통한 상호 운용성 개선
<primary-label ref="experimental-general"/>

Kotlin %kotlinEapVersion%은 Swift 내보내기를 통해 Kotlin과 Swift 간의 상호 운용성을 더욱 개선하여,
네이티브 열거형 클래스와 가변 인자 함수 매개변수 지원을 추가합니다.

이전에는 Kotlin 열거형이 일반 Swift 클래스로 내보내졌습니다. 이제 매핑이 직접적이어서 일반 네이티브 Swift 열거형을 사용할 수 있습니다. 예를 들어:

```kotlin
// Kotlin
enum class Color(val rgb: Int) {
    RED(0xFF0000),
    GREEN(0x00FF00),
    BLUE(0x0000FF)
}

val color = Color.RED
```

```Swift
// Swift
public enum Color: Swift.CaseIterable, Swift.LosslessStringConvertible, Swift.RawRepresentable {
    case RED, GREEN, BLUE

    var rgb: Int { get }
}
```

Kotlin의 [`vararg`](functions.md#variable-number-of-arguments-varargs) 함수도 이제 Swift의 가변 인자 함수 매개변수에 직접 매핑됩니다.

이러한 함수를 사용하면 가변 개수의 인수를 전달할 수 있습니다. 이는 인수의 개수를 미리 알 수 없거나,
타입을 지정하지 않고 컬렉션을 생성하거나 전달하려는 경우에 유용합니다. 예를 들어:

```kotlin
// Kotlin
fun log(vararg messages: String)
```

```Swift
// Swift
func log(_ messages: String...)
```

> 가변 인자 함수 매개변수에서 제네릭 타입은 아직 지원되지 않습니다.
>
{style="note"}

### 디버그 모드에서 제네릭 타입 경계에 대한 타입 검사

Kotlin %kotlinEapVersion%부터 디버그 모드에서 제네릭 타입 경계에 대한 타입 검사가 기본적으로 활성화되어,
비검사 캐스트(unchecked casts)와 관련된 오류를 더 일찍 찾을 수 있도록 돕습니다. 이 변경 사항은 안전성을 개선하고 유효하지 않은
제네릭 캐스트 디버깅을 플랫폼 전반에 걸쳐 더 예측 가능하게 만듭니다.

이전에는 힙 오염(heap pollution) 및 메모리 안전성 위반으로 이어지는 비검사 캐스트가 Kotlin/Native에서 인지되지 않을 수 있었습니다.
이제 이러한 경우 Kotlin/JVM 또는 Kotlin/JS와 유사하게 런타임 캐스트 오류로 일관되게 실패합니다. 예를 들어:

```kotlin
fun main() {
    val list = listOf("hello")
    val x = (list as List<Int>)[0]
    println(x) // 이제 ClassCastException 오류를 발생시킵니다.
}
```

이 코드는 이전에는 `6`을 출력했지만, 이제는 예상대로 디버그 모드에서 `ClassCastException` 오류를 발생시킵니다.

자세한 내용은 [타입 검사 및 캐스트](typecasts.md)를 참조하세요.

## Kotlin/Wasm

### 완전 한정 이름이 기본적으로 활성화됨

Kotlin/Wasm 타겟에서 완전 한정 이름(FQN)은 런타임에 기본적으로 활성화되지 않았습니다.
수동으로 `KClass.qualifiedName` 속성 지원을 활성화해야 했습니다.

이전에는 클래스 이름(패키지 제외)만 접근 가능했으며, 이는 JVM에서 Wasm 타겟으로 포팅된 코드 또는
런타임에 완전 한정 이름을 기대하는 라이브러리에서 문제를 일으켰습니다.

Kotlin %kotlinEapVersion%에서는 `KClass.qualifiedName` 속성이 Kotlin/Wasm 타겟에서 기본적으로 활성화됩니다.
이는 FQN이 추가 구성 없이 런타임에 사용 가능하다는 것을 의미합니다.

기본적으로 FQN을 활성화하면 코드 이식성이 향상되고, 완전 한정 이름을 표시하여 런타임 오류가 더 유익해집니다.

이 변경은 Latin-1 문자열 리터럴에 대한 압축 스토리지를 사용하여 메타데이터를 줄이는 컴파일러 최적화 덕분에
컴파일된 Wasm 바이너리 크기를 증가시키지 않습니다.

### `wasmWasi`에 대해 새로운 예외 처리 제안이 기본적으로 활성화됨

이전에는 Kotlin/Wasm이 [`wasmWasi`](wasm-overview.md#kotlin-wasm-and-wasi)를 포함한 모든 타겟에 대해
[레거시 예외 처리 제안](https://github.com/WebAssembly/exception-handling/blob/master/proposals/exception-handling/legacy/Exceptions.md)을 사용했습니다.
그러나 대부분의 독립형 WebAssembly 가상 머신(VM)은 [새로운 버전의 예외 처리 제안](https://github.com/WebAssembly/exception-handling/blob/main/proposals/exception-handling/Exceptions.md)과 일치하고 있습니다.

Kotlin %kotlinEapVersion%부터 새로운 WebAssembly 예외 처리 제안이 `wasmWasi` 타겟에 대해 기본적으로 활성화되어,
최신 WebAssembly 런타임과의 더 나은 호환성을 보장합니다.

`wasmWasi` 타겟의 경우, 해당 타겟을 대상으로 하는 애플리케이션은 일반적으로 덜 다양한 런타임 환경(종종 단일 특정 VM에서 실행)에서 실행되며,
일반적으로 사용자가 제어하기 때문에 호환성 문제의 위험을 줄여 이 변경 사항을 조기에 도입하는 것이 안전합니다.

새로운 예외 처리 제안은 [`wasmJs` 타겟](wasm-overview.md#kotlin-wasm-and-compose-multiplatform)에 대해서는 기본적으로 비활성화된 상태로 유지됩니다.
컴파일러 옵션 `-Xwasm-use-new-exception-proposal`을 사용하여 수동으로 활성화할 수 있습니다.

## Kotlin/JS

### `JsExport`를 사용한 새로운 중단 함수 내보내기
<primary-label ref="experimental-opt-in"/>

이전에는 `@JsExport` 애노테이션이 중단 함수(또는 그러한 함수를 포함하는 클래스 및 인터페이스)를 JavaScript로 내보내는 것을 허용하지 않았습니다.
각 중단 함수를 수동으로 래핑해야 했으며, 이는 번거롭고 오류 발생 가능성이 높았습니다.

Kotlin %kotlinEapVersion%부터 `@JsExport` 애노테이션을 사용하여 중단 함수를 JavaScript로 직접 내보낼 수 있습니다.

중단 함수 내보내기를 활성화하면 상용구 코드가 필요 없어지고 Kotlin/JS와 JavaScript/TypeScript (JS/TS) 간의 상호 운용성이 향상됩니다.
이제 Kotlin의 비동기 함수를 추가 코드 없이 JS/TS에서 직접 호출할 수 있습니다.

이 기능을 활성화하려면 `build.gradle.kts` 파일에 다음 컴파일러 옵션을 추가하세요:

```kotlin
kotlin {
    compilerOptions {
        freeCompilerArgs.add("-XXLanguage:+JsAllowExportingSuspendFunctions")
    }
}
```

활성화되면 `@JsExport` 애노테이션으로 표시된 클래스와 함수는 추가 래퍼 없이 중단 함수를 포함할 수 있습니다.

이들은 일반 JavaScript 비동기 함수로 사용될 수 있으며, 비동기 함수로도 오버라이드될 수 있습니다:

```kotlin
@JsExport
open class Foo {
    suspend fun foo() = "Foo"
}
```

```typescript
class Bar extends Foo {
    override async foo(): Promise<string> {
        return "Bar"
    }
}
```

이 기능은 [실험적](components-stability.md#stability-levels-explained)입니다. 이슈 트래커인 [YouTrack](https://youtrack.jetbrains.com/issue/KT-56281/KJS-Cant-export-suspend-functions)에 피드백을 주시면 감사하겠습니다.

### Kotlin의 `LongArray` 타입을 표현하기 위한 `BigInt64Array` 타입 사용
<primary-label ref="experimental-opt-in"/>

이전에는 Kotlin/JS가 `LongArray`를 JavaScript `Array<bigint>`로 표현했습니다.
이 접근 방식은 작동했지만, 타입 배열을 기대하는 JavaScript API와의 상호 운용성에는 이상적이지 않았습니다.

이번 릴리스부터 Kotlin/JS는 JavaScript로 컴파일할 때 Kotlin의 `LongArray` 값을 표현하기 위해
JavaScript의 내장 `BigInt64Array` 타입을 사용합니다.

`BigInt64Array`를 사용하면 타입 배열을 사용하는 JavaScript API와의 상호 운용성이 단순해집니다.
또한 `LongArray`를 받거나 반환하는 API를 Kotlin에서 JavaScript로 더 자연스럽게 내보낼 수 있습니다.

이 기능을 활성화하려면 `build.gradle.kts` 파일에 다음 컴파일러 옵션을 추가하세요:

```kotlin
kotlin {
    js {
        // ...
        compilerOptions {
            freeCompilerArgs.add("-Xes-long-as-bigint")
        }
    }
}
```

이 기능은 [실험적](components-stability.md#stability-levels-explained)입니다. 이슈 트래커인 [YouTrack](https://youtrack.jetbrains.com/issue/KT-79284/Use-BigInt64Array-for-LongArray)에 피드백을 주시면 감사하겠습니다.

## Gradle

Kotlin %kotlinEapVersion%은 Gradle 7.6.3부터 9.0.0까지 완벽하게 호환됩니다.
최신 Gradle 릴리스까지 Gradle 버전을 사용할 수도 있습니다.
그러나 그렇게 하면 사용 중단 경고가 발생할 수 있으며, 일부 새로운 Gradle 기능이 작동하지 않을 수 있음을 유의하십시오.

또한, 이제 최소 지원 Android Gradle 플러그인 버전은 8.2.2이고 최대 지원 버전은 8.13.0입니다.

### Gradle 프로젝트에서 생성된 소스 등록을 위한 새로운 API
<primary-label ref="experimental-general"/>

Kotlin %kotlinEapVersion%은 [`KotlinSourceSet`](https://kotlinlang.org/api/kotlin-gradle-plugin/kotlin-gradle-plugin-api/org.jetbrains.kotlin.gradle.plugin/-kotlin-source-set/) 인터페이스에
Gradle 프로젝트에서 생성된 소스를 등록하는 데 사용할 수 있는 새로운 [실험적](components-stability.md#stability-levels-explained) API를 도입합니다.

이 새로운 API는 IDE가 생성된 코드와 일반 소스 파일을 구분하는 데 도움이 되는 삶의 질 개선(quality-of-life improvement)입니다.
이 API는 IDE가 UI에서 생성된 코드를 다르게 강조 표시하고 프로젝트가 임포트될 때 생성 작업을 트리거할 수 있도록 합니다.
현재 IntelliJ IDEA에서 이 지원을 추가하기 위해 작업 중입니다.
이 API는 [KSP](ksp-overview.md)(Kotlin Symbol Processing)와 같이 코드를 생성하는 서드파티 플러그인이나 도구에도 특히 유용합니다.

Kotlin 또는 Java 파일이 포함된 디렉토리를 등록하려면 `build.gradle(.kts)` 파일에서
[`SourceDirectorySet`](https://docs.gradle.org/current/kotlin-dsl/gradle/org.gradle.api.file/-source-directory-set/index.html) 타입의 `generatedKotlin` 속성을 사용하세요. 예를 들어:

```kotlin
val generatorTask = project.tasks.register("generator") {
    val outputDirectory = project.layout.projectDirectory.dir("src/main/kotlinGen")
    outputs.dir(outputDirectory)
    doLast {
        outputDirectory.file("generated.kt").asFile.writeText(
            // language=kotlin
            """
            fun printHello() {
                println("hello")
            }
            """.trimIndent()
        )
    }
}

kotlin.sourceSets.getByName("main").generatedKotlin.srcDir(generatorTask)
```

이 예시는 출력 디렉토리가 `"src/main/kotlinGen"`인 새로운 태스크 `"generator"`를 생성합니다.
태스크가 실행되면 `doLast {}` 블록은 출력 디렉토리에 `generated.kt` 파일을 생성합니다.
마지막으로, 예시는 태스크의 출력을 생성된 소스로 등록합니다.

새로운 API의 일부로, `allKotlinSources` 속성은 `KotlinSourceSet.kotlin` 및 `KotlinSourceSet.generatedKotlin` 속성에 등록된 모든 소스에 대한 접근을 제공합니다.

## 표준 라이브러리

Kotlin %kotlinEapVersion%에서는 새로운 시간 추적 기능인
[`kotlin.time.Clock` 및 `kotlin.time.Instant`](whatsnew2120.md#new-time-tracking-functionality)이 [안정적(Stable)](components-stability.md#stability-levels-explained) 상태가 됩니다.

## Compose 컴파일러: 최소화된 Android 애플리케이션을 위한 스택 트레이스

Kotlin 2.3.0부터 컴파일러는 R8에 의해 애플리케이션이 최소화될 때 Compose 스택 트레이스에 대한 ProGuard 매핑을 출력합니다.
이는 이전에 디버그 가능한 변형에서만 사용할 수 있었던 실험적 스택 트레이스 기능을 확장합니다.

릴리스 변형의 스택 트레이스에는 런타임에 소스 정보를 기록하는 오버헤드 없이 최소화된 애플리케이션에서
컴포저블 함수를 식별하는 데 사용할 수 있는 그룹 키가 포함되어 있습니다.
그룹 키 스택 트레이스는 애플리케이션이 Compose 런타임 1.10 이상으로 빌드되어야 합니다.

그룹 키 스택 트레이스를 활성화하려면 `@Composable` 콘텐츠를 초기화하기 전에 다음 줄을 추가하세요:

```kotlin
Composer.setDiagnosticStackTraceMode(ComposeStackTraceMode.GroupKeys)
```

이 스택 트레이스가 활성화되면 Compose 런타임은 앱이 최소화된 상태에서도 구성(composition), 측정(measure) 또는 그리기(draw) 단계에서
크래시가 캡처된 후 자체 스택 트레이스를 추가합니다:

```text
java.lang.IllegalStateException: <message>
          at <original trace>
Suppressed: androidx.compose.runtime.DiagnosticComposeException: Composition stack when thrown:
         at $compose.m$123(SourceFile:1)
         at $compose.m$234(SourceFile:1)
          ...
```

이 모드에서 Jetpack Compose 1.10이 생성한 스택 트레이스에는 아직 난독화 해제(deobfuscated)해야 하는 그룹 키만 포함됩니다.
이는 이제 R8에서 생성된 ProGuard 매핑 파일에 그룹 키 항목을 추가하는 Compose 컴파일러 Gradle 플러그인을 포함한
Kotlin 2.3.0 릴리스에서 해결됩니다.
컴파일러가 일부 함수에 대한 매핑 생성을 실패하는 경우 새로운 경고가 나타나면
[Google IssueTracker](https://issuetracker.google.com/issues/new?component=610764&template=1424126)에 보고해 주십시오.

> Compose 컴파일러 Gradle 플러그인은 R8 매핑 파일에 대한 종속성 때문에 빌드에 R8이 활성화된 경우에만
> 그룹 키 스택 트레이스에 대한 난독화 해제 매핑을 생성합니다.
>
{style="note"}