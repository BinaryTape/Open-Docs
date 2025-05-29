[//]: # (title: 可见性修饰符)

类、对象、接口、构造函数和函数，以及属性和它们的设置器，都可以拥有*可见性修饰符*。获取器总是与它们所属属性具有相同的可见性。

Kotlin 中有四种可见性修饰符：`private`、`protected`、`internal` 和 `public`。默认可见性是 `public`。

在本页面中，你将学习这些修饰符如何应用于不同类型的声明作用域。

## 包

函数、属性、类、对象和接口可以直接在包内部的“顶层”声明：

```kotlin
// file name: example.kt
package foo

fun baz() { ... }
class Bar { ... }
```

*   如果你不使用可见性修饰符，则默认使用 `public`，这意味着你的声明将在任何地方都可见。
*   如果你将声明标记为 `private`，它将只在包含该声明的文件内部可见。
*   如果你将其标记为 `internal`，它将在同一[模块](#modules)中的任何地方都可见。
*   `protected` 修饰符不适用于顶层声明。

>要从另一个包中使用可见的顶层声明，你应该[导入](packages.md#imports)它。
>
{style="note"}

示例：

```kotlin
// file name: example.kt
package foo

private fun foo() { ... } // visible inside example.kt

public var bar: Int = 5 // property is visible everywhere
    private set         // setter is visible only in example.kt
    
internal val baz = 6    // visible inside the same module
```

## 类成员

对于在类内部声明的成员：

*   `private` 意味着该成员只在该类内部可见（包括该类的所有成员）。
*   `protected` 意味着该成员具有与标记为 `private` 的成员相同的可见性，但它在子类中也可见。
*   `internal` 意味着*此模块内*任何看到声明类的客户端都能看到其 `internal` 成员。
*   `public` 意味着任何看到声明类的客户端都能看到其 `public` 成员。

>在 Kotlin 中，外部类看不到其内部类的私有成员。
>
{style="note"}

如果你重写一个 `protected` 或 `internal` 成员，并且没有显式指定可见性，则重写成员也将与原始成员具有相同的可见性。

示例：

```kotlin
open class Outer {
    private val a = 1
    protected open val b = 2
    internal open val c = 3
    val d = 4  // public by default
    
    protected class Nested {
        public val e: Int = 5
    }
}

class Subclass : Outer() {
    // a is not visible
    // b, c and d are visible
    // Nested and e are visible

    override val b = 5   // 'b' is protected
    override val c = 7   // 'c' is internal
}

class Unrelated(o: Outer) {
    // o.a, o.b are not visible
    // o.c and o.d are visible (same module)
    // Outer.Nested is not visible, and Nested::e is not visible either 
}
```

### 构造函数

使用以下语法来指定类主构造函数的可见性：

>你需要添加显式的 `constructor` 关键字。
>
{style="note"}

```kotlin
class C private constructor(a: Int) { ... }
```

这里构造函数是 `private`。默认情况下，所有构造函数都是 `public`，这实际上意味着它们在类可见的任何地方都可见（这意味着 `internal` 类的构造函数只在同一模块中可见）。

对于密封类，构造函数默认是 `protected`。更多信息，请参阅[密封类](sealed-classes.md#constructors)。

### 局部声明

局部变量、函数和类不能拥有可见性修饰符。

## 模块

`internal` 可见性修饰符意味着成员在同一模块内可见。更具体地说，一个模块是一组 Kotlin 文件一起编译的集合，例如：

*   一个 IntelliJ IDEA 模块。
*   一个 Maven 项目。
*   一个 Gradle 源集（例外情况是 `test` 源集可以访问 `main` 的内部声明）。
*   通过一次 `<kotlinc>` Ant 任务调用编译的一组文件。