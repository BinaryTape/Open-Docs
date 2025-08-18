[//]: # (title: 基本型別)

<no-index/>

<tldr>
    <p><img src="icon-1-done.svg" width="20" alt="第一步" /> <a href="kotlin-tour-hello-world.md">Hello world</a><br />
        <img src="icon-2.svg" width="20" alt="第二步" /> <strong>基本型別</strong><br />
        <img src="icon-3-todo.svg" width="20" alt="第三步" /> <a href="kotlin-tour-collections.md">集合</a><br />
        <img src="icon-4-todo.svg" width="20" alt="第四步" /> <a href="kotlin-tour-control-flow.md">控制流程</a><br />
        <img src="icon-5-todo.svg" width="20" alt="第五步" /> <a href="kotlin-tour-functions.md">函式</a><br />
        <img src="icon-6-todo.svg" width="20" alt="第六步" /> <a href="kotlin-tour-classes.md">類別</a><br />
        <img src="icon-7-todo.svg" width="20" alt="最後一步" /> <a href="kotlin-tour-null-safety.md">null 安全</a></p>
</tldr>

Kotlin 中的每個變數和資料結構都具有型別。型別很重要，因為它們告訴編譯器您可以對該變數或資料結構執行哪些操作。換句話說，它擁有哪些函式和屬性。

在上一章節中，Kotlin 能夠從先前的範例判斷 `customers` 的型別為 [`Int`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-int/)。Kotlin **推斷**型別的能力稱為**型別推斷**。`customers` 被賦予一個整數值。從中，Kotlin 推斷出 `customers` 具有數值型別 `Int`。因此，編譯器知道您可以對 `customers` 執行算術運算：

```kotlin
fun main() {
//sampleStart
    var customers = 10

    // 有些顧客離開了隊列
    customers = 8

    customers = customers + 3 // 加法範例：11
    customers += 7            // 加法範例：18
    customers -= 3            // 減法範例：15
    customers *= 2            // 乘法範例：30
    customers /= 3            // 除法範例：10

    println(customers) // 10
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-basic-types-arithmetic"}

> `+=`、`-=`、`*=`、`/=` 和 `%=` 是複合賦值運算子。更多資訊，請參閱[複合賦值](operator-overloading.md#augmented-assignments)。
> 
{style="tip"}

總計，Kotlin 具有以下基本型別：

| **類別**           | **基本型別**                     | **範例程式碼**                                             |
|------------------------|------------------------------------|---------------------------------------------------------------|
| 整數                   | `Byte`、`Short`、`Int`、`Long`     | `val year: Int = 2020`                                        |
| 無符號整數             | `UByte`、`UShort`、`UInt`、`ULong` | `val score: UInt = 100u`                                      |
| 浮點數                 | `Float`、`Double`                  | `val currentTemp: Float = 24.5f`、`val price: Double = 19.99` |
| 布林值                 | `Boolean`                          | `val isEnabled: Boolean = true`                               |
| 字元                   | `Char`                             | `val separator: Char = ','`                                   |
| 字串                   | `String`                           | `val message: String = "Hello, world!"`                       |

有關基本型別及其屬性的更多資訊，請參閱[基本型別](basic-types.md)。

有了這些知識，您可以宣告變數並在稍後初始化它們。只要變數在首次讀取前被初始化，Kotlin 就能夠管理這項操作。

若要宣告變數而不初始化它，請使用 `:` 指定其型別。例如：

```kotlin
fun main() {
//sampleStart
    // 宣告但未初始化的變數
    val d: Int
    // 初始化的變數
    d = 3

    // 明確指定型別並初始化的變數
    val e: String = "hello"

    // 變數已被初始化，可以讀取
    println(d) // 3
    println(e) // hello
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-basic-types-initialization"}

如果您在讀取變數之前沒有初始化它，您會看到錯誤：

```kotlin
fun main() {
//sampleStart
    // 宣告但未初始化的變數
    val d: Int
    
    // 觸發錯誤
    println(d)
    // 變數 'd' 必須被初始化
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-basic-types-no-initialization" validate="false"}

現在您知道如何宣告基本型別了，是時候了解[集合](kotlin-tour-collections.md)了。

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