[//]: # (title: キーワードと演算子)

## ハードキーワード

以下のトークンは常にキーワードとして解釈され、識別子として使用することはできません。

 * `as`
     - [型キャスト](typecasts.md#unsafe-cast-operator)に使用されます。
     - [import のエイリアス](packages.md#imports)を指定します。
 * `as?` は[安全な型キャスト](typecasts.md#safe-nullable-cast-operator)に使用されます。
 * `break` は[ループの実行を終了](returns.md)します。
 * `class` は[クラス](classes.md)を宣言します。
 * `continue` は[最も近い外側のループの次のステップに進み](returns.md)ます。
 * `do` は[do/while ループ](control-flow.md#while-loops)（後置条件を持つループ）を開始します。
 * `else` は条件が false の場合に実行される[if 式](control-flow.md#if-expression)のブランチを定義します。
 * `false` は[Boolean 型](booleans.md)の 'false' 値を指定します。
 * `for` は[for ループ](control-flow.md#for-loops)を開始します。
 * `fun` は[関数](functions.md)を宣言します。
 * `if` は[if 式](control-flow.md#if-expression)を開始します。
 * `in`
     - [for ループ](control-flow.md#for-loops)でイテレートされるオブジェクトを指定します。
     - 値が[範囲](ranges.md)、コレクション、または[「contains」メソッドを定義する](operator-overloading.md#in-operator)別のエンティティに属しているかをチェックするためのinfix演算子として使用されます。
     - [when 式](control-flow.md#when-expressions-and-statements)でも同じ目的で使用されます。
     - 型パラメータを[反変](generics.md#declaration-site-variance)としてマークします。
 * `!in`
     - 値が[範囲](ranges.md)、コレクション、または[「contains」メソッドを定義する](operator-overloading.md#in-operator)別のエンティティに属していないことをチェックする演算子として使用されます。
     - [when 式](control-flow.md#when-expressions-and-statements)でも同じ目的で使用されます。
 * `interface` は[インターフェース](interfaces.md)を宣言します。
 * `is`
     - [値が特定の型であるか](typecasts.md#is-and-is-operators)をチェックします。
     - [when 式](control-flow.md#when-expressions-and-statements)でも同じ目的で使用されます。
 * `!is`
     - [値が特定の型ではないか](typecasts.md#is-and-is-operators)をチェックします。
     - [when 式](control-flow.md#when-expressions-and-statements)でも同じ目的で使用されます。
 * `null` はどのオブジェクトも指していないオブジェクト参照を表す定数です。
 * `object` は[クラスとそのインスタンスを同時に宣言](object-declarations.md)します。
 * `package` は[現在のファイルのパッケージ](packages.md)を指定します。
 * `return` は[最も近い外側の関数または匿名関数から戻り](returns.md)ます。
 * `super`
     - [メソッドまたはプロパティのスーパークラス実装を参照](inheritance.md#calling-the-superclass-implementation)します。
     - [セカンダリコンストラクタからスーパークラスのコンストラクタを呼び出し](classes.md#inheritance)ます。
 * `this`
     - [現在のレシーバー](this-expressions.md)を参照します。
     - [セカンダリコンストラクタから同じクラスの別のコンストラクタを呼び出し](classes.md#constructors)ます。
 * `throw` は[例外をスロー](exceptions.md)します。
 * `true` は[Boolean 型](booleans.md)の 'true' 値を指定します。
 * `try` は[例外処理ブロックを開始](exceptions.md)します。
 * `typealias` は[型エイリアス](type-aliases.md)を宣言します。
 * `typeof` は将来の使用のために予約されています。
 * `val` は読み取り専用の[プロパティ](properties.md)または[ローカル変数](basic-syntax.md#variables)を宣言します。
 * `var` は可変の[プロパティ](properties.md)または[ローカル変数](basic-syntax.md#variables)を宣言します。
 * `when` は[when 式](control-flow.md#when-expressions-and-statements)（指定されたブランチのいずれかを実行）を開始します。
 * `while` は[while ループ](control-flow.md#while-loops)（前置条件を持つループ）を開始します。

## ソフトキーワード

以下のトークンは、適用されるコンテキストでキーワードとして機能し、他のコンテキストでは識別子として使用できます。

 * `by`
     - [インターフェースの実装を別のオブジェクトに委譲](delegation.md)します。
     - [プロパティのアクセサの実装を別のオブジェクトに委譲](delegated-properties.md)します。
 * `catch` は[特定の例外型を処理する](exceptions.md)ブロックを開始します。
 * `constructor` は[プライマリまたはセカンダリコンストラクタ](classes.md#constructors)を宣言します。
 * `delegate` は[アノテーションの使用サイトターゲット](annotations.md#annotation-use-site-targets)として使用されます。
 * `dynamic` はKotlin/JS コードで[動的型](dynamic-type.md)を参照します。
 * `field` は[アノテーションの使用サイトターゲット](annotations.md#annotation-use-site-targets)として使用されます。
 * `file` は[アノテーションの使用サイトターゲット](annotations.md#annotation-use-site-targets)として使用されます。
 * `finally` は[try ブロックが終了するときに常に実行される](exceptions.md)ブロックを開始します。
 * `get`
     - [プロパティのゲッター](properties.md#getters-and-setters)を宣言します。
     - [アノテーションの使用サイトターゲット](annotations.md#annotation-use-site-targets)として使用されます。
 * `import` は[別のパッケージから現在のファイルに宣言をインポート](packages.md)します。
 * `init` は[初期化ブロック](classes.md#constructors)を開始します。
 * `param` は[アノテーションの使用サイトターゲット](annotations.md#annotation-use-site-targets)として使用されます。
 * `property` は[アノテーションの使用サイトターゲット](annotations.md#annotation-use-site-targets)として使用されます。
 * `receiver` は[アノテーションの使用サイトターゲット](annotations.md#annotation-use-site-targets)として使用されます。
 * `set`
     - [プロパティのセッター](properties.md#getters-and-setters)を宣言します。
     - [アノテーションの使用サイトターゲット](annotations.md#annotation-use-site-targets)として使用されます。
* `setparam` は[アノテーションの使用サイトターゲット](annotations.md#annotation-use-site-targets)として使用されます。
* `value` は `class` キーワードとともに[インラインクラス](inline-classes.md)を宣言します。
* `where` は[ジェネリック型パラメータの制約](generics.md#upper-bounds)を指定します。

## 修飾子キーワード

以下のトークンは、宣言の修飾子リストでキーワードとして機能し、他のコンテキストでは識別子として使用できます。

 * `abstract` はクラスまたはメンバーを[抽象](classes.md#abstract-classes)としてマークします。
 * `actual` は[マルチプラットフォームプロジェクト](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-expect-actual.html)におけるプラットフォーム固有の実装を示します。
 * `annotation` は[アノテーションクラス](annotations.md)を宣言します。
 * `companion` は[コンパニオンオブジェクト](object-declarations.md#companion-objects)を宣言します。
 * `const` はプロパティを[コンパイル時定数](properties.md#compile-time-constants)としてマークします。
 * `crossinline` は[インライン関数に渡されるラムダ内の非ローカルリターンを禁止](inline-functions.md#returns)します。
 * `data` はコンパイラに[クラスの標準メンバーを生成する](data-classes.md)よう指示します。
 * `enum` は[列挙](enum-classes.md)を宣言します。
 * `expect` は宣言を[プラットフォーム固有](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-expect-actual.html)としてマークし、プラットフォームモジュールでの実装を期待します。
 * `external` は宣言がKotlinの外部で実装されている（[JNI](java-interop.md#using-jni-with-kotlin)または[JavaScript](js-interop.md#external-modifier)を介してアクセス可能）ことをマークします。
 * `final` は[メンバーのオーバーライドを禁止](inheritance.md#overriding-methods)します。
 * `infix` は[中置記法](functions.md#infix-notation)を使用して関数を呼び出すことを可能にします。
 * `inline` はコンパイラに[関数とそれに渡されるラムダを呼び出しサイトでインライン化](inline-functions.md)するよう指示します。
 * `inner` は[ネストされたクラス](nested-classes.md)から外側のクラスインスタンスを参照することを可能にします。
 * `internal` は宣言を[現在のモジュール内で可視](visibility-modifiers.md)としてマークします。
 * `lateinit` は[コンストラクタの外部でnull非許容プロパティを初期化](properties.md#late-initialized-properties-and-variables)することを可能にします。
 * `noinline` は[インライン関数に渡されるラムダのインライン化をオフ](inline-functions.md#noinline)にします。
 * `open` は[クラスのサブクラス化またはメンバーのオーバーライドを許可](classes.md#inheritance)します。
 * `operator` は関数を[演算子のオーバーロードまたは規約の実装](operator-overloading.md)としてマークします。
 * `out` は型パラメータを[共変](generics.md#declaration-site-variance)としてマークします。
 * `override` はメンバーを[スーパークラスメンバーのオーバーライド](inheritance.md#overriding-methods)としてマークします。
 * `private` は宣言を[現在のクラスまたはファイル内で可視](visibility-modifiers.md)としてマークします。
 * `protected` は宣言を[現在のクラスとそのサブクラス内で可視](visibility-modifiers.md)としてマークします。
 * `public` は宣言を[どこでも可視](visibility-modifiers.md)としてマークします。
 * `reified` はインライン関数の型パラメータを[実行時にアクセス可能](inline-functions.md#reified-type-parameters)としてマークします。
 * `sealed` は[sealed クラス](sealed-classes.md)（サブクラス化が制限されたクラス）を宣言します。
 * `suspend` は関数またはラムダをサスペンド（[コルーチン](coroutines-overview.md)として使用可能）としてマークします。
 * `tailrec` は関数を[末尾再帰](functions.md#tail-recursive-functions)（コンパイラが再帰をイテレーションに置き換えることを許可）としてマークします。
 * `vararg` は[パラメータに対して可変数の引数を渡す](functions.md#variable-number-of-arguments-varargs)ことを可能にします。

## 特別な識別子

以下の識別子は、特定のコンテキストでコンパイラによって定義され、他のコンテキストでは通常の識別子として使用できます。

 * `field` はプロパティアクセサ内で[プロパティのバッキングフィールド](properties.md#backing-fields)を参照するために使用されます。
 * `it` はラムダ内で[そのパラメータを暗黙的に参照する](lambdas.md#it-implicit-name-of-a-single-parameter)ために使用されます。

## 演算子と特殊記号

Kotlinは以下の演算子と特殊記号をサポートしています。

 * `+`, `-`, `*`, `/`, `%` - 数学演算子
     - `*` は[配列を vararg パラメータに渡す](functions.md#variable-number-of-arguments-varargs)ためにも使用されます。
 * `=`
     - 代入演算子。
     - [パラメータのデフォルト値](functions.md#default-arguments)を指定するために使用されます。
 * `+=`, `-=`, `*=`, `/=`, `%=` - [拡張代入演算子](operator-overloading.md#augmented-assignments)。
 * `++`, `--` - [インクリメントおよびデクリメント演算子](operator-overloading.md#increments-and-decrements)。
 * `&&`, `||`, `!` - 論理 'and'、'or'、'not' 演算子（ビット演算には、対応する[中置関数](numbers.md#operations-on-numbers)を使用してください）。
 * `==`, `!=` - [等値演算子](operator-overloading.md#equality-and-inequality-operators)（プリミティブ型以外の型では`equals()`の呼び出しに変換されます）。
 * `===`, `!==` - [参照等値演算子](equality.md#referential-equality)。
 * `<`, `>`, `<=`, `>=` - [比較演算子](operator-overloading.md#comparison-operators)（プリミティブ型以外の型では`compareTo()`の呼び出しに変換されます）。
 * `[`, `]` - [インデックスアクセス演算子](operator-overloading.md#indexed-access-operator)（`get`および`set`の呼び出しに変換されます）。
 * `!!` は[式がnull非許容であることをアサート](null-safety.md#not-null-assertion-operator)します。
 * `?.` は[セーフコール](null-safety.md#safe-call-operator)を実行します（レシーバーがnull非許容の場合にメソッドを呼び出すかプロパティにアクセスします）。
 * `?:` は左側の値がnullの場合に右側の値を取ります（[エルビス演算子](null-safety.md#elvis-operator)）。
 * `::` は[メンバー参照](reflection.md#function-references)または[クラス参照](reflection.md#class-references)を作成します。
 * `..`, `..<` は[範囲](ranges.md)を作成します。
 * `:` は宣言で名前と型を区切ります。
 * `?` は型を[null許容](null-safety.md#nullable-types-and-non-nullable-types)としてマークします。
 * `->`
     - [ラムダ式](lambdas.md#lambda-expression-syntax)のパラメータと本体を区切ります。
     - [関数型](lambdas.md#function-types)のパラメータと戻り値の型宣言を区切ります。
     - [when 式](control-flow.md#when-expressions-and-statements)のブランチの条件と本体を区切ります。
 * `@`
     - [アノテーション](annotations.md#usage)を導入します。
     - [ループラベル](returns.md#break-and-continue-labels)を導入または参照します。
     - [ラムダラベル](returns.md#return-to-labels)を導入または参照します。
     - [外側のスコープからの'this'式](this-expressions.md#qualified-this)を参照します。
     - [外側のスーパークラス](inheritance.md#calling-the-superclass-implementation)を参照します。
 * `;` は同じ行の複数のステートメントを区切ります。
 * `` ` `` は[文字列テンプレート](strings.md#string-templates)内の変数または式を参照します。
 * `_`
     - [ラムダ式](lambdas.md#underscore-for-unused-variables)で使用されていないパラメータを代替します。
     - [分割宣言](destructuring-declarations.md#underscore-for-unused-variables)で使用されていないパラメータを代替します。

演算子の優先順位については、Kotlin文法の[このリファレンス](https://kotlinlang.org/docs/reference/grammar.html#expressions)を参照してください。