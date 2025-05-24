---
title: 高階関数とラムダ
---
Kotlinの関数は[ファーストクラス](https://en.wikipedia.org/wiki/First-class_function)です。これは、変数やデータ構造に格納したり、他の[高階関数](#higher-order-functions)への引数として渡したり、高階関数から返したりできることを意味します。関数以外の値で可能な操作は、関数でもすべて実行できます。

これを容易にするために、静的型付けプログラミング言語であるKotlinは、関数を表すために[関数型](#function-types)のファミリーを使用し、[ラムダ式](#lambda-expressions-and-anonymous-functions)などの特殊な言語構造のセットを提供します。

## 高階関数

高階関数とは、関数をパラメータとして受け取るか、関数を返す関数のことです。

高階関数の良い例は、コレクションの[関数型プログラミングイディオム `fold`](https://en.wikipedia.org/wiki/Fold_(higher-order_function))です。これは、初期アキュムレータ値と結合関数を受け取り、現在のアキュムレータ値を各コレクション要素と連続的に結合することで戻り値を構築し、毎回アキュムレータ値を置き換えます。

```kotlin
fun <T, R> Collection<T>.fold(
    initial: R, 
    combine: (acc: R, nextElement: T) `->` R
): R {
    var accumulator: R = initial
    for (element: T in this) {
        accumulator = combine(accumulator, element)
    }
    return accumulator
}
```

上記のコードでは、`combine` パラメータは [関数型](#function-types) `(R, T) `->` R` を持っているため、型 `R` と `T` の2つの引数を取り、型 `R` の値を返す関数を受け入れます。これは `for` ループ内で[呼び出され](#invoking-a-function-type-instance)、戻り値は `accumulator` に代入されます。

`fold` を呼び出すには、引数として [関数型のインスタンス](#instantiating-a-function-type) を渡す必要があります。ラムダ式（[下記で詳しく説明](#lambda-expressions-and-anonymous-functions)）は、高階関数の呼び出しサイトで広く使用されています。

```kotlin
fun main() {

    val items = listOf(1, 2, 3, 4, 5)
    
    // ラムダは、中括弧で囲まれたコードブロックです。
    items.fold(0, { 
        // ラムダがパラメータを持つ場合、パラメータは最初に記述し、その後に '`->`' を記述します。
        acc: Int, i: Int `->` 
        print("acc = $acc, i = $i, ") 
        val result = acc + i
        println("result = $result")
        // ラムダの最後の式が戻り値とみなされます。
        result
    })
    
    // ラムダのパラメータ型は、推論できる場合は省略可能です。
    val joinedToString = items.fold("Elements:", { acc, i `->` acc + " " + i })
    
    // 関数参照も高階関数の呼び出しに使用できます。
    val product = items.fold(1, Int::times)

    println("joinedToString = $joinedToString")
    println("product = $product")
}
```

## 関数型

Kotlinは、関数を扱う宣言に、`(Int) `->` String` のような関数型を使用します。例：`val onClick: () `->` Unit = ...`.

これらの型は、関数のシグネチャ（パラメータと戻り値）に対応する特殊な表記法を持っています。

* すべての関数型は、パラメータ型の括弧で囲まれたリストと戻り値の型を持っています：`(A, B) `->` C` は、型 `A` と `B` の2つの引数を取り、型 `C` の値を返す関数を表す型を示します。パラメータ型のリストは、`() `->` A` のように空にすることができます。[`Unit` 戻り値型](functions#unit-returning-functions)は省略できません。

* 関数型は、オプションで追加の *レシーバ* 型を持つことができます。これは、表記法のドットの前に指定されます：型 `A.(B) `->` C` は、レシーバオブジェクト `A` でパラメータ `B` を使用して呼び出すことができ、値 `C` を返す関数を表します。[レシーバ付き関数リテラル](#function-literals-with-receiver)は、これらの型と組み合わせてよく使用されます。

* [中断関数](coroutines-basics#extract-function-refactoring)は、表記法に *suspend* 修飾子を持つ特殊な種類の関数型に属します。例：`suspend () `->` Unit` または `suspend A.(B) `->` C`.

関数型の表記法には、オプションで関数パラメータの名前を含めることができます：`(x: Int, y: Int) `->` Point`. これらの名前は、パラメータの意味を文書化するために使用できます。

関数型が [nullable](null-safety#nullable-types-and-non-nullable-types) であることを指定するには、次のように括弧を使用します：`((Int, Int) `->` Int)?`.

関数型は、括弧を使用して組み合わせることもできます：`(Int) `->` ((Int) `->` Unit)`.

:::note
矢印表記は右結合です。`(Int) `->` (Int) `->` Unit` は前の例と同等ですが、`((Int) `->` (Int)) `->` Unit` とは同等ではありません。

:::

[型エイリアス](type-aliases)を使用して、関数型に別の名前を付けることもできます。

```kotlin
typealias ClickHandler = (Button, ClickEvent) `->` Unit
```

### 関数型のインスタンス化

関数型のインスタンスを取得する方法はいくつかあります。

* 次のいずれかの形式で、関数リテラル内のコードブロックを使用します。
    * [ラムダ式](#lambda-expressions-and-anonymous-functions)：`{ a, b `->` a + b }`、
    * [匿名関数](#anonymous-functions)：`fun(s: String): Int { return s.toIntOrNull() ?: 0 }`

  [レシーバ付き関数リテラル](#function-literals-with-receiver)は、レシーバ付き関数型の値として使用できます。

* 既存の宣言への呼び出し可能参照を使用します。
    * トップレベル、ローカル、メンバ、または拡張[関数](reflection#function-references)：`::isOdd`、`String::toInt`、
    * トップレベル、メンバ、または拡張[プロパティ](reflection#property-references)：`List<Int>::size`、
    * [コンストラクタ](reflection#constructor-references)：`::Regex`

  これらには、特定のインスタンスのメンバを指す [バインドされた呼び出し可能参照](reflection#bound-function-and-property-references) が含まれます：`foo::toString`.

* インターフェースとして関数型を実装するカスタムクラスのインスタンスを使用します。

```kotlin
class IntTransformer: (Int) `->` Int {
    override operator fun invoke(x: Int): Int = TODO()
}

val intFunction: (Int) `->` Int = IntTransformer()
```

コンパイラは、十分な情報がある場合、変数の関数型を推論できます。

```kotlin
val a = { i: Int `->` i + 1 } // 推論される型は (Int) `->` Int
```

レシーバの有無にかかわらず、関数型の *非リテラル* 値は交換可能です。そのため、レシーバは最初のパラメータの代わりに使用でき、その逆も可能です。たとえば、型 `(A, B) `->` C` の値は、型 `A.(B) `->` C` の値が予期される場所に渡したり、割り当てたりできます。また、その逆も可能です。

```kotlin
fun main() {

    val repeatFun: String.(Int) `->` String = { times `->` this.repeat(times) }
    val twoParameters: (String, Int) `->` String = repeatFun // OK
    
    fun runTransformation(f: (String, Int) `->` String): String {
        return f("hello", 3)
    }
    val result = runTransformation(repeatFun) // OK

    println("result = $result")
}
```

:::note
変数が拡張関数への参照で初期化されている場合でも、レシーバのない関数型がデフォルトで推論されます。
それを変更するには、変数型を明示的に指定します。

:::

### 関数型インスタンスの呼び出し

関数型の値は、[`invoke(...)` 演算子](operator-overloading#invoke-operator)を使用して呼び出すことができます：`f.invoke(x)` または単に `f(x)`.

値がレシーバ型を持っている場合、レシーバオブジェクトは最初の引数として渡す必要があります。レシーバ付き関数型の値を呼び出すもう1つの方法は、値の前にレシーバオブジェクトを付加することです。これは、値が[拡張関数](extensions)であるかのように行います：`1.foo(2)`.

例：

```kotlin
fun main() {

    val stringPlus: (String, String) `->` String = String::plus
    val intPlus: Int.(Int) `->` Int = Int::plus
    
    println(stringPlus.invoke("`<-`", "`->`"))
    println(stringPlus("Hello, ", "world!"))
    
    println(intPlus.invoke(1, 1))
    println(intPlus(1, 2))
    println(2.intPlus(3)) // 拡張のような呼び出し

}
```

### インライン関数

場合によっては、高階関数に、柔軟な制御フローを提供する[インライン関数](inline-functions)を使用すると便利です。

## ラムダ式と匿名関数

ラムダ式と匿名関数は *関数リテラル* です。関数リテラルは、宣言されていませんが、式としてすぐに渡される関数です。次の例を検討してください。

```kotlin
max(strings, { a, b `->` a.length < b.length })
```

関数 `max` は、関数値を2番目の引数として取るため、高階関数です。この2番目の引数は、関数自体である式であり、関数リテラルと呼ばれます。これは、次の名前付き関数と同等です。

```kotlin
fun compare(a: String, b: String): Boolean = a.length < b.length
```

### ラムダ式の構文

ラムダ式の完全な構文形式は次のとおりです。

```kotlin
val sum: (Int, Int) `->` Int = { x: Int, y: Int `->` x + y }
```

* ラムダ式は常に中括弧で囲まれています。
* 完全な構文形式のパラメータ宣言は、中括弧の内側に記述され、オプションで型アノテーションを含めることができます。
* 本体は `->` の後に記述されます。
* ラムダの推論される戻り値の型が `Unit` でない場合、ラムダ本体内の最後の（またはおそらく単一の）式が戻り値として扱われます。

オプションのアノテーションをすべて省略すると、残りは次のようになります。

```kotlin
val sum = { x: Int, y: Int `->` x + y }
```

### トレーリングラムダの受け渡し

Kotlinの慣例では、関数の最後のパラメータが関数の場合、対応する引数として渡されるラムダ式は、括弧の外側に配置できます。

```kotlin
val product = items.fold(1) { acc, e `->` acc * e }
```

このような構文は、*トレーリングラムダ* とも呼ばれます。

ラムダがその呼び出しの唯一の引数である場合、括弧を完全に省略できます。

```kotlin
run { println("...") }
```

### it: 単一パラメータの暗黙的な名前

ラムダ式が1つのパラメータしか持たないことは非常に一般的です。

コンパイラがパラメータなしでシグネチャを解析できる場合、パラメータを宣言する必要はなく、`->` を省略できます。パラメータは、名前 `it` で暗黙的に宣言されます。

```kotlin
ints.filter { it > 0 } // このリテラルは '(it: Int) `->` Boolean' 型です
```

### ラムダ式からの値の返却

[修飾されたreturn](returns#return-to-labels)構文を使用して、ラムダから明示的に値を返すことができます。そうでない場合、最後の式の値は暗黙的に返されます。

したがって、次の2つのスニペットは同等です。

```kotlin
ints.filter {
    val shouldFilter = it > 0
    shouldFilter
}

ints.filter {
    val shouldFilter = it > 0
    return@filter shouldFilter
}
```

この慣例は、[ラムダ式を括弧の外側に渡す](#passing-trailing-lambdas)ことと合わせて、[LINQスタイルのコード](https://learn.microsoft.com/en-us/dotnet/csharp/programming-guide/concepts/linq/)を可能にします。

```kotlin
strings.filter { it.length == 5 }.sortedBy { it }.map { it.uppercase() }
```

### 未使用変数用のアンダースコア

ラムダパラメータが未使用の場合、名前の代わりにアンダースコアを配置できます。

```kotlin
map.forEach { (_, value) `->` println("$value!") }
```

### ラムダの分解

ラムダの分解は、[分解宣言](destructuring-declarations#destructuring-in-lambdas)の一部として説明されています。

### 匿名関数

上記のラムダ式の構文には、関数の戻り値の型を指定する機能が欠けています。ほとんどの場合、戻り値の型は自動的に推論できるため、これは不要です。ただし、明示的に指定する必要がある場合は、代替構文である *匿名関数* を使用できます。

```kotlin
fun(x: Int, y: Int): Int = x + y
```

匿名関数は、名前が省略されていることを除いて、通常の関数宣言と非常によく似ています。本体は、式（上記のように）またはブロックのいずれかになります。

```kotlin
fun(x: Int, y: Int): Int {
    return x + y
}
```

パラメータと戻り値の型は、通常の関数と同じように指定されます。ただし、パラメータ型は、コンテキストから推論できる場合は省略できます。

```kotlin
ints.filter(fun(item) = item > 0)
```

匿名関数の戻り値の型の推論は、通常の関数と同じように機能します。戻り値の型は、式本体を持つ匿名関数では自動的に推論されますが、ブロック本体を持つ匿名関数では明示的に指定する必要があります（または `Unit` であると想定されます）。

:::note
匿名関数をパラメータとして渡す場合は、括弧の中に配置してください。関数を括弧の外側に残すことができる省略形の構文は、ラムダ式でのみ機能します。

:::

ラムダ式と匿名関数のもう1つの違いは、[非ローカルreturn](inline-functions#returns)の動作です。ラベルのない `return` ステートメントは、常に `fun` キーワードで宣言された関数から返されます。これは、ラムダ式内の `return` は外側の関数から返されるのに対し、匿名関数内の `return` は匿名関数自体から返されることを意味します。

### クロージャ

ラムダ式または匿名関数（および [ローカル関数](functions#local-functions) および [オブジェクト式](object-declarations#object-expressions)）は、外側のスコープで宣言された変数を含む *クロージャ* にアクセスできます。クロージャでキャプチャされた変数は、ラムダ内で変更できます。

```kotlin
var sum = 0
ints.filter { it > 0 }.forEach {
    sum += it
}
print(sum)
```

### レシーバ付き関数リテラル

`A.(B) `->` C` などのレシーバ付き[関数型](#function-types)は、特別な形式の関数リテラル（レシーバ付き関数リテラル）でインスタンス化できます。

上記のように、Kotlinは *レシーバオブジェクト* を提供しながら、レシーバ付き関数型の[インスタンスを呼び出す](#invoking-a-function-type-instance)機能を提供します。

関数リテラルの本体内では、呼び出しに渡されるレシーバオブジェクトが *暗黙的な* `this` になるため、追加の修飾子なしでそのレシーバオブジェクトのメンバにアクセスしたり、[`this` 式](this-expressions)を使用してレシーバオブジェクトにアクセスしたりできます。

この動作は、[拡張関数](extensions)の動作と似ています。拡張関数も、関数本体内でレシーバオブジェクトのメンバにアクセスできます。

次に、レシーバ付き関数リテラルとその型の例を示します。ここでは、`plus` がレシーバオブジェクトで呼び出されます。

```kotlin
val sum: Int.(Int) `->` Int = { other `->` plus(other) }
```

匿名関数の構文を使用すると、関数リテラルのレシーバ型を直接指定できます。これは、レシーバ付き関数型の変数を宣言し、後で使用する必要がある場合に役立ちます。

```kotlin
val sum = fun Int.(other: Int): Int = this + other
```

ラムダ式は、レシーバ型がコンテキストから推論できる場合、レシーバ付き関数リテラルとして使用できます。それらの使用法の最も重要な例の1つは、[型安全ビルダー](type-safe-builders)です。

```kotlin
class HTML {
    fun body() { ... }
}

fun html(init: HTML.() `->` Unit): HTML {
    val html = HTML()  // レシーバオブジェクトを作成します
    html.init()        // レシーバオブジェクトをラムダに渡します
    return html
}

html {       // レシーバ付きラムダがここから始まります
    body()   // レシーバオブジェクトでメソッドを呼び出します
}
```