[//]: # (title: 컬렉션 생성하기)

## 요소로부터 컬렉션 생성

컬렉션을 생성하는 가장 일반적인 방법은 표준 라이브러리 함수인 [`listOf<T>()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/list-of.html),
[`setOf<T>()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/set-of.html),
[`mutableListOf<T>()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/mutable-list-of.html),
[`mutableSetOf<T>()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/mutable-set-of.html)를 사용하는 것입니다.
쉼표로 구분된 컬렉션 요소 목록을 인자로 제공하면 컴파일러가 요소 타입을
자동으로 감지합니다. 빈 컬렉션을 생성할 때는 타입을 명시적으로 지정해야 합니다.

```kotlin
val numbersSet = setOf("one", "two", "three", "four")
val emptySet = mutableSetOf<String>()
```

맵(Map)에서도 [`mapOf()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/map-of.html)
및 [`mutableMapOf()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/mutable-map-of.html) 함수를 사용하여 동일하게 사용할 수 있습니다. 맵의
키와 값은 `Pair` 객체로 전달됩니다(일반적으로 `to` 중위 함수로 생성).

```kotlin
val numbersMap = mapOf("key1" to 1, "key2" to 2, "key3" to 3, "key4" to 1)
```

`to` 표기법은 수명이 짧은 `Pair` 객체를 생성하므로, 성능이 중요하지 않은 경우에만 사용하는 것이 좋습니다.
과도한 메모리 사용을 피하려면 다른 방법을 사용하세요. 예를 들어, 가변 맵을 생성하고
쓰기 작업을 사용하여 채울 수 있습니다. [`apply()`](scope-functions.md#apply) 함수는 이 경우 초기화를 유연하게 유지하는 데 도움이 될 수 있습니다.

```kotlin
val numbersMap = mutableMapOf<String, String>().apply { this["one"] = "1"; this["two"] = "2" }
```

## 컬렉션 빌더 함수로 생성하기

컬렉션을 생성하는 또 다른 방법은 빌더 함수인
[`buildList()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/build-list.html), [`buildSet()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/build-set.html),
또는 [`buildMap()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/build-map.html)을 호출하는 것입니다. 이 함수들은 해당 타입의
새로운 가변 컬렉션을 생성하고, [쓰기 작업](collection-write.md)을 사용하여 데이터를 채운 다음,
동일한 요소를 가진 읽기 전용 컬렉션을 반환합니다.

```kotlin
val map = buildMap { // this is MutableMap<String, Int>, types of key and value are inferred from the `put()` calls below
    put("a", 1)
    put("b", 0)
    put("c", 4)
}

println(map) // {a=1, b=0, c=4}
```

## 빈 컬렉션

요소가 없는 컬렉션을 생성하기 위한 함수도 있습니다: [`emptyList()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/empty-list.html),
[`emptySet()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/empty-set.html), 그리고
[`emptyMap()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/empty-map.html).
빈 컬렉션을 생성할 때는 컬렉션이 담을 요소의 타입을 명시해야 합니다.

```kotlin
val empty = emptyList<String>()
```

## 리스트를 위한 초기화 함수

리스트의 경우, 리스트 크기와 인덱스를 기반으로 요소 값을 정의하는 초기화 함수를 인자로 받는 생성자와 유사한 함수가 있습니다.

```kotlin
fun main() {
//sampleStart
    val doubled = List(3, { it * 2 })  // or MutableList if you want to change its content later
    println(doubled)
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

## 구체적인 타입 생성자

`ArrayList` 또는 `LinkedList`와 같은 구체적인 타입의 컬렉션을 생성하려면, 해당 타입에 사용 가능한 생성자를 사용할 수 있습니다.
유사한 생성자는 `Set` 및 `Map`의 구현체에도 제공됩니다.

```kotlin
val linkedList = LinkedList<String>(listOf("one", "two", "three"))
val presizedSet = HashSet<Int>(32)
```

## 복사

기존 컬렉션과 동일한 요소를 가진 컬렉션을 생성하려면 복사 함수를 사용할 수 있습니다. 표준 라이브러리의 컬렉션 복사 함수는 동일한 요소를 참조하는 _얕은 복사_ 컬렉션을 생성합니다.
따라서 컬렉션 요소에 대한 변경 사항은 모든 복사본에 반영됩니다.

[`toList()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/to-list.html),
[`toMutableList()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/to-mutable-list.html),
[`toSet()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/to-set.html) 등과 같은 컬렉션 복사 함수들은 특정 시점의 컬렉션 스냅샷을 생성합니다.
그 결과는 동일한 요소들로 구성된 새로운 컬렉션입니다.
원본 컬렉션에서 요소를 추가하거나 제거해도 복사본에는 영향을 주지 않습니다. 복사본도 원본과 독립적으로 변경될 수 있습니다.

```kotlin
class Person(var name: String)
fun main() {
//sampleStart
    val alice = Person("Alice")
    val sourceList = mutableListOf(alice, Person("Bob"))
    val copyList = sourceList.toList()
    sourceList.add(Person("Charles"))
    alice.name = "Alicia"
    println("First item's name is: ${sourceList[0].name} in source and ${copyList[0].name} in copy")
    println("List size is: ${sourceList.size} in source and ${copyList.size} in copy")
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

이 함수들은 컬렉션을 다른 타입으로 변환하는 데도 사용될 수 있습니다. 예를 들어, 리스트에서 세트(Set)를 만들거나 그 반대로도 사용될 수 있습니다.

```kotlin
fun main() {
//sampleStart
    val sourceList = mutableListOf(1, 2, 3)    
    val copySet = sourceList.toMutableSet()
    copySet.add(3)
    copySet.add(4)    
    println(copySet)
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

또 다른 방법으로는 동일한 컬렉션 인스턴스에 대한 새로운 참조를 생성할 수 있습니다. 기존 컬렉션으로 컬렉션 변수를 초기화할 때 새로운 참조가 생성됩니다.
따라서 컬렉션 인스턴스가 참조를 통해 변경되면, 변경 사항은 모든 참조에 반영됩니다.

```kotlin
fun main() {
//sampleStart
    val sourceList = mutableListOf(1, 2, 3)
    val referenceList = sourceList
    referenceList.add(4)
    println("Source size: ${sourceList.size}")
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

컬렉션 초기화는 가변성을 제한하는 데 사용될 수 있습니다. 예를 들어, `MutableList`에 대한 `List` 참조를 생성하면, 이 참조를 통해 컬렉션을 수정하려고 시도할 경우 컴파일러가 오류를 발생시킵니다.

```kotlin
fun main() {
//sampleStart 
    val sourceList = mutableListOf(1, 2, 3)
    val referenceList: List<Int> = sourceList
    //referenceList.add(4)            //compilation error
    sourceList.add(4)
    println(referenceList) // shows the current state of sourceList
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

## 다른 컬렉션에 함수 호출

컬렉션은 다른 컬렉션에 대한 다양한 연산의 결과로 생성될 수 있습니다. 예를 들어, 리스트를 [필터링](collection-filtering.md)하면 필터에 일치하는 요소들로 구성된 새 리스트가 생성됩니다.

```kotlin
fun main() {
//sampleStart 
    val numbers = listOf("one", "two", "three", "four")  
    val longerThan3 = numbers.filter { it.length > 3 }
    println(longerThan3)
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

[매핑](collection-transformations.md#map)은 변환 결과로부터 리스트를 생성합니다.

```kotlin
fun main() {
//sampleStart 
    val numbers = setOf(1, 2, 3)
    println(numbers.map { it * 3 })
    println(numbers.mapIndexed { idx, value -> value * idx })
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

[연관(Association)](collection-transformations.md#associate)은 맵을 생성합니다.

```kotlin
fun main() {
//sampleStart
    val numbers = listOf("one", "two", "three", "four")
    println(numbers.associateWith { it.length })
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

코틀린의 컬렉션 연산에 대한 더 자세한 정보는 [컬렉션 연산 개요](collection-operations.md)를 참조하세요.