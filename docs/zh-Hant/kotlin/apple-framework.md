[//]: # (title: Kotlin/Native 作為 Apple 框架 – 教程)

> Objective-C 函式庫匯入功能是 [實驗性](components-stability.md#stability-levels-explained) 的。
> 所有透過 cinterop 工具從 Objective-C 函式庫產生的 Kotlin 宣告都應帶有 `@ExperimentalForeignApi` 註解。
>
> Kotlin/Native 隨附的原生平台函式庫 (例如 Foundation、UIKit 和 POSIX) 僅有部分 API 需要選擇啟用 (opt-in)。
>
{style="warning"}

Kotlin/Native 提供與 Swift/Objective-C 的雙向互通性 (interoperability)。你可以在 Kotlin 程式碼中使用 Objective-C 框架和函式庫，也可以在 Swift/Objective-C 程式碼中使用 Kotlin 模組。

Kotlin/Native 隨附一組預先匯入的系統框架；你也可以匯入現有的框架並從 Kotlin 中使用它。在本教程中，你將學習如何在 macOS 和 iOS 上建立自己的框架，並在 Swift/Objective-C 應用程式中使用 Kotlin/Native 程式碼。

在本教程中，你將：

*   [建立 Kotlin 函式庫並將其編譯為框架](#create-a-kotlin-library)
*   [檢查產生的 Swift/Objective-C API 程式碼](#generated-framework-headers)
*   [在 Objective-C 中使用框架](#use-code-from-objective-c)
*   [在 Swift 中使用框架](#use-code-from-swift)

你可以使用命令列直接或透過指令碼檔案 (例如 `.sh` 或 `.bat` 檔案) 來產生 Kotlin 框架。然而，這種方法對於擁有數百個檔案和函式庫的大型專案而言，擴展性不佳。使用建構系統 (build system) 可以簡化此流程，它能下載並快取 (cache) Kotlin/Native 編譯器二進位檔及其傳遞依賴 (transitive dependencies) 的函式庫，並執行編譯器和測試。Kotlin/Native 可以透過 [Kotlin Multiplatform plugin](gradle-configure-project.md#targeting-multiple-platforms) 使用 [Gradle](https://gradle.org) 建構系統。

> 如果你使用 Mac 並希望為 iOS 或其他 Apple 目標 (target) 建立及執行應用程式，你還需要先安裝 [Xcode Command Line Tools](https://developer.apple.com/download/)，啟動它並接受授權條款。
>
{style="note"}

## 建立 Kotlin 函式庫

> 有關詳細的第一步以及如何建立新的 Kotlin/Native 專案並在 IntelliJ IDEA 中開啟它的說明，請參閱 [Kotlin/Native 入門](native-get-started.md#using-gradle) 教程。
>
{style="tip"}

Kotlin/Native 編譯器可以從 Kotlin 程式碼為 macOS 和 iOS 產生框架。建立的框架包含與 Swift/Objective-C 搭配使用所需的所有宣告和二進位檔。

讓我們先建立一個 Kotlin 函式庫：

1.  在 `src/nativeMain/kotlin` 目錄中，建立 `lib.kt` 檔案，內容如下：

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

2.  將你的 `build.gradle(.kts)` Gradle 建構檔更新如下：

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

    `binaries {}` 區塊配置專案以產生動態或共享函式庫。

    Kotlin/Native 支援 `iosArm64`、`iosX64` 和 `iosSimulatorArm64` 目標用於 iOS，以及 `macosX64` 和 `macosArm64` 目標用於 macOS。因此，你可以將 `iosArm64()` 替換為你的目標平台相對應的 Gradle 函數：

    | 目標平台/裝置          | Gradle 函數           |
    |--------------------|-----------------------|
    | macOS x86_64       | `macosX64()`          |
    | macOS ARM64        | `macosArm64()`        |
    | iOS ARM64          | `iosArm64()`          |
    | iOS 模擬器 (x86_64) | `iosX64()`            |
    | iOS 模擬器 (ARM64)  | `iosSimulatorArm64()` |

    有關其他支援的 Apple 目標的資訊，請參閱 [Kotlin/Native 目標支援](native-target-support.md)。

3.  在 IDE 中執行 `linkDebugFrameworkNative` Gradle 任務，或在你的終端機中使用以下控制台命令來建構框架：

    ```bash
    ./gradlew linkDebugFrameworkNative
    ```

建構會將框架產生到 `build/bin/native/debugFramework` 目錄中。

> 你也可以使用 `linkNative` Gradle 任務來產生框架的 `debug` 和 `release` 變體 (variant)。
>
{style="tip"}

## 產生的框架標頭

每個框架變體都包含一個標頭檔 (header file)。標頭檔不依賴於目標平台。標頭檔包含你的 Kotlin 程式碼定義和一些 Kotlin 範圍內的宣告。讓我們看看裡面有什麼。

### Kotlin/Native 執行時宣告

在 `build/bin/native/debugFramework/Demo.framework/Headers` 目錄中，開啟 `Demo.h` 標頭檔。看看 Kotlin 執行時 (runtime) 宣告：

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

Kotlin 類別在 Swift/Objective-C 中有一個 `KotlinBase` 基底類別，它擴展了 `NSObject` 類別。還有集合 (collections) 和例外 (exceptions) 的封裝器 (wrappers)。大多數集合類型都映射到 Swift/Objective-C 中相似的集合類型：

| Kotlin      | Swift               | Objective-C         |
|-------------|---------------------|---------------------|
| `List`        | `Array`               | `NSArray`             |
| `MutableList` | `NSMutableArray`      | `NSMutableArray`      |
| `Set`         | `Set`                 | `NSSet`               |
| `MutableSet`  | `NSMutableSet`        | `NSMutableSet`        |
| `Map`         | `Dictionary`          | `NSDictionary`        |
| `MutableMap`  | `NSMutableDictionary` | `NSMutableDictionary` |

### Kotlin 數字和 NSNumber

`Demo.h` 檔案的下一部分包含 Kotlin/Native 數字類型與 `NSNumber` 之間的類型映射。基底類別在 Objective-C 中稱為 `DemoNumber`，在 Swift 中稱為 `KotlinNumber`。它擴展了 `NSNumber`。

對於每個 Kotlin 數字類型，都有一個相對應的預定義子類別：

| Kotlin    | Swift           | Objective-C        | 簡單類型             |
|-----------|-----------------|--------------------|--------------------|
| `-`       | `KotlinNumber`  | `<Package>Number`  | `-`                |
| `Byte`    | `KotlinByte`    | `<Package>Byte`    | `char`             |
| `UByte`   | `KotlinUByte`   | `<Package>UByte`   | `unsigned char`    |
| `Short`   | `KotlinShort`   | `<Package>Short`   | `short`            |
| `UShort`  | `KotlinUShort`  | `<Package>UShort`  | `unsigned short`   |
| `Int`     | `KotlinInt`     | `<Package>Int`     | `int`              |
| `UInt`    | `KotlinUInt`    | `<Package>UInt`    | `unsigned int`     |
| `Long`    | `KotlinLong`    | `<Package>Long`    | `long long`        |
| `ULong`   | `KotlinULong`   | `<Package>ULong`   | `unsigned long long` |
| `Float`   | `KotlinFloat`   | `<Package>Float`   | `float`            |
| `Double`  | `KotlinDouble`  | `<Package>Double`  | `double`           |
| `Boolean` | `KotlinBoolean` | `<Package>Boolean` | `BOOL/Bool`        |

每個數字類型都有一個類別方法，用於從相對應的簡單類型建立一個新實例。此外，還有一個實例方法用於提取回簡單值。示意圖上，所有這類宣告看起來像這樣：

```objc
__attribute__((swift_name("Kotlin__TYPE__")))
@interface Demo__TYPE__ : DemoNumber
- (instancetype)initWith__TYPE__:(__CTYPE__)value;
+ (instancetype)numberWith__TYPE__:(__CTYPE__)value;
@end;
```

在這裡，`__TYPE__` 是簡單類型名稱之一，而 `__CTYPE__` 是相對應的 Objective-C 類型，例如 `initWithChar(char)`。

這些類型用於將裝箱 (boxed) 的 Kotlin 數字類型映射到 Swift/Objective-C。
在 Swift 中，你可以呼叫建構子 (constructor) 來建立實例，例如 `KotlinLong(value: 42)`。

### Kotlin 中的類別和物件

讓我們看看 `class` 和 `object` 如何映射到 Swift/Objective-C。產生的 `Demo.h` 檔案包含 `Class`、`Interface` 和 `Object` 的確切定義：

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

此程式碼中的 Objective-C 屬性有助於從 Swift 和 Objective-C 語言中使用該框架。`DemoInterface`、`DemoClazz` 和 `DemoObject` 分別為 `Interface`、`Clazz` 和 `Object` 而建立。

`Interface` 被轉換為 `@protocol`，而 `class` 和 `object` 都表示為 `@interface`。`Demo` 前綴來自框架名稱。可為空的 (nullable) 回傳類型 `ULong?` 在 Objective-C 中被轉換為 `DemoULong`。

### Kotlin 中的全域宣告

Kotlin 中的所有全域 (global) 函數在 Objective-C 中被轉換為 `DemoLibKt`，在 Swift 中被轉換為 `LibKt`，其中 `Demo` 是由 `kotlinc-native` 的 `-output` 參數設定的框架名稱：

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

Kotlin `String` 和 Objective-C `NSString*` 被透明地映射。同樣地，Kotlin 中的 `Unit` 類型被映射到 `void`。原始類型 (primitive types) 被直接映射。不可為空的 (non-nullable) 原始類型被透明地映射。可為空的原始類型被映射到 `Kotlin<TYPE>*` 類型，如 [表格](#kotlin-numbers-and-nsnumber) 所示。兩個高階函數 (higher-order functions) `acceptFunF` 和 `supplyFun` 都被包含，並接受 Objective-C 區塊 (blocks)。

你可以在 [與 Swift/Objective-C 的互通性](native-objc-interop.md#mappings) 中找到更多關於類型映射的資訊。

## 垃圾收集和參考計數

Swift 和 Objective-C 使用自動參考計數 (Automatic Reference Counting, ARC)。Kotlin/Native 有自己的 [垃圾收集器](native-memory-manager.md#garbage-collector)，它也 [與 Swift/Objective-C ARC 整合](native-arc-integration.md)。

未使用的 Kotlin 物件會被自動移除。你不需要採取額外步驟來控制 Swift 或 Objective-C 中 Kotlin/Native 實例的生命週期。

## 從 Objective-C 中使用程式碼

讓我們從 Objective-C 呼叫框架。在框架目錄中，建立 `main.m` 檔案，內容如下：

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

在這裡，你直接從 Objective-C 程式碼呼叫 Kotlin 類別。Kotlin 物件使用 `<object name>.shared` 類別屬性，這允許你取得該物件的唯一實例並在其上呼叫物件方法。

使用廣泛使用的模式來建立 `Clazz` 類別的實例。你在 Objective-C 上呼叫 `[[ DemoClazz alloc] init]`。對於沒有參數的建構子，你也可以使用 `[DemoClazz new]`。

來自 Kotlin 原始碼的全域宣告在 Objective-C 中歸屬於 `DemoLibKt` 類別。所有 Kotlin 函數都被轉換為該類別的類別方法。

`strings` 函數在 Objective-C 中被轉換為 `DemoLibKt.stringsStr` 函數，因此你可以直接將 `NSString` 傳遞給它。回傳值也顯示為 `NSString`。

## 從 Swift 中使用程式碼

你生成的框架帶有輔助屬性，使其更易於與 Swift 搭配使用。讓我們將 [先前的 Objective-C 範例](#use-code-from-objective-c) 轉換為 Swift。

在框架目錄中，建立 `main.swift` 檔案，內容如下：

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

原始 Kotlin 程式碼與其 Swift 版本之間存在一些小差異。在 Kotlin 中，任何物件宣告都只有一個實例。`Object.shared` 語法用於存取這個單一實例。

Kotlin 函數和屬性名稱按原樣翻譯。Kotlin 的 `String` 被轉換為 Swift 的 `String`。Swift 也隱藏了 `NSNumber*` 的裝箱 (boxing)。你也可以將 Swift 閉包 (closure) 傳遞給 Kotlin，並從 Swift 呼叫 Kotlin 匿名函數 (lambda function)。

你可以在 [與 Swift/Objective-C 的互通性](native-objc-interop.md#mappings) 中找到更多關於類型映射的資訊。

## 將框架連接到你的 iOS 專案

現在你可以將生成的框架作為依賴 (dependency) 連接到你的 iOS 專案。有多種方法可以設定和自動化此過程，請選擇最適合你的方法：

<a href="https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-ios-integration-overview.html"><img src="choose-ios-integration.svg" width="700" alt="Choose iOS integration method" style="block"/></a>

## 後續步驟

*   [深入了解與 Objective-C 的互通性](native-objc-interop.md)
*   [查看 Kotlin 中與 C 的互通性如何實現](native-c-interop.md)
*   [查看 Kotlin/Native 作為動態函式庫教程](native-dynamic-libraries.md)