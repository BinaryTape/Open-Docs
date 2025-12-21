[//]: # (title: 関数)

Kotlinで関数を宣言するには：
* `fun`キーワードを使用します。
* パラメータを括弧`()`で指定します。
* 必要に応じて[戻り値の型](#return-types)を含めます。

例：

```kotlin
//sampleStart
// 'double'は関数名です
// 'x'はInt型のパラメータです
// 期待される戻り値もInt型です
fun double(x: Int): Int {
    return 2 * x
}
//sampleEnd

fun main() {
    println(double(5))
    // 10
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" validate="false" id="kotlin-function-double"}

## 関数の使用法

関数は標準的な方法で呼び出されます：

```kotlin
val result = double(2)
```

[メンバー関数](classes.md)または[拡張関数](extensions.md#extension-functions)を呼び出すには、ドット`.`を使用します：

```kotlin
// Streamクラスのインスタンスを作成し、read()を呼び出す
Stream().read()
```

### パラメータ

関数パラメータはパスカル記法（`名前: 型`）を使用して宣言します。
パラメータはコンマで区切り、各パラメータには明示的に型を指定する必要があります：

```kotlin
fun powerOf(number: Int, exponent: Int): Int { /*...*/ }
```

関数本体内では、受け取った引数は読み取り専用です（暗黙的に`val`として宣言されます）：

```kotlin
fun powerOf(number: Int, exponent: Int): Int {
    number = 2 // エラー：'val'は再代入できません。
}
```

関数パラメータを宣言する際に、[末尾のコンマ](coding-conventions.md#trailing-commas)を使用できます：

```kotlin
fun powerOf(
    number: Int,
    exponent: Int, // 末尾のコンマ
) { /*...*/ }
```

末尾のコンマは、リファクタリングやコードのメンテナンスに役立ちます。
宣言内でパラメータを移動する際に、どれが最後のパラメータになるかを心配する必要がありません。

> Kotlin関数は他の関数をパラメータとして受け取ることができ、引数として渡すこともできます。
> 詳細については、[](lambdas.md)を参照してください。
>
{style="note"}

### デフォルト値を持つパラメータ {id="parameters-with-default-values"}

関数パラメータにデフォルト値を指定することで、オプションにすることができます。
Kotlinは、対応する引数を指定せずに関数を呼び出したときに、デフォルト値を使用します。
デフォルト値を持つパラメータは、_オプションパラメータ_とも呼ばれます。

オプションパラメータを使用すると、適切なデフォルト値を持つパラメータをスキップできるようにするためだけに、関数の異なるバージョンを複数宣言する必要がなくなるため、オーバーロードの数を減らすことができます。

パラメータ宣言に`=`を付加することでデフォルト値を設定します：

```kotlin
fun read(
    b: ByteArray,
    // 'off'のデフォルト値は0です
    off: Int = 0,
    // 'len'のデフォルト値は'b'配列のサイズとして計算されます
    len: Int = b.size,
) { /*...*/ }
```

デフォルト値**を持つ**パラメータを、デフォルト値**を持たない**パラメータの前に宣言する場合、そのデフォルト値は[名前付き引数](#named-arguments)を使用して引数を指定することによってのみ使用できます：

```kotlin
fun greeting(
    userId: Int = 0,
    message: String,
) { /*...*/ }

fun main() {
    // 'userId'のデフォルト値として0を使用します
    greeting(message = "Hello!")
    
    // エラー：パラメータ'userId'に値が渡されていません
    greeting("Hello!")
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" validate="false" id="default-before-ordinary"}

[末尾ラムダ](lambdas.md#passing-trailing-lambdas)はこのルールの例外です。これは、最後のパラメータが渡された関数に対応する必要があるためです：

```kotlin
fun main () {
//sampleStart    
fun greeting(
    userId: Int = 0,
    message: () -> Unit,
)
{ println(userId)
  message() }
    
// 'userId'のデフォルト値を使用します
greeting() { println ("Hello!") }
// 0
// Hello!
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="default-before-trailing-lambda"}

[オーバーライドするメソッド](inheritance.md#overriding-methods)は常にベースメソッドのデフォルトパラメータ値を使用します。
デフォルトパラメータ値を持つメソッドをオーバーライドする場合、シグネチャからデフォルトパラメータ値を省略する必要があります：

```kotlin
open class Shape {
    open fun draw(width: Int = 10, height: Int = 5) { /*...*/ }
}

class Rectangle : Shape() {
    // ここでデフォルト値を指定することは許可されていませんが、
    // この関数もデフォルトで'width'に10、'height'に5を使用します。
    override fun draw(width: Int, height: Int) { /*...*/ }
}
```

#### 非定数式をデフォルト値として使用

パラメータに定数ではないデフォルト値を割り当てることができます。
例えば、デフォルト値は関数呼び出しの結果や、この例の`len`パラメータのように他の引数の値を使用する計算結果にすることができます：

```kotlin
fun read(
    b: ByteArray,
    off: Int = 0,
    len: Int = b.size,
) { /*...*/ }
```

他のパラメータの値を参照するパラメータは、順序のより後で宣言する必要があります。
この例では、`len`は`b`の後に宣言する必要があります。

一般に、パラメータのデフォルト値として任意の式を割り当てることができます。
ただし、デフォルト値は、対応するパラメータを**指定せず**に`関数が呼び出され`、デフォルト値を割り当てる必要がある場合にのみ評価されます。
例えば、この関数は`print`パラメータなしで呼び出された場合にのみ行を出力します：

```kotlin
fun main() {
//sampleStart
    fun read(
        b: Int,
        print: Unit? = println("No argument passed for 'print'")
    ) { println(b) }
    
    // "No argument passed for 'print'"、次に"1"を出力します
    read(1)
    // "1"のみ出力します
    read(1, null)
    //sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="non-constant-default"}

関数宣言の最後のパラメータが関数型である場合、対応する[ラムダ](lambdas.md#lambda-expression-syntax)引数を[名前付き引数](#named-arguments)として、または[括弧の外](lambdas.md#passing-trailing-lambdas)に渡すことができます：

```kotlin
fun main() {
    //sampleStart
    fun log(
        level: Int = 0,
        code:  Int = 1,
        action: () -> Unit,
    ) { println (level)
        println (code)
        action() }
    
    // 'level'に1を渡し、'code'にはデフォルト値の1を使用します
    log(1) { println("Connection established") }
    
    // 'level'には0、'code'には1の両方のデフォルト値を使用します
    log(action = { println("Connection established") })
    
    // 前の呼び出しと同等で、両方のデフォルト値を使用します
    log { println("Connection established") }
    //sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="lambda-outside-parentheses"}

### 名前付き引数

関数を呼び出す際に、その引数の1つまたは複数を名前で指定できます。
これは、関数呼び出しに多くの引数がある場合に役立ちます。
そのような場合、値と引数を関連付けるのが難しいことがあり、特にそれが`null`値やブール値である場合に顕著です。

関数呼び出しで名前付き引数を使用する場合、それらを任意の順序でリストできます。

4つの引数にデフォルト値が設定されている`reformat()`関数を考えてみましょう：

```kotlin
fun reformat(
    str: String,
    normalizeCase: Boolean = true,
    upperCaseFirstLetter: Boolean = true,
    divideByCamelHumps: Boolean = false,
    wordSeparator: Char = ' ',
) { /*...*/ }
```

この関数を呼び出す際、引数の一部を名前で指定できます：

```kotlin
reformat(
    "String!",
    normalizeCase = false,
    upperCaseFirstLetter = false,
    divideByCamelHumps = true,
    '_'
)
```

すべてのデフォルト値を持つ引数をスキップできます：

```kotlin
reformat("This is a long String!")
```

すべてを省略するのではなく、デフォルト値を持つ引数の_一部_をスキップすることもできます。
ただし、最初のスキップされた引数の後では、それ以降のすべての引数を名前で指定する必要があります：

```kotlin
reformat(
    "This is a short String!",
    upperCaseFirstLetter = false,
    wordSeparator = '_'
)
```

[可変長引数](#variable-number-of-arguments-varargs) (`vararg`)を、対応する引数を名前で指定して渡すことができます。
この例では、それは配列です：

```kotlin
fun mergeStrings(vararg strings: String) { /*...*/ }

mergeStrings(strings = arrayOf("a", "b", "c"))
```

<!-- Rationale for named arguments interaction with varargs is here https://youtrack.jetbrains.com/issue/KT-52505#focus=Comments-27-6147916.0-0 -->

> JVM上でJava関数を呼び出す場合、Javaバイトコードが関数パラメータの名前を常に保持するとは限らないため、名前付き引数構文を使用することはできません。
>
{style="note"}

### 戻り値の型

ブロック本体を持つ関数（中括弧`{}`内に命令を配置）を宣言する場合、常に明示的に戻り値の型を指定する必要があります。
唯一の例外は、`Unit`を返す場合です。その場合、[戻り値の型を指定することはオプションです](#unit-returning-functions)。

Kotlinは、ブロック本体を持つ関数の戻り値の型を推論しません。
それらの制御フローは複雑になる可能性があり、そのため戻り値の型が読者にとって（そして時にはコンパイラにとっても）不明瞭になります。
ただし、[単一式関数](#single-expression-functions)の場合、指定しなければKotlinは戻り値の型を推論できます。

### 単一式関数

関数本体が単一の式で構成されている場合、中括弧を省略し、`=`記号の後に本体を指定できます：

```kotlin
fun double(x: Int): Int = x * 2
```

ほとんどの場合、[戻り値の型](#return-types)を明示的に宣言する必要はありません：

```kotlin
// コンパイラは関数がIntを返すと推論します
fun double(x: Int) = x * 2
```

コンパイラは、単一の式から戻り値の型を推論する際に問題に遭遇することがあります。
そのような場合、明示的に戻り値の型を追加する必要があります。
例えば、再帰関数や相互再帰関数（互いに呼び出す関数）、および`fun empty() = null`のような型のない式を持つ関数は、常に戻り値の型を必要とします。

推論された戻り値の型を使用する場合、コンパイラがあなたにとってあまり有用でない型を推論する可能性があるため、実際の結果を確認するようにしてください。
上の例で、`double()`関数が`Int`ではなく`Number`を返すようにしたい場合、これを明示的に宣言する必要があります。

### Unitを返す関数

関数がブロック本体（中括弧`{}`内の命令）を持ち、有用な値を返さない場合、コンパイラはその戻り値の型が`Unit`であると仮定します。
`Unit`は唯一の値`Unit`を持つ型です。

関数型パラメータの場合を除き、`Unit`を戻り値の型として指定する必要はありません。
`Unit`を明示的に返す必要はありません。

例えば、`printHello()`関数を`Unit`を返さずに宣言できます：

```kotlin
// 関数型パラメータ('action')の宣言は、依然として
// 明示的な戻り値の型を必要とします
fun printHello(name: String?, action: () -> Unit) {
    if (name != null)
        println("Hello $name")
    else
        println("Hi there!")

    action()
}

fun main() {
    printHello("Kodee") {
        println("これは挨拶の後に実行されます。")
    }
    // Hello Kodee
    // これは挨拶の後に実行されます。

    printHello(null) {
        println("名前は指定されていませんが、アクションは依然として実行されます。")
    }
    // No name provided, but action still runs
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" validate="false" id="return-unit-implicit"}

これは次の冗長な宣言と同等です：

```kotlin
//sampleStart
fun printHello(name: String?, action: () -> Unit): Unit {
    if (name != null)
        println("Hello $name")
    else
        println("Hi there!")

    action()
    return Unit
}
//sampleEnd
fun main() {
    printHello("Kodee") {
        println("これは挨拶の後に実行されます。")
    }
    // Hello Kodee
    // これは挨拶の後に実行されます。

    printHello(null) {
        println("名前は指定されていませんが、アクションは依然として実行されます。")
    }
    // No name provided, but action still runs
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" validate="false" id="return-unit-explicit"}

関数の戻り値の型が明示的に指定されている場合、式本体内で`return`ステートメントを使用できます：

```kotlin
fun getDisplayNameOrDefault(userId: String?): String =
    getDisplayName(userId ?: return "default")
```

### 可変長引数 (varargs)

関数に可変数の引数を渡すには、そのパラメータの1つ（通常は最後のパラメータ）を`vararg`修飾子でマークします。
関数内では、型`T`の`vararg`パラメータを`T`の配列として使用できます：

```kotlin
fun <T> asList(vararg ts: T): List<T> {
    val result = ArrayList<T>()
    for (t in ts) // tsは配列です
        result.add(t)
    return result
}
```

その後、可変数の引数を関数に渡すことができます：

```kotlin
fun <T> asList(vararg ts: T): List<T> {
    val result = ArrayList<T>()
    for (t in ts) // tsは配列です
        result.add(t)
    return result
}

fun main() {
    //sampleStart
    val list = asList(1, 2, 3)
    println(list)
    // [1, 2, 3]
    //sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" validate="false" id="varargs-aslist"}

`vararg`としてマークできるパラメータは1つだけです。
`vararg`パラメータをパラメータリストの最後以外の場所に宣言した場合、後続のパラメータの値を名前付き引数を使用して渡す必要があります。
パラメータが関数型の場合、ラムダを括弧の外に配置することでその値を渡すこともできます。

`vararg`関数を呼び出す際、`asList(1, 2, 3)`の例のように引数を個別に渡すことができます。
すでに配列があり、その内容を`vararg`パラメータとして、またはその一部として関数に渡したい場合は、配列名の前に`*`を付加して[スプレッド演算子](arrays.md#pass-variable-number-of-arguments-to-a-function)を使用します：

```kotlin
fun <T> asList(vararg ts: T): List<T> {
    val result = ArrayList<T>()
    for (t in ts)
        result.add(t)
    return result
}

fun main() {
    //sampleStart
    val a = arrayOf(1, 2, 3)

    // 関数は配列[-1, 0, 1, 2, 3, 4]を受け取ります
    list = asList(-1, 0, *a, 4)

    println(list)
    // [-1, 0, 1, 2, 3, 4]
    //sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" validate="false" id="varargs-aslist-with-array"}

[プリミティブ型配列](arrays.md#primitive-type-arrays)を`vararg`として渡したい場合、[`.toTypedArray()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.collections/to-typed-array.html)関数を使用して通常の（型付けされた）配列に変換する必要があります：

```kotlin
// 'a'はIntArrayであり、プリミティブ型配列です
val a = intArrayOf(1, 2, 3)
val list = asList(-1, 0, *a.toTypedArray(), 4)
```

### 中置記法

`infix`キーワードを使用することで、括弧やドットなしで呼び出せる関数を宣言できます。
これにより、コード内の単純な関数呼び出しを読みやすくすることができます。

```kotlin
infix fun Int.shl(x: Int): Int { /*...*/ }

// 一般的な記法を使用して関数を呼び出す
1.shl(2)

// 中置記法を使用して関数を呼び出す
1 shl 2
```

中置関数は次の要件を満たす必要があります：

*   メンバー関数または[拡張関数](extensions.md)である必要があります。
*   単一のパラメータを持つ必要があります。
*   パラメータは[可変長引数](#variable-number-of-arguments-varargs) (`vararg`)を受け入れず、[デフォルト値](#parameters-with-default-values)を持つべきではありません。

> 中置関数の呼び出しは、算術演算子、型キャスト、および`rangeTo`演算子よりも低い優先順位を持ちます。
> 次の式は同等です：
> *   `1 shl 2 + 3` は `1 shl (2 + 3)` と等価です
> *   `0 until n * 2` は `0 until (n * 2)` と等価です
> *   `xs union ys as Set<*>` は `xs union (ys as Set<*>)` と等価です
>
> 一方、中置関数の呼び出しの優先順位は、論理演算子`&&`と`||`、`is`-および`in`-チェック、およびその他のいくつかの演算子よりも高くなっています。これらの式も同様に同等です：
> *   `a && b xor c` は `a && (b xor c)` と等価です
> *   `a xor b in c` は `(a xor b) in c` と等価です
>
{style="note"}

中置関数は常にレシーバーとパラメータの両方を指定する必要があることに注意してください。
中置記法を使用して現在のレシーバーのメソッドを呼び出す場合、明示的に`this`を使用します。
これは曖昧なパースを防ぐために必要です。

```kotlin
class MyStringCollection {
    val items = mutableListOf<String>()

    infix fun add(s: String) {
        println("Adding: $s")
        items += s
    }

    fun build() {
        add("first")      // 正しい：通常の関数呼び出し
        this add "second" // 正しい：明示的なレシーバーによる中置呼び出し
        // add "third"    // コンパイラエラー：明示的なレシーバーが必要です
    }

    fun printAll() = println("Items = $items")
}

fun main() {
    val myStrings = MyStringCollection()
    // リストに"first"と"second"を2回追加します
    myStrings.build()
      
    myStrings.printAll()
    // Adding: first
    // Adding: second
    // Items = [first, second]
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="infix-notation-example"}

## 関数スコープ

Kotlinの関数はファイル内でトップレベルで宣言できます。これは、関数を保持するためにクラスを作成する必要がないことを意味します。
関数は、_メンバー関数_または_拡張関数_としてローカルに宣言することもできます。

### ローカル関数

Kotlinはローカル関数をサポートしています。これは他の関数内にある関数です。
例えば、以下のコードは与えられたグラフに対する深さ優先探索アルゴリズムを実装しています。
外側の`dfs()`関数内のローカル`dfs()`関数は、実装を隠蔽し、再帰呼び出しを処理します：

```kotlin
class Person(val name: String) {
    val friends = mutableListOf<Person>()
}
class SocialGraph(val people: List<Person>)
//sampleStart
fun dfs(graph: SocialGraph) {
    fun dfs(current: Person, visited: MutableSet<Person>) {
        if (!visited.add(current)) return
        println("Visited ${current.name}")
        for (friend in current.friends)
            dfs(friend, visited)
    }
    dfs(graph.people[0], HashSet())
}
//sampleEnd
fun main() {
    val alice = Person("Alice")
    val bob = Person("Bob")
    val charlie = Person("Charlie")
    alice.friends += bob
    bob.friends += charlie
    charlie.friends += alice
    val network = SocialGraph(listOf(alice, bob, charlie))
    dfs(network)
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="local-functions-dfs"}

ローカル関数は、外側の関数のローカル変数（クロージャ）にアクセスできます。
上記の場合、`visited`関数パラメータはローカル変数にできます：

```kotlin
class Person(val name: String) {
    val friends = mutableListOf<Person>()
}
class SocialGraph(val people: List<Person>)
//sampleStart
fun dfs(graph: SocialGraph) {
    val visited = HashSet<Person>()
    fun dfs(current: Person) {
        if (!visited.add(current)) return
        println("Visited ${current.name}")
        for (friend in current.friends)
            dfs(friend)
    }
    dfs(graph.people[0])
}
//sampleEnd
fun main() {
    val alice = Person("Alice")
    val bob = Person("Bob")
    val charlie = Person("Charlie")
    alice.friends += bob
    bob.friends += charlie
    charlie.friends += alice
    val network = SocialGraph(listOf(alice, bob, charlie))
    dfs(network)
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="local-functions-dfs-with-local-variable"}

### メンバー関数

メンバー関数は、クラスまたはオブジェクト内に定義された関数です：

```kotlin
class Sample {
    fun foo() { print("Foo") }
}
```

メンバー関数を呼び出すには、インスタンスまたはオブジェクト名を書き、その後に`.`を追加して関数名を記述します：

```kotlin
// Streamクラスのインスタンスを作成し、read()を呼び出す
Stream().read()
```

クラスとメンバーのオーバーライドに関する詳細は、[クラス](classes.md)と[継承](classes.md#inheritance)を参照してください。

## ジェネリック関数

関数名の前に山括弧`<>`を使用して、関数のジェネリックパラメータを指定できます：

```kotlin
fun <T> singletonList(item: T): List<T> { /*...*/ }
```

ジェネリック関数の詳細については、[ジェネリクス](generics.md)を参照してください。

## 末尾再帰関数

Kotlinは[末尾再帰](https://en.wikipedia.org/wiki/Tail_call)として知られる関数型プログラミングのスタイルをサポートしています。
通常ループを使用する一部のアルゴリズムでは、スタックオーバーフローのリスクなしに再帰関数を使用できます。
関数が`tailrec`修飾子でマークされ、必要な形式的条件を満たしている場合、コンパイラは再帰を最適化し、代わりに高速で効率的なループベースのバージョンに置き換えます：

```kotlin
import kotlin.math.cos
import kotlin.math.abs

// An arbitrary "good enough" precision
val eps = 1E-10

tailrec fun findFixPoint(x: Double = 1.0): Double =
    if (abs(x - cos(x)) < eps) x else findFixPoint(cos(x))
```

このコードはコサインの不動点（数学定数）を計算します。
この関数は`1.0`から開始して結果が変化しなくなるまで`cos()`を繰り返し呼び出し、指定された`eps`精度で`0.7390851332151611`という結果を生成します。
このコードは、より伝統的な以下のスタイルと同等です：

```kotlin
import kotlin.math.cos
import kotlin.math.abs

// An arbitrary "good enough" precision
val eps = 1E-10

private fun findFixPoint(): Double {
    var x = 1.0
    while (true) {
        val y = cos(x)
        if (abs(x - y) < eps) return x
        x = cos(x)
    }
}
```

関数が自身を最後の操作として呼び出す場合にのみ、`tailrec`修飾子を適用できます。
再帰呼び出しの後にさらにコードがある場合、[`try`/`catch`/`finally`ブロック](exceptions.md#handle-exceptions-using-try-catch-blocks)内、または関数が[オープン](inheritance.md)である場合は、末尾再帰を使用できません。

**こちらも参照**：
*   [インライン関数](inline-functions.md)
*   [拡張関数](extensions.md)
*   [高階関数とラムダ](lambdas.md)