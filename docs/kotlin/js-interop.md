[//]: # (title: 从 Kotlin 使用 JavaScript 代码)

Kotlin 最初设计为易于与 Java 平台互操作：它将 Java 类视为 Kotlin 类，而 Java 则将 Kotlin 类视为 Java 类。

然而，JavaScript 是一种动态类型语言，这意味着它不会在编译时检查类型。你可以通过 [dynamic](dynamic-type.md) 类型从 Kotlin 自由地与 JavaScript 通信。如果你想充分利用 Kotlin 类型系统的强大功能，可以为 JavaScript 库创建外部声明，这些声明将被 Kotlin 编译器和相关工具链理解。

## 内联 JavaScript

你可以使用 [`js()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.js/js.html) 函数将 JavaScript 代码内联到你的 Kotlin 代码中。例如：

```kotlin
fun jsTypeOf(o: Any): String {
    return js("typeof o")
}
```

由于 `js` 的参数在编译时被解析并“原样”转换为 JavaScript 代码，因此它必须是一个字符串常量。所以，下面的代码是不正确的：

```kotlin
fun jsTypeOf(o: Any): String {
    return js(getTypeof() + " o") // error reported here
}

fun getTypeof() = "typeof"
```

> 由于 JavaScript 代码由 Kotlin 编译器解析，并非所有 ECMAScript 特性都可能受支持。
> 在这种情况下，你可能会遇到编译错误。
>
{style="note"}

请注意，调用 `js()` 会返回 [`dynamic`](dynamic-type.md) 类型的结果，这在编译时不提供任何类型安全。

## `external` 修饰符

为了告诉 Kotlin 某个声明是用纯 JavaScript 编写的，你应该用 `external` 修饰符标记它。当编译器看到这样的声明时，它会假定相应类、函数或属性的实现是由外部（由开发者或通过 [npm 依赖](js-project-setup.md#npm-dependencies)）提供的，因此不会尝试从该声明生成任何 JavaScript 代码。这也是为什么 `external` 声明不能有函数体的原因。例如：

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

请注意，`external` 修饰符会被嵌套声明继承。这就是为什么在 `Node` 类的示例中，成员函数和属性前没有 `external` 修饰符。

`external` 修饰符只允许用于包级声明。你不能声明非 `external` 类的 `external` 成员。

### 声明类的（静态）成员

在 JavaScript 中，你可以在原型或类本身上定义成员：

``` javascript
function MyClass() { ... }
MyClass.sharedMember = function() { /* implementation */ };
MyClass.prototype.ownMember = function() { /* implementation */ };
```

Kotlin 中没有这种语法。然而，在 Kotlin 中我们有 [`companion`](object-declarations.md#companion-objects) 对象。Kotlin 以特殊方式对待 `external` 类的伴生对象：它不期望一个对象，而是假定伴生对象的成员是类本身的成员。上述示例中的 `MyClass` 可以描述如下：

```kotlin
external class MyClass {
    companion object {
        fun sharedMember()
    }

    fun ownMember()
}
```

### 声明可选参数

如果你正在为具有可选参数的 JavaScript 函数编写外部声明，请使用 `definedExternally`。这将默认值的生成委托给 JavaScript 函数本身：

```kotlin
external fun myFunWithOptionalArgs(
    x: Int,
    y: String = definedExternally,
    z: String = definedExternally
)
```

有了这个外部声明，你可以使用一个必选参数和两个可选参数调用 `myFunWithOptionalArgs`，其中默认值由 `myFunWithOptionalArgs` 的 JavaScript 实现计算。

### 扩展 JavaScript 类

你可以像扩展 Kotlin 类一样轻松扩展 JavaScript 类。只需定义一个 `external open` 类并通过非 `external` 类扩展它。例如：

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

- 当外部基类的函数因签名而重载时，你不能在派生类中覆盖它。
- 你不能用默认参数覆盖函数。
- 非外部类不能被外部类扩展。

### 外部接口

JavaScript 没有接口的概念。当一个函数期望其参数支持两个方法 `foo` 和 `bar` 时，你只需传入一个实际拥有这些方法的对象即可。

你可以在静态类型化的 Kotlin 中使用接口来表达这个概念：

```kotlin
external interface HasFooAndBar {
    fun foo()

    fun bar()
}

external fun myFunction(p: HasFooAndBar)
```

外部接口的一个典型用例是描述设置对象。例如：

```kotlin
external interface JQueryAjaxSettings {
    var async: Boolean

    var cache: Boolean

    var complete: (JQueryXHR, String) -> Unit

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
        complete = { (xhr, data) ->
            window.alert("Request complete")
        }
    })
}
```

外部接口有一些限制：

- 它们不能用作 `is` 检查的右侧。
- 它们不能作为实化类型参数传递。
- 它们不能用于类字面量表达式（例如 `I::class`）。
- `as` 到外部接口的类型转换总是成功。
    转换为外部接口会产生“未检查的外部接口类型转换”编译时警告。可以使用 `@Suppress("UNCHECKED_CAST_TO_EXTERNAL_INTERFACE")` 注解来抑制此警告。

    IntelliJ IDEA 也可以自动生成 `@Suppress` 注解。通过小灯泡图标或 Alt-Enter 打开意图菜单，然后点击“未检查的外部接口类型转换”检查旁边的小箭头。在这里，你可以选择抑制范围，你的 IDE 将相应地将注解添加到你的文件中。

### 类型转换

除了在类型转换不可能时会抛出 `ClassCastException` 的“不安全”类型转换运算符 `as` 之外，Kotlin/JS 还提供了 [`unsafeCast<T>()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.js/unsafe-cast.html)。在使用 `unsafeCast` 时，运行时**根本不进行任何类型检查**。例如，考虑以下两个方法：

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

在 Kotlin/JS 中，Kotlin [引用相等性](equality.md#referential-equality)运算符 (`===`) 总是转换为 JavaScript [严格相等性](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Strict_equality)运算符 (`===`)。

JavaScript 的 `===` 运算符不仅检查两个值是否相等，还检查这两个值的类型是否相等：

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

此外，在 Kotlin/JS 中，[`Byte`、`Short`、`Int`、`Float` 和 `Double`](js-to-kotlin-interop.md#kotlin-types-in-javascript) 数值类型在运行时都用 `Number` JavaScript 类型表示。因此，这五种类型的值是无法区分的：

 ```kotlin
fun main() {
    println(1.0 as Any === 1 as Any)
    // 在 Kotlin/JS 上打印 'true'
    // 在其他平台上打印 'false'
}
 ```

> 有关 Kotlin 中相等性的更多信息，请参阅[相等性](equality.md)文档。
>
{style="tip"}