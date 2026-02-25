[//]: # (title: 컬렉션 개요)

Kotlin 표준 라이브러리는 가변적인 수의 아이템(0개 포함)을 관리하기 위한 포괄적인 도구 세트인 _컬렉션(collections)_을 제공합니다. 컬렉션은 해결하려는 문제에서 중요하게 다루어지며 흔히 조작되는 대상입니다.

컬렉션은 대부분의 프로그래밍 언어에서 공통적인 개념이므로, Java나 Python의 컬렉션에 익숙하다면 이 소개 부분을 건너뛰고 상세 섹션으로 진행해도 좋습니다.

컬렉션은 대개 동일한 타입(및 그 하위 타입)의 여러 객체를 포함합니다. 컬렉션에 있는 객체를 _요소(elements)_ 또는 _아이템(items)_이라고 부릅니다. 예를 들어, 학과의 모든 학생은 평균 연령을 계산하는 데 사용할 수 있는 하나의 컬렉션을 형성합니다.

Kotlin에서는 다음과 같은 컬렉션 타입들이 중요합니다.

* _리스트(List)_는 순서가 있는 컬렉션으로, 요소의 위치를 나타내는 정수인 인덱스(index)를 통해 요소에 접근할 수 있습니다. 리스트에서는 요소가 한 번 이상 나타날 수 있습니다. 리스트의 예로 전화번호를 들 수 있습니다. 전화번호는 숫자의 그룹이며, 순서가 중요하고 숫자가 반복될 수 있습니다.
* _셋(Set)_은 고유한 요소들의 컬렉션입니다. 중복이 없는 객체 그룹이라는 수학적 집합의 추상화를 반영합니다. 일반적으로 셋 요소의 순서는 중요하지 않습니다. 예를 들어, 복권 번호는 셋을 이룹니다. 번호들은 고유하며 순서는 중요하지 않습니다.
* _맵(Map 또는 딕셔너리)_은 키-값(key-value) 쌍의 집합입니다. 키는 고유하며 각 키는 정확히 하나의 값에 매핑됩니다. 값은 중복될 수 있습니다. 맵은 객체 간의 논리적 연결을 저장하는 데 유용합니다. 예를 들어 직원의 ID와 그들의 직책을 연결하는 경우입니다.

Kotlin을 사용하면 컬렉션에 저장된 객체의 정확한 타입과 관계없이 컬렉션을 조작할 수 있습니다. 즉, `String` 리스트에 `String`을 추가하는 방식은 `Int`나 사용자 정의 클래스를 추가할 때와 동일합니다.
따라서 Kotlin 표준 라이브러리는 모든 타입의 컬렉션을 생성, 채우기 및 관리하기 위한 제네릭 인터페이스, 클래스 및 함수를 제공합니다.

컬렉션 인터페이스와 관련 함수들은 `kotlin.collections` 패키지에 위치해 있습니다. 그 내용을 개괄적으로 살펴보겠습니다.

> 배열(Arrays)은 컬렉션 타입이 아닙니다. 자세한 내용은 [배열(Arrays)](arrays.md)을 참고하세요.
>
{style="note"}

## 컬렉션 타입

Kotlin 표준 라이브러리는 기본적인 컬렉션 타입인 셋, 리스트, 맵에 대한 구현을 제공합니다.
각 컬렉션 타입은 한 쌍의 인터페이스로 표현됩니다.

* 컬렉션 요소에 접근하는 연산을 제공하는 _읽기 전용(read-only)_ 인터페이스.
* 해당 읽기 전용 인터페이스를 확장하여 요소의 추가, 삭제, 업데이트와 같은 쓰기 연산을 제공하는 _가변(mutable)_ 인터페이스.

가변 컬렉션이라고 해서 반드시 [`var`](basic-syntax.md#variables)에 할당해야 하는 것은 아닙니다. 가변 컬렉션이 `val`에 할당되어 있더라도 쓰기 연산은 여전히 가능합니다. 가변 컬렉션을 `val`에 할당할 때의 이점은 가변 컬렉션에 대한 참조(reference)가 수정되지 않도록 보호할 수 있다는 점입니다. 시간이 지나 코드가 커지고 복잡해질수록, 참조에 대한 의도치 않은 수정을 방지하는 것이 더욱 중요해집니다. 더 안전하고 견고한 코드를 위해 가능한 한 `val`을 사용하세요. `val` 컬렉션을 재할당하려고 하면 컴파일 오류가 발생합니다.

```kotlin
fun main() {
//sampleStart
    val numbers = mutableListOf("one", "two", "three", "four")
    numbers.add("five")   // 정상 작동
    println(numbers)
    //numbers = mutableListOf("six", "seven")      // 컴파일 오류
//sampleEnd

}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

읽기 전용 컬렉션 타입은 [공변성(covariant)](generics.md#variance)을 가집니다.
이는 `Rectangle` 클래스가 `Shape`를 상속받는 경우, `List<Shape>`가 필요한 모든 곳에 `List<Rectangle>`을 사용할 수 있음을 의미합니다.
다시 말해, 컬렉션 타입은 요소 타입과 동일한 하위 타입 관계를 가집니다. 맵은 값(value) 타입에 대해서는 공변적이지만, 키(key) 타입에 대해서는 그렇지 않습니다.

반면, 가변 컬렉션은 공변적이지 않습니다. 만약 공변적이라면 런타임 오류가 발생할 수 있기 때문입니다. 만약 `MutableList<Rectangle>`이 `MutableList<Shape>`의 하위 타입이라면, 여기에 다른 `Shape` 상속 객체(예: `Circle`)를 삽입할 수 있게 되어 `Rectangle` 타입 인자를 위반하게 됩니다.

다음은 Kotlin 컬렉션 인터페이스의 다이어그램입니다.

![Collection interfaces hierarchy](collections-diagram.png){width="500"}

인터페이스와 그 구현체들을 살펴보겠습니다. `Collection`에 대해 알아보려면 아래 섹션을 읽어보세요. `List`, `Set`, `Map`에 대해 알아보려면 해당 섹션을 읽거나 Kotlin Developer Advocate인 Sebastian Aigner의 영상을 시청하세요.

<video src="https://www.youtube.com/v/F8jj7e-_jFA" title="Kotlin Collections Overview"/>

### Collection

[`Collection<T>`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-collection/index.html)은 컬렉션 계층 구조의 루트입니다. 이 인터페이스는 크기 조회, 멤버십 확인 등 읽기 전용 컬렉션의 공통적인 동작을 나타냅니다.
`Collection`은 요소의 반복(iteration)을 위한 연산을 정의하는 `Iterable<T>` 인터페이스를 상속받습니다. 다양한 컬렉션 타입에 적용되는 함수의 파라미터로 `Collection`을 사용할 수 있습니다. 더 구체적인 경우에는 `Collection`의 상속자인 [`List`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-list/index.html)와 [`Set`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-set/index.html)을 사용하세요.

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
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

[`MutableCollection<T>`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-mutable-collection/index.html)은 `add` 및 `remove`와 같은 쓰기 연산이 포함된 `Collection`입니다.

```kotlin
fun List<String>.getShortWordsTo(shortWords: MutableList<String>, maxLength: Int) {
    this.filterTo(shortWords) { it.length <= maxLength }
    // 관사 제외
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
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

### List

[`List<T>`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-list/index.html)는 요소를 지정된 순서대로 저장하며 인덱스를 통한 접근을 제공합니다. 인덱스는 첫 번째 요소의 인덱스인 0부터 시작하여 `(list.size - 1)`인 `lastIndex`까지 이어집니다.

```kotlin
fun main() {
//sampleStart
    val numbers = listOf("one", "two", "three", "four")
    println("Number of elements: ${numbers.size}")
    println("Third element: ${numbers.get(2)}")
    println("Fourth element: ${numbers[3]}")
    println("Index of element \"two\" ${numbers.indexOf("two")}")
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

리스트 요소(null 포함)는 중복될 수 있습니다. 리스트는 동일한 객체를 몇 개든 포함할 수 있으며 단일 객체가 여러 번 나타날 수도 있습니다.
두 리스트는 크기가 같고 동일한 위치에 [구조적으로 동일한(structurally equal)](equality.md#structural-equality) 요소가 있는 경우 동일한 것으로 간주됩니다.

```kotlin
data class Person(var name: String, var age: Int)

fun main() {
//sampleStart
    val bob = Person("Bob", 31)
    val people = listOf(Person("Adam", 20), bob, bob)
    val people2 = listOf(Person("Adam", 20), Person("Bob", 31), bob)
    println(people == people2)
    bob.age = 32
    println(people == people2)
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

[`MutableList<T>`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-mutable-list/index.html)는 특정 위치에 요소를 추가하거나 제거하는 등 리스트 전용 쓰기 연산이 포함된 `List`입니다.

```kotlin
fun main() {
//sampleStart
    val numbers = mutableListOf(1, 2, 3, 4)
    numbers.add(5)
    numbers.removeAt(1)
    numbers[0] = 0
    numbers.shuffle()
    println(numbers)
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

보시는 것처럼 리스트는 여러 측면에서 배열과 매우 유사합니다.
그러나 한 가지 중요한 차이점이 있습니다. 배열의 크기는 초기화 시 정의되며 절대 변경되지 않지만, 리스트는 미리 정의된 크기가 없으며 요소 추가, 업데이트 또는 삭제와 같은 쓰기 연산의 결과로 크기가 변경될 수 있습니다.

Kotlin에서 `MutableList`의 기본 구현체는 크기 조정이 가능한 배열로 생각할 수 있는 [`ArrayList`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-array-list/index.html)입니다.

### Set

[`Set<T>`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-set/index.html)는 고유한 요소를 저장하며, 일반적으로 순서가 정의되지 않습니다. `null` 요소 또한 고유합니다. 즉, `Set`은 단 하나의 `null`만 포함할 수 있습니다.
두 셋은 크기가 같고, 한 셋의 모든 요소에 대해 다른 셋에 그와 동일한 요소가 있는 경우 동일한 것으로 간주됩니다.

```kotlin
fun main() {
//sampleStart
    val numbers = setOf(1, 2, 3, 4)
    println("Number of elements: ${numbers.size}")
    if (numbers.contains(1)) println("1 is in the set")

    val numbersBackwards = setOf(4, 3, 2, 1)
    println("The sets are equal: ${numbers == numbersBackwards}")
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

[`MutableSet`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-mutable-set/index.html)은 `MutableCollection`의 쓰기 연산이 포함된 `Set`입니다.

`MutableSet`의 기본 구현체인 [`LinkedHashSet`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-linked-hash-set/index.html)은 요소가 삽입된 순서를 유지합니다.
따라서 `first()`나 `last()`와 같이 순서에 의존하는 함수들이 이러한 셋에서 예측 가능한 결과를 반환합니다.

```kotlin
fun main() {
//sampleStart
    val numbers = setOf(1, 2, 3, 4)  // LinkedHashSet이 기본 구현체임
    val numbersBackwards = setOf(4, 3, 2, 1)
    
    println(numbers.first() == numbersBackwards.first())
    println(numbers.first() == numbersBackwards.last())
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

또 다른 구현체인 [`HashSet`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-hash-set/index.html)은 요소의 순서에 대해 아무것도 보장하지 않으므로, 이러한 함수를 호출하면 예측할 수 없는 결과가 반환됩니다. 하지만 `HashSet`은 동일한 수의 요소를 저장하는 데 더 적은 메모리를 사용합니다.

### Map

[`Map<K, V>`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-map/index.html)는 `Collection` 인터페이스의 상속자는 아니지만, 이 또한 Kotlin의 컬렉션 타입입니다.
`Map`은 _키-값(key-value)_ 쌍(또는 _엔트리_)을 저장합니다. 키는 고유하지만, 서로 다른 키들이 동일한 값과 쌍을 이룰 수 있습니다. `Map` 인터페이스는 키를 통한 값 접근, 키 및 값 검색 등 특화된 함수를 제공합니다.

```kotlin
fun main() {
//sampleStart
    val numbersMap = mapOf("key1" to 1, "key2" to 2, "key3" to 3, "key4" to 1)
    
    println("All keys: ${numbersMap.keys}")
    println("All values: ${numbersMap.values}")
    if ("key2" in numbersMap) println("Value by key \"key2\": ${numbersMap["key2"]}")    
    if (1 in numbersMap.values) println("The value 1 is in the map")
    if (numbersMap.containsValue(1)) println("The value 1 is in the map") // 이전 코드와 동일
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

동일한 쌍을 포함하는 두 맵은 쌍의 순서와 관계없이 동일합니다.

```kotlin
fun main() {
//sampleStart
    val numbersMap = mapOf("key1" to 1, "key2" to 2, "key3" to 3, "key4" to 1)    
    val anotherMap = mapOf("key2" to 2, "key1" to 1, "key4" to 1, "key3" to 3)
    
    println("The maps are equal: ${numbersMap == anotherMap}")
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

[`MutableMap`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-mutable-map/index.html)은 맵 전용 쓰기 연산이 포함된 `Map`으로, 예를 들어 새로운 키-값 쌍을 추가하거나 주어진 키와 관련된 값을 업데이트할 수 있습니다.

```kotlin
fun main() {
//sampleStart
    val numbersMap = mutableMapOf("one" to 1, "two" to 2)
    numbersMap.put("three", 3)
    numbersMap["one"] = 11

    println(numbersMap)
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

`MutableMap`의 기본 구현체인 [`LinkedHashMap`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-linked-hash-map/index.html)은 맵을 반복할 때 요소가 삽입된 순서를 유지합니다.
반면, 또 다른 구현체인 [`HashMap`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-hash-map/index.html)은 요소의 순서에 대해 아무것도 보장하지 않습니다.

### ArrayDeque

[`ArrayDeque<T>`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-array-deque/)는 양방향 큐(double-ended queue)의 구현체로, 큐의 시작과 끝 모두에서 요소를 추가하거나 제거할 수 있습니다.
따라서 `ArrayDeque`는 Kotlin에서 스택(Stack)과 큐(Queue) 데이터 구조의 역할을 모두 수행할 수 있습니다. 내부적으로 `ArrayDeque`는 필요할 때 자동으로 크기가 조정되는 가변 배열을 사용하여 구현됩니다.

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
{kotlin-runnable="true" kotlin-min-compiler-version="1.4"}