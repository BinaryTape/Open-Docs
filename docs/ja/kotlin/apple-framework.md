---
title: "Kotlin/NativeをApple frameworkとして利用する – チュートリアル"
---
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

:::note
Objective-C ライブラリのインポートは[試験段階](components-stability#stability-levels-explained)です。
cinteropツールによってObjective-Cライブラリから生成されたすべてのKotlinの宣言には、`@ExperimentalForeignApi` アノテーションが必要です。

Kotlin/Native に同梱されているネイティブプラットフォームライブラリ（Foundation、UIKit、POSIXなど）は、一部のAPIでのみオプトインが必要です。

Kotlin/Nativeは、Swift/Objective-Cとの双方向の相互運用性を提供します。Objective-CのフレームワークやライブラリをKotlinのコードで使用することも、KotlinのモジュールをSwift/Objective-Cのコードで使用することもできます。

Kotlin/Nativeには、事前にインポートされたシステムフレームワークのセットが付属しています。既存のフレームワークをインポートしてKotlinから使用することもできます。このチュートリアルでは、独自のフレームワークを作成し、macOSおよびiOS上のSwift/Objective-CアプリケーションからKotlin/Nativeのコードを使用する方法を学びます。

このチュートリアルでは、以下の内容を学びます。

* [Kotlinライブラリを作成し、フレームワークにコンパイルする](#create-a-kotlin-library)
* [生成されたSwift/Objective-C APIコードを調べる](#generated-framework-headers)
* [Objective-Cからフレームワークを使用する](#use-code-from-objective-c)
* [Swiftからフレームワークを使用する](#use-code-from-swift)

コマンドラインを使用してKotlinのフレームワークを生成できます。直接またはスクリプトファイル（`.sh`や`.bat`ファイルなど）を使用します。
ただし、このアプローチは、数百のファイルとライブラリを持つ大規模なプロジェクトには適していません。
ビルドシステムを使用すると、Kotlin/Nativeコンパイラバイナリと推移的な依存関係を持つライブラリをダウンロードしてキャッシュしたり、コンパイラとテストを実行したりすることで、プロセスを簡素化できます。
Kotlin/Nativeは、[Kotlin Multiplatform plugin](gradle-configure-project#targeting-multiple-platforms)を介して[Gradle](https://gradle.org)ビルドシステムを使用できます。

Macを使用しており、iOSまたはその他のAppleターゲット用のアプリケーションを作成および実行する場合は、最初に[Xcode Command Line Tools](https://developer.apple.com/download/)をインストールし、起動して、ライセンス条項に同意する必要があります。

:::

## Kotlinライブラリを作成する

:::tip
詳しい最初の手順については、[Kotlin/Native入門](native-get-started#using-gradle)チュートリアルを参照してください。
新しいKotlin/Nativeプロジェクトを作成し、IntelliJ IDEAで開く方法について説明しています。

:::

Kotlin/Nativeコンパイラは、KotlinのコードからmacOSおよびiOS用のフレームワークを生成できます。作成されたフレームワークには、Swift/Objective-Cで使用するために必要なすべての宣言とバイナリが含まれています。

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
    
   fun acceptFun(f: (String) `->` String?) = f("Kotlin/Native rocks!")
   fun supplyFun() : (String) `->` String? = { "$it is cool!" }
   ```

2. `build.gradle(.kts)` Gradleビルドファイルを以下のように更新します。

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

    `binaries {}`ブロックは、動的ライブラリまたは共有ライブラリを生成するようにプロジェクトを構成します。

    Kotlin/Nativeは、iOS用の`iosArm64`、`iosX64`、`iosSimulatorArm64`ターゲット、およびmacOS用の`macosX64`および`macosArm64`ターゲットをサポートしています。そのため、`iosArm64()`を、ターゲットプラットフォームに対応するGradle関数に置き換えることができます。

    | ターゲットプラットフォーム/デバイス | Gradle関数            |
    |------------------------|-----------------------|
    | macOS x86_64           | `macosX64()`          | 
    | macOS ARM64            | `macosArm64()`        |
    | iOS ARM64              | `iosArm64()`          | 
    | iOS Simulator (x86_64) | `iosX64()`            |
    | iOS Simulator (ARM64)  | `iosSimulatorArm64()` |

    サポートされている他のAppleターゲットについては、[Kotlin/Nativeターゲットのサポート](native-target-support)を参照してください。

3. IDEで`linkDebugFrameworkNative` Gradleタスクを実行するか、ターミナルで次のコンソールコマンドを使用して、フレームワークをビルドします。

   ```bash
   ./gradlew linkDebugFrameworkNative
   ```
    
ビルドにより、フレームワークが`build/bin/native/debugFramework`ディレクトリに生成されます。

:::tip
`linkNative` Gradleタスクを使用して、フレームワークの`debug`バリアントと`release`バリアントの両方を生成することもできます。

:::

## 生成されたフレームワークヘッダー

各フレームワークバリアントには、ヘッダーファイルが含まれています。ヘッダーは、ターゲットプラットフォームに依存しません。ヘッダーファイルには、Kotlinコードの定義と、いくつかのKotlin全体の宣言が含まれています。中身を見てみましょう。

### Kotlin/Nativeランタイム宣言

`build/bin/native/debugFramework/Demo.framework/Headers`ディレクトリで、`Demo.h`ヘッダーファイルを開きます。Kotlinランタイム宣言を見てください。

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

Kotlinのクラスは、Swift/Objective-Cで`KotlinBase`基底クラスを持ち、そこで`NSObject`クラスを拡張します。
コレクションと例外のラッパーもあります。ほとんどのコレクション型は、Swift/Objective-Cの同様のコレクション型にマッピングされます。

| Kotlin      | Swift               | Objective-C         |
|-------------|---------------------|---------------------|
| List        | Array               | NSArray             |
| MutableList | NSMutableArray      | NSMutableArray      |
| Set         | Set                 | NSSet               |
| MutableSet  | NSMutableSet        | NSMutableSet        |
| Map         | Dictionary          | NSDictionary        |
| MutableMap  | NSMutableDictionary | NSMutableDictionary |

### Kotlinの数値とNSNumber

`Demo.h`ファイルの次の部分には、Kotlin/Nativeの数値型と`NSNumber`の間の型マッピングが含まれています。ベースクラスは、Objective-Cでは`DemoNumber`、Swiftでは`KotlinNumber`と呼ばれます。これは`NSNumber`を拡張します。

Kotlinの数値型ごとに、対応する定義済みの子クラスがあります。

| Kotlin    | Swift           | Objective-C        | Simple type          |
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

すべての数値型には、対応する単純型から新しいインスタンスを作成するクラスメソッドがあります。また、単純な値を抽出して戻すインスタンスメソッドもあります。概略的に、このような宣言はすべて次のようになります。

```objc
__attribute__((swift_name("Kotlin__TYPE__")))
@interface Demo__TYPE__ : DemoNumber
- (instancetype)initWith__TYPE__:(__CTYPE__)value;
+ (instancetype)numberWith__TYPE__:(__CTYPE__)value;
@end;
```

ここで、`__TYPE__`は単純な型名の1つであり、`__CTYPE__`は対応するObjective-C型です。
たとえば、`initWithChar(char)`です。

これらの型は、ボックス化されたKotlinの数値型をSwift/Objective-Cにマッピングするために使用されます。
Swiftでは、コンストラクタを呼び出してインスタンスを作成できます。たとえば、`KotlinLong(value: 42)`です。

### Kotlinからのクラスとオブジェクト

`class`と`object`がSwift/Objective-Cにどのようにマッピングされるかを見てみましょう。生成された`Demo.h`ファイルには、`Class`、`Interface`、および`Object`の正確な定義が含まれています。

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

このコードのObjective-C属性は、SwiftとObjective-Cの両方の言語からフレームワークを使用するのに役立ちます。`DemoInterface`、`DemoClazz`、および`DemoObject`は、それぞれ`Interface`、`Clazz`、および`Object`に対して作成されます。

`Interface`は`@protocol`に変換され、`class`と`object`の両方が`@interface`として表されます。
`Demo`プレフィックスは、フレームワーク名に由来します。nullableの戻り値の型`ULong?`は、Objective-Cでは`DemoULong`に変換されます。

### Kotlinからのグローバル宣言

Kotlinからのすべてのグローバル関数は、Objective-Cでは`DemoLibKt`に、Swiftでは`LibKt`に変換されます。
ここで、`Demo`は`kotlinc-native`の`-output`パラメータで設定されたフレームワーク名です。

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
プリミティブ型は直接マッピングされます。nullableでないプリミティブ型は透過的にマッピングされます。
nullableのプリミティブ型は、[表](#kotlin-numbers-and-nsnumber)に示すように、`Kotlin<TYPE>*`型にマッピングされます。
高階関数`acceptFunF`と`supplyFun`の両方が含まれており、Objective-Cブロックを受け入れます。

型マッピングの詳細については、[Swift/Objective-Cとの相互運用性](native-objc-interop#mappings)を参照してください。

## ガベージコレクションと参照カウント

SwiftとObjective-Cは、自動参照カウント（ARC）を使用します。Kotlin/Nativeには、独自の[ガベージコレクタ](native-memory-manager#garbage-collector)があり、
これは[Objective-C/Swift ARCと統合](native-arc-integration)されています。

未使用のKotlinオブジェクトは自動的に削除されます。SwiftまたはObjective-CからKotlin/Nativeインスタンスのライフタイムを制御するために追加の手順を実行する必要はありません。

## Objective-Cからコードを使用する

Objective-Cからフレームワークを呼び出してみましょう。フレームワークディレクトリに、次のコードを含む`main.m`ファイルを作成します。

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

ここでは、KotlinクラスをObjective-Cコードから直接呼び出します。Kotlinオブジェクトは、`<object name>.shared`クラスプロパティを使用します。これにより、オブジェクトの唯一のインスタンスを取得し、そのオブジェクトメソッドを呼び出すことができます。

広範囲にわたるパターンは、`Clazz`クラスのインスタンスを作成するために使用されます。Objective-Cで`[[ DemoClazz alloc] init]`を呼び出します。パラメータのないコンストラクタには、`[DemoClazz new]`も使用できます。

Kotlinソースからのグローバル宣言は、Objective-Cの`DemoLibKt`クラスの下にスコープされます。
すべてのKotlin関数は、そのクラスのクラスメソッドに変換されます。

`strings`関数はObjective-Cで`DemoLibKt.stringsStr`関数に変換されるため、`NSString`を直接渡すことができます。
戻り値も`NSString`として表示されます。

## Swiftからコードを使用する

生成したフレームワークには、Swiftでの使用を容易にするヘルパー属性があります。前の[Objective-Cの例](#use-code-from-objective-c)をSwiftに変換してみましょう。

フレームワークディレクトリに、次のコードを含む`main.swift`ファイルを作成します。

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

元のKotlinコードとそのSwiftバージョンには、いくつかの小さな違いがあります。Kotlinでは、任意のオブジェクト宣言には1つのインスタンスしかありません。`Object.shared`構文は、この単一のインスタンスにアクセスするために使用されます。

Kotlinの関数名とプロパティ名はそのまま変換されます。Kotlinの`String`はSwiftの`String`に変換されます。Swiftは`NSNumber*`のボクシングも非表示にします。SwiftクロージャをKotlinに渡し、SwiftからKotlinラムダ関数を呼び出すこともできます。

型マッピングの詳細については、[Swift/Objective-Cとの相互運用性](native-objc-interop#mappings)を参照してください。

## フレームワークをiOSプロジェクトに接続する

これで、生成されたフレームワークを依存関係としてiOSプロジェクトに接続できます。設定してプロセスを自動化する方法は複数あります。最適な方法を選択してください。

<a href="multiplatform-ios-integration-overview"><img src="/img/choose-ios-integration.svg" width="700" alt="Choose iOS integration method" /></a>

## 次のステップ

* [Objective-Cとの相互運用性についてさらに詳しく学ぶ](native-objc-interop)
* [KotlinでのCとの相互運用性の実装方法を見る](native-c-interop)
* [Kotlin/Nativeを動的ライブラリとしてチェックアウトするチュートリアル](native-dynamic-libraries)