---
title: "List 관련 동작"
---
[`List`](collections-overview#list)는 코틀린에서 가장 많이 사용되는 내장 컬렉션 유형입니다. 리스트의 요소에 대한 인덱스 접근은 리스트에 대한 강력한 연산 집합을 제공합니다.

## 인덱스로 요소 검색

리스트는 요소 검색을 위한 모든 일반적인 연산(`elementAt()`, `first()`, `last()` 및 [단일 요소 검색](collection-elements)에 나열된 기타 연산)을 지원합니다. 리스트에 특정한 것은 요소에 대한 인덱스 접근이므로 요소를 읽는 가장 간단한 방법은 인덱스로 검색하는 것입니다. 이는 인덱스가 인수로 전달된 [`get()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-list/get.html) 함수 또는 약식 `[index]` 구문을 사용하여 수행됩니다.

리스트 크기가 지정된 인덱스보다 작으면 예외가 발생합니다. 이러한 예외를 방지하는 데 도움이 되는 다른 두 가지 함수가 있습니다.

* [`getOrElse()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/get-or-else.html)를 사용하면 인덱스가 컬렉션에 없는 경우 반환할 기본값을 계산하는 함수를 제공할 수 있습니다.
* [`getOrNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/get-or-null.html)은 기본값으로 `null`을 반환합니다.

```kotlin

fun main() {

    val numbers = listOf(1, 2, 3, 4)
    println(numbers.get(0))
    println(numbers[0])
    //numbers.get(5)                         // exception!
    println(numbers.getOrNull(5))             // null
    println(numbers.getOrElse(5, {it}))        // 5

}
```

## 리스트 부분 검색

[컬렉션 부분 검색](collection-parts)에 대한 일반적인 연산 외에도 리스트는 지정된 요소 범위를 리스트로 보여주는 [`subList()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-list/sub-list.html) 함수를 제공합니다. 따라서 원래 컬렉션의 요소가 변경되면 이전에 생성된 하위 리스트에서도 변경되고 그 반대의 경우도 마찬가지입니다.

```kotlin

fun main() {

    val numbers = (0..13).toList()
    println(numbers.subList(3, 6))

}
```

## 요소 위치 찾기

### 선형 검색

모든 리스트에서 [`indexOf()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/index-of.html) 및 [`lastIndexOf()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/last-index-of.html) 함수를 사용하여 요소의 위치를 찾을 수 있습니다. 이 함수들은 리스트에서 주어진 인수와 같은 요소의 처음과 마지막 위치를 반환합니다. 이러한 요소가 없으면 두 함수 모두 `-1`을 반환합니다.

```kotlin

fun main() {

    val numbers = listOf(1, 2, 3, 4, 2, 5)
    println(numbers.indexOf(2))
    println(numbers.lastIndexOf(2))

}
```

조건자를 사용하고 일치하는 요소를 검색하는 한 쌍의 함수도 있습니다.

* [`indexOfFirst()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/index-of-first.html)는 조건자와 일치하는 *첫 번째 요소의 인덱스*를 반환하거나 이러한 요소가 없으면 `-1`을 반환합니다.
* [`indexOfLast()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/index-of-last.html)는 조건자와 일치하는 *마지막 요소의 인덱스*를 반환하거나 이러한 요소가 없으면 `-1`을 반환합니다.

```kotlin

fun main() {

    val numbers = mutableListOf(1, 2, 3, 4)
    println(numbers.indexOfFirst { it > 2})
    println(numbers.indexOfLast { it % 2 == 1})

}
```

### 정렬된 리스트에서 이진 검색

리스트에서 요소를 검색하는 또 다른 방법은 [이진 검색](https://en.wikipedia.org/wiki/Binary_search_algorithm)입니다. 이 방법은 다른 내장 검색 함수보다 훨씬 빠르지만 *리스트가 특정 순서(자연 순서 또는 함수 매개변수에 제공된 다른 순서)에 따라 오름차순으로 [정렬](collection-ordering)되어야 합니다*. 그렇지 않으면 결과가 정의되지 않습니다.

정렬된 리스트에서 요소를 검색하려면 값을 인수로 전달하는 [`binarySearch()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/binary-search.html) 함수를 호출합니다. 이러한 요소가 있으면 함수는 해당 인덱스를 반환합니다. 그렇지 않으면 `(-insertionPoint - 1)`을 반환합니다. 여기서 `insertionPoint`는 리스트가 정렬된 상태를 유지하도록 이 요소를 삽입해야 하는 인덱스입니다. 주어진 값을 가진 요소가 둘 이상 있으면 검색은 해당 인덱스 중 하나를 반환할 수 있습니다.

검색할 인덱스 범위를 지정할 수도 있습니다. 이 경우 함수는 제공된 두 인덱스 사이에서만 검색합니다.

```kotlin

fun main() {

    val numbers = mutableListOf("one", "two", "three", "four")
    numbers.sort()
    println(numbers)
    println(numbers.binarySearch("two"))  // 3
    println(numbers.binarySearch("z")) // -5
    println(numbers.binarySearch("two", 0, 2))  // -3

}
```

#### Comparator 이진 검색

리스트 요소가 `Comparable`이 아닌 경우 이진 검색에 사용할 [`Comparator`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-comparator.html)를 제공해야 합니다. 리스트는 이 `Comparator`에 따라 오름차순으로 정렬되어야 합니다. 예를 살펴보겠습니다.

```kotlin

data class Product(val name: String, val price: Double)

fun main() {

    val productList = listOf(
        Product("WebStorm", 49.0),
        Product("AppCode", 99.0),
        Product("DotTrace", 129.0),
        Product("ReSharper", 149.0))

    println(productList.binarySearch(Product("AppCode", 99.0), compareBy<Product> { it.price }.thenBy { it.name }))

}
```

여기에는 `Comparable`이 아닌 `Product` 인스턴스 리스트와 순서를 정의하는 `Comparator`가 있습니다. 제품 `p1`의 가격이 `p2`의 가격보다 저렴하면 `p1`이 `p2`보다 먼저 옵니다. 따라서 이 순서에 따라 오름차순으로 정렬된 리스트가 있으면 `binarySearch()`를 사용하여 지정된 `Product`의 인덱스를 찾습니다.

사용자 지정 비교기는 리스트가 자연 순서와 다른 순서(예: `String` 요소에 대한 대소문자를 구분하지 않는 순서)를 사용하는 경우에도 유용합니다.

```kotlin

fun main() {

    val colors = listOf("Blue", "green", "ORANGE", "Red", "yellow")
    println(colors.binarySearch("RED", String.CASE_INSENSITIVE_ORDER)) // 3

}
```

#### 비교 이진 검색

_비교_ 함수를 사용한 이진 검색을 사용하면 명시적 검색 값을 제공하지 않고 요소를 찾을 수 있습니다. 대신 요소를 `Int` 값에 매핑하고 함수가 0을 반환하는 요소를 검색하는 비교 함수를 사용합니다. 리스트는 제공된 함수에 따라 오름차순으로 정렬되어야 합니다. 즉, 비교의 반환 값은 한 리스트 요소에서 다음 리스트 요소로 증가해야 합니다.

```kotlin

import kotlin.math.sign

data class Product(val name: String, val price: Double)

fun priceComparison(product: Product, price: Double) = sign(product.price - price).toInt()

fun main() {
    val productList = listOf(
        Product("WebStorm", 49.0),
        Product("AppCode", 99.0),
        Product("DotTrace", 129.0),
        Product("ReSharper", 149.0))

    println(productList.binarySearch { priceComparison(it, 99.0) })
}

```

Comparator 및 비교 이진 검색은 리스트 범위에 대해서도 수행할 수 있습니다.

## 리스트 쓰기 연산

[컬렉션 쓰기 연산](collection-write)에 설명된 컬렉션 수정 연산 외에도 [mutable](collections-overview#collection-types) 리스트는 특정 쓰기 연산을 지원합니다. 이러한 연산은 인덱스를 사용하여 요소에 액세스하여 리스트 수정 기능을 확장합니다.

### 추가

리스트의 특정 위치에 요소를 추가하려면 요소 삽입 위치를 추가 인수로 제공하는 [`add()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-mutable-list/add.html) 및 [`addAll()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/add-all.html)을 사용합니다. 위치 뒤에 오는 모든 요소는 오른쪽으로 이동합니다.

```kotlin

fun main() {

    val numbers = mutableListOf("one", "five", "six")
    numbers.add(1, "two")
    numbers.addAll(2, listOf("three", "four"))
    println(numbers)

}
```

### 업데이트

리스트는 또한 주어진 위치에서 요소를 바꾸는 함수인 [`set()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-mutable-list/set.html)와 해당 연산자 형태 `[]`를 제공합니다. `set()`은 다른 요소의 인덱스를 변경하지 않습니다.

```kotlin

fun main() {

    val numbers = mutableListOf("one", "five", "three")
    numbers[1] =  "two"
    println(numbers)

}
```

[`fill()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/fill.html)은 단순히 컬렉션의 모든 요소를 지정된 값으로 바꿉니다.

```kotlin

fun main() {

    val numbers = mutableListOf(1, 2, 3, 4)
    numbers.fill(3)
    println(numbers)

}
```

### 제거

리스트에서 특정 위치의 요소를 제거하려면 위치를 인수로 제공하는 [`removeAt()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-mutable-list/remove-at.html) 함수를 사용합니다. 제거되는 요소 뒤에 오는 요소의 모든 인덱스는 1씩 감소합니다.

```kotlin

fun main() {

    val numbers = mutableListOf(1, 2, 3, 4, 3)    
    numbers.removeAt(1)
    println(numbers)

}
```

### 정렬

[컬렉션 정렬](collection-ordering)에서는 특정 순서로 컬렉션 요소를 검색하는 연산에 대해 설명합니다. 변경 가능한 리스트의 경우 표준 라이브러리는 제자리에서 동일한 정렬 연산을 수행하는 유사한 확장 함수를 제공합니다. 이러한 연산을 리스트 인스턴스에 적용하면 해당 인스턴스의 요소 순서가 변경됩니다.

제자리 정렬 함수는 읽기 전용 리스트에 적용되는 함수와 이름이 비슷하지만 `ed/d` 접미사가 없습니다.

* 모든 정렬 함수 이름에서 `sorted*` 대신 `sort*`: [`sort()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/sort.html), [`sortDescending()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/sort-descending.html), [`sortBy()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/sort-by.html) 등
* `shuffled()` 대신 [`shuffle()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/shuffle.html).
* `reversed()` 대신 [`reverse()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/reverse.html).

변경 가능한 리스트에서 호출된 [`asReversed()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/as-reversed.html)는 원래 리스트의 반전된 뷰인 다른 변경 가능한 리스트를 반환합니다. 해당 뷰의 변경 사항은 원래 리스트에 반영됩니다. 다음 예에서는 변경 가능한 리스트에 대한 정렬 함수를 보여줍니다.

```kotlin

fun main() {

    val numbers = mutableListOf("one", "two", "three", "four")

    numbers.sort()
    println("Sort into ascending: $numbers")
    numbers.sortDescending()
    println("Sort into descending: $numbers")

    numbers.sortBy { it.length }
    println("Sort into ascending by length: $numbers")
    numbers.sortByDescending { it.last() }
    println("Sort into descending by the last letter: $numbers")
    
    numbers.sortWith(compareBy<String> { it.length }.thenBy { it })
    println("Sort by Comparator: $numbers")

    numbers.shuffle()
    println("Shuffle: $numbers")

    numbers.reverse()
    println("Reverse: $numbers")

}
```