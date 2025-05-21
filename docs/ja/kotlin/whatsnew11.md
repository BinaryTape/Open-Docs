---
title: "Kotlin 1.1の新機能"
---
_公開日: 2016年2月15日_

## 目次

* [コルーチン (試験的)](#coroutines-experimental)
* [その他の言語機能](#other-language-features)
* [標準ライブラリ](#standard-library)
* [JVM バックエンド](#jvm-backend)
* [JavaScript バックエンド](#javascript-backend)

## JavaScript

Kotlin 1.1 以降、JavaScript ターゲットは試験的とは見なされなくなりました。すべての言語機能がサポートされており、
フロントエンド開発環境との統合のための多くの新しいツールがあります。変更の詳細なリストについては、[下記](#javascript-backend)をご覧ください。

## コルーチン (試験的)

Kotlin 1.1 の主要な新機能は、`async`/`await`、`yield`、および同様のプログラミング
パターンをサポートする*コルーチン*です。Kotlin の設計の重要な特徴は、コルーチンの実行の実装がライブラリの一部であり、
言語の一部ではないため、特定のプログラミングパラダイムや並行処理ライブラリに縛られないことです。

コルーチンは、効果的には、中断され後で再開できる軽量スレッドです。
コルーチンは、_[中断関数](coroutines-basics#extract-function-refactoring)_を通じてサポートされています。
このような関数の呼び出しは、コルーチンを中断する可能性があり、新しいコルーチンを開始するには、通常、匿名の中断関数 (つまり、中断ラムダ) を使用します。

外部ライブラリである[kotlinx.coroutines](https://github.com/kotlin/kotlinx.coroutines)に実装されている`async`/`await`を見てみましょう。

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

ここで、`async { ... }` はコルーチンを開始し、`await()` を使用すると、待機中の操作が実行されている間、コルーチンの実行が中断され、待機中の操作が完了すると (おそらく別のスレッドで) 再開されます。

標準ライブラリは、`yield` および `yieldAll` 関数を使用して、*遅延生成シーケンス*をサポートするためにコルーチンを使用します。
このようなシーケンスでは、シーケンス要素を返すコードブロックは、各要素が取得された後で中断され、
次の要素が要求されたときに再開されます。次に例を示します。

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

上記のコードを実行して結果を確認してください。自由に編集して再度実行してください。

詳細については、[コルーチンのドキュメント](coroutines-overview)および[チュートリアル](coroutines-and-channels)を参照してください。

コルーチンは現在**試験的な機能**と見なされていることに注意してください。つまり、Kotlin チームは、最終的な 1.1 リリース後にこの機能の後方互換性をサポートすることを保証していません。

## その他の言語機能

### 型エイリアス

型エイリアスを使用すると、既存の型の別の名前を定義できます。
これは、コレクションなどのジェネリック型や、関数型に最も役立ちます。
次に例を示します。

```kotlin

typealias OscarWinners = Map<String, String>

fun countLaLaLand(oscarWinners: OscarWinners) =
        oscarWinners.count { it.value.contains("La La Land") }

// Note that the type names (initial and the type alias) are interchangeable:
fun checkLaLaLandIsTheBestMovie(oscarWinners: Map<String, String>) =
        oscarWinners["Best picture"] == "La La Land"

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

詳細については、[型エイリアスのドキュメント](type-aliases)および[KEEP](https://github.com/Kotlin/KEEP/blob/master/proposals/type-aliases)を参照してください。

### バインドされた呼び出し可能参照

`::` 演算子を使用して、特定のオブジェクトインスタンスのメソッドまたは
プロパティを指す[メンバー参照](reflection#function-references)を取得できるようになりました。以前は、これはラムダでしか表現できませんでした。
次に例を示します。

```kotlin

val numberRegex = "\\d+".toRegex()
val numbers = listOf("abc", "123", "456").filter(numberRegex::matches)

fun main(args: Array<String>) {
    println("Result is $numbers")
}
```

詳細については、[ドキュメント](reflection)および[KEEP](https://github.com/Kotlin/KEEP/blob/master/proposals/bound-callable-references)を参照してください。

### 封印されたクラスとデータクラス

Kotlin 1.1 では、Kotlin 1.0 に存在した封印されたクラスとデータクラスの制限の一部が削除されています。
トップレベルの封印されたクラスのサブクラスを、封印されたクラスのネストされたクラスとしてだけでなく、同じファイル内のトップレベルで定義できるようになりました。
データクラスは、他のクラスを拡張できるようになりました。
これは、式クラスの階層をきれいに定義するために使用できます。

```kotlin

sealed class Expr

data class Const(val number: Double) : Expr()
data class Sum(val e1: Expr, val e2: Expr) : Expr()
object NotANumber : Expr()

fun eval(expr: Expr): Double = when (expr) {
    is Const `->` expr.number
    is Sum `->` eval(expr.e1) + eval(expr.e2)
    NotANumber `->` Double.NaN
}
val e = eval(Sum(Const(1.0), Const(2.0)))

fun main(args: Array<String>) {
    println("e is $e") // 3.0
}
```

詳細については、[封印されたクラスのドキュメント](sealed-classes)または
[封印されたクラス](https://github.com/Kotlin/KEEP/blob/master/proposals/sealed-class-inheritance)および
[データクラス](https://github.com/Kotlin/KEEP/blob/master/proposals/data-class-inheritance)の KEEP を参照してください。

### ラムダの分解

[分解宣言](destructuring-declarations)構文を使用して、ラムダに渡される引数を展開できるようになりました。
次に例を示します。

```kotlin
fun main(args: Array<String>) {

    val map = mapOf(1 to "one", 2 to "two")
    // before
    println(map.mapValues { entry `->`
      val (key, value) = entry
      "$key `->` $value!"
    })
    // now
    println(map.mapValues { (key, value) `->` "$key `->` $value!" })

}
```

詳細については、[分解宣言のドキュメント](destructuring-declarations)および[KEEP](https://github.com/Kotlin/KEEP/blob/master/proposals/destructuring-in-parameters)を参照してください。

### 未使用のパラメーターのアンダースコア

複数のパラメーターを持つラムダの場合、使用しないパラメーターの名前を置き換えるために `_` 文字を使用できます。

```kotlin
fun main(args: Array<String>) {
    val map = mapOf(1 to "one", 2 to "two")

    map.forEach { _, value `->` println("$value!") }

}
```

これは[分解宣言](destructuring-declarations)でも機能します。

```kotlin
data class Result(val value: Any, val status: String)

fun getResult() = Result(42, "ok").also { println("getResult() returns $it") }

fun main(args: Array<String>) {

    val (_, status) = getResult()

    println("status is '$status'")
}
```

詳細については、[KEEP](https://github.com/Kotlin/KEEP/blob/master/proposals/underscore-for-unused-parameters)を参照してください。

### 数値リテラルのアンダースコア

Java 8 と同様に、Kotlin では、数値リテラルの数字のグループを区切るためにアンダースコアを使用できるようになりました。

```kotlin

val oneMillion = 1_000_000
val hexBytes = 0xFF_EC_DE_5E
val bytes = 0b11010010_01101001_10010100_10010010

fun main(args: Array<String>) {
    println(oneMillion)
    println(hexBytes.toString(16))
    println(bytes.toString(2))
}
```

詳細については、[KEEP](https://github.com/Kotlin/KEEP/blob/master/proposals/underscores-in-numeric-literals)を参照してください。

### プロパティのより短い構文

ゲッターが式本体として定義されているプロパティの場合、プロパティの型を省略できるようになりました。

```kotlin

    data class Person(val name: String, val age: Int) {
    val isAdult get() = age >= 20 // Property type inferred to be 'Boolean'
}

fun main(args: Array<String>) {
    val akari = Person("Akari", 26)
    println("$akari.isAdult = ${akari.isAdult}")
}
```

### インラインプロパティアクセサー

プロパティにバッキングフィールドがない場合、`inline` 修飾子でプロパティアクセサーをマークできるようになりました。
このようなアクセサーは、[インライン関数](inline-functions)と同じ方法でコンパイルされます。

```kotlin

public val <T> List<T>.lastIndex: Int
    inline get() = this.size - 1

fun main(args: Array<String>) {
    val list = listOf('a', 'b')
    // the getter will be inlined
    println("Last index of $list is ${list.lastIndex}")
}
```

プロパティ全体を `inline` としてマークすることもできます。その場合、修飾子は両方のアクセサーに適用されます。

詳細については、[インライン関数のドキュメント](inline-functions#inline-properties)および[KEEP](https://github.com/Kotlin/KEEP/blob/master/proposals/inline-properties)を参照してください。

### ローカル委譲プロパティ

[委譲プロパティ](delegated-properties)構文をローカル変数で使用できるようになりました。
考えられる使用法の 1 つは、遅延評価されるローカル変数を定義することです。

```kotlin
import java.util.Random

fun needAnswer() = Random().nextBoolean()

fun main(args: Array<String>) {

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

}
```

詳細については、[KEEP](https://github.com/Kotlin/KEEP/blob/master/proposals/local-delegated-properties)を参照してください。

### 委譲プロパティバインディングのインターセプト

[委譲プロパティ](delegated-properties)の場合、`provideDelegate` 演算子を使用して、デリゲートからプロパティへのバインディングをインターセプトできるようになりました。
たとえば、バインドする前にプロパティ名を確認する場合は、次のように記述できます。

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

`provideDelegate` メソッドは、`MyUI` インスタンスの作成中に各プロパティに対して呼び出され、必要な検証をすぐに行うことができます。

詳細については、[委譲プロパティのドキュメント](delegated-properties)を参照してください。

### ジェネリックenum値アクセス

enum クラスの値をジェネリックな方法で列挙できるようになりました。

```kotlin

enum class RGB { RED, GREEN, BLUE }

inline fun <reified T : Enum<T>> printAllValues() {
    print(enumValues<T>().joinToString { it.name })
}

fun main(args: Array<String>) {
    printAllValues<RGB>() // prints RED, GREEN, BLUE
}
```

### DSL の暗黙的なレシーバーのスコープ制御

[`@DslMarker`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-dsl-marker/index.html) アノテーションを使用すると、DSL コンテキストで外側のスコープからのレシーバーの使用を制限できます。
標準的な[HTML ビルダーの例](type-safe-builders)を考えてみましょう。

```kotlin
table {
    tr {
        td { + "Text" }
    }
}
```

Kotlin 1.0 では、`td` に渡されるラムダ内のコードは、`table`、`tr`、
および `td` に渡される 3 つの暗黙的なレシーバーにアクセスできます。これにより、コンテキストでは意味のないメソッドを呼び出すことができます。たとえば、`td` 内で `tr` を呼び出し、`<td>` に `<tr>` タグを配置するなどです。

Kotlin 1.1 では、`td` の暗黙的なレシーバーで定義されたメソッドのみが
`td` に渡されるラムダ内で利用できるように、それを制限できます。`@DslMarker` メタアノテーションでマークされたアノテーションを定義し、タグクラスの基本クラスに適用することで、それを行うことができます。

詳細については、[タイプセーフビルダーのドキュメント](type-safe-builders)および[KEEP](https://github.com/Kotlin/KEEP/blob/master/proposals/scope-control-for-implicit-receivers)を参照してください。

### rem 演算子

`mod` 演算子は非推奨になり、代わりに `rem` が使用されます。動機については、[この問題](https://youtrack.jetbrains.com/issue/KT-14650)を参照してください。

## 標準ライブラリ

### 文字列から数値への変換

無効な数値で例外をスローせずに文字列を数値に変換するための、String クラスの新しい拡張機能が多数あります。
`String.toIntOrNull(): Int?`、`String.toDoubleOrNull(): Double?` など。

```kotlin
val port = System.getenv("PORT")?.toIntOrNull() ?: 80
```

また、`Int.toString()`、`String.toInt()`、`String.toIntOrNull()` などの整数変換関数には、それぞれ `radix` パラメーターを持つオーバーロードがあり、変換の基数 (2 ～ 36) を指定できます。

### onEach()

`onEach` は、コレクションとシーケンス用の小さくても便利な拡張関数で、操作チェーンでコレクション/シーケンスの各要素に対して、おそらく副作用を伴うアクションを実行できます。
イテラブルでは、`forEach` と同様に動作しますが、さらにイテラブルインスタンスも返します。そして、シーケンスでは、要素が反復されるときに、指定されたアクションを遅延的に適用するラッピングシーケンスを返します。

```kotlin
inputDir.walk()
        .filter { it.isFile && it.name.endsWith(".txt") }
        .onEach { println("Moving $it to $outputDir") }
        .forEach { moveFile(it, File(outputDir, it.toRelativeString(inputDir))) }
```

### also()、takeIf()、および takeUnless()

これらは、任意のレシーバーに適用できる 3 つの汎用拡張関数です。

`also` は `apply` に似ています。レシーバーを取得し、それに対して何らかのアクションを実行し、そのレシーバーを返します。
違いは、`apply` 内のブロックでは、レシーバーが `this` として利用できるのに対し、
`also` 内のブロックでは、レシーバーが `it` として利用できる (必要に応じて別の名前を付けることもできます) ことです。
これは、外側のスコープから `this` をシャドウしたくない場合に便利です。

```kotlin
class Block {
    lateinit var content: String
}

fun Block.copy() = Block().also {
    it.content = this.content
}

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

`takeIf` は、単一の値の `filter` に似ています。レシーバーが述語を満たしているかどうかを確認し、満たしている場合はレシーバーを返し、満たしていない場合は `null` を返します。
エルビス演算子 (?:) および早期リターンと組み合わせると、次のような構造を記述できます。

```kotlin
val outDirFile = File(outputDir.path).takeIf { it.exists() } ?: return false
// do something with existing outDirFile
```

```kotlin
fun main(args: Array<String>) {
    val input = "Kotlin"
    val keyword = "in"

    val index = input.indexOf(keyword).takeIf { it >= 0 } ?: error("keyword not found")
    // do something with index of keyword in input string, given that it's found

    println("'$keyword' was found in '$input'")
    println(input)
    println(" ".repeat(index) + "^")
}
```

`takeUnless` は `takeIf` と同じですが、反転された述語を取得します。述語を _満たしていない_ 場合にレシーバーを返し、それ以外の場合は `null` を返します。したがって、上記の例の 1 つは、`takeUnless` を使用して次のように書き換えることができます。

```kotlin
val index = input.indexOf(keyword).takeUnless { it < 0 } ?: error("keyword not found")
```

ラムダの代わりに呼び出し可能参照がある場合にも便利です。

```kotlin
private fun testTakeUnless(string: String) {

    val result = string.takeUnless(String::isEmpty)

    println("string = \"$string\"; result = \"$result\"")
}

fun main(args: Array<String>) {
    testTakeUnless("")
    testTakeUnless("abc")
}
```

### groupingBy()

この API を使用すると、コレクションをキーでグループ化し、各グループを同時にフォールドできます。たとえば、各文字で始まる単語の数をカウントするために使用できます。

```kotlin
fun main(args: Array<String>) {
    val words = "one two three four five six seven eight nine ten".split(' ')

    val frequencies = words.groupingBy { it.first() }.eachCount()

    println("Counting first letters: $frequencies.")

    // The alternative way that uses 'groupBy' and 'mapValues' creates an intermediate map, 
    // while 'groupingBy' way counts on the fly.
    val groupBy = words.groupBy { it.first() }.mapValues { (_, list) `->` list.size }
    println("Comparing the result with using 'groupBy': ${groupBy == frequencies}.")
}
```

### Map.toMap() および Map.toMutableMap()

これらの関数は、マップを簡単にコピーするために使用できます。

```kotlin
class ImmutablePropertyBag(map: Map<String, Any>) {
    private val mapCopy = map.toMap()
}
```

### Map.minus(key)

`plus` 演算子は、キーと値のペアを読み取り専用マップに追加して新しいマップを生成する方法を提供しますが、
反対のことを行う簡単な方法はありませんでした。マップからキーを削除するには、`Map.filter()` や `Map.filterKeys()` のような、それほど単純でない方法に頼る必要がありました。
現在、`minus` 演算子はこのギャップを埋めています。単一のキー、キーのコレクション、
キーのシーケンス、およびキーの配列を削除するために、4 つのオーバーロードが利用可能です。

```kotlin
fun main(args: Array<String>) {

    val map = mapOf("key" to 42)
    val emptyMap = map - "key"

    println("map: $map")
    println("emptyMap: $emptyMap")
}
```

### minOf() および maxOf()

これらの関数は、2 つまたは 3 つの指定された値 (値はプリミティブ数値または `Comparable` オブジェクト) のうち、最小および最大の値を検索するために使用できます。
オブジェクト自体を比較できない場合にオブジェクトを比較するために、追加の `Comparator` インスタンスを受け取る各関数のオーバーロードもあります。

```kotlin
fun main(args: Array<String>) {

    val list1 = listOf("a", "b")
    val list2 = listOf("x", "y", "z")
    val minSize = minOf(list1.size, list2.size)
    val longestList = maxOf(list1, list2, compareBy { it.size })

    println("minSize = $minSize")
    println("longestList = $longestList")
}
```

### 配列のようなリストのインスタンス化関数

`Array` コンストラクターと同様に、`List` および `MutableList` インスタンスを作成し、
ラムダを呼び出して各要素を初期化する関数が追加されました。

```kotlin
fun main(args: Array<String>) {

    val squares = List(10) { index `->` index * index }
    val mutable = MutableList(10) { 0 }

    println("squares: $squares")
    println("mutable: $mutable")
}
```

### Map.getValue()

この `Map` の拡張機能は、指定されたキーに対応する既存の値を返すか、どのキーが見つからなかったかを言及する例外をスローします。
マップが `withDefault` で生成された場合、この関数は例外をスローする代わりにデフォルト値を返します。

```kotlin
fun main(args: Array<String>) {

    val map = mapOf("key" to 42)
    // returns non-nullable Int value 42
    val value: Int = map.getValue("key")

    val mapWithDefault = map.withDefault { k `->` k.length }
    // returns 4
    val value2 = mapWithDefault.getValue("key2")

    // map.getValue("anotherKey") // `<-` this will throw NoSuchElementException

    println("value is $value")
    println("value2 is $value2")
}
```

### 抽象コレクション

これらの抽象クラスは、Kotlin コレクションクラスを実装する際の基本クラスとして使用できます。
読み取り専用コレクションを実装するために、`AbstractCollection`、`AbstractList`、`AbstractSet` および `AbstractMap` があり、
可変コレクションには、`AbstractMutableCollection`、`AbstractMutableList`、`AbstractMutableSet` および `AbstractMutableMap` があります。
JVM では、これらの抽象的な可変コレクションは、JDK の抽象コレクションからその機能のほとんどを継承します。

### 配列操作関数

標準ライブラリは、配列に対する要素ごとの操作のセットを提供するようになりました。比較
(`contentEquals` および `contentDeepEquals`)、ハッシュコード計算 (`contentHashCode` および `contentDeepHashCode`)、
および文字列への変換 (`contentToString` および `contentDeepToString`)。これらは、JVM の両方でサポートされています
(この関数は `java.util.Arrays` の対応する関数のエイリアスとして機能します) および JS (実装
は Kotlin 標準ライブラリで提供されます)。

```kotlin
fun main(args: Array<String>) {

    val array = arrayOf("a", "b", "c")
    println(array.toString())  // JVM implementation: type-and-hash gibberish
    println(array.contentToString())  // nicely formatted as list

}
```

## JVM バックエンド

### Java 8 バイトコードのサポート

Kotlin には、Java 8 バイトコードを生成するオプション (`-jvm-target 1.8` コマンドラインオプション、または Ant/Maven/Gradle の対応するオプション) があります。
今のところ、これはバイトコードのセマンティクスを変更しません (特に、インターフェイスのデフォルトメソッドとラムダは Kotlin 1.0 とまったく同じように生成されます) が、後でこれをさらに活用する予定です。

### Java 8 標準ライブラリのサポート

Java 7 および 8 で追加された新しい JDK API をサポートする標準ライブラリの個別のバージョンが追加されました。
新しい API へのアクセスが必要な場合は、標準の `kotlin-stdlib` の代わりに `kotlin-stdlib-jre7` および `kotlin-stdlib-jre8` maven アーティファクトを使用してください。
これらのアーティファクトは `kotlin-stdlib` の上に構築された小さな拡張機能であり、推移的な依存関係としてプロジェクトにもたらします。

### バイトコード内のパラメーター名

Kotlin は、バイトコードにパラメーター名を格納することをサポートするようになりました。これは、`-java-parameters` コマンドラインオプションを使用して有効にできます。

### 定数インライン化

コンパイラーは、`const val` プロパティの値を、それらが使用される場所にインライン化するようになりました。

### 可変クロージャ変数

ラムダで可変クロージャ変数をキャプチャするために使用されるボックスクラスには、volatile フィールドがなくなりました。この変更によりパフォーマンスが向上しますが、まれな使用シナリオでは新しい競合状態が発生する可能性があります。
この影響を受ける場合は、変数にアクセスするための独自の同期を提供する必要があります。

### javax.script のサポート

Kotlin は [javax.script API](https://docs.oracle.com/javase/8/docs/api/javax/script/package-summary.html) (JSR-223) と統合されました。
API を使用すると、実行時にコードスニペットを評価できます。

```kotlin
val engine = ScriptEngineManager().getEngineByExtension("kts")!!
engine.eval("val x = 3")
println(engine.eval("x + 2"))  // Prints out 5
```

API を使用したより大きなサンプルプロジェクトについては、[こちら](https://github.com/JetBrains/kotlin/tree/1.1.0/libraries/examples/kotlin-jsr223-local-example)を参照してください。

### kotlin.reflect.full

[Java 9 のサポートに備える](https://blog.jetbrains.com/kotlin/2017/01/kotlin-1-1-whats-coming-in-the-standard-library/)ために、`kotlin-reflect.jar` ライブラリの拡張関数とプロパティは、
パッケージ `kotlin.reflect.full` に移動されました。古いパッケージ (`kotlin.reflect`) の名前は非推奨になり、
Kotlin 1.2 で削除されます。`KClass` などのコアリフレクションインターフェイスは、Kotlin 標準ライブラリの一部であり、
`kotlin-reflect` ではないことに注意してください。また、この移動の影響を受けません。

## JavaScript バックエンド

### 統合標準ライブラリ

JavaScript にコンパイルされたコードから、Kotlin 標準ライブラリのはるかに大きな部分を使用できるようになりました。
特に、コレクション (`ArrayList`、`HashMap` など)、例外 (`IllegalArgumentException` など) などのキーとなるクラスと、
いくつかのその他 (`StringBuilder`、`Comparator`) は、`kotlin` パッケージで定義されるようになりました。JVM では、名前は型
対応する JDK クラスのエイリアスであり、JS では、クラスは Kotlin 標準ライブラリで実装されています。

### より優れたコード生成

JavaScript バックエンドは、より静的にチェック可能なコードを生成するようになり、
ミニファイア、オプティマイザー、リンターなどの JS コード処理ツールに適しています。

### external 修飾子

JavaScript で実装されたクラスに Kotlin からタイプセーフな方法でアクセスする必要がある場合は、
`external` 修飾子を使用して Kotlin 宣言を記述できます (Kotlin 1.0 では、代わりに `@native` アノテーションが使用されていました)。
JVM ターゲットとは異なり、JS ターゲットでは、クラスおよびプロパティで external 修飾子を使用できます。
たとえば、DOM `Node` クラスを宣言する方法を次に示します。

```kotlin
external class Node {
    val firstChild: Node

    fun appendChild(child: Node): Node

    fun removeChild(child: Node): Node

    // etc
}
```

### インポート処理の改善

JavaScript モジュールからインポートする必要がある宣言をより正確に記述できるようになりました。
external 宣言に `@JsModule("<module-name>")` アノテーションを追加すると、コンパイル中に (CommonJS または AMD のいずれかの) モジュールシステムに適切にインポートされます。
たとえば、CommonJS では、宣言は `require(...)` 関数を介してインポートされます。
さらに、宣言をモジュールまたはグローバル JavaScript オブジェクトとしてインポートする場合は、
`@JsNonModule` アノテーションを使用できます。

たとえば、JQuery を Kotlin モジュールにインポートする方法を次に示します。

```kotlin
external interface JQuery {
    fun toggle(duration: Int = definedExternally): JQuery
    fun click(handler: (Event) `->` Unit): JQuery
}

@JsModule("jquery")
@JsNonModule
@JsName("$")
external fun jquery(selector: String): JQuery
```

この場合、JQuery は `jquery` という名前のモジュールとしてインポートされます。または、Kotlin コンパイラーが使用するように構成されているモジュールシステムに応じて、$-オブジェクトとして使用できます。

これらの宣言は、アプリケーションで次のように使用できます。

```kotlin
fun main(args: Array<String>) {
    jquery(".toggle-button").click {
        jquery(".toggle-panel").toggle(300)
    }
}
```