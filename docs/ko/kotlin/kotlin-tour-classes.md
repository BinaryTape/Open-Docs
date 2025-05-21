---
title: 클래스
---
<no-index/>
:::info
<p>
   <img src="/img/icon-1-done.svg" width="20" alt="First step" /> <a href="kotlin-tour-hello-world">Hello world</a><br />
        <img src="/img/icon-2-done.svg" width="20" alt="Second step" /> <a href="kotlin-tour-basic-types">Basic types</a><br />
        <img src="/img/icon-3-done.svg" width="20" alt="Third step" /> <a href="kotlin-tour-collections">Collections</a><br />
        <img src="/img/icon-4-done.svg" width="20" alt="Fourth step" /> <a href="kotlin-tour-control-flow">Control flow</a><br />
        <img src="/img/icon-5-done.svg" width="20" alt="Fifth step" /> <a href="kotlin-tour-functions">Functions</a><br />
        <img src="/img/icon-6.svg" width="20" alt="Sixth step" /> <strong>Classes</strong><br />
        <img src="/img/icon-7-todo.svg" width="20" alt="Final step" /> <a href="kotlin-tour-null-safety">Null safety</a>
</p>

:::

Kotlin은 클래스와 객체를 사용한 객체 지향 프로그래밍을 지원합니다. 객체는 프로그램에서 데이터를 저장하는 데 유용합니다.
클래스를 사용하면 객체에 대한 특성 집합을 선언할 수 있습니다. 클래스에서 객체를 만들면, 매번 이러한 특성을 선언할 필요가 없으므로
시간과 노력을 절약할 수 있습니다.

클래스를 선언하려면 `class` 키워드를 사용하세요.

```kotlin
class Customer
```

## 속성(Properties)

클래스 객체의 특성은 속성에서 선언할 수 있습니다. 클래스에 대한 속성을 다음과 같이 선언할 수 있습니다.

* 클래스 이름 뒤 괄호 `()` 안에 선언합니다.
```kotlin
class Contact(val id: Int, var email: String)
```

* 중괄호 `{}`로 정의된 클래스 본문 안에 선언합니다.
```kotlin
class Contact(val id: Int, var email: String) {
    val category: String = ""
}
```

클래스의 인스턴스가 생성된 후 변경해야 하는 경우가 아니면 속성을 읽기 전용(`val`)으로 선언하는 것이 좋습니다.

괄호 안에 `val` 또는 `var` 없이 속성을 선언할 수 있지만, 이러한 속성은 인스턴스가 생성된 후에는 액세스할 수 없습니다.

