[//]: # (title: 列挙型クラス)

列挙型クラスの最も基本的なユースケースは、型安全な列挙型の実装です。

```kotlin
enum class Direction {
    NORTH, SOUTH, WEST, EAST
}
```
各列挙定数はオブジェクトです。列挙定数はカンマで区切られます。

各列挙型は列挙型クラスのインスタンスであるため、次のように初期化できます。

```kotlin
enum class Color(val rgb: Int) {
    RED(0xFF0000),
    GREEN(0x00FF00),
    BLUE(0x0000FF)
}
```

## 匿名クラス

列挙定数は、対応するメソッドだけでなく、基底メソッドのオーバーライドも伴う独自の匿名クラスを宣言できます。

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

列挙型クラスがメンバを定義する場合、定数定義とメンバ定義をセミコロンで区切ります。

## 列挙型クラスでのインターフェースの実装

列挙型クラスはインターフェースを実装できます（ただし、クラスから派生することはできません）。その際、すべてのエントリに対して共通のインターフェースメンバの実装を提供することも、各エントリの匿名クラス内で個別の実装を提供することも可能です。
これは、実装したいインターフェースを列挙型クラスの宣言に次のように追加することで行います。

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

すべての列挙型クラスは、デフォルトで [Comparable](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-comparable/index.html) インターフェースを実装します。列挙型クラスの定数は、自然な順序で定義されます。詳細については、[Ordering (順序付け)](collection-ordering.md) を参照してください。

## 列挙定数の操作

Kotlin の列挙型クラスには、定義された列挙定数を列挙したり、名前で列挙定数を取得したりするための合成プロパティとメソッドがあります。これらのメソッドのシグネチャは次のとおりです（列挙型クラスの名前が `EnumClass` であると仮定して）。

```kotlin
EnumClass.valueOf(value: String): EnumClass
EnumClass.entries: EnumEntries<EnumClass> // specialized List<EnumClass>
```

以下に、それらの動作例を示します。

```kotlin
enum class RGB { RED, GREEN, BLUE }

fun main() {
    for (color in RGB.entries) println(color.toString()) // prints RED, GREEN, BLUE
    println("The first color is: ${RGB.valueOf("RED")}") // prints "The first color is: RED"
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.9" id="rgb-enums-kotlin"}

`valueOf()` メソッドは、指定された名前がクラスで定義された列挙定数のいずれにも一致しない場合、`IllegalArgumentException` をスローします。

Kotlin 1.9.0 で `entries` が導入される以前は、`values()` 関数が列挙定数の配列を取得するために使用されていました。

各列挙定数には、列挙型クラス宣言におけるその名前と位置（0から始まる）を取得するための、[`name`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-enum/name.html) および [`ordinal`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-enum/ordinal.html) プロパティも存在します。

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

> 列挙エントリを扱う際の繰り返しを減らすために、コンテキスト依存の解決（現在プレビュー中）を試してみてください。
> この機能を使用すると、`when` 式や型付けされた変数への代入など、期待される型が既知の場合に列挙型クラス名を省略できます。
>
> 詳細については、[コンテキスト依存の解決のプレビュー](whatsnew22.md#preview-of-context-sensitive-resolution) または関連する [KEEP提案](https://github.com/Kotlin/KEEP/blob/improved-resolution-expected-type/proposals/context-sensitive-resolution.md) を参照してください。
>
{style="tip"}

[`enumValues<T>()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/enum-values.html) および [`enumValueOf<T>()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/enum-value-of.html) 関数を使用して、列挙型クラスの定数にジェネリックな方法でアクセスできます。
Kotlin 2.0.0 では、[`enumValues<T>()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/enum-values.html) 関数の代替として [`enumEntries<T>()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.enums/enum-entries.html) 関数が導入されました。`enumEntries<T>()` 関数は、指定された列挙型 `T` のすべての列挙エントリのリストを返します。

`enumValues<T>()` 関数は引き続きサポートされていますが、`enumEntries<T>()` 関数の方がパフォーマンスへの影響が少ないため、代わりに使用することをお勧めします。`enumValues<T>()` を呼び出すたびに新しい配列が作成されますが、`enumEntries<T>()` を呼び出す場合は毎回同じリストが返され、はるかに効率的です。

例:

```kotlin
enum class RGB { RED, GREEN, BLUE }

inline fun <reified T : Enum<T>> printAllValues() {
    println(enumEntries<T>().joinToString { it.name })
}

printAllValues<RGB>() 
// RED, GREEN, BLUE
```
> インライン関数と実体化された型パラメータの詳細については、[インライン関数](inline-functions.md) を参照してください。
>
> {style="tip"}