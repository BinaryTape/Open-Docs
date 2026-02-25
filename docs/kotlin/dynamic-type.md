[//]: # (title: 动态类型)

> JVM 平台不支持 dynamic 类型。
>
{style="note"}

作为一种静态类型语言，Kotlin 仍需与无类型或弱类型环境（例如 JavaScript 生态系统）进行互操作。为了支持这些用例，该语言提供了 `dynamic` 类型：

```kotlin
val dyn: dynamic = ...
```

`dynamic` 类型基本上关闭了 Kotlin 的类型检查器：

- `dynamic` 类型的值可以赋值给任何变量，或作为形参传递到任何地方。
- 任何值都可以赋值给 `dynamic` 类型的变量，或传递给以 `dynamic` 作为形参的函数。
- `dynamic` 类型值禁用了 null 检查。

`dynamic` 最特别的特性是，我们被允许在 `dynamic` 变量上调用**任何**属性或函数，并传入任何形参：

```kotlin
dyn.whatever(1, "foo", dyn) // 'whatever' is not defined anywhere
dyn.whatever(*arrayOf(1, 2, 3))
```

在 JavaScript 平台上，此代码将“原样”编译：Kotlin 中的 `dyn.whatever(1)` 会变为生成的 JavaScript 代码中的 `dyn.whatever(1)`。

在 `dynamic` 类型的值上调用以 Kotlin 编写的函数时，请注意 Kotlin 到 JavaScript 编译器执行的名称混淆 (name mangling)。你可能需要使用 [@JsName 注解](js-to-kotlin-interop.md#jsname-annotation) 为需要调用的函数分配明确定义的名称。

动态调用总是返回 `dynamic` 作为结果，因此你可以自由地进行链式调用：

```kotlin
dyn.foo().bar.baz()
```

当你将 lambda 表达式传递给动态调用时，其所有形参默认都具有 `dynamic` 类型：

```kotlin
dyn.foo {
    x -> x.bar() // x is dynamic
}
```

使用 `dynamic` 类型值的表达式会被“原样”翻译为 JavaScript，且不使用 Kotlin 的运算符约定。支持以下运算符：

* 二元：`+`, `-`, `*`, `/`, `%`, `>`, `<` `>=`, `<=`, `==`, `!=`, `===`, `!==`, `&&`, `||`
* 一元
    * 前缀：`-`, `+`, `!`
    * 前缀和后缀：`++`, `--`
* 赋值：`+=`, `-=`, `*=`, `/=`, `%=`
* 索引访问：
    * 读取：`d[a]`，多个实参是错误的
    * 写入：`d[a1] = a2`，`[]` 中有多个实参是错误的

禁止对 `dynamic` 类型的值进行 `in`、`!in` 和 `..` 操作。

如需更技术性的说明，请参阅[规范文档](https://github.com/JetBrains/kotlin/blob/master/spec-docs/dynamic-types.md)。