---
title: "Kotlin 2.1.0의 새로운 기능"
---
_[배포일: 2024년 11월 27일](releases#release-details)_

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

Kotlin 2.1.0 릴리스가 출시되었습니다! 주요 특징은 다음과 같습니다.

* **미리 보기의 새로운 언어 기능**: [주어가 있는 `when`의 가드 조건](#guard-conditions-in-when-with-a-subject),
  [비지역적 `break` 및 `continue`](#non-local-break-and-continue) 및 [다중 달러 문자열 보간](#multi-dollar-string-interpolation).
* **K2 컴파일러 업데이트**: [컴파일러 검사 관련 유연성 향상](#extra-compiler-checks) 및 [kapt 구현 개선](#improved-k2-kapt-implementation).
* **Kotlin Multiplatform**: [Swift 내보내기에 대한 기본 지원 도입](#basic-support-for-swift-export),
  [컴파일러 옵션에 대한 안정적인 Gradle DSL](#new-gradle-dsl-for-compiler-options-in-multiplatform-projects-promoted-to-stable) 등.
* **Kotlin/Native**: [`iosArm64`에 대한 지원 개선](#iosarm64-promoted-to-tier-1) 및 기타 업데이트.
* **Kotlin/Wasm**: [점진적 컴파일 지원](#support-for-incremental-compilation)을 포함한 여러 업데이트.
* **Gradle 지원**: [새로운 버전의 Gradle 및 Android Gradle 플러그인과의 호환성 개선](#gradle-improvements),
  [Kotlin Gradle 플러그인 API 업데이트](#new-api-for-kotlin-gradle-plugin-extensions)와 함께 제공됩니다.
* **문서**: [Kotlin 문서의 상당한 개선](#documentation-updates).

## IDE 지원

2.1.0을 지원하는 Kotlin 플러그인은 최신 IntelliJ IDEA 및 Android Studio에 번들로 제공됩니다.
IDE에서 Kotlin 플러그인을 업데이트할 필요가 없습니다.
빌드 스크립트에서 Kotlin 버전을 2.1.0으로 변경하기만 하면 됩니다.

자세한 내용은 [새 Kotlin 버전으로 업데이트](releases#update-to-a-new-kotlin-version)를 참조하세요.

## 언어

K2 컴파일러가 포함된 Kotlin 2.0.0 릴리스 이후 JetBrains 팀은 새로운 기능을 통해 언어를 개선하는 데 집중하고 있습니다.
이번 릴리스에서는 몇 가지 새로운 언어 디자인 개선 사항을 발표하게 되어 기쁩니다.

이러한 기능은 미리 보기로 제공되며, 사용해 보고 피드백을 공유해 주시기 바랍니다.

* [주어가 있는 `when`의 가드 조건](#guard-conditions-in-when-with-a-subject)
* [비지역적 `break` 및 `continue`](#non-local-break-and-continue)
* [다중 달러 보간: 문자열 리터럴에서 `You are a professional translator specializing in technical documentation translation from English to Korean. Please follow these requirements strictly:
  
  ## Translation Style and Quality Requirements
  1. Ensure the translation fits the internet usage context of Korean, correctly handle inversions and different language word orders, and properly retain brackets and English notes for professional terms
  2. Use terminology consistently and accurately, naturally integrating them into sentences based on context

  ## Technical Requirements
  1. Maintain all Markdown formatting, code blocks, and links unchanged
  2. DO NOT translate the code inside code examples
  3. Terms in the terminology list must be translated as specified
  4. For proprietary nouns that cannot be determined, keep the original English
  5. Reference previously translated documents provided to maintain consistency in translation style and terminology usage

  ## Output Requirements
  - Output only the translation result, without adding explanations or comments
  - Maintain all original Markdown syntax and formatting
  - Keep all code blocks, variable names, and function names unchanged
  - Ensure all links and references remain unchanged
  
  ## Terminology List
  No relevant terms

  ## Reference Translations
  No reference translations

  ## Content to Translate
  ```markdown
   처리 개선`](#multi-dollar-string-interpolation)

:::note
모든 기능은 K2 모드가 활성화된 최신 2024.3 버전의 IntelliJ IDEA에서 IDE 지원을 제공합니다.

자세한 내용은 [IntelliJ IDEA 2024.3 블로그 게시물](https://blog.jetbrains.com/idea/2024/11/intellij-idea-2024-3/)을 참조하세요.

[Kotlin 언어 디자인 기능 및 제안의 전체 목록을 참조하세요](kotlin-language-features-and-proposals).

이번 릴리스에서는 다음과 같은 언어 업데이트도 제공됩니다.

* [](#support-for-requiring-opt-in-to-extend-apis)
* [](#improved-overload-resolution-for-functions-with-generic-types)
* [](#improved-exhaustiveness-checks-for-when-expressions-with-sealed-classes)

### 주어가 있는 when의 가드 조건

이 기능은 [미리 보기 중](kotlin-evolution-principles#pre-stable-features)이며,
옵트인이 필요합니다(자세한 내용은 아래 참조).

[YouTrack](https://youtrack.jetbrains.com/issue/KT-71140)에서 피드백을 보내주시면 감사하겠습니다.

2.1.0부터 주어가 있는 `when` 식 또는 문에서 가드 조건을 사용할 수 있습니다.

가드 조건을 사용하면 `when` 식의 분기에 둘 이상의 조건을 포함할 수 있습니다.
복잡한 제어 흐름을 더욱 명시적이고 간결하게 만들 뿐만 아니라 코드 구조를 평탄화할 수 있습니다.

분기에 가드 조건을 포함하려면 기본 조건 뒤에 `if`로 구분하여 배치합니다.

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
        // 기본 조건만 있는 분기. `Animal`이 `Dog`일 때 `feedDog()` 반환
        is Animal.Dog `->` animal.feedDog()
        // 기본 조건과 가드 조건이 모두 있는 분기. `Animal`이 `Cat`이고 `mouseHunter`가 아닐 때 `feedCat()` 반환
        is Animal.Cat if !animal.mouseHunter `->` animal.feedCat()
        // 위의 조건 중 어느 것에도 해당하지 않으면 "Unknown animal" 반환
        else `->` println("Unknown animal")
    }
}
```

단일 `when` 식에서 가드 조건이 있는 분기와 없는 분기를 결합할 수 있습니다.
가드 조건이 있는 분기의 코드는 기본 조건과 가드 조건이 모두 `true`인 경우에만 실행됩니다.
기본 조건이 일치하지 않으면 가드 조건은 평가되지 않습니다.
또한 가드 조건은 `else if`를 지원합니다.

프로젝트에서 가드 조건을 활성화하려면 명령줄에서 다음 컴파일러 옵션을 사용합니다.

```bash
kotlinc -Xwhen-guards main.kt
```

또는 Gradle 빌드 파일의 `compilerOptions {}` 블록에 추가합니다.

```kotlin
// build.gradle.kts
kotlin {
    compilerOptions {
        freeCompilerArgs.add("-Xwhen-guards")
    }
}
```

### 비지역적 break 및 continue

이 기능은 [미리 보기 중](kotlin-evolution-principles#pre-stable-features)이며,
옵트인이 필요합니다(자세한 내용은 아래 참조).

[YouTrack](https://youtrack.jetbrains.com/issue/KT-1436)에서 피드백을 보내주시면 감사하겠습니다.

Kotlin 2.1.0에서는 오랫동안 기다려온 또 다른 기능인 비지역적 `break` 및 `continue`를 사용할 수 있는 기능의 미리 보기를 추가합니다.
이 기능은 인라인 함수의 범위에서 사용할 수 있는 도구 세트를 확장하고 프로젝트에서 상용구 코드를 줄여줍니다.

이전에는 비지역적 반환만 사용할 수 있었습니다.
이제 Kotlin은 `break` 및 `continue` [점프 식](returns)도 비지역적으로 지원합니다.
즉, 루프를 둘러싸는 인라인 함수에 인수로 전달되는 람다 내에서 이를 적용할 수 있습니다.

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

프로젝트에서 이 기능을 사용해 보려면 명령줄에서 `-Xnon-local-break-continue` 컴파일러 옵션을 사용합니다.

```bash
kotlinc -Xnon-local-break-continue main.kt
```

또는 Gradle 빌드 파일의 `compilerOptions {}` 블록에 추가합니다.

```kotlin
// build.gradle.kts
kotlin {
    compilerOptions {
        freeCompilerArgs.add("-Xnon-local-break-continue")
    }
}
```

향후 Kotlin 릴리스에서 이 기능을 안정화할 계획입니다.
비지역적 `break` 및 `continue`를 사용하는 동안 문제가 발생하면
[이슈 트래커](https://youtrack.jetbrains.com/issue/KT-1436)에 보고해 주세요.

### 다중 달러 문자열 보간

이 기능은 [미리 보기 중](kotlin-evolution-principles#pre-stable-features)이며
옵트인이 필요합니다(자세한 내용은 아래 참조).

[YouTrack](https://youtrack.jetbrains.com/issue/KT-2425)에서 피드백을 보내주시면 감사하겠습니다.

Kotlin 2.1.0에서는 다중 달러 문자열 보간 지원을 도입하여
문자열 리터럴 내에서 달러 기호(`You are a professional translator specializing in technical documentation translation from English to Korean. Please follow these requirements strictly:
  
  ## Translation Style and Quality Requirements
  1. Ensure the translation fits the internet usage context of Korean, correctly handle inversions and different language word orders, and properly retain brackets and English notes for professional terms
  2. Use terminology consistently and accurately, naturally integrating them into sentences based on context

  ## Technical Requirements
  1. Maintain all Markdown formatting, code blocks, and links unchanged
  2. DO NOT translate the code inside code examples
  3. Terms in the terminology list must be translated as specified
  4. For proprietary nouns that cannot be determined, keep the original English
  5. Reference previously translated documents provided to maintain consistency in translation style and terminology usage

  ## Output Requirements
  - Output only the translation result, without adding explanations or comments
  - Maintain all original Markdown syntax and formatting
  - Keep all code blocks, variable names, and function names unchanged
  - Ensure all links and references remain unchanged
  
  ## Terminology List
  No relevant terms

  ## Reference Translations
  No reference translations

  ## Content to Translate
  ```markdown
  )를 처리하는 방식을 개선합니다.
이 기능은 템플릿 엔진, JSON 스키마 또는 기타 데이터 형식과 같이 여러 개의 달러 기호가 필요한 컨텍스트에서 유용합니다.

Kotlin의 문자열 보간은 단일 달러 기호를 사용합니다.
그러나 금융 데이터 및 템플릿 시스템에서 일반적인 문자열에서 리터럴 달러 기호를 사용하려면 `${'`와 같은 해결 방법이 필요했습니다.
다중 달러 보간 기능을 사용하면 문자열 보간을 트리거하는 달러 기호 수를 구성할 수 있습니다.
달러 기호가 적으면 문자열 리터럴로 처리됩니다.

다음은 `You are a professional translator specializing in technical documentation translation from English to Korean. Please follow these requirements strictly:
  
  ## Translation Style and Quality Requirements
  1. Ensure the translation fits the internet usage context of Korean, correctly handle inversions and different language word orders, and properly retain brackets and English notes for professional terms
  2. Use terminology consistently and accurately, naturally integrating them into sentences based on context

  ## Technical Requirements
  1. Maintain all Markdown formatting, code blocks, and links unchanged
  2. DO NOT translate the code inside code examples
  3. Terms in the terminology list must be translated as specified
  4. For proprietary nouns that cannot be determined, keep the original English
  5. Reference previously translated documents provided to maintain consistency in translation style and terminology usage

  ## Output Requirements
  - Output only the translation result, without adding explanations or comments
  - Maintain all original Markdown syntax and formatting
  - Keep all code blocks, variable names, and function names unchanged
  - Ensure all links and references remain unchanged
  
  ## Terminology List
  No relevant terms

  ## Reference Translations
  No reference translations

  ## Content to Translate
  ```markdown
  를 사용하여 자리 표시자가 있는 JSON 스키마 다중 줄 문자열을 생성하는 방법의 예입니다.

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

이 예에서 초기 `$`는 보간을 트리거하려면 **두 개의 달러 기호**(`$`)가 필요함을 의미합니다.
`$schema`, `$id` 및 `$dynamicAnchor`가 보간 마커로 해석되지 않도록 합니다.

이 방법은 자리 표시자 구문에 달러 기호를 사용하는 시스템으로 작업할 때 특히 유용합니다.

이 기능을 활성화하려면 명령줄에서 다음 컴파일러 옵션을 사용합니다.

```bash
kotlinc -Xmulti-dollar-interpolation main.kt
```

또는 Gradle 빌드 파일의 `compilerOptions {}` 블록을 업데이트합니다.

```kotlin
// build.gradle.kts
kotlin {
    compilerOptions {
        freeCompilerArgs.add("-Xmulti-dollar-interpolation")
    }
}
```

코드가 이미 단일 달러 기호가 있는 표준 문자열 보간을 사용하는 경우 변경할 필요가 없습니다.
문자열에 리터럴 달러 기호가 필요할 때마다 `$`를 사용할 수 있습니다.

### API 확장에 옵트인을 요구하는 지원

Kotlin 2.1.0에서는 [`@SubclassOptInRequired`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-subclass-opt-in-required/) 어노테이션을 도입했습니다.
이를 통해 라이브러리 작성자는 사용자가 실험적 인터페이스를 구현하거나 실험적 클래스를 확장하기 전에 명시적 옵트인을 요구할 수 있습니다.

이 기능은 라이브러리 API가 사용하기에 충분히 안정적이지만 새로운 추상 함수로 발전할 수 있어
상속에 불안정할 때 유용할 수 있습니다.

API 요소에 옵트인 요구 사항을 추가하려면 어노테이션 클래스에 대한 참조와 함께 `@SubclassOptInRequired`
어노테이션을 사용합니다.

```kotlin
@RequiresOptIn(
level = RequiresOptIn.Level.WARNING,
message = "Interfaces in this library are experimental"
)
annotation class UnstableApi()

@SubclassOptInRequired(UnstableApi::class)
interface CoreLibraryApi
```

이 예에서 `CoreLibraryApi` 인터페이스는 사용자가 구현하기 전에 옵트인하도록 요구합니다.
사용자는 다음과 같이 옵트인할 수 있습니다.

```kotlin
@OptIn(UnstableApi::class)
interface MyImplementation: CoreLibraryApi
```

`@SubclassOptInRequired` 어노테이션을 사용하여 옵트인을 요구하면
요구 사항이 [내부 또는 중첩 클래스](nested-classes)로 전파되지 않습니다.

:::

API에서 `@SubclassOptInRequired` 어노테이션을 사용하는 방법에 대한 실제 예는
`kotlinx.coroutines` 라이브러리의 [`SharedFlow`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.flow/-shared-flow/)
인터페이스를 확인하세요.

### 제네릭 타입이 있는 함수에 대한 오버로드 확인 개선

이전에는 일부는 제네릭 타입의 값 매개변수를 가지고 다른 일부는 같은 위치에 함수 타입을 가진 함수에 대해 여러 개의 오버로드가 있는 경우 확인 동작이 일관성이 없을 수 있었습니다.

이로 인해 오버로드가 멤버 함수인지 확장 함수인지에 따라 다른 동작이 발생했습니다.
예를 들어:

```kotlin
class KeyValueStore<K, V> {
    fun store(key: K, value: V) {} // 1
    fun store(key: K, lazyValue: () `->` V) {} // 2
}

fun <K, V> KeyValueStore<K, V>.storeExtension(key: K, value: V) {} // 1 
fun <K, V> KeyValueStore<K, V>.storeExtension(key: K, lazyValue: () `->` V) {} // 2

fun test(kvs: KeyValueStore<String, Int>) {
    // 멤버 함수
    kvs.store("", 1)    // 1로 확인
    kvs.store("") { 1 } // 2로 확인

    // 확장 함수
    kvs.storeExtension("", 1)    // 1로 확인
    kvs.storeExtension("") { 1 } // 확인되지 않음
}
```

이 예에서 `KeyValueStore` 클래스에는 `store()` 함수에 대한 두 개의 오버로드가 있습니다.
하나는 제네릭 타입 `K` 및 `V`가 있는 함수 매개변수를 가지고
다른 하나는 제네릭 타입 `V`를 반환하는 람다 함수를 가집니다.
마찬가지로 확장 함수 `storeExtension()`에 대한 두 개의 오버로드가 있습니다.

람다 함수가 있거나 없는 상태로 `store()` 함수가 호출되면
컴파일러는 올바른 오버로드를 성공적으로 확인했습니다.
그러나 람다 함수가 있는 상태로 확장 함수 `storeExtension()`이 호출되면
컴파일러는 두 오버로드가 모두 적용 가능한 것으로 잘못 간주했기 때문에 올바른 오버로드를 확인하지 못했습니다.

이 문제를 해결하기 위해 제네릭 타입이 있는 함수 매개변수가 다른 인수에서 가져온 정보를 기반으로 람다 함수를 수락할 수 없는 경우 컴파일러가 가능한 오버로드를 삭제할 수 있도록 새로운 휴리스틱을 도입했습니다.
이 변경 사항은 멤버 함수와 확장 함수의 동작을 일관성 있게 만들고
Kotlin 2.1.0에서 기본적으로 활성화됩니다.

### 봉인된 클래스가 있는 when 식에 대한 완전성 검사 개선

이전 버전의 Kotlin에서 컴파일러는 `sealed class` 계층 구조의 모든 경우가 처리되었더라도 봉인된 상위 바운드가 있는 타입 매개변수에 대해 `when`
식에 `else` 분기가 필요했습니다.
이 동작은 Kotlin 2.1.0에서 해결되고 개선되었습니다.
완전성 검사를 더욱 강력하게 만들고 중복된 `else` 분기를 제거할 수 있도록 하여
`when` 식을 더 깔끔하고 직관적으로 유지합니다.

다음은 변경 사항을 보여주는 예입니다.

```kotlin
sealed class Result
object Error: Result()
class Success(val value: String): Result()

fun <T : Result> render(result: T) = when (result) {
    Error `->` "Error!"
    is Success `->` result.value
    // else 분기가 필요하지 않음
}
```

## Kotlin K2 컴파일러

Kotlin 2.1.0에서는 K2 컴파일러가 [컴파일러 검사 작업 시 더 많은 유연성](#extra-compiler-checks)을 제공합니다.
및 [경고](#global-warning-suppression)와 더불어 [kapt 플러그인에 대한 개선된 지원](#improved-k2-kapt-implementation)을 제공합니다.

### 추가 컴파일러 검사

Kotlin 2.1.0에서는 K2 컴파일러에서 추가 검사를 활성화할 수 있습니다.
이러한 검사는 일반적으로 컴파일에 중요하지 않은 추가 선언, 식 및 타입 검사이지만
다음과 같은 경우를 확인하려는 경우 여전히 유용할 수 있습니다.

| 검사 타입                                           | 주석                                                                                     |
|------------------------------------------------------|------------------------------------------------------------------------------------------|
| `REDUNDANT_NULLABLE`                                 | `Boolean??`이 `Boolean?` 대신 사용됨                                                  |
| `PLATFORM_CLASS_MAPPED_TO_KOTLIN`                    | `java.lang.String`이 `kotlin.String` 대신 사용됨                                       |
| `ARRAY_EQUALITY_OPERATOR_CAN_BE_REPLACED_WITH_EQUALS` | `arrayOf("") == arrayOf("")`이 `arrayOf("").contentEquals(arrayOf(""))` 대신 사용됨 |
| `REDUNDANT_CALL_OF_CONVERSION_METHOD`                | `42.toInt()`이 `42` 대신 사용됨                                                        |
| `USELESS_CALL_ON_NOT_NULL`                           | `"".orEmpty()`가 `""` 대신 사용됨                                                      |
| `REDUNDANT_SINGLE_EXPRESSION_STRING_TEMPLATE`        | `"$string"`이 `string` 대신 사용됨                                                     |
| `UNUSED_ANONYMOUS_PARAMETER`                         | 매개변수가 람다 식에서 전달되지만 사용되지 않음                                         |
| `REDUNDANT_VISIBILITY_MODIFIER`                      | `public class Klass`가 `class Klass` 대신 사용됨                                         |
| `REDUNDANT_MODALITY_MODIFIER`                        | `final class Klass`가 `class Klass` 대신 사용됨                                          |
| `REDUNDANT_SETTER_PARAMETER_TYPE`                    | `set(value: Int)`가 `set(value)` 대신 사용됨                                           |
| `CAN_BE_VAL`                                         | `var local = 0`이 정의되었지만 재할당되지 않았으므로 `val local = 42` 대신 사용 가능 |
| `ASSIGNED_VALUE_IS_NEVER_READ`                       | `val local = 42`가 정의되었지만 코드에서 이후에 사용되지 않음                        |
| `UNUSED_VARIABLE`                                    | `val local = 0`이 정의되었지만 코드에서 사용되지 않음                                  |
| `REDUNDANT_RETURN_UNIT_TYPE`                         | `fun foo(): Unit {}`가 `fun foo() {}` 대신 사용됨                                       |
| `UNREACHABLE_CODE`                                   | 코드 문이 있지만 실행할 수 없음                                                       |

검사가 true이면 문제를 해결하는 방법에 대한 제안과 함께 컴파일러 경고가 표시됩니다.

추가 검사는 기본적으로 비활성화됩니다.
이를 활성화하려면 명령줄에서 `-Wextra` 컴파일러 옵션을 사용하거나
Gradle 빌드 파일의 `compilerOptions {}` 블록에서 `extraWarnings`를 지정합니다.

```kotlin
// build.gradle.kts
kotlin {
    compilerOptions {
        extraWarnings.set(true)
    }
}
```

컴파일러 옵션을 정의하고 사용하는 방법에 대한 자세한 내용은
[Kotlin Gradle 플러그인의 컴파일러 옵션](gradle-compiler-options)을 참조하세요.

### 전역 경고 표시 안 함

2.1.0에서는 Kotlin 컴파일러가 많은 요청을 받은 기능인 전역적으로 경고를 표시하지 않는 기능을 받았습니다.

이제 명령줄에서 `-Xsuppress-warning=WARNING_NAME` 구문을 사용하거나
빌드 파일의 `compilerOptions {}` 블록에서 `freeCompilerArgs` 속성을 사용하여 전체 프로젝트에서 특정 경고를 표시하지 않을 수 있습니다.

예를 들어 프로젝트에서 [추가 컴파일러 검사](#extra-compiler-checks)가 활성화되어 있지만 그중 하나를 표시하지 않으려면 다음을 사용합니다.

```kotlin
// build.gradle.kts
kotlin {
    compilerOptions {
        extraWarnings.set(true)
        freeCompilerArgs.add("-Xsuppress-warning=CAN_BE_VAL")
    }
}
```

경고를 표시하지 않으려고 하지만 이름을 모르는 경우 요소를 선택하고 전구 아이콘을 클릭하거나(<shortcut>Cmd + Enter</shortcut>/<shortcut>Alt + Enter</shortcut> 사용):

<img src="/img/warning-name-intention.png" alt="Warning name intention" width="500" style={{verticalAlign: 'middle'}}/>

새 컴파일러 옵션은 현재 [실험적](components-stability#stability-levels-explained)입니다.
다음 세부 정보도 주목할 가치가 있습니다.

* 오류 표시는 허용되지 않습니다.
* 알 수 없는 경고 이름을 전달하면 컴파일이 오류로 이어집니다.
* 한 번에 여러 경고를 지정할 수 있습니다.
  
   <Tabs>
   <TabItem value="Command line" label="명령줄">

   ```bash
   kotlinc -Xsuppress-warning=NOTHING_TO_INLINE -Xsuppress-warning=NO_TAIL_CALLS_FOUND main.kt
   ```

   </TabItem>
   <TabItem value="Build file" label="빌드 파일">

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

   </TabItem>
   </Tabs>

### 개선된 K2 kapt 구현

:::note
K2 컴파일러용 kapt 플러그인(K2 kapt)은 [알파](components-stability#stability-levels-explained) 단계입니다.
언제든지 변경될 수 있습니다.

[YouTrack](https://youtrack.jetbrains.com/issue/KT-71439/K2-kapt-feedback)에서 피드백을 보내주시면 감사하겠습니다.

현재 [kapt](kapt) 플러그인을 사용하는 프로젝트는 기본적으로 K1 컴파일러와 함께 작동하며,
최대 1.9 버전의 Kotlin을 지원합니다.

Kotlin 1.9.20에서는 K2 컴파일러(K2 kapt)가 있는 kapt 플러그인의 실험적 구현을 시작했습니다.
이제 기술 및 성능 문제를 완화하기 위해 K2 kapt의 내부 구현을 개선했습니다.

새로운 K2 kapt 구현은 새로운 기능을 도입하지 않지만,
이전 K2 kapt 구현에 비해 성능이 크게 향상되었습니다.
또한 K2 kapt 플러그인의 동작은 이제 K1 kapt의 동작과 훨씬 더 유사합니다.

새로운 K2 kapt 플러그인 구현을 사용하려면 이전 K2 kapt 플러그인과 마찬가지로 활성화하세요.
프로젝트의 `gradle.properties` 파일에 다음 옵션을 추가합니다.

```kotlin
kapt.use.k2=true
```

향후 릴리스에서는 K2 kapt 구현이 K1 kapt 대신 기본적으로 활성화되므로
더 이상 수동으로 활성화할 필요가 없습니다.

새로운 구현이 안정화되기 전에 [피드백](https://youtrack.jetbrains.com/issue/KT-71439/K2-kapt-feedback)을 보내주시면 대단히 감사하겠습니다.

### 부호 없는 타입과 비원시 타입 간의 오버로드 충돌 해결

이번 릴리스에서는 함수가 부호 없는 타입과 비원시 타입에 대해 오버로드될 때
이전 버전에서 발생할 수 있는 오버로드 충돌 문제를 해결합니다.
다음 예와 같습니다.

#### 오버로드된 확장 함수

```kotlin
fun Any.doStuff() = "Any"
fun UByte.doStuff() = "UByte"

fun main() {
    val uByte: UByte = UByte.MIN_VALUE
    uByte.doStuff() // Kotlin 2.1.0 이전의 오버로드 확인 모호성
}
```

이전 버전에서는 `uByte.doStuff()`를 호출하면 `Any` 및 `UByte` 확장이 모두 적용 가능했기 때문에 모호성이 발생했습니다.

#### 오버로드된 최상위 함수

```kotlin
fun doStuff(value: Any) = "Any"
fun doStuff(value: UByte) = "UByte"

fun main() {
    val uByte: UByte = UByte.MIN_VALUE
    doStuff(uByte) // Kotlin 2.1.0 이전의 오버로드 확인 모호성
}
```

마찬가지로 컴파일러가 `Any` 버전 또는 `UByte` 버전을 사용할지 결정할 수 없었기 때문에 `doStuff(uByte)` 호출은 모호했습니다.
2.1.0에서는 컴파일러가 이러한 경우를 올바르게 처리하여 더 구체적인 타입인 `UByte`에 우선순위를 부여하여 모호성을 해결합니다.

## Kotlin/JVM

2.1.0 버전부터 컴파일러는 Java 23 바이트코드를 포함하는 클래스를 생성할 수 있습니다.

### JSpecify nullability 불일치 진단 심각도를 엄격으로 변경

Kotlin 2.1.0은 `org.jspecify.annotations`의 nullability 어노테이션에 대한 엄격한 처리를 적용하여
Java 상호 운용성에 대한 타입 안전성을 개선합니다.

다음 nullability 어노테이션이 영향을 받습니다.

* `org.jspecify.annotations.Nullable`
* `org.jspecify.annotations.NonNull`
* `org.jspecify.annotations.NullMarked`
* `org.jspecify.nullness`의 레거시 어노테이션(JSpecify 0.2 이하)

Kotlin 2.1.0부터 nullability 불일치는 기본적으로 경고에서 오류로 올라갑니다.
이렇게 하면 `@NonNull` 및 `@Nullable`과 같은 어노테이션이 타입 검사 중에 적용되어
예기치 않은 nullability 문제가 런타임에 발생하는 것을 방지할 수 있습니다.

`@NullMarked` 어노테이션은 범위 내의 모든 멤버의 nullability에도 영향을 미쳐
어노테이션이 지정된 Java 코드로 작업할 때 동작을 더 예측 가능하게 만듭니다.

다음은 새로운 기본 동작을 보여주는 예입니다.

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
    // 허용되는 null이 아닌 결과에 액세스합니다.
    sjc.foo().length

    // 결과가 null 가능하기 때문에 기본 엄격 모드에서 오류를 발생시킵니다.
    // 오류를 방지하려면 ?.length를 대신 사용하세요.
    sjc.bar().length
}
```

이러한 어노테이션에 대한 진단의 심각도를 수동으로 제어할 수 있습니다.
이렇게 하려면 `-Xnullability-annotations` 컴파일러 옵션을 사용하여 모드를 선택합니다.

* `ignore`: nullability 불일치를 무시합니다.
* `warning`: nullability 불일치에 대한 경고를 보고합니다.
* `strict`: nullability 불일치에 대한 오류를 보고합니다(기본 모드).

자세한 내용은 [Nullability 어노테이션](java-interop#nullability-annotations)을 참조하세요.

## Kotlin Multiplatform

Kotlin 2.1.0에서는 [Swift 내보내기에 대한 기본 지원](#basic-support-for-swift-export)을 도입하고
[모든 호스트에서 Kotlin Multiplatform 라이브러리를 더 쉽게 게시할 수 있도록 합니다](#ability-to-publish-kotlin-libraries-from-any-host).
또한 [컴파일러 옵션을 구성하기 위한 새로운 DSL](#new-gradle-dsl-for-compiler-options-in-multiplatform-projects-promoted-to-stable)을 안정화하고
[Isolated Projects 기능의 미리 보기](#preview-gradle-s-isolated-projects-in-kotlin-multiplatform)를 제공하는 Gradle 관련 개선 사항에 중점을 둡니다.

### Multiplatform 프로젝트에서 컴파일러 옵션을 구성하기 위한 새로운 Gradle DSL이 안정화됨

Kotlin 2.0.0에서는 [Multiplatform 프로젝트에서 컴파일러 옵션 구성을 간소화하기 위해 새로운 실험적 Gradle DSL](whatsnew20#new-gradle-dsl-for-compiler-options-in-multiplatform-projects)을 도입했습니다.
Kotlin 2.1.0에서는 이 DSL이 안정화되었습니다.

이제 전체 프로젝트 구성에는 세 개의 레이어가 있습니다. 가장 높은 것은 확장 수준이고,
그다음은 대상 수준이며, 가장 낮은 것은 컴파일 단위(일반적으로 컴파일 작업)입니다.

<img src="/img/compiler-options-levels.svg" alt="Kotlin 컴파일러 옵션 수준" width="700" style={{verticalAlign: 'middle'}}/>

다양한 수준과 컴파일러 옵션이 구성될 수 있는 방법에 대한 자세한 내용은
[컴파일러 옵션](multiplatform-dsl-reference#compiler-options)을 참조하세요.

### Kotlin Multiplatform에서 Gradle의 Isolated Projects 미리 보기

이 기능은 [실험적](components-stability#stability-levels-explained)이며 현재 Gradle에서 사전 알파 상태입니다.
평가 목적으로만 Gradle 버전 8.10에서 사용하세요. 이 기능은 언제든지 삭제되거나 변경될 수 있습니다.

[YouTrack](https://youtrack.jetbrains.com/issue/KT-57279/Support-Gradle-Project-Isolation-Feature-for-Kotlin-Multiplatform)에서 피드백을 보내주시면 감사하겠습니다.
옵트인이 필요합니다(자세한 내용은 아래 참조).

Kotlin 2.1.0에서는
Multiplatform 프로젝트에서 Gradle의 [Isolated Projects](https://docs.gradle.org/current/userguide/isolated_projects.html)
기능을 미리 볼 수 있습니다.

Gradle의 Isolated Projects 기능은
개별 Gradle 프로젝트의 구성을 서로 "분리"하여 빌드 성능을 향상시킵니다.
각 프로젝트의 빌드 로직은 다른 프로젝트의 변경 가능한 상태에 직접 액세스하는 것이 제한되어
안전하게 병렬로 실행할 수 있습니다.
이 기능을 지원하기 위해 Kotlin Gradle 플러그인의 모델을 일부 변경했으며,
이 미리 보기 단계에서 귀하의 경험에 대한 의견을 듣고 싶습니다.

Kotlin Gradle 플러그인의 새 모델을 활성화하는 방법에는 두 가지가 있습니다.

* 옵션 1: **Isolated Projects를 활성화하지 않고 호환성 테스트** –
  Isolated Projects 기능을 활성화하지 않고 Kotlin Gradle 플러그인의 새 모델과의 호환성을 확인하려면
  프로젝트의 `gradle.properties` 파일에 다음 Gradle 속성을 추가합니다.

  ```none
  # gradle.properties
  kotlin.kmp.isolated-projects.support=enable
  ```

* 옵션 2: **Isolated Projects를 활성화하여 테스트** –
  Gradle에서 Isolated Projects 기능을 활성화하면 자동으로 Kotlin Gradle 플러그인이 새 모델을 사용하도록 구성됩니다.
  Isolated Projects 기능을 활성화하려면 [시스템 속성을 설정합니다](https://docs.gradle.org/current/userguide/isolated_projects.html#how_do_i_use_it).
  이 경우 Kotlin Gradle 플러그인에 대한 Gradle 속성을 프로젝트에 추가할 필요가 없습니다.

### Swift 내보내기에 대한 기본 지원

이 기능은 현재 개발 초기 단계에 있습니다. 언제든지 삭제되거나 변경될 수 있습니다.
옵트인이 필요하며(자세한 내용은 아래 참조), 평가 목적으로만 사용해야 합니다.
[YouTrack](https://kotl.in/issue)에서 피드