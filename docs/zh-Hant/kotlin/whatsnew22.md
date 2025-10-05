[//]: # (title: Kotlin 2.2.0 有哪些新功能)

_[發佈日期：2025 年 6 月 23 日](releases.md#release-details)_

Kotlin 2.2.0 版本已發佈！以下是主要亮點：

*   **語言**：預覽版中新的語言功能，包括[上下文參數](#preview-of-context-parameters)。
    一些[以前的實驗性功能現已穩定](#stable-features-guard-conditions-non-local-break-and-continue-and-multi-dollar-interpolation)，
    例如守衛條件、非局部 `break` 和 `continue`，以及多美元字串插值。
*   **Kotlin 編譯器**：[統一管理編譯器警告](#kotlin-compiler-unified-management-of-compiler-warnings)。
*   **Kotlin/JVM**：[介面函數預設方法生成變更](#changes-to-default-method-generation-for-interface-functions)。
*   **Kotlin/Native**：[LLVM 19 以及追蹤和調整記憶體消耗的新功能](#kotlin-native)。
*   **Kotlin/Wasm**：[Wasm 目標分離](#build-infrastructure-for-wasm-target-separated-from-javascript-target)以及[按專案配置 Binaryen](#per-project-binaryen-configuration) 的能力。
*   **Kotlin/JS**：[修復 `@JsPlainObject` 介面生成的 `copy()` 方法](#fix-for-copy-in-jsplainobject-interfaces)。
*   **Gradle**：[Kotlin Gradle 插件中的二進位相容性驗證](#binary-compatibility-validation-included-in-kotlin-gradle-plugin)。
*   **標準函式庫**：[穩定的 Base64 和 HexFormat API](#stable-base64-encoding-and-decoding)。
*   **文件**：我們的[文件問卷調查已開放](https://surveys.jetbrains.com/s3/Kotlin-Docs-2025)，並且 [Kotlin 文件已進行顯著改進](#documentation-updates)。

您也可以觀看這段 Kotlin 語言演進團隊討論新功能並回答問題的影片：

<video src="https://www.youtube.com/watch?v=jne3923lWtw" title="What's new in Kotlin 2.2.0"/>

## IDE 支援

支援 2.2.0 的 Kotlin 插件已隨附於最新版本的 IntelliJ IDEA 和 Android Studio 中。
您無需更新 IDE 中的 Kotlin 插件。
您只需[將 Kotlin 版本](configure-build-for-eap.md#adjust-the-kotlin-version)在構建腳本中變更為 2.2.0。

有關詳細資訊，請參閱[更新到新版本](releases.md#update-to-a-new-kotlin-version)。

## 語言

此版本[將](#stable-features-guard-conditions-non-local-break-and-continue-and-multi-dollar-interpolation)守衛條件、
非局部 `break` 和 `continue`、
以及多美元字串插值提升為[穩定](components-stability.md#stability-levels-explained)版。
此外，還引入了[上下文參數](#preview-of-context-parameters)和[上下文相關解析](#preview-of-context-sensitive-resolution)等幾項功能的預覽版。

### 上下文參數預覽
<primary-label ref="experimental-general"/> 

上下文參數允許函數和屬性宣告在周圍上下文中隱式可用的依賴。

使用上下文參數，您無需手動傳遞服務或依賴等共享且在多個函數呼叫中很少變更的值。

上下文參數取代了舊版實驗性功能「上下文接收器 (context receivers)」。要從上下文接收器遷移到上下文參數，您可以使用 IntelliJ IDEA 中的輔助支援，如[部落格文章](https://blog.jetbrains.com/kotlin/2025/04/update-on-context-parameters/)中所述。

主要區別在於上下文參數不會作為接收器引入到函數主體中。因此，您需要使用上下文參數的名稱來存取其成員，這與上下文接收器不同，上下文接收器中的上下文是隱式可用的。

Kotlin 中的上下文參數透過簡化依賴注入、改進 DSL 設計和範圍操作，顯著改進了依賴管理。有關更多資訊，請參閱該功能的 [KEEP](https://github.com/Kotlin/KEEP/blob/context-parameters/proposals/context-parameters.md)。

#### 如何宣告上下文參數

您可以使用 `context` 關鍵字，後跟參數列表（形式為 `name: Type`），為屬性和函數宣告上下文參數。以下是依賴於 `UserService` 介面的範例：

```kotlin
// UserService 定義了上下文所需的依賴 
interface UserService {
    fun log(message: String)
    fun findUserById(id: Int): String
}

// 宣告一個帶有上下文參數的函數
context(users: UserService)
fun outputMessage(message: String) {
    // 使用上下文中的 log
    users.log("Log: $message")
}

// 宣告一個帶有上下文參數的屬性
context(users: UserService)
val firstUser: String
    // 使用上下文中的 findUserById    
    get() = users.findUserById(1)
```

您可以將 `_` 用作上下文參數名稱。在這種情況下，參數值可用於解析，但在區塊內部無法透過名稱存取：

```kotlin
// 使用 "_" 作為上下文參數名稱
context(_: UserService)
fun logWelcome() {
    // 從 UserService 找到適當的 log 函數
    outputMessage("Welcome!")
}
```

#### 如何啟用上下文參數

要在您的專案中啟用上下文參數，請在命令列中使用以下編譯器選項：

```Bash
-Xcontext-parameters
```

或者將其添加到您的 Gradle 構建檔案的 `compilerOptions {}` 區塊中：

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

#### 留下回饋

此功能計畫在未來的 Kotlin 版本中穩定並改進。
我們非常感謝您在我們的問題追蹤器 [YouTrack](https://youtrack.jetbrains.com/issue/KT-10468/Context-Parameters-expanding-extension-receivers-to-work-with-scopes) 上提供回饋。

### 上下文相關解析預覽
<primary-label ref="experimental-general"/> 

Kotlin 2.2.0 引入了上下文相關解析的預覽實作。

以前，即使可以從上下文中推斷出型別，您也必須寫出列舉項目或密封類別成員的完整名稱。
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

現在，透過上下文相關解析，您可以在已知預期型別的上下文中省略型別名稱：

```kotlin
enum class Problem {
    CONNECTION, AUTHENTICATION, DATABASE, UNKNOWN
}

// 根據 problem 的已知型別解析列舉項目
fun message(problem: Problem): String = when (problem) {
    CONNECTION -> "connection"
    AUTHENTICATION -> "authentication"
    DATABASE -> "database"
    UNKNOWN -> "unknown"
}
```

編譯器使用此上下文型別資訊來解析正確的成員。此資訊包括但不限於：

*   `when` 表達式的主體
*   顯式回傳型別
*   宣告的變數型別
*   型別檢查 (`is`) 和轉型 (`as`)
*   密封類別層次結構的已知型別
*   參數的宣告型別

> 上下文相關解析不適用於函數、帶參數的屬性或帶接收器的擴充屬性。
>
{style="note"}

要在您的專案中試用上下文相關解析，請在命令列中使用以下編譯器選項：

```bash
-Xcontext-sensitive-resolution
```

或者將其添加到您的 Gradle 構建檔案的 `compilerOptions {}` 區塊中：

```kotlin
// build.gradle.kts
kotlin {
    compilerOptions {
        freeCompilerArgs.add("-Xcontext-sensitive-resolution")
    }
}
```

我們計畫在未來的 Kotlin 版本中穩定並改進此功能，並且非常感謝您在我們的問題追蹤器 [YouTrack](https://youtrack.jetbrains.com/issue/KT-16768/Context-sensitive-resolution) 上提供回饋。

### 註解使用站點目標功能預覽
<primary-label ref="experimental-general"/>

Kotlin 2.2.0 引入了多項功能，使處理註解使用站點目標更加方便。

#### 屬性的 `@all` 後設目標
<primary-label ref="experimental-general"/>

Kotlin 允許您將註解附加到宣告的特定部分，稱為[使用站點目標 (use-site targets)](annotations.md#annotation-use-site-targets)。
然而，單獨註解每個目標既複雜又容易出錯：

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

為簡化此過程，Kotlin 引入了新的屬性 `@all` 後設目標。
此功能指示編譯器將註解應用於屬性的所有相關部分。當您使用它時，
`@all` 嘗試將註解應用於：

*   **`param`**：建構子參數，如果在主要建構子中宣告。

*   **`property`**：Kotlin 屬性本身。

*   **`field`**：支援欄位 (backing field)，如果存在。

*   **`get`**：getter 方法。

*   **`setparam`**：setter 方法的參數，如果屬性定義為 `var`。

*   **`RECORD_COMPONENT`**：如果類別是 `@JvmRecord`，則註解應用於 [Java 記錄組件](#improved-support-for-annotating-jvm-records)。此行為模仿 Java 處理記錄組件上註解的方式。

編譯器僅將註解應用於給定屬性的目標。

在以下範例中，`@Email` 註解應用於每個屬性的所有相關目標：

```kotlin
data class User(
    val username: String,

    // 將 @Email 應用於 param、property、field、
    // get 和 setparam (如果是 var)
    @all:Email val email: String,
) {
    // 將 @Email 應用於 property、field 和 get
    // (因為它不在建構子中，所以沒有 param)
    @all:Email val secondaryEmail: String? = null
}
```

您可以將 `@all` 後設目標用於任何屬性，無論是在主要建構子內部還是外部。但是，
您不能將 `@all` 後設目標用於[多個註解](https://kotlinlang.org/spec/syntax-and-grammar.html#grammar-rule-annotation)。

這項新功能簡化了語法、確保了一致性，並改進了與 Java 記錄的互通性。

要在您的專案中啟用 `@all` 後設目標，請在命令列中使用以下編譯器選項：

```Bash
-Xannotation-target-all
```

或者將其添加到您的 Gradle 構建檔案的 `compilerOptions {}` 區塊中：

```kotlin
// build.gradle.kts
kotlin {
    compilerOptions {
        freeCompilerArgs.add("-Xannotation-target-all")
    }
}
```

此功能處於預覽階段。請向我們的問題追蹤器 [YouTrack](https://kotl.in/issue) 報告任何問題。
有關 `@all` 後設目標的更多資訊，請閱讀此 [KEEP](https://github.com/Kotlin/KEEP/blob/master/proposals/annotation-target-in-properties.md) 提案。

#### 註解使用站點目標的新預設規則
<primary-label ref="experimental-general"/>

Kotlin 2.2.0 引入了新的預設規則，用於將註解傳播到參數、欄位和屬性。
以前，註解預設僅應用於 `param`、`property` 或 `field` 之一，現在預設值更符合註解的預期。

如果有多個適用目標，則選擇一個或多個如下：

*   如果建構子參數目標 (`param`) 適用，則使用它。
*   如果屬性目標 (`property`) 適用，則使用它。
*   如果欄位目標 (`field`) 適用而 `property` 不適用，則使用 `field`。

如果有多個目標，並且 `param`、`property` 或 `field` 都不適用，則註解會導致錯誤。

要啟用此功能，請將其添加到您的 Gradle 構建檔案的 `compilerOptions {}` 區塊中：

```kotlin
// build.gradle.kts
kotlin {
    compilerOptions {
        freeCompilerArgs.add("-Xannotation-default-target=param-property")
    }
}
```

或使用編譯器的命令列參數：

```Bash
-Xannotation-default-target=param-property
```

每當您想使用舊行為時，您可以：

*   在特定情況下，明確定義所需的目標，例如使用 `@param:Annotation` 而不是 `@Annotation`。
*   對於整個專案，在您的 Gradle 構建檔案中使用此標誌：

    ```kotlin
    // build.gradle.kts
    kotlin {
        compilerOptions {
            freeCompilerArgs.add("-Xannotation-default-target=first-only")
        }
    }
    ```

此功能處於預覽階段。請向我們的問題追蹤器 [YouTrack](https://kotl.in/issue) 報告任何問題。
有關註解使用站點目標的新預設規則的更多資訊，請閱讀此 [KEEP](https://github.com/Kotlin/KEEP/blob/master/proposals/annotation-target-in-properties.md) 提案。

### 支援巢狀型別別名
<primary-label ref="beta"/>

以前，您只能在 Kotlin 檔案的頂層宣告[型別別名](type-aliases.md)。這意味著即使是內部或特定領域的型別別名也必須位於使用它們的類別之外。

從 2.2.0 開始，您可以在其他宣告內部定義型別別名，只要它們不從其外部類別捕獲型別參數：

```kotlin
class Dijkstra {
    typealias VisitedNodes = Set<Node>

    private fun step(visited: VisitedNodes, ...) = ...
}
```

巢狀型別別名有一些額外的限制，例如不能提及型別參數。請查閱[文件](type-aliases.md#nested-type-aliases)以了解所有規則。

巢狀型別別名透過改進封裝、減少套件層級雜亂並簡化內部實作，實現更簡潔、更易維護的程式碼。

#### 如何啟用巢狀型別別名

要在您的專案中啟用巢狀型別別名，請在命令列中使用以下編譯器選項：

```bash
-Xnested-type-aliases
```

或者將其添加到您的 Gradle 構建檔案的 `compilerOptions {}` 區塊中：

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

### 穩定功能：守衛條件、非局部 `break` 和 `continue` 以及多美元字串插值

在 Kotlin 2.1.0 中，預覽版引入了幾項新的語言功能。
我們很高興地宣布，以下語言功能在此版本中現已[穩定](components-stability.md#stability-levels-explained)：

*   [帶主體的 `when` 表達式中的守衛條件](control-flow.md#guard-conditions-in-when-expressions)
*   [非局部 `break` 和 `continue`](inline-functions.md#break-and-continue)
*   [多美元字串插值：改進多美元字串插值的處理](strings.md#multi-dollar-string-interpolation)

[查看 Kotlin 語言設計功能和提案的完整列表](kotlin-language-features-and-proposals.md)。