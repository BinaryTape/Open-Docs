[//]: # (title: 与 JavaScript 的互操作性)

<primary-label ref="beta"/> 

Kotlin/Wasm 允许你在 Kotlin 中使用 JavaScript 代码，反之亦然，在 JavaScript 中使用 Kotlin 代码。

与 [Kotlin/JS](js-overview.md) 类似，Kotlin/Wasm 编译器也具有与 JavaScript 的互操作性。如果你熟悉 Kotlin/JS 互操作性，你会发现 Kotlin/Wasm 的互操作性很相似。然而，仍有一些主要区别需要考虑。

> Kotlin/Wasm 处于 [Beta](components-stability.md) 阶段。它随时可能更改。请在生产环境之前的使用场景中使用。我们非常感谢你在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-56492) 中提供反馈。
>
{style="note"}

## 在 Kotlin 中使用 JavaScript 代码

了解如何在 Kotlin 中通过使用 `external` 声明、带有 JavaScript 代码片段的函数以及 `@JsModule` 注解来使用 JavaScript 代码。

### External 声明

外部 JavaScript 代码默认情况下在 Kotlin 中不可见。
要在 Kotlin 中使用 JavaScript 代码，你可以使用 `external` 声明来描述其 API。

#### JavaScript 函数

考虑以下 JavaScript 函数：

```javascript
function greet (name) {
    console.log("Hello, " + name + "!");
}
```

你可以在 Kotlin 中将其声明为 `external` 函数：

```kotlin
external fun greet(name: String)
```

`external` 函数没有函数体，你可以将其作为常规 Kotlin 函数调用：

```kotlin
fun main() {
    greet("Alice")
}
```

#### JavaScript 属性

考虑以下全局 JavaScript 变量：

```javascript
let globalCounter = 0;
```

你可以在 Kotlin 中使用 external `var` 或 `val` 属性来声明它：

```kotlin
external var globalCounter: Int
```

这些属性在外部初始化。这些属性不能在 Kotlin 代码中带有 `= value` 初始化器。

#### JavaScript 类

考虑以下 JavaScript 类：

```javascript
class Rectangle {
    constructor (height, width) {
        this.height = height;
        this.width = width;
    }

    area () {
        return this.height * this.width;
    }
}
```

你可以在 Kotlin 中将其作为 `external` 类使用：

```kotlin
external class Rectangle(height: Double, width: Double) : JsAny {
    val height: Double
    val width: Double
    fun area(): Double
}
```

`external` 类内部的所有声明都被隐式视为 `external`。

#### External 接口

你可以在 Kotlin 中描述 JavaScript 对象的形状。考虑以下 JavaScript 函数及其返回值：

```javascript
function createUser (name, age) {
    return { name: name, age: age };
}
```

请看如何在 Kotlin 中使用 `external interface User` 类型来描述其形状：

```kotlin
external interface User : JsAny {
    val name: String
    val age: Int
}

external fun createUser(name: String, age: Int): User
```

External 接口没有运行时类型信息，并且是仅在编译期存在的概念。
因此，external 接口与常规接口相比有一些限制：
* 你不能在 `is` 检测的右侧使用它们。
* 你不能在类字面量表达式（例如 `User::class`）中使用它们。
* 你不能将它们作为实化类型实参传递。
* 使用 `as` 转换为 external 接口总是成功。

#### External 对象

考虑以下包含一个对象的 JavaScript 变量：

```javascript
let Counter = {
    value: 0,
    step: 1,
    increment () {
        this.value += this.step;
    }
};
```

你可以在 Kotlin 中将其作为 `external` 对象使用：

```kotlin
external object Counter : JsAny {
    fun increment()
    val value: Int
    var step: Int
}
```

#### External 类型层级结构

与常规类和接口类似，你可以声明 `external` 声明来继承其他 `external` 类并实现 `external` 接口。
但是，你不能在同一类型层级结构中混合使用 `external` 和非 `external` 声明。

### 带有 JavaScript 代码的 Kotlin 函数

你可以通过定义一个带有 `= js("code")` 函数体的函数，向 Kotlin/Wasm 代码添加 JavaScript 片段：

```kotlin
fun getCurrentURL(): String =
    js("window.location.href")
```

如果你想运行一个 JavaScript 语句块，请使用花括号 `{}` 将字符串内的代码括起来：

```kotlin
fun setLocalSettings(value: String): Unit = js(
    """{
        localStorage.setItem('settings', value);
}"""
)
```

如果你想返回一个对象，请用圆括号 `()` 将花括号 `{}` 括起来：

```kotlin
fun createJsUser(name: String, age: Int): JsAny =
    js("({ name: name, age: age })")
```

