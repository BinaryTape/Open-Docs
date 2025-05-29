[//]: # (title: Kotlin 1.1 の新機能)

_公開日: 2016年2月15日_

## 目次

*   [コルーチン (実験的機能)](#coroutines-experimental)
*   [その他の言語機能](#other-language-features)
*   [標準ライブラリ](#standard-library)
*   [JVM バックエンド](#jvm-backend)
*   [JavaScript バックエンド](#javascript-backend)

## JavaScript

Kotlin 1.1 から、JavaScript ターゲットは実験的機能ではなくなりました。すべての言語機能がサポートされており、
フロントエンド開発環境との統合のための新しいツールが多数追加されています。変更点の詳細については、
[下記](#javascript-backend)をご覧ください。

## コルーチン (実験的機能)

Kotlin 1.1 の主要な新機能は、`async`/`await`、`yield`、および類似のプログラミングパターンをサポートする*コルーチン*です。
Kotlin の設計の重要な特徴は、コルーチン実行の実装が言語の一部ではなく、ライブラリの一部であるため、特定のプログラミングパラダイムや並行処理ライブラリに縛られないことです。

コルーチンは、本質的に軽量なスレッドであり、中断して後で再開できます。
コルーチンは、_[サスペンド関数](coroutines-basics.md#extract-function-refactoring)_を通じてサポートされます。
このような関数の呼び出しはコルーチンをサスペンドする可能性があり、新しいコルーチンを開始するには通常、匿名サスペンド関数 (つまりサスペンドラムダ) を使用します。

外部ライブラリである [kotlinx.coroutines](https://github.com/kotlin/kotlinx.coroutines) で実装されている `async`/`await` を見てみましょう。

```kotlin
// runs the code in the background thread pool
fun asyncOverlay() = async(CommonPool) {
    // start two async operations
    val original = asyncLoadImage("original")
    val overlay = asyncLoadImage("overlay")
    // and then apply overlay to both results
    applyOverlay(original.await(), overlay.await())
}

// launches new coroutine in UI context
launch(UI) {
    // wait for async overlay to complete
    val image = asyncOverlay().await()
    // and then show it in UI
    showImage(image)
}
```

ここで、`async { ... }` はコルーチンを開始し、`await()` を使用すると、待機している操作が実行されている間、コルーチンの実行がサスペンドされ、待機している操作が完了すると (おそらく別のスレッドで) 再開されます。

標準ライブラリは、`yield` および `yieldAll` 関数を使用して、*遅延生成シーケンス*をサポートするためにコルーチンを使用します。
このようなシーケンスでは、シーケンス要素を返すコードブロックは、各要素が取得された後にサスペンドされ、次の要素が要求されたときに再開されます。以下に例を示します。

```kotlin
import kotlin.coroutines.experimental.*

fun main(args: Array<String>) {
    val seq = buildSequence {
      for (i in 1..5) {
          // yield a square of i
          yield(i * i)
      }
      // yield a range
      yieldAll(26..28)
    }

    // print the sequence
    println(seq.toList())
}
```

上記コードを実行して結果を確認してください。自由に編集して再度実行することもできます。

詳細については、[コルーチンに関するドキュメント](coroutines-overview.md)と[チュートリアル](coroutines-and-channels.md)を参照してください。

コルーチンは現在**実験的機能**と見なされており、最終的な 1.1 リリース後も Kotlin チームがこの機能の後方互換性をサポートすることを約束するものではないことに注意してください。

## その他の言語機能

### 型エイリアス (Type aliases)

型エイリアスを使用すると、既存の型に別の名前を定義できます。
これは、コレクションなどのジェネリック型や、関数型で最も役立ちます。
以下に例を示します。

```kotlin
//sampleStart
typealias OscarWinners = Map<String, String>

fun countLaLaLand(oscarWinners: OscarWinners) =
        oscarWinners.count { it.value.contains("La La Land") }

// Note that the type names (initial and the type alias) are interchangeable:
fun checkLaLaLandIsTheBestMovie(oscarWinners: Map<String, String>) =
        oscarWinners["Best picture"] == "La La Land"
//sampleEnd

fun oscarWinners(): OscarWinners {
    return mapOf(
            "Best song" to "City of Stars (La La Land)",
            "Best actress" to "Emma Stone (La La Land)",
            "Best picture" to "Moonlight" /* ... */)
}

fun main(args: Array<String>) {
    val oscarWinners = oscarWinners()

    val laLaLandAwards = countLaLaLand(oscarWinners)
    println("LaLaLandAwards = $laLaLandAwards (in our small example), but actually it's 6.")

    val laLaLandIsTheBestMovie = checkLaLaLandIsTheBestMovie(oscarWinners)
    println("LaLaLandIsTheBestMovie = $laLaLandIsTheBestMovie")
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

詳細については、[型エイリアスに関するドキュメント](type-aliases.md)と [KEEP](https://github.com/Kotlin/KEEP/blob/master/proposals/type-aliases.md) を参照してください。

### バウンド呼び出し可能参照 (Bound callable references)

`::` 演算子を使用して、特定のオブジェクトインスタンスのメソッドまたはプロパティを指す[メンバー参照](reflection.md#function-references)を取得できるようになりました。以前はラムダでしか表現できませんでした。
以下に例を示します。

```kotlin
//sampleStart
val numberRegex = "\\d+".toRegex()
val numbers = listOf("abc", "123", "456").filter(numberRegex::matches)
//sampleEnd

fun main(args: Array<String>) {
    println("Result is $numbers")
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

詳細については、[ドキュメント](reflection.md)と [KEEP](https://github.com/Kotlin/KEEP/blob/master/proposals/bound-callable-references.md) を参照してください。

### シールドクラスとデータクラス (Sealed and data classes)

Kotlin 1.1 では、Kotlin 1.0 に存在していたシールドクラスとデータクラスの制限の一部が削除されました。
これで、トップレベルのシールドクラスのサブクラスを、シールドクラスのネストされたクラスとしてだけでなく、同じファイルのトップレベルで定義できるようになりました。
データクラスは他のクラスを継承できるようになりました。
これは、式クラスの階層をきれいに明確に定義するために使用できます。

```kotlin
//sampleStart
sealed class Expr

data class Const(val number: Double) : Expr()
data class Sum(val e1: Expr, val e2: Expr) : Expr()
object NotANumber : Expr()

fun eval(expr: Expr): Double = when (expr) {
    is Const -> expr.number
    is Sum -> eval(expr.e1) + eval(expr.e2)
    NotANumber -> Double.NaN
}
val e = eval(Sum(Const(1.0), Const(2.0)))
//sampleEnd

fun main(args: Array<String>) {
    println("e is $e") // 3.0
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

詳細については、[シールドクラスに関するドキュメント](sealed-classes.md)または [シールドクラス](https://github.com/Kotlin/KEEP/blob/master/proposals/sealed-class-inheritance.md) および [データクラス](https://github.com/Kotlin/KEEP/blob/master/proposals/data-class-inheritance.md) の KEEPs を参照してください。

### ラムダでの分解宣言 (Destructuring in lambdas)

[分解宣言](destructuring-declarations.md)構文を使用して、ラムダに渡される引数をアンパックできるようになりました。
以下に例を示します。

```kotlin
fun main(args: Array<String>) {
//sampleStart
    val map = mapOf(1 to "one", 2 to "two")
    // before
    println(map.mapValues { entry ->
      val (key, value) = entry
      "$key -> $value!"
    })
    // now
    println(map.mapValues { (key, value) -> "$key -> $value!" })
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

詳細については、[分解宣言に関するドキュメント](destructuring-declarations.md)と [KEEP](https://github.com/Kotlin/KEEP/blob/master/proposals/destructuring-in-parameters.md) を参照してください。

### 未使用パラメータのアンダースコア (Underscores for unused parameters)

複数のパラメータを持つラムダの場合、使用しないパラメータの名前を `_` 文字で置き換えることができます。

```kotlin
fun main(args: Array<String>) {
    val map = mapOf(1 to "one", 2 to "two")

//sampleStart
    map.forEach { _, value -> println("$value!") }
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

これは[分解宣言](destructuring-declarations.md)でも機能します。

```kotlin
data class Result(val value: Any, val status: String)

fun getResult() = Result(42, "ok").also { println("getResult() returns $it") }

fun main(args: Array<String>) {
//sampleStart
    val (_, status) = getResult()
//sampleEnd
    println("status is '$status'")
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

詳細については、[KEEP](https://github.com/Kotlin/KEEP/blob/master/proposals/underscore-for-unused-parameters.md) を参照してください。

### 数値リテラルでのアンダースコア (Underscores in numeric literals)

Java 8 と同様に、Kotlin でも数値リテラルでアンダースコアを使用して数字のグループを区切ることができるようになりました。

```kotlin
//sampleStart
val oneMillion = 1_000_000
val hexBytes = 0xFF_EC_DE_5E
val bytes = 0b11010010_01101001_10010100_10010010
//sampleEnd

fun main(args: Array<String>) {
    println(oneMillion)
    println(hexBytes.toString(16))
    println(bytes.toString(2))
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

詳細については、[KEEP](https://github.com/Kotlin/KEEP/blob/master/proposals/underscores-in-numeric-literals.md) を参照してください。

### プロパティの短い構文 (Shorter syntax for properties)

ゲッターが式本体として定義されているプロパティの場合、プロパティの型を省略できるようになりました。

```kotlin
//sampleStart
    data class Person(val name: String, val age: Int) {
    val isAdult get() = age >= 20 // Property type inferred to be 'Boolean'
}
//sampleEnd
fun main(args: Array<String>) {
    val akari = Person("Akari", 26)
    println("$akari.isAdult = ${akari.isAdult}")
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

### インラインプロパティアクセサー (Inline property accessors)

バッキングフィールドを持たないプロパティの場合、プロパティアクセサーを `inline` 修飾子でマークできるようになりました。
このようなアクセサーは、[インライン関数](inline-functions.md)と同じ方法でコンパイルされます。

```kotlin
//sampleStart
public val <T> List<T>.lastIndex: Int
    inline get() = this.size - 1
//sampleEnd

fun main(args: Array<String>) {
    val list = listOf('a', 'b')
    // the getter will be inlined
    println("Last index of $list is ${list.lastIndex}")
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

プロパティ全体を `inline` とマークすることもできます。その場合、修飾子は両方のアクセサーに適用されます。

詳細については、[インライン関数に関するドキュメント](inline-functions.md#inline-properties)と [KEEP](https://github.com/Kotlin/KEEP/blob/master/proposals/inline-properties.md) を参照してください。

### ローカルデリゲートプロパティ (Local delegated properties)

ローカル変数で[デリゲートプロパティ](delegated-properties.md)構文を使用できるようになりました。
1つの可能な使用法は、遅延評価されるローカル変数を定義することです。

```kotlin
import java.util.Random

fun needAnswer() = Random().nextBoolean()

fun main(args: Array<String>) {
//sampleStart
    val answer by lazy {
        println("Calculating the answer...")
        42
    }
    if (needAnswer()) {                     // returns the random value
        println("The answer is $answer.")   // answer is calculated at this point
    }
    else {
        println("Sometimes no answer is the answer...")
    }
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

詳細については、[KEEP](https://github.com/Kotlin/KEEP/blob/master/proposals/local-delegated-properties.md) を参照してください。

### デリゲートプロパティのバインディングのインターセプト (Interception of delegated property binding)

[デリゲートプロパティ](delegated-properties.md)の場合、`provideDelegate` 演算子を使用して、デリゲートからプロパティへのバインディングをインターセプトできるようになりました。
例えば、バインディングの前にプロパティ名をチェックしたい場合、次のように記述できます。

```kotlin
class ResourceLoader<T>(id: ResourceID<T>) {
    operator fun provideDelegate(thisRef: MyUI, prop: KProperty<*>): ReadOnlyProperty<MyUI, T> {
        checkProperty(thisRef, prop.name)
        ... // property creation
    }

    private fun checkProperty(thisRef: MyUI, name: String) { ... }
}

fun <T> bindResource(id: ResourceID<T>): ResourceLoader<T> { ... }

class MyUI {
    val image by bindResource(ResourceID.image_id)
    val text by bindResource(ResourceID.text_id)
}
```

`provideDelegate` メソッドは `MyUI` インスタンスの作成中に各プロパティに対して呼び出され、必要な検証をすぐに行うことができます。

詳細については、[デリゲートプロパティに関するドキュメント](delegated-properties.md)を参照してください。

### ジェネリックな Enum 値へのアクセス (Generic enum value access)

Enum クラスの値をジェネリックな方法で列挙できるようになりました。

```kotlin
//sampleStart
enum class RGB { RED, GREEN, BLUE }

inline fun <reified T : Enum<T>> printAllValues() {
    print(enumValues<T>().joinToString { it.name })
}
//sampleEnd

fun main(args: Array<String>) {
    printAllValues<RGB>() // prints RED, GREEN, BLUE
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

### DSL における暗黙のレシーバのスコープ制御 (Scope control for implicit receivers in DSLs)

[`@DslMarker`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-dsl-marker/index.html) アノテーションを使用すると、DSL コンテキストで外部スコープからのレシーバの使用を制限できます。
典型的な[HTML ビルダーの例](type-safe-builders.md)を考えてみましょう。

```kotlin
table {
    tr {
        td { + "Text" }
    }
}
```

Kotlin 1.0 では、`td` に渡されるラムダ内のコードは、`table`、`tr`、`td` に渡される3つの暗黙的なレシーバにアクセスできました。これにより、コンテキストでは意味のないメソッドを呼び出すことが可能でした。たとえば、`td` の内部で `tr` を呼び出し、`<td>` タグの中に `<tr>` タグを配置してしまうようなケースです。

Kotlin 1.1 では、これを制限できます。これにより、`td` に渡されるラムダ内では、`td` の暗黙的なレシーバに定義されたメソッドのみが利用可能になります。これは、`@DslMarker` メタアノテーションでマークされた独自のアノテーションを定義し、それをタグクラスの基底クラスに適用することで実現します。

詳細については、[タイプセーフビルダーに関するドキュメント](type-safe-builders.md)と [KEEP](https://github.com/Kotlin/KEEP/blob/master/proposals/scope-control-for-implicit-receivers.md) を参照してください。

### rem 演算子 (rem operator)

`mod` 演算子は非推奨となり、代わりに `rem` が使用されるようになりました。動機については、[このイシュー](https://youtrack.jetbrains.com/issue/KT-14650)を参照してください。

## 標準ライブラリ

### 文字列から数値への変換 (String to number conversions)

`String` クラスには、無効な数値で例外をスローせずに数値に変換するための新しい拡張関数が多数追加されました。
`String.toIntOrNull(): Int?`、`String.toDoubleOrNull(): Double?` などです。

```kotlin
val port = System.getenv("PORT")?.toIntOrNull() ?: 80
```

また、`Int.toString()`、`String.toInt()`、`String.toIntOrNull()` などの整数変換関数には、変換の基数 (2 から 36) を指定できる `radix` パラメータを持つオーバーロードが追加されました。

### onEach()

`onEach` は、コレクションやシーケンスのための小さくも便利な拡張関数で、一連の操作でコレクション/シーケンスの各要素に対して、副作用を伴う可能性のあるアクションを実行できます。
イテラブル (Iterable) では `forEach` のように動作しますが、さらにイテラブルインスタンス自体も返します。シーケンスでは、要素がイテレートされる際に指定されたアクションを遅延的に適用するラッパーシーケンスを返します。

```kotlin
inputDir.walk()
        .filter { it.isFile && it.name.endsWith(".txt") }
        .onEach { println("Moving $it to $outputDir") }
        .forEach { moveFile(it, File(outputDir, it.toRelativeString(inputDir))) }
```

### also()、takeIf()、および takeUnless()

これらは、任意のレシーバに適用できる3つの汎用拡張関数です。

`also` は `apply` に似ています。レシーバを受け取り、それに対して何らかのアクションを実行し、そのレシーバを返します。
違いは、`apply` 内のブロックではレシーバが `this` として利用できるのに対し、`also` 内のブロックでは `it` として利用できることです (必要に応じて別の名前を付けることもできます)。
これは、外部スコープからの `this` をシャドウしたくない場合に便利です。

```kotlin
class Block {
    lateinit var content: String
}

//sampleStart
fun Block.copy() = Block().also {
    it.content = this.content
}
//sampleEnd

// using 'apply' instead
fun Block.copy1() = Block().apply {
    this.content = this@copy1.content
}

fun main(args: Array<String>) {
    val block = Block().apply { content = "content" }
    val copy = block.copy()
    println("Testing the content was copied:")
    println(block.content == copy.content)
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

`takeIf` は単一値に対する `filter` のようなものです。レシーバが述語を満たすかどうかをチェックし、
満たす場合はレシーバを返し、満たさない場合は `null` を返します。
エルビス演算子 (`?:`) と早期リターンを組み合わせることで、次のような構文を記述できます。

```kotlin
val outDirFile = File(outputDir.path).takeIf { it.exists() } ?: return false
// do something with existing outDirFile
```

```kotlin
fun main(args: Array<String>) {
    val input = "Kotlin"
    val keyword = "in"

//sampleStart
    val index = input.indexOf(keyword).takeIf { it >= 0 } ?: error("keyword not found")
    // do something with index of keyword in input string, given that it's found
//sampleEnd
    
    println("'$keyword' was found in '$input'")
    println(input)
    println(" ".repeat(index) + "^")
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

`takeUnless` は `takeIf` と同じですが、述語が反転しています。述語を*満たさない*場合にレシーバを返し、それ以外の場合は `null` を返します。したがって、上記の例の1つは、`takeUnless` を使用して次のように書き換えることができます。

```kotlin
val index = input.indexOf(keyword).takeUnless { it < 0 } ?: error("keyword not found")
```

ラムダの代わりに呼び出し可能参照を使用する場合にも便利です。

```kotlin
private fun testTakeUnless(string: String) {
//sampleStart
    val result = string.takeUnless(String::isEmpty)
//sampleEnd

    println("string = \"$string\"; result = \"$result\"")
}

fun main(args: Array<String>) {
    testTakeUnless("")
    testTakeUnless("abc")
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

### groupingBy()

この API は、コレクションをキーでグループ化し、各グループを同時に集計するために使用できます。たとえば、各文字で始まる単語の数を数えるために使用できます。

```kotlin
fun main(args: Array<String>) {
    val words = "one two three four five six seven eight nine ten".split(' ')
//sampleStart
    val frequencies = words.groupingBy { it.first() }.eachCount()
//sampleEnd
    println("Counting first letters: $frequencies.")

    // The alternative way that uses 'groupBy' and 'mapValues' creates an intermediate map, 
    // while 'groupingBy' way counts on the fly.
    val groupBy = words.groupBy { it.first() }.mapValues { (_, list) -> list.size }
    println("Comparing the result with using 'groupBy': ${groupBy == frequencies}.")
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

### Map.toMap() および Map.toMutableMap()

これらの関数は、マップを簡単にコピーするために使用できます。

```kotlin
class ImmutablePropertyBag(map: Map<String, Any>) {
    private val mapCopy = map.toMap()
}
```

### Map.minus(key)

`plus` 演算子は、読み取り専用マップにキーと値のペアを追加して新しいマップを生成する方法を提供しますが、その逆、つまりマップからキーを削除する簡単な方法はありませんでした。
マップからキーを削除するには、`Map.filter()` や `Map.filterKeys()` のような、より単純ではない方法に頼る必要がありました。
これで、`minus` 演算子がこのギャップを埋めます。単一のキー、キーのコレクション、キーのシーケンス、キーの配列を削除するための4つのオーバーロードが利用可能です。

```kotlin
fun main(args: Array<String>) {
//sampleStart
    val map = mapOf("key" to 42)
    val emptyMap = map - "key"
//sampleEnd
    
    println("map: $map")
    println("emptyMap: $emptyMap")
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

### minOf() および maxOf()

これらの関数は、2つまたは3つの与えられた値（プリミティブ数値または`Comparable`オブジェクト）のうち、最小値と最大値を見つけるために使用できます。
比較可能ではないオブジェクトを比較したい場合は、追加の `Comparator` インスタンスを取る各関数のオーバーロードもあります。

```kotlin
fun main(args: Array<String>) {
//sampleStart
    val list1 = listOf("a", "b")
    val list2 = listOf("x", "y", "z")
    val minSize = minOf(list1.size, list2.size)
    val longestList = maxOf(list1, list2, compareBy { it.size })
//sampleEnd
    
    println("minSize = $minSize")
    println("longestList = $longestList")
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

### 配列ライクな List インスタンス化関数 (Array-like List instantiation functions)

`Array` コンストラクタと同様に、`List` および `MutableList` インスタンスを作成し、ラムダを呼び出すことで各要素を初期化する関数が追加されました。

```kotlin
fun main(args: Array<String>) {
//sampleStart
    val squares = List(10) { index -> index * index }
    val mutable = MutableList(10) { 0 }
//sampleEnd

    println("squares: $squares")
    println("mutable: $mutable")
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

### Map.getValue()

この `Map` の拡張は、指定されたキーに対応する既存の値を返します。該当するキーが見つからない場合は例外をスローし、どのキーが見つからなかったかを伝えます。
マップが `withDefault` で生成された場合、この関数は例外をスローする代わりにデフォルト値を返します。

```kotlin
fun main(args: Array<String>) {
//sampleStart    
    val map = mapOf("key" to 42)
    // returns non-nullable Int value 42
    val value: Int = map.getValue("key")

    val mapWithDefault = map.withDefault { k -> k.length }
    // returns 4
    val value2 = mapWithDefault.getValue("key2")

    // map.getValue("anotherKey") // <- this will throw NoSuchElementException
//sampleEnd
    
    println("value is $value")
    println("value2 is $value2")
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

### 抽象コレクション (Abstract collections)

これらの抽象クラスは、Kotlin のコレクションクラスを実装する際の基底クラスとして使用できます。
読み取り専用コレクションを実装するための `AbstractCollection`、`AbstractList`、`AbstractSet`、`AbstractMap` があり、
ミュータブルコレクションを実装するための `AbstractMutableCollection`、`AbstractMutableList`、`AbstractMutableSet`、`AbstractMutableMap` があります。
JVM 上では、これらの抽象ミュータブルコレクションは、ほとんどの機能を JDK の抽象コレクションから継承しています。

### 配列操作関数 (Array manipulation functions)

標準ライブラリには、配列に対する要素ごとの操作を行う一連の関数が提供されるようになりました。これには、比較
(`contentEquals` および `contentDeepEquals`)、ハッシュコードの計算 (`contentHashCode` および `contentDeepHashCode`)、
文字列への変換 (`contentToString` および `contentDeepToString`) が含まれます。これらは JVM
(ここで対応する `java.util.Arrays` の関数のエイリアスとして機能します) と JS (実装は Kotlin 標準ライブラリで提供されます) の両方でサポートされています。

```kotlin
fun main(args: Array<String>) {
//sampleStart
    val array = arrayOf("a", "b", "c")
    println(array.toString())  // JVM implementation: type-and-hash gibberish
    println(array.contentToString())  // nicely formatted as list
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

## JVM バックエンド

### Java 8 バイトコードのサポート (Java 8 bytecode support)

Kotlin は Java 8 バイトコードを生成するオプション (`-jvm-target 1.8` コマンドラインオプション、または Ant/Maven/Gradle の対応するオプション) を持つようになりました。
現時点では、これはバイトコードのセマンティクスを変更しません (特に、インターフェースのデフォルトメソッドやラムダは Kotlin 1.0 とまったく同じように生成されます) が、将来的にはこれをさらに活用する予定です。

### Java 8 標準ライブラリのサポート (Java 8 standard library support)

Java 7 および 8 で追加された新しい JDK API をサポートする標準ライブラリの個別のバージョンが利用可能になりました。
新しい API へのアクセスが必要な場合は、標準の `kotlin-stdlib` の代わりに `kotlin-stdlib-jre7` および `kotlin-stdlib-jre8` Maven アーティファクトを使用してください。
これらのアーティファクトは `kotlin-stdlib` の上に構築された小さな拡張であり、推移的な依存関係としてプロジェクトに取り込まれます。

### バイトコードにおけるパラメータ名 (Parameter names in the bytecode)

Kotlin はバイトコードにパラメータ名を格納するようになりました。これは `-java-parameters` コマンドラインオプションを使用して有効にできます。

### 定数のインライン化 (Constant inlining)

コンパイラは `const val` プロパティの値を、それらが使用される場所にインライン化するようになりました。

### 可変クロージャ変数 (Mutable closure variables)

ラムダで可変クロージャ変数をキャプチャするために使用されるボックスクラスは、もはや volatile フィールドを持ちません。この変更はパフォーマンスを向上させますが、まれな使用シナリオで新しい競合状態を引き起こす可能性があります。
これに影響を受ける場合は、変数へのアクセスに対して独自の同期を提供する必要があります。

### javax.script のサポート (javax.script support)

Kotlin は [javax.script API](https://docs.oracle.com/javase/8/docs/api/javax/script/package-summary.html) (JSR-223) と統合するようになりました。
この API を使用すると、実行時にコードスニペットを評価できます。

```kotlin
val engine = ScriptEngineManager().getEngineByExtension("kts")!!
engine.eval("val x = 3")
println(engine.eval("x + 2"))  // Prints out 5
```

この API を使用したより大きなプロジェクトの例は[こちら](https://github.com/JetBrains/kotlin/tree/1.1.0/libraries/examples/kotlin-jsr223-local-example)をご覧ください。

### kotlin.reflect.full

[Java 9 のサポート準備](https://blog.jetbrains.com/kotlin/2017/01/kotlin-1-1-whats-coming-in-the-standard-library/)のため、`kotlin-reflect.jar` ライブラリの拡張関数とプロパティは `kotlin.reflect.full` パッケージに移動されました。古いパッケージ (`kotlin.reflect`) の名前は非推奨となり、Kotlin 1.2 で削除される予定です。
ただし、コアリフレクションインターフェース (`KClass` など) は Kotlin 標準ライブラリの一部であり、`kotlin-reflect` には含まれていないため、この移動の影響を受けません。

## JavaScript バックエンド

### 統一された標準ライブラリ (Unified standard library)

Kotlin 標準ライブラリのより多くの部分が、JavaScript にコンパイルされたコードから使用できるようになりました。
特に、コレクション (`ArrayList`、`HashMap` など)、例外 (`IllegalArgumentException` など)、その他いくつかの重要なクラス (`StringBuilder`、`Comparator`) が `kotlin` パッケージの下で定義されるようになりました。
JVM 上では、これらの名前は対応する JDK クラスの型エイリアスであり、JS 上では、これらのクラスは Kotlin 標準ライブラリで実装されています。

### コード生成の改善 (Better code generation)

JavaScript バックエンドは、より静的にチェック可能なコードを生成するようになり、ミニファイア、オプティマイザ、リンターなどの JS コード処理ツールにとってより使いやすくなりました。

### external 修飾子 (The external modifier)

Kotlin から JavaScript で実装されたクラスに型安全な方法でアクセスする必要がある場合、`external` 修飾子を使用して Kotlin 宣言を記述できます。(Kotlin 1.0 では、代わりに `@native` アノテーションが使用されていました。)
JVM ターゲットとは異なり、JS ターゲットではクラスとプロパティで `external` 修飾子を使用できます。
例えば、DOM の `Node` クラスを宣言する方法を次に示します。

```kotlin
external class Node {
    val firstChild: Node

    fun appendChild(child: Node): Node

    fun removeChild(child: Node): Node

    // etc
}
```

### インポート処理の改善 (Improved import handling)

JavaScript モジュールからインポートすべき宣言をより正確に記述できるようになりました。
外部宣言に `@JsModule("<module-name>")` アノテーションを追加すると、コンパイル時にモジュールシステム (CommonJS または AMD) に適切にインポートされます。例えば、CommonJS の場合、宣言は `require(...)` 関数を介してインポートされます。
さらに、宣言をモジュールとして、またはグローバルな JavaScript オブジェクトとしてインポートしたい場合、`@JsNonModule` アノテーションを使用できます。

例えば、JQuery を Kotlin モジュールにインポートする方法は次のとおりです。

```kotlin
external interface JQuery {
    fun toggle(duration: Int = definedExternally): JQuery
    fun click(handler: (Event) -> Unit): JQuery
}

@JsModule("jquery")
@JsNonModule
@JsName("$")
external fun jquery(selector: String): JQuery
```

この場合、JQuery は `jquery` という名前のモジュールとしてインポートされます。あるいは、Kotlin コンパイラが使用するように設定されているモジュールシステムに応じて、`$` オブジェクトとして使用することもできます。

これらの宣言はアプリケーションで次のように使用できます。

```kotlin
fun main(args: Array<String>) {
    jquery(".toggle-button").click {
        jquery(".toggle-panel").toggle(300)
    }
}