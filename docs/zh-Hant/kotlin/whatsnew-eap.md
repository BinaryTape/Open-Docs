[//]: # (title: Kotlin %kotlinEapVersion% 有什麼新功能)

_發佈日期：%kotlinEapReleaseDate%_

> 本文件並未涵蓋早期存取預覽 (EAP) 發佈版的所有功能，
> 但它重點介紹了一些主要改進。
>
> 請在 [GitHub 變更日誌](https://github.com/JetBrains/kotlin/releases/tag/v%kotlinEapVersion%) 中查看完整的變更列表。
> {style="note"}

Kotlin %kotlinEapVersion% 發佈版已推出！
以下是此 EAP 發佈版的一些詳細資訊：

* [語言：上下文參數的預覽](#preview-of-context-parameters)
* [Kotlin 編譯器：編譯器警告的統一管理](#kotlin-compiler-unified-management-of-compiler-warnings)
* [Kotlin/JVM：介面函式預設方法生成變更](#changes-to-default-method-generation-for-interface-functions)
* [Gradle：在 KGP 診斷中整合 Problems API](#integration-of-problems-api-within-kgp-diagnostics)
  以及 [KGP 與 '--warning-mode' 的相容性](#kgp-compatibility-with-warning-mode)

## IDE 支援

支援 Kotlin %kotlinEapVersion% 的 Kotlin 外掛程式已綁定在最新的 IntelliJ IDEA 和 Android Studio 中。
您無需在 IDE 中更新 Kotlin 外掛程式。
您只需在建置腳本中將 [Kotlin 版本](configure-build-for-eap.md) 變更為 %kotlinEapVersion% 即可。

有關詳細資訊，請參閱[更新到新發佈版](releases.md#update-to-a-new-kotlin-version)。

## 語言

此發佈版將一些語言功能提升為穩定版，並帶來了上下文參數的預覽。

### 穩定功能：守護條件、非本地 break 和 continue，以及多美元字串內插

在 Kotlin 2.1.0 中，一些新的語言功能以預覽版的形式引入。
我們很高興宣佈這些語言功能在此發佈版中成為
[穩定版](components-stability.md#stability-levels-explained)：

* [帶有主詞的 `when` 語句中的守護條件](whatsnew21.md#guard-conditions-in-when-with-a-subject)
* [非本地 `break` 和 `continue`](whatsnew21.md#non-local-break-and-continue)
* [多美元字串內插：改進字串字面值中 `# ` 的處理](whatsnew21.md#multi-dollar-string-interpolation)

[查看 Kotlin 語言設計功能和提案的完整列表](kotlin-language-features-and-proposals.md)。

### 上下文參數預覽

<primary-label ref="experimental-general"/>

在此發佈版中，上下文參數以預覽版的形式引入。
上下文參數允許函式和屬性聲明隱式地在
周圍上下文 (surrounding context) 中可用的依賴。

此功能取代了舊的實驗性功能，稱為上下文接收器 (context receivers)。要從上下文接收器遷移到上下文
參數，您可以使用 IntelliJ IDEA 中的輔助支援，如
[部落格文章](https://blog.jetbrains.com/kotlin/2025/04/update-on-context-parameters/) 所述。

#### 如何聲明上下文參數

您可以使用 `context` 關鍵字為屬性 (properties) 和函式 (functions) 聲明上下文參數
，後跟參數列表，每個參數的形式為 `name: Type`。以下是一個依賴於 `UserService` 介面的範例：

```kotlin
// `UserService` defines the dependency required in context 
interface UserService {
    fun log(message: String)
    fun findUserById(id: Int): String
}

// Declares a function with a context parameter
context(users: UserService)
fun outputMessage(message: String) {
    // Uses `log` from the context
    users.log("Log: $message")
}

// Declares a property with a context parameter
context(users: UserService)
val firstUser: String
    // Uses `findUserById` from the context    
    get() = users.findUserById(1)
```

您可以將 `_` 用作上下文參數名稱。在這種情況下，參數的值可用於解析，但無法在區塊內部按名稱存取：

```kotlin
// Uses `_` as context parameter name
context(_: UserService)
fun logWelcome() {
    // Resolution still finds the appropriate `log` function from UserService
    outputMessage("Welcome!")
}
```

#### 上下文參數解析

Kotlin 在呼叫點 (call site) 透過在目前範圍 (scope) 中搜尋匹配的上下文值來解析上下文參數。Kotlin 透過其類型來匹配它們。
如果同一範圍層級存在多個相容值，編譯器將報告歧義 (ambiguity)：

```kotlin
// `UserService` defines the dependency required in context
interface UserService {
    fun log(message: String)
}

// Declares a function with a context parameter
context(users: UserService)
fun outputMessage(message: String) {
    users.log("Log: $message")
}

fun main() {
    // Implements `UserService` 
    val serviceA = object : UserService {
        override fun log(message: String) = println("A: $message")
    }

    // Implements `UserService`
    val serviceB = object : UserService {
        override fun log(message: String) = println("B: $message")
    }

    // Both `serviceA` and `serviceB` match the expected `UserService` type at the call site
    context(serviceA, serviceB) {
        outputMessage("This will not compile")
        // Ambiguity error
    }
}
```

#### 限制

上下文參數正在持續改進中；目前的一些限制包括：

* 建構函式 (Constructors) 無法聲明上下文參數
* 帶有上下文參數的屬性不能有支援欄位 (backing fields) 或初始化器 (initializers)
* 帶有上下文參數的屬性不能使用委派 (delegation)

然而，Kotlin 中的上下文參數透過簡化依賴注入 (dependency injection)、
改進的 DSL 設計和作用域操作 (scoped operations) 來管理依賴，這是一個顯著的改進。有關更多資訊，請參閱該功能的 [KEEP](https://github.com/Kotlin/KEEP/blob/context-parameters/proposals/context-parameters.md)。

#### 如何啟用上下文參數

要在您的專案中啟用上下文參數，請在命令列中使用以下編譯器選項：

```Bash
-Xcontext-parameters
```

或者將其添加到您的 Gradle 建置檔案的 `compilerOptions {}` 區塊中：

```kotlin
// build.gradle.kts
kotlin {
    compilerOptions {
        freeCompilerArgs.add("-Xcontext-parameters")
    }
}
```

> 同時指定 `-Xcontext-receivers` 和 `-Xcontext-parameters` 編譯器選項會導致錯誤。
>
> {style="warning"}

#### 留下您的意見回饋

此功能計畫在未來的 Kotlin 發佈版中穩定並改進。
我們非常感謝您在我們的問題追蹤器 [YouTrack](https://youtrack.jetbrains.com/issue/KT-10468/Context-Parameters-expanding-extension-receivers-to-work-with-scopes) 中提供意見回饋。

## Kotlin 編譯器：編譯器警告的統一管理

<primary-label ref="experimental-general"/>

Kotlin %kotlinEapVersion% 引入了一個新的編譯器選項，`-Xwarning-level`。它旨在提供一種統一的方式來管理 Kotlin 專案中的編譯器警告。

以前，您只能應用一般的模組範圍規則，例如使用
`-nowarn` 停用所有警告，使用 `-Werror` 將所有警告轉為編譯錯誤，或使用 `-Wextra` 啟用額外的編譯器檢查。調整特定警告的唯一選項是 `-Xsuppress-warning` 選項。

使用新的解決方案，您可以以一致的方式覆蓋一般規則並排除特定的診斷。

### 如何應用

新的編譯器選項具有以下語法：

```bash
-Xwarning-level=DIAGNOSTIC_NAME:(error|warning|disabled)
```

* `error`：將指定警告提升為錯誤。
* `warning`：發出警告，預設啟用。
* `disabled`：在模組範圍內完全抑制指定警告。

請記住，您只能使用新的編譯器選項配置 _警告_ 的嚴重性層級。

### 用途

使用新的解決方案，您可以透過將一般規則與特定規則結合，更好地微調專案中的警告報告。選擇您的用途：

#### 抑制警告

| **指令** | **描述** |
|---|---|
| [`-nowarn`](compiler-reference.md#nowarn) | 在編譯期間抑制所有警告。 |
| `-Xwarning-level=DIAGNOSTIC_NAME:disabled` | 僅抑制指定警告。作用與 [`-Xsuppress-warning`](compiler-reference.md#xsuppress-warning) 相同。 |
| `-nowarn -Xwarning-level=DIAGNOSTIC_NAME:warning` | 抑制所有警告，除了指定警告。 |

#### 將警告提升為錯誤

| **指令** | **描述** |
|---|---|
| [`-Werror`](compiler-reference.md#werror) | 將所有警告提升為編譯錯誤。 |
| `-Xwarning-level=DIAGNOSTIC_NAME:error` | 僅將指定警告提升為錯誤。 |
| `-Werror -Xwarning-level=DIAGNOSTIC_NAME:warning` | 將所有警告提升為錯誤，除了指定警告。 |

#### 啟用額外的編譯器警告

| **指令** | **描述** |
|---|---|
| [`-Wextra`](compiler-reference.md#wextra) | 啟用所有額外的聲明、表達式和類型編譯器檢查，如果為真則發出警告。 |
| `-Xwarning-level=DIAGNOSTIC_NAME:warning` | 僅啟用指定額外的編譯器檢查。 |
| `-Wextra -Xwarning-level=DIAGNOSTIC_NAME:disabled` | 啟用所有額外檢查，除了指定檢查。 |

#### 警告列表

如果您有許多警告想要從一般規則中排除，您可以透過 [`@argfile`](compiler-reference.md#argfile) 將它們列在單獨的檔案中。

### 留下意見回饋

新的編譯器選項仍處於 [實驗性](components-stability.md#stability-levels-explained) 階段。請向我們的問題追蹤器 [YouTrack](https://kotl.in/issue) 報告任何問題。

## Kotlin/JVM

### 介面函式預設方法生成變更

從 Kotlin %kotlinEapVersion% 開始，介面中聲明的函式將編譯為 JVM 預設方法，除非另有配置。
此變更影響了 Kotlin 介面函式及其實現如何編譯為位元組碼。
此行為由新的穩定編譯器選項 `-jvm-default` 控制，它取代了已棄用的 `-Xjvm-default` 選項。

您可以使用以下值控制 `-jvm-default` 選項的行為：

* `enable` (預設)：在介面中生成預設實現，並在子類和 `DefaultImpls` 類中包含橋接函式。使用此模式以保持與舊版 Kotlin 的二進位制相容性 (binary compatibility)。
* `no-compatibility`：僅在介面中生成預設實現。此模式跳過相容性橋接和 `DefaultImpls` 類，使其適用於新程式碼。
* `disable`：禁用介面中的預設實現。僅生成橋接函式和 `DefaultImpls` 類，與 Kotlin %kotlinEapVersion% 之前的行為相符。

要配置 `-jvm-default` 編譯器選項，請在您的 Gradle Kotlin DSL 中設定 `jvmDefault` 屬性：

```kotlin
kotlin {
  compilerOptions {
    jvmDefault = JvmDefaultMode.NO_COMPATIBILITY
  }
}
```

### 支援在 Kotlin 中繼資料中讀寫註解

<primary-label ref="experimental-general"/>

以前，您必須使用反射 (reflection) 或位元組碼分析 (bytecode analysis) 從已編譯的 JVM 類檔案中讀取註解 (annotations)，並根據簽名手動將它們與中繼資料 (metadata) 條目匹配。
此過程容易出錯，特別是對於重載函式 (overloaded functions)。

現在，在 Kotlin %kotlinEapVersion% 中，[Kotlin 中繼資料 JVM 函式庫](metadata-jvm.md) 引入了對讀取儲存在 Kotlin 中繼資料中註解的支援。

為了使註解在您已編譯檔案的中繼資料中可用，請添加以下編譯器選項：

```kotlin
-Xannotations-in-metadata
```

或者，將其添加到您的 Gradle 建置檔案的 `compilerOptions {}` 區塊中：

```kotlin
// build.gradle.kts
kotlin {
    compilerOptions {
        freeCompilerArgs.add("-Xannotations-in-metadata")
    }
}
```

啟用此選項後，Kotlin 編譯器會將註解與 JVM 位元組碼一同寫入中繼資料中，使 `kotlin-metadata-jvm` 函式庫能夠存取它們。

該函式庫提供了以下用於存取註解的 API：

* `KmClass.annotations`
* `KmFunction.annotations`
* `KmProperty.annotations`
* `KmConstructor.annotations`
* `KmPropertyAccessorAttributes.annotations`
* `KmValueParameter.annotations`
* `KmFunction.extensionReceiverAnnotations`
* `KmProperty.extensionReceiverAnnotations`
* `KmProperty.backingFieldAnnotations`
* `KmProperty.delegateFieldAnnotations`
* `KmEnumEntry.annotations`

這些 API 是 [實驗性](components-stability.md#stability-levels-explained) 的。
要選擇啟用，請使用 `@OptIn(ExperimentalAnnotationsInMetadata::class)` 註解。

以下是從 Kotlin 中繼資料中讀取註解的範例：

```kotlin
@file:OptIn(ExperimentalAnnotationsInMetadata::class)

import kotlin.metadata.ExperimentalAnnotationsInMetadata
import kotlin.metadata.jvm.KotlinClassMetadata

annotation class Label(val value: String)

@Label("Message class")
class Message

fun main() {
    val metadata = Message::class.java.getAnnotation(Metadata::class.java)
    val kmClass = (KotlinClassMetadata.readStrict(metadata) as KotlinClassMetadata.Class).kmClass
    println(kmClass.annotations)
    // [@Label(value = StringValue("Message class"))]
}
```

> 如果您在專案中使用 `kotlin-metadata-jvm` 函式庫，我們建議測試並更新您的程式碼以支援註解。
> 否則，當中繼資料中的註解在未來的 Kotlin 版本中[預設啟用](https://youtrack.jetbrains.com/issue/KT-75736)時，您的專案可能會產生無效或不完整的中繼資料。
>
> 如果您遇到任何問題，請在我們的[問題追蹤器](https://youtrack.jetbrains.com/issue/KT-31857) 中報告。
>
> {style="warning"}

## Kotlin/Native

### 每物件記憶體分配

<primary-label ref="experimental-opt-in"/>

Kotlin/Native 的[記憶體分配器](https://github.com/JetBrains/kotlin/blob/master/kotlin-native/runtime/src/alloc/custom/README.md) 現在可以按每個物件 (per-object) 的基礎來保留記憶體。在某些情況下，它可能幫助您避免嚴格的記憶體限制或應用程式啟動時的高記憶體消耗。

新功能旨在取代 `-Xallocator=std` 編譯器選項，該選項啟用系統記憶體分配器而不是預設分配器。現在您可以停用緩衝 (分頁分配) 而無需切換記憶體分配器。

此功能目前仍處於 [實驗性](components-stability.md#stability-levels-explained) 階段。
要啟用它，請在您的 `gradle.properties` 檔案中設定以下選項：

```none
kotlin.native.binary.pagedAllocator=false
```

請向我們的問題追蹤器 [YouTrack](https://kotl.in/issue) 報告任何問題。

### LLVM 從 16 版更新至 19 版

在 Kotlin %kotlinEapVersion% 中，我們將 LLVM 從版本 16 更新到 19。
新版本包括性能改進、錯誤修復和安全更新。

此更新不應影響您的程式碼，但如果您遇到任何問題，請向我們的[問題追蹤器](http://kotl.in/issue) 報告。

## Kotlin/Wasm：wasmJs 目標與 js 目標分離

以前，`wasmJs` 目標與 `js` 目標共享相同的基礎設施。因此，兩個目標都託管在同一個
目錄 (`build/js`) 中，並使用相同的 NPM 任務和配置。

現在，`wasmJs` 目標擁有自己獨立於 `js` 目標的基礎設施。這使得
Wasm 任務和類型可以與 JavaScript 任務和類型區分開來，實現獨立配置。

此外，Wasm 相關的專案檔案和 NPM 依賴現在位於一個單獨的 `build/wasm` 目錄中。

已為 Wasm 引入了新的 NPM 相關任務，而現有的 JavaScript 任務現在僅專用於 JavaScript：

| **Wasm 任務**          | **JavaScript 任務**  |
|------------------------|----------------------|
| `kotlinWasmNpmInstall` | `kotlinNpmInstall`   |
| `wasmRootPackageJson`  | `rootPackageJson`    |

同樣，引入了新的 Wasm 特定聲明：

| **Wasm 聲明**       | **JavaScript 聲明** |
|---------------------------|-----------------------------|
| `WasmNodeJsRootPlugin`    | `NodeJsRootPlugin`          |
| `WasmNodeJsPlugin`        | `NodeJsPlugin`              |
| `WasmYarnPlugin`          | `YarnPlugin`                |
| `WasmNodeJsRootExtension` | `NodeJsRootExtension`       |
| `WasmNodeJsEnvSpec`       | `NodeJsEnvSpec`             |
| `WasmYarnRootEnvSpec`     | `YarnRootEnvSpec`           |

您現在可以獨立於 JavaScript 目標使用 Wasm 目標，這簡化了配置。

此變更預設啟用，無需額外配置。

## Kotlin/JS

### 針對 @JsPlainObject 介面中 copy() 的修復

Kotlin/JS 有一個名為 `js-plain-objects` 的實驗性外掛程式，它為帶有 `@JsPlainObject` 註解的介面引入了 `copy()` 函式。
您可以使用 `copy()` 函式來操作物件。

然而，`copy()` 的初始實現與繼承不相容，這
導致了當一個 `@JsPlainObject` 介面擴展其他介面時的問題。

為避免對普通物件的限制，`copy()` 函式已從物件本身移至其伴生物件 (companion object)：

```kotlin
@JsPlainObject
external interface User {
    val name: String
    val age: Int
}

fun main() {
    val user = User(name = "SomeUser", age = 21)
    // This syntax is not valid anymore
    val copy = user.copy(age = 35)      
    // This is the correct syntax
    val copy = User.copy(user, age = 35)
}
```

此變更解決了繼承層次結構中的衝突並消除了歧義。
從 Kotlin %kotlinEapVersion% 開始，它預設啟用。

### 支援帶有 @JsModule 註解的檔案中的類型別名

以前，帶有 `@JsModule` 註解以從 JavaScript 模組匯入聲明的檔案
僅限於外部聲明 (external declarations)。
也就是說，您不能在此類檔案中聲明 `typealias`。

從 Kotlin %kotlinEapVersion% 開始，您可以在標記為 `@JsModule` 的檔案中聲明類型別名 (typealiases)：

```kotlin
@file:JsModule("somepackage")
package somepackage
typealias SomeClass = Any
```

此變更減少了 Kotlin/JS 互操作性 (interoperability) 限制的一個方面，未來發佈版中還計畫進行更多改進。

支援帶有 `@JsModule` 的檔案中的類型別名預設啟用。

## Gradle

Kotlin %kotlinEapVersion% 與 Gradle 7.6.3 至 8.14 完全相容。您也可以使用截至最新 Gradle 發佈版的所有 Gradle 版本。但是，請注意，這樣做可能會導致棄用警告，並且某些新的 Gradle 功能可能無法正常工作。

### 支援 Kotlin Gradle 外掛程式在控制台中的豐富輸出

在 Kotlin %kotlinEapVersion% 中，我們支援 Gradle 建置過程中控制台中的顏色及其他豐富輸出，使報告的診斷更容易閱讀和理解。
豐富輸出可在 Linux 和 macOS 支援的終端模擬器中使用。我們正在努力增加對 Windows 的支援。

![Gradle console](gradle-console-rich-output.png){width=600}

此功能預設啟用，但如果您想覆蓋它，請將以下 Gradle 屬性添加到您的 `gradle.properties` 檔案中：

```
org.gradle.console=plain
```

有關此屬性及其選項的更多資訊，請參閱 Gradle 關於[自訂日誌格式](https://docs.gradle.org/current/userguide/command_line_interface.html#sec:command_line_customizing_log_format) 的文件。

### 在 KGP 診斷中整合 Problems API

以前，Kotlin Gradle 外掛程式 (KGP) 僅將診斷（例如警告和錯誤）以純文字輸出到控制台或日誌中。

從 %kotlinEapVersion% 開始，KGP 引入了一種額外的報告機制：它現在使用 [Gradle 的 Problems API](https://docs.gradle.org/current/kotlin-dsl/gradle/org.gradle.api.problems/index.html)，
這是一種在建置過程中報告豐富、結構化問題資訊的標準化方式。

KGP 診斷現在更容易閱讀，並在 Gradle CLI 和 IntelliJ IDEA 等不同介面中顯示得更一致。

此整合預設啟用，從 Gradle 8.6 或更高版本開始。
由於該 API 仍在不斷發展，請使用最新的 Gradle 版本以受益於最新的改進。

### KGP 與 '--warning-mode' 的相容性

Kotlin Gradle 外掛程式 (KGP) 診斷以前使用固定的嚴重性層級報告問題，這意味著 Gradle 的 [`--warning-mode` 命令列選項](https://docs.gradle.org/current/userguide/command_line_interface.html#sec:command_line_warnings) 對 KGP 顯示錯誤的方式沒有影響。

現在，KGP 診斷與 `--warning-mode` 選項相容，提供了更大的靈活性。例如，
您可以將所有警告轉換為錯誤，或完全禁用警告。

透過此變更，KGP 診斷會根據選定的警告模式調整輸出：

* 當您設定 `--warning-mode=fail` 時，帶有 `Severity.Warning` 的診斷現在會提升為 `Severity.Error`。
* 當您設定 `--warning-mode=none` 時，帶有 `Severity.Warning` 的診斷不會被記錄。

此行為預設啟用，從 %kotlinEapVersion% 開始。

若要忽略 `--warning-mode` 選項，請在您的 Gradle 屬性中設定 `kotlin.internal.diagnostics.ignoreWarningMode=true`。

## Kotlin 標準函式庫：穩定的 Base64 和 HexFormat API

在 Kotlin %kotlinEapVersion% 中，[`Base64` API](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.io.encoding/-base64/) 和 [`HexFormat` API](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.text/-hex-format/) 現在已 [穩定](components-stability.md#stability-levels-explained)。

### Base64 編碼和解碼

Kotlin 1.8.20 引入了 [Base64 編碼和解碼的實驗性支援](whatsnew1820.md#support-for-base64-encoding)。
在 Kotlin %kotlinEapVersion% 中，[Base64 API](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.io.encoding/-base64/) 現在已穩定，並
包括四種編碼方案，其中新版 `Base64.Pem` 已在此發佈版中添加：

* [`Base64.Default`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.io.encoding/-base64/-default/) 使用標準的 [Base64 編碼方案](https://www.rfc-editor.org/rfc/rfc4648#section-4)。

  > `Base64.Default` 是 `Base64` 類別的伴生物件。
  > 因此，您可以使用 `Base64.encode()` 和 `Base64.decode()` 來呼叫其函式，而不是 `Base64.Default.encode()` 和 `Base64.Default.decode()`。
  >
  > {style="tip"}

* [`Base64.UrlSafe`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.io.encoding/-base64/-default/-url-safe.html) 使用 ["URL 和檔案名安全"](https://www.rfc-editor.org/rfc/rfc4648#section-5) 編碼方案。
* [`Base64.Mime`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.io.encoding/-base64/-default/-mime.html) 使用 [MIME](https://www.rfc-editor.org/rfc/rfc2045#section-6.8) 編碼方案，在編碼時每 76 個字元插入一個行分隔符，並在解碼時跳過非法字元。
* `Base64.Pem` 像 `Base64.Mime` 一樣編碼資料，但將行長度限制為 64 個字元。

您可以使用 Base64 API 將二進位資料編碼為 Base64 字串，並將其解碼回位元組。

以下是一個範例：

```kotlin
val foBytes = "fo".map { it.code.toByte() }.toByteArray()
Base64.Default.encode(foBytes) // "Zm8="
// Alternatively:
// Base64.encode(foBytes)

val foobarBytes = "foobar".map { it.code.toByte() }.toByteArray()
Base64.UrlSafe.encode(foobarBytes) // "Zm9vYmFy"

Base64.Default.decode("Zm8=") // foBytes
// Alternatively:
// Base64.decode("Zm8=")

Base64.UrlSafe.decode("Zm9vYmFy") // foobarBytes
```

在 JVM 上，使用 `.encodingWith()` 和 `.decodingWith()` 擴展函式，透過輸入和輸出流來編碼和解碼 Base64：

```kotlin
import kotlin.io.encoding.*
import java.io.ByteArrayOutputStream

fun main() {
    val output = ByteArrayOutputStream()
    val base64Output = output.encodingWith(Base64.Default)

    base64Output.use { stream ->
        stream.write("Hello World!!".encodeToByteArray())
    }

    println(output.toString())
    // SGVsbG8gV29ybGQhIQ==
}
```

### 使用 HexFormat API 進行十六進位解析和格式化

[Kotlin 1.9.0](whatsnew19.md#new-hexformat-class-to-format-and-parse-hexadecimals) 中引入的 [`HexFormat` API](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.text/-hex-format/) 現在已 [穩定](components-stability.md#stability-levels-explained)。
您可以使用它在數值和十六進位制字串之間進行轉換。

例如：

```kotlin
fun main() {
    //sampleStart
    println(93.toHexString())
    //sampleEnd
}
```
{kotlin-runnable="true"}

有關更多資訊，請參閱 [新的 HexFormat 類別用於格式化和解析十六進位制數](whatsnew19.md#new-hexformat-class-to-format-and-parse-hexadecimals)。