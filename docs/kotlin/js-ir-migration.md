[//]: # (title: 将 Kotlin/JS 项目迁移到 IR 编译器)

我们用[基于 IR 的编译器](js-ir-compiler.md)替代了旧的 Kotlin/JS 编译器，以统一 Kotlin 在所有平台上的行为，并使其能够实现新的 JS 特有的优化等。你可以在 Sebastian Aigner 的博客文章 [将我们的 Kotlin/JS 应用迁移到新的 IR 编译器](https://dev.to/kotlin/migrating-our-kotlin-js-app-to-the-new-ir-compiler-3o6i)中了解这两种编译器之间的内部差异。

由于编译器之间存在显著差异，将你的 Kotlin/JS 项目从旧后端切换到新后端可能需要调整你的代码。在此页面上，我们整理了一份已知迁移问题列表及建议的解决方案。

> 安装 [Kotlin/JS Inspection pack](https://plugins.jetbrains.com/plugin/17183-kotlin-js-inspection-pack/) 插件，以获取有关如何修复迁移过程中出现的一些问题的宝贵提示。
>
{style="tip"}

请注意，本指南可能会随着我们修复和发现新问题而随时更改。请帮助我们保持其完整性——通过将你在切换到 IR 编译器时遇到的任何问题提交到我们的问题追踪器 [YouTrack](https://kotl.in/issue) 或填写[此表单](https://surveys.jetbrains.com/s3/ir-be-migration-issue)来报告。

## 将 JS 和 React 相关的类和接口转换为 external 接口

**问题**：使用派生自纯 JS 类（例如 React 的 `State` 和 `Props`）的 Kotlin 接口和类（包括数据类）可能会导致 `ClassCastException`。出现此类异常是因为编译器尝试将这些类的实例作为 Kotlin 对象来处理，而它们实际上来自 JS。

**解决方案**：将所有派生自纯 JS 类的类和接口转换为 [external 接口](js-interop.md#external-interfaces)：

```kotlin
// 替换为以下代码
interface AppState : State { }
interface AppProps : Props { }
data class CustomComponentState(var name: String) : State
```

```kotlin
// 替换为以下代码
external interface AppState : State { }
external interface AppProps : Props { }
external interface CustomComponentState : State {
   var name: String
}
```

在 IntelliJ IDEA 中，你可以使用这些[结构化搜索和替换](https://www.jetbrains.com/help/idea/structural-search-and-replace.html)模板自动将接口标记为 `external`：
*   [`State` 的模板](https://gist.github.com/SebastianAigner/62119536f24597e630acfdbd14001b98)
*   [`Props` 的模板](https://gist.github.com/SebastianAigner/a47a77f5e519fc74185c077ba12624f9)

## 将 external 接口的属性转换为 var

**问题**：Kotlin/JS 代码中 external 接口的属性不能是只读 (`val`) 属性，因为它们的值只能在对象使用 `js()` 或 `jso()`（[`kotlin-wrappers`](https://github.com/JetBrains/kotlin-wrappers) 中的一个辅助函数）创建后才能赋值：

```kotlin
import kotlinx.js.jso

val myState = jso<CustomComponentState>()
myState.name = "name"
```

**解决方案**：将 external 接口的所有属性转换为 `var`：

```kotlin
// 替换为以下代码
external interface CustomComponentState : State {
   val name: String
}
```

```kotlin
// 替换为以下代码
external interface CustomComponentState : State {
   var name: String
}
```

## 将 external 接口中带接收者的函数转换为常规函数

**问题**：external 声明不能包含带接收者的函数，例如扩展函数或具有相应函数类型的属性。

**解决方案**：通过将接收者对象作为实参添加，将此类函数和属性转换为常规函数：

```kotlin
// 替换为以下代码
external interface ButtonProps : Props {
   var inside: StyledDOMBuilder<BUTTON>.() -> Unit
}
```

```kotlin
external interface ButtonProps : Props {
   var inside: (StyledDOMBuilder<BUTTON>) -> Unit
}
```

## 为互操作性创建纯 JS 对象

**问题**：实现 external 接口的 Kotlin 对象的属性是不可枚举的。这意味着它们对于迭代对象属性的操作（例如 `for (var name in obj)`、`console.log(obj)`、`JSON.stringify(obj)`）不可见。

尽管它们仍可以通过名称访问：`obj.myProperty`

```kotlin
external interface AppProps { var name: String }
data class AppPropsImpl(override var name: String) : AppProps
fun main() {
   val jsApp = js("{name: 'App1'}") as AppProps // 纯 JS 对象
   println("Kotlin 看到: ${jsApp.name}") // "App1"
   println("JSON.stringify 看到:" + JSON.stringify(jsApp)) // {"name":"App1"} - 正常

   val ktApp = AppPropsImpl("App2") // Kotlin 对象
   println("Kotlin 看到: ${ktApp.name}") // "App2"
   // JSON 只看到幕后字段，而不是属性
   println("JSON.stringify 看到:" + JSON.stringify(ktApp)) // {"_name_3":"App2"}
}
```

**解决方案 1**：使用 `js()` 或 `jso()`（[`kotlin-wrappers`](https://github.com/JetBrains/kotlin-wrappers) 中的辅助函数）创建纯 JavaScript 对象：

```kotlin
external interface AppProps { var name: String }
data class AppPropsImpl(override var name: String) : AppProps
```

```kotlin
// 替换为以下代码
val ktApp = AppPropsImpl("App1") // Kotlin 对象
```

```kotlin
// 替换为以下代码
val jsApp = js("{name: 'App1'}") as AppProps // 或 jso {}
```

**解决方案 2**：使用 `kotlin.js.json()` 创建对象：

```kotlin
// 或使用此代码
val jsonApp = kotlin.js.json(Pair("name", "App1")) as AppProps
```

## 将函数引用上的 toString() 调用替换为 .name

**问题**：在 IR 后端中，对函数引用调用 `toString()` 不会生成唯一值。

**解决方案**：使用 `name` 属性而不是 `toString()`。

## 在构建脚本中显式指定 binaries.executable()

**问题**：编译器不会生成可执行的 `.js` 文件。

这可能是因为默认编译器默认生成 JavaScript 可执行文件，而 IR 编译器需要显式指令来执行此操作。在 [Kotlin/JS 项目设置说明](js-project-setup.md#execution-environments)中了解更多信息。

**解决方案**：将 `binaries.executable()` 行添加到项目的 `build.gradle(.kts)` 中。

```kotlin
kotlin {
    js(IR) {
        browser {
        }
        binaries.executable()
    }
}
```

## 使用 Kotlin/JS IR 编译器时的额外故障排除技巧

以下提示可能有助于你在使用 Kotlin/JS IR 编译器时排查项目中的问题。

### 将 external 接口中的布尔属性设为可空的

**问题**：当你对 external 接口中的 `Boolean` 调用 `toString` 时，你会得到类似 `Uncaught TypeError: Cannot read properties of undefined (reading 'toString')` 的错误。JavaScript 将布尔变量的 `null` 或 `undefined` 值视为 `false`。如果你依赖于对可能为 `null` 或 `undefined` 的 `Boolean` 调用 `toString`（例如，当你的代码从你无法控制的 JavaScript 代码中调用时），请注意这一点：

```kotlin
external interface SomeExternal {
    var visible: Boolean
}

fun main() {
    val empty: SomeExternal = js("{}")
    println(empty.visible.toString()) // Uncaught TypeError: Cannot read properties of undefined (reading 'toString')
}
```

**解决方案**：你可以将 external 接口的 `Boolean` 属性设为可空的 (`Boolean?`)：

```kotlin
// 替换为以下代码
external interface SomeExternal {
    var visible: Boolean
}
```

```kotlin
// 替换为以下代码
external interface SomeExternal {
    var visible: Boolean?
}
```