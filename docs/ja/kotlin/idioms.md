[//]: # (title: イディオム (Idioms))

Kotlin でよく使われる慣用句（イディオム）のコレクションです。お気に入りのイディオムがあれば、プルリクエストを送って貢献してください。

## DTO (POJO/POCO) の作成

```kotlin
data class Customer(val name: String, val email: String)
```

上記のコードは、以下の機能を備えた `Customer` クラスを提供します：

* すべてのプロパティに対するゲッター（`var` の場合はセッターも含む）
* `equals()`
* `hashCode()`
* `toString()`
* `copy()`
* すべてのプロパティに対応する `component1()`, `component2()`, ..., （[データクラス](data-classes.md)を参照）

## 関数の引数のデフォルト値

```kotlin
fun foo(a: Int = 0, b: String = "") { ... }
```

## リストのフィルタリング

```kotlin
val positives = list.filter { x -> x > 0 }
```

あるいは、さらに短く書くこともできます：

```kotlin
val positives = list.filter { it > 0 }
```

[Java と Kotlin でのフィルタリングの違い](java-to-kotlin-collections-guide.md#filter-elements)を学びましょう。

## コレクション内に要素が存在するかどうかの確認

```kotlin
if ("john@example.com" in emailsList) { ... }

if ("jane@example.com" !in emailsList) { ... }
```

## 文字列の補完 (String interpolation)

```kotlin
println("Name $name")
```

[Java と Kotlin での文字列結合の違い](java-to-kotlin-idioms-strings.md#concatenate-strings)を学びましょう。

## 標準入力を安全に読み込む

```kotlin
// 文字列を読み込み、整数に変換できない場合は null を返します。例: Hi there!
val wrongInt = readln().toIntOrNull()
println(wrongInt)
// null

// 整数に変換可能な文字列を読み込み、整数を返します。例: 13
val correctInt = readln().toIntOrNull()
println(correctInt)
// 13
```

詳細については、[標準入力の読み込み](read-standard-input.md)を参照してください。

## インスタンスのチェック

```kotlin
when (x) {
    is Foo -> ...
    is Bar -> ...
    else   -> ...
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

## マップのエントリへのアクセス

```kotlin
println(map["key"])
map["key"] = value
```

## マップまたはペアのリストの反復処理

```kotlin
for ((k, v) in map) {
    println("$k -> $v")
}
```

`k` と `v` は、`name` と `age` のように、使いやすい任意の名前を使用できます。

## 範囲（Range）の反復処理

```kotlin
for (i in 1..100) { ... }  // 閉区間（closed-ended range）: 100を含む
for (i in 1..<100) { ... } // 半開区間（open-ended range）: 100を含まない
for (x in 2..10 step 2) { ... }
for (x in 10 downTo 1) { ... }
(1..10).forEach { ... }
```

## 遅延プロパティ (Lazy property)

```kotlin
val p: String by lazy { // 値は最初のアクセス時にのみ計算されます
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

## 型安全な値のためのインライン値クラスの使用

```kotlin
@JvmInline
value class EmployeeId(private val id: String)

@JvmInline
value class CustomerId(private val id: String)
```

誤って `EmployeeId` と `CustomerId` を混ぜて使用した場合、コンパイルエラーが発生します。

> `@JvmInline` アノテーションは JVM バックエンドの場合にのみ必要です。
>
{style="note"}

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

## if-not-null の短縮表記

```kotlin
val files = File("Test").listFiles()

println(files?.size) // files が null でない場合に size が出力されます
```

## if-not-null-else の短縮表記

```kotlin
val files = File("Test").listFiles()

// 単純なデフォルト値の場合：
println(files?.size ?: "empty") // files が null の場合、"empty" を出力します

// コードブロック内でより複雑なデフォルト値を計算するには、`run` を使用します
val filesSize = files?.size ?: run { 
    val someSize = getSomeSize()
    someSize * 2
}
println(filesSize)
```

## null の場合に式を実行する

```kotlin
val values = ...
val email = values["email"] ?: throw IllegalStateException("Email is missing!")
```

## 空である可能性があるコレクションから最初の要素を取得する

```kotlin
val emails = ... // 空の可能性があります
val mainEmail = emails.firstOrNull() ?: ""
```

[Java と Kotlin での最初の要素の取得の違い](java-to-kotlin-collections-guide.md#get-the-first-and-the-last-items-of-a-possibly-empty-collection)を学びましょう。

## null でない場合に実行する

```kotlin
val value = ...

value?.let {
    ... // null でない場合にこのブロックを実行します
}
```

## nullable な値を null でない場合にマップする

```kotlin
val value = ...

val mapped = value?.let { transformValue(it) } ?: defaultValue 
// 値または変換結果が null の場合、defaultValue が返されます。
```

## when 文の結果を返す

```kotlin
fun transform(color: String): Int {
    return when (color) {
        "Red" -> 0
        "Green" -> 1
        "Blue" -> 2
        else -> throw IllegalArgumentException("Invalid color param value")
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

    // result を使用した処理
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

## Unit を返すメソッドのビルダー形式での使用

```kotlin
fun arrayOfMinusOnes(size: Int): IntArray {
    return IntArray(size).apply { fill(-1) }
}
```

## 単一式関数 (Single-expression functions)

```kotlin
fun theAnswer() = 42
```

これは以下と同等です：

```kotlin
fun theAnswer(): Int {
    return 42
}
```

これは他のイディオムと効果的に組み合わせることで、コードをより短くできます。例えば、`when` 式との組み合わせ：

```kotlin
fun transform(color: String): Int = when (color) {
    "Red" -> 0
    "Green" -> 1
    "Blue" -> 2
    else -> throw IllegalArgumentException("Invalid color param value")
}
```

## オブジェクトインスタンスの複数のメソッドを呼び出す (with)

```kotlin
class Turtle {
    fun penDown()
    fun penUp()
    fun turn(degrees: Double)
    fun forward(pixels: Double)
}

val myTurtle = Turtle()
with(myTurtle) { // 100ピクセルの正方形を描く
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

これは、オブジェクトのコンストラクタに含まれていないプロパティを構成するのに便利です。

## Java 7 の try-with-resources

```kotlin
val stream = Files.newInputStream(Paths.get("/some/file.txt"))
stream.buffered().reader().use { reader ->
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

## 2つの変数の入れ替え

```kotlin
var a = 1
var b = 2
a = b.also { b = a }
```

## コードを未完了としてマークする (TODO)
 
Kotlin の標準ライブラリには、常に `NotImplementedError` をスローする `TODO()` 関数があります。
その戻り値の型は `Nothing` であるため、期待される型に関係なく使用できます。
また、理由をパラメータとして受け取るオーバーロードもあります：

```kotlin
fun calcTaxes(): BigDecimal = TODO("Waiting for feedback from accounting")
```

IntelliJ IDEA の Kotlin プラグインは `TODO()` のセマンティクスを理解し、TODO ツールウィンドウに自動的にコードポインタを追加します。

## 次のステップ

* イディオムに従った Kotlin スタイルを使用して [Advent of Code のパズル](advent-of-code.md)を解く。
* [Java と Kotlin での文字列に関する一般的なタスク](java-to-kotlin-idioms-strings.md)の実行方法を学ぶ。
* [Java と Kotlin でのコレクションに関する一般的なタスク](java-to-kotlin-collections-guide.md)の実行方法を学ぶ。
* [Java と Kotlin での null 許容性（nullability）の処理方法](java-to-kotlin-nullability-guide.md)を学ぶ。