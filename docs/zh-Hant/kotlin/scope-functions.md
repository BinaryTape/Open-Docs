[//]: # (title: 作用域函式)

Kotlin 標準函式庫包含幾個函式，其唯一目的就是在物件的上下文中執行一個程式碼區塊。當你在一個物件上叫用這類函式並提供一個 [Lambda 運算式](lambdas.md)時，它會形成一個暫時的作用域。在此作用域中，你可以不使用名稱就存取該物件。這類函式被稱為「作用域函式」（Scope functions）。共有五個：[`let`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/let.html)、[`run`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/run.html)、[`with`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/with.html)、[`apply`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/apply.html) 以及 [`also`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/also.html)。

基本上，這些函式執行的動作都相同：在一個物件上執行一個程式碼區塊。不同之處在於這個物件在區塊內如何變得可用，以及整個運算式的結果是什麼。

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

如果你不使用 `let` 來撰寫相同的內容，則必須引入一個新變數，並在每次使用時重複其名稱。

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

作用域函式並沒有引入任何新的技術能力，但它們可以讓你的程式碼更加簡潔且具備更好的可讀性。

由於作用域函式之間有許多相似之處，為你的使用案例選擇正確的函式可能會有些棘手。選擇主要取決於你的意圖以及專案中使用的連貫性。下面我們將詳細說明作用域函式之間的差異及其慣例。

## 函式選擇

為了幫助你針對特定目的選擇正確的作用域函式，我們提供此表來總結它們之間的主要差異。

| 函式 | 物件參考 | 傳回值 | 是否為擴充函式 |
|---|---|---|---|
| [`let`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/let.html) | `it` | Lambda 結果 | 是 |
| [`run`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/run.html) | `this` | Lambda 結果 | 是 |
| [`run`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/run.html) | - | Lambda 結果 | 否：在沒有上下文物件的情況下叫用 |
| [`with`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/with.html) | `this` | Lambda 結果 | 否：將上下文物件作為引數傳入。 |
| [`apply`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/apply.html) | `this` | 上下文物件 | 是 |
| [`also`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/also.html) | `it` | 上下文物件 | 是 |

有關這些函式的詳細資訊已在下方的專門章節中提供。

以下是根據預定目的選擇作用域函式的簡短指南：

* 在非 null 物件上執行 Lambda：`let`
* 在區域作用域中將運算式作為變數引入：`let`
* 物件配置：`apply`
* 物件配置並計算結果：`run`
* 在需要運算式的地方執行陳述式：非擴充型 `run`
* 附加效果：`also`
* 對物件的函式呼叫進行分組：`with`

不同作用域函式的使用案例有所重疊，因此你可以根據專案或團隊使用的特定慣例來選擇要使用的函式。

雖然作用域函式可以讓程式碼更簡潔，但請避免過度使用：這可能會使程式碼難以閱讀並導致錯誤。我們還建議你避免巢狀使用作用域函式，並在鏈式呼叫它們時保持謹慎，因為這很容易讓人對當前的上下文物件以及 `this` 或 `it` 的值感到困惑。

## 差異點

由於作用域函式在本質上非常相似，了解它們之間的差異非常重要。
每個作用域函式之間有兩個主要差異：
* 它們引用上下文物件的方式。
* 它們的傳回值。

### 上下文物件：this 或 it

在傳遞給作用域函式的 Lambda 內部，上下文物件可以透過簡短的引用而不是其實際名稱來存取。每個作用域函式都使用兩種引用上下文物件的方式之一：作為 Lambda [接收者](lambdas.md#function-literals-with-receiver) (`this`) 或作為 Lambda [引數](lambdas.md#lambda-expression-syntax) (`it`)。兩者提供相同的功能，因此我們針對不同使用案例描述了各自的優缺點，並提供了使用建議。

```kotlin
fun main() {
    val str = "Hello"
    // this
    str.run {
        println("字串長度：$length")
        //println("字串長度：${this.length}") // 效果相同
    }

    // it
    str.let {
        println("字串長度是 ${it.length}")
    }
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

#### this

`run`、`with` 和 `apply` 將上下文物件引用為 Lambda [接收者](lambdas.md#function-literals-with-receiver) —— 透過關鍵字 `this`。因此，在它們的 Lambda 中，該物件就像在普通的類別函式中一樣可用。

在大多數情況下，存取接收者物件的成員時可以省略 `this`，使程式碼更簡短。另一方面，如果省略了 `this`，可能很難區分接收者成員與外部物件或函式。因此，對於主要透過叫用物件成員函式或對屬性指派值來操作物件成員的 Lambda，建議將上下文物件作為接收者 (`this`)。

```kotlin
data class Person(var name: String, var age: Int = 0, var city: String = "")

fun main() {
//sampleStart
    val adam = Person("Adam").apply { 
        age = 20                       // 等同於 this.age = 20
        city = "London"
    }
    println(adam)
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

#### it

相應地，`let` 和 `also` 將上下文物件引用為 Lambda [引數](lambdas.md#lambda-expression-syntax)。如果未指定引數名稱，則透過隱式預設名稱 `it` 存取該物件。`it` 比 `this` 更短，且帶有 `it` 的運算式通常更容易閱讀。

然而，在叫用物件的函式或屬性時，你無法像 `this` 那樣隱式地存取該物件。因此，當物件主要用作函式呼叫中的引數時，透過 `it` 存取上下文物件會更好。如果你在程式碼區塊中使用多個變數，使用 `it` 也會更好。

```kotlin
import kotlin.random.Random

fun writeToLog(message: String) {
    println("INFO: $message")
}

fun main() {
//sampleStart
    fun getRandomInt(): Int {
        return Random.nextInt(100).also {
            writeToLog("getRandomInt() 產生的值為 $it")
        }
    }
    
    val i = getRandomInt()
    println(i)
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

下面的範例示範了使用自訂引數名稱 `value` 將上下文物件引用為 Lambda 引數。

```kotlin
import kotlin.random.Random

fun writeToLog(message: String) {
    println("INFO: $message")
}

fun main() {
//sampleStart
    fun getRandomInt(): Int {
        return Random.nextInt(100).also { value ->
            writeToLog("getRandomInt() 產生的值為 $value")
        }
    }
    
    val i = getRandomInt()
    println(i)
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

### 傳回值

作用域函式的傳回結果各不相同：
* `apply` 和 `also` 傳回上下文物件。
* `let`、`run` 和 `with` 傳回 Lambda 結果。

你應該根據程式碼接下來要執行的操作，仔細考慮你需要的傳回值。這有助於你選擇最適合的作用域函式。

#### 上下文物件 

`apply` 和 `also` 的傳回值是上下文物件本身。因此，它們可以作為「附帶步驟」包含在呼叫鏈中：你可以繼續在同一個物件上一個接一個地鏈式呼叫函式。

```kotlin
fun main() {
//sampleStart
    val numberList = mutableListOf<Double>()
    numberList.also { println("正在填寫清單") }
        .apply {
            add(2.71)
            add(3.14)
            add(1.0)
        }
        .also { println("正在排序清單") }
        .sort()
//sampleEnd
    println(numberList)
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

它們也可以用在傳回上下文物件的函式的 return 陳述式中。

```kotlin
import kotlin.random.Random

fun writeToLog(message: String) {
    println("INFO: $message")
}

fun main() {
//sampleStart
    fun getRandomInt(): Int {
        return Random.nextInt(100).also {
            writeToLog("getRandomInt() 產生的值為 $it")
        }
    }
    
    val i = getRandomInt()
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

#### Lambda 結果

`let`、`run` 和 `with` 傳回 Lambda 結果。因此，當你將結果指派給變數、在結果上進行鏈式操作等情況時可以使用它們。

```kotlin
fun main() {
//sampleStart
    val numbers = mutableListOf("one", "two", "three")
    val countEndsWithE = numbers.run { 
        add("four")
        add("five")
        count { it.endsWith("e") }
    }
    println("有 $countEndsWithE 個以 e 結尾的元素。")
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

此外，你可以忽略傳回值，並使用作用域函式為區域變數建立一個暫時的作用域。

```kotlin
fun main() {
//sampleStart
    val numbers = mutableListOf("one", "two", "three")
    with(numbers) {
        val firstItem = first()
        val lastItem = last()        
        println("第一個項目：$firstItem，最後一個項目：$lastItem")
    }
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

## 函式

為了幫助你針對自己的使用案例選擇正確的作用域函式，我們將詳細介紹它們並提供使用建議。從技術上講，作用域函式在許多情況下是可以互換的，因此範例展示了使用它們的慣例。

### let

- **上下文物件** 作為引數 (`it`) 可用。
- **傳回值** 是 Lambda 結果。

[`let`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/let.html) 可用於對呼叫鏈的結果叫用一個或多個函式。例如，以下程式碼列印了對集合進行兩次操作後的結果：

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

使用 `let`，你可以重寫上述範例，這樣就不必將清單操作的結果指派給變數：

```kotlin
fun main() {
//sampleStart
    val numbers = mutableListOf("one", "two", "three", "four", "five")
    numbers.map { it.length }.filter { it > 3 }.let { 
        println(it)
        // 如果需要，可以叫用更多函式
    } 
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

如果傳遞給 `let` 的程式碼區塊包含以 `it` 作為引數的單個函式，則可以使用方法參考 (`::`) 代替 Lambda 引數：

```kotlin
fun main() {
//sampleStart
    val numbers = mutableListOf("one", "two", "three", "four", "five")
    numbers.map { it.length }.filter { it > 3 }.let(::println)
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

`let` 常用於執行包含非 null 值的程式碼區塊。若要對可為 null 的物件執行操作，請對其使用 [安全叫用運算子 `?.`](null-safety.md#safe-call-operator) 並叫用 `let`，將操作放在其 Lambda 中。

```kotlin
fun processNonNullString(str: String) {}

fun main() {
//sampleStart
    val str: String? = "Hello"   
    //processNonNullString(str)       // 編譯錯誤：str 可能為 null
    val length = str?.let { 
        println("在 $it 上叫用 let()")        
        processNonNullString(it)      // OK：'it' 在 '?.let { }' 內部非 null
        it.length
    }
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

你還可以使用 `let` 引入作用域受限的區域變數，以提高程式碼的可讀性。若要為上下文物件定義新變數，請提供其名稱作為 Lambda 引數，以便可以用它來代替預設的 `it`。

```kotlin
fun main() {
//sampleStart
    val numbers = listOf("one", "two", "three", "four")
    val modifiedFirstItem = numbers.first().let { firstItem ->
        println("清單的第一個項目是 '$firstItem'")
        if (firstItem.length >= 5) firstItem else "!" + firstItem + "!"
    }.uppercase()
    println("修改後的第一個項目：'$modifiedFirstItem'")
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

### with

- **上下文物件** 作為接收者 (`this`) 可用。
- **傳回值** 是 Lambda 結果。

由於 [`with`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/with.html) 不是擴充函式：上下文物件作為引數傳遞，但在 Lambda 內部，它作為接收者 (`this`) 可用。

當你不需要使用傳回的結果時，我們建議使用 `with` 叫用上下文物件上的函式。在程式碼中，`with` 可以解讀為「*使用這個物件，執行以下操作。*」

```kotlin
fun main() {
//sampleStart
    val numbers = mutableListOf("one", "two", "three")
    with(numbers) {
        println("'with' 帶著引數 $this 被叫用")
        println("它包含 $size 個元素")
    }
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

你還可以使用 `with` 引入一個輔助物件，其屬性或函式可用於計算某個值。

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

### run

- **上下文物件** 作為接收者 (`this`) 可用。 
- **傳回值** 是 Lambda 結果。

[`run`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/run.html) 的功能與 `with` 相同，但它是作為擴充函式實作的。因此，與 `let` 一樣，你可以使用點符號標法在上下文物件上叫用它。

當你的 Lambda 同時進行物件初始化和計算傳回值時，`run` 非常有用。

```kotlin
class MultiportService(var url: String, var port: Int) {
    fun prepareRequest(): String = "預設請求"
    fun query(request: String): String = "查詢結果 '$request'"
}

fun main() {
//sampleStart
    val service = MultiportService("https://example.kotlinlang.org", 80)

    val result = service.run {
        port = 8080
        query(prepareRequest() + " 至連接埠 $port")
    }
    
    // 使用 let() 函式撰寫的相同程式碼：
    val letResult = service.let {
        it.port = 8080
        it.query(it.prepareRequest() + " 至連接埠 ${it.port}")
    }
//sampleEnd
    println(result)
    println(letResult)
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

你還可以將 `run` 作為非擴充函式叫用。非擴充型變體的 `run` 沒有上下文物件，但它仍然傳回 Lambda 結果。非擴充型 `run` 讓你可以在需要運算式的地方執行包含多個陳述式的區塊。在程式碼中，非擴充型 `run` 可以解讀為「*執行程式碼區塊並計算結果。*」

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

- **上下文物件** 作為接收者 (`this`) 可用。 
- **傳回值** 是物件本身。

由於 [`apply`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/apply.html) 傳回上下文物件本身，我們建議將其用於不傳回值且主要操作接收者物件成員的程式碼區塊。`apply` 最常見的使用案例是物件配置。這類呼叫可以解讀為「*對該物件套用以下指派。*」

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

`apply` 的另一個使用案例是在多個呼叫鏈中包含 `apply` 以進行更複雜的處理。

### also

- **上下文物件** 作為引數 (`it`) 可用。 
- **傳回值** 是物件本身。

[`also`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/also.html) 對於執行某些以上下文物件作為引數的操作非常有用。當操作需要物件的參考而不是其屬性和函式時，或者當你不希望遮蔽來自外層作用域的 `this` 參考時，請使用 `also`。

當你在程式碼中看到 `also` 時，可以將其解讀為「*並且對該物件執行以下操作。*」

```kotlin
fun main() {
//sampleStart
    val numbers = mutableListOf("one", "two", "three")
    numbers
        .also { println("新增項目之前的清單元素：$it") }
        .add("four")
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

## takeIf 與 takeUnless

除了作用域函式外，標準函式庫還包含函式 [`takeIf`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/take-if.html) 和 [`takeUnless`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/take-unless.html)。這些函式讓你可以在呼叫鏈中嵌入物件狀態檢查。

當在一個物件上配合述詞 (Predicate) 叫用時，如果該物件符合指定的述詞，`takeIf` 會傳回該物件。否則，它會傳回 `null`。因此，`takeIf` 是針對單一物件的篩選函式。

`takeUnless` 的邏輯與 `takeIf` 相反。當在一個物件上配合述詞叫用時，如果該物件符合指定的述詞，`takeUnless` 會傳回 `null`。否則，它會傳回該物件。

使用 `takeIf` 或 `takeUnless` 時，該物件作為 Lambda 引數 (`it`) 可用。

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

> 在 `takeIf` 和 `takeUnless` 之後鏈式呼叫其他函式時，別忘了執行 null 檢查或使用安全叫用 (`?.`)，因為它們的傳回值是可為 null 的。
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

`takeIf` 和 `takeUnless` 與作用域函式結合使用特別有效。例如，你可以將 `takeIf` 和 `takeUnless` 與 `let` 鏈式呼叫，以便在符合指定述詞的物件上執行程式碼區塊。為此，請在物件上叫用 `takeIf`，然後使用安全叫用 (`?`) 叫用 `let`。對於不符合述詞的物件，`takeIf` 傳回 `null`，而 `let` 則不會被叫用。

```kotlin
fun main() {
//sampleStart
    fun displaySubstringPosition(input: String, sub: String) {
        input.indexOf(sub).takeIf { it >= 0 }?.let {
            println("在 $input 中找到了子字串 $sub。")
            println("它的起始位置是 $it。")
        }
    }

    displaySubstringPosition("010000011", "11")
    displaySubstringPosition("010000011", "12")
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

為了進行比較，下面是不使用 `takeIf` 或作用域函式撰寫相同函式的範例：

```kotlin
fun main() {
//sampleStart
    fun displaySubstringPosition(input: String, sub: String) {
        val index = input.indexOf(sub)
        if (index >= 0) {
            println("在 $input 中找到了子字串 $sub。")
            println("它的起始位置是 $index。")
        }
    }

    displaySubstringPosition("010000011", "11")
    displaySubstringPosition("010000011", "12")
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}