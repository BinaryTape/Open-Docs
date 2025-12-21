[//]: # (title: 数値)

## 整数型

Kotlinには、数値を表現するための組み込み型が用意されています。
整数値には、サイズと値の範囲が異なる4つの型があります。

| 型	    | サイズ (ビット) | 最小値                                    | 最大値                                      |
|----------|-------------|----------------------------------------------|------------------------------------------------|
| `Byte`	  | 8           | -128                                         | 127                                            |
| `Short`	 | 16          | -32768                                       | 32767                                          |
| `Int`	   | 32          | -2,147,483,648 (-2<sup>31</sup>)             | 2,147,483,647 (2<sup>31</sup> - 1)             |
| `Long`	  | 64          | -9,223,372,036,854,775,808 (-2<sup>63</sup>) | 9,223,372,036,854,775,807 (2<sup>63</sup> - 1) |

> 符号付き整数型に加えて、Kotlinは符号なし整数型も提供しています。
> 符号なし整数は異なるユースケースを対象としているため、別個に説明します。
> [](unsigned-integer-types.md)を参照してください。
>
{style="tip"}

明示的な型指定なしに変数を初期化すると、コンパイラは値を表現するのに十分な最小範囲の型を`Int`から自動的に推論します。`Int`の範囲を超えない場合、型は`Int`になります。その範囲を超える場合、型は`Long`になります。`Long`値を明示的に指定するには、値にサフィックス`L`を付加します。
`Byte`または`Short`型を使用するには、宣言で明示的に指定します。明示的な型指定は、指定された型の範囲を値が超えていないかをコンパイラにチェックさせます。

```kotlin
val one = 1 // Int
val threeBillion = 3000000000 // Long
val oneLong = 1L // Long
val oneByte: Byte = 1
```

## 浮動小数点型

実数には、Kotlinは[IEEE 754標準](https://en.wikipedia.org/wiki/IEEE_754)に準拠する浮動小数点型`Float`と`Double`を提供します。
`Float`はIEEE 754の_単精度_を反映し、`Double`は_倍精度_を反映します。

これらの型はサイズが異なり、異なる精度の浮動小数点数を格納できます。

| 型	    | サイズ (ビット) | 有効桁数 (ビット) | 指数部 (ビット) | 10進数の桁数 |
|----------|-------------|------------------|---------------|----------------|
| `Float`	 | 32          | 24               | 8             | 6-7            |
| `Double` | 64          | 53               | 11            | 15-16          |

`Double`および`Float`変数は、小数部を持つ数値でのみ初期化できます。
小数部と整数部はピリオド (`.`) で区切ります。

小数値で初期化された変数に対しては、コンパイラは`Double`型を推論します。

```kotlin
val pi = 3.14          // Double

val one: Double = 1    // Int is inferred
// Initializer type mismatch

val oneDouble = 1.0    // Double
```
{validate="false"}

値に対して明示的に`Float`型を指定するには、サフィックス`f`または`F`を追加します。
この方法で指定された値が10進数で7桁を超える場合、丸められます。

```kotlin
val e = 2.7182818284          // Double
val eFloat = 2.7182818284f    // Float, actual value is 2.7182817
```

他のいくつかの言語とは異なり、Kotlinでは数値に対する暗黙的な拡大変換はありません。
たとえば、`Double`パラメータを持つ関数は、`Double`値でのみ呼び出すことができ、`Float`、`Int`、または他の数値では呼び出すことができません。

```kotlin
fun main() {
//sampleStart
    fun printDouble(x: Double) { print(x) }

    val x = 1.0
    val xInt = 1
    val xFloat = 1.0f

    printDouble(x)

    printDouble(xInt)
    // Argument type mismatch

    printDouble(xFloat)
    // Argument type mismatch
//sampleEnd
}
```
{kotlin-runnable="true" validate="false"}

数値型を異なる型に変換するには、[明示的な数値変換](#explicit-number-conversions)を使用します。

## 数値リテラル

整数値にはいくつかの種類のリテラル定数があります。

*   10進数: `123`
*   大文字の`L`で終わる`Long`型: `123L`
*   16進数: `0x0F`
*   2進数: `0b00001011`

> Kotlinでは8進数リテラルはサポートされていません。
>
{style="note"}

Kotlinは浮動小数点数の従来の表記法もサポートしています。

*   `Double`型 (小数部が文字で終わらない場合のデフォルト): `123.5`, `123.5e10`
*   文字`f`または`F`で終わる`Float`型: `123.5f`

数値定数を読みやすくするためにアンダースコアを使用できます。

```kotlin
val oneMillion = 1_000_000
val creditCardNumber = 1234_5678_9012_3456L
val socialSecurityNumber = 999_99_9999L
val hexBytes = 0xFF_EC_DE_5E
val bytes = 0b11010010_01101001_10010100_10010010
val bigFractional = 1_234_567.7182818284
```

> 符号なし整数リテラルには特殊なサフィックスもあります。
> [符号なし整数型のリテラル](unsigned-integer-types.md)について詳しくはこちらをご覧ください。
>
{style="tip"}

## Java仮想マシンにおける数値のボックス化とキャッシュ

JVMが数値を格納する方法は、小さい (バイトサイズの) 数値にデフォルトで使用されるキャッシュのため、コードが直感に反する動作をする可能性があります。

JVMは数値をプリミティブ型 (`int`、`double`など) として格納します。
[ジェネリクス](generics.md)を使用したり、`Int?`のようなnull許容の数値参照を作成したりすると、数値は`Integer`や`Double`のようなJavaクラスにボックス化されます。

JVMは、`Integer`や`-128`から`127`までの数値を表す他のオブジェクトに[メモリ最適化手法](https://docs.oracle.com/javase/specs/jls/se22/html/jls-5.html#jls-5.1.7)を適用します。
そのようなオブジェクトへのすべてのnull許容参照は、同じキャッシュされたオブジェクトを参照します。
たとえば、以下のコードのnull許容オブジェクトは[参照が等しく](equality.md#referential-equality)なります。

```kotlin
fun main() {
//sampleStart
    val a: Int = 100
    val boxedA: Int? = a
    val anotherBoxedA: Int? = a

    println(boxedA === anotherBoxedA) // true
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

この範囲外の数値の場合、null許容オブジェクトは異なりますが、[構造的に等しく](equality.md#structural-equality)なります。

```kotlin
fun main() {
//sampleStart
    val b: Int = 10000
    val boxedB: Int? = b
    val anotherBoxedB: Int? = b

    println(boxedB === anotherBoxedB) // false
    println(boxedB == anotherBoxedB) // true
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

このため、Kotlinはボックス化可能な数値とリテラルとの参照等価性の使用について、以下のメッセージで警告します: `"Identity equality for arguments of types ... and ... is prohibited."`
`Int`、`Short`、`Long`、`Byte`型 (および`Char`、`Boolean`) を比較する場合は、一貫した結果を得るために構造等価性チェックを使用してください。

## 明示的な数値変換

異なる表現のため、数値型は互いの_サブタイプではありません_。
結果として、より小さい型がより大きい型に暗黙的に変換されることは_なく_、その逆も同様です。
たとえば、`Byte`型の値を`Int`変数に代入するには、明示的な変換が必要です。

```kotlin
fun main() {
//sampleStart
    val byte: Byte = 1
    // OK, literals are checked statically

    val intAssignedByte: Int = byte
    // Initializer type mismatch

    val intConvertedByte: Int = byte.toInt()

    println(intConvertedByte)
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" validate="false"}

すべての数値型は、他の型への変換をサポートしています。

*   `toByte(): Byte` ([Float](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin/-float/to-byte.html)および[Double](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin/-double/to-byte.html)では非推奨)
*   `toShort(): Short`
*   `toInt(): Int`
*   `toLong(): Long`
*   `toFloat(): Float`
*   `toDouble(): Double`

多くの場合、型がコンテキストから推論され、算術演算子が変換を自動的に処理するようにオーバーロードされているため、明示的な変換は必要ありません。例:

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

Kotlinは暗黙的な変換をサポートしていません。これは、予期せぬ挙動につながる可能性があるためです。

異なる型の数値が暗黙的に変換された場合、等価性と同一性を静かに失うことがあります。
たとえば、`Int`が`Long`のサブタイプであったと想像してみてください。

```kotlin
// Hypothetical code, does not actually compile:
val a: Int? = 1    // A boxed Int (java.lang.Integer)
val b: Long? = a   // Implicit conversion yields a boxed Long (java.lang.Long)
print(b == a)      // Prints "false" as Long.equals() checks not only the value but whether the other number is Long as well
```

## 数値演算

Kotlinは数値に対する標準的な算術演算子 (`+`、`-`、`*`、`/`、`%`) をサポートしています。これらは適切なクラスのメンバーとして宣言されています。

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

これらの演算子は、カスタム数値クラスでオーバーライドできます。
詳細は[演算子オーバーロード](operator-overloading.md)を参照してください。

### 整数除算

整数同士の除算は常に整数を返します。小数部はすべて破棄されます。

```kotlin
fun main() {
//sampleStart
    val x = 5 / 2
    println(x == 2.5)
    // Operator '==' cannot be applied to 'Int' and 'Double'

    println(x == 2)
    // true
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" validate="false"}

これは、任意の2つの整数型間の除算に当てはまります。

```kotlin
fun main() {
//sampleStart
    val x = 5L / 2
    println (x == 2)
    // Error, as Long (x) cannot be compared to Int (2)

    println(x == 2L)
    // true
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" validate="false"}

小数部を含む除算結果を返すには、引数のいずれかを明示的に浮動小数点型に変換します。

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

Kotlinは整数に対する_ビット演算_のセットを提供します。これらは、数値の表現のビットと直接バイナリレベルで動作します。
ビット演算は、中置記法で呼び出すことができる関数として表現されます。これらは`Int`と`Long`にのみ適用できます。

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

ビット演算の完全なリスト:

*   `shl(bits)` – 符号付き左シフト
*   `shr(bits)` – 符号付き右シフト
*   `ushr(bits)` – 符号なし右シフト
*   `and(bits)` – ビットごとの**AND**
*   `or(bits)` – ビットごとの**OR**
*   `xor(bits)` – ビットごとの**XOR**
*   `inv()` – ビットごとの反転

### 浮動小数点数の比較

このセクションで説明する浮動小数点数の演算は次のとおりです。

*   等価性チェック: `a == b` および `a != b`
*   比較演算子: `a < b`、`a > b`、`a <= b`、`a >= b`
*   範囲のインスタンス化と範囲チェック: `a..b`、`x in a..b`、`x !in a..b`

オペランド`a`と`b`が`Float`または`Double`、あるいはそのnull許容の対応物 (型が宣言されているか、推論されているか、[スマートキャスト](typecasts.md#smart-casts)の結果である場合) であると静的に判明している場合、数値に対する演算とそれらが形成する範囲は、[IEEE 754 浮動小数点算術標準](https://en.wikipedia.org/wiki/IEEE_754)に従います。

ただし、汎用的なユースケースをサポートし、全順序を提供するために、浮動小数点数として静的に型付けされていないオペランドについては動作が異なります。たとえば、`Any`、`Comparable<...>`、または`Collection<T>`型などです。この場合、演算は`Float`および`Double`の`equals`および`compareTo`の実装を使用します。その結果、次のようになります。

*   `NaN`はそれ自身と等しいと見なされる
*   `NaN`は`POSITIVE_INFINITY`を含む他のどの要素よりも大きいと見なされる
*   `-0.0`は`0.0`よりも小さいと見なされる

ここでは、浮動小数点数として静的に型付けされたオペランド (`Double.NaN`) と、浮動小数点数として静的に型付けされていないオペランド (`listOf(T)`) の間の動作の違いを示す例を示します。

```kotlin
fun main() {
    //sampleStart
    // Operand statically typed as floating-point number
    println(Double.NaN == Double.NaN)                 // false

    // Operand NOT statically typed as floating-point number
    // So NaN is equal to itself
    println(listOf(Double.NaN) == listOf(Double.NaN)) // true

    // Operand statically typed as floating-point number
    println(0.0 == -0.0)                              // true

    // Operand NOT statically typed as floating-point number
    // So -0.0 is less than 0.0
    println(listOf(0.0) == listOf(-0.0))              // false

    println(listOf(Double.NaN, Double.POSITIVE_INFINITY, 0.0, -0.0).sorted())
    // [-0.0, 0.0, Infinity, NaN]
    //sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-numbers-floating-comp"}