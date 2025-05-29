[//]: # (title: 与 Swift/Objective-C 的互操作性)

> Objective-C 库导入功能为[实验性](components-stability.md#stability-levels-explained)功能。
> 所有由 cinterop 工具从 Objective-C 库生成的 Kotlin 声明
> 都应带有 `@ExperimentalForeignApi` 注解。
>
> 随 Kotlin/Native 附带的原生平台库（如 Foundation、UIKit 和 POSIX）
> 仅对部分 API 需要[明确启用](opt-in-requirements.md)。
>
{style="warning"}

Kotlin/Native 通过 Objective-C 提供与 Swift 的间接互操作性。本文档介绍了如何在 Swift/Objective-C 代码中使用 Kotlin 声明，以及如何在 Kotlin 代码中使用 Objective-C 声明。

你可能会觉得有用的一些其他资源：

*   [Kotlin-Swift 互操作百科 (interopedia)](https://github.com/kotlin-hands-on/kotlin-swift-interopedia)，一个关于如何在 Swift 代码中使用 Kotlin 声明的示例合集。
*   [与 Swift/Objective-C ARC 的集成](native-arc-integration.md) 部分，涵盖了 Kotlin 的追踪式 GC 与 Objective-C 的 ARC 之间集成的详细信息。

## 将 Swift/Objective-C 库导入 Kotlin

Objective-C 框架和库如果正确导入到构建中，就可以在 Kotlin 代码中使用（系统框架默认导入）。
更多详细信息，请参阅：

*   [创建和配置库定义文件](native-definition-file.md)
*   [配置原生库的编译](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-configure-compilations.html#configure-interop-with-native-languages)

如果 Swift 库的 API 使用 `@objc` 导出到 Objective-C，则可以在 Kotlin 代码中使用。
纯 Swift 模块尚不支持。

## 在 Swift/Objective-C 中使用 Kotlin

如果 Kotlin 模块编译成框架，则可以在 Swift/Objective-C 代码中使用：

*   请参阅 [构建最终的原生二进制文件](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-build-native-binaries.html#declare-binaries) 以了解如何声明二进制文件。
*   查看 [Kotlin Multiplatform 示例项目](https://github.com/Kotlin/kmm-basic-sample) 以获取示例。

### 从 Objective-C 和 Swift 中隐藏 Kotlin 声明

> `@HiddenFromObjC` 注解为[实验性](components-stability.md#stability-levels-explained)功能，并且需要[明确启用](opt-in-requirements.md)。
>
{style="warning"}

为了使你的 Kotlin 代码对 Swift/Objective-C 更友好，请使用 `@HiddenFromObjC` 注解来从 Objective-C 和 Swift 中隐藏 Kotlin 声明。它会禁用函数或属性导出到 Objective-C。

另外，你可以使用 `internal` 修饰符来限制 Kotlin 声明在编译模块中的可见性。如果你希望从 Objective-C 和 Swift 中隐藏 Kotlin 声明，同时使其对其他 Kotlin 模块保持可见，请使用 `@HiddenFromObjC`。

[在 Kotlin-Swift 互操作百科中查看示例](https://github.com/kotlin-hands-on/kotlin-swift-interopedia/blob/main/docs/overview/HiddenFromObjC.md)。

### 在 Swift 中使用精化

> `@ShouldRefineInSwift` 注解为[实验性](components-stability.md#stability-levels-explained)功能，并且需要[明确启用](opt-in-requirements.md)。
>
{style="warning"}

`@ShouldRefineInSwift` 有助于用 Swift 编写的包装器替换 Kotlin 声明。此注解在生成的 Objective-C API 中将函数或属性标记为 `swift_private`。此类声明会获得 `__` 前缀，这使得它们在 Swift 中不可见。

你仍然可以在 Swift 代码中使用这些声明来创建 Swift 友好型 API，但它们不会在 Xcode 自动补全中建议。

*   有关在 Swift 中精化 Objective-C 声明的更多信息，请参阅 [Apple 官方文档](https://developer.apple.com/documentation/swift/improving-objective-c-api-declarations-for-swift)。
*   有关如何使用 `@ShouldRefineInSwift` 注解的示例，请参阅 [Kotlin-Swift 互操作百科](https://github.com/kotlin-hands-on/kotlin-swift-interopedia/blob/main/docs/overview/ShouldRefineInSwift.md)。

### 更改声明名称

> `@ObjCName` 注解为[实验性](components-stability.md#stability-levels-explained)功能，并且需要[明确启用](opt-in-requirements.md)。
>
{style="warning"}

为避免重命名 Kotlin 声明，请使用 `@ObjCName` 注解。它指示 Kotlin 编译器为带注解的类、接口或另一个 Kotlin 实体使用自定义的 Objective-C 和 Swift 名称：

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

[在 Kotlin-Swift 互操作百科中查看另一个示例](https://github.com/kotlin-hands-on/kotlin-swift-interopedia/blob/main/docs/overview/ObjCName.md)。

### 使用 KDoc 注释提供文档

文档对于理解任何 API 至关重要。为共享的 Kotlin API 提供文档，可以让你就使用方法、注意事项等与用户沟通。

默认情况下，生成 Objective-C 头文件时，[KDocs](kotlin-doc.md) 注释不会翻译成相应的注释。例如，以下带有 KDoc 的 Kotlin 代码：

```kotlin
/**
 * Prints the sum of the arguments.
 * Properly handles the case when the sum doesn't fit in 32-bit integer.
 */
fun printSum(a: Int, b: Int) = println(a.toLong() + b)
```

将生成一个没有任何注释的 Objective-C 声明：

```objc
+ (void)printSumA:(int32_t)a b:(int32_t)b __attribute__((swift_name("printSum(a:b:)")));
```

要启用 KDoc 注释的导出，请将以下编译器选项添加到你的 `build.gradle(.kts)`：

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
kotlin {
    targets.withType<org.jetbrains.kotlin.gradle.plugin.mpp.KotlinNativeTarget> {
        compilations.get("main").compilerOptions.options.freeCompilerArgs.add("-Xexport-kdoc")
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
kotlin {
    targets.withType(org.jetbrains.kotlin.gradle.plugin.mpp.KotlinNativeTarget) {
        compilations.get("main").compilerOptions.options.freeCompilerArgs.add("-Xexport-kdoc")
    }
}
```

</tab>
</tabs>

之后，Objective-C 头文件将包含相应的注释：

```objc
/**
 * Prints the sum of the arguments.
 * Properly handles the case when the sum doesn't fit in 32-bit integer.
 */
+ (void)printSumA:(int32_t)a b:(int32_t)b __attribute__((swift_name("printSum(a:b:)")));
```

你将能够在自动补全中看到类和方法的注释，例如在 Xcode 中。如果你转到函数的定义（在 `.h` 文件中），你将看到 `@param`、`@return` 等注释。

已知限制：

> 将 KDoc 注释导出到生成的 Objective-C 头文件的能力为[实验性](components-stability.md)功能。
> 它可能随时被取消或更改。
> 需要明确启用（详情见下文），并且你应仅将其用于评估目的。
> 我们非常感谢你在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-38600) 上提供反馈。
>
{style="warning"}

*   依赖项文档不会导出，除非它本身也使用 `-Xexport-kdoc` 进行编译。此功能是实验性的，因此使用此选项编译的库可能与其他编译器版本不兼容。
*   KDoc 注释大多按原样导出。许多 KDoc 功能，例如 `@property`，尚不支持。

## 映射

下表展示了 Kotlin 概念如何映射到 Swift/Objective-C，反之亦然。

“->”和“<-”表示映射是单向的。

| Kotlin                 | Swift                            | Objective-C                      | 备注                                                                         |
|------------------------|----------------------------------|----------------------------------|------------------------------------------------------------------------------|
| `class`                | `class`                          | `@interface`                     | [备注](#classes)                                                             |
| `interface`            | `protocol`                       | `@protocol`                      |                                                                              |
| `constructor`/`create` | Initializer                      | Initializer                      | [备注](#initializers)                                                        |
| Property               | Property                         | Property                         | [备注 1](#top-level-functions-and-properties)、[备注 2](#setters)              |
| Method                 | Method                           | Method                           | [备注 1](#top-level-functions-and-properties)、[备注 2](#method-names-translation) |
| `enum class`           | `class`                          | `@interface`                     | [备注](#enums)                                                               |
| `suspend` ->           | `completionHandler:`/ `async`    | `completionHandler:`             | [备注 1](#errors-and-exceptions)、[备注 2](#suspending-functions)            |
| `@Throws fun`          | `throws`                         | `error:(NSError**)error`         | [备注](#errors-and-exceptions)                                               |
| Extension              | Extension                        | Category member                  | [备注](#extensions-and-category-members)                                     |
| `companion` member <-  | Class method or property         | Class method or property         |                                                                              |
| `null`                 | `nil`                            | `nil`                            |                                                                              |
| `Singleton`            | `shared` or `companion` property | `shared` or `companion` property | [备注](#kotlin-singletons)                                                   |
| Primitive type         | Primitive type / `NSNumber`      |                                  | [备注](#primitive-types)                                                     |
| `Unit` return type     | `Void`                           | `void`                           |                                                                              |
| `String`               | `String`                         | `NSString`                       | [备注](#strings)                                                             |
| `String`               | `NSMutableString`                | `NSMutableString`                | [备注](#nsmutablestring)                                                     |
| `List`                 | `Array`                          | `NSArray`                        |                                                                              |
| `MutableList`          | `NSMutableArray`                 | `NSMutableArray`                 |                                                                              |
| `Set`                  | `Set`                            | `NSSet`                          |                                                                              |
| `MutableSet`           | `NSMutableSet`                   | `NSMutableSet`                   | [备注](#collections)                                                         |
| `Map`                  | `Dictionary`                     | `NSDictionary`                   |                                                                              |
| `MutableMap`           | `NSMutableDictionary`            | `NSMutableDictionary`            | [备注](#collections)                                                         |
| Function type          | Function type                    | Block pointer type               | [备注](#function-types)                                                      |
| Inline classes         | Unsupported                      | Unsupported                      | [备注](#unsupported)                                                         |

### 类

#### 名称转换

Objective-C 类以其原始名称导入到 Kotlin 中。
协议作为接口导入，并带有 `Protocol` 名称后缀，例如 `@protocol Foo` -> `interface FooProtocol`。
这些类和接口被放置在 [构建配置中指定的](#importing-swift-objective-c-libraries-to-kotlin) 包中（预配置的系统框架使用 `platform.*` 包）。

Kotlin 类和接口的名称在导入到 Objective-C 时会添加前缀。
前缀源自框架名称。

Objective-C 不支持框架中的包。如果 Kotlin 编译器在同一框架中发现名称相同但包不同的 Kotlin 类，它会重命名它们。此算法尚不稳定，可能会在 Kotlin 版本之间发生变化。为了解决这个问题，你可以在框架中重命名冲突的 Kotlin 类。

#### 强链接

每当你在 Kotlin 源代码中使用 Objective-C 类时，它都会被标记为强链接符号。生成的构建产物会将相关符号作为强外部引用提及。

这意味着应用程序在启动时会尝试动态链接符号，如果它们不可用，应用程序会崩溃。
即使从未使用过这些符号，也会发生崩溃。符号可能在特定设备或操作系统版本上不可用。

为了解决此问题并避免“符号未找到”错误，请使用 Swift 或 Objective-C 包装器来检查类是否实际可用。[请参阅 Compose Multiplatform 框架中此解决方案的实现方式](https://github.com/JetBrains/compose-multiplatform-core/pull/1278/files)。

### 初始化器

Swift/Objective-C 初始化器作为构造函数或名为 `create` 的工厂方法导入到 Kotlin。
后者发生在 Objective-C 分类或 Swift 扩展中声明的初始化器上，
因为 Kotlin 没有扩展构造函数的概念。

> 在将 Swift 初始化器导入 Kotlin 之前，不要忘记用 `@objc` 对它们进行注解。
>
{style="tip"}

Kotlin 构造函数作为初始化器导入到 Swift/Objective-C。

### Setter

可写的 Objective-C 属性覆盖超类的只读属性时，表示为属性 `foo` 的 `setFoo()` 方法。同样适用于作为可变属性实现的协议只读属性。

### 顶层函数和属性

顶层 Kotlin 函数和属性可作为特殊类的成员访问。
每个 Kotlin 文件都会被翻译成这样一个类，例如：

```kotlin
// MyLibraryUtils.kt
package my.library

fun foo() {}
```

然后你可以像这样从 Swift 调用 `foo()` 函数：

```swift
MyLibraryUtilsKt.foo()
```

在 Kotlin-Swift 互操作百科中查看访问顶层 Kotlin 声明的示例合集：

*   [顶层函数](https://github.com/kotlin-hands-on/kotlin-swift-interopedia/blob/main/docs/overview/Top-level%20functions.md)
*   [顶层只读属性](https://github.com/kotlin-hands-on/kotlin-swift-interopedia/blob/main/docs/functionsandproperties/Top-level%20val%20properties.md)
*   [顶层可变属性](https://github.com/kotlin-hands-on/kotlin-swift-interopedia/blob/main/docs/functionsandproperties/Top-level%20mutable%20var%20properties.md)

### 方法名称转换

通常，Swift 参数标签和 Objective-C 选择器片段会映射到 Kotlin 参数名称。这两个概念具有不同的语义，因此有时 Swift/Objective-C 方法可能以冲突的 Kotlin 签名导入。
在这种情况下，冲突的方法可以使用具名参数从 Kotlin 调用，例如：

```swift
[player moveTo:LEFT byMeters:17]
[player moveTo:UP byInches:42]
```

在 Kotlin 中，它是：

```kotlin
player.moveTo(LEFT, byMeters = 17)
player.moveTo(UP, byInches = 42)
```

以下是 `kotlin.Any` 函数如何映射到 Swift/Objective-C：

| Kotlin       | Swift          | Objective-C   |
|--------------|----------------|---------------|
| `equals()`   | `isEquals(_:)` | `isEquals:`   |
| `hashCode()` | `hash`         | `hash`        |
| `toString()` | `description`  | `description` |

[在 Kotlin-Swift 互操作百科中查看数据类的示例](https://github.com/kotlin-hands-on/kotlin-swift-interopedia/blob/main/docs/classesandinterfaces/Data%20classes.md)。

你可以指定一个更符合 Swift 或 Objective-C 习惯的名称，而不是使用 [`@ObjCName` 注解](#change-declaration-names) 重命名 Kotlin 声明。

### 错误与异常

所有 Kotlin 异常都是非检查型的 (unchecked)，这意味着错误在运行时捕获。然而，Swift 只有在编译时处理的检查型错误 (checked errors)。因此，如果 Swift 或 Objective-C 代码调用了抛出异常的 Kotlin 方法，则该 Kotlin 方法应使用 `@Throws` 注解标记，并指定一个“预期”异常类列表。

编译为 Swift/Objective-C 框架时，具有或继承 `@Throws` 注解的非 `suspend` 函数在 Objective-C 中表示为生成 `NSError*` 的方法，在 Swift 中表示为 `throws` 方法。
`suspend` 函数的表示始终在完成处理器中包含 `NSError*`/`Error` 参数。

当从 Swift/Objective-C 代码调用的 Kotlin 函数抛出属于 `@Throws` 指定类或其子类之一的异常时，该异常会作为 `NSError` 传播。
其他到达 Swift/Objective-C 的 Kotlin 异常被视为未处理，并导致程序终止。

不带 `@Throws` 的 `suspend` 函数仅传播 `CancellationException`（作为 `NSError`）。
不带 `@Throws` 的非 `suspend` 函数根本不传播 Kotlin 异常。

请注意，相反的逆向翻译尚未实现：Swift/Objective-C 抛出错误的方法不会作为抛出异常的方法导入到 Kotlin。

[在 Kotlin-Swift 互操作百科中查看示例](https://github.com/kotlin-hands-on/kotlin-swift-interopedia/blob/main/docs/overview/Exceptions.md)。

### 枚举

Kotlin 枚举作为 `@interface` 导入 Objective-C，作为 `class` 导入 Swift。
这些数据结构具有与每个枚举值对应的属性。考虑以下 Kotlin 代码：

```kotlin
// Kotlin
enum class Colors {
    RED, GREEN, BLUE
}
```

你可以像这样从 Swift 访问此枚举类的属性：

```swift
// Swift
Colors.red
Colors.green
Colors.blue
```

要在 Swift `switch` 语句中使用 Kotlin 枚举的变量，请提供一个 `default` 语句以防止编译错误：

```swift
switch color {
    case .red: print("It's red")
    case .green: print("It's green")
    case .blue: print("It's blue")
    default: fatalError("No such color")
}
```

[在 Kotlin-Swift 互操作百科中查看另一个示例](https://github.com/kotlin-hands-on/kotlin-swift-interopedia/blob/main/docs/classesandinterfaces/Enum%20classes.md)。

### 挂起函数

> 支持从 Swift 代码以 `async` 方式调用 `suspend` 函数为[实验性](components-stability.md)功能。
> 它可能随时被取消或更改。
> 仅将其用于评估目的。我们非常感谢你在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-47610) 上提供反馈。
>
{style="warning"}

Kotlin 的[挂起函数](coroutines-basics.md) (`suspend`) 在生成的 Objective-C 头文件中表现为带有回调的函数，或在 Swift/Objective-C 术语中称为[完成处理器](https://developer.apple.com/documentation/swift/calling_objective-c_apis_ asynchronously)。

从 Swift 5.5 开始，Kotlin 的 `suspend` 函数也可以从 Swift 作为 `async` 函数调用，而无需使用完成处理器。目前，此功能仍处于高度实验阶段，并具有一定的限制。有关详细信息，请参阅 [此 YouTrack 问题](https://youtrack.jetbrains.com/issue/KT-47610)。

*   在 [Swift 文档](https://docs.swift.org/swift-book/LanguageGuide/Concurrency.html) 中了解更多关于 `async`/`await` 机制的信息。
*   在 [Kotlin-Swift 互操作百科](https://github.com/kotlin-hands-on/kotlin-swift-interopedia/blob/main/docs/coroutines/Suspend%20functions.md) 中查看实现相同功能的第三方库的示例和建议。

### 扩展和分类成员

Objective-C 分类和 Swift 扩展的成员通常作为扩展导入到 Kotlin 中。这就是为什么这些声明不能在 Kotlin 中被覆盖，并且扩展初始化器不能作为 Kotlin 构造函数使用。

> 目前有两个例外。从 Kotlin 1.8.20 开始，与 NSView 类（来自 AppKit 框架）或 UIView 类（来自 UIKit 框架）在相同头文件中声明的分类成员，会被作为这些类的成员导入。这意味着你可以覆盖从 NSView 或 UIView 继承的方法。
>
{style="note"}

Kotlin 对“常规”Kotlin 类的扩展会分别作为扩展和分类成员导入到 Swift 和 Objective-C。Kotlin 对其他类型的扩展被视为带有一个额外接收器参数的[顶层声明](#top-level-functions-and-properties)。这些类型包括：

*   Kotlin `String` 类型
*   Kotlin 集合类型和子类型
*   Kotlin `interface` 类型
*   Kotlin 基本类型
*   Kotlin 内联类
*   Kotlin `Any` 类型
*   Kotlin 函数类型和子类型
*   Objective-C 类和协议

[在 Kotlin-Swift 互操作百科中查看示例合集](https://github.com/kotlin-hands-on/kotlin-swift-interopedia/tree/main/docs/extensions)。

### Kotlin 单例

Kotlin 单例（由 `object` 声明创建，包括 `companion object`）作为只有一个实例的类导入到 Swift/Objective-C。

该实例可通过 `shared` 和 `companion` 属性访问。

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

访问这些对象如下所示：

```swift
MyObject.shared
MyObject.shared.x
MyClass.companion
MyClass.Companion.shared
```

> 在 Objective-C 中通过 `[MySingleton mySingleton]` 以及在 Swift 中通过 `MySingleton()` 访问对象的方式已被弃用。
>
{style="note"}

在 Kotlin-Swift 互操作百科中查看更多示例：

*   [如何使用 `shared` 访问 Kotlin 对象](https://github.com/kotlin-hands-on/kotlin-swift-interopedia/blob/main/docs/classesandinterfaces/Objects.md)
*   [如何从 Swift 访问 Kotlin 伴生对象的成员](https://github.com/kotlin-hands-on/kotlin-swift-interopedia/blob/main/docs/classesandinterfaces/Companion%20objects.md)。

### 基本类型

Kotlin 基本类型装箱被映射到特殊的 Swift/Objective-C 类。例如，`kotlin.Int` 装箱在 Swift 中表示为 `KotlinInt` 类实例（或在 Objective-C 中表示为 `${prefix}Int` 实例，其中 `prefix` 是框架的名称前缀）。
这些类派生自 `NSNumber`，因此实例是支持所有相应操作的正确 `NSNumber`。

当用作 Swift/Objective-C 参数类型或返回值时，`NSNumber` 类型不会自动翻译为 Kotlin 基本类型。原因是 `NSNumber` 类型没有提供足够关于包装的基本值类型的信息，例如，`NSNumber` 在静态上不知道是 `Byte`、`Boolean` 还是 `Double`。因此 Kotlin 基本值应[手动转换为 `NSNumber` 和从 `NSNumber` 转换](#casting-between-mapped-types)。

### 字符串

当 Kotlin `String` 传递给 Swift 时，它首先作为 Objective-C 对象导出，然后 Swift 编译器会再次复制它以进行 Swift 转换。这会导致额外的运行时开销。

为避免这种情况，请在 Swift 中直接将 Kotlin 字符串作为 Objective-C `NSString` 访问。
[查看转换示例](#see-the-conversion-example)。

#### NSMutableString

`NSMutableString` Objective-C 类在 Kotlin 中不可用。
`NSMutableString` 的所有实例在传递给 Kotlin 时都会被复制。

### 集合

#### Kotlin -> Objective-C -> Swift

当 Kotlin 集合传递给 Swift 时，它首先被转换为等效的 Objective-C 对象，然后 Swift 编译器会复制整个集合并将其转换为 Swift 原生集合，如[映射表](#mappings)中所述。

这最后一步转换会导致性能开销。为防止这种情况，在 Swift 中使用 Kotlin 集合时，请明确地将它们转换为对应的 Objective-C 类型：`NSDictionary`、`NSArray` 或 `NSSet`。

##### 查看转换示例 {initial-collapse-state="collapsed" collapsible="true"}

例如，以下 Kotlin 声明：

```kotlin
val map: Map<String, String>
```

在 Swift 中可能如下所示：

```Swift
map[key]?.count ?? 0
```

在这里，`map` 被隐式转换为 Swift 的 `Dictionary`，其字符串值映射到 Swift 的 `String`。
这会导致性能开销。

为避免转换，请明确地将 `map` 转换为 Objective-C 的 `NSDictionary`，并以 `NSString` 方式访问值：

```Swift
let nsMap: NSDictionary = map as NSDictionary
(nsMap[key] as? NSString)?.length ?? 0
```

这确保 Swift 编译器不会执行额外的转换步骤。

#### Swift -> Objective-C -> Kotlin

Swift/Objective-C 集合映射到 Kotlin 的方式如[映射表](#mappings)所述，但 `NSMutableSet` 和 `NSMutableDictionary` 除外。

`NSMutableSet` 不会转换为 Kotlin 的 `MutableSet`。要将对象传递给 Kotlin `MutableSet`，请明确创建这种 Kotlin 集合。例如，在 Kotlin 中使用 `mutableSetOf()` 函数，或在 Swift 中使用 `KotlinMutableSet` 类，在 Objective-C 中使用 `${prefix}MutableSet`（`prefix` 是框架名称前缀）。
`MutableMap` 也是如此。

[在 Kotlin-Swift 互操作百科中查看示例](https://github.com/kotlin-hands-on/kotlin-swift-interopedia/blob/main/docs/overview/Collections.md)。

### 函数类型

Kotlin 函数类型对象（例如 lambda 表达式）在 Swift 中转换为函数，在 Objective-C 中转换为块 (block)。
[在 Kotlin-Swift 互操作百科中查看带有 lambda 的 Kotlin 函数示例](https://github.com/kotlin-hands-on/kotlin-swift-interopedia/blob/main/docs/functionsandproperties/Functions%20returning%20function%20type.md)。

然而，在翻译函数和函数类型时，参数和返回值的类型映射方式有所不同。在后一种情况下，基本类型会映射到它们的装箱表示。Kotlin `Unit` 返回值在 Swift/Objective-C 中表示为相应的 `Unit` 单例。这个单例的值可以像其他任何 Kotlin `object` 一样获取。请参阅上面[表格](#mappings)中的单例。

考虑以下 Kotlin 函数：

```kotlin
fun foo(block: (Int) -> Unit) { ... }
```

它在 Swift 中表示如下：

```swift
func foo(block: (KotlinInt) -> KotlinUnit)
```

你可以这样调用它：

```kotlin
foo {
    bar($0 as! Int32)
    return KotlinUnit()
}
```

### 泛型

Objective-C 支持在类中定义的“轻量级泛型”，其功能集相对有限。Swift 可以导入在类上定义的泛型，以帮助向编译器提供额外的类型信息。

Objective-C 和 Swift 对泛型特性的支持与 Kotlin 不同，因此翻译将不可避免地丢失一些信息，但受支持的特性保留了有意义的信息。

有关如何在 Swift 中使用 Kotlin 泛型的具体示例，请参阅 [Kotlin-Swift 互操作百科](https://github.com/kotlin-hands-on/kotlin-swift-interopedia/blob/main/docs/overview/ShouldRefineInSwift.md)。

#### 限制

Objective-C 泛型不支持 Kotlin 或 Swift 的所有特性，因此在翻译过程中会丢失一些信息。

泛型只能在类上定义，不能在接口（Objective-C 和 Swift 中的协议）或函数上定义。

#### 可空性

Kotlin 和 Swift 都将可空性定义为类型规范的一部分，而 Objective-C 在类型的方法和属性上定义可空性。因此，以下 Kotlin 代码：

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

为了支持潜在可空类型，Objective-C 头文件需要将 `myVal` 定义为可空返回值。

为了缓解这个问题，定义泛型类时，如果泛型类型_绝不_可为空，请提供一个非空类型约束：

```kotlin
class Sample<T : Any>() {
    fun myVal(): T
}
```

这将强制 Objective-C 头文件将 `myVal` 标记为非空。

#### 变体

Objective-C 允许泛型被声明为协变或逆变。Swift 不支持变体。来自 Objective-C 的泛型类可以根据需要强制转换。

```kotlin
data class SomeData(val num: Int = 42) : BaseData()
class GenVarOut<out T : Any>(val arg: T)
```

```swift
let variOut = GenVarOut<SomeData>(arg: sd)
let variOutAny : GenVarOut<BaseData> = variOut as! GenVarOut<BaseData>
```

#### 约束

在 Kotlin 中，你可以为泛型类型提供上限。Objective-C 也支持这一点，但在更复杂的场景中此支持不可用，并且目前在 Kotlin - Objective-C 互操作中不支持。这里的一个例外是，非空上限将使 Objective-C 方法/属性变为非空。

#### 禁用

要使框架头文件不包含泛型，请在你的构建文件中添加以下编译器选项：

```kotlin
binaries.framework {
    freeCompilerArgs += "-Xno-objc-generics"
}
```

## 前向声明

要导入前向声明，请使用 `objcnames.classes` 和 `objcnames.protocols` 包。例如，
要导入在具有 `library.package` 的 Objective-C 库中声明的 `objcprotocolName` 前向声明，
请使用特殊的前向声明包：`import objcnames.protocols.objcprotocolName`。

考虑两个 objcinterop 库：一个使用 `objcnames.protocols.ForwardDeclaredProtocolProtocol`
另一个在另一个包中具有实际实现：

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

要在两个库之间传输对象，请在你的 Kotlin 代码中使用显式 `as` 转换：

```kotlin
// Kotlin code:
fun test() {
    consumeProtocol(produceProtocol() as objcnames.protocols.ForwardDeclaredProtocolProtocol)
}
```

> 你只能从相应的实际类转换为 `objcnames.protocols.ForwardDeclaredProtocolProtocol`。
> 否则，你会得到一个错误。
>
{style="note"}

## 映射类型之间的转换

编写 Kotlin 代码时，可能需要将对象从 Kotlin 类型转换为等效的 Swift/Objective-C 类型（反之亦然）。在这种情况下，可以使用普通的 Kotlin 转换，例如：

```kotlin
val nsArray = listOf(1, 2, 3) as NSArray
val string = nsString as String
val nsNumber = 42 as NSNumber
```

## 子类化

### 从 Swift/Objective-C 子类化 Kotlin 类和接口

Kotlin 类和接口可以被 Swift/Objective-C 类和协议子类化。

### 从 Kotlin 子类化 Swift/Objective-C 类和协议

Swift/Objective-C 类和协议可以使用 Kotlin `final` 类进行子类化。继承 Swift/Objective-C 类型的非 `final` Kotlin 类尚不支持，因此无法声明继承 Swift/Objective-C 类型的复杂类层次结构。

普通方法可以使用 Kotlin 的 `override` 关键字进行覆盖。在这种情况下，覆盖方法必须与被覆盖方法具有相同的参数名称。

有时需要覆盖初始化器，例如在子类化 `UIViewController` 时。作为 Kotlin 构造函数导入的初始化器可以被标记有 `@OverrideInit` 注解的 Kotlin 构造函数覆盖：

```swift
class ViewController : UIViewController {
    @OverrideInit constructor(coder: NSCoder) : super(coder)

    ...
}
```

覆盖构造函数必须与被覆盖构造函数具有相同的参数名称和类型。

要覆盖具有冲突 Kotlin 签名的不同方法，你可以将 `@ObjCSignatureOverride` 注解添加到类上。
该注解指示 Kotlin 编译器忽略冲突的重载，以防 Objective-C 类继承了几个参数类型相同但参数名称不同的函数。

默认情况下，Kotlin/Native 编译器不允许将非指定 Objective-C 初始化器作为 `super()` 构造函数调用。如果 Objective-C 库中未正确标记指定初始化器，则此行为可能不方便。要禁用这些编译器检查，请将 `disableDesignatedInitializerChecks = true` 添加到库的 [`.def` 文件](native-definition-file.md)。

## C 特性

有关库使用某些纯 C 特性（例如不安全指针、结构体等）的示例，请参阅[与 C 的互操作性](native-c-interop.md)。

## 不支持

Kotlin 编程语言的一些特性尚未映射到 Objective-C 或 Swift 的相应特性。
目前，以下特性未在生成的框架头文件中正确公开：

*   内联类（参数被映射为底层基本类型或 `id`）
*   实现标准 Kotlin 集合接口（`List`、`Map`、`Set`）的自定义类以及其他特殊类
*   Objective-C 类的 Kotlin 子类