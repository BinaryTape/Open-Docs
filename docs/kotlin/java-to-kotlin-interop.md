[//]: # (title: 从 Java 调用 Kotlin)

Kotlin 代码可以轻松地从 Java 调用。例如，Kotlin 类的实例可以在 Java 方法中无缝创建和操作。然而，Java 和 Kotlin 之间存在某些差异，在将 Kotlin 代码集成到 Java 时需要注意。本页面将介绍如何调整 Kotlin 代码与其 Java 客户端的互操作性。

## 属性

Kotlin 属性被编译为以下 Java 元素：

 * 一个 getter 方法，其名称通过在属性名称前添加 `get` 前缀计算得出。
 * 一个 setter 方法，其名称通过在属性名称前添加 `set` 前缀计算得出（仅适用于 `var` 属性）。
 * 一个私有字段，其名称与属性名称相同（仅适用于带有幕后字段的属性）。

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

如果属性名称以 `is` 开头，则使用不同的名称映射规则：getter 的名称与属性名称相同，而 setter 的名称通过将 `is` 替换为 `set` 获得。例如，对于属性 `isOpen`，getter 被称为 `isOpen()`，setter 被称为 `setOpen()`。此规则适用于任何类型的属性，而不仅仅是 `Boolean`。

## 包级别函数

在 `org.example` 包内的 `app.kt` 文件中声明的所有函数和属性，包括扩展函数，都将被编译为名为 `org.example.AppKt` 的 Java 类的静态方法。

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

通常，多个文件具有相同的生成的 Java 类名（相同的包和相同的名称或相同的 [`@JvmName`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.jvm/-jvm-name/index.html) 注解）是一个错误。但是，编译器可以生成一个单独的 Java 外观类，该类具有指定的名称，并包含来自所有具有该名称的文件的所有声明。要启用此类外观的生成，请在所有这些文件中使用 [`@JvmMultifileClass`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.jvm/-jvm-multifile-class/index.html) 注解。

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

如果需要将 Kotlin 属性作为 Java 中的字段公开，请使用 [`@JvmField`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.jvm/-jvm-field/index.html) 注解对其进行注解。该字段与底层属性具有相同的可见性。在以下情况下，你可以使用 `@JvmField` 注解属性：
* 它具有幕后字段
* 它不是私有的
* 它不具有 `open`、`override` 或 `const` 修饰符
* 它不是委托属性

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

[延迟初始化](properties.md#late-initialized-properties-and-variables)属性也会公开为字段。字段的可见性与 `lateinit` 属性 setter 的可见性相同。

## 静态字段

在命名对象或伴生对象中声明的 Kotlin 属性，在其命名对象或包含伴生对象的类中具有静态幕后字段。

通常这些字段是私有的，但可以通过以下方式之一公开：

 - [`@JvmField`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.jvm/-jvm-field/index.html) 注解
 - `lateinit` 修饰符
 - `const` 修饰符
 
用 `@JvmField` 注解此类属性会使其成为静态字段，并具有与属性本身相同的可见性。

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

对象或伴生对象中的[延迟初始化](properties.md#late-initialized-properties-and-variables)属性具有静态幕后字段，其可见性与属性 setter 的可见性相同。

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

现在，`callStatic()` 在 Java 中是静态的，而 `callNonStatic()` 则不是：

```java

C.callStatic(); // 正常工作
C.callNonStatic(); // 错误：不是静态方法
C.Companion.callStatic(); // 实例方法仍然存在
C.Companion.callNonStatic(); // 唯一可以工作的方式
```

同样，对于命名对象：

```kotlin
object Obj {
    @JvmStatic fun callStatic() {}
    fun callNonStatic() {}
}
```

在 Java 中：

```java

Obj.callStatic(); // 正常工作
Obj.callNonStatic(); // 错误
Obj.INSTANCE.callNonStatic(); // 正常工作，通过单例实例调用
Obj.INSTANCE.callStatic(); // 也正常工作
```

从 Kotlin 1.3 开始，`@JvmStatic` 也适用于接口伴生对象中定义的函数。此类函数被编译为接口中的静态方法。请注意，接口中的静态方法是在 Java 1.8 中引入的，因此请确保使用相应的目标。

```kotlin
interface ChatBot {
    companion object {
        @JvmStatic fun greet(username: String) {
            println("Hello, $username")
        }
    }
}
```

你还可以将 `@JvmStatic` 注解应用于对象或伴生对象的属性，使其 getter 和 setter 方法成为该对象或包含伴生对象的类中的静态成员。

## 接口中的默认方法

当以 JVM 为目标平台时，Kotlin 将接口中声明的函数编译为 [默认方法](https://docs.oracle.com/javase/tutorial/java/IandI/defaultmethods.html)，除非另行[配置](#compatibility-modes-for-default-methods)。这些是接口中的具体方法，Java 类可以直接继承，无需重新实现。

以下是带有默认方法的 Kotlin 接口示例：

```kotlin
interface Robot {
    fun move() { println("~walking~") }  // 将成为 Java 接口中的默认方法
    fun speak(): Unit
}
```

默认实现可供实现该接口的 Java 类使用。

```java
//Java implementation
public class C3PO implements Robot {
    // move() 的实现从 Robot 中隐式可用
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

### 默认方法的兼容性模式

Kotlin 提供了三种模式来控制接口中的函数如何编译为 JVM 默认方法。这些模式决定了编译器是否生成兼容性桥接和 `DefaultImpls` 类中的静态方法。

你可以使用 `-jvm-default` 编译器选项控制此行为：

> `-jvm-default` 编译器选项替换了已弃用的 `-Xjvm-default` 选项。
>
{style="note"}

了解更多关于兼容性模式的信息：

#### enable {initial-collapse-state="collapsed" collapsible="true"}

默认行为。
在接口中生成默认实现，并包含兼容性桥接和 `DefaultImpls` 类。
此模式保持与较旧的已编译 Kotlin 代码的兼容性。

#### no-compatibility {initial-collapse-state="collapsed" collapsible="true"}

仅在接口中生成默认实现。
跳过兼容性桥接和 `DefaultImpls` 类。
将此模式用于不与依赖 `DefaultImpls` 类的代码交互的新代码库。
这可能会破坏与较旧 Kotlin 代码的二进制兼容性。

> 如果使用接口委托，所有接口方法都将被委托。
>
{style="note"}

#### disable {initial-collapse-state="collapsed" collapsible="true"}

禁用接口中的默认实现。
仅生成兼容性桥接和 `DefaultImpls` 类。

## 可见性

Kotlin 可见性修饰符在 Java 中的映射方式如下：

* `private` 成员编译为 `private` 成员。
* `private` 顶层声明编译为 `private` 顶层声明。如果从类内部访问，包私有访问器也会被包含在内。
* `protected` 保持 `protected`。（请注意，Java 允许从同一包中的其他类访问受保护成员，而 Kotlin 不允许，因此 Java 类将对代码拥有更广泛的访问权限。）
* `internal` 声明在 Java 中变为 `public`。`internal` 类的成员会经过名字修饰，以使其更难被 Java 意外使用，并允许对根据 Kotlin 规则互不可见的具有相同签名的成员进行重载。
* `public` 保持 `public`。

## KClass

有时你需要调用一个带有 `KClass` 类型形参的 Kotlin 方法。
`Class` 到 `KClass` 没有自动转换，因此你必须通过调用 `Class<T>.kotlin` 扩展属性的等效方法手动完成：

```kotlin
kotlin.jvm.JvmClassMappingKt.getKotlinClass(MainView.class)
```

## 处理与 @JvmName 的签名冲突

有时我们在 Kotlin 中有一个命名函数，但我们需要它在字节码中具有不同的 JVM 名称。
最突出的例子是由于*类型擦除*而发生的：

```kotlin
fun List<String>.filterValid(): List<String>
fun List<Int>.filterValid(): List<Int>
```

这两个函数不能并排定义，因为它们的 JVM 签名相同：`filterValid(Ljava/util/List;)Ljava/util/List;`。
如果我们真的希望它们在 Kotlin 中具有相同的名称，我们可以使用 [`@JvmName`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.jvm/-jvm-name/index.html) 注解其中一个（或两个），并指定一个不同的名称作为实参：

```kotlin
fun List<String>.filterValid(): List<String>

@JvmName("filterValidInt")
fun List<Int>.filterValid(): List<Int>
```

从 Kotlin 中，它们可以通过相同的名称 `filterValid` 访问，但从 Java 中，它们是 `filterValid` 和 `filterValidInt`。

同样的技巧也适用于我们需要拥有属性 `x` 以及函数 `getX()` 的情况：

```kotlin
val x: Int
    @JvmName("getX_prop")
    get() = 15

fun getX() = 10
```

要更改未显式实现 getter 和 setter 的属性所生成的访问器方法的名称，可以使用 `@get:JvmName` 和 `@set:JvmName`：

```kotlin
@get:JvmName("x")
@set:JvmName("changeX")
var x: Int = 23
```

## 重载生成

通常，如果你编写一个带有默认形参值的 Kotlin 函数，它在 Java 中仅作为完整签名可见，所有形参都存在。如果你希望向 Java 调用者公开多个重载，可以使用 [`@JvmOverloads`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.jvm/-jvm-overloads/index.html) 注解。

该注解也适用于构造函数、静态方法等。它不能用于抽象方法，包括接口中定义的方法。

```kotlin
class Circle @JvmOverloads constructor(centerX: Int, centerY: Int, radius: Double = 1.0) {
    @JvmOverloads fun draw(label: String, lineWidth: Int = 1, color: String = "red") { /*...*/ }
}
```

对于每个带有默认值的形参，这会生成一个额外的重载，该重载移除了此形参及其形参列表中右侧的所有形参。在此示例中，生成了以下内容：

```java
// Constructors:
Circle(int centerX, int centerY, double radius)
Circle(int centerX, int centerY)

// Methods
void draw(String label, int lineWidth, String color) { }
void draw(String label, int lineWidth) { }
void draw(String label) { }
```

请注意，如[次级构造函数](classes.md#secondary-constructors)中所述，如果一个类为其所有构造函数形参都设置了默认值，则会为其生成一个无实参的公共构造函数。即使未指定 `@JvmOverloads` 注解，这也有效。

## 受检异常

Kotlin 没有受检异常。
因此，通常 Kotlin 函数的 Java 签名不声明抛出的异常。
因此，如果你有一个像这样的 Kotlin 函数：

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

你将收到来自 Java 编译器的错误消息，因为 `writeToFile()` 未声明 `IOException`。
为了解决此问题，请在 Kotlin 中使用 [`@Throws`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-throws/index.html) 注解：

```kotlin
@Throws(IOException::class)
fun writeToFile() {
    /*...*/
    throw IOException()
}
```

## 空安全

从 Java 调用 Kotlin 函数时，没有人能阻止我们将 `null` 作为非空形参传递。
这就是 Kotlin 为所有期望非空值的公共函数生成运行时检测的原因。
这样，我们就会立即在 Java 代码中获得一个 `NullPointerException`。

## 型变泛型

当 Kotlin 类使用[声明处型变](generics.md#declaration-site-variance)时，它们的用法在 Java 代码中有两种查看方式。例如，假设你有一个以下类和两个使用它的函数：

```kotlin
class Box<out T>(val value: T)

interface Base
class Derived : Base

fun boxDerived(value: Derived): Box<Derived> = Box(value)
fun unboxBase(box: Box<Base>): Base = box.value
```

将这些函数翻译为 Java 的朴素方法是这样的：

```java
Box<Derived> boxDerived(Derived value) { ... }
Base unboxBase(Box<Base> box) { ... }
```

问题在于，在 Kotlin 中你可以编写 `unboxBase(boxDerived(Derived()))`，但在 Java 中这不可能，因为在 Java 中，类 `Box` 对其形参 `T` 来说是*不型变*的，因此 `Box<Derived>` 不是 `Box<Base>` 的子类型。为了使其在 Java 中工作，你必须如下定义 `unboxBase`：

```java
Base unboxBase(Box<? extends Base> box) { ... }  
```

此声明使用 Java 的*通配符类型*（`? extends Base`）通过使用处型变来模拟声明处型变，因为 Java 只有这种方式。

为了使 Kotlin API 在 Java 中工作，当 `Box<Super>`（或 `Foo<? super Bar>` 用于逆变定义的 `Foo`）作为形参出现时，编译器会将其生成为 `Box<? extends Super>`（用于协变定义的 `Box`）。当它是返回值时，不会生成通配符，因为否则 Java 客户端将不得不处理它们（这与常见的 Java 编码风格相悖）。因此，我们示例中的函数实际上翻译如下：

```java

// return type - no wildcards
Box<Derived> boxDerived(Derived value) { ... }
 
// parameter - wildcards 
Base unboxBase(Box<? extends Base> box) { ... }
```

> 当实参类型是 final 时，通常没有必要生成通配符，因此 `Box<String>` 始终是 `Box<String>`，无论它处于什么位置。
>
{style="note"}

如果你需要在默认情况下不生成通配符的地方生成通配符，请使用 `@JvmWildcard` 注解：

```kotlin
fun boxDerived(value: Derived): Box<@JvmWildcard Derived> = Box(value)
// is translated to 
// Box<? extends Derived> boxDerived(Derived value) { ... }
```

在相反的情况下，如果你不需要生成通配符的地方生成通配符，请使用 `@JvmSuppressWildcards`：

```kotlin
fun unboxBase(box: Box<@JvmSuppressWildcards Base>): Base = box.value
// is translated to 
// Base unboxBase(Box<Base> box) { ... }
```

>`@JvmSuppressWildcards` 不仅可以用于单个类型实参，还可以用于整个声明，例如函数或类，导致它们内部的所有通配符都被抑制。
>
{style="note"}

### Nothing 类型的翻译
 
[`Nothing`](exceptions.md#the-nothing-type) 类型很特殊，因为它在 Java 中没有自然的对应物。事实上，每个 Java 引用类型，包括 `java.lang.Void`，都接受 `null` 作为值，而 `Nothing` 甚至不接受 `null`。因此，这种类型无法在 Java 世界中准确表示。这就是为什么当使用 `Nothing` 类型实参时，Kotlin 会生成一个原始类型：

```kotlin
fun emptyList(): List<Nothing> = listOf()
// is translated to
// List emptyList() { ... }
```

## 内联值类

<primary-label ref="experimental-general"/>

如果你希望 Java 代码与 Kotlin 的[内联值类](inline-classes.md)顺利协作，你可以使用 [`@JvmExposeBoxed`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.jvm/-jvm-expose-boxed/) 注解或 `-Xjvm-expose-boxed` 编译器选项。这些方法确保 Kotlin 为 Java 互操作性生成必要的装箱表示。

默认情况下，Kotlin 将内联值类编译为使用**未装箱表示**，这通常无法从 Java 访问。
例如，你不能从 Java 调用 `MyInt` 类的构造函数：

```kotlin
@JvmInline
value class MyInt(val value: Int)
```

因此，以下 Java 代码会失败：

```java
MyInt input = new MyInt(5);
```

你可以使用 `@JvmExposeBoxed` 注解，以便 Kotlin 生成一个可以直接从 Java 调用的公共构造函数。
你可以在以下级别应用该注解，以确保对公开给 Java 的内容进行细粒度控制：

* 类
* 构造函数
* 函数

在代码中使用 `@JvmExposeBoxed` 注解之前，你必须通过使用 `@OptIn(ExperimentalStdlibApi::class)` 来选择加入。
例如：

```kotlin
@OptIn(ExperimentalStdlibApi::class)
@JvmExposeBoxed
@JvmInline
value class MyInt(val value: Int)

@OptIn(ExperimentalStdlibApi::class)
@JvmExposeBoxed
fun MyInt.timesTwoBoxed(): MyInt = MyInt(this.value * 2)
```

有了这些注解，Kotlin 会为 `MyInt` 类生成一个 Java 可访问的构造函数，**并且**为使用值类的装箱形式的扩展函数生成一个变体。因此，以下 Java 代码成功运行：

```java
MyInt input = new MyInt(5);
MyInt output = ExampleKt.timesTwoBoxed(input);
```

要将此行为应用于模块内的所有内联值类以及使用它们的函数，请使用 `-Xjvm-expose-boxed` 选项进行编译。
使用此选项编译具有与模块中每个声明都带有 `@JvmExposeBoxed` 注解相同的效果。

### 继承的函数

`@JvmExposeBoxed` 注解不会自动为继承的函数生成装箱表示。
 
要为继承的函数生成必要的表示，请在实现或扩展类中覆盖它：
 
```kotlin
interface IdTransformer {
    fun transformId(rawId: UInt): UInt = rawId
}

// 不会为 transformId() 函数生成装箱表示
@OptIn(ExperimentalStdlibApi::class)
@JvmExposeBoxed
class LightweightTransformer : IdTransformer

// 会为 transformId() 函数生成装箱表示
@OptIn(ExperimentalStdlibApi::class)
@JvmExposeBoxed
class DefaultTransformer : IdTransformer {
    override fun transformId(rawId: UInt): UInt = super.transformId(rawId)
}
```

要了解 Kotlin 中的继承工作原理以及如何使用 `super` 关键字调用超类实现，请参阅[继承](inheritance.md#calling-the-superclass-implementation)。