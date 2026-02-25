[//]: # (title: Swift/Objective-C との相互運用性)

> Objective-C ライブラリのインポートは[ベータ](native-lib-import-stability.md#stability-of-c-and-objective-c-library-import)段階です。
> cinterop ツールによって Objective-C ライブラリから生成されたすべての Kotlin 宣言には、
> `@ExperimentalForeignApi` アノテーションが付与されている必要があります。
>
> Kotlin/Native に同梱されているネイティブプラットフォームライブラリ（Foundation、UIKit、POSIX など）では、
> 一部の API でのみオプトインが必要です。
>
{style="note"}

Kotlin/Native は、Objective-C を介して Swift との間接的な相互運用性を提供します。このドキュメントでは、Swift/Objective-C コードで Kotlin の宣言を使用する方法、および Kotlin コードで Objective-C の宣言を使用する方法について説明します。

他に役立つリソース：

* [Kotlin-Swift interopedia](https://github.com/kotlin-hands-on/kotlin-swift-interopedia): Swift コードで Kotlin の宣言を使用する方法のサンプル集です。
* [Swift/Objective-C ARC との統合](native-arc-integration.md) セクション: Kotlin のトレース GC と Objective-C の ARC 間の統合の詳細について説明しています。

## Swift/Objective-C ライブラリを Kotlin にインポートする

Objective-C のフレームワークやライブラリは、ビルドに適切にインポートされていれば、Kotlin コードで使用できます（システムフレームワークはデフォルトでインポートされます）。
詳細については、以下を参照してください：

* [ライブラリ定義ファイル（.def）の作成と設定](native-definition-file.md)
* [ネイティブライブラリのコンパイル設定](https://kotlinlang.org/docs/multiplatform/multiplatform-configure-compilations.html#configure-interop-with-native-languages)

Swift ライブラリは、その API が `@objc` を使用して Objective-C にエクスポートされている場合、Kotlin コードで使用できます。
純粋な Swift モジュールはまだサポートされていません。

## Swift/Objective-C で Kotlin を使用する

Kotlin モジュールをフレームワークとしてコンパイルすると、Swift/Objective-C コードで使用できます：

* バイナリの宣言方法については、[最終的なネイティブバイナリのビルド](https://kotlinlang.org/docs/multiplatform/multiplatform-build-native-binaries.html#declare-binaries)を参照してください。
* 例については、[Kotlin Multiplatform サンプルプロジェクト](https://github.com/Kotlin/kmm-basic-sample)を確認してください。

### Kotlin の宣言を Objective-C および Swift から隠す

<primary-label ref="experimental-opt-in"/>

Kotlin コードをより Swift/Objective-C フレンドリーにするために、`@HiddenFromObjC` アノテーションを使用して、Kotlin の宣言を Objective-C および Swift から隠すことができます。これにより、その関数やプロパティの Objective-C へのエクスポートが無効になります。

あるいは、Kotlin の宣言に `internal` 修飾子を付けて、コンパイルモジュール内での可視性を制限することもできます。Kotlin の宣言を他の Kotlin モジュールからは見えるようにしつつ、Objective-C および Swift からは隠したい場合に `@HiddenFromObjC` を使用してください。

[Kotlin-Swift interopedia の例を参照してください](https://github.com/kotlin-hands-on/kotlin-swift-interopedia/blob/main/docs/overview/HiddenFromObjC.md)。

### Swift でのリファイン（精緻化）の使用

<primary-label ref="experimental-opt-in"/>

`@ShouldRefineInSwift` は、Kotlin の宣言を Swift で記述されたラッパーに置き換えるのに役立ちます。このアノテーションは、生成された Objective-C API において関数やプロパティを `swift_private` としてマークします。そのような宣言には `__` プレフィックスが付与され、Swift からは見えなくなります。

これらの宣言を Swift コード内で使用して Swift フレンドリーな API を作成することは可能ですが、Xcode のオートコンプリートには表示されなくなります。

* Swift における Objective-C 宣言のリファインに関する詳細は、[Apple の公式ドキュメント](https://developer.apple.com/documentation/swift/improving-objective-c-api-declarations-for-swift)を参照してください。
* `@ShouldRefineInSwift` アノテーションの使用例については、[Kotlin-Swift interopedia](https://github.com/kotlin-hands-on/kotlin-swift-interopedia/blob/main/docs/overview/ShouldRefineInSwift.md) を参照してください。

### 宣言名の変更

<primary-label ref="experimental-opt-in"/>

Kotlin の宣言名を変更せずに済むようにするには、`@ObjCName` アノテーションを使用します。これにより、Kotlin コンパイラに対して、アノテーションが付与されたクラス、インターフェース、またはその他の Kotlin エンティティに対してカスタムの Objective-C および Swift 名を使用するように指示できます：

```kotlin
@ObjCName(swiftName = "MySwiftArray")
class MyKotlinArray {
    @ObjCName("index")
    fun indexOf(@ObjCName("of") element: String): Int = TODO()
}

// ObjCName アノテーションを使用した際の使用法
let array = MySwiftArray()
let index = array.index(of: "element")
```

[Kotlin-Swift interopedia の別の例を参照してください](https://github.com/kotlin-hands-on/kotlin-swift-interopedia/blob/main/docs/overview/ObjCName.md)。

### KDoc コメントによるドキュメントの提供

ドキュメントは、あらゆる API を理解するために不可欠です。共有された Kotlin API にドキュメントを提供することで、使用法や注意事項などをユーザーに伝えることができます。

Objective-C ヘッダーを生成する際、Kotlin コードの [KDoc](kotlin-doc.md) コメントは、対応する Objective-C のコメントに変換されます。たとえば、KDoc を含む以下の Kotlin コードは：

```kotlin
/**
 * 引数の合計をプリントします。
 * 合計が 32 ビット整数に収まらない場合も適切に処理します。
 */
fun printSum(a: Int, b: Int) = println(a.toLong() + b)
```

対応するコメントを含む Objective-C ヘッダーを生成します：

```objc
/**
 * Prints the sum of the arguments.
 * Properly handles the case when the sum doesn't fit in 32-bit integer.
 */
+ (void)printSumA:(int32_t)a b:(int32_t)b __attribute__((swift_name("printSum(a:b:)")));
```

KDoc コメントは klib に埋め込まれ、klib から生成された Apple フレームワークに抽出されます。その結果、Xcode などのオートコンプリート時にクラスやメソッドのコメントが表示されるようになります。`.h` ファイルの関数定義に移動すると、`@param` や `@return` などのタグに対するコメントを確認できます。

既知の制限事項：

* 依存関係のドキュメントは、`-Xexport-kdoc` オプションを付けてコンパイルされていない限りエクスポートされません。このコンパイラオプションを使用してコンパイルされたライブラリは、他のコンパイラバージョンと互換性がない可能性があります。
* KDoc コメントはほとんどそのままエクスポートされますが、`@property` などの多くの KDoc ブロックタグはサポートされていません。

必要に応じて、Gradle ビルドファイルの `binaries {}` ブロックで、klib から生成された Apple フレームワークへの KDoc コメントのエクスポートを無効にすることができます：

```kotlin
// build.gradle.kts
import org.jetbrains.kotlin.gradle.ExperimentalKotlinGradlePluginApi

kotlin {
    iosArm64 {
        binaries {
            framework {
                baseName = "sdk"
                @OptIn(ExperimentalKotlinGradlePluginApi::class)
                exportKdoc.set(false)
            }
        }
    }
}
```

## マッピング

以下の表は、Kotlin の概念が Swift/Objective-C にどのようにマッピングされるか、またその逆を示しています。

「->」および「<-」は、マッピングが一方向にのみ行われることを示します。

| Kotlin                 | Swift                            | Objective-C                      | 備考                                                                               |
|------------------------|----------------------------------|----------------------------------|------------------------------------------------------------------------------------|
| `class`                | `class`                          | `@interface`                     | [備考](#classes)                                                                   |
| `interface`            | `protocol`                       | `@protocol`                      |                                                                                    |
| `constructor`/`create` | イニシャライザ                    | イニシャライザ                    | [備考](#initializers)                                                              |
| プロパティ              | プロパティ                        | プロパティ                        | [備考 1](#top-level-functions-and-properties), [備考 2](#setters)                  |
| メソッド                | メソッド                          | メソッド                          | [備考 1](#top-level-functions-and-properties), [備考 2](#method-names-translation) |
| `enum class`           | `class`                          | `@interface`                     | [備考](#enums)                                                                     |
| `suspend` ->           | `completionHandler:`/ `async`    | `completionHandler:`             | [備考 1](#errors-and-exceptions), [備考 2](#suspending-functions)                  |
| `@Throws fun`          | `throws`                         | `error:(NSError**)error`         | [備考](#errors-and-exceptions)                                                     |
| 拡張（Extension）       | 拡張（Extension）                 | カテゴリメンバ                    | [備考](#extensions-and-category-members)                                           |
| `companion` メンバ <-  | クラスメソッドまたはプロパティ     | クラスメソッドまたはプロパティ     |                                                                                    |
| `null`                 | `nil`                            | `nil`                            |                                                                                    |
| `Singleton`            | `shared` または `companion` プロパティ | `shared` または `companion` プロパティ | [備考](#kotlin-singletons)                                                         |
| プリミティブ型          | プリミティブ型 / `NSNumber`      |                                  | [備考](#primitive-types)                                                           |
| `Unit` 戻り値型         | `Void`                           | `void`                           |                                                                                    |
| `String`               | `String`                         | `NSString`                       | [備考](#strings)                                                                   |
| `String`               | `NSMutableString`                | `NSMutableString`                | [備考](#nsmutablestring)                                                           |
| `List`                 | `Array`                          | `NSArray`                        |                                                                                    |
| `MutableList`          | `NSMutableArray`                 | `NSMutableArray`                 |                                                                                    |
| `Set`                  | `Set`                            | `NSSet`                          |                                                                                    |
| `MutableSet`           | `NSMutableSet`                   | `NSMutableSet`                   | [備考](#collections)                                                               |
| `Map`                  | `Dictionary`                     | `NSDictionary`                   |                                                                                    |
| `MutableMap`           | `NSMutableDictionary`            | `NSMutableDictionary`            | [備考](#collections)                                                               |
| 関数型                  | 関数型                            | ブロックポインタ型                 | [備考](#function-types)                                                            |
| インラインクラス         | サポート外                        | サポート外                        | [備考](#unsupported)                                                               |

### クラス (Classes)

#### 名前の変換

Objective-C のクラスは、元の名前で Kotlin にインポートされます。
プロトコルは、`Protocol` という名前のサフィックスが付いたインターフェースとしてインポートされます。たとえば、`@protocol Foo` -> `interface FooProtocol` となります。
これらのクラスとインターフェースは、[ビルド設定で指定されたパッケージ](#importing-swift-objective-c-libraries-to-kotlin)（事前設定されたシステムフレームワークの場合は `platform.*` パッケージ）に配置されます。

Kotlin のクラスやインターフェースの名前は、Objective-C にインポートされる際にプレフィックスが付与されます。
このプレフィックスはフレームワーク名から派生します。

Objective-C はフレームワーク内でのパッケージをサポートしていません。Kotlin コンパイラが、同じフレームワーク内に同じ名前で異なるパッケージを持つ Kotlin クラスを見つけた場合、それらをリネームします。このアルゴリズムはまだ安定しておらず、Kotlin のリリース間で変更される可能性があります。これを回避するには、フレームワーク内で競合する Kotlin クラスの名前を変更してください。

#### 強固なリンク (Strong linking)

Kotlin ソース内で Objective-C クラスを使用するたびに、それは強固にリンクされたシンボル（strongly linked symbol）としてマークされます。結果として生成されるビルド成果物には、関連するシンボルが強力な外部参照として記載されます。

これは、アプリが起動時にシンボルを動的にリンクしようとすることを意味し、シンボルが利用できない場合はアプリがクラッシュします。クラッシュは、シンボルが一度も使用されなかったとしても発生します。シンボルは、特定のデバイスや OS バージョンでは利用できない可能性があります。

この問題を回避し、「Symbol not found」エラーを防ぐには、そのクラスが実際に利用可能かどうかをチェックする Swift または Objective-C のラッパーを使用してください。[Compose Multiplatform フレームワークでこの回避策がどのように実装されたかを参照してください](https://github.com/JetBrains/compose-multiplatform-core/pull/1278/files)。

### イニシャライザ (Initializers)

Swift/Objective-C のイニシャライザは、Kotlin にコンストラクタとして、あるいは `create` という名前のファクトリメソッドとしてインポートされます。
後者は、Objective-C のカテゴリや Swift の拡張（Extension）で宣言されたイニシャライザの場合に発生します。これは Kotlin に拡張コンストラクタという概念がないためです。

> Swift のイニシャライザを Kotlin にインポートする前に、それらに `@objc` アノテーションを付けることを忘れないでください。
>
{style="tip"}

Kotlin のコンストラクタは、Swift/Objective-C にイニシャライザとしてインポートされます。

### セッター (Setters)

スーパークラスの読み取り専用プロパティをオーバーライドする書き込み可能な Objective-C プロパティは、プロパティ `foo` に対して `setFoo()` メソッドとして表現されます。ミュータブルとして実装されたプロトコルの読み取り専用プロパティについても同様です。

### トップレベル関数とプロパティ (Top-level functions and properties)

トップレベルの Kotlin 関数とプロパティは、特別なクラスのメンバとしてアクセス可能です。
各 Kotlin ファイルはこのようなクラスに変換されます。たとえば：

```kotlin
// MyLibraryUtils.kt
package my.library

fun foo() {}
```

この `foo()` 関数を Swift から以下のように呼び出すことができます：

```swift
MyLibraryUtilsKt.foo()
```

トップレベルの Kotlin 宣言へのアクセスに関する例については、Kotlin-Swift interopedia を参照してください：

* [トップレベル関数](https://github.com/kotlin-hands-on/kotlin-swift-interopedia/blob/main/docs/overview/Top-level%20functions.md)
* [トップレベルの読み取り専用プロパティ](https://github.com/kotlin-hands-on/kotlin-swift-interopedia/blob/main/docs/functionsandproperties/Top-level%20val%20properties.md)
* [トップレベルのミュータブルプロパティ](https://github.com/kotlin-hands-on/kotlin-swift-interopedia/blob/main/docs/functionsandproperties/Top-level%20mutable%20var%20properties.md)

### メソッド名の変換

一般的に、Swift の引数ラベルと Objective-C のセレクタの一部は、Kotlin のパラメータ名にマッピングされます。これら 2 つの概念はセマンティクス（意味論）が異なるため、Swift/Objective-C のメソッドが Kotlin のシグネチャと衝突してインポートされることがあります。
この場合、衝突したメソッドは Kotlin から名前付き引数を使用して呼び出すことができます。たとえば：

```swift
[player moveTo:LEFT byMeters:17]
[player moveTo:UP byInches:42]
```

Kotlin では以下のようになります：

```kotlin
player.moveTo(LEFT, byMeters = 17)
player.moveTo(UP, byInches = 42)
```

`kotlin.Any` の関数が Swift/Objective-C にどのようにマッピングされるかは以下の通りです：

| Kotlin       | Swift          | Objective-C   |
|--------------|----------------|---------------|
| `equals()`   | `isEquals(_:)` | `isEquals:`   |
| `hashCode()` | `hash`         | `hash`        |
| `toString()` | `description`  | `description` |

[Kotlin-Swift interopedia のデータクラスの例を参照してください](https://github.com/kotlin-hands-on/kotlin-swift-interopedia/blob/main/docs/classesandinterfaces/Data%20classes.md)。

[`@ObjCName` アノテーション](#change-declaration-names)を使用して Kotlin の宣言をリネームする代わりに、Swift または Objective-C においてより慣用的な（idiomatic）名前を指定することもできます。

### エラーと例外 (Errors and exceptions)

Kotlin の例外はすべて非チェック（unchecked）例外であり、エラーは実行時にキャッチされます。しかし、Swift にはコンパイル時に処理されるチェック例外（checked errors）しかありません。そのため、Swift または Objective-C コードが例外をスローする Kotlin メソッドを呼び出す場合、その Kotlin メソッドには「予期される」例外クラスのリストを指定した `@Throws` アノテーションを付ける必要があります。

Swift/Objective-C フレームワークにコンパイルする場合、`@Throws` アノテーションを持っている、あるいは継承している非 `suspend` 関数は、Objective-C では `NSError*` を生成するメソッドとして、Swift では `throws` メソッドとして表現されます。`suspend` 関数の表現には、常にコンプリーションハンドラ（completion handler）内に `NSError*`/`Error` パラメータが含まれます。

Swift/Objective-C コードから呼び出された Kotlin 関数が、`@Throws` で指定されたクラスまたはそのサブクラスのインスタンスである例外をスローした場合、その例外は `NSError` として伝播されます。Swift/Objective-C に到達するその他の Kotlin 例外は未処理とみなされ、プログラムの終了を引き起こします。

`@Throws` のない `suspend` 関数は、`CancellationException` のみを（`NSError` として）伝播します。`@Throws` のない非 `suspend` 関数は、Kotlin の例外を一切伝播しません。

なお、逆方向の変換（Swift/Objective-C のエラーをスローするメソッドを Kotlin の例外をスローするメソッドとしてインポートすること）はまだ実装されていません。

[Kotlin-Swift interopedia の例を参照してください](https://github.com/kotlin-hands-on/kotlin-swift-interopedia/blob/main/docs/overview/Exceptions.md)。

### 列挙型 (Enums)

Kotlin の列挙型（enum）は、Objective-C には `@interface` として、Swift には `class` としてインポートされます。
これらのデータ構造には、各 enum 値に対応するプロパティがあります。以下の Kotlin コードを考えてみましょう：

```kotlin
// Kotlin
enum class Colors {
    RED, GREEN, BLUE
}
```

この enum クラスのプロパティに Swift から以下のようにアクセスできます：

```swift
// Swift
Colors.red
Colors.green
Colors.blue
```

Swift の `switch` 文で Kotlin の enum 変数を使用するには、コンパイルエラーを防ぐために `default` 文を指定してください：

```swift
switch color {
    case .red: print("It's red")
    case .green: print("It's green")
    case .blue: print("It's blue")
    default: fatalError("No such color")
}
```

[Kotlin-Swift interopedia の別の例を参照してください](https://github.com/kotlin-hands-on/kotlin-swift-interopedia/blob/main/docs/classesandinterfaces/Enum%20classes.md)。

### 中断関数 (Suspending functions)

<primary-label ref="experimental-opt-in"/>

Kotlin の [中断関数](coroutines-basics.md) (`suspend`) は、生成された Objective-C ヘッダーではコールバックを伴う関数、または Swift/Objective-C の用語でいう [コンプリーションハンドラ](https://developer.apple.com/documentation/swift/calling_objective-c_apis_asynchronously) を持つ関数として提示されます。

Swift 5.5 以降、Kotlin の `suspend` 関数は、コンプリーションハンドラを使用せずに `async` 関数として Swift から呼び出すことも可能になりました。現在、この機能は非常に実験的であり、特定の制限があります。詳細については、[こちらの YouTrack イシュー](https://youtrack.jetbrains.com/issue/KT-47610)を参照してください。

* Swift ドキュメントの [`async`/`await` メカニズム](https://docs.swift.org/swift-book/LanguageGuide/Concurrency.html)について詳しく学ぶ。
* 同じ機能を実装しているサードパーティライブラリの例と推奨事項については、[Kotlin-Swift interopedia](https://github.com/kotlin-hands-on/kotlin-swift-interopedia/blob/main/docs/coroutines/Suspend%20functions.md) を参照してください。

### 拡張とカテゴリメンバ (Extensions and category members)

Objective-C のカテゴリおよび Swift の拡張（Extension）のメンバは、一般的に拡張として Kotlin にインポートされます。そのため、これらの宣言を Kotlin でオーバーライドすることはできず、拡張イニシャライザは Kotlin のコンストラクタとして利用できません。

> 現在、2 つの例外があります。Kotlin 1.8.20 以降、AppKit フレームワークの `NSView` クラスや UIKit フレームワークの `UIView` クラスと同じヘッダーで宣言されているカテゴリメンバは、それらのクラスのメンバとしてインポートされます。つまり、`NSView` や `UIView` をサブクラス化するメソッドをオーバーライドできます。
>
{style="note"}

「通常の」Kotlin クラスに対する Kotlin の拡張は、Swift には拡張として、Objective-C にはカテゴリメンバとしてそれぞれインポートされます。その他の型に対する Kotlin の拡張は、追加のレシーバパラメータを持つ[トップレベル宣言](#top-level-functions-and-properties)として扱われます。これらの型には以下が含まれます：

* Kotlin の `String` 型
* Kotlin のコレクション型およびそのサブタイプ
* Kotlin の `interface` 型
* Kotlin のプリミティブ型
* Kotlin の `inline` クラス
* Kotlin の `Any` 型
* Kotlin の関数型およびそのサブタイプ
* Objective-C のクラスおよびプロトコル

[Kotlin-Swift interopedia の例のコレクションを参照してください](https://github.com/kotlin-hands-on/kotlin-swift-interopedia/tree/main/docs/extensions)。

### Kotlin のシングルトン (Kotlin singletons)

Kotlin のシングルトン（`companion object` を含む `object` 宣言で作成されたもの）は、単一のインスタンスを持つクラスとして Swift/Objective-C にインポートされます。

インスタンスは `shared` および `companion` プロパティを介して利用可能です。

以下の Kotlin コードの場合：

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

これらのオブジェクトには以下のようにアクセスします：

```swift
MyObject.shared
MyObject.shared.x
MyClass.companion
MyClass.Companion.shared
```

> Objective-C の `[MySingleton mySingleton]` や Swift の `MySingleton()` を介したオブジェクトへのアクセスは非推奨になりました。
> 
{style="note"}

Kotlin-Swift interopedia でさらなる例を確認してください：

* [`shared` を使用して Kotlin オブジェクトにアクセスする方法](https://github.com/kotlin-hands-on/kotlin-swift-interopedia/blob/main/docs/classesandinterfaces/Objects.md)
* [Swift から Kotlin のコンパニオンオブジェクトのメンバにアクセスする方法](https://github.com/kotlin-hands-on/kotlin-swift-interopedia/blob/main/docs/classesandinterfaces/Companion%20objects.md)。

### プリミティブ型 (Primitive types)

Kotlin プリミティブ型のボックス化（box）は、特別な Swift/Objective-C クラスにマッピングされます。たとえば、`kotlin.Int` ボックスは Swift では `KotlinInt` クラスのインスタンスとして表現されます（または Objective-C では `${prefix}Int` インスタンス。ここで `prefix` はフレームワークの名前プレフィックスです）。これらのクラスは `NSNumber` から派生しているため、インスタンスは適切な `NSNumber` であり、対応するすべての操作をサポートします。

`NSNumber` 型は、Swift/Objective-C のパラメータ型または戻り値として使用される際、自動的に Kotlin のプリミティブ型に変換されることはありません。その理由は、`NSNumber` 型がラップされたプリミティブ値の型について十分な情報を提供しないためです。たとえば、`NSNumber` が `Byte` なのか、`Boolean` なのか、それとも `Double` なのかは静的には不明です。そのため、Kotlin のプリミティブ値は[手動で `NSNumber` とキャスト](#casting-between-mapped-types)する必要があります。

### 文字列 (Strings)

Kotlin の `String` が Swift に渡されるとき、まず Objective-C オブジェクトとしてエクスポートされ、次に Swift コンパイラが Swift への変換のためにさらに一度コピーします。これにより、実行時のオーバーヘッドが追加されます。

これを避けるには、Swift で Kotlin 文字列に直接アクセスする代わりに、Objective-C の `NSString` としてアクセスしてください。
[変換の例を参照してください](#see-the-conversion-example)。

#### NSMutableString

Objective-C クラスの `NSMutableString` は Kotlin からは利用できません。
`NSMutableString` のすべてのインスタンスは、Kotlin に渡される際にコピーされます。

### コレクション (Collections)

#### Kotlin -> Objective-C -> Swift

Kotlin のコレクションが Swift に渡されるとき、まず Objective-C の同等のものに変換され、次に Swift コンパイラがコレクション全体をコピーして、[マッピング表](#mappings)に記載されている Swift ネイティブのコレクションに変換します。

この最後の変換によりパフォーマンスコストが発生します。これを防ぐには、Swift で Kotlin コレクションを使用する際に、明示的に Objective-C の対応するもの（`NSDictionary`、`NSArray`、または `NSSet`）にキャストしてください。

##### 変換例の表示 {initial-collapse-state="collapsed" collapsible="true"}

たとえば、以下の Kotlin 宣言は：

```kotlin
val map: Map<String, String>
```

Swift では以下のようになる可能性があります：

```Swift
map[key]?.count ?? 0
```

ここで、`map` は暗黙的に Swift の `Dictionary` に変換され、その文字列値は Swift の `String` にマッピングされます。これによりパフォーマンスコストが発生します。

変換を避けるには、`map` を Objective-C の `NSDictionary` に明示的にキャストし、代わりに値を `NSString` としてアクセスします：

```Swift
let nsMap: NSDictionary = map as NSDictionary
(nsMap[key] as? NSString)?.length ?? 0
```

これにより、Swift コンパイラが追加の変換ステップを実行しないようになります。

#### Swift -> Objective-C -> Kotlin

Swift/Objective-C のコレクションは、`NSMutableSet` と `NSMutableDictionary` を除き、[マッピング表](#mappings)に記載されている通り Kotlin にマッピングされます。

`NSMutableSet` は Kotlin の `MutableSet` には変換されません。オブジェクトを Kotlin の `MutableSet` に渡すには、明示的にこの種の Kotlin コレクションを作成してください。これを行うには、たとえば Kotlin の `mutableSetOf()` 関数や、Swift の `KotlinMutableSet` クラス（Objective-C では `${prefix}MutableSet`。`prefix` はフレームワーク名のプレフィックス）を使用します。`MutableMap` についても同様です。

[Kotlin-Swift interopedia の例を参照してください](https://github.com/kotlin-hands-on/kotlin-swift-interopedia/blob/main/docs/overview/Collections.md)。

### 関数型 (Function types)

Kotlin の関数型のオブジェクト（ラムダなど）は、Swift ではクロージャに、Objective-C ではブロックに変換されます。
[Kotlin-Swift interopedia のラムダを伴う Kotlin 関数の例を参照してください](https://github.com/kotlin-hands-on/kotlin-swift-interopedia/blob/main/docs/functionsandproperties/Functions%20returning%20function%20type.md)。

ただし、関数を変換する場合と関数型を変換する場合では、パラメータや戻り値の型のマッピング方法に違いがあります。後者の場合、プリミティブ型はボックス化された表現にマッピングされます。Kotlin の `Unit` 戻り値は、Swift/Objective-C では対応する `Unit` シングルトンとして表現されます。このシングルトンの値は、他の Kotlin `object` と同様の方法で取得できます。上記の[マッピング表](#mappings)のシングルトンを参照してください。

以下の Kotlin 関数を考えてみましょう：

```kotlin
fun foo(block: (Int) -> Unit) { ... }
```

これは Swift では次のように表現されます：

```swift
func foo(block: (KotlinInt) -> KotlinUnit)
```

そして、次のように呼び出すことができます：

```swift
foo {
    bar($0 as! Int32)
    return KotlinUnit()
}
```

#### Objective-C ブロック型における明示的なパラメータ名

Kotlin は、エクスポートされる Objective-C ヘッダーの関数型に明示的なパラメータ名を追加します。
Xcode のオートコンプリートは、Objective-C ブロック内で Objective-C 関数を呼び出す際に、これらの名前を提案します。

たとえば、以下の Kotlin コードの場合：

```kotlin
// Kotlin:
fun greetUser(block: (name: String) -> Unit) = block("John")
```

Kotlin は Kotlin の関数型から Objective-C のブロック型にパラメータ名を転送し、Xcode が提案でそれらを使用できるようにします：

```objc
// Objective-C:
greetUserBlock:^(NSString *name) {
    // ...
};
```

> このオプションは Objective-C 相互運用のみに影響します。これは Xcode で生成された Objective-C コードを Objective-C から呼び出す際に適用され、一般的に Swift からの呼び出しには影響しません。
>
{style="note"}

問題が発生した場合は、`gradle.properties` ファイルで以下の[バイナリオプション](native-binary-options.md)を使用して明示的なパラメータ名を無効にすることができます：

```none
kotlin.native.binary.objcExportBlockExplicitParameterNames=false
```

このような問題が発生した場合は、イシュートラッカー [YouTrack](https://kotl.in/issue) に報告してください。

### ジェネリクス (Generics)

Objective-C は、比較的限定された機能セットを持つクラス定義の「軽量ジェネリクス（lightweight generics）」をサポートしています。Swift は、クラスに定義されたジェネリクスをインポートして、コンパイラに追加の型情報を提供するのに役立てることができます。

Objective-C と Swift のジェネリクス機能のサポートは Kotlin とは異なるため、変換によって必然的に一部の情報が失われますが、サポートされている機能は意味のある情報を保持します。

Swift で Kotlin ジェネリクスを使用する具体的な例については、[Kotlin-Swift interopedia](https://github.com/kotlin-hands-on/kotlin-swift-interopedia/blob/main/docs/overview/ShouldRefineInSwift.md) を参照してください。

#### 制限事項

Objective-C のジェネリクスは Kotlin または Swift のすべての機能をサポートしているわけではないため、変換時に一部の情報が失われます。

ジェネリクスはクラスにのみ定義でき、インターフェース（Objective-C および Swift のプロトコル）や関数には定義できません。

#### Null 可否 (Nullability)

Kotlin と Swift はどちらも型仕様の一部として Null 可否を定義しますが、Objective-C は型のメソッドやプロパティに対して Null 可否を定義します。そのため、以下の Kotlin コードは：

```kotlin
class Sample<T>() {
    fun myVal(): T
}
```

Swift では以下のようになります：

```swift
class Sample<T>() {
    fun myVal(): T?
}
```

潜在的に Null 許容な型をサポートするために、Objective-C ヘッダーは Null 許容の戻り値を持つ `myVal` を定義する必要があります。

これを緩和するには、ジェネリクス型が*決して* Null にならない必要がある場合、ジェネリクスクラスを定義する際に非 Null 型の制約を提供してください：

```kotlin
class Sample<T : Any>() {
    fun myVal(): T
}
```

これにより、Objective-C ヘッダーで `myVal` が非 Null としてマークされるよう強制されます。

#### 変異性 (Variance)

Objective-C はジェネリクスを共変（covariant）または反変（contravariant）として宣言することを許可しています。Swift は変異性をサポートしていません。Objective-C から提供されるジェネリクスクラスは、必要に応じて強制キャストできます。

```kotlin
data class SomeData(val num: Int = 42) : BaseData()
class GenVarOut<out T : Any>(val arg: T)
```

```swift
let variOut = GenVarOut<SomeData>(arg: sd)
let variOutAny : GenVarOut<BaseData> = variOut as! GenVarOut<BaseData>
```

#### 制約 (Constraints)

Kotlin では、ジェネリクス型に上限境界（upper bounds）を指定できます。Objective-C もこれをサポートしていますが、より複雑なケースでは利用できず、現在は Kotlin - Objective-C 相互運用ではサポートされていません。例外として、非 Null の上限境界は、Objective-C のメソッド/プロパティを非 Null にします。

#### 無効化する方法

ジェネリクスなしでフレームワークヘッダーを書き出すには、ビルドファイルに以下のコンパイラオプションを追加してください：

```kotlin
binaries.framework {
    freeCompilerArgs += "-Xno-objc-generics"
}
```

### 前方宣言 (Forward declarations)

前方宣言をインポートするには、`objcnames.classes` および `objcnames.protocols` パッケージを使用します。たとえば、`library.package` を持つ Objective-C ライブラリで宣言された `objcprotocolName` という前方宣言をインポートするには、特別な前方宣言パッケージ `import objcnames.protocols.objcprotocolName` を使用します。

2 つの objcinterop ライブラリを想定してください。一方は `objcnames.protocols.ForwardDeclaredProtocolProtocol` を使用し、もう一方は別のパッケージに実際の実装を持っています：

```ObjC
// 第1の objcinterop ライブラリ
#import <Foundation/Foundation.h>

@protocol ForwardDeclaredProtocol;

NSString* consumeProtocol(id<ForwardDeclaredProtocol> s) {
    return [NSString stringWithUTF8String:"Protocol"];
}
```

```ObjC
// 第2の objcinterop ライブラリ
// ヘッダー:
#import <Foundation/Foundation.h>
@protocol ForwardDeclaredProtocol
@end
// 実装:
@interface ForwardDeclaredProtocolImpl : NSObject <ForwardDeclaredProtocol>
@end

id<ForwardDeclaredProtocol> produceProtocol() {
    return [ForwardDeclaredProtocolImpl new];
}
```

2 つのライブラリ間でオブジェクトを転送するには、Kotlin コードで明示的な `as` キャストを使用します：

```kotlin
// Kotlin コード:
fun test() {
    consumeProtocol(produceProtocol() as objcnames.protocols.ForwardDeclaredProtocolProtocol)
}
```

> 対応する実際のクラスからのみ `objcnames.protocols.ForwardDeclaredProtocolProtocol` にキャストできます。
> それ以外の場合はエラーが発生します。
>
{style="note"}

## マッピングされた型の間でのキャスト

Kotlin コードを記述する際、オブジェクトを Kotlin の型から同等の Swift/Objective-C の型へ、またはその逆に変換する必要がある場合があります。この場合、[`as` キャスト](typecasts.md#unsafe-cast-operator)を使用できます。たとえば：

```kotlin
@file:Suppress("CAST_NEVER_SUCCEEDS")
import platform.Foundation.*

val nsNumber = 42 as NSNumber
val nsArray = listOf(1, 2, 3) as NSArray
val nsString = "Hello" as NSString
val string = nsString as String
```

IDE が「This cast can never succeed（このキャストは決して成功しません）」という警告を誤って表示することがあります。
その場合は、`@Suppress("CAST_NEVER_SUCCEEDS")` アノテーションを使用してください。

## サブクラス化 (Subclassing)

### Swift/Objective-C から Kotlin のクラスやインターフェースをサブクラス化する

Kotlin のクラスやインターフェースは、Swift/Objective-C のクラスやプロトコルによってサブクラス化できます。

### Kotlin から Swift/Objective-C のクラスやプロトコルをサブクラス化する

Swift/Objective-C のクラスやプロトコルは、Kotlin の `final` クラスでサブクラス化できます。Swift/Objective-C の型を継承する非 `final` な Kotlin クラスはまだサポートされていないため、Swift/Objective-C の型を継承する複雑なクラス階層を宣言することはできません。

通常のメソッドは、Kotlin の `override` キーワードを使用してオーバーライドできます。この場合、オーバーライドするメソッドは、オーバーライドされるメソッドと同じパラメータ名を持つ必要があります。

`UIViewController` をサブクラス化する場合など、イニシャライザをオーバーライドする必要があることがあります。Kotlin のコンストラクタとしてインポートされたイニシャライザは、`@OverrideInit` アノテーションが付いた Kotlin コンストラクタによってオーバーライドできます：

```swift
class ViewController : UIViewController {
    @OverrideInit constructor(coder: NSCoder) : super(coder)

    ...
}
```

オーバーライドするコンストラクタは、オーバーライドされるものと同じパラメータ名と型を持つ必要があります。

衝突する Kotlin シグネチャを持つ異なるメソッドをオーバーライドするには、クラスに `@ObjCSignatureOverride` アノテーションを追加できます。このアノテーションは、Objective-C クラスから継承された、引数の型は同じだが引数の名前が異なる複数の関数がある場合に、競合するオーバーロードを無視するように Kotlin コンパイラに指示します。

デフォルトでは、Kotlin/Native コンパイラは、指定イニシャライザ（designated initializer）ではない Objective-C イニシャライザを `super()` コンストラクタとして呼び出すことを許可しません。Objective-C ライブラリで指定イニシャライザが適切にマークされていない場合、この動作は不便な場合があります。これらのコンパイラチェックを無効にするには、ライブラリの [`.def` ファイル](native-definition-file.md) に `disableDesignatedInitializerChecks = true` を追加してください。

## C の機能

ライブラリが安全でないポインタ（unsafe pointers）や構造体（structs）などのプレーンな C の機能を使用している場合の例については、[C との相互運用性](native-c-interop.md) を参照してください。

## サポートされていない機能

Kotlin プログラミング言語の一部の機能は、Objective-C または Swift のそれぞれの機能にまだマッピングされていません。現在、以下の機能は生成されたフレームワークヘッダーに適切に公開されていません：

* インラインクラス（引数は、基になるプリミティブ型または `id` のいずれかとしてマッピングされます）
* 標準の Kotlin コレクションインターフェース（`List`、`Map`、`Set`）を実装するカスタムクラスおよびその他の特別なクラス
* Objective-C クラスの Kotlin サブクラス