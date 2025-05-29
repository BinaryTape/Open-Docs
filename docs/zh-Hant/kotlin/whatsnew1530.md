[//]: # (title: Kotlin 1.5.30 的新功能)

_[發布日期：2021 年 8 月 24 日](releases.md#release-details)_

Kotlin 1.5.30 提供了語言更新，包括未來變更的預覽、平台支援和工具方面的各種改進，以及新的標準函式庫函數。

以下是一些主要改進：
* 語言功能，包括實驗性密封 (`sealed`) `when` 語句、選擇加入 (`opt-in`) 要求的變更等
* 對 Apple Silicon 的原生支援
* Kotlin/JS IR 後端達到 Beta 版
* 改進的 Gradle 外掛程式體驗

你也可以在[發布部落格文章](https://blog.jetbrains.com/kotlin/2021/08/kotlin-1-5-30-released/)和此影片中找到這些變更的簡短概覽：

<video src="https://www.youtube.com/v/rNbb3A9IdOo" title="Kotlin 1.5.30"/>

## 語言功能

Kotlin 1.5.30 正在展示未來語言變更的預覽，並改進了選擇加入 (`opt-in`) 要求機制和類型推斷：
* [密封類 (`sealed`) 和布林主題的窮舉 (`exhaustive`) `when` 語句](#exhaustive-when-statements-for-sealed-and-boolean-subjects)
* [將暫停函數作為父類型 (`supertypes`)](#suspending-functions-as-supertypes)
* [要求對實驗性 API 的隱式使用進行選擇加入 (`opt-in`)](#requiring-opt-in-on-implicit-usages-of-experimental-apis)
* [帶有不同目標 (`targets`) 的選擇加入要求註解的使用變更](#changes-to-using-opt-in-requirement-annotations-with-different-targets)
* [遞迴泛型類型 (`recursive generic types`) 的類型推斷改進](#improvements-to-type-inference-for-recursive-generic-types)
* [消除建構器推斷 (`builder inference`) 限制](#eliminating-builder-inference-restrictions)

### 密封類 (`sealed`) 和布林主題的窮舉 (`exhaustive`) `when` 語句

> 對於密封類 (`sealed`) (窮舉 (`exhaustive`)) `when` 語句的支援是[實驗性](components-stability.md)的。它可能隨時被取消或更改。
> 需要選擇加入 (`opt-in`) (詳情見下)，你應僅將其用於評估目的。我們非常感謝你在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-12380) 上提供回饋。
>
{style="warning"}

一個_窮舉 (`exhaustive`)_ [`when`](control-flow.md#when-expressions-and-statements) 語句包含其主題所有可能類型或值的分支，或者包含某些類型的分支並包括一個 `else` 分支以涵蓋任何剩餘情況。

我們計劃很快禁止非窮舉 (`non-exhaustive`) 的 `when` 語句，以使行為與 `when` 表達式保持一致。為確保順利遷移，你可以配置編譯器報告關於帶有密封類或布林類型的非窮舉 `when` 語句的警告。這些警告將在 Kotlin 1.6 中預設出現，並在稍後成為錯誤。

> 列舉 (`Enums`) 已經會收到警告。
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
// 警告：對於密封類/介面的非窮舉 'when' 語句 
// 將在 1.7 中被禁止，請改為添加 'OFF' 或 'else' 分支

    val y: Boolean = true
    when (y) {  
        true -> println("true")
    }
// 警告：對於布林值的非窮舉 'when' 語句將被禁止 
// 在 1.7 中，請改為添加 'false' 或 'else' 分支
}
```

要在 Kotlin 1.5.30 中啟用此功能，請使用語言版本 `1.6`。你也可以透過啟用[漸進模式](whatsnew13.md#progressive-mode)將警告變更為錯誤。

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

### 將暫停函數作為父類型 (`supertypes`)

> 將暫停函數作為父類型 (`supertypes`) 的支援是[實驗性](components-stability.md)的。它可能隨時被取消或更改。
> 需要選擇加入 (`opt-in`) (詳情見下)，你應僅將其用於評估目的。我們非常感謝你在 [YouTrack](https://youtrack.com/issue/KT-18707) 上提供回饋。
>
{style="warning"}

Kotlin 1.5.30 提供了將 `suspend` 函數類型 (`functional type`) 作為父類型 (`supertype`) 使用的預覽功能，帶有一些限制。

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

此功能有以下限制：
* 你不能將普通函數類型和 `suspend` 函數類型混合作為父類型 (`supertype`)。這是因為 `suspend` 函數類型在 JVM 後端 (`JVM backend`) 中的實作細節所致。它們在其中被表示為帶有標記介面 (`marker interface`) 的普通函數類型。由於標記介面，無法區分哪些父介面是暫停的，哪些是普通的。
* 你不能使用多個 `suspend` 函數父類型。如果存在類型檢查，你也不能使用多個普通函數父類型。

### 要求對實驗性 API 的隱式使用進行選擇加入 (`opt-in`)

> 選擇加入 (`opt-in`) 要求機制是[實驗性](components-stability.md)的。
> 它可能隨時變更。[請參閱如何選擇加入](opt-in-requirements.md)。
> 僅將其用於評估目的。我們非常感謝你在 [YouTrack](https://youtrack.jetbrains.com/issues/KT) 上提供回饋。
>
{style="warning"}

函式庫的作者可以將實驗性 API 標記為[要求選擇加入](opt-in-requirements.md#create-opt-in-requirement-annotations)，以告知用戶其實驗狀態。當 API 被使用時，編譯器會發出警告或錯誤，並要求[明確同意](opt-in-requirements.md#opt-in-to-api)才能抑制它。

在 Kotlin 1.5.30 中，編譯器將簽名中包含實驗性類型的任何宣告視為實驗性。也就是說，即使是實驗性 API 的隱式使用，它也要求選擇加入 (`opt-in`)。例如，如果函數的回傳類型 (`return type`) 被標記為實驗性 API 元素，即使宣告未明確標記為要求選擇加入 (`opt-in`)，使用該函數也需要你選擇加入 (`opt-in`)。

```kotlin
// 函式庫程式碼

@RequiresOptIn(message = "This API is experimental.")
@Retention(AnnotationRetention.BINARY)
@Target(AnnotationTarget.CLASS)
annotation class MyDateTime // 選擇加入要求註解

@MyDateTime
class DateProvider // 需要選擇加入的類別

// 用戶端程式碼

// 警告：實驗性 API 使用
fun createDateSource(): DateProvider { /* ... */ }

fun getDate(): Date {
    val dateSource = createDateSource() // 再次警告：實驗性 API 使用
    // ... 
}
```

了解更多關於[選擇加入要求](opt-in-requirements.md)的資訊。

### 帶有不同目標 (`targets`) 的選擇加入要求註解的使用變更

> 選擇加入 (`opt-in`) 要求機制是[實驗性](components-stability.md)的。
> 它可能隨時變更。[請參閱如何選擇加入](opt-in-requirements.md)。
> 僅將其用於評估目的。我們非常感謝你在 [YouTrack](https://youtrack.jetbrains.com/issues/KT) 上提供回饋。
>
{style="warning"}

Kotlin 1.5.30 提出了關於在不同[目標](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.annotation/-target/)上使用和宣告選擇加入 (`opt-in`) 要求註解的新規則。對於在編譯時處理不切實際的用例，編譯器現在會報告錯誤。在 Kotlin 1.5.30 中：
* 在使用現場禁止使用選擇加入 (`opt-in`) 要求註解標記局部變數 (`local variables`) 和值參數 (`value parameters`)。
* 僅當其基本宣告也被標記時，才允許標記覆寫 (`override`)。
* 禁止標記支援欄位 (`backing fields`) 和 getter。你可以改為標記基本屬性 (`basic property`)。
* 在選擇加入 (`opt-in`) 要求註解宣告現場禁止設定 `TYPE` 和 `TYPE_PARAMETER` 註解目標 (`annotation targets`)。

了解更多關於[選擇加入要求](opt-in-requirements.md)的資訊。

### 遞迴泛型類型 (`recursive generic types`) 的類型推斷改進

在 Kotlin 和 Java 中，你可以定義一種遞迴泛型類型 (`recursive generic type`)，它在其類型參數 (`type parameters`) 中引用自身。在 Kotlin 1.5.30 中，如果類型參數是遞迴泛型的，Kotlin 編譯器可以僅根據相應類型參數的上限 (`upper bounds`) 來推斷類型參數 (`type argument`)。這使得使用遞迴泛型類型建立各種模式成為可能，這在 Java 中常用於建立建構器 API (`builder APIs`)。

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

你可以透過傳遞 `-Xself-upper-bound-inference` 或 `-language-version 1.6` 編譯器選項來啟用這些改進。在[此 YouTrack 票證](https://youtrack.jetbrains.com/issue/KT-40804)中查看新支援用例的其他範例。

### 消除建構器推斷 (`builder inference`) 限制

建構器推斷 (`Builder inference`) 是一種特殊類型的類型推斷，它允許你根據其 lambda 參數中其他呼叫的類型資訊來推斷呼叫的類型參數 (`type arguments`)。這在呼叫泛型建構器函數，例如 [`buildList()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/build-list.html) 或 [`sequence()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.sequences/sequence.html) 時非常有用：`buildList { add("string") }`。

在這種 lambda 參數內部，以前對使用建構器推斷 (`builder inference`) 嘗試推斷的類型資訊存在限制。這意味著你只能指定它，而不能獲取它。例如，如果沒有明確指定類型參數 (`type arguments`)，你不能在 `buildList()` 的 lambda 參數內部呼叫 [`get()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-list/get.html)。

Kotlin 1.5.30 透過 `-Xunrestricted-builder-inference` 編譯器選項移除了這些限制。添加此選項以啟用以前在泛型建構器函數的 lambda 參數中被禁止的呼叫：

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

此外，你可以使用 `-language-version 1.6` 編譯器選項啟用此功能。

## Kotlin/JVM

在 Kotlin 1.5.30 中，Kotlin/JVM 獲得了以下功能：
* [註解類別 (`annotation classes`) 的實例化](#instantiation-of-annotation-classes)
* [改進的空值註解 (`nullability annotation`) 支援配置](#improved-nullability-annotation-support-configuration)

請參閱 [Gradle](#gradle) 部分，了解 JVM 平台上 Kotlin Gradle 外掛程式的更新。

### 註解類別 (`annotation classes`) 的實例化

> 註解類別 (`annotation classes`) 的實例化是[實驗性](components-stability.md)的。它可能隨時被取消或更改。
> 需要選擇加入 (`opt-in`) (詳情見下)，你應僅將其用於評估目的。我們非常感謝你在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-45395) 上提供回饋。
>
{style="warning"}

在 Kotlin 1.5.30 中，你現在可以在任意程式碼中呼叫[註解類別](annotations.md)的建構函式 (`constructors`)，以獲取結果實例 (`resulting instance`)。此功能涵蓋了與允許實作註解介面 (`annotation interface`) 的 Java 約定 (`Java convention`) 相同的用例。

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

使用 `-language-version 1.6` 編譯器選項啟用此功能。請注意，所有當前的註解類別限制，例如定義非 `val` 參數或與次級建構函式 (`secondary constructors`) 不同的成員的限制，均保持不變。

在[此 KEEP](https://github.com/Kotlin/KEEP/blob/master/proposals/annotation-instantiation.md) 中了解更多關於註解類別實例化的資訊。

### 改進的空值註解 (`nullability annotation`) 支援配置

Kotlin 編譯器可以讀取各種[空值註解](java-interop.md#nullability-annotations)類型，以從 Java 中獲取空值資訊 (`nullability information`)。此資訊允許它在呼叫 Java 程式碼時報告 Kotlin 中的空值不匹配 (`nullability mismatches`)。

在 Kotlin 1.5.30 中，你可以根據特定類型空值註解的資訊來指定編譯器是否報告空值不匹配。只需使用編譯器選項 `-Xnullability-annotations=@<package-name>:<report-level>`。在參數中，指定完全限定的空值註解套件和以下其中一個報告級別 (`report levels`)：
* `ignore` 以忽略空值不匹配
* `warn` 以報告警告
* `strict` 以報告錯誤。

請參閱[支援的空值註解完整列表](java-interop.md#nullability-annotations)及其完全限定的套件名稱。

以下是顯示如何為新支援的 [RxJava](https://github.com/ReactiveX/RxJava) 3 空值註解啟用錯誤報告的範例：`-Xnullability-annotations=@io.reactivex.rxjava3.annotations:strict`。請注意，所有此類空值不匹配預設都是警告。

## Kotlin/Native

Kotlin/Native 收到各種變更和改進：
* [Apple Silicon 支援](#apple-silicon-support)
* [CocoaPods Gradle 外掛程式的 Kotlin DSL 改進](#improved-kotlin-dsl-for-the-cocoapods-gradle-plugin)
* [與 Swift 5.5 async/await 的實驗性互通性 (`interoperability`)](#experimental-interoperability-with-swift-5-5-async-await)
* [物件 (`objects`) 和伴隨物件 (`companion objects`) 的 Swift/Objective-C 映射改進](#improved-swift-objective-c-mapping-for-objects-and-companion-objects)
* [針對 MinGW 目標棄用無需導入庫 (`import libraries`) 的 DLL 鏈接 (`linkage`)](#deprecation-of-linkage-against-dlls-without-import-libraries-for-mingw-targets)

### Apple Silicon 支援

Kotlin 1.5.30 引入了對 [Apple Silicon](https://support.apple.com/en-us/HT211814) 的原生支援。

此前，Kotlin/Native 編譯器和工具需要在 [Rosetta 翻譯環境](https://developer.apple.com/documentation/apple-silicon/about-the-rosetta-translation-environment)下才能在 Apple Silicon 主機上運行。在 Kotlin 1.5.30 中，不再需要翻譯環境 – 編譯器和工具可以在 Apple Silicon 硬體上運行，無需任何額外操作。

我們還引入了新的目標 (`targets`)，使 Kotlin 程式碼可以在 Apple Silicon 上原生運行：
* `macosArm64`
* `iosSimulatorArm64`
* `watchosSimulatorArm64`
* `tvosSimulatorArm64`

它們在基於 Intel 和 Apple Silicon 的主機上都可用。所有現有目標 (`targets`) 也都可以在 Apple Silicon 主機上使用。

請注意，在 1.5.30 中，我們僅在 `kotlin-multiplatform` Gradle 外掛程式中為 Apple Silicon 目標 (`targets`) 提供基本支援。特別是，新的模擬器目標 (`simulator targets`) 不包含在 `ios`、`tvos` 和 `watchos` 目標快捷方式中。我們將繼續努力改進新目標 (`targets`) 的用戶體驗。

### CocoaPods Gradle 外掛程式的 Kotlin DSL 改進

#### Kotlin/Native 框架的新參數

Kotlin 1.5.30 引入了改進的 CocoaPods Gradle 外掛程式 DSL，用於 Kotlin/Native 框架 (`frameworks`)。除了框架名稱外，你可以在 Pod 配置中指定其他參數：
* 指定框架的動態或靜態版本
* 明確啟用依賴項導出
* 啟用 Bitcode 嵌入

要使用新的 DSL，請將你的專案更新到 Kotlin 1.5.30，並在 `build.gradle(.kts)` 檔案的 `cocoapods` 部分指定參數：

```kotlin
cocoapods {
    frameworkName = "MyFramework" // 此屬性已棄用 
    // 並將在未來版本中移除
    // 框架配置的新 DSL：
    framework {
        // 支援所有框架屬性
        // 框架名稱配置。請使用此屬性取代 
        // 已棄用的 'frameworkName'
        baseName = "MyFramework"
        // 動態框架支援
        isStatic = false
        // 依賴項導出
        export(project(":anotherKMMModule"))
        transitiveExport = false // 這是預設值。
        // Bitcode 嵌入
        embedBitcode(BITCODE)
    }
}
```

#### 支援 Xcode 配置的自訂名稱

Kotlin CocoaPods Gradle 外掛程式支援 Xcode 建置配置中的自訂名稱。如果你在 Xcode 中為建置配置使用特殊名稱，例如 `Staging`，它也會提供幫助。

要指定自訂名稱，請在 `build.gradle(.kts)` 檔案的 `cocoapods` 部分使用 `xcodeConfigurationToNativeBuildType` 參數：

```groovy
cocoapods {
    // 將自訂 Xcode 配置映射到 NativeBuildType
    xcodeConfigurationToNativeBuildType["CUSTOM_DEBUG"] = NativeBuildType.DEBUG
    xcodeConfigurationToNativeBuildType["CUSTOM_RELEASE"] = NativeBuildType.RELEASE
}
```

此參數不會出現在 Podspec 檔案中。當 Xcode 運行 Gradle 建置過程時，Kotlin CocoaPods Gradle 外掛程式將選擇必要的原生建置類型。

> 無需宣告 `Debug` 和 `Release` 配置，因為它們預設受支援。
>
{style="note"}

### 與 Swift 5.5 async/await 的實驗性互通性 (`interoperability`)

> 與 Swift async/await 的並行互通性 (`Concurrency interoperability`) 是[實驗性](components-stability.md)的。它可能隨時被取消或更改。
> 你應僅將其用於評估目的。我們非常感謝你在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-47610) 上提供回饋。
>
{style="warning"}

我們在 1.4.0 中添加了[從 Objective-C 和 Swift 呼叫 Kotlin 暫停函數的支援](whatsnew14.md#support-for-kotlin-s-suspending-functions-in-swift-and-objective-c)，現在我們正在改進它，以跟上 Swift 5.5 的新功能 – [帶有 `async` 和 `await` 修飾符的並行](https://github.com/apple/swift-evolution/blob/main/proposals/0296-async-await.md)。

Kotlin/Native 編譯器現在會為帶有可空回傳類型 (`nullable return types`) 的暫停函數在生成的 Objective-C 頭文件 (`headers`) 中發出 `_Nullable_result` 屬性。這使得可以將它們從 Swift 呼叫為帶有適當空值性 (`nullability`) 的 `async` 函數。

請注意，此功能是實驗性的，未來可能會受到 Kotlin 和 Swift 變更的影響。目前，我們提供此功能的預覽版，它具有某些限制，我們很樂意聽取你的意見。在[此 YouTrack 問題](https://youtrack.jetbrains.com/issue/KT-47610)中了解其當前狀態並留下你的回饋。

### 物件 (`objects`) 和伴隨物件 (`companion objects`) 的 Swift/Objective-C 映射改進

現在，獲取物件 (`objects`) 和伴隨物件 (`companion objects`) 的方式對於原生 iOS 開發者來說更加直觀。例如，如果你在 Kotlin 中有以下物件：

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

要在 Swift 中存取它們，你可以使用 `shared` 和 `companion` 屬性：

```swift
MyObject.shared
MyObject.shared.x
MyClass.companion
MyClass.Companion.shared
```

了解更多關於 [Swift/Objective-C 互通性 (`interoperability`)](native-objc-interop.md) 的資訊。

### 針對 MinGW 目標棄用無需導入庫 (`import libraries`) 的 DLL 鏈接 (`linkage`)

[LLD](https://lld.llvm.org/) 是一個來自 LLVM 專案的鏈接器 (`linker`)，我們計劃開始在 Kotlin/Native 中針對 MinGW 目標 (`targets`) 使用它，因為它相對於預設的 ld.bfd 有更好的優勢 – 主要是其更好的效能。

然而，最新穩定版的 LLD 不支援針對 MinGW (Windows) 目標 (`targets`) 的直接 DLL 鏈接 (`linkage`)。此類鏈接需要使用[導入庫](https://stackoverflow.com/questions/3573475/how-does-the-import-library-work-details/3573527#3573527)。儘管 Kotlin/Native 1.5.30 不需要它們，但我們正在添加一個警告，以告知你此類用法與 LLD 不相容，LLD 在未來將成為 MinGW 的預設鏈接器 (`linker`)。

請在[此 YouTrack 問題](https://youtrack.jetbrains.com/issue/KT-47605)中分享你對轉換到 LLD 鏈接器 (`linker`) 的想法和擔憂。

## Kotlin 多平台

1.5.30 為 Kotlin 多平台 (`Kotlin Multiplatform`) 帶來了以下顯著更新：
* [在共享原生程式碼中使用自訂 `cinterop` 庫的能力](#ability-to-use-custom-cinterop-libraries-in-shared-native-code)
* [支援 XCFrameworks](#support-for-xcframeworks)
* [Android Artifacts 的新預設發布設定](#new-default-publishing-setup-for-android-artifacts)

### 在共享原生程式碼中使用自訂 cinterop 庫的能力

Kotlin 多平台 (`Kotlin Multiplatform`) 為你提供了在共享源集 (`shared source sets`) 中使用平台相關互通庫 (`platform-dependent interop libraries`) 的[選項](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-share-on-platforms.html#connect-platform-specific-libraries)。在 1.5.30 之前，這僅適用於 Kotlin/Native 發行版隨附的[平台庫](native-platform-libs.md)。從 1.5.30 開始，你可以將其與自訂 `cinterop` 庫一起使用。要啟用此功能，請在你的 `gradle.properties` 中添加 `kotlin.mpp.enableCInteropCommonization=true` 屬性：

```none
kotlin.mpp.enableGranularSourceSetsMetadata=true
kotlin.native.enableDependencyPropagation=false
kotlin.mpp.enableCInteropCommonization=true
```

### 支援 XCFrameworks

所有 Kotlin 多平台 (`Kotlin Multiplatform`) 專案現在都可以將 XCFrameworks 作為輸出格式。Apple 引入 XCFrameworks 作為通用 (`universal`) (fat) 框架的替代品。藉助 XCFrameworks，你可以：
* 可以在單一捆綁包 (`bundle`) 中為所有目標平台和架構收集邏輯。
* 在將應用程式發布到 App Store 之前，無需移除所有不必要的架構。

如果你想在 Apple M1 上的裝置和模擬器上使用你的 Kotlin 框架，XCFrameworks 會很有用。

要使用 XCFrameworks，請更新你的 `build.gradle(.kts)` 腳本：

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

當你宣告 XCFrameworks 時，這些新的 Gradle 任務將會被註冊：
* `assembleXCFramework`
* `assembleDebugXCFramework` (此外還有包含 [dSYMs](native-ios-symbolication.md) 的偵錯 (`debug`) artifact)
* `assembleReleaseXCFramework`

在[此 WWDC 影片](https://developer.apple.com/videos/play/wwdc2019/416/)中了解更多關於 XCFrameworks 的資訊。

### Android Artifacts 的新預設發布設定

使用 `maven-publish` Gradle 外掛程式，你可以透過在建置腳本中指定 [Android 變體 (`variant`)](https://developer.android.com/studio/build/build-variants) 名稱來[為 Android 目標發布你的多平台函式庫](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-publish-lib-setup.html#publish-an-android-library)。Kotlin Gradle 外掛程式將自動生成發布。

在 1.5.30 之前，生成的發布[中繼資料 (`metadata`)](https://docs.gradle.org/current/userguide/publishing_gradle_module_metadata.html) 包含了每個已發布 Android 變體 (`variant`) 的建置類型屬性 (`build type attributes`)，使其僅與函式庫使用者使用的相同建置類型相容。Kotlin 1.5.30 引入了一種新的預設發布設定：
* 如果專案發布的所有 Android 變體 (`variant`) 都具有相同的建置類型屬性 (`build type attribute`)，則已發布的變體將不具有該建置類型屬性，並且將與任何建置類型相容。
* 如果已發布的變體具有不同的建置類型屬性 (`build type attributes`)，則只有那些帶有 `release` 值的變體將在沒有建置類型屬性的情況下發布。這使得 release 變體在使用者端與任何建置類型相容，而 `non-release` 變體將僅與匹配的使用者建置類型相容。

要選擇退出 (`opt-out`) 並保留所有變體 (`variant`) 的建置類型屬性 (`build type attributes`)，你可以設定此 Gradle 屬性：`kotlin.android.buildTypeAttribute.keep=true`。

## Kotlin/JS

Kotlin/JS 在 1.5.30 中帶來了兩項主要改進：
* [JS IR 編譯器後端達到 Beta 版](#js-ir-compiler-backend-reaches-beta)
* [使用 Kotlin/JS IR 後端的應用程式獲得更好的偵錯 (`debugging`) 體驗](#better-debugging-experience-for-applications-with-the-kotlin-js-ir-backend)

### JS IR 編譯器後端達到 Beta 版

Kotlin/JS 的[基於 IR 的編譯器後端 (`IR-based compiler backend`)](whatsnew14.md#unified-backends-and-extensibility)，於 1.4.0 中以 [Alpha](components-stability.md) 版引入，現已達到 Beta 版。

此前，我們發布了 [JS IR 後端遷移指南](js-ir-migration.md)，以幫助你將專案遷移到新後端。現在，我們想介紹 [Kotlin/JS Inspection Pack](https://plugins.jetbrains.com/plugin/17183-kotlin-js-inspection-pack/) IDE 外掛程式，它直接在 IntelliJ IDEA 中顯示所需的變更。

### 使用 Kotlin/JS IR 後端的應用程式獲得更好的偵錯 (`debugging`) 體驗

Kotlin 1.5.30 為 Kotlin/JS IR 後端帶來了 JavaScript 源映射生成 (`source map generation`)。這將在啟用 IR 後端時改善 Kotlin/JS 的偵錯 (`debugging`) 體驗，提供完整的偵錯支援，包括斷點 (`breakpoints`)、單步執行 (`stepping`) 和帶有適當源參考 (`source references`) 的可讀堆疊追蹤 (`stack traces`)。

了解如何在[瀏覽器或 IntelliJ IDEA Ultimate 中偵錯 Kotlin/JS](js-debugging.md)。

## Gradle

作為我們[改進 Kotlin Gradle 外掛程式用戶體驗](https://youtrack.jetbrains.com/issue/KT-45778)任務的一部分，我們實作了以下功能：
* [Java Toolchains 支援](#support-for-java-toolchains)，其中包括[為較舊的 Gradle 版本使用 `UsesKotlinJavaToolchain` 介面指定 JDK 主目錄的能力](#ability-to-specify-jdk-home-with-useskotlinjavatoolchain-interface)
* [更容易明確指定 Kotlin Daemon 的 JVM 參數的方法](#easier-way-to-explicitly-specify-kotlin-daemon-jvm-arguments)

### Java Toolchains 支援

Gradle 6.7 引入了["Java toolchains 支援"](https://docs.gradle.org/current/userguide/toolchains.html)功能。
使用此功能，你可以：
* 使用與 Gradle 不同的 JDK 和 JRE 運行編譯、測試和可執行文件。
* 使用未發布的語言版本編譯和測試程式碼。

透過 toolchains 支援，Gradle 可以自動偵測本地 JDK 並安裝建置所需的缺失 JDK。現在 Gradle 本身可以在任何 JDK 上運行，並且仍然可以重用[建置快取 (`build cache`) 功能](gradle-compilation-and-caches.md#gradle-build-cache-support)。

Kotlin Gradle 外掛程式支援 Kotlin/JVM 編譯任務的 Java toolchains。
Java toolchain：
* 設定可用於 JVM 目標的 [`jdkHome` 選項](gradle-compiler-options.md#attributes-specific-to-jvm)。
  > [直接設定 `jdkHome` 選項的功能已被棄用](https://youtrack.jetbrains.com/issue/KT-46541)。
  >
  {style="warning"}

* 如果用戶沒有明確設定 `jvmTarget` 選項，則將 [`kotlinOptions.jvmTarget`](gradle-compiler-options.md#attributes-specific-to-jvm) 設定為 toolchain 的 JDK 版本。
  如果未配置 toolchain，`jvmTarget` 欄位將使用預設值。了解更多關於 [JVM 目標相容性](gradle-configure-project.md#check-for-jvm-target-compatibility-of-related-compile-tasks)的資訊。

* 影響 [`kapt` 工作器](kapt.md#run-kapt-tasks-in-parallel) 在哪個 JDK 上運行。

使用以下程式碼設定 toolchain。將佔位符 `<MAJOR_JDK_VERSION>` 替換為你希望使用的 JDK 版本：

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

請注意，透過 `kotlin` 擴充功能設定 toolchain 也將更新 Java 編譯任務的 toolchain。

你可以透過 `java` 擴充功能設定 toolchain，Kotlin 編譯任務將使用它：

```kotlin
java {
    toolchain {
        languageVersion.set(JavaLanguageVersion.of(<MAJOR_JDK_VERSION>)) // "8"
    }
}
```

有關為 `KotlinCompile` 任務設定任何 JDK 版本的資訊，請查閱關於[使用任務 DSL 設定 JDK 版本](gradle-configure-project.md#set-jdk-version-with-the-task-dsl)的文檔。

對於 Gradle 6.1 到 6.6 版本，請[使用 `UsesKotlinJavaToolchain` 介面設定 JDK 主目錄](#ability-to-specify-jdk-home-with-useskotlinjavatoolchain-interface)。

### 使用 UsesKotlinJavaToolchain 介面指定 JDK 主目錄的能力

所有透過 [`kotlinOptions`](gradle-compiler-options.md) 支援設定 JDK 的 Kotlin 任務現在都實作了 `UsesKotlinJavaToolchain` 介面。要設定 JDK 主目錄，請填寫你的 JDK 路徑並替換佔位符 `<JDK_VERSION>`：

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

對於 Gradle 6.1 到 6.6 版本，請使用 `UsesKotlinJavaToolchain` 介面。從 Gradle 6.7 開始，請改用 [Java toolchains](#support-for-java-toolchains)。

使用此功能時，請注意 [`kapt` 任務工作器](kapt.md#run-kapt-tasks-in-parallel) 將僅使用[程序隔離模式 (`process isolation mode`)](https://docs.gradle.org/current/userguide/worker_api.html#changing_the_isolation_mode)，並且 `kapt.workers.isolation` 屬性將被忽略。

### 更容易明確指定 Kotlin Daemon JVM 參數的方法

在 Kotlin 1.5.30 中，Kotlin Daemon 的 JVM 參數有了新的邏輯。以下列表中的每個選項都會覆蓋其之前的選項：

* 如果未指定任何內容，Kotlin Daemon 會從 Gradle Daemon 繼承參數（與之前相同）。例如，在 `gradle.properties` 檔案中：

    ```none
    org.gradle.jvmargs=-Xmx1500m -Xms=500m
    ```

* 如果 Gradle Daemon 的 JVM 參數具有 `kotlin.daemon.jvm.options` 系統屬性，請像以前一樣使用它：

    ```none
    org.gradle.jvmargs=-Dkotlin.daemon.jvm.options=-Xmx1500m -Xms=500m
    ```

* 你可以在 `gradle.properties` 檔案中添加 `kotlin.daemon.jvmargs` 屬性：

    ```none
    kotlin.daemon.jvmargs=-Xmx1500m -Xms=500m
    ```

* 你可以在 `kotlin` 擴充功能中指定參數：

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

* 你可以為特定任務指定參數：

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

    > 在這種情況下，在任務執行時可能會啟動新的 Kotlin Daemon 實例。了解更多關於[Kotlin Daemon 與 JVM 參數的互動](gradle-compilation-and-caches.md#setting-kotlin-daemon-s-jvm-arguments)的資訊。
    >
    {style="note"}

有關 Kotlin Daemon 的更多資訊，請參閱[Kotlin Daemon 及其與 Gradle 的使用](gradle-compilation-and-caches.md#the-kotlin-daemon-and-how-to-use-it-with-gradle)。

## 標準函式庫

Kotlin 1.5.30 正在為標準函式庫的 `Duration` 和 `Regex` API 帶來改進：
* [變更 `Duration.toString()` 輸出](#changing-duration-tostring-output)
* [從字串解析 Duration](#parsing-duration-from-string)
* [在特定位置使用 Regex 進行匹配](#matching-with-regex-at-a-particular-position)
* [將 Regex 分割成序列](#splitting-regex-to-a-sequence)

### 變更 Duration.toString() 輸出

> Duration API 是[實驗性](components-stability.md)的。它可能隨時被取消或更改。
> 僅將其用於評估目的。我們非常感謝你在 [YouTrack](https://youtrack.jetbrains.com/issues/KT) 上提供回饋。
>
{style="warning"}

在 Kotlin 1.5.30 之前，[`Duration.toString()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/-duration/to-string.html) 函數會回傳其參數的字串表示，以產生最緊湊和可讀數值的單位表示。
從現在開始，它將回傳一個字串值，表示為數字組件的組合，每個組件都有自己的單位。
每個組件是一個數字，後跟單位的縮寫名稱：`d`、`h`、`m`、`s`。例如：

|**函數呼叫範例**|**舊輸出**|**當前輸出**|
| --- | --- | --- |
Duration.days(45).toString()|`45.0d`|`45d`|
Duration.days(1.5).toString()|`36.0h`|`1d 12h`|
Duration.minutes(1230).toString()|`20.5h`|`20h 30m`|
Duration.minutes(2415).toString()|`40.3h`|`1d 16h 15m`|
Duration.minutes(920).toString()|`920m`|`15h 20m`|
Duration.seconds(1.546).toString()|`1.55s`|`1.546s`|
Duration.milliseconds(25.12).toString()|`25.1ms`|`25.12ms`|

負時長 (`negative durations`) 的表示方式也發生了變化。負時長以負號 (`-`) 為前綴，如果它由多個組件組成，則用括號括起來：`-12m` 和 `-(1h 30m)`。

請注意，小於一秒的短時長 (`small durations`) 會表示為一個單一數字，帶有其中一個亞秒單位 (`subsecond units`)。例如，`ms`（毫秒）、`us`（微秒）或 `ns`（奈秒）：`140.884ms`、`500us`、`24ns`。科學記號 (`Scientific notation`) 不再用於表示它們。

如果你想以單一單位表示時長，請使用重載的 `Duration.toString(unit, decimals)` 函數。

> 我們建議在某些情況下使用 [`Duration.toIsoString()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/-duration/to-iso-string.html)，包括序列化 (`serialization`) 和交換 (`interchange`)。`Duration.toIsoString()` 使用更嚴格的 [ISO-8601](https://www.iso.org/iso-8601-date-and-time-format.html) 格式，而非 `Duration.toString()`。
>
{style="note"}

### 從字串解析 Duration

> Duration API 是[實驗性](components-stability.md)的。它可能隨時被取消或更改。
> 僅將其用於評估目的。我們非常感謝你在[此問題](https://github.com/Kotlin/KEEP/issues/190)上提供回饋。
>
{style="warning"}

在 Kotlin 1.5.30 中，Duration API 中有新函數：
* [`parse()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/-duration/parse.html)，支援解析以下輸出：
    * [`toString()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/-duration/to-string.html)。
    * [`toString(unit, decimals)`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/-duration/to-string.html)。
    * [`toIsoString()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/-duration/to-iso-string.html)。
* [`parseIsoString()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/-duration/parse-iso-string.html)，它只從 `toIsoString()` 產生的格式中解析。
* [`parseOrNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/-duration/parse-or-null.html) 和 [`parseIsoStringOrNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/-duration/parse-iso-string-or-null.html)，它們的行為與上述函數類似，但在無效時長格式上會回傳 `null` 而不是拋出 `IllegalArgumentException`。

以下是一些 `parse()` 和 `parseOrNull()` 用法的範例：

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

以下是一些 `parseIsoString()` 和 `parseIsoStringOrNull()` 用法的範例：

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

### 在特定位置使用 Regex 進行匹配

> `Regex.matchAt()` 和 `Regex.matchesAt()` 函數是[實驗性](components-stability.md)的。它們可能隨時被取消或更改。
> 僅將其用於評估目的。我們非常感謝你在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-34021) 上提供回饋。
>
{style="warning"}

新的 `Regex.matchAt()` 和 `Regex.matchesAt()` 函數提供了一種方法，用於檢查正規表達式 (`regex`) 是否在 `String` 或 `CharSequence` 中的特定位置有精確匹配 (`exact match`)。

`matchesAt()` 回傳一個布林 (`boolean`) 結果：

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

`matchAt()` 如果找到匹配則回傳匹配項，如果找不到則回傳 `null`：

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

### 將 Regex 分割成序列 (`sequence`)

> `Regex.splitToSequence()` 和 `CharSequence.splitToSequence(Regex)` 函數是[實驗性](components-stability.md)的。它們可能隨時被取消或更改。
> 僅將其用於評估目的。我們非常感謝你在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-23351) 上提供回饋。
>
{style="warning"}

新的 `Regex.splitToSequence()` 函數是 [`split()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/-regex/split.html) 的惰性對應 (`lazy counterpart`)。它根據給定正規表達式 (`regex`) 的匹配項來分割字串，但它將結果作為 [Sequence](sequences.md) 回傳，以便所有對此結果的操作都以惰性方式執行。

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

類似的函數也已添加到 `CharSequence`：

```kotlin
    val mixedColor = colorsText.splitToSequence(regex)
```
{kotlin-runnable="false"}

## 序列化 1.3.0-RC

`kotlinx.serialization` [1.3.0-RC](https://github.com/Kotlin/kotlinx.serialization/releases/tag/v1.3.0-RC) 帶來了新的 JSON 序列化功能：
* Java IO 流序列化
* 屬性級別的預設值控制
* 從序列化 (`serialization`) 中排除空值的選項
* 多態序列化中的自訂類別鑑別器

在[變更日誌](https://github.com/Kotlin/kotlinx.serialization/releases/tag/v1.3.0-RC)中了解更多。
<!-- and the [kotlinx.serialization 1.3.0 release blog post](TODO). -->