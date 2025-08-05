[//]: # (title: Kotlin 1.4.20 有什麼新功能)

_[發佈日期：2020 年 11 月 23 日](releases.md#release-details)_

Kotlin 1.4.20 提供多項新的實驗性功能，並對現有功能（包括 1.4.0 中新增的功能）進行了修正與改進。

您也可以透過 [這篇部落格文章](https://blog.jetbrains.com/kotlin/2020/11/kotlin-1-4-20-released/) 了解更多帶有範例的新功能。

## Kotlin/JVM

Kotlin/JVM 的改進旨在使其與現代 Java 版本的特性保持同步：

- [Java 15 目標](#java-15-target)
- [invokedynamic 字串串接](#invokedynamic-string-concatenation)

### Java 15 目標

現在 Java 15 可作為 Kotlin/JVM 的目標版本。

### invokedynamic 字串串接

> `invokedynamic` 字串串接為 [實驗性](components-stability.md) 功能。它可能隨時被移除或變更。需要明確啟用（詳情請見下文）。僅用於評估目的。我們非常感謝您在 [YouTrack](https://youtrack.jetbrains.com/issues/KT) 上提供關於此功能的意見回饋。
>
{style="warning"}

Kotlin 1.4.20 可以在 JVM 9+ 目標上將字串串接編譯成 [動態呼叫](https://docs.oracle.com/javase/7/docs/technotes/guides/vm/multiple-language-support.html#invokedynamic)，因此提升了效能。

目前，此功能為實驗性，涵蓋以下情況：
- `String.plus` 在運算子 (`a + b`)、明確 (`a.plus(b)`) 和參考 (`(a::plus)(b)`) 形式中的使用。
- 內聯類別與資料類別上的 `toString`。
- 字串樣板，但單一非常數引數的樣板除外（請參見 [KT-42457](https://youtrack.jetbrains.com/issue/KT-42457)）。

若要啟用 `invokedynamic` 字串串接，請新增 `-Xstring-concat` 編譯器選項並指定以下其中一個值：
- `indy-with-constants`：使用 [StringConcatFactory.makeConcatWithConstants()](https://docs.oracle.com/javase/9/docs/api/java/lang/invoke/StringConcatFactory.html#makeConcatWithConstants-java.lang.invoke.MethodHandles.Lookup-java.lang.String-java.lang.invoke.MethodType-java.lang.String-java.lang.Object...-) 對字串執行 `invokedynamic` 串接。
- `indy`：使用 [StringConcatFactory.makeConcat()](https://docs.oracle.com/javase/9/docs/api/java/lang/invoke/StringConcatFactory.html#makeConcat-java.lang.invoke.MethodHandles.Lookup-java.lang.String-java.lang.invoke.MethodType-) 對字串執行 `invokedynamic` 串接。
- `inline`：切換回透過 `StringBuilder.append()` 進行的傳統串接。

## Kotlin/JS

Kotlin/JS 繼續快速發展，在 1.4.20 中您可以找到多項實驗性功能與改進：

- [Gradle DSL 變更](#gradle-dsl-changes)
- [新的精靈範本](#new-wizard-templates)
- [IR 編譯器忽略編譯錯誤](#ignoring-compilation-errors-with-ir-compiler)

### Gradle DSL 變更

Kotlin/JS 的 Gradle DSL 收到多項更新，這些更新簡化了專案設定與自訂。這包括 webpack 配置調整、自動生成 `package.json` 檔案的修改，以及對傳遞依賴項的改進控制。

#### 單一 webpack 配置點

瀏覽器目標新增了 `commonWebpackConfig` 配置區塊。在其中，您可以從單一位置調整通用設定，而無需為 `webpackTask`、`runTask` 和 `testTask` 重複配置。

若要預設為所有三個任務啟用 CSS 支援，請在專案的 `build.gradle(.kts)` 中新增以下程式碼片段：

```groovy
browser {
    commonWebpackConfig {
        cssSupport.enabled = true
    }
    binaries.executable()
}
```

了解更多關於 [配置 webpack 打包](js-project-setup.md#webpack-bundling) 的資訊。

#### 從 Gradle 自訂 package.json

為了更好地控制您的 Kotlin/JS 套件管理與分發，您現在可以透過 Gradle DSL 向專案檔案 [`package.json`](https://nodejs.dev/learn/the-package-json-guide) 新增屬性。

若要為您的 `package.json` 新增自訂欄位，請在編譯的 `packageJson` 區塊中使用 `customField` 函式：

```kotlin
kotlin {
    js(BOTH) {
        compilations["main"].packageJson {
            customField("hello", mapOf("one" to 1, "two" to 2))
        }
    }
}
```

了解更多關於 [`package.json` 自訂](js-project-setup.md#package-json-customization) 的資訊。

#### Yarn 選擇性依賴項解析

> 對 Yarn 選擇性依賴項解析的支援是 [實驗性](components-stability.md) 功能。它可能隨時被移除或變更。僅用於評估目的。我們非常感謝您在 [YouTrack](https://youtrack.jetbrains.com/issues/KT) 上提供關於此功能的意見回饋。
>
{style="warning"}

Kotlin 1.4.20 提供了一種配置 Yarn [選擇性依賴項解析](https://classic.yarnpkg.com/en/docs/selective-version-resolutions/) 的方式——該機制用於覆寫您所依賴套件的依賴項。

您可以透過 Gradle 中 `YarnPlugin` 內部的 `YarnRootExtension` 來使用它。若要影響專案的套件解析版本，請使用 `resolution` 函式並傳入套件名稱選擇器（由 Yarn 指定）和應解析到的版本。

```kotlin
rootProject.plugins.withType<YarnPlugin> {
    rootProject.the<YarnRootExtension>().apply {
        resolution("react", "16.0.0")
        resolution("processor/decamelize", "3.0.0")
    }
}
```

在這裡，所有需要 `react` 的 npm 依賴項都將收到 `16.0.0` 版本，而 `processor` 將收到其依賴項 `decamelize` 的 `3.0.0` 版本。

#### 停用細粒度工作區

> 停用細粒度工作區是 [實驗性](components-stability.md) 功能。它可能隨時被移除或變更。僅用於評估目的。我們非常感謝您在 [YouTrack](https://youtrack.jetbrains.com/issues/KT) 上提供關於此功能的意見回饋。
>
{style="warning"}

為了加速建置時間，Kotlin/JS Gradle 外掛程式只安裝特定 Gradle 任務所需的依賴項。例如，`webpack-dev-server` 套件僅在您執行 `*Run` 任務之一時安裝，而不是在您執行組裝任務時。這種行為在您並行執行多個 Gradle 處理程序時可能帶來問題。當依賴項需求衝突時，兩個 npm 套件的安裝可能導致錯誤。

為了解決此問題，Kotlin 1.4.20 包含一個選項來停用這些所謂的 _細粒度工作區_。此功能目前可透過 Gradle 中 `YarnPlugin` 內部的 `YarnRootExtension` 獲得。若要使用它，請將以下程式碼片段新增到您的 `build.gradle.kts` 檔案中：

```kotlin
rootProject.plugins.withType<YarnPlugin> {
    rootProject.the<YarnRootExtension>().disableGranularWorkspaces()
}
```

### 新的精靈範本

為了讓您在專案建立時更方便地自訂專案，Kotlin 的專案精靈帶來了新的 Kotlin/JS 應用程式範本：
- **Browser Application** - 一個在瀏覽器中執行的最小 Kotlin/JS Gradle 專案。
- **React Application** - 一個使用適當 `kotlin-wrappers` 的 React 應用程式。
    它提供啟用樣式表、導航元件或狀態容器整合的選項。
- **Node.js Application** - 一個在 Node.js 執行時中執行的最小專案。它帶有直接包含實驗性 `kotlinx-nodejs` 套件的選項。

### IR 編譯器忽略編譯錯誤

> _忽略編譯錯誤_ 模式是 [實驗性](components-stability.md) 功能。它可能隨時被移除或變更。需要明確啟用（詳情請見下文）。僅用於評估目的。我們非常感謝您在 [YouTrack](https://youtrack.jetbrains.com/issues/KT) 上提供關於此功能的意見回饋。
>
{style="warning"}

Kotlin/JS 的 [IR 編譯器](js-ir-compiler.md) 帶有新的實驗性模式——_帶錯誤編譯_。在此模式下，即使您的程式碼包含錯誤，您也可以執行它，例如，當整個應用程式尚未準備好時，您想嘗試某些東西。

此模式有兩種容錯策略：
- `SEMANTIC`：編譯器將接受語法正確但語意上沒有意義的程式碼，例如 `val x: String = 3`。

- `SYNTAX`：編譯器將接受任何程式碼，即使它包含語法錯誤。

若要允許帶錯誤編譯，請新增 `-Xerror-tolerance-policy=` 編譯器選項並指定上述其中一個值。

[了解更多關於 Kotlin/JS IR 編譯器](js-ir-compiler.md) 的資訊。

## Kotlin/Native

Kotlin/Native 在 1.4.20 中的優先事項是效能和完善現有功能。以下是顯著的改進：

- [逃逸分析](#escape-analysis)
- [效能改進與錯誤修正](#performance-improvements-and-bug-fixes)
- [明確啟用 Objective-C 異常包裝](#opt-in-wrapping-of-objective-c-exceptions)
- [CocoaPods 外掛程式改進](#cocoapods-plugin-improvements)
- [支援 Xcode 12 函式庫](#support-for-xcode-12-libraries)

### 逃逸分析

> 逃逸分析機制是 [實驗性](components-stability.md) 功能。它可能隨時被移除或變更。僅用於評估目的。我們非常感謝您在 [YouTrack](https://youtrack.jetbrains.com/issues/KT) 上提供關於此功能的意見回饋。
>
{style="warning"}

Kotlin/Native 收到一個新的 [逃逸分析](https://en.wikipedia.org/wiki/Escape_analysis) 機制原型。它透過將特定物件分配到堆疊而非堆記憶體來改進執行時效能。該機制在我們的基準測試中顯示出平均 10% 的效能提升，我們將繼續改進它，使其能進一步加速程式。

逃逸分析在發行建置（帶有 `-opt` 編譯器選項）的一個獨立編譯階段執行。

如果您想停用逃逸分析階段，請使用 `-Xdisable-phases=EscapeAnalysis` 編譯器選項。

### 效能改進與錯誤修正

Kotlin/Native 在各個元件中都收到了效能改進與錯誤修正，包括在 1.4.0 中新增的元件，例如 [程式碼共享機制](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-share-on-platforms.html#share-code-on-similar-platforms)。

### 明確啟用 Objective-C 異常包裝

> Objective-C 異常包裝機制是 [實驗性](components-stability.md) 功能。它可能隨時被移除或變更。需要明確啟用（詳情請見下文）。僅用於評估目的。我們非常感謝您在 [YouTrack](https://youtrack.jetbrains.com/issues/KT) 上提供關於此功能的意見回饋。
>
{style="warning"}

Kotlin/Native 現在可以在執行時處理從 Objective-C 程式碼拋出的異常，以避免程式崩潰。

您可以選擇將 `NSException` 包裝成 `ForeignException` 類型的 Kotlin 異常。它們持有對原始 `NSException` 的參考。這讓您可以獲取根本原因的資訊並正確處理它。

若要啟用 Objective-C 異常的包裝，請在 `cinterop` 呼叫中指定 `-Xforeign-exception-mode objc-wrap` 選項，或將 `foreignExceptionMode = objc-wrap` 屬性新增到 `.def` 檔案中。如果您使用 [CocoaPods 整合](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-cocoapods-overview.html)，請在依賴項的 `pod {}` 建置指令碼區塊中指定該選項，如下所示：

```kotlin
pod("foo") {
    extraOpts = listOf("-Xforeign-exception-mode", "objc-wrap")
}
```

預設行為保持不變：當 Objective-C 程式碼拋出異常時，程式會終止。

### CocoaPods 外掛程式改進

Kotlin 1.4.20 繼續改進 CocoaPods 整合。具體來說，您可以嘗試以下新功能：

- [改進的任務執行](#improved-task-execution)
- [擴展的 DSL](#extended-dsl)
- [更新與 Xcode 的整合](#updated-integration-with-xcode)

#### 改進的任務執行

CocoaPods 外掛程式獲得了改進的任務執行流程。例如，如果您新增一個新的 CocoaPods 依賴項，現有依賴項不會重新建置。新增一個額外目標也不會影響現有依賴項的重新建置。

#### 擴展的 DSL

將 [CocoaPods](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-cocoapods-overview.html) 依賴項新增到 Kotlin 專案的 DSL 獲得了新功能。

除了本地 Pods 和來自 CocoaPods 儲存庫的 Pods 之外，您還可以新增對以下類型函式庫的依賴項：
* 來自自訂 spec 儲存庫的函式庫。
* 來自 Git 儲存庫的遠端函式庫。
* 來自歸檔的函式庫（也可用任意 HTTP 位址）。
* 靜態函式庫。
* 具有自訂 cinterop 選項的函式庫。

了解更多關於在 Kotlin 專案中 [新增 CocoaPods 依賴項](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-cocoapods-libraries.html) 的資訊。在 [Kotlin with CocoaPods 範例](https://github.com/Kotlin/kmm-with-cocoapods-sample) 中找到範例。

#### 更新與 Xcode 的整合

為了與 Xcode 正確配合，Kotlin 需要一些 Podfile 變更：

* 如果您的 Kotlin Pod 有任何 Git、HTTP 或 specRepo Pod 依賴項，您也應該在 Podfile 中指定它。
* 當您從自訂 spec 新增函式庫時，您還應該在 Podfile 的開頭指定 spec 的 [位置](https://guides.cocoapods.org/syntax/podfile.html#source)。

現在整合錯誤在 IDEA 中有詳細描述。因此，如果您的 Podfile 有問題，您會立即知道如何修正它們。

了解更多關於 [建立 Kotlin pods](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-cocoapods-xcode.html) 的資訊。

### 支援 Xcode 12 函式庫

我們增加了對 Xcode 12 隨附的新函式庫的支援。現在您可以從 Kotlin 程式碼中使用它們。

## Kotlin Multiplatform

### 更新了多平台函式庫發佈的結構

從 Kotlin 1.4.20 開始，不再有單獨的元資料發佈。元資料構件現在包含在代表整個函式庫的 _根_ 發佈中，當作為依賴項新增到通用原始碼集時，會自動解析為適當的特定平台構件。

了解更多關於 [發佈多平台函式庫](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-publish-lib-setup.html) 的資訊。

#### 與早期版本的相容性

此結構變更破壞了具有 [分層專案結構](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-share-on-platforms.html#share-code-on-similar-platforms) 的專案之間的相容性。如果多平台專案及其所依賴的函式庫都具有分層專案結構，那麼您需要同時將它們更新到 Kotlin 1.4.20 或更高版本。使用 Kotlin 1.4.20 發佈的函式庫不能用於早期版本發佈的專案。

不帶有分層專案結構的專案和函式庫保持相容。

## 標準函式庫

Kotlin 1.4.20 的標準函式庫為處理檔案提供了新的擴展，並提升了效能。

- [java.nio.file.Path 的擴展](#extensions-for-java-nio-file-path)
- [改進了 String.replace 函式效能](#improved-string-replace-function-performance)

### java.nio.file.Path 的擴展

> `java.nio.file.Path` 的擴展是 [實驗性](components-stability.md) 功能。它可能隨時被移除或變更。需要明確啟用（詳情請見下文）。僅用於評估目的。我們非常感謝您在 [YouTrack](https://youtrack.jetbrains.com/issues/KT) 上提供關於此功能的意見回饋。
>
{style="warning"}

現在標準函式庫提供了 `java.nio.file.Path` 的實驗性擴展。
以慣用的 Kotlin 方式處理現代 JVM 檔案 API，現在類似於處理 `kotlin.io` 套件中的 `java.io.File` 擴展。

```kotlin
// construct path with the div (/) operator
val baseDir = Path("/base")
val subDir = baseDir / "subdirectory" 

// list files in a directory
val kotlinFiles: List<Path> = Path("/home/user").listDirectoryEntries("*.kt")
```

這些擴展在 `kotlin-stdlib-jdk7` 模組的 `kotlin.io.path` 套件中可用。
若要使用這些擴展，請 [明確啟用](opt-in-requirements.md) 實驗性註解 `@ExperimentalPathApi`。

### 改進了 String.replace 函式效能

`String.replace()` 的新實作加速了函式執行。
區分大小寫的變體使用基於 `indexOf` 的手動替換迴圈，而不區分大小寫的變體則使用正規表達式匹配。

## Kotlin Android Extensions

在 1.4.20 中，Kotlin Android Extensions 外掛程式已棄用，`Parcelable` 實作生成器將移至一個單獨的外掛程式。

- [棄用合成視圖](#deprecation-of-synthetic-views)
- [Parcelable 實作生成器的新外掛程式](#new-plugin-for-parcelable-implementation-generator)

### 棄用合成視圖

_合成視圖_ 在 Kotlin Android Extensions 外掛程式中已推出一段時間，旨在簡化與 UI 元素的互動並減少樣板程式碼。現在 Google 提供了一個做同樣事情的原生機制——Android Jetpack 的 [視圖綁定](https://developer.android.com/topic/libraries/view-binding)，我們正在棄用合成視圖以支持這些。

我們將 Parcelable 實作生成器從 `kotlin-android-extensions` 中提取出來，並開始其餘部分的棄用週期——合成視圖。目前，它們將繼續工作並帶有棄用警告。將來，您需要將您的專案切換到另一個解決方案。以下是將您的 Android 專案從合成視圖遷移到視圖綁定的 [指南](https://goo.gle/kotlin-android-extensions-deprecation)。

### Parcelable 實作生成器的新外掛程式

`Parcelable` 實作生成器現在在新的 `kotlin-parcelize` 外掛程式中可用。請應用此外掛程式而非 `kotlin-android-extensions`。

>`kotlin-parcelize` 和 `kotlin-android-extensions` 不能在一個模組中一起應用。
>
{style="note"}

`@Parcelize` 註解已移至 `kotlinx.parcelize` 套件。

在 [Android 文件](https://developer.android.com/kotlin/parcelize) 中了解更多關於 `Parcelable` 實作生成器 的資訊。