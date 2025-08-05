[//]: # (title: 编码约定)

众所周知且易于遵循的编码约定对任何编程语言都至关重要。
本文档提供了 Kotlin 项目的代码风格和代码组织指南。

## 在 IDE 中配置风格

Kotlin 最流行的两个 IDE——[IntelliJ IDEA](https://www.jetbrains.com/idea/) 和 [Android Studio](https://developer.android.com/studio/)
提供了强大的代码风格支持。你可以配置它们以自动格式化你的代码，使其与给定的代码风格保持一致。

### 应用风格指南

1.  前往 **Settings/Preferences | Editor | Code Style | Kotlin**。
2.  点击 **Set from...**。
3.  选择 **Kotlin style guide**。

### 验证代码是否遵循风格指南

1.  前往 **Settings/Preferences | Editor | Inspections | General**。
2.  开启 **Incorrect formatting** 检查。
其他用于验证风格指南中描述的其他问题（例如命名约定）的检查默认是启用的。

## 源代码组织

### 目录结构

在纯 Kotlin 项目中，推荐的目录结构遵循包结构，并省略公共根包。例如，如果项目中的所有代码都位于 `org.example.kotlin` 包及其
子包中，那么 `org.example.kotlin` 包中的文件应直接放置在源代码根目录下，而
`org.example.kotlin.network.socket` 中的文件应放置在源代码根目录的 `network/socket` 子目录中。

>在 JVM 上：在 Kotlin 与 Java 一起使用的项目中，Kotlin 源文件应与 Java 源文件位于同一
>源代码根目录下，并遵循相同的目录结构：每个文件应存储在与其包声明对应的目录中。
>
{style="note"}

### 源文件名称

如果 Kotlin 文件包含单个类或接口（可能带有相关的顶层声明），其名称应与
类名相同，并附加 `.kt` 扩展名。这适用于所有类型的类和接口。
如果文件包含多个类，或仅包含顶层声明，请选择一个描述文件内容的名称，并相应地命名文件。
使用[大驼峰式](https://en.wikipedia.org/wiki/Camel_case)，即每个单词的首字母大写。
例如，`ProcessDeclarations.kt`。

文件名称应描述文件中代码的功能。因此，应避免在文件名称中使用
`Util` 等无意义的词。

#### 多平台项目

在多平台项目中，平台特有的源代码集中包含顶层声明的文件应带有与源代码集名称相关的后缀。例如：

*   **jvm**Main/kotlin/Platform.**jvm**.kt
*   **android**Main/kotlin/Platform.**android**.kt
*   **ios**Main/kotlin/Platform.**ios**.kt

至于公共源代码集，包含顶层声明的文件不应带有后缀。例如，`commonMain/kotlin/Platform.kt`。

##### 技术细节 {initial-collapse-state="collapsed" collapsible="true"}

由于 JVM 的限制，我们建议在多平台项目中遵循此文件命名方案：它不允许
顶层成员（函数、属性）。

为了规避此问题，Kotlin JVM 编译器会创建包装类（即“文件门面”），其中包含顶层
成员声明。文件门面有一个派生自文件名的内部名称。

反过来，JVM 不允许存在多个具有相同完全限定名称 (FQN) 的类。这可能导致
Kotlin 项目无法编译到 JVM 的情况：

```none
root
|- commonMain/kotlin/myPackage/Platform.kt // contains 'fun count() { }'
|- jvmMain/kotlin/myPackage/Platform.kt // contains 'fun multiply() { }'
```

这里两个 `Platform.kt` 文件都在同一个包中，因此 Kotlin JVM 编译器会生成两个文件门面，它们都具有
FQN `myPackage.PlatformKt`。这会产生“重复的 JVM 类”错误。

避免这种情况的最简单方法是根据上述指南重命名其中一个文件。这种命名方案有助于
避免冲突，同时保持代码可读性。

> 有两种情况下这些建议可能看起来是多余的，但我们仍然建议遵循它们：
>
> *   非 JVM 平台没有文件门面重复的问题。然而，这种命名方案可以帮助你保持
>     文件命名一致。
> *   在 JVM 上，如果源文件没有顶层声明，则不生成文件门面，并且你不会面临
>     命名冲突。
>
>     然而，这种命名方案可以帮助你避免在简单重构
>     或添加操作可能包含顶层函数并导致相同的“重复的 JVM 类”错误的情况。
>
{style="tip"}

### 源文件组织

鼓励将多个声明（类、顶层函数或属性）放置在同一个 Kotlin 源文件中，
只要这些声明在语义上彼此密切相关，并且文件大小保持合理
（不超过数百行）。

特别是，当为一个类的所有客户端都相关的扩展函数时，
将它们与类本身放在同一个文件中。当定义的扩展函数
仅对特定客户端有意义时，将它们放在该客户端的代码旁边。避免仅为了容纳
某个类的所有扩展而创建文件。

### 类布局

类的内容应按以下顺序排列：

1.  属性声明和初始化块
2.  次构造函数
3.  方法声明
4.  伴生对象

不要按字母顺序或可见性对方法声明进行排序，也不要将常规方法
与扩展方法分开。相反，将相关内容放在一起，以便从上到下阅读类的人可以
理解逻辑流程。选择一个顺序（高级内容优先，反之亦然）并坚持下去。

将嵌套类放在使用这些类的代码旁边。如果类旨在外部使用且在类内部没有被引用，
则将它们放在末尾，伴生对象之后。

### 接口实现布局

实现接口时，请保持实现成员的顺序与接口成员的顺序一致（如有必要，
可穿插用于实现的额外私有方法）。

### 重载布局

始终将重载函数放在类中彼此相邻的位置。

## 命名规则

Kotlin 中的包和类命名规则非常简单：

*   包名始终为小写，不使用下划线（`org.example.project`）。通常不鼓励使用多词
    名称，但如果你确实需要使用多个词，可以直接将它们连接在一起
    或使用驼峰式（`org.example.myProject`）。

*   类和对象的名称使用大驼峰式：

    ```kotlin
    open class DeclarationProcessor { /*...*/ }

    object EmptyDeclarationProcessor : DeclarationProcessor() { /*...*/ }
    ```

### 函数名称

函数、属性和局部变量的名称以小写字母开头，并使用驼峰式，不带下划线：

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

### 测试方法的名称

在测试中（**仅**在测试中），你可以使用用反引号括起来的带空格的方法名称。
请注意，此类方法名称仅从 API 级别 30 开始受 Android 运行时支持。测试代码中也允许在方法名称中使用下划线。

```kotlin
class MyTestCase {
     @Test fun `ensure everything works`() { /*...*/ }

     @Test fun ensureEverythingWorks_onAndroid() { /*...*/ }
}
```

### 属性名称

常量名称（用 `const` 标记的属性，或没有自定义 `get` 函数且持有深度不可变数据的顶层或对象 `val` 属性）应使用全大写、下划线分隔的名称，遵循[全大写蛇形命名法 (screaming snake case)](https://en.wikipedia.org/wiki/Snake_case) 约定：

```kotlin
const val MAX_COUNT = 8
val USER_NAME_FIELD = "UserName"
```

持有带行为或可变数据对象的顶层或对象属性的名称应使用驼峰式名称：

```kotlin
val mutableCollection: MutableSet<String> = HashSet()
```

持有对单例对象引用的属性的名称可以使用与 `object` 声明相同的命名风格：

```kotlin
val PersonComparator: Comparator<Person> = /*...*/
```

对于枚举常量，可以根据用法使用全大写、下划线分隔的名称（[尖叫蛇形命名法 (screaming snake case)](https://en.wikipedia.org/wiki/Snake_case)）
（`enum class Color { RED, GREEN }`）或大驼峰式名称。

### 幕后属性的名称

如果一个类有两个概念上相同但一个属于公共 API，另一个是实现细节的属性，
请在私有属性的名称前使用下划线作为前缀：

```kotlin
class C {
    private val _elementList = mutableListOf<Element>()

    val elementList: List<Element>
         get() = _elementList
}
```

### 选择好的名称

类的名称通常是一个名词或名词短语，解释这个类“是”什么：`List`、`PersonReader`。

方法的名称通常是一个动词或动词短语，说明这个方法“做”什么：`close`、`readPersons`。
名称还应暗示该方法是改变对象还是返回一个新对象。例如，`sort` 是
就地排序集合，而 `sorted` 返回集合的排序副本。

名称应清楚说明实体的目的，因此最好避免在名称中使用无意义的词
（`Manager`、`Wrapper`）。

当使用缩写作为声明名称的一部分时，请遵循以下规则：

*   对于两个字母的缩写，两个字母都使用大写。例如，`IOStream`。
*   对于超过两个字母的缩写，仅首字母大写。例如，`XmlFormatter` 或 `HttpInputStream`。

## 格式化

### 缩进

使用四个空格进行缩进。不要使用制表符。

对于花括号，开花括号放在构造开始行的末尾，闭花括号
放在单独一行，与开花括号的构造水平对齐。

```kotlin
if (elements != null) {
    for (element in elements) {
        // ...
    }
}
```

>在 Kotlin 中，分号是可选的，因此换行符很重要。语言设计假定使用
>Java 风格的花括号，如果你尝试使用不同的格式风格，可能会遇到意外行为。
>
{style="note"}

### 水平空白符

*   二元操作符两侧留空格（`a + b`）。例外：区间操作符两侧不留空格（`0..i`）。
*   一元操作符两侧不留空格（`a++`）。
*   控制流关键字（`if`、`when`、`for` 和 `while`）与其相应的左圆括号之间留空格。
*   主构造函数声明、方法声明或方法调用中，左圆括号前不留空格。

```kotlin
class A(val x: Int)

fun foo(x: Int) { ... }

fun bar() {
    foo(1)
}
```

*   在 `(`、`[` 之后或 `]`、`)` 之前绝不留空格。
*   在 `.` 或 `?.` 周围绝不留空格：`foo.bar().filter { it > 2 }.joinToString()`、`foo?.bar()`。
*   在 `//` 之后留空格：`// This is a comment`。
*   用于指定类型形参的尖括号周围不留空格：`class Map<K, V> { ... }`。
*   在 `::` 周围不留空格：`Foo::class`、`String::length`。
*   用于标记可空类型的 `?` 前不留空格：`String?`。

作为一般规则，避免任何形式的水平对齐。将标识符重命名为不同长度的名称
不应影响声明或任何用法的格式。

### 冒号

在以下情况下，冒号 `:` 前留空格：

*   当它用于分隔类型和超类型时。
*   当委托给超类构造函数或同一类的不同构造函数时。
*   在 `object` 关键字之后。

当冒号分隔声明及其类型时，冒号前不留空格。

冒号后始终留一个空格。

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

具有少量主构造函数形参的类可以写在单行：

```kotlin
class Person(id: Int, name: String)
```

具有较长类头的类应格式化，以便每个主构造函数形参都在单独一行并带有缩进。
此外，右圆括号应在新行。如果使用继承，超类构造函数调用或
实现接口列表应与圆括号位于同一行：

```kotlin
class Person(
    id: Int,
    name: String,
    surname: String
) : Human(id, name) { /*...*/ }
```

对于多个接口，超类构造函数调用应首先出现，然后每个接口应
位于不同行：

```kotlin
class Person(
    id: Int,
    name: String,
    surname: String
) : Human(id, name),
    KotlinMaker { /*...*/ }
```

对于超类型列表较长的类，在冒号后换行并水平对齐所有超类型名称：

```kotlin
class MyFavouriteVeryLongClassHolder :
    MyLongHolder<MyFavouriteVeryLongClass>(),
    SomeOtherInterface,
    AndAnotherOne {

    fun foo() { /*...*/ }
}
```

为了在类头很长时清楚地分隔类头和类体，可以在
类头后留空行（如上例所示），或者将开花括号放在单独一行：

```kotlin
class MyFavouriteVeryLongClassHolder :
    MyLongHolder<MyFavouriteVeryLongClass>(),
    SomeOtherInterface,
    AndAnotherOne
{
    fun foo() { /*...*/ }
}
```

构造函数形参使用常规缩进（四个空格）。这可确保主构造函数中声明的属性与
类体中声明的属性具有相同的缩进。

### 修饰符顺序

如果一个声明有多个修饰符，请始终按以下顺序排列：

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

所有注解放在修饰符之前：

```kotlin
@Named("Foo")
private val foo: Foo
```

除非你正在开发一个库，否则省略冗余修饰符（例如 `public`）。

### 注解

注解应放在声明前的单独行上，并与声明保持相同的缩进：

```kotlin
@Target(AnnotationTarget.PROPERTY)
annotation class JsonExclude
```

无实参注解可以放在同一行：

```kotlin
@JsonExclude @JvmField
var x: String
```

单个无实参注解可以与相应声明放在同一行：

```kotlin
@Test fun foo() { /*...*/ }
```

### 文件注解

文件注解放置在文件注释（如果有）之后，`package` 声明之前，
并与 `package` 用空行分隔（以强调它们是针对文件而非包的）。

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

函数形参使用常规缩进（四个空格）。这有助于确保与构造函数形参的一致性。

对于函数体由单个表达式构成的函数，优先使用表达式体。

```kotlin
fun foo(): Int {     // bad
    return 1
}

fun foo() = 1        // good
```

### 表达式体

如果函数有表达式体，且第一行与声明不在同一行，则将 `=` 号放在第一行，
并将表达式体缩进四个空格。

```kotlin
fun f(x: String, y: String, z: String) =
    veryLongFunctionCallWithManyWords(andLongParametersToo(), x, y, z)
```

### 属性

对于非常简单的只读属性，考虑单行格式：

```kotlin
val isEmpty: Boolean get() = size == 0
```

对于更复杂的属性，始终将 `get` 和 `set` 关键字放在单独行：

```kotlin
val foo: String
    get() { /*...*/ }
```

对于带初始化器的属性，如果初始化器很长，则在 `=` 号后添加换行符，
并将初始化器缩进四个空格：

```kotlin
private val defaultCharset: Charset? =
    EncodingRegistry.getInstance().getDefaultCharsetForPropertiesFiles(file)
```

### 控制流语句

如果 `if` 或 `when` 语句的条件是多行的，始终在语句体周围使用花括号。
条件的后续行相对语句起始位置缩进四个空格。
条件的右圆括号与开花括号放在单独一行：

```kotlin
if (!component.isSyncing &&
    !hasAnyKotlinRuntimeInScope(module)
) {
    return createKotlinNotConfiguredPanel(module)
}
```

这有助于对齐条件和语句体。

将 `else`、`catch`、`finally` 关键字以及 `do-while` 循环的 `while` 关键字与
前面的花括号放在同一行：

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

在 `when` 语句中，如果分支超过一行，考虑用空行将其与相邻的 case 块隔开：

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

将短分支放在与条件同一行，不带花括号。

```kotlin
when (foo) {
    true -> bar() // good
    false -> { baz() } // bad
}
```

### 方法调用

在长实参列表中，在左圆括号后换行。实参缩进四个空格。
将多个密切相关的实参放在同一行。

```kotlin
drawSquare(
    x = 10, y = 10,
    width = 100, height = 100,
    fill = true
)
```

实参名称和值之间等号两侧留空格。

### 换行链式调用

换行链式调用时，将 `.` 字符或 `?.` 操作符放在下一行，并带一个缩进：

```kotlin
val anchor = owner
    ?.firstChild!!
    .siblings(forward = true)
    .dropWhile { it is PsiComment || it is PsiWhiteSpace }
```

链中的第一个调用通常应在其之前换行，但如果代码因此更有意义，则可以省略。

### Lambda 表达式

在 lambda 表达式中，花括号两侧以及分隔形参和函数体的箭头两侧都应留空格。如果调用接受单个 lambda 表达式，请尽可能将其放在圆括号外传递。

```kotlin
list.filter { it > 10 }
```

如果为 lambda 表达式指定标签，则标签和开花括号之间不留空格：

```kotlin
fun foo() {
    ints.forEach lit@{
        // ...
    }
}
```

在多行 lambda 表达式中声明形参名称时，将名称放在第一行，后跟箭头和换行符：

```kotlin
appendCommaSeparated(properties) { prop ->
    val propertyValue = prop.get(obj)  // ...
}
```

如果形参列表太长而无法放在一行，则将箭头放在单独一行：

```kotlin
foo {
   context: Context,
   environment: Env
   ->
   context.configureEnv(environment)
}
```

### 尾部逗号

尾部逗号是一系列元素的最后一个元素后面的逗号符号：

```kotlin
class Person(
    val firstName: String,
    val lastName: String,
    val age: Int, // trailing comma
)
```

使用尾部逗号有几个好处：

*   它使版本控制差异更清晰——所有焦点都在更改的值上。
*   它使得添加和重新排序元素变得容易——如果你操作元素，无需添加或删除逗号。
*   它简化了代码生成，例如，对于对象初始化器。最后一个元素也可以有逗号。

尾部逗号是完全可选的——即使没有它们，你的代码仍然可以工作。Kotlin 风格指南鼓励在声明处使用尾部逗号，并在调用处由你自行决定。

要在 IntelliJ IDEA 格式化程序中启用尾部逗号，请前往 **Settings/Preferences | Editor | Code Style | Kotlin**，
打开 **Other** 选项卡并选择 **Use trailing comma** 选项。

#### 枚举 {initial-collapse-state="collapsed" collapsible="true"}

```kotlin
enum class Direction {
    NORTH,
    SOUTH,
    WEST,
    EAST, // trailing comma
}
```

#### 实参值 {initial-collapse-state="collapsed" collapsible="true"}

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

#### 类属性和形参 {initial-collapse-state="collapsed" collapsible="true"}

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

#### 函数值形参 {initial-collapse-state="collapsed" collapsible="true"}

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

#### 带有可选类型的形参（包括 setter） {initial-collapse-state="collapsed" collapsible="true"}

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

#### lambda 表达式中的形参 {initial-collapse-state="collapsed" collapsible="true"}

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

#### 类型实参 {initial-collapse-state="collapsed" collapsible="true"}

```kotlin
fun <T1, T2> foo() {}
fun main() {
    foo<
            Comparable<Number>,
            Iterable<Number>, // trailing comma
            >()
}
```

#### 类型形参 {initial-collapse-state="collapsed" collapsible="true"}

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

对于较长的文档注释，将开 `/**` 放在单独一行，并以星号开始后续每一行：

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

通常，避免使用 `@param` 和 `@return` 标签。相反，将形参和返回值的描述
直接整合到文档注释中，并在提及形参的地方添加链接。仅当需要
冗长描述且不适合主文本流程时才使用 `@param` 和 `@return`。

```kotlin
// Avoid doing this:

/**
 * Returns the absolute value of the given number.
 * @param number The number to return the absolute value for.
 * @return The absolute value.
 */
fun abs(number: Int): Int { /*...*/ }

// Do this instead:

/**
 * Returns the absolute value of the given [number].
 */
fun abs(number: Int): Int { /*...*/ }
```

## 避免冗余构造

通常，如果 Kotlin 中的某个语法构造是可选的，并且被 IDE 标记为冗余，
则应在代码中省略它。不要为了“清晰”而在代码中保留不必要的语法元素。

### Unit 返回类型

如果函数返回 Unit，则应省略返回类型：

```kotlin
fun foo() { // ": Unit" is omitted here

}
```

### 分号

尽可能省略分号。

### 字符串模板

在字符串模板中插入简单变量时，不要使用花括号。仅对更长的表达式使用花括号：

```kotlin
println("$name has ${children.size} children")
```

使用[多美元字符串内插](strings.md#multi-dollar-string-interpolation)
将美元符号字符视为字符串字面量：

```kotlin
val KClass<*>.jsonSchema : String
get() = $"""
    {
      "$schema": "https://json-schema.org/draft/2020-12/schema",
      "$id": "https://example.com/product.schema.json",
      "$dynamicAnchor": "meta",
      "title": "${simpleName ?: qualifiedName ?: "unknown"}",
      "type": "object"
    }
    """
```

## 语言特性的惯用用法

### 不可变性

优先使用不可变数据而非可变数据。如果局部变量和属性在初始化后未被修改，则始终将其声明为 `val` 而非 `var`。

始终使用不可变集合接口（`Collection`、`List`、`Set`、`Map`）来声明未被改变的集合。
当使用工厂函数创建集合实例时，尽可能始终使用返回不可变集合类型的函数：

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

### 默认形参值

优先声明带有默认形参值的函数，而不是声明重载函数。

```kotlin
// Bad
fun foo() = foo("a")
fun foo(a: String) { /*...*/ }

// Good
fun foo(a: String = "a") { /*...*/ }
```

### 类型别名

如果你的代码库中多次使用某个函数类型或带有类型形参的类型，优先为其定义类型别名：

```kotlin
typealias MouseClickHandler = (Any, MouseEvent) -> Unit
typealias PersonIndex = Map<String, Person>
```
如果你使用私有或内部类型别名来避免名称冲突，优先使用[包与导入](packages.md)中提到的 `import ... as ...`。

### Lambda 形参

在短且不嵌套的 lambda 表达式中，建议使用 `it` 约定而不是显式声明形参。
在带有形参的嵌套 lambda 表达式中，始终显式声明形参。

### lambda 表达式中的返回

避免在 lambda 表达式中使用多个带标签的返回。考虑重构 lambda 表达式，使其只有一个退出点。
如果无法做到或不够清晰，考虑将 lambda 表达式转换为匿名函数。

不要为 lambda 表达式中最后一条语句使用带标签的返回。

### 命名实参

当方法接受多个相同原生类型或 `Boolean` 类型的形参时，请使用命名实参语法，
除非所有形参的含义在上下文中绝对清晰。

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

以上写法优于：

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

对于二元条件，优先使用 `if` 而非 `when`。
例如，使用 `if` 的这种语法：

```kotlin
if (x == null) ... else ...
```

而不是 `when` 的这种语法：

```kotlin
when (x) {
    null -> // ...
    else -> // ...
}
```

如果有三个或更多选项，优先使用 `when`。

### when 表达式中的守卫条件

在 `when` 表达式或带有[守卫条件](control-flow.md#guard-conditions-in-when-expressions)的语句中组合多个布尔表达式时，请使用圆括号：

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

优先使用高阶函数（`filter`、`map` 等）而非循环。例外：`forEach`（优先使用常规 `for` 循环，
除非 `forEach` 的接收者是可空的，或者 `forEach` 作为更长调用链的一部分使用）。

在复杂表达式使用多个高阶函数和循环之间做出选择时，请了解每种情况下执行操作的开销，并牢记性能考量。

### 区间上的循环

使用 `..<` 操作符来循环遍历开区间：

```kotlin
for (i in 0..n - 1) { /*...*/ }  // bad
for (i in 0..<n) { /*...*/ }  // good
```

### 字符串

优先使用字符串模板而非字符串连接。

优先使用多行字符串而非在常规字符串字面量中嵌入 `
` 转义序列。

为了在多行字符串中保持缩进，当结果字符串不需要任何内部缩进时，使用 `trimIndent`，
当需要内部缩进时，使用 `trimMargin`：

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

在某些情况下，无实参函数可能与只读属性互换。
尽管语义相似，但何时优先使用哪种形式有一些风格约定。

当底层算法满足以下条件时，优先使用属性而非函数：

*   不抛出异常。
*   计算开销小（或在首次运行时已缓存）。
*   如果对象状态未改变，则在多次调用中返回相同结果。

### 扩展函数

大量使用扩展函数。每当你有一个主要作用于某个对象的函数时，考虑将其
设为接受该对象作为接收者的扩展函数。为了最大限度减少 API 污染，
尽可能限制扩展函数的可见性。必要时，使用局部扩展函数、成员扩展函数或
带有私有可见性的顶层扩展函数。

### 中缀函数

仅当函数作用于扮演相似角色的两个对象时，才将其声明为 `infix` 函数。
好例子：`and`、`to`、`zip`。
坏例子：`add`。

如果方法会改变接收者对象，则不要将其声明为 `infix` 函数。

### 工厂函数

如果你为一个类声明工厂函数，避免给它与类本身相同的名称。优先使用独特的名称，
明确说明工厂函数的行为为何特殊。仅当确实没有特殊语义时，
你才能使用与类相同的名称。

```kotlin
class Point(val x: Double, val y: Double) {
    companion object {
        fun fromPolar(angle: Double, radius: Double) = Point(...)
    }
}
```

如果你有一个带有多个重载构造函数，且这些构造函数不调用不同的超类构造函数，并且
不能简化为包含默认形参值的单个构造函数，则优先用
工厂函数替换重载构造函数。

### 平台类型

返回平台类型表达式的公共函数/方法必须显式声明其 Kotlin 类型：

```kotlin
fun apiCall(): String = MyJavaApi.getProperty("name")
```

任何用平台类型表达式初始化的属性（包级或类级）必须显式声明其 Kotlin 类型：

```kotlin
class Person {
    val name: String = MyJavaApi.getProperty("name")
}
```

用平台类型表达式初始化的局部值可以有类型声明，也可以没有：

```kotlin
fun main() {
    val name = MyJavaApi.getProperty("name")
    println(name)
}
```

### 作用域函数 apply/with/run/also/let

Kotlin 提供了一组函数，用于在给定对象的上下文中执行代码块：`let`、`run`、`with`、`apply` 和 `also`。
关于如何为你的用例选择合适作用域函数的指导，请参考[作用域函数](scope-functions.md)。

## 库的编码约定

编写库时，建议遵循一套额外的规则以确保 API 稳定性：

*   始终显式指定成员可见性（以避免意外将声明暴露为公共 API）。
*   始终显式指定函数返回类型和属性类型（以避免在实现改变时意外更改返回类型）。
*   为所有公共成员提供 [KDoc](kotlin-doc.md) 注释，除了不需要任何新文档的覆盖（以支持生成库的文档）。

关于编写库 API 时要考虑的最佳实践和思想，请参阅[库作者指南](api-guidelines-introduction.md)。