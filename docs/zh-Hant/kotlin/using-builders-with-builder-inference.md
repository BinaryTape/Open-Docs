[//]: # (title: 使用建構器與建構器型別推斷)

Kotlin 支援_建構器型別推斷_ (或稱建構器推斷)，這在您使用泛型建構器時非常有用。它有助於編譯器根據其 lambda 引數內其他呼叫的型別資訊，推斷建構器呼叫的型別引數。

請考慮以下 [`buildMap()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/build-map.html) 的用法範例：

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

這裡沒有足夠的型別資訊以常規方式推斷型別引數，但建構器推斷可以分析 lambda 引數內部的呼叫。根據 `putAll()` 和 `put()` 呼叫的型別資訊，編譯器可以自動將 `buildMap()` 呼叫的型別引數推斷為 `String` 和 `Number`。建構器推斷允許在使用泛型建構器時省略型別引數。

## 撰寫您自己的建構器

### 啟用建構器推斷的要求

> 在 Kotlin 1.7.0 之前，為建構器函式啟用建構器推斷需要 `-Xenable-builder-inference` 編譯器選項。在 1.7.0 中，此選項預設為啟用。
>
{style="note"}

若要讓建構器推斷為您自己的建構器工作，請確保其宣告具有一個帶有接收者的函式型別的建構器 lambda 參數。對於接收者型別還有兩個要求：

1. 它應該使用建構器推斷應該推斷的型別引數。例如：
   ```kotlin
   fun <V> buildList(builder: MutableList<V>.() -> Unit) { ... }
   ```
   
   > 請注意，直接傳遞型別參數的型別，例如 `fun <T> myBuilder(builder: T.() -> Unit)`，尚未支援。
   > 
   {style="note"}

2. 它應該提供在簽章中包含對應型別參數的公用成員或擴充函式。例如：
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

### 支援的功能

建構器推斷支援： 
* 推斷多個型別引數
  ```kotlin
  fun <K, V> myBuilder(builder: MutableMap<K, V>.() -> Unit): Map<K, V> { ... }
  ```
* 在單一呼叫中推斷多個建構器 lambda 的型別引數，包括相互依賴的
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
      // result 具有 Pair<List<Int>, Map<String, Int>> 型別
  }
  ```
* 推斷其型別參數為 lambda 參數或回傳型別的型別引數
  ```kotlin
  fun <K, V> myBuilder1(
      mapBuilder: MutableMap<K, V>.() -> K
  ): Map<K, V> = mutableMapOf<K, V>().apply { mapBuilder() }
  
  fun <K, V> myBuilder2(
      mapBuilder: MutableMap<K, V>.(K) -> Unit
  ): Map<K, V> = mutableMapOf<K, V>().apply { mapBuilder(2 as K) }
  
  fun main() {
      // result1 已推斷出 Map<Long, String> 型別
      val result1 = myBuilder1 {
          put(1L, "value")
          2
      }
      val result2 = myBuilder2 {
          put(1, "value 1")
          // 您可以使用 `it` 作為「推遲型別變數」型別
          // 請參閱以下章節的詳細資訊
          put(it, "value 2")
      }
  }
  ```

## 建構器推斷的運作方式

### 推遲型別變數

建構器推斷是根據_推遲型別變數_來運作的，這些變數在建構器推斷分析期間會出現在建構器 lambda 內部。推遲型別變數是型別引數的型別，正在推斷的過程中。編譯器使用它來收集有關該型別引數的型別資訊。

請考慮 [`buildList()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/build-list.html) 的範例：

```kotlin
val result = buildList {
    val x = get(0)
}
```

這裡 `x` 具有推遲型別變數的型別：`get()` 呼叫回傳型別為 `E` 的值，但 `E` 本身尚未確定。此時，`E` 的具體型別是未知的。

當推遲型別變數的值與具體型別關聯時，建構器推斷會收集此資訊，以便在建構器推斷分析結束時推斷出對應型別引數的結果型別。例如：

```kotlin
val result = buildList {
    val x = get(0)
    val y: String = x
} // result 已推斷出 List<String> 型別
```

在推遲型別變數被賦值給 `String` 型別的變數後，建構器推斷會得到 `x` 是 `String` 的子型別的資訊。此賦值是建構器 lambda 中的最後一個陳述式，因此建構器推斷分析以將型別引數 `E` 推斷為 `String` 的結果結束。

請注意，您始終可以將推遲型別變數作為接收者來呼叫 `equals()`、`hashCode()` 和 `toString()` 函式。

### 對建構器推斷結果的貢獻

建構器推斷可以收集各種型別資訊，這些資訊有助於分析結果。它會考慮：
* 在 lambda 的接收者上呼叫使用型別參數型別的方法
  ```kotlin
  val result = buildList {
      // 型別引數根據傳入的「value」引數推斷為 String
      add("value")
  } // result 已推斷出 List<String> 型別
  ```
* 為回傳型別參數型別的呼叫指定預期型別
  ```kotlin
  val result = buildList {
      // 型別引數根據預期型別推斷為 Float
      val x: Float = get(0)
  } // result 具有 List<Float> 型別
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
      } // result 具有 Foo<CharSequence> 型別
  }
  ```
* 將推遲型別變數的型別傳遞給預期具體型別的方法
  ```kotlin
  fun takeMyLong(x: Long) { ... }

  fun String.isMoreThat3() = length > 3

  fun takeListOfStrings(x: List<String>) { ... }

  fun main() {
      val result1 = buildList {
          val x = get(0)
          takeMyLong(x)
      } // result1 具有 List<Long> 型別

      val result2 = buildList {
          val x = get(0)
          val isLong = x.isMoreThat3()
      // ...
      } // result2 具有 List<String> 型別
  
      val result3 = buildList {
          takeListOfStrings(this)
      } // result3 具有 List<String> 型別
  }
  ```
* 取得 lambda 接收者成員的可呼叫引用
  ```kotlin
  fun main() {
      val x: KFunction1<Int, Float> = ::get
  } // result 具有 List<Float> 型別
  ```
  ```kotlin
  fun takeFunction(x: KFunction1<Int, Float>) { ... }

  fun main() {
      val result = buildList {
          takeFunction(::get)
      } // result 具有 List<Float> 型別
  }
  ```

在分析結束時，建構器推斷會考慮所有收集到的型別資訊，並嘗試將其合併到結果型別中。請參閱範例。

```kotlin
val result = buildList { // 推斷推遲型別變數 E
    // 考慮 E 是 Number 或 Number 的子型別
    val n: Number? = getOrNull(0)
    // 考慮 E 是 Int 或 Int 的父型別
    add(1)
    // E 被推斷為 Int
} // result 具有 List<Int> 型別
```

結果型別是在分析期間收集到的型別資訊所對應的最具體型別。如果給定的型別資訊是矛盾的且無法合併，編譯器會報告錯誤。

請注意，Kotlin 編譯器僅在常規型別推斷無法推斷型別引數時才使用建構器推斷。這意味著您可以在建構器 lambda 外部貢獻型別資訊，這樣就不需要進行建構器推斷分析。請考慮以下範例：

```kotlin
fun someMap() = mutableMapOf<CharSequence, String>()

fun <E> MutableMap<E, String>.f(x: MutableMap<E, String>) { ... }

fun main() {
    val x: Map<in String, String> = buildMap {
        put("", "")
        f(someMap()) // 型別不符 (需要 String，找到 CharSequence)
    }
}
```

這裡出現型別不符，因為地圖的預期型別是在建構器 lambda 外部指定的。編譯器會以固定的接收者型別 `Map<in String, String>` 分析內部所有陳述式。