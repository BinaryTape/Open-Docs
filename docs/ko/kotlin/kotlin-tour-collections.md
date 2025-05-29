[//]: # (title: 컬렉션)

<no-index/>

<tldr>
    <p><img src="icon-1-done.svg" width="20" alt="첫 번째 단계" /> <a href="kotlin-tour-hello-world.md">헬로 월드</a><br />
        <img src="icon-2-done.svg" width="20" alt="두 번째 단계" /> <a href="kotlin-tour-basic-types.md">기본 타입</a><br />
        <img src="icon-3.svg" width="20" alt="세 번째 단계" /> <strong>컬렉션</strong><br />
        <img src="icon-4-todo.svg" width="20" alt="네 번째 단계" /> <a href="kotlin-tour-control-flow.md">제어 흐름</a><br />
        <img src="icon-5-todo.svg" width="20" alt="다섯 번째 단계" /> <a href="kotlin-tour-functions.md">함수</a><br />
        <img src="icon-6-todo.svg" width="20" alt="여섯 번째 단계" /> <a href="kotlin-tour-classes.md">클래스</a><br />
        <img src="icon-7-todo.svg" width="20" alt="마지막 단계" /> <a href="kotlin-tour-null-safety.md">널 안전성</a></p>
</tldr>

프로그래밍 시, 나중에 처리할 수 있도록 데이터를 구조로 묶는 것이 유용합니다. Kotlin은 바로 이러한 목적을 위해 컬렉션을 제공합니다.

Kotlin은 항목을 그룹화하기 위해 다음 컬렉션을 제공합니다:

| **컬렉션 타입** | **설명**                                                              |
|---------------------|-------------------------------------------------------------------------|
| 리스트               | 항목의 순서 있는 컬렉션                                            |
| 집합               | 고유하고 순서 없는 항목 컬렉션                                   |
| 맵               | 키가 고유하고 하나의 값에만 매핑되는 키-값 쌍의 집합 |

각 컬렉션 타입은 변경 가능하거나 읽기 전용일 수 있습니다.

## 리스트

리스트는 항목이 추가된 순서대로 항목을 저장하며, 중복 항목을 허용합니다.

읽기 전용 리스트([`List`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-list/))를 생성하려면 [`listOf()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/list-of.html) 함수를 사용하세요.

변경 가능한 리스트([`MutableList`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-mutable-list.html))를 생성하려면 [`mutableListOf()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/mutable-list-of.html) 함수를 사용하세요.

리스트를 생성할 때 Kotlin은 저장된 항목의 타입을 추론할 수 있습니다. 타입을 명시적으로 선언하려면 리스트 선언 뒤에 꺾쇠괄호(`<>`) 안에 타입을 추가하세요:

```kotlin
fun main() { 
//sampleStart
    // Read only list
    val readOnlyShapes = listOf("triangle", "square", "circle")
    println(readOnlyShapes)
    // [triangle, square, circle]
    
    // Mutable list with explicit type declaration
    val shapes: MutableList<String> = mutableListOf("triangle", "square", "circle")
    println(shapes)
    // [triangle, square, circle]
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-lists-declaration"}

> 원치 않는 변경을 방지하기 위해, 가변 리스트를 `List`에 할당하여 읽기 전용 뷰를 생성할 수 있습니다:
> 
> ```kotlin
>     val shapes: MutableList<String> = mutableListOf("triangle", "square", "circle")
>     val shapesLocked: List<String> = shapes
> ```
> 이것은 **캐스팅**이라고도 불립니다.
> 
{style="tip"}

리스트는 순서가 있으므로 리스트의 항목에 접근하려면 [인덱스 접근 연산자](operator-overloading.md#indexed-access-operator) `[]`를 사용하세요:

```kotlin
fun main() { 
//sampleStart
    val readOnlyShapes = listOf("triangle", "square", "circle")
    println("The first item in the list is: ${readOnlyShapes[0]}")
    // The first item in the list is: triangle
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-list-access"}

리스트의 첫 번째 또는 마지막 항목을 가져오려면 각각 [`.first()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/first.html) 및 [`.last()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/last.html) 함수를 사용하세요:

```kotlin
fun main() { 
//sampleStart
    val readOnlyShapes = listOf("triangle", "square", "circle")
    println("The first item in the list is: ${readOnlyShapes.first()}")
    // The first item in the list is: triangle
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-list-first"}

> [`.first()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/first.html) 및 [`.last()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/last.html) 함수는 **확장** 함수의 예시입니다. 객체에서 확장 함수를 호출하려면, 객체 뒤에 점 `.`을 붙여 함수 이름을 작성합니다.
> 
> 확장 함수는 [중급 투어](kotlin-tour-intermediate-extension-functions.md#extension-functions)에서 자세히 다룹니다. 지금은 호출 방법을 아는 것만으로 충분합니다.
> 
{style="note"}

리스트의 항목 개수를 가져오려면 [`.count()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/count.html) 함수를 사용하세요:

```kotlin
fun main() { 
//sampleStart
    val readOnlyShapes = listOf("triangle", "square", "circle")
    println("This list has ${readOnlyShapes.count()} items")
    // This list has 3 items
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-list-count"}

리스트에 항목이 있는지 확인하려면 [`in` 연산자](operator-overloading.md#in-operator)를 사용하세요:

```kotlin
fun main() {
//sampleStart
    val readOnlyShapes = listOf("triangle", "square", "circle")
    println("circle" in readOnlyShapes)
    // true
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-list-in"}

가변 리스트에서 항목을 추가하거나 제거하려면 각각 [`.add()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-mutable-list/add.html) 및 [`.remove()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/remove.html) 함수를 사용하세요:

```kotlin
fun main() { 
//sampleStart
    val shapes: MutableList<String> = mutableListOf("triangle", "square", "circle")
    // Add "pentagon" to the list
    shapes.add("pentagon") 
    println(shapes)  
    // [triangle, square, circle, pentagon]

    // Remove the first "pentagon" from the list
    shapes.remove("pentagon") 
    println(shapes)  
    // [triangle, square, circle]
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-list-add-remove"}

## 집합

리스트는 순서가 있고 중복 항목을 허용하는 반면, 집합은 **순서가 없으며** **고유한** 항목만 저장합니다.

읽기 전용 집합([`Set`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-set/))을 생성하려면 [`setOf()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/set-of.html) 함수를 사용하세요.

변경 가능한 집합([`MutableSet`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-mutable-set.html))을 생성하려면 [`mutableSetOf()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/mutable-set-of.html) 함수를 사용하세요.

집합을 생성할 때 Kotlin은 저장된 항목의 타입을 추론할 수 있습니다. 타입을 명시적으로 선언하려면 집합 선언 뒤에 꺾쇠괄호(`<>`) 안에 타입을 추가하세요:

```kotlin
fun main() {
//sampleStart
    // Read-only set
    val readOnlyFruit = setOf("apple", "banana", "cherry", "cherry")
    // Mutable set with explicit type declaration
    val fruit: MutableSet<String> = mutableSetOf("apple", "banana", "cherry", "cherry")
    
    println(readOnlyFruit)
    // [apple, banana, cherry]
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-sets-declaration"}

이전 예시에서 집합은 고유한 요소만 포함하기 때문에 중복된 `"cherry"` 항목이 제거된 것을 볼 수 있습니다.

> 원치 않는 변경을 방지하기 위해, 가변 집합을 `Set`에 할당하여 읽기 전용 뷰를 생성할 수 있습니다:
> 
> ```kotlin
>     val fruit: MutableSet<String> = mutableSetOf("apple", "banana", "cherry", "cherry")
>     val fruitLocked: Set<String> = fruit
> ```
>
{style="tip"}

> 집합은 **순서가 없으므로**, 특정 인덱스로 항목에 접근할 수 없습니다.
> 
{style="note"}

집합의 항목 개수를 가져오려면 [`.count()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/count.html) 함수를 사용하세요:

```kotlin
fun main() { 
//sampleStart
    val readOnlyFruit = setOf("apple", "banana", "cherry", "cherry")
    println("This set has ${readOnlyFruit.count()} items")
    // This set has 3 items
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-set-count"}

집합에 항목이 있는지 확인하려면 [`in` 연산자](operator-overloading.md#in-operator)를 사용하세요:

```kotlin
fun main() {
//sampleStart
    val readOnlyFruit = setOf("apple", "banana", "cherry", "cherry")
    println("banana" in readOnlyFruit)
    // true
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-set-in"}

가변 집합에서 항목을 추가하거나 제거하려면 각각 [`.add()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-mutable-set/add.html) 및 [`.remove()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/remove.html) 함수를 사용하세요:

```kotlin
fun main() { 
//sampleStart
    val fruit: MutableSet<String> = mutableSetOf("apple", "banana", "cherry", "cherry")
    fruit.add("dragonfruit")    // Add "dragonfruit" to the set
    println(fruit)              // [apple, banana, cherry, dragonfruit]
    
    fruit.remove("dragonfruit") // Remove "dragonfruit" from the set
    println(fruit)              // [apple, banana, cherry]
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-set-add-remove"}

## 맵

맵은 항목을 키-값 쌍으로 저장합니다. 키를 참조하여 값에 접근합니다. 맵을 음식 메뉴처럼 상상할 수 있습니다. 먹고 싶은 음식(키)을 찾아 가격(값)을 알 수 있습니다. 맵은 리스트처럼 번호가 매겨진 인덱스를 사용하지 않고 값을 찾고 싶을 때 유용합니다.

> * Kotlin이 어떤 값을 가져올지 이해할 수 있도록 맵의 모든 키는 고유해야 합니다.
> * 맵에는 중복된 값을 가질 수 있습니다.
>
{style="note"}

읽기 전용 맵([`Map`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-map/))을 생성하려면 [`mapOf()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/map-of.html) 함수를 사용하세요.

변경 가능한 맵([`MutableMap`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-mutable-map/))을 생성하려면 [`mutableMapOf()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/mutable-map-of.html) 함수를 사용하세요.

맵을 생성할 때 Kotlin은 저장된 항목의 타입을 추론할 수 있습니다. 타입을 명시적으로 선언하려면 맵 선언 뒤에 꺾쇠괄호(`<>`) 안에 키와 값의 타입을 추가하세요. 예를 들어: `MutableMap<String, Int>`. 키는 `String` 타입이고 값은 `Int` 타입입니다.

맵을 생성하는 가장 쉬운 방법은 각 키와 해당 값 사이에 [`to`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/to.html)를 사용하는 것입니다:

```kotlin
fun main() {
//sampleStart
    // Read-only map
    val readOnlyJuiceMenu = mapOf("apple" to 100, "kiwi" to 190, "orange" to 100)
    println(readOnlyJuiceMenu)
    // {apple=100, kiwi=190, orange=100}

    // Mutable map with explicit type declaration
    val juiceMenu: MutableMap<String, Int> = mutableMapOf("apple" to 100, "kiwi" to 190, "orange" to 100)
    println(juiceMenu)
    // {apple=100, kiwi=190, orange=100}
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-maps-declaration"}

> 원치 않는 변경을 방지하기 위해, 가변 맵을 `Map`에 할당하여 읽기 전용 뷰를 생성할 수 있습니다:
> 
> ```kotlin
>     val juiceMenu: MutableMap<String, Int> = mutableMapOf("apple" to 100, "kiwi" to 190, "orange" to 100)
>     val juiceMenuLocked: Map<String, Int> = juiceMenu
> ```
>
{style="tip"}

맵의 값에 접근하려면 키와 함께 [인덱스 접근 연산자](operator-overloading.md#indexed-access-operator) `[]`를 사용하세요:

```kotlin
fun main() {
//sampleStart
    // Read-only map
    val readOnlyJuiceMenu = mapOf("apple" to 100, "kiwi" to 190, "orange" to 100)
    println("The value of apple juice is: ${readOnlyJuiceMenu["apple"]}")
    // The value of apple juice is: 100
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-map-access"}

> 맵에 존재하지 않는 키로 키-값 쌍에 접근하려고 하면 `null` 값이 표시됩니다:
>
> ```kotlin
> fun main() {
> //sampleStart
>     // Read-only map
>     val readOnlyJuiceMenu = mapOf("apple" to 100, "kiwi" to 190, "orange" to 100)
>     println("The value of pineapple juice is: ${readOnlyJuiceMenu["pineapple"]}")
>     // The value of pineapple juice is: null
> //sampleEnd
> }
> ```
> {kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-map-no-key" validate="false"}
> 
> 이 투어는 [널 안전성](kotlin-tour-null-safety.md) 장에서 널 값을 나중에 설명합니다.
> 
{style="note"}

또한 [인덱스 접근 연산자](operator-overloading.md#indexed-access-operator) `[]`를 사용하여 가변 맵에 항목을 추가할 수 있습니다:

```kotlin
fun main() {
//sampleStart
    val juiceMenu: MutableMap<String, Int> = mutableMapOf("apple" to 100, "kiwi" to 190, "orange" to 100)
    juiceMenu["coconut"] = 150 // Add key "coconut" with value 150 to the map
    println(juiceMenu)
    // {apple=100, kiwi=190, orange=100, coconut=150}
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-map-add-item"}

가변 맵에서 항목을 제거하려면 [`.remove()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/remove.html) 함수를 사용하세요:

```kotlin
fun main() {
//sampleStart
    val juiceMenu: MutableMap<String, Int> = mutableMapOf("apple" to 100, "kiwi" to 190, "orange" to 100)
    juiceMenu.remove("orange")    // Remove key "orange" from the map
    println(juiceMenu)
    // {apple=100, kiwi=190}
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-map-put-remove"}

맵의 항목 개수를 가져오려면 [`.count()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/count.html) 함수를 사용하세요:

```kotlin
fun main() {
//sampleStart
    // Read-only map
    val readOnlyJuiceMenu = mapOf("apple" to 100, "kiwi" to 190, "orange" to 100)
    println("This map has ${readOnlyJuiceMenu.count()} key-value pairs")
    // This map has 3 key-value pairs
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-map-count"}

맵에 특정 키가 이미 포함되어 있는지 확인하려면 [`.containsKey()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/contains-key.html) 함수를 사용하세요:

```kotlin
fun main() {
//sampleStart
    val readOnlyJuiceMenu = mapOf("apple" to 100, "kiwi" to 190, "orange" to 100)
    println(readOnlyJuiceMenu.containsKey("kiwi"))
    // true
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-map-contains-keys"}

맵의 키 또는 값 컬렉션을 얻으려면 각각 [`keys`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-map/keys.html) 및 [`values`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-map/values.html) 프로퍼티를 사용하세요:

```kotlin
fun main() {
//sampleStart
    val readOnlyJuiceMenu = mapOf("apple" to 100, "kiwi" to 190, "orange" to 100)
    println(readOnlyJuiceMenu.keys)
    // [apple, kiwi, orange]
    println(readOnlyJuiceMenu.values)
    // [100, 190, 100]
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-map-keys-values"}

> [`keys`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-map/keys.html) 및 [`values`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-map/values.html)는 객체의 **프로퍼티**의 예시입니다. 객체의 프로퍼티에 접근하려면 객체 뒤에 점 `.`을 붙여 프로퍼티 이름을 작성합니다.
>
> 프로퍼티는 [클래스](kotlin-tour-classes.md) 장에서 더 자세히 다룹니다. 이 투어의 이 시점에서는 접근 방법만 알면 됩니다.
>
{style="note"}

맵에 키 또는 값이 있는지 확인하려면 [`in` 연산자](operator-overloading.md#in-operator)를 사용하세요:

```kotlin
fun main() {
//sampleStart
    val readOnlyJuiceMenu = mapOf("apple" to 100, "kiwi" to 190, "orange" to 100)
    println("orange" in readOnlyJuiceMenu.keys)
    // true
    
    // Alternatively, you don't need to use the keys property
    println("orange" in readOnlyJuiceMenu)
    // true
    
    println(200 in readOnlyJuiceMenu.values)
    // false
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-map-in"}

컬렉션으로 할 수 있는 작업에 대한 자세한 내용은 [컬렉션](collections-overview.md)을 참조하세요.

이제 기본 타입과 컬렉션 관리 방법을 알았으니, 프로그램에서 사용할 수 있는 [제어 흐름](kotlin-tour-control-flow.md)을 살펴볼 차례입니다.

## 연습

### 연습 1 {initial-collapse-state="collapsed" collapsible="true"}

"초록색" 숫자 목록과 "빨간색" 숫자 목록이 있습니다. 총 몇 개의 숫자가 있는지 출력하도록 코드를 완성하세요.

|---|---|
```kotlin
fun main() {
    val greenNumbers = listOf(1, 4, 23)
    val redNumbers = listOf(17, 2)
    // Write your code here
}
```
{validate="false" kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-collections-exercise-1"}

|---|---|
```kotlin
fun main() {
    val greenNumbers = listOf(1, 4, 23)
    val redNumbers = listOf(17, 2)
    val totalCount = greenNumbers.count() + redNumbers.count()
    println(totalCount)
}
```
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="예시 솔루션" id="kotlin-tour-collections-solution-1"}

### 연습 2 {initial-collapse-state="collapsed" collapsible="true"}

서버가 지원하는 프로토콜 집합이 있습니다. 사용자가 특정 프로토콜을 사용하도록 요청합니다. 요청된 프로토콜이 지원되는지 여부를 확인하도록 프로그램을 완성하세요 (`isSupported`는 Boolean 값이어야 합니다).

|---|---|
```kotlin
fun main() {
    val SUPPORTED = setOf("HTTP", "HTTPS", "FTP")
    val requested = "smtp"
    val isSupported = // Write your code here 
    println("Support for $requested: $isSupported")
}
```
{validate="false" kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-collections-exercise-2"}

<deflist collapsible="true" id="kotlin-tour-collections-exercise-2-hint">
    <def title="힌트">
        요청된 프로토콜이 대문자인지 확인하세요. 이를 위해 <a href="https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/uppercase.html"><code>.uppercase()</code></a> 함수를 사용할 수 있습니다.
    </def>
</deflist>

|---|---|
```kotlin
fun main() {
    val SUPPORTED = setOf("HTTP", "HTTPS", "FTP")
    val requested = "smtp"
    val isSupported = requested.uppercase() in SUPPORTED
    println("Support for $requested: $isSupported")
}
```
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="예시 솔루션" id="kotlin-tour-collections-solution-2"}

### 연습 3 {initial-collapse-state="collapsed" collapsible="true"}

정수 1부터 3까지를 해당 철자와 연결하는 맵을 정의하세요. 이 맵을 사용하여 주어진 숫자를 철자로 표현하세요.

|---|---|
```kotlin
fun main() {
    val number2word = // Write your code here
    val n = 2
    println("$n is spelt as '${<Write your code here >}'")
}
```
{validate="false" kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-collections-exercise-3"}

|---|---|
```kotlin
fun main() {
    val number2word = mapOf(1 to "one", 2 to "two", 3 to "three")
    val n = 2
    println("$n is spelt as '${number2word[n]}'")
}
```
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="예시 솔루션" id="kotlin-tour-collections-solution-3"}

## 다음 단계

[제어 흐름](kotlin-tour-control-flow.md)