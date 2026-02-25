[//]: # (title: Kotlin 1.5.30 的新功能)

<web-summary>閱讀 Kotlin 1.5.30 版本說明，涵蓋新的語言特性、Kotlin Multiplatform、JVM、Native、JS 的更新，以及對 Gradle 和 Maven 的建置工具支援。</web-summary>

_[發佈日期：2021 年 8 月 24 日](releases.md#release-history)_

Kotlin 1.5.30 提供了語言更新，包括未來變更的預覽、平台支援與工具的多項改進，以及新的標準函式庫函式。

以下是一些主要的改進：
* 語言特性，包括實驗性的密封 `when` 陳述式、選擇性使用（opt-in）需求的變更等
* 對 Apple 晶片的原生支援
* Kotlin/JS IR 後端進入 Beta 階段
* 改進的 Gradle 外掛程式體驗

您也可以在 [發佈部落格文章](https://blog.jetbrains.com/kotlin/2021/08/kotlin-1-5-30-released/) 和此影片中找到變更的簡短概述：

<video src="https://www.youtube.com/v/rNbb3A9IdOo" title="Kotlin 1.5.30"/>

> 有關 Kotlin 發佈週期的資訊，請參閱 [Kotlin 發佈流程](releases.md)。
>
{style="tip"}

## 語言特性

Kotlin 1.5.30 展示了未來語言變更的預覽，並對選擇性使用需求機制和型別推論進行了改進：
* [針對密封和布林受詞的窮舉 when 陳述式](#exhaustive-when-statements-for-sealed-and-boolean-subjects)
* [將掛起函式作為超型別](#suspending-functions-as-supertypes)
* [對實驗性 API 的隱式用法要求選擇性使用](#requiring-opt-in-on-implicit-usages-of-experimental-apis)
* [對不同目標使用選擇性使用需求註解的變更](#changes-to-using-opt-in-requirement-annotations-with-different-targets)
* [遞迴泛型型別的型別推論改進](#improvements-to-type-inference-for-recursive-generic-types)
* [消除建置器推論限制](#eliminating-builder-inference-restrictions)

### 針對密封和布林受詞的窮舉 when 陳述式

> 支援密封（窮舉）when 陳述式目前處於 [實驗性](components-stability.md) 階段。它隨時可能被捨棄或更改。
> 需要選擇性使用（請參閱下方詳細資訊），且您應僅出於評估目的使用它。我們歡迎您在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-12380) 提供回饋。
>
{style="warning"}

一個「窮舉式」的 [`when`](control-flow.md#when-expressions-and-statements) 陳述式包含其受詞所有可能型別或值的分支，或者針對某些型別包含一個 `else` 分支來涵蓋任何剩餘情況。

我們計劃很快禁止非窮舉式的 `when` 陳述式，以使行為與 `when` 運算式保持一致。為了確保順利遷移，您可以設定編譯器，針對包含密封類別或布林值的非窮舉式 `when` 陳述式回報警告。此類警告將在 Kotlin 1.6 中預設出現，並在稍後變更為錯誤。

> 列舉（Enums）已經會收到警告。
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

要在 Kotlin 1.5.30 中啟用此功能，請使用語言版本 `1.6`。您也可以透過啟用 [漸進模式](whatsnew13.md#progressive-mode) 將警告變更為錯誤。

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
kotlin {
    sourceSets.all {
        languageSettings.apply {
            languageVersion = "1.6"
            //progressiveMode = true // 預設為 false
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
            //progressiveMode = true // 預設為 false
        }
    }
}
```

</tab>
</tabs>

### 將掛起函式作為超型別

> 支援將掛起函式作為超型別目前處於 [實驗性](components-stability.md) 階段。它隨時可能被捨棄或更改。
> 需要選擇性使用（請參閱下方詳細資訊），且您應僅出於評估目的使用它。我們歡迎您在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-18707) 提供回饋。
>
{style="warning"}

Kotlin 1.5.30 預覽了將 `suspend` 泛型功能型別用作超型別的能力，但存在一些限制。

```kotlin
class MyClass: suspend () -> Unit {
    override suspend fun invoke() { TODO() }
}
```

使用 `-language-version 1.6` 編譯器選項來啟用此功能：

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

此功能具有以下限制：
* 您不能混合普通功能型別和 `suspend` 功能型別作為超型別。這是因為 JVM 後端中 `suspend` 功能型別的實作細節。它們在其中被表示為帶有標記介面的普通功能型別。由於標記介面的原因，無法辨別哪些超介面是掛起的，哪些是普通的。
* 您不能使用多個 `suspend` 功能型別作為超型別。如果存在型別檢查，您也不能使用多個普通功能型別作為超型別。

### 對實驗性 API 的隱式用法要求選擇性使用

> 選擇性使用需求機制目前處於 [實驗性](components-stability.md) 階段。
> 它隨時可能更改。[查看如何選擇性使用](opt-in-requirements.md)。
> 請僅出於評估目的使用它。我們歡迎您在 [YouTrack](https://youtrack.jetbrains.com/issues/KT) 提供回饋。
>
{style="warning"}

函式庫的作者可以將實驗性 API 標記為 [需要選擇性使用](opt-in-requirements.md#create-opt-in-requirement-annotations)，以告知使用者其處於實驗狀態。當使用該 API 時，編譯器會發出警告或錯誤，並需要 [明確同意](https://kotlinlang.org/docs/opt-in-requirements.html#opt-in-to-api) 才能隱藏。

在 Kotlin 1.5.30 中，編譯器會將任何在簽章中包含實驗性型別的宣告視為實驗性的。也就是說，即使是隱式使用實驗性 API，它也要求選擇性使用。例如，如果函式的回傳型別被標記為實驗性 API 元素，則即便該宣告本身未被明確標記為需要選擇性使用，使用該函式仍需要您進行選擇性使用。

```kotlin
// 函式庫程式碼

@RequiresOptIn(message = "This API is experimental.")
@Retention(AnnotationRetention.BINARY)
@Target(AnnotationTarget.CLASS)
annotation class MyDateTime // 選擇性使用需求註解

@MyDateTime
class DateProvider // 需要選擇性使用的類別

// 用戶端程式碼

// 警告：使用了實驗性 API
fun createDateSource(): DateProvider { /* ... */ }

fun getDate(): Date {
    val dateSource = createDateSource() // 同樣有警告：使用了實驗性 API
    // ... 
}
```

了解更多關於 [選擇性使用需求](opt-in-requirements.md)。

### 對不同目標使用選擇性使用需求註解的變更

> 選擇性使用需求機制目前處於 [實驗性](components-stability.md) 階段。
> 它隨時可能更改。[查看如何選擇性使用](opt-in-requirements.md)。
> 請僅出於評估目的使用它。我們歡迎您在 [YouTrack](https://youtrack.jetbrains.com/issues/KT) 提供回饋。
>
{style="warning"}

Kotlin 1.5.30 提出了在不同 [目標](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.annotation/-target/) 上使用和宣告選擇性使用需求註解的新規則。編譯器現在會針對編譯時難以處理的使用案例報錯。在 Kotlin 1.5.30 中：
* 禁止在使用處將區域變數和值參數標記為選擇性使用需求註解。
* 只有當覆寫（override）的基本宣告也被標記時，才允許對該覆寫進行標記。
* 禁止標記支援欄位（backing field）和取得方法（getter）。您可以改為標記基本屬性。
* 禁止在選擇性使用需求註解宣告處設定 `TYPE` 和 `TYPE_PARAMETER` 註解目標。

了解更多關於 [選擇性使用需求](opt-in-requirements.md)。

### 遞迴泛型型別的型別推論改進

在 Kotlin 和 Java 中，您可以定義遞迴泛型型別，即在其型別參數中引用自身的型別。在 Kotlin 1.5.30 中，如果它是遞迴泛型，Kotlin 編譯器可以僅根據對應型別參數的上界來推論型別引數。這使得建立各種遞迴泛型型別模式成為可能，這些模式在 Java 中常用於製作建置器 API。

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

您可以透過傳遞 `-Xself-upper-bound-inference` 或 `-language-version 1.6` 編譯器選項來啟用這些改進。請參閱 [此 YouTrack 票證](https://youtrack.jetbrains.com/issue/KT-40804) 中其他新支援的使用案例範例。

### 消除建置器推論限制

建置器推論是一種特殊的型別推論，它允許您根據 Lambda 引數內其他呼叫的型別資訊來推論該呼叫的型別引數。當呼叫泛型建置器函式（如 [`buildList()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/build-list.html) 或 [`sequence()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.sequences/sequence.html)）時，這非常有用：`buildList { add("string") }`。

在這種 Lambda 引數內部，先前對於使用建置器推論嘗試推論的型別資訊存在限制。這意味著您只能指定它而不能取得它。例如，您不能在 `buildList()` 的 Lambda 引數內呼叫 [`get()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-list/get.html)，除非明確指定了型別引數。

Kotlin 1.5.30 透過 `-Xunrestricted-builder-inference` 編譯器選項消除了這些限制。新增此選項即可在泛型建置器函式的 Lambda 引數內啟用先前禁止的呼叫：

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

此外，您也可以透過 `-language-version 1.6` 編譯器選項啟用此功能。

## Kotlin/JVM

在 Kotlin 1.5.30 中，Kotlin/JVM 獲得了以下功能：
* [註解類別的具現化](#instantiation-of-annotation-classes)
* [改進的可 null 性註解支援配置](#improved-nullability-annotation-support-configuration)

有關 JVM 平台上 Kotlin Gradle 外掛程式的更新，請參閱 [Gradle](#gradle) 章節。

### 註解類別的具現化

> 註解類別的具現化目前處於 [實驗性](components-stability.md) 階段。它隨時可能被捨棄或更改。
> 需要選擇性使用（請參閱下方詳細資訊），且您應僅出於評估目的使用它。我們歡迎您在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-45395) 提供回饋。
>
{style="warning"}

在 Kotlin 1.5.30 中，您現在可以在任意程式碼中呼叫 [註解類別](annotations.md) 的建構函式，以取得結果執行個體。此功能涵蓋了與允許實作註解介面的 Java 慣例相同的使用案例。

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

使用 `-language-version 1.6` 編譯器選項來啟用此功能。請注意，所有目前的註解類別限制（例如禁止定義非 `val` 參數或與次要建構函式不同的成員）仍然有效。

在 [此 KEEP](https://github.com/Kotlin/KEEP/blob/master/proposals/annotation-instantiation.md) 中了解更多關於註解類別具現化的資訊。

### 改進的可 null 性註解支援配置

Kotlin 編譯器可以讀取各種類型的 [可 null 性註解](java-interop.md#nullability-annotations)，以從 Java 取得可 null 性資訊。此資訊允許它在呼叫 Java 程式碼時，於 Kotlin 中回報可 null 性不符。

在 Kotlin 1.5.30 中，您可以根據特定類型的可 null 性註解資訊，指定編譯器是否回報可 null 性不符。只需使用編譯器選項 `-Xnullability-annotations=@<package-name>:<report-level>`。在引數中，指定完全限定的可 null 性註解套件以及以下其中一個回報等級：
* `ignore` 忽略可 null 性不符
* `warn` 回報警告
* `strict` 回報錯誤

請參閱 [支援的可 null 性註解完整清單](java-interop.md#nullability-annotations) 及其完全限定的套件名稱。

以下範例顯示如何為新支援的 [RxJava](https://github.com/ReactiveX/RxJava) 3 可 null 性註解啟用錯誤回報：`-Xnullability-annotations=@io.reactivex.rxjava3.annotations:strict`。請注意，所有此類可 null 性不符預設皆為警告。

## Kotlin/Native

Kotlin/Native 獲得了多項變更與改進：
* [Apple 晶片支援](#apple-silicon-support)
* [改進的 CocoaPods Gradle 外掛程式 Kotlin DSL](#improved-kotlin-dsl-for-the-cocoapods-gradle-plugin)
* [與 Swift 5.5 async/await 的實驗性互通性](#experimental-interoperability-with-swift-5-5-async-await)
* [改進的物件與隨伴物件的 Swift/Objective-C 對應](#improved-swift-objective-c-mapping-for-objects-and-companion-objects)
* [棄用 MinGW 目標中不含匯入程式庫的 DLL 連結](#deprecation-of-linkage-against-dlls-without-import libraries-for-mingw-targets)

### Apple 晶片支援

Kotlin 1.5.30 引入了對 [Apple 晶片](https://support.apple.com/en-us/HT211814) 的原生支援。

先前，Kotlin/Native 編譯器與工具需要 [Rosetta 轉譯環境](https://developer.apple.com/documentation/apple-silicon/about-the-rosetta-translation-environment) 才能在 Apple 晶片主機上運作。在 Kotlin 1.5.30 中，不再需要轉譯環境——編譯器與工具可以直接在 Apple 晶片硬體上執行，無需任何額外操作。

我們還引入了新的目標，讓 Kotlin 程式碼能在 Apple 晶片上原生執行：
* `macosArm64`
* `iosSimulatorArm64`
* `watchosSimulatorArm64`
* `tvosSimulatorArm64`

它們在 Intel 基礎和 Apple 晶片主機上皆可使用。所有現有目標在 Apple 晶片主機上也可使用。

請注意，在 1.5.30 中，我們僅在 `kotlin-multiplatform` Gradle 外掛程式中提供對 Apple 晶片目標的基本支援。特別是，新的模擬器目標未包含在 `ios`、`tvos` 和 `watchos` 目標捷徑中。
我們將繼續致力於改善新目標的使用者體驗。

### 改進的 CocoaPods Gradle 外掛程式 Kotlin DSL

#### Kotlin/Native 框架的新參數

Kotlin 1.5.30 為 Kotlin/Native 框架引入了改進的 CocoaPods Gradle 外掛程式 DSL。除了框架名稱外，您還可以在 Pod 配置中指定其他參數：
* 指定框架的動態或靜態版本
* 明確啟用匯出相依性
* 啟用 Bitcode 嵌入

要使用新 DSL，請將您的專案更新至 Kotlin 1.5.30，並在 `build.gradle(.kts)` 檔案的 `cocoapods` 區塊中指定參數：

```kotlin
cocoapods {
    frameworkName = "MyFramework" // 此屬性已棄用 
    // 並將在未來版本中移除
    // 框架配置的新 DSL：
    framework {
        // 支援所有 Framework 屬性
        // 框架名稱配置。請使用此屬性代替 
        // 已棄用的 'frameworkName'
        baseName = "MyFramework"
        // 動態框架支援
        isStatic = false
        // 相依性匯出
        export(project(":anotherKMMModule"))
        transitiveExport = false // 此為預設值。
        // Bitcode 嵌入
        embedBitcode(BITCODE)
    }
}
```

#### 支援 Xcode 配置的自訂名稱

Kotlin CocoaPods Gradle 外掛程式支援 Xcode 組建組態中的自訂名稱。如果您在 Xcode 中對組建組態使用特殊名稱（例如 `Staging`），這也會有所幫助。

要指定自訂名稱，請在 `build.gradle(.kts)` 檔案的 `cocoapods` 區塊中使用 `xcodeConfigurationToNativeBuildType` 參數：

```kotlin
cocoapods {
    // 將自訂 Xcode 配置對應至 NativeBuildType
    xcodeConfigurationToNativeBuildType["CUSTOM_DEBUG"] = NativeBuildType.DEBUG
    xcodeConfigurationToNativeBuildType["CUSTOM_RELEASE"] = NativeBuildType.RELEASE
}
```

此參數不會出於 Podspec 檔案中。當 Xcode 執行 Gradle 建置程序時，Kotlin CocoaPods Gradle 外掛程式將選擇必要的原生建置類型。

> 不需要宣告 `Debug` 和 `Release` 配置，因為它們預設已受支援。
>
{style="note"}

### 與 Swift 5.5 async/await 的實驗性互通性

> 與 Swift async/await 的並行互通性目前處於 [實驗性](components-stability.md) 階段。它隨時可能被捨棄或更改。
> 您應僅出於評估目的使用它。我們歡迎您在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-47610) 提供回饋。
>
{style="warning"}

我們在 [1.4.0 中加入了從 Objective-C 和 Swift 呼叫 Kotlin 掛起函式的支援](whatsnew14.md#support-for-kotlin-s-suspending-functions-in-swift-and-objective-c)，現在我們正在對其進行改進，以跟上 Swift 5.5 的新功能——[使用 `async` 和 `await` 修飾符的並行處理](https://github.com/apple/swift-evolution/blob/main/proposals/0296-async-await.md)。

對於具有可 null 回傳型別的掛起函式，Kotlin/Native 編譯器現在會在產生的 Objective-C 標頭中發出 `_Nullable_result` 屬性。這使得從 Swift 將它們作為具有正確可 null 性的 `async` 函式進行呼叫成為可能。

請注意，此功能是實驗性的，未來可能會受到 Kotlin 和 Swift 變更的影響。目前，我們提供此功能的預覽，該預覽具有某些限制，我們渴望聽到您的想法。了解其目前狀態並在 [此 YouTrack 問題](https://youtrack.jetbrains.com/issue/KT-47610) 中留下您的回饋。

### 改進的物件與隨伴物件的 Swift/Objective-C 對應

現在可以以對原生 iOS 開發人員更直觀的方式取得物件和隨伴物件。例如，如果您在 Kotlin 中有以下物件：

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

進一步了解 [Swift/Objective-C 互通性](native-objc-interop.md)。

### 棄用 MinGW 目標中不含匯入程式庫的 DLL 連結

[LLD](https://lld.llvm.org/) 是 LLVM 專案中的一個連結器，我們計劃開始在 Kotlin/Native 中為 MinGW 目標使用它，因為它比預設的 ld.bfd 具有更多優點——主要是更好的效能。

然而，最新穩定版本的 LLD 不支援 MinGW (Windows) 目標直接連結 DLL。此類連結需要使用 [匯入程式庫](https://stackoverflow.com/questions/3573475/how-does-the-import-library-work-details/3573527#3573527)。雖然 Kotlin/Native 1.5.30 尚不需要它們，但我們正在加入警告，以告知您此類用法與 LLD 不相容，LLD 未來將成為 MinGW 的預設連結器。

請在 [此 YouTrack 問題](https://youtrack.jetbrains.com/issue/KT-47605) 中分享您對轉換至 LLD 連結器的想法與疑慮。

## Kotlin Multiplatform

1.5.30 為 Kotlin Multiplatform 帶來了以下顯著更新：
* [能夠在共用的原生程式碼中使用自訂 cinterop 程式庫](#ability-to-use-custom-cinterop-libraries-in-shared-native-code)
* [支援 XCFrameworks](#support-for-xcframeworks)
* [Android 構件的新預設發佈設定](#new-default-publishing-setup-for-android-artifacts)

### 能夠在共用的原生程式碼中使用自訂 cinterop 程式庫

Kotlin Multiplatform 提供了一個 [選項](https://kotlinlang.org/docs/multiplatform/multiplatform-share-on-platforms.html#connect-platform-specific-libraries)，讓您在共用來源集中使用平台相關的互通程式庫。在 1.5.30 之前，這僅適用於 Kotlin/Native 發行版隨附的 [平台程式庫](native-platform-libs.md)。從 1.5.30 開始，您可以將其與自訂 `cinterop` 程式庫搭配使用。要啟用此功能，請在您的 `gradle.properties` 中加入 `kotlin.mpp.enableCInteropCommonization=true` 屬性：

```none
kotlin.mpp.enableGranularSourceSetsMetadata=true
kotlin.native.enableDependencyPropagation=false
kotlin.mpp.enableCInteropCommonization=true
```

### 支援 XCFrameworks

所有 Kotlin Multiplatform 專案現在都可以將 XCFrameworks 作為輸出格式。Apple 引入了 XCFrameworks 作為通用（fat）框架的替代品。透過 XCFrameworks，您可以：
* 在單一組合包中收集所有目標平台和架構的邏輯。
* 在將應用程式發佈至 App Store 之前，無需移除所有不必要的架構。

如果您想在 Apple M1 裝置和模擬器上使用 Kotlin 框架，XCFrameworks 非常有用。

要使用 XCFrameworks，請更新您的 `build.gradle(.kts)` 指令碼：

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

當您宣告 XCFrameworks 時，將會註冊這些新的 Gradle 任務：
* `assembleXCFramework`
* `assembleDebugXCFramework`（額外的偵錯構件，[包含 dSYMs](native-debugging.md#debug-ios-applications)）
* `assembleReleaseXCFramework`

在 [此 WWDC 影片](https://developer.apple.com/videos/play/wwdc2019/416/) 中了解更多關於 XCFrameworks 的資訊。

### Android 構件的新預設發佈設定

使用 `maven-publish` Gradle 外掛程式，您可以透過在建置指令碼中指定 [Android 變體（variant）](https://developer.android.com/studio/build/build-variants) 名稱，[為 Android 目標發佈多平台程式庫](https://kotlinlang.org/docs/multiplatform/multiplatform-publish-lib-setup.html#publish-an-android-library)。Kotlin Gradle 外掛程式將自動產生發佈內容。

在 1.5.30 之前，產生的發佈 [元資料](https://docs.gradle.org/current/userguide/publishing_gradle_module_metadata.html) 包含每個已發佈 Android 變體的建置類型屬性，使其僅與程式庫取用者使用的相同建置類型相容。Kotlin 1.5.30 引入了新的預設發佈設定：
* 如果專案發佈的所有 Android 變體都具有相同的建置類型屬性，則發佈的變體將不具有建置類型屬性，並將與任何建置類型相容。
* 如果發佈的變體具有不同的建置類型屬性，則只有具有 `release` 值的變體才會在發佈時不帶建置類型屬性。這使得 release 變體與取用端的任何建置類型相容，而非 release 變體將僅與相符的取用端建置類型相容。

要退出並為所有變體保留建置類型屬性，您可以設定此 Gradle 屬性：`kotlin.android.buildTypeAttribute.keep=true`。

## Kotlin/JS

Kotlin/JS 1.5.30 帶來了兩項主要改進：
* [JS IR 編編譯器後端進入 Beta 階段](#js-ir-compiler-backend-reaches-beta)
* [使用 Kotlin/JS IR 後端的應用程式擁有更好的偵錯體驗](#better-debugging-experience-for-applications-with-the-kotlin-js-ir-backend)

### JS IR 編譯器後端進入 Beta 階段

Kotlin/JS 的 [基於 IR 的編譯器後端](whatsnew14.md#unified-backends-and-extensibility)（在 1.4.0 中以 [Alpha](components-stability.md) 引入）已達到 Beta 階段。

先前，我們發佈了 JS IR 後端遷移指南，以幫助您將專案遷移至新後端。現在，我們向您介紹 [Kotlin/JS Inspection Pack](https://plugins.jetbrains.com/plugin/17183-kotlin-js-inspection-pack/) IDE 外掛程式，它直接在 IntelliJ IDEA 中顯示所需的變更。

### 使用 Kotlin/JS IR 後端的應用程式擁有更好的偵錯體驗

Kotlin 1.5.30 為 Kotlin/JS IR 後端帶來了 JavaScript 原始碼對應檔產生功能。這將在啟用 IR 後端時改善 Kotlin/JS 偵錯體驗，提供完整的偵錯支援，包括中斷點、單步執行，以及具有正確原始碼參照的可讀堆疊追蹤。

了解如何 [在瀏覽器或 IntelliJ IDEA Ultimate 中偵錯 Kotlin/JS](js-debugging.md)。

## Gradle

作為我們 [改善 Kotlin Gradle 外掛程式使用者體驗](https://youtrack.jetbrains.com/issue/KT-45778) 使命的一部分，我們實作了以下功能：
* [支援 Java 工具鏈](#support-for-java-toolchains)，這包括 [針對較舊 Gradle 版本使用 `UsesKotlinJavaToolchain` 介面指定 JDK 主目錄的能力](#ability-to-specify-jdk-home-with-useskotlinjavatoolchain-interface)
* [更簡單的方式來明確指定 Kotlin 精靈程序的 JVM 引數](#easier-way-to-explicitly-specify-kotlin-daemon-jvm-arguments)

### 支援 Java 工具鏈

Gradle 6.7 引入了 [「Java 工具鏈支援」](https://docs.gradle.org/current/userguide/toolchains.html) 功能。
使用此功能，您可以：
* 使用與 Gradle 不同的 JDK 和 JRE 執行編譯、測試和執行檔。
* 使用尚未發佈的語言版本編譯與測試程式碼。

有了工具鏈支援，Gradle 可以自動偵測本機 JDK，並安裝建置所需的缺失 JDK。現在 Gradle 本身可以在任何 JDK 上執行，並仍能重複使用 [建置快取功能](gradle-compilation-and-caches.md#gradle-build-cache-support)。

Kotlin Gradle 外掛程式支援 Kotlin/JVM 編譯任務的 Java 工具鏈。
Java 工具鏈會：
* 設定可用於 JVM 目標的 [`jdkHome` 選項](gradle-compiler-options.md#attributes-specific-to-jvm)。
  > [直接設定 `jdkHome` 選項的能力已棄用](https://youtrack.jetbrains.com/issue/KT-46541)。
  >
  {style="warning"}

* 如果使用者未明確設定 `jvmTarget` 選項，則將 [`kotlinOptions.jvmTarget`](gradle-compiler-options.md#attributes-specific-to-jvm) 設定為工具鏈的 JDK 版本。
  如果未配置工具鏈，`jvmTarget` 欄位將使用預設值。進一步了解 [JVM 目標相容性](gradle-configure-project.md#check-for-jvm-target-compatibility-of-related-compile-tasks)。

* 影響 [`kapt` 背景工作執行緒](kapt.md#run-kapt-tasks-in-parallel) 執行的 JDK。

使用以下程式碼設定工具鏈。請將占位符 `<MAJOR_JDK_VERSION>` 替換為您想使用的 JDK 版本：

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

請注意，透過 `kotlin` 擴充套件設定工具鏈也會更新 Java 編譯任務的工具鏈。

您可以透過 `java` 擴充套件設定工具鏈，Kotlin 編譯任務將會使用它：

```kotlin
java {
    toolchain {
        languageVersion.set(JavaLanguageVersion.of(<MAJOR_JDK_VERSION>)) // "8"
    }
}
```

有關為 `KotlinCompile` 任務設定任何 JDK 版本的資訊，請查看有關 [使用任務 DSL 設定 JDK 版本](gradle-configure-project.md#set-jdk-version-with-the-task-dsl) 的文件。

對於 Gradle 6.1 到 6.6 版本，[請使用 `UsesKotlinJavaToolchain` 介面來設定 JDK 主目錄](#ability-to-specify-jdk-home-with-useskotlinjavatoolchain-interface)。

### 能夠使用 UsesKotlinJavaToolchain 介面指定 JDK 主目錄

所有支援透過 [`kotlinOptions`](gradle-compiler-options.md) 設定 JDK 的 Kotlin 任務現在都實作了 `UsesKotlinJavaToolchain` 介面。要設定 JDK 主目錄，請放入您的 JDK 路徑並替換 `<JDK_VERSION>` 占位符：

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

使用此功能時請注意，[kapt 任務背景工作執行緒](kapt.md#run-kapt-tasks-in-parallel) 將僅使用 [行程隔離模式](https://docs.gradle.org/current/userguide/worker_api.html#changing_the_isolation_mode)，且 `kapt.workers.isolation` 屬性將被忽略。

### 更簡單的方式來明確指定 Kotlin 精靈程序 JVM 引數

在 Kotlin 1.5.30 中，針對 Kotlin 精靈程序（Kotlin daemon）的 JVM 引數有新的邏輯。以下列表中的每個選項都會覆寫其之前的選項：

* 如果未指定任何內容，Kotlin 精靈程序將繼承 Gradle 精靈程序的引數（如先前一樣）。例如，在 `gradle.properties` 檔案中：

    ```none
    org.gradle.jvmargs=-Xmx1500m -Xms=500m
    ```

* 如果 Gradle 精靈程序的 JVM 引數具有 `kotlin.daemon.jvm.options` 系統屬性，請如先前一樣使用它：

    ```none
    org.gradle.jvmargs=-Dkotlin.daemon.jvm.options=-Xmx1500m -Xms=500m
    ```

* 您可以在 `gradle.properties` 檔案中加入 `kotlin.daemon.jvmargs` 屬性：

    ```none
    kotlin.daemon.jvmargs=-Xmx1500m -Xms=500m
    ```

* 您可以在 `kotlin` 擴充套件中指定引數：

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

* 您可以為特定任務指定引數：

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

    > 在這種情況下，一個新的 Kotlin 精靈程序執行個體可能會在任務執行時啟動。了解更多關於 [Kotlin 精靈程序與 JVM 引數的互動](gradle-compilation-and-caches.md#setting-kotlin-daemon-s-jvm-arguments)。
    >
    {style="note"}

有關 Kotlin 精靈程序的更多資訊，請參閱 [Kotlin 精靈程序及其與 Gradle 的搭配使用](gradle-compilation-and-caches.md#the-kotlin-daemon-and-how-to-use-it-with-gradle)。

## 標準函式庫

Kotlin 1.5.30 為標準函式庫的 `Duration` 和 `Regex` API 帶來了改進：
* [變更 `Duration.toString()` 輸出](#changing-duration-tostring-output)
* [從字串解析 Duration](#parsing-duration-from-string)
* [在特定位置使用 Regex 進行配對](#matching-with-regex-at-a-particular-position)
* [將 Regex 分割為序列](#splitting-regex-to-a-sequence)

### 變更 Duration.toString() 輸出

> Duration API 目前處於 [實驗性](components-stability.md) 階段。它隨時可能被捨棄或更改。
> 請僅出於評估目的使用它。我們歡迎您在 [YouTrack](https://youtrack.jetbrains.com/issues/KT) 提供回饋。
>
{style="warning"}

在 Kotlin 1.5.30 之前，[`Duration.toString()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/-duration/to-string.html) 函式會回傳其引數的字串表示，以產生最精簡且可讀的數值的單位來表示。
從現在開始，它將回傳一個以數值組件組合而成的字串值，每個組件都有自己的單位。
每個組件是一個數字後跟單位的縮寫名稱：`d`、`h`、`m`、`s`。例如：

|**函式呼叫範例**|**先前的輸出**|**目前的輸出**|
| --- | --- | --- |
Duration.days(45).toString()|`45.0d`|`45d`|
Duration.days(1.5).toString()|`36.0h`|`1d 12h`|
Duration.minutes(1230).toString()|`20.5h`|`20h 30m`|
Duration.minutes(2415).toString()|`40.3h`|`1d 16h 15m`|
Duration.minutes(920).toString()|`920m`|`15h 20m`|
Duration.seconds(1.546).toString()|`1.55s`|`1.546s`|
Duration.milliseconds(25.12).toString()|`25.1ms`|`25.12ms`|

負時長的表示方式也已更改。負時長會冠以負號（`-`），如果它由多個組件組成，則會用圓括號括起來：`-12m` 和 `-(1h 30m)`。

請注意，小於一秒的小時長會以單一數字搭配其中一個亞秒單位表示。例如，`ms`（毫秒）、`us`（微秒）或 `ns`（奈秒）：`140.884ms`、`500us`、`24ns`。科學記號不再用於表示它們。

如果您想以單一單位表示時長，請使用多載的 `Duration.toString(unit, decimals)` 函式。

> 我們建議在某些情況下使用 [`Duration.toIsoString()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/-duration/to-iso-string.html)，包括序列化和交換。`Duration.toIsoString()` 使用更嚴格的 [ISO-8601](https://www.iso.org/iso-8601-date-and-time-format.html) 格式，而非 `Duration.toString()`。
>
{style="note"}

### 從字串解析 Duration

> Duration API 目前處於 [實驗性](components-stability.md) 階段。它隨時可能被捨棄或更改。
> 請僅出於評估目的使用它。我們歡迎您在 [此問題](https://github.com/Kotlin/KEEP/issues/190) 提供回饋。
>
{style="warning"}

在 Kotlin 1.5.30 的 Duration API 中有新函式：
* [`parse()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/-duration/parse.html)，支援解析以下函式的輸出：
    * [`toString()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/-duration/to-string.html)。
    * [`toString(unit, decimals)`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/-duration/to-string.html)。
    * [`toIsoString()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/-duration/to-iso-string.html)。
* [`parseIsoString()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/-duration/parse-iso-string.html)，僅解析由 `toIsoString()` 產生的格式。
* [`parseOrNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/-duration/parse-or-null.html) 和 [`parseIsoStringOrNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/-duration/parse-iso-string-or-null.html)，其行為與上述函式相似，但在時長格式無效時回傳 `null` 而非拋出 `IllegalArgumentException`。

以下是 `parse()` 和 `parseOrNull()` 的使用範例：

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
    //println(Duration.parse(invalidFormatString)) // 拋出例外
    println(Duration.parseOrNull(invalidFormatString)) // "null"
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.5" validate="false"}

以下是 `parseIsoString()` 和 `parseIsoStringOrNull()` 的使用範例：

```kotlin
import kotlin.time.Duration
import kotlin.time.ExperimentalTime

@ExperimentalTime
fun main() {
//sampleStart
    val isoFormatString = "PT1H30M"
    val defaultFormatString = "1h 30m"
    println(Duration.parseIsoString(isoFormatString)) // "1h 30m"
    //println(Duration.parseIsoString(defaultFormatString)) // 拋出例外
    println(Duration.parseIsoStringOrNull(defaultFormatString)) // "null"
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.5" validate="false"}

### 在特定位置使用 Regex 進行配對

> `Regex.matchAt()` 和 `Regex.matchesAt()` 函式目前處於 [實驗性](components-stability.md) 階段。它們隨時可能被捨棄或更改。
> 請僅出於評估目的使用它們。我們歡迎您在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-34021) 提供回饋。
>
{style="warning"}

新的 `Regex.matchAt()` 和 `Regex.matchesAt()` 函式提供了一種方式，用於檢查正規表示式在 `String` 或 `CharSequence` 的特定位置是否完全配對。

`matchesAt()` 回傳布林值結果：

```kotlin
fun main(){
//sampleStart
    val releaseText = "Kotlin 1.5.30 is released!"
    // 正規表示式：一個數字、點、一個數字、點、一或多個數字
    val versionRegex = "\\d[.]\\d[.]\\d+".toRegex()
    println(versionRegex.matchesAt(releaseText, 0)) // "false"
    println(versionRegex.matchesAt(releaseText, 7)) // "true"
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.5" validate="false"}

`matchAt()` 若找到配對則回傳該配對，否則回傳 `null`：

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

### 將 Regex 分割為序列

> `Regex.splitToSequence()` 和 `CharSequence.splitToSequence(Regex)` 函式目前處於 [實驗性](components-stability.md) 階段。它們隨時可能被捨棄或更改。
> 請僅出於評估目的使用它們。我們歡迎您在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-23351) 提供回饋。
>
{style="warning"}

新的 `Regex.splitToSequence()` 函式是 [`split()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/-regex/split.html) 的延遲（lazy）對應版本。它根據給定正規表示式的配對來分割字串，但將結果作為 [Sequence](sequences.md) 回傳，因此對該結果的所有操作都是延遲執行的。

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

`CharSequence` 也加入了類似的函式：

```kotlin
    val mixedColor = colorsText.splitToSequence(regex)
```
{kotlin-runnable="false"}

## Serialization 1.3.0-RC

`kotlinx.serialization` [1.3.0-RC](https://github.com/Kotlin/kotlinx.serialization/releases/tag/v1.3.0-RC) 已經發佈，帶來了新的 JSON 序列化功能：
* Java IO 流序列化
* 屬性層級的預設值控制
* 排除序列化中 null 值的選項
* 多型序列化中的自訂類別鑑別器

在 [變更日誌](https://github.com/Kotlin/kotlinx.serialization/releases/tag/v1.3.0-RC) 中了解更多資訊。