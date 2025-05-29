[//]: # (title: ビルダー型推論を持つビルダーの使用)

Kotlinは**ビルダー型推論**（またはビルダー推論）をサポートしており、これはジェネリックビルダーを扱う際に役立ちます。この機能は、ビルダー呼び出しの型引数を、そのラムダ引数内の他の呼び出しに関する型情報に基づいてコンパイラが推論するのを助けます。

[`buildMap()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/build-map.html)の使用例を次に示します。

```kotlin
fun addEntryToMap(baseMap: Map<String, Number>, additionalEntry: Pair<String, Int>?) {
   val myMap = buildMap {
       putAll(baseMap)
       if (additionalEntry != null) {
           put(additionalEntry.first, additionalEntry.second)
       }
   }
}
```

ここでは、通常の方法で型引数を推論するのに十分な型情報がありませんが、ビルダー型推論はラムダ引数内の呼び出しを分析できます。`putAll()`および`put()`呼び出しに関する型情報に基づいて、コンパイラは`buildMap()`呼び出しの型引数を自動的に`String`と`Number`に推論できます。ビルダー型推論により、ジェネリックビルダーを使用する際に型引数を省略することができます。

## 独自のビルダーの記述

### ビルダー型推論を有効にするための要件

> Kotlin 1.7.0より前では、ビルダー関数に対してビルダー型推論を有効にするには`-Xenable-builder-inference`コンパイラオプションが必要でした。
> 1.7.0では、このオプションはデフォルトで有効になっています。
>
{style="note"}

独自のビルダーでビルダー型推論を機能させるには、その宣言にレシーバ付き関数型のビルダーラムダパラメータが含まれていることを確認してください。レシーバ型には2つの要件もあります。

1.  ビルダー型推論が推論するはずの型引数を使用する必要があります。例:
    ```kotlin
    fun <V> buildList(builder: MutableList<V>.() -> Unit) { ... }
    ```

    > `fun <T> myBuilder(builder: T.() -> Unit)`のように型パラメータの型を直接渡すことは、まだサポートされていません。
    >
    {style="note"}

2.  シグネチャに対応する型パラメータを含むpublicなメンバーまたは拡張を提供する必要があります。例:
    ```kotlin
    class ItemHolder<T> {
        private val items = mutableListOf<T>()

        fun addItem(x: T) {
            items.add(x)
        }

        fun getLastItem(): T? = items.lastOrNull()
    }

    fun <T> ItemHolder<T>.addAllItems(xs: List<T>) {
        xs.forEach { addItem(it) }
    }

    fun <T> itemHolderBuilder(builder: ItemHolder<T>.() -> Unit): ItemHolder<T> =
        ItemHolder<T>().apply(builder)

    fun test(s: String) {
        val itemHolder1 = itemHolderBuilder { // itemHolder1の型はItemHolder<String>
            addItem(s)
        }
        val itemHolder2 = itemHolderBuilder { // itemHolder2の型はItemHolder<String>
            addAllItems(listOf(s))
        }
        val itemHolder3 = itemHolderBuilder { // itemHolder3の型はItemHolder<String?>
            val lastItem: String? = getLastItem()
            // ...
        }
    }
    ```

### サポートされる機能

ビルダー型推論は以下をサポートします。
*   複数の型引数の推論
    ```kotlin
    fun <K, V> myBuilder(builder: MutableMap<K, V>.() -> Unit): Map<K, V> { ... }
    ```
*   相互依存するものを含む、1回の呼び出し内での複数のビルダーラムダの型引数の推論
    ```kotlin
    fun <K, V> myBuilder(
        listBuilder: MutableList<V>.() -> Unit,
        mapBuilder: MutableMap<K, V>.() -> Unit
    ): Pair<List<V>, Map<K, V>> =
        mutableListOf<V>().apply(listBuilder) to mutableMapOf<K, V>().apply(mapBuilder)

    fun main() {
        val result = myBuilder(
            { add(1) },
            { put("key", 2) }
        )
        // resultはPair<List<Int>, Map<String, Int>>型になります
    }
    ```
*   型パラメータがラムダのパラメータまたは戻り型である型引数の推論
    ```kotlin
    fun <K, V> myBuilder1(
        mapBuilder: MutableMap<K, V>.() -> K
    ): Map<K, V> = mutableMapOf<K, V>().apply { mapBuilder() }

    fun <K, V> myBuilder2(
        mapBuilder: MutableMap<K, V>.(K) -> Unit
    ): Map<K, V> = mutableMapOf<K, V>().apply { mapBuilder(2 as K) }

    fun main() {
        // result1はMap<Long, String>型に推論されます
        val result1 = myBuilder1 {
            put(1L, "value")
            2
        }
        val result2 = myBuilder2 {
            put(1, "value 1")
            // 「it」は「据え置き型変数」型として使用できます
            // 詳細は以下のセクションを参照してください
            put(it, "value 2")
        }
    }
    ```

## ビルダー型推論の仕組み

### 据え置き型変数

ビルダー型推論は、ビルダー型推論分析中にビルダーラムダ内に現れる**据え置き型変数**の観点から機能します。据え置き型変数とは、推論の過程にある型引数の型のことです。コンパイラはこれを使用して、型引数に関する型情報を収集します。

[`buildList()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/build-list.html)の例を考えてみましょう。

```kotlin
val result = buildList {
    val x = get(0)
}
```

ここでは`x`は据え置き型変数の型を持っています。`get()`呼び出しは型`E`の値を返しますが、`E`自体はまだ固定されていません。この時点では、`E`の具体的な型は不明です。

据え置き型変数の値が具体的な型と関連付けられると、ビルダー型推論はこの情報を収集し、ビルダー型推論分析の最後に、対応する型引数の結果の型を推論します。例:

```kotlin
val result = buildList {
    val x = get(0)
    val y: String = x
} // resultはList<String>型に推論されます
```

据え置き型変数が`String`型の変数に代入された後、ビルダー型推論は`x`が`String`のサブタイプであるという情報を取得します。この代入はビルダーラムダの最後のステートメントであるため、ビルダー型推論分析は型引数`E`を`String`に推論する結果で終了します。

据え置き型変数をレシーバとして`equals()`、`hashCode()`、`toString()`関数を常に呼び出すことができることに注意してください。

### ビルダー型推論の結果への貢献

ビルダー型推論は、分析結果に貢献するさまざまな種類の型情報を収集できます。以下を考慮します。
*   型パラメータの型を使用するラムダのレシーバ上のメソッドの呼び出し
    ```kotlin
    val result = buildList {
        // 渡された「value」引数に基づいて、型引数はStringに推論されます
        add("value")
    } // resultはList<String>型に推論されます
    ```
*   型パラメータの型を返す呼び出しに対する期待される型の指定
    ```kotlin
    val result = buildList {
        // 期待される型に基づいて、型引数はFloatに推論されます
        val x: Float = get(0)
    } // resultはList<Float>型になります
    ```
    ```kotlin
    class Foo<T> {
        val items = mutableListOf<T>()
    }

    fun <K> myBuilder(builder: Foo<K>.() -> Unit): Foo<K> = Foo<K>().apply(builder)

    fun main() {
        val result = myBuilder {
            val x: List<CharSequence> = items
            // ...
        } // resultはFoo<CharSequence>型になります
    }
    ```
*   具体的な型を期待するメソッドに据え置き型変数の型を渡す
    ```kotlin
    fun takeMyLong(x: Long) { ... }

    fun String.isMoreThat3() = length > 3

    fun takeListOfStrings(x: List<String>) { ... }

    fun main() {
        val result1 = buildList {
            val x = get(0)
            takeMyLong(x)
        } // result1はList<Long>型になります

        val result2 = buildList {
            val x = get(0)
            val isLong = x.isMoreThat3()
        // ...
        } // result2はList<String>型になります

        val result3 = buildList {
            takeListOfStrings(this)
        } // result3はList<String>型になります
    }
    ```
*   ラムダのレシーバのメンバーへの呼び出し可能参照を取得する
    ```kotlin
    fun main() {
        val result = buildList {
            val x: KFunction1<Int, Float> = ::get
        } // resultはList<Float>型になります
    }
    ```
    ```kotlin
    fun takeFunction(x: KFunction1<Int, Float>) { ... }

    fun main() {
        val result = buildList {
            takeFunction(::get)
        } // resultはList<Float>型になります
    }
    ```

分析の最後に、ビルダー型推論は収集されたすべての型情報を考慮し、それを結果の型にマージしようとします。例を見てください。

```kotlin
val result = buildList { // 据え置き型変数Eを推論中
    // EはNumberまたはNumberのサブタイプであると見なされる
    val n: Number? = getOrNull(0)
    // EはIntまたはIntのスーパータイプであると見なされる
    add(1)
    // EはIntに推論される
} // resultはList<Int>型になります
```

結果の型は、分析中に収集された型情報に対応する最も具体的な型です。与えられた型情報が矛盾しており、マージできない場合、コンパイラはエラーを報告します。

Kotlinコンパイラは、通常の型推論が型引数を推論できない場合にのみビルダー型推論を使用することに注意してください。これは、ビルダーラムダの外側で型情報を提供でき、その場合、ビルダー型推論分析は不要になることを意味します。例を考えてみましょう。

```kotlin
fun someMap() = mutableMapOf<CharSequence, String>()

fun <E> MutableMap<E, String>.f(x: MutableMap<E, String>) { ... }

fun main() {
    val x: Map<in String, String> = buildMap {
        put("", "")
        f(someMap()) // 型の不一致 (Stringが要求されるが、CharSequenceが見つかる)
    }
}
```

ここでは、マップの期待される型がビルダーラムダの外側で指定されているため、型の不一致が発生します。コンパイラは、固定されたレシーバ型`Map<in String, String>`で内部のすべてのステートメントを分析します。