---
title: "Kotlin 1.5.30 的新特性"
---
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

_[已發布：2021 年 8 月 24 日](releases#release-details)_

Kotlin 1.5.30 提供了語言更新，包括未來變更的預覽、平台支援和工具的各種改進，以及新的標準函式庫函式。

以下是一些主要的改進：
* 語言特性，包括實驗性的 sealed `when` 陳述式、opt-in requirement 使用方式的變更等等
* 對 Apple silicon 的原生支援
* Kotlin/JS IR 後端達到 Beta 階段
* 改進的 Gradle 外掛程式體驗

您也可以在[發布部落格文章](https://blog.jetbrains.com/kotlin/2021/08/kotlin-1-5-30-released/)和此影片中找到變更的簡短概述：

<video src="https://www.youtube.com/v/rNbb3A9IdOo" title="Kotlin 1.5.30"/>

## 語言特性

Kotlin 1.5.30 呈現了未來語言變更的預覽，並改進了 opt-in requirement 機制和類型推斷：
* [針對 sealed 和 Boolean subjects 的 Exhaustive when 陳述式](#exhaustive-when-statements-for-sealed-and-boolean-subjects)
* [將 suspending 函式作為 supertypes](#suspending-functions-as-supertypes)
* [在實驗性 API 的隱式使用上要求 opt-in](#requiring-opt-in-on-implicit-usages-of-experimental-apis)
* [使用具有不同 targets 的 opt-in requirement annotations 的變更](#changes-to-using-opt-in-requirement-annotations-with-different-targets)
* [改進遞迴泛型類型的類型推斷](#improvements-to-type-inference-for-recursive-generic-types)
* [消除 builder inference 限制](#eliminating-builder-inference-restrictions)

### 針對 sealed 和 Boolean subjects 的 Exhaustive when 陳述式

:::note
對 sealed (exhaustive) when 陳述式的支援是[實驗性的](components-stability)。它可能會隨時被移除或變更。
需要選擇加入（opt-in）（請參閱以下詳細資訊），您應該僅將其用於評估目的。我們將感謝您在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-12380) 中提供有關它的意見反應。

_Exhaustive_ [`when`](control-flow#when-expressions-and-statements) 陳述式包含針對其 subject 的所有可能類型或值，或針對某些類型並包含 `else` 分支以涵蓋任何剩餘情況的分支。

我們計劃很快禁止 non-exhaustive `when` 陳述式，以使行為與 `when` 運算式一致。為了確保順利遷移，您可以設定編譯器以報告有關具有 sealed 類別或 Boolean 的 non-exhaustive `when` 陳述式的警告。此類警告預設會在 Kotlin 1.6 中顯示，並稍後會變成錯誤。

Enums 已經收到警告。

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

若要在 Kotlin 1.5.30 中啟用此功能，請使用語言版本 `1.6`。您也可以透過啟用 [progressive mode](whatsnew13#progressive-mode) 將警告變更為錯誤。

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

### 將 suspending 函式作為 supertypes

:::note
對將 suspending 函式作為 supertypes 的支援是[實驗性的](components-stability)。它可能會隨時被移除或變更。
需要選擇加入（opt-in）（請參閱以下詳細資訊），您應該僅將其用於評估目的。我們將感謝您在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-18707) 中提供有關它的意見反應。

Kotlin 1.5.30 提供了使用 `suspend` 函數類型作為具有一些限制的 supertype 的預覽。

```kotlin
class MyClass: suspend () `->` Unit {
    override suspend fun invoke() { TODO() }
}
```

使用 `-language-version 1.6` 編譯器選項來啟用此功能：

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

此功能具有以下限制：
* 您不能將 ordinary 函數類型和 `suspend` 函數類型混合作為 supertype。這是因為 JVM 後端中 `suspend` 函數類型的實作詳細資訊。它們在其中表示為具有標記介面的 ordinary 函數類型。由於標記介面，因此無法判斷哪些 superinterface 是 suspended 的，哪些是 ordinary 的。
* 您不能使用多個 `suspend` 函數 supertypes。如果存在類型檢查，您也不能使用多個 ordinary 函數 supertypes。

### 在實驗性 API 的隱式使用上要求 opt-in

opt-in requirement 機制是[實驗性的](components-stability)。
它可能會隨時變更。[請參閱如何 opt-in](opt-in-requirements)。
僅將其用於評估目的。我們將感謝您在 [YouTrack](https://youtrack.jetbrains.com/issues/KT) 中提供有關它的意見反應。

library 的作者可以將實驗性 API 標記為[需要 opt-in](opt-in-requirements#create-opt-in-requirement-annotations)，以告知使用者其實驗性狀態。當使用 API 時，編譯器會引發警告或錯誤，並且需要[明確同意](opt-in-requirements#opt-in-to-api)才能取消顯示。

在 Kotlin 1.5.30 中，編譯器會將簽章中具有實驗性類型的任何宣告視為實驗性的。也就是說，即使是實驗性 API 的隱式使用，也需要 opt-in。例如，如果函數的傳回類型標記為實驗性 API 元素，即使宣告未明確標記為需要 opt-in，使用該函數也需要您 opt-in。

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

深入瞭解 [opt-in requirements](opt-in-requirements)。

### 使用具有不同 targets 的 opt-in requirement annotations 的變更

opt-in requirement 機制是[實驗性的](components-stability)。
它可能會隨時變更。[請參閱如何 opt-in](opt-in-requirements)。
僅將其用於評估目的。我們將感謝您在 [YouTrack](https://youtrack.jetbrains.com/issues/KT) 中提供有關它的意見反應。

Kotlin 1.5.30 提出了在不同 [targets](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.annotation/-target/) 上使用和宣告 opt-in requirement annotations 的新規則。編譯器現在會報告在編譯時難以處理的使用案例的錯誤。在 Kotlin 1.5.30 中：
* 禁止在使用位置使用 opt-in requirement annotations 標記 local 變數和 value 參數。
* 只有在其基本宣告也被標記時，才允許標記 override。
* 禁止標記 backing fields 和 getters。您可以改為標記基本屬性。
* 禁止在 opt-in requirement annotation 宣告位置設定 `TYPE` 和 `TYPE_PARAMETER` annotation targets。

深入瞭解 [opt-in requirements](opt-in-requirements)。

### 改進遞迴泛型類型的類型推斷

在 Kotlin 和 Java 中，您可以定義一個遞迴泛型類型，該類型在其類型參數中引用自身。在 Kotlin 1.5.30 中，如果 Kotlin 編譯器是遞迴泛型，則可以僅根據相應類型參數的 upper bounds 推斷類型引數。這使得可以使用 Java 中經常使用的各種遞迴泛型類型模式來建立 builder API。

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

您可以透過傳遞 `-Xself-upper-bound-inference` 或 `-language-version 1.6` 編譯器選項來啟用改進。請參閱 [此 YouTrack ticket](https://youtrack.jetbrains.com/issue/KT-40804) 中新支援的使用案例的其他範例。

### 消除 builder inference 限制

Builder inference 是一種特殊的類型推斷，可讓您根據來自其 lambda 引數內其他呼叫的類型資訊來推斷呼叫的類型引數。當呼叫泛型 builder 函數（例如 [`buildList()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/build-list.html) 或 [`sequence()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.sequences/sequence.html)）時，這非常有用：`buildList { add("string") }`。

在此類 lambda 引數內，先前對使用 builder inference 嘗試推斷的類型資訊存在限制。這表示您只能指定它而無法取得它。例如，您無法在沒有明確指定類型引數的情況下，在 `buildList()` 的 lambda 引數內呼叫 [`get()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-list/get.html)。

Kotlin 1.5.30 使用 `-Xunrestricted-builder-inference` 編譯器選項解除了這些限制。新增此選項以啟用先前禁止的在泛型 builder 函數的 lambda 引數內的呼叫：

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

此外，您可以使用 `-language-version 1.6` 編譯器選項啟用此功能。

## Kotlin/JVM

透過 Kotlin 1.5.30，Kotlin/JVM 收到以下功能：
* [Annotation 類別的Instantiation](#instantiation-of-annotation-classes)
* [改進的 nullability annotation 支援設定](#improved-nullability-annotation-support-configuration)

請參閱 [Gradle](#gradle) 章節，瞭解有關 JVM 平台上 Kotlin Gradle 外掛程式更新的資訊。

### Annotation 類別的Instantiation

Annotation 類別的 Instantiation 是[實驗性的](components-stability)。它可能會隨時被移除或變更。
需要選擇加入（opt-in）（請參閱以下詳細資訊），您應該僅將其用於評估目的。我們將感謝您在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-45395) 中提供有關它的意見反應。

使用 Kotlin 1.5.30，您現在可以在任意程式碼中呼叫 [annotation 類別](annotations)的建構函式，以取得產生的執行個體。此功能涵蓋與 Java 慣例相同的使用案例，該慣例允許實作 annotation 介面。

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

使用 `-language-version 1.6` 編譯器選項來啟用此功能。請注意，所有目前的 annotation 類別限制（例如限制定義非 `val` 參數或與 secondary 建構函式不同的成員）都保持不變。

深入瞭解 [此 KEEP](https://github.com/Kotlin/KEEP/blob/master/proposals/annotation-instantiation) 中 annotation 類別的 instantiation

### 改進的 nullability annotation 支援設定

Kotlin 編譯器可以讀取各種 [nullability annotations](java-interop#nullability-annotations) 類型，以從 Java 取得 nullability 資訊。此資訊允許它在呼叫 Java 程式碼時報告 Kotlin 中的 nullability 不符。

在 Kotlin 1.5.30 中，您可以指定編譯器是否根據來自特定類型的 nullability annotations 的資訊報告 nullability 不符。只需使用編譯器選項 `-Xnullability-annotations=@<package-name>:<report-level>`。在引數中，指定完全限定的 nullability annotations 套件和以下其中一個 report level：
* `ignore` 以忽略 nullability 不符
* `warn` 以報告警告
* `strict` 以報告錯誤。

請參閱 [支援的 nullability annotations 的完整清單](java-interop#nullability-annotations) 及其完全限定的套件名稱。

以下範例顯示如何啟用對新支援的 [RxJava](https://github.com/ReactiveX/RxJava) 3 nullability annotations 的錯誤報告：`-Xnullability-annotations=@io.reactivex.rxjava3.annotations:strict`。請注意，預設情況下，所有此類 nullability 不符都是警告。

## Kotlin/Native

Kotlin/Native 已收到各種變更和改進：
* [Apple silicon 支援](#apple-silicon-support)
* [改進 CocoaPods Gradle 外掛程式的 Kotlin DSL](#improved-kotlin-dsl-for-the-cocoapods-gradle-plugin)
* [與 Swift 5.5 async/await 的實驗性互通性](#experimental-interoperability-with-swift-5-5-async-await)
* [改進 objects 和 companion objects 的 Swift/Objective-C mapping](#improved-swift-objective-c-mapping-for-objects-and-companion-objects)
* [棄用針對 MinGW targets 的沒有匯入 library 的 DLL 連結](#deprecation-of-linkage-against-dlls-without-import-libraries-for-mingw-targets)

### Apple silicon 支援

Kotlin 1.5.30 引入了對 [Apple silicon](https://support.apple.com/en-us/HT211814) 的原生支援。

先前，Kotlin/Native 編譯器和工具需要 [Rosetta 翻譯環境](https://developer.apple.com/documentation/apple-silicon/about-the-rosetta-translation-environment)才能在 Apple silicon hosts 上工作。在 Kotlin 1.5.30 中，不再需要翻譯環境 – 編譯器和工具可以在 Apple silicon 硬體上執行，而無需任何其他動作。

我們也引入了新的 targets，使 Kotlin 程式碼可以在 Apple silicon 上原生執行：
* `macosArm64`
* `iosSimulatorArm64`
* `watchosSimulatorArm64`
* `tvosSimulatorArm64`

它們在 Intel-based 和 Apple silicon hosts 上都可用。所有現有 targets 也都在 Apple silicon hosts 上可用。

請注意，在 1.5.30 中，我們僅在 `kotlin-multiplatform` Gradle 外掛程式中提供對 Apple silicon targets 的基本支援。特別是，新的模擬器 targets 未包含在 `ios`、`tvos` 和 `watchos` target 快捷方式中。
我們將繼續努力改善新 targets 的使用者體驗。

### 改進 CocoaPods Gradle 外掛程式的 Kotlin DSL

#### Kotlin/Native frameworks 的新參數

Kotlin 1.5.30 引入了針對 Kotlin/Native frameworks 的改進 CocoaPods Gradle 外掛程式 DSL。除了 framework 的名稱之外，您還可以在 Pod 設定中指定其他參數：
* 指定 framework 的 dynamic 或 static 版本
* 明確啟用 export dependencies
* 啟用 Bitcode embedding

若要使用新的 DSL，請將您的專案更新到 Kotlin 1.5.30，並在 `build.gradle(.kts)` 檔案的 `cocoapods` 區段中指定參數：

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

#### 支援 Xcode configuration 的自訂名稱

Kotlin CocoaPods Gradle 外掛程式支援 Xcode build configuration 中的自訂名稱。如果您在 Xcode 中對 build configuration 使用特殊名稱（例如 `Staging`），它也會對您有所幫助。

若要指定自訂名稱，請在 `build.gradle(.kts)` 檔案的 `cocoapods` 區段中使用 `xcodeConfigurationToNativeBuildType` 參數：

```kotlin
cocoapods {
    // Maps custom Xcode configuration to NativeBuildType
    xcodeConfigurationToNativeBuildType["CUSTOM_DEBUG"] = NativeBuildType.DEBUG
    xcodeConfigurationToNativeBuildType["CUSTOM_RELEASE"] = NativeBuildType.RELEASE
}
```

此參數不會顯示在 Podspec 檔案中。當 Xcode 執行 Gradle build 流程時，Kotlin CocoaPods Gradle 外掛程式會選取必要的 native build type。

無需宣告 `Debug` 和 `Release` configurations，因為預設情況下支援它們。

:::

### 與 Swift 5.5 async/await 的實驗性互通性

:::note
與 Swift async/await 的 Concurrency 互通性是[實驗性的](components-stability)。它可能會隨時被移除或變更。
您應該僅將其用於評估目的。我們將感謝您在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-47610) 中提供有關它的意見反應。

我們在 [1.4.0 中新增了從 Objective-C 和 Swift 呼叫 Kotlin 的 suspending 函式的支援](whatsnew14#support-for-kotlin-s-suspending-functions-in-swift-and-objective-c)，現在我們正在改進它，以跟上新的 Swift 5.5 功能 – [具有 `async` 和 `await` 修飾詞的 concurrency](https://github.com/apple/swift-evolution/blob/main/proposals/0296-async-await)。

Kotlin/Native 編譯器現在會在產生的 Objective-C 標頭中發出 `_Nullable_result` 屬性，以用於具有 nullable 傳回類型的 suspending 函式。這使得可以從 Swift 將它們呼叫為具有適當 nullability 的 `async` 函式。

請注意，此功能是實驗性的，並且未來可能會受到 Kotlin 和 Swift 中變更的影響。目前，我們提供具有某些限制的此功能的預覽，並且我們渴望聽到您的想法。深入瞭解其目前狀態，並在 [此 YouTrack issue](https://youtrack.jetbrains.com/issue/KT-47610) 中留下您的意見反應。

### 改進 objects 和 companion objects 的 Swift/Objective-C mapping

現在，可以採用對 native iOS 開發人員更直觀的方式來取得 objects 和 companion objects。例如，如果您在 Kotlin 中有以下 objects：

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

若要在 Swift 中存取它們，您可以使用 `shared` 和 `companion` 屬性：

```swift
MyObject.shared
MyObject.shared.x
MyClass.companion
MyClass.Companion.shared
```

深入瞭解 [Swift/Objective-C 互通性](native-objc-interop)。

### 棄用針對 MinGW targets 的沒有匯入 library 的 DLL 連結

[LLD](https://lld.llvm.org/) 是 LLVM 專案中的 linker，我們計劃開始在 Kotlin/Native 中將其用於 MinGW targets，因為它比預設 ld.bfd 具有優勢 – 主要是其更好的效能。

但是，LLD 的最新穩定版本不支援針對 MinGW (Windows) targets 的 DLL 直接連結。此類連結需要使用 [匯入 library](https://stackoverflow.com/questions/3573475/how-does-the-import-library-work-details/3573527#3573527)。雖然 Kotlin/Native 1.5.30 不需要它們，但我們新增了一個警告，以通知您此類使用與 LLD 不相容，LLD 將來會成為 MinGW 的預設 linker。

請在 [此 YouTrack issue](https://youtrack.jetbrains.com/issue/KT-47605) 中分享您對轉換到 LLD linker 的想法和疑慮。

## Kotlin Multiplatform

1.5.30 為 Kotlin Multiplatform 帶來了以下值得注意的更新：
* [能夠在共用 native 程式碼中使用自訂 `cinterop` library](#ability-to-use-custom-cinterop-libraries-in-shared-native-code)
* [支援 XCFrameworks](#support-for-xcframeworks)
* [Android artifacts 的新預設發布設定](#new-default-publishing-setup-for-android-artifacts)

### 能夠在共用 native 程式碼中使用自訂 cinterop libraries

Kotlin Multiplatform 為您提供一個[選項](multiplatform-share-on-platforms#connect-platform-specific-libraries)，以在共用 source sets 中使用 platform-dependent interop libraries。在 1.5.30 之前，這僅適用於 Kotlin/Native 發佈中隨附的 [platform libraries](native-platform-libs)。從 1.5.30 開始，您可以將其與您的自訂 `cinterop` libraries 搭配使用。若要啟用此功能，請在您的 `gradle.properties` 中新增 `kotlin.mpp.enableCInteropCommonization=true` 屬性：

```none
kotlin.mpp.enableGranularSourceSetsMetadata=true
kotlin.native.enableDependencyPropagation=false
kotlin.mpp.enableCInteropCommonization=true
```

### 支援 XCFrameworks

現在，所有 Kotlin Multiplatform 專案都可以將 XCFrameworks 作為輸出格式。Apple 引入了 XCFrameworks 作為 universal (fat) frameworks 的替代方案。借助 XCFrameworks，您可以：
* 在單個 bundle 中收集所有目標平台和架構的邏輯。
* 無需在將應用程式發佈到 App Store 之前移除所有不必要的架構。

如果您想在 Apple M1 上為裝置和模擬器使用 Kotlin framework，XCFrameworks 非常有用。

若要使用 XCFrameworks，請更新您的 `build.gradle(.kts)` 指令碼：

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

當您宣告 XCFrameworks 時，將會註冊這些新的 Gradle tasks：
* `assembleXCFramework`
* `assembleDebugXCFramework` （另外包含 [dSYMs 的 debug artifact](native-ios-symbolication)）
* `assembleReleaseXCFramework`

深入瞭解 [此 WWDC 影片](https://developer.apple.com/videos/play/wwdc2019/416/) 中的 XCFrameworks。

### Android artifacts 的新預設發布設定

使用 `maven-publish` Gradle 外掛程式，您可以透過在 build 指令碼中指定 [Android variant](https://developer.android.com/studio/build/build-variants) 名稱，[發布 Android target 的 multiplatform library](multiplatform-publish-lib#publish-an-android-library)。Kotlin Gradle 外掛程式將自動產生發佈。

在 1.5.30 之前，產生的發佈[metadata](https://docs.gradle.org/current/userguide/publishing_gradle_module_metadata.html) 包含每個發佈的 Android variant 的 build type 屬性，使其僅與 library consumer 使用的相同 build type 相容。Kotlin 1.5.30 引入了新的預設發布設定：
* 如果專案發佈的所有 Android variants 都具有相同的 build type 屬性，則發佈的 variants 將沒有 build type 屬性，並且將與任何 build type 相容。
* 如果發佈的 variants 具有不同的 build type 屬性，則只有具有 `release` 值的 variants 將在沒有 build type 屬性的情況下發佈。這使得 release variants 與 consumer 端的任何 build type 相容，而 non-release variants 僅與符合的 consumer build types 相容。

若要退出並保留所有 variants 的 build type 屬性，您可以設定此 Gradle 屬性：`kotlin.android.buildTypeAttribute.keep=true`。

## Kotlin/JS

1.5.30 為 Kotlin/JS 帶來了兩項主要改進：
* [JS IR 編譯器後端達到 Beta 階段](#js-ir-compiler-backend-reaches-beta)
* [具有 Kotlin/JS IR 後端的應用程式的更好 debugging 體驗](#better-debugging-experience-for-applications-with-the-kotlin-js-ir-backend)

### JS IR 編譯器後端達到 Beta 階段

基於 [IR 的編譯器後端](whatsnew14#unified-backends-and-extensibility) 用於 Kotlin/JS，該後端在 [Alpha](components-stability) 中的 1.4.0 中引入，已達到 Beta 階段。

先前，我們發佈了 [JS IR 後端的遷移指南](js-ir-migration)，以協助您將專案遷移到新的後端。現在，我們想介紹 [Kotlin/JS Inspection Pack](https://plugins.jetbrains.com/plugin/17183-kotlin-js-inspection-pack/) IDE 外掛程式，該外掛程式直接在 IntelliJ IDEA 中顯示所需的變更。

### 具有 Kotlin/JS IR 後端的應用程式的更好 debugging 體驗

Kotlin 1.5.30 為 Kotlin/JS IR 後端帶來了 JavaScript 原始碼地圖產生。當啟用 IR 後端時，這將改善 Kotlin/JS debugging 體驗，並提供完整的 debugging 支援，包括中斷點、stepping 和具有適當原始碼參考的可讀堆疊追蹤。

瞭解如何在 [瀏覽器或 IntelliJ IDEA Ultimate 中 debug Kotlin/JS](js-debugging)。

## Gradle

作為我們 [改善 Kotlin Gradle 外掛程式使用者體驗](https://youtrack.jetbrains.com/issue/KT-45778) 的任務的一部分，我們實作了以下功能：
* [支援 Java toolchains](#support-for-java-toolchains)，其中包括 [能夠為較舊的 Gradle 版本使用 `UsesKotlinJavaToolchain` 介面指定 JDK home](#ability-to-specify-jdk-home-with-useskotlinjavatoolchain-interface)
* [一種更簡單的方式來明確指定 Kotlin daemon 的 JVM 引數](#easier-way-to-explicitly-specify-kotlin-daemon-jvm-arguments)

### 支援 Java toolchains

Gradle 6.7 引入了 ["Java toolchains support"](https://docs.gradle.org/current/userguide/toolchains.html) 功能。
使用此功能，您可以：
* 使用與 Gradle 不同的 JDKs 和 JREs 執行編譯、測試和可執行檔。
* 使用未發佈的語言版本編譯和測試程式碼。

借助 toolchains 支援，Gradle 可以自動偵測 local JDKs，並安裝 Gradle build 所需的遺失 JDKs。現在，Gradle 本身可以在任何 JDK 上執行，並且仍然可以重複使用 [build cache 功能](gradle-compilation-and-caches#gradle-build-cache-support)。

Kotlin Gradle 外掛程式支援 Kotlin/JVM 編譯 tasks 的 Java toolchains。
Java toolchain：
* 設定可用於 JVM targets 的 [`jdkHome` 選項](gradle-compiler-options#attributes-specific-to-jvm)。
   [直接設定 `jdkHome` 選項的功能已棄用](https://youtrack.jetbrains.com/issue/KT-46541)。
  
  

* 如果使用者未明確設定 `jvmTarget` 選項，則將 [`kotlinOptions.jvmTarget`](gradle-compiler-options#attributes-specific-to-jvm) 設定為 toolchain 的 JDK 版本。
  如果未設定 toolchain，則 `jvmTarget` 欄位會使用預設值。深入瞭解 [JVM target 相容性](gradle-configure-project#check-for-jvm-target-compatibility-of-related-compile-tasks)。

* 影響 [`kapt` workers](kapt#run-kapt-tasks-in-parallel) 在其上執行的 JDK。

使用以下程式碼來設定 toolchain。將預留位置 `<MAJOR_JDK_VERSION>` 替換為您想要使用的 JDK 版本：

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

請注意，透過 `kotlin` 擴充功能設定 toolchain 也會更新 Java 編譯 tasks 的 toolchain。

您可以透過 `java` 擴充功能設定 toolchain，並且 Kotlin 編譯 tasks 將會使用它：

```kotlin
java {
    toolchain {
        languageVersion.set(JavaLanguageVersion.of(<MAJOR_JDK_VERSION>)) // "8"
    }
}
```

如需有關為 `KotlinCompile` tasks 設定任何 JDK 版本的資訊，請檢閱有關 [使用 Task DSL 設定 JDK 版本](gradle-configure-project#set-jdk-version-with-the-task-dsl) 的文件。

對於 Gradle 版本 6.1 到 6.6，[請使用 `UsesKotlinJavaToolchain` 介面來設定 JDK home](#ability-to-specify-jdk-home-with-useskotlinjavatoolchain-interface)。

### 能夠使用 UsesKotlinJavaToolchain 介面指定 JDK home

現在，所有支援透過 [`kotlinOptions`](gradle-compiler-options) 設定 JDK 的 Kotlin tasks 都實作 `UsesKotlinJavaToolchain` 介面。若要設定 JDK home，請放置 JDK 的路徑並替換 `<JDK_VERSION>` 預留位置：

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

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

</TabItem>
<TabItem value="groovy" label="Groovy" default>

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

</TabItem>
</Tabs>

對於 Gradle 版本 6.1 到 6.6，請使用 `UsesKotlinJavaToolchain` 介面。從 Gradle 6.7 開始，請改為使用 [Java toolchains](#support-for-