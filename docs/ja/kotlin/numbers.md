[//]: # (title: 数値)

## 整数型

Kotlinは、数値を表すための一連の組み込み型を提供しています。
整数については、サイズと値の範囲が異なる4つの型があります：

| 型        | サイズ (ビット) | 最小値                                         | 最大値                                           |
|----------|-------------|----------------------------------------------|------------------------------------------------|
| `Byte`   | 8           | -128                                         | 127                                            |
| `Short`  | 16          | -32768                                       | 32767                                          |
| `Int`    | 32          | -2,147,483,648 (-2<sup>31</sup>)             | 2,147,483,647 (2<sup>31</sup> - 1)             |
| `Long`   | 64          | -9,223,372,036,854,775,808 (-2<sup>63</sup>) | 9,223,372,036,854,775,807 (2<sup>63</sup> - 1) |

> Kotlinでは符号付き整数型に加えて、符号なし整数型（unsigned integer types）も提供されています。
> 符号なし整数は異なるユースケースを想定しているため、別のセクションで説明します。
> [](unsigned-integer-types.md) を参照してください。
> 
{style="tip"}

明示的な型指定をせずに変数を初期化すると、コンパイラは `Int` を起点として、その値を表すのに十分な最小の範囲を持つ型を自動的に推論します。値が `Int` の範囲を超えない場合は `Int` 型になります。その範囲を超える場合は `Long` 型になります。明示的に `Long` 型の値を指定するには、値の末尾にサフィックス `L` を付けます。
`Byte` 型や `Short` 型を使用するには、宣言時に型を明示的に指定してください。
明示的に型を指定すると、コンパイラは値が指定した型の範囲を超えていないかチェックを行います。

```kotlin
val one = 1 // Int
val threeBillion = 3000000000 // Long
val oneLong = 1L // Long
val oneByte: Byte = 1
```

## 浮動小数点型

実数を表すために、Kotlinは [IEEE 754 標準](https://en.wikipedia.org/wiki/IEEE_754)に準拠した浮動小数点型 `Float` と `Double` を提供しています。
`Float` は IEEE 754 の「単精度（single precision）」を、`Double` は「倍精度（double precision）」を反映しています。

これらの型はサイズが異なり、それぞれ異なる精度の浮動小数点数を提供します：

| 型        | サイズ (ビット) | 有効桁（ビット） | 指数（ビット） | 10進数での桁数 |
|----------|-------------|------------------|---------------|----------------|
| `Float`  | 32          | 24               | 8             | 6-7            |
| `Double` | 64          | 53               | 11            | 15-16          |    

`Double` および `Float` の変数は、小数部分を持つ数値でのみ初期化できます。
小数部分は整数部分とピリオド (`.`) で区切ります。

小数を含む数値で初期化された変数に対して、コンパイラは `Double` 型を推論します：

```kotlin
val pi = 3.14          // Double

val one: Double = 1    // Intが推論されるためエラー
// Initializer type mismatch（初期化子の型不一致）

val oneDouble = 1.0    // Double
```
{validate="false"}

値に対して明示的に `Float` 型を指定するには、サフィックス `f` または `F` を付けます。
この方法で指定された値が 7 桁を超える場合、値は丸められます：

```kotlin
val e = 2.7182818284          // Double
val eFloat = 2.7182818284f    // Float、実際の値は 2.7182817
```

他の言語とは異なり、Kotlinには数値の暗黙的な拡大型変換（widening conversions）はありません。
例えば、`Double` パラメータを持つ関数は `Double` 値のみで呼び出すことができ、`Float`、`Int`、その他の数値型では呼び出せません：

```kotlin
fun main() {
//sampleStart
    fun printDouble(x: Double) { print(x) }

    val x = 1.0
    val xInt = 1    
    val xFloat = 1.0f 

    printDouble(x)
    
    printDouble(xInt)   
    // Argument type mismatch（引数の型不一致）
    
    printDouble(xFloat)
    // Argument type mismatch（引数の型不一致）
//sampleEnd
}
```
{kotlin-runnable="true" validate="false"}

数値を別の型に変換するには、[明示的な変換](#explicit-number-conversions)を使用してください。

## 数値のリテラル定数

整数値にはいくつかの種類のリテラル定数があります：

* 10進数: `123`
* Long型（大文字の `L` で終わる）: `123L`
* 16進数: `0x0F`
* 2進数: `0b00001011`

> Kotlinでは、8進数のリテラルはサポートされていません。
>
{style="note"}

Kotlinは浮動小数点数の従来の表記法もサポートしています：

* Double型（小数部分が文字で終わらない場合のデフォルト）: `123.5`, `123.5e10`
* Float型（文字 `f` または `F` で終わる）: `123.5f`

数値定数を読みやすくするために、アンダースコアを使用できます：

```kotlin
val oneMillion = 1_000_000
val creditCardNumber = 1234_5678_9012_3456L
val socialSecurityNumber = 999_99_9999L
val hexBytes = 0xFF_EC_DE_5E
val bytes = 0b11010010_01101001_10010100_10010010
val bigFractional = 1_234_567.7182818284
```

> 符号なし整数のリテラルには特別なサフィックスもあります。  
> 詳細は [符号なし整数型のリテラル](unsigned-integer-types.md) をお読みください。
> 
{style="tip"}

## Java仮想マシン（JVM）における数値のボックス化とキャッシュ

JVMは、Null 許容ではない数値型を `int`、`long`、`double` などのプリミティブ型として格納します。
しかし、[ジェネリック型](generics.md)を使用する場合や、`Int?` のような Null 許容の数値型を使用する場合、数値はボックス化（boxed）され、オブジェクトとして表現されます。

JVMは、小さな数値に対してボックス化された表現をキャッシュすることで、[メモリ最適化手法](https://docs.oracle.com/javase/specs/jls/se22/html/jls-5.html#jls-5.1.7) を適用します。その結果、同じ値を持つボックス化された数値は [参照の等価性](equality.md#referential-equality) が認められる場合があります。

例えば、JVMは `-128` から `127` までの範囲の `Integer` 値をキャッシュします。そのため、以下のコードの結果は `true` になります：

```kotlin
fun main() {
//sampleStart
    val score: Int = 100
    val savedScore: Int? = score
    val displayedScore: Int? = score
    
    println(savedScore === displayedScore) // true
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

キャッシュされる範囲外の数値の場合、ボックス化された値は個別のオブジェクトになります。その場合、値が [構造的に等しく](equality.md#structural-equality) ても、参照の等価性は認められません。そのため、数値の比較には `==` を使用してください：

```kotlin
fun main() {
//sampleStart
    val score: Int = 10000
    val savedScore: Int? = score
    val displayedScore: Int? = score

    println(savedScore === displayedScore) // false
    println(savedScore == displayedScore)  // true
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

## 明示的な数値変換

表現形式が異なるため、数値型同士は互いの *サブタイプではありません*。
その結果、小さな型から大きな型への暗黙的な変換（およびその逆）は行われません。
例えば、`Byte` 型の値を `Int` 変数に代入するには、明示的な変換が必要です：

```kotlin
fun main() {
//sampleStart
    val byte: Byte = 1
    // OK、リテラルは静的にチェックされます
    
    val intAssignedByte: Int = byte 
    // Initializer type mismatch（初期化子の型不一致）
    
    val intConvertedByte: Int = byte.toInt()
    
    println(intConvertedByte)
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" validate="false"}

すべての数値型は、他の型への変換をサポートしています：

* `toByte(): Byte` ([Float](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin/-float/to-byte.html) および [Double](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin/-double/to-byte.html) では非推奨)
* `toShort(): Short`
* `toInt(): Int`
* `toLong(): Long`
* `toFloat(): Float`
* `toDouble(): Double`

多くの場合、型はコンテキストから推論され、算術演算子は変換を自動的に処理するようにオーバーロードされているため、明示的な変換は必要ありません。例えば：

```kotlin
fun main() {
//sampleStart
    val l = 1L + 3       // Long + Int => Long
    println(l is Long)   // true
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.5"}

### 暗黙的な変換を行わない理由

Kotlinが暗黙的な変換をサポートしていないのは、それらが予期しない動作を引き起こす可能性があるためです。

もし異なる型の数値が暗黙的に変換されると、等価性（equality）や同一性（identity）が知らぬ間に失われる可能性があります。
例えば、`Int` が `Long` のサブタイプだったと仮定してみましょう：

```kotlin
// 仮定のコードであり、実際にはコンパイルされません：
val a: Int? = 1    // ボックス化された Int (java.lang.Integer)
val b: Long? = a   // 暗黙的な変換により、ボックス化された Long (java.lang.Long) になる
print(b == a)      // Long.equals() は値だけでなく、相手が Long かどうかもチェックするため "false" を出力する
```

## 数値の演算

Kotlinは数値に対する標準的な算術演算（`+`, `-`, `*`, `/`, `%`）をサポートしています。これらは適切なクラスのメンバとして宣言されています：

```kotlin
fun main() {
//sampleStart
    println(1 + 2)
    println(2_500_000_000L - 1L)
    println(3.14 * 2.71)
    println(10.0 / 3)
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

カスタムの数値クラスでこれらの演算子をオーバーライドすることもできます。
詳細は [演算子のオーバーロード](operator-overloading.md) を参照してください。

### 整数の除算

整数同士の除算は常に整数を返します。小数部分は切り捨てられます。

```kotlin
fun main() {
//sampleStart
    val x = 5 / 2
    println(x == 2.5) 
    // Operator '==' cannot be applied to 'Int' and 'Double'
    // 演算子 '==' を 'Int' と 'Double' に適用することはできません
    
    println(x == 2)   
    // true
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" validate="false"}

これは、任意の 2 つの整数型間の除算にも当てはまります：

```kotlin
fun main() {
//sampleStart
    val x = 5L / 2
    println (x == 2)
    // エラー。Long (x) を Int (2) と比較できないため
    
    println(x == 2L)
    // true
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" validate="false"}

小数部分を含む除算結果を返すには、引数のいずれかを明示的に浮動小数点型に変換してください：

```kotlin
fun main() {
//sampleStart
    val x = 5 / 2.toDouble()
    println(x == 2.5)
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

### ビット演算

Kotlinは整数に対して一連の *ビット演算* を提供しています。これらは数値の表現形式であるバイナリレベルでビットを直接操作します。
ビット演算は中置形式（infix form）で呼び出すことができる関数として表現されます。これらは `Int` と `Long` にのみ適用可能です：

```kotlin
fun main() {
//sampleStart
    val x = 1
    val xShiftedLeft = (x shl 2)
    println(xShiftedLeft)  
    // 4
    
    val xAnd = x and 0x000FF000
    println(xAnd)          
    // 0
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

ビット演算の全リスト：

* `shl(bits)` – 符号付き左シフト
* `shr(bits)` – 符号付き右シフト
* `ushr(bits)` – 符号なし右シフト
* `and(bits)` – ビット単位の **AND**
* `or(bits)` – ビット単位の **OR**
* `xor(bits)` – ビット単位の **XOR**
* `inv()` – ビット単位の反転

### 浮動小数点数の比較

このセクションで扱う浮動小数点数の演算は以下の通りです：

* 等価性チェック: `a == b` および `a != b`
* 比較演算子: `a < b`, `a > b`, `a <= b`, `a >= b`
* 範囲の作成と範囲チェック: `a..b`, `x in a..b`, `x !in a..b`

オペランド `a` と `b` が `Float` または `Double`（あるいはそれらの Null 許容型）であることが静的にわかっている場合（型が宣言されている、推論されている、または [スマートキャスト](typecasts.md#smart-casts) の結果である場合）、数値およびそれらが形成する範囲に対する演算は [IEEE 754 浮動小数点演算標準](https://en.wikipedia.org/wiki/IEEE_754) に従います。

しかし、ジェネリックなユースケースをサポートし、全順序（total ordering）を提供するために、静的に浮動小数点型として型付けされて **いない** オペランドに対しては挙動が異なります。例えば、`Any`、`Comparable<...>`、または `Collection<T>` 型などの場合です。この場合、演算は `Float` と `Double` のための `equals` および `compareTo` 実装を使用します。その結果：

* `NaN` は自分自身と等しいとみなされます
* `NaN` は `POSITIVE_INFINITY` を含む他のどの要素よりも大きいとみなされます
* `-0.0` は `0.0` よりも小さいとみなされます

以下は、静的に浮動小数点型として型付けされたオペランド (`Double.NaN`) と、静的に浮動小数点型として型付けされて **いない** オペランド (`listOf(T)`) の挙動の違いを示す例です。

```kotlin
fun main() {
    //sampleStart
    // 静的に浮動小数点型として型付けされたオペランド
    println(Double.NaN == Double.NaN)                 // false
    
    // 静的に浮動小数点型として型付けされていないオペランド
    // そのため、NaN は自分自身と等しい
    println(listOf(Double.NaN) == listOf(Double.NaN)) // true

    // 静的に浮動小数点型として型付けされたオペランド
    println(0.0 == -0.0)                              // true
    
    // 静的に浮動小数点型として型付けされていないオペランド
    // そのため、-0.0 は 0.0 未満
    println(listOf(0.0) == listOf(-0.0))              // false

    println(listOf(Double.NaN, Double.POSITIVE_INFINITY, 0.0, -0.0).sorted())
    // [-0.0, 0.0, Infinity, NaN]
    //sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-numbers-floating-comp"}