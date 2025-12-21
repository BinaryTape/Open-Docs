[//]: # (title: 使用 Swift export 与 Swift 进行互操作)

<primary-label ref="experimental-general"/>

Kotlin 提供了对 Swift export 的实验性的支持。它允许你直接导出 Kotlin 源代码，并以 Swift 惯用的方式调用 Kotlin 代码，从而无需 Objective-C 头文件。

Swift export 使面向 Apple 目标平台的多平台开发更加流畅。例如，如果你有一个包含顶层函数的 Kotlin 模块，Swift export 可以实现清晰的、模块特有的导入，从而消除令人困惑的 Objective-C 下划线和名字修饰。

当前 Swift export 的特性包括：

*   **多模块支持**。每个 Kotlin 模块都作为一个独立的 Swift 模块导出，从而简化了函数调用。
*   **包支持**。Kotlin 包在导出期间会显式保留，从而避免了生成的 Swift 代码中的命名冲突。
*   **类型别名**。Kotlin 类型别名被导出并保留在 Swift 中，提高了可读性。
*   **增强的原生类型可空性**。与需要将 `Int?` 等类型装箱到 `KotlinInt` 等包装类以保留可空性的 Objective-C 互操作不同，Swift export 直接转换可空性信息。
*   **重载**。你可以在 Swift 中调用 Kotlin 的重载函数而不会产生歧义。
*   **扁平化的包结构**。你可以将 Kotlin 包转换为 Swift 枚举，从而从生成的 Swift 代码中移除包前缀。
*   **模块名称自定义**。你可以在 Kotlin 项目的 Gradle 配置中自定义生成的 Swift 模块名称。

## 启用 Swift export

该特性当前为[实验性的](components-stability.md#stability-levels-explained)，尚未准备好投入生产。要试用此特性，请在你的 Kotlin 项目中[配置构建文件](#configure-kotlin-project)，并[设置 Xcode](#configure-xcode-project) 以集成 Swift export。

### 配置 Kotlin 项目

你可以在你的项目中使用以下构建文件作为设置 Swift export 的起点：

```kotlin
// build.gradle.kts
kotlin {

    iosArm64()
    iosSimulatorArm64()

    swiftExport {
        // 设置根模块名称
        moduleName = "Shared"

        // 设置折叠规则
        // 从生成的 Swift 代码中移除包前缀
        flattenPackage = "com.example.sandbox"

        // 配置外部模块导出
        export(project(":subproject")) {
            // 设置导出模块的名称 
            moduleName = "Subproject"
            // 设置导出依赖项的折叠规则 
            flattenPackage = "com.subproject.library"
        }

        // 为链接任务提供编译器实参
        configure {
            freeCompilerArgs.add("-Xexpect-actual-classes")
        }
    }
}
```

Kotlin 编译器会自动生成所有必要的文件（包括 `swiftmodule` 文件、静态 `.a` 库、头文件和 `modulemap` 文件），并将它们复制到应用的构建目录中，你可以从 Xcode 访问该目录。

> 你也可以克隆我们已设置好 Swift export 的[公共示例](https://github.com/Kotlin/swift-export-sample)。
>
{style="tip"}

### 配置 Xcode 项目

要配置 Xcode 以将 Swift export 集成到你的项目中：

1.  在 Xcode 中，打开项目设置。
2.  在 **Build Phases** 选项卡上，找到包含 `embedAndSignAppleFrameworkForXcode` 任务的 **Run Script** 阶段。
3.  在运行脚本阶段，将脚本替换为 `embedSwiftExportForXcode` 任务：

    ```bash
    ./gradlew :<Shared module name>:embedSwiftExportForXcode
    ```

    ![添加 Swift export 脚本](xcode-swift-export-run-script-phase.png){width=700}

4.  构建项目。此构建会在输出目录中生成 Swift 模块。

## 当前限制

Swift export 当前仅适用于使用[直接集成](https://kotlinlang.org/docs/multiplatform/multiplatform-direct-integration.html)将 iOS framework 连接到 Xcode 项目的项目。这是使用 IntelliJ IDEA 中的 Kotlin 多平台插件或通过[网页向导](https://kmp.jetbrains.com/)创建的 Kotlin 多平台项目的标准配置。

其他已知问题：

*   当模块在 Gradle 坐标中具有相同的名称时，例如 SQLDelight 的 Runtime 模块和 Compose Runtime 模块，Swift export 会失效 ([KT-80185](https://youtrack.jetbrains.com/issue/KT-80185))。
*   继承自 `List`、`Set` 或 `Map` 的类型在导出期间会被忽略 ([KT-80416](https://youtrack.jetbrains.com/issue/KT-80416))。
*   `List`、`Set` 或 `Map` 的继承者无法在 Swift 侧实例化 ([KT-80417](https://youtrack.jetbrains.com/issue/KT-80417))。
*   当导出到 Swift 时，Kotlin 泛型类型形参会被类型擦除为其上界。
*   Swift 闭包可以传递给 Kotlin，但 Kotlin 无法将函数式类型导出到 Swift。
*   不支持跨语言继承，因此 Swift 类不能直接继承自 Kotlin 导出的类或接口。
*   没有可用的 IDE 迁移提示或自动化功能。
*   当使用需要选择加入的声明时，你必须在 Gradle 构建文件中为 _模块级别_ 添加一个显式的 `optIn` 编译器选项。例如，对于 `kotlinx.datetime` 库：

    ```kotlin
    swiftExport {
        moduleName = "Shared"

        export("org.jetbrains.kotlinx:kotlinx-datetime:%dateTimeVersion%") {
            moduleName = "KotlinDateTime"
            flattenPackage = "kotlinx.datetime"
        }
    }

    // 在模块级别添加一个单独的 opt-in 块
    compilerOptions {
        optIn.add("kotlin.time.ExperimentalTime")
    }
    ```

## 映射

下表展示了 Kotlin 概念如何映射到 Swift。

| Kotlin                 | Swift                          | 备注                    |
| :--------------------- | :----------------------------- | :---------------------- |
| `class`                | `class`                        | [备注](#classes)        |
| `object`               | `class` with `shared` property | [备注](#objects)        |
| `enum class`           | `enum`                         | [备注](#enums)          |
| `typealias`            | `typealias`                    | [备注](#type-aliases)   |
| Function               | Function                       | [备注](#functions)      |
| Property               | Property                       | [备注](#properties)     |
| Constructor            | Initializer                    | [备注](#constructors)   |
| Package                | Nested enum                    | [备注](#packages)       |
| `Boolean`              | `Bool`                         |                         |
| `Char`                 | `Unicode.UTF16.CodeUnit`       |                         |
| `Byte`                 | `Int8`                         |                         |
| `Short`                | `Int16`                        |                         |
| `Int`                  | `Int32`                        |                         |
| `Long`                 | `Int64`                        |                         |
| `UByte`                | `UInt8`                        |                         |
| `UShort`               | `UInt16`                       |                         |
| `UInt`                 | `UInt32`                       |                         |
| `ULong`                | `UInt64`                       |                         |
| `Float`                | `Float`                        |                         |
| `Double`               | `Double`                       |                         |
| `Any`                  | `KotlinBase` class             |                         |
| `Unit`                 | `Void`                         |                         |
| `Nothing`              | `Never`                        | [备注](#kotlin-nothing) |

### 声明

#### 类

Swift export 仅支持直接继承自 `Any` 的 final 类，例如 `class Foo()`。这些类被转换为继承自特殊 `KotlinBase` 类的 Swift 类：

```kotlin
// Kotlin
class MyClass {
    val property: Int = 0

    fun method() {}
}
```

```swift
// Swift
public class MyClass : KotlinRuntime.KotlinBase {
    public var property: Swift.Int32 {
        get {
            // ...
        }
    }
    public override init() {
        // ...
    }
    public func method() -> Swift.Void {
        // ...
    }
}
```

#### 对象

对象被转换为具有私有 `init` 和静态 `shared` 访问器的 Swift 类：

```kotlin
// Kotlin
object O
```

```swift
// Swift
public class O : KotlinRuntime.KotlinBase {
    public static var shared: O {
        get {
            // ...
        }
    }
    private override init() {
        // ...
    }
}
```

#### 类型别名

Kotlin 类型别名按原样导出：

```kotlin
// Kotlin
typealias MyInt = Int
```

```swift
// Swift
public typealias MyInt = Swift.Int32
```

#### 枚举

Kotlin `enum class` 声明被导出为常规的 Swift 原生 `enum` 类型：

```kotlin
// Kotlin
enum class Color(val rgb: Int) {
    RED(0xFF0000),
    GREEN(0x00FF00),
    BLUE(0x0000FF)
}

val color = Color.RED
```

```swift
// Swift
public enum Color: Swift.CaseIterable, Swift.LosslessStringConvertible, Swift.RawRepresentable {
    case RED, GREEN, BLUE

    public var rgb: Swift.Int32 { get }
}
```

#### 函数

Swift export 支持简单的顶层函数和方法：

```kotlin
// Kotlin
fun foo(a: Short, b: Bar) {}

fun baz(): Long = 0
```

```swift
// Swift
public func foo(a: Swift.Int16, b: Bar) -> Swift.Void {
    // ...
}

public func baz() -> Swift.Int64 {
    // ...
}
```

对于 Kotlin 的扩展函数，接收者形参会被移到普通 Swift 形参中的第一个位置：

```kotlin
// Kotlin
fun Int.foo(): Unit = TODO()
```

```swift
// Swift
func foo(_ receiver: Int32) {}
```

Kotlin 带有 [`vararg`](functions.md#variable-number-of-arguments-varargs) 的函数会被映射到 Swift 的可变参数函数形参：

```kotlin
// Kotlin
fun log(vararg messages: String)
```

```swift
// Swift
public func log(messages: Swift.String...)
```

> 对带有 `suspend`、`inline` 和 `operator` 关键字的函数的支持目前是有限的。
> 泛型类型通常不受支持。
>
{style="note"}

#### 属性

Kotlin 属性被转换为 Swift 属性：

```kotlin
// Kotlin
val a: Int = 0

var b: Short = 15

const val c: Int = 0
```

```swift
// Swift
public var a: Swift.Int32 {
    get {
        // ...
    }
}
public var b: Swift.Int16 {
    get {
        // ...
    }
    set {
        // ...
    }
}
public var c: Swift.Int32 {
    get {
        // ...
    }
}
```

#### 构造函数

构造函数被转换为 Swift 初始化器：

```kotlin
// Kotlin
class Foo(val prop: Int)
```

```swift
// Swift
public class Foo : KotlinRuntime.KotlinBase {
    public init(
        prop: Swift.Int32
    ) {
        // ...
    }
}
```

### 类型

#### kotlin.Nothing

Kotlin `Nothing` 类型被转换为 `Never` 类型：

```kotlin
// Kotlin
fun foo(): Nothing = TODO()

fun baz(input: Nothing) {}
```

```swift
// Swift
public func foo() -> Swift.Never {
    // ...
}

public func baz(input: Swift.Never) -> Void {
    // ...
}
```

#### 分类器类型

Swift export 当前仅支持直接继承自 `Any` 的 final 类。

### 包

Kotlin 包被转换为嵌套的 Swift 枚举以避免命名冲突：

```kotlin
// Kotlin
// bar.kt file in foo.bar package
fun callMeMaybe() {}
```

```kotlin
// Kotlin
// baz.kt file in foo.baz package
fun callMeMaybe() {}
```

```swift
// Swift
public extension foo.bar {
    public func callMeMaybe() {}
}

public extension foo.baz {
    public func callMeMaybe() {}
}

public enum foo {
    public enum bar {}

    public enum baz {}
}
```

## Swift export 的演进

我们计划在未来的 Kotlin 版本中扩展并逐步稳定 Swift export，改进 Kotlin 和 Swift 之间的互操作性，特别是在协程和流方面。

你可以留下你的反馈：

*   在 Kotlin Slack 中 – [获取邀请](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up?_gl=1*ju6cbn*_ga*MTA3MTk5NDkzMC4xNjQ2MDY3MDU4*_ga_9J976DJZ68*MTY1ODMzNzA3OS4xMDAuMS4xNjU4MzQwODEwLjYw) 并加入 [#swift-export](https://kotlinlang.slack.com/archives/C073GUW6WN9) 频道。
*   在 [YouTrack](https://kotl.in/issue) 中报告问题。