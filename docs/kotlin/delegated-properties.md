[//]: # (title: 委托属性)

对于一些常见的属性类型，尽管你每次需要时都可以手动实现它们，但更有效的方式是只实现一次，将其添加到库中，并在以后复用。例如：

*   *惰性*属性：值仅在首次访问时计算。
*   *可观测*属性：属性发生变化时通知监听器。
*   将属性存储在 *map* 中，而不是为每个属性单独创建一个字段。

为涵盖这些（以及其他）情况，Kotlin 支持*委托属性*：

```kotlin
class Example {
    var p: String by Delegate()
}
```

语法是：`val/var <property name>: <Type> by <expression>`。`by` 后面的表达式是一个*委托*，因为对应于该属性的 `get()`（和 `set()`）将委托给其 `getValue()` 和 `setValue()` 方法。属性委托不必实现接口，但它们必须提供一个 `getValue()` 函数（`var` 属性还需要 `setValue()`）。

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

当你从 `p` 读取值时（`p` 委托给 `Delegate` 的一个实例），`Delegate` 中的 `getValue()` 函数会被调用。它的第一个实参是你读取 `p` 的对象，第二个实参包含 `p` 本身的描述（例如，你可以获取它的名字）。

```kotlin
val e = Example()
println(e.p)
```

这会打印：

```
Example@33a17727, thank you for delegating 'p' to me!
```

类似地，当你给 `p` 赋值时，`setValue()` 函数会被调用。前两个实参是相同的，第三个实参包含被赋予的值：

```kotlin
e.p = "NEW"
```

这会打印：
 
```
NEW has been assigned to 'p' in Example@33a17727.
```

关于委托对象要求的规范可以在[下方](#property-delegate-requirements)找到。

你可以在函数或代码块内声明委托属性；它不必是类的成员。
你可以在[下方](#local-delegated-properties)找到一个示例。

## 标准委托

Kotlin 标准库为几种有用的委托类型提供了工厂方法。

### 惰性属性

[`lazy()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/lazy.html) 是一个函数，它接受一个 lambda 表达式并返回一个 `Lazy<T>` 实例，该实例可以用作实现惰性属性的委托。
第一次调用 `get()` 会执行传递给 `lazy()` 的 lambda 表达式并记住结果。
后续调用 `get()` 只会返回记住的结果。

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
{kotlin-runnable="true"}

默认情况下，惰性属性的求值是*同步的*：值仅在一个线程中计算，但所有线程都会看到相同的值。如果不需要初始化委托的同步以允许多个线程同时执行它，则将 `LazyThreadSafetyMode.PUBLICATION` 作为实参传递给 `lazy()`。

如果你确定初始化将始终在使用该属性的同一个线程中发生，则可以使用 `LazyThreadSafetyMode.NONE`。它不承担任何线程安全保证和相关的开销。

### 可观测属性

[`Delegates.observable()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.properties/-delegates/observable.html) 接受两个实参：初始值和修改处理程序。

每当你给属性赋值时（*在*赋值执行*之后*），处理程序都会被调用。它有三个形参：被赋值的属性、旧值和新值：

```kotlin
import kotlin.properties.Delegates

class User {
    var name: String by Delegates.observable("<no name>") {
        prop, old, new ->
        println("$old -> $new")
    }
}

fun main() {
    val user = User()
    user.name = "first"
    user.name = "second"
}
```
{kotlin-runnable="true"}

如果你想拦截赋值并*否决*它们，请使用 [`vetoable()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.properties/-delegates/vetoable.html) 而不是 `observable()`。
传递给 `vetoable` 的处理程序将在新属性值赋值*之前*被调用。

## 委托给另一个属性

属性可以将其 getter 和 setter 委托给另一个属性。这种委托适用于顶层属性和类属性（成员属性和扩展属性）。委托属性可以是：
*   一个顶层属性
*   同一个类的成员属性或扩展属性
*   另一个类的成员属性或扩展属性

要将属性委托给另一个属性，请在委托名称中使用 `::` 限定符，例如 `this::delegate` 或 `MyClass::delegate`。

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

这可能很有用，例如，当你希望以向后兼容的方式重命名属性时：引入一个新属性，用 `@Deprecated` 注解标记旧属性，并委托其实现。

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
{kotlin-runnable="true" kotlin-min-compiler-version="1.4"}

## 在 map 中存储属性

一个常见的用例是将属性值存储在 map 中。
这在应用程序中经常出现，例如解析 JSON 或执行其他动态任务时。
在这种情况下，你可以将 map 实例本身用作委托属性的委托。

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

委托属性通过字符串键从该 map 中获取值，这些键与属性名称相关联：

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
//sampleStart
    println(user.name) // Prints "John Doe"
    println(user.age)  // Prints 25
//sampleEnd
}
```
{kotlin-runnable="true"}

如果你使用 `MutableMap` 而不是只读的 `Map`，这也适用于 `var` 属性：

```kotlin
class MutableUser(val map: MutableMap<String, Any?>) {
    var name: String by map
    var age: Int     by map
}
```

## 局部委托属性

你可以将局部变量声明为委托属性。
例如，你可以使局部变量成为惰性变量：

```kotlin
fun example(computeFoo: () -> Foo) {
    val memoizedFoo by lazy(computeFoo)

    if (someCondition && memoizedFoo.isValid()) {
        memoizedFoo.doSomething()
    }
}
```

`memoizedFoo` 变量只会在首次访问时计算。
如果 `someCondition` 失败，该变量将完全不计算。

## 属性委托要求

对于*只读*属性 (`val`)，委托应提供一个 `getValue()` 操作符函数，其形参如下：

*   `thisRef` 必须与*属性拥有者*的类型相同或为其超类型（对于扩展属性，它应该是被扩展的类型）。
*   `property` 必须是 `KProperty<*>` 类型或其超类型。

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

对于*可变*属性 (`var`)，委托必须额外提供一个 `setValue()` 操作符函数，其形参如下：

*   `thisRef` 必须与*属性拥有者*的类型相同或为其超类型（对于扩展属性，它应该是被扩展的类型）。
*   `property` 必须是 `KProperty<*>` 类型或其超类型。
*   `value` 必须与属性的类型相同（或其子类型）。
 
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

`getValue()` 和/或 `setValue()` 函数可以作为委托类的成员函数或扩展函数提供。
后者在你需要将属性委托给一个原始不提供这些函数的对象时非常方便。
这两个函数都需要用 `operator` 关键字标记。

你可以通过使用 Kotlin 标准库中的 `ReadOnlyProperty` 和 `ReadWriteProperty` 接口，创建匿名对象作为委托而无需创建新类。
它们提供了所需的方法：`getValue()` 在 `ReadOnlyProperty` 中声明；`ReadWriteProperty` 扩展了它并添加了 `setValue()`。这意味着在需要 `ReadOnlyProperty` 的地方，你可以传递一个 `ReadWriteProperty`。

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

## 委托属性的翻译规则

在底层，Kotlin 编译器会为某些类型的委托属性生成辅助属性，然后委托给它们。

> 为进行优化，编译器在以下几种情况下*不*生成辅助属性：[优化的委托属性情况](#optimized-cases-for-delegated-properties)。
> 以[委托给另一个属性](#translation-rules-when-delegating-to-another-property)的示例了解优化。
>
{style="note"}

例如，对于属性 `prop`，它会生成隐藏属性 `prop$delegate`，并且访问器的代码只是委托给这个附加属性：

```kotlin
class C {
    var prop: Type by MyDelegate()
}

// 编译器生成的代码如下：
class C {
    private val prop$delegate = MyDelegate()
    var prop: Type
        get() = prop$delegate.getValue(this, this::prop)
        set(value: Type) = prop$delegate.setValue(this, this::prop, value)
}
```

Kotlin 编译器在实参中提供了关于 `prop` 的所有必要信息：第一个实参 `this` 指的是外部类 `C` 的实例，`this::prop` 是描述 `prop` 本身的 `KProperty` 类型反射对象。

### 优化的委托属性情况

如果委托是以下情况，将省略 `$delegate` 字段：
*   一个引用属性：

  ```kotlin
  class C<Type> {
      private var impl: Type = ...
      var prop: Type by ::impl
  }
  ```

*   一个命名对象：

  ```kotlin
  object NamedObject {
      operator fun getValue(thisRef: Any?, property: KProperty<*>): String = ...
  }

  val s: String by NamedObject
  ```

*   在同一个模块中，带有幕后字段和默认 getter 的 final `val` 属性：

  ```kotlin
  val impl: ReadOnlyProperty<Any?, String> = ...

  class A {
      val s: String by impl
  }
  ```

*   一个常量表达式、枚举条目、`this`、`null`。`this` 的示例：

  ```kotlin
  class A {
      operator fun getValue(thisRef: Any?, property: KProperty<*>) ...
 
      val s by this
  }
  ```

### 委托给另一个属性时的翻译规则

当委托给另一个属性时，Kotlin 编译器会生成对引用属性的直接访问。
这意味着编译器不会生成 `prop$delegate` 字段。这种优化有助于节省内存。

例如，考虑以下代码：

```kotlin
class C<Type> {
    private var impl: Type = ...
    var prop: Type by ::impl
}
```

`prop` 变量的属性访问器会直接调用 `impl` 变量，跳过委托属性的 `getValue` 和 `setValue` 操作符，
因此不需要 `KProperty` 引用对象。

对于上述代码，编译器会生成以下代码：

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

## 提供委托

通过定义 `provideDelegate` 操作符，你可以扩展创建属性实现委托对象的逻辑。如果 `by` 右侧的对象定义了 `provideDelegate` 作为成员或扩展函数，则会调用该函数来创建属性委托实例。

`provideDelegate` 的一个可能用例是在属性初始化时检测其一致性。

例如，要在绑定前检测属性名称，你可以这样写：

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

`provideDelegate` 的形参与 `getValue` 的形参相同：

*   `thisRef` 必须与*属性拥有者*的类型相同或为其超类型（对于扩展属性，它应该是被扩展的类型）；
*   `property` 必须是 `KProperty<*>` 类型或其超类型。

`provideDelegate` 方法在 `MyUI` 实例创建期间为每个属性调用，并立即执行必要的验证。

如果没有这种拦截属性与其委托之间绑定的能力，要实现相同的功能，你必须显式传递属性名称，这不是很方便：

```kotlin
// 不使用 "provideDelegate" 功能来检测属性名称
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

在生成的代码中，`provideDelegate` 方法被调用来初始化辅助属性 `prop$delegate`。
将属性声明 `val prop: Type by MyDelegate()` 的生成代码与[上面](#translation-rules-for-delegated-properties)（当 `provideDelegate` 方法不存在时）的生成代码进行比较：

```kotlin
class C {
    var prop: Type by MyDelegate()
}

// 当 'provideDelegate' 函数可用时，
// 编译器会生成此代码：
class C {
    // 调用 "provideDelegate" 来创建附加的 "delegate" 属性
    private val prop$delegate = MyDelegate().provideDelegate(this, this::prop)
    var prop: Type
        get() = prop$delegate.getValue(this, this::prop)
        set(value: Type) = prop$delegate.setValue(this, this::prop, value)
}
```

请注意，`provideDelegate` 方法仅影响辅助属性的创建，不影响为 getter 或 setter 生成的代码。

通过标准库中的 `PropertyDelegateProvider` 接口，你可以创建委托提供者而无需创建新类。

```kotlin
val provider = PropertyDelegateProvider { thisRef: Any?, property ->
    ReadOnlyProperty<Any?, Int> {_, property -> 42 }
}
val delegate: Int by provider
```