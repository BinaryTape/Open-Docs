---
title: "KSP 如何對 Kotlin 程式碼建模"
---
您可以在 [KSP GitHub 儲存庫](https://github.com/google/ksp/tree/main/api/src/main/kotlin/com/google/devtools/ksp)中找到 API 定義。
下圖顯示了 Kotlin 在 KSP 中如何被[建模](https://github.com/google/ksp/tree/main/api/src/main/kotlin/com/google/devtools/ksp/symbol/)的概觀：

<img src="/img/ksp-class-diagram.svg" alt="class diagram" width="800" style={{verticalAlign: 'middle'}}/>
:::note
[查看完整尺寸的圖表](https://kotlinlang.org/docs/images/ksp-class-diagram.svg)。

:::

## 類型和解析 (Type and resolution)

解析 (resolution) 佔用了底層 API 實作的大部分成本。因此，類型引用 (type references) 被設計為由處理器 (processors) 顯式解析（有一些例外）。當引用一個*類型*（例如 `KSFunctionDeclaration.returnType` 或 `KSAnnotation.annotationType`）時，它始終是一個 `KSTypeReference`，它是一個帶有註解 (annotations) 和修飾符 (modifiers) 的 `KSReferenceElement`。

```kotlin
interface KSFunctionDeclaration : ... {
  val returnType: KSTypeReference?
  // ...
}

interface KSTypeReference : KSAnnotated, KSModifierListOwner {
  val type: KSReferenceElement
}
```

一個 `KSTypeReference` 可以被解析為一個 `KSType`，它指向 Kotlin 類型系統中的一個類型。

一個 `KSTypeReference` 有一個 `KSReferenceElement`，它對 Kotlin 的程式結構進行建模：即，引用是如何被編寫的。它對應於 Kotlin 文法中的 [`type`](https://kotlinlang.org/docs/reference/grammar.html#type) 元素。

一個 `KSReferenceElement` 可以是一個 `KSClassifierReference` 或 `KSCallableReference`，它包含大量有用的信息，而不需要解析。例如，`KSClassifierReference` 具有 `referencedName`，而 `KSCallableReference` 具有 `receiverType`、`functionArguments` 和 `returnType`。

如果需要 `KSTypeReference` 引用的原始宣告 (original declaration)，通常可以通過解析為 `KSType` 並通過 `KSType.declaration` 訪問來找到它。從類型被提及的地方移動到其類別被定義的地方看起來像這樣：

```kotlin
val ksType: KSType = ksTypeReference.resolve()
val ksDeclaration: KSDeclaration = ksType.declaration
```

類型解析 (Type resolution) 的成本很高，因此具有顯式形式 (explicit form)。從解析 (resolution) 獲得的某些信息已經在 `KSReferenceElement` 中可用。例如，`KSClassifierReference.referencedName` 可以過濾掉許多不感興趣的元素。只有在需要來自 `KSDeclaration` 或 `KSType` 的特定信息時，才應該解析類型。

指向函數類型 (function type) 的 `KSTypeReference` 的大多數信息都在其元素 (element) 中。
雖然它可以被解析為 `Function0`、`Function1` 等系列，但這些解析 (resolutions) 並沒有帶來比 `KSCallableReference` 更多的信息。解析函數類型引用 (function type references) 的一個用例是處理函數原型 (function's prototype) 的身份。