---
title: "字串 (Strings)"
---
Kotlin 中的字串由 [`String`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/) 類型表示。

:::note
在 Java 虛擬機 (JVM) 上，使用 UTF-16 編碼的 `String` 類型的物件，每個字元大約使用 2 個位元組。

:::

通常，字串值是用雙引號 (`"`) 括起來的字元序列：

```kotlin
val str = "abcd 123"
```

字串的元素是字元，你可以透過索引操作 `s[i]` 來存取。
你可以使用 `for` 迴圈來迭代這些字元：

```kotlin
fun main() {
    val str = "abcd" 

    for (c in str) {
        println(c)
    }

}
```

字串是不可變的 (immutable)。 一旦你初始化一個字串，就不能更改它的值或為它賦予一個新值。
所有轉換字串的操作都會在新的 `String` 物件中傳回其結果，而原始字串保持不變：

```kotlin
fun main() {

    val str = "abcd"
   
    // 建立並印出一個新的 String 物件
    println(str.uppercase())
    // ABCD
   
    // 原始字串保持不變
    println(str) 
    // abcd

}
```

要串連字串，請使用 `+` 運算子。 這也適用於將字串與其他類型的值串連，只要表達式中的第一個元素是字串：

```kotlin
fun main() {

    val s = "abc" + 1
    println(s + "def")
    // abc1def    

}
```

