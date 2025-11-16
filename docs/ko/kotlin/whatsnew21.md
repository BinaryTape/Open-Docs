[//]: # (title: Kotlin 2.1.0의 새로운 기능)

_[출시일: 2024년 11월 27일](releases.md#release-details)_

Kotlin 2.1.0이 출시되었습니다! 주요 내용은 다음과 같습니다:

*   **새로운 언어 기능 미리보기**: [주어가 있는 `when`의 가드 조건](#guard-conditions-in-when-with-a-subject),
    [비지역 `break` 및 `continue`](#non-local-break-and-continue), 그리고 [다중 달러 문자열 보간](#multi-dollar-string-interpolation).
*   **K2 컴파일러 업데이트**: [컴파일러 검사에 대한 유연성 증가](#extra-compiler-checks) 및 [kapt 구현 개선](#improved-k2-kapt-implementation).
*   **Kotlin Multiplatform**: [Swift Export를 위한 기본 지원](#basic-support-for-swift-export),
    [컴파일러 옵션을 위한 안정적인 Gradle DSL](#new-gradle-dsl-for-compiler-options-in-multiplatform-projects-promoted-to-stable) 등을 도입했습니다.
*   **Kotlin/Native**: [`iosArm64` 지원 개선](#iosarm64-promoted-to-tier-1) 및 기타 업데이트.
*   **Kotlin/Wasm**: [증분 컴파일 지원](#support-for-incremental-compilation)을 포함한 여러 업데이트.
*   **Gradle 지원**: [최신 Gradle 및 Android Gradle 플러그인 버전과의 호환성 개선](#gradle-improvements)과 함께
    [Kotlin Gradle 플러그인 API 업데이트](#new-api-for-kotlin-gradle-plugin-extensions).
*   **문서**: [Kotlin 문서의 상당한 개선](#documentation-updates).

## IDE 지원

2.1.0을 지원하는 Kotlin 플러그인은 최신 IntelliJ IDEA 및 Android Studio에 번들로 제공됩니다.
IDE에서 Kotlin 플러그인을 업데이트할 필요가 없습니다.
빌드 스크립트에서 Kotlin 버전을 2.1.0으로 변경하기만 하면 됩니다.

자세한 내용은 [새 Kotlin 버전으로 업데이트](releases.md#update-to-a-new-kotlin-version)를 참조하세요.

## 언어

K2 컴파일러가 포함된 Kotlin 2.0.0 출시 후, JetBrains 팀은 새로운 기능으로 언어를 개선하는 데 집중하고 있습니다.
이번 릴리스에서는 여러 가지 새로운 언어 디자인 개선 사항을 발표하게 되어 기쁩니다.

이 기능들은 미리보기로 제공되며, 사용해보고 피드백을 공유해 주시길 권장합니다:

*   [주어가 있는 `when`의 가드 조건](#guard-conditions-in-when-with-a-subject)
*   [비지역 `break` 및 `continue`](#non-local-break-and-continue)
*   [다중 달러 보간: 문자열 리터럴에서 달러 기호(`$`) 처리 개선](#multi-dollar-string-interpolation)

> 모든 기능은 K2 모드가 활성화된 최신 IntelliJ IDEA 2024.3 버전에서 IDE 지원을 제공합니다.
>
> 자세한 내용은 [IntelliJ IDEA 2024.3 블로그 게시물](https://blog.jetbrains.com/idea/2024/11/intellij-idea-2024-3/)에서 확인하세요.
>
{style="tip"}

[Kotlin 언어 설계 기능 및 제안의 전체 목록 보기](kotlin-language-features-and-proposals.md).

이번 릴리스에는 다음 언어 업데이트도 포함되어 있습니다:

*   [API 확장 시 선택적 동의 요구 지원](#support-for-requiring-opt-in-to-extend-apis)
*   [제네릭 타입 함수에 대한 오버로드 해결 개선](#improved-overload-resolution-for-functions-with-generic-types)
*   [봉인 클래스를 사용한 `when` 표현식의 완전성 검사 개선](#improved-exhaustiveness-checks-for-when-expressions-with-sealed-classes)

### 주어가 있는 `when`의 가드 조건

> 이 기능은 [미리보기](kotlin-evolution-principles.md#pre-stable-features) 상태이며,
> 선택적 동의(`opt-in`)가 필요합니다(아래 세부 정보 참조).
>
> [YouTrack](https://youtrack.jetbrains.com/issue/KT-71140)에 피드백을 주시면 감사하겠습니다.
>
{style="warning"}

2.1.0부터 주어가 있는 `when` 표현식 또는 문에서 가드 조건을 사용할 수 있습니다.

가드 조건을 사용하면 `when` 표현식의 분기에 둘 이상의 조건을 포함할 수 있으므로,
복잡한 제어 흐름을 더 명시적이고 간결하게 만들고 코드 구조를 평탄화할 수 있습니다.

분기에 가드 조건을 포함하려면 기본 조건 뒤에 `if`로 구분하여 배치합니다:

```kotlin
sealed interface Animal {
    data class Cat(val mouseHunter: Boolean) : Animal {
        fun feedCat() {}
    }

    data class Dog(val breed: String) : Animal {
        fun feedDog() {}
    }
}

fun feedAnimal(animal: Animal) {
    when (animal) {
        // Branch with only the primary condition. Calls `feedDog()` when `animal` is `Dog`
        is Animal.Dog -> animal.feedDog()
        // Branch with both primary and guard conditions. Calls `feedCat()` when `animal` is `Cat` and is not `mouseHunter`
        is Animal.Cat if !animal.mouseHunter -> animal.feedCat()
        // Prints "Unknown animal" if none of the above conditions match
        else -> println("Unknown animal")
    }
}
```

단일 `when` 표현식에서 가드 조건이 있는 분기와 없는 분기를 결합할 수 있습니다.
가드 조건이 있는 분기의 코드는 기본 조건과 가드 조건이 모두 `true`인 경우에만 실행됩니다.
기본 조건이 일치하지 않으면 가드 조건은 평가되지 않습니다.
또한 가드 조건은 `else if`를 지원합니다.

프로젝트에서 가드 조건을 활성화하려면 명령줄에서 다음 컴파일러 옵션을 사용하세요:

```bash
kotlinc -Xwhen-guards main.kt
```

또는 Gradle 빌드 파일의 `compilerOptions {}` 블록에 추가하세요:

```kotlin
// build.gradle.kts
kotlin {
    compilerOptions {
        freeCompilerArgs.add("-Xwhen-guards")
    }
}
```

### 비지역 `break` 및 `continue`

> 이 기능은 [미리보기](kotlin-evolution-principles.md#pre-stable-features) 상태이며,
> 선택적 동의(`opt-in`)가 필요합니다(아래 세부 정보 참조).
>
> [YouTrack](https://youtrack.jetbrains.com/issue/KT-1436)에 피드백을 주시면 감사하겠습니다.
>
{style="warning"}

Kotlin 2.1.0은 오랫동안 기다려온 또 다른 기능인 비지역 `break` 및 `continue` 사용 기능을 미리보기로 추가합니다.
이 기능은 인라인 함수의 범위에서 사용할 수 있는 도구 세트를 확장하고 프로젝트의 상용구 코드를 줄입니다.

이전에는 비지역 `return`만 사용할 수 있었습니다.
이제 Kotlin은 [점프 표현식](returns.md) `break` 및 `continue`도 비지역적으로 지원합니다.
이는 루프를 포함하는 인라인 함수의 인수로 전달된 람다 내에서 이들을 적용할 수 있음을 의미합니다:

```kotlin
fun processList(elements: List<Int>): Boolean {
    for (element in elements) {
        val variable = element.nullableMethod() ?: run {
            log.warning("Element is null or invalid, continuing...")
            continue
        }
        if (variable == 0) return true // If variable is zero, return true
    }
    return false
}
```

프로젝트에서 이 기능을 사용해 보려면 명령줄에서 `-Xnon-local-break-continue` 컴파일러 옵션을 사용하세요:

```bash
kotlinc -Xnon-local-break-continue main.kt
```

또는 Gradle 빌드 파일의 `compilerOptions {}` 블록에 추가하세요:

```kotlin
// build.gradle.kts
kotlin {
    compilerOptions {
        freeCompilerArgs.add("-Xnon-local-break-continue")
    }
}
```

향후 Kotlin 릴리스에서 이 기능을 Stable로 만들 계획입니다.
비지역 `break` 및 `continue`를 사용하는 동안 문제가 발생하면
[이슈 트래커](https://youtrack.jetbrains.com/issue/KT-1436)에 보고해 주세요.

### 다중 달러 문자열 보간

> 이 기능은 [미리보기](kotlin-evolution-principles.md#pre-stable-features) 상태이며,
> 선택적 동의(`opt-in`)가 필요합니다(아래 세부 정보 참조).
>
> [YouTrack](https://youtrack.jetbrains.com/issue/KT-2425)에 피드백을 주시면 감사하겠습니다.
>
{style="warning"}

Kotlin 2.1.0은 다중 달러 문자열 보간을 지원을 도입하여,
문자열 리터럴 내에서 달러 기호(`$`)가 처리되는 방식을 개선합니다.
이 기능은 템플릿 엔진, JSON 스키마 또는 기타 데이터 형식과 같이
여러 달러 기호가 필요한 컨텍스트에서 유용합니다.

Kotlin의 문자열 보간은 단일 달러 기호를 사용합니다.
그러나 금융 데이터 및 템플릿 시스템에서 흔히 사용되는 문자열 내에서 리터럴 달러 기호를 사용하려면
`${'$'}`와 같은 해결 방법이 필요했습니다.
다중 달러 보간 기능이 활성화되면 보간을 트리거하는 달러 기호 수를 구성할 수 있으며,
더 적은 수의 달러 기호는 문자열 리터럴로 처리됩니다.

다음은 다중 달러 보간을 사용하여 자리 표시자가 있는 JSON 스키마 다중 행 문자열을 생성하는 예입니다:

```kotlin
val KClass<*>.jsonSchema : String
    get() = $"""
    {
      "$schema": "https://json-schema.org/draft/2020-12/schema",
      "$id": "https://example.com/product.schema.json",
      "$dynamicAnchor": "meta"
      "title": "${simpleName ?: qualifiedName ?: "unknown"}",
      "type": "object"
    }
    """
```

이 예에서 초기 `$`는 보간을 트리거하는 데 **두 개의 달러 기호**(`$$`)가 필요하다는 것을 의미합니다.
이는 `$schema`, `$id`, `$dynamicAnchor`가 보간 마커로 해석되는 것을 방지합니다.

이 접근 방식은 자리 표시자 구문에 달러 기호를 사용하는 시스템에서 작업할 때 특히 유용합니다.

이 기능을 활성화하려면 명령줄에서 다음 컴파일러 옵션을 사용하세요:

```bash
kotlinc -Xmulti-dollar-interpolation main.kt
```

또는 Gradle 빌드 파일의 `compilerOptions {}` 블록을 업데이트하세요:

```kotlin
// build.gradle.kts
kotlin {
    compilerOptions {
        freeCompilerArgs.add("-Xmulti-dollar-interpolation")
    }
}
```

코드가 이미 단일 달러 기호로 표준 문자열 보간을 사용하는 경우 변경할 필요가 없습니다.
문자열에 리터럴 달러 기호가 필요할 때마다 `$`를 사용할 수 있습니다.

### API 확장 시 선택적 동의 요구 지원

Kotlin 2.1.0은 라이브러리 작성자가 실험적인 인터페이스를 구현하거나 실험적인 클래스를 확장하기 전에 명시적인 선택적 동의(`opt-in`)를 요구할 수 있도록 하는 [`@SubclassOptInRequired`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-subclass-opt-in-required/) 어노테이션을 도입했습니다.

이 기능은 라이브러리 API가 사용하기에 충분히 안정적이지만 새로운 추상 함수로 발전할 수 있어 상속에 불안정할 수 있는 경우에 유용할 수 있습니다.

API 요소에 선택적 동의 요구사항을 추가하려면 어노테이션 클래스에 대한 참조와 함께 `@SubclassOptInRequired` 어노테이션을 사용하세요:

```kotlin
@RequiresOptIn(
level = RequiresOptIn.Level.WARNING,
message = "Interfaces in this library are experimental"
)
annotation class UnstableApi()

@SubclassOptInRequired(UnstableApi::class)
interface CoreLibraryApi
```

이 예시에서 `CoreLibraryApi` 인터페이스는 사용자가 이를 구현하기 전에 선택적 동의를 요구합니다.
사용자는 다음과 같이 선택적 동의를 할 수 있습니다:

```kotlin
@OptIn(UnstableApi::class)
interface MyImplementation: CoreLibraryApi
```

> `@SubclassOptInRequired` 어노테이션을 사용하여 선택적 동의를 요구하는 경우,
> 이 요구사항은 [내부 또는 중첩 클래스](nested-classes.md)로 전파되지 않습니다.
>
{style="note"}

API에서 `@SubclassOptInRequired` 어노테이션을 사용하는 실제 예시는 `kotlinx.coroutines` 라이브러리의 [`SharedFlow`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.flow/-shared-flow/) 인터페이스를 확인하세요.

### 제네릭 타입 함수에 대한 오버로드 해결 개선

이전에는 제네릭 타입의 값 파라미터를 갖는 함수와 동일한 위치에 함수 타입을 갖는 함수에 대한 여러 오버로드가 있는 경우,
해결 동작이 때때로 일관적이지 않을 수 있었습니다.

이는 오버로드가 멤버 함수인지 확장 함수인지에 따라 다른 동작을 초래했습니다.
예를 들어:

```kotlin
class KeyValueStore<K, V> {
    fun store(key: K, value: V) {} // 1
    fun store(key: K, lazyValue: () -> V) {} // 2
}

fun <K, V> KeyValueStore<K, V>.storeExtension(key: K, value: V) {} // 1 
fun <K, V> KeyValueStore<K, V>.storeExtension(key: K, lazyValue: () -> V) {} // 2

fun test(kvs: KeyValueStore<String, Int>) {
    // Member functions
    kvs.store("", 1)    // Resolves to 1
    kvs.store("") { 1 } // Resolves to 2

    // Extension functions
    kvs.storeExtension("", 1)    // Resolves to 1
    kvs.storeExtension("") { 1 } // Doesn't resolve
}
```

이 예제에서 `KeyValueStore` 클래스는 `store()` 함수에 대한 두 개의 오버로드를 가지고 있으며,
그 중 하나는 제네릭 타입 `K`와 `V`를 가진 함수 파라미터를 가지고 있고,
다른 하나는 제네릭 타입 `V`를 반환하는 람다 함수를 가지고 있습니다.
마찬가지로, 확장 함수 `storeExtension()`에 대한 두 개의 오버로드가 있습니다.

`store()` 함수가 람다 함수와 함께 그리고 람다 함수 없이 호출되었을 때,
컴파일러는 올바른 오버로드를 성공적으로 해결했습니다.
그러나 확장 함수 `storeExtension()`이 람다 함수와 함께 호출되었을 때,
컴파일러는 두 오버로드가 모두 적용 가능하다고 잘못 판단했기 때문에 올바른 오버로드를 해결하지 못했습니다.

이 문제를 해결하기 위해, 우리는 컴파일러가 제네릭 타입의 함수 파라미터가 다른 인자로부터의 정보에 기반하여 람다 함수를 받아들일 수 없을 때 가능한 오버로드를 폐기할 수 있도록 하는 새로운 휴리스틱을 도입했습니다.
이 변경은 멤버 함수와 확장 함수의 동작을 일관되게 만들며, Kotlin 2.1.0에서 기본적으로 활성화됩니다.

### 봉인 클래스를 사용한 `when` 표현식의 완전성 검사 개선

이전 버전의 Kotlin에서는 `when` 표현식에서 봉인된 상위 경계를 가진 타입 파라미터에 대해 `else` 분기가 필요했습니다. 심지어 `sealed class` 계층의 모든 경우가 커버된 경우에도 마찬가지였습니다.
이 동작은 Kotlin 2.1.0에서 해결되고 개선되어, 완전성 검사를 더욱 강력하게 만들고 중복된 `else` 분기를 제거하여 `when` 표현식을 더 깔끔하고 직관적으로 유지할 수 있습니다.

다음은 변경 사항을 보여주는 예시입니다:

```kotlin
sealed class Result
object Error: Result()
class Success(val value: String): Result()

fun <T : Result> render(result: T) = when (result) {
    Error -> "Error!"
    is Success -> result.value
    // Requires no else branch
}
```

## Kotlin K2 컴파일러

Kotlin 2.1.0과 함께 K2 컴파일러는 이제 [컴파일러 검사](#extra-compiler-checks) 및 [경고](#global-warning-suppression) 작업 시 더 많은 유연성을 제공하며, [kapt 플러그인에 대한 지원을 개선](#improved-k2-kapt-implementation)했습니다.

### 추가 컴파일러 검사

Kotlin 2.1.0부터 K2 컴파일러에서 추가 검사를 활성화할 수 있습니다.
이들은 일반적으로 컴파일에 중요하지 않지만 다음 경우를 검증하려는 경우 여전히 유용할 수 있는 추가 선언, 표현식 및 타입 검사입니다:

| 검사 유형                                             | 설명                                                                                         |
| :---------------------------------------------------- | :------------------------------------------------------------------------------------------- |
| `REDUNDANT_NULLABLE`                                  | `Boolean??`가 `Boolean?` 대신 사용됨                                                 |
| `PLATFORM_CLASS_MAPPED_TO_KOTLIN`                     | `java.lang.String`이 `kotlin.String` 대신 사용됨                                      |
| `ARRAY_EQUALITY_OPERATOR_CAN_BE_REPLACED_WITH_EQUALS` | `arrayOf("") == arrayOf("")`가 `arrayOf("").contentEquals(arrayOf(""))` 대신 사용됨 |
| `REDUNDANT_CALL_OF_CONVERSION_METHOD`                 | `42.toInt()`가 `42` 대신 사용됨                                                              |
| `USELESS_CALL_ON_NOT_NULL`                            | `"".orEmpty()`가 `""` 대신 사용됨                                                              |
| `REDUNDANT_SINGLE_EXPRESSION_STRING_TEMPLATE`         | `"$string"`가 `string` 대신 사용됨                                                           |
| `UNUSED_ANONYMOUS_PARAMETER`                          | 람다 표현식에 전달된 매개변수가 사용되지 않음                                                    |
| `REDUNDANT_VISIBILITY_MODIFIER`                       | `public class Klass`가 `class Klass` 대신 사용됨                                             |
| `REDUNDANT_MODALITY_MODIFIER`                         | `final class Klass`가 `class Klass` 대신 사용됨                                              |
| `REDUNDANT_SETTER_PARAMETER_TYPE`                     | `set(value: Int)`가 `set(value)` 대신 사용됨                                                 |
| `CAN_BE_VAL`                                          | `var local = 0`이 정의되었지만 다시 할당되지 않음, `val local = 42`로 변경 가능        |
| `ASSIGNED_VALUE_IS_NEVER_READ`                        | `val local = 42`이 정의되었지만 코드에서 사용되지 않음                                     |
| `UNUSED_VARIABLE`                                     | `val local = 0`이 정의되었지만 코드에서 사용되지 않음                                         |
| `REDUNDANT_RETURN_UNIT_TYPE`                          | `fun foo(): Unit {}`가 `fun foo() {}` 대신 사용됨                                             |
| `UNREACHABLE_CODE`                                    | 코드 문이 존재하지만 실행될 수 없음                                                           |

검사가 참이면 문제를 해결하는 방법에 대한 제안과 함께 컴파일러 경고가 표시됩니다.

추가 검사는 기본적으로 비활성화되어 있습니다.
활성화하려면 명령줄에서 `-Wextra` 컴파일러 옵션을 사용하거나
Gradle 빌드 파일의 `compilerOptions {}` 블록에서 `extraWarnings`를 지정하세요:

```kotlin
// build.gradle.kts
kotlin {
    compilerOptions {
        extraWarnings.set(true)
    }
}
```

컴파일러 옵션을 정의하고 사용하는 방법에 대한 자세한 내용은
[Kotlin Gradle 플러그인의 컴파일러 옵션](gradle-compiler-options.md)을 참조하세요.

### 전역 경고 억제

2.1.0에서 Kotlin 컴파일러는 오랫동안 요청되었던 기능인 전역적으로 경고를 억제하는 기능을 받았습니다.

이제 명령줄에서 `-Xsuppress-warning=WARNING_NAME` 구문을 사용하거나
빌드 파일의 `compilerOptions {}` 블록에서 `freeCompilerArgs` 속성을 사용하여
전체 프로젝트에서 특정 경고를 억제할 수 있습니다.

예를 들어, 프로젝트에 [추가 컴파일러 검사](#extra-compiler-checks)가 활성화되어 있지만 그 중 하나를 억제하려면 다음을 사용합니다:

```kotlin
// build.gradle.kts
kotlin {
    compilerOptions {
        extraWarnings.set(true)
        freeCompilerArgs.add("-Xsuppress-warning=CAN_BE_VAL")
    }
}
```

경고를 억제하고 싶지만 이름을 모르는 경우, 요소를 선택하고 전구 아이콘을 클릭하거나 (<shortcut>Cmd + Enter</shortcut>/<shortcut>Alt + Enter</shortcut> 사용):

![경고명 인텐션](warning-name-intention.png){width=500}

새로운 컴파일러 옵션은 현재 [Experimental](components-stability.md#stability-levels-explained) 상태입니다.
다음 세부 사항도 주목할 가치가 있습니다:

*   오류 억제는 허용되지 않습니다.
*   알 수 없는 경고 이름을 전달하면 컴파일 시 오류가 발생합니다.
*   여러 경고를 한 번에 지정할 수 있습니다:
  
    <tabs>
    <tab title="명령줄">

    ```bash
    kotlinc -Xsuppress-warning=NOTHING_TO_INLINE -Xsuppress-warning=NO_TAIL_CALLS_FOUND main.kt
    ```

    </tab>
    <tab title="빌드 파일">

    ```kotlin
    // build.gradle.kts
    kotlin {
        compilerOptions {
            freeCompilerArgs.addAll(
                listOf(
                    "-Xsuppress-warning=NOTHING_TO_INLINE",
                    "-Xsuppress-warning=NO_TAIL_CALLS_FOUND"
                )
            )
        }
    }
    ```

    </tab>
    </tabs>

### K2 kapt 구현 개선

> K2 컴파일러용 kapt 플러그인(K2 kapt)은 [알파](components-stability.md#stability-levels-explained) 상태입니다.
> 언제든지 변경될 수 있습니다.
> 
> [YouTrack](https://youtrack.jetbrains.com/issue/KT-71439/K2-kapt-feedback)에 피드백을 주시면 감사하겠습니다.
>
{style="warning"}

현재 [kapt](kapt.md) 플러그인을 사용하는 프로젝트는 기본적으로 K1 컴파일러와 함께 작동하며, Kotlin 1.9 버전까지 지원합니다.

Kotlin 1.9.20에서는 K2 컴파일러(K2 kapt)가 포함된 kapt 플러그인의 실험적 구현을 출시했습니다.
이제 기술 및 성능 문제를 완화하기 위해 K2 kapt의 내부 구현을 개선했습니다.

새로운 K2 kapt 구현은 새로운 기능을 도입하지는 않지만,
이전 K2 kapt 구현에 비해 성능이 크게 향상되었습니다.
또한 K2 kapt 플러그인의 동작은 이제 K1 kapt와 훨씬 더 유사합니다.

새로운 K2 kapt 플러그인 구현을 사용하려면 이전 K2 kapt 플러그인과 동일하게 활성화하세요.
프로젝트의 `gradle.properties` 파일에 다음 옵션을 추가하세요:

```kotlin
kapt.use.k2=true
```

향후 릴리스에서는 K2 kapt 구현이 K1 kapt 대신 기본적으로 활성화될 예정이므로,
더 이상 수동으로 활성화할 필요가 없습니다.

새로운 구현이 안정화되기 전에 [피드백](https://youtrack.jetbrains.com/issue/KT-71439/K2-kapt-feedback)을 주시면 대단히 감사하겠습니다.

### 부호 없는 타입과 비-프리미티브 타입 간의 오버로드 충돌 해결

이번 릴리스는 이전 버전에서 부호 없는 타입과 비-프리미티브 타입에 대해 함수가 오버로드되었을 때 발생할 수 있는 오버로드 충돌 해결 문제를 해결합니다.
다음 예시를 참조하세요.

#### 오버로드된 확장 함수

```kotlin
fun Any.doStuff() = "Any"
fun UByte.doStuff() = "UByte"

fun main() {
    val uByte: UByte = UByte.MIN_VALUE
    uByte.doStuff() // Overload resolution ambiguity before Kotlin 2.1.0
}
```

이전 버전에서는 `uByte.doStuff()`를 호출하면 `Any`와 `UByte` 확장 함수 모두 적용 가능했기 때문에 모호성이 발생했습니다.

#### 오버로드된 최상위 함수

```kotlin
fun doStuff(value: Any) = "Any"
fun doStuff(value: UByte) = "UByte"

fun main() {
    val uByte: UByte = UByte.MIN_VALUE
    doStuff(uByte) // Overload resolution ambiguity before Kotlin 2.1.0
}
```

마찬가지로 `doStuff(uByte)` 호출은 컴파일러가 `Any` 버전과 `UByte` 버전 중 어느 것을 사용할지 결정할 수 없었기 때문에 모호했습니다.
2.1.0부터 컴파일러는 이러한 경우를 올바르게 처리하여,
이 경우 `UByte`와 같이 더 구체적인 타입에 우선순위를 부여하여 모호성을 해결합니다.

## Kotlin/JVM

버전 2.1.0부터 컴파일러는 Java 23 바이트코드를 포함하는 클래스를 생성할 수 있습니다.

### JSpecify 널 가능성 불일치 진단 심각도를 엄격으로 변경

Kotlin 2.1.0은 `org.jspecify.annotations`의 널 가능성 어노테이션에 대한 엄격한 처리를 적용하여,
Java 상호 운용성을 위한 타입 안전성을 향상시킵니다.

다음 널 가능성 어노테이션이 영향을 받습니다:

*   `org.jspecify.annotations.Nullable`
*   `org.jspecify.annotations.NonNull`
*   `org.jspecify.annotations.NullMarked`
*   `org.jspecify.nullness`의 레거시 어노테이션(JSpecify 0.2 이전)

Kotlin 2.1.0부터 널 가능성 불일치는 기본적으로 경고에서 오류로 상향 조정됩니다.
이는 `@NonNull` 및 `@Nullable`과 같은 어노테이션이 타입 검사 중에 적용되어 런타임에 예기치 않은 널 가능성 문제를 방지하도록 보장합니다.

`@NullMarked` 어노테이션은 또한 해당 범위 내의 모든 멤버의 널 가능성에 영향을 미쳐,
어노테이션이 지정된 Java 코드와 함께 작업할 때 동작을 더욱 예측 가능하게 만듭니다.

다음은 새로운 기본 동작을 보여주는 예시입니다:

```java
// Java
import org.jspecify.annotations.*;
public class SomeJavaClass {
    @NonNull
    public String foo() { //...
    }

    @Nullable
    public String bar() { //...
    }
}
```

```kotlin
// Kotlin
fun test(sjc: SomeJavaClass) {
    // Accesses a non-null result, which is allowed
    sjc.foo().length

    // Raises an error in the default strict mode because the result is nullable
    // To avoid the error, use ?.length instead
    sjc.bar().length
}
```

이러한 어노테이션에 대한 진단의 심각도를 수동으로 제어할 수 있습니다.
이를 위해 `-Xnullability-annotations` 컴파일러 옵션을 사용하여 모드를 선택하세요:

*   `ignore`: 널 가능성 불일치를 무시합니다.
*   `warning`: 널 가능성 불일치에 대한 경고를 보고합니다.
*   `strict`: 널 가능성 불일치에 대한 오류를 보고합니다(기본 모드).

자세한 내용은 [널 가능성 어노테이션](java-interop.md#nullability-annotations)을 참조하세요.

## Kotlin Multiplatform

Kotlin 2.1.0은 [Swift Export에 대한 기본 지원](#basic-support-for-swift-export)을 도입하고
[Kotlin Multiplatform 라이브러리 게시를 더 쉽게](#ability-to-publish-kotlin-libraries-from-any-host) 만듭니다.
또한 [컴파일러 옵션 구성을 위한 새로운 DSL](#new-gradle-dsl-for-compiler-options-in-multiplatform-projects-promoted-to-stable)을 안정화하고
[Isolated Projects 기능의 미리보기](#preview-gradle-s-isolated-projects-in-kotlin-multiplatform)를 제공하는 등 Gradle 주변 개선 사항에 중점을 둡니다.

### 멀티플랫폼 프로젝트 컴파일러 옵션을 위한 새 Gradle DSL이 안정화됨

Kotlin 2.0.0에서 [우리는 새로운 Experimental Gradle DSL을 도입했습니다](whatsnew20.md#new-gradle-dsl-for-compiler-options-in-multiplatform-projects).
이는 멀티플랫폼 프로젝트 전반에 걸쳐 컴파일러 옵션 구성을 간소화하기 위한 것입니다.
Kotlin 2.1.0에서는 이 DSL이 Stable로 승격되었습니다.

전반적인 프로젝트 구성은 이제 세 가지 계층을 가집니다. 가장 높은 계층은 확장 레벨이고,
그 다음은 타겟 레벨이며, 가장 낮은 계층은 컴파일 단위(일반적으로 컴파일 태스크)입니다.

![Kotlin 컴파일러 옵션 레벨](compiler-options-levels.svg){width=700}

다양한 레벨과 그 사이에서 컴파일러 옵션을 구성하는 방법에 대한 자세한 내용은
[컴파일러 옵션](https://kotlinlang.org/docs/multiplatform/multiplatform-dsl-reference.html#compiler-options)을 참조하세요.

### Kotlin Multiplatform에서 Gradle의 Isolated Projects 미리보기

> 이 기능은 [Experimental](components-stability.md#stability-levels-explained)이며 현재 Gradle에서 pre-Alpha 상태입니다.
> Gradle 버전 8.10에서만 평가 목적으로만 사용해야 합니다. 이 기능은 언제든지 제거되거나 변경될 수 있습니다.
> 
> [YouTrack](https://youtrack.jetbrains.com/issue/KT-57279/Support-Gradle-Project-Isolation-Feature-for-Kotlin-Multiplatform)에 대한 피드백을 주시면 감사하겠습니다. 
> 선택적 동의(`opt-in`)가 필요합니다(아래 세부 정보 참조).
>
{style="warning"}

Kotlin 2.1.0에서는
멀티플랫폼 프로젝트에서 Gradle의 [Isolated Projects](https://docs.gradle.org/current/userguide/isolated_projects.html) 기능을 미리 볼 수 있습니다.

Gradle의 Isolated Projects 기능은 개별 Gradle 프로젝트의 구성을 서로 "격리"하여 빌드 성능을 향상시킵니다.
각 프로젝트의 빌드 로직은 다른 프로젝트의 변경 가능한 상태에 직접 접근하는 것이 제한되어 안전하게 병렬로 실행할 수 있습니다.
이 기능을 지원하기 위해 Kotlin Gradle 플러그인의 모델을 일부 변경했으며,
이 미리보기 단계 동안 여러분의 경험에 대해 듣고 싶습니다.

Kotlin Gradle 플러그인의 새 모델을 활성화하는 두 가지 방법이 있습니다:

*   옵션 1: **Isolated Projects 활성화 없이 호환성 테스트** –
    Isolated Projects 기능을 활성화하지 않고 Kotlin Gradle 플러그인의 새 모델과의 호환성을 확인하려면
    프로젝트의 `gradle.properties` 파일에 다음 Gradle 속성을 추가하세요:

    ```none
    # gradle.properties
    kotlin.kmp.isolated-projects.support=enable
    ```

*   옵션 2: **Isolated Projects 활성화 시 테스트** –
    Gradle에서 Isolated Projects 기능을 활성화하면 Kotlin Gradle 플러그인이 자동으로 새 모델을 사용하도록 구성됩니다.
    Isolated Projects 기능을 활성화하려면 [시스템 속성을 설정하세요](https://docs.gradle.org/current/userguide/isolated_projects.html#how_do_i_use_it).
    이 경우 프로젝트에 Kotlin Gradle 플러그인에 대한 Gradle 속성을 추가할 필요가 없습니다.

### Swift Export를 위한 기본 지원

> 이 기능은 현재 개발 초기 단계에 있습니다. 언제든지 제거되거나 변경될 수 있습니다.
> 선택적 동의(`opt-in`)가 필요하며(아래 세부 정보 참조), 평가 목적으로만 사용해야 합니다.
> [YouTrack](https://kotl.in/issue)에 대한 피드백을 주시면 감사하겠습니다.
> 
{style="warning"}

버전 2.1.0은 Kotlin에서 Swift export를 지원하는 첫 걸음을 내딛었습니다.
이를 통해 Objective-C 헤더를 사용하지 않고도 Kotlin 소스를 Swift 인터페이스로 직접 export할 수 있습니다.
이는 Apple 타겟을 위한 멀티플랫폼 개발을 더 쉽게 만들어줄 것입니다.

현재 기본 지원에는 다음 기능이 포함됩니다:

*   Kotlin에서 여러 Gradle 모듈을 Swift로 직접 Export.
*   `moduleName` 속성으로 사용자 정의 Swift 모듈 이름 정의.
*   `flattenPackage` 속성으로 패키지 구조에 대한 축소 규칙 설정.

Swift Export 설정을 위한 시작점으로 프로젝트에서 다음 빌드 파일을 사용할 수 있습니다:

```kotlin
// build.gradle.kts 
kotlin {

    iosX64()
    iosArm64()
    iosSimulatorArm64()

    @OptIn(ExperimentalSwiftExportDsl::class)
    swiftExport {
        // Root module name
        moduleName = "Shared"

        // Collapse rule
        // Removes package prefix from generated Swift code
        flattenPackage = "com.example.sandbox"

        // Export external modules
        export(project(":subproject")) {
            // Exported module name
            moduleName = "Subproject"
            // Collapse exported dependency rule
            flattenPackage = "com.subproject.library"
        }
    }
}
```

Swift Export가 이미 설정된 [공개 샘플](https://github.com/Kotlin/swift-export-sample)을 복제할 수도 있습니다.

컴파일러는 필요한 모든 파일(`swiftmodule` 파일, 정적 `a` 라이브러리, 헤더 및 `modulemap` 파일 포함)을 자동으로 생성하여
앱의 빌드 디렉터리로 복사하며, Xcode에서 이 디렉터리에 접근할 수 있습니다.

#### Swift Export 활성화 방법

이 기능은 현재 개발 초기 단계에 불과하다는 점을 명심하세요.

Swift Export는 현재 iOS 프레임워크를 Xcode 프로젝트에 연결하기 위해
[직접 통합](https://kotlinlang.org/docs/multiplatform/multiplatform-direct-integration.html)을 사용하는 프로젝트에서 작동합니다.
이는 Android Studio 또는 [웹 위자드](https://kmp.jetbrains.com/)를 통해 생성된 Kotlin Multiplatform 프로젝트의 표준 구성입니다.

프로젝트에서 Swift Export를 사용해 보려면:

1.  프로젝트의 `gradle.properties` 파일에 다음 Gradle 옵션을 추가하세요:

    ```none
    # gradle.properties
    kotlin.experimental.swift-export.enabled=true
    ```

2.  Xcode에서 프로젝트 설정을 엽니다.
3.  **Build Phases** 탭에서 `embedAndSignAppleFrameworkForXcode` 태스크가 있는 **Run Script** 단계를 찾으세요.
4.  실행 스크립트 단계에서 스크립트를 `embedSwiftExportForXcode` 태스크를 포함하도록 조정하세요:

    ```bash
    ./gradlew :<Shared module name>:embedSwiftExportForXcode
    ```

    ![Swift Export 스크립트 추가](xcode-swift-export-run-script-phase.png){width=700}

#### Swift Export에 대한 피드백 남기기

향후 Kotlin 릴리스에서 Swift Export 지원을 확장하고 안정화할 계획입니다.
[이 YouTrack 이슈](https://youtrack.jetbrains.com/issue/KT-64572)에 피드백을 남겨주세요.

### 모든 호스트에서 Kotlin 라이브러리 게시 기능

> 이 기능은 현재 [Experimental](components-stability.md#stability-levels-explained)입니다.
> 선택적 동의(`opt-in`)가 필요하며(아래 세부 정보 참조), 평가 목적으로만 사용해야 합니다.
> [YouTrack](https://youtrack.jetbrains.com/issue/KT-71290)에 대한 피드백을 주시면 감사하겠습니다.
>
{style="warning"}

Kotlin 컴파일러는 Kotlin 라이브러리 게시를 위해 `.klib` 아티팩트를 생성합니다.
이전에는 Apple 플랫폼 타겟을 제외한 모든 호스트에서 필요한 아티팩트를 얻을 수 있었습니다. Apple 플랫폼 타겟은 Mac 머신이 필요했습니다.
이로 인해 iOS, macOS, tvOS, watchOS 타겟을 대상으로 하는 Kotlin Multiplatform 프로젝트에 특별한 제약이 있었습니다.

Kotlin 2.1.0은 교차 컴파일 지원을 추가하여 이 제한을 해제합니다.
이제 어떤 호스트에서든 `.klib` 아티팩트를 생성할 수 있어,
Kotlin 및 Kotlin Multiplatform 라이브러리 게시 프로세스를 크게 단순화할 수 있습니다.

#### 모든 호스트에서 라이브러리 게시 기능 활성화 방법

프로젝트에서 교차 컴파일을 시도하려면 `gradle.properties` 파일에 다음 이진 옵션을 추가하세요:

```none
# gradle.properties
kotlin.native.enableKlibsCrossCompilation=true
```

이 기능은 현재 Experimental이며 몇 가지 제한 사항이 있습니다. 다음 경우에는 여전히 Mac 머신을 사용해야 합니다:

*   라이브러리에 [cinterop 종속성](native-c-interop.md)이 있는 경우.
*   프로젝트에 [CocoaPods 통합](https://kotlinlang.org/docs/multiplatform/multiplatform-cocoapods-overview.html)이 설정되어 있는 경우.
*   Apple 타겟용 [최종 바이너리](https://kotlinlang.org/docs/multiplatform/multiplatform-build-native-binaries.html)를 빌드하거나 테스트해야 하는 경우.

#### 모든 호스트에서 라이브러리 게시 기능에 대한 피드백 남기기

향후 Kotlin 릴리스에서 이 기능을 안정화하고 라이브러리 게시를 더욱 개선할 계획입니다.
[이슈 트래커 YouTrack](https://youtrack.jetbrains.com/issue/KT-71290)에 피드백을 남겨주세요.

자세한 내용은 [멀티플랫폼 라이브러리 게시](https://kotlinlang.org/docs/multiplatform/multiplatform-publish-lib-setup.html)를 참조하세요.

### 압축되지 않은 klib 지원

Kotlin 2.1.0은 압축되지 않은 `.klib` 파일 아티팩트 생성을 가능하게 합니다.
이를 통해 klib을 먼저 압축 해제하지 않고도 직접 klib에 종속성을 구성할 수 있습니다.

이 변경은 또한 Kotlin/Wasm, Kotlin/JS 및 Kotlin/Native 프로젝트의 컴파일 및 링크 시간을 단축하여 성능을 향상시킬 수 있습니다.

예를 들어,
우리의 벤치마크는 10개의 컴파일 태스크와 1개의 링크 태스크가 있는 프로젝트에서 총 빌드 시간에서 약 3%의 성능 향상을 보여줍니다
(이 프로젝트는 9개의 단순화된 프로젝트에 종속된 단일 네이티브 실행 바이너리를 빌드합니다).
그러나 빌드 시간에 대한 실제 영향은 서브프로젝트 수와 각 크기에 따라 달라집니다.

#### 프로젝트 설정 방법

기본적으로 Kotlin 컴파일 및 링크 태스크는 이제 새로운 압축되지 않은 아티팩트를 사용하도록 구성됩니다.

klib 해결을 위해 사용자 정의 빌드 로직을 설정했고 새로운 압축 해제된 아티팩트를 사용하려면,
Gradle 빌드 파일에서 klib 패키지 해결의 선호하는 변형을 명시적으로 지정해야 합니다:

```kotlin
// build.gradle.kts
import org.jetbrains.kotlin.gradle.plugin.attributes.KlibPackaging
// ...
val resolvableConfiguration = configurations.resolvable("resolvable") {

    // For the new non-packed configuration:
    attributes.attribute(KlibPackaging.ATTRIBUTE, project.objects.named(KlibPackaging.NON_PACKED))

    // For the previous packed configuration:
    attributes.attribute(KlibPackaging.ATTRIBUTE, project.objects.named(KlibPackaging.PACKED))
}
```

압축되지 않은 `.klib` 파일은 이전에 압축된 파일이 있던 프로젝트의 빌드 디렉터리에 동일한 경로로 생성됩니다.
반면에 압축된 klib은 이제 `build/libs` 디렉터리에 있습니다.

속성이 지정되지 않은 경우 압축된 변형이 사용됩니다.
다음 콘솔 명령을 사용하여 사용 가능한 속성 및 변형 목록을 확인할 수 있습니다:

```shell
./gradlew outgoingVariants
```

[YouTrack](https://kotl.in/issue)에 이 기능에 대한 피드백을 주시면 감사하겠습니다.

### 기존 `android` 타겟의 추가적인 사용 중단

Kotlin 2.1.0에서는 기존 `android` 타겟 이름에 대한 사용 중단 경고가 오류로 상향 조정되었습니다.

현재는 Android를 대상으로 하는 Kotlin Multiplatform 프로젝트에서 `androidTarget` 옵션을 사용하는 것을 권장합니다.
이는 Google의 예정된 Android/KMP 플러그인을 위해 `android` 이름을 확보하는 데 필요한 임시 솔루션입니다.

새로운 플러그인이 출시되면 추가 마이그레이션 지침을 제공할 예정입니다.
Google의 새로운 DSL은 Kotlin Multiplatform에서 Android 타겟 지원을 위한 선호되는 옵션이 될 것입니다.

자세한 내용은
[Kotlin Multiplatform 호환성 가이드](https://kotlinlang.org/docs/multiplatform/multiplatform-compatibility-guide.html#rename-of-android-target-to-androidtarget)를 참조하세요.

### 동일한 타입의 다중 타겟 선언 지원 중단

Kotlin 2.1.0 이전에는 멀티플랫폼 프로젝트에서 동일한 타입의 여러 타겟을 선언할 수 있었습니다.
그러나 이로 인해 타겟을 구별하고 공유 소스 세트를 효과적으로 지원하는 것이 어려워졌습니다.
대부분의 경우 별도의 Gradle 프로젝트를 사용하는 것과 같은 더 간단한 설정이 더 효과적입니다.
마이그레이션 방법 및 예시에 대한 자세한 지침은
Kotlin Multiplatform 호환성 가이드의 [여러 유사 타겟 선언](https://kotlinlang.org/docs/multiplatform/multiplatform-compatibility-guide.html#declaring-several-similar-targets)을 참조하세요.

Kotlin 1.9.20은 멀티플랫폼 프로젝트에서 동일한 타입의 여러 타겟을 선언하면 사용 중단 경고를 발생시켰습니다.
Kotlin 2.1.0에서는 이 사용 중단 경고가 Kotlin/JS 타겟을 제외한 모든 타겟에 대해 이제 오류가 됩니다.
Kotlin/JS 타겟이 예외인 이유에 대한 자세한 내용은
[YouTrack](https://youtrack.jetbrains.com/issue/KT-47038/KJS-MPP-Split-JS-target-into-JsBrowser-and-JsNode)의 이 이슈를 참조하세요.

## Kotlin/Native

Kotlin 2.1.0에는 [`iosArm64` 타겟 지원 업그레이드](#iosarm64-promoted-to-tier-1),
[cinterop 캐싱 프로세스 개선](#changes-to-caching-in-cinterop) 및 기타 업데이트가 포함되어 있습니다.

### iosArm64가 Tier 1으로 승격

[Kotlin Multiplatform](https://kotlinlang.org/docs/multiplatform/get-started.html) 개발에 필수적인 `iosArm64` 타겟이 Tier 1으로 승격되었습니다. 이는 Kotlin/Native 컴파일러에서 가장 높은 수준의 지원입니다.

이는 타겟이 컴파일 및 실행이 가능하도록 CI 파이프라인에서 정기적으로 테스트됨을 의미합니다.
또한 타겟에 대해 컴파일러 릴리스 간의 소스 및 바이너리 호환성을 제공합니다.

타겟 티어에 대한 자세한 내용은 [Kotlin/Native 타겟 지원](native-target-support.md)을 참조하세요.

### LLVM 11.1.0에서 16.0.0으로 업데이트

Kotlin 2.1.0에서는 LLVM이 11.1.0 버전에서 16.0.0 버전으로 업데이트되었습니다.
새 버전에는 버그 수정 및 보안 업데이트가 포함되어 있습니다.
특정 경우에는 컴파일러 최적화 및 더 빠른 컴파일을 제공하기도 합니다.

프로젝트에 Linux 타겟이 있는 경우,
Kotlin/Native 컴파일러는 이제 모든 Linux 타겟에 대해 기본적으로 `lld` 링커를 사용한다는 점에 유의하세요.

이 업데이트는 코드에 영향을 미치지 않아야 하지만, 문제가 발생하면 [이슈 트래커](http://kotl.in/issue)에 보고해 주십시오.

### cinterop 캐싱 변경

Kotlin 2.1.0에서는 cinterop 캐싱 프로세스에 변경 사항이 있습니다. 더 이상
[`CacheableTask`](https://docs.gradle.org/current/javadoc/org/gradle/api/tasks/CacheableTask.html) 어노테이션 타입을 사용하지 않습니다.
새로운 권장 접근 방식은 태스크 결과를 캐시하기 위해
[`cacheIf`](https://docs.gradle.org/current/kotlin-dsl/gradle/org.gradle.api.tasks/-task-outputs/cache-if.html) 출력 타입을 사용하는 것입니다.

이는 `UP-TO-DATE`
검사가 [정의 파일](native-definition-file.md)에 지정된 헤더 파일 변경 사항을 감지하지 못하여
빌드 시스템이 코드를 다시 컴파일하지 못하게 하는 문제를 해결해야 합니다.

### mimalloc 메모리 할당자 사용 중단

Kotlin 1.9.0에서 새로운 메모리 할당자를 도입한 후, Kotlin 1.9.20에서 기본적으로 활성화했습니다.
새로운 할당자는 가비지 컬렉션을 더 효율적으로 만들고 Kotlin/Native 메모리 관리자의 런타임 성능을 향상시키도록 설계되었습니다.

새로운 메모리 할당자는 이전 기본 할당자인 [mimalloc](https://github.com/microsoft/mimalloc)을 대체했습니다.
이제 Kotlin/Native 컴파일러에서 mimalloc을 사용 중단할 때입니다.

이제 빌드 스크립트에서 `-Xallocator=mimalloc` 컴파일러 옵션을 제거할 수 있습니다.
문제가 발생하면 [이슈 트래커](http://kotl.in/issue)에 보고해 주십시오.

Kotlin의 메모리 할당자 및 가비지 컬렉션에 대한 자세한 내용은
[Kotlin/Native 메모리 관리](native-memory-manager.md)를 참조하세요.

## Kotlin/Wasm

Kotlin/Wasm은 [증분 컴파일 지원](#support-for-incremental-compilation)과 함께 여러 업데이트를 받았습니다.

### 증분 컴파일 지원

이전에는 Kotlin 코드에서 무언가를 변경할 때마다 Kotlin/Wasm 툴체는 전체 코드베이스를 다시 컴파일해야 했습니다.

2.1.0부터 Wasm 타겟에 대한 증분 컴파일이 지원됩니다.
개발 태스크에서 컴파일러는 이제 마지막 컴파일 이후 변경 사항과 관련된 파일만 다시 컴파일하므로,
컴파일 시간을 눈에 띄게 줄입니다.

이 변경으로 현재 컴파일 속도가 두 배가 되었으며, 향후 릴리스에서 더욱 개선할 계획입니다.

현재 설정에서 Wasm 타겟에 대한 증분 컴파일은 기본적으로 비활성화되어 있습니다.
증분 컴파일을 활성화하려면 프로젝트의 `local.properties` 또는 `gradle.properties` 파일에 다음 줄을 추가하세요:

```none
# gradle.properties
kotlin.incremental.wasm=true
```

Kotlin/Wasm 증분 컴파일을 사용해 보고 [피드백을 공유](https://youtrack.jetbrains.com/issue/KT-72158/Kotlin-Wasm-incremental-compilation-feedback)해 주십시오.
여러분의 의견은 이 기능을 Stable로 만들고 기본적으로 활성화하는 데 도움이 될 것입니다.

### 브라우저 API가 kotlinx-browser 독립형 라이브러리로 이동

이전에는 웹 API 및 관련 타겟 유틸리티에 대한 선언이 Kotlin/Wasm 표준 라이브러리의 일부였습니다.

이번 릴리스에서는 `org.w3c.*`
선언이 Kotlin/Wasm 표준 라이브러리에서 새로운 [kotlinx-browser 라이브러리](https://github.com/kotlin/kotlinx-browser)로 이동되었습니다.
이 라이브러리에는 `org.khronos.webgl`, `kotlin.dom`, `kotlinx.browser`와 같은 다른 웹 관련 패키지도 포함되어 있습니다.

이 분리는 모듈성을 제공하여 Kotlin의 릴리스 주기와 별개로 웹 관련 API를 독립적으로 업데이트할 수 있도록 합니다.
또한 Kotlin/Wasm 표준 라이브러리는 이제 모든 JavaScript 환경에서 사용할 수 있는 선언만 포함합니다.

이동된 패키지의 선언을 사용하려면
프로젝트의 빌드 구성 파일에 `kotlinx-browser` 종속성을 추가해야 합니다:

```kotlin
// build.gradle.kts
val wasmJsMain by getting {
    dependencies {
        implementation("org.jetbrains.kotlinx:kotlinx-browser:0.3")
    }
}
```

### Kotlin/Wasm 디버깅 경험 개선

이전에는 웹 브라우저에서 Kotlin/Wasm 코드를 디버깅할 때,
디버깅 인터페이스에서 변수 값의 저수준 표현을 접했을 수 있습니다.
이로 인해 종종 애플리케이션의 현재 상태를 추적하는 것이 어려웠습니다.

![Kotlin/Wasm 기존 디버거](wasm-old-debugger.png){width=700}

이 경험을 개선하기 위해 변수 뷰에 사용자 정의 포매터가 추가되었습니다.
이 구현은 Firefox 및 Chromium 기반 브라우저와 같은 주요 브라우저에서 지원되는 [사용자 정의 포매터 API](https://firefox-source-docs.mozilla.org/devtools-user/custom_formatters/index.html)를 사용합니다.

이 변경으로 이제 변수 값을 더 사용자 친화적이고 이해하기 쉬운 방식으로 표시하고 찾을 수 있습니다.

![Kotlin/Wasm 개선된 디버거](wasm-debugger-improved.png){width=700}

새로운 디버깅 경험을 사용해 보려면:

1.  `wasmJs {}` 컴파일러 옵션에 다음 컴파일러 옵션을 추가하세요:

    ```kotlin
    // build.gradle.kts
    kotlin {
        wasmJs {
            // ...
    
            compilerOptions {
                freeCompilerArgs.add("-Xwasm-debugger-custom-formatters")
            }
        }
    }
    ```

2.  브라우저에서 사용자 정의 포매터를 활성화하세요:

    *   Chrome DevTools에서는 **Settings | Preferences | Console**을 통해 사용할 수 있습니다:

        ![Chrome에서 사용자 정의 포매터 활성화](wasm-custom-formatters-chrome.png){width=700}

    *   Firefox DevTools에서는 **Settings | Advanced settings**을 통해 사용할 수 있습니다:

        ![Firefox에서 사용자 정의 포매터 활성화](wasm-custom-formatters-firefox.png){width=700}

### Kotlin/Wasm 바이너리 크기 감소

제품 빌드로 생성된 Wasm 바이너리 크기가 최대 30%까지 감소하며,
성능 향상도 기대할 수 있습니다.
이는 `--closed-world`, `--type-ssa`, `--type-merging` Binaryen 옵션이
모든 Kotlin/Wasm 프로젝트에서 안전하게 사용될 수 있다고 간주되어 기본적으로 활성화되었기 때문입니다.

### Kotlin/Wasm에서 JavaScript 배열 상호 운용성 개선

이전에는 Kotlin/Wasm의 표준 라이브러리가 JavaScript 배열용 `JsArray<T>` 타입을 제공했지만,
`JsArray<T>`를 Kotlin의 네이티브 `Array` 또는 `List` 타입으로 변환하는 직접적인 메서드는 없었습니다.

이러한 공백으로 인해 배열 변환을 위한 사용자 정의 함수를 생성해야 했으며,
Kotlin과 JavaScript 코드 간의 상호 운용성을 복잡하게 만들었습니다.

이번 릴리스에서는 `JsArray<T>`를 `Array<T>`로 자동 변환하고 그 반대로 변환하는 어댑터 함수를 도입하여
배열 작업을 단순화했습니다.

다음은 제네릭 타입인 Kotlin `List<T>` 및 `Array<T>`와 JavaScript `JsArray<T>` 간의 변환 예시입니다.

```kotlin
val list: List<JsString> =
    listOf("Kotlin", "Wasm").map { it.toJsString() }

// Uses .toJsArray() to convert List or Array to JsArray
val jsArray: JsArray<JsString> = list.toJsArray()

// Uses .toArray() and .toList() to convert it back to Kotlin types 
val kotlinArray: Array<JsString> = jsArray.toArray()
val kotlinList: List<JsString> = jsArray.toList()
```

유형 배열을 해당 Kotlin 동등물로 변환하는 유사한 메서드도 사용할 수 있습니다
(예: `IntArray` 및 `Int32Array`). 자세한 정보 및 구현은
[`kotlinx-browser` 저장소](https://github.com/Kotlin/kotlinx-browser/blob/dfbdceed314567983c98f1d66e8c2e10d99c5a55/src/wasmJsMain/kotlin/arrayCopy.kt)를 참조하세요.

다음은 유형 배열, 즉 Kotlin `IntArray`에서 JavaScript `Int32Array`로의 변환 예시입니다.

```kotlin
import org.khronos.webgl.*

    // ...

    val intArray: IntArray = intArrayOf(1, 2, 3)
    
    // Uses .toInt32Array() to convert Kotlin IntArray to JavaScript Int32Array
    val jsInt32Array: Int32Array = intArray.toInt32Array()
    
    // Uses toIntArray() to convert JavaScript Int32Array back to Kotlin IntArray
    val kotlinIntArray: IntArray = jsInt32Array.toIntArray()
```

### Kotlin/Wasm에서 JavaScript 예외 상세 정보 접근 지원

이전에는 Kotlin/Wasm에서 JavaScript 예외가 발생했을 때,
`JsException` 타입이 원본 JavaScript 오류의 상세 정보 없이 일반 메시지만 제공했습니다.

Kotlin 2.1.0부터 특정 컴파일러 옵션을 활성화하여
`JsException`에 원본 오류 메시지 및 스택 트레이스를 포함하도록 구성할 수 있습니다.
이는 JavaScript에서 발생하는 문제를 진단하는 데 더 많은 컨텍스트를 제공합니다.

이 동작은 `WebAssembly.JSTag` API에 따라 달라지며, 특정 브라우저에서만 사용할 수 있습니다:

*   **Chrome**: 버전 115부터 지원
*   **Firefox**: 버전 129부터 지원
*   **Safari**: 아직 지원되지 않음

기본적으로 비활성화된 이 기능을 활성화하려면
`build.gradle.kts` 파일에 다음 컴파일러 옵션을 추가하세요:

```kotlin
// build.gradle.kts
kotlin {
    wasmJs {
        compilerOptions {
            freeCompilerArgs.add("-Xwasm-attach-js-exception")
        }
    }
}
```

다음은 새로운 동작을 보여주는 예시입니다:

```kotlin
external object JSON {
    fun <T: JsAny> parse(json: String): T
}

fun main() {
    try {
        JSON.parse("an invalid JSON")
    } catch (e: JsException) {
        println("Thrown value is: ${e.thrownValue}")
        // SyntaxError: Unexpected token 'a', "an invalid JSON" is not valid JSON

        println("Message: ${e.message}")
        // Message: Unexpected token 'a', "an invalid JSON" is not valid JSON

        println("Stacktrace:")
        // Stacktrace:

        // Prints the full JavaScript stack trace 
        e.printStackTrace()
    }
}
```

`-Xwasm-attach-js-exception` 옵션이 활성화되면 `JsException`은 JavaScript 오류에서 특정 세부 정보를 제공합니다.
옵션이 없으면 `JsException`은 JavaScript 코드 실행 중 예외가 발생했음을 나타내는 일반 메시지만 포함합니다.

### 기본 export 사용 중단

이름이 지정된 export로의 마이그레이션의 일환으로,
이전에는 JavaScript에서 Kotlin/Wasm export에 기본 import를 사용하면 콘솔에 오류가 출력되었습니다.

2.1.0에서는 이름이 지정된 export를 완전히 지원하기 위해 기본 import가 완전히 제거되었습니다.

이제 Kotlin/Wasm 타겟용 JavaScript 코드를 작성할 때, 기본 import 대신 해당 이름이 지정된 import를 사용해야 합니다.

이 변경은 이름이 지정된 export로 마이그레이션하기 위한 사용 중단 주기의 마지막 단계를 나타냅니다.

**버전 2.0.0:** 기본 export를 통해 엔터티를 export하는 것이 사용 중단되었다는 경고 메시지가 콘솔에 출력되었습니다.

**버전 2.0.20:** 해당 이름이 지정된 import를 사용하도록 요청하는 오류가 발생했습니다.

**버전 2.1.0:** 기본 import 사용이 완전히 제거되었습니다.

### 서브프로젝트별 Node.js 설정

`rootProject`에 대한 `NodeJsRootPlugin` 클래스의 속성을 정의하여 프로젝트에 대한 Node.js 설정을 구성할 수 있습니다.
2.1.0에서는 새로운 클래스 `NodeJsPlugin`을 사용하여 각 서브프로젝트에 대한 이러한 설정을 구성할 수 있습니다.
다음은 서브프로젝트에 대한 특정 Node.js 버전을 설정하는 방법을 보여주는 예시입니다:

```kotlin
// build.gradle.kts
project.plugins.withType<org.jetbrains.kotlin.gradle.targets.js.nodejs.NodeJsPlugin> {
    project.the<org.jetbrains.kotlin.gradle.targets.js.nodejs.NodeJsEnvSpec>().version = "22.0.0"
}
```

전체 프로젝트에 새 클래스를 사용하려면 `allprojects {}` 블록에 동일한 코드를 추가하세요:

```kotlin
// build.gradle.kts
allprojects {
    project.plugins.withType<org.jetbrains.kotlin.gradle.targets.js.nodejs.NodeJsPlugin> {
        project.the<org.jetbrains.kotlin.gradle.targets.js.nodejs.NodeJsEnvSpec>().version = "your Node.js version"
    }
}
```

Gradle 컨벤션 플러그를 사용하여 특정 서브프로젝트 세트에 설정을 적용할 수도 있습니다.

## Kotlin/JS

### 속성에서 비식별자 문자 지원

Kotlin/JS는 이전에는 역따옴표로 묶인 공백이 있는 [테스트 메서드 이름](coding-conventions.md#names-for-test-methods)을 사용할 수 없었습니다.

마찬가지로, 하이픈이나 공백과 같이 Kotlin 식별자에 허용되지 않는 문자를 포함하는 JavaScript 객체 속성에 접근할 수 없었습니다.

```kotlin
external interface Headers {
    var accept: String?

    // Invalid Kotlin identifier due to hyphen
    var `content-length`: String?
}

val headers: Headers = TODO("value provided by a JS library")
val accept = headers.accept
// Causes error due to the hyphen in property name
val length = headers.`content-length`
```

이 동작은 JavaScript 및 TypeScript와 달랐는데, 이들은 그러한 속성이 비식별자 문자를 사용하여 접근될 수 있도록 허용합니다.

Kotlin 2.1.0부터 이 기능은 기본적으로 활성화됩니다.
Kotlin/JS는 이제 역따옴표(``)와 `@JsName` 어노테이션을 사용하여 비식별자 문자를 포함하는 JavaScript 속성과 상호 작용하고 테스트 메서드 이름을 사용할 수 있도록 합니다.

또한,
`@JsName` 및 `@JsQualifier` 어노테이션을 사용하여 Kotlin 속성 이름을 JavaScript 동등물에 매핑할 수 있습니다:

```kotlin
object Bar {
    val `property example`: String = "bar"
}

@JsQualifier("fooNamespace")
external object Foo {
    val `property example`: String
}

@JsExport
object Baz {
    val `property example`: String = "bar"
}

fun main() {
    // In JavaScript, this is compiled into Bar.property_example_HASH
    println(Bar.`property example`)
    // In JavaScript, this is compiled into fooNamespace["property example"]
    println(Foo.`property example`)
    // In JavaScript, this is compiled into Baz["property example"]
    println(Baz.`property example`)
}
```

### ES2015 화살표 함수 생성 지원

Kotlin 2.1.0에서 Kotlin/JS는 익명 함수 대신 `(a, b) => expression`과 같은 ES2015 화살표 함수 생성을 지원합니다.

화살표 함수를 사용하면 프로젝트의 번들 크기를 줄일 수 있으며,
특히 실험적인 `-Xir-generate-inline-anonymous-functions` 모드를 사용할 때 더욱 그렇습니다.
또한 생성된 코드가 최신 JS에 더 잘 부합하도록 만듭니다.

이 기능은 ES2015를 대상으로 할 때 기본적으로 활성화됩니다.
또는 `-Xes-arrow-functions` 명령줄 인수를 사용하여 활성화할 수 있습니다.

[공식 문서의 ES2015 (ECMAScript 2015, ES6)](https://262.ecma-international.org/6.0/)에 대해 자세히 알아보세요.

## Gradle 개선

Kotlin 2.1.0은 Gradle 7.6.3부터 8.6까지 완전히 호환됩니다.
Gradle 버전 8.7부터 8.10까지도 지원되지만, 한 가지 예외가 있습니다.
Kotlin Multiplatform Gradle 플러그인을 사용하는 경우,
JVM 타겟에서 `withJava()` 함수를 호출하는 멀티플랫폼 프로젝트에서 사용 중단 경고가 표시될 수 있습니다.
이 문제는 가능한 한 빨리 해결할 계획입니다.

자세한 내용은 [YouTrack](https://youtrack.jetbrains.com/issue/KT-66542)의 관련 이슈를 참조하세요.

최신 Gradle 릴리스까지의 Gradle 버전도 사용할 수 있지만,
그렇게 하는 경우 사용 중단 경고가 발생하거나 일부 새로운 Gradle 기능이 작동하지 않을 수 있다는 점을 염두에 두세요.

### 최소 지원 AGP 버전이 7.3.1로 상향 조정

Kotlin 2.1.0부터 최소 지원 Android Gradle 플러그인 버전은 7.3.1입니다.

### 최소 지원 Gradle 버전이 7.6.3로 상향 조정

Kotlin 2.1.0부터 최소 지원 Gradle 버전은 7.6.3입니다.

### Kotlin Gradle 플러그인 확장을 위한 새 API

Kotlin 2.1.0은 Kotlin Gradle 플러그인을 구성하기 위한 자체 플러그인을 더 쉽게 생성할 수 있도록 새로운 API를 도입했습니다.
이 변경으로 `KotlinTopLevelExtension` 및 `KotlinTopLevelExtensionConfig` 인터페이스가 사용 중단되고,
플러그인 작성자를 위한 다음 인터페이스가 도입되었습니다:

| 이름                     | 설명                                                                                                                                                                                                                                                          |
| :----------------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `KotlinBaseExtension`    | 전체 프로젝트에 대한 공통 Kotlin JVM, Android 및 Multiplatform 플러그인 옵션을 구성하기 위한 플러그인 DSL 확장 타입:<list><li>`org.jetbrains.kotlin.jvm`</li><li>`org.jetbrains.kotlin.android`</li><li>`org.jetbrains.jetbrains.kotlin.multiplatform`</li></list> |
| `KotlinJvmExtension`     | 전체 프로젝트에 대한 Kotlin **JVM** 플러그인 옵션을 구성하기 위한 플러그인 DSL 확장 타입.                                                                                                                                                                    |
| `KotlinAndroidExtension` | 전체 프로젝트에 대한 Kotlin **Android** 플러그인 옵션을 구성하기 위한 플러그인 DSL 확장 타입.                                                                                                                                                                |

예를 들어, JVM 및 Android 프로젝트 모두에 대해 컴파일러 옵션을 구성하려면 `KotlinBaseExtension`을 사용하세요:

```kotlin
configure<KotlinBaseExtension> {
    if (this is HasConfigurableKotlinCompilerOptions<*>) {
        with(compilerOptions) {
            if (this is KotlinJvmCompilerOptions) {
                jvmTarget.set(JvmTarget.JVM_17)
            }
        }
    }
}
```

이는 JVM 및 Android 프로젝트 모두에 대해 JVM 타겟을 17로 구성합니다.

JVM 프로젝트에 대해 컴파일러 옵션을 구체적으로 구성하려면 `KotlinJvmExtension`을 사용하세요:

```kotlin
configure<KotlinJvmExtension> {
    compilerOptions {
        jvmTarget.set(JvmTarget.JVM_17)
    }

    target.mavenPublication {
        groupId = "com.example"
        artifactId = "example-project"
        version = "1.0-SNAPSHOT"
    }
}
```

이 예시도 마찬가지로 JVM 프로젝트에 대해 JVM 타겟을 17로 구성합니다.
또한 프로젝트의 출력이 Maven 저장소에 게시되도록 프로젝트에 대한 Maven Publication을 구성합니다.

`KotlinAndroidExtension`도 정확히 같은 방식으로 사용할 수 있습니다.

### Kotlin Gradle 플러그인 API에서 컴파일러 심볼 숨김

이전에는 KGP가 런타임 종속성에 `org.jetbrains.kotlin:kotlin-compiler-embeddable`을 포함하여,
내부 컴파일러 심볼을 빌드 스크립트 클래스패스에서 사용할 수 있도록 했습니다.
이러한 심볼은 내부 용도로만 사용될 예정이었습니다.

Kotlin 2.1.0부터 KGP는 `org.jetbrains.kotlin:kotlin-compiler-embeddable` 클래스 파일의 하위 집합을 JAR 파일에 번들로 제공하고 점진적으로 제거합니다.
이 변경은 호환성 문제를 방지하고 KGP 유지 보수를 단순화하는 것을 목표로 합니다.

`kotlinter`와 같은 플러그인과 같은 빌드 로직의 다른 부분이 KGP에 번들로 제공되는 버전과 다른 버전의 `org.jetbrains.kotlin:kotlin-compiler-embeddable`에 종속되는 경우,
충돌 및 런타임 예외가 발생할 수 있습니다.

이러한 문제를 방지하기 위해 KGP는 이제 `org.jetbrains.kotlin:kotlin-compiler-embeddable`이 KGP와 함께 빌드 클래스패스에 존재하는 경우 경고를 표시합니다.

장기적인 해결책으로, `org.jetbrains.kotlin:kotlin-compiler-embeddable` 클래스를 사용하는 플러그인 작성자인 경우
격리된 클래스 로더에서 실행하는 것을 권장합니다.
예를 들어, 클래스 로더 또는 프로세스 격리를 사용하여 [Gradle Workers API](https://docs.gradle.org/current/userguide/worker_api.html)를 사용하여 이를 달성할 수 있습니다.

#### Gradle Workers API 사용

이 예시는 Gradle 플러그인을 생성하는 프로젝트에서 Kotlin 컴파일러를 안전하게 사용하는 방법을 보여줍니다.
먼저, 빌드 스크립트에 컴파일 전용 종속성을 추가합니다.
이렇게 하면 컴파일 시에만 심볼을 사용할 수 있습니다.

```kotlin
// build.gradle.kts
dependencies {
    compileOnly("org.jetbrains.kotlin:kotlin-compiler-embeddable:%kotlinVersion%")
}
```

다음으로, Kotlin 컴파일러 버전을 출력하는 Gradle 작업 액션을 정의합니다:

```kotlin
import org.gradle.workers.WorkAction
import org.gradle.workers.WorkParameters
import org.jetbrains.kotlin.config.KotlinCompilerVersion
abstract class ActionUsingKotlinCompiler : WorkAction<WorkParameters.None> {
    override fun execute() {
        println("Kotlin compiler version: ${KotlinCompilerVersion.getVersion()}")
    }
}
```

이제 이 액션을 클래스 로더 격리를 사용하여 작업자 실행기에 제출하는 태스크를 생성합니다:

```kotlin
import org.gradle.api.DefaultTask
import org.gradle.api.file.ConfigurableFileCollection
import org.gradle.api.tasks.Classpath
import org.gradle.api.tasks.TaskAction
import org.gradle.workers.WorkerExecutor
import javax.inject.Inject
abstract class TaskUsingKotlinCompiler: DefaultTask() {
    @get:Inject
    abstract val executor: WorkerExecutor

    @get:Classpath
    abstract val kotlinCompiler: ConfigurableFileCollection

    @TaskAction
    fun compile() {
        val workQueue = executor.classLoaderIsolation {
            classpath.from(kotlinCompiler)
        }
        workQueue.submit(ActionUsingKotlinCompiler::class.java) {}
    }
}
```

마지막으로, Gradle 플러그인에서 Kotlin 컴파일러 클래스패스를 구성합니다:

```kotlin
import org.gradle.api.Plugin
import org.gradle.api.Project
abstract class MyPlugin: Plugin<Project> {
    override fun apply(target: Project) {
        val myDependencyScope = target.configurations.create("myDependencyScope")
        target.dependencies.add(myDependencyScope.name, "$KOTLIN_COMPILER_EMBEDDABLE:$KOTLIN_COMPILER_VERSION")
        val myResolvableConfiguration = target.configurations.create("myResolvable") {
            extendsFrom(myDependencyScope)
        }
        target.tasks.register("myTask", TaskUsingKotlinCompiler::class.java) {
            kotlinCompiler.from(myResolvableConfiguration)
        }
    }

    companion object {
        const val KOTLIN_COMPILER_EMBEDDABLE = "org.jetbrains.kotlin:kotlin-compiler-embeddable"
        const val KOTLIN_COMPILER_VERSION = "%kotlinVersion%"
    }
}
```

## Compose 컴파일러 업데이트

### 여러 안정성 구성 파일 지원

Compose 컴파일러는 여러 안정성 구성 파일을 해석할 수 있지만,
Compose 컴파일러 Gradle 플러그인의 `stabilityConfigurationFile` 옵션은 이전에는 단일 파일만 지정할 수 있었습니다.
Kotlin 2.1.0에서는 이 기능이 단일 모듈에 대해 여러 안정성 구성 파일을 사용할 수 있도록 재작업되었습니다:

*   `stabilityConfigurationFile` 옵션은 사용 중단됩니다.
*   `ListProperty<RegularFile>` 타입의 새로운 옵션 `stabilityConfigurationFiles`가 있습니다.

새로운 옵션을 사용하여 여러 파일을 Compose 컴파일러에 전달하는 방법은 다음과 같습니다:

```kotlin
// build.gradle.kt
composeCompiler {
    stabilityConfigurationFiles.addAll(
        project.layout.projectDirectory.file("configuration-file1.conf"),
        project.layout.projectDirectory.file("configuration-file2.conf"),
    )
}
```

### 일시 중지 가능한 컴포지션

일시 중지 가능한 컴포지션은 컴파일러가 건너뛸 수 있는 함수를 생성하는 방식을 변경하는 새로운 Experimental 기능입니다.
이 기능이 활성화되면 런타임 중 건너뛰는 지점에서 컴포지션이 일시 중단될 수 있어,
오래 실행되는 컴포지션 프로세스를 여러 프레임으로 분할할 수 있습니다.
일시 중지 가능한 컴포지션은 레이지 리스트 및 기타 성능 집약적인 컴포넌트에서
차단 방식으로 실행될 때 프레임 드롭을 유발할 수 있는 콘텐츠를 미리 가져오는 데 사용됩니다.

일시 중지 가능한 컴포지션을 사용해 보려면 Compose 컴파일러의 Gradle 구성에 다음 기능 플래그를 추가하세요:

```kotlin
// build.gradle.kts
composeCompiler {
    featureFlags = setOf(
        ComposeFeatureFlag.PausableComposition
    )
}
```

> 이 기능에 대한 런타임 지원은 `androidx.compose.runtime`의 1.8.0-alpha02 버전에 추가되었습니다.
> 이전 런타임 버전과 함께 사용하면 기능 플래그는 효과가 없습니다.
>
{style="note"}

### 열리고 오버라이드된 @Composable 함수 변경

가상(open, abstract, overridden) `@Composable` 함수는 더 이상 재시작 가능하지 않습니다.
재시작 가능한 그룹에 대한 코드 생성은 상속과 [올바르게 작동하지 않는](https://issuetracker.google.com/329477544) 호출을 생성하여 런타임 충돌을 일으켰습니다.

이는 가상 함수가 다시 시작되거나 건너뛰어지지 않음을 의미합니다.
상태가 무효화될 때마다 런타임은 대신 상위 컴포저블을 재구성합니다.
코드가 재구성에 민감한 경우 런타임 동작의 변경 사항을 알아차릴 수 있습니다.

### 성능 개선

Compose 컴파일러는 이전에 모듈의 IR 전체 복사본을 생성하여 `@Composable` 타입을 변환했습니다.
Compose와 관련 없는 요소를 복사할 때 메모리 소비가 증가하는 것 외에도,
이러한 동작은 [특정 예외적인 경우](https://issuetracker.google.com/365066530)에서 다운스트림 컴파일러 플러그인을 손상시키기도 했습니다.

이 복사 작업이 제거되어 잠재적으로 컴파일 시간이 단축되었습니다.

## 표준 라이브러리

### 표준 라이브러리 API의 사용 중단 심각도 변경

Kotlin 2.1.0에서는 여러 표준 라이브러리 API의 사용 중단 심각도 수준을 경고에서 오류로 상향 조정하고 있습니다.
코드가 이러한 API에 의존하는 경우 호환성을 보장하기 위해 업데이트해야 합니다.
가장 주목할 만한 변경 사항은 다음과 같습니다:

*   **`Char` 및 `String`에 대한 로케일 의존적 대소문자 변환 함수가 사용 중단됩니다:**
    `Char.toLowerCase()`, `Char.toUpperCase()`, `String.toUpperCase()`,
    및 `String.toLowerCase()`와 같은 함수는 이제 사용 중단되며, 이를 사용하면 오류가 발생합니다.
    로케일 독립적 함수 대체 또는 다른 대소문자 변환 메커니즘으로 대체하세요.
    기본 로케일을 계속 사용하려면 `String.toLowerCase()`와 같은 호출을 `String.lowercase(Locale.getDefault())`로 대체하여 로케일을 명시적으로 지정하세요.
    로케일 독립적 변환의 경우, `String.lowercase()`로 대체하세요. 이 함수는 기본적으로 불변 로케일을 사용합니다.

*   **Kotlin/Native 동결 API가 사용 중단됩니다:**
    이전에 `@FreezingIsDeprecated` 어노테이션으로 표시된 동결 관련 선언을 사용하면 이제 오류가 발생합니다.
    이 변경은 Kotlin/Native의 레거시 메모리 관리자에서 전환을 반영합니다.
    레거시 메모리 관리자는 스레드 간에 객체를 공유하기 위해 객체 동결을 요구했습니다.
    새로운 메모리 모델에서 동결 관련 API에서 마이그레이션하는 방법을 알아보려면
    [Kotlin/Native 마이그레이션 가이드](native-migration-guide.md#update-your-code)를 참조하세요.
    자세한 내용은 [동결 사용 중단에 대한 공지](whatsnew1720.md#freezing)를 참조하세요.

*   **`appendln()`이 `appendLine()`로 대체됩니다:**
    `StringBuilder.appendln()` 및 `Appendable.appendln()` 함수는 이제 사용 중단되며, 이를 사용하면 오류가 발생합니다.
    이를 대체하려면 `StringBuilder.appendLine()` 또는 `Appendable.appendLine()` 함수를 사용하세요.
    `appendln()` 함수는 Kotlin/JVM에서 각 OS마다 기본값이 다른 `line.separator` 시스템 속성을 사용하기 때문에 사용 중단됩니다.
    Kotlin/JVM에서 이 속성은 Windows에서는 기본적으로 `\r
` (CR LF)이고 다른 시스템에서는 `
` (LF)입니다.
    반면에 `appendLine()` 함수는 일관되게 `
` (LF)를 줄 구분자로 사용하여 플랫폼 간에 일관된 동작을 보장합니다.

이번 릴리스에서 영향을 받는 API의 전체 목록은 [KT-71628](https://youtrack.jetbrains.com/issue/KT-71628) YouTrack 이슈를 참조하세요.

### `java.nio.file.Path`를 위한 안정적인 파일 트리 탐색 확장

Kotlin 1.7.20은 파일 트리를 탐색할 수 있는 `java.nio.file.Path` 클래스에 대한 Experimental [확장 함수](extensions.md#extension-functions)를 도입했습니다.
Kotlin 2.1.0에서는 다음 파일 트리 탐색 확장이 이제 [Stable](components-stability.md#stability-levels-explained)입니다:

*   `walk()`는 지정된 경로에 뿌리를 둔 파일 트리를 지연 방식으로 탐색합니다.
*   `fileVisitor()`는 `FileVisitor`를 별도로 생성할 수 있도록 합니다.
    `FileVisitor`는 탐색 중에 디렉터리와 파일에서 수행할 작업을 지정합니다.
*   `visitFileTree(fileVisitor: FileVisitor, ...)`는 파일 트리를 탐색하며,
    각 항목에 대해 지정된 `FileVisitor`를 호출하고, 내부적으로 `java.nio.file.Files.walkFileTree()` 함수를 사용합니다.
*   `visitFileTree(..., builderAction: FileVisitorBuilder.() -> Unit)`는 제공된 `builderAction`으로 `FileVisitor`를 생성하고
    `visitFileTree(fileVisitor, ...)` 함수를 호출합니다.
*   `sealed interface FileVisitorBuilder`는 사용자 정의 `FileVisitor` 구현을 정의할 수 있도록 합니다.
*   `enum class PathWalkOption`은 `Path.walk()` 함수에 대한 탐색 옵션을 제공합니다.

아래 예시는 이러한 파일 탐색 API를 사용하여 사용자 정의 `FileVisitor` 동작을 생성하는 방법을 보여줍니다.
이를 통해 파일 및 디렉터리 방문에 대한 특정 작업을 정의할 수 있습니다.

예를 들어, `FileVisitor`를 명시적으로 생성하고 나중에 사용할 수 있습니다:

```kotlin
val cleanVisitor = fileVisitor {
    onPreVisitDirectory { directory, attributes ->
        // Placeholder: Add logic on visiting directories
        FileVisitResult.CONTINUE
    }

    onVisitFile { file, attributes ->
        // Placeholder: Add logic on visiting files
        FileVisitResult.CONTINUE
    }
}

// Placeholder: Add logic here for general setup before traversal
projectDirectory.visitFileTree(cleanVisitor)
```

또한 `builderAction`으로 `FileVisitor`를 생성하고 즉시 탐색에 사용할 수도 있습니다:

```kotlin
projectDirectory.visitFileTree {
    // Defines the builderAction:
    onPreVisitDirectory { directory, attributes ->
        // Some logic on visiting directories
        FileVisitResult.CONTINUE
    }

    onVisitFile { file, attributes ->
        // Some logic on visiting files
        FileVisitResult.CONTINUE
    }
}
```

추가적으로, `walk()` 함수를 사용하여 지정된 경로에 뿌리를 둔 파일 트리를 탐색할 수 있습니다:

```kotlin
fun traverseFileTree() {
    val cleanVisitor = fileVisitor {
        onPreVisitDirectory { directory, _ ->
            if (directory.name == "build") {
                directory.toFile().deleteRecursively()
                FileVisitResult.SKIP_SUBTREE
            } else {
                FileVisitResult.CONTINUE
            }
        }

        // Deletes files with the .class extension
        onVisitFile { file, _ ->
            if (file.extension == "class") {
                file.deleteExisting()
            }
            FileVisitResult.CONTINUE
        }
    }

    // Sets up the root directory and files
    val rootDirectory = createTempDirectory("Project")

    // Creates the src directory with A.kt and A.class files
    rootDirectory.resolve("src").let { srcDirectory ->
        srcDirectory.createDirectory()
        srcDirectory.resolve("A.kt").createFile()
        srcDirectory.resolve("A.class").createFile()
    }

    // Creates the build directory with a Project.jar file
    rootDirectory.resolve("build").let { buildDirectory ->
        buildDirectory.createDirectory()
        buildDirectory.resolve("Project.jar").createFile()
    }

    // Uses the walk() function:
    val directoryStructure = rootDirectory.walk(PathWalkOption.INCLUDE_DIRECTORIES)
        .map { it.relativeTo(rootDirectory).toString() }
        .toList().sorted()
    println(directoryStructure)
    // "[, build, build/Project.jar, src, src/A.class, src/A.kt]"
  
    // Traverses the file tree with cleanVisitor, applying the rootDirectory.visitFileTree(cleanVisitor) cleanup rules
    val directoryStructureAfterClean = rootDirectory.walk(PathWalkOption.INCLUDE_DIRECTORIES)
        .map { it.relativeTo(rootDirectory).toString() }
        .toList().sorted()
    println(directoryStructureAfterClean)
    // "[, src, src/A.kt]"
}
```

## 문서 업데이트

Kotlin 문서에 몇 가지 주목할 만한 변경 사항이 있었습니다:

### 언어 개념

*   [널 안전](null-safety.md) 페이지 개선 – 코드에서 `null` 값을 안전하게 처리하는 방법을 알아보세요.
*   [객체 선언 및 표현식](object-declarations.md) 페이지 개선 –
    단일 단계에서 클래스를 정의하고 인스턴스를 생성하는 방법을 알아보세요.
*   [When 표현식 및 문](control-flow.md#when-expressions-and-statements) 섹션 업데이트 –
    `when` 조건문과 사용 방법을 알아보세요.
*   [Kotlin 로드맵](roadmap.md), [Kotlin 진화 원칙](kotlin-evolution-principles.md),
    및 [Kotlin 언어 기능 및 제안](kotlin-language-features-and-proposals.md) 페이지 업데이트 –
    Kotlin의 계획, 진행 중인 개발 및 기본 원칙에 대해 알아보세요.

### Compose 컴파일러

*   [Compose 컴파일러 문서](compose-compiler-migration-guide.md)가 이제 컴파일러 및 플러그인 섹션에 위치 –
    Compose 컴파일러, 컴파일러 옵션 및 마이그레이션 단계를 알아보세요.

### API 참조

*   새로운 [Kotlin Gradle 플러그인 API 참조](https://kotlinlang.org/api/kotlin-gradle-plugin) –
    Kotlin Gradle 플러그인 및 Compose 컴파일러 Gradle 플러그인의 API 참조를 살펴보세요.

### 멀티플랫폼 개발

*   새로운 [멀티플랫폼용 Kotlin 라이브러리 빌드](https://kotlinlang.org/docs/api-guidelines-build-for-multiplatform.html) 페이지 –
    Kotlin Multiplatform용 Kotlin 라이브러리를 설계하는 방법을 알아보세요.
*   새로운 [Kotlin Multiplatform 소개](https://kotlinlang.org/docs/multiplatform/get-started.html) 페이지 – Kotlin Multiplatform의 주요 개념, 종속성, 라이브러리 등을 알아보세요.
*   [Kotlin Multiplatform 개요](multiplatform.topic) 페이지 업데이트 – Kotlin Multiplatform의 필수 요소 및 인기 있는 사용 사례를 탐색하세요.
*   새로운 [iOS 통합](https://kotlinlang.org/docs/multiplatform/multiplatform-ios-integration-overview.html) 섹션 – Kotlin Multiplatform 공유 모듈을 iOS 앱에 통합하는 방법을 알아보세요.
*   새로운 [Kotlin/Native의 정의 파일](native-definition-file.md) 페이지 – C 및 Objective-C 라이브러리를 사용하기 위한 정의 파일을 생성하는 방법을 알아보세요.
*   [WASI 시작하기](wasm-wasi.md) –
    다양한 WebAssembly 가상 머신에서 WASI를 사용하여 간단한 Kotlin/Wasm 애플리케이션을 실행하는 방법을 알아보세요.

### 도구

*   [새로운 Dokka 마이그레이션 가이드](dokka-migration.md) – Dokka Gradle 플러그인 v2로 마이그레이션하는 방법을 알아보세요.

## Kotlin 2.1.0 호환성 가이드

Kotlin 2.1.0은 기능 릴리스이므로,
이전 버전의 언어로 작성된 코드와 호환되지 않는 변경 사항이 있을 수 있습니다.
이러한 변경 사항에 대한 자세한 목록은 [Kotlin 2.1.0 호환성 가이드](compatibility-guide-21.md)에서 확인하세요.

## Kotlin 2.1.0 설치

IntelliJ IDEA 2023.3 및 Android Studio Iguana (2023.2.1) Canary 15부터 Kotlin 플러그인은 IDE에 번들로 포함된 플러그인으로 배포됩니다. 이는 더 이상 JetBrains Marketplace에서 플러그인을 설치할 수 없음을 의미합니다.

새로운 Kotlin 버전으로 업데이트하려면 빌드 스크립트에서 [Kotlin 버전을 변경](releases.md#update-to-a-new-kotlin-version)하여 2.1.0으로 설정하세요.