---
title: "Scope functions"
---
Kotlin 標準函式庫包含多個函數，它們的唯一目的是在物件的上下文中執行一段程式碼區塊。當你在一個物件上呼叫這類函數，並提供一個 [lambda 運算式](lambdas) 時，它會形成一個暫時的作用域 (scope)。在這個作用域中，你可以不用物件的名稱來存取該物件。這類函數稱為 _作用域函數_（scope functions）。共有五個：[`let`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/let.html)、[`run`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/run.html)、[`with`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/with.html)、[`apply`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/apply.html) 和 [`also`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/also.html)。

基本上，這些函數都執行相同的動作：在一個物件上執行一段程式碼區塊。不同之處在於這個物件如何在區塊內部變成可用，以及整個運算式的結果是什麼。

以下是如何使用作用域函數的一個典型範例：

```kotlin
data class Person(var name: String, var age: Int, var city: String) {
    fun moveTo(newCity: String) { city = newCity }
    fun incrementAge() { age++ }
}

fun main() {

    Person("Alice", 20, "Amsterdam").let {
        println(it)
        it.moveTo("London")
        it.incrementAge()
        println(it)
    }

}
```

如果你在沒有 `let` 的情況下編寫相同的程式碼，你必須引入一個新的變數，並且在你每次使用它時重複它的名稱。

```kotlin
data class Person(var name: String, var age: Int, var city: String) {
    fun moveTo(newCity: String) { city = newCity }
    fun incrementAge() { age++ }
}

fun main() {

    val alice = Person("Alice", 20, "Amsterdam")
    println(alice)
    alice.moveTo("London")
    alice.incrementAge()
    println(alice)

}
```

作用域函數不會引入任何新的技術能力，但它們可以使你的程式碼更簡潔和更易讀。

由於作用域函數之間有很多相似之處，因此為你的使用情境選擇正確的一個可能會很棘手。選擇主要取決於你的意圖以及在你的專案中使用的一致性。下面，我們提供了作用域函數之間差異及其慣例的詳細描述。

## 函數選擇

為了幫助你為你的目的選擇正確的作用域函數，我們提供這個表格，總結它們之間的關鍵差異。

| 函數 |物件參考|返回值|是擴展函數嗎 (Is extension function)|
|---|---|---|---|
| [`let`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/let.html) |`it`|Lambda 結果|是 (Yes)|
| [`run`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/run.html) |`this`|Lambda 結果|是 (Yes)|
| [`run`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/run.html) |-|Lambda 結果|否 (No)：在沒有上下文物件的情況下呼叫|
| [`with`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/with.html) |`this`|Lambda 結果|否 (No)：將上下文物件作為參數。|
| [`apply`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/apply.html) |`this`|上下文物件|是 (Yes)|
| [`also`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/also.html) |`it`|上下文物件|是 (Yes)|

有關這些函數的詳細資訊，請參閱下面的專門章節。

以下是根據預期目的選擇作用域函數的簡短指南：

* 在不可為 null 的物件上執行 lambda：`let`
* 在本地作用域中引入一個運算式作為變數：`let`
* 物件配置：`apply`
* 物件配置和計算結果：`run`
* 執行需要運算式的語句：非擴展 `run`
* 額外效果：`also`
* 對物件進行分組函數呼叫：`with`

不同作用域函數的使用案例有所重疊，因此你可以根據你的專案或團隊中使用的特定慣例來選擇要使用的函數。

雖然作用域函數可以使你的程式碼更簡潔，但要避免過度使用它們：它會使你的程式碼難以閱讀並導致錯誤。我們還建議你避免巢狀作用域函數，並在鏈式調用它們時小心，因為很容易對當前上下文物件和 `this` 或 `it` 的值感到困惑。

## 區別

由於作用域函數在性質上相似，因此理解它們之間的區別非常重要。每個作用域函數之間有兩個主要區別：
* 它們引用上下文物件的方式。
* 它們的返回值。

### 上下文物件：this 或 it

