---
title: "将 Kotlin/JS 项目迁移到 IR 编译器"
---
我们用 [基于 IR 的编译器](js-ir-compiler) 替换了旧的 Kotlin/JS 编译器，原因是为了统一 Kotlin 在所有平台上的行为，并使其能够实现新的 JS 特定的优化等等。
您可以在 Sebastian Aigner 的博文中了解更多关于这两个编译器内部差异的信息：
[将我们的 Kotlin/JS 应用迁移到新的 IR 编译器](https://dev.to/kotlin/migrating-our-kotlin-js-app-to-the-new-ir-compiler-3o6i)。

由于编译器之间存在显著差异，将您的 Kotlin/JS 项目从旧的后端切换到新的后端可能需要调整您的代码。
在此页面上，我们整理了一份已知迁移问题的列表以及建议的解决方案。

:::tip
安装 [Kotlin/JS Inspection pack](https://plugins.jetbrains.com/plugin/17183-kotlin-js-inspection-pack/) 插件，以获得关于如何修复迁移期间发生的一些问题的宝贵提示。

:::

请注意，随着我们修复问题和发现新问题，本指南可能会随时间而变化。
请帮助我们保持它的完整性 – 通过将您在切换到 IR 编译器时遇到的任何问题提交到我们的 issue tracker [YouTrack](https://kotl.in/issue) 或填写 [此表单](https://surveys.jetbrains.com/s3/ir-be-migration-issue) 来报告它们。

## 将 JS 和 React 相关的类和接口转换为 external interface（外部接口）

**问题**：使用派生自纯 JS 类的 Kotlin 接口和类（包括 data class（数据类）），例如 React 的 `State` 和 `Props`，可能会导致 `ClassCastException`。
出现此类异常是因为编译器尝试将这些类的实例视为 Kotlin 对象，而它们实际上来自 JS。

**解决方案**：将所有派生自纯 JS 类的类和接口转换为 [external interface（外部接口）](js-interop#external-interfaces)：

```kotlin
// Replace this
interface AppState : State { }
interface AppProps : Props { }
data class CustomComponentState(var name: String) : State
```

```kotlin
// With this
external interface AppState : State { }
external interface AppProps : Props { }
external interface CustomComponentState : State {
   var name: String
}
```

在 IntelliJ IDEA 中，您可以使用这些 [structural search and replace（结构性搜索和替换）](https://www.jetbrains.com/help/idea/structural-search-and-replace.html) 模板来自动将接口标记为 `external`：
* [`State` 的模板](https://gist.github.com/SebastianAigner/62119536f24597e630acfdbd14001b98)
* [`Props` 的模板](https://gist.github.com/SebastianAigner/a47a77f5e519fc74185c077ba12624f9)

## 将 external interface（外部接口）的属性转换为 var

**问题**：Kotlin/JS 代码中 external interface（外部接口）的属性不能是只读 (`val`) 属性，因为它们的值只能在使用 `js()` 或 `jso()`（来自 [`kotlin-wrappers`](https://github.com/JetBrains/kotlin-wrappers) 的辅助函数）创建对象后才能赋值：

```kotlin
import kotlinx.js.jso

val myState = jso<CustomComponentState>()
myState.name = "name"
```

**解决方案**：将 external interface（外部接口）的所有属性转换为 `var`：

```kotlin
// Replace this
external interface CustomComponentState : State {
   val name: String
}
```

```kotlin
// With this
external interface CustomComponentState : State {
   var name: String
}
```

## 将 external interface（外部接口）中带有 receiver（接收者）的函数转换为常规函数

**问题**：外部声明不能包含带有 receiver（接收者）的函数，例如扩展函数或具有相应函数类型的属性。

**解决方案**：通过添加 receiver（接收者）对象作为参数，将此类函数和属性转换为常规函数：

```kotlin
// Replace this
external interface ButtonProps : Props {
   var inside: StyledDOMBuilder<BUTTON>.() `->` Unit
}
```

```kotlin
external interface ButtonProps : Props {
   var inside: (StyledDOMBuilder<BUTTON>) `->` Unit
}
```

## 创建用于互操作的普通 JS 对象

**问题**：实现 external interface（外部接口）的 Kotlin 对象的属性不是 _enumerable_（可枚举的）。
这意味着对于迭代对象属性的操作，它们是不可见的，例如：
* `for (var name in obj)`
* `console.log(obj)`
* `JSON.stringify(obj)`

尽管仍然可以通过名称访问它们：`obj.myProperty`

```kotlin
external interface AppProps { var name: String }
data class AppPropsImpl(override var name: String) : AppProps
fun main() {
   val jsApp = js("{name: 'App1'}") as AppProps // plain JS object
   println("Kotlin sees: ${jsApp.name}") // "App1"
   println("JSON.stringify sees:" + JSON.stringify(jsApp)) // {"name":"App1"} - OK

   val ktApp = AppPropsImpl("App2") // Kotlin object
   println("Kotlin sees: ${ktApp.name}") // "App2"
   // JSON sees only the backing field, not the property
   println("JSON.stringify sees:" + JSON.stringify(ktApp)) // {"_name_3":"App2"}
}
```

**解决方案 1**：使用 `js()` 或 `jso()`（来自 [`kotlin-wrappers`](https://github.com/JetBrains/kotlin-wrappers) 的辅助函数）创建普通的 JavaScript 对象：

```kotlin
external interface AppProps { var name: String }
data class AppPropsImpl(override var name: String) : AppProps
```

```kotlin
// Replace this
val ktApp = AppPropsImpl("App1") // Kotlin object
```

```kotlin
// With this
val jsApp = js("{name: 'App1'}") as AppProps // or jso {}
```

**解决方案 2**：使用 `kotlin.js.json()` 创建对象：

```kotlin
// or with this
val jsonApp = kotlin.js.json(Pair("name", "App1")) as AppProps
```

## 将函数引用上的 toString() 调用替换为 .name

**问题**：在 IR 后端中，对函数引用调用 `toString()` 不会产生唯一的值。

**解决方案**：使用 `name` 属性代替 `toString()`。

## 在构建脚本中显式指定 binaries.executable()

**问题**：编译器不生成可执行的 `.js` 文件。

这可能是因为默认编译器默认生成 JavaScript 可执行文件，而 IR 编译器需要显式指令才能执行此操作。
在 [Kotlin/JS 项目设置说明](js-project-setup#execution-environments) 中了解更多信息。

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

## 使用 Kotlin/JS IR 编译器时的其他故障排除提示

以下提示可能有助于您在使用 Kotlin/JS IR 编译器时对项目中的问题进行故障排除。

### 在 external interface（外部接口）中使 boolean 属性可为空

**问题**：当您从 external interface（外部接口）对 `Boolean` 调用 `toString` 时，您会收到类似 `Uncaught TypeError: Cannot read properties of undefined (reading 'toString')` 的错误。
JavaScript 将 boolean 变量的 `null` 或 `undefined` 值视为 `false`。
如果您依赖于对可能为 `null` 或 `undefined` 的 `Boolean` 调用 `toString`（例如，当您的代码是从您无法控制的 JavaScript 代码调用时），请注意这一点：

```kotlin
external interface SomeExternal {
    var visible: Boolean
}

fun main() {
    val empty: SomeExternal = js("{}")
    println(empty.visible.toString()) // Uncaught TypeError: Cannot read properties of undefined (reading 'toString')
}
```

**解决方案**：您可以使 external interface（外部接口）的 `Boolean` 属性可为空 (`Boolean?`)：

```kotlin
// Replace this
external interface SomeExternal {
    var visible: Boolean
}
```

```kotlin
// With this
external interface SomeExternal {
    var visible: Boolean?
}
```