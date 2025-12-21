[//]: # (title: 高階関数とラムダ式)

Kotlinの関数は[ファーストクラス](https://en.wikipedia.org/wiki/First-class_function)です。これは、関数が変数やデータ構造に格納できること、他の[高階関数](#higher-order-functions)への引数として渡したり、そこから返したりできることを意味します。他の非関数値に可能なあらゆる操作を関数に対して実行できます。

これを容易にするため、静的型付けプログラミング言語であるKotlinは、関数を表現するための[関数型](#function-types)のファミリーを使用し、[ラムダ式](#lambda-expressions-and-anonymous-functions)のような一連の特殊な言語構成要素を提供します。

## 高階関数

高階関数とは、関数をパラメータとして取るか、関数を返す関数のことです。

高階関数の良い例は、コレクションの[関数型プログラミングのイディオムである`fold`](https://en.wikipedia.org/wiki/Fold_(higher-order_function))です。これは、初期のアキュムレータ値と結合関数を取り、現在の累積値と各コレクション要素を連続的に結合し、毎回累積値を置き換えることで戻り値を構築します。

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

上記のコードでは、`combine`パラメータは[関数型](#function-types) `(R, T) -> R`を持っており、`R`型と`T`型の2つの引数を取り、`R`型の値を返す関数を受け入れます。
これは`for`ループ内で[呼び出され](#invoking-a-function-type-instance)、その戻り値が`accumulator`に代入されます。

`fold`を呼び出すには、[関数型のインスタンス](#instantiating-a-function-type)を引数として渡す必要があります。この目的のために、ラムダ式（[詳細は後述](#lambda-expressions-and-anonymous-functions)）が高階関数の呼び出しサイトで広く使用されます。

```kotlin
fun main() {
    //sampleStart
    val items = listOf(1, 2, 3, 4, 5)
    
    // ラムダは波括弧で囲まれたコードブロックです。
    items.fold(0, { 
        // ラムダにパラメータがある場合、それらが最初に記述され、その後に'->'が続きます
        acc: Int, i: Int -> 
        print("acc = $acc, i = $i, ") 
        val result = acc + i
        println("result = $result")
        // ラムダ内の最後の式が戻り値とみなされます。
        result
    })
    
    // ラムダのパラメータ型は、推論可能であれば省略できます。
    val joinedToString = items.fold("Elements:", { acc, i -> acc + " " + i })
    
    // 関数参照も高階関数の呼び出しに使用できます。
    val product = items.fold(1, Int::times)
    //sampleEnd
    println("joinedToString = $joinedToString")
    println("product = $product")
}
```
{kotlin-runnable="true"}

## 関数型

Kotlinは、関数を扱う宣言のために、`(Int) -> String`のような関数型を使用します。例: `val onClick: () -> Unit = ...`。

これらの型は、関数のシグネチャ（パラメータと戻り値）に対応する特別な表記法を持っています。

*   すべての関数型は、パラメータ型の括弧付きリストと戻り型を持ちます。`(A, B) -> C`は、`A`型と`B`型の2つの引数を取り、`C`型の値を返す関数を表す型を示します。パラメータ型のリストは`() -> A`のように空でも構いません。[戻り値の型`Unit`](functions.md#unit-returning-functions)は省略できません。

*   関数型は、オプションで追加の*レシーバ*型を持つことができ、これは表記法ではドットの前に指定されます。型`A.(B) -> C`は、レシーバオブジェクト`A`に対してパラメータ`B`と共に呼び出すことができ、`C`型の値を返す関数を表します。
    [レシーバ付き関数リテラル](#function-literals-with-receiver)は、これらの型と組み合わせてよく使用されます。

*   [中断関数](coroutines-basics.md)は、`suspend () -> Unit`や`suspend A.(B) -> C`のように、表記法に`suspend`修飾子を持つ特殊な種類の関数型に属します。

関数型の表記法には、オプションで関数のパラメータ名を含めることができます。`(x: Int, y: Int) -> Point`。これらの名前は、パラメータの意味を文書化するために使用できます。

関数型が[null許容型](null-safety.md#nullable-types-and-non-nullable-types)であることを指定するには、次のように括弧を使用します。`((Int, Int) -> Int)?`。

関数型は括弧を使用して組み合わせることもできます。`(Int) -> ((Int) -> Unit)`。

> 矢印表記は右結合性です。`(Int) -> (Int) -> Unit`は、上記の例と同等ですが、`((Int) -> (Int)) -> Unit`とは異なります。
>
{style="note"}

[型エイリアス](type-aliases.md)を使用して、関数型に別名を与えることもできます。

```kotlin
typealias ClickHandler = (Button, ClickEvent) -> Unit
```

### 関数型のインスタンス化

関数型のインスタンスを取得する方法はいくつかあります。

*   関数リテラル内のコードブロックを使用する方法:
    *   [ラムダ式](#lambda-expressions-and-anonymous-functions): `{ a, b -> a + b }`
    *   [匿名関数](#anonymous-functions): `fun(s: String): Int { return s.toIntOrNull() ?: 0 }`

    [レシーバ付き関数リテラル](#function-literals-with-receiver)は、レシーバ付き関数型の値として使用できます。

*   既存の宣言への呼び出し可能参照を使用する方法:
    *   トップレベル、ローカル、メンバー、または拡張[関数](reflection.md#function-references): `::isOdd`、`String::toInt`
    *   トップレベル、メンバー、または拡張[プロパティ](reflection.md#property-references): `List<Int>::size`
    *   [コンストラクタ](reflection.md#constructor-references): `::Regex`

    これらには、特定のインスタンスのメンバーを指す[バインドされた呼び出し可能参照](reflection.md#bound-function-and-property-references)が含まれます: `foo::toString`。

*   関数型をインターフェースとして実装するカスタムクラスのインスタンスを使用する方法:

```kotlin
class IntTransformer: (Int) -> Int {
    override operator fun invoke(x: Int): Int = TODO()
}

val intFunction: (Int) -> Int = IntTransformer()
```

コンパイラは、十分な情報があれば、変数に対する関数型を推論できます。

```kotlin
val a = { i: Int -> i + 1 } // The inferred type is (Int) -> Int
```

レシーバの有無に関わらず、関数型の*非リテラル*値は交換可能です。つまり、レシーバは最初のパラメータの代わりになり、逆もまた同様です。例えば、`(A, B) -> C`型の値は、`A.(B) -> C`型の値が期待される場所に渡したり割り当てたりすることができ、その逆もまた同様です。

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

> 拡張関数への参照で変数が初期化された場合でも、関数型はデフォルトでレシーバなしで推論されます。
> これを変更するには、変数の型を明示的に指定します。
>
{style="note"}

### 関数型インスタンスの呼び出し

関数型の値は、[`invoke(...)`演算子](operator-overloading.md#invoke-operator)を使用して呼び出すことができます: `f.invoke(x)` または単に `f(x)`。

値がレシーバ型を持つ場合、レシーバオブジェクトは最初の引数として渡されるべきです。
レシーバを持つ関数型の値を呼び出すもう一つの方法は、その値が[拡張関数](extensions.md)であるかのように、レシーバオブジェクトをその前に付けることです: `1.foo(2)`。

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
    println(2.intPlus(3)) // 拡張関数のような呼び出し
    //sampleEnd
}
```
{kotlin-runnable="true"}

### インライン関数

高階関数の場合、柔軟な制御フローを提供する[インライン関数](inline-functions.md)を使用すると有利になることがあります。

## ラムダ式と匿名関数

ラムダ式と匿名関数は*関数リテラル*です。関数リテラルとは、宣言されずに式として即座に渡される関数のことです。次の例を考えてみましょう。

```kotlin
max(strings, { a, b -> a.length < b.length })
```

関数`max`は高階関数であり、その2番目の引数として関数値を受け取ります。この2番目の引数は、それ自体が関数である式であり、関数リテラルと呼ばれ、次の名前付き関数と同等です。

```kotlin
fun compare(a: String, b: String): Boolean = a.length < b.length
```

`suspend`キーワードを使用して*中断ラムダ式*を作成することもできます。中断ラムダは`suspend () -> Unit`という関数型を持ち、他の中断関数を呼び出すことができます。

```kotlin
val suspendingTask = suspend { doSuspendingWork() }
```

### ラムダ式の構文

ラムダ式の完全な構文形式は次のとおりです。

```kotlin
val sum: (Int, Int) -> Int = { x: Int, y: Int -> x + y }
```

*   ラムダ式は常に波括弧で囲まれます。
*   完全な構文形式のパラメータ宣言は波括弧内にあり、オプションの型アノテーションを持ちます。
*   本体は`->`の後に続きます。
*   ラムダの推論された戻り値の型が`Unit`でない場合、ラムダ本体内の最後の（または単一の）式が戻り値として扱われます。

すべてのオプションのアノテーションを省略すると、残りは次のようになります。

```kotlin
val sum = { x: Int, y: Int -> x + y }
```

### 末尾ラムダの引き渡し

Kotlinの規約に従い、関数の最後のパラメータが関数の場合、対応する引数として渡されるラムダ式は、括弧の外に配置できます。

```kotlin
val product = items.fold(1) { acc, e -> acc * e }
```

このような構文は*末尾ラムダ*としても知られています。

ラムダがその呼び出しの唯一の引数である場合、括弧は完全に省略できます。

```kotlin
run { println("...") }
```

### it: 単一パラメータの暗黙的な名前

ラムダ式が1つのパラメータしか持たないことは非常によくあります。

コンパイラがパラメータなしでシグネチャを解析できる場合、パラメータを宣言する必要はなく、`->`を省略できます。パラメータは`it`という名前で暗黙的に宣言されます。

```kotlin
ints.filter { it > 0 } // this literal is of type '(it: Int) -> Boolean'
```

### ラムダ式からの値の返却

[修飾付きreturn](returns.md#return-to-labels)構文を使用して、ラムダから明示的に値を返すことができます。
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

この規約は、[ラムダ式を括弧の外に渡すこと](#passing-trailing-lambdas)と相まって、[LINQ形式](https://learn.microsoft.com/en-us/dotnet/csharp/programming-guide/concepts/linq/)のコードを可能にします。

```kotlin
strings.filter { it.length == 5 }.sortedBy { it }.map { it.uppercase() }
```

### 未使用変数にアンダースコアを使用する

ラムダパラメータが未使用の場合、名前の代わりにアンダースコアを配置できます。

```kotlin
map.forEach { (_, value) -> println("$value!") }
```

### ラムダにおける分解

ラムダにおける分解は、[分解宣言](destructuring-declarations.md#destructuring-in-lambdas)の一部として説明されています。

### 匿名関数

上記のラムダ式の構文には、関数の戻り値の型を指定する機能が欠けています。ほとんどの場合、戻り値の型は自動的に推論されるため、これは不要です。ただし、明示的に指定する必要がある場合は、代替構文として*匿名関数*を使用できます。

```kotlin
fun(x: Int, y: Int): Int = x + y
```

匿名関数は通常の関数宣言と非常によく似ていますが、名前が省略されています。その本体は、式（上記参照）またはブロックのいずれかになります。

```kotlin
fun(x: Int, y: Int): Int {
    return x + y
}
```

パラメータと戻り値の型は、通常の関数と同じ方法で指定されますが、文脈から推論できる場合はパラメータの型を省略できます。

```kotlin
ints.filter(fun(item) = item > 0)
```

匿名関数の戻り値の型推論は、通常の関数と同じように機能します。式本体を持つ匿名関数の戻り値の型は自動的に推論されますが、ブロック本体を持つ匿名関数の場合は明示的に指定する必要があるか（または`Unit`と見なされます）。

> 匿名関数をパラメータとして渡す場合は、括弧の内側に配置してください。関数を括弧の外に置くことができる短縮構文は、ラムダ式にのみ適用されます。
>
{style="note"}

ラムダ式と匿名関数のもう1つの違いは、[非ローカルリターン](inline-functions.md#returns)の動作です。ラベルのない`return`ステートメントは常に`fun`キーワードで宣言された関数から戻ります。これは、ラムダ式内の`return`が囲む関数から戻るのに対し、匿名関数内の`return`は匿名関数自体から戻ることを意味します。

### クロージャ

ラムダ式または匿名関数（および[ローカル関数](functions.md#local-functions)や[オブジェクト式](object-declarations.md#object-expressions)）は、外側のスコープで宣言された変数を含むその*クロージャ*にアクセスできます。クロージャ内でキャプチャされた変数はラムダ内で変更できます。

```kotlin
var sum = 0
ints.filter { it > 0 }.forEach {
    sum += it
}
print(sum)
```

### レシーバ付き関数リテラル

`A.(B) -> C`のようなレシーバ付き[関数型](#function-types)は、特殊な形式の関数リテラルであるレシーバ付き関数リテラルでインスタンス化できます。

前述のとおり、Kotlinはレシーバ付き関数型の[インスタンスを呼び出す](#invoking-a-function-type-instance)際に、*レシーバオブジェクト*を提供できる機能を提供します。

関数リテラルの本体内では、呼び出しに渡されたレシーバオブジェクトが*暗黙的な*`this`になるため、追加の修飾子なしでそのレシーバオブジェクトのメンバーにアクセスしたり、[`this`式](this-expressions.md)を使用してレシーバオブジェクトにアクセスしたりできます。

この動作は、関数本体内でレシーバオブジェクトのメンバーにアクセスできる[拡張関数](extensions.md)の動作に似ています。

以下は、`plus`がレシーバオブジェクトで呼び出される、レシーバ付き関数リテラルの例とその型です。

```kotlin
val sum: Int.(Int) -> Int = { other -> plus(other) }
```

匿名関数の構文では、関数リテラルのレシーバ型を直接指定できます。
これは、レシーバ付き関数型の変数を宣言し、後でそれを使用する必要がある場合に役立ちます。

```kotlin
val sum = fun Int.(other: Int): Int = this + other
```

ラムダ式は、レシーバ型が文脈から推論できる場合、レシーバ付き関数リテラルとして使用できます。
それらの最も重要な使用例の1つは、[型安全なビルダ](type-safe-builders.md)です。

```kotlin
class HTML {
    fun body() { ... }
}

fun html(init: HTML.() -> Unit): HTML {
    val html = HTML()  // レシーバオブジェクトを作成
    html.init()        // レシーバオブジェクトをラムダに渡す
    return html
}

html {       // ここからレシーバ付きラムダが始まる
    body()   // レシーバオブジェクトのメソッドを呼び出す
}