[//]: # (title: 直接統合)

<tldr>
   これはローカルな統合方法です。以下の場合に利用できます。<br/>

   * ローカルマシンで既にiOSをターゲットとするKotlin Multiplatformプロジェクトをセットアップしている場合。
   * Kotlin MultiplatformプロジェクトにCocoaPodsの依存関係がない場合。<br/>

   [最適な統合方法を選択する](multiplatform-ios-integration-overview.md)
</tldr>

Kotlin MultiplatformプロジェクトとiOSプロジェクト間でコードを共有しながら同時に開発したい場合は、特別なスクリプトを使用して直接統合をセットアップできます。

このスクリプトは、XcodeでKotlinフレームワークをiOSプロジェクトに接続するプロセスを自動化します。

![Direct integration diagram](direct-integration-scheme.svg){width=700}

このスクリプトは、Xcode環境向けに特別に設計された`embedAndSignAppleFrameworkForXcode` Gradleタスクを使用します。セットアップ中に、iOSアプリビルドの実行スクリプトフェーズに追加します。その後、iOSアプリのビルドを実行する前に、Kotlinアーティファクトがビルドされ、派生データに含まれます。

一般的に、このスクリプトは次のことを行います。

* コンパイルされたKotlinフレームワークを、iOSプロジェクト構造内の正しいディレクトリにコピーします。
* 埋め込まれたフレームワークのコード署名プロセスを処理します。
* Kotlinフレームワークのコード変更がXcodeのiOSアプリに反映されるようにします。

## セットアップ方法

現在CocoaPodsプラグインを使用してKotlinフレームワークを接続している場合は、まず移行してください。プロジェクトにCocoaPodsの依存関係がない場合は、[このステップをスキップしてください](#connect-the-framework-to-your-project)。

### CocoaPodsプラグインからの移行

CocoaPodsプラグインから移行するには：

1. Xcodeで、**Product** | **Clean Build Folder** または <shortcut>Cmd + Shift + K</shortcut> ショートカットを使用してビルドディレクトリをクリーンアップします。
2. Podfileのあるディレクトリで、以下のコマンドを実行します。

    ```none
   pod deintegrate
   ```

3. `build.gradle(.kts)`ファイルから`cocoapods {}`ブロックを削除します。
4. `.podspec`ファイルとPodfileを削除します。

### フレームワークをプロジェクトに接続する

マルチプラットフォームプロジェクトから生成されたKotlinフレームワークをXcodeプロジェクトに接続するには：

1. `embedAndSignAppleFrameworkForXcode`タスクは、`binaries.framework`構成オプションが宣言されている場合にのみ登録されます。Kotlin Multiplatformプロジェクトで、`build.gradle.kts`ファイル内のiOSターゲット宣言を確認してください。
2. Xcodeで、プロジェクト名をダブルクリックしてiOSプロジェクト設定を開きます。
3. 左側の**Targets**セクションでターゲットを選択し、**Build Phases**タブに移動します。
4. **+** をクリックし、**New Run Script Phase**を選択します。

   ![Add run script phase](xcode-run-script-phase-1.png){width=700}

5. 以下のスクリプトを調整し、そのスクリプトを新しいフェーズのスクリプトテキストフィールドに貼り付けます。

   ```bash
   if [ "YES" = "$OVERRIDE_KOTLIN_BUILD_IDE_SUPPORTED" ]; then
       echo "Skipping Gradle build task invocation due to OVERRIDE_KOTLIN_BUILD_IDE_SUPPORTED environment variable set to \"YES\""
       exit 0
   fi
   cd "<Path to the root of the multiplatform project>"
   ./gradlew :<Shared module name>:embedAndSignAppleFrameworkForXcode
   ```

   * `cd`コマンドでは、Kotlin Multiplatformプロジェクトのルートへのパス（例: `$SRCROOT/..`）を指定します。
   * `./gradlew`コマンドでは、共有モジュールの名前（例: `:shared`または`:composeApp`）を指定します。
   
   iOSの実行構成を開始すると、IntelliJ IDEA と Android Studio は Xcode ビルドを開始する前に Kotlin フレームワークの依存関係をビルドし、`OVERRIDE_KOTLIN_BUILD_IDE_SUPPORTED` 環境変数を「YES」に設定します。提供されたシェルスクリプトはこの変数をチェックし、Kotlin フレームワークが Xcode から二重にビルドされるのを防ぎます。
     
   > これをサポートしていないプロジェクトでiOSの実行構成を起動すると、IDEはビルドガードをセットアップするための修正を提案します。
   >
   {style="note"}

6. **Based on dependency analysis**オプションを無効にします。

   ![Add the script](xcode-run-script-phase-2.png){width=700}

   これにより、Xcodeはすべてのビルド中にスクリプトを実行し、出力依存関係の不足について毎回警告を発しなくなります。

7. **Run Script**フェーズを**Compile Sources**フェーズの前に移動して、より上位に配置します。

   ![Drag the Run Script phase](xcode-run-script-phase-3.png){width=700}

8. **Build Settings**タブで、**Build Options**の下にある**User Script Sandboxing**オプションを無効にします。

   ![User Script Sandboxing](disable-sandboxing-in-xcode-project-settings.png){width=700}

   > サンドボックスを最初に無効にせずにiOSプロジェクトをビルドした場合、Gradleデーモンの再起動が必要になることがあります。
   > サンドボックス化された可能性のあるGradleデーモンプロセスを停止します。
   > ```shell
   > ./gradlew --stop
   > ```
   >
   > {style="tip"}

9. Xcodeでプロジェクトをビルドします。すべて正しく設定されていれば、プロジェクトは正常にビルドされます。

> デフォルトの`Debug`または`Release`とは異なるカスタムビルド構成を使用している場合は、**Build Settings**タブの**User-Defined**の下に`KOTLIN_FRAMEWORK_BUILD_TYPE`設定を追加し、`Debug`または`Release`に設定してください。
>
{style="note"}

## 次のステップ

Swiftパッケージマネージャーを使用している場合も、ローカル統合を活用できます。[ローカルパッケージにKotlinフレームワークの依存関係を追加する方法を学ぶ](multiplatform-spm-local-integration.md)。