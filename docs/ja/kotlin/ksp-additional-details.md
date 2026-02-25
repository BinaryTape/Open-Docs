[//]: # (title: KSP が Kotlin コードをモデル化する方法)

API 定義は [KSP GitHub リポジトリ](https://github.com/google/ksp/tree/main/api/src/main/kotlin/com/google/devtools/ksp) で確認できます。
この図は、KSP において Kotlin がどのように [モデル化](https://github.com/google/ksp/tree/main/api/src/main/kotlin/com/google/devtools/ksp/symbol/) されているかの概要を示しています。

![class diagram](ksp-class-diagram.svg){thumbnail="true" width="800" thumbnail-same-file="true"}

> [フルサイズの図を表示](https://kotlinlang.org/docs/images/ksp-class-diagram.svg)。
>
{style="note"}

## 型と解決 (Resolution)

解決（resolution）は、基盤となる API 実装において最もコストがかかる部分です。そのため、型参照は（いくつかの例外を除き）プロセッサによって明示的に解決されるように設計されています。`KSFunctionDeclaration.returnType` や `KSAnnotation.annotationType` などの *型* が参照される場合、それは常に `KSTypeReference` であり、これはアノテーションと修飾子を持つ `KSReferenceElement` です。

```kotlin
interface KSFunctionDeclaration : ... {
  val returnType: KSTypeReference?
  // ...
}

interface KSTypeReference : KSAnnotated, KSModifierListOwner {
  val type: KSReferenceElement
}
```

`KSTypeReference` は `KSType` に解決（resolve）でき、これは Kotlin の型システムにおける型を参照します。

`KSTypeReference` は `KSReferenceElement` を持っています。これは Kotlin のプログラム構造、つまり参照がどのように記述されているかをモデル化したものです。これは Kotlin 文法の [`type`](https://kotlinlang.org/grammar/#type) 要素に対応します。

`KSReferenceElement` は `KSClassifierReference` または `KSCallableReference` のいずれかになり得ます。これらには、解決を必要とせずに得られる多くの有用な情報が含まれています。例えば、`KSClassifierReference` には `referencedName` があり、`KSCallableReference` には `receiverType`、`functionArguments`、および `returnType` があります。

`KSTypeReference` によって参照されている元の宣言が必要な場合は、通常、`KSType` へ解決し、`KSType.declaration` を通じてアクセスすることで見つけることができます。型が記述されている場所から、そのクラスが定義されている場所へ移動する流れは以下のようになります。

```kotlin
val ksType: KSType = ksTypeReference.resolve()
val ksDeclaration: KSDeclaration = ksType.declaration
```

型の解決はコストがかかるため、明示的な形式をとっています。解決から得られる情報の一部は、すでに `KSReferenceElement` で利用可能です。例えば、`KSClassifierReference.referencedName` を使用することで、関心のない要素の多くをフィルタリングできます。`KSDeclaration` や `KSType` から特定の情報が必要な場合にのみ、型を解決するようにしてください。

関数型を指す `KSTypeReference` は、その要素内にほとんどの情報を持っています。
`Function0` や `Function1` などのファミリーに解決することも可能ですが、これらの解決は `KSCallableReference` 以上の情報をもたらしません。関数型参照を解決するユースケースの一つとしては、関数のプロトタイプの同一性を扱う場合などが挙げられます。