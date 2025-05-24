---
title: "데이터 클래스"
---
Kotlin의 데이터 클래스는 주로 데이터를 담는 데 사용됩니다. 각 데이터 클래스에 대해 컴파일러는 인스턴스를 사람이 읽을 수 있는 출력으로 인쇄하고, 인스턴스를 비교하고, 인스턴스를 복사하는 등의 작업을 수행할 수 있는 추가 멤버 함수를 자동으로 생성합니다.
데이터 클래스는 `data`로 표시됩니다.

```kotlin
data class User(val name: String, val age: Int)
```

컴파일러는 기본 생성자에서 선언된 모든 속성에서 다음 멤버를 자동으로 파생합니다.

* `equals()`/`hashCode()` 쌍.
* `"User(name=John, age=42)"` 형태의 `toString()`.
* 선언 순서대로 속성에 해당하는 [`componentN()` 함수](destructuring-declarations).
* `copy()` 함수 (아래 참조).

생성된 코드의 일관성과 의미 있는 동작을 보장하려면 데이터 클래스는 다음 요구 사항을 충족해야 합니다.

* 기본 생성자는 하나 이상의 파라미터를 가져야 합니다.
* 모든 기본 생성자 파라미터는 `val` 또는 `var`로 표시되어야 합니다.
* 데이터 클래스는 `abstract`, `open`, `sealed` 또는 `inner`일 수 없습니다.

또한 데이터 클래스 멤버의 생성은 멤버의 상속과 관련하여 다음 규칙을 따릅니다.

* 데이터 클래스 본문에 `equals()`, `hashCode()`, 또는 `toString()`의 명시적 구현이 있거나 슈퍼클래스에 `final` 구현이 있는 경우 이러한 함수는 생성되지 않고 기존 구현이 사용됩니다.
* 슈퍼타입에 `open`이고 호환 가능한 타입을 반환하는 `componentN()` 함수가 있는 경우 해당 함수는 데이터 클래스에 대해 생성되고 슈퍼타입의 함수를 오버라이드합니다. 호환되지 않는 시그니처 또는 `final`이기 때문에 슈퍼타입의 함수를 오버라이드할 수 없는 경우 오류가 보고됩니다.
* `componentN()` 및 `copy()` 함수에 대한 명시적 구현을 제공하는 것은 허용되지 않습니다.

데이터 클래스는 다른 클래스를 확장할 수 있습니다 (예제는 [Sealed classes](sealed-classes) 참조).

:::note
JVM에서 생성된 클래스가 파라미터 없는 생성자를 가져야 하는 경우 속성에 대한 기본값을 지정해야 합니다 (자세한 내용은 [Constructors](classes#constructors) 참조).

```kotlin
data class User(val name: String = "", val age: Int = 0)
```

:::

## 클래스 본문에 선언된 속성

컴파일러는 자동으로 생성된 함수에 대해 기본 생성자 내부에 정의된 속성만 사용합니다. 생성된 구현에서 속성을 제외하려면 클래스 본문 내부에 선언하십시오.

```kotlin
data class Person(val name: String) {
    var age: Int = 0
}
```

아래 예제에서 `name` 속성만 기본적으로 `toString()`, `equals()`, `hashCode()` 및 `copy()` 구현 내에서 사용되며 하나의 component 함수인 `component1()`만 있습니다. `age` 속성은 클래스 본문 내부에 선언되고 제외됩니다.
따라서 동일한 `name`이지만 다른 `age` 값을 가진 두 개의 `Person` 객체는 `equals()`가 기본 생성자의 속성만 평가하므로 동일한 것으로 간주됩니다.

```kotlin
data class Person(val name: String) {
    var age: Int = 0
}
fun main() {

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

}
```

## 복사

`copy()` 함수를 사용하여 객체를 복사하면 나머지는 변경하지 않고 일부 속성을 변경할 수 있습니다.
위의 `User` 클래스에 대한 이 함수의 구현은 다음과 같습니다.

```kotlin
fun copy(name: String = this.name, age: Int = this.age) = User(name, age)
```

그런 다음 다음을 작성할 수 있습니다.

```kotlin
val jack = User(name = "Jack", age = 1)
val olderJack = jack.copy(age = 2)
```

## 데이터 클래스 및 구조 분해 선언

데이터 클래스에 대해 생성된 _Component 함수_를 사용하면 [구조 분해 선언](destructuring-declarations)에서 사용할 수 있습니다.

```kotlin
val jane = User("Jane", 35)
val (name, age) = jane
println("$name, $age years of age") 
// Jane, 35 years of age
```

## 표준 데이터 클래스

표준 라이브러리는 `Pair` 및 `Triple` 클래스를 제공합니다. 그러나 대부분의 경우 명명된 데이터 클래스는 속성에 의미 있는 이름을 제공하여 코드를 더 쉽게 읽을 수 있도록 하므로 더 나은 디자인 선택입니다.