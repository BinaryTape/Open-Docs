---
title: "从 Java 调用 Kotlin"
---
Kotlin 代码可以很容易地从 Java 中调用。例如，Kotlin 类的实例可以无缝地在 Java 方法中创建和操作。然而，在将 Kotlin 代码集成到 Java 中时，Java 和 Kotlin 之间存在一些差异需要注意。在本页中，我们将介绍如何调整 Kotlin 代码与 Java 客户端的互操作性。

## 属性

Kotlin 属性会被编译成以下 Java 元素：

* 一个 getter 方法，其名称通过在属性名称前加上 `get` 前缀来计算。
* 一个 setter 方法，其名称通过在属性名称前加上 `set` 前缀来计算（仅适用于 `var` 属性）。
* 一个私有字段，其名称与属性名称相同（仅适用于具有 backing fields 的属性）。

例如，`var firstName: String` 会编译成以下 Java 声明：

```java
private String firstName;

public String getFirstName() {
    return firstName;
}

public void setFirstName(String firstName) {
    this.firstName = firstName;
}
```

如果属性的名称以 `is` 开头，则使用不同的名称映射规则：getter 的名称与属性名称相同，而 setter 的名称通过将 `is` 替换为 `set` 获得。例如，对于属性 `isOpen`，getter 将被称为 `isOpen()`，而 setter 将被称为 `setOpen()`。此规则适用于任何类型的属性，而不仅仅是 `Boolean`。

## 包级函数

在包 `org.example` 中的文件 `app.kt` 中声明的所有函数和属性，包括扩展函数，都会被编译成名为 `org.example.AppKt` 的 Java 类的静态方法。

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

拥有多个具有相同生成的 Java 类名称的文件（相同的包和相同的名称或相同的
[`@JvmName`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.jvm/-jvm-name/index.html) 注解）通常是一个错误。
但是，编译器可以生成一个单一的 Java facade class，它具有指定的名称，并包含所有具有该名称的文件的所有声明。
要启用这种 facade 的生成，请在所有这些文件中使用 [`@JvmMultifileClass`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.jvm/-jvm-multifile-class/index.html)
注解。

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

如果需要在 Java 中将 Kotlin 属性公开为一个字段，请使用 [`@JvmField`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.jvm/-jvm-field/index.html) 注解对其进行注解。该字段将具有与底层属性相同的可见性。如果一个属性满足以下条件，则可以使用 `@JvmField` 注解它：
* 它有一个 backing field
* 它不是私有的
* 它没有 `open`、`override` 或 `const` 修饰符
* 它不是一个 delegated property

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

