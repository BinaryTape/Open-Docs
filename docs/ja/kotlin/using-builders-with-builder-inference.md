---
title: builder型推論でのビルダーの利用
---
Kotlinは、_builder type inference (ビルダー型推論)_ またはビルダー推論をサポートしており、ジェネリックなビルダーを使用する際に役立ちます。これは、コンパイラがビルダー呼び出しの型引数を、そのラムダ引数内の他の呼び出しに関する型情報に基づいて推論するのを助けます。

[`buildMap()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/build-map.html) の使用例を考えてみましょう。

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

ここでは、通常のやり方で型引数を推論するのに十分な型情報はありませんが、ビルダー推論はラムダ引数内の呼び出しを解析できます。`putAll()` および `put()` 呼び出しに関する型情報に基づいて、コンパイラは `buildMap()` 呼び出しの型引数を `String` および `Number` に自動的に推論できます。ビルダー推論を使用すると、ジェネリックビルダーを使用する際に型引数を省略できます。

## 独自のビルダーの作成

### ビルダー推論を有効にするための要件

:::note
Kotlin 1.7.0より前は、ビルダー関数でビルダー推論を有効にするには、`-Xenable-builder-inference` コンパイラオプションが必要でした。1.7.0では、このオプションはデフォルトで有効になっています。

:::

ビルダー推論を独自のビルダーで機能させるには、その宣言にレシーバー付きの関数型のビルダーラムダパラメーターがあることを確認してください。レシーバーの型には、次の2つの要件もあります。

1. ビルダー推論が推論することになっている型引数を使用する必要があります。 例：
   ```kotlin
   fun <V> buildList(builder: MutableList<V>.() `->` Unit) { ... }
   ```
   
   > `fun <T> myBuilder(builder: T.() `->` Unit)` のように型パラメーターの型を直接渡すことはまだサポートされていないことに注意してください。
   > 
   

2. 対応する型パラメーターをシグネチャに含むパブリックメンバーまたは拡張機能を提供する必要があります。 例：
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

   fun <T> itemHolderBuilder(builder: ItemHolder<T>.() `->` Unit): ItemHolder<T> = 
       ItemHolder<T>().apply(builder)

   fun test(s: String) {
       val itemHolder1 = itemHolderBuilder { // Type of itemHolder1 is ItemHolder<String>
           addItem(s)
       }
       val itemHolder2 = itemHolderBuilder { // Type of itemHolder2 is ItemHolder<String>
           addAllItems(listOf(s)) 
       }
       val itemHolder3 = itemHolderBuilder { // Type of itemHolder3 is ItemHolder<String?>
           val lastItem: String? = getLastItem()
           // ...
       }
   }
   ```

### サポートされている機能

ビルダー推論は以下をサポートします。
* 複数の型引数の推論
  ```kotlin
  fun <K, V> myBuilder(builder: MutableMap<K, V>.() `->` Unit): Map<K, V> { ... }
  ```
* 相互依存するものを含む、1回の呼び出し内の複数のビルダーラムダの型引数の推論
  ```kotlin
  fun <K, V> myBuilder(
      listBuilder: MutableList<V>.() `->` Unit,
      mapBuilder: MutableMap<K, V>.() `->` Unit
  ): Pair<List<V>, Map<K, V>> =
      mutableListOf<V>().apply(listBuilder) to mutableMapOf<K, V>().apply(mapBuilder)
  
  fun main() {
      val result = myBuilder(
          { add(1) },
          { put("key", 2) }
      )
      // result has Pair<List<Int>, Map<String, Int>> type
  }
  ```
* 型パラメーターがラムダのパラメーターまたは戻り値の型である型引数の推論
  ```kotlin
  fun <K, V> myBuilder1(
      mapBuilder: MutableMap<K, V>.() `->` K
  ): Map<K, V> = mutableMapOf<K, V>().apply { mapBuilder() }
  
  fun <K, V> myBuilder2(
      mapBuilder: MutableMap<K, V>.(K) `->` Unit
  ): Map<K, V> = mutableMapOf<K, V>().apply { mapBuilder(2 as K) }
  
  fun main() {
      // result1 has the Map<Long, String> type inferred
      val result1 = myBuilder1 {
          put(1L, "value")
          2
      }
      val result2 = myBuilder2 {
          put(1, "value 1")
          // You can use `it` as "postponed type variable" type
          // See the details in the section below
          put(it, "value 2")
      }
  }
  ```

## ビルダー推論の仕組み

### 保留された型変数 (Postponed type variables)

ビルダー推論は、ビルダー推論分析中にビルダーラムダ内に現れる _保留された型変数 (postponed type variables)_ の観点から機能します。保留された型変数とは、推論処理中の型引数の型のことです。コンパイラはそれを使用して、型引数に関する型情報を収集します。

[`buildList()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/build-list.html) の例を考えてみましょう。

```kotlin
val result = buildList {
    val x = get(0)
}
```

ここで、`x` は保留された型変数の型を持ちます。`get()` 呼び出しは型 `E` の値を返しますが、`E` 自体はまだ確定していません。現時点では、`E` の具体的な型は不明です。

保留された型変数の値が具体的な型に関連付けられると、ビルダー推論はこの情報を収集して、ビルダー推論分析の最後に対応する型引数の結果の型を推論します。例：

```kotlin
val result = buildList {
    val x = get(0)
    val y: String = x
} // result has the List<String> type inferred
```

保留された型変数が `String` 型の変数に割り当てられた後、ビルダー推論は `x` が `String` のサブタイプであるという情報を取得します。この代入はビルダーラムダの最後のステートメントであるため、ビルダー推論分析は型引数 `E` を `String` に推論した結果で終了します。

保留された型変数をレシーバーとして使用して、常に `equals()`、`hashCode()`、および `toString()` 関数を呼び出すことができることに注意してください。

### ビルダー推論結果への寄与

ビルダー推論は、分析結果に寄与するさまざまな種類の型情報を収集できます。
以下を考慮します。
* 型パラメーターの型を使用するラムダのレシーバーでメソッドを呼び出す
  ```kotlin
  val result = buildList {
      // Type argument is inferred into String based on the passed "value" argument
      add("value")
  } // result has the List<String> type inferred
  ```
* 型パラメーターの型を返す呼び出しに対して期待される型を指定する
  ```kotlin
  val result = buildList {
      // Type argument is inferred into Float based on the expected type
      val x: Float = get(0)
  } // result has the List<Float> type
  ```
  ```kotlin
  class Foo<T> {
      val items = mutableListOf<T>()
  }

  fun <K> myBuilder(builder: Foo<K>.() `->` Unit): Foo<K> = Foo<K>().apply(builder)

  fun main() {
      val result = myBuilder {
          val x: List<CharSequence> = items
          // ...
      } // result has the Foo<CharSequence> type
  }
  ```
* 保留された型変数の型を、具体的な型を予期するメソッドに渡す
  ```kotlin
  fun takeMyLong(x: Long) { ... }

  fun String.isMoreThat3() = length > 3

  fun takeListOfStrings(x: List<String>) { ... }

  fun main() {
      val result1 = buildList {
          val x = get(0)
          takeMyLong(x)
      } // result1 has the List<Long> type

      val result2 = buildList {
          val x = get(0)
          val isLong = x.isMoreThat3()
      // ...
      } // result2 has the List<String> type
  
      val result3 = buildList {
          takeListOfStrings(this)
      } // result3 has the List<String> type
  }
  ```
* ラムダレシーバーのメンバーへの呼び出し可能参照を取得する
  ```kotlin
  fun main() {
      val result = buildList {
          val x: KFunction1<Int, Float> = ::get
      } // result has the List<Float> type
  }
  ```
  ```kotlin
  fun takeFunction(x: KFunction1<Int, Float>) { ... }

  fun main() {
      val result = buildList {
          takeFunction(::get)
      } // result has the List<Float> type
  }
  ```

分析の最後に、ビルダー推論は収集されたすべての型情報を考慮し、それらを結果の型にマージしようとします。例を参照してください。

```kotlin
val result = buildList { // Inferring postponed type variable E
    // Considering E is Number or a subtype of Number
    val n: Number? = getOrNull(0)
    // Considering E is Int or a supertype of Int
    add(1)
    // E gets inferred into Int
} // result has the List<Int> type
```

結果の型は、分析中に収集された型情報に対応する最も具体的な型です。指定された型情報が矛盾しており、マージできない場合、コンパイラはエラーを報告します。

Kotlinコンパイラは、通常の型推論で型引数を推論できない場合にのみ、ビルダー推論を使用することに注意してください。これは、ビルダーラムダの外部で型情報を提供できることを意味し、その場合、ビルダー推論分析は必要ありません。例を考えてみましょう。

```kotlin
fun someMap() = mutableMapOf<CharSequence, String>()

fun <E> MutableMap<E, String>.f(x: MutableMap<E, String>) { ... }

fun main() {
    val x: Map<in String, String> = buildMap {
        put("", "")
        f(someMap()) // Type mismatch (required String, found CharSequence)
    }
}
```

ここでは、マップの期待される型がビルダーラムダの外部で指定されているため、型の不一致が発生します。コンパイラは、固定されたレシーバー型 `Map<in String, String>` で内部のすべてのステートメントを分析します。