[//]: # (title: 可见性修饰符)

类、对象、接口、构造函数和函数，以及属性及其 setter，都可以拥有*可见性修饰符*。
getter 总是与其属性拥有相同的可见性。

Kotlin 中有四种可见性修饰符：`private`、`protected`、`internal` 和 `public`。
默认可见性为 `public`。

在本页，你将了解这些修饰符如何应用于不同类型的声明作用域。

## 包

函数、属性、类、对象和接口可以直接在包内“顶层”声明：

```kotlin
// file name: example.kt
package foo

fun baz() { ... }
class Bar { ... }
```

*   如果你不使用可见性修饰符，则默认使用 `public`，这意味着你的声明将在任何地方都可见。
*   如果你将声明标记为 `private`，它将只在包含该声明的文件内可见。
*   如果你将其标记为 `internal`，它将在同一[模块](#modules)内的任何地方可见。
*   `protected` 修饰符不适用于顶层声明。

>要从另一个包中使用可见的顶层声明，你应当[导入](packages.md#imports)它。
>
{style="note"}

示例：

```kotlin
// file name: example.kt
package foo

private fun foo() { ... } // 在 example.kt 文件内可见

public var bar: Int = 5 // 属性在任何地方都可见
    private set         // setter 仅在 example.kt 文件内可见
    
internal val baz = 6    // 在同一模块内可见
```

## 类成员

对于在类中声明的成员：

*   `private` 意味着该成员仅在此类内部可见（包括其所有成员）。
*   `protected` 意味着该成员与标记为 `private` 的成员具有相同的可见性，但它在子类中也可见。
*   `internal` 意味着*此模块内*任何查看声明类的客户端都能看到其 `internal` 成员。
*   `public` 意味着任何查看声明类的客户端都能看到其 `public` 成员。

> 在 Kotlin 中，外部类无法看到其内部类的 `private` 成员。
>
{style="note"}

如果你覆盖一个 `protected` 或 `internal` 成员并且没有显式指定可见性，则覆盖成员也将拥有与原始成员相同的可见性。

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
    // o.a、o.b 不可见
    // o.c 和 o.d 可见（在同一模块内）
    // Outer.Nested 不可见，Nested::e 也不可见
}
```

### 构造函数

使用以下语法指定类主构造函数的可见性：

> 你需要添加一个显式的 `constructor` 关键字。
>
{style="note"}

```kotlin
class C private constructor(a: Int) { ... }
```

这里构造函数是 `private`。默认情况下，所有构造函数都是 `public`，这实际上意味着它们在类可见的任何地方都可见（这意味着 `internal` 类的构造函数仅在同一模块内可见）。

对于密封类，构造函数默认是 `protected`。关于更多信息，请参见[密封类](sealed-classes.md#constructors)。

### 局部声明

局部变量、函数和类不能拥有可见性修饰符。

## 模块

`internal` 可见性修饰符意味着该成员在同一模块内可见。更具体地说，模块是一组共同编译的 Kotlin 文件，例如：

*   一个 IntelliJ IDEA 模块。
*   一个 Maven 项目。
*   一个 Gradle 源代码集（例外情况是 `test` 源代码集可以访问 `main` 的 `internal` 声明）。