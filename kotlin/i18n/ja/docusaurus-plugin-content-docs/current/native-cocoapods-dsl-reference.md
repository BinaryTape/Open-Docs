---
title: "CocoaPods Gradle plugin DSL リファレンス"
---
Kotlin CocoaPods Gradle plugin は、Podspec ファイルを作成するためのツールです。これらのファイルは、Kotlin プロジェクトを [CocoaPods 依存関係マネージャー](https://cocoapods.org/)と統合するために必要です。

このリファレンスには、[CocoaPods 統合](native-cocoapods)を使用する際に使用できる Kotlin CocoaPods Gradle plugin のブロック、関数、およびプロパティの完全なリストが含まれています。

* [環境をセットアップし、Kotlin CocoaPods Gradle plugin を構成する](native-cocoapods)方法を学びます。
* プロジェクトと目的に応じて、[Kotlin プロジェクトと Pod ライブラリ](native-cocoapods-libraries)間、および[Kotlin Gradle プロジェクトと Xcode プロジェクト](native-cocoapods-xcode)間に依存関係を追加できます。

## plugin を有効にする

CocoaPods plugin を適用するには、次の行を `build.gradle(.kts)` ファイルに追加します。

```kotlin
plugins {
   kotlin("multiplatform") version "2.1.20"
   kotlin("native.cocoapods") version "2.1.20"
}
```

plugin のバージョンは、[Kotlin リリースバージョン](releases)と一致します。最新の安定バージョンは 2.1.20 です。

## cocoapods ブロック

`cocoapods` ブロックは、CocoaPods 構成の最上位ブロックです。これには、Pod のバージョン、概要、ホームページなどの必須情報や、オプション機能など、Pod に関する一般的な情報が含まれています。

内部では、次のブロック、関数、およびプロパティを使用できます。

| **Name**                              | **Description**                                                                                                                                                                                                                  | 
|---------------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `version`                             | Pod のバージョン。これが指定されていない場合、Gradle プロジェクトのバージョンが使用されます。これらのプロパティのいずれも構成されていない場合は、エラーが発生します。                                                                             |
| `summary`                             | このプロジェクトから構築された Pod の必須の説明。                                                                                                                                                                       |
| `homepage`                            | このプロジェクトから構築された Pod のホームページへの必須リンク。                                                                                                                                                              |
| `authors`                             | このプロジェクトから構築された Pod の作成者を指定します。                                                                                                                                                                            |
| `podfile`                             | 既存の `Podfile` ファイルを構成します。                                                                                                                                                                                          |
| `noPodspec()`                         | `cocoapods` セクションの Podspec ファイルを生成しないように plugin を設定します。                                                                                                                                                    |
| `name`                                | このプロジェクトから構築された Pod の名前。指定されていない場合、プロジェクト名が使用されます。                                                                                                                                          |
| `license`                             | このプロジェクトから構築された Pod のライセンス、そのタイプ、およびテキスト。                                                                                                                                                          |
| `framework`                           | framework ブロックは、plugin によって生成される framework を構成します。                                                                                                                                                             |
| `source`                              | このプロジェクトから構築された Pod の場所。                                                                                                                                                                                 |
| `extraSpecAttributes`                 | `libraries` や `vendored_frameworks` などの他の Podspec 属性を構成します。                                                                                                                                                   |
| `xcodeConfigurationToNativeBuildType` | カスタム Xcode 構成を NativeBuildType にマッピングします: "Debug" を `NativeBuildType.DEBUG` に、"Release" を `NativeBuildType.RELEASE` に。                                                                                               |
| `publishDir`                          | Pod 公開用の出力ディレクトリを構成します。                                                                                                                                                                              |
| `pods`                                | Pod 依存関係のリストを返します。                                                                                                                                                                                              |
| `pod()`                               | CocoaPods 依存関係をこのプロジェクトから構築された Pod に追加します。                                                                                                                                                                  |
| `specRepos`                           | `url()` を使用して仕様リポジトリを追加します。これは、プライベート Pod が依存関係として使用される場合に必要です。詳細については、[CocoaPods のドキュメント](https://guides.cocoapods.org/making/private-cocoapods.html)を参照してください。 |

### Targets

| iOS                 | macOS        | tvOS                 | watchOS                 |
|---------------------|--------------|----------------------|-------------------------|
| `iosArm64`          | `macosArm64` | `tvosArm64`          | `watchosArm64`          |
| `iosX64`            | `macosX64`   | `tvosX64`            | `watchosX64`            |
| `iosSimulatorArm64` |              | `tvosSimulatorArm64` | `watchosSimulatorArm64` |
|                     |              |                      | `watchosArm32`          |
|                     |              |                      | `watchosDeviceArm64`    |

ターゲットごとに、`deploymentTarget` プロパティを使用して、Pod ライブラリの最小ターゲットバージョンを指定します。

適用されると、CocoaPods は `debug` および `release` framework の両方をすべてのターゲットの出力バイナリとして追加します。

```kotlin
kotlin {
    iosArm64()
   
    cocoapods {
        version = "2.0"
        name = "MyCocoaPod"
        summary = "CocoaPods test library"
        homepage = "https://github.com/JetBrains/kotlin"
        
        extraSpecAttributes["vendored_frameworks"] = 'CustomFramework.xcframework'
        license = "{ :type => 'MIT', :text => 'License text'}"
        source = "{ :git => 'git@github.com:vkormushkin/kmmpodlibrary.git', :tag => '$version' }"
        authors = "Kotlin Dev"
        
        specRepos {
            url("https://github.com/Kotlin/kotlin-cocoapods-spec.git")
        }
        pod("example")
        
        xcodeConfigurationToNativeBuildType["CUSTOM_RELEASE"] = NativeBuildType.RELEASE
   }
}
```

### framework ブロック

`framework` ブロックは `cocoapods` の内部にネストされており、プロジェクトから構築された Pod の framework プロパティを構成します。

:::note
`baseName` は必須フィールドであることに注意してください。

:::

| **Name**           | **Description**                                                                         | 
|--------------------|-----------------------------------------------------------------------------------------|
| `baseName`         | 必須の framework 名。非推奨の `frameworkName` の代わりにこのプロパティを使用してください。 |
| `isStatic`         | framework のリンクタイプを定義します。デフォルトでは動的です。                            |
| `transitiveExport` | 依存関係のエクスポートを有効にします。                                                              |                                                      

```kotlin
kotlin {
    cocoapods {
        version = "2.0"
        framework {
            baseName = "MyFramework"
            isStatic = false
            export(project(":anotherKMMModule"))
            transitiveExport = true
        }
    }
}
```

## pod() 関数

`pod()` 関数呼び出しは、CocoaPods 依存関係をこのプロジェクトから構築された Pod に追加します。各依存関係には、個別の関数呼び出しが必要です。

関数パラメータで Pod ライブラリの名前を指定し、ライブラリの `version` や `source` などの追加パラメータ値をその構成ブロックで指定できます。

| **Name**                     | **Description**                                                                                                                                                                                                                                                                                    | 
|------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `version`                    | ライブラリのバージョン。ライブラリの最新バージョンを使用するには、パラメータを省略します。                                                                                                                                                                                                                 |
| `source`                     | Pod の構成元: <list><li>`git()` を使用した Git リポジトリ。 `git()` の後のブロックで、リポジトリから特定のコミットを使用する `commit`、特定のタグを使用する `tag`、特定のブランチを使用する `branch` を指定できます</li><li>`path()` を使用したローカルリポジトリ</li></list> |
| `packageName`                | パッケージ名を指定します。                                                                                                                                                                                                                                                                        |
| `extraOpts`                  | Pod ライブラリのオプションのリストを指定します。たとえば、特定のフラグ: ```Kotlin
extraOpts = listOf("-compiler-option")
```                                                                                                                                        |
| `linkOnly`                   | cinterop バインディングを生成せずに、動的 framework を持つ Pod 依存関係を使用するように CocoaPods plugin に指示します。静的 framework で使用すると、このオプションは Pod 依存関係を完全に削除します。                                                                                           |
| `interopBindingDependencies` | 他の Pod への依存関係のリストが含まれています。このリストは、新しい Pod の Kotlin バインディングを構築するときに使用されます。                                                                                                                                                                                   |
| `useInteropBindingFrom()`    | 依存関係として使用される既存の Pod の名前を指定します。この Pod は、関数実行の前に宣言する必要があります。この関数は、新しい Pod のバインディングを構築するときに、既存の Pod の Kotlin バインディングを使用するように CocoaPods plugin に指示します。                                     |

```kotlin
kotlin {
    iosArm64()
    cocoapods {
        version = "2.0"
        summary = "CocoaPods test library"
        homepage = "https://github.com/JetBrains/kotlin"

        ios.deploymentTarget = "16.0"
      
        pod("pod_dependency") {
            version = "1.0"
            extraOpts += listOf("-compiler-option")
            linkOnly = true
            source = path(project.file("../pod_dependency"))
        }
    }
}
```