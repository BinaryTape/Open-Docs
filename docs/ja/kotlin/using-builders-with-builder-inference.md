[//]: # (title: ビルダー型推論でのビルダーの使用)

Kotlinは、ジェネリックビルダーを扱う際に役立つ**ビルダー型推論**（またはビルダー推論）をサポートしています。これは、ラムダ引数内の他の呼び出しに関する型情報に基づいて、ビルダー呼び出しの型引数をコンパイラが推論するのに役立ちます。

[`buildMap()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/build-map.html)の使用例を以下に示します。

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

ここでは、通常のやり方で型引数を推論するには十分な型情報がありませんが、ビルダー推論はラムダ引数内の呼び出しを分析できます。`putAll()`および`put()`呼び出しの型情報に基づいて、コンパイラは`buildMap()`呼び出しの型引数を自動的に`String`と`Number`に推論できます。ビルダー推論により、ジェネリックビルダーを使用する際に型引数を省略できます。

## 独自のビルダーの記述

### ビルダー推論を有効にするための要件

> Kotlin 1.7.0より前では、ビルダー関数でビルダー推論を有効にするには、`-Xenable-builder-inference`コンパイラオプションが必要でした。
> 1.7.0では、このオプションはデフォルトで有効になっています。
>
{style="note"}

独自のビルダーでビルダー推論を機能させるには、その宣言にレシーバ付き関数型のビルダーラムダパラメータが含まれていることを確認してください。レシーバ型には2つの要件もあります。

1.  ビルダー推論が推論する型引数を使用する必要があります。例：
    ```kotlin
    fun <V> buildList(builder: MutableList<V>.() -> Unit) { ... }
    ```

    > `fun <T> myBuilder(builder: T.() -> Unit)`のように型パラメータの型を直接渡すことはまだサポートされていません。
    >
    {style="note"}

2.  シグネチャに対応する型パラメータを含むパブリックメンバーまたは拡張関数を提供する必要があります。例：
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
        val itemHolder1 = itemHolderBuilder { // itemHolder1 の型は ItemHolder<String>
            addItem(s)
        }
        val itemHolder2 = itemHolderBuilder { // itemHolder2 の型は ItemHolder<String>
            addAllItems(listOf(s))
        }
        val itemHolder3 = itemHolderBuilder { // itemHolder3 の型は ItemHolder<String?>
            val lastItem: String? = getLastItem()
            // ...
        }
    }
    ```

### サポートされる機能

ビルダー推論は以下をサポートしています：
*   複数の型引数の推論
    ```kotlin
    fun <K, V> myBuilder(builder: MutableMap<K, V>.() -> Unit): Map<K, V> { ... }
    ```
*   相互依存するものを含む、1つの呼び出し内の複数のビルダーラムダの型引数の推論
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
        // result は Pair<List<Int>, Map<String, Int>> 型になります
    }
    ```
*   型パラメータがラムダのパラメータ型または戻り型である型引数の推論
    ```kotlin
    fun <K, V> myBuilder1(
        mapBuilder: MutableMap<K, V>.() -> K
    ): Map<K, V> = mutableMapOf<K, V>().apply { mapBuilder() }

    fun <K, V> myBuilder2(
        mapBuilder: MutableMap<K, V>.(K) -> Unit
    ): Map<K, V> = mutableMapOf<K, V>().apply { mapBuilder(2 as K) }

    fun main() {
        // result1 は Map<Long, String> 型に推論されます
        val result1 = myBuilder1 {
            put(1L, "value")
            2
        }
        val result2 = myBuilder2 {
            put(1, "value 1")
            // `it` を「据え置き型変数」の型として使用できます
            // 詳細については以下のセクションを参照してください
            put(it, "value 2")
        }
    }
    ```

## ビルダー推論の仕組み

### 据え置き型変数

ビルダー推論は**据え置き型変数**という概念に基づいて機能します。据え置き型変数は、ビルダー推論の分析中にビルダーラムダ内に現れる、推論中の型引数の型です。コンパイラはこれを使用して、型引数に関する型情報を収集します。

[`buildList()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/build-list.html)の例を考えてみましょう。

```kotlin
val result = buildList {
    val x = get(0)
}
```

