[//]: # (title: Hello world)

<no-index/>

<tldr>
    <p><img src="icon-1.svg" width="20" alt="First step" /> <strong>Hello world</strong><br />
        <img src="icon-2-todo.svg" width="20" alt="Second step" /> <a href="kotlin-tour-basic-types.md">기본 타입</a><br />
        <img src="icon-3-todo.svg" width="20" alt="Third step" /> <a href="kotlin-tour-collections.md">컬렉션</a><br />
        <img src="icon-4-todo.svg" width="20" alt="Fourth step" /> <a href="kotlin-tour-control-flow.md">제어 흐름</a><br />
        <img src="icon-5-todo.svg" width="20" alt="Fifth step" /> <a href="kotlin-tour-functions.md">함수</a><br />
        <img src="icon-6-todo.svg" width="20" alt="Sixth step" /> <a href="kotlin-tour-classes.md">클래스</a><br />
        <img src="icon-7-todo.svg" width="20" alt="Final step" /> <a href="kotlin-tour-null-safety.md">널 안전성</a></p>
</tldr>

다음은 "Hello, world!"를 출력하는 간단한 프로그램입니다:

```kotlin
fun main() {
    println("Hello, world!")
    // Hello, world!
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="hello-world-kotlin"}

Kotlin에서:

*   `fun`은 함수를 선언하는 데 사용됩니다.
*   `main()` 함수는 프로그램이 시작되는 지점입니다.
*   함수의 본문은 중괄호 `{}` 안에 작성됩니다.
*   [`println()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.io/println.html) 및 [`print()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.io/print.html) 함수는 인수를 표준 출력에 인쇄합니다.

함수는 특정 작업을 수행하는 일련의 지침입니다. 함수를 한 번 생성하면, 해당 작업을 수행해야 할 때마다 지침을 다시 작성할 필요 없이 사용할 수 있습니다. 함수에 대한 자세한 내용은 몇 개의 챕터에서 더 자세히 다룹니다. 그때까지 모든 예제는 `main()` 함수를 사용합니다.

## 변수

모든 프로그램은 데이터를 저장할 수 있어야 하며, 변수가 바로 이 역할을 돕습니다. Kotlin에서는 다음을 선언할 수 있습니다:

*   `val`을 사용하여 읽기 전용 변수
*   `var`을 사용하여 변경 가능한 변수

> 읽기 전용 변수는 일단 값을 할당하면 변경할 수 없습니다.
>
{style="note"}

값을 할당하려면 할당 연산자 `=`를 사용합니다.

예시:

```kotlin
fun main() { 
//sampleStart
    val popcorn = 5    // There are 5 boxes of popcorn
    val hotdog = 7     // There are 7 hotdogs
    var customers = 10 // There are 10 customers in the queue
    
    // Some customers leave the queue
    customers = 8
    println(customers)
    // 8
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-variables"}

> 변수는 프로그램 시작 시 `main()` 함수 외부에 선언할 수 있습니다. 이렇게 선언된 변수는 **최상위(top level)**에 선언되었다고 합니다.
> 
{style="tip"}

`customers`는 변경 가능한 변수이므로 선언 후 값을 다시 할당할 수 있습니다.

> 기본적으로 모든 변수를 읽기 전용(`val`)으로 선언하는 것을 권장합니다. 정말 필요한 경우에만 변경 가능한 변수(`var`)를 사용하십시오. 그렇게 하면 의도하지 않은 변경을 실수로 저지를 가능성이 줄어듭니다.
> 
{style="note"}

## 문자열 템플릿

변수 내용을 표준 출력에 인쇄하는 방법을 아는 것이 유용합니다. 이는 **문자열 템플릿(string templates)**을 통해 할 수 있습니다. 템플릿 표현식을 사용하여 변수 및 다른 객체에 저장된 데이터에 접근하고 이를 문자열로 변환할 수 있습니다. 문자열 값은 이중 따옴표 `"` 안에 있는 문자 시퀀스입니다. 템플릿 표현식은 항상 달러 기호 `$`로 시작합니다. 템플릿 표현식에서 코드 조각을 평가하려면 달러 기호 `$` 뒤에 중괄호 `{}` 안에 코드를 배치하십시오.

예시:

```kotlin
fun main() { 
//sampleStart
    val customers = 10
    println("There are $customers customers")
    // There are 10 customers
    
    println("There are ${customers + 1} customers")
    // There are 11 customers
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-string-templates"}

자세한 내용은 [문자열 템플릿](strings.md#string-templates)을 참조하십시오.

변수에 대해 어떤 타입도 선언되지 않은 것을 알 수 있습니다. Kotlin은 타입을 직접 추론했습니다: `Int`. 이 투어에서는 [다음 챕터](kotlin-tour-basic-types.md)에서 다양한 Kotlin 기본 타입과 선언 방법을 설명합니다.

## 연습

### 연습 문제 {initial-collapse-state="collapsed" collapsible="true"}

프로그램이 표준 출력에 `"Mary is 20 years old"`를 인쇄하도록 코드를 완성하세요:

|---|---|
```kotlin
fun main() {
    val name = "Mary"
    val age = 20
    // 여기에 코드를 작성하세요
}
```
{validate="false" kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-hello-world-exercise"}

|---|---|
```kotlin
fun main() {
    val name = "Mary"
    val age = 20
    println("$name is $age years old")
}
```
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="예시 솔루션" id="kotlin-tour-hello-world-solution"}

## 다음 단계

[기본 타입](kotlin-tour-basic-types.md)