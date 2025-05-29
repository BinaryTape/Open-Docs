[//]: # (title: 编码规范)

广为人知且易于遵循的编码规范对任何编程语言都至关重要。在此，我们为使用 Kotlin 的项目提供了代码风格和代码组织方面的指导。

## 在 IDE 中配置样式

最流行的两款 Kotlin IDE——[IntelliJ IDEA](https://www.jetbrains.com/idea/) 和 [Android Studio](https://developer.android.com/studio/) 为代码风格提供了强大的支持。你可以配置它们，使其根据给定的代码风格自动格式化你的代码。

### 应用样式指南

1.  转到 **Settings/Preferences | Editor | Code Style | Kotlin**。
2.  点击 **Set from...**。
3.  选择 **Kotlin style guide**。

### 验证代码是否遵循样式指南

1.  转到 **Settings/Preferences | Editor | Inspections | General**。
2.  开启 **Incorrect formatting** 检查。
样式指南中描述的其他问题的检查（例如命名约定）默认是开启的。

## 源代码组织

### 目录结构

在纯 Kotlin 项目中，推荐的目录结构遵循包结构，并省略公共根包。例如，如果项目中的所有代码都位于 `org.example.kotlin` 包及其子包中，则 `org.example.kotlin` 包中的文件应直接放在源代码根目录下，而 `org.example.kotlin.network.socket` 中的文件应放在源代码根目录的 `network/socket` 子目录下。

> 在 JVM 项目中：在 Kotlin 与 Java 一起使用的项目中，Kotlin 源文件应与 Java 源文件位于同一源代码根目录下，并遵循相同的目录结构：每个文件都应存储在与每个包声明对应的目录中。
>
{style="note"}

### 源文件名

如果 Kotlin 文件只包含一个类或接口（可能带有关联的顶层声明），其名称应与该类的名称相同，并附加 `.kt` 扩展名。这适用于所有类型的类和接口。
如果一个文件包含多个类，或者只包含顶层声明，请选择一个描述文件内容的名字，并相应地命名文件。使用[大驼峰命名法](https://en.wikipedia.org/wiki/Camel_case)，即每个单词的首字母大写。例如，`ProcessDeclarations.kt`。

文件的名称应描述文件中的代码功能。因此，应避免在文件名中使用诸如 `Util` 等无意义的词语。

#### 多平台项目

在多平台项目中，平台特定源集中的顶层声明文件应带有与源集名称关联的后缀。例如：

*   **jvm**Main/kotlin/Platform.**jvm**.kt
*   **android**Main/kotlin/Platform.**android**.kt
*   **ios**Main/kotlin/Platform.**ios**.kt

至于公共源集，带顶层声明的文件不应有后缀。例如，`commonMain/kotlin/Platform.kt`。

##### 技术细节 {initial-collapse-state="collapsed" collapsible="true"}

由于 JVM 的限制，我们建议在多平台项目中遵循此文件命名方案：它不允许顶层成员（函数、属性）。

为了解决这个问题，Kotlin JVM 编译器会创建包装类（即“文件外观类”，"file facades"），其中包含顶层成员声明。文件外观类拥有一个派生自文件名的内部名称。

反过来，JVM 不允许存在多个具有相同完全限定名（FQN）的类。这可能导致 Kotlin 项目无法编译为 JVM 的情况：

```none
root
|- commonMain/kotlin/myPackage/Platform.kt // contains 'fun count() { }'
|- jvmMain/kotlin/myPackage/Platform.kt // contains 'fun multiply() { }'
```

在这里，两个 `Platform.kt` 文件都位于同一个包中，因此 Kotlin JVM 编译器会生成两个文件外观类，它们都具有 FQN `myPackage.PlatformKt`。这会产生“重复 JVM 类”错误。

避免这种情况的最简单方法是根据上述准则重命名其中一个文件。此命名方案有助于避免冲突，同时保持代码可读性。

> 在两种情况下，这些建议可能看起来是多余的，但我们仍然建议遵循它们：
>
> *   非 JVM 平台没有重复文件外观类的问题。然而，此命名方案可以帮助你保持文件命名的一致性。
> *   在 JVM 上，如果源文件没有顶层声明，则不会生成文件外观类，你也不会面临命名冲突。
>
>     然而，此命名方案可以帮助你避免在简单重构或添加操作中包含顶层函数并导致相同的“重复 JVM 类”错误的情况。
>
{style="tip"}

### 源文件组织

只要这些声明在语义上彼此密切相关，并且文件大小合理（不超过几百行），就鼓励将多个声明（类、顶层函数或属性）放在同一个 Kotlin 源文件中。

特别地，当为一个类定义对该类的所有客户端都相关的扩展函数时，应将它们放在与类本身相同的文件中。当定义仅对特定客户端有意义的扩展函数时，应将它们放在该客户端的代码旁边。避免仅为了容纳某个类的所有扩展而创建文件。

### 类布局

类的内容应按以下顺序排列：

1.  属性声明和初始化块
2.  次级构造函数
3.  方法声明
4.  伴生对象

不要按字母顺序或可见性对方法声明进行排序，也不要将常规方法与扩展方法分开。相反，应将相关内容放在一起，以便从上到下阅读类的人能够理解正在发生的事情的逻辑。选择一种顺序（无论是先高层级内容还是反之），并坚持下去。

将嵌套类放在使用这些类的代码旁边。如果这些类旨在外部使用且未在类内部引用，则将它们放在最后，在伴生对象之后。

### 接口实现布局

实现接口时，保持实现成员与接口成员的顺序相同（如有必要，可穿插用于实现的额外私有方法）。

### 重载布局

在类中始终将重载放在一起。

## 命名规则

Kotlin 中的包和类命名规则非常简单：

*   包名始终为小写，不使用下划线（`org.example.project`）。通常不鼓励使用多词名称，但如果确实需要使用多个词，可以直接将它们连接起来或使用驼峰命名法（`org.example.myProject`）。

*   类名和对象名使用大驼峰命名法：

```kotlin
open class DeclarationProcessor { /*...*/ }

object EmptyDeclarationProcessor : DeclarationProcessor() { /*...*/ }
```

### 函数名

函数名、属性名和局部变量名以小写字母开头，使用驼峰命名法，不带下划线：

```kotlin
fun processDeclarations() { /*...*/ }
var declarationCount = 1
```

例外：用于创建类实例的工厂函数可以与抽象返回类型同名：

```kotlin
interface Foo { /*...*/ }

class FooImpl : Foo { /*...*/ }

fun Foo(): Foo { return FooImpl() }
```

### 测试方法名

在测试中（且**仅限**在测试中），你可以使用用反引号括起来的带空格的方法名。请注意，此类方法名仅从 API level 30 开始受 Android 运行时支持。方法名中的下划线在测试代码中也是允许的。

```kotlin
class MyTestCase {
     @Test fun `ensure everything works`() { /*...*/ }
     
     @Test fun ensureEverythingWorks_onAndroid() { /*...*/ }
}
```

### 属性名

常量名（用 `const` 标记的属性，或不带自定义 `get` 函数且持有深度不可变数据的顶层或对象 `val` 属性）应使用全大写、下划线分隔的名称，遵循[尖叫蛇形命名法](https://en.wikipedia.org/wiki/Snake_case)：

```kotlin
const val MAX_COUNT = 8
val USER_NAME_FIELD = "UserName"
```

持有带行为或可变数据对象的顶层或对象属性应使用驼峰命名法：

```kotlin
val mutableCollection: MutableSet<String> = HashSet()
```

持有单例对象引用的属性可以使用与 `object` 声明相同的命名风格：

```kotlin
val PersonComparator: Comparator<Person> = /*...*/
```

对于枚举常量，可以使用全大写、下划线分隔的名称（[尖叫蛇形命名法](https://en.wikipedia.org/wiki/Snake_case)）（`enum class Color { RED, GREEN }`）或大驼峰命名法，具体取决于用法。

### 幕后属性名

如果一个类有两个在概念上相同的属性，但其中一个是公共 API 的一部分，另一个是实现细节，则私有属性的名称应以一个下划线作为前缀：

```kotlin
class C {
    private val _elementList = mutableListOf<Element>()

    val elementList: List<Element>
         get() = _elementList
}
```

### 选择好的名称

类的名称通常是名词或名词短语，解释该类“是什么”：`List`、`PersonReader`。

方法的名称通常是动词或动词短语，说明该方法“做什么”：`close`、`readPersons`。名称还应表明该方法是修改对象还是返回一个新对象。例如，`sort` 是对集合进行原地排序，而 `sorted` 则是返回集合的一个排序副本。

名称应明确实体的目的，因此最好避免在名称中使用无意义的词语（如 `Manager`、`Wrapper`）。

在声明名称中使用缩写时，请遵循以下规则：

*   对于两个字母的缩写，两个字母都使用大写。例如，`IOStream`。
*   对于超过两个字母的缩写，只将第一个字母大写。例如，`XmlFormatter` 或 `HttpInputStream`。

## 格式化

### 缩进

使用四个空格进行缩进。不要使用制表符。

对于花括号，将开括号放在构造开始行的末尾，将闭括号放在单独一行并与开构造水平对齐。

```kotlin
if (elements != null) {
    for (element in elements) {
        // ...
    }
}
```

> 在 Kotlin 中，分号是可选的，因此换行符具有重要意义。语言设计假定采用 Java 风格的花括号，如果尝试使用不同的格式风格，可能会遇到意想不到的行为。
>
{style="note"}

### 水平空格

*   在二元运算符周围放置空格（`a + b`）。例外：不要在“范围到”运算符（`0..i`）周围放置空格。
*   不带一元运算符周围放置空格（`a++`）。
*   在控制流关键字（`if`、`when`、`for` 和 `while`）和相应的开括号之间放置空格。
*   在主构造函数声明、方法声明或方法调用中的开括号前不要放置空格。

```kotlin
class A(val x: Int)

fun foo(x: Int) { ... }

fun bar() {
    foo(1)
}
```

*   绝不要在 `(`, `[` 之后或 `]`, `)` 之前放置空格。
*   绝不要在 `.` 或 `?.` 周围放置空格：`foo.bar().filter { it > 2 }.joinToString()`，`foo?.bar()`。
*   在 `//` 后放置一个空格：`// This is a comment`。
*   不要在用于指定类型参数的尖括号周围放置空格：`class Map<K, V> { ... }`。
*   不要在 `::` 周围放置空格：`Foo::class`，`String::length`。
*   在用于标记可空类型的 `?` 之前不要放置空格：`String?`。

作为一般规则，避免任何形式的水平对齐。将标识符重命名为不同长度的名称不应影响声明或任何用法的格式。

### 冒号

在以下情况下，在 `:` 前放置一个空格：

*   当它用于分隔类型和超类型时。
*   当委托给超类构造函数或同一类的不同构造函数时。
*   在 `object` 关键字之后。

当 `:` 分隔声明及其类型时，不要在其前面放置空格。

始终在 `:` 后面放置一个空格。

```kotlin
abstract class Foo<out T : Any> : IFoo {
    abstract fun foo(a: Int): T
}

class FooImpl : Foo() {
    constructor(x: String) : this(x) { /*...*/ }
    
    val x = object : IFoo { /*...*/ } 
} 
```

### 类头

具有少量主构造函数参数的类可以写在一行中：

```kotlin
class Person(id: Int, name: String)
```

具有较长类头的类应格式化为每个主构造函数参数独占一行并带缩进。另外，闭括号应在新的一行。如果使用继承，超类构造函数调用或已实现接口列表应位于与括号相同的行：

```kotlin
class Person(
    id: Int,
    name: String,
    surname: String
) : Human(id, name) { /*...*/ }
```

对于多个接口，超类构造函数调用应首先出现，然后每个接口应位于不同的行：

```kotlin
class Person(
    id: Int,
    name: String,
    surname: String
) : Human(id, name),
    KotlinMaker { /*...*/ }
```

对于具有长超类型列表的类，在冒号后换行，并水平对齐所有超类型名称：

```kotlin
class MyFavouriteVeryLongClassHolder :
    MyLongHolder<MyFavouriteVeryLongClass>(),
    SomeOtherInterface,
    AndAnotherOne {

    fun foo() { /*...*/ }
}
```

当类头很长时，为了清楚地分隔类头和类体，可以在类头后放置一个空行（如上例所示），或者将开花括号放在单独一行：

```kotlin
class MyFavouriteVeryLongClassHolder :
    MyLongHolder<MyFavouriteVeryLongClass>(),
    SomeOtherInterface,
    AndAnotherOne 
{
    fun foo() { /*...*/ }
}
```

构造函数参数使用常规缩进（四个空格）。这确保了在主构造函数中声明的属性与在类体中声明的属性具有相同的缩进。

### 修饰符顺序

如果一个声明有多个修饰符，请始终按照以下顺序排列：

```kotlin
public / protected / private / internal
expect / actual
final / open / abstract / sealed / const
external
override
lateinit
tailrec
vararg
suspend
inner
enum / annotation / fun // as a modifier in `fun interface` 
companion
inline / value
infix
operator
data
```

将所有注解放在修饰符之前：

```kotlin
@Named("Foo")
private val foo: Foo
```

除非你在开发库，否则省略冗余修饰符（例如 `public`）。

### 注解

将注解放置在它们所附加的声明之前的单独行上，并保持相同的缩进：

```kotlin
@Target(AnnotationTarget.PROPERTY)
annotation class JsonExclude
```

不带参数的注解可以放在同一行：

```kotlin
@JsonExclude @JvmField
var x: String
```

不带参数的单个注解可以放在相应声明的同一行：

```kotlin
@Test fun foo() { /*...*/ }
```

### 文件注解

文件注解放在文件注释（如果有）之后，`package` 语句之前，并与 `package` 之间用一个空行隔开（以强调它们是针对文件而非包）。

```kotlin
/** License, copyright and whatever */
@file:JvmName("FooBar")

package foo.bar
```

### 函数

如果函数签名不适合单行，请使用以下语法：

```kotlin
fun longMethodName(
    argument: ArgumentType = defaultValue,
    argument2: AnotherArgumentType,
): ReturnType {
    // body
}
```

函数参数使用常规缩进（四个空格）。这有助于确保与构造函数参数的一致性。

对于函数体只包含单个表达式的函数，优先使用表达式体。

```kotlin
fun foo(): Int {     // bad
    return 1 
}

fun foo() = 1        // good
```

### 表达式体

如果函数的表达式体第一行不适合与声明在同一行，将 `=` 号放在第一行，并将表达式体缩进四个空格。

```kotlin
fun f(x: String, y: String, z: String) =
    veryLongFunctionCallWithManyWords(andLongParametersToo(), x, y, z)
```

### 属性

对于非常简单的只读属性，考虑使用单行格式：

```kotlin
val isEmpty: Boolean get() = size == 0
```

对于更复杂的属性，始终将 `get` 和 `set` 关键字放在单独的行上：

```kotlin
val foo: String
    get() { /*...*/ }
```

对于带有初始化器的属性，如果初始化器很长，在 `=` 号后添加换行符，并将初始化器缩进四个空格：

```kotlin
private val defaultCharset: Charset? =
    EncodingRegistry.getInstance().getDefaultCharsetForPropertiesFiles(file)
```

### 控制流语句

如果 `if` 或 `when` 语句的条件是多行的，请始终在语句体周围使用花括号。将条件后续的每一行相对语句起始位置缩进四个空格。将条件的闭括号与开花括号放在单独一行：

```kotlin
if (!component.isSyncing &&
    !hasAnyKotlinRuntimeInScope(module)
) {
    return createKotlinNotConfiguredPanel(module)
}
```

这有助于对齐条件和语句体。

将 `else`、`catch`、`finally` 关键字以及 `do-while` 循环的 `while` 关键字放在前一个花括号的同一行：

```kotlin
if (condition) {
    // body
} else {
    // else part
}

try {
    // body
} finally {
    // cleanup
}
```

在 `when` 语句中，如果一个分支超过一行，考虑用空行将其与相邻的 case 块隔开：

```kotlin
private fun parsePropertyValue(propName: String, token: Token) {
    when (token) {
        is Token.ValueToken ->
            callback.visitValue(propName, token.value)

        Token.LBRACE -> { // ...
        }
    }
}
```

短分支放在与条件相同的行上，不带花括号。

```kotlin
when (foo) {
    true -> bar() // good
    false -> { baz() } // bad
}
```

### 方法调用

在长参数列表中，在开括号后换行。参数缩进四个空格。将多个密切相关的参数放在同一行。

```kotlin
drawSquare(
    x = 10, y = 10,
    width = 100, height = 100,
    fill = true
)
```

在分隔参数名和值的 `=` 号周围放置空格。

### 链式调用换行

链式调用换行时，将 `.` 字符或 `?.` 运算符放在下一行，并缩进一个层级：

```kotlin
val anchor = owner
    ?.firstChild!!
    .siblings(forward = true)
    .dropWhile { it is PsiComment || it is PsiWhiteSpace }
```

链中的第一个调用通常应该在其之前有一个换行符，但如果代码那样更合理，也可以省略。

### Lambda 表达式

在 Lambda 表达式中，花括号周围以及分隔参数和函数体的箭头周围应使用空格。如果一个调用只接受一个 Lambda，尽可能将其作为尾随 Lambda 传出括号。

```kotlin
list.filter { it > 10 }
```

如果为 Lambda 分配标签，不要在标签和开花括号之间放置空格：

```kotlin
fun foo() {
    ints.forEach lit@{
        // ...
    }
}
```

在多行 Lambda 中声明参数名时，将参数名放在第一行，后跟箭头和换行符：

```kotlin
appendCommaSeparated(properties) { prop ->
    val propertyValue = prop.get(obj)  // ...
}
```

如果参数列表太长无法在一行中放下，将箭头放在单独一行：

```kotlin
foo {
   context: Context,
   environment: Env
   ->
   context.configureEnv(environment)
}
```

### 尾随逗号

尾随逗号是系列元素中最后一个项目后的逗号符号：

```kotlin
class Person(
    val firstName: String,
    val lastName: String,
    val age: Int, // trailing comma
)
```

使用尾随逗号有几个好处：

*   它使版本控制差异更清晰——因为所有的焦点都集中在更改的值上。
*   它使得添加和重新排序元素变得容易——如果你操作元素，无需添加或删除逗号。
*   它简化了代码生成，例如，对于对象初始化器。最后一个元素也可以有逗号。

尾随逗号完全是可选的——你的代码没有它们也能正常工作。Kotlin 样式指南鼓励在声明点使用尾随逗号，而对于调用点则由你自行决定。

要在 IntelliJ IDEA 格式化程序中启用尾随逗号，请转到 **Settings/Preferences | Editor | Code Style | Kotlin**，打开 **Other** 选项卡并选择 **Use trailing comma** 选项。

#### 枚举 {initial-collapse-state="collapsed" collapsible="true"}

```kotlin
enum class Direction {
    NORTH,
    SOUTH,
    WEST,
    EAST, // trailing comma
}
```

#### 值参数 {initial-collapse-state="collapsed" collapsible="true"}

```kotlin
fun shift(x: Int, y: Int) { /*...*/ }
shift(
    25,
    20, // trailing comma
)
val colors = listOf(
    "red",
    "green",
    "blue", // trailing comma
)
```

#### 类属性和参数 {initial-collapse-state="collapsed" collapsible="true"}

```kotlin
class Customer(
    val name: String,
    val lastName: String, // trailing comma
)
class Customer(
    val name: String,
    lastName: String, // trailing comma
)
```

#### 函数值参数 {initial-collapse-state="collapsed" collapsible="true"}

```kotlin
fun powerOf(
    number: Int, 
    exponent: Int, // trailing comma
) { /*...*/ }
constructor(
    x: Comparable<Number>,
    y: Iterable<Number>, // trailing comma
) {}
fun print(
    vararg quantity: Int,
    description: String, // trailing comma
) {}
```

#### 带可选类型（包括设置器）的参数 {initial-collapse-state="collapsed" collapsible="true"}

```kotlin
val sum: (Int, Int, Int) -> Int = fun(
    x,
    y,
    z, // trailing comma
): Int {
    return x + y + x
}
println(sum(8, 8, 8))
```

#### 索引后缀 {initial-collapse-state="collapsed" collapsible="true"}

```kotlin
class Surface {
    operator fun get(x: Int, y: Int) = 2 * x + 4 * y - 10
}
fun getZValue(mySurface: Surface, xValue: Int, yValue: Int) =
    mySurface[
        xValue,
        yValue, // trailing comma
    ]
```

#### Lambda 表达式中的参数 {initial-collapse-state="collapsed" collapsible="true"}

```kotlin
fun main() {
    val x = {
            x: Comparable<Number>,
            y: Iterable<Number>, // trailing comma
        ->
        println("1")
    }
    println(x)
}
```

#### when 条目 {initial-collapse-state="collapsed" collapsible="true"}

```kotlin
fun isReferenceApplicable(myReference: KClass<*>) = when (myReference) {
    Comparable::class,
    Iterable::class,
    String::class, // trailing comma
        -> true
    else -> false
}
```

#### 集合字面量（在注解中） {initial-collapse-state="collapsed" collapsible="true"}

```kotlin
annotation class ApplicableFor(val services: Array<String>)
@ApplicableFor([
    "serializer",
    "balancer",
    "database",
    "inMemoryCache", // trailing comma
])
fun run() {}
```

#### 类型参数 {initial-collapse-state="collapsed" collapsible="true"}

```kotlin
fun <T1, T2> foo() {}
fun main() {
    foo<
            Comparable<Number>,
            Iterable<Number>, // trailing comma
            >()
}
```

#### 类型参数 {initial-collapse-state="collapsed" collapsible="true"}

```kotlin
class MyMap<
        MyKey,
        MyValue, // trailing comma
        > {}
```

#### 解构声明 {initial-collapse-state="collapsed" collapsible="true"}

```kotlin
data class Car(val manufacturer: String, val model: String, val year: Int)
val myCar = Car("Tesla", "Y", 2019)
val (
    manufacturer,
    model,
    year, // trailing comma
) = myCar
val cars = listOf<Car>()
fun printMeanValue() {
    var meanValue: Int = 0
    for ((
        _,
        _,
        year, // trailing comma
    ) in cars) {
        meanValue += year
    }
    println(meanValue/cars.size)
}
printMeanValue()
```

## 文档注释

对于较长的文档注释，将开头的 `/**` 放在单独一行，并以星号开始后续的每一行：

```kotlin
/**
 * This is a documentation comment
 * on multiple lines.
 */
```

短注释可以放在单行：

```kotlin
/** This is a short documentation comment. */
```

通常，避免使用 `@param` 和 `@return` 标签。相反，将参数和返回值的描述直接融入文档注释中，并在提到参数的地方添加链接。仅当需要冗长的描述且不适合主文本流程时才使用 `@param` 和 `@return`。

```kotlin
// 避免这样做：

/**
 * Returns the absolute value of the given number.
 * @param number The number to return the absolute value for.
 * @return The absolute value.
 */
fun abs(number: Int): Int { /*...*/ }

// 推荐这样做：

/**
 * Returns the absolute value of the given [number].
 */
fun abs(number: Int): Int { /*...*/ }
```

## 避免冗余结构

通常，如果 Kotlin 中的某个语法结构是可选的，并且被 IDE 标记为冗余，则应在代码中省略它。不要仅仅为了“清晰”而在代码中留下不必要的语法元素。

### Unit 返回类型

如果一个函数返回 Unit，则应省略返回类型：

```kotlin
fun foo() { // ": Unit" is omitted here

}
```

### 分号

尽可能省略分号。

### 字符串模板

将简单变量插入字符串模板时不要使用花括号。仅在表达式较长时使用花括号。

```kotlin
println("$name has ${children.size} children")
```

## 语言特性的惯用用法

### 不变性

优先使用不可变数据而不是可变数据。如果局部变量和属性在初始化后不被修改，请始终将其声明为 `val` 而非 `var`。

始终使用不可变集合接口（`Collection`、`List`、`Set`、`Map`）来声明未被修改的集合。使用工厂函数创建集合实例时，尽可能使用返回不可变集合类型的函数：

```kotlin
// Bad: use of a mutable collection type for value which will not be mutated
fun validateValue(actualValue: String, allowedValues: HashSet<String>) { ... }

// Good: immutable collection type used instead
fun validateValue(actualValue: String, allowedValues: Set<String>) { ... }

// Bad: arrayListOf() returns ArrayList<T>, which is a mutable collection type
val allowedValues = arrayListOf("a", "b", "c")

// Good: listOf() returns List<T>
val allowedValues = listOf("a", "b", "c")
```

### 默认参数值

优先声明带默认参数值的函数，而非声明重载函数。

```kotlin
// Bad
fun foo() = foo("a")
fun foo(a: String) { /*...*/ }

// Good
fun foo(a: String = "a") { /*...*/ }
```

### 类型别名

如果你有一个函数类型或一个带类型参数的类型，并且它在代码库中多次使用，优先为其定义类型别名：

```kotlin
typealias MouseClickHandler = (Any, MouseEvent) -> Unit
typealias PersonIndex = Map<String, Person>
```
如果你使用 private 或 internal 类型别名来避免名称冲突，请优先使用 [Packages and Imports](packages.md) 中提到的 `import ... as ...`。

### Lambda 参数

在短且不嵌套的 Lambda 表达式中，建议使用 `it` 约定而不是显式声明参数。在带参数的嵌套 Lambda 表达式中，始终显式声明参数。

### Lambda 中的返回

避免在 Lambda 中使用多个带标签的返回。考虑重构 Lambda，使其只有一个退出点。如果无法做到或不够清晰，考虑将 Lambda 转换为匿名函数。

不要在 Lambda 中的最后一条语句使用带标签的返回。

### 具名参数

当方法接受多个相同基本类型参数或 `Boolean` 类型参数时，使用具名参数语法，除非所有参数的含义从上下文中都绝对清晰。

```kotlin
drawSquare(x = 10, y = 10, width = 100, height = 100, fill = true)
```

### 条件语句

优先使用 `try`、`if` 和 `when` 的表达式形式。

```kotlin
return if (x) foo() else bar()
```

```kotlin
return when(x) {
    0 -> "zero"
    else -> "nonzero"
}
```

上述写法优于：

```kotlin
if (x)
    return foo()
else
    return bar()
```

```kotlin
when(x) {
    0 -> return "zero"
    else -> return "nonzero"
}    
```

### if 与 when

对于二元条件，优先使用 `if` 而非 `when`。例如，使用 `if` 的以下语法：

```kotlin
if (x == null) ... else ...
```

而不是 `when` 的以下语法：

```kotlin
when (x) {
    null -> // ...
    else -> // ...
}
```

如果有三个或更多选项，优先使用 `when`。

### when 表达式中的守卫条件

在 `when` 表达式或语句中组合多个布尔表达式并带有[守卫条件](control-flow.md#guard-conditions-in-when-expressions)时，使用括号：

```kotlin
when (status) {
    is Status.Ok if (status.info.isEmpty() || status.info.id == null) -> "no information"
}
```

而不是：

```kotlin
when (status) {
    is Status.Ok if status.info.isEmpty() || status.info.id == null -> "no information"
}
```

### 条件中的可空布尔值

如果你需要在条件语句中使用可空的 `Boolean`，请使用 `if (value == true)` 或 `if (value == false)` 检查。

### 循环

优先使用高阶函数（如 `filter`、`map` 等）而不是循环。例外：`forEach`（除非 `forEach` 的接收者可空，或者 `forEach` 作为更长调用链的一部分使用，否则优先使用常规的 `for` 循环）。

在选择使用多个高阶函数的复杂表达式和循环之间时，请了解每种情况下执行操作的成本，并牢记性能考量。

### 范围循环

使用 `..<` 运算符遍历开放范围：

```kotlin
for (i in 0..n - 1) { /*...*/ }  // bad
for (i in 0..<n) { /*...*/ }  // good
```

### 字符串

优先使用字符串模板而不是字符串拼接。

优先使用多行字符串，而不是将 `
` 转义序列嵌入到常规字符串字面量中。

为了在多行字符串中保持缩进，当结果字符串不需要任何内部缩进时使用 `trimIndent`，当需要内部缩进时使用 `trimMargin`：

```kotlin
fun main() {
//sampleStart
   println("""
    Not
    trimmed
    text
    """
   )

   println("""
    Trimmed
    text
    """.trimIndent()
   )

   println()

   val a = """Trimmed to margin text:
          |if(a > 1) {
          |    return a
          |}""".trimMargin()

   println(a)
//sampleEnd
}
```
{kotlin-runnable="true"}

了解 [Java 和 Kotlin 多行字符串](java-to-kotlin-idioms-strings.md#use-multiline-strings)之间的区别。

### 函数与属性

在某些情况下，不带参数的函数可能与只读属性互换。尽管语义相似，但在何时优先选择哪一个方面存在一些样式约定。

当底层算法符合以下条件时，优先使用属性而非函数：

*   不抛出异常。
*   计算成本低（或在首次运行时已缓存）。
*   如果对象状态未改变，多次调用返回相同结果。

### 扩展函数

大量使用扩展函数。每当你的函数主要作用于某个对象时，考虑将其作为接受该对象作为接收者的扩展函数。为了最大限度地减少 API 污染，尽可能限制扩展函数的可见性。必要时，使用局部扩展函数、成员扩展函数或具有私有可见性的顶层扩展函数。

### 中缀函数

仅当函数作用于两个扮演相似角色的对象时，才将其声明为 `infix`。好的例子：`and`、`to`、`zip`。不好的例子：`add`。

如果方法修改接收者对象，则不要将其声明为 `infix`。

### 工厂函数

如果你为一个类声明工厂函数，避免使其与类本身同名。优先使用一个独特的名称，清楚地说明工厂函数的行为为何特殊。只有在确实没有特殊语义的情况下，你才能使用与类相同的名称。

```kotlin
class Point(val x: Double, val y: Double) {
    companion object {
        fun fromPolar(angle: Double, radius: Double) = Point(...)
    }
}
```

如果你有一个对象，它有多个重载构造函数，这些构造函数不调用不同的超类构造函数，并且无法简化为带默认参数值的单个构造函数，那么优先使用工厂函数替换这些重载构造函数。

### 平台类型

返回平台类型表达式的公共函数/方法必须显式声明其 Kotlin 类型：

```kotlin
fun apiCall(): String = MyJavaApi.getProperty("name")
```

任何用平台类型表达式初始化的属性（包级或类级）都必须显式声明其 Kotlin 类型：

```kotlin
class Person {
    val name: String = MyJavaApi.getProperty("name")
}
```

用平台类型表达式初始化的局部值可以有或没有类型声明：

```kotlin
fun main() {
    val name = MyJavaApi.getProperty("name")
    println(name)
}
```

### 作用域函数 apply/with/run/also/let

Kotlin 提供了一组函数，用于在给定对象的上下文中执行代码块：`let`、`run`、`with`、`apply` 和 `also`。有关为你的用例选择正确作用域函数的指导，请参阅[作用域函数](scope-functions.md)。

## 库的编码规范

编写库时，建议遵循一套额外的规则以确保 API 稳定性：

*   始终显式指定成员可见性（以避免意外地将声明暴露为公共 API）。
*   始终显式指定函数返回类型和属性类型（以避免在实现更改时意外更改返回类型）。
*   为所有公共成员提供 [KDoc](kotlin-doc.md) 注释，但不需要任何新文档的覆盖除外（以支持为库生成文档）。

在[库作者指南](api-guidelines-introduction.md)中了解更多关于编写库 API 时的最佳实践和考虑事项。