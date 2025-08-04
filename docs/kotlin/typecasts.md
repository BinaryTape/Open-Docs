[//]: # (title: 类型检测与类型转换)

在 Kotlin 中，你可以在运行时对对象执行类型检测，以检测其类型。类型转换使你能够将对象转换为不同的类型。

> 关于**泛型**类型检测与类型转换，例如 `List<T>`、`Map<K,V>`，请参见[泛型类型检测与类型转换](generics.md#generics-type-checks-and-casts)。
>
{style="tip"}

## is 与 !is 操作符

要执行运行时检测，以判断对象是否符合给定类型，请使用 `is` 操作符或其否定形式 `!is`：

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

## 智能类型转换

在大多数情况下，你不需要使用显式类型转换操作符，因为编译器会自动为你进行对象类型转换。这被称为智能类型转换。编译器会跟踪不可变值的类型检测和[显式类型转换](#unsafe-cast-operator)，并在必要时自动插入隐式（安全）类型转换：

```kotlin
fun demo(x: Any) {
    if (x is String) {
        print(x.length) // x 被自动转换为 String
    }
}
```

如果一个否定检测导致返回，编译器甚至足够智能，能够识别这种类型转换是安全的：

```kotlin
if (x !is String) return

print(x.length) // x 被自动转换为 String
```

### 控制流

智能类型转换不仅适用于 `if` 条件表达式，也适用于[`when` 表达式](control-flow.md#when-expressions-and-statements)和[`while` 循环](control-flow.md#while-loops)：

```kotlin
when (x) {
    is Int -> print(x + 1)
    is String -> print(x.length + 1)
    is IntArray -> print(x.sum())
}
```

如果你在使用 `if`、`when` 或 `while` 条件之前声明了一个 `Boolean` 类型的变量，那么编译器收集到的关于该变量的任何信息都将在对应的代码块中可访问，用于智能类型转换。

当你希望将布尔条件提取到变量中时，这会很有用。然后，你可以给变量一个有意义的名称，这将提高你代码的可读性，并使其能够在代码中稍后重用。例如：

```kotlin
class Cat {
    fun purr() {
        println("Purr purr")
    }
}

fun petAnimal(animal: Any) {
    val isCat = animal is Cat
    if (isCat) {
        // 编译器可以访问关于
        // isCat 的信息，因此它知道 animal 被智能类型转换
        // 为 Cat 类型。
        // 因此，可以调用 purr() 函数。
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

### 逻辑操作符

如果 `&&` 或 `||` 操作符的左侧存在类型检测（常规或否定），编译器可以对右侧执行智能类型转换：

```kotlin
// x 被自动转换为 String，在 || 的右侧
if (x !is String || x.length == 0) return

// x 被自动转换为 String，在 && 的右侧
if (x is String && x.length > 0) {
    print(x.length) // x 被自动转换为 String
}
```

如果你使用 `or` 操作符（`||`）结合对象的类型检测，会进行智能类型转换到它们最近的公共超类型：

```kotlin
interface Status {
    fun signal() {}
}

interface Ok : Status
interface Postponed : Status
interface Declined : Status

fun signalCheck(signalStatus: Any) {
    if (signalStatus is Postponed || signalStatus is Declined) {
        // signalStatus 被智能类型转换到公共超类型 Status
        signalStatus.signal()
    }
}
```

> 公共超类型是[联合类型](https://en.wikipedia.org/wiki/Union_type)的**近似值**。Kotlin [目前不支持联合类型](https://youtrack.jetbrains.com/issue/KT-13108/Denotable-union-and-intersection-types)。
>
{style="note"}

### 内联函数

编译器可以智能类型转换传递给[内联函数](inline-functions.md)的 lambda 表达式中捕获的变量。

内联函数被视为具有隐式 `callsInPlace` 契约。这意味着传递给内联函数的任何 lambda 表达式都会在原地被调用。由于 lambda 表达式是在原地调用的，编译器知道 lambda 表达式不能泄露对其函数体中包含的任何变量的引用。

编译器利用此知识，结合其他分析，来决定是否可以安全地智能类型转换任何捕获的变量。例如：

```kotlin
interface Processor {
    fun process()
}

inline fun inlineAction(f: () -> Unit) = f()

fun nextProcessor(): Processor? = null

fun runProcessor(): Processor? {
    var processor: Processor? = null
    inlineAction {
        // 编译器知道 processor 是一个局部变量，并且 inlineAction()
        // 是一个内联函数，因此 processor 的引用不会泄露。
        // 因此，可以安全地对 processor 进行智能类型转换。

        // 如果 processor 非空，则 processor 被智能类型转换
        if (processor != null) {
            // 编译器知道 processor 非空，因此不需要安全调用
            processor.process()
        }

        processor = nextProcessor()
    }

    return processor
}
```

### 异常处理

智能类型转换信息会传递到 `catch` 和 `finally` 代码块。这使得你的代码更安全，因为编译器会跟踪你的对象是否具有可空类型。例如：

```kotlin
//sampleStart
fun testString() {
    var stringInput: String? = null
    // stringInput 被智能类型转换为 String 类型
    stringInput = ""
    try {
        // 编译器知道 stringInput 非空
        println(stringInput.length)
        // 0

        // 编译器会拒绝之前关于
        // stringInput 的智能类型转换信息。现在 stringInput 的类型为 String?。
        stringInput = null

        // 触发一个异常
        if (2 > 1) throw Exception()
        stringInput = ""
    } catch (exception: Exception) {
        // 编译器知道 stringInput 可以为空
        // 因此 stringInput 保持可空。
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

### 智能类型转换先决条件

> 请注意，智能类型转换仅在编译器可以保证变量在检测及其使用之间不会改变时才有效。
>
{style="warning"}

智能类型转换可以在以下条件下使用：

<table style="none">
    <tr>
        <td>
            <code>val</code> 局部变量
        </td>
        <td>
            始终，除了 <a href="delegated-properties.md">局部委托属性</a>。
        </td>
    </tr>
    <tr>
        <td>
            <code>val</code> 属性
        </td>
        <td>
            如果属性是 <code>private</code>、<code>internal</code>，或者如果检测是在属性声明的同一个 <a href="visibility-modifiers.md#modules">模块</a>中执行的。智能类型转换不能用于 <code>open</code> 属性或具有自定义 getter 的属性。
        </td>
    </tr>
    <tr>
        <td>
            <code>var</code> 局部变量
        </td>
        <td>
            如果变量在检测及其使用之间没有被修改，没有在修改它的 lambda 表达式中被捕获，并且不是局部委托属性。
        </td>
    </tr>
    <tr>
        <td>
            <code>var</code> 属性
        </td>
        <td>
            绝不，因为变量随时可能被其他代码修改。
        </td>
    </tr>
</table>

## “不安全”类型转换操作符

要将对象显式类型转换为非空类型，请使用*不安全*类型转换操作符 `as`：

```kotlin
val x: String = y as String
```

如果类型转换不可能，编译器会抛出异常。这就是它被称为*不安全*的原因。

在前面的示例中，如果 `y` 是 `null`，上述代码也会抛出异常。这是因为 `null` 不能转换为 `String`，因为 `String` 是非空的。为了使示例适用于可能为空的值，请在类型转换的右侧使用可空类型：

```kotlin
val x: String? = y as String?
```

## “安全”（可空）类型转换操作符

为了避免异常，请使用*安全*类型转换操作符 `as?`，它在失败时返回 `null`。

```kotlin
val x: String? = y as? String
```

请注意，尽管 `as?` 的右侧是非空类型 `String`，但类型转换的结果是可空的。