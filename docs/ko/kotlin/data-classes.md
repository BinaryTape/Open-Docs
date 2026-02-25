[//]: # (title: 데이터 클래스)

Kotlin의 데이터 클래스(Data classes)는 주로 데이터를 보유하는 데 사용됩니다. 컴파일러는 각 데이터 클래스에 대해 인스턴스를 읽기 쉬운 형식으로 출력하거나, 인스턴스를 비교하거나, 인스턴스를 복사하는 등의 작업을 수행할 수 있는 추가 멤버 함수를 자동으로 생성합니다.
데이터 클래스는 `data`로 표시합니다:

```kotlin
data class User(val name: String, val age: Int)
```

컴파일러는 주 생성자(primary constructor)에 선언된 모든 속성으로부터 다음 멤버들을 자동으로 도출합니다:

* `equals()`/`hashCode()` 쌍.
* `"User(name=John, age=42)"` 형태의 `toString()`.
* 선언 순서대로 속성에 대응하는 [`componentN()` 함수들](destructuring-declarations.md).
* `copy()` 함수 (아래 참조).

생성된 코드의 일관성과 의미 있는 동작을 보장하기 위해 데이터 클래스는 다음 요구 사항을 충족해야 합니다:

* 주 생성자에는 적어도 하나의 매개변수가 있어야 합니다.
* 모든 주 생성자 매개변수는 `val` 또는 `var`로 표시되어야 합니다.
* 데이터 클래스는 `abstract`, `open`, `sealed`, 또는 `inner` 클래스일 수 없습니다.

또한, 데이터 클래스 멤버의 생성은 멤버의 상속과 관련하여 다음 규칙을 따릅니다:

* 데이터 클래스 본문에 `equals()`, `hashCode()`, 또는 `toString()`의 명시적인 구현이 있거나 상위 클래스에 `final` 구현이 있는 경우, 이러한 함수는 생성되지 않으며 기존 구현이 사용됩니다.
* 상위 타입에 `open`이고 호환 가능한 타입을 반환하는 `componentN()` 함수가 있는 경우, 데이터 클래스에 대해 해당 함수가 생성되어 상위 타입의 함수를 재정의(override)합니다. 호환되지 않는 시그니처나 `final` 선언으로 인해 상위 타입의 함수를 재정의할 수 없는 경우 오류가 보고됩니다.
* `componentN()` 및 `copy()` 함수에 대해 명시적인 구현을 제공하는 것은 허용되지 않습니다.

데이터 클래스는 다른 클래스를 확장(extend)할 수 있습니다 (예시는 [봉인된 클래스(Sealed classes)](sealed-classes.md)를 참조하세요).

> JVM에서 생성된 클래스에 매개변수가 없는 생성자가 필요한 경우, 속성에 대한 기본값을 지정해야 합니다 ([생성자](classes.md#constructors-and-initializer-blocks) 참조):
> 
> ```kotlin
> data class User(val name: String = "", val age: Int = 0)
> ```
>
{style="note"}

## 클래스 본문에 선언된 속성

컴파일러는 자동으로 생성되는 함수를 위해 주 생성자 내부에 정의된 속성만 사용합니다. 생성된 구현에서 속성을 제외하려면 클래스 본문 내부에 선언하세요:

```kotlin
data class Person(val name: String) {
    var age: Int = 0
}
```

아래 예제에서 `toString()`, `equals()`, `hashCode()`, 그리고 `copy()` 구현에는 기본적으로 `name` 속성만 사용되며, 컴포넌트 함수도 `component1()` 하나만 존재합니다. `age` 속성은 클래스 본문 내부에 선언되었으므로 제외됩니다.
따라서 `name`은 같지만 `age` 값이 다른 두 `Person` 객체는 동일한 것으로 간주됩니다. `equals()`는 주 생성자의 속성만 평가하기 때문입니다:

```kotlin
data class Person(val name: String) {
    var age: Int = 0
}
fun main() {
//sampleStart
    val person1 = Person("John")
    val person2 = Person("John")
    person1.age = 10
    person2.age = 20

    println("person1 == person2: ${person1 == person2}")
    // person1 == person2: true
  
    println("person1 with age ${person1.age}: ${person1}")
    // person1 with age 10: Person(name=John)
  
    println("person2 with age ${person2.age}: ${person2}")
    // person2 with age 20: Person(name=John)
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

## 복사하기

`copy()` 함수를 사용하면 객체의 나머지 속성은 그대로 유지하면서 *일부* 속성만 변경하여 객체를 복사할 수 있습니다. 위 `User` 클래스에 대한 이 함수의 구현은 다음과 같습니다:

```kotlin
fun copy(name: String = this.name, age: Int = this.age) = User(name, age)
```

그러면 다음과 같이 작성할 수 있습니다:

```kotlin
val jack = User(name = "Jack", age = 1)
val olderJack = jack.copy(age = 2)
```

`copy()` 함수는 인스턴스의 *얕은 복사(shallow copy)*를 수행합니다. 즉, 컴포넌트를 재귀적으로 복사하지 않습니다. 결과적으로 다른 객체에 대한 참조는 공유됩니다.

예를 들어, 속성이 가변 리스트(mutable list)를 보유하고 있다면, "원본" 값을 통해 변경한 내용은 복사본을 통해서도 볼 수 있으며, 복사본을 통해 변경한 내용도 원본을 통해 볼 수 있습니다:

```kotlin
data class Employee(val name: String, val roles: MutableList<String>)

fun main() {
    val original = Employee("Jamie", mutableListOf("developer"))
    val duplicate = original.copy()

    duplicate.roles.add("team lead")

    println(original) 
    // Employee(name=Jamie, roles=[developer, team lead])
    println(duplicate) 
    // Employee(name=Jamie, roles=[developer, team lead])
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

보시는 것처럼 `duplicate.roles` 속성을 수정하면 `original.roles` 속성도 변경됩니다. 두 속성이 동일한 리스트 참조를 공유하기 때문입니다.

## 데이터 클래스와 구조 분해 선언

데이터 클래스에 대해 생성된 *컴포넌트 함수(Component functions)*를 사용하면 [구조 분해 선언(destructuring declarations)](destructuring-declarations.md)에서 데이터 클래스를 사용할 수 있습니다:

```kotlin
val jane = User("Jane", 35)
val (name, age) = jane
println("$name, $age years of age") 
// Jane, 35 years of age
```

## 표준 데이터 클래스

표준 라이브러리는 `Pair`와 `Triple` 클래스를 제공합니다. 하지만 대부분의 경우, 이름이 지정된 데이터 클래스가 더 나은 디자인 선택입니다. 속성에 의미 있는 이름을 제공하여 코드를 더 읽기 쉽게 만들기 때문입니다.