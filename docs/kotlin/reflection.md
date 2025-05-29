[//]: # (title: 反射)

_反射_是一组语言和库特性，允许你在运行时检查程序结构。在 Kotlin 中，函数和属性是一等公民，而在函数式或响应式风格中使用它们时，检查它们的能力（例如，在运行时获取属性或函数的名称或类型）至关重要。

> Kotlin/JS 对反射特性提供有限支持。[了解更多关于 Kotlin/JS 中的反射](js-reflection.md)。
>
{style="note"}

## JVM 依赖

在 JVM 平台，Kotlin 编译器分发包包含使用反射特性所需的运行时组件，它是一个单独的 artifact (`kotlin-reflect.jar`)。这样做是为了减小不使用反射特性的应用程序的运行时库的所需尺寸。

要在 Gradle 或 Maven 项目中使用反射，请添加对 `kotlin-reflect` 的依赖：

*   在 Gradle 中：

    <tabs group="build-script">
    <tab title="Kotlin" group-key="kotlin">

    ```kotlin
    dependencies {
        implementation(kotlin("reflect"))
    }
    ```

    </tab>
    <tab title="Groovy" group-key="groovy">
    
    ```groovy
    dependencies {
        implementation "org.jetbrains.kotlin:kotlin-reflect:%kotlinVersion%"
    }
    ```

    </tab>
    </tabs>

*   在 Maven 中：
    
    ```xml
    <dependencies>
        <dependency>
            <groupId>org.jetbrains.kotlin</groupId>
            <artifactId>kotlin-reflect</artifactId>
        </dependency>
    </dependencies>
    ```

如果你不使用 Gradle 或 Maven，请确保你的项目类路径中包含 `kotlin-reflect.jar`。在其他受支持的情况下（使用命令行编译器或 Ant 的 IntelliJ IDEA 项目），它是默认添加的。在命令行编译器和 Ant 中，你可以使用 `-no-reflect` 编译器选项来将 `kotlin-reflect.jar` 从类路径中排除。

## 类引用

最基本的反射特性是获取 Kotlin 类的运行时引用。要获取对静态已知 Kotlin 类的引用，你可以使用 _类字面值_ 语法：

```kotlin
val c = MyClass::class
```

该引用是一个 [KClass](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.reflect/-k-class/index.html) 类型值。

>在 JVM 上：Kotlin 类引用与 Java 类引用不同。要获取 Java 类引用，请在 `KClass` 实例上使用 `.java` 属性。
>
{style="note"}

### 绑定类引用

你可以通过将对象用作接收者，使用相同的 `::class` 语法获取特定对象的类引用：

```kotlin
val widget: Widget = ...
assert(widget is GoodWidget) { "Bad widget: ${widget::class.qualifiedName}" }
```

无论接收者表达式 (`Widget`) 的类型如何，你都将获取到对象的精确类引用，例如 `GoodWidget` 或 `BadWidget`。

## 可调用引用

函数、属性和构造函数的引用也可以被调用或用作[函数类型](lambdas.md#function-types)的实例。

所有可调用引用的共同超类型是 [`KCallable<out R>`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.reflect/-k-callable/index.html)，其中 `R` 是返回值类型。对于属性，它是属性类型，对于构造函数，它是构造类型。

### 函数引用

当你有一个如下声明的命名函数时，你可以直接调用它 (`isOdd(5)`)：

```kotlin
fun isOdd(x: Int) = x % 2 != 0
```

或者，你可以将函数用作函数类型值，即将其作为参数传递给另一个函数。为此，请使用 `::` 运算符：

```kotlin
fun isOdd(x: Int) = x % 2 != 0

fun main() {
//sampleStart
    val numbers = listOf(1, 2, 3)
    println(numbers.filter(::isOdd))
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

这里 `::isOdd` 是一个 `(Int) -> Boolean` 函数类型的值。

函数引用属于 [`KFunction<out R>`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.reflect/-k-function/index.html) 的子类型之一，具体取决于参数数量。例如，`KFunction3<T1, T2, T3, R>`。

当预期类型从上下文中可知时，`::` 可以与重载函数一起使用。例如：

```kotlin
fun main() {
//sampleStart
    fun isOdd(x: Int) = x % 2 != 0
    fun isOdd(s: String) = s == "brillig" || s == "slithy" || s == "tove"
    
    val numbers = listOf(1, 2, 3)
    println(numbers.filter(::isOdd)) // refers to isOdd(x: Int)
//end
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

或者，你可以通过将方法引用存储在显式指定类型的变量中来提供必要的上下文：

```kotlin
val predicate: (String) -> Boolean = ::isOdd   // refers to isOdd(x: String)
```

如果你需要使用类的成员或扩展函数，则需要进行限定：`String::toCharArray`。

即使你使用对扩展函数的引用来初始化变量，推断的函数类型将没有接收者，但它会有一个接受接收者对象的额外参数。要获得一个带有接收者的函数类型，请显式指定类型：

```kotlin
val isEmptyStringList: List<String>.() -> Boolean = List<String>::isEmpty
```

#### 示例：函数组合

考虑以下函数：

```kotlin
fun <A, B, C> compose(f: (B) -> C, g: (A) -> B): (A) -> C {
    return { x -> f(g(x)) }
}
```

它返回传递给它的两个函数的组合：`compose(f, g) = f(g(*))`。你可以将此函数应用于可调用引用：

```kotlin
fun <A, B, C> compose(f: (B) -> C, g: (A) -> B): (A) -> C {
    return { x -> f(g(x)) }
}

fun isOdd(x: Int) = x % 2 != 0

fun main() {
//sampleStart
    fun length(s: String) = s.length
    
    val oddLength = compose(::isOdd, ::length)
    val strings = listOf("a", "ab", "abc")
    
    println(strings.filter(oddLength))
//end
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

### 属性引用

要在 Kotlin 中将属性作为一等对象访问，请使用 `::` 运算符：

```kotlin
val x = 1

fun main() {
    println(::x.get())
    println(::x.name) 
}
```

表达式 `::x` 求值为一个 `KProperty0<Int>` 类型的属性对象。你可以使用 `get()` 读取其值，或使用 `name` 属性获取属性名称。有关更多信息，请参阅 [`KProperty` 类的文档](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.reflect/-k-property/index.html)。

对于像 `var y = 1` 这样的可变属性，`::y` 返回一个具有 [`KMutableProperty0<Int>`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.reflect/-k-mutable-property/index.html) 类型的值，该类型有一个 `set()` 方法：

```kotlin
var y = 1

fun main() {
    ::y.set(2)
    println(y)
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

属性引用可以在预期带有单个泛型参数的函数的地方使用：

```kotlin
fun main() {
//sampleStart
    val strs = listOf("a", "bc", "def")
    println(strs.map(String::length))
//end
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

要访问作为类成员的属性，请如下所示进行限定：

```kotlin
fun main() {
//sampleStart
    class A(val p: Int)
    val prop = A::p
    println(prop.get(A(1)))
//end
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

对于扩展属性：

```kotlin
val String.lastChar: Char
    get() = this[length - 1]

fun main() {
    println(String::lastChar.get("abc"))
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

### 与 Java 反射的互操作性

在 JVM 平台，标准库包含反射类的扩展，这些扩展提供了与 Java 反射对象之间的映射（参见 `kotlin.reflect.jvm` 包）。例如，要查找 Kotlin 属性的幕后字段或充当 getter 的 Java 方法，你可以这样编写：

```kotlin
import kotlin.reflect.jvm.*
 
class A(val p: Int)
 
fun main() {
    println(A::p.javaGetter) // prints "public final int A.getP()"
    println(A::p.javaField)  // prints "private final int A.p"
}
```

要获取与 Java 类对应的 Kotlin 类，请使用 `.kotlin` 扩展属性：

```kotlin
fun getKClass(o: Any): KClass<Any> = o.javaClass.kotlin
```

### 构造函数引用

构造函数可以像方法和属性一样被引用。你可以在程序期望函数类型对象的地方使用它们，该对象接受与构造函数相同的参数并返回相应类型的对象。构造函数通过使用 `::` 运算符并添加类名来引用。考虑以下期望一个函数参数的函数，该函数参数无参数且返回类型为 `Foo`：

```kotlin
class Foo

fun function(factory: () -> Foo) {
    val x: Foo = factory()
}
```

使用 `::Foo`，即类 `Foo` 的零参数构造函数，你可以这样调用它：

```kotlin
function(::Foo)
```

可调用构造函数引用的类型是 [`KFunction<out R>`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.reflect/-k-function/index.html) 的子类型之一，具体取决于参数数量。

### 绑定函数和属性引用

你可以引用特定对象的实例方法：

```kotlin
fun main() {
//sampleStart
    val numberRegex = "\\d+".toRegex()
    println(numberRegex.matches("29"))
     
    val isNumber = numberRegex::matches
    println(isNumber("29"))
//end
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

示例没有直接调用 `matches` 方法，而是使用了对它的引用。这样的引用绑定到其接收者。它可以直接调用（如上述示例所示）或在预期函数类型表达式的任何地方使用：

```kotlin
fun main() {
//sampleStart
    val numberRegex = "\\d+".toRegex()
    val strings = listOf("abc", "124", "a70")
    println(strings.filter(numberRegex::matches))
//end
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

比较绑定引用和非绑定引用的类型。绑定的可调用引用将其接收者“附加”到其自身，因此接收者的类型不再是参数：

```kotlin
val isNumber: (CharSequence) -> Boolean = numberRegex::matches

val matches: (Regex, CharSequence) -> Boolean = Regex::matches
```

属性引用也可以被绑定：

```kotlin
fun main() {
//sampleStart
    val prop = "abc"::length
    println(prop.get())
//end
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

你不需要将 `this` 指定为接收者：`this::foo` 和 `::foo` 是等价的。

### 绑定构造函数引用

可以通过提供外部类的实例来获取对[内部类](nested-classes.md#inner-classes)构造函数的绑定可调用引用：

```kotlin
class Outer {
    inner class Inner
}

val o = Outer()
val boundInnerCtor = o::Inner
```