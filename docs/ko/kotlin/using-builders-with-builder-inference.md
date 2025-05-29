[//]: # (title: 빌더 타입 추론과 함께 빌더 사용하기)

코틀린은 제네릭 빌더를 사용할 때 유용하게 쓰일 수 있는 _빌더 타입 추론 (builder type inference)_ (또는 빌더 추론)을 지원합니다. 이는 컴파일러가 빌더 호출의 람다 인자 내부의 다른 호출에 대한 타입 정보를 기반으로 타입 인자를 추론하는 데 도움이 됩니다.

다음은 [`buildMap()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/build-map.html) 사용 예시입니다:

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

여기서는 일반적인 방식으로 타입 인자를 추론하기에 충분한 타입 정보가 없지만, 빌더 추론은 람다 인자 내부의 호출을 분석할 수 있습니다. `putAll()` 및 `put()` 호출에 대한 타입 정보를 기반으로 컴파일러는 `buildMap()` 호출의 타입 인자를 `String`과 `Number`로 자동으로 추론할 수 있습니다. 빌더 추론을 통해 제네릭 빌더를 사용할 때 타입 인자를 생략할 수 있습니다.

## 자신만의 빌더 작성하기

### 빌더 추론 활성화 요구사항

> Kotlin 1.7.0 이전에는 빌더 함수에 빌더 추론을 활성화하려면 `-Xenable-builder-inference` 컴파일러 옵션이 필요했습니다. 1.7.0에서는 이 옵션이 기본적으로 활성화됩니다.
>
{style="note"}

자신만의 빌더에서 빌더 추론이 작동하도록 하려면, 빌더 선언에 리시버가 있는 함수 타입의 빌더 람다 파라미터가 있는지 확인하세요. 리시버 타입에 대한 두 가지 요구사항도 있습니다:

1.  빌더 추론이 추론해야 하는 타입 인자를 사용해야 합니다. 예를 들어:
    ```kotlin
    fun <V> buildList(builder: MutableList<V>.() -> Unit) { ... }
    ```

    > `fun <T> myBuilder(builder: T.() -> Unit)`과 같이 타입 파라미터의 타입을 직접 전달하는 것은 아직 지원되지 않습니다.
    >
    {style="note"}

2.  시그니처에 해당하는 타입 파라미터를 포함하는 퍼블릭 멤버 또는 확장 함수/프로퍼티를 제공해야 합니다. 예를 들어:
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
        val itemHolder1 = itemHolderBuilder { // itemHolder1의 타입은 ItemHolder<String>
            addItem(s)
        }
        val itemHolder2 = itemHolderBuilder { // itemHolder2의 타입은 ItemHolder<String>
            addAllItems(listOf(s))
        }
        val itemHolder3 = itemHolderBuilder { // itemHolder3의 타입은 ItemHolder<String?>
            val lastItem: String? = getLastItem()
            // ...
        }
    }
    ```

### 지원되는 기능

빌더 추론은 다음을 지원합니다:
*   여러 타입 인자 추론
    ```kotlin
    fun <K, V> myBuilder(builder: MutableMap<K, V>.() -> Unit): Map<K, V> { ... }
    ```
*   상호 의존적인 여러 빌더 람다의 타입 인자를 하나의 호출 내에서 추론
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
        // result는 Pair<List<Int>, Map<String, Int>> 타입을 가짐
    }
    ```
*   타입 파라미터가 람다의 파라미터 또는 반환 타입인 타입 인자 추론
    ```kotlin
    fun <K, V> myBuilder1(
        mapBuilder: MutableMap<K, V>.() -> K
    ): Map<K, V> = mutableMapOf<K, V>().apply { mapBuilder() }

    fun <K, V> myBuilder2(
        mapBuilder: MutableMap<K, V>.(K) -> Unit
    ): Map<K, V> = mutableMapOf<K, V>().apply { mapBuilder(2 as K) }

    fun main() {
        // result1은 Map<Long, String> 타입으로 추론됨
        val result1 = myBuilder1 {
            put(1L, "value")
            2
        }
        val result2 = myBuilder2 {
            put(1, "value 1")
            // `it`을 "지연된 타입 변수" 타입으로 사용할 수 있습니다.
            // 자세한 내용은 아래 섹션을 참조하세요.
            put(it, "value 2")
        }
    }
    ```

## 빌더 추론 작동 방식

### 지연된 타입 변수

빌더 추론은 빌더 추론 분석 중에 빌더 람다 내부에 나타나는 _지연된 타입 변수 (postponed type variables)_ 개념으로 작동합니다. 지연된 타입 변수는 추론 과정에 있는 타입 인자의 타입입니다. 컴파일러는 이를 사용하여 타입 인자에 대한 타입 정보를 수집합니다.

[`buildList()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/build-list.html) 예시를 살펴보겠습니다:

```kotlin
val result = buildList {
    val x = get(0)
}
```

