[//]: # (title: Kotlin %kotlinEapVersion%의 새로운 기능)

<primary-label ref="eap"/>

<show-structure depth="1"/>

<web-summary>Kotlin EAP(Early Access Preview) 릴리스 노트를 읽고 최신 실험적 Kotlin 기능을 공식 출시 전에 미리 사용해 보세요.</web-summary>

_[출시일: %kotlinEapReleaseDate%](eap.md#build-details)_

> 이 문서는 EAP(Early Access Preview) 릴리스의 모든 기능을 다루지는 않지만, 주요 개선 사항을 중점적으로 설명합니다.
>
> 전체 변경 사항 목록은 [GitHub 변경 로그](https://github.com/JetBrains/kotlin/releases/tag/v%kotlinEapVersion%)에서 확인하세요.
>
{style="note"}

Kotlin %kotlinEapVersion% 버전이 출시되었습니다! 이번 EAP 릴리스의 주요 내용은 다음과 같습니다:

* **언어**: [컨텍스트 파라미터(Context parameters)의 Stable 단계 진입, 명시적 배킹 필드(Explicit backing fields), 어노테이션 사용 지점 대상(Annotation use-site targets)을 위한 다양한 기능](#stable-features)
* **표준 라이브러리**: [Stable UUID](#stable-uuids-in-the-common-kotlin-standard-library) 및 [정렬 순서 확인 지원](#support-for-checking-sorted-order)
* **Kotlin/JVM**: [Java 26 지원](#support-for-java-26) 및 [메타데이터의 어노테이션 기본 활성화](#annotations-in-metadata-enabled-by-default)
* **Kotlin/Native**: [Swift 패키지를 의존성으로 지원, Swift export 업데이트, CMS GC 기본 적용](#kotlin-native)
* **Kotlin/Wasm**: [증분 컴파일(Incremental compilation) 기본 활성화 및 WebAssembly 컴포넌트 모델(Component Model) 지원](#kotlin-wasm)
* **Kotlin/JS**: [값 클래스(Value class) export 지원 및 JS 코드 인라인화 시 ES2015 기능 지원](#kotlin-js)
* **Gradle**: [Gradle 9.5.0과의 호환성](#gradle)
* **Maven**: [Java 및 JVM 타겟 버전의 자동 정렬](#maven)
* **Kotlin 컴파일러**: [`.klib` 컴파일 시 더욱 일관된 인라인 함수 동작](#consistent-intra-module-function-inlining-during-klib-compilation)

> Kotlin 릴리스 주기에 대한 정보는 [Kotlin 릴리스 프로세스](releases.md)를 참조하세요.
>
{style="tip"}

## Kotlin %kotlinEapVersion%으로 업데이트

최신 버전의 Kotlin은 최신 버전의 [IntelliJ IDEA](https://www.jetbrains.com/idea/download/) 및 [Android Studio](https://developer.android.com/studio)에 포함되어 있습니다.

새로운 Kotlin 버전으로 업데이트하려면 IDE가 최신 버전인지 확인하고, 빌드 스크립트에서 [Kotlin 버전을 %kotlinEapVersion%으로 변경](releases.md#update-to-a-new-kotlin-version)하세요.

## 새로운 기능 {id=new-stable-features}
<primary-label ref="stable"/>

이전 Kotlin 릴리스에서 실험적(Experimental)으로 도입되었던 몇 가지 새로운 기능들이 개선되었습니다.
다음 기능들은 이제 Kotlin %kotlinEapVersion%에서 [Stable(안정화)](components-stability.md#stability-levels-explained) 단계로 격상되었으므로, 더 이상 사용을 위해 옵트인(opt-in)할 필요가 없습니다.

* [컨텍스트 파라미터(Context parameters)](whatsnew22.md#preview-of-context-parameters) (단, [컨텍스트 인자](#explicit-context-arguments-for-context-parameters) 및 [호출 가능 참조(Callable references)](https://github.com/Kotlin/KEEP/blob/context-parameters/proposals/context-parameters.md#callable-references) 제외)
* [프로퍼티를 위한 `@all` 메타 타겟](whatsnew22.md#all-meta-target-for-properties)
* [어노테이션 사용 지점 대상(Annotation use-site targets)을 위한 새로운 기본 규칙](whatsnew22.md#new-defaulting-rules-for-use-site-annotation-targets)
* [명시적 배킹 필드(Explicit backing fields)](whatsnew23.md#explicit-backing-fields)
* [공통 Kotlin 표준 라이브러리의 Stable UUID](#stable-uuids-in-the-common-kotlin-standard-library)
* [정렬 순서 확인 지원](#support-for-checking-sorted-order)
* [JVM에서 부호 없는 정수를 `BigInteger`로 변환하기 위한 새로운 API](#new-api-for-converting-unsigned-integers-to-biginteger-on-the-jvm)
* [JavaScript/TypeScript로의 값 클래스 export 지원](#support-for-value-class-export-to-javascript-typescript)
* [JS 코드 인라인화 시 ES2015 기능 지원](#support-for-es2015-features-when-inlining-js-code)
* [Maven: Java 및 JVM 타겟 버전의 자동 정렬](#automatic-alignment-between-java-and-jvm-target-versions)

## 새로운 기능 {id=new-experimental-features}
<primary-label ref="experimental-exp"/>

* [컨텍스트 파라미터를 위한 명시적 컨텍스트 인자(Explicit context arguments)](#explicit-context-arguments-for-context-parameters)
* [컬렉션 리터럴(Collection literals) 지원](#support-for-collection-literals)
* [컴파일 타임 상수(Compile-time constants) 개선](#improved-compile-time-constants)
* [Swift 패키지 임포트](#swift-package-import)
* [Swift export: 코루틴 Flow export 지원](#swift-export-support-for-exporting-coroutine-flows)
* [WebAssembly 컴포넌트 모델 지원](#support-for-the-webassembly-component-model)

## 언어

Kotlin %kotlinEapVersion%은 컨텍스트 파라미터, 명시적 배킹 필드 및 어노테이션 사용 지점 대상 기능을 [Stable](components-stability.md#stability-levels-explained) 단계로 승격합니다. 또한 이번 릴리스에서는 [컨텍스트 파라미터를 위한 명시적 컨텍스트 인자](#explicit-context-arguments-for-context-parameters)를 도입합니다.

### Stable 기능
<secondary-label ref="language"/>

Kotlin 2.2.0에서는 몇 가지 언어 기능이 [실험적(Experimental)](components-stability.md#stability-levels-explained) 단계로 도입되었습니다. 이번 릴리스부터 다음 언어 기능들이 [Stable](components-stability.md#stability-levels-explained) 단계가 되었음을 알려드립니다.

* [컨텍스트 파라미터(Context parameters)](whatsnew22.md#preview-of-context-parameters) (단, [컨텍스트 인자](#explicit-context-arguments-for-context-parameters) 및 [호출 가능 참조(Callable references)](https://github.com/Kotlin/KEEP/blob/context-parameters/proposals/context-parameters.md#callable-references) 제외)
* [프로퍼티를 위한 `@all` 메타 타겟](whatsnew22.md#all-meta-target-for-properties)
* [어노테이션 사용 지점 대상(Annotation use-site targets)을 위한 새로운 기본 규칙](whatsnew22.md#new-defaulting-rules-for-use-site-annotation-targets)
* [명시적 배킹 필드(Explicit backing fields)](whatsnew23.md#explicit-backing-fields)

[Kotlin 언어 디자인 기능 및 제안 전체 목록 보기](kotlin-language-features-and-proposals.md).

### 컨텍스트 파라미터를 위한 명시적 컨텍스트 인자
<primary-label ref="experimental-opt-in"/>
<secondary-label ref="language"/>

Kotlin %kotlinEapVersion%에서는 [컨텍스트 파라미터(Context parameters)](context-parameters.md)를 위한 명시적 컨텍스트 인자(Explicit context arguments)를 도입합니다.

Kotlin 2.3.20에서는 [컨텍스트 파라미터에 대한 오버로드 해소(Overload resolution) 방식이 변경되었습니다](whatsnew2320.md#changes-to-overload-resolution-for-context-parameters). 그 결과, 컨텍스트 파라미터만 다른 오버로드 함수를 호출할 때 모호함이 발생할 수 있습니다.

이제 호출 지점(Call site)에서 명시적 컨텍스트 인자를 전달하여 이러한 모호함을 해결할 수 있습니다.

다음은 그 예시입니다:

```kotlin
class EmailSender
class SmsSender

context(emailSender: EmailSender)
fun sendNotification() {
    println("Sent email notification")
}

context(smsSender: SmsSender)
fun sendNotification() {
    println("Sent SMS notification")
}

context(defaultEmailSender: EmailSender, defaultSmsSender: SmsSender)
fun notifyUser() {
    
    // EmailSender 컨텍스트 파라미터가 있는 오버로드를 선택합니다.
    sendNotification(emailSender = defaultEmailSender)

    // SmsSender 컨텍스트 파라미터가 있는 오버로드를 선택합니다.
    sendNotification(smsSender = defaultSmsSender)
}
```

또한 `context()` 함수 대신 명시적 컨텍스트 인자를 사용하여 중첩을 줄이고 일부 호출의 가독성을 높일 수 있습니다. 여러 호출에서 동일한 컨텍스트 인자를 사용해야 하는 경우에는 `context()` 함수를 대신 사용하세요.

이 기능은 [실험적(Experimental)](components-stability.md#stability-levels-explained) 단계입니다. 옵트인하려면 빌드 파일에 다음 컴파일러 옵션을 추가하세요:

<tabs group="build-system">
<tab title="Gradle" group-key="gradle">

```kotlin
kotlin {
    compilerOptions {
        freeCompilerArgs.add("-Xexplicit-context-arguments")
    }
}
```

</tab>
<tab title="Maven" group-key="maven">

```xml
<build>
    <plugins>
        <plugin>
            <groupId>org.jetbrains.kotlin</groupId>
            <artifactId>kotlin-maven-plugin</artifactId>
            <configuration>
                <args>
                    <arg>-Xexplicit-context-arguments</arg>
                </args>
            </configuration>
        </plugin>
    </plugins>
</build>
```

</tab>
</tabs>

자세한 내용은 해당 기능의 [KEEP](https://github.com/Kotlin/KEEP/blob/main/proposals/KEEP-0448-explicit-context-arguments.md)을 참조하세요.

### 컬렉션 리터럴 지원
<primary-label ref="experimental-opt-in"/>

<secondary-label ref="language"/>

Kotlin %kotlinEapVersion%은 컬렉션 리터럴(Collection literals)에 대한 실험적 지원을 도입합니다. 이제 대괄호 `[]`를 사용하여 컬렉션을 더 간단하고 간결하게 생성할 수 있습니다.

예시:

```kotlin
fun main() {
    // 명시적 타입 선언을 사용한 변경 가능한 리스트
    // val shapes: MutableList<String> = mutableListOf("triangle", "square", "circle")

    // 대괄호 구문을 사용한 변경 가능한 리스트
    val shapes: MutableList<String> = ["triangle", "square", "circle"]
    println(shapes)
    // [triangle, square, circle]
}
```
{validate="false"}

> 현재 컬렉션 리터럴은 Java에 정의된 컬렉션을 생성하는 데 사용할 수 없습니다. 자세한 내용은 [KT-80494](https://youtrack.jetbrains.com/issue/KT-80494)를 참조하세요.
>
{style="note"}

컴파일러가 컬렉션 타입을 유추하기에 정보가 부족한 경우 기본적으로 `List` 타입을 사용합니다.

```kotlin
fun main() {
    val fruit = ["apple", "banana", "cherry"]
    
    println(fruit)
    // [apple, banana, cherry]
}
```
{validate="false"}

또한 커스텀 `operator fun of` 함수를 선언하여 고유한 타입에 대괄호 구문을 사용할 수도 있습니다. 예를 들어, 다음과 같은 `DoubleMatrix` 클래스가 있다고 가정해 보겠습니다.

```kotlin
class DoubleMatrix(vararg val rows: Row) {
    companion object {
        operator fun of(vararg rows: Row) = DoubleMatrix(*rows)
    }
    class Row(vararg val elements: Double) {
        companion object {
            operator fun of(vararg elements: Double) = Row(*elements)
        }
    }
}
```
{validate="false"}

다음과 같이 `identityMatrix` 클래스 인스턴스를 생성할 수 있습니다:

```kotlin
fun main() {
    val identityMatrix: DoubleMatrix = [
        [1.0, 0.0, 0.0],
        [0.0, 1.0, 0.0],
        [0.0, 0.0, 1.0],
    ]
}
```
{validate="false"}

이 예제에서 컴파일러는 중첩된 컬렉션 리터럴을 해당 `operator fun of` 함수 호출로 변환합니다. 컴파일러는 이러한 호출을 재귀적으로 해결하고 예상되는 타입을 사용하여 올바른 오버로드를 선택합니다.

이 기능은 [실험적(Experimental)](components-stability.md#stability-levels-explained) 단계입니다. 옵트인하려면 빌드 파일에 다음 컴파일러 옵션을 추가하세요:

<tabs group="build-system">
<tab title="Gradle" group-key="gradle">

```kotlin
kotlin {
    compilerOptions {
        freeCompilerArgs.add("-Xcollection-literals")
    }
}
```

</tab>
<tab title="Maven" group-key="maven">

```xml
<build>
    <plugins>
        <plugin>
            <groupId>org.jetbrains.kotlin</groupId>
            <artifactId>kotlin-maven-plugin</artifactId>
            <configuration>
                <args>
                    <arg>-Xcollection-literals</arg>
                </args>
            </configuration>
        </plugin>
    </plugins>
</build>
```

</tab>
</tabs>

자세한 내용은 해당 기능의 [KEEP](https://github.com/Kotlin/KEEP/blob/main/proposals/KEEP-0416-collection-literals.md)을 참조하세요.

### 컴파일 타임 상수 개선
<primary-label ref="experimental-opt-in"/>

<secondary-label ref="language"/>

Kotlin %kotlinEapVersion%은 [컴파일 타임 상수(Compile-time constants)](properties.md#compile-time-constants)에 대한 실험적 개선을 통해 숫자 및 문자열 타입에 대한 지원을 더욱 일관되고 사용하기 쉽게 만듭니다. 이러한 개선 사항에는 다음에 대한 지원이 포함됩니다:

* 부호 없는 타입(Unsigned type) 연산.
* `.lowercase()`, `.uppercase()`, `.trim()`과 같은 문자열용 표준 라이브러리 함수.
* [열거형 상수(Enum constants)](enum-classes.md#working-with-enum-constants)의 `.name` 프로퍼티 및 [`KCallable` 인터페이스](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.reflect/-k-callable/) 평가.

어떤 함수가 컴파일 타임에 평가되는지 명확히 하기 위해 Kotlin %kotlinEapVersion%은 `IntrinsicConstEvaluation` 어노테이션을 도입합니다. 일부 함수는 컴파일 타임에 평가되지만 아직 어노테이션이 없을 수 있습니다. 향후 릴리스에서 나머지 함수들에 어노테이션이 추가될 예정입니다. 지원되는 함수 목록은 KEEP [부록(appendix)](https://github.com/Kotlin/KEEP/blob/main/proposals/KEEP-0444-improve-compile-time-constants.md#appendix)을 참조하세요.

이 기능은 [실험적(Experimental)](components-stability.md#stability-levels-explained) 단계입니다. 옵트인하려면 빌드 파일에 다음 컴파일러 옵션을 추가하세요:

<tabs group="build-system">
<tab title="Gradle" group-key="gradle">

```kotlin
kotlin {
    compilerOptions {
        freeCompilerArgs.add("-XIntrinsic-const-evaluation")
    }
}
```

</tab>
<tab title="Maven" group-key="maven">

```xml
<build>
    <plugins>
        <plugin>
            <groupId>org.jetbrains.kotlin</groupId>
            <artifactId>kotlin-maven-plugin</artifactId>
            <configuration>
                <args>
                    <arg>-XIntrinsic-const-evaluation</arg>
                </args>
            </configuration>
        </plugin>
    </plugins>
</build>
```

</tab>
</tabs>

자세한 내용은 해당 기능의 [KEEP](https://github.com/Kotlin/KEEP/blob/main/proposals/KEEP-0444-improve-compile-time-constants.md)을 참조하세요.

## 표준 라이브러리

Kotlin %kotlinEapVersion%은 공통 Kotlin 표준 라이브러리의 UUID 지원을 안정화합니다. 또한 JVM에서 부호 없는 정수를 `BigInteger`로 변환하기 위한 새로운 확장 함수와 정렬 순서 확인 지원을 추가합니다.

### 공통 Kotlin 표준 라이브러리의 Stable UUID
<secondary-label ref="standard-library"/>

Kotlin 2.0.20에서는 [UUID(Universally Unique Identifiers)를 생성하기 위한 클래스](whatsnew2020.md#support-for-uuids-in-the-common-kotlin-standard-library)가 도입되었으며 Kotlin과 Java UUID 간의 변환 지원이 추가되었습니다. 이후 릴리스에서는 다음 지원을 추가하며 이 실험적 기능을 점진적으로 개선했습니다:

* [`<` 및 `>` 연산자를 사용한 UUID 비교](whatsnew2120.md#changes-in-uuid-parsing-formatting-and-comparability)
* [hex-and-dash 및 일반 텍스트 형식의 UUID 파싱](whatsnew2120.md#changes-in-uuid-parsing-formatting-and-comparability)
* [유효하지 않은 UUID 파싱 시 `null` 반환](whatsnew23.md#support-for-returning-null-when-parsing-invalid-uuids).

Kotlin %kotlinEapVersion%에서는 [`kotlin.uuid.Uuid` API](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.uuid/-uuid/)가 [Stable](components-stability.md#stability-levels-explained) 단계가 되었습니다. 단, [V4 및 V7 UUID 생성을 위한 함수](whatsnew23.md#support-for-generating-v7-uuids-for-specific-timestamps)는 예외적으로 [실험적(Experimental)](components-stability.md#stability-levels-explained) 단계로 유지되며 여전히 옵트인이 필요합니다.

### 정렬 순서 확인 지원
<secondary-label ref="standard-library"/>

Kotlin %kotlinEapVersion%은 반복 가능한 객체(Iterables), 배열 및 시퀀스의 정렬 순서를 확인하기 위한 새로운 확장 함수를 추가했습니다.

추가된 확장 함수는 다음과 같습니다:

* `.isSorted()`
* `.isSortedDescending()`
* `.isSortedWith(comparator)`
* `.isSortedBy(selector)`
* `.isSortedByDescending(selector)`

이러한 확장 함수를 사용하면 요소를 다시 정렬하거나 별도의 헬퍼 함수를 만들지 않고도 요소가 이미 정렬되어 있는지 확인할 수 있습니다. 요소가 지정된 순서대로 정렬되어 있거나 요소가 두 개 미만인 경우 `true`를 반환하고, 그렇지 않으면 `false`를 반환합니다. 이 함수들은 순서가 맞지 않는 쌍을 발견하는 즉시 실행을 멈추므로 대규모 입력에서도 효율적입니다.

다음은 `.isSorted()` 및 `.isSortedBy()` 함수를 사용하여 정렬 순서를 확인하는 예제입니다:

```kotlin
data class User(val name: String, val age: Int)

fun main() {
    val numbers = listOf(1, 2, 3, 4)
    println(numbers.isSorted())
    // true

    val users = listOf(
        User("Alice", 24),
        User("Bob", 31),
        User("Charlie", 29),
    )
    println(users.isSortedBy(User::age))
    // false
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="2.4.0-Beta2" id="kotlin-2-4-0-check-sorted-order"}

[YouTrack](https://youtrack.jetbrains.com/issue/KT-78499)을 통해 여러분의 의견을 들려주세요.

### JVM에서 부호 없는 정수를 `BigInteger`로 변환하기 위한 새로운 API
<secondary-label ref="standard-library"/>

Kotlin %kotlinEapVersion%은 JVM에서 `UInt.toBigInteger()` 및 `ULong.toBigInteger()` 확장 함수를 도입합니다.

이전에는 `UInt` 및 `ULong` 값을 `BigInteger`로 변환하려면 문자열 기반의 우회 방식이나 사용자 정의 변환 로직이 필요했습니다. Kotlin %kotlinEapVersion%부터는 `.toBigInteger()`를 사용하여 부호 없는 정수 값을 `BigInteger`로 직접 변환할 수 있습니다.

다음은 그 예시입니다:

```kotlin
fun main() {
    //sampleStart
    val unsignedLong = Long.MAX_VALUE.toULong() + 1uL
    val unsignedInt = UInt.MAX_VALUE

    println(unsignedLong.toBigInteger())
    // 9223372036854775808

    println(unsignedInt.toBigInteger())
    // 4294967295
   //sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="2.4.0-Beta2" id="kotlin-2-4-0-convert-unsigned-int"}

[YouTrack](https://youtrack.jetbrains.com/issue/KT-73111)을 통해 여러분의 의견을 들려주세요.

## Kotlin/JVM

Kotlin %kotlinEapVersion%은 새로운 Java 버전을 지원하고 메타데이터의 어노테이션을 기본적으로 활성화합니다.

### Java 26 지원
<secondary-label ref="jvm"/>

Kotlin %kotlinEapVersion%부터 컴파일러는 Java 26 바이트코드를 포함하는 클래스를 생성할 수 있습니다.

### 메타데이터의 어노테이션 기본 활성화
<secondary-label ref="jvm"/>

Kotlin 2.2.0의 Kotlin 메타데이터 JVM 라이브러리에서는 [Kotlin 메타데이터에 저장된 어노테이션을 읽는 기능을 도입했습니다](whatsnew22.md#support-for-reading-and-writing-annotations-in-kotlin-metadata). 이 지원을 통해 Kotlin 컴파일러는 어노테이션을 JVM 바이트코드와 함께 메타데이터에 기록하여 Kotlin 메타데이터 JVM 라이브러리에서 액세스할 수 있도록 합니다. 결과적으로 어노테이션 프로세서 및 기타 도구들은 리플렉션을 사용하거나 소스 코드를 수정하지 않고도 메타데이터 수준에서 이러한 어노테이션을 이해하고 조작할 수 있습니다.

Kotlin %kotlinEapVersion%에서는 이 지원 기능이 기본적으로 활성화됩니다.

## Kotlin/Native

Kotlin %kotlinEapVersion%은 Swift 패키지 임포트 지원, Swift export를 통한 상호운용성 개선, 가비지 컬렉터의 기본 동시 마킹(Concurrent marking)을 제공합니다.

### Swift 패키지 임포트
<primary-label ref="experimental-general"/>

<secondary-label ref="native"/>

이제 Kotlin Multiplatform 프로젝트의 Gradle 구성에서 iOS 앱을 위한 의존성으로 [Swift 패키지](https://docs.swift.org/swiftpm/documentation/packagemanagerdocs/)를 선언할 수 있습니다:

```kotlin
// build.gradle.kts
kotlin {

    swiftPMDependencies {
        swiftPackage(
            url = url("https://github.com/firebase/firebase-ios-sdk.git"),
            version = from("12.11.0"),
            products = listOf(
                product("FirebaseAI"),
                product("FirebaseAnalytics"),
                ...
}
```
{validate="false"}

실행 가능한 샘플과 더 자세한 정보는 [SwiftPM 임포트](https://kotlinlang.org/docs/multiplatform/multiplatform-spm-import.html)를 참조하세요.

프로젝트가 CocoaPods 의존성에 의존하고 있는 경우, 현재 설정을 Swift 패키지를 사용하도록 마이그레이션할 수 있습니다. KMP 도구는 이 사용 사례를 고려하여 프로젝트를 자동으로 재구성할 수 있도록 도와줍니다. 자세한 내용은 [CocoaPods 마이그레이션 가이드](https://kotlinlang.org/docs/multiplatform/multiplatform-cocoapods-spm-migration.html)를 참조하세요.

### Swift export: 코루틴 Flow export 지원
<primary-label ref="experimental-general"/>

<secondary-label ref="native"/>

Kotlin %kotlinEapVersion%은 `kotlinx.coroutines` Flow를 Swift로 export하는 기능을 추가하여 Swift export를 통한 Kotlin과 Swift의 상호운용성을 더욱 개선합니다.

`kotlinx.coroutines`의 Flow는 동시에 방출(emit) 및 소비(consume)될 수 있는 비동기 데이터 스트림을 나타냅니다. 이는 데이터베이스 업데이트 수신, 네트워크 요청 또는 UI 이벤트와 같은 반응형 프로그래밍 패턴에 흔히 사용됩니다.

이전에는 [`kotlinx.coroutines.flow`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.flow/-flow/)의 `Flow` 인터페이스를 Swift에 노출하려면 서드파티 솔루션을 사용해야만 했습니다. 이제는 별도의 도구 없이도 Flow를 Swift의 관용적인 대응물인 [`AsyncSequence`](https://developer.apple.com/documentation/Swift/AsyncSequence)로 직접 export할 수 있습니다.

이 기능은 기본적으로 활성화됩니다. 타입 정보를 유지하면서 `Flow` 타입을 사용하는 모든 공개 API를 Swift로 export할 수 있습니다.
예를 들어:

```kotlin
// Kotlin
// Export 시 String 타입이 유지됩니다.
fun flowOfStrings(): Flow<String> = flowOf("hello", "any", "world")
```

```Swift
// Swift
var actual: [String] = []
// Kotlin으로부터 String 타입이 올바르게 추론됩니다.
for try await element in flowOfStrings().asAsyncSequence() {
    actual.append(element)
}
```

Swift export에 대한 자세한 내용은 [문서](native-swift-export.md)를 참조하세요.

### 가비지 컬렉터의 기본 동시 마킹
<secondary-label ref="native"/>

Kotlin 2.0.20에서 Kotlin 팀은 CMS GC(Concurrent Mark and Sweep Garbage Collector)에 대한 [실험적 지원을 도입했습니다](whatsnew2020.md#concurrent-marking-in-garbage-collector). 사용자 피드백을 반영하고 회귀 문제를 해결한 결과, Kotlin %kotlinEapVersion%부터 CMS를 기본적으로 활성화하게 되었습니다.

이전의 기본 설정이었던 PMCS(Parallel Mark Concurrent Sweep)는 GC가 힙의 객체를 마킹하는 동안 애플리케이션 스레드를 일시 중지해야 했습니다. 반면 CMS는 마킹 단계를 애플리케이션 스레드와 동시에 실행할 수 있게 해줍니다.

이는 GC 일시 중지 시간과 앱 응답성을 크게 향상시키며, 특히 지연 시간에 민감한 애플리케이션의 성능에 중요합니다. CMS는 이미 [Compose Multiplatform](https://blog.jetbrains.com/kotlin/2024/10/compose-multiplatform-1-7-0-released/#performance-improvements-on-ios)으로 빌드된 UI 애플리케이션의 벤치마크에서 그 효과가 입증되었습니다.

문제가 발생하는 경우 PMCS로 되돌릴 수 있습니다. `gradle.properties` 파일에 다음 [바이너리 옵션](native-binary-options.md)을 설정하세요:

```none
kotlin.native.binary.gc=pmcs
```

Kotlin/Native 가비지 컬렉터에 대한 자세한 내용은 [문서](native-memory-manager.md#garbage-collector)를 참조하세요.

## Kotlin/Wasm

Kotlin %kotlinEapVersion%은 Kotlin/Wasm의 증분 컴파일(Incremental compilation)을 기본적으로 활성화하고 WebAssembly 컴포넌트 모델 지원을 도입합니다.

### 증분 컴파일 기본 활성화

<secondary-label ref="wasm"/>

Kotlin/Wasm은 2.1.0에서 증분 컴파일을 도입했습니다. Kotlin %kotlinEapVersion%부터 이 기능은 [Stable](components-stability.md#stability-levels-explained) 단계가 되었으며 기본적으로 활성화됩니다.
이 기능을 사용하면 컴파일러가 최근 변경 사항의 영향을 받는 파일만 다시 빌드하므로 빌드 시간이 크게 단축됩니다.

증분 컴파일을 비활성화하려면 프로젝트의 `local.properties` 또는 `gradle.properties` 파일에 다음 줄을 추가하세요:

```none
# gradle.properties
kotlin.incremental.wasm=false
```

문제가 발생하는 경우 [YouTrack](https://kotl.in/issue)에 보고해 주세요.

### WebAssembly 컴포넌트 모델 지원
<primary-label ref="experimental-general"/>

<secondary-label ref="wasm"/>

Kotlin/Wasm은 Kotlin %kotlinEapVersion%에서 [WebAssembly 컴포넌트 모델(Component Model)](https://component-model.bytecodealliance.org/)에 대한 실험적 지원을 도입하며 한 걸음 더 나아갑니다. 이 제안은 표준화된 인터페이스와 타입을 통해 Wasm 모듈로부터 컴포넌트를 빌드하는 방법을 정의합니다. 이 접근 방식은 Wasm이 저수준 바이너리 명령 형식에서 언어에 구애받지 않는 재사용 가능한 컴포넌트를 구성하기 위한 시스템으로 진화하도록 돕습니다. 이를 통해 Kotlin/Wasm은 브라우저를 넘어 확장될 수 있습니다. 예를 들어, Kotlin과 WebAssembly는 FaaS(Function-as-a-Service) 또는 서버리스 애플리케이션에 매우 적합합니다.

이 기능을 체험해 보려면 [`wasi:http`로 구축된 간단한 서버](https://github.com/Kotlin/sample-wasi-http-kotlin/)를 확인해 보세요.

<img src="kotlin-wasm-wasi-http.gif" alt="Kotlin/Wasm with WebAssembly Component Model" width="600"/>

[YouTrack](https://youtrack.jetbrains.com/issue/KT-64569/Kotlin-Wasm-Support-Component-Model)을 통해 의견을 공유해 주세요.

## Kotlin/JS

Kotlin %kotlinEapVersion%은 JavaScript/TypeScript로의 값 클래스 export 지원과 JS 코드 인라인화 시 ES2015 기능을 추가했습니다.

### JavaScript/TypeScript로의 값 클래스 export 지원
<secondary-label ref="js"/>

이전에는 일반적인 Kotlin 클래스만 JavaScript/TypeScript로 export할 수 있었습니다.
Kotlin %kotlinEapVersion%에서는 이 제한이 사라졌습니다. 이제 Kotlin의 [인라인 값 클래스(Inline value classes)](inline-classes.md)를 일반 TypeScript 클래스로 export할 수 있습니다.

값 클래스를 export하려면 Kotlin 측에서 `@JsExport` 어노테이션을 표시하세요:

```Kotlin
// Kotlin
@JsExport
@JvmInline
value class Email(val address: String) {
    init { require(address.contains("@")) { "Invalid email" } }
}

@JsExport
class AuthService {
    suspend fun login(email: Email): String = ...
}
```

TypeScript 측에서는 일반 클래스처럼 보입니다:

```TypeScript
// TypeScript
import { AuthService, Email } from "..."
const auth = new AuthService();

console.log(await auth.login(new Email("jane@example.com"))); 
// "Welcome, jane@example.com!"
console.log(await auth.login(new Email("not-an-email"))); 
// "Invalid email"
```

자세한 내용은 [`@JsExport` 어노테이션](js-to-kotlin-interop.md#jsexport-annotation) 문서를 참조하세요.

### JS 코드 인라인화 시 ES2015 기능 지원
<secondary-label ref="js"/>

Kotlin %kotlinEapVersion%부터 JavaScript 코드 인라인화는 [ES2015 기능](js-project-setup.md#support-for-es2015-features)을 완전히 지원합니다.

이는 서드파티 라이브러리와의 상호운용성뿐만 아니라 자동 생성되는 애플리케이션 코드를 직접 제어하는 데에도 유용합니다.

이제 다음을 포함하여 [`js()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.js/js.html) 호출 내에서 현대적인 JS 기능을 사용할 수 있습니다:

* 람다 ([화살표 함수(Arrow functions)](whatsnew21.md#support-for-generating-es2015-arrow-functions))
* ES 클래스
* 템플릿 문자열
* 스프레드(Spread) 연산자
* `const` 및 `let` 변수 선언
* 제너레이터(Generators)

`js()` 함수의 파라미터는 컴파일 시점에 파싱되어 JavaScript 코드로 "있는 그대로" 번역되므로 문자열 상수여야 한다는 점을 기억하세요.
예를 들어, 스프레드 연산자를 사용하는 경우 다음과 같이 작성합니다:

```kotlin
fun spreadExample(): dynamic = js("""
    const add = (a, b, c) => a + b + c;

    const nums = [1, 2, 3];
    const sum = add(...nums);

    const a = [1, 2, 3];
    const b = [...a, 4, 5, 6];

    return { sum, b: b };
""")
```

인라인 JavaScript 코드에 대한 자세한 내용은 [문서](js-interop.md#inline-javascript)를 참조하세요.

## Gradle

Kotlin %kotlinEapVersion%은 Gradle 7.6.3부터 9.5.0까지와 완전히 호환됩니다. 최신 Gradle 릴리스 버전까지도 사용할 수 있습니다. 그러나 이 경우 지원 중단(deprecation) 경고가 발생할 수 있으며 일부 새로운 Gradle 기능이 작동하지 않을 수 있습니다.

## Maven

Kotlin %kotlinEapVersion%은 Java와 JVM 타겟 버전 간의 자동 정렬을 통해 프로젝트 구성을 더욱 쉽게 만들어 줍니다.

### Java 및 JVM 타겟 버전의 자동 정렬
<secondary-label ref="maven"/>

프로젝트 구성을 단순화하고 호환성 문제를 방지하기 위해, Kotlin Maven 플러그인은 이제 JVM 타겟 버전을 프로젝트에 구성된 Java 컴파일러 버전과 자동으로 정렬합니다.

이를 통해 Kotlin 및 Maven 컴파일러가 동일한 바이트코드 버전을 타겟팅하도록 보장하며, Kotlin이 생성한 바이트코드가 프로젝트의 나머지 부분이나 배포 환경과 호환되지 않는 문제를 방지합니다.

`<extensions>` 옵션이 활성화된 경우 `kotlin.compiler.jvmTarget` 프로퍼티가 필요하지 않습니다. 프로퍼티가 정의되어 있지 않으면 Kotlin Maven 플러그인은 다음 순서에 따라 JVM 타겟 버전을 자동으로 확인합니다:

1. 프로젝트 프로퍼티 또는 `maven-compiler-plugin` 구성 내에 정의된 `maven.compiler.release` 버전.

    이 경우 `jvmTarget` 및 `jdkRelease` 컴파일러 옵션이 모두 Kotlin 컴파일러에 설정되어 API가 특정 JDK 버전으로 제한됩니다.

2. Maven 릴리스 버전이 설정되지 않은 경우 `maven.compiler.target` 버전. 컴파일러 타겟은 프로젝트 프로퍼티 또는 `maven-compiler-plugin` 구성 내에 정의될 수 있습니다.

    이 경우 Kotlin의 `jvmTarget`만 설정되며 API가 특정 JDK 버전으로 제한되지 않습니다.

이 기능은 Kotlin 프로젝트 구성을 크게 단순화하여 `pom.xml` 파일을 다음과 같이 작성할 수 있게 해줍니다:

```xml
<properties>
    <maven.compiler.release>17</maven.compiler.release>
    <kotlin.version>%kotlinVersion%</kotlin.version>
</properties>

<build>
    <plugins>
        <plugin>
            <groupId>org.jetbrains.kotlin</groupId>
            <artifactId>kotlin-maven-plugin</artifactId>
            <version>${kotlin.version}</version>
            <extensions>true</extensions>
        </plugin>
    </plugins>
</build>
```

빌드 중에 플러그인은 다음과 유사한 메시지를 출력합니다:

```none
[INFO] Using jvmTarget=17 (derived from maven.compiler.release=17)
```

> `<extensions>` 옵션은 프로젝트 수준 프로퍼티와 전역 `maven-compiler-plugin` 구성만 확인합니다.
> 플러그인의 `<executions>` 섹션에 정의된 구성은 확인하지 않습니다.
>
{style="note"}

자동 프로젝트 구성에 대한 자세한 내용은 [문서](maven-configure-project.md#automatic-configuration)를 참조하세요.

## Kotlin 컴파일러

Kotlin %kotlinEapVersion%은 `.klib` 컴파일 중 동일한 모듈에 선언된 인라인 함수에 대해 더욱 일관된 동작을 제공합니다.

### .klib 컴파일 중 일관된 모듈 내 함수 인라인화
<secondary-label ref="compiler"/>

이전에는 [인라인 함수(Inline functions)](inline-functions.md)가 플랫폼마다 다르게 동작했습니다. JetBrains 팀은 동일한 호환성 보장을 위해 지원되는 모든 플랫폼에서 이를 통일하는 작업을 진행하고 있습니다.

Kotlin/JVM에서 함수 인라인화는 컴파일 시점에 발생합니다. 따라서 Kotlin 소스가 Kotlin/JVM 컴파일러로 컴파일될 때, 인라인 함수의 본문이 호출 지점에 인라인화되므로 결과 클래스 파일의 바이트코드에는 인라인 함수 호출이 남지 않습니다. 즉, 컴파일 중에 그 동작이 고정됩니다.

반대로 Kotlin/Native, Kotlin/JS, Kotlin/Wasm에서는 소스에서 klib로 컴파일하는 과정에서 함수 인라인화가 발생하지 않고 바이너리 생성 중에만 발생했습니다. 그 결과, `.klib` 컴파일 중에는 인라인 함수의 동작이 고정되지 않았으며, `.klib` 라이브러리는 Kotlin/JVM처럼 인라인 함수에 대해 동일한 호환성 보장을 제공하지 못했습니다.

Kotlin %kotlinEapVersion%은 `.klib` 아티팩트를 생성할 때 모듈 내 인라인화(Intra-module inlining)를 활성화함으로써 인라인 함수 동작을 통일하는 첫 단계를 밟았습니다.

```kotlin
// 기존 logging.klib 라이브러리
inline fun logDebug(message: String) {
    println("[DEBUG] $message")
}
```

```kotlin
// 현재 컴파일 중인 App 모듈
inline fun greetUser(name: String) {
    println("Hello, $name!")
}

fun main() {
    logDebug("App started") // 인라인화되지 않음: 다른 모듈에 선언됨
    greetUser("Alice")      // 인라인화됨: 동일한 모듈에 선언됨
}
```

`.klib`로 컴파일되면 코드는 다음과 유사한 모습이 됩니다:

```kotlin
// 의사코드(Pseudocode)
fun main() {
    logDebug("App started")  // 인라인화되지 않음, 다른 모듈에 선언됨
    val tmp0 = "Alice"
    println("Hello, $tmp0!") // greetUser()에서 인라인화됨
}
```

즉, `.klib` 컴파일 중에는 동일한 모듈에 선언된 인라인 함수만 인라인화됩니다. 이 경우 다른 함수들은 플랫폼별 바이너리를 생성하는 동안 인라인화됩니다.

#### 활성화 방법

%kotlinEapVersion%부터 Kotlin/Native, Kotlin/JS, Kotlin/Wasm의 모듈 내 인라인화가 기본적으로 활성화됩니다.

이 기능과 관련하여 예상치 못한 문제가 발생하는 경우, 명령줄에서 다음 컴파일러 옵션을 사용하여 비활성화할 수 있습니다:

```bash
-Xklib-ir-inliner=disabled
```

다음 단계는 프로젝트의 모든 인라인 함수가 일관되게 인라인화되도록 교차 모듈 인라인화(Cross-module inlining)를 활성화하는 것입니다. 이 변경은 향후 Kotlin 릴리스에서 계획되어 있지만, 명령줄에서 다음 컴파일러 옵션을 사용하여 미리 사용해 볼 수 있습니다:

```bash
-Xklib-ir-inliner=full
```

피드백을 공유하거나 문제는 [YouTrack](https://kotl.in/issue)에 보고해 주세요.