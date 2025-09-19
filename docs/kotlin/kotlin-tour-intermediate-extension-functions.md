[//]: # (title: 中级: 扩展函数)

<no-index/>

<tldr>
    <p><img src="icon-1.svg" width="20" alt="第一步" /> <strong>扩展函数</strong><br />
        <img src="icon-2-todo.svg" width="20" alt="第二步" /> <a href="kotlin-tour-intermediate-scope-functions.md">作用域函数</a><br />
        <img src="icon-3-todo.svg" width="20" alt="第三步" /> <a href="kotlin-tour-intermediate-lambdas-receiver.md">带接收者的 lambda 表达式</a><br />
        <img src="icon-4-todo.svg" width="20" alt="第四步" /> <a href="kotlin-tour-intermediate-classes-interfaces.md">类和接口</a><br />
        <img src="icon-5-todo.svg" width="20" alt="第五步" /> <a href="kotlin-tour-intermediate-objects.md">对象</a><br />
        <img src="icon-6-todo.svg" width="20" alt="第六步" /> <a href="kotlin-tour-intermediate-open-special-classes.md">开放类和特殊类</a><br />
        <img src="icon-7-todo.svg" width="20" alt="第七步" /> <a href="kotlin-tour-intermediate-properties.md">属性</a><br />
        <img src="icon-8-todo.svg" width="20" alt="第八步" /> <a href="kotlin-tour-intermediate-null-safety.md">空安全</a><br />
        <img src="icon-9-todo.svg" width="20" alt="第九步" /> <a href="kotlin-tour-intermediate-libraries-and-apis.md">库和 API</a></p>
</tldr>

在本章中，你将探索特殊的 Kotlin 函数，它们能让你的代码更简洁易读。了解它们如何帮助你使用高效设计模式，将你的项目提升到新的水平。

## 扩展函数

在软件开发中，你经常需要在不修改原始源代码的情况下，改变程序的行为。例如，在你的项目中，你可能想为来自第三方库的类添加额外功能。

扩展函数允许你为类添加额外功能以扩展它。你调用扩展函数的方式与调用类的成员函数的方式相同，使用点号 `.`。

在介绍扩展函数的语法之前，你需要理解 **接收者类型** 和 **接收者对象** 这两个术语。
接收者对象是函数在其上被调用的对象。换句话说，接收者是信息被共享的位置或与之共享的对象。

![发送者和接收者的示例](receiver-highlight.png){width="500"}

在此示例中，`main()` 函数调用了 [`.first()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.collections/first.html) 函数来返回 list 中的第一个元素。
`.first()` 函数在 `readOnlyShapes` 变量上调用，因此 `readOnlyShapes` 变量是接收者对象。

要创建扩展函数，请写下你想要扩展的类的名称，后跟一个 `.` 和你的函数名称。然后继续编写函数声明的其余部分，包括其实参和返回类型。

例如：

```kotlin
fun String.bold(): String = "<b>$this</b>"

fun main() {
    // "hello" 是接收者对象
    println("hello".bold())
    // <b>hello</b>
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-extension-function"}

在此示例中：

*   `String` 是被扩展的类，也称为接收者类型。
*   `bold` 是扩展函数的名称。
*   `.bold()` 扩展函数的返回类型是 `String`。
*   `"hello"`，一个 `String` 的实例，是接收者对象。
*   接收者通过 [关键字](keyword-reference.md)：`this` 在函数体内部被访问。
*   字符串内插 (`$this`) 用于访问 `this` 的值。
*   `.bold()` 扩展函数接受一个字符串，并将其包裹在 `<b>` HTML 元素中以显示粗体文本。

## 面向扩展的设计

你可以在任何地方定义扩展函数，这使你能够创建面向扩展的设计。这些设计将核心功能与有用但非必要的特性分开，使你的代码更易读、更易维护。

一个很好的例子是 Ktor 库中的 [`HttpClient`](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client/-http-client/index.html) 类，它有助于执行网络请求。其核心功能是单个 `request()` 函数，它接收 HTTP 请求所需的所有信息：

```kotlin
class HttpClient {
    fun request(method: String, url: String, headers: Map<String, String>): HttpResponse {
        // Network code
    }
}
```
{validate="false"}

在实践中，最常见的 HTTP 请求是 GET 或 POST 请求。对于库而言，为这些常见用例提供更短的名称是合理的。然而，这些不需要编写新的网络代码，只需要特定的请求调用。换句话说，它们是定义为独立的 `.get()` 和 `.post()` 扩展函数的理想候选者：

```kotlin
fun HttpClient.get(url: String): HttpResponse = request("GET", url, emptyMap())
fun HttpClient.post(url: String): HttpResponse = request("POST", url, emptyMap())
```
{validate="false"}

这些 `.get()` 和 `.post()` 函数会使用正确的 HTTP 方法调用 `request()` 函数，因此你无需手动指定。它们简化了你的代码并使其更易于理解：

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

    // 直接使用 request() 发起 GET 请求
    val getResponseWithMember = client.request("GET", "https://example.com", emptyMap())

    // 使用 get() 扩展函数发起 GET 请求
    val getResponseWithExtension = client.get("https://example.com")
}
```
{validate="false"}

这种面向扩展的方法在 Kotlin 的 [标准库](https://kotlinlang.org/api/latest/jvm/stdlib/) 和其他库中被广泛使用。例如，`String` 类有许多 [扩展函数](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/#extension-functions) 可帮助你处理字符串。

关于扩展函数的更多信息，请参见 [Extensions](extensions.md)。

## 实践

### 练习 1 {initial-collapse-state="collapsed" collapsible="true" id="extension-functions-exercise-1"}

编写一个名为 `isPositive` 的扩展函数，它接受一个整数并检测它是否为正数。

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

编写一个名为 `toLowercaseString` 的扩展函数，它接受一个字符串并返回其小写版本。

<deflist collapsible="true">
    <def title="提示">
        使用 <code>String</code> 类型的 <a href="https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/lowercase.html"> <code>.lowercase()</code>
        </a> 函数。
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

[中级: 作用域函数](kotlin-tour-intermediate-scope-functions.md)