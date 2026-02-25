[//]: # (title: 可见性修饰符)

类、对象、接口、构造函数和函数，以及属性及其 setter，都可以具有 *可见性修饰符*。
Getter 的可见性始终与其属性相同。

Kotlin 中有四种可见性修饰符：`private`、`protected`、`internal` 和 `public`。
默认可见性为 `public`。

在本页面中，你将了解这些修饰符如何应用于不同类型的声明作用域。

## 软件包

函数、属性、类、对象和接口可以直接在软件包内的“顶级”进行声明：

```kotlin
// 文件名：example.kt
package foo

fun baz() { ... }
class Bar { ... }
```

* 如果不使用可见性修饰符，则默认使用 `public`，这意味着你的声明在任何地方都可见。
* 如果将声明标记为 `private`，它将仅在包含该声明的文件内可见。
* 如果将其标记为 `internal`，它在同一个[模块](#modules)中随处可见。
* `protected` 修饰符不适用于顶级声明。

> 要在另一个软件包中使用可见的顶级声明，应当将其[导入](packages.md#imports)。
>
{style="note"}

示例：

```kotlin
// 文件名：example.kt
package foo

private fun foo() { ... } // 在 example.kt 内可见

public var bar: Int = 5 // 属性随处可见
    private set         // setter 仅在 example.kt 内可见
    
internal val baz = 6    // 在同一个模块内可见
```

## 类成员

对于在类内部声明的成员：

* `private` 表示该成员仅在此类内部（包括其所有成员）可见。
* `protected` 表示该成员具有与标记为 `private` 相同的可见性，但在子类中也可见。
* `internal` 表示该*模块内*任何能够看到声明类的客户端都能看到其 `internal` 成员。
* `public` 表示任何能够看到声明类的客户端都能看到其 `public` 成员。

> 在 Kotlin 中，外部类看不到其内部类的私有成员。
>
{style="note"}

如果你重写一个 `protected` 或 `internal` 成员且未显式指定可见性，则重写成员将具有与原始成员相同的可见性。

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
    // b, c 和 d 可见
    // Nested 和 e 可见

    override val b = 5   // 'b' 是 protected
    override val c = 7   // 'c' 是 internal
}

class Unrelated(o: Outer) {
    // o.a, o.b 不可见
    // o.c 和 o.d 可见（相同模块）
    // Outer.Nested 不可见，Nested::e 也不可见 
}
```

### 构造函数

使用以下语法指定类的主构造函数的可见性：

> 你需要添加显式的 `constructor` 关键字。
>
{style="note"}

```kotlin
class C private constructor(a: Int) { ... }
```

这里的构造函数是 `private`。默认情况下，所有构造函数都是 `public`，这实际上等同于它们在类可见的任何地方都可见（这意味着 `internal` 类的构造函数仅在同一个模块内可见）。

对于密封类，构造函数默认是 `protected`。更多信息请参阅[密封类](sealed-classes.md#constructors)。

### 局部声明

局部变量、函数和类不能有可见性修饰符。

## 模块

`internal` 可见性修饰符意味着成员在同一个模块内可见。更具体地说，一个模块是编译在一起的一组 Kotlin 文件，例如：

* 一个 IntelliJ IDEA 模块。
* 一个 Maven 项目。
* 一个 Gradle 源集（例外情况是 `test` 源集可以访问 `main` 的内部声明）。