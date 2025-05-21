---
title: "控制流程 (Control flow)"
---
<no-index/>

:::info
<p>
   <img src="/img/icon-1-done.svg" width="20" alt="First step" /> <a href="kotlin-tour-hello-world">Hello world</a><br />
        <img src="/img/icon-2-done.svg" width="20" alt="Second step" /> <a href="kotlin-tour-basic-types">基本型別 (Basic types)</a><br />
        <img src="/img/icon-3-done.svg" width="20" alt="Third step" /> <a href="kotlin-tour-collections">集合 (Collections)</a><br />
        <img src="/img/icon-4.svg" width="20" alt="Fourth step" /> <strong>控制流程 (Control flow)</strong><br />
        <img src="/img/icon-5-todo.svg" width="20" alt="Fifth step" /> <a href="kotlin-tour-functions">函式 (Functions)</a><br />
        <img src="/img/icon-6-todo.svg" width="20" alt="Sixth step" /> <a href="kotlin-tour-classes">類別 (Classes)</a><br />
        <img src="/img/icon-7-todo.svg" width="20" alt="Final step" /> <a href="kotlin-tour-null-safety">Null 安全 (Null safety)</a>
</p>

:::

與其他程式語言一樣，Kotlin 能夠根據一段程式碼的評估結果是否為真 (true) 來做出決策。此類程式碼稱為**條件表達式 (conditional expressions)**。Kotlin 也能夠建立迴圈並在迴圈中迭代。

## 條件表達式 (Conditional expressions)

Kotlin 提供了 `if` 和 `when` 來檢查條件表達式。

:::note
如果您需要在 `if` 和 `when` 之間做出選擇，我們建議使用 `when`，因為它：

* 使您的程式碼更易於閱讀。
* 使添加另一個分支更容易。
* 減少程式碼中的錯誤。

:::

### If

要使用 `if`，請在括號 `()` 內加入條件表達式，並在花括號 `{}` 內加入如果結果為真 (true) 時要採取的動作：

```kotlin
fun main() {

    val d: Int
    val check = true

    if (check) {
        d = 1
    } else {
        d = 2
    }

    println(d)
    // 1

}
```

在 Kotlin 中沒有三元運算子 `condition ? then : else`。 相反，`if` 可以用作表達式 (expression)。 如果每個動作只有一行程式碼，則花括號 `{}` 是可選的：

```kotlin
fun main() { 

    val a = 1
    val b = 2

    println(if (a > b) a else b) // Returns a value: 2

}
```

### When

當您有一個具有多個分支的條件表達式時，請使用 `when`。

要使用 `when`：

* 將您要評估的值放在括號 `()` 內。
* 將分支放在花括號 `{}` 內。
* 在每個分支中使用 `->` 將每個檢查與檢查成功時要採取的動作分開。

`when` 可以用作語句 (statement) 或表達式 (expression)。 **語句 (statement)** 不會傳回任何內容，而是執行動作。

以下是使用 `when` 作為語句的範例：

```kotlin
fun main() {

    val obj = "Hello"

    when (obj) {
        // 檢查 obj 是否等於 "1"
        "1" `->` println("One")
        // 檢查 obj 是否等於 "Hello"
        "Hello" `->` println("Greeting")
        // 預設語句 (Default statement)
        else `->` println("Unknown")     
    }
    // Greeting

}
```

:::note
請注意，所有分支條件都會依序檢查，直到滿足其中一個條件為止。 因此，只會執行第一個適合的分支。

:::

**表達式 (expression)** 會傳回一個值，該值稍後可用於您的程式碼中。

以下是使用 `when` 作為表達式 (expression) 的範例。 `when` 表達式會立即分配給一個變數，該變數稍後會與 `println()` 函數一起使用：

```kotlin
fun main() {

    val obj = "Hello"    
    
    val result = when (obj) {
        // 如果 obj 等於 "1"，則將 result 設定為 "one"
        "1" `->` "One"
        // 如果 obj 等於 "Hello"，則將 result 設定為 "Greeting"
        "Hello" `->` "Greeting"
        // 如果沒有滿足先前的條件，則將 result 設定為 "Unknown"
        else `->` "Unknown"
    }
    println(result)
    // Greeting

}
```