여기서 `x`는 지연된 타입 변수의 타입을 가집니다: `get()` 호출은 타입 `E`의 값을 반환하지만, `E` 자체는 아직 확정되지 않았습니다. 이 시점에서는 `E`의 구체적인 타입은 알 수 없습니다.

지연된 타입 변수의 값이 구체적인 타입과 연결될 때, 빌더 추론은 이 정보를 수집하여 빌더 추론 분석이 끝날 때 해당하는 타입 인자의 결과 타입을 추론합니다. 예를 들어:

```kotlin
val result = buildList {
    val x = get(0)
    val y: String = x
} // result는 List<String> 타입으로 추론됨
```

지연된 타입 변수가 `String` 타입의 변수에 할당된 후, 빌더 추론은 `x`가 `String`의 하위 타입이라는 정보를 얻습니다. 이 할당이 빌더 람다의 마지막 문이므로, 빌더 추론 분석은 타입 인자 `E`를 `String`으로 추론하는 결과로 끝납니다.

지연된 타입 변수를 리시버로 사용하여 `equals()`, `hashCode()`, `toString()` 함수를 항상 호출할 수 있다는 점을 유의하세요.

### 빌더 추론 결과에 기여

빌더 추론은 분석 결과에 기여하는 다양한 타입 정보를 수집할 수 있습니다. 다음과 같은 경우를 고려합니다:
*   타입 파라미터의 타입을 사용하는 람다 리시버의 메서드 호출
    ```kotlin
    val result = buildList {
        // 전달된 "value" 인자를 기반으로 타입 인자는 String으로 추론됨
        add("value")
    } // result는 List<String> 타입으로 추론됨
    ```
*   타입 파라미터의 타입을 반환하는 호출에 대한 예상 타입 지정
    ```kotlin
    val result = buildList {
        // 예상 타입을 기반으로 타입 인자는 Float으로 추론됨
        val x: Float = get(0)
    } // result는 List<Float> 타입을 가짐
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
        } // result는 Foo<CharSequence> 타입을 가짐
    }
    ```
*   구체적인 타입을 예상하는 메서드에 지연된 타입 변수의 타입을 전달
    ```kotlin
    fun takeMyLong(x: Long) { ... }

    fun String.isMoreThat3() = length > 3

    fun takeListOfStrings(x: List<String>) { ... }

    fun main() {
        val result1 = buildList {
            val x = get(0)
            takeMyLong(x)
        } // result1은 List<Long> 타입을 가짐

        val result2 = buildList {
            val x = get(0)
            val isLong = x.isMoreThat3()
        // ...
        } // result2는 List<String> 타입을 가짐

        val result3 = buildList {
            takeListOfStrings(this)
        } // result3은 List<String> 타입을 가짐
    }
    ```
*   람다 리시버 멤버에 대한 호출 가능 참조 가져오기
    ```kotlin
    fun main() {
        val result = buildList {
            val x: KFunction1<Int, Float> = ::get
        } // result는 List<Float> 타입을 가짐
    }
    ```
    ```kotlin
    fun takeFunction(x: KFunction1<Int, Float>) { ... }

    fun main() {
        val result = buildList {
            takeFunction(::get)
        } // result는 List<Float> 타입을 가짐
    }
    ```

분석이 끝날 때, 빌더 추론은 수집된 모든 타입 정보를 고려하고 이를 결과 타입으로 병합하려고 시도합니다. 예시를 참조하세요.

```kotlin
val result = buildList { // 지연된 타입 변수 E 추론 중
    // E는 Number 또는 Number의 하위 타입으로 간주
    val n: Number? = getOrNull(0)
    // E는 Int 또는 Int의 상위 타입으로 간주
    add(1)
    // E는 Int로 추론됨
} // result는 List<Int> 타입을 가짐
```

결과 타입은 분석 중에 수집된 타입 정보와 일치하는 가장 구체적인 타입입니다. 주어진 타입 정보가 모순적이고 병합될 수 없는 경우, 컴파일러는 오류를 보고합니다.

코틀린 컴파일러는 일반적인 타입 추론이 타입 인자를 추론할 수 없을 때만 빌더 추론을 사용한다는 점을 유의하세요. 이는 빌더 람다 외부에서 타입 정보를 기여할 수 있으며, 이 경우 빌더 추론 분석이 필요하지 않다는 것을 의미합니다. 예시를 살펴보세요:

```kotlin
fun someMap() = mutableMapOf<CharSequence, String>()

fun <E> MutableMap<E, String>.f(x: MutableMap<E, String>) { ... }

fun main() {
    val x: Map<in String, String> = buildMap {
        put("", "")
        f(someMap()) // 타입 불일치 (필요: String, 발견: CharSequence)
    }
}
```

여기서 맵의 예상 타입이 빌더 람다 외부에서 지정되었기 때문에 타입 불일치가 발생합니다. 컴파일러는 고정된 리시버 타입 `Map<in String, String>`으로 내부의 모든 문을 분석합니다.