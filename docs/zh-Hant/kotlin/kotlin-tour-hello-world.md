[//]: # (title: 哈囉世界)

<no-index/>

<tldr>
    <p><img src="icon-1.svg" width="20" alt="First step" /> <strong>哈囉世界</strong><br />
        <img src="icon-2-todo.svg" width="20" alt="Second step" /> <a href="kotlin-tour-basic-types.md">基本型別</a><br />
        <img src="icon-3-todo.svg" width="20" alt="Third step" /> <a href="kotlin-tour-collections.md">集合</a><br />
        <img src="icon-4-todo.svg" width="20" alt="Fourth step" /> <a href="kotlin-tour-control-flow.md">控制流程</a><br />
        <img src="icon-5-todo.svg" width="20" alt="Fifth step" /> <a href="kotlin-tour-functions.md">函式</a><br />
        <img src="icon-6-todo.svg" width="20" alt="Sixth step" /> <a href="kotlin-tour-classes.md">類別</a><br />
        <img src="icon-7-todo.svg" width="20" alt="Final step" /> <a href="kotlin-tour-null-safety.md">空值安全</a></p>
</tldr>

這是一個簡單的程式，用於列印「Hello, world!」：

```kotlin
fun main() {
    println("Hello, world!")
    // 哈囉，世界！
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="hello-world-kotlin"}

在 Kotlin 中：

* `fun` 用於宣告函式
* `main()` 函式是程式的起始點
* 函式的主體寫在花括號 `{}` 內
* [`println()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.io/println.html) 和 [`print()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.io/print.html) 函式將它們的引數列印到標準輸出

函式是一組執行特定任務的指令。一旦你建立了一個函式，你就可以在需要執行該任務時隨時使用它，而無需再次編寫所有指令。函式將在接下來的幾個章節中詳細討論。在那之前，所有範例都將使用 `main()` 函式。

## 變數

所有程式都需要能夠儲存資料，而變數正是為此而生。在 Kotlin 中，你可以宣告：

* 使用 `val` 宣告唯讀變數
* 使用 `var` 宣告可變變數

> 一旦你為唯讀變數賦值，就不能再更改它。
>
{style="note"}

若要賦值，請使用賦值運算子 `=`。

例如：

```kotlin
fun main() { 
//sampleStart
    val popcorn = 5    // 有 5 盒爆米花
    val hotdog = 7     // 有 7 個熱狗
    var customers = 10 // 佇列中有 10 位顧客
    
    // 一些顧客離開了佇列
    customers = 8
    println(customers)
    // 8
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-variables"}

> 變數可以在程式開始時於 `main()` 函式外部宣告。以這種方式宣告的變數被稱為在**頂層**宣告。
> 
{style="tip"}

由於 `customers` 是一個可變變數，它的值在宣告後可以被重新賦值。

> 我們建議預設將所有變數宣告為唯讀 (`val`)。只有在你確實需要時才使用可變變數 (`var`)。這樣，你就比較不會意外更改不應該更改的內容。
> 
{style="note"}

## 字串範本

了解如何將變數內容列印到標準輸出很有用。你可以使用**字串範本**來實現這點。你可以使用範本表達式來存取儲存在變數和其他物件中的資料，並將它們轉換為字串。字串值是由雙引號 `"` 中的一系列字元組成。範本表達式總是以前置詞號 `$` 開頭。

若要在範本表達式中評估一段程式碼，請將程式碼放在前置詞號 `$` 後的花括號 `{}` 內。

例如：

```kotlin
fun main() { 
//sampleStart
    val customers = 10
    println("There are $customers customers")
    // 有 10 位顧客
    
    println("There are ${customers + 1} customers")
    // 有 11 位顧客
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-string-templates"}

欲了解更多資訊，請參閱 [字串範本](strings.md#string-templates)。

你會注意到變數沒有宣告任何型別。Kotlin 已經自行推斷出型別：`Int`。本導覽將在[下一章](kotlin-tour-basic-types.md)中解釋不同的 Kotlin 基本型別以及如何宣告它們。

## 練習

### 練習 {initial-collapse-state="collapsed" collapsible="true"}

完成程式碼，使程式將「Mary is 20 years old」列印到標準輸出：

|---|---|
```kotlin
fun main() {
    val name = "Mary"
    val age = 20
    // 在此編寫你的程式碼
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