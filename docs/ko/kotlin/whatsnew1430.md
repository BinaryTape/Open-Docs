[//]: # (title: Kotlin 1.4.30의 새로운 기능)

_[출시일: 2021년 2월 3일](releases.md#release-details)_

Kotlin 1.4.30은 새로운 언어 기능의 프리뷰 버전을 제공하고, Kotlin/JVM 컴파일러의 새로운 IR 백엔드를 베타로 승격하며, 다양한 성능 및 기능 개선 사항을 포함합니다.

새로운 기능에 대한 자세한 내용은 [이 블로그 게시물](https://blog.jetbrains.com/kotlin/2021/02/kotlin-1-4-30-released/)에서도 확인할 수 있습니다.

## 언어 기능

Kotlin 1.5.0에서는 JVM 레코드 지원, 봉인된 인터페이스(sealed interfaces), 안정적인 인라인 클래스(Stable inline classes) 등 새로운 언어 기능이 제공될 예정입니다. Kotlin 1.4.30에서는 이러한 기능 및 개선 사항을 프리뷰 모드에서 사용해 볼 수 있습니다. 1.5.0 릴리스 전에 저희가 피드백을 반영할 수 있도록 해당 YouTrack 티켓에 의견을 공유해 주시면 감사하겠습니다.

*   [JVM 레코드 지원](#jvm-records-support)
*   [봉인된 인터페이스](#sealed-interfaces) 및 [봉인된 클래스 개선 사항](#package-wide-sealed-class-hierarchies)
*   [개선된 인라인 클래스](#improved-inline-classes)

프리뷰 모드에서 이러한 언어 기능 및 개선 사항을 활성화하려면 특정 컴파일러 옵션을 추가하여 옵트인(opt-in)해야 합니다. 자세한 내용은 아래 섹션을 참조하세요.

새로운 기능 프리뷰에 대한 자세한 내용은 [이 블로그 게시물](https://blog.jetbrains.com/kotlin/2021/02/new-language-features-preview-in-kotlin-1-4-30/)에서 확인할 수 있습니다.

### JVM 레코드 지원

> JVM 레코드 기능은 [실험적(Experimental)](components-stability.md)입니다. 이 기능은 언제든지 제거되거나 변경될 수 있습니다. 옵트인(opt-in)이 필요하며(자세한 내용은 아래 참조), 평가 목적으로만 사용해야 합니다. [YouTrack](https://youtrack.jetbrains.com/issue/KT-42430)을 통해 피드백을 주시면 감사하겠습니다.
>
{style="warning"}

[JDK 16 릴리스](https://openjdk.java.net/projects/jdk/16/)에는 [레코드(record)](https://openjdk.java.net/jeps/395)라는 새로운 Java 클래스 유형을 안정화하려는 계획이 포함되어 있습니다. Kotlin의 모든 이점을 제공하고 Java와의 상호 운용성을 유지하기 위해 Kotlin은 실험적인 레코드 클래스 지원을 도입하고 있습니다.

Java에서 선언된 레코드 클래스는 Kotlin의 속성을 가진 클래스처럼 사용할 수 있습니다. 추가 단계는 필요하지 않습니다.

1.4.30부터는 [데이터 클래스](data-classes.md)에 `@JvmRecord` 어노테이션을 사용하여 Kotlin에서 레코드 클래스를 선언할 수 있습니다.

```kotlin
@JvmRecord
data class User(val name: String, val age: Int)
```

JVM 레코드의 프리뷰 버전을 사용해 보려면 컴파일러 옵션 `-Xjvm-enable-preview`와 `-language-version 1.5`를 추가하세요.

저희는 JVM 레코드 지원 작업을 계속하고 있으며, 이 [YouTrack 티켓](https://youtrack.jetbrains.com/issue/KT-42430)을 통해 피드백을 공유해 주시면 감사하겠습니다.

구현, 제한 사항 및 구문에 대한 자세한 내용은 [KEEP](https://github.com/Kotlin/KEEP/blob/master/proposals/jvm-records.md)에서 확인할 수 있습니다.

### 봉인된 인터페이스

> 봉인된 인터페이스는 [실험적(Experimental)](components-stability.md)입니다. 이 기능은 언제든지 제거되거나 변경될 수 있습니다. 옵트인(opt-in)이 필요하며(자세한 내용은 아래 참조), 평가 목적으로만 사용해야 합니다. [YouTrack](https://youtrack.jetbrains.com/issue/KT-42433)을 통해 피드백을 주시면 감사하겠습니다.
>
{style="warning"}

Kotlin 1.4.30에서는 _봉인된 인터페이스(sealed interfaces)_의 프로토타입을 제공합니다. 이는 봉인된 클래스(sealed classes)를 보완하고 더욱 유연한 제한된 클래스 계층 구조를 구축할 수 있도록 합니다.

봉인된 인터페이스는 동일한 모듈 외부에서는 구현할 수 없는 "내부" 인터페이스 역할을 할 수 있습니다. 예를 들어, 완전한 `when` 표현식을 작성할 때 이 사실을 활용할 수 있습니다.

```kotlin
sealed interface Polygon

class Rectangle(): Polygon
class Triangle(): Polygon

// when()은 완전합니다: 모듈 컴파일 후에는 다른 Polygon 구현이 나타날 수 없습니다.
fun draw(polygon: Polygon) = when (polygon) {
    is Rectangle -> // ...
    is Triangle -> // ...
}

```

또 다른 사용 사례: 봉인된 인터페이스를 사용하면 하나 이상의 봉인된 슈퍼클래스(sealed superclasses)로부터 클래스를 상속할 수 있습니다.

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

봉인된 인터페이스의 프리뷰 버전을 사용해 보려면 컴파일러 옵션 `-language-version 1.5`를 추가하세요. 이 버전으로 전환하면 인터페이스에 `sealed` 수식어를 사용할 수 있습니다. 이 [YouTrack 티켓](https://youtrack.jetbrains.com/issue/KT-42433)을 통해 피드백을 공유해 주시면 감사하겠습니다.

[봉인된 인터페이스에 대해 자세히 알아보기](sealed-classes.md).

### 패키지 전체에 적용되는 봉인된 클래스 계층 구조

> 패키지 전체에 적용되는 봉인된 클래스 계층 구조는 [실험적(Experimental)](components-stability.md)입니다. 이 기능은 언제든지 제거되거나 변경될 수 있습니다. 옵트인(opt-in)이 필요하며(자세한 내용은 아래 참조), 평가 목적으로만 사용해야 합니다. [YouTrack](https://youtrack.jetbrains.com/issue/KT-42433)을 통해 피드백을 주시면 감사하겠습니다.
>
{style="warning"}

이제 봉인된 클래스는 더욱 유연한 계층 구조를 형성할 수 있습니다. 동일한 컴파일 단위 및 동일한 패키지의 모든 파일에 서브클래스를 가질 수 있습니다. 이전에는 모든 서브클래스가 동일한 파일에 있어야 했습니다.

직접적인 서브클래스는 최상위 수준이거나 다른 명명된 클래스, 명명된 인터페이스 또는 명명된 객체 안에 중첩될 수 있습니다. 봉인된 클래스의 서브클래스는 적절히 한정된 이름을 가져야 하며, 로컬 객체 또는 익명 객체일 수 없습니다.

패키지 전체에 적용되는 봉인된 클래스 계층 구조를 사용해 보려면 컴파일러 옵션 `-language-version 1.5`를 추가하세요. 이 [YouTrack 티켓](https://youtrack.jetbrains.com/issue/KT-42433)을 통해 피드백을 공유해 주시면 감사하겠습니다.

[패키지 전체에 적용되는 봉인된 클래스 계층 구조에 대해 자세히 알아보기](sealed-classes.md#inheritance).

### 개선된 인라인 클래스

> 인라인 값 클래스는 [베타(Beta)](components-stability.md)입니다. 거의 안정적이지만, 향후 마이그레이션 단계가 필요할 수 있습니다. 변경 사항을 최소화하기 위해 최선을 다할 것입니다. 인라인 클래스 기능에 대한 피드백을 [YouTrack](https://youtrack.jetbrains.com/issue/KT-42434)을 통해 주시면 감사하겠습니다.
>
{style="warning"}

Kotlin 1.4.30은 [인라인 클래스](inline-classes.md)를 [베타](components-stability.md)로 승격하고 다음과 같은 기능 및 개선 사항을 제공합니다.

*   인라인 클래스는 [값 기반(value-based)](https://docs.oracle.com/en/java/javase/15/docs/api/java.base/java/lang/doc-files/ValueBased.html)이므로 `value` 수식어를 사용하여 정의할 수 있습니다. 이제 `inline`과 `value` 수식어는 서로 동등합니다. 향후 Kotlin 버전에서는 `inline` 수식어를 사용 중단(deprecate)할 예정입니다.

    이제부터 Kotlin은 JVM 백엔드의 클래스 선언 전에 `@JvmInline` 어노테이션을 요구합니다:

    ```kotlin
    inline class Name(private val s: String)

    value class Name(private val s: String)

    // For JVM backends
    @JvmInline
    value class Name(private val s: String)
    ```

*   인라인 클래스는 `init` 블록을 가질 수 있습니다. 클래스가 인스턴스화된 직후에 실행될 코드를 추가할 수 있습니다:

    ```kotlin
    @JvmInline
    value class Negative(val x: Int) {
      init {
          require(x < 0) { }
      }
    }
    ```

*   Java 코드에서 인라인 클래스를 사용하는 함수 호출: Kotlin 1.4.30 이전에는 맹글링(mangling) 때문에 Java에서 인라인 클래스를 받는 함수를 호출할 수 없었습니다. 이제부터는 수동으로 맹글링을 비활성화할 수 있습니다. Java 코드에서 이러한 함수를 호출하려면 함수 선언 전에 `@JvmName` 어노테이션을 추가해야 합니다:

    ```kotlin
    inline class UInt(val x: Int)

    fun compute(x: Int) { }

    @JvmName("computeUInt")
    fun compute(x: UInt) { }
    ```

*   이 릴리스에서는 잘못된 동작을 수정하기 위해 함수의 맹글링 스키마를 변경했습니다. 이러한 변경은 ABI 변경으로 이어졌습니다.

    1.4.30부터 Kotlin 컴파일러는 기본적으로 새로운 맹글링 스키마를 사용합니다. 컴파일러가 이전 1.4.0 맹글링 스키마를 사용하고 바이너리 호환성을 유지하도록 강제하려면 `-Xuse-14-inline-classes-mangling-scheme` 컴파일러 플래그를 사용하세요.

Kotlin 1.4.30은 인라인 클래스를 베타로 승격하며, 향후 릴리스에서 안정적인 기능으로 만들 계획입니다. 이 [YouTrack 티켓](https://youtrack.jetbrains.com/issue/KT-42434)을 통해 피드백을 공유해 주시면 감사하겠습니다.

인라인 클래스의 프리뷰 버전을 사용해 보려면 컴파일러 옵션 `-Xinline-classes` 또는 `-language-version 1.5`를 추가하세요.

맹글링 알고리즘에 대한 자세한 내용은 [KEEP](https://github.com/Kotlin/KEEP/blob/master/proposals/inline-classes.md)에서 확인할 수 있습니다.

[인라인 클래스에 대해 자세히 알아보기](inline-classes.md).

## Kotlin/JVM

### JVM IR 컴파일러 백엔드가 베타에 도달

Kotlin/JVM용 [IR 기반 컴파일러 백엔드](whatsnew14.md#unified-backends-and-extensibility)는 1.4.0에서 [알파(Alpha)](components-stability.md)로 선보인 후 베타에 도달했습니다. 이는 IR 백엔드가 Kotlin/JVM 컴파일러의 기본값이 되기 전 마지막 사전 안정화 단계입니다.

이제 IR 컴파일러가 생성한 바이너리 사용 제한이 해제됩니다. 이전에는 새 JVM IR 백엔드를 활성화한 경우에만 새 백엔드로 컴파일된 코드를 사용할 수 있었습니다. 1.4.30부터는 이러한 제한이 없으므로 새 백엔드를 사용하여 라이브러리와 같은 타사 구성 요소를 빌드할 수 있습니다. 새 백엔드의 베타 버전을 사용해 보고 [이슈 트래커](https://kotl.in/issue)에 피드백을 공유해 주세요.

새 JVM IR 백엔드를 활성화하려면 프로젝트 구성 파일에 다음 줄을 추가하세요:
*   Gradle에서:

    <tabs group="build-script">
    <tab title="Kotlin" group-key="kotlin">

    ```kotlin
    tasks.withType(org.jetbrains.kotlin.gradle.dsl.KotlinJvmCompile::class) {
      kotlinOptions.useIR = true
    }
    ```

    </tab>
    <tab title="Groovy" group-key="groovy">

    ```groovy
    tasks.withType(org.jetbrains.kotlin.gradle.dsl.KotlinJvmCompile) {
      kotlinOptions.useIR = true
    }
    ```

    </tab>
    </tabs>

*   Maven에서:

    ```xml
    <configuration>
        <args>
            <arg>-Xuse-ir</arg>
        </args>
    </configuration>
    ```

JVM IR 백엔드가 가져오는 변경 사항에 대한 자세한 내용은 [이 블로그 게시물](https://blog.jetbrains.com/kotlin/2021/02/the-jvm-backend-is-in-beta-let-s-make-it-stable-together/)에서 확인할 수 있습니다.

## Kotlin/Native

### 성능 개선

Kotlin/Native는 1.4.30에서 다양한 성능 개선이 이루어져 컴파일 시간이 단축되었습니다. 예를 들어, [Kotlin 멀티플랫폼 모바일로 네트워킹 및 데이터 저장](https://github.com/kotlin-hands-on/kmm-networking-and-data-storage/tree/final) 샘플에서 프레임워크를 재빌드하는 데 필요한 시간이 9.5초(1.4.10)에서 4.5초(1.4.30)로 감소했습니다.

### Apple watchOS 64비트 시뮬레이터 타겟

watchOS 7.0부터 x86 시뮬레이터 타겟은 더 이상 사용되지 않습니다(deprecated). 최신 watchOS 버전과 보조를 맞추기 위해 Kotlin/Native는 64비트 아키텍처에서 시뮬레이터를 실행하기 위한 새로운 타겟 `watchosX64`를 제공합니다.

### Xcode 12.2 라이브러리 지원

Xcode 12.2와 함께 제공되는 새로운 라이브러리에 대한 지원이 추가되었습니다. 이제 Kotlin 코드에서 해당 라이브러리를 사용할 수 있습니다.

## Kotlin/JS

### 최상위 속성 지연 초기화

> 최상위 속성의 지연 초기화는 [실험적(Experimental)](components-stability.md)입니다. 이 기능은 언제든지 제거되거나 변경될 수 있습니다. 옵트인(opt-in)이 필요하며(자세한 내용은 아래 참조), 평가 목적으로만 사용해야 합니다. [YouTrack](https://youtrack.jetbrains.com/issue/KT-44320)을 통해 피드백을 주시면 감사하겠습니다.
>
{style="warning"}

Kotlin/JS용 [IR 백엔드](js-ir-compiler.md)는 최상위 속성의 지연 초기화 프로토타입 구현을 받고 있습니다. 이는 애플리케이션 시작 시 모든 최상위 속성을 초기화할 필요성을 줄여주고, 애플리케이션 시작 시간을 크게 개선할 것입니다.

저희는 지연 초기화 작업을 계속할 것이며, 현재 프로토타입을 사용해 보고 이 [YouTrack 티켓](https://youtrack.jetbrains.com/issue/KT-44320)이나 공식 [Kotlin Slack](https://kotlinlang.slack.com)의 [`#javascript`](https://kotlinlang.slack.com/archives/C0B8L3U69) 채널(초대 받기 [여기](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up))에 의견과 결과를 공유해 주시기를 요청합니다.

지연 초기화를 사용하려면 JS IR 컴파일러로 코드를 컴파일할 때 `-Xir-property-lazy-initialization` 컴파일러 옵션을 추가하세요.

## Gradle 프로젝트 개선 사항

### Gradle 설정 캐시 지원

1.4.30부터 Kotlin Gradle 플러그인은 [설정 캐시(configuration cache)](https://docs.gradle.org/current/userguide/configuration_cache.html) 기능을 지원합니다. 이 기능은 빌드 프로세스의 속도를 높여줍니다: 명령을 실행하면 Gradle은 설정 단계를 실행하고 태스크 그래프를 계산합니다. Gradle은 결과를 캐시하고 후속 빌드에서 재사용합니다.

이 기능을 사용하려면 [Gradle 명령을 사용](https://docs.gradle.org/current/userguide/configuration_cache.html#config_cache:usage)하거나 [IntelliJ 기반 IDE를 설정](https://docs.gradle.org/current/userguide/configuration_cache.html#config_cache:ide:intellij)할 수 있습니다.

## 표준 라이브러리

### 텍스트 대/소문자 변환을 위한 로케일 독립적(Locale-agnostic) API

> 로케일 독립적(locale-agnostic) API 기능은 [실험적(Experimental)](components-stability.md)입니다. 이 기능은 언제든지 제거되거나 변경될 수 있습니다. 평가 목적으로만 사용해야 합니다. [YouTrack](https://youtrack.jetbrains.com/issue/KT-42437)을 통해 피드백을 주시면 감사하겠습니다.
>
{style="warning"}

이번 릴리스에서는 문자열 및 문자의 대소문자를 변경하기 위한 실험적인 로케일 독립적 API를 도입합니다. 현재 `toLowerCase()`, `toUpperCase()`, `capitalize()`, `decapitalize()` API 함수는 로케일 민감(locale-sensitive)입니다. 이는 다른 플랫폼 로케일 설정이 코드 동작에 영향을 미칠 수 있음을 의미합니다. 예를 들어, 터키어 로케일에서 "kotlin" 문자열을 `toUpperCase`를 사용하여 변환하면 결과는 "KOTLİN"이지 "KOTLIN"이 아닙니다.

```kotlin
// current API
println("Needs to be capitalized".toUpperCase()) // NEEDS TO BE CAPITALIZED

// new API
println("Needs to be capitalized".uppercase()) // NEEDS TO BE CAPITALIZED
```

Kotlin 1.4.30은 다음 대안을 제공합니다:

*   `String` 함수:

    |**이전 버전**|**1.4.30 대안**|
    |---|---|
    |`String.toUpperCase()`|`String.uppercase()`|
    |`String.toLowerCase()`|`String.lowercase()`|
    |`String.capitalize()`|`String.replaceFirstChar { it.uppercase() }`|
    |`String.decapitalize()`|`String.replaceFirstChar { it.lowercase() }`|

*   `Char` 함수:

    |**이전 버전**|**1.4.30 대안**|
    |---|---|
    |`Char.toUpperCase()`|`Char.uppercaseChar(): Char`<br/>`Char.uppercase(): String`|
    |`Char.toLowerCase()`|`Char.lowercaseChar(): Char`<br/>`Char.lowercase(): String`|
    |`Char.toTitleCase()`|`Char.titlecaseChar(): Char`<br/>`Char.titlecase(): String`|

> Kotlin/JVM의 경우, 명시적인 `Locale` 매개변수가 있는 오버로드된 `uppercase()`, `lowercase()`, `titlecase()` 함수도 있습니다.
>
{style="note"}

텍스트 처리 함수의 전체 변경 목록은 [KEEP](https://github.com/Kotlin/KEEP/blob/master/proposals/stdlib/locale-agnostic-string-conversions.md)에서 확인할 수 있습니다.

### 명확한 Char-to-code 및 Char-to-digit 변환

> `Char` 변환 기능의 명확한 API는 [실험적(Experimental)](components-stability.md)입니다. 이 기능은 언제든지 제거되거나 변경될 수 있습니다. 평가 목적으로만 사용해야 합니다. [YouTrack](https://youtrack.jetbrains.com/issue/KT-44333)을 통해 피드백을 주시면 감사하겠습니다.
>
{style="warning"}

현재 UTF-16 코드를 다양한 숫자 유형으로 표현하여 반환하는 `Char`에서 숫자로의 변환 함수는 문자열의 숫자 값을 반환하는 유사한 String-to-Int 변환과 혼동되는 경우가 많습니다:

```kotlin
"4".toInt() // returns 4
'4'.toInt() // returns 52
// and there was no common function that would return the numeric value 4 for Char '4'
```

이러한 혼동을 피하기 위해 `Char` 변환을 명확하게 명명된 다음 두 가지 함수 세트로 분리하기로 결정했습니다:

*   `Char`의 정수 코드(integer code)를 가져오고 주어진 코드로부터 `Char`를 구성하는 함수:

    ```kotlin
    fun Char(code: Int): Char
    fun Char(code: UShort): Char
    val Char.code: Int
    ```

*   `Char`를 나타내는 숫자의 값으로 변환하는 함수:

    ```kotlin
    fun Char.digitToInt(radix: Int): Int
    fun Char.digitToIntOrNull(radix: Int): Int?
    ```
*   `Int`에 대한 확장 함수로, 해당 `Int`가 나타내는 음수가 아닌 단일 숫자를 해당 `Char` 표현으로 변환합니다:

    ```kotlin
    fun Int.digitToChar(radix: Int): Char
    ```

자세한 내용은 [KEEP](https://github.com/Kotlin/KEEP/blob/master/proposals/stdlib/char-int-conversions.md)에서 확인할 수 있습니다.

## 직렬화(Serialization) 업데이트

Kotlin 1.4.30과 함께 `kotlinx.serialization` [1.1.0-RC](https://github.com/Kotlin/kotlinx.serialization/releases/tag/v1.1.0-RC)를 출시하며, 여기에는 몇 가지 새로운 기능이 포함되어 있습니다:

*   인라인 클래스 직렬화 지원
*   부호 없는 프리미티브 타입 직렬화 지원

### 인라인 클래스 직렬화 지원

Kotlin 1.4.30부터 인라인 클래스를 [직렬화 가능](serialization.md)하게 만들 수 있습니다:

```kotlin
@Serializable
inline class Color(val rgb: Int)
```

> 이 기능은 새로운 1.4.30 IR 컴파일러를 필요로 합니다.
>
{style="note"}

직렬화 프레임워크는 다른 직렬화 가능 클래스에서 사용될 때 직렬화 가능한 인라인 클래스를 박싱(boxing)하지 않습니다.

자세한 내용은 `kotlinx.serialization` [문서](https://github.com/Kotlin/kotlinx.serialization/blob/master/docs/inline-classes.md#serializable-inline-classes)에서 알아보세요.

### 부호 없는 프리미티브 타입 직렬화 지원

1.4.30부터 [kotlinx.serialization](https://github.com/Kotlin/kotlinx.serialization)의 표준 JSON 직렬화기를 부호 없는 프리미티브 타입(`UInt`, `ULong`, `UByte`, `UShort`)에 사용할 수 있습니다:

```kotlin
@Serializable
class Counter(val counted: UByte, val description: String)
fun main() {
   val counted = 239.toUByte()
   println(Json.encodeToString(Counter(counted, "tries")))
}
```

자세한 내용은 `kotlinx.serialization` [문서](https://github.com/Kotlin/kotlinx.serialization/blob/master/docs/inline-classes.md#unsigned-types-support-json-only)에서 알아보세요.