您到目前為止看到的 `when` 範例都有一個主體 (subject)：`obj`。 但是 `when` 也可以在沒有主體的情況下使用。

此範例使用**沒有**主體的 `when` 表達式來檢查一連串的布林表達式：

```kotlin
fun main() {
    val trafficLightState = "Red" // This can be "Green", "Yellow", or "Red"

    val trafficAction = when {
        trafficLightState == "Green" `->` "Go"
        trafficLightState == "Yellow" `->` "Slow down"
        trafficLightState == "Red" `->` "Stop"
        else `->` "Malfunction"
    }

    println(trafficAction)
    // Stop
}
```

但是，您可以擁有相同的程式碼，但以 `trafficLightState` 作為主體：

```kotlin
fun main() {
    val trafficLightState = "Red" // This can be "Green", "Yellow", or "Red"

    val trafficAction = when (trafficLightState) {
        "Green" `->` "Go"
        "Yellow" `->` "Slow down"
        "Red" `->` "Stop"
        else `->` "Malfunction"
    }

    println(trafficAction)  
    // Stop
}
```

使用帶有主體的 `when` 可以使您的程式碼更易於閱讀和維護。 當您將主體與 `when` 表達式一起使用時，它也有助於 Kotlin 檢查是否涵蓋了所有可能的情況。 否則，如果您不將主體與 `when` 表達式一起使用，則需要提供一個 else 分支。

## 條件表達式練習 (Conditional expressions practice)

### 練習 1

建立一個簡單的遊戲，如果您擲兩個骰子的結果相同，您就可以獲勝。 如果骰子匹配，則使用 `if` 列印 `You win :)`，否則列印 `You lose :(`。

:::tip
在本練習中，您會匯入一個套件，以便您可以使用 `Random.nextInt()` 函數來為您提供一個隨機的 `Int`。 如需有關匯入套件的更多資訊，請參閱 [套件和匯入 (Packages and imports)](packages)。

:::
<h3>提示</h3>
        使用 <a href="operator-overloading#equality-and-inequality-operators">等式運算子 (equality operator)</a> (`==`) 來比較骰子結果。 
    

|---|---|
```kotlin
import kotlin.random.Random

fun main() {
    val firstResult = Random.nextInt(6)
    val secondResult = Random.nextInt(6)
    // Write your code here
}
```

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

### 練習 2

使用 `when` 表達式，更新以下程式，以便在您輸入遊戲機按鈕的名稱時，它會列印對應的動作。

| **按鈕 (Button)** | **動作 (Action)**             |
|------------|------------------------|
| A          | 是 (Yes)                    |
| B          | 否 (No)                     |
| X          | 選單 (Menu)                   |
| Y          | 無 (Nothing)                |
| 其他 (Other)      | 沒有此按鈕 (There is no such button) |

|---|---|
```kotlin
fun main() {
    val button = "A"

    println(
        // Write your code here
    )
}
```

|---|---|
```kotlin
fun main() {
    val button = "A"
    
    println(
        when (button) {
            "A" `->` "Yes"
            "B" `->` "No"
            "X" `->` "Menu"
            "Y" `->` "Nothing"
            else `->` "There is no such button"
        }
    )
}
```

## 範圍 (Ranges)

在討論迴圈之前，了解如何建構迴圈要迭代的範圍會很有用。

在 Kotlin 中建立範圍最常見的方法是使用 `..` 運算子。 例如，`1..4` 等效於 `1, 2, 3, 4`。

要宣告不包含結束值的範圍，請使用 `..<` 運算子。 例如，`1..&lt;4` 等效於 `1, 2, 3`。

要以相反的順序宣告範圍，請使用 `downTo`。 例如，`4 downTo 1` 等效於 `4, 3, 2, 1`。

要宣告以非 1 的步長遞增的範圍，請使用 `step` 和您想要的遞增值。 例如，`1..5 step 2` 等效於 `1, 3, 5`。

您也可以對 `Char` 範圍執行相同的操作：

* `'a'..'d'` 等效於 `'a', 'b', 'c', 'd'`
* `'z' downTo 's' step 2` 等效於 `'z', 'x', 'v', 't'`

## 迴圈 (Loops)

