[//]: # (title: Kotlin/Native 作為 Apple 框架 – 教學)

> Objective-C 程式庫匯入目前處於 [Beta](native-lib-import-stability.md#stability-of-c-and-objective-c-library-import) 階段。
> 所有由 cinterop 工具從 Objective-C 程式庫產生的 Kotlin 宣告
> 都應具有 `@ExperimentalForeignApi` 註解。
>
> 隨 Kotlin/Native 提供的原生平台程式庫（如 Foundation、UIKit 和 POSIX）
> 僅對部分 API 要求選擇性同意（opt-in）。
>
{style="note"}

Kotlin/Native 提供與 Swift/Objective-C 的雙向互通性。您可以在 Kotlin 程式碼中使用 Objective-C 框架和程式庫，也可以在 Swift/Objective-C 程式碼中使用 Kotlin 模組。

Kotlin/Native 附帶了一組預先匯入的系統框架；也可以匯入現有的框架並在 Kotlin 中使用。在本教學中，您將學習如何建立自己的框架，並在 macOS 和 iOS 的 Swift/Objective-C 應用程式中使用 Kotlin/Native 程式碼。

在本教學中，您將：

* [建立 Kotlin 程式庫並將其編譯為框架](#create-a-kotlin-library)
* [檢查產生的 Swift/Objective-C API 程式碼](#generated-framework-headers)
* [在 Objective-C 中使用該框架](#use-code-from-objective-c)
* [在 Swift 中使用該框架](#use-code-from-swift)

您可以使用命令列直接產生 Kotlin 框架，或使用指令碼檔案（例如 `.sh` 或 `.bat` 檔案）。
然而，這種方法對於擁有數百個檔案和程式庫的大型專案來說擴展性不佳。
使用建構系統可以簡化程序，它會下載並快取具有傳遞相依性的 Kotlin/Native
編譯器二進位檔和程式庫，並執行編譯器和測試。
Kotlin/Native 可以透過 [Kotlin 多平台外掛程式](gradle-configure-project.md#targeting-multiple-platforms) 使用 [Gradle](https://gradle.org) 建構系統。

> 如果您使用 Mac 並希望為 iOS 或其他 Apple 目標建立並執行應用程式，您還需要
> 安裝 [Xcode Command Line Tools](https://developer.apple.com/download/)，啟動它並先接受授權條款。
>
{style="note"}

## 建立 Kotlin 程式庫

> 請參閱 [Kotlin/Native 入門](native-get-started.md#using-gradle) 教學，以獲取詳細的初步步驟
> 以及如何建立新的 Kotlin/Native 專案並在 IntelliJ IDEA 中開啟它的說明。
>
{style="tip"}

Kotlin/Native 編譯器可以從 Kotlin 程式碼中為 macOS 和 iOS 產出框架。建立的框架包含
與 Swift/Objective-C 配合使用所需的所有宣告和二進位檔。

我們首先建立一個 Kotlin 程式庫：

1. 在 `src/nativeMain/kotlin` 目錄中，建立包含程式庫內容的 `lib.kt` 檔案：

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

2. 使用以下內容更新您的 `build.gradle(.kts)` Gradle 建構檔案：

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

    `binaries {}` 區塊將專案配置為產生動態或共享程式庫。

    Kotlin/Native 支援 iOS 的 `iosArm64`、`iosX64` 和 `iosSimulatorArm64` 目標，以及 macOS 的 `macosArm64` 
    目標。因此，您可以根據您的目標平台，將 `iosArm64()` 替換為相應的 Gradle 函式：

    | 目標平台/裝置               | Gradle 函式           |
    |------------------------|-----------------------|
    | macOS ARM64            | `macosArm64()`        |
    | iOS ARM64              | `iosArm64()`          |
    | iOS Simulator (ARM64)  | `iosSimulatorArm64()` |
    | iOS Simulator (x86_64) | `iosX64()`            |

    有關其他受支援 Apple 目標的資訊，請參閱 [Kotlin/Native 目標支援](native-target-support.md)。

3. 在 IDE 中執行 `linkDebugFrameworkNative` Gradle 任務，或在終端機中使用以下主控台指令來建置框架：

   ```bash
   ./gradlew linkDebugFrameworkNative
   ```
    
該組建會將框架產生至 `build/bin/native/debugFramework` 目錄中。

> 您也可以使用 `linkNative` Gradle 任務來同時產生框架的 `debug` 和 `release` 變體。
>
{style="tip"}

## 產生的框架標頭

每個框架變體都包含一個標頭檔。標頭不依賴於目標平台。標頭檔包含
您的 Kotlin 程式碼定義以及一些 Kotlin 全域宣告。讓我們看看裡面有什麼。

### Kotlin/Native 執行時宣告

在 `build/bin/native/debugFramework/Demo.framework/Headers` 目錄中，開啟 `Demo.h` 標頭檔。
查看 Kotlin 執行時宣告：

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

Kotlin 類別在 Swift/Objective-C 中有一個 `KotlinBase` 基底類別，該類別繼承了當地的 `NSObject` 類別。
還有針對集合和例外狀況的包裝函式。大多數集合型別都對應到 Swift/Objective-C 中類似的集合型別：

| Kotlin      | Swift               | Objective-C         |
|-------------|---------------------|---------------------|
| List        | Array               | NSArray             |
| MutableList | NSMutableArray      | NSMutableArray      |
| Set         | Set                 | NSSet               |
| MutableSet  | NSMutableSet        | NSMutableSet        |
| Map         | Dictionary          | NSDictionary        |
| MutableMap  | NSMutableDictionary | NSMutableDictionary |

### Kotlin 數字與 NSNumber

`Demo.h` 檔案的下一部分包含 Kotlin/Native 數字型別與 `NSNumber` 之間的型別對應。基底類別在 Objective-C 中稱為 `DemoNumber`，在 Swift 中稱為 `KotlinNumber`。它繼承自 `NSNumber`。

對於每個 Kotlin 數字型別，都有一個對應的預定義子類別：

| Kotlin    | Swift           | Objective-C        | 簡易型別               |
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

每種數字型別都有一個類別方法，用於從對應的簡易型別建立新執行個體。此外，還有一個執行個體方法用於將簡易值提取回來。從圖解上看，所有此類宣告如下所示：

```objc
__attribute__((swift_name("Kotlin__TYPE__")))
@interface Demo__TYPE__ : DemoNumber
- (instancetype)initWith__TYPE__:(__CTYPE__)value;
+ (instancetype)numberWith__TYPE__:(__CTYPE__)value;
@end;
```

這裡，`__TYPE__` 是簡易型別名稱之一，而 `__CTYPE__` 是對應的 Objective-C 型別，例如 `initWithChar(char)`。

這些型別用於將裝箱（boxed）的 Kotlin 數字型別對應到 Swift/Objective-C。
在 Swift 中，您可以呼叫建構函式來建立執行個體，例如 `KotlinLong(value: 42)`。

### 來自 Kotlin 的類別與物件

讓我們看看 `class` 和 `object` 如何對應到 Swift/Objective-C。產生的 `Demo.h` 檔案包含了 `Class`、`Interface` 和 `Object` 的確切定義：

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

這段程式碼中的 Objective-C 屬性有助於在 Swift 和 Objective-C 語言中使用該框架。`DemoInterface`、`DemoClazz` 和 `DemoObject` 分別針對 `Interface`、`Clazz` 和 `Object` 建立。

`Interface` 被轉換為 `@protocol`，而 `class` 和 `object` 均表示為 `@interface`。`Demo` 前綴來自框架名稱。可為 null 的傳回型別 `ULong?` 在 Objective-C 中被轉換為 `DemoULong`。

### 來自 Kotlin 的全域宣告

所有來自 Kotlin 的全域函式在 Objective-C 中都被轉換為 `DemoLibKt`，在 Swift 中則轉換為 `LibKt`，
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

Kotlin `String` 和 Objective-C `NSString*` 之間是對應透明的。同樣地，來自 Kotlin 的 `Unit` 型別被對應到 `void`。
原始型別直接進行對應。不可為 null 的原始型別是對應透明的。
可為 null 的原始型別則對應到 `Kotlin<TYPE>*` 型別，如 [表格](#kotlin-numbers-and-nsnumber) 所示。
高階函式 `acceptFunF` 和 `supplyFun` 均被包含在內，且接受 Objective-C blocks。

您可以在 [與 Swift/Objective-C 的互通性](native-objc-interop.md#mappings) 中找到有關型別對應的更多資訊。

## 垃圾收集與參照計數

Swift 和 Objective-C 使用自動參照計數 (ARC)。Kotlin/Native 有自己的 [垃圾收集器](native-memory-manager.md#garbage-collector)，
它也與 [Swift/Objective-C ARC 整合](native-arc-integration.md)。

未使用的 Kotlin 物件會自動移除。您不需要採取額外步驟從 Swift 或 Objective-C 控制 Kotlin/Native 執行個體的生命週期。

## 在 Objective-C 中使用程式碼

讓我們從 Objective-C 呼叫該框架。在框架目錄中，建立具有以下程式碼的 `main.m` 檔案：

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

在這裡，您直接從 Objective-C 程式碼呼叫 Kotlin 類別。Kotlin 物件使用 `<object name>.shared` 類別屬性，這允許您取得該物件的唯一執行個體並在其上呼叫物件方法。

建立 `Clazz` 類別執行個體時使用了廣泛使用的模式。您在 Objective-C 上呼叫 `[[ DemoClazz alloc] init]`。對於不含參數的建構函式，您也可以使用 `[DemoClazz new]`。

來自 Kotlin 原始碼的全域宣告在 Objective-C 中被歸入 `DemoLibKt` 類別的作用域。
所有 Kotlin 函式都被轉換為該類別的類別方法。

`strings` 函式在 Objective-C 中被轉換為 `DemoLibKt.stringsStr` 函式，因此您可以直接將 `NSString` 傳遞給它。傳回值同樣可視為 `NSString`。

## 在 Swift 中使用程式碼

您產生的框架具有輔助屬性，使其更容易與 Swift 配合使用。讓我們將[之前的 Objective-C 範例](#use-code-from-objective-c)轉換為 Swift。

在框架目錄中，建立具有以下程式碼的 `main.swift` 檔案：

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

原始 Kotlin 程式碼與其 Swift 版本之間存在一些細微差別。在 Kotlin 中，任何物件宣告都只有一個執行個體。使用 `Object.shared` 語法來存取這個單一執行個體。

Kotlin 的 函式和屬性名稱被照原樣轉譯。Kotlin 的 `String` 被轉換為 Swift 的 `String`。Swift 也隱藏了 `NSNumber*` 的裝箱。您也可以將 Swift 閉包傳遞給 Kotlin，並從 Swift 呼叫 Kotlin Lambda 函式。

您可以在 [與 Swift/Objective-C 的互通性](native-objc-interop.md#mappings) 中找到有關型別對應的更多資訊。

## 將框架連接到您的 iOS 專案

現在您可以將產生的框架作為相依性連接到您的 iOS 專案。有多種方法可以設定和自動化此過程，請選擇最適合您的方法：

<a href="https://kotlinlang.org/docs/multiplatform/multiplatform-ios-integration-overview.html"><img src="choose-ios-integration.svg" width="700" alt="選擇 iOS 整合方法" style="block"/></a>

## 下一步

* [進一步了解與 Objective-C 的互通性](native-objc-interop.md)
* [了解與 C 的互通性在 Kotlin 中是如何實作的](native-c-interop.md)
* [查看 Kotlin/Native 作為動態程式庫教學](native-dynamic-libraries.md)