[//]: # (title: Kotlin 1.2の新機能)

_リリース日: 2017年11月28日_

## 目次

* [マルチプラットフォームプロジェクト](#multiplatform-projects-experimental)
* [その他の言語機能](#other-language-features)
* [標準ライブラリ](#standard-library)
* [JVMバックエンド](#jvm-backend)
* [JavaScriptバックエンド](#javascript-backend)

## マルチプラットフォームプロジェクト (実験的機能)

マルチプラットフォームプロジェクトはKotlin 1.2で導入された新しい**実験的機能**であり、Kotlinがサポートするターゲットプラットフォーム（JVM、JavaScript、そして（将来的には）Native）間でコードを再利用できます。マルチプラットフォームプロジェクトでは、3種類のモジュールがあります。

*   *共通 (common)* モジュールには、どのプラットフォームにも固有ではないコード、およびプラットフォーム依存APIの実装を持たない宣言が含まれます。
*   *プラットフォーム (platform)* モジュールには、特定のプラットフォームに対する共通モジュール内のプラットフォーム依存宣言の実装、およびその他のプラットフォーム依存コードが含まれます。
*   *通常 (regular)* モジュールは特定のプラットフォームをターゲットとし、プラットフォームモジュールの依存関係になることも、プラットフォームモジュールに依存することもできます。

特定のプラットフォーム向けにマルチプラットフォームプロジェクトをコンパイルすると、共通部分とプラットフォーム固有部分の両方のコードが生成されます。

マルチプラットフォームプロジェクトサポートの主要な機能は、*expected*（期待される）宣言と*actual*（実際の）宣言を通じて、共通コードからプラットフォーム固有部分への依存関係を表現できることです。*expected* 宣言はAPI（クラス、インターフェース、アノテーション、トップレベル宣言など）を指定します。*actual* 宣言は、そのAPIのプラットフォーム依存の実装であるか、または外部ライブラリの既存のAPI実装を参照する型エイリアスです。以下に例を示します。

共通コードの場合:

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

JVMプラットフォームコードの場合:

```kotlin
actual fun hello(world: String): String =
    "Hello, $world, on the JVM platform!"

// using existing platform-specific implementation:
actual typealias URL = java.net.URL
```

詳細およびマルチプラットフォームプロジェクトの構築手順については、[マルチプラットフォームプログラミングのドキュメント](https://kotlinlang.org/docs/multiplatform/get-started.html)を参照してください。

## その他の言語機能

### アノテーションにおける配列リテラル

Kotlin 1.2以降、アノテーションの配列引数は、`arrayOf` 関数ではなく、新しい配列リテラル構文で渡せるようになりました。

```kotlin
@CacheConfig(cacheNames = ["books", "default"])
public class BookRepositoryImpl {
    // ...
}
```

配列リテラル構文は、アノテーション引数に限定されます。

### lateinit トップレベルプロパティとローカル変数

`lateinit` 修飾子は、トップレベルプロパティとローカル変数で使用できるようになりました。後者は、例えば、あるオブジェクトのコンストラクタ引数として渡されるラムダが、後で定義する必要がある別のオブジェクトを参照する場合などに使用できます。

```kotlin
class Node<T>(val value: T, val next: () -> Node<T>)

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
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

### lateinit var が初期化されているかどうかの確認

`lateinit var` が初期化されているかどうかを、プロパティ参照に対して `isInitialized` を使用して確認できるようになりました。

```kotlin
class Foo {
    lateinit var lateinitVar: String

    fun initializationLogic() {
//sampleStart
        println("isInitialized before assignment: " + this::lateinitVar.isInitialized)
        lateinitVar = "value"
        println("isInitialized after assignment: " + this::lateinitVar.isInitialized)
//sampleEnd
    }
}

fun main(args: Array<String>) {
	Foo().initializationLogic()
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

### デフォルトの関数型パラメーターを持つインライン関数

インライン関数は、インライン化された関数型パラメーターにデフォルト値を持たせることが許可されるようになりました。

```kotlin
//sampleStart
inline fun <E> Iterable<E>.strings(transform: (E) -> String = { it.toString() }) =
    map { transform(it) }

val defaultStrings = listOf(1, 2, 3).strings()
val customStrings = listOf(1, 2, 3).strings { "($it)" } 
//sampleEnd

fun main(args: Array<String>) {
    println("defaultStrings = $defaultStrings")
    println("customStrings = $customStrings")
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

### 明示的なキャスト情報が型推論に使用される

Kotlinコンパイラは、型キャストからの情報を型推論で使用できるようになりました。型パラメーター `T` を返すジェネリックメソッドを呼び出し、その戻り値を特定の型 `Foo` にキャストする場合、コンパイラは、この呼び出しの `T` が型 `Foo` にバインドされる必要があることを理解します。

これはAndroid開発者にとって特に重要です。コンパイラがAndroid APIレベル26におけるジェネリックな `findViewById` 呼び出しを正しく解析できるようになったためです。

```kotlin
val button = findViewById(R.id.button) as Button
```

### スマートキャストの改善

変数がセーフコール式から代入され、nullチェックされる場合、スマートキャストはセーフコールレシーバーにも適用されるようになりました。

```kotlin
fun countFirst(s: Any): Int {
//sampleStart
    val firstChar = (s as? CharSequence)?.firstOrNull()
    if (firstChar != null)
    return s.count { it == firstChar } // s: Any is smart cast to CharSequence

    val firstItem = (s as? Iterable<*>)?.firstOrNull()
    if (firstItem != null)
    return s.count { it == firstItem } // s: Any is smart cast to Iterable<*>
//sampleEnd
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
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

また、ラムダ内のスマートキャストが、ラムダの前にのみ変更されるローカル変数に対しても許可されるようになりました。

```kotlin
fun main(args: Array<String>) {
//sampleStart
    val flag = args.size == 0
    var x: String? = null
    if (flag) x = "Yahoo!"

    run {
        if (x != null) {
            println(x.length) // x is smart cast to String
        }
    }
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

### `this::foo` の省略形としての `::foo` のサポート

`this` のメンバーへの束縛された呼び出し可能参照は、明示的なレシーバーなしで、`this::foo` の代わりに `::foo` と記述できるようになりました。これにより、外側のレシーバーのメンバーを参照するラムダ内での呼び出し可能参照の使用がより便利になります。

### 破壊的変更: tryブロック後の堅牢なスマートキャスト

以前、Kotlinは `try` ブロック内で行われた代入を、ブロック後のスマートキャストに使用していました。これは型安全性とnull安全性を損ない、実行時エラーにつながる可能性がありました。このリリースではこの問題を修正し、スマートキャストをより厳密にしましたが、そのようなスマートキャストに依存していた一部のコードが動作しなくなる可能性があります。

以前のスマートキャストの挙動に戻すには、フォールバックフラグ `-Xlegacy-smart-cast-after-try` をコンパイラ引数として渡してください。このフラグはKotlin 1.3で非推奨になります。

### 非推奨: `copy` をオーバーライドするデータクラス

すでに同じシグネチャを持つ `copy` 関数を持っていた型から派生したデータクラスの場合、データクラスのために生成された `copy` 実装はスーパータイプからのデフォルト値を使用し、直感に反する挙動につながるか、スーパータイプにデフォルトパラメーターがない場合、実行時に失敗しました。

`copy` の競合を引き起こす継承は、Kotlin 1.2で警告とともに非推奨になり、Kotlin 1.3ではエラーになります。

### 非推奨: enumエントリ内のネストされた型

enumエントリ内で、`inner class` ではないネストされた型を定義することは、初期化ロジックの問題のため非推奨になりました。これはKotlin 1.2では警告を発し、Kotlin 1.3ではエラーになります。

### 非推奨: varargに対する単一の名前付き引数

アノテーションにおける配列リテラルとの一貫性を保つため、`vararg` パラメーターに単一の項目を名前付き形式（`foo(items = i)`）で渡すことは非推奨になりました。対応する配列ファクトリ関数とともにスプレッド演算子を使用してください。

```kotlin
foo(items = *arrayOf(1))
```

このようなケースでは、冗長な配列作成を削除する最適化が施されており、パフォーマンス低下を防ぎます。単一引数形式はKotlin 1.2で警告を発し、Kotlin 1.3で削除される予定です。

### 非推奨: `Throwable` を継承するジェネリッククラスの内部クラス

`Throwable` を継承するジェネリック型の内部クラスは、throw-catchシナリオで型安全性を侵害する可能性があったため、非推奨になりました。Kotlin 1.2では警告、Kotlin 1.3ではエラーになります。

### 非推奨: 読み取り専用プロパティのバッキングフィールドのミューテーション

カスタムゲッターで `field = ...` を代入することによる読み取り専用プロパティのバッキングフィールドの変更は非推奨になりました。Kotlin 1.2では警告、Kotlin 1.3ではエラーになります。

## 標準ライブラリ

### Kotlin標準ライブラリアーティファクトと分割パッケージ

Kotlin標準ライブラリは、Java 9モジュールシステムと完全に互換性を持つようになりました。Java 9モジュールシステムは分割パッケージ（同じパッケージ内のクラスを宣言する複数のjarファイル）を禁止しています。これをサポートするために、新しいアーティファクト `kotlin-stdlib-jdk7` と `kotlin-stdlib-jdk8` が導入されました。これらは古い `kotlin-stdlib-jre7` および `kotlin-stdlib-jre8` を置き換えるものです。

新しいアーティファクトの宣言は、Kotlinの観点からは同じパッケージ名の下で可視ですが、Javaでは異なるパッケージ名になります。したがって、新しいアーティファクトに切り替えても、ソースコードの変更は不要です。

新しいモジュールシステムとの互換性を確保するために行われたもう1つの変更は、`kotlin-reflect` ライブラリから `kotlin.reflect` パッケージ内の非推奨の宣言を削除したことです。これらを使用していた場合は、Kotlin 1.1以降サポートされている `kotlin.reflect.full` パッケージ内の宣言を使用するように切り替える必要があります。

### windowed、chunked、zipWithNext

`Iterable<T>`、`Sequence<T>`、および `CharSequence` の新しい拡張が追加され、バッファリングやバッチ処理（`chunked`）、スライディングウィンドウおよび移動平均の計算（`windowed`）、連続するアイテムのペアの処理（`zipWithNext`）などのユースケースに対応します。

```kotlin
fun main(args: Array<String>) {
//sampleStart
    val items = (1..9).map { it * it }

    val chunkedIntoLists = items.chunked(4)
    val points3d = items.chunked(3) { (x, y, z) -> Triple(x, y, z) }
    val windowed = items.windowed(4)
    val slidingAverage = items.windowed(4) { it.average() }
    val pairwiseDifferences = items.zipWithNext { a, b -> b - a }
//sampleEnd

    println("items: $items
")

    println("chunked into lists: $chunkedIntoLists")
    println("3D points: $points3d")
    println("windowed by 4: $windowed")
    println("sliding average by 4: $slidingAverage")
    println("pairwise differences: $pairwiseDifferences")
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

### fill、replaceAll、shuffle/shuffled

リストを操作するための拡張関数のセットが追加されました。`MutableList` 用の `fill`、`replaceAll`、`shuffle`、および読み取り専用 `List` 用の `shuffled` です。

```kotlin
fun main(args: Array<String>) {
//sampleStart
    val items = (1..5).toMutableList()
    
    items.shuffle()
    println("Shuffled items: $items")
    
    items.replaceAll { it * 2 }
    println("Items doubled: $items")
    
    items.fill(5)
    println("Items filled with 5: $items")
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

### kotlin-stdlibにおける数学演算

長年の要望に応えて、Kotlin 1.2ではJVMとJSで共通の数学演算用の `kotlin.math` APIが追加され、以下のものが含まれます。

*   定数: `PI` および `E`
*   三角関数: `cos`、`sin`、`tan` とその逆関数: `acos`、`asin`、`atan`、`atan2`
*   双曲線関数: `cosh`、`sinh`、`tanh` とその逆関数: `acosh`、`asinh`、`atanh`
*   指数関数: `pow`（拡張関数）、`sqrt`、`hypot`、`exp`、`expm1`
*   対数関数: `log`、`log2`、`log10`、`ln`、`ln1p`
*   丸め処理:
    *   `ceil`、`floor`、`truncate`、`round`（最近接偶数への丸め）関数
    *   `roundToInt`、`roundToLong`（最近接整数への丸め）拡張関数
*   符号と絶対値:
    *   `abs` および `sign` 関数
    *   `absoluteValue` および `sign` 拡張プロパティ
    *   `withSign` 拡張関数
*   2つの値の `max` および `min`
*   二進数表現:
    *   `ulp` 拡張プロパティ
    *   `nextUp`、`nextDown`、`nextTowards` 拡張関数
    *   `toBits`、`toRawBits`、`Double.fromBits`（これらは `kotlin` パッケージにあります）

同じ関数セット（ただし定数を除く）は `Float` 引数でも利用可能です。

### BigIntegerおよびBigDecimalの演算子と変換

Kotlin 1.2では、`BigInteger` および `BigDecimal` の操作と、他の数値型からの生成のための関数セットを導入しました。これらは以下の通りです。

*   `Int` および `Long` 用の `toBigInteger`
*   `Int`、`Long`、`Float`、`Double`、および `BigInteger` 用の `toBigDecimal`
*   算術およびビット演算子関数:
    *   二項演算子 `+`、`-`、`*`、`/`、`%` および中置関数 `and`、`or`、`xor`、`shl`、`shr`
    *   単項演算子 `-`、`++`、`--`、および関数 `inv`

### 浮動小数点からビットへの変換

`Double` および `Float` をビット表現に、またはビット表現から変換するための新しい関数が追加されました。

*   `Double` 用に `Long` を、`Float` 用に `Int` を返す `toBits` および `toRawBits`
*   ビット表現から浮動小数点数を作成するための `Double.fromBits` および `Float.fromBits`

### Regexがシリアライズ可能に

`kotlin.text.Regex` クラスが `Serializable` になり、シリアライズ可能な階層で使用できるようになりました。

### `Closeable.use` は利用可能であれば `Throwable.addSuppressed` を呼び出す

`Closeable.use` 関数は、他の例外の後にリソースを閉じている最中に例外がスローされた場合、`Throwable.addSuppressed` を呼び出すようになりました。

この挙動を有効にするには、依存関係に `kotlin-stdlib-jdk7` が必要です。

## JVMバックエンド

### コンストラクタ呼び出しの正規化

バージョン1.0以来、Kotlinはtry-catch式やインライン関数呼び出しのような、複雑な制御フローを持つ式をサポートしてきました。そのようなコードはJava仮想マシン仕様によれば有効です。残念ながら、一部のバイトコード処理ツールでは、そのような式がコンストラクタ呼び出しの引数に存在する場合、うまく処理できません。

このようなバイトコード処理ツールのユーザーのためにこの問題を軽減するため、そのような構文に対してよりJavaライクなバイトコードを生成するようコンパイラに指示するコマンドラインコンパイラオプション（`-Xnormalize-constructor-calls=MODE`）を追加しました。ここで `MODE` は以下のいずれかです。

*   `disable`（デフォルト）– Kotlin 1.0および1.1と同様の方法でバイトコードを生成します。
*   `enable` – コンストラクタ呼び出しに対してJavaライクなバイトコードを生成します。これにより、クラスのロードと初期化の順序が変更される可能性があります。
*   `preserve-class-initialization` – コンストラクタ呼び出しに対してJavaライクなバイトコードを生成し、クラスの初期化順序が保持されるようにします。これはアプリケーション全体のパフォーマンスに影響を与える可能性があります。複数のクラス間で共有され、クラス初期化時に更新される複雑な状態がある場合にのみ使用してください。

「手動」での回避策は、制御フローを持つサブ式の値を、呼び出し引数内で直接評価する代わりに変数に格納することです。これは `-Xnormalize-constructor-calls=enable` と同様です。

### Javaデフォルトメソッドの呼び出し

Kotlin 1.2より前では、JVM 1.6をターゲットにしている間にJavaデフォルトメソッドをオーバーライドするインターフェースメンバーは、`super` 呼び出しで「`Super calls to Java default methods are deprecated in JVM target 1.6. Recompile with '-jvm-target 1.8'`」という警告を発していました。Kotlin 1.2では、代わりに**エラー**が発生するため、そのようなコードはJVMターゲット1.8でコンパイルする必要があります。

### 破壊的変更: プラットフォーム型に対する `x.equals(null)` の一貫した挙動

Javaプリミティブ（`Int!`, `Boolean!`, `Short!`, `Long!`, `Float!`, `Double!`, `Char!`）にマッピングされるプラットフォーム型に対して `x.equals(null)` を呼び出すと、`x` がnullの場合に誤って `true` を返していました。Kotlin 1.2以降、プラットフォーム型のnull値に対して `x.equals(...)` を呼び出すと**NPE（NullPointerException）がスローされます**（ただし、`x == ...` はスローしません）。

1.2より前の挙動に戻すには、コンパイラにフラグ `-Xno-exception-on-explicit-equals-for-boxed-null` を渡してください。

### 破壊的変更: インライン化された拡張レシーバーを介したプラットフォームnullのエスケープの修正

プラットフォーム型のnull値で呼び出されたインライン拡張関数は、レシーバーのnullチェックを行わず、その結果、nullが他のコードにエスケープすることを許容していました。Kotlin 1.2では、呼び出し箇所でこのチェックを強制し、レシーバーがnullの場合は例外をスローします。

以前の挙動に戻すには、コンパイラにフォールバックフラグ `-Xno-receiver-assertions` を渡してください。

## JavaScriptバックエンド

### TypedArrayサポートがデフォルトで有効に

Kotlinのプリミティブ配列（`IntArray`、`DoubleArray` など）を[JavaScriptのTypedArray](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Typed_arrays)に変換するJS TypedArrayサポートは、以前はオプトイン機能でしたが、デフォルトで有効になりました。

## ツール

### 警告をエラーとして扱う

コンパイラは、すべての警告をエラーとして扱うオプションを提供するようになりました。コマンドラインで `-Werror` を使用するか、以下のGradleスニペットを使用してください。

```groovy
compileKotlin {
    kotlinOptions.allWarningsAsErrors = true
}