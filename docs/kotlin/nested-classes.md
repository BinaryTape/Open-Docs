[//]: # (title: 嵌套类与内部类)

类可以嵌套在其他类中：

```kotlin
class Outer {
    private val bar: Int = 1
    class Nested {
        fun foo() = 2
    }
}

val demo = Outer.Nested().foo() // == 2
```

您也可以在嵌套中使用接口。类和接口的所有组合形式都是可能的：您可以将接口嵌套在类中、将类嵌套在接口中，以及将接口嵌套在接口中。

```kotlin
interface OuterInterface {
    class InnerClass
    interface InnerInterface
}

class OuterClass {
    class InnerClass
    interface InnerInterface
}
```

## 内部类

标记为 `inner` 的嵌套类可以访问其外部类的成员。内部类持有对外部类对象的引用：

```kotlin
class Outer {
    private val bar: Int = 1
    inner class Inner {
        fun foo() = bar
    }
}

val demo = Outer().Inner().foo() // == 1
```

请参阅[限定的 `this` 表达式](this-expressions.md)以了解如何消除内部类中 `this` 的歧义。

## 匿名内部类

匿名内部类实例是使用[对象表达式](object-declarations.md#object-expressions)创建的：

```kotlin
window.addMouseListener(object : MouseAdapter() {

    override fun mouseClicked(e: MouseEvent) { ... }

    override fun mouseEntered(e: MouseEvent) { ... }
})
```

> 在 JVM 上，如果对象是函数式 Java 接口（即具有单个抽象方法的 Java 接口）的实例，您可以使用带接口类型前缀的 lambda表达式来创建它：
>
>```kotlin
> val listener = ActionListener { println("clicked") }
> ```
>
{style="note"}