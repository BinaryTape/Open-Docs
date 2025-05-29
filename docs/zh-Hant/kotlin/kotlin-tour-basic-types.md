[//]: # (title: 基本型別)

<no-index/>

<tldr>
    <p><img src="icon-1-done.svg" width="20" alt="First step" /> <a href="kotlin-tour-hello-world.md">Hello world</a><br />
        <img src="icon-2.svg" width="20" alt="Second step" /> <strong>基本型別</strong><br />
        <img src="icon-3-todo.svg" width="20" alt="Third step" /> <a href="kotlin-tour-collections.md">集合</a><br />
        <img src="icon-4-todo.svg" width="20" alt="Fourth step" /> <a href="kotlin-tour-control-flow.md">控制流程</a><br />
        <img src="icon-5-todo.svg" width="20" alt="Fifth step" /> <a href="kotlin-tour-functions.md">函式</a><br />
        <img src="icon-6-todo.svg" width="20" alt="Sixth step" /> <a href="kotlin-tour-classes.md">類別</a><br />
        <img src="icon-7-todo.svg" width="20" alt="Final step" /> <a href="kotlin-tour-null-safety.md">空值安全</a></p>
</tldr>

Kotlin 中的每個變數和資料結構都擁有型別。型別很重要，因為它們能告訴編譯器您可以用該變數或資料結構做什麼。換句話說，就是它擁有什麼樣的函式和屬性。

在上一章中，Kotlin 能夠判斷範例中 `customers` 的型別為 [`Int`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-int/)。Kotlin **推斷**型別的能力稱為**型別推斷**。`customers` 被賦予一個整數值。由此，Kotlin 推斷 `customers` 具有數值型別 `Int`。因此，編譯器知道您可以對 `customers` 執行算術運算：

```kotlin
fun main() {
//sampleStart
    var customers = 10

    // Some customers leave the queue
    customers = 8

    customers = customers + 3 // Example of addition: 11
    customers += 7            // Example of addition: 18
    customers -= 3            // Example of subtraction: 15
    customers *= 2            // Example of multiplication: 30
    customers /= 3            // Example of division: 10

    println(customers) // 10
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-basic-types-arithmetic"}

> `+=`、`-=`、`*=`、`/=` 和 `%=` 是複合賦值運算子 (augmented assignment operators)。有關更多資訊，請參閱 [複合賦值](operator-overloading.md#augmented-assignments)。
>
{style="tip"}

Kotlin 總共有以下基本型別：

| **類別**           | **基本型別**                       | **範例程式碼**                                                |
|--------------------|------------------------------------|---------------------------------------------------------------|
| 整數               | `Byte`, `Short`, `Int`, `Long`     | `val year: Int = 2020`                                        |
| 無符號整數         | `UByte`, `UShort`, `UInt`, `ULong` | `val score: UInt = 100u`                                      |
| 浮點數             | `Float`, `Double`                  | `val currentTemp: Float = 24.5f`, `val price: Double = 19.99` |
| 布林值             | `Boolean`                          | `val isEnabled: Boolean = true`                               |
| 字元               | `Char`                             | `val separator: Char = ','`                                   |
| 字串               | `String`                           | `val message: String = "Hello, world!"`                       |

有關基本型別及其屬性的更多資訊，請參閱 [基本型別](basic-types.md)。

有了這些知識，您可以宣告變數並稍後初始化它們。只要變數在首次讀取前被初始化，Kotlin 就能夠處理這種情況。

若要宣告變數而不初始化它，請使用 `:` 指定其型別。例如：

```kotlin
fun main() {
//sampleStart
    // Variable declared without initialization
    val d: Int
    // Variable initialized
    d = 3

    // Variable explicitly typed and initialized
    val e: String = "hello"

    // Variables can be read because they have been initialized
    println(d) // 3
    println(e) // hello
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-basic-types-initialization"}

如果您在讀取變數之前沒有初始化它，您會看到一個錯誤：

```kotlin
fun main() {
//sampleStart
    // Variable declared without initialization
    val d: Int
    
    // Triggers an error
    println(d)
    // Variable 'd' must be initialized
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-basic-types-no-initialization" validate="false"}

現在您已瞭解如何宣告基本型別，是時候學習[集合](kotlin-tour-collections.md)了。

## 練習

### 練習 {initial-collapse-state="collapsed" collapsible="true"}

明確宣告每個變數的正確型別：

|---|---|
```kotlin
fun main() {
    val a: Int = 1000 
    val b = "log message"
    val c = 3.14
    val d = 100_000_000_000_000
    val e = false
    val f = '
'
}
```
{validate="false" kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-basic-types-exercise"}

|---|---|
```kotlin
fun main() {
    val a: Int = 1000
    val b: String = "log message"
    val c: Double = 3.14
    val d: Long = 100_000_000_000_000
    val e: Boolean = false
    val f: Char = '
'
}
```
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="範例解答" id="kotlin-tour-basic-types-solution"}

## 下一步

[集合](kotlin-tour-collections.md)