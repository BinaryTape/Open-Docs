---
title: "从 JavaScript 中使用 Kotlin 代码"
---
根据选择的 [JavaScript 模块](js-modules)系统，Kotlin/JS 编译器会生成不同的输出。但通常情况下，Kotlin 编译器会生成普通的 JavaScript 类、函数和属性，你可以自由地从 JavaScript 代码中使用它们。不过，有一些微妙之处你应该记住。

## 在普通模式下将声明隔离到单独的 JavaScript 对象中

如果你已显式地将模块类型设置为 `plain`，Kotlin 会创建一个对象，其中包含当前模块中的所有 Kotlin 声明。这样做是为了防止污染全局对象。这意味着对于模块 `myModule`，所有声明都可以通过 `myModule` 对象供 JavaScript 使用。例如：

```kotlin
fun foo() = "Hello"
```

可以像这样从 JavaScript 中调用：

```javascript
alert(myModule.foo());
```

当你将 Kotlin 模块编译为 JavaScript 模块（如 UMD，这是 `browser` 和 `nodejs` 目标的默认设置）、CommonJS 或 AMD 时，这不适用。在这种情况下，你的声明将以你选择的 JavaScript 模块系统指定的格式公开。例如，当使用 UMD 或 CommonJS 时，你的调用站点可能如下所示：

```javascript
alert(require('myModule').foo());
```

请查看关于 [JavaScript 模块](js-modules)的文章，以获取有关 JavaScript 模块系统主题的更多信息。

## 包结构

Kotlin 将其包结构暴露给 JavaScript，因此除非你在根包中定义声明，否则必须在 JavaScript 中使用完全限定的名称。例如：

```kotlin
package my.qualified.packagename

fun foo() = "Hello"
```

例如，当使用 UMD 或 CommonJS 时，你的调用站点可能如下所示：

```javascript
alert(require('myModule').my.qualified.packagename.foo())
```

或者，在使用 `plain` 作为模块系统设置的情况下：

```javascript
alert(myModule.my.qualified.packagename.foo());
```

### @JsName 注解

在某些情况下（例如，为了支持重载），Kotlin 编译器会混淆在 JavaScript 代码中生成的函数和属性的名称。要控制生成的名称，可以使用 `@JsName` 注解：

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

现在，你可以通过以下方式从 JavaScript 中使用这个类：

```javascript
// If necessary, import 'kjs' according to chosen module system
var person = new kjs.Person("Dmitry");   // refers to module 'kjs'
person.hello();                          // prints "Hello Dmitry!"
person.helloWithGreeting("Servus");      // prints "Servus Dmitry!"
```

如果我们没有指定 `@JsName` 注解，则相应函数的名称将包含从函数签名计算出的后缀，例如 `hello_61zpoe$`。

请注意，在某些情况下，Kotlin 编译器不会应用名称混淆：
- `external` 声明不会被混淆。
- 从继承自 `external` 类的非 `external` 类中的任何重写函数都不会被混淆。

`@JsName` 的参数必须是有效的标识符的常量字符串文字。编译器会报告任何尝试将非标识符字符串传递给 `@JsName` 的错误。以下示例会产生编译时错误：

```kotlin
@JsName("new C()")   // error here
external fun newC()
```

### @JsExport 注解

