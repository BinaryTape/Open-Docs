[//]: # (title: Swift/Objective-C との相互運用)

> Objective-Cライブラリのインポートは[ベータ版](native-c-interop-stability.md)です。
> cinteropツールによってObjective-Cライブラリから生成されるすべてのKotlin宣言には、`@ExperimentalForeignApi`アノテーションが付与されている必要があります。
>
> Kotlin/Nativeに同梱されているネイティブプラットフォームライブラリ（Foundation、UIKit、POSIXなど）は、一部のAPIでのみオプトインが必要です。
>
{style="note"}

Kotlin/Nativeは、Objective-Cを介してSwiftとの間接的な相互運用性を提供します。このドキュメントでは、Swift/Objective-CコードでKotlin宣言を使用する方法と、KotlinコードでObjective-C宣言を使用する方法について説明します。

他に役立つ可能性のあるリソース：

*   [Kotlin-Swift interopedia](https://github.com/kotlin-hands-on/kotlin-swift-interopedia)（SwiftコードでKotlin宣言を使用する方法の例集）。
*   [Swift/Objective-C ARCとの統合](native-arc-integration.md)セクション（KotlinのトレースGCとObjective-CのARC間の統合の詳細を説明）。

## KotlinへのSwift/Objective-Cライブラリのインポート

Objective-Cのフレームワークとライブラリは、ビルドに適切にインポートされていれば（システムフレームワークはデフォルトでインポートされます）、Kotlinコードで使用できます。
詳細については、以下を参照してください：

*   [ライブラリ定義ファイルの作成と設定](native-definition-file.md)
*   [ネイティブライブラリのコンパイル設定](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-configure-compilations.html#configure-interop-with-native-languages)

Swiftライブラリは、そのAPIが`@objc`でObjective-Cにエクスポートされていれば、Kotlinコードで使用できます。
純粋なSwiftモジュールはまだサポートされていません。

## Swift/Objective-CでのKotlinの使用

Kotlinモジュールは、フレームワークにコンパイルされていれば、Swift/Objective-Cコードで使用できます。

*   バイナリの宣言方法については、[最終的なネイティブバイナリのビルド](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-build-native-binaries.html#declare-binaries)を参照してください。
*   例については、[Kotlin Multiplatformサンプルプロジェクト](https://github.com/Kotlin/kmm-basic-sample)を確認してください。

### Objective-CとSwiftからKotlin宣言を隠す

> `@HiddenFromObjC`アノテーションは[実験的](components-stability.md#stability-levels-explained)であり、[オプトイン](opt-in-requirements.md)が必要です。
>
{style="warning"}

KotlinコードをSwift/Objective-Cによりフレンドリーにするには、`@HiddenFromObjC`アノテーションを使用してKotlin宣言をObjective-CおよびSwiftから隠します。これは、関数またはプロパティのObjective-Cへのエクスポートを無効にします。

あるいは、Kotlin宣言に`internal`修飾子を付けて、コンパイルモジュール内での可視性を制限することもできます。他のKotlinモジュールからは見えるようにしつつ、Objective-CとSwiftからKotlin宣言を隠したい場合は、`@HiddenFromObjC`を使用します。

[Kotlin-Swift interopediaで例を見る](https://github.com/kotlin-hands-on/kotlin-swift-interopedia/blob/main/docs/overview/HiddenFromObjC.md)。

### Swiftでのリファインの使用

> `@ShouldRefineInSwift`アノテーションは[実験的](components-stability.md#stability-levels-explained)であり、[オプトイン](opt-in-requirements.md)が必要です。
>
{style="warning"}

`@ShouldRefineInSwift`は、Kotlin宣言をSwiftで書かれたラッパーに置き換えるのに役立ちます。このアノテーションは、生成されるObjective-C APIで関数またはプロパティを`swift_private`としてマークします。このような宣言には`__`プレフィックスが付き、Swiftからは見えなくなります。

SwiftフレンドリーなAPIを作成するために、Swiftコードでこれらの宣言を使用することはできますが、Xcodeのオートコンプリートでは提案されません。

*   SwiftでのObjective-C宣言のリファインの詳細については、[Apple公式ドキュメント](https://developer.apple.com/documentation/swift/improving-objective-c-api-declarations-for-swift)を参照してください。
*   `@ShouldRefineInSwift`アノテーションの使用例については、[Kotlin-Swift interopedia](https://github.com/kotlin-hands-on/kotlin-swift-interopedia/blob/main/docs/overview/ShouldRefineInSwift.md)を参照してください。

### 宣言名の変更

> `@ObjCName`アノテーションは[実験的](components-stability.md#stability-levels-explained)であり、[オプトイン](opt-in-requirements.md)が必要です。
>
{style="warning"}

Kotlin宣言の名前変更を避けるには、`@ObjCName`アノテーションを使用します。これは、Kotlinコンパイラに、アノテーションが付けられたクラス、インターフェース、または他のKotlinエンティティに対して、カスタムのObjective-CおよびSwift名を使用するように指示します。

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

[Kotlin-Swift interopediaで別の例を見る](https://github.com/kotlin-hands-on/kotlin-swift-interopedia/blob/main/docs/overview/ObjCName.md)。

### KDocコメントによるドキュメントの提供

ドキュメントは、あらゆるAPIを理解するために不可欠です。共有Kotlin APIのドキュメントを提供することで、そのユーザーと使用法、注意点などについてやり取りできます。

デフォルトでは、Objective-Cヘッダーを生成する際、[KDoc](kotlin-doc.md)コメントは対応するコメントに変換されません。例えば、KDocを含む以下のKotlinコード：

```kotlin
/**
 * Prints the sum of the arguments.
 * Properly handles the case when the sum doesn't fit in 32-bit integer.
 */
fun printSum(a: Int, b: Int) = println(a.toLong() + b)
```

コメントなしのObjective-C宣言が生成されます：

```objc
+ (void)printSumA:(int32_t)a b:(int32_t)b __attribute__((swift_name("printSum(a:b:)")));
```

KDocコメントのエクスポートを有効にするには、`build.gradle(.kts)`に以下のコンパイラオプションを追加します。

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
kotlin {
    targets.withType<org.jetbrains.kotlin.gradle.plugin.mpp.KotlinNativeTarget> {
        compilations.get("main").compilerOptions.options.freeCompilerArgs.add("-Xexport-kdoc")
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
kotlin {
    targets.withType(org.jetbrains.kotlin.gradle.plugin.mpp.KotlinNativeTarget) {
        compilations.get("main").compilerOptions.options.freeCompilerArgs.add("-Xexport-kdoc")
    }
}
```

</tab>
</tabs>

その後、Objective-Cヘッダーには対応するコメントが含まれます。

```objc
/**
 * Prints the sum of the arguments.
 * Properly handles the case when the sum doesn't fit in 32-bit integer.
 */
+ (void)printSumA:(int32_t)a b:(int32_t)b __attribute__((swift_name("printSum(a:b:)")));
```

例えばXcodeで、オートコンプリート時にクラスやメソッドのコメントを見ることができるようになります。関数の定義（`.h`ファイル内）に移動すると、`@param`、`@return`などのコメントが表示されます。

既知の制限事項：

> 生成されたObjective-CヘッダーにKDocコメントをエクスポートする機能は[実験的](components-stability.md)です。
> いつでも廃止または変更される可能性があります。
> オプトインが必要であり（詳細は下記参照）、評価目的でのみ使用してください。[YouTrack](https://youtrack.jetbrains.com/issue/KT-38600)でのフィードバックをお待ちしております。
>
{style="warning"}

*   依存関係のドキュメントは、それ自体が`-Xexport-kdoc`でコンパイルされていない限りエクスポートされません。この機能は実験的であるため、このオプションでコンパイルされたライブラリは他のコンパイラバージョンと互換性がない可能性があります。
*   KDocコメントはほとんどそのままエクスポートされます。`@property`など、多くのKDoc機能はサポートされていません。

## マッピング

下の表は、Kotlinの概念がSwift/Objective-Cに、またその逆方向にもどのようにマッピングされるかを示しています。

`->`と`<-`は、マッピングが一方向のみであることを示します。

| Kotlin                 | Swift                            | Objective-C                      | Notes                                                                              |
|------------------------|----------------------------------|----------------------------------|------------------------------------------------------------------------------------|
| `class`                | `class`                          | `@interface`                     | [注](#classes)                                                                   |
| `interface`            | `protocol`                       | `@protocol`                      |                                                                                    |
| `constructor`/`create` | Initializer                      | Initializer                      | [注](#initializers)                                                              |
| プロパティ               | Property                         | Property                         | [注 1](#top-level-functions-and-properties), [注 2](#setters)                  |
| メソッド                 | Method                           | Method                           | [注 1](#top-level-functions-and-properties), [注 2](#method-names-translation) |
| `enum class`           | `class`                          | `@interface`                     | [注](#enums)                                                                     |
| `suspend` ->           | `completionHandler:`/ `async`    | `completionHandler:`             | [注 1](#errors-and-exceptions), [注 2](#suspending-functions)                  |
| `@Throws fun`          | `throws`                         | `error:(NSError**)error`         | [注](#errors-and-exceptions)                                                     |
| 拡張              | Extension                        | Category member                  | [注](#extensions-and-category-members)                                           |
| `companion`メンバー <-  | Class method or property         | Class method or property         |                                                                                    |
| `null`                 | `nil`                            | `nil`                            |                                                                                    |
| シングルトン            | `shared` or `companion` property | `shared` or `companion` property | [注](#kotlin-singletons)                                                         |
| プリミティブ型         | Primitive type / `NSNumber`      |                                  | [注](#primitive-types)                                                           |
| `Unit`戻り値の型     | `Void`                           | `void`                           |                                                                                    |
| `String`               | `String`                         | `NSString`                       | [注](#strings)                                                                   |
| `String`               | `NSMutableString`                | `NSMutableString`                | [注](#nsmutablestring)                                                           |
| `List`                 | `Array`                          | `NSArray`                        |                                                                                    |
| `MutableList`          | `NSMutableArray`                 | `NSMutableArray`                 |                                                                                    |
| `Set`                  | `Set`                            | `NSSet`                          |                                                                                    |
| `MutableSet`           | `NSMutableSet`                   | `NSMutableSet`                   | [注](#collections)                                                               |
| `Map`                  | `Dictionary`                     | `NSDictionary`                   |                                                                                    |
| `MutableMap`           | `NSMutableDictionary`            | `NSMutableDictionary`            | [注](#collections)                                                               |
| 関数型          | Function type                    | Block pointer type               | [注](#function-types)                                                            |
| インラインクラス         | Unsupported                      | Unsupported                      | [注](#unsupported)                                                               |

### クラス

#### 名前変換

Objective-Cのクラスは、元の名前でKotlinにインポートされます。
プロトコルは、`Protocol`という名前のサフィックスを持つインターフェースとしてインポートされます。例えば、`@protocol Foo` -> `interface FooProtocol`。
これらのクラスとインターフェースは、[ビルド設定で指定された](#importing-swift-objective-c-libraries-to-kotlin)パッケージ（事前設定されたシステムフレームワークの場合は`platform.*`パッケージ）に配置されます。

Kotlinのクラスとインターフェースの名前は、Objective-Cにインポートされる際にプレフィックスが付けられます。
プレフィックスはフレームワーク名から派生します。

Objective-Cはフレームワーク内のパッケージをサポートしていません。Kotlinコンパイラが同じフレームワーク内で同じ名前だが異なるパッケージを持つKotlinクラスを見つけた場合、それらの名前を変更します。このアルゴリズムはまだ安定しておらず、Kotlinのリリース間で変更される可能性があります。これを回避するには、フレームワーク内の競合するKotlinクラスの名前を変更できます。

#### 強リンク

KotlinソースでObjective-Cクラスを使用すると、それは強リンクされたシンボルとしてマークされます。結果として生成されるビルド成果物には、関連するシンボルが強力な外部参照として記載されます。

これは、アプリが起動時にシンボルを動的にリンクしようとし、それらが利用できない場合はアプリがクラッシュすることを意味します。シンボルが一度も使用されなかったとしても、クラッシュは発生します。シンボルが特定のデバイスやOSバージョンで利用できない場合があります。

この問題を回避し、「シンボルが見つかりません」エラーを避けるには、クラスが実際に利用可能であるかをチェックするSwiftまたはObjective-Cのラッパーを使用してください。[Compose Multiplatformフレームワークでこの回避策がどのように実装されたか](https://github.com/JetBrains/compose-multiplatform-core/pull/1278/files)を参照してください。

### イニシャライザ

Swift/Objective-Cのイニシャライザは、Kotlinにはコンストラクタまたは`create`という名前のファクトリメソッドとしてインポートされます。
後者は、Objective-CカテゴリまたはSwift拡張で宣言されたイニシャライザで発生します。これはKotlinに拡張コンストラクタの概念がないためです。

> SwiftのイニシャライザをKotlinにインポートする前に、`@objc`でアノテーションを付けることを忘れないでください。
>
{style="tip"}

Kotlinのコンストラクタは、Swift/Objective-Cにはイニシャライザとしてインポートされます。

### セッター

スーパークラスの読み取り専用プロパティをオーバーライドする書き込み可能なObjective-Cプロパティは、プロパティ`foo`の`setFoo()`メソッドとして表現されます。可変として実装されたプロトコルの読み取り専用プロパティも同様です。

### トップレベル関数とプロパティ

トップレベルのKotlin関数とプロパティは、特殊なクラスのメンバーとしてアクセスできます。
各Kotlinファイルは、例えば以下のように、そのようなクラスに変換されます。

```kotlin
// MyLibraryUtils.kt
package my.library

fun foo() {}
```

その後、Swiftから`foo()`関数を次のように呼び出すことができます。

```swift
MyLibraryUtilsKt.foo()
```

Kotlin-Swift interopediaでトップレベルのKotlin宣言にアクセスする例集を参照してください：

*   [トップレベル関数](https://github.com/kotlin-hands-on/kotlin-swift-interopedia/blob/main/docs/overview/Top-level%20functions.md)
*   [トップレベルの読み取り専用プロパティ](https://github.com/kotlin-hands-on/kotlin-swift-interopedia/blob/main/docs/functionsandproperties/Top-level%20val%20properties.md)
*   [トップレベルの可変プロパティ](https://github.com/kotlin-hands-on/kotlin-swift-interopedia/blob/main/docs/functionsandproperties/Top-level%20mutable%20var%20properties.md)

### メソッド名の変換

通常、Swiftの引数ラベルとObjective-Cのセレクタ要素は、Kotlinのパラメータ名にマッピングされます。これら2つの概念は異なるセマンティクスを持つため、Swift/Objective-Cのメソッドが、競合するKotlinシグネチャでインポートされることがあります。この場合、競合するメソッドは、例えば以下のように名前付き引数を使用してKotlinから呼び出すことができます。

```swift
[player moveTo:LEFT byMeters:17]
[player moveTo:UP byInches:42]
```

Kotlinでは、次のようになります。

```kotlin
player.moveTo(LEFT, byMeters = 17)
player.moveTo(UP, byInches = 42)
```

`kotlin.Any`の関数はSwift/Objective-Cに次のようにマッピングされます。

| Kotlin       | Swift          | Objective-C   |
|--------------|----------------|---------------|
| `equals()`   | `isEquals(_:)` | `isEquals:`   |
| `hashCode()` | `hash`         | `hash`        |
| `toString()` | `description`  | `description` |

[Kotlin-Swift interopediaのデータクラスの例を見る](https://github.com/kotlin-hands-on/kotlin-swift-interopedia/blob/main/docs/classesandinterfaces/Data%20classes.md)。

[`@ObjCName`アノテーション](#change-declaration-names)でKotlin宣言の名前を変更する代わりに、SwiftまたはObjective-Cでより慣用的な名前を指定できます。

### エラーと例外

すべてのKotlin例外は非チェック例外であり、エラーは実行時に捕捉されます。しかし、Swiftにはコンパイル時に処理されるチェック済みエラーしかありません。したがって、SwiftまたはObjective-Cコードが例外をスローするKotlinメソッドを呼び出す場合、そのKotlinメソッドには、"予期される"例外クラスのリストを指定する`@Throws`アノテーションを付ける必要があります。

Swift/Objective-Cフレームワークにコンパイルする際、`@Throws`アノテーションを持つか継承する非`suspend`関数は、Objective-Cでは`NSError*`を生成するメソッドとして、Swiftでは`throws`メソッドとして表現されます。`suspend`関数の表現は、常に完了ハンドラ内に`NSError*`/`Error`パラメータを持ちます。

Swift/Objective-Cコードから呼び出されたKotlin関数が、`@Throws`で指定されたクラスまたはそのサブクラスのいずれかのインスタンスである例外をスローした場合、その例外は`NSError`として伝播されます。Swift/Objective-Cに到達する他のKotlin例外は未処理と見なされ、プログラムの終了を引き起こします。

`@Throws`なしの`suspend`関数は、`CancellationException`のみを伝播します（`NSError`として）。`@Throws`なしの非`suspend`関数は、Kotlin例外をまったく伝播しません。

逆方向の変換はまだ実装されていません。Swift/Objective-Cのエラーをスローするメソッドは、Kotlinに例外をスローするメソッドとしてインポートされません。

[Kotlin-Swift interopediaで例を見る](https://github.com/kotlin-hands-on/kotlin-swift-interopedia/blob/main/docs/overview/Exceptions.md)。

### Enum

KotlinのenumはObjective-Cに`@interface`として、Swiftに`class`としてインポートされます。
これらのデータ構造には、各enum値に対応するプロパティがあります。このKotlinコードを考えてみましょう：

```kotlin
// Kotlin
enum class Colors {
    RED, GREEN, BLUE
}
```

このenumクラスのプロパティには、Swiftから次のようにアクセスできます。

```swift
// Swift
Colors.red
Colors.green
Colors.blue
```

Kotlin enumの変数をSwiftの`switch`文で使用するには、コンパイルエラーを防ぐために`default`文を提供します。

```swift
switch color {
    case .red: print("It's red")
    case .green: print("It's green")
    case .blue: print("It's blue")
    default: fatalError("No such color")
}
```

[Kotlin-Swift interopediaで別の例を見る](https://github.com/kotlin-hands-on/kotlin-swift-interopedia/blob/main/docs/classesandinterfaces/Enum%20classes.md)。

### suspend 関数

> Swiftコードから`suspend`関数を`async`として呼び出すサポートは[実験的](components-stability.md)です。
> いつでも廃止または変更される可能性があります。
> 評価目的でのみ使用してください。[YouTrack](https://youtrack.jetbrains.com/issue/KT-47610)でのフィードバックをお待ちしております。
>
{style="warning"}

Kotlinの[サスペンド関数](coroutines-basics.md)（`suspend`）は、生成されるObjective-Cヘッダーではコールバック付き関数として、Swift/Objective-Cの用語では[完了ハンドラ](https://developer.apple.com/documentation/swift/calling_objective-c_apis_asynchronously)として表現されます。

Swift 5.5以降、Kotlinの`suspend`関数は、完了ハンドラを使用せずに`async`関数としてSwiftから呼び出すことも可能です。現在、この機能は非常に実験的であり、特定の制限があります。詳細については、[このYouTrackの課題](https://youtrack.jetbrains.com/issue/KT-47610)を参照してください。

*   Swiftドキュメントの[`async`/`await`メカニズム](https://docs.swift.org/swift-book/LanguageGuide/Concurrency.html)についてさらに学ぶ。
*   [Kotlin-Swift interopedia](https://github.com/kotlin-hands-on/kotlin-swift-interopedia/blob/main/docs/coroutines/Suspend%20functions.md)で、同じ機能を実装するサードパーティライブラリの例と推奨事項を参照する。

### 拡張とカテゴリメンバー

Objective-CカテゴリおよびSwift拡張のメンバーは、一般的にKotlinに拡張としてインポートされます。そのため、これらの宣言はKotlinでオーバーライドできず、拡張イニシャライザはKotlinコンストラクタとしては利用できません。

> 現在、2つの例外があります。Kotlin 1.8.20以降、NSViewクラス（AppKitフレームワークから）またはUIViewクラス（UIKitフレームワークから）と同じヘッダーで宣言されているカテゴリメンバーは、これらのクラスのメンバーとしてインポートされます。これは、NSViewまたはUIViewをサブクラス化するメソッドをオーバーライドできることを意味します。
>
{style="note"}

「通常の」KotlinクラスへのKotlin拡張は、それぞれSwiftおよびObjective-Cに拡張およびカテゴリメンバーとしてインポートされます。他の型へのKotlin拡張は、追加のレシーバーパラメータを持つ[トップレベル宣言](#top-level-functions-and-properties)として扱われます。これらの型には以下が含まれます：

*   Kotlinの`String`型
*   Kotlinのコレクション型とそのサブタイプ
*   Kotlinの`interface`型
*   Kotlinのプリミティブ型
*   Kotlinの`inline`クラス
*   Kotlinの`Any`型
*   Kotlinの関数型とそのサブタイプ
*   Objective-Cのクラスとプロトコル

[Kotlin-Swift interopediaで例集を見る](https://github.com/kotlin-hands-on/kotlin-swift-interopedia/tree/main/docs/extensions)。

### Kotlinシングルトン

Kotlinのシングルトン（`object`宣言、`companion object`を含む）は、Swift/Objective-Cに単一インスタンスを持つクラスとしてインポートされます。

インスタンスは`shared`および`companion`プロパティを通じて利用できます。

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

これらのオブジェクトには次のようにアクセスします：

```swift
MyObject.shared
MyObject.shared.x
MyClass.companion
MyClass.Companion.shared
```

> Objective-Cでの`[MySingleton mySingleton]`およびSwiftでの`MySingleton()`によるオブジェクトへのアクセスは非推奨になりました。
>
{style="note"}

Kotlin-Swift interopediaでさらに多くの例を見る：

*   [`shared`を使用してKotlinオブジェクトにアクセスする方法](https://github.com/kotlin-hands-on/kotlin-swift-interopedia/blob/main/docs/classesandinterfaces/Objects.md)
*   [SwiftからKotlinコンパニオンオブジェクトのメンバーにアクセスする方法](https://github.com/kotlin-hands-on/kotlin-swift-interopedia/blob/main/docs/classesandinterfaces/Companion%20objects.md)。

### プリミティブ型

Kotlinのプリミティブ型ボックスは、特殊なSwift/Objective-Cクラスにマッピングされます。例えば、`kotlin.Int`ボックスは、Swiftでは`KotlinInt`クラスのインスタンスとして（またはObjective-Cでは`${prefix}Int`インスタンスとして、ここで`prefix`はフレームワークの名前プレフィックスです）表現されます。これらのクラスは`NSNumber`から派生しているため、インスタンスは対応するすべての操作をサポートする適切な`NSNumber`です。

`NSNumber`型は、Swift/Objective-Cのパラメータ型または戻り値として使用された場合、Kotlinプリミティブ型に自動的に変換されません。その理由は、`NSNumber`型がラップされたプリミティブ値の型に関する十分な情報を提供しないためです。例えば、`NSNumber`が`Byte`、`Boolean`、または`Double`であることは静的に分かりません。したがって、Kotlinのプリミティブ値は、手動で`NSNumber`との間で[キャスト](#casting-between-mapped-types)する必要があります。

### 文字列

Kotlinの`String`がSwiftに渡される際、まずObjective-Cオブジェクトとしてエクスポートされ、その後SwiftコンパイラがSwiftへの変換のためにもう一度コピーします。これにより、追加のランタイムオーバーヘッドが発生します。

それを避けるには、SwiftでKotlin文字列にObjective-Cの`NSString`として直接アクセスします。[変換例を見る](#see-the-conversion-example)。

#### NSMutableString

`NSMutableString` Objective-CクラスはKotlinからは利用できません。
`NSMutableString`のすべてのインスタンスは、Kotlinに渡される際にコピーされます。

### コレクション

#### Kotlin -> Objective-C -> Swift

KotlinコレクションがSwiftに渡される際、まずObjective-Cの同等物に変換され、その後Swiftコンパイラがコレクション全体をコピーし、[マッピング表](#mappings)に記載されているようにSwiftネイティブのコレクションに変換します。

この最後の変換はパフォーマンスコストにつながります。これを防ぐには、SwiftでKotlinコレクションを使用する際に、明示的にObjective-Cの対応する型（`NSDictionary`、`NSArray`、`NSSet`）にキャストします。

##### 変換例を見る {initial-collapse-state="collapsed" collapsible="true"}

例えば、以下のKotlin宣言：

```kotlin
val map: Map<String, String>
```

Swiftでは、次のようになるかもしれません：

```Swift
map[key]?.count ?? 0
```

ここで、`map`は暗黙的にSwiftの`Dictionary`に変換され、その文字列値はSwiftの`String`にマッピングされます。これによりパフォーマンスコストが発生します。

変換を避けるには、`map`を明示的にObjective-Cの`NSDictionary`にキャストし、代わりに値を`NSString`としてアクセスします。

```Swift
let nsMap: NSDictionary = map as NSDictionary
(nsMap[key] as? NSString)?.length ?? 0
```

これにより、Swiftコンパイラが追加の変換ステップを実行しないことが保証されます。

#### Swift -> Objective-C -> Kotlin

Swift/Objective-Cコレクションは、`NSMutableSet`および`NSMutableDictionary`を除き、[マッピング表](#mappings)に記載されているとおりにKotlinにマッピングされます。

`NSMutableSet`はKotlinの`MutableSet`には変換されません。オブジェクトをKotlinの`MutableSet`に渡すには、この種のKotlinコレクションを明示的に作成します。これを行うには、例えばKotlinの`mutableSetOf()`関数、またはSwiftの`KotlinMutableSet`クラスとObjective-Cの`${prefix}MutableSet`（`prefix`はフレームワーク名のプレフィックス）を使用します。`MutableMap`についても同様です。

[Kotlin-Swift interopediaで例を見る](https://github.com/kotlin-hands-on/kotlin-swift-interopedia/blob/main/docs/overview/Collections.md)。

### 関数型

Kotlinの関数型オブジェクト（例：ラムダ）は、Swiftでは関数に、Objective-Cではブロックに変換されます。[Kotlin-Swift interopediaのラムダを持つKotlin関数の例を見る](https://github.com/kotlin-hands-on/kotlin-swift-interopedia/blob/main/docs/functionsandproperties/Functions%20returning%20function%20type.md)。

しかし、関数と関数型を変換する際、パラメータと戻り値の型のマッピング方法には違いがあります。後者の場合、プリミティブ型はボックス化された表現にマッピングされます。Kotlinの`Unit`戻り値は、Swift/Objective-Cでは対応する`Unit`シングルトンとして表現されます。このシングルトンの値は、他のKotlinの`object`と同じ方法で取得できます。シングルトンは[上記の表](#mappings)を参照してください。

以下のKotlin関数を考えてみましょう：

```kotlin
fun foo(block: (Int) -> Unit) { ... }
```

Swiftでは次のように表現されます：

```swift
func foo(block: (KotlinInt) -> KotlinUnit)
```

そして、次のように呼び出すことができます：

```kotlin
foo {
    bar($0 as! Int32)
    return KotlinUnit()
}
```

### ジェネリクス

Objective-Cは、比較的限られた機能セットを持つ、クラスで定義された「軽量ジェネリクス」をサポートしています。Swiftは、クラスで定義されたジェネリクスをインポートして、コンパイラに追加の型情報を提供するのに役立ちます。

Objective-CとSwiftのジェネリクス機能のサポートはKotlinとは異なるため、変換では必然的に一部の情報が失われますが、サポートされる機能は意味のある情報を保持します。

SwiftでKotlinジェネリクスを使用する方法の具体的な例については、[Kotlin-Swift interopedia](https://github.com/kotlin-hands-on/kotlin-swift-interopedia/blob/main/docs/overview/ShouldRefineInSwift.md)を参照してください。

#### 制限事項

Objective-Cのジェネリクスは、KotlinまたはSwiftのすべての機能をサポートしているわけではないため、変換時に一部の情報が失われます。

ジェネリクスはクラスのみに定義でき、インターフェース（Objective-CおよびSwiftのプロトコル）や関数には定義できません。

#### Null許容性

KotlinとSwiftはどちらも型指定の一部としてnull許容性を定義しますが、Objective-Cは型のメソッドとプロパティに対してnull許容性を定義します。したがって、以下のKotlinコード：

```kotlin
class Sample<T>() {
    fun myVal(): T
}
```

Swiftでは次のようになります：

```swift
class Sample<T>() {
    fun myVal(): T?
}
```

null許容の可能性がある型をサポートするには、Objective-Cヘッダーで`myVal`をnull許容の戻り値を持つものとして定義する必要があります。

これを軽減するには、ジェネリッククラスを定義する際、ジェネリック型が_決して_nullであってはならない場合に、非null許容の型制約を提供します。

```kotlin
class Sample<T : Any>() {
    fun myVal(): T
}
```

これにより、Objective-Cヘッダーは`myVal`を非null許容としてマークするよう強制されます。

#### 共変性・反変性

Objective-Cでは、ジェネリクスを共変または反変として宣言できます。Swiftには分散性のサポートがありません。Objective-Cから来るジェネリッククラスは、必要に応じて強制キャストできます。

```kotlin
data class SomeData(val num: Int = 42) : BaseData()
class GenVarOut<out T : Any>(val arg: T)
```

```swift
let variOut = GenVarOut<SomeData>(arg: sd)
let variOutAny : GenVarOut<BaseData> = variOut as! GenVarOut<BaseData>
```

#### 制約

Kotlinでは、ジェネリック型に上限（upper bounds）を指定できます。Objective-Cもこれをサポートしていますが、より複雑なケースではそのサポートは利用できず、現在のKotlin-Objective-C相互運用ではサポートされていません。ここでの例外は、非null許容の上限がある場合、Objective-Cのメソッド/プロパティが非null許容になることです。

#### 無効にするには

フレームワークヘッダーをジェネリクスなしで生成するには、ビルドファイルに以下のコンパイラオプションを追加します。

```kotlin
binaries.framework {
    freeCompilerArgs += "-Xno-objc-generics"
}
```

### 前方宣言

前方宣言をインポートするには、`objcnames.classes`および`objcnames.protocols`パッケージを使用します。例えば、`library.package`を持つObjective-Cライブラリで宣言された`objcprotocolName`前方宣言をインポートするには、特別な前方宣言パッケージ`import objcnames.protocols.objcprotocolName`を使用します。

2つのobjcinteropライブラリを考えてみましょう。1つは`objcnames.protocols.ForwardDeclaredProtocolProtocol`を使用し、もう1つは別のパッケージに実際の__実装を持つものです。

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

> 対応する実クラスからのみ、`objcnames.protocols.ForwardDeclaredProtocolProtocol`にキャストできます。
> そうでなければ、エラーが発生します。
>
{style="note"}

## マッピングされた型間のキャスト

Kotlinコードを記述する際、オブジェクトをKotlin型から同等のSwift/Objective-C型に（またはその逆に）変換する必要がある場合があります。この場合、例えば以下のように通常のKotlinキャストを使用できます。

```kotlin
val nsArray = listOf(1, 2, 3) as NSArray
val string = nsString as String
val nsNumber = 42 as NSNumber
```

## サブクラス化

### Swift/Objective-CからのKotlinクラスおよびインターフェースのサブクラス化

Kotlinのクラスとインターフェースは、Swift/Objective-Cのクラスとプロトコルによってサブクラス化できます。

### KotlinからのSwift/Objective-Cクラスおよびプロトコルのサブクラス化

Swift/Objective-Cのクラスとプロトコルは、Kotlinの`final`クラスでサブクラス化できます。`final`でないKotlinクラスがSwift/Objective-C型を継承することはまだサポートされていないため、Swift/Objective-C型を継承する複雑なクラス階層を宣言することはできません。

通常のメソッドは、Kotlinの`override`キーワードを使用してオーバーライドできます。この場合、オーバーライドするメソッドは、オーバーライドされるメソッドと同じパラメータ名を持つ必要があります。

時にはイニシャライザをオーバーライドする必要がある場合があります。例えば、`UIViewController`をサブクラス化する際などです。Kotlinコンストラクタとしてインポートされたイニシャライザは、`@OverrideInit`アノテーションが付けられたKotlinコンストラクタによってオーバーライドできます。

```swift
class ViewController : UIViewController {
    @OverrideInit constructor(coder: NSCoder) : super(coder)

    ...
}
```

オーバーライドするコンストラクタは、オーバーライドされるコンストラクタと同じパラメータ名と型を持つ必要があります。

競合するKotlinシグネチャを持つ異なるメソッドをオーバーライドするには、クラスに`@ObjCSignatureOverride`アノテーションを追加できます。このアノテーションは、Objective-Cクラスから同じ引数型だが異なる引数名を持つ複数の関数が継承される場合に、Kotlinコンパイラに競合するオーバーロードを無視するように指示します。

デフォルトでは、Kotlin/Nativeコンパイラは、非指定Objective-Cイニシャライザを`super()`コンストラクタとして呼び出すことを許可しません。指定イニシャライザがObjective-Cライブラリで適切にマークされていない場合、この動作は不便なことがあります。これらのコンパイラチェックを無効にするには、ライブラリの[`.def`ファイル](native-definition-file.md)に`disableDesignatedInitializerChecks = true`を追加します。

## C機能

ライブラリがunsafeポインタや構造体などのプレーンなC機能を使用する場合の例については、[Cとの相互運用](native-c-interop.md)を参照してください。

## 未サポート

Kotlinプログラミング言語の一部の機能は、Objective-CまたはSwiftのそれぞれの機能にまだマッピングされていません。現在、生成されるフレームワークヘッダーで適切に公開されていない機能は次のとおりです。

*   インラインクラス（引数は基になるプリミティブ型または`id`としてマッピングされます）
*   標準的なKotlinコレクションインターフェース（`List`、`Map`、`Set`）やその他の特殊クラスを実装するカスタムクラス
*   Objective-CクラスのKotlinサブクラス