[//]: # (title: セキュリティ)

私たちは、製品にセキュリティ脆弱性が含まれないよう最善を尽くしています。脆弱性が混入するリスクを軽減するために、以下のベストプラクティスに従うことができます。

* 常に最新の Kotlin リリースを使用してください。セキュリティ上の目的から、[Maven Central](https://central.sonatype.com/search?q=g:org.jetbrains.kotlin) で公開されているリリースには以下の PGP キーで署名を行っています。

  * キー ID: **kt-a@jetbrains.com**
  * フィンガープリント: **2FBA 29D0 8D2E 25EE 84C1 32C3 0729 A0AF F899 9A87**
  * キーサイズ: **RSA 3072**

* アプリケーションの依存関係には最新バージョンを使用してください。特定のバージョンの依存関係を使用する必要がある場合は、新しいセキュリティ脆弱性が発見されていないか定期的に確認してください。[GitHub のガイドライン](https://docs.github.com/en/code-security)に従うか、[CVE ベース](https://cve.mitre.org/cgi-bin/cvekey.cgi?keyword=kotlin)で既知の脆弱性を確認できます。

私たちは、皆様が発見されたセキュリティ上の問題についてのご報告を歓迎し、感謝いたします。Kotlin で発見した脆弱性を報告するには、弊社の[イシュートラッカー](https://youtrack.jetbrains.com/newIssue?project=KT&c=Type%20Security%20Problem)に直接メッセージを投稿するか、[メール](mailto:security@jetbrains.org)を送信してください。

弊社の責任ある開示（responsible disclosure）プロセスがどのように機能するかについての詳細は、[JetBrains の調整された開示ポリシー（JetBrains Coordinated Disclosure Policy）](https://www.jetbrains.com/legal/docs/terms/coordinated-disclosure/)をご確認ください。