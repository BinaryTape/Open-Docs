[//]: # (title: Kotlin/NativeをAppleフレームワークとして使用する – チュートリアル)

> Objective-Cライブラリのインポートは[実験的](components-stability.md#stability-levels-explained)です。
> `cinterop`ツールによってObjective-Cライブラリから生成されたすべてのKotlin宣言には、`@ExperimentalForeignApi`アノテーションが必要です。
>
> Kotlin/Nativeに同梱されているネイティブプラットフォームライブラリ（Foundation、UIKit、POSIXなど）は、一部のAPIでのみオプトインが必要です。
>
{style="warning"}

Kotlin/Nativeは、Swift/Objective-Cとの双方向の相互運用性を提供します。KotlinコードでObjective-Cのフレームワークとライブラリを使用することも、Swift/Objective-CコードでKotlinモジュールを使用することもできます。

Kotlin/Nativeには、事前にインポートされた一連のシステムフレームワークが付属しており、既存のフレームワークをインポートしてKotlinから使用することも可能です。このチュートリアルでは、独自のフレームワークを作成し、macOSおよびiOS上のSwift/Objective-CアプリケーションからKotlin/Nativeコードを使用する方法を学習します。

このチュートリアルでは、以下のことを行います。

* [Kotlinライブラリを作成し、フレームワークにコンパイルする](#create-a-kotlin-library)
* [生成されたSwift/Objective-C APIコードを調べる](#generated-framework-headers)
* [Objective-Cからフレームワークを使用する](#use-code-from-objective-c)
* [Swiftからフレームワークを使用する](#use-code-from-swift)

コマンドラインを使用して、Kotlinフレームワークを直接、またはスクリプトファイル（`.sh`や`.bat`ファイルなど）で生成できます。
ただし、このアプローチは、数百のファイルやライブラリを持つ大規模なプロジェクトにはスケールしにくいです。
ビルドシステムを使用すると、Kotlin/Nativeコンパイラのバイナリと推移的依存関係を持つライブラリのダウンロードとキャッシュ、およびコンパイラとテストの実行により、プロセスが簡素化されます。
Kotlin/Nativeは、[Kotlin Multiplatformプラグイン](gradle-configure-project.md#targeting-multiple-platforms)を介して[Gradle](https://gradle.org)ビルドシステムを使用できます。

> Macを使用し、iOSまたはその他のAppleターゲット向けアプリケーションを作成および実行したい場合は、まず[Xcode Command Line Tools](https://developer.apple.com/download/)をインストールし、起動して、ライセンス条項に同意する必要があります。
>
{style="note"}

## Kotlinライブラリを作成する

> Kotlin/Nativeプロジェクトの作成方法とIntelliJ IDEAでの開き方に関する詳細な最初のステップと手順については、[Kotlin/Native入門](native-get-started.md#using-gradle)チュートリアルを参照してください。
>
{style="tip"}

Kotlin/Nativeコンパイラは、KotlinコードからmacOSおよびiOS用のフレームワークを生成できます。作成されたフレームワークには、Swift/Objective-Cで使用するために必要なすべての宣言とバイナリが含まれています。

まず、Kotlinライブラリを作成しましょう。

1. `src/nativeMain/kotlin`ディレクトリに、ライブラリの内容を含む`lib.kt`ファイルを作成します。

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

2. `build.gradle(.kts)` Gradleビルドファイルを次のように更新します。

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

    `binaries {}`ブロックは、動的ライブラリまたは共有ライブラリを生成するようにプロジェクトを構成します。

    Kotlin/Nativeは、iOS用の`iosArm64`、`iosX64`、および`iosSimulatorArm64`ターゲット、ならびにmacOS用の`macosX64`と`macosArm64`ターゲットをサポートしています。したがって、`iosArm64()`をターゲットプラットフォームに対応するGradle関数に置き換えることができます。

    | ターゲットプラットフォーム/デバイス | Gradle関数       |
    |------------------------|-----------------------|
    | macOS x86_64           | `macosX64()`          | 
    | macOS ARM64            | `macosArm64()`        |
    | iOS ARM64              | `iosArm64()`          | 
    | iOS Simulator (x86_64) | `iosX64()`            |
    | iOS Simulator (ARM64)  | `iosSimulatorArm64()` |

    他のサポートされているAppleターゲットについては、[Kotlin/Nativeターゲットサポート](native-target-support.md)を参照してください。

3. IDEで`linkDebugFrameworkNative` Gradleタスクを実行するか、ターミナルで次のコンソールコマンドを使用してフレームワークをビルドします。

   ```bash
   ./gradlew linkDebugFrameworkNative
   ```
    
ビルドにより、フレームワークは`build/bin/native/debugFramework`ディレクトリに生成されます。

> `linkNative` Gradleタスクを使用して、フレームワークの`debug`および`release`バリアントの両方を生成することもできます。
>
{style="tip"}

## 生成されたフレームワークヘッダー

各フレームワークのバリアントにはヘッダーファイルが含まれています。ヘッダーはターゲットプラットフォームに依存しません。ヘッダーファイルには、Kotlinコードの定義といくつかのKotlin全体にわたる宣言が含まれています。内容を見てみましょう。

### Kotlin/Nativeランタイム宣言

`build/bin/native/debugFramework/Demo.framework/Headers`ディレクトリで、`Demo.h`ヘッダーファイルを開きます。
Kotlinランタイム宣言を見てみましょう。

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

Kotlinクラスは、Swift/Objective-Cにおいて`NSObject`クラスを拡張する`KotlinBase`基底クラスを持ちます。
コレクションと例外のラッパーも存在します。ほとんどのコレクションタイプは、Swift/Objective-Cの類似のコレクションタイプにマッピングされます。

| Kotlin      | Swift               | Objective-C         |
|-------------|---------------------|---------------------|
| List        | Array               | NSArray             |
| MutableList | NSMutableArray      | NSMutableArray      |
| Set         | Set                 | NSSet               |
| MutableSet  | NSMutableSet        | NSMutableSet        |
| Map         | Dictionary          | NSDictionary        |
| MutableMap  | NSMutableDictionary | NSMutableDictionary |

### Kotlinの数値型とNSNumber

`Demo.h`ファイルの次の部分には、Kotlin/Nativeの数値型と`NSNumber`間の型マッピングが含まれています。基底クラスはObjective-Cでは`DemoNumber`、Swiftでは`KotlinNumber`と呼ばれます。これは`NSNumber`を拡張します。

各Kotlinの数値型には、対応する事前定義された子クラスがあります。

| Kotlin    | Swift           | Objective-C        | 単純型               |
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

すべての数値型には、対応する単純型から新しいインスタンスを作成するクラスメソッドがあります。また、単純値を抽出するためのインスタンスメソッドもあります。概略的には、すべてのそのような宣言は次のようになります。

```objc
__attribute__((swift_name("Kotlin__TYPE__")))
@interface Demo__TYPE__ : DemoNumber
- (instancetype)initWith__TYPE__:(__CTYPE__)value;
+ (instancetype)numberWith__TYPE__:(__CTYPE__)value;
@end;
```

ここで、`__TYPE__`は単純型名の1つであり、`__CTYPE__`は対応するObjective-C型です（例: `initWithChar(char)`）。

これらの型は、ボックス化されたKotlinの数値型をSwift/Objective-Cにマッピングするために使用されます。
Swiftでは、コンストラクタを呼び出してインスタンスを作成できます（例: `KotlinLong(value: 42)`）。

### Kotlinのクラスとオブジェクト

`class`と`object`がSwift/Objective-Cにどのようにマッピングされるか見てみましょう。生成された`Demo.h`ファイルには、`Class`、`Interface`、および`Object`の正確な定義が含まれています。

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

このコードのObjective-C属性は、SwiftとObjective-Cの両方の言語からフレームワークを使用するのに役立ちます。`DemoInterface`、`DemoClazz`、`DemoObject`は、それぞれ`Interface`、`Clazz`、`Object`のために作成されます。

`Interface`は`@protocol`に変換され、`class`と`object`の両方は`@interface`として表現されます。`Demo`プレフィックスはフレームワーク名に由来します。ヌル許容の戻り値の型`ULong?`は、Objective-Cでは`DemoULong`に変換されます。

### Kotlinのグローバル宣言

Kotlinのすべてのグローバル関数は、Objective-Cでは`DemoLibKt`に、Swiftでは`LibKt`に変換されます。ここで`Demo`は`kotlinc-native`の`-output`パラメータによって設定されたフレームワーク名です。

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

Kotlinの`String`とObjective-Cの`NSString*`は透過的にマッピングされます。同様に、Kotlinの`Unit`型は`void`にマッピングされます。
プリミティブ型は直接マッピングされます。非ヌル許容のプリミティブ型は透過的にマッピングされます。
ヌル許容のプリミティブ型は、[表](#kotlin-numbers-and-nsnumber)に示されているように`Kotlin<TYPE>*`型にマッピングされます。
高階関数`acceptFunF`と`supplyFun`の両方が含まれており、Objective-Cブロックを受け入れます。

型マッピングの詳細については、[Swift/Objective-Cとの相互運用](native-objc-interop.md#mappings)を参照してください。

## ガベージコレクションと参照カウント

SwiftとObjective-Cは自動参照カウント（ARC）を使用します。Kotlin/Nativeには独自の[ガベージコレクター](native-memory-manager.md#garbage-collector)があり、これは[Swift/Objective-C ARC](native-arc-integration.md)とも統合されています。

使用されていないKotlinオブジェクトは自動的に削除されます。SwiftまたはObjective-CからKotlin/Nativeインスタンスのライフタイムを制御するための追加のステップは必要ありません。

## Objective-Cからコードを使用する

Objective-Cからフレームワークを呼び出してみましょう。フレームワークディレクトリに、以下のコードを含む`main.m`ファイルを作成します。

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

ここでは、Objective-CコードからKotlinクラスを直接呼び出しています。Kotlinオブジェクトは、`<オブジェクト名>.shared`クラスプロパティを使用します。これにより、オブジェクトの唯一のインスタンスを取得し、そのオブジェクトのメソッドを呼び出すことができます。

`Clazz`クラスのインスタンスを作成するために、一般的なパターンが使用されています。Objective-Cでは`[[ DemoClazz alloc] init]`を呼び出します。パラメータのないコンストラクタには`[DemoClazz new]`も使用できます。

Kotlinソースからのグローバル宣言は、Objective-Cでは`DemoLibKt`クラスの下にスコープされます。
すべてのKotlin関数は、そのクラスのクラスメソッドに変換されます。

`strings`関数はObjective-Cで`DemoLibKt.stringsStr`関数に変換されるため、`NSString`を直接渡すことができます。戻り値も`NSString`として表示されます。

## Swiftからコードを使用する

生成されたフレームワークには、Swiftでの使用を容易にするヘルパー属性が含まれています。
[前のObjective-Cの例](#use-code-from-objective-c)をSwiftに変換してみましょう。

フレームワークディレクトリに、以下のコードを含む`main.swift`ファイルを作成します。

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

元のKotlinコードとそのSwiftバージョンには、いくつかの小さな違いがあります。Kotlinでは、任意の`object`宣言は1つのインスタンスしか持ちません。この単一のインスタンスにアクセスするには、`Object.shared`構文を使用します。

Kotlinの関数名とプロパティ名はそのまま翻訳されます。Kotlinの`String`はSwiftの`String`に変換されます。Swiftは`NSNumber*`のボックス化も隠蔽します。SwiftのクロージャをKotlinに渡し、SwiftからKotlinのラムダ関数を呼び出すこともできます。

型マッピングの詳細については、[Swift/Objective-Cとの相互運用](native-objc-interop.md#mappings)を参照してください。

## フレームワークをiOSプロジェクトに接続する

これで、生成されたフレームワークを依存関係としてiOSプロジェクトに接続できます。セットアップしてプロセスを自動化する方法は複数あります。最適な方法を選択してください。

<a href="https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-ios-integration-overview.html"><img src="choose-ios-integration.svg" width="700" alt="Choose iOS integration method" style="block"/></a>

## 次のステップ

* [Objective-Cとの相互運用についてさらに学習する](native-objc-interop.md)
* [Cとの相互運用がKotlinでどのように実装されているか確認する](native-c-interop.md)
* [Kotlin/Nativeを動的ライブラリとして使用するチュートリアルを確認する](native-dynamic-libraries.md)