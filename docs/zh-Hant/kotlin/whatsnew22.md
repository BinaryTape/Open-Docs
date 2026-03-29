[//]: # (title: Kotlin 2.2.0 的新功能)

<web-summary>閱讀 Kotlin 2.2.0 版本說明，內容涵蓋新的語言特性、Kotlin Multiplatform、JVM、Native、JS 和 Wasm 的更新，以及 Gradle 與 Maven 的建置工具支援。</web-summary>

_[發佈日期：2025 年 6 月 23 日](releases.md#release-history)_

Kotlin 2.2.0 正式發佈！以下是主要的亮點：

* **語言**：預覽新的語言特性，包括 [上下文參數 (context parameters)](#preview-of-context-parameters)。 
  數個
  [先前處於實驗階段的特性現已穩定](#stable-features-guard-conditions-non-local-break-and-continue-and-multi-dollar-interpolation)，
  例如防護條件 (guard conditions)、非區域 break 與 continue，以及多美元符號插值 (multi-dollar interpolation)。
* **Kotlin 編譯器**：[統一管理編譯器警告](#kotlin-compiler-unified-management-of-compiler-warnings)。
* **Kotlin/JVM**：[變更介面函式的預設方法產生方式](#changes-to-default-method-generation-for-interface-functions)。
* **Kotlin/Native**：[LLVM 19 以及用於追蹤與調整記憶體消耗的新特性](#kotlin-native)。
* **Kotlin/Wasm**：[獨立的 Wasm 目標](#build-infrastructure-for-wasm-target-separated-from-javascript-target) 以及為[每個專案配置 Binaryen](#per-project-binaryen-configuration) 的能力。
* **Kotlin/JS**：[修正為 `@JsPlainObject` 介面產生的 `copy()` 方法](#fix-for-copy-in-jsplainobject-interfaces)。
* **Gradle**：[Kotlin Gradle 外掛程式中包含二進位相容性驗證](#binary-compatibility-validation-included-in-kotlin-gradle-plugin)。
* **標準程式庫**：[穩定的 Base64 與 HexFormat API](#stable-base64-encoding-and-decoding)。
* **文件**：[對 Kotlin 文件進行了顯著改進](#documentation-updates)。

您也可以觀看這段影片，由 Kotlin 語言演進團隊討論新特性並回答問題：

<video src="https://www.youtube.com/watch?v=jne3923lWtw" title="Kotlin 2.2.0 的新功能"/>

> 有關 Kotlin 發佈週期的資訊，請參閱 [Kotlin 發佈程序](releases.md)。
>
{style="tip"}

## IDE 支援

支援 2.2.0 的 Kotlin 外掛程式已隨附於最新版本的 IntelliJ IDEA 與 Android Studio 中。
您不需要更新 IDE 中的 Kotlin 外掛程式。
您只需要在建置指令碼中
將 [Kotlin 版本變更](configure-build-for-eap.md#adjust-the-kotlin-version) 為 2.2.0。

詳情請參閱 [更新至新版本](releases.md#update-to-a-new-kotlin-version)。

## 語言

此版本將防護條件、
非區域 `break` 與 `continue`
以及多美元符號插值 [提升](#stable-features-guard-conditions-non-local-break-and-continue-and-multi-dollar-interpolation) 為 [穩定版](components-stability.md#stability-levels-explained)。
此外，還引入了數項預覽特性，
例如 [上下文參數](#preview-of-context-parameters) 與 [上下文相關解析](#preview-of-context-sensitive-resolution)。

### 上下文參數預覽
<primary-label ref="experimental-general"/> 

上下文參數 (context parameters) 允許函式與屬性宣告在周圍上下文中隱式可用的相依性。

透過上下文參數，您不需要手動傳遞那些在多組函式呼叫之間共用且鮮少變動的值（例如服務或相依性）。

上下文參數取代了舊有的實驗性特性「上下文接收器 (context receivers)」。若要從上下文接收器遷移至上下文參數，您可以使用 IntelliJ IDEA 中的輔助支援，如 [部落格文章](https://blog.jetbrains.com/kotlin/2025/04/update-on-context-parameters/) 中所述。

主要的差異在於上下文參數不會作為函式主體中的接收器引入。因此，您需要使用上下文參數的名稱來存取其成員，這與上下文接收器不同，後者的上下文是隱式可用的。

Kotlin 中的上下文參數代表了透過簡化的相依注入、改進的 DSL 設計以及具作用域的操作來管理相依性的顯著進步。如需更多資訊，請參閱該特性的 [KEEP](https://github.com/Kotlin/KEEP/blob/context-parameters/proposals/context-parameters.md)。

#### 如何宣告上下文參數

您可以使用 `context` 關鍵字宣告屬性和函式的上下文參數，
後接圓括號內的參數清單，每個參數的形式為 `name: Type`。以下是相依於 `UserService` 介面的範例：

```kotlin
// UserService 定義了上下文中需要的相依性 
interface UserService {
    fun log(message: String)
    fun findUserById(id: Int): String
}

// 宣告一個具有上下文參數的函式
context(users: UserService)
fun outputMessage(message: String) {
    // 使用上下文中的 log
    users.log("Log: $message")
}

// 宣告一個具有上下文參數的屬性
context(users: UserService)
val firstUser: String
    // 使用上下文中的 findUserById    
    get() = users.findUserById(1)
```

您可以使用 `_` 作為上下文參數名稱。在這種情況下，參數的值可用於解析，但在區塊內部無法透過名稱存取：

```kotlin
// 使用 "_" 作為上下文參數名稱
context(_: UserService)
fun logWelcome() {
    // 從 UserService 尋找適當的 log 函式
    outputMessage("Welcome!")
}
```

#### 如何啟用上下文參數

若要在您的專案中啟用上下文參數，請在命令列中使用以下編譯器選項：

```Bash
-Xcontext-parameters
```

或將其加入 Gradle 建置檔案的 `compilerOptions {}` 區塊中：

```kotlin
// build.gradle.kts
kotlin {
    compilerOptions {
        freeCompilerArgs.add("-Xcontext-parameters")
    }
}
```

> 同時指定 `-Xcontext-receivers` 與 `-Xcontext-parameters` 編譯器選項會導致錯誤。
>
{style="warning"}

#### 提供您的回饋

此特性計劃在未來的 Kotlin 版本中穩定並改進。
我們誠摯歡迎您在問題追蹤器 [YouTrack](https://youtrack.jetbrains.com/issue/KT-10468/Context-Parameters-expanding-extension-receivers-to-work-with-scopes) 提供回饋。

### 上下文相關解析預覽
<primary-label ref="experimental-general"/> 

Kotlin 2.2.0 引入了上下文相關解析 (context-sensitive resolution) 的預覽實作。

您可以在這段影片中找到此特性的概觀：

<video src="https://www.youtube.com/v/aF8RYQrJI8Q" title="Kotlin 2.2.0 中的上下文相關解析"/>

以前，即使可以從上下文中推論出型別，您也必須寫出列舉項目或密封類別成員的完整名稱。
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

現在，透過上下文相關解析，在已知預期型別的上下文中，您可以省略型別名稱：

```kotlin
enum class Problem {
    CONNECTION, AUTHENTICATION, DATABASE, UNKNOWN
}

// 根據已知的 problem 型別解析列舉項目
fun message(problem: Problem): String = when (problem) {
    CONNECTION -> "connection"
    AUTHENTICATION -> "authentication"
    DATABASE -> "database"
    UNKNOWN -> "unknown"
}
```

編譯器使用此上下文型別資訊來解析正確的成員。此資訊包括但不限於：

* `when` 表達式的受詞
* 明確的回傳型別
* 宣告的變數型別
* 型別檢查 (`is`) 與型別轉換 (`as`)
* 已知的密封類別階層型別
* 宣告的參數型別

> 上下文相關解析不適用於函式、帶參數的屬性或具有接收器的擴充屬性。
>
{style="note"}

若要在您的專案中嘗試上下文相關解析，請在命令列中使用以下編譯器選項：

```bash
-Xcontext-sensitive-resolution
```

或將其加入 Gradle 建置檔案的 `compilerOptions {}` 區塊中：

```kotlin
// build.gradle.kts
kotlin {
    compilerOptions {
        freeCompilerArgs.add("-Xcontext-sensitive-resolution")
    }
}
```

我們計劃在未來的 Kotlin 版本中穩定並改進此特性，並歡迎您在問題追蹤器 [YouTrack](https://youtrack.jetbrains.com/issue/KT-16768/Context-sensitive-resolution) 提供回饋。

### 註解使用點目標特性預覽
<primary-label ref="experimental-general"/>

Kotlin 2.2.0 引入了幾項特性，讓使用註解使用點目標 (annotation use-site targets) 變得更加便利。

#### 屬性的 `@all` 中介目標
<primary-label ref="experimental-general"/>

Kotlin 允許您將註解附加到宣告的特定部分，這被稱為 [使用點目標](annotations.md#annotation-use-site-targets)。
然而，單獨為每個目標加上註解既複雜又容易出錯：

```kotlin
data class User(
    val username: String,

    @param:Email      // 建構函式參數
    @field:Email      // 支援欄位
    @get:Email        // Getter 方法
    @property:Email   // Kotlin 屬性參考
    val email: String,
) {
    @field:Email
    @get:Email
    @property:Email
    val secondaryEmail: String? = null
}
```

為了簡化這一點，Kotlin 為屬性引入了新的 `@all` 中介目標 (meta-target)。
此特性告訴編譯器將註解套用到屬性的所有相關部分。當您使用它時，
`@all` 會嘗試將註解套用到：

* **`param`**：建構函式參數，若在主建構函式中宣告。

* **`property`**：Kotlin 屬性本身。

* **`field`**：支援欄位，若存在。

* **`get`**：Getter 方法。

* **`setparam`**：Setter 方法的參數，若屬性定義為 `var`。

* **`RECORD_COMPONENT`**：若該類別為 `@JvmRecord`，則註解會套用到 [Java record 組件](#improved-support-for-annotating-jvm-records)。此行為模擬了 Java 處理 record 組件註解的方式。

編譯器僅將註解套用到給定屬性的目標。

在下方的範例中，`@Email` 註解被套用到每個屬性的所有相關目標：

```kotlin
data class User(
    val username: String,

    // 將 @Email 套用到 param、property、field、
    // get 以及 setparam (如果是 var)
    @all:Email val email: String,
) {
    // 將 @Email 套用到 property、field 與 get
    // (沒有 param，因為它不在建構函式中)
    @all:Email val secondaryEmail: String? = null
}
```

您可以在主建構函式內部或外部的任何屬性上使用 `@all` 中介目標。然而， 
您不能將 `@all` 中介目標與 [多個註解](https://kotlinlang.org/spec/syntax-and-grammar.html#grammar-rule-annotation) 同時使用。

這項新特性簡化了語法、確保了一致性，並改進了與 Java record 的互通性。

若要在您的專案中啟用 `@all` 中介目標，請在命令列中使用以下編譯器選項：

```Bash
-Xannotation-target-all
```

或將其加入 Gradle 建置檔案的 `compilerOptions {}` 區塊中：

```kotlin
// build.gradle.kts
kotlin {
    compilerOptions {
        freeCompilerArgs.add("-Xannotation-target-all")
    }
}
```

此特性處於預覽階段。請向我們的問題追蹤器 [YouTrack](https://kotl.in/issue) 回報任何問題。
有關 `@all` 中介目標的更多資訊，請參閱此 [KEEP](https://github.com/Kotlin/KEEP/blob/master/proposals/annotation-target-in-properties.md) 提案。

#### 使用點註解目標的新預設規則
<primary-label ref="experimental-general"/>

Kotlin 2.2.0 引入了將註解傳播到參數、欄位和屬性的新預設規則。 
以前註解預設僅套用到 `param`、`property` 或 `field` 其中之一，現在的預設值更符合對註解的預期。

若有多個適用的目標，將按以下方式選擇一個或多個：

* 若建構函式參數目標 (`param`) 適用，則使用它。
* 若屬性目標 (`property`) 適用，則使用它。
* 若欄位目標 (`field`) 適用而 `property` 不適用，則使用 `field`。

若有多個目標，且 `param`、`property` 或 `field` 皆不適用，則該註解會導致錯誤。

若要啟用此特性，請將其加入 Gradle 建置檔案的 `compilerOptions {}` 區塊中：

```kotlin
// build.gradle.kts
kotlin {
    compilerOptions {
        freeCompilerArgs.add("-Xannotation-default-target=param-property")
    }
}
```

或為編譯器使用命令列引數：

```Bash
-Xannotation-default-target=param-property
```

每當您想使用舊行為時，您可以：

* 在特定情況下，明確定義必要的目標，例如使用 `@param:Annotation` 代替 `@Annotation`。
* 對於整個專案，在您的 Gradle 建置檔案中使用此旗標：

    ```kotlin
    // build.gradle.kts
    kotlin {
        compilerOptions {
            freeCompilerArgs.add("-Xannotation-default-target=first-only")
        }
    }
    ```

此特性處於預覽階段。請向我們的問題追蹤器 [YouTrack](https://kotl.in/issue) 回報任何問題。
有關註解使用點目標新預設規則的更多資訊，請參閱此 [KEEP](https://github.com/Kotlin/KEEP/blob/master/proposals/annotation-target-in-properties.md) 提案。

### 支援巢狀型別別名
<primary-label ref="beta"/>

Kotlin 2.2.0 增加了在其他宣告內部定義型別別名的支援。

您可以在這段影片中找到此特性的概觀：

<video src="https://www.youtube.com/v/1W6d45IOwWk" title="Kotlin 2.2.0 中的巢狀型別別名"/>

以前，您只能在 Kotlin 檔案的頂層宣告 [型別別名](type-aliases.md)。這意味著
即使是內部或特定領域的型別別名也必須存在於使用它們的類別之外。

從 2.2.0 開始，您可以在其他宣告內部定義型別別名，只要它們不擷取外部類別的型別參數即可：

```kotlin
class Dijkstra {
    typealias VisitedNodes = Set<Node>

    private fun step(visited: VisitedNodes, ...) = ...
}
```

巢狀型別別名有一些額外的限制，例如不能提及型別參數。請查看 [文件](type-aliases.md#nested-type-aliases) 以獲取完整的規則集。

巢狀型別別名透過改進封裝、減少封裝層級的混亂並簡化內部實作，讓程式碼更簡潔、更易於維護。

#### 如何啟用巢狀型別別名

若要在您的專案中啟用巢狀型別別名，請在命令列中使用以下編譯器選項：

```bash
-Xnested-type-aliases
```

或將其加入 Gradle 建置檔案的 `compilerOptions {}` 區塊中：

```kotlin
// build.gradle.kts
kotlin {
    compilerOptions {
        freeCompilerArgs.add("-Xnested-type-aliases")
    }
}
```

#### 分享您的回饋

巢狀型別別名目前處於 [Beta](components-stability.md#stability-levels-explained) 階段。請向我們的問題追蹤器 [YouTrack](https://kotl.in/issue) 回報任何問題。如需有關此特性的更多資訊，請參閱此 [KEEP](https://github.com/Kotlin/KEEP/blob/master/proposals/nested-typealias.md) 提案。

### 穩定版特性：防護條件、非區域 `break` 與 `continue` 以及多美元符號插值

在 Kotlin 2.1.0 中，數項新的語言特性以預覽形式引入。
我們很高興地宣布，以下語言特性在此版本中已達到 [穩定版](components-stability.md#stability-levels-explained)：

* [具有受詞之 `when` 中的防護條件](control-flow.md#guard-conditions-in-when-expressions)
* [非區域 `break` 與 `continue`](inline-functions.md#break-and-continue)
* [多美元符號插值：改進了字串常值中美元符號](strings.md#multi-dollar-string-interpolation) 的處理方式

[查看 Kotlin 語言設計特性與提案的完整清單](kotlin-language-features-and-proposals.md)。

## Kotlin 編譯器：編譯器警告的統一管理
<primary-label ref="experimental-general"/>

Kotlin 2.2.0 引入了一個新的編譯器選項 `-Xwarning-level`。它旨在提供一種統一的方式來管理 Kotlin 專案中的編譯器警告。

以前，您只能套用模組範圍的通用規則，例如使用 `-nowarn` 停用所有警告、使用 `-Werror` 將所有警告轉為編譯錯誤，或使用 `-Wextra` 啟用額外的編譯器檢查。調整特定警告的唯一選項是 `-Xsuppress-warning` 選項。

透過新的解決方案，您可以以一致的方式覆蓋通用規則並排除特定的診斷資訊。

### 如何套用

新的編譯器選項具有以下語法：

```bash
-Xwarning-level=DIAGNOSTIC_NAME:(error|warning|disabled)
```

* `error`：將指定的警告提升為錯誤。
* `warning`：發出警告，且預設為啟用。
* `disabled`：在整個模組範圍內完全抑制指定的警告。

請記住，您只能使用新的編譯器選項來配置 *警告* 的嚴重等級。

### 使用案例

透過新的解決方案，您可以透過結合通用規則與特定規則，更好地微調專案中的警告報告。選擇您的使用案例：

#### 抑制警告

| 指令 | 描述 |
|---------------------------------------------------|--------------------------------------------------------|
| [`-nowarn`](compiler-reference.md#nowarn) | 在編譯期間抑制所有警告。 |
| `-Xwarning-level=DIAGNOSTIC_NAME:disabled` | 僅抑制指定的警告。 |
| `-nowarn -Xwarning-level=DIAGNOSTIC_NAME:warning` | 抑制除指定警告以外的所有警告。 |

#### 將警告提升為錯誤

| 指令 | 描述 |
|---------------------------------------------------|--------------------------------------------------------------|
| [`-Werror`](compiler-reference.md#werror) | 將所有警告提升為編譯錯誤。 |
| `-Xwarning-level=DIAGNOSTIC_NAME:error` | 僅將指定的警告提升為錯誤。 |
| `-Werror -Xwarning-level=DIAGNOSTIC_NAME:warning` | 將除指定警告以外的所有警告提升為錯誤。 |

#### 啟用額外的編譯器警告

| 指令 | 描述 |
|----------------------------------------------------|------------------------------------------------------------------------------------------------------|
| [`-Wextra`](compiler-reference.md#wextra) | 啟用所有額外的宣告、表達式與型別編譯器檢查，若條件成立則發出警告。 |
| `-Xwarning-level=DIAGNOSTIC_NAME:warning` | 僅啟用指定的額外編譯器檢查。 |
| `-Wextra -Xwarning-level=DIAGNOSTIC_NAME:disabled` | 啟用除指定檢查以外的所有額外檢查。 |

#### 警告清單

如果您有許多想要從通用規則中排除的警告，可以透過 [`@argfile`](compiler-reference.md#argfile) 將它們列在單獨的檔案中。

### 提供回饋

新的編譯器選項仍處於 [實驗性](components-stability.md#stability-levels-explained) 階段。請向我們的問題追蹤器 [YouTrack](https://kotl.in/issue) 回報任何問題。

## Kotlin/JVM

Kotlin 2.2.0 為 JVM 帶來了許多更新。編譯器現在支援 Java 24 位元組碼，並引入了介面函式之預設方法產生方式的變更。此版本還簡化了 Kotlin 元資料中註解的使用，改進了內嵌值類別 (inline value classes) 與 Java 的互通性，並包含對 JVM record 註解更好的支援。

### 介面函式的預設方法產生變更

從 Kotlin 2.2.0 開始，除非另有配置，否則在介面中宣告的函式將編譯為 JVM 預設方法 (default methods)。此變更會影響具有實作的 Kotlin 介面函式如何編譯為位元組碼。

此行為由新的穩定編譯器選項 `-jvm-default` 控制，取代了已棄用的 `-Xjvm-default` 選項。

您可以使用以下值來控制 `-jvm-default` 選項的行為：

* `enable` (預設值)：在介面中產生預設實作，並在子類別與 `DefaultImpls` 類別中包含橋接函式。使用此模式可保持與舊版本 Kotlin 的二進位相容性。
* `no-compatibility`：僅在介面中產生預設實作。此模式會跳過相容性橋接與 `DefaultImpls` 類別，適合新程式碼。
* `disable`：停用介面中的預設實作。僅產生橋接函式與 `DefaultImpls` 類別，與 Kotlin 2.2.0 之前的行為一致。

若要配置 `-jvm-default` 編譯器選項，請在您的 Gradle Kotlin DSL 中設定 `jvmDefault` 屬性：

```kotlin
// build.gradle.kts
kotlin {
    compilerOptions {
        jvmDefault = JvmDefaultMode.NO_COMPATIBILITY
    }
}
```

### 支援在 Kotlin 元資料中讀寫註解
<primary-label ref="experimental-general"/>

以前，您必須使用反射或位元組碼分析從編譯後的 JVM 類別檔案中讀取註解，並根據簽章手動將其與元資料項目配對。此過程非常容易出錯，尤其是對於多載函式。

現在，在 Kotlin 2.2.0 中，[](metadata-jvm.md) 引入了對讀取儲存在 Kotlin 元資料中註解的支援。

若要讓註解在您編譯檔案的元資料中可用，請加入以下編譯器選項：

```kotlin
-Xannotations-in-metadata
```

或者，將其加入 Gradle 建置檔案的 `compilerOptions {}` 區塊中：

```kotlin
// build.gradle.kts
kotlin {
    compilerOptions {
        freeCompilerArgs.add("-Xannotations-in-metadata")
    }
}
```

啟用此選項後，Kotlin 編譯器會將註解與 JVM 位元組碼一起寫入元資料中，使其可供 `kotlin-metadata-jvm` 程式庫存取。

該程式庫提供以下用於存取註解的 API：

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

這些 API 處於 [實驗性](components-stability.md#stability-levels-explained) 階段。
若要選擇使用，請使用 `@OptIn(ExperimentalAnnotationsInMetadata::class)` 註解。

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
    // [@Label(value = StringValue("Message class"))]
}
```

> 如果您在專案中使用 `kotlin-metadata-jvm` 程式庫，我們建議測試並更新您的程式碼以支援註解。
> 否則，當元資料中的註解在未來的 Kotlin 版本中變為 [預設啟用](https://youtrack.jetbrains.com/issue/KT-75736) 時，您的專案可能會產生無效或不完整的元資料。
>
> 如果您遇到任何問題，請在我們的 [問題追蹤器](https://youtrack.jetbrains.com/issue/KT-31857) 中回報。
>
{style="warning"}

### 改進與內嵌值類別的 Java 互通性
<primary-label ref="experimental-general"/>

Kotlin 2.2.0 引入了一個新的實驗性註解：[`@JvmExposeBoxed`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.jvm/-jvm-expose-boxed/)。此註解使得從 Java 使用 [內嵌值類別 (inline value classes)](inline-classes.md) 變得更加容易。

您可以在這段影片中找到此特性的概觀：

<video src="https://www.youtube.com/v/KSvq7jHr1lo" title="Kotlin 2.2.0 中為 Java 提供的公開內嵌值類別"/>

預設情況下，Kotlin 會將內嵌值類別編譯為使用 **未裝箱表示 (unboxed representations)**，這在效能上更好，但通常難以甚至無法從 Java 中使用。例如：

```kotlin
@JvmInline value class PositiveInt(val number: Int) {
    init { require(number >= 0) }
}
```

在這種情況下，因為該類別是未裝箱的，Java 沒有可呼叫的建構函式。Java 也無法觸發 `init` 區塊以確保 `number` 為正數。 

當您為類別加上 `@JvmExposeBoxed` 註解時，Kotlin 會產生一個 Java 可以直接呼叫的公共建構函式，並確保 `init` 區塊也會執行。

您可以在類別、建構函式或函式層級套用 `@JvmExposeBoxed` 註解，以實現對公開給 Java 內容的精細控制。

例如，在以下程式碼中，擴充函式 `.timesTwoBoxed()` **無法** 從 Java 存取：

```kotlin
@JvmInline
value class MyInt(val value: Int)

fun MyInt.timesTwoBoxed(): MyInt = MyInt(this.value * 2)
```

為了能夠建立 `MyInt` 類別的執行個體並從 Java 程式碼呼叫 `.timesTwoBoxed()` 函式，請將 `@JvmExposeBoxed` 註解同時加入類別與函式：

```kotlin
@JvmExposeBoxed
@JvmInline
value class MyInt(val value: Int)

@JvmExposeBoxed
fun MyInt.timesTwoBoxed(): MyInt = MyInt(this.value * 2)
```

有了這些註解，Kotlin 編譯器會為 `MyInt` 類別產生一個可供 Java 存取的建構函式。它還會為使用值類別裝箱形式的擴充函式產生一個多載。因此，以下 Java 程式碼可以成功執行：

```java
MyInt input = new MyInt(5);
MyInt output = ExampleKt.timesTwoBoxed(input);
```

如果您不想為要公開的內嵌值類別的每個部分加上註解，可以將註解套用到整個模組。若要將此行為套用到模組，請使用 `-Xjvm-expose-boxed` 選項進行編譯。使用此選項進行編譯的效果與模組中的每個宣告都具有 `@JvmExposeBoxed` 註解相同。

這項新註解不會改變 Kotlin 內部編譯或使用值類別的方式，所有現有的編譯程式碼保持有效。它只是增加了改進 Java 互通性的新功能。使用值類別的 Kotlin 程式碼效能不會受到影響。

對於想要公開成員函式之裝箱變體並接收裝箱回傳型別的程式庫作者來說，`@JvmExposeBoxed` 註解非常有用。它消除了在內嵌值類別（高效但僅限 Kotlin）與資料類別（Java 相容但始終裝箱）之間做選擇的需要。

有關 `@JvmExposedBoxed` 註解運作方式及其解決的問題的更詳細解釋，請參閱此 [KEEP](https://github.com/Kotlin/KEEP/blob/jvm-expose-boxed/proposals/jvm-expose-boxed.md) 提案。

### 改進對 JVM record 註解的支援

Kotlin 自 1.5.0 起就支援 [JVM record](jvm-records.md)。現在，Kotlin 2.2.0 改進了 Kotlin 處理 record 組件上註解的方式，特別是與 Java 的 [`RECORD_COMPONENT`](https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/lang/annotation/ElementType.html#RECORD_COMPONENT) 目標相關的部分。

首先，如果您想使用 `RECORD_COMPONENT` 作為註解目標，您需要手動為 Kotlin (`@Target`) 和 Java 加入註解。這是因為 Kotlin 的 `@Target` 註解不支援 `RECORD_COMPONENT`。例如：

```kotlin
@Target(AnnotationTarget.CLASS, AnnotationTarget.PROPERTY)
@java.lang.annotation.Target(ElementType.CLASS, ElementType.RECORD_COMPONENT)
annotation class exampleClass
```

手動維護這兩個清單容易出錯，因此 Kotlin 2.2.0 在 Kotlin 與 Java 目標不符時引入了編譯器警告。例如，如果您在 Java 目標清單中省略了 `ElementType.CLASS`，編譯器會報告：

```
Incompatible annotation targets: Java target 'CLASS' missing, corresponding to Kotlin targets 'CLASS'.
```

其次，在傳播 record 中的註解時，Kotlin 的行為與 Java 不同。在 Java 中，record 組件上的註解會自動套用到支援欄位、getter 與建構函式參數。Kotlin 預設不會這樣做，但您現在可以使用 [`@all:` 使用點目標](#all-meta-target-for-properties) 來模擬此行為。

例如：

```kotlin
@JvmRecord
data class Person(val name: String, @all:Positive val age: Int)
```

當您將 `@JvmRecord` 與 `@all:` 配合使用時，Kotlin 現在會：

* 將註解傳播到屬性、支援欄位、建構函式參數與 getter。
* 若該註解支援 Java 的 `RECORD_COMPONENT`，則也會將其套用到 record 組件。

## Kotlin/Native

從 2.2.0 開始，Kotlin/Native 使用 LLVM 19。此版本還帶來了幾項旨在追蹤與調整記憶體消耗的實驗性特性。

### 個別物件記憶體分配
<primary-label ref="experimental-opt-in"/>

Kotlin/Native 的 [記憶體分配器 (memory allocator)](https://github.com/JetBrains/kotlin/blob/master/kotlin-native/runtime/src/alloc/custom/README.md) 現在可以基於個別物件預留記憶體。在某些情況下，這可能幫助您滿足嚴格的記憶體限制或在應用程式啟動時減少記憶體消耗。

這項新特性旨在取代 `-Xallocator=std` 編譯器選項，後者會啟用系統記憶體分配器而非預設分配器。現在，您可以停用緩衝 (分配分頁) 而不需切換記憶體分配器。

該特性目前處於 [實驗性](components-stability.md#stability-levels-explained) 階段。
若要啟用它，請在您的 `gradle.properties` 檔案中設定以下選項：

```none
kotlin.native.binary.pagedAllocator=false
```

請向我們的問題追蹤器 [YouTrack](https://kotl.in/issue) 回報任何問題。

### 執行時支援 Latin-1 編碼字串
<primary-label ref="experimental-opt-in"/>

Kotlin 現在支援 Latin-1 編碼字串，類似於 [JVM](https://openjdk.org/jeps/254)。這應有助於縮減應用程式的二進位檔案大小並調整記憶體消耗。

預設情況下，Kotlin 中的字串使用 UTF-16 編碼儲存，每個字元由兩個位元組表示。在某些情況下，這會導致字串在二進位檔案中佔用的空間是原始碼的兩倍，並且從簡單的 ASCII 檔案讀取資料可能佔用磁碟儲存空間兩倍的記憶體。

相應地，[Latin-1 (ISO 8859-1)](https://en.wikipedia.org/wiki/ISO/IEC_8859-1) 編碼僅用一個位元組表示前 256 個 Unicode 字元中的每一個。啟用 Latin-1 支援後，只要所有字元都落在其範圍內，字串就會以 Latin-1 編碼儲存。否則，將使用預設的 UTF-16 編碼。

#### 如何啟用 Latin-1 支援

該特性目前處於 [實驗性](components-stability.md#stability-levels-explained) 階段。
若要啟用它，請在您的 `gradle.properties` 檔案中設定以下選項：

```none
kotlin.native.binary.latin1Strings=true
```
#### 已知問題

只要該特性處於實驗性階段，cinterop 擴充函式 [`String.pin`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlinx.cinterop/pin.html)、[`String.usePinned`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlinx.cinterop/use-pinned.html) 與 [`String.refTo`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlinx.cinterop/ref-to.html) 的效率就會降低。對它們的每次呼叫都可能觸發字串自動轉換為 UTF-16。

Kotlin 團隊非常感謝 Google 的同事，特別是 [Sonya Valchuk](https://github.com/pyos) 實作了這項特性。

有關 Kotlin 中記憶體消耗的更多資訊，請參閱 [文件](native-memory-manager.md#memory-consumption)。

### 改進 Apple 平台上的記憶體消耗追蹤

從 Kotlin 2.2.0 開始，由 Kotlin 程式碼分配的記憶體現在會加上標籤。這可以幫助您在 Apple 平台上偵錯記憶體問題。

在檢查應用程式的高記憶體使用量時，您現在可以識別由 Kotlin 程式碼預留了多少記憶體。Kotlin 的佔比會標有識別符，並可透過 Xcode Instruments 中的 VM Tracker 等工具進行追蹤。

此特性預設啟用，但僅在同時滿足以下 *所有* 條件時才在 Kotlin/Native 預設記憶體分配器中可用：

* **標籤已啟用**。記憶體應標有有效的識別符。Apple 建議使用 240 到 255 之間的數字；預設值為 246。

  如果您設定了 `kotlin.native.binary.mmapTag=0` Gradle 屬性，則標籤會被停用。

* **使用 mmap 分配**。分配器應使用 `mmap` 系統呼叫將檔案映射到記憶體中。

  如果您設定了 `kotlin.native.binary.disableMmap=true` Gradle 屬性，預設分配器將使用 `malloc` 代替 `mmap`。

* **分頁已啟用**。分配分頁 (緩衝) 應為啟用狀態。

  如果您設定了 [`kotlin.native.binary.pagedAllocator=false`](#per-object-memory-allocation) Gradle 屬性，記憶體將改為基於個別物件進行預留。

有關 Kotlin 中記憶體消耗的更多資訊，請參閱 [文件](native-memory-manager.md#memory-consumption)。

### LLVM 從 16 更新至 19

在 Kotlin 2.2.0 中，我們將 LLVM 從版本 16 更新至 19。
新版本包含效能改進、錯誤修正與安全性更新。

此更新不應影響您的程式碼，但如果您遇到任何問題，請向我們的 [問題追蹤器](http://kotl.in/issue) 回報。

### Windows 7 目標已棄用

從 Kotlin 2.2.0 開始，最低支援的 Windows 版本已從 Windows 7 提升至 Windows 10。由於 Microsoft 已於 2025 年 1 月結束對 Windows 7 的支援，我們也決定棄用此舊版目標。

如需更多資訊，請參閱 [](native-target-support.md)。

## Kotlin/Wasm

在此版本中，[Wasm 目標的建置基礎設施已與 JavaScript 目標分離](#build-infrastructure-for-wasm-target-separated-from-javascript-target)。此外，現在您可以[按專案或模組配置 Binaryen 工具](#per-project-binaryen-configuration)。

### Wasm 目標的建置基礎設施已與 JavaScript 目標分離

以前，`wasmJs` 目標與 `js` 目標共享相同的基礎設施。因此，這兩個目標都代管在同一個目錄 (`build/js`) 中，並使用相同的 NPM 任務與配置。

現在，`wasmJs` 目標擁有與 `js` 目標分離的獨立基礎設施。這使得 Wasm 任務與型別能與 JavaScript 的區分開來，進而實現獨立配置。

此外，Wasm 相關的專案檔案與 NPM 相依性現在儲存在單獨的 `build/wasm` 目錄中。

為 Wasm 引入了新的 NPM 相關任務，而現有的 JavaScript 任務現在僅供 JavaScript 專用：

| **Wasm 任務** | **JavaScript 任務** |
|------------------------|----------------------|
| `kotlinWasmNpmInstall` | `kotlinNpmInstall` |
| `wasmRootPackageJson` | `rootPackageJson` |

同樣地，也加入了新的 Wasm 專用宣告：

| **Wasm 宣告** | **JavaScript 宣告** |
|---------------------------|-----------------------------|
| `WasmNodeJsRootPlugin` | `NodeJsRootPlugin` |
| `WasmNodeJsPlugin` | `NodeJsPlugin` |
| `WasmYarnPlugin` | `YarnPlugin` |
| `WasmNodeJsRootExtension` | `NodeJsRootExtension` |
| `WasmNodeJsEnvSpec` | `NodeJsEnvSpec` |
| `WasmYarnRootEnvSpec` | `YarnRootEnvSpec` |

您現在可以獨立於 JavaScript 目標之外操作 Wasm 目標，這簡化了配置程序。

此變更預設啟用，不需額外設定。

### 個別專案 Binaryen 配置

在 Kotlin/Wasm 中用於 [優化生產環境組建](whatsnew20.md#optimized-production-builds-by-default-using-binaryen) 的 Binaryen 工具，以前是在根專案中配置一次。

現在，您可以按專案或模組配置 Binaryen 工具。此變更符合 Gradle 的最佳實務，並確保更好地支援 [專案隔離 (project isolation)](https://docs.gradle.org/current/userguide/isolated_projects.html) 等特性，進而提高複雜組建中的組建效能與可靠性。

此外，如有需要，您現在可以為不同的模組配置不同版本的 Binaryen。

此特性預設啟用。然而，如果您有 Binaryen 的自訂配置，現在需要按專案套用，而不僅是在根專案中。

## Kotlin/JS

此版本改進了 [`@JsPlainObject` 介面中的 `copy()` 函式](#fix-for-copy-in-jsplainobject-interfaces)、[帶有 `@JsModule` 註解之檔案中的型別別名](#support-for-type-aliases-in-files-with-jsmodule-annotation) 以及其他 Kotlin/JS 特性。

### 修正 `@JsPlainObject` 介面中的 `copy()`

Kotlin/JS 有一個名為 `js-plain-objects` 的實驗性外掛程式，它為帶有 `@JsPlainObject` 註解的介面引入了 `copy()` 函式。您可以使用 `copy()` 函式來操作物件。

然而，`copy()` 的初始實作與繼承不相容，這在 `@JsPlainObject` 介面擴充其他介面時造成了問題。

為了避免對純物件 (plain objects) 的限制，`copy()` 函式已從物件本身移至其伴隨物件 (companion object)：

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

此變更解決了繼承階層中的衝突並消除了歧義。
從 Kotlin 2.2.0 開始預設啟用。

### 支援在具有 `@JsModule` 註解的檔案中使用型別別名

以前，帶有 `@JsModule` 註解以從 JavaScript 模組匯入宣告的檔案被限制只能包含外部宣告。這意味著您不能在此類檔案中宣告 `typealias`。

從 Kotlin 2.2.0 開始，您可以在標記為 `@JsModule` 的檔案內部宣告型別別名：

```kotlin
@file:JsModule("somepackage")
package somepackage
typealias SomeClass = Any
```

此變更減少了 Kotlin/JS 互通性限制的一個面向，未來版本還計劃進行更多改進。

在具有 `@JsModule` 的檔案中支援型別別名是預設啟用的。

### 在多平台 `expect` 宣告中支援 `@JsExport`

在 Kotlin 多平台專案中使用 [`expect/actual` 機制](https://kotlinlang.org/docs/multiplatform/multiplatform-expect-actual.html) 時，以前無法在共通程式碼 (common code) 中為 `expect` 宣告使用 `@JsExport` 註解。

從此版本開始，您可以直接在 `expect` 宣告上套用 `@JsExport`：

```kotlin
// commonMain

// 以前會產生錯誤，現在可以正常運作 
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

您還必須在 JavaScript 原始碼集中為對應的 `actual` 實作加上 `@JsExport` 註解，且其必須僅使用可匯出的型別。

此修正允許在 `commonMain` 中定義的共用程式碼正確匯出至 JavaScript。您現在可以將多平台程式碼公開給 JavaScript 使用者，而不必使用手動解決方案。

此變更預設啟用。

### 能夠在 `Promise<Unit>` 型別中使用 `@JsExport`

以前，當您嘗試使用 `@JsExport` 註解匯出回傳 `Promise<Unit>` 型別的函式時，Kotlin 編譯器會產生錯誤。

雖然 `Promise<Int>` 等回傳型別可以正常運作，但使用 `Promise<Unit>` 會觸發「不可匯出型別」警告，即使它能正確映射到 TypeScript 中的 `Promise<void>`。

這項限制已被移除。現在，以下程式碼可以編譯而不會發生錯誤：

```kotlin
// 以前就能正常運作
@JsExport
fun fooInt(): Promise<Int> = GlobalScope.promise {
    delay(100)
    return@promise 42
}

// 以前會產生錯誤，現在可以正常運作
@JsExport
fun fooUnit(): Promise<Unit> = GlobalScope.promise {
    delay(100)
}
```

此變更移除了 Kotlin/JS 互通模型中不必要的限制。此修正預設啟用。

## Gradle

Kotlin 2.2.0 與 Gradle 7.6.3 至 8.14 完全相容。您也可以使用截至最新發佈的 Gradle 版本。但請注意，這樣做可能會導致棄用警告，且某些新的 Gradle 特性可能無法運作。

在此版本中，Kotlin Gradle 外掛程式對其診斷功能進行了多項改進。 
它還引入了 [二進位相容性驗證](#binary-compatibility-validation-included-in-kotlin-gradle-plugin) 的實驗性整合，使得程式庫開發變得更加容易。

### Kotlin Gradle 外掛程式中包含二進位相容性驗證
<primary-label ref="experimental-general"/>

為了更輕鬆地檢查程式庫版本之間的二進位相容性，我們正在嘗試將 [二進位相容性驗證器 (binary compatibility validator)](https://github.com/Kotlin/binary-compatibility-validator) 的功能移至 Kotlin Gradle 外掛程式 (KGP) 中。 
您可以在小專案中嘗試，但不建議在生產環境中使用。 

原有的 [二進位相容性驗證器](https://github.com/Kotlin/binary-compatibility-validator) 在此實驗階段仍會繼續維護。

Kotlin 程式庫可以使用兩種二進位格式之一：JVM 類別檔案或 `klib`。由於這些格式不相容，KGP 會分別處理它們。

若要啟用二進位相容性驗證特性集，請在您的 `build.gradle.kts` 檔案的 `kotlin{}` 區塊中加入以下內容：

```kotlin
// build.gradle.kts
kotlin {
    @OptIn(org.jetbrains.kotlin.gradle.dsl.abi.ExperimentalAbiValidation::class)
    abiValidation {
        // 使用 set() 函式以確保與舊版 Gradle 的相容性
        enabled.set(true)
    }
}
```

如果您的專案有多個想要檢查二進位相容性的模組，請在每個模組中分別配置該特性。每個模組可以有自己的自訂配置。

啟用後，執行 `checkLegacyAbi` Gradle 任務以檢查二進位相容性問題。您可以在 IntelliJ IDEA 中或從專案目錄的命令列執行該任務：

```kotlin
./gradlew checkLegacyAbi
```

此任務會從目前的程式碼產生一個應用程式二進位介面 (ABI) 傾印作為 UTF-8 文字檔案。然後該任務會將新的傾印與前一個版本的傾印進行比較。如果任務發現任何差異，會將其報告為錯誤。審查錯誤後，如果您認為變更可以接受，可以透過執行 `updateLegacyAbi` Gradle 任務來更新參考 ABI 傾印。

#### 過濾類別

此特性允許您在 ABI 傾印中過濾類別。您可以按名稱、部分名稱或標記它們的註解（或註解名稱的一部分）明確地包含或排除類別。

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

探索 [KGP API 參考](https://kotlinlang.org/api/kotlin-gradle-plugin/kotlin-gradle-plugin-api/org.jetbrains.kotlin.gradle.dsl.abi/) 以了解更多關於配置二進位相容性驗證器的資訊。

#### 多平台限制

在多平台專案中，如果您的主機不支援所有目標的交叉編譯，KGP 會嘗試透過檢查其他目標的 ABI 傾印來推斷不支援目標的 ABI 變更。這種方法有助於避免在您稍後切換到 **可以** 編譯所有目標的主機時出現錯誤的驗證失敗。

您可以變更此預設行為，讓 KGP 不為不支援的目標推斷 ABI 變更，方法是在您的 `build.gradle.kts` 檔案中加入以下內容：

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

然而，如果您的專案中有不支援的目標，執行 `checkLegacyAbi` 任務將會失敗，因為該任務無法建立 ABI 傾印。如果比起錯過由於推斷出的 ABI 變更而導致的不相容變更，您更傾向於讓檢查失敗，那麼這種行為可能是理想的。

### 支援 Kotlin Gradle 外掛程式的主控台豐富輸出

在 Kotlin 2.2.0 中，我們在 Gradle 組建過程中支援主控台的顏色與其他豐富輸出，使得閱讀與理解報告的診斷資訊變得更加容易。

豐富輸出在 Linux 與 macOS 的支援終端模擬器中可用，我們正致力於增加對 Windows 的支援。

![Gradle 主控台](gradle-console-rich-output.png){width=600}

此特性預設啟用，但如果您想覆蓋它，請將以下 Gradle 屬性加入您的 `gradle.properties` 檔案：

```
org.gradle.console=plain
```

有關此屬性及其選項的更多資訊，請參閱 Gradle 關於 [自訂日誌格式](https://docs.gradle.org/current/userguide/command_line_interface.html#sec:command_line_customizing_log_format) 的文件。

### 在 KGP 診斷中整合 Problems API

以前，Kotlin Gradle 外掛程式 (KGP) 僅能將診斷資訊（如警告與錯誤）作為純文字輸出回報到主控台或日誌。

從 2.2.0 開始，KGP 引入了一種額外的回報機制：它現在使用 [Gradle 的 Problems API](https://docs.gradle.org/current/kotlin-dsl/gradle/org.gradle.api.problems/index.html)，這是在組建過程中回報豐富、結構化問題資訊的標準化方式。

KGP 診斷資訊現在更易於閱讀，且在不同的介面（例如 Gradle CLI 與 IntelliJ IDEA）上顯示更加一致。

從 Gradle 8.6 或更新版本開始，此整合預設啟用。
由於該 API 仍在演進中，請使用最新的 Gradle 版本以受益於最新的改進。

### KGP 與 `--warning-mode` 的相容性

Kotlin Gradle 外掛程式 (KGP) 診斷使用固定的嚴重等級來報告問題，這意味著 Gradle 的 [`--warning-mode` 命令列選項](https://docs.gradle.org/current/userguide/command_line_interface.html#sec:command_line_warnings) 對 KGP 如何顯示錯誤沒有影響。

現在，KGP 診斷已與 `--warning-mode` 選項相容，提供了更大的靈活性。例如，
您可以將所有警告轉換為錯誤或完全停用警告。

透過此變更，KGP 診斷會根據所選的警告模式調整輸出：

* 當您設定 `--warning-mode=fail` 時，嚴重等級為 `Severity.Warning` 的診斷資訊現在會提升為 `Severity.Error`。
* 當您設定 `--warning-mode=none` 時，嚴重等級為 `Severity.Warning` 的診斷資訊將不會被記錄。

此行為從 2.2.0 開始預設啟用。

若要忽略 `--warning-mode` 選項，請將以下 Gradle 屬性加入您的 `gradle.properties` 檔案：

```
kotlin.internal.diagnostics.ignoreWarningMode=true
```

## 新的實驗性組建工具 API
<primary-label ref="experimental-general"/>

您可以將 Kotlin 與各種組建系統（例如 Gradle、Maven、Amper 等）搭配使用。然而，將 Kotlin 整合到每個系統中以支援完整的功能集（例如增量編譯以及與 Kotlin 編譯器外掛程式、守護進程和 Kotlin Multiplatform 的相容性）需要付出巨大的努力。

為了簡化此程序，Kotlin 2.2.0 引入了一個新的實驗性組建工具 API (BTA)。BTA 是一個通用 API，充當組建系統與 Kotlin 編譯器生態系統之間的抽象層。透過這種方法，每個組建系統僅需支援單一的 BTA 入口點。

目前，BTA 僅支援 Kotlin/JVM。JetBrains 的 Kotlin 團隊已經在 Kotlin Gradle 外掛程式 (KGP) 與 `kotlin-maven-plugin` 中使用它。您可以透過這些外掛程式嘗試 BTA，但該 API 本身尚未準備好供您自己在組建工具整合中通用的使用。如果您對 BTA 提案感興趣或想分享回饋，請參閱此 [KEEP](https://github.com/Kotlin/KEEP/issues/421) 提案。

若要在以下工具中嘗試 BTA：

* KGP：將以下屬性加入您的 `gradle.properties` 檔案：

```kotlin
kotlin.compiler.runViaBuildToolsApi=true
```   

* Maven：您不需要做任何事。它預設為啟用。

BTA 目前對 Maven 外掛程式沒有直接的好處，但它為更快地交付新功能奠定了堅實的基礎，例如 [支援 Kotlin 守護進程](https://youtrack.jetbrains.com/issue/KT-77587/Maven-Introduce-Kotlin-daemon-support-and-make-it-enabled-by-default) 以及 [增量編譯的穩定化](https://youtrack.jetbrains.com/issue/KT-77086/Stabilize-incremental-compilation-in-Maven)。

對於 KGP，使用 BTA 已經帶來了以下好處：

* [改進的「進程內 (in process)」編譯器執行策略](#improved-in-process-compiler-execution-strategy)
* [更靈活地從 Kotlin 配置不同的編譯器版本](#flexibility-to-configure-different-compiler-versions-from-kotlin)

### 改進的「進程內」編譯器執行策略

KGP 支援三種 [Kotlin 編譯器執行策略](gradle-compilation-and-caches.md#defining-kotlin-compiler-execution-strategy)。 
「進程內 (in process)」策略在 Gradle 守護進程進程內執行編譯器，以前不支援增量編譯。

現在，使用 BTA，「進程內」策略 **確實** 支援增量編譯。若要使用它，請將以下屬性加入您的 `gradle.properties` 檔案：

```kotlin
kotlin.compiler.execution.strategy=in-process
```

### 靈活地從 Kotlin 配置不同的編譯器版本

有時您可能想在程式碼中使用較新的 Kotlin 編譯器版本，同時讓 KGP 保持在較舊的版本上——例如，在處理組建指令碼棄用項時嘗試新的語言特性。或者您可能想更新 KGP 版本但保留較舊的 Kotlin 編譯器版本。

BTA 使這成為可能。以下是您可以在 `build.gradle.kts` 檔案中配置它的方式：

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

BTA 支援將 KGP 與 Kotlin 編譯器版本配置為前三個主要版本與後一個主要版本。因此在 KGP 2.2.0 中，支援 Kotlin 編譯器版本 2.1.x、2.0.x 與 1.9.25。 
KGP 2.2.0 也與未來的 Kotlin 編譯器版本 2.2.x 與 2.3.x 相容。

然而，請記住，將不同的編譯器版本與編譯器外掛程式一起使用可能會導致 Kotlin 編譯器異常。Kotlin 團隊計劃在未來的版本中解決這類問題。

請嘗試在這些外掛程式中使用 BTA，並在 [KGP](https://youtrack.jetbrains.com/issue/KT-56574) 與 [Maven 外掛程式](https://youtrack.jetbrains.com/issue/KT-73012) 的專屬 YouTrack 票證中向我們發送您的回饋。

## 標準程式庫

在 Kotlin 2.2.0 中，[`Base64` API](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.io.encoding/-base64/) 與 [`HexFormat` API](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.text/-hex-format/) 現已達到 [穩定版](components-stability.md#stability-levels-explained)。

### 穩定的 Base64 編碼與解碼

Kotlin 1.8.20 引入了 [對 Base64 編碼與解碼的實驗性支援](whatsnew1820.md#support-for-base64-encoding)。
在 Kotlin 2.2.0 中，[Base64 API](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.io.encoding/-base64/) 現已 [穩定](components-stability.md#stability-levels-explained)，且包含四種編碼方案，此版本新增了 `Base64.Pem`：

* [`Base64.Default`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.io.encoding/-base64/-default/) 使用標準的 [Base64 編碼方案](https://www.rfc-editor.org/rfc/rfc4648#section-4)。

  > `Base64.Default` 是 `Base64` 類別的伴隨物件。
  > 因此，您可以使用 `Base64.encode()` 與 `Base64.decode()` 呼叫其函式，而不用 `Base64.Default.encode()` 與 `Base64.Default.decode()`。
  >
  {style="tip"}

* [`Base64.UrlSafe`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.io.encoding/-base64/-default/-url-safe.html) 使用 [「URL 與檔名安全」](https://www.rfc-editor.org/rfc/rfc4648#section-5) 編碼方案。
* [`Base64.Mime`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.io.encoding/-base64/-default/-mime.html) 使用 [MIME](https://www.rfc-editor.org/rfc/rfc2045#section-6.8) 
  編碼方案，在編碼期間每 76 個字元插入一個行分隔符，並在解碼期間跳過非法字元。
* `Base64.Pem` 像 `Base64.Mime` 一樣編碼資料，但將行長度限制為 64 個字元。

您可以使用 Base64 API 將二進位資料編碼為 Base64 字串，並將其解碼回位元組。

範例如下：

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

在 JVM 上，使用 `.encodingWith()` 與 `.decodingWith()` 擴充函式配合輸入與輸出流來進行 Base64 編碼與解碼：

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

### 使用 `HexFormat` API 進行穩定的十六進位剖析與格式化

在 [Kotlin 1.9.0](whatsnew19.md#new-hexformat-class-to-format-and-parse-hexadecimals) 中引入的 [`HexFormat` API](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.text/-hex-format/) 現已達到 [穩定版](components-stability.md#stability-levels-explained)。
您可以使用它在數值與十六進位字串之間進行轉換。

例如：

```kotlin
fun main() {
    //sampleStart
    println(93.toHexString())
    //sampleEnd
}
```
{kotlin-runnable="true"}

如需更多資訊，請參閱 [用於格式化與剖析十六進位的新 HexFormat 類別](whatsnew19.md#new-hexformat-class-to-format-and-parse-hexadecimals)。

## Compose 編譯器

在此版本中，Compose 編譯器引入了對可組合函式參考 (composable function references) 的支援，並變更了數個特性旗標的預設值。

### 支援 `@Composable` 函式參考

Compose 編譯器從 Kotlin 2.2.0 版本開始支援可組合函式參考的宣告與使用：

```kotlin
val content: @Composable (String) -> Unit = ::Text

@Composable fun App() {
    content("My App")
}
```

可組合函式參考在執行時的行為與可組合 Lambda 物件略有不同。特別是， 
可組合 Lambda 透過擴充 `ComposableLambda` 類別允許對跳過行為進行更精細的控制。函式參考預期會實作 `KCallable` 介面，因此無法對其套用相同的優化。

### `PausableComposition` 特性旗標預設啟用

從 Kotlin 2.2.0 開始，`PausableComposition` 特性旗標預設啟用。此旗標調整了 Compose 編譯器對於可重新啟動函式 (restartable functions) 的輸出，允許執行時強制執行跳過行為，從而透過跳過每個函式來有效地暫停組合。這允許沉重的組合被拆分到不同的畫面 (frames) 之間，這將在未來的版本中用於預取 (prefetching)。

若要停用此特性旗標，請在您的 Gradle 配置中加入以下內容：

```kotlin
// build.gradle.kts
composeCompiler {
    featureFlag = setOf(ComposeFeatureFlag.PausableComposition.disabled())
}
```

### `OptimizeNonSkippingGroups` 特性旗標預設啟用

從 Kotlin 2.2.0 開始，`OptimizeNonSkippingGroups` 特性旗標預設啟用。這項優化透過移除為不可跳過的可組合函式產生的群組呼叫來提高執行時效能。 
這不應導致執行時出現任何可觀察到的行為變化。

如果您遇到任何問題，可以透過停用該特性旗標來驗證是否由該變更引起。 
請將任何問題回報至 [Jetpack Compose 問題追蹤器](https://issuetracker.google.com/issues/new?component=610764&template=1424126)。

若要停用 `OptimizeNonSkippingGroups` 旗標，請在您的 Gradle 配置中加入以下內容：

```kotlin
composeCompiler {
    featureFlag = setOf(ComposeFeatureFlag.OptimizeNonSkippingGroups.disabled())
}
```

### 已棄用的特性旗標

`StrongSkipping` 與 `IntrinsicRemember` 特性旗標現已棄用，並將在未來版本中移除。 
如果您遇到 any 問題需要您停用這些特性旗標，請向 [Jetpack Compose 問題追蹤器](https://issuetracker.google.com/issues/new?component=610764&template=1424126) 回報。

## 重大變更與棄用

本節強調值得注意的重要重大變更與棄用。請參閱我們的 [相容性指南](compatibility-guide-22.md)
以獲取此版本中所有重大變更與棄用的完整概觀。

* 從 Kotlin 2.2.0 開始，編譯器 [不再支援 `-language-version=1.6` 或 `-language-version=1.7`](compatibility-guide-22.md#drop-support-in-language-version-for-1-6-and-1-7)。
  雖然不再支援舊於 1.8 的語言特性集，但語言本身對於 Kotlin 1.0 仍保持完全向後相容。
* 對 Ant 建置系統的支援已棄用。Kotlin 對 Ant 的支援已經很長時間沒有積極開發了，且由於其使用者群相對較小，目前沒有進一步維護的計劃。
  我們計劃在 2.3.0 中移除 Ant 支援。
* Kotlin 2.2.0 將 Gradle 中 [`kotlinOptions{}` 區塊的棄用等級提升至錯誤](compatibility-guide-22.md#deprecate-kotlinoptions-dsl)。 
  請改用 `compilerOptions{}` 區塊。有關更新組建指令碼的指引，請參閱 [從 `kotlinOptions{}` 遷移至 `compilerOptions{}`](gradle-compiler-options.md#migrate-from-kotlinoptions-to-compileroptions)。
* Kotlin 指令碼編寫 (scripting) 仍是 Kotlin 生態系統的重要部分，但我們正專注於特定的使用案例（例如自訂指令碼編寫、`gradle.kts` 和 `main.kts` 指令碼）以提供更好的體驗。 
  若要了解更多資訊，請參閱我們更新後的 [部落格文章](https://blog.jetbrains.com/kotlin/2024/11/state-of-kotlin-scripting-2024/)。因此，Kotlin 2.2.0 棄用了對以下內容的支援：
  
  * REPL：若要繼續透過 `kotlinc` 使用 REPL，請透過 `-Xrepl` 編譯器選項選擇使用。
  * JSR-223：由於此 [JSR](https://jcp.org/en/jsr/detail?id=223) 處於 **已撤回 (Withdrawn)** 狀態，JSR-223 實作在語言版本 1.9 下仍可運作，但未來不會遷移至使用 K2 編譯器。
  * `KotlinScriptMojo` Maven 外掛程式：我們未見此外掛程式有足夠的推動力。如果您繼續使用它，將會看到編譯器警告。
* 
* 在 Kotlin 2.2.0 中，[`KotlinCompileTool`](https://kotlinlang.org/api/kotlin-gradle-plugin/kotlin-gradle-plugin-api/org.jetbrains.kotlin.gradle.tasks/-kotlin-compile-tool/#) 中的 [`setSource()`](https://kotlinlang.org/api/kotlin-gradle-plugin/kotlin-gradle-plugin-api/org.jetbrains.kotlin.gradle.tasks/-kotlin-compile-tool/set-source.html#) 函式現在 [會取代已配置的原始碼，而非加入其中](compatibility-guide-22.md#correct-setsource-function-in-kotlincompiletool-to-replace-sources)。
  如果您想在不取代現有原始碼的情況下新增原始碼，請使用 [`source()`](https://kotlinlang.org/api/kotlin-gradle-plugin/kotlin-gradle-plugin-api/org.jetbrains.kotlin.gradle.tasks/-kotlin-compile-tool/source.html#) 函式。
* `BaseKapt` 中 [`annotationProcessorOptionProviders`](https://kotlinlang.org/api/kotlin-gradle-plugin/kotlin-gradle-plugin-api/org.jetbrains.kotlin.gradle.tasks/-base-kapt/annotation-processor-option-providers.html#) 的型別已 [從 `MutableList<Any>` 變更為 `MutableList<CommandLineArgumentProvider>`](compatibility-guide-22.md#deprecate-basekapt-annotationprocessoroptionproviders-property)。如果您的程式碼目前將清單作為單一元素加入，請使用 `addAll()` 函式代替 `add()` 函式。
* 繼舊版 Kotlin/JS 後端使用的無效程式碼刪除 (DCE) 工具棄用之後， 
  與 DCE 相關的其餘 DSL 現已從 Kotlin Gradle 外掛程式中移除：
  * `org.jetbrains.kotlin.gradle.dsl.KotlinJsDce` 介面
  * `org.jetbrains.kotlin.gradle.targets.js.dsl.KotlinJsBrowserDsl.dceTask(body: Action<KotlinJsDce>)` 函式
  * `org.jetbrains.kotlin.gradle.dsl.KotlinJsDceCompilerToolOptions` 介面
  * `org.jetbrains.kotlin.gradle.dsl.KotlinJsDceOptions` 介面

  目前的 [JS IR 編譯器](js-ir-compiler.md) 開箱即支援 DCE，而 [`@JsExport`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.js/-js-export/) 註解允許指定在 DCE 期間要保留哪些 Kotlin 函式與類別。

* 已棄用的 `kotlin-android-extensions` 外掛程式在 [Kotlin 2.2.0 中已移除](compatibility-guide-22.md#deprecate-kotlin-android-extensions-plugin)。 
  請改用 `kotlin-parcelize` 外掛程式作為 `Parcelable` 實作產生器，並使用 Android Jetpack 的 [視圖繫結 (view binding)](https://developer.android.com/topic/libraries/view-binding) 代替合成視圖。
* 實驗性的 `kotlinArtifacts` API 在 [Kotlin 2.2.0 中已棄用](compatibility-guide-22.md#deprecate-kotlinartifacts-api)。 
  請使用 Kotlin Gradle 外掛程式中現有的 DSL 來 [建置最終的原生二進位檔案](https://kotlinlang.org/docs/multiplatform/multiplatform-build-native-binaries.html)。如果這不足以進行遷移，請在 [此 YouTrack 問題](https://youtrack.jetbrains.com/issue/KT-74953) 中留言。
* `KotlinCompilation.source` 於 Kotlin 1.9.0 中棄用，現已 [從 Kotlin Gradle 外掛程式中移除](compatibility-guide-22.md#deprecate-kotlincompilation-source-api)。
* 實驗性共同化 (commonization) 模式的參數在 [Kotlin 2.2.0 中已棄用](compatibility-guide-22.md#deprecate-commonization-parameters)。 
  請清除共同化快取以刪除無效的編譯產物。
* 已棄用的 `konanVersion` 屬性現已 [從 `CInteropProcess` 任務中移除](compatibility-guide-22.md#deprecate-konanversion-in-cinteropprocess)。 
  請改用 `CInteropProcess.kotlinNativeVersion`。
* 使用已棄用的 `destinationDir` 屬性現在 [會導致錯誤](compatibility-guide-22.md#deprecate-destinationdir-in-cinteropprocess)。 
  請改用 `CInteropProcess.destinationDirectory.set()`。

## 文件更新

此版本帶來了顯著的文件變更，包括將 Kotlin Multiplatform 文件遷移至 [KMP 門戶](https://kotlinlang.org/docs/multiplatform/get-started.html)。 

此外，我們建立了新的頁面與教學，並更新了現有的內容。 

### 新增與翻新的教學

* [Kotlin 中階導覽](kotlin-tour-welcome.md) – 提升您對 Kotlin 的理解。了解何時使用擴充函式、介面、類別等。
* [建置使用 Spring AI 的 Kotlin 應用程式](spring-ai-guide.md) – 了解如何使用 OpenAI 與向量資料庫建立能回答問題的 Kotlin 應用程式。
* [](jvm-create-project-with-spring-boot.md) – 了解如何使用 IntelliJ IDEA 的 **New Project** 精靈建立帶有 Gradle 的 Spring Boot 專案。
* [Kotlin 與 C 映射教學系列](mapping-primitive-data-types-from-c.md) – 了解不同型別與結構如何在 Kotlin 與 C 之間映射。
* [使用 C 互通與 libcurl 建立應用程式](native-app-with-c-and-libcurl.md) – 建立一個可以使用 libcurl C 程式庫原生執行的簡單 HTTP 用戶端。
* [建立您的 Kotlin Multiplatform 程式庫](https://kotlinlang.org/docs/multiplatform/create-kotlin-multiplatform-library.html) – 了解如何使用 IntelliJ IDEA 建立並發佈多平台程式庫。
* [使用 Ktor 與 Kotlin Multiplatform 建置全端應用程式](https://ktor.io/docs/full-stack-development-with-kotlin-multiplatform.html) – 此教學現在使用 IntelliJ IDEA 代替 Fleet，並搭配 Material 3 以及最新版本的 Ktor 與 Kotlin。
* [在您的 Compose Multiplatform 應用程式中管理本機資源環境](https://kotlinlang.org/docs/multiplatform/compose-resource-environment.html) – 了解如何管理應用程式的資源環境，例如應用程式內的主題與語言。

### 新增與翻新的頁面

* [Kotlin for AI 概觀](kotlin-ai-apps-development-overview.md) – 探索 Kotlin 用於建置 AI 驅動應用程式的能力。
* [Dokka 遷移指南](https://kotlinlang.org/docs/dokka-migration.html) – 了解如何遷移至 Dokka Gradle 外掛程式 v2 版本。
* [](metadata-jvm.md) – 探索關於讀取、修改與產生為 JVM 編譯之 Kotlin 類別元資料的指引。
* [CocoaPods 整合](https://kotlinlang.org/docs/multiplatform/multiplatform-cocoapods-overview.html) – 透過教學與範例專案了解如何設定環境、加入 Pod 相依性，或將 Kotlin 專案用作 CocoaPod 相依性。
* 支援 iOS 穩定版本的新 Compose Multiplatform 頁面：
    * [導覽](https://kotlinlang.org/docs/multiplatform/compose-navigation.html) 與 [深層連結](https://kotlinlang.org/docs/multiplatform/compose-navigation-deep-links.html) 等。
    * [在 Compose 中實作版面配置](https://kotlinlang.org/docs/multiplatform/compose-layout.html)。
    * [在地化字串](https://kotlinlang.org/docs/multiplatform/compose-localize-strings.html) 與其他 i18n 頁面，例如對 RTL 語言的支援。
* [Compose 熱重載 (Hot Reload)](https://kotlinlang.org/docs/multiplatform/compose-hot-reload.html) – 了解如何在您的桌面目標上使用 Compose 熱重載，以及如何將其加入現有專案。
* [Exposed 遷移](https://www.jetbrains.com/help/exposed/migrations.html) – 了解 Exposed 提供用於管理資料庫架構變更的工具。

## 如何更新至 Kotlin 2.2.0

Kotlin 外掛程式是以隨附外掛程式的形式發佈在 IntelliJ IDEA 與 Android Studio 中。

若要更新至新的 Kotlin 版本，請在您的建置指令碼中
將 [Kotlin 版本變更](releases.md#update-to-a-new-kotlin-version) 為 2.2.0。