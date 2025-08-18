[//]: # (title: 安全性)

我們盡力確保我們的產品沒有安全性漏洞。為降低引入漏洞的風險，您可以遵循以下最佳實踐：

*   始終使用最新的 Kotlin 版本。為安全目的，我們使用以下 PGP 金鑰簽署發佈在 [Maven Central](https://central.sonatype.com/search?q=g:org.jetbrains.kotlin) 上的發行版本：

    *   金鑰 ID: **kt-a@jetbrains.com**
    *   指紋: **2FBA 29D0 8D2E 25EE 84C1 32C3 0729 A0AF F899 9A87**
    *   金鑰大小: **RSA 3072**

*   使用應用程式依賴項的最新版本。如果您需要使用特定版本的依賴項，請定期檢查是否發現任何新的安全性漏洞。您可以遵循 [GitHub 的指南](https://docs.github.com/en/code-security) 或在 [CVE 資料庫](https://cve.mitre.org/cgi-bin/cvekey.cgi?keyword=kotlin) 中瀏覽已知漏洞。

我們非常渴望並感激您能告知任何發現的安全性問題。若要報告您在 Kotlin 中發現的漏洞，請直接向我們的 [問題追蹤器](https://youtrack.jetbrains.com/newIssue?project=KT&c=Type%20Security%20Problem) 發佈訊息，或傳送電子郵件給我們 ([security@jetbrains.org](mailto:security@jetbrains.org))。

有關我們負責任的披露程序如何運作的更多資訊，請查看 [JetBrains 協調披露政策](https://www.jetbrains.com/legal/docs/terms/coordinated-disclosure/)。