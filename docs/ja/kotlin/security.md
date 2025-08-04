[//]: # (title: セキュリティ)

当社は、製品にセキュリティ脆弱性がないことを確認するために最善を尽くしています。脆弱性が混入するリスクを軽減するために、以下のベストプラクティスに従ってください。

*   最新のKotlinリリースを常に使用してください。セキュリティ上の理由から、[Maven Central](https://central.sonatype.com/search?q=g:org.jetbrains.kotlin)で公開されている当社のリリースには、以下のPGPキーで署名しています。

    *   キーID: **kt-a@jetbrains.com**
    *   フィンガープリント: **2FBA 29D0 8D2E 25EE 84C1 32C3 0729 A0AF F899 9A87**
    *   キーサイズ: **RSA 3072**

*   アプリケーションの依存関係は最新バージョンを使用してください。特定のバージョンの依存関係を使用する必要がある場合は、新しいセキュリティ脆弱性が発見されていないか定期的に確認してください。[GitHubのガイドライン](https://docs.github.com/en/code-security)に従うか、[CVEデータベース](https://cve.mitre.org/cgi-bin/cvekey.cgi?keyword=kotlin)で既知の脆弱性を閲覧できます。

発見されたセキュリティ問題については、喜んでご報告をお待ちしております。Kotlinで発見した脆弱性を報告するには、弊社の[課題トラッカー](https://youtrack.jetbrains.com/newIssue?project=KT&c=Type%20Security%20Problem)に直接メッセージを投稿するか、[メール](mailto:security@jetbrains.org)を送信してください。

弊社の責任ある開示プロセスの詳細については、[JetBrainsの調整済み開示ポリシー](https://www.jetbrains.com/legal/docs/terms/coordinated-disclosure/)をご確認ください。