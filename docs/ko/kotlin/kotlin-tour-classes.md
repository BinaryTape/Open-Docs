[//]: # (title: 클래스)

<no-index/>

<tldr>
    <p><img src="icon-1-done.svg" width="20" alt="첫 번째 단계" /> <a href="kotlin-tour-hello-world.md">Hello world</a><br />
        <img src="icon-2-done.svg" width="20" alt="두 번째 단계" /> <a href="kotlin-tour-basic-types.md">기본 타입</a><br />
        <img src="icon-3-done.svg" width="20" alt="세 번째 단계" /> <a href="kotlin-tour-collections.md">컬렉션</a><br />
        <img src="icon-4-done.svg" width="20" alt="네 번째 단계" /> <a href="kotlin-tour-control-flow.md">제어 흐름</a><br />
        <img src="icon-5-done.svg" width="20" alt="다섯 번째 단계" /> <a href="kotlin-tour-functions.md">함수</a><br />
        <img src="icon-6.svg" width="20" alt="여섯 번째 단계" /> <strong>클래스</strong><br />
        <img src="icon-7-todo.svg" width="20" alt="마지막 단계" /> <a href="kotlin-tour-null-safety.md">널 안전성</a></p>
</tldr>

코틀린은 클래스와 객체를 사용하여 객체 지향 프로그래밍을 지원합니다. 객체는 프로그램에서 데이터를 저장하는 데 유용합니다.
클래스를 사용하면 객체에 대한 특성 집합을 선언할 수 있습니다. 클래스로부터 객체를 생성할 때, 매번 이러한 특성을 선언할 필요가 없으므로
시간과 노력을 절약할 수 있습니다.

클래스를 선언하려면 `class` 키워드를 사용하세요:

```kotlin
class Customer
```

## 프로퍼티

클래스 객체의 특성은 프로퍼티에 선언할 수 있습니다. 클래스의 프로퍼티는 다음과 같이 선언할 수 있습니다:

* 클래스 이름 뒤 괄호 `()` 안에.
```kotlin
class Contact(val id: Int, var email: String)
```

* 중괄호 `{}`로 정의된 클래스 본문 안에.
```kotlin
class Contact(val id: Int, var email: String) {
    val category: String = ""
}
```

클래스의 인스턴스가 생성된 후 변경할 필요가 없다면 프로퍼티를 읽기 전용(`val`)으로 선언하는 것을 권장합니다.

괄호 안에 `val` 또는 `var` 없이 프로퍼티를 선언할 수도 있지만, 이러한 프로퍼티는 인스턴스가 생성된 후 접근할 수 없습니다.

> * 괄호 `()` 안에 포함된 내용은 **클래스 헤더 (class header)**라고 불립니다.
> * 클래스 프로퍼티를 선언할 때 [후행 쉼표 (trailing comma)](coding-conventions.md#trailing-commas)를 사용할 수 있습니다.
>
{style="note"}

함수 파라미터와 마찬가지로, 클래스 프로퍼티는 기본값을 가질 수 있습니다:
```kotlin
class Contact(val id: Int, var email: String = "example@gmail.com") {
    val category: String = "work"
}
```

## 인스턴스 생성

클래스로부터 객체를 생성하려면 **생성자 (constructor)**를 사용하여 클래스 **인스턴스 (instance)**를 선언합니다.

기본적으로 코틀린은 클래스 헤더에 선언된 파라미터로 생성자를 자동으로 생성합니다.

예시:
```kotlin
class Contact(val id: Int, var email: String)

fun main() {
    val contact = Contact(1, "mary@gmail.com")
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-class-create-instance"}

예시에서:

* `Contact`는 클래스입니다.
* `contact`는 `Contact` 클래스의 인스턴스입니다.
* `id`와 `email`은 프로퍼티입니다.
* `id`와 `email`은 기본 생성자와 함께 사용하여 `contact`를 생성합니다.

코틀린 클래스는 직접 정의하는 생성자를 포함하여 여러 생성자를 가질 수 있습니다. 여러 생성자를 선언하는 방법에 대한 자세한 내용은 [생성자 (Constructors)](classes.md#constructors)를 참조하세요.

## 프로퍼티 접근

인스턴스의 프로퍼티에 접근하려면 인스턴스 이름 뒤에 마침표 `.`를 붙여 프로퍼티 이름을 작성합니다:

```kotlin
class Contact(val id: Int, var email: String)

fun main() {
    val contact = Contact(1, "mary@gmail.com")
    
    // 프로퍼티: email의 값을 출력합니다.
    println(contact.email)           
    // mary@gmail.com

    // 프로퍼티: email의 값을 업데이트합니다.
    contact.email = "jane@gmail.com"
    
    // 프로퍼티: email의 새 값을 출력합니다.
    println(contact.email)           
    // jane@gmail.com
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-access-property"}

> 프로퍼티의 값을 문자열의 일부로 연결하려면 문자열 템플릿 (` `)을 사용할 수 있습니다.
> 예시:
> ```kotlin
> println("Their email address is: ${contact.email}")
> ```
>
{style="tip"}

## 멤버 함수

객체의 특성으로 프로퍼티를 선언하는 것 외에도, 멤버 함수로 객체의 동작을 정의할 수 있습니다.

코틀린에서 멤버 함수는 클래스 본문 안에 선언되어야 합니다. 인스턴스에서 멤버 함수를 호출하려면 인스턴스 이름 뒤에 마침표 `.`를 붙여 함수 이름을 작성합니다. 예시:

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
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-member-function"}

## 데이터 클래스

코틀린에는 특히 데이터를 저장하는 데 유용한 **데이터 클래스 (data classes)**가 있습니다. 데이터 클래스는 일반 클래스와 동일한 기능을 가지지만, 추가적인 멤버 함수를 자동으로 제공합니다. 이러한 멤버 함수를 사용하면 인스턴스를 읽기 쉬운 출력으로 쉽게 출력하고, 클래스의 인스턴스를 비교하고, 인스턴스를 복사하는 등의 작업을 수행할 수 있습니다. 이러한 함수가 자동으로 제공되므로 각 클래스에 대해 동일한 상용구 코드 (boilerplate code)를 작성하는 데 시간을 낭비할 필요가 없습니다.

데이터 클래스를 선언하려면 `data` 키워드를 사용하세요:

```kotlin
data class User(val name: String, val id: Int)
```

데이터 클래스의 가장 유용한 미리 정의된 멤버 함수는 다음과 같습니다:

| **함수**           | **설명**                                                                          |
|--------------------|------------------------------------------------------------------------------------------|
| `toString()`       | 클래스 인스턴스와 해당 프로퍼티의 읽기 쉬운 문자열을 출력합니다.                 |
| `equals()` 또는 `==` | 클래스의 인스턴스를 비교합니다.                                                  |
| `copy()`           | 다른 인스턴스를 복사하여 새로운 클래스 인스턴스를 생성하며, 일부 프로퍼티를 다르게 설정할 수 있습니다. |

각 함수를 사용하는 방법의 예시는 다음 섹션을 참조하세요:

* [문자열로 출력](#print-as-string)
* [인스턴스 비교](#compare-instances)
* [인스턴스 복사](#copy-instance)

### 문자열로 출력

클래스 인스턴스의 읽기 쉬운 문자열을 출력하려면 `toString()` 함수를 명시적으로 호출하거나, 자동으로 `toString()`을 호출해주는 출력 함수 (`println()` 및 `print()`)를 사용할 수 있습니다:

```kotlin
data class User(val name: String, val id: Int)

fun main() {
    //sampleStart
    val user = User("Alex", 1)
    
    // 출력을 읽기 쉽게 하기 위해 toString() 함수를 자동으로 사용합니다.
    println(user)            
    // User(name=Alex, id=1)
    //sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-data-classes-print-string"}

이것은 디버깅이나 로그를 생성할 때 특히 유용합니다.

### 인스턴스 비교

데이터 클래스 인스턴스를 비교하려면 동등 연산자 `==`를 사용하세요:

```kotlin
data class User(val name: String, val id: Int)

fun main() {
    //sampleStart
    val user = User("Alex", 1)
    val secondUser = User("Alex", 1)
    val thirdUser = User("Max", 2)

    // user를 secondUser와 비교합니다.
    println("user == secondUser: ${user == secondUser}") 
    // user == secondUser: true
    
    // user를 thirdUser와 비교합니다.
    println("user == thirdUser: ${user == thirdUser}")   
    // user == thirdUser: false
    //sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-data-classes-compare-instances"}

### 인스턴스 복사

데이터 클래스 인스턴스의 정확한 복사본을 생성하려면 해당 인스턴스에서 `copy()` 함수를 호출하세요.

데이터 클래스 인스턴스의 복사본을 생성하고 일부 프로퍼티를 변경하려면, 해당 인스턴스에서 `copy()` 함수를 호출하고 함수 파라미터로 프로퍼티의 대체 값을 추가하세요.

예시:

```kotlin
data class User(val name: String, val id: Int)

fun main() {
    //sampleStart
    val user = User("Alex", 1)

    // user의 정확한 복사본을 생성합니다.
    println(user.copy())       
    // User(name=Alex, id=1)

    // 이름이 "Max"인 user의 복사본을 생성합니다.
    println(user.copy("Max"))  
    // User(name=Max, id=1)

    // ID가 3인 user의 복사본을 생성합니다.
    println(user.copy(id = 3)) 
    // User(name=Alex, id=3)
    //sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-data-classes-copy-instance"}

인스턴스의 복사본을 생성하는 것은 원본 인스턴스를 수정하는 것보다 안전합니다. 왜냐하면 원본 인스턴스에 의존하는 코드가 복사본과 그에 대한 작업에 영향을 받지 않기 때문입니다.

데이터 클래스에 대한 자세한 내용은 [데이터 클래스 (Data classes)](data-classes.md)를 참조하세요.

이 투어의 마지막 챕터는 코틀린의 [널 안전성 (null safety)](kotlin-tour-null-safety.md)에 대한 내용입니다.

## 연습

### 연습 문제 1 {initial-collapse-state="collapsed" collapsible="true"}

`Employee` 데이터 클래스를 정의하고, 이름과 급여라는 두 가지 프로퍼티를 포함하세요. 급여 프로퍼티가 변경 가능하도록 (mutable) 설정했는지 확인하세요. 그렇지 않으면 연말에 급여 인상을 받지 못할 것입니다! `main` 함수는 이 데이터 클래스를 사용하는 방법을 보여줍니다.

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
{validate="false" kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-classes-exercise-1"}

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
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="예시 솔루션" id="kotlin-tour-classes-solution-1"}

### 연습 문제 2 {initial-collapse-state="collapsed" collapsible="true"}

이 코드가 컴파일되는 데 필요한 추가 데이터 클래스를 선언하세요.

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
{validate="false" kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-classes-exercise-2"}

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
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="예시 솔루션" id="kotlin-tour-classes-solution-2"}

### 연습 문제 3 {initial-collapse-state="collapsed" collapsible="true"}

코드를 테스트하려면 무작위 직원을 생성할 수 있는 생성기가 필요합니다. `RandomEmployeeGenerator` 클래스를 정의하고, 가능한 이름의 고정 목록 (클래스 본문 안에)을 포함하세요. 클래스를 최소 및 최대 급여 (클래스 헤더 안에)로 구성하세요. 클래스 본문 안에 `generateEmployee()` 함수를 정의하세요. 다시 한번, `main` 함수는 이 클래스를 사용하는 방법을 보여줍니다.

> 이 연습에서는 [`Random.nextInt()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.random/-random/next-int.html) 함수를 사용할 수 있도록 패키지를 임포트합니다.
> 패키지 임포트에 대한 자세한 내용은 [패키지 및 임포트 (Packages and imports)](packages.md)를 참조하세요.
>
{style="tip"}

<deflist collapsible="true" id="kotlin-tour-classes-exercise-3-hint-1">
    <def title="힌트 1">
        리스트에는 리스트 내의 무작위 항목을 반환하는 <a href="https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/random.html"><code>.random()</code></a>이라는 확장 함수가 있습니다.
    </def>
</deflist>

<deflist collapsible="true" id="kotlin-tour-classes-exercise-3-hint-2">
    <def title="힌트 2">
        <code>Random.nextInt(from = ..., until = ...)</code>는 지정된 범위 내에서 무작위 <code>Int</code> 숫자를 제공합니다.
    </def>
</deflist>

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
{validate="false" kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-classes-exercise-3"}

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
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="예시 솔루션" id="kotlin-tour-classes-solution-3"}

## 다음 단계

[널 안전성](kotlin-tour-null-safety.md)