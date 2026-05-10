[//]: # (title: キーワードと演算子)

## ハードキーワード

以下のトークンは常にキーワードとして解釈され、識別子として使用することはできません。

 * `as`
     - [型キャスト](typecasts.md#unsafe-cast-operator)に使用されます。
     - [インポートのエイリアス](packages.md#imports)を指定します。
 * `as?` は[安全な型キャスト](typecasts.md#unsafe-cast-operator)に使用されます。
 * `break` は[ループの実行を終了します](returns.md)。
 * `class` は[クラス](classes.md)を宣言します。
 * `continue` は[最も内側のループの次のステップに進みます](returns.md)。
 * `do` は[do/whileループ](control-flow.md#while-loops)（後置条件を持つループ）を開始します。
 * `else` は、条件が偽の時に実行される[if式](control-flow.md#if-expression)の分岐を定義します。
 * `false` は[Boolean型](booleans.md)の「false」値を指定します。
 * `for` は[forループ](control-flow.md#for-loops)を開始します。
 * `fun` は[関数](functions.md)を宣言します。
 * `if` は[if式](control-flow.md#if-expression)を開始します。
 * `in`
     - [forループ](control-flow.md#for-loops)で反復処理されるオブジェクトを指定します。
     - 値が[範囲](ranges.md)やコレクション、または['contains'メソッドを定義している](operator-overloading.md#in-operator)その他のエンティティに属しているかを確認するための中置演算子として使用されます。
     - [when式](control-flow.md#when-expressions-and-statements)でも同じ目的で使用されます。
     - 型パラメータを[反変(contravariant)](generics.md#declaration-site-variance)としてマークします。
 * `!in`
     - 値が[範囲](ranges.md)やコレクション、または['contains'メソッドを定義している](operator-overloading.md#in-operator)その他のエンティティに属して「いない」ことを確認するための演算子として使用されます。
     - [when式](control-flow.md#when-expressions-and-statements)でも同じ目的で使用されます。
 * `interface` は[インターフェース](interfaces.md)を宣言します。
 * `is`
     - [値が特定の型であるか](typecasts.md#is-and-is-operators)をチェックします。
     - [when式](control-flow.md#when-expressions-and-statements)でも同じ目的で使用されます。
 * `!is`
     - [値が特定の型ではないこと](typecasts.md#is-and-is-operators)をチェックします。
     - [when式](control-flow.md#when-expressions-and-statements)でも同じ目的で使用されます。
 * `null` は、どのオブジェクトも指していないオブジェクト参照を表す定数です。
 * `object` は[クラスとそのインスタンスを同時に宣言](object-declarations.md)します。
 * `package` は[現在のファイルのパッケージ](packages.md)を指定します。
 * `return` は、[最も内側の関数または匿名関数から復帰](returns.md)します。
 * `super`
     - [メソッドやプロパティのスーパークラスの実装を参照](inheritance.md#calling-the-superclass-implementation)します。
     - [セカンダリコンストラクタからスーパークラスのコンストラクタを呼び出し](classes.md#inheritance)ます。
 * `this`
     - [現在のレシーバー](this-expressions.md)を参照します。
     - [セカンダリコンストラクタから同じクラスの別のコンストラクタを呼び出し](classes.md#constructors-and-initializer-blocks)ます。
 * `throw` は[例外をスロー](exceptions.md)します。
 * `true` は[Boolean型](booleans.md)の「true」値を指定します。
 * `try` は[例外処理ブロックを開始](exceptions.md)します。
 * `typealias` は[型エイリアス](type-aliases.md)を宣言します。
 * `typeof` は将来の使用のために予約されています。
 * `val` は読み取り専用の[プロパティ](properties.md)または[ローカル変数](basic-syntax.md#variables)を宣言します。
 * `var` は可変の[プロパティ](properties.md)または[ローカル変数](basic-syntax.md#variables)を宣言します。
 * `when` は[when式](control-flow.md#when-expressions-and-statements)を開始します（与えられた分岐のいずれかを実行します）。
 * `while` は[whileループ](control-flow.md#while-loops)（前置条件を持つループ）を開始します。

## ソフトキーワード

以下のトークンは、適用可能なコンテキストではキーワードとして機能しますが、他のコンテキストでは識別子として使用できます。

 * `by`
     - [インターフェースの実装を別のオブジェクトに委譲](delegation.md)します。
     - [プロパティのアクセサの実装を別のオブジェクトに委譲](delegated-properties.md)します。
 * `catch` は[特定の例外型を処理する](exceptions.md)ブロックを開始します。
 * `constructor` は[プライマリまたはセカンダリコンストラクタ](classes.md#constructors-and-initializer-blocks)を宣言します。
 * `delegate` は[アノテーションの使用箇所ターゲット](annotations.md#annotation-use-site-targets)として使用されます。
 * `dynamic` はKotlin/JSコードにおいて[動的型(dynamic type)](dynamic-type.md)を参照します。
 * `field` は[アノテーションの使用箇所ターゲット](annotations.md#annotation-use-site-targets)として使用されます。
 * `file` は[アノテーションの使用箇所ターゲット](annotations.md#annotation-use-site-targets)として使用されます。
 * `finally` は、[tryブロックを抜ける際に必ず実行される](exceptions.md)ブロックを開始します。
 * `get`
     - [プロパティのゲッター](properties.md)を宣言します。
     - [アノテーションの使用箇所ターゲット](annotations.md#annotation-use-site-targets)として使用されます。
 * `import` は、[別のパッケージからの宣言を現在のファイルにインポート](packages.md)します。
 * `init` は[初期化ブロック](classes.md#constructors-and-initializer-blocks)を開始します。
 * `param` は[アノテーションの使用箇所ターゲット](annotations.md#annotation-use-site-targets)として使用されます。
 * `property` は[アノテーションの使用箇所ターゲット](annotations.md#annotation-use-site-targets)として使用されます。
 * `receiver` は[アノテーションの使用箇所ターゲット](annotations.md#annotation-use-site-targets)として使用されます。
 * `set`
     - [プロパティのセッター](properties.md)を宣言します。
     - [アノテーションの使用箇所ターゲット](annotations.md#annotation-use-site-targets)として使用されます。
 * `setparam` は[アノテーションの使用箇所ターゲット](annotations.md#annotation-use-site-targets)として使用されます。
 * `value` は `class` キーワードとともに[インラインクラス](inline-classes.md)を宣言します。
 * `where` は[ジェネリック型パラメータの制約](generics.md#upper-bounds)を指定します。

## 修飾子キーワード

以下のトークンは、宣言の修飾子リストではキーワードとして機能しますが、他のコンテキストでは識別子として使用できます。

 * `abstract` は、クラスまたはメンバを[抽象(abstract)](classes.md#abstract-classes)としてマークします。
 * `actual` は、[マルチプラットフォームプロジェクト](https://kotlinlang.org/docs/multiplatform/multiplatform-expect-actual.html)におけるプラットフォーム固有の実装であることを示します。
 * `annotation` は[アノテーションクラス](annotations.md)を宣言します。
 * `companion` は[コンパニオンオブジェクト](object-declarations.md#companion-objects)を宣言します。
 * `const` は、プロパティを[コンパイル時定数](properties.md#compile-time-constants)としてマークします。
 * `crossinline` は、[インライン関数に渡されたラムダ内での非ローカルリターン](inline-functions.md#returns)を禁止します。
 * `data` は、クラスに対して[標準的なメンバを生成](data-classes.md)するようコンパイラに指示します。
 * `enum` は[列挙型(enumeration)](enum-classes.md)を宣言します。
 * `expect` は宣言を[プラットフォーム固有](https://kotlinlang.org/docs/multiplatform/multiplatform-expect-actual.html)としてマークし、プラットフォームモジュールでの実装を期待します。
 * `external` は、Kotlin以外で実装されている宣言（[JNI](java-interop.md#using-jni-with-kotlin)経由または[JavaScript](js-interop.md#external-modifier)）としてマークします。
 * `final` は[メンバのオーバーライド](inheritance.md#overriding-methods)を禁止します。
 * `infix` は、関数を[中置記法(infix notation)](functions.md#infix-notation)で呼び出せるようにします。
 * `inline` は、[関数とそこに渡されたラムダを呼び出し箇所にインライン化](inline-functions.md)するようコンパイラに指示します。
 * `inner` は、[入れ子になったクラス(nested class)](nested-classes.md)から外部クラスのインスタンスを参照できるようにします。
 * `internal` は、宣言を[現在のモジュール内でのみ可視](visibility-modifiers.md)としてマークします。
 * `lateinit` は、[非ヌルプロパティをコンストラクタの外で初期化](properties.md#late-initialized-properties-and-variables)できるようにします。
 * `noinline` は、[インライン関数に渡されたラムダのインライン化](inline-functions.md#noinline)をオフにします。
 * `open` は、[クラスの継承またはメンバのオーバーライド](classes.md#inheritance)を可能にします。
 * `operator` は、関数が[演算子をオーバーロード、またはコンベンションを実装](operator-overloading.md)していることを示します。
 * `out` は型パラメータを[共変(covariant)](generics.md#declaration-site-variance)としてマークします。
 * `override` は、メンバが[スーパークラスのメンバをオーバーライド](inheritance.md#overriding-methods)していることを示します。
 * `private` は、宣言を[現在のクラスまたはファイル内でのみ可視](visibility-modifiers.md)としてマークします。
 * `protected` は、宣言を[現在のクラスとそのサブクラス内でのみ可視](visibility-modifiers.md)としてマークします。
 * `public` は、宣言を[どこからでも可視](visibility-modifiers.md)としてマークします。
 * `reified` は、インライン関数の型パラメータに[実行時にアクセス可能](inline-functions.md#reified-type-parameters)であるとしてマークします。
 * `sealed` は[封印されたクラス(sealed class)](sealed-classes.md)（継承が制限されたクラス）を宣言します。
 * `suspend` は関数またはラムダを中断可能（[コルーチン](coroutines-overview.md)として使用可能）としてマークします。
 * `tailrec` は関数を[末尾再帰(tail-recursive)](functions.md#tail-recursive-functions)としてマークします（コンパイラが再帰をループに置き換えることを可能にします）。
 * `vararg` は、[パラメータに対して可変個の引数を渡すこと](functions.md#variable-number-of-arguments-varargs)を可能にします。

## 特別な識別子

以下の識別子は、特定のコンテキストでコンパイラによって定義されるもので、他のコンテキストでは通常の識別子として使用できます。

 * `field` は、プロパティアクセサの内部でプロパティの[バッキングフィールド(backing field)](properties.md#backing-fields)を参照するために使用されます。
 * `it` は、ラムダの内部で[そのパラメータを暗黙的に参照](lambdas.md#it-implicit-name-of-a-single-parameter)するために使用されます。

## 演算子と特殊記号

Kotlinは以下の演算子と特殊記号をサポートしています。

 * `+`, `-`, `*`, `/`, `%` - 数学演算子
     - `*` は、[可変長引数(vararg)パラメータに配列を渡す](functions.md#variable-number-of-arguments-varargs)際にも使用されます。
 * `=`
     - 代入演算子。
     - [パラメータのデフォルト値](functions.md#parameters-with-default-values)を指定するためにも使用されます。
 * `+=`, `-=`, `*=`, `/=`, `%=` - [累算代入演算子](operator-overloading.md#augmented-assignments)。
 * `++`, `--` - [増分および減分演算子](operator-overloading.md#increments-and-decrements)。
 * `&&`, `||`, `!` - 論理「AND」、「OR」、「NOT」演算子（ビット演算には、対応する[中置関数](numbers.md#bitwise-operations)を代わりに使用してください）。
 * `==`, `!=` - [等価演算子](operator-overloading.md#equality-and-inequality-operators)（非プリミティブ型では `equals()` の呼び出しに変換されます）。
 * `===`, `!==` - [参照等価演算子](equality.md#referential-equality)。
 * `<`, `>`, `<=`, `>=` - [比較演算子](operator-overloading.md#comparison-operators)（非プリミティブ型では `compareTo()` の呼び出しに変換されます）。
 * `[`, `]` - [インデックスアクセス演算子](operator-overloading.md#indexed-access-operator)（`get` および `set` の呼び出しに変換されます）。
 * `!!` は[式が非ヌル(non-nullable)であることをアサート](null-safety.md#not-null-assertion-operator)します。
 * `?.` は[安全呼び出し(safe call)](null-safety.md#safe-call-operator)を実行します（レシーバーが非ヌルの場合にのみメソッドを呼び出すかプロパティにアクセスします）。
 * `?:` は、左側の値がnullの場合に右側の値をとります（[エルビス演算子](null-safety.md#elvis-operator)）。
 * `::` は[メンバ参照](reflection.md#function-references)または[クラス参照](reflection.md#class-references)を作成します。
 * `..`, `..<` は[範囲(range)](ranges.md)を作成します。
 * `:` は宣言において名前と型を分離します。
 * `?` は型を[Null許容(nullable)](null-safety.md#nullable-types-and-non-nullable-types)としてマークします。
 * `->`
     - [ラムダ式](lambdas.md#lambda-expression-syntax)のパラメータと本体を分離します。
     - [関数型](lambdas.md#function-types)のパラメータと戻り型宣言を分離します。
     - [when式](control-flow.md#when-expressions-and-statements)の分岐の条件と本体を分離します。
 * `@`
     - [アノテーション](annotations.md#usage)を導入します。
     - [ループラベル](returns.md#break-and-continue-labels)を導入または参照します。
     - [ラムダラベル](returns.md#return-to-labels)を導入または参照します。
     - [外部スコープからの 'this' 式](this-expressions.md#qualified-this)を参照します。
     - [外部のスーパークラス](inheritance.md#calling-the-superclass-implementation)を参照します。
 * `;` は同じ行にある複数の文を分離します。
 * `$` は[文字列テンプレート](strings.md#string-templates)内で変数または式を参照します。
 * `_`
     - [ラムダ式](lambdas.md#underscore-for-unused-variables)において使用しないパラメータの代わりに使用します。
     - [分解宣言](destructuring-declarations.md#underscore-for-unused-variables)において使用しないパラメータの代わりに使用します。

演算子の優先順位については、Kotlin文法の[こちらのレファレンス](https://kotlinlang.org/grammar/#expressions)を参照してください。