请注意，在某些情况下，Kotlin 编译器不会应用名称修饰：
- `external` 声明不会被修饰。
- 继承自 `external` 类的非 `external` 类中任何重写的方法都不会被修饰。

`@JsName` 的参数必须是有效的标识符且为常量字符串文字。如果尝试向 `@JsName` 传递非标识符字符串，编译器将报错。以下示例会产生编译时错误：

```kotlin
@JsName("new C()")   // 此处报错
external fun newC()
```

### `@JsExport` 注解
<primary-label ref="experimental-general"/>

通过将 `@JsExport` 注解应用于顶级声明（如类、接口或函数），可以使 Kotlin 声明在 JavaScript 或 TypeScript 中可用。该注解会使用 Kotlin 中给出的名称导出所有嵌套声明。

例如，以下是如何导出一个带有嵌套类和具名伴生对象的 Kotlin 接口：

```kotlin
@JsExport
interface Identity {
     class Metadata(val tag: String)

    companion object Registry {
        val defaultTag = "GUEST"
    }
}
```

目前，`@JsExport` 注解是使你的函数从 Kotlin 可见的唯一方法。

`@JsExport` 注解还可用于：

* 多平台项目中的通用代码。它仅在针对 JavaScript 目标进行编译时生效，并允许你导出非平台特定的 Kotlin 声明。
* 与 [`@JsName` 注解](#jsname-annotation)结合使用，以指定生成的和导出的函数的名称。这有助于解决导出中的歧义（如具有相同名称的函数的重载）。
* 使用 `@file:JsExport` 在文件级应用。

#### 支持导出值类

你可以将 Kotlin 的[内联值类](inline-classes.md)导出为普通的 TypeScript 类。

要导出值类，请在 Kotlin 侧使用 `@JsExport` 注解对其进行标记：

```kotlin
// Kotlin
@JsExport
@JvmInline
value class Email(val address: String) {
    init { require(address.contains("@")) { "Invalid email" } }
}

@JsExport
class AuthService {
    suspend fun login(email: Email): String = ...
}
```

在 TypeScript 侧，它看起来像一个普通的类：

```typescript
// TypeScript
import { AuthService, Email } from "..."
const auth = new AuthService();

console.log(await auth.login(new Email("jane@example.com"))); 
// "Welcome, jane@example.com!"
console.log(await auth.login(new Email("not-an-email"))); 
// "Invalid email"
```

### `@JsNoRuntime` 注解

你可以通过 `@JsNoRuntime` 注解将 Kotlin 接口导出到 JavaScript/TypeScript。它允许直接映射到普通的 TypeScript 接口。

要导出 Kotlin 接口（例如从 Kotlin 多平台项目中）：

1. 在通用代码中使用 `@JsNoRuntime` 为 Kotlin 接口添加注解：

    ```kotlin
    // commonMain
    import kotlin.js.JsNoRuntime
    
    @JsNoRuntime
    expect interface DataProcessor {
        fun process(data: String): Int 
    }
    ```

2. 在 JS 特定的源代码中通过 `@JsNoRuntime` 提供 `actual` 实现：

    ```kotlin
    // jsMain
    import kotlin.js.JsNoRuntime
    
    @JsNoRuntime
    actual interface DataProcessor {
        actual fun process(data: String): Int
    } 
    ```
    
3. 在 TypeScript 侧，该接口将被映射为一个普通的 TypeScript 接口：
    
    ```typescript
    // 生成的 .d.ts
    export interface DataProcessor {
        process(data: string): number;
    }
    ```

对于 Kotlin 多平台项目，通用规则如下：

* `expect` 和 `actual` 接口声明都必须使用 `@JsNoRuntime` 进行注解。唯一的例外是 `actual` 侧平台特定代码中的 `external` 实现，它们不需要注解。
* 禁止在 `expect` 侧的通用代码中使用 `external` 接口声明。应改用带有 `@JsNoRuntime` 注解的普通接口。

使用 `@JsNoRuntime` 导出 Kotlin 接口存在一些限制。该注解不允许用于：

* `external` 接口，因为它们默认行为已等同于带有 `@JsNoRuntime`。添加它会导致编译器警告。
* `is` 和 `as` 类型检查。
* 使用 [`::class` 语法](js-reflection.md)的类引用。
* 作为[具现化类型实参](inline-functions.md#reified-type-parameters)传递的接口。

### `@JsStatic`
<primary-label ref="experimental-general"/>

`@JsStatic` 注解指示编译器为目标声明生成额外的 static 方法。这有助于你直接在 JavaScript 中使用 Kotlin 代码中的 static 成员。

你可以将 `@JsStatic` 注解应用于具名对象中定义的函数，以及在类和接口内部声明的伴生对象中的函数。如果你使用此注解，编译器既会生成对象的 static 方法，也会生成对象本身的实例方法。例如：

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

现在，`callStatic()` 函数在 JavaScript 中是 static 的，而 `callNonStatic()` 函数则不是：

```javascript
// JavaScript
C.callStatic();              // 正常运行，访问 static 方法
C.callNonStatic();           // 错误，在生成的 JavaScript 中不是 static 方法
C.Companion.callStatic();    // 实例方法仍然保留
C.Companion.callNonStatic(); // 唯一可行的方式
```

也可以将 `@JsStatic` 注解应用于对象或伴生对象的属性，使其 getter 和 setter 方法成为该对象或包含伴生对象的类中的 static 成员。

此功能是[实验性的](components-stability.md#stability-levels-explained)。请在我们的问题跟踪器 [YouTrack](https://youtrack.jetbrains.com/issue/KT-18891/JS-provide-a-way-to-declare-static-members-JsStatic) 中分享你的反馈。

### 使用 `BigInt` 类型表示 Kotlin 的 `Long` 类型
<primary-label ref="experimental-general"/>

在编译为现代 JavaScript (ES2020) 时，Kotlin/JS 使用 JavaScript 的内置 `BigInt` 类型来表示 Kotlin `Long` 值。

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

此功能是[实验性的](components-stability.md#stability-levels-explained)。请在我们的问题跟踪器 [YouTrack](https://youtrack.jetbrains.com/issue/KT-57128/KJS-Use-BigInt-to-represent-Long-values-in-ES6-mode) 中分享你的反馈。

#### 在导出的声明中使用 `Long`

由于 Kotlin 的 `Long` 类型可以编译为 JavaScript 的 `BigInt` 类型，因此 Kotlin/JS 支持将 `Long` 值导出到 JavaScript。

要启用此功能：

1. 允许在 Kotlin/JS 中导出 `Long`。将以下编译器选项添加到 `build.gradle(.kts)` 文件中的 `freeCompilerArgs` 属性中：

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

2. 启用 `BigInt` 类型。请参阅[使用 `BigInt` 类型表示 Kotlin 的 `Long` 类型](#use-bigint-type-to-represent-kotlin-s-long-type)了解如何启用它。

### 使用 `BigInt64Array` 类型表示 Kotlin 的 `LongArray` 类型
<primary-label ref="experimental-general"/>

在编译为 JavaScript 时，Kotlin/JS 可以使用 JavaScript 的内置 `BigInt64Array` 类型来表示 Kotlin 的 `LongArray` 值。

要启用对 `BigInt64Array` 类型的支持，请将以下编译器选项添加到你的 `build.gradle(.kts)` 文件中：

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

此功能是[实验性的](components-stability.md#stability-levels-explained)。请在我们的问题跟踪器 [YouTrack](https://youtrack.jetbrains.com/issue/KT-79284/Use-BigInt64Array-for-LongArray) 中分享你的反馈。

## JavaScript 中的 Kotlin 类型

了解 Kotlin 类型如何映射到 JavaScript 类型：

| Kotlin                                                           | JavaScript                | 备注                                                                                                |
|------------------------------------------------------------------|---------------------------|---------------------------------------------------------------------------------------------------------|
| `Byte`, `Short`, `Int`, `Float`, `Double`                        | `Number`                  |                                                                                                         |
| `Char`                                                           | `Number`                  | 数字表示字符的代码。                                                             |
| `Long`                                                           | `BigInt`                  | 需要配置 [`-Xes-long-as-bigint` 编译器选项](compiler-reference.md#xes-long-as-bigint)。 |
| `Boolean`                                                        | `Boolean`                 |                                                                                                         |
| `String`                                                         | `String`                  |                                                                                                         |
| `Array`                                                          | `Array`                   |                                                                                                         |
| `ByteArray`                                                      | `Int8Array`               |                                                                                                         |
| `ShortArray`                                                     | `Int16Array`              |                                                                                                         |
| `IntArray`                                                       | `Int32Array`              |                                                                                                         |
| `CharArray`                                                      | `UInt16Array`             | 带有属性 `$type$ == "CharArray"`。                                                           |
| `FloatArray`                                                     | `Float32Array`            |                                                                                                         |
| `DoubleArray`                                                    | `Float64Array`            |                                                                                                         |
| `LongArray`                                                      | `BigInt64Array`           |                                                                                                         |
| `BooleanArray`                                                   | `Int8Array`               | 带有属性 `$type$ == "BooleanArray"`。                                                        |
| `List`, `MutableList`                                            | `KtList`, `KtMutableList` | 通过 `KtList.asJsReadonlyArrayView` 或 `KtMutableList.asJsArrayView` 公开一个 `Array`。                 |
| `Map`, `MutableMap`                                              | `KtMap`, `KtMutableMap`   | 通过 `KtMap.asJsReadonlyMapView` 或 `KtMutableMap.asJsMapView` 公开一个 ES2015 `Map`。                  |
| `Set`, `MutableSet`                                              | `KtSet`, `KtMutableSet`   | 通过 `KtSet.asJsReadonlySetView` 或 `KtMutableSet.asJsSetView` 公开一个 ES2015 `Set`。                  |
| `Unit`                                                           | Undefined                 | 当用作返回值类型时可导出，但用作形参类型时不可导出。                               |
| `Any`                                                            | `Object`                  |                                                                                                         |
| `Throwable`                                                      | `Error`                   |                                                                                                         |
| `enum class Type`                                                | `Type`                    | 枚举条目公开为 static 类属性 (`Type.ENTRY`)。                                     |
| 可空 `Type?`                                                 | `Type                     | null                                                                                                    | undefined` |                                                                                            |
| 除标记有 `@JsExport` 的类型外，所有其他 Kotlin 类型 | 不支持             | 包括 Kotlin 的[无符号整数类型](unsigned-integer-types.md)。                                  |

此外，请务必了解：

* Kotlin 为 `kotlin.Int`、`kotlin.Byte`、`kotlin.Short`、`kotlin.Char` 和 `kotlin.Long` 保留了溢出语义。
* Kotlin 在运行时无法区分数值类型（`kotlin.Long` 除外），因此以下代码可以正常运行：
  
  ```kotlin
  fun f() {
      val x: Int = 23
      val y: Any = x
      println(y as Float)
  }
  ```

* Kotlin 在 JavaScript 中保留了延迟对象初始化。