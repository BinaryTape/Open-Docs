---
title: "Kotlin 1.7.20의 새로운 기능"
---
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

:::info
<p>
   Kotlin 1.7.20용 IDE 지원은 IntelliJ IDEA 2021.3, 2022.1, 2022.2에서 사용할 수 있습니다.
</p>

:::

_[출시일: 2022년 9월 29일](releases#release-details)_

Kotlin 1.7.20이 출시되었습니다! 이번 릴리스의 주요 내용은 다음과 같습니다.

* [새로운 Kotlin K2 컴파일러는 `all-open`, SAM with receiver, Lombok 및 기타 컴파일러 플러그인을 지원합니다](#support-for-kotlin-k2-compiler-plugins)
* [`..<` 연산자를 사용하여 개방형 범위를 만드는 기능의 미리보기를 도입했습니다](#preview-of-the-operator-for-creating-open-ended-ranges)
* [새로운 Kotlin/Native 메모리 관리자가 이제 기본적으로 활성화됩니다](#the-new-kotlin-native-memory-manager-enabled-by-default)
* [JVM에 대한 새로운 실험적 기능인 일반 기본 형식이 있는 inline 클래스를 도입했습니다](#generic-inline-classes)

다음 비디오에서 변경 사항에 대한 간략한 개요를 확인할 수도 있습니다.

<video src="https://www.youtube.com/v/OG9npowJgE8" title="What's new in Kotlin 1.7.20"/>

## Kotlin K2 컴파일러 플러그인 지원

Kotlin 팀은 K2 컴파일러를 계속 안정화하고 있습니다.
K2는 여전히 **Alpha** 단계에 있지만([Kotlin 1.7.0 릴리스](whatsnew17#new-kotlin-k2-compiler-for-the-jvm-in-alpha)에서 발표), 이제 여러 컴파일러 플러그인을 지원합니다.
[이 YouTrack 이슈](https://youtrack.jetbrains.com/issue/KT-52604)에서 Kotlin 팀의 새 컴파일러에 대한 업데이트를 확인할 수 있습니다.

이번 1.7.20 릴리스부터 Kotlin K2 컴파일러는 다음 플러그인을 지원합니다.

* [`all-open`](all-open-plugin)
* [`no-arg`](no-arg-plugin)
* [SAM with receiver](sam-with-receiver-plugin)
* [Lombok](lombok)
* AtomicFU
* `jvm-abi-gen`

:::note
새로운 K2 컴파일러의 Alpha 버전은 JVM 프로젝트에서만 작동합니다.
Kotlin/JS, Kotlin/Native 또는 기타 멀티 플랫폼 프로젝트는 지원하지 않습니다.

다음 비디오에서 새로운 컴파일러와 그 이점에 대해 자세히 알아보세요.
* [새로운 Kotlin 컴파일러로 가는 길](https://www.youtube.com/watch?v=iTdJJq_LyoY)
* [K2 컴파일러: 하향식 보기](https://www.youtube.com/watch?v=db19VFLZqJM)

### Kotlin K2 컴파일러를 활성화하는 방법

Kotlin K2 컴파일러를 활성화하고 테스트하려면 다음 컴파일러 옵션을 사용하세요.

```bash
-Xuse-k2
```

`build.gradle(.kts)` 파일에서 지정할 수 있습니다.

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
tasks.withType<KotlinCompile> {
    kotlinOptions.useK2 = true
}
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
compileKotlin {
    kotlinOptions.useK2 = true
}
```
</TabItem>
</Tabs>

JVM 프로젝트의 성능 향상을 확인하고 이전 컴파일러의 결과와 비교해 보세요.

### 새로운 K2 컴파일러에 대한 의견 남기기

어떤 형태든 피드백을 보내주시면 정말 감사하겠습니다.
* Kotlin Slack에서 K2 개발자에게 직접 피드백을 제공하세요. [초대 받기](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up?_gl=1*ju6cbn*_ga*MTA3MTk5NDkzMC4xNjQ2MDY3MDU4*_ga_9J976DJZ68*MTY1ODMzNzA3OS4xMDAuMS4xNjU4MzQwODEwLjYw)하고 [#k2-early-adopters](https://kotlinlang.slack.com/archives/C03PK0PE257) 채널에 참여하세요.
* 새로운 K2 컴파일러에서 발생한 문제를 [이슈 트래커](https://kotl.in/issue)에 보고하세요.
* **사용 통계 보내기** 옵션을 [활성화](https://www.jetbrains.com/help/idea/settings-usage-statistics.html)하여 JetBrains가 K2 사용에 대한 익명 데이터를 수집하도록 허용하세요.

## 언어

Kotlin 1.7.20에서는 새로운 언어 기능의 미리보기 버전을 도입하고 빌더 유형 추론에 대한 제한 사항을 적용합니다.

* [개방형 범위를 만들기 위한 ..< 연산자 미리보기](#preview-of-the-operator-for-creating-open-ended-ranges)
* [새로운 데이터 객체 선언](#improved-string-representations-for-singletons-and-sealed-class-hierarchies-with-data-objects)
* [빌더 유형 추론 제한 사항](#new-builder-type-inference-restrictions)

### 개방형 범위를 만들기 위한 ..< 연산자 미리보기

새 연산자는 [Experimental](components-stability#stability-levels-explained)이며 IDE에서 제한적으로 지원됩니다.

이번 릴리스에서는 새로운 `..<` 연산자를 도입합니다. Kotlin에는 값의 범위를 표현하는 `..` 연산자가 있습니다. 새로운 `..<`
연산자는 `until` 함수와 같이 작동하며 개방형 범위를 정의하는 데 도움이 됩니다.

<video src="https://www.youtube.com/watch?v=v0AHdAIBnbs" title="New operator for open-ended ranges"/>

연구 결과에 따르면 이 새로운 연산자는 개방형 범위를 더 잘 표현하고 상한이 포함되지 않는다는 점을 명확히 하는 데 더 효과적입니다.

다음은 `when` 표현식에서 `..<` 연산자를 사용하는 예입니다.

```kotlin
when (value) {
    in 0.0..&lt;0.25 `->` // First quarter
    in 0.25..&lt;0.5 `->` // Second quarter
    in 0.5..&lt;0.75 `->` // Third quarter
    in 0.75..1.0 `->`  // Last quarter  `<-` Note closed range here
}
```

#### 표준 라이브러리 API 변경 사항

다음의 새로운 유형 및 연산은 일반 Kotlin 표준의 `kotlin.ranges` 패키지에 도입됩니다.
라이브러리:

##### 새로운 OpenEndRange&lt;T&gt; 인터페이스

개방형 범위를 나타내는 새로운 인터페이스는 기존의 `ClosedRange<T>` 인터페이스와 매우 유사합니다.

```kotlin
interface OpenEndRange<T : Comparable<T>> {
    // Lower bound
    val start: T
    // Upper bound, not included in the range
    val endExclusive: T
    operator fun contains(value: T): Boolean = value >= start && value < endExclusive
    fun isEmpty(): Boolean = start >= endExclusive
}
```

##### 기존 반복 가능 범위에서 OpenEndRange 구현

개발자가 제외된 상한이 있는 범위를 가져와야 하는 경우 현재 `until` 함수를 사용하여 동일한 값을 가진 닫힌 반복 가능 범위를 효과적으로 생성합니다. 이러한 범위를 `OpenEndRange<T>`를 사용하는 새로운 API에서 허용되도록 하려면
기존 반복 가능 범위인 `IntRange`, `LongRange`, `CharRange`, `UIntRange`에서 해당 인터페이스를 구현하려고 합니다. 따라서 이들은 `ClosedRange<T>` 및 `OpenEndRange<T>` 인터페이스를 동시에 구현합니다.

```kotlin
class IntRange : IntProgression(...), ClosedRange<Int>, OpenEndRange<Int> {
    override val start: Int
    override val endInclusive: Int
    override val endExclusive: Int
}
```

##### 표준 유형에 대한 rangeUntil 연산자

`rangeUntil` 연산자는 현재 `rangeTo` 연산자로 정의된 동일한 유형 및 조합에 대해 제공됩니다.
프로토타입 목적으로 확장 함수로 제공하지만 일관성을 위해 개방형 범위 API를 안정화하기 전에 멤버로 만들 계획입니다.

#### ..&lt; 연산자를 활성화하는 방법

`..<` 연산자를 사용하거나 사용자 지정 유형에 대해 해당 연산자 규칙을 구현하려면 `-language-version 1.8`
컴파일러 옵션.

표준 유형의 개방형 범위 지원을 위해 도입된 새로운 API 요소는 실험적 stdlib API에 대해 일반적인 것처럼 옵트인을 요구합니다. `@OptIn(ExperimentalStdlibApi::class)`. 또는
`-opt-in=kotlin.ExperimentalStdlibApi` 컴파일러 옵션.

[이 KEEP 문서에서 새 연산자에 대해 자세히 알아보세요](https://github.com/kotlin/KEEP/blob/open-ended-ranges/proposals/open-ended-ranges).

### 데이터 객체를 사용하여 단일 항목 및 봉인된 클래스 계층 구조에 대한 향상된 문자열 표현

데이터 객체는 [Experimental](components-stability#stability-levels-explained)이며 현재 IDE에서 제한적으로 지원됩니다.

이번 릴리스에서는 사용할 수 있는 새로운 유형의 `object` 선언인 `data object`를 도입합니다. [Data object](https://youtrack.jetbrains.com/issue/KT-4107)는
일반 `object` 선언과 개념적으로 동일하게 동작하지만 기본적으로 깔끔한 `toString` 표현이 제공됩니다.

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

이렇게 하면 `data object` 선언은 `data class` 선언과 함께 사용할 수 있는 봉인된 클래스 계층 구조에 적합합니다. 이 스니펫에서 `EndOfFile`을 일반 `object` 대신 `data object`로 선언하면 수동으로 재정의할 필요 없이 보기 좋은 `toString`을 얻을 수 있으므로 첨부된 `data class` 정의와 대칭이 유지됩니다.

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

#### 데이터 객체를 활성화하는 방법

코드에서 데이터 객체 선언을 사용하려면 `-language-version 1.9` 컴파일러 옵션을 활성화하세요. Gradle 프로젝트에서는
`build.gradle(.kts)`에 다음을 추가하여 이 작업을 수행할 수 있습니다.

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
tasks.withType<org.jetbrains.kotlin.gradle.tasks.KotlinCompile>().configureEach {
    // ...
    kotlinOptions.languageVersion = "1.9"
}
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
compileKotlin {
    // ...
    kotlinOptions.languageVersion = '1.9'
}
```
</TabItem>
</Tabs>

데이터 객체에 대해 자세히 알아보고 [해당 KEEP 문서](https://github.com/Kotlin/KEEP/pull/316)에서 구현에 대한 의견을 공유하세요.

### 새로운 빌더 유형 추론 제한 사항

Kotlin 1.7.20에서는 코드에 영향을 줄 수 있는 [빌더 유형 추론 사용](using-builders-with-builder-inference)에 몇 가지 주요 제한 사항을 적용합니다. 이러한 제한 사항은 빌더 람다 함수를 포함하는 코드에 적용됩니다. 여기서 람다 자체를 분석하지 않고는 매개 변수를 파생할 수 없습니다. 매개 변수는 인수로 사용됩니다. 이제 컴파일러는 이러한 코드에 대해 항상 오류를 표시하고 유형을 명시적으로 지정하도록 요청합니다.

이는 호환성이 손상되는 변경 사항이지만 연구 결과에 따르면 이러한 경우는 매우 드물며 제한 사항이 코드에 영향을 주지 않아야 합니다. 그렇다면 다음 사항을 고려하세요.

* 멤버를 숨기는 확장을 사용하는 빌더 추론.

  코드에 빌더 추론 중에 사용될 동일한 이름을 가진 확장 함수가 포함된 경우
  컴파일러에 오류가 표시됩니다.

    ```kotlin
    class Data {
        fun doSmth() {} // 1
    }
    
    fun <T> T.doSmth() {} // 2
    
    fun test() {
        buildList {
            this.add(Data())
            this.get(0).doSmth() // Resolves to 2 and leads to error
        }
    }
    ```
     
  
  코드를 수정하려면 유형을 명시적으로 지정해야 합니다.

    ```kotlin
    class Data {
        fun doSmth() {} // 1
    }
    
    fun <T> T.doSmth() {} // 2
    
    fun test() {
        buildList<Data> { // Type argument!
            this.add(Data())
            this.get(0).doSmth() // Resolves to 1
        }
    }
    ```

* 여러 람다와 함께 빌더 추론이 사용되고 유형 인수가 명시적으로 지정되지 않은 경우.

  빌더 추론에 람다 블록이 두 개 이상 있는 경우 유형에 영향을 줍니다. 오류를 방지하기 위해 컴파일러는
  유형을 지정하도록 요구합니다.

    ```kotlin
    fun <T: Any> buildList(
        first: MutableList<T>.() `->` Unit, 
        second: MutableList<T>.() `->` Unit
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
    

  오류를 수정하려면 유형을 명시적으로 지정하고 유형 불일치를 수정해야 합니다.

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

위에 언급된 경우가 없는 경우 [이슈를 제출](https://kotl.in/issue)하세요.

이 빌더 추론 업데이트에 대한 자세한 내용은 [이 YouTrack 이슈](https://youtrack.jetbrains.com/issue/KT-53797)를 참조하세요.

## Kotlin/JVM

Kotlin 1.7.20에서는 일반 inline 클래스를 도입하고 위임된 속성에 대한 더 많은 바이트코드 최적화를 추가하며 kapt 스텁 생성 작업에서 IR을 지원하므로 kapt와 함께 최신 Kotlin 기능을 모두 사용할 수 있습니다.

* [일반 inline 클래스](#generic-inline-classes)
* [위임된 속성의 더 최적화된 경우](#more-optimized-cases-of-delegated-properties)
* [kapt 스텁 생성 작업에서 JVM IR 백엔드 지원](#support-for-the-jvm-ir-backend-in-kapt-stub-generating-task)

### 일반 inline 클래스

일반 inline 클래스는 [Experimental](components-stability#stability-levels-explained) 기능입니다.
언제든지 삭제되거나 변경될 수 있습니다. 옵트인이 필요하며(자세한 내용은 아래 참조) 평가 목적으로만 사용해야 합니다.
[YouTrack](https://youtrack.jetbrains.com/issue/KT-52994)에서 의견을 보내주시면 감사하겠습니다.

Kotlin 1.7.20에서는 JVM inline 클래스의 기본 유형이 유형 매개 변수가 될 수 있습니다. 컴파일러는 이를 `Any?` 또는
일반적으로 유형 매개 변수의 상한에 매핑합니다.

<video src="https://www.youtube.com/v/0JRPA0tt9og" title="Generic inline classes in Kotlin 1.7.20"/>

다음 예를 살펴보세요.

```kotlin
@JvmInline
value class UserId<T>(val value: T)

fun compute(s: UserId<String>) {} // Compiler generates fun compute-<hashcode>(s: Any?)
```

이 함수는 inline 클래스를 매개 변수로 허용합니다. 매개 변수는 유형 인수가 아닌 상한에 매핑됩니다.

이 기능을 활성화하려면 `-language-version 1.8` 컴파일러 옵션을 사용하세요.

[YouTrack](https://youtrack.jetbrains.com/issue/KT-52994)에서 이 기능에 대한 의견을 보내주시면 감사하겠습니다.

### 위임된 속성의 더 최적화된 경우

Kotlin 1.6.0에서는 `$delegate` 필드를 생략하고 [제공된 kproperty 인스턴스에서 get/set을 호출하는 위임된 속성을 최적화](whatsnew16#optimize-delegated-properties-which-call-get-set-on-the-given-kproperty-instance)하여 속성에 위임하는 경우를 최적화했습니다. 1.7.20에서는 더 많은 경우에 대해 이 최적화를 구현했습니다.
이제 대리자가 다음과 같은 경우 `$delegate` 필드가 생략됩니다.

* 명명된 객체:

  ```kotlin
  object NamedObject {
      operator fun getValue(thisRef: Any?, property: KProperty<*>): String = ...
  }
  
  val s: String by NamedObject
  ```
  

* [backing field](properties#backing-fields)와 동일한 모듈에서 기본 getter를 사용하는 최종 `val` 속성:

  ```kotlin
  val impl: ReadOnlyProperty<Any?, String> = ...
  
  class A {
      val s: String by impl
  }
  ```
  

* 상수 표현식, enum 항목, `this` 또는 `null`. 다음은 `this`의 예입니다.

  ```kotlin
  class A {
      operator fun getValue(thisRef: Any?, property: KProperty<*>) ...
   
      val s by this
  }
  ```
  

[위임된 속성](delegated-properties)에 대해 자세히 알아보세요.

[YouTrack](https://youtrack.jetbrains.com/issue/KT-23397)에서 이 기능에 대한 의견을 보내주시면 감사하겠습니다.

### kapt 스텁 생성 작업에서 JVM IR 백엔드 지원

kapt 스텁 생성 작업에서 JVM IR 백엔드 지원은 [Experimental](components-stability) 기능입니다.
언제든지 변경될 수 있습니다. 옵트인이 필요하며(자세한 내용은 아래 참조) 평가 목적으로만 사용해야 합니다.

1.7.20 이전에는 kapt 스텁 생성 작업에서 이전 백엔드를 사용했으며 [반복 가능한 주석](annotations#repeatable-annotations)은 [kapt](kapt)에서 작동하지 않았습니다. Kotlin 1.7.20에서는 [JVM IR 백엔드](whatsnew15#stable-jvm-ir-backend)에 대한 지원을 추가했습니다.
kapt 스텁 생성 작업에서. 이를 통해 반복 가능한 주석을 포함하여 kapt와 함께 최신 Kotlin 기능을 모두 사용할 수 있습니다.

kapt에서 IR 백엔드를 사용하려면 `gradle.properties` 파일에 다음 옵션을 추가하세요.

```none
kapt.use.jvm.ir=true
```

[YouTrack](https://youtrack.jetbrains.com/issue/KT-49682)에서 이 기능에 대한 의견을 보내주시면 감사하겠습니다.

## Kotlin/Native

Kotlin 1.7.20은 새로운 Kotlin/Native 메모리 관리자를 기본적으로 활성화하고 `Info.plist` 파일을 사용자 지정할 수 있는 옵션을 제공합니다.

* [새로운 기본 메모리 관리자](#the-new-kotlin-native-memory-manager-enabled-by-default)
* [Info.plist 파일 사용자 지정](#customizing-the-info-plist-file)

### 새로운 Kotlin/Native 메모리 관리자가 기본적으로 활성화됨

이번 릴리스에서는 새로운 메모리 관리자에 대한 안정성 및 성능이 더욱 향상되어 새로운 메모리 관리자를 [Beta](components-stability)로 승격할 수 있습니다.

이전 메모리 관리자는 `kotlinx.coroutines` 라이브러리 구현 문제를 포함하여 동시 및 비동기 코드 작성을 복잡하게 만들었습니다. 동시성 제한 사항으로 인해 iOS와 Android 플랫폼 간에 Kotlin 코드를 공유하는 데 문제가 발생했기 때문에 Kotlin Multiplatform Mobile 채택이 차단되었습니다. 새로운 메모리 관리자는 마침내 [Kotlin Multiplatform Mobile을 베타로 승격](https://blog.jetbrains.com/kotlin/2022/05/kotlin-multiplatform-mobile-beta-roadmap-update/)할 수 있는 길을 열었습니다.

새로운 메모리 관리자는 컴파일 시간을 이전 릴리스와 비슷하게 만드는 컴파일러 캐시도 지원합니다. 새로운 메모리 관리자의 이점에 대한 자세한 내용은 미리보기 버전에 대한 원래 [블로그 게시물](https://blog.jetbrains.com/kotlin/2021/08/try-the-new-kotlin-native-memory-manager-development-preview/)을 참조하세요. 자세한 기술 정보는 [설명서](native-memory-manager)에서 찾을 수 있습니다.

#### 구성 및 설정

Kotlin 1.7.20부터 새로운 메모리 관리자가 기본값입니다. 추가 설정이 많이 필요하지 않습니다.

이미 수동으로 켠 경우 `gradle.properties`에서 `kotlin.native.binary.memoryModel=experimental` 옵션 또는 `build.gradle(.kts)` 파일에서 `binaryOptions["memoryModel"] = "experimental"`을 제거할 수 있습니다.

필요한 경우 `gradle.properties`에서 `kotlin.native.binary.memoryModel=strict` 옵션을 사용하여 레거시 메모리 관리자로 다시 전환할 수 있습니다. 그러나 레거시 메모리 관리자에서는 컴파일러 캐시 지원이 더 이상 제공되지 않으므로 컴파일 시간이 더 나빠질 수 있습니다.

#### 고정

새로운 메모리 관리자에서는 고정이 더 이상 사용되지 않습니다. 코드가 레거시 관리자에서 작동해야 하는 경우가 아니면 사용하지 마세요.
(여기서 고정은 여전히 필요합니다). 이는 레거시 지원을 유지해야 하는 라이브러리 작성자 또는 새로운 메모리 관리자에서 문제가 발생하는 경우 폴백을 원하는 개발자에게 유용할 수 있습니다.

이러한 경우 새 메모리 관리자와 레거시 메모리 관리자 모두에 대한 코드를 일시적으로 지원할 수 있습니다. 더 이상 사용되지 않는 경고를 무시하려면
다음 중 하나를 수행합니다.

* 더 이상 사용되지 않는 API의 사용에 `@OptIn(FreezingIsDeprecated::class)` 주석을 추가합니다.
* `languageSettings.optIn("kotlin.native.FreezingIsDeprecated")`를 Gradle의 모든 Kotlin 소스 세트에 적용합니다.
* 컴파일러 플래그 `-opt-in=kotlin.native.FreezingIsDeprecated`를 전달합니다.

#### Swift/Objective-C에서 Kotlin 일시 중단 함수 호출

새로운 메모리 관리자는 여전히 주 스레드가 아닌 다른 스레드에서 Swift 및 Objective-C에서 Kotlin `suspend` 함수를 호출하는 것을 제한하지만 새로운 Gradle 옵션을 사용하여 해제할 수 있습니다.

이 제한은 원래 코드가 원래 스레드에서 재개되도록 연속을 디스패치하는 경우로 인해 레거시 메모리 관리자에 도입되었습니다. 이 스레드에 지원되는 이벤트 루프가 없으면 작업이 실행되지 않고 코루틴이 재개되지 않습니다.

특정 경우에는 이 제한이 더 이상 필요하지 않지만 필요한 모든 조건을 확인하는 것은 쉽지 않습니다.
이 때문에 이 기능을 비활성화할 수 있는 옵션을 도입하면서 새로운 메모리 관리자에 유지하기로 결정했습니다. 이를 위해 `gradle.properties`에 다음 옵션을 추가합니다.

```none
kotlin.native.binary.objcExportSuspendFunctionLaunchThreadRestriction=none
```

`kotlinx.coroutines`의 `native-mt` 버전 또는 동일한
"원래 스레드로 디스패치" 접근 방식.

Kotlin 팀은 이 옵션을 구현해 주신 [Ahmed El-Helw](https://github.com/ahmedre) 님께 진심으로 감사드립니다.

#### 피드백을 남겨주세요

이는 우리 생태계에 대한 중요한 변화입니다. 더 나은 제품을 만드는 데 도움이 될 수 있도록 피드백을 보내주시면 감사하겠습니다.

프로젝트에서 새로운 메모리 관리자를 사용해 보고 [문제 추적기인 YouTrack에서 피드백을 공유하세요](https://youtrack.jetbrains.com/issue/KT-48525).

### Info.plist 파일 사용자 지정

프레임워크를 생성할 때 Kotlin/Native 컴파일러는 정보 속성 목록 파일인 `Info.plist`를 생성합니다.
이전에는 해당 콘텐츠를 사용자 지정하는 것이 번거로웠습니다. Kotlin 1.7.20에서는 다음 속성을 직접 설정할 수 있습니다.

| 속성                     | 이진 옵션              |
|------------------------------|----------------------------|
| `CFBundleIdentifier`         | `bundleId`                 |
| `CFBundleShortVersionString` | `bundleShortVersionString` |
| `CFBundleVersion`            | `bundleVersion`            |

이를 수행하려면 해당 이진 옵션을 사용하세요.
필요한 프레임워크에 대해 `-Xbinary=$option=$value` 컴파일러 플래그를 전달하거나 `binaryOption(option, value)` Gradle DSL을 설정합니다.

Kotlin 팀은 이 기능을 구현해 주신 Mads Ager 님께 진심으로 감사드립니다.

## Kotlin/JS

Kotlin/JS는 개발자 경험을 개선하고 성능을 향상시키는 몇 가지 개선 사항을 받았습니다.

* 종속성 로드에 대한 효율성 개선 덕분에 Klib 생성 속도가 증분 빌드와 클린 빌드 모두에서 더 빨라졌습니다.
* [개발 이진 파일에 대한 증분 컴파일](js-ir-compiler#incremental-compilation-for-development-binaries)이
  재작업되어 클린 빌드 시나리오, 더 빠른 증분 빌드 및 안정성 수정에서 주요 개선이 이루어졌습니다.
* 중첩된 객체, 봉인된 클래스 및 생성자의 선택적 매개 변수에 대한 `.d.ts` 생성을 개선했습니다.

## Gradle

Kotlin Gradle 플러그인에 대한 업데이트는 새로운 Gradle 기능 및 최신 Gradle
버전.

Kotlin 1.7.20에는 Gradle 7.1을 지원하기 위한 변경 사항이 포함되어 있습니다. 더 이상 사용되지 않는 메서드와 속성이 제거되거나 대체되어
Kotlin Gradle 플러그인에서 생성되는 더 이상 사용되지 않는 경고 수를 줄이고 향후 Gradle 8.0 지원을 차단 해제합니다.

그러나 주의해야 할 잠재적으로 호환성이 손상되는 변경 사항이 있습니다.

### 대상 구성

* 이제 `org.jetbrains.kotlin.gradle.dsl.SingleTargetExtension`에는 일반 매개 변수 `SingleTargetExtension<T : KotlinTarget>`가 있습니다.
* `kotlin.targets.fromPreset()` 규칙은 더 이상 사용되지 않습니다. 대신 `kotlin.targets { fromPreset() }`을 계속 사용할 수 있지만
  [대상을 명시적으로 설정](multiplatform-discover-project#targets)하는 것이 좋습니다.
* Gradle에서 자동 생성된 대상 접근자는 더 이상 `kotlin.targets { }` 블록 내에서 사용할 수 없습니다. 대신 `findByName("targetName")`을 사용하세요.
  방법.

  이러한 접근자는 `kotlin.targets`의 경우(예: `kotlin.targets.linuxX64`)에는 여전히 사용할 수 있습니다.

### 소스 디렉터리 구성

이제 Kotlin Gradle 플러그인이 Kotlin `SourceDirectorySet`을 Java의 `SourceSet` 그룹에 대한 `kotlin` 확장으로 추가합니다.
이렇게 하면 [Java, Groovy 및 Scala](https://docs.gradle.org/7.1/release-notes.html#easier-source-set-configuration-in-kotlin-dsl)에서 구성되는 방식과 유사하게 `build.gradle.kts` 파일에서 소스 디렉터리를 구성할 수 있습니다.

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

더 이상 사용되지 않는 Gradle 규칙을 사용하고 Kotlin에 대한 소스 디렉터리를 지정할 필요가 없습니다.

`kotlin` 확장을 사용하여 `KotlinSourceSet`에 액세스할 수도 있습니다.

```kotlin
kotlin {
    sourceSets {
        main {
        // ...
        }
    }
}
```

### JVM 툴체인 구성을 위한 새로운 메서드

이번 릴리스에서는 [JVM 툴체인 기능](gradle-configure-project#gradle-java-toolchains-support)을 활성화하기 위한 새로운 `jvmToolchain()` 메서드를 제공합니다.
`implementation` 또는 `vendor`와 같은 추가 [구성 필드](https://docs.gradle.org/current/javadoc/org/gradle/jvm/toolchain/JavaToolchainSpec.html)가 필요하지 않은 경우 Kotlin 확장에서 이 메서드를 사용할 수 있습니다.

```kotlin
kotlin {
    jvmToolchain(17)
}
```

이렇게 하면 추가 구성 없이 Kotlin 프로젝트 설정 프로세스가 간소화됩니다.
이번 릴리스 이전에는 다음과 같은 방법으로만 JDK 버전을 지정할 수 있었습니다.

```kotlin
kotlin {
    jvmToolchain {
        languageVersion.set(JavaLanguageVersion.of(17))
    }
}
```

## 표준 라이브러리

Kotlin 1.7.20은 `java.nio.file.Path` 클래스에 대한 새로운 [확장 함수](extensions#extension-functions)를 제공합니다. 이를 통해 파일 트리를 탐색할 수 있습니다.

* `walk()`는 지정된 경로에 루트를 둔 파일 트리를 느리게 탐색합니다.
* `fileVisitor()`를 사용하면 `FileVisitor`를 별도로 만들 수 있습니다. `FileVisitor`는 디렉터리에 대한 작업을 정의합니다.
  및 파일을 탐색할 때.
* `visitFileTree(fileVisitor: FileVisitor, ...)`는 준비된 `FileVisitor`를 소비하고 `java.nio.file.Files.walkFileTree()`를 사용합니다.
  내부에서.
* `visitFileTree(..., builderAction: FileVisitorBuilder.() `->` Unit)`는 `builderAction`을 사용하여 `FileVisitor`를 만들고
  `visitFileTree(fileVisitor, ...)` 함수를 호출합니다.
* `FileVisitResult`는 `FileVisitor`의 반환 유형으로, 파일 처리를 계속하는 `CONTINUE` 기본값을 갖습니다.

`java.nio.file.Path`에 대한 새로운 확장 함수는 [Experimental](components-stability)입니다.
언제든지 변경될 수 있습니다. 옵트인이 필요하며(자세한 내용은 아래 참조) 평가 목적으로만 사용해야 합니다.

다음은 이러한 새로운 확장 함수로 수행할 수 있는 몇 가지 작업입니다.

* `FileVisitor`를 명시적으로 만든 다음 사용합니다.

  ```kotlin
  val cleanVisitor = fileVisitor {
      onPreVisitDirectory { directory, attributes `->`
          // Some logic on visiting directories
          FileVisitResult.CONTINUE
      }
  
      onVisitFile { file, attributes `->`
          // Some logic on visiting files
          FileVisitResult.CONTINUE
      }
  }
  
  // Some logic may go here
  
  projectDirectory.visitFileTree(cleanVisitor)
  ```

* `builderAction`을 사용하여 `FileVisitor`를 만들고 즉시 사용합니다.

  ```kotlin
  projectDirectory.visitFileTree {
  // Definition of the builderAction:
      onPreVisitDirectory { directory, attributes `->`
          // Some logic on visiting directories
          FileVisitResult.CONTINUE
      }
  
      onVisitFile { file, attributes `->`
          // Some logic on visiting files
          FileVisitResult.CONTINUE
      }
  }
  ```

* `walk()` 함수를 사용하여 지정된 경로에 루트를 둔 파일 트리를 탐색합니다.

  ```kotlin
  @OptIn(kotlin.io.path.ExperimentalPathApi::class)
  fun traverseFileTree() {
      val cleanVisitor = fileVisitor {
          onPreVisitDirectory { directory, _ `->`
              if (directory.name == "build") {
                  directory.toFile().deleteRecursively()
                  FileVisitResult.SKIP_SUBTREE
              } else {
                  FileVisitResult.CONTINUE
              }
          }
  
          onVisitFile { file, _ `->`
              if (file.extension == "class") {
                  file.deleteExisting()
              }
              FileVisitResult.CONTINUE
          }
      }
  
      val rootDirectory = createTempDirectory("Project")
  
      rootDirectory.resolve("src").let { srcDirectory `->`
          srcDirectory.createDirectory()
          srcDirectory.resolve("A.kt").createFile()
          srcDirectory.resolve("A.class").createFile()
      }
  
      rootDirectory.resolve("build").let { buildDirectory `->`
          buildDirectory.createDirectory()
          buildDirectory.resolve("Project.jar").createFile()
      }
  
   
  // Use walk function:
      val directoryStructure = rootDirectory.walk(PathWalkOption.INCLUDE_DIRECTORIES)
          .map { it.relativeTo(rootDirectory).toString() }
          .toList().sorted()
      assertPrints(directoryStructure, "[, build, build/Project.jar, src, src/A.class, src/A.kt]")
  
      rootDirectory.visitFileTree(cleanVisitor)
  
      val directoryStructureAfterClean = rootDirectory.walk(PathWalkOption.INCLUDE_DIRECTORIES)
          .map { it.relativeTo(rootDirectory).toString() }
          .toList().sorted()
      assertPrints(directoryStructureAfterClean, "[, src, src/A.kt]")

  }
  ```

실험적 API에 대한 일반적인 것처럼 새로운 확장은 `@OptIn(kotlin.io.path.ExperimentalPathApi::class)`
또는 `@kotlin.io.path.ExperimentalPathApi`. 또는 컴파일러 옵션 `-opt-in=kotlin.io.path.ExperimentalPathApi`를 사용할 수 있습니다.

[YouTrack](https://youtrack.jetbrains.com/issue/KT-52909)의 [`walk()` 함수](https://youtrack.jetbrains.com/issue/KT-52910) 및
[방문 확장 함수](https://youtrack.jetbrains.com/issue/KT-52910)에 대한 의견을 보내주시면 감사하겠습니다.

## 문서 업데이트

이전