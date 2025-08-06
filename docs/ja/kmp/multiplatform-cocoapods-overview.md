[//]: # (title: CocoaPodsの概要とセットアップ)

<tldr>
   これはローカルでの統合方法です。以下の場合に役立ちます。

   * CocoaPodsを使用するiOSプロジェクトを含むモノリポジトリ構成をお持ちの場合。
   * ご自身のKotlin MultiplatformプロジェクトがCocoaPodsの依存関係を持っている場合。

   [最適な統合方法を選択する](multiplatform-ios-integration-overview.md)
</tldr>

Kotlin/Nativeは、[CocoaPods依存関係マネージャー](https://cocoapods.org/)との統合を提供します。Podライブラリへの依存関係を追加したり、KotlinプロジェクトをCocoaPodsの依存関係として使用したりできます。

IntelliJ IDEAまたはAndroid StudioでPodの依存関係を直接管理でき、コードのハイライトや補完などの追加機能をすべて利用できます。Xcodeに切り替えることなく、GradleでKotlinプロジェクト全体をビルドできます。

Swift/Objective-Cコードを変更したり、Appleシミュレーターまたはデバイスでアプリケーションを実行したい場合にのみXcodeが必要です。Xcodeで作業するには、まず[Podfileを更新](#update-podfile-for-xcode)してください。

## CocoaPodsで作業するための環境をセットアップする

お好みのインストールツールを使用して、[CocoaPods依存関係マネージャー](https://cocoapods.org/)をインストールします。

<tabs>
<tab title="RVM">

1. まだRVMをインストールしていない場合は、[RVMをインストール](https://rvm.io/rvm/install)します。
2. Rubyをインストールします。特定のバージョンを選択できます。

    ```bash
    rvm install ruby 3.0.0
    ```

3. CocoaPodsをインストールします。

    ```bash
    sudo gem install -n /usr/local/bin cocoapods
    ```

</tab>
<tab title="Rbenv">

1. まだrbenvをインストールしていない場合は、[GitHubからrbenvをインストール](https://github.com/rbenv/rbenv#installation)します。
2. Rubyをインストールします。特定のバージョンを選択できます。

    ```bash
    rbenv install 3.0.0
    ```

3. Rubyのバージョンを特定のディレクトリに対してローカルに設定するか、マシン全体に対してグローバルに設定します。

    ```bash
    rbenv global 3.0.0
    ```
    
4. CocoaPodsをインストールします。

    ```bash
    sudo gem install -n /usr/local/bin cocoapods
    ```

</tab>
<tab title="デフォルトのRuby">

> このインストール方法は、Apple Mチップ搭載デバイスでは動作しません。CocoaPodsで作業する環境をセットアップするには、他のツールを使用してください。
>
{style="note"}

macOSで利用可能なデフォルトのRubyを使用して、CocoaPods依存関係マネージャーをインストールできます。

```bash
sudo gem install cocoapods
```

</tab>
<tab title="Homebrew">

> HomebrewでのCocoaPodsのインストールは、互換性の問題を引き起こす可能性があります。
>
> CocoaPodsのインストール時、HomebrewはXcodeでの作業に必要な[Xcodeproj](https://github.com/CocoaPods/Xcodeproj) gemもインストールします。
> しかし、これはHomebrewで更新できず、インストールされたXcodeprojが最新のXcodeバージョンをまだサポートしていない場合、Podのインストールでエラーが発生します。この場合は、CocoaPodsをインストールするために他のツールを試してください。
>
{style="warning"}

1. まだHomebrewをインストールしていない場合は、[Homebrewをインストール](https://brew.sh/)します。
2. CocoaPodsをインストールします。

    ```bash
    brew install cocoapods
    ```

</tab>
</tabs>

インストール中に問題が発生した場合は、「[起こりうる問題と解決策](#possible-issues-and-solutions)」セクションを確認してください。

## プロジェクトを作成する

環境がセットアップできたら、新しいKotlin Multiplatformプロジェクトを作成できます。そのためには、Kotlin MultiplatformウェブウィザードまたはAndroid Studio用のKotlin Multiplatformプラグインを使用します。

### ウェブウィザードを使用する

ウェブウィザードを使用してプロジェクトを作成し、CocoaPods統合を構成するには：

1. [Kotlin Multiplatformウィザード](https://kmp.jetbrains.com)を開き、プロジェクトのターゲットプラットフォームを選択します。
2. **Download**ボタンをクリックし、ダウンロードしたアーカイブを解凍します。
3. Android Studioで、メニューから**File | Open**を選択します。
4. 解凍したプロジェクトフォルダに移動し、**Open**をクリックします。
5. Kotlin CocoaPods Gradleプラグインをバージョンカタログに追加します。`gradle/libs.versions.toml`ファイルに、`[plugins]`ブロックに以下の宣言を追加します。
 
   ```text
   kotlinCocoapods = { id = "org.jetbrains.kotlin.native.cocoapods", version.ref = "kotlin" }
   ```
   
6. プロジェクトのルート`build.gradle.kts`ファイルに移動し、`plugins {}`ブロックに以下のエイリアスを追加します。

   ```kotlin
   alias(libs.plugins.kotlinCocoapods) apply false
   ```

7. CocoaPodsを統合したいモジュール、例えば`composeApp`モジュールを開き、`plugins {}`ブロックに以下のエイリアスを追加します。

   ```kotlin
   alias(libs.plugins.kotlinCocoapods)
   ```

これで、[Kotlin MultiplatformプロジェクトでCocoaPodsを構成](#configure-the-project)する準備ができました。

### Android Studioで

Android StudioでCocoaPods統合を使用してプロジェクトを作成するには：

1. Android Studioに[Kotlin Multiplatformプラグイン](https://plugins.jetbrains.com/plugin/14936-kotlin-multiplatform)をインストールします。
2. Android Studioで、メニューから**File** | **New** | **New Project**を選択します。
3. プロジェクトテンプレートのリストから**Kotlin Multiplatform App**を選択し、**Next**をクリックします。
4. アプリケーションに名前を付け、**Next**をクリックします。
5. iOSフレームワークの配布オプションとして**CocoaPods Dependency Manager**を選択します。

   ![Android Studio wizard with the Kotlin Multiplatform plugin](as-project-wizard.png){width=700}

6. 他のすべてのオプションはデフォルトのままにします。**Finish**をクリックします。

   プラグインが自動的にCocoaPods統合がセットアップされたプロジェクトを生成します。

## プロジェクトを構成する

Kotlin MultiplatformプロジェクトでKotlin CocoaPods Gradleプラグインを構成するには：

1. プロジェクトの共有モジュールの`build.gradle(.kts)`に、CocoaPodsプラグインとKotlin Multiplatformプラグインを適用します。

   > [ウェブウィザード](#using-web-wizard)または[Android Studio用のKotlin Multiplatformプラグイン](#in-android-studio)でプロジェクトを作成した場合は、この手順をスキップしてください。
   > 
   {style="note"}
    
    ```kotlin
    plugins {
        kotlin("multiplatform") version "%kotlinVersion%"
        kotlin("native.cocoapods") version "%kotlinVersion%"
    }
    ```

2. `cocoapods`ブロックで、Podspecファイルの`version`、`summary`、`homepage`、`baseName`を設定します。
    
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

    > Kotlin DSLの完全な構文については、[Kotlin Gradleプラグインリポジトリ](https://github.com/JetBrains/kotlin/blob/master/libraries/tools/kotlin-gradle-plugin/src/common/kotlin/org/jetbrains/kotlin/gradle/targets/native/cocoapods/CocoapodsExtension.kt)を参照してください。
    >
    {style="note"}
    
3. IntelliJ IDEAで**Build** | **Reload All Gradle Projects**を実行（またはAndroid Studioで**File** | **Sync Project with Gradle Files**を実行）して、プロジェクトを再インポートします。
4. Xcodeビルド時の互換性問題を避けるため、[Gradle wrapper](https://docs.gradle.org/current/userguide/gradle_wrapper.html)を生成します。

適用されると、CocoaPodsプラグインは以下のことを行います。

* すべてのmacOS、iOS、tvOS、およびwatchOSターゲットに対して、`debug`と`release`の両方のフレームワークを出力バイナリとして追加します。
* プロジェクト用の[Podspec](https://guides.cocoapods.org/syntax/podspec.html)ファイルを生成する`podspec`タスクを作成します。

`Podspec`ファイルには、出力フレームワークへのパスと、Xcodeプロジェクトのビルドプロセス中にこのフレームワークのビルドを自動化するスクリプトフェーズが含まれています。

## Xcode用にPodfileを更新する

KotlinプロジェクトをXcodeプロジェクトにインポートしたい場合：

1. KotlinプロジェクトのiOS部分で、Podfileに変更を加えます。

   * プロジェクトにGit、HTTP、またはカスタムPodspecリポジトリの依存関係がある場合、PodfileでPodspecへのパスを指定します。

     例えば、`podspecWithFilesExample`への依存関係を追加する場合、PodfileでPodspecへのパスを宣言します。

     ```ruby
     target 'ios-app' do
        # ... other dependencies ...
        pod 'podspecWithFilesExample', :path => 'cocoapods/externalSources/url/podspecWithFilesExample' 
     end
     ```

     `:path`にはPodへのファイルパスを含める必要があります。

   * カスタムPodspecリポジトリからライブラリを追加する場合、Podfileの冒頭でスペックの[場所](https://guides.cocoapods.org/syntax/podfile.html#source)を指定します。

     ```ruby
     source 'https://github.com/Kotlin/kotlin-cocoapods-spec.git'

     target 'kotlin-cocoapods-xcproj' do
         # ... other dependencies ...
         pod 'example'
     end
     ```

2. プロジェクトディレクトリで`pod install`を実行します。

   初めて`pod install`を実行すると、`.xcworkspace`ファイルが作成されます。このファイルには、元の`.xcodeproj`とCocoaPodsプロジェクトが含まれます。
3. `.xcodeproj`を閉じて、代わりに新しい`.xcworkspace`ファイルを開きます。これにより、プロジェクトの依存関係に関する問題を回避できます。
4. IntelliJ IDEAで**Build** | **Reload All Gradle Projects**を実行（またはAndroid Studioで**File** | **Sync Project with Gradle Files**を実行）して、プロジェクトを再インポートします。

これらの変更をPodfileで行わないと、`podInstall`タスクが失敗し、CocoaPodsプラグインがログにエラーメッセージを表示します。

## 起こりうる問題と解決策

### CocoaPodsのインストール {initial-collapse-state="collapsed" collapsible="true"}

#### Rubyのインストール

CocoaPodsはRubyで構築されており、macOSで利用可能なデフォルトのRubyでインストールできます。
Ruby 1.9以降には、[CocoaPods依存関係マネージャー](https://guides.cocoapods.org/using/getting-started.html#installation)のインストールを支援する組み込みのRubyGemsパッケージ管理フレームワークがあります。

CocoaPodsのインストールと動作に問題がある場合は、[このガイド](https://www.ruby-lang.org/en/documentation/installation/)に従ってRubyをインストールするか、フレームワークをインストールするために[RubyGemsウェブサイト](https://rubygems.org/pages/download/)を参照してください。

#### バージョンの互換性

最新のKotlinバージョンを使用することをお勧めします。現在のバージョンが1.7.0より古い場合、追加で[`cocoapods-generate`](https://github.com/square/cocoapods-generate#installation")プラグインをインストールする必要があります。

しかし、`cocoapods-generate`はRuby 3.0.0以降と互換性がありません。この場合、Rubyをダウングレードするか、Kotlinを1.7.0以降にアップグレードしてください。

### Xcode使用時のビルドエラー {initial-collapse-state="collapsed" collapsible="true"}

CocoaPodsのインストールのいくつかのバリエーションは、Xcodeでビルドエラーを引き起こす可能性があります。
一般的に、Kotlin Gradleプラグインは`PATH`内の`pod`実行可能ファイルを発見しますが、これは環境によって一貫性がない場合があります。

CocoaPodsのインストールパスを明示的に設定するには、プロジェクトの`local.properties`ファイルに手動で、またはシェルコマンドを使用して追加できます。

* コードエディタを使用する場合、`local.properties`ファイルに以下の行を追加します。

    ```text
    kotlin.apple.cocoapods.bin=/Users/Jane.Doe/.rbenv/shims/pod
    ```

* ターミナルを使用する場合、以下のコマンドを実行します。

    ```shell
    echo -e "kotlin.apple.cocoapods.bin=$(which pod)" >> local.properties
    ```

### モジュールまたはフレームワークが見つからない {initial-collapse-state="collapsed" collapsible="true"}

Podをインストールする際、[C interop](https://kotlinlang.org/docs/native-c-interop.html)の問題に関連する`module 'SomeSDK' not found`または`framework 'SomeFramework' not found`エラーが発生する場合があります。このようなエラーを解決するには、以下の解決策を試してください。

#### パッケージの更新

インストールツールとインストール済みパッケージ（gem）を更新します。

<tabs>
<tab title="RVM">

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

</tab>
<tab title="Rbenv">

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

</tab>
<tab title="Homebrew">

1. Homebrewパッケージマネージャーを更新します。 

   ```bash
   brew update
   ```

2. インストールされているすべてのパッケージを最新バージョンにアップグレードします。

   ```bash
   brew upgrade
   ````

</tab>
</tabs>

#### フレームワーク名を指定する

1. ダウンロードしたPodディレクトリ`[shared_module_name]/build/cocoapods/synthetic/IOS/Pods/...`で`module.modulemap`ファイルを探します。
2. モジュール内のフレームワーク名、例えば`SDWebImageMapKit {}`を確認します。フレームワーク名がPod名と一致しない場合、明示的に指定します。

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

詳細については、[CocoaPodsドキュメント](https://guides.cocoapods.org/)を確認してください。何も機能せず、引き続きこのエラーが発生する場合は、[YouTrack](https://youtrack.jetbrains.com/newissue?project=kt)で問題を報告してください。

### Rsyncエラー {initial-collapse-state="collapsed" collapsible="true"}

`rsync error: some files could not be transferred`というエラーに遭遇する場合があります。これは、Xcodeのアプリケーションターゲットでユーザースクリプトのサンドボックス化が有効になっている場合に発生する[既知の問題](https://github.com/CocoaPods/CocoaPods/issues/11946)です。

この問題を解決するには：

1. アプリケーションターゲットでユーザースクリプトのサンドボックス化を無効にします。

   ![Disable sandboxing CocoaPods](disable-sandboxing-cocoapods.png){width=700}

2. サンドボックス化されている可能性のあるGradleデーモンプロセスを停止します。

    ```shell
    ./gradlew --stop
    ```

## 次のステップ

* [KotlinプロジェクトでPodライブラリへの依存関係を追加する](multiplatform-cocoapods-libraries.md)
* [KotlinプロジェクトとXcodeプロジェクト間の依存関係を設定する](multiplatform-cocoapods-xcode.md)
* [CocoaPods GradleプラグインDSLリファレンスの全容を見る](multiplatform-cocoapods-dsl-reference.md)