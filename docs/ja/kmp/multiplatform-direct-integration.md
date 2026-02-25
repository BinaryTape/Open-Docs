[//]: # (title: 直接統合)

<tldr>
   これはローカルでの統合方法です。以下の場合に適しています：<br/>

   * ローカルマシンで iOS をターゲットとした Kotlin Multiplatform プロジェクトをすでにセットアップしている。<br/>
   * Kotlin Multiplatform プロジェクトに CocoaPods の依存関係がない。<br/>

   [自分に最適な統合方法を選択する](multiplatform-ios-integration-overview.md)
</tldr>

Kotlin Multiplatform プロジェクトと iOS プロジェクトでコードを共有しながら同時に開発したい場合、特別なスクリプトを使用して直接統合（direct integration）をセットアップできます。

このスクリプトは、Xcode 内の iOS プロジェクトに Kotlin フレームワークを接続するプロセスを自動化します。

![Direct integration diagram](direct-integration-scheme.svg){width=700}

このスクリプトは、Xcode 環境向けに特別に設計された `embedAndSignAppleFrameworkForXcode` Gradle タスクを使用します。セットアップ中に、このタスクを iOS アプリビルドの Run Script フェーズに追加します。これにより、iOS アプリのビルドが実行される前に Kotlin アーティファクトがビルドされ、派生データ（derived data）に含まれるようになります。

一般的に、このスクリプトは以下の処理を行います：

* コンパイルされた Kotlin フレームワークを iOS プロジェクト構造内の正しいディレクトリにコピーします。
* 埋め込まれたフレームワークのコード署名プロセスを処理します。
* Kotlin フレームワークでのコード変更が Xcode の iOS アプリに反映されるようにします。

## セットアップ方法

現在、Kotlin フレームワークの接続に CocoaPods プラグインを使用している場合は、まず移行を行ってください。プロジェクトに CocoaPods の依存関係がない場合は、[このステップをスキップ](#connect-the-framework-to-your-project)してください。

### CocoaPods プラグインからの移行

CocoaPods プラグインから移行するには：

1. Xcode で、**Product** | **Clean Build Folder** を選択するか、<shortcut>Cmd + Shift + K</shortcut> ショートカットを使用してビルドディレクトリをクリーンアップします。
2. Podfile のあるディレクトリで、次のコマンドを実行します：

    ```none
   pod deintegrate
   ```

3. `build.gradle(.kts)` ファイルから `cocoapods {}` ブロックを削除します。
4. `.podspec` ファイルと Podfile を削除します。

### プロジェクトへのフレームワークの接続

マルチプラットフォームプロジェクトから生成された Kotlin フレームワークを Xcode プロジェクトに接続するには：

1. `embedAndSignAppleFrameworkForXcode` タスクは、`binaries.framework` 構成オプションが宣言されている場合にのみ登録されます。Kotlin Multiplatform プロジェクトの `build.gradle.kts` ファイルで iOS ターゲットの宣言を確認してください。
2. Xcode で、プロジェクト名をダブルクリックして iOS プロジェクト設定を開きます。
3. 左側の **Targets** セクションでターゲットを選択し、**Build Phases** タブに移動します。
4. **+** をクリックし、**New Run Script Phase** を選択します。

   ![Add run script phase](xcode-run-script-phase-1.png){width=700}

5. 以下のスクリプトを調整し、新しいフェーズのスクリプトテキストフィールドに貼り付けます：

   ```bash
   if [ "YES" = "$OVERRIDE_KOTLIN_BUILD_IDE_SUPPORTED" ]; then
       echo "Skipping Gradle build task invocation due to OVERRIDE_KOTLIN_BUILD_IDE_SUPPORTED environment variable set to \"YES\""
       exit 0
   fi
   cd "<Path to the root of the multiplatform project>"
   ./gradlew :<Shared module name>:embedAndSignAppleFrameworkForXcode
   ```

   * `cd` コマンドには、Kotlin Multiplatform プロジェクトのルートへのパスを指定します（例: `$SRCROOT/..`）。
   * `./gradlew` コマンドには、共有モジュールの名前を指定します（例: `:shared` または `:composeApp`）。
   
   iOS の実行構成を開始すると、IntelliJ IDEA と Android Studio は Xcode のビルドを開始する前に Kotlin フレームワークの依存関係をビルドし、環境変数 `OVERRIDE_KOTLIN_BUILD_IDE_SUPPORTED` を "YES" に設定します。提供されたシェルスクリプトはこの変数を確認し、Xcode から Kotlin フレームワークが二重にビルドされるのを防ぎます。
     
   > これをサポートしていないプロジェクトで iOS の実行構成を起動すると、IDE はビルドガードを設定するための修正を提案します。
   >
   {style="note"}

6. **Based on dependency analysis** オプションを無効にします。

   ![Add the script](xcode-run-script-phase-2.png){width=700}

   これにより、Xcode はビルドのたびにスクリプトを実行し、出力の依存関係が欠落しているという警告を毎回出さないようになります。

7. **Run Script** フェーズを上に移動し、**Compile Sources** フェーズの前に配置します。

   ![Drag the Run Script phase](xcode-run-script-phase-3.png){width=700}

8. **Build Settings** タブの **Build Options** にある **User Script Sandboxing** オプションを無効にします。

   ![User Script Sandboxing](disable-sandboxing-in-xcode-project-settings.png){width=700}

   > 最初にサンドボックスを無効にせずに iOS プロジェクトをビルドした場合は、Gradle デーモンの再起動が必要になる場合があります。
   > サンドボックス化された可能性がある Gradle デーモンプロセスを停止してください：
   > ```shell
   > ./gradlew --stop
   > ```
   >
   > {style="tip"}

9. Xcode でプロジェクトをビルドします。すべてが正しくセットアップされていれば、プロジェクトのビルドに成功します。

> デフォルトの `Debug` や `Release` とは異なるカスタムビルド構成を使用している場合は、**Build Settings** タブの **User-Defined** で `KOTLIN_FRAMEWORK_BUILD_TYPE` 設定を追加し、`Debug` または `Release` に設定してください。
>
{style="note"}

## 次のステップ

Swift Package Manager を使用する場合も、ローカル統合を利用できます。[ローカルパッケージ内の Kotlin フレームワークへの依存関係を追加する方法](multiplatform-spm-local-integration.md)を確認してください。