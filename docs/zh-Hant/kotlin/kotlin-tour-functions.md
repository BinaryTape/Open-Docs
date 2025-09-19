[//]: # (title: 函式)

<no-index/>

<tldr>
    <p><img src="icon-1-done.svg" width="20" alt="First step" /> <a href="kotlin-tour-hello-world.md">Hello world</a><br />
        <img src="icon-2-done.svg" width="20" alt="Second step" /> <a href="kotlin-tour-basic-types.md">基本型別</a><br />
        <img src="icon-3-done.svg" width="20" alt="Third step" /> <a href="kotlin-tour-collections.md">集合</a><br />
        <img src="icon-4-done.svg" width="20" alt="Fourth step" /> <a href="kotlin-tour-control-flow.md">控制流程</a><br />
        <img src="icon-5.svg" width="20" alt="Fifth step" /> <strong>函式</strong><br />
        <img src="icon-6-todo.svg" width="20" alt="Sixth step" /> <a href="kotlin-tour-classes.md">類別</a><br />
        <img src="icon-7-todo.svg" width="20" alt="Final step" /> <a href="kotlin-tour-null-safety.md">空值安全</a></p>
</tldr>

您可以在 Kotlin 中使用 `fun` 關鍵字來宣告您自己的函式。

```kotlin
fun hello() {
    return println("Hello, world!")
}

fun main() {
    hello()
    // 哈囉，世界！
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-function-demo"}

在 Kotlin 中：

*   函式參數寫在圓括號 `()` 內。
*   每個參數都必須有型別，且多個參數之間必須用逗號 `,` 分隔。
*   回傳型別寫在函式的圓括號 `()` 之後，以冒號 `:` 分隔。
*   函式主體寫在花括號 `{}` 內。
*   使用 `return` 關鍵字來結束函式或從函式中回傳某個值。

> 如果函式沒有回傳任何有用的值，則可以省略回傳型別和 `return` 關鍵字。有關更多資訊，請參閱[沒有回傳值的函式](#functions-without-return)。
>
{style="note"}

在以下範例中：

*   `x` 和 `y` 是函式參數。
*   `x` 和 `y` 的型別是 `Int`。
*   函式的回傳型別是 `Int`。
*   當呼叫此函式時，它會回傳 `x` 和 `y` 的總和。

```kotlin
fun sum(x: Int, y: Int): Int {
    return x + y
}

fun main() {
    println(sum(1, 2))
    // 3
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-simple-function"}

> 我們在[程式碼慣例](coding-conventions.md#function-names)中建議函式名稱以小寫字母開頭，並使用駝峰式命名法 (camel case)，不使用底線。
>
{style="note"}

## 具名引數

為了讓程式碼更簡潔，當呼叫函式時，您不必包含參數名稱。然而，包含參數名稱確實能讓您的程式碼更容易閱讀。這稱為使用**具名引數**。如果您包含參數名稱，則可以以任何順序撰寫參數。

> 在以下範例中，[字串模板](strings.md#string-templates) (`# 角色與任務

    你是一位專業的 AI 翻譯助手，負責專門將 **Github 中 Kotlin 相關的** 英文技術文件精準翻譯為台灣的 繁体中文。你的目標是產出高品質、技術準確、且符合目標語言閱讀習慣的譯文，主要面向 **開發者受眾**。請嚴格遵循以下指導原則和要求：

    ## 一、翻譯風格與品質要求

    1. **忠實原文與流暢表達**

    * 在確保技術準確性的前提下，譯文應自然流暢，符合 繁体中文 的語言習慣和網路技術社群的表達方式。
    * 妥善處理原文的語序和句子結構，避免生硬直譯或造成閱讀障礙。
    * 保持原文的語氣（例如：正式、非正式、教學性）。

    2. **術語與優先級規則（重要）**

    * **優先級次序：** 術語表（Glossary） > 文內慣例 > 一般語言習慣。
    * **衝突裁決：** 當「專有名詞不譯」與「常規含義可譯」衝突時，以術語表 **適用上下文** 說明裁決。
    * **不翻譯術語的形態：** 列入「**不翻譯術語**」的詞一律保持 **英文原形與大小寫**，即使原文為複數或時態變化也要還原為詞典形（如 *futures* → **future**）。
    * **翻譯術語：** 按術語表「翻譯術語」指定譯法執行。若存在「不要譯作 …」的禁用譯法，嚴禁使用。
    * **括號稱謂統一：** 使用「圓括號 / 方括號 / 花括號」，不得使用「小/中/大括號」。

    3. **新／模糊術語處理**

    * 對於術語表中未包含、參考翻譯亦無先例的專有名詞或技術術語：

    * 若你選擇翻譯，**首次出現**可在中文後以括號附註英文原文（可選），如：`譯文 (English Term)`。
         * 若不確定或保留英文更清晰，**直接保留英文原文**；必要時在譯文處標註 **[待確認]**。
    
    4. **風格統一（補充）**
    
       * 程式碼、API 名稱、類別名、方法名、關鍵字、套件名稱等 **一律保持英文與大小寫**，不加空格。
       * 標點遵循中文習慣；數值與單位之間保留半形空格（如 `10 MB`）。
    
    ## 二、技術格式要求
    
    1.  **Markdown 格式：**
        * 完整保留原文中的所有 Markdown 語法和格式，包括但不限於：標題 (headers)、清單 (lists)、粗體 (bold)、斜體 (italics)、刪除線 (strikethrough)、引文區塊 (blockquotes)、分隔線 (horizontal rules)、Admonition (:::) 等。
    
    2.  **程式碼處理：**
        * 程式碼區塊 (以 ` ``` ` 包裹) 和行內程式碼 (以 ` `` ` 包裹) 中的內容（包括程式碼本身、變數名、函式名、類別名、參數名等）**均不得翻譯**，必須保持英文原文，依上下文判斷是否需要翻譯註解。
    
    3.  **連結與圖片：**
        * 原文中的所有連結 (URLs) 和圖片引用路徑 (image paths) 必須保持不變。
    
    4.  **HTML 標籤：**
        * 如果原文 Markdown 中內嵌了 HTML 標籤，這些標籤及其屬性也應保持不變。
        
    ## 三、YAML Frontmatter 與特殊註解處理要求
    
    1.  **格式保持：**
        * 文件開頭由兩個 '---' 包圍的 YAML Frontmatter 部分的格式必須嚴格保持不變。
        * 保持所有欄位名稱、冒號、引號等格式符號不變。
        
    2.  **欄位翻譯：**
        * 僅翻譯 'title'、'description' 等欄位的內容值。
        * 如欄位值包含引號，請確保在翻譯後正確保留引號格式。
        * 不要翻譯欄位名、設定參數名或特殊識別符。
        
    3.  **特殊註解處理：**
        * 翻譯形如 `[//]: # (title: 標題內容)` 的特殊註解中的標題內容。
        * 保持註解格式不變，只翻譯冒號後的實際內容。
        * 例如: `[//]: # (title: Kotlin/Native as an Apple framework – tutorial)` 應翻譯為 `[//]: # (title: Kotlin/Native 作為 Apple 框架 – 教學)`。

    ## 四、輸出要求
    
    1.  **純淨輸出：** 僅輸出翻譯後的 Markdown 內容。不要包含任何額外的解釋、說明、道歉、或自我評論（例如，「這是一個不錯的翻譯…」或「請注意…」）。
    2.  **結構一致：** 保持與原文相同的文件結構和分段。
    
    ---
    
    ## 五、資源
    
    ### 1. 術語表 (Glossary)
    * 以下術語必須使用指定翻譯：
    无相关术语
    
    ### 2. 參考翻譯 (Translation References)
    * 請參考以下已翻譯的文件片段，以保持風格和術語的一致性：
     ) 用於存取參數值，將它們轉換為 `String` 型別，然後串聯成字串以供印出。
>
{style="tip"}

```kotlin
fun printMessageWithPrefix(message: String, prefix: String) {
    println("[$prefix] $message")
}

fun main() {
    // 使用具名引數並交換參數順序
    printMessageWithPrefix(prefix = "Log", message = "Hello")
    // [Log] Hello
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-named-arguments-function"}

## 預設參數值

您可以為函式參數定義預設值。呼叫函式時，任何具有預設值的參數都可以省略。若要宣告預設值，請在型別之後使用指派運算子 `=`：

```kotlin
fun printMessageWithPrefix(message: String, prefix: String = "Info") {
    println("[$prefix] $message")
}

fun main() {
    // 呼叫帶有兩個參數的函式
    printMessageWithPrefix("Hello", "Log") 
    // [Log] Hello
    
    // 僅呼叫帶有訊息參數的函式
    printMessageWithPrefix("Hello")        
    // [Info] Hello
    
    printMessageWithPrefix(prefix = "Log", message = "Hello")
    // [Log] Hello
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-default-param-function"}

> 您可以跳過具有預設值的特定參數，而不是全部省略。然而，在第一個跳過的參數之後，您必須具名所有後續參數。
>
{style="note"}

## 沒有回傳值的函式

如果您的函式沒有回傳任何有用的值，則其回傳型別是 `Unit`。`Unit` 是一種只有一個值 — `Unit` — 的型別。您不必在函式主體中明確宣告 `Unit` 被回傳。這表示您不必使用 `return` 關鍵字或宣告回傳型別：

```kotlin
fun printMessage(message: String) {
    println(message)
    // `return Unit` 或 `return` 是可選的
}

fun main() {
    printMessage("Hello")
    // Hello
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-unit-function"}

## 單一表達式函式

為了讓您的程式碼更簡潔，您可以使用單一表達式函式。例如，`sum()` 函式可以縮寫為：

```kotlin
fun sum(x: Int, y: Int): Int {
    return x + y
}

fun main() {
    println(sum(1, 2))
    // 3
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-simple-function-before"}

您可以移除花括號 `{}`，並使用指派運算子 `=` 宣告函式主體。當您使用指派運算子 `=` 時，Kotlin 會使用型別推斷，因此您也可以省略回傳型別。此時 `sum()` 函式變成一行：

```kotlin
fun sum(x: Int, y: Int) = x + y

fun main() {
    println(sum(1, 2))
    // 3
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-simple-function-after"}

然而，如果您希望您的程式碼能被其他開發者快速理解，即使使用指派運算子 `=`，明確定義回傳型別仍然是個好主意。

> 如果您使用 `{}` 花括號來宣告函式主體，您必須宣告回傳型別，除非它是 `Unit` 型別。
>
{style="note"}

## 函式中的提前回傳

若要停止函式中的程式碼在某個點之後繼續處理，請使用 `return` 關鍵字。此範例使用 `if` 語句，如果在條件表達式為真時，提前從函式中回傳：

```kotlin
// 已註冊的使用者名稱列表
val registeredUsernames = mutableListOf("john_doe", "jane_smith")

// 已註冊的電子郵件列表
val registeredEmails = mutableListOf("john@example.com", "jane@example.com")

fun registerUser(username: String, email: String): String {
    // 如果使用者名稱已被佔用，則提前回傳
    if (username in registeredUsernames) {
        return "Username already taken. Please choose a different username."
    }

    // 如果電子郵件已被註冊，則提前回傳
    if (email in registeredEmails) {
        return "Email already registered. Please use a different email."
    }

    // 如果使用者名稱和電子郵件尚未被佔用，則繼續註冊
    registeredUsernames.add(username)
    registeredEmails.add(email)

    return "User registered successfully: $username"
}

fun main() {
    println(registerUser("john_doe", "newjohn@example.com"))
    // 使用者名稱已被佔用。請選擇不同的使用者名稱。
    println(registerUser("new_user", "newuser@example.com"))
    // 使用者註冊成功：new_user
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-function-early-return"}

## 函式練習

### 練習 1 {initial-collapse-state="collapsed" collapsible="true" id="functions-exercise-1"}

編寫一個名為 `circleArea` 的函式，該函式以整數格式的圓半徑作為參數，並輸出該圓的面積。

> 在此練習中，您會匯入一個套件，以便透過 `PI` 存取圓周率的值。有關匯入套件的更多資訊，請參閱[套件和匯入](packages.md)。
>
{style="tip"}

|---|---|
```kotlin
import kotlin.math.PI

// 在此編寫您的程式碼

fun main() {
    println(circleArea(2))
}
```
{validate="false" kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-functions-exercise-1"}

|---|---|
```kotlin
import kotlin.math.PI

fun circleArea(radius: Int): Double {
    return PI * radius * radius
}

fun main() {
    println(circleArea(2)) // 12.566370614359172
}
```
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="範例解答" id="kotlin-tour-functions-solution-1"}

### 練習 2 {initial-collapse-state="collapsed" collapsible="true" id="functions-exercise-2"}

將上一個練習中的 `circleArea` 函式改寫為單一表達式函式。

|---|---|
```kotlin
import kotlin.math.PI

// 在此編寫您的程式碼

fun main() {
    println(circleArea(2))
}
```
{validate="false" kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-functions-exercise-2"}

|---|---|
```kotlin
import kotlin.math.PI

fun circleArea(radius: Int): Double = PI * radius * radius

fun main() {
    println(circleArea(2)) // 12.566370614359172
}
```
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="範例解答" id="kotlin-tour-functions-solution-2"}

### 練習 3 {initial-collapse-state="collapsed" collapsible="true" id="functions-exercise-3"}

您有一個函式，它將以小時、分鐘和秒為單位的時間間隔轉換為秒。在大多數情況下，您只需要傳遞一個或兩個函式參數，其餘參數都等於 0。請使用預設參數值和具名引數來改進此函式以及呼叫它的程式碼，以便程式碼更容易閱讀。

|---|---|
```kotlin
fun intervalInSeconds(hours: Int, minutes: Int, seconds: Int) =
    ((hours * 60) + minutes) * 60 + seconds

fun main() {
    println(intervalInSeconds(1, 20, 15))
    println(intervalInSeconds(0, 1, 25))
    println(intervalInSeconds(2, 0, 0))
    println(intervalInSeconds(0, 10, 0))
    println(intervalInSeconds(1, 0, 1))
}
```
{validate="false" kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-functions-exercise-3"}

|---|---|
```kotlin
fun intervalInSeconds(hours: Int = 0, minutes: Int = 0, seconds: Int = 0) =
    ((hours * 60) + minutes) * 60 + seconds

fun main() {
    println(intervalInSeconds(1, 20, 15))
    println(intervalInSeconds(minutes = 1, seconds = 25))
    println(intervalInSeconds(hours = 2))
    println(intervalInSeconds(minutes = 10))
    println(intervalInSeconds(hours = 1, seconds = 1))
}
```
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="範例解答" id="kotlin-tour-functions-solution-3"}

## Lambda 表達式

Kotlin 允許您使用 lambda 表達式來編寫更簡潔的函式程式碼。

例如，以下 `uppercaseString()` 函式：

```kotlin
fun uppercaseString(text: String): String {
    return text.uppercase()
}
fun main() {
    println(uppercaseString("hello"))
    // HELLO
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-lambda-function-before"}

也可以寫成 lambda 表達式：

```kotlin
fun main() {
    val upperCaseString = { text: String -> text.uppercase() }
    println(upperCaseString("hello"))
    // HELLO
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-lambda-variable"}

Lambda 表達式乍看之下可能難以理解，因此讓我們來分解它。Lambda 表達式寫在花括號 `{}` 內。

在 lambda 表達式內，您會寫入：

*   參數，後接 `->`。
*   `->` 之後是函式主體。

在前面的範例中：

*   `text` 是一個函式參數。
*   `text` 的型別是 `String`。
*   函式回傳在 `text` 上呼叫的 [`.uppercase()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/uppercase.html) 函式的結果。
*   整個 lambda 表達式使用指派運算子 `=` 指派給 `upperCaseString` 變數。
*   透過將 `upperCaseString` 變數像函式一樣使用，並將字串 `"hello"` 作為參數來呼叫此 lambda 表達式。
*   `println()` 函式會印出結果。

> 如果您宣告一個沒有參數的 lambda，則無需使用 `->`。例如：
> ```kotlin
> { println("Log message") }
> ```
>
{style="note"}

Lambda 表達式可以用多種方式使用。您可以：

*   [將 lambda 表達式作為參數傳遞給另一個函式](#pass-to-another-function)
*   [從函式中回傳 lambda 表達式](#return-from-a-function)
*   [獨立呼叫 lambda 表達式](#invoke-separately)

### 傳遞給另一個函式

將 lambda 表達式傳遞給函式的一個很好的範例，是在集合上使用 [`.filter()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/filter.html) 函式：

```kotlin
fun main() {
    //sampleStart
    val numbers = listOf(1, -2, 3, -4, 5, -6)
    
    val positives = numbers.filter ({ x -> x > 0 })
    
    val isNegative = { x: Int -> x < 0 }
    val negatives = numbers.filter(isNegative)
    
    println(positives)
    // [1, 3, 5]
    println(negatives)
    // [-2, -4, -6]
    //sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-lambda-filter"}

`.filter()` 函式接受一個 lambda 表達式作為謂詞，並將其應用於列表的每個元素。只有當謂詞回傳 `true` 時，函式才會保留該元素：

*   `{ x -> x > 0 }` 如果元素為正，則回傳 `true`。
*   `{ x -> x < 0 }` 如果元素為負，則回傳 `true`。

此範例示範了兩種將 lambda 表達式傳遞給函式的方式：

*   對於正數，此範例直接在 `.filter()` 函式中加入 lambda 表達式。
*   對於負數，此範例將 lambda 表達式指派給 `isNegative` 變數。然後 `isNegative` 變數被用作 `.filter()` 函式中的函式參數。在這種情況下，您必須在 lambda 表達式中指定函式參數 (`x`) 的型別。

> 如果 lambda 表達式是唯一的函式參數，您可以省略函式圓括號 `()`：
>
> ```kotlin
> val positives = numbers.filter { x -> x > 0 }
> ```
>
> 這是[尾隨 lambda](#trailing-lambdas) 的範例，本章末尾將詳細討論。
>
{style="note"}

另一個很好的範例是使用 [`.map()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/map.html) 函式來轉換集合中的項目：

```kotlin
fun main() {
    //sampleStart
    val numbers = listOf(1, -2, 3, -4, 5, -6)
    val doubled = numbers.map { x -> x * 2 }
    
    val isTripled = { x: Int -> x * 3 }
    val tripled = numbers.map(isTripled)
    
    println(doubled)
    // [2, -4, 6, -8, 10, -12]
    println(tripled)
    // [3, -6, 9, -12, 15, -18]
    //sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-lambda-map"}

`.map()` 函式接受一個 lambda 表達式作為轉換函式：

*   `{ x -> x * 2 }` 接受列表的每個元素並回傳該元素乘以 2 的結果。
*   `{ x -> x * 3 }` 接受列表的每個元素並回傳該元素乘以 3 的結果。

### 函式型別

在您可以從函式中回傳 lambda 表達式之前，您首先需要了解**函式型別**。

您已經了解了基本型別，但函式本身也有型別。Kotlin 的型別推斷可以從參數型別推斷出函式的型別。但有時您可能需要明確指定函式型別。編譯器需要函式型別，以便它知道該函式允許或不允許什麼。

函式型別的語法包含：

*   每個參數的型別寫在圓括號 `()` 內，並以逗號 `,` 分隔。
*   回傳型別寫在 `->` 之後。

例如：`(String) -> String` 或 `(Int, Int) -> Int`。

如果為 `upperCaseString()` 定義了函式型別，則 lambda 表達式會像這樣：

```kotlin
val upperCaseString: (String) -> String = { text -> text.uppercase() }

fun main() {
    println(upperCaseString("hello"))
    // HELLO
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-lambda-function-type"}

如果您的 lambda 表達式沒有參數，則圓括號 `()` 留空。例如：`() -> Unit`

> 您必須在 lambda 表達式中或作為函式型別來宣告參數和回傳型別。否則，編譯器將無法知道您的 lambda 表達式是什麼型別。
>
> 例如，以下程式碼將不起作用：
>
> `val upperCaseString = { str -> str.uppercase() }`
>
{style="note"}

### 從函式中回傳

Lambda 表達式可以從函式中回傳。為了讓編譯器了解回傳的 lambda 表達式是什麼型別，您必須宣告函式型別。

在以下範例中，`toSeconds()` 函式的函式型別為 `(Int) -> Int`，因為它總是回傳一個 lambda 表達式，該表達式接受 `Int` 型別的參數並回傳一個 `Int` 值。

此範例使用 `when` 表達式來判斷呼叫 `toSeconds()` 時回傳哪個 lambda 表達式：

```kotlin
fun toSeconds(time: String): (Int) -> Int = when (time) {
    "hour" -> { value -> value * 60 * 60 }
    "minute" -> { value -> value * 60 }
    "second" -> { value -> value }
    else -> { value -> value }
}

fun main() {
    val timesInMinutes = listOf(2, 10, 15, 1)
    val min2sec = toSeconds("minute")
    val totalTimeInSeconds = timesInMinutes.map(min2sec).sum()
    println("Total time is $totalTimeInSeconds secs")
    // 總時間為 1680 秒
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-lambda-return-from-function"}

### 獨立呼叫

Lambda 表達式可以透過在花括號 `{}` 後面加上圓括號 `()`，並將任何參數包含在圓括號內來獨立呼叫：

```kotlin
fun main() {
    //sampleStart
    println({ text: String -> text.uppercase() }("hello"))
    // HELLO
    //sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-lambda-standalone"}

### 尾隨 lambda

如您所見，如果 lambda 表達式是唯一的函式參數，您可以省略函式圓括號 `()`。
如果 lambda 表達式作為函式的最後一個參數傳遞，則該表達式可以寫在函式圓括號 `()` 的外面。在這兩種情況下，這種語法都稱為**尾隨 lambda**。

例如，[`.fold()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.sequences/fold.html) 函式接受一個初始值和一個操作：

```kotlin
fun main() {
    //sampleStart
    // 初始值為零。
    // 該操作將初始值與列表中的每個項目累計求和。
    println(listOf(1, 2, 3).fold(0, { x, item -> x + item })) // 6

    // 或者，以尾隨 lambda 的形式
    println(listOf(1, 2, 3).fold(0) { x, item -> x + item })  // 6
    //sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-trailing-lambda"}

有關 lambda 表達式的更多資訊，請參閱[Lambda 表達式和匿名函式](lambdas.md#lambda-expressions-and-anonymous-functions)。

我們學習之旅的下一步是了解 Kotlin 中的[類別](kotlin-tour-classes.md)。

## Lambda 表達式練習

### 練習 1 {initial-collapse-state="collapsed" collapsible="true" id="lambdas-exercise-1"}

您有一個網頁服務支援的動作列表、所有請求的共同前綴，以及特定資源的 ID。若要透過 ID 為 5 的資源請求動作 `title`，您需要建立以下 URL：`https://example.com/book-info/5/title`。請使用 lambda 表達式從動作列表中建立 URL 列表。

|---|---|
```kotlin
fun main() {
    val actions = listOf("title", "year", "author")
    val prefix = "https://example.com/book-info"
    val id = 5
    val urls = // 在此編寫您的程式碼
    println(urls)
}
```
{validate="false" kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-lambdas-exercise-1"}

|---|---|
```kotlin
fun main() {
    val actions = listOf("title", "year", "author")
    val prefix = "https://example.com/book-info"
    val id = 5
    val urls = actions.map { action -> "$prefix/$id/$action" }
    println(urls)
}
```
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="範例解答" id="kotlin-tour-lambdas-solution-1"}

### 練習 2 {initial-collapse-state="collapsed" collapsible="true" id="lambdas-exercise-2"}

編寫一個函式，它接受一個 `Int` 值和一個動作（型別為 `() -> Unit` 的函式），然後重複執行該動作指定的次數。然後使用此函式印出「Hello」5 次。

|---|---|
```kotlin
fun repeatN(n: Int, action: () -> Unit) {
    // 在此編寫您的程式碼
}

fun main() {
    // 在此編寫您的程式碼
}
```
{validate="false" kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-lambdas-exercise-2"}

|---|---|
```kotlin
fun repeatN(n: Int, action: () -> Unit) {
    for (i in 1..n) {
        action()
    }
}

fun main() {
    repeatN(5) {
        println("Hello")
    }
}
```
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="範例解答" id="kotlin-tour-lambdas-solution-2"}

## 下一步

[類別](kotlin-tour-classes.md)