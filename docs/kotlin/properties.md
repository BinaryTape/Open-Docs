---
title: 属性
---
## 声明属性

Kotlin 类中的属性可以使用 `var` 关键字声明为可变的，或者使用 `val` 关键字声明为只读的。

```kotlin
class Address {
    var name: String = "Holmes, Sherlock"
    var street: String = "Baker"
    var city: String = "London"
    var state: String? = null
    var zip: String = "123456"
}
```

要使用一个属性，只需通过它的名字来引用它：

```kotlin
fun copyAddress(address: Address): Address {
    val result = Address() // Kotlin 中没有 'new' 关键字
    result.name = address.name // 访问器被调用
    result.street = address.street
    // ...
    return result
}
```

## Getters 和 Setters

声明属性的完整语法如下：

```kotlin
var <propertyName>[: <PropertyType>] [= <property_initializer>]
    [<getter>]
    [<setter>]
```

初始化器（initializer）、getter 和 setter 都是可选的。如果属性类型可以从初始化器或者 getter 的返回类型中推断出来，那么属性类型也是可选的，如下所示：

```kotlin
var initialized = 1 // 类型为 Int，默认的 getter 和 setter
// var allByDefault // 错误：需要显式的初始化器，默认的 getter 和 setter 是隐含的
```

只读属性声明的完整语法与可变属性声明在两方面有所不同：它以 `val` 开头而不是 `var`，并且不允许 setter：

```kotlin
val simple: Int? // 类型为 Int，默认的 getter，必须在构造函数中初始化
val inferredType = 1 // 类型为 Int，并且有一个默认的 getter
```

你可以为一个属性定义自定义的访问器（accessor）。如果你定义了一个自定义的 getter，那么每次你访问这个属性的时候，它都会被调用（这样你可以实现一个计算属性）。这是一个自定义 getter 的例子：

```kotlin

class Rectangle(val width: Int, val height: Int) {
    val area: Int // 属性类型是可选的，因为它可以从 getter 的返回类型中推断出来
        get() = this.width * this.height
}

fun main() {
    val rectangle = Rectangle(3, 4)
    println("Width=${rectangle.width}, height=${rectangle.height}, area=${rectangle.area}")
}
```

如果属性类型可以从 getter 中推断出来，你可以省略属性类型：

```kotlin
val area get() = this.width * this.height
```

如果你定义了一个自定义的 setter，那么每次你给属性赋值的时候，它都会被调用，除了初始化的时候。一个自定义的 setter 看起来像这样：

```kotlin
var stringRepresentation: String
    get() = this.toString()
    set(value) {
        setDataFromString(value) // 解析字符串并将值赋给其他属性
    }
```

按照惯例，setter 参数的名字是 `value`，但是如果你喜欢，你可以选择一个不同的名字。

如果你需要给一个访问器添加注解或者改变它的可见性，但是你不想改变默认的实现，你可以定义这个访问器而不定义它的主体：

```kotlin
var setterVisibility: String = "abc"
    private set // setter 是私有的，并且有默认的实现

var setterWithAnnotation: Any? = null
    @Inject set // 使用 Inject 注解 setter
```

### Backing fields (幕后字段)

在 Kotlin 中，一个 field 仅仅作为属性的一部分，用于在内存中保存它的值。Fields 不能被直接声明。然而，当一个属性需要一个 backing field 时，Kotlin 会自动提供它。这个 backing field 可以在访问器中使用 `field` 标识符来引用：

```kotlin
var counter = 0 // 初始化器直接赋值给 backing field
    set(value) {
        if (value >= 0)
            field = value
            // counter = value // ERROR StackOverflow: 使用实际的名字 'counter' 会使 setter 递归调用
    }
```

`field` 标识符只能在属性的访问器中使用。

如果一个属性使用了至少一个访问器的默认实现，或者一个自定义的访问器通过 `field` 标识符引用了它，那么就会为一个属性生成一个 backing field。

例如，在下面的情况下，不会有 backing field：

```kotlin
val isEmpty: Boolean
    get() = this.size == 0
```

### Backing properties (幕后属性)

如果你想做一些不适合这种 *隐式 backing field* 方案的事情，你总是可以退回到拥有一个 *backing property*：

```kotlin
private var _table: Map<String, Int>? = null
public val table: Map<String, Int>
    get() {
        if (_table == null) {
            _table = HashMap() // 类型参数会被推断
        }
        return _table ?: throw AssertionError("Set to null by another thread")
    }
```

:::note
在 JVM 上：对具有默认 getter 和 setter 的私有属性的访问进行了优化，以避免函数调用开销。

:::

## Compile-time constants (编译时常量)

如果一个只读属性的值在编译时是已知的，使用 `const` 修饰符将其标记为一个 *compile time constant*。
这样的属性需要满足以下要求：

* 它必须是一个顶层属性，或者是一个 [`object` 声明](object-declarations#object-declarations-overview)或者一个 [companion object](object-declarations#companion-objects) 的成员。
* 它必须使用 `String` 类型或一个原始类型的值来初始化
* 它不能是一个自定义的 getter

编译器将内联使用该常量，将对该常量的引用替换为它的实际值。但是，该字段不会被删除，因此可以使用 [反射](reflection) 与之交互。

这样的属性也可以在注解中使用：

```kotlin
const val SUBSYSTEM_DEPRECATED: String = "This subsystem is deprecated"

@Deprecated(SUBSYSTEM_DEPRECATED) fun foo() { ... }
```

## Late-initialized properties and variables (延迟初始化属性和变量)

通常，声明为具有非空类型的属性必须在构造函数中初始化。
然而，通常情况下，这样做并不方便。例如，属性可以通过依赖注入来初始化，或者在单元测试的 setup 方法中初始化。在这些情况下，你不能在构造函数中提供一个非空的初始化器，
但是你仍然想避免在类的主体中引用该属性时进行 null 检查。

为了处理这种情况，你可以使用 `lateinit` 修饰符来标记该属性：

```kotlin
public class MyTest {
    lateinit var subject: TestSubject

    @SetUp fun setup() {
        subject = TestSubject()
    }

    @Test fun test() {
        subject.method()  // 直接解引用
    }
}
```

这个修饰符可以用于在类的主体中声明的 `var` 属性（不在主构造函数中，并且只有当属性没有自定义的 getter 或 setter 时），以及顶层属性和局部变量。
属性或变量的类型必须是非空的，并且它不能是一个原始类型。

在 `lateinit` 属性被初始化之前访问它会抛出一个特殊的异常，该异常清楚地标识了被访问的属性以及它尚未被初始化的事实。

### Checking whether a lateinit var is initialized (检查 lateinit var 是否已初始化)

要检查一个 `lateinit var` 是否已经被初始化，在 [对该属性的引用](reflection#property-references) 上使用 `.isInitialized`：

```kotlin
if (foo::bar.isInitialized) {
    println(foo.bar)
}
```

此检查仅适用于在同一类型、外部类型之一或同一文件中的顶层声明时，在词法上可访问的属性。

## Overriding properties (重写属性)

参见 [重写属性](inheritance#overriding-properties)

## Delegated properties (委托属性)

最常见的属性只是从一个 backing field 读取（并且可能写入），但是自定义的 getter 和 setter 允许你使用属性，这样就可以实现属性的任何类型的行为。在第一种类型的简单性和第二种类型的多样性之间，存在一些属性可以做的常见模式。一些例子：延迟值，通过给定的 key 从 map 中读取，访问数据库，在访问时通知监听器。

这些常见的行为可以使用 [委托属性](delegated-properties) 作为库来实现。