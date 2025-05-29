[//]: # (title: 高階関数とラムダ)

Kotlinの関数は[ファーストクラス](https://en.wikipedia.org/wiki/First-class_function)です。これは、関数を変数やデータ構造に格納したり、他の[高階関数](#higher-order-functions)への引数として渡したり、高階関数から返したりできることを意味します。他の非関数値に対して可能なあらゆる操作を関数に対して実行できます。

これを容易にするため、Kotlinは静的型付けプログラミング言語として、関数を表現するための[関数型](#function-types)のファミリーを使用し、[ラムダ式](#lambda-expressions-and-anonymous-functions)のような特殊な言語構造のセットを提供しています。

## 高階関数

高階関数とは、関数をパラメータとして取る関数、または関数を返す関数のことです。

高階関数の良い例は、コレクションに対する[関数型プログラミングイディオムである`fold`](https://en.wikipedia.org/wiki/Fold_(higher-order_function))です。これは、初期アキュムレータ値と結合関数を取り、現在の[アキュムレータ](#accumulator)値と各コレクション要素を連続的に結合し、毎回アキュムレータ値を置き換えることによって戻り値を構築します。

```kotlin
fun <T, R> Collection<T>.fold(
    initial: R, 
    combine: (acc: R, nextElement: T) -> R
): R {
    var accumulator: R = initial
    for (element: T in this) {
        accumulator = combine(accumulator, element)
    }
    return accumulator
}
```

上記のコードでは、`combine`パラメータは[関数型](#function-types) `(R, T) -> R` を持っており、`R`と`T`型の2つの引数を取り、`R`型の値を返す関数を受け入れます。
これは`for`ループ内で[呼び出され](#invoking-a-function-type-instance)、その戻り値は`accumulator`に割り当てられます。

`fold`を呼び出すには、[関数型のインスタンス](#instantiating-a-function-type)を引数として渡す必要があります。この目的には、ラムダ式（[詳細は後述](#lambda-expressions-and-anonymous-functions)）が高階関数の呼び出しサイトで広く使用されます。

```kotlin
fun main() {
    //sampleStart
    val items = listOf(1, 2, 3, 4, 5)
    
    // Lambdas are code blocks enclosed in curly braces.
    items.fold(0, { 
        // When a lambda has parameters, they go first, followed by '->'
        acc: Int, i: Int -> 
        print("acc = $acc, i = $i, ") 
        val result = acc + i
        println("result = $result")
        // The last expression in a lambda is considered the return value:
        result
    })
    
    // Parameter types in a lambda are optional if they can be inferred:
    val joinedToString = items.fold("Elements:", { acc, i -> acc + " " + i })
    
    // Function references can also be used for higher-order function calls:
    val product = items.fold(1, Int::times)
    //sampleEnd
    println("joinedToString = $joinedToString")
    println("product = $product")
}
```
{kotlin-runnable="true"}

## 関数型

Kotlinでは、関数を扱う宣言に`(Int) -> String`のような関数型を使用します。例: `val onClick: () -> Unit = ...`。

これらの型は、関数のシグネチャ（パラメータと戻り値）に対応する特別な表記法を持っています。

*   すべての関数型は、括弧で囲まれたパラメータ型のリストと戻り型を持っています。`(A, B) -> C`は、`A`型と`B`型の2つの引数を取り、`C`型の値を返す関数を表す型を示します。パラメータ型のリストは`() -> A`のように空にすることができます。[Unitの戻り型](functions.md#unit-returning-functions)は省略できません。

*   関数型はオプションで、表記法のドットの前に指定される追加の*レシーバ型*を持つことができます。`A.(B) -> C`型は、レシーバオブジェクト`A`に対してパラメータ`B`で呼び出すことができ、値`C`を返す関数を表します。
    これらの型と合わせて、[レシーバを持つ関数リテラル](#function-literals-with-receiver)がよく使用されます。

*   [中断関数](coroutines-basics.md#extract-function-refactoring)は、`suspend () -> Unit`や`suspend A.(B) -> C`のように、表記法に`suspend`修飾子を持つ特殊な種類の関数型に属します。

関数型の表記法には、オプションで関数パラメータの名前を含めることができます。`(x: Int, y: Int) -> Point`。
これらの名前は、パラメータの意味を文書化するために使用できます。

関数型が[null許容型](null-safety.md#nullable-types-and-non-nullable-types)であることを指定するには、次のように括弧を使用します。`((Int, Int) -> Int)?`。

関数型は括弧を使用して組み合わせることもできます。`(Int) -> ((Int) -> Unit)`。

> 矢印表記は右結合です。`(Int) -> (Int) -> Unit`は前の例と同等ですが、`((Int) -> (Int)) -> Unit`とは異なります。
>
{style="note"}

[型エイリアス](type-aliases.md)を使用して、関数型に別の名前を付けることもできます。

```kotlin
typealias ClickHandler = (Button, ClickEvent) -> Unit
```

### 関数型のインスタンス化

関数型のインスタンスを取得するにはいくつかの方法があります。

*   関数リテラル内のコードブロックを使用します。以下のいずれかの形式です。
    *   [ラムダ式](#lambda-expressions-and-anonymous-functions): `{ a, b -> a + b }`
    *   [匿名関数](#anonymous-functions): `fun(s: String): Int { return s.toIntOrNull() ?: 0 }`

    [レシーバを持つ関数リテラル](#function-literals-with-receiver)は、レシーバを持つ関数型の値として使用できます。

*   既存の宣言へのコーラブル参照を使用します。
    *   トップレベル、ローカル、メンバー、または拡張[関数](reflection.md#function-references): `::isOdd`, `String::toInt`
    *   トップレベル、メンバー、または拡張[プロパティ](reflection.md#property-references): `List<Int>::size`
    *   [コンストラクタ](reflection.md#constructor-references): `::Regex`

    これらには、特定のインスタンスのメンバーを指す[バウンドコーラブル参照](reflection.md#bound-function-and-property-references)が含まれます: `foo::toString`。

*   インターフェースとして関数型を実装するカスタムクラスのインスタンスを使用します。

```kotlin
class IntTransformer: (Int) -> Int {
    override operator fun invoke(x: Int): Int = TODO()
}

val intFunction: (Int) -> Int = IntTransformer()
```

コンパイラは、十分な情報があれば変数の関数型を推論できます。

```kotlin
val a = { i: Int -> i + 1 } // The inferred type is (Int) -> Int
```

レシーバを持つ関数型とレシーバを持たない関数型の*非リテラル*値は交換可能であるため、レシーバを最初のパラメータの代わりに使用したり、その逆も可能です。例えば、`(A, B) -> C`型の値は、`A.(B) -> C`型の値が期待される場所で渡したり割り当てたりできますし、その逆も可能です。

```kotlin
fun main() {
    //sampleStart
    val repeatFun: String.(Int) -> String = { times -> this.repeat(times) }
    val twoParameters: (String, Int) -> String = repeatFun // OK
    
    fun runTransformation(f: (String, Int) -> String): String {
        return f("hello", 3)
    }
    val result = runTransformation(repeatFun) // OK
    //sampleEnd
    println("result = $result")
}
```
{kotlin-runnable="true"}

> 拡張関数への参照で変数が初期化された場合でも、関数型にレシーバがないとデフォルトで推論されます。
> これを変更するには、変数型を明示的に指定します。
>
{style="note"}

### 関数型インスタンスの呼び出し

関数型の値は、[`invoke(...)`オペレータ](operator-overloading.md#invoke-operator)を使用して呼び出すことができます。`f.invoke(x)`または単に`f(x)`。

値にレシーバ型がある場合、レシーバオブジェクトは最初の引数として渡されるべきです。
レシーバを持つ関数型の値を呼び出すもう一つの方法は、値が[拡張関数](extensions.md)であるかのように、レシーバオブジェクトを前置することです。`1.foo(2)`。

例:

```kotlin
fun main() {
    //sampleStart
    val stringPlus: (String, String) -> String = String::plus
    val intPlus: Int.(Int) -> Int = Int::plus
    
    println(stringPlus.invoke("<-", "->"))
    println(stringPlus("Hello, ", "world!"))
    
    println(intPlus.invoke(1, 1))
    println(intPlus(1, 2))
    println(2.intPlus(3)) // extension-like call
    //sampleEnd
}
```
{kotlin-runnable="true"}

### インライン関数

高階関数に対して、柔軟な制御フローを提供する[インライン関数](inline-functions.md)を使用すると、有益な場合があります。

## ラムダ式と匿名関数

ラムダ式と匿名関数は*関数リテラル*です。関数リテラルとは、宣言されずに式として即座に渡される関数のことです。以下の例を考えてみましょう。

```kotlin
max(strings, { a, b -> a.length < b.length })
```

`max`関数は高階関数であり、2番目の引数として関数値を取ります。この2番目の引数はそれ自体が関数であり、関数リテラルと呼ばれ、以下の名前付き関数と同等です。

```kotlin
fun compare(a: String, b: String): Boolean = a.length < b.length
```

### ラムダ式の構文

ラムダ式の完全な構文形式は次のとおりです。

```kotlin
val sum: (Int, Int) -> Int = { x: Int, y: Int -> x + y }
```

*   ラムダ式は常に波括弧で囲まれます。
*   完全な構文形式のパラメータ宣言は波括弧内にあり、オプションで型アノテーションを持ちます。
*   本体は`->`の後に続きます。
*   ラムダの推論された戻り型が`Unit`でない場合、ラムダ本体内の最後の（または唯一の）式が戻り値として扱われます。

すべてのオプションのアノテーションを省略すると、残りは次のようになります。

```kotlin
val sum = { x: Int, y: Int -> x + y }
```

### 末尾ラムダの渡し方

Kotlinの規約により、関数の最後のパラメータが関数の場合、対応する引数として渡されるラムダ式は括弧の外に配置できます。

```kotlin
val product = items.fold(1) { acc, e -> acc * e }
```

このような構文は*末尾ラムダ*とも呼ばれます。

ラムダがその呼び出しで唯一の引数である場合、括弧を完全に省略できます。

```kotlin
run { println("...") }
```

### `it`: 単一パラメータの暗黙的な名前

ラムダ式が1つのパラメータしか持たないことは非常によくあります。

コンパイラがパラメータなしでシグネチャを解析できる場合、パラメータを宣言する必要はなく、`->`を省略できます。パラメータは`it`という名前で暗黙的に宣言されます。

```kotlin
ints.filter { it > 0 } // this literal is of type '(it: Int) -> Boolean'
```

### ラムダ式からの値の返却

[ラベル付きreturn](returns.md#return-to-labels)構文を使用して、ラムダから明示的に値を返すことができます。
そうでない場合、最後の式の値が暗黙的に返されます。

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

この規約は、[括弧の外にラムダ式を渡す](#passing-trailing-lambdas)ことと相まって、[LINQスタイル](https://learn.microsoft.com/en-us/dotnet/csharp/programming-guide/concepts/linq/)のコードを可能にします。

```kotlin
strings.filter { it.length == 5 }.sortedBy { it }.map { it.uppercase() }
```

### 未使用の変数に対するアンダースコア

ラムダのパラメータが未使用の場合、名前の代わりにアンダースコアを配置できます。

```kotlin
map.forEach { (_, value) -> println("$value!") }
```

### ラムダにおける分解

ラムダにおける分解は、[分解宣言](destructuring-declarations.md#destructuring-in-lambdas)の一部として説明されています。

### 匿名関数

上記のラムダ式の構文には、関数の戻り型を指定する機能が欠けています。ほとんどの場合、戻り型は自動的に推論されるため、これは不要です。しかし、明示的に指定する必要がある場合は、別の構文、つまり*匿名関数*を使用できます。

```kotlin
fun(x: Int, y: Int): Int = x + y
```

匿名関数は通常の関数宣言と非常によく似ていますが、名前が省略されています。その本体は、式（上記参照）またはブロックのいずれかになります。

```kotlin
fun(x: Int, y: Int): Int {
    return x + y
}
```

パラメータと戻り型は、通常の関数と同じ方法で指定されますが、パラメータの型はコンテキストから推論できる場合は省略できます。

```kotlin
ints.filter(fun(item) = item > 0)
```

匿名関数の戻り型推論は、通常の関数と同じように機能します。式本体を持つ匿名関数の戻り型は自動的に推論されますが、ブロック本体を持つ匿名関数の場合は明示的に指定する必要があります（または`Unit`と見なされます）。

> 匿名関数をパラメータとして渡す場合は、括弧の内側に配置してください。関数を括弧の外に配置できる省略構文は、ラムダ式でのみ機能します。
>
{style="note"}

ラムダ式と匿名関数のもう1つの違いは、[非ローカルリターン](inline-functions.md#returns)の動作です。
ラベルのない`return`ステートメントは、常に`fun`キーワードで宣言された関数から戻ります。これは、ラムダ式内の`return`は囲んでいる関数から戻るのに対し、匿名関数内の`return`は匿名関数自体から戻ることを意味します。

### クロージャ

ラムダ式や匿名関数（および[ローカル関数](functions.md#local-functions)や[オブジェクト式](object-declarations.md#object-expressions)）は、外側のスコープで宣言された変数を含む*クロージャ*にアクセスできます。クロージャでキャプチャされた変数はラムダ内で変更できます。

```kotlin
var sum = 0
ints.filter { it > 0 }.forEach {
    sum += it
}
print(sum)
```

### レシーバを持つ関数リテラル

`A.(B) -> C`のような[レシーバを持つ関数型](#function-types)は、関数リテラルの特殊な形式、つまりレシーバを持つ関数リテラルでインスタンス化できます。

前述の通り、Kotlinはレシーバを持つ関数型の[インスタンスを呼び出す](#invoking-a-function-type-instance)際に、*レシーバオブジェクト*を提供できる機能を提供しています。

関数リテラルの本体内では、呼び出しに渡されたレシーバオブジェクトは*暗黙的な*`this`となるため、追加の修飾子なしでそのレシーバオブジェクトのメンバーにアクセスしたり、[`this`式](this-expressions.md)を使用してレシーバオブジェクトにアクセスしたりできます。

この動作は、[拡張関数](extensions.md)の動作に似ています。拡張関数も、関数本体内でレシーバオブジェクトのメンバーにアクセスできます。

以下に、レシーバを持つ関数リテラルとその型の例を示します。ここで`plus`はレシーバオブジェクトで呼び出されます。

```kotlin
val sum: Int.(Int) -> Int = { other -> plus(other) }
```

匿名関数の構文では、関数リテラルのレシーバ型を直接指定できます。
これは、レシーバを持つ関数型の変数を宣言し、後でそれを使用する必要がある場合に役立ちます。

```kotlin
val sum = fun Int.(other: Int): Int = this + other
```

ラムダ式は、レシーバ型がコンテキストから推論できる場合に、レシーバを持つ関数リテラルとして使用できます。
その最も重要な使用例の1つは、[型安全なビルダー](type-safe-builders.md)です。

```kotlin
class HTML {
    fun body() { ... }
}

fun html(init: HTML.() -> Unit): HTML {
    val html = HTML()  // create the receiver object
    html.init()        // pass the receiver object to the lambda
    return html
}

html {       // lambda with receiver begins here
    body()   // calling a method on the receiver object
}
```