---
title: "빌더 유형 추론과 함께 빌더 사용하기"
---
Kotlin은 _빌더 타입 추론_ (또는 빌더 추론)을 지원하며, 이는 제네릭 빌더를 사용할 때 유용할 수 있습니다. 컴파일러가 람다 인자 내의 다른 호출에 대한 타입 정보를 기반으로 빌더 호출의 타입 인자를 추론하는 데 도움이 됩니다.

[`buildMap()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/build-map.html) 사용의 다음 예제를 고려해 보십시오.

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

여기에는 일반적인 방법으로 타입 인자를 추론할 수 있는 충분한 타입 정보가 없지만, 빌더 추론은 람다 인자 내의 호출을 분석할 수 있습니다. `putAll()` 및 `put()` 호출에 대한 타입 정보를 기반으로 컴파일러는 `buildMap()` 호출의 타입 인자를 `String` 및 `Number`로 자동 추론할 수 있습니다. 빌더 추론을 사용하면 제네릭 빌더를 사용하는 동안 타입 인자를 생략할 수 있습니다.

## 자신만의 빌더 작성

### 빌더 추론 활성화를 위한 요구 사항

:::note
Kotlin 1.7.0 이전에는 빌더 함수에 대해 빌더 추론을 활성화하려면 `-Xenable-builder-inference` 컴파일러 옵션이 필요했습니다. 1.7.0에서는 이 옵션이 기본적으로 활성화되어 있습니다.

:::

자체 빌더에 대해 빌더 추론이 작동하도록 하려면 해당 선언에 수신자가 있는 함수 타입의 빌더 람다 매개변수가 있는지 확인하십시오. 수신자 타입에 대한 두 가지 요구 사항도 있습니다.

1. 빌더 추론이 추론해야 하는 타입 인자를 사용해야 합니다. 예를 들어 다음과 같습니다.
   ```kotlin
   fun <V> buildList(builder: MutableList<V>.() `->` Unit) { ... }
   ```
   
   > `fun <T> myBuilder(builder: T.() `->` Unit)`와 같이 타입 매개변수의 타입을 직접 전달하는 것은 아직 지원되지 않습니다.
   > 
   

2. 해당 타입 매개변수를 시그니처에 포함하는 공개 멤버 또는 확장 기능을 제공해야 합니다. 예를 들어 다음과 같습니다.
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

### 지원되는 기능

빌더 추론은 다음을 지원합니다. 
* 여러 타입 인자 추론
  ```kotlin
  fun <K, V> myBuilder(builder: MutableMap<K, V>.() `->` Unit): Map<K, V> { ... }
  ```
* 상호 의존적인 것을 포함하여 하나의 호출 내에서 여러 빌더 람다의 타입 인자 추론
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
* 타입 매개변수가 람다의 매개변수 또는 반환 타입인 타입 인자 추론
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

## 빌더 추론 작동 방식

### 연기된 타입 변수

빌더 추론은 _연기된 타입 변수_의 관점에서 작동하며, 이는 빌더 추론 분석 중에 빌더 람다 내에 나타납니다. 연기된 타입 변수는 추론 과정에 있는 타입 인자의 타입입니다. 컴파일러는 이를 사용하여 타입 인자에 대한 타입 정보를 수집합니다.

[`buildList()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/build-list.html)의 예제를 고려해 보십시오.

```kotlin
val result = buildList {
    val x = get(0)
}
```

여기서 `x`는 연기된 타입 변수의 타입을 갖습니다. `get()` 호출은 `E` 타입의 값을 반환하지만 `E` 자체는 아직 고정되지 않았습니다. 이 시점에서 `E`에 대한 구체적인 타입은 알 수 없습니다.

연기된 타입 변수의 값이 구체적인 타입과 연결되면 빌더 추론은 이 정보를 수집하여 빌더 추론 분석이 끝날 때 해당 타입 인자의 결과 타입을 추론합니다. 예를 들어 다음과 같습니다.

```kotlin
val result = buildList {
    val x = get(0)
    val y: String = x
} // result has the List<String> type inferred
```

연기된 타입 변수가 `String` 타입의 변수에 할당된 후 빌더 추론은 `x`가 `String`의 하위 타입이라는 정보를 얻습니다. 이 할당은 빌더 람다의 마지막 문이므로 빌더 추론 분석은 타입 인자 `E`를 `String`으로 추론하는 것으로 끝납니다.

항상 연기된 타입 변수를 수신자로 사용하여 `equals()`, `hashCode()` 및 `toString()` 함수를 호출할 수 있습니다.

### 빌더 추론 결과에 기여

빌더 추론은 분석 결과에 기여하는 다양한 타입 정보를 수집할 수 있습니다.
다음 사항을 고려합니다.
* 타입 매개변수의 타입을 사용하는 람다의 수신자에 대한 메서드 호출
  ```kotlin
  val result = buildList {
      // Type argument is inferred into String based on the passed "value" argument
      add("value")
  } // result has the List<String> type inferred
  ```
* 타입 매개변수의 타입을 반환하는 호출에 대한 예상 타입 지정
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
* 연기된 타입 변수의 타입을 구체적인 타입을 예상하는 메서드에 전달
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
* 람다 수신자의 멤버에 대한 호출 가능 참조 가져오기
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

분석이 끝나면 빌더 추론은 수집된 모든 타입 정보를 고려하고 이를 결과 타입으로 병합하려고 시도합니다. 예제를 참조하십시오.

```kotlin
val result = buildList { // Inferring postponed type variable E
    // Considering E is Number or a subtype of Number
    val n: Number? = getOrNull(0)
    // Considering E is Int or a supertype of Int
    add(1)
    // E gets inferred into Int
} // result has the List<Int> type
```

결과 타입은 분석 중에 수집된 타입 정보에 해당하는 가장 구체적인 타입입니다. 주어진 타입 정보가 모순되어 병합할 수 없으면 컴파일러는 오류를 보고합니다.

Kotlin 컴파일러는 일반 타입 추론이 타입 인자를 추론할 수 없는 경우에만 빌더 추론을 사용합니다. 즉, 빌더 람다 외부에서 타입 정보를 제공할 수 있으며, 그러면 빌더 추론 분석이 필요하지 않습니다. 예제를 고려해 보십시오.

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

여기서 맵의 예상 타입이 빌더 람다 외부에 지정되었기 때문에 타입 불일치가 나타납니다. 컴파일러는 고정된 수신자 타입 `Map<in String, String>`으로 내부의 모든 문을 분석합니다.