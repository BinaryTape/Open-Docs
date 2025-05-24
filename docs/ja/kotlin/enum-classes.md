---
title: Enumクラス
---
enum class の最も基本的なユースケースは、タイプセーフな enum の実装です。

```kotlin
enum class Direction {
    NORTH, SOUTH, WEST, EAST
}
```
それぞれの enum 定数はオブジェクトです。enum 定数はカンマで区切られます。

それぞれの enum は enum class のインスタンスであるため、次のように初期化できます。

```kotlin
enum class Color(val rgb: Int) {
    RED(0xFF0000),
    GREEN(0x00FF00),
    BLUE(0x0000FF)
}
```

## 匿名クラス

enum 定数は、対応するメソッドを持つ独自の匿名クラス、および基底メソッドのオーバーライドとともに、それらを宣言できます。

```kotlin
enum class ProtocolState {
    WAITING {
        override fun signal() = TALKING
    },

    TALKING {
        override fun signal() = WAITING
    };

    abstract fun signal(): ProtocolState
}
```

enum class がメンバを定義する場合は、定数の定義とメンバの定義をセミコロンで区切ります。

## enum class での interface の実装

enum class は interface を実装できます（ただし、クラスから派生することはできません）。すべてのエントリに対して interface メンバの共通の実装を提供するか、匿名クラス内の各エントリに対して個別の実装を提供します。
これを行うには、実装する interface を次のように enum class の宣言に追加します。

```kotlin
import java.util.function.BinaryOperator
import java.util.function.IntBinaryOperator

enum class IntArithmetics : BinaryOperator<Int>, IntBinaryOperator {
    PLUS {
        override fun apply(t: Int, u: Int): Int = t + u
    },
    TIMES {
        override fun apply(t: Int, u: Int): Int = t * u
    };
    
    override fun applyAsInt(t: Int, u: Int) = apply(t, u)
}

fun main() {
    val a = 13
    val b = 31
    for (f in IntArithmetics.entries) {
        println("$f($a, $b) = ${f.apply(a, b)}")
    }
}
```

すべての enum class は、デフォルトで [Comparable](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-comparable/index.html)
interface を実装します。enum class の定数は自然な順序で定義されています。詳細については、[Ordering](collection-ordering) を参照してください。

## enum 定数の操作

Kotlin の enum class には、定義された enum 定数をリストし、その名前で enum 定数を取得するための合成プロパティとメソッドがあります。
これらのメソッドのシグネチャは次のとおりです（enum class の名前が `EnumClass` であると仮定します）。

```kotlin
EnumClass.valueOf(value: String): EnumClass
EnumClass.entries: EnumEntries<EnumClass> // specialized List<EnumClass>
```

以下は、それらの動作例です。

```kotlin
enum class RGB { RED, GREEN, BLUE }

fun main() {
    for (color in RGB.entries) println(color.toString()) // prints RED, GREEN, BLUE
    println("The first color is: ${RGB.valueOf("RED")}") // prints "The first color is: RED"
}
```

指定された名前がクラスで定義されている enum 定数のいずれにも一致しない場合、`valueOf()` メソッドは `IllegalArgumentException` をスローします。

Kotlin 1.9.0 で `entries` が導入される前は、`values()` 関数を使用して enum 定数の配列を取得していました。

すべての enum 定数には、[`name`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-enum/name.html)
および [`ordinal`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-enum/ordinal.html) プロパティもあり、enum class の宣言でその名前と位置（0 から始まる）を取得するために使用されます。

```kotlin
enum class RGB { RED, GREEN, BLUE }

fun main() {

    println(RGB.RED.name)    // prints RED
    println(RGB.RED.ordinal) // prints 0

}
```

[`enumValues<T>()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/enum-values.html) および [`enumValueOf<T>()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/enum-value-of.html) 関数を使用すると、enum class の定数に汎用的な方法でアクセスできます。
Kotlin 2.0.0 では、[`enumEntries<T>()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.enums/enum-entries.html) 関数が [`enumValues<T>()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/enum-values.html) 関数の代わりとして導入されました。
`enumEntries<T>()` 関数は、指定された enum 型 `T` のすべての enum エントリのリストを返します。

`enumValues<T>()` 関数は引き続きサポートされていますが、パフォーマンスへの影響が少ないため、`enumEntries<T>()` 関数を使用することをお勧めします。`enumValues<T>()` を呼び出すたびに新しい配列が作成されますが、`enumEntries<T>()` を呼び出すたびに同じリストが毎回返されるため、はるかに効率的です。

次に例を示します。

```kotlin
enum class RGB { RED, GREEN, BLUE }

inline fun <reified T : Enum<T>> printAllValues() {
    println(enumEntries<T>().joinToString { it.name })
}

printAllValues<RGB>() 
// RED, GREEN, BLUE
```
> インライン関数と具象化された型パラメータの詳細については、[インライン関数](inline-functions)を参照してください。
>
>