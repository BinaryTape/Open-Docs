[//]: # (title: CocoaPods GradleプラグインDSLリファレンス)

<tldr>

*   Pod依存関係を追加する前に、[初期設定を完了](multiplatform-cocoapods-overview.md#set-up-an-environment-to-work-with-cocoapods)してください。
*   Kotlinプロジェクトに[異なるPod依存関係が設定されたサンプルプロジェクトを参照](https://github.com/Kotlin/kmp-with-cocoapods-multitarget-xcode-sample)してください。
*   複数のターゲットを持つXcodeプロジェクトが[Kotlinライブラリに依存しているサンプルプロジェクトを確認](https://github.com/Kotlin/kmp-with-cocoapods-multitarget-xcode-sample)してください。

</tldr>
<show-structure for="chapter,procedure" depth="2"/>

Kotlin CocoaPods Gradleプラグインは、Podspecファイルを作成するためのツールです。これらのファイルは、Kotlinプロジェクトを[CocoaPods依存関係マネージャー](https://cocoapods.org/)と統合するために必要です。

このDSLリファレンスでは、CocoaPods統合を設定する際に使用できるKotlin CocoaPods Gradleプラグインの主要なブロック、関数、およびプロパティを一覧表示します。

## プラグインを有効にする

CocoaPodsプラグインを適用するには、`build.gradle(.kts)`ファイルに以下の行を追加します。

```kotlin
plugins {
   kotlin("multiplatform") version "%kotlinVersion%"
   kotlin("native.cocoapods") version "%kotlinVersion%"
}
```

プラグインのバージョンは[Kotlinのリリースバージョン](https://kotlinlang.org/docs/releases.html)と一致します。最新の安定バージョンは%kotlinVersion%です。

## `cocoapods {}`ブロック

`cocoapods {}`ブロックは、CocoaPods設定のトップレベルのブロックです。これには、Podのバージョン、概要、ホームページなどの必須情報や、オプション機能など、Podに関する一般的な情報が含まれます。

その中で以下のブロック、関数、プロパティを使用できます。

| **名前**                              | **説明**                                                                                                                                                                                                                  |
|:--------------------------------------|:-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `version`                             | Podのバージョン。指定されていない場合はGradleプロジェクトのバージョンが使用されます。これらのプロパティのいずれも設定されていない場合、エラーが発生します。                                                                             |
| `summary`                             | このプロジェクトからビルドされるPodの必須の概要。                                                                                                                                                                       |
| `homepage`                            | このプロジェクトからビルドされるPodのホームページへの必須のリンク。                                                                                                                                                              |
| `authors`                             | このプロジェクトからビルドされるPodの著者（複数可）を指定します。                                                                                                                                                                            |
| `podfile`                             | 既存のPodfileを設定します。                                                                                                                                                                                                 |
| `noPodspec()`                         | `cocoapods`セクションに対してPodspecファイルを生成しないようにプラグインを設定します。                                                                                                                                                    |
| `name`                                | このプロジェクトからビルドされるPodの名前。指定されていない場合はプロジェクト名が使用されます。                                                                                                                                          |
| `license`                             | このプロジェクトからビルドされるPodのライセンス、その種類、およびテキスト。                                                                                                                                                          |
| `framework`                           | フレームワークブロックは、プラグインによって生成されるフレームワークを設定します。                                                                                                                                                             |
| `source`                              | このプロジェクトからビルドされるPodの場所。                                                                                                                                                                                 |
| `extraSpecAttributes`                 | `libraries`や`vendored_frameworks`のような他のPodspec属性を設定します。                                                                                                                                                   |
| `xcodeConfigurationToNativeBuildType` | カスタムXcode設定をNativeBuildTypeにマッピングします: "Debug"を`NativeBuildType.DEBUG`に、"Release"を`NativeBuildType.RELEASE`に。                                                                                               |
| `publishDir`                          | Pod公開用の出力ディレクトリを設定します。                                                                                                                                                                              |
| `pods`                                | Pod依存関係のリストを返します。                                                                                                                                                                                              |
| `pod()`                               | このプロジェクトからビルドされるPodにCocoaPods依存関係を追加します。                                                                                                                                                                  |
| `specRepos`                           | `url()`を使用して仕様リポジトリを追加します。これはプライベートなPodが依存関係として使用される場合に必要です。[CocoaPodsドキュメント](https://guides.cocoapods.org/making/private-cocoapods.html)を参照してください。 |

### ターゲット

| iOS                 | macOS        | tvOS                 | watchOS                 |
|:--------------------|:-------------|:---------------------|:------------------------|
| `iosArm64`          | `macosArm64` | `tvosArm64`          | `watchosArm64`          |
| `iosX64`            | `macosX64`   | `tvosX64`            | `watchosX64`            |
| `iosSimulatorArm64` |              | `tvosSimulatorArm64` | `watchosSimulatorArm64` |
|                     |              |                      | `watchosArm32`          |
|                     |              |                      | `watchosDeviceArm64`    |

各ターゲットについて、`deploymentTarget`プロパティを使用してPodライブラリの最小ターゲットバージョンを指定します。

適用されると、CocoaPodsは`debug`および`release`フレームワークの両方をすべてのターゲットの出力バイナリとして追加します。

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

`framework {}`ブロックは`cocoapods`の中にネストされており、プロジェクトからビルドされるPodのフレームワークプロパティを設定します。

> `baseName`は必須フィールドであることに注意してください。
>
{style="note"}

| **名前**           | **説明**                                                                         |
|:-------------------|:-----------------------------------------------------------------------------------------|
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

`pod()`関数呼び出しは、このプロジェクトからビルドされるPodにCocoaPods依存関係を追加します。各依存関係には個別の関数呼び出しが必要です。

関数パラメータでPodライブラリの名前を、その設定ブロックでライブラリの`version`や`source`のような追加のパラメータ値を指定できます。

| **名前**                     | **説明**                                                                                                                                                                                                                                                                                    |
|:-----------------------------|:------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `version`                    | ライブラリのバージョン。ライブラリの最新バージョンを使用するには、パラメータを省略します。                                                                                                                                                                                                                 |
| `source`                     | Podを以下から設定します: <list><li>`git()`を使用してGitリポジトリから。`git()`後のブロックでは、特定のコミットを使用するために`commit`を、特定のタグを使用するために`tag`を、リポジトリの特定のブランチを使用するために`branch`を指定できます。</li><li>`path()`を使用してローカルリポジトリから。</li></list> |
| `packageName`                | パッケージ名を指定します。                                                                                                                                                                                                                                                                        |
| `extraOpts`                  | Podライブラリのオプションのリストを指定します。例として、特定のフラグ: <code-block lang="Kotlin" code="extraOpts = listOf(&quot;-compiler-option&quot;)"/>                                                                                                                                        |
| `linkOnly`                   | CocoaPodsプラグインに、cinteropバインディングを生成せずに動的フレームワークを持つPod依存関係を使用するように指示します。静的フレームワークで使用された場合、このオプションはPod依存関係を完全に削除します。                                                                                           |
| `interopBindingDependencies` | 他のPodへの依存関係のリストが含まれます。このリストは、新しいPodのKotlinバインディングを構築する際に使用されます。                                                                                                                                                                                   |
| `useInteropBindingFrom()`    | 依存関係として使用される既存のPodの名前を指定します。このPodは、関数実行前に宣言されている必要があります。この関数は、新しいPodのバインディングを構築する際に、既存のPodのKotlinバインディングを使用するようにCocoaPodsプラグインに指示します。                                     |

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

## 次は何ですか

*   [Kotlin GradleプラグインリポジトリでKotlin DSLの完全な構文を参照する](https://github.com/JetBrains/kotlin/blob/master/libraries/tools/kotlin-gradle-plugin/src/common/kotlin/org/jetbrains/kotlin/gradle/targets/native/cocoapods/CocoapodsExtension.kt)
*   [KotlinプロジェクトでPodライブラリへの依存関係を追加する](multiplatform-cocoapods-libraries.md)
*   [KotlinプロジェクトとXcodeプロジェクト間の依存関係を設定する](multiplatform-cocoapods-xcode.md)