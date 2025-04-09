---
title: 상속
---
Kotlin의 모든 클래스는 공통 슈퍼클래스인 `Any`를 가집니다. `Any`는 슈퍼타입이 선언되지 않은 클래스의 기본 슈퍼클래스입니다.

```kotlin
class Example // 암묵적으로 Any에서 상속받음
```

`Any`는 `equals()`, `hashCode()`, `toString()` 세 가지 메서드를 가지고 있습니다. 따라서 이 메서드들은 모든 Kotlin 클래스에 대해 정의됩니다.

기본적으로 Kotlin 클래스는 `final` 입니다. 즉, 상속될 수 없습니다. 클래스를 상속 가능하게 만들려면 `open` 키워드로 표시하세요.

```kotlin
open class Base // 클래스가 상속에 대해 열려 있음

```

명시적인 슈퍼타입을 선언하려면 클래스 헤더에서 콜론 뒤에 타입을 배치합니다.

```kotlin
open class Base(p: Int)

class Derived(p: Int) : Base(p)
```

파생 클래스가 주 생성자를 가지는 경우, 기본 클래스는 해당 파라미터에 따라 주 생성자에서 초기화될 수 있고 (또는 초기화되어야) 합니다.

파생 클래스가 주 생성자를 가지지 않는 경우, 각 부 생성자는 `super` 키워드를 사용하여 기본 타입을 초기화하거나, 그렇게 하는 다른 생성자에 위임해야 합니다. 이 경우 서로 다른 부 생성자가 기본 타입의 서로 다른 생성자를 호출할 수 있습니다.

```kotlin
class MyView : View {
    constructor(ctx: Context) : super(ctx)

    constructor(ctx: Context, attrs: AttributeSet) : super(ctx, attrs)
}
```

## 메서드 오버라이딩

Kotlin은 오버라이드 가능한 멤버와 오버라이드에 대해 명시적인 modifier를 요구합니다.

```kotlin
open class Shape {
    open fun draw() { /*...*/ }
    fun fill() { /*...*/ }
}

class Circle() : Shape() {
    override fun draw() { /*...*/ }
}
```

`override` modifier는 `Circle.draw()`에 필수적입니다. 이것이 누락되면 컴파일러가 불만을 제기합니다. `Shape.fill()`처럼 함수에 `open` modifier가 없는 경우, 서브클래스에서 동일한 시그니처를 가진 메서드를 선언하는 것은 `override`를 사용하든 사용하지 않든 허용되지 않습니다. `open` modifier는 `open` modifier가 없는 클래스인 `final` 클래스의 멤버에 추가될 때는 효과가 없습니다.

`override`로 표시된 멤버는 그 자체로 open되어 서브클래스에서 오버라이드될 수 있습니다. 재 오버라이드를 금지하려면 `final`을 사용하세요.

```kotlin
open class Rectangle() : Shape() {
    final override fun draw() { /*...*/ }
}
```

## 프로퍼티 오버라이딩

오버라이딩 메커니즘은 메서드에서와 같은 방식으로 프로퍼티에서 작동합니다. 슈퍼클래스에서 선언된 후 파생 클래스에서 재선언되는 프로퍼티는 `override`가 앞에 붙어야 하며 호환 가능한 타입을 가져야 합니다. 각 선언된 프로퍼티는 초기화 블록이 있는 프로퍼티 또는 `get` 메서드가 있는 프로퍼티로 오버라이드될 수 있습니다.

```kotlin
open class Shape {
    open val vertexCount: Int = 0
}

class Rectangle : Shape() {
    override val vertexCount = 4
}
```

`val` 프로퍼티를 `var` 프로퍼티로 오버라이드할 수도 있지만, 그 반대는 불가능합니다. `val` 프로퍼티는 기본적으로 `get` 메서드를 선언하고, 그것을 `var`로 오버라이드하면 파생 클래스에 `set` 메서드가 추가로 선언되기 때문에 이것은 허용됩니다.

주 생성자에서 프로퍼티 선언의 일부로 `override` 키워드를 사용할 수 있습니다.

```kotlin
interface Shape {
    val vertexCount: Int
}

class Rectangle(override val vertexCount: Int = 4) : Shape // 항상 4개의 정점을 가짐

class Polygon : Shape {
    override var vertexCount: Int = 0  // 나중에 임의의 숫자로 설정 가능
}
```

## 파생 클래스 초기화 순서

