[//]: # (title: 빌더 타입 추론과 함께 빌더 사용하기)

코틀린은 _빌더 타입 추론_(또는 빌더 추론)을 지원하며, 이는 제네릭 빌더를 사용할 때 유용합니다. 빌더 타입 추론은 컴파일러가 람다 인자 내부의 다른 호출에 대한 타입 정보를 기반으로 빌더 호출의 타입 인자를 추론하는 데 도움을 줍니다.

[`buildMap()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/build-map.html) 사용 예시를 살펴보겠습니다:

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

여기에는 일반적인 방식으로 타입 인자를 추론할 만한 충분한 타입 정보가 없지만, 빌더 추론은 람다 인자 내부의 호출을 분석할 수 있습니다. `putAll()` 및 `put()` 호출에 대한 타입 정보를 기반으로 컴파일러는 `buildMap()` 호출의 타입 인자를 `String`과 `Number`로 자동으로 추론할 수 있습니다. 빌더 추론을 통해 제네릭 빌더를 사용할 때 타입 인자를 생략할 수 있습니다.

## 자신만의 빌더 작성하기

### 빌더 추론 활성화 요구사항

> 코틀린 1.7.0 이전에는 빌더 함수에 빌더 추론을 활성화하려면 `-Xenable-builder-inference` 컴파일러 옵션이 필요했습니다. 1.7.0에서는 이 옵션이 기본적으로 활성화됩니다.
>
{style="note"}

자신만의 빌더에서 빌더 추론이 작동하도록 하려면, 선언에 수신자가 있는 함수 타입의 빌더 람다 파라미터가 포함되어 있는지 확인해야 합니다. 수신자 타입에는 두 가지 요구사항이 있습니다.

1. 빌더 추론이 추론해야 하는 타입 인자를 사용해야 합니다. 예를 들어:
   ```kotlin
   fun <V> buildList(builder: MutableList<V>.() -> Unit) { ... }
   ```
   
   > `fun <T> myBuilder(builder: T.() -> Unit)`과 같이 타입 파라미터의 타입을 직접 전달하는 것은 아직 지원되지 않습니다.
   > 
   {style="note"}

2. 서명에 해당 타입 파라미터를 포함하는 공개 멤버 또는 확장 함수를 제공해야 합니다. 예를 들어:
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

### 지원되는 기능

빌더 추론은 다음을 지원합니다: 
* 여러 타입 인자 추론
  ```kotlin
  fun <K, V> myBuilder(builder: MutableMap<K, V>.() -> Unit): Map<K, V> { ... }
  ```
* 상호 의존적인 것을 포함하여 하나의 호출 내에서 여러 빌더 람다의 타입 인자 추론
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
      // result has Pair<List<Int>, Map<String, Int>> type
  }
  ```
* 타입 파라미터가 람다의 파라미터 또는 반환 타입인 타입 인자 추론
  ```kotlin
  fun <K, V> myBuilder1(
      mapBuilder: MutableMap<K, V>.() -> K
  ): Map<K, V> = mutableMapOf<K, V>().apply { mapBuilder() }
  
  fun <K, V> myBuilder2(
      mapBuilder: MutableMap<K, V>.(K) -> Unit
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

### 지연된 타입 변수

빌더 추론은 빌더 추론 분석 중에 빌더 람다 내부에 나타나는 _지연된 타입 변수_를 기반으로 작동합니다. 지연된 타입 변수는 추론 과정에 있는 타입 인자의 타입입니다. 컴파일러는 이를 사용하여 타입 인자에 대한 타입 정보를 수집합니다.

[`buildList()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/build-list.html) 예시를 살펴보겠습니다:

```kotlin
val result = buildList {
    val x = get(0)
}
```

여기서 `x`는 지연된 타입 변수 타입입니다: `get()` 호출은 타입 `E`의 값을 반환하지만, `E` 자체는 아직 확정되지 않았습니다. 현재 `E`에 대한 구체적인 타입은 알 수 없습니다.

지연된 타입 변수의 값이 구체적인 타입과 연관될 때, 빌더 추론은 이 정보를 수집하여 빌더 추론 분석의 마지막에 해당 타입 인자의 결과 타입을 추론합니다. 예를 들어:

```kotlin
val result = buildList {
    val x = get(0)
    val y: String = x
} // result has the List<String> type inferred
```

지연된 타입 변수가 `String` 타입의 변수에 할당된 후, 빌더 추론은 `x`가 `String`의 하위 타입이라는 정보를 얻습니다. 이 할당이 빌더 람다의 마지막 문이므로, 빌더 추론 분석은 타입 인자 `E`를 `String`으로 추론하는 결과로 마무리됩니다.

지연된 타입 변수를 수신자로 하여 언제든지 `equals()`, `hashCode()`, `toString()` 함수를 호출할 수 있습니다.

### 빌더 추론 결과에 기여하기

빌더 추론은 분석 결과에 기여하는 다양한 종류의 타입 정보를 수집할 수 있습니다. 다음을 고려합니다:
* 타입 파라미터의 타입을 사용하는 람다 수신자에 대한 메서드 호출
  ```kotlin
  val result = buildList {
      // Type argument is inferred into String based on the passed "value" argument
      add("value")
  } // result has the List<String> type inferred
  ```
* 타입 파라미터의 타입을 반환하는 호출에 대한 예상 타입 지정
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

  fun <K> myBuilder(builder: Foo<K>.() -> Unit): Foo<K> = Foo<K>().apply(builder)

  fun main() {
      val result = myBuilder {
          val x: List<CharSequence> = items
          // ...
      } // result has the Foo<CharSequence> type
  }
  ```
* 지연된 타입 변수의 타입을 구체적인 타입을 예상하는 메서드로 전달
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
* 람다 수신자 멤버에 대한 호출 가능한 참조 가져오기
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

분석이 끝나면 빌더 추론은 수집된 모든 타입 정보를 고려하여 결과 타입으로 병합을 시도합니다. 예시를 살펴보겠습니다.

```kotlin
val result = buildList { // Inferring postponed type variable E
    // Considering E is Number or a subtype of Number
    val n: Number? = getOrNull(0)
    // Considering E is Int or a supertype of Int
    add(1)
    // E gets inferred into Int
} // result has the List<Int> type
```

결과 타입은 분석 중에 수집된 타입 정보에 해당하는 가장 구체적인 타입입니다. 주어진 타입 정보가 모순되어 병합될 수 없는 경우, 컴파일러는 오류를 보고합니다.

코틀린 컴파일러는 일반적인 타입 추론이 타입 인자를 추론할 수 없는 경우에만 빌더 추론을 사용합니다. 이는 빌더 람다 외부에서 타입 정보를 제공할 수 있으며, 이 경우 빌더 추론 분석이 필요하지 않다는 것을 의미합니다. 예시를 살펴보겠습니다:

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

여기서는 맵의 예상 타입이 빌더 람다 외부에서 지정되었기 때문에 타입 불일치가 발생합니다. 컴파일러는 `Map<in String, String>`이라는 고정된 수신자 타입을 사용하여 내부의 모든 문을 분석합니다.