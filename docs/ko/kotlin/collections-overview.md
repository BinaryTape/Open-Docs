---
title: "컬렉션 개요"
---
Kotlin 표준 라이브러리는 _컬렉션_ 관리을 위한 포괄적인 도구 세트를 제공합니다. 컬렉션은 해결해야 하는 문제에 중요하고 일반적으로 작동되는 가변적인 수의 항목 그룹(아마도 0개)입니다.

컬렉션은 대부분의 프로그래밍 언어에서 공통적인 개념이므로, 예를 들어 Java 또는 Python 컬렉션에 익숙하다면 이 소개 부분을 건너뛰고 자세한 섹션으로 진행할 수 있습니다.

컬렉션은 일반적으로 동일한 유형(및 그 하위 유형)의 여러 객체를 포함합니다. 컬렉션의 객체를 _요소_ 또는 _항목_이라고 합니다. 예를 들어 학과의 모든 학생은 평균 나이를 계산하는 데 사용할 수 있는 컬렉션을 형성합니다.

Kotlin과 관련된 컬렉션 유형은 다음과 같습니다.

* _List_는 인덱스(해당 위치를 반영하는 정수)로 요소에 액세스할 수 있는 정렬된 컬렉션입니다. 요소는 목록에 두 번 이상 나타날 수 있습니다. 목록의 예로는 전화 번호가 있습니다. 전화 번호는 숫자 그룹이고, 순서가 중요하며, 반복될 수 있습니다.
* _Set_은 고유한 요소의 컬렉션입니다. 집합의 수학적 추상화를 반영합니다. 즉, 반복이 없는 객체 그룹입니다. 일반적으로 집합 요소의 순서는 중요하지 않습니다. 예를 들어 복권의 숫자는 집합을 형성합니다. 숫자는 고유하고 순서가 중요하지 않습니다.
* _Map_(_dictionary_라고도 함)은 키-값 쌍의 집합입니다. 키는 고유하며 각 키는 정확히 하나의 값에 매핑됩니다. 값은 중복될 수 있습니다. 맵은 객체 간의 논리적 연결을 저장하는 데 유용합니다. 예를 들어 직원의 ID와 직위 간의 연결을 저장할 수 있습니다.

Kotlin을 사용하면 컬렉션에 저장된 객체의 정확한 유형과 독립적으로 컬렉션을 조작할 수 있습니다. 즉, `String` 목록에 `String`을 추가하는 방법은 `Int` 또는 사용자 정의 클래스를 추가하는 방법과 동일합니다. 따라서 Kotlin 표준 라이브러리는 모든 유형의 컬렉션을 생성, 채우기 및 관리하기 위한 일반 인터페이스, 클래스 및 함수를 제공합니다.

컬렉션 인터페이스 및 관련 함수는 `kotlin.collections` 패키지에 있습니다. 해당 내용을 간략하게 살펴보겠습니다.

:::note
배열은 컬렉션 유형이 아닙니다. 자세한 내용은 [배열](arrays)을 참조하세요.

:::

## 컬렉션 유형

Kotlin 표준 라이브러리는 기본 컬렉션 유형(집합, 목록 및 맵)에 대한 구현을 제공합니다.
각 컬렉션 유형은 한 쌍의 인터페이스로 표현됩니다.

* 컬렉션 요소에 액세스하기 위한 작업을 제공하는 _읽기 전용_ 인터페이스입니다.
* 해당 읽기 전용 인터페이스를 확장하여 쓰기 작업(요소 추가, 제거 및 업데이트)을 수행하는 _변경 가능_ 인터페이스입니다.

