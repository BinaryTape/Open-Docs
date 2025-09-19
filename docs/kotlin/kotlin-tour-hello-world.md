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

这是一个打印“Hello, world!”的简单程序：

```kotlin
fun main() {
    println("Hello, world!")
    // Hello, world!
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="hello-world-kotlin"}

在 Kotlin 中：

* `fun` 用于声明一个函数
* `main()` 函数是程序的起点
* 函数的主体写在花括号 `{}` 内
* [`println()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.io/println.html) 和 [`print()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.io/print.html) 函数将它们的实参打印到标准输出

函数是执行特定任务的一组指令。创建函数后，你可以随时使用它来执行该任务，而无需重复编写指令。函数将在后面的章节中更详细地讨论。在此之前，所有示例都使用 `main()` 函数。

## 变量

所有程序都需要能够存储数据，而变量正是为此而生。在 Kotlin 中，你可以声明：

* 用 `val` 声明只读变量
* 用 `var` 声明可变变量

> 只读变量一旦赋值后，就不能再更改它的值了。
>
{style="note"}

要赋值，请使用赋值操作符 `=`。

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

> 变量可以声明在 `main()` 函数之外，在程序的开头。以这种方式声明的变量被称为**顶层**声明。
> 
{style="tip"}

由于 `customers` 是一个可变变量，它可以在声明后重新赋值。

> 我们建议默认将所有变量声明为只读 (`val`)。只有在你确实需要时才使用可变变量 (`var`)。这样，你就不太可能意外地更改不打算更改的内容。
> 
{style="note"}

## 字符串模板

了解如何将变量内容打印到标准输出会很有用。你可以使用**字符串模板**来完成此操作。你可以使用模板表达式来访问存储在变量及其他对象中的数据，并将其转换为字符串。字符串值是双引号 `""` 中的字符序列。模板表达式总是以美元符号 `$` 开头。

要在模板表达式中求值一段代码，请在美元符号 `$` 后面将代码放在花括号 `{}` 内。

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

有关更多信息，请参阅 [字符串模板](strings.md#string-templates)。

你会注意到变量没有声明任何类型。Kotlin 已经推断出类型本身是 `Int`。本教程将在[下一章](kotlin-tour-basic-types.md)中解释不同的 Kotlin 基本类型以及如何声明它们。

## 练习

### 练习 {initial-collapse-state="collapsed" collapsible="true"}

补全代码，使程序将 `"Mary is 20 years old"` 打印到标准输出：

|---|---|
```kotlin
fun main() {
    val name = "Mary"
    val age = 20
    // 在此处编写你的代码
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
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="示例解决方案" id="kotlin-tour-hello-world-solution"}

## 下一步

[基本类型](kotlin-tour-basic-types.md)