[延迟初始化（Late-Initialized）](properties#late-initialized-properties-and-variables) 的属性也会作为字段公开。
该字段的可见性将与 `lateinit` 属性 setter 的可见性相同。

## 静态字段

在 named object 或 companion object 中声明的 Kotlin 属性将具有静态 backing field，
要么在该 named object 中，要么在包含该 companion object 的类中。

通常这些字段是私有的，但可以通过以下方式之一公开：

 - [`@JvmField`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.jvm/-jvm-field/index.html) 注解
 - `lateinit` 修饰符
 - `const` 修饰符
 
使用 `@JvmField` 注解这样的属性会使其成为一个静态字段，其可见性与属性本身相同。

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
// Key 类中的 public static final 字段
```

object 或 companion object 中的 [延迟初始化（late-initialized）](properties#late-initialized-properties-and-variables) 属性
具有静态 backing field，其可见性与属性 setter 相同。

```kotlin
object Singleton {
    lateinit var provider: Provider
}
```

```java

// Java
Singleton.provider = new Provider();
// Singleton 类中的 public static non-final 字段
```

声明为 `const` 的属性（在类中以及在顶层）会转换为 Java 中的静态字段：

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

在 Java 中:

```java

int constant = Obj.CONST;
int max = ExampleKt.MAX;
int version = C.VERSION;
```

## 静态方法

如上所述，Kotlin 将包级函数表示为静态方法。
如果使用 [`@JvmStatic`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.jvm/-jvm-static/index.html) 注解这些函数，Kotlin 还可以为在 named object 或 companion object 中定义的函数生成静态方法。
如果使用此注解，编译器将生成 object 的封闭类中的静态方法和 object 本身中的实例方法。例如：

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

C.callStatic(); // 运行正常
C.callNonStatic(); // 错误：不是静态方法
C.Companion.callStatic(); // 实例方法仍然存在
C.Companion.callNonStatic(); // 这是唯一的方法
```

named object 也是如此：

```kotlin
object Obj {
    @JvmStatic fun callStatic() {}
    fun callNonStatic() {}
}
```

在 Java 中:

```java

Obj.callStatic(); // 运行正常
Obj.callNonStatic(); // 错误
Obj.INSTANCE.callNonStatic(); // 运行正常，通过单例实例调用
Obj.INSTANCE.callStatic(); // 也运行正常
```

从 Kotlin 1.3 开始，`@JvmStatic` 也适用于在接口的 companion object 中定义的函数。
这些函数编译为接口中的静态方法。请注意，接口中的静态方法是在 Java 1.8 中引入的，
因此请确保使用相应的 targets。

```kotlin
interface ChatBot {
    companion object {
        @JvmStatic fun greet(username: String) {
            println("Hello, $username")
        }
    }
}
```

`@JvmStatic` 注解也可以应用于 object 或 companion object 的属性，
使其 getter 和 setter 方法成为该 object 或包含 companion object 的类中的静态成员。

## 接口中的默认方法

:::note
默认方法仅适用于 JVM 1.8 及更高版本的 targets。

:::

从 JDK 1.8 开始，Java 中的接口可以包含[默认方法](https://docs.oracle.com/javase/tutorial/java/IandI/defaultmethods.html)。
要使 Kotlin 接口的所有非抽象成员成为实现它们的 Java 类的默认成员，请使用 `-Xjvm-default=all` 编译器选项编译 Kotlin 
代码。

以下是一个带有默认方法的 Kotlin 接口的示例：

```kotlin
// 使用 -Xjvm-default=all 编译

interface Robot {
    fun move() { println("~walking~") }  // 在 Java 接口中将是默认的
    fun speak(): Unit
}
```

默认实现可用于实现该接口的 Java 类。

```java
//Java 实现
public class C3PO implements Robot {
    // 来自 Robot 的 move() 实现是隐式可用的
    @Override
    public void speak() {
        System.out.println("I beg your pardon, sir");
    }
}
```

```java
C3PO c3po = new C3PO();
c3po.move(); // 来自 Robot 接口的默认实现
c3po.speak();
```

接口的实现可以覆盖默认方法。

```java
//Java
public class BB8 implements Robot {
    //默认方法的自有实现
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

:::note
在 Kotlin 1.4 之前，要生成默认方法，可以在这些方法上使用 `@JvmDefault` 注解。
在 1.4+ 中使用 `-Xjvm-default=all` 编译通常就像使用 `@JvmDefault` 注解接口的所有非抽象方法
并使用 `-Xjvm-default=enable` 编译一样。但是，在某些情况下，它们的行为会有所不同。
有关 Kotlin 1.4 中默认方法生成更改的详细信息，请参阅 Kotlin 博客上的[这篇文章](https://blog.jetbrains.com/kotlin/2020/07/kotlin-1-4-m3-generating-default-methods-in-interfaces/)。

:::

### 默认方法的兼容性模式

如果有些客户端使用在没有 `-Xjvm-default=all` 选项的情况下编译的 Kotlin 接口，那么它们可能
与使用此选项编译的代码 binary-incompatible。为避免破坏与此类客户端的兼容性，
请使用 `-Xjvm-default=all` 模式并使用 [`@JvmDefaultWithCompatibility`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.jvm/-jvm-default-with-compatibility/) 注解标记接口。
这允许您一次将此注解添加到公共 API 中的所有接口，并且您无需对新的非公共代码使用任何注解。

:::note
从 Kotlin 1.6.20 开始，您可以在默认模式（`-Xjvm-default=disable` 编译器选项）下针对使用 `-Xjvm-default=all` 或 `-Xjvm-default=all-compatibility` 模式编译的
模块编译模块。

:::

了解有关兼容性模式的更多信息：

#### disable 

默认行为。不生成 JVM 默认方法，并禁止使用 `@JvmDefault` 注解。

#### all 

为模块中所有具有主体的接口声明生成 JVM 默认方法。不为具有主体的接口声明生成 [`DefaultImpls`](https://blog.jetbrains.com/kotlin/2020/07/kotlin-1-4-m3-generating-default-methods-in-interfaces/) stub 
，这些 stub 在 `disable` 模式下默认生成。

如果接口从在 `disable` 模式下编译的接口继承了具有主体的方法，并且没有覆盖它，
则将为其生成 `DefaultImpls` stub。

如果某些客户端代码依赖于 `DefaultImpls` 类的存在，则会__破坏二进制兼容性__。

:::note
如果使用接口委托，则会委托所有接口方法。唯一的例外是用已弃用的 `@JvmDefault` 注解的方法。

:::

#### all-compatibility 

除了 `all` 模式外，还在 [`DefaultImpls`](https://blog.jetbrains.com/kotlin/2020/07/kotlin-1-4-m3-generating-default-methods-in-interfaces/)
类中生成兼容性 stub。兼容性 stub 对于 
库和运行时作者来说可能很有用，以保持针对先前库版本编译的现有客户端的向后二进制兼容性。
`all` 和 `all-compatibility` 模式正在更改库 ABI 表面，客户端在重新编译库后将使用该表面。
从这个意义上讲，客户端可能与以前的库版本不兼容。
这通常意味着您需要适当的库版本控制，例如，SemVer 中的主要版本增加。

编译器使用 `@Deprecated` 注解生成 `DefaultImpls` 的所有成员：您不应在 Java 代码中使用这些 
成员，因为编译器仅出于兼容性目的生成它们。

如果从以 `all` 或 `all-compatibility` 模式编译的 Kotlin 接口继承，
`DefaultImpls` 兼容性 stub 将使用标准 JVM 运行时解析语义调用接口的默认方法。

对继承泛型接口的类执行额外的兼容性检查，在某些情况下，在 `disable` 模式下会生成带有专门签名的额外的隐式方法：
与 `disable` 模式不同，如果您不显式覆盖此类方法并且不使用 `@JvmDefaultWithoutCompatibility` 注解类，则编译器将报告错误（有关更多详细信息，请参阅 [此 YouTrack 问题](https://youtrack.jetbrains.com/issue/KT-39603)）。

## 可见性

Kotlin 可见性修饰符按以下方式映射到 Java：

* `private` 成员被编译为 `private` 成员
* `private` 顶层声明被编译为 `private` 顶层声明。如果从类内部访问，则还包括包私有访问器。
* `protected` 保持 `protected`（请注意，Java 允许从同一包中的其他类访问受保护的成员，
而 Kotlin 不允许，因此 Java 类将具有对代码的更广泛的访问权限）
* `internal` 声明在 Java 中变为 `public`。`internal` 类的成员会经过名称 mangling，以使其
更难从 Java 中意外使用它们，并允许对根据 Kotlin 规则彼此不可见的具有相同签名的成员进行重载
* `public` 保持 `public`

## KClass

有时您需要调用一个带有 `KClass` 类型参数的 Kotlin 方法。
没有从 `Class` 到 `KClass` 的自动转换，因此您必须通过调用等效于
`Class<T>.kotlin` 扩展属性的内容来手动执行此操作：

```kotlin
kotlin.jvm.JvmClassMappingKt.getKotlinClass(MainView.class)
```

## 使用 @JvmName 处理签名冲突

有时我们在 Kotlin 中有一个命名的函数，我们需要在字节码中使用不同的 JVM 名称。
最突出的例子是由于 *类型擦除（type erasure）* 造成的：

```kotlin
fun List<String>.filterValid(): List<String>
fun List<Int>.filterValid(): List<Int>
```

这两个函数不能并排定义，因为它们的 JVM 签名相同：`filterValid(Ljava/util/List;)Ljava/util/List;`。
如果我们真的希望它们在 Kotlin 中具有相同的名称，我们可以使用
[`@JvmName`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.jvm/-jvm-name/index.html) 注解其中一个（或两个）函数，并指定一个不同的名称
作为参数：

```kotlin
fun List<String>.filterValid(): List<String>

@JvmName("filterValidInt")
fun List<Int>.filterValid(): List<Int>
```

从 Kotlin 中，它们将可以通过相同的名称 `filterValid` 访问，但从 Java 中，它们将是 `filterValid` 和 `filterValidInt`。

当我们既需要属性 `x` 又需要函数 `getX()` 时，也适用同样的技巧：

```kotlin
val x: Int
    @JvmName("getX_prop")
    get() = 15

fun getX() = 10
```

要更改未显式实现 getter 和 setter 的属性的生成的访问器方法的名称，
可以使用 `@get:JvmName` 和 `@set:JvmName`：

```kotlin
@get:JvmName("x")
@set:JvmName("changeX")
var x: Int = 23
```

## 重载生成

通常，如果您编写一个带有默认参数值的 Kotlin 函数，它在 Java 中仅作为完整签名可见，其中包含所有参数。
如果您希望向 Java 调用者公开多个重载，可以使用
[`@JvmOverloads`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.jvm/-jvm-overloads/index.html) 注解。

该注解也适用于构造函数、静态方法等。它不能用于抽象方法，包括在接口中定义的方法。

```kotlin
class Circle @JvmOverloads constructor(centerX: Int, centerY: Int, radius: Double = 1.0) {
    @JvmOverloads fun draw(label: String, lineWidth: Int = 1, color: String = "red") { /*...*/ }
}
```

对于每个具有默认值的参数，这将生成一个额外的重载，该重载在参数列表中删除了此参数以及它右边的所有参数。
在此示例中，将生成以下内容：

```java
// 构造函数:
Circle(int centerX, int centerY, double radius)
Circle(int centerX, int centerY)

// 方法
void draw(String label, int lineWidth, String color) { }
void draw(String label, int lineWidth) { }
void draw(String label) { }
```

请注意，如[辅助构造函数（Secondary constructors）](classes#secondary-constructors)中所述，如果一个类具有所有构造函数参数的默认
值，则将为其生成一个没有参数的公共构造函数。即使未指定 `@JvmOverloads` 注解，这也可以工作。

## 受检异常

Kotlin 没有受检异常（checked exceptions）。
因此，通常 Kotlin 函数的 Java 签名不声明抛出的异常。
因此，如果您在 Kotlin 中有一个这样的函数：

```kotlin
// example.kt
package demo

fun writeToFile() {
    /*...*/
    throw IOException()
}
```

并且您想从 Java 中调用它并捕获异常：

```java

// Java
try {
    demo.Example.writeToFile();
} catch (IOException e) { 
    // 错误：writeToFile() 未在 throws 列表中声明 IOException
    // ...
}
```

您会收到来自 Java 编译器的错误消息，因为 `writeToFile()` 未声明 `IOException`。
要解决此问题，请在 Kotlin 中使用 [`@Throws`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-throws/index.html)
注解：

```kotlin
@Throws(IOException::class)
fun writeToFile() {
    /*...*/
    throw IOException()
}
```

## 空安全（Null-safety）

从 Java 调用 Kotlin 函数时，没有人阻止我们将 `null` 作为非空参数传递。
这就是为什么 Kotlin 会为所有期望非空的公共函数生成运行时检查。
这样，我们就可以立即在 Java 代码中获得 `NullPointerException`。

## 变型泛型（Variant generics）

当 Kotlin 类使用[声明点变型（declaration-site variance）](generics#declaration-site-variance)时，从 Java 代码中看到它们的用法有两种
选择。例如，假设您有以下类和两个使用它的函数：

```kotlin
class Box<out T>(val value: T)

interface Base
class Derived : Base

fun boxDerived(value: Derived): Box<Derived> = Box(value)
fun unboxBase(box: Box<Base>): Base = box.value
```

将这些函数转换为 Java 的一种简单方法是：

```java
Box<Derived> boxDerived(Derived value) { ... }
Base unboxBase(Box<Base> box) { ... }
```

问题在于，在 Kotlin 中，您可以编写 `unboxBase(boxDerived(Derived()))`，但在 Java 中，这是不可能的，
因为在 Java 中，类 `Box` 在其参数 `T` 中是 *不变的（invariant）*，因此 `Box<Derived>` 不是 `Box<Base>` 的子类型。
为了使它在 Java 中工作，您必须将 `unboxBase` 定义为如下所示：

```java
Base unboxBase(Box<? extends Base> box) { ... }  
```

此声明使用 Java 的 *通配符类型（wildcards types）* (`? extends Base`) 通过使用点
变型来模拟声明点变型，因为它就是 Java 所拥有的。

为了使 Kotlin API 在 Java 中工作，编译器生成 `Box<Super>` 作为 `Box<? extends Super>`，用于协变定义的 `Box`
（或 `Foo<? super Bar>` 用于逆变定义的 `Foo`），当它 *作为参数* 出现时。当它是返回值时，
不会生成通配符，因为否则 Java 客户端将不得不处理它们（这与常见的
Java 编码风格背道而驰）。因此，我们示例中的函数实际上被翻译为如下所示：

```java

// 返回类型 - 无通配符
Box<Derived> boxDerived(Derived value) { ... }
 
// 参数 - 通配符 
Base unboxBase(Box<? extends Base> box) { ... }
```

:::note
当参数类型是 final 时，通常没有理由生成通配符，因此 `Box<String>` 始终是 `Box<String>`，
无论它位于什么位置。

:::

如果您需要在默认情况下未生成通配符的位置使用它们，请使用 `@JvmWildcard` 注解：

```kotlin
fun boxDerived(value: Derived): Box<@JvmWildcard Derived> = Box(value)
// 被翻译为 
// Box<? extends Derived> boxDerived(Derived value) { ... }
```

相反，如果您不需要在生成通配符的位置使用它们，请使用 `@JvmSuppressWildcards`：

```kotlin
fun unboxBase(box: Box<@JvmSuppressWildcards Base>): Base = box.value
// 被翻译为 
// Base unboxBase(Box<Base> box) { ... }
```

:::note
`@JvmSuppressWildcards` 不仅可以用于单个类型参数，还可以用于整个声明，例如函数
或类，导致其中的所有通配符都被抑制。

:::

### Nothing 类型的翻译
 
类型 [`Nothing`](exceptions#the-nothing-type) 是特殊的，因为它在 Java 中没有对应的自然类型。实际上，每个 Java 引用类型，包括
`java.lang.Void`，都接受 `null` 作为值，而 `Nothing` 甚至不接受它。因此，此类型无法在 Java 世界中准确
表示。这就是为什么 Kotlin 在使用 `Nothing` 类型的参数时生成原始类型的原因：

```kotlin
fun emptyList(): List<Nothing> = listOf()
// 被翻译为
// List emptyList() { ... }
```