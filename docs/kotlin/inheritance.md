[//]: # (title: 继承)

Kotlin 中所有类都拥有一个共同的超类 `Any`，它是未声明任何超类型的类的默认超类：

```kotlin
class Example // Implicitly inherits from Any
```

`Any` 有三个方法：`equals()`、`hashCode()` 和 `toString()`。因此，所有 Kotlin 类都定义了这些方法。

默认情况下，Kotlin 类是 `final` 的——它们不能被继承。要使一个类可继承，请用 `open` 关键字标记它：

```kotlin
open class Base // Class is open for inheritance

```

要声明一个显式超类型，请在类头中的冒号后放置该类型：

```kotlin
open class Base(p: Int)

class Derived(p: Int) : Base(p)
```

如果派生类有一个主构造函数，那么基类可以（并且必须）根据其参数在该主构造函数中进行初始化。

如果派生类没有主构造函数，那么每个次构造函数都必须使用 `super` 关键字初始化基类型，或者它必须委托给另一个执行初始化的构造函数。请注意，在这种情况下，不同的次构造函数可以调用基类型的不同构造函数：

```kotlin
class MyView : View {
    constructor(ctx: Context) : super(ctx)

    constructor(ctx: Context, attrs: AttributeSet) : super(ctx, attrs)
}
```

## 覆盖方法

Kotlin 要求对可覆盖成员和覆盖成员使用显式修饰符：

```kotlin
open class Shape {
    open fun draw() { /*...*/ }
    fun fill() { /*...*/ }
}

class Circle() : Shape() {
    override fun draw() { /*...*/ }
}
```

`Circle.draw()` 需要 `override` 修饰符。如果缺少它，编译器会报错。如果函数上没有 `open` 修饰符（例如 `Shape.fill()`），则不允许在子类中声明具有相同签名的方法，无论是否使用 `override`。`open` 修饰符添加到 `final` 类（即没有 `open` 修饰符的类）的成员时，没有效果。

标记为 `override` 的成员本身是 `open` 的，因此它可以在子类中被覆盖。如果你想禁止再次覆盖，请使用 `final`：

```kotlin
open class Rectangle() : Shape() {
    final override fun draw() { /*...*/ }
}
```

## 覆盖属性

覆盖机制对属性的作用方式与对方法的作用方式相同。在超类中声明，然后在派生类中重新声明的属性必须以 `override` 开头，并且它们必须具有兼容的类型。每个声明的属性都可以被一个带有初始化器或带有 `get` 方法的属性覆盖：

```kotlin
open class Shape {
    open val vertexCount: Int = 0
}

class Rectangle : Shape() {
    override val vertexCount = 4
}
```

你也可以用 `var` 属性覆盖 `val` 属性，但不能反过来。这是允许的，因为 `val` 属性本质上声明了一个 `get` 方法，而将其覆盖为 `var` 属性会在派生类中额外声明一个 `set` 方法。

请注意，你可以在主构造函数中将 `override` 关键字用作属性声明的一部分：

```kotlin
interface Shape {
    val vertexCount: Int
}

class Rectangle(override val vertexCount: Int = 4) : Shape // Always has 4 vertices

class Polygon : Shape {
    override var vertexCount: Int = 0  // Can be set to any number later
}
```

## 派生类初始化顺序

在构造派生类的新实例期间，基类初始化是第一步（仅在评估基类构造函数的参数之后），这意味着它发生在派生类的初始化逻辑运行之前。

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

这意味着当基类构造函数执行时，在派生类中声明或覆盖的属性尚未初始化。在基类初始化逻辑中（无论是直接使用，还是通过另一个被覆盖的 `open` 成员实现间接使用）使用这些属性中的任何一个，都可能导致不正确的行为或运行时失败。因此，在设计基类时，应避免在构造函数、属性初始化器或 `init` 块中使用 `open` 成员。

## 调用超类实现

派生类中的代码可以使用 `super` 关键字调用其超类函数和属性访问器实现：

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

在内部类中，访问外部类的超类是使用 `super` 关键字并通过外部类名称进行限定完成的，例如：`super@Outer`：

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

## 覆盖规则

在 Kotlin 中，实现继承受以下规则约束：如果一个类从其直接超类继承了同一个成员的多个实现，它必须覆盖该成员并提供自己的实现（或许，可以使用其中一个继承的实现）。

要表示继承实现所来自的超类型，请使用通过尖括号中的超类型名称限定的 `super`，例如 `super<Base>`：

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

从 `Rectangle` 和 `Polygon` 两者继承是允许的，但它们都包含 `draw()` 的实现，因此你需要重写 `Square` 中的 `draw()` 并为其提供一个单独的实现，以消除歧义。