[//]: # (title: 从 Kotlin 调用 JavaScript 代码)

Kotlin 最初设计时旨在与 Java 平台轻松互操作：它将 Java 类视为 Kotlin 类，Java 则将 Kotlin 类视为 Java 类。

然而，JavaScript 是一种动态类型语言，这意味着它不会在编译期检测类型。你可以通过 [dynamic](dynamic-type.md) 类型从 Kotlin 自由地与 JavaScript 交互。如果你想充分利用 Kotlin 类型系统的全部能力，可以为 JavaScript 库创建外部声明，这些声明将被 Kotlin 编译器和周边工具链理解。

## 内联 JavaScript

你可以使用 [`js()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.js/js.html) 函数将 JavaScript 代码内联到你的 Kotlin 代码中。例如：

```kotlin
fun jsTypeOf(o: Any): String {
    return js("typeof o")
}
```

因为 `js` 的参数在编译期解析并“原样”翻译为 JavaScript 代码，所以它必须是字符串常量。因此，以下代码不正确：

```kotlin
fun jsTypeOf(o: Any): String {
    return js(getTypeof() + " o") // 此处报告错误
}

fun getTypeof() = "typeof"
```

> 由于 JavaScript 代码由 Kotlin 编译器解析，因此并非所有 ECMAScript 特性都可能被支持。在这种情况下，你可能会遇到编译错误。
>
{style="note"}

请注意，调用 `js()` 会返回 [`dynamic`](dynamic-type.md) 类型的结果，这在编译期不提供类型安全。

## external 修饰符

为了告诉 Kotlin 某个声明是用纯 JavaScript 编写的，你应该用 `external` 修饰符标记它。当编译器看到这样的声明时，它会假定相应的类、函数或属性的实现由外部提供（由开发者或通过 [npm 依赖项](js-project-setup.md#npm-dependencies)），因此不会尝试从该声明生成任何 JavaScript 代码。这也是 `external` 声明不能有函数体的原因。例如：

```kotlin
external fun alert(message: Any?): Unit

external class Node {
    val firstChild: Node

    fun append(child: Node): Node

    fun removeChild(child: Node): Node

    // 等等
}

external val window: Window
```

请注意，`external` 修饰符会被嵌套声明继承。这就是为什么在示例 `Node` 类中，成员函数和属性前面没有 `external` 修饰符的原因。

`external` 修饰符仅允许用于包级声明。你不能在一个非 `external` 类中声明 `external` 成员。

### 声明类的（静态）成员

在 JavaScript 中，你可以在原型上或类本身上定义成员：

```javascript
function MyClass() { ... }
MyClass.sharedMember = function() { /* 实现 */ };
MyClass.prototype.ownMember = function() { /* 实现 */ };
```

Kotlin 中没有这样的语法。然而，在 Kotlin 中我们有 [`companion`](object-declarations.md#companion-objects) 对象。Kotlin 以特殊方式处理 `external` 类的伴生对象：它不期望一个对象，而是假定伴生对象的成员就是类本身的成员。上述示例中的 `MyClass` 可以描述如下：

```kotlin
external class MyClass {
    companion object {
        fun sharedMember()
    }

    fun ownMember()
}
```

### 声明带默认值的形参

如果你正在为带默认值的 JavaScript 函数编写外部声明，请使用 `definedExternally`。这会将默认值的生成委托给 JavaScript 函数本身：

```kotlin
external fun myFunWithOptionalArgs(
    x: Int,
    y: String = definedExternally,
    z: String = definedExternally
)
```

有了这个外部声明，你可以使用一个必需实参和两个可选实参调用 `myFunWithOptionalArgs`，其中默认值由 `myFunWithOptionalArgs` 的 JavaScript 实现计算。

### 扩展 JavaScript 类

你可以轻松扩展 JavaScript 类，如同它们是 Kotlin 类一样。只需定义一个 `external open` 类，然后用一个非 `external` 类扩展它。例如：

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

存在一些限制：

- 当外部基类的函数通过签名重载时，你不能在派生类中覆盖它。
- 你不能覆盖包含带默认值形参的函数。
- 非 `external` 类不能被 `external` 类扩展。

### external 接口

JavaScript 没有接口的概念。当一个函数期望其形参支持 `foo` 和 `bar` 这两个方法时，你只需传入一个实际拥有这些方法的对象。

你可以使用接口在静态类型 Kotlin 中表达这个概念：

```kotlin
external interface HasFooAndBar {
    fun foo()

    fun bar()
}

external fun myFunction(p: HasFooAndBar)
```

external 接口的一个典型用例是描述设置对象。例如：

```kotlin
external interface JQueryAjaxSettings {
    var async: Boolean

    var cache: Boolean

    var complete: (JQueryXHR, String) -> Unit

    // 等等
}

fun JQueryAjaxSettings(): JQueryAjaxSettings = js("{}")

external class JQuery {
    companion object {
        fun get(settings: JQueryAjaxSettings): JQueryXHR
    }
}

fun sendQuery() {
    JQuery.get(JQueryAjaxSettings().apply {
        complete = { (xhr, data) ->
            window.alert("Request complete")
        }
    })
}
```

external 接口有一些限制：

- 它们不能用于 `is` 检测的右侧。
- 它们不能作为实化类型实参传递。
- 它们不能用于类字面量表达式（例如 `I::class`）。
- `as` 到 external 接口的类型转换总是成功。
- 转换到 external 接口会产生“Unchecked cast to external interface”（未经检测的类型转换到 external 接口）编译期警告。该警告可以使用 `@Suppress("UNCHECKED_CAST_TO_EXTERNAL_INTERFACE")` 注解抑制。
- IntelliJ IDEA 也可以自动生成 `@Suppress` 注解。通过灯泡图标或 Alt-Enter 键打开意图菜单，然后点击“Unchecked cast to external interface”检查旁边的小箭头。在此处，你可以选择抑制范围，你的 IDE 将相应地将注解添加到文件中。

### 类型转换

除了会抛出 `ClassCastException` 的“不安全”类型转换操作符 `as`（如果无法进行类型转换），Kotlin/JS 还提供了 [`unsafeCast<T>()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.js/unsafe-cast.html)。使用 `unsafeCast` 时，在运行时_完全不进行任何类型检测_。例如，考虑以下两种方法：

```kotlin
fun usingUnsafeCast(s: Any) = s.unsafeCast<String>()
fun usingAsOperator(s: Any) = s as String
```

它们将相应地被编译：

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

Kotlin/JS 相较于其他平台在相等性检测方面具有特定的语义。

在 Kotlin/JS 中，Kotlin 的 [引用相等性](equality.md#referential-equality) 操作符 (`===`) 总是翻译为 JavaScript 的 [严格相等性](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Strict_equality) 操作符 (`===`)。

JavaScript 的 `===` 操作符不仅检测两个值是否相等，而且还检测这两个值的类型是否相等：

 ```kotlin
fun main() {
    val name = "kotlin"
    val value1 = name.substring(0, 1)
    val value2 = name.substring(0, 1)

    println(if (value1 === value2) "yes" else "no")
    // 在 Kotlin/JS 上打印 'yes'
    // 在其他平台上打印 'no'
}
 ```

此外，在 Kotlin/JS 中，[`Byte`、`Short`、`Int`、`Float` 和 `Double`](js-to-kotlin-interop.md#kotlin-types-in-javascript) 这五种数字类型在运行时都由 JavaScript 的 `Number` 类型表示。因此，这五种类型的值无法区分：

 ```kotlin
fun main() {
    println(1.0 as Any === 1 as Any)
    // 在 Kotlin/JS 上打印 'true'
    // 在其他平台上打印 'false'
}
 ```

> 关于 Kotlin 中相等性的更多信息，请参见 [相等性](equality.md) 文档。
>
{style="tip"}