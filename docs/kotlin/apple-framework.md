[//]: # (title: Kotlin/Native 作为 Apple framework – 教程)

> Objective-C 库的导入处于 [Beta](native-c-interop-stability.md) 阶段。
> 所有由 cinterop 工具从 Objective-C 库生成的 Kotlin 声明
> 都应带有 `@ExperimentalForeignApi` 注解。
>
> 随 Kotlin/Native 附带的原生平台库（例如 Foundation、UIKit 和 POSIX）
> 仅对部分 APIs 需要显式选择加入。
>
{style="note"}

Kotlin/Native 提供了与 Swift/Objective-C 的双向互操作性。你可以在 Kotlin 代码中使用 Objective-C framework，也可以在 Swift/Objective-C 代码中使用 Kotlin 模块。

Kotlin/Native 附带了一系列预导入的系统 framework；也可以导入一个现有的 framework 并在 Kotlin 中使用它。在本教程中，你将学习如何创建自己的 framework 并从 macOS 和 iOS 上的 Swift/Objective-C 应用程序中使用 Kotlin/Native 代码。

在本教程中，你将：

* [创建 Kotlin 库并将其编译为 framework](#create-a-kotlin-library)
* [检查生成的 Swift/Objective-C API 代码](#generated-framework-headers)
* [从 Objective-C 使用 framework](#use-code-from-objective-c)
* [从 Swift 使用 framework](#use-code-from-swift)

你可以使用命令行直接或通过脚本文件（例如 `.sh` 或 `.bat` 文件）生成 Kotlin framework。然而，对于拥有数百个文件和库的更大项目来说，这种方法的可伸缩性不佳。使用构建系统可以通过下载和缓存 Kotlin/Native 编译器二进制文件和带有传递依赖项的库，以及运行编译器和测试来简化该过程。Kotlin/Native 可以通过 [Kotlin Multiplatform plugin](gradle-configure-project.md#targeting-multiple-platforms) 使用 [Gradle](https://gradle.org) 构建系统。

> 如果你使用 Mac 并希望为 iOS 或其他 Apple 目标平台创建并运行应用程序，你还需要
> 首先安装 [Xcode Command Line Tools](https://developer.apple.com/download/)，启动它并接受许可条款。
>
{style="note"}

## 创建 Kotlin 库

> 关于详细的入门步骤，请参见 [Kotlin/Native 入门](native-get-started.md#using-gradle) 教程
> 以及如何创建新的 Kotlin/Native 项目并在 IntelliJ IDEA 中打开它的说明。
>
{style="tip"}

Kotlin/Native 编译器可以从 Kotlin 代码为 macOS 和 iOS 生成 framework。所创建的 framework 包含与 Swift/Objective-C 结合使用所需的所有声明和二进制文件。

我们首先创建一个 Kotlin 库：

1. 在 `src/nativeMain/kotlin` 目录中，创建 `lib.kt` 文件，其中包含库内容：

   ```kotlin
   package example
    
   object Object {
       val field = "A"
   }
    
   interface Interface {
       fun iMember() {}
   }
    
   class Clazz : Interface {
       fun member(p: Int): ULong? = 42UL
   }
    
   fun forIntegers(b: Byte, s: UShort, i: Int, l: ULong?) { }
   fun forFloats(f: Float, d: Double?) { }
    
   fun strings(str: String?) : String {
       return "That is '$str' from C"
   }
    
   fun acceptFun(f: (String) -> String?) = f("Kotlin/Native rocks!")
   fun supplyFun() : (String) -> String? = { "$it is cool!" }
   ```

2. 使用以下内容更新你的 `build.gradle(.kts)` Gradle 构建文件：

    <tabs group="build-script">
    <tab title="Kotlin" group-key="kotlin">
    
    ```kotlin
    plugins {
        kotlin("multiplatform") version "%kotlinVersion%"
    }
    
    repositories {
        mavenCentral()
    }
    
    kotlin {
        iosArm64("native") {
            binaries {
                framework {
                    baseName = "Demo"
                }
            }
        }
    }
    
    tasks.wrapper {
        gradleVersion = "%gradleVersion%"
        distributionType = Wrapper.DistributionType.ALL
    }
    ```
    
    </tab>
    <tab title="Groovy" group-key="groovy">
    
    ```groovy
    plugins {
        id 'org.jetbrains.kotlin.multiplatform' version '%kotlinVersion%'
    }
    
    repositories {
        mavenCentral()
    }
    
    kotlin {
        iosArm64("native") {
            binaries {
                framework {
                    baseName = "Demo"
                }
            }
        }
    }
    
    wrapper {
        gradleVersion = "%gradleVersion%"
        distributionType = "ALL"
    }
    ```
    
    </tab>
    </tabs>

    `binaries {}` 代码块配置项目以生成动态库或共享库。

    Kotlin/Native 支持用于 iOS 的 `iosArm64`、`iosX64` 和 `iosSimulatorArm64` 目标平台，以及用于 macOS 的 `macosX64` 和 `macosArm64` 目标平台。因此，你可以用你的目标平台相应的 Gradle 函数替换 `iosArm64()`：

    | 目标平台/设备          | Gradle 函数           |
    |------------------------|-----------------------|
    | macOS x86_64           | `macosX64()`          | 
    | macOS ARM64            | `macosArm64()`        |
    | iOS ARM64              | `iosArm64()`          | 
    | iOS Simulator (x86_64) | `iosX64()`            |
    | iOS Simulator (ARM64)  | `iosSimulatorArm64()` |

    关于其他受支持的 Apple 目标平台的信息，请参见 [Kotlin/Native 目标平台支持](native-target-support.md)。

3. 在 IDE 中运行 `linkDebugFrameworkNative` Gradle 任务，或在你的终端中使用以下控制台命令来构建 framework：

   ```bash
   ./gradlew linkDebugFrameworkNative
   ```
    
该构建会将 framework 生成到 `build/bin/native/debugFramework` 目录中。

> 你也可以使用 `linkNative` Gradle 任务来生成 framework 的 `debug` 和 `release` 变体。
>
{style="tip"}

## 生成的 framework 头文件

每个 framework 变体都包含一个头文件。这些头文件不依赖于目标平台。头文件包含你的 Kotlin 代码的定义以及一些 Kotlin 范围的声明。让我们看看里面有什么。

### Kotlin/Native 运行时声明

在 `build/bin/native/debugFramework/Demo.framework/Headers` 目录中，打开 `Demo.h` 头文件。看一下 Kotlin 运行时声明：

```objc
NS_ASSUME_NONNULL_BEGIN
#pragma clang diagnostic push
#pragma clang diagnostic ignored "-Wunknown-warning-option"
#pragma clang diagnostic ignored "-Wincompatible-property-type"
#pragma clang diagnostic ignored "-Wnullability"

#pragma push_macro("_Nullable_result")
#if !__has_feature(nullability_nullable_result)
#undef _Nullable_result
#define _Nullable_result _Nullable
#endif

__attribute__((swift_name("KotlinBase")))
@interface DemoBase : NSObject
- (instancetype)init __attribute__((unavailable));
+ (instancetype)new __attribute__((unavailable));
+ (void)initialize __attribute__((objc_requires_super));
@end

@interface DemoBase (DemoBaseCopying) <NSCopying>
@end

__attribute__((swift_name("KotlinMutableSet")))
@interface DemoMutableSet<ObjectType> : NSMutableSet<ObjectType>
@end

__attribute__((swift_name("KotlinMutableDictionary")))
@interface DemoMutableDictionary<KeyType, ObjectType> : NSMutableDictionary<KeyType, ObjectType>
@end

@interface NSError (NSErrorDemoKotlinException)
@property (readonly) id _Nullable kotlinException;
@end
```

Kotlin 类在 Swift/Objective-C 中有一个 `KotlinBase` 基类，它扩展了那里的 `NSObject` 类。也有用于集合和异常的包装器。大多数集合类型都映射到类似的集合类型在 Swift/Objective-C 中：

| Kotlin      | Swift               | Objective-C         |
|-------------|---------------------|---------------------|
| List        | Array               | NSArray             |
| MutableList | NSMutableArray      | NSMutableArray      |
| Set         | Set                 | NSSet               |
| MutableSet  | NSMutableSet        | NSMutableSet        |
| Map         | Dictionary          | NSDictionary        |
| MutableMap  | NSMutableDictionary | NSMutableDictionary |

### Kotlin 数字和 NSNumber

`Demo.h` 文件的下一部分包含 Kotlin/Native 数字类型和 `NSNumber` 之间的类型映射。该基类在 Objective-C 中称为 `DemoNumber`，在 Swift 中称为 `KotlinNumber`。它扩展了 `NSNumber`。

对于每种 Kotlin 数字类型，都有一个相应的预定义子类：

| Kotlin    | Swift           | Objective-C        | 简单类型             |
|-----------|-----------------|--------------------|----------------------|
| `-`       | `KotlinNumber`  | `<Package>Number`  | `-`                  |
| `Byte`    | `KotlinByte`    | `<Package>Byte`    | `char`               |
| `UByte`   | `KotlinUByte`   | `<Package>UByte`   | `unsigned char`      |
| `Short`   | `KotlinShort`   | `<Package>Short`   | `short`              |
| `UShort`  | `KotlinUShort`  | `<Package>UShort`  | `unsigned short`     |
| `Int`     | `KotlinInt`     | `<Package>Int`     | `int`                |
| `UInt`    | `KotlinUInt`    | `<Package>UInt`    | `unsigned int`       |
| `Long`    | `KotlinLong`    | `<Package>Long`    | `long long`          |
| `ULong`   | `KotlinULong`   | `<Package>ULong`   | `unsigned long long` |
| `Float`   | `KotlinFloat`   | `<Package>Float`   | `float`              |
| `Double`  | `KotlinDouble`  | `<Package>Double`  | `double`             |
| `Boolean` | `KotlinBoolean` | `<Package>Boolean` | `BOOL/Bool`          |

每种数字类型都有一个类方法，用于从相应的简单类型创建一个新实例。此外，还有一个实例方法，用于提取回一个简单值。示意性地，所有此类声明看起来像这样：

```objc
__attribute__((swift_name("Kotlin__TYPE__")))
@interface Demo__TYPE__ : DemoNumber
- (instancetype)initWith__TYPE__:(__CTYPE__)value;
+ (instancetype)numberWith__TYPE__:(__CTYPE__)value;
@end;
```

这里，`__TYPE__` 是其中一个简单类型名称，而 `__CTYPE__` 是相应的 Objective-C 类型，例如，`initWithChar(char)`。

这些类型用于将装箱的 Kotlin 数字类型映射到 Swift/Objective-C。在 Swift 中，你可以调用构造函数来创建一个实例，例如 `KotlinLong(value: 42)`。

### Kotlin 中的类和对象

让我们看看 `class` 和 `object` 如何映射到 Swift/Objective-C。生成的 `Demo.h` 文件包含确切的 `Class`、`Interface` 和 `Object` 的定义：

```objc
__attribute__((swift_name("Interface")))
@protocol DemoInterface
@required
- (void)iMember __attribute__((swift_name("iMember()")));
@end

__attribute__((objc_subclassing_restricted))
__attribute__((swift_name("Clazz")))
@interface DemoClazz : DemoBase <DemoInterface>
- (instancetype)init __attribute__((swift_name("init()"))) __attribute__((objc_designated_initializer));
+ (instancetype)new __attribute__((availability(swift, unavailable, message="use object initializers instead")));
- (DemoULong * _Nullable)memberP:(int32_t)p __attribute__((swift_name("member(p:)")));
@end

__attribute__((objc_subclassing_restricted))
__attribute__((swift_name("Object")))
@interface DemoObject : DemoBase
+ (instancetype)alloc __attribute__((unavailable));
+ (instancetype)allocWithZone:(struct _NSZone *)zone __attribute__((unavailable));
+ (instancetype)object __attribute__((swift_name("init()")));
@property (class, readonly, getter=shared) DemoObject *shared __attribute__((swift_name("shared")));
@property (readonly) NSString *field __attribute__((swift_name("field")));
@end
```

此代码中的 Objective-C 属性有助于同时从 Swift 和 Objective-C 语言中使用 framework。`DemoInterface`、`DemoClazz` 和 `DemoObject` 分别为 `Interface`、`Clazz` 和 `Object` 创建。

`Interface` 被转换为 `@protocol`，而 `class` 和 `object` 都表示为 `@interface`。`Demo` 前缀来自 framework 名称。可空返回类型 `ULong?` 在 Objective-C 中被转换为 `DemoULong`。

### Kotlin 中的全局声明

所有 Kotlin 中的全局函数在 Objective-C 中被转换为 `DemoLibKt`，在 Swift 中被转换为 `LibKt`，其中 `Demo` 是由 `kotlinc-native` 的 `-output` 参数设置的 framework 名称：

```objc
__attribute__((objc_subclassing_restricted))
__attribute__((swift_name("LibKt")))
@interface DemoLibKt : DemoBase
+ (NSString * _Nullable)acceptFunF:(NSString * _Nullable (^)(NSString *))f __attribute__((swift_name("acceptFun(f:)")));
+ (void)forFloatsF:(float)f d:(DemoDouble * _Nullable)d __attribute__((swift_name("forFloats(f:d:)")));
+ (void)forIntegersB:(int8_t)b s:(uint16_t)s i:(int32_t)i l:(DemoULong * _Nullable)l __attribute__((swift_name("forIntegers(b:s:i:l:)")));
+ (NSString *)stringsStr:(NSString * _Nullable)str __attribute__((swift_name("strings(str:)")));
+ (NSString * _Nullable (^)(NSString *))supplyFun __attribute__((swift_name("supplyFun()")));
@end
```

Kotlin 的 `String` 和 Objective-C 的 `NSString*` 透明地映射。类似地，Kotlin 的 `Unit` 类型映射到 `void`。原生类型直接映射。非空的原生类型透明地映射。可空的原生类型映射到 `Kotlin<TYPE>*` 类型，如 [表](#kotlin-numbers-and-nsnumber) 所示。高阶函数 `acceptFunF` 和 `supplyFun` 都包含在内，并接受 Objective-C 代码块。

你可以在 [与 Swift/Objective-C 的互操作性](native-objc-interop.md#mappings) 中找到有关类型映射的更多信息。

## 垃圾回收和引用计数

Swift 和 Objective-C 使用自动引用计数 (ARC)。Kotlin/Native 有自己的[垃圾回收器](native-memory-manager.md#garbage-collector)，它也[与 Swift/Objective-C ARC 集成](native-arc-integration.md)。

未使用的 Kotlin 对象会自动移除。你无需采取额外步骤来控制 Kotlin/Native 实例的生命周期，无论是从 Swift 还是 Objective-C。

## 从 Objective-C 使用代码

让我们从 Objective-C 调用 framework。在 framework 目录中，创建 `main.m` 文件并包含以下代码：

```objc 
#import <Foundation/Foundation.h>
#import <Demo/Demo.h>

int main(int argc, const char * argv[]) {
    @autoreleasepool {
        [DemoObject.shared field];
        
        DemoClazz* clazz = [[ DemoClazz alloc] init];
        [clazz memberP:42];
        
        [DemoLibKt forIntegersB:1 s:1 i:3 l:[DemoULong numberWithUnsignedLongLong:4]];
        [DemoLibKt forIntegersB:1 s:1 i:3 l:nil];
        
        [DemoLibKt forFloatsF:2.71 d:[DemoDouble numberWithDouble:2.71]];
        [DemoLibKt forFloatsF:2.71 d:nil];
        
        NSString* ret = [DemoLibKt acceptFunF:^NSString * _Nullable(NSString * it) {
            return [it stringByAppendingString:@" Kotlin is fun"];
        }];
        
        NSLog(@"%@", ret);
        return 0;
    }
}
```

在这里，你可以直接从 Objective-C 代码调用 Kotlin 类。一个 Kotlin 对象使用 `<object name>.shared` 类属性，这允许你获取该对象的唯一实例并在其上调用对象方法。

使用广泛的模式来创建 `Clazz` 类的一个实例。你在 Objective-C 上调用 `[[ DemoClazz alloc] init]`。你也可以对不带参数的构造函数使用 `[DemoClazz new]`。

来自 Kotlin 源代码的全局声明在 Objective-C 中作用域在 `DemoLibKt` 类之下。所有 Kotlin 函数都被转换为该类的类方法。

`strings` 函数在 Objective-C 中被转换为 `DemoLibKt.stringsStr` 函数，因此你可以直接向其传递 `NSString`。返回值也可见为 `NSString`。

## 从 Swift 使用代码

你生成的 framework 具有辅助属性，使其更容易与 Swift 一起使用。让我们将[先前的 Objective-C 示例](#use-code-from-objective-c) 转换为 Swift。

在 framework 目录中，创建 `main.swift` 文件并包含以下代码：

```swift
import Foundation
import Demo

let kotlinObject = Object.shared

let field = Object.shared.field

let clazz = Clazz()
clazz.member(p: 42)

LibKt.forIntegers(b: 1, s: 2, i: 3, l: 4)
LibKt.forFloats(f: 2.71, d: nil)

let ret = LibKt.acceptFun { "\($0) Kotlin is fun" }
if (ret != nil) {
    print(ret!)
}
``` 

原始 Kotlin 代码和其 Swift 版本之间存在一些细微差异。在 Kotlin 中，任何对象声明只有一个实例。`Object.shared` 语法用于访问此单个实例。

Kotlin 函数和属性名称原样转换。Kotlin 的 `String` 被转换为 Swift 的 `String`。Swift 也隐藏了 `NSNumber*` 装箱。你还可以将 Swift 闭包传递给 Kotlin，并从 Swift 调用 Kotlin lambda 函数。

你可以在 [与 Swift/Objective-C 的互操作性](native-objc-interop.md#mappings) 中找到有关类型映射的更多信息。

## 将 framework 连接到你的 iOS 项目

现在你可以将生成的 framework 作为依赖项连接到你的 iOS 项目。有多种设置它的方法并自动化此过程，请选择最适合你的方法：

<a href="https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-ios-integration-overview.html"><img src="choose-ios-integration.svg" width="700" alt="选择 iOS 集成方法" style="block"/></a>

## 接下来

* [了解更多关于与 Objective-C 的互操作性](native-objc-interop.md)
* [查看 Kotlin 中如何实现与 C 的互操作性](native-c-interop.md)
* [查看 Kotlin/Native 作为动态库的教程](native-dynamic-libraries.md)