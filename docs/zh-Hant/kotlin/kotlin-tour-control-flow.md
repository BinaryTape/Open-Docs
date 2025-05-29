[//]: # (title: 控制流程)

<no-index/>

<tldr>
    <p><img src="icon-1-done.svg" width="20" alt="第一步" /> <a href="kotlin-tour-hello-world.md">Hello world</a><br />
        <img src="icon-2-done.svg" width="20" alt="第二步" /> <a href="kotlin-tour-basic-types.md">基本類型</a><br />
        <img src="icon-3-done.svg" width="20" alt="第三步" /> <a href="kotlin-tour-collections.md">集合</a><br />
        <img src="icon-4.svg" width="20" alt="第四步" /> <strong>控制流程</strong><br />
        <img src="icon-5-todo.svg" width="20" alt="第五步" /> <a href="kotlin-tour-functions.md">函式</a><br />
        <img src="icon-6-todo.svg" width="20" alt="第六步" /> <a href="kotlin-tour-classes.md">類別</a><br />
        <img src="icon-7-todo.svg" width="20" alt="最後一步" /> <a href="kotlin-tour-null-safety.md">空安全</a></p>
</tldr>

與其他程式語言一樣，Kotlin 能夠根據一段程式碼是否評估為真來做出決策。這些程式碼片段稱為 **條件運算式**。Kotlin 也S能建立和迭代迴圈。

## 條件運算式

Kotlin 提供 `if` 和 `when` 來檢查條件運算式。 

> 如果您必須在 `if` 和 `when` 之間做選擇，我們建議使用 `when`，因為它：
> 
> * 使您的程式碼更易於閱讀。
> * 更容易新增另一個分支。
> * 減少程式碼中的錯誤。
> 
{style="note"}

### If

要使用 `if`，請將條件運算式新增到小括號 `()` 內，並將結果為真時要執行的動作新增到大括號 `{}` 內：

```kotlin
fun main() {
//sampleStart
    val d: Int
    val check = true

    if (check) {
        d = 1
    } else {
        d = 2
    }

    println(d)
    // 1
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-if"}

Kotlin 中沒有三元運算子 `condition ? then : else`。相反地，`if` 可以作為運算式使用。如果每個動作只有一行程式碼，則大括號 `{}` 是可選的：

```kotlin
fun main() { 
//sampleStart
    val a = 1
    val b = 2

    println(if (a > b) a else b) // Returns a value: 2
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-if-expression"}

### When

當您有多個分支的條件運算式時，請使用 `when`。

要使用 `when`：

* 將您要評估的值放在小括號 `()` 內。
* 將分支放在大括號 `{}` 內。
* 在每個分支中使用 `->` 來分隔每個檢查與檢查成功時要採取的動作。

`when` 可以作為陳述式或運算式使用。**陳述式** 不會傳回任何內容，而是執行動作。

以下是將 `when` 作為陳述式使用的範例：

```kotlin
fun main() {
//sampleStart
    val obj = "Hello"

    when (obj) {
        // Checks whether obj equals to "1"
        "1" -> println("One")
        // Checks whether obj equals to "Hello"
        "Hello" -> println("Greeting")
        // Default statement
        else -> println("Unknown")     
    }
    // Greeting
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-when-statement"}

> 請注意，所有分支條件都會依序檢查，直到其中一個條件滿足為止。因此，只有第一個合適的分支會被執行。
>
{style="note"}

**運算式** 會傳回一個值，您可以在程式碼中稍後使用該值。

以下是將 `when` 作為運算式使用的範例。`when` 運算式會立即指派給一個變數，該變數稍後會與 `println()` 函式一起使用：

```kotlin
fun main() {
//sampleStart    
    val obj = "Hello"    
    
    val result = when (obj) {
        // If obj equals "1", sets result to "one"
        "1" -> "One"
        // If obj equals "Hello", sets result to "Greeting"
        "Hello" -> "Greeting"
        // Sets result to "Unknown" if no previous condition is satisfied
        else -> "Unknown"
    }
    println(result)
    // Greeting
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-when-expression"}

您目前為止看到的 `when` 範例都帶有主體：`obj`。但 `when` 也可以在沒有主體的情況下使用。

此範例使用不帶主體的 `when` 運算式來檢查一系列布林運算式：

```kotlin
fun main() {
    val trafficLightState = "Red" // This can be "Green", "Yellow", or "Red"

    val trafficAction = when {
        trafficLightState == "Green" -> "Go"
        trafficLightState == "Yellow" -> "Slow down"
        trafficLightState == "Red" -> "Stop"
        else -> "Malfunction"
    }

    println(trafficAction)
    // Stop
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-when-expression-boolean"}

不過，您可以擁有相同的程式碼，但將 `trafficLightState` 作為主體：

```kotlin
fun main() {
    val trafficLightState = "Red" // This can be "Green", "Yellow", or "Red"

    val trafficAction = when (trafficLightState) {
        "Green" -> "Go"
        "Yellow" -> "Slow down"
        "Red" -> "Stop"
        else -> "Malfunction"
    }

    println(trafficAction)  
    // Stop
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-when-expression-boolean-subject"}

使用帶有主體的 `when` 使您的程式碼更易於閱讀和維護。當您使用主體與 `when` 運算式時，它也有助於 Kotlin 檢查是否涵蓋了所有可能的情況。否則，如果您在 `when` 運算式中不使用主體，則需要提供一個 else 分支。

## 條件運算式練習

### 練習 1 {initial-collapse-state="collapsed" collapsible="true" id="conditional-expressions-exercise-1"}

建立一個簡單的遊戲，如果您擲出兩個相同的數字則獲勝。使用 `if` 語句在骰子匹配時列印 `You win :)`，否則列印 `You lose :(`。

> 在此練習中，您匯入一個套件，以便可以使用 `Random.nextInt()` 函式來取得隨機的 `Int`。有關匯入套件的更多資訊，請參閱 [套件與匯入](packages.md)。
>
{style="tip"}

<deflist collapsible="true">
    <def title="提示">
        使用 <a href="operator-overloading.md#equality-and-inequality-operators">相等運算子</a> (<code>==</code>) 來比較骰子結果。 
    </def>
</deflist>

|---|---|
```kotlin
import kotlin.random.Random

fun main() {
    val firstResult = Random.nextInt(6)
    val secondResult = Random.nextInt(6)
    // Write your code here
}
```
{validate="false" kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-control-flow-conditional-exercise-1"}

|---|---|
```kotlin
import kotlin.random.Random

fun main() {
    val firstResult = Random.nextInt(6)
    val secondResult = Random.nextInt(6)
    if (firstResult == secondResult)
        println("You win :)")
    else
        println("You lose :(")
}
```
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="範例解答" id="kotlin-tour-control-flow-conditional-solution-1"}

### 練習 2 {initial-collapse-state="collapsed" collapsible="true" id="conditional-expressions-exercise-2"}

使用 `when` 運算式，更新以下程式，使其在您輸入遊戲機按鈕名稱時列印相應的動作。

| **按鈕** | **動作**             |
|------------|------------------------|
| A          | Yes                    |
| B          | No                     |
| X          | Menu                   |
| Y          | Nothing                |
| 其他      | 沒有此按鈕 |

|---|---|
```kotlin
fun main() {
    val button = "A"

    println(
        // Write your code here
    )
}
```
{validate="false" kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-control-flow-conditional-exercise-2"}

|---|---|
```kotlin
fun main() {
    val button = "A"
    
    println(
        when (button) {
            "A" -> "Yes"
            "B" -> "No"
            "X" -> "Menu"
            "Y" -> "Nothing"
            else -> "There is no such button"
        }
    )
}
```
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="範例解答" id="kotlin-tour-control-flow-conditional-solution-2"}

## 範圍

在討論迴圈之前，了解如何建構迴圈要迭代的範圍會很有用。

在 Kotlin 中建立範圍最常見的方式是使用 `..` 運算子。例如，`1..4` 等同於 `1, 2, 3, 4`。

要宣告不包含結束值的範圍，請使用 `..<` 運算子。例如，`1..<4` 等同於 `1, 2, 3`。

要宣告反向順序的範圍，請使用 `downTo`。例如，`4 downTo 1` 等同於 `4, 3, 2, 1`。

要宣告以非 1 的步長遞增的範圍，請使用 `step` 和您期望的遞增值。例如，`1..5 step 2` 等同於 `1, 3, 5`。

您也可以對 `Char` 範圍執行相同的操作：

* `'a'..'d'` 等同於 `'a', 'b', 'c', 'd'`
* `'z' downTo 's' step 2` 等同於 `'z', 'x', 'v', 't'`

## 迴圈

程式設計中最常見的兩種迴圈結構是 `for` 和 `while`。使用 `for` 來迭代值範圍並執行動作。使用 `while` 來持續執行動作直到滿足特定條件。

### For

利用您對範圍的新知識，您可以建立一個 `for` 迴圈，該迴圈會迭代 1 到 5 的數字並每次列印該數字。

將迭代器和範圍放在小括號 `()` 內，並使用關鍵字 `in`。將您要完成的動作新增到大括號 `{}` 內：

```kotlin
fun main() {
//sampleStart
    for (number in 1..5) { 
        // number is the iterator and 1..5 is the range
        print(number)
    }
    // 12345
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-for-loop"}

集合也可以透過迴圈迭代：

```kotlin
fun main() { 
//sampleStart
    val cakes = listOf("carrot", "cheese", "chocolate")

    for (cake in cakes) {
        println("Yummy, it's a $cake cake!")
    }
    // Yummy, it's a carrot cake!
    // Yummy, it's a cheese cake!
    // Yummy, it's a chocolate cake!
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-for-collection-loop"}

### While

`while` 可以透過兩種方式使用：

  * 在條件運算式為真時執行程式碼區塊。(`while`)
  * 先執行程式碼區塊，然後檢查條件運算式。(`do-while`)

在第一種使用情況 (`while`) 中：

* 將 `while` 迴圈繼續執行的條件運算式宣告在小括號 `()` 內。 
* 將您要完成的動作新增到大括號 `{}` 內。

> 以下範例使用 [遞增運算子](operator-overloading.md#increments-and-decrements) `++` 來遞增 `cakesEaten` 變數的值。
>
{style="tip"}

```kotlin
fun main() {
//sampleStart
    var cakesEaten = 0
    while (cakesEaten < 3) {
        println("Eat a cake")
        cakesEaten++
    }
    // Eat a cake
    // Eat a cake
    // Eat a cake
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-while-loop"}

在第二種使用情況 (`do-while`) 中：

* 將 `while` 迴圈繼續執行的條件運算式宣告在小括號 `()` 內。
* 使用關鍵字 `do`，在大括號 `{}` 內定義您要完成的動作。

```kotlin
fun main() {
//sampleStart
    var cakesEaten = 0
    var cakesBaked = 0
    while (cakesEaten < 3) {
        println("Eat a cake")
        cakesEaten++
    }
    do {
        println("Bake a cake")
        cakesBaked++
    } while (cakesBaked < cakesEaten)
    // Eat a cake
    // Eat a cake
    // Eat a cake
    // Bake a cake
    // Bake a cake
    // Bake a cake
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-while-do-loop"}

有關條件運算式和迴圈的更多資訊和範例，請參閱 [條件與迴圈](control-flow.md)。

現在您已了解 Kotlin 控制流程的基礎知識，是時候學習如何編寫您自己的 [函式](kotlin-tour-functions.md) 了。

## 迴圈練習

### 練習 1 {initial-collapse-state="collapsed" collapsible="true" id="loops-exercise-1"}

您有一個程式可以計算披薩切片，直到有完整的一個 8 片披薩。請透過兩種方式重構此程式：

* 使用 `while` 迴圈。
* 使用 `do-while` 迴圈。

|---|---|
```kotlin
fun main() {
    var pizzaSlices = 0
    // Start refactoring here
    pizzaSlices++
    println("There's only $pizzaSlices slice/s of pizza :(")
    pizzaSlices++
    println("There's only $pizzaSlices slice/s of pizza :(")
    pizzaSlices++
    println("There's only $pizzaSlices slice/s of pizza :(")
    pizzaSlices++
    println("There's only $pizzaSlices slice/s of pizza :(")
    pizzaSlices++
    println("There's only $pizzaSlices slice/s of pizza :(")
    pizzaSlices++
    println("There's only $pizzaSlices slice/s of pizza :(")
    pizzaSlices++
    println("There's only $pizzaSlices slice/s of pizza :(")
    pizzaSlices++
    // End refactoring here
    println("There are $pizzaSlices slices of pizza. Hooray! We have a whole pizza! :D")
}
```
{validate="false" kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-control-flow-loops-exercise-1"}

|---|---|
```kotlin
fun main() {
    var pizzaSlices = 0
    while ( pizzaSlices < 7 ) {
        pizzaSlices++
        println("There's only $pizzaSlices slice/s of pizza :(")
    }
    pizzaSlices++
    println("There are $pizzaSlices slices of pizza. Hooray! We have a whole pizza! :D")
}
```
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="範例解答 1" id="kotlin-tour-control-flow-loops-exercise-1-solution-1"}

|---|---|
```kotlin
fun main() {
    var pizzaSlices = 0
    pizzaSlices++
    do {
        println("There's only $pizzaSlices slice/s of pizza :(")
        pizzaSlices++
    } while ( pizzaSlices < 8 )
    println("There are $pizzaSlices slices of pizza. Hooray! We have a whole pizza! :D")
}

```
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="範例解答 2" id="kotlin-tour-control-flow-loops-exercise-1-solution-2"}

### 練習 2 {initial-collapse-state="collapsed" collapsible="true" id="loops-exercise-2"}

編寫一個程式來模擬 [Fizz buzz](https://en.wikipedia.org/wiki/Fizz_buzz) 遊戲。您的任務是遞增列印從 1 到 100 的數字，將任何可被三整除的數字替換為「fizz」，將任何可被五整除的數字替換為「buzz」。任何同時可被 3 和 5 整除的數字必須替換為「fizzbuzz」。

<deflist collapsible="true">
    <def title="提示 1">
        使用 <code>for</code> 迴圈來計數，並使用 <code>when</code> 運算式來決定每個步驟要列印什麼。 
    </def>
</deflist>

<deflist collapsible="true">
    <def title="提示 2">
        使用模數運算子 (<code>%</code>) 來傳回數字被除後的餘數。使用 <a href="operator-overloading.md#equality-and-inequality-operators">相等運算子</a> (<code>==</code>) 來檢查餘數是否等於零。
    </def>
</deflist>

|---|---|
```kotlin
fun main() {
    // Write your code here
}
```
{validate="false" kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-control-flow-loops-exercise-2"}

|---|---|
```kotlin
fun main() {
    for (number in 1..100) {
        println(
            when {
                number % 15 == 0 -> "fizzbuzz"
                number % 3 == 0 -> "fizz"
                number % 5 == 0 -> "buzz"
                else -> "$number"
            }
        )
    }
}
```
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="範例解答" id="kotlin-tour-control-flow-loops-solution-2"}

### 練習 3 {initial-collapse-state="collapsed" collapsible="true" id="loops-exercise-3"}

您有一個單字列表。使用 `for` 和 `if` 只列印以字母 `l` 開頭的單字。

<deflist collapsible="true">
    <def title="提示">
        使用 <a href="https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/starts-with.html"> <code>.startsWith()</code> </a> 函式處理 <code>String</code> 類型。 
    </def>
</deflist>

|---|---|
```kotlin
fun main() {
    val words = listOf("dinosaur", "limousine", "magazine", "language")
    // Write your code here
}
```
{validate="false" kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-control-flow-loops-exercise-3"}

|---|---|
```kotlin
fun main() {
    val words = listOf("dinosaur", "limousine", "magazine", "language")
    for (w in words) {
        if (w.startsWith("l"))
            println(w)
    }
}
```
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="範例解答" id="kotlin-tour-control-flow-loops-solution-3"}

## 下一步

[函式](kotlin-tour-functions.md)