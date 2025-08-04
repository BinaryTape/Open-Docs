[//]: # (title: 컬렉션 개요)

Kotlin 표준 라이브러리는 _컬렉션_(해결하려는 문제에 중요하며 일반적으로 조작되는, 개수가 가변적인 항목(0개일 수도 있음)의 그룹)을 관리하기 위한 포괄적인 도구 세트를 제공합니다.

컬렉션은 대부분의 프로그래밍 언어에서 일반적인 개념이므로, 예를 들어 Java 또는 Python 컬렉션에 익숙하다면 이 소개 부분을 건너뛰고 자세한 섹션으로 넘어갈 수 있습니다.

컬렉션은 일반적으로 동일한 타입(및 해당 서브타입)의 여러 객체를 포함합니다. 컬렉션의 객체는 _엘리먼트_ 또는 _항목_이라고 불립니다. 예를 들어, 학과에 있는 모든 학생은 학생들의 평균 연령을 계산하는 데 사용될 수 있는 컬렉션을 이룹니다.

다음 컬렉션 타입은 Kotlin과 관련이 있습니다:

* _List_는 순서가 지정된 컬렉션으로, 엘리먼트의 위치를 반영하는 정수(인덱스)로 엘리먼트에 접근할 수 있습니다. 엘리먼트는 List에서 여러 번 나타날 수 있습니다. List의 예로는 전화번호가 있습니다. 전화번호는 숫자 그룹이며, 순서가 중요하고 반복될 수 있습니다.
* _Set_은 고유한 엘리먼트들의 컬렉션입니다. Set은 반복이 없는 객체들의 그룹인 집합의 수학적 추상화를 반영합니다. 일반적으로 Set 엘리먼트의 순서는 중요하지 않습니다. 예를 들어, 복권 번호는 Set을 이룹니다. 번호들은 고유하며 순서가 중요하지 않습니다.
* _Map_ (또는 _dictionary_)은 키-값 쌍의 집합입니다. 키는 고유하며, 각 키는 정확히 하나의 값에 매핑됩니다. 값은 중복될 수 있습니다. Map은 예를 들어 직원의 ID와 직책처럼 객체 간의 논리적 연결을 저장하는 데 유용합니다.

Kotlin을 사용하면 컬렉션에 저장된 객체의 정확한 타입과 관계없이 컬렉션을 조작할 수 있습니다. 즉, `String` List에 `String`을 추가하는 방식과 `Int` 또는 사용자 정의 클래스를 추가하는 방식이 동일합니다.
따라서 Kotlin 표준 라이브러리는 모든 타입의 컬렉션을 생성하고, 채우고, 관리하기 위한 제네릭 인터페이스, 클래스 및 함수를 제공합니다.

컬렉션 인터페이스 및 관련 함수는 `kotlin.collections` 패키지에 있습니다. 이제 그 내용을 살펴보겠습니다.

> 배열은 컬렉션 타입이 아닙니다. 자세한 내용은 [배열](arrays.md)을 참조하세요.
>
{style="note"}

## 컬렉션 타입

Kotlin 표준 라이브러리는 Set, List, Map과 같은 기본 컬렉션 타입에 대한 구현을 제공합니다.
각 컬렉션 타입은 한 쌍의 인터페이스로 표현됩니다.

* 컬렉션 엘리먼트에 접근하기 위한 연산을 제공하는 _읽기 전용_ 인터페이스.
* 해당 읽기 전용 인터페이스를 쓰기 연산(엘리먼트 추가, 제거 및 업데이트)으로 확장한 _가변_ 인터페이스.

가변 컬렉션이 [`var`](basic-syntax.md#variables)로 할당될 필요는 없다는 점에 유의하세요. 가변 컬렉션이 `val`로 할당되어도 쓰기 연산은 여전히 가능합니다. 가변 컬렉션을 `val`에 할당하는 이점은 가변 컬렉션에 대한 참조가 수정되는 것을 방지한다는 것입니다. 시간이 지남에 따라 코드가 커지고 복잡해질수록 참조에 대한 의도치 않은 수정을 방지하는 것이 더욱 중요해집니다. 더 안전하고 견고한 코드를 위해 가능한 한 `val`을 사용하세요. `val` 컬렉션을 재할당하려고 하면 컴파일 오류가 발생합니다:

```kotlin
fun main() {
//sampleStart
    val numbers = mutableListOf("one", "two", "three", "four")
    numbers.add("five")   // this is OK
    println(numbers)
    //numbers = mutableListOf("six", "seven")      // compilation error
//sampleEnd

}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

읽기 전용 컬렉션 타입은 [공변적](generics.md#variance)입니다.
이는 `Rectangle` 클래스가 `Shape`를 상속받는다면, `List<Shape>`가 필요한 곳이면 어디든 `List<Rectangle>`을 사용할 수 있음을 의미합니다.
즉, 컬렉션 타입은 엘리먼트 타입과 동일한 하위 타입 관계를 가집니다. Map은 값 타입에 대해서는 공변적이지만, 키 타입에 대해서는 그렇지 않습니다.

반면에 가변 컬렉션은 공변적이지 않습니다. 그렇지 않으면 런타임 오류가 발생할 수 있습니다. 만약 `MutableList<Rectangle>`이 `MutableList<Shape>`의 하위 타입이었다면, 다른 `Shape` 상속자(예: `Circle`)를 삽입할 수 있게 되어 `Rectangle` 타입 인수를 위반하게 됩니다.

아래는 Kotlin 컬렉션 인터페이스의 다이어그램입니다:

![Collection interfaces hierarchy](collections-diagram.png){width="500"}

이제 인터페이스와 그 구현에 대해 살펴보겠습니다. `Collection`에 대해 알아보려면 아래 섹션을 읽어보세요. `List`, `Set`, `Map`에 대해 알아보려면 해당 섹션을 읽거나 Kotlin Developer Advocate인 Sebastian Aigner의 비디오를 시청할 수 있습니다:

<video src="https://www.youtube.com/v/F8jj7e-_jFA" title="Kotlin Collections Overview"/>

### Collection

[`Collection<T>`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-collection/index.html)은 컬렉션 계층 구조의 최상위입니다. 이 인터페이스는 크기 검색, 항목 멤버십 확인 등 읽기 전용 컬렉션의 공통 동작을 나타냅니다.
`Collection`은 엘리먼트 반복을 위한 연산을 정의하는 `Iterable<T>` 인터페이스를 상속합니다. `Collection`을 서로 다른 컬렉션 타입에 적용되는 함수의 매개변수로 사용할 수 있습니다. 더 구체적인 경우에는 `Collection`의 상속자인 [`List`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-list/index.html)와 [`Set`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-set/index.html)을 사용하세요.

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

[`MutableCollection<T>`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-mutable-collection/index.html)은 `add` 및 `remove`와 같은 쓰기 연산이 있는 `Collection`입니다.

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
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

### List

[`List<T>`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-list/index.html)는 엘리먼트를 지정된 순서로 저장하고 인덱스 접근을 제공합니다. 인덱스는 첫 번째 엘리먼트의 인덱스인 0부터 시작하여 `(list.size - 1)`인 `lastIndex`까지 이어집니다.

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

List 엘리먼트(null 포함)는 중복될 수 있습니다. List는 동일한 객체 또는 단일 객체의 발생을 여러 개 포함할 수 있습니다. 두 List는 크기가 같고 동일한 위치에 [구조적으로 동일한](equality.md#structural-equality) 엘리먼트를 가지고 있으면 동일하다고 간주됩니다.

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

[`MutableList<T>`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-mutable-list/index.html)는 특정 위치에 엘리먼트를 추가하거나 제거하는 것과 같은 List에 특화된 쓰기 연산을 가진 `List`입니다.

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

보시다시피, 어떤 면에서 List는 배열과 매우 유사합니다.
하지만 한 가지 중요한 차이점이 있습니다. 배열의 크기는 초기화 시 정의되며 변경되지 않습니다. 반면에 List는 미리 정의된 크기를 가지지 않으며, 엘리먼트 추가, 업데이트 또는 제거와 같은 쓰기 연산의 결과로 List의 크기가 변경될 수 있습니다.

Kotlin에서 `MutableList`의 기본 구현은 크기 조정 가능한 배열로 생각할 수 있는 [`ArrayList`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-array-list/index.html)입니다.

### Set

[`Set<T>`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-set/index.html)은 고유한 엘리먼트를 저장합니다. 순서는 일반적으로 정의되지 않습니다. `null` 엘리먼트도 고유합니다. Set은 하나의 `null`만 포함할 수 있습니다. 두 Set은 크기가 같고 한 Set의 각 엘리먼트에 대해 다른 Set에 동일한 엘리먼트가 있으면 동일하다고 간주됩니다.

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

[`MutableSet`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-mutable-set/index.html)은 `MutableCollection`의 쓰기 연산이 있는 `Set`입니다.

`MutableSet`의 기본 구현인 [`LinkedHashSet`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-linked-hash-set/index.html)은 엘리먼트 삽입 순서를 유지합니다.
따라서 `first()` 또는 `last()`와 같이 순서에 의존하는 함수는 이러한 Set에서 예측 가능한 결과를 반환합니다.

```kotlin
fun main() {
//sampleStart
    val numbers = setOf(1, 2, 3, 4)  // LinkedHashSet is the default implementation
    val numbersBackwards = setOf(4, 3, 2, 1)
    
    println(numbers.first() == numbersBackwards.first())
    println(numbers.first() == numbersBackwards.last())
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

대체 구현인 [`HashSet`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-hash-set/index.html)은 엘리먼트 순서에 대해 아무것도 보장하지 않으므로 이러한 함수를 호출하면 예측할 수 없는 결과를 반환합니다. 하지만 `HashSet`은 동일한 수의 엘리먼트를 저장하는 데 더 적은 메모리가 필요합니다.

### Map

[`Map<K, V>`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-map/index.html)은 `Collection` 인터페이스의 상속자는 아니지만, Kotlin 컬렉션 타입입니다. Map은 _키-값_ 쌍(또는 _엔트리_)을 저장합니다. 키는 고유하지만, 다른 키가 동일한 값과 쌍을 이룰 수 있습니다. `Map` 인터페이스는 키로 값에 접근, 키와 값 검색 등과 같은 특정 함수를 제공합니다.

```kotlin
fun main() {
//sampleStart
    val numbersMap = mapOf("key1" to 1, "key2" to 2, "key3" to 3, "key4" to 1)
    
    println("All keys: ${numbersMap.keys}")
    println("All values: ${numbersMap.values}")
    if ("key2" in numbersMap) println("Value by key \"key2\": ${numbersMap["key2"]}")    
    if (1 in numbersMap.values) println("The value 1 is in the map")
    if (numbersMap.containsValue(1)) println("The value 1 is in the map") // same as previous
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

동일한 쌍을 포함하는 두 Map은 쌍의 순서에 관계없이 동일합니다.

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

[`MutableMap`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-mutable-map/index.html)은 Map 쓰기 연산이 있는 `Map`입니다. 예를 들어, 새 키-값 쌍을 추가하거나 주어진 키와 연결된 값을 업데이트할 수 있습니다.

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

`MutableMap`의 기본 구현인 [`LinkedHashMap`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-linked-hash-map/index.html)은 Map을 반복할 때 엘리먼트 삽입 순서를 유지합니다.
반면에 대체 구현인 [`HashMap`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-hash-map/index.html)은 엘리먼트 순서에 대해 아무것도 보장하지 않습니다.

### ArrayDeque

[`ArrayDeque<T>`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-array-deque/)는 이중 연결 큐(double-ended queue)의 구현체로, 큐의 시작 또는 끝 부분에서 엘리먼트를 추가하거나 제거할 수 있습니다.
따라서 `ArrayDeque`는 Kotlin에서 스택(Stack) 및 큐(Queue) 데이터 구조의 역할도 수행합니다. 내부적으로 `ArrayDeque`는 필요할 때 자동으로 크기가 조절되는 가변 크기 배열을 사용하여 구현됩니다:

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