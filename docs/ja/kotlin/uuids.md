[//]: # (title: UUID)
[//]: # (description: Kotlin での UUID の使用方法について学びます。これには、マルチプラットフォームおよび JVM コードにおける UUID 値の作成、解析、フォーマット、シリアライズ、および操作が含まれます。)

[`Uuid`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.uuid/-uuid/) クラスは、Universally Unique Identifier（UUID）を表します。これは Globally Unique Identifier（GUID）としても知られています。

`Uuid` は、ID を割り当てる中央システムに依存することなく、エンティティを一意に識別するために使用される 128 ビットの値です。これにより、UUID は分散アプリケーション、データベース、クライアント側で生成されるレコード、または [Kotlin マルチプラットフォーム](https://kotlinlang.org/docs/multiplatform/get-started.html) アプリケーションで役立ちます。

UUID 値を扱うには `Uuid` クラスを使用してください。単なる文字列とは異なり、専用の UUID 型を使用することで、コードがより明示的になり、無効な値の誤用を防ぐことができます。

プロジェクトで UUID を使用するには、`kotlin.uuid` パッケージから `Uuid` クラスをインポートします。

```kotlin
import kotlin.uuid.Uuid
```

## UUID の生成

ユーザー ID やデータベース ID などの一般的な識別子として、ランダムなバージョン 4 の UUID を生成するには、[`Uuid.random()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.uuid/-uuid/-companion/random.html) 関数を使用します。

```kotlin
import kotlin.uuid.Uuid

fun main() {
//sampleStart    
    val id = Uuid.random()
    println(id)
//sampleEnd    
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="2.0"}

また、以下の[実験的 (Experimental)](components-stability.md#stability-levels-explained) な関数を使用して、特定のバージョンの UUID を生成することもできます。

* [`Uuid.generateV4()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.uuid/-uuid/-companion/generate-v4.html) 関数は、`Uuid.random()` 関数と同じタイプの UUID を生成しますが、その値がバージョン 4 の UUID であることを明示的に示します。
* [`Uuid.generateV7()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.uuid/-uuid/-companion/generate-v7.html) 関数は、UUID のソートに使用できるタイムスタンプ付きのバージョン 7 UUID を生成します。
* [`Uuid.generateV7NonMonotonicAt()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.uuid/-uuid/-companion/generate-v7-non-monotonic-at.html) 関数は、特定の時点に対するバージョン 7 の UUID を生成します。

これらの UUID 生成関数は「実験的 (Experimental)」です。
オプトインするには、`@OptIn(ExperimentalUuidApi::class)` アノテーションを使用するか、ビルドファイルに以下のコンパイラオプションを追加してください。

<tabs group="build-system">
<tab title="Gradle" group-key="gradle">

```kotlin
kotlin {
    compilerOptions {
        freeCompilerArgs.add("-opt-in=kotlin.uuid.ExperimentalUuidApi")
    }
}
```

</tab>
<tab title="Maven" group-key="maven">

```xml
<build>
    <plugins>
        <plugin>
            <groupId>org.jetbrains.kotlin</groupId>
            <artifactId>kotlin-maven-plugin</artifactId>
            <configuration>
                <args>
                    <arg>-opt-in=kotlin.uuid.ExperimentalUuidApi</arg>
                </args>
            </configuration>
        </plugin>
    </plugins>
</build>
```

</tab>
</tabs>

以下は、バージョン固有の UUID を生成する例です。

```kotlin
import kotlin.time.Instant
import kotlin.time.ExperimentalTime
import kotlin.uuid.Uuid

@OptIn(kotlin.uuid.ExperimentalUuidApi::class, ExperimentalTime::class)
fun main() {
    // バージョン 4 の UUID を生成
    val idVersion4 = Uuid.generateV4()
    println(idVersion4)

    // バージョン 7 の UUID を生成
    val idVersion7 = Uuid.generateV7()
    println(idVersion7)

    // 指定されたタイムスタンプに対するバージョン 7 の UUID を生成
    val timestamp = Instant.fromEpochMilliseconds(1757440583000L)
    val idVersion7SpecificTime = Uuid.generateV7NonMonotonicAt(timestamp)
    println(idVersion7SpecificTime)
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="2.3"}

## UUID の解析

UUID 値は、URL パラメータやデータベースレコードなどのように、文字列として表されることがよくあります。

`String` 値を `Uuid` 値に変換するには、[`Uuid.parse()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.uuid/-uuid/-companion/parse.html) 関数を使用します。

```kotlin
import kotlin.uuid.Uuid

fun main() {
//sampleStart
    val id = Uuid.parse("de2bc56c-ea73-4f3c-8a37-5a46fdb2d79a")
    println(id)
//sampleEnd    
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="2.0"}

`Uuid.parse()` 関数は、標準的な 16 進数とハイフンの形式、およびハイフンなしの 16 進数形式の両方を受け入れます。

入力が無効な場合、`Uuid.parse()` 関数は `IllegalArgumentException` をスローします。

```kotlin
import kotlin.uuid.Uuid

fun main() { 
//sampleStart    
    val id = Uuid.parse("10")
    println(id)
//sampleEnd    
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="2.0"}

アプリケーションが特定の表現形式のみを受け入れる場合は、形式固有の関数を使用してください。

* [`Uuid.parseHexDash()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.uuid/-uuid/-companion/parse-hex-dash.html) : 16 進数とハイフンの文字列形式用。
* [`Uuid.parseHex()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.uuid/-uuid/-companion/parse-hex.html) : ハイフンなしの 16 進数文字列形式用。

例：

```kotlin
import kotlin.uuid.Uuid

fun main() {
//sampleStart  
    val standard = Uuid.parseHexDash("de2bc56c-ea73-4f3c-8a37-5a46fdb2d79a")
    val compact = Uuid.parseHex("de2bc56cea734f3c8a375a46fdb2d79a")
    
    println(standard)
    println(compact)
//sampleEnd    
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="2.3"}

外部ソースからの UUID を扱い、無効な入力を安全に処理する必要がある場合は、[`Uuid.parseOrNull()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.uuid/-uuid/-companion/parse-or-null.html)、[`Uuid.parseHexDashOrNull()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.uuid/-uuid/-companion/parse-hex-dash-or-null.html)、または [`Uuid.parseHexOrNull()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.uuid/-uuid/-companion/parse-hex-or-null.html) を使用してください。これらの関数は、入力が無効な場合に `null` を返します。

```kotlin
fun parseId(input: String): Uuid? { 
    return Uuid.parseOrNull(input) 
}
```

## UUID から文字列への変換

以下の関数を使用して、`Uuid` 値を `String` 値に変換できます。

* [`toString()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.uuid/-uuid/to-string.html) : 標準的な文字列形式
* [`toHexDashString()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.uuid/-uuid/to-hex-dash-string.html) : 16 進数とハイフンの形式
* [`toHexString()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.uuid/-uuid/to-hex-string.html) : ハイフンなしの 16 進数形式

例：

```kotlin
import kotlin.uuid.Uuid

fun main() {
//sampleStart    
    val id = Uuid.parse("de2bc56c-ea73-4f3c-8a37-5a46fdb2d79a")
    
    println(id.toString())
    // de2bc56c-ea73-4f3c-8a37-5a46fdb2d79a
    println(id.toHexDashString())
    // de2bc56c-ea73-4f3c-8a37-5a46fdb2d79a
    println(id.toHexString())
    // de2bc56cea734f3c8a375a46fdb2d79a 
//sampleEnd    
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="2.3"}

## UUID の比較

`==` 演算子を使用して、`Uuid` 値が等しいかどうかを確認できます。

Kotlin は文字列形式ではなく、UUID の値に基づいて値を比較します。例えば、異なる形式の 2 つの値であっても、同じ 128 ビットの値を表していれば等しいとみなされます。

```kotlin
import kotlin.uuid.Uuid

fun main() {
//sampleStart    
    val first = Uuid.parse("de2bc56c-ea73-4f3c-8a37-5a46fdb2d79a")
    val second = Uuid.parse("de2bc56cea734f3c8a375a46fdb2d79a")

    println(first == second) 
    // true 
//sampleEnd    
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="2.3"}

これにより、文字列比較よりも `Uuid` 比較の方が信頼性が高くなります。文字列比較では、異なる形式の同じ値を別の値として扱ってしまいますが、`Uuid` 比較では実際の識別子の値をチェックします。

`Uuid` は `Comparable<Uuid>` インターフェースを実装しているため、`sorted()` などの標準的なコレクション関数を使用して UUID 値をソートできます。この場合、Kotlin は値を（最上位ビットから最下位ビットに向かって）辞書順で比較します。

```kotlin
import kotlin.uuid.Uuid

fun main() {
//sampleStart    
    val first = Uuid.generateV7()
    val second = Uuid.generateV7()

    val sorted = listOf(first, second).sorted()
    println(sorted) 
//sampleEnd    
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="2.3"}

## バイナリ表現の操作

一部の API、ストレージ形式、およびバイナリプロトコルでは、UUID を文字列として表しません。代わりに、128 ビットの UUID 値を以下のいずれかとして保存します。

* 16 バイトの配列
* 2 つの 64 ビット値

バイナリ形式の UUID データを期待するシステムと UUID をやり取りする必要がある場合は、これらの表現を使用してください。

UUID と 16 バイト表現の間で変換を行うには、[`.toByteArray()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.uuid/-uuid/to-byte-array.html) および [`Uuid.fromByteArray()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.uuid/-uuid/-companion/from-byte-array.html) 関数を使用します。

```kotlin
import kotlin.uuid.Uuid

fun main() {
//sampleStart 
    val id = Uuid.random()

    val bytes = id.toByteArray()
    val original = Uuid.fromByteArray(bytes)
  
    println(id)
    
    println(bytes)
    println(original)

    println(id == original) 
    // true
//sampleEnd  
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="2.0"}

また、同じ 128 ビットの UUID 値を 2 つの `Long` 値として表すこともできます。Kotlin には組み込みの 128 ビット整数型がないため、これは便利です。2 つの `Long` 値は、UUID を以下の 2 つの部分に分けて保存します。

* `mostSignificantBits` パラメータ：UUID の最初の 64 ビット。
* `leastSignificantBits` パラメータ：UUID の最後の 64 ビット。

2 つの `Long` 値から `Uuid` 値を作成するには、[`Uuid.fromLongs()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.uuid/-uuid/-companion/from-longs.html) 関数を使用します。

```kotlin
import kotlin.uuid.Uuid

fun main() {
//sampleStart 
    val id = Uuid.fromLongs(
        mostSignificantBits = -4653685776373167443,
        leastSignificantBits = -6288180676521310383.toLong()
    )
    println(id) 
    // bf6ac971-52fd-4aad-a8bb-e4fdac78c751
//sampleEnd  
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="2.0"}

既存の `Uuid` 値からこれら 2 つの部分を抽出するには、[`Uuid.toLongs()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.uuid/-uuid/to-longs.html) 関数を使用します。

```kotlin
import kotlin.uuid.Uuid

fun main() {
//sampleStart 
    val id = Uuid.random()
    
    id.toLongs { mostSignificantBits, leastSignificantBits ->
        println(mostSignificantBits)
        println(leastSignificantBits)
    }
//sampleEnd  
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="2.0"}

## UUID のシリアライズ

Kotlin は `Uuid` 値のシリアライズをサポートしています。JSON API や設定ファイルなど、Kotlin コードの外部で UUID 値を保存または転送するために使用します。

`Uuid` 値をシリアライズする場合、アプリケーションで別の形式が必要でない限り、文字列として表してください。[`kotlinx.serialization`](https://kotlinlang.org/docs/serialization.html) ライブラリは 16 進数とハイフンの形式を使用します。

```kotlin
//sampleStart 
import kotlin.uuid.Uuid
import kotlinx.serialization.Serializable
import kotlinx.serialization.encodeToString
import kotlinx.serialization.json.Json

@Serializable
data class User(
    val id: Uuid,
    val name: String
)

fun main() {
    val user = User(
        id = Uuid.parse("de2bc56cea734f3c8a375a46fdb2d79a"),
        name = "Kotlin"
    )

    println(Json.encodeToString(user))
    // {"id":"de2bc56c-ea73-4f3c-8a37-5a46fdb2d79a","name":"Kotlin"}
}
//sampleEnd
```
{kotlin-runnable="true" kotlin-min-compiler-version="2.3"}

## Java API での UUID の使用

Java は UUID を表すために `java.util.UUID` クラスを使用します。JVM 上では、Java API がこの型を受け取ったり返したりする場合があります。`java.util.UUID` と `kotlin.uuid.Uuid` はどちらも UUID を表しますが、これらは 2 つの異なる型です。

Kotlin と Java の間で UUID を渡すには、明示的に値を変換します。

* Java の UUID を Kotlin に変換するには、[`.toKotlinUuid()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.uuid/to-kotlin-uuid.html) 拡張関数を使用します。

  ```kotlin
  import kotlin.uuid.toKotlinUuid
  
  val kotlinId: Uuid = javaId.toKotlinUuid()
  ```

* Kotlin の UUID を Java に変換するには、[`.toJavaUuid()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.uuid/to-java-uuid.html) 拡張関数を使用します。

  ```kotlin
  import kotlin.uuid.toJavaUuid
  
  val javaId: java.util.UUID = kotlinId.toJavaUuid()
  ```

これらの関数を使用することで、JVM の相互運用性の境界で UUID 値を `Uuid` として表現できるようになります。

> `java.util.UUID` クラスと `kotlin.uuid.Uuid` クラスはどちらも比較可能（comparable）ですが、順序付け（ordering）が異なる場合があります。Java API から Kotlin API に移行する前に、UUID の順序に依存しているコードを必ず確認してください。
>
{style="note"}

Kotlin は Java バッファの操作もサポートしています。`ByteBuffer` 内の UUID を扱うには、JVM 固有の関数を使用してください。

* [`.getUuid()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.uuid/get-uuid.html) 関数を使用して、バッファから UUID を読み取ります。
* [`.putUuid()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.uuid/put-uuid.html) 関数を使用して、バッファに UUID を書き込みます。