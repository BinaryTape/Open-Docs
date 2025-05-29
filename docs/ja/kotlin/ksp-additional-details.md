[//]: # (title: KSPがKotlinコードをどのようにモデル化するか)

APIの定義は[KSPのGitHubリポジトリ](https://github.com/google/ksp/tree/main/api/src/main/kotlin/com/google/devtools/ksp)で確認できます。
以下の図は、KSPでKotlinがどのように[モデル化されているか](https://github.com/google/ksp/tree/main/api/src/main/kotlin/com/google/devtools/ksp/symbol/)の概要を示しています。

![class diagram](ksp-class-diagram.svg){thumbnail="true" width="800" thumbnail-same-file="true"}

> [フルサイズの図を見る](https://kotlinlang.org/docs/images/ksp-class-diagram.svg)。
>
{style="note"}

## 型と解決

解決（resolution）は、基盤となるAPI実装のコストの大部分を占めます。そのため、型参照は（いくつかの例外を除いて）プロセッサによって明示的に解決されるように設計されています。`_type_`（`KSFunctionDeclaration.returnType`や`KSAnnotation.annotationType`など）が参照される場合、それは常に`KSTypeReference`であり、これはアノテーションと修飾子を持つ`KSReferenceElement`です。

```kotlin
interface KSFunctionDeclaration : ... {
  val returnType: KSTypeReference?
  // ...
}

interface KSTypeReference : KSAnnotated, KSModifierListOwner {
  val type: KSReferenceElement
}
```

`KSTypeReference`は`KSType`に解決することができ、これはKotlinの型システムにおける型を参照します。

`KSTypeReference`には`KSReferenceElement`があり、これはKotlinのプログラム構造、つまり参照がどのように書かれているかをモデル化します。これはKotlinの文法における[`type`](https://kotlinlang.org/docs/reference/grammar.html#type)要素に対応します。

`KSReferenceElement`は`KSClassifierReference`または`KSCallableReference`であることができ、これらは解決の必要なく多くの有用な情報を含んでいます。例えば、`KSClassifierReference`は`referencedName`を持ち、`KSCallableReference`は`receiverType`、`functionArguments`、`returnType`を持っています。

`KSTypeReference`によって参照される元の宣言が必要な場合、通常は`KSType`に解決し、`KSType.declaration`を介してアクセスすることで見つけることができます。型が言及されている箇所から、そのクラスが定義されている箇所へ移動する例は次のようになります。

```kotlin
val ksType: KSType = ksTypeReference.resolve()
val ksDeclaration: KSDeclaration = ksType.declaration
```

型解決はコストがかかるため、明示的な形式をとります。解決によって得られる情報の一部は、`KSReferenceElement`で既に利用可能です。例えば、`KSClassifierReference.referencedName`を使用すると、多くの不要な要素をフィルタリングできます。`KSDeclaration`または`KSType`から特定の情報が必要な場合にのみ、型を解決すべきです。

関数型を指す`KSTypeReference`は、その要素にほとんどの情報を持っています。`Function0`、`Function1`などのファミリーに解決することはできますが、これらの解決は`KSCallableReference`以上の情報をもたらしません。関数型参照を解決する1つのユースケースは、関数のプロトタイプの同一性（identity）を扱う場合です。