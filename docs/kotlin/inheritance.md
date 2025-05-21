---
title: 继承
---
Kotlin 中的所有类都有一个共同的超类 `Any`，它是没有声明超类型的类的默认超类：

```kotlin
class Example // 隐式继承自 Any
```

`Any` 有三个方法：`equals()`、`hashCode()` 和 `toString()`。 因此，所有 Kotlin 类都定义了这些方法。

默认情况下，Kotlin 类是 final 的——它们不能被继承。 要使一个类可继承，请使用 `open` 关键字标记它：

```kotlin
open class Base // 类可以被继承

```

要声明显式的超类型，请将类型放在类标头中的冒号之后：

```kotlin
open class Base(p: Int)

class Derived(p: Int) : Base(p)
```

如果派生类有一个主构造函数，则必须根据其参数在该主构造函数中初始化基类。

如果派生类没有主构造函数，那么每个二级构造函数都必须使用 `super` 关键字初始化基类型，或者它必须委托给另一个执行此操作的构造函数。 请注意，在这种情况下，不同的二级构造函数可以调用基类型的不同构造函数：

```kotlin
class MyView : View {
    constructor(ctx: Context) : super(ctx)

    constructor(ctx: Context, attrs: AttributeSet) : super(ctx, attrs)
}
```

## 重写方法 (Overriding methods)

Kotlin 要求对可重写成员和重写使用显式修饰符：

```kotlin
open class Shape {
    open fun draw() { /*...*/ }
    fun fill() { /*...*/ }
}

class Circle() : Shape() {
    override fun draw() { /*...*/ }
}
```

`Circle.draw()` 需要 `override` 修饰符。 如果缺少它，编译器会报错。 如果函数上没有 `open` 修饰符，例如 `Shape.fill()`，则不允许在子类中声明具有相同签名的方法，无论是否带有 `override`。 当添加到 final 类的成员时，`open` 修饰符不起作用——没有 `open` 修饰符的类。

标记为 `override` 的成员本身是 open 的，因此可以在子类中重写它。 如果要禁止重新重写，请使用 `final`：

```kotlin
open class Rectangle() : Shape() {
    final override fun draw() { /*...*/ }
}
```

## 重写属性 (Overriding properties)

重写机制以与方法相同的方式作用于属性。 在超类上声明然后在派生类上重新声明的属性必须以 `override` 开头，并且它们必须具有兼容的类型。 每个声明的属性都可以被带有初始值设定项的属性或带有 `get` 方法的属性覆盖：

```kotlin
open class Shape {
    open val vertexCount: Int = 0
}

class Rectangle : Shape() {
    override val vertexCount = 4
}
```

你也可以用 `var` 属性覆盖 `val` 属性，但反之则不行。 这是允许的，因为 `val` 属性本质上声明了一个 `get` 方法，并将其重写为 `var` 另外声明了派生类中的 `set` 方法。

请注意，你可以使用 `override` 关键字作为主构造函数中属性声明的一部分：

```kotlin
interface Shape {
    val vertexCount: Int
}

class Rectangle(override val vertexCount: Int = 4) : Shape // 始终有 4 个顶点

class Polygon : Shape {
    override var vertexCount: Int = 0  // 以后可以设置为任何数字
}
```

## 派生类初始化顺序 (Derived class initialization order)

在构造派生类的新实例期间，基类初始化是作为第一步完成的（仅先于基类构造函数的参数的评估），这意味着它发生在派生类的初始化逻辑运行之前。

```kotlin

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

fun main() {
    println("Constructing the derived class(\"hello\", \"world\")")
    Derived("hello", "world")
}
```

这意味着当执行基类构造函数时，尚未初始化在派生类中声明或重写的属性。 在基类初始化逻辑中使用任何这些属性（无论是直接使用还是通过另一个重写的 `open` 成员实现间接使用）都可能导致不正确的行为或运行时故障。 因此，在设计基类时，应避免在构造函数、属性初始化程序或 `init` 代码块中使用 `open` 成员。

## 调用超类实现 (Calling the superclass implementation)

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

在内部类中，访问外部类的超类是使用以外部类名称限定的 `super` 关键字来完成的：`super@Outer`：

```kotlin
open class Rectangle {
    open fun draw() { println("Drawing a rectangle") }
    val borderColor: String get() = "black"
}

class FilledRectangle: Rectangle() {
    override fun draw() {
        val filler = Filler()
        filler.drawAndFill()
    }
    
    inner class Filler {
        fun fill() { println("Filling") }
        fun drawAndFill() {
            super@FilledRectangle.draw() // 调用 Rectangle 的 draw() 实现
            fill()
            println("Drawn a filled rectangle with color ${super@FilledRectangle.borderColor}") // 使用 Rectangle 的 borderColor 的 get() 实现
        }
    }
}

fun main() {
    val fr = FilledRectangle()
        fr.draw()
}
```

## 重写规则 (Overriding rules)

在 Kotlin 中，实现继承受以下规则约束：如果一个类从其直接超类继承同一成员的多个实现，则它必须重写该成员并提供自己的实现（可能使用继承的实现之一）。

要表示从中获取继承实现的超类型，请使用尖括号中的超类型名称限定的 `super`，例如 `super<Base>`：

```kotlin
open class Rectangle {
    open fun draw() { /* ... */ }
}

interface Polygon {
    fun draw() { /* ... */ } // 接口成员默认是 'open' 的
}

class Square() : Rectangle(), Polygon {
    // 编译器要求重写 draw()：
    override fun draw() {
        super<Rectangle>.draw() // 调用 Rectangle.draw()
        super<Polygon>.draw() // 调用 Polygon.draw()
    }
}
```

从 `Rectangle` 和 `Polygon` 继承是可以的，但是它们都有 `draw()` 的实现，因此你需要在 `Square` 中重写 `draw()` 并为其提供单独的实现以消除歧义。