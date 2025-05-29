[//]: # (title: 作用域函數)

Kotlin 標準函式庫包含一些函數，它們的唯一目的是在物件的上下文 (context) 中執行程式碼區塊。當您在物件上呼叫這類函數並提供一個 [lambda 運算式](lambdas.md)時，它會形成一個暫時的作用域 (scope)。在這個作用域內，您可以不使用物件名稱即可存取該物件。這類函數稱為 _作用域函數_。共有五個：[`let`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/let.html)、[`run`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/run.html)、[`with`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/with.html)、[`apply`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/apply.html) 和 [`also`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/also.html)。

基本上，這些函數都執行相同的動作：在物件上執行一個程式碼區塊。不同之處在於該物件在區塊內如何可用，以及整個運算式的結果是什麼。

以下是使用作用域函數的典型範例：

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

如果您不使用 `let` 寫出相同的程式碼，則必須引入一個新變數並在每次使用它時重複其名稱。

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

作用域函數不會引入任何新的技術功能，但它們可以使您的程式碼更加簡潔和易讀。

由於作用域函數之間有許多相似之處，為您的用例 (use case) 選擇正確的函數可能很棘手。選擇主要取決於您的意圖以及在專案中使用的一致性。下面，我們提供了作用域函數之間差異及其慣例的詳細說明。

## 函數選擇

為了幫助您為您的目的選擇正確的作用域函數，我們提供此表格總結了它們之間的關鍵差異。

| 函數 |物件引用|回傳值|是擴充函數嗎|
|---|---|---|---|
| [`let`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/let.html) |`it`|Lambda 結果|是|
| [`run`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/run.html) |`this`|Lambda 結果|是|
| [`run`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/run.html) |-|Lambda 結果|否：在沒有上下文物件的情況下呼叫|
| [`with`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/with.html) |`this`|Lambda 結果|否：將上下文物件作為參數。|
| [`apply`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/apply.html) |`this`|上下文物件|是|
| [`also`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/also.html) |`it`|上下文物件|是|

關於這些函數的詳細資訊在下面的專用章節中提供。

以下是根據預期目的選擇作用域函數的簡短指南：

* 在非空 (non-nullable) 物件上執行 lambda：`let`
* 在本地作用域中將運算式作為變數引入：`let`
* 物件配置：`apply`
* 物件配置並計算結果：`run`
* 在需要運算式的地方執行語句：非擴充 `run`
* 額外效果：`also`
* 對物件分組函數呼叫：`with`

不同作用域函數的用例會重疊，因此您可以根據專案或團隊中使用的特定慣例來選擇要使用的函數。

儘管作用域函數可以使您的程式碼更簡潔，但請避免過度使用它們：這會使您的程式碼難以閱讀並導致錯誤。我們還建議您避免巢狀使用作用域函數，並在鏈式呼叫 (chaining) 時要小心，因為很容易混淆目前的上下文物件以及 `this` 或 `it` 的值。

## 區別

由於作用域函數本質上相似，因此了解它們之間的差異非常重要。
每個作用域函數之間有兩個主要差異：
* 它們引用上下文物件的方式。
* 它們的回傳值。

### 上下文物件：this 或 it

在傳遞給作用域函數的 lambda 內部，上下文物件可以透過簡短的引用而不是其實際名稱來取得。每個作用域函數都使用兩種方式之一來引用上下文物件：作為 lambda [接收者 (receiver)](lambdas.md#function-literals-with-receiver) (`this`) 或作為 lambda 參數 (`it`)。兩者提供相同的功能，因此我們將描述它們各自在不同用例中的優缺點，並提供使用建議。

```kotlin
fun main() {
    val str = "Hello"
    // this
    str.run {
        println("The string's length: $length")
        //println("The string's length: ${this.length}") // does the same
    }

    // it
    str.let {
        println("The string's length is ${it.length}")
    }
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

#### this

`run`、`with` 和 `apply` 將上下文物件作為 lambda [接收者 (receiver)](lambdas.md#function-literals-with-receiver) 引用 — 透過關鍵字 `this`。因此，在它們的 lambda 中，物件的可用方式與在普通類別函數中相同。

在大多數情況下，當存取接收者物件的成員時，您可以省略 `this`，使程式碼更短。另一方面，如果省略 `this`，則難以區分接收者成員與外部物件或函數。因此，建議將上下文物件作為接收者 (`this`) 用於主要透過呼叫其函數或為屬性賦值來操作物件成員的 lambda。

```kotlin
data class Person(var name: String, var age: Int = 0, var city: String = "")

fun main() {
//sampleStart
    val adam = Person("Adam").apply { 
        age = 20                       // same as this.age = 20
        city = "London"
    }
    println(adam)
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

#### it

相應地，`let` 和 `also` 將上下文物件作為 lambda [參數](lambdas.md#lambda-expression-syntax)引用。如果未指定參數名稱，則透過隱式預設名稱 `it` 存取物件。`it` 比 `this` 短，並且包含 `it` 的運算式通常更容易閱讀。

然而，在呼叫物件的函數或屬性時，您無法像 `this` 那樣隱式地取得物件。因此，當物件主要用作函數呼叫中的參數時，透過 `it` 存取上下文物件會更好。如果您在程式碼區塊中使用多個變數，`it` 也更好。

```kotlin
import kotlin.random.Random

fun writeToLog(message: String) {
    println("INFO: $message")
}

fun main() {
//sampleStart
    fun getRandomInt(): Int {
        return Random.nextInt(100).also {
            writeToLog("getRandomInt() generated value $it")
        }
    }
    
    val i = getRandomInt()
    println(i)
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

以下範例演示了如何以參數名稱 `value` 引用上下文物件作為 lambda 參數。

```kotlin
import kotlin.random.Random

fun writeToLog(message: String) {
    println("INFO: $message")
}

fun main() {
//sampleStart
    fun getRandomInt(): Int {
        return Random.nextInt(100).also { value ->
            writeToLog("getRandomInt() generated value $value")
        }
    }
    
    val i = getRandomInt()
    println(i)
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

### 回傳值

作用域函數的回傳結果有所不同：
* `apply` 和 `also` 回傳上下文物件。
* `let`、`run` 和 `with` 回傳 lambda 結果。

您應該根據您接下來想在程式碼中做什麼來仔細考慮您想要的回傳值。這有助於您選擇要使用的最佳作用域函數。

#### 上下文物件

`apply` 和 `also` 的回傳值是上下文物件本身。因此，它們可以作為 _旁道 (side steps)_ 包含在呼叫鏈 (call chains) 中：您可以繼續對同一個物件鏈式呼叫函數，一個接一個。

```kotlin
fun main() {
//sampleStart
    val numberList = mutableListOf<Double>()
    numberList.also { println("Populating the list") }
        .apply {
            add(2.71)
            add(3.14)
            add(1.0)
        }
        .also { println("Sorting the list") }
        .sort()
//sampleEnd
    println(numberList)
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

它們也可用於回傳上下文物件的函數的 `return` 語句中。

```kotlin
import kotlin.random.Random

fun writeToLog(message: String) {
    println("INFO: $message")
}

fun main() {
//sampleStart
    fun getRandomInt(): Int {
        return Random.nextInt(100).also {
            writeToLog("getRandomInt() generated value $it")
        }
    }
    
    val i = getRandomInt()
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

#### Lambda 結果

`let`、`run` 和 `with` 回傳 lambda 結果。因此，您可以在將結果賦值給變數、對結果進行鏈式操作等等時使用它們。

```kotlin
fun main() {
//sampleStart
    val numbers = mutableListOf("one", "two", "three")
    val countEndsWithE = numbers.run { 
        add("four")
        add("five")
        count { it.endsWith("e") }
    }
    println("There are $countEndsWithE elements that end with e.")
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

此外，您可以忽略回傳值並使用作用域函數為局部變數建立一個臨時作用域。

```kotlin
fun main() {
//sampleStart
    val numbers = mutableListOf("one", "two", "three")
    with(numbers) {
        val firstItem = first()
        val lastItem = last()        
        println("First item: $firstItem, last item: $lastItem")
    }
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

## 函數

為了幫助您為您的用例選擇正確的作用域函數，我們將詳細描述它們並提供使用建議。從技術上講，作用域函數在許多情況下是可互換的，因此這些範例展示了使用它們的慣例。

### let

- **上下文物件**作為參數 (`it`) 可用。
- **回傳值**是 lambda 結果。

[`let`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/let.html) 可用於對呼叫鏈的結果調用一個或多個函數。例如，以下程式碼印出對集合執行兩個操作的結果：

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

使用 `let`，您可以重寫上述範例，這樣您就不會將列表操作的結果賦值給變數：

```kotlin
fun main() {
//sampleStart
    val numbers = mutableListOf("one", "two", "three", "four", "five")
    numbers.map { it.length }.filter { it > 3 }.let { 
        println(it)
        // and more function calls if needed
    } 
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

如果傳遞給 `let` 的程式碼區塊包含一個以 `it` 作為參數的單一函數，您可以使用方法引用 (`::`) 代替 lambda 參數：

```kotlin
fun main() {
//sampleStart
    val numbers = mutableListOf("one", "two", "three", "four", "five")
    numbers.map { it.length }.filter { it > 3 }.let(::println)
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

`let` 常用於執行包含非空 (non-null) 值的程式碼區塊。若要對非空物件執行動作，請對其使用 [安全呼叫運算子 `?.`](null-safety.md#safe-call-operator)，然後呼叫 `let` 並將動作放在其 lambda 中。

```kotlin
fun processNonNullString(str: String) {}

fun main() {
//sampleStart
    val str: String? = "Hello"   
    //processNonNullString(str)       // compilation error: str can be null
    val length = str?.let { 
        println("let() called on $it")        
        processNonNullString(it)      // OK: 'it' is not null inside '?.let { }'
        it.length
    }
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

您也可以使用 `let` 引入作用域有限的局部變數，使您的程式碼更易於閱讀。若要為上下文物件定義一個新變數，請將其名稱作為 lambda 參數提供，以便可以使用它而不是預設的 `it`。

```kotlin
fun main() {
//sampleStart
    val numbers = listOf("one", "two", "three", "four")
    val modifiedFirstItem = numbers.first().let { firstItem ->
        println("The first item of the list is '$firstItem'")
        if (firstItem.length >= 5) firstItem else "!" + firstItem + "!"
    }.uppercase()
    println("First item after modifications: '$modifiedFirstItem'")
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

### with

- **上下文物件**作為接收者 (`this`) 可用。
- **回傳值**是 lambda 結果。

由於 [`with`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/with.html) 不是擴充函數：上下文物件作為參數傳遞，但在 lambda 內部，它作為接收者 (`this`) 可用。

當您不需要使用回傳結果時，我們建議使用 `with` 在上下文物件上呼叫函數。在程式碼中，`with` 可以讀作 "_使用此物件，執行以下操作。_"

```kotlin
fun main() {
//sampleStart
    val numbers = mutableListOf("one", "two", "three")
    with(numbers) {
        println("'with' is called with argument $this")
        println("It contains $size elements")
    }
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

您也可以使用 `with` 引入一個輔助物件，其屬性或函數用於計算值。

```kotlin
fun main() {
//sampleStart
    val numbers = mutableListOf("one", "two", "three")
    val firstAndLast = with(numbers) {
        "The first element is ${first()}," +
        " the last element is ${last()}"
    }
    println(firstAndLast)
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

### run

- **上下文物件**作為接收者 (`this`) 可用。
- **回傳值**是 lambda 結果。

[`run`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/run.html) 的作用與 `with` 相同，但它被實現為擴充函數。因此，像 `let` 一樣，您可以使用點運算子 (dot notation) 在上下文物件上呼叫它。

當您的 lambda 既初始化物件又計算回傳值時，`run` 會很有用。

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
    
    // the same code written with let() function:
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

您也可以將 `run` 作為非擴充函數調用。`run` 的非擴充變體沒有上下文物件，但它仍然回傳 lambda 結果。非擴充 `run` 允許您在需要運算式的地方執行多個語句的區塊。在程式碼中，非擴充 `run` 可以讀作 "_執行程式碼區塊並計算結果。_"

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

### apply

- **上下文物件**作為接收者 (`this`) 可用。
- **回傳值**是物件本身。

由於 [`apply`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/apply.html) 回傳上下文物件本身，我們建議您將其用於不回傳值且主要操作接收者物件成員的程式碼區塊。`apply` 最常見的用例是物件配置。此類呼叫可以讀作 "_將以下賦值應用於物件。_"

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

`apply` 的另一個用例是將 `apply` 包含在多個呼叫鏈中以進行更複雜的處理。

### also

- **上下文物件**作為參數 (`it`) 可用。
- **回傳值**是物件本身。

[`also`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/also.html) 對於執行一些將上下文物件作為參數的動作很有用。當動作需要引用物件本身而不是其屬性和函數時，或者當您不想遮蔽 (shadow) 來自外部作用域的 `this` 引用時，請使用 `also`。

當您在程式碼中看到 `also` 時，您可以將其讀作 "_並且也對該物件執行以下操作。_"

```kotlin
fun main() {
//sampleStart
    val numbers = mutableListOf("one", "two", "three")
    numbers
        .also { println("The list elements before adding new one: $it") }
        .add("four")
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

## takeIf 和 takeUnless

除了作用域函數之外，標準函式庫還包含函數 [`takeIf`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/take-if.html) 和 [`takeUnless`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/take-unless.html)。這些函數允許您在呼叫鏈中嵌入物件狀態的檢查。

當與述詞 (predicate) 一起在物件上呼叫時，如果該物件滿足給定的述詞，`takeIf` 會回傳該物件。否則，它回傳 `null`。因此，`takeIf` 是用於單一物件的過濾函數。

`takeUnless` 的邏輯與 `takeIf` 相反。當與述詞一起在物件上呼叫時，如果該物件滿足給定的述詞，`takeUnless` 會回傳 `null`。否則，它回傳物件。

當使用 `takeIf` 或 `takeUnless` 時，物件作為 lambda 參數 (`it`) 可用。

```kotlin
import kotlin.random.*

fun main() {
//sampleStart
    val number = Random.nextInt(100)

    val evenOrNull = number.takeIf { it % 2 == 0 }
    val oddOrNull = number.takeUnless { it % 2 == 0 }
    println("even: $evenOrNull, odd: $oddOrNull")
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

> 當在 `takeIf` 和 `takeUnless` 之後鏈式呼叫其他函數時，不要忘記執行空值檢查 (null check) 或使用安全呼叫 (`?.`)，因為它們的回傳值是可空的 (nullable)。
>
{style="tip"}

```kotlin
fun main() {
//sampleStart
    val str = "Hello"
    val caps = str.takeIf { it.isNotEmpty() }?.uppercase()
   //val caps = str.takeIf { it.isNotEmpty() }.uppercase() //compilation error
    println(caps)
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

`takeIf` 和 `takeUnless` 與作用域函數結合使用時特別有用。例如，您可以將 `takeIf` 和 `takeUnless` 與 `let` 鏈式呼叫，以便在符合給定述詞的物件上執行程式碼區塊。為此，請在物件上呼叫 `takeIf`，然後使用安全呼叫 (`?`) 呼叫 `let`。對於不符合述詞的物件，`takeIf` 會回傳 `null`，並且 `let` 不會被調用。

```kotlin
fun main() {
//sampleStart
    fun displaySubstringPosition(input: String, sub: String) {
        input.indexOf(sub).takeIf { it >= 0 }?.let {
            println("The substring $sub is found in $input.")
            println("Its start position is $it.")
        }
    }

    displaySubstringPosition("010000011", "11")
    displaySubstringPosition("010000011", "12")
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

為了比較，以下是無需使用 `takeIf` 或作用域函數即可編寫相同函數的範例：

```kotlin
fun main() {
//sampleStart
    fun displaySubstringPosition(input: String, sub: String) {
        val index = input.indexOf(sub)
        if (index >= 0) {
            println("The substring $sub is found in $input.")
            println("Its start position is $index.")
        }
    }

    displaySubstringPosition("010000011", "11")
    displaySubstringPosition("010000011", "12")
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}