:::note
在大多數情況下，使用[字串模板](#string-templates)或[多行字串](#multiline-strings)比字串串連更可取。

:::

## 字串字面值 (String literals)

Kotlin 有兩種字串字面值類型：

* [跳脫字串 (Escaped strings)](#escaped-strings)
* [多行字串 (Multiline strings)](#multiline-strings)

### 跳脫字串 (Escaped strings)

_跳脫字串_ 可以包含跳脫字元。
以下是一個跳脫字串的範例：

```kotlin
val s = "Hello, world!
"
```

跳脫以傳統方式完成，使用反斜線 (`\`)。
有關支援的跳脫序列列表，請參閱[字元](characters)頁面。

### 多行字串 (Multiline strings)

_多行字串_ 可以包含換行符號和任意文字。 它由三引號 (`"""`) 分隔，
不包含跳脫字元，並且可以包含換行符號和任何其他字元：

```kotlin
val text = """
    for (c in "foo")
        print(c)
    """
```

要從多行字串中移除開頭的空白字元，請使用 [`trimMargin()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/trim-margin.html) 函數：

```kotlin
val text = """
    |Tell me and I forget.
    |Teach me and I remember.
    |Involve me and I learn.
    |(Benjamin Franklin)
    """.trimMargin()
```

預設情況下，管道符號 `|` 用作邊界前綴，但你可以選擇另一個字元並將其作為參數傳遞，例如 `trimMargin(">")`。

## 字串模板 (String templates)

字串字面值可能包含_模板表達式_ – 程式碼片段，這些程式碼片段會被評估，其結果會串連到字串中。
當處理模板表達式時，Kotlin 會自動對表達式的結果呼叫 `.toString()` 函數
以將其轉換為字串。 模板表達式以美元符號 (`$`) 開頭，並且包含變數名稱：

```kotlin
fun main() {

    val i = 10
    println("i = $i") 
    // i = 10
    
    val letters = listOf("a","b","c","d","e")
    println("Letters: $letters") 
    // Letters: [a, b, c, d, e]

}
```

或花括號中的表達式：

```kotlin
fun main() {

    val s = "abc"
    println("$s.length is ${s.length}") 
    // abc.length is 3

}
```

你可以在多行和跳脫字串中使用模板。 但是，多行字串不支援反斜線跳脫。
若要在多行字串中插入美元符號 `$`, 且在 [identifier](https://kotlinlang.org/docs/reference/grammar.html#identifiers) 的開頭允許的任何符號之前，
請使用以下語法：

```kotlin
val price = """
${'$'}9.99
"""
```

:::note
為了避免字串中出現 `${'$'}` 序列，你可以使用實驗性的 [多美元符號字串插值功能](#multi-dollar-string-interpolation)。

:::

### 多美元符號字串插值 (Multi-dollar string interpolation)

:::note
多美元符號字串插值是[實驗性的](https://kotlinlang.org/docs/components-stability.html#stability-levels-explained)
並且需要選擇加入（請參閱下面的詳細資訊）。

它可能隨時變更。 我們將感謝你在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-2425) 中提供你的回饋。

多美元符號字串插值允許你指定需要多少個連續的美元符號才能觸發插值。
插值是將變數或表達式直接嵌入字串的過程。

雖然你可以為單行字串[跳脫字面值](#escaped-strings)，
但 Kotlin 中的多行字串不支援反斜線跳脫。
若要包含美元符號 (`$`) 作為字面字元，你必須使用 `${'$'}` 結構來防止字串插值。
這種方法會使程式碼更難以閱讀，尤其是在字串包含多個美元符號時。

多美元符號字串插值透過允許你將美元符號視為單行和多行字串中的字面字元來簡化此操作。
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

在這裡，`$` 前綴指定需要兩個連續的美元符號才能觸發字串插值。
單個美元符號保留為字面字元。

你可以調整觸發插值的美元符號數量。
例如，使用三個連續的美元符號 (`$$$`) 允許 `$` 和 `$$` 保留為字面值，
同時使用 `$${'$'}productName` 啟用插值：

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

在這裡，`$$$` 前綴允許字串包含 `$$` 和 `$` 而無需使用 `${'$'}` 結構進行跳脫。

若要啟用此功能，請在命令列中使用以下編譯器選項：

```bash
kotlinc -Xmulti-dollar-interpolation main.kt
```

或者，更新你的 Gradle 建置檔案的 `compilerOptions {}` 區塊：

```kotlin
// build.gradle.kts
kotlin {
    compilerOptions {
        freeCompilerArgs.add("-Xmulti-dollar-interpolation")
    }
}
```

此功能不影響使用單美元符號字串插值的現有程式碼。
你可以像以前一樣繼續使用單個 `$`，並在你需要處理字串中的字面美元符號時套用多個美元符號。

## 字串格式化 (String formatting)

使用 `String.format()` 函數進行字串格式化僅適用於 Kotlin/JVM。

:::

要根據你的特定需求格式化字串，請使用 [`String.format()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/format.html) 函數。

`String.format()` 函數接受格式字串和一個或多個引數。 格式字串包含給定引數的一個佔位符（由 `%` 表示），後跟格式規範。
格式規範是相應引數的格式化指示，由旗標、寬度、精度和轉換類型組成。 總而言之，格式規範決定了輸出的格式。 常見的格式規範包括用於整數的 `%d`、用於浮點數的 `%f` 和用於字串的 `%s`。 你也可以使用 `argument_index$` 語法
在格式字串中以不同的格式多次引用同一個引數。

:::note
有關格式規範的詳細理解和廣泛列表，請參閱 [Java 的 Class Formatter 文件](https://docs.oracle.com/javase/8/docs/api/java/util/Formatter.html#summary)。

:::

讓我們看一個例子：

```kotlin
fun main() { 

    // 格式化一個整數，新增前導零以達到七個字元的長度
    val integerNumber = String.format("%07d", 31416)
    println(integerNumber)
    // 0031416

    // 格式化一個浮點數以顯示帶有 + 符號和四位小數
    val floatNumber = String.format("%+.4f", 3.141592)
    println(floatNumber)
    // +3.1416

    // 格式化兩個字串為大寫，每個字串佔用一個佔位符
    val helloString = String.format("%S %S", "hello", "world")
    println(helloString)
    // HELLO WORLD
    
    // 格式化一個負數以括在括號中，然後使用 `argument_index$` 以不同的格式（不帶括號）重複相同的數字。
    val negativeNumberInParentheses = String.format("%(d means %1\$d", -31416)
    println(negativeNumberInParentheses)
    //(31416) means -31416

}
```

`String.format()` 函數提供與字串模板類似的功能。 但是，`String.format()` 函數更加通用，因為有更多可用的格式化選項。

此外，你可以從變數分配格式字串。 當格式字串發生變化時，這可能很有用，例如，在取決於使用者語言環境的本地化案例中。

使用 `String.format()` 函數時要小心，因為很容易使引數的數量或位置與其對應的佔位符不匹配。