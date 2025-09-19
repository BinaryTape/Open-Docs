[//]: # (title: 関数)

Kotlinの関数は`fun`キーワードを使って宣言します：

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

メンバー関数を呼び出すにはドット記法を使用します：

```kotlin
Stream().read() // Streamクラスのインスタンスを作成し、read()を呼び出す
```

### パラメータ

関数パラメータはパスカル記法（*名前*: *型*）を使用して定義されます。パラメータはコンマで区切られ、各パラメータは明示的に型指定する必要があります：

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

### デフォルト値を持つパラメータ

関数パラメータにはデフォルト値を設定できます。これは対応する引数を省略した場合に使用されます。これによりオーバーロードの数を減らすことができます：

```kotlin
fun read(
    b: ByteArray,
    off: Int = 0,
    len: Int = b.size,
) { /*...*/ }
```

このようなパラメータは_オプションパラメータ_とも呼ばれます。

デフォルト値は型に`=`を付加することで設定されます。

オーバーライドするメソッドは常にベースメソッドのデフォルトパラメータ値を使用します。デフォルトパラメータ値を持つメソッドをオーバーライドする場合、シグネチャからデフォルトパラメータ値を省略する必要があります：

```kotlin
open class A {
    open fun foo(i: Int = 10) { /*...*/ }
}

class B : A() {
    override fun foo(i: Int) { /*...*/ }  // デフォルト値は許可されていません。
}
```

デフォルト値を持つパラメータがデフォルト値を持たないパラメータの前に来る場合、デフォルト値は[名前付き引数](#named-arguments)を使用して関数を呼び出すことによってのみ使用できます：

```kotlin
fun foo(
    bar: Int = 0,
    baz: Int,
) { /*...*/ }

foo(baz = 1) // デフォルト値 bar = 0 が使用されます
```

すべてのデフォルト値を持つパラメータの後に続く最後のパラメータが関数型である場合、対応する[ラムダ](lambdas.md#lambda-expression-syntax)引数を名前付き引数として、または[括弧の外](lambdas.md#passing-trailing-lambdas)に渡すことができます：

```kotlin
fun foo(
    bar: Int = 0,
    baz: Int = 1,
    qux: () -> Unit,
) { /*...*/ }

foo(1) { println("hello") }     // デフォルト値 baz = 1 が使用されます
foo(qux = { println("hello") }) // 両方のデフォルト値 bar = 0 および baz = 1 が使用されます
foo { println("hello") }        // 両方のデフォルト値 bar = 0 および baz = 1 が使用されます
```

### 名前付き引数

関数を呼び出す際に、その引数の1つまたは複数を名前で指定できます。これは、関数に多くの引数があり、特にそれがboolean値または`null`値である場合に、値を引数と関連付けるのが難しい場合に役立ちます。

関数呼び出しで名前付き引数を使用する場合、それらがリストされる順序を自由に​​変更できます。デフォルト値を使用したい場合は、これらの引数を完全に省略できます。

4つの引数にデフォルト値が設定されている`reformat()`関数を考えてみましょう。

```kotlin
fun reformat(
    str: String,
    normalizeCase: Boolean = true,
    upperCaseFirstLetter: Boolean = true,
    divideByCamelHumps: Boolean = false,
    wordSeparator: Char = ' ',
) { /*...*/ }
```

この関数を呼び出す際、すべての引数を名前で指定する必要はありません：

```kotlin
reformat(
    "String!",
    false,
    upperCaseFirstLetter = false,
    divideByCamelHumps = true,
    '_'
)
```

すべてのデフォルト値を持つ引数をスキップできます：

```kotlin
reformat("This is a long String!")
```

すべてのデフォルト値を持つ引数を省略するのではなく、特定の引数をスキップすることもできます。ただし、最初のスキップされた引数の後では、それ以降のすべての引数を名前で指定する必要があります：

```kotlin
reformat("This is a short String!", upperCaseFirstLetter = false, wordSeparator = '_')
```

[可変長引数 (`vararg`)](#variable-number-of-arguments-varargs)を名前付きで渡すには、_スプレッド演算子_（配列の前に`*`を付加）を使用します：

```kotlin
fun foo(vararg strings: String) { /*...*/ }

foo(strings = *arrayOf("a", "b", "c"))
```

> JVM上でJava関数を呼び出す場合、Javaバイトコードが関数パラメータの名前を常に保持するとは限らないため、名前付き引数構文を使用することはできません。
>
{style="note"}

### Unitを返す関数

関数が有用な値を返さない場合、その戻り値の型は`Unit`です。`Unit`は唯一の値`Unit`を持つ型です。この値は明示的に返す必要はありません：

```kotlin
fun printHello(name: String?): Unit {
    if (name != null)
        println("Hello $name")
    else
        println("Hi there!")
    // `return Unit` または `return` は任意です
}
```

`Unit`の戻り値の型宣言も任意です。上記のコードは以下と等価です：

```kotlin
fun printHello(name: String?) { ... }
```

### 単一式関数

関数本体が単一の式で構成されている場合、中括弧を省略し、`=`記号の後に本体を指定できます：

```kotlin
fun double(x: Int): Int = x * 2
```

戻り値の型がコンパイラによって推論できる場合、明示的な宣言は[オプション](#explicit-return-types)です：

```kotlin
fun double(x: Int) = x * 2
```

### 明示的な戻り値の型

ブロック本体を持つ関数は、`Unit`を返すことが意図されている場合を除き、常に明示的に戻り値の型を指定する必要があります。[その場合、戻り値の型の指定はオプションです](#unit-returning-functions)。

Kotlinはブロック本体を持つ関数の戻り値の型を推論しません。これは、そのような関数が本体に複雑な制御フローを持つ可能性があり、戻り値の型が読者にとって（そして時にはコンパイラにとっても）不明確になるためです。

### 可変長引数 (varargs)

関数のパラメータ（通常は最後のパラメータ）を`vararg`修飾子でマークできます：

```kotlin
fun <T> asList(vararg ts: T): List<T> {
    val result = ArrayList<T>()
    for (t in ts) // tsは配列です
        result.add(t)
    return result
}
```

この場合、可変数の引数を関数に渡すことができます：

```kotlin
val list = asList(1, 2, 3)
```

関数内では、型`T`の`vararg`パラメータは、上記の例のように`T`の配列として可視化され、`ts`変数の型は`Array<out T>`になります。

`vararg`としてマークできるパラメータは1つだけです。`vararg`パラメータがリストの最後でない場合、それに続くパラメータの値は名前付き引数構文を使用するか、パラメータが関数型の場合は括弧の外にラムダを渡すことで渡す必要があります。

`vararg`関数を呼び出す際、例えば`asList(1, 2, 3)`のように引数を個別に渡すことができます。すでに配列があり、その内容を関数に渡したい場合は、スプレッド演算子（配列の前に`*`を付加）を使用します：

```kotlin
val a = arrayOf(1, 2, 3)
val list = asList(-1, 0, *a, 4)
```

[プリミティブ型配列](arrays.md#primitive-type-arrays)を`vararg`に渡したい場合は、`toTypedArray()`関数を使用して通常の（型付けされた）配列に変換する必要があります：

```kotlin
val a = intArrayOf(1, 2, 3) // IntArrayはプリミティブ型配列です
val list = asList(-1, 0, *a.toTypedArray(), 4)
```

### 中置記法

`infix`キーワードでマークされた関数は、中置記法（ドットと呼び出しの括弧を省略）を使用して呼び出すこともできます。中置関数は次の要件を満たす必要があります：

*   メンバー関数または[拡張関数](extensions.md)である必要があります。
*   単一のパラメータを持つ必要があります。
*   パラメータは[可変長引数](#variable-number-of-arguments-varargs)を受け入れず、[デフォルト値](#parameters-with-default-values)を持つべきではありません。

```kotlin
infix fun Int.shl(x: Int): Int { ... }

// 中置記法を使用して関数を呼び出す
1 shl 2

// と同じです
1.shl(2)
```

> 中置関数の呼び出しは、算術演算子、型キャスト、および`rangeTo`演算子よりも低い優先順位を持ちます。次の式は同等です：
> *   `1 shl 2 + 3` は `1 shl (2 + 3)` と等価です
> *   `0 until n * 2` は `0 until (n * 2)` と等価です
> *   `xs union ys as Set<*>` は `xs union (ys as Set<*>)` と等価です
>
> 一方、中置関数の呼び出しの優先順位は、論理演算子`&&`と`||`、`is`-および`in`-チェック、およびその他のいくつかの演算子よりも高くなっています。これらの式も同様に同等です：
> *   `a && b xor c` は `a && (b xor c)` と等価です
> *   `a xor b in c` は `(a xor b) in c` と等価です
>
{style="note"}

中置関数は常にレシーバーとパラメータの両方を指定する必要があることに注意してください。中置記法を使用して現在のレシーバーのメソッドを呼び出す場合、明示的に`this`を使用します。これは曖昧なパースを防ぐために必要です。

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

## 関数スコープ

Kotlinの関数はファイル内でトップレベルで宣言できます。これは、Java、C#、Scala（[Scala 3以降でトップレベル定義が利用可能](https://docs.scala-lang.org/scala3/book/taste-toplevel-definitions.html#inner-main)）のような言語で関数を保持するためにクラスを作成する必要があるのとは異なり、その必要がないことを意味します。トップレベル関数の他に、Kotlin関数はメンバー関数や拡張関数としてローカルに宣言することもできます。

### ローカル関数

Kotlinはローカル関数をサポートしています。これは他の関数内にある関数です：

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

ローカル関数は、外側の関数のローカル変数（クロージャ）にアクセスできます。上記の場合、`visited`はローカル変数にできます：

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

メンバー関数は、クラスまたはオブジェクト内に定義された関数です：

```kotlin
class Sample {
    fun foo() { print("Foo") }
}
```

メンバー関数はドット記法で呼び出されます：

```kotlin
Sample().foo() // Sampleクラスのインスタンスを作成し、fooを呼び出す
```

クラスとメンバーのオーバーライドに関する詳細は、[クラス](classes.md)と[継承](classes.md#inheritance)を参照してください。

## ジェネリック関数

関数はジェネリックパラメータを持つことができ、これらは関数名の前に山括弧を使用して指定されます：

```kotlin
fun <T> singletonList(item: T): List<T> { /*...*/ }
```

ジェネリック関数の詳細については、[ジェネリクス](generics.md)を参照してください。

## 末尾再帰関数

Kotlinは[末尾再帰](https://en.wikipedia.org/wiki/Tail_call)として知られる関数型プログラミングのスタイルをサポートしています。通常ループを使用する一部のアルゴリズムでは、スタックオーバーフローのリスクなしに再帰関数を使用できます。`tailrec`修飾子でマークされ、必要な形式的条件を満たしている場合、コンパイラは再帰を最適化し、高速で効率的なループベースのバージョンに置き換えます：

```kotlin
val eps = 1E-10 // 「十分良い」、10^-15でも可

tailrec fun findFixPoint(x: Double = 1.0): Double =
    if (Math.abs(x - Math.cos(x)) < eps) x else findFixPoint(Math.cos(x))
```

このコードは、数学定数であるコサインの`不動点`を計算します。これは、`1.0`から開始して結果が変化しなくなるまで`Math.cos`を繰り返し呼び出し、指定された`eps`精度で`0.7390851332151611`という結果を生成します。結果として得られるコードは、より伝統的な以下のスタイルと同等です：

```kotlin
val eps = 1E-10 // 「十分良い」、10^-15でも可

private fun findFixPoint(): Double {
    var x = 1.0
    while (true) {
        val y = Math.cos(x)
        if (Math.abs(x - y) < eps) return x
        x = Math.cos(x)
    }
}
```

`tailrec`修飾子の対象となるには、関数は自身を最後の操作として呼び出す必要があります。再帰呼び出しの後にさらにコードがある場合、`try`/`catch`/`finally`ブロック内、またはオープン関数では末尾再帰を使用できません。現在、KotlinではJVMとKotlin/Nativeで末尾再帰がサポートされています。

**こちらも参照**：
*   [インライン関数](inline-functions.md)
*   [拡張関数](extensions.md)
*   [高階関数とラムダ](lambdas.md)