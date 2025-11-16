[//]: # (title: Javaとの比較)

## Kotlinで解決されたJavaのいくつかの問題

Kotlinは、Javaが抱える一連の問題を解決します。

* ヌル参照は[型システムによって制御されます](null-safety.md)。
* [ロー型がない](java-interop.md#java-generics-in-kotlin)
* Kotlinの配列は[不変です](arrays.md)
* Kotlinには、JavaのSAM変換とは異なり、適切な[関数型があります](lambdas.md#function-types)
* ワイルドカードなしの[使用サイト変性](generics.md#use-site-variance-type-projections)
* Kotlinにはチェック[例外がありません](exceptions.md)
* [読み取り専用と可変コレクション用の別々のインターフェース](collections-overview.md)

## JavaにあってKotlinにはないもの

* [チェック例外](exceptions.md)
* クラスではない[プリミティブ型](types-overview.md)。バイトコードは可能な限りプリミティブを使用しますが、明示的に利用することはできません。
* [静的メンバー](classes.md)は、[コンパニオンオブジェクト](object-declarations.md#companion-objects)、[トップレベル関数](functions.md)、[拡張関数](extensions.md#extension-functions)、または[`@JvmStatic`](java-to-kotlin-interop.md#static-methods)に置き換えられます。
* [ワイルドカード型](generics.md)は、[宣言サイト変性](generics.md#declaration-site-variance)と[型プロジェクション](generics.md#type-projections)に置き換えられます。
* [三項演算子 `a ? b : c`](control-flow.md#if-expression)は[if式](control-flow.md#if-expression)に置き換えられます。
* [Records](https://openjdk.org/jeps/395)
* [パターンマッチング](https://openjdk.org/projects/amber/design-notes/patterns/pattern-matching-for-java)
* パッケージプライベートの[可視性修飾子](visibility-modifiers.md)

## KotlinにあってJavaにはないもの

* [ラムダ式](lambdas.md) + [インライン関数](inline-functions.md) = パフォーマンスの高いカスタム制御構造
* [拡張関数](extensions.md)
* [ヌル安全性](null-safety.md)
* [スマートキャスト](typecasts.md) (**Java 16**: [`instanceof`のパターンマッチング](https://openjdk.org/jeps/394))
* [文字列テンプレート](strings.md)
* [プロパティ](properties.md)
* [プライマリコンストラクタ](classes.md)
* [ファーストクラスのデリゲーション](delegation.md)
* [変数およびプロパティ型の型推論](types-overview.md) (**Java 10**: [ローカル変数型推論](https://openjdk.org/jeps/286))
* [シングルトン](object-declarations.md)
* [宣言サイト変性 & 型プロジェクション](generics.md)
* [範囲式](ranges.md)
* [演算子オーバーロード](operator-overloading.md)
* [コンパニオンオブジェクト](classes.md#companion-objects)
* [データクラス](data-classes.md)
* [コルーチン](coroutines-overview.md)
* [トップレベル関数](functions.md)
* [デフォルト値を持つパラメータ](functions.md#parameters-with-default-values)
* [名前付きパラメータ](functions.md#named-arguments)
* [中置関数](functions.md#infix-notation)
* [`expect`および`actual`宣言](https://kotlinlang.org/docs/multiplatform/multiplatform-expect-actual.html)
* [明示的APIモード](whatsnew14.md#explicit-api-mode-for-library-authors)と[APIサーフェスのより良い制御](opt-in-requirements.md)

## 次は何ですか？

次の方法を学びましょう：
* JavaとKotlinで[文字列を使った一般的なタスクを実行する](java-to-kotlin-idioms-strings.md)。
* JavaとKotlinで[コレクションを使った一般的なタスクを実行する](java-to-kotlin-collections-guide.md)。
* JavaとKotlinで[null可能性を処理する](java-to-kotlin-nullability-guide.md)。