[//]: # (title: 상속)

> 클래스로 상속 계층 구조를 만들기 전에, [추상 클래스](classes.md#abstract-classes)나 [인터페이스](interfaces.md) 사용을 고려해 보세요.
> 추상 클래스와 인터페이스는 기본적으로 상속이 가능합니다. 이들은 다른 클래스가 해당 멤버를 상속하고 구현할 수 있도록 설계되었습니다.
>
{style="tip"}

코틀린의 모든 클래스는 공통 상위 클래스인 `Any`를 가집니다. 이는 상위 타입(supertype)을 선언하지 않은 클래스의 기본 상위 클래스입니다.

```kotlin
class Example // 암시적으로 Any를 상속함
```

`Any`에는 `equals()`, `hashCode()`, `toString()` 세 가지 메서드가 있습니다. 따라서 모든 코틀린 클래스에는 이 메서드들이 정의되어 있습니다.

기본적으로 코틀린 클래스는 final입니다. 즉, 상속할 수 없습니다. 클래스를 상속 가능하게 만들려면 `open` 키워드를 붙여야 합니다.

```kotlin
open class Base // 클래스가 상속 가능하도록 열려 있음(open)

```

[더 자세한 내용은 Open 키워드 섹션을 참고하세요](#open-keyword).

명시적인 상위 타입을 선언하려면 클래스 헤더의 콜론 뒤에 해당 타입을 배치합니다.

```kotlin
open class Base(p: Int)

class Derived(p: Int) : Base(p)
```

파생 클래스(derived class)에 주 생성자가 있는 경우, 기본 클래스(base class)는 주 생성자의 매개변수에 따라 해당 주 생성자에서 초기화될 수 있으며, 반드시 초기화되어야 합니다.

파생 클래스에 주 생성자가 없는 경우, 각 부 생성자(secondary constructor)는 `super` 키워드를 사용하여 기본 타입을 초기화하거나, 초기화를 수행하는 다른 생성자에게 위임해야 합니다. 이 경우 서로 다른 부 생성자가 기본 타입의 서로 다른 생성자를 호출할 수 있습니다.

```kotlin
class MyView : View {
    constructor(ctx: Context) : super(ctx)

    constructor(ctx: Context, attrs: AttributeSet) : super(ctx, attrs)
}
```

## Open 키워드

코틀린에서 `open` 키워드는 클래스나 멤버(함수 또는 프로퍼티)가 하위 클래스에서 오버라이딩(재정의)될 수 있음을 나타냅니다.
기본적으로 코틀린의 클래스와 멤버는 _final_입니다. 즉, 명시적으로 `open`으로 표시하지 않는 한 상속(클래스의 경우)하거나 오버라이딩(멤버의 경우)할 수 없습니다.

```kotlin
// 상속을 허용하기 위해 open 키워드를 사용한 기본 클래스
open class Person(
    val name: String
) {
    // 하위 클래스에서 오버라이딩할 수 있는 open 함수
    open fun introduce() {
        println("Hello, my name is $name.")
    }
}

// Person을 상속받고 introduce() 함수를 오버라이딩하는 하위 클래스
class Student(
    name: String,
    val school: String
) : Person(name) {
    override fun introduce() {
        println("Hi, I'm $name, and I study at $school.")
    }
}
```

기본 클래스의 멤버를 오버라이딩하는 멤버는 그 자체로 기본적으로 open 상태입니다. 이를 변경하여 하위 클래스에서 해당 구현을 재정의하지 못하게 하려면, 오버라이딩하는 멤버 앞에 `final`을 명시하면 됩니다.

```kotlin
// 상속을 허용하기 위해 open 키워드를 사용한 기본 클래스
open class Person(val name: String) {
    // 하위 클래스에서 오버라이딩할 수 있는 open 함수
    open fun introduce() {
        println("Hello, my name is $name.")
    }
}

// Person을 상속받고 introduce() 함수를 오버라이딩하는 하위 클래스
class Student(name: String, val school: String) : Person(name) {
    // final 키워드는 하위 클래스에서 더 이상의 오버라이딩을 방지합니다
    final override fun introduce() {
        println("Hi, I'm $name, and I study at $school.")
    }
}
```

## 메서드 오버라이딩

코틀린은 오버라이딩 가능한 멤버와 오버라이딩하는 멤버 모두에 명시적인 수정자(modifier)를 요구합니다.

```kotlin
open class Shape {
    open fun draw() { /*...*/ }
    fun fill() { /*...*/ }
}

class Circle() : Shape() {
    override fun draw() { /*...*/ }
}
```

`Circle.draw()`에는 `override` 수정자가 필수입니다. 만약 누락되면 컴파일러가 에러를 발생시킵니다. `Shape.fill()`과 같이 함수에 `open` 수정자가 없는 경우, 하위 클래스에서 `override` 여부와 상관없이 동일한 시그니처를 가진 메서드를 선언할 수 없습니다. `open` 수정자는 final 클래스(수정자가 없는 클래스)의 멤버에 추가될 때는 아무런 효과가 없습니다.

`override`가 표시된 멤버는 그 자체로 open이므로 하위 클래스에서 오버라이딩할 수 있습니다. 재정의를 금지하려면 `final`을 사용하세요.

```kotlin
open class Rectangle() : Shape() {
    final override fun draw() { /*...*/ }
}
```

## 프로퍼티 오버라이딩

오버라이딩 메커니즘은 메서드와 동일한 방식으로 프로퍼티에서도 작동합니다. 상위 클래스에서 선언된 프로퍼티를 파생 클래스에서 다시 선언할 때는 반드시 앞에 `override`를 붙여야 하며, 호환되는 타입이어야 합니다. 각 선언된 프로퍼티는 초기화 식(initializer)이 있는 프로퍼티나 `get` 메서드가 있는 프로퍼티로 오버라이딩할 수 있습니다.

```kotlin
open class Shape {
    open val vertexCount: Int = 0
}

class Rectangle : Shape() {
    override val vertexCount = 4
}
```

또한 `val` 프로퍼티를 `var` 프로퍼티로 오버라이딩할 수도 있지만, 그 반대는 불가능합니다. 이는 `val` 프로퍼티가 기본적으로 `get` 메서드를 선언하는 것이며, 이를 `var`로 오버라이딩하면 파생 클래스에 `set` 메서드를 추가로 선언하는 꼴이 되기 때문에 허용됩니다.

주 생성자의 프로퍼티 선언부의 일부로 `override` 키워드를 사용할 수 있습니다.

```kotlin
interface Shape {
    val vertexCount: Int
}

class Rectangle(override val vertexCount: Int = 4) : Shape // 항상 4개의 꼭짓점을 가짐

class Polygon : Shape {
    override var vertexCount: Int = 0  // 나중에 임의의 숫자로 설정 가능
}
```

## 파생 클래스 초기화 순서

파생 클래스의 새로운 인스턴스를 생성하는 동안, 기본 클래스의 초기화가 첫 번째 단계로 수행됩니다(기본 클래스 생성자의 인자 평가 바로 다음). 이는 파생 클래스의 초기화 로직이 실행되기 전에 일어남을 의미합니다.

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

이는 기본 클래스 생성자가 실행될 때, 파생 클래스에서 선언되거나 오버라이딩된 프로퍼티들이 아직 초기화되지 않았음을 의미합니다. 기본 클래스 초기화 로직에서 이러한 프로퍼티를 사용하면(직접적으로든, 오버라이딩된 다른 `open` 멤버 구현을 통해 간접적으로든) 잘못된 동작이나 런타임 오류가 발생할 수 있습니다. 따라서 기본 클래스를 설계할 때는 생성자, 프로퍼티 초기화 식, 또는 `init` 블록에서 `open` 멤버를 사용하지 않아야 합니다.

## 상위 클래스 구현 호출

파생 클래스의 코드는 `super` 키워드를 사용하여 상위 클래스의 함수 및 프로퍼티 접근자 구현을 호출할 수 있습니다.

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

내부 클래스(inner class)에서 외부 클래스의 상위 클래스에 접근하려면, 외부 클래스 이름으로 한정된 `super` 키워드(`super@Outer`)를 사용합니다.

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
            super@FilledRectangle.draw() // Rectangle의 draw() 구현 호출
            fill()
            println("Drawn a filled rectangle with color ${super@FilledRectangle.borderColor}") // Rectangle의 borderColor get() 구현 사용
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

코틀린에서 구현 상속은 다음 규칙에 따라 규제됩니다. 만약 어떤 클래스가 직계 상위 클래스들로부터 동일한 멤버의 구현을 여러 개 상속받는 경우, 해당 멤버를 반드시 오버라이딩하고 자신만의 구현을 제공해야 합니다(상속받은 구현 중 하나를 사용할 수도 있습니다).

상속받은 구현을 가져올 상위 타입을 명시하려면, `super<Base>`와 같이 꺾쇠괄호 안에 상위 타입 이름을 붙인 `super`를 사용합니다.

```kotlin
open class Rectangle {
    open fun draw() { /* ... */ }
}

interface Polygon {
    fun draw() { /* ... */ } // 인터페이스 멤버는 기본적으로 'open'임
}

class Square() : Rectangle(), Polygon {
    // 컴파일러는 draw()를 오버라이딩할 것을 요구함:
    override fun draw() {
        super<Rectangle>.draw() // Rectangle.draw() 호출
        super<Polygon>.draw() // Polygon.draw() 호출
    }
}
```

`Rectangle`과 `Polygon`을 모두 상속받는 것은 괜찮지만, 두 타입 모두 `draw()` 구현을 가지고 있으므로 모호성을 제거하기 위해 `Square`에서 `draw()`를 오버라이딩하고 별도의 구현을 제공해야 합니다.