[//]: # (title: Java との比較)

## Kotlin で解決された Java のいくつかの問題

Kotlin は、Java が抱える一連の問題を解決しています。

*   Null 参照は[型システムによって制御](null-safety.md)されています。
*   [生型 (Raw types) が存在しません](java-interop.md#java-generics-in-kotlin)。
*   Kotlin の配列は[非変 (Invariant)](arrays.md) です。
*   Kotlin には、Java の SAM 変換とは対照的に、適切な[関数型 (Function types)](lambdas.md#function-types) があります。
*   ワイルドカードを使用しない[使用場所変異 (Use-site variance)](generics.md#use-site-variance-type-projections)。
*   Kotlin にはチェックされる[例外 (Exceptions)](exceptions.md) がありません。
*   [読み取り専用コレクションと可変コレクションのための独立したインターフェース](collections-overview.md)があります。

## Kotlin にはなく Java にあるもの

*   [チェック例外 (Checked exceptions)](exceptions.md)
*   クラスではない[プリミティブ型 (Primitive types)](types-overview.md)。バイトコードでは可能な限りプリミティブが使用されますが、明示的に利用することはできません。
*   [static メンバー](classes.md)は、[コンパニオンオブジェクト (Companion objects)](object-declarations.md#companion-objects)、[トップレベル関数](functions.md)、[拡張関数](extensions.md#extension-functions)、または [@JvmStatic](java-to-kotlin-interop.md#static-methods) に置き換えられます。
*   [ワイルドカード型 (Wildcard-types)](generics.md) は、[宣言場所変異 (Declaration-site variance)](generics.md#declaration-site-variance) と[型プロジェクション (Type projections)](generics.md#type-projections) に置き換えられます。
*   [三項演算子 `a ? b : c`](control-flow.md#if-expression) は、[if 式](control-flow.md#if-expression)に置き換えられます。
*   [レコード (Records)](https://openjdk.org/jeps/395)
*   package-private [可視性修飾子 (Visibility modifier)](visibility-modifiers.md)

> Kotlin にはパターンマッチングはありませんが、[Kotlin のスマートキャスト](typecasts.md#smart-casts)は、[Java のパターンマッチング](https://openjdk.org/projects/amber/design-notes/patterns/pattern-matching-for-java)と同様の機能を提供します。
>
> 詳細は、[JetBrains による Kotlin 公式チャンネルのこの動画](https://www.youtube.com/watch?v=yJDoa42X-wQ)でご確認ください。
>
{style="note"}

## Java にはなく Kotlin にあるもの

*   [ラムダ式 (Lambda expressions)](lambdas.md) + [インライン関数 (Inline functions)](inline-functions.md) = 高パフォーマンスなカスタム制御構造
*   [拡張関数 (Extension functions)](extensions.md)
*   [Null 安全 (Null-safety)](null-safety.md)
*   [文字列テンプレート (String templates)](strings.md)
*   [プロパティ (Properties)](properties.md)
*   [プライマリコンストラクタ (Primary constructors)](classes.md)
*   [第一級デリゲーション (First-class delegation)](delegation.md)
*   [変数およびプロパティの型の型推論](types-overview.md) (**Java 10**: [ローカル変数型推論 (Local-Variable Type Inference)](https://openjdk.org/jeps/286))
*   [シングルトン (Singletons)](object-declarations.md)
*   [宣言場所変異 (Declaration-site variance) と型プロジェクション (Type projections)](generics.md)
*   [範囲式 (Range expressions)](ranges.md)
*   [演算子オーバーロード (Operator overloading)](operator-overloading.md)
*   [コンパニオンオブジェクト (Companion objects)](classes.md#companion-objects)
*   [データクラス (Data classes)](data-classes.md)
*   [コルーチン (Coroutines)](coroutines-overview.md)
*   [トップレベル関数 (Top-level functions)](functions.md)
*   [デフォルト値を持つ引数 (Parameters with default values)](functions.md#parameters-with-default-values)
*   [名前付き引数 (Named parameters)](functions.md#named-arguments)
*   [中置関数 (Infix functions)](functions.md#infix-notation)
*   [expect および actual 宣言](https://kotlinlang.org/docs/multiplatform/multiplatform-expect-actual.html)
*   [Explicit API モード](whatsnew14.md#explicit-api-mode-for-library-authors) および [API サーフェスのより優れた制御](opt-in-requirements.md)

> Java にはスマートキャストはありませんが、[パターンマッチング](https://openjdk.org/projects/amber/design-notes/patterns/pattern-matching-for-java)が [Kotlin のスマートキャスト](typecasts.md#smart-casts)と同様の機能を提供します。
>
> 詳細は、[JetBrains による Kotlin 公式チャンネルのこの動画](https://www.youtube.com/watch?v=yJDoa42X-wQ)でご確認ください。
>
{style="note"}

## 次のステップ

以下の方法について学びましょう：
*   [Java と Kotlin での文字列に関する一般的なタスク](java-to-kotlin-idioms-strings.md)の実行。
*   [Java と Kotlin でのコレクションに関する一般的なタスク](java-to-kotlin-collections-guide.md)の実行。
*   [Java と Kotlin での Null 許容性の処理](java-to-kotlin-nullability-guide.md)。