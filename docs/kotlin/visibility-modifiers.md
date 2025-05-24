---
title: 可见性修饰符
---
类（Classes）、对象（objects）、接口（interfaces）、构造函数（constructors）和函数（functions），以及属性（properties）和它们的 setter，都可以有*可见性修饰符*（visibility modifiers）。
Getter 始终与其属性具有相同的可见性。

Kotlin 中有四种可见性修饰符：`private`、`protected`、`internal` 和 `public`。
默认的可见性是 `public`。

在本页中，你将学习这些修饰符如何应用于不同类型的声明作用域。

## 包（Packages）

函数、属性、类、对象和接口可以直接在包内“顶层”声明：

```kotlin
// file name: example.kt
package foo

fun baz() { ... }
class Bar { ... }
```

* 如果你不使用可见性修饰符，默认使用 `public`，这意味着你的声明在任何地方都是可见的。
* 如果你将一个声明标记为 `private`，它将只在包含该声明的文件中可见。
* 如果你将其标记为 `internal`，它将在同一个[模块](#modules)中的任何地方可见。
* `protected` 修饰符不适用于顶层声明。

:::note
要使用来自另一个包的可见顶层声明，你应该[导入](packages#imports)它。

:::

示例：

```kotlin
// file name: example.kt
package foo

private fun foo() { ... } // 在 example.kt 中可见

public var bar: Int = 5 // 属性在任何地方都可见
    private set         // setter 仅在 example.kt 中可见
    
internal val baz = 6    // 在同一模块内可见
```

## 类成员（Class members）

对于在类中声明的成员：

* `private` 表示该成员仅在此类中可见（包括其所有成员）。
* `protected` 表示该成员具有与标记为 `private` 的成员相同的可见性，但它在子类中也是可见的。
* `internal` 表示*在此模块内*的任何看到声明类的客户端都能看到其 `internal` 成员。
* `public` 表示任何看到声明类的客户端都能看到其 `public` 成员。

:::note
在 Kotlin 中，外部类看不到其内部类的私有成员。

:::

如果你覆盖（override）一个 `protected` 或 `internal` 成员并且没有显式指定可见性，则覆盖成员也将具有与原始成员相同的可见性。

示例：

```kotlin
open class Outer {
    private val a = 1
    protected open val b = 2
    internal open val c = 3
    val d = 4  // 默认为 public
    
    protected class Nested {
        public val e: Int = 5
    }
}

class Subclass : Outer() {
    // a 不可见
    // b、c 和 d 可见
    // Nested 和 e 可见

    override val b = 5   // 'b' 是 protected
    override val c = 7   // 'c' 是 internal
}

class Unrelated(o: Outer) {
    // o.a, o.b 不可见
    // o.c 和 o.d 可见 (同一模块)
    // Outer.Nested 不可见, Nested::e 也不可见
}
```

### 构造函数（Constructors）

使用以下语法来指定类的主要构造函数（primary constructor）的可见性：

:::note
你需要添加一个显式的 `constructor` 关键字。

:::

```kotlin
class C private constructor(a: Int) { ... }
```

这里构造函数是 `private` 的。默认情况下，所有构造函数都是 `public`，这实际上相当于它们在类可见的任何地方都可见（这意味着 `internal` 类的构造函数仅在同一模块内可见）。

对于密封类（sealed classes），构造函数默认为 `protected`。有关更多信息，请参阅[密封类](sealed-classes#constructors)。

### 局部声明（Local declarations）

局部变量、函数和类不能有可见性修饰符。

## 模块（Modules）

`internal` 可见性修饰符表示该成员在同一模块内可见。更具体地说，模块是一组一起编译的 Kotlin 文件，例如：

* 一个 IntelliJ IDEA 模块。
* 一个 Maven 项目。
* 一个 Gradle 源码集（source set）（但 `test` 源码集可以访问 `main` 的 internal 声明）。
* 一组通过一次调用 `<kotlinc>` Ant 任务编译的文件。