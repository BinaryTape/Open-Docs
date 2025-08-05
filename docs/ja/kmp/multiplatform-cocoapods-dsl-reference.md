[//]: # (title: CocoaPods GradleプラグインのDSLリファレンス)

<tldr>

* Podの依存関係を追加する前に、[初期設定を完了](multiplatform-cocoapods-overview.md#set-up-an-environment-to-work-with-cocoapods)してください。
* [異なるPodの依存関係がKotlinプロジェクトでセットアップされているサンプルプロジェクト](https://github.com/Kotlin/kmp-with-cocoapods-multitarget-xcode-sample)を参照してください。
* [複数のターゲットを持つXcodeプロジェクトがKotlinライブラリに依存しているサンプルプロジェクト](https://github.com/Kotlin/kmp-with-cocoapods-multitarget-xcode-sample)を確認してください。

</tldr>

Kotlin CocoaPods Gradleプラグインは、Podspecファイルを作成するためのツールです。これらのファイルは、Kotlinプロジェクトを[CocoaPods依存関係マネージャー](https://cocoapods.org/)と統合するために必要です。

このDSLリファレンスでは、CocoaPods統合をセットアップする際に使用できるKotlin CocoaPods Gradleプラグインの主なブロック、関数、プロパティをリストアップしています。

## プラグインを有効にする

CocoaPodsプラグインを適用するには、`build.gradle(.kts)`ファイルに以下の行を追加します。

```kotlin
plugins {
   kotlin("multiplatform") version "%kotlinVersion%"
   kotlin("native.cocoapods") version "%kotlinVersion%"
}
```

プラグインのバージョンは[Kotlinのリリースバージョン](https://kotlinlang.org/docs/releases.html)と一致します。最新の安定版バージョンは%kotlinVersion%です。

## `cocoapods {}`ブロック

`cocoapods {}`ブロックは、CocoaPods設定のトップレベルのブロックです。Podのバージョン、概要、ホームページなどの必須情報や、オプション機能を含むPodに関する一般的な情報が含まれています。

その中で以下のブロック、関数、プロパティを使用できます。

| **Name**                              | **Description**                                                                                                                                                                                                                  |
|---------------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `version`                             | Podのバージョン。指定されていない場合、Gradleプロジェクトのバージョンが使用されます。これらのプロパティのいずれも設定されていない場合、エラーが発生します。                                                                             |
| `summary`                             | このプロジェクトからビルドされるPodの必須の説明。                                                                                                                                                                       |
| `homepage`                            | このプロジェクトからビルドされるPodのホームページへの必須のリンク。                                                                                                                                                              |
| `authors`                             | このプロジェクトからビルドされるPodの作者を指定します。                                                                                                                                                                            |
| `podfile`                             | 既存のPodfileを設定します。                                                                                                                                                                                                 |
| `noPodspec()`                         | プラグインが`cocoapods`セクションのPodspecファイルを生成しないように設定します。                                                                                                                                                    |
| `name`                                | このプロジェクトからビルドされるPodの名前。指定されていない場合、プロジェクト名が使用されます。                                                                                                                                          |
| `license`                             | このプロジェクトからビルドされるPodのライセンス、そのタイプ、およびテキスト。                                                                                                                                                          |
| `framework`                           | フレームワークブロックは、プラグインによって生成されるフレームワークを設定します。                                                                                                                                                             |
| `source`                              | このプロジェクトからビルドされるPodの場所。                                                                                                                                                                                 |
| `extraSpecAttributes`                 | `libraries`や`vendored_frameworks`のような他のPodspec属性を設定します。                                                                                                                                                   |
| `xcodeConfigurationToNativeBuildType` | カスタムXcode構成をNativeBuildTypeにマッピングします。"Debug"を`NativeBuildType.DEBUG`に、"Release"を`NativeBuildType.RELEASE`に。                                                                                               |
| `publishDir`                          | Pod公開用の出力ディレクトリを設定します。                                                                                                                                                                              |
| `pods`                                | Pod依存関係のリストを返します。                                                                                                                                                                                              |
| `pod()`                               | このプロジェクトからビルドされるPodにCocoaPodsの依存関係を追加します。                                                                                                                                                                  |
| `specRepos`                           | `url()`を使用して仕様リポジトリを追加します。これは、プライベートPodが依存関係として使用される場合に必要です。詳細については[CocoaPodsドキュメント](https://guides.cocoapods.org/making/private-cocoapods.html)を参照してください。 |

### ターゲット

| iOS                 | macOS        | tvOS                 | watchOS                 |
|---------------------|--------------|----------------------|-------------------------|
| `iosArm64`          | `macosArm64` | `tvosArm64`          | `watchosArm64`          |
| `iosX64`            | `macosX64`   | `tvosX64`            | `watchosX64`            |
| `iosSimulatorArm64` |              | `tvosSimulatorArm64` | `watchosSimulatorArm64` |
|                     |              |                      | `watchosArm32`          |
|                     |              |                      | `watchosDeviceArm64`    |

各ターゲットについて、`deploymentTarget`プロパティを使用してPodライブラリの最小ターゲットバージョンを指定します。

適用されると、CocoaPodsは`debug`および`release`の両方のフレームワークをすべてのターゲットの出力バイナリとして追加します。

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

### `framework {}`ブロック

`framework {}`ブロックは`cocoapods`内にネストされており、プロジェクトからビルドされるPodのフレームワークプロパティを設定します。

> `baseName`は必須フィールドであることに注意してください。
>
{style="note"}

| **Name**           | **Description**                                                                         |
|--------------------|-----------------------------------------------------------------------------------------|
| `baseName`         | 必須のフレームワーク名。非推奨の`frameworkName`の代わりにこのプロパティを使用してください。 |
| `isStatic`         | フレームワークのリンクタイプを定義します。デフォルトでは動的です。                            |
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

## `pod()`関数

`pod()`関数呼び出しは、このプロジェクトからビルドされるPodにCocoaPodsの依存関係を追加します。各依存関係には個別の関数呼び出しが必要です。

関数パラメータでPodライブラリの名前を、設定ブロックでライブラリの`version`や`source`などの追加のパラメータ値を指定できます。

| **Name**                     | **Description**                                                                                                                                                                                                                                                                                    |
|------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `version`                    | ライブラリのバージョン。ライブラリの最新バージョンを使用するには、パラメータを省略します。                                                                                                                                                                                                                 |
| `source`                     | Podを以下から設定します。<list><li>`git()`を使用したGitリポジトリ。`git()`の後のブロックで、特定のコミットを使用するために`commit`を、特定のタグを使用するために`tag`を、リポジトリの特定のブランチを使用するために`branch`を指定できます。</li><li>`path()`を使用したローカルリポジトリ。</li></list> |
| `packageName`                | パッケージ名を指定します。                                                                                                                                                                                                                                                                        |
| `extraOpts`                  | Podライブラリのオプションのリストを指定します。例えば、特定のフラグ：<code-block lang="Kotlin">extraOpts = listOf("-compiler-option")</code-block>                                                                                                                                        |
| `linkOnly`                   | CocoaPodsプラグインに、cinteropバインディングを生成せずに動的フレームワークを持つPodの依存関係を使用するように指示します。静的フレームワークで使用された場合、このオプションはPodの依存関係を完全に削除します。                                                                                           |
| `interopBindingDependencies` | 他のPodへの依存関係のリストを含みます。このリストは新しいPodのKotlinバインディングをビルドする際に使用されます。                                                                                                                                                                                   |
| `useInteropBindingFrom()`    | 依存関係として使用される既存のPodの名前を指定します。このPodは関数実行前に宣言されている必要があります。この関数はCocoaPodsプラグインに、新しいPodのバインディングをビルドする際に既存のPodのKotlinバインディングを使用するように指示します。                                     |

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

## 次のステップ

* [Kotlin GradleプラグインリポジトリでKotlin DSLの完全な構文を参照する](https://github.com/JetBrains/kotlin/blob/master/libraries/tools/kotlin-gradle-plugin/src/common/kotlin/org/jetbrains/kotlin/gradle/targets/native/cocoapods/CocoapodsExtension.kt)
* [KotlinプロジェクトでPodライブラリへの依存関係を追加する](multiplatform-cocoapods-libraries.md)
* [KotlinプロジェクトとXcodeプロジェクト間の依存関係をセットアップする](multiplatform-cocoapods-xcode.md)