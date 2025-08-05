[//]: # (title: Swift パッケージのエクスポート設定)

<tldr>
   これはリモート統合の方法です。次の場合に役立ちます。<br/>

   * 最終的なアプリケーションのコードベースを共通のコードベースから分離したい場合。
   * ローカルマシンで既にiOSをターゲットとするKotlin Multiplatformプロジェクトを設定している場合。
   * iOSプロジェクトで依存関係の管理にSwift Package Managerを使用している場合。<br/>

   [最適な統合方法を選択する](multiplatform-ios-integration-overview.md)
</tldr>

Appleターゲット向けのKotlin/Native出力を、Swift Package Manager (SPM) の依存関係として利用できるように設定できます。

iOSターゲットを持つKotlin Multiplatformプロジェクトを考えます。このiOSバイナリを、ネイティブSwiftプロジェクトに取り組むiOS開発者にとって依存関係として利用可能にしたいと思うかもしれません。Kotlin Multiplatformのツールを使用すると、Xcodeプロジェクトにシームレスに統合できる成果物を提供できます。

このチュートリアルでは、Kotlin Gradleプラグインを使用して[XCFrameworks](multiplatform-build-native-binaries.md#build-xcframeworks)をビルドすることで、これを実現する方法を示します。

## リモート統合のセットアップ

フレームワークを利用可能にするには、2つのファイルをアップロードする必要があります。

*   XCFrameworkを含むZIPアーカイブ。これを、直接アクセス可能な便利なファイルストレージ（例：GitHubリリースにアーカイブを添付する、Amazon S3またはMavenを使用する）にアップロードする必要があります。ワークフローに最も統合しやすいオプションを選択してください。
*   パッケージを記述する`Package.swift`ファイル。これを別のGitリポジトリにプッシュする必要があります。

#### プロジェクト設定オプション {initial-collapse-state="collapsed" collapsible="true"}

このチュートリアルでは、XCFrameworkをバイナリとしてお好みのファイルストレージに保存し、`Package.swift`ファイルを別のGitリポジトリに保存します。

ただし、プロジェクトは異なる方法で構成できます。Gitリポジトリを整理するための以下のオプションを検討してください。

*   `Package.swift`ファイルとXCFrameworkにパッケージ化すべきコードを別々のGitリポジトリに保存します。これにより、Swiftマニフェストをファイルが記述するプロジェクトとは別にバージョン管理できます。これは推奨されるアプローチであり、スケーリングが可能で、一般的にメンテナンスが容易です。
*   `Package.swift`ファイルをKotlin Multiplatformコードの隣に置きます。これはより簡単なアプローチですが、この場合、Swiftパッケージとコードが同じバージョン管理を使用することに注意してください。SPMはパッケージのバージョン管理にGitタグを使用するため、プロジェクトで使用するタグと競合する可能性があります。
*   `Package.swift`ファイルをコンシューマプロジェクトのリポジトリ内に保存します。これにより、バージョン管理とメンテナンスの問題を回避できます。ただし、このアプローチは、コンシューマプロジェクトの複数リポジトリSPM設定とさらなる自動化において問題を引き起こす可能性があります。

    *   複数のパッケージを持つプロジェクトでは、外部モジュールに依存できるコンシューマパッケージは1つだけです（プロジェクト内の依存関係の競合を避けるため）。したがって、Kotlin Multiplatformモジュールに依存するすべてのロジックは、特定のコンシューマパッケージ内にカプセル化されるべきです。
    *   自動化されたCIプロセスを使用してKotlin Multiplatformプロジェクトを公開する場合、このプロセスには、更新された`Package.swift`ファイルをコンシューマリポジトリに公開することが含まれる必要があります。これはコンシューマリポジトリの更新の競合につながる可能性があり、CIにおけるそのようなフェーズのメンテナンスは困難になることがあります。

### マルチプラットフォームプロジェクトの設定

以下の例では、Kotlin Multiplatformプロジェクトの共有コードは`shared`モジュールにローカルに保存されています。プロジェクトの構造が異なる場合は、コードとパスの例にある「shared」をモジュール名に置き換えてください。

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

2.  フレームワークを作成するためにGradleタスクを実行します。

    ```shell
    ./gradlew :shared:assembleSharedXCFramework
    ```

    結果として生成されるフレームワークは、プロジェクトディレクトリ内の`shared/build/XCFrameworks/release/Shared.xcframework`フォルダとして作成されます。

    > Compose Multiplatformプロジェクトで作業している場合は、以下のGradleタスクを使用します。
    >
    > ```shell
    > ./gradlew :composeApp:assembleSharedXCFramework
    > ```
    >
    > その後、結果のフレームワークは`composeApp/build/XCFrameworks/release/Shared.xcframework`フォルダで見つけることができます。
    >
    {style="tip"}

### XCFrameworkとSwiftパッケージマニフェストの準備

1.  `Shared.xcframework`フォルダをZIPファイルに圧縮し、結果のアーカイブのチェックサムを計算します。例：

    `swift package compute-checksum Shared.xcframework.zip`

2.  ZIPファイルをお好みのファイルストレージにアップロードします。ファイルは直接リンクでアクセスできる必要があります。例えば、GitHubのリリース機能を使用して行う方法は次のとおりです。

    <deflist collapsible="true">
        <def title="GitHubリリースにアップロードする">
            <list type="decimal">
                <li><a href="https://github.com">GitHub</a>にアクセスし、アカウントにログインします。</li>
                <li>リリースを作成したいリポジトリに移動します。</li>
                <li>右側の<b>Releases</b>セクションで、<b>Create a new release</b>リンクをクリックします。</li>
                <li>リリース情報を入力し、新しいタグを追加または作成し、リリースタイトルを指定して説明を記述します。</li>
                <li>
                    <p>下部の<b>Attach binaries by dropping them here or selecting them</b>フィールドから、XCFrameworkを含むZIPファイルをアップロードします。</p>
                    <img src="github-release-description.png" alt="リリース情報を入力" width="700"/>
                </li>
                <li><b>Publish release</b>をクリックします。</li>
                <li>
                    <p>リリースの<b>Assets</b>セクションで、ZIPファイルを右クリックし、ブラウザで<b>Copy link address</b>または同様のオプションを選択します。</p>
                    <img src="github-release-link.png" alt="アップロードされたファイルへのリンクをコピー" width="500"/>
                </li>
          </list>
        </def>
    </deflist>

3.  [推奨] リンクが機能し、ファイルがダウンロードできることを確認します。ターミナルで以下のコマンドを実行します。

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
6.  [推奨] 結果のマニフェストを検証するには、`Package.swift`ファイルのあるディレクトリで以下のシェルコマンドを実行できます。

    ```shell
    swift package reset && swift package show-dependencies --format json
    ```

    出力には、見つかったエラーが記述されるか、マニフェストが正しい場合は成功したダウンロードと解析結果が表示されます。

7.  `Package.swift`ファイルをリモートリポジトリにプッシュします。パッケージのセマンティックバージョンを含むGitタグを作成し、プッシュすることを忘れないでください。

### パッケージ依存関係の追加

これで両方のファイルにアクセスできるようになったので、作成したパッケージへの依存関係を既存のクライアントiOSプロジェクトに追加するか、新しいプロジェクトを作成できます。パッケージ依存関係を追加するには：

1.  Xcodeで、**File | Add Package Dependencies**を選択します。
2.  検索フィールドに、`Package.swift`ファイルが含まれるGitリポジリのURLを入力します。

    ![パッケージファイルを含むリポジトリを指定](multiplatform-spm-url.png)

3.  **Add package**ボタンをクリックし、パッケージの製品と対応するターゲットを選択します。

    > Swiftパッケージを作成している場合、ダイアログは異なります。この場合、**Copy package**ボタンをクリックします。これにより、`.package`行がクリップボードにコピーされます。この行を自身の`Package.swift`ファイルの[Package.Dependency](https://developer.apple.com/documentation/packagedescription/package/dependency)ブロックに貼り付け、必要な製品を適切な`Target.Dependency`ブロックに追加します。
    >
    {style="tip"}

### セットアップの確認

すべてが正しく設定されていることを確認するために、Xcodeでインポートをテストします。

1.  プロジェクトで、UIビューファイル（例：`ContentView.swift`）に移動します。
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

複数のKotlin MultiplatformモジュールのコードをiOSバイナリとして利用可能にするには、これらのモジュールを単一のアンブレラモジュールに結合します。次に、このアンブレラモジュールのXCFrameworkをビルドおよびエクスポートします。

例えば、`network`モジュールと`database`モジュールがあり、これらを`together`モジュールに結合する場合：

1.  `together/build.gradle.kts`ファイルで、依存関係とフレームワーク構成を指定します。

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

2.  含まれる各モジュールは、例えば、iOSターゲットが設定されている必要があります。

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

3.  `together`フォルダ内に空のKotlinファイル（例：`together/src/commonMain/kotlin/Together.kt`）を作成します。これは、エクスポートされるモジュールにソースコードが含まれていない場合、Gradleスクリプトが現在フレームワークをアセンブルできないための一時的な対処法です。

4.  フレームワークをアセンブルするGradleタスクを実行します。

    ```shell
    ./gradlew :together:assembleTogetherReleaseXCFramework
    ```

5.  [前述のセクション](#prepare-the-xcframework-and-the-swift-package-manifest)の手順に従って、`together.xcframework`を準備します：アーカイブし、チェックサムを計算し、アーカイブされたXCFrameworkをファイルストレージにアップロードし、`Package.swift`ファイルを作成してプッシュします。

これで、Xcodeプロジェクトに依存関係をインポートできます。`import together`ディレクティブを追加すると、`network`モジュールと`database`モジュールの両方のクラスがSwiftコードでインポート可能になるはずです。