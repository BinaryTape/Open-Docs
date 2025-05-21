---
title: 数値
---
## 整数型

Kotlin は、数値を表す一連の組み込み型を提供します。
整数については、サイズと値の範囲が異なる4つの型があります。

| 型	    | サイズ (ビット) | 最小値                                    | 最大値                                      |
|----------|-------------|----------------------------------------------|------------------------------------------------|
| `Byte`	  | 8           | -128                                         | 127                                            |
| `Short`	 | 16          | -32768                                       | 32767                                          |
| `Int`	   | 32          | -2,147,483,648 (-2<sup>31</sup>)             | 2,147,483,647 (2<sup>31</sup> - 1)             |
| `Long`	  | 64          | -9,223,372,036,854,775,808 (-2<sup>63</sup>) | 9,223,372,036,854,775,807 (2<sup>63</sup> - 1) |
:::note
符号付き整数型に加えて、Kotlin は符号なし整数型も提供します。
符号なし整数は別のユースケースを対象としているため、別途説明します。
[](unsigned-integer-types) を参照してください。

明示的な型指定なしで変数を初期化すると、コンパイラーは `Int` から始めて値を表すのに十分な最小範囲の型を自動的に推論します。`Int` の範囲を超えない場合、型は `Int` です。
その範囲を超える場合、型は `Long` です。`Long` 値を明示的に指定するには、サフィックス `L` を値に追加します。
`Byte` または `Short` 型を使用するには、宣言で明示的に指定します。
明示的な型指定により、コンパイラーは値が指定された型の範囲を超えないことを確認します。

```kotlin
val one = 1 // Int
val threeBillion = 3000000000 // Long
val oneLong = 1L // Long
val oneByte: Byte = 1
```

## 浮動小数点型

