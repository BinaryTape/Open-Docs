[//]: # (title: 在 JavaScript 中使用 Kotlin 代码)

根据所选的 [JavaScript Module](js-modules.md) 系统，Kotlin/JS 编译器会生成不同的输出。但通常情况下，Kotlin 编译器会生成正常的 JavaScript 类、函数和属性，你可以从 JavaScript 代码中自由使用它们。不过，有些微妙之处你需要记住。

## plain 模式下在单独的 JavaScript 对象中隔离声明

如果你已将模块类型显式设置为 `plain`，Kotlin 会创建一个对象，其中包含当前模块的所有 Kotlin 声明。这样做是为了防止污染全局对象。这意味着对于 `myModule` 模块，所有声明都可以通过 `myModule` 对象在 JavaScript 中访问。例如：

```kotlin
fun foo() = "Hello"
```

可以像这样从 JavaScript 中调用：

```javascript
alert(myModule.foo());
```

当你将 Kotlin 模块编译为 UMD（`browser` 和 `nodejs` 目标平台的默认设置）、CommonJS 或 AMD 等 JavaScript 模块时，此规则不适用。在这种情况下，你的声明将以你所选的 JavaScript 模块系统指定的格式暴露。例如，当使用 UMD 或 CommonJS 时，你的调用处可能如下所示：

```javascript
alert(require('myModule').foo());
```

关于 JavaScript 模块系统的主题，请参见 [JavaScript Modules](js-modules.md) 一文以获取更多信息。

## 包结构

Kotlin 将其包结构暴露给 JavaScript，因此除非你在根包中定义声明，否则你必须在 JavaScript 中使用完全限定名。例如：

```kotlin
package my.qualified.packagename

fun foo() = "Hello"
```

例如，当使用 UMD 或 CommonJS 时，你的调用处可能如下所示：

```javascript
alert(require('myModule').my.qualified.packagename.foo())
```

或者，在将 `plain` 用作模块系统设置的情况下：

```javascript
alert(myModule.my.qualified.packagename.foo());
```

### @JsName 注解

在某些情况下（例如，为了支持重载），Kotlin 编译器会修饰生成到 JavaScript 代码中的函数和属性的名称。要控制生成的名称，你可以使用 `@JsName` 注解：

```kotlin
// Module 'kjs'
class Person(val name: String) {
    fun hello() {
        println("Hello $name!")
    }

    @JsName("helloWithGreeting")
    fun hello(greeting: String) {
        println("$greeting $name!")
    }
}
```

现在你可以通过以下方式从 JavaScript 中使用此类别：

```javascript
// If necessary, import 'kjs' according to chosen module system
var person = new kjs.Person("Dmitry");   // refers to module 'kjs'
person.hello();                          // prints "Hello Dmitry!"
person.helloWithGreeting("Servus");      // prints "Servus Dmitry!"
```

如果我们没有指定 `@JsName` 注解，则对应函数的名称将包含根据函数签名计算出的后缀，例如 `hello_61zpoe`。

请注意，在某些情况下 Kotlin 编译器不会进行名字修饰：
- `external` 声明不会被修饰。
- 继承自 `external` 类的非 `external` 类中的任何覆盖函数都不会被修饰。

`@JsName` 的形参必须是常量字符串字面量，且该字面量必须是有效的标识符。编译器会报告任何尝试向 `@JsName` 传递非标识符字符串的错误。以下示例会产生编译期错误：

```kotlin
@JsName("new C()")   // error here
external fun newC()
```

### @JsExport 注解

> 这是一个[实验性的](components-stability.md#stability-levels-explained)特性。
> 其设计在未来版本中可能会改变。
>
{style="warning"} 

通过将 `@JsExport` 注解应用于顶层声明（例如类或函数），你可以使 Kotlin 声明在 JavaScript 中可用。该注解会导出所有嵌套声明，并使用在 Kotlin 中给定的名称。它也可以使用 `@file:JsExport` 在文件级别应用。

为了解决导出中的歧义（例如同名函数的重载），你可以将 `@JsExport` 注解与 `@JsName` 结合使用，以指定生成和导出的函数的名称。

在当前的 [IR 编译器后端](js-ir-compiler.md)中，`@JsExport` 注解是使你的函数在 JavaScript 中可见的唯一方式。

对于多平台项目，`@JsExport` 在公共代码中也可用。它仅在编译面向 JavaScript 目标平台时生效，并允许你导出非平台特有的 Kotlin 声明。

### @JsStatic

> 这是一个[实验性的](components-stability.md#stability-levels-explained)特性。它可能随时被弃用或更改。
> 仅将其用于求值目的。如果你对此有任何反馈，请在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-18891/JS-provide-a-way-to-declare-static-members-JsStatic) 中提出，我们将不胜感激。
>
{style="warning"}

`@JsStatic` 注解指示编译器为目标声明生成额外的静态方法。这有助于你直接在 JavaScript 中使用 Kotlin 代码中的静态成员。

你可以将 `@JsStatic` 注解应用于在具名对象中定义的函数，以及在类和接口内部声明的伴生对象中的函数。如果你使用此注解，编译器将既生成该对象的静态方法，也会生成该对象本身的实例方法。例如：

```kotlin
// Kotlin
class C {
    companion object {
        @JsStatic
        fun callStatic() {}
        fun callNonStatic() {}
    }
}
```

现在，`callStatic()` 函数在 JavaScript 中是静态的，而 `callNonStatic()` 函数则不是：

```javascript
// JavaScript
C.callStatic();              // Works, accessing the static function
C.callNonStatic();           // Error, not a static function in the generated JavaScript
C.Companion.callStatic();    // Instance method remains
C.Companion.callNonStatic(); // The only way it works
```

还可以将 `@JsStatic` 注解应用于对象或伴生对象的属性，使其 getter 和 setter 方法成为该对象或包含伴生对象的类中的静态成员。

## JavaScript 中的 Kotlin 类型

请查看 Kotlin 类型如何映射到 JavaScript 类型：

| Kotlin                                                           | JavaScript                | Comments                                                                                   |
|------------------------------------------------------------------|---------------------------|--------------------------------------------------------------------------------------------|
| `Byte`, `Short`, `Int`, `Float`, `Double`                        | `Number`                  |                                                                                            |
| `Char`                                                           | `Number`                  | 数字表示字符的代码。                                                |
| `Long`                                                           | Not supported             | JavaScript 中没有 64 位整型数字类型，因此它由 Kotlin 类模拟。 |
| `Boolean`                                                        | `Boolean`                 |                                                                                            |
| `String`                                                         | `String`                  |                                                                                            |
| `Array`                                                          | `Array`                   |                                                                                            |
| `ByteArray`                                                      | `Int8Array`               |                                                                                            |
| `ShortArray`                                                     | `Int16Array`              |                                                                                            |
| `IntArray`                                                       | `Int32Array`              |                                                                                            |
| `CharArray`                                                      | `UInt16Array`             | 带有属性 `$type$ == "CharArray"`。                                              |
| `FloatArray`                                                     | `Float32Array`            |                                                                                            |
| `DoubleArray`                                                    | `Float64Array`            |                                                                                            |
| `LongArray`                                                      | `Array<kotlin.Long>`      | 带有属性 `$type$ == "LongArray"`。另请参见 Kotlin 的 `Long` 类型注释。         |
| `BooleanArray`                                                   | `Int8Array`               | 带有属性 `$type$ == "BooleanArray"`。                                           |
| `List`, `MutableList`                                            | `KtList`, `KtMutableList` | 通过 `KtList.asJsReadonlyArrayView` 或 `KtMutableList.asJsArrayView` 暴露一个 `Array`。    |
| `Map`, `MutableMap`                                              | `KtMap`, `KtMutableMap`   | 通过 `KtMap.asJsReadonlyMapView` 或 `KtMutableMap.asJsMapView` 暴露一个 ES2015 `Map`。     |
| `Set`, `MutableSet`                                              | `KtSet`, `KtMutableSet`   | 通过 `KtSet.asJsReadonlySetView` 或 `KtMutableSet.asJsSetView` 暴露一个 ES2015 `Set`。     |
| `Unit`                                                           | Undefined                 | 当用作返回类型时可导出，但当用作形参类型时不可导出。                  |
| `Any`                                                            | `Object`                  |                                                                                            |
| `Throwable`                                                      | `Error`                   |                                                                                            |
| `enum class Type`                                                | `Type`                    | 枚举条目以静态类属性的形式暴露（`Type.ENTRY`）。                        |
| Nullable `Type?`                                                 | `Type | null | undefined` |                                                                                            |
| All other Kotlin types, except for those marked with `@JsExport` | Not supported             | 包括 Kotlin 的[无符号整型](unsigned-integer-types.md)。                     |

此外，重要的是要了解：

*   Kotlin 为 `kotlin.Int`、`kotlin.Byte`、`kotlin.Short`、`kotlin.Char` 和 `kotlin.Long` 保留溢出语义。
*   Kotlin 在运行时无法区分数值类型（`kotlin.Long` 除外），因此以下代码有效：

    ```kotlin
    fun f() {
        val x: Int = 23
        val y: Any = x
        println(y as Float)
    }
    ```

*   Kotlin 在 JavaScript 中保留惰性对象初始化。
*   Kotlin 不在 JavaScript 中实现顶层属性的惰性初始化。