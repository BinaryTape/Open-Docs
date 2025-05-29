[//]: # (title: 배열)

배열은 동일한 타입 또는 그 서브타입의 고정된 수의 값을 담는 데이터 구조입니다. Kotlin에서 가장 일반적인 배열 타입은 [`Array`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-array/) 클래스로 표현되는 객체 타입 배열입니다.

> 객체 타입 배열에 원시 타입을 사용하면 원시 타입이 객체로 [박싱](https://docs.oracle.com/javase/tutorial/java/data/autoboxing.html)되므로 성능에 영향을 미칩니다. 박싱 오버헤드를 피하려면 대신 [원시 타입 배열](#primitive-type-arrays)을 사용하세요.
>
{style="note"}

## 배열 사용 시기

Kotlin에서 배열은 충족해야 할 특화된 저수준 요구사항이 있을 때 사용하세요. 예를 들어, 일반 애플리케이션에 필요한 것 이상의 성능 요구사항이 있거나 사용자 정의 데이터 구조를 구축해야 할 때가 여기에 해당합니다. 이러한 종류의 제약이 없다면 대신 [컬렉션](collections-overview.md)을 사용하세요.

컬렉션은 배열에 비해 다음과 같은 장점이 있습니다:
* 컬렉션은 읽기 전용일 수 있어 더 많은 제어를 제공하며, 명확한 의도를 가진 견고한 코드를 작성할 수 있게 해줍니다.
* 컬렉션에서 요소를 추가하거나 제거하기 쉽습니다. 이에 비해 배열은 크기가 고정되어 있습니다. 배열에서 요소를 추가하거나 제거하는 유일한 방법은 매번 새 배열을 생성하는 것인데, 이는 매우 비효율적입니다:

  ```kotlin
  fun main() {
  //sampleStart
      var riversArray = arrayOf("Nile", "Amazon", "Yangtze")

      // Using the += assignment operation creates a new riversArray,
      // copies over the original elements and adds "Mississippi"
      riversArray += "Mississippi"
      println(riversArray.joinToString())
      // Nile, Amazon, Yangtze, Mississippi
  //sampleEnd
  }
  ```
  {kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="arrays-rivers-array-kotlin"}

* 동등성 연산자(`==`)를 사용하여 컬렉션이 구조적으로 동일한지 확인할 수 있습니다. 이 연산자는 배열에는 사용할 수 없습니다. 대신, [배열 비교](#compare-arrays)에서 더 자세히 알아볼 수 있는 특별한 함수를 사용해야 합니다.

컬렉션에 대한 더 자세한 정보는 [컬렉션 개요](collections-overview.md)를 참고하세요.

## 배열 생성

Kotlin에서 배열을 생성하려면 다음을 사용할 수 있습니다:
* [`arrayOf()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/array-of.html), [`arrayOfNulls()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/array-of-nulls.html#kotlin$arrayOfNulls(kotlin.Int)) 또는 [`emptyArray()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/empty-array.html)와 같은 함수.
* `Array` 생성자.

이 예제는 [`arrayOf()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/array-of.html) 함수를 사용하고 항목 값을 전달합니다:

```kotlin
fun main() {
//sampleStart
    // Creates an array with values [1, 2, 3]
    val simpleArray = arrayOf(1, 2, 3)
    println(simpleArray.joinToString())
    // 1, 2, 3
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="arrays-simple-array-kotlin"}

이 예제는 [`arrayOfNulls()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/array-of-nulls.html#kotlin$arrayOfNulls(kotlin.Int)) 함수를 사용하여 주어진 크기의 `null` 요소로 채워진 배열을 생성합니다:

```kotlin
fun main() {
//sampleStart
    // Creates an array with values [null, null, null]
    val nullArray: Array<Int?> = arrayOfNulls(3)
    println(nullArray.joinToString())
    // null, null, null
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="arrays-null-array-kotlin"}

이 예제는 [`emptyArray()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/empty-array.html) 함수를 사용하여 빈 배열을 생성합니다:

```kotlin
    var exampleArray = emptyArray<String>()
```

> Kotlin의 타입 추론 덕분에 할당 연산자의 좌측 또는 우측에서 빈 배열의 타입을 지정할 수 있습니다.
>
> 예를 들어:
> ```Kotlin
> var exampleArray = emptyArray<String>()
>
> var exampleArray: Array<String> = emptyArray()
> ```
>
{style="note"}

`Array` 생성자는 배열 크기와 인덱스에 따라 배열 요소에 대한 값을 반환하는 함수를 인자로 받습니다:

```kotlin
fun main() {
//sampleStart
    // Creates an Array<Int> that initializes with zeros [0, 0, 0]
    val initArray = Array<Int>(3) { 0 }
    println(initArray.joinToString())
    // 0, 0, 0

    // Creates an Array<String> with values ["0", "1", "4", "9", "16"]
    val asc = Array(5) { i -> (i * i).toString() }
    asc.forEach { print(it) }
    // 014916
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="arrays-array-constructor-kotlin"}

> 대부분의 프로그래밍 언어와 마찬가지로 Kotlin에서도 인덱스는 0부터 시작합니다.
>
{style="note"}

### 중첩 배열

배열은 서로 중첩되어 다차원 배열을 생성할 수 있습니다:

```kotlin
fun main() {
//sampleStart
    // Creates a two-dimensional array
    val twoDArray = Array(2) { Array<Int>(2) { 0 } }
    println(twoDArray.contentDeepToString())
    // [[0, 0], [0, 0]]

    // Creates a three-dimensional array
    val threeDArray = Array(3) { Array(3) { Array<Int>(3) { 0 } } }
    println(threeDArray.contentDeepToString())
    // [[[0, 0, 0], [0, 0, 0], [0, 0, 0]], [[0, 0, 0], [0, 0, 0], [0, 0, 0]], [[0, 0, 0], [0, 0, 0], [0, 0, 0]]]
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="arrays-multidimensional-array-kotlin"}

> 중첩 배열은 동일한 타입이나 동일한 크기일 필요는 없습니다.
>
{style="note"}

## 요소 접근 및 수정

배열은 항상 가변적입니다. 배열의 요소에 접근하고 수정하려면 [인덱스 접근 연산자](operator-overloading.md#indexed-access-operator)`[]`를 사용하세요:

```kotlin
fun main() {
//sampleStart
    val simpleArray = arrayOf(1, 2, 3)
    val twoDArray = Array(2) { Array<Int>(2) { 0 } }

    // Accesses the element and modifies it
    simpleArray[0] = 10
    twoDArray[0][0] = 2

    // Prints the modified element
    println(simpleArray[0].toString()) // 10
    println(twoDArray[0][0].toString()) // 2
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="arrays-access-array-kotlin"}

Kotlin의 배열은 _불변 (invariant)_입니다. 이는 Kotlin이 잠재적인 런타임 실패를 방지하기 위해 `Array<String>`을 `Array<Any>`에 할당하는 것을 허용하지 않는다는 의미입니다. 대신 `Array<out Any>`를 사용할 수 있습니다. 더 자세한 정보는 [타입 프로젝션 (Type Projections)](generics.md#type-projections)을 참고하세요.

## 배열 작업

Kotlin에서는 배열을 사용하여 가변 개수의 인자를 함수에 전달하거나 배열 자체에 대한 연산을 수행할 수 있습니다. 예를 들어, 배열 비교, 내용 변환 또는 컬렉션으로 변환 등이 있습니다.

### 가변 개수의 인자를 함수에 전달

Kotlin에서는 [`vararg`](functions.md#variable-number-of-arguments-varargs) 파라미터를 통해 가변 개수의 인자를 함수에 전달할 수 있습니다. 이는 메시지를 포맷하거나 SQL 쿼리를 생성할 때처럼 인자의 개수를 미리 알 수 없을 때 유용합니다.

가변 개수의 인자를 포함하는 배열을 함수에 전달하려면 _스프레드_ 연산자(`*`)를 사용하세요. 스프레드 연산자는 배열의 각 요소를 선택한 함수에 개별 인자로 전달합니다:

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
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="arrays-vararg-array-kotlin"}

더 자세한 정보는 [가변 개수 인자 (`vararg`)](functions.md#variable-number-of-arguments-varargs)를 참고하세요.

### 배열 비교

두 배열이 동일한 요소를 동일한 순서로 가지고 있는지 비교하려면 [`.contentEquals()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/content-equals.html) 및 [`.contentDeepEquals()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/content-deep-equals.html) 함수를 사용하세요:

```kotlin
fun main() {
//sampleStart
    val simpleArray = arrayOf(1, 2, 3)
    val anotherArray = arrayOf(1, 2, 3)

    // Compares contents of arrays
    println(simpleArray.contentEquals(anotherArray))
    // true

    // Using infix notation, compares contents of arrays after an element
    // is changed
    simpleArray[0] = 10
    println(simpleArray contentEquals anotherArray)
    // false
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="arrays-compare-array-kotlin"}

> 배열의 내용을 비교할 때 동등성(`==`) 및 비동등성(`!=`) [연산자](equality.md#structural-equality)를 사용하지 마세요. 이 연산자들은 할당된 변수가 동일한 객체를 가리키는지 확인합니다.
>
> Kotlin에서 배열이 이런 식으로 동작하는 이유에 대한 자세한 내용은 [블로그 게시물](https://blog.jetbrains.com/kotlin/2015/09/feedback-request-limitations-on-data-classes/#Appendix.Comparingarrays)을 참고하세요.
>
{style="warning"}

### 배열 변환

Kotlin에는 배열을 변환하기 위한 많은 유용한 함수가 있습니다. 이 문서에서는 몇 가지를 강조하지만, 이는 완전한 목록은 아닙니다. 전체 함수 목록은 [API 참조](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-array/)를 참고하세요.

#### 합계

배열의 모든 요소의 합계를 반환하려면 [`.sum()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/sum.html) 함수를 사용하세요:

```Kotlin
fun main() {
//sampleStart
    val sumArray = arrayOf(1, 2, 3)

    // Sums array elements
    println(sumArray.sum())
    // 6
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="arrays-sum-array-kotlin"}

> `.sum()` 함수는 `Int`와 같은 [숫자 데이터 타입](numbers.md)의 배열에만 사용할 수 있습니다.
>
{style="note"}

#### 섞기

배열의 요소를 무작위로 섞으려면 [`.shuffle()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/shuffle.html) 함수를 사용하세요:

```Kotlin
fun main() {
//sampleStart
    val simpleArray = arrayOf(1, 2, 3)

    // Shuffles elements [3, 2, 1]
    simpleArray.shuffle()
    println(simpleArray.joinToString())

    // Shuffles elements again [2, 3, 1]
    simpleArray.shuffle()
    println(simpleArray.joinToString())
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="arrays-shuffle-array-kotlin"}

### 배열을 컬렉션으로 변환

일부 API는 배열을 사용하고 일부 API는 컬렉션을 사용하는 등 서로 다른 API와 함께 작업하는 경우, 배열을 [컬렉션](collections-overview.md)으로 변환할 수 있으며 그 반대도 가능합니다.

#### List 또는 Set으로 변환

배열을 `List` 또는 `Set`으로 변환하려면 [`.toList()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/to-list.html) 및 [`.toSet()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/to-set.html) 함수를 사용하세요.

```kotlin
fun main() {
//sampleStart
    val simpleArray = arrayOf("a", "b", "c", "c")

    // Converts to a Set
    println(simpleArray.toSet())
    // [a, b, c]

    // Converts to a List
    println(simpleArray.toList())
    // [a, b, c, c]
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="arrays-convert-list-set-kotlin"}

#### Map으로 변환

배열을 `Map`으로 변환하려면 [`.toMap()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/to-map.html) 함수를 사용하세요.

[`Pair<K,V>`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-pair/) 배열만 `Map`으로 변환될 수 있습니다. `Pair` 인스턴스의 첫 번째 값은 키가 되고, 두 번째 값은 값이 됩니다. 이 예제는 [중위 표기법 (infix notation)](functions.md#infix-notation)을 사용하여 [`to`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/to.html) 함수를 호출하여 `Pair` 튜플을 생성합니다:

```kotlin
fun main() {
//sampleStart
    val pairArray = arrayOf("apple" to 120, "banana" to 150, "cherry" to 90, "apple" to 140)

    // Converts to a Map
    // The keys are fruits and the values are their number of calories
    // Note how keys must be unique, so the latest value of "apple"
    // overwrites the first
    println(pairArray.toMap())
    // {apple=140, banana=150, cherry=90}

//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="arrays-convert-map-kotlin"}

## 원시 타입 배열

`Array` 클래스를 원시 값과 함께 사용하면 이 값들은 객체로 박싱됩니다. 대안으로, 박싱 오버헤드라는 부작용 없이 배열에 원시 값을 저장할 수 있게 해주는 원시 타입 배열을 사용할 수 있습니다:

| 원시 타입 배열 | Java의 해당 타입 |
|---|----------------|
| [`BooleanArray`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-boolean-array/) | `boolean[]`|
| [`ByteArray`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-byte-array/) | `byte[]`|
| [`CharArray`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-char-array/) | `char[]`|
| [`DoubleArray`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-double-array/) | `double[]`|
| [`FloatArray`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-float-array/) | `float[]`|
| [`IntArray`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-int-array/) | `int[]`|
| [`LongArray`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-long-array/) | `long[]`|
| [`ShortArray`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-short-array/) | `short[]`|

이 클래스들은 `Array` 클래스와 상속 관계가 없지만, 동일한 함수 및 프로퍼티 집합을 가지고 있습니다.

이 예제는 `IntArray` 클래스의 인스턴스를 생성합니다:

```kotlin
fun main() {
//sampleStart
    // Creates an array of Int of size 5 with the values initialized to zero
    val exampleArray = IntArray(5)
    println(exampleArray.joinToString())
    // 0, 0, 0, 0, 0
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="arrays-primitive-type-array-kotlin"}

> 원시 타입 배열을 객체 타입 배열로 변환하려면 [`.toTypedArray()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/to-typed-array.html) 함수를 사용하세요.
>
> 객체 타입 배열을 원시 타입 배열로 변환하려면 [`.toBooleanArray()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/to-boolean-array.html), [`.toByteArray()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/to-byte-array.html), [`.toCharArray()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/to-char-array.html) 등을 사용하세요.
>
{style="note"}

## 다음 단계는 무엇인가요?

* 대부분의 사용 사례에 컬렉션을 사용하는 것을 권장하는 이유에 대해 더 자세히 알아보려면 [컬렉션 개요](collections-overview.md)를 읽어보세요.
* 다른 [기본 타입](basic-types.md)에 대해 알아보세요.
* 자바 개발자라면 [컬렉션](java-to-kotlin-collections-guide.md)에 대한 자바에서 코틀린으로의 마이그레이션 가이드를 읽어보세요.