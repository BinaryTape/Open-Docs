`[//]: # (title: Kotlin 1.5.30의 새로운 기능)`

_[출시일: 2021년 8월 24일](releases.md#release-details)_

Kotlin 1.5.30은 향후 변경 사항의 미리 보기를 포함한 언어 업데이트, 플랫폼 지원 및 툴링의 다양한 개선 사항, 새로운 표준 라이브러리 함수를 제공합니다.

주요 개선 사항은 다음과 같습니다:
*   실험적인 봉인된(`sealed`) `when` 문, 옵트인 요구 사항 사용 변경 사항 등을 포함한 언어 기능
*   Apple Silicon 네이티브 지원
*   Kotlin/JS IR 백엔드 베타 도달
*   향상된 Gradle 플러그인 사용 경험

[릴리스 블로그 게시물](https://blog.jetbrains.com/kotlin/2021/08/kotlin-1-5-30-released/) 및 다음 비디오에서도 변경 사항에 대한 간략한 개요를 확인할 수 있습니다:

<video src="https://www.youtube.com/v/rNbb3A9IdOo" title="Kotlin 1.5.30"/>

## 언어 기능

Kotlin 1.5.30은 향후 언어 변경 사항의 미리 보기를 제공하고 옵트인 요구 사항 메커니즘과 타입 추론에 대한 개선 사항을 제공합니다:
*   [봉인된(Sealed) 및 Boolean 타입 주체에 대한 완전한 when 문](#exhaustive-when-statements-for-sealed-and-boolean-subjects)
*   [슈퍼타입으로서의 suspend 함수](#suspending-functions-as-supertypes)
*   [실험적 API의 암묵적 사용 시 옵트인 요구](#requiring-opt-in-on-implicit-usages-of-experimental-apis)
*   [다양한 타겟에 옵트인 요구 사항 어노테이션 사용 변경 사항](#changes-to-using-opt-in-requirement-annotations-with-different-targets)
*   [재귀적 제네릭 타입에 대한 타입 추론 개선](#improvements-to-type-inference-for-recursive-generic-types)
*   [빌더 추론 제한 제거](#eliminating-builder-inference-restrictions)

### 봉인된(Sealed) 및 Boolean 타입 주체에 대한 완전한 when 문

> 봉인된 (완전한) `when` 문에 대한 지원은 [실험적](components-stability.md)입니다. 언제든지 변경되거나 삭제될 수 있습니다.
> 옵트인(opt-in)이 필요하며 (자세한 내용은 아래 참조), 평가 목적으로만 사용해야 합니다. [YouTrack](https://youtrack.jetbrains.com/issue/KT-12380)에 대한 피드백을 보내주시면 감사하겠습니다.
>
{style="warning"}

_완전한_ [`when`](control-flow.md#when-expressions-and-statements) 문은 주체의 모든 가능한 타입 또는 값을 위한 브랜치(branches)를 포함하거나, 특정 타입을 위한 브랜치와 나머지 경우를 처리하기 위한 `else` 브랜치를 포함합니다.

`when` 표현식과의 동작 일관성을 위해 곧 비완전한 `when` 문을 금지할 예정입니다. 원활한 마이그레이션을 위해 컴파일러가 봉인된 클래스 또는 Boolean에 대한 비완전한 `when` 문에 대해 경고를 보고하도록 구성할 수 있습니다. 이러한 경고는 Kotlin 1.6에서 기본적으로 표시되며 나중에 오류로 변경됩니다.

> Enum은 이미 경고를 받습니다.
>
{style="note"}

```kotlin
sealed class Mode {
    object ON : Mode()
    object OFF : Mode()
}

fun main() {
    val x: Mode = Mode.ON
    when (x) { 
        Mode.ON -> println("ON")
    }
// WARNING: 봉인된 클래스/인터페이스에 대한 비완전한 'when' 문은 1.7에서 금지될 예정입니다. 대신 'OFF' 또는 'else' 브랜치를 추가하세요.

    val y: Boolean = true
    when (y) {  
        true -> println("true")
    }
// WARNING: Boolean에 대한 비완전한 'when' 문은 1.7에서 금지될 예정입니다. 대신 'false' 또는 'else' 브랜치를 추가하세요.
}
```

Kotlin 1.5.30에서 이 기능을 활성화하려면 언어 버전 `1.6`을 사용하십시오. [진보 모드(progressive mode)](whatsnew13.md#progressive-mode)를 활성화하여 경고를 오류로 변경할 수도 있습니다.

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
kotlin {
    sourceSets.all {
        languageSettings.apply {
            languageVersion = "1.6"
            //progressiveMode = true // false by default
        }
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
kotlin {
    sourceSets.all {
        languageSettings {
            languageVersion = '1.6'
            //progressiveMode = true // false by default
        }
    }
}
```

</tab>
</tabs>

### 슈퍼타입으로서의 suspend 함수

> 슈퍼타입으로서의 suspend 함수에 대한 지원은 [실험적](components-stability.md)입니다. 언제든지 변경되거나 삭제될 수 있습니다.
> 옵트인(opt-in)이 필요하며 (자세한 내용은 아래 참조), 평가 목적으로만 사용해야 합니다. [YouTrack](https://youtrack.jetbrains.com/issue/KT-18707)에 대한 피드백을 보내주시면 감사하겠습니다.
>
{style="warning"}

Kotlin 1.5.30은 몇 가지 제한 사항이 있지만 `suspend` 함수 타입을 슈퍼타입으로 사용할 수 있는 기능의 미리 보기를 제공합니다.

```kotlin
class MyClass: suspend () -> Unit {
    override suspend fun invoke() { TODO() }
}
```

이 기능을 활성화하려면 `-language-version 1.6` 컴파일러 옵션을 사용하십시오:

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
kotlin {
    sourceSets.all {
        languageSettings.apply {
            languageVersion = "1.6"
        }
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
kotlin {
    sourceSets.all {
        languageSettings {
            languageVersion = '1.6'
        }
    }
}
```

</tab>
</tabs>

이 기능에는 다음과 같은 제한 사항이 있습니다:
*   일반 함수 타입과 `suspend` 함수 타입을 슈퍼타입으로 혼합할 수 없습니다. 이는 JVM 백엔드에서 `suspend` 함수 타입의 구현 세부 사항 때문입니다. JVM 백엔드에서는 마커 인터페이스를 가진 일반 함수 타입으로 표현됩니다. 마커 인터페이스 때문에 슈퍼인터페이스 중 어떤 것이 `suspend`이고 어떤 것이 일반인지 구별할 방법이 없습니다.
*   여러 `suspend` 함수 슈퍼타입을 사용할 수 없습니다. 타입 검사가 있는 경우 여러 일반 함수 슈퍼타입을 사용할 수도 없습니다.

### 실험적 API의 암묵적 사용 시 옵트인 요구

> 옵트인 요구 사항 메커니즘은 [실험적](components-stability.md)입니다.
> 언제든지 변경될 수 있습니다. [옵트인 방법 알아보기](opt-in-requirements.md).
> 평가 목적으로만 사용해야 합니다. [YouTrack](https://youtrack.jetbrains.com/issues/KT)에 대한 피드백을 보내주시면 감사하겠습니다.
>
{style="warning"}

라이브러리 작성자는 실험적 API를 [옵트인 필요](opt-in-requirements.md#create-opt-in-requirement-annotations)로 표시하여 사용자에게 해당 API의 실험적 상태를 알릴 수 있습니다. 컴파일러는 API가 사용될 때 경고 또는 오류를 발생시키며, 이를 억제하려면 [명시적 동의](opt-in-requirements.md#opt-in-to-api)가 필요합니다.

Kotlin 1.5.30에서는 컴파일러가 시그니처에 실험적 타입이 있는 모든 선언을 실험적으로 처리합니다. 즉, 실험적 API의 암묵적 사용에 대해서도 옵트인이 필요합니다. 예를 들어, 함수의 반환 타입이 실험적 API 요소로 표시된 경우, 선언이 명시적으로 옵트인을 요구하지 않더라도 해당 함수를 사용하려면 옵트인이 필요합니다.

```kotlin
// 라이브러리 코드

@RequiresOptIn(message = "This API is experimental.")
@Retention(AnnotationRetention.BINARY)
@Target(AnnotationTarget.CLASS)
annotation class MyDateTime // 옵트인 요구 사항 어노테이션

@MyDateTime
class DateProvider // 옵트인을 요구하는 클래스

// 클라이언트 코드

// 경고: 실험적 API 사용
fun createDateSource(): DateProvider { /* ... */ }

fun getDate(): Date {
    val dateSource = createDateSource() // 또한 경고: 실험적 API 사용
    // ... 
}
```

[옵트인 요구 사항](opt-in-requirements.md)에 대해 자세히 알아보십시오.

### 다양한 타겟에 옵트인 요구 사항 어노테이션 사용 변경 사항

> 옵트인 요구 사항 메커니즘은 [실험적](components-stability.md)입니다.
> 언제든지 변경될 수 있습니다. [옵트인 방법 알아보기](opt-in-requirements.md).
> 평가 목적으로만 사용해야 합니다. [YouTrack](https://youtrack.jetbrains.com/issues/KT)에 대한 피드백을 보내주시면 감사하겠습니다.
>
{style="warning"}

Kotlin 1.5.30은 다양한 [타겟](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.annotation/-target/)에 옵트인 요구 사항 어노테이션을 사용하고 선언하는 새로운 규칙을 제시합니다. 컴파일러는 이제 컴파일 시점에 처리하기 비실용적인 사용 사례에 대해 오류를 보고합니다. Kotlin 1.5.30에서는 다음이 적용됩니다:
*   사용 사이트에서 로컬 변수 및 값 파라미터에 옵트인 요구 사항 어노테이션을 표시하는 것은 금지됩니다.
*   오버라이드에 표시하는 것은 기본 선언도 표시된 경우에만 허용됩니다.
*   배킹 필드 및 게터에 표시하는 것은 금지됩니다. 대신 기본 프로퍼티를 표시할 수 있습니다.
*   옵트인 요구 사항 어노테이션 선언 사이트에서 `TYPE` 및 `TYPE_PARAMETER` 어노테이션 타겟을 설정하는 것은 금지됩니다.

[옵트인 요구 사항](opt-in-requirements.md)에 대해 자세히 알아보십시오.

### 재귀적 제네릭 타입에 대한 타입 추론 개선

Kotlin과 Java에서는 재귀적 제네릭 타입을 정의할 수 있으며, 이 타입은 자체 타입 파라미터에서 자신을 참조합니다. Kotlin 1.5.30에서는 Kotlin 컴파일러가 해당 타입 파라미터가 재귀적 제네릭인 경우 상위 바운드(upper bounds)에만 기반하여 타입 인수를 추론할 수 있습니다. 이를 통해 Java에서 빌더 API를 만드는 데 자주 사용되는 재귀적 제네릭 타입을 이용한 다양한 패턴을 생성할 수 있습니다.

```kotlin
// Kotlin 1.5.20
val containerA = PostgreSQLContainer<Nothing>(DockerImageName.parse("postgres:13-alpine")).apply {
    withDatabaseName("db")
    withUsername("user")
    withPassword("password")
    withInitScript("sql/schema.sql")
}

// Kotlin 1.5.30
val containerB = PostgreSQLContainer(DockerImageName.parse("postgres:13-alpine"))
    .withDatabaseName("db")
    .withUsername("user")
    .withPassword("password")
    .withInitScript("sql/schema.sql")
```

`-Xself-upper-bound-inference` 또는 `-language-version 1.6` 컴파일러 옵션을 전달하여 개선 사항을 활성화할 수 있습니다. 새로 지원되는 사용 사례의 다른 예시는 [이 YouTrack 티켓](https://youtrack.jetbrains.com/issue/KT-40804)에서 확인할 수 있습니다.

### 빌더 추론 제한 제거

빌더 추론은 람다 인수의 다른 호출에서 얻은 타입 정보에 기반하여 호출의 타입 인수를 추론할 수 있도록 하는 특수한 타입 추론입니다. 이는 [`buildList()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/build-list.html) 또는 [`sequence()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.sequences/sequence.html)와 같은 제네릭 빌더 함수를 호출할 때 유용할 수 있습니다: `buildList { add("string") }`.

이러한 람다 인수 내부에는 이전에 빌더 추론이 추론하려는 타입 정보를 사용하는 데 제한이 있었습니다. 즉, 이를 지정할 수는 있지만 가져올 수는 없었습니다. 예를 들어, 명시적으로 지정된 타입 인수 없이 `buildList()`의 람다 인수 내에서 [`get()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-list/get.html)를 호출할 수 없었습니다.

Kotlin 1.5.30은 `-Xunrestricted-builder-inference` 컴파일러 옵션으로 이러한 제한을 제거합니다. 이 옵션을 추가하여 제네릭 빌더 함수의 람다 인수 내에서 이전에 금지되었던 호출을 활성화하십시오:

```kotlin
@kotlin.ExperimentalStdlibApi
val list = buildList {
    add("a")
    add("b")
    set(1, null)
    val x = get(1)
    if (x != null) {
        removeAt(1)
    }
}

@kotlin.ExperimentalStdlibApi
val map = buildMap {
    put("a", 1)
    put("b", 1.1)
    put("c", 2f)
}
```

또한 `-language-version 1.6` 컴파일러 옵션으로 이 기능을 활성화할 수 있습니다.

## Kotlin/JVM

Kotlin 1.5.30을 통해 Kotlin/JVM은 다음 기능을 받습니다:
*   [어노테이션 클래스 인스턴스화](#instantiation-of-annotation-classes)
*   [향상된 널 가능성 어노테이션 지원 구성](#improved-nullability-annotation-support-configuration)

JVM 플랫폼의 Kotlin Gradle 플러그인 업데이트에 대해서는 [Gradle](#gradle) 섹션을 참조하십시오.

### 어노테이션 클래스 인스턴스화

> 어노테이션 클래스 인스턴스화는 [실험적](components-stability.md)입니다. 언제든지 변경되거나 삭제될 수 있습니다.
> 옵트인(opt-in)이 필요하며 (자세한 내용은 아래 참조), 평가 목적으로만 사용해야 합니다. [YouTrack](https://youtrack.jetbrains.com/issue/KT-45395)에 대한 피드백을 보내주시면 감사하겠습니다.
>
{style="warning"}

Kotlin 1.5.30부터는 임의의 코드에서 [어노테이션 클래스](annotations.md)의 생성자를 호출하여 결과 인스턴스를 얻을 수 있습니다. 이 기능은 어노테이션 인터페이스 구현을 허용하는 Java 컨벤션과 동일한 사용 사례를 다룹니다.

```kotlin
annotation class InfoMarker(val info: String)

fun processInfo(marker: InfoMarker) = ...

fun main(args: Array<String>) {
    if (args.size != 0)
        processInfo(getAnnotationReflective(args))
    else
        processInfo(InfoMarker("default"))
}
```

이 기능을 활성화하려면 `-language-version 1.6` 컴파일러 옵션을 사용하십시오. 비-`val` 파라미터 또는 보조 생성자와 다른 멤버를 정의하는 제한과 같은 현재 모든 어노테이션 클래스 제한은 그대로 유지됩니다.

[이 KEEP](https://github.com/Kotlin/KEEP/blob/master/proposals/annotation-instantiation.md)에서 어노테이션 클래스 인스턴스화에 대해 자세히 알아보십시오.

### 향상된 널 가능성 어노테이션 지원 구성

Kotlin 컴파일러는 Java에서 널 가능성 정보를 얻기 위해 다양한 타입의 [널 가능성 어노테이션](java-interop.md#nullability-annotations)을 읽을 수 있습니다. 이 정보를 통해 Java 코드를 호출할 때 Kotlin에서 널 가능성 불일치를 보고할 수 있습니다.

Kotlin 1.5.30에서는 특정 타입의 널 가능성 어노테이션 정보에 따라 컴파일러가 널 가능성 불일치를 보고할지 여부를 지정할 수 있습니다. 컴파일러 옵션 `-Xnullability-annotations=@<package-name>:<report-level>`을 사용하십시오. 인수에 완전한 널 가능성 어노테이션 패키지 이름과 다음 리포트 수준 중 하나를 지정하십시오:
*   `ignore`: 널 가능성 불일치 무시
*   `warn`: 경고 보고
*   `strict`: 오류 보고.

[지원되는 널 가능성 어노테이션의 전체 목록](java-interop.md#nullability-annotations)과 완전한 패키지 이름을 확인하십시오.

새로 지원되는 [RxJava](https://github.com/ReactiveX/RxJava) 3 널 가능성 어노테이션에 대한 오류 보고를 활성화하는 예시는 다음과 같습니다: `-Xnullability-annotations=@io.reactivex.rxjava3.annotations:strict`. 기본적으로 모든 이러한 널 가능성 불일치는 경고임을 참고하십시오.

## Kotlin/Native

Kotlin/Native는 다양한 변경 사항과 개선 사항을 받았습니다:
*   [Apple Silicon 지원](#apple-silicon-support)
*   [CocoaPods Gradle 플러그인을 위한 향상된 Kotlin DSL](#improved-kotlin-dsl-for-the-cocoapods-gradle-plugin)
*   [Swift 5.5 async/await와의 실험적 상호 운용성](#experimental-interoperability-with-swift-5-5-async-await)
*   [객체 및 컴패니언 객체에 대한 Swift/Objective-C 매핑 개선](#improved-swift-objective-c-mapping-for-objects-and-companion-objects)
*   [MinGW 타겟을 위한 임포트 라이브러리 없는 DLL 연결 지원 중단](#deprecation-of-linkage-against-dlls-without-import-libraries-for-mingw-targets)

### Apple Silicon 지원

Kotlin 1.5.30은 [Apple Silicon](https://support.apple.com/en-us/HT211814)에 대한 네이티브 지원을 도입합니다.

이전에는 Kotlin/Native 컴파일러 및 툴링이 Apple Silicon 호스트에서 작업하기 위해 [Rosetta 변환 환경](https://developer.apple.com/documentation/apple-silicon/about-the-rosetta-translation-environment)을 필요로 했습니다. Kotlin 1.5.30부터는 변환 환경이 더 이상 필요하지 않습니다. 컴파일러 및 툴링은 추가 조치 없이 Apple Silicon 하드웨어에서 실행될 수 있습니다.

또한 Apple Silicon에서 Kotlin 코드를 네이티브로 실행하는 새로운 타겟을 도입했습니다:
*   `macosArm64`
*   `iosSimulatorArm64`
*   `watchosSimulatorArm64`
*   `tvosSimulatorArm64`

이들은 Intel 기반 및 Apple Silicon 호스트 모두에서 사용할 수 있습니다. 모든 기존 타겟도 Apple Silicon 호스트에서 사용할 수 있습니다.

1.5.30에서는 `kotlin-multiplatform` Gradle 플러그인에서 Apple Silicon 타겟에 대한 기본 지원만 제공합니다. 특히, 새로운 시뮬레이터 타겟은 `ios`, `tvos`, `watchos` 타겟 단축키에 포함되지 않습니다.
새로운 타겟에 대한 사용자 경험을 개선하기 위해 계속 노력할 것입니다.

### CocoaPods Gradle 플러그인을 위한 향상된 Kotlin DSL

#### Kotlin/Native 프레임워크를 위한 새로운 파라미터

Kotlin 1.5.30은 Kotlin/Native 프레임워크를 위한 향상된 CocoaPods Gradle 플러그인 DSL을 도입합니다. 프레임워크 이름 외에 Pod 구성에서 다른 파라미터를 지정할 수 있습니다:
*   프레임워크의 동적 또는 정적 버전 지정
*   종속성 내보내기 명시적으로 활성화
*   비트코드 임베딩 활성화

새로운 DSL을 사용하려면 프로젝트를 Kotlin 1.5.30으로 업데이트하고 `build.gradle(.kts)` 파일의 `cocoapods` 섹션에 파라미터를 지정하십시오:

```kotlin
cocoapods {
    frameworkName = "MyFramework" // 이 속성은 더 이상 사용되지 않으며 향후 버전에서 제거될 예정입니다.
    // 프레임워크 구성을 위한 새로운 DSL:
    framework {
        // 모든 Framework 속성이 지원됩니다.
        // 프레임워크 이름 구성. 더 이상 사용되지 않는 'frameworkName' 대신 이 속성을 사용하십시오.
        baseName = "MyFramework"
        // 동적 프레임워크 지원
        isStatic = false
        // 종속성 내보내기
        export(project(":anotherKMMModule"))
        transitiveExport = false // 이것이 기본값입니다.
        // 비트코드 임베딩
        embedBitcode(BITCODE)
    }
}
```

#### Xcode 구성에 대한 커스텀 이름 지원

Kotlin CocoaPods Gradle 플러그인은 Xcode 빌드 구성에서 커스텀 이름을 지원합니다. 이는 예를 들어 `Staging`과 같이 Xcode에서 빌드 구성을 위한 특별한 이름을 사용하는 경우에도 도움이 될 것입니다.

커스텀 이름을 지정하려면 `build.gradle(.kts)` 파일의 `cocoapods` 섹션에 `xcodeConfigurationToNativeBuildType` 파라미터를 사용하십시오:

```kotlin
cocoapods {
    // 커스텀 Xcode 구성을 NativeBuildType에 매핑합니다.
    xcodeConfigurationToNativeBuildType["CUSTOM_DEBUG"] = NativeBuildType.DEBUG
    xcodeConfigurationToNativeBuildType["CUSTOM_RELEASE"] = NativeBuildType.RELEASE
}
```

이 파라미터는 Podspec 파일에 나타나지 않습니다. Xcode가 Gradle 빌드 프로세스를 실행할 때 Kotlin CocoaPods Gradle 플러그인은 필요한 네이티브 빌드 타입을 선택합니다.

> `Debug` 및 `Release` 구성은 기본적으로 지원되므로 선언할 필요가 없습니다.
>
{style="note"}

### Swift 5.5 async/await와의 실험적 상호 운용성

> Swift async/await와의 동시성 상호 운용성은 [실험적](components-stability.md)입니다. 언제든지 변경되거나 삭제될 수 있습니다.
> 평가 목적으로만 사용해야 합니다. [YouTrack](https://youtrack.jetbrains.com/issue/KT-47610)에 대한 피드백을 보내주시면 감사하겠습니다.
>
{style="warning"}

Kotlin 1.4.0에서 Objective-C 및 Swift에서 Kotlin의 suspend 함수 호출을 [지원](whatsnew14.md#support-for-kotlin-s-suspending-functions-in-swift-and-objective-c)하기 시작했으며, 이제 새로운 Swift 5.5 기능인 `async` 및 `await` 수정자를 사용한 [동시성](https://github.com/apple/swift-evolution/blob/main/proposals/0296-async-await.md)에 발맞춰 이를 개선하고 있습니다.

Kotlin/Native 컴파일러는 이제 널 가능성 반환 타입을 가진 suspend 함수에 대해 생성된 Objective-C 헤더에 `_Nullable_result` 속성을 내보냅니다. 이를 통해 적절한 널 가능성을 가진 `async` 함수로 Swift에서 이들을 호출할 수 있습니다.

이 기능은 실험적이며 향후 Kotlin과 Swift 모두의 변경 사항에 영향을 받을 수 있습니다. 현재로서는 특정 제한 사항이 있는 이 기능의 미리 보기를 제공하고 있으며, 여러분의 의견을 간절히 기다리고 있습니다. 현재 상태에 대해 자세히 알아보고 [이 YouTrack 이슈](https://youtrack.jetbrains.com/issue/KT-47610)에 피드백을 남겨주십시오.

### 객체 및 컴패니언 객체에 대한 Swift/Objective-C 매핑 개선

객체 및 컴패니언 객체를 얻는 방법이 이제 네이티브 iOS 개발자에게 더 직관적인 방식으로 가능해졌습니다. 예를 들어, Kotlin에 다음 객체가 있는 경우:

```kotlin
object MyObject {
    val x = "Some value"
}

class MyClass {
    companion object {
        val x = "Some value"
    }
}
```

Swift에서 이들에 접근하려면 `shared` 및 `companion` 프로퍼티를 사용할 수 있습니다:

```swift
MyObject.shared
MyObject.shared.x
MyClass.companion
MyClass.Companion.shared
```

[Swift/Objective-C 상호 운용성](native-objc-interop.md)에 대해 자세히 알아보십시오.

### MinGW 타겟을 위한 임포트 라이브러리 없는 DLL 연결 지원 중단

[LLD](https://lld.llvm.org/)는 LLVM 프로젝트의 링커로, Kotlin/Native에서 MinGW 타겟을 위해 사용하기 시작할 계획이며, 이는 주로 기본 ld.bfd보다 더 나은 성능이라는 이점 때문입니다.

그러나 LLD의 최신 안정 버전은 MinGW (Windows) 타겟에 대한 DLL에 직접 연결하는 것을 지원하지 않습니다. 이러한 연결에는 [임포트 라이브러리](https://stackoverflow.com/questions/3573475/how-does-the-import-library-work-details/3573527#3573527) 사용이 필요합니다. Kotlin/Native 1.5.30에서는 필요하지 않지만, 향후 MinGW의 기본 링커가 될 LLD와 호환되지 않는다는 것을 알려주기 위해 경고를 추가하고 있습니다.

LLD 링커로의 전환에 대한 여러분의 생각과 우려 사항을 [이 YouTrack 이슈](https://youtrack.jetbrains.com/issue/KT-47605)에 공유해 주십시오.

## Kotlin Multiplatform

1.5.30은 Kotlin Multiplatform에 다음과 같은 주목할 만한 업데이트를 제공합니다:
*   [공유 네이티브 코드에서 커스텀 `cinterop` 라이브러리 사용 기능](#ability-to-use-custom-cinterop-libraries-in-shared-native-code)
*   [XCFrameworks 지원](#support-for-xcframeworks)
*   [Android 아티팩트를 위한 새로운 기본 퍼블리싱 설정](#new-default-publishing-setup-for-android-artifacts)

### 공유 네이티브 코드에서 커스텀 cinterop 라이브러리 사용 기능

Kotlin Multiplatform은 공유 소스 세트에서 플랫폼 종속 [interop 라이브러리](https://kotlinlang.org/docs/multiplatform/multiplatform-share-on-platforms.html#connect-platform-specific-libraries)를 사용할 수 있는 [옵션](https://kotlinlang.org/docs/multiplatform/multiplatform-share-on-platforms.html#connect-platform-specific-libraries)을 제공합니다. 1.5.30 이전에는 이는 Kotlin/Native 배포판과 함께 제공되는 [플랫폼 라이브러리](native-platform-libs.md)에서만 작동했습니다. 1.5.30부터는 커스텀 `cinterop` 라이브러리에서도 사용할 수 있습니다. 이 기능을 활성화하려면 `gradle.properties`에 `kotlin.mpp.enableCInteropCommonization=true` 속성을 추가하십시오:

```none
kotlin.mpp.enableGranularSourceSetsMetadata=true
kotlin.native.enableDependencyPropagation=false
kotlin.mpp.enableCInteropCommonization=true
```

### XCFrameworks 지원

모든 Kotlin Multiplatform 프로젝트는 이제 XCFrameworks를 출력 형식으로 가질 수 있습니다. Apple은 유니버설(Fat) 프레임워크의 대체품으로 XCFrameworks를 도입했습니다. XCFrameworks를 사용하면 다음을 수행할 수 있습니다:
*   모든 타겟 플랫폼 및 아키텍처에 대한 로직을 단일 번들에 모을 수 있습니다.
*   애플리케이션을 App Store에 게시하기 전에 불필요한 아키텍처를 제거할 필요가 없습니다.

XCFrameworks는 Apple M1 기기 및 시뮬레이터에서 Kotlin 프레임워크를 사용하려는 경우 유용합니다.

XCFrameworks를 사용하려면 `build.gradle(.kts)` 스크립트를 업데이트하십시오:

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
import org.jetbrains.kotlin.gradle.plugin.mpp.apple.XCFramework

plugins {
    kotlin("multiplatform")
}

kotlin {
    val xcf = XCFramework()
  
    ios {
        binaries.framework {
            baseName = "shared"
            xcf.add(this)
        }
    }
    watchos {
        binaries.framework {
            baseName = "shared"
            xcf.add(this)
        }
    }
    tvos {
        binaries.framework {
            baseName = "shared"
            xcf.add(this)
        }
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
import org.jetbrains.kotlin.gradle.plugin.mpp.apple.XCFrameworkConfig

plugins {
    id 'org.jetbrains.kotlin.multiplatform'
}

kotlin {
    def xcf = new XCFrameworkConfig(project)

    ios {
        binaries.framework {
            baseName = "shared"
            xcf.add(it)
        }
    }
    watchos {
        binaries.framework {
            baseName = "shared"
            xcf.add(it)
        }
    }
    tvos {
        binaries.framework {
            baseName = "shared"
            xcf.add(it)
        }
    }
}
```

</tab>
</tabs>

XCFrameworks를 선언하면 다음과 같은 새로운 Gradle 태스크가 등록됩니다:
*   `assembleXCFramework`
*   `assembleDebugXCFramework` ([dSYM을 포함](native-debugging.md#debug-ios-applications)하는 디버그 아티팩트 추가)
*   `assembleReleaseXCFramework`

[이 WWDC 비디오](https://developer.apple.com/videos/play/wwdc2019/416/)에서 XCFrameworks에 대해 자세히 알아보십시오.

### Android 아티팩트를 위한 새로운 기본 퍼블리싱 설정

`maven-publish` Gradle 플러그인을 사용하면 빌드 스크립트에서 [Android 베리언트(variant)](https://developer.android.com/studio/build/build-variants) 이름을 지정하여 [Android 타겟용 멀티플랫폼 라이브러리를 퍼블리싱](https://kotlinlang.org/docs/multiplatform/multiplatform-publish-lib-setup.html#publish-an-android-library)할 수 있습니다. Kotlin Gradle 플러그인은 자동으로 퍼블리케이션을 생성합니다.

1.5.30 이전에는 생성된 퍼블리케이션 [메타데이터](https://docs.gradle.org/current/userguide/publishing_gradle_module_metadata.html)에 퍼블리싱된 모든 Android 베리언트에 대한 빌드 타입 속성이 포함되어 라이브러리 소비자가 사용하는 동일한 빌드 타입과만 호환되었습니다. Kotlin 1.5.30은 새로운 기본 퍼블리싱 설정을 도입합니다:
*   프로젝트가 퍼블리싱하는 모든 Android 베리언트가 동일한 빌드 타입 속성을 가지면, 퍼블리싱된 베리언트는 빌드 타입 속성을 가지지 않으며 어떤 빌드 타입과도 호환됩니다.
*   퍼블리싱된 베리언트가 다른 빌드 타입 속성을 가지면 `release` 값을 가진 베리언트만 빌드 타입 속성 없이 퍼블리싱됩니다. 이는 릴리스 베리언트를 소비자 측의 어떤 빌드 타입과도 호환되게 하는 반면, 비릴리스 베리언트는 일치하는 소비자 빌드 타입과만 호환됩니다.

옵트아웃하고 모든 베리언트에 대해 빌드 타입 속성을 유지하려면 `kotlin.android.buildTypeAttribute.keep=true` Gradle 속성을 설정하십시오.

## Kotlin/JS

Kotlin 1.5.30과 함께 Kotlin/JS에 두 가지 주요 개선 사항이 적용됩니다:
*   [JS IR 컴파일러 백엔드 베타 도달](#js-ir-compiler-backend-reaches-beta)
*   [Kotlin/JS IR 백엔드를 사용하는 애플리케이션의 더 나은 디버깅 경험](#better-debugging-experience-for-applications-with-the-kotlin-js-ir-backend)

### JS IR 컴파일러 백엔드 베타 도달

1.4.0에서 [알파](components-stability.md)로 도입되었던 Kotlin/JS용 [IR 기반 컴파일러 백엔드](whatsnew14.md#unified-backends-and-extensibility)가 베타에 도달했습니다.

이전에 새 백엔드로 프로젝트를 마이그레이션하는 데 도움이 되는 [JS IR 백엔드 마이그레이션 가이드](js-ir-migration.md)를 발행했습니다. 이제 IntelliJ IDEA에 필요한 변경 사항을 직접 표시하는 [Kotlin/JS Inspection Pack](https://plugins.jetbrains.com/plugin/17183-kotlin-js-inspection-pack/) IDE 플러그인을 소개합니다.

### Kotlin/JS IR 백엔드를 사용하는 애플리케이션의 더 나은 디버깅 경험

Kotlin 1.5.30은 Kotlin/JS IR 백엔드를 위한 JavaScript 소스 맵 생성을 제공합니다. 이는 IR 백엔드가 활성화되었을 때 Kotlin/JS 디버깅 경험을 개선하여, 중단점, 스텝 실행, 적절한 소스 참조를 포함한 읽기 쉬운 스택 트레이스와 같은 완전한 디버깅 지원을 제공할 것입니다.

[브라우저 또는 IntelliJ IDEA Ultimate에서 Kotlin/JS를 디버깅하는 방법](js-debugging.md)을 알아보십시오.

## Gradle

[Kotlin Gradle 플러그인 사용자 경험을 개선](https://youtrack.jetbrains.com/issue/KT-45778)하려는 우리의 사명의 일환으로, 다음 기능을 구현했습니다:
*   [Java 툴체(toolchains) 지원](#support-for-java-toolchains), 여기에는 [이전 Gradle 버전에서 `UsesKotlinJavaToolchain` 인터페이스를 사용하여 JDK 홈을 지정하는 기능](#ability-to-specify-jdk-home-with-useskotlinjavatoolchain-interface)이 포함됩니다.
*   [Kotlin 데몬의 JVM 인수를 명시적으로 지정하는 더 쉬운 방법](#easier-way-to-explicitly-specify-kotlin-daemon-jvm-arguments)

### Java 툴체(toolchains) 지원

Gradle 6.7은 ["Java 툴체 지원"](https://docs.gradle.org/current/userguide/toolchains.html) 기능을 도입했습니다.
이 기능을 사용하면 다음을 수행할 수 있습니다:
*   Gradle과 다른 JDK 및 JRE를 사용하여 컴파일, 테스트 및 실행 가능 파일을 실행할 수 있습니다.
*   미출시된 언어 버전으로 코드를 컴파일하고 테스트할 수 있습니다.

툴체 지원을 통해 Gradle은 로컬 JDK를 자동 감지하고 빌드에 필요한 누락된 JDK를 설치할 수 있습니다. 이제 Gradle 자체는 어떤 JDK에서도 실행될 수 있으며 여전히 [빌드 캐시 기능](gradle-compilation-and-caches.md#gradle-build-cache-support)을 재사용할 수 있습니다.

Kotlin Gradle 플러그인은 Kotlin/JVM 컴파일 태스크에 Java 툴체를 지원합니다.
Java 툴체는 다음을 수행합니다:
*   JVM 타겟에서 사용할 수 있는 [`jdkHome` 옵션](gradle-compiler-options.md#attributes-specific-to-jvm)을 설정합니다.
    > [`jdkHome` 옵션을 직접 설정하는 기능은 지원이 중단되었습니다](https://youtrack.jetbrains.com/issue/KT-46541).
    >
    {style="warning"}

*   사용자가 `jvmTarget` 옵션을 명시적으로 설정하지 않은 경우 [`kotlinOptions.jvmTarget`](gradle-compiler-options.md#attributes-specific-to-jvm)을 툴체의 JDK 버전으로 설정합니다.
    툴체가 구성되지 않으면 `jvmTarget` 필드는 기본값을 사용합니다. [JVM 타겟 호환성](gradle-configure-project.md#check-for-jvm-target-compatibility-of-related-compile-tasks)에 대해 자세히 알아보십시오.

*   [`kapt` 워커](kapt.md#run-kapt-tasks-in-parallel)가 실행되는 JDK에 영향을 미칩니다.

툴체를 설정하려면 다음 코드를 사용하십시오. `<MAJOR_JDK_VERSION>` 플레이스홀더를 사용하려는 JDK 버전으로 바꾸십시오:

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
kotlin {
    jvmToolchain {
        (this as JavaToolchainSpec).languageVersion.set(JavaLanguageVersion.of(<MAJOR_JDK_VERSION>)) // "8"
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
kotlin {
    jvmToolchain {
        languageVersion.set(JavaLanguageVersion.of(<MAJOR_JDK_VERSION>)) // "8"
    }
}
```

</tab>
</tabs>

`kotlin` 확장을 통해 툴체를 설정하면 Java 컴파일 태스크의 툴체도 업데이트됩니다.

`java` 확장을 통해 툴체를 설정할 수 있으며, Kotlin 컴파일 태스크는 이를 사용합니다:

```kotlin
java {
    toolchain {
        languageVersion.set(JavaLanguageVersion.of(<MAJOR_JDK_VERSION>)) // "8"
    }
}
```

`KotlinCompile` 태스크에 대한 모든 JDK 버전 설정에 대한 정보는 [태스크 DSL을 사용하여 JDK 버전 설정](gradle-configure-project.md#set-jdk-version-with-the-task-dsl)에 대한 문서를 참조하십시오.

Gradle 버전 6.1에서 6.6의 경우, [JDK 홈을 설정하려면 `UsesKotlinJavaToolchain` 인터페이스를 사용하십시오](#ability-to-specify-jdk-home-with-useskotlinjavatoolchain-interface).

### UsesKotlinJavaToolchain 인터페이스를 사용하여 JDK 홈을 지정하는 기능

[`kotlinOptions`](gradle-compiler-options.md)를 통해 JDK 설정을 지원하는 모든 Kotlin 태스크는 이제 `UsesKotlinJavaToolchain` 인터페이스를 구현합니다. JDK 홈을 설정하려면 JDK 경로를 지정하고 `<JDK_VERSION>` 플레이스홀더를 바꾸십시오:

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
project.tasks
    .withType<UsesKotlinJavaToolchain>()
    .configureEach {
        it.kotlinJavaToolchain.jdk.use(
            "/path/to/local/jdk",
            JavaVersion.<LOCAL_JDK_VERSION>
        )
    }
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
project.tasks
    .withType(UsesKotlinJavaToolchain.class)
    .configureEach {
        it.kotlinJavaToolchain.jdk.use(
            '/path/to/local/jdk',
            JavaVersion.<LOCAL_JDK_VERSION>
        )
    }
```

</tab>
</tabs>

Gradle 버전 6.1에서 6.6의 경우 `UsesKotlinJavaToolchain` 인터페이스를 사용하십시오. Gradle 6.7부터는 대신 [Java 툴체](#support-for-java-toolchains)를 사용하십시오.

이 기능을 사용할 때, [kapt 태스크 워커](kapt.md#run-kapt-tasks-in-parallel)는 [프로세스 격리 모드(process isolation mode)](https://docs.gradle.org/current/userguide/worker_api.html#changing_the_isolation_mode)만 사용하며, `kapt.workers.isolation` 속성은 무시됩니다.

### Kotlin 데몬 JVM 인수를 명시적으로 지정하는 더 쉬운 방법

Kotlin 1.5.30에서는 Kotlin 데몬의 JVM 인수에 대한 새로운 로직이 있습니다. 다음 목록의 각 옵션은 이전 옵션을 재정의합니다:

*   아무것도 지정하지 않으면 Kotlin 데몬은 Gradle 데몬에서 인수를 상속합니다(이전과 동일). 예를 들어, `gradle.properties` 파일에서:

    ```none
    org.gradle.jvmargs=-Xmx1500m -Xms=500m
    ```

*   Gradle 데몬의 JVM 인수에 `kotlin.daemon.jvm.options` 시스템 속성이 있는 경우 이전과 같이 사용합니다:

    ```none
    org.gradle.jvmargs=-Dkotlin.daemon.jvm.options=-Xmx1500m -Xms=500m
    ```

*   `gradle.properties` 파일에 `kotlin.daemon.jvmargs` 속성을 추가할 수 있습니다:

    ```none
    kotlin.daemon.jvmargs=-Xmx1500m -Xms=500m
    ```

*   `kotlin` 확장으로 인수를 지정할 수 있습니다:

    <tabs group="build-script">
    <tab title="Kotlin" group-key="kotlin">

    ```kotlin
    kotlin {
        kotlinDaemonJvmArgs = listOf("-Xmx486m", "-Xms256m", "-XX:+UseParallelGC")
    }
    ```

    </tab>
    <tab title="Groovy" group-key="groovy">

    ```groovy
    kotlin {
        kotlinDaemonJvmArgs = ["-Xmx486m", "-Xms256m", "-XX:+UseParallelGC"]
    }
    ```

    </tab>
    </tabs>

*   특정 태스크에 대한 인수를 지정할 수 있습니다:

    <tabs group="build-script">
    <tab title="Kotlin" group-key="kotlin">

    ```kotlin
    tasks
        .matching { it.name == "compileKotlin" && it is CompileUsingKotlinDaemon }
        .configureEach {
            (this as CompileUsingKotlinDaemon).kotlinDaemonJvmArguments.set(listOf("-Xmx486m", "-Xms256m", "-XX:+UseParallelGC"))
        }
    ```

    </tab>
    <tab title="Groovy" group-key="groovy">
  
    ```groovy
    tasks
        .matching {
            it.name == "compileKotlin" && it instanceof CompileUsingKotlinDaemon
        }
        .configureEach {
            kotlinDaemonJvmArguments.set(["-Xmx1g", "-Xms512m"])
        }
    ```

    </tab>
    </tabs>

    > 이 경우 태스크 실행 시 새로운 Kotlin 데몬 인스턴스가 시작될 수 있습니다. [Kotlin 데몬과 JVM 인수의 상호 작용](gradle-compilation-and-caches.md#setting-kotlin-daemon-s-jvm-arguments)에 대해 자세히 알아보십시오.
    >
    {style="note"}

Kotlin 데몬에 대한 자세한 내용은 [Kotlin 데몬 및 Gradle과 함께 사용하는 방법](gradle-compilation-and-caches.md#the-kotlin-daemon-and-how-to-use-it-with-gradle)을 참조하십시오.

## 표준 라이브러리

Kotlin 1.5.30은 표준 라이브러리의 `Duration` 및 `Regex` API에 대한 개선 사항을 제공합니다:
*   [`Duration.toString()` 출력 변경](#changing-duration-tostring-output)
*   [String에서 Duration 파싱](#parsing-duration-from-string)
*   [특정 위치에서 Regex 매칭](#matching-with-regex-at-a-particular-position)
*   [Regex를 시퀀스로 분할](#splitting-regex-to-a-sequence)

### Duration.toString() 출력 변경

> Duration API는 [실험적](components-stability.md)입니다. 언제든지 변경되거나 삭제될 수 있습니다.
> 평가 목적으로만 사용해야 합니다. [YouTrack](https://youtrack.jetbrains.com/issues/KT)에 대한 피드백을 보내주시면 감사하겠습니다.
>
{style="warning"}

Kotlin 1.5.30 이전에는 [`Duration.toString()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/-duration/to-string.html) 함수가 가장 간결하고 읽기 쉬운 숫자 값을 생성하는 단위로 표현된 인수의 문자열 표현을 반환했습니다.
이제부터는 숫자 구성 요소의 조합으로 표현된 문자열 값을 각 구성 요소의 약어 단위와 함께 반환합니다.
각 구성 요소는 숫자 뒤에 단위의 약어(예: `d`, `h`, `m`, `s`)가 붙습니다. 예를 들어:

|**함수 호출 예시**|**이전 출력**|**현재 출력**|
| --- | --- | --- |
|Duration.days(45).toString()|`45.0d`|`45d`|
|Duration.days(1.5).toString()|`36.0h`|`1d 12h`|
|Duration.minutes(1230).toString()|`20.5h`|`20h 30m`|
|Duration.minutes(2415).toString()|`40.3h`|`1d 16h 15m`|
|Duration.minutes(920).toString()|`920m`|`15h 20m`|
|Duration.seconds(1.546).toString()|`1.55s`|`1.546s`|
|Duration.milliseconds(25.12).toString()|`25.1ms`|`25.12ms`|

음수 Duration이 표현되는 방식도 변경되었습니다. 음수 Duration은 마이너스 부호(`-`)가 접두사로 붙으며, 여러 구성 요소로 구성된 경우 괄호로 둘러싸입니다: `-12m` 및 `-(1h 30m)`.

1초 미만의 작은 Duration은 `ms` (밀리초), `us` (마이크로초), 또는 `ns` (나노초)와 같은 초 미만 단위 중 하나를 사용하여 단일 숫자로 표현됩니다: `140.884ms`, `500us`, `24ns`. 과학적 표기법은 더 이상 이들을 표현하는 데 사용되지 않습니다.

Duration을 단일 단위로 표현하려면 오버로드된 `Duration.toString(unit, decimals)` 함수를 사용하십시오.

> 직렬화 및 교환을 포함한 특정 경우에는 [`Duration.toIsoString()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/-duration/to-iso-string.html) 사용을 권장합니다. `Duration.toIsoString()`은 `Duration.toString()` 대신 더 엄격한 [ISO-8601](https://www.iso.org/iso-8601-date-and-time-format.html) 형식을 사용합니다.
>
{style="note"}

### String에서 Duration 파싱

> Duration API는 [실험적](components-stability.md)입니다. 언제든지 변경되거나 삭제될 수 있습니다.
> [이 이슈](https://github.com/Kotlin/KEEP/issues/190)에 대한 피드백을 보내주시면 감사하겠습니다.
>
{style="warning"}

Kotlin 1.5.30에서는 Duration API에 새로운 함수가 있습니다:
*   [`parse()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/-duration/parse.html): 다음 출력 파싱을 지원합니다:
    *   [`toString()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/-duration/to-string.html).
    *   [`toString(unit, decimals)`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/-duration/to-string.html).
    *   [`toIsoString()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/-duration/to-iso-string.html).
*   [`parseIsoString()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/-duration/parse-iso-string.html): `toIsoString()`이 생성하는 형식만 파싱합니다.
*   [`parseOrNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/-duration/parse-or-null.html) 및 [`parseIsoStringOrNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/-duration/parse-iso-string-or-null.html): 위 함수와 유사하게 동작하지만, 유효하지 않은 duration 형식에 대해 `IllegalArgumentException`을 던지는 대신 `null`을 반환합니다.

다음은 `parse()` 및 `parseOrNull()` 사용 예시입니다:

```kotlin
import kotlin.time.Duration
import kotlin.time.ExperimentalTime

@ExperimentalTime
fun main() {
//sampleStart
    val isoFormatString = "PT1H30M"
    val defaultFormatString = "1h 30m"
    val singleUnitFormatString = "1.5h"
    val invalidFormatString = "1 hour 30 minutes"
    println(Duration.parse(isoFormatString)) // "1h 30m"
    println(Duration.parse(defaultFormatString)) // "1h 30m"
    println(Duration.parse(singleUnitFormatString)) // "1h 30m"
    //println(Duration.parse(invalidFormatString)) // throws exception
    println(Duration.parseOrNull(invalidFormatString)) // "null"
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.5" validate="false"}

다음은 `parseIsoString()` 및 `parseIsoStringOrNull()` 사용 예시입니다:

```kotlin
import kotlin.time.Duration
import kotlin.time.ExperimentalTime

@ExperimentalTime
fun main() {
//sampleStart
    val isoFormatString = "PT1H30M"
    val defaultFormatString = "1h 30m"
    println(Duration.parseIsoString(isoFormatString)) // "1h 30m"
    //println(Duration.parseIsoString(defaultFormatString)) // throws exception
    println(Duration.parseIsoStringOrNull(defaultFormatString)) // "null"
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.5" validate="false"}

### 특정 위치에서 Regex 매칭

> `Regex.matchAt()` 및 `Regex.matchesAt()` 함수는 [실험적](components-stability.md)입니다. 언제든지 변경되거나 삭제될 수 있습니다.
> 평가 목적으로만 사용해야 합니다. [YouTrack](https://youtrack.jetbrains.com/issue/KT-34021)에 대한 피드백을 보내주시면 감사하겠습니다.
>
{style="warning"}

새로운 `Regex.matchAt()` 및 `Regex.matchesAt()` 함수는 `String` 또는 `CharSequence`의 특정 위치에서 정규식이 정확하게 일치하는지 확인하는 방법을 제공합니다.

`matchesAt()`은 불리언(boolean) 결과를 반환합니다:

```kotlin
fun main(){
//sampleStart
    val releaseText = "Kotlin 1.5.30 is released!"
    // 정규 표현식: 숫자 하나, 점, 숫자 하나, 점, 하나 이상의 숫자
    val versionRegex = "\\d[.]\\d[.]\\d+".toRegex()
    println(versionRegex.matchesAt(releaseText, 0)) // "false"
    println(versionRegex.matchesAt(releaseText, 7)) // "true"
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.5" validate="false"}

`matchAt()`는 일치하는 항목이 발견되면 일치하는 항목을 반환하고, 발견되지 않으면 `null`을 반환합니다:

```kotlin
fun main(){
//sampleStart
    val releaseText = "Kotlin 1.5.30 is released!"
    val versionRegex = "\\d[.]\\d[.]\\d+".toRegex()
    println(versionRegex.matchAt(releaseText, 0)) // "null"
    println(versionRegex.matchAt(releaseText, 7)?.value) // "1.5.30"
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.5" validate="false"}

### Regex를 시퀀스로 분할

> `Regex.splitToSequence()` 및 `CharSequence.splitToSequence(Regex)` 함수는 [실험적](components-stability.md)입니다. 언제든지 변경되거나 삭제될 수 있습니다.
> 평가 목적으로만 사용해야 합니다. [YouTrack](https://youtrack.jetbrains.com/issue/KT-23351)에 대한 피드백을 보내주시면 감사하겠습니다.
>
{style="warning"}

새로운 `Regex.splitToSequence()` 함수는 [`split()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/-regex/split.html)의 지연(lazy) 대응 함수입니다. 이 함수는 주어진 정규식의 일치 항목을 기준으로 문자열을 분할하지만, 그 결과를 [Sequence](sequences.md)로 반환하므로 이 결과에 대한 모든 작업은 지연 실행됩니다.

```kotlin
fun main(){
//sampleStart
    val colorsText = "green, red , brown&blue, orange, pink&green"
    val regex = "[,\\s]+".toRegex()
    val mixedColor = regex.splitToSequence(colorsText)
        .onEach { println(it) }
        .firstOrNull { it.contains('&') }
    println(mixedColor) // "brown&blue"
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.5" validate="false"}

유사한 함수가 `CharSequence`에도 추가되었습니다:

```kotlin
    val mixedColor = colorsText.splitToSequence(regex)
```
{kotlin-runnable="false"}

## Serialization 1.3.0-RC

`kotlinx.serialization` [1.3.0-RC](https://github.com/Kotlin/kotlinx.serialization/releases/tag/v1.3.0-RC)가 새로운 JSON 직렬화 기능과 함께 출시되었습니다:
*   Java IO 스트림 직렬화
*   기본값에 대한 프로퍼티 레벨 제어
*   직렬화에서 null 값을 제외하는 옵션
*   다형성 직렬화의 커스텀 클래스 구분자

자세한 내용은 [변경 로그](https://github.com/Kotlin/kotlinx.serialization/releases/tag/v1.3.0-RC)를 참조하십시오.
<!-- and the [kotlinx.serialization 1.3.0 release blog post](TODO). -->