:::note
* 괄호 `()` 안에 포함된 내용을 **클래스 헤더(class header)**라고 합니다.
* 클래스 속성을 선언할 때 [trailing comma](coding-conventions#trailing-commas)를 사용할 수 있습니다.

:::

함수 매개변수와 마찬가지로 클래스 속성에도 기본값을 가질 수 있습니다.
```kotlin
class Contact(val id: Int, var email: String = "example@gmail.com") {
    val category: String = "work"
}
```

## 인스턴스 생성

클래스에서 객체를 생성하려면 **생성자(constructor)**를 사용하여 클래스 **인스턴스(instance)**를 선언합니다.

기본적으로 Kotlin은 클래스 헤더에 선언된 매개변수를 사용하여 생성자를 자동으로 만듭니다.

예를 들어:
```kotlin
class Contact(val id: Int, var email: String)

fun main() {
    val contact = Contact(1, "mary@gmail.com")
}
```

예제에서:

* `Contact`는 클래스입니다.
* `contact`는 `Contact` 클래스의 인스턴스입니다.
* `id` 및 `email`은 속성입니다.
* `id` 및 `email`은 기본 생성자와 함께 사용하여 `contact`를 만듭니다.

Kotlin 클래스는 직접 정의하는 생성자를 포함하여 여러 개의 생성자를 가질 수 있습니다. 여러 생성자를 선언하는 방법에 대한 자세한 내용은 [생성자(Constructors)](classes#constructors)를 참조하세요.

## 속성 접근

인스턴스의 속성에 접근하려면 인스턴스 이름 뒤에 마침표 `.`를 추가하고 속성 이름을 씁니다.

```kotlin
class Contact(val id: Int, var email: String)

fun main() {
    val contact = Contact(1, "mary@gmail.com")
    
    // 속성 email의 값을 출력합니다.
    println(contact.email)           
    // mary@gmail.com

    // 속성 email의 값을 업데이트합니다.
    contact.email = "jane@gmail.com"
    
    // 속성 email의 새 값을 출력합니다.
    println(contact.email)           
    // jane@gmail.com
}
```

:::tip
속성 값을 문자열의 일부로 연결하려면 문자열 템플릿(`)을 사용할 수 있습니다.
예를 들어:
```kotlin
println("Their email address is: ${contact.email}")
```

:::

## 멤버 함수

객체의 특성으로 속성을 선언하는 것 외에도 멤버 함수를 사용하여 객체의 동작을 정의할 수도 있습니다.

Kotlin에서 멤버 함수는 클래스 본문 내에 선언해야 합니다. 인스턴스에서 멤버 함수를 호출하려면 인스턴스 이름 뒤에 마침표 `.`를 추가하고 함수 이름을 씁니다. 예를 들어:

```kotlin
class Contact(val id: Int, var email: String) {
    fun printId() {
        println(id)
    }
}

fun main() {
    val contact = Contact(1, "mary@gmail.com")
    // 멤버 함수 printId()를 호출합니다.
    contact.printId()           
    // 1
}
```

## 데이터 클래스

Kotlin에는 데이터를 저장하는 데 특히 유용한 **데이터 클래스(data classes)**가 있습니다. 데이터 클래스는 클래스와 동일한 기능을 갖지만, 추가 멤버 함수가 자동으로 함께 제공됩니다. 이러한 멤버 함수를 사용하면 인스턴스를 사람이 읽을 수 있는 출력으로 쉽게 출력하고, 클래스의 인스턴스를 비교하고, 인스턴스를 복사하는 등의 작업을 수행할 수 있습니다. 이러한 함수는 자동으로 사용할 수 있으므로 각 클래스에 대해 동일한 상용구 코드를 작성하는 데 시간을 할애할 필요가 없습니다.

데이터 클래스를 선언하려면 `data` 키워드를 사용하세요.

```kotlin
data class User(val name: String, val id: Int)
```

데이터 클래스의 가장 유용한 미리 정의된 멤버 함수는 다음과 같습니다.

| **함수(Function)**       | **설명(Description)**                                                                     |
|--------------------|------------------------------------------------------------------------------------------|
| `toString()`       | 클래스 인스턴스 및 해당 속성의 사람이 읽을 수 있는 문자열을 출력합니다.                                   |
| `equals()` or `==` | 클래스의 인스턴스를 비교합니다.                                                               |
| `copy()`           | 다른 클래스 인스턴스를 복사하여 클래스 인스턴스를 만들고, 잠재적으로 일부 다른 속성을 가질 수 있습니다.                   |

각 함수를 사용하는 방법에 대한 예는 다음 섹션을 참조하세요.

* [문자열로 출력(Print as string)](#print-as-string)
* [인스턴스 비교(Compare instances)](#compare-instances)
* [인스턴스 복사(Copy instance)](#copy-instance)

### 문자열로 출력

클래스 인스턴스의 사람이 읽을 수 있는 문자열을 출력하려면 `toString()` 함수를 명시적으로 호출하거나, `toString()`을 자동으로 호출하는 출력 함수(`println()` 및 `print()`)를 사용합니다.

```kotlin
data class User(val name: String, val id: Int)

fun main() {

    val user = User("Alex", 1)
    
    // toString() 함수를 자동으로 사용하여 출력을 읽기 쉽게 만듭니다.
    println(user)            
    // User(name=Alex, id=1)

}
```

이는 디버깅하거나 로그를 생성할 때 특히 유용합니다.

### 인스턴스 비교

데이터 클래스 인스턴스를 비교하려면 동등 연산자 `==`를 사용합니다.

```kotlin
data class User(val name: String, val id: Int)

fun main() {

    val user = User("Alex", 1)
    val secondUser = User("Alex", 1)
    val thirdUser = User("Max", 2)

    // user를 secondUser와 비교합니다.
    println("user == secondUser: ${user == secondUser}") 
    // user == secondUser: true
    
    // user를 thirdUser와 비교합니다.
    println("user == thirdUser: ${user == thirdUser}")   
    // user == thirdUser: false

}
```

### 인스턴스 복사

데이터 클래스 인스턴스의 정확한 복사본을 만들려면 인스턴스에서 `copy()` 함수를 호출합니다.

데이터 클래스 인스턴스의 복사본을 만들 **고** 일부 속성을 변경하려면 인스턴스에서 `copy()` 함수를 호출 **하고** 함수 매개변수로 속성에 대한 대체 값을 추가합니다.

예를 들어:

```kotlin
data class User(val name: String, val id: Int)

fun main() {

    val user = User("Alex", 1)

    // user의 정확한 복사본을 만듭니다.
    println(user.copy())       
    // User(name=Alex, id=1)

    // name이 "Max"인 user의 복사본을 만듭니다.
    println(user.copy("Max"))  
    // User(name=Max, id=1)

    // id가 3인 user의 복사본을 만듭니다.
    println(user.copy(id = 3)) 
    // User(name=Alex, id=3)

}
```

인스턴스의 복사본을 만드는 것이 원본 인스턴스를 수정하는 것보다 더 안전합니다. 복사본과 수행하는 작업에 따라 원본 인스턴스에 의존하는 코드가 영향을 받지 않기 때문입니다.

데이터 클래스에 대한 자세한 내용은 [데이터 클래스(Data classes)](data-classes)를 참조하세요.

이 투어의 마지막 장은 Kotlin의 [null safety](kotlin-tour-null-safety)에 관한 것입니다.

## 연습

### 연습 문제 1

이름과 급여의 두 가지 속성이 있는 데이터 클래스 `Employee`를 정의합니다. 급여 속성은 변경 가능해야 합니다. 그렇지 않으면 연말에 급여 인상을 받을 수 없습니다! `main` 함수는 이 데이터 클래스를 사용하는 방법을 보여줍니다.

|---|---|
```kotlin
// Write your code here

fun main() {
    val emp = Employee("Mary", 20)
    println(emp)
    emp.salary += 10
    println(emp)
}
```

|---|---|
```kotlin
data class Employee(val name: String, var salary: Int)

fun main() {
    val emp = Employee("Mary", 20)
    println(emp)
    emp.salary += 10
    println(emp)
}
```

### 연습 문제 2

이 코드를 컴파일하는 데 필요한 추가 데이터 클래스를 선언합니다.

|---|---|
```kotlin
data class Person(val name: Name, val address: Address, val ownsAPet: Boolean = true)
// Write your code here
// data class Name(...)

fun main() {
    val person = Person(
        Name("John", "Smith"),
        Address("123 Fake Street", City("Springfield", "US")),
        ownsAPet = false
    )
}
```

|---|---|
```kotlin
data class Person(val name: Name, val address: Address, val ownsAPet: Boolean = true)
data class Name(val first: String, val last: String)
data class Address(val street: String, val city: City)
data class City(val name: String, val countryCode: String)

fun main() {
    val person = Person(
        Name("John", "Smith"),
        Address("123 Fake Street", City("Springfield", "US")),
        ownsAPet = false
    )
}
```

### 연습 문제 3

코드를 테스트하려면 임의의 직원을 만들 수 있는 생성기가 필요합니다. 잠재적인 이름의 고정 목록(클래스 본문 내부)이 있는 `RandomEmployeeGenerator` 클래스를 정의합니다. 최소 및 최대 급여(클래스 헤더 내부)로 클래스를 구성합니다. 클래스 본문에서 `generateEmployee()` 함수를 정의합니다. 다시 한번, `main` 함수는 이 클래스를 사용하는 방법을 보여줍니다.

> 이 연습에서는 [`Random.nextInt()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.random/-random/next-int.html) 함수를 사용할 수 있도록 패키지를 가져옵니다.
> 패키지 가져오기에 대한 자세한 내용은 [패키지 및 가져오기(Packages and imports)](packages)를 참조하세요.
>

<h3>힌트 1</h3>
        목록에는 목록 내에서 임의의 항목을 반환하는 <a href="https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/random.html">`.random()`</a>이라는 확장 함수가 있습니다.
<h3>힌트 2</h3>
        `Random.nextInt(from = ..., until = ...)`는 지정된 제한 내에서 임의의 `Int` 숫자를 제공합니다.
    

|---|---|
```kotlin
import kotlin.random.Random

data class Employee(val name: String, var salary: Int)

// Write your code here

fun main() {
    val empGen = RandomEmployeeGenerator(10, 30)
    println(empGen.generateEmployee())
    println(empGen.generateEmployee())
    println(empGen.generateEmployee())
    empGen.minSalary = 50
    empGen.maxSalary = 100
    println(empGen.generateEmployee())
}
```

|---|---|
```kotlin
import kotlin.random.Random

data class Employee(val name: String, var salary: Int)

class RandomEmployeeGenerator(var minSalary: Int, var maxSalary: Int) {
    val names = listOf("John", "Mary", "Ann", "Paul", "Jack", "Elizabeth")
    fun generateEmployee() =
        Employee(names.random(),
            Random.nextInt(from = minSalary, until = maxSalary))
}

fun main() {
    val empGen = RandomEmployeeGenerator(10, 30)
    println(empGen.generateEmployee())
    println(empGen.generateEmployee())
    println(empGen.generateEmployee())
    empGen.minSalary = 50
    empGen.maxSalary = 100
    println(empGen.generateEmployee())
}
```

## 다음 단계

[Null safety](kotlin-tour-null-safety)