程式設計中最常見的兩種迴圈結構是 `for` 和 `while`。 使用 `for` 迭代一系列值並執行動作。 使用 `while` 繼續執行動作，直到滿足特定條件。

### For

使用您新學到的範圍知識，您可以建立一個 `for` 迴圈，該迴圈迭代數字 1 到 5，並每次列印該數字。

將迭代器和範圍放在帶有關鍵字 `in` 的括號 `()` 內。 在花括號 `{}` 內加入您要完成的動作：

```kotlin
fun main() {

    for (number in 1..5) { 
        // number 是迭代器，而 1..5 是範圍
        print(number)
    }
    // 12345

}
```

迴圈也可以迭代集合：

```kotlin
fun main() { 

    val cakes = listOf("carrot", "cheese", "chocolate")

    for (cake in cakes) {
        println("Yummy, it's a $cake cake!")
    }
    // Yummy, it's a carrot cake!
    // Yummy, it's a cheese cake!
    // Yummy, it's a chocolate cake!

}
```

### While

`while` 可以兩種方式使用：

  * 在條件表達式為真 (true) 時執行程式碼區塊。 (`while`)
  * 先執行程式碼區塊，然後檢查條件表達式。 (`do-while`)

在第一種用例 (`while`) 中：

* 宣告您的 while 迴圈要繼續的條件表達式，放在括號 `()` 內。
* 在花括號 `{}` 內加入您要完成的動作。

以下範例使用 [遞增運算子 (increment operator)](operator-overloading#increments-and-decrements) `++` 來遞增 `cakesEaten` 變數的值。

:::

```kotlin
fun main() {

    var cakesEaten = 0
    while (cakesEaten < 3) {
        println("Eat a cake")
        cakesEaten++
    }
    // Eat a cake
    // Eat a cake
    // Eat a cake

}
```

在第二種用例 (`do-while`) 中：

* 宣告您的 while 迴圈要繼續的條件表達式，放在括號 `()` 內。
* 使用關鍵字 `do` 定義您要在花括號 `{}` 中完成的動作。

```kotlin
fun main() {

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

}
```

如需有關條件表達式和迴圈的更多資訊和範例，請參閱 [條件和迴圈 (Conditions and loops)](control-flow)。

現在您已經了解 Kotlin 控制流程 (control flow) 的基礎知識，接下來可以學習如何編寫自己的 [函式 (functions)](kotlin-tour-functions)。

## 迴圈練習 (Loops practice)

### 練習 1

您有一個程式會計算披薩切片，直到有一個完整的披薩，共有 8 片。 以兩種方式重構此程式：

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

### 練習 2

編寫一個程式來模擬 [Fizz buzz](https://en.wikipedia.org/wiki/Fizz_buzz) 遊戲。 您的任務是以遞增方式列印從 1 到 100 的數字，將任何可被 3 整除的數字替換為單字 "fizz"，將任何可被 5 整除的數字替換為單字 "buzz"。 任何可同時被 3 和 5 整除的數字都必須替換為單字 "fizzbuzz"。
<h3>提示 1</h3>
        使用 `for` 迴圈來計算數字，並使用 `when` 表達式來決定每個步驟要列印的內容。 
<h3>提示 2</h3>
        使用模數運算子 (`%`) 傳回數字被除後的餘數。 使用 <a href="operator-overloading#equality-and-inequality-operators">等式運算子 (equality operator)</a> 
        (`==`) 來檢查餘數是否等於零。
    

|---|---|
```kotlin
fun main() {
    // Write your code here
}
```

|---|---|
```kotlin
fun main() {
    for (number in 1..100) {
        println(
            when {
                number % 15 == 0 `->` "fizzbuzz"
                number % 3 == 0 `->` "fizz"
                number % 5 == 0 `->` "buzz"
                else `->` "$number"
            }
        )
    }
}
```

### 練習 3

您有一個單字清單。 使用 `for` 和 `if` 只列印以字母 `l` 開頭的單字。
<h3>提示</h3>
        針對 `String` 型別，使用 <a href="https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/starts-with.html"> `.startsWith()`
        </a> 函數。 
    

|---|---|
```kotlin
fun main() {
    val words = listOf("dinosaur", "limousine", "magazine", "language")
    // Write your code here
}
```

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

## 下一步

[函式 (Functions)](kotlin-tour-functions)