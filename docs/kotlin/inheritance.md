[//]: # (title: 继承)

> 在使用类创建继承层次结构之前，请考虑使用 [抽象类](classes.md#abstract-classes) 或 [接口](interfaces.md)。 
> 默认情况下，你可以从抽象类和接口继承。它们的设计初衷就是让其他类可以继承其成员并实现它们。
>
{style="tip"}

Kotlin 中的所有类都有一个共同的超类 `Any`，对于没有声明超类型的类，`Any` 是默认的超类：

```kotlin
class Example // 隐式继承自 Any
```

`Any` 有三个方法：`equals()`、`hashCode()` 和 `toString()`。因此，所有 Kotlin 类都定义了这些方法。

默认情况下，Kotlin 类是 final 的——它们不能被继承。要使一个类可继承，请使用 `open` 关键字标记它：

```kotlin
open class Base // 类已标记为 open，允许继承

```

[有关更多信息，请参阅 Open 关键字](#open-keyword)。

要声明显式超类型，请在类头中的冒号后放置该类型：

```kotlin
open class Base(p: Int)

class Derived(p: Int) : Base(p)
```

如果派生类具有主构造函数，则基类可以（并且必须）根据其形参在该主构造函数中进行初始化。

如果派生类没有主构造函数，那么每个次构造函数都必须使用 `super` 关键字初始化基类型，或者必须委托给另一个执行此操作的构造函数。请注意，在这种情况下，不同的次构造函数可以调用基类型的不同构造函数：

```kotlin
class MyView : View {
    constructor(ctx: Context) : super(ctx)

    constructor(ctx: Context, attrs: AttributeSet) : super(ctx, attrs)
}
```

## Open 关键字

在 Kotlin 中，`open` 关键字表示一个类或成员（函数或属性）可以在子类中被重写。
默认情况下，Kotlin 的类及其成员都是 *final* 的，这意味着除非你显式地将它们标记为 `open`，否则它们不能被继承（对于类）或重写（对于成员）：

```kotlin
// 使用 open 关键字标记基类以允许继承
open class Person(
    val name: String
) {
    // open 函数可以在子类中被重写
    open fun introduce() {
        println("Hello, my name is $name.")
    }
}

// 继承自 Person 并重写 introduce() 函数的子类
class Student(
    name: String,
    val school: String
) : Person(name) {
    override fun introduce() {
        println("Hi, I'm $name, and I study at $school.")
    }
}
```

如果你重写了基类的成员，则重写成员默认也是 open 的。如果你想改变这一点并禁止你的类的子类重写你的实现，你可以显式地将重写成员标记为 `final`：

```kotlin
// 使用 open 关键字标记基类以允许继承
open class Person(val name: String) {
    // open 函数可以在子类中被重写
    open fun introduce() {
        println("Hello, my name is $name.")
    }
}

// 继承自 Person 并重写 introduce() 函数的子类
class Student(name: String, val school: String) : Person(name) {
    // final 关键字阻止子类进一步重写
    final override fun introduce() {
        println("Hi, I'm $name, and I study at $school.")
    }
}
```

## 重写方法

Kotlin 要求对可重写成员和重写操作使用显式修饰符：

```kotlin
open class Shape {
    open fun draw() { /*...*/ }
    fun fill() { /*...*/ }
}

class Circle() : Shape() {
    override fun draw() { /*...*/ }
}
```

`Circle.draw()` 必须使用 `override` 修饰符。如果缺失，编译器将会报错。如果一个函数没有 `open` 修饰符（如 `Shape.fill()`），则不允许在子类中声明具有相同签名的的方法，无论是否使用 `override`。在 final 类（即没有 `open` 修饰符的类）的成员上添加 `open` 修饰符没有任何效果。

标记为 `override` 的成员本身是 open 的，因此它可以在子类中被重写。如果你想禁止再次重写，请使用 `final`：

```kotlin
open class Rectangle() : Shape() {
    final override fun draw() { /*...*/ }
}
```

## 重写属性

重写机制对属性的作用方式与对方法的作用方式相同。在超类中声明并在派生类中重新声明的属性必须以 `override` 开头，并且它们必须具有兼容的类型。每个声明的属性都可以由具有初始值设定项的属性或具有 `get` 方法的属性重写：

```kotlin
open class Shape {
    open val vertexCount: Int = 0
}

class Rectangle : Shape() {
    override val vertexCount = 4
}
```

你还可以用 `var` 属性重写 `val` 属性，但反之则不行。这是允许的，因为 `val` 属性本质上声明了一个 `get` 方法，而将其重写为 `var` 则在派生类中额外声明了一个 `set` 方法。

请注意，你可以将 `override` 关键字作为主构造函数中属性声明的一部分使用：

```kotlin
interface Shape {
    val vertexCount: Int
}

class Rectangle(override val vertexCount: Int = 4) : Shape // 始终有 4 个顶点

class Polygon : Shape {
    override var vertexCount: Int = 0  // 稍后可以设置为任何数字
}
```

## 派生类初始化顺序

在构造派生类的新实例期间，基类初始化是作为第一步完成的（仅在计算基类构造函数的实参之后），这意味着它发生在派生类的初始化逻辑运行之前。

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

这意味着当基类构造函数执行时，在派生类中声明或重写的属性尚未初始化。在基类初始化逻辑中使用这些属性（无论是直接使用，还是通过另一个被重写的 `open` 成员实现间接使用）都可能导致错误行为或运行时故障。因此，在设计基类时，应避免在构造函数、属性初始值设定项或 `init` 代码块中使用 `open` 成员。

## 调用超类实现

派生类中的代码可以使用 `super` 关键字调用其超类函数和属性访问器的实现：

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

在内部类中，使用限定了外部类名称的 `super` 关键字访问外部类的超类：`super@Outer`：

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
            super@FilledRectangle.draw() // 调用 Rectangle 的 draw() 实现
            fill()
            println("Drawn a filled rectangle with color ${super@FilledRectangle.borderColor}") // 使用 Rectangle 的 borderColor 的 get() 实现
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

## 重写规则

在 Kotlin 中，实现继承受以下规则约束：如果一个类从其直接超类继承了同一个成员的多个实现，则它必须重写该成员并提供自己的实现（可以使用继承的实现之一）。

为了表示从中获取继承实现的超类型，请使用由尖括号中的超类型名称限定的 `super`，例如 `super<Base>`：

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

同时继承 `Rectangle` 和 `Polygon` 是可以的，但它们都有各自的 `draw()` 实现，因此你需要在 `Square` 中重写 `draw()` 并为其提供单独的实现，以消除歧义。