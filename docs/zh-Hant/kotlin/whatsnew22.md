[//]: # (title: Kotlin 2.2.0 的新功能)

_[發佈日期：2025 年 6 月 23 日](releases.md#release-details)_

Kotlin 2.2.0 版本現已推出！以下是主要亮點：

*   **語言**：預覽版中的新語言功能，包括[上下文參數](#preview-of-context-parameters)。數個[先前為實驗性的功能現已穩定](#stable-features-guard-conditions-non-local-break-and-continue-and-multi-dollar-interpolation)，例如守衛條件、非局部 `break` 和 `continue`，以及多美元符號插值。
*   **Kotlin 編譯器**：[統一管理編譯器警告](#kotlin-compiler-unified-management-of-compiler-warnings)。
*   **Kotlin/JVM**：[介面函數預設方法生成的變更](#changes-to-default-method-generation-for-interface-functions)。
*   **Kotlin/Native**：[LLVM 19 以及用於追蹤和調整記憶體消耗的新功能](#kotlin-native)。
*   **Kotlin/Wasm**：[分離的 Wasm 目標](#build-infrastructure-for-wasm-target-separated-from-javascript-target)以及為[每個專案配置 Binaryen 的功能](#per-project-binaryen-configuration)。
*   **Kotlin/JS**：[針對 `@JsPlainObject` 介面生成的 `copy()` 方法的修復](#fix-for-copy-in-jsplainobject-interfaces)。
*   **Gradle**：[Kotlin Gradle 插件中包含的二進位相容性驗證](#binary-compatibility-validation-included-in-kotlin-gradle-plugin)。
*   **標準函式庫**：[穩定的 Base64 和 HexFormat API](#stable-base64-encoding-and-decoding)。
*   **文件**：我們的[文件問卷調查已開放](https://surveys.jetbrains.com/s3/Kotlin-Docs-2025)，並且[Kotlin 文件已顯著改進](#documentation-updates)。

您還可以觀看這段 Kotlin 語言演進團隊討論新功能並回答問題的影片：

<video src="https://www.youtube.com/watch?v=jne3923lWtw" title="Kotlin 2.2.0 的新功能"/>

## IDE 支援

支援 2.2.0 的 Kotlin 插件已捆綁在最新版本的 IntelliJ IDEA 和 Android Studio 中。
您無需更新 IDE 中的 Kotlin 插件。
您只需在構建腳本中將 [Kotlin 版本](configure-build-for-eap.md#adjust-the-kotlin-version)變更為 2.2.0。

有關詳細資訊，請參閱[更新到新版本](releases.md#update-to-a-new-kotlin-version)。

## 語言

此版本將[守衛條件](#stable-features-guard-conditions-non-local-break-and-continue-and-multi-dollar-interpolation)、非局部 `break` 和 `continue`，以及多美元符號插值[晉升為穩定版](components-stability.md#stability-levels-explained)。此外，還以預覽版形式推出了多個功能，例如[上下文參數](#preview-of-context-parameters)和[上下文敏感解析](#preview-of-context-sensitive-resolution)。

### 上下文參數預覽
<primary-label ref="experimental-general"/> 

上下文參數允許函數和屬性宣告在周圍上下文中隱式可用的依賴。

使用上下文參數，您無需手動傳遞在多個函數呼叫集之間共享且很少變更的值，例如服務或依賴。

上下文參數取代了舊的實驗性功能，稱為上下文接收器。要從上下文接收器遷移到上下文參數，您可以使用 IntelliJ IDEA 中的輔助支援，如[部落格文章](https://blog.jetbrains.com/kotlin/2025/04/update-on-context-parameters/)中所述。

主要區別在於上下文參數不會作為接收器引入到函數主體中。因此，您需要使用上下文參數的名稱來存取其成員，這與上下文接收器不同，在上下文接收器中上下文是隱式可用的。

Kotlin 中的上下文參數在透過簡化依賴注入、改進 DSL 設計和作用域操作來管理依賴方面代表著顯著的改進。有關更多資訊，請參閱該功能的 [KEEP](https://github.com/Kotlin/KEEP/blob/context-parameters/proposals/context-parameters.md)。

#### 如何宣告上下文參數

您可以使用 `context` 關鍵字，後跟參數列表來宣告屬性和函數的上下文參數，每個參數的形式為 `name: Type`。以下是一個依賴 `UserService` 介面的範例：

```kotlin
// UserService 定義了上下文所需的依賴 
interface UserService {
    fun log(message: String)
    fun findUserById(id: Int): String
}

// 宣告帶有上下文參數的函數
context(users: UserService)
fun outputMessage(message: String) {
    // 使用來自上下文的 log
    users.log("Log: $message")
}

// 宣告帶有上下文參數的屬性
context(users: UserService)
val firstUser: String
    // 使用來自上下文的 findUserById    
    get() = users.findUserById(1)
```

您可以使用 `_` 作為上下文參數名稱。在這種情況下，參數的值可用於解析，但在區塊內部無法透過名稱存取：

```kotlin
// 使用 "_" 作為上下文參數名稱
context(_: UserService)
fun logWelcome() {
    // 從 UserService 找到合適的 log 函數
    outputMessage("Welcome!")
}
```

#### 如何啟用上下文參數

要在專案中啟用上下文參數，請在命令列中使用以下編譯器選項：

```Bash
-Xcontext-parameters
```

或者將其添加到 Gradle 構建檔案的 `compilerOptions {}` 區塊中：

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
{style="warning"}

#### 留下您的回饋

此功能計劃在未來的 Kotlin 版本中穩定並改進。
我們感謝您在我們的問題追蹤器 [YouTrack](https://youtrack.jetbrains.com/issue/KT-10468/Context-Parameters-expanding-extension-receivers-to-work-with-scopes) 上提供回饋。

### 上下文敏感解析預覽
<primary-label ref="experimental-general"/> 

Kotlin 2.2.0 在預覽版中引入了上下文敏感解析的實作。

以前，即使可以從上下文中推斷型別，您也必須寫出列舉項目或密封類別成員的完整名稱。
例如：

```kotlin
enum class Problem {
    CONNECTION, AUTHENTICATION, DATABASE, UNKNOWN
}

fun message(problem: Problem): String = when (problem) {
    Problem.CONNECTION -> "connection"
    Problem.AUTHENTICATION -> "authentication"
    Problem.DATABASE -> "database"
    Problem.UNKNOWN -> "unknown"
}
```

現在，透過上下文敏感解析，您可以在已知預期型別的上下文中省略型別名稱：

```kotlin
enum class Problem {
    CONNECTION, AUTHENTICATION, DATABASE, UNKNOWN
}

// 根據已知問題類型解析列舉項目
fun message(problem: Problem): String = when (problem) {
    CONNECTION -> "connection"
    AUTHENTICATION -> "authentication"
    DATABASE -> "database"
    UNKNOWN -> "unknown"
}
```

編譯器使用此上下文型別資訊來解析正確的成員。此資訊除其他外，包括：

*   `when` 表達式的主體
*   顯式回傳型別
*   宣告的變數型別
*   型別檢查 (`is`) 和型別轉換 (`as`)
*   密封類別繼承結構的已知型別
*   參數的宣告型別

> 上下文敏感解析不適用於函數、帶有參數的屬性或帶有接收器的擴充屬性。
>
{style="note"}

要在專案中試用上下文敏感解析，請在命令列中使用以下編譯器選項：

```bash
-Xcontext-sensitive-resolution
```

或者將其添加到 Gradle 構建檔案的 `compilerOptions {}` 區塊中：

```kotlin
// build.gradle.kts
kotlin {
    compilerOptions {
        freeCompilerArgs.add("-Xcontext-sensitive-resolution")
    }
}
```

我們計劃在未來的 Kotlin 版本中穩定並改進此功能，並感謝您在我們的問題追蹤器 [YouTrack](https://youtrack.jetbrains.com/issue/KT-16768/Context-sensitive-resolution) 上提供回饋。

### 註解使用站點目標功能預覽
<primary-label ref="experimental-general"/>

Kotlin 2.2.0 引入了幾項功能，使處理註解使用站點目標更加方便。

#### 屬性的 `@all` 中繼目標
<primary-label ref="experimental-general"/>

Kotlin 允許您將註解附加到宣告的特定部分，稱為[使用站點目標](annotations.md#annotation-use-site-targets)。然而，單獨註解每個目標既複雜又容易出錯：

```kotlin
data class User(
    val username: String,

    @param:Email      // 建構子參數
    @field:Email      // 支援欄位
    @get:Email        // Getter 方法
    @property:Email   // Kotlin 屬性參照
    val email: String,
) {
    @field:Email
    @get:Email
    @property:Email
    val secondaryEmail: String? = null
}
```

為簡化此過程，Kotlin 為屬性引入了新的 `@all` 中繼目標。
此功能會告訴編譯器將註解應用於屬性的所有相關部分。當您使用它時，`@all` 會嘗試將註解應用於：

*   **`param`**：建構子參數，如果它在主建構子中宣告。

*   **`property`**：Kotlin 屬性本身。

*   **`field`**：支援欄位，如果它存在。

*   **`get`**：Getter 方法。

*   **`set_param`**：Setter 方法的參數，如果屬性定義為 `var`。

*   **`RECORD_COMPONENT`**：如果類別是 `@JvmRecord`，則註解會應用於 [Java 記錄組件](#improved-support-for-annotating-jvm-records)。此行為模擬了 Java 處理記錄組件上註解的方式。

編譯器只會將註解應用於給定屬性的目標。

在下面的範例中，`@Email` 註解應用於每個屬性的所有相關目標：

```kotlin
data class User(
    val username: String,

    // 將 @Email 應用於 param、property、field、
    // get 和 set_param (如果是 var)
    @all:Email val email: String,
) {
    // 將 @Email 應用於 property、field 和 getter 
    // (沒有 param，因為它不在建構子中)
    @all:Email val secondaryEmail: String? = null
}
```

您可以將 `@all` 中繼目標與任何屬性一起使用，無論是在主建構子內部還是外部。但是，您不能將 `@all` 中繼目標與[多個註解](https://kotlinlang.org/spec/syntax-and-grammar.html#grammar-rule-annotation)一起使用。

這項新功能簡化了語法、確保了一致性，並改善了與 Java 記錄的互通性。

要在專案中啟用 `@all` 中繼目標，請在命令列中使用以下編譯器選項：

```Bash
-Xannotation-target-all
```

或者將其添加到 Gradle 構建檔案的 `compilerOptions {}` 區塊中：

```kotlin
// build.gradle.kts
kotlin {
    compilerOptions {
        freeCompilerArgs.add("-Xannotation-target-all")
    }
}
```

此功能目前處於預覽階段。請向我們的問題追蹤器 [YouTrack](https://kotl.in/issue) 報告任何問題。
有關 `@all` 中繼目標的更多資訊，請閱讀此 [KEEP](https://github.com/Kotlin/KEEP/blob/master/proposals/annotation-target-in-properties.md) 提案。

#### 註解使用站點目標的新預設規則
<primary-label ref="experimental-general"/>

Kotlin 2.2.0 引入了新的預設規則，用於將註解傳播到參數、欄位和屬性。以前，註解預設僅應用於 `param`、`property` 或 `field` 之一，現在的預設行為更符合註解的預期。

如果有多個適用目標，則選擇一個或多個目標，如下所示：

*   如果建構子參數目標 (`param`) 適用，則使用它。
*   如果屬性目標 (`property`) 適用，則使用它。
*   如果欄位目標 (`field`) 適用而 `property` 不適用，則使用 `field`。

如果有多個目標，並且 `param`、`property` 或 `field` 都不適用，則註解會導致錯誤。

要啟用此功能，請將其添加到 Gradle 構建檔案的 `compilerOptions {}` 區塊中：

```kotlin
// build.gradle.kts
kotlin {
    compilerOptions {
        freeCompilerArgs.add("-Xannotation-default-target=param-property")
    }
}
```

或者使用編譯器的命令列參數：

```Bash
-Xannotation-default-target=param-property
```

如果您想使用舊行為，您可以：

*   在特定情況下，明確定義必要的目標，例如，使用 `@param:Annotation` 而不是 `@Annotation`。
*   對於整個專案，請在 Gradle 構建檔案中使用此旗標：

    ```kotlin
    // build.gradle.kts
    kotlin {
        compilerOptions {
            freeCompilerArgs.add("-Xannotation-default-target=first-only")
        }
    }
    ```

此功能目前處於預覽階段。請向我們的問題追蹤器 [YouTrack](https://kotl.in/issue) 報告任何問題。
有關註解使用站點目標的新預設規則的更多資訊，請閱讀此 [KEEP](https://github.com/Kotlin/KEEP/blob/master/proposals/annotation-target-in-properties.md) 提案。

### 支援巢狀型別別名
<primary-label ref="beta"/>

以前，您只能在 Kotlin 檔案的頂層宣告[型別別名](type-aliases.md)。這意味著即使是內部或領域特定型別別名也必須存在於使用它們的類別之外。

從 2.2.0 開始，您可以在其他宣告內部定義型別別名，只要它們不捕獲其外部類別的型別參數：

```kotlin
class Dijkstra {
    typealias VisitedNodes = Set<Node>

    private fun step(visited: VisitedNodes, ...) = ...
}
```

巢狀型別別名有一些額外的限制，例如無法提及型別參數。請查閱[文件](type-aliases.md#nested-type-aliases)以瞭解完整的規則集。

巢狀型別別名透過改善封裝、減少套件層級的雜亂並簡化內部實作，實現了更清晰、更易於維護的程式碼。

#### 如何啟用巢狀型別別名

要在專案中啟用巢狀型別別名，請在命令列中使用以下編譯器選項：

```bash
-Xnested-type-aliases
```

或者將其添加到 Gradle 構建檔案的 `compilerOptions {}` 區塊中：

```kotlin
// build.gradle.kts
kotlin {
    compilerOptions {
        freeCompilerArgs.add("-Xnested-type-aliases")
    }
}
```

#### 分享您的回饋

巢狀型別別名目前處於 [Beta](components-stability.md#stability-levels-explained) 階段。請向我們的問題追蹤器 [YouTrack](https://kotl.in/issue) 報告任何問題。有關此功能的更多資訊，請閱讀此 [KEEP](https://github.com/Kotlin/KEEP/blob/master/proposals/nested-typealias.md) 提案。

### 穩定版功能：守衛條件、非局部 `break` 和 `continue`，以及多美元符號插值

在 Kotlin 2.1.0 中，以預覽版形式引入了幾項新的語言功能。
我們很高興地宣佈，以下語言功能在此版本中已[穩定](components-stability.md#stability-levels-explained)：

*   [帶有主體的 `when` 表達式中的守衛條件](whatsnew21.md#guard-conditions-in-when-with-a-subject)
*   [非局部 `break` 和 `continue`](whatsnew21.md#non-local-break-and-continue)
*   [多美元符號插值：改進字串字面值中 `$` 的處理](whatsnew21.md#multi-dollar-string-interpolation)

[查看 Kotlin 語言設計功能和提案的完整列表](kotlin-language-features-and-proposals.md)。

## Kotlin 編譯器：統一管理編譯器警告
<primary-label ref="experimental-general"/>

Kotlin 2.2.0 引入了一個新的編譯器選項 `-Xwarning-level`。它旨在提供一種統一的方式來管理 Kotlin 專案中的編譯器警告。

以前，您只能應用一般的模組範圍規則，例如使用 `-nowarn` 禁用所有警告，使用 `-Werror` 將所有警告變為編譯錯誤，或使用 `-Wextra` 啟用額外編譯器檢查。針對特定警告進行調整的唯一選項是 `-Xsuppress-warning` 選項。

透過新解決方案，您可以覆寫一般規則並以一致的方式排除特定診斷。

### 如何應用

新的編譯器選項具有以下語法：

```bash
-Xwarning-level=DIAGNOSTIC_NAME:(error|warning|disabled)
```

*   `error`：將指定的警告提升為錯誤。
*   `warning`：發出警告並預設啟用。
*   `disabled`：完全抑制模組範圍內指定的警告。

請記住，您只能使用新的編譯器選項配置**警告**的嚴重性層級。

### 用例

透過新解決方案，您可以透過將一般規則與特定規則結合，更好地微調專案中的警告報告。
選擇您的用例：

#### 抑制警告

| 指令                                              | 描述                                           |
|---------------------------------------------------|------------------------------------------------|
| [`-nowarn`](compiler-reference.md#nowarn)         | 在編譯期間抑制所有警告。                       |
| `-Xwarning-level=DIAGNOSTIC_NAME:disabled`        | 僅抑制指定的警告。                             |
| `-nowarn -Xwarning-level=DIAGNOSTIC_NAME:warning` | 抑制所有警告，除了指定的警告。                 |

#### 將警告提升為錯誤

| 指令                                              | 描述                                                     |
|---------------------------------------------------|----------------------------------------------------------|
| [`-Werror`](compiler-reference.md#werror)         | 將所有警告提升為編譯錯誤。                               |
| `-Xwarning-level=DIAGNOSTIC_NAME:error`           | 僅將指定警告提升為錯誤。                                 |
| `-Werror -Xwarning-level=DIAGNOSTIC_NAME:warning` | 將所有警告提升為錯誤，除了指定的警告。                   |

#### 啟用額外編譯器警告

| 指令                                                | 描述                                                                                                   |
|-----------------------------------------------------|--------------------------------------------------------------------------------------------------------|
| [`-Wextra`](compiler-reference.md#wextra)           | 啟用所有額外的宣告、表達式和型別編譯器檢查，如果為 true 則會發出警告。                                 |
| `-Xwarning-level=DIAGNOSTIC_NAME:warning`           | 僅啟用指定額外的編譯器檢查。                                                                           |
| `-Wextra -Xwarning-level=DIAGNOSTIC_NAME:disabled`  | 啟用所有額外的檢查，除了指定的檢查。                                                                   |

#### 警告列表

如果您有很多要從一般規則中排除的警告，您可以透過 [`@argfile`](compiler-reference.md#argfile) 將它們列在單獨的檔案中。

### 留下回饋

新的編譯器選項仍處於 [實驗性](components-stability.md#stability-levels-explained) 階段。請向我們的問題追蹤器 [YouTrack](https://kotl.in/issue) 報告任何問題。

## Kotlin/JVM

Kotlin 2.2.0 為 JVM 帶來了許多更新。編譯器現在支援 Java 24 位元組碼，並引入了介面函數預設方法生成的變更。此版本還簡化了在 Kotlin 元資料中處理註解，改進了 Java 與內聯值類別的互通性，並包含了對註解 JVM 記錄的更好支援。

### 介面函數預設方法生成的變更

從 Kotlin 2.2.0 開始，除非另行配置，否則介面中宣告的函數將被編譯為 JVM 預設方法。
此變更會影響 Kotlin 介面函數及其實作如何被編譯為位元組碼。

此行為由新的穩定編譯器選項 `-jvm-default` 控制，該選項取代了已棄用的 `-Xjvm-default` 選項。

您可以使用以下值控制 `-jvm-default` 選項的行為：

*   `enable` (預設)：在介面中生成預設實作，並在子類別和 `DefaultImpls` 類別中包含橋接函數。使用此模式可以保持與舊版 Kotlin 的二進位相容性。
*   `no-compatibility`：僅在介面中生成預設實作。此模式跳過相容性橋接和 `DefaultImpls` 類別，使其適用於新程式碼。
*   `disable`：禁用介面中的預設實作。僅生成橋接函數和 `DefaultImpls` 類別，符合 Kotlin 2.2.0 之前的行為。

要配置 `-jvm-default` 編譯器選項，請在 Gradle Kotlin DSL 中設定 `jvmDefault` 屬性：

```kotlin
// build.gradle.kts
kotlin {
    compilerOptions {
        jvmDefault = JvmDefaultMode.NO_COMPATIBILITY
    }
}
```

### 支援讀寫 Kotlin 元資料中的註解
<primary-label ref="experimental-general"/>

以前，您必須使用反射或位元組碼分析從編譯的 JVM 類別檔案中讀取註解，並根據簽名手動將它們與元資料項目匹配。
此過程容易出錯，特別是對於重載函數。

現在，在 Kotlin 2.2.0 中，[](metadata-jvm.md) 引入了對讀取儲存在 Kotlin 元資料中的註解的支援。

要使註解在您編譯檔案的元資料中可用，請添加以下編譯器選項：

```kotlin
-Xannotations-in-metadata
```

或者，將其添加到 Gradle 構建檔案的 `compilerOptions {}` 區塊中：

```kotlin
// build.gradle.kts
kotlin {
    compilerOptions {
        freeCompilerArgs.add("-Xannotations-in-metadata")
    }
}
```

啟用此選項後，Kotlin 編譯器會將註解與 JVM 位元組碼一起寫入元資料，使其可被 `kotlin-metadata-jvm` 函式庫存取。

該函式庫提供了以下 API 以存取註解：

*   `KmClass.annotations`
*   `KmFunction.annotations`
*   `KmProperty.annotations`
*   `KmConstructor.annotations`
*   `KmPropertyAccessorAttributes.annotations`
*   `KmValueParameter.annotations`
*   `KmFunction.extensionReceiverAnnotations`
*   `KmProperty.extensionReceiverAnnotations`
*   `KmProperty.backingFieldAnnotations`
*   `KmProperty.delegateFieldAnnotations`
*   `KmEnumEntry.annotations`

這些 API 都是 [實驗性](components-stability.md#stability-levels-explained)的。
要啟用，請使用 `@OptIn(ExperimentalAnnotationsInMetadata::class)` 註解。

以下是從 Kotlin 元資料讀取註解的範例：

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
    // 輸出：[@Label(value = StringValue("Message class"))]
}
```

> 如果您在專案中使用 `kotlin-metadata-jvm` 函式庫，我們建議測試和更新您的程式碼以支援註解。
> 否則，當元資料中的註解在未來的 Kotlin 版本中[預設啟用](https://youtrack.jetbrains.com/issue/KT-75736)時，您的專案可能會
> 產生無效或不完整的元資料。
>
> 如果您遇到任何問題，請在我們的[問題追蹤器](https://youtrack.jetbrains.com/issue/KT-31857)中報告。
>
{style="warning"}

### 改進 Java 與內聯值類別的互通性
<primary-label ref="experimental-general"/>

Kotlin 2.2.0 引入了一個新的實驗性註解：[`@JvmExposeBoxed`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.jvm/-jvm-expose-boxed/)。此註解使從 Java 使用[內聯值類別](inline-classes.md)變得更容易。

預設情況下，Kotlin 編譯內聯值類別以使用**解裝箱表示**，這些表示性能更高，但從 Java 使用通常很困難甚至不可能。例如：

```kotlin
@JvmInline value class PositiveInt(val number: Int) {
    init { require(number >= 0) }
}
```

在這種情況下，因為該類別是解裝箱的，所以 Java 沒有可呼叫的建構子。Java 也無法觸發 `init` 區塊以確保 `number` 是正數。

當您使用 `@JvmExposeBoxed` 註解類別時，Kotlin 會生成一個公共建構子，Java 可以直接呼叫該建構子，確保 `init` 區塊也運行。

您可以將 `@JvmExposeBoxed` 註解應用於類別、建構子或函數層級，以對公開給 Java 的內容進行細粒度控制。

例如，在以下程式碼中，擴充函數 `.timesTwoBoxed()` **不**可從 Java 存取：

```kotlin
@JvmInline
value class MyInt(val value: Int)

fun MyInt.timesTwoBoxed(): MyInt = MyInt(this.value * 2)
```

為了能夠建立 `MyInt` 類別的實例並從 Java 程式碼呼叫 `.timesTwoBoxed()` 函數，請將 `@JvmExposeBoxed` 註解添加到類別和函數中：

```kotlin
@JvmExposeBoxed
@JvmInline
value class MyInt(val value: Int)

@JvmExposeBoxed
fun MyInt.timesTwoBoxed(): MyInt = MyInt(this.value * 2)
```

透過這些註解，Kotlin 編譯器會為 `MyInt` 類別生成一個 Java 可存取的建構子。它還會為使用值類別裝箱形式的擴充函數生成一個重載。因此，以下 Java 程式碼將成功運行：

```java
MyInt input = new MyInt(5);
MyInt output = ExampleKt.timesTwoBoxed(input);
```

如果您不想註解要公開的內聯值類別的每個部分，您可以有效地將註解應用於整個模組。要將此行為應用於模組，請使用 `-Xjvm-expose-boxed` 選項編譯它。使用此選項編譯的效果與模組中的每個宣告都帶有 `@JvmExposeBoxed` 註解相同。

此新註解不改變 Kotlin 在內部編譯或使用值類別的方式，並且所有現有編譯程式碼仍然有效。它只是添加了新功能以改進 Java 互通性。使用值類別的 Kotlin 程式碼的性能不受影響。

`@JvmExposeBoxed` 註解對於函式庫作者非常有用，他們希望公開成員函數的裝箱變體並接收裝箱回傳型別。它消除了在內聯值類別（高效但僅限 Kotlin）和資料類別（Java 相容但始終裝箱）之間進行選擇的需要。

有關 `@JvmExposedBoxed` 註解的工作原理及其解決的問題的更詳細解釋，請參閱此 [KEEP](https://github.com/Kotlin/KEEP/blob/jvm-expose-boxed/proposals/jvm-expose-boxed.md) 提案。

### 改進對註解 JVM 記錄的支援

Kotlin 自 Kotlin 1.5.0 起就支援 [JVM 記錄](jvm-records.md)。現在，Kotlin 2.2.0 改進了 Kotlin 如何處理記錄組件上的註解，特別是關於 Java 的 [`RECORD_COMPONENT`](https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/lang/annotation/ElementType.html#RECORD_COMPONENT) 目標。

首先，如果您想使用 `RECORD_COMPONENT` 作為註解目標，您需要手動為 Kotlin (`@Target`) 和 Java 添加註解。這是因為 Kotlin 的 `@Target` 註解不支援 `RECORD_COMPONENT`。例如：

```kotlin
@Target(AnnotationTarget.CLASS, AnnotationTarget.PROPERTY)
@java.lang.annotation.Target(ElementType.CLASS, ElementType.RECORD_COMPONENT)
annotation class exampleClass
```

手動維護這兩個列表容易出錯，因此 Kotlin 2.2.0 引入了一個編譯器警告，如果 Kotlin 和 Java 目標不匹配。例如，如果您在 Java 目標列表中省略 `ElementType.CLASS`，編譯器會報告：

```
Incompatible annotation targets: Java target 'CLASS' missing, corresponding to Kotlin targets 'CLASS'.
```

其次，Kotlin 在記錄中傳播註解的行為與 Java 不同。在 Java 中，記錄組件上的註解會自動應用於支援欄位、getter 和建構子參數。Kotlin 預設不這樣做，但您現在可以使用 [`@all:` 使用站點目標](#all-meta-target-for-properties)來複製此行為。

例如：

```kotlin
@JvmRecord
data class Person(val name: String, @all:Positive val age: Int)
```

當您將 `@JvmRecord` 與 `@all:` 一起使用時，Kotlin 現在：

*   將註解傳播到屬性、支援欄位、建構子參數和 getter。
*   如果註解支援 Java 的 `RECORD_COMPONENT`，也會將註解應用於記錄組件。

## Kotlin/Native

從 2.2.0 開始，Kotlin/Native 使用 LLVM 19。此版本還帶來了幾項實驗性功能，旨在追蹤和調整記憶體消耗。

### 按物件記憶體分配
<primary-label ref="experimental-opt-in"/>

Kotlin/Native 的[記憶體分配器](https://github.com/JetBrains/kotlin/blob/master/kotlin-native/runtime/src/alloc/custom/README.md)現在可以按物件預留記憶體。在某些情況下，這可能幫助您滿足嚴格的記憶體限制或減少應用程式啟動時的記憶體消耗。

新功能旨在取代 `-Xallocator=std` 編譯器選項，該選項啟用系統記憶體分配器而非預設分配器。現在，您無需切換記憶體分配器即可禁用緩衝（分配分頁）。

此功能目前為 [實驗性](components-stability.md#stability-levels-explained)。
要啟用它，請在 `gradle.properties` 檔案中設定以下選項：

```none
kotlin.native.binary.pagedAllocator=false
```

請向我們的問題追蹤器 [YouTrack](https://kotl.in/issue) 報告任何問題。

### 支援執行時的 Latin-1 編碼字串
<primary-label ref="experimental-opt-in"/>

Kotlin 現在支援 Latin-1 編碼字串，類似於 [JVM](https://openjdk.org/jeps/254)。這應該有助於減少應用程式的二進位檔案大小並調整記憶體消耗。

預設情況下，Kotlin 中的字串使用 UTF-16 編碼儲存，其中每個字元由兩個位元組表示。在某些情況下，這會導致字串在二進位檔案中佔用的空間是原始碼的兩倍，並且從簡單的 ASCII 檔案讀取資料可能需要兩倍於將檔案儲存在磁碟上的記憶體。

相對地，[Latin-1 (ISO 8859-1)](https://en.wikipedia.org/wiki/ISO/IEC_8859-1) 編碼僅用一個位元組表示前 256 個 Unicode 字元。啟用 Latin-1 支援後，只要所有字元都在其範圍內，字串就會以 Latin-1 編碼儲存。否則，將使用預設的 UTF-16 編碼。

#### 如何啟用 Latin-1 支援

此功能目前為 [實驗性](components-stability.md#stability-levels-explained)。
要啟用它，請在 `gradle.properties` 檔案中設定以下選項：

```none
kotlin.native.binary.latin1Strings=true
```
#### 已知問題

只要該功能處於實驗性階段，cinterop 擴充函數 [`String.pin`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlinx.cinterop/pin.html)、[`String.usePinned`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlinx.cinterop/use-pinned.html) 和 [`String.refTo`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlinx.cinterop/ref-to.html) 的效率會降低。每次呼叫它們都可能觸發自動字串轉換為 UTF-16。

Kotlin 團隊非常感謝 Google 的同事，特別是 [Sonya Valchuk](https://github.com/pyos) 實作此功能。

有關 Kotlin 中記憶體消耗的更多資訊，請參閱[文件](native-memory-manager.md#memory-consumption)。

### 改進對 Apple 平台上記憶體消耗的追蹤

從 Kotlin 2.2.0 開始，Kotlin 程式碼分配的記憶體現已標記。這可以幫助您在 Apple 平台上偵錯記憶體問題。

當檢查應用程式的高記憶體使用量時，您現在可以識別 Kotlin 程式碼保留了多少記憶體。Kotlin 的部分用識別碼標記，可以透過 Xcode Instruments 中的 VM Tracker 等工具進行追蹤。

此功能預設啟用，但僅在滿足以下**所有**條件時，才在 Kotlin/Native 預設記憶體分配器中可用：

*   **標記啟用**。記憶體應使用有效識別碼標記。Apple 建議數字介於 240 到 255 之間；預設值為 246。

    如果您設定 `kotlin.native.binary.mmapTag=0` Gradle 屬性，則標記將被禁用。

*   **使用 mmap 分配**。分配器應使用 `mmap` 系統呼叫將檔案映射到記憶體中。

    如果您設定 `kotlin.native.binary.disableMmap=true` Gradle 屬性，則預設分配器將使用 `malloc` 而不是 `mmap`。

*   **分頁啟用**。應啟用分配分頁（緩衝）。

    如果您設定 [`kotlin.native.binary.pagedAllocator=false`](#per-object-memory-allocation) Gradle 屬性，則記憶體將改為按物件預留。

有關 Kotlin 中記憶體消耗的更多資訊，請參閱[文件](native-memory-manager.md#memory-consumption)。

### LLVM 從 16 更新到 19

在 Kotlin 2.2.0 中，我們將 LLVM 從版本 16 更新到 19。
新版本包括性能改進、錯誤修復和安全更新。

此更新不應影響您的程式碼，但如果您遇到任何問題，請向我們的[問題追蹤器](http://kotl.in/issue)報告。

### Windows 7 目標已棄用

從 Kotlin 2.2.0 開始，最低支援的 Windows 版本已從 Windows 7 提升到 Windows 10。由於 Microsoft 已於 2025 年 1 月終止對 Windows 7 的支援，我們也決定棄用此舊版目標。

有關更多資訊，請參閱[](native-target-support.md)。

## Kotlin/Wasm

在此版本中，[Wasm 目標的構建基礎設施與 JavaScript 目標分離](#build-infrastructure-for-wasm-target-separated-from-javascript-target)。此外，您現在可以[按專案配置 Binaryen 工具](#per-project-binaryen-configuration)。

### Wasm 目標的構建基礎設施與 JavaScript 目標分離

以前，`wasmJs` 目標與 `js` 目標共享相同的基礎設施。因此，兩個目標都託管在相同目錄 (`build/js`) 中，並使用相同的 NPM 任務和配置。

現在，`wasmJs` 目標擁有獨立於 `js` 目標的基礎設施。這允許 Wasm 任務和型別與 JavaScript 任務和型別不同，實現獨立配置。

此外，Wasm 相關的專案檔案和 NPM 依賴現在儲存在單獨的 `build/wasm` 目錄中。

已為 Wasm 引入了新的 NPM 相關任務，而現有的 JavaScript 任務現在僅專用於 JavaScript：

| **Wasm 任務**          | **JavaScript 任務**  |
|------------------------|----------------------|
| `kotlinWasmNpmInstall` | `kotlinNpmInstall`   |
| `wasmRootPackageJson`  | `rootPackageJson`    |

同樣，也添加了新的 Wasm 特定宣告：

| **Wasm 宣告**       | **JavaScript 宣告** |
|---------------------|---------------------|
| `WasmNodeJsRootPlugin`    | `NodeJsRootPlugin`          |
| `WasmNodeJsPlugin`        | `NodeJsPlugin`              |
| `WasmYarnPlugin`          | `YarnPlugin`                |
| `WasmNodeJsRootExtension` | `NodeJsRootExtension`       |
| `WasmNodeJsEnvSpec`       | `NodeJsEnvSpec`             |
| `WasmYarnRootEnvSpec`     | `YarnRootEnvSpec`           |

您現在可以獨立於 JavaScript 目標使用 Wasm 目標，這簡化了配置過程。

此變更預設啟用，無需額外設定。

### 按專案配置 Binaryen

Binaryen 工具用於 Kotlin/Wasm [優化生產構建](whatsnew20.md#optimized-production-builds-by-default-using-binaryen)，以前在根專案中配置一次。

現在，您可以按專案或模組配置 Binaryen 工具。此變更符合 Gradle 的最佳實踐，並確保更好地支援[專案隔離](https://docs.gradle.org/current/userguide/isolated_projects.html)等功能，從而提高複雜構建中的構建性能和可靠性。

此外，您現在可以根據需要為不同的模組配置不同版本的 Binaryen。

此功能預設啟用。但是，如果您有 Binaryen 的自訂配置，您現在需要按專案應用它，而不是僅在根專案中。

## Kotlin/JS

此版本改進了 [`@JsPlainObject` 介面中的 `copy()` 函數](#fix-for-copy-in-jsplainobject-interfaces)、[帶有 `@JsModule` 註解檔案中的型別別名](#support-for-type-aliases-in-files-with-jsmodule-annotation)以及其他 Kotlin/JS 功能。

### 修復 `@JsPlainObject` 介面中的 `copy()`

Kotlin/JS 有一個實驗性插件，稱為 `js-plain-objects`，它為帶有 `@JsPlainObject` 註解的介面引入了一個 `copy()` 函數。您可以使用 `copy()` 函數來操作物件。

然而，`copy()` 的初始實作與繼承不相容，這導致 `@JsPlainObject` 介面擴展其他介面時出現問題。

為了避免對普通物件的限制，`copy()` 函數已從物件本身移動到其伴生物件：

```kotlin
@JsPlainObject
external interface User {
    val name: String
    val age: Int
}

fun main() {
    val user = User(name = "SomeUser", age = 21)
    // 此語法不再有效
    val copy = user.copy(age = 35)      
    // 這是正確的語法
    val copy = User.copy(user, age = 35)
}
```

此變更解決了繼承層次結構中的衝突並消除了歧義。
從 Kotlin 2.2.0 開始，它預設啟用。

### 支援帶有 `@JsModule` 註解檔案中的型別別名

以前，帶有 `@JsModule` 註解以從 JavaScript 模組匯入宣告的檔案僅限於外部宣告。這意味著您不能在此類檔案中宣告 `typealias`。

從 Kotlin 2.2.0 開始，您可以在標記為 `@JsModule` 的檔案中宣告型別別名：

```kotlin
@file:JsModule("somepackage")
package somepackage
typealias SomeClass = Any
```

此變更減少了 Kotlin/JS 互通性限制的一個方面，並且計劃在未來版本中進行更多改進。

支援帶有 `@JsModule` 檔案中的型別別名預設啟用。

### 支援多平台 `expect` 宣告中的 `@JsExport`

在 Kotlin 多平台專案中使用 [`expect/actual` 機制](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-expect-actual.html)時，無法將 `@JsExport` 註解用於通用程式碼中的 `expect` 宣告。

從此版本開始，您可以直接將 `@JsExport` 應用於 `expect` 宣告：

```kotlin
// commonMain

// 之前會產生錯誤，但現在可以正常運作 
@JsExport
expect class WindowManager {
    fun close()
}

@JsExport
fun acceptWindowManager(manager: WindowManager) {
    ...
}

// jsMain

@JsExport
actual class WindowManager {
    fun close() {
        window.close()
    }
}
```

您還必須在 JavaScript 來源集中用 `@JsExport` 註解對應的 `actual` 實作，並且它必須只使用可匯出型別。

此修復允許在 `commonMain` 中定義的共享程式碼正確匯出到 JavaScript。您現在可以將您的多平台程式碼公開給 JavaScript 消費者，而無需使用手動解決方案。

此變更預設啟用。

### 能夠將 `@JsExport` 與 `Promise<Unit>` 型別一起使用

以前，當您嘗試使用 `@JsExport` 註解匯出回傳 `Promise<Unit>` 型別的函數時，Kotlin 編譯器會產生錯誤。

雖然像 `Promise<Int>` 這樣的回傳型別可以正常運作，但使用 `Promise<Unit>` 會觸發「不可匯出型別」警告，即使它在 TypeScript 中正確映射到 `Promise<void>`。

此限制已被移除。現在，以下程式碼編譯時沒有錯誤：

```kotlin
// 之前運作正常
@JsExport
fun fooInt(): Promise<Int> = GlobalScope.promise {
    delay(100)
    return@promise 42
}

// 之前會產生錯誤，但現在可以正常運作
@JsExport
fun fooUnit(): Promise<Unit> = GlobalScope.promise {
    delay(100)
}
```

此變更移除了 Kotlin/JS 互通模型中不必要的限制。此修復預設啟用。

## Gradle

Kotlin 2.2.0 完全相容於 Gradle 7.6.3 至 8.14。您也可以使用最新發佈的 Gradle 版本。但是，請注意，這樣做可能會導致棄用警告，並且某些新的 Gradle 功能可能無法運作。

在此版本中，Kotlin Gradle 插件對其診斷功能進行了多項改進。它還引入了[二進位相容性驗證](#binary-compatibility-validation-included-in-kotlin-gradle-plugin)的實驗性整合，使函式庫開發更容易。

### 二進位相容性驗證包含在 Kotlin Gradle 插件中
<primary-label ref="experimental-general"/>

為了更輕鬆地檢查函式庫版本之間的二進位相容性，我們正在實驗性地將 [二進位相容性驗證器](https://github.com/Kotlin/binary-compatibility-validator) 的功能移入 Kotlin Gradle 插件 (KGP) 中。您可以在玩具專案中試用，但我們暫不建議在生產環境中使用。

原始的 [二進位相容性驗證器](https://github.com/Kotlin/binary-compatibility-validator) 將在此實驗階段繼續維護。

Kotlin 函式庫可以使用兩種二進位格式之一：JVM 類別檔案或 `klib`。由於這些格式不相容，KGP 會分別處理它們。

要啟用二進位相容性驗證功能集，請將以下內容添加到 `build.gradle.kts` 檔案中的 `kotlin{}` 區塊中：

```kotlin
// build.gradle.kts
kotlin {
    @OptIn(org.jetbrains.kotlin.gradle.dsl.abi.ExperimentalAbiValidation::class)
    abiValidation {
        // 使用 set() 函數以確保與舊版 Gradle 的相容性
        enabled.set(true)
    }
}
```

如果您的專案有多個模組需要檢查二進位相容性，請在每個模組中獨立配置此功能。每個模組都可以有自己的自訂配置。

啟用後，運行 `checkLegacyAbi` Gradle 任務以檢查二進位相容性問題。您可以在 IntelliJ IDEA 中或從專案目錄的命令列運行該任務：

```kotlin
./gradlew checkLegacyAbi
```

此任務會將當前程式碼的應用程式二進位介面 (ABI) 轉儲生成為 UTF-8 文字檔案。然後，該任務會將新轉儲與先前版本的轉儲進行比較。如果任務發現任何差異，它會將其報告為錯誤。審查錯誤後，如果您決定變更可接受，您可以透過運行 `updateLegacyAbi` Gradle 任務來更新參考 ABI 轉儲。

#### 過濾類別

此功能允許您在 ABI 轉儲中過濾類別。您可以透過名稱或部分名稱，或透過標記它們的註解（或註解名稱的部分）明確包含或排除類別。

例如，此範例排除了 `com.company` 套件中的所有類別：

```kotlin
// build.gradle.kts
kotlin {
    @OptIn(org.jetbrains.kotlin.gradle.dsl.abi.ExperimentalAbiValidation::class)
    abiValidation {
        filters.excluded.byNames.add("com.company.**")
    }
}
```

請查閱 [KGP API 參考](https://kotlinlang.org/api/kotlin-gradle-plugin/kotlin-gradle-plugin-api/org.jetbrains.kotlin.gradle.dsl.abi/) 以瞭解有關配置二進位相容性驗證器的更多資訊。

#### 多平台限制

在多平台專案中，如果您的主機不支援所有目標的交叉編譯，KGP 會嘗試透過檢查其他目標的 ABI 轉儲來推斷不支援目標的 ABI 變更。這種方法有助於避免如果您稍後切換到**可以**編譯所有目標的主機時出現錯誤的驗證失敗。

您可以更改此預設行為，使 KGP 不會推斷不支援目標的 ABI 變更，方法是將以下內容添加到您的 `build.gradle.kts` 檔案中：

```kotlin
// build.gradle.kts
kotlin {
    @OptIn(org.jetbrains.kotlin.gradle.dsl.abi.ExperimentalAbiValidation::class)
    abiValidation {
        klib {
            keepUnsupportedTargets = false
        }
    }
}
```

然而，如果您的專案中有不支援的目標，運行 `checkLegacyAbi` 任務會失敗，因為該任務無法建立 ABI 轉儲。如果檢查失敗比因從其他目標推斷的 ABI 變更而錯過不相容的變更更重要，則此行為可能是可取的。

### 支援 Kotlin Gradle 插件在控制台中豐富輸出

在 Kotlin 2.2.0 中，我們支援 Gradle 構建過程中控制台中的顏色和其他豐富輸出，使報告的診斷資訊更容易閱讀和理解。

豐富輸出在 Linux 和 macOS 支援的終端模擬器中可用，我們正在努力為 Windows 添加支援。

![Gradle console](gradle-console-rich-output.png){width=600}

此功能預設啟用，但如果您想覆寫它，請將以下 Gradle 屬性添加到您的 `gradle.properties` 檔案中：

```
org.gradle.console=plain
```

有關此屬性及其選項的更多資訊，請參閱 Gradle 文件中關於[自訂日誌格式](https://docs.gradle.org/current/userguide/command_line_interface.html#sec:command_line_customizing_log_format)的部分。

### 將 Problems API 整合到 KGP 診斷中

以前，Kotlin Gradle 插件 (KGP) 只能將警告和錯誤等診斷報告為純文字輸出到控制台或日誌中。

從 2.2.0 開始，KGP 引入了一種額外的報告機制：它現在使用 [Gradle 的 Problems API](https://docs.gradle.org/current/kotlin-dsl/gradle/org.gradle.api.problems/index.html)，這是一種標準化的方式，用於在構建過程中報告豐富、結構化的問題資訊。

現在，KGP 診斷更容易閱讀，並且在不同的介面中顯示更一致，例如 Gradle CLI 和 IntelliJ IDEA。

從 Gradle 8.6 或更高版本開始，此整合預設啟用。
由於 API 仍在發展中，請使用最新的 Gradle 版本以受益於最新的改進。

### KGP 與 `--warning-mode` 的相容性

Kotlin Gradle 插件 (KGP) 診斷報告問題時使用固定的嚴重性層級，這意味著 Gradle 的 [`--warning-mode` 命令列選項](https://docs.gradle.org/current/userguide/command_line_interface.html#sec:command_line_warnings) 對 KGP 顯示錯誤的方式沒有影響。

現在，KGP 診斷與 `--warning-mode` 選項相容，提供了更大的靈活性。例如，您可以將所有警告轉換為錯誤或完全禁用警告。

透過此變更，KGP 診斷會根據選定的警告模式調整輸出：

*   當您設定 `--warning-mode=fail` 時，`Severity.Warning` 的診斷現在會提升為 `Severity.Error`。
*   當您設定 `--warning-mode=none` 時，`Severity.Warning` 的診斷不會被記錄。

此行為從 2.2.0 開始預設啟用。

要忽略 `--warning-mode` 選項，請將以下 Gradle 屬性設定到您的 `gradle.properties` 檔案中：

```
kotlin.internal.diagnostics.ignoreWarningMode=true
```

## 新的實驗性構建工具 API
<primary-label ref="experimental-general"/>

您可以將 Kotlin 與各種構建系統一起使用，例如 Gradle、Maven、Amper 等。然而，將 Kotlin 整合到每個系統中以支援完整功能集，例如增量編譯以及與 Kotlin 編譯器插件、守護程序和 Kotlin 多平台的相容性，需要付出大量努力。

為簡化此過程，Kotlin 2.2.0 引入了一個新的實驗性構建工具 API (BTA)。BTA 是一個通用 API，作為構建系統和 Kotlin 編譯器生態系統之間的抽象層。透過這種方法，每個構建系統只需支援單一 BTA 入口點。

目前，BTA 僅支援 Kotlin/JVM。JetBrains 的 Kotlin 團隊已在 Kotlin Gradle 插件 (KGP) 和 `kotlin-maven-plugin` 中使用它。您可以透過這些插件試用 BTA，但 API 本身尚未準備好用於您自己的構建工具整合的一般使用。如果您對 BTA 提案感到好奇或想分享您的回饋，請參閱此 [KEEP](https://github.com/Kotlin/KEEP/issues/421) 提案。

要在以下情況下試用 BTA：

*   KGP，將以下屬性添加到您的 `gradle.properties` 檔案中：

```kotlin
kotlin.compiler.runViaBuildToolsApi=true
```   

*   Maven，您無需執行任何操作。它預設啟用。

BTA 目前對 Maven 插件沒有直接好處，但它為更快地交付新功能奠定了堅實基礎，例如[支援 Kotlin 守護程序](https://youtrack.jetbrains.com/issue/KT-77587/Maven-Introduce-Kotlin-daemon-support-and-make-it-enabled-by-default)和[增量編譯的穩定化](https://youtrack.jetbrains.com/issue/KT-77086/Stabilize-incremental-compilation-in-Maven)。

對於 KGP，使用 BTA 已經具有以下好處：

*   [改進「進程內」編譯器執行策略](#improved-in-process-compiler-execution-strategy)
*   [更靈活地從 Kotlin 配置不同編譯器版本](#flexibility-to-configure-different-compiler-versions-from-kotlin)

### 改進「進程內」編譯器執行策略

KGP 支援三種 [Kotlin 編譯器執行策略](gradle-compilation-and-caches.md#defining-kotlin-compiler-execution-strategy)。以前，「進程內」策略（在 Gradle 守護程序進程中執行編譯器）不支援增量編譯。

現在，使用 BTA，「進程內」策略**確實**支援增量編譯。要使用它，請將以下屬性添加到您的 `gradle.properties` 檔案中：

```kotlin
kotlin.compiler.execution.strategy=in-process
```

### 從 Kotlin 配置不同編譯器版本的靈活性

有時您可能希望在程式碼中使用較新的 Kotlin 編譯器版本，同時保持 KGP 為舊版本 — 例如，在嘗試新語言功能的同時處理構建腳本棄用。或者您可能想更新 KGP 的版本，但保留舊的 Kotlin 編譯器版本。

BTA 使這一切成為可能。以下是您如何在 `build.gradle.kts` 檔案中配置它：

```kotlin
// build.gradle.kts
import org.jetbrains.kotlin.buildtools.api.ExperimentalBuildToolsApi
import org.jetbrains.kotlin.gradle.ExperimentalKotlinGradlePluginApi

plugins { 
    kotlin("jvm") version "2.2.0"
}

group = "org.jetbrains.example"
version = "1.0-SNAPSHOT"

repositories { 
    mavenCentral()
}

kotlin { 
    jvmToolchain(8)
    @OptIn(ExperimentalBuildToolsApi::class, ExperimentalKotlinGradlePluginApi::class) 
    compilerVersion.set("2.1.21") // 與 2.2.0 不同的版本
}

```

BTA 支援配置 KGP 和 Kotlin 編譯器版本，可與前三個主要版本和一個後續主要版本一起使用。因此在 KGP 2.2.0 中，支援 Kotlin 編譯器版本 2.1.x、2.0.x 和 1.9.25。KGP 2.2.0 也與未來的 Kotlin 編譯器版本 2.2.x 和 2.3.x 相容。

然而，請記住，將不同編譯器版本與編譯器插件一起使用可能會導致 Kotlin 編譯器異常。Kotlin 團隊計劃在未來版本中解決這些問題。

透過這些插件試用 BTA，並在 [KGP](https://youtrack.jetbrains.com/issue/KT-56574) 和 [Maven 插件](https://youtrack.jetbrains.com/issue/KT-73012) 的專用 YouTrack 票證中向我們發送您的回饋。

## Kotlin 標準函式庫

在 Kotlin 2.2.0 中，[`Base64` API](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.io.encoding/-base64/) 和 [`HexFormat` API](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.text/-hex-format/) 現已[穩定](components-stability.md#stability-levels-explained)。

### 穩定的 Base64 編碼和解碼

Kotlin 1.8.20 引入了對 [Base64 編碼和解碼的實驗性支援](whatsnew1820.md#support-for-base64-encoding)。
在 Kotlin 2.2.0 中，[Base64 API](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.io.encoding/-base64/) 現已[穩定](components-stability.md#stability-levels-explained)，並包含四種編碼方案，其中此版本新增了 `Base64.Pem`：

*   [`Base64.Default`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.io.encoding/-base64/-default/) 使用標準的 [Base64 編碼方案](https://www.rfc-editor.org/rfc/rfc4648#section-4)。

    > `Base64.Default` 是 `Base64` 類別的伴生物件。
    > 因此，您可以直接呼叫其函數，例如 `Base64.encode()` 和 `Base64.decode()`，而不是 `Base64.Default.encode()` 和 `Base64.Default.decode()`。
    >
    {style="tip"}

*   [`Base64.UrlSafe`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.io.encoding/-base64/-default/-url-safe.html) 使用「[URL 和檔案安全](https://www.rfc-editor.org/rfc/rfc4648#section-5)」編碼方案。
*   [`Base64.Mime`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.io.encoding/-base64/-default/-mime.html) 使用 [MIME](https://www.rfc-editor.org/rfc/rfc2045#section-6.8) 編碼方案，在編碼期間每 76 個字元插入一個行分隔符，並在解碼期間跳過非法字元。
*   `Base64.Pem` 像 `Base64.Mime` 一樣編碼資料，但將行長度限制為 64 個字元。

您可以使用 Base64 API 將二進位資料編碼為 Base64 字串，然後將其解碼回位元組。

以下是一個範例：

```kotlin
val foBytes = "fo".map { it.code.toByte() }.toByteArray()
Base64.Default.encode(foBytes) // "Zm8="
// 或者：
// Base64.encode(foBytes)

val foobarBytes = "foobar".map { it.code.toByte() }.toByteArray()
Base64.UrlSafe.encode(foobarBytes) // "Zm9vYmFy"

Base64.Default.decode("Zm8=") // foBytes
// 或者：
// Base64.decode("Zm8=")

Base64.UrlSafe.decode("Zm9vYmFy") // foobarBytes
```

在 JVM 上，使用 `.encodingWith()` 和 `.decodingWith()` 擴充函數對帶有輸入和輸出串流的 Base64 進行編碼和解碼：

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
    // 輸出：SGVsbG8gV29ybGQhIQ==
}
```

### 使用 `HexFormat` API 穩定進行十六進位解析和格式化

在 [Kotlin 1.9.0](whatsnew19.md#new-hexformat-class-to-format-and-parse-hexadecimals) 中引入的 [`HexFormat` API](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.text/-hex-format/) 現已[穩定](components-stability.md#stability-levels-explained)。您可以使用它在數值和十六進位字串之間進行轉換。

例如：

```kotlin
fun main() {
    //sampleStart
    println(93.toHexString())
    //sampleEnd
}
```
{kotlin-runnable="true"}

有關更多資訊，請參閱[新的 HexFormat 類別，用於格式化和解析十六進位數](whatsnew19.md#new-hexformat-class-to-format-and-parse-hexadecimals)。

## Compose 編譯器

在此版本中，Compose 編譯器引入了對可組合函數參照的支援，並更改了幾個功能標誌的預設值。

### 支援 `@Composable` 函數參照

Compose 編譯器從 Kotlin 2.2.0 版本開始支援可組合函數參照的宣告和使用：

```kotlin
val content: @Composable (String) -> Unit = ::Text

@Composable fun App() {
    content("My App")
}
```

可組合函數參照在執行時的行為與可組合 lambda 物件略有不同。特別是，可組合 lambda 透過擴展 `ComposableLambda` 類別來實現對跳過更精細的控制。函數參照預計將實作 `KCallable` 介面，因此相同的優化不能應用於它們。

### `PausableComposition` 功能標誌預設啟用

從 Kotlin 2.2.0 開始，`PausableComposition` 功能標誌預設啟用。此標誌會調整 Compose 編譯器針對可重新啟動函數的輸出，允許執行時強制跳過行為，從而透過跳過每個函數來有效地暫停組合。這使得繁重的組合可以在幀之間分割，這將在未來的版本中用於預取。

要禁用此功能標誌，請將以下內容添加到您的 Gradle 配置中：

```kotlin
// build.gradle.kts
composeCompiler {
    featureFlag = setOf(ComposeFeatureFlag.PausableComposition.disabled())
}
```

### `OptimizeNonSkippingGroups` 功能標誌預設啟用

從 Kotlin 2.2.0 開始，`OptimizeNonSkippingGroups` 功能標誌預設啟用。此優化透過移除為非跳過可組合函數生成的組呼叫來改進執行時性能。它不應導致任何可觀察的行為變化。

如果您遇到任何問題，可以透過禁用此功能標誌來驗證此變更是否導致問題。請向 [Jetpack Compose 問題追蹤器](https://issuetracker.google.com/issues/new?component=610764&template=1424126) 報告任何問題。

要禁用 `OptimizeNonSkippingGroups` 標誌，請將以下內容添加到您的 Gradle 配置中：

```kotlin
composeCompiler {
    featureFlag = setOf(ComposeFeatureFlag.OptimizeNonSkippingGroups.disabled())
}
```

### 已棄用的功能標誌

`StrongSkipping` 和 `IntrinsicRemember` 功能標誌現已棄用，並將在未來版本中移除。如果您遇到任何導致您禁用這些功能標誌的問題，請向 [Jetpack Compose 問題追蹤器](https://issuetracker.google.com/issues/new?component=610764&template=1424126) 報告。

## 重大變更和棄用

本節重點介紹值得注意的重要重大變更和棄用。有關此版本中所有重大變更和棄用的完整概述，請參閱我們的[相容性指南](compatibility-guide-22.md)。

*   從 Kotlin 2.2.0 開始，對 [](ant.md) 構建系統的支援已棄用。Kotlin 對 Ant 的支援已很久沒有積極開發，並且由於其使用者群體相對較小，因此沒有進一步維護的計劃。

    我們計劃在 2.3.0 中移除 Ant 支援。然而，Kotlin 仍然開放[貢獻](contribute.md)。如果您有興趣成為 Ant 的外部維護者，請在 [此 YouTrack 問題](https://youtrack.jetbrains.com/issue/KT-75875/) 中留下評論並將可見性設定為「jetbrains-team」。

*   Kotlin 2.2.0 [將 Gradle 中 `kotlinOptions{}` 區塊的棄用等級提升為錯誤](compatibility-guide-22.md#deprecate-kotlinoptions-dsl)。請改用 `compilerOptions{}` 區塊。有關更新構建腳本的指南，請參閱[從 `kotlinOptions{}` 遷移到 `compilerOptions{}`](gradle-compiler-options.md#migrate-from-kotlinoptions-to-compileroptions)。
*   Kotlin 腳本仍然是 Kotlin 生態系統的重要組成部分，但我們專注於特定用例，例如自訂腳本編寫，以及 `gradle.kts` 和 `main.kts` 腳本，以提供更好的體驗。要瞭解更多資訊，請參閱我們更新的[部落格文章](https://blog.jetbrains.com/kotlin/2024/11/state-of-kotlin-scripting-2024/)。因此，Kotlin 2.2.0 棄用對以下內容的支援：

    *   REPL：要繼續透過 `kotlinc` 使用 REPL，請使用 `-Xrepl` 編譯器選項啟用。
    *   JSR-223：由於此 [JSR](https://jcp.org/en/jsr/detail?id=223) 處於**已撤銷**狀態，JSR-223 實作將繼續與語言版本 1.9 一起運作，但未來將不會遷移以使用 K2 編譯器。
    *   `KotlinScriptMojo` Maven 插件：我們沒有看到此插件足夠的關注。如果您繼續使用它，您將會看到編譯器警告。
*   
*   在 Kotlin 2.2.0 中，[`KotlinCompileTool`](https://kotlinlang.org/api/kotlin-gradle-plugin/kotlin-gradle-plugin-api/org.jetbrains.kotlin.gradle.tasks/-kotlin-compile-tool/#) 中的 [`setSource()`](https://kotlinlang.org/api/kotlin-gradle-plugin/kotlin-gradle-plugin-api/org.jetbrains.kotlin.gradle.tasks/-kotlin-compile-tool/set-source.html#) 函數現在[取代了已配置的來源而不是添加它們](compatibility-guide-22.md#correct-setsource-function-in-kotlincompiletool-to-replace-sources)。如果您想添加來源而不取代現有來源，請使用 [`source()`](https://kotlinlang.org/api/kotlin-gradle-plugin/kotlin-gradle-plugin-api/org.jetbrains.kotlin.gradle.tasks/-kotlin-compile-tool/source.html#) 函數。
*   `BaseKapt` 中 [`annotationProcessorOptionProviders`](https://kotlinlang.org/api/kotlin-gradle-plugin/kotlin-gradle-plugin-api/org.jetbrains.kotlin.gradle.tasks/-base-kapt/annotation-processor-option-providers.html#) 的型別已從 [`MutableList<Any>` 變更為 `MutableList<CommandLineArgumentProvider>`](compatibility-guide-22.md#deprecate-basekapt-annotationprocessoroptionproviders-property)。如果您的程式碼目前將列表作為單一元素添加，請使用 `addAll()` 函數而不是 `add()` 函數。
*   繼廢棄了用於舊版 Kotlin/JS 後端的死程式碼消除 (DCE) 工具之後，所有與 DCE 相關的 DSL 現已從 Kotlin Gradle 插件中移除：
    *   `org.jetbrains.kotlin.gradle.dsl.KotlinJsDce` 介面
    *   `org.jetbrains.kotlin.gradle.targets.js.dsl.KotlinJsBrowserDsl.dceTask(body: Action<KotlinJsDce>)` 函數
    *   `org.jetbrains.kotlin.gradle.dsl.KotlinJsDceCompilerToolOptions` 介面
    *   `org.jetbrains.kotlin.gradle.dsl.KotlinJsDceOptions` 介面

    目前的 [JS IR 編譯器](js-ir-compiler.md) 原生支援 DCE，而 [`@JsExport`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.js/-js-export/) 註解允許指定在 DCE 期間保留哪些 Kotlin 函數和類別。

*   已棄用的 `kotlin-android-extensions` 插件已[在 Kotlin 2.2.0 中移除](compatibility-guide-22.md#deprecate-kotlin-android-extensions-plugin)。請改用 `kotlin-parcelize` 插件作為 `Parcelable` 實作生成器，並使用 Android Jetpack 的 [視圖綁定](https://developer.android.com/topic/libraries/view-binding) 作為合成視圖。
*   實驗性 `kotlinArtifacts` API 已[在 Kotlin 2.2.0 中棄用](compatibility-guide-22.md#deprecate-kotlinartifacts-api)。請使用 Kotlin Gradle 插件中可用的當前 DSL 來[構建最終原生二進位檔](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-build-native-binaries.html)。如果這不足以進行遷移，請在[此 YT 問題](https://youtrack.jetbrains.com/issue/KT-74953)中留下評論。
*   在 Kotlin 1.9.0 中棄用的 `KotlinCompilation.source` 現已[從 Kotlin Gradle 插件中移除](compatibility-guide-22.md#deprecate-kotlincompilation-source-api)。
*   實驗性通用化模式的參數已[在 Kotlin 2.2.0 中棄用](compatibility-guide-22.md#deprecate-commonization-parameters)。清除通用化快取以刪除無效的編譯構件。
*   已棄用的 `konanVersion` 屬性現已[從 `CInteropProcess` 任務中移除](compatibility-guide-22.md#deprecate-konanversion-in-cinteropprocess)。請改用 `CInteropProcess.kotlinNativeVersion`。
*   使用已棄用的 `destinationDir` 屬性現在將[導致錯誤](compatibility-guide-22.md#deprecate-destinationdir-in-cinteropprocess)。請改用 `CInteropProcess.destinationDirectory.set()`。

## 文件更新

此版本帶來了顯著的文件變更，包括將 Kotlin 多平台文件遷移到 [KMP 入口網站](https://www.jetbrains.com/help/kotlin-multiplatform-dev/get-started.html)。

此外，我們還啟動了一項文件問卷調查，創建了新的頁面和教學，並改進了現有的。

### Kotlin 的文件問卷調查

我們正在尋求真實回饋，以改進 Kotlin 文件。

此問卷調查大約需要 15 分鐘完成，您的意見將有助於塑造 Kotlin 文件的未來。

[在此處參與問卷調查](https://surveys.jetbrains.com/s3/Kotlin-Docs-2025)。

### 新增和改進的教學

*   [Kotlin 中級導覽](kotlin-tour-welcome.md) – 將您對 Kotlin 的理解提升到更高層次。了解何時使用擴充函數、介面、類別等。
*   [構建使用 Spring AI 的 Kotlin 應用程式](spring-ai-guide.md) – 了解如何創建一個使用 OpenAI 和向量資料庫回答問題的 Kotlin 應用程式。
*   [](jvm-create-project-with-spring-boot.md) – 了解如何使用 IntelliJ IDEA 的**新專案**精靈創建一個帶有 Gradle 的 Spring Boot 專案。
*   [映射 Kotlin 和 C 教學系列](mapping-primitive-data-types-from-c.md) – 了解不同型別和結構如何在 Kotlin 和 C 之間映射。
*   [使用 C 互通和 libcurl 創建應用程式](native-app-with-c-and-libcurl.md) – 創建一個簡單的 HTTP 客戶端，可以使用 libcurl C 函式庫原生運行。
*   [創建您的 Kotlin 多平台函式庫](https://www.jetbrains.com/help/kotlin-multiplatform-dev/create-kotlin-multiplatform-library.html) – 了解如何使用 IntelliJ IDEA 創建和發布多平台函式庫。
*   [使用 Ktor 和 Kotlin 多平台構建全棧應用程式](https://ktor.io/docs/full-stack-development-with-kotlin-multiplatform.html) – 此教學現在使用 IntelliJ IDEA 而不是 Fleet，以及 Material 3 和最新版本的 Ktor 和 Kotlin。
*   [管理 Compose 多平台應用程式中的本地資源環境](https://www.jetbrains.com/help/kotlin-multiplatform-dev/compose-resource-environment.html) – 了解如何管理應用程式的資源環境，例如應用程式內主題和語言。

### 新增和改進的頁面

*   [Kotlin for AI 概述](kotlin-ai-apps-development-overview.md) – 探索 Kotlin 在構建 AI 驅動應用程式方面的功能。
*   [Dokka 遷移指南](https://kotlinlang.org/docs/dokka-migration.html) – 了解如何遷移到 Dokka Gradle 插件的 v2。
*   [](metadata-jvm.md) – 探索有關讀取、修改和生成針對 JVM 編譯的 Kotlin 類別的元資料的指南。
*   [CocoaPods 整合](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-cocoapods-overview.html) – 透過教學和範例專案，了解如何設定環境、添加 Pod 依賴，或將 Kotlin 專案作為 CocoaPod 依賴使用。
*   為支援 iOS 穩定版，Compose 多平台新增頁面：
    *   特別是[導覽](https://www.jetbrains.com/help/kotlin-multiplatform-dev/compose-navigation.html)和[深度連結](https://www.jetbrains.com/help/kotlin-multiplatform-dev/compose-navigation-deep-links.html)。
    *   [在 Compose 中實作佈局](https://www.jetbrains.com/help/kotlin-multiplatform-dev/compose-layout.html)。
    *   [字串本地化](https://www.jetbrains.com/help/kotlin-multiplatform-dev/compose-localize-strings.html)以及其他 i18n 頁面，例如支援從右到左的語言。
*   [Compose 熱重載](https://www.jetbrains.com/help/kotlin-multiplatform-dev/compose-hot-reload.html) – 了解如何在桌面目標上使用 Compose 熱重載，以及如何將其添加到現有專案中。
*   [Exposed 遷移](https://www.jetbrains.com/help/exposed/migrations.html) – 了解 Exposed 提供的用於管理資料庫結構變更的工具。

## 如何更新到 Kotlin 2.2.0

Kotlin 插件作為捆綁插件分發在 IntelliJ IDEA 和 Android Studio 中。

要更新到新的 Kotlin 版本，請在您的構建腳本中將 [Kotlin 版本](releases.md#update-to-a-new-kotlin-version) 變更為 2.2.0。