---
title: 委托属性
---
对于某些常见的属性类型，即使每次需要时都可以手动实现它们，但最好还是实现一次，将其添加到库中，然后在以后重用它们。例如：

* _延迟 (Lazy)_ 属性：该值仅在首次访问时计算。
* _可观察 (Observable)_ 属性：当此属性发生更改时，会通知监听器。
* 将属性存储在 _map_ 中，而不是为每个属性单独使用一个字段。

为了涵盖这些（和其他）情况，Kotlin 支持 _委托属性 (delegated properties)_：

```kotlin
class Example {
    var p: String by Delegate()
}
```

语法是：`val/var <属性名 (property name)>: <类型 (Type)> by <表达式 (expression)>`。`by` 之后的表达式是一个 _委托 (delegate)_，因为与该属性对应的 `get()`（和 `set()`）将被委托给其 `getValue()` 和 `setValue()` 方法。属性委托不必实现接口，但它们必须提供一个 `getValue()` 函数（对于 `var` 来说，还要提供 `setValue()`）。

例如：

```kotlin
import kotlin.reflect.KProperty

class Delegate {
    operator fun getValue(thisRef: Any?, property: KProperty<*>): String {
        return "$thisRef, thank you for delegating '${property.name}' to me!"
    }
 
    operator fun setValue(thisRef: Any?, property: KProperty<*>, value: String) {
        println("$value has been assigned to '${property.name}' in $thisRef.")
    }
}
```

当你从 `p` 读取时，它会委托给 `Delegate` 的一个实例，此时会调用 `Delegate` 中的 `getValue()` 函数。它的第一个参数是你从中读取 `p` 的对象，第二个参数包含 `p` 本身的描述（例如，你可以获取它的名称）。

```kotlin
val e = Example()
println(e.p)
```

这会打印：

```
Example@33a17727, thank you for delegating 'p' to me!
```

类似地，当你赋值给 `p` 时，会调用 `setValue()` 函数。前两个参数相同，第三个参数包含要赋值的值：

```kotlin
e.p = "NEW"
```

这会打印：

```
NEW has been assigned to 'p' in Example@33a17727.
```

