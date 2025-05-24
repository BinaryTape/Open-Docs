---
title: "CocoaPods の概要とセットアップ"
---
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

:::info

   これはローカル統合メソッドです。以下の場合に有効です:<br/>

   * CocoaPodsを使用するiOSプロジェクトでモノリポジトリがセットアップされている。
   * Kotlin MultiplatformプロジェクトにCocoaPodsの依存関係がある。<br/>

   [最適な統合方法を選択してください](multiplatform-ios-integration-overview)

:::

Kotlin/Native は、[CocoaPods dependency manager](https://cocoapods.org/) との統合を提供します。Podライブラリへの依存関係を追加したり、ネイティブターゲットを持つマルチプラットフォームプロジェクトをCocoaPodsの依存関係として使用したりできます。

IntelliJ IDEAまたはAndroid StudioでPodの依存関係を直接管理し、コードの強調表示や補完などの追加機能をすべて利用できます。GradleでKotlinプロジェクト全体をビルドでき、Xcodeに切り替える必要はまったくありません。

Swift/Objective-Cのコードを変更したり、Appleシミュレーターまたはデバイスでアプリケーションを実行したりする場合にのみ、Xcodeが必要です。Xcodeで正しく動作させるには、[Podfileを更新してください](#update-podfile-for-xcode)。

プロジェクトと目的に応じて、[KotlinプロジェクトとPodライブラリ間](native-cocoapods-libraries)や、[Kotlin GradleプロジェクトとXcodeプロジェクト間](native-cocoapods-xcode)に依存関係を追加できます。

## CocoaPodsを使用するための環境をセットアップする

任意のインストールツールを使用して、[CocoaPods dependency manager](https://cocoapods.org/) をインストールします。

<Tabs>
<TabItem value="RVM" label="RVM">

1. [Ruby version manager](https://rvm.io/rvm/install) をまだお持ちでない場合はインストールします。
2. Rubyをインストールします。特定のバージョンを選択できます:

    ```bash
    rvm install ruby 3.0.0
    ```

3. CocoaPodsをインストールします:

    ```bash
    sudo gem install -n /usr/local/bin cocoapods
    ```

</TabItem>
<TabItem value="Rbenv" label="Rbenv">

1. [rbenv from GitHub](https://github.com/rbenv/rbenv#installation) をまだお持ちでない場合はインストールします。
2. Rubyをインストールします。特定のバージョンを選択できます:

    ```bash
    rbenv install 3.0.0
    ```

3. 特定のディレクトリに対してRubyのバージョンをローカルとして設定するか、マシン全体に対してグローバルとして設定します:

    ```bash
    rbenv global 3.0.0
    ```
    
4. CocoaPodsをインストールします:

    ```bash
    sudo gem install -n /usr/local/bin cocoapods
    ```

</TabItem>
<TabItem value="Default Ruby" label="Default Ruby">

:::note
このインストール方法は、Apple Mチップ搭載デバイスでは動作しません。他のツールを使用して、CocoaPodsを使用するための環境をセットアップしてください。

:::

macOSで使用できるデフォルトのRubyを使用して、CocoaPods dependency managerをインストールできます:

```bash
sudo gem install cocoapods
```

</TabItem>
<TabItem value="Homebrew" label="Homebrew">

:::caution
Homebrewを使用したCocoaPodsのインストールは、互換性の問題を引き起こす可能性があります。

CocoaPodsをインストールすると、HomebrewはXcodeでの作業に必要な[Xcodeproj](https://github.com/CocoaPods/Xcodeproj) gemもインストールします。
ただし、Homebrewで更新することはできず、インストールされたXcodeprojが最新のXcodeバージョンをまだサポートしていない場合、Podのインストールでエラーが発生します。この場合は、他のツールを試してCocoaPodsをインストールしてください。

:::

1. [Homebrew](https://brew.sh/) をまだお持ちでない場合はインストールします。
2. CocoaPodsをインストールします:

    ```bash
    brew install cocoapods
    ```

</TabItem>
</Tabs>

インストール中に問題が発生した場合は、[考えられる問題と解決策](#possible-issues-and-solutions) セクションを確認してください。

## プロジェクトを作成する

環境がセットアップされたら、新しいKotlin Multiplatformプロジェクトを作成できます。そのためには、Kotlin Multiplatform web wizard または Android Studio用 Kotlin Multiplatform plugin を使用します。

### web wizard の使用

web wizard を使用してプロジェクトを作成し、CocoaPodsの統合を構成するには:

1. [Kotlin Multiplatform wizard](https://kmp.jetbrains.com) を開き、プロジェクトのターゲットプラットフォームを選択します。
2. **Download** ボタンをクリックして、ダウンロードしたアーカイブを解凍します。
3. Android Studioで、メニューの **File | Open** を選択します。
4. 解凍したプロジェクトフォルダに移動し、**Open** をクリックします。
5. Kotlin CocoaPods Gradle plugin をバージョンカタログに追加します。`gradle/libs.versions.toml` ファイルで、
   次の宣言を `[plugins]` ブロックに追加します:
 
   ```text
   kotlinCocoapods = { id = "org.jetbrains.kotlin.native.cocoapods", version.ref = "kotlin" }
   ```
   
6. プロジェクトのルート `build.gradle.kts` ファイルに移動し、次のエイリアスを `plugins {}` ブロックに追加します:

   ```kotlin
   alias(libs.plugins.kotlinCocoapods) apply false
   ```

7. CocoaPodsを統合するモジュール (たとえば、`composeApp` モジュール) を開き、次のエイリアスを
   `plugins {}` ブロックに追加します:

   ```kotlin
   alias(libs.plugins.kotlinCocoapods)
   ```

これで、Kotlin MultiplatformプロジェクトでCocoaPodsを使用する準備ができました。

### Android Studio で

Android StudioでCocoaPods統合を使用してプロジェクトを作成するには:

1. [Kotlin Multiplatform plugin](https://plugins.jetbrains.com/plugin/14936-kotlin-multiplatform) をAndroid Studioにインストールします。
2. Android Studioで、メニューの **File** | **New** | **New Project** を選択します。
3. プロジェクトテンプレートのリストで、**Kotlin Multiplatform App** を選択し、**Next** をクリックします。
4. アプリケーションに名前を付けて、**Next** をクリックします。
5. iOS framework の配信オプションとして **CocoaPods Dependency Manager** を選択します。

   <img src="/img/as-project-wizard.png" alt="Android Studio wizard with the Kotlin Multiplatform plugin" width="700" style={{verticalAlign: 'middle'}}/>

6. 他のオプションはすべてデフォルトのままにします。**Finish** をクリックします。

   pluginは、CocoaPodsの統合が設定されたプロジェクトを自動的に生成します。

## 既存のプロジェクトを構成する

すでにプロジェクトがある場合は、Kotlin CocoaPods Gradle pluginを手動で追加および構成できます:

1. プロジェクトの `build.gradle(.kts)` で、CocoaPods pluginとKotlin Multiplatform pluginの両方を適用します:
    
    ```kotlin
    plugins {
        kotlin("multiplatform") version "2.1.20"
        kotlin("native.cocoapods") version "2.1.20"
    }
    ```

2. `cocoapods` ブロックで、Podspecファイルの `version`、`summary`、`homepage`、および `baseName` を構成します:
    
    ```kotlin
    plugins {
        kotlin("multiplatform") version "2.1.20"
        kotlin("native.cocoapods") version "2.1.20"
    }
 
    kotlin {
        cocoapods {
            // Required properties
            // Specify the required Pod version here
            // Otherwise, the Gradle project version is used
            version = "1.0"
            summary = "Kotlin/Nativeモジュールの説明"
            homepage = "Kotlin/Nativeモジュールのホームページへのリンク"
   
            // Optional properties
            // Gradleプロジェクト名を変更する代わりに、ここでPod名を構成します
            name = "MyCocoaPod"

            framework {
                // Required properties              
                // Framework name configuration. Use this property instead of deprecated 'frameworkName'
                baseName = "MyFramework"
                
                // Optional properties
                // フレームワークのリンクタイプを指定します。デフォルトでは動的です。
                isStatic = false
                // 依存関係のエクスポート
                // コメントを解除し、別のプロジェクトモジュールがある場合は指定します。
                // export(project(":<your other KMP module>"))
                transitiveExport = false // これはデフォルトです。
            }

            // カスタムXcode構成をNativeBuildTypeにマップします
            xcodeConfigurationToNativeBuildType["CUSTOM_DEBUG"] = NativeBuildType.DEBUG
            xcodeConfigurationToNativeBuildType["CUSTOM_RELEASE"] = NativeBuildType.RELEASE
        }
    }
    ```

    > Kotlin DSL の完全な構文については、[Kotlin Gradle plugin repository](https://github.com/JetBrains/kotlin/blob/master/libraries/tools/kotlin-gradle-plugin/src/common/kotlin/org/jetbrains/kotlin/gradle/targets/native/cocoapods/CocoapodsExtension.kt) を参照してください。
    >
    
    
3. IntelliJ IDEA で **Reload All Gradle Projects** (または Android Studio で **Sync Project with Gradle Files**) を実行して、
   プロジェクトを再インポートします。
4. Xcodeビルド中の互換性の問題を回避するために、[Gradle wrapper](https://docs.gradle.org/current/userguide/gradle_wrapper.html) を生成します。

適用されると、CocoaPods pluginは次の処理を実行します。

* すべての macOS、iOS、tvOS、および watchOS ターゲットの出力バイナリとして `debug` および `release` フレームワークの両方を追加します。
* プロジェクトの[Podspec](https://guides.cocoapods.org/syntax/podspec.html) を生成する `podspec` タスクを作成します。

`Podspec` ファイルには、出力フレームワークへのパスと、Xcodeプロジェクトのビルドプロセス中にこのフレームワークのビルドを自動化するスクリプトフェーズが含まれています。

## Xcode 用 Podfile を更新する

KotlinプロジェクトをXcodeプロジェクトにインポートする場合は:

1. Podfileで変更を加えます:

   * プロジェクトにGit、HTTP、またはカスタムPodspecリポジトリの依存関係がある場合は、PodfileでPodspecへのパスを指定する必要があります。

     たとえば、`podspecWithFilesExample` に依存関係を追加する場合は、PodfileでPodspecへのパスを宣言します:

     ```ruby
     target 'ios-app' do
        # ... その他の依存関係 ...
        pod 'podspecWithFilesExample', :path => 'cocoapods/externalSources/url/podspecWithFilesExample' 
     end
     ```

     `:path` には、Podへのファイルパスが含まれている必要があります。

   * カスタムPodspecリポジトリからライブラリを追加する場合は、Podfileの先頭でspecsの[場所](https://guides.cocoapods.org/syntax/podfile.html#source) も指定する必要があります:

     ```ruby
     source 'https://github.com/Kotlin/kotlin-cocoapods-spec.git'

     target 'kotlin-cocoapods-xcproj' do
         # ... その他の依存関係 ...
         pod 'example'
     end
     ```

2. プロジェクトディレクトリで `pod install` を実行します。

   `pod install` を初めて実行すると、`.xcworkspace` ファイルが作成されます。このファイルには、元の `.xcodeproj` と CocoaPodsプロジェクトが含まれます。
3. `.xcodeproj` を閉じて、代わりに新しい `.xcworkspace` ファイルを開きます。これにより、プロジェクトの依存関係に関する問題を回避できます。
4. IntelliJ IDEA で **Reload All Gradle Projects** (または Android Studio で **Sync Project with Gradle Files**) を実行して、
   プロジェクトを再インポートします。

これらの変更をPodfileに加えないと、`podInstall` タスクは失敗し、CocoaPods pluginはログにエラーメッセージを表示します。

## 考えられる問題と解決策

### CocoaPods のインストール

#### Ruby のインストール

CocoaPodsはRubyで構築されており、macOSで使用できるデフォルトのRubyを使用してインストールできます。
Ruby 1.9以降には、[CocoaPods dependency manager](https://guides.cocoapods.org/using/getting-started.html#installation) のインストールに役立つ組み込みのRubyGemsパッケージ管理フレームワークがあります。

CocoaPodsのインストールと動作に問題が発生している場合は、[このガイド](https://www.ruby-lang.org/en/documentation/installation/) に従ってRubyをインストールするか、[RubyGems website](https://rubygems.org/pages/download/) を参照してフレームワークをインストールしてください。

#### バージョンの互換性

最新のKotlinバージョンを使用することをお勧めします。現在のバージョンが1.7.0より前の場合は、[`cocoapods-generate`](https://github.com/square/cocoapods-generate#installation") pluginを別途インストールする必要があります。

ただし、`cocoapods-generate` は Ruby 3.0.0 以降と互換性がありません。この場合は、Rubyをダウングレードするか、Kotlinを1.7.0以降にアップグレードしてください。

### Xcode の使用時にビルドエラーが発生する

CocoaPodsのインストールのバリエーションによっては、Xcodeでビルドエラーが発生する可能性があります。
通常、Kotlin Gradle pluginは `PATH` で `pod` 実行可能ファイルを検出しますが、これは環境によって一貫性がない場合があります。

CocoaPodsのインストールパスを明示的に設定するには、プロジェクトの `local.properties` ファイルに手動で追加するか、シェルコマンドを使用して追加できます。

* コードエディタを使用している場合は、次の行を `local.properties` ファイルに追加します:

    ```text
    kotlin.apple.cocoapods.bin=/Users/Jane.Doe/.rbenv/shims/pod
    ```

* ターミナルを使用している場合は、次のコマンドを実行します:

    ```shell
    echo -e "kotlin.apple.cocoapods.bin=$(which pod)" >> local.properties
    ```

### モジュールが見つかりません

[C-interop](native-c-interop) の問題に関連する `module 'SomeSDK' not found` エラーが発生する場合があります。
このエラーを回避するには、次の回避策を試してください:

#### フレームワーク名を指定する

1. ダウンロードしたPodディレクトリ `[shared_module_name]/build/cocoapods/synthetic/IOS/Pods/...` で `module.modulemap` ファイルを探します。
2. モジュール内のフレームワーク名 (たとえば、`SDWebImageMapKit {}`) を確認します。フレームワーク名がPod名と一致しない場合は、明示的に指定します:

    ```kotlin
    pod("SDWebImage/MapKit") {
        moduleName = "SDWebImageMapKit"
    }
    ```
#### ヘッダーを指定する

`pod("NearbyMessages")` のように、Podに `.modulemap` ファイルが含まれていない場合は、メインヘッダーを明示的に指定します:

```kotlin
pod("NearbyMessages") {
    version = "1.1.1"
    headers = "GNSMessages.h"
}
```

詳細については、[CocoaPods documentation](https://guides.cocoapods.org/) を確認してください。それでもうまくいかず、このエラーが発生する場合は、[YouTrack](https://youtrack.jetbrains.com/newissue?project=kt) で問題を報告してください。

### Rsync エラー

`rsync error: some files could not be transferred` エラーが発生する可能性があります。これは、Xcodeのアプリケーションターゲットでユーザー・スクリプトのサンドボックスが有効になっている場合に発生する [既知の問題](https://github.com/CocoaPods/CocoaPods/issues/11946) です。

この問題を解決するには:

1. アプリケーションターゲットでユーザー・スクリプトのサンドボックスを無効にします:

   <img src="/img/disable-sandboxing-cocoapods.png" alt="Disable sandboxing CocoaPods" width="700" style={{verticalAlign: 'middle'}}/>

2. サンドボックス化されている可能性のあるGradleデーモンプロセスを停止します:

    ```shell
    ./gradlew --stop
    ```