[//]: # (title: Podライブラリへの依存関係の追加)

<tldr>

   * Podの依存関係を追加する前に、[初期設定を完了](multiplatform-cocoapods-overview.md#set-up-an-environment-to-work-with-cocoapods)させてください。
   * サンプルプロジェクトは[GitHubリポジトリ](https://github.com/Kotlin/kmp-with-cocoapods-sample)で確認できます。

</tldr>

Kotlinプロジェクトのさまざまな場所から、Podライブラリへの依存関係を追加できます。

Podへの依存関係を追加するには、共有モジュールの `build.gradle(.kts)` ファイルで `pod()` 関数を呼び出します。
各依存関係には個別の関数呼び出しが必要です。関数の設定ブロックで依存関係のパラメータを指定できます。

> CocoaPodsの統合アプローチは、[直接統合](multiplatform-direct-integration.md)で使用される `embedAndSignAppleFrameworkForXcode` メカニズムと併用することはできません。
>
{style="warning"}

* 新しい依存関係を追加してIDEでプロジェクトを再インポートすると、ライブラリは自動的に接続されます。
* KotlinプロジェクトをXcodeで使用するには、まず[プロジェクトのPodfileを変更](multiplatform-cocoapods-overview.md#update-podfile-for-xcode)してください。

> 最小デプロイターゲットバージョンを指定せず、依存するPodがより高いデプロイターゲットを必要とする場合、エラーが発生します。
>
{style="note"}

## CocoaPodsリポジトリから

CocoaPodsリポジトリにあるPodライブラリへの依存関係を追加するには：

1. `pod()` 関数でPodライブラリの名前を指定します。
   
   設定ブロックでは、`version` パラメータを使用してライブラリのバージョンを指定できます。
   ライブラリの最新バージョンを使用する場合は、このパラメータを完全に省略できます。

   > subspecsへの依存関係を追加することも可能です。
   >
   {style="note"}

2. Podライブラリの最小デプロイターゲットバージョンを指定します。

    ```kotlin
    kotlin {
        iosArm64()

        cocoapods {
            version = "2.0"
            summary = "CocoaPods test library"
            homepage = "https://github.com/JetBrains/kotlin"
            ios.deploymentTarget = "16.0"

            pod("SDWebImage") {
                version = "5.20.0"
            }
        }
    }
    ```

3. IntelliJ IDEAで **Build** | **Reload All Gradle Projects** を実行（またはAndroid Studioで **File** | **Sync Project with Gradle Files** を実行）して、プロジェクトを再インポートします。

Kotlinコードからこれらの依存関係を使用するには、パッケージ `cocoapods.<library-name>` をインポートします：

```kotlin
import cocoapods.SDWebImage.*
```

## ローカルに保存されているライブラリ

ローカルに保存されているPodライブラリへの依存関係を追加するには：

1. `pod()` 関数でPodライブラリの名前を指定します。

   設定ブロックで、ローカルPodライブラリへのパスを指定します。`source` パラメータの値の中で `path()` 関数を使用します。

   > subspecsへのローカル依存関係を追加することも可能です。
   > `cocoapods {}` ブロックには、ローカルに保存されたPodとCocoaPodsリポジトリのPodへの依存関係を同時に含めることができます。
   >
   {style="note"}

2. Podライブラリの最小デプロイターゲットバージョンを指定します。

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
                source = path(project.file("../pod_dependency"))
            }
            pod("subspec_dependency/Core") {
                version = "1.0"
                extraOpts += listOf("-compiler-option")
                source = path(project.file("../subspec_dependency"))
            }
            pod("SDWebImage") {
                version = "5.20.0"
            }
        }
    }
    ```

   > 設定ブロックの `version` パラメータを使用して、ライブラリのバージョンを指定することもできます。
   > ライブラリの最新バージョンを使用する場合は、パラメータを省略してください。
   >
   {style="note"}

3. IntelliJ IDEAで **Build** | **Reload All Gradle Projects** を実行（またはAndroid Studioで **File** | **Sync Project with Gradle Files** を実行）して、プロジェクトを再インポートします。

Kotlinコードからこれらの依存関係を使用するには、パッケージ `cocoapods.<library-name>` をインポートします：

```kotlin
import cocoapods.pod_dependency.*
import cocoapods.subspec_dependency.*
import cocoapods.SDWebImage.*
```

## カスタムGitリポジトリから

カスタムGitリポジトリにあるPodライブラリへの依存関係を追加するには：

1. `pod()` 関数でPodライブラリの名前を指定します。

   設定ブロックで、gitリポジトリへのパスを指定します。`source` パラメータの値の中で `git()` 関数を使用します。

   さらに、`git()` の後のブロックで以下のパラメータを指定できます：
    * `commit` – リポジトリの特定のコミットを使用する場合
    * `tag` – リポジトリの特定のタグを使用する場合
    * `branch` – リポジトリの特定のブランチを使用する場合

   `git()` 関数は、渡されたパラメータを `commit`、`tag`、`branch` の順に優先します。
   パラメータを指定しない場合、Kotlinプラグインは `master` ブランチの `HEAD` を使用します。

   > `branch`、`commit`、`tag` パラメータを組み合わせて、Podの特定のバージョンを取得することもできます。
   >
   {style="note"}

2. Podライブラリの最小デプロイターゲットバージョンを指定します。

    ```kotlin
    kotlin {
        iosArm64()

        cocoapods {
            version = "2.0"
            summary = "CocoaPods test library"
            homepage = "https://github.com/JetBrains/kotlin"
            ios.deploymentTarget = "16.0"

            pod("SDWebImage") {
                source = git("https://github.com/SDWebImage/SDWebImage") {
                    tag = "5.20.0"
                }
            }

            pod("JSONModel") {
                source = git("https://github.com/jsonmodel/jsonmodel.git") {
                    branch = "key-mapper-class"
                }
            }

            pod("CocoaLumberjack") {
                source = git("https://github.com/CocoaLumberjack/CocoaLumberjack.git") {
                    commit = "3e7f595e3a459c39b917aacf9856cd2a48c4dbf3"
                }
            }
        }
    }
    ```

3. IntelliJ IDEAで **Build** | **Reload All Gradle Projects** を実行（またはAndroid Studioで **File** | **Sync Project with Gradle Files** を実行）して、プロジェクトを再インポートします。

Kotlinコードからこれらの依存関係を使用するには、パッケージ `cocoapods.<library-name>` をインポートします：

```kotlin
import cocoapods.SDWebImage.*
import cocoapods.JSONModel.*
import cocoapods.CocoaLumberjack.*
```

## カスタムPodspecリポジトリから

カスタムPodspecリポジトリにあるPodライブラリへの依存関係を追加するには：

1. `specRepos {}` ブロック内の `url()` 呼び出しを使用して、カスタムPodspecリポジトリのアドレスを指定します。
2. `pod()` 関数でPodライブラリの名前を指定します。
3. Podライブラリの最小デプロイターゲットバージョンを指定します。

    ```kotlin
    kotlin {
        iosArm64()

        cocoapods {
            version = "2.0"
            summary = "CocoaPods test library"
            homepage = "https://github.com/JetBrains/kotlin"
            ios.deploymentTarget = "16.0"

            specRepos {
                url("https://github.com/Kotlin/kotlin-cocoapods-spec.git")
            }
            pod("example")
        }
    }
    ```

4. IntelliJ IDEAで **Build** | **Reload All Gradle Projects** を実行（またはAndroid Studioで **File** | **Sync Project with Gradle Files** を実行）して、プロジェクトを再インポートします。

> Xcodeで動作させるには、Podfileの冒頭でスペックの場所を指定してください：
> 
> ```ruby
> source 'https://github.com/Kotlin/kotlin-cocoapods-spec.git'
> ```
>
{style="note"}

Kotlinコードからこれらの依存関係を使用するには、パッケージ `cocoapods.<library-name>` をインポートします：

```kotlin
import cocoapods.example.*
```

## カスタムcinteropオプションを使用する場合

カスタムcinteropオプションを使用してPodライブラリへの依存関係を追加するには：

1. `pod()` 関数でPodライブラリの名前を指定します。
2. 設定ブロックで、以下のオプションを追加します：

   * `extraOpts` – Podライブラリのオプションリストを指定します。例：`extraOpts = listOf("-compiler-option")`。
      
      > clangモジュールで問題が発生した場合は、`-fmodules` オプションも追加してください。
      >
     {style="note"}

   * `packageName` – `import <packageName>` を使用して、指定したパッケージ名で直接ライブラリをインポートできるようにします。

3. Podライブラリの最小デプロイターゲットバージョンを指定します。

    ```kotlin
    kotlin {
        iosArm64()

        cocoapods {
            version = "2.0"
            summary = "CocoaPods test library"
            homepage = "https://github.com/JetBrains/kotlin"
            ios.deploymentTarget = "16.0"

            pod("FirebaseAuth") {
                packageName = "FirebaseAuthWrapper"
                version = "11.7.0"
                extraOpts += listOf("-compiler-option", "-fmodules")
            }
        }
    }
    ```

4. IntelliJ IDEAで **Build** | **Reload All Gradle Projects** を実行（またはAndroid Studioで **File** | **Sync Project with Gradle Files** を実行）して、プロジェクトを再インポートします。

Kotlinコードからこれらの依存関係を使用するには、パッケージ `cocoapods.<library-name>` をインポートします：
   
```kotlin
import cocoapods.FirebaseAuth.*
```
   
`packageName` パラメータを使用した場合、パッケージ名 `import <packageName>` を使用してライブラリをインポートできます：
   
```kotlin
import FirebaseAuthWrapper.Auth
import FirebaseAuthWrapper.User
```

### @importディレクティブを含むObjective-Cヘッダーのサポート

> この機能は[実験的](supported-platforms.md#general-kotlin-stability-levels)です。
> いつでも廃止または変更される可能性があります。評価目的でのみ使用してください。
> [YouTrack](https://kotl.in/issue)でのフィードバックをお待ちしております。
>
{style="warning"}

一部のObjective-Cライブラリ、特にSwiftライブラリのラッパーとして機能するものは、ヘッダーに `@import` ディレクティブを含んでいます。デフォルトでは、cinteropはこれらのディレクティブをサポートしていません。

`@import` ディレクティブのサポートを有効にするには、`pod()` 関数の設定ブロックで `-fmodules` オプションを指定します：

```kotlin
kotlin {
    iosArm64()

    cocoapods {
        version = "2.0"
        summary = "CocoaPods test library"
        homepage = "https://github.com/JetBrains/kotlin"
        ios.deploymentTarget = "16.0"

        pod("PodName") {
            version = "1.0.0"
            extraOpts = listOf("-compiler-option", "-fmodules")
        }
    }
}
```

### 依存するPod間でKotlin cinteropを共有する

`pod()` 関数を使用して複数のPodへの依存関係を追加する場合、PodのAPI間に依存関係があると問題が発生することがあります。

このような場合にコードをコンパイルできるようにするには、`useInteropBindingFrom()` 関数を使用します。
これは、新しいPodのバインディングを構築する際に、別のPod用に生成されたcinteropバインディングを利用します。

依存関係を設定する前に、依存先のPodを宣言する必要があります：

```kotlin
// pod("WebImage") のcinterop:
fun loadImage(): WebImage

// pod("Info") のcinterop:
fun printImageInfo(image: WebImage)

// あなたのコード:
printImageInfo(loadImage())
```

このケースでcinterop間の正しい依存関係を設定していない場合、`WebImage` 型が異なるcinteropファイル（結果として異なるパッケージ）から取得されるため、コードは無効になります。

## 次のステップ

* [KotlinプロジェクトとXcodeプロジェクト間の依存関係を設定する](multiplatform-cocoapods-xcode.md)
* [CocoaPods GradleプラグインDSLリファレンスの全文を見る](multiplatform-cocoapods-dsl-reference.md)