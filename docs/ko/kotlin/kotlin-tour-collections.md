---
title: 컬렉션
---
<no-index/>
:::info
<p>
   <img src="/img/icon-1-done.svg" width="20" alt="First step" /> <a href="kotlin-tour-hello-world">Hello world</a><br />
        <img src="/img/icon-2-done.svg" width="20" alt="Second step" /> <a href="kotlin-tour-basic-types">Basic types</a><br />
        <img src="/img/icon-3.svg" width="20" alt="Third step" /> <strong>Collections</strong><br />
        <img src="/img/icon-4-todo.svg" width="20" alt="Fourth step" /> <a href="kotlin-tour-control-flow">Control flow</a><br />
        <img src="/img/icon-5-todo.svg" width="20" alt="Fifth step" /> <a href="kotlin-tour-functions">Functions</a><br />
        <img src="/img/icon-6-todo.svg" width="20" alt="Sixth step" /> <a href="kotlin-tour-classes">Classes</a><br />
        <img src="/img/icon-7-todo.svg" width="20" alt="Final step" /> <a href="kotlin-tour-null-safety">Null safety</a>
</p>

:::

프로그래밍을 할 때 데이터를 구조체로 묶어 나중에 처리할 수 있으면 유용합니다. Kotlin은 이러한 목적을 위해 컬렉션(collections)을 제공합니다.

Kotlin에는 항목을 그룹화하기 위한 다음과 같은 컬렉션(collections)이 있습니다.

| **컬렉션 유형** | **설명**                                                                  |
|---------------------|-------------------------------------------------------------------------|
| Lists               | 항목의 정렬된 컬렉션(collection)                                                |
| Sets                | 항목의 고유한 비정렬 컬렉션(collection)                                           |
| Maps                | 키가 고유하고 하나의 값에만 매핑되는 키-값 쌍의 집합                                |

각 컬렉션(collection) 유형은 변경 가능하거나 읽기 전용일 수 있습니다.

## List

List는 항목을 추가된 순서대로 저장하고 중복 항목을 허용합니다.

읽기 전용 list([`List`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-list/))를 만들려면
[`listOf()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/list-of.html) 함수를 사용하세요.

변경 가능한 list([`MutableList`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-mutable-list.html))를 만들려면
[`mutableListOf()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/mutable-list-of.html) 함수를 사용하세요.

list를 생성할 때 Kotlin은 저장된 항목의 유형을 추론할 수 있습니다. 유형을 명시적으로 선언하려면 list 선언 뒤에 꺾쇠 괄호 `<>` 안에 유형을 추가하세요.

```kotlin
fun main() { 

    // Read only list
    val readOnlyShapes = listOf("triangle", "square", "circle")
    println(readOnlyShapes)
    // [triangle, square, circle]
    
    // Mutable list with explicit type declaration
    val shapes: MutableList<String> = mutableListOf("triangle", "square", "circle")
    println(shapes)
    // [triangle, square, circle]

}
```

:::note
원치 않는 수정을 방지하려면 변경 가능한 list를 `List`에 할당하여 읽기 전용 뷰를 만들 수 있습니다.

```kotlin
    val shapes: MutableList<String> = mutableListOf("triangle", "square", "circle")
    val shapesLocked: List<String> = shapes
```
이를 **캐스팅(casting)**이라고도 합니다.