파생 클래스의 새로운 인스턴스를 생성하는 동안, 기본 클래스 초기화가 첫 번째 단계로 수행됩니다 (기본 클래스 생성자에 대한 인수의 평가가 선행됨). 이는 파생 클래스의 초기화 로직이 실행되기 전에 발생함을 의미합니다.

```kotlin

open class Base(val name: String) {

    init { println("기본 클래스 초기화 중") }

    open val size: Int = 
        name.length.also { println("기본 클래스에서 크기 초기화 중: $it") }
}

class Derived(
    name: String,
    val lastName: String,
) : Base(name.replaceFirstChar { it.uppercase() }.also { println("기본 클래스에 대한 인수: $it") }) {

    init { println("파생 클래스 초기화 중") }

    override val size: Int =
        (super.size + lastName.length).also { println("파생 클래스에서 크기 초기화 중: $it") }
}

fun main() {
    println("파생 클래스(\"hello\", \"world\") 생성 중")
    Derived("hello", "world")
}
```

이는 기본 클래스 생성자가 실행될 때 파생 클래스에서 선언되거나 오버라이드된 프로퍼티가 아직 초기화되지 않았음을 의미합니다. 기본 클래스 초기화 로직에서 해당 프로퍼티를 사용하는 경우 (직접적으로 또는 다른 오버라이드된 `open` 멤버 구현을 통해 간접적으로) 잘못된 동작이나 런타임 오류가 발생할 수 있습니다. 따라서 기본 클래스를 설계할 때 생성자, 프로퍼티 초기화 블록 또는 `init` 블록에서 `open` 멤버를 사용하지 않아야 합니다.

## 슈퍼클래스 구현 호출

파생 클래스의 코드는 `super` 키워드를 사용하여 슈퍼클래스 함수 및 프로퍼티 접근자 구현을 호출할 수 있습니다.

```kotlin
open class Rectangle {
    open fun draw() { println("사각형 그리기") }
    val borderColor: String get() = "black"
}

class FilledRectangle : Rectangle() {
    override fun draw() {
        super.draw()
        println("사각형 채우기")
    }

    val fillColor: String get() = super.borderColor
}
```

내부 클래스 내부에서 외부 클래스의 슈퍼클래스에 접근하는 것은 외부 클래스 이름으로 한정된 `super` 키워드를 사용하여 수행됩니다. `super@Outer`:

```kotlin
open class Rectangle {
    open fun draw() { println("사각형 그리기") }
    val borderColor: String get() = "black"
}

class FilledRectangle: Rectangle() {
    override fun draw() {
        val filler = Filler()
        filler.drawAndFill()
    }
    
    inner class Filler {
        fun fill() { println("채우기") }
        fun drawAndFill() {
            super@FilledRectangle.draw() // Rectangle의 draw() 구현을 호출합니다.
            fill()
            println("색상 ${super@FilledRectangle.borderColor}으로 채워진 사각형 그림") // Rectangle의 borderColor의 get() 구현을 사용합니다.
        }
    }
}

fun main() {
    val fr = FilledRectangle()
        fr.draw()
}
```

## 오버라이딩 규칙

Kotlin에서 구현 상속은 다음과 같은 규칙에 의해 규제됩니다. 클래스가 직계 슈퍼클래스에서 동일한 멤버의 여러 구현을 상속받는 경우, 이 멤버를 오버라이드하고 자체 구현을 제공해야 합니다 (상속받은 구현 중 하나를 사용할 수 있음).

상속된 구현이 가져온 슈퍼타입을 나타내려면 꺾쇠 괄호 안에 슈퍼타입 이름으로 한정된 `super` (예: `super<Base>`)를 사용하십시오.

```kotlin
open class Rectangle {
    open fun draw() { /* ... */ }
}

interface Polygon {
    fun draw() { /* ... */ } // 인터페이스 멤버는 기본적으로 'open'입니다.
}

class Square() : Rectangle(), Polygon {
    // 컴파일러는 draw()가 오버라이드되도록 요구합니다.
    override fun draw() {
        super<Rectangle>.draw() // Rectangle.draw() 호출
        super<Polygon>.draw() // Polygon.draw() 호출
    }
}
```

`Rectangle`과 `Polygon` 모두에서 상속받는 것은 괜찮지만, 둘 다 `draw()`의 구현이 있으므로 `Square`에서 `draw()`를 오버라이드하고 모호성을 없애기 위해 별도의 구현을 제공해야 합니다.
```