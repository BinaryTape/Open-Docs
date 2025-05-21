---
title: 基本类型
---
<no-index/>
:::info
<p>
   <img src="/img/icon-1-done.svg" width="20" alt="First step" /> <a href="kotlin-tour-hello-world">Hello world</a><br />
        <img src="/img/icon-2.svg" width="20" alt="Second step" /> <strong>基本类型 (Basic types)</strong><br />
        <img src="/img/icon-3-todo.svg" width="20" alt="Third step" /> <a href="kotlin-tour-collections">集合 (Collections)</a><br />
        <img src="/img/icon-4-todo.svg" width="20" alt="Fourth step" /> <a href="kotlin-tour-control-flow">控制流 (Control flow)</a><br />
        <img src="/img/icon-5-todo.svg" width="20" alt="Fifth step" /> <a href="kotlin-tour-functions">函数 (Functions)</a><br />
        <img src="/img/icon-6-todo.svg" width="20" alt="Sixth step" /> <a href="kotlin-tour-classes">类 (Classes)</a><br />
        <img src="/img/icon-7-todo.svg" width="20" alt="Final step" /> <a href="kotlin-tour-null-safety">Null 安全 (Null safety)</a>
</p>

:::

Kotlin 中的每个变量和数据结构都有一个类型 (type)。类型非常重要，因为它们告诉编译器你可以对该变量或数据结构执行哪些操作。换句话说，它有哪些函数和属性。

在上一章中，Kotlin 能够在之前的示例中判断出 `customers` 的类型为 [`Int`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-int/)。
Kotlin **推断 (infer)** 类型的能力称为**类型推断 (type inference)**。`customers` 被赋予一个整数值。由此，Kotlin 推断出 `customers` 具有数值类型 `Int`。因此，编译器知道你可以对 `customers` 执行算术运算：

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
`+=`、`-=`、`*=`、`/=` 和 `%=` 是增量赋值运算符。 更多信息，请参见 [增量赋值](operator-overloading#augmented-assignments)。

:::

总的来说，Kotlin 具有以下基本类型：

| **类别 (Category)**           | **基本类型 (Basic types)**                    | **示例代码 (Example code)**                                              |
|------------------------|------------------------------------|---------------------------------------------------------------|
| 整数 (Integers)               | `Byte`、`Short`、`Int`、`Long`     | `val year: Int = 2020`                                        |
| 无符号整数 (Unsigned integers)      | `UByte`、`UShort`、`UInt`、`ULong` | `val score: UInt = 100u`                                      |
| 浮点数 (Floating-point numbers) | `Float`、`Double`                  | `val currentTemp: Float = 24.5f`、`val price: Double = 19.99` |
| 布尔值 (Booleans)               | `Boolean`                          | `val isEnabled: Boolean = true`                               |
| 字符 (Characters)             | `Char`                             | `val separator: Char = ','`                                   |
| 字符串 (Strings)                | `String`                           | `val message: String = "Hello, world!"`                       |

有关基本类型及其属性的更多信息，请参见 [基本类型](basic-types)。

有了这些知识，你可以声明变量并在以后初始化它们。 只要变量在第一次读取之前被初始化，Kotlin 就可以管理这一点。

要声明一个未初始化的变量，请使用 `:` 指定其类型。 例如：

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

如果你在读取变量之前没有初始化它，你将看到一个错误：

```kotlin
fun main() {

    // Variable declared without initialization
    val d: Int
    
    // Triggers an error
    println(d)
    // Variable 'd' must be initialized

}
```

现在你已经知道如何声明基本类型，是时候学习 [集合](kotlin-tour-collections) 了。

## 练习 (Practice)

### 练习 (Exercise)

为每个变量显式声明正确的类型：

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

## 下一步 (Next step)

[集合 (Collections)](kotlin-tour-collections)