:::caution
此功能是 [Experimental](components-stability#stability-levels-explained)。
其设计可能会在未来版本中发生变化。

::: 

通过将 `@JsExport` 注解应用于顶级声明（如类或函数），你可以使 Kotlin 声明可从 JavaScript 中使用。该注解使用 Kotlin 中给定的名称导出所有嵌套声明。它也可以使用 `@file:JsExport` 应用于文件级别。

为了解决导出中的歧义（例如，具有相同名称的函数的重载），你可以将 `@JsExport` 注解与 `@JsName` 一起使用，以指定生成和导出的函数的名称。

在当前的 [IR compiler backend](js-ir-compiler) 中，`@JsExport` 注解是使你的函数从 Kotlin 中可见的唯一方法。

对于多平台项目，`@JsExport` 在通用代码中也可用。它仅在为 JavaScript 目标编译时有效，并且允许你导出非平台特定的 Kotlin 声明。

### @JsStatic

:::caution
此功能是 [Experimental](components-stability#stability-levels-explained)。它可能随时被删除或更改。
仅将其用于评估目的。我们感谢您在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-18891/JS-provide-a-way-to-declare-static-members-JsStatic) 上对此提供的反馈。

:::

`@JsStatic` 注解指示编译器为目标声明生成额外的静态方法。这有助于你直接在 JavaScript 中使用 Kotlin 代码中的静态成员。

你可以将 `@JsStatic` 注解应用于在命名对象中定义的函数，以及在类和接口中声明的伴生对象。如果使用此注解，编译器将生成对象的静态方法和对象本身的实例方法。例如：

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

现在，`callStatic()` 函数在 JavaScript 中是静态的，而 `callNonStatic()` 函数不是：

```javascript
// JavaScript
C.callStatic();              // Works, accessing the static function
C.callNonStatic();           // Error, not a static function in the generated JavaScript
C.Companion.callStatic();    // Instance method remains
C.Companion.callNonStatic(); // The only way it works
```

也可以将 `@JsStatic` 注解应用于对象或伴生对象的属性，使其 getter 和 setter 方法成为该对象或包含伴生对象的类中的静态成员。

## JavaScript 中的 Kotlin 类型

请参阅 Kotlin 类型如何映射到 JavaScript 类型：

| Kotlin                                                                      | JavaScript                 | 注释                                                                                             |
|-----------------------------------------------------------------------------|----------------------------|----------------------------------------------------------------------------------------------------|
| `Byte`, `Short`, `Int`, `Float`, `Double`                                   | `Number`                   |                                                                                                    |
| `Char`                                                                      | `Number`                   | 该数字表示字符的代码。                                                                                   |
| `Long`                                                                      | Not supported              | JavaScript 中没有 64 位整数数字类型，因此它由 Kotlin 类模拟。                                                     |
| `Boolean`                                                                   | `Boolean`                  |                                                                                                    |
| `String`                                                                    | `String`                   |                                                                                                    |
| `Array`                                                                     | `Array`                    |                                                                                                    |
| `ByteArray`                                                                 | `Int8Array`                |                                                                                                    |
| `ShortArray`                                                                | `Int16Array`               |                                                                                                    |
| `IntArray`                                                                  | `Int32Array`               |                                                                                                    |
| `CharArray`                                                                 | `UInt16Array`              | 携带属性 `$type$ == "CharArray"`。                                                                        |
| `FloatArray`                                                                | `Float32Array`             |                                                                                                    |
| `DoubleArray`                                                               | `Float64Array`             |                                                                                                    |
| `LongArray`                                                                 | `Array<kotlin.Long>`       | 携带属性 `$type$ == "LongArray"`。另请参阅 Kotlin 的 Long 类型注释。                                               |
| `BooleanArray`                                                              | `Int8Array`                | 携带属性 `$type$ == "BooleanArray"`。                                                                   |
| `List`, `MutableList`                                                       | `KtList`, `KtMutableList`  | 通过 `KtList.asJsReadonlyArrayView` 或 `KtMutableList.asJsArrayView` 公开一个 `Array`。                       |
| `Map`, `MutableMap`                                                         | `KtMap`, `KtMutableMap`    | 通过 `KtMap.asJsReadonlyMapView` 或 `KtMutableMap.asJsMapView` 公开一个 ES2015 `Map`。                         |
| `Set`, `MutableSet`                                                         | `KtSet`, `KtMutableSet`    | 通过 `KtSet.asJsReadonlySetView` 或 `KtMutableSet.asJsSetView` 公开一个 ES2015 `Set`。                         |
| `Unit`                                                                      | Undefined                  | 用作返回类型时可导出，但用作参数类型时则不可导出。                                                               |
| `Any`                                                                       | `Object`                   |                                                                                                    |
| `Throwable`                                                                 | `Error`                    |                                                                                                    |
| Nullable `Type?`                                                            | `Type | null | undefined`  |                                                                                                    |
| All other Kotlin types (except for those marked with `JsExport` annotation) | Not supported              | 包括 Kotlin 的 [无符号整数类型](unsigned-integer-types)。                                                        |

此外，重要的是要知道：

* Kotlin 保留了 `kotlin.Int`、`kotlin.Byte`、`kotlin.Short`、`kotlin.Char` 和 `kotlin.Long` 的溢出语义。
* Kotlin 无法在运行时区分数字类型（`kotlin.Long` 除外），因此以下代码有效：
  
  ```kotlin
  fun f() {
      val x: Int = 23
      val y: Any = x
      println(y as Float)
  }
  ```

* Kotlin 在 JavaScript 中保留惰性对象初始化。
* Kotlin 不在 JavaScript 中实现顶级属性的惰性初始化。
```