[//]: # (title: Kotlin 1.4.20 的新功能)

_[發佈日期：2020 年 11 月 23 日](releases.md#release-details)_

Kotlin 1.4.20 提供了許多新的實驗性功能，並對現有功能（包括在 1.4.0 中新增的功能）進行了修正與改進。

您也可以在[這篇部落格文章](https://blog.jetbrains.com/kotlin/2020/11/kotlin-1-4-20-released/)中瞭解更多關於新功能的範例。

## Kotlin/JVM

Kotlin/JVM 的改進旨在與現代 Java 版本的特性保持同步：

- [Java 15 目標](#java-15-target)
- [invokedynamic 字串串接](#invokedynamic-string-concatenation)

### Java 15 目標

現在 Java 15 可作為 Kotlin/JVM 的目標版本。

### invokedynamic 字串串接

> `invokedynamic` 字串串接是[實驗性功能](components-stability.md)。它可能隨時被移除或變更。需要選擇加入 (Opt-in) (詳情請見下方)。僅供評估之用。我們非常感謝您在 [YouTrack](https://youtrack.jetbrains.com/issues/KT) 上提供相關回饋。
>
{style="warning"}

Kotlin 1.4.20 可以將字串串接編譯為針對 JVM 9+ 目標的[動態呼叫](https://docs.oracle.com/javase/7/docs/technotes/guides/vm/multiple-language-support.html#invokedynamic)，從而提升效能。

目前，此功能為實驗性，涵蓋以下情況：
- 運算子 (`a + b`)、顯式 (`a.plus(b)`) 和參照 (`(a::plus)(b)`) 形式的 `String.plus`。
- 內聯 (inline) 類別與資料類別 (data class) 上的 `toString`。
- 字串模板，但具單一非常數引數的除外 (請參見 [KT-42457](https://youtrack.jetbrains.com/issue/KT-42457))。

若要啟用 `invokedynamic` 字串串接，請新增 `-Xstring-concat` 編譯器選項，並搭配以下其中一個值：
- `indy-with-constants`，以使用 [StringConcatFactory.makeConcatWithConstants()](https://docs.oracle.com/javase/9/docs/api/java/lang/invoke/StringConcatFactory.html#makeConcatWithConstants-java.lang.invoke.MethodHandles.Lookup-java.lang.String-java.lang.invoke.MethodType-java.lang.String-java.lang.Object...-) 對字串執行 `invokedynamic` 串接。
- `indy`，以使用 [StringConcatFactory.makeConcat()](https://docs.oracle.com/javase/9/docs/api/java/lang/invoke/StringConcatFactory.html#makeConcat-java.lang.invoke.MethodHandles.Lookup-java.lang.String-java.lang.invoke.MethodType-) 對字串執行 `invokedynamic` 串接。
- `inline`，以切換回透過 `StringBuilder.append()` 的傳統串接方式。

## Kotlin/JS

Kotlin/JS 持續快速發展，在 1.4.20 中您可以找到多項實驗性功能和改進：

- [Gradle DSL 變更](#gradle-dsl-changes)
- [新版精靈範本](#new-wizard-templates)
- [使用 IR 編譯器忽略編譯錯誤](#ignoring-compilation-errors-with-ir-compiler)

### Gradle DSL 變更

Kotlin/JS 的 Gradle DSL 獲得多項更新，以簡化專案設定和客製化。這包括 webpack 配置調整、對自動生成的 `package.json` 檔案的修改，以及改進了對傳輸性依賴項 (transitive dependencies) 的控制。

#### webpack 配置的單一入口點

瀏覽器目標 (browser target) 提供了一個新的配置區塊 `commonWebpackConfig`。在其中，您可以從單一入口點調整通用設定，而不必為 `webpackTask`、`runTask` 和 `testTask` 重複配置。

若要預設為所有這三個任務啟用 CSS 支援，請在您專案的 `build.gradle(.kts)` 中新增以下程式碼片段：

```groovy
browser {
    commonWebpackConfig {
        cssSupport.enabled = true
    }
    binaries.executable()
}
```

瞭解更多關於[配置 webpack 捆綁 (bundling)](js-project-setup.md#webpack-bundling)。

#### 從 Gradle 客製化 package.json

為了更精確地控制 Kotlin/JS 套件管理和分發，您現在可以透過 Gradle DSL 將屬性新增至專案檔案 [`package.json`](https://nodejs.dev/learn/the-package-json-guide)。

若要將自訂欄位新增至您的 `package.json`，請在編譯的 `packageJson` 區塊中使用 `customField` 函數：

```kotlin
kotlin {
    js(BOTH) {
        compilations["main"].packageJson {
            customField("hello", mapOf("one" to 1, "two" to 2))
        }
    }
}
```

瞭解更多關於[`package.json` 客製化](js-project-setup.md#package-json-customization)。

#### Yarn 選擇性依賴項解析

> 支援 Yarn 選擇性依賴項解析是[實驗性功能](components-stability.md)。它可能隨時被移除或變更。僅供評估之用。我們非常感謝您在 [YouTrack](https://youtrack.jetbrains.com/issues/KT) 上提供相關回饋。
>
{style="warning"}

Kotlin 1.4.20 提供了一種配置 Yarn [選擇性依賴項解析](https://classic.yarnpkg.com/en/docs/selective-version-resolutions/) 的方式—這是一種用於覆寫您所依賴套件的依賴項的機制。

您可以透過 Gradle 中的 `YarnPlugin` 內的 `YarnRootExtension` 來使用它。若要影響專案中套件的解析版本，請使用 `resolution` 函數，傳入套件名稱選擇器 (由 Yarn 指定) 和應解析到的版本。

```kotlin
rootProject.plugins.withType<YarnPlugin> {
    rootProject.the<YarnRootExtension>().apply {
        resolution("react", "16.0.0")
        resolution("processor/decamelize", "3.0.0")
    }
}
```

在此，您所有需要 `react` 的 npm 依賴項將會收到版本 `16.0.0`，而 `processor` 將會收到其依賴項 `decamelize` 版本 `3.0.0`。

#### 禁用粒度工作區

> 禁用粒度工作區是[實驗性功能](components-stability.md)。它可能隨時被移除或變更。僅供評估之用。我們非常感謝您在 [YouTrack](https://youtrack.jetbrains.com/issues/KT) 上提供相關回饋。
>
{style="warning"}

為加快建置時間，Kotlin/JS Gradle 外掛程式只安裝特定 Gradle 任務所需的依賴項。例如，`webpack-dev-server` 套件只在您執行其中一個 `*Run` 任務時安裝，而不是在您執行 assemble 任務時安裝。當您平行執行多個 Gradle 處理程序時，這種行為可能會帶來問題。當依賴項要求發生衝突時，兩個 npm 套件的安裝可能會導致錯誤。

為了解決此問題，Kotlin 1.4.20 包含一個禁用這些所謂_粒度工作區_的選項。此功能目前可透過 Gradle 中的 `YarnPlugin` 內的 `YarnRootExtension` 獲得。若要使用它，請將以下程式碼片段新增到您的 `build.gradle.kts` 檔案：

```kotlin
rootProject.plugins.withType<YarnPlugin> {
    rootProject.the<YarnRootExtension>().disableGranularWorkspaces()
}
```

### 新版精靈範本

為了在專案建立期間提供更便捷的客製化方式，Kotlin 的專案精靈附帶了適用於 Kotlin/JS 應用程式的新範本：
- **瀏覽器應用程式 (Browser Application)** - 一個在瀏覽器中執行的最小 Kotlin/JS Gradle 專案。
- **React 應用程式 (React Application)** - 一個使用適當 `kotlin-wrappers` 的 React 應用程式。它提供選項以啟用與樣式表、導航元件或狀態容器的整合。
- **Node.js 應用程式 (Node.js Application)** - 一個用於在 Node.js 執行時環境中執行的最小專案。它附帶直接包含實驗性 `kotlinx-nodejs` 套件的選項。

### 使用 IR 編譯器忽略編譯錯誤

> _忽略編譯錯誤_模式是[實驗性功能](components-stability.md)。它可能隨時被移除或變更。需要選擇加入 (Opt-in) (詳情請見下方)。僅供評估之用。我們非常感謝您在 [YouTrack](https://youtrack.jetbrains.com/issues/KT) 上提供相關回饋。
>
{style="warning"}

Kotlin/JS 的 [IR 編譯器](js-ir-compiler.md) 帶有新的實驗性模式 — _帶錯誤編譯_。在此模式下，即使程式碼包含錯誤，您也能執行它，例如，當整個應用程式尚未準備好時，您想嘗試某些功能。

此模式有兩種容忍策略：
- `SEMANTIC`：編譯器將接受語法正確但在語義上不合理的程式碼，例如 `val x: String = 3`。

- `SYNTAX`：編譯器將接受任何程式碼，即使它包含語法錯誤。

若要允許帶錯誤編譯，請新增 `-Xerror-tolerance-policy=` 編譯器選項，並搭配上面列出的其中一個值。

[瞭解更多關於 Kotlin/JS IR 編譯器](js-ir-compiler.md)。

## Kotlin/Native

Kotlin/Native 在 1.4.20 的優先事項是效能和完善現有功能。以下是顯著的改進：

- [逃逸分析](#escape-analysis)
- [效能改進與錯誤修正](#performance-improvements-and-bug-fixes)
- [選擇加入 Objective-C 異常包裝](#opt-in-wrapping-of-objective-c-exceptions)
- [CocoaPods 外掛程式改進](#cocoapods-plugin-improvements)
- [支援 Xcode 12 函式庫](#support-for-xcode-12-libraries)

### 逃逸分析

> 逃逸分析機制是[實驗性功能](components-stability.md)。它可能隨時被移除或變更。僅供評估之用。我們非常感謝您在 [YouTrack](https://youtrack.jetbrains.com/issues/KT) 上提供相關回饋。
>
{style="warning"}

Kotlin/Native 接收了新的[逃逸分析](https://en.wikipedia.org/wiki/Escape_analysis)機制原型。它透過將某些物件分配在堆疊 (stack) 上而不是堆 (heap) 上，提高了執行時效能。此機制在我們的基準測試中顯示平均效能提升 10%，我們並持續改進它，使其進一步加速程式的執行。

逃逸分析在發行版本建置 (使用 `-opt` 編譯器選項) 的獨立編譯階段執行。

如果您想禁用逃逸分析階段，請使用 `-Xdisable-phases=EscapeAnalysis` 編譯器選項。

### 效能改進與錯誤修正

Kotlin/Native 在各個元件中獲得了效能改進和錯誤修正，包括 1.4.0 中新增的元件，例如[程式碼共享機制](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-share-on-platforms.html#share-code-on-similar-platforms)。

### 選擇加入 Objective-C 異常包裝

> Objective-C 異常包裝機制是[實驗性功能](components-stability.md)。它可能隨時被移除或變更。需要選擇加入 (Opt-in) (詳情請見下方)。僅供評估之用。我們非常感謝您在 [YouTrack](https://youtrack.jetbrains.com/issues/KT) 上提供相關回饋。
>
{style="warning"}

Kotlin/Native 現在可以在執行時處理從 Objective-C 程式碼拋出的異常，以避免程式崩潰。

您可以選擇加入以將 `NSException` 包裝成 `ForeignException` 類型的 Kotlin 異常。它們保留對原始 `NSException` 的參照。這讓您可以取得根本原因的資訊並妥善處理。

若要啟用 Objective-C 異常包裝，請在 `cinterop` 呼叫中指定 `-Xforeign-exception-mode objc-wrap` 選項，或將 `foreignExceptionMode = objc-wrap` 屬性新增至 `.def` 檔案。如果您使用 [CocoaPods 整合](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-cocoapods-overview.html)，請在依賴項的 `pod {}` 建置指令碼區塊中指定該選項，如下所示：

```kotlin
pod("foo") {
    extraOpts = listOf("-Xforeign-exception-mode", "objc-wrap")
}
```

預設行為保持不變：當從 Objective-C 程式碼拋出異常時，程式將終止。

### CocoaPods 外掛程式改進

Kotlin 1.4.20 持續在 CocoaPods 整合方面進行一系列改進。具體來說，您可以嘗試以下新功能：

- [改進的任務執行](#improved-task-execution)
- [擴展的 DSL](#extended-dsl)
- [更新與 Xcode 的整合](#updated-integration-with-xcode)

#### 改進的任務執行

CocoaPods 外掛程式獲得了改進的任務執行流程。例如，如果您新增一個新的 CocoaPods 依賴項，現有的依賴項不會被重建。新增一個額外的目標也不會影響現有依賴項的重建。

#### 擴展的 DSL

將 [CocoaPods](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-cocoapods-overview.html) 依賴項新增到 Kotlin 專案的 DSL 獲得了新的功能。

除了本地 Pods 和來自 CocoaPods 儲存庫的 Pods 之外，您還可以新增以下類型函式庫的依賴項：
* 來自自訂 spec 儲存庫的函式庫。
* 來自 Git 儲存庫的遠端函式庫。
* 來自壓縮檔的函式庫 (也可透過任意 HTTP 位址獲得)。
* 靜態函式庫。
* 帶有自訂 cinterop 選項的函式庫。

瞭解更多關於在 Kotlin 專案中[新增 CocoaPods 依賴項](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-cocoapods-libraries.html)。在 [Kotlin 與 CocoaPods 範例](https://github.com/Kotlin/kmm-with-cocoapods-sample) 中查找範例。

#### 更新與 Xcode 的整合

為了與 Xcode 正確配合使用，Kotlin 需要對 Podfile 進行一些變更：

* 如果您的 Kotlin Pod 具有任何 Git、HTTP 或 specRepo Pod 依賴項，您也應該在 Podfile 中指定它。
* 當您從自訂 spec 新增函式庫時，您也應該在 Podfile 的開頭指定 specs 的[位置](https://guides.cocoapods.org/syntax/podfile.html#source)。

現在整合錯誤在 IDEA 中有詳細的描述。因此如果您的 Podfile 有問題，您將立即知道如何修正它們。

瞭解更多關於[建立 Kotlin Pods](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-cocoapods-xcode.html)。

### 支援 Xcode 12 函式庫

我們新增了對隨 Xcode 12 提供的函式庫的支援。現在您可以從 Kotlin 程式碼中使用它們。

## Kotlin Multiplatform

### 多平台函式庫發佈的更新結構

從 Kotlin 1.4.20 開始，不再有單獨的元資料發佈。元資料 Artifact 現在包含在 _根 (root)_ 發佈中，它代表整個函式庫，並且當作為依賴項新增到通用原始碼集時，會自動解析為相應的特定平台 Artifact。

瞭解更多關於[發佈多平台函式庫](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-publish-lib-setup.html)。

#### 與早期版本的相容性

這種結構變更破壞了具有[分層專案結構](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-share-on-platforms.html#share-code-on-similar-platforms)的專案之間的相容性。如果一個多平台專案和它所依賴的函式庫都具有分層專案結構，那麼您需要同時將它們更新到 Kotlin 1.4.20 或更高版本。使用 Kotlin 1.4.20 發佈的函式庫不能被早期版本發佈的專案使用。

不具分層專案結構的專案和函式庫保持相容。

## 標準函式庫

Kotlin 1.4.20 的標準函式庫提供了用於檔案操作的新擴展和更好的效能。

- [java.nio.file.Path 的擴展](#extensions-for-java-nio-file-path)
- [String.replace 函數的效能改進](#improved-string-replace-function-performance)

### java.nio.file.Path 的擴展

> `java.nio.file.Path` 的擴展是[實驗性功能](components-stability.md)。它們可能隨時被移除或變更。需要選擇加入 (Opt-in) (詳情請見下方)。僅供評估之用。我們非常感謝您在 [YouTrack](https://youtrack.jetbrains.com/issues/KT) 上提供相關回饋。
>
{style="warning"}

現在標準函式庫提供了 `java.nio.file.Path` 的實驗性擴展。以慣用的 Kotlin 方式使用現代 JVM 檔案 API，現在類似於使用 `kotlin.io` 套件中的 `java.io.File` 擴展。

```kotlin
// 使用除法 (/) 運算子建構路徑
val baseDir = Path("/base")
val subDir = baseDir / "subdirectory" 

// 列出目錄中的檔案
val kotlinFiles: List<Path> = Path("/home/user").listDirectoryEntries("*.kt")
```

這些擴展在 `kotlin-stdlib-jdk7` 模組的 `kotlin.io.path` 套件中可用。若要使用這些擴展，請[選擇加入](opt-in-requirements.md)實驗性註解 `@ExperimentalPathApi`。

### String.replace 函數的效能改進

`String.replace()` 的新實作加快了函數執行速度。區分大小寫的版本使用基於 `indexOf` 的手動替換迴圈，而不區分大小寫的版本則使用正規表達式匹配。

## Kotlin Android Extensions

在 1.4.20 中，Kotlin Android Extensions 外掛程式已被棄用，而 `Parcelable` 實作生成器則移至單獨的外掛程式。

- [合成視圖 (synthetic views) 的棄用](#deprecation-of-synthetic-views)
- [適用於 Parcelable 實作生成器的新外掛程式](#new-plugin-for-parcelable-implementation-generator)

### 合成視圖 (synthetic views) 的棄用

_合成視圖 (synthetic views)_ 不久前在 Kotlin Android Extensions 外掛程式中推出，旨在簡化與 UI 元素的互動並減少樣板程式碼。現在 Google 提供一個原生機制，做同樣的事情—Android Jetpack 的[視圖綁定 (view bindings)](https://developer.android.com/topic/libraries/view-binding)，我們正在棄用合成視圖，轉而支持它們。

我們從 `kotlin-android-extensions` 中提取 `Parcelable` 實作生成器，並開始其餘部分（即合成視圖）的棄用週期。目前，它們將繼續運作並發出棄用警告。未來，您需要將您的專案切換到其他解決方案。以下是將幫助您將 Android 專案從合成視圖遷移到視圖綁定 (view bindings) 的[指南](https://goo.gle/kotlin-android-extensions-deprecation)。

### 適用於 Parcelable 實作生成器的新外掛程式

`Parcelable` 實作生成器現在在新 `kotlin-parcelize` 外掛程式中可用。請套用此外掛程式，而不是 `kotlin-android-extensions`。

> `kotlin-parcelize` 和 `kotlin-android-extensions` 不能在一個模組中同時套用。
>
{style="note"}

`@Parcelize` 註解已移至 `kotlinx.parcelize` 套件。

在 [Android 文件](https://developer.android.com/kotlin/parcelize) 中瞭解更多關於 `Parcelable` 實作生成器。