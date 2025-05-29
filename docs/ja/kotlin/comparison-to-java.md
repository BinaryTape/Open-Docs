[//]: # (title: Javaとの比較)

## Kotlinで解決されたJavaのいくつかの問題

Kotlinは、Javaが抱える一連の問題を解決します。

*   null参照が[型システムによって制御される](null-safety.md)。
*   [生（raw）の型がない](java-interop.md#java-generics-in-kotlin)
*   Kotlinの配列は[不変である](arrays.md)。
*   Kotlinは、JavaのSAM変換とは対照的に、適切な[関数型](lambdas.md#function-types)を持つ。
*   ワイルドカードなしの[利用サイト共変性/反変性（use-site variance）](generics.md#use-site-variance-type-projections)
*   Kotlinにはチェック済み[例外](exceptions.md)がない。
*   [読み取り専用とミュータブルなコレクションのインターフェースが分離されている](collections-overview.md)。

## JavaにはあってKotlinにはないもの

*   [チェック済み例外](exceptions.md)
*   [プリミティブ型](basic-types.md)はクラスではない。バイトコードは可能な限りプリミティブ型を使用するが、明示的に利用可能ではない。
*   [静的メンバー](classes.md)は、[コンパニオンオブジェクト](object-declarations.md#companion-objects)、[トップレベル関数](functions.md)、[拡張関数](extensions.md#extension-functions)、または[@JvmStatic](java-to-kotlin-interop.md#static-methods)に置き換えられる。
*   [ワイルドカード型](generics.md)は、[宣言サイト共変性/反変性（declaration-site variance）](generics.md#declaration-site-variance)および[型プロジェクション（type projections）](generics.md#type-projections)に置き換えられる。
*   [三項演算子 `a ? b : c`](control-flow.md#if-expression)は[if式](control-flow.md#if-expression)に置き換えられる。
*   [レコード（Records）](https://openjdk.org/jeps/395)
*   [パターンマッチング](https://openjdk.org/projects/amber/design-notes/patterns/pattern-matching-for-java)
*   パッケージプライベートな[可視性修飾子](visibility-modifiers.md)

## KotlinにはあってJavaにはないもの

*   [ラムダ式](lambdas.md) + [インライン関数](inline-functions.md) = パフォーマンスの高いカスタム制御構造
*   [拡張関数](extensions.md)
*   [null安全性](null-safety.md)
*   [スマートキャスト](typecasts.md)（**Java 16**: [instanceofのパターンマッチング](https://openjdk.org/jeps/394)）
*   [文字列テンプレート](strings.md)（**Java 21**: [文字列テンプレート (プレビュー)](https://openjdk.org/jeps/430)）
*   [プロパティ](properties.md)
*   [プライマリコンストラクタ](classes.md)
*   [ファーストクラスデリゲーション](delegation.md)
*   [変数とプロパティの型の型推論](basic-types.md)（**Java 10**: [ローカル変数型推論](https://openjdk.org/jeps/286)）
*   [シングルトン](object-declarations.md)
*   [宣言サイト共変性/反変性 & 型プロジェクション](generics.md)
*   [範囲式](ranges.md)
*   [演算子オーバーロード](operator-overloading.md)
*   [コンパニオンオブジェクト](classes.md#companion-objects)
*   [データクラス](data-classes.md)
*   [コルーチン](coroutines-overview.md)
*   [トップレベル関数](functions.md)
*   [デフォルト引数](functions.md#default-arguments)
*   [名前付き引数](functions.md#named-arguments)
*   [中置関数](functions.md#infix-notation)
*   [expect/actual宣言](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-expect-actual.html)
*   [明示的なAPIモード](whatsnew14.md#explicit-api-mode-for-library-authors)と[APIサーフェスのより良い制御](opt-in-requirements.md)

## 次は何を学ぶ？

次の方法を学びましょう：
*   [JavaとKotlinで文字列の一般的なタスクを実行する](java-to-kotlin-idioms-strings.md)。
*   [JavaとKotlinでコレクションの一般的なタスクを実行する](java-to-kotlin-collections-guide.md)。
*   [JavaとKotlinでnull可能性を扱う](java-to-kotlin-nullability-guide.md)。