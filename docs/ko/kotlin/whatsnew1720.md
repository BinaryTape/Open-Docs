[//]: # (title: Kotlin 1.7.20의 새로운 기능)

<tldr>
   <p>Kotlin 1.7.20용 IDE 지원은 IntelliJ IDEA 2021.3, 2022.1, 2022.2에서 사용할 수 있습니다.</p>
</tldr>

_[출시일: 2022년 9월 29일](releases.md#release-details)_

Kotlin 1.7.20 릴리스가 출시되었습니다! 이번 릴리스의 주요 내용은 다음과 같습니다:

* [새로운 Kotlin K2 컴파일러는 `all-open`, 리시버가 있는 SAM, Lombok 및 기타 컴파일러 플러그인을 지원합니다](#support-for-kotlin-k2-compiler-plugins)
* [열린 범위(open-ended ranges) 생성을 위한 `..<` 연산자의 미리 보기를 도입했습니다](#preview-of-the-operator-for-creating-open-ended-ranges)
* [새로운 Kotlin/Native 메모리 관리자가 이제 기본적으로 활성화됩니다](#the-new-kotlin-native-memory-manager-enabled-by-default)
* [JVM용 새로운 실험적 기능: 제네릭 기본 타입을 가진 인라인 클래스를 도입했습니다](#generic-inline-classes)

이 영상에서 변경 사항에 대한 간략한 개요를 확인할 수 있습니다:

<video src="https://www.youtube.com/v/OG9npowJgE8" title="What's new in Kotlin 1.7.20"/>

## Kotlin K2 컴파일러 플러그인 지원

Kotlin 팀은 K2 컴파일러를 계속 안정화하고 있습니다.
K2는 여전히 **알파** 단계에 있지만 ([Kotlin 1.7.0 릴리스](whatsnew17.md#new-kotlin-k2-compiler-for-the-jvm-in-alpha)에서 발표됨), 이제 여러 컴파일러 플러그인을 지원합니다.
새로운 컴파일러에 대한 Kotlin 팀의 업데이트를 받으려면 [이 YouTrack 이슈](https://youtrack.jetbrains.com/issue/KT-52604)를 팔로우하세요.

이번 1.7.20 릴리스부터 Kotlin K2 컴파일러는 다음 플러그인을 지원합니다:

* [`all-open`](all-open-plugin.md)
* [`no-arg`](no-arg-plugin.md)
* [SAM with receiver](sam-with-receiver-plugin.md)
* [Lombok](lombok.md)
* AtomicFU
* `jvm-abi-gen`

> 새로운 K2 컴파일러의 알파 버전은 JVM 프로젝트에서만 작동합니다.
> Kotlin/JS, Kotlin/Native 또는 기타 멀티플랫폼 프로젝트는 지원하지 않습니다.
>
{style="warning"}

다음 영상에서 새로운 컴파일러 및 이점에 대해 자세히 알아보세요:
* [The Road to the New Kotlin Compiler](https://www.youtube.com/watch?v=iTdJJq_LyoY)
* [K2 Compiler: a Top-Down View](https://www.youtube.com/watch?v=db19VFLZqJM)

### Kotlin K2 컴파일러 활성화 방법

Kotlin K2 컴파일러를 활성화하고 테스트하려면 다음 컴파일러 옵션을 사용하세요:

```bash
-Xuse-k2
```

`build.gradle(.kts)` 파일에서 지정할 수 있습니다:

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
tasks.withType<KotlinCompile> {
    kotlinOptions.useK2 = true
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
compileKotlin {
    kotlinOptions.useK2 = true
}
```
</tab>
</tabs>

JVM 프로젝트에서 성능 향상을 확인하고 이전 컴파일러의 결과와 비교해 보세요.

### 새로운 K2 컴파일러에 대한 피드백 남기기

어떤 형태의 피드백이든 매우 감사드립니다:
* Kotlin Slack의 K2 개발자에게 직접 피드백을 제공하세요: [초대받기](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up?_gl=1*ju6cbn*_ga*MTA3MTk5NDkzMC4xNjQ2MDY3MDU4*_ga_9J976DJZ68*MTY1ODMzNzA3OS4xMDAuMS4xNjU4MzQwODEwLjYw) 및 [#k2-early-adopters](https://kotlinlang.slack.com/archives/C03PK0PE257) 채널에 참여하세요.
* 새로운 K2 컴파일러에서 발생한 문제점은 [이슈 트래커](https://kotl.in/issue)에 보고해 주세요.
* JetBrains가 K2 사용에 대한 익명 데이터를 수집하도록 [**사용 통계 전송** 옵션을 활성화](https://www.jetbrains.com/help/idea/settings-usage-statistics.html)하세요.

## 언어

Kotlin 1.7.20은 새로운 언어 기능의 미리 보기 버전을 도입하고, 빌더 타입 추론(builder type inference)에 제약을 둡니다:

* [열린 범위 생성을 위한 `..<` 연산자 미리 보기](#preview-of-the-operator-for-creating-open-ended-ranges)
* [새로운 데이터 객체 선언](#improved-string-representations-for-singletons-and-sealed-class-hierarchies-with-data-objects)
* [빌더 타입 추론 제약](#new-builder-type-inference-restrictions)

### 열린 범위 생성을 위한 `..<` 연산자 미리 보기

> 새로운 연산자는 [실험적(Experimental)](components-stability.md#stability-levels-explained)이며, IDE에서 제한적인 지원을 제공합니다.
>
{style="warning"}

이번 릴리스에서는 새로운 `..<` 연산자가 도입됩니다. Kotlin에는 값의 범위를 표현하는 `..` 연산자가 있습니다. 새로운 `..<` 연산자는 `until` 함수처럼 작동하며 열린 범위를 정의하는 데 도움을 줍니다.

<video src="https://www.youtube.com/watch?v=v0AHdAIBnbs" title="New operator for open-ended ranges"/>

저희 연구에 따르면 이 새로운 연산자는 열린 범위를 더 잘 표현하고, 상한이 포함되지 않음을 명확히 보여줍니다.

`when` 표현식에서 `..<` 연산자를 사용하는 예시입니다:

```kotlin
when (value) {
    in 0.0..<0.25 -> // First quarter
    in 0.25..<0.5 -> // Second quarter
    in 0.5..<0.75 -> // Third quarter
    in 0.75..1.0 ->  // Last quarter  <- 여기 닫힌 범위에 주목하세요
}
```
{validate="false"}

#### 표준 라이브러리 API 변경 사항

다음 새로운 타입과 연산은 공통 Kotlin 표준 라이브러리의 `kotlin.ranges` 패키지에 도입될 예정입니다:

##### 새로운 `OpenEndRange<T>` 인터페이스

열린 범위를 나타내는 새로운 인터페이스는 기존 `ClosedRange<T>` 인터페이스와 매우 유사합니다:

```kotlin
interface OpenEndRange<T : Comparable<T>> {
    // 하한
    val start: T
    // 상한, 범위에 포함되지 않음
    val endExclusive: T
    operator fun contains(value: T): Boolean = value >= start && value < endExclusive
    fun isEmpty(): Boolean = start >= endExclusive
}
```
{validate="false"}

##### 기존 iterable 범위에 `OpenEndRange` 구현

개발자가 상한이 제외된 범위를 얻어야 할 때, 현재는 `until` 함수를 사용하여 동일한 값을 가진 닫힌 이터러블(iterable) 범위를 효과적으로 생성합니다. `OpenEndRange<T>`를 사용하는 새로운 API에서 이러한 범위를 허용할 수 있도록, 기존 이터러블 범위인 `IntRange`, `LongRange`, `CharRange`, `UIntRange`, `ULongRange`에 해당 인터페이스를 구현하고자 합니다. 따라서 이들은 `ClosedRange<T>`와 `OpenEndRange<T>` 인터페이스를 동시에 구현하게 됩니다.

```kotlin
class IntRange : IntProgression(...), ClosedRange<Int>, OpenEndRange<Int> {
    override val start: Int
    override val endInclusive: Int
    override val endExclusive: Int
}
```
{validate="false"}

##### 표준 타입용 `rangeUntil` 연산자

`rangeUntil` 연산자는 현재 `rangeTo` 연산자에 의해 정의된 동일한 타입 및 조합에 대해 제공될 예정입니다. 프로토타입 목적으로는 확장 함수로 제공하지만, 일관성을 위해 열린 범위 API를 안정화하기 전에 나중에 멤버로 만들 계획입니다.

#### `..<` 연산자 활성화 방법

`..<` 연산자를 사용하거나 사용자 정의 타입에 대한 해당 연산자 컨벤션을 구현하려면 `-language-version 1.8` 컴파일러 옵션을 활성화하세요.

표준 타입의 열린 범위를 지원하기 위해 도입된 새로운 API 요소는 실험적 표준 라이브러리 API에 일반적으로 적용되는 옵트인(opt-in)이 필요합니다: `@OptIn(ExperimentalStdlibApi::class)`. 또는 `-opt-in=kotlin.ExperimentalStdlibApi` 컴파일러 옵션을 사용할 수 있습니다.

[이 KEEP 문서](https://github.com/kotlin/KEEP/blob/open-ended-ranges/proposals/open-ended-ranges.md)에서 새로운 연산자에 대해 자세히 읽어보세요.

### 데이터 객체를 사용한 싱글톤 및 봉인된 클래스 계층의 개선된 문자열 표현

> 데이터 객체는 [실험적(Experimental)](components-stability.md#stability-levels-explained)이며, 현재 IDE에서 제한적인 지원을 제공합니다.
>
{style="warning"}

이번 릴리스에서는 사용할 수 있는 새로운 타입의 `object` 선언인 `data object`를 도입합니다. `Data object` ([https://youtrack.jetbrains.com/issue/KT-4107](https://youtrack.jetbrains.com/issue/KT-4107))는 일반적인 `object` 선언과 개념적으로 동일하게 작동하지만, 깔끔한 `toString` 표현을 기본으로 제공합니다.

<video src="https://www.youtube.com/v/ovAqcwFhEGc" title="Data objects in Kotlin 1.7.20"/>

```kotlin
package org.example
object MyObject
data object MyDataObject

fun main() {
    println(MyObject) // org.example.MyObject@1f32e575
    println(MyDataObject) // MyDataObject
}
```

이로 인해 `data object` 선언은 봉인된 클래스 계층(sealed class hierarchies)에 완벽하며, `data class` 선언과 함께 사용할 수 있습니다. 이 스니펫에서 `EndOfFile`을 일반 `object` 대신 `data object`로 선언하면, 수동으로 재정의할 필요 없이 멋진 `toString`을 얻을 수 있으며, 함께 제공되는 `data class` 정의와의 대칭성을 유지합니다:

```kotlin
sealed class ReadResult {
    data class Number(val value: Int) : ReadResult()
    data class Text(val value: String) : ReadResult()
    data object EndOfFile : ReadResult()
}

fun main() {
    println(ReadResult.Number(1)) // Number(value=1)
    println(ReadResult.Text("Foo")) // Text(value=Foo)
    println(ReadResult.EndOfFile) // EndOfFile
}
```

#### 데이터 객체 활성화 방법

코드에서 데이터 객체 선언을 사용하려면 `-language-version 1.9` 컴파일러 옵션을 활성화하세요. Gradle 프로젝트에서는 `build.gradle(.kts)`에 다음을 추가하여 활성화할 수 있습니다:

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
tasks.withType<org.jetbrains.kotlin.gradle.tasks.KotlinCompile>().configureEach {
    // ...
    kotlinOptions.languageVersion = "1.9"
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
compileKotlin {
    // ...
    kotlinOptions.languageVersion = '1.9'
}
```
</tab>
</tabs>

데이터 객체에 대해 더 자세히 알아보고, [해당 KEEP 문서](https://github.com/Kotlin/KEEP/pull/316)에서 구현에 대한 피드백을 공유하세요.

### 새로운 빌더 타입 추론 제약

Kotlin 1.7.20은 코드에 영향을 줄 수 있는 [빌더 타입 추론 사용](using-builders-with-builder-inference.md)에 몇 가지 주요 제약을 둡니다. 이러한 제약은 빌더 람다(builder lambda) 함수를 포함하는 코드에 적용되며, 람다 자체를 분석하지 않고는 파라미터를 파생할 수 없는 경우입니다. 파라미터는 인수로 사용됩니다. 이제 컴파일러는 이러한 코드에 대해 항상 오류를 표시하고 타입을 명시적으로 지정하도록 요청합니다.

이는 호환성을 깨는 변경 사항이지만, 저희 연구에 따르면 이러한 경우는 매우 드물며, 제약이 코드에 영향을 미치지 않아야 합니다. 만약 영향을 받는다면, 다음 경우를 고려해 보세요:

* 멤버를 숨기는 확장을 사용하는 빌더 추론.

  코드에 빌더 추론 중에 사용될 동일한 이름의 확장 함수가 포함되어 있다면, 컴파일러는 오류를 표시합니다:

    ```kotlin
    class Data {
        fun doSmth() {} // 1
    }
    
    fun <T> T.doSmth() {} // 2
    
    fun test() {
        buildList {
            this.add(Data())
            this.get(0).doSmth() // 2로 해결되고 오류가 발생합니다.
        }
    }
    ```
    {validate="false"} 
  
  코드를 수정하려면 타입을 명시적으로 지정해야 합니다:

    ```kotlin
    class Data {
        fun doSmth() {} // 1
    }
    
    fun <T> T.doSmth() {} // 2
    
    fun test() {
        buildList<Data> { // 타입 인수!
            this.add(Data())
            this.get(0).doSmth() // 1로 해결됩니다.
        }
    }
    ```

* 여러 개의 람다와 함께 사용되는 빌더 추론에서 타입 인수가 명시적으로 지정되지 않은 경우.

  빌더 추론에 두 개 이상의 람다 블록이 있는 경우, 이들은 타입에 영향을 미칩니다. 오류를 방지하기 위해 컴파일러는 타입을 지정하도록 요구합니다:

    ```kotlin
    fun <T: Any> buildList(
        first: MutableList<T>.() -> Unit, 
        second: MutableList<T>.() -> Unit
    ): List<T> {
        val list = mutableListOf<T>()
        list.first()
        list.second()
        return list 
    }
    
    fun main() {
        buildList(
            first = { // this: MutableList<String>
                add("")
            },
            second = { // this: MutableList<Int> 
                val i: Int = get(0)
                println(i)
            }
        )
    }
    ```
    {validate="false"}

  오류를 수정하려면 타입을 명시적으로 지정하고 타입 불일치를 해결해야 합니다:

    ```kotlin
    fun main() {
        buildList<Int>(
            first = { // this: MutableList<Int>
                add(0)
            },
            second = { // this: MutableList<Int>
                val i: Int = get(0)
                println(i)
            }
        )
    }
    ```

위에 언급된 경우가 아니라면, 저희 팀에 [이슈를 제출](https://kotl.in/issue)해 주세요.

이 빌더 추론 업데이트에 대한 자세한 내용은 [이 YouTrack 이슈](https://youtrack.jetbrains.com/issue/KT-53797)를 참조하세요.

## Kotlin/JVM

Kotlin 1.7.20은 제네릭 인라인 클래스를 도입하고, 위임된 속성에 대한 바이트코드 최적화를 추가하며, kapt 스텁 생성 작업에서 IR을 지원하여 kapt를 통해 최신 Kotlin 기능을 모두 사용할 수 있도록 합니다:

* [제네릭 인라인 클래스](#generic-inline-classes)
* [더욱 최적화된 위임된 속성 사례](#more-optimized-cases-of-delegated-properties)
* [kapt 스텁 생성 작업에서 JVM IR 백엔드 지원](#support-for-the-jvm-ir-backend-in-kapt-stub-generating-task)

### 제네릭 인라인 클래스

> 제네릭 인라인 클래스는 [실험적(Experimental)](components-stability.md#stability-levels-explained) 기능입니다.
> 언제든지 삭제되거나 변경될 수 있습니다. 옵트인(Opt-in)이 필요하며(자세한 내용은 아래 참조), 평가 목적으로만 사용해야 합니다.
> [YouTrack](https://youtrack.jetbrains.com/issue/KT-52994)에 대한 피드백을 주시면 감사하겠습니다.
>
{style="warning"}

Kotlin 1.7.20은 JVM 인라인 클래스의 기본 타입을 타입 파라미터로 허용합니다. 컴파일러는 이를 `Any?` 또는 일반적으로 타입 파라미터의 상한으로 매핑합니다.

<video src="https://www.youtube.com/v/0JRPA0tt9og" title="Generic inline classes in Kotlin 1.7.20"/>

다음 예시를 고려해 보세요:

```kotlin
@JvmInline
value class UserId<T>(val value: T)

fun compute(s: UserId<String>) {} // 컴파일러는 fun compute-<hashcode>(s: Any?)를 생성합니다
```

함수는 인라인 클래스를 파라미터로 받습니다. 파라미터는 타입 인수(type argument)가 아닌 상한으로 매핑됩니다.

이 기능을 활성화하려면 `-language-version 1.8` 컴파일러 옵션을 사용하세요.

[YouTrack](https://youtrack.jetbrains.com/issue/KT-52994)에 이 기능에 대한 피드백을 주시면 감사하겠습니다.

### 더욱 최적화된 위임된 속성 사례

Kotlin 1.6.0에서는 위임된 속성 `$delegate` 필드를 생략하고 [참조된 속성에 즉시 접근](whatsnew16.md#optimize-delegated-properties-which-call-get-set-on-the-given-kproperty-instance)하도록 함으로써 속성 위임 케이스를 최적화했습니다. 1.7.20에서는 더 많은 경우에 이 최적화를 구현했습니다.
다음 경우에 `$delegate` 필드가 생략됩니다:

* 이름이 지정된 객체:

  ```kotlin
  object NamedObject {
      operator fun getValue(thisRef: Any?, property: KProperty<*>): String = ...
  }
  
  val s: String by NamedObject
  ```
  {validate="false"}

* 백킹 필드(backing field)와 동일 모듈 내 기본 게터를 가진 최종 `val` 속성:

  ```kotlin
  val impl: ReadOnlyProperty<Any?, String> = ...
  
  class A {
      val s: String by impl
  }
  ```
  {validate="false"}

* 상수 표현식, enum 엔트리, `this`, 또는 `null`. 다음은 `this`의 예시입니다:

  ```kotlin
  class A {
      operator fun getValue(thisRef: Any?, property: KProperty<*>) ...
   
      val s by this
  }
  ```
  {validate="false"}

[위임된 속성](delegated-properties.md)에 대해 자세히 알아보세요.

[YouTrack](https://youtrack.jetbrains.com/issue/KT-23397)에 이 기능에 대한 피드백을 주시면 감사하겠습니다.

### kapt 스텁 생성 작업에서 JVM IR 백엔드 지원

> kapt 스텁 생성 작업에서 JVM IR 백엔드 지원은 [실험적(Experimental)](components-stability.md) 기능입니다.
> 언제든지 변경될 수 있습니다. 옵트인(Opt-in)이 필요하며(자세한 내용은 아래 참조), 평가 목적으로만 사용해야 합니다.
>
{style="warning"}

1.7.20 이전에는 kapt 스텁 생성 작업이 이전 백엔드를 사용했으며, [반복 가능한 어노테이션(repeatable annotations)](annotations.md#repeatable-annotations)이 [kapt](kapt.md)와 함께 작동하지 않았습니다. Kotlin 1.7.20부터 kapt 스텁 생성 작업에서 [JVM IR 백엔드](whatsnew15.md#stable-jvm-ir-backend) 지원을 추가했습니다. 이를 통해 반복 가능한 어노테이션을 포함한 모든 최신 Kotlin 기능을 kapt와 함께 사용할 수 있게 됩니다.

kapt에서 IR 백엔드를 사용하려면 `gradle.properties` 파일에 다음 옵션을 추가하세요:

```none
kapt.use.jvm.ir=true
```

[YouTrack](https://youtrack.jetbrains.com/issue/KT-49682)에 이 기능에 대한 피드백을 주시면 감사하겠습니다.

## Kotlin/Native

Kotlin 1.7.20은 새로운 Kotlin/Native 메모리 관리자를 기본으로 활성화하고, `Info.plist` 파일을 사용자 지정할 수 있는 옵션을 제공합니다:

* [새로운 기본 메모리 관리자](#the-new-kotlin-native-memory-manager-enabled-by-default)
* [Info.plist 파일 사용자 지정](#customizing-the-info-plist-file)

### 새로운 Kotlin/Native 메모리 관리자가 기본적으로 활성화됩니다

이번 릴리스에서는 새로운 메모리 관리자에 대한 안정성과 성능 개선이 더욱 이루어졌으며, 이를 통해 새로운 메모리 관리자를 [베타](components-stability.md) 단계로 승격할 수 있게 되었습니다.

이전 메모리 관리자는 `kotlinx.coroutines` 라이브러리 구현 문제를 포함하여 동시성 및 비동기 코드 작성을 복잡하게 만들었습니다. 이는 동시성 제한으로 인해 iOS와 Android 플랫폼 간에 Kotlin 코드를 공유하는 데 문제가 발생하여 Kotlin Multiplatform Mobile의 채택을 막았습니다. 새로운 메모리 관리자는 마침내 [Kotlin Multiplatform Mobile을 베타로 승격](https://blog.jetbrains.com/kotlin/2022/05/kotlin-multiplatform-mobile-beta-roadmap-update/)하는 길을 열었습니다.

새로운 메모리 관리자는 컴파일 시간을 이전 릴리스와 비슷하게 만드는 컴파일러 캐시도 지원합니다. 새로운 메모리 관리자의 이점에 대한 자세한 내용은 미리 보기 버전에 대한 원래 [블로그 게시물](https://blog.jetbrains.com/kotlin/2021/08/try-the-new-kotlin-native-memory-manager-development-preview/)을 참조하세요. [문서](native-memory-manager.md)에서 더 많은 기술적인 세부 정보를 찾을 수 있습니다.

#### 구성 및 설정

Kotlin 1.7.20부터 새로운 메모리 관리자가 기본값입니다. 추가 설정은 거의 필요하지 않습니다.

이미 수동으로 활성화했다면, `gradle.properties` 파일에서 `kotlin.native.binary.memoryModel=experimental` 옵션을 제거하거나 `build.gradle(.kts)` 파일에서 `binaryOptions["memoryModel"] = "experimental"`을 제거할 수 있습니다.

필요한 경우 `gradle.properties`에서 `kotlin.native.binary.memoryModel=strict` 옵션을 사용하여 레거시 메모리 관리자로 되돌릴 수 있습니다. 하지만 레거시 메모리 관리자에서는 컴파일러 캐시 지원이 더 이상 제공되지 않으므로, 컴파일 시간이 더 길어질 수 있습니다.

#### Freezing

새로운 메모리 관리자에서는 freezing이 deprecated되었습니다. 레거시 관리자(freezing이 여전히 필요한 경우)와 코드가 작동해야 하는 경우가 아니라면 사용하지 마십시오. 이는 레거시 메모리 관리자에 대한 지원을 유지해야 하는 라이브러리 작성자나 새로운 메모리 관리자에서 문제가 발생했을 때 폴백(fallback)을 원하는 개발자에게 유용할 수 있습니다.

이러한 경우, 새로운 메모리 관리자와 레거시 메모리 관리자 모두를 위한 코드를 일시적으로 지원할 수 있습니다. deprecated 경고를 무시하려면 다음 중 하나를 수행하세요:

* deprecated API 사용에 `@OptIn(FreezingIsDeprecated::class)` 어노테이션을 추가합니다.
* Gradle의 모든 Kotlin 소스 세트에 `languageSettings.optIn("kotlin.native.FreezingIsDeprecated")`를 적용합니다.
* 컴파일러 플래그 `-opt-in=kotlin.native.FreezingIsDeprecated`를 전달합니다.

#### Swift/Objective-C에서 Kotlin `suspend` 함수 호출

새로운 메모리 관리자는 여전히 Swift 및 Objective-C에서 메인 스레드 외의 다른 스레드에서 Kotlin `suspend` 함수를 호출하는 것을 제한하지만, 새로운 Gradle 옵션을 통해 이 제한을 해제할 수 있습니다.

이 제한은 원래 코드가 원래 스레드에서 재개될 연속(continuation)을 디스패치하는 경우 때문에 레거시 메모리 관리자에서 도입되었습니다. 이 스레드가 지원되는 이벤트 루프를 가지고 있지 않으면, 작업이 결코 실행되지 않고 코루틴도 결코 재개되지 않습니다.

특정 경우에 이 제한은 더 이상 필요하지 않지만, 필요한 모든 조건을 쉽게 구현할 수는 없습니다. 이 때문에 저희는 새로운 메모리 관리자에서 이 제한을 유지하면서, 사용자가 이를 비활성화할 수 있는 옵션을 도입하기로 결정했습니다. 이를 위해 `gradle.properties`에 다음 옵션을 추가하세요:

```none
kotlin.native.binary.objcExportSuspendFunctionLaunchThreadRestriction=none
```

> `kotlinx.coroutines`의 `native-mt` 버전을 사용하거나 동일한 "원래 스레드로 디스패치" 접근 방식을 가진 다른 라이브러리를 사용하는 경우 이 옵션을 추가하지 마십시오.
>
{style="warning"}

Kotlin 팀은 이 옵션을 구현해 준 [Ahmed El-Helw](https://github.com/ahmedre)에게 매우 감사드립니다.

#### 피드백 남기기

이는 저희 생태계에 중요한 변화입니다. 더 나은 개선을 위해 피드백을 주시면 감사하겠습니다.

프로젝트에서 새로운 메모리 관리자를 사용해 보고 [이슈 트래커인 YouTrack에 피드백을 공유](https://youtrack.jetbrains.com/issue/KT-48525)해 주세요.

### `Info.plist` 파일 사용자 지정

프레임워크를 생성할 때 Kotlin/Native 컴파일러는 정보 속성 리스트 파일인 `Info.plist`를 생성합니다. 이전에는 그 내용을 사용자 지정하는 것이 번거로웠습니다. Kotlin 1.7.20부터 다음 속성을 직접 설정할 수 있습니다:

| 속성                     | 바이너리 옵션              |
|------------------------------|----------------------------|
| `CFBundleIdentifier`         | `bundleId`                 |
| `CFBundleShortVersionString` | `bundleShortVersionString` |
| `CFBundleVersion`            | `bundleVersion`            |

이렇게 하려면 해당 바이너리 옵션을 사용하세요. 필요한 프레임워크에 `-Xbinary=$option=$value` 컴파일러 플래그를 전달하거나 `binaryOption(option, value)` Gradle DSL을 설정하세요.

Kotlin 팀은 이 기능을 구현해 준 Mads Ager에게 매우 감사드립니다.

## Kotlin/JS

Kotlin/JS는 개발자 경험을 향상시키고 성능을 높이는 몇 가지 개선 사항을 받았습니다:

* Klib 생성은 종속성 로딩 효율성 개선 덕분에 증분 빌드(incremental builds)와 클린 빌드(clean builds) 모두에서 더 빨라졌습니다.
* [개발 바이너리용 증분 컴파일](js-ir-compiler.md#incremental-compilation-for-development-binaries)이 재작업되어 클린 빌드 시나리오에서 주요 개선 사항, 더 빠른 증분 빌드, 그리고 안정성 수정이 이루어졌습니다.
* 중첩 객체, 봉인된 클래스, 생성자(constructors)의 선택적 파라미터에 대한 `.d.ts` 생성을 개선했습니다.

## Gradle

Kotlin Gradle 플러그인 업데이트는 새로운 Gradle 기능 및 최신 Gradle 버전과의 호환성에 중점을 둡니다.

Kotlin 1.7.20은 Gradle 7.1을 지원하기 위한 변경 사항을 포함합니다. 더 이상 사용되지 않는(deprecated) 메서드와 속성이 제거되거나 교체되어 Kotlin Gradle 플러그인에서 발생하는 deprecated 경고 수를 줄이고 Gradle 8.0에 대한 향후 지원을 가능하게 했습니다.

하지만 주의가 필요할 수 있는 몇 가지 호환성을 깨는(breaking) 변경 사항이 있습니다:

### 타겟 구성

* `org.jetbrains.kotlin.gradle.dsl.SingleTargetExtension`은 이제 제네릭 파라미터 `SingleTargetExtension<T : KotlinTarget>`를 가집니다.
* `kotlin.targets.fromPreset()` 컨벤션은 deprecated되었습니다. 대신 `kotlin.targets { fromPreset() }`를 여전히 사용할 수 있지만, [타겟을 명시적으로 설정](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-discover-project.html#targets)하는 것을 권장합니다.
* Gradle에 의해 자동 생성된 타겟 접근자(accessors)는 더 이상 `kotlin.targets { }` 블록 내에서 사용할 수 없습니다. 대신 `findByName("targetName")` 메서드를 사용하세요.

  예를 들어, `kotlin.targets.linuxX64`와 같이 `kotlin.targets`의 경우에는 이러한 접근자가 여전히 사용 가능합니다.

### 소스 디렉토리 구성

Kotlin Gradle 플러그인은 이제 Java의 `SourceSet` 그룹에 Kotlin `SourceDirectorySet`을 `kotlin` 확장으로 추가합니다. 이를 통해 [Java, Groovy, Scala](https://docs.gradle.org/7.1/release-notes.html#easier-source-set-configuration-in-kotlin-dsl)에서 구성하는 방식과 유사하게 `build.gradle.kts` 파일에서 소스 디렉토리를 구성할 수 있습니다:

```kotlin
sourceSets {
    main {
        kotlin {
            java.setSrcDirs(listOf("src/java"))
            kotlin.setSrcDirs(listOf("src/kotlin"))
        }
    }
}
```

더 이상 deprecated된 Gradle 컨벤션을 사용하거나 Kotlin 소스 디렉토리를 지정할 필요가 없습니다.

`kotlin` 확장을 사용하여 `KotlinSourceSet`에 접근할 수도 있음을 기억하세요:

```kotlin
kotlin {
    sourceSets {
        main {
        // ...
        }
    }
}
```

### JVM 툴체인 구성용 새 메서드

이번 릴리스에서는 [JVM 툴체인 기능](gradle-configure-project.md#gradle-java-toolchains-support)을 활성화하기 위한 새로운 `jvmToolchain()` 메서드를 제공합니다. `implementation` 또는 `vendor`와 같은 추가적인 [구성 필드](https://docs.gradle.org/current/javadoc/org/gradle/jvm/toolchain/JavaToolchainSpec.html)가 필요하지 않다면, Kotlin 확장에서 이 메서드를 사용할 수 있습니다:

```kotlin
kotlin {
    jvmToolchain(17)
}
```

이는 추가 구성 없이 Kotlin 프로젝트 설정 프로세스를 간소화합니다. 이 릴리스 이전에는 다음 방식으로만 JDK 버전을 지정할 수 있었습니다:

```kotlin
kotlin {
    jvmToolchain {
        languageVersion.set(JavaLanguageVersion.of(17))
    }
}
```

## 표준 라이브러리

Kotlin 1.7.20은 `java.nio.file.Path` 클래스에 대한 새로운 [확장 함수](extensions.md#extension-functions)를 제공하여 파일 트리를 탐색할 수 있도록 합니다:

* `walk()`는 지정된 경로를 루트로 하는 파일 트리를 지연(lazily) 탐색합니다.
* `fileVisitor()`는 `FileVisitor`를 별도로 생성할 수 있게 합니다. `FileVisitor`는 디렉토리와 파일을 탐색할 때의 동작을 정의합니다.
* `visitFileTree(fileVisitor: FileVisitor, ...)`는 준비된 `FileVisitor`를 사용하고 내부적으로 `java.nio.file.Files.walkFileTree()`를 활용합니다.
* `visitFileTree(..., builderAction: FileVisitorBuilder.() -> Unit)`는 `builderAction`으로 `FileVisitor`를 생성하고 `visitFileTree(fileVisitor, ...)` 함수를 호출합니다.
* `FileVisitor`의 반환 타입인 `FileVisitResult`는 파일 처리를 계속하는 기본값 `CONTINUE`를 가집니다.

> `java.nio.file.Path`에 대한 새로운 확장 함수는 [실험적(Experimental)](components-stability.md)입니다.
> 언제든지 변경될 수 있습니다. 옵트인(Opt-in)이 필요하며(자세한 내용은 아래 참조), 평가 목적으로만 사용해야 합니다.
>
{style="warning"}

다음은 이 새로운 확장 함수로 할 수 있는 몇 가지 작업입니다:

* `FileVisitor`를 명시적으로 생성한 다음 사용:

  ```kotlin
  val cleanVisitor = fileVisitor {
      onPreVisitDirectory { directory, attributes ->
          // 디렉토리 방문 시 로직
          FileVisitResult.CONTINUE
      }
  
      onVisitFile { file, attributes ->
          // 파일 방문 시 로직
          FileVisitResult.CONTINUE
      }
  }
  
  // 여기에 로직 추가
  
  projectDirectory.visitFileTree(cleanVisitor)
  ```

* `builderAction`으로 `FileVisitor`를 생성하고 즉시 사용:

  ```kotlin
  projectDirectory.visitFileTree {
  // builderAction 정의:
      onPreVisitDirectory { directory, attributes ->
          // 디렉토리 방문 시 로직
          FileVisitResult.CONTINUE
      }
  
      onVisitFile { file, attributes ->
          // 파일 방문 시 로직
          FileVisitResult.CONTINUE
      }
  }
  ```

* `walk()` 함수를 사용하여 지정된 경로를 루트로 하는 파일 트리를 탐색:

  ```kotlin
  @OptIn(kotlin.io.path.ExperimentalPathApi::class)
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
  
          onVisitFile { file, _ ->
              if (file.extension == "class") {
                  file.deleteExisting()
              }
              FileVisitResult.CONTINUE
          }
      }
  
      val rootDirectory = createTempDirectory("Project")
  
      rootDirectory.resolve("src").let { srcDirectory ->
          srcDirectory.createDirectory()
          srcDirectory.resolve("A.kt").createFile()
          srcDirectory.resolve("A.class").createFile()
      }
  
      rootDirectory.resolve("build").let { buildDirectory ->
          buildDirectory.createDirectory()
          buildDirectory.resolve("Project.jar").createFile()
      }
  
   
  // walk 함수 사용:
      val directoryStructure = rootDirectory.walk(PathWalkOption.INCLUDE_DIRECTORIES)
          .map { it.relativeTo(rootDirectory).toString() }
          .toList().sorted()
      assertPrints(directoryStructure, "[, build, build/Project.jar, src, src/A.class, src/A.kt]")
  
      rootDirectory.visitFileTree(cleanVisitor)
  
      val directoryStructureAfterClean = rootDirectory.walk(PathWalkOption.INCLUDE_DIRECTORIES)
          .map { it.relativeTo(rootDirectory).toString() }
          .toList().sorted()
      assertPrints(directoryStructureAfterClean, "[, src, src/A.kt]")
  //sampleEnd
  }
  ```

실험적 API에 대해 일반적으로 그렇듯이, 새로운 확장은 옵트인(opt-in)이 필요합니다: `@OptIn(kotlin.io.path.ExperimentalPathApi::class)` 또는 `@kotlin.io.path.ExperimentalPathApi`. 또는 컴파일러 옵션을 사용할 수 있습니다: `-opt-in=kotlin.io.path.ExperimentalPathApi`.

[YouTrack](https://youtrack.jetbrains.com/issue/KT-52909)에서 [`walk()` 함수](https://youtrack.jetbrains.com/issue/KT-52909)와 [방문 확장 함수](https://youtrack.jetbrains.com/issue/KT-52910)에 대한 피드백을 주시면 감사하겠습니다.

## 문서 업데이트

이전 릴리스 이후로 Kotlin 문서에 몇 가지 주목할 만한 변경 사항이 있었습니다:

### 개편 및 개선된 페이지

* [기본 타입 개요](basic-types.md) – Kotlin에서 사용되는 기본 타입(숫자, 불리언, 문자, 문자열, 배열, 부호 없는 정수)에 대해 알아보세요.
* [Kotlin 개발용 IDE](kotlin-ide.md) – 공식 Kotlin 지원이 있는 IDE 목록과 커뮤니티 지원 플러그인이 있는 도구를 확인하세요.

### Kotlin Multiplatform 저널의 새로운 글

* [네이티브 및 크로스 플랫폼 앱 개발: 어떻게 선택할까?](https://www.jetbrains.com/help/kotlin-multiplatform-dev/native-and-cross-platform.html) – 크로스 플랫폼 앱 개발과 네이티브 접근 방식의 개요 및 이점을 확인하세요.
* [최고의 크로스 플랫폼 앱 개발 프레임워크 6가지](https://www.jetbrains.com/help/kotlin-multiplatform-dev/cross-platform-frameworks.html) – 크로스 플랫폼 프로젝트에 적합한 프레임워크를 선택하는 데 도움이 되는 주요 측면에 대해 읽어보세요.

### 새롭고 업데이트된 튜토리얼

* [Kotlin Multiplatform 시작하기](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-create-first-app.html) – Kotlin을 사용한 크로스 플랫폼 모바일 개발에 대해 배우고 Android와 iOS 모두에서 작동하는 앱을 만드세요.
* [React와 Kotlin/JS로 웹 애플리케이션 구축](js-react.md) – Kotlin의 DSL과 일반적인 React 프로그램의 기능을 탐색하여 브라우저 앱을 만드세요.

### 릴리스 문서의 변경 사항

더 이상 각 릴리스에 권장되는 `kotlinx` 라이브러리 목록을 제공하지 않습니다. 이 목록에는 Kotlin 자체에서 권장되고 테스트된 버전만 포함되어 있었습니다. 일부 라이브러리가 서로 의존하며 권장되는 Kotlin 버전과 다를 수 있는 특별한 `kotlinx` 버전을 요구한다는 점을 고려하지 않았습니다. 라이브러리가 어떻게 상호 연관되고 의존하는지에 대한 정보를 제공하여, 프로젝트에서 Kotlin 버전을 업그레이드할 때 어떤 `kotlinx` 라이브러리 버전을 사용해야 하는지 명확하게 알 수 있도록 노력하고 있습니다.

## Kotlin 1.7.20 설치

[IntelliJ IDEA](https://www.jetbrains.com/idea/download/) 2021.3, 2022.1, 2022.2는 Kotlin 플러그인을 1.7.20으로 자동 업데이트하도록 제안합니다.

> Android Studio Dolphin (213), Electric Eel (221), Flamingo (222)의 경우, Kotlin 플러그인 1.7.20은 예정된 Android Studio 업데이트와 함께 제공될 예정입니다.
>
{style="note"}

새로운 명령줄 컴파일러는 [GitHub 릴리스 페이지](https://github.com/JetBrains/kotlin/releases/tag/v1.7.20)에서 다운로드할 수 있습니다.

### Kotlin 1.7.20 호환성 가이드

Kotlin 1.7.20은 증분 릴리스이지만, Kotlin 1.7.0에서 도입된 문제의 확산을 제한하기 위해 호환되지 않는 변경 사항이 여전히 존재합니다.

[Kotlin 1.7.20 호환성 가이드](compatibility-guide-1720.md)에서 이러한 변경 사항에 대한 자세한 목록을 확인하세요.