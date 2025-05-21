---
title: イディオム
---
Kotlin でよく使用されるイディオム集です。お気に入りのイディオムがあれば、pull request を送って貢献してください。

## DTO (POJO/POCO) の作成

```kotlin
data class Customer(val name: String, val email: String)
```

これにより、次の機能を持つ `Customer` クラスが提供されます。

* すべてのプロパティのゲッター (`var` の場合はセッター)
* `equals()`
* `hashCode()`
* `toString()`
* `copy()`
* すべてのプロパティに対する `component1()`, `component2()`, ... ( [Data classes](data-classes)を参照)

## 関数パラメータのデフォルト値

```kotlin
fun foo(a: Int = 0, b: String = "") { ... }
```

## リストのフィルタリング

```kotlin
val positives = list.filter { x `->` x > 0 }
```

または、さらに短くすることもできます。

```kotlin
val positives = list.filter { it > 0 }
```

[Java と Kotlin のフィルタリングの違い](java-to-kotlin-collections-guide#filter-elements)を学んでください。

## コレクション内の要素の存在確認

```kotlin
if ("john@example.com" in emailsList) { ... }

if ("jane@example.com" !in emailsList) { ... }
```

## 文字列のインターポレーション

```kotlin
println("Name $name")
```

[Java と Kotlin の文字列連結の違い](java-to-kotlin-idioms-strings#concatenate-strings)を学んでください。

## 標準入力を安全に読み取る

```kotlin
// 文字列を読み取り、入力が整数に変換できない場合は null を返します。例: Hi there!
val wrongInt = readln().toIntOrNull()
println(wrongInt)
// null

// 整数に変換できる文字列を読み取り、整数を返します。例: 13
val correctInt = readln().toIntOrNull()
println(correctInt)
// 13
```

詳細については、[標準入力を読み取る](read-standard-input)を参照してください。

## インスタンスチェック

```kotlin
when (x) {
    is Foo `->` ...
    is Bar `->` ...
    else   `->` ...
}
```

## 読み取り専用リスト

```kotlin
val list = listOf("a", "b", "c")
```
## 読み取り専用マップ

```kotlin
val map = mapOf("a" to 1, "b" to 2, "c" to 3)
```

## マップエントリへのアクセス

```kotlin
println(map["key"])
map["key"] = value
```

## マップまたはペアのリストの走査

```kotlin
for ((k, v) in map) {
    println("$k `->` $v")
}
```

`k` と `v` は、`name` や `age` など、任意の便利な名前を使用できます。

## 範囲の反復処理

```kotlin
for (i in 1..100) { ... }  // 閉区間: 100 を含む
for (i in 1..&lt;100) { ... } // 開区間: 100 を含まない
for (x in 2..10 step 2) { ... }
for (x in 10 downTo 1) { ... }
(1..10).forEach { ... }
```

## 遅延プロパティ

```kotlin
val p: String by lazy { // 値は最初のアクセス時のみに計算されます
    // 文字列を計算する
}
```

## 拡張関数

```kotlin
fun String.spaceToCamelCase() { ... }

"Convert this to camelcase".spaceToCamelCase()
```

## シングルトンの作成

```kotlin
object Resource {
    val name = "Name"
}
```

## 型安全な値にインライン値クラスを使用する

```kotlin
@JvmInline
value class EmployeeId(private val id: String)

@JvmInline
value class CustomerId(private val id: String)
```

誤って `EmployeeId` と `CustomerId` を混同すると、コンパイルエラーが発生します。

:::note
`@JvmInline` アノテーションは、JVM バックエンドでのみ必要です。

:::

## 抽象クラスのインスタンス化

```kotlin
abstract class MyAbstractClass {
    abstract fun doSomething()
    abstract fun sleep()
}

fun main() {
    val myObject = object : MyAbstractClass() {
        override fun doSomething() {
            // ...
        }

        override fun sleep() { // ...
        }
    }
    myObject.doSomething()
}
```

## If-not-null の省略形

```kotlin
val files = File("Test").listFiles()

println(files?.size) // files が null でない場合、size が出力されます
```

## If-not-null-else の省略形

```kotlin
val files = File("Test").listFiles()

// 簡単なフォールバック値の場合:
println(files?.size ?: "empty") // files が null の場合、"empty" が出力されます

// コードブロックでより複雑なフォールバック値を計算するには、`run` を使用します
val filesSize = files?.size ?: run { 
    val someSize = getSomeSize()
    someSize * 2
}
println(filesSize)
```

## null の場合にステートメントを実行する

```kotlin
val values = ...
val email = values["email"] ?: throw IllegalStateException("Email is missing!")
```

## 空の可能性のあるコレクションの最初のアイテムを取得する

```kotlin
val emails = ... // 空の可能性がある
val mainEmail = emails.firstOrNull() ?: ""
```

[Java と Kotlin の最初のアイテムの取得の違い](java-to-kotlin-collections-guide#get-the-first-and-the-last-items-of-a-possibly-empty-collection)を学んでください。

## null でない場合に実行する

```kotlin
val value = ...

value?.let {
    ... // null でない場合にこのブロックを実行します
}
```

## null でない場合に nullable な値をマップする

```kotlin
val value = ...

val mapped = value?.let { transformValue(it) } ?: defaultValue 
// 値または変換結果が null の場合、defaultValue が返されます。
```

## when ステートメントで返す

```kotlin
fun transform(color: String): Int {
    return when (color) {
        "Red" `->` 0
        "Green" `->` 1
        "Blue" `->` 2
        else `->` throw IllegalArgumentException("Invalid color param value")
    }
}
```

## try-catch 式

```kotlin
fun test() {
    val result = try {
        count()
    } catch (e: ArithmeticException) {
        throw IllegalStateException(e)
    }

    // 結果を処理する
}
```

## if 式

```kotlin
val y = if (x == 1) {
    "one"
} else if (x == 2) {
    "two"
} else {
    "other"
}
```

## Unit を返すメソッドの Builder スタイルでの使用

```kotlin
fun arrayOfMinusOnes(size: Int): IntArray {
    return IntArray(size).apply { fill(-1) }
}
```

## 単一式関数

```kotlin
fun theAnswer() = 42
```

これは以下と同等です。

```kotlin
fun theAnswer(): Int {
    return 42
}
```

これは、他のイディオムと効果的に組み合わせることができ、コードを短くすることができます。たとえば、`when` 式を使用すると次のようになります。

```kotlin
fun transform(color: String): Int = when (color) {
    "Red" `->` 0
    "Green" `->` 1
    "Blue" `->` 2
    else `->` throw IllegalArgumentException("Invalid color param value")
}
```

## オブジェクトインスタンスで複数のメソッドを呼び出す (with)

```kotlin
class Turtle {
    fun penDown()
    fun penUp()
    fun turn(degrees: Double)
    fun forward(pixels: Double)
}

val myTurtle = Turtle()
with(myTurtle) { // 100 ピクセルの正方形を描画する
    penDown()
    for (i in 1..4) {
        forward(100.0)
        turn(90.0)
    }
    penUp()
}
```

## オブジェクトのプロパティを構成する (apply)

```kotlin
val myRectangle = Rectangle().apply {
    length = 4
    breadth = 5
    color = 0xFAFAFA
}
```

これは、オブジェクトコンストラクタに存在しないプロパティを構成するのに役立ちます。

## Java 7 の try-with-resources

```kotlin
val stream = Files.newInputStream(Paths.get("/some/file.txt"))
stream.buffered().reader().use { reader `->`
    println(reader.readText())
}
```

## ジェネリック型情報を必要とするジェネリック関数

```kotlin
//  public final class Gson {
//     ...
//     public <T> T fromJson(JsonElement json, Class<T> classOfT) throws JsonSyntaxException {
//     ...

inline fun <reified T: Any> Gson.fromJson(json: JsonElement): T = this.fromJson(json, T::class.java)
```

## 2つの変数を入れ替える

```kotlin
var a = 1
var b = 2
a = b.also { b = a }
```

## コードを未完了としてマークする (TODO)
 
Kotlin の標準ライブラリには、常に `NotImplementedError` をスローする `TODO()` 関数があります。
その戻り値の型は `Nothing` であるため、予期される型に関係なく使用できます。
理由パラメータを受け入れるオーバーロードもあります。

```kotlin
fun calcTaxes(): BigDecimal = TODO("会計からのフィードバックを待っています")
```

IntelliJ IDEA の kotlin プラグインは `TODO()` のセマンティクスを理解し、TODO ツールウィンドウにコードポインタを自動的に追加します。

## 次は何ですか？

* イディオム的な Kotlin スタイルを使用して[Advent of Code パズル](advent-of-code)を解いてください。
* [Java と Kotlin で文字列を使用して一般的なタスクを実行する方法](java-to-kotlin-idioms-strings)を学んでください。
* [Java と Kotlin でコレクションを使用して一般的なタスクを実行する方法](java-to-kotlin-collections-guide)を学んでください。
* [Java と Kotlin で Null 許容を処理する方法](java-to-kotlin-nullability-guide)を学んでください。