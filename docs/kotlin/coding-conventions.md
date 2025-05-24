---
title: 编码规范
---
对于任何编程语言来说，通用且易于遵循的编码规范至关重要。
在这里，我们为使用 Kotlin 的项目提供关于代码风格和代码组织的指南。

## 在 IDE 中配置风格

Kotlin 最流行的两个 IDE - [IntelliJ IDEA](https://www.jetbrains.com/idea/) 和 [Android Studio](https://developer.android.com/studio/)
都为代码风格提供了强大的支持。你可以配置它们，使其自动按照给定的代码风格来格式化你的代码。

### 应用风格指南

1.  前往 **Settings/Preferences | Editor | Code Style | Kotlin**。
2.  点击 **Set from...**。
3.  选择 **Kotlin style guide**。

### 验证你的代码是否遵循风格指南

1.  前往 **Settings/Preferences | Editor | Inspections | General**。
2.  启用 **Incorrect formatting** 检查。
    默认情况下，其他检查会验证风格指南中描述的其他问题（例如，命名规范）。

## 源代码组织

### 目录结构

在纯 Kotlin 项目中，推荐的目录结构遵循包结构，并省略公共的根包。例如，如果项目中的所有代码都在 `org.example.kotlin` 包及其子包中，那么带有 `org.example.kotlin` 包的文件应该直接放在源根目录下，而 `org.example.kotlin.network.socket` 中的文件应该放在源根目录的 `network/socket` 子目录中。

:::note
在 JVM 上：在 Kotlin 与 Java 一起使用的项目中，Kotlin 源文件应与 Java 源文件位于相同的源根目录下，并遵循相同的目录结构：每个文件应存储在与每个包声明对应的目录中。

:::

### 源文件名

如果一个 Kotlin 文件包含一个单独的类或接口（可能带有相关的顶层声明），它的名称应该与该类的名称相同，并附加 `.kt` 扩展名。这适用于所有类型的类和接口。
如果一个文件包含多个类，或者只有顶层声明，那么选择一个描述文件内容的名字，并相应地命名该文件。
使用[大驼峰命名法](https://en.wikipedia.org/wiki/Camel_case)，其中每个单词的首字母大写。
例如，`ProcessDeclarations.kt`。

文件名应该描述文件中代码的作用。因此，你应该避免在文件名中使用无意义的词，例如 `Util`。

#### 多平台项目

在多平台项目中，平台特定源集 (platform-specific source set) 中具有顶层声明的文件应该具有与源集名称关联的后缀。例如：

*   **jvm**Main/kotlin/Platform.**jvm**.kt
*   **android**Main/kotlin/Platform.**android**.kt
*   **ios**Main/kotlin/Platform.**ios**.kt

至于公共源集 (common source set)，具有顶层声明的文件不应带有后缀。例如，`commonMain/kotlin/Platform.kt`。

##### 技术细节

我们建议在多平台项目中遵循这种文件命名方案，因为 JVM 存在局限性：它不允许顶层成员（函数、属性）。

为了解决这个问题，Kotlin JVM 编译器创建了包装类（所谓的“文件外观” (file facades)），其中包含顶层成员声明。文件外观具有从文件名派生的内部名称。

反过来，JVM 不允许具有相同完全限定名 (fully qualified name, FQN) 的多个类。这可能会导致 Kotlin 项目无法编译为 JVM 的情况：

```none
root
|- commonMain/kotlin/myPackage/Platform.kt // contains 'fun count() { }'
|- jvmMain/kotlin/myPackage/Platform.kt // contains 'fun multiply() { }'
```

这里两个 `Platform.kt` 文件都在同一个包中，因此 Kotlin JVM 编译器生成了两个文件外观，它们的 FQN 都是 `myPackage.PlatformKt`。这会产生“重复的 JVM 类” (Duplicate JVM classes) 错误。

避免这种情况的最简单方法是根据上述指南重命名其中一个文件。这种命名方案有助于避免冲突，同时保持代码的可读性。

:::note
在两种情况下，这些建议可能看起来是多余的，但我们仍然建议遵循它们：

*   非 JVM 平台不存在复制文件外观的问题。但是，这种命名方案可以帮助你保持文件命名的一致性。
*   在 JVM 上，如果源文件没有顶层声明，则不会生成文件外观，你也不会遇到命名冲突。

    但是，这种命名方案可以帮助你避免简单重构或添加操作可能包含顶层函数并导致相同的“重复的 JVM 类”错误的情况。

### 源文件组织

鼓励在同一个 Kotlin 源文件中放置多个声明（类、顶层函数或属性），只要这些声明在语义上彼此密切相关，并且文件大小保持合理（不超过几百行）。

特别是，当为一个类的所有客户端都相关的类定义扩展函数时，将它们与该类本身放在同一个文件中。当定义仅对特定客户端有意义的扩展函数时，将它们放在该客户端的代码旁边。避免创建仅用于保存某个类的所有扩展的文件。

### 类布局

类的内容应按以下顺序排列：

1.  属性声明和初始化块
2.  二级构造函数 (Secondary constructors)
3.  方法声明
4.  伴生对象 (Companion object)

不要按字母顺序或可见性对方法声明进行排序，也不要将常规方法与扩展方法分开。相反，将相关的东西放在一起，这样从上到下阅读该类的人可以了解正在发生的事情的逻辑。选择一个顺序（先是更高级的内容，反之亦然）并坚持下去。

将嵌套类放在使用这些类的代码旁边。如果这些类旨在外部使用，并且在类内部没有引用，请将它们放在最后，在伴生对象之后。

### 接口实现布局

实现接口时，使实现成员的顺序与接口成员的顺序相同（如果需要，可以穿插用于实现的附加私有方法）。

### 重载布局

始终将重载放在类中彼此相邻的位置。

## 命名规则

Kotlin 中的包和类命名规则非常简单：

*   包的名称始终是小写的，并且不使用下划线 (`org.example.project`)。通常不鼓励使用多词名称，但如果确实需要使用多个单词，则可以简单地将它们连接在一起，或者使用驼峰式命名 (`org.example.myProject`)。

*   类和对象的名称使用大驼峰式命名：

```kotlin
open class DeclarationProcessor { /*...*/ }

object EmptyDeclarationProcessor : DeclarationProcessor() { /*...*/ }
```

### 函数名

函数、属性和局部变量的名称以小写字母开头，并使用驼峰式命名，不带下划线：

```kotlin
fun processDeclarations() { /*...*/ }
var declarationCount = 1
```

例外：用于创建类实例的工厂函数可以具有与抽象返回类型相同的名称：

```kotlin
interface Foo { /*...*/ }

class FooImpl : Foo { /*...*/ }

fun Foo(): Foo { return FooImpl() }
```

### 测试方法的名称

在测试中（**仅**在测试中），你可以使用用反引号括起来的带有空格的方法名称。
请注意，只有 API level 30 及以上的 Android 运行时才支持此类方法名称。测试代码中也允许使用方法名称中的下划线。

```kotlin
class MyTestCase {
     @Test fun `ensure everything works`() { /*...*/ }

     @Test fun ensureEverythingWorks_onAndroid() { /*...*/ }
}
```

### 属性名称

常量（用 `const` 标记的属性，或者没有自定义 `get` 函数的顶层或对象 `val` 属性，这些属性包含深度不可变数据）的名称应使用全大写、下划线分隔的名称，遵循（[尖叫蛇形命名法](https://en.wikipedia.org/wiki/Snake_case)）约定：

```kotlin
const val MAX_COUNT = 8
val USER_NAME_FIELD = "UserName"
```

包含具有行为或可变数据的对象的顶层或对象属性的名称应使用驼峰式命名：

```kotlin
val mutableCollection: MutableSet<String> = HashSet()
```

保存对单例对象的引用的属性的名称可以使用与 `object` 声明相同的命名风格：

```kotlin
val PersonComparator: Comparator<Person> = /*...*/
```

对于枚举常量，可以使用全大写、下划线分隔的（[尖叫蛇形命名法](https://en.wikipedia.org/wiki/Snake_case)）名称 (`enum class Color { RED, GREEN }`) 或大驼峰式命名，具体取决于用法。

### 后端属性的名称

如果一个类有两个在概念上相同的属性，但一个是公共 API 的一部分，而另一个是实现细节，则使用下划线作为私有属性名称的前缀：

```kotlin
class C {
    private val _elementList = mutableListOf<Element>()

    val elementList: List<Element>
         get() = _elementList
}
```

### 选择好名称

类的名称通常是一个名词或名词短语，解释该类_是什么_：`List`、`PersonReader`。

方法的名称通常是一个动词或动词短语，说明该方法_做什么_：`close`、`readPersons`。
如果该方法正在改变对象或返回一个新对象，则该名称也应表明这一点。例如，`sort` 是对集合进行原地排序，而 `sorted` 是返回该集合的排序副本。

名称应清楚地表明实体的用途，因此最好避免在名称中使用无意义的单词（`Manager`、`Wrapper`）。

当使用首字母缩略词作为声明名称的一部分时，请遵循以下规则：

*   对于两个字母的首字母缩略词，两个字母都使用大写。例如，`IOStream`。
*   对于超过两个字母的首字母缩略词，仅将首字母大写。例如，`XmlFormatter` 或 `HttpInputStream`。

## 格式化

### 缩进

使用四个空格进行缩进。不要使用制表符。

对于花括号，将左花括号放在构造开始行的末尾，并将右花括号放在单独的一行上，该行与起始构造水平对齐。

```kotlin
if (elements != null) {
    for (element in elements) {
        // ...
    }
}
```

在 Kotlin 中，分号是可选的，因此换行符很重要。该语言的设计假定为 Java 风格的花括号，如果你尝试使用不同的格式化风格，你可能会遇到令人惊讶的行为。

:::

### 水平空格

*   在二元运算符周围放置空格 (`a + b`)。例外：不要在“范围到” (range to) 运算符周围放置空格 (`0..i`)。
*   不要在一元运算符周围放置空格 (`a++`)。
*   在控制流关键字（`if`、`when`、`for` 和 `while`）和相应的左括号之间放置空格。
*   不要在主构造函数声明、方法声明或方法调用中的左括号之前放置空格。

```kotlin
class A(val x: Int)

fun foo(x: Int) { ... }

fun bar() {
    foo(1)
}
```

*   永远不要在 `(`、`[` 之后或 `]`、`)` 之前放置空格。
*   永远不要在 `.` 或 `?.` 周围放置空格：`foo.bar().filter { it > 2 }.joinToString()`、`foo?.bar()`。
*   在 `//` 之后放置一个空格：`// This is a comment`。
*   不要在用于指定类型参数的尖括号周围放置空格：`class Map<K, V> { ... }`。
*   不要在 `::` 周围放置空格：`Foo::class`、`String::length`。
*   不要在使用 `?` 标记可空类型之前放置空格：`String?`。

作为一般规则，避免任何形式的水平对齐。将标识符重命名为具有不同长度的名称不应影响声明或任何用法的格式。

### 冒号

在以下情况下，在 `:` 前面放置一个空格：

*   当它用于分隔类型和超类型时。
*   当委托给超类构造函数或同一类的不同构造函数时。
*   在 `object` 关键字之后。

当 `:` 分隔声明及其类型时，不要在 `:` 前面放置空格。

始终在 `:` 之后放置一个空格。

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

具有较长类头的类应进行格式化，以使每个主构造函数参数都位于单独的一行中，并带有缩进。
此外，右括号应位于新的一行上。如果使用继承，则超类构造函数调用或已实现接口的列表应与括号位于同一行：

```kotlin
class Person(
    id: Int,
    name: String,
    surname: String
) : Human(id, name) { /*...*/ }
```

对于多个接口，超类构造函数调用应首先位于，然后每个接口应位于不同的行中：

```kotlin
class Person(
    id: Int,
    name: String,
    surname: String
) : Human(id, name),
    KotlinMaker { /*...*/ }
```

对于具有较长超类型列表的类，请在冒号后添加换行符，并水平对齐所有超类型名称：

```kotlin
class MyFavouriteVeryLongClassHolder :
    MyLongHolder<MyFavouriteVeryLongClass>(),
    SomeOtherInterface,
    AndAnotherOne {

    fun foo() { /*...*/ }
}
```

为了在类头较长时清楚地分隔类头和类体，请在类头后放置一个空行（如上例所示），或将左花括号放在单独的一行上：

```kotlin
class MyFavouriteVeryLongClassHolder :
    MyLongHolder<MyFavouriteVeryLongClass>(),
    SomeOtherInterface,
    AndAnotherOne
{
    fun foo() { /*...*/ }
}
```

对构造函数参数使用常规缩进（四个空格）。这可以确保在主构造函数中声明的属性与在类体中声明的属性具有相同的缩进。

### 修饰符顺序

如果声明具有多个修饰符，请始终按以下顺序放置它们：

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

除非你正在开发一个库，否则请省略冗余修饰符（例如，`public`）。

### 注解

将注解放在它们所附加的声明之前的单独行上，并使用相同的缩进：

```kotlin
@Target(AnnotationTarget.PROPERTY)
annotation class JsonExclude
```

没有参数的注解可以放在同一行上：

```kotlin
@JsonExclude @JvmField
var x: String
```

没有参数的单个注解可以放在与相应声明相同的行上：

```kotlin
@Test fun foo() { /*...*/ }
```

### 文件注解

文件注解放在文件注释（如果有）之后，`package` 语句之前，并用一个空行与 `package` 分隔（以强调它们针对文件而不是包的事实）。

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

对函数参数使用常规缩进（四个空格）。这有助于确保与构造函数参数的一致性。

对于函数体由单个表达式组成的函数，首选使用表达式体。

```kotlin
fun foo(): Int {     // 坏
    return 1
}

fun foo() = 1        // 好
```

### 表达式体

如果函数的表达式体的第一行与声明不在同一行上，请将 `=` 符号放在第一行，并将表达式体缩进四个空格。

```kotlin
fun f(x: String, y: String, z: String) =
    veryLongFunctionCallWithManyWords(andLongParametersToo(), x, y, z)
```

### 属性

对于非常简单的只读属性，请考虑单行格式：

```kotlin
val isEmpty: Boolean get() = size == 0
```

对于更复杂的属性，始终将 `get` 和 `set` 关键字放在单独的行上：

```kotlin
val foo: String
    get() { /*...*/ }
```

对于具有初始值设定项的属性，如果初始值设定项很长，请在 `=` 符号后添加换行符，并将初始值设定项缩进四个空格：

```kotlin
private val defaultCharset: Charset? =
    EncodingRegistry.getInstance().getDefaultCharsetForPropertiesFiles(file)
```

### 控制流语句

如果 `if` 或 `when` 语句的条件是多行的，请始终在语句体周围使用花括号。
相对于语句的开头，将条件的每个后续行缩进四个空格。
将条件的右括号与左花括号放在单独的一行上：

```kotlin
if (!component.isSyncing &&
    !hasAnyKotlinRuntimeInScope(module)
) {
    return createKotlinNotConfiguredPanel(module)
}
```

这有助于对齐条件和语句体。

将 `else`、`catch`、`finally` 关键字以及 `do-while` 循环的 `while` 关键字放在与前面的右花括号相同的行上：

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

在 `when` 语句中，如果一个分支超过一行，请考虑用一个空行将其与相邻的 case 块分隔开：

```kotlin
private fun parsePropertyValue(propName: String, token: Token) {
    when (token) {
        is Token.ValueToken `->`
            callback.visitValue(propName, token.value)

        Token.LBRACE `->` { // ...
        }
    }
}
```

将短分支与条件放在同一行上，不带花括号。

```kotlin
when (foo) {
    true `->` bar() // 好
    false `->` { baz() } // 坏
}
```

### 方法调用

在长参数列表中，在左括号后添加换行符。将参数缩进四个空格。
将多个密切相关的参数放在同一行上。

```kotlin
drawSquare(
    x = 10, y = 10,
    width = 100, height = 100,
    fill = true
)
```

在分隔参数名称和值的 `=` 符号周围放置空格。

### 包装链式调用

包装链式调用时，将 `.` 字符或 `?.` 运算符放在下一行，并带有单个缩进：

```kotlin
val anchor = owner
    ?.firstChild!!
    .siblings(forward = true)
    .dropWhile { it is PsiComment || it is PsiWhiteSpace }
```

链中的第一个调用通常应在其前面有一个换行符，但如果代码以这种方式更有意义，则可以省略它。

### Lambda 表达式

在 Lambda 表达式中，应在花括号周围以及分隔参数和主体的箭头周围使用空格。如果调用采用单个 Lambda 表达式，请尽可能在括号外传递它。

```kotlin
list.filter { it > 10 }
```

如果为 Lambda 表达式分配标签，请不要在标签和左花括号之间放置空格：

```kotlin
fun foo() {
    ints.forEach lit@{
        // ...
    }
}
```

在多行 Lambda 表达式中声明参数名称时，请将名称放在第一行，后跟箭头和换行符：

```kotlin
appendCommaSeparated(properties) { prop `->`
    val propertyValue = prop.get(obj)  // ...
}
```

如果参数列表太长而无法放在一行上，请将箭头放在单独的一行上：

```kotlin
foo {
   context: Context,
   environment: Env
   `->`
   context.configureEnv(environment)
}
```

### 尾随逗号

尾随逗号是元素系列中最后一个项目之后的逗号符号：

```kotlin
class Person(
    val firstName: String,
    val lastName: String,
    val age: Int, // 尾随逗号
)
```

使用尾随逗号有几个好处：

*   它使版本控制差异更清晰 - 因为所有焦点都集中在已更改的值上。
*   它使添加和重新排序元素变得容易 - 如果你操作元素，则无需添加或删除逗号。
*   它简化了代码生成，例如，对于对象初始值设定项。最后一个元素也可以有一个逗号。

尾随逗号完全是可选的 - 没有它们你的代码仍然可以工作。Kotlin 风格指南鼓励在声明站点使用尾随逗号，并将其留给你自行决定是否在调用站点使用。

要在 IntelliJ IDEA 格式化程序中启用尾随逗号，请转到 **Settings/Preferences | Editor | Code Style | Kotlin**，
打开 **Other** 选项卡，然后选择 **Use trailing comma** 选项。

#### 枚举

```kotlin
enum class Direction {
    NORTH,
    SOUTH,
    WEST,
    EAST, // 尾随逗号
}
```

#### 值参数

```kotlin
fun shift(x: Int, y: Int) { /*...*/ }
shift(
    25,
    20, // 尾随逗号
)
val colors = listOf(
    "red",
    "green",
    "blue", // 尾随逗号
)
```

#### 类属性和参数

```kotlin
class Customer(
    val name: String,
    val lastName: String, // 尾随逗号
)
class Customer(
    val name: String,
    lastName: String, // 尾随逗号
)
```

#### 函数值参数

```kotlin
fun powerOf(
    number: Int,
    exponent: Int, // 尾随逗号
) { /*...*/ }
constructor(
    x: Comparable<Number>,
    y: Iterable<Number>, // 尾随逗号
) {}
fun print(
    vararg quantity: Int,
    description: String, // 尾随逗号
) {}
```

#### 具有可选类型的参数（包括 setter）

```kotlin
val sum: (Int, Int, Int) `->` Int = fun(
    x,
    y,
    z, // 尾随逗号
): Int {
    return x + y + x
}
println(sum(8, 8, 8))
```

#### 索引后缀

```kotlin
class Surface {
    operator fun get(x: Int, y: Int) = 2 * x + 4 * y - 10
}
fun getZValue(mySurface: Surface, xValue: Int, yValue: Int) =
    mySurface[
        xValue,
        yValue, // 尾随逗号
    ]
```

#### Lambda 表达式中的参数

```kotlin
fun main() {
    val x = {
            x: Comparable<Number>,
            y: Iterable<Number>, // 尾随逗号
        `->`
        println("1")
    }
    println(x)
}
```

#### when 条目

```kotlin
fun isReferenceApplicable(myReference: KClass<*>) = when (myReference) {
    Comparable::class,
    Iterable::class,
    String::class, // 尾随逗号
        `->` true
    else `->` false
}
```

#### 集合字面量（在注解中）

```kotlin
annotation class ApplicableFor(val services: Array<String>)
@ApplicableFor([
    "serializer",
    "balancer",
    "database",
    "inMemoryCache", // 尾随逗号
])
fun run() {}
```

#### 类型参数

```kotlin
fun <T1, T2> foo() {}
fun main() {
    foo<
            Comparable<Number>,
            Iterable<Number>, // 尾随逗号
            >()
}
```

#### 类型形参

```kotlin
class MyMap<
        MyKey,
        MyValue, // 尾随逗号
        > {}
```

#### 解构声明

```kotlin
data class Car(val manufacturer: String, val model: String, val year: Int)
val myCar = Car("Tesla", "Y", 2019)
val (
    manufacturer,
    model,
    year, // 尾随逗号
) = myCar
val cars = listOf<Car>()
fun printMeanValue() {
    var meanValue: Int = 0
    for ((
        _,
        _,
        year, // 尾随逗号
    ) in cars) {
        meanValue += year
    }
    println(meanValue/cars.size)
}
printMeanValue()
```

## 文档注释

对于较长的文档注释，将开头的 `/**` 放在单独的一行上，并以星号开头后续的每一行：

```kotlin
/**
 * This is a documentation comment
 * on multiple lines.
 */
```

简短的注释可以放在一行上：

```kotlin
/** This is a short documentation comment. */
```

通常，避免使用 `@param` 和 `@return` 标签。相反，将参数和返回值的描述直接合并到文档注释中，并在提到参数的任何地方添加指向参数的链接。仅当需要冗长的描述时才使用 `@param` 和 `@return`，这些描述不适合主文本的流程。

```kotlin
// 避免这样做：

/**
 * Returns the absolute value of the given number.
 * @param number The number to return the absolute value for.
 * @return The absolute value.
 */
fun abs(number: Int): Int { /*...*/ }

// 而是这样做：

/**
 * Returns the absolute value of the given [number].
 */
fun abs(number: Int): Int { /*...*/ }
```

## 避免冗余构造

一般来说，如果 Kotlin 中的某个句法结构是可选的，并且被 IDE 突出显示为冗余，则应在代码中省略它。不要在代码中留下不必要的句法元素，只是为了“清晰”。

### Unit 返回类型

如果函数返回 Unit，则应省略返回类型：

```kotlin
fun foo() { // ": Unit" is omitted here

}
```

### 分号

尽可能省略分号。

### 字符串模板

当将一个简单的变量插入到字符串模板中时，不要使用花括号。仅对较长的表达式使用花括号。

```kotlin
println("$name has ${children.size} children")
```

## 惯用语言特征的使用

### 不可变性

首选使用不可变数据而不是可变数据。如果局部变量和属性在初始化后没有被修改，则始终将它们声明为 `val` 而不是 `var`。

始终使用不可变集合接口（`Collection`、`List`、`Set`、`Map`）来声明不会被改变的集合。当使用工厂函数来创建集合实例时，尽可能始终使用返回不可变集合类型的函数：

```kotlin
// 坏：对不会被改变的值使用可变集合类型
fun validateValue(actualValue: String, allowedValues: HashSet<String>) { ... }

// 好：而是使用不可变集合类型
fun validateValue(actualValue: String, allowedValues: Set<String>) { ... }

// 坏：arrayListOf() 返回 ArrayList<T>，这是一种可变集合类型
val allowedValues = arrayListOf("a", "b", "c")

// 好：listOf() 返回 List<T>
val allowedValues = listOf("a", "b", "c")
```

### 默认参数值

首选声明带有默认参数值的函数，而不是声明重载函数。

```kotlin
// 坏
fun foo() = foo("a")
fun foo(a: String) { /*...*/ }

// 好
fun foo(a: String = "a") { /*...*/ }
```

### 类型别名

如果在代码库中多次使用具有类型参数的函数类型或类型，则首选为其定义类型别名：

```kotlin
typealias MouseClickHandler = (Any, MouseEvent) `->` Unit
typealias PersonIndex = Map<String, Person>
```

如果你使用私有或内部类型别名来避免名称冲突，则首选 [包和导入](packages) 中提到的 `import ... as ...`。

### Lambda 表达式参数

在简短且未嵌套的 Lambda 表达式中，建议使用 `it` 约定而不是显式声明参数。在带有参数的嵌套 Lambda 表达式中，始终显式声明参数。

### Lambda 表达式中的返回

避免在 Lambda 表达式中使用多个带标签的返回。考虑重构 Lambda 表达式，使其只有一个退出点。
如果这不可能或不够清楚，请考虑将 Lambda 表达式转换为匿名函数。

不要对 Lambda 表达式中的最后一个语句使用带标签的返回。

### 命名参数

当一个方法采用多个相同原始类型的参数时，或者对于 `Boolean` 类型的参数，请使用命名参数语法，除非所有参数的含义从上下文中绝对清楚。

```kotlin
drawSquare(x = 10, y = 10, width = 100, height = 100, fill = true)
```

### 条件语句

首选使用 `try`、`if` 和 `when` 的表达式形式。

```kotlin
return if (x) foo() else bar()
```

```kotlin
return when(x) {
    0 `->` "zero"
    else `->` "nonzero"
}
```

以上优于：

```kotlin
if (x)
    return foo()
else
    return bar()
```

```kotlin
when(x) {
    0 `->` return "zero"
    else `->` return "nonzero"
}
```

### if 与 when

对于二元条件，首选使用 `if` 而不是 `when`。
例如，使用以下带有 `if` 的语法：

```kotlin
if (x == null) ... else ...
```

而不是以下带有 `when` 的语法：

```kotlin
when (x) {
    null `->` // ...
    else `->` // ...
}
```

如果有三个或更多选项，则首选使用 `when`。

### when 表达式中的守卫条件

在带有[守卫条件](control-flow#guard-conditions-in-when-expressions)的 `when` 表达式或语句中组合多个布尔表达式时，使用括号：

```kotlin
when (status) {
    is Status.Ok if (status.info.isEmpty() || status.info.id == null) `->` "no information"
}
```

而不是：

```kotlin
when (status) {
    is Status.Ok if status.info.isEmpty() || status.info.id == null `->` "no information"
}
```

### 条件中的可空 Boolean 值

如果需要在条件语句中使用可空的 `Boolean`，请使用 `if (value == true)` 或 `if (value == false)` 检查。

### 循环

首选使用高阶函数（`filter`、`map` 等）而不是循环。例外：`forEach`（首选使用常规 `for` 循环，除非 `forEach` 的接收者是可空的，或者 `forEach` 用作较长调用链的一部分）。

在选择使用多个高阶函数的复杂表达式和循环时，请了解在每种情况下执行的操作的成本，并牢记性能方面的考虑。

### 范围上的循环

使用 `..<` 运算符来循环访问一个开放范围：

```kotlin
for (i in 0..n - 1) { /*...*/ }  // 坏
for (i in 0..<n) { /*...*/ }  // 好
```

### 字符串

首选字符串模板而不是字符串连接。

首选多行字符串而不是将 `
` 转义序列嵌入到常规字符串字面量中。

为了保持多行字符串中的缩进，当结果字符串不需要任何内部缩进时，请使用 `trimIndent`，当需要内部缩进时，请使用 `trimMargin`：

```kotlin
fun main() {

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

}
```

了解 [Java 和 Kotlin 多行字符串之间的区别](java-to-kotlin-idioms-strings#use-multiline-strings)。

### 函数 vs 属性

在某些情况下，没有参数的函数可能可以与只读属性互换。
虽然语义相似，但在何时首选一种而不是另一种方面存在一些风格约定。

当底层算法：

*   不抛出异常。
*   计算成本低廉（或在第一次运行时缓存）。
*   如果对象状态没有改变，则在调用时返回相同的结果。

时，首选属性而不是函数。

### 扩展函数

自由地使用扩展函数。每次你有一个主要作用于对象上的函数时，请考虑将其作为扩展函数，接受该对象作为接收者。为了最大限度地减少 API 污染，请尽可能限制扩展函数的可见性。根据需要，使用局部扩展函数、成员扩展函数或具有私有可见性的顶层扩展函数。

### 中缀函数

仅当函数作用于两个扮演类似角色的对象时，才将函数声明为 `infix`。好的例子：`and`、`to`、`zip`。
坏的例子：`add`。

如果方法改变了接收者对象，则不要将其声明为 `infix`。

### 工厂函数

如果为一个类声明一个工厂函数，请避免给它与类本身相同的名称。首选使用不同的名称，
清楚地说明工厂函数的行为为何特殊。只有在确实没有特殊的语义时，
才能使用与类相同的名称。

```kotlin
class Point(val x: Double, val y: Double) {
    companion object {
        fun fromPolar(angle: Double, radius: Double) = Point(...)
    }
}
```

如果有一个对象具有多个不调用不同的超类构造函数且无法简化为带有默认参数值的单个构造函数的重载构造函数，则首选使用工厂函数替换重载构造函数。

### 平台类型

返回平台类型表达式的公共函数/方法必须显式声明其 Kotlin 类型：

```kotlin
fun apiCall(): String = MyJavaApi.getProperty("name")
```

使用平台类型表达式初始化的任何属性（包级别或类级别）都必须显式声明其 Kotlin 类型：

```kotlin
class Person {
    val name: String = MyJavaApi.getProperty("name")
}
```

使用平台类型表达式初始化的局部值可以有也可以没有类型声明：

```kotlin
fun main() {
    val name = MyJavaApi.getProperty("name")
    println(name)
}
```

### 作用域函数 apply/with/run/also/let

Kotlin 提供了一组函数，用于在给定对象的上下文中执行代码块：`let`、`run`、`with`、`apply` 和 `also`。
有关为你的情况选择正确的作用域函数的指南，