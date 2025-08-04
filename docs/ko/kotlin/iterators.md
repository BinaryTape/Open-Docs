[//]: # (title: 반복자)

컬렉션 요소를 순회하기 위해 Kotlin 표준 라이브러리는 일반적으로 사용되는 _반복자_(iterator) 메커니즘을 지원합니다. 반복자는 컬렉션의 기본 구조를 노출하지 않고 요소에 순차적으로 접근할 수 있도록 하는 객체입니다. 반복자는 예를 들어 값을 출력하거나 유사한 업데이트를 수행하는 등 컬렉션의 모든 요소를 하나씩 처리해야 할 때 유용합니다.

반복자는 `Set`과 `List`를 포함하여 [`Iterable<T>`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-iterable/index.html) 인터페이스를 상속받는 객체에 대해 [`iterator()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-iterable/iterator.html) 함수를 호출하여 얻을 수 있습니다.

반복자를 얻으면 컬렉션의 첫 번째 요소를 가리킵니다. [`next()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-iterator/next.html) 함수를 호출하면 해당 요소를 반환하고, 다음 요소가 존재하면 반복자 위치를 다음 요소로 이동합니다.

반복자가 마지막 요소를 통과하면 더 이상 요소를 가져오는 데 사용할 수 없으며, 이전 위치로 재설정할 수도 없습니다. 컬렉션을 다시 반복하려면 새 반복자를 생성해야 합니다.

```kotlin

fun main() {
//sampleStart
    val numbers = listOf("one", "two", "three", "four")
    val numbersIterator = numbers.iterator()
    while (numbersIterator.hasNext()) {
        println(numbersIterator.next())
        // one
        // two
        // three
        // four
    }
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

`Iterable` 컬렉션을 순회하는 또 다른 방법은 잘 알려진 `for` 루프입니다. 컬렉션에 `for`를 사용할 때 반복자를 암시적으로 얻습니다. 따라서 다음 코드는 위의 예시와 동일합니다.

```kotlin

fun main() {
//sampleStart
    val numbers = listOf("one", "two", "three", "four")
    for (item in numbers) {
        println(item)
        // one
        // two
        // three
        // four
    }
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

마지막으로, 컬렉션을 자동으로 반복하고 각 요소에 대해 주어진 코드를 실행할 수 있도록 하는 유용한 `forEach()` 함수가 있습니다. 따라서 동일한 예시는 다음과 같습니다.

```kotlin

fun main() {
//sampleStart
    val numbers = listOf("one", "two", "three", "four")
    numbers.forEach {
        println(it)
        // one
        // two
        // three
        // four
    }
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

## 리스트 반복자

리스트의 경우 특별한 반복자 구현체인 [`ListIterator`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-list-iterator/index.html)가 있습니다. 이는 리스트를 양방향(앞으로, 뒤로)으로 반복하는 것을 지원합니다.

역방향 반복은 [`hasPrevious()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-list-iterator/has-previous.html) 및 [`previous()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-list-iterator/previous.html) 함수에 의해 구현됩니다. 또한 `ListIterator`는 [`nextIndex()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-list-iterator/next-index.html) 및 [`previousIndex()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-list-iterator/previous-index.html) 함수를 통해 요소 인덱스에 대한 정보를 제공합니다.

```kotlin

fun main() {
//sampleStart
    val numbers = listOf("one", "two", "three", "four")
    val listIterator = numbers.listIterator()
    while (listIterator.hasNext()) listIterator.next()
    println("Iterating backwards:")
    // Iterating backwards:
    while (listIterator.hasPrevious()) {
        print("Index: ${listIterator.previousIndex()}")
        println(", value: ${listIterator.previous()}")
        // Index: 3, value: four
        // Index: 2, value: three
        // Index: 1, value: two
        // Index: 0, value: one
    }
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

양방향으로 반복할 수 있는 기능을 통해 `ListIterator`는 마지막 요소에 도달한 후에도 여전히 사용될 수 있습니다.

## 변경 가능한 반복자

변경 가능한 컬렉션을 반복하기 위해 `Iterator`를 확장하여 요소 제거 함수 [`remove()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-mutable-iterator/remove.html)를 제공하는 [`MutableIterator`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-mutable-iterator/index.html)가 있습니다. 따라서 컬렉션을 반복하는 동안 요소를 제거할 수 있습니다.

```kotlin

fun main() {
//sampleStart
    val numbers = mutableListOf("one", "two", "three", "four") 
    val mutableIterator = numbers.iterator()
    
    mutableIterator.next()
    mutableIterator.remove()    
    println("After removal: $numbers")
    // After removal: [two, three, four]
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

요소를 제거하는 것 외에도 [`MutableListIterator`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-mutable-list-iterator/index.html)는 [`add()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-mutable-list-iterator/add.html) 및 [`set()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-mutable-list-iterator/set.html) 함수를 사용하여 리스트를 반복하는 동안 요소를 삽입하고 교체할 수도 있습니다.

```kotlin

fun main() {
//sampleStart
    val numbers = mutableListOf("one", "four", "four") 
    val mutableListIterator = numbers.listIterator()
    
    mutableListIterator.next()
    mutableListIterator.add("two")
    println(numbers)
    // [one, two, four, four]
    mutableListIterator.next()
    mutableListIterator.set("three")   
    println(numbers)
    // [one, two, three, four]
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}