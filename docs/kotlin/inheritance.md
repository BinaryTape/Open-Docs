[//]: # (title: 继承)

> 在使用类创建继承层级之前，请考虑使用[抽象类](classes.md#abstract-classes)或[接口](interfaces.md)。
> 默认情况下，你可以继承抽象类和接口。它们旨在让其他类可以继承它们的成员并实现它们。
>
{style="tip"}

Kotlin 中的所有类都有一个共同的超类 `Any`，它是未声明任何超类型的类的默认超类：

```kotlin
class Example // 隐式继承自 Any
```

`Any` 有三个方法：`equals()`、`hashCode()` 和 `toString()`。因此，所有 Kotlin 类都定义了这些方法。

默认情况下，Kotlin 类是 `final` 的，即它们不能被继承。要使一个类可继承，请用 `open` 关键字标记它：

```kotlin
open class Base // 类可用于继承

```

[关于 `open` 关键字的更多信息，请参见 Open 关键字](#open-keyword)。

要声明一个显式超类型，请在类头中的冒号后放置该类型：

```kotlin
open class Base(p: Int)

class Derived(p: Int) : Base(p)
```

如果派生类有一个主构造函数，则基类可以在该主构造函数中根据其形参进行初始化（并且必须初始化）。

如果派生类没有主构造函数，则每个次构造函数都必须使用 `super` 关键字初始化基类型，或者委托给另一个执行此操作的构造函数。请注意，在这种情况下，不同的次构造函数可以调用基类型的不同构造函数：

```kotlin
class MyView : View {
    constructor(ctx: Context) : super(ctx)

    constructor(ctx: Context, attrs: AttributeSet) : super(ctx, attrs)
}
```

## Open 关键字

在 Kotlin 中，`open` 关键字表明一个类或成员（函数或属性）可以在子类中被覆盖。默认情况下，Kotlin 类及其成员是 _final_ 的，这意味着它们不能被继承（对于类而言）或被覆盖（对于成员而言），除非你显式地将它们标记为 `open`：

```kotlin
// 带有 open 关键字的基类，允许被继承
open class Person(
    val name: String
) {
    // 可以在子类中被覆盖的 open 函数
    open fun introduce() {
        println("Hello, my name is $name.")
    }
}

// 继承自 Person 并覆盖 introduce() 函数的子类
class Student(
    name: String,
    val school: String
) : Person(name) {
    override fun introduce() {
        println("Hi, I'm $name, and I study at $school.")
    }
}
```

如果你覆盖基类的一个成员，该覆盖成员默认也是 `open` 的。如果你想改变这一点并禁止你的类的子类覆盖你的实现，你可以显式地将覆盖成员标记为 `final`：

```kotlin
// 带有 open 关键字的基类，允许被继承
open class Person(val name: String) {
    // 可以在子类中被覆盖的 open 函数
    open fun introduce() {
        println("Hello, my name is $name.")
    }
}

// 继承自 Person 并覆盖 introduce() 函数的子类
class Student(name: String, val school: String) : Person(name) {
    // final 关键字可防止在子类中进一步覆盖
    final override fun introduce() {
        println("Hi, I'm $name, and I study at $school.")
    }
}
```

## 覆盖方法

Kotlin 要求对可覆盖成员和覆盖使用显式修饰符：

```kotlin
open class Shape {
    open fun draw() { /*...*/ }
    fun fill() { /*...*/ }
}

class Circle() : Shape() {
    override fun draw() { /*...*/ }
}
```

`Circle.draw()` 必须使用 `override` 修饰符。如果缺少，编译器会报错。如果函数没有 `open` 修饰符（例如 `Shape.fill()`），则不允许在子类中声明具有相同签名的方法，无论是否使用 `override`。`open` 修饰符添加到 `final` 类（即没有 `open` 修饰符的类）的成员时没有效果。

标记为 `override` 的成员本身是 `open` 的，因此它可以在子类中被覆盖。如果你想禁止再次覆盖，请使用 `final`：

```kotlin
open class Rectangle() : Shape() {
    final override fun draw() { /*...*/ }
}
```

## 覆盖属性

覆盖机制对属性的作用方式与对方法的作用方式相同。在超类中声明，然后在派生类中重新声明的属性必须以 `override` 为前缀，并且它们必须具有兼容的类型。每个声明的属性都可以通过具有初始化器或具有 `get` 方法的属性来覆盖：

```kotlin
open class Shape {
    open val vertexCount: Int = 0
}

class Rectangle : Shape() {
    override val vertexCount = 4
}
```

你也可以使用 `var` 属性覆盖 `val` 属性，但不能反之。这是允许的，因为 `val` 属性本质上声明了一个 `get` 方法，而将其作为 `var` 覆盖会在派生类中额外声明一个 `set` 方法。

请注意，你可以在主构造函数中使用 `override` 关键字作为属性声明的一部分：

```kotlin
interface Shape {
    val vertexCount: Int
}

class Rectangle(override val vertexCount: Int = 4) : Shape // 始终有 4 个顶点

class Polygon : Shape {
    override var vertexCount: Int = 0  // 稍后可以设置为任何数字
}
```

## 派生类的初始化顺序

在构建派生类的新实例期间，基类初始化是第一步（仅在求值基类构造函数实参之后），这意味着它发生在派生类的初始化逻辑运行之前。

```kotlin
//sampleStart
open class Base(val name: String) {

    init { println("初始化基类") }

    open val size: Int = 
        name.length.also { println("在基类中初始化 size: $it") }
}

class Derived(
    name: String,
    val lastName: String,
) : Base(name.replaceFirstChar { it.uppercase() }.also { println("基类的实参: $it") }) {

    init { println("初始化派生类") }

    override val size: Int =
        (super.size + lastName.length).also { println("在派生类中初始化 size: $it") }
}
//sampleEnd

fun main() {
    println("构建派生类(\"hello\", \"world\")")
    Derived("hello", "world")
}
```
{kotlin-runnable="true"}

这意味着当基类构造函数执行时，在派生类中声明或覆盖的属性尚未初始化。在基类初始化逻辑中（无论是直接还是通过另一个被覆盖的 `open` 成员实现间接）使用任何这些属性都可能导致不正确的行为或运行时故障。因此，在设计基类时，应避免在构造函数、属性初始化器或 `init` 代码块中使用 `open` 成员。

## 调用超类的实现

派生类中的代码可以使用 `super` 关键字调用其超类函数和属性访问器实现：

```kotlin
open class Rectangle {
    open fun draw() { println("绘制矩形") }
    val borderColor: String get() = "black"
}

class FilledRectangle : Rectangle() {
    override fun draw() {
        super.draw()
        println("填充矩形")
    }

    val fillColor: String get() = super.borderColor
}
```

在内部类中，访问外部类的超类是使用 `super` 关键字并用外部类名限定来完成的：`super@Outer`：

```kotlin
open class Rectangle {
    open fun draw() { println("绘制矩形") }
    val borderColor: String get() = "black"
}

//sampleStart
class FilledRectangle: Rectangle() {
    override fun draw() {
        val filler = Filler()
        filler.drawAndFill()
    }
    
    inner class Filler {
        fun fill() { println("填充") }
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

## 覆盖规则

在 Kotlin 中，实现继承受以下规则约束：如果一个类从其直接超类继承了同一成员的多个实现，它必须覆盖该成员并提供其自身的实现（或许可以使用其中一个继承的实现）。

要指明继承实现来自的超类型，请使用 `super` 关键字，并用尖括号中的超类型名限定，例如 `super<Base>`：

```kotlin
open class Rectangle {
    open fun draw() { /* ... */ }
}

interface Polygon {
    fun draw() { /* ... */ } // 接口成员默认为 'open'
}

class Square() : Rectangle(), Polygon {
    // 编译器要求覆盖 draw()：
    override fun draw() {
        super<Rectangle>.draw() // 调用 Rectangle.draw()
        super<Polygon>.draw() // 调用 Polygon.draw()
    }
}
```

同时继承 `Rectangle` 和 `Polygon` 是允许的，但它们都有各自的 `draw()` 实现，因此你需要在 `Square` 中覆盖 `draw()` 并为其提供单独的实现以消除歧义。