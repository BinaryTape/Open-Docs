[//]: # (title: Swift/Objective-C との相互運用)

> Objective-Cライブラリのインポートは[実験的](components-stability.md#stability-levels-explained)です。
> `cinterop` ツールによってObjective-Cライブラリから生成されるすべてのKotlin宣言には、`@ExperimentalForeignApi` アノテーションを付加する必要があります。
>
> Kotlin/Nativeに同梱されているネイティブプラットフォームライブラリ（Foundation、UIKit、POSIXなど）は、一部のAPIでのみオプトインが必要です。
>
{style="warning"}

Kotlin/Nativeは、Objective-Cを介してSwiftとの間接的な相互運用を提供します。このドキュメントでは、Kotlin宣言をSwift/Objective-Cコードで使用する方法と、Objective-C宣言をKotlinコードで使用する方法について説明します。

その他に役立つリソースは以下のとおりです。

*   [Kotlin-Swift interopedia](https://github.com/kotlin-hands-on/kotlin-swift-interopedia) は、Kotlin宣言をSwiftコードで使用する方法の例を集めたものです。
*   [Integration with Swift/Objective-C ARC](native-arc-integration.md) セクションでは、KotlinのトレーシングGCとObjective-CのARC間の統合の詳細について説明しています。

## Swift/Objective-CライブラリのKotlinへのインポート

Objective-Cフレームワークおよびライブラリは、ビルドに適切にインポートされていれば（システムフレームワークはデフォルトでインポートされます）、Kotlinコードで使用できます。
詳細については、以下を参照してください。

*   [ライブラリ定義ファイルの作成と設定](native-definition-file.md)
*   [ネイティブライブラリのコンパイル設定](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-configure-compilations.html#configure-interop-with-native-languages)

Swiftライブラリは、そのAPIが`@objc`でObjective-Cにエクスポートされていれば、Kotlinコードで使用できます。
純粋なSwiftモジュールはまだサポートされていません。

## Swift/Objective-CでのKotlinの使用

Kotlinモジュールは、フレームワークにコンパイルされていれば、Swift/Objective-Cコードで使用できます。

*   バイナリの宣言方法については、[最終ネイティブバイナリのビルド](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-build-native-binaries.html#declare-binaries)を参照してください。
*   例については、[Kotlin Multiplatformサンプルプロジェクト](https://github.com/Kotlin/kmm-basic-sample)を確認してください。

### Kotlin宣言をObjective-CおよびSwiftから非表示にする

> `@HiddenFromObjC` アノテーションは[実験的](components-stability.md#stability-levels-explained)であり、[オプトイン](opt-in-requirements.md)が必要です。
>
{style="warning"}

KotlinコードをよりSwift/Objective-Cフレンドリーにするには、`@HiddenFromObjC` アノテーションを使用してKotlin宣言をObjective-CおよびSwiftから非表示にします。これにより、関数またはプロパティのObjective-Cへのエクスポートが無効になります。

あるいは、`internal` 修飾子でKotlin宣言をマークして、コンパイルモジュールでの可視性を制限することもできます。他のKotlinモジュールに対して可視性を保ちつつ、Objective-CおよびSwiftからKotlin宣言を非表示にしたい場合は、`@HiddenFromObjC` を使用してください。

[Kotlin-Swift interopediaの例を参照してください](https://github.com/kotlin-hands-on/kotlin-swift-interopedia/blob/main/docs/overview/HiddenFromObjC.md)。

### Swiftでの洗練の使用

> `@ShouldRefineInSwift` アノテーションは[実験的](components-stability.md#stability-levels-explained)であり、[オプトイン](opt-in-requirements.md)が必要です。
>
{style="warning"}

`@ShouldRefineInSwift` は、Kotlin宣言をSwiftで書かれたラッパーに置き換えるのに役立ちます。このアノテーションは、生成されたObjective-C APIで関数またはプロパティを`swift_private`としてマークします。そのような宣言には `__` 接頭辞が付けられ、Swiftからは見えなくなります。

これらの宣言は引き続きSwiftコードでSwiftフレンドリーなAPIを作成するために使用できますが、Xcodeのオートコンプリートでは提案されません。

*   SwiftでのObjective-C宣言の洗練に関する詳細については、[Apple公式ドキュメント](https://developer.apple.com/documentation/swift/improving-objective-c-api-declarations-for-swift)を参照してください。
*   `@ShouldRefineInSwift` アノテーションの使用例については、[Kotlin-Swift interopedia](https://github.com/kotlin-hands-on/kotlin-swift-interopedia/blob/main/docs/overview/ShouldRefineInSwift.md)を参照してください。

### 宣言名の変更

> `@ObjCName` アノテーションは[実験的](components-stability.md#stability-levels-explained)であり、[オプトイン](opt-in-requirements.md)が必要です。
>
{style="warning"}

Kotlin宣言の名前変更を避けるには、`@ObjCName` アノテーションを使用します。これにより、Kotlinコンパイラは、アノテーションが付けられたクラス、インターフェース、またはその他のKotlinエンティティにカスタムのObjective-CおよびSwift名を使用するように指示されます。

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

[Kotlin-Swift interopediaの別の例を参照してください](https://github.com/kotlin-hands-on/kotlin-swift-interopedia/blob/main/docs/overview/ObjCName.md)。

### KDocコメントによるドキュメントの提供

ドキュメントは、APIを理解するために不可欠です。共有Kotlin APIのドキュメントを提供することで、そのユーザーと使用方法、すべきこと、すべきでないことなどについてコミュニケーションをとることができます。

デフォルトでは、[KDocs](kotlin-doc.md)コメントは、Objective-Cヘッダーの生成時に対応するコメントに変換されません。たとえば、KDocを含む次のKotlinコードは、

```kotlin
/**
 * Prints the sum of the arguments.
 * Properly handles the case when the sum doesn't fit in 32-bit integer.
 */
fun printSum(a: Int, b: Int) = println(a.toLong() + b)
```

コメントのないObjective-C宣言を生成します。

```objc
+ (void)printSumA:(int32_t)a b:(int32_t)b __attribute__((swift_name("printSum(a:b:)")));
```

KDocコメントのエクスポートを有効にするには、`build.gradle(.kts)` に次のコンパイラオプションを追加します。

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

たとえばXcodeで、オートコンプリート時にクラスやメソッドのコメントを見ることができます。関数の定義（`.h`ファイル）に移動すると、`@param`、`@return`などのコメントが表示されます。

既知の制限事項:

> 生成されたObjective-CヘッダーにKDocコメントをエクスポートする機能は[実験的](components-stability.md)です。
> いつでも削除または変更される可能性があります。
> オプトインが必要であり（詳細は下記を参照）、評価目的でのみ使用してください。
> [YouTrack](https://youtrack.jetbrains.com/issue/KT-38600)でのフィードバックをお待ちしております。
>
{style="warning"}

*   依存関係のドキュメントは、それ自体が`-Xexport-kdoc`でコンパイルされない限りエクスポートされません。この機能は実験的なため、このオプションでコンパイルされたライブラリは他のコンパイラバージョンと互換性がない場合があります。
*   KDocコメントはほとんどそのままエクスポートされます。`@property`などの多くのKDoc機能はサポートされていません。

## マッピング

以下の表は、Kotlinの概念がSwift/Objective-Cに、またその逆方向でどのようにマッピングされるかを示しています。

"->"と"<-"は、マッピングが一方向のみであることを示します。

| Kotlin                 | Swift                            | Objective-C                      | 注記                                                                              |
|:-----------------------|:---------------------------------|:---------------------------------|:-----------------------------------------------------------------------------------|
| `class`                | `class`                          | `@interface`                     | [注](#classes)                                                                   |
| `interface`            | `protocol`                       | `@protocol`                      |                                                                                    |
| `constructor`/`create` | Initializer                      | Initializer                      | [注](#initializers)                                                              |
| Property               | Property                         | Property                         | [注1](#top-level-functions-and-properties)、[注2](#setters)                  |
| Method                 | Method                           | Method                           | [注1](#top-level-functions-and-properties)、[注2](#method-names-translation) |
| `enum class`           | `class`                          | `@interface`                     | [注](#enums)                                                                     |
| `suspend` ->           | `completionHandler:`/ `async`    | `completionHandler:`             | [注1](#errors-and-exceptions)、[注2](#suspending-functions)                  |
| `@Throws fun`          | `throws`                         | `error:(NSError**)error`         | [注](#errors-and-exceptions)                                                     |
| Extension              | Extension                        | Category member                  | [注](#extensions-and-category-members)                                           |
| `companion` member <-  | Class method or property         | Class method or property         |                                                                                    |
| `null`                 | `nil`                            | `nil`                            |                                                                                    |
| `Singleton`            | `shared` or `companion` property | `shared` or `companion` property | [注](#kotlin-singletons)                                                         |
| Primitive type         | Primitive type / `NSNumber`      |                                  | [注](#primitive-types)                                                           |
| `Unit` return type     | `Void`                           | `void`                           |                                                                                    |
| `String`               | `String`                         | `NSString`                       | [注](#strings)                                                                   |
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

#### 名前変換

Objective-Cクラスは、元の名前でKotlinにインポートされます。
プロトコルは、`Protocol` という名前のサフィックスを持つインターフェースとしてインポートされます（例: `@protocol Foo` -> `interface FooProtocol`）。
これらのクラスとインターフェースは、[ビルド構成で指定された](#importing-swift-objective-c-libraries-to-kotlin)パッケージ（事前設定されたシステムフレームワークの場合は`platform.*`パッケージ）に配置されます。

Kotlinのクラスとインターフェースの名前は、Objective-Cにインポートされる際に接頭辞が付けられます。
接頭辞はフレームワーク名から派生します。

Objective-Cはフレームワーク内のパッケージをサポートしていません。Kotlinコンパイラが同じフレームワーク内で、同じ名前だが異なるパッケージを持つKotlinクラスを見つけた場合、それらの名前を変更します。このアルゴリズムはまだ安定しておらず、Kotlinのリリース間で変更される可能性があります。これを回避するには、競合するKotlinクラスの名前をフレームワーク内で変更します。

#### 強参照リンク

KotlinソースでObjective-Cクラスを使用するたびに、それは強参照リンクされたシンボルとしてマークされます。結果として生成されるビルド成果物には、関連するシンボルが強力な外部参照として記載されます。

これは、アプリが起動時にシンボルを動的にリンクしようとし、利用できない場合はアプリがクラッシュすることを意味します。
クラッシュは、シンボルが一度も使用されなかった場合でも発生します。シンボルは特定のデバイスやOSバージョンで利用できない場合があります。

この問題を回避し、「Symbol not found」エラーを避けるには、クラスが実際に利用可能かどうかをチェックするSwiftまたはObjective-Cのラッパーを使用してください。[Compose Multiplatformフレームワークでこの回避策がどのように実装されたかを参照してください](https://github.com/JetBrains/compose-multiplatform-core/pull/1278/files)。

### イニシャライザ

Swift/Objective-Cのイニシャライザは、Kotlinにはコンストラクタまたは`create`という名前のファクトリメソッドとしてインポートされます。
後者は、Kotlinに拡張コンストラクタの概念がないため、Objective-CカテゴリまたはSwift拡張で宣言されたイニシャライザで発生します。

> SwiftのイニシャライザをKotlinにインポートする前に、`@objc`でアノテーションを付けることを忘れないでください。
>
{style="tip"}

Kotlinのコンストラクタは、Swift/Objective-Cにイニシャライザとしてインポートされます。

### セッタ

スーパークラスの読み取り専用プロパティをオーバーライドする書き込み可能なObjective-Cプロパティは、プロパティ`foo`に対する`setFoo()`メソッドとして表現されます。これは、可変として実装されるプロトコルの読み取り専用プロパティにも当てはまります。

### トップレベル関数とプロパティ

トップレベルのKotlin関数とプロパティは、特殊なクラスのメンバとしてアクセスできます。
各Kotlinファイルは、そのようなクラスに変換されます。例えば、

```kotlin
// MyLibraryUtils.kt
package my.library

fun foo() {}
```

次に、Swiftから`foo()`関数をこのように呼び出すことができます。

```swift
MyLibraryUtilsKt.foo()
```

Kotlin-Swift interopediaには、トップレベルのKotlin宣言にアクセスする例が多数掲載されています。

*   [トップレベル関数](https://github.com/kotlin-hands-on/kotlin-swift-interopedia/blob/main/docs/overview/Top-level%20functions.md)
*   [トップレベルの読み取り専用プロパティ](https://github.com/kotlin-hands-on/kotlin-swift-interopedia/blob/main/docs/functionsandproperties/Top-level%20val%20properties.md)
*   [トップレベルの可変プロパティ](https://github.com/kotlin-hands-on/kotlin-swift-interopedia/blob/main/docs/functionsandproperties/Top-level%20mutable%20var%20properties.md)

### メソッド名の変換

一般的に、Swiftの引数ラベルとObjective-Cのセレクタピースは、Kotlinのパラメータ名にマッピングされます。これら2つの概念は意味が異なるため、Swift/Objective-Cメソッドが競合するKotlinシグネチャでインポートされることがあります。
この場合、競合するメソッドは、名前付き引数を使用してKotlinから呼び出すことができます。例えば、

```swift
[player moveTo:LEFT byMeters:17]
[player moveTo:UP byInches:42]
```

Kotlinでは、次のようになります。

```kotlin
player.moveTo(LEFT, byMeters = 17)
player.moveTo(UP, byInches = 42)
```

`kotlin.Any`関数がSwift/Objective-Cにどのようにマッピングされるかを以下に示します。

| Kotlin       | Swift          | Objective-C   |
|:-------------|:---------------|:--------------|
| `equals()`   | `isEquals(_:)` | `isEquals:`   |
| `hashCode()` | `hash`         | `hash`        |
| `toString()` | `description`  | `description` |

[Kotlin-Swift interopediaのデータクラスの例を参照してください](https://github.com/kotlin-hands-on/kotlin-swift-interopedia/blob/main/docs/classesandinterfaces/Data%20classes.md)。

Kotlin宣言を名前変更する代わりに、[`@ObjCName`アノテーション](#change-declaration-names)を使用して、SwiftまたはObjective-Cでよりイディオム的な名前を指定できます。

### エラーと例外

すべてのKotlin例外は非チェック例外であり、エラーは実行時にキャッチされます。しかし、Swiftはコンパイル時に処理されるチェック例外のみを持ちます。したがって、SwiftまたはObjective-Cコードが例外をスローするKotlinメソッドを呼び出す場合、そのKotlinメソッドには、"予期される"例外クラスのリストを指定する`@Throws`アノテーションを付ける必要があります。

Swift/Objective-Cフレームワークにコンパイルする場合、`@Throws`アノテーションを持つ、または継承する非`suspend`関数は、Objective-Cでは`NSError*`を生成するメソッドとして、Swiftでは`throws`メソッドとして表現されます。
`suspend`関数の表現には、常にcompletion handlerに`NSError*`/`Error`パラメータが含まれます。

Swift/Objective-Cコードから呼び出されたKotlin関数が、`@Throws`で指定されたクラスのいずれかのインスタンス、またはそのサブクラスの例外をスローした場合、その例外は`NSError`として伝播されます。
Swift/Objective-Cに到達するその他のKotlin例外は未処理と見なされ、プログラムの終了を引き起こします。

`@Throws`のない`suspend`関数は、`CancellationException`のみを伝播します（`NSError`として）。
`@Throws`のない非`suspend`関数は、Kotlin例外をまったく伝播しません。

なお、逆方向の変換はまだ実装されていません。Swift/Objective-Cのエラースローメソッドは、Kotlinに例外スローとしてインポートされません。

[Kotlin-Swift interopediaの例を参照してください](https://github.com/kotlin-hands-on/kotlin-swift-interopedia/blob/main/docs/overview/Exceptions.md)。

### 列挙型

Kotlinの列挙型は、Objective-Cには`@interface`として、Swiftには`class`としてインポートされます。
これらのデータ構造には、各列挙値に対応するプロパティがあります。このKotlinコードを考えてみましょう。

```kotlin
// Kotlin
enum class Colors {
    RED, GREEN, BLUE
}
```

この列挙型クラスのプロパティには、Swiftから次のようにアクセスできます。

```swift
// Swift
Colors.red
Colors.green
Colors.blue
```

Swiftの`switch`文でKotlin列挙型の変数を使用するには、コンパイルエラーを防ぐためにデフォルトの文を提供します。

```swift
switch color {
    case .red: print("It's red")
    case .green: print("It's green")
    case .blue: print("It's blue")
    default: fatalError("No such color")
}
```

[Kotlin-Swift interopediaの別の例を参照してください](https://github.com/kotlin-hands-on/kotlin-swift-interopedia/blob/main/docs/classesandinterfaces/Enum%20classes.md)。

### Suspend関数

> Swiftコードから`suspend`関数を`async`として呼び出すサポートは[実験的](components-stability.md)です。
> いつでも削除または変更される可能性があります。
> 評価目的でのみ使用してください。[YouTrack](https://youtrack.jetbrains.com/issue/KT-47610)でのフィードバックをお待ちしております。
>
{style="warning"}

Kotlinの[サスペンド関数](coroutines-basics.md) (`suspend`) は、生成されたObjective-Cヘッダーではコールバックを持つ関数として、Swift/Objective-Cの用語では[completion handler](https://developer.apple.com/documentation/swift/calling_objective-c_apis_asynchronously)を持つ関数として表現されます。

Swift 5.5以降、Kotlinの`suspend`関数は、completion handlerを使用せずにSwiftから`async`関数として呼び出すことも可能です。現在、この機能は非常に実験的であり、特定の制限があります。詳細については、[このYouTrackの問題](https://youtrack.jetbrains.com/issue/KT-47610)を参照してください。

*   [`async`/`await`メカニズムの詳細については、Swiftドキュメント](https://docs.swift.org/swift-book/LanguageGuide/Concurrency.html)を参照してください。
*   同じ機能を実装するサードパーティライブラリの例と推奨事項については、[Kotlin-Swift interopedia](https://github.com/kotlin-hands-on/kotlin-swift-interopedia/blob/main/docs/coroutines/Suspend%20functions.md)を参照してください。

### 拡張機能とカテゴリメンバ

Objective-CカテゴリとSwift拡張のメンバは、一般的にKotlinには拡張としてインポートされます。そのため、これらの宣言はKotlinでオーバーライドできず、拡張イニシャライザはKotlinコンストラクタとしては利用できません。

> 現在、2つの例外があります。Kotlin 1.8.20以降、NSViewクラス（AppKitフレームワークから）またはUIViewクラス（UIKitフレームワークから）と同じヘッダーで宣言されたカテゴリメンバは、これらのクラスのメンバとしてインポートされます。これは、NSViewまたはUIViewをサブクラス化するメソッドをオーバーライドできることを意味します。
>
{style="note"}

「通常の」KotlinクラスへのKotlin拡張は、SwiftとObjective-Cにそれぞれ拡張とカテゴリメンバとしてインポートされます。他の型へのKotlin拡張は、追加のレシーバパラメータを持つ[トップレベル宣言](#top-level-functions-and-properties)として扱われます。これらの型には以下が含まれます。

*   Kotlin `String`型
*   Kotlinコレクション型とそのサブタイプ
*   Kotlin `interface`型
*   Kotlinプリミティブ型
*   Kotlin `inline`クラス
*   Kotlin `Any`型
*   Kotlin関数型とそのサブタイプ
*   Objective-Cクラスとプロトコル

[Kotlin-Swift interopediaの例集を参照してください](https://github.com/kotlin-hands-on/kotlin-swift-interopedia/tree/main/docs/extensions)。

### Kotlinシングルトン

Kotlinシングルトン（`object`宣言、`companion object`を含む）は、単一インスタンスのクラスとしてSwift/Objective-Cにインポートされます。

インスタンスは`shared`および`companion`プロパティを通じて利用できます。

以下のKotlinコードの場合：

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

これらのオブジェクトには次のようにアクセスします。

```swift
MyObject.shared
MyObject.shared.x
MyClass.companion
MyClass.Companion.shared
```

> Objective-Cで`[MySingleton mySingleton]`、Swiftで`MySingleton()`を通じてオブジェクトにアクセスすることは非推奨になりました。
>
{style="note"}

Kotlin-Swift interopediaでさらに多くの例を参照してください。

*   [`shared`を使用してKotlinオブジェクトにアクセスする方法](https://github.com/kotlin-hands-on/kotlin-swift-interopedia/blob/main/docs/classesandinterfaces/Objects.md)
*   [SwiftからKotlinの`companion object`のメンバにアクセスする方法](https://github.com/kotlin-hands-on/kotlin-swift-interopedia/blob/main/docs/classesandinterfaces/Companion%20objects.md)。

### プリミティブ型

Kotlinのプリミティブ型ボックスは、特殊なSwift/Objective-Cクラスにマッピングされます。たとえば、`kotlin.Int`ボックスは、Swiftでは`KotlinInt`クラスインスタンスとして表現されます（またはObjective-Cでは`${prefix}Int`インスタンスとして、ここで`prefix`はフレームワークの名前接頭辞です）。
これらのクラスは`NSNumber`から派生しているため、インスタンスは対応するすべての操作をサポートする適切な`NSNumber`です。

`NSNumber`型は、Swift/Objective-Cのパラメータ型または戻り値として使用される場合、Kotlinのプリミティブ型に自動的に変換されません。その理由は、`NSNumber`型がラップされたプリミティブ値の型に関する十分な情報を提供しないためです。たとえば、`NSNumber`が`Byte`、`Boolean`、または`Double`であることが静的に不明な場合があります。したがって、Kotlinのプリミティブ値は、[手動で`NSNumber`へキャストしたり、`NSNumber`からキャストしたり](#casting-between-mapped-types)する必要があります。

### 文字列

Kotlinの`String`がSwiftに渡されると、まずObjective-Cオブジェクトとしてエクスポートされ、その後SwiftコンパイラがSwift変換のためにもう一度コピーします。これにより、追加のランタイムオーバーヘッドが発生します。

これを避けるには、Kotlinの文字列をSwiftで直接Objective-Cの`NSString`としてアクセスします。
[変換例を参照してください](#see-the-conversion-example)。

#### NSMutableString

`NSMutableString` Objective-CクラスはKotlinからは利用できません。
`NSMutableString`のすべてのインスタンスは、Kotlinに渡されるときにコピーされます。

### コレクション

#### Kotlin -> Objective-C -> Swift

KotlinのコレクションがSwiftに渡されると、まずObjective-Cの同等物に変換され、その後Swiftコンパイラがコレクション全体をコピーし、[マッピング表](#mappings)に記載されているようにSwiftネイティブコレクションに変換します。

この最後の変換はパフォーマンスコストにつながります。これを防ぐには、SwiftでKotlinコレクションを使用する際に、明示的にそれらをObjective-Cの対応する型（`NSDictionary`、`NSArray`、または`NSSet`）にキャストします。

##### 変換例を参照 {initial-collapse-state="collapsed" collapsible="true"}

たとえば、次のKotlin宣言:

```kotlin
val map: Map<String, String>
```

Swiftでは、次のようになるかもしれません:

```Swift
map[key]?.count ?? 0
```

ここでは、`map`は暗黙的にSwiftの`Dictionary`に変換され、その文字列値はSwiftの`String`にマッピングされます。
これにより、パフォーマンスコストが発生します。

変換を避けるには、`map`を明示的にObjective-Cの`NSDictionary`にキャストし、代わりに値を`NSString`としてアクセスします。

```Swift
let nsMap: NSDictionary = map as NSDictionary
(nsMap[key] as? NSString)?.length ?? 0
```

これにより、Swiftコンパイラが追加の変換ステップを実行しないように保証されます。

#### Swift -> Objective-C -> Kotlin

Swift/Objective-Cコレクションは、[マッピング表](#mappings)に記載されているようにKotlinにマッピングされますが、`NSMutableSet`および`NSMutableDictionary`は例外です。

`NSMutableSet`はKotlinの`MutableSet`に変換されません。オブジェクトをKotlin `MutableSet`に渡すには、この種類のKotlinコレクションを明示的に作成します。これを行うには、たとえばKotlinの`mutableSetOf()`関数、またはSwiftの`KotlinMutableSet`クラスとObjective-Cの`${prefix}MutableSet`（`prefix`はフレームワーク名のプレフィックス）を使用します。
`MutableMap`についても同様です。

[Kotlin-Swift interopediaの例を参照してください](https://github.com/kotlin-hands-on/kotlin-swift-interopedia/blob/main/docs/overview/Collections.md)。

### 関数型

Kotlinの関数型オブジェクト（例えばラムダ）は、Swiftでは関数に、Objective-Cではブロックに変換されます。
[Kotlin-Swift interopediaのラムダを持つKotlin関数の例を参照してください](https://github.com/kotlin-hands-on/kotlin-swift-interopedia/blob/main/docs/functionsandproperties/Functions%20returning%20function%20type.md)。

ただし、関数と関数型の変換では、パラメータと戻り値の型のマッピング方法に違いがあります。後者の場合、プリミティブ型はボックス化された表現にマッピングされます。Kotlinの`Unit`戻り値は、Swift/Objective-Cでは対応する`Unit`シングルトンとして表現されます。このシングルトンの値は、他のKotlinの`object`と同様の方法で取得できます。[上記の表](#mappings)のシングルトンを参照してください。

次のKotlin関数を考えてみましょう。

```kotlin
fun foo(block: (Int) -> Unit) { ... }
```

これはSwiftで次のように表現されます。

```swift
func foo(block: (KotlinInt) -> KotlinUnit)
```

そして、次のように呼び出すことができます。

```kotlin
foo {
    bar($0 as! Int32)
    return KotlinUnit()
}
```

### ジェネリクス

Objective-Cは、クラスで定義された「軽量ジェネリクス」をサポートしており、機能セットは比較的限定的です。Swiftは、クラスで定義されたジェネリクスをインポートして、コンパイラに追加の型情報を提供するのに役立ちます。

Objective-CとSwiftのジェネリクス機能サポートはKotlinとは異なるため、変換は必然的に一部の情報を失いますが、サポートされている機能は意味のある情報を保持します。

SwiftでKotlinジェネリクスを使用する方法の具体的な例については、[Kotlin-Swift interopedia](https://github.com/kotlin-hands-on/kotlin-swift-interopedia/blob/main/docs/overview/ShouldRefineInSwift.md)を参照してください。

#### 制限事項

Objective-Cジェネリクスは、KotlinまたはSwiftのすべての機能をサポートしていないため、変換時に一部の情報が失われます。

ジェネリクスはクラス上でのみ定義でき、インターフェース（Objective-CとSwiftのプロトコル）や関数上では定義できません。

#### Null許容性

KotlinとSwiftはどちらも型指定の一部としてnull許容性を定義しますが、Objective-Cは型のメソッドとプロパティでnull許容性を定義します。したがって、次のKotlinコードは、

```kotlin
class Sample<T>() {
    fun myVal(): T
}
```

Swiftでは次のように見えます。

```swift
class Sample<T>() {
    fun myVal(): T?
}
```

null許容型をサポートするには、Objective-Cヘッダーで`myVal`をnull許容の戻り値で定義する必要があります。

これを軽減するには、ジェネリッククラスを定義する際に、ジェネリック型が_決して_nullであってはならない場合は、非nullの型制約を提供します。

```kotlin
class Sample<T : Any>() {
    fun myVal(): T
}
```

これにより、Objective-Cヘッダーが`myVal`を非nullとしてマークするよう強制されます。

#### 共変性/反変性

Objective-Cでは、ジェネリクスを共変または反変として宣言できます。Swiftには共変性/反変性のサポートはありません。Objective-Cから来るジェネリッククラスは、必要に応じて強制キャストできます。

```kotlin
data class SomeData(val num: Int = 42) : BaseData()
class GenVarOut<out T : Any>(val arg: T)
```

```swift
let variOut = GenVarOut<SomeData>(arg: sd)
let variOutAny : GenVarOut<BaseData> = variOut as! GenVarOut<BaseData>
```

#### 制約

Kotlinでは、ジェネリック型に上限を提供できます。Objective-Cもこれをサポートしていますが、より複雑なケースではそのサポートが利用できず、現在のKotlin-Objective-C相互運用ではサポートされていません。ここでの例外は、非nullの上限がObjective-Cのメソッド/プロパティを非nullにするという点です。

#### 無効化

ジェネリクスなしでフレームワークヘッダーを書き込むには、ビルドファイルに次のコンパイラオプションを追加します。

```kotlin
binaries.framework {
    freeCompilerArgs += "-Xno-objc-generics"
}
```

### 前方宣言

前方宣言をインポートするには、`objcnames.classes` および `objcnames.protocols` パッケージを使用します。例えば、`library.package` を持つ Objective-C ライブラリで宣言された `objcprotocolName` 前方宣言をインポートするには、特殊な前方宣言パッケージである `import objcnames.protocols.objcprotocolName` を使用します。

2つのobjcinteropライブラリを考えます。一方は `objcnames.protocols.ForwardDeclaredProtocolProtocol` を使用し、もう一方は別のパッケージに実際の実装を持っています。

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

> `objcnames.protocols.ForwardDeclaredProtocolProtocol`へのキャストは、対応する実際のクラスからのみ可能です。
> そうしないと、エラーが発生します。
>
{style="note"}

## マッピングされた型間のキャスト

Kotlinコードを記述する際、オブジェクトをKotlin型から対応するSwift/Objective-C型に（またはその逆に）変換する必要がある場合があります。この場合、通常のKotlinキャストを使用できます。例えば、

```kotlin
val nsArray = listOf(1, 2, 3) as NSArray
val string = nsString as String
val nsNumber = 42 as NSNumber
```

## サブクラス化

### Swift/Objective-CからのKotlinクラスとインターフェースのサブクラス化

Kotlinのクラスとインターフェースは、Swift/Objective-Cのクラスとプロトコルによってサブクラス化できます。

### KotlinからのSwift/Objective-Cクラスとプロトコルのサブクラス化

Swift/Objective-Cのクラスとプロトコルは、Kotlinの`final`クラスでサブクラス化できます。`final`ではないKotlinクラスがSwift/Objective-C型を継承することはまだサポートされていないため、Swift/Objective-C型を継承する複雑なクラス階層を宣言することはできません。

通常のメソッドは、`override` Kotlinキーワードを使用してオーバーライドできます。この場合、オーバーライドするメソッドは、オーバーライドされるメソッドと同じパラメータ名を持つ必要があります。

`UIViewController`をサブクラス化する際など、イニシャライザをオーバーライドする必要がある場合があります。Kotlinコンストラクタとしてインポートされたイニシャライザは、`@OverrideInit`アノテーションでマークされたKotlinコンストラクタによってオーバーライドできます。

```swift
class ViewController : UIViewController {
    @OverrideInit constructor(coder: NSCoder) : super(coder)

    ...
}
```

オーバーライドするコンストラクタは、オーバーライドされるコンストラクタと同じパラメータ名と型を持つ必要があります。

競合するKotlinシグネチャを持つ異なるメソッドをオーバーライドするには、クラスに`@ObjCSignatureOverride`アノテーションを追加できます。このアノテーションは、Objective-Cクラスから同じ引数型だが異なる引数名を持つ複数の関数が継承される場合に、Kotlinコンパイラに競合するオーバーロードを無視するように指示します。

デフォルトでは、Kotlin/Nativeコンパイラは、非指定Objective-Cイニシャライザを`super()`コンストラクタとして呼び出すことを許可していません。指定されたイニシャライザがObjective-Cライブラリで適切にマークされていない場合、この動作は不便なことがあります。これらのコンパイラチェックを無効にするには、ライブラリの[`.def`ファイル](native-definition-file.md)に`disableDesignatedInitializerChecks = true`を追加します。

## C機能

ライブラリがunsafeポインタ、構造体などの一部のプレーンC機能を使用する例については、[Cとの相互運用](native-c-interop.md)を参照してください。

## 未サポート

Kotlinプログラミング言語の一部の機能は、Objective-CまたはSwiftのそれぞれの機能にまだマッピングされていません。
現在、以下の機能は生成されたフレームワークヘッダーで適切に公開されていません。

*   インラインクラス（引数は基となるプリミティブ型または`id`にマッピングされます）
*   標準Kotlinコレクションインターフェース（`List`、`Map`、`Set`）およびその他の特殊なクラスを実装するカスタムクラス
*   Objective-CクラスのKotlinサブクラス