---
title: 배열
---
배열은 동일한 타입 또는 하위 타입의 고정된 수의 값을 담는 자료 구조입니다.
Kotlin에서 가장 일반적인 배열 타입은 [`Array`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-array/) 클래스로 표현되는 객체 타입 배열입니다.

:::note
객체 타입 배열에서 primitive 타입을 사용하면 primitive 타입이 객체로 [박싱](https://docs.oracle.com/javase/tutorial/java/data/autoboxing.html)되므로 성능에 영향을 미칩니다. 박싱 오버헤드를 피하려면 [primitive 타입 배열](#primitive-type-arrays)을 대신 사용하세요.

:::

## 배열을 사용해야 하는 경우

특수화된 로우 레벨 요구 사항을 충족해야 하는 경우 Kotlin에서 배열을 사용하세요. 예를 들어 일반 애플리케이션에 필요한 것 이상의 성능 요구 사항이 있거나 사용자 정의 데이터 구조를 구축해야 하는 경우입니다. 이러한 제한 사항이 없다면 [컬렉션](collections-overview)을 대신 사용하세요.

컬렉션은 배열에 비해 다음과 같은 이점이 있습니다.
* 컬렉션은 읽기 전용일 수 있으므로 더 많은 제어 권한을 제공하고 명확한 의도를 가진 강력한 코드를 작성할 수 있습니다.
* 컬렉션에서 요소를 쉽게 추가하거나 제거할 수 있습니다. 반면 배열은 크기가 고정되어 있습니다. 배열에서 요소를 추가하거나 제거하는 유일한 방법은 매번 새 배열을 만드는 것이며, 이는 매우 비효율적입니다.

  ```kotlin
  fun main() {

      var riversArray = arrayOf("Nile", "Amazon", "Yangtze")

      // += 할당 연산을 사용하면 새 riversArray가 생성되고,
      // 원래 요소가 복사되어 "Mississippi"가 추가됩니다.
      riversArray += "Mississippi"
      println(riversArray.joinToString())
      // Nile, Amazon, Yangtze, Mississippi

  }
  ```
  

* 동등성 연산자(`==`)를 사용하여 컬렉션이 구조적으로 동일한지 확인할 수 있습니다. 배열에서는 이 연산자를 사용할 수 없습니다. 대신 특수 함수를 사용해야 하며, 이에 대한 자세한 내용은 [배열 비교](#compare-arrays)에서 확인할 수 있습니다.

컬렉션에 대한 자세한 내용은 [컬렉션 개요](collections-overview)를 참조하세요.

## 배열 생성

Kotlin에서 배열을 생성하려면 다음을 사용할 수 있습니다.
* [`arrayOf()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/array-of.html), [`arrayOfNulls()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/array-of-nulls.html#kotlin$arrayOfNulls(kotlin.Int)) 또는 [`emptyArray()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/empty-array.html)와 같은 함수.
* `Array` 생성자.

이 예제에서는 [`arrayOf()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/array-of.html) 함수를 사용하고 항목 값을 전달합니다.

```kotlin
fun main() {

    // 값이 [1, 2, 3]인 배열을 만듭니다.
    val simpleArray = arrayOf(1, 2, 3)
    println(simpleArray.joinToString())
    // 1, 2, 3

}
```

이 예제에서는 [`arrayOfNulls()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/array-of-nulls.html#kotlin$arrayOfNulls(kotlin.Int)) 함수를 사용하여 `null` 요소로 채워진 지정된 크기의 배열을 만듭니다.

```kotlin
fun main() {

    // 값이 [null, null, null]인 배열을 만듭니다.
    val nullArray: Array<Int?> = arrayOfNulls(3)
    println(nullArray.joinToString())
    // null, null, null

}
```

이 예제에서는 [`emptyArray()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/empty-array.html) 함수를 사용하여 빈 배열을 만듭니다.

```kotlin
    var exampleArray = emptyArray<String>()
```

:::note
Kotlin의 타입 추론으로 인해 할당의 왼쪽 또는 오른쪽에 빈 배열의 타입을 지정할 수 있습니다.

예를 들어:
```Kotlin
var exampleArray = emptyArray<String>()

var exampleArray: Array<String> = emptyArray()
```

:::

`Array` 생성자는 배열 크기와 인덱스가 주어졌을 때 배열 요소에 대한 값을 반환하는 함수를 사용합니다.

```kotlin
fun main() {

    // 0으로 초기화된 Array<Int>를 만듭니다. [0, 0, 0]
    val initArray = Array<Int>(3) { 0 }
    println(initArray.joinToString())
    // 0, 0, 0

    // 값이 ["0", "1", "4", "9", "16"]인 Array<String>을 만듭니다.
    val asc = Array(5) { i `->` (i * i).toString() }
    asc.forEach { print(it) }
    // 014916

}
```

:::note
대부분의 프로그래밍 언어와 마찬가지로 Kotlin에서는 인덱스가 0부터 시작합니다.

:::

### 중첩 배열

배열을 서로 중첩하여 다차원 배열을 만들 수 있습니다.

```kotlin
fun main() {

    // 2차원 배열을 만듭니다.
    val twoDArray = Array(2) { Array<Int>(2) { 0 } }
    println(twoDArray.contentDeepToString())
    // [[0, 0], [0, 0]]

    // 3차원 배열을 만듭니다.
    val threeDArray = Array(3) { Array(3) { Array<Int>(3) { 0 } } }
    println(threeDArray.contentDeepToString())
    // [[[0, 0, 0], [0, 0, 0], [0, 0, 0]], [[0, 0, 0], [0, 0, 0], [0, 0, 0]], [[0, 0, 0], [0, 0, 0], [0, 0, 0]]]

}
```

:::note
중첩된 배열은 타입이나 크기가 같을 필요가 없습니다.

:::

## 요소 액세스 및 수정

배열은 항상 변경 가능합니다. 배열의 요소에 액세스하고 수정하려면 [인덱싱된 액세스 연산자](operator-overloading#indexed-access-operator)`[]`를 사용하세요.

```kotlin
fun main() {

    val simpleArray = arrayOf(1, 2, 3)
    val twoDArray = Array(2) { Array<Int>(2) { 0 } }

    // 요소에 액세스하고 수정합니다.
    simpleArray[0] = 10
    twoDArray[0][0] = 2

    // 수정된 요소를 출력합니다.
    println(simpleArray[0].toString()) // 10
    println(twoDArray[0][0].toString()) // 2

}
```

Kotlin의 배열은 _무변성_입니다. 즉, Kotlin에서는 가능한 런타임 오류를 방지하기 위해 `Array<String>`을 `Array<Any>`에 할당할 수 없습니다. 대신 `Array<out Any>`를 사용할 수 있습니다. 자세한 내용은 [타입 프로젝션](generics#type-projections)을 참조하세요.

## 배열 작업

Kotlin에서는 배열을 사용하여 함수에 가변 개수의 인수를 전달하거나 배열 자체에서 연산을 수행하여 배열을 사용할 수 있습니다. 예를 들어 배열을 비교하고, 내용을 변환하거나, 컬렉션으로 변환합니다.

### 함수에 가변 개수의 인수 전달

Kotlin에서는 [`vararg`](functions#variable-number-of-arguments-varargs) 매개변수를 통해 함수에 가변 개수의 인수를 전달할 수 있습니다. 이는 메시지를 포맷하거나 SQL 쿼리를 만드는 경우와 같이 인수의 수를 미리 알 수 없는 경우에 유용합니다.

가변 개수의 인수를 포함하는 배열을 함수에 전달하려면 _spread_ 연산자(`*`)를 사용하세요. spread 연산자는 배열의 각 요소를 선택한 함수에 개별 인수로 전달합니다.

```kotlin
fun main() {
    val lettersArray = arrayOf("c", "d")
    printAllStrings("a", "b", *lettersArray)
    // abcd
}

fun printAllStrings(vararg strings: String) {
    for (string in strings) {
        print(string)
    }
}
```

자세한 내용은 [가변 개수의 인수 (varargs)](functions#variable-number-of-arguments-varargs)를 참조하세요.

### 배열 비교

두 배열이 동일한 요소를 동일한 순서로 가지고 있는지 비교하려면 [`.contentEquals()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/content-equals.html) 및 [`.contentDeepEquals()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/content-deep-equals.html) 함수를 사용하세요.

```kotlin
fun main() {

    val simpleArray = arrayOf(1, 2, 3)
    val anotherArray = arrayOf(1, 2, 3)

    // 배열의 내용을 비교합니다.
    println(simpleArray.contentEquals(anotherArray))
    // true

    // infix 표기법을 사용하여 요소가 변경된 후 배열의 내용을 비교합니다.
    simpleArray[0] = 10
    println(simpleArray contentEquals anotherArray)
    // false

}
```

:::note
동등성(`==`) 및 비동등성(`!=`) [연산자](equality#structural-equality)를 사용하여 배열의 내용을 비교하지 마세요. 이러한 연산자는 할당된 변수가 동일한 객체를 가리키는지 확인합니다.

Kotlin에서 배열이 이러한 방식으로 작동하는 이유에 대한 자세한 내용은 [블로그 게시물](https://blog.jetbrains.com/kotlin/2015/09/feedback-request-limitations-on-data-classes/#Appendix.Comparingarrays)을 참조하세요.

### 배열 변환

Kotlin에는 배열을 변환하는 데 유용한 많은 함수가 있습니다. 이 문서에서는 몇 가지를 강조하지만 완전한 목록은 아닙니다. 전체 함수 목록은 [API 참조](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-array/)를 참조하세요.

#### Sum

배열의 모든 요소의 합계를 반환하려면 [`.sum()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/sum.html) 함수를 사용하세요.

```Kotlin
fun main() {

    val sumArray = arrayOf(1, 2, 3)

    // 배열 요소를 합합니다.
    println(sumArray.sum())
    // 6

}
```

`.sum()` 함수는 `Int`와 같은 [숫자 데이터 타입](numbers)의 배열에서만 사용할 수 있습니다.

:::

#### Shuffle

배열의 요소를 임의로 섞으려면 [`.shuffle()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/shuffle.html) 함수를 사용하세요.

```Kotlin
fun main() {

    val simpleArray = arrayOf(1, 2, 3)

    // 요소를 섞습니다. [3, 2, 1]
    simpleArray.shuffle()
    println(simpleArray.joinToString())

    // 요소를 다시 섞습니다. [2, 3, 1]
    simpleArray.shuffle()
    println(simpleArray.joinToString())

}
```

### 배열을 컬렉션으로 변환

배열을 사용하는 API와 컬렉션을 사용하는 API가 다른 경우 배열을 [컬렉션](collections-overview)으로 변환하거나 그 반대로 변환할 수 있습니다.

#### List 또는 Set으로 변환

배열을 `List` 또는 `Set`으로 변환하려면 [`.toList()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/to-list.html) 및 [`.toSet()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/to-set.html) 함수를 사용하세요.

```kotlin
fun main() {

    val simpleArray = arrayOf("a", "b", "c", "c")

    // Set으로 변환합니다.
    println(simpleArray.toSet())
    // [a, b, c]

    // List로 변환합니다.
    println(simpleArray.toList())
    // [a, b, c, c]

}
```

#### Map으로 변환

배열을 `Map`으로 변환하려면 [`.toMap()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/to-map.html) 함수를 사용하세요.

[`Pair<K,V>`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-pair/) 배열만 `Map`으로 변환할 수 있습니다.
`Pair` 인스턴스의 첫 번째 값은 키가 되고 두 번째 값은 값이 됩니다. 이 예제에서는 [infix 표기법](functions#infix-notation)을 사용하여 [`to`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/to.html) 함수를 호출하여 `Pair` 튜플을 만듭니다.

```kotlin
fun main() {

    val pairArray = arrayOf("apple" to 120, "banana" to 150, "cherry" to 90, "apple" to 140)

    // Map으로 변환합니다.
    // 키는 과일이고 값은 칼로리 수입니다.
    // 키는 고유해야 하므로 "apple"의 최신 값이
    // 첫 번째 값을 덮어씁니다.
    println(pairArray.toMap())
    // {apple=140, banana=150, cherry=90}

}
```

## Primitive 타입 배열

`Array` 클래스를 primitive 값과 함께 사용하는 경우 이러한 값은 객체로 박싱됩니다.
대안으로 primitive 타입 배열을 사용하여 박싱 오버헤드라는 부작용 없이 배열에 primitive 타입을 저장할 수 있습니다.

| Primitive 타입 배열 | Java의 상응하는 타입 |
|---|----------------|
| [`BooleanArray`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-boolean-array/) | `boolean[]`|
| [`ByteArray`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-byte-array/) | `byte[]`|
| [`CharArray`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-char-array/) | `char[]`|
| [`DoubleArray`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-double-array/) | `double[]`|
| [`FloatArray`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-float-array/) | `float[]`|
| [`IntArray`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-int-array/) | `int[]`|
| [`LongArray`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-long-array/) | `long[]`|
| [`ShortArray`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-short-array/) | `short[]`|

이러한 클래스는 `Array` 클래스와 상속 관계가 없지만 동일한 함수 및 속성 집합을 가지고 있습니다.

이 예제에서는 `IntArray` 클래스의 인스턴스를 만듭니다.

```kotlin
fun main() {

    // 0으로 초기화된 크기 5의 Int 배열을 만듭니다.
    val exampleArray = IntArray(5)
    println(exampleArray.joinToString())
    // 0, 0, 0, 0, 0

}
```

:::note
primitive 타입 배열을 객체 타입 배열로 변환하려면 [`.toTypedArray()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/to-typed-array.html) 함수를 사용하세요.

객체 타입 배열을 primitive 타입 배열로 변환하려면 [`.toBooleanArray()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/to-boolean-array.html),
[`.toByteArray()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/to-byte-array.html), [`.toCharArray()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/to-char-array.html) 등을 사용하세요.

:::

## 다음 단계

* 대부분의 사용 사례에서 컬렉션을 사용하는 것이 권장되는 이유에 대한 자세한 내용은 [컬렉션 개요](collections-overview)를 참조하세요.
* 다른 [기본 타입](basic-types)에 대해 알아보세요.
* Java 개발자라면 [컬렉션](java-to-kotlin-collections-guide)에 대한 Java에서 Kotlin으로의 마이그레이션 가이드를 읽어보세요.