[//]: # (title: Kotlin 2.2.20 有什麼新功能)

_[發布日期：2025 年 9 月 10 日](releases.md#release-details)_

<tldr><p>有關錯誤修正版本 2.2.21 的詳細資訊，請參閱 [變更日誌](https://github.com/JetBrains/kotlin/releases/tag/v2.2.21)。</p></tldr>

Kotlin 2.2.20 版本已發布，為網頁開發帶來了重要的變更。[Kotlin/Wasm 現已進入 Beta 階段](#kotlin-wasm)，
並改進了 [JavaScript 互通中的例外處理](#improved-exception-handling-in-kotlin-wasm-and-javascript-interop)、
[npm 依賴管理](#separated-npm-dependencies)、[內建瀏覽器偵錯支援](#support-for-debugging-in-browsers-without-configuration)，
以及適用於 [`js` 和 `wasmJs` 目標的新共享原始碼集](#shared-source-set-for-js-and-wasmjs-targets)。

此外，以下是一些主要亮點：

*   **Kotlin Multiplatform**：[Swift 匯出預設可用](#swift-export-available-by-default)、[Kotlin 函式庫的穩定跨平台編譯](#stable-cross-platform-compilation-for-kotlin-libraries)，以及[宣告共同依賴的新方法](#new-approach-for-declaring-common-dependencies)。
*   **語言**：[將 Lambda 傳遞給帶有 `suspend` 函式型別的多載時，改進多載解析](#improved-overload-resolution-for-lambdas-with-suspend-function-types)。
*   **Kotlin/Native**：[支援 Xcode 26、堆疊金絲雀，以及發布版本二進位檔案大小更小](#kotlin-native)。
*   **Kotlin/JS**：[`Long` 值編譯為 JavaScript `BigInt`](#usage-of-the-bigint-type-to-represent-kotlin-s-long-type)。

> Compose Multiplatform for web 已進入 Beta 階段。請在我們的[部落格文章](https://blog.jetbrains.com/kotlin/2025/09/compose-multiplatform-1-9-0-compose-for-web-beta/)中了解更多資訊。
>
{style="note"}

您也可以在此影片中找到更新的簡要概述：

<video src="https://www.youtube.com/v/QWpp5-LlTqA" title="Kotlin 2.2.21 有什麼新功能"/>

## IDE 支援

支援 Kotlin 2.2.20 的 Kotlin 插件已綑綁在最新版本的 IntelliJ IDEA 和 Android Studio 中。
要更新，您只需要在建置腳本中將 Kotlin 版本變更為 2.2.20。

有關詳細資訊，請參閱 [更新到新版本](releases.md#update-to-a-new-kotlin-version)。

## 語言

在 Kotlin 2.2.20 中，您可以試用計劃用於 Kotlin 2.3.0 的即將推出的語言功能，包括
[將 Lambda 傳遞給帶有 `suspend` 函式型別的多載時，改進多載解析](#improved-overload-resolution-for-lambdas-with-suspend-function-types)
和 [在具有明確回傳型別的表達式主體中支援 `return` 陳述式](#support-for-return-statements-in-expression-bodies-with-explicit-return-types)。此版本還包括
改進 [`when` 表達式的窮舉檢查](#data-flow-based-exhaustiveness-checks-for-when-expressions)、
[實化 `Throwable` 捕捉](#support-for-reified-types-in-catch-clauses) 和 [Kotlin 契約](#improved-kotlin-contracts)。

### 將 Lambda 傳遞給帶有 `suspend` 函式型別的多載時，改進多載解析

以前，使用常規函式型別和 `suspend` 函式型別多載函式時，在傳遞 Lambda 時會導致歧義錯誤。您可以透過明確的型別轉型來解決此錯誤，但編譯器錯誤地報告了 `No cast needed` 警告：

```kotlin
// Defines two overloads
fun transform(block: () -> Int) {}
fun transform(block: suspend () -> Int) {}

fun test() {
    // Fails with overload resolution ambiguity
    transform({ 42 })

    // Uses an explicit cast, but the compiler incorrectly reports 
    // a "No cast needed" warning
    transform({ 42 } as () -> Int)
}
```

透過此變更，當您定義常規和 `suspend` 函式型別多載時，沒有轉型的 Lambda 將解析為常規多載。使用 `suspend` 關鍵字來明確解析為 `suspend` 多載：

```kotlin
// Resolves to transform(() -> Int)
transform({ 42 })

// Resolves to transform(suspend () -> Int)
transform(suspend { 42 })
```

此行為將在 Kotlin 2.3.0 中預設啟用。要現在測試它，請使用以下編譯器選項將您的語言版本設定為 `2.3`：

```kotlin
-language-version 2.3
```

或者在您的 `build.gradle(.kts)` 檔案中配置它：

```kotlin
kotlin {
    compilerOptions {
        languageVersion.set(org.jetbrains.kotlin.gradle.dsl.KotlinVersion.KOTLIN_2_3)
    }
}
```

我們很樂意在我們的問題追蹤器 [YouTrack](https://youtrack.jetbrains.com/issue/KT-23610) 中收到您的回饋。

### 在具有明確回傳型別的表達式主體中支援 `return` 陳述式

以前，在表達式主體中使用 `return` 會導致編譯器錯誤，因為它可能導致函式的回傳型別被推斷為 `Nothing`。

```kotlin
fun example() = return 42
// Error: Returns are prohibited for functions with an expression body
```

透過此變更，您現在可以在表達式主體中使用 `return`，只要明確寫出回傳型別即可：

```kotlin
// Specifies the return type explicitly
fun getDisplayNameOrDefault(userId: String?): String = getDisplayName(userId ?: return "default")

// Fails because it doesn't specify the return type explicitly
fun getDisplayNameOrDefault(userId: String?) = getDisplayName(userId ?: return "default")
```

同樣，在帶有表達式主體的函式中，Lambda 和巢狀表達式內的 `return` 陳述式以前會無意中編譯。Kotlin 現在支援這些情況，只要明確指定回傳型別即可。沒有明確回傳型別的情況將在 Kotlin 2.3.0 中廢棄：

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

此行為將在 Kotlin 2.3.0 中預設啟用。要現在測試它，請使用以下編譯器選項將您的語言版本設定為 `2.3`：

```kotlin
-language-version 2.3
```

或者在您的 `build.gradle(.kts)` 檔案中配置它：

```kotlin
kotlin {
    compilerOptions {
        languageVersion.set(org.jetbrains.kotlin.gradle.dsl.KotlinVersion.KOTLIN_2_3)
    }
}
```

我們很樂意在我們的問題追蹤器 [YouTrack](https://youtrack.jetbrains.com/issue/KT-76926) 中收到您的回饋。

### 基於資料流的 `when` 表達式窮舉檢查
<primary-label ref="experimental-opt-in"/>

Kotlin 2.2.20 引入了基於**資料流**的 `when` 表達式窮舉檢查。
以前，編譯器的檢查僅限於 `when` 表達式本身，
通常會強制您添加多餘的 `else` 分支。
透過此更新，編譯器現在會追蹤先前的條件檢查和提前回傳，
因此您可以移除多餘的 `else` 分支。

例如，編譯器現在能識別當 `if` 條件滿足時函式會回傳，
因此 `when` 表達式只需要處理其餘情況：

```kotlin
enum class UserRole { ADMIN, MEMBER, GUEST }

fun getPermissionLevel(role: UserRole): Int {
    // Covers the Admin case outside of the when expression
    if (role == UserRole.ADMIN) return 99

    return when (role) {
        UserRole.MEMBER -> 10
        UserRole.GUEST -> 1
        // You no longer have to include this else branch 
        // else -> throw IllegalStateException()
    }
}
```

此功能是[實驗性](components-stability.md#stability-levels-explained)。
要啟用它，請將以下編譯器選項添加到您的 `build.gradle(.kts)` 檔案中：

```kotlin
kotlin {
    compilerOptions {
        freeCompilerArgs.add("-Xdata-flow-based-exhaustiveness")
    }
}
```

### `catch` 子句中支援實化型別
<primary-label ref="experimental-opt-in"/>

在 Kotlin 2.2.20 中，編譯器現在允許在 `inline` 函式的 `catch` 子句中使用[實化泛型型別參數](inline-functions.md#reified-type-parameters)。

這是一個範例：

```kotlin
inline fun <reified ExceptionType : Throwable> handleException(block: () -> Unit) {
    try {
        block()
        // This is now allowed after the change
    } catch (e: ExceptionType) {
        println("Caught specific exception: ${e::class.simpleName}")
    }
}

fun main() {
    // Tries to perform an action that might throw an IOException
    handleException<java.io.IOException> {
        throw java.io.IOException("File not found")
    }
    // Caught specific exception: IOException
}
```

以前，嘗試在 `inline` 函式中捕捉實化 `Throwable` 型別會導致錯誤。

此行為將在 Kotlin 2.4.0 中預設啟用。
要現在使用它，請將以下編譯器選項添加到您的 `build.gradle(.kts)` 檔案中：

```kotlin
kotlin {
    compilerOptions {
        freeCompilerArgs.add("-Xallow-reified-type-in-catch")
    }
}
```

Kotlin 團隊感謝外部貢獻者 [Iven Krall](https://github.com/kralliv) 的貢獻。

### 改進的 Kotlin 契約
<primary-label ref="experimental-opt-in"/>

Kotlin 2.2.20 引入了 [Kotlin 契約](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.contracts/contract.html) 的多項改進，包括：

*   [契約型別斷言中支援泛型](#support-for-generics-in-contract-type-assertions)。
*   [屬性存取器和特定運算子函式內部支援契約](#support-for-contracts-inside-property-accessors-and-specific-operator-functions)。
*   [契約中支援 `returnsNotNull()` 函式](#support-for-the-returnsnotnull-function-in-contracts)，以確保在滿足條件時回傳非空值。
*   [新的 `holdsIn` 關鍵字](#new-holdsin-keyword)，允許您假定條件在 Lambda 內部為真。

這些改進是[實驗性](components-stability.md#stability-levels-explained)。要啟用，您仍然需要在宣告契約時使用 `@OptIn(ExperimentalContracts::class)` 註解。`holdsIn` 關鍵字和 `returnsNotNull()` 函式也需要 `@OptIn(ExperimentalExtendedContracts::class)` 註解。

要使用這些改進，您還需要添加以下每個部分中描述的編譯器選項。

我們很樂意在我們的[問題追蹤器](https://kotl.in/issue) 中收到您的回饋。

#### 契約型別斷言中支援泛型

您現在可以編寫對泛型型別執行型別斷言的契約：

```kotlin
import kotlin.contracts.*

sealed class Failure {
    class HttpError(val code: Int) : Failure()
    // Insert other failure types here
}

sealed class Result<out T, out F : Failure> {
    class Success<T>(val data: T) : Result<T, Nothing>()
    class Failed<F : Failure>(val failure: F) : Result<Nothing, F>()
}

@OptIn(ExperimentalContracts::class)
// Uses a contract to assert a generic type
fun <T, F : Failure> Result<T, F>.isHttpError(): Boolean {
    contract {
        returns(true) implies (this@isHttpError is Result.Failed<Failure.HttpError>)
    }
    return this is Result.Failed && this.failure is Failure.HttpError
}
```

在此範例中，契約對 `Result` 物件執行型別斷言，允許編譯器安全地將其[智慧型轉型](typecasts.md#smart-casts) 為斷言的泛型型別。

此功能是[實驗性](components-stability.md#stability-levels-explained)。要啟用它，請將以下編譯器選項添加到您的 `build.gradle(.kts)` 檔案中：

```kotlin
kotlin {
    compilerOptions {
        freeCompilerArgs.add("-Xallow-contracts-on-more-functions")
    }
}
```

#### 屬性存取器和特定運算子函式內部支援契約

您現在可以在屬性存取器和特定運算子函式內部定義契約。
這讓您可以在更多型別的宣告上使用契約，使它們更加靈活。

例如，您可以在 Getter 中使用契約來為接收者物件啟用智慧型轉型：

```kotlin
import kotlin.contracts.*

val Any.isHelloString: Boolean
    get() {
        @OptIn(ExperimentalContracts::class)
        // Enables smart casting the receiver to String when the getter returns true
        contract { returns(true) implies (this@isHelloString is String) }
        return "hello" == this
    }

fun printIfHelloString(x: Any) {
    if (x.isHelloString) {
        // Prints the length after the smart cast of the receiver to String
        println(x.length)
        // 5
    }
}
```

此外，您可以在以下運算子函式中使用契約：

*   `invoke`
*   `contains`
*   `rangeTo`, `rangeUntil`
*   `componentN`
*   `iterator`
*   `unaryPlus`, `unaryMinus`, `not`
*   `inc`, `dec`

這是一個在運算子函式中使用契約以確保 Lambda 內部變數初始化的範例：

```kotlin
import kotlin.contracts.*

class Runner {
    @OptIn(ExperimentalContracts::class)
    // Enables initialization of variables assigned inside the lambda
    operator fun invoke(block: () -> Unit) {
        contract {
            callsInPlace(block, InvocationKind.EXACTLY_ONCE)
        }
        block()
    }
}

fun testOperator(runner: Runner) {
    val number: Int
    runner {
        number = 1
    }
    // Prints the value after definite initialization guaranteed by the contract
    println(number)
    // 1
}
```

此功能是[實驗性](components-stability.md#stability-levels-explained)。要啟用它，請將以下編譯器選項添加到您的 `build.gradle(.kts)` 檔案中：

```kotlin
kotlin {
    compilerOptions {
        freeCompilerArgs.add("-Xallow-contracts-on-more-functions")
    }
}
```

#### 契約中支援 `returnsNotNull()` 函式

Kotlin 2.2.20 引入了用於契約的 [`returnsNotNull()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.contracts/-contract-builder/returns-not-null.html) 函式。
您可以使用此函式來確保當滿足特定條件時，函式回傳非空值。
這透過將可空和非空函式多載替換為單一、簡潔的函式來簡化您的程式碼：

```kotlin
import kotlin.contracts.*

@OptIn(ExperimentalContracts::class, ExperimentalExtendedContracts::class)
fun decode(encoded: String?): String? {
    contract {
        // Guarantees a non-null return value when the input is non-null
        (encoded != null) implies (returnsNotNull())
    }
    if (encoded == null) return null
    return java.net.URLDecoder.decode(encoded, "UTF-8")
}

fun useDecodedValue(s: String?) {
    // Uses a safe call since the return value may be null
    decode(s)?.length
    if (s != null) {
        // Treats the return value as non-null after the smart cast
        decode(s).length
    }
}
```

在此範例中，`decode()` 函式中的契約允許編譯器在輸入為非空時智慧型轉型其回傳值，從而無需額外的空值檢查或多個多載。

此功能是[實驗性](components-stability.md#stability-levels-explained)。要啟用它，請將以下編譯器選項添加到您的 `build.gradle(.kts)` 檔案中：

```kotlin
kotlin {
    compilerOptions {
        freeCompilerArgs.add("-Xallow-condition-implies-returns-contracts")
    }
}
```

#### 新的 `holdsIn` 關鍵字

Kotlin 2.2.20 引入了用於契約的新 [`holdsIn`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.contracts/-contract-builder/holds-in.html) 關鍵字。
您可以使用它來確保布林條件在特定 Lambda 內部被假定為 `true`。這讓您可以使用契約建構具有條件智慧型轉型的 DSL。

這是一個範例：

```kotlin
import kotlin.contracts.*

@OptIn(ExperimentalContracts::class, ExperimentalExtendedContracts::class)
fun <T> T.alsoIf(condition: Boolean, block: (T) -> Unit): T {
    contract {
        // Declares that the lambda runs at most once
        callsInPlace(block, InvocationKind.AT_MOST_ONCE)
        // Declares that the condition is assumed to be true inside the lambda
        condition holdsIn block
    }
    if (condition) block(this)
    return this
}

fun useApplyIf(input: Any) {
    val result = listOf(1, 2, 3)
        .first()
        .alsoIf(input is Int) {
            // The input parameter is smart cast to Int inside the lambda
            // Prints the sum of input and first list element
            println(input + it)
            // 2
        }
        .toString()
}
```

此功能是[實驗性](components-stability.md#stability-levels-explained)。要啟用它，請將以下編譯器選項添加到您的 `build.gradle(.kts)` 檔案中：

```kotlin
kotlin {
    compilerOptions {
        freeCompilerArgs.add("-Xallow-holdsin-contract")
    }
}
```

## Kotlin/JVM：`when` 表達式支援 `invokedynamic`
<primary-label ref="experimental-opt-in"/> 

在 Kotlin 2.2.20 中，您現在可以使用 `invokedynamic` 編譯 `when` 表達式。以前，帶有多個型別檢查的 `when` 表達式會編譯成位元碼中冗長的 `instanceof` 檢查鏈。

現在您可以使用 `invokedynamic` 和 `when` 表達式來生成更小的位元碼，類似於 Java `switch` 陳述式產生的位元碼，當滿足以下條件時：

*   除了 `else` 之外，所有條件都是 `is` 或 `null` 檢查。
*   表達式不包含[守護條件 (`if`)](control-flow.md#guard-conditions-in-when-expressions)。
*   條件不包含不能直接進行型別檢查的型別，例如可變的 Kotlin 集合 (`MutableList`) 或函式型別 (`kotlin.Function1`、`kotlin.Function2` 等)。
*   除了 `else` 之外，至少有兩個條件。
*   所有分支都檢查 `when` 表達式的相同主體。

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

啟用新功能後，此範例中的 `when` 表達式會編譯成單一的 `invokedynamic` 型別切換，而不是多個 `instanceof` 檢查。

要啟用此功能，請使用 JVM 目標 21 或更高版本編譯您的 Kotlin 程式碼，並添加以下編譯器選項：

```bash
-Xwhen-expressions=indy
```

或者將其添加到您的 `build.gradle(.kts)` 檔案的 `compilerOptions {}` 區塊中：

```kotlin
kotlin {
    compilerOptions {
        freeCompilerArgs.add("-Xwhen-expressions=indy")
    }
}
```

此功能是[實驗性](components-stability.md#stability-levels-explained)。我們很樂意在我們的問題追蹤器 [YouTrack](https://youtrack.jetbrains.com/issue/KT-65688) 中收到您的回饋。

## Kotlin Multiplatform

Kotlin 2.2.20 為 Kotlin Multiplatform 引入了重大變更：Swift 匯出預設可用，
有一個新的共享原始碼集，您可以嘗試管理共同依賴的新方法。

### Swift 匯出預設可用
<primary-label ref="experimental-general"/> 

Kotlin 2.2.20 引入了對 Swift 匯出的實驗性支援。它允許您直接匯出 Kotlin 原始碼
並以慣用的方式從 Swift 呼叫 Kotlin 程式碼，無需 Objective-C 標頭檔。

這應該會顯著改善 Apple 目標的 Multiplatform 開發。例如，如果您有一個包含頂層函式的 Kotlin 模組，Swift 匯出可以啟用簡潔的、模組專屬的匯入，移除令人困惑的 Objective-C 底線和混淆名稱。

主要功能包括：

*   **多模組支援**。每個 Kotlin 模組都匯出為一個單獨的 Swift 模組，簡化了函式呼叫。
*   **套件支援**。Kotlin 套件在匯出期間明確保留，避免了生成的 Swift 程式碼中的命名衝突。
*   **型別別名**。Kotlin 型別別名會匯出並保留在 Swift 中，提高了可讀性。
*   **基本型別的增強可為空性**。與 Objective-C 互通不同，Objective-C 互通需要將 `Int?` 等型別裝箱到 `KotlinInt` 等封裝類別中以保留可為空性，Swift 匯出直接轉換可為空性資訊。
*   **多載**。您可以在 Swift 中呼叫 Kotlin 的多載函式而沒有歧義。
*   **扁平化套件結構**。您可以將 Kotlin 套件轉換為 Swift 列舉，從生成的 Swift 程式碼中移除套件前綴。
*   **模組名稱自訂**。您可以在 Kotlin 專案的 Gradle 配置中自訂生成的 Swift 模組名稱。

#### 如何啟用 Swift 匯出

此功能目前是[實驗性](components-stability.md#stability-levels-explained)，僅適用於使用[直接整合](https://kotlinlang.org/docs/multiplatform/multiplatform-direct-integration.html)
將 iOS 框架連接到 Xcode 專案的專案。這是使用 IntelliJ IDEA 中 Kotlin Multiplatform 插件或透過[網路精靈](https://kmp.jetbrains.com/) 建立的 Multiplatform 專案的標準配置。

要試用 Swift 匯出，請配置您的 Xcode 專案：

1.  在 Xcode 中，打開專案設定。
2.  在 **Build Phases** 標籤上，找到包含 `embedAndSignAppleFrameworkForXcode` 任務的 **Run Script** 階段。
3.  調整腳本，使其在執行腳本階段中包含 `embedSwiftExportForXcode` 任務：

    ```bash
    ./gradlew :<Shared module name>:embedSwiftExportForXcode
    ```

    ![Add the Swift export script](xcode-swift-export-run-script-phase.png){width=700}

4.  建置專案。Swift 模組會在建置輸出目錄中生成。

此功能預設可用。如果您在以前的版本中已經啟用它，您現在可以從您的 `gradle.properties` 檔案中移除 `kotlin.experimental.swift-export.enabled`。

> 為了節省時間，請複製我們的[公共範例](https://github.com/Kotlin/swift-export-sample)，其中 Swift 匯出已設定。
>
{style="tip"}

有關 Swift 匯出的更多資訊，請參閱我們的[文件](native-swift-export.md)。

#### 留下回饋

我們計劃在未來的 Kotlin 版本中擴展並逐步穩定 Swift 匯出支援。在
Kotlin 2.2.20 之後，我們將專注於改進 Kotlin 和 Swift 之間的互通性，特別是協程和流 (Flow) 方面。

Swift 匯出支援是 Kotlin Multiplatform 的一項重大變更。我們很樂意收到您的回饋：

*   直接在 Kotlin Slack 中聯絡開發團隊 – [取得邀請](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up?_gl=1*ju6cbn*_ga*MTA3MTk5NDkzMC4xNjQ2MDY3MDU4*_ga_9J976DJZ68*MTY1ODMzNzA3OS4xMDAuMS4xNjU4MzQwODEwLjYw) 並加入 [#swift-export](https://kotlinlang.slack.com/archives/C073GUW6WN9) 頻道。
*   在 [YouTrack](https://kotl.in/issue) 中報告您在 Swift 匯出方面遇到的任何問題。

### `js` 和 `wasmJs` 目標的共享原始碼集

以前，Kotlin Multiplatform 預設不包含 JavaScript (`js`) 和 WebAssembly (`wasmJs`) 網頁目標的共享原始碼集。
要在 `js` 和 `wasmJs` 之間共享程式碼，您必須手動配置自訂原始碼集，或在兩個地方編寫程式碼，
一個版本用於 `js`，另一個用於 `wasmJs`。例如：

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

從此版本開始，當您使用[預設階層範本](https://kotlinlang.org/docs/multiplatform/multiplatform-hierarchy.html#default-hierarchy-template) 時，Kotlin Gradle 插件會為網頁添加新的共享原始碼集（包括 `webMain` 和 `webTest`）。

透過此變更，`web` 原始碼集成為 `js` 和 `wasmJs` 原始碼集的父級。更新後的原始碼集
階層結構如下：

![An example of using the default hierarchy template with web](default-hierarchy-example-with-web.svg)

新的原始碼集允許您為 `js` 和 `wasmJs` 目標編寫一份程式碼。
您可以將共享程式碼放在 `webMain` 中，它會自動為兩者工作：

```kotlin
// commonMain
expect suspend fun readCopiedText(): String

// webMain
@OptIn(ExperimentalWasmJsInterop::class)
private suspend fun <R : JsAny?> Promise<R>.await(): R = suspendCancellableCoroutine { continuation ->
    this.then(
        onFulfilled = { continuation.resumeWith(Result.success(it)); null },
        onRejected = { continuation.resumeWithException(it.asJsException()); null }
    )
}

external interface Navigator { val clipboard: Clipboard }
external interface Clipboard { fun readText(): Promise<JsString> }
external val navigator: Navigator

actual suspend fun readCopiedText(): String {
    return navigator.clipboard.readText().await().toString()
}
```

此更新簡化了 `js` 和 `wasmJs` 目標之間的程式碼共享。它在兩種情況下特別有用：

*   如果您是函式庫作者，並且希望添加對 `js` 和 `wasmJs` 目標的支援，而無需重複程式碼。
*   如果您正在開發以網頁為目標的 Compose Multiplatform 應用程式，可以為 `js` 和 `wasmJs` 目標啟用跨編譯，以獲得更廣泛的瀏覽器相容性。考慮到這種回退模式，當您建立網站時，它會在所有瀏覽器中開箱即用，因為現代瀏覽器使用 `wasmJs`，而舊瀏覽器使用 `js`。

要試用此功能，請透過在您的 `build.gradle(.kts)` 檔案的 `kotlin {}` 區塊中使用[預設階層範本](https://kotlinlang.org/docs/multiplatform/multiplatform-hierarchy.html#default-hierarchy-template)：

```kotlin
kotlin {
    js()
    wasmJs()

    // Enables the default source set hierarchy, including webMain and webTest
    applyDefaultHierarchyTemplate()
}
```

在使用預設階層之前，請仔細考慮如果您有自訂共享原始碼集的專案或已重新命名 `js("web")` 目標時可能發生的任何衝突。要解決這些衝突，請重新命名衝突的原始碼集或目標，或者不要使用預設階層。

### Kotlin 函式庫的穩定跨平台編譯

Kotlin 2.2.20 完成了一個重要的[發展藍圖項目](https://youtrack.jetbrains.com/issue/KT-71290)，穩定
了 Kotlin 函式庫的跨平台編譯。

您現在可以使用任何[支援的主機](native-target-support.md#hosts) 為發布 Kotlin 函式庫產生 `.klib` 成品。這顯著簡化了
發布過程，特別是對於以前需要 Mac 機器才能完成的 Apple 目標。

此功能預設可用。如果您已經使用 `kotlin.native.enableKlibsCrossCompilation=true` 啟用跨編譯，
您現在可以從 `gradle.properties` 檔案中移除它。

遺憾的是，仍然存在一些限制。在以下情況下，您仍然需要使用 Mac 機器：

*   您的函式庫或任何依賴模組具有 [cinterop 依賴](native-c-interop.md)。
*   您的專案中設定了 [CocoaPods 整合](https://kotlinlang.org/docs/multiplatform/multiplatform-cocoapods-overview.html)。
*   您需要為 Apple 目標建置或測試[最終二進位檔案](https://kotlinlang.org/docs/multiplatform/multiplatform-build-native-binaries.html)。

有關 Multiplatform 函式庫發布的更多資訊，請參閱我們的[文件](https://kotlinlang.org/docs/multiplatform/multiplatform-publish-lib-setup.html)。

### 宣告共同依賴的新方法
<primary-label ref="experimental-opt-in"/>

為了簡化使用 Gradle 設定 Multiplatform 專案，當您的專案使用 Gradle 8.8 或更高版本時，Kotlin 2.2.20 現在允許您在 `kotlin {}` 區塊中透過使用頂層 `dependencies {}` 區塊來宣告共同依賴。
這些依賴的行為就如同它們在 `commonMain` 原始碼集中宣告一樣。此功能與您用於 Kotlin/JVM 和僅限 Android 專案的 `dependencies` 區塊類似，它現在在 Kotlin Multiplatform 中是[實驗性](components-stability.md#stability-levels-explained)。

在專案層級宣告共同依賴可減少跨原始碼集的重複配置，並有助於簡化您的建置設定。您仍然可以根據需要在每個原始碼集中添加平台專屬依賴。

要試用此功能，請透過在頂層 `dependencies {}` 區塊之前添加 `@OptIn(ExperimentalKotlinGradlePluginApi::class)` 註解來啟用它。例如：

```kotlin
kotlin {
    @OptIn(ExperimentalKotlinGradlePluginApi::class)
    dependencies {
        implementation("org.jetbrains.kotlinx:kotlinx-coroutines-core:%coroutinesVersion%")
    }
}
```

我們很樂意在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-76446) 上收到您對此功能的回饋。

### 目標支援依賴關係的新診斷

在 Kotlin 2.2.20 之前，如果您的建置腳本中的依賴關係不支援原始碼集所需的所有目標，
Gradle 產生的錯誤訊息會使問題難以理解。

Kotlin 2.2.20 引入了一個新的診斷，清楚地顯示每個依賴關係支援哪些目標以及不支援哪些目標。

此診斷預設啟用。如果由於某種原因您需要停用它，請在 此 [YouTrack 問題](https://kotl.in/kmp-dependencies-diagnostic-issue) 中留言告知我們。
您可以使用以下 Gradle 屬性在 `gradle.properties` 檔案中停用診斷：

| 屬性                                                 | 描述                                                    |
|:---------------------------------------------------------|:----------------------------------------------------------------|
| `kotlin.kmp.eagerUnresolvedDependenciesDiagnostic=false` | 僅針對中繼資料編譯和匯入執行診斷 |
| `kotlin.kmp.unresolvedDependenciesDiagnostic=false`      | 完全停用診斷                             |

## Kotlin/Native

此版本帶來了對 Xcode 26 的支援，以及與 Objective-C/Swift 的互通性、偵錯和新的二進位選項的改進。

### 支援 Xcode 26

從 Kotlin 2.2.2**1** 開始，Kotlin/Native 編譯器支援 Xcode 26 – Xcode 的最新穩定版本。
您現在可以更新您的 Xcode 並存取最新的 API，以繼續為 Apple 作業系統開發您的 Kotlin 專案。

### 二進位檔案中支援堆疊金絲雀

從 Kotlin 2.2.20 開始，Kotlin 在生成的 Kotlin/Native 二進位檔案中添加了對堆疊金絲雀的支援。作為
堆疊保護的一部分，此安全功能可防止堆疊溢出，從而緩解一些常見的應用程式漏洞。
它已在 Swift 和 Objective-C 中可用，現在也支援 Kotlin。

Kotlin/Native 中堆疊保護的實作遵循 [Clang](https://clang.llvm.org/docs/ClangCommandLineReference.html#cmdoption-clang-fstack-protector) 中堆疊保護器的行為。

要啟用堆疊金絲雀，請將以下[二進位選項](native-binary-options.md) 添加到您的 `gradle.properties` 檔案中：

```none
kotlin.native.binary.stackProtector=yes
```

此屬性為所有容易發生堆疊溢出的 Kotlin 函式啟用此功能。其他模式為：

*   `kotlin.native.binary.stackProtector=strong`，它對容易發生堆疊溢出的函式使用更強的啟發式方法。
*   `kotlin.native.binary.stackProtector=all`，它為所有函式啟用堆疊保護器。

請注意，在某些情況下，堆疊保護可能會產生效能成本。

### 發布版本二進位檔案大小更小
<primary-label ref="experimental-opt-in"/> 

Kotlin 2.2.20 引入了 `smallBinary` 選項，可以幫助您減小發布版本二進位檔案的大小。
新選項有效地將 `-Oz` 設定為 LLVM 編譯階段期間編譯器的預設最佳化參數。

啟用 `smallBinary` 選項後，您可以使發布版本二進位檔案更小並縮短建置時間。但是，它可能會
在某些情況下影響執行時效能。

新功能目前是[實驗性](components-stability.md#stability-levels-explained)。要在您的
專案中試用它，請將以下[二進位選項](native-binary-options.md) 添加到您的 `gradle.properties` 檔案中：

```none
kotlin.native.binary.smallBinary=true
```

Kotlin 團隊感謝 [Troels Lund](https://github.com/troelsbjerre) 對實作此功能的幫助。

### 改進的偵錯器物件摘要

Kotlin/Native 現在為 LLDB 和 GDB 等偵錯器工具生成更清晰的物件摘要。這改進了
生成的偵錯資訊的可讀性，並簡化了您的偵錯體驗。

例如，考慮以下物件：

```kotlin
class Point(val x: Int, val y: Int)
val point = Point(1, 2)
```

以前，檢查只會顯示有限的資訊，包括指向物件記憶體位址的指標：

```none
(lldb) v point
(ObjHeader *) point = [x: ..., y: ...]
(lldb) v point->x
(int32_t *) x = 0x0000000100274048
```

透過 Kotlin 2.2.20，偵錯器現在顯示更豐富的詳細資訊，包括實際值：

```none
(lldb) v point
(ObjHeader *) point = Point(x=1, y=2)
(lldb) v point->x
(int32_t) point->x = 1
```

Kotlin 團隊感謝 [Nikita Nazarov](https://github.com/nikita-nazarov) 對實作此功能的幫助。

有關 Kotlin/Native 中偵錯的更多資訊，請參閱[文件](native-debugging.md)。

### Objective-C 標頭檔中區塊型別的明確名稱

Kotlin 2.2.20 引入了一個選項，可以為從 Kotlin/Native 專案匯出的 Objective-C 標頭檔中的 Kotlin 函式型別添加明確的參數名稱。參數名稱改進了 Xcode 中的自動完成建議，並有助於避免 Clang 警告。

以前，生成的 Objective-C 標頭檔中省略了區塊型別中的參數名稱。在這種情況下，Xcode 的自動完成會建議呼叫此類函式時在 Objective-C 區塊中不帶參數名稱。生成的區塊會觸發 Clang 警告。

例如，對於以下 Kotlin 程式碼：

```kotlin
// Kotlin:
fun greetUser(block: (name: String) -> Unit) = block("John")
```

生成的 Objective-C 標頭檔沒有參數名稱：

```objc
// Objective-C:
+ (void)greetUserBlock:(void (^)(NSString *))block __attribute__((swift_name("greetUser(block:)")));
```

因此，當從 Xcode 中的 Objective-C 呼叫 `greetUserBlock()` 函式時，IDE 建議：

```objc
// Objective-C:
greetUserBlock:^(NSString *) {
    // ...
};
```

建議中缺少參數名稱 `(NSString *)` 導致了 Clang 警告。

透過新選項，Kotlin 將參數名稱從 Kotlin 函式型別轉發到 Objective-C 區塊型別，因此 Xcode
在建議中使用它們：

```objc
// Objective-C:
greetUserBlock:^(NSString *name) {
    // ...
};
```

要啟用明確參數名稱，請將以下[二進位選項](native-binary-options.md) 添加到您的 `gradle.properties` 檔案中：

```none
kotlin.native.binary.objcExportBlockExplicitParameterNames=true
```

Kotlin 團隊感謝 [Yijie Jiang](https://github.com/edisongz) 實作此功能。

### 縮小 Kotlin/Native 發布版大小

Kotlin/Native 發布版以前包含兩個帶有編譯器程式碼的 JAR 檔案：

*   `konan/lib/kotlin-native.jar`
*   `konan/lib/kotlin-native-compiler-embeddable.jar`。

從 Kotlin 2.2.20 開始，`kotlin-native.jar` 不再發布。

移除的 JAR 檔案是可嵌入編譯器的舊版，不再需要。此變更顯著
縮小了發布版的大小。

因此，以下選項現在已廢棄並移除：

*   `kotlin.native.useEmbeddableCompilerJar=false` Gradle 屬性。相反，可嵌入編譯器 JAR 檔案始終
    用於 Kotlin/Native 專案。
*   `KotlinCompilerPluginSupportPlugin.getPluginArtifactForNative()` 函式。相反，始終使用 [`getPluginArtifact()`](https://kotlinlang.org/api/kotlin-gradle-plugin/kotlin-gradle-plugin-api/org.jetbrains.kotlin.gradle.plugin/-kotlin-compiler-plugin-support-plugin/get-plugin-artifact.html)
    函式。

有關更多資訊，請參閱 [YouTrack 問題](https://kotl.in/KT-51301)。

### 預設將 KDoc 匯出到 Objective-C 標頭檔

在編譯 Kotlin/Native 最終二進位檔案期間生成 Objective-C 標頭檔時，[KDoc](kotlin-doc.md) 註解現在預設匯出。

以前，您需要手動將 `-Xexport-kdoc` 選項添加到建置檔案中。現在，它會自動傳遞給編譯任務。

此選項將 KDoc 註解嵌入到 klibs 中，並在產生 Apple 框架時從 klibs 中提取註解。因此，
類別和方法上的註解會在使用自動完成時顯示，例如在 Xcode 中。

您可以在 `build.gradle(.kts)` 檔案的 `binaries {}` 區塊中停用從 klibs 匯出 KDoc 註解到生成的 Apple 框架：

```kotlin
import org.jetbrains.kotlin.gradle.ExperimentalKotlinGradlePluginApi

kotlin {
    iosArm64 {
        binaries {
            framework { 
                baseName = "sdk"
                @OptIn(ExperimentalKotlinGradlePluginApi::class)
                exportKdoc.set(false)
            }
        }
    }
}
```

有關更多資訊，請參閱[我們的文件](native-objc-interop.md#provide-documentation-with-kdoc-comments)。

### 廢棄 `x86_64` Apple 目標

Apple 幾年前停止生產帶有 Intel 晶片的裝置，並[最近宣布](https://www.youtube.com/live/51iONeETSng?t=3288s)
macOS Tahoe 26 將是最後一個支援基於 Intel 架構的作業系統版本。

這使得我們在建置代理上正確測試這些目標變得越來越困難，特別是在未來的 Kotlin
版本中，我們將更新支援的 Xcode 版本，該版本將隨 macOS 26 一起提供。

從 Kotlin 2.2.20 開始，`macosX64` 和 `iosX64` 目標降級為第二級支援。這意味著該目標會
定期在 CI 上測試以確保其編譯，但可能不會自動測試以確保其執行。

我們計劃在 Kotlin 2.2.20−2.4.0 發布週期中逐步廢棄所有 `x86_64` Apple 目標，並最終移除對它們的支援。這包括以下目標：

*   `macosX64`
*   `iosX64`
*   `tvosX64`
*   `watchosX64`

有關支援等級的更多資訊，請參閱 [Kotlin/Native 目標支援](native-target-support.md)。

## Kotlin/Wasm

Kotlin/Wasm 現已進入 Beta 階段，提供了更高的穩定性以及改進，例如分離的 npm 依賴、
[改進的 Kotlin/Wasm 和 JavaScript 互通中的例外處理](#improved-exception-handling-in-kotlin-wasm-and-javascript-interop)、
[內建瀏覽器偵錯支援](#support-for-debugging-in-browsers-without-configuration)，以及更多。

### 分離的 npm 依賴

以前，在您的 Kotlin/Wasm 專案中，所有 [npm](https://www.npmjs.com/) 依賴都一起安裝在您的專案資料夾中，
包括 Kotlin 工具依賴和您自己的依賴。它們也一起記錄在您專案的鎖定檔案
(`package-lock.json` 或 `yarn.lock`) 中。

結果，每當 Kotlin 工具依賴更新時，即使您沒有添加或更改任何內容，也必須更新您的鎖定檔案。

從 Kotlin 2.2.20 開始，Kotlin 工具的 npm 依賴會安裝在您的專案外部。現在，
工具依賴和您的（使用者）依賴有單獨的目錄：

*   **工具依賴目錄：**

    `<kotlin-user-home>/kotlin-npm-tooling/<yarn|npm>/hash/node_modules`

*   **使用者依賴目錄：**

    `build/wasm/node_modules`

此外，專案目錄內的鎖定檔案僅包含使用者定義的依賴。

此改進使得您的鎖定檔案僅專注於您自己的依賴，有助於維護更整潔的專案，並
減少檔案中不必要的變更。

此變更預設為 `wasm-js` 目標啟用。此變更尚未針對 `js` 目標實作。雖然
計劃在未來版本中實作，但在 Kotlin 2.2.20 中，`js` 目標的 npm 依賴行為保持不變。

### 改進的 Kotlin/Wasm 和 JavaScript 互通中的例外處理

以前，Kotlin 在理解 JavaScript (JS) 中拋出的例外（錯誤）並傳播到 Kotlin/Wasm 程式碼時遇到困難。

在某些情況下，問題也發生在相反的方向，當例外透過 Wasm
程式碼拋出或傳遞到 JS 時，它被包裝成 `WebAssembly.Exception` 而沒有任何詳細資訊。這些 Kotlin 例外處理問題使得
偵錯變得困難。

從 Kotlin 2.2.20 開始，例外處理方面的開發人員體驗在兩個方向上都有所改進：

*   當例外從 JS 拋出時，您可以在 Kotlin 側看到更多資訊。
    當此類例外透過 Kotlin 傳播回 JS 時，它不再被包裝到 WebAssembly 中。
*   當例外從 Kotlin 拋出時，它們現在可以在 JS 側作為 JS 錯誤被捕捉。

新的例外處理在支援 [`WebAssembly.JSTag`](https://webassembly.github.io/exception-handling/js-api/#dom-webassembly-jstag)
功能的現代瀏覽器中自動工作：

*   Chrome 115+
*   Firefox 129+
*   Safari 18.4+

在較舊的瀏覽器中，例外處理行為保持不變。

### 支援無配置的瀏覽器偵錯

以前，瀏覽器無法自動存取偵錯所需的 Kotlin/Wasm 專案原始檔。
要在瀏覽器中偵錯 Kotlin/Wasm 應用程式，您必須手動配置您的建置以提供這些原始檔，
方法是將以下程式碼片段添加到您的 `build.gradle(.kts)` 檔案中：

```kotlin
devServer = (devServer ?: KotlinWebpackConfig.DevServer()).apply {
    static = (static ?: mutableListOf()).apply {
        add(project.rootDir.path)
    }
}
```

從 Kotlin 2.2.20 開始，在[現代瀏覽器](wasm-configuration.md#browser-versions) 中偵錯您的應用程式可以開箱即用。
當您執行 Gradle 開發任務 (`*DevRun`) 時，Kotlin 會自動向瀏覽器提供原始檔，允許您
設定中斷點、檢查變數並逐步執行 Kotlin 程式碼，無需額外設定。

此變更透過移除手動配置的需求來簡化偵錯。所需的配置現在包含在
Kotlin Gradle 插件中。如果您以前將此配置添加到您的 `build.gradle(.kts)` 檔案中，則應將其移除以避免衝突。

瀏覽器偵錯預設為所有 Gradle `*DevRun` 任務啟用。這些任務不僅提供應用程式，
還提供其原始檔，因此僅用於本機開發，避免在原始檔將公開暴露的雲端或生產環境中執行它們。

#### 處理偵錯期間的重複重新載入

預設提供原始檔可能會導致[在 Kotlin 編譯和打包完成之前，應用程式在瀏覽器中重複重新載入](https://youtrack.jetbrains.com/issue/KT-80582/Multiple-reloads-when-using-webpack-dev-server-after-2.2.20-Beta2#focus=Comments-27-12596427.0-0)。
作為解決方法，調整您的 webpack 配置以忽略 Kotlin 原始檔並停用對所提供靜態檔案的監視。
將包含以下內容的 `.js` 檔案添加到專案根目錄的 `webpack.config.d` 目錄中：

```kotlin
config.watchOptions = config.watchOptions || {
    ignored: ["**/*.kt", "**/node_modules"]
}

if (config.devServer) {
    config.devServer.static = config.devServer.static.map(file => {
        if (typeof file === "string") {
        return { directory: file,
                 watch: false,
        }
    } else {
        return file
    }
    })
}
```

### 消除空的 `yarn.lock` 檔案

以前，Kotlin Gradle 插件 (KGP) 會自動生成一個 `yarn.lock` 檔案，其中包含有關
Kotlin 工具鏈所需的 npm 套件的資訊，以及專案或使用的函式庫中任何現有的 [npm](https://www.npmjs.com/) 依賴。

現在，KGP 單獨管理工具鏈依賴，除非專案具有 npm 依賴，否則不再生成專案層級的 `yarn.lock` 檔案。

當添加 npm 依賴時，KGP 會自動建立一個 `yarn.lock` 檔案，當移除 npm 依賴時，它會刪除 `yarn.lock` 檔案。

此變更清除了專案結構，並使得追蹤實際 npm 依賴何時引入變得更容易。

無需額外步驟來配置此行為。從 Kotlin 2.2.20 開始，它預設套用在 Kotlin/Wasm 專案中。

### 完整合格類別名稱中的新編譯器錯誤

在 Kotlin/Wasm 上，編譯器預設不會在生成的二進位檔案中儲存類別的完整合格名稱 (FQNs)。
此方法避免了應用程式大小的增加。

結果，在以前的 Kotlin 版本中，呼叫 `KClass::qualifiedName` 屬性會回傳空字串，而不是
類別的完整合格名稱。

從 Kotlin 2.2.20 開始，當您在 Kotlin/Wasm 專案中使用 `KClass::qualifiedName` 屬性時，
編譯器會報告錯誤，除非您明確啟用完整合格名稱功能。

此變更可防止在呼叫 `qualifiedName` 屬性時出現意外的空字串，並透過在編譯時期捕捉
問題來改進開發人員體驗。

診斷預設啟用，並會自動報告錯誤。要停用診斷並允許在
Kotlin/Wasm 中儲存 FQNs，請指示編譯器為所有類別儲存完整合格名稱，方法是將以下選項添加到您的
`build.gradle(.kts)` 檔案中：

```kotlin
kotlin {
    wasmJs {
        ...
        compilerOptions {
            freeCompilerArgs.add("-Xwasm-kclass-fqn")
        }
    }
}
```

> 請記住，啟用此選項會增加應用程式大小。
>
{style="note"}

## Kotlin/JS

Kotlin 2.2.20 支援使用 `BigInt` 型別來表示 Kotlin 的 `Long` 型別，從而在匯出宣告中啟用 `Long`。
此外，此版本添加了一個 DSL 函式來清除 Node.js 參數。

### 使用 `BigInt` 型別來表示 Kotlin 的 `Long` 型別
<primary-label ref="experimental-opt-in"/>

在 ES2020 標準之前，JavaScript (JS) 不支援用於精確整數的原始型別，
其大小超過 53 位元。

由於這個原因，Kotlin/JS 以前將 `Long` 值（64 位元寬）表示為包含兩個
`number` 屬性的 JavaScript 物件。這種自訂實作使得 Kotlin 和 JavaScript 之間的互通性更為複雜。

從 Kotlin 2.2.20 開始，Kotlin/JS 現在使用 JavaScript 的內建 `BigInt` 型別來表示 Kotlin 的 `Long` 值
當編譯為現代 JavaScript (ES2020) 時。

此變更使得[將 `Long` 型別匯出到 JavaScript](#usage-of-long-in-exported-declarations) 成為可能，這是 Kotlin 2.2.20 中也引入的一項功能。因此，此變更簡化了 Kotlin 和 JavaScript 之間的互通性。

要啟用它，您需要在 `build.gradle(.kts)` 檔案中添加以下編譯器選項：

```kotlin
kotlin {
    js {
        ...
        compilerOptions {
            freeCompilerArgs.add("-Xes-long-as-bigint")
        }
    }
}
```

此功能是[實驗性](components-stability.md#stability-levels-explained)。我們很樂意在我們的問題追蹤器 [YouTrack](https://youtrack.jetbrains.com/issue/KT-57128) 中收到您的回饋。

#### 在匯出宣告中使用 `Long`

由於 Kotlin/JS 使用自訂的 `Long` 表示，因此很難提供一種直接的方式來從 JavaScript 互動 Kotlin 的 `Long`。因此，您無法匯出使用 `Long` 型別的 Kotlin 程式碼到 JavaScript。此問題影響了任何使用 `Long` 的程式碼，例如函式參數、類別屬性或建構式。

現在 Kotlin 的 `Long` 型別可以編譯為 JavaScript 的 `BigInt` 型別，Kotlin/JS 支援將 `Long` 值匯出到 JavaScript，
簡化了 Kotlin 和 JavaScript 程式碼之間的互通性。

要啟用此功能：

1.  透過將以下編譯器選項添加到 `build.gradle(.kts)` 檔案中的 `freeCompilerArgs` 屬性，允許在 Kotlin/JS 中匯出 `Long`：

    ```kotlin
    kotlin {
        js {
            ...
            compilerOptions {                   
                freeCompilerArgs.add("-XXLanguage:+JsAllowLongInExportedDeclarations")
            }
        }
    }
    ```

2.  啟用 `BigInt` 型別。請參閱 [使用 `BigInt` 型別來表示 Kotlin 的 `Long` 型別](#usage-of-the-bigint-type-to-represent-kotlin-s-long-type) 中如何啟用它。

### 新的 DSL 函式用於更簡潔的參數

當使用 Node.js 執行 Kotlin/JS 應用程式時，傳遞給您程式的參數 (`args`) 以前會包含：

*   可執行檔 `Node` 的路徑。
*   您的腳本的路徑。
*   您提供的實際命令列參數。

然而，`args` 的預期行為是只包含命令列參數。為了實現這一點，您必須在 `build.gradle(.kts)` 檔案或 Kotlin 程式碼中手動使用 `drop()` 函式跳過前兩個參數：

```kotlin
fun main(args: Array<String>) {
    println(args.drop(2).joinToString(", "))
}
```

此解決方法是重複、容易出錯，並且在跨平台共享程式碼時效果不佳。

為了解決此問題，Kotlin 2.2.20 引入了一個名為 `passCliArgumentsToMainFunction()` 的新 DSL 函式。

透過此函式，只包含命令列參數，而 `Node` 和腳本路徑則排除在外：

```kotlin
fun main(args: Array<String>) {
    // No need for drop() and only your custom arguments are included 
    println(args.joinToString(", "))
}
```

此變更減少了樣板程式碼，防止了手動丟棄參數導致的錯誤，並改進了跨平台相容性。

要啟用此功能，請在您的 `build.gradle(.kts)` 檔案中添加以下 DSL 函式：

```kotlin
kotlin {
    js {
        nodejs {
            passCliArgumentsToMainFunction()
        }
    }
}
```

## Gradle

Kotlin 2.2.20 在 Gradle 建置報告中為 Kotlin/Native 任務添加了新的編譯器效能指標，並改進了增量編譯的生活品質。

### Kotlin/Native 任務建置報告中的新編譯器效能指標

在 Kotlin 1.7.0 中，我們引入了[建置報告](gradle-compilation-and-caches.md#build-reports) 以幫助追蹤編譯器效能。從那時起，我們添加了更多指標，使這些報告更加詳細和有用，以便調查效能問題。

在 Kotlin 2.2.20 中，建置報告現在包含 Kotlin/Native 任務的編譯器效能指標。

要了解有關建置報告以及如何配置它們的更多資訊，請參閱 [啟用建置報告](gradle-compilation-and-caches.md#enabling-build-reports)。

### 預覽 Kotlin/JVM 改進的增量編譯
<primary-label ref="experimental-general"/>

Kotlin 2.0.0 引入了帶有最佳化前端的新 K2 編譯器。Kotlin 2.2.20 在此基礎上，透過使用新
前端改進了 Kotlin/JVM 中某些複雜增量編譯情境的效能。

這些改進預設為停用，因為我們正在努力穩定其行為。要啟用它們，請在您的
`gradle.properties` 檔案中添加以下屬性：

```none
kotlin.incremental.jvm.fir=true
```

目前，[`kapt` 編譯器插件](kapt.md) 與此新行為不相容。我們正在努力在未來的 Kotlin 版本中添加支援。

我們很樂意在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-72822) 上收到您對此功能的回饋。

### 增量編譯偵測 inline 函式中 Lambda 的變更

在 Kotlin 2.2.20 之前，如果您啟用增量編譯並更改了 inline 函式中 Lambda 的邏輯，
編譯器不會重新編譯其他模組中該 inline 函式的呼叫點。結果，那些呼叫點使用
Lambda 的先前版本，這可能會導致意外行為。

在 Kotlin 2.2.20 中，編譯器現在會偵測 inline 函式中 Lambda 的變更並自動重新編譯其呼叫點。

### 函式庫發布的改進

Kotlin 2.2.20 添加了新的 Gradle 任務，讓函式庫發布變得更容易。這些任務可幫助您生成金鑰對、上傳公開金鑰，並執行本機檢查以確保驗證過程在上傳到 Maven Central 儲存庫之前成功。

有關如何在發布過程中利用這些任務的更多資訊，請參閱[將您的函式庫發布到 Maven Central](https://kotlinlang.org/docs/multiplatform/multiplatform-publish-libraries.html)。

#### 用於生成和上傳 PGP 金鑰的新 Gradle 任務

在 Kotlin 2.2.20 之前，如果您想將 Multiplatform 函式庫發布到 Maven Central 儲存庫，您必須安裝
`gpg` 等第三方程式來生成用於簽署您發布的金鑰對。現在，Kotlin Gradle 插件隨附了
Gradle 任務，可讓您生成金鑰對並上傳公開金鑰，因此您無需安裝其他程式。

##### 生成金鑰對

`generatePgpKeys` 任務生成金鑰對。當您執行它時，您必須提供私密金鑰儲存庫的密碼
和您的名稱，格式如下：

```bash
./gradlew -Psigning.password=example-password generatePgpKeys --name "John Smith <john@example.com>"
```

該任務將金鑰對儲存在 `build/pgp` 目錄中。

> 將您的金鑰對移至安全位置，以防止意外刪除或未經授權的存取。
> 
{style="warning"}

##### 上傳公開金鑰

`uploadPublicPgpKey` 任務將公開金鑰上傳到 Ubuntu 的金鑰伺服器：`keyserver.ubuntu.com`。當您執行它時，
請提供 `.asc` 格式公開金鑰的路徑：

```bash
./gradlew uploadPublicPgpKey --keyring /path_to/build/pgp/public_KEY_ID.asc
```

#### 用於在本機測試驗證的新 Gradle 任務

Kotlin 2.2.20 還添加了用於在本機測試驗證的 Gradle 任務，然後再將您的函式庫上傳到 Maven Central 儲存庫。

如果您將 Kotlin Gradle 插件與 Gradle 的 [Signing Plugin](https://docs.gradle.org/current/userguide/signing_plugin.html) 和 [Maven Publish Plugin](https://docs.gradle.org/current/userguide/publishing_maven.html) 一起使用，您可以執行 `checkSigningConfiguration` 和 `checkPomFileFor<PUBLICATION_NAME>Publication` 任務，以驗證您的設定是否符合 Maven Central 的要求。將 `<PUBLICATION_NAME>` 替換為您的發布名稱。

這些任務不會作為 `build` 或 `check` Gradle 任務的一部分自動執行，因此您需要手動執行它們。
例如，如果您有 `KotlinMultiplatform` 發布：

```bash
./gradlew checkSigningConfiguration checkPomFileForKotlinMultiplatformPublication
```

`checkSigningConfiguration` 任務檢查：

*   Signing Plugin 是否已配置金鑰。
*   已配置的公開金鑰是否已上傳到 `keyserver.ubuntu.com` 或 `keys.openpgp.org` 金鑰伺服器。
*   所有發布是否都已啟用簽署。

如果這些檢查中的任何一個失敗，該任務將回傳錯誤，並附上如何解決問題的資訊。

`checkPomFileFor<PUBLICATION_NAME>Publication` 任務檢查 `pom.xml` 檔案是否符合 Maven Central 的[要求](https://central.sonatype.org/publish/requirements/#required-pom-metadata)。
如果不符合，該任務將回傳錯誤，並詳細說明 `pom.xml` 檔案的哪些部分不符合規定。

## Maven：`kotlin-maven-plugin` 中支援 Kotlin 常駐程式

Kotlin 2.2.20 透過在 `kotlin-maven-plugin` 中添加對 [Kotlin 常駐程式](kotlin-daemon.md) 的支援，使 [Kotlin 2.2.0 中引入的實驗性建置工具 API](whatsnew22.md#new-experimental-build-tools-api) 更進一步。當使用 Kotlin 常駐程式時，Kotlin
編譯器在一個單獨的隔離程序中執行，這可以防止其他 Maven 插件覆寫系統屬性。您
可以在這個 [YouTrack 問題](https://youtrack.jetbrains.com/issue/KT-43894/Maven-Windows-error-RuntimeException-Could-not-find-installation-home-path) 中看到一個範例。

從 Kotlin 2.2.20 開始，Kotlin 常駐程式預設使用。如果您想恢復到以前的行為，請
透過將 `pom.xml` 檔案中的以下屬性設定為 `false` 來選擇退出：

```xml
<properties>
    <kotlin.compiler.daemon>false</kotlin.compiler.daemon>
</properties>
```

Kotlin 2.2.20 還引入了一個新的 `jvmArgs` 屬性，您可以使用它來為 Kotlin 常駐程式自訂預設 JVM 參數。
例如，要覆寫 `-Xmx` 和 `-Xms` 選項，請將以下內容添加到您的 `pom.xml` 檔案中：

```xml
<properties>
    <kotlin.compiler.daemon.jvmArgs>Xmx1500m,Xms500m</kotlin.compiler.daemon.jvmArgs>
</properties>
```

## Kotlin 編譯器選項的新通用模式

Kotlin 2.2.20 引入了在 [`org.jetbrains.kotlin:kotlin-compiler-arguments-description`](https://central.sonatype.com/artifact/org.jetbrains.kotlin/kotlin-compiler-arguments-description) 下發布的所有編譯器選項的通用模式。
此成品包括所有編譯器選項的程式碼表示和 JSON 等效（適用於非 JVM 消費者）、
它們的描述以及中繼資料，例如每個選項引入或穩定的版本。您可以使用此
模式生成選項的自訂視圖或根據需要分析它們。

## 標準函式庫

此版本在標準函式庫中引入了新的實驗性功能：Kotlin/JS 中用於識別介面型別的反射支援、
常用原子型別的更新函式，以及用於陣列大小調整的 `copyOf()` 多載。

### Kotlin/JS 中透過反射識別介面型別的支援
<primary-label ref="experimental-opt-in"/>

Kotlin 2.2.20 將[實驗性](components-stability.md#stability-levels-explained) [`KClass.isInterface`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.reflect/-k-class/is-interface.html) 屬性
添加到 Kotlin/JS 標準函式庫。

透過此屬性，您現在可以檢查類別參考是否表示 Kotlin 介面。這使得 Kotlin/JS 更接近
與 Kotlin/JVM 的對等，在 Kotlin/JVM 中您可以使用 `KClass.java.isInterface` 來檢查類別是否表示介面。

要啟用，請使用 `@OptIn(ExperimentalStdlibApi::class)` 註解：

```kotlin
@OptIn(ExperimentalStdlibApi::class)
fun inspect(klass: KClass<*>) {
    // Prints true for interfaces
    println(klass.isInterface)
}
```

我們很樂意在我們的問題追蹤器 [YouTrack](https://youtrack.jetbrains.com/issue/KT-78581) 中收到您的回饋。

### 常用原子型別的新更新函式
<primary-label ref="experimental-opt-in"/>

Kotlin 2.2.20 引入了用於更新常用原子型別及其陣列對應物元素的新實驗性函式。
每個函式都會使用其中一個更新函式原子地計算一個新值並替換目前值，回傳值取決於您使用的函式：

*   [`update()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.concurrent.atomics/update.html) 和 [`updateAt()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.concurrent.atomics/update-at.html) 設定一個新值，不回傳結果。
*   [`fetchAndUpdate()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.concurrent.atomics/fetch-and-update.html) 和 [`fetchAndUpdateAt()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.concurrent.atomics/fetch-and-update-at.html) 設定一個新值並回傳變更前的舊值。
*   [`updateAndFetch()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.concurrent.atomics/update-and-fetch.html) 和 [`updateAndFetchAt()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.concurrent.atomics/update-and-fetch-at.html) 設定一個新值並回傳變更後的新值。

您可以使用這些函式來實作不開箱即用的原子轉換，例如乘法或位元運算。
在這次變更之前，遞增常用原子型別並讀取舊值需要使用 [`compareAndSet()` 函式](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.concurrent/-atomic-int/compare-and-set.html) 進行迴圈。

與所有用於常用原子型別的 API 一樣，這些函式是[實驗性](components-stability.md#stability-levels-explained)。
要啟用，請使用 `@OptIn(ExperimentalAtomicApi::class)` 註解。

以下是一個執行不同型別的更新並回傳舊值或新值的程式碼範例：

```kotlin
import kotlin.concurrent.atomics.*
import kotlin.random.Random

@OptIn(ExperimentalAtomicApi::class)
fun main() {
    val counter = AtomicLong(Random.nextLong())
    val minSetBitsThreshold = 20

    // Sets a new value without using the result
    counter.update { if (it < 0xDECAF) 0xCACA0 else 0xC0FFEE }

    // Retrieves the current value, then updates it
    val previousValue = counter.fetchAndUpdate { 0x1CEDL.shl(Long.SIZE_BITS - it.countLeadingZeroBits()) or it }

    // Updates the value, then retrieves the result
    val current = counter.updateAndFetch {
        if (it.countOneBits() < minSetBitsThreshold) it.shl(20) or 0x15BADL else it
    }

    val hexFormat = HexFormat {
        upperCase = true
        number {
            removeLeadingZeros = true
        }
    }
    println("Previous value: ${previousValue.toHexString(hexFormat)}")
    println("Current value: ${current.toHexString(hexFormat)}")
    println("Expected status flag set: ${current and 0xBAD != 0xBADL}")
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="2.2.20"}

我們很樂意在我們的問題追蹤器 [YouTrack](https://youtrack.jetbrains.com/issue/KT-76389) 中收到您的回饋。

### 陣列的 `copyOf()` 多載支援
<primary-label ref="experimental-opt-in"/>

Kotlin 2.2.20 引入了 [`copyOf()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.collections/copy-of.html) 函式的實驗性多載。
它適用於泛型型別 `Array<T>` 的陣列和所有基本陣列型別。

您可以使用此函式來增大陣列並使用初始化 Lambda 的值填充新元素。
這可以幫助您減少自訂樣板程式碼，並解決調整泛型 `Array<T>` 大小會產生可空結果 (`Array<T?>`) 的常見痛點。

這是一個範例：

```kotlin
@OptIn(ExperimentalStdlibApi::class)
fun main() {
    val row1: Array<String> = arrayOf("one", "two")
    // Resizes the array and populates the new elements using the lambda
    val row2: Array<String> = row1.copyOf(4) { "default" }
    println(row2.contentToString())
    // [one, two, default, default]
}
```

此 API 是[實驗性](components-stability.md#stability-levels-explained)。要啟用，請使用 `@OptIn(ExperimentalStdlibApi::class)` 註解。

我們很樂意在我們的[問題追蹤器](https://youtrack.jetbrains.com/issue/KT-70984) 中收到您的回饋。

## Compose 編譯器

在此版本中，Compose 編譯器透過添加新警告和改進建置指標的輸出，使其更易於閱讀，從而帶來了生活品質的改進。

### 預設參數的語言版本限制

在此版本中，如果為編譯指定的語言版本低於支援抽象或開放式可組合函式中預設參數所需的語言版本，
Compose 編譯器將報告錯誤。

從 Kotlin 2.1.0 開始，Compose 編譯器支援抽象函式中的預設參數，從 Kotlin 2.2.0 開始，支援開放式函式中的預設參數。當使用較新版本的 Compose 編譯器，同時目標舊版 Kotlin 語言版本時，
函式庫開發人員應注意，抽象或開放式函式中的預設參數仍可能出現在公共 API 中，
即使該語言版本不支援它們。

### K2 編譯器的 Composable 目標警告

此版本添加了關於使用 K2 編譯器時 [`@ComposableTarget`](https://developer.android.com/reference/kotlin/androidx/compose/runtime/ComposableTarget)
不匹配的警告。

例如：

```text
@Composable fun App() {
  Box { // <-- `Box` is a `@UiComposable`
    Path(...) // <-- `Path` is a `@VectorComposable`
    ^^^^^^^^^
    warning: Calling a Vector composable function where a UI composable was expected
  }
}
```
### 建置指標中的完整合格名稱

建置指標中報告的類別和函式名稱現在是完整合格的，這使得區分
不同套件中同名的宣告變得更容易。

此外，建置指標不再包含來自預設參數的複雜表達式轉儲，使其更易於閱讀。

## 重大變更與廢棄功能

本節重點介紹值得注意的重大變更和廢棄功能：

*   [kapt](kapt.md) 編譯器插件現在預設使用 K2 編譯器。因此，控制插件是否使用 K2 編譯器的 `kapt.use.k2` 屬性已廢棄。
    如果您將此屬性設定為 `false` 以選擇不使用 K2 編譯器，Gradle 將顯示警告。

## 文件更新

Kotlin 文件已收到一些顯著變更：

*   [Kotlin 發展藍圖](roadmap.md) – 查看更新後的 Kotlin 在語言和生態系統演進方面的優先順序列表。
*   [屬性 (Properties)](properties.md) – 了解您可以在 Kotlin 中使用屬性的多種方式。
*   [條件與迴圈](control-flow.md) – 了解 Kotlin 中的條件和迴圈如何運作。
*   [Kotlin/JavaScript](js-overview.md) – 探索 Kotlin/JS 的使用情境。
*   [為網頁為目標](gradle-configure-project.md#targeting-the-web) – 了解 Gradle 為網頁開發提供的不同目標。
*   [Kotlin 常駐程式](kotlin-daemon.md) – 了解 Kotlin 常駐程式及其如何與建置系統和 Kotlin 編譯器協同運作。
*   [協程概覽頁面](coroutines-overview.md) – 了解協程概念並開始您的學習之旅。
*   [Kotlin/Native 二進位選項](native-binary-options.md) – 了解 Kotlin/Native 的二進位選項以及如何配置它們。
*   [偵錯 Kotlin/Native](native-debugging.md) – 探索使用 Kotlin/Native 進行偵錯的不同方式。
*   [自訂 LLVM 後端的技巧](native-llvm-passes.md) – 了解 Kotlin/Native 如何使用 LLVM 並調整最佳化通道。
*   [Exposed 的 DAO API 入門](https://www.jetbrains.com/help/exposed/get-started-with-exposed-dao.html) – 了解如何使用 Exposed 的資料存取物件 (DAO) API 來在關聯式資料庫中儲存和檢索資料。
*   Exposed 文件中關於 R2DBC 的新頁面：
    *   [使用資料庫](https://www.jetbrains.com/help/exposed/working-with-database.html)
    *   [使用 ConnectionFactory](https://www.jetbrains.com/help/exposed/working-with-connectionfactory.html)
    *   [自訂型別映射](https://www.jetbrains.com/help/exposed/custom-type-mapping.html)
*   [HTMX 整合](https://ktor.io/docs/htmx-integration.html) – 了解 Ktor 如何為 HTMX 提供實驗性、一流的支援。

## 如何更新到 Kotlin 2.2.20

Kotlin 插件作為綑綁插件分發在 IntelliJ IDEA 和 Android Studio 中。

要更新到新的 Kotlin 版本，請在您的建置腳本中[變更 Kotlin 版本](releases.md#update-to-a-new-kotlin-version) 為 2.2.20。