---
title: セキュリティ
---
セキュリティ脆弱性のない製品を提供できるよう、最善を尽くしています。脆弱性の発生リスクを低減するために、以下のベストプラクティスに従ってください。

* 常に最新の Kotlin リリースを使用してください。セキュリティ上の理由から、[Maven Central](https://central.sonatype.com/search?q=g:org.jetbrains.kotlin) に公開されているリリースは、以下の PGP キーで署名されています。

  * Key ID: **kt-a@jetbrains.com**
  * Fingerprint: **2FBA 29D0 8D2E 25EE 84C1 32C3 0729 A0AF F899 9A87**
  * Key size: **RSA 3072**

* アプリケーションの依存関係の最新バージョンを使用してください。特定のバージョンの依存関係を使用する必要がある場合は、新しいセキュリティ脆弱性が発見されていないか定期的に確認してください。[GitHub のガイドライン](https://docs.github.com/en/code-security) に従うか、[CVE base](https://cve.mitre.org/cgi-bin/cvekey.cgi?keyword=kotlin) で既知の脆弱性を参照してください。

Kotlin で発見したセキュリティ問題について、ぜひお知らせください。Kotlin で発見した脆弱性を報告するには、[issue tracker](https://youtrack.jetbrains.com/newIssue?project=KT&c=Type%20Security%20Problem) に直接メッセージを投稿するか、[email](mailto:security@jetbrains.org) を送信してください。

責任ある情報開示プロセスの詳細については、[JetBrains Coordinated Disclosure Policy](https://www.jetbrains.com/legal/docs/terms/coordinated-disclosure/) を確認してください。