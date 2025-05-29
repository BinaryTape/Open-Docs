[//]: # (title: Kotlin 1.5.0의 새로운 기능)

_[출시일: 2021년 5월 5일](releases.md#release-details)_

Kotlin 1.5.0은 새로운 언어 기능, 안정적인 IR 기반 JVM 컴파일러 백엔드, 성능 개선,
그리고 실험적 기능 안정화 및 오래된 기능 사용 중단(deprecated)과 같은 점진적 변경 사항을 도입합니다.

변경 사항에 대한 개요는 [릴리스 블로그 게시물](https://blog.jetbrains.com/kotlin/2021/04/kotlin-1-5-0-released/)에서도 확인할 수 있습니다.

## 언어 기능

Kotlin 1.5.0은 [1.4.30에서 미리보기로 선보였던](whatsnew1430.md#language-features) 새로운 언어 기능의 안정화 버전을 제공합니다.
* [JVM 레코드 지원](#jvm-records-support)
* [봉인된 인터페이스](#sealed-interfaces) 및 [봉인된 클래스 개선](#package-wide-sealed-class-hierarchies)
* [인라인 클래스](#inline-classes)

이러한 기능에 대한 자세한 설명은 [이 블로그 게시물](https://blog.jetbrains.com/kotlin/2021/02/new-language-features-preview-in-kotlin-1-4-30/)과 Kotlin 문서의 해당 페이지에서 확인할 수 있습니다.

### JVM 레코드 지원

Java는 빠르게 발전하고 있으며, Kotlin이 Java와 계속해서 상호 운용될 수 있도록 최신 기능 중 하나인 [레코드 클래스](https://openjdk.java.net/jeps/395) 지원을 도입했습니다.

Kotlin의 JVM 레코드 지원에는 양방향 상호 운용성이 포함됩니다.
* Kotlin 코드에서 Java 레코드 클래스를 속성을 가진 일반 클래스처럼 사용할 수 있습니다.
* Java 코드에서 Kotlin 클래스를 레코드로 사용하려면, `data` 클래스로 만들고 `@JvmRecord` 어노테이션으로 표시하세요.

```kotlin
@JvmRecord
data class User(val name: String, val age: Int)
```

[Kotlin에서 JVM 레코드 사용에 대해 자세히 알아보세요](jvm-records.md).

<video src="https://www.youtube.com/v/iyEWXyuuseU" title="Kotlin 1.5.0의 JVM 레코드 지원"/>

### 봉인된 인터페이스

Kotlin 인터페이스는 이제 `sealed` 한정자를 가질 수 있으며, 이는 클래스에 적용되는 방식과 동일하게 인터페이스에 적용됩니다. 즉, 봉인된 인터페이스의 모든 구현은 컴파일 시점에 알려집니다.

```kotlin
sealed interface Polygon
```

이러한 사실에 의존하여, 예를 들어, 전체 분기 처리(`exhaustive when`) `when` 표현식을 작성할 수 있습니다.

```kotlin
fun draw(polygon: Polygon) = when (polygon) {
   is Rectangle -> // ...
   is Triangle -> // ...
   // else가 필요하지 않습니다. 모든 가능한 구현이 처리됩니다.
}

```

또한, 클래스가 둘 이상의 봉인된 인터페이스를 직접 상속할 수 있기 때문에 봉인된 인터페이스는 더 유연한 제한된 클래스 계층 구조를 가능하게 합니다.

```kotlin
class FilledRectangle: Polygon, Fillable
```

[봉인된 인터페이스에 대해 자세히 알아보세요](sealed-classes.md).

<video src="https://www.youtube.com/v/d_Mor21W_60" title="봉인된 인터페이스 및 봉인된 클래스 개선"/>

### 패키지 전체의 봉인된 클래스 계층 구조

봉인된 클래스는 이제 동일한 컴파일 단위 및 동일한 패키지의 모든 파일에 서브클래스를 가질 수 있습니다. 이전에는 모든 서브클래스가 동일한 파일에 있어야 했습니다.

직접 서브클래스는 최상위(top-level)이거나, 다른 명명된 클래스, 명명된 인터페이스 또는 명명된 객체 내부에 중첩될 수 있습니다.

봉인된 클래스의 서브클래스는 적절하게 정규화된 이름을 가져야 합니다. 즉, 로컬 또는 익명 객체일 수 없습니다.

[봉인된 클래스 계층 구조에 대해 자세히 알아보세요](sealed-classes.md#inheritance).

### 인라인 클래스

인라인 클래스는 값만 보유하는 [값 기반(value-based)](https://github.com/Kotlin/KEEP/blob/master/notes/value-classes.md) 클래스의 하위 집합입니다. 메모리 할당 사용으로 인한 추가 오버헤드 없이 특정 타입의 값에 대한 래퍼(wrapper)로 사용할 수 있습니다.

인라인 클래스는 클래스 이름 앞에 `value` 한정자를 사용하여 선언할 수 있습니다.

```kotlin
value class Password(val s: String)
```

JVM 백엔드는 특별한 `@JvmInline` 어노테이션도 필요로 합니다.

```kotlin
@JvmInline
value class Password(val s: String)
```

`inline` 한정자는 이제 경고와 함께 사용 중단(deprecated)되었습니다.

[인라인 클래스에 대해 자세히 알아보세요](inline-classes.md).

<video src="https://www.youtube.com/v/LpqvtgibbsQ" title="인라인 클래스에서 값 클래스로"/>

## Kotlin/JVM

Kotlin/JVM은 내부적 및 사용자 지향적인 측면 모두에서 여러 가지 개선 사항이 적용되었습니다. 그 중 가장 주목할 만한 사항은 다음과 같습니다.

* [안정적인 JVM IR 백엔드](#stable-jvm-ir-backend)
* [새로운 기본 JVM 대상: 1.8](#new-default-jvm-target-1-8)
* [invokedynamic을 통한 SAM 어댑터](#sam-adapters-via-invokedynamic)
* [invokedynamic을 통한 람다](#lambdas-via-invokedynamic)
* [@JvmDefault 및 이전 Xjvm-default 모드의 사용 중단](#deprecation-of-jvmdefault-and-old-xjvm-default-modes)
* [널 가능성 어노테이션 처리 개선](#improvements-to-handling-nullability-annotations)

### 안정적인 JVM IR 백엔드

Kotlin/JVM 컴파일러의 [IR 기반 백엔드](whatsnew14.md#new-jvm-ir-backend)는 이제 [안정화](components-stability.md)되었으며 기본적으로 활성화됩니다.

[Kotlin 1.4.0](whatsnew14.md)부터 IR 기반 백엔드의 초기 버전이 미리보기로 제공되었으며, 이제 언어 버전 `1.5`의 기본값으로 설정되었습니다. 이전 백엔드는 이전 언어 버전에서 여전히 기본적으로 사용됩니다.

IR 백엔드의 이점 및 향후 개발에 대한 자세한 내용은 [이 블로그 게시물](https://blog.jetbrains.com/kotlin/2021/02/the-jvm-backend-is-in-beta-let-s-make-it-stable-together/)에서 확인할 수 있습니다.

Kotlin 1.5.0에서 이전 백엔드를 사용해야 하는 경우, 프로젝트의 구성 파일에 다음 줄을 추가할 수 있습니다.

* Gradle에서:

 <tabs group="build-script">
 <tab title="Kotlin" group-key="kotlin">

 ```kotlin
 tasks.withType<org.jetbrains.kotlin.gradle.dsl.KotlinJvmCompile> {
   kotlinOptions.useOldBackend = true
 }
 ```

 </tab>
 <tab title="Groovy" group-key="groovy">

 ```groovy
 tasks.withType(org.jetbrains.kotlin.gradle.dsl.KotlinJvmCompile) {
  kotlinOptions.useOldBackend = true
 }
 ```

 </tab>
 </tabs>

* Maven에서:

 ```xml
 <configuration>
     <args>
         <arg>-Xuse-old-backend</arg>
     </args>
 </configuration>
 ```

### 새로운 기본 JVM 대상: 1.8

Kotlin/JVM 컴파일의 기본 대상 버전은 이제 `1.8`입니다. `1.6` 대상은 사용 중단(deprecated)되었습니다.

JVM 1.6용 빌드가 필요한 경우, 이 대상으로 전환할 수 있습니다. 방법은 다음과 같습니다.

* [Gradle에서](gradle-compiler-options.md#attributes-specific-to-jvm)
* [Maven에서](maven.md#attributes-specific-to-jvm)
* [명령줄 컴파일러에서](compiler-reference.md#jvm-target-version)

### invokedynamic을 통한 SAM 어댑터

Kotlin 1.5.0은 이제 SAM(단일 추상 메서드) 변환을 컴파일하기 위해 동적 호출(`invokedynamic`)을 사용합니다.
* SAM 타입이 [Java 인터페이스](java-interop.md#sam-conversions)인 경우 모든 표현식에 대해
* SAM 타입이 [Kotlin 함수형 인터페이스](fun-interfaces.md#sam-conversions)인 경우 람다에 대해

새로운 구현은 [`LambdaMetafactory.metafactory()`](https://docs.oracle.com/javase/8/docs/api/java/lang/invoke/LambdaMetafactory.html#metafactory-java.lang.invoke.MethodHandles.Lookup-java.lang.String-java.lang.invoke.MethodType-java.lang.invoke.MethodType-java.lang.invoke.MethodHandle-java.lang.invoke.MethodType-)를 사용하며 보조 래퍼(wrapper) 클래스가 컴파일 중에 더 이상 생성되지 않습니다. 이는 애플리케이션의 JAR 크기를 줄여 JVM 시작 성능을 개선합니다.

익명 클래스 생성 기반의 이전 구현 방식으로 되돌리려면, 컴파일러 옵션 `-Xsam-conversions=class`를 추가하세요.

[Gradle](gradle-compiler-options.md), [Maven](maven.md#specify-compiler-options) 및 [명령줄 컴파일러](compiler-reference.md#compiler-options)에서 컴파일러 옵션을 추가하는 방법을 알아보세요.

### invokedynamic을 통한 람다

> 일반 Kotlin 람다를 invokedynamic으로 컴파일하는 것은 [실험적](components-stability.md)입니다. 언제든지 중단되거나 변경될 수 있습니다. 옵트인(opt-in)이 필요하며(자세한 내용은 아래 참조), 평가 목적으로만 사용해야 합니다. [YouTrack](https://youtrack.jetbrains.com/issue/KT-45375)에 대한 귀하의 피드백을 환영합니다.
>
{style="warning"}

Kotlin 1.5.0은 일반 Kotlin 람다(함수형 인터페이스 인스턴스로 변환되지 않는)를 동적 호출(`invokedynamic`)로 컴파일하는 실험적 지원을 도입합니다. 이 구현은 [`LambdaMetafactory.metafactory()`](https://docs.oracle.com/javase/8/docs/api/java/lang/invoke/LambdaMetafactory.html#metafactory-java.lang.invoke.MethodHandles.Lookup-java.lang.String-java.lang.invoke.MethodType-java.lang.invoke.MethodType-java.lang.invoke.MethodHandle-java.lang.invoke.MethodType-)를 사용하여 더 가벼운 바이너리를 생성하며, 런타임에 필요한 클래스를 효과적으로 생성합니다. 현재 일반 람다 컴파일과 비교하여 세 가지 제한 사항이 있습니다.

* invokedynamic으로 컴파일된 람다는 직렬화할 수 없습니다.
* 이러한 람다에 대해 `toString()`을 호출하면 가독성이 떨어지는 문자열 표현을 생성합니다.
* 실험적 [`reflect`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.reflect.jvm/reflect.html) API는 `LambdaMetafactory`로 생성된 람다를 지원하지 않습니다.

이 기능을 사용해 보려면, 컴파일러 옵션 `-Xlambdas=indy`를 추가하세요. 이 [YouTrack 티켓](https://youtrack.jetbrains.com/issue/KT-45375)을 사용하여 피드백을 공유해 주시면 감사하겠습니다.

[Gradle](gradle-compiler-options.md), [Maven](maven.md#specify-compiler-options) 및 [명령줄 컴파일러](compiler-reference.md#compiler-options)에서 컴파일러 옵션을 추가하는 방법을 알아보세요.

### @JvmDefault 및 이전 Xjvm-default 모드 사용 중단

Kotlin 1.4.0 이전에는 `@JvmDefault` 어노테이션과 함께 `-Xjvm-default=enable` 및 `-Xjvm-default=compatibility` 모드가 있었습니다. 이들은 Kotlin 인터페이스의 특정 비추상 멤버에 대한 JVM 기본 메서드를 생성하는 역할을 했습니다.

Kotlin 1.4.0에서는 전체 프로젝트에 대한 기본 메서드 생성을 켜는 [새로운 `Xjvm-default` 모드를 도입했습니다](https://blog.jetbrains.com/kotlin/2020/07/kotlin-1-4-m3-generating-default-methods-in-interfaces/).

Kotlin 1.5.0에서는 `@JvmDefault`와 이전 Xjvm-default 모드인 `-Xjvm-default=enable` 및 `-Xjvm-default=compatibility`를 사용 중단합니다.

[Java 상호 운용성에서 기본 메서드에 대해 자세히 알아보세요](java-to-kotlin-interop.md#default-methods-in-interfaces).

### 널 가능성 어노테이션 처리 개선

Kotlin은 Java에서 [널 가능성 어노테이션](java-interop.md#nullability-annotations)을 사용하여 타입 널 가능성 정보를 처리하는 것을 지원합니다. Kotlin 1.5.0은 이 기능에 대한 여러 개선 사항을 도입합니다.

* 종속성으로 사용되는 컴파일된 Java 라이브러리의 타입 인수에 대한 널 가능성 어노테이션을 읽습니다.
* `TYPE_USE` 대상을 가진 널 가능성 어노테이션을 지원합니다.
  * 배열
  * 가변 인자(Varargs)
  * 필드
  * 타입 매개변수 및 해당 경계
  * 기본 클래스 및 인터페이스의 타입 인수
* 널 가능성 어노테이션이 타입에 적용 가능한 여러 대상을 가지고 있고, 이러한 대상 중 하나가 `TYPE_USE`인 경우, `TYPE_USE`가 우선됩니다. 예를 들어, `@Nullable`이 `TYPE_USE`와 `METHOD`를 모두 대상으로 지원하는 경우, 메서드 시그니처 `@Nullable String[] f()`는 `fun f(): Array<String?>!`이 됩니다.

새롭게 지원되는 경우에 대해, Kotlin에서 Java를 호출할 때 잘못된 타입 널 가능성을 사용하면 경고가 발생합니다. 이러한 경우에 대해 엄격 모드를 활성화하려면(오류 보고 포함) `-Xtype-enhancement-improvements-strict-mode` 컴파일러 옵션을 사용하세요.

[널 안전성 및 플랫폼 타입에 대해 자세히 알아보세요](java-interop.md#null-safety-and-platform-types).

## Kotlin/Native

Kotlin/Native는 이제 더 높은 성능과 안정성을 제공합니다. 주목할 만한 변경 사항은 다음과 같습니다.
* [성능 개선](#performance-improvements)
* [메모리 누수 검사기 비활성화](#deactivation-of-the-memory-leak-checker)

### 성능 개선

1.5.0에서 Kotlin/Native는 컴파일 및 실행 속도를 모두 높이는 일련의 성능 개선이 이루어졌습니다.

[컴파일러 캐시](https://blog.jetbrains.com/kotlin/2020/03/kotlin-1-3-70-released/#kotlin-native)가 `linuxX64`(Linux 호스트에서만) 및 `iosArm64` 대상에 대한 디버그 모드에서 지원됩니다. 컴파일러 캐시가 활성화되면, 첫 번째 컴파일을 제외하고 대부분의 디버그 컴파일이 훨씬 더 빠르게 완료됩니다. 측정 결과 테스트 프로젝트에서 약 200%의 속도 향상이 나타났습니다.

새로운 대상에 컴파일러 캐시를 사용하려면, 프로젝트의 `gradle.properties`에 다음 줄을 추가하여 옵트인(opt-in)하세요.
* `linuxX64`용: `kotlin.native.cacheKind.linuxX64=static`
* `iosArm64`용: `kotlin.native.cacheKind.iosArm64=static`

컴파일러 캐시를 활성화한 후 문제가 발생하면, 이슈 트래커 [YouTrack](https://kotl.in/issue)에 보고해 주세요.

다른 개선 사항들은 Kotlin/Native 코드의 실행 속도를 높입니다.
* 사소한(trivial) 프로퍼티 접근자는 인라인됩니다.
* 문자열 리터럴에 대한 `trimIndent()`는 컴파일 중에 평가됩니다.

### 메모리 누수 검사기 비활성화

내장된 Kotlin/Native 메모리 누수 검사기는 기본적으로 비활성화되었습니다.

원래 내부용으로 설계되었으며, 모든 경우를 찾아내지 못하고 제한된 경우에만 누수를 찾을 수 있습니다. 또한 나중에 애플리케이션 충돌을 유발할 수 있는 문제가 있는 것으로 밝혀졌습니다. 따라서 메모리 누수 검사기를 끄기로 결정했습니다.

메모리 누수 검사기는 여전히 특정 경우, 예를 들어 단위 테스트에 유용할 수 있습니다. 이러한 경우에는 다음 코드 줄을 추가하여 활성화할 수 있습니다.

```kotlin
Platform.isMemoryLeakCheckerActive = true
```

애플리케이션 런타임에 검사기를 활성화하는 것은 권장되지 않습니다.

## Kotlin/JS

Kotlin/JS는 1.5.0에서 점진적 변경이 이루어지고 있습니다. [JS IR 컴파일러 백엔드](js-ir-compiler.md)를 안정화하고 다른 업데이트를 출시하기 위한 작업을 계속하고 있습니다.

* [webpack 5 버전으로 업그레이드](#upgrade-to-webpack-5)
* [IR 컴파일러용 프레임워크 및 라이브러리](#frameworks-and-libraries-for-the-ir-compiler)

### webpack 5로 업그레이드

Kotlin/JS Gradle 플러그인은 이제 브라우저 대상을 위해 webpack 4 대신 webpack 5를 사용합니다. 이는 호환되지 않는 변경 사항을 가져오는 주요 webpack 업그레이드입니다. 사용자 지정 webpack 구성을 사용하고 있다면, [webpack 5 릴리스 노트](https://webpack.js.org/blog/2020-10-10-webpack-5-release/)를 반드시 확인하세요.

[webpack을 사용하여 Kotlin/JS 프로젝트 번들링에 대해 자세히 알아보세요](js-project-setup.md#webpack-bundling).

### IR 컴파일러용 프레임워크 및 라이브러리

> Kotlin/JS IR 컴파일러는 [알파](components-stability.md) 단계입니다. 향후 호환되지 않게 변경될 수 있으며 수동 마이그레이션이 필요할 수 있습니다. [YouTrack](https://youtrack.jetbrains.com/issues/KT)에 대한 귀하의 피드백을 환영합니다.
>
{style="warning"}

Kotlin/JS 컴파일러의 IR 기반 백엔드 작업을 진행하는 동시에, 라이브러리 작성자가 프로젝트를 `both` 모드로 빌드하도록 권장하고 돕고 있습니다. 이는 두 Kotlin/JS 컴파일러 모두를 위한 아티팩트를 생성할 수 있음을 의미하며, 새로운 컴파일러를 위한 생태계를 성장시킵니다.

많은 잘 알려진 프레임워크와 라이브러리가 이미 IR 백엔드에서 사용 가능합니다: [KVision](https://kvision.io/), [fritz2](https://www.fritz2.dev/), [doodle](https://github.com/nacular/doodle), 및 기타. 프로젝트에서 이들을 사용하고 있다면, 이미 IR 백엔드를 사용하여 빌드하고 그 이점을 확인할 수 있습니다.

자신만의 라이브러리를 작성하고 있다면, [새로운 컴파일러로도 클라이언트가 사용할 수 있도록](js-ir-compiler.md#authoring-libraries-for-the-ir-compiler-with-backwards-compatibility) [`both` 모드로 컴파일](js-ir-compiler.md#authoring-libraries-for-the-ir-compiler-with-backwards-compatibility)하세요.

## Kotlin Multiplatform

Kotlin 1.5.0에서는 [각 플랫폼에 대한 테스트 종속성 선택이 간소화되었으며](#simplified-test-dependencies-usage-in-multiplatform-projects) 이제 Gradle 플러그인에 의해 자동으로 수행됩니다.

새로운 [문자 카테고리 획득 API가 이제 멀티플랫폼 프로젝트에서 사용 가능합니다](#new-api-for-getting-a-char-category-now-available-in-multiplatform-code).

## 표준 라이브러리

표준 라이브러리는 실험적 부분의 안정화부터 새로운 기능 추가까지 다양한 변경 및 개선 사항이 적용되었습니다.

* [안정적인 부호 없는 정수 타입](#stable-unsigned-integer-types)
* [텍스트 대소문자 변환을 위한 안정적인 로케일 독립 API](#stable-locale-agnostic-api-for-upper-lowercasing-text)
* [안정적인 Char-to-integer 변환 API](#stable-char-to-integer-conversion-api)
* [안정적인 Path API](#stable-path-api)
* [내림 나눗셈(Floored division) 및 나머지(mod) 연산자](#floored-division-and-the-mod-operator)
* [Duration API 변경 사항](#duration-api-changes)
* [문자 카테고리 획득을 위한 새로운 API가 이제 멀티플랫폼 코드에서 사용 가능](#new-api-for-getting-a-char-category-now-available-in-multiplatform-code)
* [새로운 컬렉션 함수 firstNotNullOf()](#new-collections-function-firstnotnullof)
* [String?.toBoolean()의 엄격한 버전](#strict-version-of-string-toboolean)

[이 블로그 게시물](https://blog.jetbrains.com/kotlin/2021/04/kotlin-1-5-0-rc-released/)에서 표준 라이브러리 변경 사항에 대해 자세히 알아볼 수 있습니다.

<video src="https://www.youtube.com/v/MyTkiT2I6-8" title="새로운 표준 라이브러리 기능"/>

### 안정적인 부호 없는 정수 타입

부호 없는 정수 타입인 `UInt`, `ULong`, `UByte`, `UShort`는 이제 [안정화](components-stability.md)되었습니다. 이러한 타입에 대한 연산, 범위 및 진행에도 동일하게 적용됩니다. 부호 없는 배열 및 이에 대한 연산은 베타 단계에 있습니다.

[부호 없는 정수 타입에 대해 자세히 알아보세요](unsigned-integer-types.md).

### 텍스트 대소문자 변환을 위한 안정적인 로케일 독립 API

이번 릴리스는 텍스트 대소문자 변환을 위한 새로운 로케일 독립 API를 제공합니다. 이는 로케일에 민감한 `toLowerCase()`, `toUpperCase()`, `capitalize()`, `decapitalize()` API 함수에 대한 대안을 제공합니다. 새로운 API는 서로 다른 로케일 설정으로 인한 오류를 방지하는 데 도움이 됩니다.

Kotlin 1.5.0은 다음과 같은 완전히 [안정적인](components-stability.md) 대안을 제공합니다.

* `String` 함수용:

  |**이전 버전**|**1.5.0 대안**|
  | --- | --- |
  |`String.toUpperCase()`|`String.uppercase()`|
  |`String.toLowerCase()`|`String.lowercase()`|
  |`String.capitalize()`|`String.replaceFirstChar { it.uppercase() }`|
  |`String.decapitalize()`|`String.replaceFirstChar { it.lowercase() }`|

* `Char` 함수용:

  |**이전 버전**|**1.5.0 대안**|
  | --- | --- |
  |`Char.toUpperCase()`|`Char.uppercaseChar(): Char`<br/>`Char.uppercase(): String`|
  |`Char.toLowerCase()`|`Char.lowercaseChar(): Char`<br/>`Char.lowercase(): String`|
  |`Char.toTitleCase()`|`Char.titlecaseChar(): Char`<br/>`Char.titlecase(): String`|

> Kotlin/JVM의 경우, 명시적 `Locale` 매개변수가 있는 오버로드된 `uppercase()`, `lowercase()`, `titlecase()` 함수도 있습니다.
>
{style="note"}

이전 API 함수는 사용 중단(deprecated)으로 표시되었으며 향후 릴리스에서 제거될 예정입니다.

텍스트 처리 기능 변경 사항의 전체 목록은 [KEEP](https://github.com/Kotlin/KEEP/blob/master/proposals/stdlib/locale-agnostic-case-conversions.md)에서 확인하세요.

### 안정적인 Char-to-integer 변환 API

Kotlin 1.5.0부터 새로운 문자-코드 및 문자-숫자 변환 함수가 [안정화](components-stability.md)되었습니다. 이 함수들은 유사한 문자열-Int 변환과 혼동되는 경우가 많았던 현재 API 함수를 대체합니다.

새로운 API는 이러한 명명 혼동을 제거하여 코드 동작을 더 투명하고 명확하게 만듭니다.

이번 릴리스에서는 명확하게 명명된 다음 함수 세트로 나뉘는 `Char` 변환을 도입합니다.

* `Char`를 정수 코드로 가져오고 주어진 코드에서 `Char`를 구성하는 함수:

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

* 음이 아닌 단일 숫자를 해당하는 `Char` 표현으로 변환하는 `Int`용 확장 함수:

 ```kotlin
 fun Int.digitToChar(radix: Int): Char
 ```

이전 변환 API(구현을 포함한 `Number.toChar()`(단, `Int.toChar()` 제외) 및 `Char.toInt()`와 같이 숫자 타입으로 변환하기 위한 `Char` 확장)는 이제 사용 중단(deprecated)되었습니다.

[KEEP에서 문자-정수 변환 API에 대해 자세히 알아보세요](https://github.com/Kotlin/KEEP/blob/master/proposals/stdlib/char-int-conversions.md).

### 안정적인 Path API

`java.nio.file.Path`에 대한 확장을 포함하는 [실험적인 Path API](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.io.path/java.nio.file.-path/)는 이제 [안정화](components-stability.md)되었습니다.

```kotlin
// 나누기(/) 연산자로 경로 구성
val baseDir = Path("/base")
val subDir = baseDir / "subdirectory"

// 디렉터리 내 파일 목록
val kotlinFiles: List<Path> = Path("/home/user").listDirectoryEntries("*.kt")
```

[Path API에 대해 자세히 알아보세요](whatsnew1420.md#extensions-for-java-nio-file-path).

### 내림 나눗셈(Floored division) 및 나머지(mod) 연산자

표준 라이브러리에 모듈러 산술을 위한 새로운 연산이 추가되었습니다.
* `floorDiv()`는 [내림 나눗셈](https://en.wikipedia.org/wiki/Floor_and_ceiling_functions)의 결과를 반환합니다. 정수 타입에서 사용할 수 있습니다.
* `mod()`는 내림 나눗셈의 나머지(모듈러스)를 반환합니다. 모든 숫자 타입에서 사용할 수 있습니다.

이러한 연산은 기존 [정수 나눗셈](numbers.md#operations-on-numbers) 및 [rem()](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-int/rem.html) 함수(또는 `%` 연산자)와 매우 유사해 보이지만, 음수에 대해 다르게 작동합니다.
* `a.floorDiv(b)`는 `floorDiv`가 결과를 내림(더 작은 정수 방향)하는 반면, 일반 `/`는 결과를 0에 더 가까운 정수로 자른다는 점에서 일반 `/`와 다릅니다.
* `a.mod(b)`는 `a`와 `a.floorDiv(b) * b`의 차이입니다. 결과는 0이거나 `b`와 동일한 부호를 가지는 반면, `a % b`는 다른 부호를 가질 수 있습니다.

```kotlin
fun main() {
//sampleStart
    println("Floored division -5/3: ${(-5).floorDiv(3)}")
    println( "Modulus: ${(-5).mod(3)}")
    
    println("Truncated division -5/3: ${-5 / 3}")
    println( "Remainder: ${-5 % 3}")
//sampleEnd    
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.5"}

### Duration API 변경 사항

> Duration API는 [실험적](components-stability.md)입니다. 언제든지 중단되거나 변경될 수 있습니다. 평가 목적으로만 사용하세요. [YouTrack](https://youtrack.jetbrains.com/issues/KT)에 대한 귀하의 피드백을 환영합니다.
>
{style="warning"}

다양한 시간 단위로 지속 시간을 나타내는 실험적 [Duration](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/-duration/) 클래스가 있습니다. 1.5.0에서 Duration API는 다음과 같은 변경 사항이 적용되었습니다.

* 내부 값 표현이 더 나은 정밀도를 제공하기 위해 `Double` 대신 `Long`을 사용합니다.
* `Long`으로 특정 시간 단위로 변환하는 새로운 API가 있습니다. 이는 `Double` 값으로 작동하며 이제 사용 중단(deprecated)된 이전 API를 대체합니다. 예를 들어, [`Duration.inWholeMinutes`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/-duration/in-whole-minutes.html)는 `Long`으로 표현된 지속 시간 값을 반환하며 `Duration.inMinutes`를 대체합니다.
* 숫자에서 `Duration`을 구성하기 위한 새로운 동반(companion) 함수가 있습니다. 예를 들어, [`Duration.seconds(Int)`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/-duration/seconds.html)는 정수 초를 나타내는 `Duration` 객체를 생성합니다. `Int.seconds`와 같은 이전 확장 프로퍼티는 이제 사용 중단(deprecated)되었습니다.

```kotlin
import kotlin.time.Duration
import kotlin.time.ExperimentalTime

@ExperimentalTime
fun main() {
//sampleStart
    val duration = Duration.milliseconds(120000)
    println("There are ${duration.inWholeSeconds} seconds in ${duration.inWholeMinutes} minutes")
//sampleEnd
}
```
{validate="false"}

### 문자 카테고리 획득을 위한 새로운 API가 이제 멀티플랫폼 코드에서 사용 가능

Kotlin 1.5.0은 멀티플랫폼 프로젝트에서 유니코드에 따른 문자 카테고리를 가져오는 새로운 API를 도입합니다. 이제 모든 플랫폼과 공통 코드에서 여러 함수를 사용할 수 있습니다.

문자가 글자 또는 숫자인지 확인하는 함수:
* [`Char.isDigit()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/is-digit.html)
* [`Char.isLetter()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/is-letter.html)
* [`Char.isLetterOrDigit()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/is-letter-or-digit.html)

```kotlin
fun main() {
//sampleStart
    val chars = listOf('a', '1', '+')
    val (letterOrDigitList, notLetterOrDigitList) = chars.partition { it.isLetterOrDigit() }
    println(letterOrDigitList) // [a, 1]
    println(notLetterOrDigitList) // [+]
//sampleEnd    
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.5"}

문자의 대소문자를 확인하는 함수:
* [`Char.isLowerCase()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/is-lower-case.html)
* [`Char.isUpperCase()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/is-upper-case.html)
* [`Char.isTitleCase()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/is-title-case.html)

```kotlin
fun main() {
//sampleStart
    val chars = listOf('ǅ', 'ǈ', 'ǋ', 'ǲ', '1', 'A', 'a', '+')
    val (titleCases, notTitleCases) = chars.partition { it.isTitleCase() }
    println(titleCases) // [ǅ, ǈ, ǋ, ǲ]
    println(notTitleCases) // [1, A, a, +]
//sampleEnd    
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.5"}

기타 함수:
* [`Char.isDefined()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/is-defined.html)
* [`Char.isISOControl()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/is-i-s-o-control.html)

문자의 유니코드 일반 카테고리를 나타내는 [`Char.category`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/category.html) 프로퍼티 및 반환 타입 열거형 클래스 [`CharCategory`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/-char-category/)는 이제 멀티플랫폼 프로젝트에서도 사용할 수 있습니다.

[문자에 대해 자세히 알아보세요](characters.md).

### 새로운 컬렉션 함수 firstNotNullOf()

새로운 [`firstNotNullOf()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/first-not-null-of.html) 및 [`firstNotNullOfOrNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/first-not-null-of-or-null.html) 함수는 [`mapNotNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/map-not-null.html)와 [`first()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/first.html) 또는 [`firstOrNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/first-or-null.html)을 결합합니다. 이 함수들은 사용자 지정 선택 함수로 원본 컬렉션을 매핑하고 첫 번째 null이 아닌 값을 반환합니다. 그러한 값이 없으면 `firstNotNullOf()`는 예외를 던지고 `firstNotNullOfOrNull()`은 null을 반환합니다.

```kotlin
fun main() {
//sampleStart
    val data = listOf("Kotlin", "1.5")
    println(data.firstNotNullOf(String::toDoubleOrNull))
    println(data.firstNotNullOfOrNull(String::toIntOrNull))
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.5"}

### String?.toBoolean()의 엄격한 버전

두 가지 새로운 함수가 기존 [String?.toBoolean()](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/to-boolean.html)의 대소문자 구분 엄격한 버전을 도입합니다.
* [`String.toBooleanStrict()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/to-boolean-strict.html)는 리터럴 `true` 및 `false`를 제외한 모든 입력에 대해 예외를 발생시킵니다.
* [`String.toBooleanStrictOrNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/to-boolean-strict-or-null.html)는 리터럴 `true` 및 `false`를 제외한 모든 입력에 대해 null을 반환합니다.

```kotlin
fun main() {
//sampleStart
    println("true".toBooleanStrict())
    println("1".toBooleanStrictOrNull())
    // println("1".toBooleanStrict()) // 예외 발생
//sampleEnd    
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.5"}

## kotlin-test 라이브러리
[kotlin-test](https://kotlinlang.org/api/latest/kotlin.test/) 라이브러리는 몇 가지 새로운 기능을 도입합니다.
* [멀티플랫폼 프로젝트에서 간소화된 테스트 종속성 사용](#simplified-test-dependencies-usage-in-multiplatform-projects)
* [Kotlin/JVM 소스 세트에 대한 테스트 프레임워크 자동 선택](#automatic-selection-of-a-testing-framework-for-kotlin-jvm-source-sets)
* [단언(Assertion) 함수 업데이트](#assertion-function-updates)

### 멀티플랫폼 프로젝트에서 간소화된 테스트 종속성 사용

이제 `commonTest` 소스 세트에 테스트 종속성을 추가하기 위해 `kotlin-test` 종속성을 사용할 수 있으며, Gradle 플러그인이 각 테스트 소스 세트에 대한 해당 플랫폼 종속성을 추론합니다.
* JVM 소스 세트의 경우 `kotlin-test-junit`, [Kotlin/JVM 소스 세트에 대한 테스트 프레임워크 자동 선택](#automatic-selection-of-a-testing-framework-for-kotlin-jvm-source-sets) 참조
* Kotlin/JS 소스 세트의 경우 `kotlin-test-js`
* 공통 소스 세트의 경우 `kotlin-test-common` 및 `kotlin-test-annotations-common`
* Kotlin/Native 소스 세트의 경우 추가 아티팩트 없음

또한, 모든 공유 또는 플랫폼별 소스 세트에서 `kotlin-test` 종속성을 사용할 수 있습니다.

명시적 종속성을 가진 기존 kotlin-test 설정은 Gradle과 Maven 모두에서 계속 작동합니다.

[테스트 라이브러리에 종속성을 설정하는 방법](gradle-configure-project.md#set-dependencies-on-test-libraries)에 대해 자세히 알아보세요.

### Kotlin/JVM 소스 세트에 대한 테스트 프레임워크 자동 선택

Gradle 플러그인은 이제 테스트 프레임워크에 대한 종속성을 자동으로 선택하고 추가합니다. 공통 소스 세트에 `kotlin-test` 종속성을 추가하기만 하면 됩니다.

Gradle은 기본적으로 JUnit 4를 사용합니다. 따라서 `kotlin("test")` 종속성은 JUnit 4용 변형, 즉 `kotlin-test-junit`로 해결됩니다.

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
kotlin {
    sourceSets {
        val commonTest by getting {
            dependencies {
                implementation(kotlin("test")) // 이 종속성은 JUnit 4에 대한
                                               // 전이적 종속성을 가져옵니다.
            }
        }
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
kotlin {
    sourceSets {
        commonTest {
            dependencies {
                implementation kotlin("test") // 이 종속성은 JUnit 4에 대한 
                                              // 전이적 종속성을 가져옵니다.
            }
        }
    }
}
```

</tab>
</tabs>

테스트 태스크에서 [`useJUnitPlatform()`](https://docs.gradle.org/current/javadoc/org/gradle/api/tasks/testing/Test.html#useJUnitPlatform) 또는 [`useTestNG()`](https://docs.gradle.org/current/javadoc/org/gradle/api/tasks/testing/Test.html#useTestNG)를 호출하여 JUnit 5 또는 TestNG를 선택할 수 있습니다.

```groovy
tasks {
    test {
        // TestNG 지원 활성화
        useTestNG()
        // 또는
        // JUnit Platform (일명 JUnit 5) 지원 활성화
        useJUnitPlatform()
    }
}
```

프로젝트의 `gradle.properties`에 `kotlin.test.infer.jvm.variant=false` 줄을 추가하여 자동 테스트 프레임워크 선택을 비활성화할 수 있습니다.

[테스트 라이브러리에 종속성을 설정하는 방법](gradle-configure-project.md#set-dependencies-on-test-libraries)에 대해 자세히 알아보세요.

### 단언(Assertion) 함수 업데이트

이번 릴리스는 새로운 단언 함수를 도입하고 기존 함수를 개선합니다.

`kotlin-test` 라이브러리는 이제 다음과 같은 기능을 제공합니다.

* **값의 타입 확인**

  새로운 `assertIs<T>` 및 `assertIsNot<T>`를 사용하여 값의 타입을 확인할 수 있습니다.

  ```kotlin
  @Test
  fun testFunction() {
      val s: Any = "test"
      assertIs<String>(s)  // 단언이 실패하면 s의 실제 타입을 언급하는 AssertionError를 발생시킵니다.
      // assertIs의 계약(contract) 때문에 이제 s.length를 출력할 수 있습니다.
      println("${s.length}")
  }
  ```

  타입 이레이저(type erasure) 때문에, 이 단언 함수는 다음 예시에서 `value`가 `List` 타입인지 여부만 확인하며, 특정 `String` 요소 타입의 리스트인지 여부는 확인하지 않습니다:  `assertIs<List<String>>(value)`.

* **배열, 시퀀스 및 임의의 이터러블에 대한 컨테이너 내용 비교**

  [구조적 동등성(structural equality)](equality.md#structural-equality)을 구현하지 않는 다양한 컬렉션의 내용을 비교하기 위한 오버로드된 `assertContentEquals()` 함수들의 새로운 세트가 있습니다.

  ```kotlin
  @Test
  fun test() {
      val expectedArray = arrayOf(1, 2, 3)
      val actualArray = Array(3) { it + 1 }
      assertContentEquals(expectedArray, actualArray)
  }
  ```

* **`Double` 및 `Float` 숫자를 위한 `assertEquals()` 및 `assertNotEquals()`의 새로운 오버로드**

  `assertEquals()` 함수에 대한 새로운 오버로드가 있어 두 `Double` 또는 `Float` 숫자를 절대 정밀도로 비교할 수 있게 합니다. 정밀도 값은 함수의 세 번째 매개변수로 지정됩니다.

  ```kotlin
   @Test
  fun test() {
      val x = sin(PI)

      // 정밀도 매개변수
      val tolerance = 0.000001

      assertEquals(0.0, x, tolerance)
  }
  ```

* **컬렉션 및 요소의 내용 확인을 위한 새로운 함수**

  이제 `assertContains()` 함수를 사용하여 컬렉션 또는 요소에 무언가가 포함되어 있는지 확인할 수 있습니다. `IntRange`, `String` 등 `contains()` 연산자를 가진 Kotlin 컬렉션 및 요소와 함께 사용할 수 있습니다.

  ```kotlin
  @Test
  fun test() {
      val sampleList = listOf<String>("sample", "sample2")
      val sampleString = "sample"
      assertContains(sampleList, sampleString)  // 컬렉션 내 요소
      assertContains(sampleString, "amp")       // 문자열 내 부분 문자열
  }
  ```

* **`assertTrue()`, `assertFalse()`, `expect()` 함수가 이제 인라인(inline)됩니다.**

  이제부터는 이들을 인라인 함수로 사용할 수 있으므로 람다 표현식 내에서 [정지 함수(suspend functions)](composing-suspending-functions.md)를 호출할 수 있습니다.

  ```kotlin
  @Test
  fun test() = runBlocking<Unit> {
      val deferred = async { "Kotlin is nice" }
      assertTrue("Kotlin substring should be present") {
          deferred.await() .contains("Kotlin")
      }
  }
  ```

## kotlinx 라이브러리

Kotlin 1.5.0과 함께 kotlinx 라이브러리의 새로운 버전을 릴리스하고 있습니다.
* `kotlinx.coroutines` [1.5.0-RC](#coroutines-1-5-0-rc)
* `kotlinx.serialization` [1.2.1](#serialization-1-2-1)
* `kotlinx-datetime` [0.2.0](#datetime-0-2-0)

### Coroutines 1.5.0-RC

`kotlinx.coroutines` [1.5.0-RC](https://github.com/Kotlin/kotlinx.coroutines/releases/tag/1.5.0-RC)는 다음과 함께 제공됩니다.
* [새로운 채널 API](channels.md)
* 안정적인 [반응형 통합](async-programming.md#reactive-extensions)
* 그리고 더 많은 기능

Kotlin 1.5.0부터 [실험적 코루틴](whatsnew14.md#exclusion-of-the-deprecated-experimental-coroutines)은 비활성화되며 `-Xcoroutines=experimental` 플래그는 더 이상 지원되지 않습니다.

[변경 로그](https://github.com/Kotlin/kotlinx.coroutines/releases/tag/1.5.0-RC) 및 [`kotlinx.coroutines` 1.5.0 릴리스 블로그 게시물](https://blog.jetbrains.com/kotlin/2021/05/kotlin-coroutines-1-5-0-released/)에서 자세히 알아보세요.

<video src="https://www.youtube.com/v/EVLnWOcR0is" title="kotlinx.coroutines 1.5.0"/>

### Serialization 1.2.1

`kotlinx.serialization` [1.2.1](https://github.com/Kotlin/kotlinx.serialization/releases/tag/v1.2.1)은 다음과 함께 제공됩니다.
* JSON 직렬화 성능 개선
* JSON 직렬화에서 여러 이름 지원
* `@Serializable` 클래스에서 .proto 스키마 생성 실험
* 그리고 더 많은 기능

[변경 로그](https://github.com/Kotlin/kotlinx.serialization/releases/tag/v1.2.1) 및 [`kotlinx.serialization` 1.2.1 릴리스 블로그 게시물](https://blog.jetbrains.com/kotlin/2021/05/kotlinx-serialization-1-2-released/)에서 자세히 알아보세요.

<video src="https://www.youtube.com/v/698I_AH8h6s" title="kotlinx.serialization 1.2.1"/>

### dateTime 0.2.0

`kotlinx-datetime` [0.2.0](https://github.com/Kotlin/kotlinx-datetime/releases/tag/v0.2.0)은 다음과 함께 제공됩니다.
* `@Serializable` Datetime 객체
* `DateTimePeriod` 및 `DatePeriod`의 정규화된 API
* 그리고 더 많은 기능

[변경 로그](https://github.com/Kotlin/kotlinx-datetime/releases/tag/v0.2.0) 및 [`kotlinx-datetime` 0.2.0 릴리스 블로그 게시물](https://blog.jetbrains.com/kotlin/2021/05/kotlinx-datetime-0-2-0-is-out/)에서 자세히 알아보세요.

<video src="https://www.youtube.com/v/698I_AH8h6s" title="kotlinx.serialization 1.2.1"/>

## Kotlin 1.5.0으로 마이그레이션

IntelliJ IDEA 및 Android Studio는 Kotlin 플러그인이 1.5.0으로 사용 가능해지면 업데이트를 제안할 것입니다.

기존 프로젝트를 Kotlin 1.5.0으로 마이그레이션하려면, Kotlin 버전을 `1.5.0`으로 변경하고 Gradle 또는 Maven 프로젝트를 다시 임포트하기만 하면 됩니다. [Kotlin 1.5.0으로 업데이트하는 방법](releases.md#update-to-a-new-kotlin-version)을 알아보세요.

Kotlin 1.5.0으로 새 프로젝트를 시작하려면, Kotlin 플러그인을 업데이트하고 **File** | **New** | **Project**에서 프로젝트 마법사를 실행하세요.

새로운 명령줄 컴파일러는 [GitHub 릴리스 페이지](https://github.com/JetBrains/kotlin/releases/tag/v1.5.0)에서 다운로드할 수 있습니다.

Kotlin 1.5.0은 [기능 릴리스](kotlin-evolution-principles.md#language-and-tooling-releases)이므로 언어에 호환되지 않는 변경 사항을 가져올 수 있습니다. 이러한 변경 사항에 대한 자세한 목록은 [Kotlin 1.5 호환성 가이드](compatibility-guide-15.md)에서 확인할 수 있습니다.