[//]: # (title: 进阶：扩展函数)

<no-index/>

<tldr>
    <p><img src="icon-1.svg" width="20" alt="第一步" /> <strong>扩展函数</strong><br />
        <img src="icon-2-todo.svg" width="20" alt="第二步" /> <a href="kotlin-tour-intermediate-scope-functions.md">作用域函数</a><br />
        <img src="icon-3-todo.svg" width="20" alt="第三步" /> <a href="kotlin-tour-intermediate-lambdas-receiver.md">带接收者的 Lambda 表达式</a><br />
        <img src="icon-4-todo.svg" width="20" alt="第四步" /> <a href="kotlin-tour-intermediate-classes-interfaces.md">类和接口</a><br />
        <img src="icon-5-todo.svg" width="20" alt="第五步" /> <a href="kotlin-tour-intermediate-objects.md">对象</a><br />
        <img src="icon-6-todo.svg" width="20" alt="第六步" /> <a href="kotlin-tour-intermediate-open-special-classes.md">开放类与特殊类</a><br />
        <img src="icon-7-todo.svg" width="20" alt="第七步" /> <a href="kotlin-tour-intermediate-properties.md">属性</a><br />
        <img src="icon-8-todo.svg" width="20" alt="第八步" /> <a href="kotlin-tour-intermediate-null-safety.md">空安全</a><br />
        <img src="icon-9-todo.svg" width="20" alt="第九步" /> <a href="kotlin-tour-intermediate-libraries-and-apis.md">库和 API</a></p>
</tldr>

在本章中，你将探索特殊的 Kotlin 函数，它们能让你的代码更简洁易读。了解它们如何帮助你使用高效的设计模式，从而将你的项目提升到新的水平。

## 扩展函数

在软件开发中，你经常需要修改程序的行为，但又不想改变原始源代码。例如，在你的项目中，你可能希望为第三方库中的类添加额外的功能。

扩展函数允许你为现有类添加额外功能。调用扩展函数的方式与调用类的成员函数相同。

在介绍扩展函数的语法之前，你需要理解**接收者类型 (receiver type)** 和 **接收者对象 (receiver object)** 这两个术语。

接收者对象是函数被调用时所依附的对象。换句话说，接收者是信息被共享的地方或对象。

![发送者和接收者的示例](receiver-highlight.png){width="500"}

在此示例中，`main()` 函数调用了 [`.first()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.collections/first.html) 函数。`.first()` 函数是**在** `readOnlyShapes` 变量上调用的，因此 `readOnlyShapes` 变量就是接收者。

接收者对象有一个**类型**，这样编译器才能理解该函数何时可以使用。

此示例使用标准库中的 `.first()` 函数来返回列表中的第一个元素。要创建你自己的扩展函数，请先编写你想要扩展的类名，后面跟着一个 `.`，然后是你的函数名。接着完成函数声明的其余部分，包括其参数和返回类型。

例如：

```kotlin
fun String.bold(): String = "<b>$this</b>"

fun main() {
    // "hello" is the receiver object
    println("hello".bold())
    // <b>hello</b>
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-extension-function"}

在此示例中：

*   `String` 是被扩展的类，也称为接收者类型。
*   `bold` 是扩展函数的名称。
*   `.bold()` 扩展函数的返回类型是 `String`。
*   `"hello"`，一个 `String` 实例，是接收者对象。
*   在函数体内部，通过 [关键字](keyword-reference.md) `this` 访问接收者对象。
*   字符串模板 (`$this`) 用于访问 `this` 的值。
*   `.bold()` 扩展函数接受一个字符串，并将其包裹在 `<b>` HTML 元素中以表示粗体文本。

## 扩展导向设计 (Extension-oriented design)

你可以在任何地方定义扩展函数，这使你能够创建扩展导向的设计。这些设计将核心功能与有用但非必要的功能分离，从而使你的代码更易读和维护。

一个很好的例子是 Ktor 库中的 [`HttpClient`](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client/-http-client/index.html) 类，它有助于执行网络请求。其核心功能是单个 `request()` 函数，它接受 HTTP 请求所需的所有信息：

```kotlin
class HttpClient {
    fun request(method: String, url: String, headers: Map<String, String>): HttpResponse {
        // Network code
    }
}
```
{validate="false"}

实际上，最常见的 HTTP 请求是 GET 或 POST 请求。对于库而言，为这些常见用例提供更短的名称是有意义的。然而，这并不需要编写新的网络代码，只需要一个特定的请求调用。换句话说，它们是作为独立的 `.get()` 和 `.post()` 扩展函数定义的绝佳候选者：

```kotlin
fun HttpClient.get(url: String): HttpResponse = request("GET", url, emptyMap())
fun HttpClient.post(url: String): HttpResponse = request("POST", url, emptyMap())
```
{validate="false"}

这些 `.get()` 和 `.post()` 函数会调用 `request()` 函数并传入正确的 HTTP 方法，因此你无需手动指定。它们简化了你的代码，使其更易于理解：

```kotlin
class HttpClient {
    fun request(method: String, url: String, headers: Map<String, String>): HttpResponse {
        println("Requesting $method to $url with headers: $headers")
        return HttpResponse("Response from $url")
    }
}

fun HttpClient.get(url: String): HttpResponse = request("GET", url, emptyMap())

fun main() {
    val client = HttpClient()

    // Making a GET request using request() directly
    val getResponseWithMember = client.request("GET", "https://example.com", emptyMap())

    // Making a GET request using the get() extension function
    val getResponseWithExtension = client.get("https://example.com")
}
```
{validate="false"}

这种扩展导向的方法在 Kotlin 的 [标准库](https://kotlinlang.org/api/latest/jvm/stdlib/) 和其他库中被广泛使用。例如，`String` 类有许多 [扩展函数](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/#extension-functions) 可以帮助你处理字符串。

有关扩展函数的更多信息，请参阅 [扩展](extensions.md)。

## 练习

### 练习 1 {initial-collapse-state="collapsed" collapsible="true" id="extension-functions-exercise-1"}

编写一个名为 `isPositive` 的扩展函数，该函数接受一个整数并检查它是否为正数。

|---|---|
```kotlin
fun Int.// Write your code here

fun main() {
    println(1.isPositive())
    // true
}
```
{validate="false" kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-extension-functions-exercise-1"}

|---|---|
```kotlin
fun Int.isPositive(): Boolean = this > 0

fun main() {
    println(1.isPositive())
    // true
}
```
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="示例解决方案" id="kotlin-tour-extension-functions-solution-1"}

### 练习 2 {initial-collapse-state="collapsed" collapsible="true" id="extension-functions-exercise-2"}

编写一个名为 `toLowercaseString` 的扩展函数，该函数接受一个字符串并返回其小写版本。

<deflist collapsible="true">
    <def title="提示">
        对 <code>String</code> 类型使用 <a href="https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/lowercase.html"><code>.lowercase()</code></a> 函数。
    </def>
</deflist>

|---|---|
```kotlin
fun // Write your code here

fun main() {
    println("Hello World!".toLowercaseString())
    // hello world!
}
```
{validate="false" kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-extension-functions-exercise-2"}

|---|---|
```kotlin
fun String.toLowercaseString(): String = this.lowercase()

fun main() {
    println("Hello World!".toLowercaseString())
    // hello world!
}
```
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="示例解决方案" id="kotlin-tour-extension-functions-solution-2"}

## 下一步

[进阶：作用域函数](kotlin-tour-intermediate-scope-functions.md)