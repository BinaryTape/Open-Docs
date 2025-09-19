[//]: # (title: 在 JavaScript 中使用 Kotlin 代码)

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

### 使用 `BigInt` 类型表示 Kotlin 的 `Long` 类型
<primary-label ref="experimental-general"/>

当编译为现代 JavaScript (ES2020) 时，Kotlin/JS 使用 JavaScript 的内置 `BigInt` 类型来表示 Kotlin 的 `Long` 值。

要启用对 `BigInt` 类型的支持，你需要将以下编译器选项添加到你的 `build.gradle(.kts)` 文件中：

```kotlin
// build.gradle.kts
kotlin {
    js {
        ...
        compilerOptions {
            freeCompilerArgs.add("-Xes-long-as-bigint")
        }
    }
}
```

此特性是[实验性的](components-stability.md#stability-levels-explained)。请在我们的问题跟踪器 [YouTrack](https://youtrack.jetbrains.com/issue/KT-57128/KJS-Use-BigInt-to-represent-Long-values-in-ES6-mode) 中分享你的反馈。

#### 在导出的声明中使用 `Long`

由于 Kotlin 的 `Long` 类型可以编译为 JavaScript 的 `BigInt` 类型，Kotlin/JS 支持将 `Long` 值导出到 JavaScript。

要启用此特性：

1. 允许在 Kotlin/JS 中导出 `Long`。将以下编译器选项添加到你的 `build.gradle(.kts)` 文件中的 `freeCompilerArgs` 属性：

 ```kotlin
// build.gradle.kts
kotlin {
    js {
        ...
        compilerOptions {
            freeCompilerArgs.add("-XXLanguage:+JsAllowLongInExportedDeclarations")
        }
    }
}
```

2. 启用 `BigInt` 类型。有关如何启用它，请参见[使用 `BigInt` 类型表示 Kotlin 的 `Long` 类型](#use-bigint-type-to-represent-kotlin-s-long-type)。

## JavaScript 中的 Kotlin 类型

请查看 Kotlin 类型如何映射到 JavaScript 类型：

| Kotlin                                                           | JavaScript                | Comments                                                                              |
|------------------------------------------------------------------|---------------------------|---------------------------------------------------------------------------------------|
| `Byte`, `Short`, `Int`, `Float`, `Double`                        | `Number`                  |                                                                                       |
| `Char`                                                           | `Number`                  | 数字表示字符的代码。                                           |
| `Long`                                                           | `BigInt`                  | 需要配置 [`-Xes-long-as-bigint` 编译器选项](compiler-reference.md#xes-long-as-bigint)。 |
| `Boolean`                                                        | `Boolean`                 |                                                                                       |
| `String`                                                         | `String`                  |                                                                                       |
| `Array`                                                          | `Array`                   |                                                                                       |
| `ByteArray`                                                      | `Int8Array`               |                                                                                       |
| `ShortArray`                                                     | `Int16Array`              |                                                                                       |
| `IntArray`                                                       | `Int32Array`              |                                                                                       |
| `CharArray`                                                      | `UInt16Array`             | 带有属性 `$type$ == "CharArray"`。                                         |
| `FloatArray`                                                     | `Float32Array`            |                                                                                       |
| `DoubleArray`                                                    | `Float64Array`            |                                                                                       |
| `LongArray`                                                      | `Array<kotlin.Long>`      | 带有属性 `$type$ == "LongArray"`。另请参见 Kotlin 的 `Long` 类型注释。    |
| `BooleanArray`                                                   | `Int8Array`               | 带有属性 `$type$ == "BooleanArray"`。                                      |
| `List`, `MutableList`                                            | `KtList`, `KtMutableList` | 通过 `KtList.asJsReadonlyArrayView` 或 `KtMutableList.asJsArrayView` 暴露一个 `Array`。 |
| `Map`, `MutableMap`                                              | `KtMap`, `KtMutableMap`   | 通过 `KtMap.asJsReadonlyMapView` 或 `KtMutableMap.asJsMapView` 暴露一个 ES2015 `Map`。 |
| `Set`, `MutableSet`                                              | `KtSet`, `KtMutableSet`   | 通过 `KtSet.asJsReadonlySetView` 或 `KtMutableSet.asJsSetView` 暴露一个 ES2015 `Set`。 |
| `Unit`                                                           | Undefined                 | 当用作返回类型时可导出，但当用作形参类型时不可导出。             |
| `Any`                                                            | `Object`                  |                                                                                       |
| `Throwable`                                                      | `Error`                   |                                                                                       |
| `enum class Type`                                                | `Type`                    | 枚举条目以静态类属性的形式暴露（`Type.ENTRY`）。                   |
| Nullable `Type?`                                                 | `Type                     | null                                                                                  | undefined` |                                                                                            |
| All other Kotlin types, except for those marked with `@JsExport` | Not supported             | 包括 Kotlin 的[无符号整型](unsigned-integer-types.md)。               |

此外，重要的是要了解：

* Kotlin 为 `kotlin.Int`、`kotlin.Byte`、`kotlin.Short`、`kotlin.Char` 和 `kotlin.Long` 保留溢出语义。
* Kotlin 在运行时无法区分数值类型（`kotlin.Long` 除外），因此以下代码有效：

  ```kotlin
  fun f() {
      val x: Int = 23
      val y: Any = x
      println(y as Float)
  }
  ```

* Kotlin 在 JavaScript 中保留惰性对象初始化。
* Kotlin 不在 JavaScript 中实现顶层属性的惰性初始化。