[//]: # (title: KSP 如何对 Kotlin 代码建模)

您可以在 [KSP GitHub 仓库](https://github.com/google/ksp/tree/main/api/src/main/kotlin/com/google/devtools/ksp)中找到 API 定义。该图示概述了 Kotlin 在 KSP 中是如何被[建模](https://github.com/google/ksp/tree/main/api/src/main/kotlin/com/google/devtools/ksp/symbol/)的：

![class diagram](ksp-class-diagram.svg){thumbnail="true" width="800" thumbnail-same-file="true"}

> [查看完整尺寸的图示](https://kotlinlang.org/docs/images/ksp-class-diagram.svg)。
>
{style="note"}

## 类型与解析

解析占据了底层 API 实现的大部分开销。因此，类型引用被设计为由处理器显式解析（少数情况除外）。当一个类型（例如 `KSFunctionDeclaration.returnType` 或 `KSAnnotation.annotationType`）被引用时，它始终是一个 `KSTypeReference`，这是一个带有注解和修饰符的 `KSReferenceElement`。

```kotlin
interface KSFunctionDeclaration : ... {
  val returnType: KSTypeReference?
  // ...
}

interface KSTypeReference : KSAnnotated, KSModifierListOwner {
  val type: KSReferenceElement
}
```

`KSTypeReference` 可以被解析为 `KSType`，后者指代 Kotlin 类型系统中的一个类型。

`KSTypeReference` 包含一个 `KSReferenceElement`，它对 Kotlin 的程序结构进行建模：即该引用是如何编写的。它对应于 Kotlin 语法中的 [`type`](https://kotlinlang.org/grammar/#type) 元素。

`KSReferenceElement` 可以是 `KSClassifierReference` 或 `KSCallableReference`，它们包含大量有用信息，而无需进行解析。例如，`KSClassifierReference` 具有 `referencedName`，而 `KSCallableReference` 具有 `receiverType`、`functionArguments` 和 `returnType`。

如果需要 `KSTypeReference` 引用的原始声明，通常可以通过解析为 `KSType` 并通过 `KSType.declaration` 进行访问。从提及类型的位置跳转到其类定义的位置，如下所示：

```kotlin
val ksType: KSType = ksTypeReference.resolve()
val ksDeclaration: KSDeclaration = ksType.declaration
```

类型解析开销很大，因此采用了显式形式。从解析中获得的部分信息在 `KSReferenceElement` 中已经可用。例如，`KSClassifierReference.referencedName` 可以过滤掉许多不感兴趣的元素。只有当您需要来自 `KSDeclaration` 或 `KSType` 的特定信息时，才应解析类型。

指向函数类型的 `KSTypeReference` 的大部分信息都包含在其元素中。虽然它可以被解析为 `Function0`、`Function1` 等系列，但这些解析并不会比 `KSCallableReference` 提供更多信息。解析函数类型引用的一个用例是处理函数原型的标识。