ここでは`x`が据え置き型変数の型を持っています。`get()`呼び出しは型`E`の値を返しますが、`E`自体はまだ確定していません。この時点では、`E`の具体的な型は不明です。

据え置き型変数の値が具体的な型に関連付けられると、ビルダー推論はこの情報を収集し、ビルダー推論分析の最後に、対応する型引数の最終的な型を推論します。例：

```kotlin
val result = buildList {
    val x = get(0)
    val y: String = x
} // result は List<String> 型に推論されます
```

据え置き型変数が`String`型の変数に代入された後、ビルダー推論は`x`が`String`のサブタイプであるという情報を取得します。この代入がビルダーラムダの最後のステートメントであるため、ビルダー推論分析は型引数`E`を`String`に推論する結果で終了します。

据え置き型変数をレシーバとして、`equals()`、`hashCode()`、`toString()`関数を常に呼び出せることに注意してください。

### ビルダー推論結果への寄与

ビルダー推論は、分析結果に寄与するさまざまな型の型情報を収集できます。以下を考慮します。
*   型パラメータの型を使用するラムダのレシーバでメソッドを呼び出す
    ```kotlin
    val result = buildList {
        // 渡された「value」引数に基づいて、型引数は String に推論されます
        add("value")
    } // result は List<String> 型に推論されます
    ```
*   型パラメータの型を返す呼び出しに期待される型を指定する
    ```kotlin
    val result = buildList {
        // 期待される型に基づいて、型引数は Float に推論されます
        val x: Float = get(0)
    } // result は List<Float> 型になります
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
        } // result は Foo<CharSequence> 型になります
    }
    ```
*   据え置き型変数の型を具体的な型を期待するメソッドに渡す
    ```kotlin
    fun takeMyLong(x: Long) { ... }

    fun String.isMoreThat3() = length > 3

    fun takeListOfStrings(x: List<String>) { ... }

    fun main() {
        val result1 = buildList {
            val x = get(0)
            takeMyLong(x)
        } // result1 は List<Long> 型になります

        val result2 = buildList {
            val x = get(0)
            val isLong = x.isMoreThat3()
        // ...
        } // result2 は List<String> 型になります

        val result3 = buildList {
            takeListOfStrings(this)
        } // result3 は List<String> 型になります
    }
    ```
*   ラムダレシーバのメンバーへのコーラブルリファレンスを取る
    ```kotlin
    fun main() {
        val result = buildList {
            val x: KFunction1<Int, Float> = ::get
        } // result は List<Float> 型になります
    }
    ```
    ```kotlin
    fun takeFunction(x: KFunction1<Int, Float>) { ... }

    fun main() {
        val result = buildList {
            takeFunction(::get)
        } // result は List<Float> 型になります
    }
    ```

分析の最後に、ビルダー推論は収集されたすべての型情報を考慮し、それを結果の型にマージしようとします。例を見てください。

```kotlin
val result = buildList { // 据え置き型変数 E を推論中
    // E が Number または Number のサブタイプであると考慮
    val n: Number? = getOrNull(0)
    // E が Int または Int のスーパータイプであると考慮
    add(1)
    // E は Int に推論されます
} // result は List<Int> 型になります
```

結果の型は、分析中に収集された型情報に対応する最も具体的な型です。与えられた型情報が矛盾しておりマージできない場合、コンパイラはエラーを報告します。

Kotlinコンパイラは、通常の型推論が型引数を推論できない場合にのみ、ビルダー推論を使用することに注意してください。これは、ビルダーラムダの外で型情報に寄与でき、その場合、ビルダー推論分析は不要であることを意味します。例を考えてみましょう。

```kotlin
fun someMap() = mutableMapOf<CharSequence, String>()

fun <E> MutableMap<E, String>.f(x: MutableMap<E, String>) { ... }

fun main() {
    val x: Map<in String, String> = buildMap {
        put("", "")
        f(someMap()) // 型の不一致 (String が必要ですが CharSequence が見つかりました)
    }
}
```

ここでは、マップの期待される型がビルダーラムダの外で指定されているため、型の不一致が発生しています。コンパイラは、固定されたレシーバ型`Map<in String, String>`ですべてのステートメントを分析します。