[//]: # (title: 动态类型)

> JVM 目标平台代码不支持 `dynamic` 类型。
>
{style="note"}

Kotlin 是一种静态类型语言，但它仍然需要与无类型或弱类型环境进行互操作，例如 JavaScript 生态系统。为了方便这些用例，语言中提供了 `dynamic` 类型：

```kotlin
val dyn: dynamic = ...
```

`dynamic` 类型基本上会关闭 Kotlin 的类型检测器：

- `dynamic` 类型的值可以赋值给任何变量或作为实参传递到任何地方。
- 任何值都可以赋值给 `dynamic` 类型的变量，或传递给接受 `dynamic` 作为实参的函数。
- 对 `dynamic` 类型的值禁用了空检测。

`dynamic` 最特别的特性是，我们允许在 `dynamic` 变量上调用**任何**属性或函数，并可传入任何实参：

```kotlin
dyn.whatever(1, "foo", dyn) // 'whatever' is not defined anywhere
dyn.whatever(*arrayOf(1, 2, 3))
```

在 JavaScript 平台，这段代码将“原样”编译：Kotlin 中的 `dyn.whatever(1)` 在生成的 JavaScript 代码中变为 `dyn.whatever(1)`。

当在 `dynamic` 类型的值上调用用 Kotlin 编写的函数时，请记住 Kotlin 到 JavaScript 编译器执行的名字修饰。你可能需要使用 [@JsName annotation](js-to-kotlin-interop.md#jsname-annotation) 为你需要调用的函数分配明确的名称。

动态调用总是返回 `dynamic` 作为结果，因此你可以自由地链式调用此类函数：

```kotlin
dyn.foo().bar.baz()
```

当你将 lambda 表达式传递给动态调用时，它的所有实参默认都具有 `dynamic` 类型：

```kotlin
dyn.foo {
    x -> x.bar() // x is dynamic
}
```

使用 `dynamic` 类型的值的表达式会“原样”翻译成 JavaScript，并且不使用 Kotlin 的操作符约定。支持以下操作符：

*   二元操作符: `+`, `-`, `*`, `/`, `%`, `>`, `<`, `>=`, `<=`, `==`, `!=`, `===`, `!==`, `&&`, `||`
*   一元操作符
    *   前缀: `-`, `+`, `!`
    *   前缀和后缀: `++`, `--`
*   赋值操作符: `+=`, `-=`, `*=`, `/=`, `%=`
*   索引访问:
    *   读取: `d[a]`，多于一个实参是错误
    *   写入: `d[a1] = a2`，`[]` 中多于一个实参是错误

禁止对 `dynamic` 类型的值使用 `in`、`!in` 和 `..` 操作。

有关更技术性的描述，请参阅 [规范文档](https://github.com/JetBrains/kotlin/blob/master/spec-docs/dynamic-types.md)。