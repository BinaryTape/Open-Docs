[//]: # (title: Kotlin 1.8.20의 새로운 기능)

_[출시일: 2023년 4월 25일](releases.md#release-details)_

Kotlin 1.8.20 릴리스가 출시되었으며, 주요 하이라이트는 다음과 같습니다:

*   [새로운 Kotlin K2 컴파일러 업데이트](#new-kotlin-k2-compiler-updates)
*   [새로운 실험적 Kotlin/Wasm 타겟](#new-kotlin-wasm-target)
*   [Gradle에서 기본적으로 새로운 JVM 증분 컴파일](#new-jvm-incremental-compilation-by-default-in-gradle)
*   [Kotlin/Native 타겟 업데이트](#update-for-kotlin-native-targets)
*   [Kotlin Multiplatform에서 Gradle 복합 빌드 미리 보기](#preview-of-gradle-composite-builds-support-in-kotlin-multiplatform)
*   [Xcode에서 Gradle 오류 출력 개선](#improved-output-for-gradle-errors-in-xcode)
*   [표준 라이브러리의 AutoCloseable 인터페이스에 대한 실험적 지원](#support-for-the-autocloseable-interface)
*   [표준 라이브러리의 Base64 인코딩에 대한 실험적 지원](#support-for-base64-encoding)

이 영상에서 변경 사항에 대한 간단한 개요를 확인할 수도 있습니다:

<video src="https://www.youtube.com/v/R1JpkpPzyBU" title="What's new in Kotlin 1.8.20"/>

## IDE 지원

1.8.20을 지원하는 Kotlin 플러그인은 다음 IDE에서 사용할 수 있습니다:

| IDE            | 지원 버전            |
|----------------|-------------------------------|
| IntelliJ IDEA  | 2022.2.x, 2022.3.x,  2023.1.x |
| Android Studio | Flamingo (222)                |

> Kotlin 아티팩트 및 의존성을 올바르게 다운로드하려면, [Gradle 설정](##configure-gradle-settings)을
> Maven Central 저장소를 사용하도록 구성하십시오.
>
{style="warning"}

## 새로운 Kotlin K2 컴파일러 업데이트

Kotlin 팀은 K2 컴파일러의 안정화를 계속하고 있습니다. [Kotlin 1.7.0 발표](whatsnew17.md#new-kotlin-k2-compiler-for-the-jvm-in-alpha)에서 언급했듯이, 아직 **알파** 버전입니다.
이번 릴리스에서는 [K2 베타](https://youtrack.jetbrains.com/issue/KT-52604)로 나아가는 과정에서 추가적인 개선 사항이 도입되었습니다.

1.8.20 릴리스부터 Kotlin K2 컴파일러는 다음과 같습니다:

*   직렬화 플러그인의 프리뷰 버전이 있습니다.
*   [JS IR 컴파일러](js-ir-compiler.md)에 대한 알파 지원을 제공합니다.
*   [새로운 언어 버전, Kotlin 2.0](https://blog.jetbrains.com/kotlin/2023/02/k2-kotlin-2-0/)의 향후 릴리스를 소개합니다.

새로운 컴파일러와 그 이점에 대해 다음 영상에서 자세히 알아보십시오:

*   [모든 사람이 알아야 할 새로운 Kotlin K2 컴파일러](https://www.youtube.com/watch?v=iTdJJq_LyoY)
*   [새로운 Kotlin K2 컴파일러: 전문가 리뷰](https://www.youtube.com/watch?v=db19VFLZqJM)

### Kotlin K2 컴파일러 활성화 방법

Kotlin K2 컴파일러를 활성화하고 테스트하려면 다음 컴파일러 옵션과 함께 새로운 언어 버전을 사용하십시오:

```bash
-language-version 2.0
```

`build.gradle(.kts)` 파일에 다음과 같이 지정할 수 있습니다:

```kotlin
kotlin {
   sourceSets.all {
       languageSettings {
           languageVersion = "2.0"
       }
   }
}
```

이전의 `-Xuse-k2` 컴파일러 옵션은 더 이상 사용되지 않습니다.

> 새로운 K2 컴파일러의 알파 버전은 JVM 및 JS IR 프로젝트에서만 작동합니다.
> Kotlin/Native 또는 멀티플랫폼 프로젝트는 아직 지원하지 않습니다.
>
{style="warning"}

### 새로운 K2 컴파일러에 대한 피드백 남기기

어떤 피드백이든 감사히 받겠습니다!

*   Kotlin Slack에서 K2 개발자에게 직접 피드백을 제공하세요 – [초대받기](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up?_gl=1*ju6cbn*_ga*MTA3MTk5NDkzMC4xNjQ2MDY3MDU4*_ga_9J976DJZ68*MTY1ODMzNzA3OS4xMDAuMS4xNjU4MzQwODEwLjYw) 및 [#k2-early-adopters](https://kotlinlang.slack.com/archives/C03PK0PE257) 채널에 참여.
*   새로운 K2 컴파일러 사용 중 직면한 문제에 대해 [이슈 트래커](https://kotl.in/issue)에 보고.
*   JetBrains가 K2 사용에 대한 익명 데이터를 수집하도록 [**사용량 통계 전송** 옵션 활성화](https://www.jetbrains.com/help/idea/settings-usage-statistics.html).

## 언어

Kotlin이 계속 진화함에 따라 1.8.20에서는 새로운 언어 기능에 대한 프리뷰 버전을 소개합니다:

*   [Enum 클래스 `values` 함수의 현대적이고 고성능 대체](#a-modern-and-performant-replacement-of-the-enum-class-values-function)
*   [데이터 클래스와의 대칭성을 위한 데이터 객체](#preview-of-data-objects-for-symmetry-with-data-classes)
*   [인라인 클래스에서 본문이 있는 보조 생성자 제한 해제 미리 보기](#preview-of-lifting-restriction-on-secondary-constructors-with-bodies-in-inline-classes)

### Enum 클래스 `values` 함수의 현대적이고 고성능 대체

> 이 기능은 [실험적](components-stability.md#stability-levels-explained)입니다.
> 언제든지 삭제되거나 변경될 수 있습니다. 옵트인(자세한 내용은 아래 참조)이 필요합니다. 평가 목적으로만 사용하십시오.
> [YouTrack](https://kotl.in/issue)에 대한 여러분의 피드백을 감사히 받겠습니다.
>
{style="warning"}

Enum 클래스에는 정의된 enum 상수의 배열을 반환하는 합성(synthetic) `values()` 함수가 있습니다. 그러나 배열을 사용하면 Kotlin 및 Java에서 [숨겨진 성능 문제](https://github.com/Kotlin/KEEP/blob/master/proposals/enum-entries.md#examples-of-performance-issues)가 발생할 수 있습니다.
또한 대부분의 API는 컬렉션을 사용하므로 결국 변환이 필요합니다. 이러한 문제를 해결하기 위해, `values()` 함수 대신 사용해야 하는 Enum 클래스의 `entries` 프로퍼티를 도입했습니다.
`entries` 프로퍼티가 호출되면 사전 할당된 불변(immutable) 리스트를 반환합니다.

> `values()` 함수는 여전히 지원되지만, 대신 `entries` 프로퍼티를 사용하는 것을 권장합니다.
>
{style="tip"}

```kotlin
enum class Color(val colorName: String, val rgb: String) {
    RED("Red", "#FF0000"),
    ORANGE("Orange", "#FF7F00"),
    YELLOW("Yellow", "#FFFF00")
}

@OptIn(ExperimentalStdlibApi::class)
fun findByRgb(rgb: String): Color? = Color.entries.find { it.rgb == rgb }
```
{validate="false"}

#### `entries` 프로퍼티 활성화 방법

이 기능을 사용해 보려면, `@OptIn(ExperimentalStdlibApi)`로 옵트인하고 `-language-version 1.9` 컴파일러 옵션을 활성화하십시오.
Gradle 프로젝트에서는 `build.gradle(.kts)` 파일에 다음을 추가하여 활성화할 수 있습니다:

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
tasks
    .withType<org.jetbrains.kotlin.gradle.tasks.KotlinCompilationTask<*>>()
    .configureEach {
        compilerOptions
            .languageVersion
            .set(
                org.jetbrains.kotlin.gradle.dsl.KotlinVersion.KOTLIN_1_9
            )
    }
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
tasks
    .withType(org.jetbrains.kotlin.gradle.tasks.KotlinCompilationTask.class)
    .configureEach {
        compilerOptions.languageVersion =
            org.jetbrains.kotlin.gradle.dsl.KotlinVersion.KOTLIN_1_9
    }
```

</tab>
</tabs>

> IntelliJ IDEA 2023.1부터 이 기능을 옵트인하면, 적절한 IDE
> 인스펙션이 `values()`에서 `entries`로의 변환에 대해 알리고 빠른 수정을 제공할 것입니다.
>
{style="tip"}

제안에 대한 자세한 내용은 [KEEP 노트](https://github.com/Kotlin/KEEP/blob/master/proposals/enum-entries.md)를 참조하십시오.

### 데이터 클래스와의 대칭성을 위한 데이터 객체 미리 보기

데이터 객체를 사용하면 싱글턴 의미론과 깔끔한 `toString()` 표현을 갖는 객체를 선언할 수 있습니다. 다음 코드 스니펫에서 `object` 선언에 `data` 키워드를 추가하면 `toString()` 출력의 가독성이 어떻게 향상되는지 볼 수 있습니다:

```kotlin
package org.example
object MyObject
data object MyDataObject

fun main() {
    println(MyObject) // org.example.MyObject@1f32e575
    println(MyDataObject) // MyDataObject
}
```

특히 `sealed` 계층(`sealed class` 또는 `sealed interface` 계층과 같은)의 경우, `data object`는 `data class` 선언과 함께 편리하게 사용될 수 있어 탁월한 선택입니다.
이 스니펫에서 `EndOfFile`을 일반 `object` 대신 `data object`로 선언하는 것은 수동으로 재정의할 필요 없이 깔끔한 `toString`을 얻게 된다는 것을 의미합니다.
이는 동반되는 데이터 클래스 정의와의 대칭성을 유지합니다.

```kotlin
sealed interface ReadResult
data class Number(val number: Int) : ReadResult
data class Text(val text: String) : ReadResult
data object EndOfFile : ReadResult

fun main() {
    println(Number(7)) // Number(number=7)
    println(EndOfFile) // EndOfFile
}
```

#### 데이터 객체의 의미론

[Kotlin 1.7.20](whatsnew1720.md#improved-string-representations-for-singletons-and-sealed-class-hierarchies-with-data-objects)의 첫 프리뷰 버전부터 데이터 객체의 의미론이 개선되었습니다.
이제 컴파일러는 이들을 위한 여러 편의 함수를 자동으로 생성합니다:

##### toString

데이터 객체의 `toString()` 함수는 객체의 단순 이름을 반환합니다:

```kotlin
data object MyDataObject {
    val x: Int = 3
}

fun main() {
    println(MyDataObject) // MyDataObject
}
```

##### equals 및 hashCode

`data object`의 `equals()` 함수는 `data object`의 타입을 가진 모든 객체가 동등하다고 간주되도록 보장합니다. 대부분의 경우, 런타임에는 데이터 객체의 단일 인스턴스만 존재할 것입니다(결국 `data object`는 싱글턴을 선언합니다).
그러나 동일한 타입의 다른 객체가 런타임에 생성되는 특정 예외 상황(예: `java.lang.reflect`를 통한 플랫폼 리플렉션, 또는 이 API를 내부적으로 사용하는 JVM 직렬화 라이브러리 사용)에서는,
이 함수가 객체들이 동등하게 처리되도록 보장합니다.

`data object`를 비교할 때는 구조적으로(`==` 연산자 사용)만 비교하고 참조적으로(`===` 연산자)는 절대 비교하지 마십시오. 이는 런타임에 데이터 객체의 인스턴스가 두 개 이상 존재할 때의 함정을 피하는 데 도움이 됩니다. 다음 코드 스니펫은 이 특정 예외 상황을 보여줍니다:

```kotlin
import java.lang.reflect.Constructor

data object MySingleton

fun main() {
    val evilTwin = createInstanceViaReflection()

    println(MySingleton) // MySingleton
    println(evilTwin) // MySingleton

    // 라이브러리가 MySingleton의 두 번째 인스턴스를 강제로 생성하더라도, `equals` 메서드는 true를 반환합니다:
    println(MySingleton == evilTwin) // true

    // data object를 === 로 비교하지 마십시오.
    println(MySingleton === evilTwin) // false
}

fun createInstanceViaReflection(): MySingleton {
    // Kotlin 리플렉션은 data object의 인스턴스화를 허용하지 않습니다.
    // 이것은 "강제로" (즉, Java 플랫폼 리플렉션을 통해) 새로운 MySingleton 인스턴스를 생성합니다.
    // 직접 시도하지 마십시오!
    return (MySingleton.javaClass.declaredConstructors[0].apply { isAccessible = true } as Constructor<MySingleton>).newInstance()
}
```

생성된 `hashCode()` 함수의 동작은 `equals()` 함수의 동작과 일관적이므로, `data object`의 모든 런타임 인스턴스는 동일한 해시 코드를 가집니다.

##### 데이터 객체에는 `copy` 및 `componentN` 함수 없음

`data object`와 `data class` 선언은 종종 함께 사용되고 일부 유사점이 있지만, `data object`에는 생성되지 않는 일부 함수가 있습니다:

`data object` 선언은 싱글턴 객체로 사용되도록 의도되었으므로, `copy()` 함수는 생성되지 않습니다.
싱글턴 패턴은 클래스의 인스턴스화를 단일 인스턴스로 제한하며, 인스턴스의 복사본 생성을 허용하면 해당 제한을 위반하게 됩니다.

또한, `data class`와 달리 `data object`에는 데이터 프로퍼티가 없습니다. 이러한 객체를 비구조화하는 것은 의미가 없으므로, `componentN()` 함수는 생성되지 않습니다.

이 기능에 대한 여러분의 피드백을 [YouTrack](https://youtrack.jetbrains.com/issue/KT-4107)에 남겨주시면 감사하겠습니다.

#### 데이터 객체 미리 보기 활성화 방법

이 기능을 사용해 보려면 `-language-version 1.9` 컴파일러 옵션을 활성화하십시오. Gradle 프로젝트에서는 `build.gradle(.kts)` 파일에 다음을 추가하여 활성화할 수 있습니다:

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
tasks
    .withType<org.jetbrains.kotlin.gradle.tasks.KotlinCompilationTask<*>>()
    .configureEach {
        compilerOptions
            .languageVersion
            .set(
                org.jetbrains.kotlin.gradle.dsl.KotlinVersion.KOTLIN_1_9
            )
    }
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
tasks
    .withType(org.jetbrains.kotlin.gradle.tasks.KotlinCompilationTask.class)
    .configureEach {
        compilerOptions.languageVersion =
            org.jetbrains.kotlin.gradle.dsl.KotlinVersion.KOTLIN_1_9
    }
```

</tab>
</tabs>

### 인라인 클래스에서 본문이 있는 보조 생성자 제한 해제 미리 보기

> 이 기능은 [실험적](components-stability.md#stability-levels-explained)입니다. 언제든지 삭제되거나 변경될 수 있습니다.
> 옵트인(자세한 내용은 아래 참조)이 필요합니다. 평가 목적으로만 사용하십시오. [YouTrack](https://kotl.in/issue)에 대한 여러분의 피드백을 감사히 받겠습니다.
>
{style="warning"}

Kotlin 1.8.20은 [인라인 클래스](inline-classes.md)에서 본문이 있는 보조 생성자 사용에 대한 제한을 해제합니다.

이전에는 인라인 클래스는 깔끔한 초기화 의미론을 갖기 위해 `init` 블록이나 보조 생성자가 없는 public 기본 생성자만 허용했습니다.
그 결과, 내부 값을 캡슐화하거나 제약된 값을 나타내는 인라인 클래스를 생성하는 것이 불가능했습니다.

이러한 문제는 Kotlin 1.4.30에서 `init` 블록에 대한 제한이 해제되면서 해결되었습니다.
이제 한 단계 더 나아가 미리 보기 모드에서 본문이 있는 보조 생성자를 허용합니다:

```kotlin
@JvmInline
value class Person(private val fullName: String) {
    // Kotlin 1.4.30부터 허용:
    init { 
        check(fullName.isNotBlank()) {
            "Full name shouldn't be empty"
        }
    }

    // Kotlin 1.8.20부터 미리 보기 가능:
    constructor(name: String, lastName: String) : this("$name $lastName") {
        check(lastName.isNotBlank()) {
            "Last name shouldn't be empty"
        }
    }
}
```

#### 본문이 있는 보조 생성자 활성화 방법

이 기능을 사용해 보려면 `-language-version 1.9` 컴파일러 옵션을 활성화하십시오. Gradle 프로젝트에서는 `build.gradle(.kts)`에 다음을 추가하여 활성화할 수 있습니다:

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
tasks
    .withType<org.jetbrains.kotlin.gradle.tasks.KotlinCompilationTask<*>>()
    .configureEach {
        compilerOptions
            .languageVersion
            .set(
                org.jetbrains.kotlin.gradle.dsl.KotlinVersion.KOTLIN_1_9
            )
    }
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
tasks
    .withType(org.jetbrains.kotlin.gradle.tasks.KotlinCompilationTask.class)
    .configureEach {
        compilerOptions.languageVersion =
            org.jetbrains.kotlin.gradle.dsl.KotlinVersion.KOTLIN_1_9
    }
```

</tab>
</tabs>

이 기능을 사용해 보고 [YouTrack](https://kotl.in/issue)에 모든 보고서를 제출하여 Kotlin 1.9.0에서 이 기능을 기본으로 만들 수 있도록 도와주시면 감사하겠습니다.

Kotlin 인라인 클래스 개발에 대한 자세한 내용은 [이 KEEP](https://github.com/Kotlin/KEEP/blob/master/proposals/inline-classes.md)에서 확인할 수 있습니다.

## 새로운 Kotlin/Wasm 타겟

이번 릴리스에서 Kotlin/Wasm (Kotlin WebAssembly)은 [실험적](components-stability.md#stability-levels-explained) 단계로 전환됩니다.
Kotlin 팀은 [WebAssembly](https://webassembly.org/)를 유망한 기술로 보고, Kotlin의 모든 이점을 활용하여 이를 사용하는 더 나은 방법을 찾고자 합니다.

WebAssembly 바이너리 형식은 자체 가상 머신을 사용하여 실행되므로 플랫폼에 독립적입니다. 거의 모든 최신 브라우저는 이미 WebAssembly 1.0을 지원합니다.
WebAssembly를 실행하는 환경을 설정하려면 Kotlin/Wasm이 타겟으로 하는 실험적인 가비지 컬렉션 모드를 활성화하기만 하면 됩니다. 자세한 지침은 다음에서 확인할 수 있습니다: [Kotlin/Wasm 활성화 방법](#how-to-enable-kotlin-wasm).

새로운 Kotlin/Wasm 타겟의 다음 장점을 강조하고 싶습니다:

*   Kotlin/Wasm은 LLVM을 사용할 필요가 없으므로 `wasm32` Kotlin/Native 타겟보다 컴파일 속도가 더 빠릅니다.
*   [Wasm 가비지 컬렉션](https://github.com/WebAssembly/gc) 덕분에 `wasm32` 타겟보다 JS와의 상호 운용성 및 브라우저 통합이 더 쉽습니다.
*   Wasm은 작고 파싱하기 쉬운 바이트코드를 가지고 있으므로 Kotlin/JS 및 JavaScript보다 잠재적으로 애플리케이션 시작이 더 빠릅니다.
*   Wasm은 정적 타입 언어이므로 Kotlin/JS 및 JavaScript보다 애플리케이션 런타임 성능이 향상되었습니다.

1.8.20 릴리스부터 실험적인 프로젝트에서 Kotlin/Wasm을 사용할 수 있습니다.
Kotlin 표준 라이브러리(`stdlib`)와 테스트 라이브러리(`kotlin.test`)를 Kotlin/Wasm에 대해 별도의 설정 없이 제공합니다.
IDE 지원은 향후 릴리스에서 추가될 예정입니다.

[이 YouTube 영상에서 Kotlin/Wasm에 대해 자세히 알아보십시오](https://www.youtube.com/watch?v=-pqz9sKXatw).

### Kotlin/Wasm 활성화 방법

Kotlin/Wasm을 활성화하고 테스트하려면 `build.gradle.kts` 파일을 업데이트하십시오:

```kotlin
plugins {
    kotlin("multiplatform") version "1.8.20"
}

kotlin {
    wasm {
        binaries.executable()
        browser {
        }
    }
    sourceSets {
        val commonMain by getting
        val commonTest by getting {
            dependencies {
                implementation(kotlin("test"))
            }
        }
        val wasmMain by getting
        val wasmTest by getting
    }
}
```

> [Kotlin/Wasm 예제 GitHub 저장소](https://github.com/Kotlin/kotlin-wasm-examples)를 확인해 보십시오.
>
{style="tip"}

Kotlin/Wasm 프로젝트를 실행하려면 대상 환경의 설정을 업데이트해야 합니다:

<tabs>
<tab title="Chrome">

*   버전 109의 경우:

    `--js-flags=--experimental-wasm-gc` 명령줄 인수를 사용하여 애플리케이션을 실행하십시오.

*   버전 110 이상의 경우:

    1.  브라우저에서 `chrome://flags/#enable-webassembly-garbage-collection`으로 이동합니다.
    2.  **WebAssembly Garbage Collection**을 활성화합니다.
    3.  브라우저를 다시 시작합니다.

</tab>
<tab title="Firefox">

버전 109 이상의 경우:

1.  브라우저에서 `about:config`로 이동합니다.
2.  `javascript.options.wasm_function_references` 및 `javascript.options.wasm_gc` 옵션을 활성화합니다.
3.  브라우저를 다시 시작합니다.

</tab>
<tab title="Edge">

버전 109 이상의 경우:

`--js-flags=--experimental-wasm-gc` 명령줄 인수를 사용하여 애플리케이션을 실행하십시오.

</tab>
</tabs>

### Kotlin/Wasm에 대한 피드백 남기기

어떤 피드백이든 감사히 받겠습니다!

*   Kotlin Slack에서 개발자에게 직접 피드백을 제공하세요 – [초대받기](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up?_gl=1*ju6cbn*_ga*MTA3MTk5NDkzMC4xNjQ2MDY3MDU4*_ga_9J976DJZ68*MTY1ODMzNzA3OS4xMDAuMS4xNjU4MzQwODEwLjYw) 및 [#webassembly](https://kotlinlang.slack.com/archives/CDFP59223) 채널에 참여.
*   Kotlin/Wasm 사용 중 직면한 문제에 대해 [이 YouTrack 이슈](https://youtrack.jetbrains.com/issue/KT-56492)에 보고.

## Kotlin/JVM

Kotlin 1.8.20은 [자바 합성(synthetic) 프로퍼티 참조 미리 보기](#preview-of-java-synthetic-property-references)와
[기본적으로 kapt 스텁 생성 태스크에서 JVM IR 백엔드 지원](#support-for-the-jvm-ir-backend-in-kapt-stub-generating-task-by-default)을 도입합니다.

### 자바 합성(synthetic) 프로퍼티 참조 미리 보기

> 이 기능은 [실험적](components-stability.md#stability-levels-explained)입니다.
> 언제든지 삭제되거나 변경될 수 있습니다. 평가 목적으로만 사용하십시오.
> [YouTrack](https://kotl.in/issue)에 대한 여러분의 피드백을 감사히 받겠습니다.
>
{style="warning"}

Kotlin 1.8.20은 자바 합성(synthetic) 프로퍼티에 대한 참조를 생성하는 기능을 도입합니다. 예를 들어, 다음 자바 코드에 대해:

```java
public class Person {
    private String name;
    private int age;

    public Person(String name, int age) {
        this.name = name;
        this.age = age;
    }

    public String getName() {
        return name;
    }

    public int getAge() {
        return age;
    }
}
```

Kotlin은 항상 `age`가 합성(synthetic) 프로퍼티인 경우 `person.age`를 작성하도록 허용했습니다.
이제 `Person::age` 및 `person::age`에 대한 참조도 생성할 수 있습니다. `name`에 대해서도 동일하게 작동합니다.

```kotlin
val persons = listOf(Person("Jack", 11), Person("Sofie", 12), Person("Peter", 11))
    persons
        // 자바 합성 프로퍼티에 대한 참조 호출:
        .sortedBy(Person::age)
        // Kotlin 프로퍼티 구문을 통해 자바 게터(getter) 호출:
        .forEach { person -> println(person.name) }
```
{validate="false"}

#### 자바 합성(synthetic) 프로퍼티 참조 활성화 방법

이 기능을 사용해 보려면 `-language-version 1.9` 컴파일러 옵션을 활성화하십시오.
Gradle 프로젝트에서는 `build.gradle(.kts)`에 다음을 추가하여 활성화할 수 있습니다:

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
tasks
    .withType<org.jetbrains.kotlin.gradle.tasks.KotlinCompilationTask<*>>()
    .configureEach {
        compilerOptions
            .languageVersion
            .set(
                org.jetbrains.kotlin.gradle.dsl.KotlinVersion.KOTLIN_1_9
            )
    }
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
tasks
    .withType(org.jetbrains.kotlin.gradle.tasks.KotlinCompilationTask.class)
    .configureEach {
        compilerOptions.languageVersion =
            org.jetbrains.kotlin.gradle.dsl.KotlinVersion.KOTLIN_1_9
    }
```

</tab>
</tabs>

### 기본적으로 kapt 스텁 생성 태스크에서 JVM IR 백엔드 지원

Kotlin 1.7.20에서는 [kapt 스텁 생성 태스크에서 JVM IR 백엔드 지원](whatsnew1720.md#support-for-the-jvm-ir-backend-in-kapt-stub-generating-task)을 도입했습니다.
이번 릴리스부터는 이 지원이 기본적으로 작동합니다. 더 이상 `gradle.properties`에 `kapt.use.jvm.ir=true`를 지정하여 활성화할 필요가 없습니다.
이 기능에 대한 여러분의 피드백을 [YouTrack](https://youtrack.jetbrains.com/issue/KT-49682)에 남겨주시면 감사하겠습니다.

## Kotlin/Native

Kotlin 1.8.20에는 지원되는 Kotlin/Native 타겟 변경, Objective-C와의 상호 운용성, CocoaPods Gradle 플러그인 개선 등 다양한 업데이트가 포함되어 있습니다:

*   [Kotlin/Native 타겟 업데이트](#update-for-kotlin-native-targets)
*   [레거시 메모리 관리자 지원 중단](#deprecation-of-the-legacy-memory-manager)
*   [`@import` 지시어가 있는 Objective-C 헤더 지원](#support-for-objective-c-headers-with-import-directives)
*   [Cocoapods Gradle 플러그인의 링크 전용 모드 지원](#support-for-the-link-only-mode-in-cocoapods-gradle-plugin)
*   [UIKit에서 Objective-C 확장을 클래스 멤버로 임포트](#import-objective-c-extensions-as-class-members-in-uikit)
*   [컴파일러에서 컴파일러 캐시 관리 재구현](#reimplementation-of-compiler-cache-management-in-the-compiler)
*   [Cocoapods Gradle 플러그인에서 `useLibraries()` 지원 중단](#deprecation-of-uselibraries-in-cocoapods-gradle-plugin)

### Kotlin/Native 타겟 업데이트

Kotlin 팀은 Kotlin/Native에서 지원되는 타겟 목록을 재검토하고, 이를 티어로 분할하며,
Kotlin 1.8.20부터 일부 타겟에 대한 지원을 중단하기로 결정했습니다. 지원 및 지원 중단된 타겟의 전체 목록은 [Kotlin/Native 타겟 지원](native-target-support.md) 섹션을 참조하십시오.

다음 타겟은 Kotlin 1.8.20에서 지원 중단되었으며 1.9.20에서 제거될 예정입니다:

*   `iosArm32`
*   `watchosX86`
*   `wasm32`
*   `mingwX86`
*   `linuxArm32Hfp`
*   `linuxMips32`
*   `linuxMipsel32`

나머지 타겟의 경우, Kotlin/Native 컴파일러에서 타겟이 얼마나 잘 지원되고 테스트되는지에 따라 세 가지 지원 티어가 있습니다.
타겟은 다른 티어로 이동될 수 있습니다. 예를 들어, [Kotlin Multiplatform](https://www.jetbrains.com/help/kotlin-multiplatform-dev/get-started.html)에 중요하기 때문에
향후 `iosArm64`에 대한 완전한 지원을 제공하기 위해 최선을 다할 것입니다.

라이브러리 작성자라면, 이 타겟 티어가 CI 도구에서 어떤 타겟을 테스트하고 어떤 타겟을 건너뛸지 결정하는 데 도움이 될 수 있습니다.
Kotlin 팀은 [kotlinx.coroutines](coroutines-guide.md)와 같은 공식 Kotlin 라이브러리를 개발할 때 동일한 접근 방식을 사용할 것입니다.

이러한 변경의 이유에 대해 더 자세히 알아보려면 [블로그 게시물](https://blog.jetbrains.com/kotlin/2023/02/update-regarding-kotlin-native-targets/)을 확인하십시오.

### 레거시 메모리 관리자 지원 중단

1.8.20부터 레거시 메모리 관리자는 지원 중단되었으며 1.9.20에서 제거될 예정입니다.
[새로운 메모리 관리자](native-memory-manager.md)는 1.7.20부터 기본적으로 활성화되었으며, 추가적인 안정화 업데이트와 성능 개선이 이루어지고 있습니다.

여전히 레거시 메모리 관리자를 사용하고 있다면, `gradle.properties`에서 `kotlin.native.binary.memoryModel=strict` 옵션을 제거하고 [마이그레이션 가이드](native-migration-guide.md)를 따라 필요한 변경을 수행하십시오.

새로운 메모리 관리자는 `wasm32` 타겟을 지원하지 않습니다. 이 타겟 또한 [이번 릴리스부터 지원 중단](#update-for-kotlin-native-targets)되었으며 1.9.20에서 제거될 예정입니다.

### `@import` 지시어가 있는 Objective-C 헤더 지원

> 이 기능은 [실험적](components-stability.md#stability-levels-explained)입니다.
> 언제든지 삭제되거나 변경될 수 있습니다. 옵트인(자세한 내용은 아래 참조)이 필요합니다. 평가 목적으로만 사용하십시오.
> [YouTrack](https://kotl.in/issue)에 대한 여러분의 피드백을 감사히 받겠습니다.
>
{style="warning"}

이제 Kotlin/Native는 `@import` 지시어가 있는 Objective-C 헤더를 임포트할 수 있습니다.
이 기능은 자동 생성된 Objective-C 헤더가 있거나 Swift로 작성된 CocoaPods 의존성 클래스를 사용하는 Swift 라이브러리를 사용할 때 유용합니다.

이전에는 cinterop 도구가 `@import` 지시어를 통해 Objective-C 모듈에 의존하는 헤더를 분석하지 못했습니다.
그 이유는 `-fmodules` 옵션에 대한 지원이 부족했기 때문입니다.

Kotlin 1.8.20부터 `@import`가 있는 Objective-C 헤더를 사용할 수 있습니다. 이렇게 하려면 정의 파일에서 `-fmodules` 옵션을 `compilerOpts`로 컴파일러에 전달하십시오.
[CocoaPods 통합](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-cocoapods-overview.html)을 사용하는 경우, `pod()` 함수의 구성 블록에 cinterop 옵션을 다음과 같이 지정하십시오:

```kotlin
kotlin {
    ios()

    cocoapods {
        summary = "CocoaPods test library"
        homepage = "https://github.com/JetBrains/kotlin"

        ios.deploymentTarget = "13.5"

        pod("PodName") {
            extraOpts = listOf("-compiler-option", "-fmodules")
        }
    }
}
```

이것은 [오랫동안 기다려온 기능](https://youtrack.jetbrains.com/issue/KT-39120)이었으며, 향후 릴리스에서 기본으로 만들 수 있도록 [YouTrack](https://kotl.in/issue)에 대한 여러분의 피드백을 환영합니다.

### Cocoapods Gradle 플러그인의 링크 전용 모드 지원

Kotlin 1.8.20부터 동적 프레임워크를 사용하는 Pod 의존성을 링크 전용으로 사용할 수 있으며, cinterop 바인딩을 생성하지 않습니다.
이는 cinterop 바인딩이 이미 생성된 경우에 유용할 수 있습니다.

라이브러리와 앱 두 모듈로 구성된 프로젝트를 가정해 보겠습니다. 라이브러리는 Pod에 의존하지만, 프레임워크를 생성하지 않고 `.klib`만 생성합니다.
앱은 라이브러리에 의존하고 동적 프레임워크를 생성합니다.
이 경우, 라이브러리가 의존하는 Pods와 이 프레임워크를 링크해야 하지만, 라이브러리에 대해 이미 cinterop 바인딩이 생성되었으므로 cinterop 바인딩이 필요하지 않습니다.

이 기능을 활성화하려면 Pod에 대한 의존성을 추가할 때 `linkOnly` 옵션 또는 빌더 프로퍼티를 사용하십시오:

```kotlin
cocoapods {
    summary = "CocoaPods test library"
    homepage = "https://github.com/JetBrains/kotlin"

    pod("Alamofire", linkOnly = true) {
        version = "5.7.0"
    }
}
```

> 이 옵션을 정적 프레임워크와 함께 사용하면, Pods는 정적 프레임워크 링크에 사용되지 않기 때문에 Pod 의존성이 완전히 제거됩니다.
>
{style="note"}

### UIKit에서 Objective-C 확장을 클래스 멤버로 임포트

Xcode 14.1부터 일부 Objective-C 클래스의 메서드가 카테고리 멤버로 이동되었습니다. 이로 인해 다른 Kotlin API가 생성되었고, 이러한 메서드들은 메서드 대신 Kotlin 확장으로 임포트되었습니다.

이로 인해 UIKit을 사용하여 메서드를 재정의할 때 문제가 발생할 수 있습니다. 예를 들어, Kotlin에서 UIVIew를 서브클래싱할 때 `drawRect()` 또는 `layoutSubviews()` 메서드를 재정의하는 것이 불가능해졌습니다.

1.8.20부터는 NSView 및 UIView 클래스와 동일한 헤더에 선언된 카테고리 멤버가 해당 클래스의 멤버로 임포트됩니다.
이는 NSView 및 UIView를 서브클래싱하는 메서드를 다른 메서드와 마찬가지로 쉽게 재정의할 수 있음을 의미합니다.

모든 것이 잘 진행된다면, 모든 Objective-C 클래스에 대해 이 동작을 기본적으로 활성화할 계획입니다.

### 컴파일러에서 컴파일러 캐시 관리 재구현

컴파일러 캐시의 발전을 가속화하기 위해 컴파일러 캐시 관리를 Kotlin Gradle 플러그인에서 Kotlin/Native 컴파일러로 이동했습니다.
이것은 컴파일 시간 및 컴파일러 캐시 유연성과 관련된 여러 중요한 개선 작업의 제약을 해제합니다.

문제가 발생하여 이전 동작으로 돌아가야 하는 경우, `kotlin.native.cacheOrchestration=gradle` Gradle 프로퍼티를 사용하십시오.

이 기능에 대한 여러분의 피드백을 [YouTrack](https://kotl.in/issue)에 남겨주시면 감사하겠습니다.

### Cocoapods Gradle 플러그인에서 `useLibraries()` 지원 중단

Kotlin 1.8.20부터 정적 라이브러리에 대한 [CocoaPods 통합](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-cocoapods-overview.html)에 사용되는 `useLibraries()` 함수의 지원 중단 주기가 시작됩니다.

정적 라이브러리를 포함하는 Pods에 대한 의존성을 허용하기 위해 `useLibraries()` 함수를 도입했습니다.
시간이 지남에 따라 이 사례는 매우 드물어졌습니다. 대부분의 Pods는 소스로 배포되며, Objective-C 프레임워크 또는 XCFramework는 바이너리 배포의 일반적인 선택입니다.

이 함수는 인기가 없으며 Kotlin CocoaPods Gradle 플러그인 개발을 복잡하게 만드는 문제를 야기하므로, 지원 중단을 결정했습니다.

프레임워크 및 XCFramework에 대한 자세한 내용은 [최종 네이티브 바이너리 빌드](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-build-native-binaries.html)를 참조하십시오.

## Kotlin Multiplatform

Kotlin 1.8.20은 Kotlin Multiplatform에 대한 다음 업데이트를 통해 개발자 경험을 개선하고자 합니다:

*   [소스 세트 계층 설정에 대한 새로운 접근 방식](#new-approach-to-source-set-hierarchy)
*   [Kotlin Multiplatform에서 Gradle 복합 빌드 지원 미리 보기](#preview-of-gradle-composite-builds-support-in-kotlin-multiplatform)
*   [Xcode에서 Gradle 오류 출력 개선](#improved-output-for-gradle-errors-in-xcode)

### 소스 세트 계층 설정에 대한 새로운 접근 방식

> 소스 세트 계층에 대한 새로운 접근 방식은 [실험적](components-stability.md#stability-levels-explained)입니다.
> 향후 Kotlin 릴리스에서 사전 통지 없이 변경될 수 있습니다. 옵트인(자세한 내용은 아래 참조)이 필요합니다.
> [YouTrack](https://kotl.in/issue)에 여러분의 피드백을 감사히 받겠습니다.
>
{style="warning"}

Kotlin 1.8.20은 멀티플랫폼 프로젝트에서 소스 세트 계층을 설정하는 새로운 방법인 기본 타겟 계층을 제공합니다.
새로운 접근 방식은 [설계상의 결함](#why-replace-shortcuts)이 있는 `ios`와 같은 타겟 단축키를 대체하기 위한 것입니다.

기본 타겟 계층의 아이디어는 간단합니다: 프로젝트가 컴파일될 모든 타겟을 명시적으로 선언하면, Kotlin Gradle 플러그인이 지정된 타겟을 기반으로 공유 소스 세트를 자동으로 생성합니다.

#### 프로젝트 설정

간단한 멀티플랫폼 모바일 앱의 다음 예시를 고려해 보십시오:

```kotlin
@OptIn(ExperimentalKotlinGradlePluginApi::class)
kotlin {
    // 기본 타겟 계층 활성화:
    targetHierarchy.default()

    android()
    iosArm64()
    iosSimulatorArm64()
}
```

기본 타겟 계층은 가능한 모든 타겟과 그들의 공유 소스 세트에 대한 템플릿으로 생각할 수 있습니다.
코드에서 최종 타겟인 `android`, `iosArm64`, `iosSimulatorArm64`를 선언하면, Kotlin Gradle 플러그인이 템플릿에서 적합한 공유 소스 세트를 찾아 자동으로 생성합니다.
결과적인 계층은 다음과 같습니다:

![An example of using the default target hierarchy](default-hierarchy-example.svg){thumbnail="true" width="350" thumbnail-same-file="true"}

녹색 소스 세트는 실제로 프로젝트에 생성되어 존재하며, 기본 템플릿의 회색 소스 세트는 무시됩니다.
보시다시피, 예를 들어 Kotlin Gradle 플러그인은 프로젝트에 watchOS 타겟이 없기 때문에 `watchos` 소스 세트를 생성하지 않았습니다.

`watchosArm64`와 같은 watchOS 타겟을 추가하면 `watchos` 소스 세트가 생성되고, `apple`, `native`, `common` 소스 세트의 코드가 `watchosArm64`로도 컴파일됩니다.

기본 타겟 계층에 대한 완전한 스키마는 [문서](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-hierarchy.html#default-hierarchy-template)에서 확인할 수 있습니다.

> 이 예시에서 `apple` 및 `native` 소스 세트는 `iosArm64` 및 `iosSimulatorArm64` 타겟으로만 컴파일됩니다.
> 따라서 이름과 달리 전체 iOS API에 접근할 수 있습니다.
> 이는 `native`와 같은 소스 세트의 경우 직관적이지 않을 수 있습니다. 모든 네이티브 타겟에서 사용 가능한 API만 이 소스 세트에서 접근할 수 있을 것이라고 예상할 수 있기 때문입니다.
> 이 동작은 향후 변경될 수 있습니다.
>
{style="note"}

#### 왜 단축키를 대체하는가 {initial-collapse-state="collapsed" collapsible="true"}

소스 세트 계층을 생성하는 것은 번거롭고 오류가 발생하기 쉬우며 초보자에게는 불친절할 수 있습니다.
이전 해결책은 계층의 일부를 생성해 주는 `ios`와 같은 단축키를 도입하는 것이었습니다.
그러나 단축키를 사용해 본 결과 큰 설계상의 결함이 있다는 것이 입증되었습니다: 변경하기 어렵다는 것입니다.

예를 들어 `ios` 단축키를 살펴보겠습니다. 이 단축키는 `iosArm64`와 `iosX64` 타겟만 생성하는데, 이는 M1 기반 호스트에서 `iosSimulatorArm64` 타겟도 필요할 때 혼란스럽고 문제를 일으킬 수 있습니다.
그러나 `iosSimulatorArm64` 타겟을 추가하는 것은 사용자 프로젝트에 매우 큰 혼란을 주는 변경이 될 수 있습니다:

*   `iosMain` 소스 세트에서 사용되는 모든 의존성은 `iosSimulatorArm64` 타겟을 지원해야 합니다. 그렇지 않으면 의존성 해결이 실패합니다.
*   `iosMain`에서 사용되는 일부 네이티브 API는 새로운 타겟을 추가할 때 사라질 수 있습니다(물론 `iosSimulatorArm64`의 경우에는 그럴 가능성이 낮습니다).
*   어떤 경우에는, 예를 들어 Intel 기반 MacBook에서 작은 토이 프로젝트를 작성할 때, 이러한 변경이 필요하지 않을 수도 있습니다.

단축키가 계층 구성 문제를 해결하지 못한다는 것이 명확해졌고, 이 때문에 우리는 특정 시점에서 새로운 단축키 추가를 중단했습니다.

기본 타겟 계층은 처음에는 단축키와 비슷해 보일 수 있지만, 결정적인 차이가 있습니다: **사용자는 타겟 집합을 명시적으로 지정해야 합니다**.
이 집합은 프로젝트가 컴파일 및 게시되는 방식과 의존성 해결에 참여하는 방식을 정의합니다.
이 집합이 고정되어 있기 때문에 Kotlin Gradle 플러그인의 기본 구성 변경은 생태계에 훨씬 적은 혼란을 야기할 것이며, 도구 지원 마이그레이션을 제공하는 것이 훨씬 쉬워질 것입니다.

#### 기본 계층 활성화 방법

이 새로운 기능은 [실험적](components-stability.md#stability-levels-explained)입니다. Kotlin Gradle 빌드 스크립트의 경우,
`@OptIn(ExperimentalKotlinGradlePluginApi::class)`로 옵트인해야 합니다.

자세한 내용은 [계층적 프로젝트 구조](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-hierarchy.html#default-hierarchy-template)를 참조하십시오.

#### 피드백 남기기

이는 멀티플랫폼 프로젝트에 대한 중요한 변경 사항입니다.
더욱 개선하는 데 도움이 될 수 있도록 [피드백](https://kotl.in/issue)을 보내주시면 감사하겠습니다.

### Kotlin Multiplatform에서 Gradle 복합 빌드 지원 미리 보기

> 이 기능은 Kotlin Gradle 플러그인 1.8.20부터 Gradle 빌드에서 지원됩니다. IDE 지원의 경우,
> IntelliJ IDEA 2023.1 Beta 2 (231.8109.2) 이상 및 모든 Kotlin IDE 플러그인이 포함된 Kotlin Gradle 플러그인 1.8.20을 사용하십시오.
>
{style="note"}

1.8.20부터 Kotlin Multiplatform은 [Gradle 복합 빌드](https://docs.gradle.org/current/userguide/composite_builds.html)를 지원합니다.
복합 빌드를 사용하면 별도의 프로젝트 또는 동일 프로젝트의 일부 빌드를 단일 빌드에 포함할 수 있습니다.

일부 기술적인 문제로 인해 Kotlin Multiplatform에서 Gradle 복합 빌드를 사용하는 것은 부분적으로만 지원되었습니다.
Kotlin 1.8.20에는 더 다양한 프로젝트에서 작동해야 하는 개선된 지원의 미리 보기가 포함되어 있습니다.
이를 사용해 보려면 `gradle.properties`에 다음 옵션을 추가하십시오:

```none
kotlin.mpp.import.enableKgpDependencyResolution=true
```

이 옵션은 새로운 임포트 모드의 미리 보기를 활성화합니다.
복합 빌드 지원 외에도 주요 버그 수정 및 개선 사항이 포함되어 임포트를 더욱 안정적으로 만들어 멀티플랫폼 프로젝트에서 더 원활한 임포트 경험을 제공합니다.

#### 알려진 문제

여전히 추가적인 안정화가 필요한 미리 보기 버전이며, 임포트 과정에서 일부 문제가 발생할 수 있습니다.
Kotlin 1.8.20의 최종 릴리스 이전에 해결할 계획인 몇 가지 알려진 문제는 다음과 같습니다:

*   IntelliJ IDEA 2023.1 EAP에서는 Kotlin 1.8.20 플러그인이 아직 제공되지 않습니다. 그럼에도 불구하고, Kotlin Gradle 플러그인 버전을 1.8.20으로 설정하고 이 IDE에서 복합 빌드를 시도할 수 있습니다.
*   프로젝트에 `rootProject.name`이 지정된 빌드가 포함된 경우, 복합 빌드가 Kotlin 메타데이터를 해결하지 못할 수 있습니다.
    해결 방법 및 자세한 내용은 [이 YouTrack 이슈](https://youtrack.jetbrains.com/issue/KT-56536)를 참조하십시오.

이 기능을 사용해 보고 [YouTrack](https://kotl.in/issue)에 모든 보고서를 제출하여 Kotlin 1.9.0에서 이 기능을 기본으로 만들 수 있도록 도와주시면 감사하겠습니다.

### Xcode에서 Gradle 오류 출력 개선

Xcode에서 멀티플랫폼 프로젝트를 빌드하는 데 문제가 있었다면, "Command PhaseScriptExecution failed with a nonzero exit code" 오류를 만났을 수 있습니다.
이 메시지는 Gradle 호출이 실패했음을 알리지만, 문제 감지에는 별로 도움이 되지 않습니다.

Kotlin 1.8.20부터 Xcode는 Kotlin/Native 컴파일러의 출력을 파싱할 수 있습니다.
또한, Gradle 빌드가 실패하는 경우, Xcode에서 근본 원인 예외에 대한 추가 오류 메시지를 볼 수 있습니다.
대부분의 경우, 이는 근본적인 문제를 식별하는 데 도움이 될 것입니다.

![Improved output for Gradle errors in Xcode](xcode-gradle-output.png){width=700}

새로운 동작은 멀티플랫폼 프로젝트의 iOS 프레임워크를 Xcode의 iOS 애플리케이션에 연결할 수 있는 `embedAndSignAppleFrameworkForXcode`와 같이
Xcode 통합을 위한 표준 Gradle 태스크에 대해 기본적으로 활성화됩니다.
또한 `kotlin.native.useXcodeMessageStyle` Gradle 프로퍼티를 사용하여 활성화(또는 비활성화)할 수 있습니다.

## Kotlin/JavaScript

Kotlin 1.8.20은 TypeScript 정의를 생성하는 방식을 변경합니다. 또한 디버깅 경험을 개선하기 위해 설계된 변경 사항도 포함되어 있습니다:

*   [Gradle 플러그인에서 Dukat 통합 제거](#removal-of-dukat-integration-from-gradle-plugin)
*   [소스 맵의 Kotlin 변수 및 함수 이름](#kotlin-variable-and-function-names-in-source-maps)
*   [TypeScript 정의 파일 생성을 위한 옵트인](#opt-in-for-generation-of-typescript-definition-files)

### Gradle 플러그인에서 Dukat 통합 제거

Kotlin 1.8.20에서 [실험적](components-stability.md#stability-levels-explained) Dukat 통합을 Kotlin/JavaScript Gradle 플러그인에서 제거했습니다.
Dukat 통합은 TypeScript 선언 파일(`.d.ts`)을 Kotlin 외부 선언으로 자동 변환하는 것을 지원했습니다.

[Dukat 도구](https://github.com/Kotlin/dukat)를 사용하여 TypeScript 선언 파일(`.d.ts`)을 Kotlin 외부 선언으로 계속 변환할 수 있습니다.

> Dukat 도구는 [실험적](components-stability.md#stability-levels-explained)입니다.
> 언제든지 삭제되거나 변경될 수 있습니다.
>
{style="warning"}

### 소스 맵의 Kotlin 변수 및 함수 이름

디버깅에 도움이 되도록, 변수 및 함수에 대해 Kotlin 코드에서 선언한 이름을 소스 맵에 추가하는 기능을 도입했습니다.
1.8.20 이전에는 이러한 이름이 소스 맵에서 사용할 수 없었으므로, 디버거에서는 항상 생성된 JavaScript의 변수 및 함수 이름을 볼 수 있었습니다.

`build.gradle.kts` 파일에서 `sourceMapNamesPolicy`를 사용하거나
`-source-map-names-policy` 컴파일러 옵션을 사용하여 추가되는 내용을 구성할 수 있습니다. 다음 표는 가능한 설정을 나열합니다:

| 설정                 | 설명                                                   | 예시 출력                     |
|-------------------------|---------------------------------------------------------------|-----------------------------------|
| `simple-names`          | 변수 이름과 단순 함수 이름이 추가됩니다. (기본값)       | `main`                            |
| `fully-qualified-names` | 변수 이름과 정규화된 함수 이름이 추가됩니다.             | `com.example.kjs.playground.main` |
| `no`                    | 변수 또는 함수 이름이 추가되지 않습니다.                 | N/A                               |

`build.gradle.kts` 파일의 예시 구성은 다음과 같습니다:

```kotlin
tasks.withType<org.jetbrains.kotlin.gradle.tasks.Kotlin2JsCompile>().configureEach {
    compilercompileOptions.sourceMapNamesPolicy.set(org.jetbrains.kotlin.gradle.dsl.JsSourceMapNamesPolicy.SOURCE_MAP_NAMES_POLICY_FQ_NAMES) // or SOURCE_MAP_NAMES_POLICY_NO, or SOURCE_MAP_NAMES_POLICY_SIMPLE_NAMES
}
```
{validate="false"}

Chromium 기반 브라우저에서 제공하는 것과 같은 디버깅 도구는 스택 트레이스의 가독성을 높이기 위해 소스 맵에서 원본 Kotlin 이름을 가져올 수 있습니다. 즐거운 디버깅 되세요!

> 소스 맵에 변수 및 함수 이름을 추가하는 기능은 [실험적](components-stability.md#stability-levels-explained)입니다.
> 언제든지 삭제되거나 변경될 수 있습니다.
>
{style="warning"}

### TypeScript 정의 파일 생성을 위한 옵트인

이전에는 실행 파일을 생성하는 프로젝트(`binaries.executable()`)가 있는 경우, Kotlin/JS IR 컴파일러가 `@JsExport`로 표시된 모든 최상위 선언을 수집하고 자동으로 `.d.ts` 파일에 TypeScript 정의를 생성했습니다.

이는 모든 프로젝트에 유용하지 않으므로, Kotlin 1.8.20에서 동작을 변경했습니다. TypeScript 정의를 생성하려면 Gradle 빌드 파일에서 이를 명시적으로 구성해야 합니다.
`build.gradle.kts.file`의 [`js` 섹션](js-project-setup.md#execution-environments)에 `generateTypeScriptDefinitions()`를 추가하십시오. 예를 들어:

```kotlin
kotlin {
    js {
        binaries.executable()
        browser {
        }
        generateTypeScriptDefinitions()
    }
}
```
{validate="false"}

> TypeScript 정의(`.d.ts`) 생성은 [실험적](components-stability.md#stability-levels-explained)입니다. 언제든지 삭제되거나 변경될 수 있습니다.
>
{style="warning"}

## Gradle

Kotlin 1.8.20은 Gradle 6.8부터 7.6까지 완벽하게 호환되며, [Multiplatform 플러그인의 일부 특정 경우](https://youtrack.jetbrains.com/issue/KT-55751)는 예외입니다.
최신 Gradle 릴리스 버전까지도 사용할 수 있지만, 그럴 경우 지원 중단 경고가 발생하거나 일부 새로운 Gradle 기능이 작동하지 않을 수 있다는 점을 염두에 두십시오.

이번 버전에는 다음 변경 사항이 포함되어 있습니다:

*   [Gradle 플러그인 버전의 새로운 정렬](#new-gradle-plugins-versions-alignment)
*   [Gradle에서 기본적으로 새로운 JVM 증분 컴파일](#new-jvm-incremental-compilation-by-default-in-gradle)
*   [컴파일 태스크 출력의 정밀 백업](#precise-backup-of-compilation-tasks-outputs)
*   [모든 Gradle 버전에서 Kotlin/JVM 태스크 지연 생성](#lazy-kotlin-jvm-tasks-creation-for-all-gradle-versions)
*   [컴파일 태스크의 `destinationDirectory` 비기본 위치](#non-default-location-of-compile-tasks-destinationdirectory)
*   [HTTP 통계 서비스에 컴파일러 인수를 보고하지 않도록 옵트아웃하는 기능](#ability-to-opt-out-from-reporting-compiler-arguments-to-an-http-statistics-service)

### Gradle 플러그인 버전의 새로운 정렬

Gradle은 함께 작동해야 하는 의존성들의 [버전을 항상 정렬](https://docs.gradle.org/current/userguide/dependency_version_alignment.html#aligning_versions_natively_with_gradle)하는 방법을 제공합니다.
Kotlin 1.8.20도 이 접근 방식을 채택했습니다. 기본적으로 작동하므로 활성화를 위해 구성을 변경하거나 업데이트할 필요가 없습니다.
또한, 더 이상 [Kotlin Gradle 플러그인 전이적 의존성 해결을 위한 이 해결 방법](whatsnew18.md#resolution-of-kotlin-gradle-plugins-transitive-dependencies)을 사용할 필요가 없습니다.

이 기능에 대한 여러분의 피드백을 [YouTrack](https://youtrack.jetbrains.com/issue/KT-54691)에 남겨주시면 감사하겠습니다.

### Gradle에서 기본적으로 새로운 JVM 증분 컴파일

[Kotlin 1.7.0부터 사용 가능했던](whatsnew17.md#a-new-approach-to-incremental-compilation) 증분 컴파일에 대한 새로운 접근 방식이 이제 기본적으로 작동합니다.
더 이상 `gradle.properties`에 `kotlin.incremental.useClasspathSnapshot=true`를 지정하여 활성화할 필요가 없습니다.

이에 대한 여러분의 피드백을 감사히 받겠습니다. [YouTrack](https://kotl.in/issue)에 이슈를 제출할 수 있습니다.

### 컴파일 태스크 출력의 정밀 백업

> 컴파일 태스크 출력의 정밀 백업은 [실험적](components-stability.md#stability-levels-explained)입니다.
> 사용하려면 `gradle.properties`에 `kotlin.compiler.preciseCompilationResultsBackup=true`를 추가하십시오.
> [YouTrack](https://kotl.in/issue/experimental-ic-optimizations)에 대한 여러분의 피드백을 감사히 받겠습니다.
>
{style="warning"}

Kotlin 1.8.20부터 정밀 백업을 활성화할 수 있습니다. 정밀 백업을 사용하면 [증분 컴파일](gradle-compilation-and-caches.md#incremental-compilation)에서 Kotlin이 재컴파일하는 클래스만 백업됩니다.
전체 백업과 정밀 백업 모두 컴파일 오류 후 빌드를 증분적으로 다시 실행하는 데 도움이 됩니다.
정밀 백업은 또한 전체 백업에 비해 빌드 시간을 절약합니다.
특히 프로젝트가 느린 HDD에 있거나 많은 태스크가 백업을 수행하는 경우, 대규모 프로젝트에서 전체 백업은 **눈에 띄는** 빌드 시간을 소요할 수 있습니다.

이 최적화는 실험적입니다. `gradle.properties` 파일에 `kotlin.compiler.preciseCompilationResultsBackup` Gradle 프로퍼티를 추가하여 활성화할 수 있습니다:

```none
kotlin.compiler.preciseCompilationResultsBackup=true
```

#### JetBrains에서의 정밀 백업 사용 예시 {initial-collapse-state="collapsed" collapsible="true"}

다음 차트에서 전체 백업과 비교한 정밀 백업 사용 예시를 볼 수 있습니다:

![Comparison of full and precise backups](comparison-of-full-and-precise-backups.png){width=700}

첫 번째 및 두 번째 차트는 Kotlin 프로젝트에서 정밀 백업이 Kotlin Gradle 플러그인 빌드에 미치는 영향을 보여줍니다:

1.  많은 모듈이 의존하는 모듈에 작은 [ABI](https://en.wikipedia.org/wiki/Application_binary_interface) 변경(새로운 public 메서드 추가)을 가한 후.
2.  다른 모듈이 의존하지 않는 모듈에 작은 비-ABI 변경(private 함수 추가)을 가한 후.

세 번째 차트는 [Space](https://www.jetbrains.com/space/) 프로젝트에서 정밀 백업이 많은 모듈이 의존하는 Kotlin/JS 모듈에 작은 비-ABI 변경(private 함수 추가)을 가한 후 웹 프론트엔드 빌드에 미치는 영향을 보여줍니다.

이 측정은 Apple M1 Max CPU가 장착된 컴퓨터에서 수행되었으며, 다른 컴퓨터에서는 약간 다른 결과가 나올 수 있습니다.
성능에 영향을 미치는 요소는 다음을 포함하되 이에 국한되지 않습니다:

*   [Kotlin 데몬](gradle-compilation-and-caches.md#the-kotlin-daemon-and-how-to-use-it-with-gradle) 및 [Gradle 데몬](https://docs.gradle.org/current/userguide/gradle_daemon.html)이 얼마나 활성화되어 있는지.
*   디스크 속도.
*   CPU 모델 및 사용량.
*   변경 사항의 영향을 받는 모듈 및 해당 모듈의 크기.
*   변경 사항이 ABI인지 비-ABI인지.

#### 빌드 보고서로 최적화 평가 {initial-collapse-state="collapsed" collapsible="true"}

프로젝트 및 시나리오에 대한 최적화의 영향을 컴퓨터에서 추정하려면 [Kotlin 빌드 보고서](gradle-compilation-and-caches.md#build-reports)를 사용할 수 있습니다.
`gradle.properties` 파일에 다음 프로퍼티를 추가하여 텍스트 파일 형식으로 보고서를 활성화하십시오:

```none
kotlin.build.report.output=file
```

정밀 백업을 활성화하기 전 보고서의 관련 부분 예시는 다음과 같습니다:

```none
Task ':kotlin-gradle-plugin:compileCommonKotlin' finished in 0.59 s
<...>
Time metrics:
 Total Gradle task time: 0.59 s
 Task action before worker execution: 0.24 s
  Backup output: 0.22 s // 이 숫자에 주목하세요
<...>
```

정밀 백업을 활성화한 후 보고서의 관련 부분 예시는 다음과 같습니다:

```none
Task ':kotlin-gradle-plugin:compileCommonKotlin' finished in 0.46 s
<...>
Time metrics:
 Total Gradle task time: 0.46 s
 Task action before worker execution: 0.07 s
  Backup output: 0.05 s // 시간이 줄었습니다
 Run compilation in Gradle worker: 0.32 s
  Clear jar cache: 0.00 s
  Precise backup output: 0.00 s // 정밀 백업 관련
  Cleaning up the backup stash: 0.00 s // 정밀 백업 관련
<...>
```

### 모든 Gradle 버전에서 Kotlin/JVM 태스크 지연 생성

Gradle 7.3+에서 `org.jetbrains.kotlin.gradle.jvm` 플러그인을 사용하는 프로젝트의 경우, Kotlin Gradle 플러그인은 더 이상 `compileKotlin` 태스크를 즉시 생성하고 구성하지 않습니다.
하위 Gradle 버전에서는 모든 태스크를 등록하고 드라이 런(dry run) 시 구성하지 않습니다.
이제 Gradle 7.3+를 사용할 때도 동일한 동작이 적용됩니다.

### 컴파일 태스크의 `destinationDirectory` 비기본 위치

다음 중 하나를 수행하는 경우 빌드 스크립트에 일부 추가 코드를 업데이트하십시오:

*   Kotlin/JVM `KotlinJvmCompile`/`KotlinCompile` 태스크의 `destinationDirectory` 위치를 재정의하는 경우.
*   더 이상 사용되지 않는 Kotlin/JS/Non-IR [변형](gradle-plugin-variants.md)을 사용하고 `Kotlin2JsCompile` 태스크의 `destinationDirectory`를 재정의하는 경우.

`sourceSets.main.outputs`에 `sourceSets.main.kotlin.classesDirectories`를 명시적으로 추가해야 합니다:

```groovy
tasks.jar(type: Jar) {
    from sourceSets.main.outputs
    from sourceSets.main.kotlin.classesDirectories
}
```

### HTTP 통계 서비스에 컴파일러 인수를 보고하지 않도록 옵트아웃하는 기능

이제 Kotlin Gradle 플러그인이 HTTP [빌드 보고서](gradle-compilation-and-caches.md#build-reports)에 컴파일러 인수를 포함해야 하는지 여부를 제어할 수 있습니다.
때로는 플러그인이 이러한 인수를 보고할 필요가 없을 수도 있습니다. 프로젝트에 많은 모듈이 포함된 경우, 보고서의 컴파일러 인수가 매우 무겁고 별로 도움이 되지 않을 수 있습니다.
이제 이를 비활성화하여 메모리를 절약할 수 있는 방법이 있습니다.
`gradle.properties` 또는 `local.properties`에서 `kotlin.build.report.include_compiler_arguments=(true|false)` 프로퍼티를 사용하십시오.

이 기능에 대한 여러분의 피드백을 [YouTrack](https://youtrack.jetbrains.com/issue/KT-55323/)에 남겨주시면 감사하겠습니다.

## 표준 라이브러리

Kotlin 1.8.20은 특히 Kotlin/Native 개발에 유용한 몇 가지 기능을 포함하여 다양한 새로운 기능을 추가합니다:

*   [AutoCloseable 인터페이스 지원](#support-for-the-autocloseable-interface)
*   [Base64 인코딩 및 디코딩 지원](#support-for-base64-encoding)
*   [Kotlin/Native에서 @Volatile 지원](#support-for-volatile-in-kotlin-native)
*   [Kotlin/Native에서 정규식 사용 시 스택 오버플로우 버그 수정](#bug-fix-for-stack-overflow-when-using-regex-in-kotlin-native)

### AutoCloseable 인터페이스 지원

> 새로운 `AutoCloseable` 인터페이스는 [실험적](components-stability.md#stability-levels-explained)이며,
> 사용하려면 `@OptIn(ExperimentalStdlibApi::class)` 또는 컴파일러 인수 `-opt-in=kotlin.ExperimentalStdlibApi`로 옵트인해야 합니다.
>

{style="warning"}

`AutoCloseable` 인터페이스는 모든 라이브러리에서 리소스를 닫는 데 하나의 공통 인터페이스를 사용할 수 있도록 공통 표준 라이브러리에 추가되었습니다.
Kotlin/JVM에서 `AutoCloseable` 인터페이스는 [`java.lang.AutoClosable`](https://docs.oracle.com/javase/8/docs/api/java/lang/AutoCloseable.html)의 별칭입니다.

또한, 확장 함수 `use()`가 이제 포함되어, 선택된 리소스에 대해 주어진 블록 함수를 실행한 다음, 예외 발생 여부와 관계없이 올바르게 닫습니다.

공통 표준 라이브러리에는 `AutoCloseable` 인터페이스를 구현하는 public 클래스가 없습니다.
아래 예시에서는 `XMLWriter` 인터페이스를 정의하고, 이를 구현하는 리소스가 있다고 가정합니다.
예를 들어, 이 리소스는 파일을 열고, XML 내용을 작성하고, 닫는 클래스일 수 있습니다.

```kotlin
interface XMLWriter : AutoCloseable {
    fun document(encoding: String, version: String, content: XMLWriter.() -> Unit)
    fun element(name: String, content: XMLWriter.() -> Unit)
    fun attribute(name: String, value: String)
    fun text(value: String)
}

fun writeBooksTo(writer: XMLWriter) {
    writer.use { xml ->
        xml.document(encoding = "UTF-8", version = "1.0") {
            element("bookstore") {
                element("book") {
                    attribute("category", "fiction")
                    element("title") { text("Harry Potter and the Prisoner of Azkaban") }
                    element("author") { text("J. K. Rowling") }
                    element("year") { text("1999") }
                    element("price") { text("29.99") }
                }
                element("book") {
                    attribute("category", "programming")
                    element("title") { text("Kotlin in Action") }
                    element("author") { text("Dmitry Jemerov") }
                    element("author") { text("Svetlana Isakova") }
                    element("year") { text("2017") }
                    element("price") { text("25.19") }
                }
            }
        }
    }
}
```
{validate="false"}

### Base64 인코딩 지원

> 새로운 인코딩 및 디코딩 기능은 [실험적](components-stability.md#stability-levels-explained)이며,
> 사용하려면 `@OptIn(ExperimentalEncodingApi::class)` 또는
> 컴파일러 인수 `-opt-in=kotlin.io.encoding.ExperimentalEncodingApi`로 옵트인해야 합니다.
>
{style="warning"}

Base64 인코딩 및 디코딩을 지원하도록 추가했습니다.
서로 다른 인코딩 스키마를 사용하고 다른 동작을 표시하는 3개의 클래스 인스턴스를 제공합니다.
표준 [Base64 인코딩 스키마](https://www.rfc-editor.org/rfc/rfc4648#section-4)에는 `Base64.Default` 인스턴스를 사용하십시오.

["URL 및 파일 이름 안전"](https://www.rfc-editor.org/rfc/rfc4648#section-5) 인코딩 스키마에는 `Base64.UrlSafe` 인스턴스를 사용하십시오.

[MIME](https://www.rfc-editor.org/rfc/rfc2045#section-6.8) 인코딩 스키마에는 `Base64.Mime` 인스턴스를 사용하십시오.
`Base64.Mime` 인스턴스를 사용하면 모든 인코딩 함수가 76자마다 줄 구분 기호를 삽입합니다.
디코딩의 경우, 유효하지 않은 문자는 건너뛰고 예외를 발생시키지 않습니다.

> `Base64.Default` 인스턴스는 `Base64` 클래스의 동반 객체입니다. 따라서 `Base64.Default.encode()` 및 `Base64.Default.decode()` 대신
> `Base64.encode()` 및 `Base64.decode()`를 통해 해당 함수를 호출할 수 있습니다.
>
{style="tip"}

```kotlin
val foBytes = "fo".map { it.code.toByte() }.toByteArray()
Base64.Default.encode(foBytes) // "Zm8="
// 또는:
// Base64.encode(foBytes)

val foobarBytes = "foobar".map { it.code.toByte() }.toByteArray()
Base64.UrlSafe.encode(foobarBytes) // "Zm9vYmFy"

Base64.Default.decode("Zm8=") // foBytes
// 또는:
// Base64.decode("Zm8=")

Base64.UrlSafe.decode("Zm9vYmFy") // foobarBytes
```
{validate="false"}

바이트를 기존 버퍼로 인코딩하거나 디코딩하는 추가 함수뿐만 아니라, 제공된 `Appendable` 타입 객체에 인코딩 결과를 추가하는 함수도 사용할 수 있습니다.

Kotlin/JVM에서는 입력 및 출력 스트림으로 Base64 인코딩 및 디코딩을 수행할 수 있도록 `encodingWith()` 및 `decodingWith()` 확장 함수도 추가했습니다.

### Kotlin/Native에서 @Volatile 지원

> Kotlin/Native의 `@Volatile`은 [실험적](components-stability.md#stability-levels-explained)입니다.
> 언제든지 삭제되거나 변경될 수 있습니다. 옵트인(자세한 내용은 아래 참조)이 필요합니다.
> 평가 목적으로만 사용하십시오. [YouTrack](https://kotl.in/issue)에 대한 여러분의 피드백을 감사히 받겠습니다.
>
{style="warning"}

`var` 프로퍼티를 `@Volatile`로 어노테이션하면, 배후 필드가 표시되어 해당 필드에 대한 모든 읽기 또는 쓰기가 원자적으로 처리되고, 쓰기는 항상 다른 스레드에 가시화됩니다.

1.8.20 이전에는 [`kotlin.jvm.Volatile` 어노테이션](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.jvm/-volatile/)이 공통 표준 라이브러리에서 사용 가능했습니다.
그러나 이 어노테이션은 JVM에서만 유효합니다. Kotlin/Native에서 사용하면 무시되어 오류가 발생할 수 있습니다.

1.8.20에서는 JVM과 Kotlin/Native 모두에서 사용할 수 있는 공통 어노테이션인 `kotlin.concurrent.Volatile`을 도입했습니다.

#### 활성화 방법

이 기능을 사용해 보려면, `@OptIn(ExperimentalStdlibApi)`로 옵트인하고 `-language-version 1.9` 컴파일러 옵션을 활성화하십시오.
Gradle 프로젝트에서는 `build.gradle(.kts)` 파일에 다음을 추가하여 활성화할 수 있습니다:

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
tasks
    .withType<org.jetbrains.kotlin.gradle.tasks.KotlinCompilationTask<*>>()
    .configureEach {
        compilerOptions
            .languageVersion
            .set(
                org.jetbrains.kotlin.gradle.dsl.KotlinVersion.KOTLIN_1_9
            )
    }
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
tasks
    .withType(org.jetbrains.kotlin.gradle.tasks.KotlinCompilationTask.class)
    .configureEach {
        compilerOptions.languageVersion =
            org.jetbrains.kotlin.gradle.dsl.KotlinVersion.KOTLIN_1_9
    }
```

</tab>
</tabs>

### Kotlin/Native에서 정규식 사용 시 스택 오버플로우 버그 수정

이전 버전의 Kotlin에서는 정규식 입력에 많은 수의 문자가 포함된 경우(정규식 패턴이 매우 간단하더라도) 크래시가 발생할 수 있었습니다.
1.8.20에서는 이 문제가 해결되었습니다. 자세한 내용은 [KT-46211](https://youtrack.jetbrains.com/issue/KT-46211)을 참조하십시오.

## 직렬화 업데이트

Kotlin 1.8.20에는 [Kotlin K2 컴파일러용 알파 지원](#prototype-serialization-compiler-plugin-for-kotlin-k2-compiler)과
[동반 객체를 통한 암시적 직렬화기 사용자 정의 금지](#prohibit-implicit-serializer-customization-via-companion-object)가 포함됩니다.

### Kotlin K2 컴파일러용 프로토타입 직렬화 컴파일러 플러그인

> K2용 직렬화 컴파일러 플러그인 지원은 [알파](components-stability.md#stability-levels-explained) 단계입니다.
> 사용하려면 [Kotlin K2 컴파일러를 활성화](#how-to-enable-the-kotlin-k2-compiler)하십시오.
>
{style="warning"}

1.8.20부터 직렬화 컴파일러 플러그인이 Kotlin K2 컴파일러와 함께 작동합니다.
한번 시도해 보시고 [피드백을 공유](#leave-your-feedback-on-the-new-k2-compiler)해 주십시오!

### 동반 객체를 통한 암시적 직렬화기 사용자 정의 금지

현재는 `@Serializable` 어노테이션으로 클래스를 직렬화 가능하도록 선언하고, 동시에 동반 객체에 `@Serializer` 어노테이션으로 사용자 정의 직렬화기를 선언하는 것이 가능합니다.

예를 들어:

```kotlin
import kotlinx.serialization.*

@Serializable
class Foo(val a: Int) {
    @Serializer(Foo::class)
    companion object {
        // KSerializer<Foo>의 사용자 정의 구현
    }
}
```

이 경우 `@Serializable` 어노테이션만으로는 어떤 직렬화기가 사용되는지 명확하지 않습니다.
실제로는 `Foo` 클래스가 사용자 정의 직렬화기를 사용합니다.

이러한 종류의 혼란을 방지하기 위해, Kotlin 1.8.20에서는 이 시나리오가 감지될 때 컴파일러 경고를 도입했습니다.
이 경고에는 이 문제를 해결하기 위한 가능한 마이그레이션 경로가 포함됩니다.

코드에서 이러한 구문을 사용하는 경우, 아래와 같이 업데이트하는 것을 권장합니다:

```kotlin
import kotlinx.serialization.*

@Serializable(Foo.Companion::class)
class Foo(val a: Int) {
    // @Serializer(Foo::class)를 사용하든 안 사용하든 상관없습니다.
    companion object: KSerializer<Foo> {
        // KSerializer<Foo>의 사용자 정의 구현
    }
}
```

이 접근 방식을 사용하면 `Foo` 클래스가 동반 객체에 선언된 사용자 정의 직렬화기를 사용한다는 것이 명확해집니다.
자세한 내용은 [YouTrack 티켓](https://youtrack.jetbrains.com/issue/KT-54441)을 참조하십시오.

> Kotlin 2.0에서는 컴파일 경고를 컴파일러 오류로 승격할 계획입니다.
> 이 경고를 확인하시면 코드를 마이그레이션하는 것을 권장합니다.
>
{style="tip"}

## 문서 업데이트

Kotlin 문서는 몇 가지 주목할 만한 변경 사항이 있었습니다:

*   [Spring Boot와 Kotlin 시작하기](jvm-get-started-spring-boot.md) – 데이터베이스로 간단한 애플리케이션을 만들고 Spring Boot 및 Kotlin의 기능에 대해 자세히 알아보십시오.
*   [스코프 함수](scope-functions.md) – 표준 라이브러리의 유용한 스코프 함수로 코드를 간소화하는 방법을 배우십시오.
*   [CocoaPods 통합](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-cocoapods-overview.html) – CocoaPods 작업을 위한 환경을 설정하십시오.

## Kotlin 1.8.20 설치

### IDE 버전 확인

[IntelliJ IDEA](https://www.jetbrains.com/idea/download/) 2022.2 및 2022.3은 Kotlin 플러그인을 1.8.20 버전으로 자동 업데이트를 제안합니다. IntelliJ IDEA 2023.1에는 Kotlin 플러그인 1.8.20이 내장되어 있습니다.

Android Studio Flamingo (222) 및 Giraffe (223)는 다음 릴리스에서 Kotlin 1.8.20을 지원할 예정입니다.

새로운 명령줄 컴파일러는 [GitHub 릴리스 페이지](https://github.com/JetBrains/kotlin/releases/tag/v1.8.20)에서 다운로드할 수 있습니다.

### Gradle 설정 구성

Kotlin 아티팩트 및 의존성을 올바르게 다운로드하려면 `settings.gradle(.kts)` 파일을
Maven Central 저장소를 사용하도록 업데이트하십시오:

```kotlin
pluginManagement {
    repositories {
        mavenCentral()
        gradlePluginPortal()
    }
}
```

저장소가 지정되지 않은 경우, Gradle은 서비스 종료된 JCenter 저장소를 사용하며, 이는 Kotlin 아티팩트에 문제를 야기할 수 있습니다.