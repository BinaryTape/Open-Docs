[//]: # (title: リソースの概要)

Compose Multiplatformは、特別な`compose-multiplatform-resources`ライブラリとGradleプラグインのサポートを提供し、サポートされているすべてのプラットフォームの共通コードでリソースにアクセスできます。リソースとは、画像、フォント、文字列など、アプリケーションで使用できる静的コンテンツのことです。

Compose Multiplatformでリソースを操作する際は、以下の現在の条件を考慮してください。

*   ほとんどのリソースは、呼び出し元のスレッドで同期的に読み込まれます。唯一の例外は、非同期で読み込まれる生ファイルとウェブリソースです。
*   長い動画のような大きな生ファイルをストリームとして読み込むことは、まだサポートされていません。[`getUri()`](compose-multiplatform-resources-usage.md#accessing-multiplatform-resources-from-external-libraries)関数を使用して、個別のファイルをシステムAPI（例：[kotlinx-io](https://github.com/Kotlin/kotlinx-io)ライブラリ）に渡してください。
*   1.6.10以降、Kotlin 2.0.0以降およびGradle 7.6以降を使用している限り、リソースを任意のモジュールまたはソースセットに配置できます。

Compose Multiplatformでリソースを操作する方法を学ぶには、以下の主要なセクションを参照してください。

*   [](compose-multiplatform-resources-setup.md)

    `resources`ライブラリの依存関係を追加し、アプリがアクセスできるすべてのリソースを設定します。

*   [](compose-multiplatform-resources-usage.md)

    自動生成されたアクセサーを使用して、UIコードでリソースに直接アクセスする方法を学びます。

*   [ローカルリソース環境](compose-resource-environment.md)

    アプリのアプリ内テーマや言語などのリソース環境を管理します。