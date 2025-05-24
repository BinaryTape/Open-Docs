---
title: 动态类型
---
:::note
在以 JVM 为目标的code中不支持 dynamic type。

:::

作为一个静态类型语言，Kotlin 仍然需要与无类型或弱类型环境（例如 JavaScript 生态系统）进行互操作。 为了方便这些用例，该语言提供了 `dynamic` 类型：

```kotlin
val dyn: dynamic = ...
```

`dynamic` 类型基本上关闭了 Kotlin 的类型检查器：

- `dynamic` 类型的值可以分配给任何变量或作为参数传递到任何地方。
- 任何值都可以分配给 `dynamic` 类型的变量，或者传递给将 `dynamic` 作为参数的函数。
- 对于 `dynamic` 类型的值，`null` 检查被禁用。

`dynamic` 最特别的特性是，我们可以在 `dynamic` 变量上使用任何参数调用**任何**属性或函数：

```kotlin
dyn.whatever(1, "foo", dyn) // 'whatever' 没有在任何地方定义
dyn.whatever(*arrayOf(1, 2, 3))
```

在 JavaScript 平台上，此代码将“按原样”编译：Kotlin 中的 `dyn.whatever(1)` 在生成的 JavaScript 代码中变为 `dyn.whatever(1)`。

在 `dynamic` 类型的值上调用用 Kotlin 编写的函数时，请记住 Kotlin 到 JavaScript 编译器执行的名称改编（name mangling）。 你可能需要使用 [@JsName annotation](js-to-kotlin-interop#jsname-annotation) 为你需要调用的函数分配明确定义的名称。

动态调用（dynamic call）总是返回 `dynamic` 作为结果，因此你可以自由地链接这些调用：

```kotlin
dyn.foo().bar.baz()
```

当你将 lambda 传递给动态调用时，默认情况下，它的所有参数都具有 `dynamic` 类型：

```kotlin
dyn.foo {
    x `->` x.bar() // x is dynamic
}
```

使用 `dynamic` 类型的值的表达式按原样翻译成 JavaScript，并且不使用 Kotlin 运算符约定。 支持以下运算符：

* 二元运算符（binary）：`+`, `-`, `*`, `/`, `%`, `>`, `<`, `>=`, `<=`, `==`, `!=`, `===`, `!==`, `&&`, `||`
* 一元运算符（unary）
    * 前缀（prefix）：`-`, `+`, `!`
    * 前缀和后缀（prefix and postfix）：`++`, `--`
* 赋值运算符（assignments）：`+=`, `-=`, `*=`, `/=`, `%=`
* 索引访问（indexed access）：
    * 读取（read）：`d[a]`，多个参数是错误的
    * 写入（write）：`d[a1] = a2`，`[]` 中的多个参数是错误的

禁止对 `dynamic` 类型的值使用 `in`、`!in` 和 `..` 操作。

有关更详细的技术说明，请参见 [spec document](https://github.com/JetBrains/kotlin/blob/master/spec-docs/dynamic-types)。