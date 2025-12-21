[//]: # (title: Kotlin 2.3.0의 새로운 기능)

_[출시일: 2025년 12월 16일](releases.md#release-details)_

Kotlin 2.3.0이 출시되었습니다! 주요 특징은 다음과 같습니다:

*   **언어**: [더욱 안정적이고 기본으로 제공되는 기능, 미사용 반환 값 검사기, 명시적 지원 필드, 컨텍스트 감지 해석 변경 사항](#language).
*   **Kotlin/JVM**: [Java 25 지원](#kotlin-jvm-support-for-java-25).
*   **Kotlin/Native**: [Swift 내보내기를 통한 상호 운용성 개선, 릴리스 작업 빌드 시간 단축, C 및 Objective-C 라이브러리 가져오기가 베타로 전환](#kotlin-native).
*   **Kotlin/Wasm**: [정규화된 이름 및 새 예외 처리 제안 기본으로 활성화, Latin-1 문자를 위한 새로운 압축 스토리지](#kotlin-wasm).
*   **Kotlin/JS**: [새로운 실험적인 suspend 함수 내보내기, `LongArray` 표현, 통합된 컴패니언 객체 접근 등](#kotlin-js).
*   **Gradle**: [Gradle 9.0과의 호환성 및 생성된 소스 등록을 위한 새 API](#gradle).
*   **Compose 컴파일러**: [축소된 Android 애플리케이션을 위한 스택 트레이스](#compose-compiler-stack-traces-for-minified-android-applications).
*   **표준 라이브러리**: [안정적인 시간 추적 기능 및 개선된 UUID 생성 및 구문 분석](#standard-library).

## IDE 지원

2.3.0을 지원하는 Kotlin 플러그인은 IntelliJ IDEA 및 Android Studio의 최신 버전에 포함되어 있습니다.
IDE에서 Kotlin 플러그인을 업데이트할 필요가 없습니다.
빌드 스크립트에서 [Kotlin 버전을](releases.md#update-to-a-new-kotlin-version) 2.3.0으로 변경하기만 하면 됩니다.

자세한 내용은 [새 릴리스로 업데이트](releases.md#update-to-a-new-kotlin-version)를 참조하세요.

## 언어

Kotlin 2.3.0은 기능 안정화에 중점을 두며, 미사용 반환 값을 감지하는 새로운 메커니즘을 도입하고
컨텍스트 감지 해석(context-sensitive resolution)을 개선합니다.

### 안정화된 기능

이전 Kotlin 릴리스에서는 여러 새로운 언어 기능이 실험적(Experimental) 및 베타(Beta)로 도입되었습니다.
다음 기능은 Kotlin 2.3.0에서 [안정화](components-stability.md#stability-levels-explained)되었습니다.

*   [중첩 타입 별칭 지원](whatsnew22.md#support-for-nested-type-aliases)
*   [`when` 표현식의 데이터 흐름 기반 완전성 검사](whatsnew2220.md#data-flow-based-exhaustiveness-checks-for-when-expressions)

### 기본으로 활성화된 기능

Kotlin 2.3.0에서는 [명시적 반환 타입이 있는 표현식 본문의 `return` 문](whatsnew2220.md#support-for-return-statements-in-expression-bodies-with-explicit-return-types) 지원이
이제 기본으로 활성화됩니다.

[Kotlin 언어 기능 및 제안 전체 목록](kotlin-language-features-and-proposals.md)을 참조하세요.

### 미사용 반환 값 검사기
<primary-label ref="experimental-general"/>

Kotlin 2.3.0은 무시된 결과를 방지하기 위해 미사용 반환 값 검사기(unused return value checker)를 도입합니다.
`Unit` 또는 `Nothing`이 아닌 값을 반환하는 표현식이 함수에 전달되지 않거나, 조건에서 확인되지 않거나, 다른 방식으로 사용되지 않을 때마다 경고를 발생시킵니다.

이 검사기는 함수 호출이 의미 있는 결과를 생성하지만, 그 결과가 아무런 경고 없이 무시되어 예기치 않은 동작이나 추적하기 어려운 문제로 이어질 수 있는 버그를 잡는 데 도움이 됩니다.

> 이 검사기는 `++` 및 `--`와 같은 증감 연산에서 반환되는 값은 무시합니다.
>
{style="note"}

다음 예시를 살펴보세요.

```kotlin
fun formatGreeting(name: String): String {
    if (name.isBlank()) return "Hello, anonymous user!"
    if (!name.contains(' ')) {
        // 이 결과가 무시됨을 검사기가 경고합니다.
        "Hello, " + name.replaceFirstChar(Char::titlecase) + "!"
    }
    val (first, last) = name.split(' ')
    return "Hello, $first! Or should I call you Dr. $last?"
}
```

이 예시에서는 문자열이 생성되었지만 사용되지 않으므로, 검사기는 이를 무시된 결과로 보고합니다.

이 기능은 [실험적(Experimental)](components-stability.md#stability-levels-explained)입니다.
옵트인하려면 빌드 파일에 다음 컴파일러 옵션을 추가하세요.

<tabs group="build-system">
<tab title="Gradle" group-key="gradle">

```kotlin
kotlin {
    compilerOptions {
        freeCompilerArgs.add("-Xreturn-value-checker=check")
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
                    <arg>-Xreturn-value-checker=check</arg>
                </args>
            </configuration>
        </plugin>
    </plugins>
</build>
```

</tab>
</tabs>

이 옵션을 사용하면 검사기는 Kotlin 표준 라이브러리의 대부분 함수와 같이 표시된 표현식에서만 무시된 결과를 보고합니다.

함수를 표시하려면 `@MustUseReturnValues` 어노테이션을 사용하여 검사기가 무시된 반환 값을 보고할 범위를 표시하세요.

예를 들어, 전체 파일을 표시할 수 있습니다.

```kotlin
// 이 파일의 모든 함수와 클래스를 표시하여 검사기가 미사용 반환 값을 보고하도록 합니다.
@file:MustUseReturnValues

package my.project

fun someFunction(): String
```

또는 특정 클래스를 표시할 수 있습니다.

```kotlin
// 이 클래스의 모든 함수를 표시하여 검사기가 미사용 반환 값을 보고하도록 합니다.
@MustUseReturnValues
class Greeter {
    fun greet(name: String): String = "Hello, $name"
}

fun someFunction(): Int = ...
```
{validate="false"}

빌드 파일에 다음 컴파일러 옵션을 추가하여 전체 프로젝트를 표시할 수도 있습니다.

<tabs group="build-system">
<tab title="Gradle" group-key="gradle">

```kotlin
kotlin {
    compilerOptions {
        freeCompilerArgs.add("-Xreturn-value-checker=full")
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
                    <arg>-Xreturn-value-checker=full</arg>
                </args>
            </configuration>
        </plugin>
    </plugins>
</build>
```

</tab>
</tabs>

이 설정을 사용하면 Kotlin은 컴파일된 파일을 `@MustUseReturnValues`로 어노테이션 처리된 것처럼 자동으로 간주하며, 검사기는 프로젝트 함수의 모든 반환 값을 보고합니다.

특정 함수에 대한 경고는 `@IgnorableReturnValue` 어노테이션으로 표시하여 비활성화할 수 있습니다.
`MutableList.add`와 같이 반환 값 무시가 일반적이고 예상되는 함수에 어노테이션을 지정합니다.

```kotlin
@IgnorableReturnValue
fun <T> MutableList<T>.addAndIgnoreResult(element: T): Boolean {
    return add(element)
}
```

함수 자체를 무시할 수 있다고 표시하지 않고도 경고를 비활성화할 수 있습니다.
이렇게 하려면 결과를 밑줄(`_`)이 있는 특수한 이름 없는 변수에 할당합니다.

```kotlin
// 무시할 수 없는 함수
fun computeValue(): Int = 42

fun main() {
    // 경고를 보고합니다: 결과가 무시됨
    computeValue()

    // 이 호출 사이트에서만 특수 미사용 변수로 경고를 비활성화합니다.
    val _ = computeValue()
}
```

자세한 내용은 기능의 [KEEP](https://github.com/Kotlin/KEEP/blob/main/proposals/KEEP-0412-unused-return-value-checker.md)을 참조하세요.

[YouTrack](https://youtrack.jetbrains.com/issue/KT-12719)에 피드백을 주시면 감사하겠습니다.

### 명시적 지원 필드
<primary-label ref="experimental-opt-in"/>

Kotlin 2.3.0은 명시적 지원 필드(explicit backing fields)를 도입합니다. 이는 기존의 암시적 지원 필드와 대조적으로 속성의 값을 보유하는 기본 필드를 명시적으로 선언하는 새로운 구문입니다.

새로운 명시적 구문은 속성의 내부 타입이 노출되는 API 타입과 다른 일반적인 지원 속성 패턴을 단순화합니다. 예를 들어, `ArrayList`를 사용하면서 읽기 전용 `List` 또는 `MutableList`로 노출할 수 있습니다.
이전에는 추가적인 private 속성이 필요했습니다.

명시적 지원 필드를 사용하면 `field`의 구현 타입이 속성 범위 내에서 직접 정의됩니다.
이렇게 하면 별도의 private 속성이 필요 없으며 컴파일러가 동일한 private 범위 내에서 지원 필드 타입으로 스마트 캐스팅을 자동으로 수행할 수 있습니다.

이전:

```kotlin
private val _city = MutableStateFlow<String>("")
val city: StateFlow<String> get() = _city

fun updateCity(newCity: String) {
    _city.value = newCity
}
```

이후:

```kotlin
val city: StateFlow<String>
    field = MutableStateFlow("")

fun updateCity(newCity: String) {
    // 스마트 캐스팅이 자동으로 작동합니다.
    city.value = newCity
}
```

이 기능은 [실험적(Experimental)](components-stability.md#stability-levels-explained)입니다.
옵트인하려면 빌드 파일에 다음 컴파일러 옵션을 추가하세요.

<tabs group="build-system">
<tab title="Gradle" group-key="gradle">

```kotlin
kotlin {
    compilerOptions {
        freeCompilerArgs.add("-Xexplicit-backing-fields")
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
                    <arg>-Xexplicit-backing-fields</arg>
                </args>
            </configuration>
        </plugin>
    </plugins>
</build>
```

</tab>
</tabs>

자세한 내용은 기능의 [KEEP](https://github.com/Kotlin/KEEP/blob/explicit-backing-fields/proposals/explicit-backing-fields.md)을 참조하세요.

[YouTrack](https://youtrack.jetbrains.com/issue/KT-14663)에 피드백을 주시면 감사하겠습니다.

### 컨텍스트 감지 해석 변경 사항
<primary-label ref="experimental-general"/>

컨텍스트 감지 해석(context-sensitive resolution)은 여전히 [실험적(Experimental)](components-stability.md#stability-levels-explained)이지만,
사용자 피드백을 기반으로 기능을 지속적으로 개선하고 있습니다.

*   현재 타입의 봉인된(sealed) 및 둘러싸는(enclosing) 슈퍼타입은 이제 검색의 컨텍스트 범위의 일부로 간주됩니다.
    다른 슈퍼타입 범위는 고려되지 않습니다. 동기 및 예시는 [KT-77823](https://youtrack.jetbrains.com/issue/KT-77823) YouTrack 이슈를 참조하세요.
*   타입 연산자 및 등가성이 관련될 때, 컴파일러는 이제 컨텍스트 감지 해석을 사용하면 해석이 모호해지는 경우 경고를 보고합니다. 이는 예를 들어 클래스의 충돌하는 선언이 임포트될 때 발생할 수 있습니다.
    동기 및 예시는 [KT-77821](https://youtrack.jetbrains.com/issue/KT-77821) YouTrack 이슈를 참조하세요.

현재 제안의 전체 텍스트는 [KEEP](https://github.com/Kotlin/KEEP/blob/main/proposals/KEEP-0379-context-sensitive-resolution.md)에서 확인할 수 있습니다.

## Kotlin/JVM: Java 25 지원

Kotlin 2.3.0부터 컴파일러는 Java 25 바이트코드를 포함하는 클래스를 생성할 수 있습니다.

## Kotlin/Native

Kotlin 2.3.0은 Swift 내보내기 지원 및 C, Objective-C 라이브러리 가져오기를 개선하고
릴리스 작업의 빌드 시간을 향상시킵니다.

### Swift 내보내기를 통한 상호 운용성 개선
<primary-label ref="experimental-general"/>

Kotlin 2.3.0은 Swift 내보내기를 통해 Kotlin과 Swift의 상호 운용성을 더욱 개선하여 네이티브 열거형 클래스(native enum classes) 및 가변 인자 함수 매개변수(variadic function parameters)를 지원합니다.

이전에는 Kotlin 열거형이 일반 Swift 클래스로 내보내졌습니다. 이제 매핑이 직접적이므로 일반 네이티브 Swift 열거형을 사용할 수 있습니다. 예를 들어:

```kotlin
// Kotlin
enum class Color(val rgb: Int) {
    RED(0xFF0000),
    GREEN(0x00FF00),
    BLUE(0x0000FF)
}

val color = Color.RED
```

```Swift
// Swift
public enum Color: Swift.CaseIterable, Swift.LosslessStringConvertible, Swift.RawRepresentable {
    case RED, GREEN, BLUE

    var rgb: Int { get }
}
```

또한 Kotlin의 [`vararg`](functions.md#variable-number-of-arguments-varargs) 함수는 이제 Swift의 가변 인자 함수 매개변수에 직접 매핑됩니다.

이러한 함수를 사용하면 가변 개수의 인자를 전달할 수 있습니다. 이는 인자의 개수를 미리 알 수 없거나, 타입을 지정하지 않고 컬렉션을 생성하거나 전달하려는 경우에 유용합니다. 예를 들어:

```kotlin
// Kotlin
fun log(vararg messages: String)
```

```Swift
// Swift
public func log(messages: Swift.String...)
```

> 가변 인자 함수 매개변수의 제네릭 타입은 아직 지원되지 않습니다.
>
{style="note"}

### C 및 Objective-C 라이브러리 가져오기가 베타로 전환
<primary-label ref="beta"/>

[C](native-c-interop.md) 및 [Objective-C](native-objc-interop.md) 라이브러리를 Kotlin/Native 프로젝트로 가져오는 기능 지원이
[베타(Beta)](components-stability.md#stability-levels-explained)로 전환되었습니다.

Kotlin, 종속성, Xcode의 다양한 버전과의 완벽한 호환성은 아직 보장되지 않지만, 이제 컴파일러는 바이너리 호환성 문제 발생 시 더 나은 진단 메시지를 출력합니다.

가져오기 기능은 아직 안정화되지 않았으며, 프로젝트에서 C 및 Objective-C 라이브러리를 사용할 때 C 및 Objective-C 상호 운용성과 관련된 특정 항목에 대해서는 여전히 `@ExperimentalForeignApi` 옵트인(opt-in) 어노테이션이 필요합니다.

*   네이티브 라이브러리 또는 메모리 작업 시 필요한 `kotlinx.cinterop.*` 패키지의 일부 API.
*   [플랫폼 라이브러리](native-platform-libs.md)를 제외한 네이티브 라이브러리의 모든 선언.

호환성과 소스 코드 변경을 방지하기 위해 새 안정화 상태는 어노테이션 이름에 반영되지 않습니다.

자세한 내용은 [C 및 Objective-C 라이브러리 가져오기 안정성](native-lib-import-stability.md)을 참조하세요.

### Objective-C 헤더 블록 타입의 기본 명시적 이름

Kotlin/Native 프로젝트에서 내보낸 Objective-C 헤더의 블록 타입에 대한 Kotlin 함수 타입의 명시적 매개변수 이름은 [Kotlin 2.2.20에서 도입](whatsnew2220.md#explicit-names-in-block-types-for-objective-c-headers)되었으며,
이제 기본으로 활성화됩니다. 이러한 매개변수 이름은 Xcode의 자동 완성 제안을 개선하고 Clang 경고를 피하는 데 도움이 됩니다.

다음 Kotlin 코드를 살펴보세요.

```kotlin
// Kotlin:
fun greetUser(block: (name: String) -> Unit) = block("John")
```

Kotlin은 Kotlin 함수 타입의 매개변수 이름을 Objective-C 블록 타입으로 전달하여
Xcode가 이를 제안에서 사용할 수 있도록 합니다.

```ObjC
// Objective-C:
greetUserBlock:^(NSString *name) {
    // ...
};
```

문제가 발생하는 경우 명시적 매개변수 이름을 비활성화할 수 있습니다.
그러려면 `gradle.properties` 파일에 다음 [바이너리 옵션](native-binary-options.md)을 추가하세요.

```none
kotlin.native.binary.objcExportBlockExplicitParameterNames=false
```

문제는 [YouTrack](https://kotl.in/issue)에 보고해 주시기 바랍니다.

### 릴리스 작업 빌드 시간 단축

Kotlin/Native는 2.3.0에서 여러 성능 개선 사항을 적용했습니다. 그 결과 `linkRelease*`와 같은 릴리스 작업(예: `linkReleaseFrameworkIosArm64`)의 빌드 시간이 단축되었습니다.

벤치마크에 따르면 릴리스 빌드는 프로젝트 크기에 따라 최대 40% 더 빨라질 수 있습니다. 이러한 개선 사항은 iOS를 대상으로 하는 Kotlin Multiplatform 프로젝트에서 가장 두드러집니다.

프로젝트 컴파일 시간 개선에 대한 자세한 팁은 [문서](native-improving-compilation-time.md)를 참조하세요.

### Apple 대상 지원 변경 사항

Kotlin 2.3.0은 Apple 대상의 최소 지원 버전을 올립니다.

*   iOS 및 tvOS의 경우 12.0에서 14.0으로.
*   watchOS의 경우 5.0에서 7.0으로.

공개 데이터에 따르면 이전 버전의 사용은 이미 매우 제한적입니다. 이 변경 사항은 Apple 대상의 전반적인 유지 관리를 간소화하고 Kotlin/Native에서 [Mac Catalyst](https://developer.apple.com/documentation/uikit/mac-catalyst)를 지원할 기회를 제공합니다.

프로젝트에서 이전 버전을 유지해야 하는 경우 빌드 파일에 다음 줄을 추가하세요.

```kotlin
kotlin {
    targets.withType<org.jetbrains.kotlin.gradle.plugin.mpp.KotlinNativeTarget>().configureEach {
        binaries.configureEach {
            freeCompilerArgs += "-Xoverride-konan-properties=minVersion.ios=12.0"
            freeCompilerArgs += "-Xoverride-konan-properties=minVersion.tvos=12.0"
        }
    }
}
```

이러한 설정은 성공적으로 컴파일될 것이 보장되지 않으며 빌드 중 또는 런타임에 앱이 손상될 수 있습니다.

이 릴리스는 또한 [Intel 칩 기반 Apple 대상의 지원 중단 주기](whatsnew2220.md#deprecation-of-x86-64-apple-targets)에서 다음 단계를 거칩니다.

Kotlin 2.3.0부터 `macosX64`, `iosX64`, `tvosX64`, `watchosX64` 대상은 지원 계층 3으로 강등됩니다.
이는 CI에서 테스트가 보장되지 않으며, 다른 컴파일러 릴리스 간의 소스 및 바이너리 호환성이 제공되지 않을 수 있음을 의미합니다.
Kotlin 2.4.0에서는 `x86_64` Apple 대상 지원을 최종적으로 제거할 계획입니다.

자세한 내용은 [Kotlin/Native 대상 지원](native-target-support.md)을 참조하세요.

## Kotlin/Wasm

Kotlin 2.3.0은 Kotlin/Wasm 대상에 대해 정규화된 이름(fully qualified names), `wasmWasi` 대상에 대해 새로운 예외 처리 제안을 기본으로 활성화하며, Latin-1 문자를 위한 압축 스토리지를 도입합니다.

### 정규화된 이름 기본으로 활성화

Kotlin/Wasm 대상에서는 런타임에 정규화된 이름(FQNs)이 기본으로 활성화되지 않았습니다.
FQNs를 사용하려면 `KClass.qualifiedName` 속성에 대한 지원을 수동으로 활성화해야 했습니다.

패키지 없는 클래스 이름만 접근 가능하여, JVM에서 Wasm 대상으로 포팅된 코드나 런타임에 정규화된 이름을 기대하는 라이브러리에 문제가 발생했습니다.

Kotlin 2.3.0에서는 Kotlin/Wasm 대상에서 `KClass.qualifiedName` 속성이 기본으로 활성화됩니다.
이는 추가 구성 없이도 런타임에 FQNs를 사용할 수 있음을 의미합니다.

FQNs를 기본으로 활성화하면 코드 이식성이 향상되고 정규화된 이름을 표시하여 런타임 오류가 더 유익해집니다.

이 변경 사항은 Latin-1 문자열 리터럴에 압축 스토리지를 사용하여 메타데이터를 줄이는 컴파일러 최적화 덕분에 컴파일된 Wasm 바이너리의 크기를 증가시키지 않습니다.

### Latin-1 문자를 위한 압축 스토리지

이전에는 Kotlin/Wasm이 문자열 리터럴 데이터를 있는 그대로 저장했으며, 이는 모든 문자가 UTF-16으로 인코딩되었음을 의미합니다. 이는 Latin-1 문자만 포함하거나 주로 포함하는 텍스트에는 최적화되지 않았습니다.

Kotlin 2.3.0부터 Kotlin/Wasm 컴파일러는 Latin-1 문자만 포함하는 문자열 리터럴을 UTF-8 형식으로 저장합니다.

이 최적화는 JetBrains의 [KotlinConf 애플리케이션](https://github.com/JetBrains/kotlinconf-app)에 대한 실험에서 보여주듯이 메타데이터를 크게 줄입니다. 그 결과:

*   최적화가 없는 빌드에 비해 Wasm 바이너리가 최대 13% 작아집니다.
*   이전 버전에서 저장되지 않았던 정규화된 이름이 활성화된 경우에도 Wasm 바이너리가 최대 8% 작아집니다.

이 압축 스토리지는 다운로드 및 시작 시간이 중요한 웹 환경에서 중요합니다. 또한 이 최적화는 이전에 [클래스의 정규화된 이름을 저장하고 `KClass.qualifiedName`을 기본으로 활성화하는 것](#fully-qualified-names-enabled-by-default)을 방해했던 크기 장벽을 제거합니다.

이 변경 사항은 기본으로 활성화되어 있으며 추가 작업이 필요하지 않습니다.

### `wasmWasi` 대상에 대해 새 예외 처리 제안 기본으로 활성화

이전에는 Kotlin/Wasm이 `wasmWasi`를 포함한 모든 대상에 대해 [레거시 예외 처리 제안](https://github.com/WebAssembly/exception-handling/blob/master/proposals/exception-handling/legacy/Exceptions.md)을 사용했습니다.
그러나 대부분의 독립형 WebAssembly 가상 머신(VM)은 [새 버전의 예외 처리 제안](https://github.com/WebAssembly/exception-handling/blob/main/proposals/exception-handling/Exceptions.md)에 맞춰지고 있습니다.

Kotlin 2.3.0부터 `wasmWasi` 대상에 대해 새로운 WebAssembly 예외 처리 제안이 기본으로 활성화되어 최신 WebAssembly 런타임과의 더 나은 호환성을 보장합니다.

`wasmWasi` 대상의 경우, 이 변경 사항은 일찍 도입해도 안전합니다. 이 대상을 대상으로 하는 애플리케이션은 일반적으로 덜 다양한 런타임 환경(종종 단일 특정 VM에서 실행)에서 실행되며, 이는 일반적으로 사용자가 제어하므로 호환성 문제의 위험이 줄어듭니다.

[`wasmJs` 대상](wasm-overview.md#kotlin-wasm-and-compose-multiplatform)의 경우 새 예외 처리 제안은 기본적으로 비활성화되어 있습니다.
`-Xwasm-use-new-exception-proposal` 컴파일러 옵션을 사용하여 수동으로 활성화할 수 있습니다.

## Kotlin/JS

Kotlin 2.3.0은 suspend 함수를 JavaScript로 내보내는 실험적 지원과 Kotlin의 `LongArray` 타입을 표현하기 위한 `BigInt64Array` 타입을 제공합니다.

이번 릴리스부터 인터페이스 내의 컴패니언 객체에 통합된 방식으로 접근하고, 컴패니언 객체가 있는 인터페이스에서 `@JsStatic` 어노테이션을 사용하고, 개별 함수 및 클래스에서 `@JsQualifier` 어노테이션을 사용하며, 새로운 `@JsExport.Default` 어노테이션을 통해 기본 내보내기를 사용할 수 있습니다.

### `JsExport`를 사용한 suspend 함수 내보내기
<primary-label ref="experimental-opt-in"/>

이전에는 `@JsExport` 어노테이션이 suspend 함수(또는 그러한 함수를 포함하는 클래스 및 인터페이스)를 JavaScript로 내보내는 것을 허용하지 않았습니다. 각 suspend 함수를 수동으로 래핑해야 했고, 이는 번거롭고 오류 발생 가능성이 높았습니다.

Kotlin 2.3.0부터 `@JsExport` 어노테이션을 사용하여 suspend 함수를 JavaScript로 직접 내보낼 수 있습니다.

suspend 함수 내보내기를 활성화하면 상용구 코드가 줄어들고 Kotlin/JS와 JavaScript/TypeScript (JS/TS) 간의 상호 운용성이 향상됩니다. Kotlin의 비동기 함수는 추가 코드 없이 JS/TS에서 직접 호출할 수 있습니다.

이 기능을 활성화하려면 `build.gradle.kts` 파일에 다음 컴파일러 옵션을 추가하세요.

```kotlin
kotlin {
    compilerOptions {
        freeCompilerArgs.add("-Xenable-suspend-function-exporting")
    }
}
```

활성화되면 `@JsExport` 어노테이션으로 표시된 클래스 및 함수는 추가 래퍼 없이 suspend 함수를 포함할 수 있습니다.

이들은 일반 JavaScript 비동기 함수로 소비될 수 있으며, 비동기 함수로 오버라이드될 수도 있습니다.

```kotlin
@JsExport
open class Foo {
    suspend fun foo() = "Foo"
}
```

```typescript
class Bar extends Foo {
    override async foo(): Promise<string> {
        return "Bar"
    }
}
```

이 기능은 [실험적(Experimental)](components-stability.md#stability-levels-explained)입니다.
[YouTrack](https://youtrack.jetbrains.com/issue/KT-56281/KJS-Cant-export-suspend-functions)의 이슈 트래커에 피드백을 주시면 감사하겠습니다.

### Kotlin의 `LongArray` 타입을 표현하기 위한 `BigInt64Array` 타입 사용
<primary-label ref="experimental-opt-in"/>

이전에는 Kotlin/JS가 `LongArray`를 JavaScript `Array<bigint>`로 표현했습니다. 이 접근 방식은 작동했지만 타입이 지정된 배열을 기대하는 JavaScript API와의 상호 운용성에는 이상적이지 않았습니다.

이번 릴리스부터 Kotlin/JS는 JavaScript로 컴파일할 때 Kotlin의 `LongArray` 값을 표현하기 위해 JavaScript의 내장 `BigInt64Array` 타입을 사용합니다.

`BigInt64Array`를 사용하면 타입이 지정된 배열을 사용하는 JavaScript API와의 상호 운용성이 단순화됩니다. 또한 `LongArray`를 받거나 반환하는 API를 Kotlin에서 JavaScript로 더 자연스럽게 내보낼 수 있습니다.

이 기능을 활성화하려면 `build.gradle.kts` 파일에 다음 컴파일러 옵션을 추가하세요.

```kotlin
kotlin {
    js {
        // ...
        compilerOptions {
            freeCompilerArgs.add("-Xes-long-as-bigint")
        }
    }
}
```

이 기능은 [실험적(Experimental)](components-stability.md#stability-levels-explained)입니다.
[YouTrack](https://youtrack.jetbrains.com/issue/KT-79284/Use-BigInt64Array-for-LongArray)의 이슈 트래커에 피드백을 주시면 감사하겠습니다.

### JS 모듈 시스템 전반의 통일된 컴패니언 객체 접근

이전에는 컴패니언 객체가 있는 Kotlin 인터페이스를 `@JsExport` 어노테이션을 사용하여 JavaScript/TypeScript로 내보낼 때, ES 모듈과 다른 모듈 시스템 간에 인터페이스를 사용하는 방식이 달랐습니다.

결과적으로 모듈 시스템에 따라 TypeScript 측에서 출력 소비를 조정해야 했습니다.

다음 Kotlin 코드를 살펴보세요.

```kotlin
@JsExport
interface Foo {
    companion object {
        fun bar() = "OK"
    }
}
```

모듈 시스템에 따라 다르게 호출해야 했습니다.

```kotlin
// CommonJS, AMD, UMD 및 모듈 없음에서 작동
Foo.bar()

// ES 모듈에서 작동
Foo.getInstance().bar()
```

이 릴리스에서는 Kotlin이 모든 JavaScript 모듈 시스템에서 컴패니언 객체 내보내기를 통일합니다.

이제 모든 모듈 시스템(ES 모듈, CommonJS, AMD, UMD, 모듈 없음)에서 인터페이스 내의 컴패니언 객체는 항상 동일한 방식으로 접근됩니다(클래스의 컴패니언과 동일).

```kotlin
// 모든 모듈 시스템에서 작동
Foo.Companion.bar()
```

이 개선 사항은 컬렉션 상호 운용성도 수정합니다. 이전에는 컬렉션 팩토리 함수가 모듈 시스템에 따라 다르게 접근되어야 했습니다.

```kotlin
// CommonJS, AMD, UMD 및 모듈 없음에서 작동
KtList.fromJsArray([1, 2, 3])

// ES 모듈에서 작동
KtList.getInstance().fromJsArray([1, 2, 3])
```

이제 컬렉션 팩토리 함수에 대한 접근이 모든 모듈 시스템에서 유사합니다.

```kotlin
// 모든 모듈 시스템에서 작동
KtList.fromJsArray([1, 2, 3])
```

이 변경 사항은 모듈 시스템 간의 일관성 없는 동작을 줄이고 버그 및 상호 운용성 문제를 방지합니다.

이 기능은 기본으로 활성화되어 있습니다.

### 컴패니언 객체가 있는 인터페이스에서 `@JsStatic` 어노테이션 지원

이전에는 `@JsStatic` 어노테이션이 컴패니언 객체가 있는 내보내기된 인터페이스 내부에서는 허용되지 않았습니다.

예를 들어, 다음 코드는 클래스 컴패니언 객체의 멤버만 `@JsStatic`으로 어노테이션될 수 있었기 때문에 오류를 생성했습니다.

```kotlin
@JsExport
interface Foo {
    companion object {
        @JsStatic // 오류
        fun bar() = "OK"
    }
}
```

이 경우 `@JsStatic` 어노테이션을 제거하고 JavaScript (JS)에서 컴패니언에 다음과 같이 접근해야 했습니다.

```kotlin
// 모든 모듈 시스템에서
Foo.Companion.bar()
```

이제 컴패니언 객체가 있는 인터페이스에서 `@JsStatic` 어노테이션이 지원됩니다.
이 어노테이션을 컴패니언에 사용할 수 있으며, 클래스와 마찬가지로 JS에서 함수를 직접 호출할 수 있습니다.

```kotlin
// 모든 모듈 시스템에서
Foo.bar()
```

이 변경 사항은 JS에서 API 소비를 단순화하고, 인터페이스에 정적 팩토리 메서드를 허용하며, 클래스와 인터페이스 간의 불일치를 제거합니다.

이 기능은 기본으로 활성화되어 있습니다.

### 개별 함수 및 클래스에서 `@JsQualifier` 어노테이션 허용

이전에는 `@JsQualifier` 어노테이션을 파일 수준에서만 적용할 수 있었고, 모든 외부 JavaScript (JS) 선언을 별도의 파일에 배치해야 했습니다.

Kotlin 2.3.0부터 `@JsQualifier` 어노테이션을 `@JsModule` 및 `@JsNonModule` 어노테이션과 마찬가지로 개별 함수 및 클래스에 직접 적용할 수 있습니다.

예를 들어, 이제 다음 외부 함수 코드를 동일한 파일의 일반 Kotlin 선언 옆에 작성할 수 있습니다.

```kotlin
@JsQualifier("jsPackage")
private external fun jsFun()
```

이 변경 사항은 Kotlin/JS 상호 운용성을 단순화하고, 프로젝트 구조를 깔끔하게 유지하며, Kotlin/JS를 다른 플랫폼이 외부 선언을 처리하는 방식과 일치시킵니다.

이 기능은 기본으로 활성화되어 있습니다.

### JavaScript 기본 내보내기 지원

이전에는 Kotlin/JS가 Kotlin 코드에서 JavaScript의 기본 내보내기(default exports)를 생성할 수 없었습니다. 대신 Kotlin/JS는 명명된 내보내기만 생성했습니다. 예를 들어:

```javascript
export { SomeDeclaration };
```

기본 내보내기가 필요한 경우 컴파일러 내부에서 `@JsName` 어노테이션과 `default` 및 공백을 인자로 사용하여 다음과 같은 해결 방법을 사용해야 했습니다.

```kotlin
@JsExport
@JsName("default ")
class SomeDeclaration
```

Kotlin/JS는 이제 새로운 어노테이션을 통해 기본 내보내기를 직접 지원합니다.

```kotlin
@JsExport.Default
```

이 어노테이션을 Kotlin 선언(클래스, 객체, 함수 또는 속성)에 적용하면
생성된 JavaScript는 ES 모듈에 대해 자동으로 `export default` 문을 포함합니다.

```javascript
export default HelloWorker;
```

> ES 모듈과 다른 모듈 시스템의 경우, 새로운 `@JsExport.Default` 어노테이션은 일반 `@JsExport` 어노테이션과 유사하게 작동합니다.
>
{style="note"}

이 변경 사항은 Kotlin 코드가 JavaScript 규칙을 따르도록 하며, Cloudflare Workers와 같은 플랫폼이나 `React.lazy`와 같은 프레임워크에 특히 중요합니다.

이 기능은 기본으로 활성화되어 있습니다. `@JsExport.Default` 어노테이션만 사용하면 됩니다.

## Gradle

Kotlin 2.3.0은 Gradle 7.6.3부터 9.0.0까지 완벽하게 호환됩니다. 최신 Gradle 릴리스 버전까지 사용할 수도 있습니다. 그러나 이 경우 지원 중단 경고가 발생할 수 있으며 일부 새로운 Gradle 기능이 작동하지 않을 수 있습니다.

또한 최소 지원 Android Gradle 플러그인 버전은 이제 8.2.2이고 최대 지원 버전은 8.13.0입니다.

Kotlin 2.3.0은 또한 Gradle 프로젝트에서 생성된 소스를 등록하기 위한 새로운 API를 도입합니다.

### Gradle 프로젝트에서 생성된 소스 등록을 위한 새 API
<primary-label ref="experimental-general"/>

Kotlin 2.3.0은 [`KotlinSourceSet`](https://kotlinlang.org/api/kotlin-gradle-plugin/kotlin-gradle-plugin-api/org.jetbrains.kotlin.gradle.plugin/-kotlin-source-set/)
인터페이스에 새로운 [실험적(Experimental)](components-stability.md#stability-levels-explained) API를 도입합니다. 이 API를 사용하여 Gradle 프로젝트에서 생성된 소스를 등록할 수 있습니다.

이 새로운 API는 IDE가 생성된 코드와 일반 소스 파일을 구분하는 데 도움이 되는 편의성 개선 기능입니다.
이 API는 IDE가 UI에서 생성된 코드를 다르게 강조 표시하고 프로젝트가 가져올 때 생성 작업을 트리거하도록 합니다.
현재 IntelliJ IDEA에서 이 지원을 추가하기 위해 노력하고 있습니다. 이 API는 [KSP](ksp-overview.md) (Kotlin Symbol Processing)와 같이 코드를 생성하는 서드파티 플러그인 또는 도구에도 특히 유용합니다.

자세한 내용은 [생성된 소스 등록](gradle-configure-project.md#register-generated-sources)을 참조하세요.

## 표준 라이브러리

Kotlin 2.3.0은 새로운 시간 추적 기능인 [`kotlin.time.Clock` 및 `kotlin.time.Instant`](whatsnew2120.md#new-time-tracking-functionality)을 안정화하고, 실험적인 UUID API에 여러 개선 사항을 추가합니다.

### UUID 생성 및 구문 분석 개선
<primary-label ref="experimental-opt-in"/>

Kotlin 2.3.0은 UUID API에 다음과 같은 몇 가지 개선 사항을 도입합니다.

*   [잘못된 UUID 구문 분석 시 `null` 반환 지원](#support-for-returning-null-when-parsing-invalid-uuids)
*   [v4 및 v7 UUID 생성을 위한 새 함수](#new-functions-to-generate-v4-and-v7-uuids)
*   [특정 타임스탬프에 대한 v7 UUID 생성 지원](#support-for-generating-v7-uuids-for-specific-timestamps)

표준 라이브러리의 UUID 지원은 [실험적(Experimental)](components-stability.md#stability-levels-explained)이지만
[향후 안정화될 예정](https://youtrack.jetbrains.com/issue/KT-81395)입니다.
옵트인하려면 `@OptIn(ExperimentalUuidApi::class)` 어노테이션을 사용하거나 빌드 파일에 다음 컴파일러 옵션을 추가하세요.

<tabs group="build-system">
<tab title="Gradle" group-key="gradle">

```kotlin
kotlin {
    compilerOptions {
        freeCompilerArgs.add("-opt-in=kotlin.uuid.ExperimentalUuidApi")
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
                    <arg>-opt-in=kotlin.uuid.ExperimentalUuidApi</arg>
                </args>
            </configuration>
        </plugin>
    </plugins>
</build>
```

</tab>
</tabs>

[YouTrack](https://youtrack.jetbrains.com/issue/KT-81395) 또는
[관련 Slack 채널](https://slack-chats.kotlinlang.org/c/uuid)에 피드백을 주시면 감사하겠습니다.

#### 잘못된 UUID 구문 분석 시 `null` 반환 지원

Kotlin 2.3.0은 문자열에서 `Uuid` 인스턴스를 생성하는 새로운 함수를 도입하며, 문자열이 유효한 UUID가 아닌 경우 예외를 던지는 대신 `null`을 반환합니다.

이러한 함수에는 다음이 포함됩니다.

*   `Uuid.parseOrNull()` – 16진수-대시 또는 16진수 형식으로 UUID를 구문 분석합니다.
*   `Uuid.parseHexDashOrNull()` – 16진수-대시 형식으로만 UUID를 구문 분석하고, 그렇지 않으면 `null`을 반환합니다.
*   `Uuid.parseHexOrNull()` – 일반 16진수 형식으로만 UUID를 구문 분석하고, 그렇지 않으면 `null`을 반환합니다.

다음은 예시입니다.

```kotlin
import kotlin.uuid.ExperimentalUuidApi
import kotlin.uuid.Uuid

@OptIn(ExperimentalUuidApi::class)
fun main() {
    val valid = Uuid.parseOrNull("550e8400-e29b-41d4-a716-446655440000")
    println(valid)
    // 550e8400-e29b-41d4-a716-446655440000

    val invalid = Uuid.parseOrNull("not-a-uuid")
    println(invalid)
    // null

    val hexDashValid = Uuid.parseHexDashOrNull("550e8400-e29b-41d4-a716-446655440000")
    println(hexDashValid)
    // 550e8400-e29b-41d4-a716-446655440000

    val hexDashInvalid = Uuid.parseHexDashOrNull("550e8400e29b41d4a716446655440000")
    println(hexDashInvalid)
    // null
}
```
{kotlin-runnable="true"}

#### v4 및 v7 UUID 생성을 위한 새 함수

Kotlin 2.3.0은 UUID 생성을 위한 두 가지 새로운 함수 `Uuid.generateV4()` 및 `Uuid.generateV7()`을 도입합니다.

버전 4 UUID를 생성하려면 `Uuid.generateV4()` 함수를 사용하고, 버전 7 UUID를 생성하려면 `Uuid.generateV7()` 함수를 사용하세요.

> `Uuid.random()` 함수는 변경되지 않았으며 `Uuid.generateV4()`와 마찬가지로 계속해서 버전 4 UUID를 생성합니다.
>
{style="note"}

다음은 예시입니다.

```kotlin
import kotlin.uuid.ExperimentalUuidApi
import kotlin.uuid.Uuid

@OptIn(ExperimentalUuidApi::class)
fun main() {
    // v4 UUID를 생성합니다.
    val v4 = Uuid.generateV4()
    println(v4)

    // v7 UUID를 생성합니다.
    val v7 = Uuid.generateV7()
    println(v7)

    // v4 UUID를 생성합니다.
    val random = Uuid.random()
    println(random)
}
```
{kotlin-runnable="true"}

#### 특정 타임스탬프에 대한 v7 UUID 생성 지원

Kotlin 2.3.0은 특정 시점에 대한 버전 7 UUID를 생성하는 데 사용할 수 있는 새로운 `Uuid.generateV7NonMonotonicAt()` 함수를 도입합니다.

> `Uuid.generateV7()`과 달리, `Uuid.generateV7NonMonotonicAt()`은 단조로운 순서를 보장하지 않으므로, 동일한 타임스탬프에 대해 생성된 여러 UUID가 연속적이지 않을 수 있습니다.
>
{style="note"}

이 함수는 알려진 타임스탬프에 연결된 식별자가 필요할 때 사용합니다. 예를 들어, 이벤트 ID를 다시 생성하거나 무언가가 원래 발생한 시점을 반영하는 데이터베이스 항목을 생성할 때 사용합니다.

예를 들어, 특정 시점에 대한 버전 7 UUID를 생성하려면 다음 코드를 사용하세요.

```kotlin
import kotlin.uuid.ExperimentalUuidApi
import kotlin.uuid.Uuid
import kotlin.time.ExperimentalTime
import kotlin.time.Instant

@OptIn(ExperimentalUuidApi::class, ExperimentalTime::class)
fun main() {
    val timestamp = Instant.fromEpochMilliseconds(1577836800000) // 2020-01-01T00:00:00Z

    // 지정된 타임스탬프에 대한 v7 UUID를 생성합니다 (단조성 보장 없음).
    val v7AtTimestamp = Uuid.generateV7NonMonotonicAt(timestamp)
    println(v7AtTimestamp)
}
```
{kotlin-runnable="true"}

## Compose 컴파일러: 축소된 Android 애플리케이션의 스택 트레이스

Kotlin 2.3.0부터 컴파일러는 애플리케이션이 R8에 의해 축소될 때 Compose 스택 트레이스를 위한 ProGuard 매핑을 출력합니다.
이는 이전에 디버그 가능한 변형에서만 사용할 수 있었던 실험적 스택 트레이스 기능을 확장합니다.

릴리스 변형의 스택 트레이스에는 런타임에 소스 정보 기록 오버헤드 없이 축소된 애플리케이션에서 컴포저블 함수를 식별하는 데 사용할 수 있는 그룹 키가 포함됩니다. 그룹 키 스택 트레이스는 애플리케이션이 Compose 런타임 1.10 이상으로 빌드되어야 합니다.

그룹 키 스택 트레이스를 활성화하려면 `@Composable` 콘텐츠를 초기화하기 전에 다음 줄을 추가하세요.

```kotlin
Composer.setDiagnosticStackTraceMode(ComposeStackTraceMode.GroupKeys)
```

이 스택 트레이스가 활성화되면 Compose 런타임은 앱이 축소된 경우에도 컴포지션, 측정 또는 그리기 패스 중 충돌이 발생하면 자체 스택 트레이스를 추가합니다.

```text
java.lang.IllegalStateException: <message>
        at <original trace>
    Suppressed: androidx.compose.runtime.DiagnosticComposeException: Composition stack when thrown:
        at $compose.m$123(SourceFile:1)
        at $compose.m$234(SourceFile:1)
        ...
```

이 모드에서 Jetpack Compose 1.10이 생성하는 스택 트레이스는 여전히 난독화 해제가 필요한 그룹 키만 포함합니다.
이 문제는 Kotlin 2.3.0 릴리스에서 Compose Compiler Gradle 플러그인과 함께 해결되었으며, 이제 이 플러그인은 R8이 생성한 ProGuard 매핑 파일에 그룹 키 항목을 추가합니다. 컴파일러가 일부 함수에 대한 매핑 생성에 실패하는 경우 새로운 경고가 표시되면 [Google IssueTracker](https://issuetracker.google.com/issues/new?component=610764&template=1424126)에 보고해 주시기 바랍니다.

> Compose Compiler Gradle 플러그인은 R8 매핑 파일에 대한 종속성으로 인해 R8이 빌드에 대해 활성화된 경우에만 그룹 키 스택 트레이스에 대한 난독화 해제 매핑을 생성합니다.
>
{style="note"}

기본적으로 매핑 파일 Gradle 작업은 트레이스 활성화 여부와 관계없이 실행됩니다. 빌드에 문제가 발생하는 경우 이 기능을 완전히 비활성화할 수 있습니다. Gradle 구성의 `composeCompiler {}` 블록에 다음 속성을 추가하세요.

```kotlin
composeCompiler {
    includeComposeMappingFile.set(false)
}
```

> Android Gradle 플러그인이 제공하는 프로젝트 파일의 스택 트레이스에 일부 코드가 표시되지 않는 알려진 문제가 있습니다: [KT-83099](https://youtrack.jetbrains.com/issue/KT-83099).
>
{style="warning"}

발생하는 모든 문제는 [Google IssueTracker](https://issuetracker.google.com/issues/new?component=610764&template=1424126)에 보고해 주시기 바랍니다.

## 호환성이 깨지는 변경 사항 및 지원 중단

이 섹션에서는 중요한 호환성이 깨지는 변경 사항과 지원 중단 사항을 강조합니다.
전체 개요는 [호환성 가이드](compatibility-guide-23.md)를 참조하세요.

*   Kotlin 2.3.0부터 컴파일러는 더 이상 [`-language-version=1.8`을 지원하지 않습니다](compatibility-guide-23.md#drop-support-in-language-version-for-1-8-and-1-9).
    JVM 플랫폼이 아닌 플랫폼에서는 `-language-version=1.9`도 지원하지 않습니다.
*   2.0보다 오래된 언어 기능 세트(JVM 플랫폼의 1.9 제외)는 지원되지 않지만, 언어 자체는 Kotlin 1.0과 완벽하게 하위 호환됩니다.

    Gradle 프로젝트에서 `kotlin-dsl` **및** `kotlin("jvm")` 플러그인을 모두 사용하는 경우, 지원되지 않는 Kotlin 플러그인 버전에 대한 Gradle 경고가 표시될 수 있습니다. 마이그레이션 단계에 대한 지침은 [호환성 가이드](compatibility-guide-23.md#unsupported-kgp-version-warning-when-using-kotlin-dsl-and-kotlin-jvm-plugins)를 참조하세요.

*   Kotlin Multiplatform에서 Android 대상에 대한 지원은 이제 Google의 [`com.android.kotlin.multiplatform.library` 플러그인](https://developer.android.com/kotlin/multiplatform/plugin)을 통해 제공됩니다.
    Android 대상이 있는 프로젝트를 새 플러그인으로 마이그레이션하고 `androidTarget` 블록의 이름을 `android`로 변경하세요.

*   Android Gradle 플러그인(AGP) 9.0.0 이상에서 Android 대상을 위해 Kotlin Multiplatform Gradle 플러그인을 계속 사용하는 경우, `androidTarget` 블록을 사용할 때 구성 오류가 표시되며 마이그레이션 방법에 대한 지침을 제공하는 진단 메시지가 나타납니다. 자세한 내용은 [Android 대상에 대한 Google 플러그인으로 마이그레이션](https://kotlinlang.org/docs/multiplatform/multiplatform-compatibility-guide.html#migrate-to-google-s-plugin-for-android-targets)을 참조하세요.

*   AGP 9.0.0에는 [Kotlin에 대한 내장 지원](https://developer.android.com/build/releases/agp-preview#android-gradle-plugin-built-in-kotlin)이 포함되어 있습니다.
    Kotlin 2.3.0부터는 플러그인이 더 이상 필요하지 않기 때문에 이 버전의 AGP를 `kotlin-android` 플러그인과 함께 사용하는 경우 [구성 오류가 표시됩니다](compatibility-guide-23.md#deprecate-kotlin-android-plugin-for-agp-versions-9-0-0-and-later).
    마이그레이션에 도움이 되는 새로운 진단 메시지가 제공됩니다.
    오래된 AGP 버전을 사용하는 경우 지원 중단 경고가 표시됩니다.

*   Ant 빌드 시스템 지원은 더 이상 제공되지 않습니다.

## 문서 업데이트

Kotlin Multiplatform 문서는 kotlinlang.org로 이전되었습니다. 이제 한 곳에서 Kotlin 및 KMP 문서 간을 전환할 수 있습니다.
또한 언어 가이드의 목차를 새로 고치고 새로운 탐색 기능을 도입했습니다.

지난 Kotlin 릴리스 이후의 다른 주목할 만한 변경 사항:

*   [KMP 개요](https://kotlinlang.org/docs/multiplatform/kmp-overview.html) – 단일 페이지에서 Kotlin Multiplatform 생태계를 탐색합니다.
*   [Kotlin Multiplatform 빠른 시작](https://kotlinlang.org/docs/multiplatform/quickstart.html) – KMP IDE 플러그인으로 환경을 설정하는 방법을 배웁니다.
*   [Compose Multiplatform 1.9.3의 새로운 기능](https://kotlinlang.org/docs/multiplatform/whats-new-compose-190.html) – 최신 릴리스의 주요 특징에 대해 배웁니다.
*   [Kotlin/JS 시작하기](js-get-started.md) – Kotlin/JavaScript를 사용하여 브라우저용 웹 애플리케이션을 만듭니다.
*   [클래스](classes.md) – Kotlin에서 클래스를 사용하는 기본 사항 및 모범 사례를 배웁니다.
*   [확장 함수](extensions.md) – Kotlin에서 클래스 및 인터페이스를 확장하는 방법을 배웁니다.
*   [코루틴 기본](coroutines-basics.md) – 주요 코루틴 개념을 탐색하고 첫 번째 코루틴을 만드는 방법을 배웁니다.
*   [취소 및 타임아웃](cancellation-and-timeouts.md) – 코루틴 취소가 작동하는 방식과 코루틴이 취소에 응답하도록 하는 방법을 배웁니다.
*   [Kotlin/Native 라이브러리](native-libraries.md) – `klib` 라이브러리 아티팩트를 생성하는 방법을 확인합니다.
*   [Kotlin Notebook 개요](kotlin-notebook-overview.md) – Kotlin Notebook 플러그인으로 대화형 노트북 문서를 만듭니다.
*   [Java 프로젝트에 Kotlin 추가](mixing-java-kotlin-intellij.md) – Kotlin과 Java를 모두 사용하도록 Java 프로젝트를 구성합니다.
*   [Kotlin으로 Java 코드 테스트](jvm-test-using-junit.md) – JUnit으로 혼합 Java-Kotlin 프로젝트를 테스트합니다.
*   [새로운 사례 연구 페이지](https://kotlinlang.org/case-studies/) – 다양한 회사가 Kotlin을 적용하는 방법을 알아봅니다.

## Kotlin 2.3.0으로 업데이트하는 방법

Kotlin 플러그인은 IntelliJ IDEA 및 Android Studio에 번들로 제공되는 플러그인으로 배포됩니다.

새 Kotlin 버전으로 업데이트하려면 빌드 스크립트에서 [Kotlin 버전을](releases.md#update-to-a-new-kotlin-version) 2.3.0으로 변경하세요.