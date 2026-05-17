[//]: # (title: Kotlin 1.5.30의 새로운 기능)

<web-summary>새로운 언어 기능, Kotlin 멀티플랫폼(Multiplatform), JVM, Native, JS 업데이트 및 Gradle과 Maven 빌드 도구 지원을 포함한 Kotlin 1.5.30 릴리스 노트를 읽어보세요.</web-summary>

_[출시일: 2021년 8월 24일](releases.md#release-history)_

Kotlin 1.5.30은 향후 변경 사항에 대한 프리뷰를 포함한 언어 업데이트, 플랫폼 지원 및 도구의 다양한 개선 사항, 그리고 새로운 표준 라이브러리 함수를 제공합니다.

주요 개선 사항은 다음과 같습니다:
* 실험적인 봉인된(sealed) `when` 문, 옵트인(opt-in) 요구 사항 사용 변경 등을 포함한 언어 기능
* 애플 실리콘(Apple silicon) 기본 지원
* Kotlin/JS IR 백엔드 베타(Beta) 단계 진입
* 개선된 Gradle 플러그인 경험

[출시 블로그 포스트](https://blog.jetbrains.com/kotlin/2021/08/kotlin-1-5-30-released/)와 다음 영상에서 변경 사항에 대한 짧은 개요를 확인할 수 있습니다.

<video src="https://www.youtube.com/v/rNbb3A9IdOo" title="Kotlin 1.5.30"/>

> Kotlin 릴리스 주기에 대한 정보는 [Kotlin 릴리스 프로세스](releases.md)를 참조하세요.
>
{style="tip"}

## 언어 기능

Kotlin 1.5.30은 향후 언어 변경 사항의 프리뷰를 제시하고 옵트인 요구 사항 메커니즘 및 타입 추론을 개선합니다.
* [봉인된(sealed) 및 불리언(Boolean) 대상을 위한 완전한 when 문](#exhaustive-when-statements-for-sealed-and-boolean-subjects)
* [상위 타입으로서의 서스펜딩 함수](#suspending-functions-as-supertypes)
* [실험적 API의 암시적 사용에 대한 옵트인 요구](#requiring-opt-in-on-implicit-usages-of-experimental-apis)
* [서로 다른 타겟에 대한 옵트인 요구 사항 어노테이션 사용 변경 사항](#changes-to-using-opt-in-requirement-annotations-with-different-targets)
* [재귀적 제네릭 타입에 대한 타입 추론 개선](#improvements-to-type-inference-for-recursive-generic-types)
* [빌더 추론 제한 제거](#eliminating-builder-inference-restrictions)

### 봉인된(sealed) 및 불리언(Boolean) 대상을 위한 완전한 when 문

> 봉인된(sealed) 대상을 위한 완전한(exhaustive) when 문 지원은 [실험적(Experimental)](components-stability.md) 단계입니다. 언제든지 삭제되거나 변경될 수 있습니다.
> 옵트인(아래 상세 내용 참조)이 필요하며, 평가 목적으로만 사용해야 합니다. [YouTrack](https://youtrack.jetbrains.com/issue/KT-12380)을 통해 여러분의 피드백을 기다립니다.
>
{style="warning"}

_완전한(exhaustive)_ [`when`](control-flow.md#when-expressions-and-statements) 문은 대상(subject)의 모든 가능한 타입이나 값에 대한 브랜치를 포함하거나, 특정 타입에 대한 브랜치와 나머지 케이스를 처리하는 `else` 브랜치를 포함합니다.

Kotlin은 `when` 표현식과 동작을 일치시키기 위해 곧 완전하지 않은 `when` 문을 금지할 계획입니다. 원활한 이전을 위해 봉인된 클래스나 불리언을 사용하는 완전하지 않은 `when` 문에 대해 컴파일러가 경고를 보고하도록 설정할 수 있습니다. 이러한 경고는 Kotlin 1.6에서 기본적으로 나타나며, 나중에는 에러가 됩니다.

> 열거형(Enum)은 이미 경고가 발생합니다.
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
// WARNING: Non exhaustive 'when' statements on sealed classes/interfaces 
// will be prohibited in 1.7, add an 'OFF' or 'else' branch instead

    val y: Boolean = true
    when (y) {  
        true -> println("true")
    }
// WARNING: Non exhaustive 'when' statements on Booleans will be prohibited 
// in 1.7, add a 'false' or 'else' branch instead
}
```

Kotlin 1.5.30에서 이 기능을 활성화하려면 언어 버전(language version) `1.6`을 사용하세요. [프로그레시브 모드(progressive mode)](whatsnew13.md#progressive-mode)를 활성화하여 경고를 에러로 바꿀 수도 있습니다.

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
kotlin {
    sourceSets.all {
        languageSettings.apply {
            languageVersion = "1.6"
            //progressiveMode = true // 기본값은 false
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
            //progressiveMode = true // 기본값은 false
        }
    }
}
```

</tab>
</tabs>

### 상위 타입으로서의 서스펜딩 함수

> 상위 타입으로서의 서스펜딩(suspending) 함수 지원은 [실험적(Experimental)](components-stability.md) 단계입니다. 언제든지 삭제되거나 변경될 수 있습니다.
> 옵트인(아래 상세 내용 참조)이 필요하며, 평가 목적으로만 사용해야 합니다. [YouTrack](https://youtrack.jetbrains.com/issue/KT-18707)을 통해 여러분의 피드백을 기다립니다.
>
{style="warning"}

Kotlin 1.5.30은 몇 가지 제한 사항과 함께 `suspend` 함수형 타입을 상위 타입으로 사용할 수 있는 기능의 프리뷰를 제공합니다.

```kotlin
class MyClass: suspend () -> Unit {
    override suspend fun invoke() { TODO() }
}
```

이 기능을 활성화하려면 `-language-version 1.6` 컴파일러 옵션을 사용하세요:

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
* 일반 함수형 타입과 `suspend` 함수형 타입을 상위 타입으로 섞어 쓸 수 없습니다. 이는 JVM 백엔드의 `suspend` 함수형 타입 구현 방식 때문입니다. JVM에서는 마커 인터페이스가 있는 일반 함수형 타입으로 표현됩니다. 이 마커 인터페이스 때문에 어떤 상위 인터페이스가 서스펜드 타입이고 어떤 것이 일반 타입인지 구별할 방법이 없습니다.
* 여러 개의 `suspend` 함수형 상위 타입을 사용할 수 없습니다. 타입 체크가 있는 경우 여러 개의 일반 함수형 상위 타입도 사용할 수 없습니다.

### 실험적 API의 암시적 사용에 대한 옵트인 요구

> 옵트인 요구 사항 메커니즘은 [실험적(Experimental)](components-stability.md) 단계입니다.
> 언제든지 변경될 수 있습니다. [옵트인 방법 보기](opt-in-requirements.md).
> 평가 목적으로만 사용하세요. [YouTrack](https://youtrack.jetbrains.com/issues/KT)을 통해 여러분의 피드백을 기다립니다.
>
{style="warning"}

라이브러리 작성자는 실험적 API를 [옵트인 요구 사항](opt-in-requirements.md#create-opt-in-requirement-annotations)으로 표시하여 사용자에게 실험적 상태임을 알릴 수 있습니다. 컴파일러는 해당 API가 사용될 때 경고나 에러를 발생시키며, 이를 무시하려면 [명시적 동의(explicit consent)](opt-in-requirements.md#opt-in-to-api)가 필요합니다.

Kotlin 1.5.30에서 컴파일러는 시그니처에 실험적 타입을 가진 모든 선언을 실험적인 것으로 취급합니다. 즉, 실험적 API를 암시적으로 사용하는 경우에도 옵트인이 필요합니다. 예를 들어, 함수의 반환 타입이 실험적 API 요소로 표시된 경우, 선언 자체가 명시적으로 옵트인 요구 사항으로 표시되지 않았더라도 해당 함수를 사용하려면 옵트인이 필요합니다.

```kotlin
// 라이브러리 코드

@RequiresOptIn(message = "이 API는 실험적입니다.")
@Retention(AnnotationRetention.BINARY)
@Target(AnnotationTarget.CLASS)
annotation class MyDateTime // 옵트인 요구 사항 어노테이션

@MyDateTime
class DateProvider // 옵트인이 필요한 클래스

// 클라이언트 코드

// 경고: 실험적 API 사용
fun createDateSource(): DateProvider { /* ... */ }

fun getDate(): Date {
    val dateSource = createDateSource() // 이 또한 경고: 실험적 API 사용
    // ... 
}
```

[옵트인 요구 사항](opt-in-requirements.md)에 대해 더 알아보세요.

### 서로 다른 타겟에 대한 옵트인 요구 사항 어노테이션 사용 변경 사항

> 옵트인 요구 사항 메커니즘은 [실험적(Experimental)](components-stability.md) 단계입니다.
> 언제든지 변경될 수 있습니다. [옵트인 방법 보기](opt-in-requirements.md).
> 평가 목적으로만 사용하세요. [YouTrack](https://youtrack.jetbrains.com/issues/KT)을 통해 여러분의 피드백을 기다립니다.
>
{style="warning"}

Kotlin 1.5.30은 다양한 [타겟(targets)](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.annotation/-target/)에 대해 옵트인 요구 사항 어노테이션을 사용하고 선언하는 새로운 규칙을 제시합니다. 이제 컴파일러는 컴파일 타임에 처리하기 어려운 사례에 대해 에러를 보고합니다. Kotlin 1.5.30에서는:
* 사용처(use site)에서 로컬 변수 및 값 파라미터에 옵트인 요구 사항 어노테이션을 표시하는 것이 금지됩니다.
* 오버라이드(override) 표시는 기본 선언도 표시되어 있는 경우에만 허용됩니다.
* 백킹 필드(backing field) 및 게터(getter) 표시는 금지됩니다. 대신 기본 프로퍼티에 표시할 수 있습니다.
* 옵트인 요구 사항 어노테이션 선언 시 `TYPE` 및 `TYPE_PARAMETER` 어노테이션 타겟 설정이 금지됩니다.

[옵트인 요구 사항](opt-in-requirements.md)에 대해 더 알아보세요.

### 재귀적 제네릭 타입에 대한 타입 추론 개선

Kotlin과 Java에서는 타입 파라미터에서 자신을 참조하는 재귀적 제네릭 타입(recursive generic type)을 정의할 수 있습니다. Kotlin 1.5.30에서 Kotlin 컴파일러는 재귀적 제네릭인 경우 해당 타입 파라미터의 상한(upper bound)만을 기반으로 타입 인자를 추론할 수 있습니다. 이를 통해 Java에서 빌더 API를 만들 때 자주 사용되는 재귀적 제네릭 타입의 다양한 패턴을 생성할 수 있게 되었습니다.

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

`-Xself-upper-bound-inference` 또는 `-language-version 1.6` 컴파일러 옵션을 전달하여 개선 사항을 활성화할 수 있습니다. 새로 지원되는 다른 사용 사례의 예는 [이 YouTrack 티켓](https://youtrack.jetbrains.com/issue/KT-40804)에서 확인하세요.

### 빌더 추론 제한 제거

빌더 추론(builder inference)은 람다 인자 내부의 다른 호출 정보를 기반으로 호출의 타입 인자를 추론할 수 있게 해주는 특수한 타입 추론입니다. 이는 [`buildList()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/build-list.html) 또는 [`sequence()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.sequences/sequence.html)와 같은 제네릭 빌더 함수를 호출할 때 유용합니다: `buildList { add("string") }`.

기존에는 이러한 람다 인자 내부에서 빌더 추론이 추론하려고 시도하는 타입 정보를 사용하는 데 제한이 있었습니다. 즉, 정보를 지정할 수는 있지만 가져올 수는 없었습니다. 예를 들어, `buildList()`의 람다 인자 내부에서 타입 인자를 명시적으로 지정하지 않고는 [`get()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-list/get.html)을 호출할 수 없었습니다.

Kotlin 1.5.30은 `-Xunrestricted-builder-inference` 컴파일러 옵션을 통해 이러한 제한을 제거합니다. 이 옵션을 추가하여 제네릭 빌더 함수의 람다 인자 내에서 이전에 금지되었던 호출들을 활성화하세요:

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

또한, `-language-version 1.6` 컴파일러 옵션으로도 이 기능을 활성화할 수 있습니다.

## Kotlin/JVM

Kotlin 1.5.30과 함께 Kotlin/JVM에는 다음과 같은 기능이 추가되었습니다:
* [어노테이션 클래스의 인스턴스화](#instantiation-of-annotation-classes)
* [개선된 널 허용 여부(nullability) 어노테이션 지원 구성](#improved-nullability-annotation-support-configuration)

JVM 플랫폼의 Kotlin Gradle 플러그인 업데이트에 대해서는 [Gradle](#gradle) 섹션을 참조하세요.

### 어노테이션 클래스의 인스턴스화

> 어노테이션 클래스의 인스턴스화는 [실험적(Experimental)](components-stability.md) 단계입니다. 언제든지 삭제되거나 변경될 수 있습니다.
> 옵트인(아래 상세 내용 참조)이 필요하며, 평가 목적으로만 사용해야 합니다. [YouTrack](https://youtrack.jetbrains.com/issue/KT-45395)을 통해 여러분의 피드백을 기다립니다.
>
{style="warning"}

Kotlin 1.5.30을 사용하면 임의의 코드에서 [어노테이션 클래스](annotations.md)의 생성자를 호출하여 인스턴스를 얻을 수 있습니다. 이 기능은 어노테이션 인터페이스의 구현을 허용하는 Java 관례와 동일한 사용 사례를 다룹니다.

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

이 기능을 활성화하려면 `-language-version 1.6` 컴파일러 옵션을 사용하세요. `val`이 아닌 파라미터를 정의하거나 보조 생성자가 아닌 멤버를 정의하는 것과 같은 현재의 어노테이션 클래스 제한 사항은 그대로 유지된다는 점에 유의하세요.

어노테이션 클래스 인스턴스화에 대한 자세한 내용은 [이 KEEP](https://github.com/Kotlin/KEEP/blob/master/proposals/annotation-instantiation.md)에서 확인할 수 있습니다.

### 개선된 널 허용 여부(nullability) 어노테이션 지원 구성

Kotlin 컴파일러는 Java에서 널 허용 여부 정보를 가져오기 위해 다양한 유형의 [널 허용 여부 어노테이션(nullability annotations)](java-interop.md#nullability-annotations)을 읽을 수 있습니다. 이 정보를 통해 Java 코드를 호출할 때 Kotlin에서 널 허용 여부 불일치를 보고할 수 있습니다.

Kotlin 1.5.30에서는 특정 유형의 널 허용 여부 어노테이션 정보를 기반으로 컴파일러가 불일치를 보고할지 여부를 지정할 수 있습니다. `-Xnullability-annotations=@<package-name>:<report-level>` 컴파일러 옵션을 사용하면 됩니다. 인자에는 정규화된 널 허용 여부 어노테이션 패키지와 다음 보고 레벨 중 하나를 지정합니다:
* `ignore`: 널 허용 여부 불일치를 무시함
* `warn`: 경고를 보고함
* `strict`: 에러를 보고함

[지원되는 널 허용 여부 어노테이션의 전체 목록](java-interop.md#nullability-annotations)과 정규화된 패키지 이름을 확인하세요.

다음은 새로 지원되는 [RxJava](https://github.com/ReactiveX/RxJava) 3 널 허용 여부 어노테이션에 대해 에러 보고를 활성화하는 예입니다: `-Xnullability-annotations=@io.reactivex.rxjava3.annotations:strict`. 이러한 모든 널 허용 여부 불일치는 기본적으로 경고입니다.

## Kotlin/Native

Kotlin/Native에 다양한 변경 및 개선 사항이 적용되었습니다:
* [애플 실리콘(Apple silicon) 지원](#apple-silicon-support)
* [CocoaPods Gradle 플러그인을 위한 개선된 Kotlin DSL](#improved-kotlin-dsl-for-the-cocoapods-gradle-plugin)
* [Swift 5.5 async/await와의 실험적 상호 운용성](#experimental-interoperability-with-swift-5-5-async-await)
* [객체(object) 및 컴패니언 객체(companion object)에 대한 개선된 Swift/Objective-C 매핑](#improved-swift-objective-c-mapping-for-objects-and-companion-objects)
* [MinGW 타겟에 대해 임포트 라이브러리 없는 DLL 링크 금지(deprecated)](#deprecation-of-linkage-against-dlls-without-import-libraries-for-mingw-targets)

### 애플 실리콘 지원

Kotlin 1.5.30은 [애플 실리콘(Apple silicon)](https://support.apple.com/en-us/HT211814)을 네이티브로 지원합니다.

이전에는 Kotlin/Native 컴파일러와 도구가 애플 실리콘 호스트에서 작동하기 위해 [로제타(Rosetta) 번역 환경](https://developer.apple.com/documentation/apple-silicon/about-the-rosetta-translation-environment)이 필요했습니다. Kotlin 1.5.30부터는 번역 환경이 더 이상 필요하지 않으며, 컴파일러와 도구가 추가 작업 없이 애플 실리콘 하드웨어에서 직접 실행될 수 있습니다.

또한 Kotlin 코드가 애플 실리콘에서 네이티브로 실행되도록 하는 새로운 타겟을 도입했습니다:
* `macosArm64`
* `iosSimulatorArm64`
* `watchosSimulatorArm64`
* `tvosSimulatorArm64`

이 타겟들은 인텔 기반 및 애플 실리콘 호스트 모두에서 사용할 수 있습니다. 기존의 모든 타겟 역시 애플 실리콘 호스트에서 사용할 수 있습니다.

1.5.30에서는 `kotlin-multiplatform` Gradle 플러그인에서 애플 실리콘 타겟에 대한 기본적인 지원만 제공한다는 점에 유의하세요. 특히, 새로운 시뮬레이터 타겟은 `ios`, `tvos`, `watchos` 타겟 단축어(shortcuts)에 포함되지 않습니다.
새로운 타겟들에 대한 사용자 경험을 개선하기 위해 계속 노력할 예정입니다.

### CocoaPods Gradle 플러그인을 위한 개선된 Kotlin DSL

#### Kotlin/Native 프레임워크를 위한 새로운 파라미터

Kotlin 1.5.30은 Kotlin/Native 프레임워크를 위한 개선된 CocoaPods Gradle 플러그인 DSL을 도입했습니다. 프레임워크 이름 외에도 Pod 구성에서 다른 파라미터를 지정할 수 있습니다:
* 프레임워크의 동적(dynamic) 또는 정적(static) 버전 지정
* 의존성 내보내기(export dependencies) 명시적 활성화
* 비트코드(Bitcode) 임베딩 활성화

새로운 DSL을 사용하려면 프로젝트를 Kotlin 1.5.30으로 업데이트하고 `build.gradle(.kts)` 파일의 `cocoapods` 섹션에 파라미터를 지정하세요:

```kotlin
cocoapods {
    frameworkName = "MyFramework" // 이 프로퍼티는 지원 중단되었습니다.
    // 향후 버전에서 제거될 예정입니다.
    // 프레임워크 구성을 위한 새로운 DSL:
    framework {
        // 모든 Framework 프로퍼티가 지원됩니다.
        // 프레임워크 이름 설정. 지원 중단된 'frameworkName' 대신 이 프로퍼티를 사용하세요.
        baseName = "MyFramework"
        // 동적 프레임워크 지원
        isStatic = false
        // 의존성 내보내기
        export(project(":anotherKMMModule"))
        transitiveExport = false // 기본값입니다.
        // 비트코드 임베딩
        embedBitcode(BITCODE)
    }
}
```

#### Xcode 구성을 위한 커스텀 이름 지원

Kotlin CocoaPods Gradle 플러그인은 Xcode 빌드 구성에서 커스텀 이름을 지원합니다. 이는 Xcode에서 `Staging`과 같은 빌드 구성에 특별한 이름을 사용하는 경우 도움이 됩니다.

커스텀 이름을 지정하려면 `build.gradle(.kts)` 파일의 `cocoapods` 섹션에서 `xcodeConfigurationToNativeBuildType` 파라미터를 사용하세요:

```kotlin
cocoapods {
    // 커스텀 Xcode 구성을 NativeBuildType에 매핑
    xcodeConfigurationToNativeBuildType["CUSTOM_DEBUG"] = NativeBuildType.DEBUG
    xcodeConfigurationToNativeBuildType["CUSTOM_RELEASE"] = NativeBuildType.RELEASE
}
```

이 파라미터는 Podspec 파일에는 나타나지 않습니다. Xcode가 Gradle 빌드 프로세스를 실행할 때, Kotlin CocoaPods Gradle 플러그인이 필요한 네이티브 빌드 타입을 선택합니다.

> `Debug` 및 `Release` 구성은 기본적으로 지원되므로 별도로 선언할 필요가 없습니다.
>
{style="note"}

### Swift 5.5 async/await와의 실험적 상호 운용성

> Swift async/await와의 동시성 상호 운용성은 [실험적(Experimental)](components-stability.md) 단계입니다. 언제든지 삭제되거나 변경될 수 있습니다.
> 평가 목적으로만 사용해야 합니다. [YouTrack](https://youtrack.jetbrains.com/issue/KT-47610)을 통해 여러분의 피드백을 기다립니다.
>
{style="warning"}

우리는 [1.4.0에서 Objective-C 및 Swift에서 Kotlin의 서스펜딩 함수를 호출하는 지원을 추가](whatsnew14.md#support-for-kotlin-s-suspending-functions-in-swift-and-objective-c)했으며, 이제 새로운 Swift 5.5 기능인 [`async` 및 `await` 수정자를 사용한 동시성](https://github.com/apple/swift-evolution/blob/main/proposals/0296-async-await.md)에 맞춰 이를 개선하고 있습니다.

이제 Kotlin/Native 컴파일러는 널 허용 반환 타입을 가진 서스펜딩 함수를 위해 생성된 Objective-C 헤더에 `_Nullable_result` 속성을 내보냅니다. 이를 통해 Swift에서 적절한 널 허용 여부를 가진 `async` 함수로 호출할 수 있습니다.

이 기능은 실험적이며 향후 Kotlin 및 Swift의 변경 사항에 의해 영향을 받을 수 있습니다. 현재로서는 특정 제한 사항이 있는 프리뷰를 제공하고 있으며, 여러분의 의견을 기다리고 있습니다. 현재 상태에 대해 자세히 알아보고 [이 YouTrack 이슈](https://youtrack.jetbrains.com/issue/KT-47610)에 피드백을 남겨주세요.

### 객체(object) 및 컴패니언 객체(companion object)에 대한 개선된 Swift/Objective-C 매핑

이제 네이티브 iOS 개발자에게 더 직관적인 방식으로 객체 및 컴패니언 객체에 접근할 수 있습니다. 예를 들어 Kotlin에 다음과 같은 객체가 있다고 가정해 보겠습니다:

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

[Swift/Objective-C 상호 운용성](native-objc-interop.md)에 대해 더 알아보세요.

### MinGW 타겟에 대해 임포트 라이브러리 없는 DLL 링크 금지(deprecated)

[LLD](https://lld.llvm.org/)는 LLVM 프로젝트의 링커로, 기본 ld.bfd에 비해 더 나은 성능 등의 장점이 있어 MinGW 타겟용 Kotlin/Native에서 사용을 시작할 계획입니다.

그러나 LLD의 최신 안정 버전은 MinGW(Windows) 타겟에 대해 DLL 직접 링크를 지원하지 않습니다. 이러한 링크에는 [임포트 라이브러리(import libraries)](https://stackoverflow.com/questions/3573475/how-does-the-import-library-work-details/3573527#3573527)를 사용해야 합니다. Kotlin/Native 1.5.30에서는 아직 필요하지 않지만, 향후 MinGW의 기본 링커가 될 LLD와 이러한 사용 방식이 호환되지 않음을 알리기 위해 경고를 추가했습니다.

LLD 링커로의 전환에 대한 생각이나 우려 사항을 [이 YouTrack 이슈](https://youtrack.jetbrains.com/issue/KT-47605)에 공유해 주세요.

## Kotlin 멀티플랫폼

1.5.30은 Kotlin 멀티플랫폼에 다음과 같은 주목할 만한 업데이트를 제공합니다:
* [공유 네이티브 코드에서 커스텀 `cinterop` 라이브러리 사용 기능](#ability-to-use-custom-cinterop-libraries-in-shared-native-code)
* [XCFrameworks 지원](#support-for-xcframeworks)
* [Android 아티팩트를 위한 새로운 기본 게시 설정](#new-default-publishing-setup-for-android-artifacts)

### 공유 네이티브 코드에서 커스텀 cinterop 라이브러리 사용 기능

Kotlin 멀티플랫폼은 공유 소스 세트에서 플랫폼 종속 상호 운용 라이브러리를 사용할 수 있는 [옵션](https://kotlinlang.org/docs/multiplatform/multiplatform-share-on-platforms.html#connect-platform-specific-libraries)을 제공합니다. 1.5.30 이전에는 Kotlin/Native 배포판과 함께 제공되는 [플랫폼 라이브러리](native-platform-libs.md)에서만 작동했습니다. 1.5.30부터는 커스텀 `cinterop` 라이브러리에서도 이를 사용할 수 있습니다. 이 기능을 활성화하려면 `gradle.properties`에 `kotlin.mpp.enableCInteropCommonization=true` 프로퍼티를 추가하세요:

```none
kotlin.mpp.enableGranularSourceSetsMetadata=true
kotlin.native.enableDependencyPropagation=false
kotlin.mpp.enableCInteropCommonization=true
```

### XCFrameworks 지원

이제 모든 Kotlin 멀티플랫폼 프로젝트에서 출력 형식으로 XCFrameworks를 가질 수 있습니다. 애플은 유니버설(fat) 프레임워크의 대체재로 XCFrameworks를 도입했습니다. XCFrameworks를 사용하면 다음이 가능합니다:
* 모든 타겟 플랫폼 및 아키텍처에 대한 로직을 단일 번들에 모을 수 있습니다.
* 애플리케이션을 App Store에 게시하기 전에 불필요한 아키텍처를 모두 제거할 필요가 없습니다.

XCFrameworks는 애플 M1의 기기 및 시뮬레이터에서 Kotlin 프레임워크를 사용하려는 경우 유용합니다.

XCFrameworks를 사용하려면 `build.gradle(.kts)` 스크립트를 업데이트하세요:

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

XCFrameworks를 선언하면 다음과 같은 새로운 Gradle 태스크들이 등록됩니다:
* `assembleXCFramework`
* `assembleDebugXCFramework` ([dSYMs를 포함한](native-debugging.md#debug-ios-applications) 추가 디버그 아티팩트)
* `assembleReleaseXCFramework`

[이 WWDC 영상](https://developer.apple.com/videos/play/wwdc2019/416/)에서 XCFrameworks에 대해 더 알아보세요.

### Android 아티팩트를 위한 새로운 기본 게시 설정

`maven-publish` Gradle 플러그인을 사용하여 빌드 스크립트에 [Android 배리에이션(variant)](https://developer.android.com/studio/build/build-variants) 이름을 지정함으로써 [Android 타겟용 멀티플랫폼 라이브러리를 게시](https://kotlinlang.org/docs/multiplatform/multiplatform-publish-lib-setup.html#publish-an-android-library)할 수 있습니다. Kotlin Gradle 플러그인이 자동으로 게시물을 생성합니다.

1.5.30 이전에는 생성된 게시 [메타데이터](https://docs.gradle.org/current/userguide/publishing_gradle_module_metadata.html)에 게시된 모든 Android 배리에이션에 대한 빌드 타입 속성이 포함되어 있어, 라이브러리 소비자가 사용하는 동일한 빌드 타입과만 호환되었습니다. Kotlin 1.5.30은 새로운 기본 게시 설정을 도입합니다:
* 프로젝트가 게시하는 모든 Android 배리에이션이 동일한 빌드 타입 속성을 갖는 경우, 게시된 배리에이션에는 빌드 타입 속성이 포함되지 않으며 모든 빌드 타입과 호환됩니다.
* 게시된 배리에이션들이 서로 다른 빌드 타입 속성을 갖는 경우, `release` 값을 가진 배리에이션들만 빌드 타입 속성 없이 게시됩니다. 이를 통해 릴리스 배리에이션은 소비자 측의 모든 빌드 타입과 호환되며, 릴리스가 아닌 배리에이션은 일치하는 소비자 빌드 타입과만 호환됩니다.

이를 거부하고 모든 배리에이션에 대해 빌드 타입 속성을 유지하려면 `kotlin.android.buildTypeAttribute.keep=true` Gradle 프로퍼티를 설정할 수 있습니다.

## Kotlin/JS

1.5.30에서 Kotlin/JS에 두 가지 주요 개선 사항이 적용되었습니다:
* [JS IR 컴파일러 백엔드 베타(Beta) 단계 진입](#js-ir-compiler-backend-reaches-beta)
* [Kotlin/JS IR 백엔드를 사용하는 애플리케이션의 더 나은 디버깅 경험](#better-debugging-experience-for-applications-with-the-kotlin-js-ir-backend)

### JS IR 컴파일러 백엔드 베타 단계 진입

1.4.0에서 [알파(Alpha)](components-stability.md) 단계로 도입되었던 Kotlin/JS의 [IR 기반 컴파일러 백엔드](whatsnew14.md#unified-backends-and-extensibility)가 베타 단계에 도달했습니다.

이전에 프로젝트를 새 백엔드로 이전하는 데 도움을 주기 위해 JS IR 백엔드 마이그레이션 가이드를 게시한 바 있습니다. 이제 IntelliJ IDEA에서 필요한 변경 사항을 직접 표시해 주는 [Kotlin/JS Inspection Pack](https://plugins.jetbrains.com/plugin/17183-kotlin-js-inspection-pack/) IDE 플러그인을 선보입니다.

### Kotlin/JS IR 백엔드를 사용하는 애플리케이션의 더 나은 디버깅 경험

Kotlin 1.5.30은 Kotlin/JS IR 백엔드를 위한 JavaScript 소스 맵 생성을 제공합니다. 이를 통해 IR 백엔드가 활성화되었을 때 브레이크포인트, 스테핑(stepping), 적절한 소스 참조가 포함된 가독성 있는 스택 트레이스를 포함한 전체 디버깅 지원으로 Kotlin/JS 디버깅 경험이 개선됩니다.

[브라우저나 IntelliJ IDEA Ultimate에서 Kotlin/JS를 디버깅하는 방법](js-debugging.md)을 알아보세요.

## Gradle

[Kotlin Gradle 플러그인 사용자 경험을 개선](https://youtrack.jetbrains.com/issue/KT-45778)하려는 미션의 일환으로 다음 기능들을 구현했습니다:
* [Java 툴체인(toolchain) 지원](#support-for-java-toolchains). 여기에는 [이전 Gradle 버전을 위해 `UsesKotlinJavaToolchain` 인터페이스로 JDK 홈을 지정하는 기능](#ability-to-specify-jdk-home-with-useskotlinjavatoolchain-interface)이 포함됩니다.
* [Kotlin 데몬의 JVM 인자를 명시적으로 지정하는 더 쉬운 방법](#easier-way-to-explicitly-specify-kotlin-daemon-jvm-arguments)

### Java 툴체인 지원

Gradle 6.7은 ["Java 툴체인(Java toolchains) 지원"](https://docs.gradle.org/current/userguide/toolchains.html) 기능을 도입했습니다.
이 기능을 사용하면 다음이 가능합니다:
* Gradle 실행용 JDK/JRE와 다른 JDK 및 JRE를 사용하여 컴파일, 테스트 및 실행 파일을 실행할 수 있습니다.
* 아직 출시되지 않은 언어 버전으로 코드를 컴파일하고 테스트할 수 있습니다.

툴체인 지원을 통해 Gradle은 로컬 JDK를 자동 감지하고 빌드에 필요한 누락된 JDK를 설치할 수 있습니다. 이제 Gradle 자체는 어떤 JDK에서도 실행될 수 있으며 여전히 [빌드 캐시 기능](gradle-compilation-and-caches.md#gradle-build-cache-support)을 재사용할 수 있습니다.

Kotlin Gradle 플러그인은 Kotlin/JVM 컴파일 태스크를 위한 Java 툴체인을 지원합니다.
Java 툴체인은:
* JVM 타겟에서 사용할 수 있는 [`jdkHome` 옵션](gradle-compiler-options.md#attributes-specific-to-jvm)을 설정합니다.
  > [`jdkHome` 옵션을 직접 설정하는 기능은 지원 중단되었습니다](https://youtrack.jetbrains.com/issue/KT-46541).
  >
  {style="warning"}

* 사용자가 `jvmTarget` 옵션을 명시적으로 설정하지 않은 경우, [`kotlinOptions.jvmTarget`](gradle-compiler-options.md#attributes-specific-to-jvm)을 툴체인의 JDK 버전으로 설정합니다.
  툴체인이 구성되지 않은 경우 `jvmTarget` 필드는 기본값을 사용합니다. [JVM 타겟 호환성](gradle-configure-project.md#check-for-jvm-target-compatibility-of-related-compile-tasks)에 대해 더 알아보세요.

* [`kapt` 워커](kapt.md#run-kapt-tasks-in-parallel)가 실행되는 JDK에 영향을 줍니다.

툴체인을 설정하려면 다음 코드를 사용하세요. `<MAJOR_JDK_VERSION>` 자리 표시자를 사용하려는 JDK 버전으로 바꾸세요:

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

`kotlin` 확장을 통해 툴체인을 설정하면 Java 컴파일 태스크의 툴체인도 업데이트된다는 점에 유의하세요.

`java` 확장을 통해 툴체인을 설정하면 Kotlin 컴파일 태스크에서도 이를 사용합니다:

```kotlin
java {
    toolchain {
        languageVersion.set(JavaLanguageVersion.of(<MAJOR_JDK_VERSION>)) // "8"
    }
}
```

`KotlinCompile` 태스크에 임의의 JDK 버전을 설정하는 정보는 [태스크 DSL로 JDK 버전 설정](gradle-configure-project.md#set-jdk-version-with-the-task-dsl)에 관한 문서를 확인하세요.

Gradle 버전 6.1에서 6.6의 경우, [`UsesKotlinJavaToolchain` 인터페이스를 사용하여 JDK 홈을 설정하세요](#ability-to-specify-jdk-home-with-useskotlinjavatoolchain-interface).

### UsesKotlinJavaToolchain 인터페이스를 통한 JDK 홈 지정 기능

[`kotlinOptions`](gradle-compiler-options.md)를 통해 JDK 설정을 지원하는 모든 Kotlin 태스크는 이제 `UsesKotlinJavaToolchain` 인터페이스를 구현합니다. JDK 홈을 설정하려면 JDK 경로를 입력하고 `<JDK_VERSION>` 자리 표시자를 바꾸세요:

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

Gradle 버전 6.1에서 6.6의 경우 `UsesKotlinJavaToolchain` 인터페이스를 사용하세요. Gradle 6.7부터는 [Java 툴체인](#support-for-java-toolchains)을 대신 사용하세요.

이 기능을 사용할 때 [kapt 태스크 워커](kapt.md#run-kapt-tasks-in-parallel)는 [프로세스 격리 모드(process isolation mode)](https://docs.gradle.org/current/userguide/worker_api.html#changing_the_isolation_mode)만 사용하며, `kapt.workers.isolation` 프로퍼티는 무시된다는 점에 유의하세요.

### Kotlin 데몬 JVM 인자를 명시적으로 지정하는 더 쉬운 방법

Kotlin 1.5.30에는 Kotlin 데몬의 JVM 인자를 위한 새로운 로직이 적용되었습니다. 다음 목록의 각 옵션은 그 이전의 옵션을 덮어씁니다:

* 아무것도 지정하지 않으면 Kotlin 데몬은 (이전과 마찬가지로) Gradle 데몬으로부터 인자를 상속받습니다. 예를 들어 `gradle.properties` 파일에서:

    ```none
    org.gradle.jvmargs=-Xmx1500m -Xms=500m
    ```

* Gradle 데몬의 JVM 인자에 `kotlin.daemon.jvm.options` 시스템 프로퍼티가 있는 경우, 이전과 같이 이를 사용합니다:

    ```none
    org.gradle.jvmargs=-Dkotlin.daemon.jvm.options=-Xmx1500m -Xms=500m
    ```

* `gradle.properties` 파일에 `kotlin.daemon.jvmargs` 프로퍼티를 추가할 수 있습니다:

    ```none
    kotlin.daemon.jvmargs=-Xmx1500m -Xms=500m
    ```

* `kotlin` 확장에서 인자를 지정할 수 있습니다:

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

* 특정 태스크에 대해 인자를 지정할 수 있습니다:

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

    > 이 경우 태스크 실행 시 새로운 Kotlin 데몬 인스턴스가 시작될 수 있습니다. [Kotlin 데몬과 JVM 인자의 상호 작용](gradle-compilation-and-caches.md#setting-kotlin-daemon-s-jvm-arguments)에 대해 더 알아보세요.
    >
    {style="note"}

Kotlin 데몬에 대한 자세한 정보는 [Kotlin 데몬 및 Gradle에서의 사용](gradle-compilation-and-caches.md#the-kotlin-daemon-and-how-to-use-it-with-gradle)을 참조하세요.

## 표준 라이브러리

Kotlin 1.5.30은 표준 라이브러리의 `Duration` 및 `Regex` API에 개선 사항을 제공합니다:
* [`Duration.toString()` 출력 변경](#changing-duration-tostring-output)
* [문자열에서 Duration 파싱](#parsing-duration-from-string)
* [특정 위치에서 Regex 매칭](#matching-with-regex-at-particular-position)
* [Regex를 시퀀스로 분할](#splitting-regex-to-a-sequence)

### Duration.toString() 출력 변경

> Duration API는 [실험적(Experimental)](components-stability.md) 단계입니다. 언제든지 삭제되거나 변경될 수 있습니다.
> 평가 목적으로만 사용하세요. [YouTrack](https://youtrack.jetbrains.com/issues/KT)을 통해 여러분의 피드백을 기다립니다.
>
{style="warning"}

Kotlin 1.5.30 이전에는 [`Duration.toString()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/-duration/to-string.html) 함수가 가장 작고 읽기 쉬운 숫자 값을 산출하는 단위를 사용하여 인자의 문자열 표현을 반환했습니다.
이제부터는 각각 고유의 단위를 가진 숫자 컴포넌트들의 조합으로 표현된 문자열 값을 반환합니다.
각 컴포넌트는 숫자 뒤에 단위의 축약형인 `d`, `h`, `m`, `s`가 붙습니다. 예시는 다음과 같습니다:

|**함수 호출 예시**|**기존 출력**|**현재 출력**|
| --- | --- | --- |
Duration.days(45).toString()|`45.0d`|`45d`|
Duration.days(1.5).toString()|`36.0h`|`1d 12h`|
Duration.minutes(1230).toString()|`20.5h`|`20h 30m`|
Duration.minutes(2415).toString()|`40.3h`|`1d 16h 15m`|
Duration.minutes(920).toString()|`920m`|`15h 20m`|
Duration.seconds(1.546).toString()|`1.55s`|`1.546s`|
Duration.milliseconds(25.12).toString()|`25.1ms`|`25.12ms`|

음수 기간이 표현되는 방식도 변경되었습니다. 음수 기간 앞에는 마이너스 기호(`-`)가 붙으며, 여러 컴포넌트로 구성된 경우 괄호로 감싸집니다: `-12m` 및 `-(1h 30m)`.

1초 미만의 짧은 기간은 밀리초(`ms`), 마이크로초(`us`), 나노초(`ns`) 중 하나의 단위를 사용하여 단일 숫자로 표현됩니다: `140.884ms`, `500us`, `24ns`. 이를 표현하는 데 더 이상 과학적 기수법(Scientific notation)을 사용하지 않습니다.

기간을 단일 단위로 표현하고 싶다면 오버로드된 `Duration.toString(unit, decimals)` 함수를 사용하세요.

> 직렬화 및 교환을 포함한 특정 케이스에서는 [`Duration.toIsoString()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/-duration/to-iso-string.html)을 사용할 것을 권장합니다. `Duration.toIsoString()`은 `Duration.toString()` 대신 더 엄격한 [ISO-8601](https://www.iso.org/iso-8601-date-and-time-format.html) 형식을 사용합니다.
>
{style="note"}

### 문자열에서 Duration 파싱

> Duration API는 [실험적(Experimental)](components-stability.md) 단계입니다. 언제든지 삭제되거나 변경될 수 있습니다.
> 평가 목적으로만 사용하세요. [이 이슈](https://github.com/Kotlin/KEEP/issues/190)를 통해 여러분의 피드백을 기다립니다.
>
{style="warning"}

Kotlin 1.5.30의 Duration API에는 다음과 같은 새로운 함수들이 추가되었습니다:
* [`parse()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/-duration/parse.html): 다음 함수의 출력을 파싱하는 기능을 지원합니다.
    * [`toString()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/-duration/to-string.html)
    * [`toString(unit, decimals)`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/-duration/to-string.html)
    * [`toIsoString()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/-duration/to-iso-string.html)
* [`parseIsoString()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/-duration/parse-iso-string.html): `toIsoString()`에서 생성된 형식만 파싱합니다.
* [`parseOrNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/-duration/parse-or-null.html) 및 [`parseIsoStringOrNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/-duration/parse-iso-string-or-null.html): 위 함수들과 동일하게 동작하지만 잘못된 형식일 때 `IllegalArgumentException`을 던지는 대신 `null`을 반환합니다.

다음은 `parse()` 및 `parseOrNull()`의 사용 예시입니다:

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
    //println(Duration.parse(invalidFormatString)) // 예외 발생
    println(Duration.parseOrNull(invalidFormatString)) // "null"
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.5" validate="false"}

다음은 `parseIsoString()` 및 `parseIsoStringOrNull()`의 사용 예시입니다:

```kotlin
import kotlin.time.Duration
import kotlin.time.ExperimentalTime

@ExperimentalTime
fun main() {
//sampleStart
    val isoFormatString = "PT1H30M"
    val defaultFormatString = "1h 30m"
    println(Duration.parseIsoString(isoFormatString)) // "1h 30m"
    //println(Duration.parseIsoString(defaultFormatString)) // 예외 발생
    println(Duration.parseIsoStringOrNull(defaultFormatString)) // "null"
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.5" validate="false"}

### 특정 위치에서 Regex 매칭

> `Regex.matchAt()` 및 `Regex.matchesAt()` 함수는 [실험적(Experimental)](components-stability.md) 단계입니다. 언제든지 삭제되거나 변경될 수 있습니다.
> 평가 목적으로만 사용하세요. [YouTrack](https://youtrack.jetbrains.com/issue/KT-34021)을 통해 여러분의 피드백을 기다립니다.
>
{style="warning"}

새로운 `Regex.matchAt()` 및 `Regex.matchesAt()` 함수는 `String` 또는 `CharSequence`의 특정 위치에서 정규 표현식(regex)이 정확히 일치하는지 확인할 수 있는 방법을 제공합니다.

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

`matchAt()`은 일치하는 항목을 찾으면 매치(match)를 반환하고, 찾지 못하면 `null`을 반환합니다:

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

> `Regex.splitToSequence()` 및 `CharSequence.splitToSequence(Regex)` 함수는 [실험적(Experimental)](components-stability.md) 단계입니다. 언제든지 삭제되거나 변경될 수 있습니다.
> 평가 목적으로만 사용하세요. [YouTrack](https://youtrack.jetbrains.com/issue/KT-23351)을 통해 여러분의 피드백을 기다립니다.
>
{style="warning"}

새로운 `Regex.splitToSequence()` 함수는 [`split()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/-regex/split.html)의 지연(lazy) 버전입니다. 주어진 정규 표현식의 일치 항목을 기준으로 문자열을 분할하지만, 결과를 [시퀀스(Sequence)](sequences.md)로 반환하므로 결과에 대한 모든 작업이 지연 실행됩니다.

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

`CharSequence`에도 유사한 함수가 추가되었습니다:

```kotlin
    val mixedColor = colorsText.splitToSequence(regex)
```
{kotlin-runnable="false"}

## Serialization 1.3.0-RC

`kotlinx.serialization` [1.3.0-RC](https://github.com/Kotlin/kotlinx.serialization/releases/tag/v1.3.0-RC)가 새로운 JSON 직렬화 기능과 함께 출시되었습니다:
* Java IO 스트림 직렬화
* 프로퍼티 레벨의 기본값 제어
* 직렬화에서 null 값을 제외하는 옵션
* 다형성 직렬화에서의 커스텀 클래스 판별자(discriminators)

자세한 내용은 [변경 로그(changelog)](https://github.com/Kotlin/kotlinx.serialization/releases/tag/v1.3.0-RC)에서 확인하세요.