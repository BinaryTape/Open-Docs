[//]: # (title: イディオム)

Kotlinでランダムに、かつ頻繁に使用されるイディオムのコレクションです。お気に入りのイディオムがあれば、プルリクエストを送って貢献してください。

## DTOの作成 (POJOs/POCOs)

```kotlin
data class Customer(val name: String, val email: String)
```

は、以下の機能を持つ`Customer`クラスを提供します：

*   すべてのプロパティに対するゲッター（`var`の場合はセッターも）
*   `equals()`
*   `hashCode()`
*   `toString()`
*   `copy()`
*   すべてのプロパティに対する`component1()`、`component2()`など（[データクラス](data-classes.md)を参照）

## 関数パラメーターのデフォルト値

```kotlin
fun foo(a: Int = 0, b: String = "") { ... }
```

## リストのフィルタリング

```kotlin
val positives = list.filter { x -> x > 0 }
```

あるいは、さらに短く：

```kotlin
val positives = list.filter { it > 0 }
```

[JavaとKotlinのフィルタリング](java-to-kotlin-collections-guide.md#filter-elements)の違いについて学習してください。

## コレクション内の要素の存在チェック

```kotlin
if ("john@example.com" in emailsList) { ... }

if ("jane@example.com" !in emailsList) { ... }
```

## 文字列補間

```kotlin
println("Name $name")
```

[JavaとKotlinの文字列結合](java-to-kotlin-idioms-strings.md#concatenate-strings)の違いについて学習してください。

## 標準入力を安全に読み取る

```kotlin
// 文字列を読み込み、入力が整数に変換できない場合はnullを返します。例: Hi there!
val wrongInt = readln().toIntOrNull()
println(wrongInt)
// null

// 整数に変換できる文字列を読み込み、整数を返します。例: 13
val correctInt = readln().toIntOrNull()
println(correctInt)
// 13
```

詳細については、[標準入力の読み取り](read-standard-input.md)を参照してください。

## インスタンスチェック

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

## マップエントリへのアクセス

```kotlin
println(map["key"])
map["key"] = value
```

## マップまたはペアのリストをトラバースする

```kotlin
for ((k, v) in map) {
    println("$k -> $v")
}
```

`k`と`v`は、`name`や`age`のような任意の便利な名前を使用できます。

## 範囲のイテレーション

```kotlin
for (i in 1..100) { ... }  // 閉じた範囲: 100を含む
for (i in 1..<100) { ... } // 開いた範囲: 100を含まない
for (x in 2..10 step 2) { ... }
for (x in 10 downTo 1) { ... }
(1..10).forEach { ... }
```

## 遅延プロパティ

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

誤って`EmployeeId`と`CustomerId`を混同した場合、コンパイルエラーが発生します。

> `@JvmInline`アノテーションはJVMバックエンドでのみ必要です。
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

## nullでない場合の短縮記法

```kotlin
val files = File("Test").listFiles()

println(files?.size) // filesがnullでない場合、sizeが出力されます
```

## nullでない場合またはnullの場合の短縮記法

```kotlin
val files = File("Test").listFiles()

// 単純なフォールバック値の場合:
println(files?.size ?: "empty") // filesがnullの場合、"empty"が出力されます

// コードブロックでより複雑なフォールバック値を計算するには、`run`を使用します
val filesSize = files?.size ?: run { 
    val someSize = getSomeSize()
    someSize * 2
}
println(filesSize)
```

## nullの場合に文を実行する

```kotlin
val values = ...
val email = values["email"] ?: throw IllegalStateException("Email is missing!")
```

## 空の可能性があるコレクションの最初の項目を取得する

```kotlin
val emails = ... // 空の可能性がある
val mainEmail = emails.firstOrNull() ?: ""
```

[JavaとKotlinの最初の項目を取得する方法](java-to-kotlin-collections-guide.md#get-the-first-and-the-last-items-of-a-possibly-empty-collection)の違いについて学習してください。

## nullでない場合に実行

```kotlin
val value = ...

value?.let {
    ... // nullでない場合、このブロックを実行
}
```

## nullでない場合にnull許容値をマッピングする

```kotlin
val value = ...

val mapped = value?.let { transformValue(it) } ?: defaultValue 
// valueまたは変換結果がnullの場合、defaultValueが返されます。
```

## whenステートメントでの戻り値

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

## try-catch式

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

## if式

```kotlin
val y = if (x == 1) {
    "one"
} else if (x == 2) {
    "two"
} else {
    "other"
}
```

## Unitを返すメソッドのビルダー形式の使用

```kotlin
fun arrayOfMinusOnes(size: Int): IntArray {
    return IntArray(size).apply { fill(-1) }
}
```

## 単一式関数

```kotlin
fun theAnswer() = 42
```

これは以下と同等です

```kotlin
fun theAnswer(): Int {
    return 42
}
```

これは他のイディオムと効果的に組み合わせることができ、コードを短くすることができます。例えば、`when`式と組み合わせる場合：

```kotlin
fun transform(color: String): Int = when (color) {
    "Red" -> 0
    "Green" -> 1
    "Blue" -> 2
    else -> throw IllegalArgumentException("Invalid color param value")
}
```

## オブジェクトインスタンスの複数のメソッドを呼び出す (`with`を使用)

```kotlin
class Turtle {
    fun penDown()
    fun penUp()
    fun turn(degrees: Double)
    fun forward(pixels: Double)
}

val myTurtle = Turtle()
with(myTurtle) { // 100ピクセルの正方形を描画
    penDown()
    for (i in 1..4) {
        forward(100.0)
        turn(90.0)
    }
    penUp()
}
```

## オブジェクトのプロパティを設定する (`apply`を使用)

```kotlin
val myRectangle = Rectangle().apply {
    length = 4
    breadth = 5
    color = 0xFAFAFA
}
```

これは、オブジェクトコンストラクタに存在しないプロパティを設定するのに役立ちます。

## Java 7のtry-with-resources

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

## 2つの変数を交換する

```kotlin
var a = 1
var b = 2
a = b.also { b = a }
```

## コードを未完了としてマークする (`TODO`)
 
Kotlinの標準ライブラリには`TODO()`関数があり、これは常に`NotImplementedError`をスローします。
その戻り値の型は`Nothing`であるため、期待される型に関係なく使用できます。
理由パラメーターを受け入れるオーバーロードも存在します：

```kotlin
fun calcTaxes(): BigDecimal = TODO("Waiting for feedback from accounting")
```

IntelliJ IDEAのKotlinプラグインは`TODO()`のセマンティクスを理解しており、TODOツールウィンドウにコードポインターを自動的に追加します。

## 次のステップは？

*   イディオム的なKotlinスタイルを使用して[Advent of Codeのパズル](advent-of-code.md)を解く。
*   [JavaとKotlinで文字列に関する一般的なタスク](java-to-kotlin-idioms-strings.md)を実行する方法を学ぶ。
*   [JavaとKotlinでコレクションに関する一般的なタスク](java-to-kotlin-collections-guide.md)を実行する方法を学ぶ。
*   [JavaとKotlinでnull許容性を扱う方法](java-to-kotlin-nullability-guide.md)を学ぶ。