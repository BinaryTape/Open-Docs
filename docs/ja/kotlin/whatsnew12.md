---
title: "Kotlin 1.2の新機能"
---
_リリース日: 2017年11月28日_

## 目次

* [マルチプラットフォームプロジェクト](#multiplatform-projects-experimental)
* [その他の言語機能](#other-language-features)
* [標準ライブラリ](#standard-library)
* [JVM バックエンド](#jvm-backend)
* [JavaScript バックエンド](#javascript-backend)

## マルチプラットフォームプロジェクト (experimental)

マルチプラットフォームプロジェクトは Kotlin 1.2 の新しい**experimental**な機能で、Kotlin でサポートされているターゲットプラットフォーム (JVM、JavaScript、そして (将来的には) Native) 間でコードを再利用できます。マルチプラットフォームプロジェクトには、次の 3 種類のモジュールがあります。

* *common* モジュールには、特定のプラットフォームに固有ではないコードと、プラットフォームに依存する API の実装なしの宣言が含まれます。
* *platform* モジュールには、特定のプラットフォームの common モジュール内のプラットフォームに依存する宣言の実装と、その他のプラットフォームに依存するコードが含まれます。
* 通常のモジュールは、特定のプラットフォームをターゲットとし、プラットフォームモジュールの依存関係であるか、プラットフォームモジュールに依存する可能性があります。

特定のプラットフォーム用にマルチプラットフォームプロジェクトをコンパイルすると、共通部分とプラットフォーム固有部分の両方のコードが生成されます。

マルチプラットフォームプロジェクトのサポートの重要な機能は、*expected* 宣言と *actual* 宣言を通じて、共通コードのプラットフォーム固有部分への依存関係を表現できることです。*expected* 宣言は、API (クラス、インターフェース、アノテーション、トップレベル宣言など) を指定します。*actual* 宣言は、API のプラットフォームに依存する実装、または外部ライブラリ内の API の既存の実装を参照する型エイリアスです。次に例を示します。

共通コード内:

```kotlin
// expected platform-specific API:
expect fun hello(world: String): String

fun greet() {
    // usage of the expected API:
    val greeting = hello("multiplatform world")
    println(greeting)
}

expect class URL(spec: String) {
    open fun getHost(): String
    open fun getPath(): String
}
```

JVM プラットフォームコード内:

```kotlin
actual fun hello(world: String): String =
    "Hello, $world, on the JVM platform!"

// using existing platform-specific implementation:
actual typealias URL = java.net.URL
```

マルチプラットフォームプロジェクトの構築方法の詳細と手順については、[multiplatform programming documentation](multiplatform-intro) を参照してください。

## その他の言語機能

### アノテーション内の配列リテラル

Kotlin 1.2 以降では、アノテーションの配列引数は、`arrayOf` 関数ではなく、新しい配列リテラル構文で渡すことができます。

```kotlin
@CacheConfig(cacheNames = ["books", "default"])
public class BookRepositoryImpl {
    // ...
}
```

配列リテラル構文は、アノテーション引数に限定されています。

### Lateinit トップレベルプロパティとローカル変数

`lateinit` 修飾子は、トップレベルプロパティとローカル変数で使用できるようになりました。後者は、たとえば、あるオブジェクトのコンストラクタ引数として渡されたラムダが、後で定義する必要がある別のオブジェクトを参照する場合に使用できます。

```kotlin
class Node<T>(val value: T, val next: () `->` Node<T>)

fun main(args: Array<String>) {
    // A cycle of three nodes:
    lateinit var third: Node<Int>

    val second = Node(2, next = { third })
    val first = Node(1, next = { second })

    third = Node(3, next = { first })

    val nodes = generateSequence(first) { it.next() }
    println("Values in the cycle: ${nodes.take(7).joinToString { it.value.toString() }}, ...")
}
```

### lateinit var が初期化されているかどうかを確認する

プロパティ参照で `isInitialized` を使用して、lateinit var が初期化されているかどうかを確認できるようになりました。

```kotlin
class Foo {
    lateinit var lateinitVar: String

    fun initializationLogic() {

        println("isInitialized before assignment: " + this::lateinitVar.isInitialized)
        lateinitVar = "value"
        println("isInitialized after assignment: " + this::lateinitVar.isInitialized)

    }
}

fun main(args: Array<String>) {
	Foo().initializationLogic()
}
```

### デフォルトの関数型パラメータを持つインライン関数

インライン関数は、インライン関数型パラメータにデフォルト値を持つことができるようになりました。

```kotlin

inline fun <E> Iterable<E>.strings(transform: (E) `->` String = { it.toString() }) =
    map { transform(it) }

val defaultStrings = listOf(1, 2, 3).strings()
val customStrings = listOf(1, 2, 3).strings { "($it)" } 

fun main(args: Array<String>) {
    println("defaultStrings = $defaultStrings")
    println("customStrings = $customStrings")
}
```

### 明示的なキャストからの情報が型推論に使用される

Kotlin コンパイラは、型推論で型キャストからの情報を使用できるようになりました。型パラメータ `T` を返すジェネリックメソッドを呼び出し、戻り値を特定の型 `Foo` にキャストする場合、コンパイラは、この呼び出しの `T` を型 `Foo` にバインドする必要があることを理解します。

これは Android 開発者にとって特に重要です。コンパイラが Android API レベル 26 でジェネリック `findViewById` 呼び出しを正しく分析できるようになったためです。

```kotlin
val button = findViewById(R.id.button) as Button
```

### スマートキャストの改善

変数が安全な呼び出し式から割り当てられ、null がチェックされると、スマートキャストは安全な呼び出しのレシーバーにも適用されるようになりました。

```kotlin
fun countFirst(s: Any): Int {

    val firstChar = (s as? CharSequence)?.firstOrNull()
    if (firstChar != null)
    return s.count { it == firstChar } // s: Any is smart cast to CharSequence

    val firstItem = (s as? Iterable<*>)?.firstOrNull()
    if (firstItem != null)
    return s.count { it == firstItem } // s: Any is smart cast to Iterable<*>

    return -1
}

fun main(args: Array<String>) {
  val string = "abacaba"
  val countInString = countFirst(string)
  println("called on \"$string\": $countInString")

  val list = listOf(1, 2, 3, 1, 2)
  val countInList = countFirst(list)
  println("called on $list: $countInList")
}
```

また、ラムダ内のスマートキャストは、ラムダの前にのみ変更されるローカル変数に対して許可されるようになりました。

```kotlin
fun main(args: Array<String>) {

    val flag = args.size == 0
    var x: String? = null
    if (flag) x = "Yahoo!"

    run {
        if (x != null) {
            println(x.length) // x is smart cast to String
        }
    }

}
```

### `this::foo` の省略形としての `::foo` のサポート

`this` のメンバへのバウンド呼び出し可能参照は、明示的なレシーバーなしで記述できるようになりました。`this::foo` の代わりに `::foo` を使用します。これにより、外部レシーバーのメンバを参照するラムダで、呼び出し可能参照をより便利に使用できるようになります。

### 破壊的変更: try ブロック後の健全なスマートキャスト

以前は、Kotlin は `try` ブロック内で行われた代入をブロック後のスマートキャストに使用していましたが、これにより型安全性と null 安全性が損なわれ、ランタイムエラーが発生する可能性がありました。このリリースではこの問題が修正され、スマートキャストがより厳密になりましたが、そのようなスマートキャストに依存していた一部のコードが破損します。

古いスマートキャストの動作に切り替えるには、コンパイラ引数としてフォールバックフラグ `-Xlegacy-smart-cast-after-try` を渡します。これは Kotlin 1.3 で非推奨になります。

### 非推奨: データクラスの copy のオーバーライド

すでに同じシグネチャを持つ `copy` 関数を持つ型から派生したデータクラスの場合、データクラス用に生成された `copy` の実装は、スーパークラスからのデフォルトを使用するため、直感に反する動作になるか、スーパークラスにデフォルトパラメータがない場合、ランタイムで失敗します。

`copy` の競合につながる継承は、Kotlin 1.2 で警告とともに非推奨となり、Kotlin 1.3 でエラーになります。

### 非推奨: enum エントリ内のネストされた型

enum エントリ内で、`inner class` ではないネストされた型を定義すると、初期化ロジックの問題により非推奨になりました。これにより、Kotlin 1.2 で警告が発生し、Kotlin 1.3 でエラーになります。

### 非推奨: vararg の単一の名前付き引数

アノテーションの配列リテラルとの一貫性のため、名前付き形式 (`foo(items = i)`) で vararg パラメータに単一のアイテムを渡すことは非推奨になりました。対応する配列ファクトリ関数でスプレッド演算子を使用してください。

```kotlin
foo(items = *arrayOf(1))
```

このような場合に冗長な配列の作成を削除する最適化があり、パフォーマンスの低下を防ぎます。単一引数形式は、Kotlin 1.2 で警告を生成し、Kotlin 1.3 で削除されます。

### 非推奨: Throwable を拡張するジェネリッククラスのインナークラス

`Throwable` から継承するジェネリック型のインナークラスは、throw-catch シナリオで型安全性を侵害する可能性があるため、非推奨になりました。Kotlin 1.2 で警告が表示され、Kotlin 1.3 でエラーが表示されます。

### 非推奨: 読み取り専用プロパティのバッキングフィールドの変更

カスタムゲッターで `field = ...` を割り当てることによって、読み取り専用プロパティのバッキングフィールドを変更することは非推奨になりました。Kotlin 1.2 で警告が表示され、Kotlin 1.3 でエラーが表示されます。

## 標準ライブラリ

### Kotlin 標準ライブラリアーティファクトと分割パッケージ

Kotlin 標準ライブラリは、分割パッケージ (同じパッケージでクラスを宣言する複数の jar ファイル) を禁止する Java 9 モジュールシステムと完全に互換性があります。それをサポートするために、新しいアーティファクト `kotlin-stdlib-jdk7` と `kotlin-stdlib-jdk8` が導入され、古い `kotlin-stdlib-jre7` と `kotlin-stdlib-jre8` を置き換えます。

新しいアーティファクトの宣言は、Kotlin の観点からは同じパッケージ名で表示されますが、Java では異なるパッケージ名になります。したがって、新しいアーティファクトに切り替えても、ソースコードを変更する必要はありません。

新しいモジュールシステムとの互換性を確保するために行われたもう 1 つの変更は、`kotlin-reflect` ライブラリから `kotlin.reflect` パッケージの非推奨の宣言を削除することです。それらを使用していた場合は、Kotlin 1.1 以降でサポートされている `kotlin.reflect.full` パッケージの宣言を使用するように切り替える必要があります。

### windowed, chunked, zipWithNext

`Iterable<T>`, `Sequence<T>`, および `CharSequence` の新しい拡張機能は、バッファリングやバッチ処理 (`chunked`)、スライディングウィンドウとスライディング平均の計算 (`windowed`)、後続のアイテムのペアの処理 (`zipWithNext`) などのユースケースをカバーします。

```kotlin
fun main(args: Array<String>) {

    val items = (1..9).map { it * it }

    val chunkedIntoLists = items.chunked(4)
    val points3d = items.chunked(3) { (x, y, z) `->` Triple(x, y, z) }
    val windowed = items.windowed(4)
    val slidingAverage = items.windowed(4) { it.average() }
    val pairwiseDifferences = items.zipWithNext { a, b `->` b - a }

    println("items: $items
")

    println("chunked into lists: $chunkedIntoLists")
    println("3D points: $points3d")
    println("windowed by 4: $windowed")
    println("sliding average by 4: $slidingAverage")
    println("pairwise differences: $pairwiseDifferences")
}
```

### fill, replaceAll, shuffle/shuffled

リストを操作するための一連の拡張関数が追加されました。`MutableList` の場合は `fill`、`replaceAll`、`shuffle`、読み取り専用の `List` の場合は `shuffled` です。

```kotlin
fun main(args: Array<String>) {

    val items = (1..5).toMutableList()
    
    items.shuffle()
    println("Shuffled items: $items")
    
    items.replaceAll { it * 2 }
    println("Items doubled: $items")
    
    items.fill(5)
    println("Items filled with 5: $items")

}
```

### kotlin-stdlib の算術演算

長年のリクエストにお応えして、Kotlin 1.2 では、JVM と JS で共通する算術演算用の `kotlin.math` API が追加され、以下が含まれます。

* 定数: `PI` と `E`
* 三角関数: `cos`, `sin`, `tan` およびそれらの逆関数: `acos`, `asin`, `atan`, `atan2`
* 双曲線関数: `cosh`, `sinh`, `tanh` およびそれらの逆関数: `acosh`, `asinh`, `atanh`
* 指数関数: `pow` (拡張関数), `sqrt`, `hypot`, `exp`, `expm1`
* 対数: `log`, `log2`, `log10`, `ln`, `ln1p`
* 丸め:
    * `ceil`, `floor`, `truncate`, `round` (偶数への丸め) 関数
    * `roundToInt`, `roundToLong` (整数への丸め) 拡張関数
* 符号と絶対値:
    * `abs` および `sign` 関数
    * `absoluteValue` および `sign` 拡張プロパティ
    * `withSign` 拡張関数
* 2 つの値の `max` と `min`
* 2進数表現:
    * `ulp` 拡張プロパティ
    * `nextUp`, `nextDown`, `nextTowards` 拡張関数
    * `toBits`, `toRawBits`, `Double.fromBits` (これらは `kotlin` パッケージにあります)

同じ関数セット (ただし定数なし) は、`Float` 引数でも使用できます。

### BigInteger と BigDecimal の演算子と変換

Kotlin 1.2 では、`BigInteger` と `BigDecimal` を操作し、それらを他の数値型から作成するための一連の関数が導入されています。これらは次のとおりです。

* `Int` と `Long` の `toBigInteger`
* `Int`, `Long`, `Float`, `Double`, および `BigInteger` の `toBigDecimal`
* 算術演算子関数とビット演算子関数:
    * 2 項演算子 `+`, `-`, `*`, `/`, `%` および 中置関数 `and`, `or`, `xor`, `shl`, `shr`
    * 単項演算子 `-`, `++`, `--`、および関数 `inv`

### 浮動小数点数のビット変換

`Double` と `Float` をビット表現との間で変換するための新しい関数が追加されました。

* `Double` の場合は `Long`、`Float` の場合は `Int` を返す `toBits` と `toRawBits`
* ビット表現から浮動小数点数を作成するための `Double.fromBits` と `Float.fromBits`

### Regex がシリアライズ可能になりました

`kotlin.text.Regex` クラスは `Serializable` になり、シリアライズ可能な階層で使用できるようになりました。

### Closeable.use は Throwable.addSuppressed を利用可能であれば呼び出します

`Closeable.use` 関数は、他の例外の後にリソースを閉じるときに例外がスローされた場合、`Throwable.addSuppressed` を呼び出します。

この動作を有効にするには、依存関係に `kotlin-stdlib-jdk7` が必要です。

## JVM バックエンド

### コンストラクタ呼び出しの正規化

バージョン 1.0 以降、Kotlin は try-catch 式やインライン関数呼び出しなどの複雑な制御フローを持つ式をサポートしています。このようなコードは、Java Virtual Machine の仕様に従って有効です。残念ながら、一部のバイトコード処理ツールは、このような式がコンストラクタ呼び出しの引数に存在する場合、そのようなコードを適切に処理しません。

このようなバイトコード処理ツールのユーザーのために、コンパイラにコマンドラインオプション (`-Xnormalize-constructor-calls=MODE`) を追加しました。これにより、コンパイラは、このような構成に対してより Java のようなバイトコードを生成するように指示されます。ここで、`MODE` は次のいずれかです。

* `disable` (デフォルト) – Kotlin 1.0 および 1.1 と同じ方法でバイトコードを生成します。
* `enable` – コンストラクタ呼び出しに対して Java のようなバイトコードを生成します。これにより、クラスのロードと初期化の順序が変わる可能性があります。
* `preserve-class-initialization` – クラスの初期化順序が維持されるように、コンストラクタ呼び出しに対して Java のようなバイトコードを生成します。これは、アプリケーション全体のパフォーマンスに影響を与える可能性があります。複数のクラス間で共有され、クラスの初期化時に更新される複雑な状態がある場合にのみ使用してください。

「手動」による回避策は、制御フローを持つ部分式の値を変数に格納し、呼び出し引数内で直接評価する代わりに格納することです。これは `-Xnormalize-constructor-calls=enable` と似ています。

### Java デフォルトメソッドの呼び出し

Kotlin 1.2 より前は、JVM 1.6 をターゲットにしながら Java デフォルトメソッドをオーバーライドするインターフェースメンバは、スーパー呼び出しで警告を生成していました: `Super calls to Java default methods are deprecated in JVM target 1.6. Recompile with '-jvm-target 1.8'`. Kotlin 1.2 では、代わりに**エラー**が発生するため、そのようなコードは JVM ターゲット 1.8 でコンパイルする必要があります。

### 破壊的変更: プラットフォーム型に対する x.equals(null) の一貫した動作

Java プリミティブ (`Int!`, `Boolean!`, `Short`!, `Long!`, `Float!`, `Double!`, `Char!`) にマップされるプラットフォーム型で `x.equals(null)` を呼び出すと、`x` が null の場合、誤って `true` が返されました。Kotlin 1.2 以降では、プラットフォーム型の null 値で `x.equals(...)` を呼び出すと **NPE がスローされます** (ただし、`x == ...` はスローされません)。

1.2 より前の動作に戻すには、フラグ `-Xno-exception-on-explicit-equals-for-boxed-null` をコンパイラに渡します。

### 破壊的変更: インライン拡張レシーバーを介したプラットフォーム null エスケープの修正

プラットフォーム型の null 値で呼び出されたインライン拡張関数は、レシーバーの null をチェックせず、null が他のコードにエスケープすることを許可していました。Kotlin 1.2 では、呼び出しサイトでこのチェックが強制され、レシーバーが null の場合は例外がスローされます。

古い動作に切り替えるには、フォールバックフラグ `-Xno-receiver-assertions` をコンパイラに渡します。

## JavaScript バックエンド

### TypedArrays のサポートがデフォルトで有効になりました

`IntArray`、`DoubleArray` などの Kotlin プリミティブ配列を [JavaScript typed arrays](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Typed_arrays) に変換する JS typed arrays のサポートは、以前はオプトイン機能でしたが、デフォルトで有効になりました。

## ツール

### エラーとしての警告

コンパイラは、すべての警告をエラーとして扱うオプションを提供するようになりました。コマンドラインで `-Werror` を使用するか、次の Gradle スニペットを使用します。

```groovy
compileKotlin {
    kotlinOptions.allWarningsAsErrors = true
}