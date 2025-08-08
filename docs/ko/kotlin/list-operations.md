[//]: # (title: 리스트별 연산)

[`List`](collections-overview.md#list)는 Kotlin에 내장된 가장 많이 사용되는 컬렉션 타입입니다. 리스트 요소에 대한 인덱스 접근은 리스트를 위한 강력한 연산 집합을 제공합니다.

## 인덱스로 요소 검색

리스트는 `elementAt()`, `first()`, `last()` 등 [단일 요소 검색](collection-elements.md)에 나열된 모든 일반적인 요소 검색 연산을 지원합니다. 리스트에 특화된 것은 요소에 대한 인덱스 접근이므로, 요소를 읽는 가장 간단한 방법은 인덱스로 검색하는 것입니다. 이는 인자로 인덱스를 전달하는 [`get()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-list/get.html) 함수 또는 단축 문법인 `[index]`를 사용하여 수행됩니다.

리스트 크기가 지정된 인덱스보다 작으면 예외가 발생합니다.
이러한 예외를 피하는 데 도움이 되는 두 가지 함수가 있습니다.

*   [`getOrElse()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/get-or-else.html)는 컬렉션에 인덱스가 없을 때 반환할 기본값을 계산하는 함수를 제공할 수 있도록 합니다.
*   [`getOrNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/get-or-null.html)은 기본값으로 `null`을 반환합니다.

```kotlin

fun main() {
//sampleStart
    val numbers = listOf(1, 2, 3, 4)
    println(numbers.get(0))
    println(numbers[0])
    //numbers.get(5)                         // exception!
    println(numbers.getOrNull(5))             // null
    println(numbers.getOrElse(5, {it}))        // 5
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

## 리스트 부분 검색

[컬렉션 부분 검색](collection-parts.md)을 위한 일반적인 연산 외에도, 리스트는 지정된 요소 범위의 뷰를 리스트로 반환하는 [`subList()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-list/sub-list.html) 함수를 제공합니다.
따라서 원본 컬렉션의 요소가 변경되면 이전에 생성된 서브리스트에서도 변경되며 그 반대도 마찬가지입니다.

```kotlin

fun main() {
//sampleStart
    val numbers = (0..13).toList()
    println(numbers.subList(3, 6))
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

## 요소 위치 찾기

### 선형 검색

어떤 리스트에서든 [`indexOf()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/index-of.html) 및 [`lastIndexOf()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/last-index-of.html) 함수를 사용하여 요소의 위치를 찾을 수 있습니다.
이 함수들은 리스트에서 주어진 인자와 동일한 요소의 첫 번째 및 마지막 위치를 반환합니다.
그러한 요소가 없으면 두 함수 모두 `-1`을 반환합니다.

```kotlin

fun main() {
//sampleStart
    val numbers = listOf(1, 2, 3, 4, 2, 5)
    println(numbers.indexOf(2))
    println(numbers.lastIndexOf(2))
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

또한, 술어(predicate)를 받아 일치하는 요소를 검색하는 함수 쌍도 있습니다.

*   [`indexOfFirst()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/index-of-first.html)는 술어와 일치하는 *첫 번째* 요소의 인덱스를 반환하거나, 그러한 요소가 없으면 `-1`을 반환합니다.
*   [`indexOfLast()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/index-of-last.html)는 술어와 일치하는 *마지막* 요소의 인덱스를 반환하거나, 그러한 요소가 없으면 `-1`을 반환합니다.

```kotlin

fun main() {
//sampleStart
    val numbers = mutableListOf(1, 2, 3, 4)
    println(numbers.indexOfFirst { it > 2})
    println(numbers.indexOfLast { it % 2 == 1})
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

### 정렬된 리스트에서의 이진 검색

리스트에서 요소를 검색하는 또 다른 방법은 [이진 검색](https://en.wikipedia.org/wiki/Binary_search_algorithm)입니다.
이는 다른 내장 검색 함수보다 훨씬 빠르게 작동하지만, 특정 순서(자연 순서 또는 함수 매개변수에 제공된 다른 순서)에 따라 *리스트가 오름차순으로 [정렬되어](collection-ordering.md) 있어야 합니다*.
그렇지 않으면 결과가 정의되지 않습니다.

정렬된 리스트에서 요소를 검색하려면 값을 인자로 전달하여 [`binarySearch()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/binary-search.html) 함수를 호출합니다.
그러한 요소가 존재하면 함수는 해당 인덱스를 반환하고, 그렇지 않으면 `(-insertionPoint - 1)`을 반환합니다. 여기서 `insertionPoint`는 리스트가 정렬된 상태를 유지하도록 이 요소가 삽입되어야 할 인덱스입니다.
주어진 값과 일치하는 요소가 두 개 이상인 경우, 검색은 그 중 임의의 인덱스를 반환할 수 있습니다.

검색할 인덱스 범위를 지정할 수도 있습니다. 이 경우 함수는 제공된 두 인덱스 사이에서만 검색합니다.

```kotlin

fun main() {
//sampleStart
    val numbers = mutableListOf("one", "two", "three", "four")
    numbers.sort()
    println(numbers)
    println(numbers.binarySearch("two"))  // 3
    println(numbers.binarySearch("z")) // -5
    println(numbers.binarySearch("two", 0, 2))  // -3
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

#### 비교자 이진 검색

리스트 요소가 `Comparable`이 아닐 때는 이진 검색에 사용할 [`Comparator`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-comparator.html)를 제공해야 합니다.
리스트는 이 `Comparator`에 따라 오름차순으로 정렬되어야 합니다. 다음 예시를 살펴보겠습니다.

```kotlin

data class Product(val name: String, val price: Double)

fun main() {
//sampleStart
    val productList = listOf(
        Product("WebStorm", 49.0),
        Product("AppCode", 99.0),
        Product("DotTrace", 129.0),
        Product("ReSharper", 149.0))

    println(productList.binarySearch(Product("AppCode", 99.0), compareBy<Product> { it.price }.thenBy { it.name }))
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

여기서는 `Comparable`이 아닌 `Product` 인스턴스 리스트와 순서를 정의하는 `Comparator`가 있습니다. `p1`의 가격이 `p2`의 가격보다 낮으면 `p1` 제품이 `p2` 제품보다 우선합니다.
따라서 이 순서에 따라 오름차순으로 정렬된 리스트가 있으면 `binarySearch()`를 사용하여 지정된 `Product`의 인덱스를 찾습니다.

커스텀 비교자(comparators)는 리스트가 자연 순서와 다른 순서, 예를 들어 `String` 요소에 대한 대소문자 구분 없는 순서를 사용하는 경우에도 유용합니다.

```kotlin

fun main() {
//sampleStart
    val colors = listOf("Blue", "green", "ORANGE", "Red", "yellow")
    println(colors.binarySearch("RED", String.CASE_INSENSITIVE_ORDER)) // 3
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

#### 비교 이진 검색

_비교(comparison)_ 함수를 사용한 이진 검색은 명시적인 검색 값을 제공하지 않고도 요소를 찾을 수 있도록 합니다.
대신, 요소들을 `Int` 값으로 매핑하는 비교 함수를 받아 함수가 0을 반환하는 요소를 검색합니다.
리스트는 제공된 함수에 따라 오름차순으로 정렬되어야 합니다. 즉, 비교 함수의 반환 값은 한 리스트 요소에서 다음 요소로 갈수록 증가해야 합니다.

```kotlin

import kotlin.math.sign
//sampleStart
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
//sampleEnd
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

비교자(comparator) 및 비교(comparison) 이진 검색 모두 리스트 범위에 대해서도 수행할 수 있습니다.

## 리스트 쓰기 연산

[컬렉션 쓰기 연산](collection-write.md)에 설명된 컬렉션 수정 연산 외에도, [변경 가능한(mutable)](collections-overview.md#collection-types) 리스트는 특정 쓰기 연산을 지원합니다.
이러한 연산은 인덱스를 사용하여 요소에 접근함으로써 리스트 수정 기능을 확장합니다.

### 추가

리스트의 특정 위치에 요소를 추가하려면, 요소 삽입 위치를 추가 인자로 제공하는 [`add()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-mutable-list/add.html) 및 [`addAll()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/add-all.html)를 사용합니다.
해당 위치 뒤에 오는 모든 요소는 오른쪽으로 이동합니다.

```kotlin

fun main() {
//sampleStart
    val numbers = mutableListOf("one", "five", "six")
    numbers.add(1, "two")
    numbers.addAll(2, listOf("three", "four"))
    println(numbers)
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

### 업데이트

리스트는 주어진 위치의 요소를 교체하는 함수인 [`set()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-mutable-list/set.html)와 그 연산자 형식인 `[]`도 제공합니다. `set()`은 다른 요소의 인덱스를 변경하지 않습니다.

```kotlin

fun main() {
//sampleStart
    val numbers = mutableListOf("one", "five", "three")
    numbers[1] =  "two"
    println(numbers)
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

[`fill()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/fill.html)은 단순히 모든 컬렉션 요소를 지정된 값으로 교체합니다.

```kotlin

fun main() {
//sampleStart
    val numbers = mutableListOf(1, 2, 3, 4)
    numbers.fill(3)
    println(numbers)
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

### 제거

리스트에서 특정 위치의 요소를 제거하려면 해당 위치를 인자로 제공하는 [`removeAt()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-mutable-list/remove-at.html) 함수를 사용합니다.
제거되는 요소 뒤에 오는 모든 요소의 인덱스는 1씩 감소합니다.

```kotlin

fun main() {
//sampleStart
    val numbers = mutableListOf(1, 2, 3, 4, 3)    
    numbers.removeAt(1)
    println(numbers)
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

### 정렬

[컬렉션 정렬](collection-ordering.md)에서는 특정 순서로 컬렉션 요소를 검색하는 연산을 설명합니다.
변경 가능한 리스트의 경우, 표준 라이브러리는 동일한 정렬 연산을 제자리에서 수행하는 유사한 확장 함수를 제공합니다.
이러한 연산을 리스트 인스턴스에 적용하면 해당 인스턴스의 요소 순서가 변경됩니다.

제자리 정렬 함수의 이름은 읽기 전용 리스트에 적용되는 함수와 유사하지만 `ed/d` 접미사가 없습니다.

*   모든 정렬 함수의 이름에서 `sorted*` 대신 `sort*`: [`sort()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/sort.html), [`sortDescending()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/sort-descending.html), [`sortBy()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/sort-by.html) 등.
*   `shuffled()` 대신 [`shuffle()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/shuffle.html).
*   `reversed()` 대신 [`reverse()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/reverse.html).

변경 가능한 리스트에서 호출된 [`asReversed()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/as-reversed.html)는 원본 리스트의 역순 뷰인 또 다른 변경 가능한 리스트를 반환합니다. 이 뷰의 변경 사항은 원본 리스트에 반영됩니다.
다음 예시는 변경 가능한 리스트에 대한 정렬 함수를 보여줍니다.

```kotlin

fun main() {
//sampleStart
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
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}