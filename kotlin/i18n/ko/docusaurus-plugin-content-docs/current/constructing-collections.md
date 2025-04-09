---
title: "컬렉션 구성"
---
## 요소로부터 생성

컬렉션을 만드는 가장 일반적인 방법은 표준 라이브러리 함수인 [`listOf<T>()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/list-of.html),
[`setOf<T>()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/set-of.html),
[`mutableListOf<T>()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/mutable-list-of.html),
[`mutableSetOf<T>()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/mutable-set-of.html)를 사용하는 것입니다.
쉼표로 구분된 컬렉션 요소 목록을 인수로 제공하면 컴파일러가 요소 유형을 자동으로 감지합니다.
빈 컬렉션을 만들 때는 유형을 명시적으로 지정하세요.

```kotlin
val numbersSet = setOf("one", "two", "three", "four")
val emptySet = mutableSetOf<String>()
```

[`mapOf()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/map-of.html)
및 [`mutableMapOf()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/mutable-map-of.html) 함수를 사용하여 맵에서도 동일하게 사용할 수 있습니다. 맵의
키와 값은 `Pair` 객체로 전달됩니다 (일반적으로 `to` 중위 함수로 생성됨).

```kotlin
val numbersMap = mapOf("key1" to 1, "key2" to 2, "key3" to 3, "key4" to 1)
```

