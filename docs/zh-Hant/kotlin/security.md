[//]: # (title: 安全性)

我們盡最大努力確保我們的產品沒有資安漏洞。為了降低引入漏洞的風險，您可以遵循以下最佳實務： 

* 請始終使用最新的 Kotlin 版本。出於安全性考慮，我們在 [Maven Central](https://central.sonatype.com/search?q=g:org.jetbrains.kotlin) 上發布的版本均使用以下 PGP 金鑰進行簽名：

  * 金鑰 ID：**kt-a@jetbrains.com**
  * 指紋：**2FBA 29D0 8D2E 25EE 84C1 32C3 0729 A0AF F899 9A87**
  * 金鑰大小：**RSA 3072**

* 請使用應用程式相依性的最新版本。如果您需要使用特定版本的相依性，請定期檢查是否發現了任何新的資安漏洞。您可以遵循 [GitHub 的指引](https://docs.github.com/en/code-security)，或在 [CVE 庫](https://cve.mitre.org/cgi-bin/cvekey.cgi?keyword=kotlin) 中瀏覽已知的漏洞。

從 Kotlin 2.4.0 開始，針對 JVM 的 Kotlin 標準函式庫為每個版本線提供為期 18 個月的支援期。語言版本 (2._x_._0_) 和隨後的工具版本 (2._x_._20_) 屬於同一個版本線 (2._x_)。若要了解更多關於我們如何處理 JVM 標準函式庫中的資安漏洞，請參閱[標準函式庫安全性支援](releases.md#standard-library-security-support)。

我們始終渴望聽取您發現的任何安全性問題。若要回報您在 Kotlin 中發現的漏洞，請直接在我們的[問題追蹤器](https://youtrack.jetbrains.com/newIssue?project=KT&c=Type%20Security%20Problem)發布訊息或向我們發送[電子郵件](mailto:security@jetbrains.org)。 

有關我們負責的回報流程如何運作的更多資訊，請參閱 [JetBrains 協調披露政策](https://www.jetbrains.com/legal/docs/terms/coordinated-disclosure/)。