---
title: 你好，世界
---
<no-index/>

:::info
<p>
   <img src="/img/icon-1.svg" width="20" alt="First step" /> <strong>Hello world（你好，世界）</strong><br />
        <img src="/img/icon-2-todo.svg" width="20" alt="Second step" /> <a href="kotlin-tour-basic-types">基本类型 (Basic types)</a><br />
        <img src="/img/icon-3-todo.svg" width="20" alt="Third step" /> <a href="kotlin-tour-collections">集合 (Collections)</a><br />
        <img src="/img/icon-4-todo.svg" width="20" alt="Fourth step" /> <a href="kotlin-tour-control-flow">控制流 (Control flow)</a><br />
        <img src="/img/icon-5-todo.svg" width="20" alt="Fifth step" /> <a href="kotlin-tour-functions">函数 (Functions)</a><br />
        <img src="/img/icon-6-todo.svg" width="20" alt="Sixth step" /> <a href="kotlin-tour-classes">类 (Classes)</a><br />
        <img src="/img/icon-7-todo.svg" width="20" alt="Final step" /> <a href="kotlin-tour-null-safety">Null 安全 (Null safety)</a>
</p>

:::

这是一个简单的打印 "Hello, world!" 的程序：

```kotlin
fun main() {
    println("Hello, world!")
    // Hello, world!
}
```

在 Kotlin 中:

* `fun` 用于声明一个函数
* `main()` 函数是程序的入口
* 函数体写在花括号 `{}` 内
* [`println()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.io/println.html) 和 [`print()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.io/print.html) 函数将其参数打印到标准输出

函数是一组执行特定任务的指令。一旦你创建了一个函数，你可以在任何需要执行该任务的时候使用它，而无需重新编写指令。函数将在后面的章节中详细讨论。在此之前，所有示例都将使用 `main()` 函数。

## 变量 (Variables)

所有程序都需要能够存储数据，而变量可以帮助你做到这一点。在 Kotlin 中，你可以声明：

* 只读变量，使用 `val`
* 可变变量，使用 `var`

:::note
一旦为只读变量赋值，就无法更改它的值。

:::

要赋值，请使用赋值运算符 `=`。

例如：

```kotlin
fun main() { 

    val popcorn = 5    // 有 5 盒爆米花
    val hotdog = 7     // 有 7 个热狗
    var customers = 10 // 队列中有 10 个顾客
    
    // 一些顾客离开了队列
    customers = 8
    println(customers)
    // 8

}
```

变量可以在程序的开头，`main()` 函数之外声明。以这种方式声明的变量被称为在**顶层 (top level)**声明。

由于 `customers` 是一个可变变量，因此可以在声明后重新赋值。

我们建议默认将所有变量声明为只读 (`val`)。 只有在必要时才声明可变变量 (`var`)。

:::

## 字符串模板 (String templates)

了解如何将变量的内容打印到标准输出非常有用。 你可以使用**字符串模板 (string templates)**来做到这一点。 你可以使用模板表达式来访问存储在变量和其他对象中的数据，并将它们转换为字符串。 字符串值是用双引号 `"` 括起来的字符序列。 模板表达式总是以美元符号 `$` 开头。

要在模板表达式中计算一段代码，请将代码放在美元符号 `$` 后的花括号 `{}` 中。

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

更多信息，请参阅 [字符串模板 (String templates)](strings#string-templates)。

你会注意到没有为变量声明任何类型。 Kotlin 已经推断出了类型：`Int`。 本教程将在[下一章](kotlin-tour-basic-types)中解释不同的 Kotlin 基本类型以及如何声明它们。

## 练习 (Practice)

### 练习 (Exercise)

完成代码，使程序将 `"Mary is 20 years old"` 打印到标准输出：

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

[基本类型 (Basic types)](kotlin-tour-basic-types)