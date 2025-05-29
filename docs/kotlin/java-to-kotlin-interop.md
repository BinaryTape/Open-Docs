[//]: # (title: 从 Java 调用 Kotlin)

Kotlin 代码可以轻松地从 Java 调用。例如，Kotlin 类的实例可以在 Java 方法中无缝创建和操作。
然而，Java 和 Kotlin 之间存在某些差异，在将 Kotlin 代码集成到 Java 时需要注意。
在此页面上，我们将介绍如何调整 Kotlin 代码与 Java 客户端的互操作性。

## 属性

Kotlin 属性被编译为以下 Java 元素：

*   一个 getter 方法，其名称通过在属性名前添加 `get` 前缀计算得出
*   一个 setter 方法，其名称通过在属性名前添加 `set` 前缀计算得出（仅适用于 `var` 属性）
*   一个私有字段，其名称与属性名相同（仅适用于带有幕后字段的属性）

例如，`var firstName: String` 编译为以下 Java 声明：

```java
private String firstName;

public String getFirstName() {
    return firstName;
}

public void setFirstName(String firstName) {
    this.firstName = firstName;
}
```

如果属性名称以 `is` 开头，则使用不同的名称映射规则：getter 的名称将与属性名称相同，而 setter 的名称将通过将 `is` 替换为 `set` 获得。例如，对于属性 `isOpen`，getter 将被称为 `isOpen()`，setter 将被称为 `setOpen()`。此规则适用于任何类型的属性，而不仅仅是 `Boolean`。

## 包级别函数

所有声明在 `org.example` 包内 `app.kt` 文件中的函数和属性，包括扩展函数，都被编译为名为 `org.example.AppKt` 的 Java 类的静态方法。

```kotlin
// app.kt
package org.example

class Util

fun getTime() { /*...*/ }

```

```java
// Java
new org.example.Util();
org.example.AppKt.getTime();
```

要为生成的 Java 类设置自定义名称，请使用 `@JvmName` 注解：

```kotlin
@file:JvmName("DemoUtils")

package org.example

class Util

fun getTime() { /*...*/ }

```

```java
// Java
new org.example.Util();
org.example.DemoUtils.getTime();
```

通常情况下，多个文件具有相同的生成 Java 类名（相同的包名和文件名，或相同的 [`@JvmName`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.jvm/-jvm-name/index.html) 注解）会导致错误。然而，编译器可以生成一个单独的 Java 外观类 (facade class)，该类具有指定的名称，并包含所有具有该名称的文件中的所有声明。要启用此类外观类的生成，请在所有此类文件中使用 [`@JvmMultifileClass`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.jvm/-jvm-multifile-class/index.html) 注解。

```kotlin
// oldutils.kt
@file:JvmName("Utils")
@file:JvmMultifileClass

package org.example

fun getTime() { /*...*/ }
```

```kotlin
// newutils.kt
@file:JvmName("Utils")
@file:JvmMultifileClass

package org.example

fun getDate() { /*...*/ }
```

```java
// Java
org.example.Utils.getTime();
org.example.Utils.getDate();
```

## 实例字段

如果你需要在 Java 中将 Kotlin 属性公开为字段，请使用 [`@JvmField`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.jvm/-jvm-field/index.html) 注解对其进行标注。该字段将具有与底层属性相同的可见性。你可以使用 `@JvmField` 注解属性，如果它满足以下条件：
*   具有幕后字段
*   不是私有的
*   没有 `open`、`override` 或 `const` 修饰符
*   不是委托属性

```kotlin
class User(id: String) {
    @JvmField val ID = id
}
```

```java

// Java
class JavaClient {
    public String getID(User user) {
        return user.ID;
    }
}
```

[延迟初始化 (Late-Initialized)](properties.md#late-initialized-properties-and-variables) 属性也会被公开为字段。字段的可见性将与 `lateinit` 属性 setter 的可见性相同。

## 静态字段

在命名对象 (named object) 或伴生对象 (companion object) 中声明的 Kotlin 属性将在该命名对象或包含伴生对象的类中拥有静态幕后字段。

通常这些字段是私有的，但可以通过以下方式之一公开：

-   [`@JvmField`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.jvm/-jvm-field/index.html) 注解
-   `lateinit` 修饰符
-   `const` 修饰符

使用 `@JvmField` 注解此类属性会使其成为一个静态字段，具有与属性本身相同的可见性。

```kotlin
class Key(val value: Int) {
    companion object {
        @JvmField
        val COMPARATOR: Comparator<Key> = compareBy<Key> { it.value }
    }
}
```

```java
// Java
Key.COMPARATOR.compare(key1, key2);
// public static final field in Key class
```

命名对象或伴生对象中的[延迟初始化](properties.md#late-initialized-properties-and-variables)属性具有静态幕后字段，其可见性与属性 setter 相同。

```kotlin
object Singleton {
    lateinit var provider: Provider
}
```

```java

// Java
Singleton.provider = new Provider();
// public static non-final field in Singleton class
```

声明为 `const` 的属性（在类中以及在顶层）在 Java 中会转换为静态字段：

```kotlin
// file example.kt

object Obj {
    const val CONST = 1
}

class C {
    companion object {
        const val VERSION = 9
    }
}

const val MAX = 239
```

在 Java 中：

```java

int constant = Obj.CONST;
int max = ExampleKt.MAX;
int version = C.VERSION;
```

## 静态方法

如上所述，Kotlin 将包级别函数表示为静态方法。如果你将命名对象或伴生对象中定义的函数注解为 [`@JvmStatic`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.jvm/-jvm-static/index.html)，Kotlin 也可以为这些函数生成静态方法。如果你使用此注解，编译器将在对象的包含类中生成一个静态方法，并在对象本身中生成一个实例方法。例如：

```kotlin
class C {
    companion object {
        @JvmStatic fun callStatic() {}
        fun callNonStatic() {}
    }
}
```

现在，`callStatic()` 在 Java 中是静态的，而 `callNonStatic()` 不是：

```java

C.callStatic(); // works fine
C.callNonStatic(); // error: not a static method
C.Companion.callStatic(); // instance method remains
C.Companion.callNonStatic(); // the only way it works
```

命名对象也是如此：

```kotlin
object Obj {
    @JvmStatic fun callStatic() {}
    fun callNonStatic() {}
}
```

在 Java 中：

```java

Obj.callStatic(); // works fine
Obj.callNonStatic(); // error
Obj.INSTANCE.callNonStatic(); // works, a call through the singleton instance
Obj.INSTANCE.callStatic(); // works too
```

从 Kotlin 1.3 开始，`@JvmStatic` 也适用于接口伴生对象中定义的函数。这些函数编译为接口中的静态方法。请注意，接口中的静态方法是在 Java 1.8 中引入的，因此请确保使用相应的目标。

```kotlin
interface ChatBot {
    companion object {
        @JvmStatic fun greet(username: String) {
            println("Hello, $username")
        }
    }
}
```

`@JvmStatic` 注解也可以应用于对象或伴生对象的属性，使其 getter 和 setter 方法成为该对象或包含伴生对象的类中的静态成员。

## 接口中的默认方法

>默认方法仅适用于 JVM 1.8 及更高版本的目标。
>
{style="note"}

从 JDK 1.8 开始，Java 中的接口可以包含[默认方法](https://docs.oracle.com/javase/tutorial/java/IandI/defaultmethods.html)。要使 Kotlin 接口的所有非抽象成员成为实现它们的 Java 类的默认成员，请使用 `-Xjvm-default=all` 编译器选项编译 Kotlin 代码。

以下是带有默认方法的 Kotlin 接口示例：

```kotlin
// compile with -Xjvm-default=all

interface Robot {
    fun move() { println("~walking~") }  // 在 Java 接口中将是默认方法
    fun speak(): Unit
}
```

默认实现可用于实现该接口的 Java 类。

```java
//Java implementation
public class C3PO implements Robot {
    // move() implementation from Robot is available implicitly
    @Override
    public void speak() {
        System.out.println("I beg your pardon, sir");
    }
}
```

```java
C3PO c3po = new C3PO();
c3po.move(); // default implementation from the Robot interface
c3po.speak();
```

接口的实现可以覆盖默认方法。

```java
//Java
public class BB8 implements Robot {
    //own implementation of the default method
    @Override
    public void move() {
        System.out.println("~rolling~");
    }

    @Override
    public void speak() {
        System.out.println("Beep-beep");
    }
}
```

> 在 Kotlin 1.4 之前，要生成默认方法，你可以在这些方法上使用 `@JvmDefault` 注解。在 1.4+ 中使用 `-Xjvm-default=all` 进行编译通常与你在接口的所有非抽象方法上使用 `@JvmDefault` 并使用 `-Xjvm-default=enable` 进行编译的效果相同。然而，在某些情况下它们的行为会有所不同。有关 Kotlin 1.4 中默认方法生成更改的详细信息，请参阅 Kotlin 博客上的[这篇帖子](https://blog.jetbrains.com/kotlin/2020/07/kotlin-1-4-m3-generating-default-methods-in-interfaces/)。
>
{style="note"}

### 默认方法的兼容模式

如果存在使用未带 `-Xjvm-default=all` 选项编译的 Kotlin 接口的客户端，则它们可能与带此选项编译的代码存在二进制不兼容性。为避免破坏与此类客户端的兼容性，请使用 `-Xjvm-default=all` 模式并使用 [`@JvmDefaultWithCompatibility`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.jvm/-jvm-default-with-compatibility/) 注解标记接口。这允许你一次性将此注解添加到公共 API 中的所有接口，并且新开发的非公共代码无需使用任何注解。

> 从 Kotlin 1.6.20 开始，你可以在默认模式（`-Xjvm-default=disable` 编译器选项）下编译模块，以兼容使用 `-Xjvm-default=all` 或 `-Xjvm-default=all-compatibility` 模式编译的模块。
>
{style="note"}

了解更多兼容模式：

#### disable {initial-collapse-state="collapsed" collapsible="true"}

默认行为。不生成 JVM 默认方法并禁止使用 `@JvmDefault` 注解。

#### all {initial-collapse-state="collapsed" collapsible="true"}

为模块中所有带有方法体的接口声明生成 JVM 默认方法。不为带有方法体的接口声明生成 [`DefaultImpls`](https://blog.jetbrains.com/kotlin/2020/07/kotlin-1-4-m3-generating-default-methods-in-interfaces/) 存根 (stubs)，这些在 `disable` 模式下默认会生成。

如果接口从 `disable` 模式下编译的接口继承了带方法体的方法且未对其进行覆盖，则会为其生成一个 `DefaultImpls` 存根。

__破坏二进制兼容性__，如果某些客户端代码依赖于 `DefaultImpls` 类的存在。

> 如果使用接口委托，所有接口方法都会被委托。唯一的例外是带有已废弃的 `@JvmDefault` 注解的方法。
>
{style="note"}

#### all-compatibility {initial-collapse-state="collapsed" collapsible="true"}

除了 `all` 模式外，还在 [`DefaultImpls`](https://blog.jetbrains.com/kotlin/2020/07/kotlin-1-4-m3-generating-default-methods-in-interfaces/) 类中生成兼容性存根。兼容性存根对于库和运行时作者而言非常有用，可以保持现有客户端与旧版本库的向后二进制兼容性。`all` 和 `all-compatibility` 模式正在改变库的 ABI (Application Binary Interface) 表面，客户端在重新编译库后将使用该表面。从这个意义上讲，客户端可能与以前的库版本不兼容。这通常意味着你需要适当的库版本控制，例如，SemVer (Semantic Versioning) 中的主版本号增加。

编译器会为 `DefaultImpls` 的所有成员生成 `@Deprecated` 注解：你不应该在 Java 代码中使用这些成员，因为编译器生成它们仅用于兼容性目的。

如果从以 `all` 或 `all-compatibility` 模式编译的 Kotlin 接口继承，`DefaultImpls` 兼容性存根将以标准的 JVM 运行时解析语义调用接口的默认方法。

对继承泛型接口的类执行额外的兼容性检查，在 `disable` 模式下，有时会生成带有特殊签名的额外隐式方法：与 `disable` 模式不同，如果你没有显式覆盖此类方法并且没有使用 `@JvmDefaultWithoutCompatibility` 注解该类，编译器将报告错误（有关更多详细信息，请参阅 [此 YouTrack issue](https://youtrack.jetbrains.com/issue/KT-39603)）。

## 可见性

Kotlin 的可见性修饰符以以下方式映射到 Java：

*   `private` 成员编译为 `private` 成员
*   `private` 顶层声明编译为 `private` 顶层声明。如果从类内部访问，也包括包私有 (package-private) 访问器。
*   `protected` 保持 `protected`（请注意，Java 允许从同一包中的其他类访问 `protected` 成员，而 Kotlin 不允许，因此 Java 类对代码的访问范围会更广）
*   `internal` 声明在 Java 中变为 `public`。`internal` 类的成员会经过名称修饰 (name mangling)，以使其更难从 Java 中意外使用，并允许对根据 Kotlin 规则互不可见的具有相同签名的成员进行重载。
*   `public` 保持 `public`

## KClass

有时你需要调用一个 Kotlin 方法，其参数类型为 `KClass`。没有从 `Class` 到 `KClass` 的自动转换，因此你必须通过调用等效于 `Class<T>.kotlin` 扩展属性的方式手动进行转换：

```kotlin
kotlin.jvm.JvmClassMappingKt.getKotlinClass(MainView.class)
```

## 使用 @JvmName 处理签名冲突

有时我们在 Kotlin 中有一个命名函数，但我们需要它在字节码中具有不同的 JVM 名称。最突出的例子是由于*类型擦除*而发生的：

```kotlin
fun List<String>.filterValid(): List<String>
fun List<Int>.filterValid(): List<Int>
```

这两个函数不能并排定义，因为它们的 JVM 签名相同：`filterValid(Ljava/util/List;)Ljava/util/List;`。如果我们确实希望它们在 Kotlin 中具有相同的名称，我们可以使用 [`@JvmName`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.jvm/-jvm-name/index.html) 注解其中一个（或两个）函数，并指定一个不同的名称作为参数：

```kotlin
fun List<String>.filterValid(): List<String>

@JvmName("filterValidInt")
fun List<Int>.filterValid(): List<Int>
```

从 Kotlin 中，它们将通过相同的名称 `filterValid` 访问，但从 Java 中，它们将是 `filterValid` 和 `filterValidInt`。

当我们需要一个属性 `x` 以及一个函数 `getX()` 时，也适用相同的技巧：

```kotlin
val x: Int
    @JvmName("getX_prop")
    get() = 15

fun getX() = 10
```

要更改未显式实现 getter 和 setter 的属性生成的访问器方法名称，可以使用 `@get:JvmName` 和 `@set:JvmName`：

```kotlin
@get:JvmName("x")
@set:JvmName("changeX")
var x: Int = 23
```

## 重载生成

通常，如果你编写一个带有默认参数值的 Kotlin 函数，它在 Java 中将仅以完整签名可见，所有参数都存在。如果你希望向 Java 调用者公开多个重载，可以使用 [`@JvmOverloads`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.jvm/-jvm-overloads/index.html) 注解。

此注解也适用于构造函数、静态方法等。它不能用于抽象方法，包括接口中定义的方法。

```kotlin
class Circle @JvmOverloads constructor(centerX: Int, centerY: Int, radius: Double = 1.0) {
    @JvmOverloads fun draw(label: String, lineWidth: Int = 1, color: String = "red") { /*...*/ }
}
```

对于每个带有默认值的参数，这将生成一个额外的重载，该重载移除了此参数以及参数列表中其右侧的所有参数。在此示例中，将生成以下内容：

```java
// Constructors:
Circle(int centerX, int centerY, double radius)
Circle(int centerX, int centerY)

// Methods
void draw(String label, int lineWidth, String color) { }
void draw(String label, int lineWidth) { }
void draw(String label) { }
```

请注意，如[次级构造函数](classes.md#secondary-constructors)中所述，如果一个类的所有构造函数参数都具有默认值，则会为其生成一个公共的无参数构造函数。即使未指定 `@JvmOverloads` 注解，这也有效。

## 受检异常

Kotlin 没有受检异常 (checked exceptions)。因此，通常 Kotlin 函数的 Java 签名不声明抛出的异常。因此，如果你有一个像这样的 Kotlin 函数：

```kotlin
// example.kt
package demo

fun writeToFile() {
    /*...*/
    throw IOException()
}
```

并且你想从 Java 调用它并捕获异常：

```java

// Java
try {
    demo.Example.writeToFile();
} catch (IOException e) { 
    // error: writeToFile() does not declare IOException in the throws list
    // ...
}
```

你会收到 Java 编译器的错误消息，因为 `writeToFile()` 没有声明 `IOException`。要解决此问题，请在 Kotlin 中使用 [`@Throws`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-throws/index.html) 注解：

```kotlin
@Throws(IOException::class)
fun writeToFile() {
    /*...*/
    throw IOException()
}
```

## 空安全

从 Java 调用 Kotlin 函数时，没有人阻止我们传递 `null` 作为不可为空的参数。这就是为什么 Kotlin 会为所有期望非空值的公共函数生成运行时检查。这样我们就能立即在 Java 代码中得到 `NullPointerException`。

## 泛型变体

当 Kotlin 类使用[声明处变型 (declaration-site variance)](generics.md#declaration-site-variance) 时，它们的用法在 Java 代码中会以两种方式体现。例如，假设你有以下类和两个使用它的函数：

```kotlin
class Box<out T>(val value: T)

interface Base
class Derived : Base

fun boxDerived(value: Derived): Box<Derived> = Box(value)
fun unboxBase(box: Box<Base>): Base = box.value
```

将这些函数翻译成 Java 的一种朴素方法是这样：

```java
Box<Derived> boxDerived(Derived value) { ... }
Base unboxBase(Box<Base> box) { ... }
```

问题在于，在 Kotlin 中你可以编写 `unboxBase(boxDerived(Derived()))`，但在 Java 中这是不可能的，因为在 Java 中，`Box` 类在其参数 `T` 上是*不变*的，因此 `Box<Derived>` 不是 `Box<Base>` 的子类型。要在 Java 中使其工作，你必须将 `unboxBase` 定义如下：

```java
Base unboxBase(Box<? extends Base> box) { ... }  
```

此声明使用 Java 的*通配符类型* (`? extends Base`) 通过使用处变型 (use-site variance) 来模拟声明处变型，因为这是 Java 唯一拥有的方式。

为了使 Kotlin API 在 Java 中工作，当 `Box<Super>` (协变定义的 `Box`) 或 `Foo<? super Bar>` (逆变定义的 `Foo`) *作为参数*出现时，编译器会将其生成为 `Box<? extends Super>`。当它是一个返回值时，不会生成通配符，因为否则 Java 客户端将不得不处理它们（这与常见的 Java 编码风格相悖）。因此，我们示例中的函数实际翻译如下：

```java

// return type - no wildcards
Box<Derived> boxDerived(Derived value) { ... }
 
// parameter - wildcards 
Base unboxBase(Box<? extends Base> box) { ... }
```

> 当参数类型是 final 时，通常没有必要生成通配符，因此无论 `Box<String>` 处于何种位置，它始终是 `Box<String>`。
>
{style="note"}

如果需要在默认情况下未生成通配符的地方生成它们，请使用 `@JvmWildcard` 注解：

```kotlin
fun boxDerived(value: Derived): Box<@JvmWildcard Derived> = Box(value)
// is translated to 
// Box<? extends Derived> boxDerived(Derived value) { ... }
```

相反，如果你不需要生成通配符的地方出现它们，请使用 `@JvmSuppressWildcards`：

```kotlin
fun unboxBase(box: Box<@JvmSuppressWildcards Base>): Base = box.value
// is translated to 
// Base unboxBase(Box<Base> box) { ... }
```

>`@JvmSuppressWildcards` 不仅可以用于单个类型参数，还可以用于整个声明，例如函数或类，从而抑制其中所有的通配符。
>
{style="note"}

### Nothing 类型的转换
 
类型 [`Nothing`](exceptions.md#the-nothing-type) 是特殊的，因为它在 Java 中没有自然的对应物。事实上，每个 Java 引用类型，包括 `java.lang.Void`，都接受 `null` 作为值，而 `Nothing` 甚至不接受 `null`。因此，这种类型无法在 Java 世界中准确表示。这就是为什么当使用 `Nothing` 类型的参数时，Kotlin 会生成一个原始类型 (raw type)：

```kotlin
fun emptyList(): List<Nothing> = listOf()
// is translated to
// List emptyList() { ... }
```