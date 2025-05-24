---
title: "Kotlin 1.4.20 的新特性"
---
_[已發布：2020 年 11 月 23 日](releases#release-details)_

Kotlin 1.4.20 提供了一些新的實驗性功能，並為現有功能提供了修復和改進，包括 1.4.0 中新增的功能。

您也可以在[這篇部落格文章](https://blog.jetbrains.com/kotlin/2020/11/kotlin-1-4-20-released/)中了解更多帶有範例的新功能。

## Kotlin/JVM

Kotlin/JVM 的改進旨在使其與現代 Java 版本的功能保持同步：

- [Java 15 目標](#java-15-target)
- [invokedynamic 字串串連](#invokedynamic-string-concatenation)

### Java 15 目標

現在 Java 15 可作為 Kotlin/JVM 目標使用。

### invokedynamic 字串串連

:::note
`invokedynamic` 字串串連是[實驗性的](components-stability)。它可能會隨時被刪除或更改。需要選擇加入（opt-in）（請參閱下面的詳細資訊）。僅將其用於評估目的。我們感謝您在 [YouTrack](https://youtrack.jetbrains.com/issues/KT) 中對它的回饋。

Kotlin 1.4.20 可以將字串串連編譯為 JVM 9+ 目標上的[動態調用](https://docs.oracle.com/javase/7/docs/technotes/guides/vm/multiple-language-support.html#invokedynamic)，從而提高效能。

目前，此功能是實驗性的，涵蓋以下情況：
- 運算符中的 `String.plus` (`a + b`)、顯式 (`a.plus(b)`) 和引用 (`(a::plus)(b)`) 形式。
- 內聯類別 (inline class) 和資料類別 (data class) 上的 `toString`。
- 字串模板 (string templates)，但具有單個非常數參數的模板除外（請參閱 [KT-42457](https://youtrack.jetbrains.com/issue/KT-42457)）。

要啟用 `invokedynamic` 字串串連，請新增帶有以下值之一的 `-Xstring-concat` 編譯器選項：
- `indy-with-constants` 以對帶有 [StringConcatFactory.makeConcatWithConstants()](https://docs.oracle.com/javase/9/docs/api/java/lang/invoke/StringConcatFactory.html#makeConcatWithConstants-java.lang.invoke.MethodHandles.Lookup-java.lang.String-java.lang.invoke.MethodType-java.lang.String-java.lang.Object...-) 的字串執行 `invokedynamic` 串連。
- `indy` 以對帶有 [StringConcatFactory.makeConcat()](https://docs.oracle.com/javase/9/docs/api/java/lang/invoke/StringConcatFactory.html#makeConcat-java.lang.invoke.MethodHandles.Lookup-java.lang.String-java.lang.invoke.MethodType-) 的字串執行 `invokedynamic` 串連。
- `inline` 以切換回通過 `StringBuilder.append()` 進行的經典串連。

## Kotlin/JS

Kotlin/JS 發展迅速，在 1.4.20 中，您可以找到許多實驗性功能和改進：

- [Gradle DSL 變更](#gradle-dsl-changes)
- [新的精靈範本](#new-wizard-templates)
- [使用 IR 編譯器忽略編譯錯誤](#ignoring-compilation-errors-with-ir-compiler)

### Gradle DSL 變更

Kotlin/JS 的 Gradle DSL 收到了一些更新，這些更新簡化了專案設定和自訂。這包括 webpack 設定調整、對自動產生的 `package.json` 檔案的修改，以及對過渡性依賴項的改進控制。

#### webpack 設定的單一入口點

新的設定區塊 `commonWebpackConfig` 可用於瀏覽器目標 (browser target)。在其中，您可以從單一入口點調整常見設定，而不必為 `webpackTask`、`runTask` 和 `testTask` 複製設定。

若要預設為所有三個任務啟用 CSS 支援，請在專案的 `build.gradle(.kts)` 中新增以下程式碼片段：

```groovy
browser {
    commonWebpackConfig {
        cssSupport.enabled = true
    }
    binaries.executable()
}
```

了解更多關於[設定 webpack 捆綁](js-project-setup#webpack-bundling)的資訊。

#### 從 Gradle 自訂 package.json

為了更好地控制您的 Kotlin/JS 套件管理和發佈，您現在可以通過 Gradle DSL 將屬性新增到專案檔案 [`package.json`](https://nodejs.dev/learn/the-package-json-guide)。

若要將自訂欄位新增到您的 `package.json`，請在編譯的 `packageJson` 區塊中使用 `customField` 函數：

```kotlin
kotlin {
    js(BOTH) {
        compilations["main"].packageJson {
            customField("hello", mapOf("one" to 1, "two" to 2))
        }
    }
}
```

了解更多關於 [`package.json` 自訂](js-project-setup#package-json-customization)的資訊。

#### 選擇性的 yarn 依賴項解析

選擇性的 yarn 依賴項解析是[實驗性的](components-stability)。它可能會隨時被刪除或更改。僅將其用於評估目的。我們感謝您在 [YouTrack](https://youtrack.jetbrains.com/issues/KT) 中對它的回饋。

Kotlin 1.4.20 提供了一種設定 Yarn 的[選擇性依賴項解析](https://classic.yarnpkg.com/en/docs/selective-version-resolutions/)的方法，該機制用於覆蓋您所依賴的套件的依賴項。

您可以通過 Gradle 中 `YarnPlugin` 內部的 `YarnRootExtension` 來使用它。若要影響專案的套件的已解析版本，請使用 `resolution` 函數傳入套件名稱選擇器（如 Yarn 所指定）以及應解析到的版本。

```kotlin
rootProject.plugins.withType<YarnPlugin> {
    rootProject.the<YarnRootExtension>().apply {
        resolution("react", "16.0.0")
        resolution("processor/decamelize", "3.0.0")
    }
}
```

在此，所有需要 `react` 的 npm 依賴項都將收到版本 `16.0.0`，而 `processor` 將收到其依賴項 `decamelize` 作為版本 `3.0.0`。

#### 停用細粒度工作區 (granular workspaces)

停用細粒度工作區是[實驗性的](components-stability)。它可能會隨時被刪除或更改。僅將其用於評估目的。我們感謝您在 [YouTrack](https://youtrack.jetbrains.com/issues/KT) 中對它的回饋。

為了加快建置時間，Kotlin/JS Gradle 插件僅安裝特定 Gradle 任務所需的依賴項。例如，僅當您執行其中一個 `*Run` 任務時才安裝 `webpack-dev-server` 套件，而不是在執行組裝任務時安裝。當您並行執行多個 Gradle 流程時，此行為可能會帶來問題。當依賴項需求衝突時，npm 套件的兩個安裝可能會導致錯誤。

為了解決此問題，Kotlin 1.4.20 包含一個選項來停用這些所謂的_細粒度工作區_。目前，此功能可通過 Gradle 中 `YarnPlugin` 內部的 `YarnRootExtension` 獲得。若要使用它，請將以下程式碼片段新增到您的 `build.gradle.kts` 檔案：

```kotlin
rootProject.plugins.withType<YarnPlugin> {
    rootProject.the<YarnRootExtension>().disableGranularWorkspaces()
}
```

### 新的精靈範本

為了讓您在建立期間更方便地自訂您的專案，Kotlin 的專案精靈 (project wizard) 提供了新的 Kotlin/JS 應用程式範本：
- **Browser Application** - 在瀏覽器中執行的最小 Kotlin/JS Gradle 專案。
- **React Application** - 使用適當的 `kotlin-wrappers` 的 React 應用程式。
    它提供了啟用樣式表、導航組件或狀態容器的整合的選項。
- **Node.js Application** - 用於在 Node.js 運行時中執行的最小專案。它提供了直接包含實驗性 `kotlinx-nodejs` 套件的選項。

### 使用 IR 編譯器忽略編譯錯誤

_忽略編譯錯誤_模式是[實驗性的](components-stability)。它可能會隨時被刪除或更改。需要選擇加入（opt-in）（請參閱下面的詳細資訊）。僅將其用於評估目的。我們感謝您在 [YouTrack](https://youtrack.jetbrains.com/issues/KT) 中對它的回饋。

Kotlin/JS 的 [IR 編譯器](js-ir-compiler) 帶有一種新的實驗性模式 - _帶有錯誤的編譯_。在此模式下，即使您的程式碼包含錯誤，您也可以執行您的程式碼，例如，如果您想在整個應用程式尚未準備好時嘗試某些操作。

此模式有兩種容錯策略 (tolerance policies)：
- `SEMANTIC`：編譯器將接受語法正確但語義上沒有意義的程式碼，例如 `val x: String = 3`。

- `SYNTAX`：編譯器將接受任何程式碼，即使它包含語法錯誤。

若要允許帶有錯誤的編譯，請新增帶有上面列出的值之一的 `-Xerror-tolerance-policy=` 編譯器選項。

[了解更多關於 Kotlin/JS IR 編譯器的資訊](js-ir-compiler)。

## Kotlin/Native

Kotlin/Native 在 1.4.20 中的優先事項是效能和完善現有功能。以下是值得注意的改進：

- [逸出分析 (escape analysis)](#escape-analysis)
- [效能改進和錯誤修復](#performance-improvements-and-bug-fixes)
- [選擇加入 Objective-C 例外包裝](#opt-in-wrapping-of-objective-c-exceptions)
- [CocoaPods 插件改進](#cocoapods-plugin-improvements)
- [支援 Xcode 12 函式庫](#support-for-xcode-12-libraries)

### 逸出分析

逸出分析機制是[實驗性的](components-stability)。它可能會隨時被刪除或更改。僅將其用於評估目的。我們感謝您在 [YouTrack](https://youtrack.jetbrains.com/issues/KT) 中對它的回饋。

Kotlin/Native 接收了新的[逸出分析](https://en.wikipedia.org/wiki/Escape_analysis)機制的原型。它通過在堆疊 (stack) 上而不是堆 (heap) 上分配某些物件來提高運行時效能。此機制在我們的基準測試中顯示平均效能提高了 10%，並且我們將繼續改進它，以便它能更快地加速程式。

逸出分析在發佈版本 (release builds) 的單獨編譯階段中執行（帶有 `-opt` 編譯器選項）。

如果您想停用逸出分析階段，請使用 `-Xdisable-phases=EscapeAnalysis` 編譯器選項。

### 效能改進和錯誤修復

Kotlin/Native 在各種組件中接收了效能改進和錯誤修復，包括 1.4.0 中新增的組件，例如[程式碼共享機制](multiplatform-share-on-platforms#share-code-on-similar-platforms)。

### 選擇加入 Objective-C 例外包裝

Objective-C 例外包裝機制是[實驗性的](components-stability)。它可能會隨時被刪除或更改。需要選擇加入（opt-in）（請參閱下面的詳細資訊）。僅將其用於評估目的。我們感謝您在 [YouTrack](https://youtrack.jetbrains.com/issues/KT) 中對它的回饋。

Kotlin/Native 現在可以在運行時處理從 Objective-C 程式碼擲出的例外，以避免程式崩潰。

您可以選擇將 `NSException` 包裝到 `ForeignException` 類型的 Kotlin 例外中。它們持有對原始 `NSException` 的引用。這使您可以獲取有關根本原因的資訊並正確處理它。

若要啟用 Objective-C 例外的包裝，請在 `cinterop` 呼叫中指定 `-Xforeign-exception-mode objc-wrap` 選項，或將 `foreignExceptionMode = objc-wrap` 屬性新增到 `.def` 檔案。如果您使用 [CocoaPods 整合](native-cocoapods)，請在依賴項的 `pod {}` 建置腳本區塊中指定該選項，如下所示：

```kotlin
pod("foo") {
    extraOpts = listOf("-Xforeign-exception-mode", "objc-wrap")
}
```

預設行為保持不變：當從 Objective-C 程式碼擲出例外時，程式終止。

### CocoaPods 插件改進

Kotlin 1.4.20 繼續改進 CocoaPods 整合。也就是說，您可以嘗試以下新功能：

- [改進的任務執行](#improved-task-execution)
- [擴展的 DSL](#extended-dsl)
- [更新的與 Xcode 的整合](#updated-integration-with-xcode)

#### 改進的任務執行

CocoaPods 插件獲得了改進的任務執行流程。例如，如果您新增新的 CocoaPods 依賴項，則不會重建現有的依賴項。新增額外的目標也不會影響重建現有目標的依賴項。

#### 擴展的 DSL

將 [CocoaPods](native-cocoapods) 依賴項新增到您的 Kotlin 專案的 DSL 接收了新的功能。

除了本地 Pod 和來自 CocoaPods 儲存庫 (repository) 的 Pod 之外，您還可以新增對以下類型的函式庫的依賴項：
* 來自自訂 spec 儲存庫的函式庫。
* 來自 Git 儲存庫的遠端函式庫。
* 來自歸檔檔 (archive) 的函式庫（也可通過任意 HTTP 位址獲得）。
* 靜態函式庫。
* 帶有自訂 cinterop 選項的函式庫。

了解更多關於在 Kotlin 專案中[新增 CocoaPods 依賴項](native-cocoapods-libraries)的資訊。在 [Kotlin with CocoaPods 範例](https://github.com/Kotlin/kmm-with-cocoapods-sample) 中尋找範例。

#### 更新的與 Xcode 的整合

為了與 Xcode 正確協同工作，Kotlin 需要一些 Podfile 變更：

* 如果您的 Kotlin Pod 有任何 Git、HTTP 或 specRepo Pod 依賴項，您也應該在 Podfile 中指定它。
* 當您從自訂 spec 新增函式庫時，您還應該在 Podfile 的開頭指定 spec 的[位置](https://guides.cocoapods.org/syntax/podfile.html#source)。

現在，整合錯誤在 IDEA 中有詳細的描述。因此，如果您對您的 Podfile 有問題，您將立即知道如何修復它們。

了解更多關於[建立 Kotlin pod](native-cocoapods-xcode)的資訊。

### 支援 Xcode 12 函式庫

我們新增了對 Xcode 12 提供的新的函式庫的支援。現在您可以從 Kotlin 程式碼中使用它們。

## Kotlin Multiplatform

### 更新的多平台函式庫發佈結構

從 Kotlin 1.4.20 開始，不再有單獨的元資料發佈 (metadata publication)。元資料產物 (metadata artifacts) 現在包含在_根 (root)_ 發佈中，該發佈代表整個函式庫，並且在新增為通用源集 (common source set) 的依賴項時會自動解析為適當的平台特定產物。

了解更多關於[發佈多平台函式庫](multiplatform-publish-lib)的資訊。

#### 與早期版本的相容性

這種結構的變更破壞了具有[分層專案結構](multiplatform-share-on-platforms#share-code-on-similar-platforms)的專案之間的相容性。如果一個多平台專案和它所依賴的函式庫都具有分層專案結構，那麼您需要同時將它們更新到 Kotlin 1.4.20 或更高版本。使用 Kotlin 1.4.20 發佈的函式庫不能從使用早期版本發佈的專案中使用。

沒有分層專案結構的專案和函式庫保持相容。

## 標準函式庫

Kotlin 1.4.20 的標準函式庫提供了用於處理檔案的新擴展，以及更好的效能。

- [java.nio.file.Path 的擴展](#extensions-for-java-nio-file-path)
- [改進的 String.replace 函數效能](#improved-string-replace-function-performance)

### java.nio.file.Path 的擴展

`java.nio.file.Path` 的擴展是[實驗性的](components-stability)。它們可能會隨時被刪除或更改。需要選擇加入（opt-in）（請參閱下面的詳細資訊）。僅將它們用於評估目的。我們感謝您在 [YouTrack](https://youtrack.jetbrains.com/issues/KT) 中對它們的回饋。

現在，標準函式庫提供了 `java.nio.file.Path` 的實驗性擴展。以慣用的 Kotlin 方式使用現代 JVM 檔案 API 現在類似於使用 `kotlin.io` 套件中的 `java.io.File` 擴展。

```kotlin
// 使用除法 (/) 運算符構建路徑
val baseDir = Path("/base")
val subDir = baseDir / "subdirectory" 

// 列出目錄中的檔案
val kotlinFiles: List<Path> = Path("/home/user").listDirectoryEntries("*.kt")
```

這些擴展在 `kotlin-stdlib-jdk7` 模組的 `kotlin.io.path` 套件中可用。若要使用這些擴展，請[選擇加入](opt-in-requirements)實驗性註釋 (annotation) `@ExperimentalPathApi`。

### 改進的 String.replace 函數效能

`String.replace()` 的新實作加快了函數執行速度。區分大小寫的變體使用基於 `indexOf` 的手動替換迴圈，而不區分大小寫的變體使用正則表達式匹配。

## Kotlin Android Extensions

在 1.4.20 中，Kotlin Android Extensions 插件已棄用，並且 `Parcelable` 實作生成器移至單獨的插件。

- [棄用合成視圖 (synthetic views)](#deprecation-of-synthetic-views)
- [用於 Parcelable 實作生成器的新插件](#new-plugin-for-parcelable-implementation-generator)

### 棄用合成視圖

_合成視圖 (Synthetic views)_ 在 Kotlin Android Extensions 插件中推出已有一段時間，目的是簡化與 UI 元素的互動並減少樣板程式碼。現在，Google 提供了一種執行相同操作的本機機制 - Android Jetpack 的[視圖綁定 (view bindings)](https://developer.android.com/topic/libraries/view-binding)，並且我們正在棄用合成視圖以支持這些視圖綁定。

我們從 `kotlin-android-extensions` 中提取 Parcelable 實作生成器，並開始棄用它的其餘部分 - 合成視圖的週期。目前，它們將繼續使用棄用警告工作。將來，您需要將您的專案切換到另一個解決方案。以下是[指南](https://goo.gle/kotlin-android-extensions-deprecation)，將幫助您將您的 Android 專案從合成視圖遷移到視圖綁定。

### 用於 Parcelable 實作生成器的新插件

`Parcelable` 實作生成器現在可在新的 `kotlin-parcelize` 插件中使用。應用此插件而不是 `kotlin-android-extensions`。

`kotlin-parcelize` 和 `kotlin-android-extensions` 不能在一個模組中一起應用。

:::

`@Parcelize` 註釋已移至 `kotlinx.parcelize` 套件。

在 [Android 文件](https://developer.android.com/kotlin/parcelize)中了解更多關於 `Parcelable` 實作生成器的資訊。