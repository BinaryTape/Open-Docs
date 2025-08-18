[//]: # (title: 字串)

Kotlin 中的字串由類型 [`String`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/) 表示。

> 在 JVM 上，UTF-16 編碼的 `String` 類型物件每個字元約使用 2 位元組。
>
{style="note"}

通常，字串值是雙引號 (`"`) 中的字元序列：

```kotlin
val str = "abcd 123"
```

字串的元素是字元，您可以透過索引操作 `s[i]` 存取這些字元。
您可以使用 `for` 迴圈迭代這些字元：

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

字串是不可變的。一旦初始化字串，您就無法更改其值或為其賦予新值。
所有轉換字串的操作都會在新 `String` 物件中傳回其結果，原始字串保持不變：

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

要串連字串，請使用 `+` 運算子。這也適用於將字串與其他類型的值串連，只要表達式中的第一個元素是字串即可：

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

> 在大多數情況下，使用 [字串模板](#string-templates) 或 [多行字串](#multiline-strings) 優於字串串連。
>
{style="note"}

## 字串常值

Kotlin 有兩種字串常值類型：

* [跳脫字串](#escaped-strings)
* [多行字串](#multiline-strings)

### 跳脫字串

_跳脫字串_ 可以包含跳脫字元。
以下是一個跳脫字串的範例：

```kotlin
val s = "Hello, world!
"
```

跳脫是以傳統方式完成的，使用反斜線 (`\`)。
有關支援的跳脫序列清單，請參閱 [字元](characters.md) 頁面。

### 多行字串

_多行字串_ 可以包含換行符號和任意文字。它以三引號 (`"""`) 分隔，不包含跳脫字元，並且可以包含換行符號和任何其他字元：

```kotlin
val text = """
    for (c in "foo")
        print(c)
    """
```

要移除多行字串前導的空白字元，請使用 [`trimMargin()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/trim-margin.html) 函式：

```kotlin
val text = """
    |Tell me and I forget.
    |Teach me and I remember.
    |Involve me and I learn.
    |(Benjamin Franklin)
    """.trimMargin()
```

預設情況下，管道符號 `|` 用作邊界前綴，但您可以選擇另一個字元並將其作為參數傳遞，例如 `trimMargin(">")`。

## 字串模板

字串常值可以包含 _模板表達式_ – 這些程式碼片段會被評估，其結果會串連到字串中。
處理模板表達式時，Kotlin 會自動呼叫表達式結果上的 `.toString()` 函式以將其轉換為字串。模板表達式以錢號 (`$`) 開頭，包含以下兩種形式：

變數名稱：

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

或花括號中的表達式：

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
要在多行字串中、在任何允許在 [識別符號](https://kotlinlang.org/docs/reference/grammar.html#identifiers) 開頭的符號之前插入錢號 (`$`)，請使用以下語法：

```kotlin
val price = """
${'$'}9.99
"""
```

> 為了避免字串中出現 `${'$'}` 序列，您可以使用實驗性的 [多錢號字串插值功能](#multi-dollar-string-interpolation)。
>
{style="note"}

### 多錢號字串插值

多錢號字串插值允許您指定需要多少個連續的錢號來觸發插值。
插值是將變數或表達式直接嵌入字串的過程。

儘管您可以為單行字串 [跳脫常值](#escaped-strings)，但 Kotlin 中的多行字串不支援反斜線跳脫。
要將錢號 (`$`) 作為常值字元包含，您必須使用 `${'$'}` 結構以防止字串插值。
這種方法會使程式碼難以閱讀，特別是當字串包含多個錢號時。

多錢號字串插值透過讓您可以將錢號視為單行和多行字串中的常值字元來簡化此過程。
例如：

```kotlin
val KClass<*>.jsonSchema : String
    get() = $"""
    {
      "$schema": "https://json-schema.org/draft/2020-12/schema",
      "$id": "https://example.com/product.schema.json",
      "$dynamicAnchor": "meta",
      "title": "${simpleName ?: qualifiedName ?: "unknown"}",
      "type": "object"
    }
    """
```

在這裡，`$` 前綴指定需要兩個連續的錢號來觸發字串插值。
單個錢號保持為常值字元。

您可以調整有多少個錢號會觸發插值。
例如，使用三個連續的錢號 (`$$$`) 允許 `$` 和 `$$` 作為常值，同時啟用 `$$$` 的插值：

```kotlin
val productName = "carrot"
val requestedData =
    $$$"""{
      "currency": "$",
      "enteredAmount": "42.45 $$",
      "$$serviceField": "none",
      "product": "$$$productName"
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

在這裡，`$$$` 前綴允許字串包含 `$` 和 `$$`，而無需使用 `${'$'}` 結構進行跳脫。

多錢號字串插值不影響現有使用單錢號字串插值的程式碼。
您可以像以前一樣繼續使用單個錢號 (`$`)，並在需要在字串中處理常值錢號時應用多個錢號。

## 字串格式化

> 使用 `String.format()` 函式的字串格式化僅在 Kotlin/JVM 中可用。
>
{style="note"}

要根據您的特定要求格式化字串，請使用 [`String.format()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/format.html) 函式。

`String.format()` 函式接受一個格式字串和一個或多個參數。格式字串包含一個佔位符（以 `%` 表示）用於給定參數，後跟格式指定符。
格式指定符是相應參數的格式化指令，由標誌 (flags)、寬度 (width)、精度 (precision) 和轉換類型 (conversion type) 組成。總體而言，格式指定符塑造輸出的格式。常見的格式指定符包括 `%d` (用於整數)、`%f` (用於浮點數) 和 `%s` (用於字串)。您還可以使用 `argument_index$` 語法在格式字串中以不同格式多次參考同一個參數。

> 要詳細了解和獲取廣泛的格式指定符清單，請參閱 [Java 的 Class Formatter 文件](https://docs.oracle.com/javase/8/docs/api/java/util/Formatter.html#summary)。
>
{style="note"}

我們來看一個範例：

```kotlin
fun main() { 
//sampleStart
    // Formats an integer, adding leading zeroes to reach a length of seven characters
    val integerNumber = String.format("%07d", 31416)
    println(integerNumber)
    // 0031416

    // Formats a floating-point number to display with a + sign and four decimal places
    val floatNumber = String.format("%+.4f", 3.141592)
    println(floatNumber)
    // +3.1416

    // Formats two strings to uppercase, each taking one placeholder
    val helloString = String.format("%S %S", "hello", "world")
    println(helloString)
    // HELLO WORLD
    
    // Formats a negative number to be enclosed in parentheses, then repeats the same number in a different format (without parentheses) using `argument_index`.
    val negativeNumberInParentheses = String.format("%(d means %1$d", -31416)
    println(negativeNumberInParentheses)
    //(31416) means -31416
//sampleEnd    
}
```
{interpolate-variables="false" kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

`String.format()` 函式提供類似於字串模板的功能。然而，`String.format()` 函式更具多功能性，因為它提供了更多的格式化選項。

此外，您可以從變數賦予格式字串。當格式字串變更時，這會很有用，例如，在取決於使用者地區設定的本地化情況中。

使用 `String.format()` 函式時請務必小心，因為很容易使參數的數量或位置與其相應的佔位符不匹配。