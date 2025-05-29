[//]: # (title: 哈囉世界)

<no-index/>

<tldr>
    <p><img src="icon-1.svg" width="20" alt="First step" /> <strong>哈囉世界</strong><br />
        <img src="icon-2-todo.svg" width="20" alt="Second step" /> <a href="kotlin-tour-basic-types.md">基本型別</a><br />
        <img src="icon-3-todo.svg" width="20" alt="Third step" /> <a href="kotlin-tour-collections.md">集合</a><br />
        <img src="icon-4-todo.svg" width="20" alt="Fourth step" /> <a href="kotlin-tour-control-flow.md">控制流程</a><br />
        <img src="icon-5-todo.svg" width="20" alt="Fifth step" /> <a href="kotlin-tour-functions.md">函式</a><br />
        <img src="icon-6-todo.svg" width="20" alt="Sixth step" /> <a href="kotlin-tour-classes.md">類別</a><br />
        <img src="icon-7-todo.svg" width="20" alt="Final step" /> <a href="kotlin-tour-null-safety.md">空值安全性</a></p>
</tldr>

這是一個簡單的程式，用於印出「Hello, world!」：

```kotlin
fun main() {
    println("Hello, world!")
    // Hello, world!
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="hello-world-kotlin"}

在 Kotlin 中：

*   `fun` 用於宣告函式
*   `main()` 函式是您程式的起始點
*   函式的本體寫在花括號 `{}` 內
*   [`println()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.io/println.html) 和 [`print()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.io/print.html) 函式將其引數印至標準輸出

函式是執行特定任務的一組指令。一旦您建立一個函式，您就可以在需要執行該任務時隨時使用它，而無需重複編寫指令。函式將在後續幾個章節中更詳細地討論。在此之前，所有範例都使用 `main()` 函式。

## 變數

所有程式都需要能夠儲存資料，而變數 (variables) 正是為此而生。在 Kotlin 中，您可以宣告：

*   使用 `val` 宣告唯讀變數
*   使用 `var` 宣告可變變數

> 唯讀變數一旦賦予值，就不能再改變。
>
{style="note"}

若要賦予值，請使用賦值運算子 `=`.

例如：

```kotlin
fun main() { 
//sampleStart
    val popcorn = 5    // There are 5 boxes of popcorn
    val hotdog = 7     // There are 7 hotdogs
    var customers = 10 // There are 10 customers in the queue
    
    // Some customers leave the queue
    customers = 8
    println(customers)
    // 8
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-variables"}

> 變數可以在程式開頭的 `main()` 函式之外宣告。以這種方式宣告的變數被稱為在**頂層**宣告。
> 
{style="tip"}

由於 `customers` 是可變變數，其值在宣告後可以重新賦值。

> 我們建議您預設將所有變數宣告為唯讀 (`val`)。僅在必要時宣告可變變數 (`var`)。
> 
{style="note"}

## 字串樣板

了解如何將變數內容印至標準輸出非常有用。您可以使用**字串樣板** (string templates) 來實現此目的。您可以使用樣板表達式 (template expressions) 來存取儲存在變數和其他物件中的資料，並將它們轉換為字串。字串值 (string value) 是雙引號 `""` 中的字元序列。樣板表達式始終以美元符號 `$` 開頭。若要在樣板表達式中評估一段程式碼，請將程式碼放在美元符號 `$` 後的花括號 `{}` 內。

例如：

```kotlin
fun main() { 
//sampleStart
    val customers = 10
    println("There are $customers customers")
    // There are 10 customers
    
    println("There are ${customers + 1} customers")
    // There are 11 customers
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-string-templates"}

如需更多資訊，請參閱[字串樣板](strings.md#string-templates)。

您會注意到變數沒有宣告任何型別。Kotlin 已經自行推斷 (inferred) 了型別：`Int`。本教學將在[下一章](kotlin-tour-basic-types.md)解釋不同的 Kotlin 基本型別以及如何宣告它們。

## 練習

### 練習 {initial-collapse-state="collapsed" collapsible="true"}

完成程式碼，使程式將 `"Mary is 20 years old"` 印至標準輸出：

|---|---|
```kotlin
fun main() {
    val name = "Mary"
    val age = 20
    // 在此編寫您的程式碼
}
```
{validate="false" kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-hello-world-exercise"}

|---|---|
```kotlin
fun main() {
    val name = "Mary"
    val age = 20
    println("$name is $age years old")
}
```
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="範例解答" id="kotlin-tour-hello-world-solution"}

## 下一步

[基本型別](kotlin-tour-basic-types.md)