[//]: # (title: 클래스)

Kotlin에서 클래스는 `class` 키워드를 사용하여 선언합니다.

```kotlin
class Person { /*...*/ }
```

클래스 선언은 클래스 이름, 클래스 헤더(타입 파라미터, 주 생성자 및 기타 사항을 지정), 그리고 중괄호로 둘러싸인 클래스 본문으로 구성됩니다. 헤더와 본문은 모두 선택 사항입니다. 클래스에 본문이 없으면 중괄호를 생략할 수 있습니다.

```kotlin
class Empty
```

## 생성자

Kotlin의 클래스는 _주 생성자(primary constructor)_와 하나 이상의 _보조 생성자(secondary constructors)_를 가질 수 있습니다. 주 생성자는 클래스 헤더에 선언되며, 클래스 이름과 선택적인 타입 파라미터 뒤에 위치합니다.

```kotlin
class Person constructor(firstName: String) { /*...*/ }
```

주 생성자에 어노테이션이나 가시성 한정자(visibility modifiers)가 없는 경우, `constructor` 키워드를 생략할 수 있습니다.

```kotlin
class Person(firstName: String) { /*...*/ }
```

주 생성자는 클래스 인스턴스와 클래스 헤더의 프로퍼티를 초기화합니다. 클래스 헤더는 실행 가능한 코드를 포함할 수 없습니다. 객체 생성 중에 코드를 실행하려면 클래스 본문 내부에 _초기화 블록(initializer blocks)_을 사용합니다. 초기화 블록은 `init` 키워드 뒤에 중괄호를 붙여 선언합니다. 실행하려는 코드는 중괄호 안에 작성합니다.

인스턴스 초기화 동안, 초기화 블록은 클래스 본문에 나타나는 순서와 동일하게 실행되며, 프로퍼티 초기화와 번갈아 가며 실행됩니다.

```kotlin
//sampleStart
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
//sampleEnd

fun main() {
    InitOrderDemo("hello")
}
```
{kotlin-runnable="true"}

주 생성자 파라미터는 초기화 블록에서 사용할 수 있습니다. 또한 클래스 본문에 선언된 프로퍼티 초기화에서도 사용할 수 있습니다.

```kotlin
class Customer(name: String) {
    val customerKey = name.uppercase()
}
```

Kotlin은 프로퍼티를 선언하고 주 생성자로부터 초기화하는 간결한 문법을 제공합니다.

```kotlin
class Person(val firstName: String, val lastName: String, var age: Int)
```

이러한 선언에는 클래스 프로퍼티의 기본값도 포함될 수 있습니다.

```kotlin
class Person(val firstName: String, val lastName: String, var isEmployed: Boolean = true)
```

클래스 프로퍼티를 선언할 때 [후행 쉼표(trailing comma)](coding-conventions.md#trailing-commas)를 사용할 수 있습니다.

```kotlin
class Person(
    val firstName: String,
    val lastName: String,
    var age: Int, // trailing comma
) { /*...*/ }
```

일반 프로퍼티와 마찬가지로, 주 생성자에 선언된 프로퍼티는 변경 가능(`var`)하거나 읽기 전용(`val`)일 수 있습니다.

(프로퍼티가 아닌) 일반 생성자 파라미터는 다음에서 접근할 수 있습니다.
*   클래스 헤더
*   클래스 본문 내 초기화된 프로퍼티
*   초기화 블록

예시:

```kotlin
// width and height are plain constructor parameters
class RectangleWithParameters(width: Int, height: Int) {
    val perimeter = 2 * width + 2 * height

    init {
        println("Rectangle created with width = $width and height = $height")
    }
}
```

생성자에 어노테이션이나 가시성 한정자가 있는 경우 `constructor` 키워드는 필수이며, 한정자는 `constructor` 키워드 앞에 위치해야 합니다.

```kotlin
class Customer public @Inject constructor(name: String) { /*...*/ }
```

[가시성 한정자(visibility modifiers)](visibility-modifiers.md#constructors)에 대해 더 자세히 알아보세요.

### 보조 생성자

클래스는 `constructor` 접두사가 붙는 _보조 생성자_를 선언할 수도 있습니다.

```kotlin
class Person(val pets: MutableList<Pet> = mutableListOf())

class Pet {
    constructor(owner: Person) {
        owner.pets.add(this) // adds this pet to the list of its owner's pets
    }
}
```

클래스에 주 생성자가 있는 경우, 각 보조 생성자는 직접적이든 다른 보조 생성자를 통해서든 주 생성자에게 위임해야 합니다. 동일한 클래스의 다른 생성자로 위임하는 것은 `this` 키워드를 사용하여 수행합니다.

```kotlin
class Person(val name: String) {
    val children: MutableList<Person> = mutableListOf()
    constructor(name: String, parent: Person) : this(name) {
        parent.children.add(this)
    }
}
```

초기화 블록의 코드는 사실상 주 생성자의 일부가 됩니다. 주 생성자로의 위임은 보조 생성자의 첫 번째 문장에 접근하는 순간에 발생하므로, 모든 초기화 블록과 프로퍼티 초기화의 코드는 보조 생성자 본문보다 먼저 실행됩니다.

클래스에 주 생성자가 없더라도 위임은 암묵적으로 발생하며, 초기화 블록은 여전히 실행됩니다.

```kotlin
//sampleStart
class Constructors {
    init {
        println("Init block")
    }

    constructor(i: Int) {
        println("Constructor $i")
    }
}
//sampleEnd

fun main() {
    Constructors(1)
}
```
{kotlin-runnable="true"}

비추상 클래스가 어떤 생성자(주 생성자 또는 보조 생성자)도 선언하지 않으면, 인수가 없는 주 생성자가 자동으로 생성됩니다. 이 생성자의 가시성은 public입니다.

클래스에 public 생성자가 없도록 하려면, 기본값이 아닌 가시성을 가진 빈 주 생성자를 선언합니다.

```kotlin
class DontCreateMe private constructor() { /*...*/ }
```

> JVM에서는 모든 주 생성자 파라미터에 기본값이 있는 경우, 컴파일러가 기본값을 사용하는 매개변수 없는 추가 생성자를 생성합니다. 이렇게 하면 Jackson이나 JPA와 같이 매개변수 없는 생성자를 통해 클래스 인스턴스를 생성하는 라이브러리와 Kotlin을 더 쉽게 사용할 수 있습니다.
>
> ```kotlin
> class Customer(val customerName: String = "")
> ```
>
{style="note"}

## 클래스 인스턴스 생성

클래스의 인스턴스를 생성하려면, 일반 함수처럼 생성자를 호출합니다. 생성된 인스턴스를 [변수](basic-syntax.md#variables)에 할당할 수 있습니다.

```kotlin
val invoice = Invoice()

val customer = Customer("Joe Smith")
```

> Kotlin에는 `new` 키워드가 없습니다.
>
{style="note"}

중첩, 내부, 익명 내부 클래스의 인스턴스 생성 과정은 [중첩 클래스(Nested classes)](nested-classes.md)에 설명되어 있습니다.

## 클래스 멤버

클래스는 다음을 포함할 수 있습니다.

*   [생성자 및 초기화 블록](#constructors)
*   [함수(Functions)](functions.md)
*   [프로퍼티(Properties)](properties.md)
*   [중첩 클래스 및 내부 클래스(Nested and inner classes)](nested-classes.md)
*   [객체 선언(Object declarations)](object-declarations.md)

## 상속

클래스는 서로로부터 파생될 수 있으며 상속 계층을 형성합니다.
[Kotlin의 상속에 대해 더 자세히 알아보세요](inheritance.md).

## 추상 클래스

클래스는 `abstract`로 선언될 수 있으며, 일부 또는 모든 멤버도 `abstract`로 선언될 수 있습니다.
추상 멤버는 해당 클래스에 구현을 갖지 않습니다.
추상 클래스나 함수에 `open` 어노테이션을 붙일 필요가 없습니다.

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

비추상 `open` 멤버를 추상 멤버로 오버라이드할 수 있습니다.

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

클래스 인스턴스 없이 호출될 수 있지만 클래스의 내부 요소에 접근해야 하는 함수(예: 팩토리 메서드)를 작성해야 하는 경우, 해당 클래스 내부에 있는 [객체 선언(object declaration)](object-declarations.md)의 멤버로 작성할 수 있습니다.

더 구체적으로는, 클래스 내부에 [동반 객체(companion object)](object-declarations.md#companion-objects)를 선언하면, 클래스 이름만 한정자로 사용하여 해당 멤버에 접근할 수 있습니다.