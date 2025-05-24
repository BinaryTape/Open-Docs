---
title: "搭配建構器類型推論使用建構器 (Using builders with builder type inference)"
---
Kotlin 支援**建構器類型推論** (builder type inference，或稱建構器推論)，當您使用泛型建構器時，它會非常有用。它可以幫助編譯器根據建構器 Lambda 參數中其他呼叫的類型資訊，推斷建構器呼叫的類型參數。

考慮以下 [`buildMap()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/build-map.html) 的使用範例：

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

這裡沒有足夠的類型資訊可以常規方式推斷類型參數，但建構器推論可以分析 Lambda 參數內的呼叫。基於 `putAll()` 和 `put()` 呼叫的類型資訊，編譯器可以自動推斷 `buildMap()` 呼叫的類型參數為 `String` 和 `Number`。建構器推論允許在使用泛型建構器時省略類型參數。

## 編寫您自己的建構器

### 啟用建構器推論的要求

:::note
在 Kotlin 1.7.0 之前，為建構器函數啟用建構器推論需要 `-Xenable-builder-inference` 編譯器選項。在 1.7.0 中，預設啟用此選項。

:::

要讓建構器推論適用於您自己的建構器，請確保其宣告具有帶接收器 (receiver) 的函數類型的建構器 Lambda 參數。對於接收器類型也有兩個要求：

1. 它應該使用建構器推論應該推斷的類型參數。例如：
   ```kotlin
   fun <V> buildList(builder: MutableList<V>.() `->` Unit) { ... }
   ```
   
   > 請注意，目前尚不支援直接傳遞類型參數的類型，例如 `fun <T> myBuilder(builder: T.() `->` Unit)`。
   > 
   

2. 它應該提供在其簽名中包含相應類型參數的 public 成員或擴展。例如：
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
       val itemHolder1 = itemHolderBuilder { // itemHolder1 的類型為 ItemHolder<String>
           addItem(s)
       }
       val itemHolder2 = itemHolderBuilder { // itemHolder2 的類型為 ItemHolder<String>
           addAllItems(listOf(s)) 
       }
       val itemHolder3 = itemHolderBuilder { // itemHolder3 的類型為 ItemHolder<String?>
           val lastItem: String? = getLastItem()
           // ...
       }
   }
   ```

### 支援的功能

建構器推論支援：
* 推斷多個類型參數
  ```kotlin
  fun <K, V> myBuilder(builder: MutableMap<K, V>.() `->` Unit): Map<K, V> { ... }
  ```
* 推斷一個呼叫中多個建構器 Lambda 的類型參數，包括相互依賴的類型參數
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
      // result 的類型為 Pair<List<Int>, Map<String, Int>>
  }
  ```
* 推斷其類型參數是 Lambda 參數或返回類型的類型參數
  ```kotlin
  fun <K, V> myBuilder1(
      mapBuilder: MutableMap<K, V>.() `->` K
  ): Map<K, V> = mutableMapOf<K, V>().apply { mapBuilder() }
  
  fun <K, V> myBuilder2(
      mapBuilder: MutableMap<K, V>.(K) `->` Unit
  ): Map<K, V> = mutableMapOf<K, V>().apply { mapBuilder(2 as K) }
  
  fun main() {
      // result1 推斷為 Map<Long, String> 類型
      val result1 = myBuilder1 {
          put(1L, "value")
          2
      }
      val result2 = myBuilder2 {
          put(1, "value 1")
          // 您可以使用 `it` 作為「延遲類型變數」類型
          // 請參閱下面的章節了解詳細資訊
          put(it, "value 2")
      }
  }
  ```

## 建構器推論如何運作

### 延遲類型變數 (Postponed type variables)

建構器推論以**延遲類型變數** (postponed type variables) 的形式運作，這些變數在建構器推論分析期間出現在建構器 Lambda 內部。延遲類型變數是類型參數的類型，正在推斷過程中。編譯器使用它來收集有關類型參數的類型資訊。

考慮 [`buildList()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/build-list.html) 的範例：

```kotlin
val result = buildList {
    val x = get(0)
}
```

