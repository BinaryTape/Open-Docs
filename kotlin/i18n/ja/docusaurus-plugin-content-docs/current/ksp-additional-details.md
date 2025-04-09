---
title: KSPはKotlinコードをどのようにモデル化するか
---
[KSP GitHubリポジトリ](https://github.com/google/ksp/tree/main/api/src/main/kotlin/com/google/devtools/ksp)でAPI定義を確認できます。
以下の図は、KotlinがKSPでどのように[モデル化](https://github.com/google/ksp/tree/main/api/src/main/kotlin/com/google/devtools/ksp/symbol/)されているかの概要を示しています。

<img src="/img/ksp-class-diagram.svg" alt="class diagram" width="800" style={{verticalAlign: 'middle'}}/>
:::note
[フルサイズの図を参照してください](https://kotlinlang.org/docs/images/ksp-class-diagram.svg)。

:::

## 型と解決

解決（resolution）は、基盤となるAPI実装のコストの大部分を占めます。そのため、型参照は、（いくつかの例外を除き）プロセッサによって明示的に解決されるように設計されています。`KSFunctionDeclaration.returnType`や`KSAnnotation.annotationType`のような_型_が参照される場合、それは常に`KSTypeReference`であり、これはアノテーションと修飾子を持つ`KSReferenceElement`です。

```kotlin
interface KSFunctionDeclaration : ... {
  val returnType: KSTypeReference?
  // ...
}

interface KSTypeReference : KSAnnotated, KSModifierListOwner {
  val type: KSReferenceElement
}
```

`KSTypeReference`は`KSType`に解決（resolve）でき、これはKotlinの型システムにおける型を参照します。

`KSTypeReference`は`KSReferenceElement`を持っており、これはKotlinのプログラム構造、すなわち参照がどのように記述されているかをモデル化します。これはKotlinの文法における[`type`](https://kotlinlang.org/docs/reference/grammar.html#type)要素に対応します。

`KSReferenceElement`は`KSClassifierReference`または`KSCallableReference`になることができ、これらは解決を必要とせずに多くの有用な情報を含んでいます。例えば、`KSClassifierReference`は`referencedName`を持ち、`KSCallableReference`は`receiverType`、`functionArguments`、および`returnType`を持ちます。

`KSTypeReference`によって参照される元の宣言が必要な場合、通常は`KSType`に解決し、`KSType.declaration`を通じてアクセスすることで見つけることができます。型が言及されている場所から、そのクラスが定義されている場所に移動する様子は次のようになります。

```kotlin
val ksType: KSType = ksTypeReference.resolve()
val ksDeclaration: KSDeclaration = ksType.declaration
```

型解決はコストがかかるため、明示的な形式をとります。解決から得られる情報の一部は、すでに`KSReferenceElement`で利用可能です。例えば、`KSClassifierReference.referencedName`は、関心のない多くの要素をフィルタリングできます。`KSDeclaration`または`KSType`からの特定の情報が必要な場合にのみ、型を解決する必要があります。

関数型を指す`KSTypeReference`は、その要素にほとんどの情報を持っています。
`Function0`、`Function1`などのファミリーに解決できますが、これらの解決は`KSCallableReference`以上の情報をもたらしません。関数型参照を解決するユースケースの1つは、関数のプロトタイプのアイデンティティを扱うことです。