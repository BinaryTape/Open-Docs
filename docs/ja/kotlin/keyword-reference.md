[//]: # (title: キーワードと演算子)

## ハードキーワード

次のトークンは常にキーワードとして解釈され、識別子として使用することはできません。

 * `as`
     - [型キャスト](typecasts.md#unsafe-cast-operator)に使用されます。
     - [インポートのエイリアス](packages.md#imports)を指定します。
 * `as?` は[安全な型キャスト](typecasts.md#safe-nullable-cast-operator)に使用されます。
 * `break` は[ループの実行を終了します](returns.md)。
 * `class` は[クラス](classes.md)を宣言します。
 * `continue` は[最も近い囲んでいるループの次のステップに進みます](returns.md)。
 * `do` は[do/whileループ](control-flow.md#while-loops)（後置条件付きループ）を開始します。
 * `else` は条件がfalseの場合に実行される[if式](control-flow.md#if-expression)のブランチを定義します。
 * `false` は[Boolean型](booleans.md)の'false'値を指定します。
 * `for` は[forループ](control-flow.md#for-loops)を開始します。
 * `fun` は[関数](functions.md)を宣言します。
 * `if` は[if式](control-flow.md#if-expression)を開始します。
 * `in`
     - [forループ](control-flow.md#for-loops)でイテレートされるオブジェクトを指定します。
     - [範囲](ranges.md)、コレクション、または['contains'メソッドを定義する](operator-overloading.md#in-operator)その他のエンティティに値が属するかどうかをチェックする中置演算子として使用されます。
     - [when式](control-flow.md#when-expressions-and-statements)でも同じ目的で使用されます。
     - 型パラメータを[反変](generics.md#declaration-site-variance)としてマークします。
 * `!in`
     - [範囲](ranges.md)、コレクション、または['contains'メソッドを定義する](operator-overloading.md#in-operator)その他のエンティティに値が属さないことをチェックする演算子として使用されます。
     - [when式](control-flow.md#when-expressions-and-statements)でも同じ目的で使用されます。
 * `interface` は[インターフェース](interfaces.md)を宣言します。
 * `is`
     - [値が特定の型であるか](typecasts.md#is-and-is-operators)をチェックします。
     - [when式](control-flow.md#when-expressions-and-statements)でも同じ目的で使用されます。
 * `!is`
     - [値が特定の型ではないか](typecasts.md#is-and-is-operators)をチェックします。
     - [when式](control-flow.md#when-expressions-and-statements)でも同じ目的で使用されます。
 * `null` はどのオブジェクトも指さないオブジェクト参照を表す定数です。
 * `object` は[クラスとそのインスタンスを同時に](object-declarations.md)宣言します。
 * `package` は[現在のファイルのパッケージ](packages.md)を指定します。
 * `return` は[最も近い囲んでいる関数または匿名関数から戻ります](returns.md)。
 * `super`
     - [メソッドまたはプロパティのスーパークラス実装を参照します](inheritance.md#calling-the-superclass-implementation)。
     - [セカンダリコンストラクタからスーパークラスコンストラクタを呼び出します](classes.md#inheritance)。
 * `this`
     - [現在のレシーバ](this-expressions.md)を参照します。
     - [セカンダリコンストラクタから同じクラスの別のコンストラクタを呼び出します](classes.md#constructors-and-initializer-blocks)。
 * `throw` は[例外をスローします](exceptions.md)。
 * `true` は[Boolean型](booleans.md)の'true'値を指定します。
 * `try` は[例外処理ブロックを開始します](exceptions.md)。
 * `typealias` は[型エイリアス](type-aliases.md)を宣言します。
 * `typeof` は将来の使用のために予約されています。
 * `val` は読み取り専用の[プロパティ](properties.md)または[ローカル変数](basic-syntax.md#variables)を宣言します。
 * `var` は可変の[プロパティ](properties.md)または[ローカル変数](basic-syntax.md#variables)を宣言します。
 * `when` は[when式](control-flow.md#when-expressions-and-statements)（与えられたブランチの1つを実行）を開始します。
 * `while` は[whileループ](control-flow.md#while-loops)（前置条件付きループ）を開始します。

## ソフトキーワード

次のトークンは、適用可能なコンテキストではキーワードとして機能し、他のコンテキストでは識別子として使用できます。

 * `by`
     - [インターフェースの実装を別のオブジェクトに委譲します](delegation.md)。
     - [プロパティのアクセサの実装を別のオブジェクトに委譲します](delegated-properties.md)。
 * `catch` は[特定の例外型を処理する](exceptions.md)ブロックを開始します。
 * `constructor` は[プライマリまたはセカンダリコンストラクタ](classes.md#constructors-and-initializer-blocks)を宣言します。
 * `delegate` は[アノテーション使用サイトターゲット](annotations.md#annotation-use-site-targets)として使用されます。
 * `dynamic` はKotlin/JSコードで[動的型](dynamic-type.md)を参照します。
 * `field` は[アノテーション使用サイトターゲット](annotations.md#annotation-use-site-targets)として使用されます。
 * `file` は[アノテーション使用サイトターゲット](annotations.md#annotation-use-site-targets)として使用されます。
 * `finally` は[tryブロックが終了するときに常に実行される](exceptions.md)ブロックを開始します。
 * `get`
     - [プロパティのゲッター](properties.md)を宣言します。
     - [アノテーション使用サイトターゲット](annotations.md#annotation-use-site-targets)として使用されます。
 * `import` は[別のパッケージの宣言を現在のファイルにインポートします](packages.md)。
 * `init` は[初期化ブロック](classes.md#constructors-and-initializer-blocks)を開始します。
 * `param` は[アノテーション使用サイトターゲット](annotations.md#annotation-use-site-targets)として使用されます。
 * `property` は[アノテーション使用サイトターゲット](annotations.md#annotation-use-site-targets)として使用されます。
 * `receiver` は[アノテーション使用サイトターゲット](annotations.md#annotation-use-site-targets)として使用されます。
 * `set`
     - [プロパティのセッター](properties.md)を宣言します。
     - [アノテーション使用サイトターゲット](annotations.md#annotation-use-site-targets)として使用されます。
* `setparam` は[アノテーション使用サイトターゲット](annotations.md#annotation-use-site-targets)として使用されます。
* `value` は`class`キーワードと組み合わせて、[インラインクラス](inline-classes.md)を宣言します。
* `where` は[ジェネリック型パラメータの制約](generics.md#upper-bounds)を指定します。

## 修飾子キーワード

次のトークンは、宣言の修飾子リストではキーワードとして機能し、他のコンテキストでは識別子として使用できます。

 * `abstract` はクラスまたはメンバーを[抽象](classes.md#abstract-classes)としてマークします。
 * `actual` は[マルチプラットフォームプロジェクト](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-expect-actual.html)におけるプラットフォーム固有の実装を示します。
 * `annotation` は[アノテーションクラス](annotations.md)を宣言します。
 * `companion` は[コンパニオンオブジェクト](object-declarations.md#companion-objects)を宣言します。
 * `const` はプロパティを[コンパイル時定数](properties.md#compile-time-constants)としてマークします。
 * `crossinline` は[インライン関数に渡されたラムダ内での非ローカルリターン](inline-functions.md#returns)を禁止します。
 * `data` はコンパイラに[クラスの標準メンバーを生成](data-classes.md)するよう指示します。
 * `enum` は[列挙型](enum-classes.md)を宣言します。
 * `expect` は宣言を[プラットフォーム固有](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-expect-actual.html)としてマークし、プラットフォームモジュールでの実装を期待します。
 * `external` は宣言をKotlinの外部で実装されているものとしてマークします（[JNI](java-interop.md#using-jni-with-kotlin)または[JavaScript](js-interop.md#external-modifier)を介してアクセス可能）。
 * `final` は[メンバーのオーバーライド](inheritance.md#overriding-methods)を禁止します。
 * `infix` は[中置記法](functions.md#infix-notation)を使用して関数を呼び出すことを許可します。
 * `inline` はコンパイラに[関数とその関数に渡されたラムダを呼び出しサイトでインライン化](inline-functions.md)するよう指示します。
 * `inner` は[ネストされたクラス](nested-classes.md)から外部クラスのインスタンスを参照することを許可します。
 * `internal` は宣言を[現在のモジュール内で可視](visibility-modifiers.md)としてマークします。
 * `lateinit` は[コンストラクタの外部で非null許容プロパティ](properties.md#late-initialized-properties-and-variables)を初期化することを許可します。
 * `noinline` は[インライン関数に渡されたラムダのインライン化](inline-functions.md#noinline)をオフにします。
 * `open` は[クラスのサブクラス化またはメンバーのオーバーライド](classes.md#inheritance)を許可します。
 * `operator` は関数を[演算子のオーバーロードまたは規約の実装](operator-overloading.md)としてマークします。
 * `out` は型パラメータを[共変](generics.md#declaration-site-variance)としてマークします。
 * `override` はメンバーを[スーパークラスメンバーのオーバーライド](inheritance.md#overriding-methods)としてマークします。
 * `private` は宣言を[現在のクラスまたはファイル内で可視](visibility-modifiers.md)としてマークします。
 * `protected` は宣言を[現在のクラスとそのサブクラス内で可視](visibility-modifiers.md)としてマークします。
 * `public` は宣言を[どこでも可視](visibility-modifiers.md)としてマークします。
 * `reified` はインライン関数の型パラメータを[実行時にアクセス可能](inline-functions.md#reified-type-parameters)としてマークします。
 * `sealed` は[sealedクラス](sealed-classes.md)（サブクラス化が制限されたクラス）を宣言します。
 * `suspend` は関数またはラムダをサスペンド可能（[コルーチン](coroutines-overview.md)として使用可能）としてマークします。
 * `tailrec` は関数を[末尾再帰](functions.md#tail-recursive-functions)としてマークします（コンパイラが再帰をイテレーションに置き換えることを許可します）。
 * `vararg` は[パラメータに可変数の引数を渡す](functions.md#variable-number-of-arguments-varargs)ことを許可します。

## 特殊識別子

次の識別子は、特定のコンテキストでコンパイラによって定義され、他のコンテキストでは通常の識別子として使用できます。

 * `field` はプロパティアクセサ内で、[プロパティのバッキングフィールド](properties.md#backing-fields)を参照するために使用されます。
 * `it` はラムダ内で、[そのパラメータを暗黙的に参照する](lambdas.md#it-implicit-name-of-a-single-parameter)ために使用されます。

## 演算子と特殊記号

Kotlinは次の演算子と特殊記号をサポートしています。

 * `+`, `-`, `*`, `/`, `%` - 算術演算子
     - `*` は、[配列を可変長引数パラメータに渡す](functions.md#variable-number-of-arguments-varargs)ためにも使用されます。
 * `=`
     - 代入演算子。
     - [パラメータのデフォルト値](functions.md#parameters-with-default-values)を指定するために使用されます。
 * `+=`, `-=`, `*=`, `/=`, `%=` - [複合代入演算子](operator-overloading.md#augmented-assignments)。
 * `++`, `--` - [インクリメントおよびデクリメント演算子](operator-overloading.md#increments-and-decrements)。
 * `&&`, `||`, `!` - 論理「AND」、「OR」、「NOT」演算子（ビット演算には、対応する[中置関数](numbers.md#operations-on-numbers)を使用してください）。
 * `==`, `!=` - [等価演算子](operator-overloading.md#equality-and-inequality-operators)（非プリミティブ型の場合は`equals()`の呼び出しに変換されます）。
 * `===`, `!==` - [参照等価演算子](equality.md#referential-equality)。
 * `<`, `>`, `<=`, `>=` - [比較演算子](operator-overloading.md#comparison-operators)（非プリミティブ型の場合は`compareTo()`の呼び出しに変換されます）。
 * `[`, `]` - [インデックスアクセス演算子](operator-overloading.md#indexed-access-operator)（`get`および`set`の呼び出しに変換されます）。
 * `!!` は[式が非nullであることをアサートします](null-safety.md#not-null-assertion-operator)。
 * `?.` は[セーフコール](null-safety.md#safe-call-operator)を実行します（レシーバが非nullの場合にメソッドを呼び出すかプロパティにアクセスします）。
 * `?:` は左側の値がnullの場合に右側の値を取ります（[エルビス演算子](null-safety.md#elvis-operator)）。
 * `::` は[メンバー参照](reflection.md#function-references)または[クラス参照](reflection.md#class-references)を作成します。
 * `..`, `..<` は[範囲](ranges.md)を作成します。
 * `:` は宣言内で名前と型を区切ります。
 * `?` は型を[null許容](null-safety.md#nullable-types-and-non-nullable-types)としてマークします。
 * `->`
     - [ラムダ式](lambdas.md#lambda-expression-syntax)のパラメータと本体を区切ります。
     - [関数型](lambdas.md#function-types)のパラメータと戻り値の型宣言を区切ります。
     - [when式](control-flow.md#when-expressions-and-statements)のブランチの条件と本体を区切ります。
 * `@`
     - [アノテーション](annotations.md#usage)を導入します。
     - [ループラベル](returns.md#break-and-continue-labels)を導入または参照します。
     - [ラムダラベル](returns.md#return-to-labels)を導入または参照します。
     - [外部スコープからの「this」式](this-expressions.md#qualified-this)を参照します。
     - [外部スーパークラス](inheritance.md#calling-the-superclass-implementation)を参照します。
 * `;` は同じ行の複数のステートメントを区切ります。
 * `$` は[文字列テンプレート](strings.md#string-templates)内の変数または式を参照します。
 * `_`
     - [ラムダ式](lambdas.md#underscore-for-unused-variables)で使用されないパラメータの代わりに使用されます。
     - [分割宣言](destructuring-declarations.md#underscore-for-unused-variables)で使用されないパラメータの代わりに使用されます。

演算子の優先順位については、Kotlin文法の[このリファレンス](https://kotlinlang.org/docs/reference/grammar.html#expressions)を参照してください。