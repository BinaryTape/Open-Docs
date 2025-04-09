---
title: 安全性
---
我們會盡最大努力確保我們的產品沒有安全漏洞。為了降低引入漏洞的風險，您可以遵循以下最佳實務：

* 始終使用最新的 Kotlin 版本。 出於安全目的，我們會使用以下 PGP 金鑰簽署我們在 [Maven Central](https://central.sonatype.com/search?q=g:org.jetbrains.kotlin) 上發布的版本：

  * 金鑰 ID：**kt-a@jetbrains.com**
  * 指紋：**2FBA 29D0 8D2E 25EE 84C1 32C3 0729 A0AF F899 9A87**
  * 金鑰大小：**RSA 3072**

* 使用應用程式依賴項的最新版本。 如果您需要使用特定版本的依賴項，請定期檢查是否發現任何新的安全漏洞。 您可以遵循 [GitHub 的指南](https://docs.github.com/en/code-security) 或在 [CVE 數據庫](https://cve.mitre.org/cgi-bin/cvekey.cgi?keyword=kotlin) 中瀏覽已知的漏洞。

我們非常渴望並感謝您告知我們發現的任何安全問題。 若要報告您在 Kotlin 中發現的漏洞，請直接在我們的 [issue tracker](https://youtrack.jetbrains.com/newIssue?project=KT&c=Type%20Security%20Problem) 上發布訊息，或發送 [電子郵件](mailto:security@jetbrains.org) 給我們。

有關我們負責的披露流程如何運作的更多資訊，請查看 [JetBrains Coordinated Disclosure Policy](https://www.jetbrains.com/legal/docs/terms/coordinated-disclosure/)。