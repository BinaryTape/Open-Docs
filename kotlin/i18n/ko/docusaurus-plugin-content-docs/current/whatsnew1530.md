---
title: "Kotlin 1.5.30의 새로운 기능"
---
_[릴리스 날짜: 2021년 8월 24일](releases#release-details)_

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

Kotlin 1.5.30은 향후 변경 사항의 미리 보기, 플랫폼 지원 및 툴링의 다양한 개선 사항, 새로운 표준 라이브러리 함수를 포함한 언어 업데이트를 제공합니다.

주요 개선 사항은 다음과 같습니다.
* 실험적인 sealed `when` 문, 옵트인 요구 사항 사용의 변경 사항 등을 포함한 언어 기능
* Apple 실리콘에 대한 네이티브 지원
* Kotlin/JS IR 백엔드가 베타에 도달
* 개선된 Gradle 플러그인 경험

[릴리스 블로그 게시물](https://blog.jetbrains.com/kotlin/2021/08/kotlin-1-5-30-released/)과 이 비디오에서 변경 사항에 대한 간략한 개요를 확인할 수도 있습니다.

<video src="https://www.youtube.com/v/rNbb3A9IdOo" title="Kotlin 1.5.30"/>

## 언어 기능

Kotlin 1.5.30은 향후 언어 변경 사항의 미리 보기를 제공하고 옵트인 요구 사항 메커니즘과 타입 추론을 개선합니다.
* [sealed 및 Boolean subject에 대한 완전한 when 문](#exhaustive-when-statements-for-sealed-and-boolean-subjects)
* [supertype으로서의 suspending 함수](#suspending-functions-as-supertypes)
* [실험적 API의 암시적 사용에 대한 옵트인 요구](#requiring-opt-in-on-implicit-usages-of-experimental-apis)
* [다른 대상을 사용하는 옵트인 요구 사항 어노테이션 사용 변경](#changes-to-using-opt-in-requirement-annotations-with-different-targets)
* [재귀적 제네릭 타입에 대한 타입 추론 개선](#improvements-to-type-inference-for-recursive-generic-types)
* [빌더 추론 제한 제거](#eliminating-builder-inference-restrictions)

### sealed 및 Boolean subject에 대한 완전한 when 문

:::note
sealed (완전한) when 문에 대한 지원은 [실험적](components-stability)입니다. 언제든지 삭제되거나 변경될 수 있습니다.
옵트인이 필요하며(아래 세부 정보 참조), 평가 목적으로만 사용해야 합니다. [YouTrack](https://youtrack.jetbrains.com/issue/KT-12380)에서 이에 대한 피드백을 보내주시면 감사하겠습니다.

완전한 [`when`](control-flow#when-expressions-and-statements) 문은 subject의 가능한 모든 타입 또는 값에 대한 분기, 또는 특정 타입에 대한 분기를 포함하고 나머지 경우를 처리하기 위해 `else` 분기를 포함합니다.

`when` 표현식과 일관된 동작을 위해 곧 완전하지 않은 `when` 문을 금지할 계획입니다. 원활한 마이그레이션을 위해 컴파일러가 sealed 클래스 또는 Boolean이 있는 완전하지 않은 `when` 문에 대한 경고를 보고하도록 구성할 수 있습니다. 이러한 경고는 기본적으로 Kotlin 1.6에 나타나며 나중에 오류가 됩니다.

Enum은 이미 경고를 받습니다.

:::

```kotlin
sealed class Mode {
    object ON : Mode()
    object OFF : Mode()
}

fun main() {
    val x: Mode = Mode.ON
    when (x) { 
        Mode.ON `->` println("ON")
    }
// WARNING: Non exhaustive 'when' statements on sealed classes/interfaces 
// will be prohibited in 1.7, add an 'OFF' or 'else' branch instead

    val y: Boolean = true
    when (y) {  
        true `->` println("true")
    }
// WARNING: Non exhaustive 'when' statements on Booleans will be prohibited 
// in 1.7, add a 'false' or 'else' branch instead
}
```

Kotlin 1.5.30에서 이 기능을 활성화하려면 언어 버전 `1.6`을 사용하세요. [프로그레시브 모드](whatsnew13#progressive-mode)를 활성화하여 경고를 오류로 변경할 수도 있습니다.

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

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

</TabItem>
<TabItem value="groovy" label="Groovy" default>

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

</TabItem>
</Tabs>

### supertype으로서의 suspending 함수

:::note
supertype으로서의 suspending 함수에 대한 지원은 [실험적](components-stability)입니다. 언제든지 삭제되거나 변경될 수 있습니다.
옵트인이 필요하며(아래 세부 정보 참조), 평가 목적으로만 사용해야 합니다. [YouTrack](https://youtrack.jetbrains.com/issue/KT-18707)에서 이에 대한 피드백을 보내주시면 감사하겠습니다.

Kotlin 1.5.30은 몇 가지 제한 사항이 있는 `suspend` 함수 타입 사용 능력에 대한 미리 보기를 제공합니다.

```kotlin
class MyClass: suspend () `->` Unit {
    override suspend fun invoke() { TODO() }
}
```

이 기능을 활성화하려면 `-language-version 1.6` 컴파일러 옵션을 사용하세요.

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
kotlin {
    sourceSets.all {
        languageSettings.apply {
            languageVersion = "1.6"
        }
    }
}
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
kotlin {
    sourceSets.all {
        languageSettings {
            languageVersion = '1.6'
        }
    }
}
```

</TabItem>
</Tabs>

이 기능에는 다음과 같은 제한 사항이 있습니다.
* 일반 함수 타입과 `suspend` 함수 타입을 supertype으로 혼합할 수 없습니다. 이는 JVM 백엔드에서 `suspend` 함수 타입의 구현 세부 사항 때문입니다. 이는 마커 인터페이스가 있는 일반 함수 타입으로 표현됩니다. 마커 인터페이스 때문에 superinterface가 suspended인지 아니면 일반인지 알 수 없습니다.
* 여러 `suspend` 함수 supertype을 사용할 수 없습니다. 타입 검사가 있는 경우 여러 일반 함수 supertype을 사용할 수도 없습니다.

### 실험적 API의 암시적 사용에 대한 옵트인 요구

옵트인 요구 사항 메커니즘은 [실험적](components-stability)입니다.
언제든지 변경될 수 있습니다. [옵트인하는 방법](opt-in-requirements)을 참조하세요.
평가 목적으로만 사용하세요. [YouTrack](https://youtrack.jetbrains.com/issues/KT)에서 이에 대한 피드백을 보내주시면 감사하겠습니다.

라이브러리 작성자는 실험적 API를 [옵트인 필요](opt-in-requirements#create-opt-in-requirement-annotations)로 표시하여 사용자에게 실험적 상태를 알릴 수 있습니다. 컴파일러는 API가 사용될 때 경고 또는 오류를 발생시키고 이를 억제하려면 [명시적 동의](opt-in-requirements#opt-in-to-api)가 필요합니다.

Kotlin 1.5.30에서 컴파일러는 시그니처에 실험적 타입이 있는 모든 선언을 실험적으로 취급합니다. 즉, 실험적 API의 암시적 사용에 대해서도 옵트인이 필요합니다. 예를 들어, 함수의 반환 타입이 실험적 API 요소로 표시된 경우 선언이 옵트인을 명시적으로 요구하는 것으로 표시되지 않은 경우에도 함수 사용에 옵트인이 필요합니다.

```kotlin
// Library code

@RequiresOptIn(message = "This API is experimental.")
@Retention(AnnotationRetention.BINARY)
@Target(AnnotationTarget.CLASS)
annotation class MyDateTime // Opt-in requirement annotation

@MyDateTime
class DateProvider // A class requiring opt-in

// Client code

// Warning: experimental API usage
fun createDateSource(): DateProvider { /* ... */ }

fun getDate(): Date {
    val dateSource = createDateSource() // Also warning: experimental API usage
    // ... 
}
```

[옵트인 요구 사항](opt-in-requirements)에 대해 자세히 알아보세요.

### 다른 대상을 사용하는 옵트인 요구 사항 어노테이션 사용 변경

옵트인 요구 사항 메커니즘은 [실험적](components-stability)입니다.
언제든지 변경될 수 있습니다. [옵트인하는 방법](opt-in-requirements)을 참조하세요.
평가 목적으로만 사용하세요. [YouTrack](https://youtrack.jetbrains.com/issues/KT)에서 이에 대한 피드백을 보내주시면 감사하겠습니다.

Kotlin 1.5.30은 다양한 [대상](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.annotation/-target/)에서 옵트인 요구 사항 어노테이션을 사용하고 선언하기 위한 새로운 규칙을 제시합니다. 컴파일러는 이제 컴파일 시간에 처리하기 어려운 사용 사례에 대한 오류를 보고합니다. Kotlin 1.5.30에서:
* 로컬 변수 및 값 매개변수를 옵트인 요구 사항 어노테이션으로 표시하는 것은 사용 위치에서 금지됩니다.
* override는 기본 선언도 표시된 경우에만 허용됩니다.
* backing field 및 getter를 표시하는 것은 금지됩니다. 대신 기본 속성을 표시할 수 있습니다.
* `TYPE` 및 `TYPE_PARAMETER` 어노테이션 대상을 설정하는 것은 옵트인 요구 사항 어노테이션 선언 위치에서 금지됩니다.

[옵트인 요구 사항](opt-in-requirements)에 대해 자세히 알아보세요.

### 재귀적 제네릭 타입에 대한 타입 추론 개선

Kotlin 및 Java에서는 타입 매개변수에서 자체를 참조하는 재귀적 제네릭 타입을 정의할 수 있습니다. Kotlin 1.5.30에서 Kotlin 컴파일러는 해당 타입 매개변수의 상한에만 기반하여 타입 인수를 추론할 수 있습니다(재귀적 제네릭인 경우). 이를 통해 Java에서 빌더 API를 만들기 위해 자주 사용되는 재귀적 제네릭 타입으로 다양한 패턴을 만들 수 있습니다.

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

`-Xself-upper-bound-inference` 또는 `-language-version 1.6` 컴파일러 옵션을 전달하여 개선 사항을 활성화할 수 있습니다. [이 YouTrack 티켓](https://youtrack.jetbrains.com/issue/KT-40804)에서 새로 지원되는 사용 사례의 다른 예제를 참조하세요.

### 빌더 추론 제한 제거

빌더 추론은 람다 인수의 타입 정보를 기반으로 호출의 타입 인수를 추론할 수 있는 특별한 종류의 타입 추론입니다. 이는 [`buildList()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/build-list.html) 또는 [`sequence()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.sequences/sequence.html)와 같은 제네릭 빌더 함수를 호출할 때 유용할 수 있습니다. `buildList { add("string") }`.

이러한 람다 인수 내부에는 빌더 추론이 추론하려는 타입 정보를 사용하는 데 제한이 있었습니다. 즉, 지정만 할 수 있고 가져올 수는 없습니다. 예를 들어, 명시적으로 지정된 타입 인수 없이 `buildList()`의 람다 인수 내에서 [`get()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-list/get.html)를 호출할 수 없습니다.

Kotlin 1.5.30은 `-Xunrestricted-builder-inference` 컴파일러 옵션으로 이러한 제한을 제거합니다. 이 옵션을 추가하여 제네릭 빌더 함수의 람다 인수 내에서 이전에 금지된 호출을 활성화하세요.

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

Kotlin 1.5.30에서 Kotlin/JVM은 다음과 같은 기능을 받습니다.
* [어노테이션 클래스 인스턴스화](#instantiation-of-annotation-classes)
* [향상된 nullability 어노테이션 지원 구성](#improved-nullability-annotation-support-configuration)

JVM 플랫폼에 대한 Kotlin Gradle 플러그인 업데이트는 [Gradle](#gradle) 섹션을 참조하세요.

### 어노테이션 클래스 인스턴스화

어노테이션 클래스 인스턴스화는 [실험적](components-stability)입니다. 언제든지 삭제되거나 변경될 수 있습니다.
옵트인이 필요하며(아래 세부 정보 참조), 평가 목적으로만 사용해야 합니다. [YouTrack](https://youtrack.jetbrains.com/issue/KT-45395)에서 이에 대한 피드백을 보내주시면 감사하겠습니다.

Kotlin 1.5.30을 사용하면 이제 임의의 코드에서 [어노테이션 클래스](annotations)의 생성자를 호출하여 결과 인스턴스를 얻을 수 있습니다. 이 기능은 어노테이션 인터페이스의 구현을 허용하는 Java 규칙과 동일한 사용 사례를 다룹니다.

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

이 기능을 활성화하려면 `-language-version 1.6` 컴파일러 옵션을 사용하세요. non-`val` 매개변수 또는 보조 생성자와 다른 멤버를 정의하는 제한과 같은 현재 어노테이션 클래스 제한 사항은 모두 그대로 유지됩니다.

[이 KEEP](https://github.com/Kotlin/KEEP/blob/master/proposals/annotation-instantiation)에서 어노테이션 클래스 인스턴스화에 대해 자세히 알아보세요.

### 향상된 nullability 어노테이션 지원 구성

Kotlin 컴파일러는 다양한 타입의 [nullability 어노테이션](java-interop#nullability-annotations)을 읽어 Java에서 nullability 정보를 얻을 수 있습니다. 이 정보를 통해 Java 코드를 호출할 때 Kotlin에서 nullability 불일치를 보고할 수 있습니다.

Kotlin 1.5.30에서는 특정 타입의 nullability 어노테이션의 정보를 기반으로 컴파일러가 nullability 불일치를 보고하는지 여부를 지정할 수 있습니다. 컴파일러 옵션 `-Xnullability-annotations=@<package-name>:<report-level>`을 사용하세요. 인수로 정규화된 nullability 어노테이션 패키지와 다음 보고 수준 중 하나를 지정합니다.
* nullability 불일치를 무시하려면 `ignore`
* 경고를 보고하려면 `warn`
* 오류를 보고하려면 `strict`

정규화된 패키지 이름과 함께 [지원되는 nullability 어노테이션의 전체 목록](java-interop#nullability-annotations)을 참조하세요.

다음은 새로 지원되는 [RxJava](https://github.com/ReactiveX/RxJava) 3 nullability 어노테이션에 대한 오류 보고를 활성화하는 방법을 보여주는 예제입니다. `-Xnullability-annotations=@io.reactivex.rxjava3.annotations:strict`. 이러한 모든 nullability 불일치는 기본적으로 경고입니다.

## Kotlin/Native

Kotlin/Native는 다양한 변경 사항과 개선 사항을 받았습니다.
* [Apple 실리콘 지원](#apple-silicon-support)
* [CocoaPods Gradle 플러그인에 대한 개선된 Kotlin DSL](#improved-kotlin-dsl-for-the-cocoapods-gradle-plugin)
* [Swift 5.5 async/await와의 실험적 상호 운용성](#experimental-interoperability-with-swift-5-5-async-await)
* [객체 및 companion 객체에 대한 개선된 Swift/Objective-C 매핑](#improved-swift-objective-c-mapping-for-objects-and-companion-objects)
* [MinGW 대상에 대한 가져오기 라이브러리 없이 DLL에 대한 링크 폐지](#deprecation-of-linkage-against-dlls-without-import-libraries-for-mingw-targets)

### Apple 실리콘 지원

Kotlin 1.5.30은 [Apple 실리콘](https://support.apple.com/en-us/HT211814)에 대한 네이티브 지원을 도입합니다.

이전에는 Kotlin/Native 컴파일러와 툴링은 Apple 실리콘 호스트에서 작업하기 위해 [Rosetta 변환 환경](https://developer.apple.com/documentation/apple_silicon/about_the_rosetta_translation_environment)이 필요했습니다. Kotlin 1.5.30에서는 변환 환경이 더 이상 필요하지 않습니다. 컴파일러와 툴링은 추가 작업 없이 Apple 실리콘 하드웨어에서 실행할 수 있습니다.

또한 Kotlin 코드를 Apple 실리콘에서 네이티브로 실행할 수 있도록 하는 새로운 대상을 도입했습니다.
* `macosArm64`
* `iosSimulatorArm64`
* `watchosSimulatorArm64`
* `tvosSimulatorArm64`

이러한 대상은 Intel 기반 및 Apple 실리콘 호스트 모두에서 사용할 수 있습니다. 기존의 모든 대상은 Apple 실리콘 호스트에서도 사용할 수 있습니다.

1.5.30에서는 `kotlin-multiplatform` Gradle 플러그인에서 Apple 실리콘 대상에 대한 기본 지원만 제공합니다. 특히, 새로운 시뮬레이터 대상은 `ios`, `tvos` 및 `watchos` 대상 바로 가기에 포함되지 않습니다.
새로운 대상에 대한 사용자 경험을 개선하기 위해 계속 노력할 것입니다.

### CocoaPods Gradle 플러그인에 대한 개선된 Kotlin DSL

#### Kotlin/Native 프레임워크에 대한 새로운 매개변수

Kotlin 1.5.30은 Kotlin/Native 프레임워크에 대한 개선된 CocoaPods Gradle 플러그인 DSL을 도입합니다. 프레임워크 이름 외에도 Pod 구성에서 다른 매개변수를 지정할 수 있습니다.
* 프레임워크의 동적 또는 정적 버전을 지정합니다.
* 종속성 내보내기를 명시적으로 활성화합니다.
* Bitcode 임베딩을 활성화합니다.

새로운 DSL을 사용하려면 프로젝트를 Kotlin 1.5.30으로 업데이트하고 `build.gradle(.kts)` 파일의 `cocoapods` 섹션에서 매개변수를 지정합니다.

```kotlin
cocoapods {
    frameworkName = "MyFramework" // This property is deprecated 
    // and will be removed in future versions
    // New DSL for framework configuration:
    framework {
        // All Framework properties are supported
        // Framework name configuration. Use this property instead of 
        // deprecated 'frameworkName'
        baseName = "MyFramework"
        // Dynamic framework support
        isStatic = false
        // Dependency export
        export(project(":anotherKMMModule"))
        transitiveExport = false // This is default.
        // Bitcode embedding
        embedBitcode(BITCODE)
    }
}
```

#### Xcode 구성에 대한 사용자 정의 이름 지원

Kotlin CocoaPods Gradle 플러그인은 Xcode 빌드 구성에서 사용자 정의 이름을 지원합니다. 또한 Xcode에서 빌드 구성에 대한 특수 이름(예: `Staging`)을 사용하는 경우에도 도움이 됩니다.

사용자 정의 이름을 지정하려면 `build.gradle(.kts)` 파일의 `cocoapods` 섹션에서 `xcodeConfigurationToNativeBuildType` 매개변수를 사용합니다.

```kotlin
cocoapods {
    // Maps custom Xcode configuration to NativeBuildType
    xcodeConfigurationToNativeBuildType["CUSTOM_DEBUG"] = NativeBuildType.DEBUG
    xcodeConfigurationToNativeBuildType["CUSTOM_RELEASE"] = NativeBuildType.RELEASE
}
```

이 매개변수는 Podspec 파일에 나타나지 않습니다. Xcode가 Gradle 빌드 프로세스를 실행할 때 Kotlin CocoaPods Gradle 플러그인은 필요한 네이티브 빌드 타입을 선택합니다.

`Debug` 및 `Release` 구성은 기본적으로 지원되므로 선언할 필요가 없습니다.

:::

### Swift 5.5 async/await와의 실험적 상호 운용성

:::note
Swift async/await와의 동시성 상호 운용성은 [실험적](components-stability)입니다. 언제든지 삭제되거나 변경될 수 있습니다.
평가 목적으로만 사용해야 합니다. [YouTrack](https://youtrack.jetbrains.com/issue/KT-47610)에서 이에 대한 피드백을 보내주시면 감사하겠습니다.

[Objective-C 및 Swift에서 Kotlin의 suspending 함수를 호출하는 지원을 1.4.0에 추가](whatsnew14#support-for-kotlin-s-suspending-functions-in-swift-and-objective-c)했으며, 이제 새로운 Swift 5.5 기능인 [`async` 및 `await` 수정자를 사용한 동시성](https://github.com/apple/swift-evolution/blob/main/proposals/0296-async-await)을 유지하기 위해 개선하고 있습니다.

Kotlin/Native 컴파일러는 이제 nullable 반환 타입이 있는 suspending 함수에 대해 생성된 Objective-C 헤더에서 `_Nullable_result` 속성을 내보냅니다. 이를 통해 Swift에서 적절한 nullability로 `async` 함수로 호출할 수 있습니다.

이 기능은 실험적이며 향후 Kotlin 및 Swift의 변경 사항에 영향을 받을 수 있습니다. 현재는 특정 제한 사항이 있는 이 기능의 미리 보기를 제공하고 있으며 의견을 듣고 싶습니다. 현재 상태에 대해 자세히 알아보고 [이 YouTrack 이슈](https://youtrack.jetbrains.com/issue/KT-47610)에서 피드백을 남겨주세요.

### 객체 및 companion 객체에 대한 개선된 Swift/Objective-C 매핑

이제 객체 및 companion 객체를 가져오는 것은 네이티브 iOS 개발자에게 더 직관적인 방식으로 수행할 수 있습니다. 예를 들어, Kotlin에 다음 객체가 있는 경우:

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

Swift에서 액세스하려면 `shared` 및 `companion` 속성을 사용할 수 있습니다.

```swift
MyObject.shared
MyObject.shared.x
MyClass.companion
MyClass.Companion.shared
```

[Swift/Objective-C 상호 운용성](native-objc-interop)에 대해 자세히 알아보세요.

### MinGW 대상에 대한 가져오기 라이브러리 없이 DLL에 대한 링크 폐지

[LLD](https://lld.llvm.org/)는 LLVM 프로젝트의 링커이며, 기본 ld.bfd보다 성능이 더 우수하기 때문에 Kotlin/Native에서 MinGW 대상에 사용하기 시작할 계획입니다.

그러나 LLD의 최신 안정 버전은 MinGW(Windows) 대상에 대한 DLL에 대한 직접 링크를 지원하지 않습니다. 이러한 링크에는 [가져오기 라이브러리](https://stackoverflow.com/questions/3573475/how-does-the-import-library-work-details/3573527#3573527)를 사용해야 합니다. Kotlin/Native 1.5.30에서는 필요하지 않지만 이러한 사용법은 향후 MinGW에 대한 기본 링커가 될 LLD와 호환되지 않는다는 경고를 추가하고 있습니다.

[이 YouTrack 이슈](https://youtrack.jetbrains.com/issue/KT-47605)에서 LLD 링커로의 전환에 대한 생각과 우려 사항을 공유해주세요.

## Kotlin Multiplatform

1.5.30은 Kotlin Multiplatform에 다음과 같은 주목할 만한 업데이트를 제공합니다.
* [공유 네이티브 코드에서 사용자 정의 `cinterop` 라이브러리를 사용하는 기능](#ability-to-use-custom-cinterop-libraries-in-shared-native-code)
* [XCFrameworks에 대한 지원](#support-for-xcframeworks)
* [Android 아티팩트에 대한 새로운 기본 게시 설정](#new-default-publishing-setup-for-android-artifacts)

### 공유 네이티브 코드에서 사용자 정의 cinterop 라이브러리를 사용하는 기능

Kotlin Multiplatform은 공유 소스 세트에서 플랫폼별 interop 라이브러리를 사용하는 [옵션](multiplatform-share-on-platforms#connect-platform-specific-libraries)을 제공합니다. 1.5.30 이전에는 Kotlin/Native 배포와 함께 제공되는 [플랫폼 라이브러리](native-platform-libs)에서만 작동했습니다. 1.5.30부터는 사용자 정의 `cinterop` 라이브러리와 함께 사용할 수 있습니다. 이 기능을 활성화하려면 `gradle.properties`에 `kotlin.mpp.enableCInteropCommonization=true` 속성을 추가하세요.

```none
kotlin.mpp.enableGranularSourceSetsMetadata=true
kotlin.native.enableDependencyPropagation=false
kotlin.mpp.enableCInteropCommonization=true
```

### XCFrameworks에 대한 지원

이제 모든 Kotlin Multiplatform 프로젝트는 XCFrameworks를 출력 형식으로 가질 수 있습니다. Apple은 범용(fat) 프레임워크를 대체하기 위해 XCFrameworks를 도입했습니다. XCFrameworks를 사용하면 다음을 수행할 수 있습니다.
* 모든 대상 플랫폼 및 아키텍처에 대한 로직을 단일 번들로 수집할 수 있습니다.
* 애플리케이션을 App Store에 게시하기 전에 불필요한 모든 아키텍처를 제거할 필요가 없습니다.

XCFrameworks는 Apple M1에서 장치 및 시뮬레이터에 Kotlin 프레임워크를 사용하려는 경우에 유용합니다.

XCFrameworks를 사용하려면 `build.gradle(.kts)` 스크립트를 업데이트하세요.

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

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

</TabItem>
<TabItem value="groovy" label="Groovy" default>

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

</TabItem>
</Tabs>

XCFrameworks를 선언하면 다음과 같은 새로운 Gradle 작업이 등록됩니다.
* `assembleXCFramework`
* `assembleDebugXCFramework` (추가적으로 [dSYM을 포함하는](native-ios-symbolication) 디버그 아티팩트)
* `assembleReleaseXCFramework`

[이 WWDC 비디오](https://developer.apple.com/videos/play/wwdc2019/416/)에서 XCFrameworks에 대해 자세히 알아보세요.

### Android 아티팩트에 대한 새로운 기본 게시 설정

`maven-publish` Gradle 플러그인을 사용하면 빌드 스크립트에서 [Android variant](https://developer.android.com/studio/build/build-variants) 이름을 지정하여 [Android 대상에 대해 멀티플랫폼 라이브러리를 게시](multiplatform-publish-lib#publish-an-android-library)할 수 있습니다. Kotlin Gradle 플러그인은 자동으로 게시물을 생성합니다.

1.5.30 이전에는 생성된 게시물 [메타데이터](https://docs.gradle.org/current/userguide/publishing_gradle_module_metadata.html)에 게시된 모든 Android variant에 대한 빌드 타입 속성이 포함되어 있어 라이브러리 소비자가 사용하는 동일한 빌드 타입과만 호환됩니다. Kotlin 1.5.30은 새로운 기본 게시 설정을 도입합니다.
* 프로젝트가 게시하는 모든 Android variant에 동일한 빌드 타입 속성이 있는 경우 게시된 variant에는 빌드 타입 속성이 없으며 모든 빌드 타입과 호환됩니다.
* 게시된 variant에 다른 빌드 타입 속성이 있는 경우 `release` 값이 있는 variant만 빌드 타입 속성 없이 게시됩니다. 이렇게 하면 릴리스 variant가 소비자 측의 모든 빌드 타입과 호환되는 반면 비릴리스 variant는 일치하는 소비자 빌드 타입과만 호환됩니다.

옵트아웃하고 모든 variant에 대한 빌드 타입 속성을 유지하려면 이 Gradle 속성을 설정할 수 있습니다. `kotlin.android.buildTypeAttribute.keep=true`.

## Kotlin/JS

1.5.30에서는 Kotlin/JS에 다음과 같은 두 가지 주요 개선 사항이 제공됩니다.
* [JS IR 컴파일러 백엔드가 베타에 도달](#js-ir-compiler-backend-reaches-beta)
* [Kotlin/JS IR 백엔드를 사용하는 애플리케이션에 대한 더 나은 디버깅 경험](#better-debugging-experience-for-applications-with-the-kotlin-js-ir-backend)

### JS IR 컴파일러 백엔드가 베타에 도달

Kotlin/JS에 대한 [IR 기반 컴파일러 백엔드](whatsnew14#unified-backends-and-extensibility)(1.4.0에서 [알파](components-stability)로 도입됨)가 베타에 도달했습니다.

이전에는 프로젝트를 새 백엔드로 마이그레이션하는 데 도움이 되도록 [JS IR 백엔드에 대한 마이그레이션 가이드](js-ir-migration)를 게시했습니다. 이제 IntelliJ IDEA에서 필요한 변경 사항을 직접 표시하는 [Kotlin/JS 검사 팩](https://plugins.jetbrains.com/plugin/17183-kotlin-js-inspection-pack/) IDE 플러그인을 제공하고자 합니다.

### Kotlin/JS IR 백엔드를 사용하는 애플리케이션에 대한 더 나은 디버깅 경험

Kotlin 1.5.30은 Kotlin/JS IR 백엔드에 대한 JavaScript 소스 맵 생성을 제공합니다. 이를 통해 IR 백엔드가 활성화된 경우 중단점, 단계별 실행 및 적절한 소스 참조가 있는 읽기 쉬운 스택 추적을 포함하는 전체 디버깅 지원으로 Kotlin/JS 디버깅 경험이 향상됩니다.

[브라우저 또는 IntelliJ IDEA Ultimate에서 Kotlin/JS를 디버깅](js-debugging)하는 방법을 알아보세요.

## Gradle

[Kotlin Gradle 플러그인 사용자 경험을 개선](https://youtrack.jetbrains.com/issue/KT-45778)하려는 노력의 일환으로 다음과 같은 기능을 구현했습니다.
* [Java 툴체인 지원](#support-for-java-toolchains). 여기에는 [이전 Gradle 버전에 대한 `UsesKotlinJavaToolchain` 인터페이스를 사용하여 JDK 홈을 지정하는 기능](#ability-to-specify-jdk-home-with-useskotlinjavatoolchain-interface)이 포함됩니다.
* [Kotlin 데몬의 JVM 인수를 명시적으로 지정하는 더 쉬운 방법](#easier-way-to-explicitly-specify-kotlin-daemon-jvm-arguments)

### Java 툴체인 지원

Gradle 6.7은 ["Java 툴체인 지원"](https://docs.gradle.org/current/userguide/toolchains.html) 기능을 도입했습니다.
이 기능을 사용하면 다음을 수행할 수 있습니다.
* Gradle과 다른 JDK 및 JRE를 사용하여 컴파일, 테스트 및 실행 파일을 실행합니다.
* 릴리스되지 않은 언어 버전으로 코드를 컴파일하고 테스트합니다.

툴체인 지원을 통해 Gradle은 로컬 JDK를 자동으로 감지하고 빌드에 필요한 누락된 JDK를 설치할 수 있습니다. 이제 Gradle 자체는 모든 JDK에서 실행할 수 있으며 여전히 [빌드 캐시 기능](gradle-compilation-and-caches#gradle-build-cache-support)을 재사용할 수 있습니다.

Kotlin Gradle 플러그인은 Kotlin/JVM 컴파일 작업에 대한 Java 툴체인을 지원합니다.
Java 툴체인:
* JVM 대상에 사용할 수 있는 [`jdkHome` 옵션](gradle-compiler-options#attributes-specific-to-jvm)을 설정합니다.
   [`jdkHome` 옵션을 직접 설정하는 기능은 더 이상 사용되지 않습니다](https://youtrack.jetbrains.com/issue/KT-46541).
  
  

* 사용자가 `jvmTarget` 옵션을 명시적으로 설정하지 않은 경우 툴체인의 JDK 버전에 [`kotlinOptions.jvmTarget`](gradle-compiler-options#attributes-specific-to-jvm)을 설정합니다.
  툴체인이 구성되지 않은 경우 `jvmTarget` 필드는 기본값을 사용합니다. [관련 컴파일 작업의 JVM 대상 호환성 확인](gradle-configure-project#check-for-jvm-target-compatibility-of-related-compile-tasks)에 대해 자세히 알아보세요.

* [`kapt` 작업자](kapt#run-kapt-tasks-in-parallel)가 실행 중인 JDK에 영향을 줍니다.

다음 코드를 사용하여 툴체인을 설정합니다. 자리 표시자 `<MAJOR_JDK_VERSION>`을 사용하려는 JDK 버전으로 바꿉니다.

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
kotlin {
    jvmToolchain {
        (this as JavaToolchainSpec).languageVersion.set(JavaLanguageVersion.of(<MAJOR_JDK_VERSION>)) // "8"
    }
}
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
kotlin {
    jvmToolchain {
        languageVersion.set(JavaLanguageVersion.of(<MAJOR_JDK_VERSION>)) // "8"
    }
}
```

</TabItem>
</Tabs>

`kotlin` 확장을