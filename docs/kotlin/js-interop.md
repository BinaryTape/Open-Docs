---
title: "从 Kotlin 中使用 JavaScript 代码"
---
Kotlin 最初被设计为易于与 Java 平台互操作：它将 Java 类视为 Kotlin 类，而 Java 将 Kotlin 类视为 Java 类。

然而，JavaScript 是一种动态类型语言，这意味着它不会在编译时检查类型。你可以通过 [dynamic](dynamic-type) (动态类型) 类型从 Kotlin 自由地与 JavaScript 进行交互。如果你想使用 Kotlin 类型系统的全部功能，你可以为 JavaScript 库创建外部声明，这些声明将被 Kotlin 编译器和周围的工具所理解。

## 内联 JavaScript

你可以使用 [`js()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.js/js.html) 函数将 JavaScript 代码内联到 Kotlin 代码中。例如：

```kotlin
fun jsTypeOf(o: Any): String {
    return js("typeof o")
}
```

因为 `js` 的参数在编译时被解析并“原样”翻译成 JavaScript 代码，所以它必须是一个字符串常量。因此，以下代码是不正确的：

```kotlin
fun jsTypeOf(o: Any): String {
    return js(getTypeof() + " o") // error reported here
}

fun getTypeof() = "typeof"
```

:::note
由于 JavaScript 代码由 Kotlin 编译器解析，因此可能不支持所有 ECMAScript 功能。
在这种情况下，你可能会遇到编译错误。

:::

请注意，调用 `js()` 返回类型为 [`dynamic`](dynamic-type) 的结果，该类型在编译时不提供类型安全。

## external 修饰符

要告诉 Kotlin 某个声明是用纯 JavaScript 编写的，你应该用 `external` 修饰符标记它。
当编译器看到这样的声明时，它会假定相应类、函数或属性的实现是由外部提供的（由开发人员或通过 [npm 依赖项](js-project-setup#npm-dependencies)），
因此不会尝试从声明中生成任何 JavaScript 代码。这也是为什么 `external` 声明不能有主体的原因。例如：

```kotlin
external fun alert(message: Any?): Unit

external class Node {
    val firstChild: Node

    fun append(child: Node): Node

    fun removeChild(child: Node): Node

    // etc
}

external val window: Window
```

请注意，`external` 修饰符由嵌套声明继承。这就是为什么在 `Node` 类的示例中，成员函数和属性之前没有 `external` 修饰符。

`external` 修饰符仅允许在包级声明中使用。你不能声明一个非 `external` 类的 `external` 成员。

### 声明类的（静态）成员

在 JavaScript 中，你可以在原型或类本身上定义成员：

``` javascript
function MyClass() { ... }
MyClass.sharedMember = function() { /* implementation */ };
MyClass.prototype.ownMember = function() { /* implementation */ };
```

Kotlin 中没有这样的语法。但是，在 Kotlin 中，我们有 [`companion`](object-declarations#companion-objects) (伴生) 对象。Kotlin 以特殊的方式处理 `external` 类的伴生对象：它不是期望一个对象，
而是假定伴生对象的成员是类本身的成员。上面示例中的 `MyClass` 可以描述如下：

```kotlin
external class MyClass {
    companion object {
        fun sharedMember()
    }

    fun ownMember()
}
```

### 声明可选参数

如果你正在为具有可选参数的 JavaScript 函数编写外部声明，请使用 `definedExternally`。
这将默认值的生成委托给 JavaScript 函数本身：

```kotlin
external fun myFunWithOptionalArgs(
    x: Int,
    y: String = definedExternally,
    z: String = definedExternally
)
```

使用此外部声明，你可以使用一个必需参数和两个可选参数来调用 `myFunWithOptionalArgs`，
其中默认值由 `myFunWithOptionalArgs` 的 JavaScript 实现计算。

### 扩展 JavaScript 类

你可以像扩展 Kotlin 类一样轻松地扩展 JavaScript 类。只需定义一个 `external open` 类，
并用一个非 `external` 类扩展它。例如：

```kotlin
open external class Foo {
    open fun run()
    fun stop()
}

class Bar : Foo() {
    override fun run() {
        window.alert("Running!")
    }

    fun restart() {
        window.alert("Restarting")
    }
}
```

有一些限制：

- 当外部基类的函数被签名重载时，你不能在派生类中覆盖它。
- 你不能覆盖具有默认参数的函数。
- 非 external 类不能被 external 类扩展。

### external 接口

JavaScript 没有接口的概念。当一个函数期望它的参数支持两个方法 `foo`
和 `bar` 时，你只需传入一个实际具有这些方法的对象。

你可以使用接口在静态类型的 Kotlin 中表达这个概念：

```kotlin
external interface HasFooAndBar {
    fun foo()

    fun bar()
}

external fun myFunction(p: HasFooAndBar)
```

外部接口的典型用例是描述设置对象。例如：

```kotlin
external interface JQueryAjaxSettings {
    var async: Boolean

    var cache: Boolean

    var complete: (JQueryXHR, String) `->` Unit

    // etc
}

fun JQueryAjaxSettings(): JQueryAjaxSettings = js("{}")

external class JQuery {
    companion object {
        fun get(settings: JQueryAjaxSettings): JQueryXHR
    }
}

fun sendQuery() {
    JQuery.get(JQueryAjaxSettings().apply {
        complete = { (xhr, data) `->`
            window.alert("Request complete")
        }
    })
}
```

外部接口有一些限制：

- 它们不能在 `is` 检查的右侧使用。
- 它们不能作为具体化的类型参数传递。
- 它们不能在类字面量表达式中使用（例如 `I::class`）。
- 对外部接口的 `as` 转换总是成功的。
    转换为外部接口会产生“Unchecked cast to external interface”（未检查的转换为外部接口）编译时警告。可以使用 `@Suppress("UNCHECKED_CAST_TO_EXTERNAL_INTERFACE")` 注释来抑制该警告。

    IntelliJ IDEA 也可以自动生成 `@Suppress` 注释。通过灯泡图标或 Alt-Enter 打开意图菜单，然后单击“Unchecked cast to external interface”检查旁边的小箭头。在这里，你可以选择抑制范围，你的 IDE 会相应地将注释添加到你的文件中。

### 类型转换

除了 ["unsafe" cast operator](typecasts#unsafe-cast-operator) (不安全的转换运算符) `as` 之外，如果转换不可能，它会抛出 `ClassCastException`
异常，Kotlin/JS 还提供了 [`unsafeCast<T>()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.js/unsafe-cast.html)。当使用 `unsafeCast` 时，
在运行时_根本不进行类型检查_。例如，考虑以下两种方法：

