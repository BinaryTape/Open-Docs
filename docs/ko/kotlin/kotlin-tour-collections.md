[//]: # (title: 컬렉션)

<no-index/>

<tldr>
    <p><img src="icon-1-done.svg" width="20" alt="첫 번째 단계" /> <a href="kotlin-tour-hello-world.md">Hello world</a><br />
        <img src="icon-2-done.svg" width="20" alt="두 번째 단계" /> <a href="kotlin-tour-basic-types.md">기본 타입</a><br />
        <img src="icon-3.svg" width="20" alt="세 번째 단계" /> <strong>컬렉션</strong><br />
        <img src="icon-4-todo.svg" width="20" alt="네 번째 단계" /> <a href="kotlin-tour-control-flow.md">제어 흐름</a><br />
        <img src="icon-5-todo.svg" width="20" alt="다섯 번째 단계" /> <a href="kotlin-tour-functions.md">함수</a><br />
        <img src="icon-6-todo.svg" width="20" alt="여섯 번째 단계" /> <a href="kotlin-tour-classes.md">클래스</a><br />
        <img src="icon-7-todo.svg" width="20" alt="마지막 단계" /> <a href="kotlin-tour-null-safety.md">널 안정성</a></p>
</tldr>

프로그래밍할 때, 나중에 처리하기 위해 데이터를 구조로 그룹화할 수 있는 것은 유용합니다. 코틀린은 정확히 이러한 목적으로 컬렉션을 제공합니다.

코틀린은 항목을 그룹화하기 위해 다음 컬렉션을 제공합니다:

| **컬렉션 타입** | **설명**                                                       |
|---------------------|-------------------------------------------------------------------------|
| 리스트               | 정렬된 항목 컬렉션                                            |
| 세트                 | 고유하고 순서가 없는 항목 컬렉션                                   |
| 맵                   | 키가 고유하고 하나의 값에만 매핑되는 키-값 쌍의 세트 |

각 컬렉션 타입은 변경 가능하거나 읽기 전용일 수 있습니다.

## 리스트

리스트는 항목을 추가된 순서대로 저장하며, 중복 항목을 허용합니다.

읽기 전용 리스트([`List`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-list/))를 생성하려면 [`listOf()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/list-of.html) 함수를 사용합니다.

변경 가능한 리스트([`MutableList`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-mutable-list.html))를 생성하려면 [`mutableListOf()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/mutable-list-of.html) 함수를 사용합니다.

리스트를 생성할 때 코틀린은 저장되는 항목의 타입을 추론할 수 있습니다. 타입을 명시적으로 선언하려면 리스트 선언 후 꺾쇠괄호 `<>` 안에 타입을 추가합니다:

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

> 원치 않는 수정을 방지하려면 변경 가능한 리스트를 `List`에 할당하여 읽기 전용 뷰를 생성할 수 있습니다:
> 
> ```kotlin
>     val shapes: MutableList<String> = mutableListOf("triangle", "square", "circle")
>     val shapesLocked: List<String> = shapes
> ```
> 이것은 또한 **캐스팅(casting)**이라고도 합니다.
> 
{style="tip"}

리스트는 순서가 있으므로 리스트의 항목에 접근하려면 [인덱스 접근 연산자 (indexed access operator)](operator-overloading.md#indexed-access-operator) `[]`를 사용합니다:

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

리스트의 첫 번째 또는 마지막 항목을 가져오려면 각각 [`.first()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/first.html) 및 [`.last()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/last.html) 함수를 사용합니다:

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

> [`.first()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/first.html) 및 [`.last()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/last.html) 함수는 **확장 (extension)** 함수의 예시입니다. 객체에 확장 함수를 호출하려면 객체 뒤에 마침표 `.`를 붙여 함수 이름을 작성합니다.
> 
> 확장 함수는 [중급 투어](kotlin-tour-intermediate-extension-functions.md#extension-functions)에서 자세히 다룹니다. 지금은 호출하는 방법만 알면 됩니다.
> 
{style="note"}

리스트의 항목 개수를 가져오려면 [`.count()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/count.html) 함수를 사용합니다:

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

항목이 리스트에 있는지 확인하려면 [`in` 연산자 (operator)](operator-overloading.md#in-operator)를 사용합니다:

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

변경 가능한 리스트에서 항목을 추가하거나 제거하려면 각각 [`.add()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-mutable-list/add.html) 및 [`.remove()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/remove.html) 함수를 사용합니다:

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

## 세트

리스트는 순서가 있고 중복 항목을 허용하는 반면, 세트는 **순서가 없으며** **고유한** 항목만 저장합니다.

읽기 전용 세트([`Set`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-set/))를 생성하려면 [`setOf()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/set-of.html) 함수를 사용합니다.

변경 가능한 세트([`MutableSet`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-mutable-set/))를 생성하려면 [`mutableSetOf()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/mutable-set-of.html) 함수를 사용합니다.

세트를 생성할 때 코틀린은 저장되는 항목의 타입을 추론할 수 있습니다. 타입을 명시적으로 선언하려면 세트 선언 후 꺾쇠괄호 `<>` 안에 타입을 추가합니다:

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

이전 예제에서 볼 수 있듯이 세트는 고유한 요소만 포함하므로 중복된 `"cherry"` 항목은 제거됩니다.

> 원치 않는 수정을 방지하려면 변경 가능한 세트를 `Set`에 할당하여 읽기 전용 뷰를 생성할 수 있습니다:
> 
> ```kotlin
>     val fruit: MutableSet<String> = mutableSetOf("apple", "banana", "cherry", "cherry")
>     val fruitLocked: Set<String> = fruit
> ```
>
{style="tip"}

> 세트는 **순서가 없으므로** 특정 인덱스로 항목에 접근할 수 없습니다.
> 
{style="note"}

세트의 항목 개수를 가져오려면 [`.count()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/count.html) 함수를 사용합니다:

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

항목이 세트에 있는지 확인하려면 [`in` 연산자](operator-overloading.md#in-operator)를 사용합니다:

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

변경 가능한 세트에서 항목을 추가하거나 제거하려면 각각 [`.add()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-mutable-set/add.html) 및 [`.remove()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/remove.html) 함수를 사용합니다:

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

맵은 항목을 키-값 쌍으로 저장합니다. 키를 참조하여 값에 접근합니다. 맵을 음식 메뉴와 같다고 생각할 수 있습니다. 먹고 싶은 음식(키)을 찾아 가격(값)을 찾을 수 있습니다. 맵은 리스트처럼 번호가 매겨진 인덱스를 사용하지 않고 값을 조회하고 싶을 때 유용합니다.

> * 맵의 모든 키는 고유해야 코틀린이 어떤 값을 가져올지 이해할 수 있습니다.
> * 맵에는 중복된 값이 있을 수 있습니다.
>
{style="note"}

읽기 전용 맵([`Map`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-map/))을 생성하려면 [`mapOf()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/map-of.html) 함수를 사용합니다.

변경 가능한 맵([`MutableMap`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-mutable-map/))을 생성하려면 [`mutableMapOf()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/mutable-map-of.html) 함수를 사용합니다.

맵을 생성할 때 코틀린은 저장되는 항목의 타입을 추론할 수 있습니다. 타입을 명시적으로 선언하려면 맵 선언 후 꺾쇠괄호 `<>` 안에 키와 값의 타입을 추가합니다. 예를 들어: `MutableMap<String, Int>` 입니다. 키는 `String` 타입이고 값은 `Int` 타입입니다.

맵을 생성하는 가장 쉬운 방법은 각 키와 관련된 값 사이에 [`to`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/to.html)를 사용하는 것입니다:

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

> 원치 않는 수정을 방지하려면 변경 가능한 맵을 `Map`에 할당하여 읽기 전용 뷰를 생성할 수 있습니다:
> 
> ```kotlin
>     val juiceMenu: MutableMap<String, Int> = mutableMapOf("apple" to 100, "kiwi" to 190, "orange" to 100)
>     val juiceMenuLocked: Map<String, Int> = juiceMenu
> ```
>
{style="tip"}

맵의 값에 접근하려면 키와 함께 [인덱스 접근 연산자](operator-overloading.md#indexed-access-operator) `[]`를 사용합니다:

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
> 이 투어에서는 나중에 [널 안정성 (Null safety)](kotlin-tour-null-safety.md) 챕터에서 널 값에 대해 설명합니다.
> 
{style="note"}

또한 [인덱스 접근 연산자](operator-overloading.md#indexed-access-operator) `[]`를 사용하여 변경 가능한 맵에 항목을 추가할 수 있습니다:

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

변경 가능한 맵에서 항목을 제거하려면 [`.remove()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/remove.html) 함수를 사용합니다:

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

맵의 항목 개수를 가져오려면 [`.count()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/count.html) 함수를 사용합니다:

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

특정 키가 맵에 이미 포함되어 있는지 확인하려면 [`.containsKey()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/contains-key.html) 함수를 사용합니다:

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

맵의 키 또는 값 컬렉션을 얻으려면 각각 [`keys`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-map/keys.html) 및 [`values`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-map/values.html) 속성을 사용합니다:

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

> [`keys`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-map/keys.html) 및 [`values`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-map/values.html)는 객체의 **속성 (property)** 예시입니다. 객체의 속성에 접근하려면 객체 뒤에 마침표 `.`를 붙여 속성 이름을 작성합니다.
>
> 속성은 [클래스](kotlin-tour-classes.md) 챕터에서 더 자세히 다룹니다. 이 투어의 현재 시점에서는 접근하는 방법만 알면 됩니다.
>
{style="note"}

키 또는 값이 맵에 있는지 확인하려면 [`in` 연산자](operator-overloading.md#in-operator)를 사용합니다:

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

컬렉션으로 할 수 있는 더 많은 정보는 [컬렉션](collections-overview.md)을 참조하세요.

이제 기본 타입과 컬렉션 관리 방법을 알았으니, 프로그램에서 사용할 수 있는 [제어 흐름](kotlin-tour-control-flow.md)을 탐색할 차례입니다.

## 연습

### 연습 1 {initial-collapse-state="collapsed" collapsible="true"}

“초록” 숫자 리스트와 “빨강” 숫자 리스트가 있습니다. 전체 숫자의 개수를 출력하는 코드를 완성하세요.

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
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="예시 해답" id="kotlin-tour-collections-solution-1"}

### 연습 2 {initial-collapse-state="collapsed" collapsible="true"}

서버가 지원하는 프로토콜 세트가 있습니다. 사용자가 특정 프로토콜을 사용하도록 요청합니다. 요청된 프로토콜이 지원되는지 여부를 확인하는 프로그램(`isSupported`는 Boolean 값이어야 함)을 완성하세요.

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
        요청된 프로토콜을 대문자로 확인하세요. 이를 돕기 위해 [` .uppercase()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/uppercase.html) 함수를 사용할 수 있습니다.
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
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="예시 해답" id="kotlin-tour-collections-solution-2"}

### 연습 3 {initial-collapse-state="collapsed" collapsible="true"}

1부터 3까지의 정수를 해당 철자와 연결하는 맵을 정의하세요. 이 맵을 사용하여 주어진 숫자를 철자로 표현하세요.

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
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="예시 해답" id="kotlin-tour-collections-solution-3"}

## 다음 단계

[제어 흐름](kotlin-tour-control-flow.md)