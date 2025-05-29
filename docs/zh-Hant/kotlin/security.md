[//]: # (title: 安全)

我們盡力確保產品沒有安全漏洞。為了降低引入漏洞的風險，您可以遵循以下最佳實踐：

*   始終使用最新 Kotlin 版本。出於安全考量，我們使用以下 PGP 金鑰簽署發佈於 [Maven Central](https://central.sonatype.com/search?q=g:org.jetbrains.kotlin) 的發行版：

    *   金鑰 ID: **kt-a@jetbrains.com**
    *   指紋: **2FBA 29D0 8D2E 25EE 84C1 32C3 0729 A0AF F899 9A87**
    *   金鑰大小: **RSA 3072**

*   使用應用程式依賴項的最新版本。如果您需要使用特定版本的依賴項，請定期檢查是否有新的安全漏洞被發現。您可以遵循 [GitHub 的指南](https://docs.github.com/en/code-security) 或瀏覽 [CVE 資料庫](https://cve.mitre.org/cgi-bin/cvekey.cgi?keyword=kotlin) 中的已知漏洞。

我們非常樂意且感謝您回報任何發現的安全問題。若要回報您在 Kotlin 中發現的漏洞，請直接在我們的 [問題追蹤器](https://youtrack.jetbrains.com/newIssue?project=KT&c=Type%20Security%20Problem) 中發佈訊息，或傳送 [電子郵件](mailto:security@jetbrains.org) 給我們。

有關我們負責任的揭露流程運作方式的更多資訊，請查閱 [JetBrains 協調揭露政策](https://www.jetbrains.com/legal/docs/terms/coordinated-disclosure/)。