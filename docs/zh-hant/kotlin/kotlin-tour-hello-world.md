---
title: "Hello world"
---
<no-index/>

:::info
<p>
   <img src="/img/icon-1.svg" width="20" alt="First step" /> <strong>Hello world</strong><br />
        <img src="/img/icon-2-todo.svg" width="20" alt="Second step" /> <a href="kotlin-tour-basic-types">基本型別 (Basic types)</a><br />
        <img src="/img/icon-3-todo.svg" width="20" alt="Third step" /> <a href="kotlin-tour-collections">集合 (Collections)</a><br />
        <img src="/img/icon-4-todo.svg" width="20" alt="Fourth step" /> <a href="kotlin-tour-control-flow">控制流程 (Control flow)</a><br />
        <img src="/img/icon-5-todo.svg" width="20" alt="Fifth step" /> <a href="kotlin-tour-functions">函式 (Functions)</a><br />
        <img src="/img/icon-6-todo.svg" width="20" alt="Sixth step" /> <a href="kotlin-tour-classes">類別 (Classes)</a><br />
        <img src="/img/icon-7-todo.svg" width="20" alt="Final step" /> <a href="kotlin-tour-null-safety">Null 安全 (Null safety)</a>
</p>

:::

以下是一個簡單的程式，可以印出 "Hello, world!":

```kotlin
fun main() {
    println("Hello, world!")
    // Hello, world!
}
```

在 Kotlin 中：

* `fun` 用於宣告一個函式 (function)
* `main()` 函式是你的程式開始執行的地方
* 函式的主體寫在花括號 `{}` 內
* [`println()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.io/println.html) 和 [`print()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.io/print.html) 函式會將其引數 (arguments) 印到標準輸出 (standard output)

函式是一組執行特定任務的指令。一旦你建立了一個函式，你就可以在需要執行該任務時使用它，而無需重新編寫這些指令。關於函式的更多細節將在後面的章節中討論。在此之前，所有的範例都使用 `main()` 函式。

## 變數 (Variables)

所有程式都需要能夠儲存資料，而變數可以幫助你做到這一點。在 Kotlin 中，你可以宣告：

* 使用 `val` 宣告唯讀變數 (Read-only variables)
* 使用 `var` 宣告可變變數 (Mutable variables)

:::note
一旦你給唯讀變數賦值，就無法更改它。

:::

要賦值，請使用賦值運算子 `=`。

例如：

```kotlin
fun main() { 

    val popcorn = 5    // 有 5 盒爆米花
    val hotdog = 7     // 有 7 個熱狗
    var customers = 10 // 隊列中有 10 位顧客
    
    // 一些顧客離開了隊列
    customers = 8
    println(customers)
    // 8

}
```

變數可以在程式的開頭，在 `main()` 函式之外宣告。以這種方式宣告的變數被稱為在**頂層 (top level)**宣告。

由於 `customers` 是一個可變變數，因此其值可以在宣告後重新賦值。

我們建議預設將所有變數宣告為唯讀 (`val`)。只有在必要時才宣告可變變數 (`var`)。

:::

## 字串模板 (String templates)

知道如何將變數的內容印到標準輸出非常有用。你可以使用**字串模板 (string templates)**來做到這一點。 你可以使用模板運算式來存取儲存在變數和其他物件中的資料，並將它們轉換為字串。字串值是用雙引號 `"` 括起來的字元序列。模板運算式總是從美元符號 `$` 開始。

若要在模板運算式中評估一段程式碼，請將程式碼放在美元符號 `$` 後的花括號 `{}` 內。

例如：

```kotlin
fun main() { 

    val customers = 10
    println("There are $customers customers")
    // There are 10 customers
    
    println("There are ${customers + 1} customers")
    // There are 11 customers

}
```

更多資訊，請參閱 [字串模板 (String templates)](strings#string-templates)。

你會注意到沒有為變數宣告任何型別 (types)。Kotlin 已經推斷了型別：`Int`。本教程將在[下一章](kotlin-tour-basic-types)解釋不同的 Kotlin 基本型別以及如何宣告它們。

## 練習 (Practice)

### 練習

完成程式碼，使程式將 `"Mary is 20 years old"` 印到標準輸出：

|---|---|
```kotlin
fun main() {
    val name = "Mary"
    val age = 20
    // Write your code here
}
```

|---|---|
```kotlin
fun main() {
    val name = "Mary"
    val age = 20
    println("$name is $age years old")
}
```

## 下一步 (Next step)

[基本型別 (Basic types)](kotlin-tour-basic-types)