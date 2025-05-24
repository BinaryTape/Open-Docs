---
title: "Kotlin 1.4.30의 새로운 기능"
---
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

_[릴리스 날짜: 2021년 2월 3일](releases#release-details)_

Kotlin 1.4.30은 새로운 언어 기능의 미리 보기 버전을 제공하고, Kotlin/JVM 컴파일러의 새로운 IR 백엔드를
베타로 승격하며, 다양한 성능 및 기능 개선 사항을 제공합니다.

[이 블로그 게시물](https://blog.jetbrains.com/kotlin/2021/01/kotlin-1-4-30-released/)에서 새로운 기능에 대해 자세히 알아볼 수도 있습니다.

## 언어 기능

Kotlin 1.5.0은 새로운 언어 기능인 JVM 레코드 지원, sealed interface, 안정적인 inline class를 제공할 예정입니다.
Kotlin 1.4.30에서는 이러한 기능 및 개선 사항을 미리 보기 모드에서 사용해 볼 수 있습니다.
해당 YouTrack 티켓에서 피드백을 공유해 주시면 1.5.0 릴리스 전에 문제를 해결하는 데 도움이 되므로 매우 감사하겠습니다.

* [JVM 레코드 지원](#jvm-records-support)
* [Sealed interface](#sealed-interfaces) 및 [sealed class 개선 사항](#package-wide-sealed-class-hierarchies)
* [향상된 inline class](#improved-inline-classes)

미리 보기 모드에서 이러한 언어 기능 및 개선 사항을 활성화하려면 특정 컴파일러 옵션을 추가하여 옵트인해야 합니다.
자세한 내용은 아래 섹션을 참조하세요.

[이 블로그 게시물](https://blog.jetbrains.com/kotlin/2021/01/new-language-features-preview-in-kotlin-1-4-30)에서 새로운 기능 미리 보기에 대해 자세히 알아보세요.

### JVM 레코드 지원

:::note
JVM 레코드 기능은 [Experimental](components-stability)입니다. 언제든지 삭제되거나 변경될 수 있습니다.
옵트인이 필요하며(자세한 내용은 아래 참조), 평가 목적으로만 사용해야 합니다. [YouTrack](https://youtrack.jetbrains.com/issue/KT-42430)에서 피드백을 보내주시면 감사하겠습니다.

[JDK 16 릴리스](https://openjdk.java.net/projects/jdk/16/)에는 새로운 Java 클래스 유형인
[record](https://openjdk.java.net/jeps/395)를 안정화하려는 계획이 포함되어 있습니다. Kotlin의 모든 이점을 제공하고 Java와의 상호 운용성을 유지하기 위해 Kotlin은 실험적인 레코드 클래스 지원을 도입하고 있습니다.

Java에서 선언된 레코드 클래스를 Kotlin의 속성이 있는 클래스처럼 사용할 수 있습니다. 추가 단계는 필요하지 않습니다.

1.4.30부터는 [데이터 클래스](data-classes)에 대해 `@JvmRecord` 어노테이션을 사용하여 Kotlin에서 레코드 클래스를 선언할 수 있습니다.

```kotlin
@JvmRecord
data class User(val name: String, val age: Int)
```

JVM 레코드의 미리 보기 버전을 사용해 보려면 컴파일러 옵션 `-Xjvm-enable-preview` 및 `-language-version 1.5`를 추가하세요.

JVM 레코드 지원을 계속 개선하고 있으며, [이 YouTrack 티켓](https://youtrack.jetbrains.com/issue/KT-42430)을 사용하여 피드백을 공유해 주시면 매우 감사하겠습니다.

구현, 제한 사항 및 구문에 대한 자세한 내용은 [KEEP](https://github.com/Kotlin/KEEP/blob/master/proposals/jvm-records)을 참조하세요.

### Sealed interface

Sealed interface는 [Experimental](components-stability)입니다. 언제든지 삭제되거나 변경될 수 있습니다.
옵트인이 필요하며(자세한 내용은 아래 참조), 평가 목적으로만 사용해야 합니다. [YouTrack](https://youtrack.jetbrains.com/issue/KT-42433)에서 피드백을 보내주시면 감사하겠습니다.

Kotlin 1.4.30에서는 _sealed interface_의 프로토타입을 제공합니다. 이는 sealed class를 보완하고 보다 유연한 제한된 클래스 계층 구조를 구축할 수 있도록 합니다.

이는 동일한 모듈 외부에서 구현할 수 없는 "내부" 인터페이스 역할을 할 수 있습니다. 예를 들어, 이를 통해 완전한 `when` 식을 작성할 수 있습니다.

```kotlin
sealed interface Polygon

class Rectangle(): Polygon
class Triangle(): Polygon

// when()이 완전합니다. 모듈이 컴파일된 후 다른 polygon 구현이 나타날 수 없습니다.
fun draw(polygon: Polygon) = when (polygon) {
    is Rectangle `->` // ...
    is Triangle `->` // ...
}

```

또 다른 사용 사례: sealed interface를 사용하면 클래스가 둘 이상의 sealed 슈퍼클래스에서 상속될 수 있습니다.

```kotlin
sealed interface Fillable {
   fun fill()
}
sealed interface Polygon {
   val vertices: List<Point>
}

class Rectangle(override val vertices: List<Point>): Fillable, Polygon {
   override fun fill() { /*...*/ }
}
```

sealed interface의 미리 보기 버전을 사용해 보려면 컴파일러 옵션 `-language-version 1.5`를 추가하세요. 이 버전으로 전환하면 인터페이스에서 `sealed` 수정자를 사용할 수 있습니다. [이 YouTrack 티켓](https://youtrack.jetbrains.com/issue/KT-42433)을 사용하여 피드백을 공유해 주시면 매우 감사하겠습니다.

[sealed interface에 대해 자세히 알아보세요](sealed-classes).

### 패키지 전체 sealed class 계층 구조

패키지 전체 sealed class 계층 구조는 [Experimental](components-stability)입니다. 언제든지 삭제되거나 변경될 수 있습니다.
옵트인이 필요하며(자세한 내용은 아래 참조), 평가 목적으로만 사용해야 합니다. [YouTrack](https://youtrack.jetbrains.com/issue/KT-42433)에서 피드백을 보내주시면 감사하겠습니다.

이제 sealed class는 보다 유연한 계층 구조를 형성할 수 있습니다. 동일한 컴파일 단위 및 동일한 패키지의 모든 파일에 서브클래스가 있을 수 있습니다. 이전에는 모든 서브클래스가 동일한 파일에 나타나야 했습니다.

직접 서브클래스는 최상위 수준이거나 다른 명명된 클래스, 명명된 인터페이스 또는 명명된 객체 내에 여러 번 중첩될 수 있습니다. sealed class의 서브클래스는 올바르게 정규화된 이름을 가져야 합니다. 로컬 객체 또는 익명 객체일 수 없습니다.

패키지 전체 sealed class 계층 구조를 사용해 보려면 컴파일러 옵션 `-language-version 1.5`를 추가하세요. [이 YouTrack 티켓](https://youtrack.jetbrains.com/issue/KT-42433)을 사용하여 피드백을 공유해 주시면 매우 감사하겠습니다.

[패키지 전체 sealed class 계층 구조에 대해 자세히 알아보세요](sealed-classes#inheritance).

### 향상된 inline class

Inline value class는 [베타](components-stability)에 있습니다. 거의 안정적이지만 향후 마이그레이션 단계가 필요할 수 있습니다. 변경해야 하는 사항을 최소화하기 위해 최선을 다하겠습니다. [YouTrack](https://youtrack.jetbrains.com/issue/KT-42434)에서 inline class 기능에 대한 피드백을 보내주시면 감사하겠습니다.

Kotlin 1.4.30은 [inline class](inline-classes)를 [베타](components-stability)로 승격하고 다음과 같은 기능 및 개선 사항을 제공합니다.

* inline class는 [값 기반](https://docs.oracle.com/en/java/javase/15/docs/api/java.base/java/lang/doc-files/ValueBased.html)이므로
  `value` 수정자를 사용하여 정의할 수 있습니다. 이제 `inline` 및 `value` 수정자는 서로 동일합니다.
  향후 Kotlin 버전에서는 `inline` 수정자를 더 이상 사용하지 않을 계획입니다.

  이제 Kotlin은 JVM 백엔드에 대한 클래스 선언 전에 `@JvmInline` 어노테이션을 요구합니다.
  
  ```kotlin
  inline class Name(private val s: String)
  
  value class Name(private val s: String)
  
  // JVM 백엔드의 경우
  @JvmInline
  value class Name(private val s: String)
  ```

* Inline class에는 `init` 블록이 있을 수 있습니다. 클래스가 인스턴스화된 직후에 실행할 코드를 추가할 수 있습니다.
  
  ```kotlin
  @JvmInline
  value class Negative(val x: Int) {
    init {
        require(x < 0) { }
    }
  }
  ```

* Java 코드에서 inline class로 함수 호출: Kotlin 1.4.30 이전에는 맹글링 때문에 Java에서 inline class를 수락하는 함수를 호출할 수 없었습니다.
  이제 맹글링을 수동으로 비활성화할 수 있습니다. Java 코드에서 이러한 함수를 호출하려면 함수 선언 전에 `@JvmName` 어노테이션을 추가해야 합니다.

  ```kotlin
  inline class UInt(val x: Int)
  
  fun compute(x: Int) { }
  
  @JvmName("computeUInt")
  fun compute(x: UInt) { }
  ```

* 이번 릴리스에서는 잘못된 동작을 수정하기 위해 함수에 대한 맹글링 체계를 변경했습니다. 이러한 변경으로 인해 ABI
  변경이 발생했습니다.

  1.4.30부터 Kotlin 컴파일러는 기본적으로 새로운 맹글링 체계를 사용합니다. 컴파일러가 이전 1.4.0 맹글링 체계를 사용하도록 강제하고 바이너리 호환성을 유지하려면 `-Xuse-14-inline-classes-mangling-scheme`
  컴파일러 플래그를 사용하세요.

Kotlin 1.4.30은 inline class를 베타로 승격하고 향후 릴리스에서 안정화할 계획입니다. [이 YouTrack 티켓](https://youtrack.jetbrains.com/issue/KT-42434)을 사용하여 피드백을 공유해 주시면 매우 감사하겠습니다.

inline class의 미리 보기 버전을 사용해 보려면 컴파일러 옵션 `-Xinline-classes` 또는 `-language-version 1.5`를 추가하세요.

맹글링 알고리즘에 대한 자세한 내용은 [KEEP](https://github.com/Kotlin/KEEP/blob/master/proposals/inline-classes)을 참조하세요.

[inline class에 대해 자세히 알아보세요](inline-classes).

## Kotlin/JVM

### JVM IR 컴파일러 백엔드가 베타에 도달했습니다.

Kotlin/JVM용 [IR 기반 컴파일러 백엔드](whatsnew14#unified-backends-and-extensibility)는
1.4.0에서 [알파](components-stability)로 제공되었으며 베타에 도달했습니다. 이는 IR 백엔드가
Kotlin/JVM 컴파일러의 기본값이 되기 전의 마지막 사전 안정 수준입니다.

이제 IR 컴파일러에서 생성된 바이너리 소비에 대한 제한을 제거합니다. 이전에는 새 JVM IR 백엔드를 활성화한 경우에만 새 JVM IR 백엔드로 컴파일된 코드를 사용할 수 있었습니다. 1.4.30부터는 이러한 제한이 없으므로 새 백엔드를 사용하여 라이브러리와 같은 타사 사용을 위한 구성 요소를 빌드할 수 있습니다. 새 백엔드의 베타 버전을 사용해 보고 [문제 추적기](https://kotl.in/issue)에서 피드백을 공유해 주세요.

새 JVM IR 백엔드를 활성화하려면 프로젝트의 구성 파일에 다음 줄을 추가하세요.
* Gradle에서:

  <Tabs groupId="build-script">
  <TabItem value="kotlin" label="Kotlin" default>

  ```kotlin
  tasks.withType(org.jetbrains.kotlin.gradle.dsl.KotlinJvmCompile::class) {
    kotlinOptions.useIR = true
  }
  ```
  
  </TabItem>
  <TabItem value="groovy" label="Groovy" default>
  
  ```groovy
  tasks.withType(org.jetbrains.kotlin.gradle.dsl.KotlinJvmCompile) {
    kotlinOptions.useIR = true
  }
  ```

  </TabItem>
  </Tabs>

* Maven에서:

  ```xml
  <configuration>
      <args>
          <arg>-Xuse-ir</arg>
      </args>
  </configuration>
  ```

JVM IR 백엔드가 제공하는 변경 사항에 대한 자세한 내용은 [이 블로그 게시물](https://blog.jetbrains.com/kotlin/2021/01/the-jvm-backend-is-in-beta-let-s-make-it-stable-together)을 참조하세요.

## Kotlin/Native

### 성능 향상

Kotlin/Native는 1.4.30에서 다양한 성능 향상을 받았으며, 그 결과 컴파일 시간이 빨라졌습니다.
예를 들어, [Kotlin Multiplatform Mobile을 사용한 네트워킹 및 데이터 스토리지](https://github.com/kotlin-hands-on/kmm-networking-and-data-storage/tree/final)에서 프레임워크를 다시 빌드하는 데 필요한 시간이
샘플이 9.5초(1.4.10)에서 4.5초(1.4.30)로 줄었습니다.

### Apple watchOS 64비트 시뮬레이터 대상

x86 시뮬레이터 대상은 버전 7.0부터 watchOS에서 더 이상 사용되지 않습니다. 최신 watchOS 버전을 유지하기 위해
Kotlin/Native에는 64비트 아키텍처에서 시뮬레이터를 실행하기 위한 새로운 대상 `watchosX64`가 있습니다.

### Xcode 12.2 라이브러리 지원

Xcode 12.2와 함께 제공되는 새로운 라이브러리에 대한 지원을 추가했습니다. 이제 Kotlin 코드에서 사용할 수 있습니다.

## Kotlin/JS

### 최상위 수준 속성의 지연 초기화

최상위 수준 속성의 지연 초기화는 [Experimental](components-stability)입니다. 언제든지 삭제되거나 변경될 수 있습니다.
옵트인이 필요하며(자세한 내용은 아래 참조), 평가 목적으로만 사용해야 합니다. [YouTrack](https://youtrack.jetbrains.com/issue/KT-44320)에서 피드백을 보내주시면 감사하겠습니다.

Kotlin/JS용 [IR 백엔드](js-ir-compiler)는
최상위 수준 속성에 대한 지연 초기화의 프로토타입 구현을 받고 있습니다. 이렇게 하면 애플리케이션이 시작될 때 모든 최상위 수준 속성을 초기화할 필요성이 줄어들고
애플리케이션 시작 시간이 크게 향상됩니다.

지연 초기화를 계속 개선할 예정이며 현재 프로토타입을 사용해 보고 생각과
결과를 [이 YouTrack 티켓](https://youtrack.jetbrains.com/issue/KT-44320) 또는 공식 [Kotlin Slack](https://kotlinlang.slack.com)의 [`#javascript`](https://kotlinlang.slack.com/archives/C0B8L3U69)
채널에서 공유해 주시기 바랍니다(여기에서 초대장을 받으세요 [여기](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up)).

지연 초기화를 사용하려면 JS IR 컴파일러로 코드를 컴파일할 때 `-Xir-property-lazy-initialization` 컴파일러 옵션을 추가하세요.

## Gradle 프로젝트 개선 사항

### Gradle 구성 캐시 지원

1.4.30부터 Kotlin Gradle 플러그인은 [구성 캐시](https://docs.gradle.org/current/userguide/configuration_cache.html)
기능을 지원합니다. 이를 통해 빌드 프로세스 속도가 향상됩니다. 명령을 실행하면 Gradle은 구성 단계를 실행하고
작업 그래프를 계산합니다. Gradle은 결과를 캐시하고 후속 빌드에 재사용합니다.

이 기능을 사용하려면 [Gradle 명령을 사용](https://docs.gradle.org/current/userguide/configuration_cache.html#config_cache:usage)하거나
[IntelliJ 기반 IDE를 설정]( https://docs.gradle.org/current/userguide/configuration_cache.html#config_cache:ide:intellij)할 수 있습니다.

## 표준 라이브러리

### 텍스트의 대/소문자 변경을 위한 로캘 독립적 API

로캘 독립적 API 기능은 [Experimental](components-stability)입니다. 언제든지 삭제되거나 변경될 수 있습니다.
평가 목적으로만 사용하세요.
[YouTrack](https://youtrack.jetbrains.com/issue/KT-42437)에서 피드백을 보내주시면 감사하겠습니다.

이번 릴리스에서는 문자열 및 문자의 대/소문자를 변경하기 위한 실험적인 로캘 독립적 API를 소개합니다.
현재 `toLowerCase()`, `toUpperCase()`, `capitalize()`, `decapitalize()` API 함수는 로캘에 민감합니다.
즉, 다른 플랫폼 로캘 설정이 코드 동작에 영향을 줄 수 있습니다. 예를 들어, 터키어 로캘에서
문자열 "kotlin"이 `toUpperCase`를 사용하여 변환되면 결과는 "KOTLİN"이 아니라 "KOTLIN"입니다.

```kotlin
// 현재 API
println("Needs to be capitalized".toUpperCase()) // NEEDS TO BE CAPITALIZED

// 새로운 API
println("Needs to be capitalized".uppercase()) // NEEDS TO BE CAPITALIZED
```

Kotlin 1.4.30은 다음과 같은 대안을 제공합니다.

* `String` 함수의 경우:

  |**이전 버전**|**1.4.30 대안**| 
  | --- | --- |
  |`String.toUpperCase()`|`String.uppercase()`|
  |`String.toLowerCase()`|`String.lowercase()`|
  |`String.capitalize()`|`String.replaceFirstChar { it.uppercase() }`|
  |`String.decapitalize()`|`String.replaceFirstChar { it.lowercase() }`|

* `Char` 함수의 경우:

  |**이전 버전**|**1.4.30 대안**| 
  | --- | --- |
  |`Char.toUpperCase()`|`Char.uppercaseChar(): Char`<br/>`Char.uppercase(): String`|
  |`Char.toLowerCase()`|`Char.lowercaseChar(): Char`<br/>`Char.lowercase(): String`|
  |`Char.toTitleCase()`|`Char.titlecaseChar(): Char`<br/>`Char.titlecase(): String`|

Kotlin/JVM의 경우 명시적인
`Locale` 매개변수가 있는 오버로드된 `uppercase()`, `lowercase()`, `titlecase()` 함수도 있습니다.

:::

[KEEP](https://github.com/Kotlin/KEEP/blob/master/proposals/stdlib/locale-agnostic-string-conversions)에서 텍스트 처리 함수에 대한 전체 변경 목록을 확인하세요.

### Char-to-code 및 Char-to-digit 변환 지우기

:::note
`Char` 변환 기능에 대한 명확한 API는 [Experimental](components-stability)입니다. 언제든지 삭제되거나 변경될 수 있습니다.
평가 목적으로만 사용하세요.
[YouTrack](https://youtrack.jetbrains.com/issue/KT-44333)에서 피드백을 보내주시면 감사하겠습니다.

서로 다른 숫자 유형으로 표현된 UTF-16 코드를 반환하는 현재 `Char`에서 숫자 변환 함수는
문자열의 숫자 값을 반환하는 유사한 String-to-Int 변환과 혼동되는 경우가 많습니다.

```kotlin
"4".toInt() // 4를 반환합니다.
'4'.toInt() // 52를 반환합니다.
// 그리고 Char '4'에 대해 숫자 값 4를 반환하는 공통 함수는 없었습니다.
```

이러한 혼동을 피하기 위해 `Char` 변환을 다음과 같이 명확하게 명명된 두 세트의 함수로 분리하기로 결정했습니다.

* `Char`의 정수 코드를 가져오고 주어진 코드에서 `Char`를 구성하는 함수:
 
  ```kotlin
  fun Char(code: Int): Char
  fun Char(code: UShort): Char
  val Char.code: Int
  ```

* `Char`를 나타내는 숫자의 숫자 값으로 변환하는 함수:

  ```kotlin
  fun Char.digitToInt(radix: Int): Int
  fun Char.digitToIntOrNull(radix: Int): Int?
  ```
* 해당 `Char`
  표현으로 나타내는 음수가 아닌 한 자리 숫자를 변환하기 위한 `Int`의 확장 함수:

  ```kotlin
  fun Int.digitToChar(radix: Int): Char
  ```

자세한 내용은 [KEEP](https://github.com/Kotlin/KEEP/blob/master/proposals/stdlib/char-int-conversions)에서 확인하세요.

## 직렬화 업데이트

Kotlin 1.4.30과 함께 `kotlinx.serialization` [1.1.0-RC](https://github.com/Kotlin/kotlinx.serialization/releases/tag/v1.1.0-RC)를 릴리스하고 있으며, 여기에는 다음과 같은 새로운 기능이 포함되어 있습니다.

* Inline class 직렬화 지원
* 부호 없는 기본 유형 직렬화 지원

### Inline class 직렬화 지원

Kotlin 1.4.30부터 inline class를 [직렬화](serialization)할 수 있습니다.

```kotlin
@Serializable
inline class Color(val rgb: Int)
```

이 기능을 사용하려면 새로운 1.4.30 IR 컴파일러가 필요합니다.

:::

직렬화 프레임워크는 다른 직렬화 가능한 클래스에서 사용될 때 직렬화 가능한 inline class를 박싱하지 않습니다.

자세한 내용은 `kotlinx.serialization` [문서](https://github.com/Kotlin/kotlinx.serialization/blob/master/docs/inline-classes#serializable-inline-classes)에서 확인하세요.

### 부호 없는 기본 유형 직렬화 지원

1.4.30부터 [kotlinx.serialization](https://github.com/Kotlin/kotlinx.serialization)의 표준 JSON 직렬화기를 사용할 수 있습니다.
부호 없는 기본 유형: `UInt`, `ULong`, `UByte` 및 `UShort`:

```kotlin
@Serializable
class Counter(val counted: UByte, val description: String)
fun main() {
   val counted = 239.toUByte()
   println(Json.encodeToString(Counter(counted, "tries")))
}
```

자세한 내용은 `kotlinx.serialization` [문서](https://github.com/Kotlin/kotlinx.serialization/blob/master/docs/inline-classes#unsigned-types-support-json-only)에서 확인하세요.

  ```