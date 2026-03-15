[//]: # (title: SwiftパッケージをKMPモジュールの依存関係として追加する)
<primary-label ref="Experimental"/>

<tldr>
   <p>Swift Package Manager (SwiftPM) は CocoaPods と同じ役割を果たします。
   これにより、iOS アプリのネイティブ iOS 依存関係を透過的にオーケストレート（管理）できます。</p>
   <p>ここでは、KMP プロジェクトで SwiftPM 依存関係をセットアップする方法と、必要に応じて KMP のセットアップを CocoaPods から SwiftPM へ移行する方法について説明します。</p>
</tldr>

> この機能は[試験的（Experimental）](https://kotlinlang.org/docs/components-stability.html#stability-levels-explained)であり、本番環境での使用を意図したものではありません。
> 発生した問題やフィードバックは、専用の Kotlin Slack チャンネル [#kmp-swift-package-manager](https://kotlinlang.slack.com/archives/C09TW68099C) で共有してください。
>
{style="warning"}

SwiftPM インポート統合を備えた Kotlin Gradle プラグインを使用すると、Apple ターゲットに対して宣言された SwiftPM 依存関係を使用して、Objective-C および Swift コードから Objective-C API をインポートできます。

推移的依存関係（SwiftPM インポートを使用するプロジェクトに依存するプロジェクト）の場合、Kotlin Gradle プラグインは SwiftPM 依存関係から必要なマシンコードを自動的に提供します。
例えば、Kotlin/Native テストの実行やフレームワークのリンク時に、追加の設定を行う必要はありません。

> SwiftPM インポートを使用する KMP モジュール自体を Swift パッケージとして[エクスポート](multiplatform-spm-export.md)することは、まだサポートされておらず、動作しない可能性があります。
> 詳細については、こちらの [YouTrack イシュー](https://youtrack.jetbrains.com/issue/KT-84420) を参照し、あなたのユースケースについてお知らせください。
>
{style="note"}

プロジェクトを構成するには：

1. [開発環境のセットアップ](#set-up-environment)
2. [KMP モジュールへの SwiftPM 依存関係の追加](#add-and-call-swiftpm-dependencies)
3. [インポートされた API の Kotlin コードでの使用](#use-imported-apis)

## 開発環境のセットアップ

SwiftPM インポート機能を試すには、Kotlin の特定の開発バージョンを使用する必要があります。
このバージョンは本番環境用ではないことに注意してください。
<!-- This will be invalidated when 2.4.0-Beta1 comes out. This is when we specify the feature stability level and change the page label. -->

Kotlin Multiplatform Gradle プラグインをセットアップするには：

1. `settings.gradle.kts` ファイルで、依存関係とプラグインの開発用パッケージリポジトリを追加します。

    ```kotlin
    dependencyResolutionManagement {
        repositories {
            maven("https://packages.jetbrains.team/maven/p/kt/dev")
            mavenCentral()
        }
    }

    pluginManagement {
        repositories {
            maven("https://packages.jetbrains.team/maven/p/kt/dev")
            mavenCentral()
            gradlePluginPortal()
        }
    }
    ```

2. バージョンカタログで、Kotlin Multiplatform Gradle プラグインの試験的バージョンを適用します。

    ```text
    kotlin = "%spmImport%"

    [plugins]
    kotlin-multiplatform = "%spmImport%"
    ```

3. Gradle ファイルを同期し、KMP モジュールの `build.gradle.kts` ファイルに `kotlin.swiftPMDependencies {}` ブロックを追加してみます。

   `swiftPMDependencies` 名が解決できない場合は、ルートの `build.gradle.kts` ファイルに以下のブロックを追加して、試験的な Kotlin Multiplatform Gradle プラグインのバージョンを強制してください。

    ```kotlin
    buildscript {
        dependencies.constraints {
            "classpath"("org.jetbrains.kotlin:kotlin-gradle-plugin:%spmImport%")
        }
    }
    ```

### KMP IDE プラグインのセットアップ

KMP プロジェクトに推奨される [Kotlin Multiplatform IDE プラグイン]() を使用している場合は、KMP モジュールからビルドされる iOS プロジェクトへのパスを明示的に指定してください。

`iosTarget.binaries.framework` API を呼び出す `build.gradle.kts` ファイルで、パスを設定する API 呼び出しを追加します。

```kotlin
kotlin {
    // iOS ターゲット構成の例
    listOf(
        iosArm64(),
        iosSimulatorArm64(),
        iosX64(),
    ).forEach { iosTarget ->
            iosTarget.binaries.framework { 
                baseName = "Shared"
                isStatic = false
            } 
    }

    swiftPMDependencies { 
        // :embedAndSignAppleFrameworkForXcode 統合を使用する
        // .xcodeproj ファイルへのパスを指定します
        xcodeProjectPathForKmpIJPlugin.set(
            layout.projectDirectory.file("../iosApp/iosApp.xcodeproj")
        )
    }
}
```

## SwiftPM 依存関係の追加と呼び出し

> 動作する例については、サンプルプロジェクトを参照してください。
> `master` ブランチでは各プロジェクトは CocoaPods を使用してセットアップされていますが、`spm_import` ブランチでは SwiftPM を使用しています。
> 
> * [SwiftUI と Firebase のサンプルアプリ](https://github.com/Kotlin/kmp-with-cocoapods-firebase-sample/tree/spm_import)
> * [Compose Multiplatform iOS サンプルアプリ](https://github.com/Kotlin/kmp-with-cocoapods-compose-sample/tree/spm_import)
>
{type="tip"}

### ビルドファイルの構成

特定の SwiftPM 依存関係は、Apple ターゲットが宣言されている `build.gradle.kts` ファイルの `swiftPMDependencies` ブロックに追加できます。
例えば、Firebase の場合は以下のようになります。

```kotlin
kotlin {
    iosArm64()
    iosSimulatorArm64()
    iosX64()

    swiftPMDependencies {
        // FirebaseAnalytics を Kotlin コードにインポートする
        swiftPackage(
            url = url("https://github.com/firebase/firebase-ios-sdk.git"),
            version = from("12.5.0"),
            products = listOf(product("FirebaseAnalytics")),
        )
        // swift-protobuf は Firebase の推移的依存関係であるため、
        // 特定のバージョンを使用したい場合にのみ含める必要があります
        swiftPackage(
            url = url("https://github.com/apple/swift-protobuf.git"),
            version = exact("1.32.0"),
            products = listOf(),
        )
    }
}
```

SwiftPM 統合は Clang モジュールのインポートに基づいています。
デフォルトでは、インポートメカニズムは指定された Swift パッケージ内の Clang モジュールを自動的に検出し、利用可能なすべてのモジュールを Kotlin コードからアクセス可能にします。これは Swift や Objective-C における API の可視性の仕組みに似ています。
<!-- TODO link to where it is explained? -->

デフォルトの動作と自動的なモジュール検出を無効にするには、`discoverClangModulesImplicitly` を `false` に設定します。
モジュール検出が無効な場合、SwiftPM インポートはプロダクト名を Clang モジュール名として使用します。

プロダクト名と異なる名前の Clang モジュールをインポートするには、`importedClangModules` パラメーターを使用します。例：

```kotlin
kotlin {
    swiftPMDependencies {
        // 'discoverClangModulesImplicitly' が 'true' に設定されている場合、
        // 以下の 'importedClangModules' パラメーターは無視されます
        discoverClangModulesImplicitly = false

        // インポートされるパッケージ、そのプロダクト、および Clang モジュール
        swiftPackage(
            url = url("https://github.com/firebase/firebase-ios-sdk.git"),
            version = from("12.5.0"),
            products = listOf(
                product("FirebaseAnalytics"),
                product("FirebaseFirestore")
            ),
            importedClangModules = listOf(
                "FirebaseAnalytics", 
                // FirebaseFirestore の Objective-C API は
                // 'FirebaseFirestoreInternal' Clang モジュールにあります
                "FirebaseFirestoreInternal"
            ),
        )
    }
}
```

### プラットフォーム制約の設定

一部の SwiftPM 依存関係は、ビルドスクリプト内のすべてのターゲットに対してコンパイルできなかったり、有効な API を提供できなかったりする場合があります。
例えば、Google Maps SDK は現在 iOS ターゲットのみをサポートしています。

そのため、プロジェクトが iOS のみをターゲットとしている場合は、プラットフォームを明示的に宣言する必要はありません。
しかし、macOS などの別のターゲットを追加した場合は、各依存関係に対してプラットフォーム制約を指定する必要があります。

依存関係が関連するコンパイルにのみ適用されるようにするには、`product` 指定の `platforms` パラメーターで正しいターゲットを指定します。

```kotlin
kotlin {
    iosArm64()
    iosSimulatorArm64()
    iosX64()
    macosArm64()

    swiftPMDependencies {
        swiftPackage(
            url = url("https://github.com/googlemaps/ios-maps-sdk.git"),
            version = exact("10.3.0"),
            products = listOf(
                product(
                    "GoogleMaps", 
                    platforms = setOf(
                        // `GoogleMaps` パッケージは
                        // iOS のコンパイルに対してのみ可視になります
                        iOS()
                    )
                )
            )
        ) 
    }
}
```

### インポートされた API の使用

インポートされた Objective-C API は、`swiftPMImport` プレフィックスで始まり、プロジェクトとそのグループの Gradle 名で終わる名前空間に含まれます。

例えば、Kotlin ビルドスクリプトでグループ名を以下のように指定しているとします。

```kotlin
// subproject/build.gradle.kts
group = "groupName"
```

ここで、`groupName` はプロジェクトの Gradle グループ名であり、`subproject` はプロジェクト名です。
これで、そのモジュールの `iosMain` ソースセットで Firebase API をインポートできます。

```kotlin
// subproject/src/iosMain/kotlin/useFirebaseAnalytics.kt
import swiftPMImport.groupName.subproject.FIRAnalytics
import swiftPMImport.groupName.subproject.FIRApp
```

## 追加のインポートオプション

### ローカル Swift パッケージのインポート

SwiftPM インポートメカニズムでは、ローカルファイルシステムからの Swift パッケージのインポートも可能です。

`/path/to/ExamplePackage` ディレクトリに配置された、以下のマニフェストを持つ Swift パッケージを考えてみましょう。

```swift
// /path/to/ExamplePackage/Package.swift
let package = Package(
  name: "ExamplePackage",
  platforms: [.iOS("15.0")],
  products: [
    .library(name: "ExamplePackage", targets: ["ExamplePackage"]),
  ],
  dependencies: [
    .package(url: "https://github.com/grpc/grpc-swift.git", exact: "1.27.0",),
  ],
  targets: [
    // このターゲットは @objc API を持つ Swift または Objective-C で実装可能です
    .target(name: "ExamplePackage", dependencies: [.product(name: "GRPC", package: "grpc-swift")]),
  ]
)
```
{collapsible="true" collapsed-title-line-number="3"}

これを Kotlin ビルドスクリプトにインポートするには、`localSwiftPackage` API を使用します。

```kotlin
// <projectDir>/shared/build.gradle.kts
kotlin {
    swiftPMDependencies {
        localSwiftPackage(
            directory = project.layout.projectDirectory.dir("/path/to/ExamplePackage/"),
            products = listOf("ExamplePackage")
        )
    }
}
```

Gradle ファイルを同期して SwiftPM インポートを実行し、インポートされた API を Kotlin コードで使用します。

```kotlin
// /path/to/shared/src/appleMain/kotlin/useExamplePackage.kt

@OptIn(kotlinx.cinterop.ExperimentalForeignApi::class)
fun useExamplePackage() {
    // Swift パッケージが正常にインポートされている場合、
    // IDE はクラスの正しいインポートを提案します
    HelloFromExamplePackage().hello()
}
```

### 特定のデプロイメントバージョン

依存関係により高い[デプロイメントバージョン（deployment version）](https://developer.apple.com/documentation/packagedescription/supportedplatform)が必要な場合は、`*MinimumDeploymentTarget` パラメーターで指定します。例えば、iOS の場合は以下のようになります。

```kotlin
kotlin {
    swiftPMDependencies {
        iosMinimumDeploymentTarget.set("16.0")
    }
}
```

### Swift パッケージの場所とバージョン

`Package.swift` マニフェストファイルと同様に、`swiftPackage()` 呼び出しで Swift パッケージの場所とバージョンを指定できます。それぞれに、いくつか排他的なオプションがあります。

場所を設定するには、URL または [SwiftPM レジストリ ID](https://docs.swift.org/swiftpm/documentation/packagemanagerdocs/usingswiftpackageregistry) を使用できます。

```kotlin
swiftPackage(
    // オプション 1: URL 文字列
    // パッケージの Git リポジトリを指します
    url = url("https://github.com/firebase/firebase-ios-sdk.git")

    // オプション 2: Swift パッケージレジストリ ID
    // 上記リンクのパッケージレジストリの使用に関する Apple のドキュメントを参照してください  
    repository = id("...")
)
```

バージョンを指定するには、以下の Gradle スタイルおよび Git スタイルのバージョン指定を使用します。

```kotlin
swiftPackage(
    // Gradle の 'require' バージョン制約と同様に、
    // 指定されたバージョンから開始します
    version = from("1.0")

    // Gradle の 'strict' バージョン制約と同様に、
    // 指定されたバージョンと正確に一致させます
    version = exact("2.0")

    // Git 特有のバージョン指定で、
    // 指定されたブランチまたはリビジョンに一致させます
    version = branch("master")
    // または
    version = revision("e74b07278b926c9ec6f9643455ea00d1ce04a021")
)
```

## 動的な Kotlin/Native フレームワークに関する既知の制限

現在、SwiftPM インポート統合は、動的な Kotlin/Native フレームワークを生成する際に発生する可能性のあるすべてのエッジケースをサポートしているわけではありません。Xcode でのビルド中に問題が発生したり、実行時に警告が表示されたりすることがあります。例：

* `Undefined symbols for architecture ...: "...", referenced from: ld: symbol(s) not found ...`
* `dyld: Symbol not found: ...`
* `objc[...]: Class _Foo is implemented in both /path/to/Shared and /path/to/Bar. This may cause spurious casting failures and mysterious crashes. One of the duplicates must be removed or renamed.`

これらの問題の一般的な解決策は、`isStatic` プロパティを `true` に設定してフレームワークのリンクモードを変更することです。

```kotlin
// shared/build.gradle.kts
kotlin {
    listOf(
        iosArm64(),
        iosSimulatorArm64()
    ).forEach { iosTarget ->
        iosTarget.binaries.framework {
            baseName = "Shared"

            // このプロパティを "true" に設定します
            isStatic = true
        }
    }
}
```

これらの問題のいずれかに遭遇した場合、`isStatic=false` を維持する必要がある場合、またはこのプロパティを変更してもビルドの失敗が解決しなかった場合は、Slack チャンネルでお知らせください。[招待](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up)を取得して、[#kmp-swift-package-manager](https://kotlinlang.slack.com/archives/C09TW68099C) に参加してください。

## 次のステップ

[KMP プロジェクトで CocoaPods から SwiftPM 依存関係に切り替える方法](multiplatform-cocoapods-spm-migration.md)について詳細を学びましょう。