---
title: 嵌套类和内部类
---
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

你也可以将接口与嵌套一起使用。类和接口的所有组合都是可能的：你可以在类中嵌套接口，在接口中嵌套类，以及在接口中嵌套接口。

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

## 内部类 (Inner classes)

一个被标记为 `inner` 的嵌套类可以访问其外部类的成员。内部类持有对外部类对象的引用：

```kotlin
class Outer {
    private val bar: Int = 1
    inner class Inner {
        fun foo() = bar
    }
}

val demo = Outer().Inner().foo() // == 1
```

请参阅[限定的 `this` 表达式](this-expressions) 以了解内部类中 `this` 的消除歧义。

## 匿名内部类 (Anonymous inner classes)

匿名内部类实例是使用[对象表达式](object-declarations#object-expressions)创建的：

```kotlin
window.addMouseListener(object : MouseAdapter() {

    override fun mouseClicked(e: MouseEvent) { ... }

    override fun mouseEntered(e: MouseEvent) { ... }
})
```

:::note
在 JVM 上，如果对象是 Java 函数式接口（即只有一个抽象方法的 Java 接口）的实例，你可以使用带有接口类型前缀的 Lambda 表达式来创建它：

```kotlin
val listener = ActionListener { println("clicked") }
```

:::