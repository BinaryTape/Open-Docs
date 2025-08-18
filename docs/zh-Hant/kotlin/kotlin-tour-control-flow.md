[//]: # (title: 控制流程)

<no-index/>

<tldr>
    <p><img src="icon-1-done.svg" width="20" alt="第一步" /> <a href="kotlin-tour-hello-world.md">嗨，世界</a><br />
        <img src="icon-2-done.svg" width="20" alt="第二步" /> <a href="kotlin-tour-basic-types.md">基本型別</a><br />
        <img src="icon-3-done.svg" width="20" alt="第三步" /> <a href="kotlin-tour-collections.md">集合</a><br />
        <img src="icon-4.svg" width="20" alt="第四步" /> <strong>控制流程</strong><br />
        <img src="icon-5-todo.svg" width="20" alt="第五步" /> <a href="kotlin-tour-functions.md">函式</a><br />
        <img src="icon-6-todo.svg" width="20" alt="第六步" /> <a href="kotlin-tour-classes.md">類別</a><br />
        <img src="icon-7-todo.svg" width="20" alt="最後一步" /> <a href="kotlin-tour-null-safety.md">空值安全</a></p>
</tldr>

就像其他程式語言一樣，Kotlin 能夠根據一段程式碼是否評估為真來做出決策。這類程式碼稱為**條件表達式**。Kotlin 也支援建立和迭代迴圈。

## 條件表達式

Kotlin 提供了 `if` 和 `when` 來檢查條件表達式。

> 如果您必須在 `if` 和 `when` 之間做選擇，我們建議使用 `when`，因為它：
>
> * 讓您的程式碼更容易閱讀。
> * 讓添加其他分支更容易。
> * 減少程式碼中的錯誤。
>
{style="note"}

### If

要使用 `if`，請將條件表達式置於圓括號 `()` 內，並將結果為真時要執行的動作置於花括號 `{}` 內：

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

Kotlin 中沒有三元運算子 `condition ? then : else`。相反地，`if` 可以作為表達式使用。如果每個動作只有一行程式碼，則花括號 `{}` 是可選的：

```kotlin
fun main() {
//sampleStart
    val a = 1
    val b = 2

    println(if (a > b) a else b) // 返回值：2
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-if-expression"}

### When

當您有多個分支的條件表達式時，請使用 `when`。

要使用 `when`：

* 將您要評估的值置於圓括號 `()` 內。
* 將分支置於花括號 `{}` 內。
* 在每個分支中使用 `->`，將每個檢查與檢查成功時要執行的動作分開。

`when` 可以用作陳述式或表達式。**陳述式**不返回任何內容，而是執行動作。

以下是將 `when` 作為陳述式使用的範例：

```kotlin
fun main() {
//sampleStart
    val obj = "Hello"

    when (obj) {
        // 檢查 obj 是否等於 "1"
        "1" -> println("One")
        // 檢查 obj 是否等於 "Hello"
        "Hello" -> println("Greeting")
        // 預設陳述式
        else -> println("Unknown")
    }
    // Greeting
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-when-statement"}

> 請注意，所有分支條件都會依序檢查，直到其中一個條件符合為止。因此，只會執行第一個符合的分支。
>
{style="note"}

**表達式**返回一個值，該值可以在您的程式碼中稍後使用。

以下是將 `when` 作為表達式使用的範例。`when` 表達式會立即指派給一個變數，該變數稍後會與 `println()` 函式一起使用：

```kotlin
fun main() {
//sampleStart
    val obj = "Hello"

    val result = when (obj) {
        // 如果 obj 等於 "1"，將 result 設定為 "One"
        "1" -> "One"
        // 如果 obj 等於 "Hello"，將 result 設定為 "Greeting"
        // 如果先前的條件都不符合，將 result 設定為 "Unknown"
        else -> "Unknown"
    }
    println(result)
    // Greeting
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-when-expression"}

到目前為止您所看到的 `when` 範例都帶有主語：`obj`。但是 `when` 也可以在沒有主語的情況下使用。

此範例使用沒有主語的 `when` 表達式來檢查一連串布林表達式：

```kotlin
fun main() {
    val trafficLightState = "Red" // 這可以是 "Green"、"Yellow" 或 "Red"

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

然而，您可以有相同的程式碼，但將 `trafficLightState` 作為主語：

```kotlin
fun main() {
    val trafficLightState = "Red" // 這可以是 "Green"、"Yellow" 或 "Red"

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

將 `when` 與主語一起使用，可以使您的程式碼更容易閱讀和維護。當您將主語與 `when` 表達式一起使用時，它還有助於 Kotlin 檢查是否涵蓋了所有可能的情況。否則，如果您在 `when` 表達式中不使用主語，則需要提供一個 `else` 分支。

## 條件表達式練習

### 練習 1 {initial-collapse-state="collapsed" collapsible="true" id="conditional-expressions-exercise-1"}

建立一個簡單的遊戲，如果擲出兩個骰子的點數相同則獲勝。使用 `if` 判斷骰子是否匹配，如果是則印出 `You win :)`，否則印出 `You lose :(`。

> 在此練習中，您將引入一個套件，以便可以使用 `Random.nextInt()` 函式來獲取一個隨機的 `Int`。有關引入套件的更多資訊，請參閱[套件與引入](packages.md)。
>
{style="tip"}

<deflist collapsible="true">
    <def title="提示">
        使用 <a href="operator-overloading.md#equality-and-inequality-operators">等於運算子</a> (<code>==</code>) 來比較骰子結果。
    </def>
</deflist>

|---|---|
```kotlin
import kotlin.random.Random

fun main() {
    val firstResult = Random.nextInt(6)
    val secondResult = Random.nextInt(6)
    // 在此處編寫您的程式碼
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
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="範例解法" id="kotlin-tour-control-flow-conditional-solution-1"}

### 練習 2 {initial-collapse-state="collapsed" collapsible="true" id="conditional-expressions-exercise-2"}

使用 `when` 表達式，更新以下程式，使其在輸入遊戲主機按鈕名稱時印出對應的動作。

| **按鈕** | **動作** |
|---|---|
| A | Yes |
| B | No |
| X | Menu |
| Y | Nothing |
| 其他 | 沒有這個按鈕 |

|---|---|
```kotlin
fun main() {
    val button = "A"

    println(
        // 在此處編寫您的程式碼
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
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="範例解法" id="kotlin-tour-control-flow-conditional-solution-2"}

## 範圍

在討論迴圈之前，了解如何構造供迴圈迭代的範圍會很有用。

在 Kotlin 中建立範圍最常見的方法是使用 `..` 運算子。例如，`1..4` 等同於 `1, 2, 3, 4`。

若要宣告不包含結束值的範圍，請使用 `..<` 運算子。例如，`1..<4` 等同於 `1, 2, 3`。

若要宣告反向順序的範圍，請使用 `downTo`。例如，`4 downTo 1` 等同於 `4, 3, 2, 1`。

若要宣告增量不是 1 的範圍，請使用 `step` 和您期望的增量值。例如，`1..5 step 2` 等同於 `1, 3, 5`。

您也可以對 `Char` 範圍做同樣的事情：

* `'a'..'d'` 等同於 `'a', 'b', 'c', 'd'`
* `'z' downTo 's' step 2` 等同於 `'z', 'x', 'v', 't'`

## 迴圈

程式設計中兩種最常見的迴圈結構是 `for` 和 `while`。使用 `for` 遍歷值範圍並執行動作。使用 `while` 繼續執行動作直到特定條件符合為止。

### For

運用您對範圍的新知識，您可以建立一個 `for` 迴圈，該迴圈會遍歷數字 1 到 5，並每次都印出該數字。

將迭代器和範圍連同關鍵字 `in` 置於圓括號 `()` 內。將您要完成的動作置於花括號 `{}` 內：

```kotlin
fun main() {
//sampleStart
    for (number in 1..5) {
        // number 是迭代器，1..5 是範圍
        print(number)
    }
    // 12345
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-for-loop"}

集合也可以透過迴圈進行迭代：

```kotlin
fun main() {
//sampleStart
    val cakes = listOf("carrot", "cheese", "chocolate")

    for (cake in cakes) {
        println("Yummy, it's a $cake cake!")
    }
    // 好好吃，是紅蘿蔔蛋糕！
    // 好好吃，是起司蛋糕！
    // 好好吃，是巧克力蛋糕！
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-for-collection-loop"}

### While

`while` 可以用兩種方式使用：

  * 在條件表達式為真時執行程式碼區塊。(`while`)
  * 先執行程式碼區塊，然後再檢查條件表達式。(`do-while`)

在第一種使用情境 (`while`) 中：

* 將 `while` 迴圈要繼續執行的條件表達式宣告在圓括號 `()` 內。
* 將您要完成的動作加入花括號 `{}` 內。

> 以下範例使用[遞增運算子](operator-overloading.md#increments-and-decrements) `++` 來遞增 `cakesEaten` 變數的值。
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
    // 吃一個蛋糕
    // 吃一個蛋糕
    // 吃一個蛋糕
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-while-loop"}

在第二種使用情境 (`do-while`) 中：

* 將 `while` 迴圈要繼續執行的條件表達式宣告在圓括號 `()` 內。
* 使用關鍵字 `do`，在花括號 `{}` 內定義您要完成的動作。

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
    // 吃一個蛋糕
    // 吃一個蛋糕
    // 吃一個蛋糕
    // 烤一個蛋糕
    // 烤一個蛋糕
    // 烤一個蛋糕
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-while-do-loop"}

有關條件表達式和迴圈的更多資訊和範例，請參閱[條件與迴圈](control-flow.md)。

既然您已了解 Kotlin 控制流程的基礎知識，是時候學習如何編寫您自己的[函式](kotlin-tour-functions.md)了。

## 迴圈練習

### 練習 1 {initial-collapse-state="collapsed" collapsible="true" id="loops-exercise-1"}

您有一個程式，它會計算披薩片數，直到湊成一個有 8 片的完整披薩。請以兩種方式重構此程式：

* 使用 `while` 迴圈。
* 使用 `do-while` 迴圈。

|---|---|
```kotlin
fun main() {
    var pizzaSlices = 0
    // 在此處開始重構
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
    // 在此處結束重構
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
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="範例解法 1" id="kotlin-tour-control-flow-loops-exercise-1-solution-1"}

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
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="範例解法 2" id="kotlin-tour-control-flow-loops-exercise-1-solution-2"}

### 練習 2 {initial-collapse-state="collapsed" collapsible="true" id="loops-exercise-2"}

編寫一個模擬 [Fizz buzz](https://en.wikipedia.org/wiki/Fizz_buzz) 遊戲的程式。您的任務是遞增地印出從 1 到 100 的數字，將任何可被三整除的數字替換為單詞 "fizz"，將任何可被五整除的數字替換為單詞 "buzz"。任何可同時被 3 和 5 整除的數字必須替換為單詞 "fizzbuzz"。

<deflist collapsible="true">
    <def title="提示 1">
        使用 <code>for</code> 迴圈來計數，並使用 <code>when</code> 表達式來決定每一步要印出什麼。
    </def>
</deflist>

<deflist collapsible="true">
    <def title="提示 2">
        使用模數運算子 (<code>%</code>) 返回數字被除後的餘數。使用 <a href="operator-overloading.md#equality-and-inequality-operators">等於運算子</a> (<code>==</code>) 來檢查餘數是否等於零。
    </def>
</deflist>

|---|---|
```kotlin
fun main() {
    // 在此處編寫您的程式碼
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
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="範例解法" id="kotlin-tour-control-flow-loops-solution-2"}

### 練習 3 {initial-collapse-state="collapsed" collapsible="true" id="loops-exercise-3"}

您有一個單詞列表。使用 `for` 和 `if` 只印出以字母 `l` 開頭的單詞。

<deflist collapsible="true">
    <def title="提示">
        使用 <code>String</code> 型別的 <a href="https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/starts-with.html"> <code>.startsWith()</code> </a> 函式。
    </def>
</deflist>

|---|---|
```kotlin
fun main() {
    val words = listOf("dinosaur", "limousine", "magazine", "language")
    // 在此處編寫您的程式碼
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
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="範例解法" id="kotlin-tour-control-flow-loops-solution-3"}

## 下一步

[函式](kotlin-tour-functions.md)