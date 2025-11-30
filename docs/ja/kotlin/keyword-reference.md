[//]: # (title: キーワードと演算子)

## ハードキーワード

以下のトークンは常にキーワードとして解釈され、識別子として使用することはできません。

 * `as`
     - [型キャスト](typecasts.md#unsafe-cast-operator)に使用されます。
     - [importのエイリアス](packages.md#imports)を指定します。
 * `as?` [安全な型キャスト](typecasts.md#unsafe-cast-operator)に使用されます。
 * `break` [ループの実行を終了](returns.md)します。
 * `class` [クラス](classes.md)を宣言します。
 * `continue` [最も近い囲むループの次のステップに進みます](returns.md)。
 * `do` [do/whileループ](control-flow.md#while-loops)（後置条件を持つループ）を開始します。
 * `else` 条件がfalseの場合に実行される[if式](control-flow.md#if-expression)のブランチを定義します。
 * `false` [Boolean型](booleans.md)の'false'値を指定します。
 * `for` [forループ](control-flow.md#for-loops)を開始します。
 * `fun` [関数](functions.md)を宣言します。
 * `if` [if式](control-flow.md#if-expression)を開始します。
 * `in`
     - [forループ](control-flow.md#for-loops)で反復されるオブジェクトを指定します。
     - 値が[レンジ](ranges.md)、コレクション、または[「contains」メソッド](operator-overloading.md#in-operator)を定義する別のエンティティに属するかどうかをチェックする中置演算子として使用されます。
     - 同じ目的で[when式](control-flow.md#when-expressions-and-statements)で使用されます。
     - 型パラメータを[反変](generics.md#declaration-site-variance)としてマークします。
 * `!in`
     - 値が[レンジ](ranges.md)、コレクション、または[「contains」メソッド](operator-overloading.md#in-operator)を定義する別のエンティティに属さないことをチェックする演算子として使用されます。
     - 同じ目的で[when式](control-flow.md#when-expressions-and-statements)で使用されます。
 * `interface` [インターフェース](interfaces.md)を宣言します。
 * `is`
     - [値が特定の型である](typecasts.md#is-and-is-operators)ことをチェックします。
     - 同じ目的で[when式](control-flow.md#when-expressions-and-statements)で使用されます。
 * `!is`
     - [値が特定の型ではない](typecasts.md#is-and-is-operators)ことをチェックします。
     - 同じ目的で[when式](control-flow.md#when-expressions-and-statements)で使用されます。
 * `null` どのオブジェクトも指さないオブジェクト参照を表す定数です。
 * `object` [クラスとそのインスタンスを同時に](object-declarations.md)宣言します。
 * `package` [現在のファイルのパッケージ](packages.md)を指定します。
 * `return` [最も近い囲む関数または匿名関数から戻ります](returns.md)。
 * `super`
     - [メソッドまたはプロパティのスーパークラス実装を参照](inheritance.md#calling-the-superclass-implementation)します。
     - [セカンダリコンストラクタからスーパークラスコンストラクタを呼び出し](classes.md#inheritance)ます。
 * `this`
     - [現在のレシーバ](this-expressions.md)を参照します。
     - [セカンダリコンストラクタから同じクラスの別のコンストラクタを呼び出し](classes.md#constructors-and-initializer-blocks)ます。
 * `throw` [例外をスロー](exceptions.md)します。
 * `true` [Boolean型](booleans.md)の'true'値を指定します。
 * `try` [例外処理ブロックを開始](exceptions.md)します。
 * `typealias` [型エイリアス](type-aliases.md)を宣言します。
 * `typeof` は将来の使用のために予約されています。
 * `val` 読み取り専用の[プロパティ](properties.md)または[ローカル変数](basic-syntax.md#variables)を宣言します。
 * `var` 可変の[プロパティ](properties.md)または[ローカル変数](basic-syntax.md#variables)を宣言します。
 * `when` [when式](control-flow.md#when-expressions-and-statements)（指定されたブランチのいずれかを実行）を開始します。
 * `while` [whileループ](control-flow.md#while-loops)（前置条件を持つループ）を開始します。

## ソフトキーワード

以下のトークンは、適用可能なコンテキストではキーワードとして機能し、他のコンテキストでは識別子として使用できます。

 * `by`
     - [インターフェースの実装を別のオブジェクトに委譲](delegation.md)します。
     - [プロパティのアクセサの実装を別のオブジェクトに委譲](delegated-properties.md)します。
 * `catch` [特定の例外型を処理する](exceptions.md)ブロックを開始します。
 * `constructor` [プライマリまたはセカンダリコンストラクタ](classes.md#constructors-and-initializer-blocks)を宣言します。
 * `delegate` [アノテーション使用サイトターゲット](annotations.md#annotation-use-site-targets)として使用されます。
 * `dynamic` Kotlin/JSコードで[動的型](dynamic-type.md)を参照します。
 * `field` [アノテーション使用サイトターゲット](annotations.md#annotation-use-site-targets)として使用されます。
 * `file` [アノテーション使用サイトターゲット](annotations.md#annotation-use-site-targets)として使用されます。
 * `finally` [tryブロックが終了するときに常に実行される](exceptions.md)ブロックを開始します。
 * `get`
     - [プロパティのゲッター](properties.md)を宣言します。
     - [アノテーション使用サイトターゲット](annotations.md#annotation-use-site-targets)として使用されます。
 * `import` [別のパッケージから現在のファイルに宣言をインポート](packages.md)します。
 * `init` [初期化ブロック](classes.md#constructors-and-initializer-blocks)を開始します。
 * `param` [アノテーション使用サイトターゲット](annotations.md#annotation-use-site-targets)として使用されます。
 * `property` [アノテーション使用サイトターゲット](annotations.md#annotation-use-site-targets)として使用されます。
 * `receiver` [アノテーション使用サイトターゲット](annotations.md#annotation-use-site-targets)として使用されます。
 * `set`
     - [プロパティのセッター](properties.md)を宣言します。
     - [アノテーション使用サイトターゲット](annotations.md#annotation-use-site-targets)として使用されます。
* `setparam` [アノテーション使用サイトターゲット](annotations.md#annotation-use-site-targets)として使用されます。
* `value` `class`キーワードとともに[インラインクラス](inline-classes.md)を宣言します。
* `where` [ジェネリック型パラメータの制約](generics.md#upper-bounds)を指定します。

## 修飾子キーワード

以下のトークンは、宣言の修飾子リストではキーワードとして機能し、他のコンテキストでは識別子として使用できます。

 * `abstract` クラスまたはメンバーを[abstract](classes.md#abstract-classes)としてマークします。
 * `actual` [マルチプラットフォームプロジェクト](https://kotlinlang.org/docs/multiplatform/multiplatform-expect-actual.html)におけるプラットフォーム固有の実装を示します。
 * `annotation` [アノテーションクラス](annotations.md)を宣言します。
 * `companion` [コンパニオンオブジェクト](object-declarations.md#companion-objects)を宣言します。
 * `const` プロパティを[コンパイル時定数](properties.md#compile-time-constants)としてマークします。
 * `crossinline` [インライン関数に渡されたラムダでの非ローカルリターンを禁止](inline-functions.md#returns)します。
 * `data` コンパイラに[クラスの標準メンバーを生成する](data-classes.md)よう指示します。
 * `enum` [列挙型](enum-classes.md)を宣言します。
 * `expect` 宣言を[プラットフォーム固有](https://kotlinlang.org/docs/multiplatform/multiplatform-expect-actual.html)としてマークし、プラットフォームモジュールでの実装を期待します。
 * `external` 宣言をKotlinの外部で実装されているものとしてマークします（[JNI](java-interop.md#using-jni-with-kotlin)または[JavaScript](js-interop.md#external-modifier)を介してアクセス可能）。
 * `final` [メンバーのオーバーライドを禁止](inheritance.md#overriding-methods)します。
 * `infix` [中置記法](functions.md#infix-notation)を使用して関数を呼び出すことを許可します。
 * `inline` コンパイラに[関数とそれに渡されたラムダを呼び出しサイトでインライン化](inline-functions.md)するよう指示します。
 * `inner` [ネストされたクラス](nested-classes.md)から外側のクラスインスタンスを参照することを許可します。
 * `internal` 宣言を[現在のモジュールで可視](visibility-modifiers.md)としてマークします。
 * `lateinit` [コンストラクタの外部で非null許容プロパティを初期化](properties.md#late-initialized-properties-and-variables)することを許可します。
 * `noinline` [インライン関数に渡されたラムダのインライン化をオフ](inline-functions.md#noinline)にします。
 * `open` [クラスのサブクラス化またはメンバーのオーバーライドを許可](classes.md#inheritance)します。
 * `operator` 関数を[演算子のオーバーロードまたは規約の実装](operator-overloading.md)としてマークします。
 * `out` 型パラメータを[共変](generics.md#declaration-site-variance)としてマークします。
 * `override` メンバーを[スーパークラスメンバーのオーバーライド](inheritance.md#overriding-methods)としてマークします。
 * `private` 宣言を[現在のクラスまたはファイルで可視](visibility-modifiers.md)としてマークします。
 * `protected` 宣言を[現在のクラスとそのサブクラスで可視](visibility-modifiers.md)としてマークします。
 * `public` 宣言を[どこからでも可視](visibility-modifiers.md)としてマークします。
 * `reified` インライン関数の型パラメータを[ランタイム時にアクセス可能](inline-functions.md#reified-type-parameters)としてマークします。
 * `sealed` [sealedクラス](sealed-classes.md)（サブクラス化が制限されたクラス）を宣言します。
 * `suspend` 関数またはラムダを中断可能（[コルーチン](coroutines-overview.md)として使用可能）としてマークします。
 * `tailrec` 関数を[末尾再帰](functions.md#tail-recursive-functions)としてマークします（コンパイラが再帰をイテレーションに置き換えることを許可します）。
 * `vararg` [パラメータに可変個の引数を渡す](functions.md#variable-number-of-arguments-varargs)ことを許可します。

## 特別な識別子

以下の識別子は、特定のコンテキストでコンパイラによって定義され、他のコンテキストでは通常の識別子として使用できます。

 * `field` プロパティアクセサ内で、[プロパティのバッキングフィールド](properties.md#backing-fields)を参照するために使用されます。
 * `it` ラムダ内で、[そのパラメータを暗黙的に参照する](lambdas.md#it-implicit-name-of-a-single-parameter)ために使用されます。

## 演算子と特殊記号

Kotlinは以下の演算子と特殊記号をサポートしています。

 * `+`, `-`, `*`, `/`, `%` - 算術演算子
     - `*` は[配列を`vararg`パラメータに渡す](functions.md#variable-number-of-arguments-varargs)ためにも使用されます。
 * `=`
     - 代入演算子。
     - [パラメータのデフォルト値](functions.md#parameters-with-default-values)を指定するために使用されます。
 * `+=`, `-=`, `*=`, `/=`, `%=` - [複合代入演算子](operator-overloading.md#augmented-assignments)。
 * `++`, `--` - [インクリメントおよびデクリメント演算子](operator-overloading.md#increments-and-decrements)。
 * `&&`, `||`, `!` - 論理AND、OR、NOT演算子（ビット演算には、対応する[中置関数](numbers.md#operations-on-numbers)を使用します）。
 * `==`, `!=` - [等価演算子](operator-overloading.md#equality-and-inequality-operators)（非プリミティブ型の場合は`equals()`の呼び出しに変換されます）。
 * `===`, `!==` - [参照等価演算子](equality.md#referential-equality)。
 * `<`, `>`, `<=`, `>=` - [比較演算子](operator-overloading.md#comparison-operators)（非プリミティブ型の場合は`compareTo()`の呼び出しに変換されます）。
 * `[`, `]` - [インデックスアクセス演算子](operator-overloading.md#indexed-access-operator)（`get`と`set`の呼び出しに変換されます）。
 * `!!` [式が非null可能であることをアサート](null-safety.md#not-null-assertion-operator)します。
 * `?.` [安全な呼び出し](null-safety.md#safe-call-operator)を実行します（レシーバーが非null可能である場合にメソッドを呼び出すか、プロパティにアクセスします）。
 * `?:` 左側の値がnullの場合に右側の値を取ります（[エルビス演算子](null-safety.md#elvis-operator)）。
 * `::` [メンバー参照](reflection.md#function-references)または[クラス参照](reflection.md#class-references)を作成します。
 * `..`, `..<` [レンジ](ranges.md)を作成します。
 * `:` 宣言で名前と型を区切ります。
 * `?` 型を[null可能](null-safety.md#nullable-types-and-non-nullable-types)としてマークします。
 * `->`
     - [ラムダ式](lambdas.md#lambda-expression-syntax)のパラメータと本体を区切ります。
     - [関数型](lambdas.md#function-types)のパラメータと戻り値の型宣言を区切ります。
     - [when式](control-flow.md#when-expressions-and-statements)ブランチの条件と本体を区切ります。
 * `@`
     - [アノテーション](annotations.md#usage)を導入します。
     - [ループラベル](returns.md#break-and-continue-labels)を導入または参照します。
     - [ラムダラベル](returns.md#return-to-labels)を導入または参照します。
     - [外側のスコープからの'this'式](this-expressions.md#qualified-this)を参照します。
     - [外側のスーパークラス](inheritance.md#calling-the-superclass-implementation)を参照します。
 * `;` 同じ行の複数のステートメントを区切ります。