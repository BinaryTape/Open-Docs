[//]: # (title: Kotlin 1.2の新機能)

_リリース日: 2017年11月28日_

## 目次

* [マルチプラットフォームプロジェクト (実験的)](#multiplatform-projects-experimental)
* [その他の言語機能](#other-language-features)
* [標準ライブラリ](#standard-library)
* [JVMバックエンド](#jvm-backend)
* [JavaScriptバックエンド](#javascript-backend)

## マルチプラットフォームプロジェクト (実験的)

マルチプラットフォームプロジェクトは、Kotlin 1.2の新しい**実験的**な機能であり、Kotlinがサポートするターゲットプラットフォーム（JVM、JavaScript、そして将来のNative）間でコードを再利用できます。マルチプラットフォームプロジェクトでは、3種類のモジュールが存在します。

* *共通 (Common)* モジュールには、特定のプラットフォームに依存しないコードと、プラットフォームに依存するAPIの実装を持たない宣言が含まれます。
* *プラットフォーム (Platform)* モジュールには、共通モジュール内のプラットフォームに依存する宣言の、特定のプラットフォーム向けの実装と、その他のプラットフォームに依存するコードが含まれます。
* *通常 (Regular)* モジュールは特定のプラットフォームをターゲットとし、プラットフォームモジュールの依存関係になるか、またはプラットフォームモジュールに依存することができます。

マルチプラットフォームプロジェクトを特定のプラットフォーム向けにコンパイルすると、共通部分とプラットフォーム固有部分の両方のコードが生成されます。

マルチプラットフォームプロジェクトサポートの主要な機能は、*expect* 宣言と *actual* 宣言を介して、共通コードのプラットフォーム固有部分への依存関係を表現できることです。*expect* 宣言はAPI（クラス、インターフェース、アノテーション、トップレベル宣言など）を指定します。*actual* 宣言は、APIのプラットフォーム依存の実装、または外部ライブラリ内の既存のAPI実装を参照するタイプエイリアス (type alias) です。以下に例を示します。

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

JVMプラットフォームコード内:

```kotlin
actual fun hello(world: String): String =
    "Hello, $world, on the JVM platform!"

// using existing platform-specific implementation:
actual typealias URL = java.net.URL
```

詳細とマルチプラットフォームプロジェクトの構築手順については、[マルチプラットフォームプログラミングのドキュメント](https://www.jetbrains.com/help/kotlin-multiplatform-dev/get-started.html)を参照してください。

## その他の言語機能

### アノテーション内の配列リテラル

Kotlin 1.2以降、アノテーションの配列引数は、`arrayOf` 関数を使用する代わりに新しい配列リテラル構文で渡すことができます。

```kotlin
@CacheConfig(cacheNames = ["books", "default"])
public class BookRepositoryImpl {
    // ...
}
```

配列リテラル構文はアノテーション引数に限定されます。

### lateinitトップレベルプロパティとローカル変数

`lateinit` 修飾子がトップレベルプロパティとローカル変数に使えるようになりました。後者は、例えば、あるオブジェクトのコンストラクタ引数として渡されるラムダが、後で定義する必要がある別のオブジェクトを参照する場合に利用できます。

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

### lateinit varが初期化されているかどうかのチェック

プロパティ参照に対して `isInitialized` を使用して、lateinit varが初期化されているかどうかをチェックできるようになりました。

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

### デフォルト関数型パラメータを持つインライン関数

インライン関数で、インライン化される関数型パラメータにデフォルト値を持たせることができるようになりました。

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

### 明示的なキャストからの情報が型推論に利用される

Kotlinコンパイラは、型キャストからの情報を型推論に利用できるようになりました。型パラメータ `T` を返すジェネリックメソッドを呼び出し、戻り値を特定の型 `Foo` にキャストする場合、コンパイラはこの呼び出しに対して `T` が型 `Foo` にバインドされる必要があることを理解できるようになります。

これはAndroid開発者にとって特に重要であり、Android APIレベル26のジェネリックな `findViewById` 呼び出しをコンパイラが正しく分析できるようになります。

```kotlin
val button = findViewById(R.id.button) as Button
```

### スマートキャストの改善

変数がセーフコール式から代入され、nullチェックされると、セーフコールのレシーバにもスマートキャストが適用されるようになりました。

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

また、ラムダ内のスマートキャストが、ラムダより前に変更されたローカル変数に対して許可されるようになりました。

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

`this` のメンバへのバウンド呼び出し可能参照を、明示的なレシーバなしで `this::foo` の代わりに `::foo` と記述できるようになりました。これにより、外側のレシーバのメンバを参照するラムダでの呼び出し可能参照の使用がさらに便利になります。

### 破壊的変更: tryブロック後の堅牢なスマートキャスト

以前のKotlinでは、`try` ブロック内で行われた代入がブロック後のスマートキャストに利用され、型安全とnull安全性を損ない、実行時エラーにつながる可能性がありました。このリリースではこの問題が修正され、スマートキャストがより厳密になりましたが、このようなスマートキャストに依存していた一部のコードは動作が変更されます。

古いスマートキャストの動作に戻すには、コンパイラ引数としてフォールバックフラグ `-Xlegacy-smart-cast-after-try` を渡してください。これはKotlin 1.3で非推奨になります。

### 非推奨化: copyをオーバーライドするデータクラス

同じシグネチャの `copy` 関数をすでに持っていた型からデータクラスが派生した場合、データクラス用に生成された `copy` の実装がスーパークラスのデフォルト値を使用し、直感に反する動作を引き起こしたり、スーパークラスにデフォルトパラメータがない場合には実行時エラーが発生したりしていました。

`copy` の競合につながる継承はKotlin 1.2で警告付きで非推奨化され、Kotlin 1.3ではエラーになります。

### 非推奨化: enumエントリ内のネストされた型

enumエントリ内で、`inner class` ではないネストされた型を定義することは、初期化ロジックの問題により非推奨化されました。これはKotlin 1.2で警告を引き起こし、Kotlin 1.3ではエラーになります。

### 非推奨化: varargに対する単一の名前付き引数

アノテーション内の配列リテラルとの一貫性を保つため、varargパラメータに対して単一の項目を名前付き形式 (`foo(items = i)`) で渡すことは非推奨化されました。対応する配列ファクトリ関数とスプレッド演算子を使用してください。

```kotlin
foo(items = *arrayOf(1))
```

このようなケースでは冗長な配列作成を削除する最適化が存在し、パフォーマンスの低下を防ぎます。単一引数形式はKotlin 1.2で警告を生成し、Kotlin 1.3で廃止される予定です。

### 非推奨化: Throwableを拡張するジェネリッククラスの内部クラス

`Throwable` を継承するジェネリック型の内部クラスは、throw-catchシナリオで型安全性を侵害する可能性があるため、Kotlin 1.2で警告付きで非推奨化され、Kotlin 1.3ではエラーになります。

### 非推奨化: 読み取り専用プロパティのバッキングフィールドの変更

カスタムゲッター内で `field = ...` を代入して読み取り専用プロパティのバッキングフィールドを変更することは、Kotlin 1.2で警告付きで非推奨化され、Kotlin 1.3ではエラーになります。

## 標準ライブラリ

### Kotlin標準ライブラリアーティファクトと分割パッケージ

Kotlin標準ライブラリは、Java 9モジュールシステムと完全に互換性を持つようになりました。Java 9モジュールシステムは、分割パッケージ（同じパッケージ内にクラスを宣言する複数のjarファイル）を禁止しています。これをサポートするために、新しいアーティファクト `kotlin-stdlib-jdk7` と `kotlin-stdlib-jdk8` が導入され、古い `kotlin-stdlib-jre7` と `kotlin-stdlib-jre8` を置き換えます。

新しいアーティファクト内の宣言は、Kotlinの観点からは同じパッケージ名で表示されますが、Javaでは異なるパッケージ名を持っています。したがって、新しいアーティファクトに切り替えても、ソースコードに変更は必要ありません。

新しいモジュールシステムとの互換性を確保するために行われたもう1つの変更は、`kotlin-reflect` ライブラリから `kotlin.reflect` パッケージ内の非推奨の宣言を削除することです。これらを使用していた場合は、Kotlin 1.1からサポートされている `kotlin.reflect.full` パッケージ内の宣言を使用するように切り替える必要があります。

### windowed、chunked、zipWithNext

`Iterable<T>`、`Sequence<T>`、`CharSequence` の新しい拡張関数が追加され、バッファリングやバッチ処理 (`chunked`)、スライディングウィンドウと移動平均の計算 (`windowed`)、後続する項目ペアの処理 (`zipWithNext`) などのユースケースをカバーします。

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

リストを操作するための一連の拡張関数が追加されました。`MutableList` 用の `fill`、`replaceAll`、`shuffle`、および読み取り専用 `List` 用の `shuffled` です。

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

長年の要望に応え、Kotlin 1.2ではJVMとJSに共通の数学演算APIである `kotlin.math` が追加されました。これには以下が含まれます。

*   定数: `PI` および `E`
*   三角関数: `cos`、`sin`、`tan`、およびそれらの逆関数: `acos`、`asin`、`atan`、`atan2`
*   双曲線関数: `cosh`、`sinh`、`tanh`、およびそれらの逆関数: `acosh`、`asinh`、`atanh`
*   指数関数: `pow` (拡張関数)、`sqrt`、`hypot`、`exp`、`expm1`
*   対数関数: `log`、`log2`、`log10`、`ln`、`ln1p`
*   丸め関数:
    *   `ceil`、`floor`、`truncate`、`round` (最近接偶数への丸め) 関数
    *   `roundToInt`、`roundToLong` (最近接整数への丸め) 拡張関数
*   符号および絶対値:
    *   `abs` および `sign` 関数
    *   `absoluteValue` および `sign` 拡張プロパティ
    *   `withSign` 拡張関数
*   2つの値の `max` および `min`
*   2進数表現:
    *   `ulp` 拡張プロパティ
    *   `nextUp`、`nextDown`、`nextTowards` 拡張関数
    *   `toBits`、`toRawBits`、`Double.fromBits` (これらは `kotlin` パッケージにあります)

同じ関数セット（ただし定数なし）は `Float` 引数でも利用できます。

### BigIntegerとBigDecimalの演算子と変換

Kotlin 1.2では、`BigInteger` と `BigDecimal` を操作し、他の数値型からこれらを作成するための一連の関数が導入されました。これらは次のとおりです。

*   `Int` および `Long` 用の `toBigInteger`
*   `Int`、`Long`、`Float`、`Double`、および `BigInteger` 用の `toBigDecimal`
*   算術およびビット演算子関数:
    *   二項演算子 `+`、`-`、`*`、`/`、`%` および中置関数 `and`、`or`、`xor`、`shl`、`shr`
    *   単項演算子 `-`、`++`、`--`、および関数 `inv`

### 浮動小数点からビットへの変換

`Double` と `Float` をビット表現に、またはビット表現から変換するための新しい関数が追加されました。

*   `Double` の場合は `Long` を、`Float` の場合は `Int` を返す `toBits` および `toRawBits`
*   ビット表現から浮動小数点数を作成するための `Double.fromBits` および `Float.fromBits`

### RegexがSerializableになりました

`kotlin.text.Regex` クラスが `Serializable` になり、シリアライズ可能な階層で使用できるようになりました。

### Closeable.useが利用可能な場合はThrowable.addSuppressedを呼び出す

`Closeable.use` 関数は、他の例外の後にリソースを閉じている最中に例外がスローされた場合、`Throwable.addSuppressed` を呼び出すようになりました。

この動作を有効にするには、依存関係に `kotlin-stdlib-jdk7` が必要です。

## JVMバックエンド

### コンストラクタ呼び出しの正規化

Kotlin 1.0以降、Kotlinはtry-catch式やインライン関数呼び出しなど、複雑な制御フローを持つ式をサポートしていました。このようなコードはJava仮想マシンの仕様に準拠しています。しかし、残念ながら、一部のバイトコード処理ツールは、コンストラクタ呼び出しの引数にそのような式が存在する場合、そのようなコードをうまく処理できませんでした。

このようなバイトコード処理ツールのユーザーのためにこの問題を軽減するために、コンパイラはコマンドラインオプション (`-Xnormalize-constructor-calls=MODE`) を追加しました。これは、そのような構文に対してよりJavaライクなバイトコードを生成するようにコンパイラに指示します。ここで `MODE` は次のいずれかです。

*   `disable` (デフォルト) – Kotlin 1.0および1.1と同じ方法でバイトコードを生成します。
*   `enable` – コンストラクタ呼び出しに対してJavaライクなバイトコードを生成します。これはクラスのロードと初期化の順序を変更する可能性があります。
*   `preserve-class-initialization` – クラスの初期化順序を維持しながら、コンストラクタ呼び出しに対してJavaライクなバイトコードを生成します。これはアプリケーション全体のパフォーマンスに影響を与える可能性があります。複数のクラス間で複雑な状態が共有され、クラス初期化時に更新される場合にのみ使用してください。

「手動」での回避策は、制御フローを持つサブ式の値を、呼び出し引数内で直接評価するのではなく、変数に格納することです。これは `-Xnormalize-constructor-calls=enable` と似ています。

### Javaのデフォルトメソッド呼び出し

Kotlin 1.2より前では、JVM 1.6をターゲットとしてJavaのデフォルトメソッドをオーバーライドするインターフェースメンバーは、スーパー呼び出しに対して警告 `Super calls to Java default methods are deprecated in JVM target 1.6. Recompile with '-jvm-target 1.8'` を生成していました。Kotlin 1.2では、代わりに**エラー**が発生するため、このようなコードはJVMターゲット1.8でコンパイルする必要があります。

### 破壊的変更: プラットフォーム型におけるx.equals(null)の一貫した動作

Javaのプリミティブ型 (`Int!`, `Boolean!`, `Short`!, `Long!`, `Float!`, `Double!`, `Char!`) にマップされるプラットフォーム型に対して `x.equals(null)` を呼び出すと、`x` がnullの場合に誤って `true` を返していました。Kotlin 1.2以降、プラットフォーム型のnull値に対して `x.equals(...)` を呼び出すと**NPE**がスローされます（ただし、`x == ...` はスローしません）。

1.2より前の動作に戻すには、コンパイラにフラグ `-Xno-exception-on-explicit-equals-for-boxed-null` を渡してください。

### 破壊的変更: インライン拡張レシーバを介したプラットフォームnullエスケープの修正

プラットフォーム型のnull値に対して呼び出されたインライン拡張関数は、レシーバのnullチェックを行わず、結果としてnullが他のコードにエスケープすることを許容していました。Kotlin 1.2では、呼び出し元でこのチェックを強制し、レシーバがnullの場合は例外をスローします。

古い動作に切り替えるには、フォールバックフラグ `-Xno-receiver-assertions` をコンパイラに渡してください。

## JavaScriptバックエンド

### TypedArraysサポートがデフォルトで有効に

Kotlinのプリミティブ配列（`IntArray`、`DoubleArray`など）を[JavaScriptの型付き配列](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Typed_arrays)に変換するJSの型付き配列サポートは、以前はオプトイン機能でしたが、デフォルトで有効になりました。

## ツール

### 警告をエラーとして扱う

コンパイラに、すべての警告をエラーとして扱うオプションが追加されました。コマンドラインで `-Werror` を使用するか、以下のGradleスニペットを使用してください。

```groovy
compileKotlin {
    kotlinOptions.allWarningsAsErrors = true
}