[//]: # (title: セキュリティ)

私たちの製品にセキュリティ上の脆弱性がないよう、最善を尽くしています。脆弱性をもたらすリスクを減らすために、以下のベストプラクティスに従うことができます。

*   最新のKotlinリリースを常に使用してください。セキュリティ目的のため、[Maven Central](https://central.sonatype.com/search?q=g:org.jetbrains.kotlin) で公開されているリリースは、以下のPGPキーで署名されています。

    *   Key ID: **kt-a@jetbrains.com**
    *   Fingerprint: **2FBA 29D0 8D2E 25EE 84C1 32C3 0729 A0AF F899 9A87**
    *   Key size: **RSA 3072**

*   アプリケーションの依存関係の最新バージョンを使用してください。特定の依存関係のバージョンを使用する必要がある場合は、新しいセキュリティ脆弱性が発見されていないか定期的に確認してください。[GitHubのガイドライン](https://docs.github.com/en/code-security) に従うか、[CVEベース](https://cve.mitre.org/cgi-bin/cvekey.cgi?keyword=kotlin) で既知の脆弱性を参照できます。

皆様が見つけたセキュリティ上の問題について、ぜひお知らせください。心より感謝いたします。Kotlinで発見した脆弱性を報告するには、当社の[イシュートラッカー](https://youtrack.jetbrains.com/newIssue?project=KT&c=Type%20Security%20Problem) に直接メッセージを投稿するか、[メール](mailto:security@jetbrains.org) を送信してください。

当社の責任ある開示プロセスがどのように機能するかについての詳細は、[JetBrains Coordinated Disclosure Policy](https://www.jetbrains.com/legal/docs/terms/coordinated-disclosure/) をご確認ください。