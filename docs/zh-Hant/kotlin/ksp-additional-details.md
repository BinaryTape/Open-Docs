[//]: # (title: KSP 如何為 Kotlin 程式碼建模)

您可以在 [KSP GitHub 儲存庫](https://github.com/google/ksp/tree/main/api/src/main/kotlin/com/google/devtools/ksp) 找到 API 定義。
此圖表顯示了 KSP 如何為 Kotlin [建模](https://github.com/google/ksp/tree/main/api/src/main/kotlin/com/google/devtools/ksp/symbol/) 的概觀：

![class diagram](ksp-class-diagram.svg){thumbnail="true" width="800" thumbnail-same-file="true"}

> [查看完整尺寸圖表](https://kotlinlang.org/docs/images/ksp-class-diagram.svg)。
>
{style="note"}

## 型別與解析

解析佔據了底層 API 實作的大部分開銷。因此，型別參考被設計為由處理器明確解析（少數例外除外）。當參照一個 _型別_（例如 `KSFunctionDeclaration.returnType` 或 `KSAnnotation.annotationType`）時，它始終是一個 `KSTypeReference`，這是一個帶有註解和修飾詞的 `KSReferenceElement`。

```kotlin
interface KSFunctionDeclaration : ... {
  val returnType: KSTypeReference?
  // ...
}

interface KSTypeReference : KSAnnotated, KSModifierListOwner {
  val type: KSReferenceElement
}
```

`KSTypeReference` 可以被解析為 `KSType`，它參照 Kotlin 型別系統中的型別。

`KSTypeReference` 具有一個 `KSReferenceElement`，它對 Kotlin 的程式結構進行建模：即該參考是如何編寫的。它對應於 Kotlin 語法中的 [`type`](https://kotlinlang.org/grammar/#type) 元素。

`KSReferenceElement` 可以是 `KSClassifierReference` 或 `KSCallableReference`，其中包含許多有用的資訊而不需要解析。例如，`KSClassifierReference` 具有 `referencedName`，而 `KSCallableReference` 具有 `receiverType`、`functionArguments` 和 `returnType`。

如果需要 `KSTypeReference` 所參照的原始宣告，通常可以透過解析為 `KSType` 並透過 `KSType.declaration` 存取來找到。從提到型別的地方移動到其類別定義的地方如下所示：

```kotlin
val ksType: KSType = ksTypeReference.resolve()
val ksDeclaration: KSDeclaration = ksType.declaration
```

型別解析開銷很高，因此具有明確的形式。從解析中獲得的部分資訊在 `KSReferenceElement` 中已經可用。例如，`KSClassifierReference.referencedName` 可以篩選掉許多不感興趣的元素。只有在需要來自 `KSDeclaration` 或 `KSType` 的特定資訊時，才應該解析型別。

指向函式型別的 `KSTypeReference` 其大部分資訊都在其元素中。雖然它可以被解析為 `Function0`、`Function1` 等系列，但這些解析並不會比 `KSCallableReference` 提供更多資訊。解析函式型別參考的一個使用案例是處理函式原型的識別。