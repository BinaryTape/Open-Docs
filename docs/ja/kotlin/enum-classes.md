[//]: # (title: 列挙型クラス (Enum classes))

列挙型クラス（enum class）の最も基本的なユースケースは、型安全な列挙型（enum）の実装です：

```kotlin
enum class Direction {
    NORTH, SOUTH, WEST, EAST
}
```
各列挙定数はオブジェクトです。列挙定数はコンマで区切られます。

各列挙型は列挙型クラスのインスタンスであるため、次のように初期化できます：

```kotlin
enum class Color(val rgb: Int) {
    RED(0xFF0000),
    GREEN(0x00FF00),
    BLUE(0x0000FF)
}
```

## 無名クラス

列挙定数は、対応するメソッドを持つ独自の無名クラスを宣言したり、ベースメソッドをオーバーライドしたりできます。

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

列挙型クラスでメンバーを定義する場合は、定数の定義とメンバーの定義をセミコロンで区切ってください。

## 列挙型クラスでのインターフェースの実装

列挙型クラスはインターフェースを実装できますが（クラスから派生することはできません）、すべてのエントリに対してインターフェースメンバーの共通の実装を提供するか、無名クラス内で各エントリごとに個別の実装を提供します。これは、次のように列挙型クラスの宣言に実装したいインターフェースを追加することで行います：

```kotlin
import java.util.function.BinaryOperator
import java.util.function.IntBinaryOperator

//sampleStart
enum class IntArithmetics : BinaryOperator<Int>, IntBinaryOperator {
    PLUS {
        override fun apply(t: Int, u: Int): Int = t + u
    },
    TIMES {
        override fun apply(t: Int, u: Int): Int = t * u
    };
    
    override fun applyAsInt(t: Int, u: Int) = apply(t, u)
}
//sampleEnd

fun main() {
    val a = 13
    val b = 31
    for (f in IntArithmetics.entries) {
        println("$f($a, $b) = ${f.apply(a, b)}")
    }
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.9"}

すべての列挙型クラスは、デフォルトで [Comparable](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-comparable/index.html) インターフェースを実装しています。列挙型クラスの定数は自然順序（natural order）で定義されます。詳細については、[Ordering](collection-ordering.md) を参照してください。

## 列挙定数の操作

Kotlin の列挙型クラスには、定義された列挙定数を一覧表示したり、名前で列挙定数を取得したりするための合成プロパティとメソッドがあります。これらのメソッドのシグネチャは次のとおりです（列挙型クラスの名前を `EnumClass` と想定します）：

```kotlin
EnumClass.valueOf(value: String): EnumClass
EnumClass.entries: EnumEntries<EnumClass> // 特殊な List<EnumClass>
```

以下は、これらを実際に使用した例です：

```kotlin
enum class RGB { RED, GREEN, BLUE }

fun main() {
    for (color in RGB.entries) println(color.toString()) // RED, GREEN, BLUE を出力
    println("The first color is: ${RGB.valueOf("RED")}") // "The first color is: RED" を出力
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.9" id="rgb-enums-kotlin"}

`valueOf()` メソッドは、指定された名前がクラスで定義されているどの列挙定数とも一致しない場合、`IllegalArgumentException` をスローします。

Kotlin 1.9.0 で `entries` が導入される前は、列挙定数の配列を取得するために `values()` 関数が使用されていました。

すべての列挙定数は、名前と列挙型クラスの宣言内での位置（0から開始）を取得するためのプロパティ、[`name`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-enum/name.html) および [`ordinal`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-enum/ordinal.html) も持っています：

```kotlin
enum class RGB { RED, GREEN, BLUE }

fun main() {
    //sampleStart
    println(RGB.RED.name)    // RED を出力
    println(RGB.RED.ordinal) // 0 を出力
    //sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="rgb-enums-properties-kotlin"}

> 列挙型のエントリを扱う際の繰り返しを減らすために、コンテキスト依存の解決（context-sensitive resolution、現在はプレビュー版）を試してみてください。
> この機能を使用すると、`when` 式や型指定された変数への代入時など、期待される型がわかっている場合に列挙型クラス名を省略できます。
>
> 詳細については、[Preview of context-sensitive resolution](whatsnew22.md#preview-of-context-sensitive-resolution) または関連する [KEEP 提案](https://github.com/Kotlin/KEEP/blob/improved-resolution-expected-type/proposals/context-sensitive-resolution.md) を参照してください。
>
{style="tip"}

[`enumValues<T>()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/enum-values.html) および [`enumValueOf<T>()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/enum-value-of.html) 関数を使用して、汎用的な方法で列挙型クラスの定数にアクセスできます。Kotlin 2.0.0 では、[`enumValues<T>()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/enum-values.html) 関数の代替として [`enumEntries<T>()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.enums/enum-entries.html) 関数が導入されました。`enumEntries<T>()` 関数は、指定された列挙型 `T` のすべての列挙エントリのリストを返します。

`enumValues<T>()` 関数は引き続きサポートされていますが、パフォーマンスへの影響が少ないため、代わりに `enumEntries<T>()` 関数を使用することをお勧めします。`enumValues<T>()` を呼び出すたびに新しい配列が作成されるのに対し、`enumEntries<T>()` を呼び出すと毎回同じリストが返されるため、はるかに効率的です。

例：

```kotlin
enum class RGB { RED, GREEN, BLUE }

inline fun <reified T : Enum<T>> printAllValues() {
    println(enumEntries<T>().joinToString { it.name })
}

printAllValues<RGB>() 
// RED, GREEN, BLUE
```
> インライン関数と具現化された型パラメータの詳細については、[インライン関数](inline-functions.md)を参照してください。
>
> {style="tip"}