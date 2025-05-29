[//]: # (title: 与 JavaScript 的互操作性)

Kotlin/Wasm 允许你在 Kotlin 中使用 JavaScript 代码，也在 JavaScript 中使用 Kotlin 代码。

与 [Kotlin/JS](js-overview.md) 一样，Kotlin/Wasm 编译器也具备与 JavaScript 的互操作性。如果你熟悉 Kotlin/JS 互操作性，你会发现 Kotlin/Wasm 的互操作性与此类似。然而，仍有一些关键区别需要考虑。

> Kotlin/Wasm 处于 [Alpha](components-stability.md) 阶段。它可能随时更改。请在生产前的场景中使用。我们非常感谢您在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-56492) 中提供反馈。
>
{style="note"}

## 在 Kotlin 中使用 JavaScript 代码

了解如何通过使用 `external` 声明、带有 JavaScript 代码片段的函数以及 `@JsModule` 注解，在 Kotlin 中使用 JavaScript 代码。

### 外部声明

外部 JavaScript 代码默认在 Kotlin 中不可见。
要在 Kotlin 中使用 JavaScript 代码，你可以使用 `external` 声明来描述其 API。

#### JavaScript 函数

考虑以下 JavaScript 函数：

```javascript
function greet (name) {
    console.log("Hello, " + name + "!");
}
```

你可以在 Kotlin 中将其声明为一个 `external` 函数：

```kotlin
external fun greet(name: String)
```

外部函数没有函数体，你可以将其作为常规的 Kotlin 函数调用：

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

你可以在 Kotlin 中使用外部 `var` 或 `val` 属性来声明它：

```kotlin
external var globalCounter: Int
```

这些属性是外部初始化的。这些属性在 Kotlin 代码中不能有 `= value` 初始化器。

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

你可以在 Kotlin 中将其作为外部类使用：

```kotlin
external class Rectangle(height: Double, width: Double) : JsAny {
    val height: Double
    val width: Double
    fun area(): Double
}
```

`external` 类中的所有声明都隐式地被视为外部的。

#### 外部接口

你可以在 Kotlin 中描述 JavaScript 对象的形状。考虑以下 JavaScript 函数及其返回值：

```javascript
function createUser (name, age) {
    return { name: name, age: age };
}
```

看看如何在 Kotlin 中使用 `external interface User` 类型来描述其形状：

```kotlin
external interface User : JsAny {
    val name: String
    val age: Int
}

external fun createUser(name: String, age: Int): User
```

外部接口没有运行时类型信息，它们只是一个编译时概念。
因此，与常规接口相比，外部接口有一些限制：
*   你不能在 `is` 检查的右侧使用它们。
*   你不能在类字面量表达式（例如 `User::class`）中使用它们。
*   你不能将它们作为具体化类型参数传递。
*   使用 `as` 进行到外部接口的类型转换总是成功的。

#### 外部对象

考虑这些持有对象的 JavaScript 变量：

```javascript
let Counter = {
    value: 0,
    step: 1,
    increment () {
        this.value += this.step;
    }
};
```

你可以在 Kotlin 中将它们作为外部对象使用：

```kotlin
external object Counter : JsAny {
    fun increment()
    val value: Int
    var step: Int
}
```

#### 外部类型层级结构

与常规类和接口类似，你可以声明外部声明来扩展其他外部类并实现外部接口。
然而，你不能在同一类型层级结构中混合使用外部和非外部声明。

### 带有 JavaScript 代码的 Kotlin 函数

你可以通过定义一个函数，其函数体为 `= js("code")`，从而在 Kotlin/Wasm 代码中添加 JavaScript 代码片段：

```kotlin
fun getCurrentURL(): String =
    js("window.location.href")
```

如果你想运行一个 JavaScript 语句块，请用花括号 `{}` 将字符串内的代码括起来：

```kotlin
fun setLocalSettings(value: String): Unit = js(
    """{
        localStorage.setItem('settings', value);
}"""
)
```

如果你想返回一个对象，请用括号 `()` 将花括号 `{}` 括起来：

