[//]: # (title: 作用域函式)

Kotlin 標準函式庫包含數個函式，其唯一目的是在物件的上下文中執行一段程式碼區塊。當您在物件上呼叫此類函式並提供 [lambda 表達式](lambdas.md)時，它會形成一個暫時作用域。在此作用域中，您可以不需透過其名稱即可存取該物件。此類函式稱為 _作用域函式_。它們共有五個：[`let`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/let.html)、[`run`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/run.html)、[`with`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/with.html)、[`apply`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/apply.html) 和 [`also`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/also.html)。

基本上，這些函式都執行相同的動作：在物件上執行一段程式碼。不同之處在於該物件如何在區塊內部變得可用，以及整個表達式的結果是什麼。

以下是使用作用域函式的典型範例：

```kotlin
data class Person(var name: String, var age: Int, var city: String) {
    fun moveTo(newCity: String) { city = newCity }
    fun incrementAge() { age++ }
}

fun main() {
//sampleStart
    Person("Alice", 20, "Amsterdam").let {
        println(it)
        it.moveTo("London")
        it.incrementAge()
        println(it)
    }
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

如果您在不使用 `let` 的情況下編寫相同的程式碼，您將不得不引入一個新變數，並在每次使用它時重複其名稱。

```kotlin
data class Person(var name: String, var age: Int, var city: String) {
    fun moveTo(newCity: String) { city = newCity }
    fun incrementAge() { age++ }
}

fun main() {
//sampleStart
    val alice = Person("Alice", 20, "Amsterdam")
    println(alice)
    alice.moveTo("London")
    alice.incrementAge()
    println(alice)
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

作用域函式不會引入任何新的技術能力，但它們可以使您的程式碼更簡潔且更具可讀性。

由於作用域函式之間存在許多相似之處，為您的使用場景選擇正確的函式可能很棘手。選擇主要取決於您的意圖以及在專案中使用的一致性。下方，我們提供了作用域函式之間差異及其慣例的詳細說明。

## 函式選擇

為了幫助您選擇適合您目的的作用域函式，我們提供了此表格，總結了它們之間的關鍵差異。

| 函式 |物件參考|回傳值|是擴充函式嗎|
|---|---|---|---|
| [`let`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/let.html) |`it`|Lambda 結果|是|
| [`run`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/run.html) |`this`|Lambda 結果|是|
| [`run`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/run.html) |-|Lambda 結果|否：在沒有上下文物件的情況下呼叫|
| [`with`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/with.html) |`this`|Lambda 結果|否：將上下文物件作為引數。|
| [`apply`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/apply.html) |`this`|上下文物件|是|
| [`also`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/also.html) |`it`|上下文物件|是|

有關這些函式的詳細資訊請參見下方專門的章節。

以下是根據預期目的選擇作用域函式的簡短指南：

*   在非空物件上執行 lambda：`let`
*   在局部作用域中將表達式引入為變數：`let`
*   物件配置：`apply`
*   物件配置並計算結果：`run`
*   在需要表達式的地方執行語句：非擴充 `run`
*   額外作用：`also`
*   在物件上分組函式呼叫：`with`

不同作用域函式的使用場景重疊，因此您可以根據專案或團隊中使用的特定慣例來選擇要使用的函式。

儘管作用域函式可以使您的程式碼更簡潔，但請避免過度使用它們：這會使您的程式碼難以閱讀並導致錯誤。我們也建議您避免巢狀作用域函式，並在鏈式呼叫它們時要小心，因為很容易混淆目前的上下文物件以及 `this` 或 `it` 的值。

## 區別

由於作用域函式本質上相似，因此了解它們之間的差異非常重要。每個作用域函式之間有兩個主要區別：
*   它們引用上下文物件的方式。
*   它們的回傳值。

### 上下文物件：`this` 或 `it`

在傳遞給作用域函式的 lambda 內部，上下文物件可以透過簡短參考而不是其實際名稱來存取。每個作用域函式都使用以下兩種方式之一來引用上下文物件：作為 lambda [接收器](lambdas.md#function-literals-with-receiver) (`this`) 或作為 lambda 引數 (`it`)。兩者都提供相同的功能，因此我們描述了每種方式在不同使用場景下的優缺點，並提供了它們的使用建議。

```kotlin
fun main() {
    val str = "Hello"
    // this
    str.run {
        println("The string's length: $length")
        //println("字串的長度：${this.length}") // 效果相同
    }

    // it
    str.let {
        println("The string's length is ${it.length}")
    }
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

#### `this`

`run`、`with` 和 `apply` 將上下文物件引用為 lambda [接收器](lambdas.md#function-literals-with-receiver) — 透過關鍵字 `this`。因此，在它們的 lambda 中，物件的可用方式與在普通類別函式中一樣。

在大多數情況下，存取接收物件的成員時，您可以省略 `this`，從而使程式碼更短。另一方面，如果省略 `this`，則可能難以區分接收器成員與外部物件或函式。因此，推薦將上下文物件作為接收器 (`this`) 用於主要透過呼叫物件函式或為屬性賦值來操作物件成員的 lambda。

```kotlin
data class Person(var name: String, var age: Int = 0, var city: String = "")

fun main() {
//sampleStart
    val adam = Person("Adam").apply { 
        age = 20                       // 與 this.age = 20 相同
        city = "London"
    }
    println(adam)
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

#### `it`

反之，`let` 和 `also` 將上下文物件引用為 lambda [引數](lambdas.md#lambda-expression-syntax)。如果未指定引數名稱，則物件透過隱式預設名稱 `it` 存取。`it` 比 `this` 短，並且帶有 `it` 的表達式通常更容易閱讀。

然而，在呼叫物件的函式或屬性時，您無法像 `this` 那樣隱式取得物件。因此，當物件主要作為函式呼叫的引數使用時，透過 `it` 存取上下文物件會更好。如果您在程式碼區塊中使用多個變數，`it` 也會更好。

```kotlin
import kotlin.random.Random

fun writeToLog(message: String) {
    println("資訊：$message")
}

fun main() {
//sampleStart
    fun getRandomInt(): Int {
        return Random.nextInt(100).also {
            writeToLog("getRandomInt() 生成的值 $it")
        }
    }
    
    val i = getRandomInt()
    println(i)
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

以下範例示範了將上下文物件作為帶有引數名稱 `value` 的 lambda 引數來引用。

```kotlin
import kotlin.random.Random

fun writeToLog(message: String) {
    println("資訊：$message")
}

fun main() {
//sampleStart
    fun getRandomInt(): Int {
        return Random.nextInt(100).also { value ->
            writeToLog("getRandomInt() 生成的值 $value")
        }
    }
    
    val i = getRandomInt()
    println(i)
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

### 回傳值

作用域函式根據它們回傳的結果而有所不同：
*   `apply` 和 `also` 回傳上下文物件。
*   `let`、`run` 和 `with` 回傳 lambda 結果。

您應該根據程式碼中下一步想要做什麼，仔細考慮您想要什麼回傳值。這有助於您選擇最佳的作用域函式。

#### 上下文物件

`apply` 和 `also` 的回傳值是上下文物件本身。因此，它們可以作為 _側向步驟_ 納入呼叫鏈中：您可以繼續在同一個物件上鏈式呼叫函式，一個接一個。

```kotlin
fun main() {
//sampleStart
    val numberList = mutableListOf<Double>()
    numberList.also { println("正在填充列表") }
        .apply {
            add(2.71)
            add(3.14)
            add(1.0)
        }
        .also { println("正在排序列表") }
        .sort()
//sampleEnd
    println(numberList)
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

它們也可以用於回傳上下文物件的函式之回傳語句。

```kotlin
import kotlin.random.Random

fun writeToLog(message: String) {
    println("資訊：$message")
}

fun main() {
//sampleStart
    fun getRandomInt(): Int {
        return Random.nextInt(100).also {
            writeToLog("getRandomInt() 生成的值 $it")
        }
    }
    
    val i = getRandomInt()
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

#### Lambda 結果

`let`、`run` 和 `with` 回傳 lambda 結果。因此，您可以將它們用於將結果賦值給變數、對結果執行鏈式操作等等。

```kotlin
fun main() {
//sampleStart
    val numbers = mutableListOf("one", "two", "three")
    val countEndsWithE = numbers.run { 
        add("four")
        add("five")
        count { it.endsWith("e") }
    }
    println("有 $countEndsWithE 個元素以 e 結尾。")
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

此外，您可以忽略回傳值，並使用作用域函式為局部變數建立一個暫時作用域。

```kotlin
fun main() {
//sampleStart
    val numbers = mutableListOf("one", "two", "three")
    with(numbers) {
        val firstItem = first()
        val lastItem = last()        
        println("第一個元素：$firstItem，最後一個元素：$lastItem")
    }
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

## 函式

為了幫助您選擇適合您使用場景的作用域函式，我們將詳細說明它們並提供使用建議。從技術上講，作用域函式在許多情況下可互換，因此這些範例展示了使用它們的慣例。

### `let`

-   **上下文物件**作為引數 (`it`) 可用。
-   **回傳值**是 lambda 結果。

[`let`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/let.html) 可用於在呼叫鏈的結果上調用一個或多個函式。例如，以下程式碼印出對集合執行兩次操作的結果：

```kotlin
fun main() {
//sampleStart
    val numbers = mutableListOf("one", "two", "three", "four", "five")
    val resultList = numbers.map { it.length }.filter { it > 3 }
    println(resultList)    
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

透過 `let`，您可以重寫上述範例，使其不將列表操作的結果賦值給變數：

```kotlin
fun main() {
//sampleStart
    val numbers = mutableListOf("one", "two", "three", "four", "five")
    numbers.map { it.length }.filter { it > 3 }.let { 
        println(it)
        // 如果需要，可加入更多函式呼叫
    } 
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

如果傳遞給 `let` 的程式碼區塊包含一個以 `it` 作為引數的單一函式，您可以使用方法參考 (`::`) 而非 lambda 引數：

```kotlin
fun main() {
//sampleStart
    val numbers = mutableListOf("one", "two", "three", "four", "five")
    numbers.map { it.length }.filter { it > 3 }.let(::println)
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

`let` 常用於執行包含非空值的程式碼區塊。若要對可空物件執行操作，請在其上使用 [安全呼叫運算子 `?.`](null-safety.md#safe-call-operator)，並在其 lambda 中呼叫 `let` 並執行操作。

```kotlin
fun processNonNullString(str: String) {}

fun main() {
//sampleStart
    val str: String? = "Hello"   
    //processNonNullString(str)       // 編譯錯誤：str 可能為空
    val length = str?.let { 
        println("let() 在 $it 上被呼叫")        
        processNonNullString(it)      // OK：在 '?.let { }' 內部 'it' 不為空
        it.length
    }
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

您也可以使用 `let` 引入具有有限作用域的局部變數，以使您的程式碼更易讀。若要為上下文物件定義一個新變數，請將其名稱作為 lambda 引數提供，以便可以使用它來代替預設的 `it`。

```kotlin
fun main() {
//sampleStart
    val numbers = listOf("one", "two", "three", "four")
    val modifiedFirstItem = numbers.first().let { firstItem ->
        println("列表的第一個元素是 '$firstItem'")
        if (firstItem.length >= 5) firstItem else "!" + firstItem + "!"
    }.uppercase()
    println("修改後的第一個元素：'$modifiedFirstItem'")
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

### `with`

-   **上下文物件**作為接收器 (`this`) 可用。
-   **回傳值**是 lambda 結果。

由於 [`with`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/with.html) 不是擴充函式：上下文物件作為引數傳遞，但在 lambda 內部，它作為接收器 (`this`) 可用。

我們建議您在不需要使用回傳結果時，使用 `with` 在上下文物件上呼叫函式。在程式碼中，`with` 可解讀為 "_使用此物件，執行以下操作。_"

```kotlin
fun main() {
//sampleStart
    val numbers = mutableListOf("one", "two", "three")
    with(numbers) {
        println("'with' 呼叫時帶有引數 $this")
        println("它包含 $size 個元素")
    }
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

您也可以使用 `with` 引入一個輔助物件，其屬性或函式用於計算值。

```kotlin
fun main() {
//sampleStart
    val numbers = mutableListOf("one", "two", "three")
    val firstAndLast = with(numbers) {
        "第一個元素是 ${first()}," +
        " 最後一個元素是 ${last()}"
    }
    println(firstAndLast)
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

### `run`

-   **上下文物件**作為接收器 (`this`) 可用。
-   **回傳值**是 lambda 結果。

[`run`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/run.html) 的作用與 `with` 相同，但它作為擴充函式實現。因此，與 `let` 類似，您可以使用點記法在上下文物件上呼叫它。

當您的 lambda 既初始化物件又計算回傳值時，`run` 非常有用。

```kotlin
class MultiportService(var url: String, var port: Int) {
    fun prepareRequest(): String = "Default request"
    fun query(request: String): String = "Result for query '$request'"
}

fun main() {
//sampleStart
    val service = MultiportService("https://example.kotlinlang.org", 80)

    val result = service.run {
        port = 8080
        query(prepareRequest() + " to port $port")
    }
    
    // 使用 let() 函式編寫的相同程式碼：
    val letResult = service.let {
        it.port = 8080
        it.query(it.prepareRequest() + " to port ${it.port}")
    }
//sampleEnd
    println(result)
    println(letResult)
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

您也可以以非擴充函式形式調用 `run`。`run` 的非擴充變體沒有上下文物件，但它仍回傳 lambda 結果。非擴充 `run` 讓您可以在需要表達式的地方執行一個包含多個語句的區塊。在程式碼中，非擴充 `run` 可解讀為 "_執行程式碼區塊並計算結果。_"

```kotlin
fun main() {
//sampleStart
    val hexNumberRegex = run {
        val digits = "0-9"
        val hexDigits = "A-Fa-f"
        val sign = "+-"
        
        Regex("[$sign]?[$digits$hexDigits]+")
    }
    
    for (match in hexNumberRegex.findAll("+123 -FFFF !%*& 88 XYZ")) {
        println(match.value)
    }
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

### `apply`

-   **上下文物件**作為接收器 (`this`) 可用。
-   **回傳值**是物件本身。

由於 [`apply`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/apply.html) 回傳上下文物件本身，我們建議您將它用於不回傳值且主要操作接收物件成員的程式碼區塊。`apply` 最常見的使用場景是物件配置。此類呼叫可解讀為 "_將以下賦值應用於此物件。_"

```kotlin
data class Person(var name: String, var age: Int = 0, var city: String = "")

fun main() {
//sampleStart
    val adam = Person("Adam").apply {
        age = 32
        city = "London"        
    }
    println(adam)
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

`apply` 的另一個使用場景是將 `apply` 納入多個呼叫鏈中以進行更複雜的處理。

### `also`

-   **上下文物件**作為引數 (`it`) 可用。
-   **回傳值**是物件本身。

[`also`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/also.html) 對於執行一些將上下文物件作為引數的操作非常有用。當您需要物件的引用而非其屬性與函式，或者您不想遮蔽外部作用域的 `this` 引用時，請使用 `also`。

當您在程式碼中看到 `also` 時，您可以將其解讀為 "_也對此物件執行以下操作。_"

```kotlin
fun main() {
//sampleStart
    val numbers = mutableListOf("one", "two", "three")
    numbers
        .also { println("添加新元素之前的列表元素：$it") }
        .add("four")
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

## `takeIf` 和 `takeUnless`

除了作用域函式之外，標準函式庫還包含函式 [`takeIf`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/take-if.html) 和 [`takeUnless`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/take-unless.html)。這些函式讓您可以在呼叫鏈中嵌入物件狀態的檢查。

當在物件上與謂詞一同呼叫時，`takeIf` 如果該物件滿足給定謂詞，則回傳此物件。否則，它回傳 `null`。因此，`takeIf` 是用於單一物件的過濾函式。

`takeUnless` 具有與 `takeIf` 相反的邏輯。當在物件上與謂詞一同呼叫時，如果該物件滿足給定謂詞，`takeUnless` 則回傳 `null`。否則，它回傳該物件。

使用 `takeIf` 或 `takeUnless` 時，物件作為 lambda 引數 (`it`) 可用。

```kotlin
import kotlin.random.*

fun main() {
//sampleStart
    val number = Random.nextInt(100)

    val evenOrNull = number.takeIf { it % 2 == 0 }
    val oddOrNull = number.takeUnless { it % 2 == 0 }
    println("偶數：$evenOrNull，奇數：$oddOrNull")
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

> 當在 `takeIf` 和 `takeUnless` 之後鏈式呼叫其他函式時，不要忘記執行空檢查或使用安全呼叫 (`?.`)，因為它們的回傳值可能為空。
>
{style="tip"}

```kotlin
fun main() {
//sampleStart
    val str = "Hello"
    val caps = str.takeIf { it.isNotEmpty() }?.uppercase()
   //val caps = str.takeIf { it.isNotEmpty() }.uppercase() // 編譯錯誤
    println(caps)
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

`takeIf` 和 `takeUnless` 與作用域函式結合使用時特別有用。例如，您可以將 `takeIf` 和 `takeUnless` 與 `let` 鏈式呼叫，以便在符合給定謂詞的物件上執行程式碼區塊。為此，在物件上呼叫 `takeIf`，然後使用安全呼叫 (`?`) 呼叫 `let`。對於不符合謂詞的物件，`takeIf` 會回傳 `null`，而 `let` 則不會被調用。

```kotlin
fun main() {
//sampleStart
    fun displaySubstringPosition(input: String, sub: String) {
        input.indexOf(sub).takeIf { it >= 0 }?.let {
            println("字串 $sub 在 $input 中被找到。")
            println("它的起始位置是 $it。")
        }
    }

    displaySubstringPosition("010000011", "11")
    displaySubstringPosition("010000011", "12")
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

為了比較，以下是一個範例，說明如何在不使用 `takeIf` 或作用域函式的情況下編寫相同的函式：

```kotlin
fun main() {
//sampleStart
    fun displaySubstringPosition(input: String, sub: String) {
        val index = input.indexOf(sub)
        if (index >= 0) {
            println("字串 $sub 在 $input 中被找到。")
            println("它的起始位置是 $index。")
        }
    }

    displaySubstringPosition("010000011", "11")
    displaySubstringPosition("010000011", "12")
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}