[//]: # (title: 데이터 클래스)

코틀린의 데이터 클래스는 주로 데이터를 담기 위해 사용됩니다. 각 데이터 클래스에 대해 컴파일러는 인스턴스를 읽기 쉬운 형태로 출력하고, 인스턴스를 비교하고, 복사하는 등 추가적인 멤버 함수를 자동으로 생성합니다.
데이터 클래스는 `data`로 표시됩니다:

```kotlin
data class User(val name: String, val age: Int)
```

컴파일러는 주 생성자에 선언된 모든 프로퍼티로부터 다음 멤버를 자동으로 파생시킵니다:

*   `equals()`/`hashCode()` 쌍.
*   `"User(name=John, age=42)"` 형태의 `toString()`.
*   선언 순서에 따라 프로퍼티에 해당하는 [`componentN()` 함수](destructuring-declarations.md).
*   `copy()` 함수 (아래 참조).

생성된 코드의 일관성과 의미 있는 동작을 보장하기 위해 데이터 클래스는 다음 요구 사항을 충족해야 합니다:

*   주 생성자는 최소 하나의 매개변수를 가져야 합니다.
*   모든 주 생성자 매개변수는 `val` 또는 `var`로 표시되어야 합니다.
*   데이터 클래스는 `abstract`, `open`, `sealed`, `inner`가 될 수 없습니다.

또한, 데이터 클래스 멤버의 생성은 멤버의 상속과 관련하여 다음 규칙을 따릅니다:

*   데이터 클래스 본문에 `equals()`, `hashCode()`, `toString()`에 대한 명시적 구현이 있거나 슈퍼클래스에 `final` 구현이 있는 경우, 이 함수들은 생성되지 않으며 기존 구현이 사용됩니다.
*   슈퍼타입에 `open`이고 호환 가능한 타입을 반환하는 `componentN()` 함수가 있는 경우, 해당 함수는 데이터 클래스에 대해 생성되고 슈퍼타입의 함수를 오버라이드합니다. 호환되지 않는 시그니처 또는 `final`이기 때문에 슈퍼타입의 함수를 오버라이드할 수 없는 경우, 오류가 보고됩니다.
*   `componentN()` 및 `copy()` 함수에 대한 명시적 구현을 제공하는 것은 허용되지 않습니다.

데이터 클래스는 다른 클래스를 확장할 수 있습니다 (예시는 [Sealed classes](sealed-classes.md)를 참조하세요).

> JVM에서는 생성된 클래스가 매개변수 없는 생성자를 필요로 하는 경우, 프로퍼티에 대한 기본값을 지정해야 합니다 ([Constructors](classes.md#constructors) 참조):
> 
> ```kotlin
> data class User(val name: String = "", val age: Int = 0)
> ```
>
{style="note"}

## 클래스 본문에 선언된 프로퍼티

컴파일러는 자동으로 생성되는 함수에 대해 주 생성자 내에 정의된 프로퍼티만 사용합니다. 생성된 구현에서 프로퍼티를 제외하려면 클래스 본문 내에 선언하십시오:

```kotlin
data class Person(val name: String) {
    var age: Int = 0
}
```

아래 예제에서는 기본적으로 `toString()`, `equals()`, `hashCode()`, `copy()` 구현 내에서 `name` 프로퍼티만 사용되며, `component1()`이라는 하나의 컴포넌트 함수만 있습니다.
`age` 프로퍼티는 클래스 본문 내에 선언되어 제외됩니다.
따라서 `equals()`는 주 생성자의 프로퍼티만 평가하므로, `name`은 같지만 `age` 값이 다른 두 `Person` 객체는 동일하게 간주됩니다:

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

## 복사

`copy()` 함수를 사용하여 객체를 복사하고, _일부_ 프로퍼티는 변경하면서 나머지는 그대로 유지할 수 있습니다.
위 `User` 클래스에 대한 이 함수의 구현은 다음과 같습니다:

```kotlin
fun copy(name: String = this.name, age: Int = this.age) = User(name, age)
```

그러면 다음과 같이 작성할 수 있습니다:

```kotlin
val jack = User(name = "Jack", age = 1)
val olderJack = jack.copy(age = 2)
```

## 데이터 클래스와 구조 분해 선언

데이터 클래스에 대해 생성된 _컴포넌트 함수_는 이를 [구조 분해 선언](destructuring-declarations.md)에서 사용하는 것을 가능하게 합니다:

```kotlin
val jane = User("Jane", 35)
val (name, age) = jane
println("$name, $age years of age") 
// Jane, 35 years of age
```

## 표준 데이터 클래스

표준 라이브러리는 `Pair` 및 `Triple` 클래스를 제공합니다. 하지만 대부분의 경우, 명명된 데이터 클래스는 프로퍼티에 의미 있는 이름을 제공하여 코드를 더 읽기 쉽게 만들기 때문에 더 나은 설계 선택입니다.