[//]: # (title: Kotlin %kotlinEapVersion% 有什麼新功能)

<primary-label ref="eap"/>

_[發佈日期：%kotlinEapReleaseDate%](eap.md#build-details)_

> 本文件不涵蓋搶先體驗預覽版 (EAP) 的所有功能，
> 但它強調了一些主要改進。
>
> 請參閱 [GitHub 變更日誌](https://github.com/JetBrains/kotlin/releases/tag/v%kotlinEapVersion%) 中的完整變更列表。
>
{style="note"}

Kotlin %kotlinEapVersion% 版本已發佈！以下是此 EAP 版本的一些詳細資訊：

*   **語言**：[更穩定且預設啟用的功能、新的未使用回傳值檢查器，以及上下文感知解析的變更](#language)。
*   **Kotlin/JVM**：[支援 Java 25](#kotlin-jvm-support-for-java-25)。
*   **Kotlin/Native**：[透過 Swift 匯出改善互通性](#kotlin-native-improved-interop-through-swift-export)。
*   **Kotlin/Wasm**：[預設啟用完整限定名稱和新的例外處理提案](#kotlin-wasm)。
*   **Kotlin/JS**：[新的實驗性 suspend 函式匯出和 `LongArray` 表示方式](#kotlin-js)。
*   **Gradle**：[與 Gradle 9.0 相容，以及用於註冊生成原始碼的新 API](#gradle)。
*   **標準函式庫**：[穩定的時間追蹤功能](#standard-library)。

## IDE 支援

支援 %kotlinEapVersion% 的 Kotlin 插件已捆綁在最新版本的 IntelliJ IDEA 和 Android Studio 中。
您無需更新 IDE 中的 Kotlin 插件。
您只需在建置腳本中將 [Kotlin 版本變更](configure-build-for-eap.md) 為 %kotlinEapVersion%。

有關詳細資訊，請參閱[更新到新版本](releases.md#update-to-a-new-kotlin-version)。

## 語言

Kotlin %kotlinEapVersion% 專注於功能穩定化，引入了新的未使用回傳值檢查機制，
並改進了上下文感知解析。

### 穩定功能

在先前的 Kotlin 版本中，一些新的語言功能以實驗性 (Experimental) 和 Beta 階段推出。
我們很高興地宣布，在此版本中，以下功能已成為[穩定版](components-stability.md#stability-levels-explained)：

*   [支援巢狀型別別名](whatsnew22.md#support-for-nested-type-aliases)
*   [基於資料流的 `when` 表達式詳盡性檢查](whatsnew2220.md#data-flow-based-exhaustiveness-checks-for-when-expressions)

### 預設啟用功能

在 Kotlin %kotlinEapVersion% 中，以下語言功能現在預設啟用：

*   [改進了帶有 `suspend` 函式型別的 lambda 函式重載解析](whatsnew2220.md#improved-overload-resolution-for-lambdas-with-suspend-function-types)
*   [支援在具有明確回傳型別的表達式主體中使用 `return` 陳述式](whatsnew2220.md#support-for-return-statements-in-expression-bodies-with-explicit-return-types)

[請參閱 Kotlin 語言設計功能和提案的完整列表](kotlin-language-features-and-proposals.md)。

### 未使用回傳值檢查器
<primary-label ref="experimental-general"/>

Kotlin %kotlinEapVersion% 引入了一項新功能：未使用回傳值檢查器。
當表達式回傳的值不是 `Unit` 或 `Nothing`，且未傳遞給函式、未在條件中檢查或未以其他方式使用時，此功能會發出警告。

您可以使用它來捕獲錯誤，例如函式呼叫產生有意義的結果，但結果卻被默默丟棄，這可能導致意外行為或難以追蹤的問題。

> 檢查器會忽略來自遞增操作（例如 `++` 和 `--`）的回傳值。
>
{style="note"}

請考慮以下範例：

```kotlin
fun formatGreeting(name: String): String {
    if (name.isBlank()) return "Hello, anonymous user!"
    if (!name.contains(' ')) {
        // 檢查器報告此結果被忽略的警告
        "Hello, " + name.replaceFirstChar(Char::titlecase) + "!"
    }
    val (first, last) = name.split(' ')
    return "Hello, $first! Or should I call you Dr. $last?"
}
```

在此範例中，建立了一個字串但從未使用，因此檢查器將其報告為被忽略的結果。

此功能為[實驗性](components-stability.md#stability-levels-explained)。
若要啟用，請將以下編譯器選項新增至您的 `build.gradle.kts` 檔案：

```kotlin
kotlin {
    compilerOptions {
        freeCompilerArgs.add("-Xreturn-value-checker=check")
    }
}
```

使用此選項，檢查器僅報告來自已標記表達式的被忽略結果，就像 Kotlin 標準函式庫中的大多數函式一樣。

若要標記您的函式，請使用 `@MustUseReturnValues` 註解來標記您希望檢查器報告被忽略回傳值的範圍。

例如，您可以標記整個檔案：

```kotlin
// 標記此檔案中的所有函式和類別，以便檢查器報告未使用回傳值
@file:MustUseReturnValues

package my.project

fun someFunction(): String
```

或特定類別：

```kotlin
// 標記此類別中的所有函式，以便檢查器報告未使用回傳值
@MustUseReturnValues
class Greeter {
    fun greet(name: String): String = "Hello, $name"
}

fun someFunction(): Int = ...
```
{validate="false"}

您也可以使用 `full` 模式標記您的整個專案。
為此，請將以下編譯器選項新增至您的 `build.gradle.kts` 檔案：

```kotlin
kotlin {
    compilerOptions {
        freeCompilerArgs.add("-Xreturn-value-checker=full")
    }
}
```

在此模式下，Kotlin 會自動將您編譯的檔案視為已使用 `@MustUseReturnValues` 註解標記，
因此檢查器會套用到您專案函式的所有回傳值。

您可以透過使用 `@IgnorableReturnValue` 註解標記特定函式來抑制警告。
註解那些忽略結果很常見且預期的函式，例如 `MutableList.add`：

```kotlin
@IgnorableReturnValue
fun <T> MutableList<T>.addAndIgnoreResult(element: T): Boolean {
    return add(element)
}
```

您可以抑制警告，而無需將函式本身標記為可忽略。
為此，請將結果指定給一個帶有底線語法 (`_`) 的特殊匿名變數：

```kotlin
// 不可忽略的函式
fun computeValue(): Int = 42

fun main() {

    // 報告警告：結果被忽略
    computeValue()

    // 僅在此呼叫站點使用特殊未使用變數抑制警告
    val _ = computeValue()
}
```

我們非常感謝您在 [YouTrack](https://youtrack.com/issue/KT-12719) 中提供回饋。有關更多資訊，
請參閱該功能的 [KEEP](https://github.com/Kotlin/KEEP/blob/main/proposals/KEEP-0412-unused-return-value-checker.md)。

### 上下文感知解析的變更
<primary-label ref="experimental-general"/>

> 目前，IntelliJ IDEA 中對此功能的程式碼分析、程式碼補齊和語法突顯支援僅在 [2025.3 EAP 版本](https://www.jetbrains.com/idea/nextversion/)中提供。
>
{style = "note"}

上下文感知解析仍為[實驗性](components-stability.md#stability-levels-explained)，
但我們將根據使用者回饋持續改進此功能：

*   現在將目前型別的 sealed 和封閉超型別視為搜尋上下文範圍的一部分。不考慮其他超型別範圍。
*   在涉及型別運算符和相等性的情況下，如果使用上下文感知解析導致解析模糊，編譯器現在會報告警告。例如，當匯入類別的衝突宣告時，可能會發生這種情況。

有關詳細資訊，請參閱 [KEEP](https://github.com/Kotlin/KEEP/blob/main/proposals/KEEP-0379-context-sensitive-resolution.md) 中當前提案的完整文字。

## Kotlin/JVM：支援 Java 25

從 Kotlin %kotlinEapVersion% 開始，編譯器可以生成包含 Java 25 位元組碼的類別。

## Kotlin/Native：透過 Swift 匯出改善互通性
<primary-label ref="experimental-general"/>

Kotlin %kotlinEapVersion% 透過 Swift 匯出進一步改善了 Kotlin 與 Swift 的互通性，新增了對原生列舉類別和可變參數函式支援。

以前，Kotlin 的列舉會匯出為普通的 Swift 類別。現在映射是直接的，您可以直接使用常規的原生 Swift 列舉。例如：

```kotlin
// Kotlin
enum class Color(val rgb: Int) {
    RED(0xFF0000),
    GREEN(0x00FF00),
    BLUE(0x0000FF)
}

val color = Color.RED
```

```Swift
// Swift
public enum Color: Swift.CaseIterable, Swift.LosslessStringConvertible, Swift.RawRepresentable {
    case RED, GREEN, BLUE

    var rgb: Int { get } 
}
```

Kotlin 的 [`vararg`](functions.md#variable-number-of-arguments-varargs) 函式現在也直接映射到 Swift 的可變參數函式參數。

此類函式允許您傳遞可變數量的引數。當您不知道引數的數量或想要建立或傳遞集合而無需指定其型別時，這非常有用。例如：

```kotlin
// Kotlin
fun log(vararg messages: String)
```

```Swift
// Swift
public func log(messages: Swift.String...)
```

> 可變參數函式參數中的泛型型別尚未支援。
>
{style="note"}

## Kotlin/Wasm

### 預設啟用完整限定名稱

在 Kotlin/Wasm 目標上，完整限定名稱 (FQNs) 在運行時並未預設啟用。
您必須手動啟用對 `KClass.qualifiedName` 屬性的支援。

以前，只有類別名稱（不包含套件）可存取，這導致了從 JVM 移植到 Wasm 目標的程式碼或期望在運行時使用完整限定名稱的函式庫出現問題。

在 Kotlin %kotlinEapVersion% 中，`KClass.qualifiedName` 屬性在 Kotlin/Wasm 目標上預設啟用。
這表示 FQNs 在運行時無需任何額外配置即可使用。

預設啟用 FQNs 提高了程式碼的可移植性，並透過顯示完整限定名稱使運行時錯誤更具資訊性。

由於編譯器優化，使用 Latin-1 字串常值（string literals）的緊湊儲存方式來減少中繼資料，此變更不會增加編譯後的 Wasm 二進位檔案大小。

### `wasmWasi` 預設啟用新的例外處理提案

以前，Kotlin/Wasm 對所有目標，包括 [`wasmWasi`](wasm-overview.md#kotlin-wasm-and-wasi)，都使用[舊版例外處理提案](https://github.com/WebAssembly/exception-handling/blob/master/proposals/exception-handling/legacy/Exceptions.md)。然而，大多數獨立的 WebAssembly 虛擬機器 (VM) 正在與[新版例外處理提案](https://github.com/WebAssembly/exception-handling/blob/main/proposals/exception-handling/Exceptions.md)保持一致。

從 Kotlin %kotlinEapVersion% 開始，`wasmWasi` 目標預設啟用新的 WebAssembly 例外處理提案，確保與現代 WebAssembly 運行時更好地相容。

對於 `wasmWasi` 目標，此變更引入得早是安全的，因為針對它的應用程式通常在較不複雜的運行時環境中執行（通常在單一特定 VM 上執行），並且通常由使用者控制，從而降低了相容性問題的風險。

對於 [`wasmJs` 目標](wasm-overview.md#kotlin-wasm-and-compose-multiplatform)，新的例外處理提案預設仍為關閉。
您可以使用 `-Xwasm-use-new-exception-proposal` 編譯器選項手動啟用它。

## Kotlin/JS

### 使用 `JsExport` 匯出 suspend 函式的新方法
<primary-label ref="experimental-opt-in"/>

以前，`@JsExport` 註解不允許將 suspend 函式（或包含此類函式的類別和介面）匯出到 JavaScript。您必須手動包裝每個 suspend 函式，這既麻煩又容易出錯。

從 Kotlin %kotlinEapVersion% 開始，suspend 函式可以使用 `@JsExport` 註解直接匯出到 JavaScript。

啟用 suspend 函式匯出消除了樣板程式碼的需求，並改進了 Kotlin/JS 和 JavaScript/TypeScript (JS/TS) 之間的互通性。Kotlin 的非同步函式現在可以直接從 JS/TS 呼叫，無需額外程式碼。

若要啟用此功能，請將以下編譯器選項新增至您的 `build.gradle.kts` 檔案：

```kotlin
kotlin {
    compilerOptions {
        freeCompilerArgs.add("-Xenable-suspend-function-exporting")
    }
}
```

啟用後，標記有 `@JsExport` 註解的類別和函式可以包含 suspend 函式，而無需額外的包裝器。

它們可以作為常規 JavaScript 非同步函式使用，也可以作為非同步函式被覆寫：

```kotlin
@JsExport
open class Foo {
    suspend fun foo() = "Foo"
}
```

```typescript
class Bar extends Foo {
    override async foo(): Promise<string> {
        return "Bar"
    }
}
```

此功能為[實驗性](components-stability.md#stability-levels-explained)。我們非常感謝您在我們的問題追蹤器 [YouTrack](https://youtrack.jetbrains.com/issue/KT-56281/KJS-Cant-export-suspend-functions) 中提供回饋。

### 使用 `BigInt64Array` 型別表示 Kotlin 的 `LongArray` 型別
<primary-label ref="experimental-opt-in"/>

以前，Kotlin/JS 將 `LongArray` 表示為 JavaScript 的 `Array<bigint>`。這種方法可行，但對於與期望型別化陣列的 JavaScript API 互通性而言並不理想。

從此版本開始，Kotlin/JS 現在在編譯為 JavaScript 時，使用 JavaScript 內建的 `BigInt64Array` 型別來表示 Kotlin 的 `LongArray` 值。

使用 `BigInt64Array` 簡化了與使用型別化陣列的 JavaScript API 的互通性。它還允許接受或回傳 `LongArray` 的 API 更自然地從 Kotlin 匯出到 JavaScript。

若要啟用此功能，請將以下編譯器選項新增至您的 `build.gradle.kts` 檔案：

```kotlin
kotlin {
    js {
        // ...
        compilerOptions {
            freeCompilerArgs.add("-Xes-long-as-bigint")
        }
    }
}
```

此功能為[實驗性](components-stability.md#stability-levels-explained)。我們非常感謝您在我們的問題追蹤器 [YouTrack](https://youtrack.jetbrains.com/issue/KT-79284/Use-BigInt64Array-for-LongArray) 中提供回饋。

## Gradle

Kotlin %kotlinEapVersion% 與 Gradle 7.6.3 至 9.0.0 完全相容。您也可以使用最新的 Gradle 版本。然而，請注意，這樣做可能會導致棄用警告，並且某些新的 Gradle 功能可能無法正常運作。

此外，最低支援的 Android Gradle 插件版本現在是 8.2.2，最高支援版本是 8.13.0。

### 用於在 Gradle 專案中註冊生成原始碼的新 API
<primary-label ref="experimental-general"/>

Kotlin %kotlinEapVersion% 在 [`KotlinSourceSet`](https://kotlinlang.org/api/kotlin-gradle-plugin/kotlin-gradle-plugin-api/org.jetbrains.kotlin.gradle.plugin/-kotlin-source-set/) 介面中引入了一個新的[實驗性](components-stability.md#stability-levels-explained) API，您可以使用它在 Gradle 專案中註冊生成原始碼。

這個新 API 是一項生活品質改進，有助於 IDE 區分生成的程式碼和常規原始碼檔案。
該 API 允許 IDE 在使用者介面中以不同方式突顯生成的程式碼，並在匯入專案時觸發生成任務。我們目前正在 IntelliJ IDEA 中添加此支援。該 API 對於生成程式碼的第三方插件或工具（例如 [KSP](ksp-overview.md) (Kotlin 符號處理)）也特別有用。

若要註冊包含 Kotlin 或 Java 檔案的目錄，請在您的 `build.gradle(.kts)` 檔案中使用 [`SourceDirectorySet`](https://docs.gradle.org/current/kotlin-dsl/gradle/org.gradle.api.file/-source-directory-set/index.html) 型別的 `generatedKotlin` 屬性。例如：

```kotlin
val generatorTask = project.tasks.register("generator") {
    val outputDirectory = project.layout.projectDirectory.dir("src/main/kotlinGen")
    outputs.dir(outputDirectory)
    doLast {
        outputDirectory.file("generated.kt").asFile.writeText(
            // language=kotlin
            """
            fun printHello() {
                println("hello")
            }
            """.trimIndent()
        )
    }
}

kotlin.sourceSets.getByName("main").generatedKotlin.srcDir(generatorTask)
```

此範例建立了一個新的任務 `"generator"`，其輸出目錄為 `"src/main/kotlinGen"`。當任務執行時，`doLast {}` 區塊會在輸出目錄中建立一個 `generated.kt` 檔案。最後，該範例將任務的輸出註冊為生成的原始碼。

作為新 API 的一部分，`allKotlinSources` 屬性提供對 `KotlinSourceSet.kotlin` 和 `KotlinSourceSet.generatedKotlin` 屬性中註冊的所有原始碼的存取。

## 標準函式庫

在 Kotlin %kotlinEapVersion% 中，新的時間追蹤功能，[`kotlin.time.Clock` 和 `kotlin.time.Instant`](whatsnew2120.md#new-time-tracking-functionality) 成為[穩定版](components-stability.md#stability-levels-explained)。

## Compose 編譯器：縮小化 Android 應用程式的堆疊追蹤

從 Kotlin 2.3.0 開始，當應用程式由 R8 縮小化時，編譯器會為 Compose 堆疊追蹤輸出 ProGuard 映射。
這擴展了以前僅在可偵錯變體中可用的實驗性堆疊追蹤功能。

堆疊追蹤的發佈變體包含群組鍵，可用於在縮小化應用程式中識別可組合函式，而無需在運行時記錄來源資訊的開銷。群組鍵堆疊追蹤要求您的應用程式必須使用 Compose runtime 1.10 或更新版本建置。

若要啟用群組鍵堆疊追蹤，請在初始化任何 `@Composable` 內容之前新增以下行：

```kotlin
Composer.setDiagnosticStackTraceMode(ComposeStackTraceMode.GroupKeys)
```

啟用這些堆疊追蹤後，Compose runtime 也會在組合、測量或繪製階段捕獲崩潰後附加其自己的堆疊追蹤，即使應用程式經過縮小化：

```text
java.lang.IllegalStateException: <message>
          at <original trace>
Suppressed: androidx.compose.runtime.DiagnosticComposeException: Composition stack when thrown:
         at $compose.m$123(SourceFile:1)
         at $compose.m$234(SourceFile:1)
          ...
```

Jetpack Compose 1.10 在此模式下生成的堆疊追蹤僅包含仍需去混淆的群組鍵。
這在 Kotlin 2.3.0 版本中得到解決，Compose 編譯器 Gradle 插件現在將群組鍵條目附加到 R8 生成的 ProGuard 映射檔案中。如果您發現編譯器未能為某些函式建立映射時出現新的警告，請向 [Google 問題追蹤器](https://issuetracker.google.com/issues/new?component=610764&template=1424126)報告。

> 由於依賴 R8 映射檔案，Compose 編譯器 Gradle 插件僅在啟用 R8 進行建置時為群組鍵堆疊追蹤建立去混淆映射。
>
{style="note"}

依預設，映射檔案的 Gradle 任務會執行，無論您是否啟用追蹤。如果它們在您的建置中造成問題，您可以完全禁用此功能。請在您的 Gradle 設定的 `composeCompiler {}` 區塊中新增以下屬性：

```kotlin
composeCompiler {
    includeComposeMappingFile.set(false)
}
```

請向 [Google 問題追蹤器](https://issuetracker.google.com/issues/new?component=610764&template=1424126)報告遇到的任何問題。