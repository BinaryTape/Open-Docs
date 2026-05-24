[//]: # (title: 数値)
[//]: # (description: 数値型、リテラル、変換、算術演算、オーバーフロー、JVM固有の挙動など、Kotlinでの数値の使用方法について学びます。)

Kotlinの数値型は以下を表現します：
* 整数値 ([Byte](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin/-byte/)、[Short](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin/-short/)、[Int](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin/-int/)、[Long](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin/-long/))
* 浮動小数点数値 ([Float](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin/-float/)、[Double](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin/-double/))

数値型は、算術演算、カウンタ、測定、その他の計算などの数値データの格納と処理に使用します。

## 数値型の選択

ほとんどの場合、タスクに適した数値型を決定するために、以下のルールを参考にできます：

* 整数には `Int` を使用する。
* `Int` の範囲を超える整数には `Long` を使用する。
* 小数には `Double` を使用する。
* 低い精度が許容される場合や必要な場合には `Float` を使用する。
* APIやデータ形式で要求される場合には `Byte` や `Short` を使用する。

> Kotlinでは、ベータ機能として [](unsigned-integer-types.md) も提供されています。 
>
{style="tip"}

## 整数型

Kotlinは、サイズと値の範囲が異なる4つの整数型を提供しています：

| 型        | サイズ (ビット) | 最小値                                         | 最大値                                           |
|----------|-------------|----------------------------------------------|------------------------------------------------|
| `Byte`   | 8           | -128                                         | 127                                            |
| `Short`  | 16          | -32768                                       | 32767                                          |
| `Int`    | 32          | -2,147,483,648 (-2<sup>31</sup>)             | 2,147,483,647 (2<sup>31</sup> - 1)             |
| `Long`   | 64          | -9,223,372,036,854,775,808 (-2<sup>63</sup>) | 9,223,372,036,854,775,807 (2<sup>63</sup> - 1) |

### 整数値の宣言

Kotlinは整数値に対して以下のリテラル形式をサポートしています：

* 10進数: `123`
* 16進数: `0x0F`
* 2進数: `0b00001011`

> Kotlinでは、8進数のリテラルはサポートされていません。
>
{style="note"}

数値変数を宣言するには、型を明示的に指定します： 

```kotlin
val one: Int = 1

// 読みやすさを向上させるためにアンダースコアを使用できます
val oneBillion: Long = 1_000_000_000
val hexBytes: Int = 0x7F_EC_DE_5E
val bytes: Int = 0b01010010_01101001_10010100_10010010

val oneByte: Byte = 1
val oneShort: Short = 1
```

`Long` 値を宣言するために、サフィックス `L` を付けることもできます：

```kotlin
val oneLong = 1L
```

数値型を明示的に宣言すると、コンパイラは値がその型の範囲内に収まっているかチェックします：

```kotlin
// 値がByteに収まる場合
val oneByte: Byte = 1

// エラー：値がByteに収まらない場合
val tooBig: Byte = 128
```

数値型を指定しない場合、Kotlinは値が `Int` の範囲に収まれば `Int` と推論します。それ以外の場合は `Long` と推論します：

```kotlin
val million = 1_000_000 // Int
val threeBillion = 3_000_000_000 // Long
```

値が存在しない可能性がある場合は、Null 許容型を使用します：

```kotlin
val maybeAbsent: Int? = null
```

## 浮動小数点型

小数部分を持つ数値のために、Kotlinは `Float` と `Double` を提供しています。

浮動小数点型は [IEEE 754 標準](https://en.wikipedia.org/wiki/IEEE_754)に従います。
`Float` は「単精度（single precision）」を、`Double` は「倍精度（double precision）」を反映しています。

浮動小数点型はサイズと精度が異なります：

| 型        | サイズ (ビット) | 有効桁（ビット） | 指数（ビット） | 10進数での桁数 |
|----------|-------------|------------------|---------------|----------------|
| `Float`  | 32          | 24               | 8             | 6-7            |
| `Double` | 64          | 53               | 11            | 15-16          |    

### 浮動小数点数値の宣言

浮動小数点リテラルを宣言するには、小数点 (`.`) を含めるか、指数表記を使用します：

```kotlin
val pi = 3.14
val avogadro = 6.02214076e23
```

デフォルトでは、Kotlinは浮動小数点リテラルを `Double` として推論します。 
`Float` を宣言するには、サフィックス `f` または `F` を付けます：

```kotlin
val pi = 3.14 // Double
val eFloat = 2.7182817f // Float
```

> `Float` が保持できる以上の精度を持つ `Float` リテラルは、Kotlinによって丸められます。
>
{style="note"}

値が存在しない可能性がある場合は、Null 許容型を使用します：

```kotlin
val maybeAbsent: Double? = null
```

## 算術演算

Kotlinは数値に対する標準的な算術演算 `+`、`-`、`*`、`/`、`%` をサポートしています。

これらの演算子を使用して一般的な計算を行います：

```kotlin
fun main() {
//sampleStart
    println(1 + 2) // 3
    println(2_500_000_000L - 1L) // 2499999999
    println(3.14 * 2.71) // 8.5094
    println(10.0 / 3) // 3.3333333333333335
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

結果の型はオペランドの型に依存します。詳細は [](#mixed-numeric-expressions) で確認してください。

> カスタム数値クラスでこれらの演算子をオーバーライドできます。
> 詳細は [演算子のオーバーロード](operator-overloading.md) を参照してください。
>
{style="tip"}

### 整数の除算

整数値同士の除算は常に整数の結果を返します。コンパイラは小数部分を切り捨てます：

```kotlin
fun main() {
//sampleStart
    val intValue = 5 / 2
    println(intValue) // 2
    
    val longValue = 5L / 2
    println(longValue) // 2
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

浮動小数点の値を返すには、少なくとも1つのオペランドを `Float` または `Double` にしてください：

```kotlin
fun main() {
//sampleStart
    val a = 5 / 2.0
    println(a) // 2.5
    
    val b = 5 / 2.toDouble()
    println(b) // 2.5
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

## 型変換

数値型は互いのサブタイプではありません。Kotlinは、暗黙的なデータ損失や予期しない動作を避けるために、明示的な変換を必要とします。

例えば、`Double` を期待する関数は、変換なしに `Int` や `Float` の値を受け取ることはできません：

```kotlin
fun main() {
//sampleStart
    fun printDouble(x: Double) { 
        print(x) 
    }

    val x = 1.0
    val xInt = 1
    val xFloat = 1.0f
    val one: Double = 1 // エラー：初期化子の型不一致（initializer type mismatch）

    printDouble(x) // OK
    printDouble(xInt) // エラー：引数の型不一致（argument type mismatch）
    printDouble(xFloat) // エラー：引数の型不一致（argument type mismatch）
//sampleEnd
}
```
{kotlin-runnable="true" validate="false"}

すべての数値型は、他の数値型への変換をサポートしています。
数値を別の型に変換するには、明示的な変換関数を使用します：

* `toByte()`
* `toShort()`
* `toInt()`
* `toLong()`
* `toFloat()`
* `toDouble()`

例えば、以下のコードは `Int` 値を `Double` に変換します：

```kotlin
fun main() {
//sampleStart
    val intValue: Int = 1
    val doubleValue = intValue.toDouble()
    
    println(doubleValue) // 1.0
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

浮動小数点値を整数型に変換する場合、コンパイラは小数部分を切り捨てます：

```kotlin
fun main() {
//sampleStart
    val d: Double = 1.5
    val l: Long = d.toLong()
    
    println(l) // 1
//sampleEnd    
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

### 混合数値式

Kotlinは代入や関数の引数における暗黙的な変換をサポートしていません。
しかし、算術式の中で異なる数値型を組み合わせることはできます。その場合、Kotlinはオペランドの型に基づいて結果の型を決定し、算術演算子が自動的に変換を処理します：

```kotlin
val intNumber: Int = 1
val longNumber: Long = 1000
val result = intNumber + longNumber // 1001, Long
```

結果をより小さな型に代入しようとすると、コンパイラはエラーを報告します：

```kotlin
val intNumber: Int = 1
val longNumber: Long = 1000
val result: Int = intNumber + longNumber 
// エラー：初期化子の型不一致（Initializer type mismatch）
```

## データオーバーフロー

数値型は、定義された範囲内の値のみを表現できます。

演算の結果がその範囲外になった場合、オーバーフローが発生します。
値をより小さな数値型に変換した場合、変換後の値が元の数値を保持できない場合があります。

この動作は、コンパイラがそれを受け入れたとしても、コードの結果に影響を与える可能性があります。

### 演算におけるオーバーフロー

各整数型は、定義された範囲内の値のみを格納できます。算術演算の結果がその範囲を超えると、「データオーバーフロー（data overflow）」が発生します：

```kotlin
fun main(){
//sampleStart
    val intNumber: Int = 2147483647
    // Intの最大値は 2147483647
    println(intNumber + 1) // -2147483648
//sampleEnd    
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

ここでは、値が `Int` に収まらなくなったため、結果がラップアラウンド（最小値に循環）しています。

> 整数オーバーフローが発生しても、コンパイラは自動的にエラーを出すことはありません。
>
{style="note"}

### 符号反転におけるオーバーフロー

符号反転（否定）の間にもオーバーフローが発生する可能性があります。
例えば、`Int.MIN_VALUE` の正の対応する値を `Int` として表現することはできません。

```kotlin
fun main(){
//sampleStart
    val min = Int.MIN_VALUE
    println(-min) // -2147483648
//sampleEnd    
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

### 縮小変換

値をより小さな整数型に変換すると、結果が元の数値を保持できない場合があります：

```kotlin
fun main() {
//sampleStart
    val large: Int = 130
    val narrowed: Byte = large.toByte()

    println(narrowed) // -126
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

ただし、浮動小数点型は [IEEE 754 標準](https://en.wikipedia.org/wiki/IEEE_754)に従っているため、非常に大きな結果は `Infinity`（無限大）になります：

```kotlin
fun main() {
//sampleStart
    println(Double.MAX_VALUE * 2) // Infinity
//sampleEnd    
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

## ビット演算

Kotlinは `Int` と `Long` に対して「ビット演算」を提供しています。これらの演算は、一連の[中置関数（infix functions）](functions.md#infix-notation)および `inv()` で表されます。

```kotlin
fun main() {
//sampleStart
    val x = 1
    
    println(x shl 2) // 4
    println(x and 0x000FF000) // 0
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

ビット演算には以下が含まれます：

* `shl()` – 符号付き左シフト
* `shr()` – 符号付き右シフト
* `ushr()` – 符号なし右シフト
* `and()` – ビット単位の AND
* `or()` – ビット単位の OR
* `xor()` – ビット単位の XOR
* `inv()` – ビット単位の反転

## 浮動小数点数の比較

Kotlinにおける浮動小数点数の比較は、オペランドの静的な型に依存します。

オペランドが `Float` または `Double` であることが静的にわかっている場合、数値およびそれらが形成する範囲に対する演算は [IEEE 754 浮動小数点演算標準](https://en.wikipedia.org/wiki/IEEE_754)に従います。

しかし、ジェネリックなユースケース（`Any`、`Comparable<...>`、`Collection<T>` など）において、静的に浮動小数点型として型付けされていないオペランドに対しては挙動が異なります。これらの場合、Kotlinは `Float` と `Double` のための `equals()` および `compareTo()` 実装を使用します。 

その結果：

* `NaN` は自分自身と等しいとみなされます
* `NaN` は `POSITIVE_INFINITY` を含む他のどの要素よりも大きいとみなされます
* `-0.0` は `0.0` よりも小さいとみなされます

以下の例は、静的に浮動小数点型として型付けされたオペランドと、ジェネリック型を通じて使用されるオペランドの違いを示しています：

```kotlin
//sampleStart  
fun generalizedEquals(a: Any, b: Any): Boolean {
    return a == b
}

fun main() {
    // 静的に浮動小数点型として型付けされたオペランド
    println(Double.NaN == Double.NaN) // false
    println(0.0 == -0.0) // true

    // 浮動小数点ではない静的型を通じて使用されるオペランド
    println(generalizedEquals(Double.NaN, Double.NaN)) // true
    println(generalizedEquals(0.0, -0.0)) // false
}
//sampleEnd  
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-numbers-floating-comp"}

## JVMにおける数値のボックス化とキャッシュ

JVMでは、Null 許容ではない数値は通常、`int`、`long`、`double` などのプリミティブ型を使用して格納されます。
しかし、[ジェネリック型](generics.md)を使用する場合や、`Int?` のような Null 許容の数値型を使用する場合、値はボックス化され、オブジェクトとして表現されます。

JVMは、小さな数値に対してボックス化された表現をキャッシュすることで、[メモリ最適化手法](https://docs.oracle.com/javase/specs/jls/se22/html/jls-5.html#jls-5.1.7)を適用します。その結果、同じ値を持つボックス化された数値は [参照の等価性](equality.md#referential-equality)が認められる場合があります。

例えば、JVMは `-128` から `127` までの範囲のボックス化された `Integer` 値をキャッシュします。そのため、以下のコードは `true` を返します：

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
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" validate="false"}

キャッシュされる範囲外の値の場合、ボックス化された値は個別のオブジェクトになります。その場合、値が [構造的に等しく](equality.md#structural-equality)ても、参照の等価性は認められません。そのため、数値の比較には `==` を使用してください：

```kotlin
fun main() {
//sampleStart
    val score: Int = 10000
    val savedScore: Int? = score
    val displayedScore: Int? = score

    println(savedScore === displayedScore) // false
    println(savedScore == displayedScore) // true
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" validate="false"}