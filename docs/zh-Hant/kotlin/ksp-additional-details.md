[//]: # (title: KSP 如何模型化 Kotlin 程式碼)

你可以在 [KSP GitHub 儲存庫](https://github.com/google/ksp/tree/main/api/src/main/kotlin/com/google/devtools/ksp) 找到 API 定義。
此圖表概述了 Kotlin 在 KSP 中是如何被[模型化](https://github.com/google/ksp/tree/main/api/src/main/kotlin/com/google/devtools/ksp/symbol/)的：

![類別圖表](ksp-class-diagram.svg){thumbnail="true" width="800" thumbnail-same-file="true"}

> [查看完整大小的圖表](https://kotlinlang.org/docs/images/ksp-class-diagram.svg)。
>
{style="note"}

## 型別與解析

解析會耗費底層 API 實作的大部分成本。因此，型別引用被設計為由處理器明確地解析（少數例外）。當一個 _型別_ (例如 `KSFunctionDeclaration.returnType` 或 `KSAnnotation.annotationType`) 被引用時，它總是一個 `KSTypeReference`，後者是一個帶有 `annotations` 和 `modifiers` 的 `KSReferenceElement`。

```kotlin
interface KSFunctionDeclaration : ... {
  val returnType: KSTypeReference?
  // ...
}

interface KSTypeReference : KSAnnotated, KSModifierListOwner {
  val type: KSReferenceElement
}
```

一個 `KSTypeReference` 可以被解析為一個 `KSType`，後者指的是 Kotlin 型別系統中的一個型別。

一個 `KSTypeReference` 具有一個 `KSReferenceElement`，它模型化了 Kotlin 的程式結構：即引用是如何被撰寫的。它對應於 Kotlin 語法中的 [`type`](https://kotlinlang.org/docs/reference/grammar.html#type) 元素。

一個 `KSReferenceElement` 可以是一個 `KSClassifierReference` 或 `KSCallableReference`，它們包含了許多有用的資訊，而無需解析。例如，`KSClassifierReference` 具有 `referencedName`，而 `KSCallableReference` 具有 `receiverType`、`functionArguments` 和 `returnType`。

如果需要 `KSTypeReference` 所引用的原始宣告，通常可以透過解析為 `KSType` 並透過 `KSType.declaration` 存取來找到它。從型別被提及的地方轉移到其類別被定義的地方，看起來像這樣：

```kotlin
val ksType: KSType = ksTypeReference.resolve()
val ksDeclaration: KSDeclaration = ksType.declaration
```

型別解析代價高昂，因此具有明確的形式。一些從解析中獲取的資訊已在 `KSReferenceElement` 中可用。例如，`KSClassifierReference.referencedName` 可以過濾掉許多不相關的元素。你只應在需要從 `KSDeclaration` 或 `KSType` 獲取特定資訊時才解析型別。

指向函式型別的 `KSTypeReference` 大部分資訊都在其元素中。儘管它可以被解析為 `Function0`、`Function1` 等家族，但這些解析不會帶來比 `KSCallableReference` 更多的資訊。解析函式型別引用的一個用例是處理函式原型的識別。