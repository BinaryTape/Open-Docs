---
title: "Swift package のエクスポート設定"
---
:::info

   これはリモート統合方式です。以下の条件に当てはまる場合に利用できます。:<br/>

   * 最終的なアプリケーションのコードベースを共通のコードベースから分離したい場合。
   * ローカルマシン上でiOSをターゲットとするKotlin Multiplatformプロジェクトをすでにセットアップしている場合。
   * iOSプロジェクトで依存関係を処理するためにSwift package managerを使用している場合。<br/>

   [最適な統合方法を選択してください](multiplatform-ios-integration-overview)

:::

Appleターゲット用のKotlin/Native出力を、Swift package manager（SPM）の依存関係として利用できるように設定できます。

iOSターゲットを持つKotlin Multiplatformプロジェクトを考えてみましょう。このiOSバイナリを、ネイティブのSwiftプロジェクトで作業するiOS開発者への依存関係として利用できるようにしたい場合があります。Kotlin Multiplatformツールを使用すると、Xcodeプロジェクトとシームレスに統合できるアーティファクトを提供できます。

このチュートリアルでは、Kotlin Gradleプラグインを使用して[XCFrameworks](multiplatform-build-native-binaries#build-xcframeworks)を構築することで、これを行う方法を示します。

## リモート統合の設定

フレームワークを利用できるようにするには、次の2つのファイルをアップロードする必要があります。

* XCFrameworkを含むZIPアーカイブ。直接アクセスできる便利なファイルストレージにアップロードする必要があります（たとえば、アーカイブを添付したGitHubリリースを作成したり、Amazon S3やMavenを使用したりします）。ワークフローに最も簡単に統合できるオプションを選択してください。
* パッケージを記述する`Package.swift`ファイル。別のGitリポジトリにプッシュする必要があります。

#### プロジェクト構成オプション

このチュートリアルでは、XCFrameworkをバイナリとしてお好みのファイルストレージに保存し、`Package.swift`ファイルを別のGitリポジトリに保存します。

ただし、プロジェクトを異なる方法で構成することもできます。Gitリポジトリを整理するための次のオプションを検討してください。

* `Package.swift`ファイルとXCFrameworkにパッケージ化する必要があるコードを、別々のGitリポジトリに保存します。これにより、Swiftマニフェストを、ファイルが記述するプロジェクトとは別にバージョン管理できます。これは推奨されるアプローチです。スケーリングが可能で、一般的に保守が容易です。
* `Package.swift`ファイルをKotlin Multiplatformコードの隣に配置します。これはより簡単なアプローチですが、この場合、Swiftパッケージとコードが同じバージョン管理を使用することに注意してください。SPMはパッケージのバージョン管理にGitタグを使用しますが、これはプロジェクトに使用されるタグと競合する可能性があります。
* `Package.swift`ファイルを使用する側のプロジェクトのリポジトリ内に保存します。これにより、バージョン管理とメンテナンスの問題を回避できます。ただし、このアプローチは、使用する側のプロジェクトのマルチリポジトリSPMセットアップや、さらなる自動化で問題が発生する可能性があります。

  * マルチパッケージプロジェクトでは、1つの使用する側のパッケージのみが外部モジュールに依存できます（プロジェクト内の依存関係の競合を避けるため）。したがって、Kotlin Multiplatformモジュールに依存するすべてのロジックは、特定の使用する側のパッケージにカプセル化する必要があります。
  * 自動化されたCIプロセスを使用してKotlin Multiplatformプロジェクトを公開する場合、このプロセスには、更新された`Package.swift`ファイルを使用する側のリポジトリに公開することが含まれます。これにより、使用する側のリポジトリの更新が競合する可能性があり、CIのそのようなフェーズの維持が困難になる可能性があります。

### マルチプラットフォームプロジェクトの構成

次の例では、Kotlin Multiplatformプロジェクトの共有コードは、ローカルの`shared`モジュールに保存されています。プロジェクトの構成が異なる場合は、コードとパスの例の「shared」をモジュールの名前に置き換えてください。

XCFrameworkの公開を設定するには:

1. `shared/build.gradle.kts`構成ファイルを、iOSターゲットリストの`XCFramework`呼び出しで更新します。

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
   
2. Gradleタスクを実行して、フレームワークを作成します。
   
   ```shell
   ./gradlew :shared:assembleSharedXCFramework
   ```
  
   結果のフレームワークは、プロジェクトディレクトリの`shared/build/XCFrameworks/release/Shared.xcframework`フォルダーとして作成されます。

   > Compose Multiplatformプロジェクトを使用している場合は、次のGradleタスクを使用してください。
   >
   > ```shell
   > ./gradlew :composeApp:assembleSharedXCFramework
   > ```
   >
   > 結果のフレームワークは、`composeApp/build/XCFrameworks/release/Shared.xcframework`フォルダーにあります。
   >
   

### XCFrameworkとSwiftパッケージマニフェストの準備

1. `Shared.xcframework`フォルダーをZIPファイルに圧縮し、結果のアーカイブのチェックサムを計算します。例:
   
   `swift package compute-checksum Shared.xcframework.zip`

2. ZIPファイルを選択したファイルストレージにアップロードします。ファイルは、直接リンクでアクセスできる必要があります。たとえば、GitHubのリリースを使用してこれを行う方法は次のとおりです。
<h3>GitHubリリースへのアップロード</h3>
<list type="decimal">
<li><a href="https://github.com">GitHub</a>にアクセスし、アカウントにログインします。</li>
<li>リリースを作成するリポジトリに移動します。</li>
<li>右側の<b>Releases</b>セクションで、<b>Create a new release</b>リンクをクリックします。</li>
<li>リリース情報を入力し、新しいタグを追加または作成し、リリースタイトルを指定して説明を記述します。</li>
<li>
<p>
   下部の<b>Attach binaries by dropping them here or selecting them</b>フィールドを使用して、XCFrameworkを含むZIPファイルをアップロードします。
</p>
                   <img src="/img/github-release-description.png" alt="Fill in the release information" width="700"/>
               </li>
<li><b>Publish release</b>をクリックします。</li>
<li>
<p>
   リリースの<b>Assets</b>セクションで、ZIPファイルを右クリックし、<b>Copy link address</b>またはブラウザで同様のオプションを選択します。
</p>
                   <img src="/img/github-release-link.png" alt="Copy the link to the uploaded file" width="500"/>
               </li>
</list>
       
   

3. [推奨] リンクが機能し、ファイルをダウンロードできることを確認します。ターミナルで、次のコマンドを実行します。

    ```none
    curl <ダウンロード可能なXCFramework ZIPファイルへのリンク>
    ```

4. 任意のディレクトリを選択し、次のコードで`Package.swift`ファイルをローカルに作成します。

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
            url: "<アップロードされたXCFramework ZIPファイルへのリンク>",
            checksum:"<ZIPファイル用に計算されたチェックサム>")
      ]
   )
   ```
   
5. `url`フィールドに、XCFrameworkを含むZIPアーカイブへのリンクを指定します。
6. [推奨] 結果のマニフェストを検証するには、ディレクトリで次のシェルコマンドを実行できます。
   `Package.swift`ファイル付き:

    ```shell
    swift package reset && swift package show-dependencies --format json
    ```
    
    出力には、見つかったエラーが記述されるか、マニフェストが正しい場合は、ダウンロードと解析が成功した結果が表示されます。

7. `Package.swift`ファイルをリモートリポジトリにプッシュします。パッケージのセマンティックバージョンでGitタグを作成してプッシュしてください。

### パッケージ依存関係の追加

両方のファイルにアクセスできるようになったので、作成したパッケージへの依存関係を既存のクライアントiOSプロジェクトに追加するか、新しいプロジェクトを作成できます。パッケージの依存関係を追加するには:

1. Xcodeで、**File | Add Package Dependencies**を選択します。
2. 検索フィールドに、`Package.swift`ファイルが含まれるGitリポジトリのURLを入力します。

   <img src="/img/native-spm-url.png" alt="Specify repo with the package file" style={{verticalAlign: 'middle'}}/>

3. **Add package**ボタンを押し、パッケージの製品と対応するターゲットを選択します。

   > Swiftパッケージを作成している場合、ダイアログは異なります。この場合、**Copy package**ボタンを押します。
   > これにより、`.package`行がクリップボードに配置されます。この行を独自の`Package.swift`ファイルの[Package.Dependency](https://developer.apple.com/documentation/packagedescription/package/dependency)
   > ブロックに貼り付け、必要な製品を適切な`Target.Dependency`ブロックに追加します。
   >
   

### セットアップの確認

すべてが正しく設定されていることを確認するには、Xcodeでインポートをテストします。

1. プロジェクトで、UIビューファイル（たとえば、`ContentView.swift`）に移動します。
2. コードを次のスニペットに置き換えます。
   
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
   
    ここでは、`Shared` XCFrameworkをインポートし、それを使用して`Text`フィールドでプラットフォーム名を取得します。

3. プレビューが新しいテキストで更新されていることを確認します。

## 複数のモジュールをXCFrameworkとしてエクスポートする

複数のKotlin MultiplatformモジュールのコードをiOSバイナリとして利用できるようにするには、これらのモジュールを単一のアンブレラモジュールに結合します。次に、このアンブレラモジュールのXCFrameworkを構築してエクスポートします。

たとえば、`network`モジュールと`database`モジュールがあり、これらを`together`モジュールに結合するとします。

1. `together/build.gradle.kts`ファイルで、依存関係とフレームワーク構成を指定します。

    ```kotlin
    kotlin {
        val frameworkName = "together"
        val xcf = XCFramework(frameworkName)
    
        listOf(
            iosX64(),
            iosArm64(),
            iosSimulatorArm64()
        ).forEach { iosTarget `->`
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

2. 含まれる各モジュールには、そのiOSターゲットが構成されている必要があります。例:

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

3. `together`フォルダー内に空のKotlinファイルを作成します。たとえば、`together/src/commonMain/kotlin/Together.kt`です。
   これは回避策です。エクスポートされたモジュールにソースコードが含まれていない場合、Gradleスクリプトは現在フレームワークをアセンブルできません。

4. フレームワークをアセンブルするGradleタスクを実行します。

    ```shell
    ./gradlew :together:assembleTogetherReleaseXCFramework
    ```

5. [前のセクション](#prepare-the-xcframework-and-the-swift-package-manifest)の手順に従って、
   `together.xcframework`を準備します。アーカイブし、チェックサムを計算し、アーカイブされたXCFrameworkをファイルストレージにアップロードし、
   `Package.swift`ファイルを作成してプッシュします。

これで、依存関係をXcodeプロジェクトにインポートできます。`import together`ディレクティブを追加すると、
`network`モジュールと`database`モジュールの両方のクラスをSwiftコードにインポートできるようになります。