---
title: Javaとの比較
---
## Kotlin で対処される Java のいくつかの問題

Kotlin は Java が抱える一連の問題を修正します。

* Null 参照は[型システムによって制御](null-safety)されます。
* [Raw types がありません](java-interop#java-generics-in-kotlin)。
* Kotlin の配列は[不変](arrays)です。
* Kotlin には、Java の SAM 変換とは対照的に、適切な[関数型](lambdas#function-types)があります。
* ワイルドカードなしの[Use-site variance (利用場所変性)](generics#use-site-variance-type-projections)
* Kotlin にはチェックされる[例外](exceptions)がありません。
* [読み取り専用とミュータブル (mutable) なコレクションの分離されたインターフェース](collections-overview)

## Java にあって Kotlin にないもの

* [チェックされる例外](exceptions)
* クラスではない[プリミティブ型](basic-types)。バイトコードは可能な限りプリミティブを使用しますが、明示的に利用できるわけではありません。
* [Static メンバー](classes)は、[コンパニオンオブジェクト](object-declarations#companion-objects)、[トップレベル関数](functions)、[拡張関数](extensions#extension-functions)、または[@JvmStatic](java-to-kotlin-interop#static-methods)に置き換えられます。
* [ワイルドカード型](generics)は、[宣言場所変性](generics#declaration-site-variance)および[型プロジェクション](generics#type-projections)に置き換えられます。
* [三項演算子 `a ? b : c`](control-flow#if-expression)は、[if 式](control-flow#if-expression)に置き換えられます。
* [Records](https://openjdk.org/jeps/395)
* [Pattern Matching](https://openjdk.org/projects/amber/design-notes/patterns/pattern-matching-for-java)
* package-private [visibility modifier (可視性修飾子)](visibility-modifiers)

## Kotlin にあって Java にないもの

* [ラムダ式](lambdas) + [インライン関数](inline-functions) = 実行効率の高いカスタム制御構造
* [拡張関数](extensions)
* [Null-safety (Null 安全)](null-safety)
* [Smart casts (スマートキャスト)](typecasts) (**Java 16**: [Pattern Matching for instanceof](https://openjdk.org/jeps/394))
* [String templates (文字列テンプレート)](strings) (**Java 21**: [String Templates (Preview)](https://openjdk.org/jeps/430))
* [プロパティ](properties)
* [Primary constructors (プライマリコンストラクタ)](classes)
* [First-class delegation (ファーストクラスデリゲーション)](delegation)
* [Type inference (型推論) for variable and property types](basic-types) (**Java 10**: [Local-Variable Type Inference](https://openjdk.org/jeps/286))
* [Singletons (シングルトン)](object-declarations)
* [Declaration-site variance & Type projections (宣言場所変性と型プロジェクション)](generics)
* [Range expressions (範囲式)](ranges)
* [Operator overloading (演算子のオーバーロード)](operator-overloading)
* [Companion objects (コンパニオンオブジェクト)](classes#companion-objects)
* [Data classes (データクラス)](data-classes)
* [Coroutines (コルーチン)](coroutines-overview)
* [Top-level functions (トップレベル関数)](functions)
* [Default arguments (デフォルト引数)](functions#default-arguments)
* [Named parameters (名前付き引数)](functions#named-arguments)
* [Infix functions (infix 関数)](functions#infix-notation)
* [Expect and actual declarations (期待と実際の宣言)](multiplatform-expect-actual)
* [Explicit API mode (明示的な API モード)](whatsnew14#explicit-api-mode-for-library-authors) および [better control of API surface (API サーフェスのより良い制御)](opt-in-requirements)

## 次は何をしますか？

以下について学びます。
* [Java および Kotlin での文字列を使用した典型的なタスク](java-to-kotlin-idioms-strings)を実行します。
* [Java および Kotlin でのコレクションを使用した典型的なタスク](java-to-kotlin-collections-guide)を実行します。
* [Java および Kotlin での Null 可能性を処理](java-to-kotlin-nullability-guide)します。