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

接口也可以嵌套使用。类和接口的所有组合都是可行的：你可以在类中嵌套接口，在接口中嵌套类，以及在接口中嵌套接口。

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

标记为 `inner` 的嵌套类可以访问其外部类的成员。内部类持有一个外部类对象的引用：

```kotlin
class Outer {
    private val bar: Int = 1
    inner class Inner {
        fun foo() = bar
    }
}

val demo = Outer().Inner().foo() // == 1
```

关于内部类中 `this` 的消歧，请参见 [限定的 `this` 表达式](this-expressions.md)。

## 匿名内部类

匿名内部类实例可以通过 [对象表达式](object-declarations.md#object-expressions) 创建：

```kotlin
window.addMouseListener(object : MouseAdapter() {

    override fun mouseClicked(e: MouseEvent) { ... }

    override fun mouseEntered(e: MouseEvent) { ... }
})
```

> 在 JVM 上，如果该对象是函数式 Java 接口（即具有单个抽象方法的 Java 接口）的实例，则可以使用以该接口类型作为前缀的 lambda 表达式来创建它：
>
>```kotlin
> val listener = ActionListener { println("clicked") }
> ```
>
{style="note"}