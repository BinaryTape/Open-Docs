[//]: # (title: Kotlin 2.1.0의 새로운 기능)

_[출시일: 2024년 11월 27일](releases.md#release-details)_

Kotlin 2.1.0이 출시되었습니다! 주요 내용은 다음과 같습니다.

*   **미리 보기로 제공되는 새로운 언어 기능**: [Guard conditions (주어문이 있는 `when`에서의 조건)](#guard-conditions-in-when-with-a-subject),
    [비로컬 `break` 및 `continue`](#non-local-break-and-continue), 그리고 [다중 달러 문자열 보간](#multi-dollar-string-interpolation).
*   **K2 컴파일러 업데이트**: [컴파일러 검사 유연성 향상](#extra-compiler-checks) 및 [kapt 구현 개선](#improved-k2-kapt-implementation).
*   **Kotlin Multiplatform**: [Swift 내보내기 기본 지원](#basic-support-for-swift-export) 도입,
    [컴파일러 옵션을 위한 안정화된 Gradle DSL](#new-gradle-dsl-for-compiler-options-in-multiplatform-projects-promoted-to-stable) 등.
*   **Kotlin/Native**: [`iosArm64` 지원 개선](#iosarm64-promoted-to-tier-1) 및 기타 업데이트.
*   **Kotlin/Wasm**: [증분 컴파일 지원](#support-for-incremental-compilation)을 포함한 다양한 업데이트.
*   **Gradle 지원**: [최신 Gradle 및 Android Gradle 플러그인 버전과의 호환성 개선](#gradle-improvements)과 함께
    [Kotlin Gradle 플러그인 API 업데이트](#new-api-for-kotlin-gradle-plugin-extensions).
*   **문서**: [Kotlin 문서의 상당한 개선](#documentation-updates).

## IDE 지원

2.1.0을 지원하는 Kotlin 플러그인은 최신 IntelliJ IDEA 및 Android Studio에 번들로 제공됩니다.
IDE에서 Kotlin 플러그인을 업데이트할 필요가 없습니다.
빌드 스크립트에서 Kotlin 버전을 2.1.0으로 변경하기만 하면 됩니다.

자세한 내용은 [새로운 Kotlin 버전으로 업데이트](releases.md#update-to-a-new-kotlin-version)를 참조하세요.

## 언어

K2 컴파일러가 포함된 Kotlin 2.0.0 출시 이후, JetBrains 팀은 새로운 기능을 통해 언어를 개선하는 데 집중하고 있습니다.
이번 릴리스에서는 여러 가지 새로운 언어 디자인 개선 사항을 발표하게 되어 기쁩니다.

이 기능들은 미리 보기로 제공됩니다. 여러분께서 사용해 보시고 피드백을 공유해 주시길 권장합니다.

*   [Guard conditions (주어문이 있는 `when`에서의 조건)](#guard-conditions-in-when-with-a-subject)
*   [비로컬 `break` 및 `continue`](#non-local-break-and-continue)
*   [다중 달러 보간: 문자열 리터럴에서 `$` 기호 처리 개선](#multi-dollar-string-interpolation)

> 모든 기능은 K2 모드가 활성화된 최신 IntelliJ IDEA 2024.3 버전에서 IDE 지원을 제공합니다.
>
> 자세한 내용은 [IntelliJ IDEA 2024.3 블로그 게시물](https://blog.jetbrains.com/idea/2024/11/intellij-idea-2024-3/)에서 알아보세요.
>
{style="tip"}

[Kotlin 언어 디자인 기능 및 제안의 전체 목록](kotlin-language-features-and-proposals.md)을 참조하세요.

이번 릴리스에는 다음 언어 업데이트도 포함되어 있습니다.

*   [](#support-for-requiring-opt-in-to-extend-apis)
*   [](#improved-overload-resolution-for-functions-with-generic-types)
*   [](#improved-exhaustiveness-checks-for-when-expressions-with-sealed-classes)

### Guard conditions (주어문이 있는 `when`에서의 조건)

> 이 기능은 [미리 보기](kotlin-evolution-principles.md#pre-stable-features) 상태이며, 옵트인(opt-in)이 필요합니다 (아래 세부 정보 참조).
>
> YouTrack에서 [여러분](https://youtrack.jetbrains.com/issue/KT-71140)의 피드백을 보내주시면 감사하겠습니다.
>
{style="warning"}

2.1.0부터 주어(subject)가 있는 `when` 표현식 또는 문에서 가드 조건(guard conditions)을 사용할 수 있습니다.

가드 조건은 `when` 표현식의 브랜치에 둘 이상의 조건을 포함할 수 있도록 하여 복잡한 제어 흐름을 더 명확하고 간결하게 만들고 코드 구조를 평탄화합니다.

브랜치에 가드 조건을 포함하려면, 기본 조건 뒤에 `if`로 구분하여 배치하세요.

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
        // 기본 조건만 있는 브랜치입니다. `animal`이 `Dog`일 때 `feedDog()`를 호출합니다
        is Animal.Dog -> animal.feedDog()
        // 기본 조건과 가드 조건이 모두 있는 브랜치입니다. `animal`이 `Cat`이고 `mouseHunter`가 아닐 때 `feedCat()`를 호출합니다
        is Animal.Cat if !animal.mouseHunter -> animal.feedCat()
        // 위 조건 중 일치하는 것이 없을 경우 "Unknown animal"을 출력합니다
        else -> println("Unknown animal")
    }
}
```

단일 `when` 표현식에서 가드 조건이 있는 브랜치와 없는 브랜치를 결합할 수 있습니다.
가드 조건이 있는 브랜치의 코드는 기본 조건과 가드 조건이 모두 `true`인 경우에만 실행됩니다.
기본 조건이 일치하지 않으면 가드 조건은 평가되지 않습니다.
또한, 가드 조건은 `else if`를 지원합니다.

프로젝트에서 가드 조건을 활성화하려면 명령줄에서 다음 컴파일러 옵션을 사용하세요.

```bash
kotlinc -Xwhen-guards main.kt
```

또는 Gradle 빌드 파일의 `compilerOptions {}` 블록에 추가하세요.

```kotlin
// build.gradle.kts
kotlin {
    compilerOptions {
        freeCompilerArgs.add("-Xwhen-guards")
    }
}
```

### 비로컬 break 및 continue

> 이 기능은 [미리 보기](kotlin-evolution-principles.md#pre-stable-features) 상태이며, 옵트인(opt-in)이 필요합니다 (아래 세부 정보 참조).
>
> YouTrack에서 [여러분](https://youtrack.jetbrains.com/issue/KT-1436)의 피드백을 보내주시면 감사하겠습니다.
>
{style="warning"}

Kotlin 2.1.0은 오랫동안 기다려온 또 다른 기능인 비로컬 `break` 및 `continue`를 사용할 수 있는 기능을 미리 보기로 추가합니다.
이 기능은 인라인 함수 범위 내에서 사용할 수 있는 도구 세트를 확장하고 프로젝트의 상용구 코드(boilerplate code)를 줄여줍니다.

이전에는 비로컬 리턴(non-local returns)만 사용할 수 있었습니다.
이제 Kotlin은 `break` 및 `continue` [점프 표현식](returns.md)도 비로컬로 지원합니다.
이는 루프를 둘러싸는 인라인 함수에 인수로 전달된 람다 내에서 이를 적용할 수 있음을 의미합니다.

```kotlin
fun processList(elements: List<Int>): Boolean {
    for (element in elements) {
        val variable = element.nullableMethod() ?: run {
            log.warning("Element is null or invalid, continuing...")
            continue
        }
        if (variable == 0) return true // 변수가 0이면 true 반환
    }
    return false
}
```

프로젝트에서 이 기능을 사용해 보려면 명령줄에서 `-Xnon-local-break-continue` 컴파일러 옵션을 사용하세요.

```bash
kotlinc -Xnon-local-break-continue main.kt
```

또는 Gradle 빌드 파일의 `compilerOptions {}` 블록에 추가하세요.

```kotlin
// build.gradle.kts
kotlin {
    compilerOptions {
        freeCompilerArgs.add("-Xnon-local-break-continue")
    }
}
```

향후 Kotlin 릴리스에서 이 기능을 Stable로 만들 계획입니다.
비로컬 `break` 및 `continue`를 사용하는 동안 문제가 발생하면
저희 [이슈 트래커](https://youtrack.jetbrains.com/issue/KT-1436)에 보고해 주십시오.

### 다중 달러 문자열 보간

> 이 기능은 [미리 보기](kotlin-evolution-principles.md#pre-stable-features) 상태이며, 옵트인(opt-in)이 필요합니다 (아래 세부 정보 참조).
>
> YouTrack에서 [여러분](https://youtrack.jetbrains.com/issue/KT-2425)의 피드백을 보내주시면 감사하겠습니다.
>
{style="warning"}

Kotlin 2.1.0은 다중 달러 문자열 보간(multi-dollar string interpolation) 지원을 도입하여
문자열 리터럴 내에서 달러 기호(`$`)가 처리되는 방식을 개선합니다.
이 기능은 여러 달러 기호가 필요한 상황에서 유용합니다.
예를 들어 템플릿 엔진, JSON 스키마 또는 기타 데이터 형식 등입니다.

Kotlin의 문자열 보간은 단일 달러 기호를 사용합니다.
그러나 금융 데이터 및 템플릿 시스템에서 흔히 사용되는 리터럴 달러 기호를 문자열에 사용하려면
`${'$'}`와 같은 해결 방법이 필요했습니다.
다중 달러 보간 기능이 활성화되면 몇 개의 달러 기호가 보간을 트리거할지 구성할 수 있으며,
더 적은 달러 기호는 문자열 리터럴로 처리됩니다.

$를 사용하여 플레이스홀더가 있는 JSON 스키마 다중 행 문자열을 생성하는 방법의 예시입니다.

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

이 예시에서, 맨 앞의 `$`는 보간을 트리거하려면 **두 개의 달러 기호**(`$`)가 필요함을 의미합니다.
이는 `$schema`, `$id`, `$dynamicAnchor`가 보간 마커로 해석되는 것을 방지합니다.

이 접근 방식은 플레이스홀더 구문에 달러 기호를 사용하는 시스템에서 작업할 때 특히 유용합니다.

이 기능을 활성화하려면 명령줄에서 다음 컴파일러 옵션을 사용하세요.

```bash
kotlinc -Xmulti-dollar-interpolation main.kt
```

또는 Gradle 빌드 파일의 `compilerOptions {}` 블록을 업데이트하세요.

```kotlin
// build.gradle.kts
kotlin {
    compilerOptions {
        freeCompilerArgs.add("-Xmulti-dollar-interpolation")
    }
}
```

코드가 이미 단일 달러 기호를 사용하는 표준 문자열 보간을 사용하고 있다면 변경할 필요가 없습니다.
문자열에 리터럴 달러 기호가 필요할 때마다 `$`를 사용할 수 있습니다.

### API 확장에 옵트인(opt-in) 요구 사항 지원

Kotlin 2.1.0은 `@SubclassOptInRequired` 애너테이션을 도입하여,
라이브러리 작성자가 사용자가 실험적인 인터페이스를 구현하거나 실험적인 클래스를 확장하기 전에 명시적인 옵트인(opt-in)을 요구할 수 있도록 합니다.

이 기능은 라이브러리 API가 사용하기에 충분히 안정적이지만
새로운 추상 함수로 발전할 수 있어 상속에 불안정할 수 있는 경우에 유용합니다.

API 요소에 옵트인 요구 사항을 추가하려면 애너테이션 클래스에 대한 참조와 함께 `@SubclassOptInRequired` 애너테이션을 사용하세요.

```kotlin
@RequiresOptIn(
level = RequiresOptIn.Level.WARNING,
message = "Interfaces in this library are experimental"
)
annotation class UnstableApi()

@SubclassOptInRequired(UnstableApi::class)
interface CoreLibraryApi
```

이 예시에서 `CoreLibraryApi` 인터페이스는 사용자가 구현하기 전에 옵트인해야 합니다.
사용자는 다음과 같이 옵트인할 수 있습니다.

```kotlin
@OptIn(UnstableApi::class)
interface MyImplementation: CoreLibraryApi
```

> `@SubclassOptInRequired` 애너테이션을 사용하여 옵트인을 요구할 때,
> 해당 요구 사항은 [내부 또는 중첩 클래스](nested-classes.md)로 전파되지 않습니다.
>
{style="note"}

API에서 `@SubclassOptInRequired` 애너테이션을 사용하는 실제 예시를 보려면
`kotlinx.coroutines` 라이브러리의 `SharedFlow` 인터페이스를 확인해 보세요.

### 제네릭 타입을 가진 함수에 대한 오버로드 해결 개선

이전에는 함수에 여러 오버로드(overload)가 있을 때 일부는 제네릭 타입의 값 매개변수를 가지고 있고, 다른 일부는 같은 위치에 함수 타입을 가지고 있는 경우 해결 동작이 때때로 일관되지 않을 수 있었습니다.

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
    // 멤버 함수
    kvs.store("", 1)    // 1로 해결됨
    kvs.store("") { 1 } // 2로 해결됨

    // 확장 함수
    kvs.storeExtension("", 1)    // 1로 해결됨
    kvs.storeExtension("") { 1 } // 해결되지 않음
}
```

이 예시에서 `KeyValueStore` 클래스는 `store()` 함수에 대해 두 개의 오버로드를 가지고 있으며,
하나는 제네릭 타입 `K`와 `V`를 가진 함수 매개변수를 가지고 있고
다른 하나는 제네릭 타입 `V`를 반환하는 람다 함수를 가지고 있습니다.
마찬가지로 확장 함수 `storeExtension()`에도 두 개의 오버로드가 있습니다.

`store()` 함수가 람다 함수를 사용하거나 사용하지 않고 호출되었을 때 컴파일러는 올바른 오버로드를 성공적으로 해결했습니다.
그러나 확장 함수 `storeExtension()`이 람다 함수와 함께 호출되었을 때 컴파일러는 두 오버로드를 모두 적용 가능하다고 잘못 판단하여 올바른 오버로드를 해결하지 못했습니다.

이 문제를 해결하기 위해, 저희는 새로운 휴리스틱(heuristic)을 도입하여
제네릭 타입을 가진 함수 매개변수가 다른 인수의 정보에 기반하여 람다 함수를 받아들일 수 없을 때 컴파일러가 가능한 오버로드를 폐기할 수 있도록 했습니다.
이 변경 사항은 멤버 함수와 확장 함수의 동작을 일관되게 만들며,
Kotlin 2.1.0에서는 기본적으로 활성화됩니다.

### 봉인된 클래스를 가진 `when` 표현식에 대한 완전성 검사 개선

이전 Kotlin 버전에서는 컴파일러는 봉인된 상위 경계(sealed upper bounds)를 가진 타입 매개변수에 대해 `when` 표현식에서 `else` 브랜치를 요구했습니다. `sealed class` 계층 구조의 모든 케이스가 포함되었더라도 말입니다.
이러한 동작은 Kotlin 2.1.0에서 해결되고 개선되어
완전성 검사(exhaustiveness checks)를 더욱 강력하게 만들고 중복된 `else` 브랜치를 제거할 수 있게 하여,
`when` 표현식을 더 깔끔하고 직관적으로 유지합니다.

변경 사항을 보여주는 예시입니다.

```kotlin
sealed class Result
object Error: Result()
class Success(val value: String): Result()

fun <T : Result> render(result: T) = when (result) {
    Error -> "Error!"
    is Success -> result.value
    // else 브랜치가 필요 없음
}
```

## Kotlin K2 컴파일러

Kotlin 2.1.0에서 K2 컴파일러는 이제 [컴파일러 검사](#extra-compiler-checks) 및 [경고](#global-warning-suppression) 작업 시 더 많은 유연성을 제공하며, [kapt 플러그인에 대한 지원도 개선](#improved-k2-kapt-implementation)되었습니다.

### 추가 컴파일러 검사

Kotlin 2.1.0에서는 K2 컴파일러에서 추가 검사를 활성화할 수 있습니다.
이것들은 일반적으로 컴파일에 중요하지 않은 추가 선언, 표현식 및 타입 검사이지만
다음 경우를 검증하려는 경우 여전히 유용할 수 있습니다.

| 검사 유형                                             | 설명                                                                                         |
|-------------------------------------------------------|----------------------------------------------------------------------------------------------|
| `REDUNDANT_NULLABLE`                                  | `Boolean?` 대신 `Boolean??`가 사용됨                                                         |
| `PLATFORM_CLASS_MAPPED_TO_KOTLIN`                     | `kotlin.String` 대신 `java.lang.String`이 사용됨                                             |
| `ARRAY_EQUALITY_OPERATOR_CAN_BE_REPLACED_WITH_EQUALS` | `arrayOf("").contentEquals(arrayOf(""))` 대신 `arrayOf("") == arrayOf("")`가 사용됨 |
| `REDUNDANT_CALL_OF_CONVERSION_METHOD`                 | `42` 대신 `42.toInt()`가 사용됨                                                              |
| `USELESS_CALL_ON_NOT_NULL`                            | `""` 대신 `"".orEmpty()`가 사용됨                                                            |
| `REDUNDANT_SINGLE_EXPRESSION_STRING_TEMPLATE`         | `string` 대신 `"$string"`이 사용됨                                                           |
| `UNUSED_ANONYMOUS_PARAMETER`                          | 람다 표현식에 매개변수가 전달되었지만 사용되지 않음                                          |
| `REDUNDANT_VISIBILITY_MODIFIER`                       | `class Klass` 대신 `public class Klass`가 사용됨                                             |
| `REDUNDANT_MODALITY_MODIFIER`                         | `class Klass` 대신 `final class Klass`가 사용됨                                              |
| `REDUNDANT_SETTER_PARAMETER_TYPE`                     | `set(value)` 대신 `set(value: Int)`가 사용됨                                                 |
| `CAN_BE_VAL`                                          | `var local = 0`이 정의되었지만 재할당되지 않으므로 `val local = 42`로 변경 가능        |
| `ASSIGNED_VALUE_IS_NEVER_READ`                        | `val local = 42`가 정의되었지만 코드에서 이후에 사용되지 않음                              |
| `UNUSED_VARIABLE`                                     | `val local = 0`이 정의되었지만 코드에서 사용되지 않음                                        |
| `REDUNDANT_RETURN_UNIT_TYPE`                          | `fun foo() {}` 대신 `fun foo(): Unit {}`이 사용됨                                            |
| `UNREACHABLE_CODE`                                    | 코드 문이 존재하지만 실행될 수 없음                                                           |

검사가 true이면 문제를 해결하는 방법에 대한 제안과 함께 컴파일러 경고를 받게 됩니다.

추가 검사는 기본적으로 비활성화되어 있습니다.
활성화하려면 명령줄에서 `-Wextra` 컴파일러 옵션을 사용하거나 Gradle 빌드 파일의 `compilerOptions {}` 블록에 `extraWarnings`를 지정하세요.

```kotlin
// build.gradle.kts
kotlin {
    compilerOptions {
        extraWarnings.set(true)
    }
}
```

컴파일러 옵션을 정의하고 사용하는 방법에 대한 자세한 내용은 [Kotlin Gradle 플러그인의 컴파일러 옵션](gradle-compiler-options.md)을 참조하세요.

### 전역 경고 억제

2.1.0에서 Kotlin 컴파일러는 매우 요청이 많았던 기능을 받았습니다. 바로 경고를 전역적으로 억제하는 기능입니다.

이제 명령줄에서 `-Xsuppress-warning=WARNING_NAME` 구문을 사용하거나 빌드 파일의 `compilerOptions {}` 블록에 `freeCompilerArgs` 속성을 사용하여 전체 프로젝트에서 특정 경고를 억제할 수 있습니다.

예를 들어, 프로젝트에서 [추가 컴파일러 검사](#extra-compiler-checks)가 활성화되어 있지만 그 중 하나를 억제하고 싶다면 다음을 사용하세요.

```kotlin
// build.gradle.kts
kotlin {
    compilerOptions {
        extraWarnings.set(true)
        freeCompilerArgs.add("-Xsuppress-warning=CAN_BE_VAL")
    }
}
```

경고를 억제하고 싶지만 이름을 모르는 경우, 해당 요소를 선택하고 전구 아이콘을 클릭하세요 (또는 <shortcut>Cmd + Enter</shortcut>/<shortcut>Alt + Enter</shortcut> 사용):

![경고 이름 의도](warning-name-intention.png){width=500}

새 컴파일러 옵션은 현재 [실험적](components-stability.md#stability-levels-explained)입니다.
다음 세부 사항도 주목할 만합니다.

*   오류 억제는 허용되지 않습니다.
*   알 수 없는 경고 이름을 전달하면 컴파일 오류가 발생합니다.
*   여러 경고를 한 번에 지정할 수 있습니다.

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

> K2 컴파일러용 kapt 플러그인 (K2 kapt)은 [알파](components-stability.md#stability-levels-explained) 상태입니다.
> 언제든지 변경될 수 있습니다.
>
> YouTrack에서 [여러분](https://youtrack.jetbrains.com/issue/KT-71439/K2-kapt-feedback)의 피드백을 보내주시면 감사하겠습니다.
>
{style="warning"}

현재 [kapt](kapt.md) 플러그인을 사용하는 프로젝트는 기본적으로 K1 컴파일러와 함께 작동하며, Kotlin 1.9까지의 버전을 지원합니다.

Kotlin 1.9.20에서 저희는 K2 컴파일러(K2 kapt)와 함께 kapt 플러그인의 실험적 구현을 출시했습니다.
이제 K2 kapt의 내부 구현을 개선하여 기술 및 성능 문제를 완화했습니다.

새로운 K2 kapt 구현이 새로운 기능을 도입하지는 않지만, 이전 K2 kapt 구현에 비해 성능이 크게 향상되었습니다.
또한, K2 kapt 플러그인의 동작은 이제 K1 kapt의 동작에 훨씬 더 가깝습니다.

새로운 K2 kapt 플러그인 구현을 사용하려면 이전 K2 kapt 플러그인을 활성화했던 것처럼 활성화하세요.
프로젝트의 `gradle.properties` 파일에 다음 옵션을 추가하세요.

```kotlin
kapt.use.k2=true
```

향후 릴리스에서는 K1 kapt 대신 K2 kapt 구현이 기본적으로 활성화될 예정이므로, 더 이상 수동으로 활성화할 필요가 없습니다.

새로운 구현이 안정화되기 전에 여러분의 [피드백](https://youtrack.jetbrains.com/issue/KT-71439/K2-kapt-feedback)을 매우 감사하게 생각합니다.

### 부호 없는(unsigned) 타입과 비원시(non-primitive) 타입 간의 오버로드 충돌 해결

이번 릴리스에서는 이전 버전에서 함수가 부호 없는(unsigned) 타입과 비원시(non-primitive) 타입에 대해 오버로드되었을 때 발생할 수 있었던 오버로드 충돌 해결 문제를 다룹니다. 다음 예시와 같습니다.

#### 오버로드된 확장 함수

```kotlin
fun Any.doStuff() = "Any"
fun UByte.doStuff() = "UByte"

fun main() {
    val uByte: UByte = UByte.MIN_VALUE
    uByte.doStuff() // Kotlin 2.1.0 이전에는 오버로드 해결 모호성 발생
}
```

이전 버전에서는 `uByte.doStuff()` 호출이 모호성(ambiguity)을 초래했습니다. 이는 `Any`와 `UByte` 확장 모두 적용 가능했기 때문입니다.

#### 오버로드된 최상위 함수

```kotlin
fun doStuff(value: Any) = "Any"
fun doStuff(value: UByte) = "UByte"

fun main() {
    val uByte: UByte = UByte.MIN_VALUE
    doStuff(uByte) // Kotlin 2.1.0 이전에는 오버로드 해결 모호성 발생
}
```

마찬가지로 `doStuff(uByte)` 호출도 모호했습니다. 컴파일러가 `Any` 버전과 `UByte` 버전 중 어느 것을 사용할지 결정할 수 없었기 때문입니다.
2.1.0부터 컴파일러는 이러한 경우를 올바르게 처리하여, 더 구체적인 타입(이 경우 `UByte`)에 우선순위를 부여함으로써 모호성을 해결합니다.

## Kotlin/JVM

버전 2.1.0부터 컴파일러는 Java 23 바이트코드를 포함하는 클래스를 생성할 수 있습니다.

### JSpecify 널러블 불일치 진단 심각도(severity)를 엄격(strict)으로 변경

Kotlin 2.1.0은 `org.jspecify.annotations`의 널러블 애너테이션을 엄격하게 처리하도록 강제하여, Java 상호 운용성을 위한 타입 안전성을 향상시킵니다.

다음 널러블 애너테이션이 영향을 받습니다.

*   `org.jspecify.annotations.Nullable`
*   `org.jspecify.annotations.NonNull`
*   `org.jspecify.annotations.NullMarked`
*   `org.jspecify.nullness`의 레거시 애너테이션 (JSpecify 0.2 및 이전 버전)

Kotlin 2.1.0부터 널러블 불일치(nullability mismatches)는 기본적으로 경고에서 오류로 상향 조정됩니다.
이는 `@NonNull` 및 `@Nullable`과 같은 애너테이션이 타입 검사 중에 강제되어 런타임 시 예기치 않은 널러블 문제를 방지하도록 보장합니다.

`@NullMarked` 애너테이션은 또한 해당 범위 내의 모든 멤버의 널러블성에 영향을 미쳐, 애너테이션이 적용된 Java 코드와 작업할 때 동작을 더 예측 가능하게 만듭니다.

새로운 기본 동작을 보여주는 예시입니다.

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
    // null이 아닌 결과에 접근하며, 이는 허용됨
    sjc.foo().length

    // 결과가 널러블이므로 기본 엄격 모드에서 오류 발생
    // 오류를 피하려면 대신 ?.length 사용
    sjc.bar().length
}
```

이러한 애너테이션에 대한 진단(diagnostics)의 심각도를 수동으로 제어할 수 있습니다.
이렇게 하려면 `-Xnullability-annotations` 컴파일러 옵션을 사용하여 모드를 선택하세요.

*   `ignore`: 널러블 불일치를 무시합니다.
*   `warning`: 널러블 불일치에 대한 경고를 보고합니다.
*   `strict`: 널러블 불일치에 대한 오류를 보고합니다 (기본 모드).

자세한 내용은 [널러블 애너테이션](java-interop.md#nullability-annotations)을 참조하세요.

## Kotlin Multiplatform

Kotlin 2.1.0은 [Swift 내보내기 기본 지원](#basic-support-for-swift-export)을 도입하고 [Kotlin Multiplatform 라이브러리 게시를 더 쉽게](#ability-to-publish-kotlin-libraries-from-any-host) 만듭니다.
또한 Gradle 관련 개선 사항에 중점을 두어 [컴파일러 옵션 구성을 위한 새로운 DSL을 안정화](#new-gradle-dsl-for-compiler-options-in-multiplatform-projects-promoted-to-stable)하고 [Isolated Projects 기능의 미리 보기](#preview-gradle-s-isolated-projects-in-kotlin-multiplatform)를 제공합니다.

### 멀티플랫폼 프로젝트의 컴파일러 옵션을 위한 새로운 Gradle DSL이 Stable로 승격됨

Kotlin 2.0.0에서 저희는 [새로운 실험적 Gradle DSL](whatsnew20.md#new-gradle-dsl-for-compiler-options-in-multiplatform-projects)을 도입하여 멀티플랫폼 프로젝트 전반에 걸쳐 컴파일러 옵션 구성을 간소화했습니다.
Kotlin 2.1.0에서는 이 DSL이 Stable로 승격되었습니다.

전반적인 프로젝트 구성은 이제 세 가지 계층을 가집니다. 가장 높은 계층은 확장(extension) 수준이고, 그 다음은 타겟(target) 수준이며, 가장 낮은 계층은 컴파일 단위(일반적으로 컴파일 작업)입니다.

![Kotlin 컴파일러 옵션 수준](compiler-options-levels.svg){width=700}

다른 수준과 그 사이에서 컴파일러 옵션을 구성하는 방법에 대한 자세한 내용은 [컴파일러 옵션](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-dsl-reference.html#compiler-options)을 참조하세요.

### Kotlin Multiplatform에서 Gradle의 Isolated Projects 미리 보기

> 이 기능은 [실험적](components-stability.md#stability-levels-explained)이며 현재 Gradle에서 알파 이전(pre-Alpha) 상태입니다.
> Gradle 8.10 버전에서만 평가 목적으로 사용하세요. 이 기능은 언제든지 제거되거나 변경될 수 있습니다.
>
> YouTrack에서 [Kotlin Multiplatform용 Gradle 프로젝트 격리 기능 지원](https://youtrack.jetbrains.com/issue/KT-57279/Support-Gradle-Project-Isolation-Feature-for-Kotlin-Multiplatform)에 대한 여러분의 피드백을 보내주시면 감사하겠습니다.
> 옵트인(opt-in)이 필요합니다 (아래 세부 정보 참조).
>
{style="warning"}

Kotlin 2.1.0에서는 멀티플랫폼 프로젝트에서 Gradle의 [Isolated Projects](https://docs.gradle.org/current/userguide/isolated_projects.html) 기능을 미리 볼 수 있습니다.

Gradle의 Isolated Projects 기능은 개별 Gradle 프로젝트의 구성을 서로 '격리'하여 빌드 성능을 향상시킵니다.
각 프로젝트의 빌드 로직은 다른 프로젝트의 변경 가능한 상태에 직접 접근하는 것이 제한되어 안전하게 병렬로 실행될 수 있도록 합니다.
이 기능을 지원하기 위해 Kotlin Gradle 플러그인 모델에 일부 변경 사항을 적용했으며, 이 미리 보기 단계에서 여러분의 경험에 대한 의견을 듣고 싶습니다.

Kotlin Gradle 플러그인의 새 모델을 활성화하는 두 가지 방법이 있습니다.

*   옵션 1: **Isolated Projects 활성화 없이 호환성 테스트** –
    Isolated Projects 기능을 활성화하지 않고 Kotlin Gradle 플러그인의 새 모델과의 호환성을 확인하려면, 프로젝트의 `gradle.properties` 파일에 다음 Gradle 속성을 추가하세요.

    ```none
    # gradle.properties
    kotlin.kmp.isolated-projects.support=enable
    ```

*   옵션 2: **Isolated Projects 활성화하여 테스트** –
    Gradle에서 Isolated Projects 기능을 활성화하면 Kotlin Gradle 플러그인이 자동으로 새 모델을 사용하도록 구성됩니다.
    Isolated Projects 기능을 활성화하려면 [시스템 속성을 설정하세요](https://docs.gradle.org/current/userguide/isolated_projects.html#how_do_i_use_it).
    이 경우, 프로젝트에 Kotlin Gradle 플러그인용 Gradle 속성을 추가할 필요가 없습니다.

### Swift 내보내기 기본 지원

> 이 기능은 현재 개발 초기 단계에 있습니다. 언제든지 제거되거나 변경될 수 있습니다.
> 옵트인(opt-in)이 필요하며 (아래 세부 정보 참조), 평가 목적으로만 사용해야 합니다.
> YouTrack에서 [여러분](https://kotl.in/issue)의 피드백을 보내주시면 감사하겠습니다.
>
{style="warning"}

버전 2.1.0은 Kotlin에서 Swift 내보내기 지원을 제공하는 첫 단계를 밟으며,
Objective-C 헤더를 사용하지 않고 Kotlin 소스를 Swift 인터페이스로 직접 내보낼 수 있도록 합니다.
이는 Apple 타겟을 위한 멀티플랫폼 개발을 더 쉽게 만들 것입니다.

현재 기본 지원에는 다음 기능이 포함됩니다.

*   Kotlin에서 여러 Gradle 모듈을 Swift로 직접 내보내기.
*   `moduleName` 속성을 사용하여 사용자 지정 Swift 모듈 이름 정의.
*   `flattenPackage` 속성을 사용하여 패키지 구조에 대한 축소 규칙 설정.

프로젝트에서 다음 빌드 파일을 Swift 내보내기 설정의 시작점으로 사용할 수 있습니다.

```kotlin
// build.gradle.kts
kotlin {

    iosX64()
    iosArm64()
    iosSimulatorArm64()

    @OptIn(ExperimentalSwiftExportDsl::class)
    swiftExport {
        // 루트 모듈 이름
        moduleName = "Shared"

        // 축소 규칙
        // 생성된 Swift 코드에서 패키지 접두사 제거
        flattenPackage = "com.example.sandbox"

        // 외부 모듈 내보내기
        export(project(":subproject")) {
            // 내보내진 모듈 이름
            moduleName = "Subproject"
            // 내보내진 의존성 축소 규칙
            flattenPackage = "com.subproject.library"
        }
    }
}
```

Swift 내보내기가 이미 설정된 [공개 샘플](https://github.com/Kotlin/swift-export-sample)을 클론할 수도 있습니다.

컴파일러는 필요한 모든 파일(`swiftmodule` 파일, 정적 `a` 라이브러리, 헤더 및 `modulemap` 파일 포함)을 자동으로 생성하고
Xcode에서 접근할 수 있는 앱의 빌드 디렉토리로 복사합니다.

#### Swift 내보내기를 활성화하는 방법

이 기능은 현재 개발 초기 단계에 있다는 점을 명심하세요.

Swift 내보내기는 현재 iOS 프레임워크를 Xcode 프로젝트에 연결하기 위해 [직접 통합](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-direct-integration.html)을 사용하는 프로젝트에서 작동합니다.
이는 Android Studio 또는 [웹 마법사](https://kmp.jetbrains.com/)를 통해 생성된 Kotlin Multiplatform 프로젝트의 표준 구성입니다.

프로젝트에서 Swift 내보내기를 시도하려면:

1.  다음 Gradle 옵션을 `gradle.properties` 파일에 추가하세요.

    ```none
    # gradle.properties
    kotlin.experimental.swift-export.enabled=true
    ```

2.  Xcode에서 프로젝트 설정을 엽니다.
3.  **Build Phases** 탭에서 `embedAndSignAppleFrameworkForXcode` 작업이 포함된 **Run Script** 단계를 찾으세요.
4.  실행 스크립트 단계에서 스크립트를 `embedSwiftExportForXcode` 작업이 포함되도록 조정하세요.

    ```bash
    ./gradlew :<Shared module name>:embedSwiftExportForXcode
    ```

    ![Swift 내보내기 스크립트 추가](xcode-swift-export-run-script-phase.png){width=700}

#### Swift 내보내기에 대한 피드백 남기기

향후 Kotlin 릴리스에서 Swift 내보내기 지원을 확장하고 안정화할 계획입니다.
이 [YouTrack 이슈](https://youtrack.jetbrains.com/issue/KT-64572)에 피드백을 남겨주세요.

### 모든 호스트에서 Kotlin 라이브러리 게시 가능

> 이 기능은 현재 [실험적](components-stability.md#stability-levels-explained)입니다.
> 옵트인(opt-in)이 필요하며 (아래 세부 정보 참조), 평가 목적으로만 사용해야 합니다.
> YouTrack에서 [여러분](https://youtrack.jetbrains.com/issue/KT-71290)의 피드백을 보내주시면 감사하겠습니다.
>
{style="warning"}

Kotlin 컴파일러는 Kotlin 라이브러리 게시를 위해 `.klib` 아티팩트를 생성합니다.
이전에는 Mac 머신이 필요한 Apple 플랫폼 타겟을 제외하고 어떤 호스트에서든 필요한 아티팩트를 얻을 수 있었습니다.
이는 iOS, macOS, tvOS 및 watchOS 타겟을 대상으로 하는 Kotlin Multiplatform 프로젝트에 특별한 제약을 가했습니다.

Kotlin 2.1.0은 이 제약을 해제하고 교차 컴파일(cross-compilation)을 지원합니다.
이제 어떤 호스트에서도 `.klib` 아티팩트를 생성할 수 있으며, 이는 Kotlin 및 Kotlin Multiplatform 라이브러리의 게시 프로세스를 크게 간소화할 것입니다.

#### 모든 호스트에서 라이브러리 게시를 활성화하는 방법

프로젝트에서 교차 컴파일을 시도하려면, 다음 바이너리 옵션을 `gradle.properties` 파일에 추가하세요.

```none
# gradle.properties
kotlin.native.enableKlibsCrossCompilation=true
```

이 기능은 현재 실험적(Experimental)이며 몇 가지 제한 사항이 있습니다. 다음 경우에도 Mac 머신을 사용해야 합니다.

*   라이브러리에 [cinterop 의존성](native-c-interop.md)이 있는 경우.
*   프로젝트에 [CocoaPods 통합](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-cocoapods-overview.html)이 설정된 경우.
*   Apple 타겟용 [최종 바이너리](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-build-native-binaries.html)를 빌드하거나 테스트해야 하는 경우.

#### 모든 호스트에서 라이브러리 게시 피드백 남기기

향후 Kotlin 릴리스에서 이 기능을 안정화하고 라이브러리 게시를 더욱 개선할 계획입니다.
저희 이슈 트래커 [YouTrack](https://youtrack.jetbrains.com/issue/KT-71290)에 피드백을 남겨주세요.

자세한 내용은 [멀티플랫폼 라이브러리 게시](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-publish-lib-setup.html)를 참조하세요.

### 비압축 klibs 지원

Kotlin 2.1.0부터는 비압축(non-packed) `.klib` 파일 아티팩트 생성이 가능합니다.
이를 통해 klib에 대한 의존성을 먼저 압축 해제하지 않고 직접 구성할 수 있는 옵션이 제공됩니다.

이 변경 사항은 또한 성능을 향상시켜 Kotlin/Wasm, Kotlin/JS, Kotlin/Native 프로젝트의 컴파일 및 링크 시간을 단축할 수 있습니다.

예를 들어, 저희 벤치마크는 1개의 링크 작업과 10개의 컴파일 작업(9개의 간소화된 프로젝트에 의존하는 단일 네이티브 실행 바이너리를 빌드하는 프로젝트)이 있는 프로젝트에서 전체 빌드 시간의 약 3% 성능 향상을 보여줍니다.
그러나 빌드 시간에 미치는 실제 영향은 하위 프로젝트의 수와 각 크기에 따라 달라집니다.

#### 프로젝트 설정 방법

기본적으로 Kotlin 컴파일 및 링크 작업은 이제 새로운 비압축(non-packed) 아티팩트를 사용하도록 구성됩니다.

klib 해결을 위한 사용자 지정 빌드 로직을 설정했으며 새로운 압축 해제된 아티팩트를 사용하려면, Gradle 빌드 파일에서 klib 패키지 해결의 선호하는 변형을 명시적으로 지정해야 합니다.

```kotlin
// build.gradle.kts
import org.jetbrains.kotlin.gradle.plugin.attributes.KlibPackaging
// ...
val resolvableConfiguration = configurations.resolvable("resolvable") {

    // 새로운 비압축 구성의 경우:
    attributes.attribute(KlibPackaging.ATTRIBUTE, project.objects.named(KlibPackaging.NON_PACKED))

    // 이전 압축 구성의 경우:
    attributes.attribute(KlibPackaging.ATTRIBUTE, project.objects.named(KlibPackaging.PACKED))
}
```

비압축 `.klib` 파일은 이전에 압축된 파일이 있던 것과 동일한 경로의 프로젝트 빌드 디렉토리에 생성됩니다.
차례로, 압축된 klib는 이제 `build/libs` 디렉토리에 위치합니다.

속성이 지정되지 않으면 압축된 변형이 사용됩니다.
다음 콘솔 명령을 사용하여 사용 가능한 속성 및 변형 목록을 확인할 수 있습니다.

```shell
./gradlew outgoingVariants
```

YouTrack에서 [이 기능](https://kotl.in/issue)에 대한 여러분의 피드백을 보내주시면 감사하겠습니다.

### 기존 `android` 타겟의 추가 사용 중단

Kotlin 2.1.0에서는 기존 `android` 타겟 이름에 대한 사용 중단 경고가 오류로 상향 조정되었습니다.

현재 Android를 타겟으로 하는 Kotlin Multiplatform 프로젝트에서는 `androidTarget` 옵션을 사용하는 것을 권장합니다.
이는 Google의 곧 출시될 Android/KMP 플러그인을 위해 `android` 이름을 확보하는 데 필요한 임시 솔루션입니다.

새로운 플러그인이 제공되면 추가 마이그레이션 지침을 제공할 예정입니다.
Google의 새로운 DSL은 Kotlin Multiplatform에서 Android 타겟 지원을 위한 선호되는 옵션이 될 것입니다.

자세한 내용은 [Kotlin Multiplatform 호환성 가이드](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-compatibility-guide.html#rename-of-android-target-to-androidtarget)를 참조하세요.

### 동일한 타입의 여러 타겟 선언에 대한 지원 중단

Kotlin 2.1.0 이전에는 멀티플랫폼 프로젝트에서 동일한 타입의 여러 타겟을 선언할 수 있었습니다.
그러나 이는 타겟 간의 구별을 어렵게 하고 공유 소스 세트를 효과적으로 지원하는 데 어려움을 주었습니다.
대부분의 경우 별도의 Gradle 프로젝트를 사용하는 것과 같은 더 간단한 설정이 더 잘 작동합니다.
자세한 지침과 마이그레이션 예시는 Kotlin Multiplatform 호환성 가이드의 [여러 유사한 타겟 선언](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-compatibility-guide.html#declaring-several-similar-targets)을 참조하세요.

Kotlin 1.9.20은 멀티플랫폼 프로젝트에서 동일한 타입의 여러 타겟을 선언할 경우 사용 중단 경고를 트리거했습니다.
Kotlin 2.1.0에서는 이 사용 중단 경고가 이제 Kotlin/JS 타겟을 제외한 모든 타겟에 대해 오류로 처리됩니다.
Kotlin/JS 타겟이 면제되는 이유에 대해 자세히 알아보려면 YouTrack의 [이 이슈](https://youtrack.jetbrains.com/issue/KT-47038/KJS-MPP-Split-JS-target-into-JsBrowser-and-JsNode)를 참조하세요.

## Kotlin/Native

Kotlin 2.1.0에는 [`iosArm64` 타겟 지원 업그레이드](#iosarm64-promoted-to-tier-1), [향상된 cinterop 캐싱 프로세스](#changes-to-caching-in-cinterop) 및 기타 업데이트가 포함됩니다.

### iosArm64가 Tier 1으로 승격됨

[Kotlin Multiplatform](https://www.jetbrains.com/help/kotlin-multiplatform-dev/get-started.html) 개발에 매우 중요한 `iosArm64` 타겟이 Tier 1으로 승격되었습니다. 이는 Kotlin/Native 컴파일러에서 가장 높은 수준의 지원입니다.

이는 타겟이 컴파일 및 실행 가능한지 확인하기 위해 CI 파이프라인에서 정기적으로 테스트됨을 의미합니다.
또한 해당 타겟에 대한 컴파일러 릴리스 간의 소스 및 바이너리 호환성을 제공합니다.

타겟 계층에 대한 자세한 내용은 [Kotlin/Native 타겟 지원](native-target-support.md)을 참조하세요.

### LLVM 11.1.0에서 16.0.0으로 업데이트

Kotlin 2.1.0에서는 LLVM을 버전 11.1.0에서 16.0.0으로 업데이트했습니다.
새로운 버전에는 버그 수정 및 보안 업데이트가 포함되어 있습니다.
특정 경우에는 컴파일러 최적화 및 더 빠른 컴파일을 제공하기도 합니다.

프로젝트에 Linux 타겟이 있는 경우, Kotlin/Native 컴파일러가 이제 모든 Linux 타겟에 대해 기본적으로 `lld` 링커를 사용한다는 점을 참고하세요.

이 업데이트가 코드에 영향을 주지는 않아야 하지만, 문제가 발생하면 저희 [이슈 트래커](http://kotl.in/issue)에 보고해 주십시오.

### cinterop 캐싱 변경 사항

Kotlin 2.1.0에서는 cinterop 캐싱 프로세스에 변경 사항을 적용하고 있습니다.
이제 `CacheableTask` 애너테이션 타입을 더 이상 가지지 않습니다.
새로운 권장 접근 방식은 `cacheIf` 출력 타입을 사용하여 작업 결과를 캐시하는 것입니다.

이는 [정의 파일](native-definition-file.md)에 지정된 헤더 파일 변경 사항을 `UP-TO-DATE` 검사가 감지하지 못해 빌드 시스템이 코드를 재컴파일하는 것을 방지하는 문제를 해결할 것입니다.

### mimalloc 메모리 할당자 사용 중단

Kotlin 1.9.0에서 저희는 새로운 메모리 할당자를 도입했으며, Kotlin 1.9.20에서는 기본적으로 활성화했습니다.
새로운 할당자는 가비지 컬렉션을 더 효율적으로 만들고 Kotlin/Native 메모리 관리자의 런타임 성능을 향상시키도록 설계되었습니다.

새로운 메모리 할당자는 이전 기본 할당자인 [mimalloc](https://github.com/microsoft/mimalloc)을 대체했습니다.
이제 Kotlin/Native 컴파일러에서 mimalloc을 사용 중단(deprecate)할 때입니다.

이제 빌드 스크립트에서 `-Xallocator=mimalloc` 컴파일러 옵션을 제거할 수 있습니다.
문제가 발생하면 저희 [이슈 트래커](http://kotl.in/issue)에 보고해 주십시오.

Kotlin의 메모리 할당자 및 가비지 컬렉션에 대한 자세한 내용은 [Kotlin/Native 메모리 관리](native-memory-manager.md)를 참조하세요.

## Kotlin/Wasm

Kotlin/Wasm은 [증분 컴파일 지원](#support-for-incremental-compilation)과 함께 여러 업데이트를 받았습니다.

### 증분 컴파일 지원

이전에는 Kotlin 코드에서 무언가를 변경할 때 Kotlin/Wasm 툴체인이 전체 코드베이스를 재컴파일해야 했습니다.

2.1.0부터 Wasm 타겟에 대한 증분 컴파일이 지원됩니다.
개발 작업에서 컴파일러는 이제 마지막 컴파일 이후 변경 사항과 관련된 파일만 재컴파일하여 컴파일 시간을 현저히 단축합니다.

이 변경 사항은 현재 컴파일 속도를 두 배로 높이며, 향후 릴리스에서 이를 더욱 개선할 계획입니다.

현재 설정에서 Wasm 타겟에 대한 증분 컴파일은 기본적으로 비활성화되어 있습니다.
증분 컴파일을 활성화하려면 프로젝트의 `local.properties` 또는 `gradle.properties` 파일에 다음 줄을 추가하세요.

```none
# gradle.properties
kotlin.incremental.wasm=true
```

Kotlin/Wasm 증분 컴파일을 사용해 보고 [피드백](https://youtrack.jetbrains.com/issue/KT-72158/Kotlin-Wasm-incremental-compilation-feedback)을 공유해 주세요.
여러분의 통찰력은 이 기능을 더 빨리 안정화하고 기본적으로 활성화하는 데 도움이 될 것입니다.

### 브라우저 API가 kotlinx-browser 독립형 라이브러리로 이동됨

이전에는 웹 API 및 관련 타겟 유틸리티에 대한 선언이 Kotlin/Wasm 표준 라이브러리의 일부였습니다.

이번 릴리스에서는 `org.w3c.*` 선언이 Kotlin/Wasm 표준 라이브러리에서 새로운 [kotlinx-browser 라이브러리](https://github.com/kotlin/kotlinx-browser)로 이동되었습니다.
이 라이브러리에는 `org.khronos.webgl`, `kotlin.dom`, `kotlinx.browser`와 같은 다른 웹 관련 패키지도 포함되어 있습니다.

이러한 분리는 모듈성을 제공하여 Kotlin의 릴리스 주기 외부에서 웹 관련 API의 독립적인 업데이트를 가능하게 합니다.
또한, Kotlin/Wasm 표준 라이브러리는 이제 모든 JavaScript 환경에서 사용 가능한 선언만 포함합니다.

이동된 패키지의 선언을 사용하려면, 프로젝트의 빌드 구성 파일에 `kotlinx-browser` 의존성을 추가해야 합니다.

```kotlin
// build.gradle.kts
val wasmJsMain by getting {
    dependencies {
        implementation("org.jetbrains.kotlinx:kotlinx-browser:0.3")
    }
}
```

### Kotlin/Wasm의 향상된 디버깅 경험

이전에는 웹 브라우저에서 Kotlin/Wasm 코드를 디버깅할 때 디버깅 인터페이스에서 변수 값의 저수준 표현을 접했을 수 있습니다.
이는 종종 애플리케이션의 현재 상태를 추적하기 어렵게 만들었습니다.

![Kotlin/Wasm 기존 디버거](wasm-old-debugger.png){width=700}

이 경험을 개선하기 위해 변수 뷰에 사용자 지정 포매터(custom formatters)가 추가되었습니다.
구현은 [사용자 지정 포매터 API](https://firefox-source-docs.mozilla.org/devtools-user/custom_formatters/index.html)를 사용하며,
이는 Firefox 및 Chromium 기반 브라우저와 같은 주요 브라우저에서 지원됩니다.

이 변경으로 이제 변수 값을 더 사용자 친화적이고 이해하기 쉬운 방식으로 표시하고 찾을 수 있습니다.

![Kotlin/Wasm 개선된 디버거](wasm-debugger-improved.png){width=700}

새로운 디버깅 경험을 시도하려면:

1.  다음 컴파일러 옵션을 `wasmJs {}` 컴파일러 옵션에 추가하세요.

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

2.  브라우저에서 사용자 지정 포매터를 활성화하세요.

    *   Chrome DevTools에서는 **설정 | 환경설정 | 콘솔**을 통해 사용할 수 있습니다.

        ![Chrome에서 사용자 지정 포매터 활성화](wasm-custom-formatters-chrome.png){width=700}

    *   Firefox DevTools에서는 **설정 | 고급 설정**을 통해 사용할 수 있습니다.

        ![Firefox에서 사용자 지정 포매터 활성화](wasm-custom-formatters-firefox.png){width=700}

### Kotlin/Wasm 바이너리 크기 감소

프로덕션 빌드로 생성된 Wasm 바이너리의 크기가 최대 30%까지 줄어들 것이며, 일부 성능 향상을 볼 수 있습니다.
이는 `--closed-world`, `--type-ssa`, `--type-merging` Binaryen 옵션이 이제 모든 Kotlin/Wasm 프로젝트에서 안전하게 사용할 수 있는 것으로 간주되어 기본적으로 활성화되기 때문입니다.

### Kotlin/Wasm에서 JavaScript 배열 상호 운용성 개선

Kotlin/Wasm의 표준 라이브러리가 JavaScript 배열용 `JsArray<T>` 타입을 제공하지만, `JsArray<T>`를 Kotlin의 네이티브 `Array` 또는 `List` 타입으로 변환하는 직접적인 방법은 없었습니다.

이러한 간극은 배열 변환을 위한 사용자 지정 함수 생성을 요구하여, Kotlin과 JavaScript 코드 간의 상호 운용성을 복잡하게 만들었습니다.

이번 릴리스에서는 어댑터 함수를 도입하여 `JsArray<T>`를 `Array<T>`로, 그리고 그 반대로도 자동으로 변환하여 배열 작업을 간소화합니다.

제네릭 타입 간의 변환 예시입니다: Kotlin `List<T>` 및 `Array<T>`를 JavaScript `JsArray<T>`로 변환합니다.

```kotlin
val list: List<JsString> =
    listOf("Kotlin", "Wasm").map { it.toJsString() }

// List 또는 Array를 JsArray로 변환하기 위해 .toJsArray() 사용
val jsArray: JsArray<JsString> = list.toJsArray()

// Kotlin 타입으로 다시 변환하기 위해 .toArray() 및 .toList() 사용
val kotlinArray: Array<JsString> = jsArray.toArray()
val kotlinList: List<JsString> = jsArray.toList()
```

타입 배열을 해당하는 Kotlin 타입으로 변환하는 유사한 메서드(`IntArray` 및 `Int32Array` 등)도 제공됩니다. 자세한 정보 및 구현은 [`kotlinx-browser` 저장소](https://github.com/Kotlin/kotlinx-browser/blob/dfbdceed314567983c98f1d66e8c2e10d99c5a55/src/wasmJsMain/kotlin/arrayCopy.kt)를 참조하세요.

타입 배열 간의 변환 예시입니다: Kotlin `IntArray`를 JavaScript `Int32Array`로 변환합니다.

```kotlin
import org.khronos.webgl.*

    // ...

    val intArray: IntArray = intArrayOf(1, 2, 3)

    // Kotlin IntArray를 JavaScript Int32Array로 변환하기 위해 .toInt32Array() 사용
    val jsInt32Array: Int32Array = intArray.toInt32Array()

    // JavaScript Int32Array를 Kotlin IntArray로 다시 변환하기 위해 toIntArray() 사용
    val kotlinIntArray: IntArray = jsInt32Array.toIntArray()
```

### Kotlin/Wasm에서 JavaScript 예외 세부 정보 접근 지원

이전에는 Kotlin/Wasm에서 JavaScript 예외가 발생했을 때, `JsException` 타입은 원래 JavaScript 오류의 세부 정보 없이 일반 메시지만 제공했습니다.

Kotlin 2.1.0부터는 특정 컴파일러 옵션을 활성화하여 `JsException`에 원래 오류 메시지와 스택 트레이스를 포함하도록 구성할 수 있습니다.
이는 JavaScript에서 발생하는 문제를 진단하는 데 도움이 되는 더 많은 컨텍스트를 제공합니다.

이 동작은 `WebAssembly.JSTag` API에 따라 달라지며, 이는 특정 브라우저에서만 사용할 수 있습니다.

*   **Chrome**: 버전 115부터 지원
*   **Firefox**: 버전 129부터 지원
*   **Safari**: 아직 지원되지 않음

기본적으로 비활성화된 이 기능을 활성화하려면, `build.gradle.kts` 파일에 다음 컴파일러 옵션을 추가하세요.

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

새로운 동작을 보여주는 예시입니다.

```kotlin
external object JSON {
    fun <T: JsAny> parse(json: String): T
}

fun main() {
    try {
        JSON.parse("an invalid JSON")
    } catch (e: JsException) {
        println("Thrown value is: ${e.thrownValue}")
        // SyntaxError: 예상치 못한 토큰 'a', "an invalid JSON"은 유효한 JSON이 아님

        println("Message: ${e.message}")
        // 메시지: 예상치 못한 토큰 'a', "an invalid JSON"은 유효한 JSON이 아님

        println("Stacktrace:")
        // 스택 트레이스:

        // 전체 JavaScript 스택 트레이스를 출력
        e.printStackTrace()
    }
}
```

`-Xwasm-attach-js-exception` 옵션을 활성화하면 `JsException`은 JavaScript 오류의 특정 세부 정보를 제공합니다.
옵션이 없으면 `JsException`은 JavaScript 코드 실행 중 예외가 발생했음을 나타내는 일반 메시지만 포함합니다.

### 기본 내보내기(default exports) 사용 중단

명명된 내보내기(named exports)로의 마이그레이션의 일환으로, 이전에는 JavaScript에서 Kotlin/Wasm 내보내기에 기본 가져오기(default import)를 사용할 때 콘솔에 오류가 출력되었습니다.

2.1.0에서는 명명된 내보내기를 완전히 지원하기 위해 기본 가져오기가 완전히 제거되었습니다.

Kotlin/Wasm 타겟용 JavaScript 코드를 작성할 때, 이제 기본 가져오기 대신 해당하는 명명된 가져오기를 사용해야 합니다.

이 변경 사항은 명명된 내보내기로 마이그레이션하기 위한 사용 중단 주기의 마지막 단계를 나타냅니다.

**버전 2.0.0에서:** 기본 내보내기를 통해 엔티티를 내보내는 것이 사용 중단되었다는 설명과 함께 경고 메시지가 콘솔에 출력되었습니다.

**버전 2.0.20에서:** 해당 명명된 가져오기 사용을 요청하는 오류가 발생했습니다.

**버전 2.1.0에서:** 기본 가져오기 사용이 완전히 제거되었습니다.

### 하위 프로젝트별 Node.js 설정

`rootProject`에 대한 `NodeJsRootPlugin` 클래스의 속성을 정의하여 프로젝트의 Node.js 설정을 구성할 수 있습니다.
2.1.0에서는 새로운 `NodeJsPlugin` 클래스를 사용하여 각 하위 프로젝트에 대해 이러한 설정을 구성할 수 있습니다.
하위 프로젝트에 특정 Node.js 버전을 설정하는 방법을 보여주는 예시입니다.

```kotlin
// build.gradle.kts
project.plugins.withType<org.jetbrains.kotlin.gradle.targets.js.nodejs.NodeJsPlugin> {
    project.the<org.jetbrains.kotlin.gradle.targets.js.nodejs.NodeJsEnvSpec>().version = "22.0.0"
}
```

전체 프로젝트에 대해 새로운 클래스를 사용하려면, `allprojects {}` 블록에 동일한 코드를 추가하세요.

```kotlin
// build.gradle.kts
allprojects {
    project.plugins.withType<org.jetbrains.kotlin.gradle.targets.js.nodejs.NodeJsPlugin> {
        project.the<org.jetbrains.kotlin.gradle.targets.js.nodejs.NodeJsEnvSpec>().version = "your Node.js version"
    }
}
```

또한 Gradle 컨벤션 플러그인을 사용하여 특정 하위 프로젝트 집합에 설정을 적용할 수도 있습니다.

## Kotlin/JS

### 속성에서 비식별자 문자(non-identifier characters) 지원

Kotlin/JS는 이전에 백틱으로 둘러싸인 공백이 포함된 [테스트 메서드 이름](coding-conventions.md#names-for-test-methods)을 사용할 수 없었습니다.

마찬가지로 하이픈이나 공백과 같이 Kotlin 식별자에 허용되지 않는 문자를 포함하는 JavaScript 객체 속성에 접근하는 것이 불가능했습니다.

```kotlin
external interface Headers {
    var accept: String?

    // 하이픈 때문에 유효하지 않은 Kotlin 식별자
    var `content-length`: String?
}

val headers: Headers = TODO("value provided by a JS library")
val accept = headers.accept
// 속성 이름의 하이픈 때문에 오류 발생
val length = headers.`content-length`
```

이러한 동작은 JavaScript 및 TypeScript와 달랐습니다. 이들은 비식별자 문자를 사용하여 이러한 속성에 접근할 수 있습니다.

Kotlin 2.1.0부터 이 기능은 기본적으로 활성화됩니다.
Kotlin/JS는 이제 백틱(``)과 `@JsName` 애너테이션을 사용하여 비식별자 문자를 포함하는 JavaScript 속성과 상호 작용하고 테스트 메서드에 이름을 사용할 수 있도록 합니다.

또한 `@JsName` 및 `@JsQualifier` 애너테이션을 사용하여 Kotlin 속성 이름을 JavaScript 해당 이름에 매핑할 수 있습니다.

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
    // JavaScript에서는 Bar.property_example_HASH로 컴파일됨
    println(Bar.`property example`)
    // JavaScript에서는 fooNamespace["property example"]로 컴파일됨
    println(Foo.`property example`)
    // JavaScript에서는 Baz["property example"]로 컴파일됨
    println(Baz.`property example`)
}
```

### ES2015 화살표 함수 생성 지원

Kotlin 2.1.0에서 Kotlin/JS는 ES2015 화살표 함수(`(a, b) => expression`과 같은) 생성을 지원하며, 익명 함수 대신 사용됩니다.

화살표 함수를 사용하면 프로젝트의 번들 크기를 줄일 수 있으며, 특히 실험적인 `-Xir-generate-inline-anonymous-functions` 모드를 사용할 때 그렇습니다.
또한 생성된 코드를 최신 JS와 더 잘 맞춥니다.

이 기능은 ES2015를 타겟으로 할 때 기본적으로 활성화됩니다.
또는 `-Xes-arrow-functions` 명령줄 인수를 사용하여 활성화할 수 있습니다.

[공식 문서에서 ES2015 (ECMAScript 2015, ES6)에 대해 자세히 알아보세요](https://262.ecma-international.org/6.0/).

## Gradle 개선 사항

Kotlin 2.1.0은 Gradle 7.6.3부터 8.6까지 완전히 호환됩니다.
Gradle 버전 8.7부터 8.10까지도 지원되지만, 한 가지 예외가 있습니다.
Kotlin Multiplatform Gradle 플러그인을 사용하는 경우, JVM 타겟에서 `withJava()` 함수를 호출하는 멀티플랫폼 프로젝트에서 사용 중단 경고가 표시될 수 있습니다.
이 문제는 가능한 한 빨리 수정할 예정입니다.

자세한 내용은 [YouTrack](https://youtrack.jetbrains.com/issue/KT-66542)의 관련 이슈를 참조하세요.

최신 Gradle 릴리스까지 Gradle 버전을 사용할 수도 있지만, 그렇게 할 경우 사용 중단 경고가 발생하거나 일부 새로운 Gradle 기능이 작동하지 않을 수 있다는 점을 명심하세요.

### 최소 지원 AGP 버전이 7.3.1로 상향 조정됨

Kotlin 2.1.0부터 최소 지원 Android Gradle 플러그인 버전은 7.3.1입니다.

### 최소 지원 Gradle 버전이 7.6.3으로 상향 조정됨

Kotlin 2.1.0부터 최소 지원 Gradle 버전은 7.6.3입니다.

### Kotlin Gradle 플러그인 확장을 위한 새로운 API

Kotlin 2.1.0은 새로운 API를 도입하여 Kotlin Gradle 플러그인 구성을 위한 자체 플러그인을 더 쉽게 만들 수 있도록 합니다.
이 변경 사항은 `KotlinTopLevelExtension` 및 `KotlinTopLevelExtensionConfig` 인터페이스를 사용 중단시키고 플러그인 작성자를 위해 다음 인터페이스를 도입합니다.

| 이름                     | 설명                                                                                                                                              |
|--------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------|
| `KotlinBaseExtension`    | 전체 프로젝트에 대한 공통 Kotlin JVM, Android, Multiplatform 플러그인 옵션을 구성하기 위한 플러그인 DSL 확장 타입:<list><li>`org.jetbrains.kotlin.jvm`</li><li>`org.jetbrains.kotlin.android`</li><li>`org.jetbrains.kotlin.multiplatform`</li></list> |
| `KotlinJvmExtension`     | 전체 프로젝트에 대한 Kotlin **JVM** 플러그인 옵션을 구성하기 위한 플러그인 DSL 확장 타입.                                                               |
| `KotlinAndroidExtension` | 전체 프로젝트에 대한 Kotlin **Android** 플러그인 옵션을 구성하기 위한 플러그인 DSL 확장 타입.                                                            |

예를 들어, JVM 및 Android 프로젝트 모두에 대한 컴파일러 옵션을 구성하려면 `KotlinBaseExtension`을 사용하세요.

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

JVM 프로젝트에 대한 컴파일러 옵션을 특별히 구성하려면 `KotlinJvmExtension`을 사용하세요.

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

이 예시 또한 JVM 프로젝트에 대해 JVM 타겟을 17로 구성합니다.
또한 프로젝트의 Maven 게시를 구성하여 그 결과물이 Maven 저장소에 게시되도록 합니다.

`KotlinAndroidExtension`도 정확히 같은 방식으로 사용할 수 있습니다.

### Kotlin Gradle 플러그인 API에서 컴파일러 심볼 숨김

이전에는 KGP가 런타임 의존성에 `org.jetbrains.kotlin:kotlin-compiler-embeddable`을 포함하여, 내부 컴파일러 심볼이 빌드 스크립트 클래스패스에서 사용 가능하도록 했습니다.
이러한 심볼은 내부 용도로만 사용되었습니다.

Kotlin 2.1.0부터 KGP는 `org.jetbrains.kotlin:kotlin-compiler-embeddable` 클래스 파일의 하위 집합을 JAR 파일에 번들링하고 점진적으로 제거합니다.
이러한 변경은 호환성 문제를 방지하고 KGP 유지 관리를 간소화하는 것을 목표로 합니다.

빌드 로직의 다른 부분(예: `kotlinter`와 같은 플러그인)이 KGP에 번들로 제공되는 버전과 다른 버전의 `org.jetbrains.kotlin:kotlin-compiler-embeddable`에 의존하는 경우 충돌 및 런타임 예외로 이어질 수 있습니다.

이러한 문제를 방지하기 위해 KGP는 이제 KGP와 함께 `org.jetbrains.kotlin:kotlin-compiler-embeddable`이 빌드 클래스패스에 존재하면 경고를 표시합니다.

장기적인 해결책으로, `org.jetbrains.kotlin:kotlin-compiler-embeddable` 클래스를 사용하는 플러그인 작성자라면 격리된 클래스 로더에서 실행하는 것을 권장합니다.
예를 들어, 클래스 로더 또는 프로세스 격리를 사용하여 [Gradle Workers API](https://docs.gradle.org/current/userguide/worker_api.html)를 통해 이를 달성할 수 있습니다.

#### Gradle Workers API 사용

이 예시는 Gradle 플러그인을 생성하는 프로젝트에서 Kotlin 컴파일러를 안전하게 사용하는 방법을 보여줍니다.
먼저 빌드 스크립트에 컴파일 전용(compile-only) 의존성을 추가하세요.
이렇게 하면 심볼이 컴파일 시에만 사용 가능하게 됩니다.

```kotlin
// build.gradle.kts
dependencies {
    compileOnly("org.jetbrains.kotlin:kotlin-compiler-embeddable:%kotlinVersion%")
}
```

다음으로, Kotlin 컴파일러 버전을 출력하는 Gradle 작업 액션을 정의하세요.

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

이제 클래스 로더 격리를 사용하여 이 액션을 워커 실행기(worker executor)에 제출하는 작업을 생성하세요.

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

마지막으로, Gradle 플러그인에서 Kotlin 컴파일러 클래스패스를 구성하세요.

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

### 다중 안정성 구성 파일 지원

Compose 컴파일러는 여러 안정성 구성 파일을 해석할 수 있지만, Compose 컴파일러 Gradle 플러그인의 `stabilityConfigurationFile` 옵션은 이전에는 단일 파일만 지정할 수 있었습니다.
Kotlin 2.1.0에서는 이 기능이 재작업되어 단일 모듈에 여러 안정성 구성 파일을 사용할 수 있도록 합니다.

*   `stabilityConfigurationFile` 옵션은 사용 중단되었습니다.
*   새로운 옵션인 `stabilityConfigurationFiles`는 `ListProperty<RegularFile>` 타입을 가집니다.

새로운 옵션을 사용하여 여러 파일을 Compose 컴파일러에 전달하는 방법은 다음과 같습니다.

```kotlin
// build.gradle.kt
composeCompiler {
    stabilityConfigurationFiles.addAll(
        project.layout.projectDirectory.file("configuration-file1.conf"),
        project.layout.projectDirectory.file("configuration-file2.conf"),
    )
}
```

### Pausable composition

Pausable composition은 컴파일러가 건너뛸 수 있는 함수를 생성하는 방식을 변경하는 새로운 실험적 기능입니다.
이 기능이 활성화되면 런타임 중 스키핑 지점에서 컴포지션을 중단할 수 있으며, 오래 실행되는 컴포지션 프로세스를 여러 프레임으로 분할할 수 있습니다.
Pausable composition은 지연 목록(lazy lists) 및 기타 성능 집약적인 구성 요소에서 사용되며, 블로킹 방식으로 실행될 때 프레임 드롭을 유발할 수 있는 콘텐츠를 미리 가져오는 데 사용됩니다.

Pausable composition을 시도하려면, Compose 컴파일러의 Gradle 구성에 다음 기능 플래그를 추가하세요.

```kotlin
// build.gradle.kts
composeCompiler {
    featureFlags = setOf(
        ComposeFeatureFlag.PausableComposition
    )
}
```

> 이 기능에 대한 런타임 지원은 `androidx.compose.runtime`의 1.8.0-alpha02 버전에서 추가되었습니다.
> 이 기능 플래그는 이전 런타임 버전과 함께 사용될 경우 아무런 효과가 없습니다.
>
{style="note"}

### open 및 overridden `@Composable` 함수 변경 사항

가상(open, abstract, overridden) `@Composable` 함수는 더 이상 재시작 가능(restartable)할 수 없습니다.
재시작 가능 그룹에 대한 코드 생성은 상속과 [올바르게 작동하지 않는](https://issuetracker.google.com/329477544) 호출을 생성하여 런타임 충돌을 초래했습니다.

이는 가상 함수가 재시작되거나 건너뛰어지지 않음을 의미합니다. 상태가 무효화될 때마다 런타임은 대신 해당 부모 컴포저블을 재구성(recompose)합니다.
코드가 재구성(recomposition)에 민감하다면 런타임 동작의 변경 사항을 알아챌 수 있습니다.

### 성능 개선

Compose 컴파일러는 이전에 `@Composable` 타입을 변환하기 위해 모듈의 IR 전체 복사본을 생성하곤 했습니다.
Compose와 관련 없는 요소를 복사할 때 메모리 사용량이 증가하는 것 외에도, 이러한 동작은 [특정 예외적인 경우](https://issuetracker.google.com/365066530)에 다운스트림 컴파일러 플러그인을 손상시키기도 했습니다.

이 복사 작업이 제거되어 잠재적으로 더 빠른 컴파일 시간을 가져왔습니다.

## 표준 라이브러리

### 표준 라이브러리 API의 사용 중단 심각도 변경

Kotlin 2.1.0에서는 여러 표준 라이브러리 API의 사용 중단 심각도 수준을 경고에서 오류로 상향 조정합니다.
코드가 이러한 API에 의존하는 경우, 호환성을 보장하기 위해 코드를 업데이트해야 합니다.
가장 주목할 만한 변경 사항은 다음과 같습니다.

*   **`Char` 및 `String`의 로케일 민감(Locale-sensitive) 대소문자 변환 함수가 사용 중단됨:** `Char.toLowerCase()`, `Char.toUpperCase()`, `String.toUpperCase()`, `String.toLowerCase()`와 같은 함수는 이제 사용 중단되었으며, 이를 사용하면 오류가 발생합니다.
    로케일 불가지(locale-agnostic) 함수 대체 또는 다른 대소문자 변환 메커니즘으로 대체하세요.
    기본 로케일을 계속 사용하려면 `String.toLowerCase()`와 같은 호출을 `String.lowercase(Locale.getDefault())`로 대체하여 로케일을 명시적으로 지정하세요.
    로케일 불가지 변환의 경우, 기본적으로 불변(invariant) 로케일을 사용하는 `String.lowercase()`로 대체하세요.

*   **Kotlin/Native 프리징(freezing) API가 사용 중단됨:** 이전에 `@FreezingIsDeprecated` 애너테이션으로 표시된 프리징 관련 선언을 사용하면 이제 오류가 발생합니다.
    이 변경 사항은 Kotlin/Native의 레거시 메모리 관리자에서 전환을 반영합니다. 레거시 관리자는 스레드 간에 객체를 공유하기 위해 프리징이 필요했습니다.
    새로운 메모리 모델에서 프리징 관련 API로부터 마이그레이션하는 방법을 알아보려면 [Kotlin/Native 마이그레이션 가이드](native-migration-guide.md#update-your-code)를 참조하세요.
    자세한 내용은 [프리징 사용 중단에 대한 공지](whatsnew1720.md#freezing)를 참조하세요.

*   **`appendln()`이 `appendLine()`로 사용 중단됨:** `StringBuilder.appendln()` 및 `Appendable.appendln()` 함수는 이제 사용 중단되었으며, 이를 사용하면 오류가 발생합니다.
    이를 대체하려면 `StringBuilder.appendLine()` 또는 `Appendable.appendLine()` 함수를 사용하세요.
    `appendln()` 함수는 Kotlin/JVM에서 `line.separator` 시스템 속성을 사용하기 때문에 사용 중단되었습니다. 이 속성은 각 OS마다 다른 기본값을 가집니다.
    Kotlin/JVM에서 이 속성은 Windows에서는 `\r
` (CR LF), 다른 시스템에서는 `
` (LF)로 기본 설정됩니다.
    반면에 `appendLine()` 함수는 일관되게 `
` (LF)를 줄 구분자로 사용하여 플랫폼 전반에 걸쳐 일관된 동작을 보장합니다.

이번 릴리스에서 영향을 받는 API의 전체 목록은 [KT-71628](https://youtrack.jetbrains.com/issue/KT-71628) YouTrack 이슈에서 확인할 수 있습니다.

### `java.nio.file.Path`를 위한 안정화된 파일 트리 탐색 확장

Kotlin 1.7.20은 `java.nio.file.Path` 클래스에 대한 실험적 [확장 함수](extensions.md#extension-functions)를 도입했으며, 이는 파일 트리를 탐색할 수 있도록 합니다.
Kotlin 2.1.0에서는 다음 파일 트리 탐색 확장이 이제 [Stable](components-stability.md#stability-levels-explained)입니다.

*   `walk()`는 지정된 경로를 루트로 하는 파일 트리를 지연적으로 탐색합니다.
*   `fileVisitor()`는 `FileVisitor`를 별도로 생성할 수 있도록 합니다. `FileVisitor`는 탐색 중에 디렉토리 및 파일에 대해 수행할 작업을 지정합니다.
*   `visitFileTree(fileVisitor: FileVisitor, ...)`는 파일 트리를 탐색하면서 발견된 각 항목에 대해 지정된 `FileVisitor`를 호출하며, 내부적으로 `java.nio.file.Files.walkFileTree()` 함수를 사용합니다.
*   `visitFileTree(..., builderAction: FileVisitorBuilder.() -> Unit)`는 제공된 `builderAction`으로 `FileVisitor`를 생성하고 `visitFileTree(fileVisitor, ...)` 함수를 호출합니다.
*   `sealed interface FileVisitorBuilder`는 사용자 지정 `FileVisitor` 구현을 정의할 수 있도록 합니다.
*   `enum class PathWalkOption`은 `Path.walk()` 함수에 대한 탐색 옵션을 제공합니다.

아래 예시는 이 파일 탐색 API를 사용하여 사용자 지정 `FileVisitor` 동작을 생성하는 방법을 보여줍니다. 이는 파일 및 디렉토리를 방문하는 특정 작업을 정의할 수 있도록 합니다.

예를 들어, 명시적으로 `FileVisitor`를 생성하고 나중에 사용할 수 있습니다.

```kotlin
val cleanVisitor = fileVisitor {
    onPreVisitDirectory { directory, attributes ->
        // 플레이스홀더: 디렉토리 방문 시 로직 추가
        FileVisitResult.CONTINUE
    }

    onVisitFile { file, attributes ->
        // 플레이스홀더: 파일 방문 시 로직 추가
        FileVisitResult.CONTINUE
    }
}

// 플레이스홀더: 탐색 전 일반 설정에 대한 로직 추가
projectDirectory.visitFileTree(cleanVisitor)
```

`builderAction`으로 `FileVisitor`를 생성하고 즉시 탐색에 사용할 수도 있습니다.

```kotlin
projectDirectory.visitFileTree {
    // builderAction 정의:
    onPreVisitDirectory { directory, attributes ->
        // 디렉토리 방문 시 일부 로직
        FileVisitResult.CONTINUE
    }

    onVisitFile { file, attributes ->
        // 파일 방문 시 일부 로직
        FileVisitResult.CONTINUE
    }
}
```

또한 `walk()` 함수를 사용하여 지정된 경로를 루트로 하는 파일 트리를 탐색할 수 있습니다.

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

        // .class 확장자를 가진 파일 삭제
        onVisitFile { file, _ ->
            if (file.extension == "class") {
                file.deleteExisting()
            }
            FileVisitResult.CONTINUE
        }
    }

    // 루트 디렉토리 및 파일 설정
    val rootDirectory = createTempDirectory("Project")

    // A.kt 및 A.class 파일이 포함된 src 디렉토리 생성
    rootDirectory.resolve("src").let { srcDirectory ->
        srcDirectory.createDirectory()
        srcDirectory.resolve("A.kt").createFile()
        srcDirectory.resolve("A.class").createFile()
    }

    // Project.jar 파일이 포함된 build 디렉토리 생성
    rootDirectory.resolve("build").let { buildDirectory ->
        buildDirectory.createDirectory()
        buildDirectory.resolve("Project.jar").createFile()
    }

    // walk() 함수 사용:
    val directoryStructure = rootDirectory.walk(PathWalkOption.INCLUDE_DIRECTORIES)
        .map { it.relativeTo(rootDirectory).toString() }
        .toList().sorted()
    println(directoryStructure)
    // "[, build, build/Project.jar, src, src/A.class, src/A.kt]"

    // cleanVisitor로 파일 트리를 탐색하고 rootDirectory.visitFileTree(cleanVisitor) 정리 규칙 적용
    val directoryStructureAfterClean = rootDirectory.walk(PathWalkOption.INCLUDE_DIRECTORIES)
        .map { it.relativeTo(rootDirectory).toString() }
        .toList().sorted()
    println(directoryStructureAfterClean)
    // "[, src, src/A.kt]"
}
```

## 문서 업데이트

Kotlin 문서는 몇 가지 주목할 만한 변경 사항이 있었습니다.

### 언어 개념

*   개선된 [널 안전성](null-safety.md) 페이지 – 코드에서 `null` 값을 안전하게 처리하는 방법을 알아보세요.
*   개선된 [객체 선언 및 표현식](object-declarations.md) 페이지 – 한 번의 단계로 클래스를 정의하고 인스턴스를 생성하는 방법을 알아보세요.
*   개선된 [When 표현식 및 문](control-flow.md#when-expressions-and-statements) 섹션 – `when` 조건문과 사용 방법을 알아보세요.
*   업데이트된 [Kotlin 로드맵](roadmap.md), [Kotlin 발전 원칙](kotlin-evolution-principles.md), [Kotlin 언어 기능 및 제안](kotlin-language-features-and-proposals.md) 페이지 – Kotlin의 계획, 진행 중인 개발 및 기본 원칙에 대해 알아보세요.

### Compose 컴파일러

*   [Compose 컴파일러 문서](compose-compiler-migration-guide.md)가 이제 컴파일러 및 플러그인 섹션에 위치 – Compose 컴파일러, 컴파일러 옵션 및 마이그레이션 단계를 알아보세요.

### API 참조

*   새로운 [Kotlin Gradle 플러그인 API 참조](https://kotlinlang.org/api/kotlin-gradle-plugin) – Kotlin Gradle 플러그인 및 Compose 컴파일러 Gradle 플러그인의 API 참조를 탐색하세요.

### 멀티플랫폼 개발

*   새로운 [멀티플랫폼용 Kotlin 라이브러리 빌드](https://kotlinlang.org/docs/api-guidelines-build-for-multiplatform.html) 페이지 – Kotlin Multiplatform을 위한 Kotlin 라이브러리를 설계하는 방법을 알아보세요.
*   새로운 [Kotlin Multiplatform 소개](https://www.jetbrains.com/help/kotlin-multiplatform-dev/get-started.html) 페이지 – Kotlin Multiplatform의 주요 개념, 의존성, 라이브러리 등에 대해 알아보세요.
*   업데이트된 [Kotlin Multiplatform 개요](multiplatform.topic) 페이지 – Kotlin Multiplatform의 필수 요소 및 인기 사용 사례를 탐색하세요.
*   새로운 [iOS 통합](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-ios-integration-overview.html) 섹션 – Kotlin Multiplatform 공유 모듈을 iOS 앱에 통합하는 방법을 알아보세요.
*   새로운 [Kotlin/Native 정의 파일](native-definition-file.md) 페이지 – C 및 Objective-C 라이브러리를 사용하기 위한 정의 파일을 생성하는 방법을 알아보세요.
*   [WASI 시작하기](wasm-wasi.md) – 다양한 WebAssembly 가상 머신에서 WASI를 사용하여 간단한 Kotlin/Wasm 애플리케이션을 실행하는 방법을 알아보세요.

### 툴링

*   [새로운 Dokka 마이그레이션 가이드](dokka-migration.md) – Dokka Gradle 플러그인 v2로 마이그레이션하는 방법을 알아보세요.

## Kotlin 2.1.0 호환성 가이드

Kotlin 2.1.0은 기능 릴리스이므로, 이전 버전의 언어로 작성된 코드와 호환되지 않는 변경 사항을 가져올 수 있습니다.
이러한 변경 사항에 대한 자세한 목록은 [Kotlin 2.1.0 호환성 가이드](compatibility-guide-21.md)에서 확인할 수 있습니다.

## Kotlin 2.1.0 설치

IntelliJ IDEA 2023.3 및 Android Studio Iguana (2023.2.1) Canary 15부터 Kotlin 플러그인은 IDE에 포함된 번들 플러그인으로 배포됩니다. 이는 더 이상 JetBrains Marketplace에서 플러그인을 설치할 수 없음을 의미합니다.

새로운 Kotlin 버전으로 업데이트하려면, 빌드 스크립트에서 [Kotlin 버전을 2.1.0으로 변경](releases.md#update-to-a-new-kotlin-version)하세요.