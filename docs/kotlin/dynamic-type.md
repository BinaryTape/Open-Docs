[//]: # (title: 动态类型)

> 动态类型在面向 JVM 的代码中不受支持。
>
{style="note"}

Kotlin 作为一种静态类型语言，仍然需要与无类型或松散类型的环境（例如 JavaScript 生态系统）进行互操作。为了方便这些用例，`dynamic` 类型在语言中可用：

```kotlin
val dyn: dynamic = ...
```

`dynamic` 类型基本上关闭了 Kotlin 的类型检查器：

- `dynamic` 类型的值可以赋值给任何变量，或作为参数传递到任何地方。
- 任何值都可以赋值给 `dynamic` 类型的变量，或传递给接受 `dynamic` 作为参数的函数。
- `dynamic` 类型的值的 `null` 检查被禁用。

`dynamic` 最独特之处在于，我们可以在 `dynamic` 变量上调用 **任何** 属性或函数，并带有任何参数：

```kotlin
dyn.whatever(1, "foo", dyn) // 'whatever' is not defined anywhere
dyn.whatever(*arrayOf(1, 2, 3))
```

在 JavaScript 平台上，这段代码将“原样”编译：Kotlin 中的 `dyn.whatever(1)` 在生成的 JavaScript 代码中也会是 `dyn.whatever(1)`。

在 `dynamic` 类型的值上调用用 Kotlin 编写的函数时，请记住 Kotlin 到 JavaScript 编译器执行的名称重整。你可能需要使用 [`@JsName 注解`](js-to-kotlin-interop.md#jsname-annotation) 来为你需要调用的函数分配明确的名称。

动态调用总是返回 `dynamic` 作为结果，因此你可以自由地进行此类链式调用：

```kotlin
dyn.foo().bar.baz()
```

当你向动态调用传递 lambda 表达式时，其所有参数默认情况下都具有 `dynamic` 类型：

```kotlin
dyn.foo {
    x -> x.bar() // x is dynamic
}
```

使用 `dynamic` 类型值的表达式会“原样”翻译为 JavaScript，并且不使用 Kotlin 的运算符约定。支持以下运算符：

*   二元: `+`, `-`, `*`, `/`, `%`, `>`, `<`, `>=`, `<=`, `==`, `!=`, `===`, `!==`, `&&`, `||`
*   一元
    *   前缀: `-`, `+`, `!`
    *   前缀和后缀: `++`, `--`
*   赋值: `+=`, `-=`, `*=`, `/=`, `%=`
*   索引访问:
    *   读取: `d[a]`, 多于一个参数是错误的
    *   写入: `d[a1] = a2`, `[]` 中多于一个参数是错误的

对 `dynamic` 类型值进行 `in`、`!in` 和 `..` 操作是被禁止的。

有关更技术性的描述，请参阅[规范文档](https://github.com/JetBrains/kotlin/blob/master/spec-docs/dynamic-types.md)。