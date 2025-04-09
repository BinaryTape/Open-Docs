---
title: 클래스
---
Kotlin에서 클래스는 `class` 키워드를 사용하여 선언합니다.

```kotlin
class Person { /*...*/ }
```

클래스 선언은 클래스 이름, 클래스 헤더(타입 매개변수, 주 생성자, 기타 사항 지정), 중괄호로 묶인 클래스 본문으로 구성됩니다. 헤더와 본문은 모두 선택 사항입니다. 클래스에 본문이 없으면 중괄호를 생략할 수 있습니다.

```kotlin
class Empty
```

## 생성자

Kotlin의 클래스에는 _주 생성자(primary constructor)_ 와 하나 이상의 _부 생성자(secondary constructor)_ 가 있을 수 있습니다. 주 생성자는 클래스 헤더에 선언되며 클래스 이름과 선택적 타입 매개변수 뒤에 옵니다.

```kotlin
class Person constructor(firstName: String) { /*...*/ }
```

주 생성자에 어노테이션 또는 가시성 수정자가 없는 경우 `constructor` 키워드를 생략할 수 있습니다.

```kotlin
class Person(firstName: String) { /*...*/ }
```

주 생성자는 클래스 인스턴스와 해당 속성을 클래스 헤더에서 초기화합니다. 클래스 헤더에는 실행 가능한 코드가 포함될 수 없습니다. 객체 생성 중에 코드를 실행하려면 클래스 본문 내에서 _초기화 블록(initializer blocks)_ 을 사용하십시오. 초기화 블록은 `init` 키워드 뒤에 중괄호로 선언됩니다. 중괄호 안에 실행하려는 코드를 작성하십시오.

인스턴스 초기화 동안 초기화 블록은 클래스 본문에 나타나는 순서대로 속성 초기화와 함께 실행됩니다.

```kotlin

class InitOrderDemo(name: String) {
    val firstProperty = "First property: $name".also(::println)
    
    init {
        println("First initializer block that prints $name")
    }
    
    val secondProperty = "Second property: ${name.length}".also(::println)
    
    init {
        println("Second initializer block that prints ${name.length}")
    }
}

fun main() {
    InitOrderDemo("hello")
}
```

주 생성자 매개변수는 초기화 블록에서 사용할 수 있습니다. 또한 클래스 본문에 선언된 속성 초기화에서도 사용할 수 있습니다.

```kotlin
class Customer(name: String) {
    val customerKey = name.uppercase()
}
```

Kotlin은 속성을 선언하고 주 생성자에서 초기화하는 간결한 구문을 제공합니다.

```kotlin
class Person(val firstName: String, val lastName: String, var age: Int)
```

이러한 선언에는 클래스 속성의 기본값을 포함할 수도 있습니다.

```kotlin
class Person(val firstName: String, val lastName: String, var isEmployed: Boolean = true)
```

