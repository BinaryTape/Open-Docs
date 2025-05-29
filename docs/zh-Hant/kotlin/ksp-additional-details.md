[//]: # (title: KSP 如何建模 Kotlin 程式碼)

您可以從 [KSP GitHub 儲存庫](https://github.com/google/ksp/tree/main/api/src/main/kotlin/com/google/devtools/ksp) 中找到 API 定義。
此圖表概述了 Kotlin 在 KSP 中是如何被[建模](https://github.com/google/ksp/tree/main/api/src/main/kotlin/com/google/devtools/ksp/symbol/)的：

![類別圖表](ksp-class-diagram.svg){thumbnail="true" width="800" thumbnail-same-file="true"}

> [檢視完整尺寸的圖表](https://kotlinlang.org/docs/images/ksp-class-diagram.svg)。
>
{style="note"}

## 類型與解析

解析佔用了底層 API 實作的大部分成本。因此，類型引用被設計為由處理器明確地解析（少數例外）。當一個_類型_（例如 `KSFunctionDeclaration.returnType` 或 `KSAnnotation.annotationType`）被引用時，它始終是一個 `KSTypeReference`，它是一個帶有註解和修飾詞的 `KSReferenceElement`。

```kotlin
interface KSFunctionDeclaration : ... {
  val returnType: KSTypeReference?
  // ...
}

interface KSTypeReference : KSAnnotated, KSModifierListOwner {
  val type: KSReferenceElement
}
```

一個 `KSTypeReference` 可以解析為一個 `KSType`，它指向 Kotlin 類型系統中的一個類型。

一個 `KSTypeReference` 擁有一個 `KSReferenceElement`，它建模了 Kotlin 的程式碼結構：即該引用是如何撰寫的。它對應於 Kotlin 語法中的 [`type`](https://kotlinlang.org/docs/reference/grammar.html#type) 元素。

一個 `KSReferenceElement` 可以是 `KSClassifierReference` 或 `KSCallableReference`，其中包含許多有用的資訊，無需解析。例如，`KSClassifierReference` 擁有 `referencedName`，而 `KSCallableReference` 則擁有 `receiverType`、`functionArguments` 和 `returnType`。

如果需要由 `KSTypeReference` 引用的原始宣告，通常可以透過解析為 `KSType` 並透過 `KSType.declaration` 存取來找到。從類型被提及的地方移動到其類別被定義的地方如下所示：

```kotlin
val ksType: KSType = ksTypeReference.resolve()
val ksDeclaration: KSDeclaration = ksType.declaration
```

類型解析成本高昂，因此具有明確的形式。從解析中獲得的一些資訊已經在 `KSReferenceElement` 中可用。例如，`KSClassifierReference.referencedName` 可以篩選掉許多不相關的元素。您應該僅在需要從 `KSDeclaration` 或 `KSType` 取得特定資訊時才解析類型。

指向函式類型的 `KSTypeReference` 其大部分資訊都在其元素中。儘管它可以解析為 `Function0`、`Function1` 等一系列函式，但這些解析並未帶來比 `KSCallableReference` 更多的資訊。解析函式類型引用的其中一個使用案例是處理函式原型的識別性。