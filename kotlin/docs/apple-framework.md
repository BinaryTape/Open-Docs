---
title: "Kotlin/Native 作为 Apple 框架 – 教程"
---
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

:::note
Objective-C 库导入是 [实验性的](components-stability#stability-levels-explained)。
所有由 cinterop 工具从 Objective-C 库生成的 Kotlin 声明都应该带有 `@ExperimentalForeignApi` 注解。

Kotlin/Native 附带的 Native 平台库（例如 Foundation、UIKit 和 POSIX）仅对某些 API 需要选择加入（opt-in）。

Kotlin/Native 提供了与 Swift/Objective-C 的双向互操作性。你既可以在 Kotlin 代码中使用 Objective-C 框架和库，也可以在 Swift/Objective-C 代码中使用 Kotlin 模块。

Kotlin/Native 附带了一组预导入的系统框架；也可以导入现有的框架并在 Kotlin 中使用它。在本教程中，你将学习如何创建自己的框架，并在 macOS 和 iOS 上的 Swift/Objective-C 应用程序中使用 Kotlin/Native 代码。

在本教程中，你将：

* [创建一个 Kotlin 库并将其编译为框架](#create-a-kotlin-library)
* [检查生成的 Swift/Objective-C API 代码](#generated-framework-headers)
* [从 Objective-C 中使用该框架](#use-code-from-objective-c)
* [从 Swift 中使用该框架](#use-code-from-swift)

你可以使用命令行直接或通过脚本文件（例如 `.sh` 或 `.bat` 文件）生成 Kotlin 框架。
但是，对于具有数百个文件和库的较大型项目，此方法的可扩展性不佳。
使用构建系统可以简化该过程，它可以通过传递依赖来下载和缓存 Kotlin/Native 编译器二进制文件和库，以及运行编译器和测试。
Kotlin/Native 可以通过 [Kotlin Multiplatform 插件](gradle-configure-project#targeting-multiple-platforms) 使用 [Gradle](https://gradle.org) 构建系统。

如果你使用 Mac 并且想要为 iOS 或其他 Apple 目标创建和运行应用程序，还需要
安装 [Xcode 命令行工具](https://developer.apple.com/download/)，启动它，并首先接受许可条款。

:::

## 创建一个 Kotlin 库

:::tip
有关详细的入门步骤以及如何创建新的 Kotlin/Native 项目并在 IntelliJ IDEA 中打开它的说明，请参阅 [Kotlin/Native 入门](native-get-started#using-gradle) 教程。

:::

Kotlin/Native 编译器可以从 Kotlin 代码生成用于 macOS 和 iOS 的框架。创建的框架包含使用 Swift/Objective-C 使用它所需的所有声明和二进制文件。

首先，让我们创建一个 Kotlin 库：

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
    
   fun acceptFun(f: (String) `->` String?) = f("Kotlin/Native rocks!")
   fun supplyFun() : (String) `->` String? = { "$it is cool!" }
   ```

2. 使用以下内容更新你的 `build.gradle(.kts)` Gradle 构建文件：

    <Tabs groupId="build-script">
    <TabItem value="kotlin" label="Kotlin" default>
    
    ```kotlin
    plugins {
        kotlin("multiplatform") version "2.1.20"
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
        gradleVersion = "8.10"
        distributionType = Wrapper.DistributionType.ALL
    }
    ```
    
    </TabItem>
    <TabItem value="groovy" label="Groovy" default>
    
    ```groovy
    plugins {
        id 'org.jetbrains.kotlin.multiplatform' version '2.1.20'
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
        gradleVersion = "8.10"
        distributionType = "ALL"
    }
    ```
    
    </TabItem>
    </Tabs>

    `binaries {}` 块配置项目以生成动态或共享库。

    Kotlin/Native 支持用于 iOS 的 `iosArm64`、`iosX64` 和 `iosSimulatorArm64` 目标，以及用于 macOS 的 `macosX64` 和 `macosArm64` 目标。因此，你可以将 `iosArm64()` 替换为你目标平台的相应 Gradle 函数：

    | 目标平台/设备 | Gradle 函数       |
    |------------------------|-----------------------|
    | macOS x86_64           | `macosX64()`          | 
    | macOS ARM64            | `macosArm64()`        |
    | iOS ARM64              | `iosArm64()`          | 
    | iOS Simulator (x86_64) | `iosX64()`            |
    | iOS Simulator (ARM64)  | `iosSimulatorArm64()` |

    有关其他受支持的 Apple 目标的信息，请参阅 [Kotlin/Native 目标支持](native-target-support)。

3. 在 IDE 中运行 `linkDebugFrameworkNative` Gradle 任务，或在终端中使用以下控制台命令来构建框架：

   ```bash
   ./gradlew linkDebugFrameworkNative
   ```
    
构建会将框架生成到 `build/bin/native/debugFramework` 目录中。

:::tip
你还可以使用 `linkNative` Gradle 任务来生成框架的 `debug` 和 `release` 变体。

:::

## 生成的框架头文件

每个框架变体都包含一个头文件。头文件不依赖于目标平台。头文件包含 Kotlin 代码的定义和一些 Kotlin 全局声明。让我们看看里面的内容。

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

Kotlin 类在 Swift/Objective-C 中有一个 `KotlinBase` 基类，它扩展了 `NSObject` 类。
还有用于集合和异常的包装器。大多数集合类型都映射到 Swift/Objective-C 中类似的集合类型：

| Kotlin      | Swift               | Objective-C         |
|-------------|---------------------|---------------------|
| List        | Array               | NSArray             |
| MutableList | NSMutableArray      | NSMutableArray      |
| Set         | Set                 | NSSet               |
| MutableSet  | NSMutableSet        | NSMutableSet        |
| Map         | Dictionary          | NSDictionary        |
| MutableMap  | NSMutableDictionary | NSMutableDictionary |

### Kotlin 数字和 NSNumber

`Demo.h` 文件的下一部分包含 Kotlin/Native 数字类型和 `NSNumber` 之间的类型映射。基类在 Objective-C 中称为 `DemoNumber`，在 Swift 中称为 `KotlinNumber`。它扩展了 `NSNumber`。

对于每个 Kotlin 数字类型，都有一个相应的预定义子类：

| Kotlin    | Swift           | Objective-C        | 简单类型          |
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

每种数字类型都有一个类方法，用于从相应的简单类型创建新实例。此外，还有一个实例方法来提取简单的值。示意性地，所有此类声明看起来像这样：

```objc
__attribute__((swift_name("Kotlin__TYPE__")))
@interface Demo__TYPE__ : DemoNumber
- (instancetype)initWith__TYPE__:(__CTYPE__)value;
+ (instancetype)numberWith__TYPE__:(__CTYPE__)value;
@end;
```

这里，`__TYPE__` 是简单类型名称之一，`__CTYPE__` 是相应的 Objective-C 类型，
例如，`initWithChar(char)`。

这些类型用于将装箱的 Kotlin 数字类型映射到 Swift/Objective-C。
在 Swift 中，你可以调用构造函数来创建实例，例如，`KotlinLong(value: 42)`。

### 来自 Kotlin 的类和对象

让我们看看 `class` 和 `object` 如何映射到 Swift/Objective-C。生成的 `Demo.h` 文件包含 `Class`、`Interface` 和 `Object` 的确切定义：

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

此代码中的 Objective-C 属性有助于从 Swift 和 Objective-C 语言中使用该框架。为 `Interface`、`Clazz` 和 `Object` 分别创建了 `DemoInterface`、`DemoClazz` 和 `DemoObject`。

`Interface` 转换为 `@protocol`，而 `class` 和 `object` 都表示为 `@interface`。`Demo` 前缀来自框架名称。可空返回类型 `ULong?` 在 Objective-C 中转换为 `DemoULong`。

### 来自 Kotlin 的全局声明

Kotlin 中的所有全局函数都转换为 Objective-C 中的 `DemoLibKt` 和 Swift 中的 `LibKt`，
其中 `Demo` 是由 `kotlinc-native` 的 `-output` 参数设置的框架名称：

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

Kotlin `String` 和 Objective-C `NSString*` 是透明映射的。类似地，Kotlin 中的 `Unit` 类型映射到 `void`。
基本类型直接映射。非空基本类型透明映射。
可空基本类型映射到 `Kotlin<TYPE>*` 类型，如[表](#kotlin-numbers-and-nsnumber)所示。
高阶函数 `acceptFunF` 和 `supplyFun` 都包含在内，并接受 Objective-C 块。

你可以在 [与 Swift/Objective-C 的互操作性](native-objc-interop#mappings) 中找到有关类型映射的更多信息。

## 垃圾回收和引用计数

Swift 和 Objective-C 使用自动引用计数 (ARC)。Kotlin/Native 有自己的[垃圾回收器](native-memory-manager#garbage-collector)，
它也[与 Objective-C/Swift ARC 集成](native-arc-integration)。

未使用的 Kotlin 对象会自动删除。你无需采取其他步骤来控制 Swift 或 Objective-C 中 Kotlin/Native 实例的生命周期。

## 从 Objective-C 中使用代码

让我们从 Objective-C 中调用该框架。在框架目录中，创建包含以下代码的 `main.m` 文件：

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

在这里，你可以直接从 Objective-C 代码调用 Kotlin 类。Kotlin 对象使用 `<object name>.shared` 类
属性，这允许你获取对象的唯一实例并在其上调用对象方法。

广泛使用的模式用于创建 `Clazz` 类的实例。你在 Objective-C 上调用 `[[ DemoClazz alloc] init]`。你还可以将 `[DemoClazz new]` 用于没有参数的构造函数。

Kotlin 源代码中的全局声明在 Objective-C 中被限定在 `DemoLibKt` 类下。
所有 Kotlin 函数都转换为该类的类方法。

`strings` 函数在 Objective-C 中转换为 `DemoLibKt.stringsStr` 函数，因此你可以将 `NSString`
直接传递给它。返回值也可见为 `NSString`。

## 从 Swift 中使用代码

你生成的框架具有辅助属性，使其更易于与 Swift 一起使用。让我们将[前面的 Objective-C 示例](#use-code-from-objective-c)转换为 Swift。

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

原始 Kotlin 代码与其 Swift 版本之间存在一些细微的差异。在 Kotlin 中，任何对象声明
都只有一个实例。`Object.shared` 语法用于访问此单个实例。

Kotlin 函数和属性名称按原样翻译。Kotlin 的 `String` 转换为 Swift 的 `String`。Swift
也隐藏了 `NSNumber*` 装箱。你还可以将 Swift 闭包传递给 Kotlin，并从 Swift 调用 Kotlin lambda 函数。

你可以在 [与 Swift/Objective-C 的互操作性](native-objc-interop#mappings) 中找到有关类型映射的更多信息。

## 将框架连接到你的 iOS 项目

现在你可以将生成的框架作为依赖项连接到你的 iOS 项目。有多种方法可以设置它
并自动化该过程，选择最适合你的方法：

<a href="multiplatform-ios-integration-overview"><img src="/img/choose-ios-integration.svg" width="700" alt="选择 iOS 集成方法" /></a>

## 接下来是什么

* [了解有关与 Objective-C 互操作性的更多信息](native-objc-interop)
* [了解如何在 Kotlin 中实现与 C 的互操作性](native-c-interop)
* [查看 Kotlin/Native 作为动态库的教程](native-dynamic-libraries)
  ```