Kotlin/Wasm 以特殊方式处理对 `js()` 函数的调用，并且其实现有一些限制：
* `js()` 函数调用必须提供字符串字面量实参。
* `js()` 函数调用必须是函数体中的唯一表达式。
* `js()` 函数只允许从包级函数中调用。
* 函数返回类型必须显式提供。
* [类型对应](#type-correspondence)受到限制，类似于 `external fun`。

Kotlin 编译器会将代码字符串放入生成的 JavaScript 文件中的一个函数中，并将其导入 WebAssembly 格式。
Kotlin 编译器不验证这些 JavaScript 片段。
如果存在 JavaScript 语法错误，它们将在你运行 JavaScript 代码时报告。

> `@JsFun` 注解具有类似功能，并且可能会被弃用。
>
{style="note"}

### JavaScript 模块

默认情况下，`external` 声明对应于 JavaScript 全局作用域。如果你使用 [`@JsModule` 注解](js-modules.md#jsmodule-annotation) 注解一个 Kotlin 文件，那么其中所有 `external` 声明都将从指定模块中导入。

考虑以下 JavaScript 代码示例：

```javascript
// users.mjs
export let maxUsers = 10;

export class User {
    constructor (username) {
        this.username = username;
    }
}
```

在 Kotlin 中使用 `@JsModule` 注解来使用此 JavaScript 代码：

```kotlin
// Kotlin
@file:JsModule("./users.mjs")

external val maxUsers: Int

external class User : JsAny {
    constructor(username: String)

    val username: String
}
```

### 数组互操作性

你可以将 JavaScript 的 `JsArray<T>` 复制到 Kotlin 的原生 `Array` 或 `List` 类型中；同样地，你也可以将这些 Kotlin 类型复制到 `JsArray<T>`。

要将 `JsArray<T>` 转换为 `Array<T>` 或反之，请使用可用的[适配器函数](https://github.com/Kotlin/kotlinx-browser/blob/dfbdceed314567983c98f1d66e8c2e10d99c5a55/src/wasmJsMain/kotlin/arrayCopy.kt)之一。

以下是泛型之间转换的示例：

```kotlin
val list: List<JsString> =
    listOf("Kotlin", "Wasm").map { it.toJsString() }

// Uses .toJsArray() to convert List or Array to JsArray
val jsArray: JsArray<JsString> = list.toJsArray()

// Uses .toArray() and .toList() to convert it back to Kotlin types 
val kotlinArray: Array<JsString> = jsArray.toArray()
val kotlinList: List<JsString> = jsArray.toList()
```

类似的适配器函数也可用于将类型化数组转换为其 Kotlin 等效类型（例如，`IntArray` 和 `Int32Array`）。关于详细信息和实现，请参见 [`kotlinx-browser` 版本库](https://github.com/Kotlin/kotlinx-browser/blob/dfbdceed314567983c98f1d66e8c2e10d99c5a55/src/wasmJsMain/kotlin/arrayCopy.kt)。

以下是类型化数组之间转换的示例：

```kotlin
import org.khronos.webgl.*

    // ...

    val intArray: IntArray = intArrayOf(1, 2, 3)
    
    // Uses .toInt32Array() to convert Kotlin IntArray to JavaScript Int32Array
    val jsInt32Array: Int32Array = intArray.toInt32Array()
    
    // Uses toIntArray() to convert JavaScript Int32Array back to Kotlin IntArray
    val kotlnIntArray: IntArray = jsInt32Array.toIntArray()
```

## 在 JavaScript 中使用 Kotlin 代码

了解如何在 JavaScript 中通过使用 `@JsExport` 注解来使用你的 Kotlin 代码。

### 带有 @JsExport 注解的函数

要使 Kotlin/Wasm 函数可供 JavaScript 代码使用，请使用 `@JsExport` 注解：

```kotlin
// Kotlin/Wasm

@JsExport
fun addOne(x: Int): Int = x + 1
```

Kotlin/Wasm 函数被 `@JsExport` 注解标记后，将作为生成的 `.mjs` 模块 `default` 导出项的属性可见。
然后你可以在 JavaScript 中使用此函数：

```javascript
// JavaScript

import exports from "./module.mjs"

exports.addOne(10)
```

Kotlin/Wasm 编译器能够从你的 Kotlin 代码中任何 `@JsExport` 声明生成 TypeScript 定义。
这些定义可以被 IDE 和 JavaScript 工具用来提供代码自动补全、帮助进行类型检测，并使从 JavaScript 和 TypeScript 中使用 Kotlin 代码变得更容易。

Kotlin/Wasm 编译器会收集任何被 `@JsExport` 注解标记的顶层函数，并自动在 `.d.ts` 文件中生成 TypeScript 定义。

要生成 TypeScript 定义，请在你的 `build.gradle.kts` 文件中的 `wasmJs{}` 代码块中，添加 `generateTypeScriptDefinitions()` 函数：

```kotlin
kotlin {
    wasmJs {
        binaries.executable()
        browser {
        }
        generateTypeScriptDefinitions()
    }
}
```

> 在 Kotlin/Wasm 中生成 TypeScript 声明文件是[实验性的](components-stability.md#stability-levels-explained)特性。
> 它可能随时被移除或更改。
>
{style="warning"}

## 类型对应

Kotlin/Wasm 只允许 JavaScript 互操作声明的签名中使用特定类型。
这些限制统一适用于带有 `external`、`= js("code")` 或 `@JsExport` 的声明。

请看 Kotlin 类型如何与 Javascript 类型对应：

| Kotlin 类型                                                 | JavaScript 类型                     |
|------------------------------------------------------------|-----------------------------------|
| `Byte`、`Short`、`Int`、`Char`、`UByte`、`UShort`、`UInt`、 | `Number`                          |
| `Float`、`Double`、                                         | `Number`                          |
| `Long`、`ULong`、                                           | `BigInt`                          |
| `Boolean`、                                                 | `Boolean`                         |
| `String`、                                                  | `String`                          |
| `Unit` 在返回值位置时                                            | `undefined`                       |
| 函数类型，例如 `(String) -> Int`                                 | Function                          |
| `JsAny` 及其子类型                                              | 任何 JavaScript 值                |
| `JsReference`                                              | 对 Kotlin 对象的不透明引用          |
| 其他类型                                                       | 不支持                            |

你也可以使用这些类型的可空版本。

### JsAny 类型

JavaScript 值在 Kotlin 中使用 `JsAny` 类型及其子类型表示。

Kotlin/Wasm 标准库为其中一些类型提供了表示：
* 包 `kotlin.js`：
    * `JsAny`
    * `JsBoolean`、`JsNumber`、`JsString`
    * `JsArray`
    * `Promise`

你也可以通过声明 `external` 接口或类来创建自定义的 `JsAny` 子类型。

### JsReference 类型

Kotlin 值可以使用 `JsReference` 类型作为不透明引用传递给 JavaScript。

例如，如果你想将以下 Kotlin 类 `User` 暴露给 JavaScript：

```kotlin
class User(var name: String)
```

你可以使用 `toJsReference()` 函数创建 `JsReference<User>` 并将其返回给 JavaScript：

```kotlin
@JsExport
fun createUser(name: String): JsReference<User> {
    return User(name).toJsReference()
}
```

这些引用在 JavaScript 中不直接可用，并且表现得像空的冻结 JavaScript 对象。
要操作这些对象，你需要使用 `get()` 方法将引用值解包，然后向 JavaScript 导出更多函数：

```kotlin
@JsExport
fun setUserName(user: JsReference<User>, name: String) {
    user.get().name = name
}
```

你可以创建一个类并从 JavaScript 中更改其名称：

```javascript
import UserLib from "./userlib.mjs"

let user = UserLib.createUser("Bob");
UserLib.setUserName(user, "Alice");
```

### 类型形参

JavaScript 互操作声明可以有类型形参，如果它们具有 `JsAny` 或其子类型的上界。例如：

```kotlin
external fun <T : JsAny> processData(data: JsArray<T>): T
```

## 异常处理

你可以使用 Kotlin 的 `try-catch` 表达式来捕获 Kotlin/Wasm 代码中的 JavaScript 异常。异常处理的工作方式如下：

* 从 JavaScript 抛出的异常：Kotlin 侧可获取详细信息。如果此类异常传播回 JavaScript，它将不再包装到 WebAssembly 中。

* 从 Kotlin 抛出的异常：它们可以在 JavaScript 侧作为常规 JS 错误被捕获。

以下是一个示例，演示如何在 Kotlin 侧捕获 JavaScript 异常：

```kotlin
external object JSON {
    fun <T: JsAny> parse(json: String): T
}

fun main() {
    try {
        JSON.parse("an invalid JSON")
    } catch (e: JsException) {
        println("Thrown value is: ${e.thrownValue}")
        // SyntaxError: Unexpected token 'a', "an invalid JSON" is not valid JSON

        println("Message: ${e.message}")
        // Message: Unexpected token 'a', "an invalid JSON" is not valid JSON

        println("Stacktrace:")
        // Stacktrace:

        // Prints the full JavaScript stack trace 
        e.printStackTrace()
    }
}
```

这种异常处理在支持 [`WebAssembly.JSTag`](https://webassembly.github.io/exception-handling/js-api/#dom-webassembly-jstag) 特性的现代浏览器中自动工作：

* Chrome 115+
* Firefox 129+
* Safari 18.4+

## Kotlin/Wasm 与 Kotlin/JS 互操作性差异

尽管 Kotlin/Wasm 互操作性与 Kotlin/JS 互操作性有相似之处，但仍有一些主要区别需要考虑：

| 特性                      | **Kotlin/Wasm**                                                                                                                                                                                                     | **Kotlin/JS**                                                                                                                                       |
|-------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------|
| **External enums**      | 不支持 `external` 枚举类。                                                                                                                                                                                                 | 支持 `external` 枚举类。                                                                                                                              |
| **类型扩展**                | 不支持非 `external` 类型继承 `external` 类型。                                                                                                                                                                                   | 支持非 `external` 类型。                                                                                                                              |
| **`JsName` 注解**       | 仅在注解 `external` 声明时生效。                                                                                                                                                                                             | 可用于更改常规非 `external` 声明的名称。                                                                                                                |
| **`js()` 函数**           | `js("code")` 函数调用允许作为包级函数的单一表达式函数体。                                                                                                                                                                    | `js("code")` 函数可以在任何上下文中使用，并返回一个 `dynamic` 值。                                                                                         |
| **模块系统**                | 仅支持 ES 模块。没有 `@JsNonModule` 注解的对应物。以 `default` 对象上的属性形式提供其导出项。仅允许导出包级函数。                                                                                                                                                  | 支持 ES 模块和旧式模块系统。提供命名 ESM 导出。允许导出类和对象。                                                                                     |
| **类型**                  | 对所有互操作声明 `external`、`= js("code")` 和 `@JsExport` 统一应用更严格的类型限制。允许少数[内置 Kotlin 类型和 `JsAny` 子类型](#type-correspondence)。                                                                                                                             | 允许 `external` 声明中的所有类型。限制 [@JsExport](js-to-kotlin-interop.md#kotlin-types-in-javascript) 中可使用的类型。                                |
| **Long**                | 类型对应于 JavaScript `BigInt`。                                                                                                                                                                                           | 作为 JavaScript 中的自定义类可见。                                                                                                                    |
| **数组**                  | 尚未直接支持互操作。你可以改用新的 `JsArray` 类型。                                                                                                                                                                          | 实现为 JavaScript 数组。                                                                                                                            |
| **Other types**         | 需要 `JsReference<>` 将 Kotlin 对象传递给 JavaScript。                                                                                                                                                                 | 允许在 `external` 声明中使用非 `external` Kotlin 类类型。                                                                                               |
| **Exception handling**  | 你可以使用 `JsException` 和 `Throwable` 类型捕获任何 JavaScript 异常。                                                                                                                                                      | 可以使用 `Throwable` 类型捕获 JavaScript `Error`。可以使用 `dynamic` 类型捕获任何 JavaScript 异常。                                                    |
| **Dynamic types**       | 不支持 `dynamic` 类型。改用 `JsAny`（见下文示例代码）。                                                                                                                                                                  | 支持 `dynamic` 类型。                                                                                                                               |

> Kotlin/Wasm 不支持用于与无类型或弱类型对象互操作的 Kotlin/JS [dynamic 类型](dynamic-type.md)。你可以使用 `JsAny` 类型代替 `dynamic` 类型：
>
> ```kotlin
> // Kotlin/JS
> fun processUser(user: dynamic, age: Int) {
>     // ...
>     user.profile.updateAge(age)
>     // ...
> }
>
> // Kotlin/Wasm
> private fun updateUserAge(user: JsAny, age: Int): Unit =
>     js("{ user.profile.updateAge(age); }")
>
> fun processUser(user: JsAny, age: Int) {
>     // ...
>     updateUserAge(user, age)
>     // ...
> }
> ```
>
{style="note"}

## 与 Web 相关的浏览器 API

[`kotlinx-browser` 库](https://github.com/Kotlin/kotlinx-browser) 是一个独立的库，提供了 JavaScript 浏览器 API，包括：
* 包 `org.khronos.webgl`：
  * 类型化数组，例如 `Int8Array`。
  * WebGL 类型。
* 包 `org.w3c.dom.*`：
  * DOM API 类型。
* 包 `kotlinx.browser`：
  * DOM API 全局对象，例如 `window` 和 `document`。

要使用 `kotlinx-browser` 库中的声明，请将其作为依赖项添加到你的项目构建配置文件中：

```kotlin
val wasmJsMain by getting {
    dependencies {
        implementation("org.jetbrains.kotlinx:kotlinx-browser:0.3")
    }
}