---
title: "Kotlin/Native 作為 Apple framework – 教學"
---
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

:::note
Objective-C 函式庫的導入是 [實驗性的 (Experimental)](components-stability#stability-levels-explained)。
由 cinterop 工具從 Objective-C 函式庫產生的所有 Kotlin 宣告，都應該具有 `@ExperimentalForeignApi` 註解。

與 Kotlin/Native 一起提供的原生平台函式庫 (如 Foundation、UIKit 和 POSIX)，僅有部分 API 需要選擇加入 (opt-in)。

Kotlin/Native 提供與 Swift/Objective-C 的雙向互通性 (bidirectional interoperability)。 你可以在 Kotlin 程式碼中使用 Objective-C 框架 (frameworks) 和函式庫 (libraries)，也可以在 Swift/Objective-C 程式碼中使用 Kotlin 模組。

Kotlin/Native 附帶一組預先導入的系統框架；也可以導入現有框架並從 Kotlin 使用它。在本教學中，您將學習如何建立自己的框架，並在 macOS 和 iOS 上的 Swift/Objective-C 應用程式中使用 Kotlin/Native 程式碼。

在本教學中，您將：

* [建立 Kotlin 函式庫並將其編譯為框架](#create-a-kotlin-library)
* [檢查產生的 Swift/Objective-C API 程式碼](#generated-framework-headers)
* [從 Objective-C 使用該框架](#use-code-from-objective-c)
* [從 Swift 使用該框架](#use-code-from-swift)

您可以使用命令列來產生 Kotlin 框架，可以直接使用或使用腳本檔案 (例如 `.sh` 或 `.bat` 檔案)。
但是，這種方法對於具有數百個檔案和函式庫的大型專案來說，擴展性不佳。
使用建置系統可以簡化流程，方法是下載並快取 Kotlin/Native 編譯器二進制檔案和具有傳遞依賴關係的函式庫，以及執行編譯器和測試。
Kotlin/Native 可以透過 [Kotlin Multiplatform plugin](gradle-configure-project#targeting-multiple-platforms) 使用 [Gradle](https://gradle.org) 建置系統。

如果您使用 Mac 並且想要建立和執行適用於 iOS 或其他 Apple 目標的應用程式，您還需要
安裝 [Xcode Command Line Tools](https://developer.apple.com/download/)，啟動它，並先接受許可條款。

:::

## 建立 Kotlin 函式庫

:::tip
請參閱 [Kotlin/Native 入門](native-get-started#using-gradle) 教學，以取得詳細的初始步驟
以及關於如何建立新的 Kotlin/Native 專案並在 IntelliJ IDEA 中開啟它的說明。

:::

Kotlin/Native 編譯器可以從 Kotlin 程式碼產生適用於 macOS 和 iOS 的框架。 建立的框架包含
所有宣告和二進制檔案，以便與 Swift/Objective-C 一起使用。

讓我們先建立一個 Kotlin 函式庫：

1. 在 `src/nativeMain/kotlin` 目錄中，建立包含函式庫內容的 `lib.kt` 檔案：

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

2. 使用以下內容更新您的 `build.gradle(.kts)` Gradle 建置檔案：

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

    `binaries {}` 區塊設定專案以產生動態或共享函式庫。

    Kotlin/Native 支援適用於 iOS 的 `iosArm64`、`iosX64` 和 `iosSimulatorArm64` 目標，以及適用於 macOS 的 `macosX64` 和
    `macosArm64` 目標。 因此，您可以將 `iosArm64()` 替換為適用於您的目標平台的相應 Gradle 函數：

    | 目標平台/裝置 | Gradle 函數       |
    |------------------------|-----------------------|
    | macOS x86_64           | `macosX64()`          | 
    | macOS ARM64            | `macosArm64()`        |
    | iOS ARM64              | `iosArm64()`          | 
    | iOS 模擬器 (x86_64) | `iosX64()`            |
    | iOS 模擬器 (ARM64)  | `iosSimulatorArm64()` |

    如需其他支援的 Apple 目標的相關資訊，請參閱 [Kotlin/Native 目標支援](native-target-support)。

3. 在 IDE 中執行 `linkDebugFrameworkNative` Gradle 任務，或在終端機中使用以下主控台命令來
   建置框架：

   ```bash
   ./gradlew linkDebugFrameworkNative
   ```
    
建置會將框架產生到 `build/bin/native/debugFramework` 目錄中。

:::tip
您也可以使用 `linkNative` Gradle 任務來產生框架的 `debug` 和 `release` 變體 (variants)。

:::

## 產生的框架標頭 (headers)

每個框架變體都包含一個標頭檔案。 標頭不依賴於目標平台。 標頭檔案包含
Kotlin 程式碼的定義和一些 Kotlin 範圍的宣告。 讓我們看看裡面有什麼。

### Kotlin/Native 執行階段宣告 (runtime declarations)

在 `build/bin/native/debugFramework/Demo.framework/Headers` 目錄中，開啟 `Demo.h` 標頭檔案。
看看 Kotlin 執行階段宣告：

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

Kotlin 類別在 Swift/Objective-C 中具有 `KotlinBase` 基底類別，該基底類別在那裡擴展了 `NSObject` 類別。
還有用於集合和例外狀況 (exceptions) 的包裝函式 (wrappers)。 大多數集合類型都對應到 Swift/Objective-C 中的類似集合類型：

| Kotlin      | Swift               | Objective-C         |
|-------------|---------------------|---------------------|
| List        | Array               | NSArray             |
| MutableList | NSMutableArray      | NSMutableArray      |
| Set         | Set                 | NSSet               |
| MutableSet  | NSMutableSet        | NSMutableSet        |
| Map         | Dictionary          | NSDictionary        |
| MutableMap  | NSMutableDictionary | NSMutableDictionary |

### Kotlin 數字和 NSNumber

`Demo.h` 檔案的下一部分包含 Kotlin/Native 數字類型和 `NSNumber` 之間的類型對應。 基底
類別在 Objective-C 中稱為 `DemoNumber`，在 Swift 中稱為 `KotlinNumber`。 它擴展了 `NSNumber`。

對於每個 Kotlin 數字類型，都有一個對應的預定義子類別：

| Kotlin    | Swift           | Objective-C        | 簡單類型 (Simple type)          |
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

每個數字類型都有一個類別方法，可以從相應的簡單類型建立一個新的執行個體。 此外，還有一個執行個體
方法可以將一個簡單的值提取回來。 從示意圖上看，所有這些宣告都像這樣：

```objc
__attribute__((swift_name("Kotlin__TYPE__")))
@interface Demo__TYPE__ : DemoNumber
- (instancetype)initWith__TYPE__:(__CTYPE__)value;
+ (instancetype)numberWith__TYPE__:(__CTYPE__)value;
@end;
```

在這裡，`__TYPE__` 是簡單類型名稱之一，而 `__CTYPE__` 是相應的 Objective-C 類型，
例如，`initWithChar(char)`。

這些類型用於將 boxed Kotlin 數字類型對應到 Swift/Objective-C。
在 Swift 中，您可以呼叫建構函式來建立執行個體，例如，`KotlinLong(value: 42)`。

### 來自 Kotlin 的類別和物件

讓我們看看 `class` 和 `object` 如何對應到 Swift/Objective-C。 產生的 `Demo.h` 檔案包含 `Class`、`Interface` 和 `Object` 的確切
定義：

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

此程式碼中的 Objective-C 屬性有助於從 Swift 和 Objective-C
語言中使用該框架。 為 `Interface`、`Clazz` 和 `Object` 分別建立 `DemoInterface`、`DemoClazz` 和 `DemoObject`。

`Interface` 變成 `@protocol`，而 `class` 和 `object` 都表示為 `@interface`。 `Demo` 前綴來自框架名稱。 可為 null 的傳回類型 `ULong?` 在 Objective-C 中變為 `DemoULong`。

### 來自 Kotlin 的全域宣告 (global declarations)

來自 Kotlin 的所有全域函數 (global functions) 在 Objective-C 中都變為 `DemoLibKt`，在 Swift 中變為 `LibKt`，
其中 `Demo` 是由 `kotlinc-native` 的 `-output` 參數設定的框架名稱：

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

Kotlin 的 `String` 和 Objective-C 的 `NSString*` 會透明地對應。 同樣，Kotlin 的 `Unit` 類型會對應到 `void`。
原始類型會直接對應。 不可為 null 的原始類型會透明地對應。
可為 null 的原始類型會對應到 `Kotlin<TYPE>*` 類型，如[表](#kotlin-numbers-and-nsnumber) 中所示。 
高階函數 (higher-order functions) `acceptFunF` 和 `supplyFun` 都包含在內，並接受 Objective-C 區塊 (blocks)。

您可以在 [與 Swift/Objective-C 的互通性](native-objc-interop#mappings) 中找到有關類型對應的更多資訊。

## 垃圾回收 (Garbage collection) 和參考計數 (reference counting)

Swift 和 Objective-C 使用自動參考計數 (automatic reference counting, ARC)。 Kotlin/Native 有自己的 [垃圾回收器 (garbage collector)](native-memory-manager#garbage-collector)，
它也 [與 Objective-C/Swift ARC 整合](native-arc-integration)。

未使用的 Kotlin 物件會自動移除。 您無需採取額外的步驟來控制
Swift 或 Objective-C 中 Kotlin/Native 執行個體的生命週期。

## 從 Objective-C 使用程式碼

讓我們從 Objective-C 呼叫該框架。 在框架目錄中，建立包含以下程式碼的 `main.m` 檔案：

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

在這裡，您可以直接從 Objective-C 程式碼呼叫 Kotlin 類別。 Kotlin 物件使用 `<object name>.shared` 類別
屬性，您可以使用它來取得物件的唯一執行個體並在其上呼叫物件方法。

廣泛使用的模式是用於建立 `Clazz` 類別的執行個體。 您可以在
Objective-C 上呼叫 `[[ DemoClazz alloc] init]`。 您也可以對沒有參數的建構函式使用 `[DemoClazz new]`。

來自 Kotlin 來源的全域宣告會在 Objective-C 中限定在 `DemoLibKt` 類別下。
所有 Kotlin 函數都會變成該類別的類別方法。

`strings` 函數在 Objective-C 中變成 `DemoLibKt.stringsStr` 函數，因此您可以將 `NSString`
直接傳遞給它。 傳回值也顯示為 `NSString`。

## 從 Swift 使用程式碼

您產生的框架具有輔助屬性，可以更輕鬆地與 Swift 一起使用。 讓我們將 [先前的
Objective-C 範例](#use-code-from-objective-c) 轉換為 Swift。

在框架目錄中，建立包含以下程式碼的 `main.swift` 檔案：

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

原始 Kotlin 程式碼與其 Swift 版本之間存在一些小差異。 在 Kotlin 中，任何物件宣告
都只有一個執行個體。 `Object.shared` 語法用於存取這個單一執行個體。

Kotlin 函數和屬性名稱會按原樣翻譯。 Kotlin 的 `String` 變成 Swift 的 `String`。 Swift
也會隱藏 `NSNumber*` boxing。 您也可以將 Swift 閉包 (closure) 傳遞給 Kotlin，並從 Swift 呼叫 Kotlin lambda 函數。

您可以在 [與 Swift/Objective-C 的互通性](native-objc-interop#mappings) 中找到有關類型對應的更多資訊。

## 將框架連接到您的 iOS 專案

現在您可以將產生的框架作為相依性 (dependency) 連接到您的 iOS 專案。 有多種方法可以設定它
並自動化此流程，請選擇最適合您的方法：

<a href="multiplatform-ios-integration-overview"><img src="/img/choose-ios-integration.svg" width="700" alt="Choose iOS integration method" /></a>

## 接下來是什麼

* [瞭解更多關於與 Objective-C 的互通性](native-objc-interop)
* [瞭解如何在 Kotlin 中實作與 C 的互通性](native-c-interop)
* [查看 Kotlin/Native 作為動態函式庫教學課程](native-dynamic-libraries)