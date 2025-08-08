[//]: # (title: 反射)

_反射_ 是一组语言和库**特性**，允许你在**运行时**探查程序的结构。
**函数**和属性在 Kotlin 中是**头等公民**，而**探查**它们的能力（**例如**，在**运行时**获知属性或**函数**的名称或类型）在使用**函数式**或**反应式**风格时至关重要。

> Kotlin/JS 提供对反射**特性**的有限支持。[了解更多关于 Kotlin/JS 中的反射信息](js-reflection.md)。
>
{style="note"}

## JVM 依赖项

在 JVM 平台，Kotlin 编译器分发版包含使用反射**特性**所需的**运行时**组件，作为一个独立的 `artifact`，即 `kotlin-reflect.jar`。这样做是为了减小不使用反射**特性**的**应用程序**的**运行时**库所需的大小。

要在 Gradle 或 Maven **项目**中使用反射，添加对 `kotlin-reflect` 的**依赖项**：

* 在 Gradle 中：

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

* 在 Maven 中：
    
    ```xml
    <dependencies>
        <dependency>
            <groupId>org.jetbrains.kotlin</groupId>
            <artifactId>kotlin-reflect</artifactId>
        </dependency>
    </dependencies>
    ```

如果你不使用 Gradle 或 Maven，请确保你的**项目**的 classpath 中包含 `kotlin-reflect.jar`。在其他受支持的情况下（使用命令行编译器或 Ant 的 IntelliJ IDEA **项目**），它是默认添加的。在命令行编译器和 Ant 中，你可以使用 `-no-reflect` 编译器选项将 `kotlin-reflect.jar` 从 classpath 中排除。

## 类引用

最基本的反射**特性**是获取 Kotlin 类的**运行时**引用。要获取对静态已知的 Kotlin 类的引用，你可以使用 _类字面量_ 语法：

```kotlin
val c = MyClass::class
```

该引用是一个 [KClass](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.reflect/-k-class/index.html) 类型的值。

>在 JVM 上：Kotlin 类引用与 Java 类引用不同。要获取 Java 类引用，请使用 `KClass` 实例上的 `.java` 属性。
>
{style="note"}

### 绑定类引用

你可以使用相同的 `::class` 语法，通过将对象作为**接收者**来获取特定对象的类引用：

```kotlin
val widget: Widget = ...
assert(widget is GoodWidget) { "Bad widget: ${widget::class.qualifiedName}" }
```

你将获得对象的精确类引用，**例如**，`GoodWidget` 或 `BadWidget`，无论**接收者**表达式（`Widget`）的类型是什么。

## 可调用引用

对**函数**、属性和**构造函数**的引用也可以被调用或用作 [**函数类型**](lambdas.md#function-types) 的实例。

所有可调用引用的公共超类型是 [`KCallable<out R>`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.reflect/-k-callable/index.html)，其中 `R` 是返回值类型。它是属性的属性类型，并且是**构造函数**的构造类型。

### **函数**引用

当你**声明**了一个如下所示的命名**函数**时，你可以直接调用它（`isOdd(5)`）：

```kotlin
fun isOdd(x: Int) = x % 2 != 0
```

此外，你可以将**函数**用作**函数类型**值，也就是说，将其传递给另一个**函数**。为此，请使用 `::` **操作符**：

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

这里 `::isOdd` 是**函数类型** `(Int) -> Boolean` 的值。

**函数**引用属于 [`KFunction<out R>`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.reflect/-k-function/index.html) 子类型之一，具体取决于**形参**数量。**例如**，`KFunction3<T1, T2, T3, R>`。

当上下文已知预期类型时，`::` 可以用于**重载函数**。**例如**：

```kotlin
fun main() {
//sampleStart
    fun isOdd(x: Int) = x % 2 != 0
    fun isOdd(s: String) = s == "brillig" || s == "slithy" || s == "tove"
    
    val numbers = listOf(1, 2, 3)
    println(numbers.filter(::isOdd)) // refers to isOdd(x: Int)
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

此外，你可以通过将**方法**引用存储在**显式**指定类型的变量中来提供必要的上下文：

```kotlin
val predicate: (String) -> Boolean = ::isOdd   // refers to isOdd(x: String)
```

如果你需要使用类的成员或**扩展函数**，它需要被限定：`String::toCharArray`。

即使你使用**扩展函数**的引用来初始化变量，推断的**函数类型**将没有**接收者**，但它将有一个额外的**形参**接受一个**接收者**对象。要改为拥有带**接收者**的**函数类型**，请**显式**指定类型：

```kotlin
val isEmptyStringList: List<String>.() -> Boolean = List<String>::isEmpty
```

#### 示例：**函数**组合

考虑以下**函数**：

```kotlin
fun <A, B, C> compose(f: (B) -> C, g: (A) -> B): (A) -> C {
    return { x -> f(g(x)) }
}
```

它返回传递给它的两个**函数**的组合：`compose(f, g) = f(g(*))`。你可以将此**函数**应用于可调用引用：

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
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

### 属性引用

要在 Kotlin 中将属性作为头等公民访问，请使用 `::` **操作符**：

```kotlin
val x = 1

fun main() {
    println(::x.get())
    println(::x.name) 
}
```

表达式 `::x` 会**求值**为一个 `KProperty0<Int>` 类型的属性对象。你可以使用 `get()` 读取其值，或使用 `name` 属性检索属性名称。关于更多信息，请**参见** [关于 `KProperty` 类的文档](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.reflect/-k-property/index.html)。

对于一个可变属性，**例如** `var y = 1`，`::y` 返回一个类型为 [`KMutableProperty0<Int>`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.reflect/-k-mutable-property/index.html) 的值，该类型有一个 `set()` **方法**：

```kotlin
var y = 1

fun main() {
    ::y.set(2)
    println(y)
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

属性引用可以用于预期单个泛型**形参**的**函数**的场景：

```kotlin
fun main() {
//sampleStart
    val strs = listOf("a", "bc", "def")
    println(strs.map(String::length))
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

要访问类的成员属性，请按如下方式限定它：

```kotlin
fun main() {
//sampleStart
    class A(val p: Int)
    val prop = A::p
    println(prop.get(A(1)))
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

对于**扩展**属性：

```kotlin
val String.lastChar: Char
    get() = this[length - 1]

fun main() {
    println(String::lastChar.get("abc"))
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

### 与 Java 反射的**互操作**

在 JVM 平台，标准库包含反射类的**扩展**，它们提供与 Java 反射对象的映射关系（**参见**包 `kotlin.reflect.jvm`）。
**例如**，要查找**幕后字段**或作为 Kotlin 属性**读取方法**的 Java **方法**，你可以这样写：

```kotlin
import kotlin.reflect.jvm.*
 
class A(val p: Int)
 
fun main() {
    println(A::p.javaGetter) // prints "public final int A.getP()"
    println(A::p.javaField)  // prints "private final int A.p"
}
```

要获取与 Java 类对应的 Kotlin 类，请使用 `.kotlin` **扩展**属性：

```kotlin
fun getKClass(o: Any): KClass<Any> = o.javaClass.kotlin
```

### **构造函数**引用

**构造函数**可以像**方法**和属性一样被引用。只要程序预期一个**函数类型**对象，并且该对象接受与**构造函数**相同的**形参**并返回适当类型的对象，你就可以使用它们。
通过使用 `::` **操作符**并添加类名来引用**构造函数**。考虑以下**函数**，它预期一个没有**形参**且返回类型为 `Foo` 的**函数形参**：

```kotlin
class Foo

fun function(factory: () -> Foo) {
    val x: Foo = factory()
}
```

使用 `::Foo`，即 `Foo` 类的零**实参****构造函数**，你可以这样调用它：

```kotlin
function(::Foo)
```

对**构造函数**的可调用引用被类型化为 [`KFunction<out R>`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.reflect/-k-function/index.html) 子类型之一，具体取决于**形参**数量。

### 绑定**函数**与属性引用

你可以引用特定对象的实例**方法**：

```kotlin
fun main() {
//sampleStart
    val numberRegex = "\\d+".toRegex()
    println(numberRegex.matches("29"))
     
    val isNumber = numberRegex::matches
    println(isNumber("29"))
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

示例没有直接调用 `matches` **方法**，而是使用了对它的引用。这样的引用被**绑定**到其**接收者**。
它可以被直接调用（如上例所示），或者在预期**函数类型**表达式的任何时候使用：

```kotlin
fun main() {
//sampleStart
    val numberRegex = "\\d+".toRegex()
    val strings = listOf("abc", "124", "a70")
    println(strings.filter(numberRegex::matches))
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

比较**绑定**引用和非**绑定**引用的类型。
**绑定**的可调用引用将其**接收者**“附着”到自身，因此**接收者**的类型不再是**形参**：

```kotlin
val isNumber: (CharSequence) -> Boolean = numberRegex::matches

val matches: (Regex, CharSequence) -> Boolean = Regex::matches
```

属性引用也可以被**绑定**：

```kotlin
fun main() {
//sampleStart
    val prop = "abc"::length
    println(prop.get())
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

你无需将 `this` 指定为**接收者**：`this::foo` 和 `::foo` 是等价的。

### 绑定**构造函数**引用

对 [**内部类**](nested-classes.md#inner-classes) **构造函数**的**绑定**可调用引用可以通过提供外部类的实例来获取：

```kotlin
class Outer {
    inner class Inner
}

val o = Outer()
val boundInnerCtor = o::Inner