這裡 `x` 具有延遲類型變數的類型：`get()` 呼叫傳回 `E` 類型的值，但 `E` 本身尚未確定。此時，`E` 的具體類型是未知的。

當延遲類型變數的值與具體類型相關聯時，建構器推論會收集此資訊，以在建構器推論分析結束時推斷相應類型參數的結果類型。例如：

```kotlin
val result = buildList {
    val x = get(0)
    val y: String = x
} // result 推斷為 List<String> 類型
```

在將延遲類型變數賦值給 `String` 類型的變數後，建構器推論會獲得 `x` 是 `String` 的子類型 (subtype) 的資訊。此賦值是建構器 Lambda 中的最後一個語句，因此建構器推論分析以將類型參數 `E` 推斷為 `String` 的結果結束。

請注意，您始終可以呼叫帶有延遲類型變數作為接收器的 `equals()`、`hashCode()` 和 `toString()` 函數。

### 貢獻於建構器推論結果

建構器推論可以收集有助於分析結果的不同種類的類型資訊。
它考慮：
* 呼叫 Lambda 接收器上使用類型參數類型的方法
  ```kotlin
  val result = buildList {
      // 類型參數根據傳遞的 "value" 參數推斷為 String
      add("value")
  } // result 推斷為 List<String> 類型
  ```
* 為傳回類型參數類型呼叫指定預期類型
  ```kotlin
  val result = buildList {
      // 類型參數根據預期類型推斷為 Float
      val x: Float = get(0)
  } // result 為 List<Float> 類型
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
      } // result 為 Foo<CharSequence> 類型
  }
  ```
* 將延遲類型變數的類型傳遞到需要具體類型的方法中
  ```kotlin
  fun takeMyLong(x: Long) { ... }

  fun String.isMoreThat3() = length > 3

  fun takeListOfStrings(x: List<String>) { ... }

  fun main() {
      val result1 = buildList {
          val x = get(0)
          takeMyLong(x)
      } // result1 為 List<Long> 類型

      val result2 = buildList {
          val x = get(0)
          val isLong = x.isMoreThat3()
      // ...
      } // result2 為 List<String> 類型
  
      val result3 = buildList {
          takeListOfStrings(this)
      } // result3 為 List<String> 類型
  }
  ```
* 取得對 Lambda 接收器的成員的可呼叫參考
  ```kotlin
  fun main() {
      val result = buildList {
          val x: KFunction1<Int, Float> = ::get
      } // result 為 List<Float> 類型
  }
  ```
  ```kotlin
  fun takeFunction(x: KFunction1<Int, Float>) { ... }

  fun main() {
      val result = buildList {
          takeFunction(::get)
      } // result 為 List<Float> 類型
  }
  ```

在分析結束時，建構器推論會考慮所有收集到的類型資訊，並嘗試將其合併到結果類型中。請參閱以下範例。

```kotlin
val result = buildList { // 推斷延遲類型變數 E
    // 考慮 E 是 Number 或 Number 的子類型
    val n: Number? = getOrNull(0)
    // 考慮 E 是 Int 或 Int 的超類型 (supertype)
    add(1)
    // E 推斷為 Int
} // result 為 List<Int> 類型
```

結果類型是最符合在分析期間收集的類型資訊的特定類型。如果給定的類型資訊是矛盾的並且無法合併，則編譯器會報告錯誤。

請注意，僅當常規類型推論無法推斷類型參數時，Kotlin 編譯器才會使用建構器推論。這表示您可以在建構器 Lambda 外部提供類型資訊，然後不需要建構器推論分析。考慮以下範例：

```kotlin
fun someMap() = mutableMapOf<CharSequence, String>()

fun <E> MutableMap<E, String>.f(x: MutableMap<E, String>) { ... }

fun main() {
    val x: Map<in String, String> = buildMap {
        put("", "")
        f(someMap()) // 類型不符 (需要 String，找到 CharSequence)
    }
}
```

這裡出現類型不符，因為 Map 的預期類型是在建構器 Lambda 外部指定的。編譯器使用固定的接收器類型 `Map<in String, String>` 分析所有語句。