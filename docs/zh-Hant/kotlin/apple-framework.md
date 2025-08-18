[//]: # (title: Kotlin/Native 作為 Apple 框架 – 教學)

> Objective-C 函式庫匯入功能處於 [Beta](native-c-interop-stability.md) 階段。
> 所有由 cinterop 工具從 Objective-C 函式庫生成的 Kotlin 宣告都應帶有 `@ExperimentalForeignApi` 註解。
>
> Kotlin/Native 隨附的原生平台函式庫（例如 Foundation、UIKit 和 POSIX）僅需針對部分 API 選擇啟用。
>
{style="note"}

Kotlin/Native 提供了與 Swift/Objective-C 的雙向互通性。您可以在 Kotlin 程式碼中使用 Objective-C 框架和函式庫，也可以在 Swift/Objective-C 程式碼中使用 Kotlin 模組。

Kotlin/Native 隨附了一組預先匯入的系統框架；也可以匯入現有框架並從 Kotlin 中使用它。在本教學中，您將學習如何建立自己的框架，以及如何在 macOS 和 iOS 上的 Swift/Objective-C 應用程式中使用 Kotlin/Native 程式碼。

在本教學中，您將：

*   [建立 Kotlin 函式庫並將其編譯為框架](#create-a-kotlin-library)
*   [檢查生成的 Swift/Objective-C API 程式碼](#generated-framework-headers)
*   [從 Objective-C 使用框架](#use-code-from-objective-c)
*   [從 Swift 使用框架](#use-code-from-swift)

您可以使用命令列來生成 Kotlin 框架，無論是直接操作還是使用指令碼檔案（例如 `.sh` 或 `.bat` 檔案）。然而，對於包含數百個檔案和函式庫的大型專案來說，這種方法擴展性不佳。
使用建置系統透過下載和快取 Kotlin/Native 編譯器二進位檔和具有轉移性依賴項的函式庫，以及執行編譯器和測試來簡化此過程。
Kotlin/Native 可以透過 [Kotlin Multiplatform plugin](gradle-configure-project.md#targeting-multiple-platforms) 使用 [Gradle](https://gradle.org) 建置系統。

> 如果您使用 Mac 並想為 iOS 或其他 Apple 目標建立和執行應用程式，您還需要先安裝 [Xcode 命令列工具](https://developer.apple.com/download/)，啟動它，並接受許可條款。
>
{style="note"}

## 建立 Kotlin 函式庫

> 請參閱 [Kotlin/Native 入門](native-get-started.md#using-gradle) 教學，以獲取詳細的第一步和關於如何建立新的 Kotlin/Native 專案並在 IntelliJ IDEA 中開啟它的說明。
>
{style="tip"}

Kotlin/Native 編譯器可以從 Kotlin 程式碼中為 macOS 和 iOS 生成框架。建立的框架包含使用 Swift/Objective-C 所需的所有宣告和二進位檔。

讓我們先建立一個 Kotlin 函式庫：

1.  在 `src/nativeMain/kotlin` 目錄中，建立 `lib.kt` 檔案，其中包含函式庫內容：

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

2.  使用以下內容更新您的 `build.gradle(.kts)` Gradle 建置檔案：

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

    `binaries {}` 區塊配置專案以生成動態或共享函式庫。

    Kotlin/Native 支援 iOS 的 `iosArm64`、`iosX64` 和 `iosSimulatorArm64` 目標，以及 macOS 的 `macosX64` 和 `macosArm64` 目標。因此，您可以將 `iosArm64()` 替換為您的目標平台相對應的 Gradle 函數：

    | 目標平台/裝置          | Gradle 函數           |
    |------------------------|-----------------------|
    | macOS x86_64           | `macosX64()`          | 
    | macOS ARM64            | `macosArm64()`        |
    | iOS ARM64              | `iosArm64()`          | 
    | iOS Simulator (x86_64) | `iosX64()`            |
    | iOS Simulator (ARM64)  | `iosSimulatorArm64()` |

    有關其他支援的 Apple 目標的資訊，請參閱 [Kotlin/Native 目標支援](native-target-support.md)。

3.  在 IDE 中執行 `linkDebugFrameworkNative` Gradle 任務，或在您的終端機中使用以下控制台命令來建置框架：

    ```bash
    ./gradlew linkDebugFrameworkNative
    ```
    
建置會將框架生成到 `build/bin/native/debugFramework` 目錄中。

> 您也可以使用 `linkNative` Gradle 任務來生成框架的 `debug` 和 `release` 變體。
>
{style="tip"}

## 生成的框架標頭檔

每個框架變體都包含一個標頭檔。標頭檔不依賴於目標平台。標頭檔包含您的 Kotlin 程式碼定義和一些 Kotlin 範圍的宣告。讓我們看看裡面有什麼。

### Kotlin/Native 執行時宣告

在 `build/bin/native/debugFramework/Demo.framework/Headers` 目錄中，開啟 `Demo.h` 標頭檔。看看 Kotlin 執行時宣告：

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

Kotlin 類別在 Swift/Objective-C 中有一個 `KotlinBase` 基類，它擴展了 `NSObject` 類別。還有集合和例外情況的包裝器。大多數集合類型都映射到 Swift/Objective-C 中的類似集合類型：

| Kotlin      | Swift               | Objective-C         |
|-------------|---------------------|---------------------|
| List        | Array               | NSArray             |
| MutableList | NSMutableArray      | NSMutableArray      |
| Set         | Set                 | NSSet               |
| MutableSet  | NSMutableSet        | NSMutableSet        |
| Map         | Dictionary          | NSDictionary        |
| MutableMap  | NSMutableDictionary | NSMutableDictionary |

### Kotlin 數字與 NSNumber

`Demo.h` 檔案的下一部分包含 Kotlin/Native 數字類型與 `NSNumber` 之間的類型映射。基類在 Objective-C 中稱為 `DemoNumber`，在 Swift 中稱為 `KotlinNumber`。它擴展了 `NSNumber`。

對於每個 Kotlin 數字類型，都有一個對應的預定義子類別：

| Kotlin    | Swift           | Objective-C        | 簡單類型             |
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

每個數字類型都有一個類別方法，用於從對應的簡單類型建立一個新實例。此外，還有一個實例方法用於提取回簡單值。示意性地，所有此類宣告看起來像這樣：

```objc
__attribute__((swift_name("Kotlin__TYPE__")))
@interface Demo__TYPE__ : DemoNumber
- (instancetype)initWith__TYPE__:(__CTYPE__)value;
+ (instancetype)numberWith__TYPE__:(__CTYPE__)value;
@end;
```

在這裡，`__TYPE__` 是其中一個簡單類型名稱，而 `__CTYPE__` 是對應的 Objective-C 類型，例如 `initWithChar(char)`。

這些類型用於將裝箱的 Kotlin 數字類型映射到 Swift/Objective-C。
在 Swift 中，您可以呼叫建構子來建立實例，例如 `KotlinLong(value: 42)`。

### 來自 Kotlin 的類別和物件

讓我們看看 `class` 和 `object` 如何映射到 Swift/Objective-C。生成的 `Demo.h` 檔案包含了 `Class`、`Interface` 和 `Object` 的精確定義：

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

此程式碼中的 Objective-C 屬性有助於同時從 Swift 和 Objective-C 語言使用該框架。`DemoInterface`、`DemoClazz` 和 `DemoObject` 分別是為 `Interface`、`Clazz` 和 `Object` 建立的。

`Interface` 被轉換為 `@protocol`，而 `class` 和 `object` 都表示為 `@interface`。`Demo` 字首來自框架名稱。可為空的傳回類型 `ULong?` 在 Objective-C 中被轉換為 `DemoULong`。

### 來自 Kotlin 的全域宣告

所有來自 Kotlin 的全域函數在 Objective-C 中被轉換為 `DemoLibKt`，在 Swift 中被轉換為 `LibKt`，其中 `Demo` 是由 `kotlinc-native` 的 `-output` 參數設定的框架名稱：

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

Kotlin `String` 和 Objective-C `NSString*` 被透明地映射。同樣，Kotlin 的 `Unit` 類型被映射到 `void`。基本類型直接映射。不可為空的基本類型被透明地映射。可為空的基本類型被映射到 `Kotlin<TYPE>*` 類型，如 [表格](#kotlin-numbers-and-nsnumber) 所示。高階函數 `acceptFunF` 和 `supplyFun` 都包含在內並接受 Objective-C 區塊。

您可以在 [與 Swift/Objective-C 的互通性](native-objc-interop.md#mappings) 中找到有關類型映射的更多資訊。

## 垃圾回收與引用計數

Swift 和 Objective-C 使用自動引用計數 (ARC)。Kotlin/Native 有自己的 [垃圾收集器](native-memory-manager.md#garbage-collector)，它也 [與 Swift/Objective-C ARC 整合](native-arc-integration.md)。

未使用的 Kotlin 物件會自動移除。您無需採取額外步驟來控制 Swift 或 Objective-C 中 Kotlin/Native 實例的生命週期。

## 從 Objective-C 使用程式碼

讓我們先從 Objective-C 呼叫該框架。在框架目錄中，建立 `main.m` 檔案，其中包含以下程式碼：

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

在這裡，您可以直接從 Objective-C 程式碼呼叫 Kotlin 類別。Kotlin 物件使用 `<object name>.shared` 類別屬性，這允許您取得該物件的唯一實例並呼叫其物件方法。

廣泛使用的模式用於建立 `Clazz` 類別的實例。您在 Objective-C 中呼叫 `[[ DemoClazz alloc] init]`。您也可以對無參數的建構子使用 `[DemoClazz new]`。

來自 Kotlin 原始碼的全域宣告在 Objective-C 中被範圍限定在 `DemoLibKt` 類別下。所有 Kotlin 函數都被轉換為該類別的類別方法。

`strings` 函數在 Objective-C 中被轉換為 `DemoLibKt.stringsStr` 函數，因此您可以直接將 `NSString` 傳遞給它。回傳值也顯示為 `NSString`。

## 從 Swift 使用程式碼

您生成的框架具有輔助屬性，使其更容易與 Swift 搭配使用。讓我們將 [之前的 Objective-C 範例](#use-code-from-objective-c) 轉換為 Swift。

在框架目錄中，建立 `main.swift` 檔案，其中包含以下程式碼：

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

原始 Kotlin 程式碼與其 Swift 版本之間存在一些細微差異。在 Kotlin 中，任何物件宣告都只有一個實例。`Object.shared` 語法用於存取這個單一實例。

Kotlin 函數和屬性名稱被直接翻譯。Kotlin 的 `String` 被轉換為 Swift 的 `String`。Swift 也隱藏了 `NSNumber*` 的裝箱。您還可以將 Swift 閉包傳遞給 Kotlin，並從 Swift 呼叫 Kotlin 匿名函數。

您可以在 [與 Swift/Objective-C 的互通性](native-objc-interop.md#mappings) 中找到有關類型映射的更多資訊。

## 將框架連接到您的 iOS 專案

現在您可以將生成的框架作為依賴項連接到您的 iOS 專案。有多種方法可以設定和自動化此過程，請選擇最適合您的方法：

<a href="https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-ios-integration-overview.html"><img src="choose-ios-integration.svg" width="700" alt="選擇 iOS 整合方法" style="block"/></a>

## 接下來

*   [了解更多關於與 Objective-C 互通性的資訊](native-objc-interop.md)
*   [查看 Kotlin 中如何實現與 C 的互通性](native-c-interop.md)
*   [查閱 Kotlin/Native 作為動態函式庫教學](native-dynamic-libraries.md)