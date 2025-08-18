[//]: # (title: KSPにおけるKotlinコードのモデル化)

API定義は、[KSP GitHubリポジトリ](https://github.com/google/ksp/tree/main/api/src/main/kotlin/com/google/devtools/ksp)で確認できます。
この図は、KSPでKotlinがどのように[モデル化](https://github.com/google/ksp/tree/main/api/src/main/kotlin/com/google/devtools/ksp/symbol/)されるかの概要を示しています。

![クラス図](ksp-class-diagram.svg){thumbnail="true" width="800" thumbnail-same-file="true"}

> [フルサイズの図を参照](https://kotlinlang.org/docs/images/ksp-class-diagram.svg)。
>
{style="note"}

## 型と解決

解決処理は、基盤となるAPI実装において最もコストがかかります。そのため、型参照はプロセッサによって明示的に解決されるように設計されています（いくつかの例外を除いて）。`KSFunctionDeclaration.returnType` や `KSAnnotation.annotationType` のような _型_ が参照される場合、それは常に `KSTypeReference` であり、アノテーションと修飾子を持つ `KSReferenceElement` です。

```kotlin
interface KSFunctionDeclaration : ... {
  val returnType: KSTypeReference?
  // ...
}

interface KSTypeReference : KSAnnotated, KSModifierListOwner {
  val type: KSReferenceElement
}
```

`KSTypeReference` は `KSType` に解決することができ、これはKotlinの型システムにおける型を参照します。

`KSTypeReference` は `KSReferenceElement` を持ち、これはKotlinのプログラム構造、つまり参照がどのように記述されているかをモデル化します。これは、Kotlinの文法における [`type`](https://kotlinlang.org/docs/reference/grammar.html#type) 要素に対応します。

`KSReferenceElement` は `KSClassifierReference` または `KSCallableReference` となり得ます。これらは、解決の必要なしに多くの有用な情報を含んでいます。例えば、`KSClassifierReference` には `referencedName` があり、`KSCallableReference` には `receiverType`、`functionArguments`、`returnType` があります。

`KSTypeReference` によって参照される元の宣言が必要な場合、通常は `KSType` に解決し、`KSType.declaration` を介してアクセスすることで見つけることができます。型が言及されている場所からそのクラスが定義されている場所へ移動するのは次のようになります。

```kotlin
val ksType: KSType = ksTypeReference.resolve()
val ksDeclaration: KSDeclaration = ksType.declaration
```

型の解決はコストが高く、したがって明示的な形式を持っています。解決から得られる情報の一部は、`KSReferenceElement` ですでに利用可能です。例えば、`KSClassifierReference.referencedName` を使用すると、不要な多くの要素をフィルタリングできます。`KSDeclaration` または `KSType` から特定の情報が必要な場合にのみ、型を解決すべきです。

関数型を指す `KSTypeReference` は、その情報のほとんどをその要素内に持っています。
`Function0`、`Function1` などのファミリーに解決できますが、これらの解決は `KSCallableReference` よりも多くの情報をもたらしません。関数型参照を解決するユースケースの1つは、関数のプロトタイプ（prototype）の同一性を扱うことです。