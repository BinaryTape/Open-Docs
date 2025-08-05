[//]: # (title: 直接統合)

<tldr>
   これはローカルな統合方法です。以下の場合に役立ちます：<br/>

   * ローカルマシンにiOSをターゲットとするKotlin Multiplatformプロジェクトをすでにセットアップしている場合。
   * Kotlin MultiplatformプロジェクトにCocoaPodsの依存関係がない場合。<br/>

   [最適な統合方法を選択する](multiplatform-ios-integration-overview.md)
</tldr>

Kotlin MultiplatformプロジェクトとiOSプロジェクトを同時に開発し、コードを共有したい場合は、特別なスクリプトを使用して直接統合を設定できます。

このスクリプトは、KotlinフレームワークをXcodeのiOSプロジェクトに接続するプロセスを自動化します。

![Direct integration diagram](direct-integration-scheme.svg){width=700}

このスクリプトは、Xcode環境向けに特別に設計された`embedAndSignAppleFrameworkForXcode` Gradleタスクを使用します。セットアップ中に、iOSアプリのビルドの「Run Script」フェーズに追加します。その後、iOSアプリのビルドを実行する前に、Kotlin成果物がビルドされ、派生データに含まれます。

一般に、このスクリプトは次のことを行います。

* コンパイルされたKotlinフレームワークをiOSプロジェクト構造内の正しいディレクトリにコピーします。
* 組み込みフレームワークのコード署名プロセスを処理します。
* Kotlinフレームワークのコード変更がXcodeのiOSアプリに反映されるようにします。

## セットアップ方法

現在CocoaPodsプラグインを使用してKotlinフレームワークを接続している場合は、まず移行してください。プロジェクトにCocoaPodsの依存関係がない場合は、[このステップをスキップしてください](#connect-the-framework-to-your-project)。

### CocoaPodsプラグインからの移行

CocoaPodsプラグインから移行するには：

1.  Xcodeで、**Product** | **Clean Build Folder** または<shortcut>Cmd + Shift + K</shortcut>ショートカットを使用してビルドディレクトリをクリーンアップします。
2.  Podfileがあるディレクトリで、次のコマンドを実行します。

    ```none
   pod deintegrate
   ```

3.  `build.gradle(.kts)`ファイルから`cocoapods {}`ブロックを削除します。
4.  `.podspec`ファイルとPodfileを削除します。

### フレームワークをプロジェクトに接続する

マルチプラットフォームプロジェクトから生成されたKotlinフレームワークをXcodeプロジェクトに接続するには：

1.  `embedAndSignAppleFrameworkForXcode`タスクは、`binaries.framework`構成オプションが宣言されている場合にのみ登録されます。Kotlin Multiplatformプロジェクトで、`build.gradle.kts`ファイル内のiOSターゲット宣言を確認してください。
2.  Xcodeで、プロジェクト名をダブルクリックしてiOSプロジェクト設定を開きます。
3.  左側の**Targets**セクションでターゲットを選択し、**Build Phases**タブに移動します。
4.  **+**をクリックし、**New Run Script Phase**を選択します。

   ![Add run script phase](xcode-run-script-phase-1.png){width=700}

5.  次のスクリプトを調整し、その結果を実行スクリプトフィールドに貼り付けます。

   ```bash
   cd "<Path to the root of the multiplatform project>"
   ./gradlew :<Shared module name>:embedAndSignAppleFrameworkForXcode 
   ```

   *   `cd`コマンドで、Kotlin Multiplatformプロジェクトのルートへのパスを指定します。例えば、`$SRCROOT/..`など。
   *   `./gradlew`コマンドで、共有モジュールの名前を指定します。例えば、`:shared`や`:composeApp`など。

   ![Add the script](xcode-run-script-phase-2.png){width=700}

6.  **Based on dependency analysis**オプションを無効にします。

   これにより、Xcodeはビルドごとにスクリプトを実行し、出力依存関係の不足について毎回警告することはありません。
7.  **Run Script**フェーズを**Compile Sources**フェーズより上に移動します。

   ![Drag the Run Script phase](xcode-run-script-phase-3.png){width=700}

8.  **Build Settings**タブで、**Build Options**の下にある**User Script Sandboxing**オプションを無効にします。

   ![User Script Sandboxing](disable-sandboxing-in-xcode-project-settings.png){width=700}

   > 最初にサンドボックスを無効にせずにiOSプロジェクトをビルドした場合、Gradleデーモンを再起動する必要がある場合があります。
   > サンドボックス化された可能性のあるGradleデーモンプロセスを停止します。
   > ```shell
   > ./gradlew --stop
   > ```
   >
   > {style="tip"}

9.  Xcodeでプロジェクトをビルドします。すべてが正しく設定されていれば、プロジェクトは正常にビルドされます。

> デフォルトの`Debug`または`Release`とは異なるカスタムビルド構成がある場合は、**Build Settings**タブの**User-Defined**の下に`KOTLIN_FRAMEWORK_BUILD_TYPE`設定を追加し、`Debug`または`Release`に設定してください。
>
{style="note"}

## 次のステップ

Swift Package Managerを使用する場合も、ローカル統合を活用できます。[ローカルパッケージにKotlinフレームワークの依存関係を追加する方法を学ぶ](multiplatform-spm-local-integration.md)。