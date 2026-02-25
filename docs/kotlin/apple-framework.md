[//]: # (title: Kotlin/Native 作为 Apple 框架 – 教程)

> Objective-C 库导入处于 [Beta](native-lib-import-stability.md#stability-of-c-and-objective-c-library-import) 阶段。
> 由 cinterop 工具从 Objective-C 库生成的所有 Kotlin 声明都应带有 `@ExperimentalForeignApi` 注解。
>
> 随 Kotlin/Native 提供的原生平台库（如 Foundation、UIKit 和 POSIX）仅对某些 API 要求选择性加入 (opt-in)。
>
{style="note"}

Kotlin/Native 提供了与 Swift/Objective-C 的双向互操作性。你既可以在 Kotlin 代码中使用 Objective-C 框架和库，也可以在 Swift/Objective-C 代码中使用 Kotlin 模块。

Kotlin/Native 附带了一组预导入的系统框架；也可以导入现有框架并从 Kotlin 中使用它。在本教程中，你将学习如何创建自己的框架，并在 macOS 和 iOS 的 Swift/Objective-C 应用程序中使用 Kotlin/Native 代码。

在本教程中，你将：

* [创建 Kotlin 库并将其编译为框架](#create-a-kotlin-library)
* [查看生成的 Swift/Objective-C API 代码](#generated-framework-headers)
* [在 Objective-C 中使用该框架](#use-code-from-objective-c)
* [在 Swift 中使用该框架](#use-code-from-swift)

你可以使用命令行直接或通过脚本文件（例如 `.sh` 或 `.bat` 文件）生成 Kotlin 框架。
然而，这种方法对于拥有数百个文件和库的大型项目来说扩展性不佳。
使用构建系统可以简化流程，它可以下载和缓存带有传递依赖的 Kotlin/Native 编译器二进制文件和库，并运行编译器和测试。
Kotlin/Native 可以通过 [Kotlin Multiplatform 插件](gradle-configure-project.md#targeting-multiple-platforms)使用 [Gradle](https://gradle.org) 构建系统。

> 如果你使用 Mac 并希望为 iOS 或其他 Apple 目标创建和运行应用程序，你还需要首先安装 [Xcode 命令行工具](https://developer.apple.com/download/)，启动它并接受许可条款。
>
{style="note"}

## 创建 Kotlin 库

> 请参阅 [Kotlin/Native 入门](native-get-started.md#using-gradle)教程，了解详细的第一步操作，以及关于如何创建新 Kotlin/Native 项目并在 IntelliJ IDEA 中打开它的说明。
>
{style="tip"}

Kotlin/Native 编译器可以根据 Kotlin 代码为 macOS 和 iOS 生成框架。生成的框架包含了在 Swift/Objective-C 中使用它所需的所有声明和二进制文件。

首先让我们创建一个 Kotlin 库：

1. 在 `src/nativeMain/kotlin` 目录中，创建包含库内容的 `lib.kt` 文件：

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

    `binaries {}` 块将项目配置为生成动态库或共享库。

    Kotlin/Native 支持 iOS 的 `iosArm64`、`iosX64` 和 `iosSimulatorArm64` 目标，以及 macOS 的 `macosArm64` 和 `macosX64` 目标。因此，你可以根据你的目标平台将 `iosArm64()` 替换为相应的 Gradle 函数：

    | 目标平台/设备 | Gradle 函数 |
    |------------------------|-----------------------|
    | macOS ARM64            | `macosArm64()`        |
    | macOS x86_64           | `macosX64()`          |
    | iOS ARM64              | `iosArm64()`          |
    | iOS Simulator (ARM64)  | `iosSimulatorArm64()` |
    | iOS Simulator (x86_64) | `iosX64()`            |

    有关其他支持的 Apple 目标的信息，请参阅 [Kotlin/Native 目标支持](native-target-support.md)。

3. 在 IDE 中运行 `linkDebugFrameworkNative` Gradle 任务，或在终端中使用以下控制台命令来构建框架：

   ```bash
   ./gradlew linkDebugFrameworkNative
   ```
    
构建会将框架生成到 `build/bin/native/debugFramework` 目录中。

> 你也可以使用 `linkNative` Gradle 任务来同时生成框架的 `debug` 和 `release` 变体。
>
{style="tip"}

## 生成的框架头文件

每个框架变体都包含一个头文件。头文件不依赖于目标平台。头文件包含针对你的 Kotlin 代码的定义以及一些 Kotlin 范围内的声明。让我们看看里面有什么。

### Kotlin/Native 运行时声明

在 `build/bin/native/debugFramework/Demo.framework/Headers` 目录中，打开 `Demo.h` 头文件。
查看 Kotlin 运行时声明：

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

Kotlin 类在 Swift/Objective-C 中有一个 `KotlinBase` 基类，它扩展了那里的 `NSObject` 类。
还有针对集合和异常的包装器。大多数集合类型都映射到 Swift/Objective-C 中类似的集合类型：

| Kotlin | Swift | Objective-C |
|-------------|---------------------|---------------------|
| List        | Array               | NSArray             |
| MutableList | NSMutableArray      | NSMutableArray      |
| Set         | Set                 | NSSet               |
| MutableSet  | NSMutableSet        | NSMutableSet        |
| Map         | Dictionary          | NSDictionary        |
| MutableMap  | NSMutableDictionary | NSMutableDictionary |

### Kotlin 数字与 NSNumber

`Demo.h` 文件的下一部分包含 Kotlin/Native 数字类型与 `NSNumber` 之间的类型映射。基类在 Objective-C 中称为 `DemoNumber`，在 Swift 中称为 `KotlinNumber`。它扩展了 `NSNumber`。

对于每种 Kotlin 数字类型，都有一个对应的预定义子类：

| Kotlin | Swift | Objective-C | 简单类型 |
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

每种数字类型都有一个类方法来从相应的简单类型创建新实例。此外，还有一个实例方法可以将简单值提取出来。从原理上讲，所有这些声明看起来像这样：

```objc
__attribute__((swift_name("Kotlin__TYPE__")))
@interface Demo__TYPE__ : DemoNumber
- (instancetype)initWith__TYPE__:(__CTYPE__)value;
+ (instancetype)numberWith__TYPE__:(__CTYPE__)value;
@end;
```

在这里，`__TYPE__` 是简单类型名称之一，`__CTYPE__` 是对应的 Objective-C 类型，例如 `initWithChar(char)`。

这些类型用于将装箱的 Kotlin 数字类型映射到 Swift/Objective-C。
在 Swift 中，你可以调用构造函数来创建实例，例如 `KotlinLong(value: 42)`。

### 来自 Kotlin 的类和对象

让我们看看 `class` 和 `object` 是如何映射到 Swift/Objective-C 的。生成的 `Demo.h` 文件包含了 `Class`、`Interface` 和 `Object` 的确切定义：

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

这段代码中的 Objective-C 特性有助于在 Swift 和 Objective-C 语言中使用该框架。`DemoInterface`、`DemoClazz` 和 `DemoObject` 分别为 `Interface`、`Clazz` 和 `Object` 创建。

`Interface` 被转换为 `@protocol`，而 `class` 和 `object` 都表示为 `@interface`。`Demo` 前缀来自框架名称。可为 null 的返回值类型 `ULong?` 在 Objective-C 中被转换为 `DemoULong`。

### 来自 Kotlin 的全局声明

Kotlin 中的所有全局函数在 Objective-C 中被转换为 `DemoLibKt`，在 Swift 中被转换为 `LibKt`，其中 `Demo` 是由 `kotlinc-native` 的 `-output` 参数设置的框架名称：

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

Kotlin `String` 和 Objective-C `NSString*` 之间是透明映射的。同样，来自 Kotlin 的 `Unit` 类型被映射为 `void`。
原生类型被直接映射。不可为 null 的原生类型被透明映射。
可为 null 的原生类型被映射为 `Kotlin<TYPE>*` 类型，如[表](#kotlin-numbers-and-nsnumber)所示。
两个高阶函数 `acceptFunF` 和 `supplyFun` 都被包含在内，并接受 Objective-C 代码块。

你可以在 [Swift/Objective-C 互操作性](native-objc-interop.md#mappings)中找到关于类型映射的更多信息。

## 垃圾回收与引用计数

Swift 和 Objective-C 使用自动引用计数 (ARC)。Kotlin/Native 拥有自己的[垃圾回收器](native-memory-manager.md#garbage-collector)，它也[与 Swift/Objective-C ARC 集成](native-arc-integration.md)。

未使用的 Kotlin 对象会被自动移除。你不需要采取额外步骤来从 Swift 或 Objective-C 控制 Kotlin/Native 实例的生命周期。

## 在 Objective-C 中使用代码

让我们从 Objective-C 调用该框架。在框架目录中，创建包含以下代码的 `main.m` 文件：

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

在这里，你直接从 Objective-C 代码调用 Kotlin 类。Kotlin 对象使用 `<object name>.shared` 类属性，这允许你获取该对象的唯一实例并调用其对象方法。

常用的模式被用于创建 `Clazz` 类的实例。你在 Objective-C 上调用 `[[ DemoClazz alloc] init]`。你也可以对于不带参数的构造函数使用 `[DemoClazz new]`。

来自 Kotlin 源代码的全局声明在 Objective-C 中被限定在 `DemoLibKt` 类下。
所有的 Kotlin 函数都被转换为该类的类方法。

`strings` 函数在 Objective-C 中被转换为 `DemoLibKt.stringsStr` 函数，因此你可以直接将 `NSString` 传递给它。返回值也可见为 `NSString`。

## 在 Swift 中使用代码

你生成的框架具有辅助特性，使其更容易在 Swift 中使用。让我们将[之前的 Objective-C 示例](#use-code-from-objective-c)转换为 Swift。

在框架目录中，创建包含以下代码的 `main.swift` 文件：

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

原始 Kotlin 代码与其 Swift 版本之间存在一些微小差异。在 Kotlin 中，任何对象声明都只有一个实例。`Object.shared` 语法用于访问这个单一实例。

Kotlin 函数和属性名称按原样转换。Kotlin 的 `String` 被转换为 Swift 的 `String`。Swift 也隐藏了 `NSNumber*` 装箱。你还可以将 Swift 闭包传递给 Kotlin，并从 Swift 调用 Kotlin lambda 函数。

你可以在 [Swift/Objective-C 互操作性](native-objc-interop.md#mappings)中找到关于类型映射的更多信息。

## 将框架连接到你的 iOS 项目

现在，你可以将生成的框架作为依赖项连接到你的 iOS 项目。有多种方式来设置并自动化此过程，请选择最适合你的方法：

<a href="https://kotlinlang.org/docs/multiplatform/multiplatform-ios-integration-overview.html"><img src="choose-ios-integration.svg" width="700" alt="选择 iOS 集成方法" style="block"/></a>

## 下一步

* [详细了解与 Objective-C 的互操作性](native-objc-interop.md)
* [查看 Kotlin 中如何实现与 C 的互操作性](native-c-interop.md)
* [查看 Kotlin/Native 作为动态库教程](native-dynamic-libraries.md)