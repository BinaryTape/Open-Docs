---
title: "与 Swift/Objective-C 的互操作性"
---
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

:::note
Objective-C 库的导入是 [实验性的](components-stability#stability-levels-explained)。
所有由 cinterop 工具从 Objective-C 库生成的 Kotlin 声明都应该带有 `@ExperimentalForeignApi` 注解。

Kotlin/Native 附带的 Native 平台库（如 Foundation、UIKit 和 POSIX）仅对某些 API 需要选择加入。

本文档涵盖了 Kotlin/Native 与 Swift/Objective-C 互操作性的一些方面：如何在 Swift/Objective-C 代码中使用 Kotlin 声明，以及如何在 Kotlin 代码中使用 Objective-C 声明。

您可能会发现一些其他有用的资源：

* [Kotlin-Swift interopedia](https://github.com/kotlin-hands-on/kotlin-swift-interopedia)，其中包含如何在 Swift 代码中使用 Kotlin 声明的示例集合。
* [与 Swift/Objective-C ARC 集成](native-arc-integration) 部分，涵盖了 Kotlin 的追踪 GC 和 Objective-C 的 ARC 之间集成的细节。

## 将 Swift/Objective-C 库导入 Kotlin

如果正确导入到构建中，Objective-C 框架和库可以在 Kotlin 代码中使用（默认情况下会导入系统框架）。
有关更多详细信息，请参见：

* [创建和配置库定义文件](native-definition-file)
* [配置 Native 库的编译](multiplatform-configure-compilations#configure-interop-with-native-languages)

如果 Swift 库的 API 使用 `@objc` 导出到 Objective-C，则可以在 Kotlin 代码中使用 Swift 库。
目前尚不支持纯 Swift 模块。

## 在 Swift/Objective-C 中使用 Kotlin

如果将 Kotlin 模块编译为框架，则可以在 Swift/Objective-C 代码中使用：

* 请参阅[构建最终 Native 二进制文件](multiplatform-build-native-binaries#declare-binaries) 以了解如何声明二进制文件。
* 查看 [Kotlin Multiplatform 示例项目](https://github.com/Kotlin/kmm-basic-sample) 以获取示例。

### 从 Objective-C 和 Swift 中隐藏 Kotlin 声明

`@HiddenFromObjC` 注解是 [实验性的](components-stability#stability-levels-explained) 并且需要 [选择加入](opt-in-requirements)。

为了使您的 Kotlin 代码对 Objective-C/Swift 更加友好，您可以使用 `@HiddenFromObjC` 从 Objective-C 和 Swift 中隐藏 Kotlin 声明。
该注解禁用将函数或属性导出到 Objective-C。

或者，您可以使用 `internal` 修饰符标记 Kotlin 声明，以限制其在编译模块中的可见性。
如果您只想从 Objective-C 和 Swift 中隐藏 Kotlin 声明，但仍然希望它对其他 Kotlin 模块可见，请选择 `@HiddenFromObjC`。

[请参阅 Kotlin-Swift interopedia 中的示例](https://github.com/kotlin-hands-on/kotlin-swift-interopedia/blob/main/docs/overview/HiddenFromObjC)。

### 在 Swift 中使用 refining

`@ShouldRefineInSwift` 注解是 [实验性的](components-stability#stability-levels-explained) 并且需要 [选择加入](opt-in-requirements)。

`@ShouldRefineInSwift` 有助于用 Swift 编写的包装器替换 Kotlin 声明。
该注解将函数或属性标记为生成的 Objective-C API 中的 `swift_private`。
此类声明带有 `__` 前缀，这使得它们在 Swift 中不可见。

您仍然可以在 Swift 代码中使用这些声明来创建 Swift 友好的 API，但它们不会在 Xcode 自动完成中建议。

* 有关在 Swift 中 refining Objective-C 声明的更多信息，请参见 [Apple 官方文档](https://developer.apple.com/documentation/swift/improving-objective-c-api-declarations-for-swift)。
* 有关如何使用 `@ShouldRefineInSwift` 注解的示例，请参见 [Kotlin-Swift interopedia](https://github.com/kotlin-hands-on/kotlin-swift-interopedia/blob/main/docs/overview/ShouldRefineInSwift)。

### 更改声明名称

`@ObjCName` 注解是 [实验性的](components-stability#stability-levels-explained) 并且需要 [选择加入](opt-in-requirements)。

要避免重命名 Kotlin 声明，请使用 `@ObjCName` 注解。
它指示 Kotlin 编译器对带注解的类、接口或其他 Kotlin 实体使用自定义的 Objective-C 和 Swift 名称：

```kotlin
@ObjCName(swiftName = "MySwiftArray")
class MyKotlinArray {
    @ObjCName("index")
    fun indexOf(@ObjCName("of") element: String): Int = TODO()
}

// 使用 ObjCName 注解的用法
let array = MySwiftArray()
let index = array.index(of: "element")
```

[请参阅 Kotlin-Swift interopedia 中的另一个示例](https://github.com/kotlin-hands-on/kotlin-swift-interopedia/blob/main/docs/overview/ObjCName)。

### 使用 KDoc 注释提供文档

文档对于理解任何 API 至关重要。
为共享的 Kotlin API 提供文档使您能够就用法、注意事项等问题与其用户进行交流。

默认情况下，生成 Objective-C 标头时，[KDocs](kotlin-doc) 注释不会转换为相应的注释。
例如，以下带有 KDoc 的 Kotlin 代码：

```kotlin
/**
 * 打印参数的总和。
 * 正确处理总和不适合 32 位整数的情况。
 */
fun printSum(a: Int, b: Int) = println(a.toLong() + b)
```

将生成一个没有任何注释的 Objective-C 声明：

```objc
+ (void)printSumA:(int32_t)a b:(int32_t)b __attribute__((swift_name("printSum(a:b:)")));
```

要启用 KDoc 注释的导出，请将以下编译器选项添加到您的 `build.gradle(.kts)`：

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
kotlin {
    targets.withType<org.jetbrains.kotlin.gradle.plugin.mpp.KotlinNativeTarget> {
        compilations.get("main").compilerOptions.options.freeCompilerArgs.add("-Xexport-kdoc")
    }
}
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
kotlin {
    targets.withType(org.jetbrains.kotlin.gradle.plugin.mpp.KotlinNativeTarget) {
        compilations.get("main").compilerOptions.options.freeCompilerArgs.add("-Xexport-kdoc")
    }
}
```

</TabItem>
</Tabs>

之后，Objective-C 标头将包含相应的注释：

```objc
/**
 * 打印参数的总和。
 * 正确处理总和不适合 32 位整数的情况。
 */
+ (void)printSumA:(int32_t)a b:(int32_t)b __attribute__((swift_name("printSum(a:b:)")));
```

您将能够在自动完成中看到类和方法的注释，例如，在 Xcode 中。
如果您转到函数的定义（在 `.h` 文件中），您将看到关于 `@param`、`@return` 等的注释。

已知限制：

将 KDoc 注释导出到生成的 Objective-C 标头的功能是 [实验性的](components-stability)。
它可能随时被删除或更改。
需要选择加入（请参阅下面的详细信息），您应该仅将其用于评估目的。
我们感谢您在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-38600) 中提供有关它的反馈。

* 除非依赖项本身使用 `-Xexport-kdoc` 编译，否则不会导出依赖项文档。
  该功能是实验性的，因此使用此选项编译的库可能与其他编译器版本不兼容。
* KDoc 注释主要按原样导出。许多 KDoc 功能，例如 `@property`，不受支持。

## 映射

下表显示了 Kotlin 概念如何映射到 Swift/Objective-C，反之亦然。

"`->`" 和 "`<-`" 表示映射仅单向进行。

| Kotlin                 | Swift                            | Objective-C                      | 备注                                                                              |
|------------------------|----------------------------------|----------------------------------|------------------------------------------------------------------------------------|
| `class`                | `class`                          | `@interface`                     | [备注](#classes)                                                                   |
| `interface`            | `protocol`                       | `@protocol`                      |                                                                                    |
| `constructor`/`create` | Initializer                      | Initializer                      | [备注](#initializers)                                                              |
| Property               | Property                         | Property                         | [备注 1](#top-level-functions-and-properties)，[备注 2](#setters)                  |
| Method                 | Method                           | Method                           | [备注 1](#top-level-functions-and-properties)，[备注 2](#method-names-translation) |
| `enum class`           | `class`                          | `@interface`                     | [备注](#enums)                                                                     |
| `suspend` `->`           | `completionHandler:`/ `async`    | `completionHandler:`             | [备注 1](#errors-and-exceptions)，[备注 2](#suspending-functions)                  |
| `@Throws fun`          | `throws`                         | `error:(NSError**)error`         | [备注](#errors-and-exceptions)                                                     |
| Extension              | Extension                        | Category member                  | [备注](#extensions-and-category-members)                                           |
| `companion` member `<-`  | Class method or property         | Class method or property         |                                                                                    |
| `null`                 | `nil`                            | `nil`                            |                                                                                    |
| `Singleton`            | `shared` or `companion` property | `shared` or `companion` property | [备注](#kotlin-singletons)                                                         |
| Primitive type         | Primitive type / `NSNumber`      |                                  | [备注](#nsnumber)                                                                  |
| `Unit` return type     | `Void`                           | `void`                           |                                                                                    |
| `String`               | `String`                         | `NSString`                       |                                                                                    |
| `String`               | `NSMutableString`                | `NSMutableString`                | [备注](#nsmutablestring)                                                           |
| `List`                 | `Array`                          | `NSArray`                        |                                                                                    |
| `MutableList`          | `NSMutableArray`                 | `NSMutableArray`                 |                                                                                    |
| `Set`                  | `Set`                            | `NSSet`                          |                                                                                    |
| `MutableSet`           | `NSMutableSet`                   | `NSMutableSet`                   | [备注](#collections)                                                               |
| `Map`                  | `Dictionary`                     | `NSDictionary`                   |                                                                                    |
| `MutableMap`           | `NSMutableDictionary`            | `NSMutableDictionary`            | [备注](#collections)                                                               |
| Function type          | Function type                    | Block pointer type               | [备注](#function-types)                                                            |
| Inline classes         | Unsupported                      | Unsupported                      | [备注](#unsupported)                                                               |

### 类 (Classes)

#### 名称转换

Objective-C 类以其原始名称导入到 Kotlin 中。
协议作为带有 `Protocol` 名称后缀的接口导入，例如，`@protocol Foo` `->` `interface FooProtocol`。
这些类和接口放置在[构建配置中指定的包](#importing-swift-objective-c-libraries-to-kotlin)中
（预配置的系统框架的 `platform.*` 包）。

Kotlin 类和接口的名称在导入到 Objective-C 时会添加前缀。
该前缀派生自框架名称。

Objective-C 不支持框架中的包。如果 Kotlin 编译器在同一框架中找到具有相同名称但不同包的 Kotlin 类，它会重命名它们。
此算法尚不稳定，并且可能在 Kotlin 版本之间发生更改。要解决此问题，您可以在框架中重命名冲突的 Kotlin 类。

#### 强链接

每当您在 Kotlin 源代码中使用 Objective-C 类时，它都会被标记为强链接符号。
生成的构建工件将相关符号标记为强外部引用。

这意味着应用程序尝试在启动期间动态链接符号，如果这些符号不可用，则应用程序会崩溃。
即使从未使用的符号，也会发生崩溃。符号可能在特定设备或操作系统版本上不可用。

要解决此问题并避免“Symbol not found”错误，请使用 Swift 或 Objective-C 包装器来检查该类是否实际可用。
[请参阅 Compose Multiplatform 框架中如何实现此解决方法](https://github.com/JetBrains/compose-multiplatform-core/pull/1278/files)。

### 初始值设定项 (Initializers)

Swift/Objective-C 初始值设定项作为构造函数或名为 `create` 的工厂方法导入到 Kotlin 中。
后者发生在 Objective-C 类别中声明的初始值设定项或作为 Swift 扩展的情况下，因为 Kotlin 没有扩展构造函数的概念。

在将 Swift 初始值设定项导入到 Kotlin 之前，请不要忘记使用 `@objc` 对其进行注解。

Kotlin 构造函数作为初始值设定项导入到 Swift/Objective-C 中。

### Setters

覆盖超类的只读属性的可写 Objective-C 属性表示为属性 `foo` 的 `setFoo()` 方法。
协议的可变属性的只读属性也是如此。

### 顶层函数和属性 (Top-level functions and properties)

顶层 Kotlin 函数和属性可以作为特殊类的成员访问。
每个 Kotlin 文件都会转换为这样的类，例如：

```kotlin
// MyLibraryUtils.kt
package my.library

fun foo() {}
```

然后，您可以像这样从 Swift 调用 `foo()` 函数：

```swift
MyLibraryUtilsKt.foo()
```

请参阅 Kotlin-Swift interopedia 中访问顶层 Kotlin 声明的示例集合：

* [顶层函数](https://github.com/kotlin-hands-on/kotlin-swift-interopedia/blob/main/docs/overview/Top-level%20functions)
* [顶层只读属性](https://github.com/kotlin-hands-on/kotlin-swift-interopedia/blob/main/docs/functionsandproperties/Top-level%20val%20properties)
* [顶层可变属性](https://github.com/kotlin-hands-on/kotlin-swift-interopedia/blob/main/docs/functionsandproperties/Top-level%20mutable%20var%20properties)

### 方法名称转换

通常，Swift 参数标签和 Objective-C 选择器片段映射到 Kotlin 参数名称。
这两个概念具有不同的语义，因此有时 Swift/Objective-C 方法可以导入为具有冲突的 Kotlin 签名。
在这种情况下，可以使用命名参数从 Kotlin 调用冲突的方法，例如：

```swift
[player moveTo:LEFT byMeters:17]
[player moveTo:UP byInches:42]
```

在 Kotlin 中，它是：

```kotlin
player.moveTo(LEFT, byMeters = 17)
player.moveTo(UP, byInches = 42)
```

以下是如何将 `kotlin.Any` 函数映射到 Swift/Objective-C：

| Kotlin       | Swift          | Objective-C   |
|--------------|----------------|---------------|
| `equals()`   | `isEquals(_:)` | `isEquals:`   |
| `hashCode()` | `hash`         | `hash`        |
| `toString()` | `description`  | `description` |

[请参阅 Kotlin-Swift interopedia 中数据类的示例](https://github.com/kotlin-hands-on/kotlin-swift-interopedia/blob/main/docs/classesandinterfaces/Data%20classes)。

您可以在 Swift 或 Objective-C 中指定更符合语言习惯的名称，而不是使用 [`@ObjCName` 注解](#change-declaration-names) 重命名 Kotlin 声明。

### 错误和异常

所有 Kotlin 异常都是未经检查的，这意味着在运行时捕获错误。
但是，Swift 只有在编译时处理的已检查错误。
因此，如果 Swift 或 Objective-C 代码调用一个抛出异常的 Kotlin 方法，则应使用 `@Throws` 注解标记 Kotlin 方法，指定“预期”异常类的列表。

编译到 Objective-C/Swift 框架时，具有或继承 `@Throws` 注解的非 `suspend` 函数在 Objective-C 中表示为 `NSError*`-producing 方法，在 Swift 中表示为 `throws` 方法。
`suspend` 函数的表示形式始终在 completion handler 中具有 `NSError*`/`Error` 参数。

当从 Swift/Objective-C 代码调用的 Kotlin 函数抛出异常，该异常是 `@Throws` 指定的类或其子类的实例时，它将作为 `NSError` 传播。
到达 Swift/Objective-C 的其他 Kotlin 异常被视为未处理并导致程序终止。

没有 `@Throws` 的 `suspend` 函数仅传播 `CancellationException`（作为 `NSError`）。
没有 `@Throws` 的非 `suspend` 函数根本不传播 Kotlin 异常。

请注意，尚未实现相反的反向转换：Swift/Objective-C 抛出错误的方法不会作为抛出异常导入到 Kotlin。

[请参阅 Kotlin-Swift interopedia 中的示例](https://github.com/kotlin-hands-on/kotlin-swift-interopedia/blob/main/docs/overview/Exceptions)。

### 枚举 (Enums)

Kotlin 枚举作为 `@interface` 导入到 Objective-C 中，作为 `class` 导入到 Swift 中。
这些数据结构具有与每个枚举值对应的属性。考虑以下 Kotlin 代码：

```kotlin
// Kotlin
enum class Colors {
    RED, GREEN, BLUE
}
```

您可以按如下方式从 Swift 访问此枚举类的属性：

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

[请参阅 Kotlin-Swift interopedia 中的另一个示例](https://github.com/kotlin-hands-on/kotlin-swift-interopedia/blob/main/docs/classesandinterfaces/Enum%20classes)。

### 挂起函数 (Suspending functions)

从 Swift 代码调用 `suspend` 函数作为 `async` 的支持是 [实验性的](components-stability)。
它可能随时被删除或更改。
仅将其用于评估目的。我们感谢您在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-47610) 中提供有关它的反馈。

Kotlin 的[挂起函数](coroutines-basics) (`suspend`) 在生成的 Objective-C 标头中表示为带有回调的函数，或者在 Swift/Objective-C 术语中表示为 [completion handlers](https://developer.apple.com/documentation/swift/calling_objective-c_apis_asynchronously)。

从 Swift 5.5 开始，Kotlin 的 `suspend` 函数也可用于从 Swift 调用，作为不使用 completion handlers 的 `async` 函数。
当前，此功能是高度实验性的，并且具有某些限制。有关详细信息，请参见 [此 YouTrack 问题](https://youtrack.jetbrains.com/issue/KT-47610)。

* 在 [Swift 文档](https://docs.swift.org/swift-book/LanguageGuide/Concurrency.html) 中了解有关 [`async`/`await` 机制的更多信息。
* 请参阅 [Kotlin-Swift interopedia](https://github.com/kotlin-hands-on/kotlin-swift-interopedia/blob/main/docs/coroutines/Suspend%20functions) 中实现相同功能的第三方库的示例和建议。

### 扩展和类别成员 (Extensions and category members)

Objective-C 类别和 Swift 扩展的成员通常作为扩展导入到 Kotlin 中。
这就是为什么这些声明无法在 Kotlin 中重写，并且扩展初始值设定项不可用作 Kotlin 构造函数。

目前，有两个例外。从 Kotlin 1.8.20 开始，在与 NSView 类（来自 AppKit 框架）或 UIView 类（来自 UIKit 框架）相同的标头中声明的类别成员将作为这些类的成员导入。
这意味着您可以重写从 NSView 或 UIView 继承的方法。

Kotlin 对“常规”Kotlin 类的扩展分别作为扩展和类别成员导入到 Swift 和 Objective-C。
Kotlin 对其他类型的扩展被视为带有附加接收器参数的[顶层声明](#top-level-functions-and-properties)。这些类型包括：

* Kotlin `String` 类型
* Kotlin 集合类型和子类型
* Kotlin `interface` 类型
* Kotlin 原始类型
* Kotlin `inline` 类
* Kotlin `Any` 类型
* Kotlin 函数类型和子类型
* Objective-C 类和协议

[请参阅 Kotlin-Swift interopedia 中的示例集合](https://github.com/kotlin-hands-on/kotlin-swift-interopedia/tree/main/docs/extensions)。

### Kotlin 单例 (Kotlin singletons)

Kotlin 单例（使用 `object` 声明，包括 `companion object`）作为具有单个实例的类导入到 Swift/Objective-C。

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

:::note
在 Objective-C 中通过 `[MySingleton mySingleton]` 访问对象以及在 Swift 中通过 `MySingleton()` 访问对象已被弃用。

:::

请参阅 Kotlin-Swift interopedia 中的更多示例：

* [如何使用 `shared` 访问 Kotlin 对象](https://github.com/kotlin-hands-on/kotlin-swift-interopedia/blob/main/docs/classesandinterfaces/Objects)
* [如何从 Swift 访问 Kotlin 伴生对象的成员](https://github.com/kotlin-hands-on/kotlin-swift-interopedia/blob/main/docs/classesandinterfaces/Companion%20objects)。

### NSNumber

Kotlin 原始类型盒子映射到特殊的 Swift/Objective-C 类。例如，`kotlin.Int` 盒子在 Swift 中表示为 `KotlinInt` 类实例（或在 Objective-C 中表示为 `${prefix}Int` 实例，其中 `prefix` 是框架名称前缀）。
这些类派生自 `NSNumber`，因此实例是支持所有相应操作的适当 `NSNumber`。

当 `NSNumber` 类型用作 Swift/Objective-C 参数类型或返回值时，不会自动转换为 Kotlin 原始类型。
原因是 `NSNumber` 类型没有提供关于包装的原始值类型的足够信息，例如，`NSNumber` 在静态上未知是 `Byte`、`Boolean` 还是 `Double`。
因此，Kotlin 原始值应[手动强制转换为和从 `NSNumber`](#casting-between-mapped-types)。

### NSMutableString

`NSMutableString` Objective-C 类在 Kotlin 中不可用。
当传递给 Kotlin 时，`NSMutableString` 的所有实例都会被复制。

### 集合 (Collections)

Kotlin 集合按 [上表](#mappings) 中所述转换为 Swift/Objective-C 集合。
Swift/Objective-C 集合以相同的方式映射到 Kotlin，除了 `NSMutableSet` 和 `NSMutableDictionary`。

`NSMutableSet` 不会转换为 Kotlin `MutableSet`。要将对象传递给 Kotlin `MutableSet`，请显式创建这种 Kotlin 集合。
为此，请使用例如 Kotlin 中的 `mutableSetOf()` 函数或 Swift 中的 `KotlinMutableSet` 类以及 Objective-C 中的 `${prefix}MutableSet`（`prefix` 是框架名称前缀）。
对于 `MutableMap` 也是如此。

[请参阅 Kotlin-Swift interopedia 中的示例](https://github.com/kotlin-hands-on/kotlin-swift-interopedia/blob/main/docs/overview/Collections)。

### 函数类型

Kotlin 函数类型对象（例如，lambdas）转换为 Swift 中的函数和 Objective-C 中的块。
[请参阅 Kotlin-Swift interopedia 中带有 lambda 的 Kotlin 函数的示例](https://github.com/kotlin-hands-on/kotlin-swift-interopedia/blob/main/docs/functionsandproperties/Functions%20returning%20function%20type)。

但是，在翻译函数和函数类型时，参数和返回值类型的映射方式存在差异。
在后一种情况下，原始类型映射到其盒装表示形式。Kotlin `Unit` 返回值在 Swift/Objective-C 中表示为相应的 `Unit` 单例。
可以像检索任何其他 Kotlin `object` 一样检索此单例的值。请参阅[上表](#mappings)中的单例。

考虑以下 Kotlin 函数：

```kotlin
fun foo(block: (Int) `->` Unit) { ... }
```

它在 Swift 中表示如下：

```swift
func foo(block: (KotlinInt) `->` KotlinUnit)
```

您可以像这样调用它：

```kotlin
foo {
    bar($0 as! Int32)
    return KotlinUnit()
}
```

### 泛型 (Generics)

Objective-C 支持在类上定义的“轻量级泛型”，其功能集相对有限。Swift 可以导入在类上定义的泛型，以帮助向编译器提供其他类型信息。

Objective-C 和 Swift 的泛型功能支持与 Kotlin 不同，因此转换不可避免地会丢失一些信息，但是支持的功能保留了有意义的信息。

有关如何在 Swift 中使用 Kotlin 泛型的具体示例，请参见 [Kotlin-Swift interopedia](https://github.com/kotlin-hands-on/kotlin-swift-interopedia/blob/main/docs/overview/ShouldRefineInSwift)。

#### 限制

Objective-C 泛型不支持 Kotlin 或 Swift 的所有功能，因此在转换中会丢失一些信息。

泛型只能在类上定义，不能在接口（Objective-C 和 Swift 中的协议）或函数上定义。

#### 可空性 (Nullability)

Kotlin 和 Swift 都将可空性定义为类型规范的一部分，而 Objective-C 在类型的属性和方法上定义可空性。因此，以下 Kotlin 代码：

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

为了支持潜在的可空类型，Objective-C 标头需要使用可空返回值定义 `myVal`。

为了缓解这种情况，在定义泛型类时，如果泛型类型_永远不_应为 null，请提供非空类型约束：

```kotlin
class Sample<T : Any>() {
    fun myVal(): T
}
```

这将强制 Objective-C 标头将 `myVal` 标记为不可为空。

#### 变型 (Variance)

Objective-C 允许将泛型声明为协变或逆变。Swift 不支持变型。来自 Objective-C 的泛型类可以根据需要进行强制转换。

```kotlin
data class SomeData(val num: Int = 42) : BaseData()
class GenVarOut<out T : Any>(val arg: T)
```

```swift
let variOut = GenVarOut<SomeData>(arg: sd)
let variOutAny : GenVarOut<BaseData> = variOut as! GenVarOut<BaseData>
```

#### 约束 (Constraints)

在 Kotlin 中，您可以为泛型类型提供上限。Objective-C 也支持此功能，但是在更复杂的情况下，该支持不可用，并且当前在 Kotlin - Objective-C 互操作中不受支持。这里的例外是不可为空的上限将使 Objective-C 方法/属性不可为空。

#### 禁用 (To disable)

要使框架标头在没有泛型的情况下编写，请在您的构建文件中添加以下编译器选项：

```kotlin
binaries.framework {
    freeCompilerArgs += "-Xno-objc-generics"
}
```

### 前向声明 (Forward declarations)

要导入前向声明，请使用 `objcnames.classes` 和 `objcnames.protocols` 包。例如，要导入在带有 `library.package` 的 Objective-C 库中声明的 `objcprotocolName` 前向声明，请使用一个特殊的前向声明包：`import objcnames.protocols.objcprotocolName`。

考虑两个 objcinterop 库：一个使用 `objcnames.protocols.ForwardDeclaredProtocolProtocol`，另一个在另一个包中使用实际实现：

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

要在两个库之间传输对象，请在您的 Kotlin 代码中使用显式 `as` 强制转换：

```kotlin
// Kotlin code:
fun test() {
    consumeProtocol(produceProtocol() as objcnames.protocols.ForwardDeclaredProtocolProtocol)
}
```

:::note
您只能从相应的实际类转换为 `objcnames.protocols.ForwardDeclaredProtocolProtocol`。
否则，您将收到一个错误。

:::

## 映射类型之间的转换 (Casting between mapped types)

在编写 Kotlin 代码时，可能需要将对象从 Kotlin 类型转换为等效的 Swift/Objective-C 类型（或反之亦然）。
在这种情况下，可以使用普通的旧 Kotlin 强制转换，例如：

```kotlin
val nsArray = listOf(1, 2, 3) as NSArray
val string = nsString as String
val nsNumber = 42 as NSNumber
```

## 子类化 (Subclassing)

### 从 Swift/Objective-C 子类化 Kotlin 类和接口

Kotlin 类和接口可以被 Swift/Objective-C 类和协议子类化。

### 从 Kotlin 子类化 Swift/Objective-C 类和协议

可以使用 Kotlin `final` 类子类化 Swift/Objective-C 类和协议。尚不支持继承 Swift/Objective-C 类型的非 `final` Kotlin 类，因此无法声明继承 Swift/Objective-C 类型的复杂类层次结构。

可以使用 `override` Kotlin 关键字重写普通方法。在这种情况下，重写的方法必须与被重写的方法具有相同的参数名称。

有时需要重写初始值设定项，例如在子类化 `UIViewController` 时。作为 Kotlin 构造函数导入的初始值设定项可以被用 `@OverrideInit` 注解标记的 Kotlin 构造函数重写：

```swift
class ViewController : UIViewController {
    @OverrideInit constructor(coder: NSCoder) : super(coder)

    ...
}
```

重写构造函数必须与被重写的构造函数具有相同的参数名称和类型。

要使用冲突的 Kotlin 签名重写不同的方法，您可以将 `@ObjCSignatureOverride` 注解添加到该类。
该注解指示 Kotlin 编译器忽略冲突的重载，以防从 Objective-C 类继承了多个具有相同参数类型但参数名称不同的函数。

默认情况下，Kotlin/Native 编译器不允许调用非指定的 Objective-C 初始值设定项作为 `super()` 构造函数。
如果指定的初始值设定项未在 Objective-C 库中正确标记，则此行为可能不方便。要禁用这些编译器检查，请将 `disableDesignatedInitializerChecks = true` 添加到库的 [`.def` 文件](native-definition-file)。

## C 特性 (C features)

有关库使用一些普通 C 特性（例如，不安全指针、结构等）的示例案例，请参见 [与 C 的互操作性](native-c-interop)。

## 不支持 (Unsupported)

Kotlin 编程语言的某些功能尚未映射到 Objective-C 或 Swift 的相应功能。
当前，生成的框架标头中未正确公开以下功能：

* 内联类（参数映射为底层原始类型或 `id`）
* 实现标准 Kotlin 集合接口（`List`、`Map`、`Set`）和其他特殊类的自定义类
* Objective-C 类的 Kotlin 子类