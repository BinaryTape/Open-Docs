[//]: # (title: Podライブラリへの依存関係を追加する)

<tldr>

   * Podの依存関係を追加する前に、[初期設定を完了](multiplatform-cocoapods-overview.md#set-up-an-environment-to-work-with-cocoapods)してください。
   * サンプルプロジェクトは[GitHubリポジトリ](https://github.com/Kotlin/kmp-with-cocoapods-sample)で確認できます。

</tldr>

Kotlinプロジェクト内の異なる場所からPodライブラリへの依存関係を追加できます。

Podの依存関係を追加するには、共有モジュールの`build.gradle(.kts)`ファイルで`pod()`関数を呼び出します。
各依存関係には個別の関数呼び出しが必要です。依存関係のパラメーターは、
関数の設定ブロックで指定できます。

* 新しい依存関係を追加し、IDEでプロジェクトを再インポートすると、ライブラリは自動的に接続されます。
* KotlinプロジェクトをXcodeで使用するには、まず[プロジェクトのPodfileに変更を加える](multiplatform-cocoapods-overview.md#update-podfile-for-xcode)必要があります。

> 最小デプロイメントターゲットバージョンを指定せず、依存関係にあるPodがより高いデプロイメントターゲットを要求する場合、
> エラーが発生します。
>
{style="note"}

## CocoaPodsリポジトリから

CocoaPodsリポジトリにあるPodライブラリへの依存関係を追加するには：

1. `pod()`関数でPodライブラリの名前を指定します。
   
   設定ブロック内で、`version`パラメーターを使用してライブラリのバージョンを指定できます。
   ライブラリの最新バージョンを使用するには、このパラメーターを完全に省略できます。

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

3. IntelliJ IDEAで**Build** | **Reload All Gradle Projects** (またはAndroid Studioで**File** | **Sync Project with Gradle Files**) を実行して、プロジェクトを再インポートします。

Kotlinコードからこれらの依存関係を使用するには、`cocoapods.<library-name>`パッケージをインポートします。

```kotlin
import cocoapods.SDWebImage.*
```

## ローカルに保存されたライブラリで

ローカルに保存されたPodライブラリへの依存関係を追加するには：

1. `pod()`関数でPodライブラリの名前を指定します。

   設定ブロック内で、ローカルPodライブラリへのパスを指定します。`source`パラメーターの値に`path()`関数を使用します。

   > サブスペックへのローカル依存関係も追加できます。
   > `cocoapods {}`ブロックには、ローカルに保存されているPodとCocoaPodsリポジトリからのPodの両方への依存関係を同時に含めることができます。
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

   > 設定ブロック内で`version`パラメーターを使用してライブラリのバージョンを指定することもできます。
   > ライブラリの最新バージョンを使用するには、パラメーターを省略します。
   >
   {style="note"}

3. IntelliJ IDEAで**Build** | **Reload All Gradle Projects** (またはAndroid Studioで**File** | **Sync Project with Gradle Files**) を実行して、プロジェクトを再インポートします。

Kotlinコードからこれらの依存関係を使用するには、`cocoapods.<library-name>`パッケージをインポートします。

```kotlin
import cocoapods.pod_dependency.*
import cocoapods.subspec_dependency.*
import cocoapods.SDWebImage.*
```

## カスタムGitリポジトリから

カスタムGitリポジトリにあるPodライブラリへの依存関係を追加するには：

1. `pod()`関数でPodライブラリの名前を指定します。

   設定ブロック内で、gitリポジトリへのパスを指定します。`source`パラメーターの値に`git()`関数を使用します。

   さらに、`git()`の後のブロックで以下のパラメーターを指定できます。
    * `commit` – リポジトリから特定のコミットを使用する
    * `tag` – リポジトリから特定のタグを使用する
    * `branch` – リポジトリから特定のブランチを使用する

   `git()`関数は、渡されたパラメーターを`commit`、`tag`、`branch`の順で優先します。
   パラメーターを指定しない場合、Kotlinプラグインは`master`ブランチの`HEAD`を使用します。

   > `branch`、`commit`、および`tag`パラメーターを組み合わせて、Podの特定のバージョンを取得できます。
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

3. IntelliJ IDEAで**Build** | **Reload All Gradle Projects** (またはAndroid Studioで**File** | **Sync Project with Gradle Files**) を実行して、プロジェクトを再インポートします。

Kotlinコードからこれらの依存関係を使用するには、`cocoapods.<library-name>`パッケージをインポートします。

```kotlin
import cocoapods.SDWebImage.*
import cocoapods.JSONModel.*
import cocoapods.CocoaLumberjack.*
```

## カスタムPodspecリポジトリから

カスタムPodspecリポジトリにあるPodライブラリへの依存関係を追加するには：

1. `specRepos {}`ブロック内で`url()`呼び出しを使用して、カスタムPodspecリポジトリのアドレスを指定します。
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

4. IntelliJ IDEAで**Build** | **Reload All Gradle Projects** (またはAndroid Studioで**File** | **Sync Project with Gradle Files**) を実行して、プロジェクトを再インポートします。

> Xcodeで動作させるには、Podfileの冒頭でスペックの場所を指定します。
> 
> ```ruby
> source 'https://github.com/Kotlin/kotlin-cocoapods-spec.git'
> ```
>
{style="note"}

Kotlinコードからこれらの依存関係を使用するには、`cocoapods.<library-name>`パッケージをインポートします。

```kotlin
import cocoapods.example.*
```

## カスタムcinteropオプションを使用

カスタムcinteropオプションを使用してPodライブラリへの依存関係を追加するには：

1. `pod()`関数でPodライブラリの名前を指定します。
2. 設定ブロックに、以下のオプションを追加します。

   * `extraOpts` – Podライブラリのオプションのリストを指定します。例: `extraOpts = listOf("-compiler-option")`。
      
      > clangモジュールで問題が発生した場合は、`-fmodules`オプションも追加してください。
      >
     {style="note"}

   * `packageName` – `import <packageName>`を使用してライブラリを直接インポートします。

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

4. IntelliJ IDEAで**Build** | **Reload All Gradle Projects** (またはAndroid Studioで**File** | **Sync Project with Gradle Files**) を実行して、プロジェクトを再インポートします。

Kotlinコードからこれらの依存関係を使用するには、`cocoapods.<library-name>`パッケージをインポートします。
   
```kotlin
import cocoapods.FirebaseAuth.*
```
   
`packageName`パラメーターを使用する場合、`import <packageName>`というパッケージ名を使用してライブラリをインポートできます。
   
```kotlin
import FirebaseAuthWrapper.Auth
import FirebaseAuthWrapper.User
```

### Objective-Cヘッダーでの@importディレクティブのサポート

> この機能は[Experimental](supported-platforms.md#general-kotlin-stability-levels)です。
> 予告なく削除または変更される可能性があります。評価目的でのみ使用してください。
> フィードバックを[YouTrack](https://kotl.in/issue)でお寄せいただけると幸いです。
>
{style="warning"}

Objective-Cライブラリの中には、特にSwiftライブラリのラッパーとして機能するものに、ヘッダーに`@import`ディレクティブが含まれているものがあります。デフォルトでは、cinteropはこれらのディレクティブをサポートしていません。

`@import`ディレクティブのサポートを有効にするには、`pod()`関数の設定ブロックで`-fmodules`オプションを指定します。

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

`pod()`関数を使用して複数のPodに依存関係を追加する場合、PodのAPI間に依存関係があると問題が発生する可能性があります。

そのような場合にコードをコンパイルできるようにするには、`useInteropBindingFrom()`関数を使用します。
これは、新しいPodのバインディングを構築する際に、別のPod用に生成されたcinteropバインディングを利用します。

依存関係を設定する前に、依存するPodを宣言する必要があります。

```kotlin
// The cinterop of pod("WebImage"):
fun loadImage(): WebImage

// The cinterop of pod("Info"):
fun printImageInfo(image: WebImage)

// Your code:
printImageInfo(loadImage())
```

この場合、cinterop間の正しい依存関係を設定していないと、`WebImage`型が異なるcinteropファイル、ひいては異なるパッケージから供給されるため、コードが無効になります。

## 次は何をしますか

* [KotlinプロジェクトとXcodeプロジェクト間の依存関係を設定する](multiplatform-cocoapods-xcode.md)
* [CocoaPods GradleプラグインのDSLリファレンス全体を確認する](multiplatform-cocoapods-dsl-reference.md)