在傳遞給作用域函數的 lambda 內部，上下文物件可透過一個簡短的參考（reference）而不是其實際名稱來使用。每個作用域函數使用兩種方式之一來參考上下文物件：作為一個 lambda [接收者](lambdas#function-literals-with-receiver) (`this`) 或作為一個 lambda 參數 (`it`)。兩者都提供相同的功能，因此我們描述每種方式在不同使用案例中的優缺點，並提供它們的使用建議。

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

#### this

`run`、`with` 和 `apply` 將上下文物件作為一個 lambda [接收者](lambdas#function-literals-with-receiver) 來參考 - 透過關鍵字 `this`。因此，在它們的 lambda 中，物件可用，就像它在普通的類別函數中一樣。

在大多數情況下，你可以在存取接收者物件的成員時省略 `this`，使程式碼更短。另一方面，如果省略 `this`，則可能難以區分接收者成員和外部物件或函數。因此，建議將上下文物件作為接收者 (`this`) 用於主要透過呼叫其函數或將值賦給屬性來操作物件成員的 lambda。

```kotlin
data class Person(var name: String, var age: Int = 0, var city: String = "")

fun main() {

    val adam = Person("Adam").apply { 
        age = 20                       // same as this.age = 20
        city = "London"
    }
    println(adam)

}
```

#### it

反過來，`let` 和 `also` 將上下文物件作為一個 lambda [參數](lambdas#lambda-expression-syntax) 來參考。如果未指定參數名稱，則透過隱式預設名稱 `it` 存取物件。`it` 比 `this` 更短，並且帶有 `it` 的運算式通常更容易閱讀。

但是，當呼叫物件的函數或屬性時，你沒有像 `this` 一樣隱式可用的物件。因此，當物件主要用作函數呼叫中的參數時，透過 `it` 存取上下文物件會更好。如果你在程式碼區塊中使用多個變數，`it` 也會更好。

```kotlin
import kotlin.random.Random

fun writeToLog(message: String) {
    println("INFO: $message")
}

fun main() {

    fun getRandomInt(): Int {
        return Random.nextInt(100).also {
            writeToLog("getRandomInt() generated value $it")
        }
    }
    
    val i = getRandomInt()
    println(i)

}
```

下面的範例示範了如何使用參數名稱 `value` 將上下文物件作為一個 lambda 參數來參考。

```kotlin
import kotlin.random.Random

fun writeToLog(message: String) {
    println("INFO: $message")
}

fun main() {

    fun getRandomInt(): Int {
        return Random.nextInt(100).also { value `->`
            writeToLog("getRandomInt() generated value $value")
        }
    }
    
    val i = getRandomInt()
    println(i)

}
```

### 返回值

作用域函數的返回值不同：
* `apply` 和 `also` 返回上下文物件。
* `let`、`run` 和 `with` 返回 lambda 結果。

你應該仔細考慮你想要的返回值，基於你接下來想在你的程式碼中做什麼。這有助於你選擇要使用的最佳作用域函數。

#### 上下文物件

`apply` 和 `also` 的返回值是上下文物件本身。因此，它們可以作為 _側步驟_（side steps）包含到呼叫鏈中：你可以繼續在同一個物件上鏈式調用函數，一個接一個。

```kotlin
fun main() {

    val numberList = mutableListOf<Double>()
    numberList.also { println("Populating the list") }
        .apply {
            add(2.71)
            add(3.14)
            add(1.0)
        }
        .also { println("Sorting the list") }
        .sort()

    println(numberList)
}
```

它們也可以用在返回上下文物件的函數的 return 語句中。

```kotlin
import kotlin.random.Random

fun writeToLog(message: String) {
    println("INFO: $message")
}

fun main() {

    fun getRandomInt(): Int {
        return Random.nextInt(100).also {
            writeToLog("getRandomInt() generated value $it")
        }
    }
    
    val i = getRandomInt()

}
```

#### Lambda 結果

`let`、`run` 和 `with` 返回 lambda 結果。因此，你可以在將結果賦給變數、鏈式調用結果上的操作等等情況下使用它們。

```kotlin
fun main() {

    val numbers = mutableListOf("one", "two", "three")
    val countEndsWithE = numbers.run { 
        add("four")
        add("five")
        count { it.endsWith("e") }
    }
    println("There are $countEndsWithE elements that end with e.")

}
```

此外，你可以忽略返回值，並使用作用域函數為本地變數建立一個臨時作用域。

```kotlin
fun main() {

    val numbers = mutableListOf("one", "two", "three")
    with(numbers) {
        val firstItem = first()
        val lastItem = last()        
        println("First item: $firstItem, last item: $lastItem")
    }

}
```

## 函數

為了幫助你為你的使用情境選擇正確的作用域函數，我們詳細描述它們並提供使用建議。從技術上講，作用域函數在許多情況下是可以互換的，因此這些範例展示了使用它們的慣例。

### let

- **上下文物件** 可作為參數 (`it`) 使用。
- **返回值** 是 lambda 結果。

[`let`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/let.html) 可用於在呼叫鏈的結果上呼叫一個或多個函數。例如，以下程式碼印出對集合執行的兩個操作的結果：

```kotlin
fun main() {

    val numbers = mutableListOf("one", "two", "three", "four", "five")
    val resultList = numbers.map { it.length }.filter { it > 3 }
    println(resultList)    

}
```

使用 `let`，你可以重寫上面的範例，這樣你就不會將列表操作的結果賦給一個變數：

```kotlin
fun main() {

    val numbers = mutableListOf("one", "two", "three", "four", "five")
    numbers.map { it.length }.filter { it > 3 }.let { 
        println(it)
        // and more function calls if needed
    } 

}
```

如果傳遞給 `let` 的程式碼區塊包含一個帶有 `it` 作為參數的單個函數，則可以使用方法參考 (`::`) 代替 lambda 參數：

```kotlin
fun main() {

    val numbers = mutableListOf("one", "two", "three", "four", "five")
    numbers.map { it.length }.filter { it > 3 }.let(::println)

}
```

`let` 通常用於執行包含非 null 值的程式碼區塊。要在非 null 物件上執行操作，請在其上使用 [安全呼叫運算符 `?.`](null-safety#safe-call-operator) 並使用 lambda 中的操作呼叫 `let`。

```kotlin
fun processNonNullString(str: String) {}

fun main() {

    val str: String? = "Hello"   
    //processNonNullString(str)       // compilation error: str can be null
    val length = str?.let { 
        println("let() called on $it")        
        processNonNullString(it)      // OK: 'it' is not null inside '?.let { }'
        it.length
    }

}
```

你也可以使用 `let` 引入具有有限作用域的本地變數，使你的程式碼更易於閱讀。要為上下文物件定義一個新變數，請將其名稱作為 lambda 參數提供，以便可以使用它來代替預設的 `it`。

```kotlin
fun main() {

    val numbers = listOf("one", "two", "three", "four")
    val modifiedFirstItem = numbers.first().let { firstItem `->`
        println("The first item of the list is '$firstItem'")
        if (firstItem.length >= 5) firstItem else "!" + firstItem + "!"
    }.uppercase()
    println("First item after modifications: '$modifiedFirstItem'")

}
```

### with

- **上下文物件** 可作為接收者 (`this`) 使用。
- **返回值** 是 lambda 結果。

由於 [`with`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/with.html) 不是一個擴展函數：上下文物件作為一個參數傳遞，但在 lambda 內部，它可以作為一個接收者 (`this`) 使用。

我們建議在呼叫上下文物件上的函數時使用 `with`，當你不需要使用返回的結果時。在程式碼中，`with` 可以讀作 "_使用這個物件，執行以下操作_"。

```kotlin
fun main() {

    val numbers = mutableListOf("one", "two", "three")
    with(numbers) {
        println("'with' is called with argument $this")
        println("It contains $size elements")
    }

}
```

你也可以使用 `with` 引入一個輔助物件，其屬性或函數用於計算一個值。

```kotlin
fun main() {

    val numbers = mutableListOf("one", "two", "three")
    val firstAndLast = with(numbers) {
        "The first element is ${first()}," +
        " the last element is ${last()}"
    }
    println(firstAndLast)

}
```

### run

- **上下文物件** 可作為接收者 (`this`) 使用。
- **返回值** 是 lambda 結果。

[`run`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/run.html) 的作用與 `with` 相同，但它是作為一個擴展函數實現的。所以像 `let` 一樣，你可以使用點表示法在上下文物件上呼叫它。

當你的 lambda 既初始化物件又計算返回值時，`run` 很有用。

```kotlin
class MultiportService(var url: String, var port: Int) {
    fun prepareRequest(): String = "Default request"
    fun query(request: String): String = "Result for query '$request'"
}

fun main() {

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

    println(result)
    println(letResult)
}
```

你也可以將 `run` 作為一個非擴展函數呼叫。`run` 的非擴展變體沒有上下文物件，但它仍然返回 lambda 結果。非擴展 `run` 讓你可以在需要運算式的地方執行一個包含多個語句的區塊。在程式碼中，非擴展 `run` 可以讀作 "_執行程式碼區塊並計算結果_"。

```kotlin
fun main() {

    val hexNumberRegex = run {
        val digits = "0-9"
        val hexDigits = "A-Fa-f"
        val sign = "+-"
        
        Regex("[$sign]?[$digits$hexDigits]+")
    }
    
    for (match in hexNumberRegex.findAll("+123 -FFFF !%*& 88 XYZ")) {
        println(match.value)
    }

}
```

### apply

- **上下文物件** 可作為接收者 (`this`) 使用。
- **返回值** 是物件本身。

由於 [`apply`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/apply.html) 返回上下文物件本身，我們建議你將它用於不返回值的程式碼區塊，並且主要操作接收者物件的成員。`apply` 最常見的使用案例是物件配置。這樣的呼叫可以讀作 "_將以下賦值應用於物件_"。

```kotlin
data class Person(var name: String, var age: Int = 0, var city: String = "")

fun main() {

    val adam = Person("Adam").apply {
        age = 32
        city = "London"        
    }
    println(adam)

}
```

`apply` 的另一個用例是將 `apply` 包含在多個呼叫鏈中，以進行更複雜的處理。

### also

- **上下文物件** 可作為參數 (`it`) 使用。
- **返回值** 是物件本身。

[`also`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/also.html) 用於執行一些將上下文物件作為參數的操作。將 `also` 用於需要物件參考而不是其屬性和函數的操作，或者當你不想從外部作用域中遮蔽 `this` 參考時。

當你在程式碼中看到 `also` 時，你可以將它讀作 "_並且也對物件執行以下操作_"。

```kotlin
fun main() {

    val numbers = mutableListOf("one", "two", "three")
    numbers
        .also { println("The list elements before adding new one: $it") }
        .add("four")

}
```

## takeIf 和 takeUnless

除了作用域函數之外，標準函式庫還包含函數 [`takeIf`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/take-if.html) 和 [`takeUnless`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/take-unless.html)。這些函數讓你可以在呼叫鏈中嵌入對物件狀態的檢查。

當與謂詞一起在物件上呼叫時，如果物件滿足給定的謂詞，`takeIf` 將返回此物件。否則，它返回 `null`。因此，`takeIf` 是一個用於單個物件的篩選函數。

`takeUnless` 具有與 `takeIf` 相反的邏輯。當與謂詞一起在物件上呼叫時，如果物件滿足給定的謂詞，`takeUnless` 將返回 `null`。否則，它返回物件。

當使用 `takeIf` 或 `takeUnless` 時，物件可作為 lambda 參數 (`it`) 使用。

```kotlin
import kotlin.random.*

fun main() {

    val number = Random.nextInt(100)

    val evenOrNull = number.takeIf { it % 2 == 0 }
    val oddOrNull = number.takeUnless { it % 2 == 0 }
    println("even: $evenOrNull, odd: $oddOrNull")

}
```

:::tip
在 `takeIf` 和 `takeUnless` 之後鏈式調用其他函數時，不要忘記執行 null 檢查或使用安全呼叫 (`?.`)，因為它們的返回值是可為 null 的。

:::

```kotlin
fun main() {

    val str = "Hello"
    val caps = str.takeIf { it.isNotEmpty() }?.uppercase()
   //val caps = str.takeIf { it.isNotEmpty() }.uppercase() //compilation error
    println(caps)

}
```

`takeIf` 和 `takeUnless` 在與作用域函數結合使用時特別有用。例如，你可以將 `takeIf` 和 `takeUnless` 與 `let` 鏈式調用，以在與給定謂詞匹配的物件上執行程式碼區塊。為此，在物件上呼叫 `takeIf`，然後使用安全呼叫 (`?`) 呼叫 `let`。對於不符合謂詞的物件，`takeIf` 返回 `null` 並且不呼叫 `let`。

```kotlin
fun main() {

    fun displaySubstringPosition(input: String, sub: String) {
        input.indexOf(sub).takeIf { it >= 0 }?.let {
            println("The substring $sub is found in $input.")
            println("Its start position is $it.")
        }
    }

    displaySubstringPosition("010000011", "11")
    displaySubstringPosition("010000011", "12")

}
```

為了比較，以下是可以在不使用 `takeIf` 或作用域函數的情況下編寫相同函數的範例：

```kotlin
fun main() {

    fun displaySubstringPosition(input: String, sub: String) {
        val index = input.indexOf(sub)
        if (index >= 0) {
            println("The substring $sub is found in $input.")
            println("Its start position is $index.")
        }
    }

    displaySubstringPosition("010000011", "11")
    displaySubstringPosition("010000011", "12")

}
```