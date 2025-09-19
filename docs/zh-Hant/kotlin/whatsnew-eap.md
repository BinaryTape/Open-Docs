[//]: # (title: Kotlin %kotlinEapVersion% 有什麼新功能)

_[發佈日期：%kotlinEapReleaseDate%](eap.md#build-details)_

> 本文件不涵蓋搶先體驗預覽版 (EAP) 的所有功能，
> 但它強調了一些主要改進。
>
> 請參閱 [GitHub 變更日誌](https://github.com/JetBrains/kotlin/releases/tag/v%kotlinEapVersion%) 中的完整變更列表。
>
{style="note"}

Kotlin %kotlinEapVersion% 版本已發佈！
以下是此 EAP 版本的一些詳細資訊：

* Kotlin Multiplatform：[預設啟用 Swift 匯出](#swift-export-available-by-default)、[`js` 和 `wasmJs` 目標的共享原始碼集](#shared-source-set-for-js-and-wasmjs-targets)、[Kotlin 函式庫的穩定跨平台編譯](#stable-cross-platform-compilation-for-kotlin-libraries)，以及[宣告通用依賴項的新方法](#new-approach-for-declaring-common-dependencies)。
* Language：[將 Lambda 傳遞給帶有 suspend 函式類型的多載時，改進的多載解析](#improved-overload-resolution-for-lambdas-with-suspend-function-types)。
* Kotlin/Native：[二進制檔案中對堆疊 Canary 的支援](#support-for-stack-canaries-in-binaries) 和[縮小發佈二進制檔案大小](#smaller-binary-size-for-release-binaries)。
* Kotlin/Wasm：[Kotlin/Wasm 和 JavaScript 互通中的異常處理改進](#improved-exception-handling-in-kotlin-wasm-and-javascript-interop)。
* Kotlin/JS：[`Long` 值編譯為 JavaScript `BigInt`](#usage-of-bigint-type-to-represent-kotlin-s-long-type)。

## IDE 支援

支援 Kotlin %kotlinEapVersion% 的 Kotlin 插件已捆綁在最新版本的 IntelliJ IDEA 和 Android Studio 中。
您無需更新 IDE 中的 Kotlin 插件。
您只需在建置腳本中將 [Kotlin 版本變更](configure-build-for-eap.md) 為 %kotlinEapVersion%。

有關詳細資訊，請參閱[更新到新版本](releases.md#update-to-a-new-kotlin-version)。

## 語言

在 Kotlin %kotlinEapVersion% 中，您可以試用 Kotlin 2.3.0 計劃推出的語言功能，包括
[將 Lambda 傳遞給帶有 suspend 函式類型的多載時，改進的多載解析](#improved-overload-resolution-for-lambdas-with-suspend-function-types)
和[支援在具有顯式返回型別的表達式主體中使用 return 陳述式](#support-for-return-statements-in-expression-bodies-with-explicit-return-types)。

### 將 Lambda 傳遞給帶有 suspend 函式類型的多載時，改進的多載解析

以前，函式同時帶有常規函式型別和 `suspend` 函式型別的多載，在傳遞 Lambda 時會導致歧義錯誤。您可以使用顯式型別轉換來解決此錯誤，但編譯器錯誤地報告了「`No cast needed`」警告：

```kotlin
// Defines two overloads
fun transform(block: () -> Int) {}
fun transform(block: suspend () -> Int) {}

fun test() {
    // Fails with overload resolution ambiguity
    transform({ 42 })

    // Uses an explicit cast, but compiler incorrectly reports a "No cast needed" warning
    transform({ 42 } as () -> Int)
}
```

經過此變更，當您同時定義常規和 `suspend` 函式型別的多載時，不帶轉換的 Lambda 會解析為常規多載。使用 `suspend` 關鍵字可顯式解析為 suspend 多載：

```kotlin
// Resolves to transform(() -> Int)
transform({ 42 })

// Resolves to transform(suspend () -> Int)
transform(suspend { 42 })
```

此行為將在 Kotlin 2.3.0 中預設啟用。要立即測試，請使用以下編譯器選項將您的語言版本設定為 `2.3`：

```kotlin
-language-version 2.3
```

或者在您的 `build.gradle(.kts)` 檔案中進行配置：

```kotlin
kotlin {
    compilerOptions {
        languageVersion.set(org.jetbrains.kotlin.gradle.dsl.KotlinVersion.KOTLIN_2_3)
    }
}
```

我們非常感謝您在我們的問題追蹤器 [YouTrack](https://youtrack.jetbrains.com/issue/KT-23610) 中提供回饋。

### 支援在具有顯式返回型別的表達式主體中使用 return 陳述式

以前，在表達式主體中使用 `return` 會導致編譯器錯誤，因為它可能導致函式的返回型別被推斷為 `Nothing`。

```kotlin
fun example() = return 42
// Error: Returns are prohibited for functions with an expression body
```

經過此變更，您現在可以在表達式主體中使用 `return`，只要明確寫出返回型別即可：

```kotlin
// Specifies the return type explicitly
fun getDisplayNameOrDefault(userId: String?): String = getDisplayName(userId ?: return "default")

// Fails because it doesn't specify the return type explicitly
fun getDisplayNameOrDefault(userId: String?) = getDisplayName(userId ?: return "default")
```

同樣地，在表達式主體函式中，Lambda 內部和巢狀表達式中的 `return` 陳述式以前會無意中編譯通過。Kotlin 現在支援這些情況，只要明確指定返回型別即可。沒有顯式返回型別的情況將在 Kotlin 2.3.0 中棄用：

```kotlin
// Return type isn't explicitly specified, and the return statement is inside a lambda
// which will be deprecated
fun returnInsideLambda() = run { return 42 }

// Return type isn't explicitly specified, and the return statement is inside the initializer
// of a local variable, which will be deprecated
fun returnInsideIf() = when {
    else -> {
        val result = if (someCondition()) return "" else "value"
        result
    }
}
```

此行為將在 Kotlin 2.3.0 中預設啟用。要立即測試，請使用以下編譯器選項將您的語言版本設定為 `2.3`：

```kotlin
-language-version 2.3
```

或者在您的 `build.gradle(.kts)` 檔案中進行配置：

```kotlin
kotlin {
    compilerOptions {
        languageVersion.set(org.jetbrains.kotlin.gradle.dsl.KotlinVersion.KOTLIN_2_3)
    }
}
```

我們非常感謝您在我們的問題追蹤器 [YouTrack](https://youtrack.jetbrains.com/issue/KT-76926) 中提供回饋。

## Kotlin/JVM：在 when 表達式中支援 invokedynamic
<primary-label ref="experimental-opt-in"/> 

在 Kotlin %kotlinEapVersion% 中，您現在可以使用 `invokedynamic` 編譯 `when` 表達式。
以前，帶有多個型別檢查的 `when` 表達式會編譯為字節碼中一長串的 `instanceof` 檢查。

現在，您可以在 `when` 表達式中使用 `invokedynamic` 生成更小的字節碼，類似於 Java `switch` 陳述式生成的字節碼，當滿足以下條件時：

* 除 `else` 之外的所有條件均為 `is` 或 `null` 檢查。
* 表達式不包含[守衛條件 (`if`)](control-flow.md#guard-conditions-in-when-expressions)。
* 條件不包括不能直接進行型別檢查的型別，例如可變的 Kotlin 集合 (`MutableList`) 或函式型別 (`kotlin.Function1`、`kotlin.Function2` 等)。
* 除了 `else` 之外，至少有兩個條件。
* 所有分支都檢查 `when` 表達式的相同主體。

例如：

```kotlin
open class Example

class A : Example()
class B : Example()
class C : Example()

fun test(e: Example) = when (e) {
    // Uses invokedynamic with SwitchBootstraps.typeSwitch
    is A -> 1
    is B -> 2
    is C -> 3
    else -> 0
}
```

啟用新功能後，此範例中的 `when` 表達式編譯為單個 `invokedynamic` 型別開關，而非多個 `instanceof` 檢查。

要啟用此功能，請使用 JVM 目標 21 或更高版本編譯您的 Kotlin 程式碼，並新增以下編譯器選項：

```bash
-Xwhen-expressions=indy
```

或者將其新增到您 `build.gradle(.kts)` 檔案的 `compilerOptions {}` 區塊中：

```kotlin
kotlin {
    compilerOptions {
        freeCompilerArgs.add("-Xwhen-expressions=indy")
    }
}
```

此功能為[實驗性](components-stability.md#stability-levels-explained)。如果您有任何回饋或問題，請在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-65688) 中分享。

## Kotlin 多平台

Kotlin %kotlinEapVersion% 為 Kotlin Multiplatform 帶來了重大變革：預設啟用 Swift 匯出，有一個新的共享原始碼集，您可以嘗試一種管理通用依賴項的新方法。

### 預設啟用 Swift 匯出
<primary-label ref="experimental-general"/> 

Kotlin %kotlinEapVersion% 引入了對 Swift 匯出的實驗性支援。它允許您直接匯出 Kotlin 原始碼，並以地道的方式從 Swift 呼叫 Kotlin 程式碼，無需 Objective-C 標頭。

這應該會顯著改善 Apple 目標的多平台開發。例如，如果您有一個包含頂層函式的 Kotlin 模組，Swift 匯出允許乾淨、模組特定的匯入，消除令人困惑的 Objective-C 底線和混淆名稱。

主要功能包括：

* **多模組支援**。每個 Kotlin 模組都作為單獨的 Swift 模組匯出，簡化了函式呼叫。
* **套件支援**。Kotlin 套件在匯出期間會被明確保留，避免在生成的 Swift 程式碼中發生命名衝突。
* **型別別名**。Kotlin 型別別名會被匯出並在 Swift 中保留，提高了可讀性。
* **原始型別的增強型別空值性**。與需要將 `Int?` 等型別封裝成 `KotlinInt` 等包裝類來保留空值性的 Objective-C 互通不同，Swift 匯出直接轉換空值性資訊。
* **多載**。您可以在 Swift 中呼叫 Kotlin 的多載函式而沒有歧義。
* **扁平化的套件結構**。您可以將 Kotlin 套件翻譯成 Swift 列舉，從生成的 Swift 程式碼中移除套件前綴。
* **模組名稱客製化**。您可以在 Kotlin 專案的 Gradle 設定中自訂生成的 Swift 模組名稱。

#### 如何啟用 Swift 匯出

此功能目前是[實驗性](components-stability.md#stability-levels-explained)的，並且僅適用於使用[直接整合](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-direct-integration.html)將 iOS 框架連接到 Xcode 專案的專案中。這是使用 IntelliJ IDEA 中的 Kotlin Multiplatform 插件或透過 [網頁精靈](https://kmp.jetbrains.com/) 建立的 Kotlin Multiplatform 專案的標準配置。

要試用 Swift 匯出，請配置您的 Xcode 專案：

1. 在 Xcode 中，開啟專案設定。
2. 在 **Build Phases** 標籤頁上，找到帶有 `embedAndSignAppleFrameworkForXcode` 任務的 **Run Script** 階段。
3. 調整腳本以改為在執行腳本階段使用 `embedSwiftExportForXcode` 任務：

  ```bash
  ./gradlew :<Shared module name>:embedSwiftExportForXcode
  ```

  ![Add the Swift export script](xcode-swift-export-run-script-phase.png){width=700}

4. 建置專案。Swift 模組會生成在建置輸出目錄中。

此功能預設可用。如果您在之前的版本中已啟用它，您現在可以從您的 `gradle.properties` 檔案中移除 `kotlin.experimental.swift-export.enabled`。

> 為了節省時間，請克隆我們已設定好 Swift 匯出的[公開範例](https://github.com/Kotlin/swift-export-sample)。
>
{style="tip"}

有關 Swift 匯出的更多資訊，請參閱其 [README](https://github.com/JetBrains/kotlin/tree/master/docs/swift-export#readme)。

#### 提供回饋

我們計劃在未來的 Kotlin 版本中擴展並逐步穩定 Swift 匯出支援。在 Kotlin 2.2.20 之後，我們將專注於改進 Kotlin 和 Swift 之間的互通性，特別是在協程和流方面。

對 Swift 匯出的支援是 Kotlin Multiplatform 的一項重大變革。我們非常感謝您的回饋：

* 在 Kotlin Slack 中直接聯絡開發團隊 – [取得邀請](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up?_gl=1*ju6cbn*_ga*MTA3MTk5NDkzMC4xNjQ2MDY3MDU4*_ga_9J976DJZ68*MTY1ODMzNzA3OS4xMDAuMS4xNjU4MzQwODEwLjYw) 並加入 [#swift-export](https://kotlinlang.slack.com/archives/C073GUW6WN9) 頻道。
* 報告您在使用 Swift 匯出時遇到的任何問題，請在 [YouTrack](https://kotl.in/issue) 中提出。

### js 和 wasmJs 目標的共享原始碼集

以前，Kotlin Multiplatform 預設不包含針對 JavaScript (`js`) 和 WebAssembly (`wasmJs`) 網頁目標的共享原始碼集。
為了在 `js` 和 `wasmJs` 之間共享程式碼，您必須手動配置自定義原始碼集，或在兩個地方編寫程式碼，一個版本用於 `js`，另一個用於 `wasmJs`。例如：

```kotlin
// commonMain
expect suspend fun readCopiedText(): String

// jsMain
external interface Navigator { val clipboard: Clipboard }
// Different interop in JS and Wasm
external interface Clipboard { fun readText(): Promise<String> } 
external val navigator: Navigator

suspend fun readCopiedText(): String {
  // Different interop in JS and Wasm
    return navigator.clipboard.readText().await() 
}

// wasmJsMain
external interface Navigator { val clipboard: Clipboard }
external interface Clipboard { fun readText(): Promise<JsString> }
external val navigator: Navigator

suspend fun readCopiedText(): String {
    return navigator.clipboard.readText().await().toString() 
}
```

從此版本開始，當使用預設層次結構範本時，Kotlin Gradle 插件為 Web 新增了一個共享原始碼集（包含 `webMain` 和 `webTest`）。

經過此變更，`web` 原始碼集成為 `js` 和 `wasmJs` 原始碼集的父級。更新後的原始碼集層次結構如下所示：

![An example of using the default hierarchy template with web](default-hierarchy-example-with-web.svg)

新的原始碼集允許您編寫一份程式碼，適用於 `js` 和 `wasmJs` 目標。
您可以將共享程式碼放在 `webMain` 中，它會自動適用於這兩個目標：

```kotlin
// commonMain
expect suspend fun readCopiedText(): String

// webMain
external interface Navigator { val clipboard: Clipboard }
external interface Clipboard { fun readText(): Promise<JsString> }
external val navigator: Navigator

suspend fun readCopiedText(): String {
    return navigator.clipboard.readText().await().toString()
}
```

此更新簡化了 `js` 和 `wasmJs` 目標之間的程式碼共享。這在兩種情況下特別有用：

* 對於想要添加對 `js` 和 `wasmJs` 目標支援的函式庫作者，無需重複程式碼。
* 對於建立以 Web 為目標的 Compose Multiplatform 應用程式的開發人員，啟用對 `js` 和 `wasmJs` 目標的交叉編譯，以實現更廣泛的瀏覽器相容性。鑑於這種回退模式，當您建立網站時，它將在所有瀏覽器上開箱即用：現代瀏覽器使用 `wasmJs`，而舊瀏覽器使用 `js`。

要嘗試此功能，請在您的 `build.gradle(.kts)` 檔案的 `kotlin {}` 區塊中，使用[預設層次結構範本](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-hierarchy.html#default-hierarchy-template)。

```kotlin
kotlin {
    js()
    wasmJs()

    // Enables the default source set hierarchy, including webMain and webTest
    applyDefaultHierarchyTemplate()
}
```

在使用預設層次結構之前，如果您有具有自定義共享原始碼集的專案，或者您重新命名了 `js("web")` 目標，請仔細考慮任何潛在衝突。要解決這些衝突，請重新命名衝突的原始碼集或目標，或不要使用預設層次結構。

### Kotlin 函式庫的穩定跨平台編譯

Kotlin %kotlinEapVersion% 完成了一個重要的[路線圖項目](https://youtrack.jetbrains.com/issue/KT-71290)，穩定化 Kotlin 函式庫的跨平台編譯。

您現在可以使用任何主機生成 `.klib` 構件，用於發佈 Kotlin 函式庫。這顯著簡化了發佈過程，特別是對於以前需要 Mac 機器才能實現的 Apple 目標。

此功能預設可用。如果您已啟用帶有 `kotlin.native.enableKlibsCrossCompilation=true` 的交叉編譯，您現在可以從您的 `gradle.properties` 檔案中移除它。

不幸的是，仍然存在一些限制。您仍然需要在以下情況下使用 Mac 機器：

* 您的函式庫具有 [cinterop 依賴項](native-c-interop.md)。
* 您的專案中設定了 [CocoaPods 整合](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-cocoapods-overview.html)。
* 您需要為 Apple 目標建置或測試[最終二進制檔案](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-build-native-binaries.html)。

有關多平台函式庫發佈的更多資訊，請參閱我們的[文件](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-publish-lib-setup.html)。

### 宣告通用依賴項的新方法
<primary-label ref="experimental-opt-in"/>

為了簡化使用 Gradle 設定多平台專案，Kotlin %kotlinEapVersion% 現在允許您在 `kotlin {}` 區塊中，透過使用頂層的 `dependencies {}` 區塊來宣告通用依賴項。這些依賴項的行為就像它們被宣告在 `commonMain` 原始碼集中一樣。此功能的工作方式與您用於 Kotlin/JVM 和僅 Android 專案的依賴項區塊類似，並且它現在在 Kotlin Multiplatform 中是[實驗性](components-stability.md#stability-levels-explained)的。在專案層級宣告通用依賴項減少了跨原始碼集的重複配置，並有助於簡化您的建置設定。您仍然可以根據需要在每個原始碼集中新增平台特定的依賴項。

要嘗試此功能，請在頂層 `dependencies {}` 區塊之前，新增 `@OptIn(ExperimentalKotlinGradlePluginApi::class)` 註解以選擇啟用。例如：

```kotlin
kotlin {
    @OptIn(ExperimentalKotlinGradlePluginApi::class)
    dependencies {
        implementation("org.jetbrains.kotlinx:kotlinx-coroutines-core:%coroutinesVersion%")
    }
}
```

我們非常感謝您在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-76446) 中對此功能的回饋。

## Kotlin/Native

Kotlin %kotlinEapVersion% 為 Kotlin/Native 二進制檔案和偵錯帶來了改進。

### 二進制檔案中對堆疊 Canary 的支援

從 %kotlinEapVersion% 開始，Kotlin 新增了對生成的 Kotlin/Native 二進制檔案中堆疊 Canary 的支援。作為堆疊保護的一部分，此安全功能可防止堆疊溢出，緩解一些常見的應用程式漏洞。它已經在 Swift 和 Objective-C 中可用，現在在 Kotlin 中也得到支援。

Kotlin/Native 中堆疊保護的實作遵循 [Clang](https://clang.llvm.org/docs/ClangCommandLineReference.html#cmdoption-clang-fstack-protector) 中堆疊保護器的行為。

要啟用堆疊 Canary，請將以下[二進制選項](native-binary-options.md)新增到您的 `gradle.properties` 檔案中：

```none
kotlin.native.binary.stackProtector=yes
```

此屬性為所有容易受到堆疊溢出攻擊的 Kotlin 函式啟用此功能。替代模式為：

* `kotlin.native.binary.stackProtector=strong`，它為容易受到堆疊溢出攻擊的函式使用更強大的啟發式演算法。
* `kotlin.native.binary.stackProtector=all`，它為所有函式啟用堆疊保護器。

請注意，在某些情況下，堆疊保護可能會帶來效能成本。

### 縮小發佈二進制檔案大小
<primary-label ref="experimental-opt-in"/> 

Kotlin %kotlinEapVersion% 引入了 `smallBinary` 選項，它可以幫助您縮小發佈二進制檔案的大小。
新選項有效地將 `-Oz` 設定為 LLVM 編譯階段編譯器的預設優化參數。

啟用 `smallBinary` 選項後，您可以使發佈的二進制檔案更小，並縮短建置時間。但是，在某些情況下它可能會影響運行時效能。

新功能目前是[實驗性](components-stability.md#stability-levels-explained)的。要在您的專案中試用它，請將以下[二進制選項](native-binary-options.md)新增到您的 `gradle.properties` 檔案中：

```none
kotlin.native.binary.smallBinary=true
```

Kotlin 團隊感謝 [Troels Lund](https://github.com/troelsbjerre) 協助實作此功能。

### 改進的偵錯器物件摘要

Kotlin/Native 現在為 LLDB 和 GDB 等偵錯工具生成更清晰的物件摘要。這提高了生成的偵錯資訊的可讀性，並簡化了您的偵錯體驗。

以前，如果您檢查一個物件，例如：

```kotlin
class Point(val x: Int, val y: Int)
val point = Point(1, 2)
```

您會看到有限的資訊，包括指向記憶體位址的指標：

```none
(lldb) v point
(ObjHeader *) point = [x: ..., y: ...]
(lldb) v point->x
(int32_t *) x = 0x0000000100274048
```

透過 Kotlin %kotlinEapVersion%，偵錯器顯示更豐富的細節，包括實際值：

```none
(lldb) v point
(ObjHeader *) point = Point(x=1, y=2)
(lldb) v point->x
(int32_t) point->x = 1
```

Kotlin 團隊感謝 [Nikita Nazarov](https://github.com/nikita-nazarov) 協助實作此功能。

有關 Kotlin/Native 中偵錯的更多資訊，請參閱[文件](native-debugging.md)。

## Kotlin/Wasm

Kotlin/Wasm 獲得了一些生活品質改進，包括分離的 npm 依賴項和 JavaScript 互通的異常處理改進。

### 分離的 npm 依賴項

以前，在您的 Kotlin/Wasm 專案中，所有 [npm](https://www.npmjs.com/) 依賴項都一同安裝在您的專案資料夾中。它包括您自己的依賴項和 Kotlin 工具鏈依賴項。這些依賴項也一併記錄在您的專案鎖定檔案（`package-lock.json` 或 `yarn.lock`）中。

因此，每當 Kotlin 工具鏈依賴項更新時，您都必須更新您的鎖定檔案，即使您沒有新增或更改任何內容。

從 Kotlin %kotlinEapVersion% 開始，Kotlin 工具鏈 npm 依賴項會安裝在您的專案之外。現在，工具鏈和使用者依賴項擁有單獨的目錄：

* **工具鏈依賴項目錄：**

  `<kotlin-user-home>/kotlin-npm-tooling/<yarn|npm>/hash/node_modules`

* **使用者依賴項目錄：**

  `build/wasm/node_modules`

此外，專案目錄中的鎖定檔案只包含使用者定義的依賴項。

此改進使您的鎖定檔案僅關注您自己的依賴項，有助於維護更整潔的專案，並減少對您檔案的不必要更改。

此變更預設啟用，適用於 `wasm-js` 目標。此變更尚未實作，適用於 `js` 目標。儘管計劃在未來版本中實作，但在 Kotlin %kotlinEapVersion% 中，npm 依賴項的行為對於 `js` 目標保持不變。

### Kotlin/Wasm 和 JavaScript 互通中的異常處理改進

以前，Kotlin 難以理解在 JavaScript (JS) 中拋出並傳遞到 Kotlin/Wasm 程式碼的異常（錯誤）。

在某些情況下，問題也會反向發生，當異常透過 Wasm 程式碼拋出或傳遞到 JS 時，並被包裝成 `WebAssembly.Exception`，沒有任何詳細資訊。這些 Kotlin 異常處理問題使偵錯變得困難。

從 Kotlin %kotlinEapVersion% 開始，異常處理的開發者體驗在兩個方向上都有所改進：

* 當異常從 JavaScript 拋出時：您可以在 Kotlin 端看到更多資訊。
  當此類異常透過 Kotlin 傳播回 JS 時，它不再被包裝成 WebAssembly。
* 當異常從 Kotlin 拋出時：它們現在可以在 JavaScript 端作為 JS 錯誤被捕獲。

新的異常處理會自動工作，在支援 [`WebAssembly.JSTag`](https://webassembly.github.io/exception-handling/js-api/#dom-webassembly-jstag) 功能的現代瀏覽器中：

* Chrome 115+
* Firefox 129+
* Safari 18.4+

在舊瀏覽器中，異常處理行為保持不變。

## Kotlin/JS

Kotlin %kotlinEapVersion% 支援使用 `BigInt` 型別來表示 Kotlin 的 `Long` 型別，啟用在匯出宣告中使用 `Long`。此外，此版本新增了一個 DSL 函式，用於清理 Node.js 引數。

### 使用 BigInt 型別表示 Kotlin 的 Long 型別
<primary-label ref="experimental-opt-in"/>

在 ES2020 標準之前，JavaScript (JS) 不支援原始型別，用於精確大於 53 位的整數。

因此，Kotlin/JS 以前將 `Long` 值（64 位寬）表示為包含兩個 `number` 屬性的 JavaScript 物件。此自定義實作使 Kotlin 和 JavaScript 之間的互通性更加複雜。

從 Kotlin %kotlinEapVersion% 開始，當編譯到現代 JavaScript (ES2020) 時，Kotlin/JS 現在使用 JavaScript 內建的 `BigInt` 型別來表示 Kotlin 的 `Long` 值。

此變更啟用[將 `Long` 型別匯出到 JavaScript](#usage-of-long-in-exported-declarations)，該功能也隨 %kotlinEapVersion% 一同引入。因此，此變更簡化了 Kotlin 和 JavaScript 之間的互通性。

要啟用它，請將以下編譯器選項新增到您的 `build.gradle(.kts)` 檔案中：

```kotlin
// build.gradle.kts
kotlin {
    js {
        ...
        compilerOptions {
            freeCompilerArgs.add("-Xes-long-as-bigint")
        }
    }
}
```

此功能仍然是[實驗性](components-stability.md#stability-levels-explained)的。
請在我們的問題追蹤器 [YouTrack](https://youtrack.jetbrains.com/issue/KT-57128) 中報告任何問題。

#### 在匯出宣告中使用 Long

因為 Kotlin/JS 使用了自定義的 `Long` 表示，因此很難提供一種直接的方式從 JavaScript 與 Kotlin 的 `Long` 進行互動。因此，您無法將使用 `Long` 型別的 Kotlin 程式碼匯出到 JavaScript。
此問題影響了任何使用 `Long` 的程式碼，例如函式參數、類屬性或建構函式。

既然 Kotlin 的 `Long` 型別可以編譯為 JavaScript 的 `BigInt` 型別，Kotlin/JS 支援將 `Long` 值匯出到 JavaScript，簡化了 Kotlin 和 JavaScript 程式碼之間的互通性。

要啟用此功能：

1. 允許在 Kotlin/JS 中匯出 `Long`。將以下編譯器引數新增到您的 `build.gradle(.kts)` 檔案中的 `freeCompilerArgs` 屬性：

    ```kotlin
    // build.gradle.kts
    kotlin {
        js {
            ...
            compilerOptions {                   
                freeCompilerArgs.add("-XXLanguage:+JsAllowLongInExportedDeclarations")
            }
        }
    }
    ```

2. 啟用 `BigInt` 型別。有關如何啟用它，請參閱[使用 `BigInt` 型別表示 Kotlin 的 `Long` 型別](#usage-of-bigint-type-to-represent-kotlin-s-long-type)。

### 用於更簡潔引數的新 DSL 函式

當使用 Node.js 執行 Kotlin/JS 應用程式時，傳遞給程式 (`args`) 的引數以前包括：

* 可執行檔 `Node` 的路徑。
* 您的腳本路徑。
* 您提供的實際命令列引數。

然而，`args` 的預期行為是僅包含命令列引數。為了實現這一點，您必須手動跳過前兩個引數，在您的 `build.gradle(.kts)` 檔案或 Kotlin 程式碼中使用 `drop()` 函式：

```kotlin
fun main(args: Array<String>) {
    println(args.drop(2).joinToString(", "))
}
```

這種變通方法是重複的、容易出錯的，並且在平台之間共享程式碼時效果不佳。

為了解決此問題，Kotlin %kotlinEapVersion% 引入了一個新的 DSL 函式，名為 `passCliArgumentsToMainFunction()`。

使用此函式，引數只包含命令列引數，並排除 `Node` 和腳本路徑：

```kotlin
fun main(args: Array<String>) {
    // No need for drop() and only your custom arguments are included 
    println(args.joinToString(", "))
}
```

此變更減少了樣板程式碼，避免了手動刪除引數造成的錯誤，並提高了跨平台相容性。

要啟用此功能，請將以下 DSL 函式新增到您的 `build.gradle(.kts)` 檔案中：

```kotlin
kotlin {
    js {
        nodejs {
            passCliArgumentsToMainFunction()
        }
    }
}
```

## Gradle：Kotlin/Native 任務的建置報告中新增編譯器效能指標

在 Kotlin 1.7.0 中，我們引入了[建置報告](gradle-compilation-and-caches.md#build-reports)以協助追蹤編譯器效能。從那時起，我們新增了更多指標，使這些報告更加詳細和有用，用於調查效能問題。

在 Kotlin %kotlinEapVersion% 中，建置報告現在包含適用於 Kotlin/Native 任務的編譯器效能指標。

要了解有關建置報告以及如何配置它們的更多資訊，請參閱[啟用建置報告](gradle-compilation-and-caches.md#enabling-build-reports)。

## Maven：kotlin-maven-plugin 中對 Kotlin 守護行程的支援

隨著 [Kotlin 2.2.0 中建置工具 API](whatsnew22.md#new-experimental-build-tools-api) 的引入，Kotlin %kotlinEapVersion% 更進一步，透過在 `kotlin-maven-plugin` 中新增對 Kotlin 守護行程的支援。當使用 Kotlin 守護行程時，Kotlin 編譯器在一個獨立的程序中運行，這可以防止其他 Maven 插件覆寫系統屬性。您可以在此 [YouTrack 問題](https://youtrack.jetbrains.com/issue/KT-43894/Maven-Windows-error-RuntimeException-Could-not-find-installation-home-path) 中看到一個範例。

從 Kotlin %kotlinEapVersion% 開始，Kotlin 守護行程預設啟用。這為您帶來了[增量編譯](maven.md#enable-incremental-compilation)的額外好處，這可以幫助加快您的建置時間。如果您想恢復到以前的行為，請透過在您的 `pom.xml` 檔案中將以下屬性設定為 `false` 來選擇退出：

```xml
<properties>
    <kotlin.compiler.daemon>false</kotlin.compiler.daemon>
</properties>
```

Kotlin %kotlinEapVersion% 還引入了一個新的 `jvmArgs` 屬性，您可以使用它來自訂適用於 Kotlin 守護行程的預設 JVM 引數。例如，要覆寫 `-Xmx` 和 `-Xms` 選項，請將以下內容新增到您的 `pom.xml` 檔案中：

```xml
<properties>
    <kotlin.compiler.daemon.jvmArgs>Xmx1500m,Xms500m</kotlin.compiler.daemon.jvmArgs>
</properties>
```

## 標準函式庫：Kotlin/JS 中透過反射識別介面型別的支援
<primary-label ref="experimental-opt-in"/>

Kotlin %kotlinEapVersion% 將實驗性 `KClass.isInterface` 屬性新增到 Kotlin/JS 標準函式庫。

透過此屬性，您現在可以檢查類引用是否代表 Kotlin 介面。這使 Kotlin/JS 更接近與 Kotlin/JVM 的對等，在 Kotlin/JVM 中，您可以使用 `KClass.java.isInterface` 來檢查類是否代表介面。

要選擇啟用，請使用 `@OptIn(ExperimentalStdlibApi::class)` 註解：

```kotlin
@OptIn(ExperimentalStdlibApi::class)
fun inspect(klass: KClass<*>) {
    // Prints true for interfaces
    println(klass.isInterface)
}
```

我們非常感謝您在我們的問題追蹤器 [YouTrack](https://youtrack.jetbrains.com/issue/KT-78581) 中提供回饋。