[//]: # (title: 类型检查与类型转换)

在 Kotlin 中，你可以在运行时对对象执行类型检查，以确定其类型。类型转换允许你将对象转换为不同的类型。

> 要专门了解**泛型**的类型检查和转换，例如 `List<T>`、`Map<K,V>`，请参阅 [泛型类型检查与转换](generics.md#generics-type-checks-and-casts)。
>
{style="tip"}

## is 和 !is 运算符

要执行运行时检查以确定对象是否符合给定类型，请使用 `is` 运算符或其取反形式 `!is`：

```kotlin
if (obj is String) {
    print(obj.length)
}

if (obj !is String) { // Same as !(obj is String)
    print("Not a String")
} else {
    print(obj.length)
}
```

## 智能转换 (Smart Casts)

在大多数情况下，你不需要使用显式转换运算符，因为编译器会自动为你转换对象。这被称为智能转换。编译器会跟踪不可变值的类型检查和[显式转换](#unsafe-cast-operator)，并在必要时自动插入隐式（安全）转换：

```kotlin
fun demo(x: Any) {
    if (x is String) {
        print(x.length) // x is automatically cast to String
    }
}
```

如果否定检查导致返回，编译器甚至足够智能，知道转换是安全的：

```kotlin
if (x !is String) return

print(x.length) // x is automatically cast to String
```

### 控制流

智能转换不仅适用于 `if` 条件表达式，还适用于 [`when` 表达式](control-flow.md#when-expressions-and-statements)和 [`while` 循环](control-flow.md#while-loops)：

```kotlin
when (x) {
    is Int -> print(x + 1)
    is String -> print(x.length + 1)
    is IntArray -> print(x.sum())
}
```

如果你在使用 `if`、`when` 或 `while` 条件之前声明了一个 `Boolean` 类型的变量，那么编译器收集到的关于该变量的任何信息都将在相应的代码块中进行智能转换时可访问。

当你想将布尔条件提取到变量中时，这会很有用。然后，你可以为变量指定一个有意义的名称，这将提高代码的可读性，并使其在代码中可以重复使用。例如：

```kotlin
class Cat {
    fun purr() {
        println("Purr purr")
    }
}

fun petAnimal(animal: Any) {
    val isCat = animal is Cat
    if (isCat) {
        // The compiler can access information about
        // isCat, so it knows that animal was smart-cast
        // to the type Cat.
        // Therefore, the purr() function can be called.
        animal.purr()
    }
}

fun main(){
    val kitty = Cat()
    petAnimal(kitty)
    // Purr purr
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="2.0" id="kotlin-smart-casts-local-variables" validate="false"}

### 逻辑运算符

如果 `&&` 或 `||` 运算符的左侧存在类型检查（常规或否定），编译器可以在其右侧执行智能转换：

```kotlin
// x is automatically cast to String on the right-hand side of `||`
if (x !is String || x.length == 0) return

// x is automatically cast to String on the right-hand side of `&&`
if (x is String && x.length > 0) {
    print(x.length) // x is automatically cast to String
}
```

如果你将对象的类型检查与 `or` 运算符 (`||`) 结合使用，则会对其最近的公共超类型进行智能转换：

```kotlin
interface Status {
    fun signal() {}
}

interface Ok : Status
interface Postponed : Status
interface Declined : Status

fun signalCheck(signalStatus: Any) {
    if (signalStatus is Postponed || signalStatus is Declined) {
        // signalStatus is smart-cast to a common supertype Status
        signalStatus.signal()
    }
}
```

> 公共超类型是[联合类型](https://en.wikipedia.org/wiki/Union_type)的**近似值**。Kotlin [目前不支持](https://youtrack.jetbrains.com/issue/KT-13108/Denotable-union-and-intersection-types)联合类型。
>
{style="note"}

### 内联函数

编译器可以智能转换传递给[内联函数](inline-functions.md)的 lambda 函数中捕获的变量。

内联函数被视为具有隐式 [`callsInPlace`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.contracts/-contract-builder/calls-in-place.html) 契约。这意味着传递给内联函数的任何 lambda 函数都会在原地调用。由于 lambda 函数是在原地调用的，编译器知道 lambda 函数不会泄露对其函数体中包含的任何变量的引用。

编译器利用这些知识以及其他分析来决定智能转换任何捕获的变量是否安全。例如：

```kotlin
interface Processor {
    fun process()
}

inline fun inlineAction(f: () -> Unit) = f()

fun nextProcessor(): Processor? = null

fun runProcessor(): Processor? {
    var processor: Processor? = null
    inlineAction {
        // The compiler knows that processor is a local variable and inlineAction()
        // is an inline function, so references to processor can't be leaked.
        // Therefore, it's safe to smart-cast processor.
      
        // If processor isn't null, processor is smart-cast
        if (processor != null) {
            // The compiler knows that processor isn't null, so no safe call 
            // is needed
            processor.process()
        }

        processor = nextProcessor()
    }

    return processor
}
```

### 异常处理

智能转换信息会传递到 `catch` 和 `finally` 块。这使得你的代码更安全，因为编译器会跟踪你的对象是否具有可空类型。例如：

```kotlin
//sampleStart
fun testString() {
    var stringInput: String? = null
    // stringInput is smart-cast to String type
    stringInput = ""
    try {
        // The compiler knows that stringInput isn't null
        println(stringInput.length)
        // 0

        // The compiler rejects previous smart cast information for 
        // stringInput. Now stringInput has the String? type.
        stringInput = null

        // Trigger an exception
        if (2 > 1) throw Exception()
        stringInput = ""
    } catch (exception: Exception) {
        // The compiler knows stringInput can be null
        // so stringInput stays nullable.
        println(stringInput?.length)
        // null
    }
}
//sampleEnd
fun main() {
    testString()
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="2.0" id="kotlin-smart-casts-exception-handling"}

### 智能转换的先决条件

> 请注意，智能转换仅在编译器能够保证变量在检查和使用之间不会改变时才起作用。
>
{style="warning"}

智能转换可在以下条件下使用：

<table style="none">
    <tr>
        <td>
            <code>val</code> 局部变量
        </td>
        <td>
            始终，但<a href="delegated-properties.md">局部委托属性</a>除外。
        </td>
    </tr>
    <tr>
        <td>
            <code>val</code> 属性
        </td>
        <td>
            如果属性是 <code>private</code>、<code>internal</code>，或者检查是在声明该属性的同一个<a href="visibility-modifiers.md#modules">模块</a>中执行的。智能转换不能用于 <code>open</code> 属性或具有自定义 getter 的属性。
        </td>
    </tr>
    <tr>
        <td>
            <code>var</code> 局部变量
        </td>
        <td>
            如果变量在检查和使用之间未被修改，未被修改它的 lambda 捕获，并且不是局部委托属性。
        </td>
    </tr>
    <tr>
        <td>
            <code>var</code> 属性
        </td>
        <td>
            从不，因为变量可以随时被其他代码修改。
        </td>
    </tr>
</table>

## “非安全”转换运算符

要将对象显式转换为非空类型，请使用*非安全*转换运算符 `as`：

```kotlin
val x: String = y as String
```

如果转换不可能，编译器会抛出异常。这就是它被称为“非安全”的原因。

在上面的示例中，如果 `y` 为 `null`，上述代码也会抛出异常。这是因为 `null` 不能转换为 `String`，因为 `String` 是[不可空](null-safety.md)的。要使此示例适用于可能为空的值，请在转换的右侧使用可空类型：

```kotlin
val x: String? = y as String?
```

## “安全”（可空）转换运算符

为了避免异常，请使用*安全*转换运算符 `as?`，它在失败时返回 `null`。

```kotlin
val x: String? = y as? String
```

请注意，尽管 `as?` 的右侧是非空类型 `String`，但转换结果是可空的。