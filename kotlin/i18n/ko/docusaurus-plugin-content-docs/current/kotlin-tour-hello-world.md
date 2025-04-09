---
title: "Hello world"
---
<no-index/>

:::info
<p>
   <img src="/img/icon-1.svg" width="20" alt="First step" /> <strong>Hello world</strong><br />
        <img src="/img/icon-2-todo.svg" width="20" alt="Second step" /> <a href="kotlin-tour-basic-types">Basic types</a><br />
        <img src="/img/icon-3-todo.svg" width="20" alt="Third step" /> <a href="kotlin-tour-collections">Collections</a><br />
        <img src="/img/icon-4-todo.svg" width="20" alt="Fourth step" /> <a href="kotlin-tour-control-flow">Control flow</a><br />
        <img src="/img/icon-5-todo.svg" width="20" alt="Fifth step" /> <a href="kotlin-tour-functions">Functions</a><br />
        <img src="/img/icon-6-todo.svg" width="20" alt="Sixth step" /> <a href="kotlin-tour-classes">Classes</a><br />
        <img src="/img/icon-7-todo.svg" width="20" alt="Final step" /> <a href="kotlin-tour-null-safety">Null safety</a>
</p>

:::

다음은 "Hello, world!"를 출력하는 간단한 프로그램입니다.

```kotlin
fun main() {
    println("Hello, world!")
    // Hello, world!
}
```

Kotlin에서는 다음과 같습니다.

* `fun`은 함수를 선언하는 데 사용됩니다.
* `main()` 함수는 프로그램이 시작되는 위치입니다.
* 함수의 본문은 중괄호 `{}` 안에 작성됩니다.
* [`println()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.io/println.html) 및 [`print()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.io/print.html) 함수는 인수를 표준 출력으로 출력합니다.

함수는 특정 작업을 수행하는 명령어 집합입니다. 함수를 생성한 후에는 명령어를 다시 작성할 필요 없이 해당 작업을 수행해야 할 때마다 사용할 수 있습니다. 함수에 대해서는 여러 장에서 더 자세히 설명합니다. 그때까지 모든 예제는 `main()` 함수를 사용합니다.

## 변수

모든 프로그램은 데이터를 저장할 수 있어야 하며 변수는 이를 수행하는 데 도움이 됩니다. Kotlin에서는 다음을 선언할 수 있습니다.

* `val`을 사용한 읽기 전용 변수
* `var`을 사용한 변경 가능한 변수

:::note
값을 지정한 후에는 읽기 전용 변수를 변경할 수 없습니다.

:::

값을 할당하려면 할당 연산자 `=`를 사용합니다.

예를 들어:

```kotlin
fun main() { 

    val popcorn = 5    // 팝콘 상자가 5개 있습니다.
    val hotdog = 7     // 핫도그가 7개 있습니다.
    var customers = 10 // 대기열에 10명의 고객이 있습니다.
    
    // 일부 고객이 대기열을 떠납니다.
    customers = 8
    println(customers)
    // 8

}
```

변수는 프로그램 시작 시 `main()` 함수 외부에서 선언할 수 있습니다. 이러한 방식으로 선언된 변수를 **최상위 레벨**에서 선언되었다고 합니다.

`customers`는 변경 가능한 변수이므로 선언 후 값을 다시 할당할 수 있습니다.

기본적으로 모든 변수를 읽기 전용(`val`)으로 선언하는 것이 좋습니다. 필요한 경우에만 변경 가능한 변수(`var`)를 선언하십시오.

:::

## 문자열 템플릿

변수의 내용을 표준 출력으로 출력하는 방법을 알아두면 유용합니다. **문자열 템플릿**을 사용하여 이 작업을 수행할 수 있습니다. 템플릿 식을 사용하여 변수 및 기타 객체에 저장된 데이터에 액세스하고 문자열로 변환할 수 있습니다. 문자열 값은 큰따옴표 `"`로 묶인 문자 시퀀스입니다. 템플릿 식은 항상 달러 기호 `$`로 시작합니다.

템플릿 식에서 코드 조각을 평가하려면 달러 기호 `$` 뒤에 중괄호 `{}` 안에 코드를 넣으십시오.

예를 들어:

```kotlin
fun main() { 

    val customers = 10
    println("There are $customers customers")
    // There are 10 customers
    
    println("There are ${customers + 1} customers")
    // There are 11 customers

}
```

자세한 내용은 [문자열 템플릿](strings#string-templates)을 참조하십시오.

변수에 선언된 유형이 없다는 것을 알 수 있습니다. Kotlin은 유형 자체인 `Int`를 유추했습니다. 이 둘러보기에서는 다양한 Kotlin 기본 유형과 [다음 장](kotlin-tour-basic-types)에서 선언하는 방법을 설명합니다.

## 연습

### 연습

프로그램이 표준 출력에 `"Mary is 20 years old"`를 출력하도록 코드를 완성하십시오.

|---|---|
```kotlin
fun main() {
    val name = "Mary"
    val age = 20
    // 여기에 코드를 작성하십시오.
}
```

|---|---|
```kotlin
fun main() {
    val name = "Mary"
    val age = 20
    println("$name is $age years old")
}
```

## 다음 단계

[기본 유형](kotlin-tour-basic-types)
```