実数については、Kotlin は [IEEE 754 標準](https://en.wikipedia.org/wiki/IEEE_754) に準拠する浮動小数点型 `Float` と `Double` を提供します。
`Float` は IEEE 754 の _単精度_ を反映し、`Double` は _倍精度_ を反映します。

これらの型はサイズが異なり、異なる精度で浮動小数点数を格納できます。

| 型	    | サイズ (ビット) | 有効ビット数 | 指数ビット数 | 10進数桁数 |
|----------|-------------|------------------|---------------|----------------|
| `Float`	 | 32          | 24               | 8             | 6-7            |
| `Double` | 64          | 53               | 11            | 15-16          |    

`Double` および `Float` 変数は、小数部を持つ数値でのみ初期化できます。
小数部を整数部からピリオド (`.`) で区切ります。

小数で初期化された変数については、コンパイラーは `Double` 型を推論します。

```kotlin
val pi = 3.14          // Double

val one: Double = 1    // Int is inferred
// Initializer type mismatch

val oneDouble = 1.0    // Double
```

値に対して `Float` 型を明示的に指定するには、サフィックス `f` または `F` を追加します。
この方法で提供された値に 7 桁を超える小数点以下の桁が含まれている場合、丸められます。

```kotlin
val e = 2.7182818284          // Double
val eFloat = 2.7182818284f    // Float, actual value is 2.7182817
```

他のいくつかの言語とは異なり、Kotlin の数値には暗黙的な拡大変換はありません。
たとえば、`Double` パラメーターを持つ関数は、`Double` 値に対してのみ呼び出すことができ、`Float`、`Int`、またはその他の数値に対しては呼び出すことができません。

```kotlin
fun main() {

    fun printDouble(x: Double) { print(x) }

    val x = 1.0
    val xInt = 1    
    val xFloat = 1.0f 

    printDouble(x)
    
    printDouble(xInt)   
    // Argument type mismatch
    
    printDouble(xFloat)
    // Argument type mismatch

}
```

数値の値を異なる型に変換するには、[明示的な数値変換](#explicit-number-conversions)を使用します。

## 数値のリテラル定数

整数値のリテラル定数には、いくつかの種類があります。

* 10進数: `123`
* Long型、大文字の `L` で終わる: `123L`
* 16進数: `0x0F`
* 2進数: `0b00001011`

Kotlin では8進数リテラルはサポートされていません。

:::

Kotlin は、浮動小数点数の従来の表記法もサポートしています。

* 倍精度浮動小数点数 (小数部が文字で終わらない場合のデフォルト): `123.5`、`123.5e10`
* 単精度浮動小数点数、文字 `f` または `F` で終わる: `123.5f`

アンダースコアを使用して、数値定数を読みやすくすることができます。

```kotlin
val oneMillion = 1_000_000
val creditCardNumber = 1234_5678_9012_3456L
val socialSecurityNumber = 999_99_9999L
val hexBytes = 0xFF_EC_DE_5E
val bytes = 0b11010010_01101001_10010100_10010010
val bigFractional = 1_234_567.7182818284
```

:::tip
符号なし整数リテラル用の特別なサフィックスもあります。
[符号なし整数型のリテラル](unsigned-integer-types)の詳細をお読みください。

:::

## Java仮想マシンでの数値のボックス化とキャッシュ

JVMが数値を格納する方法は、小さい（バイトサイズの）数値にデフォルトで使用されるキャッシュが原因で、コードが直感に反する動作をする可能性があります。

JVMは数値をプリミティブ型として格納します。`int`、`double`など。
[ジェネリック型](generics)を使用するか、`Int?`などのnullableな数値参照を作成すると、数値は`Integer`や`Double`などのJavaクラスにボックス化されます。

JVMは、`Integer`や`-128`から`127`までの数値を表す他のオブジェクトに[メモリ最適化手法](https://docs.oracle.com/javase/specs/jls/se22/html/jls-5.html#jls-5.1.7)を適用します。
そのようなオブジェクトへのすべてのnullableな参照は、同じキャッシュされたオブジェクトを参照します。
たとえば、次のコードのnullableオブジェクトは[参照的に等しい](equality#referential-equality)です。

```kotlin
fun main() {

    val a: Int = 100
    val boxedA: Int? = a
    val anotherBoxedA: Int? = a
    
    println(boxedA === anotherBoxedA) // true

}
```

この範囲外の数値の場合、nullableオブジェクトは異なりますが、[構造的に等しい](equality#structural-equality)です。

```kotlin
fun main() {

    val b: Int = 10000
    val boxedB: Int? = b
    val anotherBoxedB: Int? = b
    
    println(boxedB === anotherBoxedB) // false
    println(boxedB == anotherBoxedB) // true

}
```

このため、Kotlin は、ボックス化可能な数値およびリテラルで参照の等価性を使用することについて、次のメッセージで警告します。`"Identity equality for arguments of types ... and ... is prohibited."`
`Int`、`Short`、`Long`、および `Byte` 型 (ならびに `Char` および `Boolean`) を比較する場合は、一貫した結果を得るために構造的等価性チェックを使用します。

## 明示的な数値変換

表現が異なるため、数値型は互いに _サブタイプではありません_ 。
その結果、小さい型は大きい型に暗黙的に変換されず、逆もまた同様です。
たとえば、`Byte` 型の値を `Int` 変数に割り当てるには、明示的な変換が必要です。

```kotlin
fun main() {

    val byte: Byte = 1
    // OK, literals are checked statically
    
    val intAssignedByte: Int = byte 
    // Initializer type mismatch
    
    val intConvertedByte: Int = byte.toInt()
    
    println(intConvertedByte)

}
```

すべての数値型は、他の型への変換をサポートしています。

* `toByte(): Byte` ([Float](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin/-float/to-byte.html) と [Double](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin/-double/to-byte.html) に対しては非推奨)
* `toShort(): Short`
* `toInt(): Int`
* `toLong(): Long`
* `toFloat(): Float`
* `toDouble(): Double`

多くの場合、型はコンテキストから推論され、算術演算子は変換を自動的に処理するようにオーバーロードされるため、明示的な変換は必要ありません。 例えば：

```kotlin
fun main() {

    val l = 1L + 3       // Long + Int => Long
    println(l is Long)   // true

}
```

### 暗黙的な変換に対する理由

Kotlin は、予期しない動作につながる可能性があるため、暗黙的な変換をサポートしていません。

異なる型の数値が暗黙的に変換された場合、等価性と同一性がサイレントに失われることがあります。
たとえば、`Int` が `Long` のサブタイプであると想像してください。

```kotlin
// Hypothetical code, does not actually compile:
val a: Int? = 1    // A boxed Int (java.lang.Integer)
val b: Long? = a   // Implicit conversion yields a boxed Long (java.lang.Long)
print(b == a)      // Prints "false" as Long.equals() checks not only the value but whether the other number is Long as well
```

## 数値の演算

Kotlin は、数値に対する標準的な算術演算セットをサポートしています。`+`、`-`、`*`、`/`、`%`。これらは、適切なクラスのメンバーとして宣言されています。

```kotlin
fun main() {

    println(1 + 2)
    println(2_500_000_000L - 1L)
    println(3.14 * 2.71)
    println(10.0 / 3)

}
```

これらの演算子は、カスタム数値クラスでオーバーライドできます。
詳細については、[演算子のオーバーロード](operator-overloading)を参照してください。

### 整数の除算

整数間の除算は、常に整数を返します。小数部は破棄されます。

```kotlin
fun main() {

    val x = 5 / 2
    println(x == 2.5) 
    // Operator '==' cannot be applied to 'Int' and 'Double'
    
    println(x == 2)   
    // true

}
```

これは、2 つの整数型間の除算にも当てはまります。

```kotlin
fun main() {

    val x = 5L / 2
    println (x == 2)
    // Error, as Long (x) cannot be compared to Int (2)
    
    println(x == 2L)
    // true

}
```

小数部を含む除算結果を返すには、引数のいずれかを浮動小数点型に明示的に変換します。

```kotlin
fun main() {

    val x = 5 / 2.toDouble()
    println(x == 2.5)

}
```

### ビット単位の演算

Kotlin は、整数に対する _ビット単位の演算_ のセットを提供します。これらは、数値の表現のビットを直接使用して、バイナリレベルで動作します。
ビット単位の演算は、infix 形式で呼び出すことができる関数で表されます。これらは、`Int` と `Long` にのみ適用できます。

```kotlin
fun main() {

    val x = 1
    val xShiftedLeft = (x shl 2)
    println(xShiftedLeft)  
    // 4
    
    val xAnd = x and 0x000FF000
    println(xAnd)          
    // 0

}
```

ビット単位の演算の完全なリスト:

* `shl(bits)` – 符号付き左シフト
* `shr(bits)` – 符号付き右シフト
* `ushr(bits)` – 符号なし右シフト
* `and(bits)` – ビット単位の **AND**
* `or(bits)` – ビット単位の **OR**
* `xor(bits)` – ビット単位の **XOR**
* `inv()` – ビット単位の反転

### 浮動小数点数の比較

このセクションで説明する浮動小数点数に対する演算は次のとおりです。

* 等価性チェック: `a == b` と `a != b`
* 比較演算子: `a < b`、`a > b`、`a <= b`、`a >= b`
* 範囲のインスタンス化と範囲チェック: `a..b`、`x in a..b`、`x !in a..b`

オペランド `a` と `b` が `Float` または `Double`、あるいはそれらの nullable な対応物 (型が宣言または推論されるか、[スマートキャスト](typecasts#smart-casts) の結果である) であることが静的にわかっている場合、数値とその数値が形成する範囲に対する演算は、[浮動小数点演算に関する IEEE 754 標準](https://en.wikipedia.org/wiki/IEEE_754) に従います。

ただし、ジェネリックなユースケースをサポートし、完全な順序付けを提供するために、浮動小数点数として静的に型指定されていないオペランドの動作は異なります。 たとえば、`Any`、`Comparable<...>`、または `Collection<T>` 型などです。 この場合、演算は `Float` と `Double` の `equals` と `compareTo` の実装を使用します。 その結果:

* `NaN` はそれ自体と等しいと見なされます
* `NaN` は `POSITIVE_INFINITY` を含む他のすべての要素よりも大きいと見なされます
* `-0.0` は `0.0` よりも小さいと見なされます

ここでは、浮動小数点数として静的に型指定されたオペランド (`Double.NaN`) と、浮動小数点数として静的に型指定 **されていない** オペランド (`listOf(T)`) の動作の違いを示す例を示します。

```kotlin
fun main() {

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

}
```