有关委托对象的要求规范可以在[下面](#property-delegate-requirements)找到。

你可以在函数或代码块中声明委托属性；它不必是类的成员。你可以在[下面](#local-delegated-properties)找到一个示例。

## 标准委托 (Standard delegates)

Kotlin 标准库为几种有用的委托提供了工厂方法。

### 延迟属性 (Lazy properties)

[`lazy()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/lazy.html) 是一个接受 lambda 表达式并返回 `Lazy<T>` 实例的函数，该实例可以用作实现延迟属性的委托。第一次调用 `get()` 会执行传递给 `lazy()` 的 lambda 表达式并记住结果。后续调用 `get()` 仅返回记住的结果。

```kotlin
val lazyValue: String by lazy {
    println("computed!")
    "Hello"
}

fun main() {
    println(lazyValue)
    println(lazyValue)
}
```

默认情况下，延迟属性的求值是 *synchronized* 的：该值仅在一个线程中计算，但所有线程都将看到相同的值。如果不需要初始化委托的同步以允许多个线程同时执行它，请将 `LazyThreadSafetyMode.PUBLICATION` 作为参数传递给 `lazy()`。

如果你确定初始化始终发生在与使用该属性的线程相同的线程中，则可以使用 `LazyThreadSafetyMode.NONE`。它不产生任何线程安全保证和相关开销。

### 可观察属性 (Observable properties)

[`Delegates.observable()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.properties/-delegates/observable.html) 接受两个参数：初始值和修改的处理程序。

每次你赋值给该属性时（在执行赋值*之后*），都会调用该处理程序。它有三个参数：要赋值的属性、旧值和新值：

```kotlin
import kotlin.properties.Delegates

class User {
    var name: String by Delegates.observable("<no name>") {
        prop, old, new `->`
        println("$old `->` $new")
    }
}

fun main() {
    val user = User()
    user.name = "first"
    user.name = "second"
}
```

如果你想拦截赋值并*否决 (veto)* 它们，请使用 [`vetoable()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.properties/-delegates/vetoable.html) 而不是 `observable()`。传递给 `vetoable` 的处理程序将在分配新属性值*之前*调用。

## 委托给另一个属性 (Delegating to another property)

一个属性可以将其 getter 和 setter 委托给另一个属性。这种委托适用于顶层属性和类属性（成员和扩展）。委托属性可以是：
* 顶层属性
* 同一类的成员属性或扩展属性
* 另一个类的成员属性或扩展属性

要将一个属性委托给另一个属性，请在委托名称中使用 `::` 限定符，例如，`this::delegate` 或 `MyClass::delegate`。

```kotlin
var topLevelInt: Int = 0
class ClassWithDelegate(val anotherClassInt: Int)

class MyClass(var memberInt: Int, val anotherClassInstance: ClassWithDelegate) {
    var delegatedToMember: Int by this::memberInt
    var delegatedToTopLevel: Int by ::topLevelInt
    
    val delegatedToAnotherClass: Int by anotherClassInstance::anotherClassInt
}
var MyClass.extDelegated: Int by ::topLevelInt
```

例如，当你想要以向后兼容的方式重命名属性时，这可能很有用：引入一个新属性，使用 `@Deprecated` 注解标记旧属性，并委托其实现。

```kotlin
class MyClass {
   var newName: Int = 0
   @Deprecated("Use 'newName' instead", ReplaceWith("newName"))
   var oldName: Int by this::newName
}
fun main() {
   val myClass = MyClass()
   // Notification: 'oldName: Int' is deprecated.
   // Use 'newName' instead
   myClass.oldName = 42
   println(myClass.newName) // 42
}
```

## 将属性存储在 map 中 (Storing properties in a map)

一个常见的用例是将属性的值存储在 map 中。这在诸如解析 JSON 或执行其他动态任务之类的应用程序中经常出现。在这种情况下，你可以使用 map 实例本身作为委托属性的委托。

```kotlin
class User(val map: Map<String, Any?>) {
    val name: String by map
    val age: Int     by map
}
```

在此示例中，构造函数接受一个 map：

```kotlin
val user = User(mapOf(
    "name" to "John Doe",
    "age"  to 25
))
```

委托属性通过字符串键从该 map 中获取值，这些字符串键与属性的名称相关联：

```kotlin
class User(val map: Map<String, Any?>) {
    val name: String by map
    val age: Int     by map
}

fun main() {
    val user = User(mapOf(
        "name" to "John Doe",
        "age"  to 25
    ))

    println(user.name) // Prints "John Doe"
    println(user.age)  // Prints 25

}
```

如果你使用 `MutableMap` 而不是只读的 `Map`，这也适用于 `var` 属性：

```kotlin
class MutableUser(val map: MutableMap<String, Any?>) {
    var name: String by map
    var age: Int     by map
}
```

## 局部委托属性 (Local delegated properties)

你可以将局部变量声明为委托属性。例如，你可以使局部变量延迟加载：

```kotlin
fun example(computeFoo: () `->` Foo) {
    val memoizedFoo by lazy(computeFoo)

    if (someCondition && memoizedFoo.isValid()) {
        memoizedFoo.doSomething()
    }
}
```

`memoizedFoo` 变量仅在首次访问时计算。如果 `someCondition` 失败，则根本不会计算该变量。

## 属性委托要求 (Property delegate requirements)

对于 *只读 (read-only)* 属性（`val`），委托应提供一个带有以下参数的运算符函数 `getValue()`：

* `thisRef` 必须与*属性所有者 (property owner)* 的类型相同或是其超类型（对于扩展属性，它应该是被扩展的类型）。
* `property` 必须是 `KProperty<*>` 类型或其超类型。

`getValue()` 必须返回与属性相同的类型（或其子类型）。

```kotlin
class Resource

class Owner {
    val valResource: Resource by ResourceDelegate()
}

class ResourceDelegate {
    operator fun getValue(thisRef: Owner, property: KProperty<*>): Resource {
        return Resource()
    }
}
```

对于 *可变 (mutable)* 属性（`var`），委托必须另外提供一个带有以下参数的运算符函数 `setValue()`：

* `thisRef` 必须与*属性所有者 (property owner)* 的类型相同或是其超类型（对于扩展属性，它应该是被扩展的类型）。
* `property` 必须是 `KProperty<*>` 类型或其超类型。
* `value` 必须与属性的类型相同（或其超类型）。
 
```kotlin
class Resource

class Owner {
    var varResource: Resource by ResourceDelegate()
}

class ResourceDelegate(private var resource: Resource = Resource()) {
    operator fun getValue(thisRef: Owner, property: KProperty<*>): Resource {
        return resource
    }
    operator fun setValue(thisRef: Owner, property: KProperty<*>, value: Any?) {
        if (value is Resource) {
            resource = value
        }
    }
}
```

`getValue()` 和/或 `setValue()` 函数可以作为委托类的成员函数或作为扩展函数提供。当需要将属性委托给最初不提供这些函数的对象时，后者很方便。这两个函数都需要用 `operator` 关键字标记。

你可以通过使用 Kotlin 标准库中的接口 `ReadOnlyProperty` 和 `ReadWriteProperty` 创建匿名对象形式的委托，而无需创建新类。它们提供了所需的方法：`getValue()` 在 `ReadOnlyProperty` 中声明；`ReadWriteProperty` 扩展了它并添加了 `setValue()`。这意味着你可以在需要 `ReadOnlyProperty` 的任何时候传递 `ReadWriteProperty`。

```kotlin
fun resourceDelegate(resource: Resource = Resource()): ReadWriteProperty<Any?, Resource> =
    object : ReadWriteProperty<Any?, Resource> {
        var curValue = resource 
        override fun getValue(thisRef: Any?, property: KProperty<*>): Resource = curValue
        override fun setValue(thisRef: Any?, property: KProperty<*>, value: Resource) {
            curValue = value
        }
    }

val readOnlyResource: Resource by resourceDelegate()  // ReadWriteProperty as val
var readWriteResource: Resource by resourceDelegate()
```

## 委托属性的转换规则 (Translation rules for delegated properties)

在底层，Kotlin 编译器为某些类型的委托属性生成辅助属性，然后委托给它们。

:::note
出于优化目的，编译器在几种情况下 [_不_ 生成辅助属性](#optimized-cases-for-delegated-properties)。 从[委托给另一个属性](#translation-rules-when-delegating-to-another-property)的示例中了解有关优化的信息。

:::

例如，对于属性 `prop`，它会生成隐藏属性 `prop$delegate`，并且访问器的代码只是委托给这个附加属性：

```kotlin
class C {
    var prop: Type by MyDelegate()
}

// this code is generated by the compiler instead:
class C {
    private val prop$delegate = MyDelegate()
    var prop: Type
        get() = prop$delegate.getValue(this, this::prop)
        set(value: Type) = prop$delegate.setValue(this, this::prop, value)
}
```

Kotlin 编译器在参数中提供了有关 `prop` 的所有必要信息：第一个参数 `this` 指的是外部类 `C` 的实例，而 `this::prop` 是描述 `prop` 本身的 `KProperty` 类型的反射对象。

### 委托属性的优化情况 (Optimized cases for delegated properties)

如果委托是以下情况，则将省略 `$delegate` 字段：
* 引用的属性：

  ```kotlin
  class C<Type> {
      private var impl: Type = ...
      var prop: Type by ::impl
  }
  ```

* 命名对象：

  ```kotlin
  object NamedObject {
      operator fun getValue(thisRef: Any?, property: KProperty<*>): String = ...
  }

  val s: String by NamedObject
  ```

* 同一模块中具有后备字段和默认 getter 的 final `val` 属性：

  ```kotlin
  val impl: ReadOnlyProperty<Any?, String> = ...

  class A {
      val s: String by impl
  }
  ```

* 常量表达式、枚举条目、`this`、`null`。`this` 的示例：

  ```kotlin
  class A {
      operator fun getValue(thisRef: Any?, property: KProperty<*>) ...
 
      val s by this
  }
  ```

### 委托给另一个属性时的转换规则 (Translation rules when delegating to another property)

当委托给另一个属性时，Kotlin 编译器会生成对引用属性的直接访问。这意味着编译器不会生成字段 `prop$delegate`。这种优化有助于节省内存。

例如，考虑以下代码：

```kotlin
class C<Type> {
    private var impl: Type = ...
    var prop: Type by ::impl
}
```

`prop` 变量的属性访问器直接调用 `impl` 变量，跳过委托属性的 `getValue` 和 `setValue` 运算符，因此不需要 `KProperty` 引用对象。

对于上面的代码，编译器生成以下代码：

```kotlin
class C<Type> {
    private var impl: Type = ...

    var prop: Type
        get() = impl
        set(value) {
            impl = value
        }
    
    fun getProp$delegate(): Type = impl // This method is needed only for reflection
}
```

## 提供委托 (Providing a delegate)

通过定义 `provideDelegate` 运算符，你可以扩展用于创建属性实现所委托给的对象的逻辑。 如果在 `by` 右侧使用的对象将 `provideDelegate` 定义为成员函数或扩展函数，则将调用该函数以创建属性委托实例。

`provideDelegate` 的一个可能的用例是在初始化时检查属性的一致性。

例如，要在绑定之前检查属性名称，你可以编写如下代码：

```kotlin
class ResourceDelegate<T> : ReadOnlyProperty<MyUI, T> {
    override fun getValue(thisRef: MyUI, property: KProperty<*>): T { ... }
}
    
class ResourceLoader<T>(id: ResourceID<T>) {
    operator fun provideDelegate(
            thisRef: MyUI,
            prop: KProperty<*>
    ): ReadOnlyProperty<MyUI, T> {
        checkProperty(thisRef, prop.name)
        // create delegate
        return ResourceDelegate()
    }

    private fun checkProperty(thisRef: MyUI, name: String) { ... }
}

class MyUI {
    fun <T> bindResource(id: ResourceID<T>): ResourceLoader<T> { ... }

    val image by bindResource(ResourceID.image_id)
    val text by bindResource(ResourceID.text_id)
}
```

`provideDelegate` 的参数与 `getValue` 的参数相同：

* `thisRef` 必须与*属性所有者 (property owner)* 的类型相同或是其超类型（对于扩展属性，它应该是被扩展的类型）；
* `property` 必须是 `KProperty<*>` 类型或其超类型。

在创建 `MyUI` 实例期间，会为每个属性调用 `provideDelegate` 方法，并立即执行必要的验证。

如果没有这种拦截属性及其委托之间绑定的能力，为了实现相同的功能，你必须显式传递属性名称，这不是很方便：

```kotlin
// Checking the property name without "provideDelegate" functionality
class MyUI {
    val image by bindResource(ResourceID.image_id, "image")
    val text by bindResource(ResourceID.text_id, "text")
}

fun <T> MyUI.bindResource(
        id: ResourceID<T>,
        propertyName: String
): ReadOnlyProperty<MyUI, T> {
    checkProperty(this, propertyName)
    // create delegate
}
```

在生成的代码中，调用 `provideDelegate` 方法以初始化辅助 `prop$delegate` 属性。 将属性声明 `val prop: Type by MyDelegate()` 的生成代码与 [上面](#translation-rules-for-delegated-properties) 的生成代码（当 `provideDelegate` 方法不存在时）进行比较：

```kotlin
class C {
    var prop: Type by MyDelegate()
}

// this code is generated by the compiler 
// when the 'provideDelegate' function is available:
class C {
    // calling "provideDelegate" to create the additional "delegate" property
    private val prop$delegate = MyDelegate().provideDelegate(this, this::prop)
    var prop: Type
        get() = prop$delegate.getValue(this, this::prop)
        set(value: Type) = prop$delegate.setValue(this, this::prop, value)
}
```

请注意，`provideDelegate` 方法仅影响辅助属性的创建，而不影响为 getter 或 setter 生成的代码。

借助标准库中的 `PropertyDelegateProvider` 接口，你可以创建委托提供程序，而无需创建新类。

```kotlin
val provider = PropertyDelegateProvider { thisRef: Any?, property `->`
    ReadOnlyProperty<Any?, Int> {_, property `->` 42 }
}
val delegate: Int by provider
```