```kotlin
fun createJsUser(name: String, age: Int): JsAny =
    js("({ name: name, age: age })")
```

Kotlin/Wasm 以特殊方式处理对 `js()` 函数的调用，并且其实现有一些限制：
*   `js()` 函数调用必须提供一个字符串字面量参数。
*   `js()` 函数调用必须是函数体中唯一的表达式。
*   `js()` 函数只允许从包级函数中调用。
*   函数返回类型必须明确提供。
*   [类型](#type-correspondence) 受限，类似于 `external fun`。

Kotlin 编译器会将代码字符串放入生成的 JavaScript 文件中的一个函数中，并将其导入到 WebAssembly 格式中。
Kotlin 编译器不会验证这些 JavaScript 代码片段。
如果存在 JavaScript 语法错误，它们将在你运行 JavaScript 代码时报告。

> `@JsFun` 注解具有类似的功能，并且很可能将被弃用。
>
{style="note"}

### JavaScript 模块

默认情况下，外部声明对应于 JavaScript 全局作用域。如果你使用 [`@JsModule` 注解](js-modules.md#jsmodule-annotation) 为 Kotlin 文件添加注解，那么其中的所有外部声明都将从指定的模块导入。

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

你可以将 JavaScript 的 `JsArray<T>` 复制到 Kotlin 的原生 `Array` 或 `List` 类型中；同样，你也可以将这些 Kotlin 类型复制到 `JsArray<T>`。

要将 `JsArray<T>` 转换为 `Array<T>` 或反向转换，请使用可用的 [适配器函数](https://github.com/Kotlin/kotlinx-browser/blob/dfbdceed314567983c98f1d66e8c2e10d99c5a55/src/wasmJsMain/kotlin/arrayCopy.kt) 之一。

以下是泛型类型之间转换的示例：

```kotlin
val list: List<JsString> =
    listOf("Kotlin", "Wasm").map { it.toJsString() }

// Uses .toJsArray() to convert List or Array to JsArray
val jsArray: JsArray<JsString> = list.toJsArray()

// Uses .toArray() and .toList() to convert it back to Kotlin types 
val kotlinArray: Array<JsString> = jsArray.toArray()
val kotlinList: List<JsString> = jsArray.toList()
```

类似的适配器函数也适用于将类型化数组转换为其 Kotlin 等效项（例如，`IntArray` 和 `Int32Array`）。有关详细信息和实现，请参阅 [`kotlinx-browser` 仓库](https://github.com/Kotlin/kotlinx-browser/blob/dfbdceed314567983c98f1d66e8c2e10d99c5a55/src/wasmJsMain/kotlin/arrayCopy.kt)。

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

了解如何通过使用 `@JsExport` 注解，在 JavaScript 中使用你的 Kotlin 代码。

### 带有 @JsExport 注解的函数

为了使 Kotlin/Wasm 函数可供 JavaScript 代码使用，请使用 `@JsExport` 注解：

```kotlin
// Kotlin/Wasm

@JsExport
fun addOne(x: Int): Int = x + 1
```

标记有 `@JsExport` 注解的 Kotlin/Wasm 函数在生成的 `.mjs` 模块的 `default` 导出上作为属性可见。
然后你可以在 JavaScript 中使用此函数：

```javascript
// JavaScript

import exports from "./module.mjs"

exports.addOne(10)
```

Kotlin/Wasm 编译器能够从你的 Kotlin 代码中任何 `@JsExport` 声明生成 TypeScript 定义。这些定义可以被 IDE 和 JavaScript 工具使用，以提供代码自动补全、帮助进行类型检查，并使从 JavaScript 和 TypeScript 中使用 Kotlin 代码变得更容易。

Kotlin/Wasm 编译器会收集所有标记有 `@JsExport` 注解的顶级函数，并自动在 `.d.ts` 文件中生成 TypeScript 定义。

要生成 TypeScript 定义，请在你的 `build.gradle.kts` 文件中的 `wasmJs{}` 块中，添加 `generateTypeScriptDefinitions()` 函数：

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

> 在 Kotlin/Wasm 中生成 TypeScript 声明文件是 [实验性功能](components-stability.md#stability-levels-explained)。
> 它可能随时被取消或更改。
>
{style="warning"}

## 类型对应关系

Kotlin/Wasm 只允许在 JavaScript 互操作声明的签名中使用某些特定类型。
这些限制统一适用于带有 `external`、`= js("code")` 或 `@JsExport` 的声明。

查看 Kotlin 类型如何与 JavaScript 类型对应：

| Kotlin                                                     | JavaScript                        |
|:-----------------------------------------------------------|:----------------------------------|
| `Byte`, `Short`, `Int`, `Char`, `UByte`, `UShort`, `UInt`, | `Number`                          |
| `Float`, `Double`,                                         | `Number`                          |
| `Long`, `ULong`,                                           | `BigInt`                          |
| `Boolean`,                                                 | `Boolean`                         |
| `String`,                                                  | `String`                          |
| `Unit` in return position                                  | `undefined`                       |
| Function type, for example `(String) -> Int`               | Function                          |
| `JsAny` and subtypes                                       | Any JavaScript value              |
| `JsReference`                                              | Opaque reference to Kotlin object |
| Other types                                                | 不支持                            |

你也可以使用这些类型的可空版本。

### `JsAny` 类型

JavaScript 值在 Kotlin 中使用 `JsAny` 类型及其子类型表示。

Kotlin/Wasm 标准库提供了其中一些类型的表示：
*   包 `kotlin.js`：
    *   `JsAny`
    *   `JsBoolean`, `JsNumber`, `JsString`
    *   `JsArray`
    *   `Promise`

你也可以通过声明一个 `external` 接口或类来创建自定义的 `JsAny` 子类型。

### `JsReference` 类型

Kotlin 值可以使用 `JsReference` 类型作为不透明引用传递给 JavaScript。

例如，如果你想将此 Kotlin 类 `User` 暴露给 JavaScript：

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

这些引用在 JavaScript 中不能直接使用，并且行为类似于空的冻结 JavaScript 对象。
要操作这些对象，你需要使用 `get()` 方法将引用值解包，并向 JavaScript 导出更多函数：

```kotlin
@JsExport
fun setUserName(user: JsReference<User>, name: String) {
    user.get().name = name
}
```

你可以从 JavaScript 创建一个类并更改其名称：

```javascript
import UserLib from "./userlib.mjs"

let user = UserLib.createUser("Bob");
UserLib.setUserName(user, "Alice");
```

### 类型参数

JavaScript 互操作声明可以包含类型参数，前提是这些类型参数的上限是 `JsAny` 或其子类型。例如：

```kotlin
external fun <T : JsAny> processData(data: JsArray<T>): T
```

## 异常处理

你可以使用 Kotlin 的 `try-catch` 表达式来捕获 JavaScript 异常。
然而，默认情况下，在 Kotlin/Wasm 中无法访问抛出值的具体细节。

你可以配置 `JsException` 类型，使其包含来自 JavaScript 的原始错误消息和堆栈跟踪。
为此，请将以下编译器选项添加到你的 `build.gradle.kts` 文件中：

```kotlin
kotlin {
    wasmJs {
        compilerOptions {
            freeCompilerArgs.add("-Xwasm-attach-js-exception")
        }
    }
}
```

此行为取决于 `WebAssembly.JSTag` API，该 API 仅在某些浏览器中可用：

*   **Chrome:** 版本 115 及更高版本支持
*   **Firefox:** 版本 129 及更高版本支持
*   **Safari:** 尚不支持

以下是演示此行为的示例：

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

启用 `-Xwasm-attach-js-exception` 编译器选项后，`JsException` 类型会提供 JavaScript 错误的具体细节。
如果不启用此编译器选项，`JsException` 将只包含一条通用消息，说明在运行 JavaScript 代码时抛出了异常。

如果你尝试使用 JavaScript 的 `try-catch` 表达式来捕获 Kotlin/Wasm 异常，它将表现为一个通用的 `WebAssembly.Exception`，无法直接访问消息和数据。

## Kotlin/Wasm 与 Kotlin/JS 互操作性区别

尽管 Kotlin/Wasm 互操作性与 Kotlin/JS 互操作性有相似之处，但仍有一些关键区别需要考虑：

|                         | **Kotlin/Wasm**                                                                                                                                                                                                     | **Kotlin/JS**                                                                                                                                       |
|:------------------------|:--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|:----------------------------------------------------------------------------------------------------------------------------------------------------|
| **外部枚举**      | 不支持外部枚举类。                                                                                                                                                                              | 支持外部枚举类。                                                                                                                     |
| **类型扩展**     | 不支持非外部类型扩展外部类型。                                                                                                                                                        | 支持非外部类型。                                                                                                                        |
| **`JsName` 注解** | 仅在注解外部声明时有效。                                                                                                                                                           | 可用于更改常规非外部声明的名称。                                                                                   |
| **`js()` 函数**       | `js("code")` 函数调用只允许作为包级函数的单一表达式体。                                                                                                                     | `js("code")` 函数可以在任何上下文中使用，并返回 `dynamic` 值。                                                               |
| **模块系统**      | 仅支持 ES 模块。没有 `@JsNonModule` 注解的类似物。将其导出作为 `default` 对象的属性提供。仅允许导出包级函数。                           | 支持 ES 模块和传统模块系统。提供命名的 ESM 导出。允许导出类和对象。                                    |
| **类型**               | 对所有互操作声明 `external`、`= js("code")` 和 `@JsExport` 统一应用更严格的类型限制。允许少量 [内置 Kotlin 类型和 `JsAny` 子类型](#type-correspondence)。 | 允许 `external` 声明中的所有类型。限制 [可在 `@JsExport` 中使用的类型](js-to-kotlin-interop.md#kotlin-types-in-javascript)。 |
| **Long**                | 类型对应于 JavaScript `BigInt`。                                                                                                                                                                            | 在 JavaScript 中作为自定义类可见。                                                                                                            |
| **数组**              | 互操作中尚未直接支持。你可以使用新的 `JsArray` 类型。                                                                                                                                  | 实现为 JavaScript 数组。                                                                                                                   |
| **其他类型**         | 需要 `JsReference<>` 将 Kotlin 对象传递给 JavaScript。                                                                                                                                      | 允许在外部声明中使用非外部 Kotlin 类类型。                                                                         |
| **异常处理**  | 你可以使用 `JsException` 和 `Throwable` 类型捕获任何 JavaScript 异常。                                                                                                                                | 可以使用 `Throwable` 类型捕获 JavaScript `Error`。可以使用 `dynamic` 类型捕获任何 JavaScript 异常。                            |
| **动态类型**       | 不支持 `dynamic` 类型。请改用 `JsAny` 类型（参见下面的示例代码）。                                                                                                                                   | 支持 `dynamic` 类型。                                                                                                                        |

> Kotlin/Wasm 不支持用于与无类型或松散类型对象互操作的 Kotlin/JS [动态类型](dynamic-type.md)。你可以使用 `JsAny` 类型代替 `dynamic` 类型：
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

## Web 相关浏览器 API

[`kotlinx-browser` 库](https://github.com/kotlin/kotlinx-browser) 是一个独立的库，它提供 JavaScript 浏览器 API，包括：
*   包 `org.khronos.webgl`：
    *   类型化数组，例如 `Int8Array`。
    *   WebGL 类型。
*   包 `org.w3c.dom.*`：
    *   DOM API 类型。
*   包 `kotlinx.browser`：
    *   DOM API 全局对象，例如 `window` 和 `document`。

要使用 `kotlinx-browser` 库中的声明，请将其作为依赖项添加到你项目的构建配置文件中：

```kotlin
val wasmJsMain by getting {
    dependencies {
        implementation("org.jetbrains.kotlinx:kotlinx-browser:0.3")
    }
}
```