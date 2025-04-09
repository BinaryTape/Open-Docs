---
title: "Kotlin 1.5.0의 새로운 기능"
---
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

_[릴리스 날짜: 2021년 5월 5일](releases#release-details)_

Kotlin 1.5.0은 새로운 언어 기능, 안정적인 IR 기반 JVM 컴파일러 백엔드, 성능 개선, 그리고 실험적 기능의 안정화 및 오래된 기능의 사용 중단과 같은 점진적인 변화를 제공합니다.

[릴리스 블로그 게시물](https://blog.jetbrains.com/kotlin/2021/04/kotlin-1-5-0-released/)에서 변경 사항에 대한 개요를 확인할 수도 있습니다.

## 언어 기능

Kotlin 1.5.0은 [1.4.30 미리보기](whatsnew1430#language-features)에서 소개된 새로운 언어 기능의 안정화 버전을 제공합니다.
* [JVM records 지원](#jvm-records-support)
* [Sealed interfaces](#sealed-interfaces) 및 [sealed class 개선 사항](#package-wide-sealed-class-hierarchies)
* [Inline classes](#inline-classes)

이러한 기능에 대한 자세한 설명은 [이 블로그 게시물](https://blog.jetbrains.com/kotlin/2021/02/new-language-features-preview-in-kotlin-1-4-30/)과 Kotlin 문서의 해당 페이지에서 확인할 수 있습니다.

### JVM records 지원

Java는 빠르게 진화하고 있으며, Kotlin이 Java와 계속 상호 운용될 수 있도록 Java의 최신 기능 중 하나인 [record 클래스](https://openjdk.java.net/jeps/395)에 대한 지원을 도입했습니다.

Kotlin의 JVM records 지원에는 양방향 상호 운용성이 포함됩니다.
* Kotlin 코드에서 Java record 클래스를 속성이 있는 일반 클래스처럼 사용할 수 있습니다.
* Kotlin 클래스를 Java 코드에서 record로 사용하려면 `data` 클래스로 만들고 `@JvmRecord` 어노테이션으로 표시합니다.

```kotlin
@JvmRecord
data class User(val name: String, val age: Int)
```

[Kotlin에서 JVM record를 사용하는 방법에 대해 자세히 알아보세요](jvm-records).

<video src="https://www.youtube.com/v/iyEWXyuuseU" title="Support for JVM Records in Kotlin 1.5.0"/>

### Sealed interfaces

Kotlin 인터페이스는 이제 `sealed` modifier를 가질 수 있습니다. 이 modifier는 클래스에서 작동하는 방식과 동일하게 인터페이스에서도 작동합니다. 즉, sealed 인터페이스의 모든 구현은 컴파일 타임에 알려집니다.

```kotlin
sealed interface Polygon
```

예를 들어 exhaustive `when` 식을 작성하는 데 이 사실을 활용할 수 있습니다.

```kotlin
fun draw(polygon: Polygon) = when (polygon) {
   is Rectangle `->` // ...
   is Triangle `->` // ...
   // else는 필요하지 않습니다. 가능한 모든 구현이 포함됩니다.
}

```

또한 sealed interfaces를 사용하면 클래스가 둘 이상의 sealed 인터페이스를 직접 상속할 수 있으므로 보다 유연한 제한된 클래스 계층 구조를 사용할 수 있습니다.

```kotlin
class FilledRectangle: Polygon, Fillable
```

[sealed interfaces에 대해 자세히 알아보세요](sealed-classes).

<video src="https://www.youtube.com/v/d_Mor21W_60" title="Sealed Interfaces and Sealed Classes Improvements"/>

### Package-wide sealed class hierarchies

Sealed classes는 이제 동일한 컴파일 단위 및 동일한 패키지의 모든 파일에 하위 클래스를 가질 수 있습니다. 이전에는 모든 하위 클래스가 동일한 파일에 나타나야 했습니다.

직접 하위 클래스는 최상위 수준이거나 다른 named classes, named interfaces 또는 named objects 내부에 여러 개 중첩될 수 있습니다.

Sealed class의 하위 클래스는 적절하게 qualified된 이름을 가져야 합니다. 즉, local 또는 anonymous objects일 수 없습니다.

[sealed class hierarchies에 대해 자세히 알아보세요](sealed-classes#inheritance).

### Inline classes

Inline classes는 값만 보유하는 [value-based](https://github.com/Kotlin/KEEP/blob/master/notes/value-classes) 클래스의 하위 집합입니다. 메모리 할당을 사용하는 데서 발생하는 추가 오버헤드 없이 특정 유형의 값에 대한 래퍼로 사용할 수 있습니다.

Inline classes는 클래스 이름 앞에 `value` modifier를 사용하여 선언할 수 있습니다.

```kotlin
value class Password(val s: String)
```

JVM 백엔드에는 특별한 `@JvmInline` 어노테이션도 필요합니다.

```kotlin
@JvmInline
value class Password(val s: String)
```

`inline` modifier는 이제 경고와 함께 deprecated되었습니다.

[inline classes에 대해 자세히 알아보세요](inline-classes).

<video src="https://www.youtube.com/v/LpqvtgibbsQ" title="From Inline to Value Classes"/>

## Kotlin/JVM

Kotlin/JVM은 내부 및 사용자 모두에게 많은 개선 사항이 적용되었습니다. 가장 주목할 만한 사항은 다음과 같습니다.

* [안정적인 JVM IR 백엔드](#stable-jvm-ir-backend)
* [새로운 기본 JVM target: 1.8](#new-default-jvm-target-1-8)
* [`invokedynamic`을 통한 SAM adapters](#sam-adapters-via-invokedynamic)
* [`invokedynamic`을 통한 Lambdas](#lambdas-via-invokedynamic)
* [@JvmDefault 및 이전 Xjvm-default 모드의 Deprecation](#deprecation-of-jvmdefault-and-old-xjvm-default-modes)
* [nullability annotations 처리 개선](#improvements-to-handling-nullability-annotations)

### 안정적인 JVM IR 백엔드

Kotlin/JVM 컴파일러용 [IR 기반 백엔드](whatsnew14#new-jvm-ir-backend)가 이제 [안정화](components-stability)되었으며 기본적으로 활성화되어 있습니다.

[Kotlin 1.4.0](whatsnew14)부터 IR 기반 백엔드의 초기 버전을 미리 볼 수 있었으며 이제 언어 버전 `1.5`의 기본값이 되었습니다. 이전 백엔드는 이전 언어 버전에서 기본적으로 계속 사용됩니다.

IR 백엔드의 이점과 향후 개발에 대한 자세한 내용은 [이 블로그 게시물](https://blog.jetbrains.com/kotlin/2021/02/the-jvm-backend-is-in-beta-let-s-make-it-stable-together/)에서 확인할 수 있습니다.

Kotlin 1.5.0에서 이전 백엔드를 사용해야 하는 경우 프로젝트의 구성 파일에 다음 줄을 추가할 수 있습니다.

* Gradle에서:

 <Tabs groupId="build-script">
 <TabItem value="kotlin" label="Kotlin" default>

 ```kotlin
 tasks.withType<org.jetbrains.kotlin.gradle.dsl.KotlinJvmCompile> {
   kotlinOptions.useOldBackend = true
 }
 ```

 </TabItem>
 <TabItem value="groovy" label="Groovy" default>

 ```groovy
 tasks.withType(org.jetbrains.kotlin.gradle.dsl.KotlinJvmCompile) {
  kotlinOptions.useOldBackend = true
 }
 ```

 </TabItem>
 </Tabs>

* Maven에서:

 ```xml
 <configuration>
     <args>
         <arg>-Xuse-old-backend</arg>
     </args>
 </configuration>
 ```

### 새로운 기본 JVM target: 1.8

Kotlin/JVM 컴파일의 기본 target 버전은 이제 `1.8`입니다. `1.6` target은 deprecated되었습니다.

JVM 1.6용 빌드가 필요한 경우 이 target으로 전환할 수 있습니다. 방법은 다음과 같습니다.

* [Gradle에서](gradle-compiler-options#attributes-specific-to-jvm)
* [Maven에서](maven#attributes-specific-to-jvm)
* [명령줄 컴파일러에서](compiler-reference#jvm-target-version)

### `invokedynamic`을 통한 SAM adapters

Kotlin 1.5.0은 이제 SAM (Single Abstract Method) 변환을 컴파일하기 위해 동적 호출(`invokedynamic`)을 사용합니다.
* SAM 유형이 [Java interface](java-interop#sam-conversions)인 경우 모든 식에서
* SAM 유형이 [Kotlin functional interface](fun-interfaces#sam-conversions)인 경우 lambda에서

새로운 구현은 [`LambdaMetafactory.metafactory()`](https://docs.oracle.com/javase/8/docs/api/java/lang/invoke/LambdaMetafactory.html#metafactory-java.lang.invoke.MethodHandles.Lookup-java.lang.String-java.lang.invoke.MethodType-java.lang.invoke.MethodType-java.lang.invoke.MethodHandle-java.lang.invoke.MethodType-)를 사용하며 컴파일 중에 보조 래퍼 클래스가 더 이상 생성되지 않습니다. 이렇게 하면 애플리케이션의 JAR 크기가 줄어들어 JVM 시작 성능이 향상됩니다.

익명 클래스 생성을 기반으로 하는 이전 구현 체계로 롤백하려면 컴파일러 옵션 `-Xsam-conversions=class`를 추가합니다.

[Gradle](gradle-compiler-options), [Maven](maven#specify-compiler-options) 및 [명령줄 컴파일러](compiler-reference#compiler-options)에서 컴파일러 옵션을 추가하는 방법을 알아보세요.

### `invokedynamic`을 통한 Lambdas

:::note
일반 Kotlin lambdas를 `invokedynamic`으로 컴파일하는 것은 [실험적](components-stability)입니다. 언제든지 삭제되거나 변경될 수 있습니다.
Opt-in이 필요하며 (자세한 내용은 아래 참조) 평가 목적으로만 사용해야 합니다. [YouTrack](https://youtrack.jetbrains.com/issue/KT-45375)에서 의견을 보내주시면 감사하겠습니다.

Kotlin 1.5.0은 일반 Kotlin lambdas (functional interface의 인스턴스로 변환되지 않음)를 동적 호출(`invokedynamic`)로 컴파일하기 위한 실험적 지원을 도입합니다. 이 구현은
[`LambdaMetafactory.metafactory()`](https://docs.oracle.com/javase/8/docs/api/java/lang/invoke/LambdaMetafactory.html#metafactory-java.lang.invoke.MethodHandles.Lookup-java.lang.String-java.lang.invoke.MethodType-java.lang.invoke.MethodType-java.lang.invoke.MethodHandle-java.lang.invoke.MethodType-)를 사용하여 더 가벼운 바이너리를 생성합니다. 이 함수는 런타임에 필요한 클래스를 효과적으로 생성합니다. 현재 일반적인 lambda 컴파일에 비해 세 가지 제한 사항이 있습니다.

* `invokedynamic`으로 컴파일된 lambda는 직렬화할 수 없습니다.
* 이러한 lambda에서 `toString()`을 호출하면 읽기 어려운 문자열 표현이 생성됩니다.
* 실험적 [`reflect`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.reflect.jvm/reflect.html) API는 `LambdaMetafactory`로 생성된 lambdas를 지원하지 않습니다.

이 기능을 사용해 보려면 `-Xlambdas=indy` 컴파일러 옵션을 추가하세요. 이 [YouTrack ticket](https://youtrack.jetbrains.com/issue/KT-45375)을 사용하여 의견을 공유해 주시면 감사하겠습니다.

[Gradle](gradle-compiler-options), [Maven](maven#specify-compiler-options) 및 [명령줄 컴파일러](compiler-reference#compiler-options)에서 컴파일러 옵션을 추가하는 방법을 알아보세요.

### @JvmDefault 및 이전 Xjvm-default 모드의 Deprecation

Kotlin 1.4.0 이전에는 `-Xjvm-default=enable` 및 `-Xjvm-default=compatibility` 모드와 함께 `@JvmDefault` 어노테이션이 있었습니다. 이 어노테이션은 Kotlin 인터페이스의 특정 비추상 멤버에 대한 JVM 기본 메서드를 만드는 데 사용되었습니다.

Kotlin 1.4.0에서는 프로젝트 전체에 대한 기본 메서드 생성을 켜는 새로운 [`Xjvm-default` 모드](https://blog.jetbrains.com/kotlin/2020/07/kotlin-1-4-m3-generating-default-methods-in-interfaces/)를 도입했습니다.

Kotlin 1.5.0에서는 `@JvmDefault` 및 이전 Xjvm-default 모드인 `-Xjvm-default=enable` 및 `-Xjvm-default=compatibility`를 deprecated하고 있습니다.

[Java interop에서 기본 메서드에 대해 자세히 알아보세요](java-to-kotlin-interop#default-methods-in-interfaces).

### nullability annotations 처리 개선

Kotlin은 [nullability annotations](java-interop#nullability-annotations)을 사용하여 Java에서 유형 nullability 정보를 처리하는 것을 지원합니다. Kotlin 1.5.0은 이 기능에 대한 여러 개선 사항을 도입했습니다.

* 종속성으로 사용되는 컴파일된 Java 라이브러리의 유형 인수에 대한 nullability annotations를 읽습니다.
* 다음 항목에 대해 `TYPE_USE` target이 있는 nullability annotations를 지원합니다.
  * 배열
  * Varargs
  * 필드
  * 유형 매개변수 및 해당 경계
  * 기본 클래스 및 인터페이스의 유형 인수
* nullability annotation에 유형에 적용 가능한 여러 target이 있고 이러한 target 중 하나가 `TYPE_USE`인 경우 `TYPE_USE`가 우선합니다.
  예를 들어 메서드 서명 `@Nullable String[] f()`는 `@Nullable`이 `TYPE_USE`와 `METHOD`를 모두 target으로 지원하는 경우 `fun f(): Array<String?>!`가 됩니다.

새롭게 지원되는 이러한 경우 Kotlin에서 Java를 호출할 때 잘못된 유형 nullability를 사용하면 경고가 생성됩니다. `-Xtype-enhancement-improvements-strict-mode` 컴파일러 옵션을 사용하여 이러한 경우에 대한 strict mode를 활성화합니다 (오류 보고 포함).

[null-safety 및 플랫폼 유형에 대해 자세히 알아보세요](java-interop#null-safety-and-platform-types).

## Kotlin/Native

Kotlin/Native는 이제 성능이 향상되고 안정적입니다. 주목할 만한 변경 사항은 다음과 같습니다.
* [성능 개선](#performance-improvements)
* [메모리 누수 검사기 비활성화](#deactivation-of-the-memory-leak-checker)

### 성능 개선

1.5.0에서 Kotlin/Native는 컴파일 및 실행 속도를 모두 향상시키는 일련의 성능 개선 사항을 제공합니다.

[컴파일러 캐시](https://blog.jetbrains.com/kotlin/2020/03/kotlin-1-3-70-released/#kotlin-native)는 이제 `linuxX64` (Linux 호스트에서만 해당) 및 `iosArm64` target에 대한 디버그 모드에서 지원됩니다. 컴파일러 캐시가 활성화되면 첫 번째 컴파일을 제외하고 대부분의 디버그 컴파일이 훨씬 더 빠르게 완료됩니다. 측정 결과 테스트 프로젝트에서 약 200%의 속도 향상이 나타났습니다.

새로운 target에 대해 컴파일러 캐시를 사용하려면 프로젝트의 `gradle.properties`에 다음 줄을 추가하여 옵트인하세요.
* `linuxX64`의 경우: `kotlin.native.cacheKind.linuxX64=static`
* `iosArm64`의 경우: `kotlin.native.cacheKind.iosArm64=static`

컴파일러 캐시를 활성화한 후 문제가 발생하는 경우 문제 추적기 [YouTrack](https://kotl.in/issue)에 보고해 주세요.

다른 개선 사항은 Kotlin/Native 코드의 실행 속도를 향상시킵니다.
* 사소한 속성 접근자가 인라인됩니다.
* 문자열 리터럴에 대한 `trimIndent()`는 컴파일 중에 평가됩니다.

### 메모리 누수 검사기 비활성화

기본 제공 Kotlin/Native 메모리 누수 검사기가 기본적으로 비활성화되었습니다.

이 검사기는 원래 내부용으로 설계되었으며 제한된 수의 경우에만 누수를 찾을 수 있습니다 (모든 경우에 해당하지 않음).
또한 나중에 애플리케이션 충돌을 일으킬 수 있는 문제가 있는 것으로 밝혀졌습니다. 따라서 메모리 누수 검사기를 끄기로 결정했습니다.

메모리 누수 검사기는 여전히 특정 경우 (예: 단위 테스트)에 유용할 수 있습니다. 이러한 경우 다음 코드 줄을 추가하여 활성화할 수 있습니다.

```kotlin
Platform.isMemoryLeakCheckerActive = true
```

애플리케이션 런타임에 대해 검사기를 활성화하는 것은 권장되지 않습니다.

## Kotlin/JS

Kotlin/JS는 1.5.0에서 점진적인 변경 사항을 받고 있습니다. [JS IR 컴파일러 백엔드](js-ir-compiler)를
안정화하고 다른 업데이트를 제공하기 위한 작업을 계속하고 있습니다.

* [webpack 버전 5로 업그레이드](#upgrade-to-webpack-5)
* [IR 컴파일러용 프레임워크 및 라이브러리](#frameworks-and-libraries-for-the-ir-compiler)

### webpack 5로 업그레이드

Kotlin/JS Gradle 플러그인은 이제 webpack 4 대신 브라우저 target에 webpack 5를 사용합니다. 이는 호환되지 않는 변경 사항을 가져오는 주요 webpack 업그레이드입니다. 사용자 지정 webpack 구성을 사용하는 경우 [webpack 5 릴리스 정보](https://webpack.js.org/blog/2020-10-10-webpack-5-release/)를 확인하세요.

[webpack을 사용하여 Kotlin/JS 프로젝트를 번들링하는 방법에 대해 자세히 알아보세요](js-project-setup#webpack-bundling).

### IR 컴파일러용 프레임워크 및 라이브러리

Kotlin/JS IR 컴파일러는 [Alpha](components-stability)에 있습니다. 호환되지 않게 변경될 수 있으며 향후 수동 마이그레이션이 필요할 수 있습니다. [YouTrack](https://youtrack.jetbrains.com/issues/KT)에서 의견을 보내주시면 감사하겠습니다.

Kotlin/JS 컴파일러용 IR 기반 백엔드 작업과 함께 라이브러리 작성자가 `both` 모드에서 프로젝트를 빌드하도록 장려하고 지원합니다. 즉, 두 Kotlin/JS 컴파일러 모두에 대한 아티팩트를 생성할 수 있으므로 새로운 컴파일러에 대한 에코 시스템이 커집니다.

많은 유명 프레임워크 및 라이브러리가 이미 IR 백엔드에 사용할 수 있습니다. [KVision](https://kvision.io/), [fritz2](https://www.fritz2.dev/),
[doodle](https://github.com/nacular/doodle) 등. 프로젝트에서 사용하는 경우 IR 백엔드를 사용하여 빌드하고 제공하는 이점을 확인할 수 있습니다.

자체 라이브러리를 작성하는 경우 클라이언트도 새 컴파일러와 함께 사용할 수 있도록 ['both' 모드로 컴파일](js-ir-compiler#authoring-libraries-for-the-ir-compiler-with-backwards-compatibility)하세요.

## Kotlin Multiplatform

Kotlin 1.5.0에서는 [각 플랫폼에 대한 테스트 종속성 선택이 간소화](#simplified-test-dependencies-usage-in-multiplatform-projects)되었으며 이제 Gradle 플러그인에서 자동으로 수행됩니다.

이제 [multiplatform 프로젝트에서 char 범주를 가져오는 새로운 API를 사용할 수 있습니다](#new-api-for-getting-a-char-category-now-available-in-multiplatform-code).

## 표준 라이브러리

표준 라이브러리는 실험적 부분 안정화부터 새로운 기능 추가에 이르기까지 다양한 변경 및 개선 사항을 받았습니다.

* [안정적인 unsigned integer types](#stable-unsigned-integer-types)
* [대/소문자 텍스트에 대한 안정적인 로캘 독립적 API](#stable-locale-agnostic-api-for-upper-lowercasing-text)
* [안정적인 Char-to-integer conversion API](#stable-char-to-integer-conversion-api)
* [안정적인 Path API](#stable-path-api)
* [Floored division 및 mod 연산자](#floored-division-and-the-mod-operator)
* [Duration API 변경 사항](#duration-api-changes)
* [이제 multiplatform 코드에서 char 범주를 가져오는 새로운 API를 사용할 수 있습니다](#new-api-for-getting-a-char-category-now-available-in-multiplatform-code)
* [새로운 컬렉션 함수 firstNotNullOf()](#new-collections-function-firstnotnullof)
* [String?.toBoolean()의 Strict 버전](#strict-version-of-string-toboolean)

표준 라이브러리 변경 사항에 대한 자세한 내용은 [이 블로그 게시물](https://blog.jetbrains.com/kotlin/2021/04/kotlin-1-5-0-rc-released/)에서 확인할 수 있습니다.

<video src="https://www.youtube.com/v/MyTkiT2I6-8" title="New Standard Library Features"/>

### 안정적인 unsigned integer types

`UInt`, `ULong`, `UByte`, `UShort` unsigned integer types가 이제 [안정화](components-stability)되었습니다. 이러한 유형에 대한 연산, 범위 및 진행도도 마찬가지입니다. 부호 없는 배열과 해당 연산은 베타 버전으로 유지됩니다.

[unsigned integer types에 대해 자세히 알아보세요](unsigned-integer-types).

### 대/소문자 텍스트에 대한 안정적인 로캘 독립적 API

이 릴리스는 대/소문자 텍스트 변환을 위한 새로운 로캘 독립적 API를 제공합니다. 로캘에 민감한 `toLowerCase()`, `toUpperCase()`, `capitalize()` 및 `decapitalize()` API 함수에 대한 대안을 제공합니다.
새로운 API를 사용하면 로캘 설정이 다르기 때문에 발생하는 오류를 방지할 수 있습니다.

Kotlin 1.5.0은 다음과 같은 완전히 [안정화](components-stability)된 대안을 제공합니다.

* `String` 함수의 경우:

  |**이전 버전**|**1.5.0 대안**|
  | --- | --- |
  |`String.toUpperCase()`|`String.uppercase()`|
  |`String.toLowerCase()`|`String.lowercase()`|
  |`String.capitalize()`|`String.replaceFirstChar { it.uppercase() }`|
  |`String.decapitalize()`|`String.replaceFirstChar { it.lowercase() }`|

* `Char` 함수의 경우:

  |**이전 버전**|**1.5.0 대안**|
  | --- | --- |
  |`Char.toUpperCase()`|`Char.uppercaseChar(): Char`<br/>`Char.uppercase(): String`|
  |`Char.toLowerCase()`|`Char.lowercaseChar(): Char`<br/>`Char.lowercase(): String`|
  |`Char.toTitleCase()`|`Char.titlecaseChar(): Char`<br/>`Char.titlecase(): String`|

Kotlin/JVM의 경우 명시적
`Locale` 매개변수가 있는 오버로드된 `uppercase()`, `lowercase()` 및 `titlecase()` 함수도 있습니다.

:::

이전 API 함수는 deprecated로 표시되었으며 향후 릴리스에서 제거됩니다.

[KEEP](https://github.com/Kotlin/KEEP/blob/master/proposals/stdlib/locale-agnostic-case-conversions)에서 텍스트 처리 함수에 대한 전체 변경 사항 목록을 참조하세요.

### 안정적인 char-to-integer conversion API

Kotlin 1.5.0부터 새로운 char-to-code 및 char-to-digit 변환 함수가 [안정화](components-stability)되었습니다. 이러한 함수는 유사한 string-to-Int 변환과 혼동되는 현재 API 함수를 대체합니다.

새로운 API는 이러한 이름 지정 혼동을 제거하여 코드 동작을 보다 투명하고 명확하게 만듭니다.

이 릴리스는 다음과 같이 명확하게 이름이 지정된 함수 집합으로 나뉘는 `Char` 변환을 도입합니다.

* `Char`의 정수 코드를 가져오고 지정된 코드에서 `Char`를 생성하는 함수:

 ```kotlin
 fun Char(code: Int): Char
 fun Char(code: UShort): Char
 val Char.code: Int
 ```

* `Char`를 숫자로 나타내는 숫자로 변환하는 함수:

 ```kotlin
 fun Char.digitToInt(radix: Int): Int
 fun Char.digitToIntOrNull(radix: Int): Int?
 ```

* 나타내는 음수가 아닌 단일 숫자를 해당 `Char` 표현으로 변환하는 `Int`에 대한 확장 함수:

 ```kotlin
 fun Int.digitToChar(radix: Int): Char
 ```

`Number.toChar()` (구현 포함, `Int.toChar()` 제외) 및 numeric 유형으로의 변환을 위한 `Char` 확장과 같은 이전 변환 API (예: `Char.toInt()`)는 이제 deprecated되었습니다.

[KEEP에서 char-to-integer conversion API에 대해 자세히 알아보세요](https://github.com/Kotlin/KEEP/blob/master/proposals/stdlib/char-int-conversions).

### 안정적인 Path API

`java.nio.file.Path`에 대한 확장 기능이 있는 [실험적 Path API](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.io.path/java.nio.file.-path/)가 이제 [안정화](components-stability)되었습니다.

```kotlin
// div (/) 연산자로 경로 구성
val baseDir = Path("/base")
val subDir = baseDir / "subdirectory"

// 디렉터리의 파일 나열
val kotlinFiles: List<Path> = Path("/home/user").listDirectoryEntries("*.kt")
```

[Path API에 대해 자세히 알아보세요](whatsnew1420#extensions-for-java-nio-file-path).

### Floored division 및 mod 연산자

모듈식 산술 연산을 위한 새로운 연산이 표준 라이브러리에 추가되었습니다.
* `floorDiv()`는 [floored division](https://en.wikipedia.org/wiki/Floor_and_ceiling_functions)의 결과를 반환합니다. 정수 유형에 사용할 수 있습니다.
* `mod()`는 floored division (_modulus_)의 나머지를 반환합니다. 모든 숫자 유형에 사용할 수 있습니다.

이러한 연산은 기존 [정수 나누기](numbers#operations-on-numbers) 및 [rem()](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-int/rem.html)과 매우 유사해 보입니다.
함수 (또는 `%` 연산자)이지만 음수에서 다르게 작동합니다.
* `a.floorDiv(b)`는 `floorDiv`가 결과를 내림 (더 작은 정수 방향)으로 반올림하는 반면 `/`는 결과를 0에 더 가까운 정수로 자르는 점에서 일반 `/`와 다릅니다.
* `a.mod(b)`는 `a`와 `a.floorDiv(b) * b`의 차이입니다. 0이거나 `b`와 같은 부호를 갖는 반면 `a % b`는 다른 부호를 가질 수 있습니다.

```kotlin
fun main() {

    println("Floored division -5/3: ${(-5).floorDiv(3)}")
    println( "Modulus: ${(-5).mod(3)}")
    
    println("Truncated division -5/3: ${-5 / 3}")
    println( "Remainder: ${-5 % 3}")

}
```

### Duration API 변경 사항

:::caution
Duration API는 [실험적](components-stability)입니다. 언제든지 삭제되거나 변경될 수 있습니다.
평가 목적으로만 사용하세요. [YouTrack](https://youtrack.jetbrains.com/issues/KT)에서 의견을 보내주시면 감사하겠습니다.

:::

다양한 시간 단위로 기간 금액을 나타내는 실험적 [Duration](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/-duration/) 클래스가 있습니다. 1.5.0에서 Duration API는 다음과 같은 변경 사항을 받았습니다.

* 내부 값 표현은 이제 더 나은 정밀도를 제공하기 위해 `Double` 대신 `Long`을 사용합니다.
* `Long`에서 특정 시간 단위로 변환하기 위한 새로운 API가 있습니다. `Double` 값으로 작동하고 이제 deprecated된 이전 API를 대체합니다. 예를 들어 [`Duration.inWholeMinutes`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/-duration/in-whole-minutes.html)는 기간 값을 `Long`으로 표현하여 반환하고 `Duration.inMinutes`를 대체합니다.
* 숫자에서 `Duration`을 구성하기 위한 새로운 companion 함수가 있습니다. 예를 들어 [`Duration.seconds(Int)`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/-duration/seconds.html)는 정수 초 수를 나타내는 `Duration` 객체를 만듭니다. `Int.seconds`와 같은 이전 확장 속성은 이제 deprecated되었습니다.

```kotlin
import kotlin.time.Duration
import kotlin.time.ExperimentalTime

@ExperimentalTime
fun main() {

    val duration = Duration.milliseconds(120000)
    println("There are ${duration.inWholeSeconds} seconds in ${duration.inWholeMinutes} minutes")

}
```

### 이제 multiplatform 코드에서 char 범주를 가져오는 새로운 API를 사용할 수 있습니다

Kotlin 1.5.0은 multiplatform 프로젝트에서 유니코드에 따라 문자의 범주를 가져오는 새로운 API를 도입합니다.
이제 여러 함수를 모든 플랫폼과 공통 코드에서 사용할 수 있습니다.

문자가 글자인지 숫자인지 확인하는 함수:
* [`Char.isDigit()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/is-digit.html)
* [`Char.isLetter()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/is-letter.html)
* [`Char.isLetterOrDigit()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/is-letter-or-digit.html)

```kotlin
fun main() {

    val chars = listOf('a', '1', '+')
    val (letterOrDigitList, notLetterOrDigitList) = chars.partition { it.isLetterOrDigit() }
    println(letterOrDigitList) // [a, 1]
    println(notLetterOrDigitList) // [+]

}
```

문자의 대/소문자를 확인하는 함수:
* [`Char.isLowerCase()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/is-lower-case.html)
* [`Char.isUpperCase()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/is-upper-case.html)
* [`Char.isTitleCase()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/is-title-case.html)

```kotlin
fun main() {

    val chars = listOf('ǅ', 'ǈ', 'ǋ', 'ǲ', '1', 'A', 'a', '+')
    val (titleCases, notTitleCases) = chars.partition { it.isTitleCase() }
    println(titleCases) // [ǅ, ǈ, ǋ, ǲ]
    println(notTitleCases) // [1, A, a, +]

}
```

기타 함수:
* [`Char.isDefined()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/is-defined.html)
* [`Char.isISOControl()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/is-i-s-o-control.html)

이제 속성 [`Char.category`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/category.html)와 해당 반환 유형
enum class [`CharCategory`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/-char-category/), 유니코드에 따른 문자의 일반 범주를 나타내는 것도 multiplatform 프로젝트에서 사용할 수 있습니다.

[문자에 대해 자세히 알아보세요](characters).

### 새로운 컬렉션 함수 firstNotNullOf()

새로운 [`firstNotNullOf()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/first-not-null-of.html) 및 [`firstNotNullOfOrNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/first-not-null-of-or-null.html)
함수는 [`mapNotNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/map-not-null.html)과
[`first()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/first.html) 또는 [`firstOrNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/first-or-null.html)을 결합합니다.
사용자 지정 선택기 함수를 사용하여 원래 컬렉션을 매핑하고 첫 번째 non-null 값을 반환합니다. 그러한 값이 없으면
`firstNotNullOf()`는 예외를 발생시키고 `firstNotNullOfOrNull()`은 null을 반환합니다.

```kotlin
fun main() {

    val data = listOf("Kotlin", "1.5")
    println(data.firstNotNullOf(String::toDoubleOrNull))
    println(data.firstNotNullOfOrNull(String::toIntOrNull))

}
```

### String?.toBoolean()의 Strict 버전

두 개의 새로운 함수는 기존 [String?.toBoolean()](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/to-boolean.html)의 대/소문자를 구분하는 strict 버전을 도입합니다.
* [`String.toBooleanStrict()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/to-boolean-strict.html)는 리터럴 `true` 및 `false`를 제외한 모든 입력에 대해 예외를 발생시킵니다.
* [`String.toBooleanStrictOrNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/to-boolean-strict-or-null.html)는 리터럴 `true` 및 `false`를 제외한 모든 입력에 대해 null을 반환합니다.

```kotlin
fun main() {

    println("true".toBooleanStrict())
    println("1".toBooleanStrictOrNull())
    // println("1".toBooleanStrict()) // Exception

}
```

## kotlin-test 라이브러리
[kotlin-test](https://kotlinlang.org/api/latest/kotlin.test/) 라이브러리는 몇 가지 새로운 기능을 도입합니다.
* [multiplatform 프로젝트에서 간소화된 테스트 종속성 사용](#simplified-test-dependencies-usage-in-multiplatform-projects)
* [Kotlin/JVM 소스 세트에 대한 테스트 프레임워크 자동 선택](#automatic-selection-of-a-testing-framework-for-kotlin-jvm-source-sets)
* [Assertion 함수 업데이트](#assertion-function-updates)

### multiplatform 프로젝트에서 간소화된 테스트 종속성 사용

이제 `kotlin-test` 종속성을 사용하여 `commonTest` 소스 세트에 테스트를 위한 종속성을 추가할 수 있으며,
Gradle 플러그인은 각 테스트 소스 세트에 대한 해당 플랫폼 종속성을 추론합니다.
* JVM 소스 세트의 경우 `kotlin-test-junit`, [Kotlin/JVM 소스 세트에 대한 테스트 프레임워크 자동 선택](#automatic-selection-of-a-testing-framework-for-kotlin-jvm-source-sets) 참조
* Kotlin/JS 소스 세트의 경우 `kotlin-test-js`
* 공통 소스 세트의 경우 `kotlin-test-common` 및 `kotlin-test-annotations-common`
* Kotlin/Native 소