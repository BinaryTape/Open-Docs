---
title: "KSP 如何对 Kotlin 代码建模"
---
你可以在 [KSP GitHub 仓库](https://github.com/google/ksp/tree/main/api/src/main/kotlin/com/google/devtools/ksp)中找到 API 定义。
下图展示了 Kotlin 在 KSP 中是如何被[建模](https://github.com/google/ksp/tree/main/api/src/main/kotlin/com/google/devtools/ksp/symbol/)的概览：

<img src="/img/ksp-class-diagram.svg" alt="class diagram" width="800" style={{verticalAlign: 'middle'}}/>
:::note
[查看完整尺寸的图表](https://kotlinlang.org/docs/images/ksp-class-diagram.svg)。

:::

## 类型和解析 (Type and resolution)

解析 (resolution) 占据了底层 API 实现的大部分成本。因此，类型引用被设计为由处理器 (processor) 显式解析（有一些例外）。当一个 *类型* （例如 `KSFunctionDeclaration.returnType` 或 `KSAnnotation.annotationType`）被引用时，它始终是一个 `KSTypeReference`，它是一个带有注解 (annotation) 和修饰符 (modifier) 的 `KSReferenceElement`。

```kotlin
interface KSFunctionDeclaration : ... {
  val returnType: KSTypeReference?
  // ...
}

interface KSTypeReference : KSAnnotated, KSModifierListOwner {
  val type: KSReferenceElement
}
```

`KSTypeReference` 可以被解析为 `KSType`，它指向 Kotlin 类型系统中的一个类型。

`KSTypeReference` 有一个 `KSReferenceElement`，它对 Kotlin 的程序结构进行建模：即，引用是如何编写的。它对应于 Kotlin 语法中的 [`type`](https://kotlinlang.org/docs/reference/grammar.html#type) 元素。

`KSReferenceElement` 可以是 `KSClassifierReference` 或 `KSCallableReference`，它们包含大量有用的信息，而无需进行解析。 例如，`KSClassifierReference` 具有 `referencedName`，而 `KSCallableReference` 具有 `receiverType`、`functionArguments` 和 `returnType`。

如果需要 `KSTypeReference` 引用的原始声明，通常可以通过解析为 `KSType` 并通过 `KSType.declaration` 访问来找到它。 从提到类型的位置移动到定义其类 (class) 的位置如下所示：

```kotlin
val ksType: KSType = ksTypeReference.resolve()
val ksDeclaration: KSDeclaration = ksType.declaration
```

类型解析 (type resolution) 的代价很高，因此具有显式形式。 从解析获得的一些信息已在 `KSReferenceElement` 中可用。 例如，`KSClassifierReference.referencedName` 可以过滤掉许多不相关的元素。 只有在需要来自 `KSDeclaration` 或 `KSType` 的特定信息时，才应解析类型。

指向函数类型的 `KSTypeReference` 在其元素中包含其大部分信息。
虽然它可以解析为 `Function0`、`Function1` 等系列，但这些解析不会带来比 `KSCallableReference` 更多的信息。 解析函数类型引用的一个用例是处理函数原型 (prototype) 的标识。