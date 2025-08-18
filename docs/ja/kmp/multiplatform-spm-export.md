[//]: # (title: Swiftパッケージのエクスポート設定)

<tldr>
   これはリモート統合メソッドです。以下の場合に利用できます：<br/>

   * 最終アプリケーションのコードベースを共通コードベースから分離したい場合。
   * ローカルマシンで既にiOSをターゲットとするKotlin Multiplatformプロジェクトをセットアップ済みの場合。
   * iOSプロジェクトの依存関係の処理にSwiftパッケージマネージャーを使用している場合。<br/>

   [最適な統合方法を選択してください](multiplatform-ios-integration-overview.md)
</tldr>

Appleターゲット向けのKotlin/Native出力を、Swift Package Manager (SPM) の依存関係として利用できるように設定できます。

iOSターゲットを持つKotlin Multiplatformプロジェクトを考えてみましょう。このiOSバイナリを、ネイティブSwiftプロジェクトで作業するiOS開発者向けの依存関係として利用可能にしたい場合があります。Kotlin Multiplatformツールを利用することで、彼らのXcodeプロジェクトとシームレスに統合できるアーティファクトを提供できます。

このチュートリアルでは、Kotlin Gradleプラグインを使用して[XCFrameworks](multiplatform-build-native-binaries.md#build-xcframeworks)をビルドすることで、これを行う方法を示します。

## リモート統合の設定

フレームワークを利用可能にするには、2つのファイルをアップロードする必要があります。

*   XCFrameworkを含むZIPアーカイブ。これを、直接アクセス可能な便利なファイルストレージ（例えば、アーカイブを添付したGitHubリリースを作成する、Amazon S3やMavenを使用するなど）にアップロードする必要があります。
    ワークフローに最も統合しやすいオプションを選択してください。
*   パッケージを記述する`Package.swift`ファイル。これを別のGitリポジトリにプッシュする必要があります。

#### プロジェクト構成オプション {initial-collapse-state="collapsed" collapsible="true"}

このチュートリアルでは、XCFrameworkをバイナリとしてお好みのファイルストレージに保存し、`Package.swift`ファイルを別のGitリポジトリに保存します。

ただし、プロジェクトを異なる方法で構成することもできます。Gitリポジトリを整理するための以下のオプションを検討してください。

*   `Package.swift`ファイルとXCFrameworkにパッケージ化されるべきコードを別々のGitリポジトリに保存します。これにより、ファイルが記述するプロジェクトとは別にSwiftマニフェストのバージョン管理を行うことができます。これは推奨されるアプローチであり、拡張が可能で、一般的に保守が容易です。
*   `Package.swift`ファイルをKotlin Multiplatformコードの隣に配置します。これはより簡単なアプローチですが、この場合、Swiftパッケージとコードが同じバージョン管理を使用することに注意してください。SPMはパッケージのバージョン管理にGitタグを使用しますが、これはプロジェクトで使用されるタグと競合する可能性があります。
*   `Package.swift`ファイルをコンシューマプロジェクトのリポジトリ内に保存します。これはバージョン管理とメンテナンスの問題を回避するのに役立ちます。ただし、このアプローチはコンシューマプロジェクトのマルチリポジトリSPM設定とさらなる自動化で問題を引き起こす可能性があります。

    *   マルチパッケージプロジェクトでは、（プロジェクト内の依存関係の競合を避けるため）1つのコンシューマパッケージのみが外部モジュールに依存できます。したがって、Kotlin Multiplatformモジュールに依存するすべてのロジックは、特定のコンシューマパッケージにカプセル化されるべきです。
    *   自動化されたCIプロセスを使用してKotlin Multiplatformプロジェクトを公開する場合、このプロセスには更新された`Package.swift`ファイルをコンシューマリポジトリに公開することを含む必要があります。これはコンシューマリポジトリの更新の競合につながる可能性があり、CIにおけるそのようなフェーズは維持が困難になる可能性があります。

### マルチプラットフォームプロジェクトの設定

以下の例では、Kotlin Multiplatformプロジェクトの共有コードは、`shared`モジュールにローカルに保存されています。プロジェクトの構造が異なる場合は、コードおよびパスの例で"shared"をモジュール名に置き換えてください。

XCFrameworkの公開を設定するには：

1.  `shared/build.gradle.kts`構成ファイルをiOSターゲットリスト内の`XCFramework`呼び出しで更新します。

    ```kotlin
    import org.jetbrains.kotlin.gradle.plugin.mpp.apple.XCFramework
    
    kotlin {
        // Other Kotlin Multiplatform targets
        // ...
        // Name of the module to be imported in the consumer project
        val xcframeworkName = "Shared"
        val xcf = XCFramework(xcframeworkName)
    
        listOf(
            iosX64(),
            iosArm64(),
            iosSimulatorArm64(),
        ).forEach { 
            it.binaries.framework {
                baseName = xcframeworkName
                
                // Specify CFBundleIdentifier to uniquely identify the framework
                binaryOption("bundleId", "org.example.${xcframeworkName}")
                xcf.add(this)
                isStatic = true
            }
        }
        //...
    }
    ```

2.  フレームワークを作成するためのGradleタスクを実行します。

    ```shell
    ./gradlew :shared:assembleSharedXCFramework
    ```

    結果のフレームワークは、プロジェクトディレクトリ内の`shared/build/XCFrameworks/release/Shared.xcframework`フォルダーとして作成されます。

    > In case you work with a Compose Multiplatform project, use the following Gradle task:
    >
    > ```shell
    > ./gradlew :composeApp:assembleSharedXCFramework
    > ```
    >
    > You can then find the resulting framework in the `composeApp/build/XCFrameworks/release/Shared.xcframework` folder.
    >
    {style="tip"}

### XCFrameworkとSwiftパッケージマニフェストの準備

1.  `Shared.xcframework`フォルダーをZIPファイルに圧縮し、結果のアーカイブのチェックサムを計算します。例えば、次のようになります。

    `swift package compute-checksum Shared.xcframework.zip`

2.  ZIPファイルをお好みのファイルストレージにアップロードします。ファイルは直接リンクでアクセスできる必要があります。例えば、GitHubのリリース機能を使用して行う方法は次のとおりです。

    <deflist collapsible="true">
        <def title="GitHubリリースへのアップロード">
            <list type="decimal">
                <li><a href="https://github.com">GitHub</a>にアクセスし、アカウントにログインします。</li>
                <li>リリースを作成したいリポジトリに移動します。</li>
                <li>右側の<b>Releases</b>セクションで、<b>Create a new release</b>リンクをクリックします。</li>
                <li>リリース情報を入力し、新しいタグを追加または作成し、リリースタイトルを指定し、説明を記述します。</li>
                <li>
                    <p>下部の<b>Attach binaries by dropping them here or selecting them</b>フィールドから、XCFrameworkを含むZIPファイルをアップロードします。</p>
                    <img src="github-release-description.png" alt="Fill in the release information" width="700"/>
                </li>
                <li><b>Publish release</b>をクリックします。</li>
                <li>
                    <p>リリースの<b>Assets</b>セクションで、ZIPファイルを右クリックし、ブラウザで<b>Copy link address</b>または同様のオプションを選択します。</p>
                    <img src="github-release-link.png" alt="Copy the link to the uploaded file" width="500"/>
                </li>
          </list>
        </def>
    </deflist>

3.  [推奨] リンクが機能し、ファイルがダウンロードできることを確認します。ターミナルで、次のコマンドを実行します。

    ```none
    curl <downloadable link to the uploaded XCFramework ZIP file>
    ```

4.  任意のディレクトリを選択し、以下のコードで`Package.swift`ファイルをローカルに作成します。

    ```Swift
    // swift-tools-version:5.3
    import PackageDescription
     
    let package = Package(
       name: "Shared",
       platforms: [
         .iOS(.v14),
       ],
       products: [
          .library(name: "Shared", targets: ["Shared"])
       ],
       targets: [
          .binaryTarget(
             name: "Shared",
             url: "<link to the uploaded XCFramework ZIP file>",
             checksum:"<checksum calculated for the ZIP file>")
       ]
    )
    ```

5.  `url`フィールドに、XCFrameworkを含むZIPアーカイブへのリンクを指定します。
6.  [推奨] 結果のマニフェストを検証するには、`Package.swift`ファイルがあるディレクトリで次のシェルコマンドを実行します。

    ```shell
    swift package reset && swift package show-dependencies --format json
    ```

    マニフェストが正しい場合、出力は発見されたエラーを記述するか、成功したダウンロードおよびパース結果を表示します。

7.  `Package.swift`ファイルをリモートリポジトリにプッシュします。パッケージのセマンティックバージョンを含むGitタグを作成し、プッシュしてください。

### パッケージ依存関係の追加

両方のファイルがアクセス可能になったので、作成したパッケージへの依存関係を既存のクライアントiOSプロジェクトに追加するか、新しいプロジェクトを作成できます。パッケージ依存関係を追加するには：

1.  Xcodeで、**File | Add Package Dependencies**を選択します。
2.  検索フィールドに、`Package.swift`ファイルを含むGitリポジトリのURLを入力します。

    ![Specify repo with the package file](multiplatform-spm-url.png)

3.  **Add package**ボタンをクリックし、パッケージのプロダクトと対応するターゲットを選択します。

    > If you're making a Swift package, the dialog is different. In this case, click the **Copy package** button. This puts a `.package` line in your clipboard. Paste this line into the [Package.Dependency](https://developer.apple.com/documentation/packagedescription/package/dependency) block of your own `Package.swift` file and add the necessary product to the appropriate `Target.Dependency` block.
    >
    {style="tip"}

### セットアップの確認

すべてが正しく設定されていることを確認するには、Xcodeでインポートをテストします。

1.  プロジェクトで、例えば`ContentView.swift`のようなUIビューファイルに移動します。
2.  コードを以下のスニペットに置き換えます。

    ```Swift
    import SwiftUI
    import Shared
    
    struct ContentView: View {
        var body: some View {
            VStack {
                Image(systemName: "globe")
                    .imageScale(.large)
                    .foregroundStyle(.tint)
                Text("Hello, world! \(Shared.Platform_iosKt.getPlatform().name)")
            }
            .padding()
        }
    }
    
    #Preview {
        ContentView()
    }
    ```

    ここでは、`Shared` XCFrameworkをインポートし、それを使用して`Text`フィールドでプラットフォーム名を取得しています。

3.  プレビューが新しいテキストで更新されることを確認します。

## 複数のモジュールをXCFrameworkとしてエクスポートする

複数のKotlin MultiplatformモジュールのコードをiOSバイナリとして利用可能にするには、これらのモジュールを単一のアンブレラモジュールに結合します。その後、このアンブレラモジュールのXCFrameworkをビルドおよびエクスポートします。

例えば、`network`と`database`モジュールがあり、これらを`together`モジュールに結合します。

1.  `together/build.gradle.kts`ファイルで、依存関係とフレームワークの構成を指定します。

    ```kotlin
    kotlin {
        val frameworkName = "together"
        val xcf = XCFramework(frameworkName)
    
        listOf(
            iosX64(),
            iosArm64(),
            iosSimulatorArm64()
        ).forEach { iosTarget ->
            // Same as in the example above,
            // with added export calls for dependencies
            iosTarget.binaries.framework {
                export(projects.network)
                export(projects.database)
    
                baseName = frameworkName
                xcf.add(this)
            }
        }
    
        // Dependencies set as "api" (as opposed to "implementation") to export underlying modules
        sourceSets {
            commonMain.dependencies {
                api(projects.network)
                api(projects.database)
            }
        }
    }
    ```

2.  含まれる各モジュールには、例えば次のようにiOSターゲットが構成されている必要があります。

    ```kotlin
    kotlin {
        androidTarget {
            //...
        }
        
        iosX64()
        iosArm64()
        iosSimulatorArm64()
        
        //...
    }
    ```

3.  `together`フォルダー内に空のKotlinファイルを作成します。例えば、`together/src/commonMain/kotlin/Together.kt`です。これはワークアラウンドであり、現在Gradleスクリプトはエクスポートされるモジュールにソースコードが含まれていない場合、フレームワークをアセンブルできません。

4.  フレームワークをアセンブルするGradleタスクを実行します。

    ```shell
    ./gradlew :together:assembleTogetherReleaseXCFramework
    ```

5.  [前のセクション](#prepare-the-xcframework-and-the-swift-package-manifest)の手順に従って`together.xcframework`を準備します。つまり、アーカイブし、チェックサムを計算し、アーカイブされたXCFrameworkをファイルストレージにアップロードし、`Package.swift`ファイルを作成してプッシュします。

これで、依存関係をXcodeプロジェクトにインポートできます。`import together`ディレクティブを追加すると、Swiftコードで`network`モジュールと`database`モジュールの両方からのクラスをインポートできるようになります。