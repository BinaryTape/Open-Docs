---
title: Podライブラリへの依存関係の追加
---
KotlinプロジェクトとPodライブラリの間に依存関係を追加するには、[初期設定を完了してください](native-cocoapods#set-up-an-environment-to-work-with-cocoapods)。
その後、さまざまな種類のPodライブラリに依存関係を追加できます。

新しい依存関係を追加してIDEでプロジェクトを再インポートすると、新しい依存関係が自動的に追加されます。
追加の手順は必要ありません。

KotlinプロジェクトをXcodeで使用するには、[プロジェクトのPodfileに変更を加える必要があります](native-cocoapods#update-podfile-for-xcode)。

Kotlinプロジェクトでは、Podの依存関係を追加するために`build.gradle(.kts)`で`pod()`関数呼び出しが必要です。
各依存関係には、個別の関数呼び出しが必要です。関数の設定ブロックで、依存関係のパラメータを指定できます。

:::note
最小デプロイメントターゲットバージョンを指定せず、依存関係Podがより高いデプロイメントターゲットを必要とする場合、
エラーが発生します。

:::

サンプルプロジェクトは[こちら](https://github.com/Kotlin/kmm-with-cocoapods-sample)にあります。

## CocoaPodsリポジトリから

1. `pod()`関数でPodライブラリの名前を指定します。
   
   設定ブロックで、`version`パラメータを使用してライブラリのバージョンを指定できます。最新バージョンを使用するには、
このパラメータを完全に省略できます。

   > サブスペックに依存関係を追加できます。
   >
   

2. Podライブラリの最小デプロイメントターゲットバージョンを指定します。

    ```kotlin
    kotlin {
        iosArm64()

        cocoapods {
            version = "2.0"
            ios.deploymentTarget = "16.0"

            summary = "CocoaPods test library"
            homepage = "https://github.com/JetBrains/kotlin"

            pod("SDWebImage") {
                version = "5.20.0"
            }
        }
    }
    ```

3. IntelliJ IDEAで**Reload All Gradle Projects**(またはAndroid Studioで**Sync Project with Gradle Files**)を実行して、
プロジェクトを再インポートします。

Kotlinコードからこれらの依存関係を使用するには、パッケージ`cocoapods.<library-name>`をインポートします。

```kotlin
import cocoapods.SDWebImage.*
```

## ローカルに保存されたライブラリ上

1. `pod()`関数でPodライブラリの名前を指定します。

   設定ブロックで、ローカルPodライブラリへのパスを指定します。`source`パラメータ値で`path()`関数を使用します。

   > サブスペックにもローカル依存関係を追加できます。
   > `cocoapods`ブロックには、ローカルに保存されたPodsとCocoaPodsリポジトリからのPodsへの依存関係を同時に含めることができます。
   >
   

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

   > 設定ブロックで`version`パラメータを使用して、ライブラリのバージョンを指定することもできます。
   > ライブラリの最新バージョンを使用するには、パラメータを省略します。
   >
   

3. IntelliJ IDEAで**Reload All Gradle Projects**(またはAndroid Studioで**Sync Project with Gradle Files**)を実行して、
プロジェクトを再インポートします。

Kotlinコードからこれらの依存関係を使用するには、パッケージ`cocoapods.<library-name>`をインポートします。

```kotlin
import cocoapods.pod_dependency.*
import cocoapods.subspec_dependency.*
import cocoapods.SDWebImage.*
```

## カスタムGitリポジトリから

1. `pod()`関数でPodライブラリの名前を指定します。

   設定ブロックで、gitリポジトリへのパスを指定します。`source`パラメータ値で`git()`関数を使用します。

   さらに、`git()`の後のブロックで、次のパラメータを指定できます。
    * `commit` – リポジトリからの特定のコミットを使用します
    * `tag` – リポジトリからの特定のタグを使用します
    * `branch` – リポジトリからの特定のブランチを使用します

   `git()`関数は、渡されたパラメータを次の順序で優先します：`commit`、`tag`、`branch`。
パラメータを指定しない場合、Kotlinプラグインは`master`ブランチの`HEAD`を使用します。

   > `branch`、`commit`、および`tag`パラメータを組み合わせて、Podの特定のバージョンを取得できます。
   >
   

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

3. IntelliJ IDEAで**Reload All Gradle Projects**(またはAndroid Studioで**Sync Project with Gradle Files**)を実行して、
プロジェクトを再インポートします。

Kotlinコードからこれらの依存関係を使用するには、パッケージ`cocoapods.<library-name>`をインポートします。

```kotlin
import cocoapods.Alamofire.*
import cocoapods.JSONModel.*
import cocoapods.CocoaLumberjack.*
```

## カスタムPodspecリポジトリから

1. `specRepos`ブロック内で`url()`を使用して、カスタムPodspecリポジトリへのHTTPアドレスを指定します。
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

4. IntelliJ IDEAで**Reload All Gradle Projects**(またはAndroid Studioで**Sync Project with Gradle Files**)を実行して、
プロジェクトを再インポートします。

:::note
Xcodeで正しく動作させるには、Podfileの先頭にspecsの場所を指定する必要があります。
たとえば、
```ruby
source 'https://github.com/Kotlin/kotlin-cocoapods-spec.git'
```

:::

Kotlinコードからこれらの依存関係を使用するには、パッケージ`cocoapods.<library-name>`をインポートします。

```kotlin
import cocoapods.example.*
```

## カスタムcinteropオプションを使用する

1. `pod()`関数でPodライブラリの名前を指定します。
2. 設定ブロックで、次のオプションを追加します。

   * `extraOpts` – Podライブラリのオプションのリストを指定します。たとえば、`extraOpts = listOf("-compiler-option")`。
      
      > clangモジュールで問題が発生した場合は、`-fmodules`オプションも追加してください。
      >
     

   * `packageName` – `import <packageName>`を使用して、パッケージ名を使用してライブラリを直接インポートします。

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

4. IntelliJ IDEAで**Reload All Gradle Projects**(またはAndroid Studioで**Sync Project with Gradle Files**)を実行して、
プロジェクトを再インポートします。

Kotlinコードからこれらの依存関係を使用するには、パッケージ`cocoapods.<library-name>`をインポートします。
   
```kotlin
import cocoapods.FirebaseAuth.*
```
   
`packageName`パラメータを使用する場合は、パッケージ名`import <packageName>`を使用してライブラリをインポートできます。
   
```kotlin
import FirebaseAuthWrapper.Auth
import FirebaseAuthWrapper.User
```

### @importディレクティブを含むObjective-Cヘッダーのサポート

:::caution
この機能は[試験的](components-stability#stability-levels-explained)です。
いつでも削除または変更される可能性があります。評価目的でのみ使用してください。
[YouTrack](https://kotl.in/issue)でフィードバックをお待ちしております。

:::

一部のObjective-Cライブラリ、特にSwiftライブラリのラッパーとして機能するライブラリは、
ヘッダーに`@import`ディレクティブがあります。デフォルトでは、cinteropはこれらのディレクティブのサポートを提供していません。

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

### 依存Pod間でKotlin cinteropを共有する

`pod()`関数を使用して複数のPodsに依存関係を追加すると、
PodsのAPI間に依存関係がある場合に問題が発生する可能性があります。

このような場合にコードをコンパイルできるようにするには、`useInteropBindingFrom()`関数を使用します。
これは、新しいPodのバインディングを構築する際に、別のPodに対して生成されたcinteropバインディングを利用します。

依存するPodを依存関係の設定前に宣言する必要があります。

```kotlin
// pod("WebImage")のcinterop:
fun loadImage(): WebImage

// pod("Info")のcinterop:
fun printImageInfo(image: WebImage)

// あなたのコード:
printImageInfo(loadImage())
```

この場合、cinterop間の正しい依存関係を設定していないと、
`WebImage`型が異なるcinteropファイル、したがって異なるパッケージから取得されるため、コードは無効になります。