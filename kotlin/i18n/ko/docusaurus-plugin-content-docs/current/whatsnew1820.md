---
title: "Kotlin 1.8.20의 새로운 기능"
---
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

_[릴리스 날짜: 2023년 4월 25일](releases#release-details)_

Kotlin 1.8.20 릴리스가 출시되었으며 주요 특징은 다음과 같습니다.

* [새로운 Kotlin K2 컴파일러 업데이트](#new-kotlin-k2-compiler-updates)
* [새로운 실험적 Kotlin/Wasm 타겟](#new-kotlin-wasm-target)
* [Gradle에서 기본적으로 새로운 JVM 증분 컴파일 사용](#new-jvm-incremental-compilation-by-default-in-gradle)
* [Kotlin/Native 타겟 업데이트](#update-for-kotlin-native-targets)
* [Kotlin Multiplatform에서 Gradle composite builds 지원 미리 보기](#preview-of-gradle-composite-builds-support-in-kotlin-multiplatform)
* [Xcode에서 Gradle 오류에 대한 출력 개선](#improved-output-for-gradle-errors-in-xcode)
* [표준 라이브러리에서 AutoCloseable 인터페이스에 대한 실험적 지원](#support-for-the-autocloseable-interface)
* [표준 라이브러리에서 Base64 인코딩에 대한 실험적 지원](#support-for-base64-encoding)

다음 비디오에서 변경 사항에 대한 간략한 개요를 확인할 수도 있습니다.

<video src="https://www.youtube.com/v/R1JpkpPzyBU" title="What's new in Kotlin 1.8.20"/>

## IDE 지원

1.8.20을 지원하는 Kotlin 플러그인은 다음 IDE에서 사용할 수 있습니다.

| IDE            | 지원되는 버전            |
|----------------|-------------------------------|
| IntelliJ IDEA  | 2022.2.x, 2022.3.x,  2023.1.x |
| Android Studio | Flamingo (222)                |
:::note
Kotlin 아티팩트 및 종속성을 제대로 다운로드하려면 Maven Central 저장소를 사용하도록 [Gradle 설정을 구성](#configure-gradle-settings)하세요.

## 새로운 Kotlin K2 컴파일러 업데이트

Kotlin 팀은 K2 컴파일러를 계속 안정화하고 있습니다. [Kotlin 1.7.0 발표](whatsnew17#new-kotlin-k2-compiler-for-the-jvm-in-alpha)에서 언급했듯이 여전히 **Alpha** 단계입니다.
이번 릴리스에서는 [K2 Beta](https://youtrack.jetbrains.com/issue/KT-52604)를 향한 추가적인 개선 사항이 도입되었습니다.

이번 1.8.20 릴리스부터 Kotlin K2 컴파일러는 다음과 같은 기능을 제공합니다.

* 직렬화 플러그인의 미리 보기 버전이 있습니다.
* [JS IR compiler](js-ir-compiler)에 대한 Alpha 지원을 제공합니다.
* [새로운 언어 버전인 Kotlin 2.0](https://blog.jetbrains.com/kotlin/2023/02/k2-kotlin-2-0/)의 향후 릴리스를 소개합니다.

새로운 컴파일러와 그 이점에 대한 자세한 내용은 다음 비디오를 참조하세요.

* [What Everyone Must Know About The NEW Kotlin K2 Compiler](https://www.youtube.com/watch?v=iTdJJq_LyoY)
* [The New Kotlin K2 Compiler: Expert Review](https://www.youtube.com/watch?v=db19VFLZqJM)

### Kotlin K2 컴파일러를 활성화하는 방법

Kotlin K2 컴파일러를 활성화하고 테스트하려면 다음 컴파일러 옵션과 함께 새 언어 버전을 사용하세요.

```bash
-language-version 2.0
```

`build.gradle(.kts)` 파일에서 이를 지정할 수 있습니다.

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

새로운 K2 컴파일러의 Alpha 버전은 JVM 및 JS IR 프로젝트에서만 작동합니다.
Kotlin/Native 또는 모든 멀티 플랫폼 프로젝트는 아직 지원하지 않습니다.

### 새로운 K2 컴파일러에 대한 피드백을 남겨주세요

여러분들의 피드백을 기다립니다!

* Kotlin Slack에서 K2 개발자에게 직접 피드백을 제공하세요.
  [초대 받기](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up?_gl=1*ju6cbn*_ga*MTA3MTk5NDkzMC4xNjQ2MDY3MDU4*_ga_9J976DJZ68*MTY1ODMzNzA3OS4xMDAuMS4xNjU4MzQwODEwLjYw)
  하고 [#k2-early-adopters](https://kotlinlang.slack.com/archives/C03PK0PE257) 채널에 참여하세요.
* 새로운 K2 컴파일러에서 발생한 문제점을
  [문제 추적기](https://kotl.in/issue)에 보고하세요.
* **사용 통계 보내기** 옵션을 활성화하여
  JetBrains에서 K2 사용에 대한 익명 데이터를 수집하도록 허용하세요.

## 언어

Kotlin이 계속 발전함에 따라 1.8.20에서 새로운 언어 기능의 미리 보기 버전을 소개합니다.

* [Enum class values 함수의 최신적이고 성능이 뛰어난 대체](#a-modern-and-performant-replacement-of-the-enum-class-values-function)
* [데이터 클래스와의 대칭을 위한 데이터 객체](#preview-of-data-objects-for-symmetry-with-data-classes)
* [인라인 클래스에서 본문이 있는 보조 생성자에 대한 제한 완화](#preview-of-lifting-restriction-on-secondary-constructors-with-bodies-in-inline-classes)

### Enum class values 함수의 최신적이고 성능이 뛰어난 대체

이 기능은 [실험적](components-stability#stability-levels-explained)입니다.
언제든지 삭제되거나 변경될 수 있습니다. 옵트인이 필요합니다(자세한 내용은 아래 참조). 평가 목적으로만 사용하세요.
[YouTrack](https://kotl.in/issue)에서 여러분의 피드백을 기다립니다.

Enum 클래스에는 정의된 enum 상수 배열을 반환하는 합성 `values()` 함수가 있습니다. 그러나 배열을 사용하면
Kotlin 및 Java에서 [숨겨진 성능 문제](https://github.com/Kotlin/KEEP/blob/master/proposals/enum-entries#examples-of-performance-issues)가 발생할 수 있습니다.
또한 대부분의 API는 결국 변환해야 하는 컬렉션을 사용합니다. 이러한
문제를 해결하기 위해 Enum 클래스에 `values()` 함수 대신 사용해야 하는 `entries` 속성을 도입했습니다. 호출되면 `entries` 속성은 정의된 enum 상수의 미리 할당된 변경 불가능한 목록을 반환합니다.

`values()` 함수는 여전히 지원되지만 `entries` 속성을 대신 사용하는 것이 좋습니다.

```kotlin
enum class Color(val colorName: String, val rgb: String) {
    RED("Red", "#FF0000"),
    ORANGE("Orange", "#FF7F00"),
    YELLOW("Yellow", "#FFFF00")
}

@OptIn(ExperimentalStdlibApi::class)
fun findByRgb(rgb: String): Color? = Color.entries.find { it.rgb == rgb }
```

#### entries 속성을 활성화하는 방법

이 기능을 사용하려면 `@OptIn(ExperimentalStdlibApi)`로 옵트인하고 `-language-version 1.9` 컴파일러
옵션을 활성화하세요. Gradle 프로젝트에서 다음을 `build.gradle(.kts)` 파일에 추가하여 수행할 수 있습니다.

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

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

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
tasks
    .withType(org.jetbrains.kotlin.gradle.tasks.KotlinCompilationTask.class)
    .configureEach {
        compilerOptions.languageVersion =
            org.jetbrains.kotlin.gradle.dsl.KotlinVersion.KOTLIN_1_9
    }
```

</TabItem>
</Tabs>

IntelliJ IDEA 2023.1부터 이 기능을 옵트인한 경우 적절한 IDE
검사가 `values()`에서 `entries`로 변환하는 것에 대해 알리고 빠른 수정 방법을 제공합니다.

제안에 대한 자세한 내용은 [KEEP 노트](https://github.com/Kotlin/KEEP/blob/master/proposals/enum-entries)를 참조하세요.

### 데이터 클래스와의 대칭을 위한 데이터 객체 미리 보기

데이터 객체를 사용하면 싱글톤 의미 체계와 깔끔한 `toString()` 표현으로 객체를 선언할 수 있습니다. 이
코드 조각에서 객체 선언에 `data` 키워드를 추가하면 `toString()` 출력의 가독성이 어떻게 향상되는지 확인할 수 있습니다.

```kotlin
package org.example
object MyObject
data object MyDataObject

fun main() {
    println(MyObject) // org.example.MyObject@1f32e575
    println(MyDataObject) // MyDataObject
}
```

특히 `sealed` 계층 구조(예: `sealed class` 또는 `sealed interface` 계층 구조)의 경우 `data objects`는
`data class` 선언과 함께 편리하게 사용할 수 있기 때문에 훌륭한 적합성을 갖습니다. 이 코드 조각에서
`EndOfFile`을 일반 `object` 대신 `data object`로 선언하면 수동으로 재정의할 필요 없이 예쁜 `toString`을 얻을 수 있습니다. 이는 첨부된 데이터 클래스 정의와의 대칭을 유지합니다.

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

#### 데이터 객체의 의미 체계

[Kotlin 1.7.20](whatsnew1720#improved-string-representations-for-singletons-and-sealed-class-hierarchies-with-data-objects)의 첫 번째 미리 보기 버전 이후 데이터 객체의 의미 체계가 개선되었습니다. 컴파일러는 이제 편리한 함수를 자동으로 생성합니다.

##### toString

데이터 객체의 `toString()` 함수는 객체의 간단한 이름을 반환합니다.

```kotlin
data object MyDataObject {
    val x: Int = 3
}

fun main() {
    println(MyDataObject) // MyDataObject
}
```

##### equals 및 hashCode

`data object`에 대한 `equals()` 함수는 해당 `data object` 유형의 모든 객체가
동일하게 간주되도록 합니다. 대부분의 경우 런타임 시 데이터 객체의 단일 인스턴스만 갖게 됩니다(결국
`data object`는 싱글톤을 선언함). 그러나 동일한 유형의 다른 객체가
런타임 시 생성되는 에지 케이스(예: `java.lang.reflect`를 통한 플랫폼 리플렉션 또는 이 API를 사용하는 JVM 직렬화 라이브러리를 사용하는 경우)에서
객체가 동일하게 처리되도록 합니다.

`data objects`는 구조적으로만 비교하고(`==` 연산자 사용) 참조별로 비교하지 마세요(`===`
연산자). 이렇게 하면 런타임 시 둘 이상의 데이터 객체 인스턴스가 존재하는 경우 함정을 피하는 데 도움이 됩니다. 다음
코드 조각은 이 특정 에지 케이스를 보여줍니다.

```kotlin
import java.lang.reflect.Constructor

data object MySingleton

fun main() {
    val evilTwin = createInstanceViaReflection()

    println(MySingleton) // MySingleton
    println(evilTwin) // MySingleton

    // Even when a library forcefully creates a second instance of MySingleton, its `equals` method returns true:
    println(MySingleton == evilTwin) // true

    // Do not compare data objects via ===.
    println(MySingleton === evilTwin) // false
}

fun createInstanceViaReflection(): MySingleton {
    // Kotlin reflection does not permit the instantiation of data objects.
    // This creates a new MySingleton instance "by force" (i.e., Java platform reflection)
    // Don't do this yourself!
    return (MySingleton.javaClass.declaredConstructors[0].apply { isAccessible = true } as Constructor<MySingleton>).newInstance()
}
```

생성된 `hashCode()` 함수의 동작은 `equals()` 함수의 동작과 일치하므로 `data object`의 모든
런타임 인스턴스는 동일한 해시 코드를 갖습니다.

##### 데이터 객체에 대한 copy 및 componentN 함수 없음

`data object` 및 `data class` 선언이 함께 사용되는 경우가 많고 몇 가지 유사점이 있지만 `data object`에 대해 생성되지 않는
함수가 있습니다.

`data object` 선언은 싱글톤 객체로 사용하기 위한 것이므로 `copy()` 함수가 생성되지 않습니다.
싱글톤 패턴은 클래스의 인스턴스화를 단일 인스턴스로 제한하고 인스턴스 복사본을 생성하도록 허용하면 해당 제한 사항이 위반됩니다.

또한 `data class`와 달리 `data object`에는 데이터 속성이 없습니다. 이러한 객체를 역구조화하려고 시도하는 것은
의미가 없으므로 `componentN()` 함수가 생성되지 않습니다.

[YouTrack](https://youtrack.jetbrains.com/issue/KT-4107)에서 이 기능에 대한 여러분의 피드백을 기다립니다.

#### 데이터 객체 미리 보기를 활성화하는 방법

이 기능을 사용하려면 `-language-version 1.9` 컴파일러 옵션을 활성화하세요. Gradle 프로젝트에서 다음을
`build.gradle(.kts)` 파일에 추가하여 수행할 수 있습니다.

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

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

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
tasks
    .withType(org.jetbrains.kotlin.gradle.tasks.KotlinCompilationTask.class)
    .configureEach {
        compilerOptions.languageVersion =
            org.jetbrains.kotlin.gradle.dsl.KotlinVersion.KOTLIN_1_9
    }
```

</TabItem>
</Tabs>

### 인라인 클래스에서 본문이 있는 보조 생성자에 대한 제한 완화 미리 보기

이 기능은 [실험적](components-stability#stability-levels-explained)입니다. 언제든지 삭제되거나 변경될 수 있습니다.
옵트인이 필요합니다(자세한 내용은 아래 참조). 평가 목적으로만 사용하세요. [YouTrack](https://kotl.in/issue)에서 여러분의 피드백을 기다립니다.

Kotlin 1.8.20은 [인라인 클래스](inline-classes)에서 본문이 있는 보조 생성자 사용에 대한 제한을 완화합니다.

인라인 클래스는 초기화 의미 체계가 명확하도록 `init` 블록이나 보조 생성자 없이 공개 기본 생성자만 허용했습니다. 따라서 기본 값을 캡슐화하거나 일부 제약 조건이 있는 값을 나타내는 인라인 클래스를 만드는 것은 불가능했습니다.

Kotlin 1.4.30에서 `init` 블록에 대한 제한이 완화되었을 때 이러한 문제가 해결되었습니다. 이제 한 걸음 더 나아가 미리 보기 모드에서 본문이 있는 보조 생성자를 허용합니다.

```kotlin
@JvmInline
value class Person(private val fullName: String) {
    // Allowed since Kotlin 1.4.30:
    init { 
        check(fullName.isNotBlank()) {
            "Full name shouldn't be empty"
        }
    }

    // Preview available since Kotlin 1.8.20:
    constructor(name: String, lastName: String) : this("$name $lastName") {
        check(lastName.isNotBlank()) {
            "Last name shouldn't be empty"
        }
    }
}
```

#### 본문이 있는 보조 생성자를 활성화하는 방법

이 기능을 사용하려면 `-language-version 1.9` 컴파일러 옵션을 활성화하세요. Gradle 프로젝트에서 다음을
`build.gradle(.kts)`에 추가하여 수행할 수 있습니다.

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

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

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
tasks
    .withType(org.jetbrains.kotlin.gradle.tasks.KotlinCompilationTask.class)
    .configureEach {
        compilerOptions.languageVersion =
            org.jetbrains.kotlin.gradle.dsl.KotlinVersion.KOTLIN_1_9
    }
```

</TabItem>
</Tabs>

이 기능을 사용해 보고 모든 보고서를 [YouTrack](https://kotl.in/issue)에 제출하여 Kotlin 1.9.0에서 기본값으로 만드는 데 도움을 주세요.

[이 KEEP](https://github.com/Kotlin/KEEP/blob/master/proposals/inline-classes)에서 Kotlin 인라인 클래스 개발에 대해 자세히 알아보세요.

## 새로운 Kotlin/Wasm 타겟

Kotlin/Wasm (Kotlin WebAssembly)은 이번 릴리스에서 [실험적](components-stability#stability-levels-explained) 단계에 진입합니다. Kotlin 팀은
[WebAssembly](https://webassembly.org/)가 유망한 기술이라고 생각하며 이를 사용하여 Kotlin의 모든 이점을 얻을 수 있는 더 나은 방법을 찾고 싶어합니다.

WebAssembly 이진 형식은 자체 가상 머신을 사용하여 실행되기 때문에 플랫폼에 독립적입니다. 거의 모든 최신
브라우저는 이미 WebAssembly 1.0을 지원합니다. WebAssembly를 실행하기 위한 환경을 설정하려면 Kotlin/Wasm이 타겟팅하는 실험적 가비지 컬렉션 모드를 활성화하기만 하면 됩니다. 자세한 지침은
여기에서 확인할 수 있습니다. [Kotlin/Wasm을 활성화하는 방법](#how-to-enable-kotlin-wasm).

새로운 Kotlin/Wasm 타겟의 다음과 같은 장점을 강조하고 싶습니다.

* Kotlin/Wasm은 LLVM을 사용할 필요가 없으므로 `wasm32` Kotlin/Native 타겟에 비해 컴파일 속도가 더 빠릅니다.
* [Wasm 가비지 컬렉션](https://github.com/WebAssembly/gc) 덕분에 JS와의 상호 운용성과 브라우저와의 통합이 `wasm32` 타겟에 비해 더 쉽습니다.
* Wasm은 작고 구문 분석하기 쉬운 바이트 코드이므로 Kotlin/JS 및 JavaScript에 비해 애플리케이션 시작 속도가 잠재적으로 더 빠릅니다.
* Wasm은 정적으로 형식이 지정된 언어이므로 Kotlin/JS 및 JavaScript에 비해 애플리케이션 런타임 성능이 향상되었습니다.

1.8.20 릴리스부터 실험적 프로젝트에서 Kotlin/Wasm을 사용할 수 있습니다.
Kotlin 표준 라이브러리(`stdlib`)와 테스트 라이브러리(`kotlin.test`)를 Kotlin/Wasm에 즉시 제공합니다.
IDE 지원은 향후 릴리스에서 추가될 예정입니다.

[이 YouTube 비디오에서 Kotlin/Wasm에 대해 자세히 알아보세요](https://www.youtube.com/watch?v=-pqz9sKXatw).

### Kotlin/Wasm을 활성화하는 방법

Kotlin/Wasm을 활성화하고 테스트하려면 `build.gradle.kts` 파일을 업데이트하세요.

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

[Kotlin/Wasm 예제가 있는 GitHub 저장소](https://github.com/Kotlin/kotlin-wasm-examples)를 확인하세요.

Kotlin/Wasm 프로젝트를 실행하려면 타겟 환경의 설정을 업데이트해야 합니다.

<Tabs>
<TabItem value="Chrome" label="Chrome">

* 버전 109의 경우:

  `--js-flags=--experimental-wasm-gc` 명령줄 인수를 사용하여 애플리케이션을 실행합니다.

* 버전 110 이상의 경우:

    1. 브라우저에서 `chrome://flags/#enable-webassembly-garbage-collection`으로 이동합니다.
    2. **WebAssembly Garbage Collection**을 활성화합니다.
    3. 브라우저를 다시 시작합니다.

</TabItem>
<TabItem value="Firefox" label="Firefox">

버전 109 이상의 경우:

1. 브라우저에서 `about:config`로 이동합니다.
2. `javascript.options.wasm_function_references` 및 `javascript.options.wasm_gc` 옵션을 활성화합니다.
3. 브라우저를 다시 시작합니다.

</TabItem>
<TabItem value="Edge" label="Edge">

버전 109 이상의 경우:

`--js-flags=--experimental-wasm-gc` 명령줄 인수를 사용하여 애플리케이션을 실행합니다.

</TabItem>
</Tabs>

### Kotlin/Wasm에 대한 피드백을 남겨주세요

여러분의 피드백을 기다립니다!

* Kotlin Slack에서 개발자에게 직접 피드백을 제공하세요.
  [초대 받기](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up?_gl=1*ju6cbn*_ga*MTA3MTk5NDkzMC4xNjQ2MDY3MDU4*_ga_9J976DJZ68*MTY1ODMzNzA3OS4xMDAuMS4xNjU4MzQwODEwLjYw)
  하고 [#webassembly](https://kotlinlang.slack.com/archives/CDFP59223) 채널에 참여하세요.
* [이 YouTrack 문제](https://youtrack.jetbrains.com/issue/KT-56492)에서 Kotlin/Wasm에 발생한 문제를 보고하세요.

## Kotlin/JVM

Kotlin 1.8.20에서는 [Java 합성 속성 참조 미리 보기](#preview-of-java-synthetic-property-references)와 [기본적으로 kapt 스텁 생성 작업에서 JVM IR 백엔드 지원](#support-for-the-jvm-ir-backend-in-kapt-stub-generating-task-by-default)을 소개합니다.

### Java 합성 속성 참조 미리 보기

이 기능은 [실험적](components-stability#stability-levels-explained)입니다.
언제든지 삭제되거나 변경될 수 있습니다. 평가 목적으로만 사용하세요.
[YouTrack](https://kotl.in/issue)에서 여러분의 피드백을 기다립니다.

Kotlin 1.8.20에서는 예를 들어 다음과 같은 Java 코드에 대해 Java 합성 속성에 대한 참조를 만들 수 있는 기능이 도입되었습니다.

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

Kotlin에서는 항상 `person.age`를 작성할 수 있었는데, 여기서 `age`는 합성 속성입니다.
이제 `Person::age` 및 `person::age`에 대한 참조를 만들 수도 있습니다. `name`에도 동일하게 적용됩니다.

```kotlin
val persons = listOf(Person("Jack", 11), Person("Sofie", 12), Person("Peter", 11))
    persons
        // Call a reference to Java synthetic property:
        .sortedBy(Person::age)
        // Call Java getter via the Kotlin property syntax:
        .forEach { person `->` println(person.name) }
```

#### Java 합성 속성 참조를 활성화하는 방법

이 기능을 사용하려면 `-language-version 1.9` 컴파일러 옵션을 활성화하세요.
Gradle 프로젝트에서 다음을 `build.gradle(.kts)`에 추가하여 수행할 수 있습니다.

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

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

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
tasks
    .withType(org.jetbrains.kotlin.gradle.tasks.KotlinCompilationTask.class)
    .configureEach {
        compilerOptions.languageVersion =
            org.jetbrains.kotlin.gradle.dsl.KotlinVersion.KOTLIN_1_9
    }
```

</TabItem>
</Tabs>

### 기본적으로 kapt 스텁 생성 작업에서 JVM IR 백엔드 지원

Kotlin 1.7.20에서는 [kapt 스텁 생성 작업에서 JVM IR 백엔드 지원](whatsnew1720#support-for-the-jvm-ir-backend-in-kapt-stub-generating-task)을 도입했습니다. 이번 릴리스부터 이 지원은 기본적으로 작동합니다. 활성화하기 위해 `gradle.properties`에서 `kapt.use.jvm.ir=true`를 더 이상 지정할 필요가 없습니다.
[YouTrack](https://youtrack.jetbrains.com/issue/KT-49682)에서 이 기능에 대한 여러분의 피드백을 기다립니다.

## Kotlin/Native

Kotlin 1.8.20에는 지원되는 Kotlin/Native 타겟, Objective-C와의 상호 운용성, CocoaPods Gradle 플러그인 개선 사항 등에 대한 변경 사항이 포함되어 있습니다.

* [Kotlin/Native 타겟 업데이트](#update-for-kotlin-native-targets)
* [레거시 메모리 관리자 사용 중단](#deprecation-of-the-legacy-memory-manager)
* [@import 지시문이 있는 Objective-C 헤더 지원](#support-for-objective-c-headers-with-import-directives)
* [Cocoapods Gradle 플러그인에서 링크 전용 모드 지원](#support-for-the-link-only-mode-in-cocoapods-gradle-plugin)
* [UIKit에서 Objective-C 확장을 클래스 멤버로 가져오기](#import-objective-c-extensions-as-class-members-in-uikit)
* [컴파일러에서 컴파일러 캐시 관리 재구현](#reimplementation-of-compiler-cache-management-in-the-compiler)
* [Cocoapods Gradle 플러그인에서 `useLibraries()` 사용 중단](#deprecation-of-uselibraries-in-cocoapods-gradle-plugin)
  
### Kotlin/Native 타겟 업데이트
  
Kotlin 팀은 Kotlin/Native에서 지원하는 타겟 목록을 다시 살펴보고 계층으로 분할하고 Kotlin 1.8.20부터 일부 타겟을 더 이상 사용하지 않기로 결정했습니다. 지원되고 더 이상 사용되지 않는 타겟의 전체 목록은 [Kotlin/Native 타겟 지원](native-target-support) 섹션을 참조하세요.

다음 타겟은 Kotlin 1.8.20에서 더 이상 사용되지 않으며 1.9.20에서 제거됩니다.

* `iosArm32`
* `watchosX86`
* `wasm32`
* `mingwX86`
* `linuxArm32Hfp`
* `linuxMips32`
* `linuxMipsel32`

나머지 타겟의 경우 이제 타겟이 Kotlin/Native 컴파일러에서 얼마나 잘 지원되고 테스트되는지에 따라 세 가지 계층의 지원이 있습니다. 타겟은 다른 계층으로 이동할 수 있습니다. 예를 들어 [Kotlin Multiplatform](multiplatform-intro)에 중요하므로 향후 `iosArm64`에 대한 완전한 지원을 제공하기 위해 최선을 다할 것입니다.

라이브러리 작성자인 경우 이러한 타겟 계층은 CI 도구에서 테스트할 타겟과 건너뛸 타겟을 결정하는 데 도움이 될 수 있습니다. Kotlin 팀은 [kotlinx.coroutines](coroutines-guide)와 같은 공식 Kotlin 라이브러리를 개발할 때 동일한 접근 방식을 사용할 것입니다.

이러한 변경 사항의 이유에 대해 자세히 알아보려면 [블로그 게시물](https://blog.jetbrains.com/kotlin/2023/02/update-regarding-kotlin-native-targets/)을 확인하세요.

### 레거시 메모리 관리자 사용 중단

1.8.20부터 레거시 메모리 관리자는 더 이상 사용되지 않으며 1.9.20에서 제거됩니다.
[새로운 메모리 관리자](native-memory-manager)는 1.7.20에서 기본적으로 활성화되었으며 추가적인 안정성 업데이트와 성능 개선이 있었습니다.

레거시 메모리 관리자를 계속 사용하는 경우 `gradle.properties`에서 `kotlin.native.binary.memoryModel=strict` 옵션을 제거하고 [마이그레이션 가이드](native-migration-guide)에 따라 필요한 변경을 수행하세요.

새로운 메모리 관리자는 `wasm32` 타겟을 지원하지 않습니다. 이 타겟도 [이번 릴리스부터](#update-for-kotlin-native-targets) 더 이상 사용되지 않으며 1.9.20에서 제거됩니다.

### @import 지시문이 있는 Objective-C 헤더 지원

이 기능은 [실험적](components-stability#stability-levels-explained)입니다.
언제든지 삭제되거나 변경될 수 있습니다. 옵트인이 필요합니다(자세한 내용은 아래 참조). 평가 목적으로만 사용하세요.
[YouTrack](https://kotl.in/issue)에서 여러분의 피드백을 기다립니다.

Kotlin/Native는 이제 `@import` 지시문이 있는 Objective-C 헤더를 가져올 수 있습니다. 이 기능은 자동 생성된 Objective-C 헤더가 있는 Swift 라이브러리 또는 Swift로 작성된 CocoaPods 종속성 클래스를 사용하는 데 유용합니다.

이전에는 cinterop 도구가 `@import` 지시문을 통해 Objective-C 모듈에 종속된 헤더를 분석하지 못했습니다. 그 이유는 `-fmodules` 옵션에 대한 지원이 부족했기 때문입니다.

Kotlin 1.8.20부터 `@import`가 있는 Objective-C 헤더를 사용할 수 있습니다. 이렇게 하려면 정의 파일에서 컴파일러에 `-fmodules` 옵션을 `compilerOpts`로 전달하세요. [CocoaPods 통합](native-cocoapods)을 사용하는 경우 다음과 같이 `pod()` 함수의 구성 블록에서 cinterop 옵션을 지정하세요.

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

이는 [많은 기대를 받은 기능](https://youtrack.jetbrains.com/issue/KT-39120)이며 향후 릴리스에서 기본값으로 만드는 데 도움이 되도록 [YouTrack](https://kotl.in/issue)에서 여러분의 피드백을 환영합니다.

### Cocoapods Gradle 플러그인에서 링크 전용 모드 지원

Kotlin 1.8.20을 사용하면 cinterop 바인딩을 생성하지 않고 연결에만 동적 프레임워크가 있는 Pod 종속성을 사용할 수 있습니다. 이는 cinterop 바인딩이 이미 생성된 경우에 유용할 수 있습니다.

라이브러리와 앱의 두 모듈이 있는 프로젝트를 생각해 보세요. 라이브러리는 Pod에 종속되지만 프레임워크가 아닌 `.klib`만 생성합니다. 앱은 라이브러리에 종속되고 동적 프레임워크를 생성합니다.
이 경우 라이브러리가 종속된 Pod와 이 프레임워크를 연결해야 하지만 라이브러리에 대해 이미 생성되었으므로 cinterop 바인딩은 필요하지 않습니다.

이 기능을 활성화하려면 Pod에 대한 종속성을 추가할 때 `linkOnly` 옵션 또는 빌더 속성을 사용하세요.

```kotlin
cocoapods {
    summary = "CocoaPods test library"
    homepage = "https://github.com/JetBrains/kotlin"

    pod("Alamofire", linkOnly = true) {
        version = "5.7.0"
    }
}
```

정적 프레임워크와 함께 이 옵션을 사용하면 Pod 종속성이 완전히 제거됩니다. Pod는 정적 프레임워크 연결에 사용되지 않기 때문입니다.

:::

### UIKit에서 Objective-C 확장을 클래스 멤버로 가져오기

Xcode 14.1부터 Objective-C 클래스의 일부 메서드가 범주 멤버로 이동되었습니다. 이로 인해 다른 Kotlin API가 생성되었고 이러한 메서드는 메서드 대신 Kotlin 확장으로 가져왔습니다.

UIKit를 사용하여 메서드를 재정의할 때 이로 인해 문제가 발생했을 수 있습니다. 예를 들어 Kotlin에서 UIVIew를 서브클래스할 때 `drawRect()` 또는 `layoutSubviews()` 메서드를 재정의하는 것이 불가능해졌습니다.

1.8.20부터 NSView 및 UIView 클래스와 동일한 헤더에 선언된 범주 멤버는 이러한 클래스의 멤버로 가져옵니다. 이는 NSView 및 UIView에서 서브클래싱하는 메서드를 다른 메서드와 마찬가지로 쉽게 재정의할 수 있음을 의미합니다.

모든 것이 잘 진행되면 Objective-C 클래스 전체에 대해 이 동작을 기본적으로 활성화할 계획입니다.

### 컴파일러에서 컴파일러 캐시 관리 재구현

컴파일러 캐시의 진화를 가속화하기 위해 컴파일러 캐시 관리를 Kotlin Gradle 플러그인에서
Kotlin/Native 컴파일러로 옮겼습니다. 이를 통해 컴파일 시간 및 컴파일러 캐시 유연성과 관련된 중요한 개선 사항을 포함하여 여러 가지 중요한 개선 작업을 차단 해제합니다.

문제가 발생하여 이전 동작으로 되돌려야 하는 경우 `kotlin.native.cacheOrchestration=gradle`
Gradle 속성을 사용하세요.

[YouTrack에서](https://kotl.in/issue) 이 기능에 대한 여러분의 피드백을 기다립니다.

### Cocoapods Gradle 플러그인에서 useLibraries() 사용 중단

Kotlin 1.8.20은 정적 라이