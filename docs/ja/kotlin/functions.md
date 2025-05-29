[//]: # (title: 関数)

Kotlinの関数は`fun`キーワードを使用して宣言されます：

```kotlin
fun double(x: Int): Int {
    return 2 * x
}
```

## 関数の使用法

関数は標準的な方法で呼び出されます：

```kotlin
val result = double(2)
```

メンバー関数を呼び出す際にはドット記法を使用します：

```kotlin
Stream().read() // Streamクラスのインスタンスを作成してread()を呼び出す
```

### パラメータ

関数のパラメータはPascal記法（*名前*: *型*）で定義されます。パラメータはコンマで区切られ、各パラメータは明示的に型指定する必要があります：

```kotlin
fun powerOf(number: Int, exponent: Int): Int { /*...*/ }
```

関数パラメータを宣言する際に、[末尾のコンマ](coding-conventions.md#trailing-commas)を使用できます：

```kotlin
fun powerOf(
    number: Int,
    exponent: Int, // 末尾のコンマ
) { /*...*/ }
```

### デフォルト引数

関数のパラメータにはデフォルト値を設定できます。これは、対応する引数を省略した場合に使用されます。これにより、オーバーロードの数を減らすことができます：

```kotlin
fun read(
    b: ByteArray,
    off: Int = 0,
    len: Int = b.size,
) { /*...*/ }
```

デフォルト値は型に`=`を付加することで設定します。

オーバーライドするメソッドは常に基底メソッドのデフォルトパラメータ値を使用します。
デフォルトパラメータ値を持つメソッドをオーバーライドする場合、シグネチャからデフォルトパラメータ値を省略する必要があります：

```kotlin
open class A {
    open fun foo(i: Int = 10) { /*...*/ }
}

class B : A() {
    override fun foo(i: Int) { /*...*/ }  // デフォルト値は許可されません。
}
```

デフォルトパラメータがデフォルト値を持たないパラメータの前に来る場合、デフォルト値は[名前付き引数](#named-arguments)を使って関数を呼び出すことによってのみ使用できます：

```kotlin
fun foo(
    bar: Int = 0,
    baz: Int,
) { /*...*/ }

foo(baz = 1) // デフォルト値 bar = 0 が使用される
```

デフォルトパラメータの後の最後の引数が[ラムダ](lambdas.md#lambda-expression-syntax)の場合、名前付き引数として渡すか、[括弧の外](lambdas.md#passing-trailing-lambdas)に渡すことができます：

```kotlin
fun foo(
    bar: Int = 0,
    baz: Int = 1,
    qux: () -> Unit,
) { /*...*/ }

foo(1) { println("hello") }     // デフォルト値 baz = 1 を使用する
foo(qux = { println("hello") }) // bar = 0 と baz = 1 の両方のデフォルト値を使用する
foo { println("hello") }        // bar = 0 と baz = 1 の両方のデフォルト値を使用する
```

### 名前付き引数

関数を呼び出す際に、1つまたは複数の引数に名前を付けることができます。これは、関数に多くの引数があり、特に真偽値や`null`値の場合に、値を引数と関連付けるのが難しい場合に役立ちます。

関数呼び出しで名前付き引数を使用する場合、それらがリストされる順序を自由に並べ替えることができます。デフォルト値を使用したい場合は、これらの引数を完全に省略することができます。

デフォルト値を持つ4つの引数を持つ`reformat()`関数を考えます。

```kotlin
fun reformat(
    str: String,
    normalizeCase: Boolean = true,
    upperCaseFirstLetter: Boolean = true,
    divideByCamelHumps: Boolean = false,
    wordSeparator: Char = ' ',
) { /*...*/ }
```

この関数を呼び出す際、すべての引数に名前を付ける必要はありません：

```kotlin
reformat(
    "String!",
    false,
    upperCaseFirstLetter = false,
    divideByCamelHumps = true,
    '_'
)
```

デフォルト値を持つ引数をすべて省略することもできます：

```kotlin
reformat("This is a long String!")
```

すべての引数を省略するのではなく、デフォルト値を持つ特定の引数をスキップすることも可能です。ただし、最初にスキップした引数の後、すべての後続の引数に名前を付ける必要があります：

```kotlin
reformat("This is a short String!", upperCaseFirstLetter = false, wordSeparator = '_')
```

[可変長引数（`vararg`）](#variable-number-of-arguments-varargs)を、_スプレッド演算子_（配列の前に`*`を付ける）を使用して名前付きで渡すことができます：

```kotlin
fun foo(vararg strings: String) { /*...*/ }

foo(strings = *arrayOf("a", "b", "c"))
```

> JVMでJava関数を呼び出す場合、Javaのバイトコードは関数のパラメータ名を常に保持するわけではないため、名前付き引数構文を使用することはできません。
>
{style="note"}

### Unitを返す関数

関数が有用な値を返さない場合、その戻り型は`Unit`です。`Unit`は単一の値（`Unit`）のみを持つ型です。この値は明示的に返す必要はありません：

```kotlin
fun printHello(name: String?): Unit {
    if (name != null)
        println("Hello $name")
    else
        println("Hi there!")
    // `return Unit` または `return` はオプションです
}
```

`Unit`の戻り型宣言もオプションです。上記のコードは以下と同等です：

```kotlin
fun printHello(name: String?) { ... }
```

### 単一式関数

関数本体が単一の式で構成される場合、中括弧を省略し、`=`記号の後に本体を指定できます：

```kotlin
fun double(x: Int): Int = x * 2
```

戻り型を明示的に宣言することは、コンパイラによって推論できる場合、[オプション](#explicit-return-types)です：

```kotlin
fun double(x: Int) = x * 2
```

### 明示的な戻り型

ブロック本体を持つ関数は、常に明示的に戻り型を指定する必要があります。ただし、`Unit`を返すことを意図している場合は、[戻り型の指定はオプションです](#unit-returning-functions)。

Kotlinはブロック本体を持つ関数の戻り型を推論しません。これは、そのような関数は本体に複雑な制御フローを持つ可能性があり、戻り型が読者にとって（そして時にはコンパイラにとっても）不明確になるためです。

### 可変長引数 (varargs)

関数のパラメータ（通常は最後のもの）を`vararg`修飾子でマークできます：

```kotlin
fun <T> asList(vararg ts: T): List<T> {
    val result = ArrayList<T>()
    for (t in ts) // ts は配列です
        result.add(t)
    return result
}
```

この場合、関数に可変数の引数を渡すことができます：

```kotlin
val list = asList(1, 2, 3)
```

関数内では、型`T`の`vararg`パラメータは`T`の配列として見えます。上記の例では、`ts`変数は型`Array<out T>`を持ちます。

`vararg`としてマークできるパラメータは1つだけです。`vararg`パラメータがリストの最後ではない場合、後続のパラメータの値は名前付き引数構文を使用して渡す必要があります。あるいは、パラメータが関数型である場合は、括弧の外にラムダを渡すことによって渡します。

`vararg`関数を呼び出す際、例えば`asList(1, 2, 3)`のように個々の引数を渡すことができます。すでに配列があり、その内容を関数に渡したい場合は、スプレッド演算子（配列の前に`*`を付ける）を使用します：

```kotlin
val a = arrayOf(1, 2, 3)
val list = asList(-1, 0, *a, 4)
```

`vararg`に[プリミティブ型配列](arrays.md#primitive-type-arrays)を渡したい場合、`toTypedArray()`関数を使用してそれを通常の（型付き）配列に変換する必要があります：

```kotlin
val a = intArrayOf(1, 2, 3) // IntArray はプリミティブ型配列です
val list = asList(-1, 0, *a.toTypedArray(), 4)
```

### 中置記法

`infix`キーワードでマークされた関数は、中置記法（ドットと括弧を省略した呼び出し方）でも呼び出すことができます。中置関数は以下の要件を満たす必要があります：

*   メンバー関数または[拡張関数](extensions.md)である必要があります。
*   単一のパラメータを持つ必要があります。
*   パラメータが[可変長引数を受け入れず](#variable-number-of-arguments-varargs)、[デフォルト値](#default-arguments)を持たない必要があります。

```kotlin
infix fun Int.shl(x: Int): Int { ... }

// 中置記法で関数を呼び出す
1 shl 2

// と同じ
1.shl(2)
```

> 中置関数呼び出しは、算術演算子、型キャスト、および`rangeTo`演算子よりも優先順位が低いです。
> 以下の式は同等です：
> * `1 shl 2 + 3` は `1 shl (2 + 3)` と同等です
> * `0 until n * 2` は `0 until (n * 2)` と同等です
> * `xs union ys as Set<*>` は `xs union (ys as Set<*>)` と同等です
>
> 一方、中置関数呼び出しの優先順位は、論理演算子`&&`と`||`、`is`- および `in`-チェック、およびその他のいくつかの演算子よりも高いです。これらの式も同等です：
> * `a && b xor c` は `a && (b xor c)` と同等です
> * `a xor b in c` は `(a xor b) in c` と同等です
>
{style="note"}

中置関数は常にレシーバーとパラメータの両方を指定する必要があることに注意してください。中置記法を使用して現在のレシーバー上でメソッドを呼び出す場合、`this`を明示的に使用してください。これは、曖昧さのない解析を保証するために必要です。

```kotlin
class MyStringCollection {
    infix fun add(s: String) { /*...*/ }
    
    fun build() {
        this add "abc"   // 正しい
        add("abc")       // 正しい
        //add "abc"        // 不正: レシーバーを指定する必要があります
    }
}
```

## 関数のスコープ

Kotlinの関数はファイルのトップレベルで宣言できます。これは、Java、C#、Scala（[Scala 3以降でトップレベル定義が可能](https://docs.scala-lang.org/scala3/book/taste-toplevel-definitions.html#inner-main)）のような言語で関数を保持するためにクラスを作成する必要がないことを意味します。トップレベル関数の他に、Kotlinの関数はローカル関数、メンバー関数、拡張関数としても宣言できます。

### ローカル関数

Kotlinはローカル関数（他の関数内部の関数）をサポートしています：

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

ローカル関数は外側の関数のローカル変数（クロージャ）にアクセスできます。上記の場合、`visited`はローカル変数にすることができます：

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

### メンバー関数

メンバー関数は、クラスまたはオブジェクト内に定義される関数です：

```kotlin
class Sample {
    fun foo() { print("Foo") }
}
```

メンバー関数はドット記法で呼び出されます：

```kotlin
Sample().foo() // Sampleクラスのインスタンスを作成し、fooを呼び出す
```

クラスとメンバーのオーバーライドに関する詳細については、[クラス](classes.md)および[継承](classes.md#inheritance)を参照してください。

## ジェネリック関数

関数はジェネリックパラメータを持つことができ、これらは関数名の前に山括弧を使用して指定されます：

```kotlin
fun <T> singletonList(item: T): List<T> { /*...*/ }
```

ジェネリック関数に関する詳細については、[ジェネリクス](generics.md)を参照してください。

## 末尾再帰関数

Kotlinは[末尾再帰](https://en.wikipedia.org/wiki/Tail_call)として知られる関数型プログラミングスタイルをサポートしています。通常ループを使用する一部のアルゴリズムでは、スタックオーバーフローのリスクなしに再帰関数を使用できます。関数が`tailrec`修飾子でマークされ、必要な形式的条件を満たす場合、コンパイラは再帰を最適化し、高速で効率的なループベースのバージョンに変換します：

```kotlin
val eps = 1E-10 // 「十分な精度」、10^-15 とも表現できる

tailrec fun findFixPoint(x: Double = 1.0): Double =
    if (Math.abs(x - Math.cos(x)) < eps) x else findFixPoint(Math.cos(x))
```

このコードは、コサインの`不動点`（数学定数）を計算します。`Math.cos`を`1.0`から繰り返し呼び出し、結果が変わらなくなるまで続けます。指定された`eps`精度の場合、結果は`0.7390851332151611`となります。結果として得られるコードは、より伝統的なスタイルである以下と同等です：

```kotlin
val eps = 1E-10 // 「十分な精度」、10^-15 とも表現できる

private fun findFixPoint(): Double {
    var x = 1.0
    while (true) {
        val y = Math.cos(x)
        if (Math.abs(x - y) < eps) return x
        x = Math.cos(x)
    }
}
```

`tailrec`修飾子の対象となるには、関数は自身を最後の操作として呼び出す必要があります。再帰呼び出しの後にさらにコードがある場合、`try`/`catch`/`finally`ブロック内、または`open`関数では末尾再帰を使用できません。現在、末尾再帰はKotlin for JVMおよびKotlin/Nativeでサポートされています。

**関連項目**:
* [インライン関数](inline-functions.md)
* [拡張関数](extensions.md)
* [高階関数とラムダ](lambdas.md)