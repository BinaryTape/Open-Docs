[//]: # (title: Podライブラリへの依存関係の追加)

<tldr>

   * Podの依存関係を追加する前に、[初期設定を完了してください](multiplatform-cocoapods-overview.md#set-up-an-environment-to-work-with-cocoapods)。
   * サンプルプロジェクトは、私たちの[GitHubリポジトリ](https://github.com/Kotlin/kmp-with-cocoapods-sample)で確認できます。

</tldr>

Kotlinプロジェクトでは、さまざまな場所にあるPodライブラリへの依存関係を追加できます。

Podの依存関係を追加するには、共有モジュールの`build.gradle(.kts)`ファイル内で`pod()`関数を呼び出します。
各依存関係には、個別の関数呼び出しが必要です。
依存関係のパラメータは、関数の設定ブロック内で指定できます。

* 新しい依存関係を追加してIDEでプロジェクトを再インポートすると、ライブラリは自動的に接続されます。
* KotlinプロジェクトをXcodeで使用するには、まず[プロジェクトのPodfileを変更してください](multiplatform-cocoapods-overview.md#update-podfile-for-xcode)。

> 最小デプロイメントターゲットバージョンを指定せず、かつ依存関係のあるPodがより高いデプロイメントターゲットを必要とする場合、
> エラーが発生します。
>
{style="note"}

## CocoaPodsリポジトリから

CocoaPodsリポジトリにあるPodライブラリへの依存関係を追加するには：

1. `pod()`関数でPodライブラリの名前を指定します。
   
   設定ブロックで、`version`パラメータを使用してライブラリのバージョンを指定できます。
   ライブラリの最新バージョンを使用する場合は、このパラメータを完全に省略できます。

   > サブスペックへの依存関係も追加できます。
   >
   {style="note"}

2. Podライブラリの最小デプロイメントターゲットバージョンを指定します。

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

3. IntelliJ IDEAで **Build** | **Reload All Gradle Projects** を実行して（またはAndroid Studioで **File** | **Sync Project with Gradle Files** を実行して）プロジェクトを再インポートします。

これらの依存関係をKotlinコードから使用するには、`cocoapods.<library-name>`パッケージをインポートします：

```kotlin
import cocoapods.SDWebImage.*
```

## ローカルに保存されているライブラリ

ローカルに保存されているPodライブラリへの依存関係を追加するには：

1. `pod()`関数でPodライブラリの名前を指定します。

   設定ブロックで、ローカルPodライブラリへのパスを指定します：`source`パラメータの値に`path()`関数を使用します。

   > サブスペックへのローカル依存関係も追加できます。
   > `cocoapods {}`ブロックには、ローカルに保存されているPodとCocoaPodsリポジトリからのPodの両方の依存関係を同時に含めることができます。
   >
   {style="note"}

2. Podライブラリの最小デプロイメントターゲットバージョンを指定します。

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

   > 設定ブロックで`version`パラメータを使用してライブラリのバージョンを指定することもできます。
   > ライブラリの最新バージョンを使用する場合は、そのパラメータを省略してください。
   >
   {style="note"}

3. IntelliJ IDEAで **Build** | **Reload All Gradle Projects** を実行して（またはAndroid Studioで **File** | **Sync Project with Gradle Files** を実行して）プロジェクトを再インポートします。

これらの依存関係をKotlinコードから使用するには、`cocoapods.<library-name>`パッケージをインポートします：

```kotlin
import cocoapods.pod_dependency.*
import cocoapods.subspec_dependency.*
import cocoapods.SDWebImage.*
```

## カスタムGitリポジトリから

カスタムGitリポジトリにあるPodライブラリへの依存関係を追加するには：

1. `pod()`関数でPodライブラリの名前を指定します。

   設定ブロックで、Gitリポジリへのパスを指定します：`source`パラメータの値に`git()`関数を使用します。

   さらに、`git()`の後のブロックで以下のパラメータを指定できます：
    * `commit` – リポジトリの特定のコミットを使用する場合
    * `tag` – リポジトリの特定のタグを使用する場合
    * `branch` – リポジトリの特定のブランチを使用する場合

   `git()`関数は、渡されたパラメータに次の順序で優先順位を付けます：`commit`、`tag`、`branch`。
   パラメータを指定しない場合、Kotlinプラグインは`master`ブランチの`HEAD`を使用します。

   > `branch`、`commit`、`tag`パラメータを組み合わせて、Podの特定のバージョンを取得できます。
   >
   {style="note"}

2. Podライブラリの最小デプロイメントターゲットバージョンを指定します。

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

3. IntelliJ IDEAで **Build** | **Reload All Gradle Projects** を実行して（またはAndroid Studioで **File** | **Sync Project with Gradle Files** を実行して）プロジェクトを再インポートします。

これらの依存関係をKotlinコードから使用するには、`cocoapods.<library-name>`パッケージをインポートします：

```kotlin
import cocoapods.SDWebImage.*
import cocoapods.JSONModel.*
import cocoapods.CocoaLumberjack.*
```

## カスタムPodspecリポジトリから

カスタムPodspecリポジトリにあるPodライブラリへの依存関係を追加するには：

1. `specRepos {}`ブロック内で`url()`を呼び出して、カスタムPodspecリポジトリのアドレスを指定します。
2. `pod()`関数でPodライブラリの名前を指定します。
3. Podライブラリの最小デプロイメントターゲットバージョンを指定します。

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

4. IntelliJ IDEAで **Build** | **Reload All Gradle Projects** を実行して（またはAndroid Studioで **File** | **Sync Project with Gradle Files** を実行して）プロジェクトを再インポートします。

> Xcodeで作業するには、Podfileの冒頭でスペックの場所を指定します：
> 
> ```ruby
> source 'https://github.com/Kotlin/kotlin-cocoapods-spec.git'
> ```
>
{style="note"}

これらの依存関係をKotlinコードから使用するには、`cocoapods.<library-name>`パッケージをインポートします：

```kotlin
import cocoapods.example.*
```

## カスタムcinteropオプションを使用する

カスタムcinteropオプションを使用してPodライブラリへの依存関係を追加するには：

1. `pod()`関数でPodライブラリの名前を指定します。
2. 設定ブロックで、以下のオプションを追加します：

   * `extraOpts` – Podライブラリのオプションのリストを指定する場合。例：`extraOpts = listOf("-compiler-option")`。
      
      > clangモジュールで問題が発生した場合は、`-fmodules`オプションも追加してください。
      >
     {style="note"}

   * `packageName` – `import <packageName>`を使用してパッケージ名でライブラリを直接インポートする場合。

3. Podライブラリの最小デプロイメントターゲットバージョンを指定します。

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

4. IntelliJ IDEAで **Build** | **Reload All Gradle Projects** を実行して（またはAndroid Studioで **File** | **Sync Project with Gradle Files** を実行して）プロジェクトを再インポートします。

これらの依存関係をKotlinコードから使用するには、`cocoapods.<library-name>`パッケージをインポートします：
   
```kotlin
import cocoapods.FirebaseAuth.*
```
   
`packageName`パラメータを使用する場合、`import <packageName>`というパッケージ名を使用してライブラリをインポートできます：
   
```kotlin
import FirebaseAuthWrapper.Auth
import FirebaseAuthWrapper.User
```

### @importディレクティブを持つObjective-Cヘッダーのサポート

> この機能は[実験的](supported-platforms.md#general-kotlin-stability-levels)です。
> いつでも廃止または変更される可能性があります。評価目的でのみ使用してください。
> [YouTrack](https://kotl.in/issue)でのフィードバックをお待ちしております。
>
{style="warning"}

一部のObjective-Cライブラリ、特にSwiftライブラリのラッパーとして機能するものは、ヘッダーに`@import`ディレクティブを持っています。デフォルトでは、cinteropはこれらのディレクティブをサポートしていません。

`@import`ディレクティブのサポートを有効にするには、`pod()`関数の設定ブロックで`-fmodules`オプションを指定します：

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

`pod()`関数を使用して複数のPodに依存関係を追加する場合、PodのAPI間に依存関係があると問題に遭遇する可能性があります。

そのような場合にコードをコンパイルできるようにするには、`useInteropBindingFrom()`関数を使用します。
これは、新しいPodのバインディングを構築する際に、別のPod用に生成されたcinteropバインディングを利用します。

依存関係を設定する前に、依存するPodを宣言する必要があります：

```kotlin
// The cinterop of pod("WebImage"):
fun loadImage(): WebImage

// The cinterop of pod("Info"):
fun printImageInfo(image: WebImage)

// Your code:
printImageInfo(loadImage())
```

このケースでcinterop間の正しい依存関係を設定していない場合、`WebImage`型が異なるcinteropファイルから、結果として異なるパッケージから供給されるため、コードは無効になります。

## 次のステップ

* [KotlinプロジェクトとXcodeプロジェクト間の依存関係を設定する](multiplatform-cocoapods-xcode.md)
* [CocoaPods GradleプラグインのDSLリファレンス全体を見る](multiplatform-cocoapods-dsl-reference.md)