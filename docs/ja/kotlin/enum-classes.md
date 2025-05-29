[//]: # (title: Enumクラス)

enumクラスの最も基本的なユースケースは、型安全な列挙型の実装です。

```kotlin
enum class Direction {
    NORTH, SOUTH, WEST, EAST
}
```
各列挙定数はオブジェクトです。列挙定数はコンマで区切られます。

各列挙型はenumクラスのインスタンスであるため、次のように初期化できます。

```kotlin
enum class Color(val rgb: Int) {
    RED(0xFF0000),
    GREEN(0x00FF00),
    BLUE(0x0000FF)
}
```

## 匿名クラス

列挙定数は、対応するメソッドを持つ独自の匿名クラスを宣言したり、基底メソッドをオーバーライドしたりできます。

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

enumクラスがメンバーを定義する場合、定数の定義とメンバーの定義はセミコロンで区切ります。

## enumクラスでのインターフェースの実装

enumクラスはインターフェースを実装できます（ただし、クラスから派生することはできません）。その際、すべてのエントリに対してインターフェースメンバーの共通の実装を提供するか、各エントリの匿名クラス内で個別の実装を提供できます。これは、実装したいインターフェースを次のようにenumクラス宣言に追加することで行われます。

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

すべてのenumクラスは、デフォルトで[Comparable](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-comparable/index.html)インターフェースを実装します。enumクラスの定数は自然順序で定義されます。詳細については、[Ordering](collection-ordering.md)を参照してください。

## 列挙定数の操作

Kotlinのenumクラスには、定義された列挙定数をリスト化したり、名前で列挙定数を取得したりするための合成プロパティとメソッドがあります。これらのメソッドのシグネチャは次のとおりです（enumクラスの名前が`EnumClass`であると仮定します）。

```kotlin
EnumClass.valueOf(value: String): EnumClass
EnumClass.entries: EnumEntries<EnumClass> // specialized List<EnumClass>
```

以下に、それらが実際に動作する例を示します。

```kotlin
enum class RGB { RED, GREEN, BLUE }

fun main() {
    for (color in RGB.entries) println(color.toString()) // prints RED, GREEN, BLUE
    println("The first color is: ${RGB.valueOf("RED")}") // prints "The first color is: RED"
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.9" id="rgb-enums-kotlin"}

`valueOf()`メソッドは、指定された名前がクラスで定義された列挙定数のいずれにも一致しない場合、`IllegalArgumentException`をスローします。

Kotlin 1.9.0で`entries`が導入される前は、`values()`関数が列挙定数の配列を取得するために使用されていました。

すべての列挙定数には、その名前とenumクラス宣言での位置（0から始まる）を取得するためのプロパティ[`name`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-enum/name.html)と[`ordinal`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-enum/ordinal.html)もあります。

```kotlin
enum class RGB { RED, GREEN, BLUE }

fun main() {
    //sampleStart
    println(RGB.RED.name)    // prints RED
    println(RGB.RED.ordinal) // prints 0
    //sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="rgb-enums-properties-kotlin"}

[`enumValues<T>()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/enum-values.html)関数と[`enumValueOf<T>()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/enum-value-of.html)関数を使用すると、enumクラスの定数にジェネリックな方法でアクセスできます。Kotlin 2.0.0では、[`enumValues<T>()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/enum-values.html)関数の代替として[`enumEntries<T>()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.enums/enum-entries.html)関数が導入されました。`enumEntries<T>()`関数は、指定されたenum型`T`のすべての列挙エントリのリストを返します。

`enumValues<T>()`関数はまだサポートされていますが、パフォーマンスへの影響が少ないため、代わりに`enumEntries<T>()`関数を使用することをお勧めします。`enumValues<T>()`を呼び出すたびに新しい配列が作成されるのに対し、`enumEntries<T>()`を呼び出すたびに毎回同じリストが返されるため、はるかに効率的です。

例:

```kotlin
enum class RGB { RED, GREEN, BLUE }

inline fun <reified T : Enum<T>> printAllValues() {
    println(enumEntries<T>().joinToString { it.name })
}

printAllValues<RGB>() 
// RED, GREEN, BLUE
```
> インライン関数と実体化された型パラメータに関する詳細については、[インライン関数](inline-functions.md)を参照してください。
>
> {style="tip"}