변경 가능한 컬렉션이 [`var`](basic-syntax#variables)에 할당될 필요는 없습니다. 변경 가능한 컬렉션을 사용한 쓰기 작업은 `val`에 할당된 경우에도 여전히 가능합니다. 변경 가능한 컬렉션을 `val`에 할당하면 변경 가능한 컬렉션에 대한 참조가 수정되지 않도록 보호할 수 있습니다. 시간이 지남에 따라 코드가 증가하고 복잡해짐에 따라 참조에 대한 의도하지 않은 수정을 방지하는 것이 더욱 중요해집니다. 더 안전하고 강력한 코드를 위해 가능한 한 `val`을 많이 사용하세요. `val` 컬렉션을 다시 할당하려고 하면 컴파일 오류가 발생합니다.

```kotlin
fun main() {

    val numbers = mutableListOf("one", "two", "three", "four")
    numbers.add("five")   // this is OK
    println(numbers)
    //numbers = mutableListOf("six", "seven")      // compilation error

}
```

읽기 전용 컬렉션 유형은 [공변](generics#variance)입니다.
즉, `Rectangle` 클래스가 `Shape`에서 상속되는 경우 `List<Rectangle>`이 필요한 모든 위치에서 `List<Shape>`를 사용할 수 있습니다.
다시 말해, 컬렉션 유형은 요소 유형과 동일한 하위 유형 관계를 가집니다. 맵은 값 유형에서는 공변이지만 키 유형에서는 공변이 아닙니다.

반면, 변경 가능한 컬렉션은 공변이 아닙니다. 그렇지 않으면 런타임 오류가 발생할 수 있습니다. `MutableList<Rectangle>`이 `MutableList<Shape>`의 하위 유형인 경우 다른 `Shape` 상속자(예: `Circle`)를 삽입하여 `Rectangle` 유형 인수를 위반할 수 있습니다.

다음은 Kotlin 컬렉션 인터페이스의 다이어그램입니다.

<img src="/img/collections-diagram.png" alt="Collection interfaces hierarchy" width="500" style={{verticalAlign: 'middle'}}/>

인터페이스와 해당 구현을 살펴보겠습니다. `Collection`에 대한 자세한 내용은 아래 섹션을 참조하세요. `List`, `Set` 및 `Map`에 대한 자세한 내용은 해당 섹션을 읽거나 Sebastian Aigner, Kotlin Developer Advocate의 비디오를 시청하세요.

<video src="https://www.youtube.com/v/F8jj7e-_jFA" title="Kotlin Collections Overview"/>

### Collection

[`Collection<T>`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-collection/index.html)은 컬렉션 계층 구조의 루트입니다. 이 인터페이스는 크기 검색, 항목 멤버십 확인 등과 같은 읽기 전용 컬렉션의 공통 동작을 나타냅니다.
`Collection`은 요소를 반복하기 위한 작업을 정의하는 `Iterable<T>` 인터페이스에서 상속됩니다. 다양한 컬렉션 유형에 적용되는 함수의 매개 변수로 `Collection`을 사용할 수 있습니다. 더 구체적인 경우에는 `Collection`의 상속자인 [`List`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-list/index.html)
 및 [`Set`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-set/index.html)을 사용하세요.

```kotlin
fun printAll(strings: Collection<String>) {
    for(s in strings) print("$s ")
    println()
}
    
fun main() {
    val stringList = listOf("one", "two", "one")
    printAll(stringList)
    
    val stringSet = setOf("one", "two", "three")
    printAll(stringSet)
}
```

[`MutableCollection<T>`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-mutable-collection/index.html)은 
`add` 및 `remove`와 같은 쓰기 작업이 있는 `Collection`입니다.

```kotlin
fun List<String>.getShortWordsTo(shortWords: MutableList<String>, maxLength: Int) {
    this.filterTo(shortWords) { it.length <= maxLength }
    // throwing away the articles
    val articles = setOf("a", "A", "an", "An", "the", "The")
    shortWords -= articles
}

fun main() {
    val words = "A long time ago in a galaxy far far away".split(" ")
    val shortWords = mutableListOf<String>()
    words.getShortWordsTo(shortWords, 3)
    println(shortWords)
}
```

### List

[`List<T>`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-list/index.html)는 지정된 순서로 요소를 저장하고 인덱싱된 액세스를 제공합니다. 인덱스는 0부터 시작합니다(첫 번째 요소의 인덱스)
`lastIndex`까지 진행합니다. `lastIndex`는 `(list.size - 1)`입니다.

```kotlin
fun main() {

    val numbers = listOf("one", "two", "three", "four")
    println("Number of elements: ${numbers.size}")
    println("Third element: ${numbers.get(2)}")
    println("Fourth element: ${numbers[3]}")
    println("Index of element \"two\" ${numbers.indexOf("two")}")

}
```

목록 요소(null 포함)는 중복될 수 있습니다. 목록에는 동일한 객체 또는 단일 객체의 발생 횟수가 얼마든지 포함될 수 있습니다.
두 목록은 크기가 같고 동일한 위치에 [구조적으로 동일한](equality#structural-equality) 요소가 있는 경우 동일한 것으로 간주됩니다.

```kotlin
data class Person(var name: String, var age: Int)

fun main() {

    val bob = Person("Bob", 31)
    val people = listOf(Person("Adam", 20), bob, bob)
    val people2 = listOf(Person("Adam", 20), Person("Bob", 31), bob)
    println(people == people2)
    bob.age = 32
    println(people == people2)

}
```

[`MutableList<T>`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-mutable-list/index.html)는 
목록별 쓰기 작업(예: 특정 위치에 요소 추가 또는 제거)이 있는 `List`입니다.

```kotlin
fun main() {

    val numbers = mutableListOf(1, 2, 3, 4)
    numbers.add(5)
    numbers.removeAt(1)
    numbers[0] = 0
    numbers.shuffle()
    println(numbers)

}
```

보시다시피 목록은 일부 측면에서 배열과 매우 유사합니다.
그러나 한 가지 중요한 차이점이 있습니다. 배열의 크기는 초기화 시 정의되며 변경되지 않습니다.
반면, 목록에는 미리 정의된 크기가 없습니다. 목록의 크기는 쓰기 작업(요소 추가, 업데이트 또는 제거)의 결과로 변경될 수 있습니다.

Kotlin에서 `MutableList`의 기본 구현은 [`ArrayList`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-array-list/index.html)입니다.
이는 크기 조정 가능한 배열로 생각할 수 있습니다.

### Set

[`Set<T>`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-set/index.html)는 고유한 요소를 저장합니다.
해당 순서는 일반적으로 정의되지 않습니다. `null` 요소도 고유합니다. `Set`에는 하나의 `null`만 포함될 수 있습니다.
두 집합은 크기가 같고 집합의 각 요소에 대해 다른 집합에 동일한 요소가 있는 경우 동일합니다.

```kotlin
fun main() {

    val numbers = setOf(1, 2, 3, 4)
    println("Number of elements: ${numbers.size}")
    if (numbers.contains(1)) println("1 is in the set")

    val numbersBackwards = setOf(4, 3, 2, 1)
    println("The sets are equal: ${numbers == numbersBackwards}")

}
```

[`MutableSet`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-mutable-set/index.html)은 `MutableCollection`의 
쓰기 작업이 있는 `Set`입니다.

`MutableSet`의 기본 구현인 [`LinkedHashSet`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-linked-hash-set/index.html)은 
요소 삽입 순서를 유지합니다.
따라서 `first()` 또는 `last()`와 같이 순서에 의존하는 함수는 이러한 집합에서 예측 가능한 결과를 반환합니다.

```kotlin
fun main() {

    val numbers = setOf(1, 2, 3, 4)  // LinkedHashSet is the default implementation
    val numbersBackwards = setOf(4, 3, 2, 1)
    
    println(numbers.first() == numbersBackwards.first())
    println(numbers.first() == numbersBackwards.last())

}
```

대체 구현인 [`HashSet`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-hash-set/index.html)은 
요소 순서에 대해 아무것도 알려주지 않으므로 이러한 함수를 호출하면 예측할 수 없는 결과가 반환됩니다. 그러나 `HashSet`은 
동일한 수의 요소를 저장하는 데 더 적은 메모리가 필요합니다.

### Map

[`Map<K, V>`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-map/index.html)은 
`Collection` 인터페이스의 상속자가 아닙니다. 하지만 Kotlin 컬렉션 유형이기도 합니다.
`Map`은 _키-값_ 쌍(또는 _항목_)을 저장합니다. 키는 고유하지만 다른 키는 동일한 값과 쌍을 이룰 수 있습니다.
`Map` 인터페이스는 키별 값에 대한 액세스, 키 및 값 검색 등과 같은 특정 함수를 제공합니다.

```kotlin
fun main() {

    val numbersMap = mapOf("key1" to 1, "key2" to 2, "key3" to 3, "key4" to 1)
    
    println("All keys: ${numbersMap.keys}")
    println("All values: ${numbersMap.values}")
    if ("key2" in numbersMap) println("Value by key \"key2\": ${numbersMap["key2"]}")    
    if (1 in numbersMap.values) println("The value 1 is in the map")
    if (numbersMap.containsValue(1)) println("The value 1 is in the map") // same as previous

}
```

동일한 쌍을 포함하는 두 맵은 쌍 순서에 관계없이 동일합니다.

```kotlin
fun main() {

    val numbersMap = mapOf("key1" to 1, "key2" to 2, "key3" to 3, "key4" to 1)    
    val anotherMap = mapOf("key2" to 2, "key1" to 1, "key4" to 1, "key3" to 3)
    
    println("The maps are equal: ${numbersMap == anotherMap}")

}
```

[`MutableMap`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-mutable-map/index.html)은 
맵 쓰기 작업이 있는 `Map`입니다. 예를 들어 새 키-값 쌍을 추가하거나 지정된 키와 연결된 값을 업데이트할 수 있습니다.

```kotlin
fun main() {

    val numbersMap = mutableMapOf("one" to 1, "two" to 2)
    numbersMap.put("three", 3)
    numbersMap["one"] = 11

    println(numbersMap)

}
```

`MutableMap`의 기본 구현인 [`LinkedHashMap`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-linked-hash-map/index.html)은 
맵을 반복할 때 요소 삽입 순서를 유지합니다.
반면, 대체 구현인 [`HashMap`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-hash-map/index.html)은 
요소 순서에 대해 아무것도 알려주지 않습니다.

### ArrayDeque

[`ArrayDeque<T>`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-array-deque/)은 큐의 시작 또는 끝에 요소를 추가하거나 제거할 수 있는 양방향 큐의 구현입니다.
따라서 `ArrayDeque`는 Kotlin에서 스택 및 큐 데이터 구조의 역할도 수행합니다. 내부적으로 `ArrayDeque`는 필요할 때 크기가 자동으로 조정되는 크기 조정 가능한 배열을 사용하여 실현됩니다.

```kotlin
fun main() {
    val deque = ArrayDeque(listOf(1, 2, 3))

    deque.addFirst(0)
    deque.addLast(4)
    println(deque) // [0, 1, 2, 3, 4]

    println(deque.first()) // 0
    println(deque.last()) // 4

    deque.removeFirst()
    deque.removeLast()
    println(deque) // [1, 2, 3]
}
```