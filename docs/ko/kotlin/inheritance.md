[//]: # (title: 상속)

코틀린의 모든 클래스는 공통 슈퍼클래스인 `Any`를 가집니다. 이는 슈퍼타입이 선언되지 않은 클래스의 기본 슈퍼클래스입니다.

```kotlin
class Example // 암묵적으로 Any를 상속받습니다.
```

`Any`는 `equals()`, `hashCode()`, `toString()` 세 가지 메서드를 가지고 있습니다. 따라서 이 메서드들은 모든 코틀린 클래스에 대해 정의됩니다.

기본적으로 코틀린 클래스는 `final`입니다. 즉, 상속될 수 없습니다. 클래스를 상속 가능하게 만들려면 `open` 키워드를 붙여야 합니다.

```kotlin
open class Base // 이 클래스는 상속을 위해 open됩니다.

```

[자세한 내용은 Open 키워드](#open-keyword)를 참조하십시오.

명시적인 슈퍼타입을 선언하려면, 클래스 헤더의 콜론(`:`) 뒤에 타입을 배치합니다.

```kotlin
open class Base(p: Int)

class Derived(p: Int) : Base(p)
```

파생 클래스에 주 생성자가 있다면, 기본 클래스는 해당 주 생성자에서 파라미터에 따라 초기화될 수 있고 (반드시 초기화되어야 합니다).

파생 클래스에 주 생성자가 없는 경우, 각 보조 생성자는 `super` 키워드를 사용하여 기본 타입을 초기화하거나, 이를 수행하는 다른 생성자로 위임해야 합니다. 이 경우 다른 보조 생성자가 기본 타입의 다른 생성자를 호출할 수 있다는 점에 유의하십시오.

```kotlin
class MyView : View {
    constructor(ctx: Context) : super(ctx)

    constructor(ctx: Context, attrs: AttributeSet) : super(ctx, attrs)
}
```

## Open 키워드

코틀린에서 `open` 키워드는 클래스 또는 멤버(함수나 프로퍼티)가 서브클래스에서 오버라이드될 수 있음을 나타냅니다. 기본적으로 코틀린 클래스와 멤버는 _`final`_입니다. 즉, 명시적으로 `open`으로 표시하지 않는 한 상속(클래스의 경우)되거나 오버라이드(멤버의 경우)될 수 없습니다.

```kotlin
// 상속을 허용하기 위해 open 키워드가 있는 기본 클래스
open class Person(
    val name: String
) {
    // 서브클래스에서 오버라이드될 수 있는 open 함수
    open fun introduce() {
        println("Hello, my name is $name.")
    }
}

// Person을 상속받아 introduce() 함수를 오버라이드하는 서브클래스
class Student(
    name: String,
    val school: String
) : Person(name) {
    override fun introduce() {
        println("Hi, I'm $name, and I study at $school.")
    }
}
```

기본 클래스의 멤버를 오버라이드하는 경우, 오버라이드하는 멤버도 기본적으로 `open`입니다. 이를 변경하고 클래스의 서브클래스가 현재 구현을 오버라이드하는 것을 금지하려면, 오버라이드하는 멤버를 명시적으로 `final`로 표시할 수 있습니다.

```kotlin
// 상속을 허용하기 위해 open 키워드가 있는 기본 클래스
open class Person(val name: String) {
    // 서브클래스에서 오버라이드될 수 있는 open 함수
    open fun introduce() {
        println("Hello, my name is $name.")
    }
}

// Person을 상속받아 introduce() 함수를 오버라이드하는 서브클래스
class Student(name: String, val school: String) : Person(name) {
    // final 키워드는 서브클래스에서의 추가적인 오버라이드를 방지합니다.
    final override fun introduce() {
        println("Hi, I'm $name, and I study at $school.")
    }
}
```

## 메서드 오버라이딩

코틀린은 오버라이드 가능한 멤버와 오버라이드에 명시적인 변경자를 요구합니다.

```kotlin
open class Shape {
    open fun draw() { /*...*/ }
    fun fill() { /*...*/ }
}

class Circle() : Shape() {
    override fun draw() { /*...*/ }
}
```

`Circle.draw()`에는 `override` 변경자가 필요합니다. 만약 누락되면 컴파일러가 오류를 발생시킵니다. `Shape.fill()`과 같이 함수에 `open` 변경자가 없는 경우, 서브클래스에서 동일한 시그니처를 가진 메서드를 선언하는 것은 `override`를 사용하든 사용하지 않든 허용되지 않습니다. `open` 변경자가 `final` 클래스(즉, `open` 변경자가 없는 클래스)의 멤버에 추가될 경우 효과가 없습니다.

`override`로 표시된 멤버는 그 자체로 `open`이므로, 서브클래스에서 오버라이드될 수 있습니다. 재오버라이딩을 금지하려면 `final`을 사용하십시오:

```kotlin
open class Rectangle() : Shape() {
    final override fun draw() { /*...*/ }
}
```

## 프로퍼티 오버라이딩

오버라이딩 메커니즘은 메서드와 동일한 방식으로 프로퍼티에서도 작동합니다. 슈퍼클래스에 선언된 프로퍼티를 파생 클래스에서 다시 선언할 때는 `override` 키워드를 앞에 붙여야 하며, 호환되는 타입을 가져야 합니다. 각 선언된 프로퍼티는 초기화자를 가진 프로퍼티 또는 `get` 메서드를 가진 프로퍼티로 오버라이드될 수 있습니다.

```kotlin
open class Shape {
    open val vertexCount: Int = 0
}

class Rectangle : Shape() {
    override val vertexCount = 4
}
```

`val` 프로퍼티를 `var` 프로퍼티로 오버라이드할 수 있지만, 그 반대는 안 됩니다. 이는 `val` 프로퍼티가 본질적으로 `get` 메서드를 선언하고, 이를 `var`로 오버라이드하면 파생 클래스에 `set` 메서드가 추가로 선언되기 때문에 허용됩니다.

주 생성자에서 프로퍼티 선언의 일부로 `override` 키워드를 사용할 수 있다는 점에 유의하십시오.

```kotlin
interface Shape {
    val vertexCount: Int
}

class Rectangle(override val vertexCount: Int = 4) : Shape // Always has 4 vertices

class Polygon : Shape {
    override var vertexCount: Int = 0  // Can be set to any number later
}
```

## 파생 클래스 초기화 순서

파생 클래스의 새 인스턴스를 생성하는 동안, 기본 클래스 초기화가 첫 번째 단계로 수행되며 (기본 클래스 생성자 인자 평가만이 선행됩니다), 이는 파생 클래스의 초기화 로직이 실행되기 전에 발생한다는 의미입니다.

```kotlin
//sampleStart
open class Base(val name: String) {

    init { println("Initializing a base class") }

    open val size: Int = 
        name.length.also { println("Initializing size in the base class: $it") }
}

class Derived(
    name: String,
    val lastName: String,
) : Base(name.replaceFirstChar { it.uppercase() }.also { println("Argument for the base class: $it") }) {

    init { println("Initializing a derived class") }

    override val size: Int =
        (super.size + lastName.length).also { println("Initializing size in the derived class: $it") }
}
//sampleEnd

fun main() {
    println("Constructing the derived class(\"hello\", \"world\")")
    Derived("hello", "world")
}
```
{kotlin-runnable="true"}

이는 기본 클래스 생성자가 실행될 때 파생 클래스에 선언되거나 오버라이드된 프로퍼티들이 아직 초기화되지 않았다는 것을 의미합니다. 기본 클래스 초기화 로직에서 이러한 프로퍼티들(직접적으로든 또는 다른 오버라이드된 `open` 멤버 구현을 통해 간접적으로든)을 사용하면 올바르지 않은 동작이나 런타임 오류로 이어질 수 있습니다. 따라서 기본 클래스를 설계할 때는 생성자, 프로퍼티 초기화자 또는 `init` 블록에서 `open` 멤버를 사용하는 것을 피해야 합니다.

## 슈퍼클래스 구현 호출

파생 클래스의 코드는 `super` 키워드를 사용하여 슈퍼클래스의 함수와 프로퍼티 접근자 구현을 호출할 수 있습니다.

```kotlin
open class Rectangle {
    open fun draw() { println("Drawing a rectangle") }
    val borderColor: String get() = "black"
}

class FilledRectangle : Rectangle() {
    override fun draw() {
        super.draw()
        println("Filling the rectangle")
    }

    val fillColor: String get() = super.borderColor
}
```

내부 클래스 내에서, 외부 클래스의 슈퍼클래스에 접근하는 것은 외부 클래스 이름으로 한정된(`qualified`) `super` 키워드를 사용하여 이루어집니다: `super@Outer`:

```kotlin
open class Rectangle {
    open fun draw() { println("Drawing a rectangle") }
    val borderColor: String get() = "black"
}

//sampleStart
class FilledRectangle: Rectangle() {
    override fun draw() {
        val filler = Filler()
        filler.drawAndFill()
    }
    
    inner class Filler {
        fun fill() { println("Filling") }
        fun drawAndFill() {
            super@FilledRectangle.draw() // Rectangle.draw() 호출
            fill()
            println("Drawn a filled rectangle with color ${super@FilledRectangle.borderColor}") // Rectangle의 borderColor의 get() 구현 사용
        }
    }
}
//sampleEnd

fun main() {
    val fr = FilledRectangle()
        fr.draw()
}
```
{kotlin-runnable="true"}

## 오버라이딩 규칙

코틀린에서 구현 상속은 다음 규칙에 의해 규제됩니다: 만약 클래스가 직접적인 슈퍼클래스로부터 동일한 멤버의 여러 구현을 상속받는다면, 해당 멤버를 오버라이드하고 자체 구현을 제공해야 합니다(상속받은 구현 중 하나를 사용할 수도 있습니다).

상속받은 구현이 가져와진 슈퍼타입을 나타내려면, 꺾쇠괄호 안에 슈퍼타입 이름을 사용하여 한정된(`qualified`) `super`를 사용합니다. 예: `super<Base>`:

```kotlin
open class Rectangle {
    open fun draw() { /* ... */ }
}

interface Polygon {
    fun draw() { /* ... */ } // 인터페이스 멤버는 기본적으로 'open'입니다.
}

class Square() : Rectangle(), Polygon {
    // 컴파일러는 draw()를 오버라이드할 것을 요구합니다:
    override fun draw() {
        super<Rectangle>.draw() // Rectangle.draw() 호출
        super<Polygon>.draw() // Polygon.draw() 호출
    }
}
```

`Rectangle`과 `Polygon` 모두로부터 상속받는 것은 괜찮지만, 둘 다 `draw()`의 자체 구현을 가지고 있으므로, 모호성을 제거하기 위해 `Square`에서 `draw()`를 오버라이드하고 별도의 구현을 제공해야 합니다.