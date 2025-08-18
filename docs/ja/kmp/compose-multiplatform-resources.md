[//]: # (title: リソースの概要)

Compose Multiplatformは、`compose-multiplatform-resources`という特別なライブラリとGradleプラグインのサポートを提供し、すべてのサポートされているプラットフォームの共通コードでリソースにアクセスできるようにします。リソースとは、画像、フォント、文字列など、アプリケーションで使用できる静的なコンテンツです。

Compose Multiplatformでリソースを扱う際は、現在の状況を考慮してください：

*   ほとんどすべてのリソースは呼び出し元のスレッドで同期的に読み込まれます。唯一の例外は、非同期で読み込まれる生ファイルとWebリソースです。
*   長い動画のような大容量の生ファイルをストリームとして読み込むことは、まだサポートされていません。
    例えば、[`kotlinx-io`](https://github.com/Kotlin/kotlinx-io)ライブラリのようなシステムAPIに個別のファイルを渡すには、[`getUri()`](compose-multiplatform-resources-usage.md#accessing-multiplatform-resources-from-external-libraries)関数を使用してください。
*   1.6.10以降、Kotlin 2.0.0以降およびGradle 7.6以降を使用している限り、リソースを任意のモジュールまたはソースセットに配置できます。

Compose Multiplatformでリソースを扱う方法を学ぶには、以下の主要なセクションを参照してください：

*   [マルチプラットフォームリソースのセットアップと構成](compose-multiplatform-resources-setup.md)

    `resources` ライブラリの依存関係を追加し、アプリがアクセスできるすべてのリソースを設定します。

*   [アプリでマルチプラットフォームリソースを使用する](compose-multiplatform-resources-usage.md)

    自動生成されたアクセサーを使用して、UIコードで直接リソースにアクセスする方法を学びます。

*   [ローカルリソース環境](compose-resource-environment.md)

    アプリ内テーマや言語など、アプリのリソース環境を管理します。