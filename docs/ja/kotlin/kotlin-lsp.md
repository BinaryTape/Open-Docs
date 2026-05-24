[//]: # (title: Kotlin Language Server)
<primary-label ref="alpha"/>

<web-summary>Kotlin Language Server は JetBrains による公式の Kotlin 用 LSP 実装であり、VS Code のサポート、コード補完、診断、フォーマット、リファクタリングを提供します。</web-summary>

[Kotlin Language Server](https://github.com/Kotlin/kotlin-lsp) は、JetBrains による Kotlin 用の [Language Server Protocol (LSP)](https://microsoft.github.io/language-server-protocol/) の公式実装です。

このサーバーは IntelliJ IDEA、IntelliJ IDEA Kotlin プラグイン、JetBrains AIR、および Fleet に基づいています。LSP をサポートするあらゆるコードエディタで動作するように設計されています。

> [IntelliJ IDEA](https://www.jetbrains.com/idea/) と [Android Studio](https://developer.android.com/studio) は、最高の Kotlin 開発体験を提供します。
>
{style="note"}

## Visual Studio Code での Kotlin

Kotlin Language Server は、[Visual Studio Code](https://code.visualstudio.com/) 向けに公式の Kotlin 言語サポートを提供します。

Kotlin の開発に Visual Studio Code を使用する場合は、Visual Studio Marketplace から公式の [Kotlin by JetBrains](https://marketplace.visualstudio.com/items?itemName=JetBrains.kotlin-server) 拡張機能をインストールしてください。

**Kotlin by JetBrains** 拡張機能を有効にするには、Visual Studio Code で Kotlin プロジェクトを開き、任意の Kotlin ファイルを開いてください。

## サポートされている機能

Kotlin Language Server には、以下のような主要な言語機能が含まれています。

* 最新の Kotlin 言語バージョンのサポート
* IntelliJ を活用したコード補完 (Code completion)
* Kotlin および `kotlinx.*` ライブラリに対する、IntelliJ を活用した診断 (Diagnostics) とクイックフィックス (Quick fixes)
* JVM プロジェクトのビルドシステムのサポート: Gradle、Maven、および実験的な Android Gradle Plugin のサポート

  > Kotlin Multiplatform プロジェクトのサポートは開発中です。
  >
  {style=”tip”}

* セマンティックハイライト (Semantic highlighting)
* インポートの整理 (Organize imports)
* 名前変更のリファクタリング (Rename refactoring)
* コードのフォーマット
* ドキュメントのナビゲーションとホバーのサポート
* 呼び出し階層 (Call hierarchy)
* コードの折りたたみ (Code folding)

## フィードバック

Kotlin Language Server は活発に開発中であり、特にアルファ (Alpha) 段階ではフィードバックが非常に貴重です。

問題が発生した場合や改善を提案したい場合は、[Kotlin LSP リポジトリ](https://github.com/Kotlin/kotlin-lsp)に報告してください。

## 次のステップ

* [GitHub の Kotlin Language Server リポジトリ](https://github.com/Kotlin/kotlin-lsp)を探索する