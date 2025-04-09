---
title: キーワードと演算子
---
## ハードキーワード

以下のトークンは常にキーワードとして解釈され、識別子として使用できません。

 * ``as``
     - [型キャスト](typecasts#unsafe-cast-operator)に使用されます。
     - [インポートのエイリアス](packages#imports)を指定します。
 * ``as?`` は[安全な型キャスト](typecasts#safe-nullable-cast-operator)に使用されます。
 * ``break`` は[ループの実行を終了](returns)します。
 * ``class`` は[クラス](classes)を宣言します。
 * ``continue`` は[最も内側の囲みループの次のステップに進みます](returns)。
 * ``do`` は[do/while ループ](control-flow#while-loops) (postcondition を持つループ) を開始します。
 * ``else`` は、条件が false の場合に実行される[if 式](control-flow#if-expression)の分岐を定義します。
 * ``false`` は、[Boolean 型](booleans)の 'false' 値を指定します。
 * ``for`` は[for ループ](control-flow#for-loops)を開始します。
 * ``fun`` は[関数](functions)を宣言します。
 * ``if`` は[if 式](control-flow#if-expression)を開始します。
 * ``in``
     - [for ループ](control-flow#for-loops)で反復されるオブジェクトを指定します。
     - 値が[範囲](ranges)、コレクション、または ['contains' メソッドを定義する](operator-overloading#in-operator)別のエンティティに属するかどうかを確認するための infix 演算子として使用されます。
     - [when 式](control-flow#when-expressions-and-statements)で同じ目的で使用されます。
     - 型パラメータを[反変](generics#declaration-site-variance)としてマークします。
 * ``!in``
     - 値が[範囲](ranges)、コレクション、または ['contains' メソッドを定義する](operator-overloading#in-operator)別のエンティティに属さないかどうかを確認するための演算子として使用されます。
     - [when 式](control-flow#when-expressions-and-statements)で同じ目的で使用されます。
 * ``interface`` は[インターフェース](interfaces)を宣言します。
 * ``is``
     - [値が特定の型であるか](typecasts#is-and-is-operators)どうかを確認します。
     - [when 式](control-flow#when-expressions-and-statements)で同じ目的で使用されます。
 * ``!is``
     - [値が特定の型でないか](typecasts#is-and-is-operators)どうかを確認します。
     - [when 式](control-flow#when-expressions-and-statements)で同じ目的で使用されます。
 * ``null`` は、どのオブジェクトも指さないオブジェクト参照を表す定数です。
 * ``object`` は[クラスとそのインスタンスを同時に](object-declarations)宣言します。
 * ``package`` は[現在のファイルのパッケージ](packages)を指定します。
 * ``return`` は[最も内側の囲み関数または匿名関数から戻ります](returns)。
 * ``super``
     - [メソッドまたはプロパティのスーパークラスの実装を参照します](inheritance#calling-the-superclass-implementation)。
     - [セカンダリコンストラクタからスーパークラスコンストラクタを呼び出します](classes#inheritance)。
 * ``this``
     - [現在のレシーバ](this-expressions)を参照します。
     - [セカンダリコンストラクタから同じクラスの別のコンストラクタを呼び出します](classes#constructors)。
 * ``throw`` は[例外をスロー](exceptions)します。
 * ``true`` は、[Boolean 型](booleans)の 'true' 値を指定します。
 * ``try`` は[例外処理ブロックを開始](exceptions)します。
 * ``typealias`` は[型エイリアス](type-aliases)を宣言します。
 * ``typeof`` は将来の使用のために予約されています。
 * ``val`` は読み取り専用の[プロパティ](properties)または[ローカル変数](basic-syntax#variables)を宣言します。
 * ``var`` は可変の[プロパティ](properties)または[ローカル変数](basic-syntax#variables)を宣言します。
 * ``when`` は[when 式](control-flow#when-expressions-and-statements)を開始します (指定された分岐のいずれかを実行します)。
 * ``while`` は[while ループ](control-flow#while-loops) (precondition を持つループ) を開始します。

## ソフトキーワード

以下のトークンは、適用可能なコンテキストではキーワードとして機能し、他のコンテキストでは識別子として使用できます。

 * ``by``
     - [インターフェースの実装を別のオブジェクトに委譲します](delegation)。
     - [プロパティのアクセッサの実装を別のオブジェクトに委譲します](delegated-properties)。
 * ``catch`` は、[特定の例外型を処理する](exceptions)ブロックを開始します。
 * ``constructor`` は[プライマリまたはセカンダリコンストラクタ](classes#constructors)を宣言します。
 * ``delegate`` は、[アノテーションの使用箇所のターゲット](annotations#annotation-use-site-targets)として使用されます。
 * ``dynamic`` は、Kotlin/JS コードで[動的型](dynamic-type)を参照します。
 * ``field`` は、[アノテーションの使用箇所のターゲット](annotations#annotation-use-site-targets)として使用されます。
 * ``file`` は、[アノテーションの使用箇所のターゲット](annotations#annotation-use-site-targets)として使用されます。
 * ``finally`` は、[try ブロックが終了するときに常に実行される](exceptions)ブロックを開始します。
 * ``get``
     - [プロパティのゲッター](properties#getters-and-setters)を宣言します。
     - [アノテーションの使用箇所のターゲット](annotations#annotation-use-site-targets)として使用されます。
 * ``import`` は[別のパッケージから現在のファイルに宣言をインポートします](packages)。
 * ``init`` は[初期化子ブロック](classes#constructors)を開始します。
 * ``param`` は、[アノテーションの使用箇所のターゲット](annotations#annotation-use-site-targets)として使用されます。
 * ``property`` は、[アノテーションの使用箇所のターゲット](annotations#annotation-use-site-targets)として使用されます。
 * ``receiver`` は、[アノテーションの使用箇所のターゲット](annotations#annotation-use-site-targets)として使用されます。
 * ``set``
     - [プロパティのセッター](properties#getters-and-setters)を宣言します。
     - [アノテーションの使用箇所のターゲット](annotations#annotation-use-site-targets)として使用されます。
* ``setparam`` は、[アノテーションの使用箇所のターゲット](annotations#annotation-use-site-targets)として使用されます。
* ``value`` は、`class` キーワードとともに使用すると、[インラインクラス](inline-classes)を宣言します。
* ``where`` は、[ジェネリック型パラメータの制約](generics#upper-bounds)を指定します。

## 修飾子キーワード

以下のトークンは、宣言の修飾子リストではキーワードとして機能し、他のコンテキストでは識別子として使用できます。

 * ``abstract`` は、クラスまたはメンバーを[抽象](classes#abstract-classes)としてマークします。
 * ``actual`` は、[マルチプラットフォームプロジェクト](multiplatform-expect-actual)のプラットフォーム固有の実装を示します。
 * ``annotation`` は[アノテーションクラス](annotations)を宣言します。
 * ``companion`` は[コンパニオンオブジェクト](object-declarations#companion-objects)を宣言します。
 * ``const`` は、プロパティを[コンパイル時定数](properties#compile-time-constants)としてマークします。
 * ``crossinline`` は、[インライン関数に渡されるラムダでの非ローカルリターン](inline-functions#returns)を禁止します。
 * ``data`` は、コンパイラに[クラスの標準メンバーを生成](data-classes)するように指示します。
 * ``enum`` は[列挙](enum-classes)を宣言します。
 * ``expect`` は、宣言を[プラットフォーム固有](multiplatform-expect-actual)としてマークし、プラットフォームモジュールでの実装を期待します。
 * ``external`` は、宣言を Kotlin の外部で実装されたものとしてマークします ([JNI](java-interop#using-jni-with-kotlin) または [JavaScript](js-interop#external-modifier) を介してアクセス可能)。
 * ``final`` は[メンバーのオーバーライド](inheritance#overriding-methods)を禁止します。
 * ``infix`` は、[infix 記法](functions#infix-notation)を使用して関数を呼び出すことを許可します。
 * ``inline`` は、コンパイラに[関数とそれに渡されるラムダを呼び出しサイトでインライン化](inline-functions)するように指示します。
 * ``inner`` は、[ネストされたクラス](nested-classes)から外部クラスのインスタンスを参照することを許可します。
 * ``internal`` は、宣言を[現在のモジュールで可視](visibility-modifiers)としてマークします。
 * ``lateinit`` は、[非 null プロパティをコンストラクタの外部で初期化](properties#late-initialized-properties-and-variables)することを許可します。
 * ``noinline`` は、[インライン関数に渡されるラムダのインライン化をオフ](inline-functions#noinline)にします。
 * ``open`` は[クラスのサブクラス化またはメンバーのオーバーライド](classes#inheritance)を許可します。
 * ``operator`` は、関数を[演算子のオーバーロードまたは規約の実装](operator-overloading)としてマークします。
 * ``out`` は、型パラメータを[共変](generics#declaration-site-variance)としてマークします。
 * ``override`` は、メンバーを[スーパークラスメンバーのオーバーライド](inheritance#overriding-methods)としてマークします。
 * ``private`` は、宣言を[現在のクラスまたはファイルで可視](visibility-modifiers)としてマークします。
 * ``protected`` は、宣言を[現在のクラスとそのサブクラスで可視](visibility-modifiers)としてマークします。
 * ``public`` は、宣言を[どこでも可視](visibility-modifiers)としてマークします。
 * ``reified`` は、インライン関数の型パラメータを[実行時にアクセス可能](inline-functions#reified-type-parameters)としてマークします。
 * ``sealed`` は[sealed class](sealed-classes) (サブクラス化が制限されたクラス) を宣言します。
 * ``suspend`` は、関数またはラムダを中断可能 ( [コルーチン](coroutines-overview)として使用可能) としてマークします。
 * ``tailrec`` は、関数を[末尾再帰](functions#tail-recursive-functions)としてマークします (コンパイラが再帰を反復に置き換えることを許可します)。
 * ``vararg`` は、[パラメータに可変個の引数を渡す](functions#variable-number-of-arguments-varargs)ことを許可します。

## 特殊な識別子

以下の識別子は、特定のコンテキストでコンパイラによって定義され、他のコンテキストでは通常の識別子として使用できます。

 * ``field`` は、プロパティアクセッサ内で、[プロパティのバッキングフィールド](properties#backing-fields)を参照するために使用されます。
 * ``it`` は、ラムダ内で、[そのパラメータを暗黙的に参照](lambdas#it-implicit-name-of-a-single-parameter)するために使用されます。

## 演算子と特殊記号

Kotlin は、以下の演算子と特殊記号をサポートしています。

 * ``+``, ``-``, ``*``, ``/``, ``%`` - 数学演算子
     - ``*`` は、[配列を vararg パラメータに渡す](functions#variable-number-of-arguments-varargs)ためにも使用されます。
 * ``=``
     - 代入演算子。
     - [パラメータのデフォルト値を指定](functions#default-arguments)するために使用されます。
 * ``+=``, ``-=``, ``*=``, ``/=``, ``%=`` - [拡張代入演算子](operator-overloading#augmented-assignments)。
 * `++`, `--` - [インクリメントおよびデクリメント演算子](operator-overloading#increments-and-decrements)。
 * `&&`, `||`, `!` - 論理 'and'、'or'、'not' 演算子 (ビット単位の演算の場合は、対応する[infix 関数](numbers#operations-on-numbers)を代わりに使用してください)。
 * `==`, `!=` - [等価演算子](operator-overloading#equality-and-inequality-operators) (プリミティブ型でない場合は `equals()` の呼び出しに変換されます)。
 * `===`, `!==` - [参照の等価演算子](equality#referential-equality)。
 * `<`, `>`, `<=`, `>=` - [比較演算子](operator-overloading#comparison-operators) (プリミティブ型でない場合は `compareTo()` の呼び出しに変換されます)。
 * `[`, `]` - [インデックス付きアクセス演算子](operator-overloading#indexed-access-operator) (`get` と `set` の呼び出しに変換されます)。
 * `!!` は[式が null 非許容であることを表明](null-safety#not-null-assertion-operator)します。
 * `?.` は[安全な呼び出し](null-safety#safe-call-operator)を実行します (レシーバが null 非許容の場合にメソッドを呼び出すか、プロパティにアクセスします)。
 * `?:` は、左側の値が null の場合に右側の値を取得します ([elvis 演算子](null-safety#elvis-operator))。
 * `::` は[メンバー参照](reflection#function-references)または[クラス参照](reflection#class-references)を作成します。
 * `..`, `..<` は[範囲](ranges)を作成します。
 * `:` は、宣言内で名前を型から分離します。
 * `?` は、型を[null 許容](null-safety#nullable-types-and-non-nullable-types)としてマークします。
 * `->`
     - [ラムダ式](lambdas#lambda-expression-syntax)のパラメータと本体を分離します。
     - [関数型](lambdas#function-types)のパラメータと戻り値の型宣言を分離します。
     - [when 式](control-flow#when-expressions-and-statements)の条件と本体を分離します。
 * `@`
     - [アノテーション](annotations#usage)を導入します。
     - [ループラベル](returns#break-and-continue-labels)を導入または参照します。
     - [ラムダラベル](returns#return-to-labels)を導入または参照します。
     - ['this' 式を外部スコープから参照](this-expressions#qualified-this)します。
     - [外部スーパークラス](inheritance#calling-the-superclass-implementation)を参照します。
 * `;` は、同じ行に複数のステートメントを分離します。
 * `` ` `` は、[関数名に通常許可されない文字を含む](functions#names-with-special-characters)ために使用されます。
 * `$` は、[文字列テンプレート](strings#string-templates)で変数または式を参照します。
 * `_`
     - [ラムダ式](lambdas#underscore-for-unused-variables)で使用されていないパラメータを代替します。
     - [分割宣言](destructuring-declarations#underscore-for-unused-variables)で使用されていないパラメータを代替します。

演算子の優先順位については、Kotlin 文法の[このリファレンス](https://kotlinlang.org/docs/reference/grammar.html#expressions)を参照してください。