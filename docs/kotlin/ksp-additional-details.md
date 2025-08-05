[//]: # (title: KSP 如何为 Kotlin 代码建模)

你可以在 [KSP GitHub 版本库](https://github.com/google/ksp/tree/main/api/src/main/kotlin/com/google/devtools/ksp)中找到 API 定义。
该图表概述了 Kotlin 在 KSP 中是如何被[建模](https://github.com/google/ksp/tree/main/api/src/main/kotlin/com/google/devtools/ksp/symbol/)的：

![类图](ksp-class-diagram.svg){thumbnail="true" width="800" thumbnail-same-file="true"}

> [关于全尺寸图表请参见此处](https://kotlinlang.org/docs/images/ksp-class-diagram.svg)。
>
{style="note"}

## 类型与解析

解析占据了底层 API 实现的大部分开销。因此，类型引用被设计为由处理器显式地（除少数例外）解析。当引用一个_类型_（例如 `KSFunctionDeclaration.returnType` 或 `KSAnnotation.annotationType`）时，它始终是一个 `KSTypeReference`，它是一个带有注解和修饰符的 `KSReferenceElement`。

```kotlin
interface KSFunctionDeclaration : ... {
  val returnType: KSTypeReference?
  // ...
}

interface KSTypeReference : KSAnnotated, KSModifierListOwner {
  val type: KSReferenceElement
}
```

一个 `KSTypeReference` 可以被解析为 `KSType`，它引用了 Kotlin 类型系统中的一个类型。

`KSTypeReference` 有一个 `KSReferenceElement`，它为 Kotlin 的程序结构建模：即，引用是如何编写的。它对应于 Kotlin 语法中的 [`type`](https://kotlinlang.org/docs/reference/grammar.html#type) 元素。

`KSReferenceElement` 可以是 `KSClassifierReference` 或 `KSCallableReference`，它们包含大量有用信息，而无需解析。例如，`KSClassifierReference` 有 `referencedName`，而 `KSCallableReference` 有 `receiverType`、`functionArguments` 和 `returnType`。

如果需要 `KSTypeReference` 引用的原始声明，通常可以通过解析为 `KSType` 并通过 `KSType.declaration` 访问来找到。将类型被提及之处与其类定义之处关联起来，示例如下：

```kotlin
val ksType: KSType = ksTypeReference.resolve()
val ksDeclaration: KSDeclaration = ksType.declaration
```

类型解析开销大，因此采用显式形式。从解析中获取的一些信息已在 `KSReferenceElement` 中可用。例如，`KSClassifierReference.referencedName` 可以过滤掉许多不相关的元素。只有当你需要从 `KSDeclaration` 或 `KSType` 中获取特定信息时，才应该解析类型。

指向函数类型的 `KSTypeReference` 大部分信息都在其元素中。
尽管它可以被解析为 `Function0`、`Function1` 等系列，但这些解析不会比 `KSCallableReference` 带来更多信息。解析函数类型引用的一个用例是处理函数原型的标识。