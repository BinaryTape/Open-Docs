---
title: "基本類型 (Basic types)"
---
<no-index/>
:::info
<p>
   <img src="/img/icon-1-done.svg" width="20" alt="First step" /> <a href="kotlin-tour-hello-world">Hello world</a><br />
        <img src="/img/icon-2.svg" width="20" alt="Second step" /> <strong>基本型別（Basic types）</strong><br />
        <img src="/img/icon-3-todo.svg" width="20" alt="Third step" /> <a href="kotlin-tour-collections">集合（Collections）</a><br />
        <img src="/img/icon-4-todo.svg" width="20" alt="Fourth step" /> <a href="kotlin-tour-control-flow">控制流程（Control flow）</a><br />
        <img src="/img/icon-5-todo.svg" width="20" alt="Fifth step" /> <a href="kotlin-tour-functions">函式（Functions）</a><br />
        <img src="/img/icon-6-todo.svg" width="20" alt="Sixth step" /> <a href="kotlin-tour-classes">類別（Classes）</a><br />
        <img src="/img/icon-7-todo.svg" width="20" alt="Final step" /> <a href="kotlin-tour-null-safety">Null 安全（Null safety）</a>
</p>

:::

在 Kotlin 中，每個變數和資料結構都有一個型別（type）。型別之所以重要，是因為它們告訴編譯器你可以對該變數或資料結構做什麼。換句話說，它有哪些函式和屬性。

在上一章中，Kotlin 能夠在前一個範例中判斷 `customers` 的型別為 [`Int`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-int/)。Kotlin **推斷（infer）**型別的能力稱為**型別推論（type inference）**。`customers` 被賦予一個整數值。從這點來看，Kotlin 推論出 `customers` 具有數值型別 `Int`。因此，編譯器知道你可以對 `customers` 執行算術運算：

```kotlin
fun main() {

    var customers = 10

    // Some customers leave the queue
    customers = 8

    customers = customers + 3 // Example of addition: 11
    customers += 7            // Example of addition: 18
    customers -= 3            // Example of subtraction: 15
    customers *= 2            // Example of multiplication: 30
    customers /= 3            // Example of division: 10

    println(customers) // 10

}
```

:::tip
`+=`、`-=`、`*=`、`/=` 和 `%=` 是擴增賦值運算符（augmented assignment operators）。更多資訊，請參閱 [擴增賦值（Augmented assignments）](operator-overloading#augmented-assignments)。

:::

總之，Kotlin 具有以下基本型別：

| **類別（Category）**           | **基本型別（Basic types）**                    | **範例程式碼（Example code）**                                              |
|------------------------|------------------------------------|---------------------------------------------------------------|
| 整數（Integers）               | `Byte`、`Short`、`Int`、`Long`     | `val year: Int = 2020`                                        |
| 無符號整數（Unsigned integers）      | `UByte`、`UShort`、`UInt`、`ULong` | `val score: UInt = 100u`                                      |
| 浮點數（Floating-point numbers） | `Float`、`Double`                  | `val currentTemp: Float = 24.5f`、`val price: Double = 19.99` |
| 布林值（Booleans）               | `Boolean`                          | `val isEnabled: Boolean = true`                               |
| 字元（Characters）             | `Char`                             | `val separator: Char = ','`                                   |
| 字串（Strings）                | `String`                           | `val message: String = "Hello, world!"`                       |

有關基本型別及其屬性的更多資訊，請參閱 [基本型別（Basic types）](basic-types)。

有了這些知識，你就可以宣告變數並稍後再初始化它們。只要變數在第一次讀取之前初始化，Kotlin 就可以管理它。

若要宣告變數而不初始化它，請使用 `:` 指定其型別。例如：

```kotlin
fun main() {

    // Variable declared without initialization
    val d: Int
    // Variable initialized
    d = 3

    // Variable explicitly typed and initialized
    val e: String = "hello"

    // Variables can be read because they have been initialized
    println(d) // 3
    println(e) // hello

}
```

如果你在讀取變數之前沒有初始化它，你將會看到一個錯誤：

```kotlin
fun main() {

    // Variable declared without initialization
    val d: Int
    
    // Triggers an error
    println(d)
    // Variable 'd' must be initialized

}
```

現在你已經知道如何宣告基本型別，是時候學習 [集合（collections）](kotlin-tour-collections)了。

## 練習（Practice）

### 習題（Exercise） 

為每個變數顯式宣告正確的型別：

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

## 下一步（Next step）

[集合（Collections）](kotlin-tour-collections)