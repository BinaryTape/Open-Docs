[//]: # (title: CocoaPodsの概要とセットアップ)

<tldr>
   これはローカル統合方法です。以下の場合に役立ちます。<br/>

   * CocoaPodsを使用するiOSプロジェクトを含むモノレポ構成である。
   * Kotlin MultiplatformプロジェクトがCocoaPodsの依存関係を持っている。<br/>

   [最適な統合方法を選択する](multiplatform-ios-integration-overview.md)
</tldr>

Kotlin/Nativeは、[CocoaPods依存関係マネージャー](https://cocoapods.org/)との統合を提供します。Podライブラリへの依存関係を追加したり、KotlinプロジェクトをCocoaPodsの依存関係として使用したりできます。

IntelliJ IDEAまたはAndroid StudioでPodの依存関係を直接管理でき、コードハイライトや補完などの追加機能をすべて利用できます。Xcodeに切り替えることなく、GradleでKotlinプロジェクト全体をビルドできます。

Swift/Objective-Cコードを変更したり、Appleシミュレーターまたはデバイスでアプリケーションを実行したりする場合にのみXcodeが必要です。Xcodeで作業するには、最初に[Podfileを更新](#update-podfile-for-xcode)してください。

## CocoaPodsで作業するための環境をセットアップする

[CocoaPods依存関係マネージャー](https://cocoapods.org/)を、選択したインストールツールを使用してインストールします。

<Tabs>
<TabItem title="RVM">

1. [RVM](https://rvm.io/rvm/install)をまだ持っていない場合はインストールします。
2. Rubyをインストールします。特定のバージョンを選択できます。

    ```bash
    rvm install ruby %rubyVersion%
    ```

3. CocoaPodsをインストールします。

    ```bash
    sudo gem install -n /usr/local/bin cocoapods
    ```

</TabItem>
<TabItem title="Rbenv">

1. [GitHubからrbenv](https://github.com/rbenv/rbenv#installation)をまだ持っていない場合はインストールします。
2. Rubyをインストールします。特定のバージョンを選択できます。

    ```bash
    rbenv install %rubyVersion%
    ```

3. Rubyバージョンを特定のディレクトリのローカル、またはマシン全体のグローバルに設定します。

    ```bash
    rbenv global %rubyVersion%
    ```
    
4. CocoaPodsをインストールします。

    ```bash
    sudo gem install -n /usr/local/bin cocoapods
    ```

</TabItem>
<TabItem title="Default Ruby">

> このインストール方法はApple Mチップ搭載デバイスでは動作しません。CocoaPodsで作業するための環境をセットアップするには、他のツールを使用してください。
>
{style="note"}

macOSで利用可能なデフォルトのRubyを使用して、CocoaPods依存関係マネージャーをインストールできます。

```bash
sudo gem install cocoapods
```

</TabItem>
<TabItem title="Homebrew">

> HomebrewによるCocoaPodsのインストールは、互換性の問題を引き起こす可能性があります。
>
> CocoaPodsをインストールすると、HomebrewはXcodeとの連携に必要な[Xcodeproj](https://github.com/CocoaPods/Xcodeproj)gemもインストールします。
> しかし、それはHomebrewでは更新できず、インストールされたXcodeprojが最新のXcodeバージョンをまだサポートしていない場合、Podのインストールでエラーが発生します。この場合は、CocoaPodsをインストールするために他のツールを試してください。
>
{style="warning"}

1. [Homebrew](https://brew.sh/)をまだ持っていない場合はインストールします。
2. CocoaPodsをインストールします。

    ```bash
    brew install cocoapods
    ```

</TabItem>
</Tabs>

インストール中に問題が発生した場合は、[考えられる問題と解決策](#possible-issues-and-solutions)セクションを確認してください。

## プロジェクトを作成する

CocoaPods環境がセットアップされたら、Podで動作するようにKotlin Multiplatformプロジェクトを設定できます。以下の手順では、新規に生成されたプロジェクトでの設定を示します。

1. macOSで[Kotlin Multiplatform IDEプラグイン](https://plugins.jetbrains.com/plugin/14936-kotlin-multiplatform)または[Kotlin Multiplatformウェブウィザード](https://kmp.jetbrains.com)を使用して、AndroidおよびiOS用の新しいプロジェクトを生成します。
   ウェブウィザードを使用する場合は、アーカイブを展開し、IDEにプロジェクトをインポートします。
2. `gradle/libs.versions.toml`ファイルで、`[plugins]`ブロックにKotlin CocoaPods Gradleプラグインを追加します。

   ```text
   kotlinCocoapods = { id = "org.jetbrains.kotlin.native.cocoapods", version.ref = "kotlin" }
   ```

3. プロジェクトのルート`build.gradle.kts`ファイルに移動し、`plugins {}`ブロックに以下のエイリアスを追加します。

   ```kotlin
   alias(libs.plugins.kotlinCocoapods) apply false
   ```

4. CocoaPodsを統合したいモジュール（例：`composeApp`モジュール）を開き、`build.gradle.kts`ファイルの`plugins {}`ブロックに以下のエイリアスを追加します。

   ```kotlin
   alias(libs.plugins.kotlinCocoapods)
   ```

これで、[Kotlin MultiplatformプロジェクトでCocoaPodsを設定](#configure-the-project)する準備ができました。

## プロジェクトを設定する

マルチプラットフォームプロジェクトでKotlin CocoaPods Gradleプラグインを設定するには：

1. プロジェクトの共有モジュールの`build.gradle(.kts)`で、CocoaPodsプラグインとKotlin Multiplatformプラグインを適用します。

   > [IDEプラグインまたはウェブウィザードで](#create-a-project)プロジェクトを作成した場合は、この手順をスキップしてください。
   > 
   {style="note"}
    
    ```kotlin
    plugins {
        kotlin("multiplatform") version "%kotlinVersion%"
        kotlin("native.cocoapods") version "%kotlinVersion%"
    }
    ```

2. `cocoapods`ブロックでPodspecファイルの`version`、`summary`、`homepage`、および`baseName`を設定します。
    
    ```kotlin
    plugins {
        kotlin("multiplatform") version "%kotlinVersion%"
        kotlin("native.cocoapods") version "%kotlinVersion%"
    }
 
    kotlin {
        cocoapods {
            // Required properties
            // Specify the required Pod version here
            // Otherwise, the Gradle project version is used
            version = "1.0"
            summary = "Some description for a Kotlin/Native module"
            homepage = "Link to a Kotlin/Native module homepage"
   
            // Optional properties
            // Configure the Pod name here instead of changing the Gradle project name
            name = "MyCocoaPod"

            framework {
                // Required properties              
                // Framework name configuration. Use this property instead of deprecated 'frameworkName'
                baseName = "MyFramework"
                
                // Optional properties
                // Specify the framework linking type. It's dynamic by default. 
                isStatic = false
                // Dependency export
                // Uncomment and specify another project module if you have one:
                // export(project(":<your other KMP module>"))
                transitiveExport = false // This is default.
            }

            // Maps custom Xcode configuration to NativeBuildType
            xcodeConfigurationToNativeBuildType["CUSTOM_DEBUG"] = NativeBuildType.DEBUG
            xcodeConfigurationToNativeBuildType["CUSTOM_RELEASE"] = NativeBuildType.RELEASE
        }
    }
    ```

    > Kotlin DSLの完全な構文は、[Kotlin Gradleプラグインリポジトリ](https://github.com/JetBrains/kotlin/blob/master/libraries/tools/kotlin-gradle-plugin/src/common/kotlin/org/jetbrains/kotlin/gradle/targets/native/cocoapods/CocoapodsExtension.kt)を参照してください。
    >
    {style="note"}
    
3. IntelliJ IDEAで**Build** | **Reload All Gradle Projects**を実行（またはAndroid Studioで**File** | **Sync Project with Gradle Files**を実行）して、プロジェクトを再インポートします。
4. Xcodeビルド時の互換性問題を避けるために、[Gradle wrapper](https://docs.gradle.org/current/userguide/gradle_wrapper.html)を生成します。

適用すると、CocoaPodsプラグインは以下を実行します。

* `debug`および`release`フレームワークの両方を、すべてのmacOS、iOS、tvOS、watchOSターゲットの出力バイナリとして追加します。
* プロジェクトの[Podspec](https://guides.cocoapods.org/syntax/podspec.html)ファイルを生成する`podspec`タスクを作成します。

`Podspec`ファイルには、出力フレームワークへのパスと、Xcodeプロジェクトのビルドプロセス中にこのフレームワークのビルドを自動化するスクリプトフェーズが含まれます。

## Xcode用のPodfileを更新する

KotlinプロジェクトをXcodeプロジェクトにインポートしたい場合は：

1. KotlinプロジェクトのiOS部分で、Podfileに変更を加えます。

   * プロジェクトにGit、HTTP、またはカスタムPodspecリポジトリの依存関係がある場合は、PodfileにPodspecへのパスを指定します。

     例えば、`podspecWithFilesExample`に依存関係を追加する場合、PodfileにPodspecへのパスを宣言します。

     ```ruby
     target 'ios-app' do
        # ... other dependencies ...
        pod 'podspecWithFilesExample', :path => 'cocoapods/externalSources/url/podspecWithFilesExample' 
     end
     ```

     `:path`にはPodへのファイルパスを含める必要があります。

   * カスタムPodspecリポジトリからライブラリを追加する場合は、Podfileの冒頭にスペックの[場所](https://guides.cocoapods.org/syntax/podfile.html#source)を指定します。

     ```ruby
     source 'https://github.com/Kotlin/kotlin-cocoapods-spec.git'

     target 'kotlin-cocoapods-xcproj' do
         # ... other dependencies ...
         pod 'example'
     end
     ```

2. プロジェクトディレクトリで`pod install`を実行します。

   `pod install`を初めて実行すると、`.xcworkspace`ファイルが作成されます。このファイルには、元の`.xcodeproj`とCocoaPodsプロジェクトが含まれます。
3. `.xcodeproj`を閉じ、代わりに新しい`.xcworkspace`ファイルを開きます。これにより、プロジェクトの依存関係に関する問題を回避できます。
4. IntelliJ IDEAで**Build** | **Reload All Gradle Projects**を実行（またはAndroid Studioで**File** | **Sync Project with Gradle Files**を実行）して、プロジェクトを再インポートします。

Podfileにこれらの変更を加えない場合、`podInstall`タスクは失敗し、CocoaPodsプラグインはログにエラーメッセージを表示します。

## 考えられる問題と解決策

### CocoaPodsのインストール {initial-collapse-state="collapsed" collapsible="true"}

#### Rubyのインストール

CocoaPodsはRubyでビルドされており、macOSで利用可能なデフォルトのRubyでインストールできます。Ruby 1.9以降には、[CocoaPods依存関係マネージャー](https://guides.cocoapods.org/using/getting-started.html#installation)のインストールに役立つRubyGemsパッケージ管理フレームワークが内蔵されています。

CocoaPodsのインストールや動作に問題が発生している場合は、[このガイド](https://www.ruby-lang.org/en/documentation/installation/)に従ってRubyをインストールするか、[RubyGemsのウェブサイト](https://rubygems.org/pages/download/)を参照してフレームワークをインストールしてください。

#### バージョンの互換性

最新のKotlinバージョンを使用することをお勧めします。このCocoaPodsセットアップの最小要件バージョンは1.7.0です。

### Xcode使用時のビルドエラー {initial-collapse-state="collapsed" collapsible="true"}

CocoaPodsのインストール方法によっては、Xcodeでビルドエラーが発生する場合があります。一般的に、Kotlin Gradleプラグインは`PATH`内の`pod`実行可能ファイルを発見しますが、これは環境によって一貫性がない場合があります。

CocoaPodsのインストールパスを明示的に設定するには、プロジェクトの`local.properties`ファイルに手動で、またはシェルコマンドを使用して追加します。

* コードエディタを使用している場合は、`local.properties`ファイルに以下の行を追加します。

    ```text
    kotlin.apple.cocoapods.bin=/Users/Jane.Doe/.rbenv/shims/pod
    ```

* ターミナルを使用している場合は、以下のコマンドを実行します。

    ```shell
    echo -e "kotlin.apple.cocoapods.bin=$(which pod)" >> local.properties
    ```

### モジュールまたはフレームワークが見つからない {initial-collapse-state="collapsed" collapsible="true"}

Podのインストール時に、[C interop](https://kotlinlang.org/docs/native-c-interop.html)の問題に関連する`module 'SomeSDK' not found`または`framework 'SomeFramework' not found`エラーが発生する場合があります。これらのエラーを解決するには、以下の解決策を試してください。

#### パッケージを更新する

インストールツールとインストール済みパッケージ（gem）を更新します。

<Tabs>
<TabItem title="RVM">

1. RVMを更新します。

   ```bash
   rvm get stable
   ```

2. RubyのパッケージマネージャーであるRubyGemsを更新します。

    ```bash
    gem update --system
    ```

3. インストールされているすべてのgemを最新バージョンにアップグレードします。

    ```bash
    gem update
    ```

</TabItem>
<TabItem title="Rbenv">

1. Rbenvを更新します。

    ```bash
    cd ~/.rbenv
    git pull
    ```

2. RubyのパッケージマネージャーであるRubyGemsを更新します。

    ```bash
    gem update --system
    ```

3. インストールされているすべてのgemを最新バージョンにアップグレードします。

    ```bash
    gem update
    ```

</TabItem>
<TabItem title="Homebrew">

1. Homebrewパッケージマネージャーを更新します。

   ```bash
   brew update
   ```

2. インストールされているすべてのパッケージを最新バージョンにアップグレードします。

   ```bash
   brew upgrade
   ````

</TabItem>
</Tabs>

#### フレームワーク名を指定する

1. ダウンロードされたPodディレクトリ`[shared_module_name]/build/cocoapods/synthetic/IOS/Pods/...`内で`module.modulemap`ファイルを探します。
2. モジュール内のフレームワーク名（例：`SDWebImageMapKit {}`）を確認します。フレームワーク名がPod名と一致しない場合は、明示的に指定します。

    ```kotlin
    pod("SDWebImage/MapKit") {
        moduleName = "SDWebImageMapKit"
    }
    ```

#### ヘッダーを指定する

Podに`.modulemap`ファイルが含まれていない場合（例：`pod("NearbyMessages")`）、メインヘッダーを明示的に指定します。

```kotlin
pod("NearbyMessages") {
    version = "1.1.1"
    headers = "GNSMessages.h"
}
```

詳細については、[CocoaPodsドキュメント](https://guides.cocoapods.org/)を確認してください。何も解決せず、このエラーが引き続き発生する場合は、[YouTrack](https://youtrack.jetbrains.com/newissue?project=kt)で問題を報告してください。

### Rsyncエラー {initial-collapse-state="collapsed" collapsible="true"}

`rsync error: some files could not be transferred`エラーに遭遇する場合があります。これは、Xcodeのアプリケーションターゲットでユーザースクリプトのサンドボックス化が有効になっている場合に発生する[既知の問題](https://github.com/CocoaPods/CocoaPods/issues/11946)です。

この問題を解決するには：

1. アプリケーションターゲットでユーザースクリプトのサンドボックス化を無効にします。

   ![Disable sandboxing CocoaPods](disable-sandboxing-cocoapods.png){width=700}

2. サンドボックス化されている可能性のあるGradleデーモンプロセスを停止します。

    ```shell
    ./gradlew --stop
    ```

## 次のステップ

* [KotlinプロジェクトでPodライブラリへの依存関係を追加する](multiplatform-cocoapods-libraries.md)
* [KotlinプロジェクトとXcodeプロジェクト間の依存関係をセットアップする](multiplatform-cocoapods-xcode.md)
* [CocoaPods GradleプラグインのDSLリファレンス全体を見る](multiplatform-cocoapods-dsl-reference.md)