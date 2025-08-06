[//]: # (title: 基本类型)

<no-index/>

<tldr>
    <p><img src="icon-1-done.svg" width="20" alt="第一步" /> <a href="kotlin-tour-hello-world.md">你好世界</a><br />
        <img src="icon-2.svg" width="20" alt="第二步" /> <strong>基本类型</strong><br />
        <img src="icon-3-todo.svg" width="20" alt="第三步" /> <a href="kotlin-tour-collections.md">集合</a><br />
        <img src="icon-4-todo.svg" width="20" alt="第四步" /> <a href="kotlin-tour-control-flow.md">控制流</a><br />
        <img src="icon-5-todo.svg" width="20" alt="第五步" /> <a href="kotlin-tour-functions.md">函数</a><br />
        <img src="icon-6-todo.svg" width="20" alt="第六步" /> <a href="kotlin-tour-classes.md">类</a><br />
        <img src="icon-7-todo.svg" width="20" alt="最后一步" /> <a href="kotlin-tour-null-safety.md">空安全</a></p>
</tldr>

Kotlin 中的每个变量和数据结构都有一个类型。类型非常重要，因为它们告诉编译器你允许对该变量或数据结构执行哪些操作。换句话说，它具有哪些函数和属性。

在上一章节中，Kotlin 在之前的示例中能够识别出 `customers` 的类型为 [`Int`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-int/)。Kotlin **推断**类型的能力称为**类型推断**。`customers` 被赋予了一个整型值。由此，Kotlin 推断 `customers` 具有数值类型 `Int`。因此，编译器知道你可以对 `customers` 执行算术操作：

```kotlin
fun main() {
//sampleStart
    var customers = 10

    // 一些顾客离开队列
    customers = 8

    customers = customers + 3 // 加法示例: 11
    customers += 7            // 加法示例: 18
    customers -= 3            // 减法示例: 15
    customers *= 2            // 乘法示例: 30
    customers /= 3            // 除法示例: 10

    println(customers) // 10
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-basic-types-arithmetic"}

> `+=`、`-=`、`*=`、`/=` 和 `%=` 是增强赋值操作符。关于更多信息，请参见[增强赋值](operator-overloading.md#augmented-assignments)。
> 
{style="tip"}

总而言之，Kotlin 具有以下基本类型：

| **类别**       | **基本类型**                       | **示例代码**                                                  |
| -------------- | ---------------------------------- | ------------------------------------------------------------- |
| 整型           | `Byte`、`Short`、`Int`、`Long`     | `val year: Int = 2020`                                        |
| 无符号整型     | `UByte`、`UShort`、`UInt`、`ULong` | `val score: UInt = 100u`                                      |
| 浮点数         | `Float`、`Double`                  | `val currentTemp: Float = 24.5f`、`val price: Double = 19.99` |
| 布尔型         | `Boolean`                          | `val isEnabled: Boolean = true`                               |
| 字符           | `Char`                             | `val separator: Char = ','`                                   |
| 字符串         | `String`                           | `val message: String = "Hello, world!"`                       |

关于基本类型及其属性的更多信息，请参见[基本类型](basic-types.md)。

掌握了这些知识，你可以声明变量并在以后初始化它们。只要变量在首次读取之前被初始化，Kotlin 就能处理这种情况。

要声明一个未初始化的变量，请使用 `:` 指定其类型。例如：

```kotlin
fun main() {
//sampleStart
    // 未初始化的变量声明
    val d: Int
    // 已初始化的变量
    d = 3

    // 显式指定类型并初始化的变量
    val e: String = "hello"

    // 变量可以被读取，因为它们已经初始化
    println(d) // 3
    println(e) // hello
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-basic-types-initialization"}

如果你在读取变量之前没有初始化它，你会看到一个错误：

```kotlin
fun main() {
//sampleStart
    // 未初始化的变量声明
    val d: Int
    
    // 触发一个错误
    println(d)
    // 变量 'd' 必须被初始化
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-basic-types-no-initialization" validate="false"}

既然你已经知道如何声明基本类型，是时候学习[集合](kotlin-tour-collections.md)了。

## 实践

### 练习 {initial-collapse-state="collapsed" collapsible="true"}

显式声明每个变量的正确类型：

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
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="示例解决方案" id="kotlin-tour-basic-types-solution"}

## 下一步

[集合](kotlin-tour-collections.md)