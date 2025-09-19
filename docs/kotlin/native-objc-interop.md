[//]: # (title: 与 Swift/Objective-C 的互操作性)

> Objective-C 库的导入功能目前处于 [Beta](native-c-interop-stability.md) 阶段。
> 所有由 cinterop 工具从 Objective-C 库生成的 Kotlin 声明都应带有 `@ExperimentalForeignApi` 注解。
>
> Kotlin/Native 附带的原生平台 库（例如 Foundation、UIKit 和 POSIX）仅对部分 API 要求选择启用。
>
{style="note"}

Kotlin/Native 通过 Objective-C 提供与 Swift 的间接互操作。本文档涵盖了如何在 Swift/Objective-C 代码中使用 Kotlin 声明，以及如何在 Kotlin 代码中使用 Objective-C 声明。

你可能会发现以下其他资源很有用：

*   [Kotlin-Swift interopedia](https://github.com/kotlin-hands-on/kotlin-swift-interopedia)，一个关于如何在 Swift 代码中使用 Kotlin 声明的示例集合。
*   [与 Swift/Objective-C ARC 集成](native-arc-integration.md) 部分，涵盖了 Kotlin 的跟踪 GC 与 Objective-C 的 ARC 之间集成细节。

## 将 Swift/Objective-C 库导入 Kotlin

Objective-C 框架和库如果正确导入到构建中（系统框架默认导入），就可以在 Kotlin 代码中使用。有关更多详细信息，请参见：

*   [创建并配置库定义文件](native-definition-file.md)
*   [配置原生 库的编译](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-configure-compilations.html#configure-interop-with-native-languages)

如果 Swift 库的 API 使用 `@objc` 导出到 Objective-C，则可以在 Kotlin 代码中使用。纯 Swift 模块尚不支持。

## 在 Swift/Objective-C 中使用 Kotlin

如果 Kotlin 模块编译成框架，则可以在 Swift/Objective-C 代码中使用：

*   请参阅 [构建最终 原生 二进制文件](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-build-native-binaries.html#declare-binaries) 以了解如何声明二进制文件。
*   请查看 [Kotlin Multiplatform 示例 项目](https://github.com/Kotlin/kmm-basic-sample) 获取示例。

### 从 Objective-C 和 Swift 隐藏 Kotlin 声明

为了让你的 Kotlin 代码对 Swift/Objective-C 更友好，请使用 `@HiddenFromObjC` 注解来从 Objective-C 和 Swift 中隐藏 Kotlin 声明。它会禁用函数或属性导出到 Objective-C。

或者，你可以使用 `internal` 修饰符标记 Kotlin 声明，以限制它们在编译模块中的可见性。如果你想从 Objective-C 和 Swift 中隐藏 Kotlin 声明，同时又希望它对其他 Kotlin 模块可见，请使用 `@HiddenFromObjC`。

[在 Kotlin-Swift interopedia 中查看示例](https://github.com/kotlin-hands-on/kotlin-swift-interopedia/blob/main/docs/overview/HiddenFromObjC.md)。

### 在 Swift 中使用 refining

`@ShouldRefineInSwift` 有助于将 Kotlin 声明替换为 Swift 编写的包装器。此注解在生成的 Objective-C API 中将函数或属性标记为 `swift_private`。此类声明会获得 `__` 前缀，这使得它们在 Swift 中不可见。

你仍然可以在 Swift 代码中使用这些声明来创建对 Swift 友好的 API，但它们不会在 Xcode 自动补全中被建议。

*   有关在 Swift 中 refining Objective-C 声明的更多信息，请参阅 [官方 Apple 文档](https://developer.apple.com/documentation/swift/improving-objective-c-api-declarations-for-swift)。
*   有关如何使用 `@ShouldRefineInSwift` 注解的示例，请参阅 [Kotlin-Swift interopedia](https://github.com/kotlin-hands-on/kotlin-swift-interopedia/blob/main/docs/overview/ShouldRefineInSwift.md)。

### 更改声明名称

为了避免重命名 Kotlin 声明，请使用 `@ObjCName` 注解。它指示 Kotlin 编译器为带注解的类、接口或任何其他 Kotlin 实体使用自定义的 Objective-C 和 Swift 名称：

```kotlin
@ObjCName(swiftName = "MySwiftArray")
class MyKotlinArray {
    @ObjCName("index")
    fun indexOf(@ObjCName("of") element: String): Int = TODO()
}

// Usage with the ObjCName annotations
let array = MySwiftArray()
let index = array.index(of: "element")
```

[在 Kotlin-Swift interopedia 中查看另一个示例](https://github.com/kotlin-hands-on/kotlin-swift-interopedia/blob/main/docs/overview/ObjCName.md)。

### 使用 KDoc 注释提供文档

文档对于理解任何 API 都至关重要。为共享的 Kotlin API 提供文档，使你能够就用法、注意事项等与用户进行沟通。

生成 Objective-C 头文件时，Kotlin 代码中的 [KDoc](kotlin-doc.md) 注释会被翻译成相应的 Objective-C 注释。例如，以下带有 KDoc 的 Kotlin 代码：

```kotlin
/**
 * Prints the sum of the arguments.
 * Properly handles the case when the sum doesn't fit in 32-bit integer.
 */
fun printSum(a: Int, b: Int) = println(a.toLong() + b)
```

将生成一个包含相应注释的 Objective-C 头文件：

```objc
/**
 * Prints the sum of the arguments.
 * Properly handles the case when the sum doesn't fit in 32-bit integer.
 */
+ (void)printSumA:(int32_t)a b:(int32_t)b __attribute__((swift_name("printSum(a:b:)")));
```

KDoc 注释嵌入到 klibs 中，并从 klibs 提取到生成的 Apple 框架中。
因此，类和方法的注释会出现在自动补全中，例如在 Xcode 中。
如果你查看 `.h` 文件中函数的定义，你将看到 `@param`、`@return` 和类似标签的注释。

已知限制：

*   依赖项文档不会被导出，除非它本身也使用 `-Xexport-kdoc` 选项编译。使用此编译器选项编译的库可能与其他编译器版本不兼容。
*   KDoc 注释大多按原样导出，但许多 KDoc 块标签，例如 `@property`，尚不支持。

如有必要，你可以在 Gradle 构建文件的 `binaries {}` 块中禁用从 klibs 导出 KDoc 注释到生成的 Apple 框架：

```kotlin
// build.gradle.kts
import org.jetbrains.kotlin.gradle.ExperimentalKotlinGradlePluginApi

kotlin {
    iosArm64 {
        binaries {
            framework {
                baseName = "sdk"
                @OptIn(ExperimentalKotlinGradlePluginApi::class)
                exportKdoc.set(false)
            }
        }
    }
}
```

## 映射

下表展示了 Kotlin 概念如何映射到 Swift/Objective-C，反之亦然。

“->” 和 “<-” 表示映射仅单向进行。

| Kotlin                 | Swift                            | Objective-C                      | 备注                                                                              |
|:-----------------------|:---------------------------------|:---------------------------------|:-----------------------------------------------------------------------------------|
| `class`                | `class`                          | `@interface`                     | [备注](#classes)                                                                   |
| `interface`            | `protocol`                       | `@protocol`                      |                                                                                    |
| `constructor`/`create` | Initializer                      | Initializer                      | [备注](#initializers)                                                              |
| Property               | Property                         | Property                         | [备注 1](#top-level-functions-and-properties)，[备注 2](#setters)                 |
| Method                 | Method                           | Method                           | [备注 1](#top-level-functions-and-properties)，[备注 2](#method-names-translation) |
| `enum class`           | `class`                          | `@interface`                     | [备注](#enums)                                                                     |
| `suspend` ->           | `completionHandler:`/ `async`    | `completionHandler:`             | [备注 1](#errors-and-exceptions)，[备注 2](#suspending-functions)                 |
| `@Throws fun`          | `throws`                         | `error:(NSError**)error`         | [备注](#errors-and-exceptions)                                                     |
| Extension              | Extension                        | Category member                  | [备注](#extensions-and-category-members)                                           |
| `companion` member <-  | Class method or property         | Class method or property         |                                                                                    |
| `null`                 | `nil`                            | `nil`                            |                                                                                    |
| `Singleton`            | `shared` or `companion` property | `shared` or `companion` property | [备注](#kotlin-singletons)                                                         |
| Primitive type         | Primitive type / `NSNumber`      |                                  | [备注](#primitive-types)                                                           |
| `Unit` return type     | `Void`                           | `void`                           |                                                                                    |
| `String`               | `String`                         | `NSString`                       | [备注](#strings)                                                                   |
| `String`               | `NSMutableString`                | `NSMutableString`                | [备注](#nsmutablestring)                                                           |
| `List`                 | `Array`                          | `NSArray`                        |                                                                                    |
| `MutableList`          | `NSMutableArray`                 | `NSMutableArray`                 |                                                                                    |
| `Set`                  | `Set`                            | `NSSet`                          |                                                                                    |
| `MutableSet`           | `NSMutableSet`                   | `NSMutableSet`                   | [备注](#collections)                                                               |
| `Map`                  | `Dictionary`                     | `NSDictionary`                   |                                                                                    |
| `MutableMap`           | `NSMutableDictionary`            | `NSMutableDictionary`            | [备注](#collections)                                                               |
| Function type          | Function type                    | Block pointer type               | [备注](#function-types)                                                            |
| Inline classes         | Unsupported                      | Unsupported                      | [备注](#unsupported)                                                               |

### 类

#### 名称翻译

Objective-C 类以其原始名称导入到 Kotlin。协议（Protocols）以 `Protocol` 名称后缀作为接口（interfaces）导入，例如 `@protocol Foo` -> `interface FooProtocol`。
这些类和接口被放置在 [构建配置中指定的](#importing-swift-objective-c-libraries-to-kotlin) 包中（预配置的系统框架使用 `platform.*` 包）。

当 Kotlin 类和接口导入到 Objective-C 时，它们的名称会被加上前缀。该前缀派生自框架名称。

Objective-C 不支持框架中的包。如果 Kotlin 编译器发现同一框架中存在同名但包不同的 Kotlin 类，它会对其进行重命名。此算法尚不稳定，并且可能在 Kotlin 版本之间发生变化。为了解决这个问题，你可以在框架中重命名冲突的 Kotlin 类。

#### 强链接

无论何时你在 Kotlin 源代码中使用 Objective-C 类，它都会被标记为强链接符号。生成的构建构件将相关符号列为强外部引用。

这意味着应用程序在启动时会尝试动态链接符号，如果它们不可用，应用程序就会崩溃。即使符号从未被使用过，也会发生崩溃。符号可能在特定设备或操作系统版本上不可用。

为了解决这个问题并避免“Symbol not found”错误，请使用一个 Swift 或 Objective-C 包装器来检测该类是否实际可用。[请参阅 Compose Multiplatform 框架中如何实现此 workaround 的示例](https://github.com/JetBrains/compose-multiplatform-core/pull/1278/files)。

### 初始化器

Swift/Objective-C 初始化器导入到 Kotlin 时，会作为构造函数或名为 `create` 的工厂方法。后者发生在 Objective-C 类别或 Swift 扩展中声明的初始化器，因为 Kotlin 没有扩展构造函数的概念。

> 在将 Swift 初始化器导入 Kotlin 之前，别忘了用 `@objc` 注解它们。
>
{style="tip"}

Kotlin 构造函数会作为初始化器导入到 Swift/Objective-C。

### Setter

可写的 Objective-C 属性覆盖超类的只读属性时，会以属性 `foo` 的 `setFoo()` 方法形式呈现。协议的只读属性如果被实现为可变，也同样如此。

### 顶层函数和属性

顶层 Kotlin 函数和属性可作为特殊类的成员访问。每个 Kotlin 文件都会被翻译成这样一个类，例如：

```kotlin
// MyLibraryUtils.kt
package my.library

fun foo() {}
```

然后你可以像这样从 Swift 调用 `foo()` 函数：

```swift
MyLibraryUtilsKt.foo()
```

在 Kotlin-Swift interopedia 中查看访问顶层 Kotlin 声明的示例集合：

*   [顶层函数](https://github.com/kotlin-hands-on/kotlin-swift-interopedia/blob/main/docs/overview/Top-level%20functions.md)
*   [顶层只读属性](https://github.com/kotlin-hands-on/kotlin-swift-interopedia/blob/main/docs/functionsandproperties/Top-level%20val%20properties.md)
*   [顶层可变属性](https://github.com/kotlin-hands-on/kotlin-swift-interopedia/blob/main/docs/functionsandproperties/Top-level%20mutable%20var%20properties.md)

### 方法名称翻译

通常，Swift 实参标签和 Objective-C 选择器片段会映射到 Kotlin 形参名称。这两个概念具有不同的语义，因此有时 Swift/Objective-C 方法导入时可能与 Kotlin 签名冲突。
在这种情况下，可以使用命名实参从 Kotlin 调用冲突的方法，例如：

```swift
[player moveTo:LEFT byMeters:17]
[player moveTo:UP byInches:42]
```

在 Kotlin 中，它表示为：

```kotlin
player.moveTo(LEFT, byMeters = 17)
player.moveTo(UP, byInches = 42)
```

以下是 `kotlin.Any` 函数如何映射到 Swift/Objective-C 的方式：

| Kotlin       | Swift          | Objective-C   |
|:-------------|:---------------|:--------------|
| `equals()`   | `isEquals(_:)` | `isEquals:`   |
| `hashCode()` | `hash`         | `hash`        |
| `toString()` | `description`  | `description` |

[在 Kotlin-Swift interopedia 中查看数据类的示例](https://github.com/kotlin-hands-on/kotlin-swift-interopedia/blob/main/docs/classesandinterfaces/Data%20classes.md)。

你可以在 Swift 或 Objective-C 中指定一个更符合惯用法的名称，而不是使用 [`@ObjCName` 注解](#change-declaration-names) 重命名 Kotlin 声明。

### 错误与异常

所有 Kotlin 异常都是非检查型的，这意味着错误在运行时捕获。然而，Swift 只有在编译期处理的检查型错误。因此，如果 Swift 或 Objective-C 代码调用抛出异常的 Kotlin 方法，该 Kotlin 方法应使用 `@Throws` 注解标记，并指定“预期”异常类的列表。

当编译到 Swift/Objective-C 框架时，带有或继承 `@Throws` 注解的非 `suspend` 函数在 Objective-C 中表示为生成 `NSError*` 的方法，在 Swift 中表示为 `throws` 方法。`suspend` 函数的表示总是在 completion handler 中包含 `NSError*`/`Error` 形参。

当从 Swift/Objective-C 代码调用的 Kotlin 函数抛出属于 `@Throws` 指定类或其子类的异常实例时，该异常将作为 `NSError` 传播。其他到达 Swift/Objective-C 的 Kotlin 异常被视为未处理，并导致程序终止。

不带 `@Throws` 的 `suspend` 函数只传播 `CancellationException`（作为 `NSError`）。不带 `@Throws` 的非 `suspend` 函数则根本不传播 Kotlin 异常。

请注意，相反的逆向翻译尚未实现：Swift/Objective-C 的错误抛出方法不会作为异常抛出方法导入到 Kotlin。

[在 Kotlin-Swift interopedia 中查看示例](https://github.com/kotlin-hands-on/kotlin-swift-interopedia/blob/main/docs/overview/Exceptions.md)。

### 枚举

Kotlin 枚举导入到 Objective-C 时作为 `@interface`，导入到 Swift 时作为 `class`。这些数据结构具有与每个枚举值对应的属性。考虑这段 Kotlin 代码：

```kotlin
// Kotlin
enum class Colors {
    RED, GREEN, BLUE
}
```

你可以从 Swift 中访问此枚举类的属性，如下所示：

```swift
// Swift
Colors.red
Colors.green
Colors.blue
```

要在 Swift `switch` 语句中使用 Kotlin 枚举的变量，请提供一个 default 语句以防止编译错误：

```swift
switch color {
    case .red: print("It's red")
    case .green: print("It's green")
    case .blue: print("It's blue")
    default: fatalError("No such color")
}
```

[在 Kotlin-Swift interopedia 中查看另一个示例](https://github.com/kotlin-hands-on/kotlin-swift-interopedia/blob/main/docs/classesandinterfaces/Enum%20classes.md)。

### 挂起函数

Kotlin 的[挂起函数](coroutines-basics.md) (`suspend`) 在生成的 Objective-C 头文件中呈现为带回调的函数，或 Swift/Objective-C 术语中的[完成处理程序](https://developer.apple.com/documentation/swift/calling_objective-c_apis_asynchronously)。

从 Swift 5.5 开始，Kotlin 的 `suspend` 函数也可以作为 `async` 函数从 Swift 调用，而无需使用完成处理程序。目前，此功能是高度实验性的，并且存在某些限制。有关详细信息，请参阅[此 YouTrack issue](https://youtrack.jetbrains.com/issue/KT-47610)。

*   了解更多关于 Swift 文档中的 [`async`/`await` 机制](https://docs.swift.org/swift-book/LanguageGuide/Concurrency.html)。
*   在 [Kotlin-Swift interopedia](https://github.com/kotlin-hands-on/kotlin-swift-interopedia/blob/main/docs/coroutines/Suspend%20functions.md) 中查看实现相同功能的第三方库的示例和建议。

### 扩展和类别成员

Objective-C 类别和 Swift 扩展的成员通常作为扩展导入到 Kotlin。这就是为什么这些声明不能在 Kotlin 中被覆盖，并且扩展初始化器不能作为 Kotlin 构造函数使用。

> 目前有两个例外。从 Kotlin 1.8.20 开始，在与 NSView 类（来自 AppKit framework）或 UIView 类（来自 UIKit framework）相同的头文件中声明的类别成员将作为这些类的成员导入。这意味着你可以覆盖从 NSView 或 UIView 子类化的方法。
>
{style="note"}

Kotlin 对“常规”Kotlin 类的扩展会分别作为扩展和类别成员导入到 Swift 和 Objective-C。Kotlin 对其他类型的扩展被视为带有额外接收者形参的[顶层声明](#top-level-functions-and-properties)。这些类型包括：

*   Kotlin `String` type
*   Kotlin collection types and subtypes
*   Kotlin `interface` types
*   Kotlin primitive types
*   Kotlin `inline` classes
*   Kotlin `Any` type
*   Kotlin function types and subtypes
*   Objective-C classes and protocols

[在 Kotlin-Swift interopedia 中查看示例集合](https://github.com/kotlin-hands-on/kotlin-swift-interopedia/tree/main/docs/extensions)。

### Kotlin 单例

Kotlin 单例（通过 `object` 声明创建，包括 `companion object`）导入到 Swift/Objective-C 时，会作为具有单个实例的类。

该实例通过 `shared` 和 `companion` 属性可用。

对于以下 Kotlin 代码：

```kotlin
object MyObject {
    val x = "Some value"
}

class MyClass {
    companion object {
        val x = "Some value"
    }
}
```

按如下方式访问这些对象：

```swift
MyObject.shared
MyObject.shared.x
MyClass.companion
MyClass.Companion.shared
```

> 在 Objective-C 中通过 `[MySingleton mySingleton]` 以及在 Swift 中通过 `MySingleton()` 访问对象的方式已被弃用。
>
{style="note"}

在 Kotlin-Swift interopedia 中查看更多示例：

*   [如何使用 `shared` 访问 Kotlin 对象](https://github.com/kotlin-hands-on/kotlin-swift-interopedia/blob/main/docs/classesandinterfaces/Objects.md)
*   [如何从 Swift 访问 Kotlin companion object 的成员](https://github.com/kotlin-hands-on/kotlin-swift-interopedia/blob/main/docs/classesandinterfaces/Companion%20objects.md)。

### 原生类型

Kotlin 原生类型包装器映射到特殊的 Swift/Objective-C 类。例如，`kotlin.Int` 包装器在 Swift 中表示为 `KotlinInt` 类实例（或在 Objective-C 中表示为 `${prefix}Int` 实例，其中 `prefix` 是框架的名称前缀）。这些类派生自 `NSNumber`，因此这些实例是支持所有相应操作的 `NSNumber`。

当 `NSNumber` 类型用作 Swift/Objective-C 形参类型或返回值时，它不会自动转换为 Kotlin 原生类型。原因是 `NSNumber` 类型没有提供足够关于包装的原生值类型的信息，例如，`NSNumber` 在静态上不确定是 `Byte`、`Boolean` 还是 `Double`。因此，Kotlin 原生值应[手动与 `NSNumber` 之间进行类型转换](#casting-between-mapped-types)。

### 字符串

当 Kotlin `String` 传递给 Swift 时，它首先作为 Objective-C 对象导出，然后 Swift 编译器会再次复制它以进行 Swift 转换。这会导致额外的运行时开销。

为了避免这种情况，请直接在 Swift 中将 Kotlin 字符串作为 Objective-C `NSString` 访问。
[查看转换示例](#see-the-conversion-example)。

#### NSMutableString

Kotlin 中不可用 `NSMutableString` Objective-C 类。
`NSMutableString` 的所有实例在传递给 Kotlin 时都会被复制。

### 集合

#### Kotlin -> Objective-C -> Swift

当 Kotlin 集合传递给 Swift 时，它首先转换为 Objective-C 等效类型，然后 Swift 编译器复制整个集合并将其转换为 Swift 原生集合，如[映射表](#mappings) 中所述。

最后这种转换会导致性能开销。为防止这种情况，在 Swift 中使用 Kotlin 集合时，请将其显式转换为其 Objective-C 对应类型：`NSDictionary`、`NSArray` 或 `NSSet`。

##### 查看转换示例 {initial-collapse-state="collapsed" collapsible="true"}

例如，以下 Kotlin 声明：

```kotlin
val map: Map<String, String>
```

在 Swift 中，可能看起来像这样：

```Swift
map[key]?.count ?? 0
```

在这里，`map` 会隐式转换为 Swift 的 `Dictionary`，其字符串值会映射到 Swift 的 `String`。这会导致性能开销。

为了避免这种转换，请将 `map` 显式转换为 Objective-C 的 `NSDictionary`，并以 `NSString` 形式访问值：

```Swift
let nsMap: NSDictionary = map as NSDictionary
(nsMap[key] as? NSString)?.length ?? 0
```

这确保了 Swift 编译器不会执行额外的转换步骤。

#### Swift -> Objective-C -> Kotlin

Swift/Objective-C 集合映射到 Kotlin 的方式如[映射表](#mappings) 所述，但 `NSMutableSet` 和 `NSMutableDictionary` 除外。

`NSMutableSet` 不会转换为 Kotlin 的 `MutableSet`。要将对象传递到 Kotlin `MutableSet`，请显式创建这种 Kotlin 集合。为此，例如，可以在 Kotlin 中使用 `mutableSetOf()` 函数，或者在 Swift 中使用 `KotlinMutableSet` 类，以及在 Objective-C 中使用 `${prefix}MutableSet`（`prefix` 是框架名称前缀）。`MutableMap` 也是如此。

[在 Kotlin-Swift interopedia 中查看示例](https://github.com/kotlin-hands-on/kotlin-swift-interopedia/blob/main/docs/overview/Collections.md)。

### 函数类型

Kotlin 函数类型对象（例如 lambda 表达式）在 Swift 中转换为闭包，在 Objective-C 中转换为 block。
[在 Kotlin-Swift interopedia 中查看带有 lambda 的 Kotlin 函数示例](https://github.com/kotlin-hands-on/kotlin-swift-interopedia/blob/main/docs/functionsandproperties/Functions%20returning%20function%20type.md)。

然而，在翻译函数和函数类型时，形参和返回值的类型映射方式有所不同。在后一种情况下，原生类型会映射到它们的包装表示。Kotlin `Unit` 返回值在 Swift/Objective-C 中表示为相应的 `Unit` 单例。此单例的值可以像任何其他 Kotlin `object` 一样获取。请参见[上表](#mappings) 中的单例。

考虑以下 Kotlin 函数：

```kotlin
fun foo(block: (Int) -> Unit) { ... }
```

它在 Swift 中的表示如下：

```swift
func foo(block: (KotlinInt) -> KotlinUnit)
```

你可以像这样调用它：

```swift
foo {
    bar($0 as! Int32)
    return KotlinUnit()
}
```

#### Objective-C block 类型中的显式形参名称

你可以为 Kotlin 的函数类型添加显式形参名称，以用于导出的 Objective-C 头文件。如果没有它们，
Xcode 的自动补全会建议调用 Objective-C 函数时，Objective-C block 中没有形参名称，
并且生成的 block 会触发 Clang 警告。

要启用显式形参名称，请将以下 [二进制选项](native-binary-options.md) 添加到 `gradle.properties` 文件中：

```none
kotlin.native.binary.objcExportBlockExplicitParameterNames=true
```

例如，对于以下 Kotlin 代码：

```kotlin
// Kotlin:
fun greetUser(block: (name: String) -> Unit) = block("John")
```

Kotlin 将形参名称从 Kotlin 函数类型转发到 Objective-C block 类型，允许 Xcode 在建议中使用它们：

```objc
// Objective-C:
greetUserBlock:^(NSString *name) {
    // ...
};
```

> 此选项仅影响 Objective-C 互操作。它适用于在 Xcode 中从 Objective-C 调用生成的 Objective-C 代码，
> 并且通常不影响从 Swift 的调用。
>
{style="note"}

### 泛型

Objective-C 支持在类中定义的“轻量级泛型”，其特性集相对有限。Swift 可以导入在类中定义的泛型，以帮助为编译器提供额外的类型信息。

Objective-C 和 Swift 对泛型特性的支持与 Kotlin 不同，因此翻译不可避免地会丢失一些信息，但支持的特性仍保留有意义的信息。

有关如何在 Swift 中使用 Kotlin 泛型的具体示例，请参阅 [Kotlin-Swift interopedia](https://github.com/kotlin-hands-on/kotlin-swift-interopedia/blob/main/docs/overview/ShouldRefineInSwift.md)。

#### 限制

Objective-C 泛型不支持 Kotlin 或 Swift 的所有特性，因此在翻译过程中会丢失一些信息。

泛型只能在类上定义，不能在接口（Objective-C 和 Swift 中的协议）或函数上定义。

#### 可空性

Kotlin 和 Swift 都将可空性定义为类型规范的一部分，而 Objective-C 则在方法的类型及其属性上定义可空性。因此，以下 Kotlin 代码：

```kotlin
class Sample<T>() {
    fun myVal(): T
}
```

在 Swift 中看起来像这样：

```swift
class Sample<T>() {
    fun myVal(): T?
}
```

为了支持可能的可空类型，Objective-C 头文件需要使用可空返回值来定义 `myVal`。

为了缓解这种情况，在定义泛型类时，如果泛型类型_绝不_可空，请提供一个非空类型约束：

```kotlin
class Sample<T : Any>() {
    fun myVal(): T
}
```

这将强制 Objective-C 头文件将 `myVal` 标记为非空的。

#### 型变

Objective-C 允许泛型被声明为协变或逆变。Swift 不支持型变。来自 Objective-C 的泛型类可以根据需要进行强制类型转换。

```kotlin
data class SomeData(val num: Int = 42) : BaseData()
class GenVarOut<out T : Any>(val arg: T)
```

```swift
let variOut = GenVarOut<SomeData>(arg: sd)
let variOutAny : GenVarOut<BaseData> = variOut as! GenVarOut<BaseData>
```

#### 约束

在 Kotlin 中，你可以为泛型类型提供上界。Objective-C 也支持这一点，但在更复杂的情况下此支持不可用，并且目前在 Kotlin - Objective-C 互操作中也不支持。这里的例外是，一个非空的上界会使 Objective-C 方法/属性变为非空的。

#### 禁用

要生成不含泛型的框架头文件，请在你的构建文件中添加以下编译器选项：

```kotlin
binaries.framework {
    freeCompilerArgs += "-Xno-objc-generics"
}
```

### 前向声明

要导入前向声明，请使用 `objcnames.classes` 和 `objcnames.protocols` 包。例如，要导入 Objective-C 库中 `library.package` 声明的 `objcprotocolName` 前向声明，请使用特殊的前向声明包：`import objcnames.protocols.objcprotocolName`。

考虑两个 objcinterop 库：一个使用 `objcnames.protocols.ForwardDeclaredProtocolProtocol`，另一个在不同的包中具有实际实现：

```ObjC
// First objcinterop library
#import <Foundation/Foundation.h>

@protocol ForwardDeclaredProtocol;

NSString* consumeProtocol(id<ForwardDeclaredProtocol> s) {
    return [NSString stringWithUTF8String:"Protocol"];
}
```

```ObjC
// Second objcinterop library
// Header:
#import <Foundation/Foundation.h>
@protocol ForwardDeclaredProtocol
@end
// Implementation:
@interface ForwardDeclaredProtocolImpl : NSObject <ForwardDeclaredProtocol>
@end

id<ForwardDeclaredProtocol> produceProtocol() {
    return [ForwardDeclaredProtocolImpl new];
}
```

要在两个库之间传输对象，请在你的 Kotlin 代码中使用显式 `as` 类型转换：

```kotlin
// Kotlin code:
fun test() {
    consumeProtocol(produceProtocol() as objcnames.protocols.ForwardDeclaredProtocolProtocol)
}
```

> 你只能从相应的实际类转换为 `objcnames.protocols.ForwardDeclaredProtocolProtocol`。否则，你将收到错误。
>
{style="note"}

## 映射类型之间的类型转换

在编写 Kotlin 代码时，一个对象可能需要从 Kotlin 类型转换为等效的 Swift/Objective-C 类型（反之亦然）。在这种情况下，可以使用普通的 Kotlin 类型转换，例如：

```kotlin
val nsArray = listOf(1, 2, 3) as NSArray
val string = nsString as String
val nsNumber = 42 as NSNumber
```

## 子类化

### 从 Swift/Objective-C 子类化 Kotlin 类和接口

Kotlin 类和接口可以被 Swift/Objective-C 类和协议子类化。

### 从 Kotlin 子类化 Swift/Objective-C 类和协议

Swift/Objective-C 类和协议可以被 Kotlin 的 `final` 类子类化。继承 Swift/Objective-C 类型的非 `final` Kotlin 类尚不支持，因此无法声明继承 Swift/Objective-C 类型的复杂类层次结构。

可以使用 Kotlin 的 `override` 关键字覆盖普通方法。在这种情况下，覆盖方法必须与被覆盖方法具有相同的形参名称。

有时需要覆盖初始化器，例如在子类化 `UIViewController` 时。作为 Kotlin 构造函数导入的初始化器可以被标记有 `@OverrideInit` 注解的 Kotlin 构造函数覆盖：

```swift
class ViewController : UIViewController {
    @OverrideInit constructor(coder: NSCoder) : super(coder)

    ...
}
```

覆盖构造函数必须与被覆盖构造函数具有相同的形参名称和类型。

为了覆盖具有冲突 Kotlin 签名的不同方法，你可以将 `@ObjCSignatureOverride` 注解添加到类中。当从 Objective-C 类继承的多个函数具有相同的实参类型但不同的实参名称时，此注解指示 Kotlin 编译器忽略冲突的重载。

默认情况下，Kotlin/Native 编译器不允许将非指定 Objective-C 初始化器作为 `super()` 构造函数调用。如果 Objective-C 库中没有正确标记指定初始化器，则此行为可能会造成不便。要禁用这些编译器检测，请将 `disableDesignatedInitializerChecks = true` 添加到库的 [`.def` 文件](native-definition-file.md) 中。

## C 特性

有关库使用一些纯 C 特性（例如不安全指针、结构体等）的示例情况，请参阅[与 C 的互操作性](native-c-interop.md)。

## 不支持的特性

Kotlin 编程语言的一些特性尚未映射到 Objective-C 或 Swift 的相应特性中。目前，以下特性未在生成的框架头文件中正确公开：

*   Inline classes（实参映射为底层原生类型或 `id`）
*   实现标准 Kotlin 集合接口（`List`、`Map`、`Set`）及其他特殊类的自定义类
*   Objective-C 类的 Kotlin 子类