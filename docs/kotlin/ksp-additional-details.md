[//]: # (title: KSP 如何建模 Kotlin 代码)

你可以在 [KSP GitHub 仓库](https://github.com/google/ksp/tree/main/api/src/main/kotlin/com/google/devtools/ksp)中找到 API 定义。
该图展示了 Kotlin 在 KSP 中是如何被[建模](https://github.com/google/ksp/tree/main/api/src/main/kotlin/com/google/devtools/ksp/symbol/)的概览：

![类图](ksp-class-diagram.svg){thumbnail="true" width="800" thumbnail-same-file="true"}

> [查看完整尺寸的图表](https://kotlinlang.org/docs/images/ksp-class-diagram.svg)。
>
{style="note"}

## 类型与解析

解析占据了底层 API 实现的大部分开销。因此，类型引用被设计为由处理器显式解析（少数例外）。当一个_类型_（例如 `KSFunctionDeclaration.returnType` 或 `KSAnnotation.annotationType`）被引用时，它始终是 `KSTypeReference`，它是一个带有注解和修饰符的 `KSReferenceElement`。

```kotlin
interface KSFunctionDeclaration : ... {
  val returnType: KSTypeReference?
  // ...
}

interface KSTypeReference : KSAnnotated, KSModifierListOwner {
  val type: KSReferenceElement
}
```

一个 `KSTypeReference` 可以被解析为 `KSType`，它指的是 Kotlin 类型系统中的一个类型。

一个 `KSTypeReference` 包含一个 `KSReferenceElement`，它建模了 Kotlin 的程序结构：即，引用是如何编写的。它对应于 Kotlin 语法中的 [`type`](https://kotlinlang.org/docs/reference/grammar.html#type) 元素。

一个 `KSReferenceElement` 可以是 `KSClassifierReference` 或 `KSCallableReference`，它们包含大量有用的信息，无需解析。例如，`KSClassifierReference` 具有 `referencedName`，而 `KSCallableReference` 具有 `receiverType`、`functionArguments` 和 `returnType`。

如果需要 `KSTypeReference` 引用的原始声明，通常可以通过解析到 `KSType` 并通过 `KSType.declaration` 进行访问来找到。从类型被提及的地方到其类被定义的地方的转换如下所示：

```kotlin
val ksType: KSType = ksTypeReference.resolve()
val ksDeclaration: KSDeclaration = ksType.declaration
```

类型解析开销很大，因此具有显式形式。从解析获得的一些信息已在 `KSReferenceElement` 中可用。例如，`KSClassifierReference.referencedName` 可以过滤掉许多不相关的元素。你只有在需要从 `KSDeclaration` 或 `KSType` 获取特定信息时才应该解析类型。

指向函数类型的 `KSTypeReference` 的大部分信息都在其元素中。
尽管它可以解析为 `Function0`、`Function1` 等函数家族，但这些解析不会带来比 `KSCallableReference` 更多的信息。解析函数类型引用的一个用例是处理函数原型的标识。