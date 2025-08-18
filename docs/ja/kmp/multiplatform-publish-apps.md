[//]: # (title: アプリケーションを公開する)

アプリのリリース準備が整ったら、公開してユーザーに届けましょう。

モバイルアプリの場合、各プラットフォームで複数のストアが利用可能ですが、この記事では公式ストアに焦点を当てます。[Google Play ストア](https://play.google.com/store)と[Apple App Store](https://www.apple.com/ios/app-store/)です。Webアプリの場合、[GitHub Pages](https://pages.github.com/)を使用します。

Kotlin Multiplatformアプリケーションを公開するための準備方法について学び、このプロセスで特に注意すべき点を強調します。

## Androidアプリ

[KotlinはAndroid開発の主要言語](https://developer.android.com/kotlin)であるため、Kotlin MultiplatformがプロジェクトのコンパイルやAndroidアプリのビルドに明確な影響を与えることはありません。共有モジュールから生成されるAndroidライブラリとAndroidアプリ自体は、いずれも一般的なAndroid Gradleモジュールであり、他のAndroidライブラリやアプリと何ら変わりありません。したがって、Kotlin MultiplatformプロジェクトからAndroidアプリを公開するプロセスは、[Android開発者ドキュメント](https://developer.google.com/studio/publish)に記載されている通常のプロセスと変わりません。

## iOSアプリ

Kotlin MultiplatformプロジェクトのiOSアプリは一般的なXcodeプロジェクトからビルドされるため、公開に関わる主要な段階は、[iOS開発者ドキュメント](https://developer.apple.com/ios/submit/)に記載されているものと同じです。

> App StoreポリシーのSpring'24での変更により、プライバシーマニフェストの不足または不完全な場合、アプリに警告が表示されたり、拒否されたりする可能性があります。
> 詳細および回避策、特にKotlin Multiplatformアプリについては、[iOSアプリのプライバシーマニフェスト](https://kotlinlang.org/docs/apple-privacy-manifest.html)を参照してください。
>
{style="note"}

Kotlin Multiplatformプロジェクトに特有なのは、共有Kotlinモジュールをフレームワークにコンパイルし、それをXcodeプロジェクトにリンクすることです。
一般的に、共有モジュールとXcodeプロジェクト間の統合は、[Android Studio用Kotlin Multiplatformプラグイン](https://plugins.jetbrains.com/plugin/14936-kotlin-multiplatform-mobile)によって自動的に行われます。
ただし、プラグインを使用しない場合は、XcodeでiOSプロジェクトをビルドおよびバンドルする際に以下の点に留意してください。

*   共有Kotlinライブラリはネイティブフレームワークにコンパイルされます。
*   特定のプラットフォーム用にコンパイルされたフレームワークをiOSアプリプロジェクトに接続する必要があります。
*   Xcodeプロジェクト設定で、ビルドシステムが検索するフレームワークへのパスを指定します。
*   プロジェクトをビルドした後、アプリを起動してテストし、ランタイムでフレームワークを使用する際に問題がないことを確認する必要があります。

共有KotlinモジュールをiOSプロジェクトに接続するには、2つの方法があります。
*   [Kotlin CocoaPods Gradleプラグイン](multiplatform-cocoapods-overview.md)を使用します。これにより、ネイティブターゲットを持つマルチプラットフォームプロジェクトをiOSプロジェクト内でCocoaPodsの依存関係として使用できます。
*   マルチプラットフォームプロジェクトを手動で設定してiOSフレームワークを作成し、Xcodeプロジェクトでその最新バージョンを取得するようにします。この設定は、通常、Kotlin MultiplatformウィザードまたはAndroid Studio用Kotlin Multiplatformプラグインが行います。[フレームワークをiOSプロジェクトに接続する](multiplatform-integrate-in-existing-app.md#configure-the-ios-project-to-use-a-kmp-framework)を参照して、Xcodeでフレームワークを直接追加する方法を学んでください。

### iOSアプリケーションの構成

Xcodeを使用せずに、結果として生成されるアプリに影響を与える基本的なプロパティを構成できます。

#### バンドルID

[バンドルID](https://developer.apple.com/documentation/bundleresources/information_property_list/cfbundleidentifier#discussion)は、オペレーティングシステムでアプリを一意に識別します。これを変更するには、Android Studioで`iosApp/Configuration/Config.xcconfig`ファイルを開き、`BUNDLE_ID`を更新します。

#### アプリ名

アプリ名は、ターゲットの実行可能ファイルおよびアプリケーションバンドル名を設定します。アプリ名を変更するには、次の手順を実行します。

*   Android Studioでプロジェクトをまだ開いていない場合は、`iosApp/Configuration/Config.xcconfig`ファイル内の`APP_NAME`オプションを任意のテキストエディタで直接変更できます。
*   Android Studioでプロジェクトをすでに開いている場合は、次の手順を実行します。

  1.  プロジェクトを閉じます。
  2.  任意のテキストエディタで、`iosApp/Configuration/Config.xcconfig`ファイル内の`APP_NAME`オプションを変更します。
  3.  Android Studioでプロジェクトを再度開きます。

他の設定を構成する必要がある場合は、Xcodeを使用します。Android Studioでプロジェクトを開いた後、Xcodeで`iosApp/iosApp.xcworkspace`ファイルを開き、そこで変更を行います。

### クラッシュレポートのシンボリケーション

開発者がアプリを改善できるように、iOSはアプリのクラッシュを分析する手段を提供しています。詳細なクラッシュ分析のために、クラッシュレポート内のメモリアドレスと、関数や行番号などのソースコード内の場所を照合する特殊なデバッグシンボル（`.dSYM`）ファイルを使用します。

デフォルトでは、共有Kotlinモジュールから生成されるiOSフレームワークのリリースバージョンには、付随する`.dSYM`ファイルがあります。これは、共有モジュールのコードで発生するクラッシュを分析するのに役立ちます。

クラッシュレポートのシンボリケーションに関する詳細については、[Kotlin/Nativeドキュメント](https://kotlinlang.org/docs/native-debugging.html#debug-ios-applications)を参照してください。

## Webアプリ

Webアプリケーションを公開するには、コンパイルされたファイルとアプリケーションを構成するリソースを含む成果物を作成します。これらの成果物は、GitHub PagesのようなWebホスティングプラットフォームにアプリケーションをデプロイするために必要です。

### 成果物の生成

**wasmJsBrowserDistribution**タスクを実行するための実行構成を作成します。

1.  **Run | Edit Configurations**メニュー項目を選択します。
2.  プラスボタンをクリックし、ドロップダウンリストから**Gradle**を選択します。
3.  **Tasks and arguments**フィールドに、次のコマンドを貼り付けます。

   ```shell
   wasmJsBrowserDistribution
   ```

4.  **OK**をクリックします。

これで、この構成を使用してタスクを実行できます。

![Run the Wasm distribution task](compose-run-wasm-distribution-task.png){width=350}

タスクが完了すると、生成された成果物は`composeApp/build/dist/wasmJs/productionExecutable`ディレクトリにあります。

![Artifacts directory](compose-web-artifacts.png){width=400}

### GitHub Pagesでアプリケーションを公開する

成果物が準備できたら、Webホスティングプラットフォームにアプリケーションをデプロイできます。

1.  `productionExecutable`ディレクトリの内容を、サイトを作成したいリポジトリにコピーします。
2.  [サイトの作成](https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site#creating-your-site)に関するGitHubの手順に従います。

   > GitHubに変更をプッシュした後、サイトの変更が公開されるまでに最大10分かかる場合があります。
   >
   {style="note"}

3.  ブラウザで、GitHub Pagesドメインに移動します。

   ![Navigate to GitHub pages](publish-your-application-on-web.png){width=650}

おめでとうございます！GitHub Pagesに成果物を公開しました。

### Webアプリケーションのデバッグ

Webアプリケーションは、追加の設定なしでブラウザでそのままデバッグできます。ブラウザでのデバッグ方法については、Kotlinドキュメントの[ブラウザでのデバッグ](https://kotlinlang.org/docs/wasm-debugging.html#debug-in-your-browser)ガイドを参照してください。