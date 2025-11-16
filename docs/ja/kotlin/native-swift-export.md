[//]: # (title: Swift export を用いた Swift との相互運用)

<primary-label ref="experimental-general"/>

Kotlin は Swift export の実験的なサポートを提供します。これにより、Kotlin ソースを直接エクスポートし、Objective-C ヘッダーの必要性を排除して、Swift から Kotlin コードを慣用的に呼び出すことができます。

Swift export は、Apple ターゲット向けのマルチプラットフォーム開発をより効率的にします。例えば、トップレベル関数を持つ Kotlin モジュールがある場合、Swift export はクリーンでモジュール固有のインポートを可能にし、Objective-C の紛らわしいアンダースコアやマングルされた名前を排除します。

現在の Swift export の機能は以下のとおりです。

*   **マルチモジュールサポート**。各 Kotlin モジュールは独立した Swift モジュールとしてエクスポートされ、関数呼び出しを簡素化します。
*   **パッケージサポート**。Kotlin パッケージはエクスポート中に明示的に保持され、生成される Swift コードでの名前の競合を回避します。
*   **型エイリアス**。Kotlin の型エイリアスは Swift でエクスポートおよび保持され、可読性を向上させます。
*   **プリミティブ型の null 許容性の強化**。`Int?` のような型を `KotlinInt` のようなラッパークラスにボックス化して null 許容性を保持する必要があった Objective-C の相互運用とは異なり、Swift export は null 許容性情報を直接変換します。
*   **オーバーロード**。Kotlin のオーバーロードされた関数を Swift から曖昧さなく呼び出すことができます。
*   **フラット化されたパッケージ構造**。Kotlin パッケージを Swift の enum に変換し、生成される Swift コードからパッケージプレフィックスを削除できます。
*   **モジュール名のカスタマイズ**。Kotlin プロジェクトの Gradle 設定で、結果として得られる Swift モジュール名をカスタマイズできます。

## Swift export を有効にする

この機能は現在 [実験的](components-stability.md#stability-levels-explained) であり、本番環境での使用には適していません。試用するには、Kotlin プロジェクトで [ビルドファイルを構成](#configure-kotlin-project) し、Swift export を統合するように [Xcode をセットアップ](#configure-xcode-project) してください。

### Kotlin プロジェクトの構成

Swift export をセットアップするための開始点として、プロジェクトで以下のビルドファイルを使用できます。

```kotlin
// build.gradle.kts
kotlin {

    iosArm64()
    iosSimulatorArm64()

    swiftExport {
        // Set the root module name
        moduleName = "Shared"

        // Set the collapse rule
        // Removes package prefix from generated Swift code
        flattenPackage = "com.example.sandbox"

        // Configure external modules export
        export(project(":subproject")) {
            // Set the name for the exported module 
            moduleName = "Subproject"
            // Set the collapse rule for the exported dependency 
            flattenPackage = "com.subproject.library"
        }

        // Provide compiler arguments to link tasks
        configure {
            freeCompilerArgs.add("-Xexpect-actual-classes")
        }
    }
}
```

Kotlin コンパイラは、必要なすべてのファイル（`swiftmodule` ファイル、静的 `.a` ライブラリ、ヘッダーファイル、`modulemap` ファイルを含む）を自動的に生成し、アプリのビルドディレクトリにコピーします。これは Xcode からアクセスできます。

> Swift export がすでにセットアップされている [公開サンプル](https://github.com/Kotlin/swift-export-sample) をクローンすることもできます。
>
{style="tip"}

### Xcode プロジェクトの構成

Xcode を構成して Swift export をプロジェクトに統合するには：

1.  Xcode で、プロジェクト設定を開きます。
2.  **Build Phases** タブで、`embedAndSignAppleFrameworkForXcode` タスクを含む **Run Script** フェーズを見つけます。
3.  実行スクリプトフェーズで、スクリプトを `embedSwiftExportForXcode` タスクに置き換えます。

   ```bash
   ./gradlew :<Shared module name>:embedSwiftExportForXcode
   ```

   ![Swift export スクリプトを追加](xcode-swift-export-run-script-phase.png){width=700}

4.  プロジェクトをビルドします。ビルドにより、出力ディレクトリに Swift モジュールが生成されます。

## 現在の制限事項

Swift export は現在、iOS フレームワークを Xcode プロジェクトに接続するために [直接統合](https://kotlinlang.org/docs/multiplatform/multiplatform-direct-integration.html) を使用するプロジェクトでのみ機能します。
これは、IntelliJ IDEA の Kotlin Multiplatform プラグイン、または [Web ウィザード](https://kmp.jetbrains.com/) を介して作成された Kotlin Multiplatform プロジェクトの標準的な構成です。

その他の既知の課題：

*   Gradle の座標でモジュールが同じ名前を持つ場合（例：SQLDelight の Runtime モジュールと Compose Runtime モジュール）、Swift export が機能しなくなります ([KT-80185](https://youtrack.jetbrains.com/issue/KT-80185))。
*   `List`、`Set`、または `Map` を継承する型は、エクスポート中に無視されます ([KT-80416](https://youtrack.jetbrains.com/issue/KT-80416))。
*   `List`、`Set`、または `Map` の継承型は、Swift 側でインスタンス化できません ([KT-80417](https://youtrack.jetbrains.com/issue/KT-80417))。
*   Swift にエクスポートされる際、Kotlin のジェネリック型パラメータは、その上限型に型消去されます。
*   Swift のクロージャは Kotlin に渡すことができますが、Kotlin は関数型を Swift にエクスポートできません。
*   クロス言語継承はサポートされていないため、Swift クラスは Kotlin からエクスポートされたクラスやインターフェースを直接サブクラス化できません。
*   IDE の移行に関するヒントや自動化機能は利用できません。
*   オプトインが必要な宣言を使用する場合、Gradle ビルドファイルに _モジュールレベル_ で明示的な `optIn` コンパイラオプションを追加する必要があります。例えば、`kotlinx.datetime` ライブラリの場合：

  ```kotlin
  swiftExport {
      moduleName = "Shared"

      export("org.jetbrains.kotlinx:kotlinx-datetime:%dateTimeVersion%") {
          moduleName = "KotlinDateTime"
          flattenPackage = "kotlinx.datetime"
      }
  }

  // Add a separate opt-in block at the module level
  compilerOptions {
      optIn.add("kotlin.time.ExperimentalTime")
  }
  ```

## マッピング

以下の表は、Kotlin の概念が Swift にどのようにマッピングされるかを示しています。

| Kotlin         | Swift                        | 注                      |
| :------------- | :--------------------------- | :---------------------- |
| `class`        | `class`                      | [注](#classes)          |
| `object`       | `class` with `shared` property | [注](#objects)          |
| `typealias`    | `typealias`                  | [注](#type-aliases)     |
| 関数           | 関数                         | [注](#functions)        |
| プロパティ     | プロパティ                   | [注](#properties)       |
| コンストラクタ | イニシャライザ               | [注](#constructors)     |
| パッケージ     | ネストされた enum            | [注](#packages)         |
| `Boolean`      | `Bool`                       |                         |
| `Char`         | `Unicode.UTF16.CodeUnit`     |                         |
| `Byte`         | `Int8`                       |                         |
| `Short`        | `Int16`                      |                         |
| `Int`          | `Int32`                      |                         |
| `Long`         | `Int64`                      |                         |
| `UByte`        | `UInt8`                      |                         |
| `UShort`       | `UInt16`                     |                         |
| `UInt`         | `UInt32`                     |                         |
| `ULong`        | `UInt64`                     |                         |
| `Float`        | `Float`                      |                         |
| `Double`       | `Double`                     |                         |
| `Any`          | `KotlinBase` クラス          |                         |
| `Unit`         | `Void`                       |                         |
| `Nothing`      | `Never`                      | [注](#kotlin-nothing)   |

### 宣言

#### クラス

Swift export は、`class Foo()` のように `Any` を直接継承する final クラスのみをサポートします。
これらは、特別な `KotlinBase` クラスを継承する Swift クラスに変換されます。

```kotlin
// Kotlin
class MyClass {
    val property: Int = 0

    fun method() {}
}
```

```swift
// Swift
public class MyClass : KotlinRuntime.KotlinBase {
    public var property: Swift.Int32 {
        get {
            // ...
        }
    }
    public override init() {
        // ...
    }
    public func method() -> Swift.Void {
        // ...
    }
}
```

#### オブジェクト

オブジェクトは、private な `init` と static な `shared` アクセサーを持つ Swift クラスに変換されます。

```kotlin
// Kotlin
object O
```

```swift
// Swift
public class O : KotlinRuntime.KotlinBase {
    public static var shared: O {
        get {
            // ...
        }
    }
    private override init() {
        // ...
    }
}
```

#### 型エイリアス

Kotlin の型エイリアスはそのままエクスポートされます。

```kotlin
// Kotlin
typealias MyInt = Int
```

```swift
// Swift
public typealias MyInt = Swift.Int32
```

#### 関数

Swift export は、単純なトップレベル関数とメソッドをサポートします。

```kotlin
// Kotlin
fun foo(a: Short, b: Bar) {}

fun baz(): Long = 0
```

```swift
// Swift
public func foo(a: Swift.Int16, b: Bar) -> Swift.Void {
    // ...
}

public func baz() -> Swift.Int64 {
    // ...
}
```

拡張関数もサポートされます。拡張関数のレシーバーパラメータは、通常のパラメータの最初の位置に移動されます。

```kotlin
// Kotlin
fun Int.foo(): Unit = TODO()
```

```swift
// Swift
func foo(_ receiver: Int32) {}
```

`suspend`、`inline`、`operator` キーワードを持つ関数はサポートされていません。

#### プロパティ

Kotlin のプロパティは Swift のプロパティに変換されます。

```kotlin
// Kotlin
val a: Int = 0

var b: Short = 15

const val c: Int = 0
```

```swift
// Swift
public var a: Swift.Int32 {
    get {
        // ...
    }
}
public var b: Swift.Int16 {
    get {
        // ...
    }
    set {
        // ...
    }
}
public var c: Swift.Int32 {
    get {
        // ...
    }
}
```

#### コンストラクタ

コンストラクタは Swift のイニシャライザに変換されます。

```kotlin
// Kotlin
class Foo(val prop: Int)
```

```swift
// Swift
public class Foo : KotlinRuntime.KotlinBase {
    public init(
        prop: Swift.Int32
    ) {
        // ...
    }
}
```

### 型

#### kotlin.Nothing

Kotlin の `Nothing` 型は `Never` 型に変換されます。

```kotlin
// Kotlin
fun foo(): Nothing = TODO()

fun baz(input: Nothing) {}
```

```swift
// Swift
public func foo() -> Swift.Never {
    // ...
}

public func baz(input: Swift.Never) -> Void {
    // ...
}
```

#### 分類子型

Swift export は現在、`Any` を直接継承する final クラスのみをサポートします。

### パッケージ

Kotlin パッケージは、名前の衝突を避けるためにネストされた Swift の enum に変換されます。

```kotlin
// Kotlin
// bar.kt file in foo.bar package
fun callMeMaybe() {}
```

```kotlin
// Kotlin
// baz.kt file in foo.baz package
fun callMeMaybe() {}
```

```swift
// Swift
public extension foo.bar {
    public func callMeMaybe() {}
}

public extension foo.baz {
    public func callMeMaybe() {}
}

public enum foo {
    public enum bar {}

    public enum baz {}
}
```

## Swift export の進化

将来の Kotlin リリースでは、コルーチンとフローを中心に、Kotlin と Swift 間の相互運用性を向上させながら、Swift export を拡張し、段階的に安定化させていく予定です。

フィードバックを残すことができます。

*   Kotlin Slack にて – [招待を取得](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up?_gl=1*ju6cbn*_ga*MTA3MTk5NDkzMC4xNjQ2MDY3MDU4*_ga_9J976DJZ68*MTY1ODMzNzA3OS4xMDAuMS4xNjU4MzQwODEwLjYw) し、[#swift-export](https://kotlinlang.slack.com/archives/C073GUW6WN9) チャンネルに参加してください。
*   [YouTrack](https://kotl.in/issue) で問題を報告してください。