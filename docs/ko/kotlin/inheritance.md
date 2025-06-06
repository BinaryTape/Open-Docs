[//]: # (title: 상속)

코틀린의 모든 클래스는 공통 상위 클래스인 `Any`를 가지며, 이는 상위 타입을 선언하지 않은 클래스의 기본 상위 클래스입니다.

```kotlin
class Example // Implicitly inherits from Any
```

`Any`는 `equals()`, `hashCode()`, `toString()` 세 가지 메서드를 가집니다. 따라서 이 메서드들은 모든 코틀린 클래스에 대해 정의됩니다.

기본적으로 코틀린 클래스는 파이널(final)입니다. 즉, 상속될 수 없습니다. 클래스를 상속 가능하게 만들려면 `open` 키워드로 표시합니다.

```kotlin
open class Base // Class is open for inheritance

```

명시적 상위 타입을 선언하려면 클래스 헤더에서 콜론 뒤에 타입을 배치합니다.

```kotlin
open class Base(p: Int)

class Derived(p: Int) : Base(p)
```

파생 클래스에 주 생성자가 있는 경우, 기본 클래스는 해당 주 생성자에서 매개변수에 따라 초기화될 수 있고, 반드시 초기화되어야 합니다.

파생 클래스에 주 생성자가 없는 경우, 각 보조 생성자는 `super` 키워드를 사용하여 기본 타입을 초기화하거나, 기본 타입을 초기화하는 다른 생성자로 위임해야 합니다. 참고로 이 경우 다른 보조 생성자가 기본 타입의 다른 생성자를 호출할 수 있습니다.

```kotlin
class MyView : View {
    constructor(ctx: Context) : super(ctx)

    constructor(ctx: Context, attrs: AttributeSet) : super(ctx, attrs)
}
```

## 메서드 오버라이딩

코틀린은 오버라이딩 가능한 멤버와 오버라이드에 대해 명시적 한정자를 요구합니다.

```kotlin
open class Shape {
    open fun draw() { /*...*/ }
    fun fill() { /*...*/ }
}

class Circle() : Shape() {
    override fun draw() { /*...*/ }
}
```

`Circle.draw()`에 `override` 한정자가 필수입니다. 이 한정자가 누락되면 컴파일러가 오류를 발생시킵니다. `Shape.fill()`처럼 함수에 `open` 한정자가 없는 경우, `override`를 사용하든 사용하지 않든 파생 클래스에 동일한 시그니처를 가진 메서드를 선언하는 것은 허용되지 않습니다. `open` 한정자가 파이널 클래스(즉, `open` 한정자가 없는 클래스)의 멤버에 추가될 경우 아무런 효과가 없습니다.

`override`로 표시된 멤버는 그 자체로 열려 있으므로, 파생 클래스에서 오버라이딩될 수 있습니다. 재오버라이딩을 금지하고 싶다면 `final`을 사용하세요.

```kotlin
open class Rectangle() : Shape() {
    final override fun draw() { /*...*/ }
}
```

## 프로퍼티 오버라이딩

오버라이딩 메커니즘은 메서드와 동일한 방식으로 프로퍼티에서도 작동합니다. 상위 클래스에 선언된 프로퍼티를 파생 클래스에서 다시 선언할 때는 `override`로 시작해야 하며, 호환되는 타입을 가져야 합니다. 각 선언된 프로퍼티는 초기화자(initializer)를 가진 프로퍼티나 `get` 메서드를 가진 프로퍼티로 오버라이딩될 수 있습니다.

```kotlin
open class Shape {
    open val vertexCount: Int = 0
}

class Rectangle : Shape() {
    override val vertexCount = 4
}
```

또한 `val` 프로퍼티를 `var` 프로퍼티로 오버라이딩할 수 있지만, 그 반대는 안 됩니다. 이는 `val` 프로퍼티가 본질적으로 `get` 메서드를 선언하고, 이를 `var`로 오버라이딩하면 파생 클래스에 `set` 메서드를 추가적으로 선언하기 때문에 허용됩니다.

주 생성자에서 프로퍼티 선언의 일부로 `override` 키워드를 사용할 수 있다는 점에 유의하세요.

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

파생 클래스의 새 인스턴스가 생성되는 동안, 기본 클래스 초기화가 첫 번째 단계로 수행됩니다(이는 기본 클래스 생성자의 인수를 평가하는 것만 선행됩니다). 이는 파생 클래스의 초기화 로직이 실행되기 전에 발생함을 의미합니다.

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

이는 기본 클래스 생성자가 실행될 때, 파생 클래스에 선언되거나 오버라이딩된 프로퍼티가 아직 초기화되지 않았다는 것을 의미합니다. 기본 클래스 초기화 로직에서 이러한 프로퍼티를 사용하면(직접적으로든 또는 다른 오버라이딩된 `open` 멤버 구현을 통해 간접적으로든) 잘못된 동작이나 런타임 오류로 이어질 수 있습니다. 따라서 기본 클래스를 설계할 때 생성자, 프로퍼티 초기화자 또는 `init` 블록에서 `open` 멤버를 사용하지 않도록 해야 합니다.

## 상위 클래스 구현 호출하기

파생 클래스의 코드는 `super` 키워드를 사용하여 상위 클래스 함수 및 프로퍼티 접근자 구현을 호출할 수 있습니다.

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

내부 클래스 내에서 외부 클래스의 상위 클래스에 접근하는 것은 외부 클래스 이름으로 한정된 `super` 키워드(`super@Outer`)를 사용하여 이루어집니다.

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
            super@FilledRectangle.draw() // Calls Rectangle's implementation of draw()
            fill()
            println("Drawn a filled rectangle with color ${super@FilledRectangle.borderColor}") // Uses Rectangle's implementation of borderColor's get()
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

코틀린에서 구현 상속은 다음 규칙에 의해 규제됩니다. 클래스가 직접적인 상위 클래스로부터 동일한 멤버의 여러 구현을 상속받는 경우, 해당 멤버를 오버라이드하고 자체 구현을 제공해야 합니다(상속된 구현 중 하나를 사용하여).

상속된 구현을 가져온 상위 타입을 나타내려면, 꺾쇠괄호 안에 상위 타입 이름으로 한정된 `super`(`super<Base>`와 같이)를 사용합니다.

```kotlin
open class Rectangle {
    open fun draw() { /* ... */ }
}

interface Polygon {
    fun draw() { /* ... */ } // interface members are 'open' by default
}

class Square() : Rectangle(), Polygon {
    // The compiler requires draw() to be overridden:
    override fun draw() {
        super<Rectangle>.draw() // call to Rectangle.draw()
        super<Polygon>.draw() // call to Polygon.draw()
    }
}
```

`Rectangle`과 `Polygon` 모두로부터 상속받는 것은 괜찮지만, 둘 다 `draw()`의 자체 구현을 가지고 있으므로, 모호성을 제거하기 위해 `Square`에서 `draw()`를 오버라이드하고 별도의 구현을 제공해야 합니다.