```kotlin
fun usingUnsafeCast(s: Any) = s.unsafeCast<String>()
fun usingAsOperator(s: Any) = s as String
```

它们将被相应地编译：

```javascript
function usingUnsafeCast(s) {
    return s;
}

function usingAsOperator(s) {
    var tmp$;
    return typeof (tmp$ = s) === 'string' ? tmp$ : throwCCE();
}
```

## 相等性

与其他平台相比，Kotlin/JS 在相等性检查方面具有特殊的语义。

在 Kotlin/JS 中，Kotlin [referential equality](equality#referential-equality) (引用相等) 运算符 (`===`) 总是转换为 JavaScript
[strict equality](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Strict_equality) (严格相等) 运算符 (`===`)。

JavaScript `===` 运算符不仅检查两个值是否相等，还检查
这两个值的类型是否相等：

 ```kotlin
fun main() {
    val name = "kotlin"
    val value1 = name.substring(0, 1)
    val value2 = name.substring(0, 1)

    println(if (value1 === value2) "yes" else "no")
    // Prints 'yes' on Kotlin/JS
    // Prints 'no' on other platforms
}
 ```

此外，在 Kotlin/JS 中，[`Byte`, `Short`, `Int`, `Float`, 和 `Double`](js-to-kotlin-interop#kotlin-types-in-javascript) (字节型，短整型，整型，浮点型和双精度浮点型) 数字类型
在运行时都用 `Number` JavaScript 类型表示。因此，这五种类型的值是无法区分的：

 ```kotlin
fun main() {
    println(1.0 as Any === 1 as Any)
    // Prints 'true' on Kotlin/JS
    // Prints 'false' on other platforms
}
 ```

:::tip
有关 Kotlin 中相等性的更多信息，请参见 [Equality](equality) (相等性) 文档。

:::