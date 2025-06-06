[//]: # (title: 委托属性)

对于一些常见的属性类型，尽管你可以在每次需要时手动实现它们，但更有效的方式是只实现一次，将其添加到库中，然后重复使用。例如：

*   **惰性属性 (Lazy properties)**：值仅在首次访问时计算。
*   **可观察属性 (Observable properties)**：监听器会在属性变化时收到通知。
*   将属性存储在**映射 (map)** 中，而不是为每个属性单独创建一个字段。

为了涵盖这些（以及其他）情况，Kotlin 支持**委托属性 (delegated properties)**：

```kotlin
class Example {
    var p: String by Delegate()
}
```

语法是：`val/var <property name>: <Type> by <expression>`。`by` 后面的表达式是一个 _委托_ (delegate)，因为与该属性对应的 `get()`（和 `set()`）将委托给其 `getValue()` 和 `setValue()` 方法。属性委托 (Property delegates) 不需要实现接口，但它们必须提供 `getValue()` 函数（以及 `var` 属性的 `setValue()`）。

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

当你读取 `p`（它委托给 `Delegate` 的一个实例）时，会调用 `Delegate` 中的 `getValue()` 函数。它的第一个参数是你从中读取 `p` 的对象，第二个参数包含 `p` 本身的一个描述（例如，你可以获取它的名称）。

```kotlin
val e = Example()
println(e.p)
```

这会打印：

```
Example@33a17727, thank you for delegating 'p' to me!
```

类似地，当你向 `p` 赋值时，会调用 `setValue()` 函数。前两个参数相同，第三个参数保存了被赋的值：

```kotlin
e.p = "NEW"
```

这会打印：
 
```
NEW has been assigned to 'p' in Example@33a17727.
```

关于委托对象要求的规范可以在[下方](#property-delegate-requirements)找到。

你可以在函数或代码块内部声明委托属性；它不一定是类的成员。你可以在[下方](#local-delegated-properties)找到一个示例。

## 标准委托

Kotlin 标准库为几种有用的委托类型提供了工厂方法。

### 惰性属性

[`lazy()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/lazy.html) 是一个接受 lambda 表达式并返回 `Lazy<T>` 实例的函数，`Lazy<T>` 可以作为实现惰性属性的委托。首次调用 `get()` 会执行传递给 `lazy()` 的 lambda 表达式并记住结果。后续调用 `get()` 只会返回记住的结果。

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

默认情况下，惰性属性的求值是*同步的*：值只在一个线程中计算，但所有线程都将看到相同的值。如果不需要初始化委托的同步以允许多个线程同时执行，请将 `LazyThreadSafetyMode.PUBLICATION` 作为参数传递给 `lazy()`。

如果你确定初始化将始终在你使用该属性的同一线程中发生，你可以使用 `LazyThreadSafetyMode.NONE`。它不提供任何线程安全保证，也不产生相关的开销。

### 可观察属性

[`Delegates.observable()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.properties/-delegates/observable.html) 接受两个参数：初始值和修改处理器。

每当你给属性赋值时（*在*赋值执行*之后*），都会调用该处理器。它有三个参数：被赋值的属性、旧值和新值：

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

如果你想拦截赋值并*否决*它们，请使用 [`vetoable()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.properties/-delegates/vetoable.html) 而不是 `observable()`。传递给 `vetoable` 的处理器将在新属性值赋值*之前*被调用。

## 委托给另一个属性

一个属性可以将其 getter 和 setter 委托给另一个属性。这种委托对于顶层属性和类属性（成员属性和扩展属性）都可用。委托属性可以是：
*   一个顶层属性
*   同一类的成员属性或扩展属性
*   另一个类的成员属性或扩展属性

要将一个属性委托给另一个属性，请在委托名称中使用 `::` 限定符，例如 `this::delegate` 或 `MyClass::delegate`。

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

这可能很有用，例如，当你希望以向后兼容的方式重命名一个属性时：引入一个新属性，用 `@Deprecated` 注解标记旧属性，并委托其实现。

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

## 将属性存储在映射中

一个常见的用例是将属性的值存储在映射 (map) 中。这经常出现在解析 JSON 或执行其他动态任务等应用程序中。在这种情况下，你可以直接使用 map 实例作为委托属性的委托。

```kotlin
class User(val map: Map<String, Any?>) {
    val name: String by map
    val age: Int     by map
}
```

在这个示例中，构造函数接受一个 map：

```kotlin
val user = User(mapOf(
    "name" to "John Doe",
    "age"  to 25
))
```

委托属性通过字符串键从该映射中获取值，这些键与属性的名称相关联：

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

如果你使用 `MutableMap` 而不是只读 `Map`，这也适用于 `var` 属性：

```kotlin
class MutableUser(val map: MutableMap<String, Any?>) {
    var name: String by map
    var age: Int     by map
}
```

## 局部委托属性

你可以将局部变量声明为委托属性。例如，你可以使一个局部变量变为惰性的 (lazy)：

```kotlin
fun example(computeFoo: () -> Foo) {
    val memoizedFoo by lazy(computeFoo)

    if (someCondition && memoizedFoo.isValid()) {
        memoizedFoo.doSomething()
    }
}
```

`memoizedFoo` 变量仅在首次访问时计算。如果 `someCondition` 为假，则该变量根本不会被计算。

## 属性委托要求

对于*只读*属性 (`val`)，委托应提供一个带以下参数的运算符函数 `getValue()`：

*   `thisRef` 必须与*属性所有者*的类型相同，或是其超类型（对于扩展属性，它应该是被扩展的类型）。
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

对于*可变*属性 (`var`)，委托还必须额外提供一个带以下参数的运算符函数 `setValue()`：

*   `thisRef` 必须与*属性所有者*的类型相同，或是其超类型（对于扩展属性，它应该是被扩展的类型）。
*   `property` 必须是 `KProperty<*>` 类型或其超类型。
*   `value` 必须与属性的类型相同（或其超类型）。
 
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

`getValue()` 和/或 `setValue()` 函数既可以作为委托类的成员函数提供，也可以作为扩展函数提供。当你需要将属性委托给一个最初不提供这些函数的对象时，后者会很方便。这两个函数都需要用 `operator` 关键字标记。

你可以使用 Kotlin 标准库中的 `ReadOnlyProperty` 和 `ReadWriteProperty` 接口，以匿名对象的形式创建委托，而无需创建新类。它们提供了所需的方法：`getValue()` 在 `ReadOnlyProperty` 中声明；`ReadWriteProperty` 继承了它并添加了 `setValue()`。这意味着在期望 `ReadOnlyProperty` 的任何地方，你都可以传递一个 `ReadWriteProperty`。

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

在底层，Kotlin 编译器为某些类型的委托属性生成辅助属性，然后将委托给它们。

> 出于优化目的，编译器在某些情况下*不会*生成辅助属性。通过[委托给另一个属性](#translation-rules-when-delegating-to-another-property)的示例了解优化。
>
{style="note"}

例如，对于属性 `prop`，它会生成隐藏属性 `prop$delegate`，并且访问器的代码只是简单地委托给这个附加属性：

```kotlin
class C {
    var prop: Type by MyDelegate()
}

// 这是编译器生成的代码：
class C {
    private val prop$delegate = MyDelegate()
    var prop: Type
        get() = prop$delegate.getValue(this, this::prop)
        set(value: Type) = prop$delegate.setValue(this, this::prop, value)
}
```

Kotlin 编译器在参数中提供了关于 `prop` 的所有必要信息：第一个参数 `this` 指的是外部类 `C` 的一个实例，而 `this::prop` 是描述 `prop` 本身的一个 `KProperty` 类型的反射对象。

### 委托属性的优化情况

如果委托是以下情况，则 `$delegate` 字段将被省略：
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

*   同一个模块中带后备字段和默认 getter 的 final `val` 属性：

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

当委托给另一个属性时，Kotlin 编译器会生成对引用属性的直接访问。这意味着编译器不会生成 `prop$delegate` 字段。这种优化有助于节省内存。

例如，以下面的代码为例：

```kotlin
class C<Type> {
    private var impl: Type = ...
    var prop: Type by ::impl
}
```

`prop` 变量的属性访问器直接调用 `impl` 变量，跳过了委托属性的 `getValue` 和 `setValue` 运算符，因此不需要 `KProperty` 引用对象。

对于上面的代码，编译器生成了以下代码：

```kotlin
class C<Type> {
    private var impl: Type = ...

    var prop: Type
        get() = impl
        set(value) {
            impl = value
        }
    
    fun getProp$delegate(): Type = impl // 此方法仅用于反射
}
```

## 提供委托

通过定义 `provideDelegate` 运算符，你可以扩展用于创建属性实现所委托的对象的逻辑。如果 `by` 右侧使用的对象将 `provideDelegate` 定义为成员函数或扩展函数，则会调用该函数来创建属性委托实例。

`provideDelegate` 的一个可能用例是在属性初始化时检查其一致性。

例如，在绑定前检查属性名称，你可以这样写：

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

*   `thisRef` 必须与*属性所有者*的类型相同，或是其超类型（对于扩展属性，它应该是被扩展的类型）；
*   `property` 必须是 `KProperty<*>` 类型或其超类型。

在创建 `MyUI` 实例期间，`provideDelegate` 方法会为每个属性调用，并立即执行必要的验证。

如果没有这种拦截属性与其委托之间绑定的能力，要实现相同的功能，你必须显式传递属性名称，这不是很方便：

```kotlin
// 没有 "provideDelegate" 功能时检查属性名称
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

在生成的代码中，会调用 `provideDelegate` 方法来初始化辅助属性 `prop$delegate`。将属性声明 `val prop: Type by MyDelegate()` 的生成代码与[上面](#translation-rules-for-delegated-properties)（当 `provideDelegate` 方法不存在时）的生成代码进行比较：

```kotlin
class C {
    var prop: Type by MyDelegate()
}

// 当 'provideDelegate' 函数可用时，这是编译器生成的代码：
class C {
    // 调用 "provideDelegate" 来创建额外的 "delegate" 属性
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