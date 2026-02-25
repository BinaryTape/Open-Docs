[//]: # (title: Kotlin 1.8.20의 새로운 기능)

<web-summary>새로운 언어 기능, Kotlin Multiplatform, JVM, Native, JS 및 Wasm에 대한 업데이트, 그리고 Gradle 및 Maven 빌드 도구 지원을 포함하는 Kotlin 1.8.20 릴리스 노트를 확인해 보세요.</web-summary>

_[출시일: 2023년 4월 25일](releases.md#release-history)_

Kotlin 1.8.20이 출시되었습니다. 주요 하이라이트는 다음과 같습니다:

* [새로운 Kotlin K2 컴파일러 업데이트](#new-kotlin-k2-compiler-updates)
* [새로운 실험적 Kotlin/Wasm 타겟](#new-kotlin-wasm-target)
* [Gradle에서 JVM 증분 컴파일(incremental compilation) 기본 활성화](#new-jvm-incremental-compilation-by-default-in-gradle)
* [Kotlin/Native 타겟 업데이트](#update-for-kotlin-native-targets)
* [Kotlin Multiplatform에서 Gradle 복합 빌드(composite builds) 지원 미리보기](#preview-of-gradle-composite-builds-support-in-kotlin-multiplatform)
* [Xcode에서 Gradle 오류 출력 개선](#improved-output-for-gradle-errors-in-xcode)
* [표준 라이브러리의 AutoCloseable 인터페이스 실험적 지원](#support-for-the-autocloseable-interface)
* [표준 라이브러리의 Base64 인코딩 실험적 지원](#support-for-base64-encoding)

이 영상에서 변경 사항에 대한 짧은 요약을 확인하실 수도 있습니다:

<video src="https://www.youtube.com/v/R1JpkpPzyBU" title="What's new in Kotlin 1.8.20"/>

> Kotlin 출시 주기에 대한 정보는 [Kotlin 출시 프로세스](releases.md)를 참조하세요.
>
{style="tip"}

## IDE 지원

1.8.20을 지원하는 Kotlin 플러그인은 다음 버전에서 사용할 수 있습니다:

| IDE            | 지원 버전                      |
|----------------|-------------------------------|
| IntelliJ IDEA  | 2022.2.x, 2022.3.x,  2023.1.x |
| Android Studio | Flamingo (222)                |

> Kotlin 아티팩트와 의존성을 올바르게 다운로드하려면, Maven Central 저장소를 사용하도록 [Gradle 설정을 구성](#configure-gradle-settings)하세요.
>
{style="warning"}

## 새로운 Kotlin K2 컴파일러 업데이트

Kotlin 팀은 K2 컴파일러를 안정화하기 위해 계속 노력하고 있습니다. [Kotlin 1.7.0 발표](whatsnew17.md#new-kotlin-k2-compiler-for-the-jvm-in-alpha)에서 언급했듯이, K2 컴파일러는 여전히 **Alpha** 상태입니다. 이번 릴리스에서는 [K2 Beta](https://youtrack.jetbrains.com/issue/KT-52604)를 향한 추가적인 개선 사항이 도입되었습니다.

이번 1.8.20 릴리스부터 Kotlin K2 컴파일러는 다음과 같은 기능을 제공합니다:

* serialization 플러그인의 미리보기 버전을 제공합니다.
* [JS IR 컴파일러](js-ir-compiler.md)에 대한 Alpha 지원을 제공합니다.
* 향후 릴리스될 [새로운 언어 버전인 Kotlin 2.0](https://blog.jetbrains.com/kotlin/2023/02/k2-kotlin-2-0/)의 도입을 준비합니다.

새로운 컴파일러와 그 이점에 대해 다음 비디오에서 자세히 알아보세요:

* [What Everyone Must Know About The NEW Kotlin K2 Compiler](https://www.youtube.com/watch?v=iTdJJq_LyoY)
* [The New Kotlin K2 Compiler: Expert Review](https://www.youtube.com/watch?v=db19VFLZqJM)

### Kotlin K2 컴파일러 활성화 방법

Kotlin K2 컴파일러를 활성화하고 테스트하려면, 다음 컴파일러 옵션과 함께 새로운 언어 버전을 사용하세요:

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

이전의 `-Xuse-k2` 컴파일러 옵션은 더 이상 사용되지 않습니다(deprecated).

> 새로운 K2 컴파일러의 Alpha 버전은 JVM 및 JS IR 프로젝트에서만 작동합니다. 아직 Kotlin/Native나 멀티플랫폼 프로젝트는 지원하지 않습니다.
>
{style="warning"}

### 새로운 K2 컴파일러에 대한 의견을 남겨주세요

여러분의 피드백은 언제나 환영입니다!

* Kotlin Slack에서 K2 개발자에게 직접 피드백을 제공해 주세요. [초대장 받기](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up?_gl=1*ju6cbn*_ga*MTA3MTk5NDkzMC4xNjQ2MDY3MDU4*_ga_9J976DJZ68*MTY1ODMzNzA3OS4xMDAuMS4xNjU4MzQwODEwLjYw) 후 [#k2-early-adopters](https://kotlinlang.slack.com/archives/C03PK0PE257) 채널에 참여하세요.
* 새로운 K2 컴파일러를 사용하면서 겪은 문제는 [이슈 트래커](https://kotl.in/issue)에 보고해 주세요.
* JetBrains가 K2 사용에 대한 익명 데이터를 수집할 수 있도록 [**사용 통계 보내기(Send usage statistics)** 옵션을 활성화](https://www.jetbrains.com/help/idea/settings-usage-statistics.html)해 주세요.

## 언어 (Language)

Kotlin이 계속 발전함에 따라 1.8.20에서 새로운 언어 기능의 미리보기 버전을 도입합니다:

* [Enum 클래스의 values 함수를 대체하는 현대적이고 성능이 뛰어난 방식](#a-modern-and-performant-replacement-of-the-enum-class-values-function)
* [data 클래스와의 대칭성을 위한 data object](#preview-of-data-objects-for-symmetry-with-data-classes)
* [인라인 클래스에서 본문이 있는 보조 생성자(secondary constructor)에 대한 제한 해제](#preview-of-lifting-restriction-on-secondary-constructors-with-bodies-in-inline-classes)

### Enum 클래스의 values 함수를 대체하는 현대적이고 성능이 뛰어난 방식

> 이 기능은 [실험적(Experimental)](components-stability.md#stability-levels-explained)입니다. 언제든지 변경되거나 삭제될 수 있습니다. 사용하려면 명시적인 동의(Opt-in)가 필요합니다(아래 세부 정보 참조). 평가 목적으로만 사용하세요. [YouTrack](https://kotl.in/issue)을 통해 피드백을 보내주시면 감사하겠습니다.
>
{style="warning"}

Enum 클래스에는 정의된 enum 상수 배열을 반환하는 합성(synthetic) `values()` 함수가 있습니다. 그러나 배열을 사용하면 Kotlin 및 Java에서 [숨겨진 성능 문제](https://github.com/Kotlin/KEEP/blob/master/proposals/enum-entries.md#examples-of-performance-issues)가 발생할 수 있습니다. 또한 대부분의 API는 컬렉션을 사용하므로 결국 변환이 필요하게 됩니다. 이러한 문제를 해결하기 위해 `values()` 함수 대신 사용할 수 있는 Enum 클래스용 `entries` 프로퍼티를 도입했습니다. `entries` 프로퍼티는 호출 시 정의된 enum 상수의 미리 할당된 불변(immutable) 리스트를 반환합니다.

> `values()` 함수는 여전히 지원되지만, 대신 `entries` 프로퍼티를 사용할 것을 권장합니다.
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

#### entries 프로퍼티 활성화 방법

이 기능을 사용해 보려면 `@OptIn(ExperimentalStdlibApi)`로 동의하고 `-language-version 1.9` 컴파일러 옵션을 활성화하세요. Gradle 프로젝트의 경우 `build.gradle(.kts)` 파일에 다음을 추가하여 활성화할 수 있습니다:

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

> IntelliJ IDEA 2023.1부터 이 기능을 활성화하면 IDE 인스펙션이 `values()`를 `entries`로 변환하도록 안내하고 퀵 픽스(quick-fix)를 제공합니다.
>
{style="tip"}

이 제안에 대한 자세한 정보는 [KEEP 노트](https://github.com/Kotlin/KEEP/blob/master/proposals/enum-entries.md)를 참조하세요.

### data 클래스와의 대칭성을 위한 data object

Data object를 사용하면 싱글톤(singleton) 의미론을 가지면서도 깔끔한 `toString()` 표현을 제공하는 객체를 선언할 수 있습니다. 다음 코드 스니펫에서 객체 선언에 `data` 키워드를 추가하면 `toString()` 출력의 가독성이 어떻게 향상되는지 확인할 수 있습니다:

```kotlin
package org.example
object MyObject
data object MyDataObject

fun main() {
    println(MyObject) // org.example.MyObject@1f32e575
    println(MyDataObject) // MyDataObject
}
```

특히 `sealed` 계층 구조(예: `sealed class` 또는 `sealed interface`)에서 `data object`는 `data class` 선언과 함께 편리하게 사용할 수 있어 매우 적합합니다. 아래 스니펫에서 `EndOfFile`을 일반 `object` 대신 `data object`로 선언하면, 수동으로 재정의(override)하지 않아도 예쁜 `toString` 결과를 얻을 수 있습니다. 이는 함께 정의된 data class들과의 대칭성을 유지해 줍니다.

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

#### data object의 의미론 (Semantics)

[Kotlin 1.7.20](whatsnew1720.md#improved-string-representations-for-singletons-and-sealed-class-hierarchies-with-data-objects)에서 첫 미리보기 버전이 출시된 이후, data object의 의미론이 더욱 정교해졌습니다. 이제 컴파일러는 data object를 위해 여러 편의 함수를 자동으로 생성합니다:

##### toString

data object의 `toString()` 함수는 객체의 단순 이름(simple name)을 반환합니다:

```kotlin
data object MyDataObject {
    val x: Int = 3
}

fun main() {
    println(MyDataObject) // MyDataObject
}
```

##### equals 및 hashCode

`data object`의 `equals()` 함수는 해당 `data object` 타입을 가진 모든 객체가 동일한 것으로 간주되도록 보장합니다. 대부분의 경우 런타임에 data object의 인스턴스는 하나만 존재합니다(결국 `data object`는 싱글톤을 선언하는 것이니까요). 그러나 런타임에 동일한 타입의 다른 객체가 생성되는 특수한 경우(예: `java.lang.reflect`를 통한 플랫폼 리플렉션 사용 또는 내부적으로 이 API를 사용하는 JVM 직렬화 라이브러리 사용 시)에도 이 함수는 객체들이 동일하게 취급되도록 보장합니다.

`data object`를 비교할 때는 반드시 구조적 비교(`==` 연산자)를 사용해야 하며, 참조 비교(`===` 연산자)를 사용해서는 안 됩니다. 이는 런타임에 data object의 인스턴스가 둘 이상 존재할 때 발생할 수 있는 잠재적인 문제를 방지하는 데 도움이 됩니다. 다음 스니펫은 이러한 특수한 경우를 보여줍니다:

```kotlin
import java.lang.reflect.Constructor

data object MySingleton

fun main() {
    val evilTwin = createInstanceViaReflection()

    println(MySingleton) // MySingleton
    println(evilTwin) // MySingleton

    // 라이브러리가 MySingleton의 두 번째 인스턴스를 강제로 생성하더라도, `equals` 메서드는 true를 반환합니다:
    println(MySingleton == evilTwin) // true

    // data object를 ===로 비교하지 마세요.
    println(MySingleton === evilTwin) // false
}

fun createInstanceViaReflection(): MySingleton {
    // Kotlin 리플렉션은 data object의 인스턴스화를 허용하지 않습니다.
    // 이는 "강제로" (즉, Java 플랫폼 리플렉션을 통해) 새로운 MySingleton 인스턴스를 생성합니다.
    // 직접 이렇게 하지 마세요!
    return (MySingleton.javaClass.declaredConstructors[0].apply { isAccessible = true } as Constructor<MySingleton>).newInstance()
}
```

생성된 `hashCode()` 함수의 동작은 `equals()` 함수와 일관성을 유지하므로, 런타임에 존재하는 `data object`의 모든 인스턴스는 동일한 해시 코드를 갖습니다.

##### data object를 위한 copy 및 componentN 함수 미제공

`data object`와 `data class` 선언은 자주 함께 사용되며 유사점이 있지만, `data object`에 대해서는 생성되지 않는 함수들이 있습니다:

`data object` 선언은 싱글톤 객체로 사용되도록 의도되었기 때문에 `copy()` 함수가 생성되지 않습니다. 싱글톤 패턴은 클래스의 인스턴스화를 단일 인스턴스로 제한하며, 인스턴스의 복사본 생성을 허용하는 것은 해당 제한을 위반하는 것이기 때문입니다.

또한 `data class`와 달리 `data object`는 데이터 프로퍼티를 갖지 않습니다. 이러한 객체를 구조 분해(destructuring)하려는 시도는 의미가 없으므로 `componentN()` 함수도 생성되지 않습니다.

이 기능에 대한 의견은 [YouTrack](https://youtrack.jetbrains.com/issue/KT-4107)에 남겨주세요.

#### data object 미리보기 활성화 방법

이 기능을 사용해 보려면 `-language-version 1.9` 컴파일러 옵션을 활성화하세요. Gradle 프로젝트의 경우 `build.gradle(.kts)` 파일에 다음을 추가하여 활성화할 수 있습니다:

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

### 인라인 클래스에서 본문이 있는 보조 생성자에 대한 제한 해제

> 이 기능은 [실험적(Experimental)](components-stability.md#stability-levels-explained)입니다. 언제든지 변경되거나 삭제될 수 있습니다. 사용하려면 명시적인 동의(Opt-in)가 필요합니다(아래 세부 정보 참조). 평가 목적으로만 사용하세요. [YouTrack](https://kotl.in/issue)을 통해 피드백을 보내주시면 감사하겠습니다.
>
{style="warning"}

Kotlin 1.8.20은 [인라인 클래스(inline classes)](inline-classes.md)에서 본문이 있는 보조 생성자(secondary constructor) 사용에 대한 제한을 해제합니다.

이전의 인라인 클래스는 명확한 초기화 의미론을 위해 `init` 블록이나 보조 생성자가 없는 공개 기본 생성자(primary constructor)만 허용했습니다. 그 결과, 기본 값을 캡슐화하거나 제한된 값을 나타내는 인라인 클래스를 만드는 것이 불가능했습니다.

이러한 문제는 Kotlin 1.4.30에서 `init` 블록에 대한 제한이 해제되면서 해결되었습니다. 이제 한 걸음 더 나아가 미리보기 모드에서 본문이 있는 보조 생성자를 허용합니다:

```kotlin
@JvmInline
value class Person(private val fullName: String) {
    // Kotlin 1.4.30부터 허용됨:
    init { 
        check(fullName.isNotBlank()) {
            "Full name shouldn't be empty"
        }
    }

    // Kotlin 1.8.20부터 미리보기 가능:
    constructor(name: String, lastName: String) : this("$name $lastName") {
        check(lastName.isNotBlank()) {
            "Last name shouldn't be empty"
        }
    }
}
```

#### 본문이 있는 보조 생성자 활성화 방법

이 기능을 사용해 보려면 `-language-version 1.9` 컴파일러 옵션을 활성화하세요. Gradle 프로젝트의 경우 `build.gradle(.kts)`에 다음을 추가하여 활성화할 수 있습니다:

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

이 기능을 직접 사용해 보시고 [YouTrack](https://kotl.in/issue)에 보고서를 제출하여 Kotlin 1.9.0에서 기본 기능으로 포함될 수 있도록 도와주세요.

Kotlin 인라인 클래스 개발에 대한 자세한 내용은 [이 KEEP](https://github.com/Kotlin/KEEP/blob/master/proposals/inline-classes.md)에서 확인할 수 있습니다.

## 새로운 Kotlin/Wasm 타겟

이 릴리스에서 Kotlin/Wasm(Kotlin WebAssembly)이 [실험적(Experimental)](components-stability.md#stability-levels-explained) 단계로 진입했습니다. Kotlin 팀은 [WebAssembly](https://webassembly.org/)를 유망한 기술로 보고 있으며, 여러분이 WebAssembly를 더 잘 활용하고 Kotlin의 모든 이점을 누릴 수 있는 방법을 찾고자 합니다.

WebAssembly 이진 형식은 자체 가상 머신을 사용하여 실행되므로 플랫폼에 독립적입니다. 거의 모든 현대적인 브라우저는 이미 WebAssembly 1.0을 지원합니다. WebAssembly를 실행하기 위한 환경을 설정하려면 Kotlin/Wasm이 타겟팅하는 실험적 가비지 컬렉션 모드를 활성화하기만 하면 됩니다. 자세한 지침은 여기에서 확인할 수 있습니다: [Kotlin/Wasm 활성화 방법](#how-to-enable-kotlin-wasm).

새로운 Kotlin/Wasm 타겟의 장점은 다음과 같습니다:

* Kotlin/Wasm은 LLVM을 사용할 필요가 없으므로 `wasm32` Kotlin/Native 타겟에 비해 컴파일 속도가 빠릅니다.
* [Wasm 가비지 컬렉션](https://github.com/WebAssembly/gc) 덕분에 `wasm32` 타겟에 비해 JS와의 상호 운용성이 쉽고 브라우저와의 통합이 용이합니다.
* Wasm은 컴팩트하고 파싱하기 쉬운 바이트코드를 가지고 있어 Kotlin/JS 및 JavaScript에 비해 애플리케이션 시작 속도가 잠재적으로 더 빠릅니다.
* Wasm은 정적 타입 언어이므로 Kotlin/JS 및 JavaScript에 비해 애플리케이션 런타임 성능이 향상됩니다.

1.8.20 릴리스부터 실험적 프로젝트에서 Kotlin/Wasm을 사용할 수 있습니다. Kotlin 표준 라이브러리(`stdlib`)와 테스트 라이브러리(`kotlin.test`)는 Kotlin/Wasm용으로 기본 제공됩니다. IDE 지원은 향후 릴리스에서 추가될 예정입니다.

[이 YouTube 비디오에서 Kotlin/Wasm에 대해 자세히 알아보세요](https://www.youtube.com/watch?v=-pqz9sKXatw).

### Kotlin/Wasm 활성화 방법

Kotlin/Wasm을 활성화하고 테스트하려면 `build.gradle.kts` 파일을 업데이트하세요:

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

> [Kotlin/Wasm 예제가 포함된 GitHub 저장소](https://github.com/Kotlin/kotlin-wasm-examples)를 확인해 보세요.
>
{style="tip"}

Kotlin/Wasm 프로젝트를 실행하려면 타겟 환경의 설정을 업데이트해야 합니다:

<tabs>
<tab title="Chrome">

* 109 버전:

  `--js-flags=--experimental-wasm-gc` 명령줄 인수를 사용하여 애플리케이션을 실행합니다.

* 110 버전 이상:

    1. 브라우저에서 `chrome://flags/#enable-webassembly-garbage-collection`으로 이동합니다.
    2. **WebAssembly Garbage Collection**을 활성화합니다.
    3. 브라우저를 다시 시작합니다.

</tab>
<tab title="Firefox">

109 버전 이상:

1. 브라우저에서 `about:config`로 이동합니다.
2. `javascript.options.wasm_function_references` 및 `javascript.options.wasm_gc` 옵션을 활성화합니다.
3. 브라우저를 다시 시작합니다.

</tab>
<tab title="Edge">

109 버전 이상:

`--js-flags=--experimental-wasm-gc` 명령줄 인수를 사용하여 애플리케이션을 실행합니다.

</tab>
</tabs>

### Kotlin/Wasm에 대한 의견을 남겨주세요

여러분의 피드백은 큰 도움이 됩니다!

* Kotlin Slack에서 개발자에게 직접 피드백을 보내주세요. [초대장 받기](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up?_gl=1*ju6cbn*_ga*MTA3MTk5NDkzMC4xNjQ2MDY3MDU4*_ga_9J976DJZ68*MTY1ODMzNzA3OS4xMDAuMS4xNjU4MzQwODEwLjYw) 후 [#webassembly](https://kotlinlang.slack.com/archives/CDFP59223) 채널에 참여하세요.
* Kotlin/Wasm을 사용하면서 겪은 문제는 [이 YouTrack 이슈](https://youtrack.jetbrains.com/issue/KT-56492)에 보고해 주세요.

## Kotlin/JVM

Kotlin 1.8.20은 [Java 합성 프로퍼티 참조 미리보기](#preview-of-java-synthetic-property-references)와 [kapt stub 생성 태스크에서 JVM IR 백엔드 기본 지원](#support-for-the-jvm-ir-backend-in-kapt-stub-generating-task-by-default)을 도입합니다.

### Java 합성 프로퍼티 참조 미리보기

> 이 기능은 [실험적(Experimental)](components-stability.md#stability-levels-explained)입니다. 언제든지 변경되거나 삭제될 수 있습니다. 평가 목적으로만 사용하세요. [YouTrack](https://kotl.in/issue)을 통해 피드백을 보내주시면 감사하겠습니다.
>
{style="warning"}

Kotlin 1.8.20에서는 Java 합성 프로퍼티(synthetic property)에 대한 참조를 생성할 수 있는 기능이 도입되었습니다. 예를 들어 다음과 같은 Java 코드가 있다고 가정해 봅시다:

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

Kotlin에서는 항상 `person.age`와 같이 합성 프로퍼티를 사용하는 코드를 작성할 수 있었습니다. 이제 `Person::age` 및 `person::age`와 같이 참조를 생성할 수도 있습니다. `name`에 대해서도 동일하게 작동합니다.

```kotlin
val persons = listOf(Person("Jack", 11), Person("Sofie", 12), Person("Peter", 11))
    persons
        // Java 합성 프로퍼티에 대한 참조 호출:
        .sortedBy(Person::age)
        // Kotlin 프로퍼티 구문을 통해 Java getter 호출:
        .forEach { person -> println(person.name) }
```
{validate="false"}

#### Java 합성 프로퍼티 참조 활성화 방법

이 기능을 사용해 보려면 `-language-version 1.9` 컴파일러 옵션을 활성화하세요. Gradle 프로젝트의 경우 `build.gradle(.kts)`에 다음을 추가하여 활성화할 수 있습니다:

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

### kapt stub 생성 태스크에서 JVM IR 백엔드 기본 지원

Kotlin 1.7.20에서 [kapt stub 생성 태스크의 JVM IR 백엔드 지원](whatsnew1720.md#support-for-the-jvm-ir-backend-in-kapt-stub-generating-task)을 도입했습니다. 이번 릴리스부터 이 기능이 기본적으로 작동합니다. 더 이상 활성화를 위해 `gradle.properties`에 `kapt.use.jvm.ir=true`를 지정할 필요가 없습니다. 이 기능에 대한 의견은 [YouTrack](https://youtrack.jetbrains.com/issue/KT-49682)에 남겨주세요.

## Kotlin/Native

Kotlin 1.8.20에는 지원되는 Kotlin/Native 타겟의 변경 사항, Objective-C와의 상호 운용성, CocoaPods Gradle 플러그인 개선 사항 등이 포함되어 있습니다:

* [Kotlin/Native 타겟 업데이트](#update-for-kotlin-native-targets)
* [레거시 메모리 매니저(legacy memory manager) 중단](#deprecation-of-the-legacy-memory-manager)
* [@import 지시문이 있는 Objective-C 헤더 지원](#support-for-objective-c-headers-with-import-directives)
* [Cocoapods Gradle 플러그인의 link-only 모드 지원](#support-for-the-link-only-mode-in-cocoapods-gradle-plugin)
* [UIKit에서 Objective-C 확장을 클래스 멤버로 가져오기](#import-objective-c-extensions-as-class-members-in-uikit)
* [컴파일러 내부의 컴파일러 캐시 관리 재구현](#reimplementation-of-compiler-cache-management-in-the-compiler)
* [Cocoapods Gradle 플러그인의 `useLibraries()` 중단](#deprecation-of-uselibraries-in-cocoapods-gradle-plugin)
  
### Kotlin/Native 타겟 업데이트
  
Kotlin 팀은 Kotlin/Native에서 지원하는 타겟 목록을 재검토하여 계층(tiers)으로 나누고, Kotlin 1.8.20부터 일부 타겟을 중단(deprecate)하기로 결정했습니다. 지원되는 타겟 및 중단된 타겟의 전체 목록은 [Kotlin/Native 타겟 지원](native-target-support.md) 섹션을 참조하세요.

다음 타겟들은 Kotlin 1.8.20에서 중단되었으며 1.9.20에서 제거될 예정입니다:

* `iosArm32`
* `watchosX86`
* `wasm32`
* `mingwX86`
* `linuxArm32Hfp`
* `linuxMips32`
* `linuxMipsel32`

남은 타겟들에 대해서는 Kotlin/Native 컴파일러에서 얼마나 잘 지원되고 테스트되는지에 따라 세 가지 지원 계층으로 분류됩니다. 타겟은 다른 계층으로 이동할 수 있습니다. 예를 들어, [Kotlin Multiplatform](https://kotlinlang.org/docs/multiplatform/get-started.html)에 중요한 `iosArm64`에 대해서는 향후 완전한 지원을 제공하기 위해 최선을 다할 것입니다.

라이브러리 제작자라면 이러한 타겟 계층을 참고하여 CI 도구에서 테스트할 타겟과 건너뛸 타겟을 결정할 수 있습니다. Kotlin 팀도 [kotlinx.coroutines](coroutines-guide.md)와 같은 공식 Kotlin 라이브러리를 개발할 때 동일한 방식을 적용할 것입니다.

이러한 변경의 배경에 대해 자세히 알아보려면 [블로그 포스트](https://blog.jetbrains.com/kotlin/2023/02/update-regarding-kotlin-native-targets/)를 확인하세요.

### 레거시 메모리 매니저 중단

1.8.20부터 레거시 메모리 매니저는 중단되었으며 1.9.20에서 제거될 예정입니다. [새로운 메모리 매니저(new memory manager)](native-memory-manager.md)는 1.7.20에서 기본적으로 활성화되었으며, 이후 안정성 업데이트와 성능 개선이 계속 이루어지고 있습니다.

아직 레거시 메모리 매니저를 사용 중이라면 `gradle.properties`에서 `kotlin.native.binary.memoryModel=strict` 옵션을 제거하고 [마이그레이션 가이드](native-migration-guide.md)를 따라 필요한 변경 사항을 적용하세요.

새로운 메모리 매니저는 `wasm32` 타겟을 지원하지 않습니다. 이 타겟 또한 [이번 릴리스부터 중단](#update-for-kotlin-native-targets)되었으며 1.9.20에서 제거될 예정입니다.

### @import 지시문이 있는 Objective-C 헤더 지원

> 이 기능은 [실험적(Experimental)](components-stability.md#stability-levels-explained)입니다. 언제든지 변경되거나 삭제될 수 있습니다. 사용하려면 명시적인 동의(Opt-in)가 필요합니다(아래 세부 정보 참조). 평가 목적으로만 사용하세요. [YouTrack](https://kotl.in/issue)을 통해 피드백을 보내주시면 감사하겠습니다.
>
{style="warning"}

이제 Kotlin/Native에서 `@import` 지시문이 포함된 Objective-C 헤더를 가져올 수 있습니다. 이 기능은 자동 생성된 Objective-C 헤더가 있는 Swift 라이브러리나 Swift로 작성된 CocoaPods 의존성 클래스를 사용할 때 유용합니다.

이전에는 cinterop 도구가 `@import` 지시문을 통해 Objective-C 모듈에 의존하는 헤더를 분석하지 못했습니다. 이는 `-fmodules` 옵션에 대한 지원이 부족했기 때문입니다.

Kotlin 1.8.20부터는 `@import`가 포함된 Objective-C 헤더를 사용할 수 있습니다. 이를 위해 정의 파일의 `compilerOpts`에 `-fmodules` 옵션을 컴파일러에 전달하세요. [CocoaPods 통합](https://kotlinlang.org/docs/multiplatform/multiplatform-cocoapods-overview.html)을 사용하는 경우, `pod()` 함수의 구성 블록에 다음과 같이 cinterop 옵션을 지정하세요:

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

이 기능은 [많은 분이 기다려온 기능](https://youtrack.jetbrains.com/issue/KT-39120)이며, 향후 릴리스에서 기본 기능으로 포함될 수 있도록 [YouTrack](https://kotl.in/issue)에 피드백을 남겨주시면 감사하겠습니다.

### Cocoapods Gradle 플러그인의 link-only 모드 지원

Kotlin 1.8.20부터는 동적 프레임워크가 포함된 Pod 의존성을 cinterop 바인딩 생성 없이 링크 용도로만 사용할 수 있습니다. 이는 cinterop 바인딩이 이미 생성되어 있는 경우 유용할 수 있습니다.

라이브러리와 앱이라는 2개의 모듈이 있는 프로젝트를 생각해 봅시다. 라이브러리는 Pod에 의존하지만 프레임워크를 생성하지 않고 `.klib`만 생성합니다. 앱은 라이브러리에 의존하며 동적 프레임워크를 생성합니다. 이 경우 이 프레임워크를 라이브러리가 의존하는 Pod들과 링크해야 하지만, 라이브러리용으로 이미 바인딩이 생성되었으므로 cinterop 바인딩은 필요하지 않습니다.

이 기능을 활성화하려면 Pod 의존성을 추가할 때 `linkOnly` 옵션이나 빌더 프로퍼티를 사용하세요:

```kotlin
cocoapods {
    summary = "CocoaPods test library"
    homepage = "https://github.com/JetBrains/kotlin"

    pod("Alamofire", linkOnly = true) {
        version = "5.7.0"
    }
}
```

> 정적 프레임워크와 함께 이 옵션을 사용하면 Pod 의존성이 완전히 제거됩니다. 정적 프레임워크 링크에는 Pod이 사용되지 않기 때문입니다.
>
{style="note"}

### UIKit에서 Objective-C 확장을 클래스 멤버로 가져오기

Xcode 14.1부터 Objective-C 클래스의 일부 메서드가 카테고리 멤버로 이동되었습니다. 이로 인해 서로 다른 Kotlin API가 생성되었고, 이러한 메서드들이 메서드가 아닌 Kotlin 확장 함수로 가져오게 되었습니다.

이 때문에 UIKit을 사용하여 메서드를 오버라이드할 때 문제가 발생했을 수 있습니다. 예를 들어, Kotlin에서 `UIView`를 서브클래싱할 때 `drawRect()` 또는 `layoutSubviews()` 메서드를 오버라이드하는 것이 불가능해졌습니다.

1.8.20부터는 `NSView` 및 `UIView` 클래스와 동일한 헤더에 선언된 카테고리 멤버들을 해당 클래스의 멤버로 가져옵니다. 즉, `NSView` 및 `UIView`를 상속받은 메서드들을 다른 메서드와 마찬가지로 쉽게 오버라이드할 수 있습니다.

문제가 없다면 모든 Objective-C 클래스에 대해 이 동작을 기본으로 활성화할 계획입니다.

### 컴파일러 내부의 컴파일러 캐시 관리 재구현

컴파일러 캐시의 발전을 가속화하기 위해 컴파일러 캐시 관리를 Kotlin Gradle 플러그인에서 Kotlin/Native 컴파일러 내부로 이동했습니다. 이를 통해 컴파일 시간 개선 및 컴파일러 캐시 유연성 확보 등 여러 중요한 개선 작업을 진행할 수 있게 되었습니다.

문제가 발생하여 이전 동작으로 돌아가야 하는 경우 `kotlin.native.cacheOrchestration=gradle` Gradle 프로퍼티를 사용하세요.

이에 대한 피드백은 [YouTrack](https://kotl.in/issue)에 남겨주세요.

### Cocoapods Gradle 플러그인의 useLibraries() 중단

Kotlin 1.8.20은 정적 라이브러리를 위한 [CocoaPods 통합](https://kotlinlang.org/docs/multiplatform/multiplatform-cocoapods-overview.html)에서 사용되는 `useLibraries()` 함수의 중단 주기를 시작합니다.

정적 라이브러리가 포함된 Pod에 대한 의존성을 허용하기 위해 `useLibraries()` 함수를 도입했었습니다. 시간이 흐르면서 이러한 경우는 매우 드물어졌습니다. 대부분의 Pod은 소스 형태로 배포되며, Objective-C 프레임워크나 XCFramework가 이진 배포를 위한 일반적인 선택입니다.

이 함수는 잘 사용되지 않으면서도 Kotlin CocoaPods Gradle 플러그인 개발을 복잡하게 만드는 문제를 일으키므로 중단하기로 결정했습니다.

프레임워크 및 XCFramework에 대한 자세한 내용은 [최종 네이티브 바이너리 빌드](https://kotlinlang.org/docs/multiplatform/multiplatform-build-native-binaries.html)를 참조하세요.

## Kotlin Multiplatform

Kotlin 1.8.20은 Kotlin Multiplatform의 개발자 경험을 개선하기 위해 다음과 같은 업데이트를 제공합니다:

* [소스 세트 계층 구조 설정을 위한 새로운 방식](#new-approach-to-source-set-hierarchy)
* [Kotlin Multiplatform에서 Gradle 복합 빌드 지원 미리보기](#preview-of-gradle-composite-builds-support-in-kotlin-multiplatform)
* [Xcode에서 Gradle 오류 출력 개선](#improved-output-for-gradle-errors-in-xcode)

### 소스 세트 계층 구조 설정을 위한 새로운 방식

> 소스 세트 계층 구조에 대한 새로운 방식은 [실험적(Experimental)](components-stability.md#stability-levels-explained)입니다. 향후 Kotlin 릴리스에서 예고 없이 변경될 수 있습니다. 사용하려면 동의(Opt-in)가 필요합니다(아래 세부 정보 참조). [YouTrack](https://kotl.in/issue)을 통해 피드백을 보내주시면 감사하겠습니다.
>
{style="warning"}

Kotlin 1.8.20은 멀티플랫폼 프로젝트에서 소스 세트 계층 구조를 설정하는 새로운 방식인 '기본 타겟 계층 구조(default target hierarchy)'를 제공합니다. 이 새로운 방식은 [설계상의 결함](#why-replace-shortcuts)이 있는 `ios`와 같은 타겟 단축키(shortcut)를 대체하기 위해 고안되었습니다.

기본 타겟 계층 구조의 아이디어는 간단합니다. 프로젝트가 컴파일되는 모든 타겟을 명시적으로 선언하면, Kotlin Gradle 플러그인이 지정된 타겟을 기반으로 공유 소스 세트를 자동으로 생성합니다.

#### 프로젝트 설정

간단한 멀티플랫폼 모바일 앱의 예를 들어 보겠습니다:

```kotlin
@OptIn(ExperimentalKotlinGradlePluginApi::class)
kotlin {
    // 기본 타겟 계층 구조 활성화:
    targetHierarchy.default()

    android()
    iosArm64()
    iosSimulatorArm64()
}
```

기본 타겟 계층 구조를 가능한 모든 타겟과 공유 소스 세트에 대한 템플릿이라고 생각하면 됩니다. 코드에서 최종 타겟인 `android`, `iosArm64`, `iosSimulatorArm64`를 선언하면, Kotlin Gradle 플러그인이 템플릿에서 적절한 공유 소스 세트를 찾아 생성해 줍니다. 결과적인 계층 구조는 다음과 같습니다:

![기본 타겟 계층 구조 사용 예시](default-hierarchy-example.svg){thumbnail="true" width="350" thumbnail-same-file="true"}

녹색 소스 세트는 실제로 생성되어 프로젝트에 존재하는 것이며, 기본 템플릿의 회색 소스 세트들은 무시됩니다. 보시다시피 프로젝트에 watchOS 타겟이 없으므로 Kotlin Gradle 플러그인은 `watchos` 소스 세트를 생성하지 않았습니다.

만약 `watchosArm64`와 같은 watchOS 타겟을 추가하면 `watchos` 소스 세트가 생성되며, `apple`, `native`, `common` 소스 세트의 코드도 `watchosArm64`로 함께 컴파일됩니다.

기본 타겟 계층 구조의 전체 스키마는 [문서](https://kotlinlang.org/docs/multiplatform/multiplatform-hierarchy.html#default-hierarchy-template)에서 확인할 수 있습니다.

> 이 예시에서 `apple` 및 `native` 소스 세트는 `iosArm64` 및 `iosSimulatorArm64` 타겟으로만 컴파일됩니다. 따라서 이름에도 불구하고 전체 iOS API에 접근할 수 있습니다. 이는 `native`와 같은 소스 세트에서는 모든 네이티브 타겟에서 공통적으로 사용 가능한 API만 접근 가능할 것으로 기대할 수 있으므로 직관적이지 않을 수 있습니다. 이 동작은 향후 변경될 수 있습니다.
>
{style="note"}

#### 왜 단축키(shortcut)를 대체하나요? {initial-collapse-state="collapsed" collapsible="true"}

소스 세트 계층 구조를 직접 만드는 것은 번거롭고 오류가 발생하기 쉬우며 초보자에게 불친절할 수 있습니다. 이전의 해결책은 계층 구조의 일부를 대신 만들어주는 `ios`와 같은 단축키를 도입하는 것이었습니다. 하지만 단축키를 사용해 본 결과, 변경하기 어렵다는 큰 설계적 결함이 발견되었습니다.

예를 들어 `ios` 단축키는 `iosArm64` 및 `iosX64` 타겟만 생성하는데, 이는 `iosSimulatorArm64` 타겟이 필요한 M1 기반 호스트에서 작업할 때 혼란을 주고 문제를 일으킬 수 있습니다. 그러나 `iosSimulatorArm64` 타겟을 추가하는 것은 사용자 프로젝트에 매우 파괴적인 변화가 될 수 있습니다:

* `iosMain` 소스 세트에서 사용되는 모든 의존성이 `iosSimulatorArm64` 타겟을 지원해야 합니다. 그렇지 않으면 의존성 해결이 실패합니다.
* 새 타겟을 추가할 때 `iosMain`에서 사용되던 일부 네이티브 API가 사라질 수 있습니다(물론 `iosSimulatorArm64`의 경우에는 그럴 가능성이 낮습니다).
* 인텔 기반 MacBook에서 작은 토이 프로젝트를 작성하는 경우처럼, 어떤 경우에는 이 변경이 전혀 필요하지 않을 수도 있습니다.

단축키가 계층 구조 구성 문제를 근본적으로 해결하지 못한다는 것이 명확해졌고, 그래서 어느 시점부터 새로운 단축키 추가를 중단했습니다.

기본 타겟 계층 구조는 언뜻 단축키와 비슷해 보일 수 있지만, 결정적인 차이점이 있습니다. 바로 **사용자가 타겟 세트를 명시적으로 지정해야 한다는 점**입니다. 이 세트가 프로젝트의 컴파일, 게시 방식 및 의존성 해결 참여 방식을 정의합니다. 이 세트가 고정되어 있으므로 Kotlin Gradle 플러그인의 기본 구성이 변경되더라도 생태계에 주는 혼란은 현저히 적을 것이며, 툴링을 통한 마이그레이션 지원도 훨씬 쉬워질 것입니다.

#### 기본 계층 구조 활성화 방법

이 새로운 기능은 [실험적(Experimental)](components-stability.md#stability-levels-explained)입니다. Kotlin Gradle 빌드 스크립트에서 사용하려면 `@OptIn(ExperimentalKotlinGradlePluginApi::class)`를 통해 동의해야 합니다.

자세한 내용은 [계층적 프로젝트 구조(Hierarchical project structure)](https://kotlinlang.org/docs/multiplatform/multiplatform-hierarchy.html#default-hierarchy-template)를 참조하세요.

#### 피드백 남기기

이는 멀티플랫폼 프로젝트에 있어 중대한 변화입니다. 더 나은 기능을 만들 수 있도록 여러분의 [피드백](https://kotl.in/issue)을 기다립니다.

### Kotlin Multiplatform에서 Gradle 복합 빌드 지원 미리보기

> 이 기능은 Kotlin Gradle Plugin 1.8.20부터 Gradle 빌드에서 지원됩니다. IDE 지원을 위해서는 IntelliJ IDEA 2023.1 Beta 2 (231.8109.2) 이상 버전과 모든 Kotlin IDE 플러그인에서 Kotlin Gradle 플러그인 1.8.20을 사용하세요.
>
{style="note"}

1.8.20부터 Kotlin Multiplatform은 [Gradle 복합 빌드(composite builds)](https://docs.gradle.org/current/userguide/composite_builds.html)를 지원합니다. 복합 빌드를 사용하면 별도의 프로젝트 빌드나 동일 프로젝트의 일부를 단일 빌드에 포함할 수 있습니다.

기술적인 어려움으로 인해 Kotlin Multiplatform에서 Gradle 복합 빌드를 사용하는 것은 부분적으로만 지원되었습니다. Kotlin 1.8.20에는 더 다양한 프로젝트에서 작동할 수 있도록 개선된 지원 기능의 미리보기가 포함되어 있습니다. 이를 사용해 보려면 `gradle.properties`에 다음 옵션을 추가하세요:

```none
kotlin.mpp.import.enableKgpDependencyResolution=true
```

이 옵션은 새로운 가져오기(import) 모드의 미리보기를 활성화합니다. 복합 빌드 지원 외에도, 주요 버그 수정과 안정성 개선이 포함되어 멀티플랫폼 프로젝트에서 더욱 원활한 가져오기 경험을 제공합니다.

#### 알려진 문제점

아직 미리보기 버전이므로 추가적인 안정화가 필요하며, 사용 중에 가져오기 관련 이슈를 만날 수 있습니다. Kotlin 1.8.20 최종 릴리스 전까지 해결할 계획인 알려진 문제는 다음과 같습니다:

* IntelliJ IDEA 2023.1 EAP용 Kotlin 1.8.20 플러그인이 아직 제공되지 않습니다. 그럼에도 불구하고 Kotlin Gradle 플러그인 버전을 1.8.20으로 설정하여 이 IDE에서 복합 빌드를 시도해 볼 수 있습니다.
* 프로젝트 빌드에 `rootProject.name`이 지정되어 있으면 복합 빌드에서 Kotlin 메타데이터 해결에 실패할 수 있습니다. 해결 방법 및 세부 사항은 [이 YouTrack 이슈](https://youtrack.jetbrains.com/issue/KT-56536)를 참조하세요.

직접 사용해 보시고 [YouTrack](https://kotl.in/issue)에 보고해 주세요. Kotlin 1.9.0에서 기본 기능으로 포함될 수 있도록 여러분의 도움이 필요합니다.

### Xcode에서 Gradle 오류 출력 개선

Xcode에서 멀티플랫폼 프로젝트를 빌드할 때 "Command PhaseScriptExecution failed with a nonzero exit code" 오류가 발생하는 경우가 있습니다. 이 메시지는 Gradle 호출이 실패했음을 나타내지만, 문제를 파악하는 데는 큰 도움이 되지 않습니다.

Kotlin 1.8.20부터 Xcode는 Kotlin/Native 컴파일러의 출력을 파싱할 수 있게 되었습니다. 또한 Gradle 빌드가 실패할 경우 Xcode에서 근본 원인 예외(root cause exception)에 대한 추가적인 오류 메시지를 볼 수 있습니다. 대부분의 경우 이는 근본 문제를 식별하는 데 도움이 됩니다.

![Xcode에서 개선된 Gradle 오류 출력](xcode-gradle-output.png){width=700}

새로운 동작은 멀티플랫폼 프로젝트의 iOS 프레임워크를 Xcode의 iOS 애플리케이션에 연결하는 `embedAndSignAppleFrameworkForXcode`와 같은 Xcode 통합용 표준 Gradle 태스크에서 기본적으로 활성화됩니다. 또한 `kotlin.native.useXcodeMessageStyle` Gradle 프로퍼티를 사용하여 활성화하거나 비활성화할 수 있습니다.

## Kotlin/JavaScript

Kotlin 1.8.20은 TypeScript 정의를 생성하는 방식을 변경합니다. 또한 디버깅 경험을 개선하기 위한 변경 사항도 포함되어 있습니다:

* [Gradle 플러그인에서 Dukat 통합 제거](#removal-of-dukat-integration-from-gradle-plugin)
* [소스 맵(source maps)에 Kotlin 변수 및 함수 이름 포함](#kotlin-variable-and-function-names-in-source-maps)
* [TypeScript 정의 파일 생성 명시적 동의(Opt-in)](#opt-in-for-generation-of-typescript-definition-files)

### Gradle 플러그인에서 Dukat 통합 제거

Kotlin 1.8.20에서는 Kotlin/JavaScript Gradle 플러그인에서 [실험적(Experimental)](components-stability.md#stability-levels-explained) Dukat 통합을 제거했습니다. Dukat 통합은 TypeScript 선언 파일(`.d.ts`)을 Kotlin 외부 선언으로 자동 변환하는 기능을 제공했습니다.

대신 [Dukat 도구](https://github.com/Kotlin/dukat)를 사용하여 TypeScript 선언 파일(`.d.ts`)을 Kotlin 외부 선언으로 계속 변환할 수 있습니다.

> Dukat 도구는 [실험적(Experimental)](components-stability.md#stability-levels-explained)입니다. 언제든지 변경되거나 제거될 수 있습니다.
>
{style="warning"}

### 소스 맵에 Kotlin 변수 및 함수 이름 포함

디버깅을 돕기 위해 소스 맵에 Kotlin 코드에서 선언한 변수 및 함수 이름을 추가할 수 있는 기능을 도입했습니다. 1.8.20 이전에는 소스 맵에서 이러한 정보를 얻을 수 없었기 때문에, 디버거에서 생성된 JavaScript의 변수 및 함수 이름만 볼 수 있었습니다.

Gradle 파일 `build.gradle.kts`의 `sourceMapNamesPolicy` 또는 `-source-map-names-policy` 컴파일러 옵션을 사용하여 추가할 내용을 구성할 수 있습니다. 아래 표는 가능한 설정값입니다:

| 설정                      | 설명                                                        | 출력 예시                          |
|-------------------------|-----------------------------------------------------------|-----------------------------------|
| `simple-names`          | 변수 이름과 단순 함수 이름이 추가됩니다. (기본값)                          | `main`                            |
| `fully-qualified-names` | 변수 이름과 전체 패키지 경로를 포함한(fully qualified) 함수 이름이 추가됩니다. | `com.example.kjs.playground.main` |
| `no`                    | 변수나 함수 이름이 추가되지 않습니다.                                     | N/A                               |

`build.gradle.kts` 파일에서의 구성 예시는 다음과 같습니다:

```kotlin
tasks.withType<org.jetbrains.kotlin.gradle.tasks.Kotlin2JsCompile>().configureEach {
    compilercompileOptions.sourceMapNamesPolicy.set(org.jetbrains.kotlin.gradle.dsl.JsSourceMapNamesPolicy.SOURCE_MAP_NAMES_POLICY_FQ_NAMES) // 또는 SOURCE_MAP_NAMES_POLICY_NO, SOURCE_MAP_NAMES_POLICY_SIMPLE_NAMES
}
```
{validate="false"}

Chromium 기반 브라우저에서 제공하는 디버깅 도구는 소스 맵에서 원본 Kotlin 이름을 가져와 스택 트레이스의 가독성을 높일 수 있습니다. 즐거운 디버깅 되세요!

> 소스 맵에 변수 및 함수 이름을 추가하는 기능은 [실험적(Experimental)](components-stability.md#stability-levels-explained)입니다. 언제든지 변경되거나 제거될 수 있습니다.
>
{style="warning"}

### TypeScript 정의 파일 생성 명시적 동의(Opt-in)

이전에는 실행 파일(`binaries.executable()`)을 생성하는 프로젝트의 경우, Kotlin/JS IR 컴파일러가 `@JsExport`로 표시된 모든 최상위 선언을 수집하여 `.d.ts` 파일에 TypeScript 정의를 자동으로 생성했습니다.

이 기능이 모든 프로젝트에 유용한 것은 아니기 때문에 Kotlin 1.8.20에서 동작을 변경했습니다. TypeScript 정의를 생성하려면 Gradle 빌드 파일에서 이를 명시적으로 구성해야 합니다. `build.gradle.kts` 파일의 [`js` 섹션](js-project-setup.md#execution-environments)에 `generateTypeScriptDefinitions()`를 추가하세요. 예를 들어:

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

> TypeScript 정의(`.d.ts`) 생성 기능은 [실험적(Experimental)](components-stability.md#stability-levels-explained)입니다. 언제든지 변경되거나 제거될 수 있습니다.
>
{style="warning"}

## Gradle

Kotlin 1.8.20은 [멀티플랫폼 플러그인의 일부 특수한 경우](https://youtrack.jetbrains.com/issue/KT-55751)를 제외하고 Gradle 6.8에서 7.6 버전과 완전히 호환됩니다. 최신 Gradle 릴리스 버전도 사용할 수 있으나, 이 경우 중단(deprecation) 경고가 발생하거나 일부 새로운 Gradle 기능이 작동하지 않을 수 있음을 유의하세요.

이 버전에는 다음과 같은 변경 사항이 포함되었습니다:

* [새로운 Gradle 플러그인 버전 정렬](#new-gradle-plugins-versions-alignment)
* [Gradle에서 JVM 증분 컴파일 기본 활성화](#new-jvm-incremental-compilation-by-default-in-gradle)
* [컴파일 태스크 출력의 정밀한 백업(Precise backup)](#precise-backup-of-compilation-tasks-outputs)
* [모든 Gradle 버전에서 Kotlin/JVM 태스크의 지연 생성(Lazy creation)](#lazy-kotlin-jvm-tasks-creation-for-all-gradle-versions)
* [컴파일 태스크 destinationDirectory의 기본값 외 위치 설정](#non-default-location-of-compile-tasks-destinationdirectory)
* [HTTP 통계 서비스에 컴파일러 인자 보고 비활성화 기능](#ability-to-opt-out-from-reporting-compiler-arguments-to-an-http-statistics-service)

### 새로운 Gradle 플러그인 버전 정렬

Gradle은 함께 작동해야 하는 의존성들의 [버전을 항상 일치시키는 방식](https://docs.gradle.org/current/userguide/dependency_version_alignment.html#aligning_versions_natively_with_gradle)을 제공합니다. Kotlin 1.8.20도 이 방식을 도입했습니다. 이는 기본적으로 작동하므로 활성화를 위해 구성을 변경하거나 업데이트할 필요가 없습니다. 또한 [Kotlin Gradle 플러그인의 전이적 의존성 해결을 위한 이전의 해결 방법](whatsnew18.md#resolution-of-kotlin-gradle-plugins-transitive-dependencies)을 더 이상 사용할 필요가 없습니다.

이 기능에 대한 피드백은 [YouTrack](https://youtrack.jetbrains.com/issue/KT-54691)에 남겨주세요.

### Gradle에서 JVM 증분 컴파일 기본 활성화

[Kotlin 1.7.0부터 사용 가능했던](whatsnew17.md#a-new-approach-to-incremental-compilation) 새로운 증분 컴파일 방식이 이제 기본적으로 작동합니다. 더 이상 활성화를 위해 `gradle.properties`에 `kotlin.incremental.useClasspathSnapshot=true`를 지정할 필요가 없습니다.

이에 대한 피드백이 있다면 [YouTrack에 이슈를 등록](https://kotl.in/issue)해 주세요.

### 컴파일 태스크 출력의 정밀한 백업

> 컴파일 태스크 출력의 정밀한 백업(Precise backup)은 [실험적(Experimental)](components-stability.md#stability-levels-explained)입니다. 사용하려면 `gradle.properties`에 `kotlin.compiler.preciseCompilationResultsBackup=true`를 추가하세요. 이에 대한 의견은 [YouTrack](https://kotl.in/issue/experimental-ic-optimizations)에 남겨주세요.
>
{style="warning"}

Kotlin 1.8.20부터는 [증분 컴파일](gradle-compilation-and-caches.md#incremental-compilation) 시 Kotlin이 다시 컴파일하는 클래스만 백업하는 '정밀한 백업' 기능을 활성화할 수 있습니다. 전체 백업과 정밀한 백업 모두 컴파일 오류 발생 후 다시 증분 빌드를 실행하는 데 도움이 됩니다. 정밀한 백업은 전체 백업에 비해 빌드 시간을 단축해 줍니다. 전체 백업은 대규모 프로젝트나 백업을 수행하는 태스크가 많은 경우, 특히 느린 HDD에 프로젝트가 있는 경우 빌드 시간을 **눈에 띄게** 소모할 수 있습니다.

이 최적화 기능은 실험적입니다. `gradle.properties` 파일에 `kotlin.compiler.preciseCompilationResultsBackup` Gradle 프로퍼티를 추가하여 활성화할 수 있습니다:

```none
kotlin.compiler.preciseCompilationResultsBackup=true
```

#### JetBrains에서의 정밀한 백업 사용 사례 {initial-collapse-state="collapsed" collapsible="true"}

다음 차트에서 전체 백업 대비 정밀한 백업 사용 사례를 볼 수 있습니다:

![전체 백업과 정밀한 백업 비교](comparison-of-full-and-precise-backups.png){width=700}

첫 번째와 두 번째 차트는 Kotlin 프로젝트에서 Kotlin Gradle 플러그인을 빌드할 때 정밀한 백업이 미치는 영향을 보여줍니다:

1. 많은 모듈이 의존하는 모듈에 새로운 공개 메서드를 추가하는 등 작은 [ABI](https://en.wikipedia.org/wiki/Application_binary_interface) 변경을 가한 후.
2. 다른 모듈이 의존하지 않는 모듈에 프라이빗 함수를 추가하는 등 작은 비-ABI(non-ABI) 변경을 가한 후.

세 번째 차트는 [Space](https://www.jetbrains.com/space/) 프로젝트에서 많은 모듈이 의존하는 Kotlin/JS 모듈에 프라이빗 함수를 추가하는 작은 비-ABI 변경 후 웹 프런트엔드 빌드 시 정밀한 백업이 미치는 영향을 보여줍니다.

이 측정은 Apple M1 Max CPU가 탑재된 컴퓨터에서 수행되었으며, 컴퓨터 사양에 따라 결과가 다를 수 있습니다. 성능에 영향을 미치는 요인에는 다음이 포함되나 이에 국한되지 않습니다:

* [Kotlin 데몬](gradle-compilation-and-caches.md#the-kotlin-daemon-and-how-to-use-it-with-gradle) 및 [Gradle 데몬](https://docs.gradle.org/current/userguide/gradle_daemon.html)의 예열 상태.
* 디스크의 속도.
* CPU 모델 및 부하 상태.
* 변경의 영향을 받는 모듈과 해당 모듈의 크기.
* 변경 사항이 ABI인지 비-ABI인지 여부.

#### 빌드 보고서를 통한 최적화 평가 {initial-collapse-state="collapsed" collapsible="true"}

프로젝트 및 시나리오에 대해 이 최적화가 미치는 영향을 추정하려면 [Kotlin 빌드 보고서](gradle-compilation-and-caches.md#build-reports)를 사용하면 됩니다. `gradle.properties` 파일에 다음 프로퍼티를 추가하여 텍스트 파일 형식의 보고서를 활성화하세요:

```none
kotlin.build.report.output=file
```

다음은 정밀한 백업을 활성화하기 전 보고서의 관련 부분 예시입니다:

```none
Task ':kotlin-gradle-plugin:compileCommonKotlin' finished in 0.59 s
<...>
Time metrics:
 Total Gradle task time: 0.59 s
 Task action before worker execution: 0.24 s
  Backup output: 0.22 s // 이 숫자에 주목하세요 
<...>
```

다음은 정밀한 백업을 활성화한 후 보고서의 관련 부분 예시입니다:

```none
Task ':kotlin-gradle-plugin:compileCommonKotlin' finished in 0.46 s
<...>
Time metrics:
 Total Gradle task time: 0.46 s
 Task action before worker execution: 0.07 s
  Backup output: 0.05 s // 시간이 단축되었습니다
 Run compilation in Gradle worker: 0.32 s
  Clear jar cache: 0.00 s
  Precise backup output: 0.00 s // 정밀한 백업 관련
  Cleaning up the backup stash: 0.00 s // 정밀한 백업 관련
<...>
```

### 모든 Gradle 버전에서 Kotlin/JVM 태스크의 지연 생성

Gradle 7.3 이상 버전에서 `org.jetbrains.kotlin.gradle.jvm` 플러그인을 사용하는 프로젝트의 경우, Kotlin Gradle 플러그인이 더 이상 `compileKotlin` 태스크를 즉시(eagerly) 생성하고 구성하지 않습니다. 낮은 버전의 Gradle에서는 모든 태스크를 등록만 하고 드라이 런(dry run) 시에는 구성하지 않습니다. 이제 Gradle 7.3 이상을 사용할 때도 동일한 동작이 적용됩니다.

### 컴파일 태스크 destinationDirectory의 기본값 외 위치 설정

다음 중 하나를 수행하는 경우 빌드 스크립트에 코드를 추가하여 업데이트해야 합니다:

* Kotlin/JVM `KotlinJvmCompile`/`KotlinCompile` 태스크의 `destinationDirectory` 위치를 재정의(Override)하는 경우.
* 중단된(deprecated) Kotlin/JS/Non-IR [변형(variant)](gradle-plugin-variants.md)을 사용하고 `Kotlin2JsCompile` 태스크의 `destinationDirectory`를 재정의하는 경우.

JAR 파일의 `sourceSets.main.outputs`에 `sourceSets.main.kotlin.classesDirectories`를 명시적으로 추가해야 합니다:

```groovy
tasks.jar(type: Jar) {
    from sourceSets.main.outputs
    from sourceSets.main.kotlin.classesDirectories
}
```

### HTTP 통계 서비스에 컴파일러 인자 보고 비활성화 기능

이제 Kotlin Gradle 플러그인이 HTTP [빌드 보고서](gradle-compilation-and-caches.md#build-reports)에 컴파일러 인자를 포함할지 여부를 제어할 수 있습니다. 때로는 이러한 인자를 보고할 필요가 없을 수도 있습니다. 프로젝트에 모듈이 많은 경우 보고서의 컴파일러 인자가 너무 무거워지고 도움이 되지 않을 수 있습니다. 이제 이를 비활성화하여 메모리를 절약할 수 있습니다. `gradle.properties` 또는 `local.properties`에서 `kotlin.build.report.include_compiler_arguments=(true|false)` 프로퍼티를 사용하세요.

이 기능에 대한 피드백은 [YouTrack](https://youtrack.jetbrains.com/issue/KT-55323/)에 남겨주세요.

## 표준 라이브러리 (Standard library)

Kotlin 1.8.20에는 특히 Kotlin/Native 개발에 유용한 다양한 새 기능이 추가되었습니다:

* [AutoCloseable 인터페이스 지원](#support-for-the-autocloseable-interface)
* [Base64 인코딩 및 디코딩 지원](#support-for-base64-encoding)
* [Kotlin/Native에서 @Volatile 지원](#support-for-volatile-in-kotlin-native)
* [Kotlin/Native에서 정규식 사용 시 스택 오버플로 버그 수정](#bug-fix-for-stack-overflow-when-using-regex-in-kotlin-native)

### AutoCloseable 인터페이스 지원

> 새로운 `AutoCloseable` 인터페이스는 [실험적(Experimental)](components-stability.md#stability-levels-explained)입니다. 사용하려면 `@OptIn(ExperimentalStdlibApi::class)`를 사용하거나 컴파일러 인자 `-opt-in=kotlin.ExperimentalStdlibApi`를 통해 동의해야 합니다.
>

{style="warning"}

공통 표준 라이브러리에 `AutoCloseable` 인터페이스가 추가되어, 모든 라이브러리에서 리소스를 닫기 위해 하나의 공통 인터페이스를 사용할 수 있게 되었습니다. Kotlin/JVM에서 `AutoCloseable` 인터페이스는 [`java.lang.AutoClosable`](https://docs.oracle.com/javase/8/docs/api/java/lang/AutoCloseable.html)의 별칭(alias)입니다.

또한, 지정된 리소스에 대해 블록 함수를 실행한 후 예외 발생 여부와 상관없이 리소스를 올바르게 닫아주는 확장 함수 `use()`가 포함되었습니다.

공통 표준 라이브러리에는 `AutoCloseable` 인터페이스를 구현하는 공개 클래스가 없습니다. 아래 예제에서는 `XMLWriter` 인터페이스를 정의하고 이를 구현하는 리소스가 있다고 가정합니다. 예를 들어, 이 리소스는 파일을 열고 XML 콘텐츠를 작성한 다음 닫는 클래스일 수 있습니다.

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

> 새로운 인코딩 및 디코딩 기능은 [실험적(Experimental)](components-stability.md#stability-levels-explained)입니다. 사용하려면 `@OptIn(ExperimentalEncodingApi::class)`를 사용하거나 컴파일러 인자 `-opt-in=kotlin.io.encoding.ExperimentalEncodingApi`를 통해 동의해야 합니다.
>
{style="warning"}

Base64 인코딩 및 디코딩 지원을 추가했습니다. 각각 다른 인코딩 스키마와 동작을 제공하는 3가지 클래스 인스턴스를 제공합니다. 표준 [Base64 인코딩 스키마](https://www.rfc-editor.org/rfc/rfc4648#section-4)를 사용하려면 `Base64.Default` 인스턴스를 사용하세요.

["URL 및 파일 이름 안전(URL and Filename safe)"](https://www.rfc-editor.org/rfc/rfc4648#section-5) 인코딩 스키마를 사용하려면 `Base64.UrlSafe` 인스턴스를 사용하세요.

[MIME](https://www.rfc-editor.org/rfc/rfc2045#section-6.8) 인코딩 스키마를 사용하려면 `Base64.Mime` 인스턴스를 사용하세요. `Base64.Mime` 인스턴스를 사용하면 모든 인코딩 함수가 76자마다 라인 구분자를 삽입합니다. 디코딩 시에는 잘못된 문자를 건너뛰며 예외를 발생시키지 않습니다.

> `Base64.Default` 인스턴스는 `Base64` 클래스의 동반 객체(companion object)입니다. 따라서 `Base64.Default.encode()` 및 `Base64.Default.decode()` 대신 `Base64.encode()` 및 `Base64.decode()`를 호출하여 기능을 사용할 수 있습니다.
>
{style="tip"}

```kotlin
val foBytes = "fo".map { it.code.toByte() }.toByteArray()
Base64.Default.encode(foBytes) // "Zm8="
// 또는 다음처럼 사용할 수 있습니다:
// Base64.encode(foBytes)

val foobarBytes = "foobar".map { it.code.toByte() }.toByteArray()
Base64.UrlSafe.encode(foobarBytes) // "Zm9vYmFy"

Base64.Default.decode("Zm8=") // foBytes
// 또는 다음처럼 사용할 수 있습니다:
// Base64.decode("Zm8=")

Base64.UrlSafe.decode("Zm9vYmFy") // foobarBytes
```
{validate="false"}

기존 버퍼로 바이트를 인코딩하거나 디코딩하는 추가 함수들과 인코딩 결과를 제공된 `Appendable` 타입 객체에 추가하는 기능을 사용할 수 있습니다.

Kotlin/JVM에서는 입력 및 출력 스트림을 사용하여 Base64 인코딩 및 디코딩을 수행할 수 있도록 `encodingWith()` 및 `decodingWith()` 확장 함수도 추가했습니다.

### Kotlin/Native에서 @Volatile 지원

> Kotlin/Native에서의 `@Volatile`은 [실험적(Experimental)](components-stability.md#stability-levels-explained)입니다. 언제든지 변경되거나 제거될 수 있습니다. 사용하려면 동의(Opt-in)가 필요합니다(아래 세부 정보 참조). 평가 목적으로만 사용하세요. [YouTrack](https://kotl.in/issue)을 통해 피드백을 보내주시면 감사하겠습니다.
>
{style="warning"}

`var` 프로퍼티에 `@Volatile` 어노테이션을 달면, 해당 백킹 필드(backing field)에 대한 읽기 또는 쓰기가 원자적(atomic)으로 수행되도록 표시되며, 쓰기 결과가 항상 다른 스레드에 즉시 보이게 됩니다.

1.8.20 이전에는 공통 표준 라이브러리에서 [`kotlin.jvm.Volatile` 어노테이션](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.jvm/-volatile/)을 사용할 수 있었습니다. 그러나 이 어노테이션은 JVM에서만 유효했습니다. Kotlin/Native에서 이를 사용하면 무시되어 오류가 발생할 수 있었습니다.

1.8.20에서는 JVM과 Kotlin/Native 모두에서 사용할 수 있는 공통 어노테이션인 `kotlin.concurrent.Volatile`을 도입했습니다.

#### 활성화 방법

이 기능을 사용해 보려면 `@OptIn(ExperimentalStdlibApi)`로 동의하고 `-language-version 1.9` 컴파일러 옵션을 활성화하세요. Gradle 프로젝트의 경우 `build.gradle(.kts)` 파일에 다음을 추가하여 활성화할 수 있습니다:

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

### Kotlin/Native에서 정규식 사용 시 스택 오버플로 버그 수정

이전 버전의 Kotlin에서는 정규식 패턴이 매우 단순하더라도 입력값에 문자가 아주 많으면 크래시가 발생할 수 있었습니다. 1.8.20에서 이 문제가 해결되었습니다. 자세한 정보는 [KT-46211](https://youtrack.jetbrains.com/issue/KT-46211)을 참조하세요.

## Serialization 업데이트

Kotlin 1.8.20은 [Kotlin K2 컴파일러에 대한 Alpha 지원](#prototype-serialization-compiler-plugin-for-kotlin-k2-compiler)을 포함하며 [동반 객체를 통한 serializer 커스터마이징을 금지](#prohibit-implicit-serializer-customization-via-companion-object)합니다.

### Kotlin K2 컴파일러를 위한 프로토타입 serialization 컴파일러 플러그인

> K2용 serialization 컴파일러 플러그인 지원은 [Alpha](components-stability.md#stability-levels-explained) 단계입니다. 이를 사용하려면 [Kotlin K2 컴파일러를 활성화](#how-to-enable-the-kotlin-k2-compiler)하세요.
>
{style="warning"}

1.8.20부터 serialization 컴파일러 플러그인이 Kotlin K2 컴파일러와 함께 작동합니다. 직접 사용해 보시고 [저희에게 의견을 공유해 주세요](#leave-your-feedback-on-the-new-k2-compiler)!

### 동반 객체를 통한 암시적 serializer 커스터마이징 금지

현재는 `@Serializable` 어노테이션으로 클래스를 직렬화 가능하게 선언함과 동시에, 해당 클래스의 동반 객체(companion object)에 `@Serializer` 어노테이션을 사용하여 커스텀 serializer를 선언하는 것이 가능합니다.

예시:

```kotlin
import kotlinx.serialization.*

@Serializable
class Foo(val a: Int) {
    @Serializer(Foo::class)
    companion object {
        // KSerializer<Foo>의 커스텀 구현
    }
}
```

이 경우 `@Serializable` 어노테이션만 봐서는 어떤 serializer가 사용되는지 명확하지 않습니다. 실제로는 `Foo` 클래스가 커스텀 serializer를 가지고 있음에도 말이죠.

이러한 혼란을 방지하기 위해 Kotlin 1.8.20에서는 이 시나리오가 감지될 때 컴파일러 경고를 도입했습니다. 경고에는 이 문제를 해결하기 위한 마이그레이션 경로가 포함되어 있습니다.

코드에 이러한 구문을 사용하고 있다면 다음과 같이 업데이트할 것을 권장합니다:

```kotlin
import kotlinx.serialization.*

@Serializable(Foo.Companion::class)
class Foo(val a: Int) {
    // @Serializer(Foo::class) 사용 여부는 중요하지 않습니다
    companion object: KSerializer<Foo> {
        // KSerializer<Foo>의 커스텀 구현
    }
}
```

이 방식을 사용하면 `Foo` 클래스가 동반 객체에 선언된 커스텀 serializer를 사용한다는 점이 명확해집니다. 자세한 내용은 [YouTrack 티켓](https://youtrack.jetbrains.com/issue/KT-54441)을 참조하세요.

> Kotlin 2.0에서는 이 컴파일 경고를 컴파일 오류로 격상할 계획입니다. 경고가 표시된다면 코드를 마이그레이션하는 것을 권장합니다.
>
{style="tip"}

## 문서 업데이트

Kotlin 문서에 몇 가지 주목할 만한 변경 사항이 있었습니다:

* [Spring Boot 및 Kotlin 시작하기](jvm-get-started-spring-boot.md) – 데이터베이스를 포함한 간단한 애플리케이션을 만들고 Spring Boot와 Kotlin의 기능에 대해 더 자세히 알아봅니다.
* [범위 지정 함수(Scope functions)](scope-functions.md) – 표준 라이브러리의 유용한 범위 지정 함수를 사용하여 코드를 단순화하는 방법을 배웁니다.
* [CocoaPods 통합](https://kotlinlang.org/docs/multiplatform/multiplatform-cocoapods-overview.html) – CocoaPods 작업을 위한 환경을 설정합니다.

## Kotlin 1.8.20 설치하기

### IDE 버전 확인

[IntelliJ IDEA](https://www.jetbrains.com/idea/download/) 2022.2 및 2022.3은 자동으로 Kotlin 플러그인을 1.8.20 버전으로 업데이트하도록 제안합니다. IntelliJ IDEA 2023.1에는 Kotlin 플러그인 1.8.20이 내장되어 있습니다.

Android Studio Flamingo (222) 및 Giraffe (223)는 다음 릴리스에서 Kotlin 1.8.20을 지원할 예정입니다.

새로운 명령줄 컴파일러는 [GitHub 릴리스 페이지](https://github.com/JetBrains/kotlin/releases/tag/v1.8.20)에서 다운로드할 수 있습니다.

### Gradle 설정 구성

Kotlin 아티팩트와 의존성을 올바르게 다운로드하려면 Maven Central 저장소를 사용하도록 `settings.gradle(.kts)` 파일을 업데이트하세요:

```kotlin
pluginManagement {
    repositories {
        mavenCentral()
        gradlePluginPortal()
    }
}
```

저장소가 지정되지 않은 경우 Gradle은 서비스 종료된 JCenter 저장소를 사용하여 Kotlin 아티팩트와 관련된 문제를 일으킬 수 있습니다.