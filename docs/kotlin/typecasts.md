---
title: 类型检查与转换
---
在 Kotlin 中，你可以执行类型检查，以在运行时检查对象的类型。类型转换使你可以将对象转换为不同的类型。

:::note
要专门了解关于 **泛型（generics）** 类型检查和转换，例如 `List<T>`、`Map<K,V>`，请参阅 [泛型类型检查和转换(Generics type checks and casts)](generics#generics-type-checks-and-casts)。

## is 和 !is 操作符

要执行运行时检查，以确定对象是否符合给定的类型，请使用 `is` 操作符或其否定形式 `!is`：

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

## 智能转换（Smart casts）

在大多数情况下，你不需要使用显式转换操作符，因为编译器会自动为你转换对象。这称为智能转换（smart-casting）。编译器会跟踪不可变值的类型检查和[显式转换](#unsafe-cast-operator)，并在必要时自动插入隐式（安全）转换：

```kotlin
fun demo(x: Any) {
    if (x is String) {
        print(x.length) // x is automatically cast to String
    }
}
```

如果否定检查导致返回，编译器甚至足够智能地知道转换是安全的：

```kotlin
if (x !is String) return

print(x.length) // x is automatically cast to String
```

### 控制流（Control flow）

智能转换不仅适用于 `if` 条件表达式，还适用于 [`when` 表达式](control-flow#when-expressions-and-statements) 和 [`while` 循环](control-flow#while-loops)：

```kotlin
when (x) {
    is Int `->` print(x + 1)
    is String `->` print(x.length + 1)
    is IntArray `->` print(x.sum())
}
```

如果在 `if`、`when` 或 `while` 条件中使用变量之前声明了该变量的 `Boolean` 类型，那么编译器收集的关于该变量的任何信息都可以在相应的代码块中访问，以进行智能转换。

当你想要做一些事情，比如将布尔条件提取到变量中时，这会很有用。然后，你可以给变量一个有意义的名称，这将提高代码的可读性，并使以后在代码中重用该变量成为可能。例如：

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

### 逻辑操作符（Logical operators）

如果左侧有类型检查（常规或否定），编译器可以在 `&&` 或 `||` 操作符的右侧执行智能转换：

```kotlin
// x is automatically cast to String on the right-hand side of `||`
if (x !is String || x.length == 0) return

// x is automatically cast to String on the right-hand side of `&&`
if (x is String && x.length > 0) {
    print(x.length) // x is automatically cast to String
}
```

如果将对象的类型检查与 `or` 操作符 (`||`) 组合在一起，则会对它们最接近的公共超类型进行智能转换：

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

公共超类型是 [联合类型（union type）](https://en.wikipedia.org/wiki/Union_type) 的**近似值**。Kotlin 目前[不支持联合类型](https://youtrack.jetbrains.com/issue/KT-13108/Denotable-union-and-intersection-types)。

:::

### 内联函数（Inline functions）

编译器可以对捕获在传递给[内联函数](inline-functions)的 lambda 函数中的变量执行智能转换。

内联函数被视为具有隐式的 [`callsInPlace`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.contracts/-contract-builder/calls-in-place.html) 契约（contract）。这意味着传递给内联函数的任何 lambda 函数都会在原地调用。由于 lambda 函数是在原地调用的，因此编译器知道 lambda 函数无法泄漏对其函数体中包含的任何变量的引用。

编译器使用这些知识以及其他分析来决定是否可以安全地对任何捕获的变量进行智能转换。例如：

```kotlin
interface Processor {
    fun process()
}

inline fun inlineAction(f: () `->` Unit) = f()

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

### 异常处理（Exception handling）

智能转换信息会传递到 `catch` 和 `finally` 代码块。这使你的代码更安全，因为编译器会跟踪你的对象是否具有可空类型（nullable type）。例如：

```kotlin

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

fun main() {
    testString()
}
```

### 智能转换的先决条件（Smart cast prerequisites）

:::caution
请注意，只有当编译器可以保证变量在检查和使用之间不会更改时，智能转换才有效。

:::

智能转换可以在以下条件下使用：

<table >
<tr>
<td>

            `val` 局部变量
</td>
<td>

            总是，除了 <a href="delegated-properties">局部委托属性（local delegated properties）</a>。
</td>
</tr>
<tr>
<td>

            `val` 属性
</td>
<td>

            如果属性是 `private`、`internal`，或者检查在声明属性的同一<a href="visibility-modifiers#modules">模块（module）</a>中执行。智能转换不能用于 `open` 属性或具有自定义 getter 的属性。
</td>
</tr>
<tr>
<td>

            `var` 局部变量
</td>
<td>

            如果变量在检查和使用之间没有被修改，没有在修改它的 lambda 中捕获，并且不是局部委托属性。
</td>
</tr>
<tr>
<td>

            `var` 属性
</td>
<td>

            永远不行，因为变量可以随时被其他代码修改。
</td>
</tr>
</table>

## "不安全" 转换操作符（"Unsafe" cast operator）

要将对象显式转换为非空类型（non-nullable type），请使用*不安全*的转换操作符 `as`：

```kotlin
val x: String = y as String
```

如果无法进行转换，编译器将抛出异常。这就是它被称为_不安全_的原因。

在前面的示例中，如果 `y` 是 `null`，则上面的代码也会抛出异常。这是因为 `null` 不能转换为 `String`，因为 `String` 不是[可空的（nullable）](null-safety)。要使该示例适用于可能为 null 的值，请在转换的右侧使用可空类型：

```kotlin
val x: String? = y as String?
```

## "安全"（可空）转换操作符（"Safe" (nullable) cast operator）

要避免异常，请使用*安全*的转换操作符 `as?`，该操作符在失败时返回 `null`。

```kotlin
val x: String? = y as? String
```

请注意，尽管 `as?` 的右侧是非空类型 `String`，但转换的结果是可空的。