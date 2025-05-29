[//]: # (title: 字串)

Kotlin 中的字串由型別 [`String`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/) 表示。

> 在 JVM 上，UTF-16 編碼的 `String` 類型物件大約每個字元使用 2 個位元組。
> 
{style="note"}

通常，字串值是以雙引號 (`"`) 包圍的字元序列：

```kotlin
val str = "abcd 123"
```

字串的元素是字元，您可以透過索引操作 `s[i]` 存取。
您可以使用 `for` 迴圈來迭代這些字元：

```kotlin
fun main() {
    val str = "abcd" 
//sampleStart
    for (c in str) {
        println(c)
    }
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

字串是不可變的。一旦您初始化一個字串，就不能更改其值或為其賦予新值。
所有轉換字串的操作都會在新的 `String` 物件中傳回其結果，而原始字串保持不變：

```kotlin
fun main() {
//sampleStart
    val str = "abcd"
   
    // Creates and prints a new String object
    println(str.uppercase())
    // ABCD
   
    // The original string remains the same
    println(str) 
    // abcd
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

若要串連字串，請使用 `+` 運算子。這也適用於串連字串與其他型別的值，只要表達式中的第一個元素是字串：

```kotlin
fun main() {
//sampleStart
    val s = "abc" + 1
    println(s + "def")
    // abc1def    
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

> 在大多數情況下，使用[字串模板](#string-templates)或[多行字串](#multiline-strings)比字串串連更受推薦。
> 
{style="note"}

## 字串字面值

Kotlin 有兩種字串字面值：

*   [跳脫字串](#escaped-strings)
*   [多行字串](#multiline-strings)

### 跳脫字串

_跳脫字串_可以包含跳脫字元。
以下是跳脫字串的範例：

```kotlin
val s = "Hello, world!
"
```

跳脫是透過傳統方式，使用反斜線 (`\`) 完成的。
有關支援的跳脫序列列表，請參閱[字元](characters.md)頁面。

### 多行字串

_多行字串_可以包含換行和任意文字。它由三個引號 (`"""`) 分隔，不包含跳脫，並且可以包含換行和任何其他字元：

```kotlin
val text = """
    for (c in "foo")
        print(c)
    """
```

若要從多行字串中移除前導空白字元，請使用 [`trimMargin()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/trim-margin.html) 函數：

```kotlin
val text = """
    |Tell me and I forget.
    |Teach me and I remember.
    |Involve me and I learn.
    |(Benjamin Franklin)
    """.trimMargin()
```

預設情況下，管道符號 `|` 用作邊距前綴，但您可以選擇另一個字元並將其作為參數傳遞，例如 `trimMargin(">")`。

## 字串模板

字串字面值可以包含_模板表達式_ — 這些程式碼片段會被評估，其結果會被串連到字串中。
當模板表達式被處理時，Kotlin 會自動呼叫表達式結果的 `.toString()` 函數，將其轉換為字串。模板表達式以錢號 (`$`) 開頭，並由變數名稱構成：

```kotlin
fun main() {
//sampleStart
    val i = 10
    println("i = $i") 
    // i = 10
    
    val letters = listOf("a","b","c","d","e")
    println("Letters: $letters") 
    // Letters: [a, b, c, d, e]

//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

或大括號中的表達式：

```kotlin
fun main() {
//sampleStart
    val s = "abc"
    println("$s.length is ${s.length}") 
    // abc.length is 3
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

您可以在多行字串和跳脫字串中使用模板。然而，多行字串不支援反斜線跳脫。
若要在多行字串中插入錢號 (`$`)，在[識別符號](https://kotlinlang.org/docs/reference/grammar.html#identifiers)開頭允許的任何符號之前，請使用以下語法：

```kotlin
val price = """
${'
    ```}_9.99
"""
```

> 為了避免字串中出現 `${'
    ```}` 序列，您可以使用實驗性的[多錢號字串插值功能](#multi-dollar-string-interpolation)。
>
{style="note"}

### 多錢號字串插值

> 多錢號字串插值是[實驗性功能](components-stability.md#stability-levels-explained)，且需要啟用（詳情見下文）。
> 
> 此功能隨時可能更改。如果您能在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-2425) 中提供回饋，我們將不勝感激。
>
{style="warning"}

多錢號字串插值允許您指定需要多少個連續的錢號來觸發插值。
插值是將變數或表達式直接嵌入字串中的過程。

雖然您可以為單行字串[跳脫字面值](#escaped-strings)，但 Kotlin 中的多行字串不支援反斜線跳脫。
若要包含錢號 (`$`) 作為字面字元，您必須使用 `${'
    ```}` 語法來防止字串插值。
這種方法會使程式碼難以閱讀，特別是當字串包含多個錢號時。

多錢號字串插值簡化了這一點，
讓您可以在單行和多行字串中將錢號視為字面字元。
例如：

```kotlin
val KClass<*>.jsonSchema : String
    get() = $"""
    {
      "$schema": "https://json-schema.org/draft/2020-12/schema",
      "$id": "https://example.com/product.schema.json",
      "$dynamicAnchor": "meta"
      "title": "${simpleName ?: qualifiedName ?: "unknown"}",
      "type": "object"
    }
    """
```

在這裡，`$$` 前綴指定需要兩個連續的錢號才能觸發字串插值。
單個錢號則保持為字面字元。

您可以調整觸發插值所需的錢號數量。
例如，使用三個連續的錢號 (`$$$`) 允許 `$` 和 `$$` 保持為字面字元，同時啟用 `$$$` 的插值：

```kotlin
val productName = "carrot"
val requestedData =
    $$"""{
      "currency": "$",
      "enteredAmount": "42.45 $",
      "$serviceField": "none",
      "product": "$$productName"
    }
    """

println(requestedData)
//{
//    "currency": "$",
//    "enteredAmount": "42.45 $",
//    "$serviceField": "none",
//    "product": "carrot"
//}
```

在這裡，`$$` 前綴允許字串包含 `$` 和 `$$` 而無需使用 `${'
    ```}` 語法進行跳脫。

若要啟用此功能，請在命令列中使用以下編譯器選項：

```bash
kotlinc -Xmulti-dollar-interpolation main.kt
```

或者，更新您的 Gradle 建置文件中的 `compilerOptions {}` 區塊：

```kotlin
// build.gradle.kts
kotlin {
    compilerOptions {
        freeCompilerArgs.add("-Xmulti-dollar-interpolation")
    }
}
```

此功能不影響使用單錢號字串插值的現有程式碼。
您可以繼續如往常一樣使用單個錢號 `$`，並在需要處理字串中的字面錢號時應用多錢號符號。

## 字串格式化

> 使用 `String.format()` 函數進行字串格式化僅在 Kotlin/JVM 中可用。
>
{style="note"}

若要根據您的特定需求格式化字串，請使用 [`String.format()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/format.html) 函數。

`String.format()` 函數接受一個格式字串和一個或多個參數。格式字串包含一個用於給定參數的佔位符（以 `%` 表示），後跟格式指定符。
格式指定符是針對相應參數的格式化指令，由旗標、寬度、精度和轉換類型組成。總體而言，格式指定符決定了輸出的格式。常見的格式指定符包括用於整數的 `%d`、用於浮點數的 `%f` 和用於字串的 `%s`。您也可以使用 `argument_index$` 語法，在格式字串中以不同格式多次引用同一個參數。

> 若要詳細了解並查看格式指定符的完整列表，請參閱 [Java 的 Class Formatter 文件](https://docs.oracle.com/javase/8/docs/api/java/util/Formatter.html#summary)。
>
{style="note"}

我們來看一個例子：

```kotlin
fun main() { 
//sampleStart
    // 格式化一個整數，添加前導零以達到七個字元的長度
    val integerNumber = String.format("%07d", 31416)
    println(integerNumber)
    // 0031416

    // 格式化一個浮點數，顯示加號和四個小數位
    val floatNumber = String.format("%+.4f", 3.141592)
    println(floatNumber)
    // +3.1416

    // 格式化兩個字串為大寫，每個佔用一個佔位符
    val helloString = String.format("%S %S", "hello", "world")
    println(helloString)
    // HELLO WORLD
    
    // 格式化一個負數使其被括號包圍，然後使用 `argument_index` 重複相同的數字以不同格式（不帶括號）顯示。
    val negativeNumberInParentheses = String.format("%(d means %1\$d", -31416)
    println(negativeNumberInParentheses)
    //(31416) means -31416
//sampleEnd    
}
```
{interpolate-variables="false" kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

`String.format()` 函數提供了與字串模板類似的功能。然而，`String.format()` 函數更具多功能性，因為它提供了更多格式化選項。

此外，您可以從變數賦值格式字串。這在格式字串會改變的情況下會很有用，例如在取決於使用者地區設定的本地化案例中。

使用 `String.format()` 函數時請小心，因為很容易將參數的數量或位置與其相應的佔位符不匹配。