`to` 표기법은 짧은 수명의 `Pair` 객체를 생성하므로 성능이 중요하지 않은 경우에만 사용하는 것이 좋습니다. 과도한 메모리 사용을 피하려면 다른 방법을 사용하세요. 예를 들어, 변경 가능한 맵을 만들고
쓰기 작업을 사용하여 채울 수 있습니다. [`apply()`](scope-functions#apply) 함수는 여기서 초기화를 유연하게 유지하는 데 도움이 될 수 있습니다.

```kotlin
val numbersMap = mutableMapOf<String, String>().apply { this["one"] = "1"; this["two"] = "2" }
```

## 컬렉션 빌더 함수로 생성

컬렉션을 만드는 또 다른 방법은 빌더 함수인
[`buildList()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/build-list.html), [`buildSet()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/build-set.html) 또는
[`buildMap()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/build-map.html)을 호출하는 것입니다. 이러한 함수는 해당 유형의 새로운 변경 가능한 컬렉션을 생성하고,
[쓰기 작업](collection-write)을 사용하여 채우고, 동일한 요소가 있는 읽기 전용 컬렉션을 반환합니다.

```kotlin
val map = buildMap { // this is MutableMap<String, Int>, types of key and value are inferred from the `put()` calls below
    put("a", 1)
    put("b", 0)
    put("c", 4)
}

println(map) // {a=1, b=0, c=4}
```

## 빈 컬렉션

요소가 없는 컬렉션을 만드는 함수도 있습니다. [`emptyList()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/empty-list.html),
[`emptySet()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/empty-set.html) 및
[`emptyMap()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/empty-map.html).
빈 컬렉션을 만들 때는 컬렉션에 포함될 요소의 유형을 지정해야 합니다.

```kotlin
val empty = emptyList<String>()
```

## 리스트 초기화 함수

리스트의 경우 리스트 크기와 해당 인덱스를 기반으로 요소 값을 정의하는 초기화 함수를 사용하는 생성자와 유사한 함수가 있습니다.

```kotlin
fun main() {

    val doubled = List(3, { it * 2 })  // or MutableList if you want to change its content later
    println(doubled)

}
```

## 구체적인 유형 생성자

`ArrayList` 또는 `LinkedList`와 같은 구체적인 유형 컬렉션을 만들려면 이러한 유형에 사용 가능한 생성자를 사용할 수 있습니다. 유사한 생성자를 `Set` 및 `Map`의 구현에서도 사용할 수 있습니다.

```kotlin
val linkedList = LinkedList<String>(listOf("one", "two", "three"))
val presizedSet = HashSet<Int>(32)
```

## 복사

기존 컬렉션과 동일한 요소로 컬렉션을 만들려면 복사 함수를 사용할 수 있습니다. 표준 라이브러리의 컬렉션
복사 함수는 동일한 요소에 대한 참조가 있는 _shallow_ 복사 컬렉션을 만듭니다.
따라서 컬렉션 요소에 대한 변경 사항은 모든 복사본에 반영됩니다.

[`toList()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/to-list.html),
[`toMutableList()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/to-mutable-list.html),
[`toSet()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/to-set.html) 등과 같은 컬렉션 복사 함수는 특정 시점에 컬렉션의 스냅샷을 만듭니다.
결과는 동일한 요소의 새 컬렉션입니다.
원본 컬렉션에서 요소를 추가하거나 제거하면 복사본에 영향을 주지 않습니다. 복사본은 소스와 독립적으로 변경될 수 있습니다.

```kotlin
class Person(var name: String)
fun main() {

    val alice = Person("Alice")
    val sourceList = mutableListOf(alice, Person("Bob"))
    val copyList = sourceList.toList()
    sourceList.add(Person("Charles"))
    alice.name = "Alicia"
    println("First item's name is: ${sourceList[0].name} in source and ${copyList[0].name} in copy")
    println("List size is: ${sourceList.size} in source and ${copyList.size} in copy")

}
```

이러한 함수는 컬렉션을 다른 유형으로 변환하는 데에도 사용할 수 있습니다. 예를 들어, 리스트에서 셋을 빌드하거나 그 반대로 할 수 있습니다.

```kotlin
fun main() {

    val sourceList = mutableListOf(1, 2, 3)    
    val copySet = sourceList.toMutableSet()
    copySet.add(3)
    copySet.add(4)    
    println(copySet)

}
```

또는 동일한 컬렉션 인스턴스에 대한 새 참조를 만들 수 있습니다. 컬렉션 변수를 기존 컬렉션으로 초기화할 때 새 참조가 생성됩니다.
따라서 참조를 통해 컬렉션 인스턴스가 변경되면 변경 사항은 모든 참조에 반영됩니다.

```kotlin
fun main() {

    val sourceList = mutableListOf(1, 2, 3)
    val referenceList = sourceList
    referenceList.add(4)
    println("Source size: ${sourceList.size}")

}
```

컬렉션 초기화는 변경 가능성을 제한하는 데 사용할 수 있습니다. 예를 들어, `MutableList`에 대한 `List` 참조를 만들면 이 참조를 통해 컬렉션을 수정하려고 할 때 컴파일러에서 오류가 발생합니다.

```kotlin
fun main() {

    val sourceList = mutableListOf(1, 2, 3)
    val referenceList: List<Int> = sourceList
    //referenceList.add(4)            //compilation error
    sourceList.add(4)
    println(referenceList) // shows the current state of sourceList

}
```

## 다른 컬렉션에서 함수 호출

컬렉션은 다른 컬렉션에 대한 다양한 작업의 결과로 생성될 수 있습니다. 예를 들어, [필터링](collection-filtering)을
하면 필터와 일치하는 요소의 새 목록이 만들어집니다.

```kotlin
fun main() {

    val numbers = listOf("one", "two", "three", "four")  
    val longerThan3 = numbers.filter { it.length > 3 }
    println(longerThan3)

}
```

[매핑](collection-transformations#map)은 변환 결과에서 목록을 생성합니다.

```kotlin
fun main() {

    val numbers = setOf(1, 2, 3)
    println(numbers.map { it * 3 })
    println(numbers.mapIndexed { idx, value `->` value * idx })

}
```

[연관](collection-transformations#associate)은 맵을 생성합니다.

```kotlin
fun main() {

    val numbers = listOf("one", "two", "three", "four")
    println(numbers.associateWith { it.length })

}
```

Kotlin의 컬렉션 작업에 대한 자세한 내용은 [컬렉션 작업 개요](collection-operations)를 참조하세요.