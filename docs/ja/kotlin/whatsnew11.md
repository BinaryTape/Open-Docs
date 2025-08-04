[//]: # (title: Kotlin 1.1の新機能)

_リリース日: 2016年2月15日_

## 目次

*   [コルーチン (実験的機能)](#coroutines-experimental)
*   [その他の言語機能](#other-language-features)
*   [標準ライブラリ](#standard-library)
*   [JVMバックエンド](#jvm-backend)
*   [JavaScriptバックエンド](#javascript-backend)

## JavaScript

Kotlin 1.1から、JavaScriptターゲットはもはや実験的と見なされなくなりました。すべての言語機能がサポートされ、フロントエンド開発環境との統合のための多くの新しいツールが追加されています。変更点の詳細なリストについては、[以下](#javascript-backend)を参照してください。

## コルーチン (実験的機能)

Kotlin 1.1の主要な新機能は**コルーチン**であり、`async`/`await`、`yield`、および同様のプログラミングパターンをサポートします。Kotlinの設計における重要な特徴は、コルーチン実行の実装が言語の一部ではなく、ライブラリの一部であるため、特定のプログラミングパラダイムや並行処理ライブラリに縛られないことです。

コルーチンは実質的に、後で一時停止および再開できる軽量なスレッドです。
コルーチンは_[中断関数 (suspending functions)](coroutines-basics.md#extract-function-refactoring)_を通じてサポートされます。このような関数への呼び出しは、コルーチンを一時停止させる可能性があり、新しいコルーチンを開始するには通常、匿名の中断関数 (つまり、中断ラムダ) を使用します。

外部ライブラリである[kotlinx.coroutines](https://github.com/kotlin/kotlinx.coroutines)で実装されている`async`/`await`を見てみましょう。

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

ここでは、`async { ... }`がコルーチンを開始し、`await()`を使用すると、待機中の操作が実行されている間、コルーチンの実行が一時停止され、待機中の操作が完了すると (おそらく別のスレッドで) 再開されます。

標準ライブラリは、`yield`および`yieldAll`関数を使用して、*遅延生成されるシーケンス*をサポートするためにコルーチンを使用します。
このようなシーケンスでは、シーケンス要素を返すコードブロックは、各要素が取得された後に一時停止され、次の要素が要求されたときに再開されます。以下に例を示します。

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

上記コードを実行して結果を確認してください。自由に編集して再度実行できます！

詳細については、[コルーチンのドキュメント](coroutines-overview.md)と[チュートリアル](coroutines-and-channels.md)を参照してください。

コルーチンは現在、**実験的機能**と見なされていることに注意してください。これは、Kotlinチームが最終的な1.1リリース後もこの機能の後方互換性を保証するものではないことを意味します。

## その他の言語機能

### 型エイリアス

型エイリアスを使用すると、既存の型に対して代替名を定義できます。
これは、コレクションのようなジェネリック型や関数型にとって最も役立ちます。
例を次に示します。

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

詳細については、[型エイリアスのドキュメント](type-aliases.md)と[KEEP](https://github.com/Kotlin/KEEP/blob/master/proposals/type-aliases.md)を参照してください。

### 束縛可能な参照 (Bound callable references)

`::`演算子を使用して、特定のオブジェクトインスタンスのメソッドまたはプロパティを指す[メンバー参照 (member reference)](reflection.md#function-references)を取得できるようになりました。以前は、これはラムダでしか表現できませんでした。
例を次に示します。

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

詳細については、[ドキュメント](reflection.md)と[KEEP](https://github.com/Kotlin/KEEP/blob/master/proposals/bound-callable-references.md)を参照してください。

### SealedクラスとDataクラス

Kotlin 1.1では、Kotlin 1.0に存在したsealedクラスとdataクラスに対するいくつかの制限が削除されました。
現在、トップレベルのsealedクラスのサブクラスを、sealedクラスのネストされたクラスとしてだけでなく、同じファイルのトップレベルでも定義できるようになりました。
また、dataクラスは他のクラスを継承できるようになりました。
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

詳細については、[sealedクラスのドキュメント](sealed-classes.md)または[sealed class](https://github.com/Kotlin/KEEP/blob/master/proposals/sealed-class-inheritance.md)および[data class](https://github.com/Kotlin/KEEP/blob/master/proposals/data-class-inheritance.md)のKEEPsを参照してください。

### ラムダにおける分割宣言 (Destructuring)

[分割宣言 (destructuring declaration)](destructuring-declarations.md)構文を使用して、ラムダに渡された引数をアンパックできるようになりました。
例を次に示します。

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

詳細については、[分割宣言のドキュメント](destructuring-declarations.md)と[KEEP](https://github.com/Kotlin/KEEP/blob/master/proposals/destructuring-in-parameters.md)を参照してください。

### 未使用パラメータに対するアンダースコア

複数のパラメータを持つラムダの場合、使用しないパラメータの名前を`_`文字で置き換えることができます。

```kotlin
fun main(args: Array<String>) {
    val map = mapOf(1 to "one", 2 to "two")

//sampleStart
    map.forEach { _, value -> println("$value!") }
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

これは[分割宣言 (destructuring declarations)](destructuring-declarations.md)でも機能します。

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

詳細については、[KEEP](https://github.com/Kotlin/KEEP/blob/master/proposals/underscore-for-unused-parameters.md)を参照してください。

### 数値リテラルにおけるアンダースコア

Java 8と同様に、Kotlinでも数値リテラルでアンダースコアを使用して桁のグループを区切ることが可能になりました。

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

詳細については、[KEEP](https://github.com/Kotlin/KEEP/blob/master/proposals/underscores-in-numeric-literals.md)を参照してください。

### プロパティの短縮構文

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

### インラインプロパティアクセサー

プロパティにバッキングフィールドがない場合、プロパティアクセサーを`inline`修飾子でマークできるようになりました。
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

プロパティ全体を`inline`とマークすることもできます。その場合、修飾子は両方のアクセサーに適用されます。

詳細については、[インライン関数のドキュメント](inline-functions.md#inline-properties)と[KEEP](https://github.com/Kotlin/KEEP/blob/master/proposals/inline-properties.md)を参照してください。

### ローカル委譲プロパティ

[委譲プロパティ (delegated property)](delegated-properties.md)構文をローカル変数で使用できるようになりました。
考えられる用途の1つは、遅延評価されるローカル変数を定義することです。

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

詳細については、[KEEP](https://github.com/Kotlin/KEEP/blob/master/proposals/local-delegated-properties.md)を参照してください。

### 委譲プロパティバインディングのインターセプト

[委譲プロパティ (delegated properties)](delegated-properties.md)の場合、`provideDelegate`演算子を使用して、デリゲートからプロパティへのバインディングをインターセプトできるようになりました。
たとえば、バインディング前にプロパティ名をチェックしたい場合は、次のように記述できます。

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

`provideDelegate`メソッドは、`MyUI`インスタンスの作成中に各プロパティに対して呼び出され、必要な検証をすぐに実行できます。

詳細については、[委譲プロパティのドキュメント](delegated-properties.md)を参照してください。

### ジェネリックなEnum値へのアクセス

Enumクラスの値をジェネリックな方法で列挙できるようになりました。

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

### DSLにおける暗黙的レシーバーのスコープ制御

[`@DslMarker`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-dsl-marker/index.html)アノテーションを使用すると、DSLコンテキストで外側のスコープからのレシーバーの使用を制限できます。
典型的な[HTMLビルダーの例](type-safe-builders.md)を考えてみましょう。

```kotlin
table {
    tr {
        td { + "Text" }
    }
}
```

Kotlin 1.0では、`td`に渡されるラムダ内のコードは、`table`、`tr`、`td`に渡された3つの暗黙的なレシーバーにアクセスできました。これにより、コンテキストでは意味のないメソッドを呼び出すことが可能でした。たとえば、`td`内で`tr`を呼び出し、`<td>`内に`<tr>`タグを配置するようなことです。

Kotlin 1.1では、これを制限できます。これにより、`td`に渡されるラムダ内では、`td`の暗黙的なレシーバーで定義されたメソッドのみが利用可能になります。これを行うには、`@DslMarker`メタアノテーションでマークされた独自のアノテーションを定義し、それをタグクラスの基底クラスに適用します。

詳細については、[タイプセーフビルダーのドキュメント](type-safe-builders.md)と[KEEP](https://github.com/Kotlin/KEEP/blob/master/proposals/scope-control-for-implicit-receivers.md)を参照してください。

### rem演算子

`mod`演算子は非推奨となり、代わりに`rem`が使用されます。動機については、[このIssue](https://youtrack.jetbrains.com/issue/KT-14650)を参照してください。

## 標準ライブラリ

### 文字列から数値への変換

Stringクラスに、無効な数値に対して例外をスローせずに数値を変換するための新しい拡張機能がいくつか追加されました。
`String.toIntOrNull(): Int?`、`String.toDoubleOrNull(): Double?`などです。

```kotlin
val port = System.getenv("PORT")?.toIntOrNull() ?: 80
```

また、`Int.toString()`、`String.toInt()`、`String.toIntOrNull()`などの整数変換関数には、変換の基数（2から36）を指定できる`radix`パラメータを持つオーバーロードが追加されました。

### onEach()

`onEach`は、コレクションやシーケンスの小規模ながら便利な拡張関数で、一連の操作の中で各要素に対して何らかのアクション（副作用を伴う可能性あり）を実行できるようにします。
イテラブルでは`forEach`のように動作しますが、イテラブルインスタンスをさらに返します。シーケンスでは、ラッピングシーケンスを返し、要素がイテレートされるときに与えられたアクションを遅延的に適用します。

```kotlin
inputDir.walk()
        .filter { it.isFile && it.name.endsWith(".txt") }
        .onEach { println("Moving $it to $outputDir") }
        .forEach { moveFile(it, File(outputDir, it.toRelativeString(inputDir))) }
```

### also()、takeIf()、およびtakeUnless()

これらは、任意のレシーバーに適用できる3つの汎用拡張関数です。

`also`は`apply`に似ています。レシーバーを受け取り、それに対して何らかのアクションを実行し、そのレシーバーを返します。
違いは、`apply`内のブロックではレシーバーが`this`として利用できるのに対し、`also`内のブロックでは`it`として利用できる点です（必要に応じて別の名前を付けることもできます）。
これは、外側のスコープから`this`をシャドウしたくない場合に便利です。

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

`takeIf`は、単一の値に対する`filter`のようなものです。レシーバーが述語を満たすかどうかをチェックし、満たす場合はレシーバーを返し、満たさない場合は`null`を返します。
エルビス演算子（?:）と早期リターンと組み合わせることで、次のような構文を記述できます。

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

`takeUnless`は`takeIf`と同じですが、反転した述語を取ります。述語を満たさない場合にレシーバーを返し、それ以外の場合は`null`を返します。したがって、上記の例の1つは、`takeUnless`を使用して次のように書き直すことができます。

```kotlin
val index = input.indexOf(keyword).takeUnless { it < 0 } ?: error("keyword not found")
```

ラムダの代わりに呼び出し可能な参照がある場合にも便利です。

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

このAPIは、コレクションをキーでグループ化し、各グループを同時に畳み込むために使用できます。たとえば、各文字で始まる単語の数を数えるために使用できます。

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

`plus`演算子は、キーと値のペアを読み取り専用マップに追加して新しいマップを生成する方法を提供しますが、その逆を行う簡単な方法はありませんでした。マップからキーを削除するには、`Map.filter()`や`Map.filterKeys()`のようなあまり直接的でない方法に頼る必要がありました。
これで、`minus`演算子がこのギャップを埋めます。単一のキーを削除する場合、キーのコレクション、キーのシーケンス、キーの配列を削除する場合の4つのオーバーロードが利用可能です。

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

これらの関数は、2つまたは3つの指定された値（プリミティブな数値または`Comparable`オブジェクト）の中で最小値と最大値を見つけるために使用できます。また、それ自体が比較可能でないオブジェクトを比較したい場合は、追加の`Comparator`インスタンスを取るオーバーロードも各関数にあります。

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

### 配列ライクなListインスタンス化関数

`Array`コンストラクタと同様に、`List`および`MutableList`インスタンスを作成し、ラムダを呼び出すことで各要素を初期化する関数が追加されました。

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

この`Map`に対する拡張機能は、指定されたキーに対応する既存の値を返すか、どのキーが見つからなかったかを明記して例外をスローします。
マップが`withDefault`で生成された場合、この関数は例外をスローする代わりにデフォルト値を返します。

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

### 抽象コレクション

これらの抽象クラスは、Kotlinコレクションクラスを実装する際の基底クラスとして使用できます。
読み取り専用コレクションを実装するには、`AbstractCollection`、`AbstractList`、`AbstractSet`、`AbstractMap`があり、ミュータブルコレクションには`AbstractMutableCollection`、`AbstractMutableList`、`AbstractMutableSet`、`AbstractMutableMap`があります。
JVMでは、これらの抽象ミュータブルコレクションは、ほとんどの機能をJDKの抽象コレクションから継承します。

### 配列操作関数

標準ライブラリには、配列に対する要素ごとの操作を行う一連の関数が提供されています。比較（`contentEquals`および`contentDeepEquals`）、ハッシュコード計算（`contentHashCode`および`contentDeepHashCode`）、文字列への変換（`contentToString`および`contentDeepToString`）です。これらはJVM（`java.util.Arrays`の対応する関数のエイリアスとして機能）とJS（Kotlin標準ライブラリに実装が提供されています）の両方でサポートされています。

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

## JVMバックエンド

### Java 8バイトコードのサポート

KotlinはJava 8バイトコードを生成するオプション（コマンドラインオプション`-jvm-target 1.8`、またはAnt/Maven/Gradleの対応するオプション）を持つようになりました。現時点では、これによりバイトコードのセマンティクスは変更されませんが（特に、インターフェースのデフォルトメソッドとラムダはKotlin 1.0とまったく同じように生成されます）、後でこれをさらに活用する予定です。

### Java 8標準ライブラリのサポート

Java 7および8で追加された新しいJDK APIをサポートする標準ライブラリの別バージョンが利用可能になりました。
新しいAPIにアクセスする必要がある場合は、標準の`kotlin-stdlib`の代わりに`kotlin-stdlib-jre7`および`kotlin-stdlib-jre8` Mavenアーティファクトを使用してください。
これらのアーティファクトは`kotlin-stdlib`の小さな拡張であり、推移的な依存関係としてプロジェクトに取り込みます。

### バイトコードにおけるパラメータ名

Kotlinは、バイトコードにパラメータ名を保存することをサポートするようになりました。これは、コマンドラインオプション`-java-parameters`を使用して有効にできます。

### 定数のインライン化

コンパイラは、`const val`プロパティの値を、それらが使用される場所にインライン化するようになりました。

### ミュータブルなクロージャ変数

ラムダでミュータブルなクロージャ変数をキャプチャするために使用されるボックスクラスは、もはや`volatile`フィールドを持ちません。この変更はパフォーマンスを向上させますが、まれな使用シナリオでは新しい競合状態につながる可能性があります。これに影響を受ける場合は、変数アクセスに対して独自の同期を提供する必要があります。

### javax.scriptのサポート

Kotlinは[javax.script API](https://docs.oracle.com/javase/8/docs/api/javax/script/package-summary.html) (JSR-223) と統合するようになりました。
このAPIを使用すると、実行時にコードスニペットを評価できます。

```kotlin
val engine = ScriptEngineManager().getEngineByExtension("kts")!!
engine.eval("val x = 3")
println(engine.eval("x + 2"))  // Prints out 5
```

このAPIを使用したより大きな例のプロジェクトは[こちら](https://github.com/JetBrains/kotlin/tree/1.1.0/libraries/examples/kotlin-jsr223-local-example)を参照してください。

### kotlin.reflect.full

[Java 9のサポートに備える](https://blog.jetbrains.com/kotlin/2017/01/kotlin-1-1-whats-coming-in-the-standard-library/)ため、`kotlin-reflect.jar`ライブラリ内の拡張関数とプロパティは、`kotlin.reflect.full`パッケージに移動されました。古いパッケージ（`kotlin.reflect`）の名前は非推奨となり、Kotlin 1.2で削除されます。ただし、コアリフレクションインターフェース（`KClass`など）は`kotlin-reflect`ではなくKotlin標準ライブラリの一部であり、移動の影響を受けません。

## JavaScriptバックエンド

### 統合された標準ライブラリ

Kotlin標準ライブラリのより多くの部分が、JavaScriptにコンパイルされたコードから使用できるようになりました。
特に、コレクション（`ArrayList`、`HashMap`など）、例外（`IllegalArgumentException`など）、その他いくつかの主要なクラス（`StringBuilder`、`Comparator`）が`kotlin`パッケージの下で定義されるようになりました。JVMでは、これらの名前は対応するJDKクラスの型エイリアスであり、JSでは、これらのクラスはKotlin標準ライブラリに実装されています。

### より良いコード生成

JavaScriptバックエンドは、より静的にチェック可能なコードを生成するようになり、ミニファイア、オプティマイザ、リンターなどのJSコード処理ツールにより適しています。

### external修飾子

KotlinからJavaScriptで実装されたクラスに型安全な方法でアクセスする必要がある場合、`external`修飾子を使用してKotlin宣言を記述できます（Kotlin 1.0では、代わりに`@native`アノテーションが使用されていました）。
JVMターゲットとは異なり、JSターゲットではクラスとプロパティで`external`修飾子を使用することを許可します。
たとえば、DOM `Node`クラスを宣言する方法は次のとおりです。

```kotlin
external class Node {
    val firstChild: Node

    fun appendChild(child: Node): Node

    fun removeChild(child: Node): Node

    // etc
}
```

### インポート処理の改善

JavaScriptモジュールからインポートすべき宣言をより正確に記述できるようになりました。
外部宣言に`@JsModule("<module-name>")`アノテーションを追加すると、コンパイル中にモジュールシステム（CommonJSまたはAMDのいずれか）に適切にインポートされます。たとえば、CommonJSの場合、宣言は`require(...)`関数を介してインポートされます。
さらに、宣言をモジュールとして、またはグローバルJavaScriptオブジェクトとしてインポートしたい場合は、`@JsNonModule`アノテーションを使用できます。

たとえば、JQueryをKotlinモジュールにインポートする方法は次のとおりです。

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

この場合、JQueryは`jquery`という名前のモジュールとしてインポートされます。あるいは、Kotlinコンパイラが使用するように設定されているモジュールシステムに応じて、`-objectとして使用することもできます。

これらの宣言は、アプリケーションで次のように使用できます。

```kotlin
fun main(args: Array<String>) {
    jquery(".toggle-button").click {
        jquery(".toggle-panel").toggle(300)
    }
}
```