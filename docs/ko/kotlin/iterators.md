[//]: # (title: 반복자)

컬렉션 요소를 순회하기 위해, Kotlin 표준 라이브러리는 흔히 사용되는 메커니즘인 *반복자(Iterators)*를 지원합니다. 반복자는 컬렉션의 내부 구조를 노출하지 않고 요소에 순차적으로 접근할 수 있게 해주는 객체입니다. 반복자는 컬렉션의 모든 요소를 하나씩 처리해야 할 때(예: 값을 출력하거나 요소에 대해 유사한 업데이트를 수행할 때) 유용합니다.

`Set`과 `List`를 포함하여 [`Iterable<T>`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-iterable/index.html) 인터페이스의 구현체는 [`iterator()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-iterable/iterator.html) 함수를 호출하여 반복자를 얻을 수 있습니다.

반복자를 얻으면 컬렉션의 첫 번째 요소를 가리킵니다. [`next()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-iterator/next.html) 함수를 호출하면 현재 요소를 반환하고, 다음 요소가 존재하면 반복자의 위치를 다음 요소로 이동시킵니다.

반복자가 마지막 요소를 통과하면 더 이상 요소를 가져오는 데 사용할 수 없으며, 이전 위치로 재설정할 수도 없습니다. 컬렉션을 다시 순회하려면 새로운 반복자를 생성해야 합니다.

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

`Iterable` 컬렉션을 순회하는 또 다른 방법은 잘 알려진 `for` 루프입니다. 컬렉션에 `for`를 사용하면 암시적으로 반복자를 얻게 됩니다. 따라서 다음 코드는 위의 예제와 동일합니다.

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

마지막으로, 컬렉션을 자동으로 순회하고 각 요소에 대해 지정된 코드를 실행할 수 있게 해주는 유용한 `forEach()` 함수가 있습니다. 따라서 동일한 예제는 다음과 같이 작성할 수 있습니다.

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

## 리스트 반복자 (List iterators)

리스트의 경우 특별한 반복자 구현체인 [`ListIterator`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-list-iterator/index.html)가 있습니다. 이는 정방향과 역방향 모두로 리스트를 순회하는 것을 지원합니다.

역방향 순회는 [`hasPrevious()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-list-iterator/has-previous.html) 및 [`previous()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-list-iterator/previous.html) 함수로 구현됩니다. 또한, `ListIterator`는 [`nextIndex()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-list-iterator/next-index.html) 및 [`previousIndex()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-list-iterator/previous-index.html) 함수를 통해 요소 인덱스에 대한 정보를 제공합니다.

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

양방향 순회가 가능하다는 것은 `ListIterator`가 마지막 요소에 도달한 후에도 여전히 사용될 수 있음을 의미합니다.

## 가변 반복자 (Mutable iterators)

가변 컬렉션을 순회하기 위해, `Iterator`에 요소 삭제 함수인 [`remove()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-mutable-iterator/remove.html)를 확장한 [`MutableIterator`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-mutable-iterator/index.html)가 있습니다. 따라서 컬렉션을 순회하는 동안 요소를 삭제할 수 있습니다.

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

요소를 삭제하는 것 외에도, [`MutableListIterator`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-mutable-list-iterator/index.html)는 리스트를 순회하는 동안 [`add()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-mutable-list-iterator/add.html) 및 [`set()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-mutable-list-iterator/set.html) 함수를 사용하여 요소를 삽입하거나 교체할 수 있습니다.

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