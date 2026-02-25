[//]: # (title: Hello world)

<no-index/>

<tldr>
    <p><img src="icon-1.svg" width="20" alt="First step" /> <strong>Hello world</strong><br />
        <img src="icon-2-todo.svg" width="20" alt="Second step" /> <a href="kotlin-tour-basic-types.md">基本类型</a><br />
        <img src="icon-3-todo.svg" width="20" alt="Third step" /> <a href="kotlin-tour-collections.md">集合</a><br />
        <img src="icon-4-todo.svg" width="20" alt="Fourth step" /> <a href="kotlin-tour-control-flow.md">控制流</a><br />
        <img src="icon-5-todo.svg" width="20" alt="Fifth step" /> <a href="kotlin-tour-functions.md">函数</a><br />
        <img src="icon-6-todo.svg" width="20" alt="Sixth step" /> <a href="kotlin-tour-classes.md">类</a><br />
        <img src="icon-7-todo.svg" width="20" alt="Final step" /> <a href="kotlin-tour-null-safety.md">空安全</a></p>
</tldr>

> 阅读需 3 分钟
> 
{style="tip"}

这是一个打印 "Hello, world!" 的简单程序：

```kotlin
fun main() {
    println("Hello, world!")
    // Hello, world!
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="hello-world-kotlin"}

在 Kotlin 中：

* `fun` 用于声明函数
* `main()` 函数是程序的起点
* 函数体写在花括号 `{}` 内
* [`println()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.io/println.html) 和 [`print()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.io/print.html) 函数将其实参打印到标准输出

函数是执行特定任务的一组指令。一旦创建了函数，就可以在需要执行该任务时随时使用它，而无需重新编写指令。我们将在后续章节中更详细地讨论函数。在此之前，所有示例都将使用 `main()` 函数。

## 变量

所有程序都需要能够存储数据，而变量可以帮助您实现这一点。在 Kotlin 中，您可以声明：

* 使用 `val` 声明只读变量
* 使用 `var` 声明可变变量

> 只读变量一旦赋值就无法更改。
>
{style="note"}

要赋值，请使用赋值运算符 `=`。

例如：

```kotlin
fun main() { 
//sampleStart
    val popcorn = 5    // 有 5 盒爆米花
    val hotdog = 7     // 有 7 个热狗
    var customers = 10 // 队列中有 10 名顾客
    
    // 一些顾客离开了队列
    customers = 8
    println(customers)
    // 8
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-variables"}

> 变量可以在程序开头的 `main()` 函数之外声明。以此种方式声明的变量被称为声明在**顶层**。
> 
{style="tip"}

由于 `customers` 是一个可变变量，其值在声明后可以重新赋值。

> 我们建议默认将所有变量声明为只读变量 (`val`)。仅在确实需要时才使用可变变量 (`var`)。这样，您就不太可能意外更改不该更改的内容。
> 
{style="note"}

## 字符串模板

了解如何将变量的内容打印到标准输出非常有用。您可以使用**字符串模板**来实现。您可以使用模板表达式来访问存储在变量和其他对象中的数据，并将其转换为字符串。字符串值是双引号 `"` 中的字符序列。模板表达式始终以美元符号 `$` 开头。

要在模板表达式中求值一小段代码，请在美元符号 `$` 后将代码放在花括号 `{}` 中。

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

有关更多信息，请参阅[字符串模板](strings.md#string-templates)。

您会注意到变量没有声明任何类型。Kotlin 会自动推断类型：`Int`。本教程将在[下一章](kotlin-tour-basic-types.md)中介绍 Kotlin 的各种基本类型以及如何声明它们。

## 练习

### 习题 {initial-collapse-state="collapsed" collapsible="true"}

完成代码，使程序向标准输出打印 `"Mary is 20 years old"`：

|---|---|
```kotlin
fun main() {
    val name = "Mary"
    val age = 20
    // 在此处编写您的代码
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
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="示例解法" id="kotlin-tour-hello-world-solution"}

## 下一步

[基本类型](kotlin-tour-basic-types.md)