List는 정렬되어 있으므로 list의 항목에 액세스하려면 [인덱스 접근 연산자](operator-overloading#indexed-access-operator) `[]`를 사용하세요.

```kotlin
fun main() { 

    val readOnlyShapes = listOf("triangle", "square", "circle")
    println("The first item in the list is: ${readOnlyShapes[0]}")
    // The first item in the list is: triangle

}
```

list에서 처음 또는 마지막 항목을 가져오려면 각각 [`.first()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/first.html) 및 [`.last()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/last.html) 함수를 사용하세요.

```kotlin
fun main() { 

    val readOnlyShapes = listOf("triangle", "square", "circle")
    println("The first item in the list is: ${readOnlyShapes.first()}")
    // The first item in the list is: triangle

}
```

[`.first()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/first.html) 및 [`.last()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/last.html)
함수는 **확장** 함수의 예입니다. 객체에서 확장 함수를 호출하려면 마침표 `.`가 추가된 객체 뒤에 함수 이름을 쓰세요.

확장 함수에 대한 자세한 내용은 [확장 함수](extensions#extension-functions)를 참조하세요.
이 둘러보기의 목적상 호출 방법만 알면 됩니다.

:::

list의 항목 수를 가져오려면 [`.count()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/count.html)
함수를 사용하세요.

```kotlin
fun main() { 

    val readOnlyShapes = listOf("triangle", "square", "circle")
    println("This list has ${readOnlyShapes.count()} items")
    // This list has 3 items

}
```

항목이 list에 있는지 확인하려면 [`in` 연산자](operator-overloading#in-operator)를 사용하세요.

```kotlin
fun main() {

    val readOnlyShapes = listOf("triangle", "square", "circle")
    println("circle" in readOnlyShapes)
    // true

}
```

변경 가능한 list에서 항목을 추가하거나 제거하려면 각각 [`.add()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-mutable-list/add.html)
및 [`.remove()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/remove.html) 함수를 사용하세요.

```kotlin
fun main() { 

    val shapes: MutableList<String> = mutableListOf("triangle", "square", "circle")
    // Add "pentagon" to the list
    shapes.add("pentagon") 
    println(shapes)  
    // [triangle, square, circle, pentagon]

    // Remove the first "pentagon" from the list
    shapes.remove("pentagon") 
    println(shapes)  
    // [triangle, square, circle]

}
```

## Set

List는 정렬되고 중복 항목을 허용하는 반면, set는 **정렬되지 않고** **고유한** 항목만 저장합니다.

읽기 전용 set([`Set`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-set/))를 만들려면
[`setOf()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/set-of.html) 함수를 사용하세요.

변경 가능한 set([`MutableSet`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-mutable-set/))를 만들려면
[`mutableSetOf()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/mutable-set-of.html) 함수를 사용하세요.

set를 생성할 때 Kotlin은 저장된 항목의 유형을 추론할 수 있습니다. 유형을 명시적으로 선언하려면 set 선언 뒤에 꺾쇠 괄호 `<>` 안에 유형을 추가하세요.

```kotlin
fun main() {

    // Read-only set
    val readOnlyFruit = setOf("apple", "banana", "cherry", "cherry")
    // Mutable set with explicit type declaration
    val fruit: MutableSet<String> = mutableSetOf("apple", "banana", "cherry", "cherry")
    
    println(readOnlyFruit)
    // [apple, banana, cherry]

}
```

이전 예에서 볼 수 있듯이 set는 고유한 요소만 포함하므로 중복된 `"cherry"` 항목은 삭제됩니다.

:::note
원치 않는 수정을 방지하려면 변경 가능한 set를 `Set`에 할당하여 읽기 전용 뷰를 만들 수 있습니다.

```kotlin
    val fruit: MutableSet<String> = mutableSetOf("apple", "banana", "cherry", "cherry")
    val fruitLocked: Set<String> = fruit
```

set는 **정렬되지 않았으므로** 특정 인덱스에서 항목에 액세스할 수 없습니다.

:::

set의 항목 수를 가져오려면 [`.count()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/count.html)
함수를 사용하세요.

```kotlin
fun main() { 

    val readOnlyFruit = setOf("apple", "banana", "cherry", "cherry")
    println("This set has ${readOnlyFruit.count()} items")
    // This set has 3 items

}
```

항목이 set에 있는지 확인하려면 [`in` 연산자](operator-overloading#in-operator)를 사용하세요.

```kotlin
fun main() {

    val readOnlyFruit = setOf("apple", "banana", "cherry", "cherry")
    println("banana" in readOnlyFruit)
    // true

}
```

변경 가능한 set에서 항목을 추가하거나 제거하려면 각각 [`.add()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-mutable-set/add.html)
및 [`.remove()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/remove.html) 함수를 사용하세요.

```kotlin
fun main() { 

    val fruit: MutableSet<String> = mutableSetOf("apple", "banana", "cherry", "cherry")
    fruit.add("dragonfruit")    // Add "dragonfruit" to the set
    println(fruit)              // [apple, banana, cherry, dragonfruit]
    
    fruit.remove("dragonfruit") // Remove "dragonfruit" from the set
    println(fruit)              // [apple, banana, cherry]

}
```

## Map

Map은 항목을 키-값 쌍으로 저장합니다. 키를 참조하여 값에 액세스합니다. map을 음식 메뉴처럼 생각할 수 있습니다.
먹고 싶은 음식(키)을 찾아서 가격(값)을 찾을 수 있습니다. map은 list처럼 번호가 매겨진 인덱스를 사용하지 않고 값을 조회하려는 경우에 유용합니다.

:::note
* map의 모든 키는 Kotlin이 가져오려는 값을 이해할 수 있도록 고유해야 합니다.
* map에는 중복된 값이 있을 수 있습니다.

:::

읽기 전용 map([`Map`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-map/))을 만들려면
[`mapOf()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/map-of.html) 함수를 사용하세요.

변경 가능한 map([`MutableMap`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-mutable-map/))을 만들려면
[`mutableMapOf()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/mutable-map-of.html) 함수를 사용하세요.

map을 생성할 때 Kotlin은 저장된 항목의 유형을 추론할 수 있습니다. 유형을 명시적으로 선언하려면 map 선언 뒤에 꺾쇠 괄호 `<>` 안에 키와 값의 유형을 추가하세요. 예를 들어 `MutableMap<String, Int>`와 같습니다.
키의 유형은 `String`이고 값의 유형은 `Int`입니다.

map을 만드는 가장 쉬운 방법은 각 키와 관련 값 사이에 [`to`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/to.html)를 사용하는 것입니다.

```kotlin
fun main() {

    // Read-only map
    val readOnlyJuiceMenu = mapOf("apple" to 100, "kiwi" to 190, "orange" to 100)
    println(readOnlyJuiceMenu)
    // {apple=100, kiwi=190, orange=100}

    // Mutable map with explicit type declaration
    val juiceMenu: MutableMap<String, Int> = mutableMapOf("apple" to 100, "kiwi" to 190, "orange" to 100)
    println(juiceMenu)
    // {apple=100, kiwi=190, orange=100}

}
```

:::note
원치 않는 수정을 방지하려면 변경 가능한 map을 `Map`에 할당하여 읽기 전용 뷰를 만들 수 있습니다.

```kotlin
    val juiceMenu: MutableMap<String, Int> = mutableMapOf("apple" to 100, "kiwi" to 190, "orange" to 100)
    val juiceMenuLocked: Map<String, Int> = juiceMenu
```

map에서 값에 액세스하려면 키와 함께 [인덱스 접근 연산자](operator-overloading#indexed-access-operator) `[]`를 사용하세요.

```kotlin
fun main() {

    // Read-only map
    val readOnlyJuiceMenu = mapOf("apple" to 100, "kiwi" to 190, "orange" to 100)
    println("The value of apple juice is: ${readOnlyJuiceMenu["apple"]}")
    // The value of apple juice is: 100

}
```

map에 존재하지 않는 키로 키-값 쌍에 액세스하려고 하면 `null` 값이 표시됩니다.

```kotlin
fun main() {

    // Read-only map
    val readOnlyJuiceMenu = mapOf("apple" to 100, "kiwi" to 190, "orange" to 100)
    println("The value of pineapple juice is: ${readOnlyJuiceMenu["pineapple"]}")
    // The value of pineapple juice is: null

}
```

이 둘러보기에서는 [Null safety](kotlin-tour-null-safety) 챕터에서 null 값에 대해 자세히 설명합니다.

:::

[인덱스 접근 연산자](operator-overloading#indexed-access-operator) `[]`를 사용하여 변경 가능한 map에 항목을 추가할 수도 있습니다.

```kotlin
fun main() {

    val juiceMenu: MutableMap<String, Int> = mutableMapOf("apple" to 100, "kiwi" to 190, "orange" to 100)
    juiceMenu["coconut"] = 150 // Add key "coconut" with value 150 to the map
    println(juiceMenu)
    // {apple=100, kiwi=190, orange=100, coconut=150}

}
```

변경 가능한 map에서 항목을 제거하려면 [`.remove()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/remove.html)
함수를 사용하세요.

```kotlin
fun main() {

    val juiceMenu: MutableMap<String, Int> = mutableMapOf("apple" to 100, "kiwi" to 190, "orange" to 100)
    juiceMenu.remove("orange")    // Remove key "orange" from the map
    println(juiceMenu)
    // {apple=100, kiwi=190}

}
```

map의 항목 수를 가져오려면 [`.count()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/count.html)
함수를 사용하세요.

```kotlin
fun main() {

    // Read-only map
    val readOnlyJuiceMenu = mapOf("apple" to 100, "kiwi" to 190, "orange" to 100)
    println("This map has ${readOnlyJuiceMenu.count()} key-value pairs")
    // This map has 3 key-value pairs

}
```

특정 키가 map에 이미 포함되어 있는지 확인하려면 [`.containsKey()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/contains-key.html)
함수를 사용하세요.

```kotlin
fun main() {

    val readOnlyJuiceMenu = mapOf("apple" to 100, "kiwi" to 190, "orange" to 100)
    println(readOnlyJuiceMenu.containsKey("kiwi"))
    // true

}
```

map의 키 또는 값 컬렉션(collection)을 얻으려면 각각 [`keys`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-map/keys.html)
및 [`values`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-map/values.html) 속성을 사용하세요.

```kotlin
fun main() {

    val readOnlyJuiceMenu = mapOf("apple" to 100, "kiwi" to 190, "orange" to 100)
    println(readOnlyJuiceMenu.keys)
    // [apple, kiwi, orange]
    println(readOnlyJuiceMenu.values)
    // [100, 190, 100]

}
```

:::note
[`keys`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-map/keys.html) 및 [`values`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-map/values.html)는
객체의 **속성**의 예입니다. 객체의 속성에 액세스하려면 마침표 `.`가 추가된 객체 뒤에 속성 이름을 쓰세요.

속성은 [클래스](kotlin-tour-classes) 챕터에서 더 자세히 설명합니다.
이 둘러보기에서는 액세스 방법만 알면 됩니다.

:::

키 또는 값이 map에 있는지 확인하려면 [`in` 연산자](operator-overloading#in-operator)를 사용하세요.

```kotlin
fun main() {

    val readOnlyJuiceMenu = mapOf("apple" to 100, "kiwi" to 190, "orange" to 100)
    println("orange" in readOnlyJuiceMenu.keys)
    // true
    
    // Alternatively, you don't need to use the keys property
    println("orange" in readOnlyJuiceMenu)
    // true
    
    println(200 in readOnlyJuiceMenu.values)
    // false

}
```

컬렉션(collection)으로 무엇을 할 수 있는지에 대한 자세한 내용은 [컬렉션(collection)](collections-overview)을 참조하세요.

이제 기본 유형과 컬렉션(collection) 관리 방법을 알았으니 프로그램에서 사용할 수 있는 [제어 흐름](kotlin-tour-control-flow)을 살펴보겠습니다.

## Practice

### Exercise 1 

"녹색" 숫자 list와 "빨간색" 숫자 list가 있습니다. 코드를 완성하여 총 숫자가 몇 개인지 출력하세요.

|---|---|
```kotlin
fun main() {
    val greenNumbers = listOf(1, 4, 23)
    val redNumbers = listOf(17, 2)
    // Write your code here
}
```

|---|---|
```kotlin
fun main() {
    val greenNumbers = listOf(1, 4, 23)
    val redNumbers = listOf(17, 2)
    val totalCount = greenNumbers.count() + redNumbers.count()
    println(totalCount)
}
```

### Exercise 2 

서버에서 지원하는 프로토콜 set가 있습니다. 사용자가 특정 프로토콜 사용을 요청합니다. 프로그램을 완성하여 요청된 프로토콜이 지원되는지 여부를 확인하세요(`isSupported`는 부울 값이어야 함).

|---|---|
```kotlin
fun main() {
    val SUPPORTED = setOf("HTTP", "HTTPS", "FTP")
    val requested = "smtp"
    val isSupported = // Write your code here 
    println("Support for $requested: $isSupported")
}
```

<h3>Hint</h3>
        요청된 프로토콜을 대문자로 확인해야 합니다. <a href="https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/uppercase.html">`.uppercase()`</a>
함수를 사용하여 이 작업을 수행할 수 있습니다.
    

|---|---|
```kotlin
fun main() {
    val SUPPORTED = setOf("HTTP", "HTTPS", "FTP")
    val requested = "smtp"
    val isSupported = requested.uppercase() in SUPPORTED
    println("Support for $requested: $isSupported")
}
```

### Exercise 3 

1에서 3까지의 정수를 해당 철자와 관련시키는 map을 정의합니다. 이 map을 사용하여 주어진 숫자를 철자로 쓰세요.

|---|---|
```kotlin
fun main() {
    val number2word = // Write your code here
    val n = 2
    println("$n is spelt as '${<Write your code here >}'")
}
```

|---|---|
```kotlin
fun main() {
    val number2word = mapOf(1 to "one", 2 to "two", 3 to "three")
    val n = 2
    println("$n is spelt as '${number2word[n]}'")
}
```

## Next step

[제어 흐름](kotlin-tour-control-flow)