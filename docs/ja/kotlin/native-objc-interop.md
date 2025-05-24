---
title: Swift/Objective-Cとの相互運用性
---
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

:::note
Objective-Cライブラリのインポートは[試験的](components-stability#stability-levels-explained)です。
cinteropツールによってObjective-Cライブラリから生成されたすべてのKotlin宣言には、`@ExperimentalForeignApi`アノテーションが必要です。

Kotlin/Nativeに同梱されているネイティブプラットフォームライブラリ（Foundation、UIKit、POSIXなど）は、一部のAPIのみオプトインが必要です。

このドキュメントでは、Swift/Objective-CとKotlin/Nativeの相互運用性について説明します。Kotlinの宣言をSwift/Objective-Cコードで使用する方法、およびObjective-Cの宣言をKotlinコードで使用する方法について説明します。

役立つ可能性のあるその他のリソース：

* [Kotlin-Swift interopedia](https://github.com/kotlin-hands-on/kotlin-swift-interopedia)。SwiftコードでKotlinの宣言を使用する方法の例を集めたものです。
* [Swift/Objective-C ARCとの統合](native-arc-integration)セクション。KotlinのトレースGCとObjective-CのARC間の統合の詳細について説明しています。

## Swift/Objective-CライブラリをKotlinにインポートする

Objective-Cのフレームワークとライブラリは、ビルドに適切にインポートされていれば、Kotlinコードで使用できます（システムフレームワークはデフォルトでインポートされます）。
詳細については、以下を参照してください。

* [ライブラリ定義ファイルを作成および構成する](native-definition-file)
* [ネイティブライブラリのコンパイルを構成する](multiplatform-configure-compilations#configure-interop-with-native-languages)

Swiftライブラリは、APIが`@objc`でObjective-Cにエクスポートされている場合、Kotlinコードで使用できます。
純粋なSwiftモジュールはまだサポートされていません。

## Swift/Objective-CでKotlinを使用する

Kotlinモジュールは、フレームワークにコンパイルされている場合、Swift/Objective-Cコードで使用できます。

* バイナリを宣言する方法については、[最終的なネイティブバイナリをビルドする](multiplatform-build-native-binaries#declare-binaries)を参照してください。
* 例については、[Kotlin Multiplatformサンプルプロジェクト](https://github.com/Kotlin/kmm-basic-sample)を確認してください。

### Objective-CおよびSwiftからKotlinの宣言を非表示にする

`@HiddenFromObjC`アノテーションは[試験的](components-stability#stability-levels-explained)であり、[オプトイン](opt-in-requirements)が必要です。

KotlinコードをObjective-C/Swiftにさらに適したものにするために、`@HiddenFromObjC`を使用して、Kotlinの宣言をObjective-CおよびSwiftから非表示にすることができます。このアノテーションは、関数またはプロパティのObjective-Cへのエクスポートを無効にします。

または、Kotlinの宣言に`internal`修飾子を付けて、コンパイルモジュールでの可視性を制限することもできます。Kotlinの宣言をObjective-CおよびSwiftから非表示にするだけで、他のKotlinモジュールからは引き続き表示する場合は、`@HiddenFromObjC`を選択してください。

[Kotlin-Swift interopediaで例を参照してください](https://github.com/kotlin-hands-on/kotlin-swift-interopedia/blob/main/docs/overview/HiddenFromObjC)。

### Swiftでのリファインの使用

`@ShouldRefineInSwift`アノテーションは[試験的](components-stability#stability-levels-explained)であり、[オプトイン](opt-in-requirements)が必要です。

`@ShouldRefineInSwift`は、Kotlinの宣言をSwiftで記述されたラッパーに置き換えるのに役立ちます。このアノテーションは、生成されたObjective-C APIで関数またはプロパティを`swift_private`としてマークします。このような宣言には`__`プレフィックスが付き、Swiftからは見えなくなります。

Swiftコードでこれらの宣言を使用してSwiftフレンドリーなAPIを作成できますが、Xcodeのオートコンプリートでは提案されません。

* SwiftでのObjective-C宣言のリファインの詳細については、[公式Appleドキュメント](https://developer.apple.com/documentation/swift/improving-objective-c-api-declarations-for-swift)を参照してください。
* `@ShouldRefineInSwift`アノテーションの使用方法の例については、[Kotlin-Swift interopedia](https://github.com/kotlin-hands-on/kotlin-swift-interopedia/blob/main/docs/overview/ShouldRefineInSwift)を参照してください。

### 宣言名の変更

`@ObjCName`アノテーションは[試験的](components-stability#stability-levels-explained)であり、[オプトイン](opt-in-requirements)が必要です。

Kotlinの宣言の名前変更を避けるには、`@ObjCName`アノテーションを使用します。これは、アノテーション付きのクラス、インターフェース、または別のKotlinエンティティにカスタムのObjective-CおよびSwift名を使用するようにKotlinコンパイラーに指示します。

```kotlin
@ObjCName(swiftName = "MySwiftArray")
class MyKotlinArray {
    @ObjCName("index")
    fun indexOf(@ObjCName("of") element: String): Int = TODO()
}

// Usage with the ObjCName annotations
let array = MySwiftArray()
let index = array.index(of: "element")
```

[Kotlin-Swift interopediaの別の例を参照してください](https://github.com/kotlin-hands-on/kotlin-swift-interopedia/blob/main/docs/overview/ObjCName)。

### KDocコメントでドキュメントを提供する

ドキュメントは、APIを理解するために不可欠です。共有Kotlin APIのドキュメントを提供することで、使用法、注意点などについてユーザーとコミュニケーションできます。

デフォルトでは、[KDocs](kotlin-doc)コメントは、Objective-Cヘッダーの生成時に対応するコメントに変換されません。たとえば、KDocを含む次のKotlinコード：

```kotlin
/**
 * Prints the sum of the arguments.
 * Properly handles the case when the sum doesn't fit in 32-bit integer.
 */
fun printSum(a: Int, b: Int) = println(a.toLong() + b)
```

コメントなしでObjective-C宣言が生成されます。

```objc
+ (void)printSumA:(int32_t)a b:(int32_t)b __attribute__((swift_name("printSum(a:b:)")));
```

KDocコメントのエクスポートを有効にするには、次のコンパイラーオプションを`build.gradle(.kts)`に追加します。

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
kotlin {
    targets.withType<org.jetbrains.kotlin.gradle.plugin.mpp.KotlinNativeTarget> {
        compilations.get("main").compilerOptions.options.freeCompilerArgs.add("-Xexport-kdoc")
    }
}
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
kotlin {
    targets.withType(org.jetbrains.kotlin.gradle.plugin.mpp.KotlinNativeTarget) {
        compilations.get("main").compilerOptions.options.freeCompilerArgs.add("-Xexport-kdoc")
    }
}
```

</TabItem>
</Tabs>

その後、Objective-Cヘッダーには対応するコメントが含まれます。

```objc
/**
 * Prints the sum of the arguments.
 * Properly handles the case when the sum doesn't fit in 32-bit integer.
 */
+ (void)printSumA:(int32_t)a b:(int32_t)b __attribute__((swift_name("printSum(a:b:)")));
```

たとえば、Xcodeのオートコンプリートでクラスとメソッドのコメントを表示できます。関数（`.h`ファイル）の定義に移動すると、`@param`、`@return`などのコメントが表示されます。

既知の制限事項：

KDocコメントを生成されたObjective-Cヘッダーにエクスポートする機能は[試験的](components-stability)です。
いつでも削除または変更される可能性があります。
オプトインが必要です（以下の詳細を参照）、評価目的でのみ使用してください。
[YouTrack](https://youtrack.jetbrains.com/issue/KT-38600)でフィードバックをお待ちしております。

* 依存関係のドキュメントは、`-Xexport-kdoc`自体でコンパイルされない限りエクスポートされません。この機能は試験的であるため、このオプションでコンパイルされたライブラリは、他のコンパイラーバージョンと互換性がない可能性があります。
* KDocコメントはほとんどそのままエクスポートされます。多くのKDoc機能（`@property`など）はサポートされていません。

## マッピング

次の表は、Kotlinの概念がSwift/Objective-Cにどのようにマッピングされるか、およびその逆を示しています。

"`->`"および"`<-`"は、マッピングが一方向のみであることを示します。

| Kotlin                 | Swift                            | Objective-C                      | 注                                                                                   |
|------------------------|----------------------------------|----------------------------------|------------------------------------------------------------------------------------|
| `class`                | `class`                          | `@interface`                     | [注](#classes)                                                                   |
| `interface`            | `protocol`                       | `@protocol`                      |                                                                                    |
| `constructor`/`create` | Initializer                      | Initializer                      | [注](#initializers)                                                              |
| Property               | Property                         | Property                         | [注 1](#top-level-functions-and-properties)、[注 2](#setters)                  |
| Method                 | Method                           | Method                           | [注 1](#top-level-functions-and-properties)、[注 2](#method-names-translation) |
| `enum class`           | `class`                          | `@interface`                     | [注](#enums)                                                                     |
| `suspend` `->`           | `completionHandler:`/ `async`    | `completionHandler:`             | [注 1](#errors-and-exceptions)、[注 2](#suspending-functions)                  |
| `@Throws fun`          | `throws`                         | `error:(NSError**)error`         | [注](#errors-and-exceptions)                                                     |
| Extension              | Extension                        | Category member                  | [注](#extensions-and-category-members)                                           |
| `companion` member `<-`  | Class method or property         | Class method or property         |                                                                                    |
| `null`                 | `nil`                            | `nil`                            |                                                                                    |
| `Singleton`            | `shared` or `companion` property | `shared` or `companion` property | [注](#kotlin-singletons)                                                         |
| Primitive type         | Primitive type / `NSNumber`      |                                  | [注](#nsnumber)                                                                  |
| `Unit` return type     | `Void`                           | `void`                           |                                                                                    |
| `String`               | `String`                         | `NSString`                       |                                                                                    |
| `String`               | `NSMutableString`                | `NSMutableString`                | [注](#nsmutablestring)                                                           |
| `List`                 | `Array`                          | `NSArray`                        |                                                                                    |
| `MutableList`          | `NSMutableArray`                 | `NSMutableArray`                 |                                                                                    |
| `Set`                  | `Set`                            | `NSSet`                          |                                                                                    |
| `MutableSet`           | `NSMutableSet`                   | `NSMutableSet`                   | [注](#collections)                                                               |
| `Map`                  | `Dictionary`                     | `NSDictionary`                   |                                                                                    |
| `MutableMap`           | `NSMutableDictionary`            | `NSMutableDictionary`            | [注](#collections)                                                               |
| Function type          | Function type                    | Block pointer type               | [注](#function-types)                                                            |
| Inline classes         | Unsupported                      | Unsupported                      | [注](#unsupported)                                                               |

### クラス

#### 名前の変換

Objective-Cのクラスは、元の名前でKotlinにインポートされます。
プロトコルは、`Protocol`という名前のサフィックスを持つインターフェースとしてインポートされます。たとえば、`@protocol Foo` `->` `interface FooProtocol`です。
これらのクラスとインターフェースは、[ビルド構成で指定された](#importing-swift-objective-c-libraries-to-kotlin)パッケージに配置されます
（事前構成済みのシステムフレームワークの`platform.*`パッケージ）。

Kotlinのクラスとインターフェースの名前は、Objective-Cにインポートされるときにプレフィックスが付けられます。
プレフィックスは、フレームワーク名から派生します。

Objective-Cは、フレームワーク内のパッケージをサポートしていません。Kotlinコンパイラーが同じフレームワーク内に同じ名前で異なるパッケージを持つKotlinクラスを見つけた場合、それらの名前が変更されます。このアルゴリズムはまだ安定しておらず、Kotlinのリリース間で変更される可能性があります。これを回避するには、フレームワーク内の競合するKotlinクラスの名前を変更できます。

#### 強力なリンク

KotlinソースでObjective-Cクラスを使用するたびに、それは強力にリンクされたシンボルとしてマークされます。結果として得られるビルド成果物では、関連するシンボルが強力な外部参照として言及されます。

これは、アプリが起動時にシンボルを動的にリンクしようとし、シンボルが利用できない場合、アプリがクラッシュすることを意味します。
クラッシュは、シンボルが使用されたことがない場合でも発生します。シンボルは、特定のデバイスまたはOSバージョンでは利用できない場合があります。

この問題を回避し、「シンボルが見つかりません」というエラーを回避するには、クラスが実際に利用可能かどうかを確認するSwiftまたはObjective-Cラッパーを使用します。
[この回避策がCompose Multiplatformフレームワークでどのように実装されたかをご覧ください](https://github.com/JetBrains/compose-multiplatform-core/pull/1278/files)。

### 初期化子

Swift/Objective-Cの初期化子は、コンストラクターとして、または`create`という名前のファクトリメソッドとしてKotlinにインポートされます。
後者は、Objective-CカテゴリまたはSwift拡張で宣言された初期化子で発生します。これは、Kotlinには拡張コンストラクターの概念がないためです。

Swiftの初期化子をKotlinにインポートする前に、`@objc`でそれらに注釈を付けることを忘れないでください。

Kotlinのコンストラクターは、Swift/Objective-Cに初期化子としてインポートされます。

### セッター

スーパークラスの読み取り専用プロパティをオーバーライドする書き込み可能なObjective-Cプロパティは、プロパティ`foo`の`setFoo()`メソッドとして表されます。これは、ミュータブルとして実装されているプロトコルの読み取り専用プロパティにも当てはまります。

### トップレベルの関数とプロパティ

トップレベルのKotlin関数とプロパティは、特別なクラスのメンバーとしてアクセスできます。
各Kotlinファイルは、そのようなクラスに変換されます。例：

```kotlin
// MyLibraryUtils.kt
package my.library

fun foo() {}
```

次に、次のようにSwiftから`foo()`関数を呼び出すことができます。

```swift
MyLibraryUtilsKt.foo()
```

Kotlin-Swift interopediaで、トップレベルのKotlin宣言へのアクセスに関する例のコレクションをご覧ください。

* [トップレベルの関数](https://github.com/kotlin-hands-on/kotlin-swift-interopedia/blob/main/docs/overview/Top-level%20functions)
* [トップレベルの読み取り専用プロパティ](https://github.com/kotlin-hands-on/kotlin-swift-interopedia/blob/main/docs/functionsandproperties/Top-level%20val%20properties)
* [トップレベルのミュータブルプロパティ](https://github.com/kotlin-hands-on/kotlin-swift-interopedia/blob/main/docs/functionsandproperties/Top-level%20mutable%20var%20properties)

### メソッド名の変換

一般に、Swift引数ラベルとObjective-Cセレクターの一部は、Kotlinパラメーター名にマッピングされます。これら2つの概念
はセマンティクスが異なるため、Swift/Objective-Cメソッドは、Kotlinシグネチャと衝突してインポートされる場合があります。
この場合、衝突するメソッドは、名前付き引数を使用してKotlinから呼び出すことができます。例：

```swift
[player moveTo:LEFT byMeters:17]
[player moveTo:UP byInches:42]
```

Kotlinでは、次のようになります。

```kotlin
player.moveTo(LEFT, byMeters = 17)
player.moveTo(UP, byInches = 42)
```

`kotlin.Any`関数がSwift/Objective-Cにどのようにマッピングされるかを次に示します。

| Kotlin       | Swift          | Objective-C   |
|--------------|----------------|---------------|
| `equals()`   | `isEquals(_:)` | `isEquals:`   |
| `hashCode()` | `hash`         | `hash`        |
| `toString()` | `description`  | `description` |

[Kotlin-Swift interopediaのデータクラスの例を参照してください](https://github.com/kotlin-hands-on/kotlin-swift-interopedia/blob/main/docs/classesandinterfaces/Data%20classes)。

[`@ObjCName`アノテーション](#change-declaration-names)を使用してKotlin宣言の名前を変更する代わりに、SwiftまたはObjective-Cでより慣用的な名前を指定できます。

### エラーと例外

すべてのKotlin例外は未チェックです。つまり、エラーは実行時にキャッチされます。ただし、Swiftにはコンパイル時に処理されるチェック済みのエラーのみがあります。したがって、SwiftまたはObjective-Cコードが例外をスローするKotlinメソッドを呼び出す場合、Kotlinメソッドは、`@Throws`アノテーションでマークし、「予期される」例外クラスのリストを指定する必要があります。

Objective-C/Swiftフレームワークにコンパイルする場合、`@Throws`アノテーションを持つか継承する`suspend`以外の関数は、Objective-Cでは`NSError*`-生成メソッドとして、Swiftでは`throws`メソッドとして表されます。
`suspend`関数の表現には、常に完了ハンドラーに`NSError*`/`Error`パラメーターがあります。

Swift/Objective-Cコードから呼び出されたKotlin関数が、`@Throws`で指定されたクラスまたはそのサブクラスのいずれかのインスタンスである例外をスローすると、`NSError`として伝播されます。
Swift/Objective-Cに到達する他のKotlin例外は、処理されないと見なされ、プログラムが終了します。

`@Throws`のない`suspend`関数は、`CancellationException`（`NSError`として）のみを伝播します。
`@Throws`のない`suspend`以外の関数は、Kotlin例外をまったく伝播しません。

反対の逆変換はまだ実装されていないことに注意してください。Swift/Objective-Cのエラーをスローするメソッドは、例外をスローするKotlinとしてインポートされません。

[Kotlin-Swift interopediaの例を参照してください](https://github.com/kotlin-hands-on/kotlin-swift-interopedia/blob/main/docs/overview/Exceptions)。

### 列挙型

Kotlin列挙型は、Objective-Cに`@interface`として、Swiftに`class`としてインポートされます。
これらのデータ構造には、各列挙値に対応するプロパティがあります。次のKotlinコードを検討してください。

```kotlin
// Kotlin
enum class Colors {
    RED, GREEN, BLUE
}
```

この列挙型クラスのプロパティには、次のようにSwiftからアクセスできます。

```swift
// Swift
Colors.red
Colors.green
Colors.blue
```

Swiftの`switch`ステートメントでKotlin列挙型の変数を使用するには、コンパイルエラーを防ぐためにデフォルトステートメントを指定します。

```swift
switch color {
    case .red: print("It's red")
    case .green: print("It's green")
    case .blue: print("It's blue")
    default: fatalError("No such color")
}
```

[Kotlin-Swift interopediaの別の例を参照してください](https://github.com/kotlin-hands-on/kotlin-swift-interopedia/blob/main/docs/classesandinterfaces/Enum%20classes)。

### サスペンド関数

Swiftコードから`async`として`suspend`関数を呼び出すためのサポートは[試験的](components-stability)です。
いつでも削除または変更される可能性があります。
評価目的でのみ使用してください。
[YouTrack](https://youtrack.jetbrains.com/issue/KT-47610)でフィードバックをお待ちしております。

Kotlinの[サスペンド関数](coroutines-basics)（`suspend`）は、生成されたObjective-Cヘッダーでは、コールバック付きの関数として、またはSwift/Objective-C用語では[完了ハンドラー](https://developer.apple.com/documentation/swift/calling_objective-c_apis_asynchronously)として表示されます。

Swift 5.5以降、Kotlinの`suspend`関数は、完了ハンドラーを使用せずに、`async`関数としてSwiftから呼び出すこともできます。現在、この機能は非常に試験的であり、
特定の制限があります。詳細については、[このYouTrack issue](https://youtrack.jetbrains.com/issue/KT-47610)を参照してください。

* [Swiftドキュメントの[`async`/`await`メカニズム](https://docs.swift.org/swift-book/LanguageGuide/Concurrency.html)の詳細をご覧ください。
* [Kotlin-Swift interopedia](https://github.com/kotlin-hands-on/kotlin-swift-interopedia/blob/main/docs/coroutines/Suspend%20functions)で、同じ機能を実装するサードパーティライブラリの例と推奨事項をご覧ください。

### 拡張機能とカテゴリメンバー

Objective-CカテゴリとSwift拡張のメンバーは、一般に拡張機能としてKotlinにインポートされます。それが
これらの宣言はKotlinでオーバーライドできず、拡張機能初期化子はKotlinコンストラクターとして使用できない理由です。

現在、2つの例外があります。Kotlin 1.8.20以降、NSViewクラス（AppKitフレームワークから）またはUIViewクラス（UIKitフレームワークから）と同じヘッダーで宣言されたカテゴリメンバーは、
これらのクラスのメンバーとしてインポートされます。これは、NSViewまたはUIViewからサブクラス化するメソッドをオーバーライドできることを意味します。

:::

「通常の」KotlinクラスへのKotlin拡張機能は、それぞれSwiftおよびObjective-Cに拡張機能およびカテゴリメンバーとしてインポートされます。他の型へのKotlin拡張機能は、[トップレベルの宣言](#top-level-functions-and-properties)として扱われます。
追加のレシーバーパラメーター付き。これらの型には、次のものがあります。

* Kotlin `String`型
* Kotlinコレクション型とサブタイプ
* Kotlin `interface`型
* Kotlinプリミティブ型
* Kotlin `inline`クラス
* Kotlin `Any`型
* Kotlin関数型とサブタイプ
* Objective-Cクラスとプロトコル

[Kotlin-Swift interopediaの例のコレクションをご覧ください](https://github.com/kotlin-hands-on/kotlin-swift-interopedia/tree/main/docs/extensions)。

### Kotlinシングルトン

Kotlinシングルトン（`object`宣言で作られたもの。`companion object`を含む）は、単一のインスタンスを持つクラスとしてSwift/Objective-Cにインポートされます。

インスタンスは、`shared`および`companion`プロパティを介して使用できます。

次のKotlinコードの場合：

```kotlin
object MyObject {
    val x = "Some value"
}

class MyClass {
    companion object {
        val x = "Some value"
    }
}
```

これらのオブジェクトには、次のようにアクセスします。

```swift
MyObject.shared
MyObject.shared.x
MyClass.companion
MyClass.Companion.shared
```

:::note
Objective-Cで`[MySingleton mySingleton]`を介して、Swiftで`MySingleton()`を介してオブジェクトにアクセスする方法は非推奨になりました。

:::

Kotlin-Swift interopediaで詳細な例をご覧ください。

* [`shared`を使用してKotlinオブジェクトにアクセスする方法](https://github.com/kotlin-hands-on/kotlin-swift-interopedia/blob/main/docs/classesandinterfaces/Objects)
* [SwiftからKotlinコンパニオンオブジェクトのメンバーにアクセスする方法](https://github.com/kotlin-hands-on/kotlin-swift-interopedia/blob/main/docs/classesandinterfaces/Companion%20objects)。

### NSNumber

Kotlinプリミティブ型ボックスは、特別なSwift/Objective-Cクラスにマッピングされます。たとえば、`kotlin.Int`ボックスは、Swiftでは`KotlinInt`クラスインスタンスとして（またはObjective-Cでは`${prefix}Int`インスタンスとして。ここで、`prefix`はフレームワーク名のプレフィックス）表されます。
これらのクラスは`NSNumber`から派生しているため、インスタンスは対応するすべての操作をサポートする適切な`NSNumber`です。

`NSNumber`型は、Swift/Objective-Cパラメーター型または戻り値として使用される場合、Kotlinプリミティブ型に自動的に変換されません。その理由は、`NSNumber`型は、ラップされたプリミティブ値
型に関する十分な情報を提供しないためです。たとえば、`NSNumber`は静的に`Byte`、`Boolean`、または`Double`であることがわかっていません。したがって、Kotlinプリミティブ値
は[`NSNumber`との間で手動でキャストする必要があります](#casting-between-mapped-types)。

### NSMutableString

`NSMutableString` Objective-Cクラスは、Kotlinからは使用できません。
`NSMutableString`のすべてのインスタンスは、Kotlinに渡されるときにコピーされます。

### コレクション

Kotlinコレクションは、[上記の表](#mappings)で説明されているように、Swift/Objective-Cコレクションに変換されます。
Swift/Objective-Cコレクションは、`NSMutableSet`と`NSMutableDictionary`を除き、同じ方法でKotlinにマッピングされます。

`NSMutableSet`は、Kotlin `MutableSet`に変換されません。オブジェクトをKotlin `MutableSet`に渡すには、この
種類のKotlinコレクションを明示的に作成します。これを行うには、たとえば、Kotlinの`mutableSetOf()`関数または
Swiftの`KotlinMutableSet`クラス、およびObjective-Cの`${prefix}MutableSet`（`prefix`はフレームワーク名のプレフィックス）を使用します。
`MutableMap`についても同じことが当てはまります。

[Kotlin-Swift interopediaの例を参照してください](https://github.com/kotlin-hands-on/kotlin-swift-interopedia/blob/main/docs/overview/Collections)。

### 関数型

Kotlin関数型のオブジェクト（たとえば、ラムダ）は、Swiftの関数およびObjective-Cのブロックに変換されます。
[Kotlin-Swift interopediaのラムダを持つKotlin関数の例を参照してください](https://github.com/kotlin-hands-on/kotlin-swift-interopedia/blob/main/docs/functionsandproperties/Functions%20returning%20function%20type)。

ただし、関数と
関数型を変換する場合、パラメーターと戻り値の型がどのようにマッピングされるかに違いがあります。後者の場合、プリミティブ型はボックス化された表現にマッピングされます。Kotlin `Unit`戻り値
は、Swift/Objective-Cで対応する`Unit`シングルトンとして表されます。このシングルトンの値は、他のKotlin `object`と同じ方法で取得できます。[上記の表](#mappings)のシングルトンを参照してください。

次のKotlin関数を検討してください。

```kotlin
fun foo(block: (Int) `->` Unit) { ... }
```

Swiftでは次のように表されます。

```swift
func foo(block: (KotlinInt) `->` KotlinUnit)
```

次のように呼び出すことができます。

```kotlin
foo {
    bar($0 as! Int32)
    return KotlinUnit()
}
```

### ジェネリクス

Objective-Cは、クラスで定義された「軽量ジェネリクス」をサポートしており、比較的限られた機能セットを備えています。Swiftは、クラスで定義されたジェネリクスをインポートして、コンパイラーに追加の型情報を提供することができます。

Objective-CとSwiftのジェネリック機能のサポートはKotlinとは異なるため、変換では必然的に一部の情報が失われますが、サポートされている機能は意味のある情報を保持します。

SwiftでKotlinジェネリクスを使用する方法の具体的な例については、[Kotlin-Swift interopedia](https://github.com/kotlin-hands-on/kotlin-swift-interopedia/blob/main/docs/overview/ShouldRefineInSwift)を参照してください。

#### 制限事項

Objective-Cジェネリクスは、KotlinまたはSwiftのすべての機能をサポートしているわけではないため、変換で一部の情報が失われます。

ジェネリクスは、クラスでのみ定義でき、インターフェース（Objective-CおよびSwiftのプロトコル）または関数では定義できません。

#### Null許容

KotlinとSwiftはどちらも、型仕様の一部としてNull許容を定義しますが、Objective-Cは型のメソッドとプロパティでNull許容を定義します。したがって、次のKotlinコード：

```kotlin
class Sample<T>() {
    fun myVal(): T
}
```

Swiftでは次のようになります。

```swift
class Sample<T>() {
    fun myVal(): T?
}
```

潜在的にNull許容型をサポートするには、Objective-CヘッダーでNull許容の戻り値を持つ`myVal`を定義する必要があります。

これを軽減するには、ジェネリッククラスを定義するときに、ジェネリック型が_決して_Nullにならない場合は、Null許容でない型制約を指定します。

```kotlin
class Sample<T : Any>() {
    fun myVal(): T
}
```

これにより、Objective-Cヘッダーは`myVal`をNull許容でないとして強制的にマークします。

#### 分散

Objective-Cでは、ジェネリクスを共変または反変として宣言できます。Swiftは分散をサポートしていません。Objective-Cからのジェネリッククラスは、必要に応じて強制的にキャストできます。

```kotlin
data class SomeData(val num: Int = 42) : BaseData()
class GenVarOut<out T : Any>(val arg: T)
```

```swift
let variOut = GenVarOut<SomeData>(arg: sd)
let variOutAny : GenVarOut<BaseData> = variOut as! GenVarOut<BaseData>
```

#### 制約

Kotlinでは、ジェネリック型の上限を指定できます。Objective-Cもこれをサポートしていますが、そのサポートはより複雑なケースでは利用できず、現在、Kotlin-Objective-Cインターロップではサポートされていません。ここでの例外は、Null許容でない
上限により、Objective-Cメソッド/プロパティがNull許容でなくなることです。

#### 無効にする

ジェネリクスなしでフレームワークヘッダーを記述するには、ビルドファイルに次のコンパイラーオプションを追加します。

```kotlin
binaries.framework {
    freeCompilerArgs += "-Xno-objc-generics"
}
```

### フォワード宣言

フォワード宣言をインポートするには、`objcnames.classes`および`objcnames.protocols`パッケージを使用します。たとえば、`library.package`でObjective-Cライブラリで宣言された`objcprotocolName`フォワード宣言をインポートするには、特別なフォワード宣言パッケージを使用します：`import objcnames.protocols.objcprotocolName`。

2つのobjcinteropライブラリを検討してください。1つは`objcnames.protocols.ForwardDeclaredProtocolProtocol`を使用し、もう1つは別のパッケージに実際の実装があります。

```ObjC
// First objcinterop library
#import <Foundation/Foundation.h>

@protocol ForwardDeclaredProtocol;

NSString* consumeProtocol(id<ForwardDeclaredProtocol> s) {
    return [NSString stringWithUTF8String:"Protocol"];
}
```

```ObjC
// Second objcinterop library
// Header:
#import <Foundation/Foundation.h>
@protocol ForwardDeclaredProtocol
@end
// Implementation:
@interface ForwardDeclaredProtocolImpl : NSObject <ForwardDeclaredProtocol>
@end

id<ForwardDeclaredProtocol> produceProtocol() {
    return [ForwardDeclaredProtocolImpl new];
}
```

2つのライブラリ間でオブジェクトを転送するには、Kotlinコードで明示的な`as`キャストを使用します。

```kotlin
// Kotlin code:
fun test() {
    consumeProtocol(produceProtocol() as objcnames.protocols.ForwardDeclaredProtocolProtocol)
}
```

:::note
対応する実際のクラスからのみ`objcnames.protocols.ForwardDeclaredProtocolProtocol`にキャストできます。
そうでない場合、エラーが発生します。

:::

## マッピングされた型間のキャスト

Kotlinコードを記述する場合、オブジェクトをKotlin型から同等のSwift/Objective-C型に（またはその逆に）変換する必要がある場合があります。この場合、プレーンな古いKotlinキャストを使用できます。例：

```kotlin
val nsArray = listOf(1, 2, 3) as NSArray
val string = nsString as String
val nsNumber = 42 as NSNumber
```

## サブクラス化

### Swift/Objective-CからのKotlinクラスとインターフェースのサブクラス化

Kotlinクラスとインターフェースは、Swift/Objective-Cクラスとプロトコルによってサブクラス化できます。

### KotlinからのSwift/Objective-Cクラスとプロトコルのサブクラス化

Swift/Objective-Cクラスとプロトコルは、Kotlin `final`クラスでサブクラス化できます。Swift/Objective-C型を継承する非`final` Kotlinクラスはまだサポートされていないため、Swift/Objective-C型を継承する複雑なクラス階層を宣言することはできません。

通常のメソッドは、`override` Kotlinキーワードを使用してオーバーライドできます。この場合、オーバーライドメソッドは、オーバーライドされるメソッドと同じパラメーター名を持っている必要があります。

たとえば、`UIViewController`をサブクラス化する場合など、初期化子をオーバーライドする必要がある場合があります。Kotlinコンストラクターとしてインポートされた初期化子は、`@OverrideInit`アノテーションでマークされたKotlinコンストラクターによってオーバーライドできます。

```swift
class ViewController : UIViewController {
    @OverrideInit constructor(coder: NSCoder) : super(coder)

    ...
}
```

オーバーライドコンストラクターは、オーバーライドされるコンストラクターと同じパラメーター名と型を持っている必要があります。

Kotlinシグネチャが衝突するさまざまなメソッドをオーバーライドするには、`@ObjCSignatureOverride`アノテーションをクラスに追加できます。
このアノテーションは、引数の型が同じで引数の名前が異なる複数の関数がObjective-Cクラスから継承された場合、競合するオーバーロードを無視するようにKotlinコンパイラーに指示します。

デフォルトでは、Kotlin/Nativeコンパイラーは、指定されていないObjective-C初期化子を`super()`コンストラクターとして呼び出すことを許可しません。指定された初期化子がObjective-Cで適切にマークされていない場合、この動作は不便になる可能性があります
ライブラリ。これらのコンパイラーチェックを無効にするには、ライブラリの[`.def`ファイル](native-definition-file)に`disableDesignatedInitializerChecks = true`を追加します。

## C機能

ライブラリが安全でないポインター、構造体などのプレーンなC機能をいくつか使用する例については、[Cとの相互運用性](native-c-interop)を参照してください。

## サポートされていません

Kotlinプログラミング言語の一部の機能は、Objective-CまたはSwiftのそれぞれの機能にまだマッピングされていません。
現在、次の機能は、生成されたフレームワークヘッダーで適切に公開されていません。

* インラインクラス（引数は、基になるプリミティブ型または`id`としてマッピングされます）
* 標準のKotlinコレクションインターフェース（`List`、`Map`、`Set`）およびその他の特別なクラスを実装するカスタムクラス
* Objective-CクラスのKotlinサブクラス