[//]: # (title: Kotlin 1.5.30 的新功能)

[發佈日期：2021 年 8 月 24 日](releases.md#release-details)

Kotlin 1.5.30 提供了語言更新，包括未來變更的預覽、平台支援和工具的各項改進，以及新的標準函式庫函數。

以下是一些主要改進：
* 語言功能，包括實驗性的 `sealed when` 語句、使用選擇性加入要求的變更等等
* 對 Apple 晶片的原生支援
* Kotlin/JS IR 後端進入 Beta 階段
* 改進的 Gradle 插件體驗

您也可以在[發佈部落格文章](https://blog.jetbrains.com/kotlin/2021/08/kotlin-1-5-30-released/)和這部影片中找到變更的簡要概述：

<video src="https://www.youtube.com/v/rNbb3A9IdOo" title="Kotlin 1.5.30"/>

## 語言功能

Kotlin 1.5.30 呈現了未來語言變更的預覽，並改進了選擇性加入要求機制和型別推斷：
* [針對 `sealed` 類別和布林主體的詳盡 `when` 語句](#exhaustive-when-statements-for-sealed-and-boolean-subjects)
* [暫停函式作為超型別](#suspending-functions-as-supertypes)
* [要求對實驗性 API 的隱式使用進行選擇性加入](#requiring-opt-in-on-implicit-usages-of-experimental-apis)
* [針對不同目標使用選擇性加入要求註解的變更](#changes-to-using-opt-in-requirement-annotations-with-different-targets)
* [遞迴泛型型別的型別推斷改進](#improvements-to-type-inference-for-recursive-generic-types)
* [消除建構器推斷限制](#eliminating-builder-inference-restrictions)

### 針對 `sealed` 類別和布林主體的詳盡 `when` 語句

> 對於 `sealed`（詳盡）`when` 語句的支援是[實驗性](components-stability.md)的。它可能會隨時被移除或變更。
> 需要選擇性加入（詳情請見下文），您應僅用於評估目的。我們非常感謝您在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-12380) 上提供回饋。
>
{style="warning"}

一個「詳盡的」 [`when`](control-flow.md#when-expressions-and-statements) 語句包含其主體所有可能型別或值的分支，或者針對特定型別並包含一個 `else` 分支以涵蓋任何其餘情況。

我們計劃很快禁止非詳盡的 `when` 語句，以使行為與 `when` 表達式保持一致。為了確保平穩遷移，您可以配置編譯器，使其在遇到帶有 `sealed` 類別或布林的非詳盡 `when` 語句時報告警告。此類警告將在 Kotlin 1.6 中預設出現，並將在稍後成為錯誤。

> 列舉 (Enums) 已會收到警告。
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

要在 Kotlin 1.5.30 中啟用此功能，請使用語言版本 `1.6`。您也可以透過啟用[漸進模式](whatsnew13.md#progressive-mode)將警告變更為錯誤。

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

### 暫停函式作為超型別

> 對於暫停函式作為超型別的支援是[實驗性](components-stability.md)的。它可能會隨時被移除或變更。
> 需要選擇性加入（詳情請見下文），您應僅用於評估目的。我們非常感謝您在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-18707) 上提供回饋。
>
{style="warning"}

Kotlin 1.5.30 提供了在某些限制下將 `suspend` 函式型別用作超型別的預覽功能。

```kotlin
class MyClass: suspend () -> Unit {
    override suspend fun invoke() { TODO() }
}
```

使用 `-language-version 1.6` 編譯器選項來啟用該功能：

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

該功能有以下限制：
* 您不能將普通的函式型別和 `suspend` 函式型別混合作為超型別。這是由於 JVM 後端中 `suspend` 函式型別的實作細節所致。它們在其中被表示為帶有標記介面的普通函式型別。由於標記介面，無法區分哪些超介面是 `suspend` 的，哪些是普通的。
* 您不能使用多個 `suspend` 函式超型別。如果存在型別檢查，您也不能使用多個普通的函式超型別。

### 要求對實驗性 API 的隱式使用進行選擇性加入

> 選擇性加入要求機制是[實驗性](components-stability.md)的。
> 它可能會隨時變更。 [了解如何選擇性加入](opt-in-requirements.md)。
> 僅用於評估目的。我們非常感謝您在 [YouTrack](https://youtrack.jetbrains.com/issues/KT) 上提供回饋。
>
{style="warning"}

函式庫的作者可以將實驗性 API 標記為[需要選擇性加入](opt-in-requirements.md#create-opt-in-requirement-annotations)，以告知使用者其實驗性狀態。當使用該 API 時，編譯器會發出警告或錯誤，並要求[明確同意](opt-in-requirements.md#opt-in-to-api)以抑制它。

在 Kotlin 1.5.30 中，編譯器將簽章中包含實驗性型別的任何聲明視為實驗性。也就是說，即使聲明未明確標記為需要選擇性加入，它也要求對實驗性 API 的隱式使用進行選擇性加入。例如，如果函式的回傳型別被標記為實驗性 API 元素，則該函式的使用需要您選擇性加入。

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

了解更多關於[選擇性加入要求](opt-in-requirements.md)的資訊。

### 針對不同目標使用選擇性加入要求註解的變更

> 選擇性加入要求機制是[實驗性](components-stability.md)的。
> 它可能會隨時變更。 [了解如何選擇性加入](opt-in-requirements.md)。
> 僅用於評估目的。我們非常感謝您在 [YouTrack](https://youtrack.jetbrains.com/issues/KT) 上提供回饋。
>
{style="warning"}

Kotlin 1.5.30 針對在不同[目標](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.annotation/-target/)上使用和聲明選擇性加入要求註解，引入了新的規則。編譯器現在會針對在編譯時難以處理的使用案例報告錯誤。在 Kotlin 1.5.30 中：
* 禁止在使用點標記局部變數和值參數與選擇性加入要求註解。
* 只有當其基本聲明也被標記時，才允許標記覆寫。
* 禁止標記支援欄位和 getter。您可以改為標記基本屬性。
* 禁止在選擇性加入要求註解聲明點設定 `TYPE` 和 `TYPE_PARAMETER` 註解目標。

了解更多關於[選擇性加入要求](opt-in-requirements.md)的資訊。

### 遞迴泛型型別的型別推斷改進

在 Kotlin 和 Java 中，您可以定義一個遞迴泛型型別，該型別在其型別參數中引用自身。在 Kotlin 1.5.30 中，Kotlin 編譯器可以僅根據相應型別參數的上限來推斷型別引數，如果它是遞迴泛型型別。這使得創建各種遞迴泛型型別的模式成為可能，這些模式在 Java 中常用於建構器 API。

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

您可以透過傳遞 `-Xself-upper-bound-inference` 或 `-language-version 1.6` 編譯器選項來啟用這些改進。請參閱 [此 YouTrack 議題](https://youtrack.jetbrains.com/issue/KT-40804) 中新支援使用案例的其他範例。

### 消除建構器推斷限制

建構器推斷是一種特殊型別的型別推斷，它允許您根據其 Lambda 引數內其他呼叫的型別資訊來推斷呼叫的型別引數。這在呼叫泛型建構器函式（例如 [`buildList()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/build-list.html) 或 [`sequence()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.sequences/sequence.html)）時非常有用：`buildList { add("string") }`。

在此類 Lambda 引數內部，先前對使用建構器推斷嘗試推斷的型別資訊存在限制。這意味著您只能指定它而不能取得它。例如，您不能在 `buildList()` 的 Lambda 引數內部呼叫 [`get()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-list/get.html) 而不明確指定型別引數。

Kotlin 1.5.30 透過 `-Xunrestricted-builder-inference` 編譯器選項移除了這些限制。添加此選項以啟用先前禁止在泛型建構器函式的 Lambda 引數內部進行的呼叫：

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

此外，您也可以使用 `-language-version 1.6` 編譯器選項啟用此功能。

## Kotlin/JVM

透過 Kotlin 1.5.30，Kotlin/JVM 獲得了以下功能：
* [註解類別的實例化](#instantiation-of-annotation-classes)
* [改進的空值性註解支援配置](#improved-nullability-annotation-support-configuration)

有關 JVM 平台上 Kotlin Gradle 插件更新的資訊，請參閱 [Gradle](#gradle) 部分。

### 註解類別的實例化

> 註解類別的實例化是[實驗性](components-stability.md)的。它可能會隨時被移除或變更。
> 需要選擇性加入（詳情請見下文），您應僅用於評估目的。我們非常感謝您在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-45395) 上提供回饋。
>
{style="warning"}

透過 Kotlin 1.5.30，您現在可以在任意程式碼中呼叫[註解類別](annotations.md)的建構函式以取得結果實例。此功能涵蓋了與 Java 慣例相同的用例，該慣例允許實作註解介面。

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

使用 `-language-version 1.6` 編譯器選項來啟用此功能。請注意，所有目前的註解類別限制，例如定義非 `val` 參數或與次級建構函式不同的成員的限制，仍然保持不變。

在[此 KEEP](https://github.com/Kotlin/KEEP/blob/master/proposals/annotation-instantiation.md) 中了解更多關於註解類別實例化的資訊。

### 改進的空值性註解支援配置

Kotlin 編譯器可以讀取各種型別的[空值性註解](java-interop.md#nullability-annotations)以從 Java 取得空值性資訊。此資訊允許它在呼叫 Java 程式碼時報告 Kotlin 中的空值性不匹配。

在 Kotlin 1.5.30 中，您可以指定編譯器是否根據來自特定型別的空值性註解的資訊報告空值性不匹配。只需使用編譯器選項 `-Xnullability-annotations=@<package-name>:<report-level>`。在引數中，指定完全合格的空值性註解套件以及以下報告級別之一：
* `ignore` 以忽略空值性不匹配
* `warn` 以報告警告
* `strict` 以報告錯誤。

請參閱[支援的空值性註解的完整列表](java-interop.md#nullability-annotations)及其完全合格的套件名稱。

以下是一個範例，展示如何為新支援的 [RxJava](https://github.com/ReactiveX/RxJava) 3 空值性註解啟用錯誤報告：`-Xnullability-annotations=@io.reactivex.rxjava3.annotations:strict`。請注意，所有此類空值性不匹配預設為警告。

## Kotlin/Native

Kotlin/Native 獲得了各種變更和改進：
* [Apple 晶片支援](#apple-silicon-support)
* [改進的 CocoaPods Gradle 插件的 Kotlin DSL](#improved-kotlin-dsl-for-the-cocoapods-gradle-plugin)
* [與 Swift 5.5 `async/await` 的實驗性互通性](#experimental-interoperability-with-swift-5-5-async-await)
* [改進的 Swift/Objective-C 物件和伴隨物件映射](#improved-swift-objective-c-mapping-for-objects-and-companion-objects)
* [針對 MinGW 目標棄用不含匯入函式庫的 DLL 連結](#deprecation-of-linkage-against-dlls-without-import-libraries-for-mingw-targets)

### Apple 晶片支援

Kotlin 1.5.30 引入了對 [Apple 晶片](https://support.apple.com/en-us/HT211814)的原生支援。

先前，Kotlin/Native 編譯器和工具需要在 Apple 晶片主機上工作時的 [Rosetta 轉譯環境](https://developer.apple.com/documentation/apple-silicon/about-the-rosetta-translation-environment)。在 Kotlin 1.5.30 中，不再需要轉譯環境 – 編譯器和工具可以在 Apple 晶片硬體上執行，無需任何額外操作。

我們還引入了新的目標，使 Kotlin 程式碼在 Apple 晶片上原生執行：
* `macosArm64`
* `iosSimulatorArm64`
* `watchosSimulatorArm64`
* `tvosSimulatorArm64`

它們在基於 Intel 和 Apple 晶片的主機上都可用。所有現有目標在 Apple 晶片主機上也可用。

請注意，在 1.5.30 中，我們僅在 `kotlin-multiplatform` Gradle 插件中為 Apple 晶片目標提供了基本支援。特別是，新的模擬器目標未包含在 `ios`、`tvos` 和 `watchos` 目標捷徑中。
我們將繼續努力改進新目標的使用者體驗。

### 改進的 CocoaPods Gradle 插件的 Kotlin DSL

#### Kotlin/Native 框架的新參數

Kotlin 1.5.30 引入了改進的 CocoaPods Gradle 插件 DSL，用於 Kotlin/Native 框架。除了框架名稱外，您還可以在 Pod 配置中指定其他參數：
* 指定框架的動態或靜態版本
* 明確啟用匯出依賴項
* 啟用 Bitcode 嵌入

要使用新的 DSL，請將您的專案更新到 Kotlin 1.5.30，並在 `cocoapods` 部分的 `build.gradle(.kts)` 檔案中指定參數：

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

#### 支援 Xcode 配置的自訂名稱

Kotlin CocoaPods Gradle 插件支援 Xcode 建置配置中的自訂名稱。如果您在 Xcode 中為建置配置使用特殊名稱，例如 `Staging`，這也將有所幫助。

要指定自訂名稱，請在 `cocoapods` 部分的 `build.gradle(.kts)` 檔案中使用 `xcodeConfigurationToNativeBuildType` 參數：

```kotlin
cocoapods {
    // Maps custom Xcode configuration to NativeBuildType
    xcodeConfigurationToNativeBuildType["CUSTOM_DEBUG"] = NativeBuildType.DEBUG
    xcodeConfigurationToNativeBuildType["CUSTOM_RELEASE"] = NativeBuildType.RELEASE
}
```

此參數不會出現在 Podspec 檔案中。當 Xcode 執行 Gradle 建置過程時，Kotlin CocoaPods Gradle 插件將選擇必要的原生建置型別。

> 無需聲明 `Debug` 和 `Release` 配置，因為它們預設受支援。
>
{style="note"}

### 與 Swift 5.5 `async/await` 的實驗性互通性

> 與 Swift `async/await` 的並發互通性是[實驗性](components-stability.md)的。它可能會隨時被移除或變更。
> 您應僅用於評估目的。我們非常感謝您在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-47610) 上提供回饋。
>
{style="warning"}

我們在 1.4.0 中添加了[支援從 Objective-C 和 Swift 呼叫 Kotlin 的暫停函式](whatsnew14.md#support-for-kotlin-s-suspending-functions-in-swift-and-objective-c)，現在我們正在改進它，以跟上 Swift 5.5 的新功能 – [帶有 `async` 和 `await` 修飾符的並發](https://github.com/apple/swift-evolution/blob/main/proposals/0296-async-await.md)。

Kotlin/Native 編譯器現在會為具有可空回傳型別的暫停函式，在生成的 Objective-C 標頭中發出 `_Nullable_result` 屬性。這使得從 Swift 呼叫它們作為 `async` 函式時，可以具有適當的空值性。

請注意，此功能是實驗性的，未來可能會受到 Kotlin 和 Swift 變更的影響。目前，我們提供此功能的預覽，它具有某些限制，我們渴望聽到您的想法。在[此 YouTrack 議題](https://youtrack.jetbrains.com/issue/KT-47610) 中了解其目前狀態並留下您的回饋。

### 改進的 Swift/Objective-C 物件和伴隨物件映射

現在，以對於原生 iOS 開發人員更直觀的方式取得物件和伴隨物件。例如，如果您在 Kotlin 中有以下物件：

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

要在 Swift 中存取它們，您可以使用 `shared` 和 `companion` 屬性：

```swift
MyObject.shared
MyObject.shared.x
MyClass.companion
MyClass.Companion.shared
```

了解更多關於 [Swift/Objective-C 互通性](native-objc-interop.md)的資訊。

### 針對 MinGW 目標棄用不含匯入函式庫的 DLL 連結

[LLD](https://lld.llvm.org/) 是 LLVM 專案中的連結器，我們計劃開始在 Kotlin/Native 中將其用於 MinGW 目標，因為它比預設的 ld.bfd 具有優勢 – 主要在於其更好的效能。

然而，最新穩定版 LLD 不支援針對 MinGW (Windows) 目標直接連結 DLL。此類連結需要使用[匯入函式庫](https://stackoverflow.com/questions/3573475/how-does-the-import-library-work-details/3573527#3573527)。儘管 Kotlin/Native 1.5.30 不需要它們，但我們正在添加警告以告知您此類用法與未來將成為 MinGW 預設連結器的 LLD 不兼容。

請在[此 YouTrack 議題](https://youtrack.jetbrains.com/issue/KT-47605) 中分享您對過渡到 LLD 連結器的想法和疑慮。

## Kotlin 多平台

1.5.30 為 Kotlin 多平台帶來了以下顯著更新：
* [在共享原生程式碼中使用自訂 `cinterop` 函式庫的能力](#ability-to-use-custom-cinterop-libraries-in-shared-native-code)
* [支援 XCFrameworks](#support-for-xcframeworks)
* [Android 構件的新預設發佈設定](#new-default-publishing-setup-for-android-artifacts)

### 在共享原生程式碼中使用自訂 `cinterop` 函式庫的能力

Kotlin 多平台提供了一個[選項](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-share-on-platforms.html#connect-platform-specific-libraries)，可以在共享原始碼集中使用平台相關的 interop 函式庫。在 1.5.30 之前，這僅適用於 Kotlin/Native 發行版隨附的[平台函式庫](native-platform-libs.md)。從 1.5.30 開始，您可以將其與您的自訂 `cinterop` 函式庫一起使用。要啟用此功能，請在您的 `gradle.properties` 中添加 `kotlin.mpp.enableCInteropCommonization=true` 屬性：

```none
kotlin.mpp.enableGranularSourceSetsMetadata=true
kotlin.native.enableDependencyPropagation=false
kotlin.mpp.enableCInteropCommonization=true
```

### 支援 XCFrameworks

所有 Kotlin 多平台專案現在都可以將 XCFrameworks 作為輸出格式。Apple 引入 XCFrameworks 作為通用 (fat) 框架的替代品。藉助 XCFrameworks，您可以：
* 將所有目標平台和架構的邏輯收集到一個單一捆綁包中。
* 無需在將應用程式發佈到 App Store 之前移除所有不必要的架構。

如果您希望將 Kotlin 框架用於 Apple M1 上的裝置和模擬器，XCFrameworks 非常有用。

要使用 XCFrameworks，請更新您的 `build.gradle(.kts)` 腳本：

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

當您聲明 XCFrameworks 時，將註冊以下新的 Gradle 任務：
* `assembleXCFramework`
* `assembleDebugXCFramework` (額外的偵錯構件，[包含 dSYMs](native-ios-symbolication.md))
* `assembleReleaseXCFramework`

在[此 WWDC 影片](https://developer.apple.com/videos/play/wwdc2019/416/)中了解更多關於 XCFrameworks 的資訊。

### Android 構件的新預設發佈設定

使用 `maven-publish` Gradle 插件，您可以透過在建置腳本中指定 [Android 變體](https://developer.android.com/studio/build/build-variants)名稱來[發佈您的多平台函式庫以用於 Android 目標](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-publish-lib-setup.html#publish-an-android-library)。Kotlin Gradle 插件將自動生成發佈內容。

在 1.5.30 之前，生成的發佈[中繼資料](https://docs.gradle.org/current/userguide/publishing_gradle_module_metadata.html)包含每個已發佈 Android 變體的建置型別屬性，使其僅與函式庫消費者使用的相同建置型別兼容。Kotlin 1.5.30 引入了新的預設發佈設定：
* 如果專案發佈的所有 Android 變體都具有相同的建置型別屬性，則已發佈的變體將不具有建置型別屬性，並且將與任何建置型別兼容。
* 如果已發佈的變體具有不同的建置型別屬性，則只有那些具有 `release` 值的變體將在沒有建置型別屬性的情況下發佈。這使得 `release` 變體與消費者端的任何建置型別兼容，而其他非 `release` 變體將僅與相符的消費者建置型別兼容。

要選擇退出並保留所有變體的建置型別屬性，您可以設定此 Gradle 屬性：`kotlin.android.buildTypeAttribute.keep=true`。

## Kotlin/JS

Kotlin/JS 在 1.5.30 中有兩項主要改進：
* [JS IR 編譯器後端進入 Beta 階段](#js-ir-compiler-backend-reaches-beta)
* [使用 Kotlin/JS IR 後端的應用程式提供更好的偵錯體驗](#better-debugging-experience-for-applications-with-the-kotlin-js-ir-backend)

### JS IR 編譯器後端進入 Beta 階段

基於 IR 的[編譯器後端](whatsnew14.md#unified-backends-and-extensibility)（在 1.4.0 中以 [Alpha](components-stability.md) 形式引入，用於 Kotlin/JS）已進入 Beta 階段。

先前，我們發佈了 [JS IR 後端遷移指南](js-ir-migration.md)，以幫助您將專案遷移到新的後端。現在，我們想介紹 [Kotlin/JS 檢查套件](https://plugins.jetbrains.com/plugin/17183-kotlin-js-inspection-pack/) IDE 插件，它直接在 IntelliJ IDEA 中顯示所需的變更。

### 使用 Kotlin/JS IR 後端的應用程式提供更好的偵錯體驗

Kotlin 1.5.30 為 Kotlin/JS IR 後端帶來了 JavaScript 原始碼映射生成。這將在使用 IR 後端時改進 Kotlin/JS 的偵錯體驗，提供完整的偵錯支援，包括中斷點、單步執行以及帶有適當原始碼參考的可讀堆疊追蹤。

了解如何在[瀏覽器或 IntelliJ IDEA Ultimate 中偵錯 Kotlin/JS](js-debugging.md)。

## Gradle

作為我們[改進 Kotlin Gradle 插件使用者體驗](https://youtrack.jetbrains.com/issue/KT-45778)使命的一部分，我們實作了以下功能：
* [支援 Java 工具鏈](#support-for-java-toolchains)，其中包括[針對較舊 Gradle 版本的 `UsesKotlinJavaToolchain` 介面，指定 JDK 主目錄的能力](#ability-to-specify-jdk-home-with-useskotlinjavatoolchain-interface)
* [更輕鬆地明確指定 Kotlin 守護行程的 JVM 參數](#easier-way-to-explicitly-specify-kotlin-daemon-jvm-arguments)

### 支援 Java 工具鏈

Gradle 6.7 引入了「[Java 工具鏈支援](https://docs.gradle.org/current/userguide/toolchains.html)」功能。
使用此功能，您可以：
* 使用與 Gradle 不同的 JDK 和 JRE 執行編譯、測試和可執行檔。
* 使用未發佈的語言版本編譯和測試程式碼。

透過工具鏈支援，Gradle 可以自動偵測本地 JDK 並安裝建置所需的缺失 JDK。現在，Gradle 本身可以在任何 JDK 上執行，並且仍然重複使用[建置快取功能](gradle-compilation-and-caches.md#gradle-build-cache-support)。

Kotlin Gradle 插件支援 Java 工具鏈用於 Kotlin/JVM 編譯任務。
Java 工具鏈：
* 設定適用於 JVM 目標的 [`jdkHome` 選項](gradle-compiler-options.md#attributes-specific-to-jvm)。
  > [直接設定 `jdkHome` 選項的功能已被棄用](https://youtrack.jetbrains.com/issue/KT-46541)。
  >
  {style="warning"}

* 如果使用者未明確設定 `jvmTarget` 選項，則將 [`kotlinOptions.jvmTarget`](gradle-compiler-options.md#attributes-specific-to-jvm) 設定為工具鏈的 JDK 版本。
  如果未配置工具鏈，`jvmTarget` 欄位將使用預設值。了解更多關於[JVM 目標兼容性](gradle-configure-project.md#check-for-jvm-target-compatibility-of-related-compile-tasks)的資訊。

* 影響 [`kapt` 工作行程](kapt.md#run-kapt-tasks-in-parallel)在哪個 JDK 上執行。

使用以下程式碼設定工具鏈。將佔位符 `<MAJOR_JDK_VERSION>` 替換為您要使用的 JDK 版本：

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

請注意，透過 `kotlin` 擴展設定工具鏈也會更新 Java 編譯任務的工具鏈。

您可以透過 `java` 擴展設定工具鏈，並且 Kotlin 編譯任務將使用它：

```kotlin
java {
    toolchain {
        languageVersion.set(JavaLanguageVersion.of(<MAJOR_JDK_VERSION>)) // "8"
    }
}
```

有關為 `KotlinCompile` 任務設定任何 JDK 版本的資訊，請查閱關於[使用任務 DSL 設定 JDK 版本](gradle-configure-project.md#set-jdk-version-with-the-task-dsl)的文檔。

對於 Gradle 6.1 到 6.6 版本，[使用 `UsesKotlinJavaToolchain` 介面設定 JDK 主目錄](#ability-to-specify-jdk-home-with-useskotlinjavatoolchain-interface)。

### 針對較舊 Gradle 版本的 `UsesKotlinJavaToolchain` 介面，指定 JDK 主目錄的能力

所有支援透過 [`kotlinOptions`](gradle-compiler-options.md) 設定 JDK 的 Kotlin 任務現在都實作了 `UsesKotlinJavaToolchain` 介面。要設定 JDK 主目錄，請填寫您的 JDK 路徑並替換 `<JDK_VERSION>` 佔位符：

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

對於 Gradle 6.1 到 6.6 版本，請使用 `UsesKotlinJavaToolchain` 介面。從 Gradle 6.7 開始，請改用 [Java 工具鏈](#support-for-java-toolchains)。

使用此功能時，請注意 [kapt 任務工作行程](kapt.md#run-kapt-tasks-in-parallel)將僅使用[程序隔離模式](https://docs.gradle.org/current/userguide/worker_api.html#changing_the_isolation_mode)，並且 `kapt.workers.isolation` 屬性將被忽略。

### 更輕鬆地明確指定 Kotlin 守護行程的 JVM 參數

在 Kotlin 1.5.30 中，Kotlin 守護行程的 JVM 參數有了新的邏輯。以下列表中的每個選項都會覆寫其之前的選項：

* 如果未指定任何內容，Kotlin 守護行程將繼承 Gradle 守護行程的參數（與以前相同）。例如，在 `gradle.properties` 檔案中：

    ```none
    org.gradle.jvmargs=-Xmx1500m -Xms=500m
    ```

* 如果 Gradle 守護行程的 JVM 參數具有 `kotlin.daemon.jvm.options` 系統屬性，則像以前一樣使用它：

    ```none
    org.gradle.jvmargs=-Dkotlin.daemon.jvm.options=-Xmx1500m -Xms=500m
    ```

* 您可以在 `gradle.properties` 檔案中添加 `kotlin.daemon.jvmargs` 屬性：

    ```none
    kotlin.daemon.jvmargs=-Xmx1500m -Xms=500m
    ```

* 您可以在 `kotlin` 擴展中指定參數：

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

* 您可以為特定任務指定參數：

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

    > 在此情況下，新 Kotlin 守護行程實例可能會在任務執行時啟動。請參閱 [Kotlin 守護行程與 JVM 參數的互動](gradle-compilation-and-caches.md#setting-kotlin-daemon-s-jvm-arguments) 了解更多資訊。
    >
    {style="note"}

有關 Kotlin 守護行程的更多資訊，請參閱 [Kotlin 守護行程以及如何與 Gradle 一起使用](gradle-compilation-and-caches.md#the-kotlin-daemon-and-how-to-use-it-with-gradle)。

## 標準函式庫

Kotlin 1.5.30 正在改進標準函式庫的 `Duration` 和 `Regex` API：
* [變更 `Duration.toString()` 輸出](#changing-duration-tostring-output)
* [從字串解析 `Duration`](#parsing-duration-from-string)
* [在特定位置使用 `Regex` 進行匹配](#matching-with-regex-at-a-particular-position)
* [將 `Regex` 分割成序列](#splitting-regex-to-a-sequence)

### 變更 `Duration.toString()` 輸出

> `Duration` API 是[實驗性](components-stability.md)的。它可能會隨時被移除或變更。
> 僅用於評估目的。我們非常感謝您在 [YouTrack](https://youtrack.jetbrains.com/issues/KT) 上提供回饋。
>
{style="warning"}

在 Kotlin 1.5.30 之前，[`Duration.toString()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/-duration/to-string.html) 函式會回傳其引數的字串表示形式，以產生最緊湊和可讀數值的單位表示。
從現在開始，它將回傳表示為數值組件組合的字串值，每個組件都有自己的單位。
每個組件是一個數字，後跟單位的縮寫名稱：`d`、`h`、`m`、`s`。例如：

|**函式呼叫範例**|**先前輸出**|**目前輸出**|
| --- | --- | --- |
|Duration.days(45).toString()|`45.0d`|`45d`|
|Duration.days(1.5).toString()|`36.0h`|`1d 12h`|
|Duration.minutes(1230).toString()|`20.5h`|`20h 30m`|
|Duration.minutes(2415).toString()|`40.3h`|`1d 16h 15m`|
|Duration.minutes(920).toString()|`920m`|`15h 20m`|
|Duration.seconds(1.546).toString()|`1.55s`|`1.546s`|
|Duration.milliseconds(25.12).toString()|`25.1ms`|`25.12ms`|

負持續時間的表示方式也已變更。負持續時間以減號 (`-`) 為前綴，如果它由多個組件組成，則用圓括號包圍：`-12m` 和 `-(1h 30m)`。

請注意，小於一秒的短持續時間表示為單個數字，帶有其中一個亞秒單位。例如，`ms`（毫秒）、`us`（微秒）或 `ns`（奈秒）：`140.884ms`、`500us`、`24ns`。不再使用科學記號表示它們。

如果您想以單一單位表示持續時間，請使用重載的 `Duration.toString(unit, decimals)` 函式。

> 在某些情況下，包括序列化和交換，我們建議使用 [`Duration.toIsoString()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/-duration/to-iso-string.html)。`Duration.toIsoString()` 使用更嚴格的 [ISO-8601](https://www.iso.org/iso-8601-date-and-time-format.html) 格式，而非 `Duration.toString()`。
>
{style="note"}

### 從字串解析 `Duration`

> `Duration` API 是[實驗性](components-stability.md)的。它可能會隨時被移除或變更。
> 僅用於評估目的。我們非常感謝您在[此議題](https://github.com/Kotlin/KEEP/issues/190)上提供回饋。
>
{style="warning"}

在 Kotlin 1.5.30 中，`Duration` API 中有新的函式：
* [`parse()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/-duration/parse.html)，支援解析以下輸出的內容：
    * [`toString()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/-duration/to-string.html)。
    * [`toString(unit, decimals)`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/-duration/to-string.html)。
    * [`toIsoString()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/-duration/to-iso-string.html)。
* [`parseIsoString()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/-duration/parse-iso-string.html)，它只從 `toIsoString()` 產生的格式中解析。
* [`parseOrNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/-duration/parse-or-null.html) 和 [`parseIsoStringOrNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/-duration/parse-iso-string-or-null.html)，它們的行為與上述函式類似，但在無效持續時間格式時回傳 `null` 而不是拋出 `IllegalArgumentException`。

以下是 `parse()` 和 `parseOrNull()` 用法的一些範例：

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

以下是 `parseIsoString()` 和 `parseIsoStringOrNull()` 用法的一些範例：

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

### 在特定位置使用 `Regex` 進行匹配

> `Regex.matchAt()` 和 `Regex.matchesAt()` 函式是[實驗性](components-stability.md)的。它們可能會隨時被移除或變更。
> 僅用於評估目的。我們非常感謝您在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-34021) 上提供回饋。
>
{style="warning"}

新的 `Regex.matchAt()` 和 `Regex.matchesAt()` 函式提供了一種方法來檢查正規表達式是否在 `String` 或 `CharSequence` 中的特定位置具有精確匹配。

`matchesAt()` 回傳一個布林結果：

```kotlin
fun main(){
//sampleStart
    val releaseText = "Kotlin 1.5.30 is released!"
    // regular expression: one digit, dot, one digit, dot, one or more digits
    val versionRegex = "\\d[.]\\d[.]\\d+".toRegex()
    println(versionRegex.matchesAt(releaseText, 0)) // "false"
    println(versionRegex.matchesAt(releaseText, 7)) // "true"
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.5" validate="false"}

`matchAt()` 回傳匹配（如果找到）或 `null`（如果未找到）：

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

### 將 `Regex` 分割成序列

> `Regex.splitToSequence()` 和 `CharSequence.splitToSequence(Regex)` 函式是[實驗性](components-stability.md)的。它們可能會隨時被移除或變更。
> 僅用於評估目的。我們非常感謝您在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-23351) 上提供回饋。
>
{style="warning"}

新的 `Regex.splitToSequence()` 函式是 [`split()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/-regex/split.html) 的延遲對應物。它圍繞給定正規表達式的匹配來分割字串，但它將結果作為一個[序列](sequences.md)回傳，以便對此結果的所有操作都是延遲執行的。

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

一個類似的函式也已添加到 `CharSequence` 中：

```kotlin
    val mixedColor = colorsText.splitToSequence(regex)
```
{kotlin-runnable="false"}

## Serialization 1.3.0-RC

`kotlinx.serialization` [1.3.0-RC](https://github.com/Kotlin/kotlinx.serialization/releases/tag/v1.3.0-RC) 帶來了
新的 JSON 序列化功能：
* Java IO 串流序列化
* 對預設值進行屬性層級控制
* 從序列化中排除空值的選項
* 多型序列化中的自訂類別鑑別器

在[變更日誌](https://github.com/Kotlin/kotlinx.serialization/releases/tag/v1.3.0-RC)中了解更多資訊。
<!-- and the [kotlinx.serialization 1.3.0 release blog post](TODO). -->