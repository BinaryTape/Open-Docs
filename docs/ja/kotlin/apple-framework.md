[//]: # (title: AppleフレームワークとしてのKotlin/Native – チュートリアル)

> Objective-Cライブラリのインポートは[ベータ](native-lib-import-stability.md#stability-of-c-and-objective-c-library-import)段階です。
> `cinterop` ツールによってObjective-Cライブラリから生成されたすべてのKotlin宣言には、`@ExperimentalForeignApi` アノテーションが付与されている必要があります。
>
> Kotlin/Nativeに同梱されているネイティブプラットフォームライブラリ（Foundation、UIKit、POSIXなど）は、一部のAPIでのみオプトインが必要です。
>
{style="note"}

Kotlin/Nativeは、Swift/Objective-Cとの双方向の相互運用性を提供します。Kotlinコード内でObjective-Cのフレームワークやライブラリを使用することも、Swift/Objective-Cコード内でKotlinモジュールを使用することも可能です。

Kotlin/Nativeには一連の事前にインポートされたシステムフレームワークが付属しています。また、既存のフレームワークをインポートしてKotlinから使用することも可能です。このチュートリアルでは、独自のフレームワークを作成し、macOSおよびiOS上のSwift/Objective-CアプリケーションからKotlin/Nativeコードを使用する方法を学びます。

このチュートリアルでは、以下の内容を行います：

* [Kotlinライブラリを作成し、フレームワークとしてコンパイルする](#create-a-kotlin-library)
* [生成されたSwift/Objective-C APIコードを確認する](#generated-framework-headers)
* [Objective-Cからフレームワークを使用する](#use-code-from-objective-c)
* [Swiftからフレームワークを使用する](#use-code-from-swift)

コマンドラインを使用して直接、またはスクリプトファイル（`.sh` や `.bat` ファイルなど）を使用してKotlinフレームワークを生成できます。しかし、このアプローチは数百のファイルやライブラリを持つ大規模なプロジェクトには適していません。
ビルドシステムを使用すると、Kotlin/Nativeコンパイラのバイナリや推移的な依存関係を持つライブラリのダウンロードとキャッシュ、コンパイラやテストの実行が簡素化されます。
Kotlin/Nativeは、[Kotlin Multiplatformプラグイン](gradle-configure-project.md#targeting-multiple-platforms)を通じて [Gradle](https://gradle.org) ビルドシステムを使用できます。

> Macを使用しており、iOSやその他のAppleターゲット向けのアプリケーションを作成・実行したい場合は、まず [Xcode Command Line Tools](https://developer.apple.com/download/) をインストールして起動し、ライセンス条項に同意する必要があります。
>
{style="note"}

## Kotlinライブラリの作成

> 新しいKotlin/Nativeプロジェクトの作成方法やIntelliJ IDEAでの開き方についての詳細な手順については、[Kotlin/Nativeを始める](native-get-started.md#using-gradle) チュートリアルを参照してください。
>
{style="tip"}

Kotlin/Nativeコンパイラは、KotlinコードからmacOSおよびiOS用のフレームワークを生成できます。作成されたフレームワークには、Swift/Objective-Cで使用するために必要なすべての宣言とバイナリが含まれています。

まず、Kotlinライブラリを作成しましょう：

1. `src/nativeMain/kotlin` ディレクトリに、ライブラリの内容を含む `lib.kt` ファイルを作成します：

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

2. `build.gradle(.kts)` Gradleビルドファイルを以下のように更新します：

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

    `binaries {}` ブロックは、プロジェクトがダイナミックライブラリまたは共有ライブラリを生成するように構成します。

    Kotlin/Nativeは、iOS向けに `iosArm64`、`iosX64`、`iosSimulatorArm64` ターゲットをサポートしており、macOS向けに `macosArm64` および `macosX64` ターゲットをサポートしています。そのため、`iosArm64()` をターゲットプラットフォームに応じたGradle関数に置き換えることができます：

    | ターゲットプラットフォーム/デバイス | Gradle関数            |
    |------------------------|-----------------------|
    | macOS ARM64            | `macosArm64()`        |
    | macOS x86_64           | `macosX64()`          |
    | iOS ARM64              | `iosArm64()`          |
    | iOS Simulator (ARM64)  | `iosSimulatorArm64()` |
    | iOS Simulator (x86_64) | `iosX64()`            |

    その他のサポートされているAppleターゲットについては、[Kotlin/Nativeのターゲットサポート](native-target-support.md) を参照してください。

3. IDEで `linkDebugFrameworkNative` Gradleタスクを実行するか、ターミナルで以下のコンソールコマンドを使用してフレームワークをビルドします：

   ```bash
   ./gradlew linkDebugFrameworkNative
   ```
    
ビルドにより、`build/bin/native/debugFramework` ディレクトリにフレームワークが生成されます。

> `linkNative` Gradleタスクを使用して、フレームワークの `debug` と `release` の両方のバリアントを生成することもできます。
>
{style="tip"}

## 生成されたフレームワークヘッダー

各フレームワークバリアントにはヘッダーファイルが含まれています。ヘッダーはターゲットプラットフォームに依存しません。ヘッダーファイルには、作成したKotlinコードの定義と、Kotlin全体に関わるいくつかの宣言が含まれています。中身を見てみましょう。

### Kotlin/Nativeランタイムの宣言

`build/bin/native/debugFramework/Demo.framework/Headers` ディレクトリにある `Demo.h` ヘッダーファイルを開きます。
Kotlinランタイムの宣言を確認してください：

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

Kotlinクラスは、Swift/Objective-Cにおいて `NSObject` クラスを継承する `KotlinBase` 基底クラスを持ちます。
また、コレクションや例外のためのラッパーもあります。ほとんどのコレクション型は、Swift/Objective-Cの類似したコレクション型にマッピングされます：

| Kotlin      | Swift               | Objective-C         |
|-------------|---------------------|---------------------|
| List        | Array               | NSArray             |
| MutableList | NSMutableArray      | NSMutableArray      |
| Set         | Set                 | NSSet               |
| MutableSet  | NSMutableSet        | NSMutableSet        |
| Map         | Dictionary          | NSDictionary        |
| MutableMap  | NSMutableDictionary | NSMutableDictionary |

### Kotlinの数値とNSNumber

`Demo.h` ファイルの次のセクションには、Kotlin/Nativeの数値型と `NSNumber` の間の型マッピングが含まれています。基底クラスはObjective-Cでは `DemoNumber`、Swiftでは `KotlinNumber` と呼ばれ、`NSNumber` を継承しています。

各Kotlin数値型に対して、対応する事前定義された子クラスが存在します：

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

すべての数値型には、対応する単純型から新しいインスタンスを作成するためのクラスメソッドがあります。また、単純な値を抽出するためのインスタンスメソッドもあります。図式的には、これらすべての宣言は以下のようになります：

```objc
__attribute__((swift_name("Kotlin__TYPE__")))
@interface Demo__TYPE__ : DemoNumber
- (instancetype)initWith__TYPE__:(__CTYPE__)value;
+ (instancetype)numberWith__TYPE__:(__CTYPE__)value;
@end;
```

ここで、`__TYPE__` は単純型の名前の1つであり、`__CTYPE__` は対応するObjective-Cの型（例：`initWithChar(char)`）です。

これらの型は、ボックス化されたKotlinの数値型をSwift/Objective-Cにマッピングするために使用されます。
Swiftでは、コンストラクタを呼び出してインスタンスを作成できます（例：`KotlinLong(value: 42)`）。

### Kotlinのクラスとオブジェクト

`class` と `object` がどのようにSwift/Objective-Cにマッピングされるか見てみましょう。生成された `Demo.h` ファイルには、`Class`、`Interface`、`Object` の正確な定義が含まれています：

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

このコード内のObjective-C属性は、SwiftとObjective-Cの両方の言語からフレームワークを使用するのに役立ちます。`DemoInterface`、`DemoClazz`、`DemoObject` は、それぞれ `Interface`、`Clazz`、`Object` のために作成されます。

`Interface` は `@protocol` に変換され、`class` と `object` の両方は `@interface` として表現されます。`Demo` プレフィックスはフレームワーク名に由来します。Null許容な戻り値の型 `ULong?` は、Objective-Cでは `DemoULong` に変換されます。

### Kotlinのグローバル宣言

Kotlinのすべてのグローバル関数は、Objective-Cでは `DemoLibKt` に、Swiftでは `LibKt` に変換されます。
ここで `Demo` は `kotlinc-native` の `-output` パラメータで設定されたフレームワーク名です：

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

Kotlinの `String` とObjective-Cの `NSString*` は透過的にマッピングされます。同様に、Kotlinの `Unit` 型は `void` にマッピングされます。
プリミティブ型は直接マッピングされます。Null非許容なプリミティブ型は透過的にマッピングされます。
Null許容なプリミティブ型は、[表](#kotlin-numbers-and-nsnumber)に示されているように `Kotlin<TYPE>*` 型にマッピングされます。
高階関数である `acceptFunF` と `supplyFun` は両方とも含まれており、Objective-Cのブロックを受け入れます。

型マッピングに関する詳細は、[Swift/Objective-Cとの相互運用性](native-objc-interop.md#mappings) で確認できます。

## ガベージコレクションと参照カウント

SwiftとObjective-Cは自動参照カウント（ARC）を使用します。Kotlin/Nativeには独自の [ガベージコレクタ](native-memory-manager.md#garbage-collector) があり、これは [Swift/Objective-CのARCとも統合](native-arc-integration.md) されています。

使用されていないKotlinオブジェクトは自動的に削除されます。SwiftやObjective-CからKotlin/Nativeインスタンスの存続期間を制御するために追加の手順を実行する必要はありません。

## Objective-Cからコードを使用する

Objective-Cからフレームワークを呼び出してみましょう。フレームワークディレクトリに、以下のコードを含む `main.m` ファイルを作成します：

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

ここでは、Objective-CコードからKotlinクラスを直接呼び出しています。Kotlinの `object` は `<object name>.shared` クラスプロパティを使用します。これにより、オブジェクトの唯一のインスタンスを取得し、その上でオブジェクトメソッドを呼び出すことができます。

`Clazz` クラスのインスタンスを作成するために、広く普及しているパターンが使用されています。Objective-Cで `[[ DemoClazz alloc] init]` を呼び出します。パラメータのないコンストラクタには `[DemoClazz new]` を使用することもできます。

Kotlinソースからのグローバル宣言は、Objective-Cでは `DemoLibKt` クラスの下にスコープされます。
すべてのKotlin関数はそのクラスのクラスメソッドに変換されます。

`strings` 関数はObjective-Cでは `DemoLibKt.stringsStr` 関数に変換されるため、`NSString` を直接渡すことができます。戻り値も `NSString` として見えます。

## Swiftからコードを使用する

生成したフレームワークには、Swiftで使いやすくするためのヘルパー属性が含まれています。[前のObjective-Cの例](#use-code-from-objective-c)をSwiftに変換してみましょう。

フレームワークディレクトリに、以下のコードを含む `main.swift` ファイルを作成します：

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

元のKotlinコードとそのSwift版の間には、いくつかの小さな違いがあります。Kotlinでは、あらゆる `object` 宣言は1つのインスタンスしか持ちません。この単一のインスタンスにアクセスするために `Object.shared` 構文が使用されます。

Kotlinの関数名とプロパティ名はそのまま翻訳されます。Kotlinの `String` はSwiftの `String` に変換されます。Swiftでは `NSNumber*` のボクシングも隠蔽されます。また、SwiftのクロージャをKotlinに渡したり、SwiftからKotlinのラムダ関数を呼び出したりすることも可能です。

型マッピングに関する詳細は、[Swift/Objective-Cとの相互運用性](native-objc-interop.md#mappings) で確認できます。

## iOSプロジェクトへのフレームワークの接続

生成されたフレームワークを依存関係としてiOSプロジェクトに接続できるようになりました。これをセットアップしプロセスを自動化する方法はいくつかあります。自分に最適な方法を選択してください：

<a href="https://kotlinlang.org/docs/multiplatform/multiplatform-ios-integration-overview.html"><img src="choose-ios-integration.svg" width="700" alt="iOS統合方法の選択" style="block"/></a>

## 次のステップ

* [Objective-Cとの相互運用性について詳しく学ぶ](native-objc-interop.md)
* [KotlinでのCとの相互運用性の実装方法を確認する](native-c-interop.md)
* [ダイナミックライブラリとしてのKotlin/Nativeチュートリアルを確認する](native-dynamic-libraries.md)