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

* **언어**: [컨텍스트 파라미터(Context parameters)의 Stable 단계 진입 및 어노테이션 사용 지점 대상(Annotation use-site targets)을 위한 다양한 기능](#stable-features-context-parameters-and-features-for-annotation-use-site-targets)
* **표준 라이브러리**: [부호 없는 정수(Unsigned integers)를 `BigInteger`로 변환하기 위한 새로운 API](#new-api-for-converting-unsigned-integers-to-biginteger-on-the-jvm) 및 [정렬 순서 확인 지원](#support-for-checking-sorted-order)
* **Kotlin/JVM**: [Java 26 지원](#support-for-java-26) 및 [메타데이터의 어노테이션 기본 활성화](#annotations-in-metadata-enabled-by-default)
* **Kotlin/Native**: [Swift 패키지를 의존성으로 지원](#swift-package-import)
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

* [컨텍스트 파라미터(Context parameters)](whatsnew22.md#preview-of-context-parameters) (단, [명시적 컨텍스트 인자](#explicit-context-arguments-for-context-parameters) 및 [호출 가능 참조(Callable references)](https://github.com/Kotlin/KEEP/blob/context-parameters/proposals/context-parameters.md#callable-references) 제외)
* [어노테이션 사용 지점 대상(Annotation use-site targets)을 위한 기능](whatsnew22.md#preview-of-features-for-annotation-use-site-targets)
* [JVM에서 부호 없는 정수를 `BigInteger`로 변환하기 위한 새로운 API](#new-api-for-converting-unsigned-integers-to-biginteger-on-the-jvm)
* [정렬 순서 확인 지원](#support-for-checking-sorted-order)

## 새로운 기능 {id=new-experimental-features}
<primary-label ref="experimental-exp"/>

* [컨텍스트 파라미터를 위한 명시적 컨텍스트 인자(Explicit context arguments)](#explicit-context-arguments-for-context-parameters)
* [Swift 패키지 임포트](#swift-package-import)

## 언어

Kotlin %kotlinEapVersion%은 컨텍스트 파라미터 및 어노테이션 사용 지점 대상 기능을 [Stable](components-stability.md#stability-levels-explained) 단계로 승격합니다. 또한 이번 릴리스에서는 [컨텍스트 파라미터를 위한 명시적 컨텍스트 인자](#explicit-context-arguments-for-context-parameters)를 도입합니다.

### Stable 기능: 컨텍스트 파라미터 및 어노테이션 사용 지점 대상을 위한 기능
<secondary-label ref="language"/>

Kotlin 2.2.0에서는 몇 가지 언어 기능이 [실험적(Experimental)](components-stability.md#stability-levels-explained) 단계로 도입되었습니다. 이번 릴리스부터 다음 언어 기능들이 [Stable](components-stability.md#stability-levels-explained) 단계가 되었음을 알려드립니다.

* [컨텍스트 파라미터(Context parameters)](whatsnew22.md#preview-of-context-parameters) (단, [명시적 컨텍스트 인자](#explicit-context-arguments-for-context-parameters) 및 [호출 가능 참조(Callable references)](https://github.com/Kotlin/KEEP/blob/context-parameters/proposals/context-parameters.md#callable-references) 제외)
* [어노테이션 사용 지점 대상(Annotation use-site targets)을 위한 기능](whatsnew22.md#preview-of-features-for-annotation-use-site-targets)

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

## 표준 라이브러리

Kotlin %kotlinEapVersion%은 JVM에서 부호 없는 정수를 `BigInteger`로 변환하기 위한 새로운 확장 함수를 추가했습니다. 또한 반복 가능한 객체(Iterables), 배열(Arrays) 및 시퀀스(Sequences)에서 정렬 순서를 확인하는 기능을 추가했습니다.

### JVM에서 부호 없는 정수를 `BigInteger`로 변환하기 위한 새로운 API
<secondary-label ref="standard-library"/>

Kotlin %kotlinEapVersion%은 JVM에서 `UInt.toBigInteger()` 및 `ULong.toBigInteger()` 확장 함수를 도입합니다.

이전에는 `UInt` 및 `ULong` 값을 `BigInteger`로 변환하려면 문자열 기반의 우회 방식이나 사용자 정의 변환 로직이 필요했습니다. Kotlin %kotlinEapVersion%부터는 `.toBigInteger()`를 사용하여 부호 없는 정수 값을 `BigInteger`로 직접 변환할 수 있습니다.

다음은 그 예시입니다:

```kotlin
fun main() {
    val unsignedLong = Long.MAX_VALUE.toULong() + 1uL
    val unsignedInt = UInt.MAX_VALUE

    println(unsignedLong.toBigInteger())
    // 9223372036854775808

    println(unsignedInt.toBigInteger())
    // 4294967295
}
```

[YouTrack](https://youtrack.jetbrains.com/issue/KT-73111)을 통해 여러분의 의견을 들려주세요.

### 정렬 순서 확인 지원
<secondary-label ref="standard-library"/>

Kotlin %kotlinEapVersion%은 반복 가능한 객체, 배열 및 시퀀스의 정렬 순서를 확인하기 위한 새로운 확장 함수를 추가했습니다.

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

[YouTrack](https://youtrack.jetbrains.com/issue/KT-78499)을 통해 여러분의 의견을 들려주세요.

## Kotlin/JVM

Kotlin %kotlinEapVersion%은 새로운 Java 버전을 지원하고 메타데이터의 어노테이션을 기본적으로 활성화합니다.

### Java 26 지원
<secondary-label ref="jvm"/>

Kotlin %kotlinEapVersion%부터 컴파일러는 Java 26 바이트코드를 포함하는 클래스를 생성할 수 있습니다.

### 메타데이터의 어노테이션 기본 활성화
<secondary-label ref="jvm"/>

Kotlin 2.2.0의 Kotlin 메타데이터 JVM 라이브러리에서는 [Kotlin 메타데이터에 저장된 어노테이션을 읽는 기능을 도입했습니다](whatsnew22.md#support-for-reading-and-writing-annotations-in-kotlin-metadata). 이 지원을 통해 Kotlin 컴파일러는 어노테이션을 JVM 바이트코드와 함께 메타데이터에 기록하여 Kotlin 메타데이터 JVM 라이브러리에서 액세스할 수 있도록 합니다. 결과적으로 어노테이션 프로세서 및 기타 도구들은 리플렉션을 사용하거나 소스 코드를 수정하지 않고도 메타데이터 수준에서 이러한 어노테이션을 이해하고 조작할 수 있습니다.

Kotlin %kotlinEapVersion%에서는 이 기능이 기본적으로 활성화됩니다.

## Kotlin/Native

Kotlin %kotlinEapVersion%은 Swift 패키지 임포트 지원을 제공합니다.

### Swift 패키지 임포트
<secondary-label ref="native"/>

<primary-label ref="experimental-general"/>

이제 Kotlin Multiplatform 프로젝트의 Gradle 구성에서 iOS 앱을 위한 의존성으로 [Swift 패키지](https://docs.swift.org/swiftpm/documentation/packagemanagerdocs/)를 선언할 수 있습니다.

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

이 기능과 관련하여 예상치 못한 문제가 발생하는 경우, 명령줄에서 다음 컴파일러 옵션을 사용하여 비활성화할 수 있습니다.

```bash
-Xklib-ir-inliner=disabled
```

다음 단계는 프로젝트의 모든 인라인 함수가 일관되게 인라인화되도록 교차 모듈 인라인화(Cross-module inlining)를 활성화하는 것입니다. 이 변경은 향후 Kotlin 릴리스에서 계획되어 있지만, 명령줄에서 다음 컴파일러 옵션을 사용하여 미리 사용해 볼 수 있습니다.

```bash
-Xklib-ir-inliner=full
```

피드백을 공유하거나 문제는 [YouTrack](https://kotl.in/issue)에 보고해 주세요.