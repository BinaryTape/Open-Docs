---
title: 関数
---
Kotlinの関数は、`fun`キーワードを使って宣言します。

```kotlin
fun double(x: Int): Int {
    return 2 * x
}
```

## 関数の使用法

関数は、標準的な方法で呼び出されます。

```kotlin
val result = double(2)
```

メンバ関数の呼び出しは、ドット記法を使用します。

```kotlin
Stream().read() // Streamクラスのインスタンスを作成し、read()を呼び出す
```

### 引数

関数の引数は、Pascal記法 - *name*: *type* を使用して定義します。引数はカンマで区切られ、それぞれの引数は明示的に型指定されなければなりません。

```kotlin
fun powerOf(number: Int, exponent: Int): Int { /*...*/ }
```

関数の引数を宣言するときに、[末尾のカンマ](coding-conventions#trailing-commas)を使用できます。

```kotlin
fun powerOf(
    number: Int,
    exponent: Int, // trailing comma
) { /*...*/ }
```

### デフォルト引数

関数の引数は、デフォルト値を持つことができます。これは、対応する引数を省略した場合に使用されます。これにより、オーバーロードの数を減らすことができます。

```kotlin
fun read(
    b: ByteArray,
    off: Int = 0,
    len: Int = b.size,
) { /*...*/ }
```

デフォルト値は、型に`=`を付加することで設定されます。

メソッドをオーバーライドするときは、常に基底メソッドのデフォルト引数値を使用します。
デフォルト引数値を持つメソッドをオーバーライドする場合、デフォルト引数値はシグネチャから省略しなければなりません。

```kotlin
open class A {
    open fun foo(i: Int = 10) { /*...*/ }
}

class B : A() {
    override fun foo(i: Int) { /*...*/ }  // デフォルト値は許可されていません。
}
```

デフォルトパラメータがデフォルト値を持たないパラメータより前にある場合、デフォルト値は[名前付き引数](#named-arguments)で関数を呼び出すことによってのみ使用できます。

```kotlin
fun foo(
    bar: Int = 0,
    baz: Int,
) { /*...*/ }

foo(baz = 1) // デフォルト値 bar = 0 が使用されます
```

デフォルト引数の後の最後の引数が[ラムダ](lambdas#lambda-expression-syntax)の場合、名前付き引数として渡すか、[括弧の外側](lambdas#passing-trailing-lambdas)に渡すことができます。

```kotlin
fun foo(
    bar: Int = 0,
    baz: Int = 1,
    qux: () `->` Unit,
) { /*...*/ }

foo(1) { println("hello") }     // デフォルト値 baz = 1 を使用します
foo(qux = { println("hello") }) // 両方のデフォルト値 bar = 0 と baz = 1 を使用します
foo { println("hello") }        // 両方のデフォルト値 bar = 0 と baz = 1 を使用します
```

### 名前付き引数

関数を呼び出すときに、関数の1つ以上の引数に名前を付けることができます。これは、関数に多くの引数があり、特にブール値または`null`値の場合に、値を引数に関連付けるのが難しい場合に役立ちます。

関数呼び出しで名前付き引数を使用する場合、リストされている順序を自由に変更できます。デフォルト値を使用したい場合は、これらの引数を完全に省略できます。

デフォルト値を持つ4つの引数を持つ`reformat()`関数を考えてみましょう。

```kotlin
fun reformat(
    str: String,
    normalizeCase: Boolean = true,
    upperCaseFirstLetter: Boolean = true,
    divideByCamelHumps: Boolean = false,
    wordSeparator: Char = ' ',
) { /*...*/ }
```

この関数を呼び出すとき、すべての引数に名前を付ける必要はありません。

```kotlin
reformat(
    "String!",
    false,
    upperCaseFirstLetter = false,
    divideByCamelHumps = true,
    '_'
)
```

デフォルト値を持つものをすべて省略できます。

```kotlin
reformat("This is a long String!")
```

すべてを省略するのではなく、デフォルト値を持つ特定の引数をスキップすることもできます。ただし、最初にスキップした引数の後には、後続のすべての引数に名前を付ける必要があります。

```kotlin
reformat("This is a short String!", upperCaseFirstLetter = false, wordSeparator = '_')
```

[可変長引数 (`vararg`)](#variable-number-of-arguments-varargs)を`スプレッド`演算子を使って名前付きで渡すことができます。

```kotlin
fun foo(vararg strings: String) { /*...*/ }

foo(strings = *arrayOf("a", "b", "c"))
```

:::note
JVMでJava関数を呼び出す場合、Javaバイトコードが常に関数パラメータの名前を保持するとは限らないため、名前付き引数構文を使用できません。

:::

### Unitを返す関数

関数が有用な値を返さない場合、その戻り値の型は`Unit`です。`Unit`は、1つの値 - `Unit`のみを持つ型です。
この値を明示的に返す必要はありません。

```kotlin
fun printHello(name: String?): Unit {
    if (name != null)
        println("Hello $name")
    else
        println("Hi there!")
    // `return Unit` または `return` はオプションです
}
```

`Unit`の戻り値の型の宣言もオプションです。上記のコードは以下と同等です。

```kotlin
fun printHello(name: String?) { ... }
```

### 単一式関数

関数本体が単一の式で構成されている場合、中括弧を省略し、`=`記号の後に本体を指定できます。

```kotlin
fun double(x: Int): Int = x * 2
```

コンパイラが推論できる場合、戻り値の型を明示的に宣言することは[オプション](#explicit-return-types)です。

```kotlin
fun double(x: Int) = x * 2
```

### 明示的な戻り値の型

ブロック本体を持つ関数は、常に戻り値の型を明示的に指定する必要があります。ただし、`Unit`を返すことを意図している場合は、[戻り値の型の指定はオプション](#unit-returning-functions)です。

Kotlinは、ブロック本体を持つ関数の戻り値の型を推論しません。これは、そのような関数が本体に複雑な制御フローを持つ可能性があり、戻り値の型が読者（および場合によってはコンパイラ）にとって明白ではないためです。

### 可変長引数 (varargs)

関数の引数（通常は最後の引数）を`vararg`修飾子でマークできます。

```kotlin
fun <T> asList(vararg ts: T): List<T> {
    val result = ArrayList<T>()
    for (t in ts) // tsはArrayです
        result.add(t)
    return result
}
```

この場合、可変個の引数を関数に渡すことができます。

```kotlin
val list = asList(1, 2, 3)
```

関数内では、型`T`の`vararg`パラメータは、上記の例のように、`Array<out T>`型の配列として表示されます。

`vararg`としてマークできるパラメータは1つだけです。`vararg`パラメータがリストの最後のパラメータでない場合、後続のパラメータの値は名前付き引数構文を使用して渡すことができます。または、パラメータが関数型である場合は、括弧の外側にラムダを渡すことによって渡すことができます。

`vararg`関数を呼び出すときは、個別に引数を渡すことができます。たとえば、`asList(1, 2, 3)`のようにします。すでに配列があり、その内容を関数に渡したい場合は、*スプレッド*演算子を使用します（配列の先頭に`*`を付けます）。

```kotlin
val a = arrayOf(1, 2, 3)
val list = asList(-1, 0, *a, 4)
```

[プリミティブ型配列](arrays#primitive-type-arrays)を
`vararg`に渡す場合は、`toTypedArray()`関数を使用して、通常の（型付き）配列に変換する必要があります。

```kotlin
val a = intArrayOf(1, 2, 3) // IntArrayはプリミティブ型配列です
val list = asList(-1, 0, *a.toTypedArray(), 4)
```

### Infix記法

`infix`キーワードでマークされた関数は、infix記法（呼び出しのドットと括弧を省略）を使用して呼び出すこともできます。Infix関数は、次の要件を満たす必要があります。

* メンバ関数または[拡張関数](extensions)でなければなりません。
* 単一のパラメータを持つ必要があります。
* パラメータは、[可変長引数を受け入れてはならず](#variable-number-of-arguments-varargs)、[デフォルト値](#default-arguments)を持ってはなりません。

```kotlin
infix fun Int.shl(x: Int): Int { ... }

// infix記法を使用した関数の呼び出し
1 shl 2

// は以下と同じです
1.shl(2)
```

:::note
Infix関数呼び出しは、算術演算子、型キャスト、および`rangeTo`演算子よりも優先順位が低くなります。
次の式は同等です。
* `1 shl 2 + 3` は `1 shl (2 + 3)` と同等です
* `0 until n * 2` は `0 until (n * 2)` と同等です
* `xs union ys as Set<*>` は `xs union (ys as Set<*>)` と同等です

一方、infix関数呼び出しの優先順位は、ブール演算子`&&`および`||`、`is`-
および`in`-チェック、およびその他のいくつかの演算子よりも高くなります。これらの式も同等です。
* `a && b xor c` は `a && (b xor c)` と同等です
* `a xor b in c` は `(a xor b) in c` と同等です

:::

Infix関数は、常にレシーバとパラメータの両方を指定する必要があることに注意してください。Infix記法を使用して現在のレシーバでメソッドを呼び出す場合は、明示的に`this`を使用します。これは、曖昧でない解析を保証するために必要です。

```kotlin
class MyStringCollection {
    infix fun add(s: String) { /*...*/ }
    
    fun build() {
        this add "abc"   // 正しい
        add("abc")       // 正しい
        //add "abc"        // 間違い: レシーバを指定する必要があります
    }
}
```

## 関数のスコープ

Kotlinの関数はファイルの一番上で宣言できます。つまり、Java、C#、Scalaなどの言語で必要となるような、関数を保持するためのクラスを作成する必要はありません（[トップレベル定義はScala 3以降で使用可能](https://docs.scala-lang.org/scala3/book/taste-toplevel-definitions.html#inner-main)）。トップレベルの関数に加えて、Kotlinの関数はメンバ関数および拡張関数としてローカルに宣言することもできます。

### ローカル関数

Kotlinは、ローカル関数（他の関数内の関数）をサポートしています。

```kotlin
fun dfs(graph: Graph) {
    fun dfs(current: Vertex, visited: MutableSet<Vertex>) {
        if (!visited.add(current)) return
        for (v in current.neighbors)
            dfs(v, visited)
    }

    dfs(graph.vertices[0], HashSet())
}
```

ローカル関数は、外側の関数のローカル変数（クロージャ）にアクセスできます。上記の例では、`visited`はローカル変数にすることができます。

```kotlin
fun dfs(graph: Graph) {
    val visited = HashSet<Vertex>()
    fun dfs(current: Vertex) {
        if (!visited.add(current)) return
        for (v in current.neighbors)
            dfs(v)
    }

    dfs(graph.vertices[0])
}
```

### メンバ関数

メンバ関数は、クラスまたはオブジェクト内で定義される関数です。

```kotlin
class Sample {
    fun foo() { print("Foo") }
}
```

メンバ関数はドット記法で呼び出されます。

```kotlin
Sample().foo() // Sampleクラスのインスタンスを作成し、fooを呼び出す
```

クラスとメンバのオーバーライドの詳細については、[クラス](classes)と[継承](classes#inheritance)を参照してください。

## ジェネリック関数

関数はジェネリックパラメータを持つことができます。これは、関数名の前に山括弧を使用して指定されます。

```kotlin
fun <T> singletonList(item: T): List<T> { /*...*/ }
```

ジェネリック関数の詳細については、[ジェネリクス](generics)を参照してください。

## 末尾再帰関数

Kotlinは、[末尾再帰](https://en.wikipedia.org/wiki/Tail_call)として知られる関数型プログラミングのスタイルをサポートしています。
通常はループを使用する一部のアルゴリズムでは、スタックオーバーフローのリスクなしに、代わりに再帰関数を使用できます。
関数が`tailrec`修飾子でマークされ、必要な正式な条件を満たしている場合、コンパイラは再帰を最適化して、代わりに高速で効率的なループベースのバージョンを残します。

```kotlin
val eps = 1E-10 // "good enough", could be 10^-15

tailrec fun findFixPoint(x: Double = 1.0): Double =
    if (Math.abs(x - Math.cos(x)) < eps) x else findFixPoint(Math.cos(x))
```

このコードは、コサインの`fixpoint`（不動点）を計算します。これは数学的な定数です。`1.0`から始めて、結果が変化しなくなるまで`Math.cos`を繰り返し呼び出し、指定された`eps`精度で`0.7390851332151611`の結果が得られます。結果のコードは、次のより伝統的なスタイルと同等です。

```kotlin
val eps = 1E-10 // "good enough", could be 10^-15

private fun findFixPoint(): Double {
    var x = 1.0
    while (true) {
        val y = Math.cos(x)
        if (Math.abs(x - y) < eps) return x
        x = Math.cos(x)
    }
}
```

`tailrec`修飾子の対象となるには、関数は実行する最後の操作として自身を呼び出す必要があります。再帰呼び出しの後、`try`/`catch`/`finally`ブロック内、またはopen関数で、さらにコードがある場合は、末尾再帰を使用できません。
現在、末尾再帰は、Kotlin for JVMおよびKotlin/Nativeでサポートされています。

**参照**:
* [インライン関数](inline-functions)
* [拡張関数](extensions)
* [高階関数とラムダ](lambdas)