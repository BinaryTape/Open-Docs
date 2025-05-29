[//]: # (title: 属性)

## 声明属性

Kotlin 类中的属性可以使用 `var` 关键字声明为可变属性，或使用 `val` 关键字声明为只读属性。

```kotlin
class Address {
    var name: String = "Holmes, Sherlock"
    var street: String = "Baker"
    var city: String = "London"
    var state: String? = null
    var zip: String = "123456"
}
```

要使用属性，只需通过其名称引用它：

```kotlin
fun copyAddress(address: Address): Address {
    val result = Address() // Kotlin 中没有 'new' 关键字
    result.name = address.name // 访问器被调用
    result.street = address.street
    // ...
    return result
}
```

## Getter 和 Setter

声明属性的完整语法如下：

```kotlin
var <propertyName>[: <PropertyType>] [= <property_initializer>]
    [<getter>]
    [<setter>]
```

初始化器 (initializer)、Getter 和 Setter 都是可选的。如果属性类型可以从初始化器或 Getter 的返回类型推断出来，则该类型是可选的，如下所示：

```kotlin
var initialized = 1 // 类型为 Int，具有默认 Getter 和 Setter
// var allByDefault // 错误：需要显式初始化器，暗示具有默认 Getter 和 Setter
```

只读属性声明的完整语法与可变属性声明有两种不同：它以 `val` 而不是 `var` 开头，并且不允许使用 Setter：

```kotlin
val simple: Int? // 类型为 Int，具有默认 Getter，必须在构造函数中初始化
val inferredType = 1 // 类型为 Int，具有默认 Getter
```

你可以为属性定义自定义访问器 (custom accessor)。如果你定义了一个自定义 Getter，每次访问该属性时它都会被调用（通过这种方式可以实现一个计算属性 (computed property)）。以下是自定义 Getter 的示例：

```kotlin
//sampleStart
class Rectangle(val width: Int, val height: Int) {
    val area: Int // 属性类型是可选的，因为可以从 Getter 的返回类型推断出来
        get() = this.width * this.height
}
//sampleEnd
fun main() {
    val rectangle = Rectangle(3, 4)
    println("Width=${rectangle.width}, height=${rectangle.height}, area=${rectangle.area}")
}
```
{kotlin-runnable="true"}

如果属性类型可以从 Getter 推断出来，你可以省略它：

```kotlin
val area get() = this.width * this.height
```

如果你定义了一个自定义 Setter，除了初始化之外，每次为属性赋值时它都会被调用。自定义 Setter 看起来像这样：

```kotlin
var stringRepresentation: String
    get() = this.toString()
    set(value) {
        setDataFromString(value) // 解析字符串并为其他属性赋值
    }
```

按照惯例，Setter 参数的名称是 `value`，但如果你愿意，可以选择不同的名称。

如果你需要注解一个访问器或更改其可见性，但又不想更改默认实现，则可以在不定义其主体的情况下定义访问器：

```kotlin
var setterVisibility: String = "abc"
    private set // Setter 是私有的，并具有默认实现

var setterWithAnnotation: Any? = null
    @Inject set // 使用 Inject 注解 Setter
```

### 后备字段

在 Kotlin 中，字段 (field) 仅作为属性的一部分用于在内存中保存其值。字段不能直接声明。但是，当属性需要后备字段 (backing field) 时，Kotlin 会自动提供它。该后备字段可以使用 `field` 标识符在访问器中引用：

```kotlin
var counter = 0 // 初始化器直接为后备字段赋值
    set(value) {
        if (value >= 0)
            field = value
            // counter = value // 错误 StackOverflow：使用实际名称 'counter' 将导致 Setter 递归
    }
```

`field` 标识符只能在属性的访问器中使用。

如果属性使用了至少一个访问器的默认实现，或者自定义访问器通过 `field` 标识符引用了它，那么就会为该属性生成一个后备字段。

例如，在以下情况下将不会有后备字段：

```kotlin
val isEmpty: Boolean
    get() = this.size == 0
```

### 后备属性

如果你想做一些不符合这种*隐式后备字段*机制的事情，你总是可以退回到使用*后备属性* (backing property)：

```kotlin
private var _table: Map<String, Int>? = null
public val table: Map<String, Int>
    get() {
        if (_table == null) {
            _table = HashMap() // 类型参数被推断
        }
        return _table ?: throw AssertionError("Set to null by another thread")
    }
```

> 在 JVM 上：对具有默认 Getter 和 Setter 的私有属性的访问经过优化，以避免函数调用开销。
>
{style="note"}

## 编译期常量

如果只读属性的值在编译时已知，请使用 `const` 修饰符将其标记为*编译期常量* (compile time constant)。此类属性需要满足以下要求：

*   它必须是顶层属性，或者是 [`object` 声明](object-declarations.md#object-declarations-overview)或*伴生对象* ([companion object](object-declarations.md#companion-objects)) 的成员。
*   它必须用 `String` 类型或基本类型的值进行初始化。
*   它不能是自定义 Getter。

编译器将内联常量的用法，将对常量的引用替换为其实际值。但是，该字段不会被移除，因此可以通过[反射](reflection.md)与其交互。

此类属性也可以在注解中使用：

```kotlin
const val SUBSYSTEM_DEPRECATED: String = "This subsystem is deprecated"

@Deprecated(SUBSYSTEM_DEPRECATED) fun foo() { ... }
```

## 延迟初始化属性和变量

通常，声明为非空 (non-nullable) 类型的属性必须在构造函数中初始化。然而，这样做通常不方便。例如，属性可以通过依赖注入或在单元测试的设置方法中进行初始化。在这些情况下，你不能在构造函数中提供一个非空初始化器，但你仍然希望在类主体内部引用该属性时避免空检查。

为了处理这种情况，你可以使用 `lateinit` 修饰符标记该属性：

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

此修饰符可用于类主体内部声明的 `var` 属性（不能在主构造函数中，并且仅当属性没有自定义 Getter 或 Setter 时），以及顶层属性和局部变量。属性或变量的类型必须是非空的，并且不能是基本类型。

在 `lateinit` 属性初始化之前访问它会抛出一个特殊异常，该异常清晰地标识了被访问的属性以及它尚未初始化的事实。

### 检查 `lateinit var` 是否已初始化

要检查 `lateinit var` 是否已初始化，请在该属性的[引用](reflection.md#property-references)上使用 `.isInitialized`：

```kotlin
if (foo::bar.isInitialized) {
    println(foo.bar)
}
```

此检查仅适用于在相同类型、其中一个外部类型或在同一文件的顶层声明时，词法上可访问的属性。

## 覆盖属性

请参阅[覆盖属性](inheritance.md#overriding-properties)

## 委托属性

最常见的属性类型只是简单地从后备字段读取（也可能写入），但自定义 Getter 和 Setter 允许你使用属性来实现属性的任何行为。在第一种的简单性和第二种的多样性之间，存在一些常见的属性行为模式。例如：惰性值 (lazy values)、通过给定键从 Map 中读取、访问数据库、在访问时通知监听器。

这些常见的行为可以使用[委托属性](delegated-properties.md)作为库来实现。