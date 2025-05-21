---
title: 반복자
---
컬렉션 엘리먼트를 탐색할 때 Kotlin 표준 라이브러리는 일반적으로 사용되는 메커니즘인 _iterator_를 지원합니다.
이는 컬렉션의 기본 구조를 노출하지 않고 순차적으로 엘리먼트에 접근할 수 있도록 하는 객체입니다.
Iterator는 값을 출력하거나 유사한 업데이트를 수행하는 등 컬렉션의 모든 엘리먼트를 하나씩 처리해야 할 때 유용합니다.

Iterator는 [`Iterable<T>`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-iterable/index.html) 인터페이스의 상속자(`Set` 및 `List` 포함)에 대해
[`iterator()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-iterable/iterator.html) 함수를 호출하여 얻을 수 있습니다.

Iterator를 얻으면 컬렉션의 첫 번째 엘리먼트를 가리킵니다. [`next()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-iterator/next.html) 함수를 호출하면
이 엘리먼트를 반환하고 iterator 위치를 다음 엘리먼트(있는 경우)로 이동합니다.

Iterator가 마지막 엘리먼트를 통과하면 더 이상 엘리먼트를 검색하는 데 사용할 수 없으며 이전 위치로 재설정할 수도 없습니다.
컬렉션을 다시 반복하려면 새 iterator를 생성하세요.

```kotlin

fun main() {

    val numbers = listOf("one", "two", "three", "four")
    val numbersIterator = numbers.iterator()
    while (numbersIterator.hasNext()) {
        println(numbersIterator.next())
        // one
        // two
        // three
        // four
    }

}
```

`Iterable` 컬렉션을 탐색하는 또 다른 방법은 잘 알려진 `for` 루프입니다. 컬렉션에서 `for`를 사용하면
iterator를 암시적으로 얻게 됩니다. 따라서 다음 코드는 위의 예제와 동일합니다.

```kotlin

fun main() {

    val numbers = listOf("one", "two", "three", "four")
    for (item in numbers) {
        println(item)
        // one
        // two
        // three
        // four
    }

}
```

마지막으로 컬렉션을 자동으로 반복하고 각 엘리먼트에 대해 지정된 코드를 실행할 수 있는 유용한 `forEach()` 함수가 있습니다.
따라서 동일한 예제는 다음과 같습니다.

```kotlin

fun main() {

    val numbers = listOf("one", "two", "three", "four")
    numbers.forEach {
        println(it)
        // one
        // two
        // three
        // four
    }

}
```

## List iterator

리스트의 경우 특수한 iterator 구현인 [`ListIterator`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-list-iterator/index.html)가 있습니다.
이는 리스트를 앞뒤 양방향으로 반복하는 것을 지원합니다.

역방향 반복은 [`hasPrevious()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-list-iterator/has-previous.html) 및
[`previous()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-list-iterator/previous.html) 함수로 구현됩니다.
또한 `ListIterator`는 [`nextIndex()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-list-iterator/next-index.html) 및
[`previousIndex()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-list-iterator/previous-index.html) 함수를 사용하여 엘리먼트 인덱스에 대한 정보를 제공합니다.

```kotlin

fun main() {

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

}
```

양방향으로 반복할 수 있다는 것은 `ListIterator`가 마지막 엘리먼트에 도달한 후에도 계속 사용할 수 있음을 의미합니다.

## Mutable iterator

변경 가능한 컬렉션을 반복하기 위해 엘리먼트 제거 함수 [`remove()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-mutable-iterator/remove.html)를 사용하여 `Iterator`를 확장하는
[`MutableIterator`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-mutable-iterator/index.html)가 있습니다.
따라서 컬렉션을 반복하는 동안 엘리먼트를 제거할 수 있습니다.

```kotlin

fun main() {

    val numbers = mutableListOf("one", "two", "three", "four") 
    val mutableIterator = numbers.iterator()
    
    mutableIterator.next()
    mutableIterator.remove()    
    println("After removal: $numbers")
    // After removal: [two, three, four]

}
```

엘리먼트를 제거하는 것 외에도 [`MutableListIterator`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-mutable-list-iterator/index.html)는
[`add()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-mutable-list-iterator/add.html) 및
[`set()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-mutable-list-iterator/set.html) 함수를 사용하여 리스트를 반복하는 동안 엘리먼트를 삽입하고 바꿀 수도 있습니다.

```kotlin

fun main() {

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

}
```