클래스 속성을 선언할 때 [후행 쉼표](coding-conventions#trailing-commas)를 사용할 수 있습니다.

```kotlin
class Person(
    val firstName: String,
    val lastName: String,
    var age: Int, // trailing comma
) { /*...*/ }
```

일반 속성과 마찬가지로 주 생성자에 선언된 속성은 변경 가능(`var`)하거나 읽기 전용(`val`)일 수 있습니다.

생성자에 어노테이션 또는 가시성 수정자가 있는 경우 `constructor` 키워드가 필요하며 수정자는 앞에 와야 합니다.

```kotlin
class Customer public @Inject constructor(name: String) { /*...*/ }
```

[가시성 수정자](visibility-modifiers#constructors)에 대해 자세히 알아보십시오.

### 부 생성자

클래스는 `constructor`로 시작하는 _부 생성자(secondary constructors)_ 를 선언할 수도 있습니다.

```kotlin
class Person(val pets: MutableList<Pet> = mutableListOf())

class Pet {
    constructor(owner: Person) {
        owner.pets.add(this) // adds this pet to the list of its owner's pets
    }
}
```

클래스에 주 생성자가 있는 경우 각 부 생성자는 주 생성자에게 직접 또는 다른 부 생성자를 통해 간접적으로 위임해야 합니다. 동일한 클래스의 다른 생성자에게 위임하는 것은 `this` 키워드를 사용하여 수행됩니다.

```kotlin
class Person(val name: String) {
    val children: MutableList<Person> = mutableListOf()
    constructor(name: String, parent: Person) : this(name) {
        parent.children.add(this)
    }
}
```

초기화 블록의 코드는 사실상 주 생성자의 일부가 됩니다. 주 생성자에게 위임하는 것은 부 생성자의 첫 번째 명령문에 액세스하는 시점에 발생하므로 모든 초기화 블록과 속성 초기화의 코드는 부 생성자의 본문 전에 실행됩니다.

클래스에 주 생성자가 없더라도 위임은 여전히 암시적으로 발생하며 초기화 블록은 여전히 실행됩니다.

```kotlin

class Constructors {
    init {
        println("Init block")
    }

    constructor(i: Int) {
        println("Constructor $i")
    }
}

fun main() {
    Constructors(1)
}
```

비추상 클래스가 생성자(주 또는 부)를 선언하지 않으면 인수가 없는 생성된 주 생성자를 갖게 됩니다. 생성자의 가시성은 public입니다.

클래스가 public 생성자를 갖지 않도록 하려면 기본 가시성이 아닌 빈 주 생성자를 선언하십시오.

```kotlin
class DontCreateMe private constructor() { /*...*/ }
```

:::note
JVM에서 주 생성자 매개변수가 모두 기본값을 갖는 경우 컴파일러는 기본값을 사용하는 추가적인 매개변수 없는 생성자를 생성합니다. 이를 통해 매개변수 없는 생성자를 통해 클래스 인스턴스를 생성하는 Jackson 또는 JPA와 같은 라이브러리와 함께 Kotlin을 더 쉽게 사용할 수 있습니다.

```kotlin
class Customer(val customerName: String = "")
```

:::

## 클래스 인스턴스 생성

클래스의 인스턴스를 생성하려면 일반 함수인 것처럼 생성자를 호출하십시오. 생성된 인스턴스를 [변수](basic-syntax#variables)에 할당할 수 있습니다.

```kotlin
val invoice = Invoice()

val customer = Customer("Joe Smith")
```

:::note
Kotlin에는 `new` 키워드가 없습니다.

:::

중첩된 클래스, 내부 클래스 및 익명 내부 클래스의 인스턴스를 생성하는 과정은 [중첩된 클래스](nested-classes)에 설명되어 있습니다.

## 클래스 멤버

클래스는 다음을 포함할 수 있습니다.

* [생성자 및 초기화 블록](classes#constructors)
* [함수](functions)
* [속성](properties)
* [중첩된 클래스 및 내부 클래스](nested-classes)
* [객체 선언](object-declarations)

## 상속

클래스는 서로 파생되어 상속 계층 구조를 형성할 수 있습니다.
[Kotlin의 상속에 대해 자세히 알아보십시오](inheritance).

## 추상 클래스

클래스와 일부 또는 전체 멤버는 `abstract`로 선언될 수 있습니다.
추상 멤버는 클래스에 구현이 없습니다.
추상 클래스나 함수에 `open`으로 어노테이션을 달 필요는 없습니다.

```kotlin
abstract class Polygon {
    abstract fun draw()
}

class Rectangle : Polygon() {
    override fun draw() {
        // draw the rectangle
    }
}
```

추상이 아닌 `open` 멤버를 추상 멤버로 오버라이드할 수 있습니다.

```kotlin
open class Polygon {
    open fun draw() {
        // some default polygon drawing method
    }
}

abstract class WildShape : Polygon() {
    // Classes that inherit WildShape need to provide their own
    // draw method instead of using the default on Polygon
    abstract override fun draw()
}
```

## 동반 객체

클래스 인스턴스 없이 호출할 수 있지만 클래스의 내부 요소에 액세스해야 하는 함수(예: 팩토리 메서드)를 작성해야 하는 경우 해당 클래스 내부의 [객체 선언](object-declarations)의 멤버로 작성할 수 있습니다.

더 구체적으로, 클래스 내부에 [동반 객체](object-declarations#companion-objects)를 선언하면 클래스 이름만 한정자로 사용하여 해당 멤버에 액세스할 수 있습니다.